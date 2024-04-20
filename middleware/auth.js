import passport from "passport";

export const authenticateJWT = (req, res, next) => {
  console.log("Token JWT recibido:", req.headers.authorization);
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  })(req, res, next);
};
