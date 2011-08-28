
//yup, globals, needs to be re-factored.  Deal.
var myPositions = new Array();
var myIcons = new Array();
var myContent = new Array();
var markerArray = new Array();
var outputHTML;
	function init() {
		var marker;
		var markerName;
		var myIcon;
		var outputHTML;
		//is location near Sacramento, CA.  Center of display before map is configured.//
		//can be reset to wherever just by changing LatLng values//
		var latlng = new google.maps.LatLng(38.5, -121);
		//set up for map in GUI//
		var mapOptions = {
			//default zoom, etc. for builder GUI, not final map//
			zoom: 8,
			center: latlng,
			//can easily change type of map, but roadmap has best coverage and detail, at least in U.S.//
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		map = new google.maps.Map(document.getElementById("map_div"), mapOptions);
		geocoder = new google.maps.Geocoder();
		//google.maps.event.trigger(map, 'click');
		};
	
		function geocode() {
    		var address = document.getElementById("address").value;
    		geocoder.geocode({
      		'address': address,
      		'partialmatch': true}, geocodeResult);
		};
 
		//on geocode moves map center to location//
		function geocodeResult(results, status) {
			if (status == 'OK' && results.length > 0) {
			//below displays geocode match details on page, for troubleshooting"
			//document.getElementById("output").innerHTML = results[0].formatted_address;
			//document.getElementById("cord_out").innerHTML = results[0].geometry.location.lat() + " " + results[0].geometry.location.lng();
			map.fitBounds(results[0].geometry.viewport);
			} else {alert("Geocode was not successful for the following reason: " + status);}
		};
		function activateMarkers(x) {
			google.maps.event.clearListeners(map, 'click')
			i = 0
			var myIcon = document.getElementById(x).src
			document.getElementById("currentIcon").src = myIcon
			google.maps.event.addListener(map, 'click', function (event) {
				var cords = new Array(event.latLng.lat(), event.latLng.lng());
				myPositions.push(cords)
				myIcons.push(myIcon)
				if (document.getElementById("popupSelect").checked == true) {
					var popupInfo = document.getElementById("popupInfo").value
				}
				else {var popupInfo = ""};
				myContent.push(popupInfo);
				i++
				var marker = new google.maps.Marker({
					position: event.latLng,
					icon: myIcon,
					map:map
				});
				if (document.getElementById("popupSelect").checked == true) {
					
					//grabs content from html form/sets onclick popup
					var infoWindow = new google.maps.InfoWindow({
						content: document.getElementById("popupInfo").value,
					})
					
					google.maps.event.addListener(marker, 'click', function() {
						infoWindow.open(map, marker);
					});
					
				};
			markerArray.push(marker)
				})
		}
	
		function deleteMarkers() {
			if (markerArray) {
				for (i in markerArray) {
				markerArray[i].setMap(null);
				}
			markerArray.length = 0;
			myPositions.length = 0;
			myIcons.length = 0;
			myContent.lenth=0;
			google.maps.event.clearListeners(map, 'click');
			document.getElementById("currentIcon").src = "http://aidianholder.net/images/mapicons/blank.png"
			}
		};
	
		function clearMarkers() {
			google.maps.event.clearListeners(map, 'click');
			document.getElementById("currentIcon").src = "http://aidianholder.net/images/mapicons/blank.png"
			document.getElementById("popupSelect").checked = false;
			document.getElementById("popupInfo").value = ""
		};
	
		function captureSnapshot() {
			var newCenterLat = map.getCenter().lat();
			var newCenterLng = map.getCenter().lng();
			var newZoom = map.getZoom();
			var snapshotHead=	"&#60html&#62&#60head&#62&#60style type=\"text\/css\"&#62 html { height: 100% } body { height: 100%; margin: 0px; padding: 0px } &#60\/style&#62 &#60script type=\"text\/javascript\" src=\"http://maps.google.com/maps/api/js?sensor=false\"&#62 &#60\/script&#62 &#62 &#60script type=\"text\/javascript\" src=\"http://code.jquery.com/jquery-1.5.1.min.js\"&#62 &#60\/script&#62 &#60script type=\"text\/javascript\"&#62 "
			var snapshotBody=
	
			"&#60\/script&#62&#60/head&#62&#60body&#62" +
			"&#60div id=\"map_div\" style=\"width:295px;height:295px;\"&#62" +
			"&#60\/div&#62&#60\/body&#62&#60\/html&#62"
		var snapshotScript= 
			"$(\"map_div\").ready(function() { var mapOptions = { center: new google.maps.LatLng("  + newCenterLat + "," + newCenterLng + "), zoom: "	+ newZoom +
			", mapTypeId: google.maps.MapTypeId.ROADMAP }; map = new google.maps.Map(document.getElementById(\"map_div\"), mapOptions);" 
		if (myPositions.length > 0){
			var snapshotMarkers = ""
			for(i=0;i<myPositions.length;i++){
				markerId = "pushpin" + ((i + 1).toString());
				latCord= myPositions[i][0];
				lngCord= myPositions[i][1];
				markerIcon= myIcons[i];
				windowContent= myContent[i];
				snapshotMarkers += 
					"var " + markerId + "= new google.maps.Marker({position: new google.maps.LatLng(" + latCord + "," + lngCord + "), icon: " +  '"' + markerIcon + '"' + " , map:map});"
				if (windowContent.length > 0) {
				
					windowId = "infoWindow" + ((i + 1).toString());
					snapshotMarkers +=
					"var " + windowId + "=new google.maps.InfoWindow({content: \"" + windowContent + "\"});"
					snapshotMarkers +=
					"google.maps.event.addListener(" + markerId + ", \"click\", function() {" + windowId + ".open(map, " + markerId + ")});"
				}
			}
			snapshotScript += snapshotMarkers
			};
		outputHTML = snapshotHead + snapshotScript + "})" + snapshotBody
		document.getElementById("outputDiv").innerHTML = 
		snapshotHead+ snapshotScript+ "})" + snapshotBody
		};
	
	
	