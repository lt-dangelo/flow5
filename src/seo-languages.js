// URLs expose each translated workout page to search engines.
// One shared workout engine and stored configuration serve all languages.
export const SEO_LANGUAGES=Object.freeze(['en','de','it','fr','es']);
const LOCALIZED=new Set(SEO_LANGUAGES.filter(lang=>lang!=='en'));

export function languageForPath(pathname,rootPath){
  if(!pathname.startsWith(rootPath))return 'en';
  const relative=pathname.slice(rootPath.length);
  const match=/^(de|it|fr|es)(?:\/|$)/.exec(relative);
  return match?match[1]:'en';
}

export function languageUrl(rootHref,language){
  const root=new URL('./',rootHref);
  const lang=LOCALIZED.has(language)?language:'en';
  return new URL(lang==='en'?'./':lang+'/',root).href;
}
