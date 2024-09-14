function formatNumber(num, currency) {
  if (currency === "India") {
    // Format number with commas for Indian currency
    return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(
      num
    );
  } else {
    // Format number with commas for Dollar currency
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(
      num
    );
  }
}

function Calcu() {
  // Get the input values
  const ctc = parseFloat(document.getElementById("CTC").value);
  const region = document.getElementById("Region").value;
  const currency = document.getElementById("RegIn").value;

  // Validate the input
  if (isNaN(ctc) || ctc <= 0) {
    alert("Please enter a valid CTC amount.");
    return;
  }

  // Perform region-specific calculations
  let basicSalary, hra, specialAllowance, deductions, netPayableSalary;

  if (region === "India") {
    basicSalary = ctc * 0.4;
    hra = basicSalary * 0.5;
    specialAllowance = ctc - (basicSalary + hra);
    deductions = basicSalary * 0.12 + 2500;
  } else if (region === "USA") {
    basicSalary = ctc * 0.5;
    hra = 0;
    specialAllowance = ctc - basicSalary;
    deductions = basicSalary * 0.062 + basicSalary * 0.0145; // Social security and Medicare in USA
  }

  // Calculate net payable salary
  netPayableSalary = ctc - deductions;

  // Monthly values
  const basicSalaryMonthly = basicSalary / 12;
  const hraMonthly = hra / 12;
  const specialAllowanceMonthly = specialAllowance / 12;
  const deductionsMonthly = deductions / 12;
  const netPayableSalaryMonthly = netPayableSalary / 12;

  // Get the table body element where data will be inserted
  const resultsBody = document.getElementById("results-body");

  // Clear previous table data if any
  resultsBody.innerHTML = "";

  // Data to populate with detailed parameter descriptions
  const data = [
    {
      parameter: "Basic Salary (40% of CTC)",
      yearly: basicSalary,
      monthly: basicSalaryMonthly,
      positive: true,
    },
    {
      parameter: "House Rent Allowance (HRA, 50% of Basic)",
      yearly: hra,
      monthly: hraMonthly,
      positive: true,
    },
    {
      parameter: "Special Allowance",
      yearly: specialAllowance,
      monthly: specialAllowanceMonthly,
      positive: true,
    },
    {
      parameter: "Deductions (Provident Fund, Taxes)",
      yearly: deductions,
      monthly: deductionsMonthly,
      positive: false,
    },
    {
      parameter: "Net Payable Salary (After Deductions)",
      yearly: netPayableSalary,
      monthly: netPayableSalaryMonthly,
      positive: true,
    },
  ];

  // Loop through the data to create rows dynamically
  data.forEach((item) => {
    const newRow = document.createElement("tr");

    // Create and append cells to the new row
    newRow.innerHTML = `
      <td>${item.parameter}</td>
      <td style="color: ${item.positive ? "green" : "red"}">${formatNumber(
      item.yearly,
      currency
    )}</td>
      <td style="color: ${item.positive ? "green" : "red"}">${formatNumber(
      item.monthly,
      currency
    )}</td>
    `;

    // Append the new row to the table body
    resultsBody.appendChild(newRow);
  });

  // Make the lower box (table) visible
  const lowerBox = document.querySelector(".lower-box");
  lowerBox.classList.add("visible");
}
