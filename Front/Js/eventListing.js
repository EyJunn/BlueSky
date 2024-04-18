let cards = document.querySelector(".cards");

let LogOut = document.querySelector(".LogOut");

LogOut.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "./Login.html";
});

async function getAllListings() {
  let apiCall = await fetch("http://localhost:3004/all");
  let response = await apiCall.json();
  console.log(response);

  response.forEach((event) => {
    cards.innerHTML += `<div class='w-1/3 h-72 mx-6 my-6'><img src='${event.image}' class='w-48 h-48 object-cover' /> <h2>${event.title}</h2> <p>${event.description}</p> <p>${event.category}</p> <p>${event.participantMax}</p></div>`;
  });
}

getAllListings();

async function createEve() {
  let title = document.querySelector(".title").value;
  let description = document.querySelector(".description").value;
  let image = document.querySelector(".image").value;
  let category = document.querySelector(".category").value;
  let participantMax = document.querySelector(".Participant").value;
  let jwt = window.localStorage.getItem("jwt");

  let event = {
    title: title,
    description: description,
    image: image,
    category: category,
    participantMax: participantMax,
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
  let image = document.querySelector(".image");
  let category = document.querySelector(".category");
  let participant = document.querySelector(".Participant");

  title.value = event.title;
  description.value = event.description;
  image.value = event.image;
  category.value = event.category;
  participant.value = event.participant;

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
