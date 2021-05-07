import passport from "passport";
import jwt from "jsonwebtoken";
import express from "express";
import { verificarToken } from "./verificarToken";
import routes from "./../utils/routes-api";

const router = express.Router();

router.route(routes.verificarToken).get(verificarToken, (req, res) => {
  console.log(routes);
  res.status(200).json({ data: res.locals.payload });
});
export default router;
