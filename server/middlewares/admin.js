import jwt from "jsonwebtoken";

export const checkToken = (req, res, next) => {
  try {
    let token = "";
    console.log(req.headers.authorization);
    if (req.headers.authorization.startsWith("Bearer ")) {
      token = req?.headers?.authorization.split(" ")[1];
      const { iat, exp } = jwt.verify(token, process.env.JWT_PASSWORD);

      console.log(iat, exp);
      if (exp > iat) {
        next();
      } else {
        res
          .status(403)
          .json({ message: "Session Expired Please login again", ok: false });
      }
    } else {
      return res
        .status(403)
        .json({ message: "Invalid Token. Please login again", ok: false });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        message:
          "Internal Server Error, Pleae try again may be token is invalid",
        error,
      });
  }
};
