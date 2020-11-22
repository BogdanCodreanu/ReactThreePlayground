import React, { useMemo } from "react";
import * as THREE from "three";

function GizmoAxis(props: any) {
    const boxMemo = useMemo(() => new THREE.BoxBufferGeometry(), []);
    const coneMemo = useMemo(() => new THREE.ConeBufferGeometry(), []);

    return (
        <group {...props}>
            <mesh scale={[2, 0.01, 0.01]} position={[0, 0, 0]} geometry={boxMemo} >
                <meshLambertMaterial attach="material" color="red" />
            </mesh >

            <mesh
                scale={[0.1, 0.1, 0.1]}
                position={[1, 0, 0]}
                rotation={[0, 0, -Math.PI / 2]}
                geometry={coneMemo}
            >
                <meshLambertMaterial attach="material" color="red" />
            </mesh >

            <mesh scale={[0.01, 2, 0.01]} position={[0, 0, 0]} geometry={boxMemo} >
                <meshLambertMaterial attach="material" color="green" />
            </mesh >

            <mesh
                scale={[0.1, 0.1, 0.1]}
                position={[0, 1, 0]}
                rotation={[0, 0, 0]}
                geometry={coneMemo}
            >
                <meshLambertMaterial attach="material" color="green" />
            </mesh >

            <mesh scale={[0.01, 0.01, 2]} position={[0, 0, 0]} geometry={boxMemo} >
                <meshLambertMaterial attach="material" color="blue" />
            </mesh >

            <mesh
                scale={[0.1, 0.1, 0.1]}
                position={[0, 0, 1]}
                rotation={[Math.PI / 2, 0, 0]}
                geometry={coneMemo}
            >
                <meshLambertMaterial attach="material" color="blue" />
            </mesh >
        </group >
    );
}

export default GizmoAxis;
