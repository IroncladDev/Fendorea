import styles from '../styles/index.module.scss'
import { FlexGrow } from './ui';
import Image from 'next/image';
import Post, { DataResponse } from '../scripts/client/handle'
import { Get } from '../scripts/fetch'
import {
  Heart, MessageSquare, Bookmark, Trash, UserX
} from 'react-feather'
import useStore from '../scripts/client/store'
import { useState } from 'react'
import Swal, { Positive } from '../scripts/client/modal'

import { UserElement, FloatButton } from './base-components'

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
  currentUserLikes: singleIdType[];
  currentUserBookmark: singleIdType[];
}

export default function ImageComponent({ data }: { data: imageInterface; }) {
  const store = useStore(s => s);

  const reloadImages = async (): Promise<void> => {
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

  const [currentLikes, setCurrentLikes] = useState(data.like_count)
  const [currentLiked, setCurrentLiked] = useState(data.currentUserLikes.length > 0)
  const [currentBookmark, setCurrentBookmark] = useState(data.currentUserBookmark.length > 0)

  const banUser = (username: string): void => {
    Swal.fire({
      title: "Ban " + username + "?",
      text: "Are you sure you would like to ban this user?  If so, type a reason for the ban.",
      showCancelButton: true,
      input: "text",
      inputPlaceholder: "reason",
      preConfirm: async (reason) => {
        let res = await Post("/api/ban-user", {
          username,
          reason
        });
        if(res){
          Positive.fire("User Banned")
        }
      }
    })
  }

  const applyLike = (): void => {
    Post("/api/like", {
      image_id: id
    }).then((res: DataResponse) => {
      if(typeof res === 'object'){
        if(res.remove) {
          setCurrentLikes(currentLikes - 1)
        }else {
          setCurrentLikes(currentLikes + 1)
        }
        setCurrentLiked(!currentLiked)
      }
    })
  }

  const applyBookmark = (): void => {
    Post("/api/bookmark", {
      image_id: id
    }).then((res: DataResponse) => {
      if(res) setCurrentBookmark(!currentBookmark)
    })
  }

  const deleteImage = (): void => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you would like to delete this image? This action cannot be undone.",
      showCancelButton: true,
      preConfirm: () => {
        Post("/api/delete-image", {
          image_id: id
        }).then((res: DataResponse) => {
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
      <UserElement username={username} image={user_image} />

      <FlexGrow/>

      <div className={styles.socialStats}>
        <FloatButton onClick={applyLike}>
          <Heart 
            color={currentLiked ? "var(--fg-default)" : "var(--fg-dimmer)"}
            size={15}
            fill={currentLiked ? "var(--fg-default)" : "none"}
          />
          <span>{currentLikes}</span>
        </FloatButton>
        
        <FloatButton onClick={applyBookmark}>
          <Bookmark
            color={currentBookmark ? "var(--fg-default)" : "var(--fg-dimmer)"}
            size={15}
            fill={currentBookmark ? "var(--fg-default)" : "none"}
          />
        </FloatButton>
        {(store.currentUser.admin) && <FloatButton onClick={() => banUser(username)}>
          <UserX
            color={"var(--negative-default)"}
            size={15}
          />
        </FloatButton>}
        {(store.currentUser.username === username || store.currentUser.admin) && <FloatButton onClick={deleteImage}>
          <Trash
            color={"var(--negative-default)"}
            size={15}
          />
        </FloatButton>}
        <FloatButton>
          <MessageSquare
            color="var(--fg-default)"
            size={15}
          />
          <span>{comment_count}</span>
        </FloatButton>
      </div>
      
    </div>

    <div className={styles.imageDisplayParent} id={prompt} onClick={() => store.setImageSpotlightId(id)}>
      <img 
        src={url} 
        alt={prompt} 
        className={styles.imageDisplay}
      />
    </div>
  </div>)
} 