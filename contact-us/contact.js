document.addEventListener("DOMContentLoaded", function () {
    var nameInput = document.getElementById("name");
    var emailInput = document.getElementById("email");
    var phoneInput = document.getElementById("phone");
    var subjectInput = document.getElementById("subject");
    var messageInput = document.getElementById("message");
    var submitBtn = document.getElementById("submitBtn");

    var nameError = document.getElementById("nameError");
    var emailError = document.getElementById("emailError");
    var phoneError = document.getElementById("phoneError");
    var subjectError = document.getElementById("subjectError");
    var messageError = document.getElementById("messageError");

    var namePattern = /^[a-zA-Z\s]{3,12}$/;
    var phonePattern = /^[0-9]{11}$/;
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validateName() {
        var nameValue = nameInput.value.trim();
        if (nameValue === "") {
            nameError.textContent = "Please enter your name.";
        } else if (!namePattern.test(nameValue)) {
            nameError.textContent = "Name must be 3-12 characters and contain only letters.";
        } else {
            nameError.textContent = "";
        }
    }

    function validateEmail() {
        var emailValue = emailInput.value.trim();
        if (emailValue === "") {
            emailError.textContent = "Please enter your email.";
        } else if (!emailPattern.test(emailValue)) {
            emailError.textContent = "Please enter a valid email address.";
        } else {
            emailError.textContent = "";
        }
    }

    function validatePhone() {
        var phoneValue = phoneInput.value.trim();
        if (phoneValue === "") {
            phoneError.textContent = "Please enter your phone number.";
        } else if (!phonePattern.test(phoneValue)) {
            phoneError.textContent = "Phone number must be 11 digits.";
        } else {
            phoneError.textContent = "";
        }
    }

    function validateSubject() {
        var subjectValue = subjectInput.value.trim();
        if (subjectValue === "") {
            subjectError.textContent = "Please enter the subject.";
        } else {
            subjectError.textContent = "";
        }
    }

    function validateMessage() {
        var messageValue = messageInput.value.trim();
        if (messageValue === "") {
            messageError.textContent = "Please enter your message.";
        } else {
            messageError.textContent = "";
        }
    }

    function validateAll() {
        validateName();
        validateEmail();
        validatePhone();
        validateSubject();
        validateMessage();
    }

    nameInput.addEventListener("keyup", validateAll);
    emailInput.addEventListener("keyup", validateAll);
    phoneInput.addEventListener("keyup", validateAll);
    subjectInput.addEventListener("keyup", validateAll);
    messageInput.addEventListener("keyup", validateAll);

    submitBtn.addEventListener("click", function (e) {
        validateAll();
        if (
            nameError.textContent === "" &&
            emailError.textContent === "" &&
            phoneError.textContent === "" &&
            subjectError.textContent === "" &&
            messageError.textContent === ""
        ) {
            e.preventDefault();
            Swal.fire({
                title: "Message sent successfully!",
                icon: "success",
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            }).then(() => {
                // Store data in local storage
                var contactData = {
                    name: nameInput.value,
                    email: emailInput.value,
                    phone: phoneInput.value,
                    subject: subjectInput.value,
                    message: messageInput.value
                };
                localStorage.setItem("contactData", JSON.stringify(contactData));

                document.getElementById("contactForm").reset();
            });
        }
    });
});

(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            var spinnerElement = document.getElementById('spinner');
            if (spinnerElement) {
                spinnerElement.classList.remove('show');
            }
        }, 1);
    };
    spinner();

    // Initiate the WOW.js animation
    if (typeof WOW !== 'undefined') {
        new WOW().init();
    }

    // Sticky Navbar
    window.addEventListener('scroll', function () {
        var navBar = document.querySelector('.nav-bar');
        if (window.scrollY > 45) {
            navBar.classList.add('sticky-top', 'shadow-sm');
            navBar.style.top = '0px';
        } else {
            navBar.classList.remove('sticky-top', 'shadow-sm');
            navBar.style.top = '-100px';
        }
    });

    // Back to Top Button
    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });

    $('.back-to-top').on('click', function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'swing'); // Changed 'easeInOutExpo' to 'swing'
        return false;
    });

})(jQuery);


document.addEventListener('DOMContentLoaded', function () {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const redirectAction = localStorage.getItem('redirectAction');
    if (isLoggedIn === 'true') {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        document.getElementById('userName').textContent = currentUser.username;
        document.getElementById('accountText').textContent = currentUser.username;
        document.getElementById('userAccount').setAttribute('onclick', 'toggleProfileOffcanvas()');

        if (currentUser.profileImage) {
            document.getElementById('profileImage').src = currentUser.profileImage;
        }



    } else {
        document.getElementById('userAccount').setAttribute('onclick', 'redirectToLogin()');
    }
});

function redirectToLogin() {
    window.location.href = '/login.html';

    if (localStorage.getItem('redirectAction')) {
        localStorage.removeItem('redirectAction');
    }

}

function toggleProfileOffcanvas() {
    const profileOffcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasProfile'));
    profileOffcanvas.toggle();
}

function updateProfileImage() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('profileImage').src = e.target.result;
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            currentUser.profileImage = e.target.result;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const updatedUsers = users.map(user => {
                if (user.username === currentUser.username) {
                    return currentUser;
                }
                return user;
            });
            localStorage.setItem('users', JSON.stringify(updatedUsers));
        };
        reader.readAsDataURL(file);
    }
}

function logout() {
    Swal.fire({
        title: "Logout Successfully!",
        text: "Your account has been Logout successfully!",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
    }).then(() => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('activeUserType');
        location.assign('contact.html');
    });

}



function removeAccount() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Filter out the current user from the users array
    const updatedUsers = users.filter(user => user.username !== currentUser.username);

    // Update the users list in localStorage
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Show confirmation that the account has been removed
    Swal.fire({
        title: "Account removed!",
        text: "Your account has been successfully deleted.",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
    }).then(() => {
        // Clear login information from localStorage
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');

        // Redirect to index page
        window.location.href = 'contact.html';
    });
}







