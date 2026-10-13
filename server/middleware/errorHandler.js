function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Malformed JSON body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Invalid JSON in request body.' });
  }
  // Mongoose: bad ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid ID or value.' });
  }
  // Mongoose: schema validation
  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: 'Some fields are invalid.' });
  }
  // MongoDB: duplicate key
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: 'That value already exists.' });
  }

  console.error('Unexpected error:', err.message);
  // Do not leak internal details to the client.
  res.status(500).json({ success: false, message: 'Something went wrong on our side. Please try again.' });
}

module.exports = { notFound, errorHandler };
