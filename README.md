# Neuropsychological Assessment Calculator & Grapher

A comprehensive, flexible web-based tool for neuropsychological assessment scoring, data visualization, and report generation.

## Features

### 🎯 Core Functionality

- **150+ Test Library**: Browse and search from over 150 common neuropsychological tests organized by domain
- **Collapsible Hierarchy**: Modern nested UI showing Domains → Parent Tests → Subtests
- **8 Pre-Made Templates**: Quick-load complete test batteries for common referral questions
- **Custom Templates**: Save your own assessment batteries for reuse
- **Flexible Test Entry**: Manual entry or quick-add from library
- **Multiple Score Types**: Support for T-scores, Z-scores, Scaled scores, Standard scores, and Percentiles
- **Automatic Conversions**: Seamlessly converts between all score types using statistical formulas
- **N/A Handling**: Support for missing data with `--` or `n/a` (excluded from calculations)
- **Qualitative Data**: Add error counts, observations, and notes (table-only, not graphed)
- **Raw Score Tracking**: Option to record raw scores alongside standardized scores
- **Multi-Domain Support**: Assign tests to multiple cognitive domains simultaneously
- **Parent-Child Relationships**: Organize subtests under parent test names with visual hierarchy

### 📊 Data Visualization

Three graph types available:
- **Line Graph**: Traditional profile plot showing performance across tests
- **Bar Chart**: Vertical bar representation of test scores
- **Profile Plot**: Enhanced line graph with data point markers

**NEW: Color-Coded Performance Ranges**
- Background bands showing 7 performance levels:
  - Extremely Low (0-2%ile) - Red
  - Borderline/Low (2-9%ile) - Orange
  - Low Average (9-25%ile) - Yellow
  - Average (25-75%ile) - Green
  - High Average (75-91%ile) - Teal
  - Superior (91-98%ile) - Blue
  - Very Superior (98-100%ile) - Purple
- Data points colored by performance level
- Tooltips show performance descriptors
- N/A values automatically excluded from graphs

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
- Test/Subtest names with parent test hierarchy
- Raw scores
- Percentiles with performance descriptors
- T-scores
- Scaled scores
- **Qualitative data column** (errors, observations)
- Domain assignments
- **Color-coded rows** by performance level
- Domain mean calculations (excluding N/A values)
- Performance summaries for each domain

### 💾 Export Options

- **Export Graphs**: Save charts as PNG images for reports
- **Export Tables**: Download data tables as standalone HTML files
- **Print-Ready**: All outputs formatted for professional reports

### 📚 Test Library

**150+ Tests Organized by Domain:**
- Attention & Working Memory (WAIS-IV, WMS-IV, D-KEFS, CPT-3, TOVA, NEPSY-II)
- Processing Speed (WAIS-IV, WISC-V, D-KEFS, WJ-IV COG)
- Verbal Reasoning (WAIS-IV, WISC-V, WASI-II, WJ-IV COG)
- Visual-Spatial Reasoning (WAIS-IV, WISC-V, NEPSY-II, Hooper, Benton JLO)
- Verbal Memory (CVLT-3, RAVLT, WMS-IV, HVLT-R, WRAML-2, NEPSY-II)
- Visual Memory (RCFT, BVMT-R, WMS-IV, WRAML-2, NEPSY-II)
- Executive Functions (D-KEFS, WCST, Stroop, TMT, BRIEF-A, NEPSY-II)
- Language (Boston Naming, Token Test, PPVT, CELF-5, WAB-R, NEPSY-II)
- Motor Functions (Grooved Pegboard, Finger Tapping, Purdue Pegboard, NEPSY-II)
- Mood & Personality (MMPI-2-RF, PAI, BDI-II, BAI, STAI, PCL-5)
- Adaptive Functioning (Vineland-3, ABAS-3)
- Achievement (WRAT-5, WJ-IV ACH, WIAT-4)
- Premorbid Functioning (TOPF, WTAR, NART, Barona)
- Symptom Validity (TOMM, RDS, VSVT, MSVT, Green's WMT)

**Features:**
- Searchable library with live filtering
- Collapsible sections for easy navigation
- One-click addition to assessment
- Automatic domain assignment

### 🎯 Assessment Templates

**8 Pre-Configured Batteries:**

1. **Comprehensive Adult Battery** (16 tests)
   - Full WAIS-IV core + WMS-IV + D-KEFS + Boston Naming

2. **Memory-Focused Assessment** (10 tests)
   - CVLT-3 complete + RCFT + Digit Span

3. **Executive Function Battery** (10 tests)
   - D-KEFS verbal fluency + TMT + Stroop + WCST

4. **ADHD Evaluation** (11 tests)
   - CPT-3 complete + Processing Speed + Executive Functions

5. **Dementia Screening** (9 tests)
   - Memory + Language + Executive + Reasoning

6. **TBI Assessment** (10 tests)
   - Attention + Speed + Memory + Executive Functions

7. **Learning Disability Evaluation** (10 tests)
   - Reasoning + Speed + Memory + Achievement (WRAT-5)

8. **Pediatric Comprehensive** (12 tests)
   - WISC-V + WRAML-2 + NEPSY-II Executive Functions

**Template Features:**
- One-click loading
- Tests added with N/A scores (you add actual scores)
- Save your own custom templates
- Templates stored in browser localStorage

## How to Use

### Quick Start Workflow

**Option A: Use a Template (Fastest)**
1. Enter patient information
2. Select a template from the dropdown (e.g., "Comprehensive Adult Battery")
3. Template loads all tests with N/A scores
4. Enter actual scores for each test
5. Generate tables and graphs

**Option B: Build from Test Library**
1. Enter patient information
2. Browse or search the Test Library
3. Click "+ Add" next to each test you want
4. Enter the score in the form
5. Generate tables and graphs

**Option C: Manual Entry (Most Flexible)**
1. Enter patient information
2. Manually add each test with all details
3. Generate tables and graphs

### Detailed Instructions

### 1. Patient Information
- Enter patient name and assessment date
- This information appears on graphs and exported reports

### 2. Choose Your Approach

**Using Templates:**
- Select from 8 pre-made batteries
- All tests added automatically with N/A placeholders
- Just fill in the scores
- Great for standardized evaluations

**Using Test Library:**
- Browse by domain (collapsible sections)
- Search for specific tests
- Click "+ Add" to pre-fill test entry form
- Enter score and click "Add Test to Assessment"
- Perfect for custom batteries

**Manual Entry:**
- Type test name directly
- Full control over every field
- Best for unique or unlisted tests

### 3. Enter Test Scores
For each test:
1. Enter the test/subtest name (e.g., "WAIS-IV Digit Span Forward")
2. **Optional:** Enter parent test name (e.g., "WAIS-IV")
3. **Optional:** Enter raw score (or `--` or `n/a` if not available)
4. **Optional:** Enter qualitative data (e.g., "3 perseverations", "false positives")
5. Select the score type you have (T-score, Z-score, etc.)
6. Enter the standardized score value (or `--` or `n/a` if test not administered)
7. Check which domain(s) this test belongs to
8. Click "Add Test to Assessment"

**Example 1: Complete Test Entry**
- Test: Block Design
- Parent Test: WAIS-IV
- Raw Score: 42
- Qualitative Data: (leave blank)
- Score Type: Scaled Score
- Standard Score: 12
- Domains: Visual Reasoning
- Result: App converts to all score types automatically!

**Example 2: N/A Test Entry**
- Test: Wisconsin Card Sorting Test
- Parent Test: WCST
- Raw Score: --
- Qualitative Data: "Patient refused"
- Score Type: Percentile
- Standard Score: n/a
- Domains: Executive Functions
- Result: Test appears in table, excluded from graphs and calculations

**Example 3: Qualitative Data Only**
- Test: CVLT-3 Intrusions
- Parent Test: CVLT-3
- Raw Score: 8
- Qualitative Data: "8 total intrusions across trials"
- Score Type: Percentile
- Standard Score: n/a
- Domains: Verbal Memory
- Result: Intrusion count shown in table for clinical notes

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
├── styles.css       # Professional styling and UI components
├── script.js        # Core functionality, score conversions, templates
├── testLibrary.js   # 150+ test database with performance ranges
├── MNBGraph.py      # Original Python version (legacy)
└── README.md        # This comprehensive guide
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

## Recently Added (Version 2.0)

✅ 150+ test library with searchable database
✅ 8 pre-made assessment templates
✅ Custom template save/load functionality
✅ Color-coded performance ranges on graphs
✅ N/A value handling in calculations
✅ Qualitative data fields
✅ Parent-child test hierarchy
✅ Collapsible UI navigation
✅ Domain-based color coding in tables
✅ Performance descriptors throughout

## Future Enhancements (Planned for Version 3.0)

### Next Priority: Automated Report Writing
- **Generate narrative test results** based on scores and performance ranges
- **Domain-by-domain write-ups** with standardized clinical descriptions
- **Performance-based templates**:
  - "Performance on tasks of auditory attention and working memory (Digit Span) fell in the below average range (7th percentile)..."
- **Error analysis integration**: Include qualitative observations in narratives
- **Customizable report sections**
- **Copy-to-clipboard functionality** for easy pasting into reports

### Additional Planned Features
- Save/load complete assessment sessions
- PDF export with graphs and narratives
- Additional graph types (radar charts, normative comparison bands)
- Custom color schemes
- Age and education-based normative corrections
- Base rate information by diagnosis
- Confidence intervals on scores
- Test-retest change calculator

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
