"use client";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import india from "@/data/india.json";
function MapModel() {
  const group = useRef<THREE.Group>(null);
  const { camera, size, invalidate } = useThree();
  const progress = useRef(0);
  const shapes = useMemo(
    () =>
      india.rings.map((r) => {
        const shape = new THREE.Shape();
        r.forEach(([x, y], i) =>
          i ? shape.lineTo(x - 50, 55 - y) : shape.moveTo(x - 50, 55 - y),
        );
        return shape;
      }),
    [],
  );
  useEffect(() => {
    if (camera instanceof THREE.OrthographicCamera) {
      camera.zoom = size.width / 106;
      camera.updateProjectionMatrix();
      invalidate();
    }
  }, [camera, size.width, invalidate]);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: "#presence",
      start: "top bottom",
      end: "bottom top",
      onUpdate: (s) => {
        progress.current = s.progress;
        invalidate();
      },
    });
    return () => st.kill();
  }, [invalidate]);
  useFrame(() => {
    if (group.current) {
      group.current.rotation.x = 0.08 + progress.current * 0.11;
      group.current.rotation.y = -0.05 + progress.current * 0.07;
    }
    if (camera instanceof THREE.OrthographicCamera) {
      camera.zoom =
        (size.width / 106) * (1 + 0.06 * Math.sin(progress.current * Math.PI));
      camera.updateProjectionMatrix();
    }
  });
  return (
    <group ref={group} rotation={[0.13, -0.02, -0.02]}>
      {shapes.map((shape, i) => (
        <group key={i}>
          <mesh>
            <extrudeGeometry
              args={[
                shape,
                {
                  depth: 3,
                  bevelEnabled: true,
                  bevelSegments: 2,
                  steps: 1,
                  bevelSize: 0.25,
                  bevelThickness: 0.3,
                },
              ]}
            />
            <meshStandardMaterial
              color="#263e4b"
              roughness={0.65}
              metalness={0.45}
            />
          </mesh>
          <Line
            points={india.rings[i].map(
              ([x, y]) => [x - 50, 55 - y, 3.4] as [number, number, number],
            )}
            color="#b19a65"
            lineWidth={0.8}
          />
        </group>
      ))}
    </group>
  );
}
export default function IndiaMapScene() {
  return (
    <Canvas
      orthographic
      frameloop="demand"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 120], zoom: 4, near: 0.1, far: 300 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      aria-hidden="true"
    >
      <ambientLight intensity={1.5} />
      <directionalLight
        position={[-30, 50, 40]}
        intensity={3}
        color="#cfb57c"
      />
      <directionalLight
        position={[30, -20, 20]}
        intensity={1.5}
        color="#87acc8"
      />
      <MapModel />
    </Canvas>
  );
}
