//Noun Conjugation Scripts

function conjNounTimePlace(root, formNum) {

    switch (formNum) {

        case 1:
          return ar_m + ar_a + root[0] + ar_0 + root[1] + ar_a + root[2] + ar_un;
          break;

        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 8:
        case 10:
          return conjPassiveParticiple(root, formNum);
          break;

        case 7:
          return conjActiveParticiple(root, formNum).replace(ar_i, ar_a);
          break;

        case 9:
          return "---";
          break;

        default:
          return "Error";
          break;
      }
}


function conjPassiveParticiple(root, formNum) {
//returns conjugated trilateral noun as passive participle (recipient)

    switch (formNum) {

        case 1:
          return ar_m + ar_a + root[0] + ar_0 + root[1] + ar_i + root[2] + ar_un;
          break;

        case 2:
        case 3:
        case 4:
        case 6:
        case 8:
        case 10:
          return conjActiveParticiple(root, formNum).replace(ar_i, ar_a);
          break;

        case 5:
          return conjActiveParticiple(root, formNum).replace(ar_i, ar_a).slice(0,-1);
          // assuming no damma/tanwin ar_un on end
          break;

        case 7:
        case 9:
          return "---";
          break;

        default:
          return "Error";
          break;
      }
}


function conjActiveParticiple(root, formNum) {
//returns conjugated trilateral noun as active participle (agent)

    switch (formNum) {

        case 1:
          return root[0] + ar_a + ar_A + root[1] + ar_i + root[2] + ar_un;
          break;

        case 2:
        case 3:
          return ar_mu + conjImperative(root, formNum).slice(0,-1) + ar_u;
          break;

        case 4:
          return conjActivePresent(root, formNum).replace(ar_Y, ar_m);
          break;

        case 5:
        case 6:
          return ar_mu + conjActivePresent(root, formNum).slice(2,-3) + ar_i + root[2] + ar_un;
          break;

        case 7:
        case 8:
          return ar_mu + conjImperative(root, formNum).slice(2,-1) + ar_un;
          break;

        case 9:
          return ar_mu + conjImperative(root, formNum).slice(2);
          break;

        case 10:
          return ar_mu + conjImperative(root, formNum).slice(2,-1) + ar_un;
          break;

        default:
          return "Error";
          break;
      }
}


function conjMasdar(root, formNum, objRefs) {
//returns conjugated trilateral noun as Verbal Noun (masdar)

    switch (formNum) {

        case 1:
           return objRefs.query(root, formNum, "Masdar");
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