jQuery( document ).ready(function() {
//set up jQuery UI and default conjugation

//need to have some data available for conjugateUpdate before backend loads
objRefs = makeReferenceObject();

//conjugate page with default parameters
conjugateUpdate( ar_Do, pro_he );

//activate chosen enhancements for select elements
$(function() {

    $("#chosenRoot").chosen({
        rtl: true,
        width: "45%",
    });

    $("#chosenSubject").chosen({
        disable_search_threshold: 10,
        rtl: false,
        width: "30%",
    });

    $("#chosenRoot").chosen().change(function(){
        conjugateUpdate( $("#chosenRoot").val(), $("#selectSubject").val() );
    });

    $("#chosenSubject").chosen().change(function(){
        conjugateUpdate( $("#chosenRoot").val(), $("#selectSubject").val() );
    });

});

//Pull menu data from backend
    var gSheetID = "1A5YkYEKrReJ3jjAraR4ycbLIOHf3a_k6-3FM6uh-7Gw",
        gURL = "'https://docs.google.com/spreadsheets/d/" + gSheetID + "/edit#gid=0";

//wipe dataTable in advance of XHR
$('#dataTable').html("");

$('#dataTable').sheetrock({
    url: gURL,
    query: "select A,B,C,D,E,F,G,H,I,J order by C asc, A asc",
    labels: ['Form', 'Preposition', 'Root', 'Masdar', 'f1ActivePresentRad2', 'f1ActivePastRad2', 'f1Imperative0Rad2', 'Translation', 'TBD', 'Comment' ],
    callback: setupData
});

//set up buttons to toggle column groups
    $( "#btnVerbs" ).click(function() {
        $( "th.colVerb, td.colVerb" ).toggle("fast");
    });

    $( "#btnNouns" ).click(function() {
        $( "th.colNoun, td.colNoun" ).toggle("fast");
    });

    $( "#btnMeaning" ).click(function() {
        $( ".colMeaning" ).toggle("fast");
    });

    $( "#btnTranslation" ).click(function() {
        $( "th.colTranslation, td.colTranslation" ).toggle("fast");
    });

    $( "#btnPrepositions" ).click(function() {
        $( ".spnPreposition" ).toggle("fast");
    });

//set up double-click to focus on verbs/nouns
    $( "#btnVerbs" ).dblclick(function() {
        $( ".colVerb" ).show("fast");
        $( ".colNoun" ).hide("fast");
    });

    $( "#btnNouns" ).dblclick(function() {
        $( ".colVerb" ).hide("fast");
        $( ".colNoun" ).show("fast");
    });

    $( "tfoot" ).dblclick(function() {
    //** initially opaque button used for testing **
        $( ".hideMe" ).toggle();
    });

    $( "#divSelectors" ).dblclick(function() {
        drawAllSubjects();
    });


$( document ).tooltip();

});


function makeReferenceObject() {

    refs = {
    //contains reference data downloaded from backend
        headers: structureReference("dataTable").header,
        rows: structureReference("dataTable").rows,
        json: structureReference("dataTable").json,

        indexRow: function( root, form) {

            var rootPos = $.inArray( "Root", refs.headers ),
            formPos = $.inArray( "Form", refs.headers ),
            rowIndex = -1;
            //rowIndex default is -1, to avoid returning null and match behavior of array.indexOf

            refs.rows.forEach(function( currentValue, index ) {
                if ( ( currentValue[rootPos] === root ) && ( parseInt(currentValue[formPos]) === form ) ) {
                    rowIndex = index;
                }
            });

            return rowIndex;

        }, //end of indexRow

        query: function(root, form, field) {
        //returns value from field in corresponding row

            var fieldPos = $.inArray( field, refs.headers ),
                rowIndex = refs.indexRow(root, form),
                output;

            if (rowIndex > -1) {
                output = refs.rows[rowIndex][fieldPos];
            }

            if (output === undefined) {
                output = "";
            }

            return output;
        }

    }; //end of Refs

    return refs;
}


function conjugateUpdate( arRoot, arSubject) {
//Updates data tables with conjugated verbs/nouns
//Recommended no params passed so function reads from web page.  Need params for initial loading of page.

    if ( arRoot === undefined ) { arRoot = $("#chosenRoot").val(); }
    if ( arSubject === undefined ) { arSubject = $("#chosenSubject").val(); }

//Wipe debug area
$( "#stage1").html( "PreProcessing".wrap("<h3>") );
$( "#stage2").html( "PostProcessing".wrap("<h3>") );
$( "#stage3").html( "".wrap("<h3>") );
$( "#stage4").html( "".wrap("<h3>") );

//Display active root on table and in title
    document.title = "Conjugations of " + arRoot;
    jQuery("#activeRoot").html( arRoot );

//Force display of all header cells
    $( "#contentTable thead th" ).show();

//Draw table rows
    jQuery("#contentTable tbody").html( drawRow( arRoot, arSubject ) );

//Update formatting of rows with known-good forms
    for (var formNum = 1; formNum <= 10; ++formNum ) {

        if ( objRefs.indexRow(arRoot, formNum) > -1) {
            jQuery( "#contentTable tr:nth-child("+formNum+") td").css({"color": "black"});
        } else {
            jQuery( "#contentTable tr:nth-child("+formNum+") td").css({"color": "dimgrey", "font-size": "medium"});
        }
    }

}


function drawAllSubjects() {
//mostly intended for debugging, the UI is ugly

var arRoot = $("#chosenRoot").val(),
    arSubject = "",
    dividerRow = "";
    dividerRowTemp = "";

for (var i = 1; i <= 11; ++i ) {
    dividerRow += "<td> </td>";
}

//wipe table
    jQuery("#contentTable tbody").html( "" );

//iterate & conjugate through all possible subject choices
$( "#chosenSubject option").each( function( index, element ) {
    arSubject = element.value;
    dividerRowTemp = (dividerRow + element.value.wrap("<td>") ).wrap("<tr>");
    jQuery("#contentTable tbody").append( dividerRowTemp );
    jQuery("#contentTable tbody").append( drawRow( arRoot, arSubject ) );
});

}


function structureReference( tableID ) {
//organize row into an 1D array of headers, 2D array of data rows, and an array of key-value pairings

var fieldPos = -1,
    arrHeaderRow = [],
    arrRow = [],
    objRow = {},
    arrRows = [],
    arrJson = [];

//structure header
    $( "#" + tableID + " th" ).each(function(colIndex) {
        arrHeaderRow.push( $(this).text() );
    });

//get "column" position of fields
var xForm = $.inArray( "Form", arrHeaderRow ),
    xPreposition = $.inArray( "Preposition", arrHeaderRow ),
    xRoot = $.inArray( "Root", arrHeaderRow ),
    xMasdar = $.inArray( "Masdar", arrHeaderRow ),
    xf1ActivePresentRad2 = $.inArray( "f1ActivePresentRad2", arrHeaderRow ),
    xf1ActivePastRad2 = $.inArray( "f1ActivePastRad2", arrHeaderRow ),
    xf1Imperative0Rad2 = $.inArray( "f1Imperative0Rad2", arrHeaderRow ),
    xTranslation = $.inArray( "Translation", arrHeaderRow ),
    xComment = $.inArray( "Comment", arrHeaderRow );

//structure body
    $( "#" + tableID + " tbody tr" ).each(function(rowIndex) {

        //org table row into an array
        $(this).find("td").each (function(colIndex) {
            arrRow.push( $(this).text() );
        });

        //org array into object
        objRow = {
            Root: arrRow[xRoot],
            Form: arrRow[xForm],
            Preposition: arrRow[xPreposition],
            Masdar: arrRow[xMasdar],
            f1ActivePresentRad2: arrRow[xf1ActivePresentRad2],
            f1ActivePastRad2: arrRow[xf1ActivePastRad2],
            f1Imperative0Rad2: arrRow[xf1Imperative0Rad2],
            Translation: arrRow[xTranslation],
            //TBD
            Comment: arrRow[xComment],
        };

        //save row to arrays, then  wipe row variable
        arrRows.push( arrRow );
        arrJson.push( objRow) ;

        arrRow = [];
        objRow = {};

    });

var output = {
    header: arrHeaderRow,
    rows: arrRows,
    json: arrJson,
    };

return output;
}



function setupData() {
//callback function after google sheet query is complete

// console.log(response);

//objRefs should be global!
    objRefs = makeReferenceObject();

var oldRoot = "placeholder",
    appendHTML = "";

    objRefs.json.forEach( function( row, index ) {
    //assumption: json data is sorted by root (asc) and formNum (asc)

        if ( row.Root !== oldRoot ) {
            appendHTML = (row.Translation + " / " + row.Root).wrap("<option value='" + row.Root + "'>");
            $("#chosenRoot").append( appendHTML );
        }
        oldRoot = row.Root;
    });

    $("#chosenRoot").trigger("chosen:updated");

}


function drawRow(arRoot, arSubject){
//controller function for writing out each row

if ( arSubject === undefined ) {
    arSubject = pro_he;
}

var htmlOut = "";

//Declare data arrays
var arrFormNum = [
        "ignore#FormNums",
        "I ",
        "II ",
        "III ",
        "IV ",
        "V ",
        "VI ",
        "VII ",
        "VIII ",
        "IX ",
        "X "];

var arrMeaning = [
    "ignore#Meanings",
    "Regular ",
    "Causative ",
    "Participation, Reciprocal ",
    "Causative ",
    "Reflexive ",
    "Reciprocal, Pretension ",
    "Passive, Responsive ",
    "Participative, Reflexive ",
    "Colors, Defects ",
    "Pretending, Requesting Change, Usage "];

//Write out rows, one td at a time

//but first, generate data
    var colPassiveImperfect = cnjVerb(arRoot, "imperfect", false,  arSubject),
        colPassivePerfect = cnjVerb(arRoot, "perfect", false,  arSubject),
        colImperative,      //  TBD
        colActiveImperfect = cnjVerb(arRoot, "imperfect", true,  arSubject),
        colActivePerfect = cnjVerb(arRoot, "perfect", true,  arSubject);

for (var formNum = 1; formNum <= 10; ++formNum ) {

//write noun columns
    htmlOut += "<tr>";
    htmlOut += conjActiveParticiple(arRoot, formNum).wrap("<td class='colNoun'>");
    htmlOut += conjPassiveParticiple(arRoot, formNum).wrap("<td class='colNoun'>");
    htmlOut += conjNounTimePlace(arRoot, formNum).wrap("<td class='colNoun'>");
    htmlOut += conjMasdar(arRoot, formNum).wrap("<td class='colNoun'>");

//write verb columns
    htmlOut += whole(colPassiveImperfect[formNum]).wrap("<td class='colVerb'>");
    htmlOut += whole(colPassivePerfect[formNum]).wrap("<td class='colVerb'>");
    htmlOut += verbalize(arRoot, formNum, "imperative", false, arSubject).wrap("<td class='colVerb'>"); //old way
    htmlOut += whole(colActiveImperfect[formNum]).wrap("<td class='colVerb'>");
    htmlOut += "<td class='colVerb'>";
    htmlOut +=  whole(colActivePerfect[formNum]).wrap("<span>");
    htmlOut +=  (" " + objRefs.query(arRoot, formNum, "Preposition") ).wrap("<span class='spnPreposition'>") + "</td>";

//write out meta columns
    htmlOut += arrFormNum[formNum].wrap("<td class='colFormNum'>");
    htmlOut += arrMeaning[formNum].wrap("<td class='colMeaning'>");
    htmlOut += objRefs.query(arRoot, formNum, "Translation").wrap("<td class='colTranslation'>");
    htmlOut += "</tr>";
//maintenance note:  htmlOut = htmlOut.wrap("<tr>");  //doesn't work

}

return htmlOut;

}


function vowelMe(enText) {
//generates Arabic (short) vowels corresponding to English text input

var vowelOut = "";

    if (( enText === undefined) || (enText === "") ) {
        vowelOut = "؟";
    } else if (enText === "a") {
        vowelOut = ar_a;
    } else if (enText === "i") {
        vowelOut = ar_i;
    } else if (enText === "u") {
        vowelOut = ar_u;
    } else if (enText === "A") {
        vowelOut = ar_A;
    } else if (enText === "Y") {
        vowelOut = ar_Y;
    } else if (enText === "U") {
        vowelOut = ar_U;
    } else if (enText === "-") {
        vowelOut = "";
    } else {
        vowelOut = "؟";
    }

return vowelOut;

}


function prefixVowel(formNum, isActive) {
//returns vowel accompanying prefix of present stem of verb

    if ( isActive === undefined ) {
        isActive = true;
    }

    if ( isActive === true ) {
        switch (formNum) {

            case 2:
            case 3:
            case 4:
                return ar_u;

            case 1:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
                return ar_a;

            default:
                return "؟";
        }
    } else {
        return ar_u;
    }

}


function jqAlert( htmlAlert ) {

    $( "#divAlert" ).html( htmlAlert );

    $( function() {
        $( "#divAlert" ).dialog();
    });
}


function isShortVowel( charIn, shaddaToo ) {
//returns true if string is Arabic short vowel or sukkun
//     smaller sized vowels: 1560-1562 << true
//     regular sized short vowels and markings: 1611-1616 << true
//     shadda: 1617 << it depends
//     sukkun: 1618 << true

if ( charIn === undefined ) {
    console.log("Error, null passed to isShortVowel");
    return false;
}

if ( shaddaToo === undefined ) {
    shaddaToo = false;
}

var answer = false;

if  ( ( ( charIn.charCodeAt(0) >= 1560 ) && ( charIn.charCodeAt(0) <= 1562 ) ) ||
      ( ( charIn.charCodeAt(0) >= 1611 ) && ( charIn.charCodeAt(0) <= 1616 ) ) || ( charIn.charCodeAt(0) === 1618 )
    ) { answer = true; }

if (( shaddaToo ) && ( charIn.charCodeAt(0) === 1617 )) {
    answer = true;
}

return answer;
}


function isLongVowel( charIn ) {
//returns true if string is Arabic long vowel, excludes hamza carriers

// alef 1575
// waw 1608
// alef maksura 1609
// yeh (2 dots) 1610

if ( charIn === undefined ) {
    console.log("Error, null passed to isLongVowel");
    return false;
}

var answer = false;

if  ( ( ( charIn.charCodeAt(0) >= 1608 ) && ( charIn.charCodeAt(0) <= 1610 ) ) ||
      ( charIn.charCodeAt(0) === 1575 )
    ) { answer = true; }

return answer;
}


//do i still need this? **
String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}