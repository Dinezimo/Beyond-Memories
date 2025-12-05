import Avatar from './Avatar';

interface GroundedAvatarProps {
  position: [number, number, number];
  name: string;
  relation: string;
  fallbackY?: number;
}

export default function GroundedAvatar({ position, name, relation, fallbackY = 0 }: GroundedAvatarProps) {
  // Keep avatars at a known floor height for stability
  const [x, _y, z] = position;
  return <Avatar position={[x, fallbackY, z]} name={name} relation={relation} />;
}
