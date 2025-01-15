// Function to read the Excel file and populate the dropdown
function populateDropdown() {
  const filePath = './grades.xlsx'; // Path to your Excel file
  const dropdown = document.getElementById('gradesDropdown');

  fetch(filePath)
    .then(response => response.arrayBuffer())
    .then(data => {
      // Read the Excel file
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0]; // Use the first sheet
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert sheet to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Clear the dropdown and populate options
      dropdown.innerHTML = '<option value="">Select a Grade</option>';
      jsonData.forEach(row => {
        const grade = row['Grade']; // Assuming the column name in Excel is "Grade"
        if (grade) {
          const option = document.createElement('option');
          option.value = grade;
          option.textContent = grade;
          dropdown.appendChild(option);
        }
      });
    })
    .catch(error => {
      console.error('Error reading Excel file:', error);
      dropdown.innerHTML = '<option value="">Error loading grades</option>';
    });
}

// Call the function on page load
document.addEventListener('DOMContentLoaded', populateDropdown);
