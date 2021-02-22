//If user presses help button
document.getElementsByClassName('help')[0].addEventListener('click', function() {
  window.open('https://www.copfirst.com/pages/help#proxy');
});

//Update proxy settings on save click
document.getElementById("save").addEventListener('click', function() {
  //All the critical information
  var titles = [];
  var ips = [];
  var ports = [];
  var authentications = [];
  var selectedProxy = "";

  var setIp = "";
  var setPort = 0;
  var setAuthentication = "";

  //Get the number of items
  var numberOfItems = document.getElementsByClassName("title").length;

  //Loop though and add all the items to their respective array
  for(i = 0; i < numberOfItems; i++) {
    //Get keywords, colors, and categories
    titles.push(document.getElementsByClassName("title")[i].value.trimRight().trimLeft());
    ips.push(document.getElementsByClassName("ip")[i].value.trimRight().trimLeft());
    ports.push(document.getElementsByClassName("port")[i].value.trimRight().trimLeft());
    authentications.push(document.getElementsByClassName("authentication")[i].value.trimRight().trimLeft());
  }
  var row = $("input[name=active]:checked").val();

  //If they select a proxy
  if(row != "none") {
    setIp = document.getElementById('ip' + row).value;
    setPort = parseInt(document.getElementById('port' + row).value);
    var config = {
      mode: "fixed_servers",
      rules: {
        singleProxy: {
          scheme: "http",
          host: setIp,
          port: setPort
        }
      }
    };
  } else {
    var config = {
      mode: "direct",
    };
  }

  if(document.getElementById('authentication' + row) != null && document.getElementById('authentication' + row).value != undefined && document.getElementById('authentication' + row).value != "") {
    setAuthentication = document.getElementById('authentication' + row).value;
    username = setAuthentication.substring(0, setAuthentication.indexOf(":"));
    password = setAuthentication.substring(setAuthentication.indexOf(":") + 1);

    var retry = 3;

    chrome.proxy.settings.set({
      value: config,
      scope: 'regular'
    }, function() {
      chrome.webRequest.onAuthRequired.addListener(function handler(details) {
        if (--retry < 0) {
          return {cancel: true};
          return {authCredentials: {username: username, password: password}};
        }
      });
    });
  } else {
    chrome.proxy.settings.set({
      value: config,
      scope: 'regular'
    });
  }

  chrome.storage.sync.set({
		titles: titles,
		ips: ips,
		ports: ports,
    authentications: authentications,
    selectedProxy: row
	}, function() {
		alert("Proxies have been successfully saved and updated!");
	});
});

$(document).ready(function() {
  addMoreItems();
  populateItems();
});

function addMoreItems() {
  var i = 1;
  $('#add').click(function() {
    $('#dynamic_field').append('<tr id="row'+i+'"><td><div class="special-container"><p class="special-title">Make this my active Proxy</p><input type="radio" id="active" name="active" value="'+i+'"></div></td><td><input class="title eyenput" type="text" name="title" id="title'+i+'" placeholder="title" autocomplete="off" /><input class="ip eyenput" type="text" name="ip" id="ip'+i+'" placeholder="ip" autocomplete="off" /></td><td><input class="port eyenput" type="text" name="port" id="port'+i+'" placeholder="port" autocomplete="off" /><input class="authentication eyenput" type="text" name="authentication" id="authentication'+i+'" placeholder="username:password" autocomplete="off" /></td><td class="center-btn"><button name="remove" id="'+i+'" class="btn btn-danger btn_remove">Remove proxy</button></td></tr>');
    i++;
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

function populateItems() {
  var titleUI = [];
  var ipUI = [];
  var portUI = [];
  var authenticationUI = [];
  var selectedProxyUI = "";
  var numberOfItems;

  //Get number of items and saved values
  chrome.storage.sync.get(['titles', 'ips', 'ports', 'authentications', 'selectedProxy'], function(result) {
  	if(typeof result.titles != "undefined") {
      titleUI = result.titles;
      numberOfItems = titleUI.length;
  	}
    ipUI = result.ips;
    portUI = result.ports;
    authenticationUI = result.authentications;
    selectedProxyUI = result.selectedProxy;

    for(i = 0; i < numberOfItems - 1; i++) {
      document.getElementById("add").click();
    }

    //Get the key values and fill the form
    for(i = 0; i < numberOfItems; i++) {
      document.getElementsByClassName("title")[i].value = titleUI[i];
      document.getElementsByClassName("ip")[i].value = ipUI[i];
      document.getElementsByClassName("port")[i].value = portUI[i];
      document.getElementsByClassName("authentication")[i].value = authenticationUI[i];
    }

    if(typeof result.selectedProxy != "undefined") {
      $("input[value="+selectedProxyUI+"]").prop("checked", true);
    } else {
      $("input[value=none]").prop("checked", true);
    }
  });
}
