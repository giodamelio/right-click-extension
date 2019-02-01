const browser = require('webextension-polyfill');
const util = require('util');

browser.menus.onShown.addListener((info, tab) => {
  browser.menus.removeAll();

  return browser.storage.local.get('openers').then(({ openers }) => {
    // Make a menu item for each opener
    openers.forEach(opener => {
      // If the opener has a regex property, only show the menu if the selected text matches it
      const regex = new RegExp(decodeURIComponent(opener.regex || '.*'));
      if (regex.test(info.selectionText)) {
        browser.menus.create({
          id: opener.name,
          title: opener.name,
          contexts: ['selection']
        });
      }
    });

    // Create the seperator and options item
    browser.menus.create({
      id: 'separator-1',
      type: 'separator',
      contexts: ['selection']
    });
    browser.menus.create({
      id: 'special:open_options',
      title: 'Options',
      contexts: ['selection']
    });

    browser.menus.refresh();
  });
});

browser.menus.onClicked.addListener((info, tab) => {
  console.log(info);

  return browser.storage.local.get('openers').then(({ openers }) => {
    // Build lookup hash by name
    const lookup = openers.reduce((l, opener) => {
      l[opener.name] = opener;
      return l;
    }, {});

    const opener = lookup[info.menuItemId];
    if (opener) {
      console.log('Opening with:', opener.name);
      const url = util.format(opener.url, info.selectionText);
      browser.tabs.create({
        active: true,
        url
      });
    }

    // Open the options panel
    if (info.menuItemId === 'special:open_options') {
      browser.runtime.openOptionsPage();
    }
  });
});
