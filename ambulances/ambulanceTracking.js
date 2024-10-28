// HTML Elements
const statusMessage = document.getElementById('statusMessage');
const cancelButton = document.getElementById('cancelButton');
const mapContainer = document.getElementById('mapContainer');
const ambulance = document.getElementById('ambulance');
const timerSpan = document.getElementById('timer');
const userName = document.getElementById('userName1');
const locationDetails = document.getElementById('locationDetails');
const trackingHeading = document.getElementById('trackingHeading');
const selectedAmbulanceDiv = document.getElementById('selectedAmbulance');
let countdownInterval;

// Hide user info and map initially
userName.style.display = 'none';
locationDetails.style.display = 'none';
mapContainer.style.display = 'none';
selectedAmbulanceDiv.style.display = 'none';

// Fetch the user data from local storage
let ambulanceBookingData = JSON.parse(localStorage.getItem('ambulanceBookingData'));
let selectedAmbulance = JSON.parse(localStorage.getItem('selectedAmbulance'));

// Check if there was a previous leave attempt
if (sessionStorage.getItem('leaveConfirmed')) {
    // Clear the data since the user confirmed leaving the page
    localStorage.removeItem('ambulanceBookingData');
    localStorage.removeItem('selectedAmbulance');
    sessionStorage.removeItem('countdown');
    sessionStorage.removeItem('startTime');
    sessionStorage.removeItem('leaveConfirmed');
}

// Redirect to home page if no booking data
if (!ambulanceBookingData) {
    window.location.replace('/index.html');
}

// Show cancellation message and hide elements
function showBookingCancelled() {
    statusMessage.textContent = "Your ambulance has been cancelled.";
    statusMessage.style.textAlign = 'center';
    statusMessage.style.color = '#015fc9';
    cancelButton.style.display = 'none';
    mapContainer.style.display = 'none';
    userName.style.display = 'none';
    locationDetails.style.display = 'none';
    trackingHeading.style.display = 'none';
    selectedAmbulanceDiv.style.display = 'none';
    history.replaceState(null, '', '/index.html');
}

function startTracking() {
    sessionStorage.removeItem('isCancelled');

    let countdown = sessionStorage.getItem('countdown')
        ? parseInt(sessionStorage.getItem('countdown'))
        : 10;

    let startTime = sessionStorage.getItem('startTime');
    if (!startTime) {
        startTime = Date.now();
        sessionStorage.setItem('startTime', startTime);
    } else {
        const elapsed = Math.floor((Date.now() - parseInt(startTime)) / 1000);
        countdown = Math.max(0, countdown - elapsed);
    }

    if (countdown <= 0) {
        onTrackingComplete();
        return;
    }

    // Hide user name, location details, and selected ambulance info initially
    userName.style.display = 'none';
    locationDetails.style.display = 'none';
    selectedAmbulanceDiv.style.display = 'none';

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
                Swal.fire('Cancelled!', 'Your booking has been cancelled.', 'success').then(() => {
                    localStorage.removeItem('ambulanceBookingData');
                    localStorage.removeItem('selectedAmbulance');
                    sessionStorage.removeItem('countdown');
                    sessionStorage.removeItem('startTime');
                    ambulanceBookingData = null;
                    selectedAmbulance = null;
                    clearInterval(countdownInterval);
                    showBookingCancelled();
                });
            }
        });
    });

    // Start countdown and update timer every second
    countdownInterval = setInterval(() => {
        countdown--;
        sessionStorage.setItem('countdown', countdown);
        timerSpan.textContent = countdown;

        if (countdown === 0) {
            clearInterval(countdownInterval);
            onTrackingComplete();
        }
    }, 1000);
}

// Function to handle tracking completion
function onTrackingComplete() {
    statusMessage.textContent = "Status: Ambulance on the way...";
    cancelButton.style.display = 'none';

    // Display map and selected ambulance info
    mapContainer.style.display = 'block';
    ambulance.style.animationPlayState = 'running';

    // Show user info and selected ambulance details when countdown is complete
    userName.style.display = 'block';
    userName.textContent = `Welcome, ${ambulanceBookingData.name}`;
    locationDetails.style.display = 'block';
    locationDetails.textContent = `Your location: ${selectedAmbulance.region}, ${ambulanceBookingData.city}, ${ambulanceBookingData.area}`;
    selectedAmbulanceDiv.style.display = 'block';

    document.getElementById('ambulanceType').textContent = selectedAmbulance.type;
    document.getElementById('ambulanceRegion').textContent = selectedAmbulance.region;
    document.getElementById('ambulancePrice').textContent = selectedAmbulance.price;

    // Display ambulance image if available
    const ambulanceImage = document.getElementById('ambulanceImage');
    if (selectedAmbulance.image) {
        ambulanceImage.src = selectedAmbulance.image;
        ambulanceImage.style.display = 'block';
    } else {
        ambulanceImage.style.display = 'none';
    }

    // Clear tracking data after timeout and redirect to home page
    setTimeout(() => {
        localStorage.removeItem('ambulanceBookingData');
        localStorage.removeItem('selectedAmbulance');
        sessionStorage.removeItem('countdown');
        sessionStorage.removeItem('startTime');
        ambulanceBookingData = null;

        Swal.fire({
            title: 'Thank You!',
            text: 'Thank you for using our service!',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            history.replaceState(null, '', '/index.html');
            window.location.href = '/index.html';
        });
    }, 30000);
}


// Start tracking if booking data exists
if (ambulanceBookingData) {
    startTracking();
}

// Intercept navigation events
function handleNavigation(event) {
    // Prevent default navigation
    event.preventDefault();

    // Show SweetAlert confirmation dialog
    Swal.fire({
        title: 'Are you sure?',
        text: "Leaving will cancel your booking.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, leave page',
        cancelButtonText: 'Stay on page',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
    }).then((result) => {
        if (result.isConfirmed) {
            // User confirmed, remove booking data and navigate
            localStorage.removeItem('ambulanceBookingData');
            localStorage.removeItem('selectedAmbulance');
            sessionStorage.removeItem('countdown');
            sessionStorage.removeItem('startTime');
            ambulanceBookingData = null;
            selectedAmbulance = null;

            // Redirect to the intended page
            window.location.replace(event.target.href);
        }
    });
}

// Add event listener to links/buttons that lead away from the page
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', handleNavigation);
});

// Optionally, if there are any buttons leading to navigation
document.querySelectorAll('button.navigate').forEach(button => {
    button.addEventListener('click', handleNavigation);
});


// Disable back navigation
history.pushState(null, null, location.href);
window.addEventListener('popstate', function () {
    // When the user tries to go back, push them back to the current page
    history.pushState(null, null, location.href);
    Swal.fire({
        title: 'Are you sure?',
        text: "Leaving will cancel your booking.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, leave page',
        cancelButtonText: 'Stay on page',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
    }).then((result) => {
        if (result.isConfirmed) {
            // Clear data if user wants to leave
            localStorage.removeItem('ambulanceBookingData');
            localStorage.removeItem('selectedAmbulance');
            sessionStorage.removeItem('countdown');
            sessionStorage.removeItem('startTime');
            sessionStorage.removeItem('leaveConfirmed');
            ambulanceBookingData = null;
            selectedAmbulance = null;
            window.location.replace('/index.html');
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
        location.assign('ambulanceTracking.html');
    });

}




function removeAccount() {
    Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to delete your account? This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
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
    });
}










