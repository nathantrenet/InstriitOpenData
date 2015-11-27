/**
 * Find the city of the given coordinates in the geoJson format
 * Only supports "point" as geometry types
 * @param {Object} geo - the coordinates in geoJson format
 * @return {Object|Boolean} a city ressource, or false on error
 */
function findCityFromGeo(geo, callback) {
  if (!geo)
    return false;
  if (geo.geometry !== undefined && geo.geometry.type == "Point") {
    var coord = geo.geometry.coordinates;
    if (typeof coord["map"] == "function") {
      var req = new XMLHttpRequest();
      req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == "200")
          callback(req.responseText);
      };
      req.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + coord, true);
      req.send();
    }
  }
}

/**
 * Parse the given address_components
 * @param {Object} addr - an address_components from the call to the GMaps API
 * @return {Object} an associative array like where the key is the type of coordinates
 */
function parseAddress(addr) {
  var res = {};
  for (var i = 0, currAddr; currAddr = addr[i++];) {
    res[currAddr.types[0]] = {
      "short_name": currAddr.short_name,
      "long_name": currAddr.long_name
    }
  }
  return res;
}

/**
 * Load a JSON File from its path
 * @param {String} pathFile - the path to the json file
 * @param {Function} callback - the callback that will be given the json file in string format
 */
function loadJSON(pathFile, callback) {
  var req = new XMLHttpRequest();
  req.overrideMimeType("application/json");
  req.open('GET', pathFile, true);
  req.onreadystatechange = function () {
    if (req.readyState == 4 && req.status == "200")
      callback(req.responseText);
  };
  req.send();
}


function runTest() {
  loadJSON('./Ressources/test_fr.json', function(data) {
    findCityFromGeo(JSON.parse(data), function(res) {
      var results = JSON.parse(res).results;
      if (results) {
        city = parseAddress(results[0]["address_components"]);
        getJsonSNCF(function(data) {
          getSNCF(city, data, function(data) {
            console.log(data);
          });
        });
      }
    });
  });
}
