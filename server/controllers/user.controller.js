import { query } from '../base-datos/conexion';
import bcrypt from 'bcrypt';
import {cryptAnsw, decryptAnsw} from '../utils/encrypt';

export default{
	registerUser: (req, res) => {
		const nickname = req.body.nickname, parametros = [nickname],
		sql = "SELECT nickname FROM UserData WHERE nickname=?";
		query(sql, parametros).then(async rows => {
			if(rows.length) return res.json({status: 401, msg: "Su usuario ya se encuentra ocupado"});
			const salt = bcrypt.genSaltSync(10),
			hash = bcrypt.hashSync(req.body.password, salt),
			respuestaHashed = cryptAnsw(req.body.respuesta); 
			const parametros = [nickname, hash, req.body.pregunta, respuestaHashed]
			const sql = "INSERT INTO UserData (nickname, password, pregunta, respuesta) values(?, ?, ?, ?)"
			const result = await query(sql, parametros);
			res.json({status: 200, msg: "Se ha registrado correctamente su usuario"})
		})
	},
	getQuestions: async (req, res) => {
		const data = await query("SELECT * FROM questions")
		const questions = data.map(res => {
			const arr = {}
			arr.name = res.question
			arr.value = `${res.id}`
			return arr;
		})
		console.log(questions)
		res.json({status:200, "questions": questions})
	}
}