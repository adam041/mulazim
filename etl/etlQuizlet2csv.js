// Takes data from text file from quizlet and writes to csv.

// Input file should separate cards with ";", and
// precede translation with hyphen.  Remove last ";"
// Input file should be named rotation#-topic (i.e. 4-culture.txt"

// Requires: node-js, node-fs
'esversion: 6';

const outputFile = "quizlet.csv",
      inputPath = "";

const prepositionDelim = "+",
    translationDelim = "-",
    cardDelim = ";";

var fs = require("fs");

var fileName = "",
    arrRow = "",
    outputCSV = "";

//** loop through directory > hardcoded file names!
    fileName = "4-environment&health.txt";

//get source data from file name
var index = fileName.indexOf("-");
var rotation = fileName.slice(0, index),
    topic = fileName.slice(index+1),

    topic = topic.replace(".txt","");
    topic = topic.toLowerCase();
var source = "FSI reading-rotation " + rotation + "-" + topic;


var inputText = fs.readFileSync(fileName,'utf8'),
    arrCards = inputText.split(cardDelim);

//input segments
var arrSubRows = [],
    formNum = "",
    preposition = "",
    perfect = "",   //past tense
    imperfect = "", //present tense
    masdar = "",
    translation = "",
    arRoot = "";

var arrRow = [],
    row = "",
    csv = "Form, Preposition, arRoot, Masdar, ImperfectRad2Vowel, PerfectRad2Vowel, Translation, Comment, Source\n",
    jRow = {
        Form: 0,
        Preposition: "",
        Root: "",
        Masdar: "",
        ImperfectRad2Vowel: "",
        PerfectRad2Vowel: "",
        Translation: "",
        Comment: "",
        Source: source,
        };

//parse Quizlet card (in arrCards) and reformat into a CSV row

    arrCards.forEach( function (value, index) {

        arrSubRows = [];
        arrSubRows = value.split("\n");

    //extract preposition (if available) and past/present stems
        perfect = splitTrim(arrSubRows[0], 0);
        preposition = splitTrim(arrSubRows[0], 1);

        imperfect = splitTrim(arrSubRows[1], 0);
        //disregarding preposition

    //extract masdar and translation
        row = splitTrim(arrSubRows[2], 0);
        //disregarding preposition

        translation = row.split(translationDelim)[1];
        masdar = row.split(translationDelim)[0];
        masdar = (masdar + "").trim();

    //clean up translation, remove commas and "to" prepositions
        translation = (translation+"").toLowerCase();
        var re = new RegExp("to ", 'g');
        translation = translation.replace(re, '');
        re = new RegExp(", ", 'g');
        translation = translation.replace(re, ' - ');
        translation = translation.trim();

    //extract form number and root from perfect stem with separate function
        arRoot = formFinder(perfect).arRoot;
        formNum = formFinder(perfect).formNum;

    //adjust for irregulars

        if ( arRoot.charAt(1) === "ا" ) {
            var rad2 = imperfect.charAt(2);
            arRoot = arRoot.charAt(0) + rad2 + arRoot.charAt(2);   //hollow, get from imperfect

        } else if ( arRoot.charAt(2) === "ى" ) {
            arRoot = arRoot.slice(0,2) + "ي";               //defective

        } else if ( arRoot.charAt(2) === "ّ" ) {
            arRoot = arRoot.slice(0,2) + arRoot.charAt(1);  //doubled

        } else if ( false ) {
            //hamza?
        }

//  row = formNum+ "," + preposition + "," + arRoot + "," + masdar + ",?,?," + translation  + ",," + source;
//rtl / ltr gets dorked up = (
    row = preposition + "," + arRoot + "," + masdar;                    //Arabic values
    row = formNum + "," + row + ",?,?," + translation  + ",," + source;  //English values
    csv += row + "\n";

//    console.log("we got f" + formNum+ " of " + arRoot);
    var rowDbg = formNum + "," +  preposition + "," + arRoot + "," + masdar + "," + translation;
    console.log(rowDbg);

/*
    //write out
    arrRow = [form, preposition, arRoot, masdar, "?", "?", translation, "", source];
    csv += arrRow.join(",") + "\n";
    //rtl / ltr gets dorked up = (
*/
    });


//OUTPUT DATA NOW PLZ **
//console.log(csv);

//Google Sheet Column Order:
    //Form
    //Preposition
    //arRoot
    //Masdar
    //ImperfectRad2Vowel
    //PerfectRad2Vowel
    //Translation
    //Comment
    //Source


function splitTrim(line, sequence){

    var re = new RegExp("[()]", 'gm');
    line = line.replace(re, "");

    //split line (should be 1 or 2 parts)
    var array = line.split(prepositionDelim);

    if ( array[sequence] === undefined ) {
//         console.log("splitTrim('line'," + sequence + ") - Sequence parameter not found in array");
        return "";
    } else {
        return array[sequence].trim();
    }
}


function formFinder(perfectStem) {
//Takes perfect stem (masculine, third person conjugation of verb in active past tense),
//and returns object containing formNumnumber and arRoot

    var objOut = {
      formNum: 0,
      arRoot: "",
    };

    var re = new RegExp("[َُِْ]", 'gm');

//remove short vowels from perfectStem, alert user
    perfect = perfectStem.replace(re, "");

    if ( perfect.length !== perfectStem.length ) {
        console.log("formFinder - ignoring short vowels in perfect, line below.");
    }

//classify formNum and extract arRoot from perfect
    switch ( perfect.length ) {

        case 3:
            formNum = 1;
            arRoot = perfect;
            break;

        case 4:

            if ( perfect.indexOf( String.fromCharCode(1617) ) > -1 ) {
                //test for shadda
                formNum = 2;
                arRoot = perfect.replace(String.fromCharCode(1617), "");

            } else if (perfect.charAt(1) === String.fromCharCode(1575) ) {
                //test for plain alef
                formNum = 3;
                arRoot = perfect.charAt(0) + perfect.slice(2);

            } else if (perfect.charAt(0) === String.fromCharCode(1571) ) {
                //test for alef w/ upper hamza
                formNum = 4;
                arRoot = perfect.slice(1);

            } else {
                //indicates a parsing error
                formNum = 234;
                arRoot = "؟" + perfect;
            }

            break;

        case 5:

            if ( perfect.indexOf( String.fromCharCode(1617) ) > -1 ) {
                //test for shadda

                if ( perfect.charCodeAt(0) === String.fromCharCode(1578) ) {
                    //test for teh
                    formNum = 5;
                } else if (perfect.charAt(0) === String.fromCharCode(1575) ) {
                    //test for plain alef
                    formNum = 9;
                }

                arRoot = perfect.replace(String.fromCharCode(1617), "");
                arRoot = arRoot.slice(1);

            } else if (perfect.charAt(2) === String.fromCharCode(1575) ) {
                //test for plain alef
                formNum = 6;
                arRoot = perfect.charAt(1) + perfect.slice(3);

            } else if ( perfect.slice(0,2) === "ان" ) {
                formNum = 7;
                arRoot = perfect.slice(2);

            } else if ( (perfect.charAt(0) === String.fromCharCode(1575) ) && (perfect.charAt(2) === String.fromCharCode(1578) ) ){
                //test for plain alif and teh
                formNum = 8;
                arRoot = perfect.charAt(1) + perfect.slice(3);

            } else {
            //indicates a parsing error
                formNum = 56789;
                arRoot = "؟" + perfect;
            }

            break;
/*
        case 6:
            if ( perfect.slice(0,3) === "است" ) {
                formNum = 10;
                arRoot = perfect.slice(3);
            } else {
                //indicates a parsing error
                formNum = 11;
                arRoot = "؟" + perfect + "?";
            }

            break;
*/
        default:
            formNum = "?";
            arRoot = perfect + "?";
            break;
    }

    if  ( perfect.slice(0,3) === "است" ) {
        formNum = 10;
        arRoot = perfect.slice(3);
    }

    objOut.formNum = formNum;
    objOut.arRoot = arRoot;
    return objOut;
}