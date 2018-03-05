function setupMenu(error, options, response){
//callback function once menu data loaded from backend

// console.log(response);

$('#menuTable tbody td:first-child').each(function() {
    $("#selectRoot").append("<option>" +  $(this).text() + "</option>");
});

$(function() {
    $('#selectRoot').selectmenu({
        change: function() {
            conjugateUpdate();
        }
    });
});

$(function() {
    $('#selectSubject').selectmenu({
        change: function() {
            conjugateUpdate();
        }
    });
});


//deprecate
// $('#menuTable tbody td:first-child').each(function() {
//     $("#menuOfRoots").append("<li><div>" +  $(this).text() + "</div></li>");
// });
//
// $( "#menuOfRoots" ).menu();
//
// $( "#menuOfRoots li" ).click(function() {
//     conjugateUpdate( $(this).text() );
// });

}


jQuery( document ).ready(function() {

//set up jQuery UI and default conjugation
    conjugateUpdate( ar_Do, pro_he );

    $( document ).tooltip();

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

//wipe dataTable in advance of XHR
$('#dataTable').html("");

$('#dataTable').sheetrock({
    url: gURL,
    query: "select A,B,C,D,E,F,G,H,I,J order by C desc",
    labels: ['Form', 'Preposition', 'Root', 'Masdar', 'f1ActivePresentRad2', 'f1ActivePastRad2', 'f1Imperative0Rad2', 'Translation', 'TBD', 'Comment' ],
    callback: setupData

  //where A = 1
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

    $( "#thButtons" ).dblclick(function() {
    //** initially opaque button used for testing **
        $( ".hideMe" ).toggle();
        $( "#btnFoo" ).css({"opacity": "1"});
    });

});


function makeReferenceObject() {

    refs = {
    //contains reference data downloaded from backend
        headers: scrapeReference(false),
        rows: scrapeReference(true),

        indexRow: function( root, form) {

            var rootPos = $.inArray( "Root", refs.headers ),
            formPos = $.inArray( "Form", refs.headers ),
            rowIndex = -1;
            //rowIndex default is -1, to avoid returning null and match behavior of array.indexOf

            refs.rows.forEach(function( currentValue, index ) {
                if (( currentValue[rootPos] === root ) && ( eval(currentValue[formPos]) === form )) {
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


function conjugateUpdate( root, arSubject) {
//Updates data tables with conjugated verbs/nouns
//Recommended no params passed so function reads from web page.  Need params for initial loading of page.

    if ( root === undefined ) { root = $("#selectRoot").val(); }
    if ( arSubject === undefined ) { arSubject = $("#selectSubject").val(); }

//Display active root on table and in title
    document.title = "LtCactus Conjugates " + root;
    jQuery("#activeRoot").html( root );

//Force display of all header cells
    $( "#contentTable thead th" ).show();

//Draw table rows
    jQuery("#contentTable tbody").html( drawRows(root, arSubject ) );

//Update formatting of rows with known-good forms

    var objRefs = makeReferenceObject();

    for (var formNum = 1; formNum <= 10; ++formNum ) {

        if ( objRefs.indexRow(root, formNum) > -1) {
            jQuery( "#contentTable tr:nth-child("+formNum+") td").css({"color": "black"});
        } else {
            jQuery( "#contentTable tr:nth-child("+formNum+") td").css({"color": "dimgrey", "font-size": "medium"});

        }
    }

}


function scrapeReference( blnRowsNotHeader ) {
//scrapes reference table downloaded from backend into arrays

    var arrRow = [],
        arrRows = [];

   if ( blnRowsNotHeader === false ) {
        $( "#dataTable th" ).each(function(colIndex) {
            arrRow.push( $(this).text() );
        });

        return arrRow; //1D array of header (ths)

    } else {

        $( "#dataTable tbody tr" ).each(function(rowIndex) {

            $(this).find("td").each (function(colIndex) {
                arrRow.push( $(this).text() );
            });

            arrRows.push( arrRow );
            arrRow = [];
        });

        return arrRows; //2D array of arrays (rows + tds)
    }

}


function setupData() {
//callback function after google sheet query is complete

}


function drawRows(root, arSubject){
//controller function for writing out each row

if ( arSubject === undefined ) {
    arSubject = pro_he;
}

var objRefs = makeReferenceObject();
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

for (var formNum = 1; formNum <= 10; ++formNum ) {

//add checks to re-style row text (color) if verb / noun(s) found

//write noun columns
    htmlOut += "<tr> ";
    htmlOut += conjActiveParticiple(root, formNum).replace(/.*/,"<td class='colNoun'>"+ '$&' +"</td>");
    htmlOut += conjPassiveParticiple(root, formNum).replace(/.*/,"<td class='colNoun'>"+ '$&' +"</td>");
    htmlOut += conjNounTimePlace(root, formNum).replace(/.*/,"<td class='colNoun'>"+ '$&' +"</td>");
    htmlOut += conjMasdar(root, formNum, objRefs).replace(/.*/,"<td class='colNoun'>"+ '$&' +"</td>");

//write verb columns
    htmlOut += "<td class='colVerb'>" + verbalize(root, formNum, "present", false, arSubject)       +"</td>";
    htmlOut += "<td class='colVerb'>" + verbalize(root, formNum, "past", false, arSubject)          +"</td>";
    htmlOut += "<td class='colVerb'>" + verbalize(root, formNum, "imperative", false, arSubject)    +"</td>";
    htmlOut += "<td class='colVerb'>" + verbalize(root, formNum, "present", true, arSubject)        +"</td>";
    htmlOut += "<td class='colVerb'> <span>"+ verbalize(root, formNum, "past", true, arSubject) + "</span>" ;
    htmlOut += "                     <span class='spnPreposition'> "+ objRefs.query(root, formNum, "Preposition") + "</span></td>";

//write out meta columns
    htmlOut += "<td class='colFormNum'>" + arrFormNum[formNum] +"</td>";
    htmlOut += "<td class='colMeaning'>" + arrMeaning[formNum] +"</td>";
    htmlOut += "<td class='colTranslation'>" + arrFormNum[formNum] +"</td>";
    htmlOut += " </tr>";
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
    } else {
        vowelOut = "؟";
    }

return vowelOut;

}