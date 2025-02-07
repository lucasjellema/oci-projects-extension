# Chrome Extension - OCI Projects Extension

This Chrome Extension adds a menu item to the context menu in case the menu is opened in the context of the Oracle Cloud console. When the menu item is activated, the properties of the OCI resource are captured from the DOM in the current document and communicated to the Side Panel. The Side Panel contains a tree navigator with Project nodes that contain OCI resources (and possibly child projects). When details for an OCI Resource are communicated to the side panel, a new node is created under the currently selected node (typically but not necessarily a project node)

Double click on a tree node of type OCI Resource will open the Oracle Cloud Console for that resources.
A single click on a tree node will bring up the property palette with the captured properties for the resource.
Nodes can be dragged an dropped in tree, allowing the user to assign OCI resource to a different project. An OCI Resource can be added to multiple projects; simply add the node from the OCI Console from context menu with the target project selected in the side panel's tree.
Nodes can be removed using the delete option in the tree node's context menu.

## Implementation details

The following mechanisms are at play:
* define permissions for contextMenus, sidePanel, activeTab and scripting in manifest.json - in the context of https://cloud.oracle.com
* define the context menu item in `background.js`
  * define the action to take when the item is cLicked: send message (to oci-content.js), ask for OCI Resouerce details, send response as message (to side_panel.js); the asynchronous single message-response is used with the active tab (where oci-content.js listens for the message)
* in `oci-content.js`: when a message of type *ociInfoRequest* go find OCI Resource details and a response message is sent (to `background.js`)
* the message is received in `background.js`. From it, a new message of type *ociInfo* is created and sent (to `oci-projects-side_panel.js`)
* in `oci-projects-side_panel.js` - the message is received and its contents is added to the tree data collection
* every 5 seconds if there are have been changes to the tree data, it is saved to the browser local storage

## Installation

* Clone the Git repository
* Open your Chromium browser - Google Chrome, Microsoft Edge, Brave Browser
* Open the *Manage Extensions* page
* Make sure the *Developer Mode* is activated
* Click on the button *Load Unpacked*
* Select the directory on your local file system that contains the file `manifest.json`, part of the cloned repository
* The extension should be loaded into your browser and it should be added to the list of extensions
* You can now open the extension's side panel page from the  