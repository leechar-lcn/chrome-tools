class Config extends Expand {
  constructor() {
    super();
    this.createMenuItems = this.menuItems;
    this.url = ["https://www.baidu.com/"];
  }

  menuItems = [
    {
      id: "openRiho",
      title: "连接灵犀配置",
      onClick: this.onHandleClick,
    },
  ];

  onHandleClick(tab) {
    chrome.tabs.sendMessage(tab.id, "");
  }

  setRihoStatus(url) {
    this.updateMenuItem("openRiho", {
      title:
        url.indexOf("dynamicSchema") === -1 ? "连接灵犀配置" : "断开灵犀配置",
      enabled: this.url.some((item) => url.startsWith(item)),
    });
  }

  onTabsChange(tab) {
    this.setRihoStatus(tab.url);
  }

  onTabsCreated(tab) {
    this.setRihoStatus(tab.url);
  }

  onTabsUpdate(id, {}, { url }) {
    this.setRihoStatus(url);
  }
}

new Config();
