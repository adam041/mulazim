//Verb Conjugation Scripts

function conjActivePast(root, formNum, objRefs) {
//returns conjugated trilateral verb in Past Perfect (active)

    switch (formNum) {

        case 1:
          var rad2vowel = vowelMe(objRefs.query(root, formNum, "f1ActivePastRad2"));
          return root[0] + ar_a + root[1] + rad2vowel + root[2] + ar_a;
          break;

        case 2:
          return root[0] + ar_a + root[1] + ar_2v + ar_a + root[2] + ar_a;
          break;

        case 3:
          return root[0] + ar_a + ar_A + root[1] + ar_a + root[2] + ar_a;
          break;

        case 4:
          return ar_hA + ar_a + root[0] + ar_0 + root[1] + ar_a + root[2] + ar_a;
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
          return ar_A + ar_i + root[0] + ar_0 + root[1] + ar_a + root[2] + ar_2v+ ar_a;
          break;

        case 10:
          return ar_A + ar_i + ar_s + ar_0 + ar_t + ar_a + root[0] + ar_0 + root[1] + ar_a + root[2] + ar_a;
          break;

        default:
          return "Error";
          break;
      }
}


function conjActivePresent(root, formNum, objRefs) {
//returns conjugated trilateral verb in Present Imperfect (active)

    switch (formNum) {

        case 1:
          var rad2vowel = vowelMe(objRefs.query(root, formNum, "f1ActivePresentRad2"));
          return ar_Y + ar_u + root[0] + ar_0 + root[1] + rad2vowel + root[2] + ar_a;
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
          return ar_Y + ar_a + ar_t + ar_a + conjActivePresent(root, 2).slice(2,-1).replace(ar_i, ar_a) + ar_u;
          break;

        case 6:
          return ar_Y + ar_a + ar_t + ar_a + conjActivePresent(root, 3).slice(2,-1).replace(ar_i, ar_a) + ar_u;
          break;

        case 7:
          return ar_Y + ar_a + ar_n + ar_0 + root[0] + ar_a + root[1] + ar_i + root[2] + ar_u;
          break;

        case 8:
          return ar_Y + ar_a + root[0] + ar_0 + ar_t + ar_a + root[1] + ar_i + root[2] + ar_u;
          break;

        case 9:
          return ar_Y + ar_a + root[0] + ar_0 + root[1] + ar_a + root[2] + ar_2v+ ar_u;
          break;

        case 10:
          return ar_Y + ar_a + ar_s + ar_0 + ar_t + ar_a + root[0] + ar_0 + root[1] + ar_i + root[2] + ar_u;
          break;

        default:
          return "Error";
          break;
    }
}


function conjImperative(root, formNum, objRefs) {
//returns conjugated trilateral verb in Imperative

    switch (formNum) {

        case 1:
          var vowelCode = objRefs.query(root, formNum, "f1Imperative0R2"); //split(**)
          var alifvowel = vowelMe(vowelCode);

          vowelCode = objRefs.query(root, formNum, "f1Imperative0R2"); //split(**)
          var rad2vowel = vowelMe(vowelCode);

          return ar_hA + alifvowel + root[0] + ar_0 + root[1] + rad2vowel + root[2] + ar_0;
          break;

        case 2:
        case 3:
        case 7:
        case 8:
        case 10:
          return conjActivePast(root, formNum).slice(0,-3) + ar_i + root[2] + ar_0;
          break;

        case 4:
          return ar_hA + ar_a + root[0] + ar_a + root[1] + ar_i + root[2] + ar_0;
          break;

        case 5:
        case 6:
        case 9:
          return conjActivePast(root, formNum).slice(0,-1);
          break;

        default:
          return "Error";
          break;
      }
}


function conjPassivePast(root, formNum) {
//returns conjugated trilateral verb in Past Perfect (passive)

    switch (formNum) {

        case 1:
          return root[0] + ar_u + root[1] + ar_i + root[2] + ar_a;
          break;

        case 2:
          return root[0] + ar_u + root[1] + ar_2v + ar_i + root[2] + ar_a;
          break;

        case 3:
          return root[0] + ar_u + ar_U + root[1] + ar_i + root[2] + ar_a;
          break;

        case 4:
          return ar_hA + ar_u + root[0] + ar_0 + root[1] + ar_i + root[2] + ar_a;
          break;

        case 5:
          return ar_t + ar_u + conjPassivePast(root, 2);
          break;

        case 6:
          return ar_t + ar_u + conjPassivePast(root, 3);
          break;

        case 7:
          return "---";
          break;

        case 8:
          return ar_A + ar_u + root[0] + ar_0 + ar_t + ar_u + root[1] + ar_i + root[2] + ar_a;
          break;

        case 9:
          return conjActivePast(root, formNum).replace(ar_i, ar_u);
          break;

        case 10:
          return ar_A + ar_u + ar_s + ar_0 + ar_t + ar_u + root[0] + ar_0 + root[1] + ar_i + root[2] + ar_a;
          break;

        default:
          return "Error";
          break;
      }
}

function conjPassivePresent(root, formNum) {
//returns conjugated trilateral verb in Present Imperfect (passive)

    switch (formNum) {

        case 1:
          return ar_Y + ar_u + root[0] + ar_0 + root[1] + ar_a + root[2] + ar_u;
          break;

        case 2:
        case 3:
        case 4:
          return conjActivePresent(root, formNum).replace(ar_i, ar_a);
          break;

        case 5:
        case 6:
          return conjActivePresent(root, formNum).replace(ar_a, ar_u);
          break;

        case 7:
          return "---";
          break;

        case 8:
        case 10:
          return conjActivePresent(root, formNum).replace(ar_a, ar_u).replace(ar_i, ar_a);
          break;

        case 9:
          return ar_Y + ar_u + root[0] + ar_0 + root[1] + ar_a + ar_A + root[2] + ar_2v+ ar_u;
          break;

        default:
          return "Error";
          break;
    }
}