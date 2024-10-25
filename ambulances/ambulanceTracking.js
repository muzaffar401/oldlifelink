const statusMessage = document.getElementById('statusMessage');
const cancelButton = document.getElementById('cancelButton');
const mapContainer = document.getElementById('mapContainer');
const ambulance = document.getElementById('ambulance');
const timerSpan = document.getElementById('timer');
const userName = document.getElementById('userName1');
const locationDetails = document.getElementById('locationDetails');
let countdown = 10;

// Hide user name and location initially
userName.style.display = 'none';
locationDetails.style.display = 'none';

// Fetch the user data from local storage
const ambulanceBookingData = JSON.parse(localStorage.getItem('ambulanceBookingData'));

// Cancel Button Logic with SweetAlert confirmation
cancelButton.addEventListener('click', function () {
    Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to cancel the booking?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, cancel it!'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                'Cancelled!',
                'Your booking has been cancelled.',
                'success'
            ).then(() => {
                window.location.href = 'ambulanceform.html';
            });
        }
    });
});

// Countdown timer logic
const countdownInterval = setInterval(() => {
    countdown--;
    timerSpan.textContent = countdown;

    if (countdown === 0) {
        clearInterval(countdownInterval);

        // Update status message and hide cancel button
        statusMessage.textContent = "Status: Ambulance on the way...";
        cancelButton.style.display = 'none';

        // Show the map and start animation
        mapContainer.style.display = 'block';
        ambulance.style.animationPlayState = 'running';

        // Display user name and location after the countdown
        if (ambulanceBookingData) {
            userName.style.display = 'block';
            userName.textContent = `Welcome, ${ambulanceBookingData.name}`;
            locationDetails.style.display = 'block';
            locationDetails.textContent = `Your location: ${ambulanceBookingData.region}, ${ambulanceBookingData.city}, ${ambulanceBookingData.area}`;
        } else {
            userName.textContent = 'Welcome, Guest';
            locationDetails.textContent = 'Your location: Unknown';
        }

        // Trigger animation completion logic after 30 seconds
        setTimeout(() => {
            // Clear ambulanceBookingData from local storage
            localStorage.removeItem('ambulanceBookingData');

            // Show SweetAlert thank you message
            Swal.fire({
                title: 'Thank You!',
                text: 'Thank you for using our service!',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.href = '/index.html';
            });
        }, 30000); // 30 seconds for the animation
    }
}, 1000); // 1 second intervals for countdown



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
        location.assign('ambulanceTracking.html');
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
        window.location.href = 'ambulanceTracking.html';
    });
}










