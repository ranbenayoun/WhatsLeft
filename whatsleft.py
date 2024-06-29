import tkinter as tk
from tkinter import filedialog, messagebox
import PyPDF2
import re
import json

def load_grades(file_path):
    """
    Load grades from a JSON file. The JSON file should contain course categories and their respective courses and grades.
    
    Parameters:
    file_path (str): The path to the grades JSON file.
    
    Returns:
    dict: A dictionary with course categories as keys and dictionaries of course codes and grades as values.
    """
    with open(file_path, 'r') as file:
        grades = json.load(file)
    return grades

def extract_text_from_pdf(pdf_path):
    """
    Extract text from a PDF file.
    
    Parameters:
    pdf_path (str): The path to the PDF file.
    
    Returns:
    str: The extracted text from the PDF.
    """
    from PyPDF2 import PdfReader

    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text

def parse_courses_and_grades(text):
    """
    Parse courses, points, and grades from the extracted PDF text.
    Assumes course codes are 6 digits followed by the number of points and grades.
    
    Parameters:
    text (str): The extracted text from the PDF.
    
    Returns:
    list: A list of dictionaries with course information.
    """
    courses = []
    pattern = re.compile(r'(\d{6})\s([\d\.]+)\s([^\s]+)')
    for match in pattern.finditer(text):
        course_number, points, grade = match.groups()
        points = float(points)
        if grade.isdigit():
            grade = int(grade)
            if grade > 55:
                passing = True
            else:
                passing = False
        else:
            if "פטור" in grade or "עבר" in grade:
                passing = True
            else:
                passing = False
        courses.append({
            'course_number': course_number,
            'points': points,
            'grade': grade,
            'passing': passing
        })
    return courses

def compare_grades(pdf_courses, json_grades):
    """
    Compare grades from the PDF with grades from the JSON file.
    
    Parameters:
    pdf_courses (list): A list of dictionaries with course information extracted from the PDF.
    json_grades (dict): A dictionary of grades loaded from the JSON file.
    
    Returns:
    str: A string summarizing the comparison results.
    """
    comparison_result = ""
    for category, courses in json_grades.items():
        comparison_result += f"Category: {category}\n"
        for course_number, expected_grade in courses.items():
            pdf_course = next((course for course in pdf_courses if course['course_number'] == course_number), None)
            if pdf_course:
                pdf_grade = pdf_course['grade']
                passing_status = "Passing" if pdf_course['passing'] else "Not Passing"
                comparison_result += f"  Course {course_number}: PDF Grade = {pdf_grade}, Expected Grade = {expected_grade}, Status = {passing_status}\n"
            else:
                comparison_result += f"  Course {course_number}: Not Found in PDF\n"
    return comparison_result

def upload_pdf():
    """
    Handle the PDF file upload and comparison process.
    """
    pdf_path = filedialog.askopenfilename(filetypes=[("PDF files", "*.pdf")])
    if not pdf_path:
        return

    json_path = filedialog.askopenfilename(filetypes=[("JSON files", "*.json")])
    if not json_path:
        return

    text = extract_text_from_pdf(pdf_path)
    pdf_courses = parse_courses_and_grades(text)
    json_grades = load_grades(json_path)

    comparison_result = compare_grades(pdf_courses, json_grades)
    messagebox.showinfo("Comparison Result", comparison_result)

def create_gui():
    """
    Create the main GUI window for the application.
    """
    root = tk.Tk()
    root.title("Grade Comparison Tool")
    root.geometry("400x300")  # Set window size to be 4 times bigger

    label = tk.Label(root, text="נא הכנס גליון ציונים בעברית", font=("Helvetica", 16))
    label.pack(pady=20)

    upload_button = tk.Button(root, text="Upload PDF and JSON", command=upload_pdf, font=("Helvetica", 14))
    upload_button.pack(pady=20)

    root.mainloop()

if __name__ == "__main__":
    create_gui()