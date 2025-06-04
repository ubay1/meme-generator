// @/stores/editor.ts
import { Dimensions } from 'react-native';
import { create } from 'zustand';

export type EditorItem = {
  id: string;
  type: 'text' | 'image';
  x: number;
  y: number;
  scale: number;
  rotation: number;
  width: number; // <<-- TAMBAHKAN INI
  height: number; // <<-- TAMBAHKAN INI
  // Properti spesifik teks
  text?: string;
  textColor?: string;
  // Properti spesifik gambar
  imageUrl?: string;
  imageWidth?: number; // Bisa dihapus jika width/height sudah ada
  imageHeight?: number; // Bisa dihapus jika width/height sudah ada
};

interface EditorState {
  items: EditorItem[];
  focusedItemId: string | null;
  nextId: number;
  addTextEditor: () => void;
  addImageEditor: () => void;
  deleteEditor: (id: string) => void;
  copyEditor: (id: string) => void;
  updateTextContent: (id: string, newText: string) => void;
  updateItemTransform: (id: string, newX: number, newY: number, newScale: number, newRotation: number) => void;
  updateItemSize: (id: string, newWidth: number, newHeight: number, newX: number, newY: number) => void; // <<-- AKSI BARU
  setFocusedItem: (id: string | null) => void;
  clearAllEditors: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  items: [],
  focusedItemId: null,
  nextId: 1,

  addTextEditor: () => {
    set((state) => {
      const newId = state.nextId.toString();
      const defaultWidth = 150; // Lebar default untuk teks
      const defaultHeight = 50;  // Tinggi default untuk teks
      const newTextItem: EditorItem = {
        id: newId,
        type: 'text',
        text: 'Ketuk untuk edit',
        x: (width / 2) - (defaultWidth / 2), // Posisikan di tengah awal kanvas
        y: (height / 2) - (defaultHeight / 2),
        textColor: 'black',
        scale: 1,
        rotation: 0,
        width: defaultWidth, // <<-- GUNAKAN INI
        height: defaultHeight, // <<-- GUNAKAN INI
      };
      return {
        items: [...state.items, newTextItem],
        nextId: state.nextId + 1,
        focusedItemId: newId,
      };
    });
  },

  addImageEditor: () => {
    set((state) => {
      const newId = state.nextId.toString();
      const defaultImageWidth = 200; // Lebar default untuk gambar
      const defaultImageHeight = 300; // Tinggi default untuk gambar
      const newImageItem: EditorItem = {
        id: newId,
        type: 'image',
        imageUrl: 'https://picsum.photos/200/300',
        x: (width / 2) - (defaultImageWidth / 2),
        y: (height / 2) - (defaultImageHeight / 2),
        width: defaultImageWidth, // <<-- GUNAKAN INI
        height: defaultImageHeight, // <<-- GUNAKAN INI
        scale: 1,
        rotation: 0,
      };
      return {
        items: [...state.items, newImageItem],
        nextId: state.nextId + 1,
        focusedItemId: newId,
      };
    });
  },

  deleteEditor: (idToDelete: string) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== idToDelete),
      focusedItemId: state.focusedItemId === idToDelete ? null : state.focusedItemId,
    }));
  },

  copyEditor: (idToCopy: string) => {
    set((state) => {
      const itemToCopy = state.items.find(item => item.id === idToCopy);
      if (!itemToCopy) return state;

      const newId = state.nextId.toString();
      const copiedItem: EditorItem = {
        ...itemToCopy,
        id: newId,
        x: itemToCopy.x + 20, // Sedikit geser dari yang asli
        y: itemToCopy.y + 20,
        text: itemToCopy.type === 'text' ? itemToCopy.text : undefined,
      };

      return {
        items: [...state.items, copiedItem],
        nextId: state.nextId + 1,
        focusedItemId: newId,
      };
    });
  },

  updateTextContent: (idToUpdate: string, newText: string) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === idToUpdate && item.type === 'text' ? { ...item, text: newText } : item
      ),
    }));
  },

  updateItemTransform: (idToUpdate: string, newX: number, newY: number, newScale: number, newRotation: number) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === idToUpdate ? { ...item, x: newX, y: newY, scale: newScale, rotation: newRotation } : item
      ),
    }));
  },

  // Implementasi aksi baru updateItemSize
  updateItemSize: (idToUpdate: string, newWidth: number, newHeight: number, newX: number, newY: number) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === idToUpdate ? { ...item, width: newWidth, height: newHeight, x: newX, y: newY } : item
      ),
    }));
  },

  setFocusedItem: (id: string | null) => {
    set({ focusedItemId: id });
  },

  clearAllEditors: () => {
    set({
      items: [],
      focusedItemId: null,
      nextId: 1,
    });
  },
}));

const { width, height } = Dimensions.get("window");