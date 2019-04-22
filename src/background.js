const browser = require('webextension-polyfill');
const util = require('util');

// Get the text of an element based on a menu shown event
function getContextElementText(info, tab) {
  return browser.tabs.executeScript(tab.id, {
    frameId: info.frameId,
    code: `browser.menus.getTargetElement(${info.targetElementId}).innerText;`
  });
}

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

let matchesHash;
async function onShown(info, tab) {
  browser.menus.removeAll();

  const { openers } = await browser.storage.local.get('openers');

  if (info.contexts.includes('page')) {
    // Get the text of the element that was right clicked on
    const text = await getContextElementText(info, tab);

    // Find openers who's regex matches the text
    matchesHash = {};
    const validOpeners = openers
      .filter(opener => opener.regex)
      .map(opener => {
        const regexMatch = matchRegexes(text[0], opener);
        const matchedText = regexMatch ? regexMatch[0] : undefined;

        matchesHash[opener.name] = matchedText;

        return {
          ...opener,
          matchedText
        };
      })
      .filter(opener => opener.matchedText);

    if (validOpeners.length > 0) {
      addMenuItemsFromOpeners(validOpeners, ['page']);
    }
  } else if (info.contexts.includes('selection')) {
    const validOpeners = openers.filter(opener => {
      if (!opener.regex) return true;
      return matchRegexes(info.selectionText, opener).length >= 1;
    });

    if (validOpeners.length > 0) {
      addMenuItemsFromOpeners(validOpeners, ['selection']);
    }
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
    const url = util.format(
      opener.url,
      info.selectionText || matchesHash[info.menuItemId]
    );
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

browser.menus.onShown.addListener((info, tab) => {
  return onShown(info, tab).catch(err => {
    console.error(err);
  });
});

browser.menus.onClicked.addListener((info, tab) => {
  return onClicked(info, tab).catch(err => {
    console.error(err);
  });
});
