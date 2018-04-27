//Verb Conjugation Scripts

function cnjVerb( arRoot, enTense, isActive,  arSubject ){
//master function for verb conjugation

var drafts = [],
    draft = [];

var word = new Word(arRoot, enTense, isActive, arSubject);

//get base conj, for all 10 forms
    draft = base10(word, cnjForm);
    drafts.push(draft);

//get regular verb conj, for all 10 forms
    draft = draft.x10(cnjRegularVerb, false);
    drafts.push(draft);

//adjust conj if irregular, for all 10 forms
    draft = draft.x10(cnjIrregularVerb, true);
    drafts.push(draft);


//apply QA routines
    draft = draft.x10(qaVerb);
    drafts.push(draft);

console.log(drafts);
return drafts.last();

}


function cnjRegularVerb( wordIn ) {
//routing function for verb conjugations

var word = clone(wordIn);
    word.layer = "preliminary regular";

if ( word.enTense === "perfect" ) {
    return cnjPerfect( word );

} else if ( word.enTense === "imperfect" ) {
    return cnjImperfect( word );

} else if ( word.enTense === "jussive" ) {
    return cnjJussive( word );

} else if ( word.enTense === "imperative" ) {
    var jussiveWord = cnjJussive( word );
    return cnjImperative(jussiveWord);
}

// handle irregulars in separate function, in order
// to compare & debug differences in processing
}


function cnjIrregularVerb( wordIn ) {
//switchboard function to call irregular modifications

var word = clone(wordIn),
    footNote = "";

    if ( word.rad1[0].indexOf("-") > -1 ) {
        //early exit if verb form was intentionally left blank
        return word;
    }

    word.layer = "irregular";

    switch (word.type) {

        case "regular":
            //no op
            break;

        case "assimilative":
            word = cnjAssimilativeVerb(word);
            break;

        case "hollow":
            word = cnjHollowVerb(word);
            break;

        case "hollow2":
            word = cnjUltraHollowVerb(word);
            break;

        case "defective":
            word = cnjDefectiveVerb(word);
            break;

        case "doubled":
            word = cnjDoubledVerb(word);
            break;
    }

    if (word.type !== "regular") {
        footNote = "Irregular " + word.type + " conjugation applied to " + ar_LM + word.arRoot
    }

    $("#divFooter").html( footNote );

return word;

} // end irregularizer


function cnjForm( wordIn, formNum ){
//takes a word object and a form number, and adds appropriate characters (i.e. blue on trilateral chart), then returns a new word object

    var word = clone(wordIn);

    word.layer = "base form";
    word.formNum = formNum;

    switch (formNum) {

        case 1: break;

        case 5:
            word.innerPrefix.push( [ar_t, ar_a] );
        case 2:
            word.rad2.vowel(ar_2v ); //need to fill in the final vowel later
            break;

        case 6:
            word.innerPrefix.push( [ar_t, ar_a] );
        case 3:
            word.rad1.vowel(ar_a);
            word.midRight.push( [ar_A, ""] );
            break;

        case 4:
            word.innerPrefix.push( [ar_hA, ar_a] );
            word.rad1.vowel(ar_0 );  //* for all EXCEPT imperative
            break;

        case 7:
            word.innerPrefix.push( [ar_A, ar_i] );
            word.innerPrefix.push( [ar_n, ar_0] );
            break;

        case 8:
            word.innerPrefix.push( [ar_A, ar_i] );
            word.rad1.vowel(ar_0 ); //vowel?
            word.midRight.push( [ar_t, ar_a] );
            break;

        case 9:
            word.innerPrefix.push( [ar_A, ar_i] ); //* for all EXCEPT imperfect verb or agent noun
            break;

        case 10:
            word.innerPrefix.push( [ar_A, ar_i] );
            word.innerPrefix.push( [ar_s, ar_0] );
            word.innerPrefix.push( [ar_t, ar_a] );
            word.rad1.vowel(ar_0 ); //vowel?
            break;
    }

    return word;
}


function cnjPerfect( wordIn ) {
//returns conjugated trilateral verb in Perfect (past) tense

var word = clone( wordIn );

//set prefix and suffix
    setPrefixSuffix(word);

if ( word.isActive ) {

    switch (word.formNum) {

        case 1:
            word.rad1.vowel(ar_a);
            var rad2vowel = vowelMe(objRefs.query(word.arRoot, word.formNum, "PerfectRad2Vowel"));
            word.rad2.vowel(rad2vowel);
            break;

        case 2:
        case 5:
            word.rad1.vowel(ar_a);
            word.rad2.vowel(ar_2v + ar_a);
            break;

        case 3:
        case 6:
            word.rad1.vowel(ar_a);
            word.rad2.vowel(ar_a);
            break;

        case 4:
            word.rad1.vowel(ar_0);
            word.rad2.vowel(ar_a);
            break;

        case 7:
            word.rad1.vowel(ar_a);
            word.rad2.vowel(ar_a);
            break;

        case 8:
            word.rad2.vowel(ar_a);
            break;

        case 9:
            word.rad1.vowel(ar_0);
            word.rad2.vowel(ar_a);
            word.rad3.vowel(ar_2v);
            break;

        case 10:
            word.rad1.vowel(ar_0);
            word.rad2.vowel(ar_a);
            break;

        }
    } else {
        switch (word.formNum) {

        case 1:
            word.rad1.vowel(ar_u);
            word.rad2.vowel(ar_u);
            break;

        case 5:
            word.innerPrefix.vowel(ar_u);
        case 2:
            word.rad1.vowel(ar_u);
            word.rad2.vowel(ar_2v + ar_i);
            break;

        case 6:
            word.innerPrefix.vowel(ar_u);
        case 3:
            word.rad1.vowel(ar_u);
            word.midRight.consonant(ar_U);
            word.rad2.vowel(ar_i);
            break;

        case 4:
            word.rad1.vowel(ar_0);
            word.rad2.vowel(ar_i);
            break;

        case 7:
            word = nonWord( word );
            break;

        case 8:
            word.innerPrefix.vowel(ar_u);
            word.midRight.vowel(ar_u);
            word.rad2.vowel(ar_i);
            break;

        case 9:
            word.innerPrefix.vowel(ar_u);
            word.rad1.vowel(ar_0);
            word.rad2.vowel(ar_a);
            word.rad3.vowel(ar_2v);
            break;

        case 10:
            word.innerPrefix.vowel(ar_u);
            word.innerPrefix.pop();
            word.innerPrefix.push([ar_t, ar_u]);

            word.rad1.vowel(ar_0);
            word.rad2.vowel(ar_i);
            break;

      }//end switch
}//end if (active / else passive)

    return word;
}


function cnjImperfect( wordIn ) {
//returns conjugated trilateral verb in imperfect (present) tense

var word = clone( wordIn );

//set prefix and suffix
    setPrefixSuffix(word);

//cut leading Alif if form 7-10
if (word.formNum >= 7) {
    word.innerPrefix.shift();
}

if ( word.isActive ) {

    switch (word.formNum) {

        case 1:
            word.rad1.vowel(ar_0);
            var rad2vowel = vowelMe(objRefs.query(word.arRoot, word.formNum, "ImperfectRad2Vowel"));
            word.rad2.vowel(rad2vowel);
            break;

        case 2:
            word.rad1.vowel(ar_a);
            word.rad2.vowel(ar_2v + ar_i);
            break;

        case 3:
            word.rad1.vowel(ar_a);
            word.rad2.vowel(ar_i);
            break;

        case 4:
            word.rad1.vowel(ar_0);  //* assumed
            word.rad2.vowel(ar_i);
            word.innerPrefix = [];
            break;

        case 5:
            word.rad1.vowel(ar_a);
            word.rad2.vowel(ar_2v + ar_a );
            break;

        case 6:
            word.rad1.vowel(ar_a);
            word.rad2.vowel(ar_a);
            break;

        case 7:
            word.rad1.vowel(ar_a);
            word.rad2.vowel(ar_i);
            break;

        case 8:
//          word.rad1.vowel(ar_0);
            word.rad2.vowel(ar_i);
            break;

        case 9:
            word.rad1.vowel(ar_0);
            word.rad2.vowel(ar_a);
            word.rad3.vowel(ar_2v);
            break;

        case 10:
            word.rad1.vowel(ar_0);
            word.rad2.vowel(ar_i);
            break;

        }
    } else {
        switch (word.formNum) {

        case 1:
            word.rad1.vowel(ar_0);
            word.rad2.vowel(ar_a);
            break;

        case 2:
        case 5:
            word.rad1.vowel(ar_a);
            word.rad2.vowel(ar_2v + ar_a);
            break;

        case 3:
        case 6:
            word.rad1.vowel(ar_a);
            word.rad2.vowel(ar_a);
            break;

        case 4:
            word.rad1.vowel(ar_0);  //* assumed
            word.rad2.vowel(ar_a);
            break;

        case 7:
            word = nonWord( word );
            break;

        case 8:
//             word.rad1.vowel(ar_0);
            word.rad2.vowel(ar_a);
            break;

        case 9:
            word.rad1.vowel(ar_0);
            word.rad2.vowel(ar_a);
            word.rad3.vowel(ar_2v);
            break;

        case 10:
            word.rad1.vowel(ar_0);
            word.rad2.vowel(ar_a);
            break;

      }//end switch
}//end if (active / else passive)

    return word;
}


function cnjJussive( wordIn ) {
//returns conjugated trilateral verb in jussive tense
//start with verb in imperfect/active tense, and then modify it

//begin with imperfect tense
var regWord = clone(wordIn);
    regWord.isActive = true;
    regWord.enTense = "imperfect";
    regWord = cnjImperfect( regWord );

var word = clone(regWord);
    regWord.enTense = "jussive";

//modify suffix
    if ( ( word.suffix[0][0] === "" ) && ( word.suffix[0][1] === ar_u ) ) {
        word.suffix.pop();
        word.suffix.push(["", ar_0]);
    }

    if ( (word.arSubject === pro_vousM) || (word.arSubject === pro_theyM ) ) {
        word.suffix.pop();
        word.suffix.push([ar_A, ""]);

    }  else if ( word.arSubject === pro_youF ) {
        word.suffix.pop();
    }

//process irregulars

    switch (word.type) {

        case "hollow":
        case "hollow2":
            if (!( word.arSubject === pro_youF ) && !( word.arSubject === pro_vousM )  && !( word.arSubject === pro_theyM ) ) {
                word.rad2 = [];
            }
            break;

        case "defective":
            word.rad3 = [];

            if  ( word.rad3.consonant()=== ar_U ) {
                word.rad3.push(["", ar_u]);
            } else {
                word.rad3.push(["", ar_i]);
            }
            break;

        case "doubled":
            word = cnjDoubledVerb(word);
            break;
    }

return word;
}


function cnjImperative(jussiveWord) {
//returns conjugated trilateral verb in imperative tense
//assumes input is word in jussive

var word = clone(jussiveWord);
    word.prefix = [];

if ( word.rad1.vowel() === ar_0 ) {

    switch ( word.rad2.vowel() ) {

        case ar_a:
        case ar_i:
            word.prefix.push([ ar_A, ar_i ]);
            break;

        case ar_u:
            word.prefix.push([ ar_A, ar_u ]);
            break;
    }

}

if (word.formNum === 7) {
    word.prefix.push([ ar_A, ar_i ]);
}

return word;
}


function setPrefixSuffix( word ) {
//conjugates prefix and suffix and writes them to corresponding word object properties

var prefix = "",
    suffix = "",
    prefixVowel = "";

    //Get vowel over prefix
    if ( word.isActive ) {

        switch (word.formNum) {

            case 2:
            case 3:
            case 4:
                prefixVowel = ar_u;
                break;

            case 1:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
                prefixVowel = ar_a;
                break;
        }

    } else {
        prefixVowel = ar_u;
    }

    //Get Present Prefix/Suffix
    if (( word.enTense === "imperfect" ) || ( word.enTense === "present" )) {
    switch ( word.arSubject ) {

        case pro_i:
            word.prefix.push([ar_hA, prefixVowel]);
            word.suffix.push(["", ar_u]);
            break;

        case pro_we:
            word.prefix.push([ar_n, prefixVowel]);
            word.suffix.push(["", ar_u]);
            break;

        case pro_youM:
            word.prefix.push([ar_t, prefixVowel]);
            word.suffix.push(["", ar_u]);
            break;

        case pro_youF:
            word.prefix.push([ar_t, prefixVowel]);
            word.suffix.push(["", ar_i]);
            word.suffix.push([ar_Y, ""]);
            word.suffix.push([ar_n, ar_a]);
            break;

        case pro_vousM:
            word.prefix.push([ar_t, prefixVowel]);
            word.suffix.push(["", ar_u]);
            word.suffix.push([ar_U, ""]);
            word.suffix.push([ar_n, ar_a]);
            break;

        case pro_vousF:
            word.prefix.push([ar_t, prefixVowel]);
            word.suffix.push(["", ar_0]);
            word.suffix.push([ar_n, ar_a]);
            break;

        case pro_he:
            word.prefix.push([ar_Y, prefixVowel]);
            word.suffix.push(["", ar_u]);
            break;

        case pro_she:
            word.prefix.push([ar_t, prefixVowel]);
            word.suffix.push(["", ar_u]);
            break;

        case pro_theyM:
            word.prefix.push([ar_Y, prefixVowel]);
            word.suffix.push(["", ar_u]);
            word.suffix.push([ar_U, ""]);
            word.suffix.push([ar_n, ""]);
            break;

        case pro_theyF:
            word.prefix.push([ar_Y, prefixVowel]);
//          word.suffix.push(["", ar_0]);
            word.suffix.push([ar_n, ar_a]);
            break;
    }//end switch (imperfect)

    } else if (( word.enTense === "perfect" ) ||  (word.enTense === "past" )) {
      switch ( word.arSubject ) {

        case pro_i:
            word.suffix.push(["", ar_0]);
            word.suffix.push([ar_t, ar_u]);
            break;

        case pro_we:
            word.suffix.push([ar_0, ""]);
            word.suffix.push([ar_n, ar_a]);
            word.suffix.push([ar_A, ""]);
            break;

        case pro_youM:
            word.suffix.push(["", ar_0]);
            word.suffix.push([ar_t, ar_a]);
            break;

        case pro_youF:
            word.suffix.push(["", ar_0]);
            word.suffix.push([ar_t, ar_i]);
            break;

        case pro_vousM:
            word.suffix.push(["", ar_0]);
            word.suffix.push([ar_t, ar_u]);
            word.suffix.push([ar_m, ""]);
            break;

        case pro_vousF:
            word.suffix.push(["", ar_0]);
            word.suffix.push([ar_t, ar_u]);
            word.suffix.push([ar_n, ar_2v + ar_a]);
            break;

        case pro_he:
            word.suffix.push(["", ar_a]);
            break;

        case pro_she:
            word.suffix.push(["", ar_a]);
            word.suffix.push([ar_t, ar_0]);
            break;

        case pro_theyM:
            word.suffix.push(["", ar_u]);
            word.suffix.push([ar_U, ""]);
            word.suffix.push([ar_A, ""]);
            break;

        case pro_theyF:
            word.suffix.push(["", ar_0]);
            word.suffix.push([ar_n, ar_a]);
            break;
    }//end switch (perfect)
    }

}


function cnjAssimilativeVerb(wordIn) {
// modifies stem in accordance with irregular verb rules
// assumes ( root[0] === ar_Y ) || ( root[0] === ar_U )

var word = clone(wordIn);

//bypass irregular processing for some forms
    switch ( word.formNum) {

        case 2:
        case 3:
        case 5:
        case 6:
        case 10:
            console.log("regular in this form, root matches assimilative pattern");
            return word;

        case 4:
            //(present) has long U to start  **
            break;

        case 8:
            //double ت  **
            break;

        default: //proceed
            //case 1
            //case 7?
            //case 9?
            break;
    }

//continue to process verb as irregular

    if ( word.enTense  === "perfect" ) {
            //do nothing

    } else if ( word.enTense  === "imperfect" ) {

        //drop rad1 if ar_u
        if ( word.rad1[0][0] === ar_U ) {
            word.rad1 = [];
        }

    }

return word;
}


function cnjHollowVerb(wordIn) {
// modifies stem in accordance with irregular verb rules
// assumes ( root[0] === ar_Y ) || ( root[0] === ar_U )

var word = clone(wordIn);

//bypass irregular processing for some forms
    switch ( word.formNum) {
        default:
        break;
    }

//continue to process verb as irregular

    if ( word.enTense  === "perfect" ) {

        if ( ( word.arSubject === pro_he ) || ( word.arSubject === pro_she ) || (word.arSubject === pro_theyM) ) {
            word.rad1.vowel(ar_a);
            word.rad2 = [[ar_A], [""]];

        } else {
            //subject is i, we, you-m, you-f, vous-m, vous-f...they-f

            if ( word.arRoot[1] === ar_U ) {
                word.rad1.vowel(ar_u);
            } else if ( word.arRoot[1] === ar_Y ) {
                word.rad1.vowel(ar_i);
            }

            word.rad2 = [];
        }

    } else if ( word.enTense  === "imperfect" ) {

        if ( ( word.arSubject === pro_vousF ) || ( word.arSubject === pro_theyF ) ) {
            word.rad2 = [];
            word.rad3.vowel(ar_0);
        }

        //ensure rad1 vowel compliments rad2 long vowel
        if ( word.arRoot[1] === ar_Y ) {
            word.rad1.vowel(ar_i);
        } else if ( word.arRoot[1] === ar_U ){
            word.rad1.vowel(ar_u);
        }

    }

return word;
}


function cnjUltraHollowVerb(wordIn) {
// modifies stem in accordance with irregular verb rules
// assumes verb is an especially irregular hollow verb, such as to sleep

    var word = clone(wordIn);

//     word.type = "hollow, especially irregular";

    if ( word.enTense  === "perfect" ) {
        //conj as if it is hollow, with ar_Y in the 2nd radical

        if ( ( word.arSubject === pro_he ) || ( word.arSubject === pro_she ) || (word.arSubject === pro_theyM) ) {
            word.rad1.vowel(ar_a);
            word.rad2 = [[ar_A], [""]];

        } else {
            //subject is i, we, you-m, you-f, vous-m, vous-f...they-f

            word.rad1.vowel(ar_i);
            word.rad2 = [];
        }

    } else if ( word.enTense  === "imperfect" ) {

        word = cnjHollowVerb(word);

    } else

return word;
}


function cnjDefectiveVerb(wordIn) {
// modifies stem in accordance with irregular verb rules
// assumes ( ( root[2] === ar_Y ) || ( root[2] === ar_U ) )

var word = clone(wordIn);

    if ( word.enTense  === "perfect" ) {

        if ( word.arSubject === pro_he ) {

            if ( word.rad3.consonant() === ar_U ) {
                word.rad3.consonant(ar_A);
                word.rad3.vowel("");

            } else if ( word.rad3.consonant() === ar_Y ) {
                word.rad3.consonant(ar_am);
                word.rad3.vowel("");
            }
        }

        if ( ( word.arSubject === pro_she ) || ( word.arSubject === pro_theyM ) ) {

            console.log("defective she/theyM");

            word.rad3 = [];

            if (word.suffix.consonant() === "") {
                word.suffix.shift();
            }
            word.suffix.vowel(ar_0);

        }

    } else if ( word.enTense  === "imperfect" ) {

        if ( ( word.arSubject === pro_youF ) || ( word.arSubject === pro_vousM ) || ( word.arSubject === pro_theyM ) ) {
            word.rad3 = [];
            word.rad2.vowel("");
        }

    }

return word;
}


function cnjDoubledVerb(wordIn) {
// modifies stem in accordance with irregular verb rules
// code works whether verb radical 2 and 3 are the same, OR rad3 is a shadda

    var word = clone(wordIn),
        nextChar = nextVowel(word, "rad3");

//     word.type = "doubled";

    if ( nextChar === ar_0 ) {
        word.rad3.consonant( word.rad2.consonant() );

    } else if ( isShortVowel(nextChar) )  {
        //move rad2 vowel to rad1, collapse rad3 into rad2 shadda
        word.rad1.vowel( word.rad2.vowel() );
        word.rad1.vowel( word.rad1.vowel().replace(ar_2v, "") ); //remove dupe shadda for form 2 & 5
        word.rad2.vowel( ar_2v );
        word.rad3 = [];
    } else {
        console.log("doubled nextVowel failed on " + debug(word) );
    }

return word;
}


function qaVerb( wordIn ) {
//performs post-processing and quality assurance on verb conjugations

var word = clone(wordIn);

    //make form 8 adjustments
    if ( word.formNum === 8 ) {

        if ( ( word.rad1.consonant() === ar_t ) ||
            ( word.rad1.consonant() === ar_U ) ||
            ( hasHamza(word.rad1.consonant() ) ) ) {
                word.midRight.vowel( ar_2v + word.midRight.vowel() );

        } else if ( ( word.rad1.consonant() === ar_z ) ||
            ( word.rad1.consonant() === ar_dh ) ||
            ( word.rad1.consonant() === ar_d  ) ) {
                word.midRight = [];
                word.rad1.consonant( ar_d );
                word.rad1.vowel( ar_2v + word.rad1.vowel() );

        } else if ( ( word.rad1.consonant() === ar_Taa ) ||
            ( word.rad1.consonant() === ar_Zaa ) ) {
                word.midRight = [];
                word.rad1.consonant( ar_Taa );
                word.rad1.vowel( ar_2v + word.rad1.vowel() );

        } else if ( word.rad1.consonant() === ar_Daad ) {
                word.midRight.consonant( ar_Taa );
        }
    }

    //note: hamza carriers will get QA'd in whole() function

return word;

}


function isHollowIrregular(arRoot){
//returns true if verb is very irregular

var arrIrregulars = [];
    arrIrregulars.push (ar_n + ar_U + ar_m);    //to sleep

var isMatch = function(element) {
        return element === arRoot;
    };

return arrIrregulars.some(isMatch);

}


// function segment( word ) {
// //takes a string, and returns an object containing segments of Arabic word, organized around radicals
//
// var seg = {
//
//     prefix: word.prefix,
//     innerPrefix: "",
//
//     rad1: word.arRoot.charAt(0),
//     index1: -1,
//     rad1Vowel: "",
//
//     midRight: "",
//
//     rad2: word.arRoot.charAt(1),
//     index2: -1,
//     rad2Vowel: "",
//
//     midLeft: "",
//
//     rad3: word.arRoot.charAt(2),
//     index3: -1,
//     rad3Vowel: "",
//
//     innerSuffix: "",
//     suffix: word.suffix,
//
//     all: "",
//
//     meta: word,
// };
//
// //get radical positions
//     seg.index1 = word.stem.indexOf( seg.rad1 );
//     seg.index2 = word.stem.indexOf( seg.rad2 );
//     seg.index3 = word.stem.indexOf( seg.rad3 );
//
// if ( seg.index1 > 0 ) {
//     seg.innerPrefix = word.stem.slice(0, seg.index1 );
// } else {
//     seg.innerPrefix = "";
// }
//
// seg.midRight = word.stem.slice(seg.index1 + 1, seg.index2);
//
// //take vowels from midRight
// var i = 0;
// while ( isShortVowel( seg.midRight.charAt(i), true) ) {
//     seg.rad1Vowel += seg.midRight.charAt(i);
//     seg.midRight = seg.midRight.slice(1);
//     i++;
// }
//
// if ( seg.index3 === ar_2v ) {
//     seg.rad3 = seg.rad2;
// }
//
// seg.midLeft = word.stem.slice(seg.index2 + 1, seg.index3);
// //take vowels from midLeft
// i = 0;
// while ( isShortVowel( seg.midLeft.charAt(i), true) ) {
//     seg.rad2Vowel += seg.midLeft.charAt(i);
//     seg.midLeft = seg.midLeft.slice(1);
//     i++;
// }
//
// //create innerSuffix and take rad3 vowel away (or from Suffix)
// i = 0;
// if ( word.stem.length > seg.index3 ) {
//     seg.innerSuffix = word.stem.slice(seg.index3 + 1);
//     while ( isShortVowel( seg.innerSuffix.charAt(i), true) ) {
//         seg.rad3Vowel += seg.innerSuffix.charAt(i);
//         seg.innerSuffix = seg.innerSuffix.slice(1);
//         i++;
//     }
//
// } else {
//     seg.innerSuffix = "";
//     while ( isShortVowel( seg.suffix.charAt(i), true) ) {
//         seg.rad3Vowel += seg.suffix.charAt(i);
//         seg.suffix = seg.suffix.slice(1);
//         i++;
//     }
//
// }
//
// seg.all = seg.prefix + seg.innerPrefix + seg.rad1 + seg.rad1Vowel + seg.midRight + seg.rad2 + seg.rad2Vowel;
// seg.all += seg.midLeft + seg.rad3 + seg.rad3Vowel + seg.innerSuffix + seg.suffix;
//
// return seg;
// }


//////////////////////////////////
//Keep Everything ABOVE This Line


////////////////////
// OLD STUFF BELOW
////////////////////
/*

function conjImperative(arRoot, formNum) {
//returns conjugated trilateral verb in Imperative

//six possible outputs (gender & quantity), derived from jussive (implied task...)

    var vowelCode = "",
        alifVowel = "",
        rad2Vowel = "";

    switch (formNum) {

        case 1:
            vowelCode = objRefs.query(arRoot, formNum, "f1Imperative0R2"); //split(**)
            alifVowel = vowelMe(vowelCode);
            vowelCode = objRefs.query(arRoot, formNum, "f1Imperative0R2"); //split(**)
            rad2Vowel = vowelMe(vowelCode);
            return ar_hA + alifVowel + arRoot[0] + ar_0 + arRoot[1] + rad2Vowel + arRoot[2] + ar_0;

        case 2:
        case 3:
        case 7:
        case 8:
        case 10:
            return conjActivePast(arRoot, formNum).slice(0,-2) + ar_i + arRoot[2] + ar_0;

        case 4:
            return ar_hA + ar_a + arRoot[0] + ar_a + arRoot[1] + ar_i + arRoot[2] + ar_0;

        case 5:
        case 6:
        case 9:
            return conjActivePast(arRoot, formNum);

        default:
            return "Error";
      }
}
*/