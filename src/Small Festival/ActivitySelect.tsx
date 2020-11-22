import React, { useMemo, useState } from "react";
import * as THREE from 'three';
import { Vector3 } from "react-three-fiber";
import { useSpring } from "@react-spring/core";
import { animated } from "@react-spring/three";

interface ISelectionProps {
    position: Vector3 | [number, number, number]
    scale: [number, number, number]
    isVisible: boolean
    onClick: () => void
}

const ActivitySelect = (props: ISelectionProps) => {
    const [hover, setHover] = useState(false);
    const boxGeometry = useMemo(() => {
        return new THREE.BoxGeometry();
    }, []);

    const OnPointerOver = () => {
        setHover(true);
    };

    const OnPointerOut = () => {
        setHover(false);
    };

    const transparencyAnim = useSpring({
        transparency: hover && props.isVisible ? .5 : 0,
    });

    return (
        <mesh geometry={boxGeometry}
              position={props.position}
              scale={props.scale}
              onPointerOver={OnPointerOver}
              onPointerOut={OnPointerOut}
              onClick={props.onClick} >
            <animated.meshBasicMaterial attach={'material'}
                                        transparent
                                        opacity={transparencyAnim.transparency}
                                        color={'blue'} />
        </mesh >
    );
};

export default ActivitySelect;