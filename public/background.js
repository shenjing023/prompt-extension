chrome.runtime.onInstalled.addListener(() => {
  if (chrome.sidePanel) {
    chrome.sidePanel.setOptions({
      path: 'index.html',
      enabled: true
    }).then(() => {
    }).catch((error) => {
      console.error('Failed to set side panel options:', error);
    });
  } else {
    console.warn('Side panel API not available, will use popup instead');
  }
});

chrome.action.onClicked.addListener((tab) => {
  if (chrome.sidePanel) {
    chrome.sidePanel.open({tabId: tab.id}).then(() => {
    }).catch((error) => {
      console.error('Failed to open side panel:', error);
    });
  } else {
    console.error('Side panel API not available');
  }
});