// Fetch and process the Excel file
let gradeData = {}; 

function loadGradesAndSubjects() {
  const filePath = './MasterFile.xlsx'; // Path to your Excel file
  const gradesDropdown = document.getElementById('gradesDropdown');
  const subjectsContainer = document.getElementById('subjectsContainer'); // Div to display subjects
  const lessonsDropdown = document.getElementById('lessonsDropdown'); // Dropdown to display lessons
  const contentsContainer = document.getElementById('contentsContainer'); // Div to display contents

  // Fetch the Excel file
  fetch(filePath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.arrayBuffer();
    })
    .then(data => {
      // Parse the Excel file
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0]; // Use the first sheet
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      console.log('Parsed Excel data:', jsonData); // Debugging output

      // Process data to group lessons and contents by grade and subject
      jsonData.forEach(row => {
        const grade = row['Grade'];
        const subject = row['Subjects'];
        const lesson = row['Lesson'];
        const contents = row['Con'];

        if (!gradeData[grade]) {
          gradeData[grade] = {};
        }

        if (!gradeData[grade][subject]) {
          gradeData[grade][subject] = {};
        }

        gradeData[grade][subject][lesson] = contents.split(','); // Split contents by commas
      });

      console.log('Processed Grade Data:', gradeData); // Debugging output

      // Populate the grades dropdown
      const grades = Object.keys(gradeData);
      gradesDropdown.innerHTML = '<option value="">Select a Grade</option>';
      grades.forEach(grade => {
        const option = document.createElement('option');
        option.value = grade;
        option.textContent = `Grade ${grade}`;
        gradesDropdown.appendChild(option);
      });

      // Handle grade selection
      gradesDropdown.addEventListener('change', () => {
        const selectedGrade = gradesDropdown.value;
        subjectsContainer.innerHTML = ''; // Clear previous subjects
        lessonsDropdown.innerHTML = '<option value="">Select a Lesson</option>'; // Clear previous lessons
        contentsContainer.innerHTML = ''; // Clear previous contents

        if (selectedGrade && gradeData[selectedGrade]) {
          // Display subjects for the selected grade as buttons
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

// Function to display lessons for a subject
// Function to display lessons for a subject as buttons
function displayLessons(subject, grade) {
  const contentsContainer = document.getElementById('contentsContainer');
  contentsContainer.innerHTML = ''; // Clear previous contents
  const lessonsContainer = document.getElementById('lessonsContainer') || document.createElement('div'); // Ensure lessonsContainer exists

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


// Function to display contents for a lesson
function displayContents(subject, grade, lesson) {
  const contentsContainer = document.getElementById('contentsContainer');
  contentsContainer.innerHTML = ''; // Clear previous contents

  if (gradeData[grade][subject][lesson]) {
    const contents = gradeData[grade][subject][lesson];
    contents.forEach(content => {
      const button = document.createElement('button');
      button.textContent = content.trim(); // Trim to remove extra spaces
      contentsContainer.appendChild(button);
    });
  }
}

// Load the data on page load
document.addEventListener('DOMContentLoaded', loadGradesAndSubjects);
