import { query } from '../base-datos/conexion'


export default{
    getAllHistory: (req, res) => {
    // Aquí estaría este parametro por el ID del token 
      const parametros = [1, req.body.idFriend]
      
      const sql = "SELECT ChatData FROM ChatStorage WHERE IdUser = ? AND IdFriend=?"

      query(sql, parametros)
      .then(rows => {
	if(rows.length === 0 ) return res.status(401).json({error: 'El chat al que intenta ingresar no existe!'})
	  console.log(rows[0])
	  let dataString = rows[0].ChatData
	  let dataTest = JSON.parse(dataString)
	  let arr= []
	  arr.push(dataTest)
	  console.log(arr)
	  res.status(200).send(arr)

      }).catch(e => console.error(e))

    },
    getAllFriends: (req, res) => {
    	// Aquí estaría este parametro por el ID del token 
    	const parametros = [1]
    	const sql = "SELECT idFriend FROM Friends WHERE idUser=?"
    	query(sql, parametros)
    	.then(async rows => {
    		if(rows.length === 0) return res.json({status: 200, data: null});
    		let parametros = []
    		let sql = "SELECT id, nickname FROM UserData WHERE "
    		for(let i of rows){
    			parametros.push(i.idFriend)
    			sql += "id=? OR "
    		}
    		const finalSql =sql.slice(0, -3)
    		const result = await query(finalSql, parametros)
    		res.json({
    			friendsData:result
    		})
    	})
    }
}
