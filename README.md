# Massachusetts CSL Practice

This project is meant to provide a exam like practice scenario for an actual Massachusetts CSL Examination. It takes in crowd-sourced
questions from google sheets and randomizes the question. There is also a timer involved to simulate actual practice scenarios.

## Features
- Ability to take a practice version where answers are provided after completion
- Practice exam version will have a timer and answers are only provided at completion of the examination

## TODO
- Components
  - Questions
    - P + UL + LI + Form
    - Radio Buttons
    - Next + Previous Button
  - Navigation
    - Timer (if Exam)
    - Home (Will Cancel Current Examination)
- Home
  - Choose to whether take a practice version or examination version
- Global State Management
  - Zustand
  - Question Slice
    - Contains answers
    - Selector will scramble  