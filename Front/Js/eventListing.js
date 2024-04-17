let cards = document.querySelector(".cards");

async function getAllListings() {
  let apiCall = await fetch("http://localhost:3004/all");
  let response = await apiCall.json();
  console.log(response);

  response.forEach((event) => {
    cards.innerHTML += `<div class='w-1/3 h-72 mx-6 my-6'><img src='${event.image}' class='w-48 h-48 object-cover' /> <h2>${event.title}</h2> <p>${event.description}</p></div>`;
  });
}

getAllListings();

async function createEve() {
  let title = document.querySelector(".title").value;
  let description = document.querySelector(".description").value;
  let image = document.querySelector(".image").value;
  let category = document.querySelector(".category").value;
  let jwt = window.localStorage.getItem("jwt");

  let event = {
    title: title,
    description: description,
    image: image,
    category: category,
  };

  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(event),
  };

  let apiRequest = fetch("http://localhost:3004/create", request);
  let response = await apiRequest;
  if (response.status === 200) {
    window.location.href = "../Html/allEvent.html";
  }
}

async function getMyListings() {
  let jwt = window.localStorage.getItem("jwt");

  let request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${jwt}`,
    },
  };

  let apiRequest = await fetch("http://localhost:3004/mine", request);
  let response = await apiRequest.json();

  response.forEach((event) => {
    cards.innerHTML += `<div class='w-1/3 h-72 mx-6 my-6'><img src='${event.image}' class='w-48 h-48 object-cover' /> <h2>${event.title}</h2> <p>${event.description}</p> <p>${event.price}</p>' <div> <button class='btnDelete-${event._id}' > <i class="fa-solid fa-trash"></i> </button>  <button class='ml-2 btnEdit-${event._id}' >         <i class="fa-solid fa-pen-to-square"></i>
 </button> </div></div>`;

    let btn = document.querySelector(`.btnDelete-${event._id}`);
    btn.addEventListener("click", () => {
      deleteListing(event._id);
    });

    let btn2 = document.querySelector(`.btnEdit-${event._id}`);
    btn2.addEventListener("click", () => {
      editListing(event._id, event);
    });
  });
}

getMyListings();

async function deleteListing(eventId) {
  let request = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(id),
  };

  let apiRequest = await fetch("http://localhost:3004/mine", request);
  let response = await apiRequest.json();
}
let modal = document.querySelector(".modal");

async function editListing(eventId, event) {
  let title = document.querySelector(".title");
  let description = document.querySelector(".description");
  let price = document.querySelector(".price");
  let image = document.querySelector(".image");
  let category = document.querySelector(".category");

  title.value = listing.title;
  description.value = listing.description;
  price.value = listing.price;
  image.value = listing.image;
  category.value = listing.category;

  modal.classList.remove("hidden");
}

function endEditListing() {
  modal.classList.add("hidden");

  let title = document.querySelector(".title").value;
  let description = document.querySelector(".description").value;
  let price = document.querySelector(".price").value;
  let image = document.querySelector(".image").value;
  let category = document.querySelector(".category").value;

  console.log(title, description, price, image, category);
}
