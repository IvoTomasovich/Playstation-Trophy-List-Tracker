import { auth, db } from "./firebase.js";
import { doc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // Element references
    const button2 = document.getElementById('button2');
    const button3 = document.getElementById('button3');
    const outputDiv = document.getElementById('output');
    const gameNameDiv = document.getElementById('gamename');
    const askuser = document.getElementById('question');

    // Event listener for button2 click
    button2.addEventListener('click', async () => {
        // Fetch URL value from input
        const url = document.getElementById('GameLink').value;

        try {
            // Fetch HTML from the server
            const response = await fetch(`http://localhost:3000/fetch?url=${encodeURIComponent(url)}`);
            const html = await response.text();

            // Parse HTML response
            const parser = new DOMParser();
            const parsedDoc = parser.parseFromString(html, 'text/html');
            const gameNameElement = parsedDoc.querySelector("#desc-name");
            const gameName = gameNameElement.textContent.trim();
            const trophyElements = parsedDoc.querySelectorAll("div.trophy.flex.v-align");
            const trophies = Array.from(trophyElements).map(element => {
                const trophyName = element.querySelector("a.title").textContent.trim();
                const trophyDescription = element.querySelector("span.small-info").textContent.trim();
                return { trophyName, trophyDescription, gameName }; // Include gameName in each trophy object
            });

            // Store trophies in user's account
            await storeTrophiesInUserAccount(trophies);

            // Update outputDiv with success message
            if (outputDiv) {
                outputDiv.innerHTML = '<div class="centered-bold-message">Trophies stored successfully in your account.</div>';
            } else {
                console.error('OutputDiv is null.');
            }

            // Update gameNameDiv and clear the question
            if (gameNameDiv) {
                gameNameDiv.innerHTML = gameName;
            } else {
                console.error('GameNameDiv is null.');
            }
            
            if (askuser) {
                askuser.innerHTML = ''; // Clear the question
            } else {
                console.error('Askuser is null.');
            }

            // Hide buttons after operation
            if (button2) {
                button2.style.display = 'none';
            } else {
                console.error('Button2 is null.');
            }

            if (button3) {
                button3.style.display = 'none';
            } else {
                console.error('Button3 is null.');
            }
        } catch (error) {
            console.error('Error:', error);

            // Update outputDiv with error message
            if (outputDiv) {
                outputDiv.innerHTML = '<div class="centered-bold-message">An error occurred while storing the trophies.</div>';
            } else {
                console.error('OutputDiv is null.');
            }
        }
    });

    // Event listener for button3 click
    button3.addEventListener('click', () => {
        // Update outputDiv with cancellation message
        if (outputDiv) {
            outputDiv.innerHTML = '<div class="centered-bold-message">You chose not to store the information.</div>';
        } else {
            console.error('OutputDiv is null.');
        }

        // Clear the question
        if (askuser) {
            askuser.innerHTML = '';
        } else {
            console.error('Askuser is null.');
        }

        // Hide buttons after operation
        if (button2) {
            button2.style.display = 'none';
        } else {
            console.error('Button2 is null.');
        }

        if (button3) {
            button3.style.display = 'none';
        } else {
            console.error('Button3 is null.');
        }
    });
});

// Function to store trophies in the user's account
async function storeTrophiesInUserAccount(trophies) {
    const user = auth.currentUser;

    if (user) {
        const userId = user.uid;
        const trophyListRef = doc(db, "trophylist", userId); // Reference to the "trophylist" document for the current user

        try {
            // Prepare an object to update the document with gameName and trophies
            const trophiesWithGameName = trophies.map(trophy => ({
                gameName: trophy.gameName,
                trophyName: trophy.trophyName,
                trophyDescription: trophy.trophyDescription
            }));

            // Using arrayUnion to append trophies to the existing array in the document
            await updateDoc(trophyListRef, {
                [trophies[0].gameName]: arrayUnion(...trophiesWithGameName) // Append all trophies under the gameName
            });

            console.log('Trophies stored:', trophiesWithGameName);
        } catch (error) {
            console.error('Error storing trophies:', error);
        }
    } else {
        console.error('No user is signed in.');
    }
}
