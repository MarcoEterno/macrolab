import {italian} from './italian.ts';
export type Language='en'|'it';
export const LANGUAGE_STORAGE_KEY='macrolab.language';
export const isLanguage=(value:unknown):value is Language=>value==='en'||value==='it';
export const defaultCountryId=(language:Language)=>language==='it'?'IT':'US';
export function createI18n(language:Language){
 const locale=language==='it'?'it-IT':'en-US';
 const number=(n:number,d=1)=>n.toLocaleString(locale,{minimumFractionDigits:d,maximumFractionDigits:d,useGrouping:"always"});
 const t=(key:string,values:Record<string,string|number>={}):string=>{
  if(language==='it'&&!Object.hasOwn(italian,key)){
   const range=key.match(/^(.*) must be between (-?[\d.]+) and (-?[\d.]+)\.$/);
   if(range)return t('{label} must be between {min} and {max}.',{label:t(range[1]),min:number(Number(range[2]),2),max:number(Number(range[3]),2)});
  }
  const copy=language==='it'?(italian[key]??key):key;
  return copy.replace(/\{(\w+)\}/g,(match,name)=>Object.hasOwn(values,name)?String(values[name]):match);
 };
 const signed=(n:number,d=1)=>(Math.abs(n)<.5*10**-d?'':n>0?'+':'')+number(Math.abs(n)<.5*10**-d?0:n,d);
 const period=(q:number)=>q===0?t('Today'):t('Year {year} · Q{quarter}',{year:Math.ceil(q/4),quarter:(q-1)%4+1});
 const gdpLabel=(n:number)=>language==='it'?`${number(n,0)} mld $`:n>=1000?`$${number(n/1000,2)}T`:`$${number(n,0)}B`;
 return {language,locale,t,number,signed,period,gdpLabel};
}
