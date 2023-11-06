export const isAdmin = (res, req, next) => {
  try {
    const token=req.headers.authorization;
    console.log(token)
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
