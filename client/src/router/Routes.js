import React from "react";
import { Route, Switch, Redirect } from 'react-router-dom';
import App from "../App";
import Login from "../page/Login";
import Register from "../page/Register";
import Home from "../page/Home";

const Root = () => (
    <div id="route">
        <Switch>
            <Route render={ props =>(
                <App>
                    <Switch>
                        <Route path="/" exact component={Login}/>
                        <Route path="/home" exact component={Home}/>
                        <Route path="/register" exact component={Register}/>
                        <Route render={() => <Redirect to="/" />} />
                    </Switch>
                </App>
            )}/>
        </Switch>
    </div>
)

export default Root;