//Add a listener to the update key at the bottom of Checkout.html
document.getElementById("updateBilling").addEventListener('click', getInfo);

//Check for all the parameters and update if possible. If nothing is there make it blank
chrome.storage.sync.get(['full_name', 'email', 'telephone', 'address', 'address2', 'address3', 'city', 'postcode', 'country', 'card_type', 'creditcard', 'month', 'year', 'cvv'], function(result) {
	if(typeof result.full_name != "undefined") {document.getElementById("full_name").value = result.full_name;}
	if(typeof result.email != "undefined") {document.getElementById("email").value = result.email;}
	if(typeof result.telephone != "undefined") {document.getElementById("telephone").value = result.telephone.split('-').join('');}
	if(typeof result.address != "undefined") {document.getElementById("address").value = result.address;}
	if(typeof result.address2 != "undefined") {document.getElementById("address2").value = result.address2;}
	if(typeof result.address3 != "undefined") {document.getElementById("address3").value = result.address3;}
	if(typeof result.city != "undefined") {document.getElementById("city").value = result.city;}
	if(typeof result.postcode != "undefined") {document.getElementById("postcode").value = result.postcode;}
	if(typeof result.country != "undefined") {document.getElementById("country").value = result.country;}
	if(typeof result.card_type != "undefined") {document.getElementById("card_type").value = result.card_type;}
	if(typeof result.creditcard != "undefined") {document.getElementById("creditcard").value = result.creditcard;}
	if(typeof result.month != "undefined") {document.getElementById("month").value = result.month;}
	if(typeof result.year != "undefined") {document.getElementById("year").value = result.year;}
	if(typeof result.cvv != "undefined") {document.getElementById("cvv").value = result.cvv;}
});

//Store all the information once user is done. This is done on click.
function getInfo() {

	//Get telephone number correct format
	var newTel = "";
	for(i = 0; i < document.getElementById("telephone").value.length; i++) {
		if(i % 3 == 2 && i < 6) {
			newTel += document.getElementById("telephone").value.charAt(i);
			newTel += "-"
		} else {
			newTel += document.getElementById("telephone").value.charAt(i);
		}
	}

	chrome.storage.sync.set({
		full_name: document.getElementById("full_name").value,
		email: document.getElementById("email").value,
		telephone: newTel,
		address: document.getElementById("address").value,
		address2: document.getElementById("address2").value,
		address3: document.getElementById("address3").value,
		city: document.getElementById("city").value,
		postcode: document.getElementById("postcode").value,
		country: document.getElementById("country").value,
		card_type: document.getElementById("card_type").value,
		creditcard: document.getElementById("creditcard").value,
		month: document.getElementById("month").value,
		year: document.getElementById("year").value,
		cvv: document.getElementById("cvv").value
	}, function() {
		alert("Information has been updated!");
	});
}
