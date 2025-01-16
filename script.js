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
        console.log("grade: "+grade +"subject :"+subject +"lesson :"+lesson);
        // Dynamically add columns starting with 'Button_' as buttons
        const resources = Object.keys(row)
          .filter(column => column.startsWith('Button_'))
          .reduce((acc, key) => {
           
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
      Array.from(section
