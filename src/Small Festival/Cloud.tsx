import React, { useEffect, useRef, useState } from "react";
import { Geometry, Mesh, Vector3 } from "three";
import { useFrame } from "react-three-fiber";

interface ICloud {
    geometry: Geometry
    from: Vector3
    to: Vector3
}

const Cloud = (props: ICloud) => {
    const mesh = useRef<Mesh>(null);
    const [speed, setSpeed] = useState((Math.random() + .5) * .01);

    const moveCounterLerp = useRef<number>(Math.random());

    useFrame(((state, delta) => {
        moveCounterLerp.current += delta * speed;
        mesh.current.position.lerpVectors(
            props.from,
            props.to,
            moveCounterLerp.current % 1);
    }));

    return (
        <mesh ref={mesh} geometry={props.geometry} receiveShadow={false} castShadow >
            <meshToonMaterial color={'white'} />
        </mesh >
    );
};

const Clouds = (props: { geometry: Geometry }) => {
    const [clouds, setClouds] = useState(null);

    useEffect(() => {
        setClouds(<>
            {[...Array(10).keys()].map(rand => (Math.random() - 0.5) * 100).map(rand =>
                <Cloud key={rand} geometry={props.geometry}
                       from={new Vector3(-200, rand / 10, rand)}
                       to={new Vector3(100, rand / 10, rand)} />,
            )}
        </>);
    }, []);

    return (
        <group position={[0, 20, 80]} >
            {clouds}
        </group >
    );
};

export default Clouds;