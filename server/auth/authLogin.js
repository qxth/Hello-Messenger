import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
//import {secretKey} from '../../secret/keys';

const router = express.Router()


router.route("/api/login")
.post((req, res, next) => {
	passport.authenticate('local', {session: false},
		(err, user, info) => {
			if(err) return console.error(err);
			console.log(user)
			console.log(info)
			req.login(user, {session: false}, async (err) => {
				if(err) return res.status(401).json({msg:"Asegurese de enviar correctamente sus datos"})
				const token = jwt.sign(user, "secret")
				res.cookie('jwt', token, {
					secure: false,
					httpOnly: false
				})
				return res.json({data: user, token: token})
			})
		})(req, res, next);
})
export default router
