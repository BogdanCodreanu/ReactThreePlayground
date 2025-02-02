import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "react-three-fiber";
import { useGLTFLoader } from "drei";
import * as THREE from "three";
import { Color, Vector3 } from "three";
import FestivalCamera from "./FestivalCamera";
import GizmoAxis from "../GizmoAxis";
import ActivitySelect from "./ActivitySelect";
import { IActivityZone } from "../utils";
import FestivalWheel from "./FestivalWheel";
import Clouds from "./Cloud";
import { Bloom, EffectComposer, SMAA, SSAO } from "@react-three/postprocessing";

interface ISceneProps {
    OnReachedActivityZone: (zoneName: string) => void
    SubscribeToParent: (arg0: () => void, arg1: () => void) => void
}

const Scene = (props: ISceneProps) => {
    const gltf = useGLTFLoader('/small festival.gltf', true);
    const cloudGeometry = (gltf as any).nodes.Cloud.geometry;

    const [sceneTraversed, setSceneTraversed] = useState(false);

    const [cameraZoomingTowardsStart, setCameraZoomingTowardsStart] = useState(false);
    const startZoneRef = useRef<IActivityZone>({
        cameraLookAtTarget: null,
        cameraPositionTarget: null,
    });
    const [cameraZoomingTowardsTable, setCameraZoomingTowardsTable] = useState(false);
    const tableZoneRef = useRef<IActivityZone>({
        cameraLookAtTarget: null,
        cameraPositionTarget: null,
    });

    const [cameraZoomingTowardsTable2, setCameraZoomingTowardsTable2] = useState(false);
    const tableZoneRef2 = useRef<IActivityZone>({
        cameraLookAtTarget: null,
        cameraPositionTarget: null,
    });


    const [cameraZoomingTowardsWheel, setCameraZoomingTowardsWheel] = useState(false);
    const wheelZoneRef = useRef<IActivityZone>({
        cameraLookAtTarget: null,
        cameraPositionTarget: null,
    });

    const [canEnterZones, setCanEnterZones] = useState(true);

    const [wheel, setWheel] = useState(null);
    const animations = useRef(null);

    if (!sceneTraversed) {

        animations.current = gltf.animations;
        gltf.scene.traverse(node => {
            if (node.type === "Mesh") {
                node.castShadow = true;
                node.receiveShadow = true;
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
            if (node.name === 'Table' && node.children.length > 0) {
                tableZoneRef.current.cameraLookAtTarget = node.position.clone();
            }
            if (node.name === 'TableCameraZoom') {
                tableZoneRef.current.cameraPositionTarget = node.position.clone();
            }
            if (node.name === 'Table2CameraFocus') {
                tableZoneRef2.current.cameraLookAtTarget = node.position.clone();
            }
            if (node.name === 'TableCameraZoom001') {
                tableZoneRef2.current.cameraPositionTarget = node.position.clone();
            }

            if (node.name === "FerrisWheel2") {
                setWheel(node);
                wheelZoneRef.current.cameraLookAtTarget =
                    node.position.clone().add(new THREE.Vector3(0, 20, 0));
            }

            if (node.name === "FerrisWheelTarget") {
                wheelZoneRef.current.cameraPositionTarget = node.position.clone();
            }


            // if (!node.name.startsWith('Tree')) {
            //     console.log(node);
            // }

        });
        console.log('Scene traversed and initialized');
        setSceneTraversed(true);

    }

    useEffect(() => {
        props.SubscribeToParent(onBackClick, onJoinClick);
    });


    const onJoinClick = () => {
        console.log("join");
    };

    const onBackClick = () => {
        setCameraZoomingTowardsStart(true);
    };
    const onTableClick = () => {
        if (!cameraZoomingTowardsTable && canEnterZones) {
            setCanEnterZones(false);
            setCameraZoomingTowardsTable(true);
        }
    };
    const onTableClick2 = () => {
        if (!cameraZoomingTowardsTable2 && canEnterZones) {
            setCanEnterZones(false);
            setCameraZoomingTowardsTable2(true);
        }
    };
    const onWheelClick = () => {
        if (!cameraZoomingTowardsWheel && canEnterZones) {
            setCanEnterZones(false);
            setCameraZoomingTowardsWheel(true);
        }
    };

    const onReachTable = () => {
        setCameraZoomingTowardsTable(false);
        setCameraZoomingTowardsTable2(false);
        props.OnReachedActivityZone('Table');
    };

    const onReachStart = () => {
        setCameraZoomingTowardsStart(false);
        setCanEnterZones(true);
        props.OnReachedActivityZone('Start');
    };

    const onReachWheel = () => {
        setCameraZoomingTowardsWheel(false);
        props.OnReachedActivityZone('Wheel');
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
                towardsTable2AnimData={{
                    onFinishAnim: onReachTable,
                    zoneTransformData: tableZoneRef2.current,
                    triggerAnim: cameraZoomingTowardsTable2,
                }}
                towardsWheelAnimData={{
                    onFinishAnim: onReachWheel,
                    zoneTransformData: wheelZoneRef.current,
                    triggerAnim: cameraZoomingTowardsWheel,
                }}
            />
            <GroundPlane />
            <GizmoAxis scale={[3, 3, 3]} />
            <mesh >
                <primitive object={gltf.scene} dispose={null} />
            </mesh >


            <ActivitySelect scale={[10, 10, 10]}
                            isVisible={canEnterZones}
                            position={tableZoneRef.current.cameraLookAtTarget}
                            onClick={onTableClick} />

            <ActivitySelect scale={[10, 10, 10]}
                            isVisible={canEnterZones}
                            position={tableZoneRef2.current.cameraLookAtTarget}
                            onClick={onTableClick2} />

            <ActivitySelect scale={[40, 40, 40]}
                            isVisible={canEnterZones}
                            position={wheelZoneRef.current.cameraLookAtTarget}
                            onClick={onWheelClick} />

            <FestivalWheel nodeObject={wheel} animations={animations.current} />

            <Clouds geometry={cloudGeometry} />

        </group >
    );
};

const Lightning = () => {
    return (
        <group >
            <ambientLight intensity={.1} />
            <directionalLight matrixAutoUpdate position={[30, 50, 10]}
                              shadow-camera-left={-200}
                              shadow-camera-right={200}
                              shadow-camera-top={200}
                              shadow-camera-bottom={-200}
                              shadowMapWidth={4096}
                              shadowMapHeight={4096}
                              shadow-camera-far={500}
                              shadow-camera-near={0.1}
                              shadowBias={-0.002}
                              castShadow
                              intensity={.6}
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
            <meshPhongMaterial color={new Color("#23511a")}
                               attach={'material'}
                               opacity={.6} />
        </mesh >
    );
};

const SmallFestival = () => {
    const [backButtonVisible, setBackButtonVisible] = useState(false);
    const [joinButtonVisible, setJoinButtonVisible] = useState(false);
    const revertFromZoneFunc = useRef(null);
    const joinClickRef = useRef<() => void>(null);

    const onClickBack = () => {
        setBackButtonVisible(false);
        setJoinButtonVisible(false);
        revertFromZoneFunc.current();
    };

    const onClickJoin = () => {
        setJoinButtonVisible(false);
        joinClickRef.current();
    };

    const OnSceneReachedActivityZone = (zoneName: string) => {
        if (zoneName !== 'Start') {
            setBackButtonVisible(true);
        }
        if (zoneName === 'Wheel') {
            setJoinButtonVisible(true);
        }
    };

    function subscribeToRevertMethod(forceRevertFromZone: () => void, joinClick: () => void) {
        revertFromZoneFunc.current = forceRevertFromZone;
        joinClickRef.current = joinClick;
    }

    return (
        <div style={{
            width: "100%",
            height: "100%",
        }} >
            <Canvas className={'festivalBackground'} shadowMap
                    camera={{
                        fov: 70,
                        near: .1,
                        far: 300,
                        position: [0, 60, 0],
                    }}
                    style={{background: "#a5c4e5"}}
            >
                <Suspense fallback={null} >
                    <Scene OnReachedActivityZone={OnSceneReachedActivityZone}
                           SubscribeToParent={subscribeToRevertMethod} />
                    <fog far={200} near={70} attach={'fog'} args={['#23511a', 20, 200]} />
                </Suspense >

            </Canvas >

            {backButtonVisible ? (
                <div onClick={onClickBack} className={'festivalBack'} >Back</div >
            ) : (<></>)}

            {joinButtonVisible ? (
                <div onClick={onClickJoin} className={'festivalJoin'} >Join</div >
            ) : (<></>)}

        </div >
    );
};

export default SmallFestival;