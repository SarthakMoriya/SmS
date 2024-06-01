import jwt from "jsonwebtoken";

export const checkToken = (req, res, next) => {
  console.log("Request recieved")
  try {
    let token = "";
    console.log(token)
    console.log(req.headers.authorization)
    if (req.headers.authorization.startsWith("Bearer ")) {
      token = req?.headers?.authorization.split(" ")[1];
      const { iat, exp } = jwt.verify(token, process.env.JWT_PASSWORD);
      // console.log(iat,exp)
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
        ok:false,
        message:
        "Session Expired Please login again",
        error,
      });
  }
};
