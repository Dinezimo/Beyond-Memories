import { useMemo, useRef } from 'react';
import { Group } from 'three';
import { useFrame } from '@react-three/fiber';
import GroundedAvatar from './GroundedAvatar';

type RoomNPCsProps = {
  count?: number;
  center?: [number, number, number];
  size?: [number, number]; // [widthX, depthZ]
};

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function RoomNPCs({ count = 5, center = [2, 1.5, 2], size = [12, 12] }: RoomNPCsProps) {
  const [cx, cy, cz] = center;
  const [sx, sz] = size;

  const npcs = useMemo(() => {
    return new Array(count).fill(0).map(() => ({
      name: `User-${Math.floor(1000 + Math.random() * 9000)}`,
      relation: 'guest',
      x: rand(cx - sx/2 + 0.5, cx + sx/2 - 0.5),
      z: rand(cz - sz/2 + 0.5, cz + sz/2 - 0.5),
      dir: Math.random() * Math.PI * 2,
      speed: rand(0.6, 1.2),
    }));
  }, [count, cx, cz, sx, sz]);

  const refs = useRef<Group[]>([]);

  useFrame((_, delta) => {
    npcs.forEach((npc, idx) => {
      npc.x += Math.cos(npc.dir) * npc.speed * delta;
      npc.z += Math.sin(npc.dir) * npc.speed * delta;
      // bounce within room bounds
      const minX = cx - sx/2 + 0.5;
      const maxX = cx + sx/2 - 0.5;
      const minZ = cz - sz/2 + 0.5;
      const maxZ = cz + sz/2 - 0.5;
      if (npc.x < minX) { npc.x = minX; npc.dir = Math.PI - npc.dir; }
      if (npc.x > maxX) { npc.x = maxX; npc.dir = Math.PI - npc.dir; }
      if (npc.z < minZ) { npc.z = minZ; npc.dir = -npc.dir; }
      if (npc.z > maxZ) { npc.z = maxZ; npc.dir = -npc.dir; }
      const g = refs.current[idx];
      if (g) {
        g.position.set(npc.x, cy, npc.z);
        g.rotation.set(0, Math.atan2(Math.sin(npc.dir), Math.cos(npc.dir)), 0);
      }
    });
  });

  return (
    <group>
      {npcs.map((npc, idx) => (
        <group key={idx} ref={(el) => { if (el) refs.current[idx] = el; }}>
          <GroundedAvatar position={[npc.x, cy, npc.z]} name={npc.name} relation={npc.relation} fallbackY={cy} />
        </group>
      ))}
    </group>
  );
}
