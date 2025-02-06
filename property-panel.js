const panel = document.getElementById("property-panel");


document.addEventListener("click", (event) => {
    if (!panel.contains(event.target) && !event.target.classList.contains("node-label")) {
        hidePropertyPanel();
    }
});

export function showPropertyPanel(node) {
    const panelContent = document.getElementById("property-content");
    if (node.type == 'project') {
        panelContent.innerHTML = `
  <h3>${node.name}</h3>
  <p><strong>ID:</strong> ${node.id}</p>
  <p><strong>Type:</strong> ${node.type || "Unknown"}</p>
`
    }
    else if (node.type == 'ociResource') {
        panelContent.innerHTML = `
    <h3>${node.name}</h3>
    <p><strong>OCI Resource Type:</strong> ${node.subtype || "Unknown"}</p>
    <p><a href="${node.url}" target="_new">Open OCI Console for ${node.subtype}</a></p>
    <p><strong>OCID:</strong> ${node.id}</p>
    <p><strong>OCI Service:</strong> ${node.ociService || "Unknown"}</p>
  `;
    }
    else {
        panelContent.innerHTML = `
  <h3>${node.name}</h3>
  <p><strong>ID:</strong> ${node.id}</p>
  <p><strong>Type:</strong> ${node.type || "Unknown"}</p>
`
    }

    panel.style.display = "block";

}

// Close Property Panel
export function hidePropertyPanel() {
    panel.style.display = "none";
}
