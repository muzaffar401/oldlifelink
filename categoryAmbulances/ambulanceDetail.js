// Function to get query parameter (id from the URL)
const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};

// Function to find the ambulance by ID
const findAmbulanceById = (id, data) => {
    for (const category in data) {
        const ambulance = data[category].find(item => item.id == id);
        if (ambulance) return ambulance;
    }
    return null;
};

// Fetch ambulance data from JSON
fetch('catAmbulance.json')
    .then(response => response.json())
    .then(data => {
        // Get the ID from the URL
        const ambulanceId = getQueryParam('id');

        // Fetch the ambulance data based on the ID
        const ambulance = findAmbulanceById(ambulanceId, data);

        // Generate the HTML and inject it into the page
        const ambulanceDetailsContainer = document.getElementById('ambulance-details');

        if (ambulance) {
            ambulanceDetailsContainer.innerHTML = `
                <div class="row">
                    <div class="col-md-6">
                        <img src="${ambulance.image}" class="img-fluid rounded custom-img-height" alt="${ambulance.title}">
                    </div>
                    <div class="col-md-6 mt-5">
                        <h2 class="text-center text-primary">${ambulance.title}</h2><br>
                        
                        <!-- Display Ambulance Type, Region, and Price -->
                        <p><strong>Type:</strong> ${ambulance.type}</p>
                        <p><strong>Region:</strong> ${ambulance.region}</p>
                        <p><strong>Price:</strong> ${ambulance.price}</p>
                        
                        <p>${ambulance.text}</p>

                        <!-- Dropdown for ambulance sizes -->
                        <div class="mb-4">
                            <label for="ambulanceSize" class="form-label"><strong>Select Ambulance Size:</strong></label>
                            <select id="ambulanceSize" class="form-select" aria-label="Select ambulance size">
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                                <option value="large">Large</option>
                            </select>
                        </div>

                        <!-- Book Now button -->
                        <div class="d-flex justify-content-between">
                            <button class="btn btn-primary" onclick="bookAmbulance('${ambulance.id}')">Book Now</button>
                            <a href="catAmbulance.html" class="btn btn-primary">Back to Ambulances</a>
                        </div>
                    </div>
                </div>
            `;
        } else {
            ambulanceDetailsContainer.innerHTML = `<p>Ambulance not found.</p>`;
        }
    })
    .catch(error => {
        console.error('Error fetching ambulance data:', error);
        const ambulanceDetailsContainer = document.getElementById('ambulance-details');
        ambulanceDetailsContainer.innerHTML = `<p>Error loading ambulance data. Please try again later.</p>`;
    });

// Book Now function
function bookAmbulance(ambulanceId) {
    const ambulanceSize = document.getElementById('ambulanceSize').value;

    // Redirect to the form page with query parameters (e.g., ambulance ID and size)
    window.location.href = `/ambulances/ambulanceform.html?id=${ambulanceId}&size=${ambulanceSize}`;
}



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
        location.assign('ambulanceDetail.html');
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
        window.location.href = 'ambulanceDetail.html';
    });
}











