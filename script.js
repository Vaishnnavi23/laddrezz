// Fetch and process the Excel file
let gradeData = {}; 
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
        const contents = row['Con'];

        if (!gradeData[grade]) {
          gradeData[grade] = {};
        }
         console.log(' Grade :', grade);
        console.log(' Sub :', subject);
        console.log(' contents :', contents);
        gradeData[grade][subject] = contents.split(","); // Split contents by commas
        console.log("Grade Data  11111111111111111111111111:", JSON.stringify(gradeData, null, 2)); 
        const jsonData = JSON.stringify(gradeData, null, 2);
        if (jsonData[grade] && jsonData[grade][subject]) {
          console.log("VVVVVVVVVVVVVVVVVVVVVVV"); 
    return jsonData[grade][subject];
  } else {
            console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"); 
    return null; // Return null if grade or subject not found
  }
        console.log("gradeData[grade][subject] : "+ gradeData[1]['English']);
        console.log("gradeData : "+ gradeData);
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
  //console.log("gradeData 1: "+ gradeData[grade][subject]);
//  const gradeData = {}; // Assuming the gradeData object is available
  console.log("grade: "+ grade);
  console.log("subject: "+ subject);
   console.log("gradeData 2: "+ gradeData);
  console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
  const contents = gradeData[1]['English'];
   console.log("contents : "+ contents);
  contents.forEach(content => {
    const button = document.createElement('button');
    button.textContent = content.trim(); // Trim to remove extra spaces
    contentsContainer.appendChild(button);
  });
}

// Load the data on page load
document.addEventListener('DOMContentLoaded', loadGradesAndSubjects);
