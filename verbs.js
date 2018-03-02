//Verb Conjugation Scripts

function conjActivePast(root, formNum, objRefs) {
//returns conjugated trilateral verb in Past Perfect (active)

    var output,
        rad2vowel = "";

    switch (formNum) {

        case 1:
          rad2vowel = vowelMe(objRefs.query(root, formNum, "f1ActivePastRad2"));
          output = root[0] + ar_a + root[1] + rad2vowel + root[2] + ar_a;
          break;

        case 2:
          output = root[0] + ar_a + root[1] + ar_2v + ar_a + root[2] + ar_a;
          break;

        case 3:
          output = root[0] + ar_a + ar_A + root[1] + ar_a + root[2] + ar_a;
          break;

        case 4:
          output = ar_hA + ar_a + root[0] + ar_0 + root[1] + ar_a + root[2] + ar_a;
          break;

        case 5:
          output = ar_t + ar_a + conjActivePast(root, 2);
          break;

        case 6:
          output = ar_t + ar_a + conjActivePast(root, 3);
          break;

        case 7:
          output = ar_A + ar_i + ar_n + ar_0 + root[0] + ar_a + root[1] + ar_a + root[2] + ar_a;
          break;

        case 8:
          output = ar_A + ar_i + root[0] + ar_0 + ar_t + ar_a + root[1] + ar_a + root[2] + ar_a;
          break;

        case 9:
          output = ar_A + ar_i + root[0] + ar_0 + root[1] + ar_a + root[2] + ar_2v+ ar_a;
          break;

        case 10:
          output = ar_A + ar_i + ar_s + ar_0 + ar_t + ar_a + root[0] + ar_0 + root[1] + ar_a + root[2] + ar_a;
          break;

        default:
          output = "Error";
          break;
      }

      return pastIrregular(root, output, "he");
}


function conjActivePresent(root, formNum, objRefs) {
//returns conjugated trilateral verb in Present Imperfect (active)

    var output,
        rad2vowel = "";

    switch (formNum) {

        case 1:
            rad2vowel = vowelMe(objRefs.query(root, formNum, "f1ActivePresentRad2"));
            output = ar_Y + ar_u + root[0] + ar_0 + root[1] + rad2vowel + root[2] + ar_a;
            break;

        case 2:
          output = ar_Y + ar_u + root[0] + ar_a + root[1] + ar_2v + ar_i + root[2] + ar_u;
          break;

        case 3:
            output = ar_Y + ar_u + root[0] + ar_a + ar_A + root[1] + ar_i + root[2] + ar_u;
            break;

        case 4:
          output = ar_Y + ar_u + root[0] + ar_0 + root[1] + ar_i + root[2] + ar_u;
          //* sukkun over 2nd radical assumed, not on chart
            break;

        case 5:
          output = ar_Y + ar_a + ar_t + ar_a + conjActivePresent(root, 2).slice(2,-1).replace(ar_i, ar_a) + ar_u;
          break;

        case 6:
          output = ar_Y + ar_a + ar_t + ar_a + conjActivePresent(root, 3).slice(2,-1).replace(ar_i, ar_a) + ar_u;
          break;

        case 7:
          output = ar_Y + ar_a + ar_n + ar_0 + root[0] + ar_a + root[1] + ar_i + root[2] + ar_u;
          break;

        case 8:
          output = ar_Y + ar_a + root[0] + ar_0 + ar_t + ar_a + root[1] + ar_i + root[2] + ar_u;
          break;

        case 9:
          output = ar_Y + ar_a + root[0] + ar_0 + root[1] + ar_a + root[2] + ar_2v+ ar_u;
          break;

        case 10:
          output = ar_Y + ar_a + ar_s + ar_0 + ar_t + ar_a + root[0] + ar_0 + root[1] + ar_i + root[2] + ar_u;
          break;

        default:
          output = "Error";
          break;
    }

    return presentIrregular(root, output, "he");

}


function conjImperative(root, formNum, objRefs) {
//returns conjugated trilateral verb in Imperative

    var vowelCode = "",
        alifvowel = "",
        rad2vowel = "";

    switch (formNum) {

        case 1:
            vowelCode = objRefs.query(root, formNum, "f1Imperative0R2"); //split(**)
            alifvowel = vowelMe(vowelCode);
            vowelCode = objRefs.query(root, formNum, "f1Imperative0R2"); //split(**)
            rad2vowel = vowelMe(vowelCode);
            return ar_hA + alifvowel + root[0] + ar_0 + root[1] + rad2vowel + root[2] + ar_0;

        case 2:
        case 3:
        case 7:
        case 8:
        case 10:
            return conjActivePast(root, formNum).slice(0,-3) + ar_i + root[2] + ar_0;

        case 4:
            return ar_hA + ar_a + root[0] + ar_a + root[1] + ar_i + root[2] + ar_0;

        case 5:
        case 6:
        case 9:
            return conjActivePast(root, formNum).slice(0,-1);

        default:
            return "Error";
      }
}


function conjPassivePast(root, formNum) {
//returns conjugated trilateral verb in Past Perfect (passive)

    var output;

    switch (formNum) {

        case 1:
          output =  root[0] + ar_u + root[1] + ar_i + root[2] + ar_a;
          break;

        case 2:
          output =  root[0] + ar_u + root[1] + ar_2v + ar_i + root[2] + ar_a;
          break;

        case 3:
          output =  root[0] + ar_u + ar_U + root[1] + ar_i + root[2] + ar_a;
          break;

        case 4:
          output =  ar_hA + ar_u + root[0] + ar_0 + root[1] + ar_i + root[2] + ar_a;
          break;

        case 5:
          output =  ar_t + ar_u + conjPassivePast(root, 2);
          break;

        case 6:
          output =  ar_t + ar_u + conjPassivePast(root, 3);
          break;

        case 7:
          output =  "---";
          break;

        case 8:
          output =  ar_A + ar_u + root[0] + ar_0 + ar_t + ar_u + root[1] + ar_i + root[2] + ar_a;
          break;

        case 9:
          output =  conjActivePast(root, formNum).replace(ar_i, ar_u);
          break;

        case 10:
          output =  ar_A + ar_u + ar_s + ar_0 + ar_t + ar_u + root[0] + ar_0 + root[1] + ar_i + root[2] + ar_a;
          break;

        default:
          output =  "Error";
          break;
      }

      return pastIrregular(root, output, "he");
}


function conjPassivePresent(root, formNum) {
//returns conjugated trilateral verb in Present Imperfect (passive)

    var output;

    switch (formNum) {

        case 1:
            output = ar_Y + ar_u + root[0] + ar_0 + root[1] + ar_a + root[2] + ar_u;
            break;

        case 2:
        case 3:
        case 4:
            output = conjActivePresent(root, formNum).replace(ar_i, ar_a);
            break;

        case 5:
        case 6:
            output = conjActivePresent(root, formNum).replace(ar_a, ar_u);
            break;

        case 7:
            output = "---";
            break;

        case 8:
        case 10:
            output = conjActivePresent(root, formNum).replace(ar_a, ar_u).replace(ar_i, ar_a);
            break;

        case 9:
            output = ar_Y + ar_u + root[0] + ar_0 + root[1] + ar_a + ar_A + root[2] + ar_2v+ ar_u;
            break;

        default:
            output = "Error";
            break;
    }

    return presentIrregular(root, output, "he");

}

function expandSubjects(conjHe, tense, root, form) {
//returns an object holding all conjugations for a given verb form and tense by subject

if ( tense.toLowerCase() === "present" ) {

//Begin with a regular verb, then modify if irregular
    //regular verbs
    subs = {
        stem: conjHe.slice(2,-1),

    //1st person
        i: ar_A + subs.stem,
        we: ar_n + ar_a + subs.stem,

    //2nd person
        you_m: ar_t + ar_a + subs.stem,
        you_f: conjHe + ar_u + ar_U + ar_n,

        vous_m: subs.you_m + ar_u + ar_U + ar_n + ar_a,
        vous_f: subs.you_m + ar_0 + ar_n + ar_a,

    //third person
        he: conjHe,
        she: subs.you_m,
        they_m: subs.he + ar_u + ar_U + ar_n,
        they_f: subs.he + ar_0 + ar_n + ar_a,
    };

//Do irregular checks (present tense)

//combine constants >> ya, ta, Un, na ?

//so far so good?
console.log(allSubjects);


//////////////////////////////////////////////
} else if ( tense.toLowerCase() === "past" ) {
//present tense

    allSubjects.stem = conjHe.slice(0,-1);
}


return allSubjects;
}


function pastIrregular(root, draftConjugation, enSubject) {
//takes a conjugated verb and applies irregular rules
//right now only works with enSubject-third person-single-male

var output = "";

if (enSubject === undefined) {
    enSubject = "he";
}

///////////////////
//assimilative past

if ( root[0] === ar_A ) {

    return draftConjugation

} // end assimilative

/////////////
//hollow past

if ( isHollowIrregular(root) ) {
    return root[0] + rad1vowel + draftConjugation.slice(2);
}

if ( ( root[1] === ar_Y ) || ( root[1] === ar_U ) ){

    if (( enSubject === "he" ) || ( enSubject === "she" ) || ( enSubject === "they-m" ) ) {
        return draftConjugation.replace(root[1],ar_A);

    } else {
        //subject is i, we, you-m, you-f, vous-m, vous-f...they-f

        var rad1vowel = ar_u;
        if ( root[1] = ar_i ) { rad1vowel = ar_i;}

        return root[0] + rad1vowel + draftConjugation.slice(2);
    }

} // end hollow

////////////////
//defective past
if ( root[2] === ar_U ) {

    if ( ( enSubject === "she" ) || ( enSubject === "they-m" ) || ( enSubject === "they-f" ) ) {
            return draftConjugation.replace(ar_U,"");

    } else if ( enSubject === "he" ) {
        return draftConjugation.replace(ar_U,ar_A);

    } else {
        //subject is i, we, you-m, you-f, vous-m, vous-f
        return draftConjugation;
    }

} else if ( root[2] === ar_Y ) {

    //defective ** resume here
    // ( root[2] === ar_Y ) || ( /middlevowel/ === ar_a )
    // ( root[2] === ar_Y ) || ( /middlevowel/ === ar_i )
    // dot-less Y handling
}


//////////////
//doubled past

if ( ( root[root.length]= ar_2v ) || ( root[1] === root[2] )) {
//  ** needs work
}

////////////
//hamza past

if ( root.indexOf(ar_h5) > -1 ) {
//  ** needs work
}

/////////
//everything else, presumably regular verbs
return draftConjugation;

}


function presentIrregular(root, draftConjugation, enSubject) {
//takes a conjugated verb and applies irregular rules
//right now only works with enSubject-third person-single-male

var output = "";

if (enSubject === undefined) {
    enSubject = "he";
}

//////////////////////
//assimilative present

if ( root[0] === ar_A ) {

    if ( tense.toLowerCase().indexOf("present") > -1 ) {
        return draftConjugation.replace(ar_A,"");
    }

} // end assimilative

////////////////
//hollow present

if ( ( root[1] === ar_Y ) || ( root[1] === ar_U ) ){

    //present or imperative tense generally stay regular
    if ( isHollowIrregular(root) ) {

        if (( enSubject === "vous-f" ) || ( enSubject === "they-f" ) ) {
            return draftConjugation.replace(root[1],"");
        } else {
            return draftConjugation.replace(root[1],ar_A);
        }

    } else {
        return draftConjugation;
    }

} // end hollow

///////////////////
//defective present

if ( root[2] === ar_U ){

    if ( ( enSubject === "you-f" ) || ( enSubject === "they-m" ) || ( enSubject === "vous-m" ) ) {
            return draftConjugation.replace(ar_U,"");

    } else {
        //subject is i, we, you-m, vous-f, he, she, they-f
        return draftConjugation;
    }
}

//defective ** resume here
// ( root[2] === ar_Y ) || ( /middlevowel/ === ar_a )
// ( root[2] === ar_Y ) || ( /middlevowel/ === ar_i )
// dot-less Y handling


/////////////////
//doubled present

if ( ( root[root.length]= ar_2v ) || ( root[1] === root[2] )) {
//  ** needs work
}

///////////////
//hamza present

if ( root.indexOf(ar_h5) > -1 ) {
//  ** needs work
}

/////////
//everything else, presumably regular verbs
return draftConjugation;

}


/*
function presentIrregular(root, draftConjugation, enSubject) {
//takes a conjugated verb and applies irregular rules
//right now only works with enSubject-third person-single-male

var output = "";

if (enSubject === undefined) {
    enSubject = "he";
}

//////////////
//assimilative

if ( root[0] === ar_A ) {
    if ( tense.toLowerCase().indexOf("present") > -1 ) {
        return draftConjugation.replace(ar_A,"");
    } else {
        return draftConjugation;
    }
} // end assimilative

/////////
//hollow

if ( ( root[1] === ar_Y ) || ( root[1] === ar_U ) ){

    if ( tense.toLowerCase().indexOf("past") > -1 ) {

        if (( enSubject === "he" ) || ( enSubject === "she" ) || ( enSubject === "they-m" ) ) {
            return draftConjugation.replace(root[1],ar_A);

        } else {
            //subject is i, we, you-m, you-f, vous-m, vous-f...they-f

            var rad1vowel = ar_u;
            if ( ( root[1] = ar_i ) || ( isHollowIrregular(root)) ) { rad1vowel = ar_i;}

            return root[0] + rad1vowel + draftConjugation.slice(2);
        }

    } else {
        //present or imperative tense generally stay regular

        if ( isHollowIrregular(root) ) {

            if (( enSubject === "vous-f" ) || ( enSubject === "they-f" ) ) {
                return draftConjugation.replace(root[1],"");
            } else {
                return draftConjugation.replace(root[1],ar_A);
            }

        } else {
            return draftConjugation;
        }

    }
} // end hollow

///////////
//defective

if (( root[2] === ar_U ) && ( tense.toLowerCase().indexOf("past") > -1 ) ){

    if ( ( enSubject === "she" ) || ( enSubject === "they-m" ) || ( enSubject === "they-f" ) ) {
            return draftConjugation.replace(ar_U,"");

    } else if ( enSubject === "he" ) {
        return draftConjugation.replace(ar_U,ar_A);
    } else {
        //subject is i, we, you-m, you-f, vous-m, vous-f
        return draftConjugation;
    }

}

if (( root[2] === ar_U ) && ( tense.toLowerCase().indexOf("present") > -1 ) ){

    if ( ( enSubject === "you-f" ) || ( enSubject === "they-m" ) || ( enSubject === "vous-m" ) ) {
            return draftConjugation.replace(ar_U,"");

    } else {
        //subject is i, we, you-m, vous-f, he, she, they-f
        return draftConjugation;
    }
}

//defective ** resume here
// ( root[2] === ar_Y ) || ( /middlevowel/ === ar_a )
// ( root[2] === ar_Y ) || ( /middlevowel/ === ar_i )
// dot-less Y handling


/////////
//doubled

if ( ( root[root.length]= ar_2v ) || ( root[1] === root[2] )) {
//  ** needs work
}

///////
//hamza

if ( root.indexOf(ar_h5) > -1 ) {
//  ** needs work
}

/////////
//everything else, presumably regular verbs
return draftConjugation;

}
*/

function isHollowIrregular(root){
//returns true if verb is very irregular

    var arrIrregulars = [];
        arrIrregulars.push (ar_n + ar_U + ar_m);

    arrIrregulars.forEach(function (currentValue, index) {
        if ( currentValue === root ) {
            return true;
        }
    });

    return false;
}

/*
irregular

case ii - hollow - root[1] = ى/و - past - check backend; weird looking roots with ar_A in root[1] are likely misinterpreted roots in this pattern
*/