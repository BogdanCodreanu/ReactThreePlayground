import React, { useRef, useState } from 'react';
import './App.css';
import { Canvas, useFrame } from "react-three-fiber";
import { Color, Mesh, Vector3 } from "three";
import { animated } from '@react-spring/three';
import { MeshWobbleMaterial } from 'drei/shaders/MeshWobbleMaterial';
import { softShadows } from 'drei';

// softShadows({
//     frustrum: 3.75,
//     size: 0.005, // World size (default: 0.005)
//     near: 9.5, // Near plane (default: 9.5)
//     samples: 17, // Samples (default: 17)
//     rings: 11, // Rings (default: 11)
// });

interface IWobblyBoxProps {
    position: Vector3 | [x: number, y: number, z: number],
    scale: [x: number, y: number, z: number],
    color: Color | string,
    speed?: number
}

const WobblyBox = (props: IWobblyBoxProps) => {
    const [scaleTest, setScaleTest] = useState<[number, number, number]>([1, 1, 1]);

    const mesh = useRef<Mesh>(null);
    useFrame((state, delta) => {
        const rotateSpeed = Math.random() * 2 + 0.5;
        mesh.current?.rotation.set(
            mesh.current.rotation.x + rotateSpeed * delta,
            mesh.current.rotation.y + rotateSpeed * delta,
            mesh.current.rotation.z);
    });


    const toggleScale = () => {
        setScaleTest(scaleTest.map(x => x * 1.2) as [number, number, number]);
    };

    const toggleScaleRef = useRef(toggleScale);
    toggleScaleRef.current = toggleScale;


    return (<animated.mesh castShadow
                           position={props.position}
                           ref={mesh}
                           scale={scaleTest} >
            <boxBufferGeometry attach='geometry' args={props.scale} />
            <MeshWobbleMaterial attach='material'
                                color={props.color}
                                speed={props.speed ?? 1}
                                factor={.4} />
        </animated.mesh >
    );
};

const WobblyBoxes = () => {


    return (
        <Canvas shadowMap camera={{
            position: [0, 2, -10],
            fov: 60,
            far: 100,
        }} >
            <ambientLight intensity={0.3} />
            <pointLight position={[-10, 10, 20]} intensity={0.5} />
            <pointLight position={[15, 10, 20]} intensity={0.5} />
            <directionalLight position={[0, 30, 0]}
                              shadow-camera-left={-10}
                              shadow-camera-right={10}
                              shadow-camera-top={10}
                              shadow-camera-bottom={-10}
                              shadowMapWidth={1024}
                              shadowMapHeight={1024}
                              castShadow />

            <group >
                <mesh receiveShadow
                      rotation={[-Math.PI / 2, 0, 0]}
                      position={[0, -3, 0]} >
                    <planeBufferGeometry attach='geometry' args={[100, 100]} />
                    <shadowMaterial attach='material' opacity={.3} />
                </mesh >
                <WobblyBox position={[0, 1, 0]} scale={[2, 1.5, 3]} color="cyan" />
                <WobblyBox position={[-6, 1.5, 5]}
                           scale={[1.5, 1.5, 1.5]}
                           color="pink"
                           speed={60} />
                <WobblyBox position={[5, 1.5, 2]}
                           scale={[1.5, 1.5, 1.5]}
                           color="pink"
                           speed={6} />
            </group >
            {/*<OrbitControls />*/}
        </Canvas >
    );
};

export default WobblyBoxes;
