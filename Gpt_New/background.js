chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ bytebuddyEnabled: true });
    chrome.action.setBadgeBackgroundColor({ color: "#d11a2a" });
    chrome.action.setBadgeText({ text: "" }); // Clear badge at start
  });
  
  chrome.commands.onCommand.addListener((command) => {
    if (command === "_execute_action") {
      chrome.storage.local.get("bytebuddyEnabled", (data) => {
        const newState = !data.bytebuddyEnabled;
        chrome.storage.local.set({ bytebuddyEnabled: newState });
  
        chrome.action.setBadgeText({
          text: newState ? "" : "OFF"
        });
  
        console.log(`🧠 ByteBuddy is now ${newState ? "ENABLED" : "DISABLED"}`);
      });
    }
  });
  