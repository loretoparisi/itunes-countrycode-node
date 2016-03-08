### itunes-countrycode-node
Retrieve (StoreFrontId, CountryCode) tuples used in  iTunes Search API

###Example

```javascript
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
  LPStoreFront.writeToFile('itunes_storefrontid_'+now,json, function(error) {
      if(error) { console.log("unable to write json"); return; }
      console.log("StoreFront updated.");
  });

});
```

###Output
The script output is a associative array with `ISO 3166-1` country code as keys. The value contains
- `itunes_storefront_id` The iTunes StoreFrontID to be used with iTunes Search API
- `country_code` The `ISO 3166-1` country code
- `country_name` The name of the country

```json
{
"IT": {
        "country_name": "Italy",
        "country_code": "IT",
        "itunes_storefront_id": " 143450"
    }
}
```

###Usage
node itunes.js 

###Note
- The data source is the iTunes Affiliate page: https://affiliate.itunes.apple.com/resources/documentation/linking-to-the-itunes-music-store/
- The page is parsed throught [import.io](https://www.import.io/) into a json.
