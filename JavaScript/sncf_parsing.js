function parseZip(addr, zip, com) {
    var res = [];
    var j = 0;
    for (var i = 0, currAddr; currAddr = addr[i++];) {
        if (currAddr.fields.code_postal == zip || (currAddr.fields.commune && currAddr.fields.commune.toLowerCase() == com.toLowerCase())) {
            res[j] = currAddr.fields;
            j++;
        }
    }
    return res;
}

function getSNCF(city, data, callback) {
    var results = JSON.parse(data);
    if (results) {
        callback(parseZip(results, city.postal_code.short_name, city.locality.long_name));
    }
}

function getJsonSNCF(callback) {
    loadJSON('./Ressources/refGareVoy.json', callback);
}
