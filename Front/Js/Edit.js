const eventId = localStorage.getItem("event");
async function affiche() {

  const response = await update.json();

  let title = document.querySelector(".title").value;
  let description = document.querySelector(".description").value;
  let image = document.querySelector(".image").value;
  let category = document.querySelector(".category").value;
  let participant = document.querySelector(".Participant").value;

  title = response.title,
    description = response.description,
    image = response.image,
    category = response.category,
    participant = response.participant
}
affiche();
async function EndEditEvent(eventId) {

      const update = await fetch(
    `http://localhost:3004/update/${eventId}`,
    request
  );
  let title = document.querySelector(".title").value;
  let description = document.querySelector(".description").value;
  let image = document.querySelector(".image").value;
  let category = document.querySelector(".category").value;
  let participant = document.querySelector(".Participant").value;
  let request = {
    method: "Patch",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(event),
  };

  if (update.status === 200) {
    window.location.href = "../myEventListing.html";
    localStorage.removeItem("event");
  }
}
