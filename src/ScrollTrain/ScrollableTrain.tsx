import React, { Suspense, useEffect, useState } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import TrainRoom from "./TrainRoom";
import { Color, Vector3 } from "three";
import { Bloom, EffectComposer, SMAA, SSAO } from "@react-three/postprocessing";
import { HTML } from "drei";

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
        return () => {
            window.removeEventListener("scroll", handleScroll);
        }
    }, []);

    return (
        <Canvas style={{ background: "white" }}
                shadowMap
                concurrent
                colorManagement
                invalidateFrameloop
                gl={{ alpha: true }}
                camera={{
                    position: [0, 8, -initialDist],
                }} >
            <ambientLight intensity={0.3} />
            <spotLight position={[-30, 40, -30]}
                       angle={Math.PI / 4}
                       intensity={.4}
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
                <HTML position={[-7, 0, 0]}>
                    <div>
                        Scroll down!
                    </div>
                </HTML>
                <TrainRoom position={new Vector3(0, 0, 0)}
                           color={new Color(.13, .16, .19)}
                           chairsColor={new Color(1, .83, .41)} />
                <TrainRoom position={new Vector3(0, 0, 20)}
                           color={new Color(.86, .39, 0)}
                           chairsColor={new Color(.09, .41, .48)} />
                <TrainRoom position={new Vector3(0, 0, 40)}
                           color={new Color(.91, .91, .91)}
                           chairsColor={new Color(.94, .33, .33)} />
                <TrainRoom position={new Vector3(0, 0, 60)}
                           color={new Color(.99, .23, .41)}
                           chairsColor={new Color(.07, .0, .47)} />

                <EffectComposer multisampling={0} >
                    <SSAO
                        luminanceInfluence={1}
                        radius={2}
                        scale={0.5}
                        bias={0.5}
                        distanceThreshold={0.5}
                        distanceFalloff={0.03}
                        rangeFalloff={0.001} />
                    <SMAA />
                    <Bloom />
                </EffectComposer >
            </Suspense >

        </Canvas >
    );
};

const ScrollableTrain = () => {
    return (
        <div style={{
            height: "450vh",
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