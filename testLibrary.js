// Comprehensive Neuropsychological Test Library
// Organized by domain with parent tests and subtests

const TestLibrary = {
    "Attention & Working Memory": {
        "WAIS-IV": {
            subtests: [
                "Digit Span Forward",
                "Digit Span Backward",
                "Digit Span Sequencing",
                "Digit Span Total",
                "Arithmetic"
            ]
        },
        "WMS-IV": {
            subtests: [
                "Spatial Addition"
            ]
        },
        "D-KEFS": {
            subtests: [
                "Trail Making Test - Number Sequencing",
                "Trail Making Test - Letter Sequencing",
                "Color-Word Interference - Color Naming",
                "Color-Word Interference - Word Reading"
            ]
        },
        "CPT-3": {
            subtests: [
                "Omissions",
                "Commissions",
                "Hit RT",
                "Hit RT Std Error",
                "Variability",
                "Detectability (d')",
                "Perseverations"
            ]
        },
        "TOVA": {
            subtests: [
                "Omission Errors",
                "Commission Errors",
                "Response Time",
                "Response Time Variability"
            ]
        },
        "Conners CPT": {
            subtests: [
                "Hit RT",
                "Omissions",
                "Commissions",
                "Perseverations"
            ]
        },
        "WJ-IV COG": {
            subtests: [
                "Numbers Reversed",
                "Verbal Attention"
            ]
        },
        "NEPSY-II": {
            subtests: [
                "Auditory Attention",
                "Response Set",
                "Visual Attention"
            ]
        }
    },

    "Processing Speed": {
        "WAIS-IV": {
            subtests: [
                "Coding",
                "Symbol Search"
            ]
        },
        "WISC-V": {
            subtests: [
                "Coding",
                "Symbol Search",
                "Cancellation"
            ]
        },
        "WMS-IV": {
            subtests: [
                "Symbol Span"
            ]
        },
        "D-KEFS": {
            subtests: [
                "Trail Making Test - Motor Speed",
                "Color-Word Interference - Color Naming",
                "Color-Word Interference - Word Reading"
            ]
        },
        "WJ-IV COG": {
            subtests: [
                "Letter-Pattern Matching",
                "Number-Pattern Matching"
            ]
        },
        "NEPSY-II": {
            subtests: [
                "Inhibition - Naming",
                "Inhibition - Reading"
            ]
        }
    },

    "Verbal Reasoning & Comprehension": {
        "WAIS-IV": {
            subtests: [
                "Similarities",
                "Vocabulary",
                "Information",
                "Comprehension"
            ]
        },
        "WISC-V": {
            subtests: [
                "Similarities",
                "Vocabulary",
                "Information",
                "Comprehension"
            ]
        },
        "WJ-IV COG": {
            subtests: [
                "Oral Vocabulary",
                "General Information",
                "Analysis-Synthesis"
            ]
        },
        "WASI-II": {
            subtests: [
                "Vocabulary",
                "Similarities"
            ]
        }
    },

    "Visual-Spatial & Reasoning": {
        "WAIS-IV": {
            subtests: [
                "Block Design",
                "Visual Puzzles",
                "Matrix Reasoning",
                "Figure Weights",
                "Picture Completion"
            ]
        },
        "WISC-V": {
            subtests: [
                "Block Design",
                "Visual Puzzles",
                "Matrix Reasoning",
                "Figure Weights",
                "Picture Concepts"
            ]
        },
        "WASI-II": {
            subtests: [
                "Block Design",
                "Matrix Reasoning"
            ]
        },
        "WJ-IV COG": {
            subtests: [
                "Visualization",
                "Picture Recognition"
            ]
        },
        "NEPSY-II": {
            subtests: [
                "Arrows",
                "Block Construction",
                "Design Copying",
                "Geometric Puzzles"
            ]
        },
        "Hooper VOT": {
            subtests: [
                "Total Score"
            ]
        },
        "Benton JLO": {
            subtests: [
                "Total Score"
            ]
        }
    },

    "Verbal Memory": {
        "CVLT-3": {
            subtests: [
                "Trial 1",
                "Trial 5",
                "List A Total (1-5)",
                "List B",
                "Short-Delay Free Recall",
                "Short-Delay Cued Recall",
                "Long-Delay Free Recall",
                "Long-Delay Cued Recall",
                "Recognition Hits",
                "Recognition False Positives",
                "Total Intrusions",
                "Total Repetitions",
                "Semantic Clustering",
                "Serial Clustering",
                "Learning Slope",
                "Discriminability (d')"
            ]
        },
        "CVLT-C": {
            subtests: [
                "Trial 1-5 Total",
                "Short-Delay Free Recall",
                "Long-Delay Free Recall",
                "Recognition"
            ]
        },
        "RAVLT": {
            subtests: [
                "Trial 1",
                "Trial 5",
                "Total (1-5)",
                "Trial B",
                "Trial 6",
                "Trial 7",
                "Recognition"
            ]
        },
        "WMS-IV": {
            subtests: [
                "Logical Memory I - Immediate",
                "Logical Memory I - Recall",
                "Logical Memory I - Recognition",
                "Logical Memory II - Delayed",
                "Logical Memory II - Recognition",
                "Verbal Paired Associates I - Immediate",
                "Verbal Paired Associates II - Delayed",
                "Verbal Paired Associates II - Recognition"
            ]
        },
        "HVLT-R": {
            subtests: [
                "Trial 1",
                "Trial 2",
                "Trial 3",
                "Total Recall",
                "Delayed Recall",
                "Recognition",
                "Retention (%)"
            ]
        },
        "WJ-IV COG": {
            subtests: [
                "Story Recall",
                "Story Recall-Delayed"
            ]
        },
        "WRAML-2": {
            subtests: [
                "Story Memory",
                "Story Memory Recognition",
                "Verbal Learning"
            ]
        },
        "NEPSY-II": {
            subtests: [
                "Memory for Names",
                "Memory for Names Delayed",
                "Narrative Memory Free Recall",
                "Narrative Memory Recognition",
                "Sentence Repetition",
                "Word List Interference - Repetition",
                "Word List Interference - Recall",
                "Word List Interference - Delayed"
            ]
        }
    },

    "Visual Memory": {
        "RCFT": {
            subtests: [
                "Copy",
                "Immediate Recall",
                "Delayed Recall",
                "Recognition"
            ]
        },
        "BVMT-R": {
            subtests: [
                "Trial 1",
                "Trial 2",
                "Trial 3",
                "Total Recall",
                "Delayed Recall",
                "Recognition",
                "Discrimination Index"
            ]
        },
        "WMS-IV": {
            subtests: [
                "Visual Reproduction I - Immediate",
                "Visual Reproduction I - Copy",
                "Visual Reproduction II - Delayed",
                "Visual Reproduction II - Recognition",
                "Designs I - Immediate",
                "Designs I - Content",
                "Designs II - Delayed",
                "Designs II - Content",
                "Designs II - Recognition"
            ]
        },
        "WRAML-2": {
            subtests: [
                "Design Memory",
                "Design Memory Recognition",
                "Picture Memory",
                "Picture Memory Recognition"
            ]
        },
        "WJ-IV COG": {
            subtests: [
                "Picture Recognition"
            ]
        },
        "NEPSY-II": {
            subtests: [
                "Memory for Designs",
                "Memory for Designs Delayed",
                "Memory for Faces",
                "Memory for Faces Delayed"
            ]
        }
    },

    "Executive Functions": {
        "D-KEFS": {
            subtests: [
                "Trail Making Test - Number-Letter Switching",
                "Trail Making Test - Motor Speed",
                "Verbal Fluency - Letter Fluency",
                "Verbal Fluency - Category Fluency",
                "Verbal Fluency - Category Switching",
                "Design Fluency - Filled Dots",
                "Design Fluency - Empty Dots",
                "Design Fluency - Switching",
                "Color-Word Interference - Inhibition",
                "Color-Word Interference - Inhibition/Switching",
                "Sorting Test - Confirmed Correct Sorts",
                "Sorting Test - Free Sorting Description",
                "Tower Test - Total Achievement",
                "Twenty Questions - Total Questions",
                "Word Context - Total Consecutively Correct",
                "Proverb Test - Total Achievement"
            ]
        },
        "WCST": {
            subtests: [
                "Categories Completed",
                "Perseverative Errors",
                "Perseverative Responses",
                "Non-Perseverative Errors",
                "Conceptual Level Responses",
                "Failure to Maintain Set"
            ]
        },
        "Stroop": {
            subtests: [
                "Word Reading",
                "Color Naming",
                "Color-Word",
                "Interference Score"
            ]
        },
        "COWAT": {
            subtests: [
                "FAS Total",
                "Animals",
                "Boys Names"
            ]
        },
        "Trail Making Test": {
            subtests: [
                "Part A",
                "Part B",
                "Part B-A"
            ]
        },
        "Hayling Test": {
            subtests: [
                "Section A Time",
                "Section B Time",
                "Section B Errors"
            ]
        },
        "Brixton Test": {
            subtests: [
                "Total Errors"
            ]
        },
        "BRIEF-A": {
            subtests: [
                "Inhibit",
                "Self-Monitor",
                "Plan/Organize",
                "Shift",
                "Initiate",
                "Task Monitor",
                "Emotional Control",
                "Working Memory",
                "Organization of Materials"
            ]
        },
        "WJ-IV COG": {
            subtests: [
                "Concept Formation",
                "Planning"
            ]
        },
        "NEPSY-II": {
            subtests: [
                "Animal Sorting",
                "Clocks",
                "Inhibition - Inhibition",
                "Inhibition - Switching",
                "Statue",
                "Word Generation - Semantic",
                "Word Generation - Initial Letter"
            ]
        }
    },

    "Language": {
        "Boston Naming Test": {
            subtests: [
                "Total Correct",
                "Semantic Cues",
                "Phonemic Cues"
            ]
        },
        "WAIS-IV": {
            subtests: [
                "Vocabulary",
                "Information",
                "Comprehension",
                "Similarities"
            ]
        },
        "Token Test": {
            subtests: [
                "Total Score"
            ]
        },
        "Peabody Picture Vocabulary Test (PPVT-4)": {
            subtests: [
                "Total Score"
            ]
        },
        "Expressive Vocabulary Test (EVT-2)": {
            subtests: [
                "Total Score"
            ]
        },
        "CELF-5": {
            subtests: [
                "Sentence Comprehension",
                "Word Classes",
                "Formulated Sentences",
                "Recalling Sentences",
                "Semantic Relationships"
            ]
        },
        "WJ-IV COG": {
            subtests: [
                "Oral Vocabulary",
                "Picture Vocabulary",
                "Oral Comprehension",
                "Understanding Directions"
            ]
        },
        "NEPSY-II": {
            subtests: [
                "Body Part Naming",
                "Comprehension of Instructions",
                "Oromotor Sequences",
                "Phonological Processing",
                "Repetition of Nonsense Words",
                "Speeded Naming",
                "Word Generation"
            ]
        },
        "WAB-R": {
            subtests: [
                "Spontaneous Speech",
                "Auditory Verbal Comprehension",
                "Repetition",
                "Naming"
            ]
        }
    },

    "Motor Functions": {
        "Grooved Pegboard": {
            subtests: [
                "Dominant Hand",
                "Non-Dominant Hand"
            ]
        },
        "Finger Tapping Test": {
            subtests: [
                "Dominant Hand",
                "Non-Dominant Hand"
            ]
        },
        "Grip Strength": {
            subtests: [
                "Dominant Hand",
                "Non-Dominant Hand"
            ]
        },
        "Purdue Pegboard": {
            subtests: [
                "Dominant Hand",
                "Non-Dominant Hand",
                "Both Hands",
                "Assembly"
            ]
        },
        "NEPSY-II": {
            subtests: [
                "Fingertip Tapping",
                "Imitating Hand Positions",
                "Manual Motor Sequences",
                "Visuomotor Precision"
            ]
        }
    },

    "Mood & Personality": {
        "MMPI-2-RF": {
            subtests: [
                "Depression (RCd)",
                "Somatic Complaints (RC1)",
                "Low Positive Emotions (RC2)",
                "Cynicism (RC3)",
                "Antisocial Behavior (RC4)",
                "Ideas of Persecution (RC6)",
                "Dysfunctional Negative Emotions (RC7)",
                "Aberrant Experiences (RC8)",
                "Hypomanic Activation (RC9)"
            ]
        },
        "PAI": {
            subtests: [
                "Somatic Complaints (SOM)",
                "Anxiety (ANX)",
                "Anxiety-Related Disorders (ARD)",
                "Depression (DEP)",
                "Mania (MAN)",
                "Paranoia (PAR)",
                "Schizophrenia (SCZ)",
                "Borderline Features (BOR)",
                "Antisocial Features (ANT)",
                "Alcohol Problems (ALC)",
                "Drug Problems (DRG)"
            ]
        },
        "BDI-II": {
            subtests: [
                "Total Score"
            ]
        },
        "BAI": {
            subtests: [
                "Total Score"
            ]
        },
        "STAI": {
            subtests: [
                "State Anxiety",
                "Trait Anxiety"
            ]
        },
        "PCL-5": {
            subtests: [
                "Total Score",
                "Intrusion",
                "Avoidance",
                "Negative Alterations",
                "Arousal"
            ]
        }
    },

    "Adaptive/Daily Functioning": {
        "Vineland-3": {
            subtests: [
                "Communication",
                "Daily Living Skills",
                "Socialization",
                "Motor Skills"
            ]
        },
        "ABAS-3": {
            subtests: [
                "Conceptual",
                "Social",
                "Practical"
            ]
        }
    },

    "Achievement": {
        "WRAT-5": {
            subtests: [
                "Word Reading",
                "Sentence Comprehension",
                "Spelling",
                "Math Computation"
            ]
        },
        "WJ-IV ACH": {
            subtests: [
                "Letter-Word Identification",
                "Applied Problems",
                "Spelling",
                "Passage Comprehension",
                "Calculation",
                "Writing Samples",
                "Word Attack",
                "Reading Recall",
                "Math Facts Fluency",
                "Sentence Reading Fluency",
                "Reading Vocabulary"
            ]
        },
        "WIAT-4": {
            subtests: [
                "Word Reading",
                "Essay Composition",
                "Reading Comprehension",
                "Math Problem Solving",
                "Alphabet Writing Fluency",
                "Sentence Composition",
                "Spelling",
                "Math Fluency - Addition",
                "Math Fluency - Subtraction",
                "Math Fluency - Multiplication",
                "Orthographic Fluency",
                "Decoding Fluency",
                "Oral Reading Fluency"
            ]
        }
    },

    "Premorbid Functioning": {
        "TOPF": {
            subtests: [
                "Total Score"
            ]
        },
        "WTAR": {
            subtests: [
                "Total Score"
            ]
        },
        "NART": {
            subtests: [
                "Total Score"
            ]
        },
        "Barona": {
            subtests: [
                "Estimated FSIQ"
            ]
        }
    },

    "Symptom Validity": {
        "TOMM": {
            subtests: [
                "Trial 1",
                "Trial 2",
                "Retention"
            ]
        },
        "RDS": {
            subtests: [
                "Total Score"
            ]
        },
        "VSVT": {
            subtests: [
                "Easy Items",
                "Difficult Items",
                "Total Score"
            ]
        },
        "MSVT": {
            subtests: [
                "Immediate Recognition",
                "Delayed Recognition",
                "Consistency"
            ]
        },
        "Green's WMT": {
            subtests: [
                "Immediate Recognition",
                "Delayed Recognition",
                "Consistency",
                "Multiple Choice",
                "Paired Associates"
            ]
        }
    }
};

// Performance range definitions for graph coloring
const PerformanceRanges = [
    { min: 0, max: 2, label: "Extremely Low", color: "#dc3545", bgColor: "rgba(220, 53, 69, 0.15)" },
    { min: 2, max: 9, label: "Borderline/Low", color: "#fd7e14", bgColor: "rgba(253, 126, 20, 0.15)" },
    { min: 9, max: 25, label: "Low Average", color: "#ffc107", bgColor: "rgba(255, 193, 7, 0.15)" },
    { min: 25, max: 75, label: "Average", color: "#28a745", bgColor: "rgba(40, 167, 69, 0.15)" },
    { min: 75, max: 91, label: "High Average", color: "#20c997", bgColor: "rgba(32, 201, 151, 0.15)" },
    { min: 91, max: 98, label: "Superior", color: "#17a2b8", bgColor: "rgba(23, 162, 184, 0.15)" },
    { min: 98, max: 100, label: "Very Superior", color: "#6610f2", bgColor: "rgba(102, 16, 242, 0.15)" }
];

// Helper function to get performance range for a percentile
function getPerformanceRange(percentile) {
    if (percentile === null || percentile === undefined || isNaN(percentile)) {
        return null;
    }

    for (let range of PerformanceRanges) {
        if (percentile >= range.min && percentile < range.max) {
            return range;
        }
        if (percentile === 100 && range.max === 100) {
            return range;
        }
    }
    return PerformanceRanges[3]; // Default to Average
}

// Helper function to get performance descriptor
function getPerformanceDescriptor(percentile) {
    const range = getPerformanceRange(percentile);
    return range ? range.label : "N/A";
}
