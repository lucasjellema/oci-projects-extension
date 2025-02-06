const panel = document.getElementById("property-panel");
const panelHeader = document.getElementById("property-panel-header")


document.addEventListener("click", (event) => {
    if (!panel.contains(event.target) && !event.target.classList.contains("node-label")) {
        hidePropertyPanel();
    }
});

export function showPropertyPanel(node) {
    const panelContent = document.getElementById("property-content");
    if (node.type == 'project') {
        panelHeader.innerText = node.name
        panelContent.innerHTML = `
  <p><strong>ID:</strong> ${node.id}</p>
  <p><strong>Type:</strong> ${node.type || "Unknown"}</p>
`
    }
    else if (node.type == 'ociResource') {
        panelHeader.innerText = node.name
        panelContent.innerHTML = `
    <p><strong>OCI Resource Type:</strong> ${node.subtype || "Unknown"}</p>
    <p><a href="${node.url}" target="_new">Open OCI Console for ${node.subtype}</a></p>
    <p><strong>OCID:</strong> ${node.id}</p>
    <p><strong>OCI Service:</strong> ${node.ociService || "Unknown"}</p>
  `;
        if (node.image) {
            panelContent.innerHTML += `<img src="${node.image}" />`
        }
    }
    else {
        panelContent.innerHTML = `
  <h3>${node.name}</h3>
  <p><strong>ID:</strong> ${node.id}</p>
  <p><strong>Type:</strong> ${node.type || "Unknown"}</p>
`
    }
    if (node.notes) {
        panelContent.innerHTML = `<p><strong>Notes:</strong>${node.notes}`
    }
    // Edit Button
    let editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.onclick = () => showEditPanel(node);
    panelContent.appendChild(editButton);
    panel.style.display = "block";

}

// Close Property Panel
export function hidePropertyPanel() {
    panel.style.display = "none";
}


function showEditPanel(node) {
    let editPanel = document.getElementById("edit-panel");
    editPanel.innerHTML = ""; // Clear previous content

    let title = document.createElement("h3");
    title.textContent = `Edit ${node.name}`;
    editPanel.appendChild(title);

    let form = document.createElement("form");

    for (let key in node) {
        if (key !== "children" && key!=="id"&& key!=="type") { // Skip children property
            let label = document.createElement("label");
            label.textContent = key;

            let input;
            if (key === "notes") {
                // Use textarea for notes
                input = document.createElement("textarea");
                input.rows = 4; // Adjust height
                input.cols = 40;
            } else {
                // Use regular input for other fields
                input = document.createElement("input");
                input.type = "text";
            }

            input.value = node[key];
            input.dataset.key = key; // Store key for easy reference

            form.appendChild(label);
            form.appendChild(input);
            form.appendChild(document.createElement("br"));
        }
    }

    // Save Button
    let saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.type = "button";
    saveButton.onclick = () => saveNodeEdits(node, form);
    form.appendChild(saveButton);

    // Cancel Button
    let cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.type = "button";
    cancelButton.onclick = () => (editPanel.style.display = "none");
    form.appendChild(cancelButton);

    editPanel.appendChild(form);
    editPanel.style.display = "block"; // Show panel
}


function saveNodeEdits(node, form) {
    let inputs = form.querySelectorAll("input, textarea"); // Include textareas
    inputs.forEach(input => {
        let key = input.dataset.key;
        node[key] = input.value; // Update node
    });

    document.getElementById("edit-panel").style.display = "none"; // Hide edit panel
    showPropertyPanel(node); // Refresh property panel with new values
    document.dispatchEvent(new CustomEvent("treeChanged", { detail: { } })); 

}
