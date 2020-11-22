import React, { Suspense, useRef } from 'react';
import './App.css';
import { Canvas, useFrame } from "react-three-fiber";
import { Html, useGLTFLoader } from "drei";


const Model1 = () => {
    const gltf = useGLTFLoader('/scene.gltf', true);
    gltf.scene.traverse(node => {
        node.castShadow = true;
    });
    return <primitive object={gltf.scene} dispose={null} />;
};
const Model3 = () => {
    const gltf = useGLTFLoader('/sofa.gltf', true);
    gltf.scene.traverse(node => {
        node.castShadow = true;
    });
    return <primitive object={gltf.scene} dispose={null} />;
};

const Lights = () => {
    return (
        <>
            <ambientLight intensity={.3} />
            {/*<directionalLight position={[10, 10, 0]} intensity={1.5} />*/}
            {/*<directionalLight position={[-10, 10, 0]} intensity={.5} />*/}
            {/*<spotLight position={[0, 0, -1000]} intensity={.5} />*/}
            <pointLight position={[0, 20, 0]} intensity={1.5}
                        shadow-camera-left={-50}
                        shadow-camera-right={50}
                        shadow-camera-top={50}
                        shadow-camera-bottom={-50}
                        shadowMapWidth={2048}
                        shadowMapHeight={2048}
                        shadow-camera-far={100}
                        castShadow />
            <directionalLight position={[50, 50, 0]} intensity={1.5}
                              shadow-camera-left={-50}
                              shadow-camera-right={50}
                              shadow-camera-top={50}
                              shadow-camera-bottom={-50}
                              shadowMapWidth={2048}
                              shadowMapHeight={2048}
                              shadow-camera-far={100}
                              castShadow />
        </>
    );
};

const HTMLContent = () => {
    const ref = useRef(null);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotateY(.3 * delta);
        }
    });

    return (
        <group ref={ref} position={[0, 0, 0]} >
            <mesh castShadow
                  position={[0, 0, 5]}
                  rotation={[0, Math.PI, 0]}
                  scale={[.01, .01, .01]} >
                <Model3 ></Model3 >
            </mesh >
            <mesh castShadow
                  position={[0, 5.5, -12]}
                  rotation={[0, -Math.PI * .5, 0]}
                  scale={[10, 10, 10]} >
                <Model1 ></Model1 >
            </mesh >

            <Html fullscreen >
                <div className='container' >
                    <h1 >hello</h1 >
                </div >
            </Html >
        </group >
    );
};

const Loading = () => {
    return (
        <Html >
            <h1 >
                Loading 3d models
            </h1 >
        </Html >
    );
};

const Chairs = () => {
    return (
        <Canvas colorManagement shadowMap camera={{
            position: [0, 12, -20],
            fov: 70,
        }} >
            <Lights />
            <Suspense fallback={<Loading />} >
                <mesh receiveShadow
                      position={[0, 0, 0]}
                      rotation={[-Math.PI / 2, 0, 0]}
                      scale={[100, 100, 100]} >
                    <planeBufferGeometry attach={'geometry'} />
                    <meshStandardMaterial attach={'material'} opacity={1} />
                </mesh >

                <HTMLContent />
            </Suspense >

        </Canvas >
    );
};

export default Chairs;