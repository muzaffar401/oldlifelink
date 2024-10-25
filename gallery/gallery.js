document.addEventListener("DOMContentLoaded", () => {
    const gallery = document.getElementById("gallery");
    const searchInput = document.getElementById("searchInput");
    const sortOptions = document.getElementById("sortOptions");
    let imagesData = [];

    // Fetch the image data from the JSON file
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            imagesData = data;
            displayImages(imagesData);

            // Add event listener to the search input
            searchInput.addEventListener('input', () => {
                const searchTerm = searchInput.value.toLowerCase();
                const filteredData = imagesData.filter(item => item.title.toLowerCase().includes(searchTerm));
                displayImages(filteredData);
            });

            // Add event listener to the sort options
            sortOptions.addEventListener('change', () => {
                const selectedOption = sortOptions.value;
                let sortedData = [...imagesData]; // Copy original data

                if (selectedOption === 'asc') {
                    sortedData.sort((a, b) => a.title.localeCompare(b.title)); // A-Z sorting
                } else if (selectedOption === 'desc') {
                    sortedData.sort((a, b) => b.title.localeCompare(a.title)); // Z-A sorting
                }

                // After sorting, display the images
                displayImages(sortedData);
            });
        })
        .catch(error => console.error('Error fetching the data:', error));

    // Function to display images
    function displayImages(images) {
        gallery.innerHTML = '';  // Clear the gallery content
        if (images.length > 0) {
            images.forEach(image => {
                const imageElement = document.createElement('div');
                imageElement.className = 'col-md-4 mb-4';
                imageElement.innerHTML = `
                    <div class="card text-center">
                        <div style="overflow: hidden;">
                            <img src="${image.imageUrl}" class="card-img-top h-100 w-100" alt="${image.title}">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title text-primary">${image.title}</h5>
                        </div>
                    </div>
                `;
                gallery.appendChild(imageElement);
            });
        } else {
            gallery.innerHTML = '<p class="text-center">No images found.</p>';
        }
    }
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
        location.assign('gallery.html');
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
        window.location.href = 'gallery.html';
    });
}









