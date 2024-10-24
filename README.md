# Boook Recommendations📚

## Description
This web application allows users to browse New York Times (NYT) best sellers across genres like fiction, nonfiction, and science. Users can view reviews for selected books directly from the NYT API. The app addresses the common problem of book discovery by giving users quick access to current best sellers and critical reviews.

## Problem Solved
The app helps users who frequently seek new books to read by providing curated lists of best sellers with critical reviews to inform their reading choices in addition to providing relevant reviews so readers can find recommendations and choose between them all on the same site. The prooblem faced usually is looking for recommendations seperately filrering many searches for genres, bestsellers, and reviews. The site does all at once

## Features
- Browse genres like Fiction, Nonfiction, and Science.
- View best-selling books in each genre.
- Fetch and display reviews for selected books.

## Project Setup
1. Install Node.js from [Node.js](https://nodejs.org/).
2. Clone the repository.
3. Run `npx create-react-app <project-name>` in your terminal.
4. Replace the contents of the `src` folder with the project files.
5. Run `npm install` to install dependencies.

## Running the Project
1. In the project directory, run `npm start`.
2. Open [http://localhost:3000](http://localhost:3000) to view the app in the browser.

## API Integration
The app uses the **NYT Books API** to fetch:
- Current best sellers in various genres.
- Book reviews based on the selected book title.

### API Endpoints Used
- **Best Sellers:** `https://api.nytimes.com/svc/books/v3/lists/current/{genre}.json`
- **Reviews:** `https://api.nytimes.com/svc/books/v3/reviews.json`

Ensure to replace the API key in the code with your own.

## AI Assistance
AI was used moderately for generating ideas during the development process. The core code was written manually, with AI aiding in structuring components, UI ideas, and initial concepts.
