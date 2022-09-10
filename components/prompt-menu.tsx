import styles from '../styles/index.module.scss'
import { Flex, FlexGrow, TextArea, Button, FormLabel } from './ui';
import Image from 'next/image';
import { Get } from '../scripts/fetch'
import {
  Heart, MessageSquare, Bookmark, X
} from 'react-feather'
import useStore from '../scripts/client/store'
import { useState } from 'react'
import Post, { DataResponse } from '../scripts/client/handle'

import {
  UserElement,
  FloatButton,
  Backdrop,
  Overlay,
  ContentItem,
  TagSingle,
  TagMulti
} from './base-components';

const artStyles = [
  "Octane Render",
  "Anime",
  "Digital Art",
  "Cyberpunk",
  "Digital Painting",
  "Sketch",
  "Oil Painting",
  "Photorealistic",
  "Pixel Art",
  "Steampunk",
  "Vintage",
  "Portrait",
  "Landscape",
  "Sillhouette",
  "Photo"
]

const excessOptions = [
  "realistic", "highly detailed", "sharp focus", "illustration", "8k", "hdr", "smooth", "high resolition", "3d render", "artstation", "extremely detailed", "wlop", "unreal engine", "intricate", "symetrical", "scifi", "3d", "elegant", "dark", "light", "fantasy", "futuristic", "cinematic lighting", "divine", "environment art", "landscape", "epic", "terrifying", "ray tracing", "mysterious", "4k", "trending on artstation", "extremely polished", "concept art", "dynamic lighting", "scenery", "matte", "street art", "hd", "vibrant colors", "comic cover art", "extra crisp", "oil painting", "micro detail", "masterpiece", "d&d", "supernatural", "atmospheric", "deviantart"
]
const artistOptions = [
  "greg rutkowski", "artgerm", "alphonse mucha", "charles vess", "van goh", "huang guangjian", "peter elson", "mikhail vrubel", "magali villeneuve", "luis royo", "dan mumford", "ross tran", "jordan grimmer"
]

function HeaderOptions({ hidePromptMenu }: { hidePromptMenu: () => void }){
  return (<Flex style={{ gap: '10px' }}>
    <FloatButton>New Image Generation</FloatButton>
    <FlexGrow/>
    <FloatButton onClick={hidePromptMenu}>
      <X size={20} color="var(--fg-default)"/>
    </FloatButton>
  </Flex>)
}

function GenerationBase({ promptOptions, setPromptOptions }: { 
promptOptions: promptOptionsInterface, setPromptOptions: (u: promptOptionsInterface) => void }) {
  return (<ContentItem>
    <FormLabel style={{marginTop: 0}}>Base Prompt</FormLabel>
    <TextArea
      onChange={(e:React.ChangeEvent<HTMLInputElement>) => setPromptOptions({ ...promptOptions, basePrompt: e.target.value })}  
      value={promptOptions.basePrompt}
      style={{width: '100%'}}
      rows={4}
      placeholder="Gandalf from Lord of the Rings in anime style"
    />
  </ContentItem>)
}

function ImageStyleOptions({ promptOptions, setPromptOptions }: { 
promptOptions: promptOptionsInterface, setPromptOptions: (u: promptOptionsInterface) => void }) {
  return (<ContentItem>
    <FormLabel style={{marginTop: 0}}>Art Style</FormLabel>
    {artStyles.map(x => <TagSingle
      key={"style-option-" + x}
      value={promptOptions.style}
      setValue={(v) => setPromptOptions({ ...promptOptions, style: v })}
      text={x}
    />)}
  </ContentItem>)
}

function TagOptions({ promptOptions, setPromptOptions }: { 
promptOptions: promptOptionsInterface, setPromptOptions: (u: promptOptionsInterface) => void }) {
  return (<ContentItem>
    <FormLabel style={{marginTop: 0}}>Additional Details</FormLabel>
    {excessOptions.map(x => <TagMulti
      key={"tag-style-option-" + x}
      data={promptOptions.tags}
      setData={(v) => setPromptOptions({ ...promptOptions, tags: v })}
      text={x}
    />)}
  </ContentItem>)
}

function ArtistOptions({ promptOptions, setPromptOptions }: { 
promptOptions: promptOptionsInterface, setPromptOptions: (u: promptOptionsInterface) => void }) {
  return (<ContentItem>
    <FormLabel style={{marginTop: 0}}>Artist(s)</FormLabel>
    {artistOptions.map(x => <TagMulti
      key={"tag-author-option-" + x}
      data={promptOptions.artists}
      setData={(v) => setPromptOptions({ ...promptOptions, artists: v })}
      text={x}
    />)}
  </ContentItem>)
}

interface promptOptionsInterface {
  basePrompt: string;
  style: string;
  tags: string[];
  artists: string[];
}

export default function PromptMenu({}) { 
  const { hidePromptMenu, setImages } = useStore(s => s);
  const [loading, setLoading] = useState(false)
  const [promptOptions, setPromptOptions] = useState<promptOptionsInterface>({
    basePrompt: "",
    style: "Octane Render",
    tags: [],
    artists: [],
  });

  const generate = () => {
    let outputPrompt = promptOptions.style + "; " + promptOptions.basePrompt + (promptOptions.tags.length > 0 ? "; " + promptOptions.tags.join(`, `) : "") + (promptOptions.artists.length > 0 ? "; art by " + promptOptions.artists.join(`, `): "");
    setLoading(true)
    Post("/api/generate", {
      prompt: outputPrompt
    }).then((res: DataResponse) => {
      if(res) {
        hidePromptMenu();
        Get(`/api/images?order=new&search=`).then(setImages)
      }
      setLoading(false);
    })
    
  };
  
  return (<div className={styles.promptMenu}>
    <Backdrop onClick={hidePromptMenu}/>
    
    <Overlay>
      <HeaderOptions hidePromptMenu={hidePromptMenu}/>
      <GenerationBase promptOptions={promptOptions} setPromptOptions={setPromptOptions}/>
      <ImageStyleOptions promptOptions={promptOptions} setPromptOptions={setPromptOptions}/>
      <TagOptions promptOptions={promptOptions} setPromptOptions={setPromptOptions}/>
      <ArtistOptions promptOptions={promptOptions} setPromptOptions={setPromptOptions}/>
      
      <ContentItem>
        <FormLabel style={{marginTop: 0}}>Finalization</FormLabel>
        <p style={{fontSize: 12, marginBottom: 10}}>Please make sure your prompt is SFW and does not contain any profane language.  Doing so intentionally can result in the termination of your access to Fendorea.</p>
        <TextArea 
          value={promptOptions.style + "; " + promptOptions.basePrompt + (promptOptions.tags.length > 0 ? "; " + promptOptions.tags.join(`, `) : "") + (promptOptions.artists.length > 0 ? "; art by " + promptOptions.artists.join(`, `): "")} 
          readonly={true} 
          style={{width: '100%', marginBottom: 10}}
        ></TextArea>
        <Button onClick={generate}>Generate!{loading && <span className={styles.loader}></span>}</Button>
      </ContentItem>
    </Overlay>
  </div>)
}