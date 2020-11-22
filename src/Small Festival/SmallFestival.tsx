import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "react-three-fiber";
import { useGLTFLoader } from "drei";
import * as THREE from "three";
import { Vector3 } from "three";
import FestivalCamera from "./FestivalCamera";
import GizmoAxis from "../GizmoAxis";
import ActivitySelect from "./ActivitySelect";
import { IActivityZone } from "../utils";
import FestivalTable from "./FestivalTable";

interface ISceneProps {
    OnReachedActivityZone: (zoneName: string) => void
    SubscribeToParent: (arg0: () => void) => void
}

const Scene = (props: ISceneProps) => {
    const gltf = useGLTFLoader('/small festival.gltf', true);
    const [sceneTraversed, setSceneTraversed] = useState(false);

    const startZoneRef = useRef<IActivityZone>(null);
    const [cameraZoomingTowardsStart, setCameraZoomingTowardsStart] = useState(false);
    const tableZoneRef = useRef<IActivityZone>(null);
    const [cameraZoomingTowardsTable, setCameraZoomingTowardsTable] = useState(false);

    const [canEnterZones, setCanEnterZones] = useState(true);

    const [userAtTable, setUserAtTable] = useState(false);

    if (!sceneTraversed) {
        tableZoneRef.current = {
            cameraPositionTarget: null,
            cameraLookAtTarget: null,
        };

        startZoneRef.current = {
            cameraPositionTarget: null,
            cameraLookAtTarget: null,
        };

        gltf.scene.traverse(node => {
            if (node.type === "Mesh") {
                node.castShadow = true;
            }
            if (node.type ===
                "Group" &&
                node.name.startsWith('Tree') &&
                node.children.length ===
                2) {
                node.children[0].receiveShadow = true;
            }
            if (node.name === 'Camera') {
                startZoneRef.current.cameraPositionTarget = node.position.clone();
                startZoneRef.current.cameraLookAtTarget = new Vector3(0, 0, 0);
            }

            if (node.name.startsWith('Table') && node.children.length > 0) {
                tableZoneRef.current.cameraLookAtTarget = node.position.clone();
            }

            if (node.name === 'TableCameraZoom') {
                tableZoneRef.current.cameraPositionTarget = node.position.clone();
            }
        });
        console.log('Scene traversed and initialized');
        setSceneTraversed(true);

    }

    useEffect(() => {
        props.SubscribeToParent(onBackClick);
        setUserAtTable(false);
    });

    const onBackClick = () => {
        setCameraZoomingTowardsStart(true);
    }
    const onTableClick = () => {
        if (!cameraZoomingTowardsTable && canEnterZones) {
            setCanEnterZones(false);
            setCameraZoomingTowardsTable(true);
        }
    };

    const onReachTable = () => {
        setCameraZoomingTowardsTable(false);
        setUserAtTable(true);
        props.OnReachedActivityZone('Table');
    };

    const onReachStart = () => {
        setCameraZoomingTowardsStart(false);
        setCanEnterZones(true);
        props.OnReachedActivityZone('Start');
    };

    return (
        <group >
            <Lightning />
            <FestivalCamera
                towardsTableAnimData={{
                    onFinishAnim: onReachTable,
                    zoneTransformData: tableZoneRef.current,
                    triggerAnim: cameraZoomingTowardsTable,
                }}
                towardsStartAnimData={{
                    onFinishAnim: onReachStart,
                    zoneTransformData: startZoneRef.current,
                    triggerAnim: cameraZoomingTowardsStart,
                }}
            />
            <FestivalTable userIsHere={userAtTable} />
            <GroundPlane />
            <GizmoAxis scale={[3, 3, 3]} />
            <mesh >
                <primitive object={gltf.scene} dispose={null} />
            </mesh >

            <ActivitySelect scale={[10, 10, 10]}
                            isVisible={canEnterZones}
                            position={tableZoneRef.current.cameraLookAtTarget}
                            onClick={onTableClick} />
        </group >
    );
};

const Lightning = () => {
    return (
        <group >
            <ambientLight intensity={.1} />
            <directionalLight position={[30, 50, 0]}
                              shadow-camera-left={-100}
                              shadow-camera-right={100}
                              shadow-camera-top={100}
                              shadow-camera-bottom={-100}
                              shadowMapWidth={2048}
                              shadowMapHeight={2048}
                              shadow-camera-far={200}
                              castShadow
            />
        </group >
    );
};

const GroundPlane = () => {
    const planeGeometry = useMemo(() => {
        return new THREE.PlaneBufferGeometry();
    }, []);

    return (
        <mesh geometry={planeGeometry}
              rotation={[-Math.PI * .5, 0, 0]}
              scale={[10000, 10000, 10000]}
              receiveShadow >
            <shadowMaterial attach={'material'} opacity={.6} />
        </mesh >
    );
};

const SmallFestival = () => {
    const [backButtonVisible, setBackButtonVisible] = useState(false);
    const revertFromZoneFunc = useRef(null);

    const onClickBack = () => {
        setBackButtonVisible(false);
        revertFromZoneFunc.current();
    };

    const OnSceneReachedActivityZone = (zoneName: string) => {
        if (zoneName !== 'Start') {
            setBackButtonVisible(true);
        }
    };

    function subscribeToRevertMethod(forceRevertFromZone: () => void) {
        revertFromZoneFunc.current = forceRevertFromZone;
    }

    return (
        <div style={{
            width: "100%",
            height: "100%",
        }} >
            <Canvas className={'festivalBackground'} shadowMap
                    camera={{
                        fov: 70,
                        far: 200,
                        position: [0, 60, 0],
                    }} >
                <Suspense fallback={null} >
                    <Scene OnReachedActivityZone={OnSceneReachedActivityZone}
                           SubscribeToParent={subscribeToRevertMethod} />
                    <fog attach={'fog'} args={['#cfefc4', 20, 200]} />
                </Suspense >
            </Canvas >

            {backButtonVisible ? (
                <div onClick={onClickBack} className={'festivalBack'} >Back</div >
            ) : (<></>)}
        </div >
    );
};

export default SmallFestival;