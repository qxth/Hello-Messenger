import React, {useEffect, useState} from 'react'
import { 
    Route, Switch
} from 'react-router-dom'
import chat from './chat/chat';
import login from './login/login'
import notFound from './views/notFound'

const Router = () => {
	const [routes, setRoutes] = useState(false)
	useEffect(() => {
		fetch("/api/verificarToken", {
			method: "GET"
		}).then(res => res.json())
		.then(data => {
			console.log("================")
			console.log(data)
			console.log("======================")
			console.log(routes)
			if(data.data === false) {
				return setRoutes(false)
			}else{
				return setRoutes(true)

			}
		})
	})
	const Routes = () => {
		console.log(routes)
		if(routes == true) return(
			<>
				<Route exact path='/chat' component={chat}/>
			</>
			);
			return( 
				<>
					<Route exact path='/login' component={login}/>
				</>
			)	

	}
	return(
	<div>
		<Switch>
			<Routes/>
		</Switch>
	</div>
	)

}

export default Router
