class Event {
  constructor(
    title,
    description,
    image,
    price,
    category,
    userId,
    createdAt,
    status
  ) {
    this.title = title;
    this.description = description;
    this.image = image;
    this.price = price;
    this.category = category;
    this.userId = userId;
    this.createdAt = createdAt;
    this.status = status;
  }
}
module.exports = { Event };
