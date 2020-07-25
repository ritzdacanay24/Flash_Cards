import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";

import Cards from './components/Cards';
import CardDetails from './components/CardDetails.js';
import history from './history';

export default class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/Cards" exact component={Cards} />
                    <Route path="/CardsDetails" exact component={CardDetails} />
                </Switch>
            </Router>
        )
    }
}