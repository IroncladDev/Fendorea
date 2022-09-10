
import create from 'zustand'

const useStore = create(set => ({
  images: [],
  setImages: (images) => set(state => ({ images })),

  searchQuery: '',
  setSearchQuery: (query) => set(state => ({ searchQuery: query })),

  searchOrder: 'new',
  setSearchOrder: (order) => set(state => ({ searchOrder: order })),

  promptMenu: false,
  showPromptMenu: () => set(state => ({ promptMenu: true })),
  hidePromptMenu: () => set(state => ({ promptMenu: false })),

  imageSpotlightId: null,
  setImageSpotlightId: (id) => set(state => ({ imageSpotlightId: id })),

  currentUser: false,
  setCurrentUser: (user) => set(state => ({ currentUser: user })),

  bookmarkMenu: false,
  showBookmarkMenu: () => set(state => ({ bookmarkMenu: true })),
  hideBookmarkMenu: () => set(state => ({ bookmarkMenu: false })),

  spotlightOpen: false,
  setSpotlightOpen: (open) => set(state => ({ spotlightOpen: open }))
}));

export default useStore;