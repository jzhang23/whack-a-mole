// ---------
// CONSTANTS
// ---------

const NUM_MOLES = 4
// Min and max time for mole to stay whackable
const WHACK_DELAY = {min: 500, max: 1500}
// Min and max time for mole to stay unwhackable
const HIDE_DELAY = {min: 2000, max: 4000}
// Length of a game in seconds
const GAME_LENGTH = 20

// ----------
// GAME STATE
// ----------

let gameRunning = false
let timeLeft = GAME_LENGTH
let highScore = 0
let score = 0
let missCount = 0
const moles = []
const moleTimeoutHandlers = []


// ----------------------------
// MOLE TIMER AND CLICK HANDLER
// ----------------------------

// Toggles the whackable class on a mole element after a random number of seconds
function toggleMoleWhackability(moleIndex){
  // Get a reference to the mole element
  const mole = moles[moleIndex]
  // Reset any ongoing timers for this mole
  clearTimeout(moleTimeoutHandlers[moleIndex])
  // Choose a random delay based on the bounds defined in WHACK_DELAY or HIDE_DELAY
  const delays =
    mole.className === 'mole' ? HIDE_DELAY : WHACK_DELAY
  const delay = delays.min + Math.floor(Math.random() * (delays.max - delays.min))

  // Run the following anonymous function after the delay
  moleTimeoutHandlers[moleIndex] = setTimeout(function(){
    // Anonymous function:
    // If mole has the "whackable" class, remove it. Otherwise, add the class
    const isWhackable = mole.className === 'whackable mole'
    mole.className = isWhackable ? 'mole' : 'whackable mole'
    // If the mole has reached the end of its whackable period, then it was missed
    if (isWhackable) incrementMissCount()
    /* As soon as the whackability has been toggled, rerun this function to
       wait another random number of seconds and toggle it again, creating an
       infinite asynchronous loop for each mole */
    toggleMoleWhackability(moleIndex)
  }, delay)
}

function onWhack($event){
  // Get a reference to the HTML element that was clicked and its index in moles
  const mole = $event.target
  const moleIndex = moles.indexOf(mole)
  // Don't do anything if the mole isn't whackable
  console.log("error");
  if (mole.className.indexOf('whackable')!==-1) {
    // Make mole unwhackable
    mole.className = 'mole'
    incrementScore()
    // Reset any existing timeout handler for the mole
    clearTimeout(moleTimeoutHandlers[moleIndex])
    toggleMoleWhackability(moleIndex)
  }
  console.log("error");
}


// -----------------------
// SCORE CONTROL FUNCTIONS
// -----------------------

function incrementScore(){
  document.getElementById('score').innerHTML = ++score
  // Update high score if  new record has been reached
  if (score > highScore) {
    document.getElementById('highScore').innerHTML = highScore = score
  }
}

function incrementMissCount(){
  document.getElementById('missCount').innerHTML = ++missCount
}

function resetScore(){
  document.getElementById('score').innerHTML = score = 0
  document.getElementById('missCount').innerHTML = missCount = 0
}


// ----------------------
// GAME CONTROL FUNCTIONS
// ----------------------

function stopGame(){
  // Set game state variable
  gameRunning = false
  // Clear all ongoing mole timers
  moleTimeoutHandlers.forEach(clearTimeout)
  // Make all moles unwhackable
  moles.forEach(function (mole) { mole.className = 'mole' })
  // Disable stop button but not start button
  document.getElementById('startGame').removeAttribute('disabled')
  document.getElementById('stopGame').setAttribute('disabled', true)
}



function startGame(){
  // Set game state variable
  gameRunning = true
  // Start timers for each mole
  for (let i = 0; i < moles.length; i++)
    toggleMoleWhackability(i)
  // Disable start button but not stop button
  document.getElementById('startGame').setAttribute('disabled', true)
  document.getElementById('stopGame').removeAttribute('disabled')
}

function resetGame (){
  // Stop game and reset score/time
  document.getElementById('timeleft').innerHTML = timeLeft = GAME_LENGTH
  stopGame()
  resetScore()
}


// ---------
// INIT CODE
// ---------

// Display initial time left and create mole elements
document.getElementById('timeleft').innerHTML = timeLeft
for (let i = 0; i < NUM_MOLES; i++) {
  // Create a new html element for the mole
  const newMole = document.createElement('div')
  newMole.className = 'mole'
  newMole.addEventListener('click', onWhack)
  document.body.appendChild(newMole)
  moles.push(newMole)
}

// Game tick loop
// Decrements number of seconds left until game over by one each second
setInterval(function(){
  if (gameRunning) {
    if (timeLeft > 0) {
      // Decrement seconds until game over
      document.getElementById('timeleft').innerHTML = --timeLeft
    } else {
      // Game is over, stop game
      stopGame()
      // Also grey out the start game button since time left is zero
      document.getElementById('startGame').setAttribute('disabled', true)
    }
  }
}, 1000)
