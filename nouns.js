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

function coerceWord(wordIn, rad1, midRight, rad2, midLeft, rad3 ) {
//returns a word object with segments replaced with specified values

    if (midRight === undefined) {
        midRight = "";
    }
    if (rad2 === undefined) {
        rad2 = "";
    }
    if (midLeft === undefined) {
        midLeft = "";
    }
    if (rad3 === undefined) {
        rad3 = "";
    }

    word = new Word(wordIn.arRoot, wordIn.enTense, wordIn.isActive, wordIn.arSubject);

    //wipe default radicals and replace with words from backend data
    word.rad1 = [];
    word.rad2 = [];
    word.rad3 = [];

    word.rad1.push(     [rad1, ""] );
    word.midRight.push( [midRight,""] );
    word.rad2.push(     [rad2, ""] );
    word.midLeft.push(  [midLeft,""] );
    word.rad3.push(     [rad3, ""] );

    return word;
}


function cnjMasdar( wordIn ) {
//returns conjugated trilateral noun as Verbal Noun (masdar)

var word = clone(wordIn);
    word.enTense = "masdar";
    word.suffix.push(["", ar_un]);

//get data from backend, if available
var masdar1 = clone(word),
    masdar2 = clone(word),
    masdar3 = clone(word),
    masdarData = objRefs.query(word.arRoot, word.formNum, "Masdar");
                //may be a fully conjugated word, single character code, or null

    if (masdarData.length > 1) {
        //Coerce string from masdarData to a word object, chunk words between hyphens
        //and insert word as a radical "character".  Then exit.

        var masdars = masdarData.split(" - ");

        switch (masdars.length) {

            case 1:
                word = coerceWord(word,  masdars[0]);
                break;
            case 2:
                word = coerceWord(word, masdars[0], " - ",  masdars[1] );
                break;
            case 3:
                word = coerceWord(word, masdars[0], " - ",  masdars[1], " - ",  masdars[2] );
                break;
        }
        //early exit with coerced word object
        return word;

    } else if (masdarData.length === 1) {
        console.log("Use masdar code");
    } else if (masdarData === "") {
        console.log("No masdar code, use default setting");
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
            } else {
                //show all common possibilities if no data found on backend
                word = coerceWord(word, whole(masdar1), " - ", whole(masdar2), " - ", whole(masdar3) );
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
            masdar2.innerSuffix.push([ar_tb, ""]);

            if ( masdarData === ar_Y ) {
                word = masdar1;
            } else if (masdarData === ar_tb) {
                word = masdar2;
            } else {
                //show all common possibilities if no data found on backend
                word = coerceWord(word, whole(masdar1), " - ", whole(masdar2) );
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
            masdar1.innerSuffix.push([ar_tb, ""]);

            masdar2.rad1.vowel(ar_i);
            masdar2.rad2.vowel(ar_a);
            masdar2.midLeft.push([ar_A, ""]);
            masdar2.innerSuffix.push([ar_tb, ""]);

            if ( masdarData === ar_m ) {
                word = masdar1;
            } else if (masdarData === ar_A) {
                word = masdar2;
             } else {
                //show all common possibilities if no data found on backend
                word = coerceWord(word, whole(masdar1), " - ", whole(masdar2) );
//                 word = new Word(word.arRoot, word.enTense, word.isActive, word.arSubject);
//                 word.rad1.push(whole(masdar1));
//                 word.midRight.push(["-", " "]);
//                 word.rad2.push(whole(masdar2));
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
            word.rad1.vowel(ar_a);
            word.rad2.vowel(ar_2v + ar_u);
            break;

        case 6:
            word.rad1.vowel(ar_a);
            word.rad2.vowel(ar_u);
            break;

        case 7:
            word.rad1.vowel(ar_i);
            word.rad2.vowel(ar_a);
            word.midLeft.push([ar_A, ""]);
            break;

        case 8:
            word.rad2.vowel(ar_a);
            word.midLeft.push([ar_A, ""]);
            break;

        case 9:
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