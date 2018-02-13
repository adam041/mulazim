/*
Work list
-insert jQuery menu to drive arRoot input
-breakout update scripts from .ready to own function

-pull jQuery menu inputs (from google sheet?)
-table styling & sizing cleanup
*/


jQuery( document ).ready(function() {

// Load Menu Control

//Implement click controls for menu
$( "#clickBait" ).click(function() {
      $( this ).html("yuo have been clicked");
    });

//////////////////////////////////////////////////
// Break Out Conjugation Update to Own Function **

    var strInput = "عمل";   //** eventually need to pull strInput from backend or 'menu' element
    arRoot.root = strInput;

    document.title = "LtCactus Conjugates " + strInput;
 //   jQuery("#rootTitle").html(strInput);

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

//////////////////////////////////////////////////

});


$( function() {
    $( "#menuOfRoots" ).menu();
} );

arRoot = {
//** is there a better way to declare object?
    //root: strInput      //need to pull from programmatic input **
};