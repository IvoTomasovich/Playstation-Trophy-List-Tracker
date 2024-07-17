import { auth, db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const container = document.getElementById('container'); // Assuming you have a container to hold all tables

function createTable() {
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

function AddAllItemsToTables(games) {
    container.innerHTML = ""; // Clear existing tables
    console.log("Games data received:", games); // Log games data

    games.forEach(game => {
        const gameName = Object.keys(game)[0];
        const trophies = game[gameName];

        // Skip if trophies array is empty or not an array
        if (!Array.isArray(trophies) || trophies.length === 0) {
            console.warn(`Skipping empty trophy list for game: ${gameName}`);
            return;
        }

        // Remove "Trophy Guide" from game name
        const displayName = gameName.replace(' Trophy Guide', '');

        // Create a new table for each game
        const tbody = createTable();

        // Create a caption for the table
        const caption = document.createElement('caption');
        caption.textContent = displayName;
        tbody.parentNode.insertBefore(caption, tbody);

        // Log the game data to debug structure issues
        console.log("Game data:", game);

        // Iterate over the trophies array
        trophies.forEach(trophy => {
            const trophyName = trophy.trophyName;
            const trophyDescription = trophy.trophyDescription;

            // Log each trophy to debug
            console.log(`Adding trophy: ${trophyName} - ${trophyDescription} for game ${displayName}`);
            AddItemToTable(tbody, displayName, trophyName, trophyDescription);
        });
    });
}

async function GetUserTrophies(uid) {
    try {
        console.log("Fetching trophies for user UID:", uid); // Log UID
        const docRef = doc(db, "trophylist", uid);
        const docSnap = await getDoc(docRef);
        const displaytrophylist = [];

        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("Document data:", docSnap.id, " => ", data); // Log the document data

            // Extract all trophy lists from the document
            Object.keys(data).forEach(gameKey => {
                const gameTrophies = data[gameKey];
                displaytrophylist.push({ [gameKey]: gameTrophies });
            });

            AddAllItemsToTables(displaytrophylist);
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error getting documents:", error);
    }
}

auth.onAuthStateChanged(user => {
    if (user) {
        console.log("User is signed in:", user);
        GetUserTrophies(user.uid);
    } else {
        console.log("No user is signed in.");
    }
});
