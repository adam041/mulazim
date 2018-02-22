/*
Work list
- styling
    - re-org html tables into One Big Table.  Nix tabs in favor of buttons to drive jQuery toggles (verbs, nouns, verbs+nouns, meaning, translation)
        >> buttons hide tbody TDs, but not TH

-core logic
    -handling irregular verbs
    -handling binary masdar in form 2/3 - encode as letter or arabic/arabic number?

-backend / data quality
    -pull jQuery menu inputs (sheetrock.js from gSheet!)
        -- dynamic highlighting to show known words and/or suppress unknown (missing) words
        -- handling of prepositions related to verb forms?
        -- record active past tense for form 1.  Maybe use active-past as basic form, and derive vowel-less root?

-secondary features
    - display translation per row
    - within tense conjugation (i.e. for all subjects; add column on left)
    - english translations of masdar via tool tip <title>, pull from dataTable
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
    conjugateUpdate( ar_Do );


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
});

$( "#btnVerbs" ).click(function() {
    $( ".cellVerb" ).toggle();
    //corresponding th/headers not getting toggled =(
});

$( "#btnNouns" ).click(function() {
    $( ".cellNoun" ).toggle();
    $( ".thNoun" ).toggle();
    //corresponding th/headers not getting toggled =(
});

$( "#btnMeaning" ).click(function() {
    $( ".cellMeaning" ).toggle();
});

$( "#btnTranslation" ).click(function() {
    $( ".cellTranslation" ).toggle();
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
            })

            return rowIndex;

        }, //end of indexRow

        query: function(root, form, field) {
        //returns value from field in corresponding row

            var fieldPos = $.inArray( field, refs.headers ),
                rowIndex = refs.indexRow(root, form);

                output = refs.rows[rowIndex][fieldPos];

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

};


$( function() {
    $( "#tabsC" ).tabs();
    $( document ).tooltip();
} );


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
    htmlOut += conjActiveParticiple(root, formNum).replace(/.*/,"<td class='cellNoun'>"+ '$&' +"</td>");
    htmlOut += conjPassiveParticiple(root, formNum).replace(/.*/,"<td class='cellNoun'>"+ '$&' +"</td>");
    htmlOut += conjNounTimePlace(root, formNum).replace(/.*/,"<td class='cellNoun'>"+ '$&' +"</td>");
    htmlOut += conjMasdar(root, formNum, objRefs).replace(/.*/,"<td class='cellNoun'>"+ '$&' +"</td>");

//write verb columns
    htmlOut += conjPassivePresent(root, formNum).replace(/.*/,"<td class='cellVerb'>"+ '$&' +"</td>");
    htmlOut += conjPassivePast(root, formNum).replace(/.*/,"<td class='cellVerb'>"+ '$&' +"</td>");
    htmlOut += conjImperative(root, formNum, objRefs).replace(/.*/,"<td class='cellVerb'>"+ '$&' +"</td>");
    htmlOut += conjActivePresent(root, formNum, objRefs).replace(/.*/,"<td class='cellVerb'>"+ '$&' +"</td>");
    htmlOut += conjActivePast(root, formNum, objRefs).replace(/.*/,"<td class='cellVerb'>"+ '$&' +"</td>");

//write out meta columns
    htmlOut += arrFormNum[formNum].replace(/.*/,"<td class='cellFormNum'>"+ '$&' +"</td>");;
    htmlOut += arrMeaning[formNum].replace(/.*/,"<td class='cellMeaning'>"+ '$&' +"</td>");;
    htmlOut += "translation".replace(/.*/,"<td class='cellTranslation'>"+ '$&' +"</td>");;
    htmlOut += " </tr>";
}

return htmlOut;

};