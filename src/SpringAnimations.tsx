import { Canvas, useFrame } from "react-three-fiber";
import React, { useEffect, useRef, useState } from "react";
import { animated, useSpring } from "@react-spring/three";
import { BoxBufferGeometry, Vector3 } from "three";
import { useMemo } from "react";

const getRandomColor = () => '#' +
                             (0x1000000 + (Math.random()) * 0xffffff).toString(16)
                                 .substr(1, 6);


interface IBoxProps {
    position: Vector3 | [number, number, number]
    index: [number, number]
    subscribe: (arg0: (color: string) => void, arg1: number, arg2: number) => void
    onChildClickThis: (arg0: string, arg1: number, arg2: number) => void
}

const Box = (props: IBoxProps) => {
    const [hover, setHover] = useState(false);
    const [rotate, setRotate] = useState(false);
    const [mainColor, setMainColor] = useState('#ffffff');
    const [canChangeColorHover, setCanChangeColorHover] = useState(true);

    const boxMesh = useRef(null);
    const rotationSpeed = 5;
    const randomColor = getRandomColor();
    const boxMemo = useMemo(() => new BoxBufferGeometry(), []);


    useEffect(() => {
        props.subscribe(forceClickWithColor, props.index[0], props.index[1]);
    }, [props]);

    const pointerOver = (e) => {
        setHover(true);
    };
    const pointerOut = (e) => {
        setHover(false);
    };

    const forceClickWithColor = (color: string) => {
        setRotate(true);
        setMainColor(color);
        setCanChangeColorHover(false);
    };

    const pointerClick = () => {
        if (!rotate) {
            props.onChildClickThis(randomColor, props.index[0], props.index[1]);
            setRotate(true);
            setMainColor(randomColor);
            setCanChangeColorHover(false);
        }
    };

    useFrame((state, delta) => {
        const desiredRot = hover ? Math.PI * 0.5 : 0;

        if (hover) {
            boxMesh.current.rotation.x = Math.min(
                boxMesh.current.rotation.x + rotationSpeed * delta,
                desiredRot);
        } else {
            boxMesh.current.rotation.x = Math.max(
                boxMesh.current.rotation.x - rotationSpeed * delta,
                desiredRot);


            if (boxMesh.current.rotation.x === 0) {
                setCanChangeColorHover(true);
            }
        }

        if (rotate) {
            boxMesh.current.rotation.z = Math.min(
                boxMesh.current.rotation.z + rotationSpeed * delta,
                Math.PI * 0.5);

            if (boxMesh.current.rotation.z === Math.PI * 0.5) {
                boxMesh.current.rotation.z = 0;
                setRotate(false);
            }
        }
    });


    const colorAnim = useSpring({
        color: hover && !rotate && canChangeColorHover ? randomColor : mainColor,
        config: {
            duration: 200,
        },
    });

    return (
        <animated.mesh ref={boxMesh}
                       position={props.position}
                       onPointerOver={pointerOver}
                       onPointerOut={pointerOut}
                       onClick={pointerClick}
                       geometry={boxMemo} >
            <animated.meshStandardMaterial attach={'material'}
                                           color={colorAnim.color} />
        </animated.mesh >
    );
};


const SpringAnimations = () => {
    const matrixNumber = 10;
    const posMultiply = 1.4;
    const boxes = [];

    const onCreatedCanvas = (context) => {
        context.camera.lookAt(
            matrixNumber * posMultiply * .5,
            0,
            matrixNumber * posMultiply * .5);
    };

    const onClickChild = (color: string, XPos: number, ZPos: number) => {
        const affected = (boxes.filter(box => box.x !== XPos || box.z !== ZPos)
            .filter(box => box.x === XPos || box.z === ZPos))
            .filter(box => Math.abs(box.x - XPos) < 2 && Math.abs(box.z - ZPos) < 2)
        ;
        affected.forEach(box => box.changeColor(color));
    };


    const subscribeBox = (changeColorMethod, x, z) => {
        boxes.push({
            changeColor: changeColorMethod,
            x: x,
            z: z,
        });
    };

    return (
        <Canvas onCreated={onCreatedCanvas} camera={{
            position: [
                matrixNumber * posMultiply * .5, 60, matrixNumber * posMultiply * .5,
            ],
            fov: 20,
        }}
                colorManagement >
            <pointLight position={[-4, 6, -3]} intensity={1} />
            {[...Array(matrixNumber).keys()].map(x =>
                [...Array(matrixNumber).keys()].map(z =>
                    <Box subscribe={subscribeBox}
                         onChildClickThis={onClickChild}
                         key={`RotatingBox ${x}${z}`}
                         index={[x, z]}
                         position={[x * posMultiply, 0, z * posMultiply]} />))}
        </Canvas >
    );
};

export default SpringAnimations;