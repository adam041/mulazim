//Verb Conjugation Scripts

function verbalize(root, formNum, enTense, isActive, arSubject) {
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

//Declare string variables for internal use
var stem = "";
var prefix = "";
var suffix = "";

//Build object holding reference info needed to fill in details for forms 1-3
var objRefs = makeReferenceObject();

//Get the stem

if ( enTense === "present" ) {

    if ( isActive ) {
        stem = conjActivePresent(root, formNum, objRefs);
    } else {
        stem = conjPassivePresent(root, formNum, objRefs);
    }

} else if ( enTense === "past" ) {

    if ( isActive ) {
        stem = conjActivePast(root, formNum, objRefs);
    } else {
        stem = conjPassivePast(root, formNum, objRefs);
    }

} else if ( enTense === "imperative" ) {
    stem = conjImperative(root, formNum, objRefs);
}

//Get Present Prefix/Suffix
prefix = getPrefixSuffix(enTense, isActive, arSubject, true, formNum);
suffix = getPrefixSuffix(enTense,isActive, arSubject, false, formNum);

/*
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


} else {
// imperative Or fail
}
*/

//check if irregular
//  **  //  stem = irregularizer(stem, enTense, arSubject, root);

return prefix + stem + suffix;
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
        case 4:
            return ar_u;

        case 1:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
            return ar_a;

        default:
          return "؟";
    }
} else {
    return ar_u;
}

}


function conjActivePast(root, formNum, objRefs) {
//returns conjugated trilateral verb in Past Perfect (active)

    var output,
        rad2vowel = "";

    switch (formNum) {

        case 1:
          rad2vowel = vowelMe(objRefs.query(root, formNum, "f1ActivePastRad2"));
          output = root[0] + ar_a + root[1] + rad2vowel + root[2];
          break;

        case 2:
          output = root[0] + ar_a + root[1] + ar_2v + ar_a + root[2];
          break;

        case 3:
          output = root[0] + ar_a + ar_A + root[1] + ar_a + root[2];
          break;

        case 4:
          output = ar_hA + ar_a + root[0] + ar_0 + root[1] + ar_a + root[2];
          break;

        case 5:
          output = ar_t + ar_a + conjActivePast(root, 2);
          break;

        case 6:
          output = ar_t + ar_a + conjActivePast(root, 3);
          break;

        case 7:
          output = ar_A + ar_i + ar_n + ar_0 + root[0] + ar_a + root[1] + ar_a + root[2];
          break;

        case 8:
          output = ar_A + ar_i + root[0] + ar_0 + ar_t + ar_a + root[1] + ar_a + root[2];
          break;

        case 9:
          output = ar_A + ar_i + root[0] + ar_0 + root[1] + ar_a + root[2] + ar_2v;
          break;

        case 10:
          output = ar_A + ar_i + ar_s + ar_0 + ar_t + ar_a + root[0] + ar_0 + root[1] + ar_a + root[2];
          break;

        default:
          output = "Error";
          break;
      }

        return output;
}


function conjActivePresent(root, formNum, objRefs) {
//returns conjugated trilateral verb in Present Imperfect (active)

    var output,
        rad2vowel = "";

    switch (formNum) {

        case 1:
            rad2vowel = vowelMe(objRefs.query(root, formNum, "f1ActivePresentRad2"));
            output = root[0] + ar_0 + root[1] + rad2vowel + root[2] + ar_a;
            break;

        case 2:
            output = root[0] + ar_a + root[1] + ar_2v + ar_i + root[2] + ar_u;
            break;

        case 3:
            output = root[0] + ar_a + ar_A + root[1] + ar_i + root[2] + ar_u;
            break;

        case 4:
            output = root[0] + ar_0 + root[1] + ar_i + root[2] + ar_u;
            //* sukkun over 2nd radical assumed, not on chart
            break;

        case 5:
            output = ar_t + ar_a + conjActivePresent(root, 2).slice(2,-1).replace(ar_i, ar_a) + ar_u;
            break;

        case 6:
            output = ar_t + ar_a + conjActivePresent(root, 3).slice(2,-1).replace(ar_i, ar_a) + ar_u;
            break;

        case 7:
            output = ar_n + ar_0 + root[0] + ar_a + root[1] + ar_i + root[2] + ar_u;
            break;

        case 8:
            output = root[0] + ar_0 + ar_t + ar_a + root[1] + ar_i + root[2] + ar_u;
            break;

        case 9:
            output = root[0] + ar_0 + root[1] + ar_a + root[2] + ar_2v+ ar_u;
            break;

        case 10:
            output = ar_s + ar_0 + ar_t + ar_a + root[0] + ar_0 + root[1] + ar_i + root[2] + ar_u;
            break;

        default:
          output = "Error";
          break;
    }

    return output;

}


function conjImperative(root, formNum, objRefs) {
//returns conjugated trilateral verb in Imperative

    var vowelCode = "",
        alifVowel = "",
        rad2Vowel = "";

    switch (formNum) {

        case 1:
            vowelCode = objRefs.query(root, formNum, "f1Imperative0R2"); //split(**)
            alifVowel = vowelMe(vowelCode);
            vowelCode = objRefs.query(root, formNum, "f1Imperative0R2"); //split(**)
            rad2Vowel = vowelMe(vowelCode);
            return ar_hA + alifVowel + root[0] + ar_0 + root[1] + rad2Vowel + root[2] + ar_0;

        case 2:
        case 3:
        case 7:
        case 8:
        case 10:
            return conjActivePast(root, formNum).slice(0,-2) + ar_i + root[2] + ar_0;

        case 4:
            return ar_hA + ar_a + root[0] + ar_a + root[1] + ar_i + root[2] + ar_0;

        case 5:
        case 6:
        case 9:
            return conjActivePast(root, formNum);

        default:
            return "Error";
      }
}


function conjPassivePast(root, formNum) {
//returns conjugated trilateral verb in Past Perfect (passive)

    var output;

    switch (formNum) {

        case 1:
          output =  root[0] + ar_u + root[1] + ar_i + root[2];
          break;

        case 2:
          output =  root[0] + ar_u + root[1] + ar_2v + ar_i + root[2];
          break;

        case 3:
          output =  root[0] + ar_u + ar_U + root[1] + ar_i + root[2];
          break;

        case 4:
          output =  ar_hA + ar_u + root[0] + ar_0 + root[1] + ar_i + root[2];
          break;

        case 5:
          output =  ar_t + ar_u + conjPassivePast(root, 2);
          break;

        case 6:
          output =  ar_t + ar_u + conjPassivePast(root, 3);
          break;

        case 7:
          output =  "---";
          break;

        case 8:
          output =  ar_A + ar_u + root[0] + ar_0 + ar_t + ar_u + root[1] + ar_i + root[2];
          break;

        case 9:
          output =  conjActivePast(root, formNum).replace(ar_i, ar_u);
          break;

        case 10:
          output =  ar_A + ar_u + ar_s + ar_0 + ar_t + ar_u + root[0] + ar_0 + root[1] + ar_i + root[2];
          break;

        default:
          output =  "Error";
          break;
      }

      return output;
}


function conjPassivePresent(root, formNum) {
//returns conjugated trilateral verb in Present Imperfect (passive)

    var output;

    switch (formNum) {

        case 1:
            output = root[0] + ar_0 + root[1] + ar_a + root[2] + ar_u;
            break;

        case 2:
        case 3:
        case 4:
        case 8:
        case 10:
            output = conjActivePresent(root, formNum).replace(ar_i, ar_a);
            break;

        case 5:
        case 6:
//          output = conjActivePresent(root, formNum).replace(ar_a, ar_u);
            output = conjActivePresent(root, formNum);
            break;

        case 7:
            output = "---";
            break;

//         case 8:
//         case 10:
//             output = conjActivePresent(root, formNum).replace(ar_a, ar_u).replace(ar_i, ar_a);
//             break;

        case 9:
            output = root[0] + ar_0 + root[1] + ar_a + ar_A + root[2] + ar_2v+ ar_u;
            break;

        default:
            output = "Error";
            break;
    }

    return output;

}

function irregularizer(stem, enTense, arSubject, root) {
//switchboard function to call irregular modifications

    if ( root[0] === ar_A ) {
        return irregAssimiliative(stem, enTense, arSubject);
    }

    if ( ( root[1] === ar_Y ) || ( root[1] === ar_U ) ){
        return irregHollow(stem, enTense, arSubject, root);
    }

    if ( ( root[2] === ar_Y ) || ( root[2] === ar_U ) ) {
        return irregDefective(stem, enTense, arSubject, root);
    }

    if ( ( root.indexOf(ar_2v) > -1) || ( root[1] === root[2] ) ) {
        return irregDoubled(stem, enTense, arSubject, root);
    }

    if ( root.indexOf(ar_h5) > -1 ) {
        //what about hamza seated on a chair?
        //return irregHamza
    }

} // end irregularizer


function irregAssimiliative(stem, enTense, arSubject) {
// modifies stem in accordance with irregular verb rules
// assumes ( root[0] === ar_A )

    if ( enTense  === "present" ) {
        return stem.replace(ar_A,"");
    } else {
        return stem;
    }

}


function irregHollow(stem, enTense, arSubject, root) {
// modifies stem in accordance with irregular verb rules
// assumes ( ( root[1] === ar_Y ) || ( root[1] === ar_U ) )

var rad1Vowel = "";

    if ( enTense === "present" ){

        //present or imperative tense generally stay regular
        if ( isHollowIrregular(root) ) {

            //for very irregular verbs
            if (( arSubject === pro_vousF ) || ( arSubject === pro_theyF ) ) {
                return stem.replace(root[1],"");
            } else {
                return stem.replace(root[1],ar_A);
            }

        } else { return stem; }

    } else if ( enTense === "past" ) {

        if ( isHollowIrregular(root) ) {
            //for very irregular verbs
            rad1Vowel = ar_u;   //** SWAG, QA-QC            // ** resume work here
            return root[0] + rad1Vowel + stem.slice(2);
        }

        if ( ( arSubject = pro_he ) || ( arSubject = pro_she ) || (arSubject = pro_theyM) ) {
            return stem.replace(root[1],ar_A);

        } else {
            //subject is i, we, you-m, you-f, vous-m, vous-f...they-f
            rad1Vowel = ar_u;
            if ( root[1] === ar_i ) { rad1vowel = ar_i; }
           return root[0] + rad1Vowel + stem.slice(2);
        }

    } else { return stem; }

} //end irregHollow


function irregDefective(stem, enTense, arSubject, root) {
// modifies stem in accordance with irregular verb rules
// assumes ( ( root[2] === ar_Y ) || ( root[2] === ar_U ) )

    if ( enTense === "past" ) {

        if ( root[2] === ar_U ) {

            if ( ( arSubject === pro_she ) || ( arSubject === pro_theyM ) || ( arSubject === pro_theyF ) ) {
                return stem.replace(ar_U,"");

            } else if ( arSubject === pro_he ) {
                return stem.replace(ar_U,ar_A);

            } else {
                //subject is i, we, you-m, you-f, vous-m, vous-f
                return stem;
            }

        } else if ( ( root[2] === ar_Y ) || ( root[2] === ar_am ) ) {
                                         // ** is this condition necessary to catch ى ?
            if ( stem[3] === ar_a ) {

                if ( arSubject === pro_he ) {
                    return stem;

                } else if ( ( arSubject === pro_she ) || ( arSubject === pro_theyM ) || ( arSubject === pro_theyF ) ) {
                    return stem.replace(root[2],"");

                } else {
                    return stem.replace(ar_am,ar_Y);
                }

            } else if ( stem[3] === ar_i ) {

                if ( arSubject === pro_theyM ) {
                    return stem.replace(root[2],"");

                } else {
                    return stem;
                }

            } else {
                console.log("irregDefective(" + stem + ",past," + arSubject + "," + arRoot + ") failed, defaulting to regular stem");
                return stem;
            }
        }

    } else if ( enTense === "present" ) {


            if ( ( arSubject === pro_youF ) || ( arSubject === pro_vousM ) || ( arSubject === pro_theyM ) ) {
                return stem.replace(ar_U,"");

            } else {
                //subject is i, we, you-m, vous-f, he, she, they-f
                return stem;

            }
/*
//Make same changes for defective type 1, type 2, & type 3.  Needs validation.**

//         if ( root[2] === ar_U ){
//
//             if ( ( arSubject === pro_youF ) || ( arSubject === pro_vousM ) || ( arSubject === pro_theyM ) ) {
//                 return stem.replace(ar_U,"");
//
//             } else {
//                 //subject is i, we, you-m, vous-f, he, she, they-f
//                 return stem;
//             }
//
//         } else if ( root[2] === ar_Y ) {
//
//             if ( stem[3] === ar_a ) {
//
//                 if ( ( arSubject === pro_youF ) || ( arSubject === pro_vousM ) || ( arSubject === pro_theyM ) ) {
//                     return stem.replace(root[2],"");
//
//                 } else {
//                     //subject is i, we, you-m, vous-f, he, she, they-f
//                     return stem;
//                 }
//
//             } else if ( stem[3] === ar_i ) {
//
//                 if ( ( arSubject === pro_youF ) || ( arSubject === pro_vousM ) || ( arSubject === pro_theyM ) ) {
//                     return stem.replace(root[2],"");
//
//                 } else {
//                     //subject is i, we, you-m, vous-f, he, she, they-f
//                     return stem;
//                 }
//
//             } else {
//                 console.log("irregDefective(" + stem + ",present," + arSubject + "," + arRoot + ") failed, defaulting to regular stem");
//                 return stem;
//             }
//
//         }
*/

    } else { return stem;}

} // end irregDefective


function irregDoubled(stem, enTense, arSubject, root) {
//assumes doubled roots will end in shadda

var suffix = getPrefixSuffix(enTense, undefined, arSubject, false, root);

    if ( enTense === "past" ) {

        if  ( suffix[0] === ar_u ) {
            return stem;
            //keep shadda if damma is vowel over third radical (first char in suffix)

        } else if ( suffix[0] === ar_0 ) {
            return stem.slice(0,-1) + root[1];
            //write last root char twice if sukkun is non-vowel over third radical (first char in suffix)
        }

    } else if ( enTense === "present" ) {

        if ( ( arSubject === pro_vousF ) || ( arSubject === pro_theyF ) ) {
            return stem.slice(0,3) + root[1] + ar_u;

        } else {
            return stem;
        }
    }

}


function isHollowIrregular(root){
//returns true if verb is very irregular

    var arrIrregulars = [];
        arrIrregulars.push (ar_n + ar_U + ar_m);    //to sleep

    arrIrregulars.forEach(function (currentValue, index) {
        if ( currentValue === root ) {
            return true;
        }
    });

    return false;
}

/*
case ii - hollow - root[1] = ى/و - past - check backend; weird looking roots with ar_A in root[1] are likely misinterpreted roots in this pattern
*/