function validateNewCard(req, res, next) {
  const { front, back } = req.body;

  if (!front || typeof front !== 'string' || front.trim() === '') {
    return res.status(400).json({
      error: 'front is required and must be a non-empty string'
    });
  }

  if (!back || typeof back !== 'string' || back.trim() === '') {
    return res.status(400).json({
      error: 'back is required and must be a non-empty string'
    });
  }

  req.body.front = front.trim();
  req.body.back = back.trim();
  if (req.body.tag && typeof req.body.tag === 'string') {
    req.body.tag = req.body.tag.trim();
  }

  next();
}

function validateReview(req, res, next) {
  const { correct } = req.body;

  if (typeof correct !== 'boolean') {
    return res.status(400).json({
      error: '"correct" field is required and must be a boolean'
    });
  }

  next();
}

module.exports = { validateNewCard, validateReview };