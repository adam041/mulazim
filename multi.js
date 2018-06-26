function readyPlayer2() {
//functions to enable multicactus.html (or whatever becomes of 2nd page)

    $( function() {
        $( "#accordion" ).accordion();
        //for multicactus.html, not needed for cactus.html
    } );

    $( "#kickIt" ).button();
    $( "#kickIt" ).click( function( event ) {
        kicker(ar_Do); //* pull from select *
        console.log("kick it");
    } );
}


function kicker(arRoot) {
//draw root/form appropriate tables within accordion divs

//loop through forms
    var fTable = "";

    for (var formNum = 1; formNum <= 10; formNum++) {

        //copy templates to drafts
        fTable = $( "#fTableTemplate" ).html();
        $( "#fTableDraft" ).html( fTable );

        //insert completed subTables, active
    //     subTable = sTable(arRoot, "subjunctive", true, formNum);
        $( "#fTableDraft .subjunctiveActive" ).html( $( "#subTableTemplate" ).html() );

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
    //     subTable = sTable(arRoot, "subjunctive", false, formNum);
        $( "#fTableDraft .subjunctivePassive" ).html(  $( "#subTableTemplate" ).html() );

        subTable = sTable(arRoot, "perfect", false, formNum);
        $( "#fTableDraft .perfectPassive" ).html( subTable );

        subTable = sTable(arRoot, "jussive", false, formNum);
        $( "#fTableDraft .jussivePassive" ).html( subTable );

        subTable = sTable(arRoot, "imperfect", false, formNum);
        $( "#fTableDraft .imperfectPassive" ).html( subTable );


        //write draft fTableDraft to DOM
        fTable = $( "#fTableDraft" ).html();
        $( "#accordion .accFormDiv").eq(formNum - 1).html(fTable);

    //loop to next form
    }
}


function sTable(arRoot, enTense, isActive, formNum) {
//returns a fully drafted sub-table for the given parameters

//prep draft table
    var subTable = $( "#subTableTemplate" ).html();
    $( "#subTableDraft" ).html( subTable );

//loop through all possible subjects
    var arrSubjects = ["theyM","dualM","he","theyF","dualF","she","vousM","dualYou","youM","vousF","dualYou","youF","we","i"];
//         arrSubjects = ["theyM"];
    var cnjdVerb = "";

    arrSubjects.forEach( function(value, index){
        cnjdVerb = whole( cnjVerb( arRoot, enTense, isActive, eval("pro_" + value) )[formNum] );
        $( "#subTableDraft ." + value ).html(cnjdVerb);
    });


//return draft
subTable = $( "#subTableDraft" ).html();
return subTable;
}