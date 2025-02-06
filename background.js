chrome.runtime.onInstalled.addListener(() => {  
  chrome.contextMenus.create({
    id: "ociInfoForNetwork",
    title: "Add OCI Details to OCI Projects extension",
    contexts: ["page"],
    documentUrlPatterns: ["*://cloud.oracle.com/*"]
  });
});


chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "ociInfoForNetwork") {
    await handleOCIInfo(info, tab);
  }
});


async function handleOCIInfo(info, tab) {
  (async () => {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, { type: 'ociInfoRequest' });
    console.log(response);
    chrome.runtime.sendMessage({
      type: 'ociProfile',
      profile: response.data,
      ociUrl: response.ociUrl
    });
  })()
}

