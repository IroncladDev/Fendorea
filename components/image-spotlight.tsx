import styles from '../styles/index.module.scss'
import { FlexGrow, Input, TextArea, Button } from './ui';
import { Get } from '../scripts/fetch'
import Post from '../scripts/client/handle'
import {
  Heart,
  Trash, X, Bookmark, UserX
} from 'react-feather'
import useStore from '../scripts/client/store'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import Swal, { Positive } from '../scripts/client/modal'

function HeaderComponent({ data, id, applyLike, applyBookmark }){
  const { setImageSpotlightId } = useStore(s => s)
  return (<div className={styles.headerStats}>
        <a href={"https://replit.com/@" + data.username} target="_blank" rel="noreferrer">
          <div className={styles.userStats}>
            <Image src={`/api/proxy?url=`+data.user_image} width="20" height="20"/>
            <div className={styles.userUsername}>{data.username}</div>
          </div>
        </a>

        <FlexGrow/>

        <div className={styles.socialStats}>
          <div className={styles.likeStatsCount} onClick={applyLike}>
            <Heart 
              color={data?.currentUserLikes?.length>0 ? "var(--fg-default)" : "var(--fg-dimmer)"}
              size={15}
              fill={data?.currentUserLikes?.length>0 ? "var(--fg-default)" : "none"}
            />
            <span>{data.like_count}</span>
          </div>
        </div>

        <div className={styles.socialStats} style={{marginLeft: 10}}>
          <div className={styles.likeStatsCount} onClick={applyBookmark}>
            <Bookmark 
              color={data?.currentUserBookmark?.length>0 ? "var(--fg-default)" : "var(--fg-dimmer)"}
              size={15}
              fill={data?.currentUserBookmark?.length>0 ? "var(--fg-default)" : "none"}
            />
          </div>
        </div>

        <div className={styles.socialStats} style={{marginLeft: 10}}>
          <div className={styles.likeStatsCount} onClick={() => setImageSpotlightId(null)}>
            <X 
              color={"var(--fg-dimmer)"}
              size={15}
            />
          </div>
        </div>
        
      </div>)
}

function CommentForm({ id, data, setData }){
  const [com, setCom] = useState('');
  const submitComment = async () => {
    let res = await Post("/api/comment", {
      body: com,
      image_id: id
    });
    if(res) {
      setData({
        ...data,
        comments: [...data.comments, res.data[0]]
      })
      setCom("");
    }
  };
  return (<div className={styles.commentForm}>
    <TextArea value={com} onChange={e => setCom(e.target.value)} placeholder="Write a comment..."/>
    <div>
      <Button onClick={submitComment}>Submit</Button>  
    </div>
  </div>)
}

function Comment({ data }){
  const { currentUser } = useStore(s => s);
  const [vis, setVis] = useState(true);

  const deleteComment = (): (void | undefined) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you would like to delete your comment?  This cannot be undone.",
      showCancelButton: true,
      preConfirm: async () => {
        let res = await Post("/api/delete-comment", {
          comment_id: data.id
        });
        if(res){
          setVis(false)
        }
      }
    })
  }

  const banUser = (username) => {
    Swal.fire({
      title: "Ban User?",
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
  
  return vis && (<div className={styles.comment}>
    <div className={styles.commentHead}>
      <a href={`https://replit.com/@` + data.username}><div className={styles.commentUserBadge}>
        <Image src={"/api/proxy?url=" + data.user_image} width="20px" height="20px"/>
        <div className={styles.commentUsername}>{data.username}</div>
      </div></a>
      <FlexGrow/>
      {currentUser.admin && <button className={styles.deleteCommentButton} onClick={() => banUser(data.username)}>
        <UserX color="var(--fg-default)" width={15} height={15}/>
      </button>}
      {(currentUser.username === data.username || currentUser.admin) && <button className={styles.deleteCommentButton} onClick={deleteComment}>
        <Trash color="var(--fg-default)" width={15} height={15}/>
      </button>}
    </div>
    <div>
      <div className={styles.commentBody}>{data.body}</div>
    </div>
  </div>)
}

export default function ImageSpotlight({ id }) {
  const { setImageSpotlightId, currentUser } = useStore(s => s);
  const [data, setData] = useState({})

  const applyLike = async () => {
    let res = await Post("/api/like", {
      image_id: id
    })
    if(res){
      if(res.remove) {
        setData({...data, like_count: data.like_count - 1, currentUserLikes: false})
      }else {
        setData({...data, like_count: data.like_count + 1, currentUserLikes: [true]})
      }
    }
  }

  const applyBookmark = async () => {
    let res = await Post("/api/bookmark", {
      image_id: id
    })
    if(res) {
      if(res.remove) {
        setData({...data, currentUserBookmark: []})
      }else {
        setData({...data, currentUserBookmark: [true]})
      }
    }
  }

  useEffect(() => {
    Get("/api/image?id=" + id).then(setData);
  }, [])
  
  return (<div className={styles.imageSpotlight}>
    <div className={styles.imageSpotlightBackdrop} onClick={() => setImageSpotlightId(null)}></div>
    
    
      <div className={styles.imageSpotlightModal}>
        <HeaderComponent applyBookmark={applyBookmark} data={data} id={id} applyLike={applyLike}/>
  
        <img className={styles.spotlightImage} alt={data.prompt} src={data.url}/>

        <div className={styles.promptText}>{"“"}{data.prompt}{"“"}</div>
  
        <div className={styles.commentBound}>
          {currentUser && <CommentForm id={id} data={data} setData={setData}/>}
          <div className={styles.comments}>
            {data?.comments?.slice().reverse().map(c => <Comment data={c} key={"comment-item-"+c.id}/>)}
          </div>
        </div>
      </div>
  </div>)
}