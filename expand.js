class Expand {
  constructor() {
    this.createMenuItems = [];

    chrome.tabs.onSelectionChanged.addListener((tabId) => {
      chrome.tabs.get(tabId, this.onTabsChange.bind(this));
    });

    chrome.tabs.onUpdated.addListener(this.onTabsUpdate.bind(this));
    chrome.tabs.onCreated.addListener(this.onTabsCreated.bind(this));

    this._onPropertyChange(
      "createMenuItems",
      this._onMenuItemsChange.bind(this)
    );
  }
  onTabsChange() {}
  onTabsUpdate() {}
  onTabsCreated() {}
  updateMenuItem(attr, obj = {}) {
    chrome.contextMenus.update(attr, obj);
  }
  getCurrTab() {}

  _onRightMenuClick(menuItems) {
    chrome.contextMenus.onClicked.addListener((e) => {
      menuItems.forEach((item) => {
        if (item.id === e.menuItemId) {
          if (item.onClick && typeof item.onClick === "function") {
            chrome.tabs.query(
              { active: true, lastFocusedWindow: true },
              (tabs) => item.onClick(tabs[0])
            );
          }
        }
      });
    });
  }

  _onMenuItemsChange(items) {
    const menuItems = JSON.parse(JSON.stringify(items));
    menuItems.forEach((item, i, target) => {
      delete item.onClick;

      chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create(item, (a, b, c) => {
          this._onRightMenuClick(items);
        });
      });
    });
  }

  _onPropertyChange(attr, callback) {
    Object.defineProperty(this, attr, {
      set: (val) => {
        if (callback && typeof callback === "function") {
          callback(val);
        }
        return val;
      },
    });
  }
}
