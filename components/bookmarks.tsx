import styles from '../styles/index.module.scss'
import { Flex, FlexGrow, Input, TextArea, Button } from './ui';
import { Get } from '../scripts/fetch'
import Post from '../scripts/client/handle'
import {
  Heart,
  Trash, X, Bookmark
} from 'react-feather'
import useStore from '../scripts/client/store'
import Image from 'next/image'
import { useState, useEffect } from 'react'
export default function Bookmarks({  }){
  const { setImageSpotlightId, hideBookmarkMenu } = useStore(s => s);
  const [bookmarks, setBookmarks] = useState([])
  useEffect(() => {
    Get("/api/bookmarks").then(data => {
      setBookmarks(data.map(x => x.image_id))
    });
  }, [])
  return (<div className={styles.bookmarks}>
    <div className={styles.bookmarkOverlay} onClick={hideBookmarkMenu}></div>
    <div className={styles.bookmarkBody}>
      <Flex>
        <h2>Saved Images</h2>
        <FlexGrow/>
        <Button onClick={hideBookmarkMenu}>Close</Button>
      </Flex>
      <div className={styles.bookmarkGrid}>
        {bookmarks.map(x => <div key={"img-saved-" + x.id} dataprompt={x.prompt} onClick={() => {setImageSpotlightId(x.id);hideBookmarkMenu();}}><img src={x.url} alt={x.prompt}/></div>)}
      </div>
    </div>
  </div>)
}