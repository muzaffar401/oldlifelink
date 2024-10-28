// Function to generate HTML for each card
const generateCard = (ambulance) => {
    return `
        <div class="col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.2s">
            <div class="service-item mb-5">
                <div class="service-img">
                    <img src="${ambulance.image}" class="img-fluid rounded-top w-100" alt="">
                </div>
                <div class="service-content p-4">
                    <div class="service-content-inner">
                        <a href="../ambulanceDetail.html?id=${ambulance.id}" class="d-inline-block h4 mb-4">${ambulance.title}</a>
                        <p class="mb-2" style="display: none;><strong>Type:</strong> ${ambulance.type}</p>
                        <p class="mb-2" style="display: none;><strong>Region:</strong> ${ambulance.region}</p>
                        <p class="mb-4" style="display: none;><strong>Price:</strong> ${ambulance.price}</p>
                        <p class="mb-4" >${ambulance.text}</p>
                        <!-- Button to redirect to the detail page -->
                        <a href="../ambulanceDetail.html?id=${ambulance.id}" class="btn btn-primary">View Details</a>
                    </div>
                </div>
            </div>
        </div>
    `;
};

// Function to generate a section for each ambulance type
const generateSection = (ambulanceType, title, typeClass) => {
    const section = document.createElement('div');
    section.classList.add('ambulance-section', typeClass); // Add a custom class

    
    let cardsHtml = '';

    ambulanceType.forEach(ambulance => {
        cardsHtml += generateCard(ambulance);
    });

    section.innerHTML = `<div class="row">${cardsHtml}</div>`;
    return section;
};

// Function to fetch JSON data and render it
const fetchData = async () => {
    try {
        const response = await fetch('../catAmbulance.json');
        const data = await response.json();

        const ambulanceContainer = document.getElementById('ambulance-container');
        ambulanceContainer.appendChild(generateSection(data['iccu-amb'], 'ICCU Ambulances', 'iccu-ambulance'));
    } catch (error) {
        console.error('Error fetching the ambulance data:', error);
    }
};

// Call the function to fetch and render the data
fetchData();









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
        location.assign('iccu_Ambulance.html');
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
                window.location.href = 'iccu_Ambulance.html';
            });
        }
    });
}









