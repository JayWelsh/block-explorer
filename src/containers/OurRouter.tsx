import React from "react";
import {Route, withRouter, Switch, RouteComponentProps} from "react-router-dom";
import HomePage from "./HomePage";
import BlockPage from "./BlockPage";
import {
    IBlockPage,
    IHomePage
} from '../interfaces';

const OurRouter = () => {
    return (
        <Switch>
            <Route path="/" exact render={(props) => homeRoute(props)} />
            <Route path="/:blockchain" exact render={(props) => homeRoute(props)} />
            <Route path="/:blockchain/block" exact render={(props) => blockRoute(props)} />
            <Route path="/:blockchain/block/:blockId" exact render={(props) => blockRoute(props)} />
        </Switch>
    )
}

const homeRoute = (props : RouteComponentProps<IHomePage>) => {
    return (
        <HomePage blockchain={props?.match?.params?.blockchain}/>
    )
}

const blockRoute = (props : RouteComponentProps<IBlockPage>) => {
    return (
        <BlockPage blockchain={props?.match?.params?.blockchain} blockId={props?.match?.params?.blockId}/>
    )
}

export default withRouter(OurRouter);