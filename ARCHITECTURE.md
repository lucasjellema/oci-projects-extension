# OCI Projects Extension - Architecture Document

## Technical Overview

The OCI Projects Extension is a Chrome browser extension built using the Chrome Extension Manifest V3 framework. It consists of several components that work together to capture, organize, and display OCI resources in a project-based structure.

## Components

### 1. Background Service Worker (`background.js`)
- **Purpose**: Manages the extension's lifecycle and handles communication between the content script and side panel
- **Key Functions**:
  - Creates the context menu item in the OCI Console
  - Handles context menu click events
  - Facilitates message passing between the content script and side panel

### 2. Content Script (`oci-content.js`)
- **Purpose**: Extracts OCI resource information from the active OCI Console page
- **Key Functions**:
  - Listens for messages from the background service worker
  - Parses the DOM to extract resource details (OCID, name, type, compartment, etc.)
  - Identifies references to other OCI resources on the page
  - Sends the extracted information back to the background service worker

### 3. Side Panel (`oci_projects_side_panel.html`, `side_panel.js`)
- **Purpose**: Displays and manages the project tree and resource properties
- **Key Functions**:
  - Renders the tree view of projects and resources
  - Handles user interactions (click, double-click, drag-and-drop)
  - Shows resource properties when a resource is selected
  - Manages context menu actions (delete, create child project)
  - Periodically saves changes to browser local storage

### 4. OCI Profile Processor (`processOciProfile.js`)
- **Purpose**: Transforms raw OCI resource data into a structured node for the project tree
- **Key Functions**:
  - Creates a new node with a unique ID
  - Formats the node name and properties
  - Assigns appropriate icons based on resource type

### 5. Utility Functions (`utils.js`)
- **Purpose**: Provides common utility functions used across the extension
- **Key Functions**:
  - Generates unique IDs for nodes
  - Saves and retrieves project data from browser local storage

### 6. Property Panel (`property-panel.js`)
- **Purpose**: Displays detailed properties of selected resources
- **Key Functions**:
  - Renders property information in a user-friendly format
  - Provides controls to close the panel

## Data Flow

1. **Resource Capture**:
   - User right-clicks on an OCI resource page and selects the extension's context menu item
   - Background service worker sends a message to the content script
   - Content script extracts resource information from the page
   - Content script sends the information back to the background service worker
   - Background service worker forwards the information to the side panel
   - Side panel processes the information and adds it to the project tree

2. **Resource Management**:
   - User interacts with the project tree in the side panel
   - Side panel updates the tree structure based on user actions
   - Changes are periodically saved to browser local storage

3. **Resource Navigation**:
   - User double-clicks on a resource in the project tree
   - Side panel opens the resource in the OCI Console

## Key Code Implementations

### 1. Context Menu Creation (background.js)
```javascript
chrome.runtime.onInstalled.addListener(() => {  
  chrome.contextMenus.create({
    id: "ociInfoForNetwork",
    title: "Add OCI Details to OCI Projects extension",
    contexts: ["page"],
    documentUrlPatterns: ["*://cloud.oracle.com/*"]
  });
});
```

### 2. Context Menu Click Handling (background.js)
```javascript
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "ociInfoForNetwork") {
    await handleOCIInfo(info, tab);
  }
});

async function handleOCIInfo(info, tab) {
  (async () => {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, { type: 'ociInfoRequest' });
    chrome.runtime.sendMessage({
      type: 'ociProfile',
      profile: response.data,
      ociUrl: response.ociUrl
    });
  })()
}
```

### 3. Content Script Resource Extraction (oci-content.js)
```javascript
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ociInfoRequest') {
    let profile = getProfile()
    profile.type = 'ociResource'
    sendResponse({ status: 'success', data: profile, ociUrl: window.location.href });
  }
});

const getProfile = () => {
  const profile = {}
  getResourceType(profile)
  return profile
}
```

### 4. Side Panel Message Handling (side_panel.js)
```javascript
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ociProfile') {
    let parentNode = selectedNode
    if (!parentNode) {
      alert('Please select the target node in the OCI Project Tree Navigator and try again')
      return;
    }
    const ociNode = processOciProfile(message);
    if (!parentNode.children) parentNode.children = [];
    parentNode.children.push(ociNode)
    changed = true
    expandedNodes.add(parentNode.id);
    refreshTree();
  }
});
```

### 5. Periodic Storage of Changes (side_panel.js)
```javascript
let changed = false;

setInterval(() => {
  if (changed) {
    changed = false
    saveProjects(data);
  }
}, 5000); // check every 5 seconds for a change
```

### 6. Local Storage Management (utils.js)
```javascript
const STORAGE_KEY = 'oci-projects';   // LocalStorage key for the projects data

// Get all saved graphs from local storage
export function getSavedProjects() {
    const projects = localStorage.getItem(STORAGE_KEY);
    return projects ? JSON.parse(projects) : [];
}

// Save projects to local storage
export function saveProjects(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
```

## Data Structure

```javascript
// Example of the project tree data structure
[
  {
    id: "0",
    name: "OCI Projects",
    type: "root",
    children: [
      {
        id: "project-123",
        name: "My Project",
        type: "project",
        children: [
          {
            id: "resource-456",
            name: "compartment my-compartment",
            type: "ociResource",
            subtype: "compartment",
            ocid: "ocid1.compartment.oc1..aaaaaaaa...",
            url: "https://cloud.oracle.com/...",
            ociService: "Identity",
            compartment: "Root Compartment",
            notes: ""
          }
        ]
      }
    ]
  }
]
```

## Storage

The extension uses Chrome's `localStorage` API to persist the project tree data across browser sessions. The data is saved automatically every 5 seconds when changes are detected.

## Security Considerations

- The extension only operates within the context of the OCI Console (https://cloud.oracle.com/*)
- No data is sent to external servers; all data is stored locally in the browser
- The extension requires minimal permissions: contextMenus, activeTab, scripting, and sidePanel

## Handling iframes in the OCI Console

The Oracle Cloud Infrastructure (OCI) Console uses iframes extensively in its architecture to load and display resource details. This presents a unique challenge for the extension when extracting resource information.

### Why iframes are important

1. **OCI Console Structure**: The OCI Console loads resource details pages within iframes, separating the navigation framework from the actual resource content.

2. **Content Isolation**: Critical resource information such as OCIDs, resource names, compartment details, and references to other resources are contained within these iframes rather than in the main document.

3. **Dynamic Content Loading**: The iframes allow OCI to dynamically load different resource views without reloading the entire page.

### How the extension handles iframes

1. **iframe Detection**: When the content script (`oci-content.js`) is triggered by a context menu click, it searches for all iframes in the current document:
   ```javascript
   let iframes = document.querySelectorAll("iframe");
   ```

2. **Content Access**: For each iframe, the extension attempts to access its document content:
   ```javascript
   let iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
   ```

3. **Element Extraction**: The extension then searches within each iframe for specific elements that contain resource information:
   - Breadcrumb navigation to determine resource type and service
   - Copy actions that contain OCIDs
   - Resource names from heading elements
   - Compartment information
   - References to other OCI resources

4. **Cross-Origin Handling**: The extension includes error handling for cases where iframes might be cross-origin and cannot be accessed due to browser security restrictions:
   ```javascript
   try {
     // iframe content access and processing
   } catch (error) {
     // Handle security errors for cross-origin frames
   }
   ```

This approach allows the extension to extract comprehensive resource information regardless of how the OCI Console structures its pages, ensuring reliable data capture across different resource types and console views.

## Component Interaction Diagram

```
┌───────────────────┐      ┌───────────────────┐      ┌───────────────────┐
│                   │      │                   │      │                   │
│  OCI Console Page │◄────►│  Content Script   │◄────►│ Background Script │
│                   │      │  (oci-content.js) │      │ (background.js)   │
│                   │      │                   │      │                   │
└───────────────────┘      └───────────────────┘      └─────────┬─────────┘
                                                                │
                                                                │
                                                                ▼
┌───────────────────┐      ┌───────────────────┐      ┌───────────────────┐
│                   │      │                   │      │                   │
│   Property Panel  │◄────►│    Side Panel     │◄────►│  OCI Profile      │
│ (property-panel.js)│     │  (side_panel.js)  │      │  Processor        │
│                   │      │                   │      │(processOciProfile.js)
└───────────────────┘      └───────────────────┘      └───────────────────┘
                                     │
                                     │
                                     ▼
                           ┌───────────────────┐
                           │                   │
                           │  Browser Storage  │
                           │  (localStorage)   │
                           │                   │
                           └───────────────────┘
```

## Extension Lifecycle

1. **Installation**: Extension is installed and registered with the browser
2. **Initialization**: Background service worker is loaded and context menu is created
3. **Activation**: User navigates to the OCI Console and the content script is injected
4. **Usage**: User interacts with the extension through the context menu and side panel
5. **Storage**: Project data is saved to browser local storage
6. **Persistence**: Data is loaded from storage when the extension is reopened

## Future Enhancements

1. **Export/Import**: Add functionality to export and import project data
2. **Search**: Implement search functionality to quickly find resources
3. **Tagging**: Allow users to add custom tags to resources
4. **Filtering**: Add ability to filter resources by type, compartment, etc.
5. **Resource Groups**: Support for grouping related resources together
6. **Notifications**: Alert users when resources are modified or deleted
7. **Cloud Events Integration**: Capture and display OCI events related to resources
