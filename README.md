# Trophy Collection Site v1

## Overview

This project is a web application that allows users to log in, register, and manage their trophy collections. Users can add trophies to their accounts by providing links from PSNProfiles trophy guides, and the site will scrape the necessary information to display and store it.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- User registration and authentication using Firebase.
- Secure login/logout functionality.
- Ability to add trophy details by scraping data from provided links.
- View and manage stored trophy collections.

## Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: Firebase Firestore
- Other Libraries: Axios, Cheerio
- Build Tool: Vite
- Environment Variables: dotenv

## Setup Instructions

### Prerequisites

- Node.js and npm installed on your local machine.
- Firebase account and project set up.
- PSNProfiles account (optional, for adding trophy links).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/trophy-collection-site-v1.git
   cd trophy-collection-site-v1


### Install the dependencies:
npm install

 ### Set up Firebase:

Create a new Firebase project in the Firebase console.
Enable Firestore and Authentication in your Firebase project.
Add your Firebase project configuration to a .env file in the root directory:
makefile
Copy code
VITE_API_KEY=your_firebase_api_key
VITE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_APP_ID=your_app_id
VITE_MEASUREMENT_ID=your_measurement_id

### Start the proxy server:


npm run start

### Build and run the frontend:

npm run dev

### Description of Key Files
index.html: Main landing page for adding trophies.
login.html: Login and registration page.
user_trophies.html: Page to view the user's trophy collection.
app/firebase.js: Firebase configuration and initialization.
app/login.js: Handles user registration, login, and logout functionalities.
app/displaytrophies.js: Displays the user's stored trophies.
app/yesorno.js: Handles the scraping and storing of trophy data from provided links.
styles/login.css: CSS for styling the login page.
styles/usertrophies.css: CSS for styling the user trophies page.
server/proxy.mjs: Node.js Express server to handle cross-origin requests for scraping.

### Usage
Open the login.html page to register or log in.
Once logged in, navigate to index.html to add trophies to your account by providing a PSNProfiles link.
View your stored trophies on the user_trophies.html page.
