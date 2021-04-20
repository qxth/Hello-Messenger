import passport from 'passport';
import jwt from 'jsonwebtoken';
import express from 'express';
import {verificarToken} from './verificarToken'

const router = express.Router()

router.route("/api/verificarToken")
.get(verificarToken, (req, res) => {res.status(200).json({data: res.locals.payload})})
export default router
