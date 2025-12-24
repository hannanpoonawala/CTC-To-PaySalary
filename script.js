// Global variables
let currentCurrency = 'INR';
let currentData = null;
let savedOffers = [];
let selectedTaxRegime = 'old';

// Currency configurations
const currencySymbols = {
    'INR': '₹',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'AED': 'د.إ',
    'SGD': 'S$'
};

const exchangeRates = {
    'INR': 1,
    'USD': 0.012,
    'EUR': 0.011,
    'GBP': 0.0095,
    'AED': 0.044,
    'SGD': 0.016
};

// City data for comparison
const cityData = {
    'Mumbai': { rent: 25000, food: 8000, transport: 3000, ptax: 2400, index: 100 },
    'Bangalore': { rent: 20000, food: 7000, transport: 2500, ptax: 2400, index: 90 },
    'Delhi': { rent: 22000, food: 7500, transport: 2800, ptax: 2400, index: 92 },
    'Hyderabad': { rent: 15000, food: 6000, transport: 2000, ptax: 2400, index: 75 },
    'Pune': { rent: 18000, food: 6500, transport: 2200, ptax: 2400, index: 80 },
    'Chennai': { rent: 16000, food: 6000, transport: 2000, ptax: 2400, index: 78 }
};

// Tab switching
function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tabName + '-tab').classList.add('active');
}

// Toggle collapsible sections
function toggleSection(id) {
    const content = document.getElementById(id);
    const arrow = document.getElementById(id + '-arrow');
    content.classList.toggle('active');
    arrow.textContent = content.classList.contains('active') ? '▲' : '▼';
}

// Currency update
function updateCurrency() {
    currentCurrency = document.getElementById('currency').value;
    if (currentData) {
        displayResults(currentData);
    }
}

// Format currency with symbol
function formatCurrency(amount) {
    const symbol = currencySymbols[currentCurrency];
    const convertedAmount = amount * exchangeRates[currentCurrency];
    return symbol + convertedAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

// Main salary calculation
function calculateSalary() {
    const ctc = parseFloat(document.getElementById('ctc').value) || 0;
    
    if (ctc <= 0) {
        alert('Please enter a valid CTC amount');
        return;
    }

    const basicPercent = parseFloat(document.getElementById('basic-percent').value) || 40;
    const hraPercent = parseFloat(document.getElementById('hra-percent').value) || 50;
    const pfPercent = parseFloat(document.getElementById('pf-percent').value) || 12;
    const professionalTax = parseFloat(document.getElementById('professional-tax').value) || 2400;
    const bonus = parseFloat(document.getElementById('bonus').value) || 0;
    const joiningBonus = parseFloat(document.getElementById('joining-bonus').value) || 0;
    const relocation = parseFloat(document.getElementById('relocation').value) || 0;
    const gratuityPercent = parseFloat(document.getElementById('gratuity-percent').value) || 4.81;
    const lta = parseFloat(document.getElementById('lta').value) || 0;
    const medical = parseFloat(document.getElementById('medical').value) || 0;
    const food = parseFloat(document.getElementById('food').value) || 0;
    const variable = parseFloat(document.getElementById('variable').value) || 0;
    const stocks = parseFloat(document.getElementById('stocks').value) || 0;

    // Calculate components
    const basic = (ctc * basicPercent) / 100;
    const hra = (basic * hraPercent) / 100;
    const pfEmployee = (basic * pfPercent) / 100;
    const pfEmployer = pfEmployee;
    const gratuity = (basic * gratuityPercent) / 100;
    
    const specialAllowance = ctc - basic - hra - pfEmployer - gratuity - bonus - lta - medical - food - variable - stocks;
    
    const grossSalary = basic + hra + specialAllowance + bonus + lta + medical + food + variable + stocks;
    const totalDeductions = pfEmployee + professionalTax;
    const netSalaryAnnual = grossSalary - totalDeductions;
    const netSalaryMonthly = netSalaryAnnual / 12;
    const inHandMonthly = (basic + hra + specialAllowance + lta/12 + medical/12 + food/12 + variable/12 - pfEmployee/12 - professionalTax/12)/12;

    currentData = {
        ctc, basic, hra, specialAllowance, bonus, joiningBonus, relocation, gratuity,
        pfEmployee, pfEmployer, professionalTax, grossSalary, totalDeductions,
        netSalaryAnnual, netSalaryMonthly, inHandMonthly, lta, medical, food, variable, stocks,
        offerName: document.getElementById('offer-name').value || 'Offer ' + (savedOffers.length + 1)
    };

    displayResults(currentData);
}

// Display salary results
function displayResults(data) {
    const output = document.getElementById('output-content');
    output.innerHTML = `
        <div class="highlight-card">
            <h3>Monthly In-Hand Salary</h3>
            <div class="amount">${formatCurrency(data.inHandMonthly)}</div>
            <div class="period">Per Month</div>
        </div>

        <div class="highlight-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
            <h3>Annual Net Salary</h3>
            <div class="amount">${formatCurrency(data.netSalaryAnnual)}</div>
            <div class="period">Per Year</div>
        </div>

        ${data.stocks > 0 ? `<div class="highlight-card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
            <h3>Total Compensation (with stocks)</h3>
            <div class="amount">${formatCurrency(data.netSalaryAnnual + data.stocks)}</div>
            <div class="period">Per Year</div>
        </div>` : ''}

        <div class="result-card">
            <h3>💵 Earnings Breakdown</h3>
            <div class="result-item">
                <span class="result-label">Basic Salary</span>
                <span class="result-value">${formatCurrency(data.basic)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">HRA</span>
                <span class="result-value">${formatCurrency(data.hra)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Special Allowance</span>
                <span class="result-value">${formatCurrency(data.specialAllowance)}</span>
            </div>
            ${data.lta > 0 ? `<div class="result-item"><span class="result-label">LTA</span><span class="result-value">${formatCurrency(data.lta)}</span></div>` : ''}
            ${data.medical > 0 ? `<div class="result-item"><span class="result-label">Medical</span><span class="result-value">${formatCurrency(data.medical)}</span></div>` : ''}
            ${data.food > 0 ? `<div class="result-item"><span class="result-label">Food Allowance</span><span class="result-value">${formatCurrency(data.food)}</span></div>` : ''}
            ${data.variable > 0 ? `<div class="result-item"><span class="result-label">Variable Pay</span><span class="result-value">${formatCurrency(data.variable)}</span></div>` : ''}
            ${data.bonus > 0 ? `<div class="result-item"><span class="result-label">Bonus</span><span class="result-value">${formatCurrency(data.bonus)}</span></div>` : ''}
            ${data.stocks > 0 ? `<div class="result-item"><span class="result-label">Stock Options/RSUs</span><span class="result-value">${formatCurrency(data.stocks)}</span></div>` : ''}
            <div class="result-item" style="border-top: 2px solid #667eea; margin-top: 10px; padding-top: 15px;">
                <span class="result-label"><strong>Gross Salary</strong></span>
                <span class="result-value" style="color: #667eea;">${formatCurrency(data.grossSalary)}</span>
            </div>
        </div>

        ${(data.joiningBonus > 0 || data.relocation > 0) ? `<div class="result-card">
            <h3>🎁 One-Time Benefits</h3>
            ${data.joiningBonus > 0 ? `<div class="result-item"><span class="result-label">Joining Bonus</span><span class="result-value">${formatCurrency(data.joiningBonus)}</span></div>` : ''}
            ${data.relocation > 0 ? `<div class="result-item"><span class="result-label">Relocation Bonus</span><span class="result-value">${formatCurrency(data.relocation)}</span></div>` : ''}
        </div>` : ''}

        <div class="result-card">
            <h3>➖ Deductions</h3>
            <div class="result-item">
                <span class="result-label">PF (Employee)</span>
                <span class="result-value">${formatCurrency(data.pfEmployee)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Professional Tax</span>
                <span class="result-value">${formatCurrency(data.professionalTax)}</span>
            </div>
            <div class="result-item" style="border-top: 2px solid #f5576c; margin-top: 10px; padding-top: 15px;">
                <span class="result-label"><strong>Total Deductions</strong></span>
                <span class="result-value" style="color: #f5576c;">${formatCurrency(data.totalDeductions)}</span>
            </div>
        </div>

        <div class="result-card">
            <h3>🏢 Employer Contributions</h3>
            <div class="result-item">
                <span class="result-label">PF (Employer)</span>
                <span class="result-value">${formatCurrency(data.pfEmployer)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Gratuity</span>
                <span class="result-value">${formatCurrency(data.gratuity)}</span>
            </div>
        </div>

        <div class="chart-container">
            <h3 style="margin-bottom: 20px; color: #333;">Component Distribution</h3>
            <div class="chart-bar">
                <div class="chart-label">Basic</div>
                <div class="chart-bar-container">
                    <div class="chart-bar-fill" style="width: ${(data.basic/data.ctc)*100}%">${((data.basic/data.ctc)*100).toFixed(1)}%</div>
                </div>
            </div>
            <div class="chart-bar">
                <div class="chart-label">HRA</div>
                <div class="chart-bar-container">
                    <div class="chart-bar-fill" style="width: ${(data.hra/data.ctc)*100}%">${((data.hra/data.ctc)*100).toFixed(1)}%</div>
                </div>
            </div>
            <div class="chart-bar">
                <div class="chart-label">Allowances</div>
                <div class="chart-bar-container">
                    <div class="chart-bar-fill" style="width: ${(data.specialAllowance/data.ctc)*100}%">${((data.specialAllowance/data.ctc)*100).toFixed(1)}%</div>
                </div>
            </div>
            <div class="chart-bar">
                <div class="chart-label">PF (Total)</div>
                <div class="chart-bar-container">
                    <div class="chart-bar-fill" style="width: ${((data.pfEmployee+data.pfEmployer)/data.ctc)*100}%">${(((data.pfEmployee+data.pfEmployer)/data.ctc)*100).toFixed(1)}%</div>
                </div>
            </div>
        </div>

        <div class="result-card">
            <h3>📅 Monthly Breakdown</h3>
            <div class="result-item">
                <span class="result-label">Gross Monthly</span>
                <span class="result-value">${formatCurrency(data.grossSalary/12)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Deductions</span>
                <span class="result-value">${formatCurrency(data.totalDeductions/12)}</span>
            </div>
            <div class="result-item" style="border-top: 2px solid #667eea; margin-top: 10px; padding-top: 15px;">
                <span class="result-label"><strong>Net Monthly</strong></span>
                <span class="result-value" style="color: #667eea;">${formatCurrency(data.netSalaryMonthly)}</span>
            </div>
        </div>
    `;
}

// Tax regime selection
function selectTaxRegime(regime) {
    selectedTaxRegime = regime;
    document.getElementById('old-regime').classList.toggle('selected', regime === 'old');
    document.getElementById('new-regime').classList.toggle('selected', regime === 'new');
}

// Tax calculation
function calculateTax() {
    if (!currentData) {
        alert('Please calculate salary first from the Calculator tab');
        return;
    }

    const tax80c = parseFloat(document.getElementById('tax-80c').value) || 0;
    const tax80d = parseFloat(document.getElementById('tax-80d').value) || 0;
    const taxHra = parseFloat(document.getElementById('tax-hra').value) || 0;
    const taxLta = parseFloat(document.getElementById('tax-lta').value) || 0;

    const grossIncome = currentData.grossSalary;
    
    let taxableIncome, tax;
    
    if (selectedTaxRegime === 'old') {
        const standardDeduction = 50000;
        const totalDeductions = standardDeduction + tax80c + tax80d + taxHra + taxLta;
        taxableIncome = Math.max(0, grossIncome - totalDeductions);
        tax = calculateOldRegimeTax(taxableIncome);
    } else {
        const standardDeduction = 75000;
        taxableIncome = Math.max(0, grossIncome - standardDeduction);
        tax = calculateNewRegimeTax(taxableIncome);
    }

    const cess = tax * 0.04;
    const totalTax = tax + cess;
    const netSalaryAfterTax = grossIncome - totalTax - currentData.totalDeductions;
    const monthlyInHand = netSalaryAfterTax / 12;

    displayTaxResults(grossIncome, taxableIncome, tax, cess, totalTax, netSalaryAfterTax, monthlyInHand);
}

// Old regime tax calculation
function calculateOldRegimeTax(income) {
    let tax = 0;
    if (income <= 250000) tax = 0;
    else if (income <= 500000) tax = (income - 250000) * 0.05;
    else if (income <= 1000000) tax = 12500 + (income - 500000) * 0.20;
    else tax = 112500 + (income - 1000000) * 0.30;
    return tax;
}

// New regime tax calculation
function calculateNewRegimeTax(income) {
    let tax = 0;
    if (income <= 300000) tax = 0;
    else if (income <= 700000) tax = (income - 300000) * 0.05;
    else if (income <= 1000000) tax = 20000 + (income - 700000) * 0.10;
    else if (income <= 1200000) tax = 50000 + (income - 1000000) * 0.15;
    else if (income <= 1500000) tax = 80000 + (income - 1200000) * 0.20;
    else tax = 140000 + (income - 1500000) * 0.30;
    return tax;
}

// Display tax results
function displayTaxResults(gross, taxable, tax, cess, total, netAnnual, netMonthly) {
    const output = document.getElementById('tax-output');
    output.innerHTML = `
        <div class="highlight-card">
            <h3>Monthly Take-Home (After Tax)</h3>
            <div class="amount">${formatCurrency(netMonthly)}</div>
            <div class="period">Per Month</div>
        </div>

        <div class="result-card">
            <h3>💰 Income Breakdown</h3>
            <div class="result-item">
                <span class="result-label">Gross Annual Income</span>
                <span class="result-value">${formatCurrency(gross)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Taxable Income</span>
                <span class="result-value">${formatCurrency(taxable)}</span>
            </div>
        </div>

        <div class="result-card">
            <h3>📊 Tax Calculation (${selectedTaxRegime === 'old' ? 'Old' : 'New'} Regime)</h3>
            <div class="result-item">
                <span class="result-label">Income Tax</span>
                <span class="result-value">${formatCurrency(tax)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Health & Education Cess (4%)</span>
                <span class="result-value">${formatCurrency(cess)}</span>
            </div>
            <div class="result-item" style="border-top: 2px solid #f5576c; margin-top: 10px; padding-top: 15px;">
                <span class="result-label"><strong>Total Tax</strong></span>
                <span class="result-value" style="color: #f5576c;">${formatCurrency(total)}</span>
            </div>
        </div>

        <div class="result-card">
            <h3>💵 Final Take-Home</h3>
            <div class="result-item">
                <span class="result-label">Annual Net Salary (After Tax)</span>
                <span class="result-value">${formatCurrency(netAnnual)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Monthly Take-Home</span>
                <span class="result-value" style="color: #667eea;">${formatCurrency(netMonthly)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Effective Tax Rate</span>
                <span class="result-value">${((total/gross)*100).toFixed(2)}%</span>
            </div>
        </div>

        <div class="chart-container">
            <h3 style="margin-bottom: 20px; color: #333;">Income Distribution</h3>
            <div class="chart-bar">
                <div class="chart-label">Take-Home</div>
                <div class="chart-bar-container">
                    <div class="chart-bar-fill" style="width: ${(netAnnual/gross)*100}%; background: linear-gradient(90deg, #4CAF50 0%, #45a049 100%);">${((netAnnual/gross)*100).toFixed(1)}%</div>
                </div>
            </div>
            <div class="chart-bar">
                <div class="chart-label">Tax</div>
                <div class="chart-bar-container">
                    <div class="chart-bar-fill" style="width: ${(total/gross)*100}%; background: linear-gradient(90deg, #f5576c 0%, #d43f54 100%);">${((total/gross)*100).toFixed(1)}%</div>
                </div>
            </div>
            <div class="chart-bar">
                <div class="chart-label">PF & Other</div>
                <div class="chart-bar-container">
                    <div class="chart-bar-fill" style="width: ${(currentData.totalDeductions/gross)*100}%">${((currentData.totalDeductions/gross)*100).toFixed(1)}%</div>
                </div>
            </div>
        </div>
    `;
}

// Save offer for comparison
function saveComparison() {
    if (!currentData) {
        alert('Please calculate salary first');
        return;
    }
    savedOffers.push({...currentData});
    alert('Offer saved for comparison! Check the Compare Offers tab.');
    updateComparisonView();
}

// Update comparison view
function updateComparisonView() {
    const container = document.getElementById('comparison-content');
    if (savedOffers.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No offers saved yet. Calculate a salary and click "Save for Comparison"</p></div>';
        return;
    }

    const bestOffer = savedOffers.reduce((best, offer) => 
        offer.netSalaryAnnual > best.netSalaryAnnual ? offer : best
    );

    container.innerHTML = savedOffers.map((offer, index) => `
        <div class="comparison-card ${offer === bestOffer ? 'winner' : ''}">
            ${offer === bestOffer ? '<div class="winner-badge">🏆 Best Offer</div>' : ''}
            <button class="delete-btn" onclick="deleteOffer(${index})">×</button>
            <h3>${offer.offerName}</h3>
            <div class="result-item">
                <span class="result-label">CTC</span>
                <span class="result-value">${formatCurrency(offer.ctc)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Annual Net</span>
                <span class="result-value">${formatCurrency(offer.netSalaryAnnual)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Monthly In-Hand</span>
                <span class="result-value" style="color: #667eea;">${formatCurrency(offer.inHandMonthly)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Basic Salary</span>
                <span class="result-value">${formatCurrency(offer.basic)}</span>
            </div>
            ${offer.stocks > 0 ? `<div class="result-item"><span class="result-label">Stock Value</span><span class="result-value">${formatCurrency(offer.stocks)}</span></div>` : ''}
            ${offer.bonus > 0 ? `<div class="result-item"><span class="result-label">Bonus</span><span class="result-value">${formatCurrency(offer.bonus)}</span></div>` : ''}
        </div>
    `).join('');
}

// Delete offer from comparison
function deleteOffer(index) {
    savedOffers.splice(index, 1);
    updateComparisonView();
}

// Clear all comparisons
function clearComparisons() {
    if (confirm('Are you sure you want to clear all saved offers?')) {
        savedOffers = [];
        updateComparisonView();
    }
}

// Compare cities
function compareCities() {
    if (!currentData) {
        alert('Please calculate salary first from the Calculator tab');
        return;
    }

    const output = document.getElementById('city-output');
    const monthlySalary = currentData.inHandMonthly;

    output.innerHTML = `
        <div class="city-comparison-grid">
            ${Object.entries(cityData).map(([city, data]) => {
                const totalExpenses = data.rent + data.food + data.transport;
                const savings = monthlySalary - totalExpenses;
                const savingsPercent = (savings / monthlySalary) * 100;
                const purchasingPower = (monthlySalary / data.index) * 100;

                return `
                    <div class="city-card">
                        <h4>${city}</h4>
                        <div class="city-metric">
                            <span>Avg. Rent</span>
                            <strong>${formatCurrency(data.rent)}</strong>
                        </div>
                        <div class="city-metric">
                            <span>Food</span>
                            <strong>${formatCurrency(data.food)}</strong>
                        </div>
                        <div class="city-metric">
                            <span>Transport</span>
                            <strong>${formatCurrency(data.transport)}</strong>
                        </div>
                        <div class="city-metric" style="border-top: 2px solid #667eea; margin-top: 10px; padding-top: 10px;">
                            <span><strong>Monthly Savings</strong></span>
                            <strong style="color: ${savings > 0 ? '#4CAF50' : '#f5576c'};">${formatCurrency(savings)}</strong>
                        </div>
                        <div class="city-metric">
                            <span>Savings Rate</span>
                            <strong>${savingsPercent.toFixed(1)}%</strong>
                        </div>
                        <div class="city-metric">
                            <span>Purchasing Power</span>
                            <strong>${purchasingPower.toFixed(0)}</strong>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>

        <div class="recommendation-box" style="margin-top: 30px;">
            <h4>💡 City Recommendations</h4>
            <ul>
                <li>Hyderabad and Pune offer the best savings potential with lower costs of living</li>
                <li>Mumbai and Delhi have higher expenses but better career opportunities</li>
                <li>Consider remote work options to maximize savings while living in cheaper cities</li>
                <li>Professional tax is similar across cities (~₹2,400/year)</li>
            </ul>
        </div>
    `;
}

// Show smart recommendations
function showRecommendations() {
    if (!currentData) {
        alert('Please calculate salary first');
        return;
    }

    const modal = document.getElementById('recommendations-modal');
    const content = document.getElementById('recommendations-content');
    
    const basicPercent = (currentData.basic / currentData.ctc) * 100;
    const recommendations = [];

    if (basicPercent < 40) {
        recommendations.push('⚠️ Your basic salary is below 40% of CTC. This affects PF contributions and other benefits. Try to negotiate for a higher basic component.');
    }

    if (basicPercent > 50) {
        recommendations.push('✅ Your basic salary is good (>50% of CTC), which means better retirement benefits through higher PF contributions.');
    }

    if (currentData.variable > currentData.basic * 0.3) {
        recommendations.push('⚠️ Variable pay is >30% of basic. Remember this is not guaranteed income. Plan your expenses based on fixed components only.');
    }

    if (currentData.stocks > 0) {
        recommendations.push('📈 Stock options can be valuable but are subject to vesting periods and market risks. Don\'t count them as liquid income.');
    }

    const savingsRate = (currentData.pfEmployee / currentData.grossSalary) * 100;
    if (savingsRate < 12) {
        recommendations.push('💰 Consider increasing voluntary PF contributions or investing in PPF/ELSS for better retirement corpus and tax savings.');
    }

    if (currentData.grossSalary > 1000000) {
        recommendations.push('📊 With your income level, consult a tax advisor to optimize between old and new tax regimes. The new regime might save you more.');
    }

    recommendations.push('🏦 Aim to save at least 20-30% of your take-home salary for financial security.');
    recommendations.push('🏥 Ensure you have adequate health insurance beyond employer coverage (at least 5-10 lakhs).');
    recommendations.push('📝 Create an emergency fund of 6-12 months of expenses before investing aggressively.');

    content.innerHTML = recommendations.map(rec => `<div class="recommendation-box"><p>${rec}</p></div>`).join('');
    modal.style.display = 'block';
}

// Close modal
function closeModal() {
    document.getElementById('recommendations-modal').style.display = 'none';
}

// Export to PDF (print)
function exportToPDF() {
    if (!currentData) {
        alert('Please calculate salary first');
        return;
    }
    window.print();
}

// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('recommendations-modal');
    if (event.target == modal) {
        closeModal();
    }
}

// Initialize comparison view on load
updateComparisonView();