const browser = require('webextension-polyfill');
const util = require('util');

function matchRegexes(text, opener) {
  if (!opener.regex) return [];

  const decodedRegexes = opener.regex
    .map(rawRegex => {
      return new RegExp(decodeURIComponent(rawRegex));
    })
    .map(regex => {
      return text.match(regex);
    })
    .filter(notNull => notNull);

  return decodedRegexes;
}

// Add a menu item for each opener
function addMenuItemsFromOpeners(openers, contexts) {
  browser.menus.removeAll();

  openers.forEach(opener => {
    browser.menus.create({
      id: opener.name,
      title: opener.name,
      contexts
    });
  });

  // Create the seperator and options item
  browser.menus.create({
    id: 'separator-1',
    type: 'separator',
    contexts
  });
  browser.menus.create({
    id: 'special:open_options',
    title: 'Options',
    contexts
  });

  browser.menus.refresh();
}

async function updateMenu(type, payload) {
  browser.menus.removeAll();

  const { openers } = await browser.storage.local.get('openers');

  const validOpeners = openers.filter(opener => {
    if (!opener.regex) return true;
    return matchRegexes(payload.selection, opener).length >= 1;
  });

  if (validOpeners.length > 0) {
    addMenuItemsFromOpeners(validOpeners, ['selection']);
  }
}

async function onClicked(info, tab) {
  const { openers } = await browser.storage.local.get('openers');

  // Build lookup hash by name
  const lookup = openers.reduce((l, opener) => {
    l[opener.name] = opener;
    return l;
  }, {});

  const opener = lookup[info.menuItemId];
  if (opener) {
    const url = util.format(opener.url, info.selectionText);
    browser.tabs.create({
      url,
      active: true,
      index: tab.index + 1
    });
  }

  // Open the options panel
  if (info.menuItemId === 'special:open_options') {
    browser.runtime.openOptionsPage();
  }
}

browser.menus.onClicked.addListener((info, tab) => {
  return onClicked(info, tab).catch(err => {
    console.error(err);
  });
});

browser.runtime.onMessage.addListener(function({ type, payload }) {
  console.info(`Background got message of type ${type}`, payload);

  if (type === 'selection_change' && payload.selection.length > 0) {
    return updateMenu(type, payload).catch(err => {
      console.error(err);
    });
  }
});
