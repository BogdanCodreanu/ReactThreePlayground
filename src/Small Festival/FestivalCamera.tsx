import React, { useEffect, useRef, useState } from "react";
import { Camera, useFrame } from "react-three-fiber";
import { Vector3 } from "three";
import { IAnimationData } from "../utils";

interface IFestivalCamera {
    towardsTableAnimData: IAnimationData
    towardsStartAnimData: IAnimationData
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

    const [currentLookAt, setCurrentLookAt] = useState<Vector3>(new Vector3(0, 0, 0));
    const [movementData, setMovementData] = useState<ICameraMovement>();
    const animSpeed = .6;

    const [isMovingToTable, setIsMovingToTable] = useState(false);
    const [isMovingToStart, setIsMovingToStart] = useState(false);


    const InitializeCamera = (camera: Camera) => {
        if (!cameraRef.current) {
            cameraRef.current = camera;
            cameraRef.current.position.set(
                props.towardsStartAnimData.zoneTransformData.cameraPositionTarget.x,
                props.towardsStartAnimData.zoneTransformData.cameraPositionTarget.y,
                props.towardsStartAnimData.zoneTransformData.cameraPositionTarget.z,
            );
            camera.lookAt(
                props.towardsStartAnimData.zoneTransformData.cameraLookAtTarget.x,
                props.towardsStartAnimData.zoneTransformData.cameraLookAtTarget.y,
                props.towardsStartAnimData.zoneTransformData.cameraLookAtTarget.z);
            console.log('festival camera initialized');
        }
    };

    const InitStartMovementAnim = (
        targetPos: Vector3,
        currentLookAt: Vector3,
        targetLookAt: Vector3,
        OnFinishMovement: () => void) => {

        setMovementData({
            startingPos: cameraRef.current.position.clone(),
            targetPos: targetPos,
            counter: 0,
            currentLookAt: currentLookAt,
            targetLookAt: targetLookAt,
            OnFinishMovement: OnFinishMovement,
        });
        console.log("started anim on camera");
    };

    function CheckForAnimation(
        delta: number,
        animData: IAnimationData,
        initiatedAnimCondition: boolean,
        setInitiatedAnimCondition: (value: boolean) => void) {

        if (animData.triggerAnim) {
            if (!initiatedAnimCondition) {
                setInitiatedAnimCondition(true);
                InitStartMovementAnim(
                    animData.zoneTransformData.cameraPositionTarget,
                    currentLookAt,
                    animData.zoneTransformData.cameraLookAtTarget,
                    () => {
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

            cameraRef.current.lookAt(new Vector3().lerpVectors(
                movementData.currentLookAt,
                movementData.targetLookAt,
                easedValue));

            if (lerpValue >= 1) {
                setCurrentLookAt(movementData.targetLookAt);
                movementData.OnFinishMovement();
            }
        }
    }, [movementData]);


    return null;
};

export default FestivalCamera;