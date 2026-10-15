# MOOC Centre

Practice quizzes for MOOC assignments, with step-by-step solutions. Static site (no build step) hosted on GitHub Pages.

## Courses
- **Applied Linear Algebra (ALA)** - Assignments 1-11 (10 MCQs each) plus a combined 110-question quiz.
- **Wildlife Ecology** - Weeks 1-12 (120 questions, one-line explanations) plus a combined quiz.
- **Introduction to Internet of Things** - Weeks 1-11 (150 questions, includes multiple-answer questions) plus a combined quiz.

## Features
- Practice mode (instant feedback + Step 1, Step 2... solution) and Test mode (submit, then review)
- Combined quiz with question count + shuffle
- Best score saved in the browser

## Adding a course / assignment
1. Add the course in `js/core.js` (`COURSES`).
2. Add `data/<course>-<n>.js` calling `addSet('<course>', n, {title, questions:[{q, o:[4 options], a:correctIndex, s:[steps]}]})`.
3. Include the new data script in `course.html` and `quiz.html`.

Math is rendered with KaTeX (vendored in `vendor/katex`).
