// Hardcoded path to Excel file
let excelFilePath = '/';
let flashcards = [];
let currentIndex = 0;

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return decodeURIComponent(urlParams.get(param)); // Decodes the value
}

// Example usage
const file = getQueryParam('file');    
const subject = getQueryParam('subject'); 
const lesson = getQueryParam('lesson');
const grade = getQueryParam('grade');
excelFilePath = excelFilePath + file;

console.log('File:', file); 
console.log('Subject:', subject); 
console.log('Grade:', grade); 
console.log('Lesson:', lesson); 
console.log('Excel File Path::::::::::::', excelFilePath); 

// Function to fetch and read the Excel file
function readExcel(filePath) {
    fetch(filePath)
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]]; // Assuming first sheet
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            flashcards = jsonData.map(item => ({
                question: item.Question, // Adjust this according to your Excel column names
                answer: item.Answer      // Adjust this according to your Excel column names
            }));

            updateFlashcard();
            document.getElementById('total-questions').innerText = flashcards.length;
        })
        .catch(error => console.error("Error reading Excel file:", error));
}

// Function to update the flashcard
function updateFlashcard() {
    if (flashcards.length === 0) return;

    const question = flashcards[currentIndex].question;
    const answer = flashcards[currentIndex].answer;

    document.getElementById("flashcard-front").innerText = question;
    document.getElementById("flashcard-back").innerText = answer;
    document.getElementById("current-question").innerText = currentIndex + 1;

    document.getElementById("prev").disabled = currentIndex === 0;
    document.getElementById("next").disabled = currentIndex === flashcards.length - 1;

    document.getElementById("flashcard-inner").classList.remove("is-flipped");
}

// Toggle flashcard flip
function toggleFlashcard() {
    const cardInner = document.getElementById("flashcard-inner");
    cardInner.classList.toggle("is-flipped");
}

// Next card function
function nextCard() {
    if (currentIndex < flashcards.length - 1) {
        currentIndex++;
        updateFlashcard();
    }
}

// Previous card function
function prevCard() {
    if (currentIndex > 0) {
        currentIndex--;
        updateFlashcard();
    }
}

// Load the flashcards from the Excel file
readExcel(excelFilePath);
