import React, { Suspense, useEffect, useState } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import TrainRoom from "./TrainRoom";
import { useGLTFLoader } from "drei";
import { Color, Vector3 } from "three";

const initialDist = 15;

interface IScrollCamera {
    yScroll: number
}
const ScrollCamera = (props: IScrollCamera) => {
    useFrame((state, delta) => {
        state.camera.position.z = -initialDist + props.yScroll * .02;
    });
    return null;
};

const LoadedScrollableTrain = () => {
    const [yScroll, setYScroll] = useState(0);

    const handleScroll = () => {
        setYScroll(window.scrollY);
    };
    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });
    });

    return (
        <Canvas style={{ background: "white" }}
                shadowMap
                camera={{
                    position: [0, 10, -initialDist],
                }} >
            <ambientLight intensity={0.4} />
            <directionalLight position={[30, 40, -30]}
                              intensity={.3}
                              castShadow
                              shadow-camera-left={-50}
                              shadow-camera-right={50}
                              shadow-camera-top={50}
                              shadow-camera-bottom={-50}
                              shadow-mapSize-width={2048}
                              shadow-mapSize-height={2048} />


            <ScrollCamera yScroll={yScroll} />

            <fog attach='fog' far={50} near={20} />
            <Suspense fallback={null} >
                <TrainRoom position={new Vector3(0, 0, 0)} color={new Color(.5, .5, .5)} chairsColor={new Color(1, .5, 1)}/>
            <TrainRoom position={new Vector3(0, 0, 20)} color={new Color(.4, .2, .2)} chairsColor={new Color(1, 0, 0)}/>
            </Suspense >

        </Canvas >
    );
};


const Loading = () => {
    return (<div >mortii matii </div >);
};

const ScrollableTrain = () => {
    return (
        <div style={{
            height: "500vh",
            width: "100%",
        }} >
            <div style={{
                position: "fixed",
                top: 60,
                width: "100%",
                height: "100%",
            }} >
                    <LoadedScrollableTrain />
            </div >
        </div >
    );
};

export default ScrollableTrain;