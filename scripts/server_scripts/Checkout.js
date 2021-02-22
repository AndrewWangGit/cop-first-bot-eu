//Define all the required variable fields
var full_name = "";
var email = "";
var tel = "";
var address = "";
var address2 = "";
var address3 = "";
var city = "";
var postcode= "";
var country = "";
var card_type = "";
var creditcard = "";
var month = "";
var year = "";
var cvv = "";
var delay;

//Get the values for each field from the Checkout.html page
chrome.storage.sync.get(['full_name', 'email', 'telephone', 'address', 'address2', 'address3', 'city', 'postcode', 'country', 'card_type', 'creditcard', 'month', 'year', 'cvv', 'checkoutDelay'], function(result) {
	full_name = result.full_name;
	email = result.email;
	tel = result.telephone;
	address = result.address;
	address2 = result.address2;
	address3 = result.address3;
	city = result.city;
	postcode = result.postcode;
	country = result.country;
	card_type = result.card_type;
	creditcard = result.creditcard;
	month = result.month;
	year = result.year;
	cvv = result.cvv;

	if (typeof result.checkoutDelay == "undefined") {
		delay = 3000;
	} else {
		delay = result.checkoutDelay * 1000;
	}

	setTimeout(fillCheckout, delay);
});

function fillCheckout() {
	//Fill the form
	$('*[placeholder="full name"]')[0].value = full_name;
	$('*[placeholder="email"]')[0].value = email;
	$('*[placeholder="tel"]')[0].value = tel;
	$('*[placeholder="address"]')[0].value = address;
	$('*[placeholder="address 2"]')[0].value = address2;
	$('*[placeholder="address 3"]')[0].value = address3;
	$('*[placeholder="city"]')[0].value = city;
	$('*[placeholder="postcode"]')[0].value = postcode;
	document.getElementsByTagName("select")[0].value = country;
	document.getElementsByTagName("select")[1].value = card_type;
	$('*[placeholder="number"]')[0].value = creditcard;
	document.getElementsByTagName("select")[2].value = month;
	document.getElementsByTagName("select")[3].value = year;
	$('*[placeholder="CVV"]')[0].value = cvv;
	$('#order_terms').prop('checked', true);

	//Update classes to prevent bot detection

	floatingTags = document.getElementsByClassName("string required control-label floaty");
	for(i = 0; i < floatingTags.length - 1; i++) {
		floatingTags[i].className += " floating";
	}
	floatingTags = document.getElementsByClassName("string required");
	for(i = 0; i < floatingTags.length - 6; i++) {
		if(floatingTags[i].className == "string required") {
			floatingTags[i].className += " floating";
		}
	}

	//For email
	document.getElementsByClassName("string email optional")[0].className += " floating";
	document.getElementsByClassName("email optional control-label floaty")[0].className += " floating";

	if(address2 != "") {
		document.getElementsByClassName("string optional control-label floaty")[0].className += " floating";
		$('*[placeholder="address 2"]')[0].className += " floating";
	}

	if(address3 != "") {
		document.getElementsByClassName("string optional control-label floaty")[1].className += " floating";
		$('*[placeholder="address 3"]')[0].className += " floating";

	}

	//Display check
	document.getElementsByClassName("icheckbox_minimal")[1].className += " checked";

	setTimeout(processPayment, 10);
}

function processPayment() {
	document.getElementsByName('commit')[0].click();
	if(document.getElementsByName('commit')[0].value == "process payment") {
		document.getElementsByName('commit')[0].click();
		setTimeout(processPayment, 10);
	}
}
