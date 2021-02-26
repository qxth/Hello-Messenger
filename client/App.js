import React from 'react'
import { hot } from 'react-hot-loader'
import {
    BrowserRouter
} from 'react-router-dom';
import Router from './Router'
import {
    MuiThemeProvider,
    withStyles
} from '@material-ui/core/styles'

const styles = tema => ({
    "@global": {
        body: {
            margin: 0,
            padding: 0,
        }
    }
})

const App = () => {
    return (
        <React.Fragment>
            <div>
                <BrowserRouter>
                    <Router />
                </BrowserRouter>
            </div>
        </React.Fragment>
    )
}

export default hot(module)(withStyles(styles)(App))
