import express from "express";
import { query } from "../base-datos/conexion";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import cookies from "cookie-parser";
import bcrypt from "bcrypt";
import keys from "./../../secret/keys";

const cookieToken = (req) => {
  let token = null;
  if (!req.cookies["jwt"]) return token;
  token = req.cookies["jwt"];
  return token;
};

passport.use(
  new LocalStrategy(
    {
      usernameField: "nickname",
      passwordField: "password",
    },
    (username, password, done) => {
      const parametros = [username];
      const sql = "SELECT password, id FROM UserData WHERE nickname=?";
      query(sql, parametros).then((rows) => {
        if (!rows.length)
          return done(null, false, {
            msg: "Usuario y/o contraseña incorrecta",
          });
        const user = new Object();
        user.id = rows[0].id;
        user.nickname = username;
        console.log(user);
        if (!bcrypt.compareSync(password, rows[0].password))
          return done(null, false, {
            msg: "Usuario y/o contraseña incorrecta",
          });

        return done(null, user, console.log(user));
      });
    }
  )
);

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromExtractors([cookieToken]);
opts.secretOrKey = keys.tokenKey;

passport.use(
  new JwtStrategy(opts, (payload, done) => {
    console.log(payload);
    const parametros = [payload.id];
    const sql = "SELECT id FROM UserData WHERE id=?";
    query(sql, parametros).then((rows) => {
      if (!rows.length)
        return done(null, false, console.log("id no encontrado!"));
      return done(null, payload, console.log(payload));
    });
  })
);

export default passport;
