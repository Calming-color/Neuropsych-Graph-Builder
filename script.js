// Global state
let domains = [];
let tests = [];
let currentChart = null;

// Score conversion utilities
const ScoreConverter = {
    // Convert any score type to Z-score
    toZScore(value, scoreType) {
        switch(scoreType) {
            case 't':
                return (value - 50) / 10;
            case 'z':
                return value;
            case 'scaled':
                return (value - 10) / 3;
            case 'standard':
                return (value - 100) / 15;
            case 'percentile':
                return this.percentileToZ(value);
            default:
                return 0;
        }
    },

    // Convert Z-score to any score type
    fromZScore(z, targetType) {
        switch(targetType) {
            case 't':
                return z * 10 + 50;
            case 'z':
                return z;
            case 'scaled':
                return z * 3 + 10;
            case 'standard':
                return z * 15 + 100;
            case 'percentile':
                return this.zToPercentile(z);
            default:
                return 0;
        }
    },

    // Convert percentile to Z-score using approximation
    percentileToZ(percentile) {
        // Clamp percentile between 0.01 and 99.99
        percentile = Math.max(0.01, Math.min(99.99, percentile));

        // Convert to probability
        const p = percentile / 100;

        // Approximation of inverse normal CDF (probit function)
        if (p < 0.5) {
            const t = Math.sqrt(-2 * Math.log(p));
            const c0 = 2.515517;
            const c1 = 0.802853;
            const c2 = 0.010328;
            const d1 = 1.432788;
            const d2 = 0.189269;
            const d3 = 0.001308;
            return -(t - ((c0 + c1 * t + c2 * t * t) / (1 + d1 * t + d2 * t * t + d3 * t * t * t)));
        } else {
            const t = Math.sqrt(-2 * Math.log(1 - p));
            const c0 = 2.515517;
            const c1 = 0.802853;
            const c2 = 0.010328;
            const d1 = 1.432788;
            const d2 = 0.189269;
            const d3 = 0.001308;
            return t - ((c0 + c1 * t + c2 * t * t) / (1 + d1 * t + d2 * t * t + d3 * t * t * t));
        }
    },

    // Convert Z-score to percentile using normal CDF approximation
    zToPercentile(z) {
        // Approximation of normal CDF
        const t = 1 / (1 + 0.2316419 * Math.abs(z));
        const d = 0.3989423 * Math.exp(-z * z / 2);
        const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));

        const percentile = z > 0 ? (1 - p) * 100 : p * 100;
        return Math.max(0.01, Math.min(99.99, percentile));
    },

    // Convert any score type to T-score
    toTScore(value, scoreType) {
        const z = this.toZScore(value, scoreType);
        return this.fromZScore(z, 't');
    },

    // Convert any score type to percentile
    toPercentile(value, scoreType) {
        const z = this.toZScore(value, scoreType);
        return this.fromZScore(z, 'percentile');
    }
};

// Domain Management
function addDomain() {
    const domainInput = document.getElementById('domainName');
    const domainName = domainInput.value.trim();

    if (!domainName) {
        alert('Please enter a domain name');
        return;
    }

    if (domains.includes(domainName)) {
        alert('This domain already exists');
        return;
    }

    domains.push(domainName);
    domainInput.value = '';
    updateDomainsDisplay();
    updateDomainCheckboxes();
}

function removeDomain(domainName) {
    if (confirm(`Remove domain "${domainName}"? Tests assigned to this domain will not be deleted.`)) {
        domains = domains.filter(d => d !== domainName);

        // Remove domain from all tests
        tests.forEach(test => {
            test.domains = test.domains.filter(d => d !== domainName);
        });

        updateDomainsDisplay();
        updateDomainCheckboxes();
        updateTestsDisplay();
    }
}

function updateDomainsDisplay() {
    const container = document.getElementById('domainsList');

    if (domains.length === 0) {
        container.innerHTML = '<p class="hint">No domains added yet</p>';
        return;
    }

    container.innerHTML = domains.map(domain => `
        <div class="domain-tag">
            ${domain}
            <button onclick="removeDomain('${domain}')">×</button>
        </div>
    `).join('');
}

function updateDomainCheckboxes() {
    const container = document.getElementById('domainCheckboxes');

    if (domains.length === 0) {
        container.innerHTML = '<p class="hint">Add domains above first</p>';
        return;
    }

    container.innerHTML = domains.map(domain => `
        <div class="checkbox-item">
            <input type="checkbox" id="domain-${domain}" value="${domain}">
            <label for="domain-${domain}">${domain}</label>
        </div>
    `).join('');
}

// Test Management
function addTest() {
    const testName = document.getElementById('testName').value.trim();
    const rawScore = document.getElementById('rawScore').value;
    const scoreType = document.getElementById('scoreType').value;
    const standardScore = parseFloat(document.getElementById('standardScore').value);

    if (!testName) {
        alert('Please enter a test name');
        return;
    }

    if (isNaN(standardScore)) {
        alert('Please enter a valid standard score');
        return;
    }

    // Get selected domains
    const selectedDomains = [];
    domains.forEach(domain => {
        const checkbox = document.getElementById(`domain-${domain}`);
        if (checkbox && checkbox.checked) {
            selectedDomains.push(domain);
        }
    });

    // Convert scores
    const zScore = ScoreConverter.toZScore(standardScore, scoreType);
    const tScore = ScoreConverter.fromZScore(zScore, 't');
    const percentile = ScoreConverter.zToPercentile(zScore);
    const scaledScore = ScoreConverter.fromZScore(zScore, 'scaled');
    const standardScoreConverted = ScoreConverter.fromZScore(zScore, 'standard');

    const test = {
        id: Date.now(),
        name: testName,
        rawScore: rawScore || 'N/A',
        scoreType: scoreType,
        originalScore: standardScore,
        zScore: zScore,
        tScore: tScore,
        percentile: percentile,
        scaledScore: scaledScore,
        standardScore: standardScoreConverted,
        domains: selectedDomains
    };

    tests.push(test);

    // Clear form
    document.getElementById('testName').value = '';
    document.getElementById('rawScore').value = '';
    document.getElementById('standardScore').value = '';

    // Uncheck all domain checkboxes
    domains.forEach(domain => {
        const checkbox = document.getElementById(`domain-${domain}`);
        if (checkbox) checkbox.checked = false;
    });

    updateTestsDisplay();
}

function removeTest(testId) {
    tests = tests.filter(t => t.id !== testId);
    updateTestsDisplay();
}

function updateTestsDisplay() {
    const container = document.getElementById('testsList');

    if (tests.length === 0) {
        container.innerHTML = '<p class="hint">No tests added yet. Add tests above to build your assessment battery.</p>';
        return;
    }

    container.innerHTML = tests.map(test => {
        const scoreTypeLabels = {
            't': 'T-Score',
            'z': 'Z-Score',
            'scaled': 'Scaled',
            'standard': 'Standard',
            'percentile': 'Percentile'
        };

        return `
            <div class="test-item">
                <div class="test-item-header">
                    <span class="test-name">${test.name}</span>
                    <button class="test-delete" onclick="removeTest(${test.id})">Delete</button>
                </div>
                <div class="test-details">
                    <div class="test-detail">
                        <span class="test-detail-label">Raw Score:</span>
                        <span class="test-detail-value">${test.rawScore}</span>
                    </div>
                    <div class="test-detail">
                        <span class="test-detail-label">Input (${scoreTypeLabels[test.scoreType]}):</span>
                        <span class="test-detail-value">${test.originalScore.toFixed(1)}</span>
                    </div>
                    <div class="test-detail">
                        <span class="test-detail-label">T-Score:</span>
                        <span class="test-detail-value">${test.tScore.toFixed(1)}</span>
                    </div>
                    <div class="test-detail">
                        <span class="test-detail-label">Percentile:</span>
                        <span class="test-detail-value">${test.percentile.toFixed(1)}%</span>
                    </div>
                    <div class="test-detail">
                        <span class="test-detail-label">Z-Score:</span>
                        <span class="test-detail-value">${test.zScore.toFixed(2)}</span>
                    </div>
                    <div class="test-detail">
                        <span class="test-detail-label">Scaled Score:</span>
                        <span class="test-detail-value">${test.scaledScore.toFixed(1)}</span>
                    </div>
                </div>
                ${test.domains.length > 0 ? `
                    <div class="test-domains">
                        ${test.domains.map(d => `<span class="test-domain-tag">${d}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

// Calculate domain means
function calculateDomainMeans() {
    const domainMeans = {};

    domains.forEach(domain => {
        const testsInDomain = tests.filter(t => t.domains.includes(domain));

        if (testsInDomain.length > 0) {
            const meanTScore = testsInDomain.reduce((sum, t) => sum + t.tScore, 0) / testsInDomain.length;
            const meanZScore = testsInDomain.reduce((sum, t) => sum + t.zScore, 0) / testsInDomain.length;
            const meanPercentile = testsInDomain.reduce((sum, t) => sum + t.percentile, 0) / testsInDomain.length;

            domainMeans[domain] = {
                count: testsInDomain.length,
                tScore: meanTScore,
                zScore: meanZScore,
                percentile: meanPercentile
            };
        }
    });

    return domainMeans;
}

// Data Table Generation
function generateDataTable() {
    const container = document.getElementById('dataTableContainer');
    const section = document.getElementById('dataTableSection');
    const domainMeansSection = document.getElementById('domainMeansSection');
    const domainMeansContainer = document.getElementById('domainMeansContainer');

    if (tests.length === 0) {
        alert('Please add tests first');
        return;
    }

    // Generate main tests table
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Test/Subtest</th>
                    <th>Raw Score</th>
                    <th>T-Score</th>
                    <th>Z-Score</th>
                    <th>Scaled Score</th>
                    <th>Standard Score</th>
                    <th>Percentile</th>
                    <th>Domains</th>
                </tr>
            </thead>
            <tbody>
    `;

    tests.forEach(test => {
        tableHTML += `
            <tr>
                <td>${test.name}</td>
                <td>${test.rawScore}</td>
                <td>${test.tScore.toFixed(1)}</td>
                <td>${test.zScore.toFixed(2)}</td>
                <td>${test.scaledScore.toFixed(1)}</td>
                <td>${test.standardScore.toFixed(1)}</td>
                <td>${test.percentile.toFixed(1)}%</td>
                <td>${test.domains.join(', ') || 'None'}</td>
            </tr>
        `;
    });

    tableHTML += '</tbody></table>';
    container.innerHTML = tableHTML;
    section.style.display = 'block';

    // Generate domain means table
    const domainMeans = calculateDomainMeans();

    if (Object.keys(domainMeans).length > 0) {
        let meansHTML = `
            <table class="domain-means-table">
                <thead>
                    <tr>
                        <th>Domain</th>
                        <th># Tests</th>
                        <th>Mean T-Score</th>
                        <th>Mean Z-Score</th>
                        <th>Mean Percentile</th>
                    </tr>
                </thead>
                <tbody>
        `;

        Object.entries(domainMeans).forEach(([domain, means]) => {
            meansHTML += `
                <tr class="domain-row">
                    <td>${domain}</td>
                    <td>${means.count}</td>
                    <td>${means.tScore.toFixed(1)}</td>
                    <td>${means.zScore.toFixed(2)}</td>
                    <td>${means.percentile.toFixed(1)}%</td>
                </tr>
            `;
        });

        meansHTML += '</tbody></table>';
        domainMeansContainer.innerHTML = meansHTML;
        domainMeansSection.style.display = 'block';
    }

    // Scroll to table
    section.scrollIntoView({ behavior: 'smooth' });
}

// Graph Generation
function generateGraph(type) {
    if (tests.length === 0) {
        alert('Please add tests first');
        return;
    }

    const section = document.getElementById('graphSection');
    const canvas = document.getElementById('assessmentChart');
    const ctx = canvas.getContext('2d');

    // Destroy existing chart
    if (currentChart) {
        currentChart.destroy();
    }

    const patientName = document.getElementById('patientName').value || 'Patient';
    const premorbidScore = document.getElementById('premorbidScore').value;
    const overallScore = document.getElementById('overallScore').value;

    // Prepare data
    const labels = tests.map(t => t.name);
    const percentiles = tests.map(t => t.percentile);
    const tScores = tests.map(t => t.tScore);

    let chartConfig = {
        type: type === 'profile' ? 'line' : type,
        data: {
            labels: labels,
            datasets: [{
                label: `${patientName}'s Percentiles`,
                data: percentiles,
                borderColor: '#667eea',
                backgroundColor: type === 'bar' ? 'rgba(102, 126, 234, 0.6)' : 'rgba(102, 126, 234, 0.1)',
                borderWidth: 2,
                fill: type === 'line' || type === 'profile',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `${patientName}'s Cognitive Assessment Profile`,
                    font: { size: 18, weight: 'bold' }
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Percentile'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Tests'
                    },
                    ticks: {
                        autoSkip: false,
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            }
        }
    };

    // Add reference lines if provided
    if (premorbidScore) {
        const premorbidPercentile = ScoreConverter.toPercentile(parseFloat(premorbidScore), 't');
        chartConfig.options.plugins.annotation = chartConfig.options.plugins.annotation || {};
        chartConfig.data.datasets.push({
            label: `Premorbid Estimate (${premorbidPercentile.toFixed(1)}%)`,
            data: Array(labels.length).fill(premorbidPercentile),
            borderColor: '#dc3545',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0
        });
    }

    if (overallScore) {
        const overallPercentile = ScoreConverter.toPercentile(parseFloat(overallScore), 't');
        chartConfig.data.datasets.push({
            label: `Overall Battery (${overallPercentile.toFixed(1)}%)`,
            data: Array(labels.length).fill(overallPercentile),
            borderColor: '#28a745',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0
        });
    }

    // Special styling for profile plot
    if (type === 'profile') {
        chartConfig.data.datasets[0].borderWidth = 3;
        chartConfig.data.datasets[0].pointRadius = 6;
        chartConfig.data.datasets[0].pointHoverRadius = 8;
        chartConfig.data.datasets[0].pointBackgroundColor = '#667eea';
        chartConfig.data.datasets[0].pointBorderColor = '#fff';
        chartConfig.data.datasets[0].pointBorderWidth = 2;
    }

    currentChart = new Chart(ctx, chartConfig);
    section.style.display = 'block';
    section.scrollIntoView({ behavior: 'smooth' });
}

// Export Functions
function exportToImage() {
    if (!currentChart) {
        alert('Please generate a graph first');
        return;
    }

    const canvas = document.getElementById('assessmentChart');
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    const patientName = document.getElementById('patientName').value || 'Patient';
    link.download = `${patientName}_Assessment_Graph.png`;
    link.href = url;
    link.click();
}

function exportTableToHTML() {
    const container = document.getElementById('dataTableContainer');

    if (!container.innerHTML) {
        alert('Please generate a data table first');
        return;
    }

    const patientName = document.getElementById('patientName').value || 'Patient';
    const assessmentDate = document.getElementById('assessmentDate').value || new Date().toLocaleDateString();

    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>${patientName} - Neuropsychological Assessment</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #667eea; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th { background: #667eea; color: white; padding: 12px; text-align: left; }
        td { padding: 12px; border-bottom: 1px solid #ddd; }
        tr:hover { background: #f5f5f5; }
        .domain-row { background: #e7e7ff; font-weight: bold; }
        .info { margin: 20px 0; }
    </style>
</head>
<body>
    <h1>Neuropsychological Assessment Report</h1>
    <div class="info">
        <p><strong>Patient:</strong> ${patientName}</p>
        <p><strong>Assessment Date:</strong> ${assessmentDate}</p>
    </div>
    ${container.innerHTML}
    ${document.getElementById('domainMeansContainer').innerHTML}
</body>
</html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${patientName}_Assessment_Table.html`;
    link.href = url;
    link.click();
}

function clearAll() {
    if (confirm('Clear all data? This cannot be undone.')) {
        domains = [];
        tests = [];

        document.getElementById('patientName').value = '';
        document.getElementById('assessmentDate').value = '';
        document.getElementById('premorbidScore').value = '';
        document.getElementById('overallScore').value = '';

        updateDomainsDisplay();
        updateDomainCheckboxes();
        updateTestsDisplay();

        document.getElementById('dataTableSection').style.display = 'none';
        document.getElementById('graphSection').style.display = 'none';
        document.getElementById('domainMeansSection').style.display = 'none';

        if (currentChart) {
            currentChart.destroy();
            currentChart = null;
        }
    }
}

function updateScoreInput() {
    const scoreType = document.getElementById('scoreType').value;
    const scoreInput = document.getElementById('standardScore');

    const placeholders = {
        't': 'e.g., 50 (mean)',
        'z': 'e.g., 0 (mean)',
        'scaled': 'e.g., 10 (mean)',
        'standard': 'e.g., 100 (mean)',
        'percentile': 'e.g., 50'
    };

    scoreInput.placeholder = placeholders[scoreType];
}

// Initialize with common neuropsych domains
function initializeDefaultDomains() {
    const defaultDomains = [
        'Attention',
        'Processing Speed',
        'Verbal Reasoning',
        'Visual Reasoning',
        'Verbal Memory',
        'Visual Memory',
        'Executive Functions',
        'Language'
    ];

    domains = defaultDomains;
    updateDomainsDisplay();
    updateDomainCheckboxes();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set today's date
    document.getElementById('assessmentDate').valueAsDate = new Date();

    // Initialize with default domains
    initializeDefaultDomains();
});
