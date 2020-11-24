import React from "react";
import "./App.css";
import WobblyBoxes from "./WobblyBoxes";
import AnimatedCubes from "./AnimatedCubes";
import SpringAnimations from "./SpringAnimations";

import { BrowserRouter, Route, Switch } from "react-router-dom";
import Header from "./Header";
import Chairs from "./Chairs";
import SmallFestival from "./Small Festival/SmallFestival";
import ScrollableTrain from "./ScrollTrain/ScrollableTrain";

function App() {
    return (
        <BrowserRouter basename={"/"} >
            <Header />
            <Switch >
                <Route exact path="/scene1" component={AnimatedCubes} />
                <Route exact path="/scene2" component={WobblyBoxes} />
                <Route exact path="/scene3" component={SpringAnimations} />
                <Route exact path="/scene4" component={Chairs} />
                <Route exact path="/scene5" component={SmallFestival} />
                <Route exact path="/scene6" component={ScrollableTrain} />
            </Switch >
        </BrowserRouter >
    );
}

export default App;
