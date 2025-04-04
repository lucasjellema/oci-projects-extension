# OCI Projects Extension

[Read the detailed article about this extension on Medium](https://lucasjellema.medium.com/oracle-cloud-projects-browser-extension-f76daa888354)

## Functional Overview

The OCI Projects Extension is a browser extension for Chromium-based browsers (Google Chrome, Microsoft Edge, Brave) that enhances the Oracle Cloud Infrastructure (OCI) console experience by allowing users to organize and manage OCI resources in a project-based structure. 

### Key Features

1. **Resource Organization**: Organize OCI resources into customizable project hierarchies
2. **Resource Capture**: Easily capture resource details from the OCI Console with a right-click
3. **Resource Navigation**: Quickly access resources by double-clicking on them in the project tree
4. **Resource Properties**: View detailed properties of resources with a single click
5. **Drag and Drop Management**: Reorganize resources by dragging and dropping them between projects
6. **Persistent Storage**: All project data is saved to browser local storage, persisting across sessions
7. **Multi-Project Support**: Add the same resource to multiple projects as needed

### Use Cases

- **Resource Management**: Organize resources across different compartments into logical projects
- **Project Documentation**: Document and track resources used in specific projects or initiatives
- **Quick Access**: Create shortcuts to frequently accessed resources
- **Team Collaboration**: Share project organization with team members (by exporting/importing project data)

## Installation

1. Clone the Git repository
2. Open your Chromium browser (Google Chrome, Microsoft Edge, Brave Browser)
3. Open the *Manage Extensions* page
4. Make sure the *Developer Mode* is activated
5. Click on the button *Load Unpacked*
6. Select the directory on your local file system that contains the file `manifest.json`
7. The extension should be loaded into your browser and added to the list of extensions

## Usage

1. **Open the Side Panel**: Click on the extension icon to open the side panel
2. **Create a Project**: Right-click on the "OCI Projects" root node and select "Create Child Project"
3. **Add Resources**: Navigate to an OCI resource in the Oracle Cloud Console, right-click on the page, and select "Add OCI Details to OCI Projects extension"
4. **View Resource Details**: Click on a resource in the tree to view its properties
5. **Access Resource**: Double-click on a resource to open it in the OCI Console
6. **Organize Resources**: Drag and drop resources between projects
7. **Delete Resources**: Right-click on a resource and select "Delete"

## Benefits

- **Improved Organization**: Organize resources beyond the compartment structure in OCI
- **Enhanced Productivity**: Quickly access and manage resources across different services
- **Better Documentation**: Keep track of resources used in specific projects
- **Simplified Navigation**: Navigate between related resources without searching through the OCI Console
