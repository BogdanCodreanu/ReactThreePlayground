import React, { useEffect, useRef, useState } from 'react';
import { Vector3 } from 'three';
import { useSpring } from "@react-spring/core";
import { animated } from '@react-spring/three';

interface BoxProps {
    position: Vector3 | [x: number, y: number, z: number];
}

const Box = (props: BoxProps) => {
    const [active, setActive] = useState(0);
    const activeRef = useRef(active);
    activeRef.current = active;

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        const toggleActivate = () => {
            timeout = setTimeout(() => {
                setActive(1 - activeRef.current);
                toggleActivate();
            }, Math.random() * 1000 + 1000);
        };

        toggleActivate();

        return () => {
            clearTimeout(timeout);
        };
    }, []);

    const props2 = useSpring({
        spring: active,
        config: {
            mass: 5,
            tension: 400,
            friction: 50,
            precision: 0.001,
        },
    });
    const scale = props2.spring.to([0, 1], [1, 2]);
    const rotation = props2.spring.to([0, 2], [0, Math.PI]);
    const color = props2.spring.to([0, 1], ["#9867f5", "#6dffe1"]);


    return (
        <animated.mesh
            rotation-y={rotation}
            scale-x={scale}
            scale-y={scale}
            scale-z={scale}
            position={props.position} >

            <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
            <animated.meshStandardMaterial roughness={0.5} attach="material"
                                           color={color} />


        </animated.mesh >
    );
};

export default Box;

// import ReactDOM from 'react-dom'
// import React, { useRef, useState } from 'react'
// import { Canvas, MeshProps, useFrame } from 'react-three-fiber'
// import { Mesh } from 'three'
//
// export default function Box(props: MeshProps) {
//     // This reference will give us direct access to the mesh
//     const mesh = useRef<Mesh>()
//
//     // Set up state for the hovered and active state
//     const [hovered, setHover] = useState(false)
//     const [active, setActive] = useState(false)
//
//     // Rotate mesh every frame, this is outside of React without overhead
//     useFrame(() => {
//         if (mesh.current) mesh.current.rotation.x = mesh.current.rotation.y += 0.01
//     })
//
//     return (
//         <mesh
//             {...props}
//             ref={mesh}
//             scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
//             onClick={(_event) => setActive(!active)}
//             onPointerOver={(event) => setHover(true)}
//             onPointerOut={(event) => setHover(false)}>
//             <boxBufferGeometry args={[1, 1, 1]} />
//             <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
//         </mesh>
//     )
// }