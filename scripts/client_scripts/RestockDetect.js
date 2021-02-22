var link = "";
var supremeURL = 'https://www.supremenewyork.com/shop/all/';
var i = 0;
var delay;

var keyword;
var color;
var category;
var size;
var anySize;

var itemSourceCode;

//Get values from initial popup and store them into variables
chrome.storage.sync.get(['keywordRestock', 'colorRestock', 'categoryRestock', 'sizeRestock', 'anySizeRestock', 'searchInterval'], function(result) {
	keyword = result.keywordRestock;
	color = result.colorRestock;
	category = result.categoryRestock;
	supremeURL = supremeURL + category;
	size = [result.sizeRestock];
	anySize = [result.anySizeRestock];

	if (typeof result.searchInterval == "undefined") {
		delay = 2000;
	} else {
		delay = result.searchInterval * 1000;
	}

	desiredItemPage();
});

function desiredItemPage() {
	$.ajax({
		type: 'GET',
		url: supremeURL,
		success: function(data) {
			link = data.toLowerCase();
			link = getItemLink(link, keyword, color);
			link = "https://www.supremenewyork.com" + link;

			if(link.includes(category) || link.includes('tops-sweaters')) {
				waitForRestock();
			} else {
				document.getElementsByTagName('p')[0].textContent = "INCORRECT SEARCH INFORMATION! DOUBLE CHECK KEYWORDS";
			}
		}
	});
}

function waitForRestock() {
	$.ajax({
		type: 'GET',
		url: link,
		success: function(data) {
			itemSourceCode = data.toLowerCase();

			i++;

			if((itemSourceCode.match(/button sold-out/g) || []).length == 2) {
				document.getElementsByTagName('p')[0].textContent = "Restock search attempt " + i;
				setTimeout(waitForRestock, delay);
			} else {
				chrome.storage.sync.set({
					size: size,
					anySize: goodAnySizes,
					links: ["bogus website"]
				}, function() {
					window.open(link, "_self");
				});
			}
		}
	});
}

function getItemLink(data, keyword, color) {
	if(data.indexOf(keyword) == -1) return "invalid input";

	//Get the section where all the items are
	while (data.substring(0, data.indexOf(keyword)).lastIndexOf("class=\"product-style\"") > data.substring(0, data.indexOf(keyword)).lastIndexOf("class=\"product-name\"")) {
		data = data.substring(data.indexOf(keyword) + 1);
	}
	data = data.substring(data.indexOf(keyword));

	//Make sure color is right
	while (data.substring(0, data.indexOf(color)).lastIndexOf("class=\"product-style\"") < data.substring(0, data.indexOf(color)).lastIndexOf("class=\"product-name\"")) {
		data = data.substring(data.indexOf(color) + 1);
	}
	data = data.substring(0, data.indexOf(color));
	data = data.substring(0, data.lastIndexOf("\""));

	//Pull link and return the result
	data = data.substring(data.lastIndexOf("href=") + 6);

	return data;
}
