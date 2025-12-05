import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultRooms } from "./mockData";

export type Avatar = {
  position: [number, number, number];
  name: string;
  relation: string;
};

export type User = {
  id: string;
  name: string;
};

export type Member = {
  userId: string;
  role: 'admin' | 'maintainer' | 'viewer';
};

export type Room = {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  theme: {
    wallColor: string;
    floorColor: string;
  };
  frames: Frame[];
  avatars: Avatar[];
  access: 'public' | 'private';
  members: Member[];
};

export type Frame = {
  rotation?: [number, number, number];
  img: string; // can be image URL, data URL, or video URL too
  // Optional hint for media, if not present we auto-detect by extension/scheme
  mediaType?: 'image' | 'video';
  position?: [number, number, number];
  scale?: [number, number, number];
  uuid: string;
  title?: string;
  date?: string;
  location?: string;
  description?: string;
  people?: string[];
  voiceNote?: string;
};

type Store = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  rooms: Room[];
  addRoom: (room: Room) => void;
  updateRoomMeta: (roomId: string, patch: Partial<Pick<Room, 'name' | 'description' | 'theme' | 'access'>>) => void;
  updateRoomMembers: (roomId: string, members: Member[]) => void;
  addMember: (roomId: string, member: Member) => void;
  removeMember: (roomId: string, userId: string) => void;
  addFrame: (roomId: string, frame: Frame) => void;
  updateFrame: (roomId: string, update: Partial<Frame> & { uuid: string }) => void;
  removeFrame: (roomId: string, uuid: string) => void;
  currentRoomId: string | null;
  setCurrentRoomId: (id: string | null) => void;
  selected?: string;
  setSelected: (uuid?: string) => void;
  mode?: "rotate" | "translate" | "scale";
  setMode: (mode: "rotate" | "translate" | "scale") => void;
  selectImage: (img?: string) => void;
  selectedImage?: string;
  sanitizeImages: () => void;
  // UI slice
  uiDockOpen: boolean;
  uiActivePanel: 'memories' | 'members' | 'messages' | 'profile' | 'decor' | 'permissions' | null;
  setActivePanel: (panel: Store['uiActivePanel']) => void;
  toggleDock: () => void;
  uiShowCustomize: boolean;
  setUiShowCustomize: (v: boolean) => void;
};

export const useStore = create(
  persist<Store>(
    (set) => ({
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      addRoom: (room) => set((state) => ({ rooms: [...state.rooms, room] })),
      updateRoomMeta: (roomId, patch) => set((state) => ({
        rooms: state.rooms.map(r => r.id === roomId ? { ...r, ...patch, theme: patch.theme ? { ...r.theme, ...patch.theme } : r.theme } : r)
      })),
      updateRoomMembers: (roomId, members) => set((state) => ({
        rooms: state.rooms.map(r => r.id === roomId ? { ...r, members } : r)
      })),
      addMember: (roomId, member) => set((state) => ({
        rooms: state.rooms.map(r => r.id === roomId ? { ...r, members: [...(r.members ?? []), member] } : r)
      })),
      removeMember: (roomId, userId) => set((state) => ({
        rooms: state.rooms.map(r => r.id === roomId ? { ...r, members: (r.members ?? []).filter(m => m.userId !== userId) } : r)
      })),
      addFrame: (roomId, frame) => set((state) => ({
        rooms: state.rooms.map(r => r.id === roomId ? { ...r, frames: [...r.frames, frame] } : r)
      })),
      updateFrame: (roomId, update) => set((state) => ({
        rooms: state.rooms.map(r => r.id === roomId ? {
          ...r,
          frames: r.frames.map(f => f.uuid === update.uuid ? { ...f, ...update } : f)
        } : r)
      })),
      removeFrame: (roomId, uuid) => set((state) => ({
        rooms: state.rooms.map(r => r.id === roomId ? {
          ...r,
          frames: r.frames.filter(f => f.uuid !== uuid)
        } : r)
      })),
      selected: undefined,
      setSelected: (uuid) => set({ selected: uuid }),
      mode: "translate",
      setMode: (mode) => set({ mode }),
      selectedImage: undefined,
      selectImage: (img) => set({ selectedImage: img }),
      sanitizeImages: () => set((state) => ({
        rooms: state.rooms.map((r) => ({
          ...r,
          frames: (r.frames ?? []).map((f) => ({
            ...f,
            img:
              typeof f.img === 'string' && f.img.toLowerCase().includes('placeholder.jpg')
                ? '1.jpg'
                : f.img,
          })),
        })),
      })),
      // UI slice defaults
      uiDockOpen: true,
      uiActivePanel: null,
      setActivePanel: (panel) => set({ uiActivePanel: panel }),
      toggleDock: () => set((s) => ({ uiDockOpen: !s.uiDockOpen })),
      uiShowCustomize: false,
      setUiShowCustomize: (v) => set({ uiShowCustomize: v }),
      rooms: defaultRooms,
      currentRoomId: null,
      setCurrentRoomId: (id) => set({ currentRoomId: id }),
    }),
    {
      name: "3d-art-galery",
      version: 1,
      migrate: (persisted: any, _version: number) => {
        if (!persisted) return persisted;
        if (Array.isArray(persisted.rooms)) {
          persisted.rooms = persisted.rooms.map((r: any) => ({
            ...r,
            frames: Array.isArray(r?.frames)
              ? r.frames.map((f: any) => ({
                  ...f,
                  img:
                    f?.img === 'placeholder.jpg' || f?.img === '/placeholder.jpg'
                      ? '1.jpg'
                      : f?.img,
                }))
              : r?.frames,
          }));
        }
        return persisted;
      },
    }
  )
);
