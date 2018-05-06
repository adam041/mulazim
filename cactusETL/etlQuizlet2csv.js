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
    fileName = "4-culture.txt";

//get source data from file name
var index = fileName.indexOf("-");
var rotation = fileName.slice(0, index),
    topic = fileName.slice(index+1),
    source = "";

    topic = topic.charAt(0).toUpperCase() + topic.slice(1);
    topic = topic.replace(".txt","");

    source = "FSI reading-Rotation " + rotation + "-" + topic;


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
    csv = "Form, Preposition, arRoot, Masdar, ImperfectRad2Vowel, PerfectRad2Vowel, Translation, Comment, Source\n";

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
        row = splitTrim(arrSubRows[1], 0);
        //disregarding preposition

        translation = row.split(translationDelim)[0];
        masdar = row.split(translationDelim)[1];

    //clean up translation, remove commas and "to" prepositions
        translation = translation.toLowerCase();
        var re = new RegExp("to ", 'g');
        translation = translation.replace(re, '');
        re = new RegExp(", ", 'g');
        translation = translation.replace(re, ' - ');
        translation = translation.trim();

    //extract form number and root from perfect stem with separate function
        arRoot = formFinder(perfect).arRoot;
        formNum = formFinder(perfect).formNum;

    //adjust for irregulars
        //doubled
        //hollow و || ي
        //hamza carriage - assimilative
        //defective (ي)

//  row = formNum+ "," + preposition + "," + arRoot + "," + masdar + ",?,?," + translation  + ",," + source;
//rtl / ltr gets dorked up = (
    row = preposition + "," + arRoot + "," + masdar;                    //Arabic values
    row = formNum+ "," + row + ",?,?," + translation  + ",," + source;  //English values
    csv += row + "\n";

   console.log("we got f" + formNum+ " of " + arRoot);

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


function formFinder(perfect) {
//Takes perfect stem (masculine, third person conjugation of verb in active past tense),
//and returns object containing formNumnumber and arRoot

    var objOut = {
      formNum: 0,
      arRoot: "",
    };

//get formNumand extract arRoot from stem(s)
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
                //test for alef
                formNum = 3;
                arRoot = perfect.charAt(0) + perfect.slice(2);

            } else if (perfect.charAt(0) === String.fromCharCode(1571) ) {
                formNum = 4;
                arRoot = perfect.slice(1);

            } else {
                formNum = 234;
                arRoot = "؟" + perfect + "?";
            }

            break;

        case 5:

            if ( perfect.indexOf( String.fromCharCode(1617) ) > -1 ) {
                //test for shadda

                if ( perfect.charCodeAt(0) === String.fromCharCode(1578) ) {
                    //test for teh
                    formNum = 5;
                } else if (perfect.charAt(0) === String.fromCharCode(1571) ) {
                    //test for alef
                    formNum = 9;
                }

                arRoot = perfect.replace(String.fromCharCode(1617), "");
                arRoot = arRoot.slice(1);

            } else if (perfect.charAt(2) === String.fromCharCode(1575) ) {
                //test for alef
                formNum = 6;
                arRoot = perfect.charAt(1) + perfect.slice(3);

            } else if ( perfect.slice(0,2) === "ان" ) {
                formNum = 7;
                arRoot = perfect.slice(2);

            } else if ( (perfect.charAt(0) === String.fromCharCode(1571) ) && (perfect.charAt(2) === String.fromCharCode(1578) ) ){
                //test for alif and teh
                formNum = 8;
                arRoot = perfect.charAt(2) + perfect.slice(4);

            } else {
                formNum = 56789;
                arRoot = "؟" + perfect + "?";
            }

            break;

        case 6:
            if ( perfect.slice(0,3) === "است" ) {
                //test for shadda
                formNum = 10;
                arRoot = perfect.slice(3);
            } else {
                formNum = 11;
                arRoot = "؟" + perfect + "?";
            }

            break;

        default:
            formNum = "?";
            arRoot = perfect + "?";
            break;
    }

    objOut.formNum = formNum;
    objOut.arRoot = arRoot;
    return objOut;
}