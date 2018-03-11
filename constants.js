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