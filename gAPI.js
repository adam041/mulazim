// function start() {
//   // 2. Initialize the JavaScript client library.
//   gapi.client.init({
//     'apiKey': 'AIzaSyC4vlPwyriHP25IfeiTOyt7q7RLUH3tMd8',
//     // Your API key will be automatically added to the Discovery Document URLs.
//     'discoveryDocs': ['https://people.googleapis.com/$discovery/rest'],
//     // clientId and scope are optional if auth is not required.
//     'clientId': '591987665520-ptdhri1grevebmvnb3ndmoju26j3kjkq.apps.googleusercontent.com',
//     'scope': 'profile',
//   }).then(function() {
//     // 3. Initialize and make the API request.
//     return gapi.client.people.people.get({
//       'resourceName': 'people/adam.kotkin1',
//       'requestMask.includeField': 'person.names'
//     });
//   }).then(function(response) {
//     console.log(response.result);
//   }, function(reason) {
//     console.log('Error: ' + reason.result.error.message);
//   });
// };


function start() {
  // 2. Initialize the JavaScript client library.
  gapi.client.init({
    'apiKey': 'AIzaSyC4vlPwyriHP25IfeiTOyt7q7RLUH3tMd8',
    // Your API key will be automatically added to the Discovery Document URLs.
    'discoveryDocs': ['https://people.googleapis.com/$discovery/rest'],
    // clientId and scope are optional if auth is not required.
    'clientId': '591987665520-ptdhri1grevebmvnb3ndmoju26j3kjkq.apps.googleusercontent.com',
    'scope': 'profile',
  }).then(function() {
    // 3. Initialize and make the API request.
    return gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: "1A5YkYEKrReJ3jjAraR4ycbLIOHf3a_k6-3FM6uh-7Gw",
      range: "roots"
      });
    }).then((response) => {
      var result = response.result;
      var numRows = result.values ? result.values.length : 0;
      console.log(`${numRows} rows retrieved.`);
    });
};


// 1. Load the JavaScript client library.
 gapi.load('client', start);


// gapi.client.sheets.spreadsheets.values.get({
//   spreadsheetId: "1A5YkYEKrReJ3jjAraR4ycbLIOHf3a_k6-3FM6uh-7Gw",
//   range: "roots"
// }).then((response) => {
//   var result = response.result;
//   var numRows = result.values ? result.values.length : 0;
//   console.log(`${numRows} rows retrieved.`);
// });
