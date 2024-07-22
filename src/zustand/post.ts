import { create } from 'zustand'

interface PostState {
  title: string
  content: string
  category: string
  userId: string
  createdAt: string
  images: string[]
  setTitle: (title: string) => void
  setContent: (content: string) => void
  setCategory: (category: string) => void
  setUserId: (userId: string) => void
  setCreatedAt: (createdAt: string) => void
  addImage: (image: string) => void
  removeImage: (index: number) => void
}

export const usePostStore = create<PostState>((set) => ({
  title: '',
  content: '',
  category: '',
  userId: '',
  createdAt: '',
  images: [],
  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),
  setCategory: (category) => set({ category }),
  setUserId: (userId) => set({ userId }),
  setCreatedAt: (createdAt) => set({ createdAt }),
  addImage: (image) => set((state) => ({ images: [...state.images, image] })),
  removeImage: (index) => set((state) => ({
    images: state.images.filter((_, i) => i !== index)
  }))
}))