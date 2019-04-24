document.addEventListener('selectionchange', function() {
  const selection = window
    .getSelection()
    .toString()
    .trim();
  chrome.runtime.sendMessage({
    type: 'selection_change',
    payload: {
      text: selection
    }
  });
});

document.addEventListener('mousedown', function(event) {
  if (event.button == 2) {
    chrome.runtime.sendMessage({
      type: 'right_click',
      payload: {
        text: event.target.innerText
      }
    });
  }
});
