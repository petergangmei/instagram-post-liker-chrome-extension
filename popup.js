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

// Update the counter in the UI
function updateCounter(count) {
    const counterEl = document.getElementById('counter');
    if (counterEl) {
        counterEl.textContent = `Liked in this session: ${count || 0}`;
    }
}

// Initial state load
chrome.storage.local.get(['likedCount'], (result) => {
    updateCounter(result.likedCount);
});

// Listen for storage changes from content script
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.likedCount) {
        updateCounter(changes.likedCount.newValue);
    }
});
