document.getElementById('start').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "start" });
        updateStatus(true);
    });
});

document.getElementById('stop').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "stop" });
        updateStatus(false);
    });
});

function updateStatus(isRunning) {
    const statusEl = document.getElementById('status');
    if (isRunning) {
        statusEl.textContent = "Status: Running...";
        statusEl.classList.add('running');
    } else {
        statusEl.textContent = "Status: Idle";
        statusEl.classList.remove('running');
    }
}

// Check if it's already running (simplified for now)
// In a real app, we'd use chrome.storage to persist state
