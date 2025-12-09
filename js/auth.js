// js/auth.js
import { auth, provider } from './firebase.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';


const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const authForm = document.getElementById('auth-form');
const googleBtn = document.getElementById('google-signin');


if (authForm) {
authForm.addEventListener('submit', async (e) => {
e.preventDefault();
const email = emailInput.value.trim();
const pass = passwordInput.value;


try {
// try signing in first
await signInWithEmailAndPassword(auth, email, pass);
} catch (err) {
// if sign-in fails, create account
try {
await createUserWithEmailAndPassword(auth, email, pass);
} catch (err2) {
alert(err2.message || 'Auth error');
return;
}
}
window.location.href = 'dashboard.html';
});
}


if (googleBtn) {
googleBtn.addEventListener('click', async () => {
try {
await signInWithPopup(auth, provider);
window.location.href = 'dashboard.html';
} catch (err) {
alert(err.message);
}
});
}


// Redirect away from protected pages if not logged in
onAuthStateChanged(auth, (user) => {
const protectedPages = ['dashboard.html','analytics.html'];
const path = location.pathname.split('/').pop();
if (!user && protectedPages.includes(path)) {
window.location.href = 'index.html';
}
// If user is logged in and on index, go to dashboard
if (user && path === 'index.html') {
window.location.href = 'dashboard.html';
}
});