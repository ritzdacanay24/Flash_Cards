import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";

import Cards from './Cards/Cards';
import CardDetails from './CardDetails/CardDetails';
import ManageCards from './ManageCards/ManageCards';
import CreateCard from './CreateCard/CreateCard';
import history from '../history';

export default class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/Cards" exact component={Cards} />
                    <Route path="/CardsDetails" exact component={CardDetails} />
                    <Route path="/ManageCards" exact component={ManageCards} />
                    <Route path="/CreateCard" exact component={CreateCard} />
                </Switch>
            </Router>
        )
    }
}