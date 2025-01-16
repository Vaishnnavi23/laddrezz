let gradeData = {};

function loadGradesAndSubjects() {
  const filePath = './MasterFile.xlsx'; // Path to your Excel file
  const gradesDropdown = document.getElementById('gradesDropdown');
  const subjectsContainer = document.getElementById('subjectsContainer');
  const contentsContainer = document.getElementById('contentsContainer');

  // Fetch the Excel file
  fetch(filePath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.arrayBuffer();
    })
    .then(data => {
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Process data to group lessons and contents by grade and subject
      jsonData.forEach(row => {
        const grade = row['Grade'];
        const subject = row['Subjects'];
        const lesson = row['Lesson'];
        const quiz = row['Quiz'] || '';
        const worksheet = row['Worksheet'] || '';
        const flashcard = row['Flashcard'] || '';

        if (!gradeData[grade]) {
          gradeData[grade] = {};
        }

        if (!gradeData[grade][subject]) {
          gradeData[grade][subject] = {};
        }

        gradeData[grade][subject][lesson] = { quiz, worksheet, flashcard };
      });

      // Populate the grades dropdown
      const grades = Object.keys(gradeData);
      gradesDropdown.innerHTML = '<option value="">Select a Grade</option>';
      grades.forEach(grade => {
        const option = document.createElement('option');
        option.value = grade;
        option.textContent = `Grade ${grade}`;
        gradesDropdown.appendChild(option);
      });

      gradesDropdown.addEventListener('change', () => {
        const selectedGrade = gradesDropdown.value;
        subjectsContainer.innerHTML = ''; // Clear previous subjects
        contentsContainer.innerHTML = ''; // Clear previous contents
        if (lessonsContainer) {
            lessonsContainer.innerHTML = ''; // Clear previous lessons
          }

        if (selectedGrade && gradeData[selectedGrade]) {
          const subjects = Object.keys(gradeData[selectedGrade]);
          subjects.forEach(subject => {
            const button = document.createElement('button');
            button.textContent = subject;
            button.onclick = () => displayLessons(subject, selectedGrade);
            subjectsContainer.appendChild(button);
          });
        }
      });
    })
    .catch(error => {
      console.error('Error reading Excel file:', error);
    });
}

// Function to display lessons for a subject as buttons
function displayLessons(subject, grade) {
  const contentsContainer = document.getElementById('contentsContainer');
  contentsContainer.innerHTML = ''; // Clear previous contents
  const lessonsContainer = document.getElementById('lessonsContainer') || document.createElement('div');

  if (!lessonsContainer.id) {
    lessonsContainer.id = 'lessonsContainer';
    lessonsContainer.classList.add('lessons-container');
    contentsContainer.parentNode.insertBefore(lessonsContainer, contentsContainer);
  }

  lessonsContainer.innerHTML = ''; // Clear previous lessons

  if (gradeData[grade][subject]) {
    const lessons = Object.keys(gradeData[grade][subject]);
    lessons.forEach(lesson => {
      const button = document.createElement('button');
      button.textContent = lesson;
      button.onclick = () => displayContents(subject, grade, lesson);
      lessonsContainer.appendChild(button);
    });
  }
}

// Function to display available contents (Quiz, Worksheet, Flashcard) for a lesson
function displayContents(subject, grade, lesson) {
  const contentsContainer = document.getElementById('contentsContainer');
  contentsContainer.innerHTML = ''; // Clear previous contents

  if (gradeData[grade][subject][lesson]) {
    const { quiz, worksheet, flashcard } = gradeData[grade][subject][lesson];

    if (quiz) {
      const quizButton = document.createElement('button');
      quizButton.textContent = 'Quiz';
      quizButton.onclick = () => window.open(quiz, '_blank'); // Open the quiz link in a new tab
      contentsContainer.appendChild(quizButton);
    }

    if (worksheet) {
      const worksheetButton = document.createElement('button');
      worksheetButton.textContent = 'Worksheet';
      worksheetButton.onclick = () => window.open(worksheet, '_blank'); // Open the worksheet PDF in a new tab
      contentsContainer.appendChild(worksheetButton);
    }

    if (flashcard) {
      const flashcardButton = document.createElement('button');
      flashcardButton.textContent = 'Flashcard';
      contentsContainer.appendChild(flashcardButton);
    }
  }
}


// Load the data on page load
document.addEventListener('DOMContentLoaded', loadGradesAndSubjects);
