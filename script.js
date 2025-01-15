// Fetch and process the Excel file
function loadGradesAndSubjects() {
  const filePath = './MasterFile.xlsx'; // Path to your Excel file
  const gradesDropdown = document.getElementById('gradesDropdown');
  const subjectsContainer = document.getElementById('subjectsContainer'); // Div to display subjects
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

      // Process data to group subjects by grade and store corresponding contents
      const gradeData = {};
      jsonData.forEach(row => {
        const grade = row['Grade'];
        const subject = row['Subjects'];
        const contents = row['Contents'];

        if (!gradeData[grade]) {
          gradeData[grade] = {};
        }
        gradeData[grade][subject] = contents; // Split contents by commas
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
        contentsContainer.innerHTML = ''; // Clear previous contents

        console.log(`Selected Grade: ${selectedGrade}`); // Debugging output

        if (selectedGrade && gradeData[selectedGrade]) {
          // Display subjects for the selected grade as buttons
          const subjects = Object.keys(gradeData[selectedGrade]);
          subjects.forEach(subject => {
            const button = document.createElement('button');
            button.textContent = subject;
            button.onclick = () => displayContents(subject, selectedGrade);
            subjectsContainer.appendChild(button);
          });
        } else {
          subjectsContainer.textContent = ''; // Clear if no grade is selected
        }
      });
    })
    .catch(error => {
      console.error('Error reading Excel file:', error);
    });
}

// Function to display contents when a subject button is clicked
function displayContents(subject, grade) {
  const contentsContainer = document.getElementById('contentsContainer');
  contentsContainer.innerHTML = ''; // Clear previous contents

  const gradeData = {}; // Assuming the gradeData object is available
  const contents = gradeData[grade][subject];

  contents.forEach(content => {
    const button = document.createElement('button');
    button.textContent = content.trim(); // Trim to remove extra spaces
    contentsContainer.appendChild(button);
  });
}

// Load the data on page load
document.addEventListener('DOMContentLoaded', loadGradesAndSubjects);
