import React from "react";
import { useGLTFLoader } from "drei";
import { Color, Vector3 } from "three";

interface ITrainRoom {
    color: Color
    position: Vector3
}

const TrainChair = (props: ITrainRoom) => {
    const gltf = useGLTFLoader('/train.gltf', true);


    return (
        <mesh position={props.position}
              geometry={(gltf as any).nodes.Chair.geometry}
              castShadow
              scale={[.4, .4, .4]}
              receiveShadow >
            <meshPhysicalMaterial roughness={1}
                                  color={props.color}
                                  flatShading
                                  transparent />
        </mesh >
    );
};

export default TrainChair;