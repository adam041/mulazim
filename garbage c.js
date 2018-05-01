
function chunkTable( array, title, word ) {
//takes an array of Arabic where array[0] has all the consonants and array[1] has all the vowels
//and outputs a html table showing individual characters, split by consonant and vowel/diacritic rows

//optional param - title of table
if ( title === undefined ) { title = ""; }

    var vowel = "",
        frame = "",
        wholeWord = ""; //vowel(s)

    var table = "",
        trConsonants = "",
        trVowels = "",
        tdVowel = "";

    array[0].forEach(function ( consonant, index ) {

        if ( array[1][index].length > 0 ) {
            vowel = array[1][index].reduce(reducer);
            trVowels += array[1][index].reduce(rowReducer).wrap("<table>").wrap("<td style='vertical-align: bottom'>");
        } else {
            vowel = "";
            trVowels = "".wrap("<table>").wrap("<td>");
        }

        trConsonants += consonant.wrap("<td>");

        frame = consonant + vowel;
        wholeWord += frame;

    });

    trConsonants = trConsonants.wrap("<tr>");
    trVowels = trVowels.wrap("<tr>");

    var params = " ( f" + word.formNum + "-" + word.enTense + "-" + word.isActive + " ) ";

    table += ( ar_LM + wholeWord + ar_LM + params + title ).wrap("<th colspan='99'>").wrap("<tr>").wrap("<thead>");
    table += ( trVowels + trConsonants ).wrap("<tbody>");
    table = table.wrap("<table>");

return table;

}





function chunk( stringIn ) {
//takes a stringIn, returns a 2D array containing all chars
// array[consonant string][array of vowel(s)]

var arrConsonants = [],
    arrVowels = [],
    arrOut = [],
    vBuffer = [""]; //,
//     c = ""; //holds active character from stringIn

for (var i = 0, c = ""; i < stringIn.length; i++) {
    c = stringIn.charAt(i);

    if (( isShortVowel(c) ) || ( c === ar_2v )) {
        vBuffer.push(c);
    } else {

        arrConsonants.push(c);
        if ( i !== 0 ) {
            arrVowels.push(vBuffer);
            vBuffer = [""];
        }
    }
}

//push vowels one last time to maintain symmetry with consonants, and to account for trailing vowel characters
    arrVowels.push(vBuffer);

if ( arrConsonants.length !== arrVowels.length ) {
    console.log("!  Frame mismatch error in chunk(" + stringIn + ")");
}

arrOut.push(arrConsonants, arrVowels);

return arrOut;
}

