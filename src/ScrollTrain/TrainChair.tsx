import React from "react";
import { useGLTFLoader } from "drei";
import { Color, Vector3 } from "three";

interface ITrainRoom {
    color: Color
    position: Vector3
    rotation?: [number, number, number]
}

const TrainChair = (props: ITrainRoom) => {
    const gltf = useGLTFLoader('/train.gltf', true);

    return (
        <mesh position={props.position}
              geometry={(gltf as any).nodes.Chair.geometry}
              rotation={props.rotation ?? [0, 0, 0]}
              castShadow
              scale={[.4, .4, .4]}
              receiveShadow >
            <meshPhysicalMaterial roughness={1}
                                  color={props.color}
                                  transparent />
        </mesh >
    );
};

export default TrainChair;