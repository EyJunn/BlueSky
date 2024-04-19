let cards = document.querySelector(".cards");

let LogOut = document.querySelector(".LogOut");

LogOut.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "./Login.html";
});

async function getAllEvent() {
  let apiCall = await fetch("http://localhost:3004/all");
  let response = await apiCall.json();
  console.log(response);

  response.forEach((event) => {
    cards.innerHTML += `<div class='w-1/3 h-72 mx-6 my-6'><img src='${event.image}' class='w-48 h-48 object-cover' /> <h2>${event.title}</h2> <p>${event.description}</p> <p>${event.category}</p> <p>${event.participant.length} / ${event.participantMax}</p><button onclick="addParticipant('${event._id}')">Participer</button> <button onclick="retirerParticipant('${event._id}')">Cancel</button></div>`;
  });
}

getAllEvent();

async function addParticipant(Id) {
  let jwt = window.localStorage.getItem("jwt");

  if (!jwt) {
    console.log("Jwt invalid");
  }

  let request = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${jwt}`,
    },
  };

  await fetch(`http://localhost:3004/addParticipant/${Id}`, request);
  window.location.reload();
}

async function retirerParticipant(Id) {
  let jwt = window.localStorage.getItem("jwt");

  if (!jwt) {
    console.log("Jwt invalid");
  }

  let request = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${jwt}`,
    },
  };

  await fetch(`http://localhost:3004/retirerParticipant/${Id}`, request);
  window.location.reload();
}

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


