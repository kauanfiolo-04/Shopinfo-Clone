import { LoaderReturnType } from "deco/types.ts";
import { ProductDetailsPage } from "apps/commerce/types.ts";
import PopComponent from 'deco-sites/shp/components/ComponentsSHP/PopComponent.tsx'
import { useOffer } from 'deco-sites/shp/sdk/useOffer.ts'

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
  /** @description Datas para exibir o banner, Ex. 2020-10-05T18:30:00*/
  datas:{
    inicial:string
    final:string
  }
  disparo:Scroll|Carregamento
  page:LoaderReturnType<ProductDetailsPage | null>
  mobile:boolean
  minimo:number
  maximo:number
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

const PopUp=({ funcionabilidade, datas, disparo, page, minimo, maximo, mobile, ...props}:Props)=>{
  if(page===null) return null

  const now=new Date().getTime()
  const inicio=new Date(datas.inicial).getTime()
  const final=new Date(datas.final).getTime()

  if(!(now>=inicio && now<=final)) return null

  const {product}=page

  const {price} = useOffer(product.offers)

  if(!(price!>=minimo && price!<=maximo)) return null

  return <PopComponent disparo={disparo} funcionabilidade={funcionabilidade} mobile={mobile} {...props}/>
}

export default PopUp