document.addEventListener('selectionchange', function() {
  const selection = window
    .getSelection()
    .toString()
    .trim();
  chrome.runtime.sendMessage({
    type: 'selection_change',
    payload: {
      selection: selection
    }
  });
});
