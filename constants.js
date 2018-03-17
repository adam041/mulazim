// // // CONSTANTS
//Variables holding frequently used arabic characters.
//Holding Arabic strings inside prevents RTF/LTR mismatch dorkery

//short vowels & diacritics
const ar_a="َ",         //fatah
    ar_i="ِ",           //kasrah
    ar_u="ُ",           //damma

    ar_an="ً",          //fatah + tanwin
    ar_in="ٍ",          //kasrah + tanwin
    ar_un="ٌ",          //damma + tanwin

    ar_0="ْ",           //sukkun
    ar_2v="ّ",          //shadda

//long vowels
    ar_A="ا",           //alif (plain)
    ar_hA="أ",          //alif w/ upper hamza
    ar_lA="إ",          //alif w/ lower hamza
    ar_Am = "آ",        //alif with madda hat
    ar_Y="ي",           //ya
    ar_am="ى",          //alif maqsura
    ar_U="و",           //wuuw

//consonants
    ar_hHat = "ح",
    ar_hEye = "ه",
    ar_l="ل",           //lam
    ar_m="م",           //mim
    ar_n="ن",           //nuun
    ar_s="س",           //sin
    ar_t="ت",           //ta
    ar_tb="ة",          //ta-marbuta
    ar_h5="ء",          //hamza

//combos
    ar_mu="مٌ",         //mim + damma
    ar_Do="فعل",        //verb for debugging
    ar_LM = String.fromCharCode(1564),  //Arabic Language Marker character
    ar_ILB = "---",     //for intentionally left blank stems

//pronouns - no short vowels except to distinguish you-singular
    pro_i = ar_hA + ar_n + ar_A,
    pro_we = ar_n + ar_hHat + ar_n,

    pro_youM = ar_hA + ar_n + ar_t + ar_a,
    pro_youF = ar_hA + ar_n + ar_t + ar_i,
    pro_vousM = ar_hA + ar_n + ar_t + ar_m,
    pro_vousF = ar_hA + ar_n + ar_t + ar_n,

    pro_he = ar_hEye + ar_U,
    pro_she = ar_hEye + ar_Y,
    pro_theyM = ar_hEye + ar_m,
    pro_theyF = ar_hEye + ar_n + ar_A;

const   reducer = (accumulator, currentValue) => accumulator + currentValue;
const   rowReducer = (accumulator, currentValue, currentIndex) => accumulator + currentValue.wrap("<td class='vowelCell" + currentIndex+ "'>").wrap("<tr>");
        //rowReducer note: vowel rows are written to html doc from top to bottom

/*
Notes
HTML/ASCI letter codes for Arabic and related alphabets: 1536 to 1791

Character codes for Arabic short vowel and diacritics:
    smaller sized vowels: 1560-1562
    regular sized short vowels and markings: 1611-1616
    shadda: 1617
    sukkun: 1618

Arabic Letter Marker for typesetting: 1564
*/