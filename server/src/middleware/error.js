export function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route not found: ${req.method} ${req.originalUrl}`));
}
export function errorHandler(err, req, res, next) {
  const status =
    res.statusCode && res.statusCode !== 200
      ? res.statusCode
      : err.statusCode || 500;
  if (err.code === 11000)
    return res
      .status(409)
      .json({ message: "A record with this value already exists" });
  console.error(err);
  res
    .status(status)
    .json({
      message:
        process.env.NODE_ENV === "production"
          ? "Server error"
          : err.message || "Server error",
    });
}
