import { useMemo, useRef } from 'react';
import { Group } from 'three';
import { useFrame } from '@react-three/fiber';
import GroundedAvatar from './GroundedAvatar';

type AlleyNPCsProps = {
  count?: number;
  corridorLength: number; // total corridor length used in Alley
};

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function AlleyNPCs({ count = 6, corridorLength }: AlleyNPCsProps) {
  const npcs = useMemo(() => {
    return new Array(count).fill(0).map(() => ({
      name: `Guest-${Math.floor(1000 + Math.random() * 9000)}`,
      relation: 'visitor',
      x: Math.random() < 0.5 ? -1.6 : 1.6,
      z: rand(3 - corridorLength + 1, 2),
      dir: Math.random() < 0.5 ? 1 : -1, // 1: forward (+z), -1: backward (-z)
      speed: rand(0.8, 1.6),
      rotY: 0,
    }));
  }, [count, corridorLength]);

  const refs = useRef<Group[]>([]);

  useFrame((_, delta) => {
    const minZ = 3 - corridorLength + 0.5;
    const maxZ = 3 - 0.5;
    npcs.forEach((npc, idx) => {
      npc.z += npc.dir * npc.speed * delta;
      // bounce at ends
      if (npc.z < minZ) {
        npc.z = minZ; npc.dir = 1;
      } else if (npc.z > maxZ) {
        npc.z = maxZ; npc.dir = -1;
      }
      npc.rotY = npc.dir > 0 ? Math.PI : 0;
      const g = refs.current[idx];
      if (g) {
        g.position.set(npc.x, 0, npc.z);
        g.rotation.set(0, npc.rotY, 0);
      }
    });
  });

  return (
    <group>
      {npcs.map((npc, idx) => (
        <group key={idx} ref={(el) => { if (el) refs.current[idx] = el; }}>
          <GroundedAvatar position={[npc.x, 0, npc.z]} name={npc.name} relation={npc.relation} fallbackY={0} />
        </group>
      ))}
    </group>
  );
}
