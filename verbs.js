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
    draft = draft.x10(cnjRegularVerb, true);
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

//get Regular conjugation
if ( word.enTense === "perfect" ) {
    return cnjPerfect( word );

} else if ( word.enTense === "imperfect" ) {
    return cnjImperfect( word );

} else if ( word.enTense === "jussive" ) {
    return cnjJussive( word );
    //what about imperative?
}

return word;

// handle irregulars in separate function, in order
// to compare & debug differences in processing
}


function cnjIrregularVerb( wordIn ) {
//switchboard function to call irregular modifications

var word = clone(wordIn);

    word.layer = "irregular";

    if ( ( word.arRoot[0] === ar_Y ) || ( word.arRoot[0] === ar_U ) ){
        word = cnjAssimilativeVerb( word );

    } else if ( isHollowIrregular(word.arRoot) ) {
        word = cnjUltraHollowVerb( word );

    } else if ( ( word.arRoot[1] === ar_Y ) || ( word.arRoot[1] === ar_U ) ){
        word = cnjHollowVerb( word );

    } else if ( ( word.arRoot[2] === ar_Y ) || ( word.arRoot[2] === ar_U ) ) {
        word = cnjDefectiveVerb( word );

    } if ( ( word.arRoot.indexOf(ar_2v) > -1) || ( word.arRoot[1] === word.arRoot[2] ) ) {
        word = cnjDoubledVerb(word);

    } else if ( hasHamza( word.arRoot ) ) {
        word = cnjHamzaVerb( word );

    } else {
        word.layer = "confirmed regular";
        word.verbType = "regular";
    }

    //inform user if verb is irregular
    if ( ( word.verbType === null ) || ( word.verbType === "regular" ) ){
//         $("tfoot tr td:nth-child(1) ").html( "&nbsp <br> &nbsp " );
        $("#divFooter").html( "&nbsp" );
    } else {
        $("#divFooter").html( "Irregular " + word.verbType + " conjugation applied to " + ar_LM + word.arRoot );
//        $("tfoot tr td:nth-child(1) ").html( "Irregular " + word.verbType + " conjugation applied to " + ar_LM + word.arRoot );
    }

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
            var rad2vowel = vowelMe(objRefs.query(word.arRoot, word.formNum, "f1ActivePastRad2"));
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
//returns conjugated trilateral verb in Perfect (past) tense

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
            var rad2vowel = vowelMe(objRefs.query(word.arRoot, word.formNum, "f1ActivePresentRad2"));
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

            default: prefixVowel = "؟";
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
    }//end switch (present)

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
            word.suffix.push([ar_t, ""]);
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
    }//end switch (past)
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
            word.verbType = "regular in this form, root matches assimilative pattern";
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

    word.verbType = "assimilative";

//continue to process verb as irregular

    if ( word.enTense  === "perfect" ) {
            //do nothing

    } else if ( word.enTense  === "imperfect" ) {

        //drop rad1 if ar_u
        if ( word.rad1[0][0] === ar_U ) {
            word.rad1 = [];
        }

    } else { /* what about jussive/imperative?*/ }

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

    word.verbType = "hollow";

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

    } else { /* what about jussive/imperative?*/ }

return word;

}


function cnjUltraHollowVerb(wordIn) {
// modifies stem in accordance with irregular verb rules
// assumes verb is an especially irregular hollow verb, such as to sleep

    var word = clone(wordIn);

    word.verbType = "hollow, especially irregular";

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

    } else { /* what about jussive/imperative?*/ }


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
            console.log(word);

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

    } else { /* what about jussive/imperative?*/ }

return word;
}


function dontGiveHimTheStick(matchChar) {
//returns true if matchChar looks like an alif, including hamza carriers

    var answer = false,
        watchList = [ String.fromCharCode(1649), String.fromCharCode(1650), String.fromCharCode(1651),
                    String.fromCharCode(1652), String.fromCharCode(1653), String.fromCharCode(1570),
                    String.fromCharCode(1571), String.fromCharCode(1572), String.fromCharCode(1573),
                    String.fromCharCode(1575) ];

    answer = watchList.some( function(value) {
        return matchChar === value;
    });

return answer;

}


function cnjHamzaVerb(wordIn){

var word = clone(wordIn);

word.verbType = "hamza in root";

    if ( dontGiveHimTheStick( word.rad1.consonant() )) {

//      console.log("hamza time " + word.enTense + "/" + word.isActive + ", form" + word.formNum);

        if ( dontGiveHimTheStick( word.prefix.consonant() ) ) {
            //subject = I & forms 1, 2, 3
            word.rad1 = [];
            word.rad1.push([ar_Am, ""]);
            word.prefix = [];
        }

        if ( ( dontGiveHimTheStick( word.innerPrefix.consonant() )  ) && ( word.innerPrefix.length === 1 ) ) {
            //forms 4, 7, 8, 9
            word.rad1 = [];
            word.rad1.push([ar_Am, ""]);
            word.innerPrefix = [];
        }

        if ( dontGiveHimTheStick( word.midRight.consonant() ) ) {
            //forms 3, 6
            word.rad1 = [];
            word.rad1.push([ar_Am, ""]);
            word.midRight.shift();
        }

    }

return word;
}


function cnjDoubledVerb(wordIn) {
// modifies stem in accordance with irregular verb rules
// code works whether verb radical 2 and 3 are the same, OR rad3 is a shadda

    var word = clone(wordIn);

    word.verbType = "doubled";

    function doubleSauce(word) {
        //move rad2 vowel to rad1, collapse rad3 into rad2 shadda
        word.rad1.vowel( word.rad2.vowel() );
        word.rad1.vowel( word.rad1.vowel().replace(ar_2v,"") ); //remove dupe shadda for form 2 & 5
        word.rad2.vowel( ar_2v );
        word.rad3 = [];
    }

    if ( word.enTense  === "perfect" ) {
    //most subjects get a letter for rad3

        if ( ( word.arSubject === pro_he ) || ( word.arSubject === pro_she ) || (word.arSubject === pro_theyM) ) {
            doubleSauce(word);
        } else {
            word.rad3.consonant( word.rad2.consonant() );
        }

    } else if ( word.enTense  === "imperfect" ) {
    //most subjects get a shadda for rad3

      if ( ( word.arSubject === pro_youF ) || ( word.arSubject === pro_theyF ) ) {
            word.rad3.consonant( word.rad2.consonant() );

        } else {
            doubleSauce(word);
        }

    } else { /* what about jussive/imperative?*/ }

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

return word;

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


function hasHamza(aString) {
//returns true if any character in the root contains a hamza

if ( aString === undefined) { aString = ""; }

var hasHamza = false;

if (
    ( -1 < aString.indexOf("ء") ) ||
    ( -1 < aString.indexOf("إ") ) ||
    ( -1 < aString.indexOf("أ") ) ||
    ( -1 < aString.indexOf("ئ") ) ||
    ( -1 < aString.indexOf("ؤ") ) ){
        hasHamza = true;
    }

return hasHamza;
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


//////////////////////////////////
//Keep Everything ABOVE This Line





////////////////////
// OLD STUFF BELOW
////////////////////





////////////////////
// OLD STUFF BELOW
////////////////////





////////////////////
// OLD STUFF BELOW
////////////////////


/*

function verbalize(arRoot, formNum, enTense, isActive, arSubject) {
//finds stem of a verb, and then adds prefixes and suffixes appropriate to tense and subject
//root and formNum are required parameters.  Active/Present/3rd person masculine single assumed if no param passed
// enTense parameter should be "present" or "past", english language string
// isActive is boolean
// arSubject parameter should be Arabic language string.  Omit short vowels except to distinguish singular forms of you

//console.log("Verbalize called with args: " + Object.entries(arguments) );

//ensure optional variables are not null
if ( enTense === undefined ) {
    enTense = "present";
}

if ( isActive === undefined ) {
    isActive = true;
}

if ( arSubject === undefined ) {
    arSubject = "هو";
}

//Declare string variables for internal use
var word = {
        arRoot: arRoot,
        formNum: parseInt(formNum),
        enTense: enTense,
        isActive: isActive,
        arSubject: arSubject,
        verbType: "regular",
        prefix: "",
        stem: "",
        suffix: "",
        whole: function() {
            return this.prefix + this.stem + this.suffix;
        },
    };

//Build object holding reference info needed to fill in details for forms 1-3
// var objRefs = makeReferenceObject();

//Get the stem

if ( enTense === "present" ) {

    if ( isActive ) {
        word.stem = conjActivePresent(arRoot, formNum);
    } else {
        word.stem = conjPassivePresent(arRoot, formNum);
    }

} else if ( enTense === "past" ) {

    if ( isActive ) {
        word.stem = conjActivePast(arRoot, formNum);
    } else {
        word.stem = conjPassivePast(arRoot, formNum);
    }

} else if ( enTense === "imperative" ) {
    word.stem = conjImperative(arRoot, formNum);
}

//Get Present Prefix/Suffix
word.prefix = getPrefixSuffix(enTense, isActive, arSubject, true, formNum);
word.suffix = getPrefixSuffix(enTense,isActive, arSubject, false, formNum);

//squelch prefix/suffix if stem intentionally left blank
    if ( word.stem === ar_ILB ) {
        word.prefix = "";
        word.suffix = "";
    }

///////////////////////////////////
//perform post-processing QA checks

//check if irregular
word = irregularizer( word );

var wholeWord = word.whole();

// if ( word.formNum === 10 ) {
//    console.log( segment(word) );
// }

//Catch double alifs and combine to alif w/ madda. Needed for hollow verbs in form 6.
    var re2Alif = new RegExp(/[\u{0622}|\u{0623}|\u{0625}|\u{0627}]{2}/ug);
    wholeWord = wholeWord.replace(re2Alif, ar_Am);

//make form 8 adjustments
if ( word.formNum === 8 ) {

    if (( word.arRoot.charAt(0) === ar_t ) || ( hasHamza( word.arRoot.charAt(0) ) )) {
        wholeWord = wholeWord.replace(ar_t, ar_t + ar_2v);
    }

    if ( word.arRoot.charAt(0) === ar_U ) {
        wholeWord = wholeWord.replace(ar_U, "");
        wholeWord = wholeWord.replace(ar_t, ar_t + ar_2v);
    }

    if ( word.arRoot.charAt(0) === ar_z ) {
        wholeWord = wholeWord.replace(ar_t, ar_d);
    }

    if (( word.arRoot.charAt(0) === ar_d ) || ( word.arRoot.charAt(0) === ar_dh )) {
        wholeWord = wholeWord.replace(ar_t, ar_d + ar_2v);
    }

    if ( word.arRoot.charAt(0) === ar_Daad ) {
        wholeWord = wholeWord.replace(ar_t, ar_Taa);
    }

    if (( word.arRoot.charAt(0) === ar_Taa ) || ( word.arRoot.charAt(0) === ar_Zaa )) {
        wholeWord = wholeWord.replace(ar_t, ar_Taa + ar_2v);
    }

}


//Chunk string to array
var arrChunky = [];
    arrChunky = chunk(wholeWord);
                //consonants sub array stored at position 0
                //vowels sub array stored at position 1

////    ////    Debuggery
var htmlDebug = chunkTable( arrChunky, "", word );
////    ////    Debuggery

//write out initial conjugations to debug review area
 $( "#stage1" ).append( htmlDebug );

//de-dupe vowels
arrChunky[1].forEach(function ( subArray, index ) {
    arrChunky[1][index] = Array.from(new Set( subArray ));
});

//write out post-processed conjugations to debug review area
    htmlDebug = chunkTable( arrChunky, "", word );
    $( "#stage2" ).append( htmlDebug );

//flag excess vowels  ** it would be nicer if formatting didn't include shadda in overload count, but this is close enough
    $( ".vowelCell2" ).css({ "background-color": "yellow" });
    $( ".vowelCell3" ).css({ "background-color": "orange" });
    $( ".vowelCell4" ).css({ "background-color": "red" });

//Reassemble array to string
    wholeWord = "";

    var consonant = "",
        vowel = "";

//reverse() removed **
    arrChunky[0].forEach(function ( value, index ) {

        consonant = value;

        if ( arrChunky[1][index].length > 0 ) {
            vowel = arrChunky[1][index].reduce(reducer);
        } else { vowel = ""; }

        wholeWord += consonant + vowel;
        consonant = vowel = "";
    });

return wholeWord;
}


function getPrefixSuffix(enTense, isActive, arSubject, blnPrefixNotSuffix, formNum) {

if ( blnPrefixNotSuffix === "undefined" ) {
    blnPrefixNotSuffix = true;
}

if ( isActive === "undefined" ) {
    isActive = true;
}

var prefix = "",
    suffix = "";

    //Get Present Prefix/Suffix
    if ( enTense === "present" ) {

        //Present Prefixes
        switch ( arSubject ) {

            case pro_i:
                prefix = ar_hA + prefixVowel(formNum, isActive);
                break;

            case pro_we:
                prefix = ar_n + prefixVowel(formNum, isActive);
                break;

            case pro_youM:
            case pro_youF:
            case pro_she:
            case pro_vousM:
            case pro_vousF:
                prefix = ar_t + prefixVowel(formNum, isActive);
                break;

            case pro_he:
            case pro_theyM:
            case pro_theyF:
                prefix = ar_Y + prefixVowel(formNum, isActive);
                break;
        }

        //Present Suffixes
        switch ( arSubject ) {

            case pro_youF:
                suffix = ar_i + ar_Y + ar_n + ar_a;
                break;

            case pro_theyM:
                suffix = ar_u + ar_U + ar_n;
                break;

            case pro_vousM:
                suffix = ar_u + ar_U + ar_n + ar_a;
                break;

            case pro_vousF:
            case pro_theyF:
                suffix = ar_0 + ar_n + ar_a;
                break;

            default:
                suffix = ar_u;
                break;
        }

    } else if ( enTense === "past" ) {
    //Get Past Suffix

        switch ( arSubject ) {

            case pro_i:
                suffix = ar_0 + ar_t + ar_u;
                break;

            case pro_we:
                suffix = ar_0 + ar_n + ar_a + ar_A;
                break;

            case pro_youM:
                suffix = ar_0 + ar_t + ar_a;
                break;

            case pro_youF:
                suffix = ar_0 + ar_t + ar_i;
                break;

            case pro_vousM:
                suffix = ar_0 + ar_t + ar_u + ar_m;
                break;

            case pro_vousF:
                suffix = ar_0 + ar_t + ar_u + ar_n + ar_2v + ar_a;
                break;

            case pro_he:
                suffix = ar_a;
                break;

            case pro_she:
                suffix = ar_a + ar_t;
                break;

            case pro_theyM:
                suffix = ar_u + ar_U + ar_A;
                break;

            case pro_theyF:
                suffix = ar_0 + ar_n + ar_a;
                break;
        }

    }

if ( blnPrefixNotSuffix ) {
    return prefix;
} else {
    return suffix;
}

}


function prefixVowel(formNum, isActive) {
//returns vowel accompanying prefix of present stem of verb

if ( isActive === undefined ) {
    isActive = true;
}

if ( isActive === true ) {
    switch (formNum) {

        case 2:
        case 3:
        case 4: return ar_u;

        case 1:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10: return ar_a;

        default: return "؟";
    }

} else {
    return ar_u;
}

}


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


function chunkTable( array, title, word ) {
//takes an array of Arabic where array[0] has all the consonants and array[1] has all the vowels
//and outputs a html table showing individual characters, split by consonant and vowel/diacritic rows

//optional param - title of table
if ( title === undefined ) { title = ""; }

    var vowel = "",
        frame = "",
        wholeWord = ""; //vowel(s)

    var table = "",
        trConsonants = "",
        trVowels = "",
        tdVowel = "";

    array[0].forEach(function ( consonant, index ) {

        if ( array[1][index].length > 0 ) {
            vowel = array[1][index].reduce(reducer);
            trVowels += array[1][index].reduce(rowReducer).wrap("<table>").wrap("<td style='vertical-align: bottom'>");
        } else {
            vowel = "";
            trVowels = "".wrap("<table>").wrap("<td>");
        }

        trConsonants += consonant.wrap("<td>");

        frame = consonant + vowel;
        wholeWord += frame;

    });

    trConsonants = trConsonants.wrap("<tr>");
    trVowels = trVowels.wrap("<tr>");

    var params = " ( f" + word.formNum + "-" + word.enTense + "-" + word.isActive + " ) ";

    table += ( ar_LM + wholeWord + ar_LM + params + title ).wrap("<th colspan='99'>").wrap("<tr>").wrap("<thead>");
    table += ( trVowels + trConsonants ).wrap("<tbody>");
    table = table.wrap("<table>");

return table;

}





function chunk( stringIn ) {
//takes a stringIn, returns a 2D array containing all chars
// array[consonant string][array of vowel(s)]

var arrConsonants = [],
    arrVowels = [],
    arrOut = [],
    vBuffer = [""]; //,
//     c = ""; //holds active character from stringIn

for (var i = 0, c = ""; i < stringIn.length; i++) {
    c = stringIn.charAt(i);

    if (( isShortVowel(c) ) || ( c === ar_2v )) {
        vBuffer.push(c);
    } else {

        arrConsonants.push(c);
        if ( i !== 0 ) {
            arrVowels.push(vBuffer);
            vBuffer = [""];
        }
    }
}

//push vowels one last time to maintain symmetry with consonants, and to account for trailing vowel characters
    arrVowels.push(vBuffer);

if ( arrConsonants.length !== arrVowels.length ) {
    console.log("!  Frame mismatch error in chunk(" + stringIn + ")");
}

arrOut.push(arrConsonants, arrVowels);

return arrOut;
}

function isShortVowel( charIn, shaddaToo ) {
//returns true if string is Arabic short vowel or sukkun
//     smaller sized vowels: 1560-1562 << true
//     regular sized short vowels and markings: 1611-1616 << true
//     shadda: 1617 << it depends
//     sukkun: 1618 << true

if ( charIn === undefined ) {
    console.log("Error, null passed to isShortVowel");
    return false;
}

if ( shaddaToo === undefined ) {
    shaddaToo = false;
}

var answer = false;

if  ( ( ( charIn.charCodeAt(0) >= 1560 ) && ( charIn.charCodeAt(0) <= 1562 ) ) ||
      ( ( charIn.charCodeAt(0) >= 1611 ) && ( charIn.charCodeAt(0) <= 1616 ) ) || ( charIn.charCodeAt(0) === 1618 )
    ) { answer = true; }

if (( shaddaToo ) && ( charIn.charCodeAt(0) === 1617 )) {
    answer = true;
}

return answer;
}

function prefixVowel(formNum, isActive) {
//returns vowel accompanying prefix of present stem of verb

    if ( isActive === undefined ) {
        isActive = true;
    }

    if ( isActive === true ) {
        switch (formNum) {

            case 2:
            case 3:
            case 4:
                return ar_u;

            case 1:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
                return ar_a;

            default:
                return "؟";
        }
    } else {
        return ar_u;
    }

}

*/

//stuff above here may become garbage
