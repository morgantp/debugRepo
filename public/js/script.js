const usernameField = document.querySelector('#username');
const signUpSubmit = document.querySelector('#signUpSubmit');
const password = document.querySelector('#password');
const confirmPassword = document.querySelector('#confirmpassword');

if(typeof (signUpSubmit) != 'undefined' && signUpSubmit != null) {
signUpSubmit.addEventListener('click', (e) => {
    if(usernameField.value === "") {
        e.preventDefault();
        window.alert('Form Requires username');
    }
    if(password.value != confirmPassword.value) {
        e.preventDefault();
        window.alert('Passwords do not match');
    }
});
}

const messageContainer = document.querySelector( '.messageContainer');
const queryString = window.location.search;

if(queryString == '?incorrectLogin' ) {
    messageContainer.innerHTML = `<div class ="card panel red">Incorrect Login Details</div>`; //doesnt work
}

if(queryString == '?contactSaved' ) {
    messageContainer.innerHTML = `<div class ="card panel green">Contact Saved</div>`; //doesnt work
}

const navBrand = document.querySelector('.navbar-brand');
navBrand.addEventListener('mouseenter', addBounce);
navBrand.addEventListener('animationend', removeBounce);

const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(navLink => navLink.addEventListener('mouseenter', addBounce));
navLinks.forEach(navLink => navLink.addEventListener('animationend', removeBounce));

function addBounce(e){
  this.classList.add('animated', 'bounce');
}

function removeBounce(e){
  this.classList.remove('animated', 'bounce');
}