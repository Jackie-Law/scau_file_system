import React from "react";
import { Route, Switch, Redirect } from 'react-router-dom';
import App from "../App";
import Login from "../page/Login";
import Register from "../page/Register";
import UserCenter from "../page/UserCenter";
import TestPage from "../page/testPage";

const Root = () => (
    <div id="route">
        <Switch>
            <Route render={ props =>(
                <App>
                    <Switch>
                        <Route path="/" exact component={Login}/>
                        <Route path="/user_center" exact component={UserCenter}/>
                        <Route path="/register" exact component={Register}/>
                        <Route path="/test" exact component={TestPage}/>
                        <Route render={() => <Redirect to="/" />} />
                    </Switch>
                </App>
            )}/>
        </Switch>
    </div>
)

export default Root;