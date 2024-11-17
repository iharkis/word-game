// Check for existing word sets in localStorage or initialise an empty object
let wordSets = JSON.parse(localStorage.getItem("wordSets")) || {};
let currentEditSet = null; // Track the set being edited

// Display existing word sets on page load
displayWordSets();

// Handle the form submission to add new word sets manually
document.getElementById("wordSetForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const setName = document.getElementById("setName").value.trim().toLowerCase();
    const words = document.getElementById("words").value.trim().toLowerCase().split(/\s*,\s*/);

    // Add the new word set to the object and save it in localStorage
    wordSets[setName] = words;
    localStorage.setItem("wordSets", JSON.stringify(wordSets));

    // Clear the form fields and update the display
    document.getElementById("setName").value = "";
    document.getElementById("words").value = "";
    displayWordSets();
});

// Function to display the word sets on the page with edit and delete options
function displayWordSets() {
    // Reload wordSets from localStorage to ensure it’s up-to-date
    wordSets = JSON.parse(localStorage.getItem("wordSets")) || {};

    const wordSetList = document.getElementById("wordSetList");
    wordSetList.innerHTML = ""; // Clear the current list

    for (let setName in wordSets) {
        const listItem = document.createElement("li");
        listItem.innerText = `${setName}: ${wordSets[setName].join(", ")}`;

        // Add edit and delete buttons for each word set
        const editButton = document.createElement("button");
        editButton.innerText = "Edit";
        editButton.onclick = () => editWordSet(setName);

        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.onclick = () => deleteWordSet(setName);

        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);
        wordSetList.appendChild(listItem);
    }
}

// Function to delete a word set
function deleteWordSet(setName) {
    if (confirm(`Are you sure you want to delete the word set "${setName}"?`)) {
        delete wordSets[setName];
        localStorage.setItem("wordSets", JSON.stringify(wordSets));
        displayWordSets();
    }
}

// Function to edit a word set
function editWordSet(setName) {
    currentEditSet = setName;
    document.getElementById("editWords").value = wordSets[setName].join(", ");
    document.getElementById("editFormContainer").style.display = "block";
}

// Function to handle saving changes to a word set
document.getElementById("editWordSetForm").addEventListener("submit", function(event) {
    event.preventDefault();
    if (currentEditSet) {
        const newWords = document.getElementById("editWords").value.trim().toLowerCase().split(/\s*,\s*/);
        wordSets[currentEditSet] = newWords;
        localStorage.setItem("wordSets", JSON.stringify(wordSets));
        displayWordSets();
        cancelEdit();
    }
});

// Function to cancel the edit
function cancelEdit() {
    currentEditSet = null;
    document.getElementById("editFormContainer").style.display = "none";
}

// Function to handle CSV upload and parsing
function uploadCSV() {
    const fileInput = document.getElementById("csvFileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a CSV file to upload.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const csvData = event.target.result;
        try {
            parseCSV(csvData);
            displayWordSets(); // Update display immediately
            fileInput.value = ""; // Clear file input after successful upload
            alert("Word sets uploaded successfully!");
        } catch (error) {
            console.error("Error parsing CSV data:", error);
            alert("There was an error processing the CSV file. Please check the format.");
        }
    };
    reader.onerror = function() {
        console.error("File could not be read:", reader.error);
        alert("Failed to read the file.");
    };
    reader.readAsText(file);
}

// Function to parse CSV data and add it to wordSets
function parseCSV(data) {
    const lines = data.trim().split("\n");

    lines.forEach(line => {
        const [setName, words] = line.split(",");
        if (!setName || !words) {
            console.warn(`Skipping invalid line: ${line}`);
            return;
        }
        
        const wordsArray = words.trim().split(/\s+/);
        wordSets[setName.trim().toLowerCase()] = wordsArray;
    });

    // Save updated word sets to localStorage
    localStorage.setItem("wordSets", JSON.stringify(wordSets));
}
