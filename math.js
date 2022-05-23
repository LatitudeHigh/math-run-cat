//The goal of this code is to ask the user to do a math problem everytime they hit an object. If they get the answer correct they can continue with their current progress, if they get it wrong the game restarts. We also need to make it so that the code counts the number of crashes and the number of times you crash adds up to the number of math problems they have to solve. 

var crashCount = 0;

/* Asks a random division problem as a prompt on the screen.
 * Returns true if they got the answer correct or false if wrong.
 */
function division(){
  //Varrable one represents the two digit number 
  //Varrable two represents the 1 digit number
  var one = Randomizer.nextInt(1, 10);
  var two = Randomizer.nextInt(1, 10);
  //The varrable solution gives a value for the multiplication problem 
  var solution = one*two;
  var response = parseInt(
    prompt("What is " + one + " x " + two + "?")
  );
  return solution == response;
}

