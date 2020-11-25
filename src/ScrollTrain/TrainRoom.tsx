import React from "react";
import { useGLTFLoader } from "drei";
import { Color, Vector3 } from "three";
import TrainChair from "./TrainChair";

interface ITrainRoom {
    color: Color
    chairsColor: Color
    position: Vector3
}

interface ITrainRoom {
    color: Color
    chairsColor: Color
    position: Vector3
}

const ChairsRow = (props: { verticalPosition: number, color: Color, yRot: number }) => {

    return (
        <group position={[1.85, .52, -8 + props.verticalPosition]}
               rotation={[0, props.yRot, 0]} >
            <TrainChair color={props.color} position={new Vector3(0, 0, 0)} />
            <TrainChair color={props.color} position={new Vector3(1.4, 0, 0)} />
            <TrainChair color={props.color} position={new Vector3(3.7, 0, 0)} />


            <TrainChair color={props.color}
                        position={new Vector3(0, 0, -2.5)}
                        rotation={[0, Math.PI, 0]} />
            <TrainChair color={props.color}
                        position={new Vector3(1.4, 0, -2.5)}
                        rotation={[0, Math.PI, 0]} />
            <TrainChair color={props.color}
                        position={new Vector3(3.7, 0, -2.5)}
                        rotation={[0, Math.PI, 0]} />
        </group >

    );
};

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

            <ChairsRow color={props.chairsColor} verticalPosition={0} yRot={Math.PI} />
            <ChairsRow color={props.chairsColor} verticalPosition={3.5} yRot={Math.PI} />
            <ChairsRow color={props.chairsColor} verticalPosition={7} yRot={Math.PI} />
            <ChairsRow color={props.chairsColor} verticalPosition={10.3} yRot={Math.PI} />
        </group >
    );
};

export default TrainRoom;