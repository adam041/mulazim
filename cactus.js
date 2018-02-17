/*
Work list

- styling

-core logic
    -add all tab with nouns+verbs?
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

    var htmlTableRows = "";

    var arrNouns = [
        "NounTimePlace",
        "PassiveParticiple",
        "ActiveParticiple",
        "Masdar"
    ];

    var arrVerbs = [
        "PassivePresent",
        "PassivePast",
        "Imperative",
        "ActivePresent",
        "ActivePast"
    ];

    arrNouns.forEach(function(element) {
        htmlTableRows = "";
        for (var i = 1; i <= 10; ++ i) {
            htmlTableRows += "<tr> <td> " + arRoot.noun(element, i) + " </td> </tr> ";
            }
        jQuery("#rows"+element).html( htmlTableRows );
    });

    arrVerbs.forEach(function(element) {
        htmlTableRows = "";
        for (var i = 1; i <= 10; ++ i) {
            htmlTableRows += "<tr> <td> " + arRoot.verb(element, i) + " </td> </tr> ";
            }
        jQuery("#rows"+element).html( htmlTableRows );
    });
};


$( function() {
    $( "#menuOfRoots" ).menu();
    $( "#tabsC" ).tabs();
} );


arRoot = {
//** is there a better way to declare object?
};