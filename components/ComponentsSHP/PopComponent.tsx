// deno-lint-ignore-file no-explicit-any
import { useEffect, useState } from 'preact/hooks'
import Image from 'deco-sites/std/packs/image/components/Image.tsx'

interface Scroll{
  type:"scroll"
  porcentagem:number
}

interface Carregamento{
  type:"carregamento"
  segundos:number
}
interface CTA{
  type:"CTA"
  link:string
}

interface ClickAndCopy{
  type:"copy"
  conteudo:string
}

interface Pattern{
  funcionabilidade?:CTA|ClickAndCopy
  disparo:Scroll|Carregamento
  mobile:boolean
}

interface Conteudo extends Pattern{
  type:"Content"
  titulo1:string
  titulo2:string
  /**@format color */
  corFundo:string
  /**@format color */
  corTexto:string
}

interface Imagem extends Pattern{
  type:"Image"
  bannerLink:string
}

export type Props=Conteudo|Imagem

const PopComponent=({ funcionabilidade, disparo, mobile, ...props}:Props)=>{
  const [show,setShow]=useState(false)

  const close=(e:MouseEvent)=>{
    // cancela o redirecionamento do href caso tenha
    e.preventDefault()
    e.stopPropagation()
    setShow(false)
  }
  
  const modalProps:any = {
    className: `${!mobile ? 'hidden re1:block' : ''} z-50 fixed bottom-4 left-4 w-[400px] ${funcionabilidade ? (funcionabilidade.type==='CTA' ? 'cursor-pointer' : 'cursor-copy') : ''}`,
    ...(funcionabilidade && funcionabilidade.type==='CTA' && { href: funcionabilidade.link }),
    ...(funcionabilidade && funcionabilidade.type==='copy' && { title:'Copie para a área de transferência!', onclick:async()=>{
      const textToCopy = funcionabilidade.conteudo
      try{
        await navigator.clipboard.writeText(textToCopy)
        alert('Texto copiado: ' + textToCopy)
      }catch (err) {
        console.error('Falha ao copiar texto: ', err)
      }
    } }),
    style: props.type === 'Image' ? { backgroundImage: `url('${props.bannerLink}')`, borderRadius:'8px' } : {}
  }

  useEffect(()=>{
    console.log(modalProps)
    if(disparo.type==="carregamento"){
      setTimeout(()=>{
        setShow(true)
      },disparo.segundos*1000)
    }else{
      let scrollHandled=false

      const handleScroll=()=>{
        const scrollTop= globalThis.window.scrollY || globalThis.window.pageYOffset
        const scrollableHeight= document.documentElement.scrollHeight - document.documentElement.clientHeight

        const scrollPercent=(scrollTop/scrollableHeight)*100

        if(scrollPercent >= disparo.porcentagem && !scrollHandled){
          scrollHandled=true
          setShow(true)
        }
      }

      globalThis.window.addEventListener('scroll',handleScroll)

      return ()=>{
        globalThis.window.removeEventListener('scroll',handleScroll)
      }
    }
  },[])

  return show ? (
    <a {...modalProps}>
      <div className='relative'>
        <button className='absolute top-[0.15rem] right-2 font-bold z-60 text-[#C3C3C3] hover:text-[#000000]' onClick={close}>✕</button>
        {props.type==='Image' ? (
          // Image content
          <div className='w-full h-[200px]'/>
        ) : (
          // Content content
          <div className='flex p-5 items-center justify-center gap-5 rounded-lg w-full' style={{backgroundColor:props.corFundo, color:props.corTexto}}>
            <div>
              <Image src='https://shopinfo.vteximg.com.br/arquivos/logo-shopinfo.png' width={67} height={64}/>
            </div>
            <div>
              <span className='font-bold text-xl'>{props.titulo1}</span>
              <p className='whitespace-break-spaces' dangerouslySetInnerHTML={{__html:props.titulo2.replaceAll('  ', '<br/>')}}/>
            </div>
          </div>
        )}
      </div>
    </a>
  ) : null
}

export default PopComponent