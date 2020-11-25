import React, { Suspense, useMemo, useState } from "react";
import { Canvas, useFrame } from "react-three-fiber";

import { useTextureLoader } from "drei";
import ImageFadeMaterial from "./imageFadeMaterial";
import { MathUtils } from "three";


const Image = () => {
    const [hovered, setHovered] = useState(false);

    const duckPic = useTextureLoader('/duck1.png');
    const shrimpPic = useTextureLoader('/shrimp1.png');
    const grayScale = useTextureLoader('/grayscaleTexture.jpg');

    const [time, setTime] = useState(0);

    const material = useMemo(() => {
        console.log("material inited");
        const material = new ImageFadeMaterial();

        material.uniforms.tex = { value: duckPic };
        material.uniforms.tex2 = { value: shrimpPic };
        material.uniforms.disp = { value: grayScale };

        return material;
    }, [duckPic, grayScale, shrimpPic]);


    useFrame((state, delta) => {
        material.uniforms.dispFactor =
            {
                value: MathUtils.lerp(material.uniforms.dispFactor.value,
                    hovered ? 1 : 0,
                    0.05),
            };
        setTime(time + delta);
    });


    return (
        <mesh scale={[3, 3, 1]}
              rotation={[0, Math.sin(time) * Math.PI / 8, 0]}
              onPointerOver={(e) => setHovered(true)}
              onPointerOut={(e) => setHovered(false)}
              material={material}
        >

            <planeBufferGeometry attach={'geometry'} />
        </mesh >
    );
};


const Shader1 = () => {
    return (
        <Canvas >
            <ambientLight intensity={.85} />

            <Suspense fallback={null} >
                <Image />
            </Suspense >
        </Canvas >
    );
};

export default Shader1;