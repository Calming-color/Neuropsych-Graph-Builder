# Neuropsychological Assessment Report Builder

A comprehensive tool for creating neuropsychological assessment reports with advanced graphing and data management capabilities.

## Features

### 📊 Comprehensive Test Library
- **150+ pre-defined neuropsychological tests** organized by domain
- Tests from major batteries: WAIS-IV, WMS-IV, CVLT-3, BVMT-R, NAB, TMT, WCST, D-KEFS, RCFT, and more
- Easy test selection via dropdown menus

### 🧠 15+ Cognitive Domains
- Premorbid Functioning
- General Cognitive
- Attention
- Processing Speed
- Executive Functioning
- Verbal Learning and Memory
- Visual Spatial Learning and Memory
- Language
- Visuospatial Functioning
- Motor Functioning
- Sensory Functioning
- Personality/Emotional Functioning
- IADL/Functional

### 📈 Multiple Norm Score Types
- **T-scores** (M=50, SD=10)
- **Standard Scores/SS** (M=100, SD=15)
- **Scaled Scores** (M=10, SD=3)
- **Z-scores** (M=0, SD=1)
- **Percentiles**
- Grade Equivalents (GE)
- Frequency scores
- Cumulative percentages
- Raw scores only

### 🎨 Advanced Graphing
1. **Individual Tests by Domain**
   - Bar graph of all tests
   - Grouped by cognitive domain
   - Color-coded by performance level

2. **Domain Averages**
   - Line graph connecting domain averages
   - Color-coded performance zones
   - Reference lines for premorbid and overall mean

3. **Combined View**
   - Both graphs in one display
   - Comprehensive visual overview

### 📋 AACN Qualitative Descriptors
Automatic classification of performance:
- **Exceptionally High** (>98th percentile)
- **Above Average** (91-97th percentile)
- **High Average** (75-90th percentile)
- **Average** (25-74th percentile)
- **Low Average** (9-24th percentile)
- **Below Average** (2-8th percentile)
- **Exceptionally Low** (<2nd percentile)

### 💾 Battery Management
- **Save batteries** for later use
- **Load batteries** from previous sessions
- **Create templates** of common test combinations
- **Quick reuse** of standard batteries
- JSON format for easy data exchange

### 📊 Domain Averages
- Automatic calculation of domain average percentiles
- Automatic calculation of domain average norm scores
- Display in tables and graphs
- Overall test battery mean calculation

### 🎯 Customizable Tables
- Choose which columns to display:
  - Raw scores
  - Norm types
  - Norm scores
  - Percentiles
  - AACN descriptors
  - Notes
- Professional formatting
- Copy to clipboard functionality

### 🌈 Color-Coded Performance Zones
- **Red**: <2nd percentile
- **Orange**: 2-8th percentile
- **Gold**: 9-24th percentile
- **Green**: 25-74th percentile
- **Light Blue**: 75-90th percentile
- **Blue**: 91-97th percentile
- **Dark Blue**: >98th percentile

## Installation

### Requirements
- Python 3.7 or higher
- matplotlib
- scipy
- tkinter (usually included with Python)

### Install Dependencies
```bash
pip install -r requirements.txt
```

## Usage

### Running the Application
```bash
python NeuropsychReportBuilder.py
```

### Quick Start Guide

#### 1. Enter Patient Information
- Enter patient name in the "Patient Information" section
- Optionally enter battery name
- Enter premorbid estimate if available

#### 2. Add Tests
1. Select a **Domain** from dropdown
2. Select a **Test** from the filtered test list
3. Enter test data:
   - Raw score (optional)
   - Norm type (T, SS, Scaled, Z, etc.)
   - Norm score
   - Percentile (auto-calculated if norm score provided)
   - Notes (optional)
4. Click **"Add Test"**
5. Repeat for all tests

#### 3. View Tests
- Tests appear in the tree view grouped by domain
- Domain averages calculated automatically
- Delete tests by selecting and clicking "Delete Selected"

#### 4. Generate Table
1. Switch to **"Table View"** tab
2. Select which columns to display
3. Click **"Generate Table"**
4. Copy to clipboard with **"Copy to Clipboard"** button

#### 5. Create Graphs
1. Switch to **"Graphs"** tab
2. Select graph type:
   - Individual Tests by Domain
   - Domain Averages
   - Combined View
3. Toggle options:
   - Show Color Zones
   - Show Premorbid Line
   - Show Overall Mean
4. Click **"Generate Graph"**

#### 6. Save Your Work
- **Battery > Save Battery**: Save current work
- **Battery > Save Battery As...**: Save with new name
- **Battery > Load Battery**: Load previous work
- **Battery > Save as Template**: Save as reusable template
- **Battery > Load Template**: Load template battery

## File Structure

```
Neuropsych-Graph-Builder/
├── MNBGraph.py                    # Original simple version
├── NeuropsychReportBuilder.py     # Enhanced full-featured version
├── requirements.txt               # Python dependencies
├── README_ENHANCED.md            # This file
└── battery_templates/            # Saved battery templates (auto-created)
```

## Example Workflow

### Creating a Comprehensive Neuropsych Report

1. **Start Application**
   ```bash
   python NeuropsychReportBuilder.py
   ```

2. **Enter Patient Info**
   - Patient Name: "John Doe"
   - Battery Name: "Comprehensive Assessment"
   - Premorbid: 94 (SS type)

3. **Add Tests by Domain**

   **Attention:**
   - WAIS-IV Digit Span: T=25, %ile=1

   **Processing Speed:**
   - WAIS-IV Coding: T=26, %ile=1
   - Trail Making Test A: T=37, %ile=10

   **Executive Functioning:**
   - Trail Making Test B: T=41, %ile=18
   - WCST 64 Total Errors: T=41, %ile=18

   **Verbal Memory:**
   - CVLT-3 Trials 1-5: T=20, %ile<1
   - CVLT-3 Short Delay Free: T=20, %ile<1

   **Visual Memory:**
   - BVMT-R Total Recall: T=22, %ile<1
   - BVMT-R Delayed Recall: T=19, %ile<1

4. **Generate Table**
   - All scores formatted with AACN descriptors
   - Domain averages calculated
   - Overall battery mean shown

5. **Create Graphs**
   - View individual test performance
   - See domain averages
   - Compare to premorbid functioning

6. **Save Battery**
   - Save for future reference
   - Create template for similar cases

## Tips & Best Practices

### Data Entry
- Enter norm scores when available - percentiles auto-calculate
- Use notes field for important qualifications (e.g., "Discontinued", "Invalid Range")
- Raw scores are optional but helpful for documentation

### Domains
- Tests automatically grouped by domain
- Domain averages calculate only from tests with valid percentiles
- Add tests in logical order for better organization

### Graphing
- Use "Individual Tests" view for detailed analysis
- Use "Domain Averages" for high-level overview
- Use "Combined View" for comprehensive reports
- Color zones help visualize performance patterns

### Battery Templates
- Save common test combinations as templates
- Load templates to quickly start new assessments
- Name templates descriptively (e.g., "Dementia Screening", "TBI Comprehensive")

### Table Customization
- Hide columns not needed for specific reports
- Include notes for clinical interpretation
- Copy table directly into clinical notes

## Comparison: Simple vs Enhanced Version

| Feature | MNBGraph.py | NeuropsychReportBuilder.py |
|---------|-------------|----------------------------|
| Test Library | No | 150+ tests |
| Domains | 8 fixed | 15+ customizable |
| Norm Types | T-scores only | T, SS, Scaled, Z, %ile, GE, etc. |
| Data Entry | Manual text fields | Dropdown selection |
| Domain Averages | No | Yes, automatic |
| AACN Descriptors | No | Yes |
| Table Generation | No | Yes, customizable |
| Battery Save/Load | No | Yes |
| Templates | No | Yes |
| Graph Types | 1 simple | 3 advanced |
| Color Coding | No | Yes |
| UI | Simple | Tabbed, professional |

## Troubleshooting

### Graph not displaying
- Ensure tests have percentile values
- Check that domain has valid tests
- Verify matplotlib is installed correctly

### Template not loading
- Check that `battery_templates/` directory exists
- Verify JSON file is not corrupted
- Ensure file has `.json` extension

### Percentile not calculating
- Verify norm score is entered
- Check that correct norm type is selected
- Ensure score is numeric

### Tests not appearing in tree
- Check that domain and test name are selected
- Verify "Add Test" button was clicked
- Ensure battery is not empty

## Advanced Features

### Custom Test Addition
To add tests not in the library:
1. Select appropriate domain
2. Manually type test name in test field
3. Enter scores and add normally

### Batch Entry
For multiple tests from same battery:
1. Select domain once
2. Add all tests from that domain
3. Switch to next domain

### Data Export
- Tables can be copied to clipboard
- Graphs can be saved as images (right-click on graph)
- Batteries save as JSON for data portability

## Support

For issues, questions, or feature requests:
- Check this README first
- Review example workflow above
- Verify all dependencies installed
- Check Python version compatibility

## Version History

### Version 2.0 (Enhanced)
- Added 150+ test library
- 15+ cognitive domains
- Multiple norm score types
- AACN qualitative descriptors
- Domain averages
- Battery save/load
- Template system
- Advanced graphing (3 types)
- Color-coded performance zones
- Customizable tables
- Professional tabbed UI

### Version 1.0 (Original)
- Basic T-score to percentile conversion
- Simple line graph
- 8 fixed domains
- Manual entry only

## License

Open source - feel free to modify and extend for your needs.

## Citation

If you use this tool in clinical work or research, please cite appropriately and ensure compliance with your institution's policies on clinical documentation tools.
