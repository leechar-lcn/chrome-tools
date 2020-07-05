// const baseUrl = "https://www.baidu.com";

// // 创建右键菜单
// const contextMenuItem = {
//   id: "openRiho",
//   title: "连接灵犀配置",
// };

// chrome.contextMenus.create(contextMenuItem);

// // 按钮点击事件
// chrome.contextMenus.onClicked.addListener((e) => {
//   if (e.menuItemId === "openRiho") {
//     // 拿到当前激活的 tab
//     chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
//       // 给 content scripts 打电话
//       chrome.tabs.sendMessage(tabs[0].id, {}, () => {});
//     });
//   }
// });

// // 切换 tab 时，更新按钮的状态
// chrome.tabs.onSelectionChanged.addListener((tabId) => {
//   chrome.tabs.get(tabId, ({ url }) => {
//     updateMenuItem({
//       title: setTitle(url),
//       enabled: url.startsWith(baseUrl),
//     });
//   });
// });

// // 创建新的 tab 时，初始化按钮状态
// chrome.tabs.onCreated.addListener(({ url, id }) => {
//   updateMenuItem({
//     title: setTitle(url),
//     enabled: url.startsWith(baseUrl),
//   });
// });

// // tab 的状态更新时，设置按钮状态
// chrome.tabs.onUpdated.addListener((id, {}, { url }) => {
//   updateMenuItem({
//     title: setTitle(url),
//     enabled: url.startsWith(baseUrl),
//   });
// });

// function setTitle(url) {
//   const isConnected = url.indexOf("dynamicSchema") !== -1;
//   return isConnected ? "断开灵犀配置" : "连接灵犀配置";
// }

// function updateMenuItem(obj) {
//   chrome.contextMenus.update("openRiho", obj);
// }
