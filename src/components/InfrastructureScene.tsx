"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const gold = "#c8a774";
function Box({
  position = [0, 0, 0],
  scale = [1, 1, 1],
  color = "#829095",
  ...props
}: {
  position?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  rotation?: [number, number, number];
}) {
  return (
    <mesh position={position} scale={scale} {...props}>
      <boxGeometry />
      <meshStandardMaterial color={color} roughness={0.74} metalness={0.18} />
    </mesh>
  );
}
function Bridge({ compact = false }: { compact?: boolean }) {
  const length = compact ? 54 : 125;
  const center = compact ? 0 : -12;
  const segments = compact ? 17 : 32;
  return (
    <group>
      <Box
        position={[0, 0.5, center]}
        scale={[7, 0.6, length]}
        color="#66727b"
      />
      <Box
        position={[0, 0.84, center]}
        scale={[6.5, 0.06, length]}
        color="#303b44"
      />
      {[-3.5, 3.5].map((x) => (
        <group key={x}>
          <Box
            position={[x, 1.1, center]}
            scale={[0.13, 0.7, length]}
            color="#bcaa85"
          />
          <Box
            position={[x, 0.2, center]}
            scale={[0.4, 0.8, length]}
            color="#899294"
          />
        </group>
      ))}
      {(compact ? [-10, 10] : [-21, 10]).map((z) => (
        <group key={z}>
          <Box
            position={[-3.3, 6.5, z]}
            scale={[0.8, 16, 1.15]}
            color="#b1a897"
          />
          <Box
            position={[3.3, 6.5, z]}
            scale={[0.8, 16, 1.15]}
            color="#b1a897"
          />
          <Box position={[0, 13, z]} scale={[7.4, 0.8, 1.15]} color="#b1a897" />
          <Box
            position={[0, 3.8, z]}
            scale={[7.4, 0.6, 1.15]}
            color="#92958f"
          />
          {[-3.35, 3.35].map((x) =>
            Array.from({ length: 9 }, (_, i) => i + 1).map((i) => (
              <group key={`${x}-${i}`}>
                <Line
                  points={[
                    [x, 13 - i * 0.3, z],
                    [x, 1.25, z + i * (compact ? 1.2 : 1.65)],
                  ]}
                  color={gold}
                  lineWidth={0.6}
                />
                <Line
                  points={[
                    [x, 13 - i * 0.3, z],
                    [x, 1.25, z - i * (compact ? 1.2 : 1.65)],
                  ]}
                  color={gold}
                  lineWidth={0.6}
                />
              </group>
            )),
          )}
          <Box position={[-3.3, -3, z]} scale={[1.3, 5, 2]} color="#7e8785" />
          <Box position={[3.3, -3, z]} scale={[1.3, 5, 2]} color="#7e8785" />
        </group>
      ))}
      {Array.from({ length: segments }, (_, i) => (
        <group key={i}>
          <Box
            position={[
              0,
              0.9,
              (i / (segments - 1) - 0.5) * (length - 3) + center,
            ]}
            scale={[0.09, 0.02, 1.5]}
            color="#d7ceae"
          />
          {[-3.25, 3.25].map((x) => (
            <group key={x}>
              <Box
                position={[
                  x,
                  1.8,
                  (i / (segments - 1) - 0.5) * (length - 1) + center,
                ]}
                scale={[0.06, 2, 0.06]}
                color="#a5a19a"
              />
              <mesh
                position={[
                  x,
                  2.8,
                  (i / (segments - 1) - 0.5) * (length - 1) + center,
                ]}
              >
                <sphereGeometry args={[0.09, 6, 6]} />
                <meshBasicMaterial color="#ffdaa0" />
              </mesh>
            </group>
          ))}
        </group>
      ))}
      {(compact
        ? [
            [-1.5, 18],
            [1.6, -4],
            [-1.5, -16],
            [1.6, 10],
          ]
        : [
            [-1.5, 18],
            [1.6, -4],
            [-1.5, -32],
            [1.6, 29],
          ]
      ).map(([x, z], i) => (
        <group key={i} position={[x, 1.1, z]}>
          <Box scale={[0.8, 0.45, 1.7]} color={i % 2 ? "#cebea4" : "#b59865"} />
          <Box
            position={[0, 0.3, -0.1]}
            scale={[0.65, 0.35, 0.8]}
            color="#44515b"
          />
        </group>
      ))}
    </group>
  );
}
function City() {
  const buildings = useMemo(
    () =>
      Array.from({ length: 65 }, (_, i) => ({
        x: (i % 22) * 4.2 - 46,
        z: -64 - Math.floor(i / 22) * 9,
        h: 3 + ((i * 17) % 13),
        w: 1.4 + ((i * 7) % 3),
      })),
    [],
  );
  return (
    <group>
      {buildings.map((b, i) => (
        <group key={i}>
          <Box
            position={[b.x, b.h / 2 - 3, b.z]}
            scale={[b.w, b.h, b.w]}
            color={i % 3 ? "#45505c" : "#69717b"}
          />
          {i % 4 === 0 && (
            <Box
              position={[b.x, b.h - 2, b.z]}
              scale={[b.w * 0.8, 0.12, b.w + 0.05]}
              color="#bc9f6d"
            />
          )}
        </group>
      ))}
      {[-20, 22].map((x, i) => (
        <group key={i} position={[x, 0, -49]}>
          <Box position={[0, 5, 0]} scale={[0.2, 15, 0.2]} color="#bcaa85" />
          <Box
            position={[2.5, 12, 0]}
            scale={[10, 0.15, 0.2]}
            color="#bcaa85"
          />
          <Line
            points={[
              [-2.5, 12, 0],
              [0, 15, 0],
              [7, 12, 0],
            ]}
            color="#bcaa85"
            lineWidth={0.7}
          />
          <Line
            points={[
              [6, 12, 0],
              [6, 7, 0],
            ]}
            color="#bcaa85"
            lineWidth={0.6}
          />
        </group>
      ))}
    </group>
  );
}
function CameraJourney({ hero }: { hero: boolean }) {
  const { camera, invalidate } = useThree();
  const progress = useRef(0);
  useEffect(() => {
    if (!hero) return;
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: "#home",
      start: "top top",
      end: "bottom top",
      onUpdate: (s) => {
        progress.current = s.progress;
        invalidate();
      },
    });
    return () => st.kill();
  }, [hero, invalidate]);
  useFrame((_, dt) => {
    if (hero) {
      const p = progress.current;
      const target = new THREE.Vector3(31 - p * 10, 13 - p * 3, 34 - p * 17);
      camera.position.lerp(target, Math.min(dt * 3, 1));
      camera.lookAt(-5 + p * 6, 3, -17);
      if (camera.position.distanceTo(target) > 0.003) invalidate();
    } else {
      camera.position.set(28, 21, 31);
      camera.lookAt(0, 2, 0);
    }
  });
  return null;
}
function CapabilityModel({ kind }: { kind: number }) {
  const ref = useRef<THREE.Group>(null);
  const { invalidate } = useThree();
  useEffect(() => {
    if (ref.current) {
      ref.current.scale.setScalar(0.85);
      const tween = gsap.to(ref.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.8,
        ease: "power2.out",
        onUpdate: invalidate,
      });
      return () => {
        tween.kill();
      };
    }
  }, [kind, invalidate]);
  return (
    <group ref={ref}>
      <Box position={[0, -0.6, 0]} scale={[25, 1, 23]} color="#273d4e" />
      <Line
        points={[
          [-12.5, 0, -11.5],
          [12.5, 0, -11.5],
          [12.5, 0, 11.5],
          [-12.5, 0, 11.5],
          [-12.5, 0, -11.5],
        ]}
        color="#c9a34a"
        lineWidth={1}
      />
      {kind === 0 && (
        <group>
          <Box position={[0, 4, 0]} scale={[13, 8, 8]} color="#b5b3a7" />
          <Box position={[0, 9, -1]} scale={[8, 2, 6]} color="#8c989b" />
          {[1.6, 3.6, 5.6, 7.6].map((y) => (
            <group key={y}>
              <Box
                position={[0, y, 4.05]}
                scale={[12, 0.65, 0.08]}
                color="#344f5f"
              />
              <Box
                position={[6.55, y, 0]}
                scale={[0.08, 0.65, 7]}
                color="#344f5f"
              />
            </group>
          ))}
          <Box position={[0, 1, 4.5]} scale={[4, 2, 2]} color="#b79a66" />
          <Box position={[0, 2.1, 5]} scale={[5, 0.2, 3]} color="#d2c6aa" />
          {[-9, 9].map((x) =>
            [-7, 0, 7].map((z) => (
              <group key={`${x}-${z}`}>
                <Box
                  position={[x, 1, z]}
                  scale={[0.3, 2, 0.3]}
                  color="#74705b"
                />
                <mesh position={[x, 2.5, z]}>
                  <icosahedronGeometry args={[1.4, 0]} />
                  <meshStandardMaterial color="#63785f" />
                </mesh>
              </group>
            )),
          )}
        </group>
      )}
      {kind === 1 && (
        <group scale={0.43} position={[0, 1, 2]}>
          <Bridge compact />
        </group>
      )}
      {kind === 2 && (
        <group>
          {[-6, 3].map((x) =>
            [-5, 5].map((z) => (
              <group key={`${x}-${z}`}>
                <mesh position={[x, 1, z]}>
                  <cylinderGeometry args={[3.6, 3.6, 2, 32]} />
                  <meshStandardMaterial color="#a7acaa" />
                </mesh>
                <mesh position={[x, 2.05, z]} rotation={[-Math.PI / 2, 0, 0]}>
                  <circleGeometry args={[3.2, 32]} />
                  <meshStandardMaterial
                    color="#487f8a"
                    metalness={0.7}
                    roughness={0.2}
                  />
                </mesh>
                <Box
                  position={[x, 2.2, z]}
                  scale={[7, 0.1, 0.15]}
                  color={gold}
                />
              </group>
            )),
          )}
          <Box position={[9, 2, 0]} scale={[3, 4, 14]} color="#bab7a8" />
          <Box
            position={[9, 4.2, 0]}
            scale={[3.3, 0.4, 14.3]}
            color="#617478"
          />
        </group>
      )}
      {kind === 3 && (
        <group>
          <Box position={[-2, 3, 0]} scale={[15, 6, 12]} color="#b6b4a7" />
          <Box position={[-2, 6.2, 0]} scale={[16, 0.5, 13]} color="#6c846f" />
          {[-6, 1].map((x) => (
            <group key={x}>
              <mesh position={[x, 2, 8]}>
                <cylinderGeometry args={[2.5, 2.5, 4, 24]} />
                <meshStandardMaterial color="#85918a" metalness={0.3} />
              </mesh>
              <mesh position={[x, 4.5, 8]}>
                <coneGeometry args={[2.5, 1, 24]} />
                <meshStandardMaterial color="#7c8750" />
              </mesh>
            </group>
          ))}
          <Box position={[8, 6, -5]} scale={[1.3, 12, 1.3]} color="#b4aa94" />
          {[-5, 0, 5].map((z) => (
            <Box
              key={z}
              position={[-2, 6.5, z]}
              scale={[11, 0.12, 2]}
              color="#345267"
            />
          ))}
        </group>
      )}
    </group>
  );
}
export default function InfrastructureScene({
  variant = "hero",
  kind = 0,
}: {
  variant?: "hero" | "capability";
  kind?: number;
}) {
  const hero = variant === "hero";
  return (
    <Canvas
      aria-hidden="true"
      frameloop="demand"
      dpr={[1, 1.5]}
      camera={{
        position: hero ? [31, 13, 34] : [28, 21, 31],
        fov: hero ? 47 : 39,
        near: 0.1,
        far: 250,
      }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
    >
      <fog
        attach="fog"
        args={[hero ? "#253440" : "#0e2030", hero ? 30 : 75, hero ? 150 : 180]}
      />
      <ambientLight intensity={hero ? 1.1 : 1.8} color="#afbdce" />
      <directionalLight
        position={[-30, 22, -18]}
        intensity={3.3}
        color="#f7cc91"
      />
      <directionalLight
        position={[20, 12, 25]}
        intensity={0.8}
        color="#91abcb"
      />
      <CameraJourney hero={hero} />
      {hero ? (
        <group>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
            <planeGeometry args={[500, 500, 1, 1]} />
            <meshStandardMaterial
              color="#233b48"
              metalness={0.75}
              roughness={0.3}
            />
          </mesh>
          <Bridge />
          <City />
          <mesh position={[-40, 13, -110]}>
            <sphereGeometry args={[9, 32, 32]} />
            <meshBasicMaterial
              color="#dbc29a"
              fog={false}
              toneMapped={false}
              transparent
              opacity={0.45}
            />
          </mesh>
          {Array.from({ length: 30 }, (_, i) => (
            <Box
              key={i}
              position={[-40 + i * 2, -3.95, -30 - i * 2]}
              scale={[0.5 + (i % 3), 0.015, 25]}
              color={i % 2 ? "#344b54" : "#4c5b5d"}
            />
          ))}
        </group>
      ) : (
        <CapabilityModel kind={kind} />
      )}
    </Canvas>
  );
}
