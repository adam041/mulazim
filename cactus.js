/*
Work list
- styling
    - re-org html tables into One Big Table.  Nix tabs in favor of buttons to drive jQuery toggles (verbs, nouns, verbs+nouns, meaning, translation)

-core logic
    -handling irregular verbs
     -handling binary masdar in form 2/3 - encode as letter or arabic/arabic number?

-backend / data quality
    -pull jQuery menu inputs (sheetrock.js from gSheet!)
        -- dynamic highlighting to show known words and/or suppress unknown (missing) words
        -- handling of prepositions related to verb forms?

-secondary features
    -within tense conjugation (i.e. for all subjects; add column on left)
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


//Once objects set up, update web page
    document.title = "LtCactus Conjugates " + objRoot.root;
    jQuery("#activeRoot").html( objRoot.root );

    var htmlTableRows = "";


////////////////////
//  drawRow
// <tr> unspoolTDs!
////////////////////


//deprecate?
    var arrNouns = [
        "NounTimePlace",
        "PassiveParticiple",
        "ActiveParticiple",
        "Masdar"
    ];
//deprecate?
    var arrVerbs = [
        "PassivePresent",
        "PassivePast",
        "Imperative",
        "ActivePresent",
        "ActivePast"
    ];
//deprecate?


    arrNouns.forEach(function(element) {
        htmlTableRows = "";
        for (var i = 1; i <= 10; ++ i) {
            htmlTableRows += "<tr> <td> " + objRoot.noun(element, i) + " </td> </tr> ";
            }
        jQuery("#rows"+element).html( htmlTableRows );
    });

    arrVerbs.forEach(function(element) {
        htmlTableRows = "";
        for (var i = 1; i <= 10; ++ i) {
            htmlTableRows += "<tr> <td> " + objRoot.verb(element, i) + " </td> </tr> ";
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