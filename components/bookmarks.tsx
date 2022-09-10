import styles from '../styles/index.module.scss'
import { Flex, FlexGrow, Input, TextArea, Button } from './ui';
import { Get } from '../scripts/fetch'
import Post from '../scripts/client/handle'
import {
  Heart,
  Trash, X, Bookmark
} from 'react-feather'
import useStore, { StoreType } from '../scripts/client/store'
import Image from 'next/image'
import { useState, useEffect } from 'react'

import {
  UserElement,
  FloatButton,
  Backdrop,
  Overlay,
  ContentItem,
  TagSingle,
  TagMulti
} from './base-components';

interface imageInterface {
  comment_count: number;
  created_at: string;
  id: number;
  like_count: number;
  prompt: string;
  url: string;
  user_image: string;
  username: string;
}

interface bookmarkInterface {
  id: number;
  username: string;
  image_id: imageInterface;
}

export default function Bookmarks(){
  const { setImageSpotlightId, hideBookmarkMenu } = useStore((s) => s);
  const [bookmarks, setBookmarks] = useState([])
  useEffect(() => {
    Get("/api/bookmarks").then(data => {
      setBookmarks(data.map((x:bookmarkInterface) => x.image_id))
    });
  }, [])
  return (<div>
    <Backdrop onClick={hideBookmarkMenu}/>
    <Overlay>
      <Flex>
        <FloatButton>Saved Images</FloatButton>
        <FlexGrow/>
        <FloatButton onClick={hideBookmarkMenu}>
          <X size={20} color="var(--fg-default)"/>
        </FloatButton>
      </Flex>
      <ContentItem>
        <div className={styles.bookmarkGrid}>
          {bookmarks.map((x:imageInterface) => <div key={"img-saved-" + x.id} id={x.prompt} onClick={() => {setImageSpotlightId(x.id);hideBookmarkMenu();}}><img src={x.url} alt={x.prompt}/></div>)}
        </div>
      </ContentItem>
    </Overlay>
  </div>)
}