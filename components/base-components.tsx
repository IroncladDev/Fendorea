import styles from '../styles/baseui.module.scss'
import { Flex, FlexGrow } from './ui'
import Image from 'next/image';
import { ReactNode } from 'react'

export function UserElement({ username, image }: { username: string; image: string; }) {
  return (<a href={"https://replit.com/@" + username}>
    <Flex className={styles.userElement}>
      <Image src={"/api/proxy?url="+image} alt="Profile Image" width="20" height="20"/>
      <div className={styles.userElementUsername}>{username}</div>
    </Flex>
  </a>)
}

export function FloatButton({ onClick, children }: 
  { onClick?: null | (()=>void); children: ReactNode }) {
  let hasOnclickProperty: boolean = typeof onClick === 'function';
  return (<Flex className={styles.floatButton + (hasOnclickProperty ? " " + 
styles.floatButtonHoverable : "")} onClick={onClick}>{children}</Flex>)
}

export function Backdrop({ onClick }: { onClick:()=>void; }) {
  return (<div onClick={onClick} className={styles.backdrop}></div>)
}

export function Overlay({ children }: { children: ReactNode }) {
  return (<div className={styles.overlay}>{children}</div>)
}

export function ContentItem({ children }: { children: ReactNode }) {
  return (<div className={styles.contentItem}>{children}</div>)
}

export function TagSingle({ value, setValue, text }: { value: string; setValue: (v:string)=>void; text: string; }) {
  return (<div className={styles.dataTag + " " + (value === text ? styles.dataTagSelected : "")} onClick={() => setValue(text)}>{text}</div>)
}

export function TagMulti({ data, setData, text }: { data: string[], setData: (d:string[])=>void, text: string }) {
  return (<div className={styles.dataTag + " " + (data.includes(text) ? styles.dataTagSelected : "")} onClick={() => {
    if(data.includes(text)) setData(data.filter(x => x !== text))
    else setData([...data, text])
  }}>{text}</div>)
}