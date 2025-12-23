let currentCurrency = 'INR';
let currentData = null;
let savedOffers = [];

const currencySymbols = {
    INR: '₹', USD: '$', EUR: '€', GBP: '£'
};

const cityData = {
    Mumbai: 100,
    Bangalore: 90,
    Delhi: 95,
    Hyderabad: 75,
    Pune: 80
};

/* Tabs */
function switchTab(event, name) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById(name + '-tab').classList.add('active');
}

/* Currency */
function updateCurrency() {
    currentCurrency = document.getElementById('currency').value;
}

/* Salary Calculation */
function calculateSalary() {
    const ctc = +document.getElementById('ctc').value;
    const basicPct = +document.getElementById('basic-percent').value;
    const hraPct = +document.getElementById('hra-percent').value;

    if (!ctc) return alert("Enter CTC");

    const basic = ctc * basicPct / 100;
    const hra = basic * hraPct / 100;
    const gross = basic + hra;
    const monthly = gross / 12;

    currentData = { ctc, basic, hra, gross };

    document.getElementById('output-content').innerHTML = `
        <div class="highlight-card">
            <div class="amount">${currencySymbols[currentCurrency]}${monthly.toFixed(0)}</div>
            <div class="period">Monthly In-hand (Approx)</div>
        </div>

        <div class="result-card">
            <div class="result-item"><span>CTC</span><span>${currencySymbols[currentCurrency]}${ctc}</span></div>
            <div class="result-item"><span>Basic</span><span>${basic.toFixed(0)}</span></div>
            <div class="result-item"><span>HRA</span><span>${hra.toFixed(0)}</span></div>
            <div class="result-item"><span>Gross</span><span>${gross.toFixed(0)}</span></div>
        </div>
    `;
}

/* Tax */
function calculateTax() {
    if (!currentData) return alert("Calculate salary first");
    let tax = 0;
    let income = currentData.gross;

    if (income > 500000) tax += (income - 500000) * 0.2;
    if (income > 1000000) tax += (income - 1000000) * 0.1;

    document.getElementById('tax-output').innerHTML = `
        <div class="result-card">
            <h3>Estimated Annual Tax</h3>
            <div class="result-item">
                <span>Tax Payable</span>
                <span>${currencySymbols[currentCurrency]}${tax.toFixed(0)}</span>
            </div>
        </div>
    `;
}

/* Save Offer */
function saveComparison() {
    if (!currentData) return alert("Calculate salary first");
    savedOffers.push({
        name: document.getElementById('offer-name').value || "Offer",
        ctc: currentData.ctc
    });
    renderComparison();
}

/* Comparison */
function renderComparison() {
    const container = document.getElementById('comparison-content');
    container.innerHTML = '';

    savedOffers.forEach((o, i) => {
        container.innerHTML += `
            <div class="comparison-card">
                <button class="delete-btn" onclick="deleteOffer(${i})">×</button>
                <h3>${o.name}</h3>
                <p>CTC: ${currencySymbols[currentCurrency]}${o.ctc}</p>
            </div>
        `;
    });
}

function deleteOffer(i) {
    savedOffers.splice(i, 1);
    renderComparison();
}

/* City Comparison */
function compareCities() {
    if (!currentData) return alert("Calculate salary first");
    let html = '<div class="city-comparison-grid">';
    Object.keys(cityData).forEach(city => {
        const adjusted = currentData.ctc * (100 / cityData[city]);
        html += `
            <div class="city-card">
                <h4>${city}</h4>
                <p>Equivalent Salary: ${currencySymbols[currentCurrency]}${adjusted.toFixed(0)}</p>
            </div>
        `;
    });
    html += '</div>';
    document.getElementById('city-output').innerHTML = html;
}

/* Recommendations */
function showRecommendations() {
    if (!currentData) return alert("Calculate salary first");
    document.getElementById('recommendations-content').innerHTML = `
        <ul>
            <li>Keep Basic around 40–50% for tax efficiency</li>
            <li>Use HRA & 80C to reduce tax</li>
            <li>Compare city cost before accepting offers</li>
        </ul>
    `;
    document.getElementById('recommendations-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('recommendations-modal').style.display = 'none';
}
