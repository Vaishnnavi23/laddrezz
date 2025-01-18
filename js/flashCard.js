let excelFilePath = '';
let flashcards = [];
let currentIndex = 0;

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return decodeURIComponent(urlParams.get(param)); // Decodes the value
}


let file = getQueryParam('file');    
const subject = getQueryParam('subject'); 
const lesson = getQueryParam('lesson');
const grade = getQueryParam('grade');
//excelFilePath = excelFilePath + file;

console.log('File:', file +' Subject:', subject +' Grade:', grade + ' Lesson:', lesson); 
//console.log('Subject:', subject); 
//console.log('Grade:', grade); 
//console.log('Lesson:', lesson); 

const parts = file.split('|');// file will contain the question and answer file name + background image 


file = parts[0]; // The first part (before the pipe);
excelFilePath = excelFilePath + file;
console.log('Excel File Path:', excelFilePath); 
const defaultBgImage = "/images/educationbackground.jpg"
const bgImage = (parts[1] && parts[1].trim() !== "") ? parts[1] : defaultBgImage; 
console.log("Background Image: ", bgImage);
console.log("Default BG Image: ", defaultBgImage);
document.body.style.backgroundImage = `url('${bgImage}')`;

//Function to set the title , grade and lesson name dynamically
function setData() {
 if (title)  {
 document.getElementById('title').innerText = lesson;
}
if (grade) {
 document.getElementById('grade').innerText = `Grade: ${grade}`;
}
if (subject) {
document.getElementById('subject').innerText = `Subject: ${subject}`;
}
}

// Function to check if the image exists
function setBackgroundImage(imageUrl, fallbackImage) {
    const img = new Image();
    
    img.onload = () => {
        // If the image loads successfully, set it as the background
        document.body.style.backgroundImage = `url('${bgImage}')`;
    };
    
    img.onerror = () => {
        // If the image fails to load, set the fallback image as the background
        document.body.style.backgroundImage = `url('${defaultBgImage}')`;
    };
    
    // Attempt to load the image
    img.src = imageUrl;
}

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

setData();
readExcel(excelFilePath);
setBackgroundImage(bgImage, defaultBgImage);
