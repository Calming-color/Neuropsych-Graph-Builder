import matplotlib.pyplot as plt
import tkinter as tk
import tkinter.messagebox as messagebox
from scipy.stats import norm

def create_plot():
    try:
        patient_name = patient_name_entry.get().strip()
        if not patient_name:
            raise ValueError("Please enter the patient's name.")

        t_scores = [int(e.get()) for e in t_score_entries]
        percentiles = [norm.cdf(score, 50, 10) * 100 for score in t_scores]
        premorbid_estimate_percentile = norm.cdf(int(premorbid_entry.get()), 50, 10) * 100
        overall_test_battery_measure_percentile = norm.cdf(int(overall_test_battery_entry.get()), 50, 10) * 100

        plt.figure(figsize=(14, 7), facecolor='#f4f4f4')
        plt.plot(domains, percentiles, marker='o', color='black', linewidth=2, label=f"{patient_name}'s Percentiles")  # Changed to black color
        plt.axhline(y=premorbid_estimate_percentile, color='r', linestyle='--', linewidth=1.5, label=f"Premorbid Estimate ({int(premorbid_estimate_percentile)}th %ile)")
        plt.axhline(y=overall_test_battery_measure_percentile, color='g', linestyle='--', linewidth=1.5, label=f"Overall Test Battery Measure ({int(overall_test_battery_measure_percentile)}th %ile)")
        plt.ylim(0, 100)
        plt.xlabel("Cognitive Domains", fontsize=12)
        plt.ylabel("Percentiles", fontsize=12)
        plt.title(f"{patient_name}'s Cognitive Test Performance", fontsize=14, fontweight='bold')
        plt.legend(loc='upper left')
        plt.xticks(rotation=45, ha="right", fontsize=10)
        plt.yticks(range(0, 101, 10), fontsize=10)
        plt.grid(axis='both', linestyle='--', linewidth=0.5, alpha=0.3)
        plt.tight_layout()
        plt.show()

    except ValueError as e:
        messagebox.showerror("Input Error", str(e))

domains = ["Attention", "Processing Speed", "Verbal Reasoning", "Visual Reasoning",
           "Verbal Memory", "Visual Memory", "Dominant Hand Sensory-Motor", "Non-Dominant Hand Sensory-Motor"]

root = tk.Tk()
root.title("Neuropsychology Report")

tk.Label(root, text="Patient Name:").pack()
patient_name_entry = tk.Entry(root)
patient_name_entry.pack()

t_score_entries = []
for domain in domains:
    tk.Label(root, text=domain + " (T-score):").pack()
    e = tk.Entry(root)
    e.pack()
    t_score_entries.append(e)

tk.Label(root, text="Premorbid Estimate (T-score):").pack()
premorbid_entry = tk.Entry(root)
premorbid_entry.pack()

tk.Label(root, text="Overall Test Battery Measure (T-score):").pack()
overall_test_battery_entry = tk.Entry(root)
overall_test_battery_entry.pack()

tk.Button(root, text="Create Plot", command=create_plot).pack()

root.mainloop()
