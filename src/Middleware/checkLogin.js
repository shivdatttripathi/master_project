import jwt from "jsonwebtoken";

export const checkUserLogin = (req, res, next) => {
  console.log("Checking user login status...");
  const refreshToken = req.cookies.refreshToken;

  console.log("refresh token:", refreshToken);
  //check acess token is valid or not

  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    console.log("Verifying refresh token...");
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    console.log("Decoded token:", decoded);

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
