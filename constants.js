// // // CONSTANTS
//Variables holding frequently used arabic characters.
//Holding Arabic strings inside prevents RTF/LTR mismatch dorkery

//short vowels & diacritics
ar_a="َ";           //fatah
ar_i="ِ";           //kasrah
ar_u="ُ";           //damma

ar_an="ً";          //fatah + tanwin
ar_in="ٍ";          //kasrah + tanwin
ar_un="ٌ";          //damma + tanwin

ar_0="ْ";           //sukkun
ar_2v="ّ";          //shadda

//long vowels
ar_A="ا";           //alif (plain)
ar_hA="أ";          //alif w/ upper hamza
ar_lA="إ";          //alif w/ lower hamza
ar_Am = "آ";        //alif with madda hat
ar_Y="ي";           //ya
ar_am="ى";          //alif maqsura
ar_U="و";           //wuuw

//consonants
ar_hHat = "ح";
ar_hEye = "ه";
ar_l="ل";           //lam
ar_m="م";           //mim
ar_n="ن";           //nuun
ar_s="س";           //sin
ar_t="ت";           //ta
ar_tb="ة";          //ta-marbuta

ar_h5="ء";          //hamza

//combos
ar_mu="مٌ";         //mim + damma
ar_Do="فعل";        //verb for debugging

//pronouns - no short vowels except to distinguish you-singular
pro_i = ar_hA + ar_n + ar_A;
pro_we = ar_n + ar_hHat + ar_n;

pro_youM = ar_hA + ar_n + ar_t + ar_a;
pro_youF = ar_hA + ar_n + ar_t + ar_i;
pro_vousM = ar_hA + ar_n + ar_t + ar_m;
pro_vousF = ar_hA + ar_n + ar_t + ar_n;

pro_he = ar_hEye + ar_U;
pro_she = ar_hEye + ar_Y;
pro_theyM = ar_hEye + ar_m;
pro_theyF = ar_hEye + ar_n + ar_A;


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


//new master function?
function conjugate(root, formNum, tense, isActive, subject) {
//finds stem of a verb, and then adds prefixes and suffixes appropriate to tense and subject

//root and formNum are required parameters.  Active/Present/3rd person masculine single assumed if no param passed
// tense parameter should be "present" or "past"
// subject parameter should be lower case english*, with M/F as last character for you/vous */they

//ensure optional variables are not null
if ( tense === undefined ) {
    tense = "present";
}

if ( isActive === undefined ) {
    isActive = true;
}

if ( subject === undefined ) {
    subject = "هو";
}

//Declare internal string variables
var stem = "";
var prefix = "";
var suffix = "";

//Get the stem

if ( tense === "present" ) {

    if ( isActive ) {
        stem = conjActivePresent(root, formNum);
    } else {
        stem = conjPassivePresent(root, formNum);
    }

} else if ( tense === "past" ) {

    if ( isActive ) {
        stem = conjActivePast(root, formNum);
    } else {
        stem = conjPassivePast(root, formNum);
    }

} else if ( tense === "imperative" ) {
    stem = conjImperative(root, formNum);
}

//Get Present Prefix/Suffix
if ( tense === "present" ) {

    //Present Prefixes
    switch ( subject ) {

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
            prefix = ar_y + prefixVowel(formNum, isActive);
            break;
    }

    //Present Suffixes
    switch ( subject ) {

        case pro_youF:
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

} else if ( tense === "past" ) {
//Get Past Suffix

    switch ( subject ) {

        case pro_i:
            suffix = ar_0 + ar_t + ar_u;
            break;

        case pro_we:
            suffix = ar_0 + ar_n + ar_a;
            break;

        case pro_youM:
            suffix = ar_0 + ar_t + ar_a;
            break;

        case pro_youF:
            suffix = ar_0 + ar_t + ar_i;
            break;

        case pro_vousM:
            suffix = "؟؟؟*";
            break;

        case pro_vousF:
            suffix = "؟؟؟*";
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
            suffix = "؟؟؟*";
            break;
    }

} else {
// imperative Or fail
}

//check if irregular

return prefix + stem + suffix;

}