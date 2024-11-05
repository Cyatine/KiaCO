// Menu Button Functionality
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", (e) => {
  navLinks.classList.toggle("open");

  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
});

// Close menu on link click
navLinks.addEventListener("click", (e) => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-line");
});

// JavaScript for Profile Icon
document.addEventListener('DOMContentLoaded', function() {
  // Retrieve the username from localStorage or use a default
  const username = localStorage.getItem('username');
  console.log("Retrieved username from localStorage:", username); // Debugging line

  // Check if username exists in localStorage
  if (username) {
    console.log("Username found in localStorage:", username);
    // Display the first letter of the username as the profile icon initial
    const profileInitial = document.getElementById('profileInitial');
    if (profileInitial) {
      profileInitial.textContent = username.charAt(0).toUpperCase(); // Set to the first letter
    }
  } else {
    console.log("No username found in localStorage, using default.");
    // You can also set a default or handle as per your requirements
    const profileInitial = document.getElementById('profileInitial');
    if (profileInitial) {
      profileInitial.textContent = 'U'; // Default initial
    }
  }
});

// Toggle dropdown functionality for profile icon
function toggleDropdown() {
  const profileIcon = document.getElementById('profileIcon');
  profileIcon.classList.toggle('active');
}

// Logout function
function logout() {
  localStorage.removeItem('username');
  console.log("Username removed from localStorage."); // Debugging line
  // Redirect to the login page in a specific folder
  window.location.href = '/Username and Login Codes/Username.Html'; // absolute path
}

// Login function to save the username and redirect
function loginUser() {
  const usernameInput = document.getElementById('username').value;
  if (usernameInput) {
    // Store the username in local storage
    localStorage.setItem('username', usernameInput);
    console.log("Stored username in localStorage:", usernameInput); // Debugging line

    // Check if the username has been successfully stored
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      console.log("Username successfully stored in localStorage:", storedUsername);
      // Redirect to Username.html in the specific folder after login
      window.location.href = '/Username and Login Codes/Username.Html';
    } else {
      console.error("Failed to store username in localStorage.");
    }
  } else {
    alert('Please enter a valid username');
  }
}

// Attach event listener to login button
document.getElementById('second-login-btn').addEventListener('click', loginUser);

// Search Functionality
const navSearch = document.getElementById("nav-search");

navSearch.addEventListener("click", (e) => {
  navSearch.classList.toggle("open");
});

// Swiper initialization without scroll effects
const swiper = new Swiper(".swiper", {
  loop: true,
});

// Product Card Redirect Functionality
const productCards = document.querySelectorAll('.product__card');

// Add click event listener to each product card
productCards.forEach((card, index) => {
  card.addEventListener('click', function () {
    // Redirect based on the product card index
    switch (index) {
      case 0:
        window.location.href = 'keycaps.html'; // Link for Keycaps
        break;
      case 1:
        window.location.href = 'keyboard60.html'; // Link for 60% Keyboard
        break;
      case 2:
        window.location.href = 'keyboard100.html'; // Link for 100% Keyboard
        break;
      case 3:
        window.location.href = 'hand-table-matt.html'; // Link for Hand Table Matt
        break;
      case 4:
        window.location.href = 'keyboard-modding.html'; // Link for Keyboard Modding Services
        break;
      case 5:
        window.location.href = 'repairs.html'; // Link for Repairs
        break;
      default:
        console.log("No valid product card found.");
        break;
    }
  });
});

// Optional: Add event listener for the dropdown toggle button (if not already handled in HTML)
const profileToggleButton = document.getElementById('profileToggleBtn'); // Replace with your actual button ID
if (profileToggleButton) {
  profileToggleButton.addEventListener('click', toggleDropdown);
}
