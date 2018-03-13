//Verb Conjugation Scripts

function verbalize(arRoot, formNum, enTense, isActive, arSubject) {
//finds stem of a verb, and then adds prefixes and suffixes appropriate to tense and subject

//root and formNum are required parameters.  Active/Present/3rd person masculine single assumed if no param passed
// enTense parameter should be "present" or "past", english language string
// isActive is boolean
// arSubject parameter should be Arabic language string.  Omit short vowels except to distinguish singular forms of you


//ensure optional variables are not null
if ( enTense === undefined ) {
    enTense = "present";
}

if ( isActive === undefined ) {
    isActive = true;
}

if ( arSubject === undefined ) {
    arSubject = "هو";
}

formNum = parseInt(formNum);    //ensures formNum not misinterpreted as string

//Declare string variables for internal use
var word = {
        arRoot: arRoot,
        formNum: formNum,
        enTense: enTense,
        isActive: isActive,
        arSubject: arSubject,
        verbType: "regular",
        prefix: "",
        stem: "",
        suffix: "",
        whole: function() {
            var wholeWord = this.prefix + this.stem + this.suffix;

            //Catch double alifs and combine to alif w/ madda. Needed for hollow verbs in form 6.
            return wholeWord.replace(ar_A+ar_A, ar_Am);
        },
    };

//Build object holding reference info needed to fill in details for forms 1-3
var objRefs = makeReferenceObject();

//Get the stem

if ( enTense === "present" ) {

    if ( isActive ) {
        word.stem = conjActivePresent(arRoot, formNum, objRefs);
    } else {
        word.stem = conjPassivePresent(arRoot, formNum, objRefs);
    }

} else if ( enTense === "past" ) {

    if ( isActive ) {
        word.stem = conjActivePast(arRoot, formNum, objRefs);
    } else {
        word.stem = conjPassivePast(arRoot, formNum, objRefs);
    }

} else if ( enTense === "imperative" ) {
    word.stem = conjImperative(arRoot, formNum, objRefs);
}

//Get Present Prefix/Suffix
word.prefix = getPrefixSuffix(enTense, isActive, arSubject, true, formNum);
word.suffix = getPrefixSuffix(enTense,isActive, arSubject, false, formNum);


//check if irregular
word = irregularizer( word );

// if ( word.verbType !== "regular" ) {
//     console.log(word.verbType);
// }

return word.whole();
}


function getPrefixSuffix(enTense, isActive, arSubject, blnPrefixNotSuffix, formNum) {

if ( blnPrefixNotSuffix === "undefined" ) {
    blnPrefixNotSuffix = true;
}

if ( isActive === "undefined" ) {
    isActive = true;
}

var prefix = "",
    suffix = "";

    //Get Present Prefix/Suffix
    if ( enTense === "present" ) {

        //Present Prefixes
        switch ( arSubject ) {

            case pro_i:
                prefix = ar_hA + prefixVowel(formNum, isActive);
                break;

            case pro_we:
                prefix = ar_n + prefixVowel(formNum, isActive);
                break;

            case pro_youM:
            case pro_youF:
            case pro_she:
            case pro_vousM:
            case pro_vousF:
                prefix = ar_t + prefixVowel(formNum, isActive);
                break;

            case pro_he:
            case pro_theyM:
            case pro_theyF:
                prefix = ar_Y + prefixVowel(formNum, isActive);
                break;
        }

        //Present Suffixes
        switch ( arSubject ) {

            case pro_youF:
                suffix = ar_i + ar_Y + ar_n + ar_a;
                break;

            case pro_theyM:
                suffix = ar_u + ar_U + ar_n;
                break;

            case pro_vousM:
                suffix = ar_u + ar_U + ar_n + ar_a;
                break;

            case pro_vousF:
            case pro_theyF:
                suffix = ar_0 + ar_n + ar_a;
                break;

            default:
                suffix = ar_u;
                break;
        }

    } else if ( enTense === "past" ) {
    //Get Past Suffix

        switch ( arSubject ) {

            case pro_i:
                suffix = ar_0 + ar_t + ar_u;
                break;

            case pro_we:
                suffix = ar_0 + ar_n + ar_A;
                break;

            case pro_youM:
                suffix = ar_0 + ar_t + ar_a;
                break;

            case pro_youF:
                suffix = ar_0 + ar_t + ar_i;
                break;

            case pro_vousM:
                suffix = ar_0 + ar_t + ar_u + ar_m;
                break;

            case pro_vousF:
                suffix = ar_0 + ar_t + ar_u + ar_n + ar_2v + ar_i;
                break;

            case pro_he:
                suffix = ar_a;
                break;

            case pro_she:
                suffix = ar_a + ar_t;
                break;

            case pro_theyM:
                suffix = ar_u + ar_U + ar_A;
                break;

            case pro_theyF:
                suffix = ar_0 + ar_n + ar_a;
                break;
        }

    }

if ( blnPrefixNotSuffix ) {
    return prefix;
} else {
    return suffix;
}

}


function prefixVowel(formNum, isActive) {
//returns vowel accompanying prefix of present stem of verb

if ( isActive === undefined ) {
    isActive = true;
}

if ( isActive === true ) {
    switch (formNum) {

        case 2:
        case 3:
        case 4: return ar_u;

        case 1:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10: return ar_a;

        default: return "؟";
    }

} else {
    return ar_u;
}

}


function conjActivePast(arRoot, formNum, objRefs) {
//returns conjugated trilateral verb in Past Perfect (active)

    var output,
        rad2vowel = "";

    switch (formNum) {

        case 1:
          rad2vowel = vowelMe(objRefs.query(arRoot, formNum, "f1ActivePastRad2"));
          output = arRoot[0] + ar_a + arRoot[1] + rad2vowel + arRoot[2];
          break;

        case 2:
          output = arRoot[0] + ar_a + arRoot[1] + ar_2v + ar_a + arRoot[2];
          break;

        case 3:
          output = arRoot[0] + ar_a + ar_A + arRoot[1] + ar_a + arRoot[2];
          break;

        case 4:
          output = ar_hA + ar_a + arRoot[0] + ar_0 + arRoot[1] + ar_a + arRoot[2];
          break;

        case 5:
          output = ar_t + ar_a + conjActivePast(arRoot, 2);
          break;

        case 6:
          output = ar_t + ar_a + conjActivePast(arRoot, 3);
          break;

        case 7:
          output = ar_A + ar_i + ar_n + ar_0 + arRoot[0] + ar_a + arRoot[1] + ar_a + arRoot[2];
          break;

        case 8:
          output = ar_A + ar_i + arRoot[0] + ar_0 + ar_t + ar_a + arRoot[1] + ar_a + arRoot[2];
          break;

        case 9:
          output = ar_A + ar_i + arRoot[0] + ar_0 + arRoot[1] + ar_a + arRoot[2] + ar_2v;
          break;

        case 10:
          output = ar_A + ar_i + ar_s + ar_0 + ar_t + ar_a + arRoot[0] + ar_0 + arRoot[1] + ar_a + arRoot[2];
          break;

        default:
          output = "Error";
          break;
      }

        return output;
}


function conjActivePresent(arRoot, formNum, objRefs) {
//returns conjugated trilateral verb in Present Imperfect (active)

    var output,
        rad2vowel = "";

    switch (formNum) {

        case 1:
            rad2vowel = vowelMe(objRefs.query(arRoot, formNum, "f1ActivePresentRad2"));
            output = arRoot[0] + ar_0 + arRoot[1] + rad2vowel + arRoot[2];
            break;

        case 2:
            output = arRoot[0] + ar_a + arRoot[1] + ar_2v + ar_i + arRoot[2];
            break;

        case 3:
            output = arRoot[0] + ar_a + ar_A + arRoot[1] + ar_i + arRoot[2];
            break;

        case 4:
            output = arRoot[0] + ar_0 + arRoot[1] + ar_i + arRoot[2];
            //* sukkun over 2nd radical assumed, not on chart
            break;

        case 5:
            output = ar_t + ar_a + conjActivePresent(arRoot, 2).replace(ar_i, ar_a);
            break;

        case 6:
            output = ar_t + ar_a + conjActivePresent(arRoot, 3).replace(ar_i, ar_a);
            break;

        case 7:
            output = ar_n + ar_0 + arRoot[0] + ar_a + arRoot[1] + ar_i + arRoot[2];
            break;

        case 8:
            output = arRoot[0] + ar_0 + ar_t + ar_a + arRoot[1] + ar_i + arRoot[2];
            break;

        case 9:
            output = arRoot[0] + ar_0 + arRoot[1] + ar_a + arRoot[2] + ar_2v;
            break;

        case 10:
            output = ar_s + ar_0 + ar_t + ar_a + arRoot[0] + ar_0 + arRoot[1] + ar_i + arRoot[2];
            break;

        default:
          output = "Error";
          break;
    }

    return output;

}


function conjImperative(arRoot, formNum, objRefs) {
//returns conjugated trilateral verb in Imperative

    var vowelCode = "",
        alifVowel = "",
        rad2Vowel = "";

    switch (formNum) {

        case 1:
            vowelCode = objRefs.query(arRoot, formNum, "f1Imperative0R2"); //split(**)
            alifVowel = vowelMe(vowelCode);
            vowelCode = objRefs.query(arRoot, formNum, "f1Imperative0R2"); //split(**)
            rad2Vowel = vowelMe(vowelCode);
            return ar_hA + alifVowel + arRoot[0] + ar_0 + arRoot[1] + rad2Vowel + arRoot[2] + ar_0;

        case 2:
        case 3:
        case 7:
        case 8:
        case 10:
            return conjActivePast(arRoot, formNum).slice(0,-2) + ar_i + arRoot[2] + ar_0;

        case 4:
            return ar_hA + ar_a + arRoot[0] + ar_a + arRoot[1] + ar_i + arRoot[2] + ar_0;

        case 5:
        case 6:
        case 9:
            return conjActivePast(arRoot, formNum);

        default:
            return "Error";
      }
}


function conjPassivePast(arRoot, formNum) {
//returns conjugated trilateral verb in Past Perfect (passive)

    var output;

    switch (formNum) {

        case 1:
          output =  arRoot[0] + ar_u + arRoot[1] + ar_i + arRoot[2];
          break;

        case 2:
          output =  arRoot[0] + ar_u + arRoot[1] + ar_2v + ar_i + arRoot[2];
          break;

        case 3:
          output =  arRoot[0] + ar_u + ar_U + arRoot[1] + ar_i + arRoot[2];
          break;

        case 4:
          output =  ar_hA + ar_u + arRoot[0] + ar_0 + arRoot[1] + ar_i + arRoot[2];
          break;

        case 5:
          output =  ar_t + ar_u + conjPassivePast(arRoot, 2);
          break;

        case 6:
          output =  ar_t + ar_u + conjPassivePast(arRoot, 3);
          break;

        case 7:
          output =  "---";
          break;

        case 8:
          output =  ar_A + ar_u + arRoot[0] + ar_0 + ar_t + ar_u + arRoot[1] + ar_i + arRoot[2];
          break;

        case 9:
          output =  conjActivePast(arRoot, formNum).replace(ar_i, ar_u);
          break;

        case 10:
          output =  ar_A + ar_u + ar_s + ar_0 + ar_t + ar_u + arRoot[0] + ar_0 + arRoot[1] + ar_i + arRoot[2];
          break;

        default:
          output =  "Error";
          break;
      }

      return output;
}


function conjPassivePresent(arRoot, formNum) {
//returns conjugated trilateral verb in Present Imperfect (passive)

    var output;

    switch (formNum) {

        case 1:
            output = arRoot[0] + ar_0 + arRoot[1] + ar_a + arRoot[2] + ar_u;
            break;

        case 2:
        case 3:
        case 4:
        case 8:
        case 10:
            output = conjActivePresent(arRoot, formNum).replace(ar_i, ar_a);
            break;

        case 5:
        case 6:
//          output = conjActivePresent(arRoot, formNum).replace(ar_a, ar_u);
            output = conjActivePresent(arRoot, formNum);
            break;

        case 7:
            output = "---";
            break;

//         case 8:
//         case 10:
//             output = conjActivePresent(arRoot, formNum).replace(ar_a, ar_u).replace(ar_i, ar_a);
//             break;

        case 9:
            output = arRoot[0] + ar_0 + arRoot[1] + ar_a + ar_A + arRoot[2] + ar_2v+ ar_u;
            break;

        default:
            output = "Error";
            break;
    }

    return output;

}


function irregularizer( word ) {
//switchboard function to call irregular modifications

    var wordRaw = word;


    if ( ( word.arRoot[0] === ar_Y ) || ( word.arRoot[0] === ar_U ) ){
        word = irregAssimilative( word );
    }

    if ( ( word.arRoot[1] === ar_Y ) || ( word.arRoot[1] === ar_U ) ){
        word = irregHollow( word );
    }

    if ( ( word.arRoot[2] === ar_Y ) || ( word.arRoot[2] === ar_U ) ) {
        word = irregDefective( word );
    }

    if ( ( word.arRoot.indexOf(ar_2v) > -1) || ( word.arRoot[1] === word.arRoot[2] ) ) {
        word = irregDoubled( word );
    }

    if ( hasHamza( word.arRoot ) ) {
        word = irregHamza( word );
    }

    //inform user if verb is irregular
    if ( word.verbType === "regular" ) {
        $("tfoot tr td:nth-child(1) ").html( "&nbsp <br> &nbsp " );
    } else {
        $("tfoot tr td:nth-child(1) ").html( "Irregular " + word.verbType + " conjugation applied to " + ar_LM + word.arRoot );

    //debug before and after
    var preChunk = tableChunk(wordRaw.suffix).wrap("<td>") +  tableChunk(wordRaw.stem).wrap("<td>") +  tableChunk(wordRaw.prefix).wrap("<td>");
        preChunk = preChunk.wrap("<tr>").wrap("<tbody>");

    var hChunk = "Suffix".wrap("<th>") + "Stem".wrap("<th>") + "Prefix".wrap("<th>");
        hChunk = hChunk.wrap("<tr>").wrap("<thead>");
        preChunk = (hChunk + preChunk).wrap("<table>");

        preChunk =  "<h3> PreProcessing of " + ar_LM + wordRaw.arRoot + " f(" + wordRaw.formNum + ")</h3>" + preChunk;

    var postChunk = tableChunk(word.suffix).wrap("<td>") +  tableChunk(word.stem).wrap("<td>") +  tableChunk(word.prefix).wrap("<td>");
        postChunk = postChunk.wrap("<tr>").wrap("<tbody>");
        postChunk = (hChunk + postChunk).wrap("<table>");

        postChunk =  "<h3> PostProcessing of " + ar_LM + wordRaw.arRoot + " f(" + wordRaw.formNum + ")</h3>" + postChunk;

    if ( ( wordRaw.formNum === 1 ) && ( wordRaw.enTense === "present" ) && (word.isActive ) ) {
         jqAlert( preChunk + "<br><br>" +postChunk ); // + postChunk
         }
    //end debug before and after

    }

return word;

} // end irregularizer


function irregAssimilative( word ) {
// modifies stem in accordance with irregular verb rules
// assumes ( root[0] === ar_Y ) || ( root[0] === ar_U )

    word.verbType = "assimilative";

    if ( ( word.enTense  === "present" ) && ( word.arRoot[0] === ar_U ) ) {
        word.stem = word.stem.slice(2);
    }

return word;
}


function irregHollow( word ) {
// modifies word.stem in accordance with irregular verb rules
// assumes ( ( word.arRoot[1] === ar_Y ) || ( word.arRoot[1] === ar_U ) )

    word.verbType = "hollow";

var rad1Vowel = "",
    index = -1;

    if ( word.enTense === "present" ){

        //present or imperative tense generally stay regular
        if ( isHollowIrregular(word.arRoot) ) {

            //for very irregular verbs
            if (( word.arSubject === pro_vousF ) || ( word.arSubject === pro_theyF ) ) {
                word.stem = word.stem.replace(word.arRoot[1],"");

            } else {
                word.stem = word.stem.replace(word.arRoot[1],ar_A);

            }

        } else {
            //find first root letter, than advance to vowel position over it.
            //assumption: there will only be one vowel
            index = word.stem.indexOf(word.arRoot[0]);
            if ( index >-1 ) { ++index; }

            //set short vowel over radical 1 to compliment radical 2 long vowel
            if ( word.arRoot[1] === ar_Y ) { rad1Vowel = ar_i;  }
            else { rad1Vowel = ar_u; }

            //replace sukkun or non-complimentary short vowel
            if ( isShortVowel(word.stem[index]) ) {
                word.stem = word.stem.slice(0,index) + rad1Vowel + word.stem.slice(index+1);
            }
        }

    } else if ( word.enTense === "past" ) {

        if ( isHollowIrregular(word.arRoot) ) {
            //for very irregular verbs
            rad1Vowel = ar_u;   //** SWAG, QA-QC            // ** resume work here
            word.stem = word.arRoot[0] + rad1Vowel + word.stem.slice(2);
        }

        if ( ( word.arSubject = pro_he ) || ( word.arSubject = pro_she ) || (word.arSubject = pro_theyM) ) {
            index = word.stem.indexOf(word.arRoot[1]);
            word.stem = word.stem.slice(0, index) + ar_A + word.stem.slice(index+1);

            if ( hasShortVowel( word.stem[index+1] ) ) {
                //remove short vowel following word.arRoot[1]
                word.stem = word.stem.slice(0, index+1) + word.stem.slice(index+2);
            }

        } else {
            //subject is i, we, you-m, you-f, vous-m, vous-f...they-f
            rad1Vowel = ar_u;
            if ( word.arRoot[1] === ar_i ) { rad1vowel = ar_i; }
           word.stem = word.arRoot[0] + rad1Vowel + word.stem.slice(2);
        }
    }

return word;
} //end irregHollow


function irregDefective( word ) {
// modifies stem in accordance with irregular verb rules
// assumes ( ( root[2] === ar_Y ) || ( root[2] === ar_U ) )

    if ( word.enTense === "past" ) {

        if ( word.arRoot[2] === ar_U ) {

            if ( ( arSubject === pro_she ) || ( arSubject === pro_theyM ) || ( arSubject === pro_theyF ) ) {
                word.stem = word.stem.replace(ar_U,"");

            } else if ( arSubject === pro_he ) {
                word.stem = word.stem.replace(ar_U,ar_A);
            }

        } else if ( ( word.arRoot[2] === ar_Y ) || ( word.arRoot[2] === ar_am ) ) {
                                         // ** is this condition necessary to catch ى ?
            if ( word.stem[3] === ar_a ) {

                if ( word.arSubject === pro_he ) {
                    //do nothing

                } else if ( ( word.arSubject === pro_she ) || ( word.arSubject === pro_theyM ) || ( word.arSubject === pro_theyF ) ) {
                    word.stem = word.stem.replace(word.arRoot[2],"");

                } else {
                    word.stem = word.stem.replace(ar_am,ar_Y);
                }

            } else if ( word.stem[3] === ar_i ) {

                if ( word.arSubject === pro_theyM ) {
                    word.stem = word.stem.replace(word.arRoot[2],"");
                }

            } else {
                console.log("irregDefective(" + word.stem + ",past," + word.arSubject + "," + word.arRoot + ") failed, defaulting to regular stem");
            }
        }

    } else if ( word.enTense === "present" ) {

            if ( ( word.arSubject === pro_youF ) || ( word.arSubject === pro_vousM ) || ( word.arSubject === pro_theyM ) ) {
                word.stem = stem.replace(ar_U,"");
            }
    }

return word;
} // end irregDefective


function irregDoubled( word ) {
//assumes doubled roots will end in shadda

word.verbType = "doubled";

// var strAlert = "regular: " + superChunk(word.stem) + "<br><br>";

    if (( word.formNum === 2 ) || ( word.formNum === 5 )) {
        //do nothing on forms 2, 5
        return word;
    }

    if ( word.enTense === "past" ) {

        if  ( word.suffix[0] === ar_u ) {
            //do nothing, keep shadda if damma is vowel over third radical (first char in suffix)

        } else if ( word.suffix[0] === ar_0 ) {
            word.stem = word.stem.slice(0,-1) + word.arRoot[1];
            //write last word.arRoot char twice if sukkun is non-vowel over third radical (first char in suffix)
        }

    } else if ( word.enTense === "present" ) {

        if ( ( word.arSubject === pro_vousF ) || ( word.arSubject === pro_theyF ) ) {
            word.stem = word.stem.slice(0,3) + ar_u + word.arRoot[1];
        }
    }

//  *** RESUME WORK HERE
// strAlert += "pre QA: " + superChunk(word.stem) + "<br><br>";

// 1) remove excess characters @ demarc of stem & suffix, 2) prune double shadda, 3) shift rad2 vowel to rad1

//set up debug traps
//     var htmlAlert = "<div id='debugDialog' title='debug dialog'>";
//     htmlAlert += "<h3>Pre Proc</h3>";
//     htmlAlert += "<p>[" + word.formNum + ", " + word.enTense + ", " + word.isActive + "] ";
//     htmlAlert += "SUFFIX: " + word.suffix + " STEM: " + word.stem + " PREFIX: " + word.prefix + "</p>";
//     htmlAlert += "<p>chunk: " + chunk(word.stem, false) + "</p>";

//adjust voweling
    var objRefs = makeReferenceObject();
    var rad2vowel = vowelMe( objRefs.query(word.arRoot, word.formNum, "f1ActivePastRad2") );

// strAlert += "post QA: " + superChunk(word.stem);
// jqAlert(strAlert);

//  need to apply radical2 vowel on radical1

//     word.stem = word.stem.replace(word.stem[1], rad2vowel);
//     word.stem = word.stem.slice(0,-2) + ar_2v;
//    word.stem = word.stem.replace(ar_2v + ar_2v, ar_2v);

//continue debug traps
//     htmlAlert += "<h3>Post Proc</h3>";
//     htmlAlert += "<p>[" + word.formNum + ", " + word.enTense + ", " + word.isActive + "] ";
//     htmlAlert += "SUFFIX: " + word.suffix + " STEM: " + word.stem + " PREFIX: " + word.prefix + "</p>";
//     htmlAlert += "<p>chunk: " + chunk(word.stem, false) + "</p>";
//
//show debug output
    if (( word.formNum === 8 ) && ( word.enTense === "past" ) && ( word.isActive ) ) {
//         jqAlert( htmlAlert );
    }


/*
//do not like
    //remove trailing doubled short vowel
    var len = word.stem.length-1;

    if ( ( word.stem[len] === word.suffix[0] )  ) {
    //&& ( hasShortVowel(word.stem[len]) )
        word.stem = word.stem.slice(0,-1);
    }

    //remove vowel before shadda
    len = word.stem.indexOf(ar_2v);
    if ( len > -1 ) {
        word.stem = word.stem.slice(0,len) + word.stem.slice(len+1)
    }
*/
    return word;
}


function tableChunk( stringIn ) {
//takes an Arabic text string, outputs a html table showing individual characters, split by consonant and vowel/diacritic rows

var consonantRow = "",
    vowelRow = "",
    vowelCell = "",
    htmlTable = "";

for (i = 0; i < stringIn.length; ++i) {

    if  ( ( stringIn.charCodeAt(i) === 1560 ) || ( stringIn.charCodeAt(i) === 1561 ) || ( stringIn.charCodeAt(i) === 1562 ) ||
          ( ( stringIn.charCodeAt(i) >= 1611 ) && ( stringIn.charCodeAt(i) <= 1618 ) ) ) {
        //collect vowels and write from bottom to top of cell
        vowelCell += "<br>" + ar_LM + stringIn[i] ;

    } else if ( ( stringIn.charCodeAt(i) >= 1536 ) && ( stringIn.charCodeAt(i) <= 1791 ) ) {
        //write all cells RTL
        consonantRow = stringIn[i].wrap("<td>") + consonantRow;

        //save vowels of proceeding consonant, once new consonant encountered...will write last/leftmost vowel TD blank no matter what
        vowelRow = vowelCell.wrap("<td>") + vowelRow;
        vowelCell = "";
    }

        //remove false-blank td in left-most column of vowel row and replace with vowelCell contents
        vowelRow = vowelCell.wrap("<td>") + vowelRow.slice("<td></td>".length);

}

htmlTable = vowelRow.wrap("<tr>");
htmlTable += consonantRow.wrap("<tr>");

stringIn += ar_LM;
htmlTable = stringIn.wrap("<th>").wrap("<tr>").wrap("<thead>") + htmlTable.wrap("<tbody>");

htmlTable = htmlTable.wrap("<table>");

return htmlTable;
}


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


function chunk(stringIn, goReverse) {

    if ( goReverse === undefined) {
        goReverse = false;
    }

    var stringOut = "",
        myArray = stringIn.split("");

    if ( goReverse ) {
            myArray = myArray.reverse();
    }

    myArray.forEach(function ( currentValue, index ) {
        stringOut += " " + currentValue + " ";
    });

//**debug
console.log("in: " + stringIn);
console.log("out: " + stringOut);

return stringOut;
}


function irregHamza( word ) {

word.verbType = "Irregular: hamza in root";

if ( hasHamza(word.arRoot[0]) ) {

    if ( word.arSubject === pro_i ) {
        //replace two alifs with alif madda
        word.prefix = ar_Am;
        word.stem = word.stem.slice(1);

        if ( word.stem[0] === ar_a ) {
            //necessary?
            word.stem = word.stem.slice(1);
        }
    }

} else if ( hasHamza(word.arRoot[1]) ) {
    //do nothing
    console.log("hamza on rad 2");

} else if ( hasHamza(word.arRoot[2]) ) {
    //do nothing
    console.log("hamza on rad 3");
}

return word;

}


function hasHamza(aString) {
//returns true if any character in the root contains a hamza

if ( aString === undefined) { aString = ""; }

var hasHamza = false;

if (
    ( -1 < aString.indexOf("ء") ) ||
    ( -1 < aString.indexOf("إ") ) ||
    ( -1 < aString.indexOf("أ") ) ||
    ( -1 < aString.indexOf("ئ") ) ||
    ( -1 < aString.indexOf("ؤ") ) ){
        hasHamza = true;
    }

return hasHamza;
}


function hasShortVowel(aString) {
//returns true if string contains short vowel or diacritic marks

//if ( aString === undefined) { aString = ""; }

var hasChar = false;

if (
    ( -1 < aString.indexOf(ar_a) ) ||
    ( -1 < aString.indexOf(ar_i) ) ||
    ( -1 < aString.indexOf(ar_u) ) ||
    ( -1 < aString.indexOf(ar_an) ) ||
    ( -1 < aString.indexOf(ar_in) ) ||
    ( -1 < aString.indexOf(ar_un) ) ||
//     ( -1 < aString.indexOf(ar_2v) ) ||
    ( -1 < aString.indexOf(ar_0) )  ){
        hasChar = true;
    }

return hasChar;

}


function isHollowIrregular(arRoot){
//returns true if verb is very irregular

    var arrIrregulars = [];
        arrIrregulars.push (ar_n + ar_U + ar_m);    //to sleep

    arrIrregulars.forEach(function (currentValue, index) {
        if ( currentValue === arRoot ) {
            return true;
        }
    });

    return false;
}