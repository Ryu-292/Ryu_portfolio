// Select the toggle button and menu
const toggleButton = document.getElementById('mobile-menu');
const menu = document.querySelector('.navbar__menu');

// Add click event listener to the toggle button
toggleButton.addEventListener('click', () => {
    menu.classList.toggle('active'); // Toggle the 'active' class on the menu
});

window.addEventListener('load', () => {
    const hiddenImage = document.querySelector('.hidden-image img');
    hiddenImage.style.display = 'block'; // Ensure it's loaded but hidden
});

document.addEventListener("DOMContentLoaded", () => {
    // Add the class to trigger the animation
    document.body.classList.add("loaded");
});


function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("Copied to clipboard: " + text);
    }).catch(err => {
        console.error("Failed to copy: ", err);
    });
}






