# 23DWF1_multi-bandits_G5
Repository for the programming project of Group 5. Here, the n-armed bandit problem was presented in the form of a 
single-page application. It is possible to play the game and compare different algorithms.

## How to start the application
The following describes how to start the application in the terminal.

1. Clone the repository:
   ```bash
   git clone
    ```
   

2. Navigate to the project directory:
   ```bash
   cd 23DWF1_multi-bandits_G5
   ```
   

3. Ensure you have Node.js and npm installed. You can check by running:
   ```bash
    node -v
    npm -v
    ```
    If not installed, download and install them from [Node.js official website](https://nodejs.org/).


4. Install the dependencies:
   ```bash
    npm install
    ```
   

5. Start the development server:
    ```bash
    npm run dev
    ```
   

6. Open your web browser and navigate to the URL provided in the terminal (usually `http://localhost:5173`).


7. You should now see the application running in your browser.


## Git conventions

This documentation describes the conventions for branches, commits, and the definition of done (DoD) in the project.

---

### Branches

**Naming scheme:**

`[type]/[ticket-number]-[brief-description]`


**Types:**
- `feature` – New functionality
- `bugfix` – Correction of bugs
- `refactor` – Code refactoring
- `test` – Create or customize tests
- `orga` – Organizational changes


---

### Commits

**Naming scheme:**

`[type]: [brief-description]`

**Types:**
- `LO` – Logic change
- `UI` – Changes to the user interface
- `DOC` – Documentation
- `TEST` – Tests
- `CHORE` – Organizational changes, setup, libraries, dependencies

---

### Definition of Done (DoD)

A ticket is considered closed when:
- At least 80% test coverage has been achieved
- All acceptance criteria for the ticket have been met
- Non-self-explanatory code sections have been sufficiently documented
- The solution to the ticket has been documented in text form in the ticket
- Current functions are not impaired
- The change has been functionally tested

## Used Technologies
The following technologies were used to develop the application:

| Category                    | Technology   |
|-----------------------------|--------------|
| **Programming language**    | JavaScript   |
| **Runtime**                 | Node.js      |
| **Package manager**         | npm          |
| **Build tool / Dev server** | Vite         |
| **UI library**              | React        |
| **Component library**       | shadcn/ui    |
| **CSS framework**           | Tailwind CSS |
| **Charting library**        | Recharts     |
| **Test runner**             | Vitest       |
