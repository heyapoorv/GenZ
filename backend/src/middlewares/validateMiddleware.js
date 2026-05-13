const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  
  const extractedErrors = errors.array().map(err => ({
    param: err.path || err.param,
    msg: err.msg
  }));

  return res.status(422).json({
    message: extractedErrors[0].msg,
    errors: extractedErrors,
  });
};

module.exports = validate;
