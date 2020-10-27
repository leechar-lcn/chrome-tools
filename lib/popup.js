"use strict";
let timer = null;
chrome.storage.sync.get("autofill", ({ autofill }) => {
    if (autofill) {
        $("textarea").val(autofill);
    }
});
$("textarea").on("input", (e) => {
    // @ts-ignore
    chrome.storage.sync.set({ autofill: e.target.value });
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
        // @ts-ignore
        const urls = e.target.value
            .split(/[\s\n]/)
            .filter(Boolean)
            .map((item) => item.trim());
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { urls }, () => { });
        });
    }, 300);
});
//# sourceMappingURL=popup.js.map