// Sample word sets loaded from localStorage or hardcoded
const wordSets = JSON.parse(localStorage.getItem("wordSets")) || {};

// Ensure there's at least one word set to start with
const wordSetsArray = Object.entries(wordSets);
let currentSetIndex = 0;

// Variables for current set data
let currentSet = wordSetsArray[currentSetIndex][0];
let letters = currentSet.split("");
let correctWords = wordSetsArray[currentSetIndex][1];
let guessedWords = [];
let score = 0;
let foundCount = 0;
let currentWord = "";

// Initialise game display
function initGame() {
    // Display letters as clickable buttons
    displayLetters();

    // Set total words to find in the progress display
    document.getElementById("totalCount").innerText = correctWords.length;
    document.getElementById("score").innerText = score;
    document.getElementById("foundCount").innerText = foundCount;
}

// Display letters as clickable buttons
function displayLetters() {
    const lettersContainer = document.getElementById("letters");
    lettersContainer.innerHTML = ""; // Clear previous letters
    letters.forEach(letter => {
        const letterButton = document.createElement("button");
        letterButton.className = "letter-button";
        letterButton.innerText = letter;
        letterButton.onclick = () => addLetter(letter);
        lettersContainer.appendChild(letterButton);
    });
}

// Add selected letter to the current word being formed
function addLetter(letter) {
    currentWord += letter;
    document.getElementById("formedWord").innerText = currentWord;
}

// Clear the current word
function clearWord() {
    currentWord = "";
    document.getElementById("formedWord").innerText = "";
}

// Submit the current word as a guess
function submitGuess() {
    const feedback = document.getElementById("feedback");
    
    // Check if the word is correct and not already guessed
    if (correctWords.includes(currentWord) && !guessedWords.includes(currentWord)) {
        guessedWords.push(currentWord);
        score += 10;
        foundCount++;
        
        feedback.innerText = "🌟 Correct! 🌟";
        addCorrectWord(currentWord);
        updateProgress();
    } else {
        feedback.innerText = "❌ Try Again!";
    }
    
    // Clear the formed word
    currentWord = "";
    document.getElementById("formedWord").innerText = "";
}

// Add correct word to the discovered words list
function addCorrectWord(word) {
    const wordList = document.getElementById("wordList");
    const listItem = document.createElement("li");
    listItem.innerText = word;
    wordList.appendChild(listItem);
}

// Update progress display
function updateProgress() {
    document.getElementById("foundCount").innerText = foundCount;
    document.getElementById("score").innerText = score;
}

// Initialise game on load
window.onload = initGame;
