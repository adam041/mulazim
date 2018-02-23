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

//set up jQuery UI and default conjugation
    conjugateUpdate( ar_Do );

    $( document ).tooltip();
    $( ".colNoun" ).toggle();
    $( ".colTranslation" ).toggle();

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
  query: "select A,B,C,D,E,F,G order by C desc",
  labels: ['Form', 'Preposition', 'Root', 'Masdar', 'f1ActivePresentRad2', 'f1ActivePastRad2', 'TransVerb'],
  callback: setupData

  //where A = 1
});

//set up buttons to toggle columns
    $( "#btnVerbs" ).click(function() {
        $( ".colVerb" ).toggle();
    });

    $( "#btnNouns" ).click(function() {
        $( ".colNoun" ).toggle();
    });

    $( "#btnMeaning" ).click(function() {
        $( ".colMeaning" ).toggle();
    });

    $( "#btnTranslation" ).click(function() {
        $( ".colTranslation" ).toggle();
    });

});

//***
var ar_Exit = "خرج";
//***

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
            })

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

    } //end of Refs

    return refs;
}


function conjugateUpdate( root ) {
//Updates data tables with conjugated verbs/nouns

//Display active root on table and in title
    document.title = "LtCactus Conjugates " + root;
    jQuery("#activeRoot").html( root );

//Draw table rows
    jQuery("#contentTable tbody").html( drawRows(root) );

//Update formatting of rows with known-good forms

    var objRefs = makeReferenceObject();

    for (var formNum = 1; formNum <= 10; ++formNum ) {

        if ( objRefs.indexRow(root, formNum) > -1) {
            jQuery( "#contentTable tr:nth-child("+formNum+") td").css({"color": "black"});
        } else {
            jQuery( "#contentTable tr:nth-child("+formNum+") td").css({"color": "dimgrey"});
        }
    }

};


function scrapeReference( blnRowsNotHeader ) {
//scrapes reference table downloaded from backend into arrays
    var arrRow = [],
        arrRows = [];

   if ( blnRowsNotHeader === false ) {
        $( "#dataTable th" ).each(function(colIndex) {
            arrRow.push( $(this).text() );
        })
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

};


function setupData() {
//callback function after google sheet query is complete

}


function drawRows(root){
//controller function for writing out each row

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
    htmlOut += conjPassivePresent(root, formNum).replace(/.*/,"<td class='colVerb'>"+ '$&' +"</td>");
    htmlOut += conjPassivePast(root, formNum).replace(/.*/,"<td class='colVerb'>"+ '$&' +"</td>");
    htmlOut += conjImperative(root, formNum, objRefs).replace(/.*/,"<td class='colVerb'>"+ '$&' +"</td>");
    htmlOut += conjActivePresent(root, formNum, objRefs).replace(/.*/,"<td class='colVerb'>"+ '$&' +"</td>");
    htmlOut += "<td class='colVerb'><span>"+ conjActivePast(root, formNum, objRefs);
        htmlOut += "</span> <span class='spnPreposition class=inherit'> "+ objRefs.query(root, formNum, "Preposition") + "</span>";

//write out meta columns
    htmlOut += arrFormNum[formNum].replace(/.*/,"<td class='colFormNum'>"+ '$&' +"</td>");
    htmlOut += arrMeaning[formNum].replace(/.*/,"<td class='colMeaning'>"+ '$&' +"</td>");
    htmlOut += objRefs.query(root, formNum, "TransVerb").replace(/.*/,"<td class='colTranslation'>"+ '$&' +"</td>");
    htmlOut += " </tr>";
}

return htmlOut;

};


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
        //** how to handle long vowels in irregular verbs?
        vowelOut = "؟";
    }

return vowelOut;

}




//crap follows

/*
objRoot = {
    root: root,

    verb: function(tense, formNum) {
        var objRefs = makeReferenceObject();

          switch (tense) {

            //Active Tense
            case "ActivePast":
                return conjActivePast(objRoot.root, formNum, objRefs);
                break;

            case "ActivePresent":
                return conjActivePresent(objRoot.root, formNum, objRefs );
                break;

            case "Imperative":
                return conjImperative(objRoot.root, formNum, objRefs);
                break;

            case "PassivePast":
                return conjPassivePast(objRoot.root, formNum);
                break;

            case "PassivePresent":
                return conjPassivePresent(objRoot.root, formNum);
                break;

            default:
              console.log("error, invalid tense entered");
              break;
              }
        }, // verb switch

    noun: function(tense, formNum) {
      var objRefs = makeReferenceObject();

      switch (tense) {

        case "Masdar":
            return conjMasdar(objRoot.root, formNum, objRefs);
            break;

        case "ActiveParticiple":
            return conjActiveParticiple(objRoot.root, formNum);
            break;

        case "PassiveParticiple":
            return conjPassiveParticiple(objRoot.root, formNum);;
            break;

        case "NounTimePlace":
            return conjNounTimePlace(objRoot.root, formNum);
            break;

        default:
          return "error"
          break;
        }

    } //noun switch


};  // arRoot
*/