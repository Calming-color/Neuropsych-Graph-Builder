# Neuropsychological Assessment Calculator & Grapher

A comprehensive, flexible web-based tool for neuropsychological assessment scoring, data visualization, and report generation.

## Features

### 🎯 Core Functionality

- **Flexible Test Entry**: Add any neuropsychological test or subtest with custom names
- **Multiple Score Types**: Support for T-scores, Z-scores, Scaled scores, Standard scores, and Percentiles
- **Automatic Conversions**: Seamlessly converts between all score types using statistical formulas
- **Raw Score Tracking**: Option to record raw scores alongside standardized scores
- **Multi-Domain Support**: Assign tests to multiple cognitive domains simultaneously

### 📊 Data Visualization

Three graph types available:
- **Line Graph**: Traditional profile plot showing performance across tests
- **Bar Chart**: Vertical bar representation of test scores
- **Profile Plot**: Enhanced line graph with data point markers

All graphs include:
- Percentile-based visualization (0-100%)
- Optional reference lines for premorbid estimates
- Optional reference lines for overall battery performance
- Professional styling with customizable patient names

### 📈 Domain Analysis

- **Custom Domains**: Create and manage your own cognitive domains
- **Domain Means**: Automatically calculates mean T-scores, Z-scores, and percentiles for each domain
- **Multi-Domain Assignment**: Tests can belong to multiple domains (e.g., a working memory test in both "Attention" and "Memory" domains)
- **Domain Summary Table**: View comprehensive statistics for each domain

### 📋 Data Tables

Generate comprehensive tables showing:
- Test/Subtest names
- Raw scores
- T-scores
- Z-scores
- Scaled scores
- Standard scores
- Percentiles
- Domain assignments

### 💾 Export Options

- **Export Graphs**: Save charts as PNG images for reports
- **Export Tables**: Download data tables as standalone HTML files
- **Print-Ready**: All outputs formatted for professional reports

## How to Use

### 1. Patient Information
- Enter patient name and assessment date
- This information appears on graphs and exported reports

### 2. Set Up Domains
- The app comes with 8 default neuropsych domains (Attention, Processing Speed, etc.)
- Add custom domains using the "Add Domain" button
- Remove unwanted domains by clicking the × button

### 3. Enter Tests
For each test:
1. Enter the test/subtest name (e.g., "WAIS-IV Digit Span Forward")
2. Optionally enter the raw score
3. Select the score type you have (T-score, Z-score, etc.)
4. Enter the standardized score value
5. Check which domain(s) this test belongs to
6. Click "Add Test to Assessment"

**Example:**
- Test: WAIS-IV Block Design
- Raw Score: 42
- Score Type: Scaled Score
- Standard Score: 12
- Domains: Visual Reasoning, Processing Speed

The app automatically converts to all other score types!

### 4. Add Reference Lines (Optional)
- Enter a premorbid estimate T-score (e.g., from WTAR or demographics)
- Enter an overall battery T-score if available
- These appear as horizontal reference lines on graphs

### 5. Generate Outputs

#### Data Table
Click "Generate Data Table" to create:
- Comprehensive table with all tests and scores
- Domain means table showing average performance per domain

#### Graphs
Choose from three graph types:
- **Line Graph**: Clean profile view
- **Bar Chart**: Categorical comparison
- **Profile Plot**: Detailed line graph with markers

### 6. Export for Reports
- **Export Graph**: Saves current graph as PNG image
- **Export Table**: Saves tables as HTML file (can be opened in Word)

## Score Conversion Details

The app uses statistical formulas to convert between score types:

| Score Type | Mean | SD | Example |
|------------|------|-----|---------|
| T-Score | 50 | 10 | 40, 50, 60 |
| Z-Score | 0 | 1 | -1.0, 0.0, 1.0 |
| Scaled Score | 10 | 3 | 7, 10, 13 |
| Standard Score | 100 | 15 | 85, 100, 115 |
| Percentile | 50 | - | 16th, 50th, 84th |

**Conversion Example:**
- Input: T-Score of 40
- Converts to:
  - Z-Score: -1.0
  - Scaled Score: 7
  - Standard Score: 85
  - Percentile: 16th

## Use Cases

### Clinical Neuropsychology
- Comprehensive test batteries
- Domain-based interpretation
- Visual representation for patients/families
- Report-ready tables and graphs

### Research
- Standardized data visualization
- Cross-study comparisons
- Consistent scoring metrics

### Training
- Learn score conversions
- Practice profile interpretation
- Understand domain-based analysis

## Technical Details

### Browser Compatibility
- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- No installation required
- Runs entirely in the browser (no data sent to servers)

### Privacy
- All data stays on your device
- No cloud storage or external servers
- Refresh the page to clear all data (unless exported)

### Dependencies
- Chart.js 4.4.0 (for graphing, loaded from CDN)
- No other external dependencies

## File Structure

```
Neuropsych-Graph-Builder/
├── index.html       # Main application interface
├── styles.css       # Professional styling
├── script.js        # All functionality and score conversions
├── MNBGraph.py      # Original Python version (legacy)
└── README.md        # This file
```

## Quick Start

1. Open `index.html` in any web browser
2. Enter patient information
3. Add tests with scores
4. Generate tables and graphs
5. Export for your report

## Advanced Features

### Multi-Domain Tests
Some tests measure multiple constructs. For example:
- **Trail Making Test B**: Processing Speed + Executive Functions
- **Digit Span Backward**: Working Memory + Attention
- **Boston Naming Test**: Language + Semantic Memory

Simply check multiple domains when adding these tests!

### Domain Mean Calculations
The app calculates domain means by:
1. Identifying all tests assigned to each domain
2. Computing the arithmetic mean of their scores
3. Displaying means in T-score, Z-score, and percentile formats

This provides a summary score for each cognitive domain, useful for identifying patterns of strengths and weaknesses.

### Score Interpretation Guidelines

| Percentile | T-Score | Description | Frequency |
|------------|---------|-------------|-----------|
| >98% | >70 | Very Superior | 2% |
| 91-98% | 63-70 | Superior | 7% |
| 75-90% | 56-62 | High Average | 16% |
| 25-75% | 44-56 | Average | 50% |
| 9-24% | 37-43 | Low Average | 16% |
| 2-8% | 30-36 | Borderline | 7% |
| <2% | <30 | Impaired | 2% |

## Keyboard Shortcuts

- **Enter** in any input field: Advances to next logical step
- **Tab**: Navigate between fields
- **Escape**: Closes alerts/dialogs

## Tips for Best Results

1. **Consistent Scoring**: Use the same score type for all tests from a battery when possible
2. **Domain Organization**: Group tests logically (e.g., all memory tests together)
3. **Naming Convention**: Use clear, specific test names (e.g., "WAIS-IV Digit Span Forward" not just "Digit Span")
4. **Export Early**: Save your work by exporting tables/graphs before closing the browser
5. **Reference Lines**: Use premorbid estimates to show expected vs. actual performance

## Future Enhancements (Potential)

- Save/load assessment sessions
- Additional graph types (radar charts, normative bands)
- Custom color schemes
- PDF export
- Interpretation text generator
- Normative data lookup tables

## Support & Feedback

This tool is designed for flexibility and ease of use. If you encounter issues or have suggestions:
- Check that you're using a modern browser
- Ensure JavaScript is enabled
- Try refreshing the page for a clean start

## Credits

Created for clinical neuropsychologists, researchers, and trainees to streamline assessment scoring and visualization.

## License

Free for clinical, educational, and research use.

---

**Disclaimer**: This tool is for professional use by qualified neuropsychologists and trainees under supervision. It provides score conversions and visualizations but does not replace clinical judgment or comprehensive assessment interpretation.
