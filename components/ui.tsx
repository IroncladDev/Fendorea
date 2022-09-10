import ui from '../styles/ui.module.scss'

export function Flex(props) {
  return (<div className={ui.flex + (props.direction === "column" ? " " + ui.flexColumn : "")} {...props}></div>);
}

export function FlexGrow(props) {
  return <div style={{flexGrow: 1}} {...props}></div>
}

export function Button(props) {
  return <button className={ui.button} {...props}></button>
}

export function Input(props) {
  return <input className={ui.input} {...props}/>
}

export function TextArea(props) {
  return <textarea className={ui.input} {...props}/>
}

export function FormLabel(props) {
  return <div className={ui.formLabel} {...props}></div>
}

export function GapHorizontal({ mult }: { mult: number }){
  return <div style={{marginLeft: mult ? mult * 10 : 10}}></div>
}

export function GapVertical({ mult }: { mult: number }){
  return <div style={{marginTop: mult ? mult * 10 : 10}}></div>
}