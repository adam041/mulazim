/*
Work list

-core logic
    -handling irregular verbs

-backend / data quality
    -pull jQuery menu inputs (sheetrock.js from gSheet!)
        -- read backend and apply correct masdar pattern (i.e. 1..., 2..., null gets both)
        -- dynamic highlighting to show known words and/or suppress unknown (missing) words
        -- handling of prepositions related to verb forms?
        -- english translations via tool tip (or inject html into span in meaning column)

-secondary features
    -within tense conjugation (i.e. for all subjects; add column on left)
    -translation by mouseover or appended column
*/


function setupMenu(error, options, response){
//callback function once menu data loaded from backend

// console.log(response);

$('#menuTable tbody td:first-child').each(function() {
    $("#menuOfRoots").append("<li><div>" +  $(this).text() + "</div></li>");
});

$( "#menuOfRoots" ).menu();

$( "#menuOfRoots li" ).click(function() {
    conjugateUpdate( $(this).text() );
});

}


jQuery( document ).ready(function() {

//set up tabs and default conjugation
    $( "#tabsC" ).tabs();
    conjugateUpdate( "فعل" );


//Pull menu data from backend
    var gSheetID = "1A5YkYEKrReJ3jjAraR4ycbLIOHf3a_k6-3FM6uh-7Gw",
        gURL = "'https://docs.google.com/spreadsheets/d/" + gSheetID + "/edit#gid=0";

$('#menuTable').sheetrock({
//query for distinct roots
  url: gURL,
  query: "select C, COUNT(C) group by C order by C",
  labels: ['Root'],
  callback: setupMenu
});

$('#dataTable').sheetrock({
  url: gURL,
  query: "select A,B,C,D,E,F where A = 1 order by C desc",
  labels: ['Form', 'Preposition', 'Root', 'PresentStem', 'Masdar', 'TransVerb'],
  callback: setupData
});


$( "#buttonA" ).click(function() {

    var targetElement = "table#formDescriptionTable";
    $( targetElement ).toggle();


//prototype of data access function
    var foo = "فعل";
    var objFoo = loadData();
    console.log( "find me fayl 1 PresentStem" );
    console.log( objFoo.query(foo, 1, "PresentStem") ); // works



});

});


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

//mirror noun/verb tables to combined tab
    jQuery("#nounTableMirror").html( $("#nounTable").clone() );
    jQuery("#verbTableMirror").html( $("#verbTable").clone() );

};


$( function() {
    $( "#tabsC" ).tabs();
    $( document ).tooltip();
} );

var arRoot = new Object;

function setupData() {
//callback function after google sheet query is complete

//     var objData = new Object;
//     objData = loadData();
}

$( loadData = function() {
//returns object containing header labels and data rows from backend data table, for more dynamic conjugating...

var arrRow = new Array;

//make object objBackend to organize backend data for local re-use
var objBackend = {

    headers: new Array,
    rows: new Array,
    output: new String,

        query(root, form, field) {

            //locate column position of desired field in header
            var rootPos = $.inArray( "Root", objBackend.headers ),
                formPos = $.inArray( "Form", objBackend.headers ),
                fieldPos = $.inArray( field, objBackend.headers );

            output = "0";

            objBackend.rows.forEach(function( currentValue, index ) {
                if (( currentValue[rootPos] === root ) && ( eval(currentValue[formPos]) === form )) {
    //              console.log( "match! @ " + currentValue);
                    output = currentValue[fieldPos];
                }

            });

            return output;

            }
    }

//scrape table to load objBackend
    $( "#dataTable th" ).each(function(colIndex) {
        objBackend.headers.push( $(this).text() );
    });

    $( "#dataTable tbody tr" ).each(function(rowIndex) {

        $(this).find("td").each (function(colIndex) {
            arrRow.push( $(this).text() );
        });

        objBackend.rows.push( arrRow );
        arrRow = [];

    });

    return objBackend;

} );