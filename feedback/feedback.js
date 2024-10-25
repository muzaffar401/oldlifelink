document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("feedbackForm");
    var btn = document.getElementById("submitBtn");

    var nameInput = document.getElementById("name");
    var phoneInput = document.getElementById("phone");
    var messageInput = document.getElementById("message");
    var ratingValueInput = document.getElementById("ratingValue");

    var nameError = document.getElementById("nameError");
    var phoneError = document.getElementById("phoneError");
    var messageError = document.getElementById("messageError");
    var ratingError = document.getElementById("ratingError");

    var namePattern = /^[a-zA-Z\s]{3,12}$/;
    var phonePattern = /^[0-9]{11}$/;

    // Star elements
    var stars = document.querySelectorAll(".rating-stars i");

    // Add event listeners for star rating
    stars.forEach(function (star, index) {
        star.addEventListener("click", function () {
            // Set the value of the hidden rating input
            ratingValueInput.value = star.getAttribute("data-value");

            // Highlight selected stars
            stars.forEach(function (s, i) {
                if (i <= index) {
                    s.classList.add("selected");
                } else {
                    s.classList.remove("selected");
                }
            });

            // Hide error if rating is selected
            validateRating();
        });
    });

    function validateName() {
        var nameValue = nameInput.value.trim();
        if (nameValue === "") {
            nameError.textContent = "Please fill out this field.";
        } else if (!namePattern.test(nameValue)) {
            nameError.textContent = "Name should be 3-12 characters and contain only letters.";
        } else {
            nameError.textContent = "";
        }
    }

    function validatePhone() {
        var phoneValue = phoneInput.value.trim();
        if (phoneValue === "") {
            phoneError.textContent = "Please fill out this field.";
        } else if (phoneValue.length < 11 || !phonePattern.test(phoneValue)) {
            phoneError.textContent = "Phone number should contain only digits and be 11 digits long.";
        } else {
            phoneError.textContent = "";
        }
    }

    function validateMessage() {
        var messageValue = messageInput.value.trim();
        if (messageValue === "") {
            messageError.textContent = "Please fill out this field.";
        } else {
            messageError.textContent = "";
        }
    }

    function validateRating() {
        if (ratingValueInput.value === "") {
            ratingError.textContent = "Please select a rating.";
            return false;
        } else {
            ratingError.textContent = "";
            return true;
        }
    }

    function validateAll() {
        validateName();
        validatePhone();
        validateMessage();
        validateRating(); // Validate rating here
    }

    // Add event listeners for real-time validation
    nameInput.addEventListener("keyup", validateAll);
    phoneInput.addEventListener("keyup", validateAll);
    messageInput.addEventListener("keyup", validateAll);

    btn.addEventListener("click", function (e) {
        validateAll(); // Run all validations

        if (
            nameInput.value.trim() === "" ||
            !namePattern.test(nameInput.value) ||
            phoneInput.value.trim() === "" ||
            phoneInput.value.length < 11 ||
            !phonePattern.test(phoneInput.value) ||
            messageInput.value.trim() === "" ||
            !validateRating() // Prevent form submission if rating is not valid
        ) {
            e.preventDefault(); // Prevent form submission if any validation fails
        } else {
            e.preventDefault(); // Prevent default form submission for SweetAlert2

            var existingData = JSON.parse(localStorage.getItem("formData")) || [];
            var newEntry = {
                name: nameInput.value.trim(),
                phone: phoneInput.value.trim(),
                message: messageInput.value.trim(),
                rating: ratingValueInput.value
            };

            existingData.push(newEntry);
            localStorage.setItem("formData", JSON.stringify(existingData));

            Swal.fire({
                title: "Feedback submitted successfully!",
                icon: "success",
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            }).then(() => {
                form.submit(); // Submit form after SweetAlert2
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
        location.assign('feedback.html');
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
        window.location.href = 'feedback.html';
    });
}











