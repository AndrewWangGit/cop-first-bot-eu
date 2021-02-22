//JUST CLEAN
var link = "";
var supremeURL = 'https://www.supremenewyork.com/shop/all/';
var i = 0;
var delay;

var keyword;
var color;
var category;
var size;
var anySize;

var goodSizes = [];
var goodAnySizes = [];
var links = [];

//Get values from initial popup and store them into variables
chrome.storage.sync.get(['keyword', 'color', 'category', 'size', 'anySize', 'searchInterval'], function(result) {
	keyword = result.keyword;
	color = result.color;
	category = result.category;
	supremeURL = supremeURL + category[0];
	size = result.size;
	anySize = result.anySize;

	if (typeof result.searchInterval == "undefined") {
		delay = 2000;
	} else {
		delay = result.searchInterval * 1000;
	}

	detectDrop();
});

function detectDrop() {
	$.ajax({
		type: 'GET',
		url: supremeURL,
		success: function(data) {

			link = data.toLowerCase();
			link = link.substring(link.indexOf("<a class=\"name-link\" href=\"/shop/"));
			link = link.substring(0, link.lastIndexOf("<footer id=\"nav\">"));

			i++;

			if(link.includes(keyword[0])) {
				document.getElementsByTagName('p')[0].textContent = "Drop Detected! Collecting Link(s)!";
				populateArrays();
			} else {
				document.getElementsByTagName('p')[0].textContent = "Attempt " + i;
				setTimeout(detectDrop, delay);
			}
		}
	});
}

function populateArrays() {

	//Loop through all the desired items
	for(i = 0; i < keyword.length; i++) {

		//Get the corresponding url for each item
		supremeURL = 'https://www.supremenewyork.com/shop/all/' + category[i];

		//Get the url from the page
		$.ajax({
			async: false,
			type: 'GET',
			url: supremeURL,
			success: function(data) {

				//Get page source
				link = data.toLowerCase();
				link = getItemLink(link, keyword[i], color[i]);

				//Check if the link is legit and adds it to an array if it is
				if(isGoodLink(link, category[i])) {
					//Add link and size to array
					links.push('https://www.supremenewyork.com' + link);
					goodSizes.push(size[i]);
					goodAnySizes.push(anySize[i]);
				}
			}
		});
	}
	//Open the page
	openLinks();
}

function openLinks() {
	chrome.storage.sync.set({
		size: goodSizes,
		anySize: goodAnySizes,
		links: links
	}, function() {
		window.open(links[0], "_self");
	});
}

function isGoodLink(link, category) {
	if(link.includes(category) || link.includes('tops-sweaters')) {
			return true;
	} else {
			return false
	}
}

function getItemLink(data, keyword, color) {
	if(data.indexOf(keyword) == -1) return "invalid input";

	//Get the section where all the items are
	//while (data.substring(0, data.indexOf(keyword)).lastIndexOf("class=\"product-style\"") > data.substring(0, data.indexOf(keyword)).lastIndexOf("class=\"product-name\"")) {
		//data = data.substring(data.indexOf(keyword) + 1);
	//}
	data = data.substring(data.indexOf(keyword));

	if(color == "") {
		data = data.substring(data.indexOf("href=") + 6);
		data = data.substring(0, data.indexOf(">") - 1)
	} else {
		data = data.substring(0, data.indexOf(color));
		data = data.substring(0, data.lastIndexOf("\""));

		//Pull link and return the result
		data = data.substring(data.lastIndexOf("href=") + 6);
	}

	//Make sure color is right
	//while (data.substring(0, data.indexOf(color)).lastIndexOf("class=\"product-style\"") < data.substring(0, data.indexOf(color)).lastIndexOf("class=\"product-name\"")) {
		//data = data.substring(data.indexOf(color) + 1);
	//}
	return data;
}
