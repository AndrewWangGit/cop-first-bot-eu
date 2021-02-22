var links;
var canBeAnySize;
var qty;


//comment from Ryan
//Call variables
chrome.storage.sync.get(['links', 'anySize', 'size', 'qty'], function(result) {
	//Identify and update links
	links = result.links;
	links.shift();

	//Check if user is ok with any size
	var anySize = result.anySize;
	canBeAnySize = result.anySize[anySize.length - links.length - 1];

	var qtyArray = result.qty;
	qty = qtyArray[qtyArray.length - links.length - 1];

	//Get the desired size for this specific item
	var sizes = result.size;
	sizeSelection(sizes[sizes.length - links.length - 1]);

	chrome.storage.sync.set({links: links});
});

function sizeSelection(s) {
	if(document.getElementById('qty') != null) {
		for (var i = 0; i < document.getElementById('qty').options.length; i++) {
			if (document.getElementById('qty').options[i].value == qty) {
				document.getElementById('qty').selectedIndex = i;
			}
		}
	}

	//Check if sizing is required
	if(document.getElementById('s') != null && document.getElementById('s').type != "hidden") {

		//Loop through the select for the correct size
		for (var i = 0; i < document.getElementById('s').options.length; i++) {
			if (document.getElementById('s').options[i].text == s) {
				document.getElementById('s').selectedIndex = i;
				addToCart();
			}
		}

		//Determine if it can be any size
		if(canBeAnySize || s == "") {
			addToCart();
		} else {
			checkNextPage();
		}

	} else {
			//Add the item to the cart
			addToCart();
	}
}

//If the item is in the shop but size isn't avalible and any size == false
function checkNextPage() {
	if (links.length != 0) {
		setTimeout(function () { window.open(links[0], "_self"); }, 50);
	} else {
		setTimeout(checkButtonUpdate, 50);
	}
}

function addToCart() {
	if (document.getElementsByClassName('button sold-out').length != 0 && links.length != 0) {
		setTimeout(function () { window.open(links[0], "_self"); }, 50);
	} else if (document.getElementsByClassName('button sold-out').length != 0 && links.length == 0) {
		setTimeout(checkButtonUpdate, 50);
	} else if (typeof document.getElementsByName('commit')[0] == "undefined") {
		setTimeout(addToCart, 50);
	} else if (document.getElementsByName('commit')[0].value != "remove") {
		document.getElementsByName('commit')[0].click();
		setTimeout(addToCart, 50);
	} else if (links.length != 0) {
		setTimeout(function () { window.open(links[0], "_self"); }, 50);
	} else {
		setTimeout(checkButtonUpdate, 50);
	}
}

function checkButtonUpdate() {
	//If the button is still hidden keep looking
	if(document.getElementById('cart').className == "hidden") {
		setTimeout(checkButtonUpdate, 10);
	} else {
		//Otherwise click the checkout button
		setTimeout(function() { document.getElementsByClassName('button checkout')[0].click(); }, 50);
	}
}
