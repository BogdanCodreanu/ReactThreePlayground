import React from 'react';
import './App.css';
import Box from './Box';
import { Canvas } from "react-three-fiber";
import * as THREE from 'three';

const animatedCubes = () => {
    return (
        <Canvas camera={{
            position: [-10, 10, 10],
            rotation: [0, 0, 0],
            fov: 35,
        }} >
            <pointLight position={[-10, 10, -10]}
                        color={new THREE.Color(1, 1, 1)}
                        castShadow
                        intensity={1} />
            <ambientLight intensity={.4} />
            {[-3, 0, 3].map(x =>
                [-3, 0, 3].map(z =>
                    <Box key={`id ${x}${z}`} position={[x, 0, z]} />),
            )}
        </Canvas >
    );
};

export default animatedCubes;