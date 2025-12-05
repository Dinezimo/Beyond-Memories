import { KeyboardControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { Img, Room } from "../../components/scene";
import Alley from "../../components/scene/Alley";
import Ecctr, { EcctrlJoystick } from "ecctrl";
import { useStore } from "../../lib/store";
import { useState, Suspense, useEffect } from "react";
import { Frame } from "../../lib/store";
import Web3 from "../../components/ui/Web3";
import RoomSwitcher from "../../components/ui/RoomSwitcher";
import FeatureDock from "../../components/ui/FeatureDock";
import DockPanel from "../../components/ui/DockPanel";
import Header from "../../components/ui/Header";
import CurrentUser from "../../components/ui/CurrentUser";
import RoomInfoPanel from "../../components/ui/RoomInfoPanel";
import CustomizationPanel from "../../components/ui/CustomizationPanel";
import RoomCreator from "../../components/ui/RoomCreator";
import RoomNPCs from "../../components/scene/RoomNPCs";
import GroundedAvatar from "../../components/scene/GroundedAvatar";

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ["Shift"] },
  { name: "action1", keys: ["1"] },
  { name: "action2", keys: ["2"] },
  { name: "action3", keys: ["3"] },
  { name: "action4", keys: ["KeyF"] },
];

export function Main() {
  const store = useStore();
  useEffect(() => {
    // Ensure any persisted 'placeholder.jpg' references are replaced
    store.sanitizeImages?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const currentRoom = store.rooms.find((room) => room.id === store.currentRoomId);
  const inAlley = store.currentRoomId === null;
  const [selected, setSelected] = useState<Frame | undefined | null>(null);
  const [showCreator, setShowCreator] = useState(false);

  // Use a conservative, constant roam rectangle for the room so NPCs and avatars stay inside walls
  const roomNpcCenterAndSize = {
    center: [2, 4.5, 2] as [number, number, number],
    size: [10, 12] as [number, number],
  };

  const canCustomize =
    !inAlley &&
    !!store.currentUser &&
    (
      currentRoom?.ownerId === store.currentUser?.id ||
      currentRoom?.members?.some(
        (m) => m.userId === store.currentUser?.id && (m.role === 'admin' || m.role === 'maintainer')
      )
    );

  return (
    <div className="w-screen h-screen">
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          {selected && (
            <div className="flex flex-col md:flex-row items-start gap-4">
              {(selected.mediaType === 'video'
                || selected.img?.toLowerCase?.().match(/\.(mp4|webm|ogg)$/)
                || selected.img?.toLowerCase?.().startsWith('data:video')) ? (
                <video
                  src={selected.img}
                  controls
                  className="w-full md:w-1/2 h-auto object-contain rounded-lg shadow-lg"
                />
              ) : (
                <img
                  src={selected.img?.startsWith('/') ? selected.img : `/${selected.img}`}
                  alt={selected.title}
                  className="w-full md:w-1/2 h-auto object-contain rounded-lg shadow-lg"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/1.jpg'; }}
                />
              )}
              <div className="w-full md:w-1/2 p-4 bg-base-200 rounded-lg">
                <h3 className="text-2xl font-bold mb-2">{selected.title}</h3>
                <p className="text-sm text-gray-500 mb-1"><strong>Date:</strong> {selected.date}</p>
                <p className="text-sm text-gray-500 mb-4"><strong>Location:</strong> {selected.location}</p>
                <p className="mb-4">{selected.description}</p>
                <div className="mb-4">
                  <strong>People:</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selected.people?.map((person: string, index: number) => (
                      <span key={index} className="badge badge-primary">{person}</span>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <strong>Voice Note:</strong>
                  <audio controls src={selected.voiceNote} className="w-full mt-2">
                    Your browser does not support the audio element.
                  </audio>
                </div>
                <button className="btn btn-secondary w-full">Mint this memory as NFT</button>
              </div>
            </div>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <Canvas camera={{ position: [0, 2, 15], fov: 75 }} style={{ backgroundColor: inAlley ? 'rgb(51, 51, 51)' : currentRoom?.theme.wallColor }} className="w-full h-full">
        {currentRoom && (
          <>
            {/* Simulated crowd inside room */}
            <RoomNPCs count={6} center={roomNpcCenterAndSize.center} size={roomNpcCenterAndSize.size} />
            {currentRoom.frames.map((v: Frame) => (
              <mesh
                key={v.uuid}
                onClick={() => {
                  setSelected(v);
                  (document.getElementById("my_modal_2") as HTMLDialogElement)?.showModal();
                }}
                position={v.position}
                rotation={v.rotation}
                scale={v.scale}
              >
                <planeGeometry args={[4, 4]} />
                <Img src={v.img} mediaType={v.mediaType} />
              </mesh>
            ))}
            {currentRoom.avatars.map((avatar, index) => {
              const halfX = roomNpcCenterAndSize.size[0] / 2 - 0.5;
              const halfZ = roomNpcCenterAndSize.size[1] / 2 - 0.5;
              const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
              const x = clamp(avatar.position[0], roomNpcCenterAndSize.center[0] - halfX, roomNpcCenterAndSize.center[0] + halfX);
              const z = clamp(avatar.position[2], roomNpcCenterAndSize.center[2] - halfZ, roomNpcCenterAndSize.center[2] + halfZ);
              return (
                <GroundedAvatar
                  key={index}
                  position={[x, roomNpcCenterAndSize.center[1], z]}
                  name={avatar.name}
                  relation={avatar.relation}
                  fallbackY={roomNpcCenterAndSize.center[1]}
                />
              );
            })}
          </>
        )}
        <pointLight position={[0, 20, 10]} intensity={1.5} />
        <Physics>
          {currentRoom ? (
            <>
              <RigidBody type="fixed" colliders="trimesh">
                <Room />
              </RigidBody>
              <KeyboardControls map={keyboardMap}>
                <Ecctr
                  maxVelLimit={10}
                  camCollision={false}
                  camInitDis={-0.01}
                  camMinDis={-0.01}
                  camFollowMult={1000}
                  camLerpMult={1000}
                  turnVelMultiplier={1}
                  mode="CameraBasedMovement"
                >
                  <pointLight position={[0, 2, 0]} intensity={50} color="#fff" />
                </Ecctr>
              </KeyboardControls>
            </>
          ) : (
            <>
              <Suspense fallback={null}>
                <Alley />
              </Suspense>
              <KeyboardControls map={keyboardMap}>
                <Ecctr
                  maxVelLimit={8}
                  camCollision={false}
                  camInitDis={-0.01}
                  camMinDis={-0.01}
                  camFollowMult={1000}
                  camLerpMult={1000}
                  turnVelMultiplier={1}
                  position={[0, 1.1, 1.5]}
                  mode="CameraBasedMovement"
                >
                  <pointLight position={[0, 2, 0]} intensity={30} color="#fff" />
                </Ecctr>
              </KeyboardControls>
            </>
          )}
          <ambientLight />
        </Physics>
      </Canvas>

      <Web3 />
      <RoomSwitcher />
      <Header />
      <CurrentUser />
      {!inAlley && <RoomInfoPanel />}
      {store.currentUser && inAlley && (
        <div className="absolute bottom-20 left-4">
          <button className="btn btn-primary" onClick={() => setShowCreator(true)}>
            Create New Room
          </button>
        </div>
      )}
      <FeatureDock />
      <DockPanel />
      {store.uiShowCustomize && canCustomize && <CustomizationPanel />}
      {showCreator && <RoomCreator onClose={() => setShowCreator(false)} />}
      <div className="md:hidden">
        <EcctrlJoystick buttonNumber={0} />
      </div>
    </div>
  );
}
