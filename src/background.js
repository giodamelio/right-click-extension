const browser = require('webextension-polyfill');

console.log('Hello World');

browser.menus.create({
  id: 'test1',
  title: 'Test 1',
  contexts: ['selection']
});

browser.menus.create({
  id: 'test2',
  title: 'Test 2',
  contexts: ['selection']
});

browser.menus.onClicked.addListener((info, tab) => {
  console.log(info);
});
