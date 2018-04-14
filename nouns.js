//Noun Conjugation Scripts

function cnjNoun(arRoot, enTense) {         //, isActive,  arSubject){
//master function for noun conjugation

var drafts = [],
    draft = [];

var word = new Word(arRoot, enTense);       //, isActive, arSubject);

//get base conj, for all 10 forms
    draft = base10(word, cnjForm);
    drafts.push(draft);

//get regular verb conj, for all 10 forms
    draft = draft.x10(cnjRegularNoun, true);
    drafts.push(draft);

//adjust conj if irregular, for all 10 forms
//     draft = draft.x10(cnjIrregularVerb, true);
//     drafts.push(draft);

//apply QA routines
//     draft = draft.x10(qaVerb);
//     drafts.push(draft);

console.log(drafts);
return drafts.last();

}

function cnjRegularNoun(wordIn){
//routing function for noun conjugations

var word = clone(wordIn);
    word.layer = "preliminary regular noun";

//get Regular conjugation
if ( word.enTense === "masdar" ) {
    return cnjMasdar( word );

} else if ( word.enTense === "agent" ) {
    return cnjAgent( word );

} else if ( word.enTense === "recipient" ) {
    return cnjRecipient( word );

} else if ( word.enTense === "time-place" ) {
    return cnjTimePlace( word );

}

return word;

// handle irregulars in separate function, in order
// to compare & debug differences in processing
}


function cnjMasdar( wordIn ) {
//returns conjugated trilateral noun as Verbal Noun (masdar)

var word = clone(wordIn);
    word.enTense = "masdar";
    word.suffix.push(["", ar_un]);

//get data from backend, if available
var masdarOut = {},
    masdar1 = clone(word),
    masdar2 = clone(word),
    masdar3 = clone(word),
    masdarData = objRefs.query(word.arRoot, word.formNum, "Masdar");
                //may be a fully conjugated word, single character code, or null

//early exit if masdar pre-conjugated on backend
    if ( masdarData === null ) {
        masdarData = "";
    } else if (masdarData.length > 1) {
        return masdarData;
    }

//continue to conjugation

    switch (word.formNum) {

        case 1:
            //expects a single character code representing masdar pattern
            // ي فَعْل / ar_0
            // ة = فُعول / ar_U
            // فِعالة / ar_A

            masdar1.rad1.vowel(ar_a);
            masdar1.rad2.vowel(ar_0);

            masdar2.rad1.vowel(ar_u);
            masdar2.rad2.vowel(ar_u);
            masdar2.midLeft.push([ar_U, ""]);

            masdar3.rad1.vowel(ar_u);
            masdar3.rad2.vowel(ar_a);
            masdar3.midLeft.push([ar_A, ""]);
            masdar3.innerSuffix.push([ar_tb, ""]);

            if (( masdarData === ar_0 ) || ( masdarData === "٠" ) ) {
                word = masdar1;
            } else if (masdarData === ar_U) {
                word = masdar2;
            } else if (masdarData === ar_A) {
                word = masdar3;
            }

            if (masdarData === "") {
                //** note: this will disrupt irregular handling...bypass further processing if hyphen found?
                word = whole(masdar1) + " - " + whole(masdar2) + " - " + whole(masdar3);
            }
        break;

        case 2:
            //expects a single character code representing masdar pattern
            // ي = تفعيل / ar_Y
            // ة = تفعلة / ar_tb
            //if no code found, outputs both patterns

            word.prefix.push([ar_t, ar_a]);
            word.rad1.vowel(ar_0);
            word.rad2.vowel(ar_i);

            masdar1 = clone(word);
            masdar2 = clone(word);

            masdar1.midLeft.push([ar_Y, ""]);
            masdar2.rad3.vowel(ar_a);
            masdar2.innerSuffix.push(ar_tb, "");

            if ( masdarData === ar_Y ) {
                word = masdar1;
            } else if (masdarData === ar_tb) {
                word = masdar2;
            } else {
                word = whole(masdar1) + " - " + whole(masdar2);
            }
        break;

        case 3:
          //expects a single character code representing masdar pattern
          // م = مفاعلة / ar_m
          // ا = فعال / ar_A
          //if no code found, outputs both patterns

            masdar1.innerPrefix.push([ar_m, ar_u]);
            masdar1.rad1.vowel(ar_a);
            masdar1.midRight.push([ar_A, ""]);
            masdar1.rad2.vowel(ar_a);
            masdar1.rad3.vowel(ar_a);
            masdar1.innerSuffix.push(ar_tb, "");

            masdar2.rad1.vowel(ar_i);
            masdar2.rad2.vowel(ar_a);
            masdar2.midLeft.push([ar_A, ""]);
            masdar2.innerSuffix.push(ar_tb, "");

            if ( masdarData === ar_m ) {
                word = masdar1;
            } else if (masdarData === ar_A) {
                word = masdar2;
            } else {
                word = masdar1 + " - " + masdar2;
            }
        break;

        case 4:
            word.innerPrefix = [];
            word.innerPrefix.push([ar_lA, ar_i]); //overwrite default

            word.rad1.vowel(ar_0);
            word.rad2.vowel(ar_a);
            word.midLeft.push([ar_A, ""]);
        break;

        case 5:
//             word.innerPrefix.push([ar_t, ar_a]);
            word.rad1.vowel(ar_a);
            word.rad2.vowel(ar_2v + ar_u);
        break;

        case 6:
//             word.innerPrefix.push([ar_t, ar_a]);
            word.rad1.vowel(ar_a);
//             word.midRight.push([ar_A, ""]);
            word.rad2.vowel(ar_u);
        break;

        case 7:
//             word.innerPrefix.push([ar_A, ar_i]);
//             word.innerPrefix.push([ar_n, ar_0]);
            word.rad1.vowel(ar_i);
            word.rad2.vowel(ar_a);
            word.midLeft.push([ar_A, ""]);
        break;

        case 8:
//             word.innerPrefix.push([ar_A, ar_i]);
// //          word.rad1.vowel(ar_0);
//             word.midRight.push([ar_t, ar_i]);
            word.rad2.vowel(ar_a);
            word.midLeft.push([ar_A, ""]);
            break;

        case 9:
//          word.innerPrefix.push([ar_A, ar_i]);
            word.rad1.vowel(ar_0);
            word.rad2.vowel(ar_i);
            word.midLeft.push([ar_l, ""]);
            word.midLeft.push([ar_A, ""]);
            break;

        case 10:
            word.innerPrefix.pop();
            word.innerPrefix.push([ar_t, ar_i]);
            word.rad1.vowel(ar_0);
            word.rad2.vowel(ar_a);
            word.midLeft.push([ar_A, ""]);
            break;
        }

return word;
}


function cnjAgent( wordIn ) {
//returns conjugated trilateral noun as active participle (agent)

var word = clone(wordIn);
    word.enTense = "active participle";
    word.prefix.push([ar_m, ar_u]);
    word.suffix.push(["", ar_un]);

    switch (word.formNum) {

        case 1:
        case 2:
        case 3:
        case 5:
        case 6:
            word.rad1.vowel(ar_a);
            word.rad2.vowel(ar_i);
            break;

        case 4:
        case 7:
        case 8:
        case 10:
            word.rad1.vowel(ar_0);
            word.rad2.vowel(ar_i);
            break;

        case 9:
            word.rad1.vowel(ar_0);
            word.rad2.vowel(ar_a);
            break;

        //second pass; does this also get read? ** or should it be a second switch?
        case 1:
            word.midRight.push([ar_A, ""]);
            break;

        case 6:
        case 7:
        case 9:
        case 10:
            word.innerPrefix.shift();
            break;
    }

return word;
}


function cnjRecipient( wordIn ) {
//returns conjugated trilateral noun as passive participle (recipient)

var word = clone(wordIn);
    word.enTense = "passive participle";
    word.prefix.push([ar_m, ar_u]);
    word.suffix.push(["", ar_un]);

    switch (word.formNum) {

        case 1:
            word.prefix.vowel(ar_a);
            word.rad1.vowel(ar_0);
            word.rad2.vowel(ar_u);
            break;

        case 2:
        case 3:
            word.rad1.vowel(ar_a);
            word.rad2.vowel(ar_i);
            break;

        case 4:
            word.rad1.vowel(ar_0);
            word.rad2.vowel(ar_a);
            break;

        case 5:
        case 6:
            word.rad1.vowel(ar_a);
            word.rad2.vowel(ar_a);
            break;

        case 7:
        case 9:
            word = nonWord(word);
            break;

        case 8:
        case 10:
            word.innerPrefix.shift();
            word.rad1.vowel(ar_0);
            word.rad2.vowel(ar_i);
            break;
    }

return word;
}


function cnjTimePlace( wordIn ) {
//returns conjugated trilateral noun as noun of time and place

var word = clone(wordIn);
    word.enTense = "noun of time and place";
    word.prefix.push([ar_m, ar_u]);
    word.suffix.push(["", ar_un]);

    switch (word.formNum) {

        case 1:
            word.prefix.vowel(ar_a);
            word.rad1.vowel(ar_0);
            word.rad2.vowel(ar_a);
            break;

        case 2:
        case 3:
        case 5:
        case 6:
            word.rad1.vowel(ar_a);
            word.rad2.vowel(ar_a);
            break;

        case 4:
            word.rad1.vowel(ar_0);
            word.rad2.vowel(ar_a);
            break;

        case 7:
            word.innerPrefix.shift();
            word.rad1.vowel(ar_a);
            word.rad2.vowel(ar_a);
            break;


        case 9:
            word = nonWord(word);
            break;

        case 8:
        case 10:
            word.innerPrefix.shift();
            word.rad1.vowel(ar_0);
            word.rad2.vowel(ar_a);
            break;
    }

return word;
}


/*

////////    deprecate code below    /////////////

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
*/