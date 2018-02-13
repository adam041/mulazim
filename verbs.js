//Verb Conjugation Scripts

arRoot.verb = function(tense, formNum) {

  switch (tense) {

    //Active Tense
    case "ActivePast":
        return conjActivePast(arRoot.root, formNum);
        break;

    case "ActivePresent":
        return conjActivePresent(arRoot.root, formNum);
        break;

    case "Imperative":
        //return conjImperative(arRoot.root, formNum);
        break;

    case "PassivePast":
        //return conjPassivePast(arRoot.root, formNum);
        break;

    case "PassivePerfect":
        //return conjPassivePresent(arRoot.root, formNum);
        break;

    default:
      console.log("error, invalid tense entered");
      break;
      }
};

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
          break;

        case 4:
          return ar_hA + root[0] + ar_0 + root[1] + ar_a + root[2] + ar_a;
          break;

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
            break;

        case 4:
          return ar_Y + ar_u + root[0] + ar_0 + root[1] + ar_i + root[2] + ar_u;
          //* sukkun over 2nd radical assumed, not on chart
            break;

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