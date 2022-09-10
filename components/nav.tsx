import styles from '../styles/index.module.scss';
import { authenticate } from '../scripts/client/actions';
import { FlexGrow, Button, Input } from './ui';
import useStore from '../scripts/client/store';
import { useEffect } from 'react';
import ui from '../styles/ui.module.scss';
import { Plus, Bookmark } from 'react-feather'
import { Get } from '../scripts/fetch';
import Image from 'next/image'

export default function Nav({ loggedIn }: { loggedIn: boolean }) {
  const { 
    searchQuery, 
    setSearchQuery, 
    searchOrder, 
    setSearchOrder,
    showPromptMenu,
    setImages,
    showBookmarkMenu
  } = useStore(s => s);

  const reloadImages = async () => {
    let imgs = await Get(`/api/images?order=${searchOrder}&search=${searchQuery}`);
    setImages(imgs)
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      reloadImages();
    }, 1000)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  useEffect(() => {
    reloadImages();
  }, [searchOrder]);
  
  return (<div className={styles.nav}>
    <div className={styles.navLogoContainer}>
      <Image src="/logo.svg" alt="Fendorea logo" className={styles.navLogo} width="50" height="50"/>
      <span className={styles.navLogoTitle}>Fendorea</span>
    </div>

    <div className={styles.centralFlexItemNav + " " + styles.centralSearch}>
      <Input
        placeholder="Search"  
        value={searchQuery}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
      />
      <select 
        className={ui.button} 
        style={{paddingLeft: 5}}
        value={searchOrder}
        onChange={e => setSearchOrder(e.target.value)}
      >
        <option value="new">New</option>
        <option value="likes">Likes</option>
        <option value="comments">Comments</option>
        <option value="old">Old</option>
      </select>
    </div>

    <div className={styles.centralFlexItemNav}>
      {loggedIn ? 
        <Button onClick={showPromptMenu} style={{padding: '2.5px 5px'}}>
          <Plus color="var(--fg-default)" size={20}/>
        </Button> :
        <Button onClick={authenticate}>Log In</Button>
      }
      {loggedIn && <Button style={{padding: '2.5px 5px'}} onClick={showBookmarkMenu}><Bookmark color="var(--fg-default)" size={20}/></Button>}
    </div>
  </div>)
}