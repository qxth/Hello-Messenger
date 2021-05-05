import React, {useEffect, useState} from 'react'
import { 
    Route, Switch
} from 'react-router-dom'
import chat from './chat/chat';
import login from './login/login';
import register from './register/register';
import home from './views/home';
import notFound from './views/notFound';
import routerApi from './../server/utils/routes-api'

const Router = () => {
	const [routes, setRoutes] = useState(false)
	useEffect(() => {
		fetch(`${routerApi.verificarToken}`, {
			method: "GET"
		}).then(res => res.json())
		.then(data => {
			console.log("================")
			console.log(data)
			console.log("======================")
			console.log(routes)
			console.log(routerApi)
			if(data.data !== false) return setRoutes(true)

		})
	})
	const Routes = () => {
		console.log(routes)
		if(routes == true) return(
			<React.Fragment>
				<Route exact path='/chat' component={chat}/>
			</React.Fragment>
			);
			return( 
				<React.Fragment>
					<Route exact path='/login' component={login}/>
					<Route exact path='/register' component={register}/>
				</React.Fragment>
			)	

	}
	return(
	<div>
		<Switch>
			<Route exact path='/' component={home}/>
			<Routes/>
		</Switch>
	</div>
	)

}

export default Router
