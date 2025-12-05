import { Text, RoundedBox, MeshReflectorMaterial } from '@react-three/drei';
import { useStore } from '../../lib/store';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { Group, DoubleSide } from 'three';
import AlleyNPCs from './AlleyNPCs';

const Alley = () => {
  const { rooms, setCurrentRoomId } = useStore();
  const doorSpacing = 6;
  const corridorLength = Math.max(rooms.length * doorSpacing + 6, 24);
  const half = corridorLength / 2;

  return (
    <group>
      {/* Floor (warm reflective surface) */}
      <mesh position={[0, 0, -half + 3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, corridorLength]} />
        <MeshReflectorMaterial
          blur={[300, 80]}
          mixBlur={1}
          mixStrength={4}
          mirror={0.2}
          roughness={0.5}
          metalness={0.1}
          color="#d9c7b3" // light oak / warm beige
        />
      </mesh>

      {/* Ceiling (double-sided so it's visible from below) */}
      <mesh position={[0, 4, -half + 3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, corridorLength]} />
        <meshStandardMaterial color="#f6f4ef" side={DoubleSide} />
      </mesh>

      {/* Walls */}
      <mesh position={[-4, 2, -half + 3]} receiveShadow>
        <boxGeometry args={[0.2, 4, corridorLength]} />
        <meshStandardMaterial color="#f2efe9" />
      </mesh>
      <mesh position={[4, 2, -half + 3]} receiveShadow>
        <boxGeometry args={[0.2, 4, corridorLength]} />
        <meshStandardMaterial color="#f2efe9" />
      </mesh>

      {/* Baseboards */}
      <mesh position={[-3.9, 0.2, -half + 3]}>
        <boxGeometry args={[0.05, 0.4, corridorLength]} />
        <meshStandardMaterial color="#d6d3ce" />
      </mesh>
      <mesh position={[3.9, 0.2, -half + 3]}>
        <boxGeometry args={[0.05, 0.4, corridorLength]} />
        <meshStandardMaterial color="#d6d3ce" />
      </mesh>

      {/* Visible end walls */}
      <mesh position={[0, 2, 3]}>
        <boxGeometry args={[8, 4, 0.2]} />
        <meshStandardMaterial color="#f2efe9" />
      </mesh>
      <mesh position={[0, 2, 3 - corridorLength]}>
        <boxGeometry args={[8, 4, 0.2]} />
        <meshStandardMaterial color="#f2efe9" />
      </mesh>

      {/* Physics colliders: floor + walls + end caps */}
      <RigidBody type="fixed" colliders={false}>
        {/* Floor collider (no rotation) */}
        <CuboidCollider args={[4, 0.1, corridorLength / 2]} position={[0, 0, -half + 3]} />
        {/* Walls */}
        <CuboidCollider args={[0.1, 2, corridorLength / 2]} position={[-4, 2, -half + 3]} />
        <CuboidCollider args={[0.1, 2, corridorLength / 2]} position={[4, 2, -half + 3]} />
        {/* End barriers */}
        <CuboidCollider args={[4, 2, 0.1]} position={[0, 1, 3 - corridorLength]} />
        <CuboidCollider args={[4, 2, 0.1]} position={[0, 1, 3]} />
      </RigidBody>

      {/* Ambient and sconce lighting */}
      <ambientLight intensity={0.6} />
      {Array.from({ length: Math.ceil(corridorLength / doorSpacing) + 1 }).map((_, i) => (
        <spotLight
          key={`sconce-${i}`}
          position={[0, 3.5, -i * doorSpacing]}
          angle={0.6}
          penumbra={0.6}
          intensity={0.5}
          color="#ffd9b3"
          distance={12}
        />
      ))}

      {/* Doors */}
      {rooms.map((room, index) => {
        const leftSide = index % 2 === 0;
        const x = leftSide ? -3.9 : 3.9;
        const rotY = leftSide ? Math.PI / 2 : -Math.PI / 2; // face into corridor
        const z = -index * doorSpacing;
        return (
          <Door
            key={room.id}
            position={[x, 0, z]}
            rotation={[0, rotY, 0]}
            label={room.name}
            onEnter={() => setCurrentRoomId(room.id)}
            leftSide={leftSide}
          />
        );
      })}
      {/* Crowd simulation in corridor */}
      <AlleyNPCs corridorLength={corridorLength} />
    </group>
  );
};

type DoorProps = {
  position: [number, number, number];
  rotation: [number, number, number];
  label: string;
  onEnter: () => void;
  leftSide: boolean;
};

function Door({ position, rotation, label, onEnter, leftSide }: DoorProps) {
  const leafRef = useRef<Group>(null);
  const [opening, setOpening] = useState(false);
  const [t, setT] = useState(0);

  useFrame((_state, delta) => {
    if (!opening) return;
    const nt = Math.min(1, t + delta * 2.5);
    setT(nt);
    const angle = -Math.PI / 2 * (1 - Math.pow(1 - nt, 3)); // easeOutCubic
    if (leafRef.current) {
      // rotate around leaf center (simple), good enough for feedback
      leafRef.current.rotation.y = angle;
    }
    if (nt >= 1) {
      onEnter();
    }
  });

  return (
    <group position={position} rotation={rotation} onClick={() => !opening && setOpening(true)}>
      {/* Door frame */}
      <RoundedBox args={[2.3, 3.6, 0.08]} radius={0.05} position={[0, 1.8, 0]}>
        <meshStandardMaterial color="#5d4037" roughness={0.7} />
      </RoundedBox>
      {/* Door leaf */}
      <group ref={leafRef} position={[0, 0, 0]}>
        <RoundedBox args={[2, 3.2, 0.06]} radius={0.04} position={[0, 1.6, 0.02]}>
          <meshStandardMaterial color="#b08968" roughness={0.6} metalness={0.05} />
        </RoundedBox>
        {/* Handle */}
        <mesh position={[leftSide ? 0.7 : -0.7, 1.5, 0.08]}>
          <cylinderGeometry args={[0.03, 0.03, 0.18, 16]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.3} />
        </mesh>
      </group>
      {/* Label */}
      <Text position={[0, 3.5, 0.15]} fontSize={0.4} color="#3a2d28" anchorX="center" anchorY="bottom">
        {label}
      </Text>
      {/* Decorative console and plant */}
      <group position={[leftSide ? 0.9 : -0.9, 0, 0.5]}>
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[1.2, 0.1, 0.35]} />
          <meshStandardMaterial color="#d1c4b2" />
        </mesh>
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[1.2, 0.6, 0.3]} />
          <meshStandardMaterial color="#e9e3db" />
        </mesh>
        <mesh position={[0.45, 0.95, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.25, 20]} />
          <meshStandardMaterial color="#9e9e9e" />
        </mesh>
        <mesh position={[0.45, 1.2, 0]} castShadow>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#3aaf58" />
        </mesh>
      </group>
    </group>
  );
}

export default Alley;
