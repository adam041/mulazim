//Noun Conjugation Scripts

arRoot.noun = function(tense, formNum) {

  switch (tense) {

    case "Masdar":
        return conjMasdar(arRoot.root, formNum);
        break;

    case "ActiveParticiple":
        //return conjActiveParticiple(arRoot.root, formNum);
        break;

    case "PassiveParticiple":
        //return conjPassiveParticiple(arRoot.root, formNum);;
        break;

    case "NounTimePlace":
        //return conjNounTimePlace(arRoot.root, formNum);
        break;

    default:
      return "error"
      break;
    }

};


function conjMasdar(root, formNum) {
//returns conjugated trilateral verb as Verbal Noun (masdar)

    switch (formNum) {

        case 1:
          // pull non-programmatic value from backend? **
          return "TBD";
          break;

        case 2:
          return ar_t + ar_a + root[0] + ar_0 + root[1] + ar_i + ar_Y + root[2] + ar_un + " | " + ar_t + ar_a + root[0] + ar_0 + root[1] + ar_i + root[2] + ar_a + ar_tb + ar_un;
          break;

        case 3:
            return ar_m + ar_u + root[0] + ar_a + ar_A + root[1] + ar_a + root[2] + ar_a + ar_tb + ar_un + " | " + root[0] + ar_i + root[1] + ar_a + ar_A + root[2] + ar_un;
            break;

        case 4:
            return ar_lA + ar_i + root[0] + ar_0 + root[1] + ar_a + ar_A + root[2] + ar_un;
            break;

        case 5:
          return ar_t + ar_a + root[0] + ar_a + root[1] + ar_2v + ar_u + root[2] + ar_un ;
          break;

        case 6:
          return ar_t + ar_a + root[0] + ar_a + ar_A + root[1] + ar_u + root[2] + ar_un ;
          //fatah over radical 1 assumed *
          break;

        case 7:
          return ar_A + ar_i + ar_n + ar_0 + root[0] + ar_i + root[1] + ar_a + ar_A + root[2] + ar_un;
          break;
        //fatah over radical 2 assumed *

        case 8:
          return ar_A + ar_i + root[0] + ar_0 + ar_t + ar_i + root[1] + ar_a + ar_A + root[2] + ar_un;
          break;
        //fatah over radical 2 assumed *

        case 9:
          return ar_A + ar_i + root[0] + ar_0 + root[1] + ar_i + ar_l + ar_A + root[2] + ar_un;
          break;

        case 10:
          return ar_A + ar_i + ar_s + ar_0 + ar_t + ar_i + root[0] + ar_0 + root[1] + ar_A + root[2] + ar_un;
          break;

        default:
          return "Error";
          break;
    }
}