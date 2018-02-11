//make constants out of Arabic character holders
//make methods to do concatenations based on a string



//crap
var reF2 = new RegExp();
sp = "&nbsp";
//end crap

//Variables holding frequently used arabic characters.
//Using variables prevents RTF/LTR mismatch dorkery
ar_a="َ";			//fatah
ar_i="ِ";			//kasrah
ar_u="ْ";			//damma
ar_0="ْ"; 		//sukkun
ar_2v="ّ";		//shadda

ar_hA="أ"; 		//alif w/ upper hamza
ar_A="ا"; 		//alif (plain)
ar_y="ي";			//ya
ar_u="و";			//wuuw
a_tb="ة";			//ta-marbuta

ar_t="ت";			//ta
ar_n="ن";		  //nuun
ar_s="س";			//sin
ar_m="م";			//mim
ar_l="ل";			//lam

root = "فعل";

//verbs, active perfect conjugation
f2 = root[0]+ar_a+root[1]+ar_2v+ar_a+root[2]+ar_a;
f3 = root[0]+ar_a+ar_A+root[1]+ar_a+root[2]+ar_a;
f4 = ar_hA+root[0]+ar_0+root[1]+ar_a+root[2]+ar_a;
f5 = ar_t+ar_a+f2;
f6 = ar_t+ar_a+f3;
f7 = ar_A+ar_i+ar_n+ar_0+root[0]+ar_a+root[1]+ar_a+root[2]+ar_a;
f8 = ar_A+ar_i+root[0]+ar_0+ar_t+ar_a+root[1]+ar_a+root[2]+ar_a;
f9 = ar_A+ar_i+root[0]+ar_0+root[1]+ar_a+root[2]+ar_2v+ar_a;
f10 = ar_A+ar_i+ar_s+ar_0+ar_t+ar_a+root[0]+ar_0+root[1]+ar_a+root[2]+ar_a;

//begin script
jQuery("#foo").html("hello world");
jQuery("#foo").html(root+" 2 "+f2+" 3 "+f3+" 4 "+f4+" 5 "+f5 + " 6 " + f6 + " 7 "+f7 +" 8 "+f8+" 9 "+f9+" 10 "+f10);


var objActPerfect = {
    arDesc: "",
    enDesc: "Verb in Past Tense, with Active Voice",
    var root = this.string;

    if ( root.length != 3 ) {

        //alert user that bad root used

    }

    f2 = function() {
        return root[0]+ar_a+root[1]+ar_2v+ar_a+root[2]+ar_a;
    }

    f2: root[0]+ar_a+root[1]+ar_2v+ar_a+root[2]+ar_a,
    f3: root[0]+ar_a+ar_A+root[1]+ar_a+root[2]+ar_a,
    f4: ar_hA+root[0]+ar_0+root[1]+ar_a+root[2]+ar_a,
    f5: ar_t+ar_a+f2,
    f6: ar_t+ar_a+f3,
    f7: ar_A+ar_i+ar_n+ar_0+root[0]+ar_a+root[1]+ar_a+root[2]+ar_a,
    f8: ar_A+ar_i+root[0]+ar_0+ar_t+ar_a+root[1]+ar_a+root[2]+ar_a,
    f9: ar_A+ar_i+root[0]+ar_0+root[1]+ar_a+root[2]+ar_2v+ar_a,
    f10: ar_A+ar_i+ar


// //create objCEAC methods for array functions
// objCEAC.getIndex = function(strSection, strLabel, lngStartingIndex) {
//     return getIndex(this.body.array, strSection, strLabel, lngStartingIndex);
// };
//
// objCEAC.getValue = function(strSection, strLabel, blnOutputLabel) {
//     return getValue(this.body.array, strSection, strLabel, blnOutputLabel);
// };
//
// objCEAC.getValueMulti = function(strSection, strStartLabel, strStopLabel, blnOutputLabel) {
//     return getValueMulti(this.body.array, strSection, strStartLabel, strStopLabel, blnOutputLabel);
// };
//
// objCEAC.getValueMultiIf = function(strSection, strStartLabel, strStopLabel, blnOutputLabel, strYesQuestion, blnShowNoes) {
//     return getValueMultiIf(this.body.array, strSection, strStartLabel, strStopLabel, blnOutputLabel, strYesQuestion, blnShowNoes);
// };
//
// return objCEAC;
// }
};

//use case
var root = "فعل";
var output = "";
output = root.objActPerfect.f2;

var objCEAC = {
    head: {text: "", array: []}, //text holds metadata and remarks as string; array holds remarks ONLY as array of objects each having the properties .section, .label, .delimiter, and .value
    body: {text: "", array: []}, //text holds string, array holds CEAC body as array of objects each having the properties .section, .label, .delimiter, and .value
    barcode: "",     //10 digit barcode of CEAC
    casenumber: "",  //case number for DS-260 cases, repeats barcode for all others
    formtype: ""     //form type of CEAC, i.e. DS-160, DS-260, DS-1648
};
