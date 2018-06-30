function readyPlayer2() {
//functions to enable multicactus.html (or whatever becomes of 2nd page)


    $( function() {
        $( "#accordion" ).accordion({
        collapsible: true
        });
    })

//     $( function() {
//         $( "#draftTabs" ).tabs();
//     } );
//
//     $( "#kickIt" ).button();
//     $( "#kickIt" ).click( function( event ) {
//         kicker(ar_Do); //* pull from select *
//     } );

    $("#chosenRoot").chosen().change(function(){
        kicker( $("#chosenRoot").val() );
    });

    $("#chosenView").chosen().change(function(){
        changeView();
    });


    //conjugate default root on load, then close container
    kicker(ar_Do);
}


function changeView() {

    var view = $("#chosenView").val();

    //hide all by default
    $( ".jussiveActive").hide()
    $( ".subjunctiveActive").hide()
    $( ".jussivePassive").hide()
    $( ".subjunctivePassive").hide()

    switch (view) {

        case "portrait":
            $( ".jussiveActive:nth-child(even)").show();
            $( ".subjunctiveActive:nth-child(even)").show();
            $( ".jussivePassive:nth-child(even)").show();
            $( ".subjunctivePassive:nth-child(even)").show();
            break;

        case "landscape":
            $( ".jussiveActive:nth-child(odd)").show()
            $( ".subjunctiveActive:nth-child(odd)").show()
            $( ".jussivePassive:nth-child(odd)").show()
            $( ".subjunctivePassive:nth-child(odd)").show()
            break;

        case "square":  //do nothing, happens by default
    }
}

function kicker(arRoot) {
//draw root/form appropriate tables within accordion divs

//loop through forms
    var fTable = "",
        formLabelEn = "",
        formLabelAr = "",
        formNumAr = "٠",
        cnjStem = "";

    for (var formNum = 1; formNum <= 10; formNum++) {

        //copy templates to drafts
        fTable = $( "#fTableTemplate" ).html();
        $( "#fTableDraft" ).html( fTable );

        //insert completed subTables, active
        // subTable = sTable(arRoot, "subjunctive", true, formNum);
        $( "#fTableDraft .subjunctiveActive" ).html( $( "#subTableTemplate" ).html().wrap("<table>") );

        subTable = sTable(arRoot, "perfect", true, formNum);
        $( "#fTableDraft .perfectActive" ).html( subTable );

        subTable = sTable(arRoot, "jussive", true, formNum);
        $( "#fTableDraft .jussiveActive" ).html( subTable );

        subTable = sTable(arRoot, "imperfect", true, formNum);
        $( "#fTableDraft .imperfectActive" ).html( subTable );

        //insert completed subTables, other
            //* imperative
            //* noun/adjective
            //* subjunctive active / passive

        //insert completed subTables, passive
        // subTable = sTable(arRoot, "subjunctive", false, formNum);
        $( "#fTableDraft .subjunctivePassive" ).html(  $( "#subTableTemplate" ).html().wrap("<table>") );

        subTable = sTable(arRoot, "perfect", false, formNum);
        $( "#fTableDraft .perfectPassive" ).html( subTable );

        subTable = sTable(arRoot, "jussive", false, formNum);
        $( "#fTableDraft .jussivePassive" ).html( subTable );

        subTable = sTable(arRoot, "imperfect", false, formNum);
        $( "#fTableDraft .imperfectPassive" ).html( subTable );


        //write draft fTableDraft to DOM
        fTable = $( "#fTableDraft" ).html().wrap("<table>");
        $( "#accordion .accFormDiv").eq(formNum - 1).html(fTable);

        formLabelEn = objRefs.query(arRoot, formNum, "Translation");

        if ( formLabelEn !== "" ) {
            formLabelEn = "(" + formLabelEn + ")";
        } else {
            formLabelEn = "(notational)";
        }

        if (formNum < 10) {
            formNumAr = String.fromCharCode(formNum + 1776);
        } else {
            formNumAr = "١٠";
        }

        cnjStem = whole(cnjVerb1( arRoot, "perfect", true,  pro_he, formNum ));

        formLabelAr = ar_LM + cnjStem + " <<< وزن " + formNumAr + " " + arRoot + ar_LM;

        $( "#accordion .accFormSpan").eq(formNum - 1).html(formLabelEn + " >>> " + formLabelAr);


    //loop to next form
    }

    $( "#accordion .accFormSpan").eq(formNum - 1).html(formLabelEn + " >>> " + formLabelAr);

    // show/hide jussive & subjunctive subTables, as appropriate to view
    $( ".jussiveActive:nth-child(even)").hide()
    $( ".subjunctiveActive:nth-child(even)").hide()

    $( ".jussiveActive:nth-child(odd)").hide()
    $( ".subjunctiveActive:nth-child(odd)").hide()

    $( ".jussivePassive:nth-child(even)").hide()
    $( ".subjunctivePassive:nth-child(even)").hide()

    $( ".jussivePassive:nth-child(odd)").hide()
    $( ".subjunctivePassive:nth-child(odd)").hide()
}


function sTable(arRoot, enTense, isActive, formNum) {
//returns a fully drafted sub-table for the given parameters

//prep draft table
    var subTable = $( "#subTableTemplate" ).html();
    $( "#subTableDraft" ).html( subTable );

//loop through all possible subjects
    var arrSubjects = ["theyM","dualM","he","theyF","dualF","she",
                       "vousM","dualYou","youM","vousF","dualYou","youF",
                       "we","i"];
    var cnjdVerb = "",
        camelTense = enTense;

        if (enTense.length > 2) {
            camelTense = enTense.charAt(0).toUpperCase() + enTense.slice(1);
        }

    $("#subTableDraft .subTableTense").html(camelTense);

    arrSubjects.forEach( function(value, index){
//         cnjdVerb = whole( cnjVerb( arRoot, enTense, isActive, eval("pro_" + value) )[formNum] );
        cnjdVerb = whole(cnjVerb1( arRoot, enTense, isActive,  eval("pro_" + value), formNum ) );
        $( "#subTableDraft ." + value ).html(cnjdVerb);
    });


//return draft
subTable = $( "#subTableDraft" ).html();
return subTable.wrap("<table class='subTable'>");
}


function cnjVerb1( arRoot, enTense, isActive,  arSubject, formNum ){
//master function for verb conjugation

var drafts = [],
    draft = [];

var word = new Word(arRoot, enTense, isActive, arSubject);

//get base conj, for all 10 forms
    draft = cnjForm( word, formNum );
    drafts.push(draft);

//get regular verb conj, for all 10 forms
    draft = cnjRegularVerb(draft);
    drafts.push(draft);

//adjust conj if irregular, for all 10 forms
    draft = cnjIrregularVerb(draft);
    drafts.push(draft);


//apply QA routines
    draft = qaVerb(draft);
    drafts.push(draft);

console.log(drafts);
return drafts.last();

}