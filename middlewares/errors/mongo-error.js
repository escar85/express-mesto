class MongoError extends Error {
  constructor(message) {
    super(message);
  }
}

module.exports = MongoError;