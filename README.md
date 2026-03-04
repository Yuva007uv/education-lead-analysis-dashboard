# education-lead-analysis-dashboard
# 📊 Education Lead Analysis Dashboard – Power BI

## 📌 Project Overview

This project analyzes 360 lead records to understand education demand trends, lead generation sources, gender distribution, and city-level performance.

The objective was to transform raw marketing lead data into meaningful business insights using Power BI.

---

## 🎯 Business Problem

Marketing teams need to identify:

* Which education program has highest demand
* Which lead source generates most leads
* Which city performs best
* Which age group to target

This dashboard helps stakeholders make data-driven decisions to improve campaign performance.

---

## 📂 Project Structure

```
education-lead-analysis-dashboard/
│
├── data/
│   ├── raw_dataset.csv
│   └── cleaned_dataset.csv
│
├── dashboard/
│   └── Education_Lead_Dashboard.pbix
│
├── dax/
│   └── measures.txt
│
├── screenshots/
│   └── dashboard_preview.png
│
└── README.md
```

---

## 🔄 Data Processing Steps

1. Imported raw dataset into Power BI
2. Cleaned null values
3. Standardized column names
4. Created calculated columns
5. Built relationships (if applicable)
6. Created DAX measures for KPI analysis

---

## 🧮 DAX Measures Used

Example measures used in the dashboard:

```
Total Leads = COUNT(Leads[Lead_ID])

Female Count = CALCULATE(COUNT(Leads[Lead_ID]), Leads[Gender] = "Female")

Lead % = DIVIDE([Total Leads], CALCULATE([Total Leads], ALL(Leads))) * 100
```

---

## 📊 Key Insights

* Total Leads: 360
* Majority Age Group: 20–25 (70%)
* Top Education Demand: B.Tech (38.6%)
* Best Lead Source: Social Media
* Top Performing City: Hyderabad
* Female Leads: 199
* Male Leads: 161

---

## 🛠 Tools & Technologies

* Power BI
* DAX
* Data Cleaning
* Data Modeling
* Data Visualization
* Excel (if used for preprocessing)

---

## 📷 Dashboard Preview

(Add dashboard screenshot here)

---

## 🚀 Future Improvements

* Add conversion rate analysis
* Add revenue tracking
* Create drill-through reports
* Publish interactive version via Power BI Service

---

## 👤 Author

Your Name
Aspiring Data Analyst | Power BI Developer
