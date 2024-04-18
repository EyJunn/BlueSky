let cards = document.querySelector(".cards");

let LogOut = document.querySelector(".LogOut");

LogOut.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "./Login.html";
});

async function getMyEvents() {
  let jwt = window.localStorage.getItem("jwt");

  let request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${jwt}`,
    },
  };

  let apiRequest = await fetch("http://localhost:3004/myCreation", request);
  let response = await apiRequest.json();
  console.log(response);
  response.forEach((event) => {
    cards.innerHTML += `<div class='w-1/3 h-72 mx-6 my-6'><img src='${event.image}' class='w-48 h-48 object-cover' /> <h2>${event.title}</h2> <p>${event.description}</p> <p>${event.category}</p>' <div> <button class='btnDelete-${event._id}' > <i class="fa-solid fa-trash"></i> </button>  <button class='ml-2 btnEdit-${event._id}' ><i class="fa-solid fa-pen-to-square"></i></button></div></div>`;

    let btn = document.querySelector(`.btnDelete-${event._id}`);
    btn.addEventListener("click", () => {
      deleteEvent(event._id);
    });

    let btn2 = document.querySelector(`.btnEdit-${event._id}`);
    btn2.addEventListener("click", () => {
      editEvent(event._id, event);
    });
  });
}

getMyEvents();

async function deleteEvent(eventId) {
  let jwt = window.localStorage.getItem("jwt");

  if (!jwt) {
    console.log("Jwt invalid");
  }

  let request = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${jwt}`,
    },
  };

  await fetch(`http://localhost:3004/delete/${eventId}`, request);

  window.location.reload();
}

let modal = document.querySelector(".modal");

async function editEvent(eventId, event) {
  let title = document.querySelector(".title");
  let description = document.querySelector(".description");
  let price = document.querySelector(".price");
  let image = document.querySelector(".image");
  let category = document.querySelector(".category");

  title.value = event.title;
  description.value = event.description;
  image.value = event.image;
  category.value = event.category;

  modal.classList.remove("hidden");
}

function endEditEvent() {
  modal.classList.add("hidden");

  let title = document.querySelector(".title").value;
  let description = document.querySelector(".description").value;
  let image = document.querySelector(".image").value;
  let category = document.querySelector(".category").value;

  console.log(title, description, image, category);
}
