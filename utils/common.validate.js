module.exports = (schema) => {
  return (req, res, next) => {
    let validation = [];
    let validationResult = {};

    if (schema.body) {
      validationResult = schema.body.validate(req.body);
      if (validationResult.error) {
        validation.push(validationResult.error.details[0].message);
      } else {
        req.body = validationResult.value;
      }
    }
    if (schema.params) {
      validationResult = schema.params.validate(req.params);
      if (validationResult.error) {
        validation.push(validationResult.error.details[0].message);
      } else {
        req.params = validationResult.value;
      }
    }
    if (schema.query) {
      validationResult = schema.query.validate(req.query);
      if (validationResult.error) {
        validation.push(validationResult.error.details[0].message);
      } else {
        req.query = validationResult.value;
      }
    }

    if (validation.length) {
      res.status(400).json({ message: validation.join() });
      return;
    }
    next();
  };
};
