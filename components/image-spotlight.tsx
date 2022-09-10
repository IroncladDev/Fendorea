import styles from '../styles/index.module.scss'
import { FlexGrow, Input, TextArea, Button, Flex } from './ui';
import { Get } from '../scripts/fetch'
import Post, { DataResponse } from '../scripts/client/handle'
import {
  Heart,
  Trash, X, Bookmark, UserX, Link
} from 'react-feather'
import useStore, { currentUserType } from '../scripts/client/store'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import Swal, { Positive } from '../scripts/client/modal'

import {
  UserElement,
  FloatButton,
  Backdrop,
  Overlay,
  ContentItem,
  TagSingle,
  TagMulti
} from './base-components';

interface HeaderComponentInterface {
  id: number;
  data: imageInterface;
  applyLike: () => void;
  applyBookmark: () => void;
  banUser: (username: string) => void;
  currentUser: currentUserType; 
  deleteImage: () => void;
}

interface singleIdType {
  id: number | string;
}

interface imageInterface {
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
  comments: commentInterface[];
}

interface commentInterface {
  id: number;
  created_at: string;
  image_id: number;
  username: string;
  body: string;
  user_image: string;
}

function HeaderComponent(
  { 
    data, 
    id, 
    applyLike, 
    applyBookmark,
    banUser, 
    currentUser, 
    deleteImage 
  }: HeaderComponentInterface
){
  const { setImageSpotlightId } = useStore(s => s)

  const copyLink = async () => {
    await navigator.clipboard.writeText(data.url)
    Positive.fire("Copied!")
  }
  
  return (<Flex style={{gap: 10}}>
    <UserElement username={data.username} image={data.user_image}/>
  
    <FlexGrow/>
  
    <FloatButton onClick={applyLike}>
      <Heart 
        color={data?.currentUserLikes?.length>0 ? "var(--fg-default)" : "var(--fg-dimmer)"}
        size={15}
        fill={data?.currentUserLikes?.length>0 ? "var(--fg-default)" : "none"}
      />
      <span>{data.like_count}</span>
    </FloatButton>

    <FloatButton onClick={applyBookmark}>
      <Bookmark 
        color={data?.currentUserBookmark?.length>0 ? "var(--fg-default)" : "var(--fg-dimmer)"}
        size={15}
        fill={data?.currentUserBookmark?.length>0 ? "var(--fg-default)" : "none"}
      />
    </FloatButton>

    <FloatButton onClick={copyLink}>
      <Link 
        color={"var(--fg-default)"}
        size={15}
      />
    </FloatButton>

    {currentUser.admin && <FloatButton onClick={() => banUser(data.username)}>
        <UserX color="var(--negative-stronger)" width={15} height={15}/>
      </FloatButton>}

    {(currentUser.admin || currentUser.username === data.username) && <FloatButton onClick={deleteImage}>
        <Trash color="var(--negative-stronger)" width={15} height={15}/>
      </FloatButton>}

    <FloatButton onClick={() => setImageSpotlightId(null)}>
      <X color={"var(--fg-dimmer)"} size={15}/>
    </FloatButton>
  </Flex>)
}

function ImageComponent({ prompt, url }: { prompt: string; url: string; }) {
  return (<div>
    <img className={styles.spotlightImage} alt={prompt} src={url}/>
  </div>)
}

function CommentForm({ id, data, setData }: { id: number; data: imageInterface; setData: (u: imageInterface) => void }){
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
    <TextArea value={com} onChange={(e:React.ChangeEvent<HTMLInputElement>) => setCom(e.target.value)} placeholder="Write a comment..."/>
    <div>
      <Button onClick={submitComment}>Submit</Button>  
    </div>
  </div>)
}

function Comment({ data, banUser }: { data: commentInterface; banUser: (u: string) => void }){
  const { currentUser } = useStore(s => s);
  const [vis, setVis] = useState(true);

  const deleteComment = (): (void | undefined) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you would like to delete your comment?  This cannot be undone.",
      showCancelButton: true,
      preConfirm: async () => {
        let res: DataResponse = await Post("/api/delete-comment", {
          comment_id: data.id
        });
        if(res){
          setVis(false)
        }
      }
    })
  }
  
  return vis ? (<div className={styles.comment}>
    <div className={styles.commentHead}>
      <UserElement username={data.username} image={data.user_image}/>
    
      <FlexGrow/>
      {currentUser.admin && <FloatButton onClick={() => banUser(data.username)}>
        <UserX color="var(--negative-stronger)" width={15} height={15}/>
      </FloatButton>}
      {(currentUser.username === data.username || currentUser.admin) && <FloatButton onClick={deleteComment}>
        <Trash color="var(--negative-stronger)" width={15} height={15}/>
      </FloatButton>}
    </div>
    <div>
      <div className={styles.commentBody}>{data.body}</div>
    </div>
  </div>) : <div></div>
}

export default function ImageSpotlight({ id }: { id: number }) {
  const { setImageSpotlightId, currentUser, setImages } = useStore(s => s);
  const [data, setData] = useState<imageInterface>({
    comment_count: 0,
    created_at: "",
    id: 0,
    like_count: 0,
    prompt: "",
    url: "",
    user_image: "",
    username: "",
    currentUserLikes: [],
    currentUserBookmark: [],
    comments: []
  })

  const banUser = (username: string) => {
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

  const deleteImage = () => {
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

  const applyLike = async () => {
    let res: DataResponse = await Post("/api/like", {
      image_id: id
    })
    if(res){
      if(res.remove) {
        setData({...data, like_count: data.like_count - 1, currentUserLikes: []})
      }else {
        setData({...data, like_count: data.like_count + 1, currentUserLikes: [{id: 1}]})
      }
    }
  }

  const applyBookmark = async () => {
    let res: DataResponse = await Post("/api/bookmark", {
      image_id: id
    })
    if(res) {
      if(res.remove) {
        setData({...data, currentUserBookmark: []})
      }else {
        setData({...data, currentUserBookmark: [{id: 0}]})
      }
    }
  }

  const reloadImages = async () => {
    let imgs = await Get(`/api/images?order=new&search=`);
    setImages(imgs)
  }

  useEffect(() => {
    Get("/api/image?id=" + id).then(setData);
  }, [id])
  
  return (<div>
    <Backdrop onClick={() => setImageSpotlightId(null)}/>    
    
      <Overlay>
        <HeaderComponent applyBookmark={applyBookmark} data={data} id={id} applyLike={applyLike} banUser={banUser} currentUser={currentUser} deleteImage={deleteImage}/>

        <ImageComponent url={data.url} prompt={data.prompt}/>

        <div className={styles.promptText}>{"“"}{data.prompt}{"“"}</div>

        <ContentItem>
          <div className={styles.commentBound}>
            {currentUser && <CommentForm id={id} data={data} setData={setData}/>}
            <div className={styles.comments}>
              {data?.comments?.slice().reverse().map(c => <Comment banUser={banUser} data={c} key={"comment-item-"+c.id}/>)}
            </div>
          </div>
        </ContentItem>
      </Overlay>
  </div>)
}