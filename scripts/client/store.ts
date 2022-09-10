
import create from 'zustand'

const useStore = create<StoreType>(set => ({
  images: [],
  setImages: (images) => set(state => ({ images })),

  searchQuery: '',
  setSearchQuery: (query) => set(state => ({ searchQuery: query })),

  searchOrder: 'new',
  setSearchOrder: (order) => set(state => ({ searchOrder: order })),

  promptMenu: false,
  showPromptMenu: () => set(state => ({ promptMenu: true, spotlightOpen: true })),
  hidePromptMenu: () => set(state => ({ promptMenu: false, spotlightOpen: false })),

  imageSpotlightId: null,
  setImageSpotlightId: (id) => set(state => ({ imageSpotlightId: id, spotlightOpen: !!id })),

  currentUser: {
    username: "",
    image: "",
    id: "",
    bio: "",
    roles: "",
    teams: "",
    url: "",
    admin: false
  },
  setCurrentUser: (user) => set(state => ({ currentUser: user })),

  bookmarkMenu: false,
  showBookmarkMenu: () => set(state => ({ bookmarkMenu: true, spotlightOpen: true })),
  hideBookmarkMenu: () => set(state => ({ bookmarkMenu: false, spotlightOpen: false })),

  spotlightOpen: false,
  setSpotlightOpen: (open) => set(state => ({ spotlightOpen: open }))
}));

export default useStore;

interface singleIdType {
  id: number | string;
}

export interface imageInterface {
  comment_count: number;
  created_at: string;
  id: number;
  like_count: number;
  prompt: string;
  url: string;
  user_image: string;
  username: string;
}

export interface currentUserType {
  username: string;
  image: string;
  id: string;
  bio: string;
  roles: string;
  teams: string;
  url: string;
  admin: boolean;
}

export interface StoreType {
  images: imageInterface[],
  setImages: (images: imageInterface[]) => void,

  searchQuery: string,
  setSearchQuery: (query: string) =>  void,

  searchOrder: string,
  setSearchOrder: (order: string) =>  void,

  promptMenu: boolean,
  showPromptMenu: () =>  void,
  hidePromptMenu: () =>  void,

  imageSpotlightId: null | number,
  setImageSpotlightId: (id: number) => void,

  currentUser: currentUserType,
  setCurrentUser: (user: currentUserType) => void,

  bookmarkMenu: boolean,
  showBookmarkMenu: () => unknown,
  hideBookmarkMenu: () => unknown,

  spotlightOpen: boolean,
  setSpotlightOpen: (open: boolean) =>  void
}