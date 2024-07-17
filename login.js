// login.js

import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js"; // Ensure signOut is imported
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Function to register a new user
window.register = async function register() {
  console.log("Register function called");

  // Get all our input fields
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const username = document.getElementById('user').value;

  console.log("Inputs:", email, password, username);

  // Validate input fields
  if (!validate_email(email) || !validate_password(password)) {
    alert('Email or Password is Outta Line!!');
    return;
  }

  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User created:", user);

    // Add user info to Firestore
    await setDoc(doc(db, "users", user.uid), {
      username: username,
      email: email,
      id: user.uid
    });
    console.log("User info added to Firestore");

    // Initialize trophy list document with an empty structure
    await setDoc(doc(db, "trophylist", user.uid), {});
    console.log("Trophy list initialized in Firestore");

    // Redirect to index.html
    window.location.href = "index.html";
  } catch (error) {
    console.error("Error:", error);
    alert(error.message);
  }
}

// Function to log in an existing user
window.login = async function login() {
  console.log("Login function called");

  // Get all our input fields
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  console.log("Inputs:", email, password);

  // Validate input fields
  if (!validate_email(email) || !validate_password(password)) {
    alert('Email or Password is Outta Line!!');
    return;
  }

  try {
    // Sign in with email and password
    await signInWithEmailAndPassword(auth, email, password);
    console.log("User signed in");

    // Redirect to index.html
    window.location.href = "index.html";
  } catch (error) {
    console.error("Error:", error);
    alert(error.message);
  }
}

// Function to sign out the current user
window.signOutUser = async function signOutUser() {
  try {
    await signOut(auth);
    console.log("User signed out");
    // Redirect to login.html or any other desired page
    window.location.href = "login.html";
  } catch (error) {
    console.error("Error signing out:", error);
    alert("Error signing out. Please try again.");
  }
}

// Validate Functions
function validate_email(email) {
  const expression = /^[^@]+@\w+(\.\w+)+\w$/;
  return expression.test(email);
}

function validate_password(password) {
  return password.length >= 6;
}
