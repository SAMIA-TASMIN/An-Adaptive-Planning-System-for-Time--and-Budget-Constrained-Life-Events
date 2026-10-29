// Wraps a controller so any error goes to the error middleware (no try/catch in controllers).
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}
