class Event {
  constructor(
    title,
    description,
    image,
    category,
    userId,
    createdAt,
    status,
    participantMax,
    participant
  ) {
    this.title = title;
    this.description = description;
    this.image = image;
    this.category = category;
    this.userId = userId;
    this.createdAt = createdAt;
    this.status = status;
    this.participantMax = participantMax;
    this.participant = [participant];
  }
}
module.exports = { Event };
