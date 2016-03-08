/**
* iTunes Utils
* @author Loreto Parisi (loretoparisi at musixmatch dot com)
*/

var https = require('https');
var fs = require('fs');

/**
 * Helper Class to retrieve data from AppleStore
 */
LPStoreFront = {

  /**
   * Updates iTunes Store Front list
   * Original API source: URL: https://affiliate.itunes.apple.com/resources/documentation/linking-to-the-itunes-music-store/
   */
  update : function(callback) {
    this.get('api.import.io',
    '/store/connector/cd7bd7c9-7d40-4198-a850-bcfdf662477d/_query?input=webpage/url:https%3A%2F%2Faffiliate.itunes.apple.com%2Fresources%2Fdocumentation%2Flinking-to-the-itunes-music-store%2F&&_apikey=ed7a8d4261e04c11a881022e1e05fc08dcbc917a6ea53891970ac256c10fb0e95d9b30328336908e598d38790f3b2e8b1bbb805ca0d43889d6e0c85f2ef662e36cd1001185fa7e93d3d63005bd16db33',
    callback,
    true)
  },

  /**
   * HTTP GET
   */
  get : function(host,path,callback,json) {
    var self=this;
    return https.get({
        host: host,
        path: path
    }, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            callback( json?JSON.parse(body):body );
        });
    });
  },

  /**
  * Write a file atomically
  */
  writeToFile : function(fname,fcontents,done) {
    fs.writeFile(fname, fcontents, function(err) {
        if(err) {
            console.log('Error writing file %s', fname, err);
            if(done) return done(err);
        }
        console.log("The file %s was saved!", fname);
        if(done) return done();
    });
  },

  /**
   * Read file contents
   * @param json bool Parse as json
   */
  readFile: function(fname, done, json) {
    fs.readFile(fname, 'utf8', function (err, data) {
      if (err) {
        if(done) done();
        return;
      }
      if(json) data = JSON.parse(data);
      if(done) done(data);
    });
  }
} //MXMStoreFront

LPStoreFront.update(function(items) {
  var STOREFRONT = {};
  var results=items.results.splice(1,items.results.length);
  results.forEach(function(item) {
    var els=item['name'].split(/([A-Z][A-Z])/);
    var store = {
      'country_name' : els[0].trim(),
      'country_code' : els[1],
      'itunes_storefront_id' : els[2]
    };
    STOREFRONT[ els[1] ] = store
  });

  var json=JSON.stringify( STOREFRONT) ;
  var now = (new Date()).getTime();
  LPStoreFront.writeToFile('itunes_storefrontid_'+now+'.json',json, function(error) {
      if(error) { console.log("unable to write json"); return; }
      console.log("StoreFront updated.");
  });

});
