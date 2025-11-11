// Global state
let domains = [];
let tests = [];
let currentChart = null;
let customTemplates = JSON.parse(localStorage.getItem('customTemplates') || '{}');

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

// Helper function to check if value is N/A
function isNotAvailable(value) {
    if (value === null || value === undefined) return true;
    const str = String(value).trim().toLowerCase();
    return str === '' || str === 'n/a' || str === 'na' || str === '--' || str === 'null';
}

// Test Management
function addTest(testName, parentTest, domains, rawScore, scoreType, standardScore, qualitativeData) {
    // Support both programmatic and UI-based calls
    if (typeof testName === 'undefined') {
        testName = document.getElementById('testName').value.trim();
        parentTest = document.getElementById('parentTest').value.trim();
        rawScore = document.getElementById('rawScore').value.trim();
        scoreType = document.getElementById('scoreType').value;
        standardScore = document.getElementById('standardScore').value.trim();
        qualitativeData = document.getElementById('qualitativeData').value.trim();

        // Get selected domains from checkboxes
        domains = [];
        window.domains.forEach(domain => {
            const checkbox = document.getElementById(`domain-${domain}`);
            if (checkbox && checkbox.checked) {
                domains.push(domain);
            }
        });
    }

    if (!testName) {
        alert('Please enter a test name');
        return false;
    }

    // Check if score is N/A
    const scoreIsNA = isNotAvailable(standardScore);

    let zScore, tScore, percentile, scaledScore, standardScoreConverted;
    let performanceRange = null;

    if (!scoreIsNA) {
        const numScore = parseFloat(standardScore);
        if (isNaN(numScore)) {
            alert('Please enter a valid standard score or use "n/a" or "--"');
            return false;
        }

        // Convert scores
        zScore = ScoreConverter.toZScore(numScore, scoreType);
        tScore = ScoreConverter.fromZScore(zScore, 't');
        percentile = ScoreConverter.zToPercentile(zScore);
        scaledScore = ScoreConverter.fromZScore(zScore, 'scaled');
        standardScoreConverted = ScoreConverter.fromZScore(zScore, 'standard');
        performanceRange = getPerformanceRange(percentile);
    } else {
        // Set all scores to null for N/A values
        zScore = null;
        tScore = null;
        percentile = null;
        scaledScore = null;
        standardScoreConverted = null;
    }

    const test = {
        id: Date.now() + Math.random(), // More unique ID
        name: testName,
        parentTest: parentTest || null,
        rawScore: rawScore || 'N/A',
        qualitativeData: qualitativeData || null,
        scoreType: scoreType,
        originalScore: scoreIsNA ? null : parseFloat(standardScore),
        zScore: zScore,
        tScore: tScore,
        percentile: percentile,
        scaledScore: scaledScore,
        standardScore: standardScoreConverted,
        domains: domains || [],
        performanceRange: performanceRange,
        isNA: scoreIsNA
    };

    tests.push(test);

    // Clear form if called from UI
    if (typeof arguments[0] === 'undefined') {
        document.getElementById('testName').value = '';
        document.getElementById('parentTest').value = '';
        document.getElementById('rawScore').value = '';
        document.getElementById('standardScore').value = '';
        document.getElementById('qualitativeData').value = '';

        // Uncheck all domain checkboxes
        window.domains.forEach(domain => {
            const checkbox = document.getElementById(`domain-${domain}`);
            if (checkbox) checkbox.checked = false;
        });
    }

    updateTestsDisplay();
    return true;
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

        const hasParent = test.parentTest && test.parentTest.trim() !== '';
        const itemClass = hasParent ? 'test-item has-parent' : 'test-item';

        return `
            <div class="${itemClass}">
                ${hasParent ? `<div class="parent-indicator">↳ ${test.parentTest}</div>` : ''}
                <div class="test-item-header">
                    <span class="test-name">${test.name}</span>
                    <button class="test-delete" onclick="removeTest(${test.id})">Delete</button>
                </div>
                ${test.isNA ? `
                    <div class="test-details">
                        <div class="test-detail">
                            <span class="test-detail-label">Raw Score:</span>
                            <span class="test-detail-value">${test.rawScore}</span>
                        </div>
                        <div class="test-detail">
                            <span class="test-detail-label">Score:</span>
                            <span class="test-detail-value">N/A</span>
                        </div>
                        ${test.qualitativeData ? `
                            <div class="test-detail">
                                <span class="test-detail-label">Qualitative:</span>
                                <span class="test-detail-value">${test.qualitativeData}</span>
                            </div>
                        ` : ''}
                    </div>
                ` : `
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
                            <span class="test-detail-label">Percentile:</span>
                            <span class="test-detail-value">${test.percentile.toFixed(1)}% (${test.performanceRange ? test.performanceRange.label : 'N/A'})</span>
                        </div>
                        <div class="test-detail">
                            <span class="test-detail-label">T-Score:</span>
                            <span class="test-detail-value">${test.tScore.toFixed(1)}</span>
                        </div>
                        <div class="test-detail">
                            <span class="test-detail-label">Z-Score:</span>
                            <span class="test-detail-value">${test.zScore.toFixed(2)}</span>
                        </div>
                        <div class="test-detail">
                            <span class="test-detail-label">Scaled Score:</span>
                            <span class="test-detail-value">${test.scaledScore.toFixed(1)}</span>
                        </div>
                        ${test.qualitativeData ? `
                            <div class="test-detail">
                                <span class="test-detail-label">Qualitative:</span>
                                <span class="test-detail-value">${test.qualitativeData}</span>
                            </div>
                        ` : ''}
                    </div>
                `}
                ${test.domains.length > 0 ? `
                    <div class="test-domains">
                        ${test.domains.map(d => `<span class="test-domain-tag">${d}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

// Calculate domain means (excluding N/A values)
function calculateDomainMeans() {
    const domainMeans = {};

    domains.forEach(domain => {
        const testsInDomain = tests.filter(t => t.domains.includes(domain) && !t.isNA);

        if (testsInDomain.length > 0) {
            const meanTScore = testsInDomain.reduce((sum, t) => sum + t.tScore, 0) / testsInDomain.length;
            const meanZScore = testsInDomain.reduce((sum, t) => sum + t.zScore, 0) / testsInDomain.length;
            const meanPercentile = testsInDomain.reduce((sum, t) => sum + t.percentile, 0) / testsInDomain.length;

            domainMeans[domain] = {
                count: testsInDomain.length,
                totalTests: tests.filter(t => t.domains.includes(domain)).length,
                tScore: meanTScore,
                zScore: meanZScore,
                percentile: meanPercentile,
                performanceRange: getPerformanceRange(meanPercentile)
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
                    <th>Parent Test</th>
                    <th>Raw Score</th>
                    <th>Percentile</th>
                    <th>Performance</th>
                    <th>T-Score</th>
                    <th>Scaled</th>
                    <th>Qualitative Data</th>
                    <th>Domains</th>
                </tr>
            </thead>
            <tbody>
    `;

    tests.forEach(test => {
        let perfClass = '';
        let perfLabel = 'N/A';

        if (!test.isNA && test.performanceRange) {
            perfLabel = test.performanceRange.label;
            if (perfLabel.includes('Extremely Low')) perfClass = 'perf-extremely-low';
            else if (perfLabel.includes('Borderline') || perfLabel.includes('Low')) perfClass = 'perf-low';
            else if (perfLabel.includes('Low Average')) perfClass = 'perf-low-avg';
            else if (perfLabel === 'Average') perfClass = 'perf-average';
            else if (perfLabel.includes('High Average')) perfClass = 'perf-high-avg';
            else if (perfLabel === 'Superior') perfClass = 'perf-superior';
            else if (perfLabel.includes('Very Superior')) perfClass = 'perf-very-superior';
        }

        tableHTML += `
            <tr class="${perfClass}">
                <td><strong>${test.name}</strong></td>
                <td>${test.parentTest || '--'}</td>
                <td>${test.rawScore}</td>
                <td>${test.isNA ? 'N/A' : test.percentile.toFixed(1) + '%'}</td>
                <td>${perfLabel}</td>
                <td>${test.isNA ? 'N/A' : test.tScore.toFixed(1)}</td>
                <td>${test.isNA ? 'N/A' : test.scaledScore.toFixed(1)}</td>
                <td class="qualitative-col">${test.qualitativeData || '--'}</td>
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
            let perfClass = '';
            const perfLabel = means.performanceRange ? means.performanceRange.label : 'N/A';

            if (means.performanceRange) {
                if (perfLabel.includes('Extremely Low')) perfClass = 'perf-extremely-low';
                else if (perfLabel.includes('Borderline') || perfLabel.includes('Low')) perfClass = 'perf-low';
                else if (perfLabel.includes('Low Average')) perfClass = 'perf-low-avg';
                else if (perfLabel === 'Average') perfClass = 'perf-average';
                else if (perfLabel.includes('High Average')) perfClass = 'perf-high-avg';
                else if (perfLabel === 'Superior') perfClass = 'perf-superior';
                else if (perfLabel.includes('Very Superior')) perfClass = 'perf-very-superior';
            }

            meansHTML += `
                <tr class="domain-row ${perfClass}">
                    <td><strong>${domain}</strong></td>
                    <td>${means.count} of ${means.totalTests}</td>
                    <td>${means.tScore.toFixed(1)}</td>
                    <td>${means.zScore.toFixed(2)}</td>
                    <td>${means.percentile.toFixed(1)}% (${perfLabel})</td>
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

    // Prepare data (exclude N/A values from graph)
    const validTests = tests.filter(t => !t.isNA);

    if (validTests.length === 0) {
        alert('No valid test scores to graph. Please add tests with numeric scores.');
        return;
    }

    const labels = validTests.map(t => t.name);
    const percentiles = validTests.map(t => t.percentile);
    const tScores = validTests.map(t => t.tScore);

    // Create point background colors based on performance ranges
    const pointColors = validTests.map(t => t.performanceRange ? t.performanceRange.color : '#667eea');
    const pointBgColors = validTests.map(t => t.performanceRange ? t.performanceRange.bgColor : 'rgba(102, 126, 234, 0.1)');

    // Create plugin for performance range backgrounds
    const performanceBackgroundPlugin = {
        id: 'performanceBackground',
        beforeDraw: (chart) => {
            const ctx = chart.ctx;
            const chartArea = chart.chartArea;
            const yAxis = chart.scales.y;

            // Draw background bands for performance ranges
            PerformanceRanges.forEach(range => {
                const yTop = yAxis.getPixelForValue(range.max);
                const yBottom = yAxis.getPixelForValue(range.min);

                ctx.fillStyle = range.bgColor;
                ctx.fillRect(
                    chartArea.left,
                    yTop,
                    chartArea.right - chartArea.left,
                    yBottom - yTop
                );
            });
        }
    };

    let chartConfig = {
        type: type === 'profile' ? 'line' : type,
        data: {
            labels: labels,
            datasets: [{
                label: `${patientName}'s Percentiles`,
                data: percentiles,
                borderColor: '#667eea',
                backgroundColor: type === 'bar' ? pointColors : 'rgba(102, 126, 234, 0.1)',
                borderWidth: 2,
                fill: type === 'line' || type === 'profile',
                tension: 0.4,
                pointBackgroundColor: pointColors,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
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
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const test = validTests[context.dataIndex];
                            return test.performanceRange ? test.performanceRange.label : '';
                        }
                    }
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
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
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
                    },
                    grid: {
                        display: false
                    }
                }
            }
        },
        plugins: [performanceBackgroundPlugin]
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

// Test Library Browser Functions
function renderTestLibrary() {
    const container = document.getElementById('testLibraryBrowser');

    let html = '';
    Object.entries(TestLibrary).forEach(([domainName, tests]) => {
        const domainId = domainName.replace(/\s+/g, '-').replace(/&/g, 'and');

        html += `
            <div class="domain-section">
                <div class="domain-header" onclick="toggleSection('${domainId}')">
                    <span>${domainName}</span>
                    <span class="toggle-icon">▼</span>
                </div>
                <div id="${domainId}" class="parent-tests collapsed-content">
        `;

        Object.entries(tests).forEach(([parentTest, data]) => {
            const parentId = `${domainId}-${parentTest.replace(/\s+/g, '-')}`;

            html += `
                <div class="parent-test-item">
                    <div class="parent-test-header" onclick="toggleSection('${parentId}')">
                        <span>${parentTest}</span>
                        <span class="toggle-icon">▼</span>
                    </div>
                    <div id="${parentId}" class="subtests-list collapsed-content">
            `;

            data.subtests.forEach(subtest => {
                html += `
                    <div class="subtest-item">
                        <span class="subtest-name">${subtest}</span>
                        <button class="add-test-btn" onclick="addTestFromLibrary('${subtest}', '${parentTest}', '${domainName}')">
                            + Add
                        </button>
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const header = section.previousElementSibling;

    if (section.classList.contains('show')) {
        section.classList.remove('show');
        header.classList.add('collapsed');
    } else {
        section.classList.add('show');
        header.classList.remove('collapsed');
    }
}

function filterTestLibrary() {
    const searchTerm = document.getElementById('librarySearch').value.toLowerCase();
    const allItems = document.querySelectorAll('.subtest-item, .parent-test-item, .domain-section');

    if (searchTerm === '') {
        // Reset all
        allItems.forEach(item => item.style.display = '');
        document.querySelectorAll('.collapsed-content').forEach(el => el.classList.remove('show'));
        document.querySelectorAll('.domain-header, .parent-test-header').forEach(el => el.classList.add('collapsed'));
        return;
    }

    // Hide all initially
    document.querySelectorAll('.subtest-item').forEach(item => item.style.display = 'none');
    document.querySelectorAll('.parent-test-item').forEach(item => item.style.display = 'none');
    document.querySelectorAll('.domain-section').forEach(item => item.style.display = 'none');

    // Show matching items
    document.querySelectorAll('.subtest-name').forEach(nameEl => {
        if (nameEl.textContent.toLowerCase().includes(searchTerm)) {
            const subtestItem = nameEl.closest('.subtest-item');
            const parentItem = subtestItem.closest('.parent-test-item');
            const domainSection = parentItem.closest('.domain-section');

            subtestItem.style.display = '';
            parentItem.style.display = '';
            domainSection.style.display = '';

            // Expand to show matches
            const subtestsList = subtestItem.closest('.subtests-list');
            const parentTests = parentItem.closest('.parent-tests');
            subtestsList.classList.add('show');
            parentTests.classList.add('show');
        }
    });
}

function addTestFromLibrary(testName, parentTest, domainName) {
    // Map domain names from library to our domain list
    const domainMapping = {
        'Attention & Working Memory': 'Attention',
        'Processing Speed': 'Processing Speed',
        'Verbal Reasoning & Comprehension': 'Verbal Reasoning',
        'Visual-Spatial & Reasoning': 'Visual Reasoning',
        'Verbal Memory': 'Verbal Memory',
        'Visual Memory': 'Visual Memory',
        'Executive Functions': 'Executive Functions',
        'Language': 'Language',
        'Motor Functions': 'Motor Functions',
        'Mood & Personality': 'Mood & Personality',
        'Adaptive/Daily Functioning': 'Adaptive Functioning',
        'Achievement': 'Achievement',
        'Premorbid Functioning': 'Premorbid Functioning',
        'Symptom Validity': 'Symptom Validity'
    };

    const mappedDomain = domainMapping[domainName] || domainName;

    // Add domain if it doesn't exist
    if (!domains.includes(mappedDomain)) {
        domains.push(mappedDomain);
        updateDomainsDisplay();
        updateDomainCheckboxes();
    }

    // Pre-fill the test entry form
    document.getElementById('testName').value = testName;
    document.getElementById('parentTest').value = parentTest;

    // Check the appropriate domain
    const checkbox = document.getElementById(`domain-${mappedDomain}`);
    if (checkbox) {
        checkbox.checked = true;
    }

    // Scroll to test entry section
    document.querySelector('#testName').scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.getElementById('testName').focus();
}

// Template Management Functions
const AssessmentTemplates = {
    comprehensive: {
        name: "Comprehensive Adult Battery",
        domains: ["Attention", "Processing Speed", "Verbal Reasoning", "Visual Reasoning", "Verbal Memory", "Visual Memory", "Executive Functions", "Language"],
        tests: [
            { name: "Digit Span Forward", parent: "WAIS-IV", domain: "Attention" },
            { name: "Digit Span Backward", parent: "WAIS-IV", domain: "Attention" },
            { name: "Digit Span Sequencing", parent: "WAIS-IV", domain: "Attention" },
            { name: "Coding", parent: "WAIS-IV", domain: "Processing Speed" },
            { name: "Symbol Search", parent: "WAIS-IV", domain: "Processing Speed" },
            { name: "Similarities", parent: "WAIS-IV", domain: "Verbal Reasoning" },
            { name: "Vocabulary", parent: "WAIS-IV", domain: "Verbal Reasoning" },
            { name: "Block Design", parent: "WAIS-IV", domain: "Visual Reasoning" },
            { name: "Matrix Reasoning", parent: "WAIS-IV", domain: "Visual Reasoning" },
            { name: "Logical Memory I - Immediate", parent: "WMS-IV", domain: "Verbal Memory" },
            { name: "Logical Memory II - Delayed", parent: "WMS-IV", domain: "Verbal Memory" },
            { name: "Visual Reproduction I - Immediate", parent: "WMS-IV", domain: "Visual Memory" },
            { name: "Visual Reproduction II - Delayed", parent: "WMS-IV", domain: "Visual Memory" },
            { name: "Trail Making Test - Part B", parent: "D-KEFS", domain: "Executive Functions" },
            { name: "Verbal Fluency - Letter Fluency", parent: "D-KEFS", domain: "Executive Functions" },
            { name: "Boston Naming Test", parent: "Boston Naming Test", domain: "Language" }
        ]
    },
    memory: {
        name: "Memory-Focused Assessment",
        domains: ["Verbal Memory", "Visual Memory", "Attention"],
        tests: [
            { name: "Trial 1", parent: "CVLT-3", domain: "Verbal Memory" },
            { name: "Trial 5", parent: "CVLT-3", domain: "Verbal Memory" },
            { name: "List A Total (1-5)", parent: "CVLT-3", domain: "Verbal Memory" },
            { name: "Short-Delay Free Recall", parent: "CVLT-3", domain: "Verbal Memory" },
            { name: "Long-Delay Free Recall", parent: "CVLT-3", domain: "Verbal Memory" },
            { name: "Recognition Hits", parent: "CVLT-3", domain: "Verbal Memory" },
            { name: "Copy", parent: "RCFT", domain: "Visual Memory" },
            { name: "Immediate Recall", parent: "RCFT", domain: "Visual Memory" },
            { name: "Delayed Recall", parent: "RCFT", domain: "Visual Memory" },
            { name: "Digit Span Total", parent: "WAIS-IV", domain: "Attention" }
        ]
    },
    executive: {
        name: "Executive Function Battery",
        domains: ["Executive Functions", "Attention", "Processing Speed"],
        tests: [
            { name: "Trail Making Test - Part A", parent: "Trail Making Test", domain: "Processing Speed" },
            { name: "Trail Making Test - Part B", parent: "Trail Making Test", domain: "Executive Functions" },
            { name: "Verbal Fluency - Letter Fluency", parent: "D-KEFS", domain: "Executive Functions" },
            { name: "Verbal Fluency - Category Fluency", parent: "D-KEFS", domain: "Executive Functions" },
            { name: "Verbal Fluency - Category Switching", parent: "D-KEFS", domain: "Executive Functions" },
            { name: "Color-Word Interference - Inhibition", parent: "D-KEFS", domain: "Executive Functions" },
            { name: "Color-Word Interference - Inhibition/Switching", parent: "D-KEFS", domain: "Executive Functions" },
            { name: "Categories Completed", parent: "WCST", domain: "Executive Functions" },
            { name: "Perseverative Errors", parent: "WCST", domain: "Executive Functions" },
            { name: "Digit Span Backward", parent: "WAIS-IV", domain: "Attention" }
        ]
    },
    adhd: {
        name: "ADHD Evaluation",
        domains: ["Attention", "Processing Speed", "Executive Functions"],
        tests: [
            { name: "Omissions", parent: "CPT-3", domain: "Attention" },
            { name: "Commissions", parent: "CPT-3", domain: "Attention" },
            { name: "Hit RT", parent: "CPT-3", domain: "Attention" },
            { name: "Variability", parent: "CPT-3", domain: "Attention" },
            { name: "Detectability (d')", parent: "CPT-3", domain: "Attention" },
            { name: "Digit Span Total", parent: "WAIS-IV", domain: "Attention" },
            { name: "Coding", parent: "WAIS-IV", domain: "Processing Speed" },
            { name: "Symbol Search", parent: "WAIS-IV", domain: "Processing Speed" },
            { name: "Trail Making Test - Part A", parent: "Trail Making Test", domain: "Processing Speed" },
            { name: "Trail Making Test - Part B", parent: "Trail Making Test", domain: "Executive Functions" },
            { name: "Color-Word Interference - Inhibition", parent: "D-KEFS", domain: "Executive Functions" }
        ]
    },
    dementia: {
        name: "Dementia Screening",
        domains: ["Verbal Memory", "Visual Memory", "Language", "Executive Functions", "Visual Reasoning"],
        tests: [
            { name: "Logical Memory I - Immediate", parent: "WMS-IV", domain: "Verbal Memory" },
            { name: "Logical Memory II - Delayed", parent: "WMS-IV", domain: "Verbal Memory" },
            { name: "Delayed Recall", parent: "RCFT", domain: "Visual Memory" },
            { name: "Boston Naming Test", parent: "Boston Naming Test", domain: "Language" },
            { name: "Verbal Fluency - Letter Fluency", parent: "D-KEFS", domain: "Executive Functions" },
            { name: "Verbal Fluency - Category Fluency", parent: "D-KEFS", domain: "Executive Functions" },
            { name: "Trail Making Test - Part B", parent: "Trail Making Test", domain: "Executive Functions" },
            { name: "Block Design", parent: "WAIS-IV", domain: "Visual Reasoning" },
            { name: "Matrix Reasoning", parent: "WAIS-IV", domain: "Visual Reasoning" }
        ]
    },
    tbi: {
        name: "TBI Assessment",
        domains: ["Attention", "Processing Speed", "Verbal Memory", "Visual Memory", "Executive Functions"],
        tests: [
            { name: "Digit Span Total", parent: "WAIS-IV", domain: "Attention" },
            { name: "Coding", parent: "WAIS-IV", domain: "Processing Speed" },
            { name: "Symbol Search", parent: "WAIS-IV", domain: "Processing Speed" },
            { name: "Trail Making Test - Part A", parent: "Trail Making Test", domain: "Processing Speed" },
            { name: "Trail Making Test - Part B", parent: "Trail Making Test", domain: "Executive Functions" },
            { name: "Short-Delay Free Recall", parent: "CVLT-3", domain: "Verbal Memory" },
            { name: "Long-Delay Free Recall", parent: "CVLT-3", domain: "Verbal Memory" },
            { name: "Immediate Recall", parent: "RCFT", domain: "Visual Memory" },
            { name: "Delayed Recall", parent: "RCFT", domain: "Visual Memory" },
            { name: "Verbal Fluency - Letter Fluency", parent: "D-KEFS", domain: "Executive Functions" }
        ]
    },
    learning: {
        name: "Learning Disability Evaluation",
        domains: ["Verbal Reasoning", "Visual Reasoning", "Processing Speed", "Verbal Memory", "Achievement"],
        tests: [
            { name: "Similarities", parent: "WAIS-IV", domain: "Verbal Reasoning" },
            { name: "Vocabulary", parent: "WAIS-IV", domain: "Verbal Reasoning" },
            { name: "Block Design", parent: "WAIS-IV", domain: "Visual Reasoning" },
            { name: "Matrix Reasoning", parent: "WAIS-IV", domain: "Visual Reasoning" },
            { name: "Coding", parent: "WAIS-IV", domain: "Processing Speed" },
            { name: "Symbol Search", parent: "WAIS-IV", domain: "Processing Speed" },
            { name: "Logical Memory I - Immediate", parent: "WMS-IV", domain: "Verbal Memory" },
            { name: "Word Reading", parent: "WRAT-5", domain: "Achievement" },
            { name: "Spelling", parent: "WRAT-5", domain: "Achievement" },
            { name: "Math Computation", parent: "WRAT-5", domain: "Achievement" }
        ]
    },
    pediatric: {
        name: "Pediatric Comprehensive",
        domains: ["Attention", "Processing Speed", "Verbal Reasoning", "Visual Reasoning", "Verbal Memory", "Visual Memory", "Executive Functions"],
        tests: [
            { name: "Digit Span Forward", parent: "WISC-V", domain: "Attention" },
            { name: "Digit Span Backward", parent: "WISC-V", domain: "Attention" },
            { name: "Coding", parent: "WISC-V", domain: "Processing Speed" },
            { name: "Symbol Search", parent: "WISC-V", domain: "Processing Speed" },
            { name: "Similarities", parent: "WISC-V", domain: "Verbal Reasoning" },
            { name: "Vocabulary", parent: "WISC-V", domain: "Verbal Reasoning" },
            { name: "Block Design", parent: "WISC-V", domain: "Visual Reasoning" },
            { name: "Matrix Reasoning", parent: "WISC-V", domain: "Visual Reasoning" },
            { name: "Story Memory", parent: "WRAML-2", domain: "Verbal Memory" },
            { name: "Design Memory", parent: "WRAML-2", domain: "Visual Memory" },
            { name: "Inhibition - Inhibition", parent: "NEPSY-II", domain: "Executive Functions" },
            { name: "Inhibition - Switching", parent: "NEPSY-II", domain: "Executive Functions" }
        ]
    }
};

function loadTemplate() {
    const templateSelect = document.getElementById('templateSelect');
    const templateKey = templateSelect.value;

    if (!templateKey) return;

    const template = AssessmentTemplates[templateKey];

    if (!template) {
        alert('Template not found');
        return;
    }

    // Clear existing
    tests = [];
    domains = [];

    // Add domains
    template.domains.forEach(domain => {
        if (!domains.includes(domain)) {
            domains.push(domain);
        }
    });

    updateDomainsDisplay();
    updateDomainCheckboxes();

    // Add tests (without scores - user will add those)
    template.tests.forEach(testData => {
        // Pre-populate test entry form one at a time
        // This is just setting up the battery structure
        document.getElementById('testName').value = testData.name;
        document.getElementById('parentTest').value = testData.parent;

        // We'll add with N/A scores so they're in the battery but need scores
        addTest(testData.name, testData.parent, [testData.domain], 'N/A', 'percentile', 'N/A', null);
    });

    // Reset form
    document.getElementById('testName').value = '';
    document.getElementById('parentTest').value = '';

    alert(`${template.name} loaded! ${template.tests.length} tests added. Please enter scores for each test.`);
}

function saveCurrentAsTemplate() {
    const templateName = prompt('Enter a name for this template:');

    if (!templateName) return;

    const template = {
        name: templateName,
        domains: [...domains],
        tests: tests.map(t => ({
            name: t.name,
            parent: t.parentTest || '',
            domain: t.domains[0] || '',
            rawScore: t.rawScore,
            scoreType: t.scoreType,
            standardScore: t.originalScore,
            qualitativeData: t.qualitativeData
        }))
    };

    customTemplates[templateName] = template;
    localStorage.setItem('customTemplates', JSON.stringify(customTemplates));

    alert(`Template "${templateName}" saved! You can reload it from your browser's localStorage.`);
}

function clearTemplate() {
    if (confirm('Clear all tests? This cannot be undone.')) {
        clearAll();
    }
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

    // Render test library browser
    renderTestLibrary();
});
