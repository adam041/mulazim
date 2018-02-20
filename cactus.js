/*
Work list

-core logic
    -handling irregular verbs

-backend / data quality
    -pull jQuery menu inputs (sheetrock.js from gSheet!)
        -- read backend and apply correct masdar pattern (i.e. 1..., 2..., null gets both)
        -- dynamic highlighting to show known words and/or suppress unknown (missing) words
        -- handling of prepositions related to verb forms?
        -- english translations (mouseover?)

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
  labels: ['Form', 'Preposition', 'Root', 'PresentStem', 'Masdar', 'TransVerb']
//callback:
});


$( "#buttonA" ).click(function() {

    var targetElement = "table#formDescriptionTable";
    $( targetElement ).toggle();

});

});


function backendArray() {
//returns array containing rows from backend data table, for more dynamic conjugating...

//****
//objectify data and dredge up getValue to get value(s) corresponding to field label?
//or preserve google response object?

var arrHeaders = new Array,
    arrRows = new Array,
    arrRow = new Array;

    $( "#dataTable th" ).each(function(colIndex) {
        arrHeaders.push( $(this).text() );
    });

    $( "#dataTable tbody tr" ).each(function(rowIndex) {

        $(this).find("td").each (function(colIndex) {
            arrRow.push( $(this).text() );
        });

        arrRows.push( arrRow );
        arrRow = [];

    });

    return arrRows;
}


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
} );


arRoot = {
//** is there a better way to declare object?
};