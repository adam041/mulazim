/*
Work list

- styling
    - tHeadBlock class - Is it needed : Maybe?  Does it work? : No
    - jQuery ok for desktop safari, tabs don't display correctly on ios safari

-core logic
    -add all tab with nouns+verbs?
    -scripts for other columns verbs(3), nouns(3)
    -handling irregular verbs

-backend / data quality
    -get more verbs n=5 >>> n=50 >>> n=500
    -pull jQuery menu inputs (from google sheet?)
    -handling of prepositions related to verb forms
    -english translations (mouseover?)

-secondary features
    -within tense conjugation (i.e. for all subjects; add column on left)
    -translation by mouseover or appended column
*/


jQuery( document ).ready(function() {

// Load Menu Control from backend
// ** tbd


//Implement click controls for menu
    $( "#menuOfRoots li" ).click(function() {
        conjugateUpdate( $(this).text() );
    });

});


function conjugateUpdate( root ) {
//Updates data tables with conjugated verbs/nouns

    arRoot.root = root;

    document.title = "LtCactus Conjugates " + arRoot.root;
    jQuery("#activeRoot").html( arRoot.root );

//Nouns
    var htmlTableRows = "";

//Nouns
    //tbd

//Nouns
    //tbd

//Nouns - Masdar

    htmlTableRows = "";
    for (var i = 1; i <= 10; ++ i) {
        htmlTableRows += "<tr> <td> " + arRoot.noun("Masdar", i) + " </td> </tr> ";
        }
    jQuery("#rowsMasdar").html( htmlTableRows );

//PassivePresent
    //tbd

//PassivePast
    //tbd

//Imperative
    //tbd

//ActivePresent
    htmlTableRows = "";
    for (var i = 1; i <= 10; ++ i) {
        htmlTableRows += "<tr> <td> " + arRoot.verb("ActivePresent", i) + " </td> </tr> ";
        }
    jQuery("#rowsActivePresent").html( htmlTableRows );

//ActivePast
    htmlTableRows = "";
    for (var i = 1; i <= 10; ++ i) {
        htmlTableRows += "<tr> <td> " + arRoot.verb("ActivePast", i) + " </td> </tr> ";
        }
    jQuery("#rowsActivePast").html( htmlTableRows );

};


$( function() {
    $( "#menuOfRoots" ).menu();
    $( "#tabsC" ).tabs();
} );


arRoot = {
//** is there a better way to declare object?
};