jQuery( document ).ready(function() {
//set up jQuery UI and default conjugation

//need to have some data available for conjugateUpdate before backend loads
objRefs = makeReferenceObject();

$( function() {
    $( "#tabs" ).tabs();
} );

$('#menuTable tbody td:first-child').each(function() {
    $("#menuOfRoots").append("<li><div>" +  $(this).text() + "</div></li>");
});

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

jQuery( document ).ready(function() {

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

/* //deprecate
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

    $( "footer" ).dblclick(function() {
    //** initially opaque button used for testing **
        $( ".hideMe" ).toggle();
*/

    $( "divFooter" ).dblclick(function() {
        $( ".hideMe" ).toggle();
    });
/*
    $( "#divSelectors" ).dblclick(function() {
        drawAllSubjects();
    });
*/

$( document ).tooltip();
});

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
// $( "#stage1").html( "PreProcessing".wrap("<h3>") );
// $( "#stage2").html( "PostProcessing".wrap("<h3>") );
// $( "#stage3").html( "".wrap("<h3>") );
// $( "#stage4").html( "".wrap("<h3>") );

//Display active root on table and in title
    document.title = "Conjugations of " + arRoot;
    jQuery("#activeRoot").html( arRoot );

//Force display of all header cells
    $( "#contentTable thead th" ).show();

//Draw table rows
    var rowsObj = drawRow( arRoot, arSubject );

    // jQuery("#contentTable tbody").html( drawRow( arRoot, arSubject ) );
    jQuery("#verbTableRows").html( rowsObj.verb );
    jQuery("#nounTableRows").html( rowsObj.noun );
    jQuery("#allTableRows").html( rowsObj.all );

//Update formatting of rows with known-good forms
    for (var formNum = 1; formNum <= 10; ++formNum ) {

        if ( objRefs.indexRow(arRoot, formNum) > -1) {
            //jQuery( "#contentTable tr:nth-child("+formNum+") td").css({"color": "black"});
            jQuery( ".dataRows tr:nth-child("+formNum+") td").css({"color": "black"});

        } else {
            //jQuery( "#contentTable tr:nth-child("+formNum+") td").css({"color": "dimgrey", "font-size": "medium"});
            jQuery( ".dataRows tr:nth-child("+formNum+") td").css({"color": "dimgrey", "font-size": "medium"});
        }
    }

}


/*      //* lookout: a curvy bracket is dorked up

function drawAllSubjects() {
//mostly intended for debugging, the UI is ugly

var arRoot = $("#chosenRoot").val(),
    arSubject = "",
    dividerRow = "";
    dividerRowTemp = "";

for (var i = 1; i <= 11; ++i ) {
    dividerRow += "<td> </td>";
}

  if ( blnRowsNotHeader === false ) {
        $( "#dataTable th" ).each(function(colIndex) {
            arrRow.push( $(this).text() );
        });

        return arrRow; //1D array of header (ths)

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
*/

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

var rowsOut = {},
    verbLine = "",
    nounLine = "",
    metaLine = "";

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

//First generate data
    var colMasdar = cnjNoun(arRoot, "masdar", false,  null),
        colAgent = cnjNoun(arRoot, "agent", false,  null),
        colRecipient = cnjNoun(arRoot, "recipient", false,  null),
        colTimePlace = cnjNoun(arRoot, "time-place", false,  null);

    var colPassiveImperfect = cnjVerb(arRoot, "imperfect", false,  arSubject),
        colPassivePerfect = cnjVerb(arRoot, "perfect", false,  arSubject),
        colJussive = cnjVerb(arRoot, "jussive", true,  arSubject),
        colActiveImperfect = cnjVerb(arRoot, "imperfect", true,  arSubject),
        colActivePerfect = cnjVerb(arRoot, "perfect", true,  arSubject);

//Then write out rows, one td at a time
for (var formNum = 1; formNum <= 10; ++formNum ) {

    verbLine += whole(colPassiveImperfect[formNum]).wrap("<td class='colVerb'>");
    verbLine += whole(colPassivePerfect[formNum]).wrap("<td class='colVerb'>");
    verbLine += whole(colJussive[formNum]).wrap("<td class='colVerb'>");
    verbLine += whole(colActiveImperfect[formNum]).wrap("<td class='colVerb'>");
    verbLine += "<td class='colVerb'>" + whole(colActivePerfect[formNum]).wrap("<span>");
    verbLine +=  (" " + objRefs.query(arRoot, formNum, "Preposition") ).wrap("<span class='spnPreposition'>") + "</td>";

    nounLine += whole(colTimePlace[formNum]).wrap("<td class='colNoun'>");
    nounLine += whole(colRecipient[formNum]).wrap("<td class='colNoun'>");
    nounLine += whole(colAgent[formNum]).wrap("<td class='colNoun'>");
    nounLine += whole(colMasdar[formNum]).wrap("<td class='colNoun'>");

    metaLine += arrFormNum[formNum].wrap("<td class='colFormNum'>");
    metaLine += arrMeaning[formNum].wrap("<td class='colMeaning'>");
    metaLine += objRefs.query(arRoot, formNum, "Translation").wrap("<td class='colTranslation'>");
    //maintenance note:  htmlOut = htmlOut.wrap("<tr>");  //doesn't work
    metaLine += "</tr>";

    rowsOut.noun += "<tr>" + nounLine + metaLine;
    rowsOut.verb += "<tr>" + verbLine + metaLine;
    rowsOut.all += "<tr>" + nounLine + verbLine + metaLine;
    nounLine = verbLine = metaLine = "";
}

return rowsOut;
}


Array.prototype.last = function () {
//method returns last item from array

//     if (this === undefined) {
//         return [];
//     }

    return this[this.length - 1];
};


function clone( objIn ) {
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
    return JSON.parse(JSON.stringify(objIn));
}


Array.prototype.x10 = function(callback, isVerbose){
    return x10(this, callback, isVerbose);
};


function x10(arrayIn, callback, isVerbose){
//somewhat general function for processing a copy of an array containing ten forms of a conjugation

    var arrayOut = [],
        word = {};

    arrayIn.forEach(function ( value, index ) {

        if ( index === 0 ) {
            arrayOut.push(value);

            if (isVerbose) { console.log(arrayOut[index]); }

        } else {
            word = clone(value);
            arrayOut.push( callback(word)  );

            if (isVerbose) { console.log( whole(arrayOut[index]) ); }
        }
    }   );

    return arrayOut;
}


function base10( wordIn, callback ) {
//returns an size 11 array containing templates of all 10 verb forms (0 is intended for use)

var arrayOut = [],
    word = {};

    arrayOut.push(ar_ILB);

for(var i=1; i <= 10; ++i) {
    word = clone(wordIn);
    word = cnjForm( word, i );
    arrayOut.push( word );
    }
return arrayOut;
}


function arrayOW (array, newValue, x, y) {
//over-writes new value into specified position in array, then returns the array
    array[x][y] = newValue;
    return array;
}

Array.prototype.vowel = function(vowel){
//inserts vowel as new value in array position [0][1]
//OR returns incumbent character if no param passed

//intended use for vowels accompanying Arabic root radicals

    if ( vowel === undefined ) {

        if (this[0] === undefined) {
            return "";

        } else {
            return this[0][1];
        }

    } else {
        return arrayOW(this, vowel, 0, 1);
    }
};

Array.prototype.consonant = function(consonant){
//inserts consonant as new value in array position [1][0]
//OR returns incumbent character if no param passed

    if ( consonant === undefined ) {

        if (this[0] === undefined) {
            return "";

        } else {
            return this[0][0];
        }

    } else {
        return arrayOW(this, consonant, 0, 0);
    }
};


String.prototype.wrap = function ( openTag ) {
//wraps string in passed html tag

    var closeTag,
        index = openTag.indexOf(" ");

    if ( index === -1 ) {
        //tag has no other attributes
        closeTag = "</" + openTag.slice(1);

    } else {
        closeTag = "</" + openTag.slice(1, index) + ">";
    }

    return openTag + this + closeTag;
};


function flatReduce(arrayIn){
//takes an array with an arbitrary number of dimensions and returns a string
//* fails if param is a 1D array?!

    if ( (arrayIn === undefined) || (arrayIn.length === 0) ) {
        return "";
    }

    //flatten multi-D array into 1-drafts
    var flatArray = arrayIn.reduce(function(prev, curr) {
        return prev.concat(curr);
    });

    //reduce array to string
    if ( flatArray.length === 0 ) {
        return "";
    } else {
        return flatArray.reduce(reducer);
    }
}


function Word( arRoot, enTense, isActive, arSubject ) {
// Word properties encapsulation.  Keep it dumb (i.e. external functions, not internal methods).

//declare metadata properties (7)
    this.arRoot = arRoot;
    this.arSubject = arSubject;
    this.verbType = null;    //auto-categorize on declaration?
    this.layer = "initial";  //identifies phase of conjugation processing

    this.formNum = null;
    this.enTense = enTense;
    this.isActive = isActive;

//declare data segments (9)
    this.prefix =  [];
    this.innerPrefix = [];

    this.rad1 = [];
    this.midRight = [];
    this.rad2 = [];
    this.midLeft = [];

    this.rad3 = [];
    this.innerSuffix = [];
    this.suffix = [];

    this.whole = "";

//load radical segments with consonants
    this.rad1.push( [arRoot.charAt(0), ""] );
    this.rad2.push( [arRoot.charAt(1), ""] );
    this.rad3.push( [arRoot.charAt(2), ""] );  //** may get weird on doubled verbs if rad3 is shadda

}


function whole(word){
//assembles all segment arrays of word object, and returns a String

    var theWord  = flatReduce(word.prefix);
        theWord += flatReduce(word.innerPrefix);
        theWord += flatReduce(word.rad1);
        theWord += flatReduce(word.midRight);
        theWord += flatReduce(word.rad2);
        theWord += flatReduce(word.midLeft);
        theWord += flatReduce(word.rad3);
        theWord += flatReduce(word.innerSuffix);
        theWord += flatReduce(word.suffix);

    return theWord;
}


function nonWord( wordIn ) {
//create intentionally blank output, for when there is no conjugation (i.e. passive form of form 7 verb)

    var word = clone(wordIn);

    word.rad1 = ([["-",""]]);
    word.rad2 = ([["-",""]]);
    word.rad3 = ([["-",""]]);

    word.prefix = [];
    word.innerPrefix = [];
    word.midRight = [];
    word.midLeft = [];
    word.innerSuffix = [];
    word.suffix = [];

    return word;
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


function jqAlert( htmlAlert ) {

    $( "#divAlert" ).html( htmlAlert );

    $( function() {
        $( "#divAlert" ).dialog();
    });
}