export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      const data = await schema.parseAsync(req.body ?? {});

      // Replace req.body with validated & sanitized data
      req.body = data;

      next();
    } catch (error) {
      next(error);
    }
  };
};
