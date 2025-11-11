"""
Enhanced Neuropsychological Assessment Report Builder
Supports multiple tests, domains, batteries, and advanced graphing
"""

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import tkinter as tk
from tkinter import ttk, messagebox, filedialog, scrolledtext
from scipy.stats import norm
import json
import os
from datetime import datetime
from collections import defaultdict

# ============================================================================
# SCORE CONVERSION UTILITIES
# ============================================================================

class ScoreConverter:
    """Handles conversion between different norm score types and percentiles"""

    @staticmethod
    def to_percentile(score, norm_type):
        """Convert any norm score to percentile"""
        try:
            score = float(score)
            if norm_type == 'T':
                return norm.cdf(score, 50, 10) * 100
            elif norm_type == 'SS':
                return norm.cdf(score, 100, 15) * 100
            elif norm_type == 'Scaled':
                return norm.cdf(score, 10, 3) * 100
            elif norm_type == 'Z':
                return norm.cdf(score, 0, 1) * 100
            elif norm_type == 'Percentile':
                return score
            else:
                return None
        except:
            return None

    @staticmethod
    def from_percentile(percentile, norm_type):
        """Convert percentile to specified norm score"""
        try:
            percentile = float(percentile)
            if percentile <= 0:
                percentile = 0.01
            if percentile >= 100:
                percentile = 99.99

            if norm_type == 'T':
                return norm.ppf(percentile / 100, 50, 10)
            elif norm_type == 'SS':
                return norm.ppf(percentile / 100, 100, 15)
            elif norm_type == 'Scaled':
                return norm.ppf(percentile / 100, 10, 3)
            elif norm_type == 'Z':
                return norm.ppf(percentile / 100, 0, 1)
            elif norm_type == 'Percentile':
                return percentile
            else:
                return None
        except:
            return None

    @staticmethod
    def get_aacn_descriptor(percentile, norm_score=None, norm_type='T'):
        """Get AACN qualitative descriptor based on percentile or norm score"""
        if percentile is None and norm_score is not None:
            percentile = ScoreConverter.to_percentile(norm_score, norm_type)

        if percentile is None:
            return "--"

        if percentile >= 98:
            return "Exceptionally High"
        elif percentile >= 91:
            return "Above Average"
        elif percentile >= 75:
            return "High Average"
        elif percentile >= 25:
            return "Average"
        elif percentile >= 9:
            return "Low Average"
        elif percentile >= 2:
            return "Below Average"
        else:
            return "Exceptionally Low"

    @staticmethod
    def get_percentile_color(percentile):
        """Get color for percentile range"""
        if percentile is None:
            return '#CCCCCC'  # Gray for missing data
        elif percentile < 2:
            return '#FF4444'  # Red
        elif percentile < 9:
            return '#FFAA00'  # Orange/Yellow
        elif percentile < 25:
            return '#FFD700'  # Gold
        elif percentile < 75:
            return '#44FF44'  # Green
        elif percentile < 91:
            return '#66CCFF'  # Light Blue
        elif percentile < 98:
            return '#4444FF'  # Blue
        else:
            return '#0000AA'  # Dark Blue

# ============================================================================
# TEST LIBRARY
# ============================================================================

class TestLibrary:
    """Comprehensive library of neuropsychological tests organized by domain"""

    @staticmethod
    def get_all_tests():
        """Returns dictionary of all available tests organized by domain"""
        return {
            "Premorbid": [
                "WRAT-4 Reading",
                "WRAT-5 Word Reading",
                "TOPF",
                "NAART",
            ],
            "General Cognitive": [
                "MoCA",
                "MMSE",
                "SLUMS",
                "DRS-2 Total",
            ],
            "Attention": [
                "WAIS-IV Digit Span",
                "WAIS-IV LDSF",
                "WAIS-IV LDSB",
                "WAIS-IV LDSS",
                "WAIS-IV RDS",
                "WMS-IV Spatial Addition",
                "NAB Digits Forward",
                "NAB Digits Backward",
                "CPT-3 Omissions",
                "CPT-3 Commissions",
                "Test of Everyday Attention",
            ],
            "Processing Speed": [
                "WAIS-IV Coding",
                "WAIS-IV Symbol Search",
                "Trail Making Test A",
                "Trail Making Test A errors",
                "Stroop Color",
                "Stroop Word",
                "NAB Psychomotor Speed",
            ],
            "Executive Functioning": [
                "Trail Making Test B",
                "Trail Making Test B errors",
                "WCST 64 Total Errors",
                "WCST 64 Perseverative Responses",
                "WCST 64 Perseverative Errors",
                "WCST 64 Nonperseverative Errors",
                "WCST 64 Conceptual Level Responses",
                "WCST 64 Categories Complete",
                "WCST 64 Trials to Complete 1st Category",
                "WCST 64 Failure to Maintain Set",
                "Stroop Color-Word",
                "Stroop Interference",
                "D-KEFS Color-Word Inhibition",
                "D-KEFS Color-Word Inhibition/Switching",
                "FAS Total",
                "Animals Total",
                "BRIEF-A GEC",
                "BRIEF-A BRI",
                "BRIEF-A MI",
            ],
            "Verbal Learning and Memory": [
                "CVLT-3 Trials 1-5 Correct",
                "CVLT-3 Trial 1",
                "CVLT-3 Trial 2",
                "CVLT-3 Trial 3",
                "CVLT-3 Trial 4",
                "CVLT-3 Trial 5",
                "CVLT-3 List B",
                "CVLT-3 Delayed Recall Correct",
                "CVLT-3 Short Delay Free",
                "CVLT-3 Short Delay Cue",
                "CVLT-3 Long Delay Free",
                "CVLT-3 Long Delay Cue",
                "CVLT-3 Novel Intrusions",
                "CVLT-3 Discriminability",
                "CVLT-3 Hits",
                "CVLT-3 False Positives",
                "CVLT-3 Repetitions",
                "CVLT-3 List B vs Trial 1",
                "CVLT-3 Forced Choice Recognition",
                "NAB Story Learning: Trial 1",
                "NAB Story Learning: Trial 2",
                "NAB Story Memory Immediate Recall",
                "NAB Story Memory Delayed Recall",
                "NAB Story Memory Retention",
                "RAVLT Total Learning",
                "RAVLT Delayed Recall",
                "RAVLT Recognition",
                "WMS-IV Logical Memory I",
                "WMS-IV Logical Memory II",
            ],
            "Visual Spatial Learning and Memory": [
                "BVMT-R Total Recall",
                "BVMT-R Trial 1",
                "BVMT-R Trial 2",
                "BVMT-R Trial 3",
                "BVMT-R Learning",
                "BVMT-R Delayed Recall",
                "BVMT-R % Retained",
                "BVMT-R Hits",
                "BVMT-R False Alarms",
                "BVMT-R Disc. Index",
                "BVMT-R Response Bias",
                "RCFT Immediate Recall",
                "RCFT Delayed Recall",
                "WMS-IV Visual Reproduction I",
                "WMS-IV Visual Reproduction II",
            ],
            "Language": [
                "NAB Naming: NAM",
                "NAB Naming: Percent Correct After Semantic Cuing",
                "NAB Naming: Percent Correct After Phonemic Cuing",
                "Phonemic Fluency (S+P)",
                "Phonemic Fluency (S)",
                "Phonemic Fluency (P)",
                "Phonemic Fluency (F)",
                "Semantic Fluency (Animals + Supermarket Items)",
                "Semantic Fluency (Animals)",
                "Semantic Fluency (Supermarket Items)",
                "Boston Naming Test",
                "Token Test",
                "Peabody Picture Vocabulary Test",
                "WAB-R Aphasia Quotient",
            ],
            "Visuospatial Functioning": [
                "JOLO (Full)",
                "JOLO (Short Form)",
                "Clock Drawing",
                "RCFT Copy",
                "RCFT Time to Copy",
                "WAIS-IV Block Design",
                "WAIS-IV Matrix Reasoning",
                "WAIS-IV Visual Puzzles",
                "Hooper Visual Organization Test",
            ],
            "Motor Functioning": [
                "Grooved Pegboard Dominant",
                "Grooved Pegboard Non-Dominant",
                "Finger Tapping Dominant",
                "Finger Tapping Non-Dominant",
                "Grip Strength Dominant",
                "Grip Strength Non-Dominant",
            ],
            "Sensory Functioning": [
                "Tactile Finger Recognition Right",
                "Tactile Finger Recognition Left",
                "Fingertip Number Writing Right",
                "Fingertip Number Writing Left",
                "Tactile Form Recognition Right",
                "Tactile Form Recognition Left",
            ],
            "Personality/Emotional Functioning": [
                "Burns Depression Inventory",
                "Burns Anxiety Inventory",
                "Beck Depression Inventory-II",
                "Beck Anxiety Inventory",
                "MMPI-2-RF",
                "PAI Depression",
                "PAI Anxiety",
                "GAD-7",
                "PHQ-9",
            ],
            "IADL/Functional": [
                "ECOG Self-Report",
                "ECOG Informant-Report",
                "FAQ Total",
                "Lawton IADL Scale",
            ],
        }

    @staticmethod
    def get_domains():
        """Returns list of all available domains"""
        return list(TestLibrary.get_all_tests().keys())

# ============================================================================
# DATA MODELS
# ============================================================================

class Test:
    """Represents a single neuropsychological test result"""

    def __init__(self, name, domain, raw_score="", norm_type="T", norm_score="",
                 percentile="", descriptor="", notes=""):
        self.name = name
        self.domain = domain
        self.raw_score = raw_score
        self.norm_type = norm_type  # T, SS, Scaled, Z, Percentile, etc.
        self.norm_score = norm_score
        self.percentile = percentile
        self.descriptor = descriptor
        self.notes = notes

        # Auto-calculate missing values
        self._auto_calculate()

    def _auto_calculate(self):
        """Auto-calculate percentile and descriptor if norm_score is provided"""
        if self.norm_score and not self.percentile:
            self.percentile = ScoreConverter.to_percentile(self.norm_score, self.norm_type)

        if self.percentile and not self.descriptor:
            self.descriptor = ScoreConverter.get_aacn_descriptor(self.percentile)

        if not self.percentile and self.norm_score:
            self.percentile = ScoreConverter.to_percentile(self.norm_score, self.norm_type)

    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            'name': self.name,
            'domain': self.domain,
            'raw_score': self.raw_score,
            'norm_type': self.norm_type,
            'norm_score': self.norm_score,
            'percentile': self.percentile,
            'descriptor': self.descriptor,
            'notes': self.notes
        }

    @staticmethod
    def from_dict(data):
        """Create Test object from dictionary"""
        return Test(**data)

class Domain:
    """Represents a cognitive domain with multiple tests"""

    def __init__(self, name):
        self.name = name
        self.tests = []

    def add_test(self, test):
        """Add a test to this domain"""
        self.tests.append(test)

    def get_average_percentile(self):
        """Calculate average percentile of all tests in domain"""
        percentiles = [t.percentile for t in self.tests if t.percentile]
        if not percentiles:
            return None
        return sum(percentiles) / len(percentiles)

    def get_average_norm_score(self, norm_type='T'):
        """Calculate average norm score of all tests in domain"""
        scores = []
        for t in self.tests:
            if t.norm_score and t.norm_type == norm_type:
                try:
                    scores.append(float(t.norm_score))
                except:
                    pass

        if not scores:
            return None
        return sum(scores) / len(scores)

    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            'name': self.name,
            'tests': [t.to_dict() for t in self.tests]
        }

    @staticmethod
    def from_dict(data):
        """Create Domain object from dictionary"""
        domain = Domain(data['name'])
        domain.tests = [Test.from_dict(t) for t in data['tests']]
        return domain

class Battery:
    """Represents a complete test battery with multiple domains"""

    def __init__(self, name="", patient_name=""):
        self.name = name
        self.patient_name = patient_name
        self.domains = {}
        self.premorbid_percentile = None
        self.premorbid_score = None
        self.notes = ""
        self.date_created = datetime.now().isoformat()

    def add_test(self, test):
        """Add a test to the appropriate domain"""
        if test.domain not in self.domains:
            self.domains[test.domain] = Domain(test.domain)
        self.domains[test.domain].add_test(test)

    def get_overall_mean_percentile(self):
        """Calculate overall mean percentile across all tests"""
        all_percentiles = []
        for domain in self.domains.values():
            for test in domain.tests:
                if test.percentile:
                    all_percentiles.append(test.percentile)

        if not all_percentiles:
            return None
        return sum(all_percentiles) / len(all_percentiles)

    def get_domain_averages(self):
        """Get dictionary of domain averages"""
        return {name: domain.get_average_percentile()
                for name, domain in self.domains.items()}

    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            'name': self.name,
            'patient_name': self.patient_name,
            'domains': {name: domain.to_dict() for name, domain in self.domains.items()},
            'premorbid_percentile': self.premorbid_percentile,
            'premorbid_score': self.premorbid_score,
            'notes': self.notes,
            'date_created': self.date_created
        }

    @staticmethod
    def from_dict(data):
        """Create Battery object from dictionary"""
        battery = Battery(data.get('name', ''), data.get('patient_name', ''))
        battery.premorbid_percentile = data.get('premorbid_percentile')
        battery.premorbid_score = data.get('premorbid_score')
        battery.notes = data.get('notes', '')
        battery.date_created = data.get('date_created', datetime.now().isoformat())

        for domain_name, domain_data in data.get('domains', {}).items():
            battery.domains[domain_name] = Domain.from_dict(domain_data)

        return battery

    def save_to_file(self, filename):
        """Save battery to JSON file"""
        with open(filename, 'w') as f:
            json.dump(self.to_dict(), f, indent=2)

    @staticmethod
    def load_from_file(filename):
        """Load battery from JSON file"""
        with open(filename, 'r') as f:
            data = json.load(f)
        return Battery.from_dict(data)

# ============================================================================
# MAIN APPLICATION
# ============================================================================

class NeuropsychReportBuilder:
    """Main application for building neuropsychological assessment reports"""

    def __init__(self, root):
        self.root = root
        self.root.title("Neuropsychological Assessment Report Builder")
        self.root.geometry("1400x900")

        self.current_battery = Battery()
        self.test_library = TestLibrary.get_all_tests()

        self.setup_ui()

    def setup_ui(self):
        """Setup the main UI with tabs"""
        # Menu bar
        menubar = tk.Menu(self.root)
        self.root.config(menu=menubar)

        # Battery menu
        battery_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="Battery", menu=battery_menu)
        battery_menu.add_command(label="New Battery", command=self.new_battery)
        battery_menu.add_command(label="Load Battery", command=self.load_battery)
        battery_menu.add_command(label="Save Battery", command=self.save_battery)
        battery_menu.add_command(label="Save Battery As...", command=self.save_battery_as)
        battery_menu.add_separator()
        battery_menu.add_command(label="Load Template", command=self.load_template)
        battery_menu.add_command(label="Save as Template", command=self.save_as_template)

        # Main notebook (tabs)
        self.notebook = ttk.Notebook(self.root)
        self.notebook.pack(fill='both', expand=True, padx=5, pady=5)

        # Tab 1: Data Entry
        self.data_entry_frame = ttk.Frame(self.notebook)
        self.notebook.add(self.data_entry_frame, text="Data Entry")
        self.setup_data_entry_tab()

        # Tab 2: Table View
        self.table_frame = ttk.Frame(self.notebook)
        self.notebook.add(self.table_frame, text="Table View")
        self.setup_table_tab()

        # Tab 3: Graphs
        self.graph_frame = ttk.Frame(self.notebook)
        self.notebook.add(self.graph_frame, text="Graphs")
        self.setup_graph_tab()

    def setup_data_entry_tab(self):
        """Setup the data entry tab"""
        # Patient info section
        info_frame = ttk.LabelFrame(self.data_entry_frame, text="Patient Information", padding=10)
        info_frame.pack(fill='x', padx=5, pady=5)

        ttk.Label(info_frame, text="Patient Name:").grid(row=0, column=0, sticky='w', padx=5)
        self.patient_name_var = tk.StringVar()
        ttk.Entry(info_frame, textvariable=self.patient_name_var, width=40).grid(row=0, column=1, padx=5)

        ttk.Label(info_frame, text="Battery Name:").grid(row=0, column=2, sticky='w', padx=5)
        self.battery_name_var = tk.StringVar()
        ttk.Entry(info_frame, textvariable=self.battery_name_var, width=40).grid(row=0, column=3, padx=5)

        # Premorbid section
        premorbid_frame = ttk.LabelFrame(self.data_entry_frame, text="Premorbid Estimate", padding=10)
        premorbid_frame.pack(fill='x', padx=5, pady=5)

        ttk.Label(premorbid_frame, text="Score:").grid(row=0, column=0, sticky='w', padx=5)
        self.premorbid_score_var = tk.StringVar()
        ttk.Entry(premorbid_frame, textvariable=self.premorbid_score_var, width=15).grid(row=0, column=1, padx=5)

        ttk.Label(premorbid_frame, text="Type:").grid(row=0, column=2, sticky='w', padx=5)
        self.premorbid_type_var = tk.StringVar(value='SS')
        ttk.Combobox(premorbid_frame, textvariable=self.premorbid_type_var,
                     values=['T', 'SS', 'Scaled', 'Z', 'Percentile'], width=12).grid(row=0, column=3, padx=5)

        # Test entry section
        test_frame = ttk.LabelFrame(self.data_entry_frame, text="Add Tests", padding=10)
        test_frame.pack(fill='both', expand=True, padx=5, pady=5)

        # Test selector
        selector_frame = ttk.Frame(test_frame)
        selector_frame.pack(fill='x', pady=5)

        ttk.Label(selector_frame, text="Domain:").grid(row=0, column=0, sticky='w', padx=5)
        self.domain_var = tk.StringVar()
        self.domain_combo = ttk.Combobox(selector_frame, textvariable=self.domain_var,
                                         values=TestLibrary.get_domains(), width=30)
        self.domain_combo.grid(row=0, column=1, padx=5)
        self.domain_combo.bind('<<ComboboxSelected>>', self.on_domain_selected)

        ttk.Label(selector_frame, text="Test:").grid(row=0, column=2, sticky='w', padx=5)
        self.test_var = tk.StringVar()
        self.test_combo = ttk.Combobox(selector_frame, textvariable=self.test_var, width=40)
        self.test_combo.grid(row=0, column=3, padx=5)

        # Test data entry
        entry_frame = ttk.Frame(test_frame)
        entry_frame.pack(fill='x', pady=5)

        ttk.Label(entry_frame, text="Raw Score:").grid(row=0, column=0, sticky='w', padx=5)
        self.raw_score_var = tk.StringVar()
        ttk.Entry(entry_frame, textvariable=self.raw_score_var, width=15).grid(row=0, column=1, padx=5)

        ttk.Label(entry_frame, text="Norm Type:").grid(row=0, column=2, sticky='w', padx=5)
        self.norm_type_var = tk.StringVar(value='T')
        ttk.Combobox(entry_frame, textvariable=self.norm_type_var,
                     values=['T', 'SS', 'Scaled', 'Z', 'Percentile', 'GE', 'Freq', 'Cum%', '--'],
                     width=12).grid(row=0, column=3, padx=5)

        ttk.Label(entry_frame, text="Norm Score:").grid(row=0, column=4, sticky='w', padx=5)
        self.norm_score_var = tk.StringVar()
        ttk.Entry(entry_frame, textvariable=self.norm_score_var, width=15).grid(row=0, column=5, padx=5)

        ttk.Label(entry_frame, text="Percentile:").grid(row=0, column=6, sticky='w', padx=5)
        self.percentile_var = tk.StringVar()
        ttk.Entry(entry_frame, textvariable=self.percentile_var, width=15).grid(row=0, column=7, padx=5)

        # Notes
        notes_frame = ttk.Frame(test_frame)
        notes_frame.pack(fill='x', pady=5)

        ttk.Label(notes_frame, text="Notes:").grid(row=0, column=0, sticky='w', padx=5)
        self.notes_var = tk.StringVar()
        ttk.Entry(notes_frame, textvariable=self.notes_var, width=80).grid(row=0, column=1, padx=5)

        # Add button
        ttk.Button(test_frame, text="Add Test", command=self.add_test).pack(pady=5)

        # Current tests list
        list_frame = ttk.LabelFrame(test_frame, text="Current Tests", padding=5)
        list_frame.pack(fill='both', expand=True, pady=5)

        # Treeview for tests
        columns = ('Domain', 'Test', 'Raw', 'Type', 'Score', '%ile', 'Descriptor')
        self.tests_tree = ttk.Treeview(list_frame, columns=columns, show='tree headings', height=15)

        for col in columns:
            self.tests_tree.heading(col, text=col)
            self.tests_tree.column(col, width=120)

        self.tests_tree.column('#0', width=50)

        # Scrollbar
        scrollbar = ttk.Scrollbar(list_frame, orient='vertical', command=self.tests_tree.yview)
        self.tests_tree.configure(yscrollcommand=scrollbar.set)

        self.tests_tree.pack(side='left', fill='both', expand=True)
        scrollbar.pack(side='right', fill='y')

        # Delete button
        ttk.Button(list_frame, text="Delete Selected", command=self.delete_test).pack(pady=5)

    def setup_table_tab(self):
        """Setup the table view tab"""
        # Options frame
        options_frame = ttk.LabelFrame(self.table_frame, text="Table Options", padding=10)
        options_frame.pack(fill='x', padx=5, pady=5)

        self.show_raw_var = tk.BooleanVar(value=True)
        self.show_norm_type_var = tk.BooleanVar(value=True)
        self.show_norm_score_var = tk.BooleanVar(value=True)
        self.show_percentile_var = tk.BooleanVar(value=True)
        self.show_descriptor_var = tk.BooleanVar(value=True)
        self.show_notes_var = tk.BooleanVar(value=False)

        ttk.Checkbutton(options_frame, text="Raw Score", variable=self.show_raw_var).grid(row=0, column=0, padx=5)
        ttk.Checkbutton(options_frame, text="Norm Type", variable=self.show_norm_type_var).grid(row=0, column=1, padx=5)
        ttk.Checkbutton(options_frame, text="Norm Score", variable=self.show_norm_score_var).grid(row=0, column=2, padx=5)
        ttk.Checkbutton(options_frame, text="Percentile", variable=self.show_percentile_var).grid(row=0, column=3, padx=5)
        ttk.Checkbutton(options_frame, text="Descriptor", variable=self.show_descriptor_var).grid(row=0, column=4, padx=5)
        ttk.Checkbutton(options_frame, text="Notes", variable=self.show_notes_var).grid(row=0, column=5, padx=5)

        ttk.Button(options_frame, text="Generate Table", command=self.generate_table).grid(row=0, column=6, padx=20)
        ttk.Button(options_frame, text="Copy to Clipboard", command=self.copy_table).grid(row=0, column=7, padx=5)

        # Table display
        table_display_frame = ttk.LabelFrame(self.table_frame, text="Report Table", padding=5)
        table_display_frame.pack(fill='both', expand=True, padx=5, pady=5)

        self.table_text = scrolledtext.ScrolledText(table_display_frame, wrap=tk.NONE,
                                                     font=('Courier', 9), width=150, height=35)
        self.table_text.pack(fill='both', expand=True)

    def setup_graph_tab(self):
        """Setup the graphs tab"""
        # Graph options
        options_frame = ttk.LabelFrame(self.graph_frame, text="Graph Options", padding=10)
        options_frame.pack(fill='x', padx=5, pady=5)

        ttk.Label(options_frame, text="Graph Type:").grid(row=0, column=0, padx=5)
        self.graph_type_var = tk.StringVar(value='individual')
        ttk.Radiobutton(options_frame, text="Individual Tests by Domain",
                       variable=self.graph_type_var, value='individual').grid(row=0, column=1, padx=5)
        ttk.Radiobutton(options_frame, text="Domain Averages",
                       variable=self.graph_type_var, value='domain').grid(row=0, column=2, padx=5)
        ttk.Radiobutton(options_frame, text="Combined View",
                       variable=self.graph_type_var, value='combined').grid(row=0, column=3, padx=5)

        self.show_colors_var = tk.BooleanVar(value=True)
        ttk.Checkbutton(options_frame, text="Show Color Zones",
                       variable=self.show_colors_var).grid(row=0, column=4, padx=20)

        self.show_premorbid_var = tk.BooleanVar(value=True)
        ttk.Checkbutton(options_frame, text="Show Premorbid Line",
                       variable=self.show_premorbid_var).grid(row=0, column=5, padx=5)

        self.show_overall_var = tk.BooleanVar(value=True)
        ttk.Checkbutton(options_frame, text="Show Overall Mean",
                       variable=self.show_overall_var).grid(row=0, column=6, padx=5)

        ttk.Button(options_frame, text="Generate Graph",
                  command=self.generate_graph).grid(row=0, column=7, padx=20)

        # Graph display area
        self.graph_canvas_frame = ttk.Frame(self.graph_frame)
        self.graph_canvas_frame.pack(fill='both', expand=True, padx=5, pady=5)

    def on_domain_selected(self, event):
        """Update test list when domain is selected"""
        domain = self.domain_var.get()
        if domain in self.test_library:
            self.test_combo['values'] = self.test_library[domain]
            if self.test_library[domain]:
                self.test_combo.current(0)

    def add_test(self):
        """Add a test to the current battery"""
        try:
            # Get values
            domain = self.domain_var.get()
            test_name = self.test_var.get()
            raw_score = self.raw_score_var.get()
            norm_type = self.norm_type_var.get()
            norm_score = self.norm_score_var.get()
            percentile = self.percentile_var.get()
            notes = self.notes_var.get()

            if not test_name or not domain:
                messagebox.showerror("Error", "Please select a domain and test")
                return

            # Create test object
            test = Test(test_name, domain, raw_score, norm_type, norm_score, percentile, notes=notes)

            # Add to battery
            self.current_battery.add_test(test)

            # Update tree
            self.update_tests_tree()

            # Clear entries
            self.raw_score_var.set("")
            self.norm_score_var.set("")
            self.percentile_var.set("")
            self.notes_var.set("")

        except Exception as e:
            messagebox.showerror("Error", f"Error adding test: {str(e)}")

    def delete_test(self):
        """Delete selected test from battery"""
        selected = self.tests_tree.selection()
        if not selected:
            return

        item = self.tests_tree.item(selected[0])
        if 'values' in item and item['values']:
            domain_name = item['values'][0]
            test_name = item['values'][1]

            # Find and remove test
            if domain_name in self.current_battery.domains:
                domain = self.current_battery.domains[domain_name]
                domain.tests = [t for t in domain.tests if t.name != test_name]

                # Remove domain if empty
                if not domain.tests:
                    del self.current_battery.domains[domain_name]

            self.update_tests_tree()

    def update_tests_tree(self):
        """Update the tests treeview"""
        # Clear tree
        for item in self.tests_tree.get_children():
            self.tests_tree.delete(item)

        # Add tests grouped by domain
        for domain_name in sorted(self.current_battery.domains.keys()):
            domain = self.current_battery.domains[domain_name]

            # Add domain header
            domain_id = self.tests_tree.insert('', 'end', text='', values=(
                f"*** {domain_name} ***", '', '', '', '', '', ''
            ), tags=('domain',))

            # Add tests
            for test in domain.tests:
                percentile_str = f"{test.percentile:.1f}" if test.percentile else ""
                self.tests_tree.insert(domain_id, 'end', text='', values=(
                    '', test.name, test.raw_score, test.norm_type,
                    test.norm_score, percentile_str, test.descriptor
                ))

            # Add domain average
            avg_percentile = domain.get_average_percentile()
            if avg_percentile:
                avg_descriptor = ScoreConverter.get_aacn_descriptor(avg_percentile)
                self.tests_tree.insert(domain_id, 'end', text='', values=(
                    '', f'  → Domain Average', '', '', '',
                    f"{avg_percentile:.1f}", avg_descriptor
                ), tags=('average',))

        # Configure tags
        self.tests_tree.tag_configure('domain', background='#E0E0E0', font=('TkDefaultFont', 9, 'bold'))
        self.tests_tree.tag_configure('average', background='#F0F0F0', font=('TkDefaultFont', 9, 'italic'))

    def generate_table(self):
        """Generate formatted table with AACN descriptors"""
        try:
            # Update battery info
            self.current_battery.patient_name = self.patient_name_var.get()
            self.current_battery.name = self.battery_name_var.get()

            # Handle premorbid
            if self.premorbid_score_var.get():
                score = float(self.premorbid_score_var.get())
                norm_type = self.premorbid_type_var.get()
                self.current_battery.premorbid_score = score
                self.current_battery.premorbid_percentile = ScoreConverter.to_percentile(score, norm_type)

            # Build table
            table = []
            table.append("=" * 120)
            table.append(f"NEUROPSYCHOLOGICAL ASSESSMENT REPORT")
            if self.current_battery.patient_name:
                table.append(f"Patient: {self.current_battery.patient_name}")
            if self.current_battery.name:
                table.append(f"Battery: {self.current_battery.name}")
            table.append("=" * 120)
            table.append("")

            # Column headers
            headers = ["Measure"]
            if self.show_raw_var.get():
                headers.append("Raw Score")
            if self.show_norm_type_var.get():
                headers.append("Norm Type")
            if self.show_norm_score_var.get():
                headers.append("Norm Score")
            if self.show_percentile_var.get():
                headers.append("Percentile")
            if self.show_descriptor_var.get():
                headers.append("Descriptor")
            if self.show_notes_var.get():
                headers.append("Notes")

            # Calculate column widths
            col_widths = [40, 10, 10, 10, 10, 20, 30]

            # Header row
            header_row = ""
            for i, header in enumerate(headers):
                header_row += header.ljust(col_widths[i])
            table.append(header_row)
            table.append("-" * 120)

            # Data rows by domain
            for domain_name in sorted(self.current_battery.domains.keys()):
                domain = self.current_battery.domains[domain_name]

                # Domain header
                table.append(f"\n{domain_name.upper()}")

                # Tests
                for test in domain.tests:
                    row = [test.name]
                    if self.show_raw_var.get():
                        row.append(str(test.raw_score) if test.raw_score else "--")
                    if self.show_norm_type_var.get():
                        row.append(test.norm_type)
                    if self.show_norm_score_var.get():
                        row.append(str(test.norm_score) if test.norm_score else "--")
                    if self.show_percentile_var.get():
                        if test.percentile:
                            if test.percentile < 1:
                                row.append("<1")
                            else:
                                row.append(f"{test.percentile:.0f}")
                        else:
                            row.append("--")
                    if self.show_descriptor_var.get():
                        row.append(test.descriptor if test.descriptor else "--")
                    if self.show_notes_var.get():
                        row.append(test.notes if test.notes else "")

                    # Format row
                    row_str = ""
                    for i, val in enumerate(row):
                        row_str += str(val).ljust(col_widths[i])
                    table.append("  " + row_str)

                # Domain average
                avg_percentile = domain.get_average_percentile()
                if avg_percentile:
                    avg_descriptor = ScoreConverter.get_aacn_descriptor(avg_percentile)
                    row = [f"  → {domain_name} Domain Average"]
                    if self.show_raw_var.get():
                        row.append("--")
                    if self.show_norm_type_var.get():
                        row.append("--")
                    if self.show_norm_score_var.get():
                        row.append("--")
                    if self.show_percentile_var.get():
                        row.append(f"{avg_percentile:.0f}")
                    if self.show_descriptor_var.get():
                        row.append(avg_descriptor)
                    if self.show_notes_var.get():
                        row.append("")

                    row_str = ""
                    for i, val in enumerate(row):
                        row_str += str(val).ljust(col_widths[i])
                    table.append("  " + row_str)

            # Overall statistics
            overall_mean = self.current_battery.get_overall_mean_percentile()
            if overall_mean:
                table.append("\n" + "=" * 120)
                table.append(f"OVERALL TEST BATTERY MEAN: {overall_mean:.1f}th percentile - {ScoreConverter.get_aacn_descriptor(overall_mean)}")

            if self.current_battery.premorbid_percentile:
                table.append(f"PREMORBID ESTIMATE: {self.current_battery.premorbid_percentile:.1f}th percentile - {ScoreConverter.get_aacn_descriptor(self.current_battery.premorbid_percentile)}")

            # Key
            table.append("\n" + "=" * 120)
            table.append("KEY")
            table.append("T-scores (T): Mean = 50; Standard Deviation = 10")
            table.append("IQ, Index, and Standard Scores (SS): Mean = 100; Standard Deviation = 15")
            table.append("Scaled Scores: Mean = 10; Standard Deviation = 3")
            table.append("")
            table.append("AACN QUALITATIVE DESCRIPTORS")
            table.append("Standard Score    T-Score    Percentile    Descriptor")
            table.append(">130              >70        >98           Exceptionally High")
            table.append("120-129           63-69      91-97         Above Average")
            table.append("110-119           57-62      75-90         High Average")
            table.append("90-109            43-56      25-74         Average")
            table.append("80-89             37-42      9-24          Low Average")
            table.append("70-79             30-36      2-8           Below Average")
            table.append("<70               <30        <2            Exceptionally Low")

            # Display
            self.table_text.delete('1.0', tk.END)
            self.table_text.insert('1.0', '\n'.join(table))

        except Exception as e:
            messagebox.showerror("Error", f"Error generating table: {str(e)}")

    def copy_table(self):
        """Copy table to clipboard"""
        self.root.clipboard_clear()
        self.root.clipboard_append(self.table_text.get('1.0', tk.END))
        messagebox.showinfo("Success", "Table copied to clipboard")

    def generate_graph(self):
        """Generate selected graph type"""
        try:
            # Clear previous graph
            for widget in self.graph_canvas_frame.winfo_children():
                widget.destroy()

            graph_type = self.graph_type_var.get()

            if graph_type == 'individual':
                self.create_individual_tests_graph()
            elif graph_type == 'domain':
                self.create_domain_averages_graph()
            elif graph_type == 'combined':
                self.create_combined_graph()

        except Exception as e:
            messagebox.showerror("Error", f"Error generating graph: {str(e)}")

    def create_individual_tests_graph(self):
        """Create graph with all individual tests grouped by domain"""
        fig, ax = plt.subplots(figsize=(16, 8), facecolor='#f4f4f4')

        # Collect all tests organized by domain
        x_labels = []
        y_values = []
        colors = []
        x_positions = []
        domain_boundaries = []
        current_pos = 0

        for domain_name in sorted(self.current_battery.domains.keys()):
            domain = self.current_battery.domains[domain_name]
            domain_start = current_pos

            for test in domain.tests:
                if test.percentile is not None:
                    x_labels.append(test.name)
                    y_values.append(test.percentile)

                    if self.show_colors_var.get():
                        colors.append(ScoreConverter.get_percentile_color(test.percentile))
                    else:
                        colors.append('#4444FF')

                    x_positions.append(current_pos)
                    current_pos += 1

            domain_boundaries.append((domain_start, current_pos, domain_name))

        if not y_values:
            messagebox.showwarning("Warning", "No tests with percentiles to graph")
            return

        # Create bar chart
        bars = ax.bar(x_positions, y_values, color=colors, alpha=0.8, edgecolor='black', linewidth=0.5)

        # Add domain labels and separators
        for start, end, name in domain_boundaries:
            if end > start:
                mid = (start + end - 1) / 2
                ax.text(mid, -8, name, ha='center', va='top', fontsize=9, fontweight='bold', rotation=0)

                if start > 0:
                    ax.axvline(x=start - 0.5, color='black', linewidth=2, linestyle='-')

        # Reference lines
        if self.show_premorbid_var.get() and self.current_battery.premorbid_percentile:
            ax.axhline(y=self.current_battery.premorbid_percentile, color='red',
                      linestyle='--', linewidth=2, label='Premorbid Estimate')

        if self.show_overall_var.get():
            overall_mean = self.current_battery.get_overall_mean_percentile()
            if overall_mean:
                ax.axhline(y=overall_mean, color='green', linestyle='--',
                          linewidth=2, label='Overall Battery Mean')

        # Formatting
        ax.set_xticks(x_positions)
        ax.set_xticklabels(x_labels, rotation=90, ha='right', fontsize=7)
        ax.set_ylabel('Percentile', fontsize=12, fontweight='bold')
        ax.set_ylim(-10, 105)
        ax.set_xlim(-0.5, current_pos - 0.5)
        ax.grid(axis='y', linestyle='--', alpha=0.3)
        ax.legend(loc='upper right')

        title = f"Individual Test Performance"
        if self.current_battery.patient_name:
            title += f" - {self.current_battery.patient_name}"
        ax.set_title(title, fontsize=14, fontweight='bold')

        plt.tight_layout()

        # Embed in tkinter
        canvas = FigureCanvasTkAgg(fig, master=self.graph_canvas_frame)
        canvas.draw()
        canvas.get_tk_widget().pack(fill='both', expand=True)

    def create_domain_averages_graph(self):
        """Create line graph of domain averages"""
        fig, ax = plt.subplots(figsize=(14, 8), facecolor='#f4f4f4')

        # Get domain averages
        domains = []
        averages = []
        colors = []

        for domain_name in sorted(self.current_battery.domains.keys()):
            avg = self.current_battery.domains[domain_name].get_average_percentile()
            if avg is not None:
                domains.append(domain_name)
                averages.append(avg)
                if self.show_colors_var.get():
                    colors.append(ScoreConverter.get_percentile_color(avg))
                else:
                    colors.append('#4444FF')

        if not averages:
            messagebox.showwarning("Warning", "No domain averages to graph")
            return

        # Create line plot with color-coded points
        ax.plot(domains, averages, marker='o', color='black', linewidth=2, markersize=10, zorder=3)

        # Color the points
        for i, (x, y, color) in enumerate(zip(domains, averages, colors)):
            ax.plot(x, y, marker='o', color=color, markersize=12, zorder=4,
                   markeredgecolor='black', markeredgewidth=1.5)

        # Add percentile color zones as background
        if self.show_colors_var.get():
            ax.axhspan(0, 2, facecolor='#FF4444', alpha=0.1, label='<2nd %ile (Exceptionally Low)')
            ax.axhspan(2, 9, facecolor='#FFAA00', alpha=0.1, label='2-8th %ile (Below Average)')
            ax.axhspan(9, 25, facecolor='#FFD700', alpha=0.1, label='9-24th %ile (Low Average)')
            ax.axhspan(25, 75, facecolor='#44FF44', alpha=0.1, label='25-74th %ile (Average)')
            ax.axhspan(75, 91, facecolor='#66CCFF', alpha=0.1, label='75-90th %ile (High Average)')
            ax.axhspan(91, 98, facecolor='#4444FF', alpha=0.1, label='91-97th %ile (Above Average)')
            ax.axhspan(98, 100, facecolor='#0000AA', alpha=0.1, label='>98th %ile (Exceptionally High)')

        # Reference lines
        if self.show_premorbid_var.get() and self.current_battery.premorbid_percentile:
            ax.axhline(y=self.current_battery.premorbid_percentile, color='red',
                      linestyle='--', linewidth=2, label='Premorbid Estimate', zorder=2)

        if self.show_overall_var.get():
            overall_mean = self.current_battery.get_overall_mean_percentile()
            if overall_mean:
                ax.axhline(y=overall_mean, color='darkgreen', linestyle='--',
                          linewidth=2, label='Overall Battery Mean', zorder=2)

        # Formatting
        ax.set_ylabel('Percentile', fontsize=12, fontweight='bold')
        ax.set_xlabel('Cognitive Domain', fontsize=12, fontweight='bold')
        ax.set_ylim(0, 100)
        ax.set_yticks(range(0, 101, 10))
        ax.grid(axis='both', linestyle='--', alpha=0.3, zorder=1)
        plt.xticks(rotation=45, ha='right', fontsize=10)
        ax.legend(loc='upper left', fontsize=8, framealpha=0.9)

        title = f"Domain Average Performance"
        if self.current_battery.patient_name:
            title += f" - {self.current_battery.patient_name}"
        ax.set_title(title, fontsize=14, fontweight='bold')

        plt.tight_layout()

        # Embed in tkinter
        canvas = FigureCanvasTkAgg(fig, master=self.graph_canvas_frame)
        canvas.draw()
        canvas.get_tk_widget().pack(fill='both', expand=True)

    def create_combined_graph(self):
        """Create combined view with both individual and domain averages"""
        fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(16, 12), facecolor='#f4f4f4')

        # Top: Individual tests
        x_labels = []
        y_values = []
        colors = []
        x_positions = []
        domain_boundaries = []
        current_pos = 0

        for domain_name in sorted(self.current_battery.domains.keys()):
            domain = self.current_battery.domains[domain_name]
            domain_start = current_pos

            for test in domain.tests:
                if test.percentile is not None:
                    x_labels.append(test.name)
                    y_values.append(test.percentile)

                    if self.show_colors_var.get():
                        colors.append(ScoreConverter.get_percentile_color(test.percentile))
                    else:
                        colors.append('#4444FF')

                    x_positions.append(current_pos)
                    current_pos += 1

            domain_boundaries.append((domain_start, current_pos, domain_name))

        if y_values:
            bars = ax1.bar(x_positions, y_values, color=colors, alpha=0.8, edgecolor='black', linewidth=0.5)

            for start, end, name in domain_boundaries:
                if end > start:
                    mid = (start + end - 1) / 2
                    ax1.text(mid, -8, name, ha='center', va='top', fontsize=8, fontweight='bold')
                    if start > 0:
                        ax1.axvline(x=start - 0.5, color='black', linewidth=2)

            ax1.set_xticks(x_positions)
            ax1.set_xticklabels(x_labels, rotation=90, ha='right', fontsize=6)
            ax1.set_ylabel('Percentile', fontsize=11, fontweight='bold')
            ax1.set_ylim(-10, 105)
            ax1.grid(axis='y', linestyle='--', alpha=0.3)
            ax1.set_title('Individual Test Performance', fontsize=12, fontweight='bold')

        # Bottom: Domain averages
        domains = []
        averages = []
        avg_colors = []

        for domain_name in sorted(self.current_battery.domains.keys()):
            avg = self.current_battery.domains[domain_name].get_average_percentile()
            if avg is not None:
                domains.append(domain_name)
                averages.append(avg)
                if self.show_colors_var.get():
                    avg_colors.append(ScoreConverter.get_percentile_color(avg))
                else:
                    avg_colors.append('#4444FF')

        if averages:
            ax2.plot(domains, averages, marker='o', color='black', linewidth=2, markersize=10, zorder=3)

            for i, (x, y, color) in enumerate(zip(domains, averages, avg_colors)):
                ax2.plot(x, y, marker='o', color=color, markersize=12, zorder=4,
                        markeredgecolor='black', markeredgewidth=1.5)

            # Color zones
            if self.show_colors_var.get():
                ax2.axhspan(0, 2, facecolor='#FF4444', alpha=0.1)
                ax2.axhspan(2, 9, facecolor='#FFAA00', alpha=0.1)
                ax2.axhspan(9, 25, facecolor='#FFD700', alpha=0.1)
                ax2.axhspan(25, 75, facecolor='#44FF44', alpha=0.1)
                ax2.axhspan(75, 91, facecolor='#66CCFF', alpha=0.1)
                ax2.axhspan(91, 98, facecolor='#4444FF', alpha=0.1)
                ax2.axhspan(98, 100, facecolor='#0000AA', alpha=0.1)

            # Reference lines
            if self.show_premorbid_var.get() and self.current_battery.premorbid_percentile:
                ax2.axhline(y=self.current_battery.premorbid_percentile, color='red',
                           linestyle='--', linewidth=2, label='Premorbid Estimate', zorder=2)

            if self.show_overall_var.get():
                overall_mean = self.current_battery.get_overall_mean_percentile()
                if overall_mean:
                    ax2.axhline(y=overall_mean, color='darkgreen', linestyle='--',
                               linewidth=2, label='Overall Battery Mean', zorder=2)

            ax2.set_ylabel('Percentile', fontsize=11, fontweight='bold')
            ax2.set_xlabel('Cognitive Domain', fontsize=11, fontweight='bold')
            ax2.set_ylim(0, 100)
            ax2.set_yticks(range(0, 101, 10))
            ax2.grid(axis='both', linestyle='--', alpha=0.3)
            plt.setp(ax2.xaxis.get_majorticklabels(), rotation=45, ha='right', fontsize=9)
            ax2.legend(loc='upper left', fontsize=9)
            ax2.set_title('Domain Average Performance', fontsize=12, fontweight='bold')

        if self.current_battery.patient_name:
            fig.suptitle(f"Neuropsychological Profile - {self.current_battery.patient_name}",
                        fontsize=14, fontweight='bold', y=0.995)

        plt.tight_layout()

        # Embed in tkinter
        canvas = FigureCanvasTkAgg(fig, master=self.graph_canvas_frame)
        canvas.draw()
        canvas.get_tk_widget().pack(fill='both', expand=True)

    def new_battery(self):
        """Create new battery"""
        if messagebox.askyesno("New Battery", "Create new battery? Current data will be lost."):
            self.current_battery = Battery()
            self.patient_name_var.set("")
            self.battery_name_var.set("")
            self.premorbid_score_var.set("")
            self.update_tests_tree()
            self.table_text.delete('1.0', tk.END)
            for widget in self.graph_canvas_frame.winfo_children():
                widget.destroy()

    def save_battery(self):
        """Save current battery"""
        if not hasattr(self, 'current_file') or not self.current_file:
            self.save_battery_as()
        else:
            self.current_battery.save_to_file(self.current_file)
            messagebox.showinfo("Success", "Battery saved")

    def save_battery_as(self):
        """Save battery with new filename"""
        filename = filedialog.asksaveasfilename(
            defaultextension=".json",
            filetypes=[("JSON files", "*.json"), ("All files", "*.*")]
        )
        if filename:
            self.current_battery.patient_name = self.patient_name_var.get()
            self.current_battery.name = self.battery_name_var.get()
            self.current_battery.save_to_file(filename)
            self.current_file = filename
            messagebox.showinfo("Success", f"Battery saved to {filename}")

    def load_battery(self):
        """Load battery from file"""
        filename = filedialog.askopenfilename(
            filetypes=[("JSON files", "*.json"), ("All files", "*.*")]
        )
        if filename:
            self.current_battery = Battery.load_from_file(filename)
            self.current_file = filename
            self.patient_name_var.set(self.current_battery.patient_name)
            self.battery_name_var.set(self.current_battery.name)
            if self.current_battery.premorbid_score:
                self.premorbid_score_var.set(str(self.current_battery.premorbid_score))
            self.update_tests_tree()
            messagebox.showinfo("Success", "Battery loaded")

    def save_as_template(self):
        """Save current battery as template"""
        templates_dir = "battery_templates"
        os.makedirs(templates_dir, exist_ok=True)

        filename = filedialog.asksaveasfilename(
            initialdir=templates_dir,
            defaultextension=".json",
            filetypes=[("JSON files", "*.json"), ("All files", "*.*")]
        )
        if filename:
            # Clear patient-specific data
            template = Battery(self.current_battery.name, "")
            template.domains = self.current_battery.domains
            template.save_to_file(filename)
            messagebox.showinfo("Success", "Template saved")

    def load_template(self):
        """Load a battery template"""
        templates_dir = "battery_templates"
        os.makedirs(templates_dir, exist_ok=True)

        filename = filedialog.askopenfilename(
            initialdir=templates_dir,
            filetypes=[("JSON files", "*.json"), ("All files", "*.*")]
        )
        if filename:
            template = Battery.load_from_file(filename)
            self.current_battery.domains = template.domains
            self.battery_name_var.set(template.name)
            self.update_tests_tree()
            messagebox.showinfo("Success", "Template loaded")

# ============================================================================
# MAIN
# ============================================================================

def main():
    root = tk.Tk()
    app = NeuropsychReportBuilder(root)
    root.mainloop()

if __name__ == "__main__":
    main()
