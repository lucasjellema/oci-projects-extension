# OCI Projects Extension - Component Diagram

## Visual Component Architecture

```mermaid
graph TD
    subgraph "Browser"
        subgraph "OCI Console Tab"
            OCI[OCI Console Page]
            CS[Content Script<br/>oci-content.js]
        end
        
        subgraph "Extension"
            BG[Background Service<br/>background.js]
            SP[Side Panel<br/>side_panel.js]
            PP[Property Panel<br/>property-panel.js]
            OP[OCI Profile Processor<br/>processOciProfile.js]
            UT[Utilities<br/>utils.js]
        end
        
        subgraph "Storage"
            LS[Local Storage]
        end
    end
    
    %% Interactions
    OCI -- "DOM Access" --> CS
    CS -- "1. Send resource info" --> BG
    BG -- "2. Request resource info" --> CS
    BG -- "3. Forward resource info" --> SP
    SP -- "4. Process resource" --> OP
    OP -- "5. Return formatted node" --> SP
    SP -- "6. Display properties" --> PP
    SP -- "7. Save/Load data" --> UT
    UT -- "8. Persist/Retrieve" --> LS
    
    %% Styling
    classDef console fill:#f9f,stroke:#333,stroke-width:2px;
    classDef extension fill:#bbf,stroke:#333,stroke-width:2px;
    classDef storage fill:#bfb,stroke:#333,stroke-width:2px;
    
    class OCI,CS console;
    class BG,SP,PP,OP,UT extension;
    class LS storage;
```

## User Interaction Flow

```mermaid
sequenceDiagram
    actor User
    participant OCI as OCI Console
    participant CS as Content Script
    participant BG as Background Service
    participant SP as Side Panel
    participant LS as Local Storage
    
    User->>OCI: Navigate to resource page
    User->>OCI: Right-click, select "Add to OCI Projects"
    OCI->>CS: Context menu event
    CS->>OCI: Extract resource details
    CS->>BG: Send resource info
    BG->>SP: Forward resource info
    SP->>SP: Add to project tree
    SP->>LS: Save project data
    
    User->>SP: Click on resource
    SP->>SP: Display properties
    
    User->>SP: Double-click on resource
    SP->>OCI: Open resource in console
    
    User->>SP: Drag & drop resource
    SP->>SP: Reorganize tree
    SP->>LS: Save project data
```

## Data Flow Diagram

```mermaid
flowchart LR
    subgraph Input
        OCI[OCI Console]
    end
    
    subgraph Processing
        CS[Content Script]
        BG[Background Service]
        OP[OCI Profile Processor]
        SP[Side Panel]
    end
    
    subgraph Output
        PP[Property Panel]
        Tree[Project Tree]
        LS[Local Storage]
    end
    
    OCI --> CS
    CS --> BG
    BG --> OP
    OP --> SP
    SP --> PP
    SP --> Tree
    SP --> LS
    LS --> SP
```

## Component Responsibilities

| Component | Primary Responsibility | Secondary Responsibility |
|-----------|------------------------|--------------------------|
| Background Service | Context menu management | Message routing |
| Content Script | Resource data extraction | DOM parsing |
| Side Panel | Tree visualization | User interaction handling |
| Property Panel | Property display | - |
| OCI Profile Processor | Data transformation | Resource type mapping |
| Utilities | Storage management | GUID generation |

## Extension Permissions

| Permission | Purpose |
|------------|---------|
| contextMenus | Create and manage right-click menu items |
| activeTab | Access the current tab's content |
| scripting | Execute scripts in the context of web pages |
| sidePanel | Display the project tree in a side panel |
