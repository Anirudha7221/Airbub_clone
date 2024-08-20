let baseurl="https://airbnb13.p.rapidapi.com"
let rapidAPI="b343351798msh2b9ca557fa1d160p1887fejsn89bd51a5b5dd";
let MapAPI="AIzaSyDr1WUe58UGm1bPWplXkV6AQSGgYqa_-5I";

let userLocation;

window.onload = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
        });
    }
}

const searchButton = document.getElementById("search-btn");

searchButton.addEventListener("click", () => {
    // console.log("clicked");
    const searchInput = document.getElementById("search-input").value;
///// api.example has to be replaced with rapid api
    fetch(`${baseurl}/listings?search=${searchInput})`)
        .then(response => response.json())
        .then(data => {
            // createListingCard(data);
            const listingsContainer = document.getElementById("listings-container");
        
            listingsContainer.innerHTML = "";
        
            data.listings.forEach(listing => {
                const listingCard = createListingCard(listing);
                listingsContainer.appendChild(listingCard);
            });
            console.log(data);
        })
        .catch(error => console.error('Error:', error));
});

function createListingCard(listing) {
    const listingLocation = `${listing.latitude},${listing.longitude}`;

    fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${userLocation.lat},${userLocation.lng}&destinations=${listingLocation}&key=${MapAPI}`)
        .then(response => response.json())
        .then(data => {
            const distance = data.rows[0].elements[0].distance.text;

            // Now create the listingCard and include the distance in the information
            const listingCard = document.createElement("div");

            listingCard.innerHTML = `<p>Distance from you: ${distance}</p>`;
        });

    const listingCard = document.createElement("div");
    listingCard.classList.add("listing-card");

    listingCard.innerHTML = `
        <img src="${listing.image}" alt="${listing.title}">
        <div class="listing-info">
            <h2>${listing.title}</h2>
            <p>${listing.propertyType} · ${listing.beds} beds · ${listing.bathrooms} bathrooms</p>
            <p>${listing.price} per night</p>
            <p>${listing.location}</p>
            <p>Amenities: ${listing.amenities.join(", ")}</p>
        </div>`;

    const costButton = document.createElement("button");
    costButton.innerText = "Show Booking Cost Breakdown";
    costButton.addEventListener("click", () => showBookingCostBreakdown(listing));
    listingCard.appendChild(costButton);

    const reviewsP = document.createElement("p");
    reviewsP.innerHTML = `Reviews: ${listing.reviews_count} | Average Rating: ${calculateAverageRating(listing.reviews)}`;
    listingCard.appendChild(reviewsP);

    new google.maps.Marker({
        position: { lat: listing.latitude, lng: listing.longitude },
        map,
        title: listing.title
    });

    if (listing.host.is_superhost) {
        const superhostIndicator = document.createElement("p");
        superhostIndicator.innerText = "Superhost";
        superhostIndicator.style.color = "red";
        listingCard.appendChild(superhostIndicator);
    }

    if (listing.is_rare_find) {
        const rareFindIndicator = document.createElement("p");
        rareFindIndicator.innerText = "Rare Find";
        rareFindIndicator.style.color = "green";
        listingCard.appendChild(rareFindIndicator);
    }   
    
    const amenitiesPreview = document.createElement("p");
    amenitiesPreview.innerText = `Amenities: ${createAmenitiesPreview(listing.amenities)}`;
    listingCard.appendChild(amenitiesPreview);

    const hostDetails = document.createElement("p");
    hostDetails.innerText = `Hosted by ${createHostDetails(listing.host)}`;
    listingCard.appendChild(hostDetails);

    const directionsButton = document.createElement("button");
    directionsButton.innerText = "Get Directions";
    directionsButton.addEventListener("click", function() {
        openDirections(listing.location);
    });
    listingCard.appendChild(directionsButton);

    return listingCard;
}

function showBookingCostBreakdown(listing) {
    const additionalFees = listing.price * 0.10;
    const totalCost = listing.price + additionalFees;

    const modal = document.createElement("div");
    modal.style.display = "block";
    modal.style.width = "300px";
    modal.style.height = "200px";
    modal.style.backgroundColor = "#fff";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.padding = "20px";
    modal.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";

    modal.innerHTML = `
        <h2>Booking Cost Breakdown</h2>
        <p>Base Rate: $${listing.price.toFixed(2)}</p>
        <p>Additional Fees: $${additionalFees.toFixed(2)}</p>
        <p>Total Cost: $${totalCost.toFixed(2)}</p>
    `;

    const closeButton = document.createElement("button");
    closeButton.innerText = "Close";
    closeButton.addEventListener("click", () => modal.style.display = "none");
    modal.appendChild(closeButton);

    document.body.appendChild(modal);
}

function calculateAverageRating(reviews) {
    if (reviews.length === 0) {
        return "No reviews yet";
    }

    let sum = 0;
    for (let review of reviews) {
        sum += review.rating;
    }

    return (sum / reviews.length).toFixed(1);
}

function createAmenitiesPreview(amenities) {
    // Show the first 3 amenities and the total count
    const previewAmenities = amenities.slice(0, 3);
    let previewText = previewAmenities.join(", ");

    if (amenities.length > 3) {
        const extraCount = amenities.length - 3;
        previewText += `, and ${extraCount} more`;
    }

    return previewText;
}

function createHostDetails(host) {
    // Include the host's name and 'Superhost' status
    let hostText = host.name;

    if (host.is_superhost) {
        hostText += " (Superhost)";
    }

    return hostText;
}

function openDirections(location) {
    // Open Google Maps directions in a new tab
    const url = `https://www.google.com/maps/dir//${location.latitude},${location.longitude}`;
    window.open(url, "_blank");
}