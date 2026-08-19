"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, Environment, ContactShadows, RoundedBox, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function Armchair({ position }) {
  return (
    <group position={position}>
      <RoundedBox args={[1.5, 0.7, 1.4]} radius={0.12} smoothness={4} position={[0, 0.35, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#3c2f24" roughness={0.7} metalness={0.05} />
      </RoundedBox>
      <RoundedBox args={[1.5, 1, 0.3]} radius={0.12} smoothness={4} position={[0, 0.9, -0.55]} castShadow receiveShadow>
        <meshStandardMaterial color="#3c2f24" roughness={0.7} metalness={0.05} />
      </RoundedBox>
      <RoundedBox args={[0.3, 0.7, 1.4]} radius={0.1} smoothness={4} position={[-0.75, 0.55, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#4a3a2b" roughness={0.7} />
      </RoundedBox>
      <RoundedBox args={[0.3, 0.7, 1.4]} radius={0.1} smoothness={4} position={[0.75, 0.55, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#4a3a2b" roughness={0.7} />
      </RoundedBox>
    </group>
  );
}

function CoffeeTable({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.55, 0.05, 48]} />
        <meshStandardMaterial color="#c9a45c" metalness={0.6} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.28, 12]} />
        <meshStandardMaterial color="#20180f" metalness={0.4} roughness={0.4} />
      </mesh>
    </group>
  );
}

function PendantLight({ position }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial
          color="#f5f0e8"
          emissive="#f4d9a0"
          emissiveIntensity={0.6}
          roughness={0.3}
        />
      </mesh>
      <pointLight color="#f4d9a0" intensity={4} distance={4} />
    </group>
  );
}

function GoldRing({ position, rotation, scale = 1 }) {
  return (
    <mesh position={position} rotation={rotation} scale={scale} castShadow>
      <torusGeometry args={[0.5, 0.03, 16, 64]} />
      <meshStandardMaterial color="#c9a45c" metalness={0.85} roughness={0.2} />
    </mesh>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.35, 0]} receiveShadow>
      <circleGeometry args={[6, 64]} />
      <meshStandardMaterial color="#211b16" roughness={0.9} />
    </mesh>
  );
}

// background depth layer — an implied window/light source beyond the room
function WindowGlow() {
  return (
    <group position={[0, 1.1, -3.4]}>
      <mesh>
        <planeGeometry args={[3.4, 2.6]} />
        <meshBasicMaterial color="#f4d9a0" transparent opacity={0.16} />
      </mesh>
      <pointLight color="#f4d9a0" intensity={1.4} distance={7} position={[0, 0, 0.6]} />
    </group>
  );
}

// foreground depth layer — a threshold the camera passes through while "entering"
function Doorway() {
  return (
    <group position={[0, 0.55, 3.7]}>
      <RoundedBox args={[0.28, 2.5, 0.28]} radius={0.05} position={[-1.7, 0, 0]}>
        <meshStandardMaterial color="#211b16" roughness={0.85} />
      </RoundedBox>
      <RoundedBox args={[0.28, 2.5, 0.28]} radius={0.05} position={[1.7, 0, 0]}>
        <meshStandardMaterial color="#211b16" roughness={0.85} />
      </RoundedBox>
      <mesh position={[-1.7, 1.28, 0]}>
        <boxGeometry args={[0.03, 0.03, 0.32]} />
        <meshStandardMaterial color="#c9a45c" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[1.7, 1.28, 0]}>
        <boxGeometry args={[0.03, 0.03, 0.32]} />
        <meshStandardMaterial color="#c9a45c" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

export default function RoomScene({ pointer, sceneProgress, lowPower = false }) {
  const group = useRef(null);
  const lookTarget = useRef(new THREE.Vector3(0, 0.35, 0));
  const { camera, scene } = useThree();

  const positionCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.6, 5.2),
        new THREE.Vector3(1.5, 0.85, 2.1),
        new THREE.Vector3(0, 1.15, 7.4),
      ]),
    []
  );

  const lookCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.35, 0),
        new THREE.Vector3(-0.4, 0.45, 0.1),
        new THREE.Vector3(0, 0.55, 0),
      ]),
    []
  );

  useEffect(() => {
    scene.fog = new THREE.Fog("#211b16", 4.5, 13);
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  useFrame(() => {
    if (!group.current) return;
    const targetX = pointer.current.x * 0.2;
    const targetY = pointer.current.y * 0.12;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetX, 0.04);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -targetY, 0.04);

    const progress = THREE.MathUtils.clamp(sceneProgress?.current?.value ?? 0, 0, 1);

    const targetScale = THREE.MathUtils.lerp(1, 0.94, progress);
    group.current.scale.setScalar(
      THREE.MathUtils.lerp(group.current.scale.x, targetScale, 0.08)
    );

    const targetPos = positionCurve.getPoint(progress);
    camera.position.lerp(targetPos, 0.06);

    const targetLook = lookCurve.getPoint(progress);
    lookTarget.current.lerp(targetLook, 0.06);
    camera.lookAt(lookTarget.current);
  });

  return (
    <>
      <group ref={group}>
        <ambientLight intensity={0.3} color="#f5f0e8" />
        <directionalLight
          position={[3, 5, 2]}
          intensity={1.1}
          color="#f4d9a0"
          castShadow={!lowPower}
          shadow-mapSize={lowPower ? [512, 512] : [1024, 1024]}
          shadow-camera-near={1}
          shadow-camera-far={10}
          shadow-camera-left={-3}
          shadow-camera-right={3}
          shadow-camera-top={3}
          shadow-camera-bottom={-3}
        />
        <spotLight
          position={[-4, 4, -2]}
          angle={0.4}
          penumbra={0.8}
          intensity={0.6}
          color="#c9a45c"
        />
        {/* fill light — soft, cool, opposite the key light for realistic bounce */}
        <pointLight position={[-2, 1.2, 2.5]} intensity={0.3} color="#cbd6d6" distance={6} />
        {/* rim light — warm edge highlight behind the seating cluster */}
        <pointLight position={[0.5, 1.4, -1.6]} intensity={0.9} color="#c9a45c" distance={5} />

        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.6}>
          <Armchair position={[-0.9, -0.35, 0.2]} />
        </Float>

        <Float speed={1.4} rotationIntensity={0.1} floatIntensity={0.5}>
          <CoffeeTable position={[0.9, -0.35, 0.4]} />
        </Float>

        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.8}>
          <PendantLight position={[0.6, 1.6, -0.6]} />
        </Float>

        <Float speed={0.8} rotationIntensity={0.3} floatIntensity={1}>
          <GoldRing position={[-1.8, 0.8, -1]} rotation={[0.4, 0.3, 0]} scale={1.1} />
        </Float>
        <Float speed={0.6} rotationIntensity={0.3} floatIntensity={1.2}>
          <GoldRing position={[1.8, -0.2, -1.4]} rotation={[1.1, 0.2, 0]} scale={0.7} />
        </Float>

        <Floor />
        <WindowGlow />
        <Doorway />

        <Sparkles
          count={lowPower ? 22 : 45}
          scale={[5, 2.4, 5]}
          position={[0, 0.8, 0]}
          size={1.6}
          speed={0.15}
          opacity={0.35}
          color="#f4d9a0"
        />

        <ContactShadows
          position={[0, -0.34, 0]}
          opacity={0.55}
          scale={8}
          blur={2.5}
          far={2}
          resolution={lowPower ? 256 : 512}
          frames={lowPower ? 1 : Infinity}
        />
        <Environment
          preset="apartment"
          environmentIntensity={0.5}
          resolution={lowPower ? 128 : 256}
        />
      </group>
    </>
  );
}
