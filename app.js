import { auth } from "./firebase.js";

document.addEventListener('DOMContentLoaded', function() {
    const signOutButton = document.getElementById('signOutButton');

    if (signOutButton) {
        signOutButton.addEventListener('click', async () => {
            try {
                await auth.signOut();
                console.log('User signed out successfully');
                window.location.href = 'login.html'; // Redirect to login page after sign out
            } catch (error) {
                console.error('Error signing out:', error);
            }
        });
    }

    document.getElementById('SubmitButton').addEventListener('click', async () => {
        const url = document.getElementById('GameLink').value;
        const container = document.getElementById('contain'); // Container to hold all tables
        const askuser = document.getElementById('question');
        const button2 = document.getElementById('button2');
        const button3 = document.getElementById('button3');
        const gameNameDiv = document.getElementById('gamename'); // Div where game name is displayed

        container.innerHTML = ''; // Clear previous results
        askuser.innerHTML = ''; // Clear previous question
        button2.style.display = 'none'; // Hide button
        button3.style.display = 'none'; // Hide button

        try {
            const response = await fetch(`http://localhost:3000/fetch?url=${encodeURIComponent(url)}`);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Extract game name
            const gameNameElement = doc.querySelector("#desc-name");
            const gameName = gameNameElement ? cleanGameName(gameNameElement.textContent.trim()) : 'Unknown Game';

            // Extract trophies
            const trophyElements = doc.querySelectorAll("div.trophy.flex.v-align");
            const trophies = Array.from(trophyElements).map(element => {
                const trophyName = element.querySelector("a.title")?.textContent.trim();
                const trophyDescription = element.querySelector("span.small-info")?.textContent.trim();
                return { trophyName, trophyDescription };
            }).filter(trophy => trophy.trophyName && trophy.trophyDescription);

            // Skip creating chart if no trophies are found
            if (trophies.length === 0) {
                console.warn(`No trophies found for game: ${gameName}`);
                container.innerHTML = 'No trophies found for the specified game.';
                return;
            }

            // Create table for trophies
            const tbody = createTable(container);

            // Add a caption for the table
            const caption = document.createElement('caption');
            caption.textContent = gameName;
            tbody.parentNode.insertBefore(caption, tbody);

            // Add trophies to the table
            trophies.forEach(trophy => {
                AddItemToTable(tbody, gameName, trophy.trophyName, trophy.trophyDescription);
            });

            // Display game name and clear the previous game name
            // gameNameDiv.textContent = gameName;
            // gameNameDiv.style.display = 'block';

            // Ask user if they want to save the game to their profile
            askuser.innerHTML = "Would you like to save this game to your profile?";
            button2.style.display = "block";
            button3.style.display = "block";
            button2.innerText = "Yes";
            button3.innerText = "No";

        } catch (error) {
            console.error('Error:', error);
            container.innerHTML = 'An error occurred while fetching the data.';
        }
    });

    function cleanGameName(gameName) {
        return gameName.replace(/Trophy Guide/gi, '').trim();
    }

    function createTable(container) {
        const table = document.createElement('table');
        table.className = "trophy-table"; // Add a class for CSS styling

        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        const headerRow = document.createElement('tr');
        const headers = ['Game Name', 'Trophy Name', 'Trophy Description'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);
        table.appendChild(tbody);

        container.appendChild(table);
        return tbody;
    }

    function AddItemToTable(tbody, gameName, trophyName, trophyDescription) {
        const trow = document.createElement('tr');
        const td1 = document.createElement('td');
        const td2 = document.createElement('td');
        const td3 = document.createElement('td');

        td1.textContent = gameName;
        td2.textContent = trophyName;
        td3.textContent = trophyDescription;

        trow.appendChild(td1);
        trow.appendChild(td2);
        trow.appendChild(td3);

        tbody.appendChild(trow);
    }
});
