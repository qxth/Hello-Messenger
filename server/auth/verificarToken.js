import passport from "passport";
import jwt from "jsonwebtoken";

const verificarToken = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) return console.error(err);
    //console.log(user)
    res.locals.payload = user;
    next();
  })(req, res, next);
};

export { verificarToken };