import { useState, useEffect } from 'preact/hooks'
import ScrollToTop from 'deco-sites/shp/components/pop-ups/ScrollToTop.tsx'
import Help from 'deco-sites/shp/components/pop-ups/Help.tsx'
import Whatsapp from 'deco-sites/shp/components/pop-ups/Whatsapp.tsx'

// export interface Props{
//   links:Array<{
//     text:string
//     icon:{type:'image', src:string, w:number, h:number} | {type:'svg', code:string}
//     href:string
//   }>
// }

const HelperButtons=()=>{

  const [showToTop, setShowToTop]=useState(false)
  // const [isPDP, setIsPDP]=useState(false)

  const handleScroll=()=>{
    setShowToTop(globalThis.window.scrollY > globalThis.window.innerHeight-200)
  } 

  useEffect(()=>{
    if(typeof globalThis.window !== 'undefined'){
  //     globalThis.window.location.pathname.split('/').pop() === 'p' && setIsPDP(true)

      globalThis.window.addEventListener('scroll' ,handleScroll)
    }

    return ()=>{
      globalThis.window.removeEventListener('scroll',handleScroll)
    }
  },[])

  return (
    <div className='z-[10] fixed right-[20px] flex flex-col gap-3 items-end bottom-32'>
      <Whatsapp/>
      <Help/>
      <div className={showToTop ? '' : 'hidden'}>
        <ScrollToTop />
      </div>
    </div>
  )
}

export default HelperButtons