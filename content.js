let isRunning = false;
let timeoutId = null;
let likedCount = 0;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "start") {
    if (!isRunning) {
      isRunning = true;
      likedCount = 0; // Reset session count
      chrome.storage.local.set({ likedCount: 0 });
      console.log("Instagram Liker started");
      runCycle();
    }
  } else if (request.action === "stop") {
    isRunning = false;
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    console.log("Instagram Liker stopped");
  }
});

async function runCycle() {
  if (!isRunning) return;

  try {
    // 1. Try to Like if not already liked
    const likeBtn = document.querySelector('svg[aria-label="Like"]')?.closest('div[role="button"]') ||
      document.querySelector('svg[aria-label="Like"]')?.closest('button');

    if (likeBtn) {
      console.log("Liking post...");
      likeBtn.click();
      likedCount++;
      chrome.storage.local.set({ likedCount: likedCount });
      // Wait a bit for the like to register before clicking next
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    } else {
      console.log("Post already liked or like button not found.");
    }

    // 2. Try to click Next
    // Strictly look for the button containing the "Next" chevron
    const nextBtn = document.querySelector('button svg[aria-label="Next"]')?.closest('button');

    if (nextBtn) {
      console.log("Moving to next post...");
      nextBtn.click();
    } else {
      console.log("Next button not found (End of posts). Stopping.");
      isRunning = false;
      // Notify the user via console or status change if we had storage
      return;
    }

    // 3. Schedule next cycle with random delay (3-6 seconds)
    const delay = 3000 + Math.random() * 3000;
    timeoutId = setTimeout(runCycle, delay);

  } catch (error) {
    console.error("Error in Instagram Liker cycle:", error);
    isRunning = false;
  }
}
