$(document).ready(function() {
  populateItems();
  addMoreItems();
  greyQty();
});

//The help button
document.getElementsByClassName('help')[0].addEventListener('click', function() {
  window.open('https://www.copfirst.com/pages/help#select_items');
});

//The save button
document.getElementById("save").addEventListener('click', function() {
  //All the critical information
  var keywords = [];
  var colors = [];
  var sizes = [];
  var qtys = [];
  var categories = [];
  var anySize = [];

  //Get the number of items
  var numberOfItems = document.getElementsByClassName("keyword").length;

  //Loop though and add all the items to their respective array
  for(i = 0; i < numberOfItems; i++) {
    //Get keywords, colors, and categories
    keywords.push(document.getElementsByClassName("keyword")[i].value.toLowerCase().trimRight().trimLeft());
    colors.push(document.getElementsByClassName("color")[i].value.toLowerCase().trimRight().trimLeft());
    qtys.push(document.getElementsByClassName("qty")[i].value.trimLeft().trimRight());
    categories.push(document.getElementsByClassName("category")[i].value);

    if(document.getElementsByClassName("togglebtn")[i].value == "Any Size: ON") {
      anySize.push(true);
    } else {
      anySize.push(false);
    }

    //Sizing requires a little more changes
    var sizeValue = toTitleCase(document.getElementsByClassName("size")[i].value);
    sizeValue = sizeValue.trimRight().trimLeft();
    if(sizeValue == "Sml" || sizeValue == "Sm" || sizeValue == "S") {
      sizes.push("Small");
    } else if(sizeValue == "M" || sizeValue == "Med") {
      sizes.push("Medium");
    } else if (sizeValue == "Lge" || sizeValue == "Lrg" || sizeValue == "Lg" || sizeValue == "L") {
      sizes.push("Large");
    } else if(sizeValue == "Xlarge" || sizeValue == "Xlg" || sizeValue == "Xl") {
  		sizes.push("XLarge");
  	} else {
  		sizes.push(sizeValue);
  	}
  }

  chrome.storage.sync.set({
		keyword: keywords,
		color: colors,
		category: categories,
    qty: qtys,
    qtyUI: qtys,
    size: sizes,
    sizeUI: sizes,
    anySize: anySize,
    anySizeUI: anySize
	}, function() {
		alert("Items have been successfully saved!");
	});
});

//Function used to add more items
function addMoreItems() {
  var i = 1;
  $('#add').click(function() {
    i++;
    $('#dynamic_field').append('<tr id="row'+i+'"><td class="sub-row"><input class="keyword eyenput" type="text" name="keyword" id="keywords" placeholder="Keywords" autocomplete="off" /><input class="color eyenput" type="text" name="color" id="color" placeholder="Color" autocomplete="off" /><input class="size eyenput" type="text" name="size" id="size'+i+'" placeholder="Size" autocomplete="off" /><input class="qty eyenput" type="text" name="qty" id="qty'+i+'" placeholder="Qty" autocomplete="off" value="N/A" disabled/></td><td class="special"><select class="category" id="category'+i+'"><option value="jackets">Jackets</option><option value="shirts">Shirts</option><option value="tops_sweaters">Tops/Sweaters</option><option value="sweatshirts">Sweatshirts</option><option value="pants">Pants</option><option value="t-shirts">T-shirts</option><option value="shorts">Shorts</option><option value="hats">Hats</option><option value="bags">Bags</option><option value="accessories">Accessories</option><option value="shoes">Shoes</option><option value="skate">Skate</option></select><div class="check-container"><input type="button" class="togglebtn" id="anysize'+i+'" value="Any Size: OFF"></input></div><button name="remove" id="'+i+'" class="btn btn-danger btn_remove">Remove Item.</button></td></tr>');
  });
  $(document).on('click', '.btn_remove', function() {
    var button_id = $(this).attr("id");
    $("#row"+button_id+"").remove();
    i--;
  });
  $(document).on('click', '.togglebtn', function() {
    var button_id = $(this).attr("id");
    if($("#"+button_id+"").val() == "Any Size: OFF") {
      $("#"+button_id+"").val("Any Size: ON");
    } else {
      $("#"+button_id+"").val("Any Size: OFF");
    }
  });
}

function greyQty() {
  $(document).on('change', '.category', function() {
    var val = $(this).val();
    var category_id = $(this).attr("id").substring(8);

    if(val == "accessories") {
      $("#qty"+category_id+"").prop('disabled', false);
      $("#qty"+category_id+"").val("");
    } else {
      $("#qty"+category_id+"").prop('disabled', true);
      $("#qty"+category_id+"").val("N/A");
    }
  });
}

function toTitleCase(str) {
  return str.replace(
      /\w\S*/g,
      function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
  );
}

//When the user pulls
function populateItems() {
  var numberOfItems = 0;
  var keywordUI = [];
  var colorUI = [];
  var sizeUI = [];
  var categoryUI = [];
  var qtyUI = [];
  var anySizeUI = [];

  //Get number of items and saved values
  chrome.storage.sync.get(['keyword', 'color', 'sizeUI', 'anySizeUI', 'category', 'qtyUI'], function(result) {
  	if(typeof result.keyword != "undefined") {
      keywordUI = result.keyword;
      numberOfItems = keywordUI.length;
  	}
    colorUI = result.color;
    sizeUI = result.sizeUI;
    anySizeUI = result.anySizeUI;
    categoryUI = result.category;
    qtyUI = result.qtyUI;

    for(i = 0; i < numberOfItems - 1; i++) {
      document.getElementById("add").click();
    }

    //Get the key values and fill the form
    for(i = 0; i < numberOfItems; i++) {
      document.getElementsByClassName("keyword")[i].value = keywordUI[i];
      document.getElementsByClassName("color")[i].value = colorUI[i];
      document.getElementsByClassName("size")[i].value = sizeUI[i];
      document.getElementsByClassName("category")[i].value = categoryUI[i];
      document.getElementsByClassName("qty")[i].value = qtyUI[i];

      if(categoryUI[i] == "accessories") {
        document.getElementsByClassName("qty")[i].disabled = false;
      }

      if(anySizeUI[i]) {
        document.getElementsByClassName("togglebtn")[i].value = "Any Size: ON";
      } else {
        document.getElementsByClassName("togglebtn")[i].value = "Any Size: OFF";
      }
    }
  });
}
