import { query } from '../base-datos/conexion'


export default{
    getAllHistory: async(req, res) => {
      const parametros = [req.params.id]
      
      const sql = "SELECT ChatData FROM ChatStorage WHERE idChat = ?"

      await query(sql, parametros)
      .then((rows) => {
	if(rows.length){
	  console.log(rows[0])
	  let dataString = rows[0].ChatData
	  let dataTest = JSON.parse(dataString)
	  let arr= []
	  arr.push(dataTest)
	  console.log(arr)
	  res.status(200).send(arr)
	}else{
	  res.status(401).json({
	    error: 'El chat al que intenta ingresar no existe!'
	  })
	}
      }).catch(e => console.error(e))

    }
}
