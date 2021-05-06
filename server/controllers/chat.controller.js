import { query } from '../base-datos/conexion'


export default{
    getAllHistory: (req, res) => {
    // Aquí estaría este parametro "1" por el ID del token 
      let id = res.locals.payload.id
     console.log(res.locals.payload.id)
      const parametros = [req.body.id, id, req.body.id, id]
      console.log(req.body)
      const sql = "SELECT ChatData, idChat FROM ChatStorage WHERE (idFriend=? AND idUser=?) OR (idUser=? AND idFriend=?)"
      query(sql, parametros)
      .then(rows => {
	if(rows.length === 0 ) return res.status(401).json({error: 'El chat al que intenta ingresar no existe!'})
	  console.log(rows[0])
	  let dataString = rows[0].ChatData
	  let dataTest = JSON.parse(dataString)
	  let arr= []
	  arr.push(dataTest)
	  console.log(arr)
      const dataChat = arr[0]
	     res.status(200).json({dataChat, idChat: rows[0].idChat})
      }).catch(e => console.error(e))

    },
    getAllFriends: (req, res) => {
    	// Aquí estaría este parametro "1" por el ID del token
      let id = res.locals.payload.id; 
     console.log(res.locals.payload.id)

    	const parametros = [id]
    	const sql = "SELECT idFriend, idChat FROM Friends WHERE idUser=?"
    	query(sql, parametros)
    	.then(async rows => {
    		if(rows.length === 0) return res.json({status: 200, friendsData: []});
    		let parametros = []
    		let sql = "SELECT id, nickname, status FROM UserData WHERE "
    		for(let i of rows){
    			parametros.push(i.idFriend)
    			sql += "id=? OR "
    		}
    		const finalSql =sql.slice(0, -3)
    		const result = await query(finalSql, parametros)
    		return res.json({
    			friendsData:result,
    		})
    	})
    },
    getStashFriends: (req, res) => {
      let id = res.locals.payload.id
      const parametros=[id]
      const sql = "SELECT id FROM stashFriends WHERE idFriend=?"
      query(sql, parametros)
      .then(async rows => {
        console.log(rows)
        if(rows.length === 0) return res.json({result:[]}) 
        let parametros = []
        let sql = "SELECT id, nickname FROM UserData WHERE "
          for(let i of rows){
            parametros.push(i.id)
            sql += "id=? OR "
          }
          const finalSql = sql.slice(0, -3)
          console.log(finalSql)
          console.log(parametros)
          const result= await query(finalSql, parametros)
          return res.json({
            result
          })
      }).catch(err => console.error(err))
    },
    addFriends: (req, res) => {
      let idFriend;
      let id=res.locals.payload.id
      const parametros = [req.body.nickname]
      const sql = "SELECT id, nickname FROM UserData WHERE nickname=?"
      console.log(req.body.nickname)
      query(sql, parametros)
      .then(async rows => {
        if(!rows.length || id === rows[0].id) return res.json({status:200, msg:"No se ha encontrado el usuario"});
        const parametrosStash = [id, rows[0].id, rows[0].id, id]
        const sqlStash = "SELECT id,idFriend FROM stashFriends  WHERE (id = ? AND idFriend=?) OR (id=? AND idFriend=?)"
        const rowsStash = await query(sqlStash, parametrosStash)
        console.log(rowsStash.length)
        if(rowsStash.length){
            return res.json({status:200, msg:"El usuario que intenta agregar ya es su amigo o ya le ha mandado solicitud"})
        }else{
          idFriend = rows[0].id;
          const parametros = [id, idFriend, idFriend, id]
          const sqlUser = "SELECT idUser, idFriend FROM Friends WHERE idUser =? AND idFriend=?"
          const rowsUser = await query(sqlUser, parametros)
          if(rowsUser.length){ 
            return res.json({status:200, msg:"El usuario que intenta agregar ya es su amigo o ya le ha mandado solicitud"});
          }else{
            const sql = "INSERT stashFriends (id, idFriend) values(?, ?)"
            query(sql, parametros).then(rows => {
              return res.json({status: 200, msg:"Se ha mandado solicitud"})
            }); 
          }

        }
        

      }) 
    },
    acceptFriends: async (req, res) => {
      const idFriend = req.body.idFriend, id = res.locals.payload.id;

      const parametrosStash = [id, idFriend, idFriend, id]
      const sqlStash = "SELECT id,idFriend FROM stashFriends  WHERE (id = ? AND idFriend=?) OR (id=? AND idFriend=?)"
      const rowsStash = await query(sqlStash, parametrosStash)
      if(!rowsStash.length) return res.json({status: 401, msg: "Ha ocurrido un error verifique que envio correctamente la solicitud de amistad"});

      const parametros =[id, idFriend, idFriend, id]
      const sql = "INSERT Friends(idUser, idFriend) values(?, ?), (?, ?)"
      query(sql, parametros)
      .then(async rows => {
        const string = JSON.stringify({"ChatData": [{}]})
        const parametros = [id, idFriend, string, new Date()]
        const sql = "INSERT INTO ChatStorage(idUser, idFriend, ChatData, Fecha) values(?, ?, ?, ?)"
        query(sql, parametros).then(async rows => {
          const parametros = [id, idFriend]
          const sql = "DELETE FROM stashFriends WHERE idFriend = ? AND id = ?"
          await query(sql, parametros)
          return res.json({status: 200, msg:" Se ha agregado a su amigo correctamente"})
        })
      })
    },
    cancelFriends: async (req, res) => {
      const idFriend = req.body.idFriend, id= res.locals.payload.id;
        const parametros = [id, idFriend]
        const sql = "DELETE FROM stashFriends WHERE idFriend = ? AND id = ?"
        await query(sql, parametros)
        return res.json({status: 200, msg:" Se ha eliminado a su amigo correctamente"})
    }
}
