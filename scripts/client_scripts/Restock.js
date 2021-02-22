toggleButton();
populateItems();

document.getElementById('save').addEventListener('click', function() {
  var anySize;
  if(document.getElementById("anysize").value == "Any Size: ON") {
    anySize = true;
  } else {
    anySize = false;
  }

  chrome.storage.sync.set({
    keywordRestock: document.getElementById('keywords').value.toLowerCase(),
    colorRestock: document.getElementById('color').value.toLowerCase(),
    categoryRestock: document.getElementById('category').value,
    sizeRestock: document.getElementById('size').value.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' '),
    anySizeRestock: anySize
  }, function() {
    alert("Restock settings saved!");
  });
});

document.getElementById('restock').addEventListener('click', function() {
  window.open('RestockDetect.html');
});

function toggleButton() {
  $(document).ready(function() {
    $(document).on('click', '.togglebtn', function() {
      var button_id = $(this).attr("id");
      if($("#"+button_id+"").val() == "Any Size: OFF") {
        $("#"+button_id+"").val("Any Size: ON");
      } else {
        $("#"+button_id+"").val("Any Size: OFF");
      }
    });
  });
}

function populateItems() {
  chrome.storage.sync.get(['keywordRestock', 'colorRestock', 'sizeRestock', 'anySizeRestock', 'categoryRestock'], function(result) {
    if(typeof result.keywordRestock != "undefined") {
      document.getElementById('keywords').value = result.keywordRestock;
    }

    if(typeof result.colorRestock != "undefined") {
      document.getElementById('color').value = result.colorRestock;
    }

    if(typeof result.sizeRestock != "undefined") {
      document.getElementById('size').value = result.sizeRestock;
    }

    if(typeof result.anySizeRestock != "undefined") {
      if(result.anySizeRestock) {
        document.getElementById('anysize').value = "Any Size: ON";
      } else {
        document.getElementById('anysize').value = "Any Size: OFF";
      }
    }

    if(typeof result.categoryRestock != "undefined") {
      document.getElementById('category').value = result.categoryRestock;
    }
  });
}
