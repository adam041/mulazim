//Noun Conjugation Scripts

function conjNounTimePlace(root, formNum) {

    switch (formNum) {

        case 1:
          return ar_m + ar_a + root[0] + ar_0 + root[1] + ar_a + root[2] + ar_un;

        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 8:
        case 10:
          return conjPassiveParticiple(root, formNum);

        case 7:
          return conjActiveParticiple(root, formNum).replace(ar_i, ar_a);

        case 9:
          return ar_ILB;

        default:
          return "Error";
    }
}


function conjPassiveParticiple(root, formNum) {
//returns conjugated trilateral noun as passive participle (recipient)

    switch (formNum) {

        case 1:
          return ar_m + ar_a + root[0] + ar_0 + root[1] + ar_i + root[2] + ar_un;

        case 2:
        case 3:
        case 4:
        case 6:
        case 8:
        case 10:
          return conjActiveParticiple(root, formNum).replace(ar_i, ar_a);

        case 5:
          return conjActiveParticiple(root, formNum).replace(ar_i, ar_a).slice(0,-1);
          // assuming no damma/tanwin ar_un on end

        case 7:
        case 9:
          return ar_ILB;

        default:
          return "Error";
                }
}


function conjActiveParticiple(root, formNum) {
//returns conjugated trilateral noun as active participle (agent)

    switch (formNum) {

        case 1:
          return root[0] + ar_a + ar_A + root[1] + ar_i + root[2] + ar_un;

        case 2:
        case 3:
          return ar_mu + conjImperative(root, formNum).slice(0,-1) + ar_u;

        case 4:
          return conjActivePresent(root, formNum).replace(ar_Y, ar_m);

        case 5:
        case 6:
          return ar_mu + conjActivePresent(root, formNum).slice(2,-3) + ar_i + root[2] + ar_un;

        case 7:
        case 8:
          return ar_mu + conjImperative(root, formNum).slice(2,-1) + ar_un;

        case 9:
          return ar_mu + conjImperative(root, formNum).slice(2);

        case 10:
          return ar_mu + conjImperative(root, formNum).slice(2,-1) + ar_un;

        default:
          return "Error";
                }
}


function conjMasdar(root, formNum) {
//returns conjugated trilateral noun as Verbal Noun (masdar)

    var masdarOut,
        masdar1 = "",
        masdar2 = "",
        masdar3 = "",
        masdarData = objRefs.query(root, formNum, "Masdar");
                    //may be a fully conjugated word, single character code, or null

    //early exit if masdar pre-conjugated on backend
    if ( masdarData === null ) {
        masdarData = "";

    } else if (masdarData.length > 1) {
        return masdarData;
    }

  var masdarOut = "",
        masdarCode = "";

    switch (formNum) {

        case 1:
            //expects a single character code representing masdar pattern
            // ي فَعْل / ar_0
            // ة = فُعول / ar_U
            // فِعالة / ar_A

            masdar1 = root[0] + ar_a + root[1] + ar_0 + root[2] + ar_un;
            masdar2 = root[0] + ar_u + root[1] + ar_u + ar_U + root[2] + ar_un;
            masdar3 = root[0] + ar_u + root[1] + ar_a + ar_A + root[2] + ar_tb + ar_un;

            if ( masdarData === ar_0 ) {
                masdarOut = masdar1;

            } else if (masdarData === ar_U) {
                masdarOut = masdar2;

            } else if (masdarData === ar_A) {
                masdarOut = masdar3;

            //expects masdar will be fully written out
            masdarOut = objRefs.query(root, formNum, "Masdar");

            if (masdarOut === "") {
                //offers three common patterns if conjugated masdar not given
                masdarOut = root[0] + ar_a + root[1] + ar_0 + root[2] + " | ";
                masdarOut += root[0] + ar_u + root[1] + ar_u + ar_U + root[2] + " | ";
                masdarOut += root[0] + ar_i + root[1] + ar_a + ar_A + root[2] + ar_a + ar_tb + ar_un;
            }

            } else {
                //offers three common patterns if masdar code not given
                masdarOut = masdar1 + " - " + masdar2 + " - " + masdar3;
            }
            return masdarOut;

        case 2:
            //expects a single character code representing masdar pattern
            // ي = تفعيل / ar_Y
            // ة = تفعلة / ar_tb
            //if no code found, outputs both patterns

            masdar1 = ar_t + ar_a + root[0] + ar_0 + root[1] + ar_i + ar_Y + root[2] + ar_un;
            masdar2 = ar_t + ar_a + root[0] + ar_0 + root[1] + ar_i + root[2] + ar_a + ar_tb + ar_un;
            masdarCode = objRefs.query(root, formNum, "Masdar");
            masdarOut = "";

            if ( masdarData === ar_Y ) {
                masdarOut = masdar1;

            } else if (masdarData === ar_tb) {
                masdarOut = masdar2;

            } else {
                masdarOut = masdar1 + " - " + masdar2;
            }
            return masdarOut;

        case 3:
          //expects a single character code representing masdar pattern
          // م = مفاعلة / ar_m
          // ا = فعال / ar_A
          //if no code found, outputs both patterns

            masdar1 = ar_m + ar_u + root[0] + ar_a + ar_A + root[1] + ar_a + root[2] + ar_a + ar_tb + ar_un;
            masdar2 = root[0] + ar_i + root[1] + ar_a + ar_A + root[2] + ar_un;

          if ( masdarData === ar_m ) {
            masdarOut = masdar1;

          } else if (masdarData === ar_A) {
            masdarOut = masdar2;

          } else {
            masdarOut = masdar1 + " - " + masdar2;
          }
            return masdarOut;

        case 4:
            return ar_lA + ar_i + root[0] + ar_0 + root[1] + ar_a + ar_A + root[2] + ar_un;

        case 5:
          return ar_t + ar_a + root[0] + ar_a + root[1] + ar_2v + ar_u + root[2] + ar_un ;

        case 6:
          return ar_t + ar_a + root[0] + ar_a + ar_A + root[1] + ar_u + root[2] + ar_un ;
          //fatah over radical 1 assumed *

        case 7:
          return ar_A + ar_i + ar_n + ar_0 + root[0] + ar_i + root[1] + ar_a + ar_A + root[2] + ar_un;
                  //fatah over radical 2 assumed *

        case 8:
          return ar_A + ar_i + root[0] + ar_0 + ar_t + ar_i + root[1] + ar_a + ar_A + root[2] + ar_un;
                  //fatah over radical 2 assumed *

        case 9:
          return ar_A + ar_i + root[0] + ar_0 + root[1] + ar_i + ar_l + ar_A + root[2] + ar_un;

        case 10:
          return ar_A + ar_i + ar_s + ar_0 + ar_t + ar_i + root[0] + ar_0 + root[1] + ar_A + root[2] + ar_un;

        default:
          return "Error";
    }
}