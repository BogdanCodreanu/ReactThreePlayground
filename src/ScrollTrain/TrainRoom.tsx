import React from "react";
import { useGLTFLoader } from "drei";
import { Color, Vector3 } from "three";
import TrainChair from "./TrainChair";

interface ITrainRoom {
    color: Color
    chairsColor: Color
    position: Vector3

}

const TrainRoom = (props: ITrainRoom) => {
    const gltf = useGLTFLoader('/train.gltf', true);


    return (
        <group position={props.position} >
            <mesh
                geometry={(gltf as any).nodes.train.geometry}
                castShadow
                receiveShadow >
                <meshPhysicalMaterial roughness={1}
                                      color={props.color}
                                      flatShading
                                      transparent />
            </mesh >

            <TrainChair color={props.chairsColor} position={new Vector3(0, 0, 0)} />
        </group >
    );
};

export default TrainRoom;