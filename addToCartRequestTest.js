//Get the stock information
var category = 'Jackets';
var keyword = 'Raglan';
var color = 'Black';
var size = 'Large';
var timeout = 2000;

var item_id;
var size_id;
var color_id;

function findItems() {
  $.ajax({
    url: 'https://www.supremenewyork.com/mobile_stock.json',
    type: 'GET',
    dataType: 'json',
    success: function(data) {
      var categoryStock = data.products_and_categories[category];
      if(JSON.stringify(categoryStock).includes(keyword)) {
        for(i = 0; i < categoryStock.length; i++) {
          if(categoryStock[i].name.includes(keyword)) {
            item_id = categoryStock[i].id;
            break;
          }
        }
        getStyleInfo();
      } else {
        setTimeout(findItems, timeout);
      }
    }
  });
}

//Get style information
function getStyleInfo() {
  $.ajax({
    url: 'https://www.supremenewyork.com/shop/' + item_id + '.json',
    type: 'GET',
    dataType: 'json',
    success: function(data) {
      var colors = data.styles;
      for(i = 0; i < colors.length; i++) {
        if(colors[i].name.includes(color)) {
          color_id = colors[i].id;
          var sizes = colors[i].sizes;
          if(sizes[0].name === "N/A") {
            size_id = sizes[0].id;
          } else {
            for(j = 0; j < sizes.length; j++) {
              if(sizes[j].name === size) {
                size_id = sizes[j].id;
                break;
              }
            }
          }
          break;
        }
      }
      addToCart();
    }
  });
}

//Add to cart
function addToCart() {
  $.ajax({
    url: 'https://www.supremenewyork.com/shop/' + item_id + '/add.json',
    type: 'POST',
    data: {
      's': size_id,
      'st': color_id,
      'qty': 1
    },
    dataType: 'json',
    success: function(data) {
      window.open('https://www.supremenewyork.com/checkout');
    }
  });
}
