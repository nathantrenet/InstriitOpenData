/**
 * Find the city of the given coordinates in the geoJson format
 * Only supports "point" as geometry types
 * @param {Object} geo - the coordinates in geoJson format
 * @return {Object|Boolean} a city ressource, or false on error
 */
function findCityFromGeo(geo) {
  if (!geo)
    return false;
  var city = {};
  if (geo.geometry !== undefined) {
    if (geo.geometry.type == "Point") {
      var coord = geo.geometry.coordinates;
      if (typeof coord["map"] == "function") {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function() {
          if (req.readyState == 4 && req.status == "200") {
            console.log(req.responseText);
          }
        };
        req.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + coord, true);
        req.send();
      }
    }
  }
}

function loadJSON(pathFile, callback) {
  var req = new XMLHttpRequest();
  req.overrideMimeType("application/json");
  req.open('GET', pathFile, true);
  req.onreadystatechange = function () {
    if (req.readyState == 4 && req.status == "200") {
      console.log(req);
      callback(req.responseText);
    }
  };
  req.send();
}

function test() {
  loadJSON('./Ressources/test_data.json', function(data) {
    findCityFromGeo(JSON.parse(data));
  });
}
