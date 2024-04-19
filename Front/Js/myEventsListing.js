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
    cards.innerHTML += `<div class='w-1/3 h-72 mx-6 my-6'><img src='${event.image}' class='w-48 h-48 object-cover' /> <h2>${event.title}</h2> <p>${event.description}</p> <p>${event.category}</p>' <p>${event.participant.length}/ ${event.participantMax} <div> <button class='btnDelete-${event._id}' > <i class="fa-solid fa-trash"></i> </button>  <button  onclick="updateEvent('${event._id}')" class='ml-2' ><i class="fa-solid fa-pen-to-square"></i></button></div></div>`;

    let btn = document.querySelector(`.btnDelete-${event._id}`);
    btn.addEventListener("click", () => {
      deleteEvent(event._id);
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

function updateEvent(eventId) {
  localStorage.setItem("event", eventId);
  window.location.href = "./Edit.html";
}
