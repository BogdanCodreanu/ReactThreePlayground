import { Euler, Vector3 } from "three";

export const lerp = (val1: number, val2: number, amount: number) => {
    amount = Math.min(amount, 1);
    amount = Math.max(amount, 0);
    return val1 + (val2 - val1) * amount;
};

export interface IActivityZone {
    cameraPositionTarget: Vector3
    cameraLookAtTarget: Vector3
}

export interface IAnimationData {
    triggerAnim: boolean,
    onFinishAnim?: () => void,
    zoneTransformData: IActivityZone
}