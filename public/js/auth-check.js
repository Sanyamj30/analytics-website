// --- File: js/auth-check.js (Final Simplified Version) ---

document.addEventListener('DOMContentLoaded', () => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');

        const guestElements = document.querySelectorAll('.guest-link');
        const authElements = document.querySelectorAll('.auth-link');

        if (user && token) {
            // ACTION: User is Logged In
            // HIDE the 'Sign In' span and SHOW the 'My Account' span.
            guestElements.forEach(el => el.style.display = 'none');
            authElements.forEach(el => el.style.display = 'inline-block');
        } else {
            // ACTION: User is a Guest
            // SHOW the 'Sign In' span and HIDE the 'My Account' span.
            guestElements.forEach(el => el.style.display = 'inline-block');
            authElements.forEach(el => el.style.display = 'none');
        }
        
        // Attaches the logout functionality to the logout button inside the dropdown.
        document.querySelectorAll('.logout-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                window.location.href = 'auth.html'; // Redirect to login page
            });
        });
    } catch (error) {
        console.error("Authentication check failed:", error);
    }
});