let ambulanceData = [];  // Will hold fetched data

// Function to create a card
function createCard(item) {
    return `
                <div class="col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.2s">
                    <div class="service-item">
                        <div class="service-img">
                            <img src="${item.image}" class="img-fluid rounded-top w-100" alt="">
                        </div>
                        <div class="service-content p-4">
                            <div class="service-content-inner">
                                <a href="#" class="d-inline-block h4 mb-4">${item.title}</a>
                                <p class="mb-4"><strong>Type:</strong> ${item.type}</p>
                                <p class="mb-4"><strong>Region:</strong> ${item.region}</p>
                                <p class="mb-4"><strong>Price:</strong> ${item.price}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
}

// Function to render cards
function renderCards(filteredData) {
    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = ''; // Clear the container

    filteredData.forEach(item => {
        cardContainer.innerHTML += createCard(item);
    });
}

// Function to filter and sort based on search input and ambulance type
function applyFilters() {
    let filteredData = ambulanceData;

    const searchValue = document.getElementById('search').value.trim().toLowerCase();
    const typeFilter = document.getElementById('filter-type').value.toLowerCase(); // Make type filter case-insensitive
    const sortOption = document.getElementById('sort-options').value;

    // Search by price, region, and type in a single input
    if (searchValue) {
        filteredData = filteredData.filter(item =>
            item.price.toLowerCase().includes(searchValue) ||
            item.region.toLowerCase().includes(searchValue) ||
            item.type.toLowerCase().includes(searchValue)
        );
    }

    // Filter by ambulance type from dropdown, ensure case-insensitive comparison
    if (typeFilter) {
        filteredData = filteredData.filter(item => item.type.toLowerCase() === typeFilter);
    }

    // Sorting
    if (sortOption === 'az') {
        filteredData = filteredData.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'za') {
        filteredData = filteredData.sort((a, b) => b.title.localeCompare(a.title));
    }

    renderCards(filteredData);
}


function newFilters() {
    let filteredData = ambulanceData;

    const searchValue = document.getElementById('search2').value.trim().toLowerCase();
    const typeFilter = document.getElementById('filter-type').value.toLowerCase(); // Make type filter case-insensitive
    const sortOption = document.getElementById('sort-options').value;

    // Search by price, region, and type in a single input
    if (searchValue) {
        filteredData = filteredData.filter(item =>
            item.price.toLowerCase().includes(searchValue) ||
            item.region.toLowerCase().includes(searchValue) ||
            item.type.toLowerCase().includes(searchValue)
        );
    }

    // Filter by ambulance type from dropdown, ensure case-insensitive comparison
    if (typeFilter) {
        filteredData = filteredData.filter(item => item.type.toLowerCase() === typeFilter);
    }

    // Sorting
    if (sortOption === 'az') {
        filteredData = filteredData.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'za') {
        filteredData = filteredData.sort((a, b) => b.title.localeCompare(a.title));
    }

    renderCards(filteredData);
}


// Fetch data from JSON file
fetch('ambulance.json')
    .then(response => response.json())
    .then(data => {
        // Combine all categories into a single array
        ambulanceData = [
            ...data['ac-amb'],
            ...data['non-ac-amb'],
            ...data['icu-amb'],
            ...data['iccu-amb']
        ];
        renderCards(ambulanceData); // Initial render
    })
    .catch(error => console.error('Error fetching data:', error));

// Event listeners for search, filter, and sort
document.getElementById('search').addEventListener('input', applyFilters);
document.getElementById('search2').addEventListener('input', newFilters);
document.getElementById('filter-type').addEventListener('change', applyFilters);
document.getElementById('sort-options').addEventListener('change', applyFilters);

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
        location.assign('ambulances.html');
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
        window.location.href = 'ambulances.html';
    });
}







