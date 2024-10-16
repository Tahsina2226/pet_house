let petsData = [];
let likedPets = [];
let spinnerVisibleTime = 2000;

// Show Spinner
const showSpinner = () => {
    document.getElementById('spinner').classList.remove('hidden');
};

// Hide Spinner
const hideSpinner = () => {
    document.getElementById('spinner').classList.add('hidden');
};

const loadCategories = () => {
    showSpinner();
    const fetchStartTime = Date.now();

    fetch("https://openapi.programming-hero.com/api/peddy/categories")
        .then((res) => res.json())
        .then((data) => {
            displayCategories(data.categories);
            const fetchEndTime = Date.now();
            const elapsedTime = fetchEndTime - fetchStartTime;
            const remainingTime = Math.max(spinnerVisibleTime - elapsedTime, 0);
            setTimeout(hideSpinner, remainingTime);
        })
        .catch((error) => {
            console.log('Error fetching categories:', error);
            hideSpinner();
        });
};

const loadPets = () => {
    showSpinner();
    const fetchStartTime = Date.now();

    fetch("https://openapi.programming-hero.com/api/peddy/pets")
        .then((res) => res.json())
        .then((data) => {
            petsData = data.pets;
            displayPets(petsData);
            const fetchEndTime = Date.now();
            const elapsedTime = fetchEndTime - fetchStartTime;
            const remainingTime = Math.max(spinnerVisibleTime - elapsedTime, 0);
            setTimeout(hideSpinner, remainingTime);
        })
        .catch((error) => {
            console.log(error);
            hideSpinner();
        });
};

const displayCategories = (categories) => {
    const categoryContainer = document.getElementById("pet");
    categoryContainer.innerHTML = '';

    categories.forEach((item) => {
        const categoryCard = document.createElement("div");
        categoryCard.classList.add("flex", "items-center", "justify-center", "p-4", "bg-white", "rounded-lg", "m-2");

        const button = document.createElement("button");
        button.classList.add("flex", "items-center", "bg-white", "text-black", "border", "border-gray-300", "rounded-lg", "px-4", "py-2", "gap-2", "category-btn");

        const categoryImage = document.createElement("img");
        categoryImage.src = item.category_icon;
        categoryImage.alt = `${item.category} icon`;
        categoryImage.classList.add("w-10", "h-10", "border-none");

        const buttonText = document.createElement("span");
        buttonText.innerText = item.category;
        buttonText.classList.add("font-bold");

        button.appendChild(categoryImage);
        button.appendChild(buttonText);
        categoryCard.appendChild(button);
        categoryContainer.appendChild(categoryCard);

        button.addEventListener("click", () => {
            filterPetsByCategory(item.category);
            activateCategoryButton(button);
        });
    });
};

const displayPets = (pets) => {
    const petContainer = document.getElementById("pets");
    petContainer.innerHTML = '';

    if (pets.length === 0) {
        petContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center mt-8 p-4 bg-white shadow-lg rounded-lg">
                <img src="images/error.webp" alt="No Pets" class="w-40 h-40 mb-4" />
                <h2 class="text-2xl font-semibold text-gray-700 mb-2">No Information Available</h2>
                <p class="text-gray-500 text-center">Currently, there are no pets available in the selected category. Please explore other categories.</p>
            </div>
        `;
        return;
    }

    pets.forEach((pet) => {
        const card = document.createElement("div");
        card.className = "card card-compact p-4 rounded-lg shadow-md";

        card.innerHTML = `
            <figure class="h-[200px] rounded-3xl overflow-hidden">
                <img src="${pet.image || 'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp'}"
                     class="h-full w-full object-cover" alt="${pet.pet_name || 'Pet Image'}">
            </figure>
            <div class="px-2 py-2">
                <h2 class="text-xl font-bold mb-2">${pet.pet_name || 'Undefined'}</h2>
                <p><i class="fa fa-th-large mr-2"></i>${pet.breed || 'Undefined'}</p>
                <p><i class="fa fa-calendar-minus-o mr-2"></i>Birth: ${pet.date_of_birth || 'Undefined'}</p>
                <p><i class="fa fa-mercury mr-2"></i>Gender: ${pet.gender || 'undefined'}</p>
                <p><i class="fa fa-usd mr-2"></i>Price: $${pet.price || 'Undefined'}</p>
            </div>
            <div class="flex justify-between mt-4">
                <button class="btn btn-secondary btn-sm like-btn bg-[#0E7A81] border-none"><i class="fa fa-thumbs-o-up" aria-hidden="true"></i></button>
                <button class="btn btn-outline btn-sm adopt-btn" style="color: #0E7A81;">Adopt</button>
                <button class="btn btn-outline btn-sm details-btn" style="color: #0E7A81;">Details</button>
            </div>
        `;

        // Event listeners for buttons
        card.querySelector('.details-btn').addEventListener('click', () => openModal(pet));
        card.querySelector('.adopt-btn').addEventListener('click', openAdoptModal);
        card.querySelector('.like-btn').addEventListener('click', () => likePet(pet));

        petContainer.appendChild(card);
    });
};

const filterPetsByCategory = (category) => {
    showSpinner();
    const fetchStartTime = Date.now();

    const filteredPets = petsData.filter(pet => pet.category === category);

    const fetchEndTime = Date.now();
    const elapsedTime = fetchEndTime - fetchStartTime;
    const remainingTime = Math.max(spinnerVisibleTime - elapsedTime, 0);

    setTimeout(() => {
        displayPets(filteredPets);
        hideSpinner();
    }, remainingTime);
};

const likePet = (pet) => {
    likedPets.push(pet);
    displayLikedPets();
};

const displayLikedPets = () => {
    const likedPetContainer = document.getElementById("petss");
    likedPetContainer.innerHTML = '';

    if (likedPets.length === 0) {
        likedPetContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center mt-8 p-4 bg-white shadow-lg rounded-lg">
                <p class="text-gray-500 text-center">No liked pets yet.</p>
            </div>
        `;
        return;
    }

    likedPets.forEach((pet) => {
        const petImage = `
            <div class="p-2">
                <img src="${pet.image || 'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp'}" 
                     class="h-100 w-100 object-cover rounded-lg" alt="${pet.pet_name || 'Pet Image'}">
            </div>
        `;
        likedPetContainer.innerHTML += petImage;
    });
};

const activateCategoryButton = (button) => {
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
};

const openAdoptModal = () => {
    const adoptModal = document.getElementById('adoptModal');
    adoptModal.classList.remove('hidden');

    let countdownValue = 3;
    const countdownElement = document.getElementById('countdown');
    countdownElement.innerText = countdownValue;

    const interval = setInterval(() => {
        countdownValue -= 1;
        countdownElement.innerText = countdownValue;

        if (countdownValue === 0) {
            clearInterval(interval);
            closeAdoptModal();
        }
    }, 1000);
};

const closeAdoptModal = () => {
    document.getElementById('adoptModal').classList.add('hidden');
};

const openModal = (pet) => {
    const modal = document.getElementById('petModal');
    modal.classList.remove('hidden');

    document.getElementById('modalPetName').innerText = pet.pet_name || 'Undefined';
    document.getElementById('modalImage').src = pet.image || 'Undefined';
    document.getElementById('modalBreed').innerText = pet.breed || 'Undefined';
    document.getElementById('modalDOB').innerText = pet.date_of_birth || 'Undefined';
    document.getElementById('modalGender').innerText = pet.gender || 'Undefined';
    document.getElementById('modalPrice').innerText = pet.price || 'Undefined';

    // Event listener for the close button
    document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
};

const closeModal = () => {
    document.getElementById('petModal').classList.add('hidden');
};

// Sort pets by price
const sortPetsByPrice = () => {
    petsData.sort((a, b) => {
        return a.price - b.price; // Sort in ascending order
    });
    displayPets(petsData);
};

// function
loadCategories();
loadPets();

// sorting pets by price
document.getElementById("sortByPriceBtn").addEventListener("click", () => {
    sortPetsByPrice();
});