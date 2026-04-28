import{r as s}from"./index.DJ_zPHkJ.js";function A(r){const e=s.useRef({value:r,previous:r});return s.useMemo(()=>(e.current.value!==r&&(e.current.previous=e.current.value,e.current.value=r),e.current.previous),[r])}/**
 * @license lucide-react v0.503.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=r=>r.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),C=r=>r.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,o)=>o?o.toUpperCase():t.toLowerCase()),u=r=>{const e=C(r);return e.charAt(0).toUpperCase()+e.slice(1)},i=(...r)=>r.filter((e,t,o)=>!!e&&e.trim()!==""&&o.indexOf(e)===t).join(" ").trim(),w=r=>{for(const e in r)if(e.startsWith("aria-")||e==="role"||e==="title")return!0};/**
 * @license lucide-react v0.503.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var h={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.503.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=s.forwardRef(({color:r="currentColor",size:e=24,strokeWidth:t=2,absoluteStrokeWidth:o,className:a="",children:n,iconNode:l,...c},p)=>s.createElement("svg",{ref:p,...h,width:e,height:e,stroke:r,strokeWidth:o?Number(t)*24/Number(e):t,className:i("lucide",a),...!n&&!w(c)&&{"aria-hidden":"true"},...c},[...l.map(([m,f])=>s.createElement(m,f)),...Array.isArray(n)?n:[n]]));/**
 * @license lucide-react v0.503.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=(r,e)=>{const t=s.forwardRef(({className:o,...a},n)=>s.createElement(g,{ref:n,iconNode:e,className:i(`lucide-${d(u(r))}`,`lucide-${r}`,o),...a}));return t.displayName=u(r),t};export{b as c,A as u};
