import React, { useEffect, useRef, useState } from "react";
import { Camera, useFrame } from "react-three-fiber";
import { Vector3 } from "three";
import { IAnimationData } from "../utils";
import { OrbitControls } from "drei";

interface IFestivalCamera {
    towardsTableAnimData: IAnimationData
    towardsTable2AnimData: IAnimationData
    towardsStartAnimData: IAnimationData
    towardsWheelAnimData: IAnimationData
}

interface ICameraMovement {
    counter: number
    startingPos: Vector3
    targetPos: Vector3
    currentLookAt: Vector3
    targetLookAt: Vector3
    OnFinishMovement: () => void
}

const FestivalCamera = (props: IFestivalCamera) => {
    const cameraRef = useRef<Camera>(null);
    const orbitControls = useRef<OrbitControls>(null);

    const [currentLookAt, setCurrentLookAt] = useState<Vector3>(new Vector3(0, 0, 0));
    const [movementData, setMovementData] = useState<ICameraMovement>();
    const animSpeed = .6;

    const [isMovingToTable, setIsMovingToTable] = useState(false);
    const [isMovingToTable2, setIsMovingToTable2] = useState(false);
    const [isMovingToStart, setIsMovingToStart] = useState(false);
    const [isMovingToWheel, setIsMovingToWheel] = useState(false);

    const [canLookAround, setCanLookAround] = useState(false);

    const pointerPosZero = useRef<Vector3>(new Vector3());
    const pointerRightDir = useRef<Vector3>(new Vector3());
    const pointerUpDir = useRef<Vector3>(new Vector3());


    const InitializeCamera = (camera: Camera) => {
        if (!cameraRef.current) {
            cameraRef.current = camera;
            cameraRef.current.position.set(
                props.towardsStartAnimData.zoneTransformData.cameraPositionTarget.x,
                props.towardsStartAnimData.zoneTransformData.cameraPositionTarget.y,
                props.towardsStartAnimData.zoneTransformData.cameraPositionTarget.z,
            );
            orbitControls.current.target =
                props.towardsStartAnimData.zoneTransformData.cameraLookAtTarget.clone();
            console.log('festival camera initialized');
        }
    };

    const InitStartMovementAnim = (
        targetPos: Vector3,
        currentLookAt: Vector3,
        targetLookAt: Vector3,
        OnFinishMovement: () => void) => {

        setCurrentLookAt(orbitControls.current.target as Vector3);
        setMovementData({
            startingPos: cameraRef.current.position.clone(),
            targetPos: targetPos,
            counter: 0,
            currentLookAt: currentLookAt,
            targetLookAt: targetLookAt,
            OnFinishMovement: OnFinishMovement,
        });
        setCanLookAround(false);
        console.log("started anim on camera");
    };

    function CheckForAnimation(
        delta: number,
        animData: IAnimationData,
        initiatedAnimCondition: boolean,
        setInitiatedAnimCondition: (value: boolean) => void,
        onFinishAnimAdditional?: () => void) {

        if (animData.triggerAnim) {
            if (!initiatedAnimCondition) {
                setInitiatedAnimCondition(true);
                InitStartMovementAnim(
                    animData.zoneTransformData.cameraPositionTarget,
                    currentLookAt,
                    animData.zoneTransformData.cameraLookAtTarget,
                    () => {
                        pointerPosZero.current =
                            cameraRef.current.localToWorld(new Vector3(0, 0, -1));
                        pointerRightDir.current =
                            cameraRef.current.localToWorld(new Vector3(1, 0, -1))
                                .sub(pointerPosZero.current);
                        pointerUpDir.current =
                            cameraRef.current.localToWorld(new Vector3(0, 1, -1))
                                .sub(pointerPosZero.current);

                        onFinishAnimAdditional?.();
                        animData.onFinishAnim();
                        setInitiatedAnimCondition(false);
                    });
            } else {
                setMovementData({
                    ...movementData,
                    counter: movementData.counter + delta * animSpeed,
                });
            }
        }
    }

    useFrame((state, delta) => {
        InitializeCamera(state.camera);

        state.camera.updateWorldMatrix(true, true);

        CheckForAnimation(
            delta,
            props.towardsTableAnimData,
            isMovingToTable,
            setIsMovingToTable);


        CheckForAnimation(
            delta,
            props.towardsStartAnimData,
            isMovingToStart,
            setIsMovingToStart);


        CheckForAnimation(
            delta,
            props.towardsTable2AnimData,
            isMovingToTable2,
            setIsMovingToTable2,
            () => {
                setCanLookAround(true);
            });

        CheckForAnimation(
            delta,
            props.towardsWheelAnimData,
            isMovingToWheel,
            setIsMovingToWheel,
            () => {

            });

        if (canLookAround) {
            const desiredValue =
                pointerPosZero.current.clone()
                    .add(pointerRightDir.current.clone()
                        .multiplyScalar(state.mouse.x * 1.2))
                    .add(pointerUpDir.current.clone()
                        .multiplyScalar(state.mouse.y * .4));

            const currentTarVec = new Vector3(
                orbitControls.current.target[0],
                orbitControls.current.target[1],
                orbitControls.current.target[2]);

            (orbitControls.current.target as Vector3).lerp(
                desiredValue, .2);

            // const lookAtTarget = cameraRef.current.localToWorld(new Vector3(
            //     state.mouse.x,
            //     0,
            //     1));
            //
            // orbitControls.current.target = lookAtTarget;
        }
    });

    useEffect(() => {
        if (movementData) {
            const lerpValue = Math.min(1, movementData.counter);
            const easedValue = lerpValue < 0.5 ? 4 *
                                                 lerpValue *
                                                 lerpValue *
                                                 lerpValue : 1 -
                                                             Math.pow(
                                                                 -2 * lerpValue + 2,
                                                                 3) /
                                                             2;

            cameraRef.current.position.lerpVectors(
                movementData.startingPos,
                movementData.targetPos,
                easedValue);

            orbitControls.current.target = new Vector3().lerpVectors(
                movementData.currentLookAt,
                movementData.targetLookAt,
                easedValue);

            if (lerpValue >= 1) {
                setCurrentLookAt(movementData.targetLookAt);
                movementData.OnFinishMovement();
            }
        }
    }, [movementData]);


    return (
        <>
            <OrbitControls ref={orbitControls} enabled={false} />
        </>);
};

export default FestivalCamera;