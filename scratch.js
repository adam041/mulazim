// // // CONSTANTS
//Variables holding frequently used arabic characters.
//Holding Arabic strings inside prevents RTF/LTR mismatch dorkery

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


// // // INPUTS
    var strInput = "فعل";   //** eventually need to pull strInput from backend or 'menu' element


// // // Do stuff

jQuery( document ).ready(function() {
    var strOutput = "hello there";

    strOutput = arRoot.verb("PastPerfect",10);

    jQuery("#foo").html(strOutput);

});



arRoot = {
//** is there a better way to declare object?
    root: strInput      //need to pull from programmatic input **
};

arRoot.verb = function(tense, formNum) {

  switch (tense) {

    //Active Tense
    case "PastPerfect":
        return conjPastPerfect(arRoot.root, formNum);
        break;

    case "PresentImperfect":
        return conjPresentImperfect(arRoot.root, formNum);
        break;

//       switch (Form) {
//
//         case 1:
//           // pull non-programmatic value from backend? **
//           console.log("Form 1 not yet implemented, sorry.");
//           break;
//
//         case 2:
//           return this.root[0] + ar_a + this.root[1] + ar_2v + ar_a + this.root[2] + ar_a;
//           break;
//
//         case 3:
//           return this.root[0]+ar_a+ar_A+this.root[1]+ar_a+this.root[2]+ar_a;
//
//         case 4:
//           return ar_hA+this.root[0]+ar_0+this.root[1]+ar_a+this.root[2]+ar_a;
//
//         case 5:
//           return ar_t + ar_a + arRoot.verb(Tense,2);
//           break;
//
//         case 6:
//           return ar_t + ar_a + arRoot.verb(Tense,3);
//           break;
//
//         case 7:
//           return ar_A+ar_i+ar_n+ar_0+this.root[0]+ar_a+this.root[1]+ar_a+this.root[2]+ar_a;
//           break;
//
//         case 8:
//           return ar_A+ar_i+this.root[0]+ar_0+ar_t+ar_a+this.root[1]+ar_a+this.root[2]+ar_a;
//           break;
//
//         case 9:
//           return ar_A+ar_i+this.root[0]+ar_0+this.root[1]+ar_a+this.root[2]+ar_2v+ar_a;;
//           break;
//
//         case 10:
//           return ar_A+ar_i+ar_s+ar_0+ar_t+ar_a+this.root[0]+ar_0+this.root[1]+ar_a+this.root[2]+ar_a;
//           break;
//
//         default:
//             console.log("Error, invalid form passed.");
//             break;
//         //end case "PastPerfect":
//       }

// RESUME WORK HERE ***
     case "Imperative":
      break;

//Passive Tense
    case "PastPerfect":
      break;

//Passive Tense
    case "PresentPerfect":
      break;

    default:
      console.log("error, invalid tense entered");
      break;
      }

};

function conjPastPerfect(root, formNum) {
//returns conjugated trilateral verb in Past Perfect (active)

    switch (formNum) {

        case 1:
          // pull non-programmatic value from backend? **
          console.log("Form 1 not yet implemented, sorry.");
          break;

        case 2:
          return root[0] + ar_a + root[1] + ar_2v + ar_a + root[2] + ar_a;
          break;

        case 3:
          return root[0]+ ar_A + ar_A +root[1]+ ar_A +root[2]+ ar_a;

        case 4:
          return ar_hA +root[0]+ ar_0+root[1]+ ar_A +root[2]+ ar_a;

        case 5:
          return ar_t + ar_a + conjPastPerfect(root, 2);
          break;

        case 6:
          return ar_t + ar_a + conjPastPerfect(root, 3);
          break;

        case 7:
          return ar_A + ar_i + ar_n+ ar_0+root[0]+ ar_A +root[1]+ ar_A +root[2]+ ar_a;
          break;

        case 8:
          return ar_A + ar_i +root[0]+ ar_0+ ar_t + ar_A +root[1]+ ar_A +root[2]+ ar_a;
          break;

        case 9:
          return ar_A + ar_i +root[0]+ ar_0+root[1]+ ar_A +root[2]+ ar_2v+ ar_a;;
          break;

        case 10:
          return ar_A + ar_i + ar_s+ ar_0+ ar_t + ar_A +root[0]+ ar_0+root[1]+ ar_A +root[2]+ ar_a;
          break;

        default:
          console.log("Error, invalid form passed.");
          break;
      }

}


function conjPresentImperfect(root, formNum) {
//returns conjugated trilateral verb in Present Imperfect (active)

    switch (formNum) {

        case 1:
          // pull non-programmatic value from backend? **
          console.log("Form 1 not yet implemented, sorry.");
          break;

        case 2:
          return root[0] + ar_a + root[1] + ar_2v + ar_a + root[2] + ar_a;
          break;

        case 3:
          return root[0]+ ar_A + ar_A +root[1]+ ar_A +root[2]+ ar_a;

        case 4:
          return ar_hA +root[0]+ ar_0+root[1]+ ar_A +root[2]+ ar_a;

        case 5:
          return ar_t + ar_a + conjPastPerfect(root, 2);
          break;

        case 6:
          return ar_t + ar_a + conjPastPerfect(root, 3);
          break;

        case 7:
          return ar_A + ar_i + ar_n+ ar_0+root[0]+ ar_A +root[1]+ ar_A +root[2]+ ar_a;
          break;

        case 8:
          return ar_A + ar_i +root[0]+ ar_0+ ar_t + ar_A +root[1]+ ar_A +root[2]+ ar_a;
          break;

        case 9:
          return ar_A + ar_i +root[0]+ ar_0+root[1]+ ar_A +root[2]+ ar_2v+ ar_a;;
          break;

        case 10:
          return ar_A + ar_i + ar_s + ar_0 + ar_t + ar_A + root[0] + ar_0+root[1] + ar_A + root[2] + ar_a;
          break;

        default:
            console.log("Error, invalid form passed.");
            break;
      }

}
//
// objA.verbPastPerfect = {
//     arDesc: "فعل الماضي",
//     enDesc: "Verb in Past Tense, with Active Voice",
//
//     if ( this.root.length != 3 ) {
//         window.alert("Sorry, root is not three characters.");
//     }
//
// //  create methods for conjugation
//     f2 = function() {
//         return this.root[0]+ar_a+this.root[1]+ar_2v+ar_a+this.root[2]+ar_a;
//     }
//
// };

//     f1: "???",
//     f2: root[0]+ar_a+root[1]+ar_2v+ar_a+root[2]+ar_a,
//     f3: root[0]+ar_a+ar_A+root[1]+ar_a+root[2]+ar_a,
//     f4: ar_hA+root[0]+ar_0+root[1]+ar_a+root[2]+ar_a,
//     f5: ar_t+ar_a+f2,
//     f6: ar_t+ar_a+f3,
//     f7: ar_A+ar_i+ar_n+ar_0+root[0]+ar_a+root[1]+ar_a+root[2]+ar_a,
//     f8: ar_A+ar_i+root[0]+ar_0+ar_t+ar_a+root[1]+ar_a+root[2]+ar_a,
//     f9: ar_A+ar_i+root[0]+ar_0+root[1]+ar_a+root[2]+ar_2v+ar_a,
//     f10: ar_A+ar_i+ar


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


// var objCEAC = {
//     head: {text: "", array: []}, //text holds metadata and remarks as string; array holds remarks ONLY as array of objects each having the properties .section, .label, .delimiter, and .value
//     body: {text: "", array: []}, //text holds string, array holds CEAC body as array of objects each having the properties .section, .label, .delimiter, and .value
//     barcode: "",     //10 digit barcode of CEAC
//     casenumber: "",  //case number for DS-260 cases, repeats barcode for all others
//     formtype: ""     //form type of CEAC, i.e. DS-160, DS-260, DS-1648
// };
