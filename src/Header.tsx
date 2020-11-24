import React from "react";
import { useHistory } from "react-router";

function Header() {
    const history = useHistory();

    const onClick1 = () => history.push("scene1");
    const onClick2 = () => history.push("scene2");
    const onClick3 = () => history.push("scene3");
    const onClick4 = () => history.push("scene4");
    const onClick5 = () => history.push("scene5");
    const onClick6 = () => history.push("scene6");

    return (
        <div className="container" >
            <div className="menu" >
                <div className="routerdiv" onClick={onClick1} >1</div >
                <div className="routerdiv" onClick={onClick2} >2</div >
                <div className="routerdiv" onClick={onClick3} >cubes matrix</div >
                <div className="routerdiv" onClick={onClick4} >sofas</div >
                <div className="routerdiv" onClick={onClick5} >festival</div >
                <div className="routerdiv" onClick={onClick6} >Scrollable train</div >
            </div >
        </div >
    );
}

export default Header;
