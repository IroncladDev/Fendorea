import styles from '../styles/index.module.scss'
import { FlexGrow, TextArea, Button, Flex } from './ui';
import Image from 'next/image';
import { Get } from '../scripts/fetch'
import {
  Heart, MessageSquare, Bookmark
} from 'react-feather'
import useStore from '../scripts/client/store'
import { useState } from 'react'
import Post from '../scripts/client/handle'

function GenerationForm() {
  const { hidePromptMenu, setImages } = useStore(s => s);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [promptOptions, setPromptOptions] = useState({
    tags: [],
    steps: 100,
    guidance: 10,
    width: 512,
    height: 512
  });

  const generateImage = async () => {
    setLoading(true)
    let res = await Post("/api/generate", {
      prompt
    });
    if(res) {
      let imgs = await Get(`/api/images?order=new&search=`);
      setImages(imgs)
      hidePromptMenu();
    }
    setLoading(false)
  }
  
  return (<div className={styles.generationForm}>
    <TextArea
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        placeholder="Cyberpunk wolf in shining golden armor, octane render"
      />
    <Button onClick={generateImage} disabled={loading}>Submit{loading&&<span className={styles.loader}></span>}</Button>
  </div>)
}

export default function PromptMenu({}) { 
  const { hidePromptMenu } = useStore(s => s);
  return (<div className={styles.promptMenu}>
    <div className={styles.promptMenuOverlay}></div>
    <div className={styles.promptMenuForm}>
      <Flex>
        <h2 style={{marginBottom: 20}}>Generate an Image</h2>
        <FlexGrow/>
        <div>
          <Button onClick={hidePromptMenu}>Close</Button>  
        </div>
      </Flex>

      <GenerationForm/>
      
    </div>
  </div>)
}