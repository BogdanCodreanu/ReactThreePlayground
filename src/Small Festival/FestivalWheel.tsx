import React, { useEffect, useRef } from "react";
import * as THREE from 'three';
import { useFrame } from "react-three-fiber";

interface IWheelProps {
    nodeObject: THREE.Object3D
    animations: THREE.AnimationClip[]
}

const FestivalWheel = (props: IWheelProps) => {
    const mixer = useRef<THREE.AnimationMixer>(null);


    useEffect(() => {
        if (props.nodeObject) {
            mixer.current = new THREE.AnimationMixer(props.nodeObject);

            const animAction = mixer.current.clipAction(
                props.animations[0],
                props.nodeObject);
            animAction.loop = THREE.LoopRepeat;
            animAction.play();

            console.log("Anim init", animAction);
        }

    }, [props.animations, props.nodeObject]);

    useFrame((state, delta) => {
       if (mixer.current) {
           mixer.current.update(delta);
       }
    });

    return (
        <>
        </>
    );
};
export default FestivalWheel;