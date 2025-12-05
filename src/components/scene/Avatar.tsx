import React, { useEffect, useMemo, useRef } from 'react';
import { Text, Billboard, useGLTF, useAnimations } from '@react-three/drei';
import { Box3, Group } from 'three';
import { SkeletonUtils } from 'three-stdlib';

interface AvatarProps {
  position: [number, number, number];
  name: string;
  relation: string;
}

const GLB_URL =
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMan/glTF-Binary/CesiumMan.glb';

const Avatar: React.FC<AvatarProps> = ({ position, name, relation }) => {
  const group = useRef<Group>(null);
  const gltf = useGLTF(GLB_URL) as any;
  const model = useMemo(() => SkeletonUtils.clone(gltf.scene) as Group, [gltf.scene]);
  const { actions } = useAnimations(gltf.animations, group);

  useEffect(() => {
    // Use a stable wrapper scale to avoid bbox/skinned-mesh pitfalls
    const SCALE = 0.01;
    if (group.current) group.current.scale.setScalar(SCALE);
    // Ground the model so its feet are at the group's origin
    const bbox = new Box3().setFromObject(model);
    model.position.y -= bbox.min.y;
    // Play any available idle animation
    Object.values(actions ?? {}).forEach((a) => a?.reset()?.play());
  }, [actions, model]);

  const handleClick = () => {
    alert(`Name: ${name}\nRelation: ${relation}`);
  };

  return (
    <group position={[position[0], position[1], position[2]]} onClick={handleClick} ref={group}>
      <primitive object={model} />
      {/* Name label (above the avatar) */}
      <Billboard position={[0, 1.8, 0]} follow={true}>
        <Text
          fontSize={0.26}
          color="#222"
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.04}
          outlineColor="#ffffff"
        >
          {name}
        </Text>
      </Billboard>
    </group>
  );
};

useGLTF.preload(GLB_URL);

export default Avatar;
