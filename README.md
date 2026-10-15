# MOOC Centre

Practice quizzes for MOOC assignments, with step-by-step solutions. Static site (no build step) hosted on GitHub Pages.

## Courses
- **Applied Linear Algebra (ALA)** - Assignments 1-11 (10 MCQs each) plus a combined 110-question quiz.
- **Wildlife Ecology** - Weeks 1-12 (120 questions, one-line explanations) plus a combined quiz.
- **Introduction to Internet of Things** - Weeks 1-12 (180 questions, includes multiple-answer questions) plus a combined quiz.

## Features
- Practice mode (instant feedback + Step 1, Step 2... solution) and Test mode (submit, then review)
- Combined quiz with question count + shuffle
- Best score saved in the browser

## Adding a course / assignment
1. Add the course in `js/core.js` (`COURSES`).
2. Add `data/<course>-<n>.js` calling `addSet('<course>', n, {title, questions:[{q, o:[4 options], a:correctIndex, s:[steps]}]})`.
3. Include the new data script in `course.html` and `quiz.html`.

Math is rendered with KaTeX (vendored in `vendor/katex`).
- **Environment and Development** (120), **Forests and Their Management** (136), **Psychology of Learning** (130), **The Joy of Computing using Python** (220, scenario/code based) and **Understanding Incubation and Entrepreneurship** (110) - with explanations.
- **IoT previous years:** 2022 (Weeks 1-9, 11-12, with Week 3 transcribed from portal screenshots), 2023 (Weeks 0-12), 2024 (Weeks 1-12) and 2025 (Weeks 0-12) with a combined quiz per year.
