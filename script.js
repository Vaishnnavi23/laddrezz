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
        console.log("grade :"+grade +"subject :"+subject +"lesson :"+lesson);
        // Dynamically add columns starting with 'Button_' as buttons
        const resources = Object.keys(row)
          .filter(column => column.startsWith('Button_'))
          .reduce((acc, key) => {
            console.log("key: "+key);
            acc[key] = row[key];
            return acc;
          }, {});

        if (!gradeData[grade]) {
          gradeData[grade] = {};
        }

        if (!gradeData[grade][subject]) {
          gradeData[grade][subject] = {};
        }

        gradeData[grade][subject][lesson] = resources;
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
        const lessonsContainer = document.getElementById('lessonsContainer');
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

// Function to handle button selection styling
function handleButtonClick(sectionContainer) {
  sectionContainer.addEventListener('click', function (event) {
    if (event.target.tagName === 'BUTTON') {
      // Remove 'selected' class from all buttons in the section
      Array.from(sectionContainer.getElementsByTagName('button')).forEach(function (button) {
        button.classList.remove('selected');
      });

      // Add 'selected' class to the clicked button
      event.target.classList.add('selected');
    }
  });
}

// Initialize button click handling for each section
document.addEventListener('DOMContentLoaded', () => {
  handleButtonClick(document.getElementById('subjectsContainer'));
  handleButtonClick(document.getElementById('lessonsContainer'));
  handleButtonClick(document.getElementById('contentsContainer'));
});

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

// Function to display available contents dynamically
function displayContents(subject, grade, lesson) {
  const contentsContainer = document.getElementById('contentsContainer');
  contentsContainer.innerHTML = ''; // Clear previous contents

  if (gradeData[grade][subject][lesson]) {
    const resources = gradeData[grade][subject][lesson];
    let resourcesAvailable = false; // Flag to check if any resource is available

    Object.keys(resources).forEach(key => {
      if (key.startsWith('Button_')) {
        const buttonText = key.replace('Button_', ''); // Extract button text by removing "Button_"
        const resourceLink = resources[key]; // Get the resource link

        if (resourceLink) {
          const resourceButton = document.createElement('button');
          resourceButton.textContent = buttonText; // Set the button text
          const urlWithParam = '${resourceLink}?subject=${encodeURIComponent(subject)}';
          urlWithParam = urlWithParam+'grade=${encodeURIComponent(subject)};
          resourceButton.onclick = () => window.open(urlWithParam, '_blank'); // Open the resource link in a new tab
          contentsContainer.appendChild(resourceButton);
          resourcesAvailable = true;
        }
      }
    });

    // If no resources are available, display a message
    if (!resourcesAvailable) {
      const noResourcesMessage = document.createElement('p');
      noResourcesMessage.textContent = 'No Resource available at this moment';
      contentsContainer.appendChild(noResourcesMessage);
    }
  }
}

// Load the data on page load
document.addEventListener('DOMContentLoaded', loadGradesAndSubjects);
