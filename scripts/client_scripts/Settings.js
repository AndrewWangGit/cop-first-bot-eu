document.getElementsByClassName('help')[0].addEventListener('click', function() {
  window.open('https://www.copfirst.com/pages/help#settings');
});

document.getElementById('googeLogin').addEventListener('click', function() {
  window.open('http://accounts.google.com/login');
});

//Toggle images
document.getElementById("imageToggle").addEventListener('click', function() {
  if(document.getElementById("imageToggle").value == "Images: ON") {

    document.getElementById("imageToggle").value = "Images: OFF";
    chrome.contentSettings['images'].set({
        primaryPattern: 'https://www.supremenewyork.com/*',
        setting: 'block'
    });
    chrome.storage.sync.set({images: false});
  } else {
    document.getElementById("imageToggle").value = "Images: ON";

    chrome.contentSettings['images'].set({
        primaryPattern: 'https://www.supremenewyork.com/*',
        setting: 'allow'
    });
    chrome.storage.sync.set({images: true});
  }
  restartChromePrompt();
});

document.getElementById('clearData').addEventListener('click', function() {
  chrome.browsingData.remove({
        "origins": ["https://www.supremenewyork.com/"]
      }, {
        "cacheStorage": true,
        "cookies": true,
        "fileSystems": true,
        "indexedDB": true,
        "localStorage": true,
        "pluginData": true,
        "serviceWorkers": true,
        "webSQL": true
      }, function() {
        alert('Data cleared successfully!')
      });
});

//Save settings
document.getElementById("save").addEventListener('click', function() {
  chrome.storage.sync.set({
    searchInterval: document.getElementById("searchInterval").value,
    checkoutDelay: document.getElementById("checkoutDelay").value
  }, function () {
    alert("Settings saved!");
  });
});

//Reset settings
document.getElementById("reset").addEventListener('click', function() {
  //Turn images on
  document.getElementById("imageToggle").value = "Images: ON";
  chrome.contentSettings['images'].set({
      primaryPattern: 'https://www.supremenewyork.com/*',
      setting: 'allow'
  });
  restartChromePrompt();

  //Reset times
  document.getElementById("searchInterval").value = 2;
  document.getElementById("checkoutDelay").value = 3;
  chrome.storage.sync.set({
    images: true,
    searchInterval: 2,
    checkoutDelay: 3
  });
});

chrome.storage.sync.get(['images', 'searchInterval', 'checkoutDelay'], function(result) {
  if(result.images == false) {
    document.getElementById("imageToggle").value = "Images: OFF";
  }
  if(typeof result.searchInterval == "undefined") {
    document.getElementById("searchInterval").value = 2;
  } else {
    document.getElementById("searchInterval").value = result.searchInterval;
  }
  if(typeof result.checkoutDelay == "undefined") {
    document.getElementById("checkoutDelay").value = 3;
  } else {
    document.getElementById("checkoutDelay").value = result.checkoutDelay;
  }
});

function restartChromePrompt() {
  document.getElementsByTagName('p')[1].hidden = false;
}
