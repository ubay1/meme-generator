// @/stores/editor.ts
import { SkColor, Skia } from '@shopify/react-native-skia';
import { create } from 'zustand';

export type TextStyles = {
  color: SkColor;
  colorRaw?: string;
  font?: string[];
  fontSize?: number;
}
export type ImageStyles = {
  opacity?: number;
  borderRadius?: number;
}
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
  styles?: TextStyles;
  // Properti spesifik gambar
  imageUrl?: string;
  imageWidth?: number; // Bisa dihapus jika width/height sudah ada
  imageHeight?: number; // Bisa dihapus jika width/height sudah ada
  imageStyles?: ImageStyles
};

interface EditorState {
  items: EditorItem[];
  focusedItemId: string | null;
  nextId: number;
  addTextEditor: (x: number, y: number) => void;
  addImageEditor: (x: number, y: number, img: string) => void;
  deleteEditor: (id: string) => void;
  copyEditor: (id: string) => void;
  updateTextContent: (id: string, newText: string) => void;
  updateTextStyle: (id: string, data: TextStyles) => void;
  updateImageStyle: (id: string, data: ImageStyles) => void;
  updateItemTransform: (id: string, newX: number, newY: number, newScale: number, newRotation: number) => void;
  updateItemSize: (id: string, newWidth: number, newHeight: number, newX: number, newY: number) => void;
  resetItemToCenter: (x: number, y: number) => void;
  setFocusedItem: (id: string | null) => void;
  clearAllEditors: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  items: [],
  focusedItemId: null,
  nextId: 1,

  addTextEditor: (x: number, y: number) => {
    set((state) => {
      const newId = state.nextId.toString();
      const defaultWidth = 150; // Lebar default untuk teks
      const defaultHeight = 50;  // Tinggi default untuk teks
      const newTextItem: EditorItem = {
        id: newId,
        type: 'text',
        text: 'Ketuk untuk edit',
        x: x, // Posisikan di tengah awal kanvas
        y: y,
        textColor: 'black',
        scale: 1,
        rotation: 0,
        width: defaultWidth,
        height: defaultHeight,
        styles: {
          color: Skia.Color('black'),
          colorRaw: 'black', // Tambahkan ini untuk warna asli Skia, jika ada
          font: ['SpaceMono'],
          fontSize: 14,
        }
      };
      return {
        items: [...state.items, newTextItem],
        nextId: state.nextId + 1,
        focusedItemId: newId,
      };
    });
  },

  updateTextStyle: (id: string, data: TextStyles) => {
    set((state) => {
      const focusedItem = state.items.find(item => item.id === id);
      if (!focusedItem) return state;

      const updatedItems = state.items.map(item =>
        item.id === id ? { ...item, styles: data } : item
      );

      return {
        ...state,
        items: updatedItems
      };
    })
  },

  addImageEditor: (x: number, y: number, img: string) => {
    set((state) => {
      const newId = state.nextId.toString();
      const defaultImageWidth = 200; // Lebar default untuk gambar
      const defaultImageHeight = 300; // Tinggi default untuk gambar
      const newImageItem: EditorItem = {
        id: newId,
        type: 'image',
        imageUrl: img || 'https://picsum.photos/200/200?random=1',
        x: x,
        y: y,
        scale: 1,
        rotation: 0,
        width: defaultImageWidth,
        height: defaultImageHeight,
        imageStyles: {
          opacity: 1,
          borderRadius: 0,
        }
      };
      return {
        items: [...state.items, newImageItem],
        nextId: state.nextId + 1,
        focusedItemId: newId,
      };
    });
  },
  updateImageStyle: (id: string, data: ImageStyles) => {
    set((state) => {
      const focusedItem = state.items.find(item => item.id === id);
      if (!focusedItem) return state;

      const updatedItems = state.items.map(item =>
        item.id === id ? { ...item, imageStyles: data } : item
      );

      return {
        ...state,
        items: updatedItems
      };
    })
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

  resetItemToCenter: (x: number, y: number) => {
    set((state) => {
      const updatedItems = state.items.map(item => ({
        ...item,
        x: x,
        y: y,
      }));
      return {
        ...state,
        items: updatedItems
      };
    })
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

// const { width, height } = Dimensions.get("window");