//Verb Conjugation Scripts

function verbalize(arRoot, formNum, enTense, isActive, arSubject) {
//finds stem of a verb, and then adds prefixes and suffixes appropriate to tense and subject
//root and formNum are required parameters.  Active/Present/3rd person masculine single assumed if no param passed
// enTense parameter should be "present" or "past", english language string
// isActive is boolean
// arSubject parameter should be Arabic language string.  Omit short vowels except to distinguish singular forms of you

//console.log("Verbalize called with args: " + Object.entries(arguments) );

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

//Declare string variables for internal use
var word = {
        arRoot: arRoot,
        formNum: parseInt(formNum),
        enTense: enTense,
        isActive: isActive,
        arSubject: arSubject,
        verbType: "regular",
        prefix: "",
        stem: "",
        suffix: "",
        whole: function() {
            return this.prefix + this.stem + this.suffix;
        },
    };

//Build object holding reference info needed to fill in details for forms 1-3
// var objRefs = makeReferenceObject();

//Get the stem

if ( enTense === "present" ) {

    if ( isActive ) {
        word.stem = conjActivePresent(arRoot, formNum);
    } else {
        word.stem = conjPassivePresent(arRoot, formNum);
    }

} else if ( enTense === "past" ) {

    if ( isActive ) {
        word.stem = conjActivePast(arRoot, formNum);
    } else {
        word.stem = conjPassivePast(arRoot, formNum);
    }

} else if ( enTense === "imperative" ) {
    word.stem = conjImperative(arRoot, formNum);
}

//Get Present Prefix/Suffix
word.prefix = getPrefixSuffix(enTense, isActive, arSubject, true, formNum);
word.suffix = getPrefixSuffix(enTense,isActive, arSubject, false, formNum);

//squelch prefix/suffix if stem intentionally left blank
    if ( word.stem === ar_ILB ) {
        word.prefix = "";
        word.suffix = "";
    }

///////////////////////////////////
//perform post-processing QA checks

//check if irregular
word = irregularizer( word );

var wholeWord = word.whole();

// if ( word.formNum === 10 ) {
//    console.log( segment(word) );
// }

//Catch double alifs and combine to alif w/ madda. Needed for hollow verbs in form 6.
    var re2Alif = new RegExp(/[\u{0622}|\u{0623}|\u{0625}|\u{0627}]{2}/ug);
    wholeWord = wholeWord.replace(re2Alif, ar_Am);

//make form 8 adjustments
if ( word.formNum === 8 ) {

    if (( word.arRoot.charAt(0) === ar_t ) || ( hasHamza( word.arRoot.charAt(0) ) )) {
        wholeWord = wholeWord.replace(ar_t, ar_t + ar_2v);
    }

    if ( word.arRoot.charAt(0) === ar_U ) {
        wholeWord = wholeWord.replace(ar_U, "");
        wholeWord = wholeWord.replace(ar_t, ar_t + ar_2v);
    }

    if ( word.arRoot.charAt(0) === ar_z ) {
        wholeWord = wholeWord.replace(ar_t, ar_d);
    }

    if (( word.arRoot.charAt(0) === ar_d ) || ( word.arRoot.charAt(0) === ar_dh )) {
        wholeWord = wholeWord.replace(ar_t, ar_d + ar_2v);
    }

    if ( word.arRoot.charAt(0) === ar_Daad ) {
        wholeWord = wholeWord.replace(ar_t, ar_Taa);
    }

    if (( word.arRoot.charAt(0) === ar_Taa ) || ( word.arRoot.charAt(0) === ar_Zaa )) {
        wholeWord = wholeWord.replace(ar_t, ar_Taa + ar_2v);
    }

}


//Chunk string to array
var arrChunky = [];
    arrChunky = chunk(wholeWord);
                //consonants sub array stored at position 0
                //vowels sub array stored at position 1

////    ////    Debuggery
var htmlDebug = chunkTable( arrChunky, "", word );
////    ////    Debuggery

//write out initial conjugations to debug review area
 $( "#stage1" ).append( htmlDebug );

//de-dupe vowels
arrChunky[1].forEach(function ( subArray, index ) {
    arrChunky[1][index] = Array.from(new Set( subArray ));
});

//write out post-processed conjugations to debug review area
    htmlDebug = chunkTable( arrChunky, "", word );
    $( "#stage2" ).append( htmlDebug );

//flag excess vowels  ** it would be nicer if formatting didn't include shadda in overload count, but this is close enough
    $( ".vowelCell2" ).css({ "background-color": "yellow" });
    $( ".vowelCell3" ).css({ "background-color": "orange" });
    $( ".vowelCell4" ).css({ "background-color": "red" });

//Reassemble array to string
    wholeWord = "";

    var consonant = "",
        vowel = "";

//reverse() removed **
    arrChunky[0].forEach(function ( value, index ) {

        consonant = value;

        if ( arrChunky[1][index].length > 0 ) {
            vowel = arrChunky[1][index].reduce(reducer);
        } else { vowel = ""; }

        wholeWord += consonant + vowel;
        consonant = vowel = "";
    });

return wholeWord;
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
                suffix = ar_0 + ar_n + ar_a + ar_A;
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
                suffix = ar_0 + ar_t + ar_u + ar_n + ar_2v + ar_a;
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


function conjActivePast(arRoot, formNum) {
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


function conjActivePresent(arRoot, formNum) {
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



function conjJussive(arRoot, formNum) {
//returns conjugated trilateral verb in Jussive Form

/*
RESUME WORK HERE !!!  UNDORK existing conjugations before working on jussive

    var sWord = segment( word );

    if ( sWord.rad1Vowel === ar_0 ) {
    //do stuff if sukkun found!
    }

*/

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


function conjImperative(arRoot, formNum) {
//returns conjugated trilateral verb in Imperative


//six possible outputs (gender & quantity), derived from jussive (implied task...)

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
          output =  ar_ILB;
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
            output = arRoot[0] + ar_0 + arRoot[1] + ar_a + arRoot[2];
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
            output = ar_ILB;
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

//     var wordRaw = word;

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
    }

return word;

} // end irregularizer


function irregAssimilative( word ) {
// modifies stem in accordance with irregular verb rules
// assumes ( root[0] === ar_Y ) || ( root[0] === ar_U )

    var index = -1;


//bypass irregular processing
    switch ( word.formNum) {

        case 2:
        case 3:
        case 5:
        case 6:
        case 10:
            word.verbType = "regular in this form, root matches assimilative pattern";
            return word;

        case 4:
            //(present) has long U to start  **
            break;

        case 8:
            //double ت  **
            break;

        default: //proceed
            //case 1
            //case 7?
            //case 9?
    }

    word.verbType = "assimilative";

    console.log("precut assim f" + word.formNum + " " + word.stem);

    if ( ( word.enTense  === "present" ) && ( word.arRoot[0] === ar_U ) ) {

        index = word.stem.indexOf( word.arRoot[0] );

// resume work here *** form 7 appears to be cut short, 8 needs to preserve root[0] vowel
        if ( index > 0 ) {
            word.stem = word.stem.slice(index+2);

        } else {
            word.stem = word.stem.slice(0, index) + word.stem.slice(index+2);
        }

        console.log("postcut assim f" + word.formNum + " " + word.stem);
    }

return word;
}


function irregHollow( word ) {
// modifies word.stem in accordance with irregular verb rules
// assumes ( ( word.arRoot[1] === ar_Y ) || ( word.arRoot[1] === ar_U ) )

    word.verbType = "hollow";

var rad1Vowel = "",
    index = -1;

//for very irregular verbs
if ( isHollowIrregular(word.arRoot) ) {

    if ( word.enTense === "present" ) {

        if ( ( word.arSubject === pro_vousF ) || ( word.arSubject === pro_theyF ) ) {
            word.stem = word.stem.replace(word.arRoot[1],"");

        } else {

            var regexstring = "." + word.arRoot[1],
                regexp = new RegExp(regexstring, "gi"),
                replacement = ar_a + ar_A;

            word.stem = word.stem.replace(regexp,replacement);
        }

        return word;

    } else if ( word.enTense === "past" ) { /*  use usual irregular conjugation, but force kasra as radical 1 vowel */ }

}   // end very irregular processing

    if ( word.enTense === "present" ){

        //find first root letter, than advance to vowel position over it.
        //assumption: there will only be one vowel
        index = word.stem.indexOf(word.arRoot[0]);
        if ( index >-1 ) { ++index; }

        // short vowel over radical 1 to compliment radical 2 long vowel
        if ( word.arRoot[1] === ar_Y ) { rad1Vowel = ar_i;  }
        else { rad1Vowel = ar_u; }

        //replace sukkun or non-complimentary short vowel
        if ( isShortVowel(word.stem[index]) ) {
            word.stem = word.stem.slice(0,index) + rad1Vowel + word.stem.slice(index+1);
        }

    } else if ( word.enTense === "past" ) {

        if ( ( word.arSubject === pro_he ) || ( word.arSubject === pro_she ) || (word.arSubject === pro_theyM) ) {
            index = word.stem.indexOf(word.arRoot[1]);
            word.stem = word.stem.slice(0, index) + ar_A + word.stem.slice(index+1);

            if ( hasShortVowel( word.stem[index+1] ) ) {
                //remove short vowel following word.arRoot[1]
                word.stem = word.stem.slice(0, index+1) + word.stem.slice(index+2);
            }

        } else {
            //subject is i, we, you-m, you-f, vous-m, vous-f...they-f
            rad1Vowel = ar_u;
            if ( ( word.arRoot[1] === ar_Y ) || ( isHollowIrregular(word.arRoot)) ) {
                rad1Vowel = ar_i;
                }
            word.stem = word.arRoot[0] + rad1Vowel + word.stem.slice(3);
        }
    }

return word;
} //end irregHollow


function irregDefective( word ) {
// modifies stem in accordance with irregular verb rules
// assumes ( ( root[2] === ar_Y ) || ( root[2] === ar_U ) )

    if ( word.enTense === "past" ) {

        if ( word.arRoot[2] === ar_U ) {

            if ( ( word.arSubject === pro_she ) || ( word.arSubject === pro_theyM ) || ( word.arSubject === pro_theyF ) ) {
                word.stem = word.stem.replace(ar_U,"");

            } else if ( word.arSubject === pro_he ) {
                word.stem = word.stem.replace(ar_U,ar_A);
            }

        } else if ( ( word.arRoot[2] === ar_Y ) || ( word.arRoot[2] === ar_am ) ) {
                                         //  checking for "ى" is probably un-necessary.  root should be entered with ي.
            if ( word.arSubject === pro_he ) {
                word.stem = word.stem.slice(0,-1) + ar_am;
            }

        //find position of vowel over 2nd root char
        var index = word.stem.indexOf( word.arRoot.charAt(1) );

        if ( word.stem.charAt(index+1) === ar_a ) {
            if ( ( word.arSubject === pro_she ) || ( word.arSubject === pro_theyM ) || ( word.arSubject === pro_theyF ) ) {
                word.stem = word.stem.replace(word.arRoot.charAt(2), "");

            } else {
                word.stem = word.stem.replace(ar_am, ar_Y); //probably un-necessary
            }

        } else if ( word.stem.charAt(index+1) === ar_i ) {
            if ( word.arSubject === pro_theyM ) {
                word.stem = word.stem.replace(word.arRoot.charAt(2), "");
            }

        } else {
            console.log("irregDefective(" + word.stem + ",past," + word.arSubject + "," + word.arRoot + ") failed, defaulting to regular stem");
        }
        }

//             if ( word.stem[3] === ar_a ) {
//                 // may misfire if stem is longer
//                 if ( ( word.arSubject === pro_she ) || ( word.arSubject === pro_theyM ) || ( word.arSubject === pro_theyF ) ) {
//                     word.stem = word.stem.replace(word.arRoot[2],"");
//
//                 } else {
//                     word.stem = word.stem.replace(ar_am,ar_Y); //probably un-necessary
//                 }
//
//             } else if ( word.stem[3] === ar_i ) {
//                 // may misfire if stem is longer
//                 if ( word.arSubject === pro_theyM ) {
//                     word.stem = word.stem.replace(word.arRoot[2],"");
//                 }
//
//             } else {
//                 console.log("irregDefective(" + word.stem + ",past," + word.arSubject + "," + word.arRoot + ") failed, defaulting to regular stem");
//             }
//         }

        if ( ( word.arSubject === pro_youM ) || ( word.arSubject === pro_he ) || ( word.arSubject === pro_she ) ||
             ( word.arSubject === pro_we ) ) {
            //remove first char of suffix, since last char of stem will be long vowel
            word.suffix = word.suffix.slice(1);
        }

    } else if ( word.enTense === "present" ) {

            if ( ( word.arSubject === pro_youF ) || ( word.arSubject === pro_vousM ) || ( word.arSubject === pro_theyM ) ) {
                word.stem = word.stem.replace(ar_u + ar_U, "");
                word.stem = word.stem.replace(ar_i + ar_Y, "");

            } else if  (( word.arSubject === pro_vousF ) || ( word.arSubject === pro_theyF) || ( word.arSubject === pro_i )) {
                //remove first char of suffix, since last char of stem will be long vowel
                word.suffix = word.suffix.slice(1);
            }
    }

return word;
} // end irregDefective


function irregDoubled( word ) {
//assumes doubled roots will end in shadda

word.verbType = "doubled";
var index = -1,
    strBefore = "",
    strAfter = "";

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

        //Remove sukkun over radical 1 and shift radical 2 vowel to radical 1.
        //Needed for f1.  Maybe needed for forms 8-10?
            index = word.stem.indexOf(word.arRoot[1]) + 1; //increment to get vowel
            shiftMe = word.stem.slice(index,index+1);

        if (( isShortVowel(shiftMe) ) && (word.stem.indexOf(ar_0) > -1 )) {
            strBefore = word.stem.slice(0,index);
            strAfter = word.stem.slice(index+1);

            word.stem = strBefore + strAfter;
            word.stem = word.stem.replace(ar_0, shiftMe);
        }

        if ( ( word.arSubject === pro_vousF ) || ( word.arSubject === pro_theyF ) ) {
            index = word.stem.indexOf(word.arRoot[1]) + 1;
            word.stem = word.stem.slice(0,3) + ar_u + word.arRoot[1];
        }
    }

    return word;
}


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


function segment( word ) {
//takes a word object, returns an object containing segments of Arabic word, organized around radicals

//rad1Vowel?

var seg = {

    prefix: word.prefix,
    innerPrefix: "",

    rad1: word.arRoot.charAt(0),
    index1: -1,
    rad1Vowel: "",

    midRight: "",

    rad2: word.arRoot.charAt(1),
    index2: -1,
    rad2Vowel: "",

    midLeft: "",

    rad3: word.arRoot.charAt(2),
    index3: -1,
    rad3Vowel: "",

    innerSuffix: "",
    suffix: word.suffix,

    all: "",

    meta: word,
};

//get radical positions
    seg.index1 = word.stem.indexOf( seg.rad1 );
    seg.index2 = word.stem.indexOf( seg.rad2 );
    seg.index3 = word.stem.indexOf( seg.rad3 );

if ( seg.index1 > 0 ) {
    seg.innerPrefix = word.stem.slice(0, seg.index1 );
} else {
    seg.innerPrefix = "";
}

seg.midRight = word.stem.slice(seg.index1 + 1, seg.index2);

//take vowels from midRight
var i = 0;
while ( isShortVowel( seg.midRight.charAt(i), true) ) {
    seg.rad1Vowel += seg.midRight.charAt(i);
    seg.midRight = seg.midRight.slice(1);
    i++;
}

if ( seg.index3 === ar_2v ) {
    seg.rad3 = seg.rad2;
}

seg.midLeft = word.stem.slice(seg.index2 + 1, seg.index3);
//take vowels from midLeft
i = 0;
while ( isShortVowel( seg.midLeft.charAt(i), true) ) {
    seg.rad2Vowel += seg.midLeft.charAt(i);
    seg.midLeft = seg.midLeft.slice(1);
    i++;
}

//create innerSuffix and take rad3 vowel away (or from Suffix)
i = 0;
if ( word.stem.length > seg.index3 ) {
    seg.innerSuffix = word.stem.slice(seg.index3 + 1);
    while ( isShortVowel( seg.innerSuffix.charAt(i), true) ) {
        seg.rad3Vowel += seg.innerSuffix.charAt(i);
        seg.innerSuffix = seg.innerSuffix.slice(1);
        i++;
    }

} else {
    seg.innerSuffix = "";
    while ( isShortVowel( seg.suffix.charAt(i), true) ) {
        seg.rad3Vowel += seg.suffix.charAt(i);
        seg.suffix = seg.suffix.slice(1);
        i++;
    }

}

seg.all = seg.prefix + seg.innerPrefix + seg.rad1 + seg.rad1Vowel + seg.midRight + seg.rad2 + seg.rad2Vowel;
seg.all += seg.midLeft + seg.rad3 + seg.rad3Vowel + seg.innerSuffix + seg.suffix;

return seg;
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


function hasShortVowel(aString, includeShadda) {
//returns true if string contains short vowel or diacritic marks

if ( includeShadda === undefined) { includeShadda = false; }

var hasChar = false;

if (
    ( -1 < aString.indexOf(ar_a) ) ||
    ( -1 < aString.indexOf(ar_i) ) ||
    ( -1 < aString.indexOf(ar_u) ) ||
    ( -1 < aString.indexOf(ar_an) ) ||
    ( -1 < aString.indexOf(ar_in) ) ||
    ( -1 < aString.indexOf(ar_un) ) ||
    ( -1 < aString.indexOf(ar_0) )  ){
        hasChar = true;
    }

if ( ( includeShadda ) && ( -1 < aString.indexOf(ar_2v) ) ) {
    hasChar = true;
}

return hasChar;
}


function isHollowIrregular(arRoot){
//returns true if verb is very irregular

var arrIrregulars = [];
    arrIrregulars.push (ar_n + ar_U + ar_m);    //to sleep

var isMatch = function(element) {
        return element === arRoot;
    };

return arrIrregulars.some(isMatch);

}

String.prototype.replaceAt=function(index, char) {
//  https://gist.github.com/AdamBrodzinski/4010249
    return this.substr(0, index) + char + this.substr(index+char.length);
};