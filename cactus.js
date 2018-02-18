/*
Work list

- styling

-core logic
    -add all tab with nouns+verbs?
    -handling irregular verbs

-backend / data quality
    -pull jQuery menu inputs (from google sheet?)
        -- try gAPI from github.io (prohibited from local host)

        -- read backend and apply correct masdar pattern (i.e. 1..., 2..., null gets both)
        -- dynamic highlighting to show known words and/or suppress unknown (missing) words
    -handling of prepositions related to verb forms?
    -english translations (mouseover?)

-secondary features
    -within tense conjugation (i.e. for all subjects; add column on left)
    -translation by mouseover or appended column
*/


jQuery( document ).ready(function() {

//Pull menu data from backend

var gURL = 'https://docs.google.com/spreadsheets/d/1A5YkYEKrReJ3jjAraR4ycbLIOHf3a_k6-3FM6uh-7Gw/edit#gid=0';


$('#demoTable').sheetrock({
  url: gURL,
  query: "select A,B,C,D,E,F where A = 1 order by A desc"
});

//Implement click controls for menu
    $( "#menuOfRoots li" ).click(function() {
        conjugateUpdate( $(this).text() );
    });

});

// var gSheetID = "1A5YkYEKrReJ3jjAraR4ycbLIOHf3a_k6-3FM6uh-7Gw",
//     gURL = "'https://docs.google.com/spreadsheets/d/" + gSheetID + "/edit#gid=0";

//
//




//garbage ...
//garbage ...
//garbage ...
//garbage ...

// var jsonCactus = {};

// gapi.client.sheets.spreadsheets.values.get({
//   spreadsheetId: "1A5YkYEKrReJ3jjAraR4ycbLIOHf3a_k6-3FM6uh-7Gw",
//   range: "roots"
// }).then((response) => {
//   var result = response.result;
//   var numRows = result.values ? result.values.length : 0;
//   console.log(`${numRows} rows retrieved.`);
//
// });
//

 //    $.getJSON(jsonURL, function (data) {
//
//         jQuery("#taDump").val( "xhr is done" );
//
//         jQuery("#taDump").val( data );
//
//     // Iterate the groups first.
//     $.each(data.response.venue.tips.groups, function (index, value) {
//
//         // Get the items
//
//         //entry.id[#].content[]
//
//         var items = this.items; // Here 'this' points to a 'group' in 'groups'
//
//         // Iterate through items.
//         $.each(items, function () {
//             console.log(this.text); // Here 'this' points to an 'item' in 'items'
//         });

//     jsonCactus = data;
//     });

// console says XHR for json works, but can't manipulate or read object =( **** callback not firing
//     console.log( jsonCactus );

//^^ end garbage


function conjugateUpdate( root ) {
//Updates data tables with conjugated verbs/nouns

    arRoot.root = root;

    document.title = "LtCactus Conjugates " + arRoot.root;
    jQuery("#activeRoot").html( arRoot.root );

    var htmlTableRows = "";

    var arrNouns = [
        "NounTimePlace",
        "PassiveParticiple",
        "ActiveParticiple",
        "Masdar"
    ];

    var arrVerbs = [
        "PassivePresent",
        "PassivePast",
        "Imperative",
        "ActivePresent",
        "ActivePast"
    ];

    arrNouns.forEach(function(element) {
        htmlTableRows = "";
        for (var i = 1; i <= 10; ++ i) {
            htmlTableRows += "<tr> <td> " + arRoot.noun(element, i) + " </td> </tr> ";
            }
        jQuery("#rows"+element).html( htmlTableRows );
    });

    arrVerbs.forEach(function(element) {
        htmlTableRows = "";
        for (var i = 1; i <= 10; ++ i) {
            htmlTableRows += "<tr> <td> " + arRoot.verb(element, i) + " </td> </tr> ";
            }
        jQuery("#rows"+element).html( htmlTableRows );
    });
};


$( function() {
    $( "#menuOfRoots" ).menu();
    $( "#tabsC" ).tabs();
} );


arRoot = {
//** is there a better way to declare object?
};