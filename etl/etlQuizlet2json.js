// Takes data from text file from quizlet and writes to csv.

// Input file should separate cards with ";", and
// precede translation with hyphen.  Remove last ";"
// Input file should be named rotation#-topic (i.e. 4-culture.txt"

// Requires: node-js, node-fs
'esversion: 6';

(function(){
  "use strict";
})();

const outputFile = "quizlet.json",
      inputPath = ".";

const prepositionDelim = "+",
    translationDelim = "-",
    cardDelim = ";";

var fs = require("fs");
var path = require( 'path' );

main();

function main () {
//master function

//Announce program start on command line
console.log(">>>>    >>>>    >>>>    Initiating ETL    >>>>    >>>>    >>>>    ");


var arrRows = [],
    arrBatch = [],
    jsonString = "";

//loop through files
fs.readdir( inputPath, function( err, files ) {

    if( err ) {
        console.error( "Could not list the directory.", err );
        process.exit( 1 );
    }

    files.forEach( function( file, index ) {
        if ( (file.charAt(1) === "-" ) && (file.slice(-4) === ".txt") ) {

            console.log("Opened " + file);

            //only read from valid data files
            arrBatch = etl(file);
            arrRows = arrRows.concat( arrBatch );
            console.log("Extracted " + arrBatch.length + " rows from " + file + ".  Saved " + arrRows.length + " total rows.");

        }  else {
            //skip
        }
    });

    //convert JSON to string
    arrRows.forEach( function(value, index){
        jsonString += JSON.stringify(value) + ",\n";
    });
    jsonString = jsonString.trim();

    //make array-like
    jsonString = jsonString.slice(0,-1);
    jsonString = "[" + jsonString + "]";

    //save the data!
    fs.writeFile(outputFile, jsonString, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log( arrRows.length + " records were saved to " + outputFile);
    });
});
}


function etl(fileName) {
//Takes file name, and outputs an array of JSON objects containing
//data corresponding to backend database fields

//declare variables
var arrSubRows = [],
    perfect = "",   //past tense
    imperfect = "", //present tense
    arrCards = [],
    rotation = "",
    topic = "",
    source = "",
    inputText = "",
    re = new RegExp("foo", 'g');

   //load data from file and organize into array of cards
    inputText = fs.readFileSync(fileName,'utf8');

    if ( inputText.charAt(inputText.length - 1) === ";" ) {
        inputText = inputText.slice(0,-1);
    }

    arrCards = inputText.split(cardDelim);

    //get meta data for source field
    rotation = fileName.split("-")[0];
    topic = fileName.split("-")[1].toLowerCase();
    source = "FSI reading-rotation " + rotation + "-" + topic.replace(".txt","");

    //declare output variables
    var arrOut = [],
        jRow = {
            Form: 0,
            Preposition: "",
//             PerfectStem:"",     //** for debugging, will not load into db
            Root: "",
            Masdar: "",
            ImperfectRad2Vowel: "",
            PerfectRad2Vowel: "",
            Translation: "",
            Comment: "",
            Source: "",
            };

    //parse Quizlet card (in arrCards) and reformat into JSON
    arrCards.forEach( function (value, index) {
        jRow.Source = source;

        arrSubRows = [];
        arrSubRows = value.split("\n");

    //extract preposition (if available) and stems of perfect and imperfect
        perfect = splitPrepo(arrSubRows[0], 0);
        jRow.Preposition = splitPrepo(arrSubRows[0], 1);
        imperfect = splitPrepo(arrSubRows[1], 0);    //disregard preposition

    //** for debugging, do not load into db
//         jRow.PerfectStem = perfect;

    //extract masdar and translation
        jRow.Masdar = arrSubRows[2].split(translationDelim)[0];
        jRow.Masdar = splitPrepo(jRow.Masdar, 0);
        jRow.Masdar = codifyMasdar(jRow.Masdar);    //check if a data entry code applies

        jRow.Translation = arrSubRows[2].split(translationDelim)[1];

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

    arrOut.push(jRow);
    jRow = {};
    //console.log(jRow); // ** debug

    });

return arrOut;

//Google Sheet Column Order:
    //Form
    //Preposition
    //Root
    //Masdar
    //ImperfectRad2Vowel
    //PerfectRad2Vowel
    //Translation
    //Comment
    //Source
}

function codifyMasdar(masdar){
//takes a masdar input as string, outputs either a masdar code if pattern matched, or else the original string.

var masdarOut = masdar,
    form = -1;

    if ( ( masdar.length === 5 ) && ( masdar.charAt(1) === "ت" ) && ( masdar.charAt(3) === "ي" )) {
        form = 2;
        masdarOut = "ي";

    } else if ( ( masdar.charAt(0) === "م" ) && ( masdar.charAt(2) === "ا" ) && ( masdar.charAt(5) === "ة" ) ) {
        form = 3;
        masdarOut = "م";

    } else if ( ( masdar.length === 5 ) && ( masdar.charAt(0) === "إ" ) && ( masdar.charAt(3) === "ا" )) {
        form = 4;

    } else if ( ( masdar.charAt(0) === "ت" ) && ( masdar.charAt(3) === "ّ" ) ){
        form = 5;

    } else if ( ( masdar.charAt(0) === "ت" ) && ( masdar.charAt(2) === "ا" ) ){
        form = 6;

    } else if ( ( masdar.charAt(0) === "ا" ) && ( masdar.charAt(1) === "ن" ) && ( masdar.charAt(4) === "ا" ) ){
        form = 7;

    } else if ( ( masdar.charAt(0) === "ا" ) && ( masdar.charAt(2) === "ت" ) && ( masdar.charAt(4) === "ا" ) ){
        form = 8;

    } else if ( ( masdar.charAt(0) === "ا" ) && ( masdar.charAt(3) === "ل" ) && ( masdar.charAt(4) === "ا" ) ){
        form = 9;

    } else if ( ( masdar.slice(0,3) === "است" ) && ( masdar.charAt(5) === "ا" ) ) {
        form = 10;
    }

    if ( form >=4 ) {
        //suppress output if Masdar is regular in higher forms
        masdarOut = "";
    }

return masdarOut;
}


function splitPrepo(line, sequence){
//separates preposition from rest of line

    var re = new RegExp("[()\/._]", 'gm');
    line = line.replace(re, "");

    //split line (should be 1 or 2 parts)
    var array = line.split(prepositionDelim);

    if ( array[sequence] === undefined ) {
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

//remove short vowels from perfectStem, alert user
    var re = new RegExp("[َُِْ]", 'gm')
        perfect = perfectStem.replace(re, ""),
        char0 = perfect.charAt(0);

    if ( perfect.length !== perfectStem.length ) {
//         console.log("  formFinder - ignored short vowels in " + perfectStem);
    }
    perfect = perfect.trim();

    if ( perfect.length === 3 ) {
        form = 1;
        root = perfect;

    } else if ( ( perfect.length === 6 ) && ( giveHimTheStick(char0) ) && ( perfect.slice(1,3) === "ست" ) ) {
        form = 10;
        root = perfect.slice(3);

    } else if ( ( perfect.length === 4 ) && ( perfect.charAt(2) === "ّ" ) ) {
        form = 2;
        root = perfect.replace("ّ", "");

    } else if ( ( perfect.length === 4 ) && ( perfect.charAt(1) === "ا" ) ) {
        form = 3;
        root = perfect.charAt(0) + perfect.slice(2);

    } else if ( ( perfect.length === 4 ) && ( giveHimTheStick(char0) ) ) {
        form = 4;
        root = perfect.slice(1);

    } else if ( ( perfect.charAt(0) === "ت" ) && ( perfect.charAt(3) === "ّ" ) ){
        form = 5;
        root = perfect.charAt(1) + perfect.charAt(2) + perfect.charAt(4);

    } else if ( ( perfect.charAt(0) === "ت" ) && ( perfect.charAt(2) === "ا" ) ){
        form = 6;
        root = perfect.charAt(1) + perfect.charAt(3) + perfect.charAt(4);

    } else if ( ( giveHimTheStick(char0) ) && ( perfect.charAt(1) === "ن" ) ){
        form = 7;
        root = perfect.slice(2);

    } else if ( ( giveHimTheStick(char0) ) && ( perfect.charAt(2) === "ت" ) ){
        form = 8;
        root = perfect.charAt(1) + perfect.charAt(3) + perfect.charAt(4);

    } else if ( ( giveHimTheStick(char0) ) && ( perfect.charAt(4) === "ّ" ) ){
        form = 9;
        root = perfect.slice(1,4);

    } else {
        form = "?";
        root = perfectStem;

        console.log(" unclassifiable stem w/ length " + perfectStem.length + "< " + perfectStem);
    }

    objOut.Form = form;
    objOut.Root = root;
    return objOut;
}

function giveHimTheStick(matchChar) {
//returns true if matchChar looks like an alif, including hamza carriers

    var answer = false,
        watchList = [ String.fromCharCode(1649), String.fromCharCode(1650), String.fromCharCode(1651),
                    String.fromCharCode(1652), String.fromCharCode(1653), String.fromCharCode(1570),
                    String.fromCharCode(1571), String.fromCharCode(1572), String.fromCharCode(1573),
                    String.fromCharCode(1575) ];

    answer = watchList.some( function(value) {
        return matchChar === value;
    });

return answer;

}