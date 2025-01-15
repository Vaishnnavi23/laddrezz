// Fetch and process the Excel file
function loadGradesAndSubjects() {
  const filePath = './grades.xlsx'; // Path to your Excel file
  const gradesDropdown = document.getElementById('gradesDropdown');
  const subjectButtonsContainer = document.getElementById('subjectButtons');
  const contentButtonsContainer = document.getElementById('contentButtons');

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

      // Process data to group subjects and contents by grade
      const gradeData = {};
      jsonData.forEach(row => {
        const grade = row['Grade'];
        const subject = row['Subjects'];
        const content = row['Contents'];

        if (!gradeData[grade]) {
          gradeData[grade] = [];
        }
        gradeData[grade].push({ subject, content });
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
        subjectButtonsContainer.innerHTML = '';
        contentButtonsContainer.innerHTML = '';

        console.log(`Selected Grade: ${selectedGrade}`); // Debugging output

        if (selectedGrade && gradeData[selectedGrade]) {
          // Create buttons for subjects
          gradeData[selectedGrade].forEach(({ subject, content }) => {
            const button = document.createElement('button');
            button.textContent = subject;
            button.addEventListener('click', () => {
              // Display contents as buttons
              contentButtonsContainer.innerHTML = '';
              const contents = content.split(',');
              contents.forEach(contentItem => {
                const contentButton = document.createElement('button');
                contentButton.textContent = contentItem.trim();
                contentButtonsContainer.appendChild(contentButton);
              });
              console.log(`Selected Subject: ${subject}, Contents: ${content}`); // Debugging output
            });
            subjectButtonsContainer.appendChild(button);
          });
        }
      });
    })
    .catch(error => {
      console.error('Error reading Excel file:', error);
    });
}

// Load the data on page load
document.addEventListener('DOMContentLoaded', loadGradesAndSubjects);
