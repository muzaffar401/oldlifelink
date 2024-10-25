

// Function to create a card
function createCard(item) {
    return `
        <div class="col-md-4 mb-4">
            <div class="card">
                <img src="${item.image}" class="card-img-top" alt="${item.title}">
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">${item.text}</p>
                </div>
            </div>
        </div>
    `;
}

// Function to render all ambulance cards
function renderAmbulanceCards(data) {
    const cardContainer = document.getElementById('card-container');
    let cardsHTML = '';

    // Loop through each category of ambulances
    for (let category in data) {
        data[category].forEach(item => {
            cardsHTML += createCard(item);
        });
    }

    cardContainer.innerHTML = cardsHTML;
}

// Fetch and display the data
renderAmbulanceCards(ambulanceData);
