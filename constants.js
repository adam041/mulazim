// // // CONSTANTS
//Variables holding frequently used arabic characters.
//Holding Arabic strings inside prevents RTF/LTR mismatch dorkery

'esversion: 6';

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
    ar_Am = "آ",        //alif with madda hat
    ar_Y="ي",           //ya
    ar_am="ى",          //alif maqsura
    ar_U="و",           //wuuw

//hamza
    ar_h5="ء",          //hamza
    ar_hA="أ",          //alif w/ upper hamza
    ar_lA="إ",          //alif w/ lower hamza
    ar_hU="ؤ",          //hamza over wuw
    ar_hY="ئ",          //hamza over Ya

//consonants
    ar_hHat = "ح",
    ar_hEye = "ه",
    ar_l="ل",           //lam
    ar_m="م",           //mim
    ar_n="ن",           //nuun
    ar_s="س",           //sin
    ar_t="ت",           //ta
    ar_tb="ة",          //ta-marbuta
    ar_d="د",
    ar_dh="ذ",
    ar_z="ز",
    ar_Taa="ط",
    ar_Zaa="ظ",
    ar_Daad="ض",

//combos
    ar_LM = String.fromCharCode(1564),  //Arabic Language Marker character
    ar_ILB = "---";     //for intentionally left blank stems

//pronouns - no short vowels except to distinguish you-singular
const pro_i = ar_hA + ar_n + ar_A,
    pro_we = ar_n + ar_hHat + ar_n,

    pro_youM = ar_hA + ar_n + ar_t + ar_a,
    pro_youF = ar_hA + ar_n + ar_t + ar_i,
    pro_vousM = ar_hA + ar_n + ar_t + ar_m,
    pro_vousF = ar_hA + ar_n + ar_t + ar_n,

    pro_he = ar_hEye + ar_U,
    pro_she = ar_hEye + ar_Y,
    pro_theyM = ar_hEye + ar_m,
    pro_theyF = ar_hEye + ar_n + ar_A;

    pro_dualYou = ar_hA + ar_n + ar_t + ar_m + ar_A,
    pro_dualM = ar_hEye + ar_m + ar_A,
    pro_dualF = ar_hEye + ar_m + ar_A + "٢";

//array.reduce functions
const   arrWordSegments = ["prefix", "innerPrefix", "innerRight", "rad1", "midRight", "rad2", "midLeft", "rad3", "innerSuffix", "suffix"];
const   reducer = (accumulator, currentValue) => accumulator + currentValue;
const   rowReducer = (accumulator, currentValue, currentIndex) => accumulator + currentValue.wrap("<td class='vowelCell" + currentIndex+ "'>").wrap("<tr>");
        //rowReducer note: vowel rows are written to html doc from top to bottom

//root exemplars for testing
const ar_Do="فعل",
    arrive = "وصل",
    travel = "زور",
    fly = "طير",
    walk = "مشي",
    complain = "",
    take = "أخذ",
    replyA = "ردد",
    replyB = "ردّ";

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