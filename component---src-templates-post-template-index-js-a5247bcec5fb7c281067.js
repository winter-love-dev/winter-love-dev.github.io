"use strict";(self.webpackChunkwinter_love_dev=self.webpackChunkwinter_love_dev||[]).push([[580],{978:function(e,t,a){a.d(t,{G:function(){return q},L:function(){return p},M:function(){return w},P:function(){return b},_:function(){return l},a:function(){return i},b:function(){return c},g:function(){return d},h:function(){return o}});var r=a(6540),n=(a(5147),a(5556)),s=a.n(n);function i(){return i=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r])}return e},i.apply(this,arguments)}function l(e,t){if(null==e)return{};var a,r,n={},s=Object.keys(e);for(r=0;r<s.length;r++)t.indexOf(a=s[r])>=0||(n[a]=e[a]);return n}const o=()=>"undefined"!=typeof HTMLImageElement&&"loading"in HTMLImageElement.prototype;function c(e,t,a,r,n){return void 0===n&&(n={}),i({},a,{loading:r,shouldLoad:e,"data-main-image":"",style:i({},n,{opacity:t?1:0})})}function d(e,t,a,r,n,s,l,o){const c={};s&&(c.backgroundColor=s,"fixed"===a?(c.width=r,c.height=n,c.backgroundColor=s,c.position="relative"):("constrained"===a||"fullWidth"===a)&&(c.position="absolute",c.top=0,c.left=0,c.bottom=0,c.right=0)),l&&(c.objectFit=l),o&&(c.objectPosition=o);const d=i({},e,{"aria-hidden":!0,"data-placeholder-image":"",style:i({opacity:t?0:1,transition:"opacity 500ms linear"},c)});return d}const u=["children"],m=function(e){let{layout:t,width:a,height:n}=e;return"fullWidth"===t?r.createElement("div",{"aria-hidden":!0,style:{paddingTop:n/a*100+"%"}}):"constrained"===t?r.createElement("div",{style:{maxWidth:a,display:"block"}},r.createElement("img",{alt:"",role:"presentation","aria-hidden":"true",src:"data:image/svg+xml;charset=utf-8,%3Csvg height='"+n+"' width='"+a+"' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E",style:{maxWidth:"100%",display:"block",position:"static"}})):null},p=function(e){let{children:t}=e,a=l(e,u);return r.createElement(r.Fragment,null,r.createElement(m,i({},a)),t,null)},g=["src","srcSet","loading","alt","shouldLoad"],h=["fallback","sources","shouldLoad"],f=function(e){let{src:t,srcSet:a,loading:n,alt:s="",shouldLoad:o}=e,c=l(e,g);return r.createElement("img",i({},c,{decoding:"async",loading:n,src:o?t:void 0,"data-src":o?void 0:t,srcSet:o?a:void 0,"data-srcset":o?void 0:a,alt:s}))},v=function(e){let{fallback:t,sources:a=[],shouldLoad:n=!0}=e,s=l(e,h);const o=s.sizes||(null==t?void 0:t.sizes),c=r.createElement(f,i({},s,t,{sizes:o,shouldLoad:n}));return a.length?r.createElement("picture",null,a.map((e=>{let{media:t,srcSet:a,type:s}=e;return r.createElement("source",{key:t+"-"+s+"-"+a,type:s,media:t,srcSet:n?a:void 0,"data-srcset":n?void 0:a,sizes:o})})),c):c};var y;f.propTypes={src:n.string.isRequired,alt:n.string.isRequired,sizes:n.string,srcSet:n.string,shouldLoad:n.bool},v.displayName="Picture",v.propTypes={alt:n.string.isRequired,shouldLoad:n.bool,fallback:n.exact({src:n.string.isRequired,srcSet:n.string,sizes:n.string}),sources:n.arrayOf(n.oneOfType([n.exact({media:n.string.isRequired,type:n.string,sizes:n.string,srcSet:n.string.isRequired}),n.exact({media:n.string,type:n.string.isRequired,sizes:n.string,srcSet:n.string.isRequired})]))};const E=["fallback"],b=function(e){let{fallback:t}=e,a=l(e,E);return t?r.createElement(v,i({},a,{fallback:{src:t},"aria-hidden":!0,alt:""})):r.createElement("div",i({},a))};b.displayName="Placeholder",b.propTypes={fallback:n.string,sources:null==(y=v.propTypes)?void 0:y.sources,alt:function(e,t,a){return e[t]?new Error("Invalid prop `"+t+"` supplied to `"+a+"`. Validation failed."):null}};const w=function(e){return r.createElement(r.Fragment,null,r.createElement(v,i({},e)),r.createElement("noscript",null,r.createElement(v,i({},e,{shouldLoad:!0}))))};w.displayName="MainImage",w.propTypes=v.propTypes;const k=function(e,t,a){for(var r=arguments.length,n=new Array(r>3?r-3:0),i=3;i<r;i++)n[i-3]=arguments[i];return e.alt||""===e.alt?s().string.apply(s(),[e,t,a].concat(n)):new Error('The "alt" prop is required in '+a+'. If the image is purely presentational then pass an empty string: e.g. alt="". Learn more: https://a11y-style-guide.com/style-guide/section-media.html')},N={image:s().object.isRequired,alt:k},L=["as","image","style","backgroundColor","className","class","onStartLoad","onLoad","onError"],C=["style","className"],x=new Set;let S,A;const T=function(e){let{as:t="div",image:n,style:s,backgroundColor:c,className:d,class:u,onStartLoad:m,onLoad:p,onError:g}=e,h=l(e,L);const{width:f,height:v,layout:y}=n,E=function(e,t,a){const r={};let n="gatsby-image-wrapper";return"fixed"===a?(r.width=e,r.height=t):"constrained"===a&&(n="gatsby-image-wrapper gatsby-image-wrapper-constrained"),{className:n,"data-gatsby-image-wrapper":"",style:r}}(f,v,y),{style:b,className:w}=E,k=l(E,C),N=(0,r.useRef)(),T=(0,r.useMemo)((()=>JSON.stringify(n.images)),[n.images]);u&&(d=u);const q=function(e,t,a){let r="";return"fullWidth"===e&&(r='<div aria-hidden="true" style="padding-top: '+a/t*100+'%;"></div>'),"constrained"===e&&(r='<div style="max-width: '+t+'px; display: block;"><img alt="" role="presentation" aria-hidden="true" src="data:image/svg+xml;charset=utf-8,%3Csvg height=\''+a+"' width='"+t+"' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E\" style=\"max-width: 100%; display: block; position: static;\"></div>"),r}(y,f,v);return(0,r.useEffect)((()=>{S||(S=Promise.all([a.e(593),a.e(896)]).then(a.bind(a,7896)).then((e=>{let{renderImageToString:t,swapPlaceholderImage:a}=e;return A=t,{renderImageToString:t,swapPlaceholderImage:a}})));const e=N.current.querySelector("[data-gatsby-image-ssr]");if(e&&o())return e.complete?(null==m||m({wasCached:!0}),null==p||p({wasCached:!0}),setTimeout((()=>{e.removeAttribute("data-gatsby-image-ssr")}),0)):(null==m||m({wasCached:!0}),e.addEventListener("load",(function t(){e.removeEventListener("load",t),null==p||p({wasCached:!0}),setTimeout((()=>{e.removeAttribute("data-gatsby-image-ssr")}),0)}))),void x.add(T);if(A&&x.has(T))return;let t,r;return S.then((e=>{let{renderImageToString:a,swapPlaceholderImage:l}=e;N.current&&(N.current.innerHTML=a(i({isLoading:!0,isLoaded:x.has(T),image:n},h)),x.has(T)||(t=requestAnimationFrame((()=>{N.current&&(r=l(N.current,T,x,s,m,p,g))}))))})),()=>{t&&cancelAnimationFrame(t),r&&r()}}),[n]),(0,r.useLayoutEffect)((()=>{x.has(T)&&A&&(N.current.innerHTML=A(i({isLoading:x.has(T),isLoaded:x.has(T),image:n},h)),null==m||m({wasCached:!0}),null==p||p({wasCached:!0}))}),[n]),(0,r.createElement)(t,i({},k,{style:i({},b,s,{backgroundColor:c}),className:w+(d?" "+d:""),ref:N,dangerouslySetInnerHTML:{__html:q},suppressHydrationWarning:!0}))},q=(0,r.memo)((function(e){return e.image?(0,r.createElement)(T,e):null}));q.propTypes=N,q.displayName="GatsbyImage";const _=["src","__imageData","__error","width","height","aspectRatio","tracedSVGOptions","placeholder","formats","quality","transformOptions","jpgOptions","pngOptions","webpOptions","avifOptions","blurredOptions","breakpoints","outputPixelDensities"],O=function(e,t){for(var a=arguments.length,r=new Array(a>2?a-2:0),n=2;n<a;n++)r[n-2]=arguments[n];return"fullWidth"!==e.layout||"width"!==t&&"height"!==t||!e[t]?s().number.apply(s(),[e,t].concat(r)):new Error('"'+t+'" '+e[t]+" may not be passed when layout is fullWidth.")},I=new Set(["fixed","fullWidth","constrained"]),j={src:s().string.isRequired,alt:k,width:O,height:O,sizes:s().string,layout:e=>{if(void 0!==e.layout&&!I.has(e.layout))return new Error("Invalid value "+e.layout+'" provided for prop "layout". Defaulting to "constrained". Valid values are "fixed", "fullWidth" or "constrained".')}},M=(P=q,function(e){let{src:t,__imageData:a,__error:n}=e,s=l(e,_);return n&&console.warn(n),a?r.createElement(P,i({image:a},s)):(console.warn("Image not loaded",t),null)});var P;M.displayName="StaticImage",M.propTypes=j},5147:function(e){const t=(e,t)=>{if("string"!=typeof e&&!Array.isArray(e))throw new TypeError("Expected the input to be `string | string[]`");t=Object.assign({pascalCase:!1},t);if(e=Array.isArray(e)?e.map((e=>e.trim())).filter((e=>e.length)).join("-"):e.trim(),0===e.length)return"";if(1===e.length)return t.pascalCase?e.toUpperCase():e.toLowerCase();return e!==e.toLowerCase()&&(e=(e=>{let t=!1,a=!1,r=!1;for(let n=0;n<e.length;n++){const s=e[n];t&&/[a-zA-Z]/.test(s)&&s.toUpperCase()===s?(e=e.slice(0,n)+"-"+e.slice(n),t=!1,r=a,a=!0,n++):a&&r&&/[a-zA-Z]/.test(s)&&s.toLowerCase()===s?(e=e.slice(0,n-1)+"-"+e.slice(n-1),r=a,a=!1,t=!0):(t=s.toLowerCase()===s&&s.toUpperCase()!==s,r=a,a=s.toUpperCase()===s&&s.toLowerCase()!==s)}return e})(e)),e=e.replace(/^[_.\- ]+/,"").toLowerCase().replace(/[_.\- ]+(\w|$)/g,((e,t)=>t.toUpperCase())).replace(/\d+(\w|$)/g,(e=>e.toUpperCase())),a=e,t.pascalCase?a.charAt(0).toUpperCase()+a.slice(1):a;var a};e.exports=t,e.exports.default=t},8307:function(e,t,a){a.d(t,{A:function(){return c}});var r=a(6359),n=a(6540),s=a(961),i=a.p+"static/icon_kakao-ddda5cf5b1edd1754a455d72b3279f0f.svg",l=a.p+"static/icon_toss-d4bdfd5d6edd96094dc873d7ac523a35.svg",o=a(7244);var c=()=>{const{site:e}=(0,r.useStaticQuery)("988760642"),t=e.siteMetadata.remittances,{toss:a,kakaopay:c}=t,{0:d,1:u}=(0,n.useState)(!1),{0:m,1:p}=(0,n.useState)(null),{0:g,1:h}=(0,n.useState)(!1);(0,n.useEffect)((()=>{p(document.querySelector("html"));const e=()=>{h(window.innerWidth<=768)};return e(),window.addEventListener("resize",e),()=>{window.removeEventListener("resize",e)}}),[]);return n.createElement(n.Fragment,null,n.createElement("div",{className:"buy-me-coffee-button",onClick:()=>{u(!0),null==m||m.classList.add("scroll-locked")}},n.createElement("div",{className:"buy-me-coffee-text"},"BuyMeACoffee ☕️".split("").map(((e,t)=>n.createElement("p",{key:t},e))))),d&&(0,s.createPortal)(n.createElement("div",{className:"modal-background",onClick:()=>{u(!1),null==m||m.classList.remove("scroll-locked")}},n.createElement("div",{className:"modal"},n.createElement("div",{className:"buy-me-coffee-title"},"Buy Me A Coffee ☕️"),n.createElement("div",{className:"content"},n.createElement("div",{className:"list"},n.createElement("div",null,"송금 QR"),n.createElement("div",{className:"qr"},c.qrCode&&n.createElement("div",null,n.createElement("img",{src:i}),n.createElement(o.A,{alt:"kakaopay",src:c.qrCode})),a.qrCode&&n.createElement("div",null,n.createElement("img",{src:l}),n.createElement(o.A,{alt:"toss",src:a.qrCode}))),g&&n.createElement("div",{className:"mobile-links"},n.createElement("div",{className:"deep-link-button"},n.createElement("a",{href:c.qrText,className:"a",target:"_blank",rel:"noopener noreferrer"},n.createElement("p",{className:"p"},"카카오로 송금하기"))),n.createElement("div",{className:"deep-link-button"},n.createElement("a",{href:a.qrText,className:"a",target:"_blank",rel:"noopener noreferrer"},n.createElement("p",{className:"p"},"토스로 송금하기")))))))),document.body))}},7244:function(e,t,a){var r=a(8587),n=a(6540),s=a(6359),i=a(978);const l=["src"];t.A=e=>{let{src:t}=e,a=(0,r.A)(e,l);const o=(0,s.useStaticQuery)("3350743975"),c=(0,n.useMemo)((()=>o.images.edges.find((e=>{let{node:a}=e;return t===a.relativePath}))),[o,t]);if(!c)return null;const{node:{childImageSharp:d,publicURL:u,extension:m}={}}=c;return"svg"!==m&&d?n.createElement(i.G,Object.assign({image:d.gatsbyImageData,alt:u},a)):n.createElement("img",Object.assign({src:u,alt:u},a))}},9526:function(e,t,a){a.r(t),a.d(t,{default:function(){return v}});var r=a(6540),n=a(9531),s=a(7940),i=a(6359);var l=function(e){let{post:t}=e;return r.createElement("header",{className:"post-header"},t.emoji&&r.createElement("div",{className:"emoji"},t.emoji),r.createElement("div",{className:"info"},r.createElement("div",{className:"categories"},t.categories.map((e=>r.createElement(i.Link,{className:"category",key:e,to:"/posts/"+e},e))))),r.createElement("h1",{className:"title"},t.title),r.createElement("div",{className:"info"},r.createElement("div",{className:"author"},"posted by ",r.createElement("strong",null,t.author),",")," ",t.date))};var o=function(e){let{prevPost:t,nextPost:a}=e;return r.createElement("div",{className:"post-navigator"},r.createElement("div",{className:"post-navigator-card-wrapper"},a&&r.createElement(i.Link,{className:"post-card prev",key:a.id,to:a.slug},r.createElement("div",{className:"direction"},"이전 글"),r.createElement("div",{className:"title"},a.title))),r.createElement("div",{className:"post-navigator-card-wrapper"},t&&r.createElement(i.Link,{className:"post-card next",key:t.id,to:t.slug},r.createElement("div",{className:"direction"},"다음 글"),r.createElement("div",{className:"title"},t.title))))},c=a(1740);var d=function(e){let{html:t}=e;return r.createElement("div",{className:"post-content"},r.createElement("div",{className:"markdown",dangerouslySetInnerHTML:{__html:t}}))},u=a(4603);const m="https://utteranc.es",p=()=>(0,u.q)("isDarkMode")?"photon-dark":"github-light",g=()=>{var e;const t=null===(e=document.querySelector("iframe"))||void 0===e?void 0:e.contentWindow;null==t||t.postMessage({type:"set-theme",theme:p()},m)};var h=function(e){let{repo:t,path:a}=e;const n=(0,r.createRef)(),s=(0,r.useRef)(!1);return(0,r.useEffect)((()=>{if(!n.current||s.current)return;const e=document.createElement("script"),r={src:m+"/client.js",repo:t,branch:"master",theme:p(),label:"comment",async:!0,crossorigin:"anonymous"};"/gatsby-github-blog/"===a?r["issue-number"]=14:r["issue-term"]="pathname",Object.keys(r).forEach((t=>{e.setAttribute(t,r[t])})),n.current.appendChild(e),window.addEventListener("theme",g),s.current=!0}),[t,n,a]),r.createElement("div",{className:"utterances",ref:n})},f=a(8307);var v=function(e){var t,a;let{data:i}=e;const u=new c.A(i.cur),m=i.prev&&new c.A(i.prev),p=i.next&&new c.A(i.next),{comments:g}=null===(t=i.site)||void 0===t?void 0:t.siteMetadata,v=null==g||null===(a=g.utterances)||void 0===a?void 0:a.repo;return r.createElement(n.A,null,r.createElement(s.A,{title:null==u?void 0:u.title,description:null==u?void 0:u.excerpt}),r.createElement(l,{post:u}),r.createElement(d,{html:u.html}),r.createElement("div",{className:"donation-section-wrapper"},r.createElement("span",{className:"text"},"👇 도움이 되셨나요? 👇"),r.createElement(f.A,null)),r.createElement(o,{prevPost:m,nextPost:p}),v&&r.createElement(h,{repo:v,path:u.slug}))}}}]);
//# sourceMappingURL=component---src-templates-post-template-index-js-a5247bcec5fb7c281067.js.map