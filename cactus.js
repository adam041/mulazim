/*
Work list

- display active root & re-work table layout

- styling
    - three color scheme for rows (1 4 7 10, 2 5 8, 3 6 9
    - noun / verb / both jQuery tabs
    - row size cleanup
    - fewer borders
    - distinct header formats

-core logic
    -scripts for other columns verbs(3), nouns(3)
    -handling irregular verbs

-backend / data quality
    -get more verbs n=5 >>> n=50 >>> n=500
    -pull jQuery menu inputs (from google sheet?)
    -handling of prepositions related to verb forms

-secondary features
    -within tense conjugation (i.e. for all subjects; add column on left)
    -translation by mouseover or appended column
*/


jQuery( document ).ready(function() {

// Load Menu Control from backend
// ** tbd


//Implement click controls for menu
    $( "li" ).click(function() {
        conjugateUpdate( $(this).text() );
    });

});


function conjugateUpdate( root ) {
//Updates data tables with conjugated verbs/nouns

    arRoot.root = root;

    document.title = "LtCactus Conjugates " + arRoot.root;
    //*** update element giving user feedback as to which root was selected

    var htmlTableStart = "<table> <tbody> ",
        htmlTableRows = "",
        htmlTableEnd = "</tbody> </table>";

//Nouns
    //tbd

//Nouns
    //tbd

//Nouns
    //tbd

//Nouns - Masdar
    htmlTableRows = "";
    for (var i = 1; i <= 10; ++ i) {
        htmlTableRows += "<tr> <td> " + arRoot.noun("Masdar", i) + " </td> </tr> ";
        }
    jQuery("#colMasdar").html( htmlTableStart + htmlTableRows + htmlTableEnd );

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
    jQuery("#colActivePresent").html( htmlTableStart + htmlTableRows + htmlTableEnd );

//ActivePast
    htmlTableRows = "";
    for (var i = 1; i <= 10; ++ i) {
        htmlTableRows += "<tr> <td> " + arRoot.verb("ActivePast", i) + " </td> </tr> ";
        }
    jQuery("#colActivePast").html( htmlTableStart + htmlTableRows + htmlTableEnd );

};


$( function() {
    $( "#menuOfRoots" ).menu();
} );

arRoot = {
//** is there a better way to declare object?
    //root: strInput      //need to pull from programmatic input **
};