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
ar_Y="ي";			//ya
ar_U="و";			//wuuw

ar_tb="ة";			//ta-marbuta
ar_un="ٌ";			//damma + tanwin

ar_t="ت";			//ta
ar_n="ن";		  //nuun
ar_s="س";			//sin
ar_m="م";			//mim
ar_l="ل";			//lam


// // // Do stuff

jQuery( document ).ready(function() {


// Break Out to Own Function **

    var strInput = "عمل";   //** eventually need to pull strInput from backend or 'menu' element
    arRoot.root = strInput;

    document.title = "LtCactus Conjugates " + strInput;

    var htmlTableStart = "<table> <tbody> ",
        htmlTableRows = "",
        htmlTableEnd = "</tbody> </table>";

//Nouns
//Nouns
//Nouns

//Nouns - Masdar
    htmlTableRows = "";
    for (var i = 1; i <= 10; ++ i) {
        htmlTableRows += "<tr> <td> " + arRoot.noun("Masdar", i) + " </td> </tr> ";
        }
    jQuery("#colMasdar").html( htmlTableStart + htmlTableRows + htmlTableEnd );

//PassivePresent

//PassivePast

//Imperative

//ActivePresent
    htmlTableRows = "";
    for (var i = 1; i <= 10; ++ i) {
        htmlTableRows += "<tr> <td> " + arRoot.verb("ActivePresent", i) + " </td> </tr> ";
        }
    jQuery("#colActivePresent").html( htmlTableStart + htmlTableRows + htmlTableEnd );

//ActivePast
    htmlTableRows = "";
    for (var i = 1; i <= 10; ++ i) {
        htmlTableRows += "<tr> <td> " + arRoot.verb("ActivePast", i) + " </td> </tr> ";
        }
    jQuery("#colActivePast").html( htmlTableStart + htmlTableRows + htmlTableEnd );

});



arRoot = {
//** is there a better way to declare object?
    //root: strInput      //need to pull from programmatic input **
};

arRoot.verb = function(tense, formNum) {

  switch (tense) {

    //Active Tense
    case "ActivePast":
        return conjActivePast(arRoot.root, formNum);
        break;

    case "ActivePresent":
        return conjActivePresent(arRoot.root, formNum);
        break;

// RESUME WORK HERE ***
     case "Imperative":
      break;

//Passive Tense
    case "PassivePast":
      break;

//Passive Tense
    case "PassivePerfect":
      break;

    default:
      console.log("error, invalid tense entered");
      break;
      }

};

arRoot.noun = function(tense, formNum) {

  switch (tense) {

    case "Masdar":
        return conjMasdar(arRoot.root, formNum);
        break;

    case "ActiveParticiple":
        return "";
        break;

    case "PassiveParticiple":
      return "";
      break;

    case "NounTimePlace":
      return "";
      break;

    default:
      return "error"
      break;
    }

};


function drawColumn( fContent ) {
// Takes a trilateral (3 character) Arabic root and conjugates possible noun/verb permutations across all ten forms,
// returns a table containing the result to specified HTML element by id

var htmlOut = "<table> <tbody> ";

for (var i = 1; i <= 10; ++ i) {
    htmlOut += "<tr> <td> " + fContent(root, formNum) + "</td> </tr> ";
    }

htmlOut += "</tbody> </table>";

return htmlOut;

}


function conjActivePast(root, formNum) {
//returns conjugated trilateral verb in Past Perfect (active)

    switch (formNum) {

        case 1:
          // pull non-programmatic value from backend? **
          return "TBD";
          break;

        case 2:
          return root[0] + ar_a + root[1] + ar_2v + ar_a + root[2] + ar_a;
          break;

        case 3:
          return root[0] + ar_a + ar_A + root[1] + ar_a + root[2] + ar_a;

        case 4:
          return ar_hA + root[0] + ar_0 + root[1] + ar_a + root[2] + ar_a;

        case 5:
          return ar_t + ar_a + conjActivePast(root, 2);
          break;

        case 6:
          return ar_t + ar_a + conjActivePast(root, 3);
          break;

        case 7:
          return ar_A + ar_i + ar_n + ar_0 + root[0] + ar_a + root[1] + ar_a + root[2] + ar_a;
          break;

        case 8:
          return ar_A + ar_i + root[0] + ar_0 + ar_t + ar_a + root[1] + ar_a + root[2] + ar_a;
          break;

        case 9:
          return ar_A + ar_i + root[0] + ar_0 + root[1] + ar_A + root[2] + ar_2v+ ar_a;
          break;

        case 10:
          return ar_A + ar_i + ar_s + ar_0 + ar_t + ar_A + root[0] + ar_0+ root[1] + ar_A + root[2] + ar_a;
          break;

        default:
          return "Error";
          break;
      }
}


function conjActivePresent(root, formNum) {
//returns conjugated trilateral verb in Present Imperfect (active)

    switch (formNum) {

        case 1:
          // pull non-programmatic value from backend? **
          return "TBD";
          break;

        case 2:
          return ar_Y + ar_u + root[0] + ar_a + root[1] + ar_2v + ar_i + root[2] + ar_u;
          break;

        case 3:
          return ar_Y + ar_u + root[0] + ar_a + ar_A + root[1] + ar_i + root[2] + ar_u;

        case 4:
          return ar_Y + ar_u + root[0] + ar_0 + root[1] + ar_i + root[2] + ar_u;
          //* sukkun over 2nd radical assumed, not on chart

        case 5:
          return ar_Y + ar_a + ar_t + ar_a + conjActivePast(root, 2).slice(0,-1) + ar_u;
          break;

        case 6:
          return ar_Y + ar_a + ar_t + ar_a + conjActivePast(root, 2).slice(0,-1) + ar_u;
          break;

        case 7:
          return ar_Y + ar_a + ar_n + ar_0 + root[0] + ar_a + root[1] + ar_i + root[2] + ar_u;
          break;

        case 8:
          return ar_Y + ar_a + root[0] + ar_0 + ar_t + ar_a + root[1] + ar_i + root[2] + ar_u;
          break;

        case 9:
          return ar_Y + ar_a + root[0] + ar_0 + root[1] + ar_A + root[2] + ar_2v+ ar_u;
          break;

        case 10:
          return ar_Y + ar_a + ar_s + ar_0 + ar_t + ar_a + root[0] + ar_0+ root[1] + ar_i + root[2] + ar_u;
          break;

        default:
          return "Error";
          break;
    }
}


function conjMasdar(root, formNum) {
//returns conjugated trilateral verb as Verbal Noun (masdar)

    switch (formNum) {

        case 1:
          // pull non-programmatic value from backend? **
          return "TBD";
          break;

        case 2:
          return ar_t + ar_a + root[0] + ar_0 + root[1] + ar_i + ar_Y + root[2] + ar_un + " || " + ar_t + ar_a + root[0] + ar_0 + root[1] + ar_i + root[2] + ar_a + ar_tb + ar_un;
          break;

// resume work here
        case 3:
          return root[0] + ar_a + ar_A + root[1] + ar_a + root[2] + ar_a;

        case 4:
          return ar_hA + root[0] + ar_0 + root[1] + ar_a + root[2] + ar_a;

        case 5:
          return ar_t + ar_a + conjActivePast(root, 2);
          break;

        case 6:
          return ar_t + ar_a + conjActivePast(root, 3);
          break;

        case 7:
          return ar_A + ar_i + ar_n + ar_0 + root[0] + ar_a + root[1] + ar_a + root[2] + ar_a;
          break;

        case 8:
          return ar_A + ar_i + root[0] + ar_0 + ar_t + ar_a + root[1] + ar_a + root[2] + ar_a;
          break;

        case 9:
          return ar_A + ar_i + root[0] + ar_0 + root[1] + ar_A + root[2] + ar_2v+ ar_a;
          break;

        case 10:
          return ar_A + ar_i + ar_s + ar_0 + ar_t + ar_A + root[0] + ar_0+ root[1] + ar_A + root[2] + ar_a;
          break;

        default:
          return "Error";
          break;
    }
}