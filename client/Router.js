import React from 'react'
import { 
    Route, Switch
} from 'react-router-dom'
import chat from './chat/chat'


const Router = () => {

    return (
        <div>
           <Switch>
            <Route path='/chat' component={chat}/>
          </Switch>
        </div>
    )
}

export default Router
