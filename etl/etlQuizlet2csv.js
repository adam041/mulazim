// Takes data from text file from quizlet and writes to csv.

// Input file should separate cards with ";", and
// precede translation with hyphen.  Remove last ";"
// Input file should be named rotation#-topic (i.e. 4-culture.txt"

// Requires: node-js, node-fs
'esversion: 6';

(function(){
  "use strict";
})();

const outputFile = "quizlet.csv",
      inputPath = "";

const prepositionDelim = "+",
    translationDelim = "-",
    cardDelim = ";";

var fs = require("fs");

var fileName = "",
    arrSubRows = [],
    perfect = "",   //past tense
    imperfect = "", //present tense
    arrCards = [],
    row = "",
    index = -1,
    rotation = "",
    topic = "",
    source = "",
    inputText = "",
    re = new RegExp("foo", 'g');

var arrOut = [],
    jRow = {
        Form: 0,
        Preposition: "",
        PerfectStem:"",     //** for debugging, will not load into db
        Root: "",
        Masdar: "",
        ImperfectRad2Vowel: "",
        PerfectRad2Vowel: "",
        Translation: "",
        Comment: "",
        Source: source,
        };

//** loop through directory > hardcoded file names!




    fileName = "4-education.txt";

//get source data from file name
    index = fileName.indexOf("-");
    rotation = fileName.slice(0, index);
    topic = fileName.slice(index+1);

    topic = topic.replace(".txt","");
    topic = topic.toLowerCase();

    source = "FSI reading-rotation " + rotation + "-" + topic;

    inputText = fs.readFileSync(fileName,'utf8');
    arrCards = inputText.split(cardDelim);
//     csv = "Form, Preposition, root, Masdar, ImperfectRad2Vowel, PerfectRad2Vowel, Translation, Comment, Source\n",

//parse Quizlet card (in arrCards) and reformat into a CSV row

    arrCards.forEach( function (value, index) {

        arrSubRows = [];
        arrSubRows = value.split("\n");

    //extract preposition (if available) and stems of perfect and imperfect
        perfect = splitTrim(arrSubRows[0], 0);
        jRow.Preposition = splitTrim(arrSubRows[0], 1);
        imperfect = splitTrim(arrSubRows[1], 0);    //disregard preposition

    //** for debugging, will not load into db
        jRow.PerfectStem = perfect;

    //extract masdar and translation
        row = splitTrim(arrSubRows[2], 0);          //disregard preposition
        jRow.Translation = row.split(translationDelim)[1];
        jRow.Masdar = row.split(translationDelim)[0];
        jRow.Masdar = (jRow.Masdar + "").trim();

        //** compare given masdar with patterns corresponding to codes

    //clean up translation, remove commas and "to" prepositions
        jRow.Translation = (jRow.Translation+"").toLowerCase();
        re = new RegExp("to ", 'g');
        jRow.Translation = jRow.Translation.replace(re, '');
        re = new RegExp(", ", 'g');
        jRow.Translation = jRow.Translation.replace(re, ' - ');
        jRow.Translation = jRow.Translation.trim();

    //extract form number and root from perfect stem with separate function
        jRow.Root = formFinder(perfect).Root;
        jRow.Form = formFinder(perfect).Form;

    //adjust for irregulars

        if ( jRow.Root.charAt(1) === "ا" ) {
            var rad2 = imperfect.charAt(2);
            jRow.Root = jRow.Root.charAt(0) + rad2 + jRow.Root.charAt(2);
            //hollow, get from imperfect

        } else if ( jRow.Root.charAt(2) === "ى" ) {
            jRow.Root = jRow.Root.slice(0,2) + "ي";
            //defective

        } else if ( jRow.Root.charAt(2) === "ّ" ) {
            jRow.Root = jRow.Root.slice(0,2) + jRow.Root.charAt(1);
            //doubled

        } else if ( false ) {
            //hamza?
        }

//    console.log("we got f" + form+ " of " + root);
//     var rowDbg = form + "," +  preposition + "," + root + "," + masdar + "," + translation;
//     console.log(rowDbg);
        arrOut.push(jRow);
    });

//** OUTPUT DATA PLZ **
// console.log(arrOut);



////    ////    Supporting Functions    ////    ////

//Google Sheet Column Order:
    //Form
    //Preposition
    //root
    //Masdar
    //ImperfectRad2Vowel
    //PerfectRad2Vowel
    //Translation
    //Comment
    //Source

function splitTrim(line, sequence){

    var re = new RegExp("[()\.]", 'gm');
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
//and returns object containing formnumber and root

var objOut = {
  Form: -1,
  Root: "-1",
};

var root = "",
    form = "";

if ( perfectStem.indexOf("...") > -1 ) {
    console.log("elipses wtf");
}

//remove short vowels from perfectStem, alert user
    var re = new RegExp("[َُِْ]", 'gm');
    perfect = perfectStem.replace(re, "");

    if ( perfect.length !== perfectStem.length ) {
        console.log("formFinder - ignored short vowels in perfect (below)");
    }
    perfect = perfect.trim();

    if ( perfect.length === 3 ) {
        form = 1;
        root = perfect;

    } else if ( ( perfect.length === 4 ) && ( perfect.charAt(2) === "ّ" ) ) {
        form = 2;
        root = perfect.replace("ّ", "");

    } else if ( ( perfect.length === 4 ) && ( perfect.charAt(1) === "ا" ) ) {
        form = 3;
        root = perfect.charAt(0) + perfect.slice(2);

    } else if ( ( perfect.length === 4 ) && ( perfect.charAt(0) === "أ" ) ) {
        form = 4;
        root = perfect.slice(1);

    } else if ( ( perfect.charAt(0) === "ت" ) && ( perfect.charAt(3) === "ّ" ) ){
        form = 5;
        root = perfect.charAt(1) + perfect.charAt(2) + perfect.charAt(4);

    } else if ( ( perfect.charAt(0) === "ت" ) && ( perfect.charAt(2) === "ا" ) ){
        form = 6;
        root = perfect.charAt(1) + perfect.charAt(3) + perfect.charAt(4);

    } else if ( ( perfect.charAt(0) === "ا" ) && ( perfect.charAt(1) === "ن" ) ){
        form = 7;
        root = perfect.slice(2);

    } else if ( ( perfect.charAt(0) === "ا" ) && ( perfect.charAt(2) === "ت" ) ){
        form = 8;
        root = perfect.charAt(1) + perfect.charAt(3) + perfect.charAt(4);

    } else if ( ( perfect.charAt(0) === "ا" ) && ( perfect.charAt(4) === "ّ" ) ){
        form = 9;
        root = perfect.slice(1,4);

    } else if ( perfect.slice(0,3) === "است" ) {
        form = 10;
        root = perfect.slice(3);

    } else {
        form = "?";
        root = perfectStem;

        console.log("unclassifiable stem w/ length " + perfectStem.length + "< " + perfectStem);
    }

    objOut.Form = form;
    objOut.Root = root;

//>>> debug out
    console.log( perfectStem + ">" + form + " " + root );

    return objOut;
}