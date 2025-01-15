// Fetch and process the Excel file
function loadGradesAndSubjects() {
  const filePath = './grades.xlsx'; // Path to your Excel file
  const gradesDropdown = document.getElementById('gradesDropdown');
  const subjectsContainer = document.getElementById('subjectsContainer'); // Div to display subjects

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

      // Process data to group subjects by grade
      const gradeData = {};
      jsonData.forEach(row => {
        const grade = row['Grade'];
        const subject = row['Subjects'];

        if (!gradeData[grade]) {
          gradeData[grade] = new Set(); // Use a Set to avoid duplicates
        }
        gradeData[grade].add(subject);
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

        console.log(`Selected Grade: ${selectedGrade}`); // Debugging output

        if (selectedGrade && gradeData[selectedGrade]) {
          // Display subjects for the selected grade
          const subjects = Array.from(gradeData[selectedGrade]).join(', ');
          subjectsContainer.textContent = `Subjects: ${subjects}`;
        } else {
          subjectsContainer.textContent = ''; // Clear if no grade is selected
        }
      });
    })
    .catch(error => {
      console.error('Error reading Excel file:', error);
    });
}

// Load the data on page load
document.addEventListener('DOMContentLoaded', loadGradesAndSubjects);
