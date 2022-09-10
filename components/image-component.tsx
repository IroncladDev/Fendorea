import styles from '../styles/index.module.scss'
import { FlexGrow } from './ui';
import Image from 'next/image';
import Post from '../scripts/client/handle'
import { Get } from '../scripts/fetch'
import {
  Heart, MessageSquare, Bookmark, Trash
} from 'react-feather'
import useStore from '../scripts/client/store'
import { useState } from 'react'
import Swal, { Positive } from '../scripts/client/modal'

export default function ImageComponent({ data }) {
  const store = useStore(s => s);

  const reloadImages = async () => {
    let imgs = await Get(`/api/images?order=${store.searchOrder}&search=${store.searchQuery}`);
    store.setImages(imgs);
  }
  
  const { 
    created_at,
    username,
    user_image,
    prompt,
    url, 
    id, 
    like_count, 
    comment_count,
    currentUserLikes,
    currentUserBookmark
  } = data;

  const [currentLikes, setCurrentLikes] = useState(data?.like_count)
  const [currentLiked, setCurrentLiked] = useState(data?.currentUserLikes?.length > 0)
  const [currentBookmark, setCurrentBookmark] = useState(data?.currentUserBookmark?.length > 0)

  const applyLike = () => {
    Post("/api/like", {
      image_id: id
    }).then(res => {
      if(res){
        if(res.remove) {
          setCurrentLikes(currentLikes - 1)
        }else {
          setCurrentLikes(currentLikes + 1)
        }
        setCurrentLiked(!currentLiked)
      }
    })
  }

  const applyBookmark = () => {
    Post("/api/bookmark", {
      image_id: id
    }).then(res => {
      if(res) setCurrentBookmark(!currentBookmark)
    })
  }

  const deleteImage = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you would like to delete this image? This action cannot be undone.",
      showCancelButton: true,
      preConfirm: () => {
        Post("/api/delete-image", {
          image_id: id
        }).then(res => {
          if(res){
            reloadImages();
            Positive.fire("Deleted")
          }
        })  
      }
    })
  }
  
  return (<div className={styles.imageComponent}>
    <div className={styles.imageHeaderStats}>
      <a href={"https://replit.com/@" + username} target="_blank" rel="noreferrer">
        <div className={styles.userStats}>
          <Image src={`/api/proxy?url=`+user_image} width="20" height="20"/>
          <div className={styles.userUsername}>{username}</div>
        </div>
      </a>

      <FlexGrow/>

      <div className={styles.socialStats}>
        <div className={styles.likeStatsCount} onClick={applyLike}>
          <Heart 
            color={currentLiked ? "var(--fg-default)" : "var(--fg-dimmer)"}
            size={15}
            fill={currentLiked ? "var(--fg-default)" : "none"}
          />
          <span>{currentLikes}</span>
        </div>
        <div className={styles.likeStatsCount} onClick={applyBookmark}>
          <Bookmark
            color={currentBookmark ? "var(--fg-default)" : "var(--fg-dimmer)"}
            size={15}
            fill={currentBookmark ? "var(--fg-default)" : "none"}
          />
        </div>
        {(store.currentUser.username === username || store.currentUser.admin) && <div className={styles.likeStatsCount} onClick={deleteImage}>
          <Trash
            color={"var(--negative-default)"}
            size={15}
          />
        </div>}
        <div className={styles.commentStatsCount}>
          <MessageSquare
            color="var(--fg-default)"
            size={15}
          />
          <span>{comment_count}</span>
        </div>
      </div>
      
    </div>

    <div className={styles.imageDisplayParent} dataprompt={prompt} onClick={() => store.setImageSpotlightId(id)}>
      <img 
        src={url} 
        alt={prompt} 
        className={styles.imageDisplay}
      />
    </div>
  </div>)
} 