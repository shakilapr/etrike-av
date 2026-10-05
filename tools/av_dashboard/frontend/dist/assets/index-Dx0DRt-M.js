var $v=Object.defineProperty;var T0=s=>{throw TypeError(s)};var Kv=(s,e,t)=>e in s?$v(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var nt=(s,e,t)=>Kv(s,typeof e!="symbol"?e+"":e,t),Zd=(s,e,t)=>e.has(s)||T0("Cannot "+t);var me=(s,e,t)=>(Zd(s,e,"read from private field"),t?t.call(s):e.get(s)),wt=(s,e,t)=>e.has(s)?T0("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(s):e.set(s,t),at=(s,e,t,i)=>(Zd(s,e,"write to private field"),i?i.call(s,t):e.set(s,t),t),kn=(s,e,t)=>(Zd(s,e,"access private method"),t);var _c=(s,e,t,i)=>({set _(a){at(s,e,a,t)},get _(){return me(s,e,i)}});(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const l of a)if(l.type==="childList")for(const c of l.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function t(a){const l={};return a.integrity&&(l.integrity=a.integrity),a.referrerPolicy&&(l.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?l.credentials="include":a.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function i(a){if(a.ep)return;a.ep=!0;const l=t(a);fetch(a.href,l)}})();function S_(s){return s&&s.__esModule&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s}var Qd={exports:{}},Bo={},Jd={exports:{}},Mt={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var A0;function Zv(){if(A0)return Mt;A0=1;var s=Symbol.for("react.element"),e=Symbol.for("react.portal"),t=Symbol.for("react.fragment"),i=Symbol.for("react.strict_mode"),a=Symbol.for("react.profiler"),l=Symbol.for("react.provider"),c=Symbol.for("react.context"),d=Symbol.for("react.forward_ref"),h=Symbol.for("react.suspense"),f=Symbol.for("react.memo"),_=Symbol.for("react.lazy"),m=Symbol.iterator;function g(O){return O===null||typeof O!="object"?null:(O=m&&O[m]||O["@@iterator"],typeof O=="function"?O:null)}var y={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},M=Object.assign,T={};function S(O,se,Se){this.props=O,this.context=se,this.refs=T,this.updater=Se||y}S.prototype.isReactComponent={},S.prototype.setState=function(O,se){if(typeof O!="object"&&typeof O!="function"&&O!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,O,se,"setState")},S.prototype.forceUpdate=function(O){this.updater.enqueueForceUpdate(this,O,"forceUpdate")};function x(){}x.prototype=S.prototype;function C(O,se,Se){this.props=O,this.context=se,this.refs=T,this.updater=Se||y}var I=C.prototype=new x;I.constructor=C,M(I,S.prototype),I.isPureReactComponent=!0;var w=Array.isArray,R=Object.prototype.hasOwnProperty,P={current:null},U={key:!0,ref:!0,__self:!0,__source:!0};function A(O,se,Se){var Ge,ze={},Ve=null,ae=null;if(se!=null)for(Ge in se.ref!==void 0&&(ae=se.ref),se.key!==void 0&&(Ve=""+se.key),se)R.call(se,Ge)&&!U.hasOwnProperty(Ge)&&(ze[Ge]=se[Ge]);var de=arguments.length-2;if(de===1)ze.children=Se;else if(1<de){for(var Ee=Array(de),$e=0;$e<de;$e++)Ee[$e]=arguments[$e+2];ze.children=Ee}if(O&&O.defaultProps)for(Ge in de=O.defaultProps,de)ze[Ge]===void 0&&(ze[Ge]=de[Ge]);return{$$typeof:s,type:O,key:Ve,ref:ae,props:ze,_owner:P.current}}function D(O,se){return{$$typeof:s,type:O.type,key:se,ref:O.ref,props:O.props,_owner:O._owner}}function k(O){return typeof O=="object"&&O!==null&&O.$$typeof===s}function z(O){var se={"=":"=0",":":"=2"};return"$"+O.replace(/[=:]/g,function(Se){return se[Se]})}var G=/\/+/g;function $(O,se){return typeof O=="object"&&O!==null&&O.key!=null?z(""+O.key):se.toString(36)}function H(O,se,Se,Ge,ze){var Ve=typeof O;(Ve==="undefined"||Ve==="boolean")&&(O=null);var ae=!1;if(O===null)ae=!0;else switch(Ve){case"string":case"number":ae=!0;break;case"object":switch(O.$$typeof){case s:case e:ae=!0}}if(ae)return ae=O,ze=ze(ae),O=Ge===""?"."+$(ae,0):Ge,w(ze)?(Se="",O!=null&&(Se=O.replace(G,"$&/")+"/"),H(ze,se,Se,"",function($e){return $e})):ze!=null&&(k(ze)&&(ze=D(ze,Se+(!ze.key||ae&&ae.key===ze.key?"":(""+ze.key).replace(G,"$&/")+"/")+O)),se.push(ze)),1;if(ae=0,Ge=Ge===""?".":Ge+":",w(O))for(var de=0;de<O.length;de++){Ve=O[de];var Ee=Ge+$(Ve,de);ae+=H(Ve,se,Se,Ee,ze)}else if(Ee=g(O),typeof Ee=="function")for(O=Ee.call(O),de=0;!(Ve=O.next()).done;)Ve=Ve.value,Ee=Ge+$(Ve,de++),ae+=H(Ve,se,Se,Ee,ze);else if(Ve==="object")throw se=String(O),Error("Objects are not valid as a React child (found: "+(se==="[object Object]"?"object with keys {"+Object.keys(O).join(", ")+"}":se)+"). If you meant to render a collection of children, use an array instead.");return ae}function Q(O,se,Se){if(O==null)return O;var Ge=[],ze=0;return H(O,Ge,"","",function(Ve){return se.call(Se,Ve,ze++)}),Ge}function he(O){if(O._status===-1){var se=O._result;se=se(),se.then(function(Se){(O._status===0||O._status===-1)&&(O._status=1,O._result=Se)},function(Se){(O._status===0||O._status===-1)&&(O._status=2,O._result=Se)}),O._status===-1&&(O._status=0,O._result=se)}if(O._status===1)return O._result.default;throw O._result}var ne={current:null},ee={transition:null},K={ReactCurrentDispatcher:ne,ReactCurrentBatchConfig:ee,ReactCurrentOwner:P};function Z(){throw Error("act(...) is not supported in production builds of React.")}return Mt.Children={map:Q,forEach:function(O,se,Se){Q(O,function(){se.apply(this,arguments)},Se)},count:function(O){var se=0;return Q(O,function(){se++}),se},toArray:function(O){return Q(O,function(se){return se})||[]},only:function(O){if(!k(O))throw Error("React.Children.only expected to receive a single React element child.");return O}},Mt.Component=S,Mt.Fragment=t,Mt.Profiler=a,Mt.PureComponent=C,Mt.StrictMode=i,Mt.Suspense=h,Mt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=K,Mt.act=Z,Mt.cloneElement=function(O,se,Se){if(O==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+O+".");var Ge=M({},O.props),ze=O.key,Ve=O.ref,ae=O._owner;if(se!=null){if(se.ref!==void 0&&(Ve=se.ref,ae=P.current),se.key!==void 0&&(ze=""+se.key),O.type&&O.type.defaultProps)var de=O.type.defaultProps;for(Ee in se)R.call(se,Ee)&&!U.hasOwnProperty(Ee)&&(Ge[Ee]=se[Ee]===void 0&&de!==void 0?de[Ee]:se[Ee])}var Ee=arguments.length-2;if(Ee===1)Ge.children=Se;else if(1<Ee){de=Array(Ee);for(var $e=0;$e<Ee;$e++)de[$e]=arguments[$e+2];Ge.children=de}return{$$typeof:s,type:O.type,key:ze,ref:Ve,props:Ge,_owner:ae}},Mt.createContext=function(O){return O={$$typeof:c,_currentValue:O,_currentValue2:O,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},O.Provider={$$typeof:l,_context:O},O.Consumer=O},Mt.createElement=A,Mt.createFactory=function(O){var se=A.bind(null,O);return se.type=O,se},Mt.createRef=function(){return{current:null}},Mt.forwardRef=function(O){return{$$typeof:d,render:O}},Mt.isValidElement=k,Mt.lazy=function(O){return{$$typeof:_,_payload:{_status:-1,_result:O},_init:he}},Mt.memo=function(O,se){return{$$typeof:f,type:O,compare:se===void 0?null:se}},Mt.startTransition=function(O){var se=ee.transition;ee.transition={};try{O()}finally{ee.transition=se}},Mt.unstable_act=Z,Mt.useCallback=function(O,se){return ne.current.useCallback(O,se)},Mt.useContext=function(O){return ne.current.useContext(O)},Mt.useDebugValue=function(){},Mt.useDeferredValue=function(O){return ne.current.useDeferredValue(O)},Mt.useEffect=function(O,se){return ne.current.useEffect(O,se)},Mt.useId=function(){return ne.current.useId()},Mt.useImperativeHandle=function(O,se,Se){return ne.current.useImperativeHandle(O,se,Se)},Mt.useInsertionEffect=function(O,se){return ne.current.useInsertionEffect(O,se)},Mt.useLayoutEffect=function(O,se){return ne.current.useLayoutEffect(O,se)},Mt.useMemo=function(O,se){return ne.current.useMemo(O,se)},Mt.useReducer=function(O,se,Se){return ne.current.useReducer(O,se,Se)},Mt.useRef=function(O){return ne.current.useRef(O)},Mt.useState=function(O){return ne.current.useState(O)},Mt.useSyncExternalStore=function(O,se,Se){return ne.current.useSyncExternalStore(O,se,Se)},Mt.useTransition=function(){return ne.current.useTransition()},Mt.version="18.3.1",Mt}var C0;function If(){return C0||(C0=1,Jd.exports=Zv()),Jd.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var R0;function Qv(){if(R0)return Bo;R0=1;var s=If(),e=Symbol.for("react.element"),t=Symbol.for("react.fragment"),i=Object.prototype.hasOwnProperty,a=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l={key:!0,ref:!0,__self:!0,__source:!0};function c(d,h,f){var _,m={},g=null,y=null;f!==void 0&&(g=""+f),h.key!==void 0&&(g=""+h.key),h.ref!==void 0&&(y=h.ref);for(_ in h)i.call(h,_)&&!l.hasOwnProperty(_)&&(m[_]=h[_]);if(d&&d.defaultProps)for(_ in h=d.defaultProps,h)m[_]===void 0&&(m[_]=h[_]);return{$$typeof:e,type:d,key:g,ref:y,props:m,_owner:a.current}}return Bo.Fragment=t,Bo.jsx=c,Bo.jsxs=c,Bo}var P0;function Jv(){return P0||(P0=1,Qd.exports=Qv()),Qd.exports}var E=Jv(),ln=If();const fs=S_(ln);var xc={},eh={exports:{}},ni={},th={exports:{}},nh={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var N0;function ey(){return N0||(N0=1,(function(s){function e(ee,K){var Z=ee.length;ee.push(K);e:for(;0<Z;){var O=Z-1>>>1,se=ee[O];if(0<a(se,K))ee[O]=K,ee[Z]=se,Z=O;else break e}}function t(ee){return ee.length===0?null:ee[0]}function i(ee){if(ee.length===0)return null;var K=ee[0],Z=ee.pop();if(Z!==K){ee[0]=Z;e:for(var O=0,se=ee.length,Se=se>>>1;O<Se;){var Ge=2*(O+1)-1,ze=ee[Ge],Ve=Ge+1,ae=ee[Ve];if(0>a(ze,Z))Ve<se&&0>a(ae,ze)?(ee[O]=ae,ee[Ve]=Z,O=Ve):(ee[O]=ze,ee[Ge]=Z,O=Ge);else if(Ve<se&&0>a(ae,Z))ee[O]=ae,ee[Ve]=Z,O=Ve;else break e}}return K}function a(ee,K){var Z=ee.sortIndex-K.sortIndex;return Z!==0?Z:ee.id-K.id}if(typeof performance=="object"&&typeof performance.now=="function"){var l=performance;s.unstable_now=function(){return l.now()}}else{var c=Date,d=c.now();s.unstable_now=function(){return c.now()-d}}var h=[],f=[],_=1,m=null,g=3,y=!1,M=!1,T=!1,S=typeof setTimeout=="function"?setTimeout:null,x=typeof clearTimeout=="function"?clearTimeout:null,C=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function I(ee){for(var K=t(f);K!==null;){if(K.callback===null)i(f);else if(K.startTime<=ee)i(f),K.sortIndex=K.expirationTime,e(h,K);else break;K=t(f)}}function w(ee){if(T=!1,I(ee),!M)if(t(h)!==null)M=!0,he(R);else{var K=t(f);K!==null&&ne(w,K.startTime-ee)}}function R(ee,K){M=!1,T&&(T=!1,x(A),A=-1),y=!0;var Z=g;try{for(I(K),m=t(h);m!==null&&(!(m.expirationTime>K)||ee&&!z());){var O=m.callback;if(typeof O=="function"){m.callback=null,g=m.priorityLevel;var se=O(m.expirationTime<=K);K=s.unstable_now(),typeof se=="function"?m.callback=se:m===t(h)&&i(h),I(K)}else i(h);m=t(h)}if(m!==null)var Se=!0;else{var Ge=t(f);Ge!==null&&ne(w,Ge.startTime-K),Se=!1}return Se}finally{m=null,g=Z,y=!1}}var P=!1,U=null,A=-1,D=5,k=-1;function z(){return!(s.unstable_now()-k<D)}function G(){if(U!==null){var ee=s.unstable_now();k=ee;var K=!0;try{K=U(!0,ee)}finally{K?$():(P=!1,U=null)}}else P=!1}var $;if(typeof C=="function")$=function(){C(G)};else if(typeof MessageChannel<"u"){var H=new MessageChannel,Q=H.port2;H.port1.onmessage=G,$=function(){Q.postMessage(null)}}else $=function(){S(G,0)};function he(ee){U=ee,P||(P=!0,$())}function ne(ee,K){A=S(function(){ee(s.unstable_now())},K)}s.unstable_IdlePriority=5,s.unstable_ImmediatePriority=1,s.unstable_LowPriority=4,s.unstable_NormalPriority=3,s.unstable_Profiling=null,s.unstable_UserBlockingPriority=2,s.unstable_cancelCallback=function(ee){ee.callback=null},s.unstable_continueExecution=function(){M||y||(M=!0,he(R))},s.unstable_forceFrameRate=function(ee){0>ee||125<ee?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):D=0<ee?Math.floor(1e3/ee):5},s.unstable_getCurrentPriorityLevel=function(){return g},s.unstable_getFirstCallbackNode=function(){return t(h)},s.unstable_next=function(ee){switch(g){case 1:case 2:case 3:var K=3;break;default:K=g}var Z=g;g=K;try{return ee()}finally{g=Z}},s.unstable_pauseExecution=function(){},s.unstable_requestPaint=function(){},s.unstable_runWithPriority=function(ee,K){switch(ee){case 1:case 2:case 3:case 4:case 5:break;default:ee=3}var Z=g;g=ee;try{return K()}finally{g=Z}},s.unstable_scheduleCallback=function(ee,K,Z){var O=s.unstable_now();switch(typeof Z=="object"&&Z!==null?(Z=Z.delay,Z=typeof Z=="number"&&0<Z?O+Z:O):Z=O,ee){case 1:var se=-1;break;case 2:se=250;break;case 5:se=1073741823;break;case 4:se=1e4;break;default:se=5e3}return se=Z+se,ee={id:_++,callback:K,priorityLevel:ee,startTime:Z,expirationTime:se,sortIndex:-1},Z>O?(ee.sortIndex=Z,e(f,ee),t(h)===null&&ee===t(f)&&(T?(x(A),A=-1):T=!0,ne(w,Z-O))):(ee.sortIndex=se,e(h,ee),M||y||(M=!0,he(R))),ee},s.unstable_shouldYield=z,s.unstable_wrapCallback=function(ee){var K=g;return function(){var Z=g;g=K;try{return ee.apply(this,arguments)}finally{g=Z}}}})(nh)),nh}var L0;function ty(){return L0||(L0=1,th.exports=ey()),th.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var D0;function ny(){if(D0)return ni;D0=1;var s=If(),e=ty();function t(n){for(var r="https://reactjs.org/docs/error-decoder.html?invariant="+n,o=1;o<arguments.length;o++)r+="&args[]="+encodeURIComponent(arguments[o]);return"Minified React error #"+n+"; visit "+r+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var i=new Set,a={};function l(n,r){c(n,r),c(n+"Capture",r)}function c(n,r){for(a[n]=r,n=0;n<r.length;n++)i.add(r[n])}var d=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),h=Object.prototype.hasOwnProperty,f=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,_={},m={};function g(n){return h.call(m,n)?!0:h.call(_,n)?!1:f.test(n)?m[n]=!0:(_[n]=!0,!1)}function y(n,r,o,u){if(o!==null&&o.type===0)return!1;switch(typeof r){case"function":case"symbol":return!0;case"boolean":return u?!1:o!==null?!o.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function M(n,r,o,u){if(r===null||typeof r>"u"||y(n,r,o,u))return!0;if(u)return!1;if(o!==null)switch(o.type){case 3:return!r;case 4:return r===!1;case 5:return isNaN(r);case 6:return isNaN(r)||1>r}return!1}function T(n,r,o,u,p,v,N){this.acceptsBooleans=r===2||r===3||r===4,this.attributeName=u,this.attributeNamespace=p,this.mustUseProperty=o,this.propertyName=n,this.type=r,this.sanitizeURL=v,this.removeEmptyString=N}var S={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){S[n]=new T(n,0,!1,n,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var r=n[0];S[r]=new T(r,1,!1,n[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(n){S[n]=new T(n,2,!1,n.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){S[n]=new T(n,2,!1,n,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){S[n]=new T(n,3,!1,n.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(n){S[n]=new T(n,3,!0,n,null,!1,!1)}),["capture","download"].forEach(function(n){S[n]=new T(n,4,!1,n,null,!1,!1)}),["cols","rows","size","span"].forEach(function(n){S[n]=new T(n,6,!1,n,null,!1,!1)}),["rowSpan","start"].forEach(function(n){S[n]=new T(n,5,!1,n.toLowerCase(),null,!1,!1)});var x=/[\-:]([a-z])/g;function C(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var r=n.replace(x,C);S[r]=new T(r,1,!1,n,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var r=n.replace(x,C);S[r]=new T(r,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(n){var r=n.replace(x,C);S[r]=new T(r,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(n){S[n]=new T(n,1,!1,n.toLowerCase(),null,!1,!1)}),S.xlinkHref=new T("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(n){S[n]=new T(n,1,!1,n.toLowerCase(),null,!0,!0)});function I(n,r,o,u){var p=S.hasOwnProperty(r)?S[r]:null;(p!==null?p.type!==0:u||!(2<r.length)||r[0]!=="o"&&r[0]!=="O"||r[1]!=="n"&&r[1]!=="N")&&(M(r,o,p,u)&&(o=null),u||p===null?g(r)&&(o===null?n.removeAttribute(r):n.setAttribute(r,""+o)):p.mustUseProperty?n[p.propertyName]=o===null?p.type===3?!1:"":o:(r=p.attributeName,u=p.attributeNamespace,o===null?n.removeAttribute(r):(p=p.type,o=p===3||p===4&&o===!0?"":""+o,u?n.setAttributeNS(u,r,o):n.setAttribute(r,o))))}var w=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,R=Symbol.for("react.element"),P=Symbol.for("react.portal"),U=Symbol.for("react.fragment"),A=Symbol.for("react.strict_mode"),D=Symbol.for("react.profiler"),k=Symbol.for("react.provider"),z=Symbol.for("react.context"),G=Symbol.for("react.forward_ref"),$=Symbol.for("react.suspense"),H=Symbol.for("react.suspense_list"),Q=Symbol.for("react.memo"),he=Symbol.for("react.lazy"),ne=Symbol.for("react.offscreen"),ee=Symbol.iterator;function K(n){return n===null||typeof n!="object"?null:(n=ee&&n[ee]||n["@@iterator"],typeof n=="function"?n:null)}var Z=Object.assign,O;function se(n){if(O===void 0)try{throw Error()}catch(o){var r=o.stack.trim().match(/\n( *(at )?)/);O=r&&r[1]||""}return`
`+O+n}var Se=!1;function Ge(n,r){if(!n||Se)return"";Se=!0;var o=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(r)if(r=function(){throw Error()},Object.defineProperty(r.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(r,[])}catch(ue){var u=ue}Reflect.construct(n,[],r)}else{try{r.call()}catch(ue){u=ue}n.call(r.prototype)}else{try{throw Error()}catch(ue){u=ue}n()}}catch(ue){if(ue&&u&&typeof ue.stack=="string"){for(var p=ue.stack.split(`
`),v=u.stack.split(`
`),N=p.length-1,B=v.length-1;1<=N&&0<=B&&p[N]!==v[B];)B--;for(;1<=N&&0<=B;N--,B--)if(p[N]!==v[B]){if(N!==1||B!==1)do if(N--,B--,0>B||p[N]!==v[B]){var V=`
`+p[N].replace(" at new "," at ");return n.displayName&&V.includes("<anonymous>")&&(V=V.replace("<anonymous>",n.displayName)),V}while(1<=N&&0<=B);break}}}finally{Se=!1,Error.prepareStackTrace=o}return(n=n?n.displayName||n.name:"")?se(n):""}function ze(n){switch(n.tag){case 5:return se(n.type);case 16:return se("Lazy");case 13:return se("Suspense");case 19:return se("SuspenseList");case 0:case 2:case 15:return n=Ge(n.type,!1),n;case 11:return n=Ge(n.type.render,!1),n;case 1:return n=Ge(n.type,!0),n;default:return""}}function Ve(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case U:return"Fragment";case P:return"Portal";case D:return"Profiler";case A:return"StrictMode";case $:return"Suspense";case H:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case z:return(n.displayName||"Context")+".Consumer";case k:return(n._context.displayName||"Context")+".Provider";case G:var r=n.render;return n=n.displayName,n||(n=r.displayName||r.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case Q:return r=n.displayName||null,r!==null?r:Ve(n.type)||"Memo";case he:r=n._payload,n=n._init;try{return Ve(n(r))}catch{}}return null}function ae(n){var r=n.type;switch(n.tag){case 24:return"Cache";case 9:return(r.displayName||"Context")+".Consumer";case 10:return(r._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=r.render,n=n.displayName||n.name||"",r.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return r;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Ve(r);case 8:return r===A?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof r=="function")return r.displayName||r.name||null;if(typeof r=="string")return r}return null}function de(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function Ee(n){var r=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(r==="checkbox"||r==="radio")}function $e(n){var r=Ee(n)?"checked":"value",o=Object.getOwnPropertyDescriptor(n.constructor.prototype,r),u=""+n[r];if(!n.hasOwnProperty(r)&&typeof o<"u"&&typeof o.get=="function"&&typeof o.set=="function"){var p=o.get,v=o.set;return Object.defineProperty(n,r,{configurable:!0,get:function(){return p.call(this)},set:function(N){u=""+N,v.call(this,N)}}),Object.defineProperty(n,r,{enumerable:o.enumerable}),{getValue:function(){return u},setValue:function(N){u=""+N},stopTracking:function(){n._valueTracker=null,delete n[r]}}}}function Oe(n){n._valueTracker||(n._valueTracker=$e(n))}function ft(n){if(!n)return!1;var r=n._valueTracker;if(!r)return!0;var o=r.getValue(),u="";return n&&(u=Ee(n)?n.checked?"true":"false":n.value),n=u,n!==o?(r.setValue(n),!0):!1}function Gt(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function pt(n,r){var o=r.checked;return Z({},r,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:o??n._wrapperState.initialChecked})}function St(n,r){var o=r.defaultValue==null?"":r.defaultValue,u=r.checked!=null?r.checked:r.defaultChecked;o=de(r.value!=null?r.value:o),n._wrapperState={initialChecked:u,initialValue:o,controlled:r.type==="checkbox"||r.type==="radio"?r.checked!=null:r.value!=null}}function Pt(n,r){r=r.checked,r!=null&&I(n,"checked",r,!1)}function gt(n,r){Pt(n,r);var o=de(r.value),u=r.type;if(o!=null)u==="number"?(o===0&&n.value===""||n.value!=o)&&(n.value=""+o):n.value!==""+o&&(n.value=""+o);else if(u==="submit"||u==="reset"){n.removeAttribute("value");return}r.hasOwnProperty("value")?qt(n,r.type,o):r.hasOwnProperty("defaultValue")&&qt(n,r.type,de(r.defaultValue)),r.checked==null&&r.defaultChecked!=null&&(n.defaultChecked=!!r.defaultChecked)}function Ft(n,r,o){if(r.hasOwnProperty("value")||r.hasOwnProperty("defaultValue")){var u=r.type;if(!(u!=="submit"&&u!=="reset"||r.value!==void 0&&r.value!==null))return;r=""+n._wrapperState.initialValue,o||r===n.value||(n.value=r),n.defaultValue=r}o=n.name,o!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,o!==""&&(n.name=o)}function qt(n,r,o){(r!=="number"||Gt(n.ownerDocument)!==n)&&(o==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+o&&(n.defaultValue=""+o))}var Jt=Array.isArray;function xt(n,r,o,u){if(n=n.options,r){r={};for(var p=0;p<o.length;p++)r["$"+o[p]]=!0;for(o=0;o<n.length;o++)p=r.hasOwnProperty("$"+n[o].value),n[o].selected!==p&&(n[o].selected=p),p&&u&&(n[o].defaultSelected=!0)}else{for(o=""+de(o),r=null,p=0;p<n.length;p++){if(n[p].value===o){n[p].selected=!0,u&&(n[p].defaultSelected=!0);return}r!==null||n[p].disabled||(r=n[p])}r!==null&&(r.selected=!0)}}function jt(n,r){if(r.dangerouslySetInnerHTML!=null)throw Error(t(91));return Z({},r,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function q(n,r){var o=r.value;if(o==null){if(o=r.children,r=r.defaultValue,o!=null){if(r!=null)throw Error(t(92));if(Jt(o)){if(1<o.length)throw Error(t(93));o=o[0]}r=o}r==null&&(r=""),o=r}n._wrapperState={initialValue:de(o)}}function pn(n,r){var o=de(r.value),u=de(r.defaultValue);o!=null&&(o=""+o,o!==n.value&&(n.value=o),r.defaultValue==null&&n.defaultValue!==o&&(n.defaultValue=o)),u!=null&&(n.defaultValue=""+u)}function Nt(n){var r=n.textContent;r===n._wrapperState.initialValue&&r!==""&&r!==null&&(n.value=r)}function F(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function b(n,r){return n==null||n==="http://www.w3.org/1999/xhtml"?F(r):n==="http://www.w3.org/2000/svg"&&r==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var J,le=(function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(r,o,u,p){MSApp.execUnsafeLocalFunction(function(){return n(r,o,u,p)})}:n})(function(n,r){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=r;else{for(J=J||document.createElement("div"),J.innerHTML="<svg>"+r.valueOf().toString()+"</svg>",r=J.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;r.firstChild;)n.appendChild(r.firstChild)}});function fe(n,r){if(r){var o=n.firstChild;if(o&&o===n.lastChild&&o.nodeType===3){o.nodeValue=r;return}}n.textContent=r}var we={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Ae=["Webkit","ms","Moz","O"];Object.keys(we).forEach(function(n){Ae.forEach(function(r){r=r+n.charAt(0).toUpperCase()+n.substring(1),we[r]=we[n]})});function pe(n,r,o){return r==null||typeof r=="boolean"||r===""?"":o||typeof r!="number"||r===0||we.hasOwnProperty(n)&&we[n]?(""+r).trim():r+"px"}function _e(n,r){n=n.style;for(var o in r)if(r.hasOwnProperty(o)){var u=o.indexOf("--")===0,p=pe(o,r[o],u);o==="float"&&(o="cssFloat"),u?n.setProperty(o,p):n[o]=p}}var Pe=Z({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Ke(n,r){if(r){if(Pe[n]&&(r.children!=null||r.dangerouslySetInnerHTML!=null))throw Error(t(137,n));if(r.dangerouslySetInnerHTML!=null){if(r.children!=null)throw Error(t(60));if(typeof r.dangerouslySetInnerHTML!="object"||!("__html"in r.dangerouslySetInnerHTML))throw Error(t(61))}if(r.style!=null&&typeof r.style!="object")throw Error(t(62))}}function Ne(n,r){if(n.indexOf("-")===-1)return typeof r.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Te=null;function Ze(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var tt=null,st=null,W=null;function Ce(n){if(n=wo(n)){if(typeof tt!="function")throw Error(t(280));var r=n.stateNode;r&&(r=Ll(r),tt(n.stateNode,n.type,r))}}function ge(n){st?W?W.push(n):W=[n]:st=n}function Re(){if(st){var n=st,r=W;if(W=st=null,Ce(n),r)for(n=0;n<r.length;n++)Ce(r[n])}}function Fe(n,r){return n(r)}function xe(){}var Je=!1;function qe(n,r,o){if(Je)return n(r,o);Je=!0;try{return Fe(n,r,o)}finally{Je=!1,(st!==null||W!==null)&&(xe(),Re())}}function Lt(n,r){var o=n.stateNode;if(o===null)return null;var u=Ll(o);if(u===null)return null;o=u[r];e:switch(r){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(u=!u.disabled)||(n=n.type,u=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!u;break e;default:n=!1}if(n)return null;if(o&&typeof o!="function")throw Error(t(231,r,typeof o));return o}var Ct=!1;if(d)try{var Cn={};Object.defineProperty(Cn,"passive",{get:function(){Ct=!0}}),window.addEventListener("test",Cn,Cn),window.removeEventListener("test",Cn,Cn)}catch{Ct=!1}function gi(n,r,o,u,p,v,N,B,V){var ue=Array.prototype.slice.call(arguments,3);try{r.apply(o,ue)}catch(ye){this.onError(ye)}}var gs=!1,Qs=null,_s=!1,xs=null,yu={onError:function(n){gs=!0,Qs=n}};function pl(n,r,o,u,p,v,N,B,V){gs=!1,Qs=null,gi.apply(yu,arguments)}function ml(n,r,o,u,p,v,N,B,V){if(pl.apply(this,arguments),gs){if(gs){var ue=Qs;gs=!1,Qs=null}else throw Error(t(198));_s||(_s=!0,xs=ue)}}function Gn(n){var r=n,o=n;if(n.alternate)for(;r.return;)r=r.return;else{n=r;do r=n,(r.flags&4098)!==0&&(o=r.return),n=r.return;while(n)}return r.tag===3?o:null}function Js(n){if(n.tag===13){var r=n.memoizedState;if(r===null&&(n=n.alternate,n!==null&&(r=n.memoizedState)),r!==null)return r.dehydrated}return null}function no(n){if(Gn(n)!==n)throw Error(t(188))}function gl(n){var r=n.alternate;if(!r){if(r=Gn(n),r===null)throw Error(t(188));return r!==n?null:n}for(var o=n,u=r;;){var p=o.return;if(p===null)break;var v=p.alternate;if(v===null){if(u=p.return,u!==null){o=u;continue}break}if(p.child===v.child){for(v=p.child;v;){if(v===o)return no(p),n;if(v===u)return no(p),r;v=v.sibling}throw Error(t(188))}if(o.return!==u.return)o=p,u=v;else{for(var N=!1,B=p.child;B;){if(B===o){N=!0,o=p,u=v;break}if(B===u){N=!0,u=p,o=v;break}B=B.sibling}if(!N){for(B=v.child;B;){if(B===o){N=!0,o=v,u=p;break}if(B===u){N=!0,u=v,o=p;break}B=B.sibling}if(!N)throw Error(t(189))}}if(o.alternate!==u)throw Error(t(190))}if(o.tag!==3)throw Error(t(188));return o.stateNode.current===o?n:r}function vs(n){return n=gl(n),n!==null?io(n):null}function io(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var r=io(n);if(r!==null)return r;n=n.sibling}return null}var ys=e.unstable_scheduleCallback,ro=e.unstable_cancelCallback,_l=e.unstable_shouldYield,Su=e.unstable_requestPaint,en=e.unstable_now,Mu=e.unstable_getCurrentPriorityLevel,so=e.unstable_ImmediatePriority,ao=e.unstable_UserBlockingPriority,L=e.unstable_NormalPriority,j=e.unstable_LowPriority,ce=e.unstable_IdlePriority,ie=null,te=null;function Ie(n){if(te&&typeof te.onCommitFiberRoot=="function")try{te.onCommitFiberRoot(ie,n,void 0,(n.current.flags&128)===128)}catch{}}var Le=Math.clz32?Math.clz32:Qe,De=Math.log,je=Math.LN2;function Qe(n){return n>>>=0,n===0?32:31-(De(n)/je|0)|0}var ut=64,_t=4194304;function He(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function bt(n,r){var o=n.pendingLanes;if(o===0)return 0;var u=0,p=n.suspendedLanes,v=n.pingedLanes,N=o&268435455;if(N!==0){var B=N&~p;B!==0?u=He(B):(v&=N,v!==0&&(u=He(v)))}else N=o&~p,N!==0?u=He(N):v!==0&&(u=He(v));if(u===0)return 0;if(r!==0&&r!==u&&(r&p)===0&&(p=u&-u,v=r&-r,p>=v||p===16&&(v&4194240)!==0))return r;if((u&4)!==0&&(u|=o&16),r=n.entangledLanes,r!==0)for(n=n.entanglements,r&=u;0<r;)o=31-Le(r),p=1<<o,u|=n[o],r&=~p;return u}function an(n,r){switch(n){case 1:case 2:case 4:return r+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return r+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Wt(n,r){for(var o=n.suspendedLanes,u=n.pingedLanes,p=n.expirationTimes,v=n.pendingLanes;0<v;){var N=31-Le(v),B=1<<N,V=p[N];V===-1?((B&o)===0||(B&u)!==0)&&(p[N]=an(B,r)):V<=r&&(n.expiredLanes|=B),v&=~B}}function Ot(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function mn(){var n=ut;return ut<<=1,(ut&4194240)===0&&(ut=64),n}function ke(n){for(var r=[],o=0;31>o;o++)r.push(n);return r}function cn(n,r,o){n.pendingLanes|=r,r!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,r=31-Le(r),n[r]=o}function Tt(n,r){var o=n.pendingLanes&~r;n.pendingLanes=r,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=r,n.mutableReadLanes&=r,n.entangledLanes&=r,r=n.entanglements;var u=n.eventTimes;for(n=n.expirationTimes;0<o;){var p=31-Le(o),v=1<<p;r[p]=0,u[p]=-1,n[p]=-1,o&=~v}}function Dn(n,r){var o=n.entangledLanes|=r;for(n=n.entanglements;o;){var u=31-Le(o),p=1<<u;p&r|n[u]&r&&(n[u]|=r),o&=~p}}var vt=0;function Ci(n){return n&=-n,1<n?4<n?(n&268435455)!==0?16:536870912:4:1}var fr,Dt,Zt,Ri,Bt,_i=!1,Pi=[],Ni=null,Or=null,Fr=null,oo=new Map,lo=new Map,kr=[],_x="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function cp(n,r){switch(n){case"focusin":case"focusout":Ni=null;break;case"dragenter":case"dragleave":Or=null;break;case"mouseover":case"mouseout":Fr=null;break;case"pointerover":case"pointerout":oo.delete(r.pointerId);break;case"gotpointercapture":case"lostpointercapture":lo.delete(r.pointerId)}}function co(n,r,o,u,p,v){return n===null||n.nativeEvent!==v?(n={blockedOn:r,domEventName:o,eventSystemFlags:u,nativeEvent:v,targetContainers:[p]},r!==null&&(r=wo(r),r!==null&&Dt(r)),n):(n.eventSystemFlags|=u,r=n.targetContainers,p!==null&&r.indexOf(p)===-1&&r.push(p),n)}function xx(n,r,o,u,p){switch(r){case"focusin":return Ni=co(Ni,n,r,o,u,p),!0;case"dragenter":return Or=co(Or,n,r,o,u,p),!0;case"mouseover":return Fr=co(Fr,n,r,o,u,p),!0;case"pointerover":var v=p.pointerId;return oo.set(v,co(oo.get(v)||null,n,r,o,u,p)),!0;case"gotpointercapture":return v=p.pointerId,lo.set(v,co(lo.get(v)||null,n,r,o,u,p)),!0}return!1}function up(n){var r=Ss(n.target);if(r!==null){var o=Gn(r);if(o!==null){if(r=o.tag,r===13){if(r=Js(o),r!==null){n.blockedOn=r,Bt(n.priority,function(){Zt(o)});return}}else if(r===3&&o.stateNode.current.memoizedState.isDehydrated){n.blockedOn=o.tag===3?o.stateNode.containerInfo:null;return}}}n.blockedOn=null}function xl(n){if(n.blockedOn!==null)return!1;for(var r=n.targetContainers;0<r.length;){var o=wu(n.domEventName,n.eventSystemFlags,r[0],n.nativeEvent);if(o===null){o=n.nativeEvent;var u=new o.constructor(o.type,o);Te=u,o.target.dispatchEvent(u),Te=null}else return r=wo(o),r!==null&&Dt(r),n.blockedOn=o,!1;r.shift()}return!0}function dp(n,r,o){xl(n)&&o.delete(r)}function vx(){_i=!1,Ni!==null&&xl(Ni)&&(Ni=null),Or!==null&&xl(Or)&&(Or=null),Fr!==null&&xl(Fr)&&(Fr=null),oo.forEach(dp),lo.forEach(dp)}function uo(n,r){n.blockedOn===r&&(n.blockedOn=null,_i||(_i=!0,e.unstable_scheduleCallback(e.unstable_NormalPriority,vx)))}function ho(n){function r(p){return uo(p,n)}if(0<Pi.length){uo(Pi[0],n);for(var o=1;o<Pi.length;o++){var u=Pi[o];u.blockedOn===n&&(u.blockedOn=null)}}for(Ni!==null&&uo(Ni,n),Or!==null&&uo(Or,n),Fr!==null&&uo(Fr,n),oo.forEach(r),lo.forEach(r),o=0;o<kr.length;o++)u=kr[o],u.blockedOn===n&&(u.blockedOn=null);for(;0<kr.length&&(o=kr[0],o.blockedOn===null);)up(o),o.blockedOn===null&&kr.shift()}var ea=w.ReactCurrentBatchConfig,vl=!0;function yx(n,r,o,u){var p=vt,v=ea.transition;ea.transition=null;try{vt=1,Eu(n,r,o,u)}finally{vt=p,ea.transition=v}}function Sx(n,r,o,u){var p=vt,v=ea.transition;ea.transition=null;try{vt=4,Eu(n,r,o,u)}finally{vt=p,ea.transition=v}}function Eu(n,r,o,u){if(vl){var p=wu(n,r,o,u);if(p===null)Hu(n,r,u,yl,o),cp(n,u);else if(xx(p,n,r,o,u))u.stopPropagation();else if(cp(n,u),r&4&&-1<_x.indexOf(n)){for(;p!==null;){var v=wo(p);if(v!==null&&fr(v),v=wu(n,r,o,u),v===null&&Hu(n,r,u,yl,o),v===p)break;p=v}p!==null&&u.stopPropagation()}else Hu(n,r,u,null,o)}}var yl=null;function wu(n,r,o,u){if(yl=null,n=Ze(u),n=Ss(n),n!==null)if(r=Gn(n),r===null)n=null;else if(o=r.tag,o===13){if(n=Js(r),n!==null)return n;n=null}else if(o===3){if(r.stateNode.current.memoizedState.isDehydrated)return r.tag===3?r.stateNode.containerInfo:null;n=null}else r!==n&&(n=null);return yl=n,null}function hp(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Mu()){case so:return 1;case ao:return 4;case L:case j:return 16;case ce:return 536870912;default:return 16}default:return 16}}var Br=null,bu=null,Sl=null;function fp(){if(Sl)return Sl;var n,r=bu,o=r.length,u,p="value"in Br?Br.value:Br.textContent,v=p.length;for(n=0;n<o&&r[n]===p[n];n++);var N=o-n;for(u=1;u<=N&&r[o-u]===p[v-u];u++);return Sl=p.slice(n,1<u?1-u:void 0)}function Ml(n){var r=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&r===13&&(n=13)):n=r,n===10&&(n=13),32<=n||n===13?n:0}function El(){return!0}function pp(){return!1}function oi(n){function r(o,u,p,v,N){this._reactName=o,this._targetInst=p,this.type=u,this.nativeEvent=v,this.target=N,this.currentTarget=null;for(var B in n)n.hasOwnProperty(B)&&(o=n[B],this[B]=o?o(v):v[B]);return this.isDefaultPrevented=(v.defaultPrevented!=null?v.defaultPrevented:v.returnValue===!1)?El:pp,this.isPropagationStopped=pp,this}return Z(r.prototype,{preventDefault:function(){this.defaultPrevented=!0;var o=this.nativeEvent;o&&(o.preventDefault?o.preventDefault():typeof o.returnValue!="unknown"&&(o.returnValue=!1),this.isDefaultPrevented=El)},stopPropagation:function(){var o=this.nativeEvent;o&&(o.stopPropagation?o.stopPropagation():typeof o.cancelBubble!="unknown"&&(o.cancelBubble=!0),this.isPropagationStopped=El)},persist:function(){},isPersistent:El}),r}var ta={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Tu=oi(ta),fo=Z({},ta,{view:0,detail:0}),Mx=oi(fo),Au,Cu,po,wl=Z({},fo,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Pu,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==po&&(po&&n.type==="mousemove"?(Au=n.screenX-po.screenX,Cu=n.screenY-po.screenY):Cu=Au=0,po=n),Au)},movementY:function(n){return"movementY"in n?n.movementY:Cu}}),mp=oi(wl),Ex=Z({},wl,{dataTransfer:0}),wx=oi(Ex),bx=Z({},fo,{relatedTarget:0}),Ru=oi(bx),Tx=Z({},ta,{animationName:0,elapsedTime:0,pseudoElement:0}),Ax=oi(Tx),Cx=Z({},ta,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),Rx=oi(Cx),Px=Z({},ta,{data:0}),gp=oi(Px),Nx={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Lx={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Dx={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Ix(n){var r=this.nativeEvent;return r.getModifierState?r.getModifierState(n):(n=Dx[n])?!!r[n]:!1}function Pu(){return Ix}var Ux=Z({},fo,{key:function(n){if(n.key){var r=Nx[n.key]||n.key;if(r!=="Unidentified")return r}return n.type==="keypress"?(n=Ml(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?Lx[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Pu,charCode:function(n){return n.type==="keypress"?Ml(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?Ml(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),Ox=oi(Ux),Fx=Z({},wl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),_p=oi(Fx),kx=Z({},fo,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Pu}),Bx=oi(kx),zx=Z({},ta,{propertyName:0,elapsedTime:0,pseudoElement:0}),Hx=oi(zx),Vx=Z({},wl,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),Gx=oi(Vx),Wx=[9,13,27,32],Nu=d&&"CompositionEvent"in window,mo=null;d&&"documentMode"in document&&(mo=document.documentMode);var jx=d&&"TextEvent"in window&&!mo,xp=d&&(!Nu||mo&&8<mo&&11>=mo),vp=" ",yp=!1;function Sp(n,r){switch(n){case"keyup":return Wx.indexOf(r.keyCode)!==-1;case"keydown":return r.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Mp(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var na=!1;function Xx(n,r){switch(n){case"compositionend":return Mp(r);case"keypress":return r.which!==32?null:(yp=!0,vp);case"textInput":return n=r.data,n===vp&&yp?null:n;default:return null}}function qx(n,r){if(na)return n==="compositionend"||!Nu&&Sp(n,r)?(n=fp(),Sl=bu=Br=null,na=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(r.ctrlKey||r.altKey||r.metaKey)||r.ctrlKey&&r.altKey){if(r.char&&1<r.char.length)return r.char;if(r.which)return String.fromCharCode(r.which)}return null;case"compositionend":return xp&&r.locale!=="ko"?null:r.data;default:return null}}var Yx={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Ep(n){var r=n&&n.nodeName&&n.nodeName.toLowerCase();return r==="input"?!!Yx[n.type]:r==="textarea"}function wp(n,r,o,u){ge(u),r=Rl(r,"onChange"),0<r.length&&(o=new Tu("onChange","change",null,o,u),n.push({event:o,listeners:r}))}var go=null,_o=null;function $x(n){Vp(n,0)}function bl(n){var r=oa(n);if(ft(r))return n}function Kx(n,r){if(n==="change")return r}var bp=!1;if(d){var Lu;if(d){var Du="oninput"in document;if(!Du){var Tp=document.createElement("div");Tp.setAttribute("oninput","return;"),Du=typeof Tp.oninput=="function"}Lu=Du}else Lu=!1;bp=Lu&&(!document.documentMode||9<document.documentMode)}function Ap(){go&&(go.detachEvent("onpropertychange",Cp),_o=go=null)}function Cp(n){if(n.propertyName==="value"&&bl(_o)){var r=[];wp(r,_o,n,Ze(n)),qe($x,r)}}function Zx(n,r,o){n==="focusin"?(Ap(),go=r,_o=o,go.attachEvent("onpropertychange",Cp)):n==="focusout"&&Ap()}function Qx(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return bl(_o)}function Jx(n,r){if(n==="click")return bl(r)}function ev(n,r){if(n==="input"||n==="change")return bl(r)}function tv(n,r){return n===r&&(n!==0||1/n===1/r)||n!==n&&r!==r}var Li=typeof Object.is=="function"?Object.is:tv;function xo(n,r){if(Li(n,r))return!0;if(typeof n!="object"||n===null||typeof r!="object"||r===null)return!1;var o=Object.keys(n),u=Object.keys(r);if(o.length!==u.length)return!1;for(u=0;u<o.length;u++){var p=o[u];if(!h.call(r,p)||!Li(n[p],r[p]))return!1}return!0}function Rp(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function Pp(n,r){var o=Rp(n);n=0;for(var u;o;){if(o.nodeType===3){if(u=n+o.textContent.length,n<=r&&u>=r)return{node:o,offset:r-n};n=u}e:{for(;o;){if(o.nextSibling){o=o.nextSibling;break e}o=o.parentNode}o=void 0}o=Rp(o)}}function Np(n,r){return n&&r?n===r?!0:n&&n.nodeType===3?!1:r&&r.nodeType===3?Np(n,r.parentNode):"contains"in n?n.contains(r):n.compareDocumentPosition?!!(n.compareDocumentPosition(r)&16):!1:!1}function Lp(){for(var n=window,r=Gt();r instanceof n.HTMLIFrameElement;){try{var o=typeof r.contentWindow.location.href=="string"}catch{o=!1}if(o)n=r.contentWindow;else break;r=Gt(n.document)}return r}function Iu(n){var r=n&&n.nodeName&&n.nodeName.toLowerCase();return r&&(r==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||r==="textarea"||n.contentEditable==="true")}function nv(n){var r=Lp(),o=n.focusedElem,u=n.selectionRange;if(r!==o&&o&&o.ownerDocument&&Np(o.ownerDocument.documentElement,o)){if(u!==null&&Iu(o)){if(r=u.start,n=u.end,n===void 0&&(n=r),"selectionStart"in o)o.selectionStart=r,o.selectionEnd=Math.min(n,o.value.length);else if(n=(r=o.ownerDocument||document)&&r.defaultView||window,n.getSelection){n=n.getSelection();var p=o.textContent.length,v=Math.min(u.start,p);u=u.end===void 0?v:Math.min(u.end,p),!n.extend&&v>u&&(p=u,u=v,v=p),p=Pp(o,v);var N=Pp(o,u);p&&N&&(n.rangeCount!==1||n.anchorNode!==p.node||n.anchorOffset!==p.offset||n.focusNode!==N.node||n.focusOffset!==N.offset)&&(r=r.createRange(),r.setStart(p.node,p.offset),n.removeAllRanges(),v>u?(n.addRange(r),n.extend(N.node,N.offset)):(r.setEnd(N.node,N.offset),n.addRange(r)))}}for(r=[],n=o;n=n.parentNode;)n.nodeType===1&&r.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof o.focus=="function"&&o.focus(),o=0;o<r.length;o++)n=r[o],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var iv=d&&"documentMode"in document&&11>=document.documentMode,ia=null,Uu=null,vo=null,Ou=!1;function Dp(n,r,o){var u=o.window===o?o.document:o.nodeType===9?o:o.ownerDocument;Ou||ia==null||ia!==Gt(u)||(u=ia,"selectionStart"in u&&Iu(u)?u={start:u.selectionStart,end:u.selectionEnd}:(u=(u.ownerDocument&&u.ownerDocument.defaultView||window).getSelection(),u={anchorNode:u.anchorNode,anchorOffset:u.anchorOffset,focusNode:u.focusNode,focusOffset:u.focusOffset}),vo&&xo(vo,u)||(vo=u,u=Rl(Uu,"onSelect"),0<u.length&&(r=new Tu("onSelect","select",null,r,o),n.push({event:r,listeners:u}),r.target=ia)))}function Tl(n,r){var o={};return o[n.toLowerCase()]=r.toLowerCase(),o["Webkit"+n]="webkit"+r,o["Moz"+n]="moz"+r,o}var ra={animationend:Tl("Animation","AnimationEnd"),animationiteration:Tl("Animation","AnimationIteration"),animationstart:Tl("Animation","AnimationStart"),transitionend:Tl("Transition","TransitionEnd")},Fu={},Ip={};d&&(Ip=document.createElement("div").style,"AnimationEvent"in window||(delete ra.animationend.animation,delete ra.animationiteration.animation,delete ra.animationstart.animation),"TransitionEvent"in window||delete ra.transitionend.transition);function Al(n){if(Fu[n])return Fu[n];if(!ra[n])return n;var r=ra[n],o;for(o in r)if(r.hasOwnProperty(o)&&o in Ip)return Fu[n]=r[o];return n}var Up=Al("animationend"),Op=Al("animationiteration"),Fp=Al("animationstart"),kp=Al("transitionend"),Bp=new Map,zp="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function zr(n,r){Bp.set(n,r),l(r,[n])}for(var ku=0;ku<zp.length;ku++){var Bu=zp[ku],rv=Bu.toLowerCase(),sv=Bu[0].toUpperCase()+Bu.slice(1);zr(rv,"on"+sv)}zr(Up,"onAnimationEnd"),zr(Op,"onAnimationIteration"),zr(Fp,"onAnimationStart"),zr("dblclick","onDoubleClick"),zr("focusin","onFocus"),zr("focusout","onBlur"),zr(kp,"onTransitionEnd"),c("onMouseEnter",["mouseout","mouseover"]),c("onMouseLeave",["mouseout","mouseover"]),c("onPointerEnter",["pointerout","pointerover"]),c("onPointerLeave",["pointerout","pointerover"]),l("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),l("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),l("onBeforeInput",["compositionend","keypress","textInput","paste"]),l("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var yo="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),av=new Set("cancel close invalid load scroll toggle".split(" ").concat(yo));function Hp(n,r,o){var u=n.type||"unknown-event";n.currentTarget=o,ml(u,r,void 0,n),n.currentTarget=null}function Vp(n,r){r=(r&4)!==0;for(var o=0;o<n.length;o++){var u=n[o],p=u.event;u=u.listeners;e:{var v=void 0;if(r)for(var N=u.length-1;0<=N;N--){var B=u[N],V=B.instance,ue=B.currentTarget;if(B=B.listener,V!==v&&p.isPropagationStopped())break e;Hp(p,B,ue),v=V}else for(N=0;N<u.length;N++){if(B=u[N],V=B.instance,ue=B.currentTarget,B=B.listener,V!==v&&p.isPropagationStopped())break e;Hp(p,B,ue),v=V}}}if(_s)throw n=xs,_s=!1,xs=null,n}function Yt(n,r){var o=r[qu];o===void 0&&(o=r[qu]=new Set);var u=n+"__bubble";o.has(u)||(Gp(r,n,2,!1),o.add(u))}function zu(n,r,o){var u=0;r&&(u|=4),Gp(o,n,u,r)}var Cl="_reactListening"+Math.random().toString(36).slice(2);function So(n){if(!n[Cl]){n[Cl]=!0,i.forEach(function(o){o!=="selectionchange"&&(av.has(o)||zu(o,!1,n),zu(o,!0,n))});var r=n.nodeType===9?n:n.ownerDocument;r===null||r[Cl]||(r[Cl]=!0,zu("selectionchange",!1,r))}}function Gp(n,r,o,u){switch(hp(r)){case 1:var p=yx;break;case 4:p=Sx;break;default:p=Eu}o=p.bind(null,r,o,n),p=void 0,!Ct||r!=="touchstart"&&r!=="touchmove"&&r!=="wheel"||(p=!0),u?p!==void 0?n.addEventListener(r,o,{capture:!0,passive:p}):n.addEventListener(r,o,!0):p!==void 0?n.addEventListener(r,o,{passive:p}):n.addEventListener(r,o,!1)}function Hu(n,r,o,u,p){var v=u;if((r&1)===0&&(r&2)===0&&u!==null)e:for(;;){if(u===null)return;var N=u.tag;if(N===3||N===4){var B=u.stateNode.containerInfo;if(B===p||B.nodeType===8&&B.parentNode===p)break;if(N===4)for(N=u.return;N!==null;){var V=N.tag;if((V===3||V===4)&&(V=N.stateNode.containerInfo,V===p||V.nodeType===8&&V.parentNode===p))return;N=N.return}for(;B!==null;){if(N=Ss(B),N===null)return;if(V=N.tag,V===5||V===6){u=v=N;continue e}B=B.parentNode}}u=u.return}qe(function(){var ue=v,ye=Ze(o),Me=[];e:{var ve=Bp.get(n);if(ve!==void 0){var Be=Tu,Xe=n;switch(n){case"keypress":if(Ml(o)===0)break e;case"keydown":case"keyup":Be=Ox;break;case"focusin":Xe="focus",Be=Ru;break;case"focusout":Xe="blur",Be=Ru;break;case"beforeblur":case"afterblur":Be=Ru;break;case"click":if(o.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":Be=mp;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":Be=wx;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":Be=Bx;break;case Up:case Op:case Fp:Be=Ax;break;case kp:Be=Hx;break;case"scroll":Be=Mx;break;case"wheel":Be=Gx;break;case"copy":case"cut":case"paste":Be=Rx;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":Be=_p}var Ye=(r&4)!==0,un=!Ye&&n==="scroll",re=Ye?ve!==null?ve+"Capture":null:ve;Ye=[];for(var Y=ue,oe;Y!==null;){oe=Y;var be=oe.stateNode;if(oe.tag===5&&be!==null&&(oe=be,re!==null&&(be=Lt(Y,re),be!=null&&Ye.push(Mo(Y,be,oe)))),un)break;Y=Y.return}0<Ye.length&&(ve=new Be(ve,Xe,null,o,ye),Me.push({event:ve,listeners:Ye}))}}if((r&7)===0){e:{if(ve=n==="mouseover"||n==="pointerover",Be=n==="mouseout"||n==="pointerout",ve&&o!==Te&&(Xe=o.relatedTarget||o.fromElement)&&(Ss(Xe)||Xe[pr]))break e;if((Be||ve)&&(ve=ye.window===ye?ye:(ve=ye.ownerDocument)?ve.defaultView||ve.parentWindow:window,Be?(Xe=o.relatedTarget||o.toElement,Be=ue,Xe=Xe?Ss(Xe):null,Xe!==null&&(un=Gn(Xe),Xe!==un||Xe.tag!==5&&Xe.tag!==6)&&(Xe=null)):(Be=null,Xe=ue),Be!==Xe)){if(Ye=mp,be="onMouseLeave",re="onMouseEnter",Y="mouse",(n==="pointerout"||n==="pointerover")&&(Ye=_p,be="onPointerLeave",re="onPointerEnter",Y="pointer"),un=Be==null?ve:oa(Be),oe=Xe==null?ve:oa(Xe),ve=new Ye(be,Y+"leave",Be,o,ye),ve.target=un,ve.relatedTarget=oe,be=null,Ss(ye)===ue&&(Ye=new Ye(re,Y+"enter",Xe,o,ye),Ye.target=oe,Ye.relatedTarget=un,be=Ye),un=be,Be&&Xe)t:{for(Ye=Be,re=Xe,Y=0,oe=Ye;oe;oe=sa(oe))Y++;for(oe=0,be=re;be;be=sa(be))oe++;for(;0<Y-oe;)Ye=sa(Ye),Y--;for(;0<oe-Y;)re=sa(re),oe--;for(;Y--;){if(Ye===re||re!==null&&Ye===re.alternate)break t;Ye=sa(Ye),re=sa(re)}Ye=null}else Ye=null;Be!==null&&Wp(Me,ve,Be,Ye,!1),Xe!==null&&un!==null&&Wp(Me,un,Xe,Ye,!0)}}e:{if(ve=ue?oa(ue):window,Be=ve.nodeName&&ve.nodeName.toLowerCase(),Be==="select"||Be==="input"&&ve.type==="file")var et=Kx;else if(Ep(ve))if(bp)et=ev;else{et=Qx;var it=Zx}else(Be=ve.nodeName)&&Be.toLowerCase()==="input"&&(ve.type==="checkbox"||ve.type==="radio")&&(et=Jx);if(et&&(et=et(n,ue))){wp(Me,et,o,ye);break e}it&&it(n,ve,ue),n==="focusout"&&(it=ve._wrapperState)&&it.controlled&&ve.type==="number"&&qt(ve,"number",ve.value)}switch(it=ue?oa(ue):window,n){case"focusin":(Ep(it)||it.contentEditable==="true")&&(ia=it,Uu=ue,vo=null);break;case"focusout":vo=Uu=ia=null;break;case"mousedown":Ou=!0;break;case"contextmenu":case"mouseup":case"dragend":Ou=!1,Dp(Me,o,ye);break;case"selectionchange":if(iv)break;case"keydown":case"keyup":Dp(Me,o,ye)}var rt;if(Nu)e:{switch(n){case"compositionstart":var ct="onCompositionStart";break e;case"compositionend":ct="onCompositionEnd";break e;case"compositionupdate":ct="onCompositionUpdate";break e}ct=void 0}else na?Sp(n,o)&&(ct="onCompositionEnd"):n==="keydown"&&o.keyCode===229&&(ct="onCompositionStart");ct&&(xp&&o.locale!=="ko"&&(na||ct!=="onCompositionStart"?ct==="onCompositionEnd"&&na&&(rt=fp()):(Br=ye,bu="value"in Br?Br.value:Br.textContent,na=!0)),it=Rl(ue,ct),0<it.length&&(ct=new gp(ct,n,null,o,ye),Me.push({event:ct,listeners:it}),rt?ct.data=rt:(rt=Mp(o),rt!==null&&(ct.data=rt)))),(rt=jx?Xx(n,o):qx(n,o))&&(ue=Rl(ue,"onBeforeInput"),0<ue.length&&(ye=new gp("onBeforeInput","beforeinput",null,o,ye),Me.push({event:ye,listeners:ue}),ye.data=rt))}Vp(Me,r)})}function Mo(n,r,o){return{instance:n,listener:r,currentTarget:o}}function Rl(n,r){for(var o=r+"Capture",u=[];n!==null;){var p=n,v=p.stateNode;p.tag===5&&v!==null&&(p=v,v=Lt(n,o),v!=null&&u.unshift(Mo(n,v,p)),v=Lt(n,r),v!=null&&u.push(Mo(n,v,p))),n=n.return}return u}function sa(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function Wp(n,r,o,u,p){for(var v=r._reactName,N=[];o!==null&&o!==u;){var B=o,V=B.alternate,ue=B.stateNode;if(V!==null&&V===u)break;B.tag===5&&ue!==null&&(B=ue,p?(V=Lt(o,v),V!=null&&N.unshift(Mo(o,V,B))):p||(V=Lt(o,v),V!=null&&N.push(Mo(o,V,B)))),o=o.return}N.length!==0&&n.push({event:r,listeners:N})}var ov=/\r\n?/g,lv=/\u0000|\uFFFD/g;function jp(n){return(typeof n=="string"?n:""+n).replace(ov,`
`).replace(lv,"")}function Pl(n,r,o){if(r=jp(r),jp(n)!==r&&o)throw Error(t(425))}function Nl(){}var Vu=null,Gu=null;function Wu(n,r){return n==="textarea"||n==="noscript"||typeof r.children=="string"||typeof r.children=="number"||typeof r.dangerouslySetInnerHTML=="object"&&r.dangerouslySetInnerHTML!==null&&r.dangerouslySetInnerHTML.__html!=null}var ju=typeof setTimeout=="function"?setTimeout:void 0,cv=typeof clearTimeout=="function"?clearTimeout:void 0,Xp=typeof Promise=="function"?Promise:void 0,uv=typeof queueMicrotask=="function"?queueMicrotask:typeof Xp<"u"?function(n){return Xp.resolve(null).then(n).catch(dv)}:ju;function dv(n){setTimeout(function(){throw n})}function Xu(n,r){var o=r,u=0;do{var p=o.nextSibling;if(n.removeChild(o),p&&p.nodeType===8)if(o=p.data,o==="/$"){if(u===0){n.removeChild(p),ho(r);return}u--}else o!=="$"&&o!=="$?"&&o!=="$!"||u++;o=p}while(o);ho(r)}function Hr(n){for(;n!=null;n=n.nextSibling){var r=n.nodeType;if(r===1||r===3)break;if(r===8){if(r=n.data,r==="$"||r==="$!"||r==="$?")break;if(r==="/$")return null}}return n}function qp(n){n=n.previousSibling;for(var r=0;n;){if(n.nodeType===8){var o=n.data;if(o==="$"||o==="$!"||o==="$?"){if(r===0)return n;r--}else o==="/$"&&r++}n=n.previousSibling}return null}var aa=Math.random().toString(36).slice(2),Ki="__reactFiber$"+aa,Eo="__reactProps$"+aa,pr="__reactContainer$"+aa,qu="__reactEvents$"+aa,hv="__reactListeners$"+aa,fv="__reactHandles$"+aa;function Ss(n){var r=n[Ki];if(r)return r;for(var o=n.parentNode;o;){if(r=o[pr]||o[Ki]){if(o=r.alternate,r.child!==null||o!==null&&o.child!==null)for(n=qp(n);n!==null;){if(o=n[Ki])return o;n=qp(n)}return r}n=o,o=n.parentNode}return null}function wo(n){return n=n[Ki]||n[pr],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function oa(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(t(33))}function Ll(n){return n[Eo]||null}var Yu=[],la=-1;function Vr(n){return{current:n}}function $t(n){0>la||(n.current=Yu[la],Yu[la]=null,la--)}function Xt(n,r){la++,Yu[la]=n.current,n.current=r}var Gr={},In=Vr(Gr),Zn=Vr(!1),Ms=Gr;function ca(n,r){var o=n.type.contextTypes;if(!o)return Gr;var u=n.stateNode;if(u&&u.__reactInternalMemoizedUnmaskedChildContext===r)return u.__reactInternalMemoizedMaskedChildContext;var p={},v;for(v in o)p[v]=r[v];return u&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=r,n.__reactInternalMemoizedMaskedChildContext=p),p}function Qn(n){return n=n.childContextTypes,n!=null}function Dl(){$t(Zn),$t(In)}function Yp(n,r,o){if(In.current!==Gr)throw Error(t(168));Xt(In,r),Xt(Zn,o)}function $p(n,r,o){var u=n.stateNode;if(r=r.childContextTypes,typeof u.getChildContext!="function")return o;u=u.getChildContext();for(var p in u)if(!(p in r))throw Error(t(108,ae(n)||"Unknown",p));return Z({},o,u)}function Il(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||Gr,Ms=In.current,Xt(In,n),Xt(Zn,Zn.current),!0}function Kp(n,r,o){var u=n.stateNode;if(!u)throw Error(t(169));o?(n=$p(n,r,Ms),u.__reactInternalMemoizedMergedChildContext=n,$t(Zn),$t(In),Xt(In,n)):$t(Zn),Xt(Zn,o)}var mr=null,Ul=!1,$u=!1;function Zp(n){mr===null?mr=[n]:mr.push(n)}function pv(n){Ul=!0,Zp(n)}function Wr(){if(!$u&&mr!==null){$u=!0;var n=0,r=vt;try{var o=mr;for(vt=1;n<o.length;n++){var u=o[n];do u=u(!0);while(u!==null)}mr=null,Ul=!1}catch(p){throw mr!==null&&(mr=mr.slice(n+1)),ys(so,Wr),p}finally{vt=r,$u=!1}}return null}var ua=[],da=0,Ol=null,Fl=0,xi=[],vi=0,Es=null,gr=1,_r="";function ws(n,r){ua[da++]=Fl,ua[da++]=Ol,Ol=n,Fl=r}function Qp(n,r,o){xi[vi++]=gr,xi[vi++]=_r,xi[vi++]=Es,Es=n;var u=gr;n=_r;var p=32-Le(u)-1;u&=~(1<<p),o+=1;var v=32-Le(r)+p;if(30<v){var N=p-p%5;v=(u&(1<<N)-1).toString(32),u>>=N,p-=N,gr=1<<32-Le(r)+p|o<<p|u,_r=v+n}else gr=1<<v|o<<p|u,_r=n}function Ku(n){n.return!==null&&(ws(n,1),Qp(n,1,0))}function Zu(n){for(;n===Ol;)Ol=ua[--da],ua[da]=null,Fl=ua[--da],ua[da]=null;for(;n===Es;)Es=xi[--vi],xi[vi]=null,_r=xi[--vi],xi[vi]=null,gr=xi[--vi],xi[vi]=null}var li=null,ci=null,Qt=!1,Di=null;function Jp(n,r){var o=Ei(5,null,null,0);o.elementType="DELETED",o.stateNode=r,o.return=n,r=n.deletions,r===null?(n.deletions=[o],n.flags|=16):r.push(o)}function em(n,r){switch(n.tag){case 5:var o=n.type;return r=r.nodeType!==1||o.toLowerCase()!==r.nodeName.toLowerCase()?null:r,r!==null?(n.stateNode=r,li=n,ci=Hr(r.firstChild),!0):!1;case 6:return r=n.pendingProps===""||r.nodeType!==3?null:r,r!==null?(n.stateNode=r,li=n,ci=null,!0):!1;case 13:return r=r.nodeType!==8?null:r,r!==null?(o=Es!==null?{id:gr,overflow:_r}:null,n.memoizedState={dehydrated:r,treeContext:o,retryLane:1073741824},o=Ei(18,null,null,0),o.stateNode=r,o.return=n,n.child=o,li=n,ci=null,!0):!1;default:return!1}}function Qu(n){return(n.mode&1)!==0&&(n.flags&128)===0}function Ju(n){if(Qt){var r=ci;if(r){var o=r;if(!em(n,r)){if(Qu(n))throw Error(t(418));r=Hr(o.nextSibling);var u=li;r&&em(n,r)?Jp(u,o):(n.flags=n.flags&-4097|2,Qt=!1,li=n)}}else{if(Qu(n))throw Error(t(418));n.flags=n.flags&-4097|2,Qt=!1,li=n}}}function tm(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;li=n}function kl(n){if(n!==li)return!1;if(!Qt)return tm(n),Qt=!0,!1;var r;if((r=n.tag!==3)&&!(r=n.tag!==5)&&(r=n.type,r=r!=="head"&&r!=="body"&&!Wu(n.type,n.memoizedProps)),r&&(r=ci)){if(Qu(n))throw nm(),Error(t(418));for(;r;)Jp(n,r),r=Hr(r.nextSibling)}if(tm(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(t(317));e:{for(n=n.nextSibling,r=0;n;){if(n.nodeType===8){var o=n.data;if(o==="/$"){if(r===0){ci=Hr(n.nextSibling);break e}r--}else o!=="$"&&o!=="$!"&&o!=="$?"||r++}n=n.nextSibling}ci=null}}else ci=li?Hr(n.stateNode.nextSibling):null;return!0}function nm(){for(var n=ci;n;)n=Hr(n.nextSibling)}function ha(){ci=li=null,Qt=!1}function ed(n){Di===null?Di=[n]:Di.push(n)}var mv=w.ReactCurrentBatchConfig;function bo(n,r,o){if(n=o.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(o._owner){if(o=o._owner,o){if(o.tag!==1)throw Error(t(309));var u=o.stateNode}if(!u)throw Error(t(147,n));var p=u,v=""+n;return r!==null&&r.ref!==null&&typeof r.ref=="function"&&r.ref._stringRef===v?r.ref:(r=function(N){var B=p.refs;N===null?delete B[v]:B[v]=N},r._stringRef=v,r)}if(typeof n!="string")throw Error(t(284));if(!o._owner)throw Error(t(290,n))}return n}function Bl(n,r){throw n=Object.prototype.toString.call(r),Error(t(31,n==="[object Object]"?"object with keys {"+Object.keys(r).join(", ")+"}":n))}function im(n){var r=n._init;return r(n._payload)}function rm(n){function r(re,Y){if(n){var oe=re.deletions;oe===null?(re.deletions=[Y],re.flags|=16):oe.push(Y)}}function o(re,Y){if(!n)return null;for(;Y!==null;)r(re,Y),Y=Y.sibling;return null}function u(re,Y){for(re=new Map;Y!==null;)Y.key!==null?re.set(Y.key,Y):re.set(Y.index,Y),Y=Y.sibling;return re}function p(re,Y){return re=Qr(re,Y),re.index=0,re.sibling=null,re}function v(re,Y,oe){return re.index=oe,n?(oe=re.alternate,oe!==null?(oe=oe.index,oe<Y?(re.flags|=2,Y):oe):(re.flags|=2,Y)):(re.flags|=1048576,Y)}function N(re){return n&&re.alternate===null&&(re.flags|=2),re}function B(re,Y,oe,be){return Y===null||Y.tag!==6?(Y=jd(oe,re.mode,be),Y.return=re,Y):(Y=p(Y,oe),Y.return=re,Y)}function V(re,Y,oe,be){var et=oe.type;return et===U?ye(re,Y,oe.props.children,be,oe.key):Y!==null&&(Y.elementType===et||typeof et=="object"&&et!==null&&et.$$typeof===he&&im(et)===Y.type)?(be=p(Y,oe.props),be.ref=bo(re,Y,oe),be.return=re,be):(be=cc(oe.type,oe.key,oe.props,null,re.mode,be),be.ref=bo(re,Y,oe),be.return=re,be)}function ue(re,Y,oe,be){return Y===null||Y.tag!==4||Y.stateNode.containerInfo!==oe.containerInfo||Y.stateNode.implementation!==oe.implementation?(Y=Xd(oe,re.mode,be),Y.return=re,Y):(Y=p(Y,oe.children||[]),Y.return=re,Y)}function ye(re,Y,oe,be,et){return Y===null||Y.tag!==7?(Y=Ls(oe,re.mode,be,et),Y.return=re,Y):(Y=p(Y,oe),Y.return=re,Y)}function Me(re,Y,oe){if(typeof Y=="string"&&Y!==""||typeof Y=="number")return Y=jd(""+Y,re.mode,oe),Y.return=re,Y;if(typeof Y=="object"&&Y!==null){switch(Y.$$typeof){case R:return oe=cc(Y.type,Y.key,Y.props,null,re.mode,oe),oe.ref=bo(re,null,Y),oe.return=re,oe;case P:return Y=Xd(Y,re.mode,oe),Y.return=re,Y;case he:var be=Y._init;return Me(re,be(Y._payload),oe)}if(Jt(Y)||K(Y))return Y=Ls(Y,re.mode,oe,null),Y.return=re,Y;Bl(re,Y)}return null}function ve(re,Y,oe,be){var et=Y!==null?Y.key:null;if(typeof oe=="string"&&oe!==""||typeof oe=="number")return et!==null?null:B(re,Y,""+oe,be);if(typeof oe=="object"&&oe!==null){switch(oe.$$typeof){case R:return oe.key===et?V(re,Y,oe,be):null;case P:return oe.key===et?ue(re,Y,oe,be):null;case he:return et=oe._init,ve(re,Y,et(oe._payload),be)}if(Jt(oe)||K(oe))return et!==null?null:ye(re,Y,oe,be,null);Bl(re,oe)}return null}function Be(re,Y,oe,be,et){if(typeof be=="string"&&be!==""||typeof be=="number")return re=re.get(oe)||null,B(Y,re,""+be,et);if(typeof be=="object"&&be!==null){switch(be.$$typeof){case R:return re=re.get(be.key===null?oe:be.key)||null,V(Y,re,be,et);case P:return re=re.get(be.key===null?oe:be.key)||null,ue(Y,re,be,et);case he:var it=be._init;return Be(re,Y,oe,it(be._payload),et)}if(Jt(be)||K(be))return re=re.get(oe)||null,ye(Y,re,be,et,null);Bl(Y,be)}return null}function Xe(re,Y,oe,be){for(var et=null,it=null,rt=Y,ct=Y=0,Tn=null;rt!==null&&ct<oe.length;ct++){rt.index>ct?(Tn=rt,rt=null):Tn=rt.sibling;var It=ve(re,rt,oe[ct],be);if(It===null){rt===null&&(rt=Tn);break}n&&rt&&It.alternate===null&&r(re,rt),Y=v(It,Y,ct),it===null?et=It:it.sibling=It,it=It,rt=Tn}if(ct===oe.length)return o(re,rt),Qt&&ws(re,ct),et;if(rt===null){for(;ct<oe.length;ct++)rt=Me(re,oe[ct],be),rt!==null&&(Y=v(rt,Y,ct),it===null?et=rt:it.sibling=rt,it=rt);return Qt&&ws(re,ct),et}for(rt=u(re,rt);ct<oe.length;ct++)Tn=Be(rt,re,ct,oe[ct],be),Tn!==null&&(n&&Tn.alternate!==null&&rt.delete(Tn.key===null?ct:Tn.key),Y=v(Tn,Y,ct),it===null?et=Tn:it.sibling=Tn,it=Tn);return n&&rt.forEach(function(Jr){return r(re,Jr)}),Qt&&ws(re,ct),et}function Ye(re,Y,oe,be){var et=K(oe);if(typeof et!="function")throw Error(t(150));if(oe=et.call(oe),oe==null)throw Error(t(151));for(var it=et=null,rt=Y,ct=Y=0,Tn=null,It=oe.next();rt!==null&&!It.done;ct++,It=oe.next()){rt.index>ct?(Tn=rt,rt=null):Tn=rt.sibling;var Jr=ve(re,rt,It.value,be);if(Jr===null){rt===null&&(rt=Tn);break}n&&rt&&Jr.alternate===null&&r(re,rt),Y=v(Jr,Y,ct),it===null?et=Jr:it.sibling=Jr,it=Jr,rt=Tn}if(It.done)return o(re,rt),Qt&&ws(re,ct),et;if(rt===null){for(;!It.done;ct++,It=oe.next())It=Me(re,It.value,be),It!==null&&(Y=v(It,Y,ct),it===null?et=It:it.sibling=It,it=It);return Qt&&ws(re,ct),et}for(rt=u(re,rt);!It.done;ct++,It=oe.next())It=Be(rt,re,ct,It.value,be),It!==null&&(n&&It.alternate!==null&&rt.delete(It.key===null?ct:It.key),Y=v(It,Y,ct),it===null?et=It:it.sibling=It,it=It);return n&&rt.forEach(function(Yv){return r(re,Yv)}),Qt&&ws(re,ct),et}function un(re,Y,oe,be){if(typeof oe=="object"&&oe!==null&&oe.type===U&&oe.key===null&&(oe=oe.props.children),typeof oe=="object"&&oe!==null){switch(oe.$$typeof){case R:e:{for(var et=oe.key,it=Y;it!==null;){if(it.key===et){if(et=oe.type,et===U){if(it.tag===7){o(re,it.sibling),Y=p(it,oe.props.children),Y.return=re,re=Y;break e}}else if(it.elementType===et||typeof et=="object"&&et!==null&&et.$$typeof===he&&im(et)===it.type){o(re,it.sibling),Y=p(it,oe.props),Y.ref=bo(re,it,oe),Y.return=re,re=Y;break e}o(re,it);break}else r(re,it);it=it.sibling}oe.type===U?(Y=Ls(oe.props.children,re.mode,be,oe.key),Y.return=re,re=Y):(be=cc(oe.type,oe.key,oe.props,null,re.mode,be),be.ref=bo(re,Y,oe),be.return=re,re=be)}return N(re);case P:e:{for(it=oe.key;Y!==null;){if(Y.key===it)if(Y.tag===4&&Y.stateNode.containerInfo===oe.containerInfo&&Y.stateNode.implementation===oe.implementation){o(re,Y.sibling),Y=p(Y,oe.children||[]),Y.return=re,re=Y;break e}else{o(re,Y);break}else r(re,Y);Y=Y.sibling}Y=Xd(oe,re.mode,be),Y.return=re,re=Y}return N(re);case he:return it=oe._init,un(re,Y,it(oe._payload),be)}if(Jt(oe))return Xe(re,Y,oe,be);if(K(oe))return Ye(re,Y,oe,be);Bl(re,oe)}return typeof oe=="string"&&oe!==""||typeof oe=="number"?(oe=""+oe,Y!==null&&Y.tag===6?(o(re,Y.sibling),Y=p(Y,oe),Y.return=re,re=Y):(o(re,Y),Y=jd(oe,re.mode,be),Y.return=re,re=Y),N(re)):o(re,Y)}return un}var fa=rm(!0),sm=rm(!1),zl=Vr(null),Hl=null,pa=null,td=null;function nd(){td=pa=Hl=null}function id(n){var r=zl.current;$t(zl),n._currentValue=r}function rd(n,r,o){for(;n!==null;){var u=n.alternate;if((n.childLanes&r)!==r?(n.childLanes|=r,u!==null&&(u.childLanes|=r)):u!==null&&(u.childLanes&r)!==r&&(u.childLanes|=r),n===o)break;n=n.return}}function ma(n,r){Hl=n,td=pa=null,n=n.dependencies,n!==null&&n.firstContext!==null&&((n.lanes&r)!==0&&(Jn=!0),n.firstContext=null)}function yi(n){var r=n._currentValue;if(td!==n)if(n={context:n,memoizedValue:r,next:null},pa===null){if(Hl===null)throw Error(t(308));pa=n,Hl.dependencies={lanes:0,firstContext:n}}else pa=pa.next=n;return r}var bs=null;function sd(n){bs===null?bs=[n]:bs.push(n)}function am(n,r,o,u){var p=r.interleaved;return p===null?(o.next=o,sd(r)):(o.next=p.next,p.next=o),r.interleaved=o,xr(n,u)}function xr(n,r){n.lanes|=r;var o=n.alternate;for(o!==null&&(o.lanes|=r),o=n,n=n.return;n!==null;)n.childLanes|=r,o=n.alternate,o!==null&&(o.childLanes|=r),o=n,n=n.return;return o.tag===3?o.stateNode:null}var jr=!1;function ad(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function om(n,r){n=n.updateQueue,r.updateQueue===n&&(r.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function vr(n,r){return{eventTime:n,lane:r,tag:0,payload:null,callback:null,next:null}}function Xr(n,r,o){var u=n.updateQueue;if(u===null)return null;if(u=u.shared,(Rt&2)!==0){var p=u.pending;return p===null?r.next=r:(r.next=p.next,p.next=r),u.pending=r,xr(n,o)}return p=u.interleaved,p===null?(r.next=r,sd(u)):(r.next=p.next,p.next=r),u.interleaved=r,xr(n,o)}function Vl(n,r,o){if(r=r.updateQueue,r!==null&&(r=r.shared,(o&4194240)!==0)){var u=r.lanes;u&=n.pendingLanes,o|=u,r.lanes=o,Dn(n,o)}}function lm(n,r){var o=n.updateQueue,u=n.alternate;if(u!==null&&(u=u.updateQueue,o===u)){var p=null,v=null;if(o=o.firstBaseUpdate,o!==null){do{var N={eventTime:o.eventTime,lane:o.lane,tag:o.tag,payload:o.payload,callback:o.callback,next:null};v===null?p=v=N:v=v.next=N,o=o.next}while(o!==null);v===null?p=v=r:v=v.next=r}else p=v=r;o={baseState:u.baseState,firstBaseUpdate:p,lastBaseUpdate:v,shared:u.shared,effects:u.effects},n.updateQueue=o;return}n=o.lastBaseUpdate,n===null?o.firstBaseUpdate=r:n.next=r,o.lastBaseUpdate=r}function Gl(n,r,o,u){var p=n.updateQueue;jr=!1;var v=p.firstBaseUpdate,N=p.lastBaseUpdate,B=p.shared.pending;if(B!==null){p.shared.pending=null;var V=B,ue=V.next;V.next=null,N===null?v=ue:N.next=ue,N=V;var ye=n.alternate;ye!==null&&(ye=ye.updateQueue,B=ye.lastBaseUpdate,B!==N&&(B===null?ye.firstBaseUpdate=ue:B.next=ue,ye.lastBaseUpdate=V))}if(v!==null){var Me=p.baseState;N=0,ye=ue=V=null,B=v;do{var ve=B.lane,Be=B.eventTime;if((u&ve)===ve){ye!==null&&(ye=ye.next={eventTime:Be,lane:0,tag:B.tag,payload:B.payload,callback:B.callback,next:null});e:{var Xe=n,Ye=B;switch(ve=r,Be=o,Ye.tag){case 1:if(Xe=Ye.payload,typeof Xe=="function"){Me=Xe.call(Be,Me,ve);break e}Me=Xe;break e;case 3:Xe.flags=Xe.flags&-65537|128;case 0:if(Xe=Ye.payload,ve=typeof Xe=="function"?Xe.call(Be,Me,ve):Xe,ve==null)break e;Me=Z({},Me,ve);break e;case 2:jr=!0}}B.callback!==null&&B.lane!==0&&(n.flags|=64,ve=p.effects,ve===null?p.effects=[B]:ve.push(B))}else Be={eventTime:Be,lane:ve,tag:B.tag,payload:B.payload,callback:B.callback,next:null},ye===null?(ue=ye=Be,V=Me):ye=ye.next=Be,N|=ve;if(B=B.next,B===null){if(B=p.shared.pending,B===null)break;ve=B,B=ve.next,ve.next=null,p.lastBaseUpdate=ve,p.shared.pending=null}}while(!0);if(ye===null&&(V=Me),p.baseState=V,p.firstBaseUpdate=ue,p.lastBaseUpdate=ye,r=p.shared.interleaved,r!==null){p=r;do N|=p.lane,p=p.next;while(p!==r)}else v===null&&(p.shared.lanes=0);Cs|=N,n.lanes=N,n.memoizedState=Me}}function cm(n,r,o){if(n=r.effects,r.effects=null,n!==null)for(r=0;r<n.length;r++){var u=n[r],p=u.callback;if(p!==null){if(u.callback=null,u=o,typeof p!="function")throw Error(t(191,p));p.call(u)}}}var To={},Zi=Vr(To),Ao=Vr(To),Co=Vr(To);function Ts(n){if(n===To)throw Error(t(174));return n}function od(n,r){switch(Xt(Co,r),Xt(Ao,n),Xt(Zi,To),n=r.nodeType,n){case 9:case 11:r=(r=r.documentElement)?r.namespaceURI:b(null,"");break;default:n=n===8?r.parentNode:r,r=n.namespaceURI||null,n=n.tagName,r=b(r,n)}$t(Zi),Xt(Zi,r)}function ga(){$t(Zi),$t(Ao),$t(Co)}function um(n){Ts(Co.current);var r=Ts(Zi.current),o=b(r,n.type);r!==o&&(Xt(Ao,n),Xt(Zi,o))}function ld(n){Ao.current===n&&($t(Zi),$t(Ao))}var tn=Vr(0);function Wl(n){for(var r=n;r!==null;){if(r.tag===13){var o=r.memoizedState;if(o!==null&&(o=o.dehydrated,o===null||o.data==="$?"||o.data==="$!"))return r}else if(r.tag===19&&r.memoizedProps.revealOrder!==void 0){if((r.flags&128)!==0)return r}else if(r.child!==null){r.child.return=r,r=r.child;continue}if(r===n)break;for(;r.sibling===null;){if(r.return===null||r.return===n)return null;r=r.return}r.sibling.return=r.return,r=r.sibling}return null}var cd=[];function ud(){for(var n=0;n<cd.length;n++)cd[n]._workInProgressVersionPrimary=null;cd.length=0}var jl=w.ReactCurrentDispatcher,dd=w.ReactCurrentBatchConfig,As=0,nn=null,gn=null,wn=null,Xl=!1,Ro=!1,Po=0,gv=0;function Un(){throw Error(t(321))}function hd(n,r){if(r===null)return!1;for(var o=0;o<r.length&&o<n.length;o++)if(!Li(n[o],r[o]))return!1;return!0}function fd(n,r,o,u,p,v){if(As=v,nn=r,r.memoizedState=null,r.updateQueue=null,r.lanes=0,jl.current=n===null||n.memoizedState===null?yv:Sv,n=o(u,p),Ro){v=0;do{if(Ro=!1,Po=0,25<=v)throw Error(t(301));v+=1,wn=gn=null,r.updateQueue=null,jl.current=Mv,n=o(u,p)}while(Ro)}if(jl.current=$l,r=gn!==null&&gn.next!==null,As=0,wn=gn=nn=null,Xl=!1,r)throw Error(t(300));return n}function pd(){var n=Po!==0;return Po=0,n}function Qi(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return wn===null?nn.memoizedState=wn=n:wn=wn.next=n,wn}function Si(){if(gn===null){var n=nn.alternate;n=n!==null?n.memoizedState:null}else n=gn.next;var r=wn===null?nn.memoizedState:wn.next;if(r!==null)wn=r,gn=n;else{if(n===null)throw Error(t(310));gn=n,n={memoizedState:gn.memoizedState,baseState:gn.baseState,baseQueue:gn.baseQueue,queue:gn.queue,next:null},wn===null?nn.memoizedState=wn=n:wn=wn.next=n}return wn}function No(n,r){return typeof r=="function"?r(n):r}function md(n){var r=Si(),o=r.queue;if(o===null)throw Error(t(311));o.lastRenderedReducer=n;var u=gn,p=u.baseQueue,v=o.pending;if(v!==null){if(p!==null){var N=p.next;p.next=v.next,v.next=N}u.baseQueue=p=v,o.pending=null}if(p!==null){v=p.next,u=u.baseState;var B=N=null,V=null,ue=v;do{var ye=ue.lane;if((As&ye)===ye)V!==null&&(V=V.next={lane:0,action:ue.action,hasEagerState:ue.hasEagerState,eagerState:ue.eagerState,next:null}),u=ue.hasEagerState?ue.eagerState:n(u,ue.action);else{var Me={lane:ye,action:ue.action,hasEagerState:ue.hasEagerState,eagerState:ue.eagerState,next:null};V===null?(B=V=Me,N=u):V=V.next=Me,nn.lanes|=ye,Cs|=ye}ue=ue.next}while(ue!==null&&ue!==v);V===null?N=u:V.next=B,Li(u,r.memoizedState)||(Jn=!0),r.memoizedState=u,r.baseState=N,r.baseQueue=V,o.lastRenderedState=u}if(n=o.interleaved,n!==null){p=n;do v=p.lane,nn.lanes|=v,Cs|=v,p=p.next;while(p!==n)}else p===null&&(o.lanes=0);return[r.memoizedState,o.dispatch]}function gd(n){var r=Si(),o=r.queue;if(o===null)throw Error(t(311));o.lastRenderedReducer=n;var u=o.dispatch,p=o.pending,v=r.memoizedState;if(p!==null){o.pending=null;var N=p=p.next;do v=n(v,N.action),N=N.next;while(N!==p);Li(v,r.memoizedState)||(Jn=!0),r.memoizedState=v,r.baseQueue===null&&(r.baseState=v),o.lastRenderedState=v}return[v,u]}function dm(){}function hm(n,r){var o=nn,u=Si(),p=r(),v=!Li(u.memoizedState,p);if(v&&(u.memoizedState=p,Jn=!0),u=u.queue,_d(mm.bind(null,o,u,n),[n]),u.getSnapshot!==r||v||wn!==null&&wn.memoizedState.tag&1){if(o.flags|=2048,Lo(9,pm.bind(null,o,u,p,r),void 0,null),bn===null)throw Error(t(349));(As&30)!==0||fm(o,r,p)}return p}function fm(n,r,o){n.flags|=16384,n={getSnapshot:r,value:o},r=nn.updateQueue,r===null?(r={lastEffect:null,stores:null},nn.updateQueue=r,r.stores=[n]):(o=r.stores,o===null?r.stores=[n]:o.push(n))}function pm(n,r,o,u){r.value=o,r.getSnapshot=u,gm(r)&&_m(n)}function mm(n,r,o){return o(function(){gm(r)&&_m(n)})}function gm(n){var r=n.getSnapshot;n=n.value;try{var o=r();return!Li(n,o)}catch{return!0}}function _m(n){var r=xr(n,1);r!==null&&Fi(r,n,1,-1)}function xm(n){var r=Qi();return typeof n=="function"&&(n=n()),r.memoizedState=r.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:No,lastRenderedState:n},r.queue=n,n=n.dispatch=vv.bind(null,nn,n),[r.memoizedState,n]}function Lo(n,r,o,u){return n={tag:n,create:r,destroy:o,deps:u,next:null},r=nn.updateQueue,r===null?(r={lastEffect:null,stores:null},nn.updateQueue=r,r.lastEffect=n.next=n):(o=r.lastEffect,o===null?r.lastEffect=n.next=n:(u=o.next,o.next=n,n.next=u,r.lastEffect=n)),n}function vm(){return Si().memoizedState}function ql(n,r,o,u){var p=Qi();nn.flags|=n,p.memoizedState=Lo(1|r,o,void 0,u===void 0?null:u)}function Yl(n,r,o,u){var p=Si();u=u===void 0?null:u;var v=void 0;if(gn!==null){var N=gn.memoizedState;if(v=N.destroy,u!==null&&hd(u,N.deps)){p.memoizedState=Lo(r,o,v,u);return}}nn.flags|=n,p.memoizedState=Lo(1|r,o,v,u)}function ym(n,r){return ql(8390656,8,n,r)}function _d(n,r){return Yl(2048,8,n,r)}function Sm(n,r){return Yl(4,2,n,r)}function Mm(n,r){return Yl(4,4,n,r)}function Em(n,r){if(typeof r=="function")return n=n(),r(n),function(){r(null)};if(r!=null)return n=n(),r.current=n,function(){r.current=null}}function wm(n,r,o){return o=o!=null?o.concat([n]):null,Yl(4,4,Em.bind(null,r,n),o)}function xd(){}function bm(n,r){var o=Si();r=r===void 0?null:r;var u=o.memoizedState;return u!==null&&r!==null&&hd(r,u[1])?u[0]:(o.memoizedState=[n,r],n)}function Tm(n,r){var o=Si();r=r===void 0?null:r;var u=o.memoizedState;return u!==null&&r!==null&&hd(r,u[1])?u[0]:(n=n(),o.memoizedState=[n,r],n)}function Am(n,r,o){return(As&21)===0?(n.baseState&&(n.baseState=!1,Jn=!0),n.memoizedState=o):(Li(o,r)||(o=mn(),nn.lanes|=o,Cs|=o,n.baseState=!0),r)}function _v(n,r){var o=vt;vt=o!==0&&4>o?o:4,n(!0);var u=dd.transition;dd.transition={};try{n(!1),r()}finally{vt=o,dd.transition=u}}function Cm(){return Si().memoizedState}function xv(n,r,o){var u=Kr(n);if(o={lane:u,action:o,hasEagerState:!1,eagerState:null,next:null},Rm(n))Pm(r,o);else if(o=am(n,r,o,u),o!==null){var p=jn();Fi(o,n,u,p),Nm(o,r,u)}}function vv(n,r,o){var u=Kr(n),p={lane:u,action:o,hasEagerState:!1,eagerState:null,next:null};if(Rm(n))Pm(r,p);else{var v=n.alternate;if(n.lanes===0&&(v===null||v.lanes===0)&&(v=r.lastRenderedReducer,v!==null))try{var N=r.lastRenderedState,B=v(N,o);if(p.hasEagerState=!0,p.eagerState=B,Li(B,N)){var V=r.interleaved;V===null?(p.next=p,sd(r)):(p.next=V.next,V.next=p),r.interleaved=p;return}}catch{}finally{}o=am(n,r,p,u),o!==null&&(p=jn(),Fi(o,n,u,p),Nm(o,r,u))}}function Rm(n){var r=n.alternate;return n===nn||r!==null&&r===nn}function Pm(n,r){Ro=Xl=!0;var o=n.pending;o===null?r.next=r:(r.next=o.next,o.next=r),n.pending=r}function Nm(n,r,o){if((o&4194240)!==0){var u=r.lanes;u&=n.pendingLanes,o|=u,r.lanes=o,Dn(n,o)}}var $l={readContext:yi,useCallback:Un,useContext:Un,useEffect:Un,useImperativeHandle:Un,useInsertionEffect:Un,useLayoutEffect:Un,useMemo:Un,useReducer:Un,useRef:Un,useState:Un,useDebugValue:Un,useDeferredValue:Un,useTransition:Un,useMutableSource:Un,useSyncExternalStore:Un,useId:Un,unstable_isNewReconciler:!1},yv={readContext:yi,useCallback:function(n,r){return Qi().memoizedState=[n,r===void 0?null:r],n},useContext:yi,useEffect:ym,useImperativeHandle:function(n,r,o){return o=o!=null?o.concat([n]):null,ql(4194308,4,Em.bind(null,r,n),o)},useLayoutEffect:function(n,r){return ql(4194308,4,n,r)},useInsertionEffect:function(n,r){return ql(4,2,n,r)},useMemo:function(n,r){var o=Qi();return r=r===void 0?null:r,n=n(),o.memoizedState=[n,r],n},useReducer:function(n,r,o){var u=Qi();return r=o!==void 0?o(r):r,u.memoizedState=u.baseState=r,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:r},u.queue=n,n=n.dispatch=xv.bind(null,nn,n),[u.memoizedState,n]},useRef:function(n){var r=Qi();return n={current:n},r.memoizedState=n},useState:xm,useDebugValue:xd,useDeferredValue:function(n){return Qi().memoizedState=n},useTransition:function(){var n=xm(!1),r=n[0];return n=_v.bind(null,n[1]),Qi().memoizedState=n,[r,n]},useMutableSource:function(){},useSyncExternalStore:function(n,r,o){var u=nn,p=Qi();if(Qt){if(o===void 0)throw Error(t(407));o=o()}else{if(o=r(),bn===null)throw Error(t(349));(As&30)!==0||fm(u,r,o)}p.memoizedState=o;var v={value:o,getSnapshot:r};return p.queue=v,ym(mm.bind(null,u,v,n),[n]),u.flags|=2048,Lo(9,pm.bind(null,u,v,o,r),void 0,null),o},useId:function(){var n=Qi(),r=bn.identifierPrefix;if(Qt){var o=_r,u=gr;o=(u&~(1<<32-Le(u)-1)).toString(32)+o,r=":"+r+"R"+o,o=Po++,0<o&&(r+="H"+o.toString(32)),r+=":"}else o=gv++,r=":"+r+"r"+o.toString(32)+":";return n.memoizedState=r},unstable_isNewReconciler:!1},Sv={readContext:yi,useCallback:bm,useContext:yi,useEffect:_d,useImperativeHandle:wm,useInsertionEffect:Sm,useLayoutEffect:Mm,useMemo:Tm,useReducer:md,useRef:vm,useState:function(){return md(No)},useDebugValue:xd,useDeferredValue:function(n){var r=Si();return Am(r,gn.memoizedState,n)},useTransition:function(){var n=md(No)[0],r=Si().memoizedState;return[n,r]},useMutableSource:dm,useSyncExternalStore:hm,useId:Cm,unstable_isNewReconciler:!1},Mv={readContext:yi,useCallback:bm,useContext:yi,useEffect:_d,useImperativeHandle:wm,useInsertionEffect:Sm,useLayoutEffect:Mm,useMemo:Tm,useReducer:gd,useRef:vm,useState:function(){return gd(No)},useDebugValue:xd,useDeferredValue:function(n){var r=Si();return gn===null?r.memoizedState=n:Am(r,gn.memoizedState,n)},useTransition:function(){var n=gd(No)[0],r=Si().memoizedState;return[n,r]},useMutableSource:dm,useSyncExternalStore:hm,useId:Cm,unstable_isNewReconciler:!1};function Ii(n,r){if(n&&n.defaultProps){r=Z({},r),n=n.defaultProps;for(var o in n)r[o]===void 0&&(r[o]=n[o]);return r}return r}function vd(n,r,o,u){r=n.memoizedState,o=o(u,r),o=o==null?r:Z({},r,o),n.memoizedState=o,n.lanes===0&&(n.updateQueue.baseState=o)}var Kl={isMounted:function(n){return(n=n._reactInternals)?Gn(n)===n:!1},enqueueSetState:function(n,r,o){n=n._reactInternals;var u=jn(),p=Kr(n),v=vr(u,p);v.payload=r,o!=null&&(v.callback=o),r=Xr(n,v,p),r!==null&&(Fi(r,n,p,u),Vl(r,n,p))},enqueueReplaceState:function(n,r,o){n=n._reactInternals;var u=jn(),p=Kr(n),v=vr(u,p);v.tag=1,v.payload=r,o!=null&&(v.callback=o),r=Xr(n,v,p),r!==null&&(Fi(r,n,p,u),Vl(r,n,p))},enqueueForceUpdate:function(n,r){n=n._reactInternals;var o=jn(),u=Kr(n),p=vr(o,u);p.tag=2,r!=null&&(p.callback=r),r=Xr(n,p,u),r!==null&&(Fi(r,n,u,o),Vl(r,n,u))}};function Lm(n,r,o,u,p,v,N){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(u,v,N):r.prototype&&r.prototype.isPureReactComponent?!xo(o,u)||!xo(p,v):!0}function Dm(n,r,o){var u=!1,p=Gr,v=r.contextType;return typeof v=="object"&&v!==null?v=yi(v):(p=Qn(r)?Ms:In.current,u=r.contextTypes,v=(u=u!=null)?ca(n,p):Gr),r=new r(o,v),n.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,r.updater=Kl,n.stateNode=r,r._reactInternals=n,u&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=p,n.__reactInternalMemoizedMaskedChildContext=v),r}function Im(n,r,o,u){n=r.state,typeof r.componentWillReceiveProps=="function"&&r.componentWillReceiveProps(o,u),typeof r.UNSAFE_componentWillReceiveProps=="function"&&r.UNSAFE_componentWillReceiveProps(o,u),r.state!==n&&Kl.enqueueReplaceState(r,r.state,null)}function yd(n,r,o,u){var p=n.stateNode;p.props=o,p.state=n.memoizedState,p.refs={},ad(n);var v=r.contextType;typeof v=="object"&&v!==null?p.context=yi(v):(v=Qn(r)?Ms:In.current,p.context=ca(n,v)),p.state=n.memoizedState,v=r.getDerivedStateFromProps,typeof v=="function"&&(vd(n,r,v,o),p.state=n.memoizedState),typeof r.getDerivedStateFromProps=="function"||typeof p.getSnapshotBeforeUpdate=="function"||typeof p.UNSAFE_componentWillMount!="function"&&typeof p.componentWillMount!="function"||(r=p.state,typeof p.componentWillMount=="function"&&p.componentWillMount(),typeof p.UNSAFE_componentWillMount=="function"&&p.UNSAFE_componentWillMount(),r!==p.state&&Kl.enqueueReplaceState(p,p.state,null),Gl(n,o,p,u),p.state=n.memoizedState),typeof p.componentDidMount=="function"&&(n.flags|=4194308)}function _a(n,r){try{var o="",u=r;do o+=ze(u),u=u.return;while(u);var p=o}catch(v){p=`
Error generating stack: `+v.message+`
`+v.stack}return{value:n,source:r,stack:p,digest:null}}function Sd(n,r,o){return{value:n,source:null,stack:o??null,digest:r??null}}function Md(n,r){try{console.error(r.value)}catch(o){setTimeout(function(){throw o})}}var Ev=typeof WeakMap=="function"?WeakMap:Map;function Um(n,r,o){o=vr(-1,o),o.tag=3,o.payload={element:null};var u=r.value;return o.callback=function(){ic||(ic=!0,Fd=u),Md(n,r)},o}function Om(n,r,o){o=vr(-1,o),o.tag=3;var u=n.type.getDerivedStateFromError;if(typeof u=="function"){var p=r.value;o.payload=function(){return u(p)},o.callback=function(){Md(n,r)}}var v=n.stateNode;return v!==null&&typeof v.componentDidCatch=="function"&&(o.callback=function(){Md(n,r),typeof u!="function"&&(Yr===null?Yr=new Set([this]):Yr.add(this));var N=r.stack;this.componentDidCatch(r.value,{componentStack:N!==null?N:""})}),o}function Fm(n,r,o){var u=n.pingCache;if(u===null){u=n.pingCache=new Ev;var p=new Set;u.set(r,p)}else p=u.get(r),p===void 0&&(p=new Set,u.set(r,p));p.has(o)||(p.add(o),n=Fv.bind(null,n,r,o),r.then(n,n))}function km(n){do{var r;if((r=n.tag===13)&&(r=n.memoizedState,r=r!==null?r.dehydrated!==null:!0),r)return n;n=n.return}while(n!==null);return null}function Bm(n,r,o,u,p){return(n.mode&1)===0?(n===r?n.flags|=65536:(n.flags|=128,o.flags|=131072,o.flags&=-52805,o.tag===1&&(o.alternate===null?o.tag=17:(r=vr(-1,1),r.tag=2,Xr(o,r,1))),o.lanes|=1),n):(n.flags|=65536,n.lanes=p,n)}var wv=w.ReactCurrentOwner,Jn=!1;function Wn(n,r,o,u){r.child=n===null?sm(r,null,o,u):fa(r,n.child,o,u)}function zm(n,r,o,u,p){o=o.render;var v=r.ref;return ma(r,p),u=fd(n,r,o,u,v,p),o=pd(),n!==null&&!Jn?(r.updateQueue=n.updateQueue,r.flags&=-2053,n.lanes&=~p,yr(n,r,p)):(Qt&&o&&Ku(r),r.flags|=1,Wn(n,r,u,p),r.child)}function Hm(n,r,o,u,p){if(n===null){var v=o.type;return typeof v=="function"&&!Wd(v)&&v.defaultProps===void 0&&o.compare===null&&o.defaultProps===void 0?(r.tag=15,r.type=v,Vm(n,r,v,u,p)):(n=cc(o.type,null,u,r,r.mode,p),n.ref=r.ref,n.return=r,r.child=n)}if(v=n.child,(n.lanes&p)===0){var N=v.memoizedProps;if(o=o.compare,o=o!==null?o:xo,o(N,u)&&n.ref===r.ref)return yr(n,r,p)}return r.flags|=1,n=Qr(v,u),n.ref=r.ref,n.return=r,r.child=n}function Vm(n,r,o,u,p){if(n!==null){var v=n.memoizedProps;if(xo(v,u)&&n.ref===r.ref)if(Jn=!1,r.pendingProps=u=v,(n.lanes&p)!==0)(n.flags&131072)!==0&&(Jn=!0);else return r.lanes=n.lanes,yr(n,r,p)}return Ed(n,r,o,u,p)}function Gm(n,r,o){var u=r.pendingProps,p=u.children,v=n!==null?n.memoizedState:null;if(u.mode==="hidden")if((r.mode&1)===0)r.memoizedState={baseLanes:0,cachePool:null,transitions:null},Xt(va,ui),ui|=o;else{if((o&1073741824)===0)return n=v!==null?v.baseLanes|o:o,r.lanes=r.childLanes=1073741824,r.memoizedState={baseLanes:n,cachePool:null,transitions:null},r.updateQueue=null,Xt(va,ui),ui|=n,null;r.memoizedState={baseLanes:0,cachePool:null,transitions:null},u=v!==null?v.baseLanes:o,Xt(va,ui),ui|=u}else v!==null?(u=v.baseLanes|o,r.memoizedState=null):u=o,Xt(va,ui),ui|=u;return Wn(n,r,p,o),r.child}function Wm(n,r){var o=r.ref;(n===null&&o!==null||n!==null&&n.ref!==o)&&(r.flags|=512,r.flags|=2097152)}function Ed(n,r,o,u,p){var v=Qn(o)?Ms:In.current;return v=ca(r,v),ma(r,p),o=fd(n,r,o,u,v,p),u=pd(),n!==null&&!Jn?(r.updateQueue=n.updateQueue,r.flags&=-2053,n.lanes&=~p,yr(n,r,p)):(Qt&&u&&Ku(r),r.flags|=1,Wn(n,r,o,p),r.child)}function jm(n,r,o,u,p){if(Qn(o)){var v=!0;Il(r)}else v=!1;if(ma(r,p),r.stateNode===null)Ql(n,r),Dm(r,o,u),yd(r,o,u,p),u=!0;else if(n===null){var N=r.stateNode,B=r.memoizedProps;N.props=B;var V=N.context,ue=o.contextType;typeof ue=="object"&&ue!==null?ue=yi(ue):(ue=Qn(o)?Ms:In.current,ue=ca(r,ue));var ye=o.getDerivedStateFromProps,Me=typeof ye=="function"||typeof N.getSnapshotBeforeUpdate=="function";Me||typeof N.UNSAFE_componentWillReceiveProps!="function"&&typeof N.componentWillReceiveProps!="function"||(B!==u||V!==ue)&&Im(r,N,u,ue),jr=!1;var ve=r.memoizedState;N.state=ve,Gl(r,u,N,p),V=r.memoizedState,B!==u||ve!==V||Zn.current||jr?(typeof ye=="function"&&(vd(r,o,ye,u),V=r.memoizedState),(B=jr||Lm(r,o,B,u,ve,V,ue))?(Me||typeof N.UNSAFE_componentWillMount!="function"&&typeof N.componentWillMount!="function"||(typeof N.componentWillMount=="function"&&N.componentWillMount(),typeof N.UNSAFE_componentWillMount=="function"&&N.UNSAFE_componentWillMount()),typeof N.componentDidMount=="function"&&(r.flags|=4194308)):(typeof N.componentDidMount=="function"&&(r.flags|=4194308),r.memoizedProps=u,r.memoizedState=V),N.props=u,N.state=V,N.context=ue,u=B):(typeof N.componentDidMount=="function"&&(r.flags|=4194308),u=!1)}else{N=r.stateNode,om(n,r),B=r.memoizedProps,ue=r.type===r.elementType?B:Ii(r.type,B),N.props=ue,Me=r.pendingProps,ve=N.context,V=o.contextType,typeof V=="object"&&V!==null?V=yi(V):(V=Qn(o)?Ms:In.current,V=ca(r,V));var Be=o.getDerivedStateFromProps;(ye=typeof Be=="function"||typeof N.getSnapshotBeforeUpdate=="function")||typeof N.UNSAFE_componentWillReceiveProps!="function"&&typeof N.componentWillReceiveProps!="function"||(B!==Me||ve!==V)&&Im(r,N,u,V),jr=!1,ve=r.memoizedState,N.state=ve,Gl(r,u,N,p);var Xe=r.memoizedState;B!==Me||ve!==Xe||Zn.current||jr?(typeof Be=="function"&&(vd(r,o,Be,u),Xe=r.memoizedState),(ue=jr||Lm(r,o,ue,u,ve,Xe,V)||!1)?(ye||typeof N.UNSAFE_componentWillUpdate!="function"&&typeof N.componentWillUpdate!="function"||(typeof N.componentWillUpdate=="function"&&N.componentWillUpdate(u,Xe,V),typeof N.UNSAFE_componentWillUpdate=="function"&&N.UNSAFE_componentWillUpdate(u,Xe,V)),typeof N.componentDidUpdate=="function"&&(r.flags|=4),typeof N.getSnapshotBeforeUpdate=="function"&&(r.flags|=1024)):(typeof N.componentDidUpdate!="function"||B===n.memoizedProps&&ve===n.memoizedState||(r.flags|=4),typeof N.getSnapshotBeforeUpdate!="function"||B===n.memoizedProps&&ve===n.memoizedState||(r.flags|=1024),r.memoizedProps=u,r.memoizedState=Xe),N.props=u,N.state=Xe,N.context=V,u=ue):(typeof N.componentDidUpdate!="function"||B===n.memoizedProps&&ve===n.memoizedState||(r.flags|=4),typeof N.getSnapshotBeforeUpdate!="function"||B===n.memoizedProps&&ve===n.memoizedState||(r.flags|=1024),u=!1)}return wd(n,r,o,u,v,p)}function wd(n,r,o,u,p,v){Wm(n,r);var N=(r.flags&128)!==0;if(!u&&!N)return p&&Kp(r,o,!1),yr(n,r,v);u=r.stateNode,wv.current=r;var B=N&&typeof o.getDerivedStateFromError!="function"?null:u.render();return r.flags|=1,n!==null&&N?(r.child=fa(r,n.child,null,v),r.child=fa(r,null,B,v)):Wn(n,r,B,v),r.memoizedState=u.state,p&&Kp(r,o,!0),r.child}function Xm(n){var r=n.stateNode;r.pendingContext?Yp(n,r.pendingContext,r.pendingContext!==r.context):r.context&&Yp(n,r.context,!1),od(n,r.containerInfo)}function qm(n,r,o,u,p){return ha(),ed(p),r.flags|=256,Wn(n,r,o,u),r.child}var bd={dehydrated:null,treeContext:null,retryLane:0};function Td(n){return{baseLanes:n,cachePool:null,transitions:null}}function Ym(n,r,o){var u=r.pendingProps,p=tn.current,v=!1,N=(r.flags&128)!==0,B;if((B=N)||(B=n!==null&&n.memoizedState===null?!1:(p&2)!==0),B?(v=!0,r.flags&=-129):(n===null||n.memoizedState!==null)&&(p|=1),Xt(tn,p&1),n===null)return Ju(r),n=r.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?((r.mode&1)===0?r.lanes=1:n.data==="$!"?r.lanes=8:r.lanes=1073741824,null):(N=u.children,n=u.fallback,v?(u=r.mode,v=r.child,N={mode:"hidden",children:N},(u&1)===0&&v!==null?(v.childLanes=0,v.pendingProps=N):v=uc(N,u,0,null),n=Ls(n,u,o,null),v.return=r,n.return=r,v.sibling=n,r.child=v,r.child.memoizedState=Td(o),r.memoizedState=bd,n):Ad(r,N));if(p=n.memoizedState,p!==null&&(B=p.dehydrated,B!==null))return bv(n,r,N,u,B,p,o);if(v){v=u.fallback,N=r.mode,p=n.child,B=p.sibling;var V={mode:"hidden",children:u.children};return(N&1)===0&&r.child!==p?(u=r.child,u.childLanes=0,u.pendingProps=V,r.deletions=null):(u=Qr(p,V),u.subtreeFlags=p.subtreeFlags&14680064),B!==null?v=Qr(B,v):(v=Ls(v,N,o,null),v.flags|=2),v.return=r,u.return=r,u.sibling=v,r.child=u,u=v,v=r.child,N=n.child.memoizedState,N=N===null?Td(o):{baseLanes:N.baseLanes|o,cachePool:null,transitions:N.transitions},v.memoizedState=N,v.childLanes=n.childLanes&~o,r.memoizedState=bd,u}return v=n.child,n=v.sibling,u=Qr(v,{mode:"visible",children:u.children}),(r.mode&1)===0&&(u.lanes=o),u.return=r,u.sibling=null,n!==null&&(o=r.deletions,o===null?(r.deletions=[n],r.flags|=16):o.push(n)),r.child=u,r.memoizedState=null,u}function Ad(n,r){return r=uc({mode:"visible",children:r},n.mode,0,null),r.return=n,n.child=r}function Zl(n,r,o,u){return u!==null&&ed(u),fa(r,n.child,null,o),n=Ad(r,r.pendingProps.children),n.flags|=2,r.memoizedState=null,n}function bv(n,r,o,u,p,v,N){if(o)return r.flags&256?(r.flags&=-257,u=Sd(Error(t(422))),Zl(n,r,N,u)):r.memoizedState!==null?(r.child=n.child,r.flags|=128,null):(v=u.fallback,p=r.mode,u=uc({mode:"visible",children:u.children},p,0,null),v=Ls(v,p,N,null),v.flags|=2,u.return=r,v.return=r,u.sibling=v,r.child=u,(r.mode&1)!==0&&fa(r,n.child,null,N),r.child.memoizedState=Td(N),r.memoizedState=bd,v);if((r.mode&1)===0)return Zl(n,r,N,null);if(p.data==="$!"){if(u=p.nextSibling&&p.nextSibling.dataset,u)var B=u.dgst;return u=B,v=Error(t(419)),u=Sd(v,u,void 0),Zl(n,r,N,u)}if(B=(N&n.childLanes)!==0,Jn||B){if(u=bn,u!==null){switch(N&-N){case 4:p=2;break;case 16:p=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:p=32;break;case 536870912:p=268435456;break;default:p=0}p=(p&(u.suspendedLanes|N))!==0?0:p,p!==0&&p!==v.retryLane&&(v.retryLane=p,xr(n,p),Fi(u,n,p,-1))}return Gd(),u=Sd(Error(t(421))),Zl(n,r,N,u)}return p.data==="$?"?(r.flags|=128,r.child=n.child,r=kv.bind(null,n),p._reactRetry=r,null):(n=v.treeContext,ci=Hr(p.nextSibling),li=r,Qt=!0,Di=null,n!==null&&(xi[vi++]=gr,xi[vi++]=_r,xi[vi++]=Es,gr=n.id,_r=n.overflow,Es=r),r=Ad(r,u.children),r.flags|=4096,r)}function $m(n,r,o){n.lanes|=r;var u=n.alternate;u!==null&&(u.lanes|=r),rd(n.return,r,o)}function Cd(n,r,o,u,p){var v=n.memoizedState;v===null?n.memoizedState={isBackwards:r,rendering:null,renderingStartTime:0,last:u,tail:o,tailMode:p}:(v.isBackwards=r,v.rendering=null,v.renderingStartTime=0,v.last=u,v.tail=o,v.tailMode=p)}function Km(n,r,o){var u=r.pendingProps,p=u.revealOrder,v=u.tail;if(Wn(n,r,u.children,o),u=tn.current,(u&2)!==0)u=u&1|2,r.flags|=128;else{if(n!==null&&(n.flags&128)!==0)e:for(n=r.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&$m(n,o,r);else if(n.tag===19)$m(n,o,r);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===r)break e;for(;n.sibling===null;){if(n.return===null||n.return===r)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}u&=1}if(Xt(tn,u),(r.mode&1)===0)r.memoizedState=null;else switch(p){case"forwards":for(o=r.child,p=null;o!==null;)n=o.alternate,n!==null&&Wl(n)===null&&(p=o),o=o.sibling;o=p,o===null?(p=r.child,r.child=null):(p=o.sibling,o.sibling=null),Cd(r,!1,p,o,v);break;case"backwards":for(o=null,p=r.child,r.child=null;p!==null;){if(n=p.alternate,n!==null&&Wl(n)===null){r.child=p;break}n=p.sibling,p.sibling=o,o=p,p=n}Cd(r,!0,o,null,v);break;case"together":Cd(r,!1,null,null,void 0);break;default:r.memoizedState=null}return r.child}function Ql(n,r){(r.mode&1)===0&&n!==null&&(n.alternate=null,r.alternate=null,r.flags|=2)}function yr(n,r,o){if(n!==null&&(r.dependencies=n.dependencies),Cs|=r.lanes,(o&r.childLanes)===0)return null;if(n!==null&&r.child!==n.child)throw Error(t(153));if(r.child!==null){for(n=r.child,o=Qr(n,n.pendingProps),r.child=o,o.return=r;n.sibling!==null;)n=n.sibling,o=o.sibling=Qr(n,n.pendingProps),o.return=r;o.sibling=null}return r.child}function Tv(n,r,o){switch(r.tag){case 3:Xm(r),ha();break;case 5:um(r);break;case 1:Qn(r.type)&&Il(r);break;case 4:od(r,r.stateNode.containerInfo);break;case 10:var u=r.type._context,p=r.memoizedProps.value;Xt(zl,u._currentValue),u._currentValue=p;break;case 13:if(u=r.memoizedState,u!==null)return u.dehydrated!==null?(Xt(tn,tn.current&1),r.flags|=128,null):(o&r.child.childLanes)!==0?Ym(n,r,o):(Xt(tn,tn.current&1),n=yr(n,r,o),n!==null?n.sibling:null);Xt(tn,tn.current&1);break;case 19:if(u=(o&r.childLanes)!==0,(n.flags&128)!==0){if(u)return Km(n,r,o);r.flags|=128}if(p=r.memoizedState,p!==null&&(p.rendering=null,p.tail=null,p.lastEffect=null),Xt(tn,tn.current),u)break;return null;case 22:case 23:return r.lanes=0,Gm(n,r,o)}return yr(n,r,o)}var Zm,Rd,Qm,Jm;Zm=function(n,r){for(var o=r.child;o!==null;){if(o.tag===5||o.tag===6)n.appendChild(o.stateNode);else if(o.tag!==4&&o.child!==null){o.child.return=o,o=o.child;continue}if(o===r)break;for(;o.sibling===null;){if(o.return===null||o.return===r)return;o=o.return}o.sibling.return=o.return,o=o.sibling}},Rd=function(){},Qm=function(n,r,o,u){var p=n.memoizedProps;if(p!==u){n=r.stateNode,Ts(Zi.current);var v=null;switch(o){case"input":p=pt(n,p),u=pt(n,u),v=[];break;case"select":p=Z({},p,{value:void 0}),u=Z({},u,{value:void 0}),v=[];break;case"textarea":p=jt(n,p),u=jt(n,u),v=[];break;default:typeof p.onClick!="function"&&typeof u.onClick=="function"&&(n.onclick=Nl)}Ke(o,u);var N;o=null;for(ue in p)if(!u.hasOwnProperty(ue)&&p.hasOwnProperty(ue)&&p[ue]!=null)if(ue==="style"){var B=p[ue];for(N in B)B.hasOwnProperty(N)&&(o||(o={}),o[N]="")}else ue!=="dangerouslySetInnerHTML"&&ue!=="children"&&ue!=="suppressContentEditableWarning"&&ue!=="suppressHydrationWarning"&&ue!=="autoFocus"&&(a.hasOwnProperty(ue)?v||(v=[]):(v=v||[]).push(ue,null));for(ue in u){var V=u[ue];if(B=p!=null?p[ue]:void 0,u.hasOwnProperty(ue)&&V!==B&&(V!=null||B!=null))if(ue==="style")if(B){for(N in B)!B.hasOwnProperty(N)||V&&V.hasOwnProperty(N)||(o||(o={}),o[N]="");for(N in V)V.hasOwnProperty(N)&&B[N]!==V[N]&&(o||(o={}),o[N]=V[N])}else o||(v||(v=[]),v.push(ue,o)),o=V;else ue==="dangerouslySetInnerHTML"?(V=V?V.__html:void 0,B=B?B.__html:void 0,V!=null&&B!==V&&(v=v||[]).push(ue,V)):ue==="children"?typeof V!="string"&&typeof V!="number"||(v=v||[]).push(ue,""+V):ue!=="suppressContentEditableWarning"&&ue!=="suppressHydrationWarning"&&(a.hasOwnProperty(ue)?(V!=null&&ue==="onScroll"&&Yt("scroll",n),v||B===V||(v=[])):(v=v||[]).push(ue,V))}o&&(v=v||[]).push("style",o);var ue=v;(r.updateQueue=ue)&&(r.flags|=4)}},Jm=function(n,r,o,u){o!==u&&(r.flags|=4)};function Do(n,r){if(!Qt)switch(n.tailMode){case"hidden":r=n.tail;for(var o=null;r!==null;)r.alternate!==null&&(o=r),r=r.sibling;o===null?n.tail=null:o.sibling=null;break;case"collapsed":o=n.tail;for(var u=null;o!==null;)o.alternate!==null&&(u=o),o=o.sibling;u===null?r||n.tail===null?n.tail=null:n.tail.sibling=null:u.sibling=null}}function On(n){var r=n.alternate!==null&&n.alternate.child===n.child,o=0,u=0;if(r)for(var p=n.child;p!==null;)o|=p.lanes|p.childLanes,u|=p.subtreeFlags&14680064,u|=p.flags&14680064,p.return=n,p=p.sibling;else for(p=n.child;p!==null;)o|=p.lanes|p.childLanes,u|=p.subtreeFlags,u|=p.flags,p.return=n,p=p.sibling;return n.subtreeFlags|=u,n.childLanes=o,r}function Av(n,r,o){var u=r.pendingProps;switch(Zu(r),r.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return On(r),null;case 1:return Qn(r.type)&&Dl(),On(r),null;case 3:return u=r.stateNode,ga(),$t(Zn),$t(In),ud(),u.pendingContext&&(u.context=u.pendingContext,u.pendingContext=null),(n===null||n.child===null)&&(kl(r)?r.flags|=4:n===null||n.memoizedState.isDehydrated&&(r.flags&256)===0||(r.flags|=1024,Di!==null&&(zd(Di),Di=null))),Rd(n,r),On(r),null;case 5:ld(r);var p=Ts(Co.current);if(o=r.type,n!==null&&r.stateNode!=null)Qm(n,r,o,u,p),n.ref!==r.ref&&(r.flags|=512,r.flags|=2097152);else{if(!u){if(r.stateNode===null)throw Error(t(166));return On(r),null}if(n=Ts(Zi.current),kl(r)){u=r.stateNode,o=r.type;var v=r.memoizedProps;switch(u[Ki]=r,u[Eo]=v,n=(r.mode&1)!==0,o){case"dialog":Yt("cancel",u),Yt("close",u);break;case"iframe":case"object":case"embed":Yt("load",u);break;case"video":case"audio":for(p=0;p<yo.length;p++)Yt(yo[p],u);break;case"source":Yt("error",u);break;case"img":case"image":case"link":Yt("error",u),Yt("load",u);break;case"details":Yt("toggle",u);break;case"input":St(u,v),Yt("invalid",u);break;case"select":u._wrapperState={wasMultiple:!!v.multiple},Yt("invalid",u);break;case"textarea":q(u,v),Yt("invalid",u)}Ke(o,v),p=null;for(var N in v)if(v.hasOwnProperty(N)){var B=v[N];N==="children"?typeof B=="string"?u.textContent!==B&&(v.suppressHydrationWarning!==!0&&Pl(u.textContent,B,n),p=["children",B]):typeof B=="number"&&u.textContent!==""+B&&(v.suppressHydrationWarning!==!0&&Pl(u.textContent,B,n),p=["children",""+B]):a.hasOwnProperty(N)&&B!=null&&N==="onScroll"&&Yt("scroll",u)}switch(o){case"input":Oe(u),Ft(u,v,!0);break;case"textarea":Oe(u),Nt(u);break;case"select":case"option":break;default:typeof v.onClick=="function"&&(u.onclick=Nl)}u=p,r.updateQueue=u,u!==null&&(r.flags|=4)}else{N=p.nodeType===9?p:p.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=F(o)),n==="http://www.w3.org/1999/xhtml"?o==="script"?(n=N.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof u.is=="string"?n=N.createElement(o,{is:u.is}):(n=N.createElement(o),o==="select"&&(N=n,u.multiple?N.multiple=!0:u.size&&(N.size=u.size))):n=N.createElementNS(n,o),n[Ki]=r,n[Eo]=u,Zm(n,r,!1,!1),r.stateNode=n;e:{switch(N=Ne(o,u),o){case"dialog":Yt("cancel",n),Yt("close",n),p=u;break;case"iframe":case"object":case"embed":Yt("load",n),p=u;break;case"video":case"audio":for(p=0;p<yo.length;p++)Yt(yo[p],n);p=u;break;case"source":Yt("error",n),p=u;break;case"img":case"image":case"link":Yt("error",n),Yt("load",n),p=u;break;case"details":Yt("toggle",n),p=u;break;case"input":St(n,u),p=pt(n,u),Yt("invalid",n);break;case"option":p=u;break;case"select":n._wrapperState={wasMultiple:!!u.multiple},p=Z({},u,{value:void 0}),Yt("invalid",n);break;case"textarea":q(n,u),p=jt(n,u),Yt("invalid",n);break;default:p=u}Ke(o,p),B=p;for(v in B)if(B.hasOwnProperty(v)){var V=B[v];v==="style"?_e(n,V):v==="dangerouslySetInnerHTML"?(V=V?V.__html:void 0,V!=null&&le(n,V)):v==="children"?typeof V=="string"?(o!=="textarea"||V!=="")&&fe(n,V):typeof V=="number"&&fe(n,""+V):v!=="suppressContentEditableWarning"&&v!=="suppressHydrationWarning"&&v!=="autoFocus"&&(a.hasOwnProperty(v)?V!=null&&v==="onScroll"&&Yt("scroll",n):V!=null&&I(n,v,V,N))}switch(o){case"input":Oe(n),Ft(n,u,!1);break;case"textarea":Oe(n),Nt(n);break;case"option":u.value!=null&&n.setAttribute("value",""+de(u.value));break;case"select":n.multiple=!!u.multiple,v=u.value,v!=null?xt(n,!!u.multiple,v,!1):u.defaultValue!=null&&xt(n,!!u.multiple,u.defaultValue,!0);break;default:typeof p.onClick=="function"&&(n.onclick=Nl)}switch(o){case"button":case"input":case"select":case"textarea":u=!!u.autoFocus;break e;case"img":u=!0;break e;default:u=!1}}u&&(r.flags|=4)}r.ref!==null&&(r.flags|=512,r.flags|=2097152)}return On(r),null;case 6:if(n&&r.stateNode!=null)Jm(n,r,n.memoizedProps,u);else{if(typeof u!="string"&&r.stateNode===null)throw Error(t(166));if(o=Ts(Co.current),Ts(Zi.current),kl(r)){if(u=r.stateNode,o=r.memoizedProps,u[Ki]=r,(v=u.nodeValue!==o)&&(n=li,n!==null))switch(n.tag){case 3:Pl(u.nodeValue,o,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&Pl(u.nodeValue,o,(n.mode&1)!==0)}v&&(r.flags|=4)}else u=(o.nodeType===9?o:o.ownerDocument).createTextNode(u),u[Ki]=r,r.stateNode=u}return On(r),null;case 13:if($t(tn),u=r.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(Qt&&ci!==null&&(r.mode&1)!==0&&(r.flags&128)===0)nm(),ha(),r.flags|=98560,v=!1;else if(v=kl(r),u!==null&&u.dehydrated!==null){if(n===null){if(!v)throw Error(t(318));if(v=r.memoizedState,v=v!==null?v.dehydrated:null,!v)throw Error(t(317));v[Ki]=r}else ha(),(r.flags&128)===0&&(r.memoizedState=null),r.flags|=4;On(r),v=!1}else Di!==null&&(zd(Di),Di=null),v=!0;if(!v)return r.flags&65536?r:null}return(r.flags&128)!==0?(r.lanes=o,r):(u=u!==null,u!==(n!==null&&n.memoizedState!==null)&&u&&(r.child.flags|=8192,(r.mode&1)!==0&&(n===null||(tn.current&1)!==0?_n===0&&(_n=3):Gd())),r.updateQueue!==null&&(r.flags|=4),On(r),null);case 4:return ga(),Rd(n,r),n===null&&So(r.stateNode.containerInfo),On(r),null;case 10:return id(r.type._context),On(r),null;case 17:return Qn(r.type)&&Dl(),On(r),null;case 19:if($t(tn),v=r.memoizedState,v===null)return On(r),null;if(u=(r.flags&128)!==0,N=v.rendering,N===null)if(u)Do(v,!1);else{if(_n!==0||n!==null&&(n.flags&128)!==0)for(n=r.child;n!==null;){if(N=Wl(n),N!==null){for(r.flags|=128,Do(v,!1),u=N.updateQueue,u!==null&&(r.updateQueue=u,r.flags|=4),r.subtreeFlags=0,u=o,o=r.child;o!==null;)v=o,n=u,v.flags&=14680066,N=v.alternate,N===null?(v.childLanes=0,v.lanes=n,v.child=null,v.subtreeFlags=0,v.memoizedProps=null,v.memoizedState=null,v.updateQueue=null,v.dependencies=null,v.stateNode=null):(v.childLanes=N.childLanes,v.lanes=N.lanes,v.child=N.child,v.subtreeFlags=0,v.deletions=null,v.memoizedProps=N.memoizedProps,v.memoizedState=N.memoizedState,v.updateQueue=N.updateQueue,v.type=N.type,n=N.dependencies,v.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),o=o.sibling;return Xt(tn,tn.current&1|2),r.child}n=n.sibling}v.tail!==null&&en()>ya&&(r.flags|=128,u=!0,Do(v,!1),r.lanes=4194304)}else{if(!u)if(n=Wl(N),n!==null){if(r.flags|=128,u=!0,o=n.updateQueue,o!==null&&(r.updateQueue=o,r.flags|=4),Do(v,!0),v.tail===null&&v.tailMode==="hidden"&&!N.alternate&&!Qt)return On(r),null}else 2*en()-v.renderingStartTime>ya&&o!==1073741824&&(r.flags|=128,u=!0,Do(v,!1),r.lanes=4194304);v.isBackwards?(N.sibling=r.child,r.child=N):(o=v.last,o!==null?o.sibling=N:r.child=N,v.last=N)}return v.tail!==null?(r=v.tail,v.rendering=r,v.tail=r.sibling,v.renderingStartTime=en(),r.sibling=null,o=tn.current,Xt(tn,u?o&1|2:o&1),r):(On(r),null);case 22:case 23:return Vd(),u=r.memoizedState!==null,n!==null&&n.memoizedState!==null!==u&&(r.flags|=8192),u&&(r.mode&1)!==0?(ui&1073741824)!==0&&(On(r),r.subtreeFlags&6&&(r.flags|=8192)):On(r),null;case 24:return null;case 25:return null}throw Error(t(156,r.tag))}function Cv(n,r){switch(Zu(r),r.tag){case 1:return Qn(r.type)&&Dl(),n=r.flags,n&65536?(r.flags=n&-65537|128,r):null;case 3:return ga(),$t(Zn),$t(In),ud(),n=r.flags,(n&65536)!==0&&(n&128)===0?(r.flags=n&-65537|128,r):null;case 5:return ld(r),null;case 13:if($t(tn),n=r.memoizedState,n!==null&&n.dehydrated!==null){if(r.alternate===null)throw Error(t(340));ha()}return n=r.flags,n&65536?(r.flags=n&-65537|128,r):null;case 19:return $t(tn),null;case 4:return ga(),null;case 10:return id(r.type._context),null;case 22:case 23:return Vd(),null;case 24:return null;default:return null}}var Jl=!1,Fn=!1,Rv=typeof WeakSet=="function"?WeakSet:Set,We=null;function xa(n,r){var o=n.ref;if(o!==null)if(typeof o=="function")try{o(null)}catch(u){on(n,r,u)}else o.current=null}function Pd(n,r,o){try{o()}catch(u){on(n,r,u)}}var e0=!1;function Pv(n,r){if(Vu=vl,n=Lp(),Iu(n)){if("selectionStart"in n)var o={start:n.selectionStart,end:n.selectionEnd};else e:{o=(o=n.ownerDocument)&&o.defaultView||window;var u=o.getSelection&&o.getSelection();if(u&&u.rangeCount!==0){o=u.anchorNode;var p=u.anchorOffset,v=u.focusNode;u=u.focusOffset;try{o.nodeType,v.nodeType}catch{o=null;break e}var N=0,B=-1,V=-1,ue=0,ye=0,Me=n,ve=null;t:for(;;){for(var Be;Me!==o||p!==0&&Me.nodeType!==3||(B=N+p),Me!==v||u!==0&&Me.nodeType!==3||(V=N+u),Me.nodeType===3&&(N+=Me.nodeValue.length),(Be=Me.firstChild)!==null;)ve=Me,Me=Be;for(;;){if(Me===n)break t;if(ve===o&&++ue===p&&(B=N),ve===v&&++ye===u&&(V=N),(Be=Me.nextSibling)!==null)break;Me=ve,ve=Me.parentNode}Me=Be}o=B===-1||V===-1?null:{start:B,end:V}}else o=null}o=o||{start:0,end:0}}else o=null;for(Gu={focusedElem:n,selectionRange:o},vl=!1,We=r;We!==null;)if(r=We,n=r.child,(r.subtreeFlags&1028)!==0&&n!==null)n.return=r,We=n;else for(;We!==null;){r=We;try{var Xe=r.alternate;if((r.flags&1024)!==0)switch(r.tag){case 0:case 11:case 15:break;case 1:if(Xe!==null){var Ye=Xe.memoizedProps,un=Xe.memoizedState,re=r.stateNode,Y=re.getSnapshotBeforeUpdate(r.elementType===r.type?Ye:Ii(r.type,Ye),un);re.__reactInternalSnapshotBeforeUpdate=Y}break;case 3:var oe=r.stateNode.containerInfo;oe.nodeType===1?oe.textContent="":oe.nodeType===9&&oe.documentElement&&oe.removeChild(oe.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(t(163))}}catch(be){on(r,r.return,be)}if(n=r.sibling,n!==null){n.return=r.return,We=n;break}We=r.return}return Xe=e0,e0=!1,Xe}function Io(n,r,o){var u=r.updateQueue;if(u=u!==null?u.lastEffect:null,u!==null){var p=u=u.next;do{if((p.tag&n)===n){var v=p.destroy;p.destroy=void 0,v!==void 0&&Pd(r,o,v)}p=p.next}while(p!==u)}}function ec(n,r){if(r=r.updateQueue,r=r!==null?r.lastEffect:null,r!==null){var o=r=r.next;do{if((o.tag&n)===n){var u=o.create;o.destroy=u()}o=o.next}while(o!==r)}}function Nd(n){var r=n.ref;if(r!==null){var o=n.stateNode;switch(n.tag){case 5:n=o;break;default:n=o}typeof r=="function"?r(n):r.current=n}}function t0(n){var r=n.alternate;r!==null&&(n.alternate=null,t0(r)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(r=n.stateNode,r!==null&&(delete r[Ki],delete r[Eo],delete r[qu],delete r[hv],delete r[fv])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function n0(n){return n.tag===5||n.tag===3||n.tag===4}function i0(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||n0(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function Ld(n,r,o){var u=n.tag;if(u===5||u===6)n=n.stateNode,r?o.nodeType===8?o.parentNode.insertBefore(n,r):o.insertBefore(n,r):(o.nodeType===8?(r=o.parentNode,r.insertBefore(n,o)):(r=o,r.appendChild(n)),o=o._reactRootContainer,o!=null||r.onclick!==null||(r.onclick=Nl));else if(u!==4&&(n=n.child,n!==null))for(Ld(n,r,o),n=n.sibling;n!==null;)Ld(n,r,o),n=n.sibling}function Dd(n,r,o){var u=n.tag;if(u===5||u===6)n=n.stateNode,r?o.insertBefore(n,r):o.appendChild(n);else if(u!==4&&(n=n.child,n!==null))for(Dd(n,r,o),n=n.sibling;n!==null;)Dd(n,r,o),n=n.sibling}var Rn=null,Ui=!1;function qr(n,r,o){for(o=o.child;o!==null;)r0(n,r,o),o=o.sibling}function r0(n,r,o){if(te&&typeof te.onCommitFiberUnmount=="function")try{te.onCommitFiberUnmount(ie,o)}catch{}switch(o.tag){case 5:Fn||xa(o,r);case 6:var u=Rn,p=Ui;Rn=null,qr(n,r,o),Rn=u,Ui=p,Rn!==null&&(Ui?(n=Rn,o=o.stateNode,n.nodeType===8?n.parentNode.removeChild(o):n.removeChild(o)):Rn.removeChild(o.stateNode));break;case 18:Rn!==null&&(Ui?(n=Rn,o=o.stateNode,n.nodeType===8?Xu(n.parentNode,o):n.nodeType===1&&Xu(n,o),ho(n)):Xu(Rn,o.stateNode));break;case 4:u=Rn,p=Ui,Rn=o.stateNode.containerInfo,Ui=!0,qr(n,r,o),Rn=u,Ui=p;break;case 0:case 11:case 14:case 15:if(!Fn&&(u=o.updateQueue,u!==null&&(u=u.lastEffect,u!==null))){p=u=u.next;do{var v=p,N=v.destroy;v=v.tag,N!==void 0&&((v&2)!==0||(v&4)!==0)&&Pd(o,r,N),p=p.next}while(p!==u)}qr(n,r,o);break;case 1:if(!Fn&&(xa(o,r),u=o.stateNode,typeof u.componentWillUnmount=="function"))try{u.props=o.memoizedProps,u.state=o.memoizedState,u.componentWillUnmount()}catch(B){on(o,r,B)}qr(n,r,o);break;case 21:qr(n,r,o);break;case 22:o.mode&1?(Fn=(u=Fn)||o.memoizedState!==null,qr(n,r,o),Fn=u):qr(n,r,o);break;default:qr(n,r,o)}}function s0(n){var r=n.updateQueue;if(r!==null){n.updateQueue=null;var o=n.stateNode;o===null&&(o=n.stateNode=new Rv),r.forEach(function(u){var p=Bv.bind(null,n,u);o.has(u)||(o.add(u),u.then(p,p))})}}function Oi(n,r){var o=r.deletions;if(o!==null)for(var u=0;u<o.length;u++){var p=o[u];try{var v=n,N=r,B=N;e:for(;B!==null;){switch(B.tag){case 5:Rn=B.stateNode,Ui=!1;break e;case 3:Rn=B.stateNode.containerInfo,Ui=!0;break e;case 4:Rn=B.stateNode.containerInfo,Ui=!0;break e}B=B.return}if(Rn===null)throw Error(t(160));r0(v,N,p),Rn=null,Ui=!1;var V=p.alternate;V!==null&&(V.return=null),p.return=null}catch(ue){on(p,r,ue)}}if(r.subtreeFlags&12854)for(r=r.child;r!==null;)a0(r,n),r=r.sibling}function a0(n,r){var o=n.alternate,u=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(Oi(r,n),Ji(n),u&4){try{Io(3,n,n.return),ec(3,n)}catch(Ye){on(n,n.return,Ye)}try{Io(5,n,n.return)}catch(Ye){on(n,n.return,Ye)}}break;case 1:Oi(r,n),Ji(n),u&512&&o!==null&&xa(o,o.return);break;case 5:if(Oi(r,n),Ji(n),u&512&&o!==null&&xa(o,o.return),n.flags&32){var p=n.stateNode;try{fe(p,"")}catch(Ye){on(n,n.return,Ye)}}if(u&4&&(p=n.stateNode,p!=null)){var v=n.memoizedProps,N=o!==null?o.memoizedProps:v,B=n.type,V=n.updateQueue;if(n.updateQueue=null,V!==null)try{B==="input"&&v.type==="radio"&&v.name!=null&&Pt(p,v),Ne(B,N);var ue=Ne(B,v);for(N=0;N<V.length;N+=2){var ye=V[N],Me=V[N+1];ye==="style"?_e(p,Me):ye==="dangerouslySetInnerHTML"?le(p,Me):ye==="children"?fe(p,Me):I(p,ye,Me,ue)}switch(B){case"input":gt(p,v);break;case"textarea":pn(p,v);break;case"select":var ve=p._wrapperState.wasMultiple;p._wrapperState.wasMultiple=!!v.multiple;var Be=v.value;Be!=null?xt(p,!!v.multiple,Be,!1):ve!==!!v.multiple&&(v.defaultValue!=null?xt(p,!!v.multiple,v.defaultValue,!0):xt(p,!!v.multiple,v.multiple?[]:"",!1))}p[Eo]=v}catch(Ye){on(n,n.return,Ye)}}break;case 6:if(Oi(r,n),Ji(n),u&4){if(n.stateNode===null)throw Error(t(162));p=n.stateNode,v=n.memoizedProps;try{p.nodeValue=v}catch(Ye){on(n,n.return,Ye)}}break;case 3:if(Oi(r,n),Ji(n),u&4&&o!==null&&o.memoizedState.isDehydrated)try{ho(r.containerInfo)}catch(Ye){on(n,n.return,Ye)}break;case 4:Oi(r,n),Ji(n);break;case 13:Oi(r,n),Ji(n),p=n.child,p.flags&8192&&(v=p.memoizedState!==null,p.stateNode.isHidden=v,!v||p.alternate!==null&&p.alternate.memoizedState!==null||(Od=en())),u&4&&s0(n);break;case 22:if(ye=o!==null&&o.memoizedState!==null,n.mode&1?(Fn=(ue=Fn)||ye,Oi(r,n),Fn=ue):Oi(r,n),Ji(n),u&8192){if(ue=n.memoizedState!==null,(n.stateNode.isHidden=ue)&&!ye&&(n.mode&1)!==0)for(We=n,ye=n.child;ye!==null;){for(Me=We=ye;We!==null;){switch(ve=We,Be=ve.child,ve.tag){case 0:case 11:case 14:case 15:Io(4,ve,ve.return);break;case 1:xa(ve,ve.return);var Xe=ve.stateNode;if(typeof Xe.componentWillUnmount=="function"){u=ve,o=ve.return;try{r=u,Xe.props=r.memoizedProps,Xe.state=r.memoizedState,Xe.componentWillUnmount()}catch(Ye){on(u,o,Ye)}}break;case 5:xa(ve,ve.return);break;case 22:if(ve.memoizedState!==null){c0(Me);continue}}Be!==null?(Be.return=ve,We=Be):c0(Me)}ye=ye.sibling}e:for(ye=null,Me=n;;){if(Me.tag===5){if(ye===null){ye=Me;try{p=Me.stateNode,ue?(v=p.style,typeof v.setProperty=="function"?v.setProperty("display","none","important"):v.display="none"):(B=Me.stateNode,V=Me.memoizedProps.style,N=V!=null&&V.hasOwnProperty("display")?V.display:null,B.style.display=pe("display",N))}catch(Ye){on(n,n.return,Ye)}}}else if(Me.tag===6){if(ye===null)try{Me.stateNode.nodeValue=ue?"":Me.memoizedProps}catch(Ye){on(n,n.return,Ye)}}else if((Me.tag!==22&&Me.tag!==23||Me.memoizedState===null||Me===n)&&Me.child!==null){Me.child.return=Me,Me=Me.child;continue}if(Me===n)break e;for(;Me.sibling===null;){if(Me.return===null||Me.return===n)break e;ye===Me&&(ye=null),Me=Me.return}ye===Me&&(ye=null),Me.sibling.return=Me.return,Me=Me.sibling}}break;case 19:Oi(r,n),Ji(n),u&4&&s0(n);break;case 21:break;default:Oi(r,n),Ji(n)}}function Ji(n){var r=n.flags;if(r&2){try{e:{for(var o=n.return;o!==null;){if(n0(o)){var u=o;break e}o=o.return}throw Error(t(160))}switch(u.tag){case 5:var p=u.stateNode;u.flags&32&&(fe(p,""),u.flags&=-33);var v=i0(n);Dd(n,v,p);break;case 3:case 4:var N=u.stateNode.containerInfo,B=i0(n);Ld(n,B,N);break;default:throw Error(t(161))}}catch(V){on(n,n.return,V)}n.flags&=-3}r&4096&&(n.flags&=-4097)}function Nv(n,r,o){We=n,o0(n)}function o0(n,r,o){for(var u=(n.mode&1)!==0;We!==null;){var p=We,v=p.child;if(p.tag===22&&u){var N=p.memoizedState!==null||Jl;if(!N){var B=p.alternate,V=B!==null&&B.memoizedState!==null||Fn;B=Jl;var ue=Fn;if(Jl=N,(Fn=V)&&!ue)for(We=p;We!==null;)N=We,V=N.child,N.tag===22&&N.memoizedState!==null?u0(p):V!==null?(V.return=N,We=V):u0(p);for(;v!==null;)We=v,o0(v),v=v.sibling;We=p,Jl=B,Fn=ue}l0(n)}else(p.subtreeFlags&8772)!==0&&v!==null?(v.return=p,We=v):l0(n)}}function l0(n){for(;We!==null;){var r=We;if((r.flags&8772)!==0){var o=r.alternate;try{if((r.flags&8772)!==0)switch(r.tag){case 0:case 11:case 15:Fn||ec(5,r);break;case 1:var u=r.stateNode;if(r.flags&4&&!Fn)if(o===null)u.componentDidMount();else{var p=r.elementType===r.type?o.memoizedProps:Ii(r.type,o.memoizedProps);u.componentDidUpdate(p,o.memoizedState,u.__reactInternalSnapshotBeforeUpdate)}var v=r.updateQueue;v!==null&&cm(r,v,u);break;case 3:var N=r.updateQueue;if(N!==null){if(o=null,r.child!==null)switch(r.child.tag){case 5:o=r.child.stateNode;break;case 1:o=r.child.stateNode}cm(r,N,o)}break;case 5:var B=r.stateNode;if(o===null&&r.flags&4){o=B;var V=r.memoizedProps;switch(r.type){case"button":case"input":case"select":case"textarea":V.autoFocus&&o.focus();break;case"img":V.src&&(o.src=V.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(r.memoizedState===null){var ue=r.alternate;if(ue!==null){var ye=ue.memoizedState;if(ye!==null){var Me=ye.dehydrated;Me!==null&&ho(Me)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(t(163))}Fn||r.flags&512&&Nd(r)}catch(ve){on(r,r.return,ve)}}if(r===n){We=null;break}if(o=r.sibling,o!==null){o.return=r.return,We=o;break}We=r.return}}function c0(n){for(;We!==null;){var r=We;if(r===n){We=null;break}var o=r.sibling;if(o!==null){o.return=r.return,We=o;break}We=r.return}}function u0(n){for(;We!==null;){var r=We;try{switch(r.tag){case 0:case 11:case 15:var o=r.return;try{ec(4,r)}catch(V){on(r,o,V)}break;case 1:var u=r.stateNode;if(typeof u.componentDidMount=="function"){var p=r.return;try{u.componentDidMount()}catch(V){on(r,p,V)}}var v=r.return;try{Nd(r)}catch(V){on(r,v,V)}break;case 5:var N=r.return;try{Nd(r)}catch(V){on(r,N,V)}}}catch(V){on(r,r.return,V)}if(r===n){We=null;break}var B=r.sibling;if(B!==null){B.return=r.return,We=B;break}We=r.return}}var Lv=Math.ceil,tc=w.ReactCurrentDispatcher,Id=w.ReactCurrentOwner,Mi=w.ReactCurrentBatchConfig,Rt=0,bn=null,hn=null,Pn=0,ui=0,va=Vr(0),_n=0,Uo=null,Cs=0,nc=0,Ud=0,Oo=null,ei=null,Od=0,ya=1/0,Sr=null,ic=!1,Fd=null,Yr=null,rc=!1,$r=null,sc=0,Fo=0,kd=null,ac=-1,oc=0;function jn(){return(Rt&6)!==0?en():ac!==-1?ac:ac=en()}function Kr(n){return(n.mode&1)===0?1:(Rt&2)!==0&&Pn!==0?Pn&-Pn:mv.transition!==null?(oc===0&&(oc=mn()),oc):(n=vt,n!==0||(n=window.event,n=n===void 0?16:hp(n.type)),n)}function Fi(n,r,o,u){if(50<Fo)throw Fo=0,kd=null,Error(t(185));cn(n,o,u),((Rt&2)===0||n!==bn)&&(n===bn&&((Rt&2)===0&&(nc|=o),_n===4&&Zr(n,Pn)),ti(n,u),o===1&&Rt===0&&(r.mode&1)===0&&(ya=en()+500,Ul&&Wr()))}function ti(n,r){var o=n.callbackNode;Wt(n,r);var u=bt(n,n===bn?Pn:0);if(u===0)o!==null&&ro(o),n.callbackNode=null,n.callbackPriority=0;else if(r=u&-u,n.callbackPriority!==r){if(o!=null&&ro(o),r===1)n.tag===0?pv(h0.bind(null,n)):Zp(h0.bind(null,n)),uv(function(){(Rt&6)===0&&Wr()}),o=null;else{switch(Ci(u)){case 1:o=so;break;case 4:o=ao;break;case 16:o=L;break;case 536870912:o=ce;break;default:o=L}o=y0(o,d0.bind(null,n))}n.callbackPriority=r,n.callbackNode=o}}function d0(n,r){if(ac=-1,oc=0,(Rt&6)!==0)throw Error(t(327));var o=n.callbackNode;if(Sa()&&n.callbackNode!==o)return null;var u=bt(n,n===bn?Pn:0);if(u===0)return null;if((u&30)!==0||(u&n.expiredLanes)!==0||r)r=lc(n,u);else{r=u;var p=Rt;Rt|=2;var v=p0();(bn!==n||Pn!==r)&&(Sr=null,ya=en()+500,Ps(n,r));do try{Uv();break}catch(B){f0(n,B)}while(!0);nd(),tc.current=v,Rt=p,hn!==null?r=0:(bn=null,Pn=0,r=_n)}if(r!==0){if(r===2&&(p=Ot(n),p!==0&&(u=p,r=Bd(n,p))),r===1)throw o=Uo,Ps(n,0),Zr(n,u),ti(n,en()),o;if(r===6)Zr(n,u);else{if(p=n.current.alternate,(u&30)===0&&!Dv(p)&&(r=lc(n,u),r===2&&(v=Ot(n),v!==0&&(u=v,r=Bd(n,v))),r===1))throw o=Uo,Ps(n,0),Zr(n,u),ti(n,en()),o;switch(n.finishedWork=p,n.finishedLanes=u,r){case 0:case 1:throw Error(t(345));case 2:Ns(n,ei,Sr);break;case 3:if(Zr(n,u),(u&130023424)===u&&(r=Od+500-en(),10<r)){if(bt(n,0)!==0)break;if(p=n.suspendedLanes,(p&u)!==u){jn(),n.pingedLanes|=n.suspendedLanes&p;break}n.timeoutHandle=ju(Ns.bind(null,n,ei,Sr),r);break}Ns(n,ei,Sr);break;case 4:if(Zr(n,u),(u&4194240)===u)break;for(r=n.eventTimes,p=-1;0<u;){var N=31-Le(u);v=1<<N,N=r[N],N>p&&(p=N),u&=~v}if(u=p,u=en()-u,u=(120>u?120:480>u?480:1080>u?1080:1920>u?1920:3e3>u?3e3:4320>u?4320:1960*Lv(u/1960))-u,10<u){n.timeoutHandle=ju(Ns.bind(null,n,ei,Sr),u);break}Ns(n,ei,Sr);break;case 5:Ns(n,ei,Sr);break;default:throw Error(t(329))}}}return ti(n,en()),n.callbackNode===o?d0.bind(null,n):null}function Bd(n,r){var o=Oo;return n.current.memoizedState.isDehydrated&&(Ps(n,r).flags|=256),n=lc(n,r),n!==2&&(r=ei,ei=o,r!==null&&zd(r)),n}function zd(n){ei===null?ei=n:ei.push.apply(ei,n)}function Dv(n){for(var r=n;;){if(r.flags&16384){var o=r.updateQueue;if(o!==null&&(o=o.stores,o!==null))for(var u=0;u<o.length;u++){var p=o[u],v=p.getSnapshot;p=p.value;try{if(!Li(v(),p))return!1}catch{return!1}}}if(o=r.child,r.subtreeFlags&16384&&o!==null)o.return=r,r=o;else{if(r===n)break;for(;r.sibling===null;){if(r.return===null||r.return===n)return!0;r=r.return}r.sibling.return=r.return,r=r.sibling}}return!0}function Zr(n,r){for(r&=~Ud,r&=~nc,n.suspendedLanes|=r,n.pingedLanes&=~r,n=n.expirationTimes;0<r;){var o=31-Le(r),u=1<<o;n[o]=-1,r&=~u}}function h0(n){if((Rt&6)!==0)throw Error(t(327));Sa();var r=bt(n,0);if((r&1)===0)return ti(n,en()),null;var o=lc(n,r);if(n.tag!==0&&o===2){var u=Ot(n);u!==0&&(r=u,o=Bd(n,u))}if(o===1)throw o=Uo,Ps(n,0),Zr(n,r),ti(n,en()),o;if(o===6)throw Error(t(345));return n.finishedWork=n.current.alternate,n.finishedLanes=r,Ns(n,ei,Sr),ti(n,en()),null}function Hd(n,r){var o=Rt;Rt|=1;try{return n(r)}finally{Rt=o,Rt===0&&(ya=en()+500,Ul&&Wr())}}function Rs(n){$r!==null&&$r.tag===0&&(Rt&6)===0&&Sa();var r=Rt;Rt|=1;var o=Mi.transition,u=vt;try{if(Mi.transition=null,vt=1,n)return n()}finally{vt=u,Mi.transition=o,Rt=r,(Rt&6)===0&&Wr()}}function Vd(){ui=va.current,$t(va)}function Ps(n,r){n.finishedWork=null,n.finishedLanes=0;var o=n.timeoutHandle;if(o!==-1&&(n.timeoutHandle=-1,cv(o)),hn!==null)for(o=hn.return;o!==null;){var u=o;switch(Zu(u),u.tag){case 1:u=u.type.childContextTypes,u!=null&&Dl();break;case 3:ga(),$t(Zn),$t(In),ud();break;case 5:ld(u);break;case 4:ga();break;case 13:$t(tn);break;case 19:$t(tn);break;case 10:id(u.type._context);break;case 22:case 23:Vd()}o=o.return}if(bn=n,hn=n=Qr(n.current,null),Pn=ui=r,_n=0,Uo=null,Ud=nc=Cs=0,ei=Oo=null,bs!==null){for(r=0;r<bs.length;r++)if(o=bs[r],u=o.interleaved,u!==null){o.interleaved=null;var p=u.next,v=o.pending;if(v!==null){var N=v.next;v.next=p,u.next=N}o.pending=u}bs=null}return n}function f0(n,r){do{var o=hn;try{if(nd(),jl.current=$l,Xl){for(var u=nn.memoizedState;u!==null;){var p=u.queue;p!==null&&(p.pending=null),u=u.next}Xl=!1}if(As=0,wn=gn=nn=null,Ro=!1,Po=0,Id.current=null,o===null||o.return===null){_n=1,Uo=r,hn=null;break}e:{var v=n,N=o.return,B=o,V=r;if(r=Pn,B.flags|=32768,V!==null&&typeof V=="object"&&typeof V.then=="function"){var ue=V,ye=B,Me=ye.tag;if((ye.mode&1)===0&&(Me===0||Me===11||Me===15)){var ve=ye.alternate;ve?(ye.updateQueue=ve.updateQueue,ye.memoizedState=ve.memoizedState,ye.lanes=ve.lanes):(ye.updateQueue=null,ye.memoizedState=null)}var Be=km(N);if(Be!==null){Be.flags&=-257,Bm(Be,N,B,v,r),Be.mode&1&&Fm(v,ue,r),r=Be,V=ue;var Xe=r.updateQueue;if(Xe===null){var Ye=new Set;Ye.add(V),r.updateQueue=Ye}else Xe.add(V);break e}else{if((r&1)===0){Fm(v,ue,r),Gd();break e}V=Error(t(426))}}else if(Qt&&B.mode&1){var un=km(N);if(un!==null){(un.flags&65536)===0&&(un.flags|=256),Bm(un,N,B,v,r),ed(_a(V,B));break e}}v=V=_a(V,B),_n!==4&&(_n=2),Oo===null?Oo=[v]:Oo.push(v),v=N;do{switch(v.tag){case 3:v.flags|=65536,r&=-r,v.lanes|=r;var re=Um(v,V,r);lm(v,re);break e;case 1:B=V;var Y=v.type,oe=v.stateNode;if((v.flags&128)===0&&(typeof Y.getDerivedStateFromError=="function"||oe!==null&&typeof oe.componentDidCatch=="function"&&(Yr===null||!Yr.has(oe)))){v.flags|=65536,r&=-r,v.lanes|=r;var be=Om(v,B,r);lm(v,be);break e}}v=v.return}while(v!==null)}g0(o)}catch(et){r=et,hn===o&&o!==null&&(hn=o=o.return);continue}break}while(!0)}function p0(){var n=tc.current;return tc.current=$l,n===null?$l:n}function Gd(){(_n===0||_n===3||_n===2)&&(_n=4),bn===null||(Cs&268435455)===0&&(nc&268435455)===0||Zr(bn,Pn)}function lc(n,r){var o=Rt;Rt|=2;var u=p0();(bn!==n||Pn!==r)&&(Sr=null,Ps(n,r));do try{Iv();break}catch(p){f0(n,p)}while(!0);if(nd(),Rt=o,tc.current=u,hn!==null)throw Error(t(261));return bn=null,Pn=0,_n}function Iv(){for(;hn!==null;)m0(hn)}function Uv(){for(;hn!==null&&!_l();)m0(hn)}function m0(n){var r=v0(n.alternate,n,ui);n.memoizedProps=n.pendingProps,r===null?g0(n):hn=r,Id.current=null}function g0(n){var r=n;do{var o=r.alternate;if(n=r.return,(r.flags&32768)===0){if(o=Av(o,r,ui),o!==null){hn=o;return}}else{if(o=Cv(o,r),o!==null){o.flags&=32767,hn=o;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{_n=6,hn=null;return}}if(r=r.sibling,r!==null){hn=r;return}hn=r=n}while(r!==null);_n===0&&(_n=5)}function Ns(n,r,o){var u=vt,p=Mi.transition;try{Mi.transition=null,vt=1,Ov(n,r,o,u)}finally{Mi.transition=p,vt=u}return null}function Ov(n,r,o,u){do Sa();while($r!==null);if((Rt&6)!==0)throw Error(t(327));o=n.finishedWork;var p=n.finishedLanes;if(o===null)return null;if(n.finishedWork=null,n.finishedLanes=0,o===n.current)throw Error(t(177));n.callbackNode=null,n.callbackPriority=0;var v=o.lanes|o.childLanes;if(Tt(n,v),n===bn&&(hn=bn=null,Pn=0),(o.subtreeFlags&2064)===0&&(o.flags&2064)===0||rc||(rc=!0,y0(L,function(){return Sa(),null})),v=(o.flags&15990)!==0,(o.subtreeFlags&15990)!==0||v){v=Mi.transition,Mi.transition=null;var N=vt;vt=1;var B=Rt;Rt|=4,Id.current=null,Pv(n,o),a0(o,n),nv(Gu),vl=!!Vu,Gu=Vu=null,n.current=o,Nv(o),Su(),Rt=B,vt=N,Mi.transition=v}else n.current=o;if(rc&&(rc=!1,$r=n,sc=p),v=n.pendingLanes,v===0&&(Yr=null),Ie(o.stateNode),ti(n,en()),r!==null)for(u=n.onRecoverableError,o=0;o<r.length;o++)p=r[o],u(p.value,{componentStack:p.stack,digest:p.digest});if(ic)throw ic=!1,n=Fd,Fd=null,n;return(sc&1)!==0&&n.tag!==0&&Sa(),v=n.pendingLanes,(v&1)!==0?n===kd?Fo++:(Fo=0,kd=n):Fo=0,Wr(),null}function Sa(){if($r!==null){var n=Ci(sc),r=Mi.transition,o=vt;try{if(Mi.transition=null,vt=16>n?16:n,$r===null)var u=!1;else{if(n=$r,$r=null,sc=0,(Rt&6)!==0)throw Error(t(331));var p=Rt;for(Rt|=4,We=n.current;We!==null;){var v=We,N=v.child;if((We.flags&16)!==0){var B=v.deletions;if(B!==null){for(var V=0;V<B.length;V++){var ue=B[V];for(We=ue;We!==null;){var ye=We;switch(ye.tag){case 0:case 11:case 15:Io(8,ye,v)}var Me=ye.child;if(Me!==null)Me.return=ye,We=Me;else for(;We!==null;){ye=We;var ve=ye.sibling,Be=ye.return;if(t0(ye),ye===ue){We=null;break}if(ve!==null){ve.return=Be,We=ve;break}We=Be}}}var Xe=v.alternate;if(Xe!==null){var Ye=Xe.child;if(Ye!==null){Xe.child=null;do{var un=Ye.sibling;Ye.sibling=null,Ye=un}while(Ye!==null)}}We=v}}if((v.subtreeFlags&2064)!==0&&N!==null)N.return=v,We=N;else e:for(;We!==null;){if(v=We,(v.flags&2048)!==0)switch(v.tag){case 0:case 11:case 15:Io(9,v,v.return)}var re=v.sibling;if(re!==null){re.return=v.return,We=re;break e}We=v.return}}var Y=n.current;for(We=Y;We!==null;){N=We;var oe=N.child;if((N.subtreeFlags&2064)!==0&&oe!==null)oe.return=N,We=oe;else e:for(N=Y;We!==null;){if(B=We,(B.flags&2048)!==0)try{switch(B.tag){case 0:case 11:case 15:ec(9,B)}}catch(et){on(B,B.return,et)}if(B===N){We=null;break e}var be=B.sibling;if(be!==null){be.return=B.return,We=be;break e}We=B.return}}if(Rt=p,Wr(),te&&typeof te.onPostCommitFiberRoot=="function")try{te.onPostCommitFiberRoot(ie,n)}catch{}u=!0}return u}finally{vt=o,Mi.transition=r}}return!1}function _0(n,r,o){r=_a(o,r),r=Um(n,r,1),n=Xr(n,r,1),r=jn(),n!==null&&(cn(n,1,r),ti(n,r))}function on(n,r,o){if(n.tag===3)_0(n,n,o);else for(;r!==null;){if(r.tag===3){_0(r,n,o);break}else if(r.tag===1){var u=r.stateNode;if(typeof r.type.getDerivedStateFromError=="function"||typeof u.componentDidCatch=="function"&&(Yr===null||!Yr.has(u))){n=_a(o,n),n=Om(r,n,1),r=Xr(r,n,1),n=jn(),r!==null&&(cn(r,1,n),ti(r,n));break}}r=r.return}}function Fv(n,r,o){var u=n.pingCache;u!==null&&u.delete(r),r=jn(),n.pingedLanes|=n.suspendedLanes&o,bn===n&&(Pn&o)===o&&(_n===4||_n===3&&(Pn&130023424)===Pn&&500>en()-Od?Ps(n,0):Ud|=o),ti(n,r)}function x0(n,r){r===0&&((n.mode&1)===0?r=1:(r=_t,_t<<=1,(_t&130023424)===0&&(_t=4194304)));var o=jn();n=xr(n,r),n!==null&&(cn(n,r,o),ti(n,o))}function kv(n){var r=n.memoizedState,o=0;r!==null&&(o=r.retryLane),x0(n,o)}function Bv(n,r){var o=0;switch(n.tag){case 13:var u=n.stateNode,p=n.memoizedState;p!==null&&(o=p.retryLane);break;case 19:u=n.stateNode;break;default:throw Error(t(314))}u!==null&&u.delete(r),x0(n,o)}var v0;v0=function(n,r,o){if(n!==null)if(n.memoizedProps!==r.pendingProps||Zn.current)Jn=!0;else{if((n.lanes&o)===0&&(r.flags&128)===0)return Jn=!1,Tv(n,r,o);Jn=(n.flags&131072)!==0}else Jn=!1,Qt&&(r.flags&1048576)!==0&&Qp(r,Fl,r.index);switch(r.lanes=0,r.tag){case 2:var u=r.type;Ql(n,r),n=r.pendingProps;var p=ca(r,In.current);ma(r,o),p=fd(null,r,u,n,p,o);var v=pd();return r.flags|=1,typeof p=="object"&&p!==null&&typeof p.render=="function"&&p.$$typeof===void 0?(r.tag=1,r.memoizedState=null,r.updateQueue=null,Qn(u)?(v=!0,Il(r)):v=!1,r.memoizedState=p.state!==null&&p.state!==void 0?p.state:null,ad(r),p.updater=Kl,r.stateNode=p,p._reactInternals=r,yd(r,u,n,o),r=wd(null,r,u,!0,v,o)):(r.tag=0,Qt&&v&&Ku(r),Wn(null,r,p,o),r=r.child),r;case 16:u=r.elementType;e:{switch(Ql(n,r),n=r.pendingProps,p=u._init,u=p(u._payload),r.type=u,p=r.tag=Hv(u),n=Ii(u,n),p){case 0:r=Ed(null,r,u,n,o);break e;case 1:r=jm(null,r,u,n,o);break e;case 11:r=zm(null,r,u,n,o);break e;case 14:r=Hm(null,r,u,Ii(u.type,n),o);break e}throw Error(t(306,u,""))}return r;case 0:return u=r.type,p=r.pendingProps,p=r.elementType===u?p:Ii(u,p),Ed(n,r,u,p,o);case 1:return u=r.type,p=r.pendingProps,p=r.elementType===u?p:Ii(u,p),jm(n,r,u,p,o);case 3:e:{if(Xm(r),n===null)throw Error(t(387));u=r.pendingProps,v=r.memoizedState,p=v.element,om(n,r),Gl(r,u,null,o);var N=r.memoizedState;if(u=N.element,v.isDehydrated)if(v={element:u,isDehydrated:!1,cache:N.cache,pendingSuspenseBoundaries:N.pendingSuspenseBoundaries,transitions:N.transitions},r.updateQueue.baseState=v,r.memoizedState=v,r.flags&256){p=_a(Error(t(423)),r),r=qm(n,r,u,o,p);break e}else if(u!==p){p=_a(Error(t(424)),r),r=qm(n,r,u,o,p);break e}else for(ci=Hr(r.stateNode.containerInfo.firstChild),li=r,Qt=!0,Di=null,o=sm(r,null,u,o),r.child=o;o;)o.flags=o.flags&-3|4096,o=o.sibling;else{if(ha(),u===p){r=yr(n,r,o);break e}Wn(n,r,u,o)}r=r.child}return r;case 5:return um(r),n===null&&Ju(r),u=r.type,p=r.pendingProps,v=n!==null?n.memoizedProps:null,N=p.children,Wu(u,p)?N=null:v!==null&&Wu(u,v)&&(r.flags|=32),Wm(n,r),Wn(n,r,N,o),r.child;case 6:return n===null&&Ju(r),null;case 13:return Ym(n,r,o);case 4:return od(r,r.stateNode.containerInfo),u=r.pendingProps,n===null?r.child=fa(r,null,u,o):Wn(n,r,u,o),r.child;case 11:return u=r.type,p=r.pendingProps,p=r.elementType===u?p:Ii(u,p),zm(n,r,u,p,o);case 7:return Wn(n,r,r.pendingProps,o),r.child;case 8:return Wn(n,r,r.pendingProps.children,o),r.child;case 12:return Wn(n,r,r.pendingProps.children,o),r.child;case 10:e:{if(u=r.type._context,p=r.pendingProps,v=r.memoizedProps,N=p.value,Xt(zl,u._currentValue),u._currentValue=N,v!==null)if(Li(v.value,N)){if(v.children===p.children&&!Zn.current){r=yr(n,r,o);break e}}else for(v=r.child,v!==null&&(v.return=r);v!==null;){var B=v.dependencies;if(B!==null){N=v.child;for(var V=B.firstContext;V!==null;){if(V.context===u){if(v.tag===1){V=vr(-1,o&-o),V.tag=2;var ue=v.updateQueue;if(ue!==null){ue=ue.shared;var ye=ue.pending;ye===null?V.next=V:(V.next=ye.next,ye.next=V),ue.pending=V}}v.lanes|=o,V=v.alternate,V!==null&&(V.lanes|=o),rd(v.return,o,r),B.lanes|=o;break}V=V.next}}else if(v.tag===10)N=v.type===r.type?null:v.child;else if(v.tag===18){if(N=v.return,N===null)throw Error(t(341));N.lanes|=o,B=N.alternate,B!==null&&(B.lanes|=o),rd(N,o,r),N=v.sibling}else N=v.child;if(N!==null)N.return=v;else for(N=v;N!==null;){if(N===r){N=null;break}if(v=N.sibling,v!==null){v.return=N.return,N=v;break}N=N.return}v=N}Wn(n,r,p.children,o),r=r.child}return r;case 9:return p=r.type,u=r.pendingProps.children,ma(r,o),p=yi(p),u=u(p),r.flags|=1,Wn(n,r,u,o),r.child;case 14:return u=r.type,p=Ii(u,r.pendingProps),p=Ii(u.type,p),Hm(n,r,u,p,o);case 15:return Vm(n,r,r.type,r.pendingProps,o);case 17:return u=r.type,p=r.pendingProps,p=r.elementType===u?p:Ii(u,p),Ql(n,r),r.tag=1,Qn(u)?(n=!0,Il(r)):n=!1,ma(r,o),Dm(r,u,p),yd(r,u,p,o),wd(null,r,u,!0,n,o);case 19:return Km(n,r,o);case 22:return Gm(n,r,o)}throw Error(t(156,r.tag))};function y0(n,r){return ys(n,r)}function zv(n,r,o,u){this.tag=n,this.key=o,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=r,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=u,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Ei(n,r,o,u){return new zv(n,r,o,u)}function Wd(n){return n=n.prototype,!(!n||!n.isReactComponent)}function Hv(n){if(typeof n=="function")return Wd(n)?1:0;if(n!=null){if(n=n.$$typeof,n===G)return 11;if(n===Q)return 14}return 2}function Qr(n,r){var o=n.alternate;return o===null?(o=Ei(n.tag,r,n.key,n.mode),o.elementType=n.elementType,o.type=n.type,o.stateNode=n.stateNode,o.alternate=n,n.alternate=o):(o.pendingProps=r,o.type=n.type,o.flags=0,o.subtreeFlags=0,o.deletions=null),o.flags=n.flags&14680064,o.childLanes=n.childLanes,o.lanes=n.lanes,o.child=n.child,o.memoizedProps=n.memoizedProps,o.memoizedState=n.memoizedState,o.updateQueue=n.updateQueue,r=n.dependencies,o.dependencies=r===null?null:{lanes:r.lanes,firstContext:r.firstContext},o.sibling=n.sibling,o.index=n.index,o.ref=n.ref,o}function cc(n,r,o,u,p,v){var N=2;if(u=n,typeof n=="function")Wd(n)&&(N=1);else if(typeof n=="string")N=5;else e:switch(n){case U:return Ls(o.children,p,v,r);case A:N=8,p|=8;break;case D:return n=Ei(12,o,r,p|2),n.elementType=D,n.lanes=v,n;case $:return n=Ei(13,o,r,p),n.elementType=$,n.lanes=v,n;case H:return n=Ei(19,o,r,p),n.elementType=H,n.lanes=v,n;case ne:return uc(o,p,v,r);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case k:N=10;break e;case z:N=9;break e;case G:N=11;break e;case Q:N=14;break e;case he:N=16,u=null;break e}throw Error(t(130,n==null?n:typeof n,""))}return r=Ei(N,o,r,p),r.elementType=n,r.type=u,r.lanes=v,r}function Ls(n,r,o,u){return n=Ei(7,n,u,r),n.lanes=o,n}function uc(n,r,o,u){return n=Ei(22,n,u,r),n.elementType=ne,n.lanes=o,n.stateNode={isHidden:!1},n}function jd(n,r,o){return n=Ei(6,n,null,r),n.lanes=o,n}function Xd(n,r,o){return r=Ei(4,n.children!==null?n.children:[],n.key,r),r.lanes=o,r.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},r}function Vv(n,r,o,u,p){this.tag=r,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=ke(0),this.expirationTimes=ke(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=ke(0),this.identifierPrefix=u,this.onRecoverableError=p,this.mutableSourceEagerHydrationData=null}function qd(n,r,o,u,p,v,N,B,V){return n=new Vv(n,r,o,B,V),r===1?(r=1,v===!0&&(r|=8)):r=0,v=Ei(3,null,null,r),n.current=v,v.stateNode=n,v.memoizedState={element:u,isDehydrated:o,cache:null,transitions:null,pendingSuspenseBoundaries:null},ad(v),n}function Gv(n,r,o){var u=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:P,key:u==null?null:""+u,children:n,containerInfo:r,implementation:o}}function S0(n){if(!n)return Gr;n=n._reactInternals;e:{if(Gn(n)!==n||n.tag!==1)throw Error(t(170));var r=n;do{switch(r.tag){case 3:r=r.stateNode.context;break e;case 1:if(Qn(r.type)){r=r.stateNode.__reactInternalMemoizedMergedChildContext;break e}}r=r.return}while(r!==null);throw Error(t(171))}if(n.tag===1){var o=n.type;if(Qn(o))return $p(n,o,r)}return r}function M0(n,r,o,u,p,v,N,B,V){return n=qd(o,u,!0,n,p,v,N,B,V),n.context=S0(null),o=n.current,u=jn(),p=Kr(o),v=vr(u,p),v.callback=r??null,Xr(o,v,p),n.current.lanes=p,cn(n,p,u),ti(n,u),n}function dc(n,r,o,u){var p=r.current,v=jn(),N=Kr(p);return o=S0(o),r.context===null?r.context=o:r.pendingContext=o,r=vr(v,N),r.payload={element:n},u=u===void 0?null:u,u!==null&&(r.callback=u),n=Xr(p,r,N),n!==null&&(Fi(n,p,N,v),Vl(n,p,N)),N}function hc(n){if(n=n.current,!n.child)return null;switch(n.child.tag){case 5:return n.child.stateNode;default:return n.child.stateNode}}function E0(n,r){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var o=n.retryLane;n.retryLane=o!==0&&o<r?o:r}}function Yd(n,r){E0(n,r),(n=n.alternate)&&E0(n,r)}function Wv(){return null}var w0=typeof reportError=="function"?reportError:function(n){console.error(n)};function $d(n){this._internalRoot=n}fc.prototype.render=$d.prototype.render=function(n){var r=this._internalRoot;if(r===null)throw Error(t(409));dc(n,r,null,null)},fc.prototype.unmount=$d.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var r=n.containerInfo;Rs(function(){dc(null,n,null,null)}),r[pr]=null}};function fc(n){this._internalRoot=n}fc.prototype.unstable_scheduleHydration=function(n){if(n){var r=Ri();n={blockedOn:null,target:n,priority:r};for(var o=0;o<kr.length&&r!==0&&r<kr[o].priority;o++);kr.splice(o,0,n),o===0&&up(n)}};function Kd(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function pc(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function b0(){}function jv(n,r,o,u,p){if(p){if(typeof u=="function"){var v=u;u=function(){var ue=hc(N);v.call(ue)}}var N=M0(r,u,n,0,null,!1,!1,"",b0);return n._reactRootContainer=N,n[pr]=N.current,So(n.nodeType===8?n.parentNode:n),Rs(),N}for(;p=n.lastChild;)n.removeChild(p);if(typeof u=="function"){var B=u;u=function(){var ue=hc(V);B.call(ue)}}var V=qd(n,0,!1,null,null,!1,!1,"",b0);return n._reactRootContainer=V,n[pr]=V.current,So(n.nodeType===8?n.parentNode:n),Rs(function(){dc(r,V,o,u)}),V}function mc(n,r,o,u,p){var v=o._reactRootContainer;if(v){var N=v;if(typeof p=="function"){var B=p;p=function(){var V=hc(N);B.call(V)}}dc(r,N,n,p)}else N=jv(o,r,n,p,u);return hc(N)}fr=function(n){switch(n.tag){case 3:var r=n.stateNode;if(r.current.memoizedState.isDehydrated){var o=He(r.pendingLanes);o!==0&&(Dn(r,o|1),ti(r,en()),(Rt&6)===0&&(ya=en()+500,Wr()))}break;case 13:Rs(function(){var u=xr(n,1);if(u!==null){var p=jn();Fi(u,n,1,p)}}),Yd(n,1)}},Dt=function(n){if(n.tag===13){var r=xr(n,134217728);if(r!==null){var o=jn();Fi(r,n,134217728,o)}Yd(n,134217728)}},Zt=function(n){if(n.tag===13){var r=Kr(n),o=xr(n,r);if(o!==null){var u=jn();Fi(o,n,r,u)}Yd(n,r)}},Ri=function(){return vt},Bt=function(n,r){var o=vt;try{return vt=n,r()}finally{vt=o}},tt=function(n,r,o){switch(r){case"input":if(gt(n,o),r=o.name,o.type==="radio"&&r!=null){for(o=n;o.parentNode;)o=o.parentNode;for(o=o.querySelectorAll("input[name="+JSON.stringify(""+r)+'][type="radio"]'),r=0;r<o.length;r++){var u=o[r];if(u!==n&&u.form===n.form){var p=Ll(u);if(!p)throw Error(t(90));ft(u),gt(u,p)}}}break;case"textarea":pn(n,o);break;case"select":r=o.value,r!=null&&xt(n,!!o.multiple,r,!1)}},Fe=Hd,xe=Rs;var Xv={usingClientEntryPoint:!1,Events:[wo,oa,Ll,ge,Re,Hd]},ko={findFiberByHostInstance:Ss,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},qv={bundleType:ko.bundleType,version:ko.version,rendererPackageName:ko.rendererPackageName,rendererConfig:ko.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:w.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=vs(n),n===null?null:n.stateNode},findFiberByHostInstance:ko.findFiberByHostInstance||Wv,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var gc=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!gc.isDisabled&&gc.supportsFiber)try{ie=gc.inject(qv),te=gc}catch{}}return ni.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Xv,ni.createPortal=function(n,r){var o=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Kd(r))throw Error(t(200));return Gv(n,r,null,o)},ni.createRoot=function(n,r){if(!Kd(n))throw Error(t(299));var o=!1,u="",p=w0;return r!=null&&(r.unstable_strictMode===!0&&(o=!0),r.identifierPrefix!==void 0&&(u=r.identifierPrefix),r.onRecoverableError!==void 0&&(p=r.onRecoverableError)),r=qd(n,1,!1,null,null,o,!1,u,p),n[pr]=r.current,So(n.nodeType===8?n.parentNode:n),new $d(r)},ni.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var r=n._reactInternals;if(r===void 0)throw typeof n.render=="function"?Error(t(188)):(n=Object.keys(n).join(","),Error(t(268,n)));return n=vs(r),n=n===null?null:n.stateNode,n},ni.flushSync=function(n){return Rs(n)},ni.hydrate=function(n,r,o){if(!pc(r))throw Error(t(200));return mc(null,n,r,!0,o)},ni.hydrateRoot=function(n,r,o){if(!Kd(n))throw Error(t(405));var u=o!=null&&o.hydratedSources||null,p=!1,v="",N=w0;if(o!=null&&(o.unstable_strictMode===!0&&(p=!0),o.identifierPrefix!==void 0&&(v=o.identifierPrefix),o.onRecoverableError!==void 0&&(N=o.onRecoverableError)),r=M0(r,null,n,1,o??null,p,!1,v,N),n[pr]=r.current,So(n),u)for(n=0;n<u.length;n++)o=u[n],p=o._getVersion,p=p(o._source),r.mutableSourceEagerHydrationData==null?r.mutableSourceEagerHydrationData=[o,p]:r.mutableSourceEagerHydrationData.push(o,p);return new fc(r)},ni.render=function(n,r,o){if(!pc(r))throw Error(t(200));return mc(null,n,r,!1,o)},ni.unmountComponentAtNode=function(n){if(!pc(n))throw Error(t(40));return n._reactRootContainer?(Rs(function(){mc(null,null,n,!1,function(){n._reactRootContainer=null,n[pr]=null})}),!0):!1},ni.unstable_batchedUpdates=Hd,ni.unstable_renderSubtreeIntoContainer=function(n,r,o,u){if(!pc(o))throw Error(t(200));if(n==null||n._reactInternals===void 0)throw Error(t(38));return mc(n,r,o,!1,u)},ni.version="18.3.1-next-f1338f8080-20240426",ni}var I0;function M_(){if(I0)return eh.exports;I0=1;function s(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s)}catch(e){console.error(e)}}return s(),eh.exports=ny(),eh.exports}var U0;function iy(){if(U0)return xc;U0=1;var s=M_();return xc.createRoot=s.createRoot,xc.hydrateRoot=s.hydrateRoot,xc}var ry=iy();const sy=S_(ry),ay=ln.createContext(void 0),oy=({client:s,children:e})=>(ln.useEffect(()=>(s.mount(),()=>{s.unmount()}),[s]),E.jsx(ay.Provider,{value:s,children:e})),ly={setTimeout:(s,e)=>setTimeout(s,e),clearTimeout:s=>clearTimeout(s),setInterval:(s,e)=>setInterval(s,e),clearInterval:s=>clearInterval(s)};var os,Df,h_,cy=(h_=class{constructor(){wt(this,os,ly);wt(this,Df,!1)}setTimeoutProvider(s){at(this,os,s)}setTimeout(s,e){return me(this,os).setTimeout(s,e)}clearTimeout(s){me(this,os).clearTimeout(s)}setInterval(s,e){return me(this,os).setInterval(s,e)}clearInterval(s){me(this,os).clearInterval(s)}},os=new WeakMap,Df=new WeakMap,h_);const Hh=new cy;function uy(s){setTimeout(s,0)}const dy=typeof window>"u"||"Deno"in globalThis;function Ai(){}function hy(s,e){return typeof s=="function"?s(e):s}function fy(s){return typeof s=="number"&&s>=0&&s!==1/0}function py(s,e){return Math.max(s+(e||0)-Date.now(),0)}function tl(s,e){return typeof s=="function"?s(e):s}function O0(s,e){const{type:t="all",exact:i,fetchStatus:a,predicate:l,queryKey:c,stale:d}=s;if(c){if(i){if(e.queryHash!==Uf(c,e.options))return!1}else if(!Qa(e.queryKey,c))return!1}if(t!=="all"){const h=e.isActive();if(t==="active"&&!h||t==="inactive"&&h)return!1}return!(typeof d=="boolean"&&e.isStale()!==d||a&&a!==e.state.fetchStatus||l&&!l(e))}function F0(s,e){const{exact:t,status:i,predicate:a,mutationKey:l}=s;if(l){if(!e.options.mutationKey)return!1;if(t){if(il(e.options.mutationKey)!==il(l))return!1}else if(!Qa(e.options.mutationKey,l))return!1}return!(i&&e.state.status!==i||a&&!a(e))}function Uf(s,e){return((e==null?void 0:e.queryKeyHashFn)||il)(s)}function il(s){return JSON.stringify(s,(e,t)=>Vh(t)?Object.keys(t).sort().reduce((i,a)=>(i[a]=t[a],i),{}):t)}function Qa(s,e){if(s===e)return!0;if(typeof s!=typeof e)return!1;if(s&&e&&typeof s=="object"&&typeof e=="object"){if(Array.isArray(s)&&Array.isArray(e)){if(e.length>s.length)return!1;for(let i=0;i<e.length;i++)if(!Qa(s[i],e[i]))return!1;return!0}const t=Object.keys(e);for(const i of t)if(!Qa(s[i],e[i]))return!1;return!0}return!1}const my=Object.prototype.hasOwnProperty;function E_(s,e,t=0){if(s===e)return s;if(t>500)return e;const i=k0(s)&&k0(e);if(!i&&!(Vh(s)&&Vh(e)))return e;const a=(i?s:Object.keys(s)).length,l=i?e:Object.keys(e),c=l.length,d=i?new Array(c):{};let h=0;for(let f=0;f<c;f++){const _=i?f:l[f],m=s[_],g=e[_];if(m===g){d[_]=m,(i?f<a:my.call(s,_))&&h++;continue}if(m===null||g===null||typeof m!="object"||typeof g!="object"){d[_]=g;continue}const y=E_(m,g,t+1);d[_]=y,y===m&&h++}return a===c&&h===a?s:d}function k0(s){return Array.isArray(s)&&s.length===Object.keys(s).length}function Vh(s){if(!B0(s))return!1;const e=Object.getPrototypeOf(s),t=e==null?void 0:e.constructor;if(t===void 0)return!0;if(typeof t!="function")return!1;const i=t.prototype;return!(!B0(i)||!i.hasOwnProperty("isPrototypeOf")||e!==Object.prototype)}function B0(s){return Object.prototype.toString.call(s)==="[object Object]"}function gy(s){return new Promise(e=>{Hh.setTimeout(e,s)})}function _y(s,e,t){return typeof t.structuralSharing=="function"?t.structuralSharing(s,e):t.structuralSharing!==!1?E_(s,e):e}function xy(s,e,t=0){const i=[...s,e];return t&&i.length>t?i.slice(1):i}function vy(s,e,t=0){const i=[e,...s];return t&&i.length>t?i.slice(0,-1):i}const Of=Symbol();function w_(s,e){return!s.queryFn&&(e!=null&&e.initialPromise)?()=>e.initialPromise:!s.queryFn||s.queryFn===Of?()=>Promise.reject(new Error(`Missing queryFn: '${s.queryHash}'`)):s.queryFn}function yy(s,e,t){let i=!1,a;return Object.defineProperty(s,"signal",{enumerable:!0,get:()=>(a??(a=e()),i||(i=!0,a.aborted?t():a.addEventListener("abort",t,{once:!0})),a)}),s}let Sy=()=>dy;const b_=()=>Sy();var pu=class{constructor(){this.listeners=new Set,this.subscribe=this.subscribe.bind(this)}subscribe(s){return this.listeners.add(s),this.onSubscribe(),()=>{this.listeners.delete(s),this.onUnsubscribe()}}hasListeners(){return this.listeners.size>0}onSubscribe(){}onUnsubscribe(){}},zs,ls,Ga,f_,My=(f_=class extends pu{constructor(){super();wt(this,zs);wt(this,ls);wt(this,Ga);at(this,Ga,e=>{if(typeof window<"u"&&window.addEventListener){const t=()=>e();return window.addEventListener("visibilitychange",t,!1),()=>{window.removeEventListener("visibilitychange",t)}}})}onSubscribe(){me(this,ls)||this.setEventListener(me(this,Ga))}onUnsubscribe(){var e;this.hasListeners()||((e=me(this,ls))==null||e.call(this),at(this,ls,void 0))}setEventListener(e){var t;at(this,Ga,e),(t=me(this,ls))==null||t.call(this),at(this,ls,e(i=>{typeof i=="boolean"?this.setFocused(i):this.onFocus()}))}setFocused(e){me(this,zs)!==e&&(at(this,zs,e),this.onFocus())}onFocus(){const e=this.isFocused();this.listeners.forEach(t=>{t(e)})}isFocused(){var e;return typeof me(this,zs)=="boolean"?me(this,zs):((e=globalThis.document)==null?void 0:e.visibilityState)!=="hidden"}},zs=new WeakMap,ls=new WeakMap,Ga=new WeakMap,f_);const T_=new My,Ey=uy;function wy(){let s=[],e=0,t=d=>{d()},i=d=>{d()},a=Ey;const l=d=>{e?s.push(d):a(()=>{t(d)})},c=()=>{const d=s;s=[],d.length&&a(()=>{i(()=>{d.forEach(h=>{t(h)})})})};return{batch:d=>{let h;e++;try{h=d()}finally{e--,e||c()}return h},batchCalls:d=>(...h)=>{l(()=>{d(...h)})},schedule:l,setNotifyFunction:d=>{t=d},setBatchNotifyFunction:d=>{i=d},setScheduler:d=>{a=d}}}const Yn=wy();var Wa,cs,ja,p_,by=(p_=class extends pu{constructor(){super();wt(this,Wa,!0);wt(this,cs);wt(this,ja);at(this,ja,e=>{if(typeof window<"u"&&window.addEventListener){const t=()=>e(!0),i=()=>e(!1);return window.addEventListener("online",t,!1),window.addEventListener("offline",i,!1),()=>{window.removeEventListener("online",t),window.removeEventListener("offline",i)}}})}onSubscribe(){me(this,cs)||this.setEventListener(me(this,ja))}onUnsubscribe(){var e;this.hasListeners()||((e=me(this,cs))==null||e.call(this),at(this,cs,void 0))}setEventListener(e){var t;at(this,ja,e),(t=me(this,cs))==null||t.call(this),at(this,cs,e(this.setOnline.bind(this)))}setOnline(e){me(this,Wa)!==e&&(at(this,Wa,e),this.listeners.forEach(t=>{t(e)}))}isOnline(){return me(this,Wa)}},Wa=new WeakMap,cs=new WeakMap,ja=new WeakMap,p_);const nu=new by;function Ty(s){return Math.min(1e3*2**s,3e4)}function A_(s){return(s??"online")==="online"?nu.isOnline():!0}var Gh=class extends Error{constructor(s){super("CancelledError"),this.revert=s==null?void 0:s.revert,this.silent=s==null?void 0:s.silent}};function C_(s){let e=!1,t=0,i,a="pending",l,c;const d=new Promise((C,I)=>{l=C,c=I});d.catch(Ai);const h=()=>a!=="pending",f=C=>{var I;if(!h()){const w=new Gh(C);T(w),(I=s.onCancel)==null||I.call(s,w)}},_=()=>{e=!0},m=()=>{e=!1},g=()=>T_.isFocused()&&(s.networkMode==="always"||nu.isOnline())&&s.canRun(),y=()=>A_(s.networkMode)&&s.canRun(),M=C=>{h()||(i==null||i(),a="resolved",l(C))},T=C=>{h()||(i==null||i(),a="rejected",c(C))},S=()=>new Promise(C=>{var I;i=w=>{(h()||g())&&C(w)},(I=s.onPause)==null||I.call(s)}).then(()=>{var C;i=void 0,h()||(C=s.onContinue)==null||C.call(s)}),x=()=>{if(h())return;let C;const I=t===0?s.initialPromise:void 0;try{C=I??s.fn()}catch(w){C=Promise.reject(w)}Promise.resolve(C).then(M).catch(w=>{var D;if(h())return;const R=s.retry??(b_()?0:3),P=s.retryDelay??Ty,U=typeof P=="function"?P(t,w):P,A=R===!0||typeof R=="number"&&t<R||typeof R=="function"&&R(t,w);if(e||!A){T(w);return}t++,(D=s.onFail)==null||D.call(s,t,w),gy(U).then(()=>g()?void 0:S()).then(()=>{e?T(w):x()})})};return{promise:d,status:()=>a,cancel:f,continue:()=>(i==null||i(),d),cancelRetry:_,continueRetry:m,canStart:y,start:()=>(y()?x():S().then(x),d)}}var Hs,m_,R_=(m_=class{constructor(){wt(this,Hs)}destroy(){this.clearGcTimeout()}scheduleGc(){this.clearGcTimeout(),fy(this.gcTime)&&at(this,Hs,Hh.setTimeout(()=>{this.optionalRemove()},this.gcTime))}updateGcTime(s){this.gcTime=Math.max(this.gcTime||0,s??(b_()?1/0:3e5))}clearGcTimeout(){me(this,Hs)!==void 0&&(Hh.clearTimeout(me(this,Hs)),at(this,Hs,void 0))}},Hs=new WeakMap,m_);function Ay(s){return{onFetch:(e,t)=>{var _,m,g,y,M;const i=e.options,a=(g=(m=(_=e.fetchOptions)==null?void 0:_.meta)==null?void 0:m.fetchMore)==null?void 0:g.direction,l=((y=e.state.data)==null?void 0:y.pages)||[],c=((M=e.state.data)==null?void 0:M.pageParams)||[];let d={pages:[],pageParams:[]},h=0;const f=async()=>{let T=!1;const S=I=>{yy(I,()=>e.signal,()=>T=!0)},x=w_(e.options,e.fetchOptions),C=async(I,w,R)=>{if(T)return Promise.reject(e.signal.reason);if(w==null&&I.pages.length)return Promise.resolve(I);const U=(()=>{const z={client:e.client,queryKey:e.queryKey,pageParam:w,direction:R?"backward":"forward",meta:e.options.meta};return S(z),z})(),A=await x(U),{maxPages:D}=e.options,k=R?vy:xy;return{pages:k(I.pages,A,D),pageParams:k(I.pageParams,w,D)}};if(a&&l.length){const I=a==="backward",w=I?Cy:z0,R={pages:l,pageParams:c};d=await C(R,w(i,R),I)}else{const I=s??l.length;do{const w=h===0?c[0]??i.initialPageParam:z0(i,d);if(h>0&&w==null)break;d=await C(d,w),h++}while(h<I)}return d};e.options.persister?e.fetchFn=()=>{var T,S;return(S=(T=e.options).persister)==null?void 0:S.call(T,f,{client:e.client,queryKey:e.queryKey,meta:e.options.meta,signal:e.signal},t)}:e.fetchFn=f}}}function z0(s,{pages:e,pageParams:t}){const i=e.length-1;return e.length>0?s.getNextPageParam(e[i],e,t[i],t):void 0}function Cy(s,{pages:e,pageParams:t}){var i;return e.length>0?(i=s.getPreviousPageParam)==null?void 0:i.call(s,e[0],e,t[0],t):void 0}var Xa,Vs,qa,Ti,Gs,vn,ul,Ws,Hi,Cr,g_,Ry=(g_=class extends R_{constructor(e){super();wt(this,Hi);wt(this,Xa);wt(this,Vs);wt(this,qa);wt(this,Ti);wt(this,Gs);wt(this,vn);wt(this,ul);wt(this,Ws);at(this,Ws,!1),at(this,ul,e.defaultOptions),this.setOptions(e.options),this.observers=[],at(this,Gs,e.client),at(this,Ti,me(this,Gs).getQueryCache()),this.queryKey=e.queryKey,this.queryHash=e.queryHash,at(this,Vs,V0(this.options)),this.state=e.state??me(this,Vs),this.scheduleGc()}get meta(){return this.options.meta}get queryType(){return me(this,Xa)}get promise(){var e;return(e=me(this,vn))==null?void 0:e.promise}setOptions(e){if(this.options={...me(this,ul),...e},e!=null&&e._type&&at(this,Xa,e._type),this.updateGcTime(this.options.gcTime),this.state&&this.state.data===void 0){const t=V0(this.options);t.data!==void 0&&(this.setState(H0(t.data,t.dataUpdatedAt)),at(this,Vs,t))}}optionalRemove(){!this.observers.length&&this.state.fetchStatus==="idle"&&me(this,Ti).remove(this)}setData(e,t){const i=_y(this.state.data,e,this.options);return kn(this,Hi,Cr).call(this,{data:i,type:"success",dataUpdatedAt:t==null?void 0:t.updatedAt,manual:t==null?void 0:t.manual}),i}setState(e){kn(this,Hi,Cr).call(this,{type:"setState",state:e})}cancel(e){var i,a;const t=(i=me(this,vn))==null?void 0:i.promise;return(a=me(this,vn))==null||a.cancel(e),t?t.then(Ai).catch(Ai):Promise.resolve()}destroy(){super.destroy(),this.cancel({silent:!0})}get resetState(){return me(this,Vs)}reset(){this.destroy(),this.setState(this.resetState)}isActive(){return this.observers.some(e=>tl(e.options.enabled,this)!==!1)}isDisabled(){return this.getObserversCount()>0?!this.isActive():this.options.queryFn===Of||!this.isFetched()}isFetched(){return this.state.dataUpdateCount+this.state.errorUpdateCount>0}isStatic(){return this.getObserversCount()>0?this.observers.some(e=>tl(e.options.staleTime,this)==="static"):!1}isStale(){return this.getObserversCount()>0?this.observers.some(e=>e.getCurrentResult().isStale):this.state.data===void 0||this.state.isInvalidated}isStaleByTime(e=0){return this.state.data===void 0?!0:e==="static"?!1:this.state.isInvalidated?!0:!py(this.state.dataUpdatedAt,e)}onFocus(){var e,t;(e=this.observers.find(i=>i.shouldFetchOnWindowFocus()))==null||e.refetch({cancelRefetch:!1}),(t=me(this,vn))==null||t.continue()}onOnline(){var e,t;(e=this.observers.find(i=>i.shouldFetchOnReconnect()))==null||e.refetch({cancelRefetch:!1}),(t=me(this,vn))==null||t.continue()}addObserver(e){this.observers.includes(e)||(this.observers.push(e),this.clearGcTimeout(),me(this,Ti).notify({type:"observerAdded",query:this,observer:e}))}removeObserver(e){const t=this.observers.indexOf(e);t!==-1&&(this.observers.splice(t,1),this.observers.length||(me(this,vn)&&(me(this,Ws)||this.state.fetchStatus==="paused"&&this.state.status==="pending"?me(this,vn).cancel({revert:!0}):me(this,vn).cancelRetry()),this.scheduleGc()),me(this,Ti).notify({type:"observerRemoved",query:this,observer:e}))}getObserversCount(){return this.observers.length}invalidate(){this.state.isInvalidated||kn(this,Hi,Cr).call(this,{type:"invalidate"})}async fetch(e,t){var f,_,m,g,y,M,T,S,x,C,I,w;if(this.state.fetchStatus!=="idle"&&((f=me(this,vn))==null?void 0:f.status())!=="rejected"){if(this.state.data!==void 0&&(t!=null&&t.cancelRefetch))this.cancel({silent:!0});else if(me(this,vn))return me(this,vn).continueRetry(),me(this,vn).promise}if(e&&this.setOptions(e),!this.options.queryFn){const R=this.observers.find(P=>P.options.queryFn);R&&this.setOptions(R.options)}const i=new AbortController,a=R=>{Object.defineProperty(R,"signal",{enumerable:!0,get:()=>(at(this,Ws,!0),i.signal)})},l=()=>{const R=w_(this.options,t),U=(()=>{const A={client:me(this,Gs),queryKey:this.queryKey,meta:this.meta};return a(A),A})();return at(this,Ws,!1),this.options.persister?this.options.persister(R,U,this):R(U)},d=(()=>{const R={fetchOptions:t,options:this.options,queryKey:this.queryKey,client:me(this,Gs),state:this.state,fetchFn:l};return a(R),R})();(_=me(this,Xa)==="infinite"?Ay(this.options.pages):this.options.behavior)==null||_.onFetch(d,this),at(this,qa,this.state),(this.state.fetchStatus==="idle"||this.state.fetchMeta!==((m=d.fetchOptions)==null?void 0:m.meta))&&kn(this,Hi,Cr).call(this,{type:"fetch",meta:(g=d.fetchOptions)==null?void 0:g.meta});const h=at(this,vn,C_({initialPromise:t==null?void 0:t.initialPromise,fn:d.fetchFn,onCancel:R=>{R instanceof Gh&&R.revert&&this.setState({...me(this,qa),fetchStatus:"idle"}),i.abort()},onFail:(R,P)=>{kn(this,Hi,Cr).call(this,{type:"failed",failureCount:R,error:P})},onPause:()=>{kn(this,Hi,Cr).call(this,{type:"pause"})},onContinue:()=>{kn(this,Hi,Cr).call(this,{type:"continue"})},retry:d.options.retry,retryDelay:d.options.retryDelay,networkMode:d.options.networkMode,canRun:()=>!0}));try{const R=await h.start();if(R===void 0)throw new Error(`${this.queryHash} data is undefined`);return this.setData(R),(M=(y=me(this,Ti).config).onSuccess)==null||M.call(y,R,this),(S=(T=me(this,Ti).config).onSettled)==null||S.call(T,R,this.state.error,this),R}catch(R){if(R instanceof Gh){if(R.silent)return me(this,vn).promise;if(R.revert){if(this.state.data===void 0)throw R;return this.state.data}}throw kn(this,Hi,Cr).call(this,{type:"error",error:R}),(C=(x=me(this,Ti).config).onError)==null||C.call(x,R,this),(w=(I=me(this,Ti).config).onSettled)==null||w.call(I,this.state.data,R,this),R}finally{me(this,vn)===h&&at(this,vn,void 0),this.scheduleGc()}}},Xa=new WeakMap,Vs=new WeakMap,qa=new WeakMap,Ti=new WeakMap,Gs=new WeakMap,vn=new WeakMap,ul=new WeakMap,Ws=new WeakMap,Hi=new WeakSet,Cr=function(e){const t=i=>{switch(e.type){case"failed":return{...i,fetchFailureCount:e.failureCount,fetchFailureReason:e.error};case"pause":return{...i,fetchStatus:"paused"};case"continue":return{...i,fetchStatus:"fetching"};case"fetch":return{...i,...Py(i.data,this.options),fetchMeta:e.meta??null};case"success":const a={...i,...H0(e.data,e.dataUpdatedAt),dataUpdateCount:i.dataUpdateCount+1,...!e.manual&&{fetchStatus:"idle",fetchFailureCount:0,fetchFailureReason:null}};return at(this,qa,e.manual?a:void 0),a;case"error":const l=e.error;return{...i,error:l,errorUpdateCount:i.errorUpdateCount+1,errorUpdatedAt:Date.now(),fetchFailureCount:i.fetchFailureCount+1,fetchFailureReason:l,fetchStatus:"idle",status:"error",isInvalidated:!0};case"invalidate":return{...i,isInvalidated:!0};case"setState":return{...i,...e.state}}};this.state=t(this.state),Yn.batch(()=>{this.observers.slice().forEach(i=>{i.onQueryUpdate()}),me(this,Ti).notify({query:this,type:"updated",action:e})})},g_);function Py(s,e){return{fetchFailureCount:0,fetchFailureReason:null,fetchStatus:A_(e.networkMode)?"fetching":"paused",...s===void 0&&{error:null,status:"pending"}}}function H0(s,e){return{data:s,dataUpdatedAt:e??Date.now(),error:null,isInvalidated:!1,status:"success"}}function V0(s){const e=typeof s.initialData=="function"?s.initialData():s.initialData,t=e!==void 0,i=t?typeof s.initialDataUpdatedAt=="function"?s.initialDataUpdatedAt():s.initialDataUpdatedAt:0;return{data:e,dataUpdateCount:0,dataUpdatedAt:t?i??Date.now():0,error:null,errorUpdateCount:0,errorUpdatedAt:0,fetchFailureCount:0,fetchFailureReason:null,fetchMeta:null,isInvalidated:!1,status:t?"success":"pending",fetchStatus:"idle"}}var dl,nr,Hn,js,ir,ss,__,Ny=(__=class extends R_{constructor(e){super();wt(this,ir);wt(this,dl);wt(this,nr);wt(this,Hn);wt(this,js);at(this,dl,e.client),this.mutationId=e.mutationId,at(this,Hn,e.mutationCache),at(this,nr,[]),this.state=e.state||Ly(),this.setOptions(e.options),this.scheduleGc()}setOptions(e){this.options=e,this.updateGcTime(this.options.gcTime)}get meta(){return this.options.meta}addObserver(e){me(this,nr).includes(e)||(me(this,nr).push(e),this.clearGcTimeout(),me(this,Hn).notify({type:"observerAdded",mutation:this,observer:e}))}removeObserver(e){at(this,nr,me(this,nr).filter(t=>t!==e)),this.scheduleGc(),me(this,Hn).notify({type:"observerRemoved",mutation:this,observer:e})}optionalRemove(){me(this,nr).length||(this.state.status==="pending"?this.scheduleGc():me(this,Hn).remove(this))}continue(){var e;return((e=me(this,js))==null?void 0:e.continue())??(this.state.status==="pending"?this.execute(this.state.variables):Promise.resolve())}async execute(e){var d,h,f,_,m,g,y,M,T,S,x,C,I,w,R,P,U,A;const t=()=>{kn(this,ir,ss).call(this,{type:"continue"})},i={client:me(this,dl),meta:this.options.meta,mutationKey:this.options.mutationKey},a=at(this,js,C_({fn:()=>this.options.mutationFn?this.options.mutationFn(e,i):Promise.reject(new Error("No mutationFn found")),onFail:(D,k)=>{kn(this,ir,ss).call(this,{type:"failed",failureCount:D,error:k})},onPause:()=>{kn(this,ir,ss).call(this,{type:"pause"})},onContinue:t,retry:this.options.retry??0,retryDelay:this.options.retryDelay,networkMode:this.options.networkMode,canRun:()=>me(this,Hn).canRun(this)})),l=this.state.status==="pending",c=!a.canStart();try{if(l)t();else{kn(this,ir,ss).call(this,{type:"pending",variables:e,isPaused:c}),me(this,Hn).config.onMutate&&await me(this,Hn).config.onMutate(e,this,i);const k=await((h=(d=this.options).onMutate)==null?void 0:h.call(d,e,i));k!==this.state.context&&kn(this,ir,ss).call(this,{type:"pending",context:k,variables:e,isPaused:c})}const D=await a.start();return await((_=(f=me(this,Hn).config).onSuccess)==null?void 0:_.call(f,D,e,this.state.context,this,i)),await((g=(m=this.options).onSuccess)==null?void 0:g.call(m,D,e,this.state.context,i)),await((M=(y=me(this,Hn).config).onSettled)==null?void 0:M.call(y,D,null,this.state.variables,this.state.context,this,i)),await((S=(T=this.options).onSettled)==null?void 0:S.call(T,D,null,e,this.state.context,i)),kn(this,ir,ss).call(this,{type:"success",data:D}),D}catch(D){try{await((C=(x=me(this,Hn).config).onError)==null?void 0:C.call(x,D,e,this.state.context,this,i))}catch(k){Promise.reject(k)}try{await((w=(I=this.options).onError)==null?void 0:w.call(I,D,e,this.state.context,i))}catch(k){Promise.reject(k)}try{await((P=(R=me(this,Hn).config).onSettled)==null?void 0:P.call(R,void 0,D,this.state.variables,this.state.context,this,i))}catch(k){Promise.reject(k)}try{await((A=(U=this.options).onSettled)==null?void 0:A.call(U,void 0,D,e,this.state.context,i))}catch(k){Promise.reject(k)}throw kn(this,ir,ss).call(this,{type:"error",error:D}),D}finally{me(this,js)===a&&at(this,js,void 0),me(this,Hn).runNext(this)}}},dl=new WeakMap,nr=new WeakMap,Hn=new WeakMap,js=new WeakMap,ir=new WeakSet,ss=function(e){const t=i=>{switch(e.type){case"failed":return{...i,failureCount:e.failureCount,failureReason:e.error};case"pause":return{...i,isPaused:!0};case"continue":return{...i,isPaused:!1};case"pending":return{...i,context:e.context,data:void 0,failureCount:0,failureReason:null,error:null,isPaused:e.isPaused,status:"pending",variables:e.variables,submittedAt:Date.now()};case"success":return{...i,data:e.data,failureCount:0,failureReason:null,error:null,status:"success",isPaused:!1};case"error":return{...i,data:void 0,error:e.error,failureCount:i.failureCount+1,failureReason:e.error,isPaused:!1,status:"error"}}};this.state=t(this.state),Yn.batch(()=>{me(this,nr).forEach(i=>{i.onMutationUpdate(e)}),me(this,Hn).notify({mutation:this,type:"updated",action:e})})},__);function Ly(){return{context:void 0,data:void 0,error:null,failureCount:0,failureReason:null,isPaused:!1,status:"idle",variables:void 0,submittedAt:0}}var Pr,Vi,hl,x_,Dy=(x_=class extends pu{constructor(e={}){super();wt(this,Pr);wt(this,Vi);wt(this,hl);this.config=e,at(this,Pr,new Set),at(this,Vi,new Map),at(this,hl,0)}build(e,t,i){const a=new Ny({client:e,mutationCache:this,mutationId:++_c(this,hl)._,options:e.defaultMutationOptions(t),state:i});return this.add(a),a}add(e){me(this,Pr).add(e);const t=vc(e);if(typeof t=="string"){const i=me(this,Vi).get(t);i?i.push(e):me(this,Vi).set(t,[e])}this.notify({type:"added",mutation:e})}remove(e){if(me(this,Pr).delete(e)){const t=vc(e);if(typeof t=="string"){const i=me(this,Vi).get(t);if(i)if(i.length>1){const a=i.indexOf(e);a!==-1&&i.splice(a,1)}else i[0]===e&&me(this,Vi).delete(t)}}this.notify({type:"removed",mutation:e})}canRun(e){var i;const t=vc(e);if(typeof t=="string"){const a=(i=me(this,Vi).get(t))==null?void 0:i.find(l=>l.state.status==="pending");return!a||a===e}else return!0}runNext(e){var i,a;const t=vc(e);return typeof t=="string"?((a=(i=me(this,Vi).get(t))==null?void 0:i.find(l=>l!==e&&l.state.isPaused))==null?void 0:a.continue())??Promise.resolve():Promise.resolve()}clear(){Yn.batch(()=>{me(this,Pr).forEach(e=>{this.notify({type:"removed",mutation:e})}),me(this,Pr).clear(),me(this,Vi).clear()})}getAll(){return Array.from(me(this,Pr))}find(e){const t={exact:!0,...e};return this.getAll().find(i=>F0(t,i))}findAll(e={}){return this.getAll().filter(t=>F0(e,t))}notify(e){Yn.batch(()=>{this.listeners.forEach(t=>{t(e)})})}resumePausedMutations(){const e=this.getAll().filter(t=>t.state.isPaused);return Yn.batch(()=>Promise.all(e.map(t=>t.continue().catch(Ai))))}},Pr=new WeakMap,Vi=new WeakMap,hl=new WeakMap,x_);function vc(s){var e;return(e=s.options.scope)==null?void 0:e.id}var rr,v_,Iy=(v_=class extends pu{constructor(e={}){super();wt(this,rr);this.config=e,at(this,rr,new Map)}build(e,t,i){const a=t.queryKey,l=t.queryHash??Uf(a,t);let c=this.get(l);return c||(c=new Ry({client:e,queryKey:a,queryHash:l,options:e.defaultQueryOptions(t),state:i,defaultOptions:e.getQueryDefaults(a)}),this.add(c)),c}add(e){me(this,rr).has(e.queryHash)||(me(this,rr).set(e.queryHash,e),this.notify({type:"added",query:e}))}remove(e){me(this,rr).get(e.queryHash)===e&&(e.destroy(),me(this,rr).delete(e.queryHash),this.notify({type:"removed",query:e}))}clear(){Yn.batch(()=>{this.getAll().forEach(e=>{this.remove(e)})})}get(e){return me(this,rr).get(e)}getAll(){return[...me(this,rr).values()]}find(e){const t={exact:!0,...e};return this.getAll().find(i=>O0(t,i))}findAll(e={}){const t=this.getAll();return Object.keys(e).length>0?t.filter(i=>O0(e,i)):t}notify(e){Yn.batch(()=>{this.listeners.forEach(t=>{t(e)})})}onFocus(){Yn.batch(()=>{this.getAll().forEach(e=>{e.onFocus()})})}onOnline(){Yn.batch(()=>{this.getAll().forEach(e=>{e.onOnline()})})}},rr=new WeakMap,v_),rn,us,ds,Ya,$a,hs,Ka,Za,y_,Uy=(y_=class{constructor(s={}){wt(this,rn);wt(this,us);wt(this,ds);wt(this,Ya);wt(this,$a);wt(this,hs);wt(this,Ka);wt(this,Za);at(this,rn,s.queryCache||new Iy),at(this,us,s.mutationCache||new Dy),at(this,ds,s.defaultOptions||{}),at(this,Ya,new Map),at(this,$a,new Map),at(this,hs,0)}mount(){_c(this,hs)._++,me(this,hs)===1&&(at(this,Ka,T_.subscribe(async s=>{s&&(await this.resumePausedMutations(),me(this,rn).onFocus())})),at(this,Za,nu.subscribe(async s=>{s&&(await this.resumePausedMutations(),me(this,rn).onOnline())})))}unmount(){var s,e;_c(this,hs)._--,me(this,hs)===0&&((s=me(this,Ka))==null||s.call(this),at(this,Ka,void 0),(e=me(this,Za))==null||e.call(this),at(this,Za,void 0))}isFetching(s){return me(this,rn).findAll({...s,fetchStatus:"fetching"}).length}isMutating(s){return me(this,us).findAll({...s,status:"pending"}).length}getQueryData(s){var t;const e=this.defaultQueryOptions({queryKey:s});return(t=me(this,rn).get(e.queryHash))==null?void 0:t.state.data}ensureQueryData(s){const e=this.defaultQueryOptions(s),t=me(this,rn).build(this,e),i=t.state.data;return i===void 0?this.fetchQuery(s):(s.revalidateIfStale&&t.isStaleByTime(tl(e.staleTime,t))&&this.prefetchQuery(e),Promise.resolve(i))}getQueriesData(s){return me(this,rn).findAll(s).map(({queryKey:e,state:t})=>[e,t.data])}setQueryData(s,e,t){var c;const i=this.defaultQueryOptions({queryKey:s}),a=(c=me(this,rn).get(i.queryHash))==null?void 0:c.state.data,l=hy(e,a);if(l!==void 0)return me(this,rn).build(this,i).setData(l,{...t,manual:!0})}setQueriesData(s,e,t){return Yn.batch(()=>me(this,rn).findAll(s).map(({queryKey:i})=>[i,this.setQueryData(i,e,t)]))}getQueryState(s){var t;const e=this.defaultQueryOptions({queryKey:s});return(t=me(this,rn).get(e.queryHash))==null?void 0:t.state}removeQueries(s){const e=me(this,rn);Yn.batch(()=>{e.findAll(s).forEach(t=>{e.remove(t)})})}resetQueries(s,e){const t=me(this,rn);return Yn.batch(()=>{const i=t.findAll(s),a=new Set(i);return i.forEach(l=>{l.reset()}),this.refetchQueries({type:"active",predicate:l=>a.has(l)},e)})}cancelQueries(s,e={}){const t={revert:!0,...e},i=Yn.batch(()=>me(this,rn).findAll(s).map(a=>a.cancel(t)));return Promise.all(i).then(Ai).catch(Ai)}invalidateQueries(s,e={}){return Yn.batch(()=>(me(this,rn).findAll(s).forEach(t=>{t.invalidate()}),(s==null?void 0:s.refetchType)==="none"?Promise.resolve():this.refetchQueries({...s,type:(s==null?void 0:s.refetchType)??(s==null?void 0:s.type)??"active"},e)))}refetchQueries(s,e={}){const t={...e,cancelRefetch:e.cancelRefetch??!0},i=Yn.batch(()=>me(this,rn).findAll(s).filter(a=>!a.isDisabled()&&!a.isStatic()).map(a=>{let l=a.fetch(void 0,t);return t.throwOnError||(l=l.catch(Ai)),a.state.fetchStatus==="paused"?Promise.resolve():l}));return Promise.all(i).then(Ai)}async query(s){const e=this.defaultQueryOptions(s);e.retry===void 0&&(e.retry=!1);const t=me(this,rn).build(this,e),i=t.isStaleByTime(tl(e.staleTime,t))?await t.fetch(e):t.state.data,a=e.select;return a?a(i):i}fetchQuery(s){const e=this.defaultQueryOptions(s);e.retry===void 0&&(e.retry=!1);const t=me(this,rn).build(this,e);return t.isStaleByTime(tl(e.staleTime,t))?t.fetch(e):Promise.resolve(t.state.data)}prefetchQuery(s){return this.fetchQuery(s).then(Ai).catch(Ai)}infiniteQuery(s){return s._type="infinite",this.query(s)}fetchInfiniteQuery(s){return s._type="infinite",this.fetchQuery(s)}prefetchInfiniteQuery(s){return this.fetchInfiniteQuery(s).then(Ai).catch(Ai)}ensureInfiniteQueryData(s){return s._type="infinite",this.ensureQueryData(s)}resumePausedMutations(){return nu.isOnline()?me(this,us).resumePausedMutations():Promise.resolve()}getQueryCache(){return me(this,rn)}getMutationCache(){return me(this,us)}getDefaultOptions(){return me(this,ds)}setDefaultOptions(s){at(this,ds,s)}setQueryDefaults(s,e){me(this,Ya).set(il(s),{queryKey:s,defaultOptions:e})}getQueryDefaults(s){const e=[...me(this,Ya).values()],t={};return e.forEach(i=>{Qa(s,i.queryKey)&&Object.assign(t,i.defaultOptions)}),t}setMutationDefaults(s,e){me(this,$a).set(il(s),{mutationKey:s,defaultOptions:e})}getMutationDefaults(s){const e=[...me(this,$a).values()],t={};return e.forEach(i=>{Qa(s,i.mutationKey)&&Object.assign(t,i.defaultOptions)}),t}defaultQueryOptions(s){if(s._defaulted)return s;const e={...me(this,ds).queries,...this.getQueryDefaults(s.queryKey),...s,_defaulted:!0};return e.queryHash||(e.queryHash=Uf(e.queryKey,e)),e.refetchOnReconnect===void 0&&(e.refetchOnReconnect=e.networkMode!=="always"),e.throwOnError===void 0&&(e.throwOnError=!!e.suspense),!e.networkMode&&e.persister&&(e.networkMode="offlineFirst"),e.queryFn===Of&&(e.enabled=!1),e}defaultMutationOptions(s){return s!=null&&s._defaulted?s:{...me(this,ds).mutations,...(s==null?void 0:s.mutationKey)&&this.getMutationDefaults(s.mutationKey),...s,_defaulted:!0}}clear(){me(this,rn).clear(),me(this,us).clear()}},rn=new WeakMap,us=new WeakMap,ds=new WeakMap,Ya=new WeakMap,$a=new WeakMap,hs=new WeakMap,Ka=new WeakMap,Za=new WeakMap,y_);const G0=s=>{let e;const t=new Set,i=(f,_)=>{const m=typeof f=="function"?f(e):f;if(!Object.is(m,e)){const g=e;e=_??(typeof m!="object"||m===null)?m:Object.assign({},e,m),t.forEach(y=>y(e,g))}},a=()=>e,d={setState:i,getState:a,getInitialState:()=>h,subscribe:f=>(t.add(f),()=>t.delete(f))},h=e=s(i,a,d);return d},Oy=(s=>s?G0(s):G0),Fy=s=>s;function ky(s,e=Fy){const t=fs.useSyncExternalStore(s.subscribe,fs.useCallback(()=>e(s.getState()),[s,e]),fs.useCallback(()=>e(s.getInitialState()),[s,e]));return fs.useDebugValue(t),t}const W0=s=>{const e=Oy(s),t=i=>ky(e,i);return Object.assign(t,e),t},By=(s=>s?W0(s):W0),yn=By((s,e)=>({catalog:[],contractsSource:"Loading...",framesById:{},selectedCanId:289,hoveredSignal:null,telemetry:{mode:"MANUAL",estop:!1,estop_reason:0,gear:"N",speed_cmd_kmh:0,speed_act_kmh:0,steer_cmd_deg:0,steer_act_deg:0,brake_cmd_kpa:0,brake_act_kpa:0,lights_cmd:{left:!1,right:!1,hazard:!1,headlight:!1,brake:!1},lights_act:{left:!1,right:!1,hazard:!1,headlight:!1,brake:!1}},perceptionObjects:[],plannedTrajectory:[],rosStatus:{active:!1,hz:0,tracked_count:0},totalFrames:0,uptimeSec:0,isConnected:!1,isPaused:!1,filterAccess:"all",filterBus:"all",searchQuery:"",zoomLevel:(()=>{try{const t=localStorage.getItem("can_watcher_zoom");return t?Math.min(Math.max(parseFloat(t),.6),1.8):1}catch{return 1}})(),zoomToast:null,activeView:(()=>{try{return localStorage.getItem("av_dashboard_active_view")==="monitor"?"monitor":"cockpit"}catch{return"cockpit"}})(),cameraMode:"chase",speedUnit:"km/h",setActiveView:t=>{try{localStorage.setItem("av_dashboard_active_view",t)}catch{}s({activeView:t})},toggleActiveView:()=>{const t=e().activeView==="monitor"?"cockpit":"monitor";try{localStorage.setItem("seer_active_view",t)}catch{}s({activeView:t})},setCameraMode:t=>s({cameraMode:t}),setSpeedUnit:t=>s({speedUnit:t}),setCatalog:(t,i)=>{s({catalog:t,contractsSource:i,selectedCanId:t.length>0&&!t.some(a=>a.id===e().selectedCanId)?t[0].id:e().selectedCanId})},selectMessage:t=>s({selectedCanId:t}),setHoveredSignal:t=>s({hoveredSignal:t}),togglePause:()=>s(t=>({isPaused:!t.isPaused})),setFilterAccess:t=>s({filterAccess:t}),setFilterBus:t=>s({filterBus:t}),setSearchQuery:t=>s({searchQuery:t}),setZoomLevel:t=>{s(i=>{const a=i.zoomLevel,l=typeof t=="function"?t(a):t,c=Math.round(Math.min(Math.max(l,.6),1.8)*100)/100;try{localStorage.setItem("can_watcher_zoom",String(c))}catch{}return{zoomLevel:c,zoomToast:`${Math.round(c*100)}%`}})},setZoomToast:t=>s({zoomToast:t}),initWebSocket:()=>{const i=window.location.port==="5173"?"127.0.0.1:8000":window.location.host,l=`${window.location.protocol==="https:"?"wss:":"ws:"}//${i}/ws/v1/stream`;let c=null,d=null;const h=()=>{try{c=new WebSocket(l),c.onopen=()=>{s({isConnected:!0})},c.onmessage=f=>{if(!e().isPaused)try{const _=JSON.parse(f.data),m={};if(_.total_frames!==void 0&&(m.totalFrames=_.total_frames),_.uptime_sec!==void 0&&(m.uptimeSec=_.uptime_sec),_.telemetry&&(m.telemetry=_.telemetry),_.frames&&Array.isArray(_.frames)){const g={...e().framesById};for(const y of _.frames)g[y.id]=y;m.framesById=g}_.perception_objects&&Array.isArray(_.perception_objects)&&(m.perceptionObjects=_.perception_objects),_.planned_trajectory&&Array.isArray(_.planned_trajectory)&&(m.plannedTrajectory=_.planned_trajectory),_.ros_status&&(m.rosStatus=_.ros_status),s(m)}catch(_){console.error("[WS] Parse error:",_)}},c.onclose=()=>{s({isConnected:!1}),clearTimeout(d),d=setTimeout(h,1500)},c.onerror=()=>{c==null||c.close()}}catch{clearTimeout(d),d=setTimeout(h,1500)}};h()}}));/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zy=s=>s.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),P_=(...s)=>s.filter((e,t,i)=>!!e&&e.trim()!==""&&i.indexOf(e)===t).join(" ").trim();/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var Hy={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vy=ln.forwardRef(({color:s="currentColor",size:e=24,strokeWidth:t=2,absoluteStrokeWidth:i,className:a="",children:l,iconNode:c,...d},h)=>ln.createElement("svg",{ref:h,...Hy,width:e,height:e,stroke:s,strokeWidth:i?Number(t)*24/Number(e):t,className:P_("lucide",a),...d},[...c.map(([f,_])=>ln.createElement(f,_)),...Array.isArray(l)?l:[l]]));/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ai=(s,e)=>{const t=ln.forwardRef(({className:i,...a},l)=>ln.createElement(Vy,{ref:l,iconNode:e,className:P_(`lucide-${zy(s)}`,i),...a}));return t.displayName=`${s}`,t};/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gy=[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]],N_=ai("Activity",Gy);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wy=[["path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",key:"1tc9qg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]],jy=ai("Camera",Wy);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xy=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],qy=ai("ChevronLeft",Xy);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yy=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],$y=ai("ChevronRight",Yy);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ky=[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]],j0=ai("Database",Ky);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zy=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],L_=ai("Eye",Zy);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qy=[["path",{d:"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",key:"1gvzjb"}],["path",{d:"M9 18h6",key:"x1upvd"}],["path",{d:"M10 22h4",key:"ceow96"}]],Jy=ai("Lightbulb",Qy);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const eS=[["rect",{x:"14",y:"4",width:"4",height:"16",rx:"1",key:"zuxfzm"}],["rect",{x:"6",y:"4",width:"4",height:"16",rx:"1",key:"1okwgv"}]],tS=ai("Pause",eS);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nS=[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]],iS=ai("Play",nS);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rS=[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]],sS=ai("Search",rS);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const aS=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M12 16h.01",key:"1drbdi"}]],oS=ai("ShieldAlert",aS);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lS=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]],cS=ai("TriangleAlert",lS);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uS=[["path",{d:"M12 20h.01",key:"zekei9"}],["path",{d:"M8.5 16.429a5 5 0 0 1 7 0",key:"1bycff"}],["path",{d:"M5 12.859a10 10 0 0 1 5.17-2.69",key:"1dl1wf"}],["path",{d:"M19 12.859a10 10 0 0 0-2.007-1.523",key:"4k23kn"}],["path",{d:"M2 8.82a15 15 0 0 1 4.177-2.643",key:"1grhjp"}],["path",{d:"M22 8.82a15 15 0 0 0-11.288-3.764",key:"z3jwby"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]],dS=ai("WifiOff",uS);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hS=[["path",{d:"M12 20h.01",key:"zekei9"}],["path",{d:"M2 8.82a15 15 0 0 1 20 0",key:"dnpr2z"}],["path",{d:"M5 12.859a10 10 0 0 1 14 0",key:"1x1e6c"}],["path",{d:"M8.5 16.429a5 5 0 0 1 7 0",key:"1bycff"}]],fS=ai("Wifi",hS),pS=()=>{const{totalFrames:s,isConnected:e,isPaused:t,contractsSource:i,filterAccess:a,filterBus:l,searchQuery:c,togglePause:d,setFilterAccess:h,setFilterBus:f,setSearchQuery:_,catalog:m,zoomLevel:g,setZoomLevel:y,activeView:M,setActiveView:T}=yn(),S=i.includes("contracts")?"contracts/*.yaml":i;return E.jsxs("header",{className:"h-12 bg-black border-b border-neutral-800 px-4 flex items-center justify-between select-none shrink-0 z-20",children:[E.jsxs("div",{className:"flex items-center gap-3 shrink-0",children:[E.jsxs("div",{className:"flex items-baseline gap-2 shrink-0 whitespace-nowrap",children:[E.jsx("span",{className:"text-base font-black tracking-tight text-white font-mono",children:"av-dashboard"}),E.jsx("span",{className:"text-[11px] text-cyan-400 font-mono font-medium whitespace-nowrap",children:"e-trike av"})]}),E.jsx("div",{className:"h-4 w-px bg-neutral-800 mx-1"}),E.jsxs("div",{className:"flex bg-[#0a0a0a] border border-neutral-800 rounded p-0.5 text-[10px] font-mono shrink-0",children:[E.jsxs("button",{onClick:()=>T("monitor"),className:`px-2.5 py-1 rounded transition-all font-bold uppercase flex items-center gap-1.5 ${M==="monitor"?"bg-neutral-800 text-cyan-300 shadow-sm":"text-neutral-400 hover:text-neutral-200"}`,title:"CAN Bus Engineering Directory & Bit Matrix (Tab)",children:[E.jsx(j0,{className:"w-3 h-3"}),E.jsx("span",{children:"CAN MONITOR"})]}),E.jsxs("button",{onClick:()=>T("cockpit"),className:`px-2.5 py-1 rounded transition-all font-bold uppercase flex items-center gap-1.5 ${M==="cockpit"?"bg-cyan-950 text-cyan-300 border border-cyan-700/60 shadow-sm":"text-neutral-400 hover:text-neutral-200"}`,title:"3D Autonomous Driving Cockpit (Tab)",children:[E.jsx(L_,{className:"w-3 h-3 text-cyan-400"}),E.jsx("span",{children:"3D COCKPIT"})]})]}),E.jsx("div",{className:"h-4 w-px bg-neutral-800 mx-1"}),E.jsxs("div",{className:"hidden lg:flex items-center gap-2 text-[11px] font-mono bg-[#0a0a0a] px-2.5 py-1 rounded border border-neutral-800",title:`Full Contracts Source: ${i}`,children:[E.jsx(j0,{className:"w-3 h-3 text-cyan-400"}),E.jsx("span",{className:"text-neutral-400",children:"source:"}),E.jsx("span",{className:"text-neutral-200 font-medium",children:S}),E.jsx("span",{className:"text-neutral-600",children:"|"}),E.jsx("span",{className:"text-emerald-400 font-bold",children:m.length}),E.jsx("span",{className:"text-neutral-400",children:"ids"})]})]}),M==="monitor"?E.jsxs("div",{className:"flex items-center gap-3",children:[E.jsxs("div",{className:"relative w-52 xl:w-72",children:[E.jsx(sS,{className:"w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400"}),E.jsx("input",{type:"text",value:c,onChange:x=>_(x.target.value),placeholder:"Search ID (0x121) or Name...",className:"w-full h-7 pl-8 pr-3 text-xs bg-[#0a0a0a] text-neutral-100 placeholder-neutral-500 border border-neutral-800 rounded focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"}),c&&E.jsx("button",{onClick:()=>_(""),className:"absolute right-2 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white",children:"×"})]}),E.jsx("div",{className:"flex rounded bg-[#0a0a0a] p-0.5 border border-neutral-800 text-[10px] font-mono",children:["all","rx","tx"].map(x=>E.jsx("button",{onClick:()=>h(x),className:`px-2 py-0.5 rounded transition-all font-semibold uppercase ${a===x?"bg-neutral-800 text-white shadow-sm":"text-neutral-400 hover:text-neutral-200"}`,children:x},x))}),E.jsx("div",{className:"flex rounded bg-[#0a0a0a] p-0.5 border border-neutral-800 text-[10px] font-mono",children:["all","high","low"].map(x=>E.jsx("button",{onClick:()=>f(x),className:`px-2 py-0.5 rounded transition-all font-semibold uppercase ${l===x?"bg-neutral-800 text-white shadow-sm":"text-neutral-400 hover:text-neutral-200"}`,children:x},x))})]}):E.jsx("div",{className:"flex items-center gap-2",children:E.jsxs("span",{className:"text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-800/40 font-bold uppercase tracking-wider flex items-center gap-2",children:[E.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"}),"AUTOWARE 3D DIGITAL TWIN"]})}),E.jsxs("div",{className:"flex items-center gap-2.5 shrink-0",children:[E.jsxs("button",{onClick:d,className:`h-7 px-2.5 rounded flex items-center gap-1.5 text-[11px] font-mono font-semibold transition-all ${t?"bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30":"bg-[#0a0a0a] hover:bg-neutral-900 text-neutral-300 border border-neutral-800"}`,title:"Pause or resume live UI updates (Spacebar)",children:[t?E.jsx(iS,{className:"w-3 h-3 fill-current"}):E.jsx(tS,{className:"w-3 h-3"}),E.jsx("span",{children:t?"RESUME":"FREEZE"})]}),E.jsxs("div",{className:"flex items-center rounded bg-[#0a0a0a] border border-neutral-800 text-[10px] font-mono p-0.5",title:"UI Scale Zoom (Ctrl+ / Ctrl- / Ctrl+0)",children:[E.jsx("button",{onClick:()=>y(x=>x-.1),className:"w-5 h-5 flex items-center justify-center rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors font-bold",title:"Zoom Out (Ctrl -)",children:"–"}),E.jsxs("button",{onClick:()=>y(1),className:"px-1.5 h-5 flex items-center justify-center rounded text-neutral-300 hover:text-cyan-300 text-[10px] font-bold transition-colors",title:"Reset Zoom to 100% (Ctrl 0)",children:[Math.round(g*100),"%"]}),E.jsx("button",{onClick:()=>y(x=>x+.1),className:"w-5 h-5 flex items-center justify-center rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors font-bold",title:"Zoom In (Ctrl +)",children:"+"})]}),E.jsxs("div",{className:"flex items-center gap-1.5 text-[11px] font-mono bg-[#0a0a0a] px-2.5 py-1 rounded border border-neutral-800",children:[E.jsx(N_,{className:"w-3 h-3 text-cyan-400 animate-pulse"}),E.jsx("span",{className:"text-neutral-400",children:"frames:"}),E.jsx("span",{className:"text-neutral-100 font-bold tabular-nums",children:s.toLocaleString()})]}),E.jsx("div",{className:`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-mono font-bold border ${e?"bg-[#0a0a0a] text-emerald-400 border-neutral-800":"bg-rose-950/40 text-rose-400 border-rose-800/60"}`,children:e?E.jsxs(E.Fragment,{children:[E.jsx(fS,{className:"w-3 h-3 text-emerald-400"}),E.jsxs("span",{className:"relative flex h-1.5 w-1.5",children:[E.jsx("span",{className:"animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"}),E.jsx("span",{className:"relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"})]}),E.jsx("span",{children:"LIVE"})]}):E.jsxs(E.Fragment,{children:[E.jsx(dS,{className:"w-3 h-3 text-rose-400"}),E.jsx("span",{children:"DISCONNECTED"})]})})]})]})},mS=()=>{const s=yn(T=>T.telemetry),e=50,t=Math.min(Math.max(s.speed_act_kmh,0),e),i=Math.min(Math.max(s.speed_cmd_kmh,0),e),a=-135+t/e*180,l=-135+i/e*180,c=45,d=Math.min(Math.max(s.steer_act_deg,-c),c),h=Math.min(Math.max(s.steer_cmd_deg,-c),c),f=-90+d/c*45,_=-90+h/c*45,m=1500,g=Math.min(Math.max(s.brake_act_kpa/m*100,0),100),y=Math.min(Math.max(s.brake_cmd_kpa/m*100,0),100),M=["P","R","N","D","S"];return E.jsxs("aside",{className:"w-72 bg-black border-r border-neutral-800 flex flex-col justify-between p-3 select-none overflow-y-auto shrink-0",children:[E.jsxs("div",{className:"space-y-2.5",children:[E.jsxs("div",{className:"flex items-center justify-between pb-2 border-b border-neutral-800",children:[E.jsx("span",{className:"text-[11px] font-mono uppercase text-neutral-300 font-bold tracking-wider",children:"Cockpit State"}),s.estop?E.jsxs("span",{className:"flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/60 shadow-[0_0_8px_rgba(244,63,94,0.4)] animate-pulse",children:[E.jsx(oS,{className:"w-3.5 h-3.5"})," ESTOP ACTIVE"]}):E.jsx("span",{className:"text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40",children:"SAFETY OK"})]}),E.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[E.jsxs("div",{className:"bg-[#0a0a0a] p-2 rounded-lg border border-neutral-800",children:[E.jsx("span",{className:"block text-[10px] uppercase font-mono text-neutral-400 font-medium",children:"Mode"}),E.jsx("span",{className:`text-xs font-mono font-black tracking-wide ${s.mode==="AUTONOMOUS"||s.mode==="AUTO"?"text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.4)]":s.mode==="EMERGENCY"||s.mode==="ESTOP"?"text-rose-400 drop-shadow-[0_0_6px_rgba(244,63,94,0.4)]":"text-amber-300"}`,children:s.mode})]}),E.jsxs("div",{className:"bg-[#0a0a0a] p-2 rounded-lg border border-neutral-800",children:[E.jsx("span",{className:"block text-[10px] uppercase font-mono text-neutral-400 font-medium",children:"Gear"}),E.jsx("div",{className:"flex items-center justify-between mt-1",children:M.map(T=>{const S=s.gear===T;return E.jsx("span",{className:`text-[11px] font-mono font-black px-1.5 py-0.5 rounded transition-all ${S?"bg-cyan-400 text-black shadow-md shadow-cyan-500/40":"text-neutral-400 bg-neutral-900 border border-neutral-800"}`,children:T},T)})})]})]}),E.jsxs("div",{className:"bg-[#0a0a0a] p-2.5 rounded-lg border border-neutral-800",children:[E.jsxs("div",{className:"flex items-center justify-between mb-2",children:[E.jsx("span",{className:"text-[10px] uppercase font-mono text-neutral-300 font-semibold tracking-wide",children:"ISO 2575 Telltales"}),E.jsxs("div",{className:"flex items-center gap-2 text-[9px] font-mono",children:[E.jsx("span",{className:"text-cyan-400 font-bold",children:"■ CMD"}),E.jsx("span",{className:"text-emerald-400 font-bold",children:"■ ACT"})]})]}),E.jsxs("div",{className:"grid grid-cols-5 gap-1.5 text-center",children:[E.jsxs("div",{className:`p-1.5 rounded-md border flex flex-col items-center justify-center transition-all ${s.lights_act.left?"bg-emerald-500/25 text-emerald-300 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]":s.lights_cmd.left?"bg-cyan-500/15 text-cyan-300 border-cyan-400/60 ring-1 ring-cyan-400/40":"bg-[#121212] text-neutral-400 border-neutral-800"}`,title:"Left Turn Indicator",children:[E.jsx("span",{className:"text-base font-black leading-none",children:"⮜"}),E.jsx("span",{className:"text-[9px] font-mono font-semibold mt-1",children:"LEFT"})]}),E.jsxs("div",{className:`p-1.5 rounded-md border flex flex-col items-center justify-center transition-all ${s.lights_act.right?"bg-emerald-500/25 text-emerald-300 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]":s.lights_cmd.right?"bg-cyan-500/15 text-cyan-300 border-cyan-400/60 ring-1 ring-cyan-400/40":"bg-[#121212] text-neutral-400 border-neutral-800"}`,title:"Right Turn Indicator",children:[E.jsx("span",{className:"text-base font-black leading-none",children:"⮞"}),E.jsx("span",{className:"text-[9px] font-mono font-semibold mt-1",children:"RGHT"})]}),E.jsxs("div",{className:`p-1.5 rounded-md border flex flex-col items-center justify-center transition-all ${s.lights_act.hazard?"bg-amber-500/25 text-amber-300 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse":s.lights_cmd.hazard?"bg-cyan-500/15 text-cyan-300 border-cyan-400/60 ring-1 ring-cyan-400/40":"bg-[#121212] text-neutral-400 border-neutral-800"}`,title:"Hazard Warning Lights",children:[E.jsx(cS,{className:"w-3.5 h-3.5"}),E.jsx("span",{className:"text-[9px] font-mono font-semibold mt-1",children:"HAZD"})]}),E.jsxs("div",{className:`p-1.5 rounded-md border flex flex-col items-center justify-center transition-all ${s.lights_act.headlight?"bg-sky-500/25 text-sky-300 border-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.4)]":s.lights_cmd.headlight?"bg-cyan-500/15 text-cyan-300 border-cyan-400/60 ring-1 ring-cyan-400/40":"bg-[#121212] text-neutral-400 border-neutral-800"}`,title:"Headlights / Dipped Beam",children:[E.jsx(Jy,{className:"w-3.5 h-3.5"}),E.jsx("span",{className:"text-[9px] font-mono font-semibold mt-1",children:"BEAM"})]}),E.jsxs("div",{className:`p-1.5 rounded-md border flex flex-col items-center justify-center transition-all ${s.lights_act.brake?"bg-rose-500/25 text-rose-300 border-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.5)]":s.lights_cmd.brake?"bg-cyan-500/15 text-cyan-300 border-cyan-400/60 ring-1 ring-cyan-400/40":"bg-[#121212] text-neutral-400 border-neutral-800"}`,title:"Brake Stop Lamp",children:[E.jsx("span",{className:"text-[10px] font-black leading-none px-1 py-0.5 rounded bg-rose-950/60 border border-rose-800/80",children:"STOP"}),E.jsx("span",{className:"text-[9px] font-mono font-semibold mt-0.5",children:"BRK"})]})]})]}),E.jsxs("div",{className:"bg-[#0a0a0a] p-3 rounded-lg border border-neutral-800",children:[E.jsxs("div",{className:"flex items-center justify-between text-[10px] font-mono text-neutral-300 font-semibold mb-1",children:[E.jsx("span",{children:"SPEEDOMETER"}),E.jsx("span",{className:"text-neutral-400",children:"0 - 50 km/h"})]}),E.jsxs("div",{className:"relative flex flex-col items-center justify-center py-1",children:[E.jsxs("svg",{viewBox:"0 0 160 92",className:"w-44 overflow-visible",children:[E.jsx("path",{d:"M 20 85 A 60 60 0 0 1 140 85",fill:"none",stroke:"#262626",strokeWidth:"10",strokeLinecap:"round"}),[0,10,20,30,40,50].map(T=>{const x=(-135+T/50*180)*Math.PI/180,C=80+53*Math.cos(x),I=85+53*Math.sin(x),w=80+60*Math.cos(x),R=85+60*Math.sin(x);return E.jsx("line",{x1:C,y1:I,x2:w,y2:R,stroke:"#525252",strokeWidth:"1.5"},T)}),E.jsx("line",{x1:"80",y1:"85",x2:80+58*Math.cos(l*Math.PI/180),y2:85+58*Math.sin(l*Math.PI/180),stroke:"#06b6d4",strokeWidth:"2.5",strokeDasharray:"4 2"}),E.jsx("line",{x1:"80",y1:"85",x2:80+54*Math.cos(a*Math.PI/180),y2:85+54*Math.sin(a*Math.PI/180),stroke:"#10b981",strokeWidth:"3.5",strokeLinecap:"round"}),E.jsx("circle",{cx:"80",cy:"85",r:"5",fill:"#10b981"}),E.jsx("circle",{cx:"80",cy:"85",r:"2.5",fill:"#000000"})]}),E.jsxs("div",{className:"text-center mt-[-6px]",children:[E.jsx("div",{className:"text-3xl font-mono font-black text-emerald-400 tracking-tight tabular-nums drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]",children:s.speed_act_kmh.toFixed(1)}),E.jsxs("div",{className:"text-[11px] font-mono text-neutral-400 flex items-center justify-center gap-2 mt-0.5",children:[E.jsx("span",{className:"font-semibold text-neutral-300",children:"km/h"}),E.jsx("span",{className:"text-neutral-600",children:"|"}),E.jsxs("span",{className:"text-cyan-300 font-bold bg-[#141414] px-1.5 py-0.5 rounded border border-neutral-700",children:["CMD: ",s.speed_cmd_kmh.toFixed(1)]})]})]})]})]}),E.jsxs("div",{className:"bg-[#0a0a0a] p-3 rounded-lg border border-neutral-800",children:[E.jsxs("div",{className:"flex items-center justify-between text-[10px] font-mono text-neutral-300 font-semibold mb-1",children:[E.jsx("span",{children:"STEERING ANGLE"}),E.jsx("span",{className:"text-neutral-400",children:"±45.0°"})]}),E.jsxs("div",{className:"relative flex flex-col items-center justify-center py-1",children:[E.jsxs("svg",{viewBox:"0 0 160 70",className:"w-44 overflow-visible",children:[E.jsx("line",{x1:"80",y1:"16",x2:"80",y2:"60",stroke:"#525252",strokeWidth:"1",strokeDasharray:"2 2"}),E.jsx("path",{d:"M 38 60 A 60 60 0 0 1 122 60",fill:"none",stroke:"#262626",strokeWidth:"8",strokeLinecap:"round"}),E.jsx("line",{x1:"80",y1:"60",x2:80+52*Math.cos(_*Math.PI/180),y2:60+52*Math.sin(_*Math.PI/180),stroke:"#06b6d4",strokeWidth:"2.5",strokeDasharray:"3 2"}),E.jsx("line",{x1:"80",y1:"60",x2:80+50*Math.cos(f*Math.PI/180),y2:60+50*Math.sin(f*Math.PI/180),stroke:"#10b981",strokeWidth:"3.5",strokeLinecap:"round"}),E.jsx("circle",{cx:"80",cy:"60",r:"4",fill:"#10b981"})]}),E.jsxs("div",{className:"text-center mt-[-4px]",children:[E.jsxs("div",{className:"text-2xl font-mono font-black text-emerald-400 tabular-nums drop-shadow-[0_0_6px_rgba(16,185,129,0.3)]",children:[s.steer_act_deg>0?`+${s.steer_act_deg.toFixed(1)}`:s.steer_act_deg.toFixed(1),"°"]}),E.jsxs("div",{className:"text-[11px] font-mono text-neutral-400 mt-0.5",children:["CMD:"," ",E.jsxs("span",{className:"text-cyan-300 font-bold bg-[#141414] px-1.5 py-0.5 rounded border border-neutral-700",children:[s.steer_cmd_deg.toFixed(1),"°"]})]})]})]})]}),E.jsxs("div",{className:"bg-[#0a0a0a] p-3 rounded-lg border border-neutral-800",children:[E.jsxs("div",{className:"flex items-center justify-between text-[10px] font-mono text-neutral-300 font-semibold mb-2",children:[E.jsx("span",{children:"HYDRAULIC BRAKE"}),E.jsx("span",{className:"text-neutral-400",children:"0 - 1500 kPa"})]}),E.jsxs("div",{className:"space-y-2",children:[E.jsxs("div",{children:[E.jsxs("div",{className:"flex justify-between text-[10px] font-mono mb-1 text-neutral-300",children:[E.jsx("span",{className:"text-emerald-400 font-bold",children:"FEEDBACK"}),E.jsxs("span",{className:"text-neutral-100 tabular-nums font-bold",children:[s.brake_act_kpa.toFixed(0)," kPa"]})]}),E.jsx("div",{className:"w-full h-2.5 bg-[#141414] rounded-full overflow-hidden border border-neutral-800",children:E.jsx("div",{className:"h-full bg-emerald-500 rounded-full transition-all duration-100 shadow-[0_0_8px_rgba(16,185,129,0.5)]",style:{width:`${g}%`}})})]}),E.jsxs("div",{children:[E.jsxs("div",{className:"flex justify-between text-[10px] font-mono mb-1 text-neutral-300",children:[E.jsx("span",{className:"text-cyan-400 font-bold",children:"COMMAND"}),E.jsxs("span",{className:"text-neutral-200 tabular-nums font-bold",children:[s.brake_cmd_kpa.toFixed(0)," kPa"]})]}),E.jsx("div",{className:"w-full h-2 bg-[#141414] rounded-full overflow-hidden border border-neutral-800",children:E.jsx("div",{className:"h-full bg-cyan-400 rounded-full transition-all duration-100 shadow-[0_0_6px_rgba(6,182,212,0.4)]",style:{width:`${y}%`}})})]})]})]})]}),E.jsxs("div",{className:"pt-2 border-t border-neutral-800 text-[10px] font-mono text-neutral-400 text-center space-y-0.5",children:[E.jsx("div",{className:"font-semibold text-neutral-300",children:"e-trike av • telemetry"}),E.jsx("div",{className:"text-neutral-500",children:"seer engineering monitor"})]})]})};var gS=M_();function _S(s){return typeof s=="object"?s.key:s}function xS(s,e){const t=s.length;return new Proxy(s,{get(i,a,l){if(typeof a=="string"){const c=a.charCodeAt(0);if(c>=48&&c<=57){const d=+a;if(Number.isInteger(d)&&d>=0&&d<t){let h=i[d];if(typeof h!="object"){const f=e[d*2];h=i[d]={index:d,key:h,start:f,size:e[d*2+1],end:f+e[d*2+1],lane:0}}return h}}if(a==="length")return t}return Reflect.get(i,a,l)}})}function Ma(s,e,t){let i=t.initialDeps??[],a,l=!0;function c(){const d=s();return(d.length!==i.length||d.some((f,_)=>i[_]!==f))&&(i=d,a=e(...d),t!=null&&t.onChange&&!(l&&t.skipInitialOnChange)&&t.onChange(a),l=!1),a}return c.updateDeps=d=>{i=d},c}function X0(s,e){if(s===void 0)throw new Error("Unexpected undefined");return s}const q0=(s,e)=>Math.abs(s-e)<1.01,vS=(s,e,t)=>{let i;return Object.assign(function(...a){s.clearTimeout(i),i=s.setTimeout(()=>e.apply(this,a),t)},{cancel:()=>{s.clearTimeout(i)}})};let zo;const ih=()=>{if(zo!==void 0)return zo;if(typeof navigator>"u")return zo=!1;if(/iP(hone|od|ad)/.test(navigator.userAgent))return zo=!0;const s=navigator.maxTouchPoints;return zo=navigator.platform==="MacIntel"&&s!==void 0&&s>0},Y0=s=>{const{offsetWidth:e,offsetHeight:t}=s;return{width:e,height:t}},yS=s=>s,SS=s=>{const e=Math.max(s.startIndex-s.overscan,0),i=Math.min(s.endIndex+s.overscan,s.count-1)-e+1,a=new Array(i);for(let l=0;l<i;l++)a[l]=e+l;return a},MS=(s,e)=>{const t=s.scrollElement;if(!t)return;const i=s.targetWindow;if(!i)return;const a=c=>{const{width:d,height:h}=c;e({width:Math.round(d),height:Math.round(h)})};if(a(Y0(t)),!i.ResizeObserver)return()=>{};const l=new i.ResizeObserver(c=>{const d=()=>{const h=c[0];if(h!=null&&h.borderBoxSize){const f=h.borderBoxSize[0];if(f){a({width:f.inlineSize,height:f.blockSize});return}}a(Y0(t))};s.options.useAnimationFrameWithResizeObserver?requestAnimationFrame(d):d()});return l.observe(t,{box:"border-box"}),()=>{l.unobserve(t)}},iu={passive:!0},ES=typeof window>"u"?!0:"onscrollend"in window,wS=(s,e,t)=>{const i=s.scrollElement;if(!i)return;const a=s.targetWindow;if(!a)return;const l=s.options.useScrollendEvent&&ES;let c=0;const d=l?null:vS(a,()=>e(t(i),!1),s.options.isScrollingResetDelay),h=m=>()=>{c=t(i),d==null||d(),e(c,m)},f=h(!0),_=h(!1);return i.addEventListener("scroll",f,iu),l&&i.addEventListener("scrollend",_,iu),()=>{i.removeEventListener("scroll",f),l&&i.removeEventListener("scrollend",_),d==null||d.cancel()}},bS=(s,e)=>wS(s,e,t=>{const{horizontal:i,isRtl:a}=s.options;return i?t.scrollLeft*(a&&-1||1):t.scrollTop}),TS=(s,e,t)=>{if(t.options.useCachedMeasurements){const i=t.indexFromElement(s),a=t.options.getItemKey(i);return t.itemSizeCache.get(a)??t.options.estimateSize(i)}if(e!=null&&e.borderBoxSize){const i=e.borderBoxSize[0];if(i)return Math.round(i[t.options.horizontal?"inlineSize":"blockSize"])}if(!e){const i=t.indexFromElement(s),a=t.options.getItemKey(i),l=t.itemSizeCache.get(a);if(l!==void 0)return l}return s[t.options.horizontal?"offsetWidth":"offsetHeight"]},AS=(s,{adjustments:e=0,behavior:t},i)=>{var a,l;(l=(a=i.scrollElement)==null?void 0:a.scrollTo)==null||l.call(a,{[i.options.horizontal?"left":"top"]:s+e,behavior:t})},CS=AS;function RS(s,e,t,i){if(e===0)return!1;const a=i(0),l=new Set;let c=0;for(;c<s;){const h=t(c);if(h===a)break;l.add(h),c++}const d=s-c;if(d===0||d>=e)return!1;for(let h=0;h<d;h++)if(i(h)!==t(c+h))return!1;for(let h=d;h<e;h++)if(l.has(i(h)))return!1;return!0}class PS{constructor(e){this.unsubs=[],this.scrollElement=null,this.targetWindow=null,this.isScrolling=!1,this.scrollState=null,this.measurementsCache=[],this._singleLaneMeasurements=null,this.itemSizeCache=new Map,this.itemSizeCacheVersion=0,this.laneAssignments=new Map,this.pendingMin=null,this.prevLanes=void 0,this.lanesChangedFlag=!1,this.lanesSettling=!1,this.pendingScrollAnchor=null,this.scrollRect=null,this.scrollOffset=null,this.scrollDirection=null,this.scrollAdjustments=0,this._iosDeferredAdjustment=0,this._iosTouching=!1,this._iosJustTouchEnded=!1,this._iosTouchEndTimerId=null,this._intendedScrollOffset=null,this._clampedAdjustment=null,this.elementsCache=new Map,this.now=()=>{var t,i,a;return((a=(i=(t=this.targetWindow)==null?void 0:t.performance)==null?void 0:i.now)==null?void 0:a.call(i))??Date.now()},this.observer=(()=>{let t=null;const i=()=>t||(!this.targetWindow||!this.targetWindow.ResizeObserver?null:t=new this.targetWindow.ResizeObserver(a=>{a.forEach(l=>{const c=()=>{const d=l.target,h=this.indexFromElement(d);if(!d.isConnected){this.observer.unobserve(d);for(const[f,_]of this.elementsCache)if(_===d){this.elementsCache.delete(f);break}return}this.isIndexInRange(h)&&this.shouldMeasureDuringScroll(h)&&this.resizeItem(h,this.options.measureElement(d,l,this))};this.options.useAnimationFrameWithResizeObserver?requestAnimationFrame(c):c()})}));return{disconnect:()=>{var a;(a=i())==null||a.disconnect(),t=null},observe:a=>{var l;return(l=i())==null?void 0:l.observe(a,{box:"border-box"})},unobserve:a=>{var l;return(l=i())==null?void 0:l.unobserve(a)}}})(),this.range=null,this.setOptions=t=>{var i;const a={debug:!1,initialOffset:0,overscan:1,paddingStart:0,paddingEnd:0,scrollPaddingStart:0,scrollPaddingEnd:0,horizontal:!1,getItemKey:yS,rangeExtractor:SS,onChange:()=>{},measureElement:TS,initialRect:{width:0,height:0},scrollMargin:0,gap:0,indexAttribute:"data-index",initialMeasurementsCache:[],lanes:1,anchorTo:"start",followOnAppend:!1,scrollEndThreshold:1,isScrollingResetDelay:150,enabled:!0,isRtl:!1,useScrollendEvent:!1,useAnimationFrameWithResizeObserver:!1,laneAssignmentMode:"estimate",useCachedMeasurements:!1};for(const m in t){const g=t[m];g!==void 0&&(a[m]=g)}const l=this.options;let c=null,d=null,h=!1;if(l!==void 0&&l.enabled&&a.enabled&&a.anchorTo==="end"&&this.scrollElement!==null){const m=l.count,g=a.count,y=this.getMeasurements(),M=((i=this._singleLaneMeasurements)==null?void 0:i.items)??y,T=w=>_S(M[w]),S=m>0?T(0):null,x=m>0?T(m-1):null;if(g!==m||m>0&&g>0&&(a.getItemKey(0)!==S||a.getItemKey(g-1)!==x)){h=!0;const w=m>0?this.getVirtualItemForOffset(this.getScrollOffset())??y[0]:null;w&&(c=[w.key,this.getScrollOffset()-w.start]);const R=a.followOnAppend===!0?"auto":a.followOnAppend||null;R&&g>0&&this.isAtEnd(l.scrollEndThreshold)&&(m===0||a.getItemKey(g-1)!==x)&&(g>m||RS(m,g,T,a.getItemKey))&&(d=R)}}this.options=a,h&&(this.pendingMin=0,this.itemSizeCacheVersion++);let f=!1,_=0;if(c&&this.scrollOffset!==null){const[m,g]=c,y=this.getMeasurements(),{count:M,getItemKey:T}=this.options;let S=0;for(;S<M&&T(S)!==m;)S++;if(S<M){const x=y[S];if(x){const C=Math.max(0,x.start+g);!d&&C!==this.scrollOffset&&(_=C-this.scrollOffset,this.scrollOffset=C,f=!0)}}}(f||d)&&(this.pendingScrollAnchor=[f?c[0]:null,f?c[1]:0,d,_])},this.notify=t=>{var i,a;(a=(i=this.options).onChange)==null||a.call(i,this,t)},this.maybeNotify=Ma(()=>(this.calculateRange(),[this.isScrolling,this.range?this.range.startIndex:null,this.range?this.range.endIndex:null]),t=>{this.notify(t)},{key:!1,debug:()=>this.options.debug,initialDeps:[this.isScrolling,this.range?this.range.startIndex:null,this.range?this.range.endIndex:null]}),this.cleanup=()=>{this.unsubs.filter(Boolean).forEach(t=>t()),this.unsubs=[],this.observer.disconnect(),this.rafId!=null&&this.targetWindow&&(this.targetWindow.cancelAnimationFrame(this.rafId),this.rafId=null),this.scrollState=null,this.isScrolling=!1,this.scrollDirection=null,this._iosDeferredAdjustment=0,this._iosTouching=!1,this._iosJustTouchEnded=!1,this._clampedAdjustment=null,this.scrollElement=null,this.targetWindow=null},this._didMount=()=>()=>{this.cleanup()},this._willUpdate=()=>{var t,i;const a=this.options.enabled?this.options.getScrollElement():null;if(this.scrollElement!==a){if(this.cleanup(),!a){this.maybeNotify();return}if(this.scrollElement=a,this.scrollElement&&"ownerDocument"in this.scrollElement?this.targetWindow=this.scrollElement.ownerDocument.defaultView:this.targetWindow=((t=this.scrollElement)==null?void 0:t.window)??null,this.elementsCache.forEach(c=>{this.observer.observe(c)}),this.unsubs.push(this.options.observeElementRect(this,c=>{this.scrollRect=c,this.maybeNotify()})),this.unsubs.push(this.options.observeElementOffset(this,(c,d)=>{if(d&&this._intendedScrollOffset===null&&c===this.scrollOffset)return;this._intendedScrollOffset!==null&&Math.abs(c-this._intendedScrollOffset)<1.5&&(c=this._intendedScrollOffset),this._intendedScrollOffset=null,this._clampedAdjustment!==null&&Math.abs(c-this._clampedAdjustment.maxAtWrite)>=1.5&&(this._clampedAdjustment=null),this.scrollAdjustments=0;const h=this.getScrollOffset();this.scrollDirection=d?h===c?this.scrollDirection:h<c?"forward":"backward":null,this.scrollOffset=c,this.isScrolling=d,this._flushIosDeferredIfReady(),this.scrollState&&this.scheduleScrollReconcile(),this.maybeNotify()})),"addEventListener"in this.scrollElement){const c=this.scrollElement,d=()=>{this._iosTouching=!0,this._iosJustTouchEnded=!1,this._iosTouchEndTimerId!==null&&this.targetWindow!=null&&(this.targetWindow.clearTimeout(this._iosTouchEndTimerId),this._iosTouchEndTimerId=null)},h=()=>{this._iosTouching=!1,!(!ih()||this.targetWindow==null)&&(this._iosJustTouchEnded=!0,this._iosTouchEndTimerId=this.targetWindow.setTimeout(()=>{this._iosJustTouchEnded=!1,this._iosTouchEndTimerId=null,this._flushIosDeferredIfReady()},150))};c.addEventListener("touchstart",d,iu),c.addEventListener("touchend",h,iu),this.unsubs.push(()=>{c.removeEventListener("touchstart",d),c.removeEventListener("touchend",h),this._iosTouchEndTimerId!==null&&this.targetWindow!=null&&(this.targetWindow.clearTimeout(this._iosTouchEndTimerId),this._iosTouchEndTimerId=null)})}this._scrollToOffset(this.getScrollOffset(),{adjustments:void 0,behavior:void 0})}const l=this.pendingScrollAnchor;if(this.pendingScrollAnchor=null,l&&this.scrollElement&&this.options.enabled){const[c,d,h,f]=l;c!==null&&!h&&(ih()&&(this.isScrolling||this._iosTouching||this._iosJustTouchEnded)?f!==0&&(this._iosDeferredAdjustment+=f):((i=this.scrollState)==null?void 0:i.behavior)==="smooth"&&!q0(this.getScrollOffset()-f,this.scrollState.lastTargetOffset)||this._scrollToOffset(this.getScrollOffset(),{adjustments:void 0,behavior:void 0})),h&&this.scrollToEnd({behavior:h})}this._retryClampedAdjustment()},this._retryClampedAdjustment=()=>{if(this._clampedAdjustment===null||!this.scrollElement||!this.options.enabled)return;const{target:t,maxAtWrite:i}=this._clampedAdjustment,a=this.getMaxScrollOffset();a>i+.5&&(this._clampedAdjustment=t>a+.5?{target:t,maxAtWrite:a}:null,this._scrollToOffset(t,{adjustments:void 0,behavior:void 0}))},this._flushIosDeferredIfReady=()=>{if(this._iosDeferredAdjustment===0||this.isScrolling||this._iosTouching||this._iosJustTouchEnded)return;const t=this.getScrollOffset(),i=this.getMaxScrollOffset();if(t<0||t>i)return;if(this._iosDeferredAdjustment<0&&t>=i-1){this._iosDeferredAdjustment=0;return}const a=this._iosDeferredAdjustment;this._iosDeferredAdjustment=0,this._scrollToOffset(t,{adjustments:this.scrollAdjustments+=a,behavior:void 0})},this.rafId=null,this.getSize=()=>this.options.enabled?(this.scrollRect=this.scrollRect??this.options.initialRect,this.scrollRect[this.options.horizontal?"width":"height"]):(this.scrollRect=null,0),this.getScrollOffset=()=>this.options.enabled?(this.scrollOffset=this.scrollOffset??(typeof this.options.initialOffset=="function"?this.options.initialOffset():this.options.initialOffset),this.scrollOffset):(this.scrollOffset=null,0),this.getMeasurementOptions=Ma(()=>[this.options.count,this.options.paddingStart,this.options.scrollMargin,this.options.getItemKey,this.options.enabled,this.options.lanes,this.options.laneAssignmentMode,this.options.gap],(t,i,a,l,c,d,h,f)=>(this.prevLanes!==void 0&&this.prevLanes!==d&&(this.lanesChangedFlag=!0),this.prevLanes=d,this.pendingMin=null,{count:t,paddingStart:i,scrollMargin:a,getItemKey:l,enabled:c,lanes:d,laneAssignmentMode:h,gap:f}),{key:!1}),this.isIndexInRange=t=>t>=0&&t<this.options.count,this.getMeasurements=Ma(()=>[this.getMeasurementOptions(),this.itemSizeCacheVersion],({count:t,paddingStart:i,scrollMargin:a,getItemKey:l,enabled:c,lanes:d,laneAssignmentMode:h,gap:f},_)=>{var m;const g=this.itemSizeCache;if(!c)return this.measurementsCache=[],this._singleLaneMeasurements=null,this.itemSizeCache.clear(),this.laneAssignments.clear(),[];if(this.laneAssignments.size>t)for(const C of this.laneAssignments.keys())C>=t&&this.laneAssignments.delete(C);this.lanesChangedFlag&&(this.lanesChangedFlag=!1,this.lanesSettling=!0,this.measurementsCache=[],this._singleLaneMeasurements=null,this.itemSizeCache.clear(),this.laneAssignments.clear(),this.pendingMin=null),this.measurementsCache.length===0&&!this.lanesSettling&&(this.measurementsCache=this.options.initialMeasurementsCache,this.measurementsCache.forEach(C=>{this.itemSizeCache.set(C.key,C.size)}));const y=this.lanesSettling?0:this.pendingMin??0;if(this.pendingMin=null,this.lanesSettling&&this.measurementsCache.length===t&&(this.lanesSettling=!1),d===1){const C=t*2;let I=(m=this._singleLaneMeasurements)==null?void 0:m.flat;if(!I||I.length<C){const U=new Float64Array(C);I&&y>0&&U.set(I.subarray(0,y*2)),I=U}const w=y===0?new Array(t):this._singleLaneMeasurements.items.slice();let R;if(y===0)R=i+a;else{const U=y-1;R=I[U*2]+I[U*2+1]+f}for(let U=y;U<t;U++){const A=l(U);w[U]=A;const D=g.get(A),k=typeof D=="number"?D:this.options.estimateSize(U);I[U*2]=R,I[U*2+1]=k,R+=k+f}this._singleLaneMeasurements={flat:I,items:w};const P=xS(w,I);return this.measurementsCache=P,P}const M=this.measurementsCache.slice(0,y),T=new Array(d).fill(void 0),S=new Float64Array(d);let x=0;for(let C=0;C<y;C++){const I=M[C];I&&(T[I.lane]===void 0&&x++,T[I.lane]=C,S[I.lane]=I.end)}for(let C=y;C<t;C++){const I=l(C),w=this.laneAssignments.get(C);let R,P;const U=h==="estimate"||g.has(I);if(w!==void 0&&this.options.lanes>1){R=w;const z=T[R],G=z!==void 0?M[z]:void 0;P=G?G.end+f:i+a}else if(x===d){let z=0,G=S[0],$=T[0];for(let H=1;H<d;H++){const Q=S[H];(Q<G||Q===G&&T[H]<$)&&(z=H,G=Q,$=T[H])}R=z,P=G+f,U&&this.laneAssignments.set(C,R)}else R=C%this.options.lanes,P=i+a,U&&this.laneAssignments.set(C,R);const A=g.get(I),D=typeof A=="number"?A:this.options.estimateSize(C),k=P+D;M[C]={index:C,start:P,size:D,end:k,key:I,lane:R},T[R]===void 0&&x++,T[R]=C,S[R]=k}return this.measurementsCache=M,M},{key:!1,debug:()=>this.options.debug}),this.calculateRange=Ma(()=>[this.getMeasurements(),this.getSize(),this.getScrollOffset(),this.options.lanes],(t,i,a,l)=>t.length===0||i===0?(this.range=null,null):(this.range=LS(t,i,a,l,l===1&&this._singleLaneMeasurements!==null?this._singleLaneMeasurements.flat:null),this.range),{key:!1,debug:()=>this.options.debug}),this.getVirtualIndexes=Ma(()=>{let t=null,i=null;const a=this.calculateRange();return a&&(t=a.startIndex,i=a.endIndex),this.maybeNotify.updateDeps([this.isScrolling,t,i]),[this.options.rangeExtractor,this.options.overscan,this.options.count,t,i]},(t,i,a,l,c)=>l===null||c===null?[]:t({startIndex:l,endIndex:c,overscan:i,count:a}),{key:!1,debug:()=>this.options.debug}),this.indexFromElement=t=>{const i=this.options.indexAttribute,a=t.getAttribute(i);return a?parseInt(a,10):(console.warn(`Missing attribute name '${i}={index}' on measured element.`),-1)},this.shouldMeasureDuringScroll=t=>{var i;if(!this.scrollState||this.scrollState.behavior!=="smooth")return!0;const a=this.scrollState.index??((i=this.getVirtualItemForOffset(this.scrollState.lastTargetOffset))==null?void 0:i.index);if(a!==void 0&&this.range){const l=Math.max(this.options.overscan,Math.ceil((this.range.endIndex-this.range.startIndex)/2)),c=Math.max(0,a-l),d=Math.min(this.options.count-1,a+l);return t>=c&&t<=d}return!0},this.measureElement=t=>{if(!t){this.elementsCache.forEach((c,d)=>{c.isConnected||(this.observer.unobserve(c),this.elementsCache.delete(d))});return}const i=this.indexFromElement(t);if(!this.isIndexInRange(i))return;const a=this.options.getItemKey(i),l=this.elementsCache.get(a);l!==t&&(l&&this.observer.unobserve(l),this.observer.observe(t),this.elementsCache.set(a,t)),(!this.isScrolling||this.scrollState)&&this.shouldMeasureDuringScroll(i)&&this.resizeItem(i,this.options.measureElement(t,void 0,this))},this.resizeItem=(t,i)=>{var a,l,c;if(!this.isIndexInRange(t))return;let d,h,f;const _=(a=this._singleLaneMeasurements)==null?void 0:a.flat;if(this.options.lanes===1&&_!=null)f=this.options.getItemKey(t),h=_[t*2],d=_[t*2+1];else{const y=this.measurementsCache[t];if(!y)return;f=y.key,h=y.start,d=y.size}const m=this.itemSizeCache.get(f)??d,g=i-m;if(g!==0){const y=this.options.anchorTo==="end"&&((l=this.scrollState)==null?void 0:l.behavior)!=="smooth"&&this.getVirtualDistanceFromEnd()<=this.options.scrollEndThreshold,M=y?this.getTotalSize():0,T=this.getScrollOffset()+this.scrollAdjustments,x=!this.itemSizeCache.has(f)?h<T:h+m<=T&&this.scrollDirection!=="backward",C=((c=this.scrollState)==null?void 0:c.behavior)!=="smooth"&&(this.shouldAdjustScrollPositionOnItemSizeChange!==void 0?this.shouldAdjustScrollPositionOnItemSizeChange(this.measurementsCache[t]??{index:t,key:f,start:h,size:d,end:h+d,lane:0},g,this):x);(this.pendingMin===null||t<this.pendingMin)&&(this.pendingMin=t),this.itemSizeCache.set(f,i),this.itemSizeCacheVersion++;let I=!1;y?I=this.applyScrollAdjustment(this.getTotalSize()-M):C&&(I=this.applyScrollAdjustment(g)),this.notify(I),this._retryClampedAdjustment()}},this.getVirtualItems=Ma(()=>[this.getVirtualIndexes(),this.getMeasurements()],(t,i)=>{const a=[];for(let l=0,c=t.length;l<c;l++){const d=t[l],h=i[d];a.push(h)}return a},{key:!1,debug:()=>this.options.debug}),this.getVirtualItemForOffset=t=>{var i;const a=this.getMeasurements();if(a.length===0)return;const l=(i=this._singleLaneMeasurements)==null?void 0:i.flat,c=this.options.lanes===1&&l!=null,d=D_(0,a.length-1,c?h=>l[h*2]:h=>X0(a[h]).start,t);return X0(a[d])},this.getMaxScrollOffset=()=>{if(!this.scrollElement)return 0;if("scrollHeight"in this.scrollElement)return this.options.horizontal?this.scrollElement.scrollWidth-this.scrollElement.clientWidth:this.scrollElement.scrollHeight-this.scrollElement.clientHeight;{const t=this.scrollElement.document.documentElement;return this.options.horizontal?t.scrollWidth-this.scrollElement.innerWidth:t.scrollHeight-this.scrollElement.innerHeight}},this.getVirtualDistanceFromEnd=()=>Math.max(this.getTotalSize()-this.getSize()-this.getScrollOffset(),0),this.getDistanceFromEnd=()=>Math.max(this.getMaxScrollOffset()-this.getScrollOffset(),0),this.isAtEnd=(t=this.options.scrollEndThreshold)=>this.getDistanceFromEnd()<=t,this.getOffsetForAlignment=(t,i,a=0)=>{if(!this.scrollElement)return 0;const l=this.getSize(),c=this.getScrollOffset();i==="auto"&&(i=t>=c+l?"end":"start"),i==="center"?t+=(a-l)/2:i==="end"&&(t-=l);const d=this.getMaxScrollOffset();return Math.max(Math.min(d,t),0)},this.getOffsetForIndex=(t,i="auto")=>{t=Math.max(0,Math.min(t,this.options.count-1));const a=this.getSize(),l=this.getScrollOffset(),c=this.measurementsCache[t];if(!c)return;if(i==="auto")if(c.end>=l+a-this.options.scrollPaddingEnd)i="end";else if(c.start<=l+this.options.scrollPaddingStart)i="start";else return[l,i];if(i==="end"&&t===this.options.count-1)return[this.getMaxScrollOffset(),i];const d=i==="end"?c.end+this.options.scrollPaddingEnd:c.start-this.options.scrollPaddingStart;return[this.getOffsetForAlignment(d,i,c.size),i]},this.scrollToOffset=(t,{align:i="start",behavior:a="auto"}={})=>{this._iosDeferredAdjustment=0;const l=this.getOffsetForAlignment(t,i),c=this.now();this.scrollState={index:null,align:i,behavior:a,startedAt:c,lastTargetOffset:l,stableFrames:0},this._scrollToOffset(l,{adjustments:void 0,behavior:a}),this.scheduleScrollReconcile()},this.scrollToIndex=(t,{align:i="auto",behavior:a="auto"}={})=>{this._iosDeferredAdjustment=0,t=Math.max(0,Math.min(t,this.options.count-1));const l=this.getOffsetForIndex(t,i);if(!l)return;const[c,d]=l,h=this.now();this.scrollState={index:t,align:d,behavior:a,startedAt:h,lastTargetOffset:c,stableFrames:0},this._scrollToOffset(c,{adjustments:void 0,behavior:a}),this.scheduleScrollReconcile()},this.scrollBy=(t,{behavior:i="auto"}={})=>{const a=this.getScrollOffset()+t,l=this.now();this.scrollState={index:null,align:"start",behavior:i,startedAt:l,lastTargetOffset:a,stableFrames:0},this._scrollToOffset(a,{adjustments:void 0,behavior:i}),this.scheduleScrollReconcile()},this.scrollToEnd=({behavior:t="auto"}={})=>{if(this.options.count>0){this.scrollToIndex(this.options.count-1,{align:"end",behavior:t});return}this.scrollToOffset(Math.max(this.getTotalSize()-this.getSize(),0),{behavior:t})},this.getTotalSize=()=>{var t,i;const a=this.getMeasurements();let l;if(a.length===0)l=this.options.paddingStart;else if(this.options.lanes===1){const c=a.length-1,d=(t=this._singleLaneMeasurements)==null?void 0:t.flat;d!=null?l=d[c*2]+d[c*2+1]:l=((i=a[c])==null?void 0:i.end)??0}else{const c=Array(this.options.lanes).fill(null);let d=a.length-1;for(;d>=0&&c.some(h=>h===null);){const h=a[d];c[h.lane]===null&&(c[h.lane]=h.end),d--}l=Math.max(...c.filter(h=>h!==null))}return Math.max(l-this.options.scrollMargin+this.options.paddingEnd,0)},this.takeSnapshot=()=>{const t=[];if(this.itemSizeCache.size===0)return t;const i=this.getMeasurements();for(const a of i)a&&this.itemSizeCache.has(a.key)&&t.push({index:a.index,key:a.key,start:a.start,size:a.size,end:a.end,lane:a.lane});return t},this._scrollToOffset=(t,{adjustments:i,behavior:a})=>{this._intendedScrollOffset=t+(i??0),this.options.scrollToFn(t,{behavior:a,adjustments:i},this)},this.measure=()=>{this.pendingMin=null,this.itemSizeCache.clear(),this.laneAssignments.clear(),this.itemSizeCacheVersion++,this.notify(!1)},this.setOptions(e)}applyScrollAdjustment(e,t){if(e===0)return!1;if(ih()&&(this.isScrolling||this._iosTouching||this._iosJustTouchEnded))return this._iosDeferredAdjustment+=e,!1;{const i=this.getScrollOffset()+this.scrollAdjustments+e,a=this.scrollElement,l=a!==null&&("scrollHeight"in a||"document"in a)?this.getMaxScrollOffset():null;return this._clampedAdjustment=l!==null&&i>l+.5?{target:i,maxAtWrite:l}:null,this._scrollToOffset(this.getScrollOffset(),{adjustments:this.scrollAdjustments+=e,behavior:t}),this.scrollOffset!==null&&(this.scrollOffset+=this.scrollAdjustments,this.scrollOffset<0&&(this.scrollOffset=0),this.scrollAdjustments=0),!0}}scheduleScrollReconcile(){if(!this.targetWindow){this.scrollState=null;return}this.rafId==null&&(this.rafId=this.targetWindow.requestAnimationFrame(()=>{this.rafId=null,this.reconcileScroll()}))}reconcileScroll(){if(!this.scrollState||!this.scrollElement)return;if(this.now()-this.scrollState.startedAt>5e3){this.scrollState=null;return}const i=this.scrollState.index!=null?this.getOffsetForIndex(this.scrollState.index,this.scrollState.align):void 0,a=i?i[0]:this.scrollState.lastTargetOffset,l=1,c=a!==this.scrollState.lastTargetOffset;if(!c&&q0(a,this.getScrollOffset())){if(this.scrollState.stableFrames++,this.scrollState.stableFrames>=l){this.getScrollOffset()!==a&&this._scrollToOffset(a,{adjustments:void 0,behavior:"auto"}),this.scrollState=null;return}}else if(this.scrollState.stableFrames=0,c){const d=this.getSize()||600,h=Math.abs(a-this.getScrollOffset()),f=this.scrollState.behavior==="smooth"&&h>d;this.scrollState.lastTargetOffset=a,f||(this.scrollState.behavior="auto"),this._scrollToOffset(a,{adjustments:void 0,behavior:f?"smooth":"auto"})}this.scheduleScrollReconcile()}}const D_=(s,e,t,i)=>{for(;s<=e;){const a=(s+e)/2|0,l=t(a);if(l<i)s=a+1;else if(l>i)e=a-1;else return a}return s>0?s-1:0};function NS(s,e,t){let i=0;for(;i<=e;){const a=(i+e)/2|0,l=s[a*2];if(l<t)i=a+1;else if(l>t)e=a-1;else return a}return i>0?i-1:0}function LS(s,e,t,i,a){const l=s.length-1;if(s.length<=i)return{startIndex:0,endIndex:l};if(i===1&&a!==null){const f=NS(a,l,t);let _=f;const m=t+e;for(;_<l&&a[_*2]+a[_*2+1]<m;)_++;return{startIndex:f,endIndex:_}}let d=D_(0,l,f=>s[f].start,t),h=d;if(i===1)for(;h<l&&s[h].end<t+e;)h++;else if(i>1){const f=Array(i).fill(0);for(;h<l&&f.some(m=>m<t+e);){const m=s[h];f[m.lane]=m.end,h++}const _=Array(i).fill(t+e);for(;d>=0&&_.some(m=>m>=t);){const m=s[d];_[m.lane]=m.start,d--}d=Math.max(0,d-d%i),h=Math.min(l,h+(i-1-h%i))}return{startIndex:d,endIndex:h}}const rh=typeof document<"u"?ln.useLayoutEffect:ln.useEffect;function DS({useFlushSync:s=!0,directDomUpdates:e=!1,directDomUpdatesMode:t="transform",...i}){const a=ln.useReducer(m=>m+1,0)[1],l=ln.useRef({enabled:e,mode:t,container:null,lastSize:null,lastPositions:new WeakMap,prevRange:null});l.current.enabled=e,l.current.mode=t;const c=ln.useRef(!1),d=m=>{const g=l.current;if(!g.enabled||!g.container)return;const y=m.getTotalSize();if(y!==g.lastSize){g.lastSize=y;const M=m.options.horizontal?"width":"height";g.container.style[M]=`${y}px`}},h=m=>{const g=l.current;if(!g.enabled||!g.container)return;d(m);const y=!!m.options.horizontal,M=g.mode==="transform",T=y?"left":"top",S=m.options.scrollMargin,x=m.getVirtualItems();for(const C of x){const I=C.start-S,w=m.elementsCache.get(C.key);w&&g.lastPositions.get(w)!==I&&(g.lastPositions.set(w,I),M?w.style.transform=y?`translate3d(${I}px, 0, 0)`:`translate3d(0, ${I}px, 0)`:w.style[T]=`${I}px`)}},f={...i,onChange:(m,g)=>{var y;const M=l.current;let T=!0;if(M.enabled){h(m);const S=m.range,x=M.prevRange;T=!x||x.isScrolling!==m.isScrolling||x.startIndex!==(S==null?void 0:S.startIndex)||x.endIndex!==(S==null?void 0:S.endIndex),T&&(M.prevRange=S?{startIndex:S.startIndex,endIndex:S.endIndex,isScrolling:m.isScrolling}:null)}T&&(s&&g&&!c.current?gS.flushSync(a):a()),(y=i.onChange)==null||y.call(i,m,g)}},[_]=ln.useState(()=>{const m=new PS(f),g=m.measureElement;return m.measureElement=y=>{c.current=!0;try{g(y)}finally{c.current=!1}},Object.assign(m,{containerRef:y=>{const M=l.current;if(M.container=y,M.lastSize=null,y&&M.enabled){const T=m.getTotalSize();M.lastSize=T;const S=m.options.horizontal?"width":"height";y.style[S]=`${T}px`}}})});return _.setOptions(f),rh(()=>_._didMount(),[]),rh(()=>(d(_),_._willUpdate())),rh(()=>{h(_)}),_}function IS(s){return DS({observeElementRect:MS,observeElementOffset:bS,scrollToFn:CS,...s})}const US=()=>{const{catalog:s,framesById:e,selectedCanId:t,selectMessage:i,filterAccess:a,filterBus:l,searchQuery:c}=yn(),d=ln.useRef(null),[h,f]=fs.useState("id"),[_,m]=fs.useState("asc"),g=x=>{h===x?m(C=>C==="asc"?"desc":"asc"):(f(x),m(x==="rate"||x==="count"?"desc":"asc"))},y=ln.useMemo(()=>{const x=c.trim().toLowerCase();return s.filter(C=>{if(a!=="all"&&C.access.toLowerCase()!==a||l!=="all"&&C.bus.toLowerCase()!==l)return!1;if(x){const I=C.id_hex.toLowerCase(),w=C.id.toString(),R=C.key.toLowerCase(),P=C.name.toLowerCase();if(!I.includes(x)&&!w.includes(x)&&!R.includes(x)&&!P.includes(x))return!1}return!0})},[s,a,l,c]),M=ln.useMemo(()=>{const x=[...y],C=_==="asc"?1:-1;return x.sort((I,w)=>{var R,P,U,A;switch(h){case"id":return(I.id-w.id)*C;case"name":return(I.name||I.key).localeCompare(w.name||w.key)*C;case"access":return I.access.localeCompare(w.access)*C;case"bus":return I.bus.localeCompare(w.bus)*C;case"cycle_ms":return(I.cycle_ms-w.cycle_ms)*C;case"rate":{const D=((R=e[I.id])==null?void 0:R.rate_hz)||0,k=((P=e[w.id])==null?void 0:P.rate_hz)||0;return(D-k)*C}case"count":{const D=((U=e[I.id])==null?void 0:U.count)||0,k=((A=e[w.id])==null?void 0:A.count)||0;return(D-k)*C}default:return 0}}),x},[y,h,_,e]),T=IS({count:M.length,getScrollElement:()=>d.current,estimateSize:()=>40,overscan:10}),S=x=>h!==x?E.jsx("span",{className:"text-[8px] text-neutral-600 ml-1",children:"⇅"}):E.jsx("span",{className:"text-[9px] text-cyan-400 font-bold ml-1",children:_==="asc"?"▲":"▼"});return E.jsxs("div",{className:"flex-1 flex flex-col min-w-0 bg-black border-r border-neutral-800 h-full overflow-hidden",children:[E.jsxs("div",{className:"h-8 bg-[#0a0a0a] border-b border-neutral-800 px-3 flex items-center text-[10px] font-mono font-bold uppercase text-neutral-400 select-none shrink-0 tracking-wider",children:[E.jsxs("div",{onClick:()=>g("access"),className:"w-12 shrink-0 text-center cursor-pointer hover:text-cyan-300 flex items-center justify-center transition-colors",title:"Sort by Access (TX/RX)",children:[E.jsx("span",{children:"ACC"}),S("access")]}),E.jsxs("div",{onClick:()=>g("id"),className:"w-20 shrink-0 cursor-pointer hover:text-cyan-300 flex items-center transition-colors",title:"Sort by CAN Identifier",children:[E.jsx("span",{children:"CAN ID"}),S("id")]}),E.jsxs("div",{onClick:()=>g("name"),className:"flex-1 min-w-[140px] cursor-pointer hover:text-cyan-300 flex items-center transition-colors",title:"Sort by Message Name",children:[E.jsx("span",{children:"MESSAGE NAME"}),S("name")]}),E.jsxs("div",{onClick:()=>g("bus"),className:"w-14 shrink-0 text-center cursor-pointer hover:text-cyan-300 flex items-center justify-center transition-colors",title:"Sort by CAN Bus",children:[E.jsx("span",{children:"BUS"}),S("bus")]}),E.jsxs("div",{onClick:()=>g("cycle_ms"),className:"w-14 shrink-0 text-right cursor-pointer hover:text-cyan-300 flex items-center justify-end transition-colors",title:"Sort by Cycle Time (ms)",children:[E.jsx("span",{children:"CYC"}),S("cycle_ms")]}),E.jsxs("div",{onClick:()=>g("rate"),className:"w-14 shrink-0 text-right cursor-pointer hover:text-cyan-300 flex items-center justify-end transition-colors",title:"Sort by Live Frequency (Hz)",children:[E.jsx("span",{children:"RATE"}),S("rate")]}),E.jsxs("div",{onClick:()=>g("count"),className:"w-16 shrink-0 text-right cursor-pointer hover:text-cyan-300 flex items-center justify-end transition-colors",title:"Sort by Total Frame Count",children:[E.jsx("span",{children:"COUNT"}),S("count")]}),E.jsx("div",{className:"w-52 shrink-0 pl-3",children:"DATA PAYLOAD (HEX)"})]}),E.jsx("div",{ref:d,className:"flex-1 overflow-y-auto min-h-0 divide-y divide-neutral-900",children:M.length===0?E.jsx("div",{className:"h-48 flex items-center justify-center text-xs font-mono text-neutral-500",children:"No CAN messages match the current filter"}):E.jsx("div",{style:{height:`${T.getTotalSize()}px`,width:"100%",position:"relative"},children:T.getVirtualItems().map(x=>{var U;const C=M[x.index],I=e[C.id],w=C.id===t;let R=[];I&&I.data_hex&&(I.data_hex.includes(" ")?R=I.data_hex.trim().split(/\s+/):R=I.data_hex.match(/.{1,2}/g)||[]);const P=Array.from({length:8},(A,D)=>D<R.length?R[D].padStart(2,"0").toUpperCase():"--");return E.jsxs("div",{onClick:()=>i(C.id),style:{position:"absolute",top:0,left:0,width:"100%",height:`${x.size}px`,transform:`translateY(${x.start}px)`},className:`flex items-center px-3 text-xs font-mono cursor-pointer transition-colors border-l-4 ${w?"bg-[#141414] text-white border-l-cyan-400 font-medium":"hover:bg-[#0f0f0f] text-neutral-300 border-l-transparent"}`,children:[E.jsx("div",{className:"w-12 shrink-0 text-center",children:E.jsx("span",{className:`text-[9px] font-bold px-1.5 py-0.5 rounded ${C.access==="RX"?"bg-emerald-500/15 text-emerald-300 border border-emerald-500/30":"bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"}`,children:C.access})}),E.jsxs("div",{className:"w-20 shrink-0 flex flex-col justify-center",children:[E.jsx("span",{className:"font-bold text-neutral-100 tracking-wide",children:C.id_hex}),E.jsxs("span",{className:"text-[10px] text-neutral-500",children:["#",C.id]})]}),E.jsxs("div",{className:"flex-1 min-w-[140px] truncate pr-2",children:[E.jsx("div",{className:"truncate font-bold text-neutral-100",title:C.name,children:C.key}),E.jsxs("div",{className:"text-[10px] text-neutral-500 truncate",children:[C.sender," → ",((U=C.receivers)==null?void 0:U.join(", "))||"ALL"]})]}),E.jsx("div",{className:"w-14 shrink-0 text-center",children:E.jsx("span",{className:`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${C.bus.toLowerCase()==="high"?"bg-purple-950/60 text-purple-300 border border-purple-800/60":"bg-neutral-900 text-neutral-300 border border-neutral-800"}`,children:C.bus.toUpperCase()})}),E.jsx("div",{className:"w-14 shrink-0 text-right text-neutral-300 text-[11px] tabular-nums font-semibold",children:C.cycle_ms?`${C.cycle_ms}ms`:"—"}),E.jsx("div",{className:"w-14 shrink-0 text-right tabular-nums text-[11px]",children:I&&I.rate_hz>0?E.jsxs("span",{className:"text-emerald-400 font-bold",children:[I.rate_hz.toFixed(1)," ",E.jsx("span",{className:"text-[9px] text-neutral-500 font-normal",children:"Hz"})]}):E.jsx("span",{className:"text-neutral-600",children:"0.0"})}),E.jsx("div",{className:"w-16 shrink-0 text-right tabular-nums text-neutral-400 text-[11px] font-medium",children:I?I.count.toLocaleString():"0"}),E.jsx("div",{className:"w-52 shrink-0 pl-3 flex items-center gap-1 font-mono text-[11px]",children:P.map((A,D)=>E.jsx("span",{className:`px-1 py-0.5 rounded text-center min-w-[20px] ${A==="--"?"text-neutral-700 bg-neutral-950":w?"text-cyan-200 font-bold bg-cyan-950 border border-cyan-800":"text-neutral-200 bg-[#121212] font-semibold border border-neutral-800"}`,children:A},D))})]},C.id)})})}),E.jsxs("div",{className:"h-6 bg-[#0a0a0a] border-t border-neutral-800 px-3 flex items-center justify-between text-[10px] font-mono text-neutral-400 select-none shrink-0",children:[E.jsxs("span",{children:["Showing ",E.jsx("strong",{className:"text-neutral-200",children:y.length})," of"," ",E.jsx("strong",{className:"text-neutral-200",children:s.length})," messages"]}),E.jsx("span",{className:"text-neutral-500",children:"Click a message row to inspect payload matrix"})]})]})},OS=()=>{const{catalog:s,selectedCanId:e,framesById:t,hoveredSignal:i,setHoveredSignal:a}=yn(),l=s.find(_=>_.id===e),c=t[e],d=(l==null?void 0:l.dlc)??8,h=Array.from({length:8},()=>[]);if(c&&c.bit_cells&&c.bit_cells.length===64)for(const _ of c.bit_cells)h[_.byte].push(_);else{const _=(l==null?void 0:l.signals)||[];for(let m=0;m<8;m++)for(let g=0;g<8;g++){let y=null,M=null;for(const T of _){const S=m*8+g,x=T.byte*8+T.bit,C=x+T.bits;if(S>=x&&S<C){y=T.name,M=T.color;break}}h[m].push({index:m*8+g,byte:m,bit:g,val:0,owner:y,color:M})}}for(let _=0;_<8;_++)h[_].sort((m,g)=>g.bit-m.bit);let f=[];return c&&c.data_hex&&(c.data_hex.includes(" ")?f=c.data_hex.trim().split(/\s+/):f=c.data_hex.match(/.{1,2}/g)||[]),E.jsxs("div",{className:"bg-black border-b border-neutral-800 p-3 select-none shrink-0",children:[E.jsxs("div",{className:"flex items-center justify-between pb-2 border-b border-neutral-800",children:[E.jsxs("div",{className:"flex items-center gap-2",children:[E.jsx("span",{className:"text-sm font-black text-cyan-400 font-mono tracking-wide",children:(l==null?void 0:l.id_hex)||"0x000"}),E.jsx("span",{className:"text-sm font-bold text-neutral-100 font-mono",children:(l==null?void 0:l.key)||"SELECT A MESSAGE"}),l&&E.jsx("span",{className:`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${l.access==="RX"?"bg-emerald-500/15 text-emerald-300 border border-emerald-500/30":"bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"}`,children:l.access})]}),E.jsxs("div",{className:"flex items-center gap-3 text-[11px] font-mono text-neutral-300",children:[E.jsxs("div",{children:["Rate:"," ",E.jsx("span",{className:"text-emerald-400 font-bold tabular-nums",children:c!=null&&c.rate_hz?`${c.rate_hz.toFixed(1)} Hz`:"0.0 Hz"})]}),E.jsx("div",{className:"text-neutral-700",children:"|"}),E.jsxs("div",{children:["DLC: ",E.jsx("span",{className:"text-neutral-100 font-bold",children:d})]}),E.jsx("div",{className:"text-neutral-700",children:"|"}),E.jsxs("div",{children:["Count:"," ",E.jsx("span",{className:"text-neutral-100 font-bold tabular-nums",children:(c==null?void 0:c.count.toLocaleString())||"0"})]})]})]}),E.jsxs("div",{className:"flex items-center justify-between mt-2.5 mb-1.5 text-[10px] font-mono",children:[E.jsx("div",{className:"font-bold text-neutral-300 tracking-wider",children:"64-BIT PAYLOAD MATRIX (8 BYTES × 8 BITS)"}),E.jsxs("div",{className:"flex items-center gap-1.5 text-neutral-500 font-semibold",children:[E.jsx("span",{children:"← MSB (Bit 7)"}),E.jsx("span",{children:"•"}),E.jsx("span",{children:"LSB (Bit 0) →"})]})]}),E.jsxs("div",{className:"bg-[#080808] p-2.5 rounded-lg border border-neutral-800",children:[E.jsxs("div",{className:"grid grid-cols-[68px_repeat(8,1fr)] gap-1 mb-1 text-center font-mono text-[10px] text-neutral-500 font-bold",children:[E.jsx("div",{className:"text-left text-neutral-500 pl-1",children:"BYTE"}),E.jsx("div",{children:"b7"}),E.jsx("div",{children:"b6"}),E.jsx("div",{children:"b5"}),E.jsx("div",{children:"b4"}),E.jsx("div",{children:"b3"}),E.jsx("div",{children:"b2"}),E.jsx("div",{children:"b1"}),E.jsx("div",{children:"b0"})]}),E.jsx("div",{className:"space-y-1",children:h.map((_,m)=>{const g=(f[m]||"00").padStart(2,"0").toUpperCase(),y=m>=d;return E.jsxs("div",{className:`grid grid-cols-[68px_repeat(8,1fr)] gap-1 items-center font-mono transition-opacity ${y?"opacity-35":"opacity-100"}`,children:[E.jsxs("div",{className:`flex items-center justify-between text-[10px] px-1.5 py-1 rounded border font-semibold ${y?"bg-neutral-950 text-neutral-600 border-neutral-900":"bg-[#0f0f0f] text-neutral-300 border-neutral-800"}`,title:y?`Byte ${m} is beyond DLC ${d} (Padding)`:`Byte ${m}: 0x${g}`,children:[E.jsxs("span",{className:"text-neutral-500 text-[9px] font-mono",children:["B",m]}),E.jsx("span",{className:"text-cyan-300 font-bold text-[11px] font-mono",children:g})]}),_.map(M=>{const T=!y&&!!i&&M.owner===i,S=!!M.owner&&!y,x=M.color||"#262626";return E.jsx("div",{onMouseEnter:()=>!y&&M.owner&&a(M.owner),onMouseLeave:()=>a(null),style:{backgroundColor:T?`${x}ee`:S?`${x}40`:"#0c0c0c",borderColor:T?"#ffffff":S?`${x}cc`:"#1c1c1c"},className:`h-7 rounded flex items-center justify-center text-xs font-mono transition-all border cursor-pointer select-none tabular-nums ${M.val===1?"text-white font-black drop-shadow-[0_0_4px_rgba(255,255,255,0.7)]":"text-neutral-400 font-bold"} ${T?"scale-110 shadow-lg shadow-cyan-500/30 z-10 ring-2 ring-white":""}`,title:y?`Byte ${M.byte}, Bit ${M.bit} [Beyond DLC ${d}]`:M.owner?`Byte ${M.byte}, Bit ${M.bit} | Signal: ${M.owner} | Val: ${M.val}`:`Byte ${M.byte}, Bit ${M.bit} | Unmapped | Val: ${M.val}`,children:M.val},M.bit)})]},m)})})]}),E.jsx("div",{className:"mt-2 h-6 flex items-center justify-between text-[11px] font-mono px-1",children:i?E.jsxs("div",{className:"flex items-center gap-2",children:[E.jsx("span",{className:"text-neutral-400 font-medium",children:"Highlighted Signal:"}),E.jsx("span",{className:"font-bold text-cyan-300 bg-[#141414] px-2 py-0.5 rounded border border-cyan-800",children:i})]}):E.jsx("span",{className:"text-neutral-500",children:"Hover any bit or signal below to inspect bit-field mapping"})})]})};function FS(s,e){if(e&&e.trim().length>0)return e;const t=s.toLowerCase();return t.endsWith("_mmps")?"mm/s":t.endsWith("_mrad_s")?"mrad/s":t.endsWith("_kpa")?"kPa":t.endsWith("_deg")?"deg":t.endsWith("_kmh")?"km/h":t.endsWith("_mv")?"mV":t.endsWith("_ma")?"mA":t.endsWith("_c")?"°C":t.endsWith("_pct")||t.endsWith("_percent")?"%":t.endsWith("_count")||t.endsWith("_counter")?"cnt":t.startsWith("light_")||t.endsWith("_ok")||t.endsWith("_valid")||t.endsWith("_active")?"flag":""}const kS=()=>{const{catalog:s,selectedCanId:e,framesById:t,hoveredSignal:i,setHoveredSignal:a}=yn(),l=s.find(h=>h.id===e),c=t[e],d=(l==null?void 0:l.signals)||[];return fs.useEffect(()=>{const h=f=>{var m;const _=(m=f.target)==null?void 0:m.tagName;if(!(_==="INPUT"||_==="TEXTAREA")&&d.length!==0)if(f.key==="ArrowDown"||f.key==="ArrowUp"){f.preventDefault();const g=d.findIndex(T=>T.name===i);let y=0;f.key==="ArrowDown"?y=g===-1?0:(g+1)%d.length:f.key==="ArrowUp"&&(y=g<=0?d.length-1:g-1);const M=d[y];if(M){a(M.name);const T=document.getElementById(`signal-row-${M.name}`);T&&T.scrollIntoView({block:"nearest",behavior:"smooth"})}}else f.key==="Escape"&&a(null)};return window.addEventListener("keydown",h),()=>window.removeEventListener("keydown",h)},[d,i,a]),E.jsxs("div",{className:"flex-1 flex flex-col min-h-0 bg-black overflow-hidden",children:[E.jsxs("div",{className:"h-8 bg-[#0a0a0a] border-b border-neutral-800 px-3 flex items-center justify-between select-none shrink-0",children:[E.jsxs("div",{className:"flex items-center gap-2",children:[E.jsxs("span",{className:"text-[10px] font-mono font-bold uppercase text-neutral-300 tracking-wider",children:["DECODED SIGNALS (",d.length,")"]}),E.jsx("span",{className:"text-[9px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/60 font-medium",children:"[↑/↓] Select • [Esc] Clear"})]}),E.jsx("span",{className:"text-[10px] font-mono text-neutral-500 font-medium",children:"Bi-Directional Bit Matrix Mapping"})]}),E.jsxs("div",{className:"h-7 bg-[#0a0a0a]/90 border-b border-neutral-800 px-3 flex items-center text-[10px] font-mono font-bold uppercase text-neutral-400 select-none shrink-0",children:[E.jsx("div",{className:"w-5"}),E.jsx("div",{className:"w-40",children:"SIGNAL NAME"}),E.jsx("div",{className:"w-28 text-right pr-2",children:"PHYS VALUE"}),E.jsx("div",{className:"w-16 text-right pr-2",children:"RAW"}),E.jsx("div",{className:"w-24",children:"BIT RANGE"}),E.jsx("div",{className:"w-14",children:"ENDIAN"}),E.jsx("div",{className:"flex-1 pl-1 whitespace-nowrap",children:"SCALE / RANGE"})]}),E.jsx("div",{className:"flex-1 overflow-y-auto divide-y divide-neutral-900 bg-black",children:d.length===0?E.jsx("div",{className:"h-32 flex items-center justify-center text-xs font-mono text-neutral-500",children:"No signals mapped for this message key"}):d.map(h=>{const f=i===h.name,_=c!=null&&c.signals?c.signals[h.name]:null;let m="—";_&&_.value!==void 0&&(typeof _.value=="number"?m=Number.isInteger(_.value)?_.value.toString():_.value.toFixed(2):m=String(_.value));let g="—";if(_&&_.raw!==void 0){const M=Number(_.raw);if(h.signed&&M<0){const T=(1<<h.bits)-1;g=`0x${((M&T)>>>0).toString(16).toUpperCase()}`}else g=`0x${M.toString(16).toUpperCase()}`}const y=FS(h.name,h.unit);return E.jsxs("div",{id:`signal-row-${h.name}`,onClick:()=>a(f?null:h.name),onMouseEnter:()=>a(h.name),onMouseLeave:()=>a(null),className:`flex items-center px-3 py-1.5 text-xs font-mono transition-all cursor-pointer ${f?"bg-[#141414] text-white ring-1 ring-cyan-500/50 border-l-4 border-cyan-400":"hover:bg-[#0d0d0d] text-neutral-300 border-l-4 border-transparent"}`,children:[E.jsx("div",{className:"w-5 flex items-center",children:E.jsx("span",{className:`w-3 h-3 rounded-full inline-block shrink-0 shadow-sm transition-transform ${f?"scale-125 ring-2 ring-white":""}`,style:{backgroundColor:h.color}})}),E.jsxs("div",{className:"w-40 truncate pr-2 font-medium",title:h.name,children:[E.jsx("span",{className:f?"text-cyan-300 font-bold":"text-neutral-200 font-semibold",children:h.name}),h.comment&&E.jsx("span",{className:"block text-[9px] text-neutral-500 truncate font-normal",children:h.comment})]}),E.jsxs("div",{className:"w-28 text-right pr-2",children:[E.jsx("span",{className:"text-emerald-400 font-black tabular-nums text-[13px]",children:m}),y&&E.jsx("span",{className:"ml-1 text-[10px] text-neutral-500 font-medium",children:y})]}),E.jsx("div",{className:"w-16 text-right pr-2 text-neutral-300 text-[11px] tabular-nums font-semibold",children:g}),E.jsxs("div",{className:"w-24 text-[10px] text-neutral-300",children:[E.jsxs("span",{className:"font-bold",children:["B",h.byte,":b",h.bit]}),E.jsxs("span",{className:"text-neutral-500 text-[9px] ml-1",children:["(",h.bits,"b)"]})]}),E.jsxs("div",{className:"w-14 text-[10px] text-neutral-400 uppercase font-semibold",children:[E.jsx("span",{className:h.endian==="big"?"text-purple-300":"text-blue-300",children:h.endian==="big"?"BE":"LE"})," ",E.jsx("span",{className:h.signed?"text-amber-300":"text-emerald-300",children:h.signed?"S":"U"})]}),E.jsxs("div",{className:"flex-1 text-[10px] text-neutral-300 truncate pl-1",children:[h.scale===1&&h.offset===0?E.jsx("span",{className:"text-neutral-500",children:"1:1"}):E.jsxs("span",{className:"text-neutral-300",children:["×",h.scale," + ",h.offset]}),h.min_val!==null&&h.max_val!==null&&E.jsxs("span",{className:"ml-2 text-neutral-500 text-[9px]",children:["[",h.min_val,", ",h.max_val,"]"]})]})]},h.name)})})]})};/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ff="186",za={ROTATE:0,DOLLY:1,PAN:2},ka={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},BS=0,$0=1,zS=2,$c=1,HS=2,Qo=3,qs=0,si=1,Gi=2,Lr=0,nl=1,K0=2,Z0=3,Q0=4,VS=5,Fa=100,GS=101,WS=102,jS=103,XS=104,qS=200,YS=201,$S=202,KS=203,I_=204,U_=205,ZS=206,QS=207,JS=208,eM=209,tM=210,nM=211,iM=212,rM=213,sM=214,Wh=0,jh=1,Xh=2,rl=3,qh=4,Yh=5,$h=6,Kh=7,kf=0,aM=1,oM=2,or=0,O_=1,F_=2,k_=3,B_=4,z_=5,H_=6,V_=7,G_=300,Ys=301,Ja=302,sh=303,ah=304,mu=306,Zh=1e3,Nr=1001,Qh=1002,Ln=1003,lM=1004,yc=1005,Vn=1006,oh=1007,ks=1008,mi=1009,W_=1010,j_=1011,sl=1012,Bf=1013,cr=1014,Xi=1015,ur=1016,zf=1017,Hf=1018,al=1020,X_=35902,q_=35899,Y_=1021,$_=1022,qi=1023,Ir=1026,Bs=1027,Vf=1028,Gf=1029,$s=1030,Wf=1031,jf=1033,Kc=33776,Zc=33777,Qc=33778,Jc=33779,Jh=35840,ef=35841,tf=35842,nf=35843,rf=36196,sf=37492,af=37496,of=37488,lf=37489,ru=37490,cf=37491,uf=37808,df=37809,hf=37810,ff=37811,pf=37812,mf=37813,gf=37814,_f=37815,xf=37816,vf=37817,yf=37818,Sf=37819,Mf=37820,Ef=37821,wf=36492,bf=36494,Tf=36495,Af=36283,Cf=36284,su=36285,Rf=36286,cM=3200,au=0,uM=1,as="",fi="srgb",ou="srgb-linear",lu="linear",zt="srgb",lh=7680,dM=519,hM=512,fM=513,pM=514,Xf=515,mM=516,gM=517,qf=518,_M=519,xM=35044,J0="300 es",ar=2e3,ol=2001;function vM(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function cu(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function yM(){const s=cu("canvas");return s.style.display="block",s}const eg={};function tg(...s){const e="THREE."+s.shift();console.log(e,...s)}function K_(s){const e=s[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=s[1];t&&t.isStackTrace?s[0]+=" "+t.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function ot(...s){s=K_(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...s)}}function Ut(...s){s=K_(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...s)}}function Ha(...s){const e=s.join(" ");e in eg||(eg[e]=!0,ot(...s))}function SM(s,e,t){return new Promise(function(i,a){function l(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:a();break;case s.TIMEOUT_EXPIRED:setTimeout(l,t);break;default:i()}}setTimeout(l,t)})}const MM={[Wh]:jh,[Xh]:$h,[qh]:Kh,[rl]:Yh,[jh]:Wh,[$h]:Xh,[Kh]:qh,[Yh]:rl};class ms{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const a=i[e];if(a!==void 0){const l=a.indexOf(t);l!==-1&&a.splice(l,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const a=i.slice(0);for(let l=0,c=a.length;l<c;l++)a[l].call(this,e);e.target=null}}}const Bn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],eu=Math.PI/180,uu=180/Math.PI;function fl(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Bn[s&255]+Bn[s>>8&255]+Bn[s>>16&255]+Bn[s>>24&255]+"-"+Bn[e&255]+Bn[e>>8&255]+"-"+Bn[e>>16&15|64]+Bn[e>>24&255]+"-"+Bn[t&63|128]+Bn[t>>8&255]+"-"+Bn[t>>16&255]+Bn[t>>24&255]+Bn[i&255]+Bn[i>>8&255]+Bn[i>>16&255]+Bn[i>>24&255]).toLowerCase()}function Et(s,e,t){return Math.max(e,Math.min(t,s))}function EM(s,e){return(s%e+e)%e}function ch(s,e,t){return(1-t)*s+t*e}function Ho(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:case Uint8ClampedArray:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function ii(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const wM={DEG2RAD:eu},rp=class rp{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,a=e.elements;return this.x=a[0]*t+a[3]*i+a[6],this.y=a[1]*t+a[4]*i+a[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Et(this.x,e.x,t.x),this.y=Et(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Et(this.x,e,t),this.y=Et(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Et(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Et(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),a=Math.sin(t),l=this.x-e.x,c=this.y-e.y;return this.x=l*i-c*a+e.x,this.y=l*a+c*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};rp.prototype.isVector2=!0;let lt=rp;class ps{constructor(e=0,t=0,i=0,a=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=a}static slerpFlat(e,t,i,a,l,c,d){let h=i[a+0],f=i[a+1],_=i[a+2],m=i[a+3],g=l[c+0],y=l[c+1],M=l[c+2],T=l[c+3];if(m!==T||h!==g||f!==y||_!==M){let S=h*g+f*y+_*M+m*T;S<0&&(g=-g,y=-y,M=-M,T=-T,S=-S);let x=1-d;if(S<.9995){const C=Math.acos(S),I=Math.sin(C);x=Math.sin(x*C)/I,d=Math.sin(d*C)/I,h=h*x+g*d,f=f*x+y*d,_=_*x+M*d,m=m*x+T*d}else{h=h*x+g*d,f=f*x+y*d,_=_*x+M*d,m=m*x+T*d;const C=1/Math.sqrt(h*h+f*f+_*_+m*m);h*=C,f*=C,_*=C,m*=C}}e[t]=h,e[t+1]=f,e[t+2]=_,e[t+3]=m}static multiplyQuaternionsFlat(e,t,i,a,l,c){const d=i[a],h=i[a+1],f=i[a+2],_=i[a+3],m=l[c],g=l[c+1],y=l[c+2],M=l[c+3];return e[t]=d*M+_*m+h*y-f*g,e[t+1]=h*M+_*g+f*m-d*y,e[t+2]=f*M+_*y+d*g-h*m,e[t+3]=_*M-d*m-h*g-f*y,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,a){return this._x=e,this._y=t,this._z=i,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,a=e._y,l=e._z,c=e._order,d=Math.cos,h=Math.sin,f=d(i/2),_=d(a/2),m=d(l/2),g=h(i/2),y=h(a/2),M=h(l/2);switch(c){case"XYZ":this._x=g*_*m+f*y*M,this._y=f*y*m-g*_*M,this._z=f*_*M+g*y*m,this._w=f*_*m-g*y*M;break;case"YXZ":this._x=g*_*m+f*y*M,this._y=f*y*m-g*_*M,this._z=f*_*M-g*y*m,this._w=f*_*m+g*y*M;break;case"ZXY":this._x=g*_*m-f*y*M,this._y=f*y*m+g*_*M,this._z=f*_*M+g*y*m,this._w=f*_*m-g*y*M;break;case"ZYX":this._x=g*_*m-f*y*M,this._y=f*y*m+g*_*M,this._z=f*_*M-g*y*m,this._w=f*_*m+g*y*M;break;case"YZX":this._x=g*_*m+f*y*M,this._y=f*y*m+g*_*M,this._z=f*_*M-g*y*m,this._w=f*_*m-g*y*M;break;case"XZY":this._x=g*_*m-f*y*M,this._y=f*y*m-g*_*M,this._z=f*_*M+g*y*m,this._w=f*_*m+g*y*M;break;default:ot("Quaternion: .setFromEuler() encountered an unknown order: "+c)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,a=Math.sin(i);return this._x=e.x*a,this._y=e.y*a,this._z=e.z*a,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],a=t[4],l=t[8],c=t[1],d=t[5],h=t[9],f=t[2],_=t[6],m=t[10],g=i+d+m;if(g>0){const y=.5/Math.sqrt(g+1);this._w=.25/y,this._x=(_-h)*y,this._y=(l-f)*y,this._z=(c-a)*y}else if(i>d&&i>m){const y=2*Math.sqrt(1+i-d-m);this._w=(_-h)/y,this._x=.25*y,this._y=(a+c)/y,this._z=(l+f)/y}else if(d>m){const y=2*Math.sqrt(1+d-i-m);this._w=(l-f)/y,this._x=(a+c)/y,this._y=.25*y,this._z=(h+_)/y}else{const y=2*Math.sqrt(1+m-i-d);this._w=(c-a)/y,this._x=(l+f)/y,this._y=(h+_)/y,this._z=.25*y}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Et(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const a=Math.min(1,t/i);return this.slerp(e,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,a=e._y,l=e._z,c=e._w,d=t._x,h=t._y,f=t._z,_=t._w;return this._x=i*_+c*d+a*f-l*h,this._y=a*_+c*h+l*d-i*f,this._z=l*_+c*f+i*h-a*d,this._w=c*_-i*d-a*h-l*f,this._onChangeCallback(),this}slerp(e,t){let i=e._x,a=e._y,l=e._z,c=e._w,d=this.dot(e);d<0&&(i=-i,a=-a,l=-l,c=-c,d=-d);let h=1-t;if(d<.9995){const f=Math.acos(d),_=Math.sin(f);h=Math.sin(h*f)/_,t=Math.sin(t*f)/_,this._x=this._x*h+i*t,this._y=this._y*h+a*t,this._z=this._z*h+l*t,this._w=this._w*h+c*t,this._onChangeCallback()}else this._x=this._x*h+i*t,this._y=this._y*h+a*t,this._z=this._z*h+l*t,this._w=this._w*h+c*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),a=Math.sqrt(1-i),l=Math.sqrt(i);return this.set(a*Math.sin(e),a*Math.cos(e),l*Math.sin(t),l*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const sp=class sp{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(ng.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(ng.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,a=this.z,l=e.elements;return this.x=l[0]*t+l[3]*i+l[6]*a,this.y=l[1]*t+l[4]*i+l[7]*a,this.z=l[2]*t+l[5]*i+l[8]*a,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,a=this.z,l=e.elements,c=1/(l[3]*t+l[7]*i+l[11]*a+l[15]);return this.x=(l[0]*t+l[4]*i+l[8]*a+l[12])*c,this.y=(l[1]*t+l[5]*i+l[9]*a+l[13])*c,this.z=(l[2]*t+l[6]*i+l[10]*a+l[14])*c,this}applyQuaternion(e){const t=this.x,i=this.y,a=this.z,l=e.x,c=e.y,d=e.z,h=e.w,f=2*(c*a-d*i),_=2*(d*t-l*a),m=2*(l*i-c*t);return this.x=t+h*f+c*m-d*_,this.y=i+h*_+d*f-l*m,this.z=a+h*m+l*_-c*f,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,a=this.z,l=e.elements;return this.x=l[0]*t+l[4]*i+l[8]*a,this.y=l[1]*t+l[5]*i+l[9]*a,this.z=l[2]*t+l[6]*i+l[10]*a,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Et(this.x,e.x,t.x),this.y=Et(this.y,e.y,t.y),this.z=Et(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Et(this.x,e,t),this.y=Et(this.y,e,t),this.z=Et(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Et(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,a=e.y,l=e.z,c=t.x,d=t.y,h=t.z;return this.x=a*h-l*d,this.y=l*c-i*h,this.z=i*d-a*c,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return uh.copy(this).projectOnVector(e),this.sub(uh)}reflect(e){return this.sub(uh.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Et(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,a=this.z-e.z;return t*t+i*i+a*a}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const a=Math.sin(t)*e;return this.x=a*Math.sin(i),this.y=Math.cos(t)*e,this.z=a*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),a=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=a,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};sp.prototype.isVector3=!0;let X=sp;const uh=new X,ng=new ps,ap=class ap{constructor(e,t,i,a,l,c,d,h,f){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,a,l,c,d,h,f)}set(e,t,i,a,l,c,d,h,f){const _=this.elements;return _[0]=e,_[1]=a,_[2]=d,_[3]=t,_[4]=l,_[5]=h,_[6]=i,_[7]=c,_[8]=f,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,a=t.elements,l=this.elements,c=i[0],d=i[3],h=i[6],f=i[1],_=i[4],m=i[7],g=i[2],y=i[5],M=i[8],T=a[0],S=a[3],x=a[6],C=a[1],I=a[4],w=a[7],R=a[2],P=a[5],U=a[8];return l[0]=c*T+d*C+h*R,l[3]=c*S+d*I+h*P,l[6]=c*x+d*w+h*U,l[1]=f*T+_*C+m*R,l[4]=f*S+_*I+m*P,l[7]=f*x+_*w+m*U,l[2]=g*T+y*C+M*R,l[5]=g*S+y*I+M*P,l[8]=g*x+y*w+M*U,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],a=e[2],l=e[3],c=e[4],d=e[5],h=e[6],f=e[7],_=e[8];return t*c*_-t*d*f-i*l*_+i*d*h+a*l*f-a*c*h}invert(){const e=this.elements,t=e[0],i=e[1],a=e[2],l=e[3],c=e[4],d=e[5],h=e[6],f=e[7],_=e[8],m=_*c-d*f,g=d*h-_*l,y=f*l-c*h,M=t*m+i*g+a*y;if(M===0)return this.set(0,0,0,0,0,0,0,0,0);const T=1/M;return e[0]=m*T,e[1]=(a*f-_*i)*T,e[2]=(d*i-a*c)*T,e[3]=g*T,e[4]=(_*t-a*h)*T,e[5]=(a*l-d*t)*T,e[6]=y*T,e[7]=(i*h-f*t)*T,e[8]=(c*t-i*l)*T,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,a,l,c,d){const h=Math.cos(l),f=Math.sin(l);return this.set(i*h,i*f,-i*(h*c+f*d)+c+e,-a*f,a*h,-a*(-f*c+h*d)+d+t,0,0,1),this}scale(e,t){return Ha("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(dh.makeScale(e,t)),this}rotate(e){return Ha("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(dh.makeRotation(-e)),this}translate(e,t){return Ha("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(dh.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let a=0;a<9;a++)if(t[a]!==i[a])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};ap.prototype.isMatrix3=!0;let mt=ap;const dh=new mt,ig=new mt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),rg=new mt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function bM(){const s={enabled:!0,workingColorSpace:ou,spaces:{},convert:function(a,l,c){return this.enabled===!1||l===c||!l||!c||(this.spaces[l].transfer===zt&&(a.r=Dr(a.r),a.g=Dr(a.g),a.b=Dr(a.b)),this.spaces[l].primaries!==this.spaces[c].primaries&&(a.applyMatrix3(this.spaces[l].toXYZ),a.applyMatrix3(this.spaces[c].fromXYZ)),this.spaces[c].transfer===zt&&(a.r=Va(a.r),a.g=Va(a.g),a.b=Va(a.b))),a},workingToColorSpace:function(a,l){return this.convert(a,this.workingColorSpace,l)},colorSpaceToWorking:function(a,l){return this.convert(a,l,this.workingColorSpace)},getPrimaries:function(a){return this.spaces[a].primaries},getTransfer:function(a){return a===as?lu:this.spaces[a].transfer},getToneMappingMode:function(a){return this.spaces[a].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(a,l=this.workingColorSpace){return a.fromArray(this.spaces[l].luminanceCoefficients)},define:function(a){Object.assign(this.spaces,a)},_getMatrix:function(a,l,c){return a.copy(this.spaces[l].toXYZ).multiply(this.spaces[c].fromXYZ)},_getDrawingBufferColorSpace:function(a){return this.spaces[a].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(a=this.workingColorSpace){return this.spaces[a].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(a,l){return Ha("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(a,l)},toWorkingColorSpace:function(a,l){return Ha("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(a,l)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return s.define({[ou]:{primaries:e,whitePoint:i,transfer:lu,toXYZ:ig,fromXYZ:rg,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:fi},outputColorSpaceConfig:{drawingBufferColorSpace:fi}},[fi]:{primaries:e,whitePoint:i,transfer:zt,toXYZ:ig,fromXYZ:rg,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:fi}}}),s}const At=bM();function Dr(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Va(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let Ea;class TM{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Ea===void 0&&(Ea=cu("canvas")),Ea.width=e.width,Ea.height=e.height;const a=Ea.getContext("2d");e instanceof ImageData?a.putImageData(e,0,0):a.drawImage(e,0,0,e.width,e.height),i=Ea}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=cu("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const a=i.getImageData(0,0,e.width,e.height),l=a.data;for(let c=0;c<l.length;c++)l[c]=Dr(l[c]/255)*255;return i.putImageData(a,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Dr(t[i]/255)*255):t[i]=Dr(t[i]);return{data:t,width:e.width,height:e.height}}else return ot("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let AM=0;class Yf{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:AM++}),this.uuid=fl(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},a=this.data;if(a!==null){let l;if(Array.isArray(a)){l=[];for(let c=0,d=a.length;c<d;c++)a[c].isDataTexture?l.push(hh(a[c].image)):l.push(hh(a[c]))}else l=hh(a);i.url=l}return t||(e.images[this.uuid]=i),i}}function hh(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?TM.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(ot("Texture: Unable to serialize Texture."),{})}let CM=0;const fh=new X;class Kn extends ms{constructor(e=Kn.DEFAULT_IMAGE,t=Kn.DEFAULT_MAPPING,i=Nr,a=Nr,l=Vn,c=ks,d=qi,h=mi,f=Kn.DEFAULT_ANISOTROPY,_=as){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:CM++}),this.uuid=fl(),this.name="",this.source=new Yf(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=l,this.minFilter=c,this.anisotropy=f,this.format=d,this.internalFormat=null,this.type=h,this.offset=new lt(0,0),this.repeat=new lt(1,1),this.center=new lt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new mt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=_,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(fh).x}get height(){return this.source.getSize(fh).y}get depth(){return this.source.getSize(fh).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){ot(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const a=this[t];if(a===void 0){ot(`Texture.setValues(): property '${t}' does not exist.`);continue}a&&i&&a.isVector2&&i.isVector2||a&&i&&a.isVector3&&i.isVector3||a&&i&&a.isMatrix3&&i.isMatrix3?a.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==G_)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Zh:e.x=e.x-Math.floor(e.x);break;case Nr:e.x=e.x<0?0:1;break;case Qh:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Zh:e.y=e.y-Math.floor(e.y);break;case Nr:e.y=e.y<0?0:1;break;case Qh:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Kn.DEFAULT_IMAGE=null;Kn.DEFAULT_MAPPING=G_;Kn.DEFAULT_ANISOTROPY=1;const op=class op{constructor(e=0,t=0,i=0,a=1){this.x=e,this.y=t,this.z=i,this.w=a}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,a){return this.x=e,this.y=t,this.z=i,this.w=a,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,a=this.z,l=this.w,c=e.elements;return this.x=c[0]*t+c[4]*i+c[8]*a+c[12]*l,this.y=c[1]*t+c[5]*i+c[9]*a+c[13]*l,this.z=c[2]*t+c[6]*i+c[10]*a+c[14]*l,this.w=c[3]*t+c[7]*i+c[11]*a+c[15]*l,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,a,l;const h=e.elements,f=h[0],_=h[4],m=h[8],g=h[1],y=h[5],M=h[9],T=h[2],S=h[6],x=h[10];if(Math.abs(_-g)<.01&&Math.abs(m-T)<.01&&Math.abs(M-S)<.01){if(Math.abs(_+g)<.1&&Math.abs(m+T)<.1&&Math.abs(M+S)<.1&&Math.abs(f+y+x-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const I=(f+1)/2,w=(y+1)/2,R=(x+1)/2,P=(_+g)/4,U=(m+T)/4,A=(M+S)/4;return I>w&&I>R?I<.01?(i=0,a=.707106781,l=.707106781):(i=Math.sqrt(I),a=P/i,l=U/i):w>R?w<.01?(i=.707106781,a=0,l=.707106781):(a=Math.sqrt(w),i=P/a,l=A/a):R<.01?(i=.707106781,a=.707106781,l=0):(l=Math.sqrt(R),i=U/l,a=A/l),this.set(i,a,l,t),this}let C=Math.sqrt((S-M)*(S-M)+(m-T)*(m-T)+(g-_)*(g-_));return Math.abs(C)<.001&&(C=1),this.x=(S-M)/C,this.y=(m-T)/C,this.z=(g-_)/C,this.w=Math.acos((f+y+x-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Et(this.x,e.x,t.x),this.y=Et(this.y,e.y,t.y),this.z=Et(this.z,e.z,t.z),this.w=Et(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Et(this.x,e,t),this.y=Et(this.y,e,t),this.z=Et(this.z,e,t),this.w=Et(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Et(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};op.prototype.isVector4=!0;let sn=op;class RM extends ms{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Vn,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new sn(0,0,e,t),this.scissorTest=!1,this.viewport=new sn(0,0,e,t),this.textures=[];const a={width:e,height:t,depth:i.depth},l=new Kn(a),c=i.count;for(let d=0;d<c;d++)this.textures[d]=l.clone(),this.textures[d].isRenderTargetTexture=!0,this.textures[d].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:Vn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let a=0,l=this.textures.length;a<l;a++)this.textures[a].image.width=e,this.textures[a].image.height=t,this.textures[a].image.depth=i,this.textures[a].isData3DTexture!==!0&&(this.textures[a].isArrayTexture=this.textures[a].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const a=Object.assign({},e.textures[t].image);this.textures[t].source=new Yf(a)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class $i extends RM{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Z_ extends Kn{constructor(e=null,t=1,i=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:a},this.magFilter=Ln,this.minFilter=Ln,this.wrapR=Nr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class PM extends Kn{constructor(e=null,t=1,i=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:a},this.magFilter=Ln,this.minFilter=Ln,this.wrapR=Nr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}const fu=class fu{constructor(e,t,i,a,l,c,d,h,f,_,m,g,y,M,T,S){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,a,l,c,d,h,f,_,m,g,y,M,T,S)}set(e,t,i,a,l,c,d,h,f,_,m,g,y,M,T,S){const x=this.elements;return x[0]=e,x[4]=t,x[8]=i,x[12]=a,x[1]=l,x[5]=c,x[9]=d,x[13]=h,x[2]=f,x[6]=_,x[10]=m,x[14]=g,x[3]=y,x[7]=M,x[11]=T,x[15]=S,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new fu().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,i=e.elements,a=1/wa.setFromMatrixColumn(e,0).length(),l=1/wa.setFromMatrixColumn(e,1).length(),c=1/wa.setFromMatrixColumn(e,2).length();return t[0]=i[0]*a,t[1]=i[1]*a,t[2]=i[2]*a,t[3]=0,t[4]=i[4]*l,t[5]=i[5]*l,t[6]=i[6]*l,t[7]=0,t[8]=i[8]*c,t[9]=i[9]*c,t[10]=i[10]*c,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,a=e.y,l=e.z,c=Math.cos(i),d=Math.sin(i),h=Math.cos(a),f=Math.sin(a),_=Math.cos(l),m=Math.sin(l);if(e.order==="XYZ"){const g=c*_,y=c*m,M=d*_,T=d*m;t[0]=h*_,t[4]=-h*m,t[8]=f,t[1]=y+M*f,t[5]=g-T*f,t[9]=-d*h,t[2]=T-g*f,t[6]=M+y*f,t[10]=c*h}else if(e.order==="YXZ"){const g=h*_,y=h*m,M=f*_,T=f*m;t[0]=g+T*d,t[4]=M*d-y,t[8]=c*f,t[1]=c*m,t[5]=c*_,t[9]=-d,t[2]=y*d-M,t[6]=T+g*d,t[10]=c*h}else if(e.order==="ZXY"){const g=h*_,y=h*m,M=f*_,T=f*m;t[0]=g-T*d,t[4]=-c*m,t[8]=M+y*d,t[1]=y+M*d,t[5]=c*_,t[9]=T-g*d,t[2]=-c*f,t[6]=d,t[10]=c*h}else if(e.order==="ZYX"){const g=c*_,y=c*m,M=d*_,T=d*m;t[0]=h*_,t[4]=M*f-y,t[8]=g*f+T,t[1]=h*m,t[5]=T*f+g,t[9]=y*f-M,t[2]=-f,t[6]=d*h,t[10]=c*h}else if(e.order==="YZX"){const g=c*h,y=c*f,M=d*h,T=d*f;t[0]=h*_,t[4]=T-g*m,t[8]=M*m+y,t[1]=m,t[5]=c*_,t[9]=-d*_,t[2]=-f*_,t[6]=y*m+M,t[10]=g-T*m}else if(e.order==="XZY"){const g=c*h,y=c*f,M=d*h,T=d*f;t[0]=h*_,t[4]=-m,t[8]=f*_,t[1]=g*m+T,t[5]=c*_,t[9]=y*m-M,t[2]=M*m-y,t[6]=d*_,t[10]=T*m+g}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(NM,e,LM)}lookAt(e,t,i){const a=this.elements;return di.subVectors(e,t),di.lengthSq()===0&&(di.z=1),di.normalize(),es.crossVectors(i,di),es.lengthSq()===0&&(Math.abs(i.z)===1?di.x+=1e-4:di.z+=1e-4,di.normalize(),es.crossVectors(i,di)),es.normalize(),Sc.crossVectors(di,es),a[0]=es.x,a[4]=Sc.x,a[8]=di.x,a[1]=es.y,a[5]=Sc.y,a[9]=di.y,a[2]=es.z,a[6]=Sc.z,a[10]=di.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,a=t.elements,l=this.elements,c=i[0],d=i[4],h=i[8],f=i[12],_=i[1],m=i[5],g=i[9],y=i[13],M=i[2],T=i[6],S=i[10],x=i[14],C=i[3],I=i[7],w=i[11],R=i[15],P=a[0],U=a[4],A=a[8],D=a[12],k=a[1],z=a[5],G=a[9],$=a[13],H=a[2],Q=a[6],he=a[10],ne=a[14],ee=a[3],K=a[7],Z=a[11],O=a[15];return l[0]=c*P+d*k+h*H+f*ee,l[4]=c*U+d*z+h*Q+f*K,l[8]=c*A+d*G+h*he+f*Z,l[12]=c*D+d*$+h*ne+f*O,l[1]=_*P+m*k+g*H+y*ee,l[5]=_*U+m*z+g*Q+y*K,l[9]=_*A+m*G+g*he+y*Z,l[13]=_*D+m*$+g*ne+y*O,l[2]=M*P+T*k+S*H+x*ee,l[6]=M*U+T*z+S*Q+x*K,l[10]=M*A+T*G+S*he+x*Z,l[14]=M*D+T*$+S*ne+x*O,l[3]=C*P+I*k+w*H+R*ee,l[7]=C*U+I*z+w*Q+R*K,l[11]=C*A+I*G+w*he+R*Z,l[15]=C*D+I*$+w*ne+R*O,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],a=e[8],l=e[12],c=e[1],d=e[5],h=e[9],f=e[13],_=e[2],m=e[6],g=e[10],y=e[14],M=e[3],T=e[7],S=e[11],x=e[15],C=h*y-f*g,I=d*y-f*m,w=d*g-h*m,R=c*y-f*_,P=c*g-h*_,U=c*m-d*_;return t*(T*C-S*I+x*w)-i*(M*C-S*R+x*P)+a*(M*I-T*R+x*U)-l*(M*w-T*P+S*U)}determinantAffine(){const e=this.elements,t=e[0],i=e[4],a=e[8],l=e[1],c=e[5],d=e[9],h=e[2],f=e[6],_=e[10];return t*(c*_-d*f)-i*(l*_-d*h)+a*(l*f-c*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const a=this.elements;return e.isVector3?(a[12]=e.x,a[13]=e.y,a[14]=e.z):(a[12]=e,a[13]=t,a[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],a=e[2],l=e[3],c=e[4],d=e[5],h=e[6],f=e[7],_=e[8],m=e[9],g=e[10],y=e[11],M=e[12],T=e[13],S=e[14],x=e[15],C=t*d-i*c,I=t*h-a*c,w=t*f-l*c,R=i*h-a*d,P=i*f-l*d,U=a*f-l*h,A=_*T-m*M,D=_*S-g*M,k=_*x-y*M,z=m*S-g*T,G=m*x-y*T,$=g*x-y*S,H=C*$-I*G+w*z+R*k-P*D+U*A;if(H===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const Q=1/H;return e[0]=(d*$-h*G+f*z)*Q,e[1]=(a*G-i*$-l*z)*Q,e[2]=(T*U-S*P+x*R)*Q,e[3]=(g*P-m*U-y*R)*Q,e[4]=(h*k-c*$-f*D)*Q,e[5]=(t*$-a*k+l*D)*Q,e[6]=(S*w-M*U-x*I)*Q,e[7]=(_*U-g*w+y*I)*Q,e[8]=(c*G-d*k+f*A)*Q,e[9]=(i*k-t*G-l*A)*Q,e[10]=(M*P-T*w+x*C)*Q,e[11]=(m*w-_*P-y*C)*Q,e[12]=(d*D-c*z-h*A)*Q,e[13]=(t*z-i*D+a*A)*Q,e[14]=(T*I-M*R-S*C)*Q,e[15]=(_*R-m*I+g*C)*Q,this}scale(e){const t=this.elements,i=e.x,a=e.y,l=e.z;return t[0]*=i,t[4]*=a,t[8]*=l,t[1]*=i,t[5]*=a,t[9]*=l,t[2]*=i,t[6]*=a,t[10]*=l,t[3]*=i,t[7]*=a,t[11]*=l,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],a=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,a))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),a=Math.sin(t),l=1-i,c=e.x,d=e.y,h=e.z,f=l*c,_=l*d;return this.set(f*c+i,f*d-a*h,f*h+a*d,0,f*d+a*h,_*d+i,_*h-a*c,0,f*h-a*d,_*h+a*c,l*h*h+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,a,l,c){return this.set(1,i,l,0,e,1,c,0,t,a,1,0,0,0,0,1),this}compose(e,t,i){const a=this.elements,l=t._x,c=t._y,d=t._z,h=t._w,f=l+l,_=c+c,m=d+d,g=l*f,y=l*_,M=l*m,T=c*_,S=c*m,x=d*m,C=h*f,I=h*_,w=h*m,R=i.x,P=i.y,U=i.z;return a[0]=(1-(T+x))*R,a[1]=(y+w)*R,a[2]=(M-I)*R,a[3]=0,a[4]=(y-w)*P,a[5]=(1-(g+x))*P,a[6]=(S+C)*P,a[7]=0,a[8]=(M+I)*U,a[9]=(S-C)*U,a[10]=(1-(g+T))*U,a[11]=0,a[12]=e.x,a[13]=e.y,a[14]=e.z,a[15]=1,this}decompose(e,t,i){const a=this.elements;e.x=a[12],e.y=a[13],e.z=a[14];const l=this.determinantAffine();if(l===0)return i.set(1,1,1),t.identity(),this;let c=wa.set(a[0],a[1],a[2]).length();const d=wa.set(a[4],a[5],a[6]).length(),h=wa.set(a[8],a[9],a[10]).length();l<0&&(c=-c),ki.copy(this);const f=1/c,_=1/d,m=1/h;return ki.elements[0]*=f,ki.elements[1]*=f,ki.elements[2]*=f,ki.elements[4]*=_,ki.elements[5]*=_,ki.elements[6]*=_,ki.elements[8]*=m,ki.elements[9]*=m,ki.elements[10]*=m,t.setFromRotationMatrix(ki),i.x=c,i.y=d,i.z=h,this}makePerspective(e,t,i,a,l,c,d=ar,h=!1){const f=this.elements,_=2*l/(t-e),m=2*l/(i-a),g=(t+e)/(t-e),y=(i+a)/(i-a);let M,T;if(h)M=l/(c-l),T=c*l/(c-l);else if(d===ar)M=-(c+l)/(c-l),T=-2*c*l/(c-l);else if(d===ol)M=-c/(c-l),T=-c*l/(c-l);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+d);return f[0]=_,f[4]=0,f[8]=g,f[12]=0,f[1]=0,f[5]=m,f[9]=y,f[13]=0,f[2]=0,f[6]=0,f[10]=M,f[14]=T,f[3]=0,f[7]=0,f[11]=-1,f[15]=0,this}makeOrthographic(e,t,i,a,l,c,d=ar,h=!1){const f=this.elements,_=2/(t-e),m=2/(i-a),g=-(t+e)/(t-e),y=-(i+a)/(i-a);let M,T;if(h)M=1/(c-l),T=c/(c-l);else if(d===ar)M=-2/(c-l),T=-(c+l)/(c-l);else if(d===ol)M=-1/(c-l),T=-l/(c-l);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+d);return f[0]=_,f[4]=0,f[8]=0,f[12]=g,f[1]=0,f[5]=m,f[9]=0,f[13]=y,f[2]=0,f[6]=0,f[10]=M,f[14]=T,f[3]=0,f[7]=0,f[11]=0,f[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let a=0;a<16;a++)if(t[a]!==i[a])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};fu.prototype.isMatrix4=!0;let Vt=fu;const wa=new X,ki=new Vt,NM=new X(0,0,0),LM=new X(1,1,1),es=new X,Sc=new X,di=new X,sg=new Vt,ag=new ps;class Ur{constructor(e=0,t=0,i=0,a=Ur.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=a}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,a=this._order){return this._x=e,this._y=t,this._z=i,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const a=e.elements,l=a[0],c=a[4],d=a[8],h=a[1],f=a[5],_=a[9],m=a[2],g=a[6],y=a[10];switch(t){case"XYZ":this._y=Math.asin(Et(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(-_,y),this._z=Math.atan2(-c,l)):(this._x=Math.atan2(g,f),this._z=0);break;case"YXZ":this._x=Math.asin(-Et(_,-1,1)),Math.abs(_)<.9999999?(this._y=Math.atan2(d,y),this._z=Math.atan2(h,f)):(this._y=Math.atan2(-m,l),this._z=0);break;case"ZXY":this._x=Math.asin(Et(g,-1,1)),Math.abs(g)<.9999999?(this._y=Math.atan2(-m,y),this._z=Math.atan2(-c,f)):(this._y=0,this._z=Math.atan2(h,l));break;case"ZYX":this._y=Math.asin(-Et(m,-1,1)),Math.abs(m)<.9999999?(this._x=Math.atan2(g,y),this._z=Math.atan2(h,l)):(this._x=0,this._z=Math.atan2(-c,f));break;case"YZX":this._z=Math.asin(Et(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(-_,f),this._y=Math.atan2(-m,l)):(this._x=0,this._y=Math.atan2(d,y));break;case"XZY":this._z=Math.asin(-Et(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(g,f),this._y=Math.atan2(d,l)):(this._x=Math.atan2(-_,y),this._y=0);break;default:ot("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return sg.makeRotationFromQuaternion(e),this.setFromRotationMatrix(sg,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ag.setFromEuler(this),this.setFromQuaternion(ag,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ur.DEFAULT_ORDER="XYZ";class Q_{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let DM=0;const og=new X,ba=new ps,Mr=new Vt,Mc=new X,Vo=new X,IM=new X,UM=new ps,lg=new X(1,0,0),cg=new X(0,1,0),ug=new X(0,0,1),dg={type:"added"},OM={type:"removed"},Ta={type:"childadded",child:null},ph={type:"childremoved",child:null};class Kt extends ms{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:DM++}),this.uuid=fl(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Kt.DEFAULT_UP.clone();const e=new X,t=new Ur,i=new ps,a=new X(1,1,1);function l(){i.setFromEuler(t,!1)}function c(){t.setFromQuaternion(i,void 0,!1)}t._onChange(l),i._onChange(c),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new Vt},normalMatrix:{value:new mt}}),this.matrix=new Vt,this.matrixWorld=new Vt,this.matrixAutoUpdate=Kt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Kt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Q_,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ba.setFromAxisAngle(e,t),this.quaternion.multiply(ba),this}rotateOnWorldAxis(e,t){return ba.setFromAxisAngle(e,t),this.quaternion.premultiply(ba),this}rotateX(e){return this.rotateOnAxis(lg,e)}rotateY(e){return this.rotateOnAxis(cg,e)}rotateZ(e){return this.rotateOnAxis(ug,e)}translateOnAxis(e,t){return og.copy(e).applyQuaternion(this.quaternion),this.position.add(og.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(lg,e)}translateY(e){return this.translateOnAxis(cg,e)}translateZ(e){return this.translateOnAxis(ug,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Mr.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Mc.copy(e):Mc.set(e,t,i);const a=this.parent;this.updateWorldMatrix(!0,!1),Vo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Mr.lookAt(Vo,Mc,this.up):Mr.lookAt(Mc,Vo,this.up),this.quaternion.setFromRotationMatrix(Mr),a&&(Mr.extractRotation(a.matrixWorld),ba.setFromRotationMatrix(Mr),this.quaternion.premultiply(ba.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ut("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(dg),Ta.child=e,this.dispatchEvent(Ta),Ta.child=null):Ut("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(OM),ph.child=e,this.dispatchEvent(ph),ph.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Mr.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Mr.multiply(e.parent.matrixWorld)),e.applyMatrix4(Mr),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(dg),Ta.child=e,this.dispatchEvent(Ta),Ta.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,a=this.children.length;i<a;i++){const c=this.children[i].getObjectByProperty(e,t);if(c!==void 0)return c}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const a=this.children;for(let l=0,c=a.length;l<c;l++)a[l].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Vo,e,IM),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Vo,UM,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);const t=this.children;for(let i=0,a=t.length;i<a;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,a=t.length;i<a;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,a=e.z,l=this.matrix.elements;l[12]+=t-l[0]*t-l[4]*i-l[8]*a,l[13]+=i-l[1]*t-l[5]*i-l[9]*a,l[14]+=a-l[2]*t-l[6]*i-l[10]*a}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,a=t.length;i<a;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t,i=!1){const a=this.parent;if(e===!0&&a!==null&&a.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),t===!0){const l=this.children;for(let c=0,d=l.length;c<d;c++)l[c].updateWorldMatrix(!1,!0,i)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,a.name=this.name,a.castShadow=this.castShadow,a.receiveShadow=this.receiveShadow,a.visible=this.visible,a.frustumCulled=this.frustumCulled,a.renderOrder=this.renderOrder,a.static=this.static,a.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.pivot!==null&&(a.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(a.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(a.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.geometryInfo=this._geometryInfo.map(d=>({...d,boundingBox:d.boundingBox?d.boundingBox.toJSON():void 0,boundingSphere:d.boundingSphere?d.boundingSphere.toJSON():void 0})),a.instanceInfo=this._instanceInfo.map(d=>({...d})),a.availableInstanceIds=this._availableInstanceIds.slice(),a.availableGeometryIds=this._availableGeometryIds.slice(),a.nextIndexStart=this._nextIndexStart,a.nextVertexStart=this._nextVertexStart,a.geometryCount=this._geometryCount,a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.matricesTexture=this._matricesTexture.toJSON(e),a.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(a.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(a.boundingBox=this.boundingBox.toJSON()));function l(d,h){return d[h.uuid]===void 0&&(d[h.uuid]=h.toJSON(e)),h.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=l(e.geometries,this.geometry);const d=this.geometry.parameters;if(d!==void 0&&d.shapes!==void 0){const h=d.shapes;if(Array.isArray(h))for(let f=0,_=h.length;f<_;f++){const m=h[f];l(e.shapes,m)}else l(e.shapes,h)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(l(e.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const d=[];for(let h=0,f=this.material.length;h<f;h++)d.push(l(e.materials,this.material[h]));a.material=d}else a.material=l(e.materials,this.material);if(this.children.length>0){a.children=[];for(let d=0;d<this.children.length;d++)a.children.push(this.children[d].toJSON(e).object)}if(this.animations.length>0){a.animations=[];for(let d=0;d<this.animations.length;d++){const h=this.animations[d];a.animations.push(l(e.animations,h))}}if(t){const d=c(e.geometries),h=c(e.materials),f=c(e.textures),_=c(e.images),m=c(e.shapes),g=c(e.skeletons),y=c(e.animations),M=c(e.nodes);d.length>0&&(i.geometries=d),h.length>0&&(i.materials=h),f.length>0&&(i.textures=f),_.length>0&&(i.images=_),m.length>0&&(i.shapes=m),g.length>0&&(i.skeletons=g),y.length>0&&(i.animations=y),M.length>0&&(i.nodes=M)}return i.object=a,i;function c(d){const h=[];for(const f in d){const _=d[f];delete _.metadata,h.push(_)}return h}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const a=e.children[i];this.add(a.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}Kt.DEFAULT_UP=new X(0,1,0);Kt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Kt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class $n extends Kt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const FM={type:"move"};class mh{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new $n,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new $n,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new X,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new X),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new $n,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new X,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new X,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let a=null,l=null,c=null;const d=this._targetRay,h=this._grip,f=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(f&&e.hand){c=!0;for(const T of e.hand.values()){const S=t.getJointPose(T,i),x=this._getHandJoint(f,T);S!==null&&(x.matrix.fromArray(S.transform.matrix),x.matrix.decompose(x.position,x.rotation,x.scale),x.matrixWorldNeedsUpdate=!0,x.jointRadius=S.radius),x.visible=S!==null}const _=f.joints["index-finger-tip"],m=f.joints["thumb-tip"],g=_.position.distanceTo(m.position),y=.02,M=.005;f.inputState.pinching&&g>y+M?(f.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!f.inputState.pinching&&g<=y-M&&(f.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else h!==null&&e.gripSpace&&(l=t.getPose(e.gripSpace,i),l!==null&&(h.matrix.fromArray(l.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,l.linearVelocity?(h.hasLinearVelocity=!0,h.linearVelocity.copy(l.linearVelocity)):h.hasLinearVelocity=!1,l.angularVelocity?(h.hasAngularVelocity=!0,h.angularVelocity.copy(l.angularVelocity)):h.hasAngularVelocity=!1,h.eventsEnabled&&h.dispatchEvent({type:"gripUpdated",data:e,target:this})));d!==null&&(a=t.getPose(e.targetRaySpace,i),a===null&&l!==null&&(a=l),a!==null&&(d.matrix.fromArray(a.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,a.linearVelocity?(d.hasLinearVelocity=!0,d.linearVelocity.copy(a.linearVelocity)):d.hasLinearVelocity=!1,a.angularVelocity?(d.hasAngularVelocity=!0,d.angularVelocity.copy(a.angularVelocity)):d.hasAngularVelocity=!1,this.dispatchEvent(FM)))}return d!==null&&(d.visible=a!==null),h!==null&&(h.visible=l!==null),f!==null&&(f.visible=c!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new $n;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const J_={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ts={h:0,s:0,l:0},Ec={h:0,s:0,l:0};function gh(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class ht{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const a=e;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=fi){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,At.colorSpaceToWorking(this,t),this}setRGB(e,t,i,a=At.workingColorSpace){return this.r=e,this.g=t,this.b=i,At.colorSpaceToWorking(this,a),this}setHSL(e,t,i,a=At.workingColorSpace){if(e=EM(e,1),t=Et(t,0,1),i=Et(i,0,1),t===0)this.r=this.g=this.b=i;else{const l=i<=.5?i*(1+t):i+t-i*t,c=2*i-l;this.r=gh(c,l,e+1/3),this.g=gh(c,l,e),this.b=gh(c,l,e-1/3)}return At.colorSpaceToWorking(this,a),this}setStyle(e,t=fi){function i(l){l!==void 0&&parseFloat(l)<1&&ot("Color: Alpha component of "+e+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(e)){let l;const c=a[1],d=a[2];switch(c){case"rgb":case"rgba":if(l=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return i(l[4]),this.setRGB(Math.min(255,parseInt(l[1],10))/255,Math.min(255,parseInt(l[2],10))/255,Math.min(255,parseInt(l[3],10))/255,t);if(l=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return i(l[4]),this.setRGB(Math.min(100,parseInt(l[1],10))/100,Math.min(100,parseInt(l[2],10))/100,Math.min(100,parseInt(l[3],10))/100,t);break;case"hsl":case"hsla":if(l=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return i(l[4]),this.setHSL(parseFloat(l[1])/360,parseFloat(l[2])/100,parseFloat(l[3])/100,t);break;default:ot("Color: Unknown color model "+e)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(e)){const l=a[1],c=l.length;if(c===3)return this.setRGB(parseInt(l.charAt(0),16)/15,parseInt(l.charAt(1),16)/15,parseInt(l.charAt(2),16)/15,t);if(c===6)return this.setHex(parseInt(l,16),t);ot("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=fi){const i=J_[e.toLowerCase()];return i!==void 0?this.setHex(i,t):ot("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Dr(e.r),this.g=Dr(e.g),this.b=Dr(e.b),this}copyLinearToSRGB(e){return this.r=Va(e.r),this.g=Va(e.g),this.b=Va(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=fi){return At.workingToColorSpace(zn.copy(this),e),Math.round(Et(zn.r*255,0,255))*65536+Math.round(Et(zn.g*255,0,255))*256+Math.round(Et(zn.b*255,0,255))}getHexString(e=fi){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=At.workingColorSpace){At.workingToColorSpace(zn.copy(this),t);const i=zn.r,a=zn.g,l=zn.b,c=Math.max(i,a,l),d=Math.min(i,a,l);let h,f;const _=(d+c)/2;if(d===c)h=0,f=0;else{const m=c-d;switch(f=_<=.5?m/(c+d):m/(2-c-d),c){case i:h=(a-l)/m+(a<l?6:0);break;case a:h=(l-i)/m+2;break;case l:h=(i-a)/m+4;break}h/=6}return e.h=h,e.s=f,e.l=_,e}getRGB(e,t=At.workingColorSpace){return At.workingToColorSpace(zn.copy(this),t),e.r=zn.r,e.g=zn.g,e.b=zn.b,e}getStyle(e=fi){At.workingToColorSpace(zn.copy(this),e);const t=zn.r,i=zn.g,a=zn.b;return e!==fi?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(a*255)})`}offsetHSL(e,t,i){return this.getHSL(ts),this.setHSL(ts.h+e,ts.s+t,ts.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(ts),e.getHSL(Ec);const i=ch(ts.h,Ec.h,t),a=ch(ts.s,Ec.s,t),l=ch(ts.l,Ec.l,t);return this.setHSL(i,a,l),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,a=this.b,l=e.elements;return this.r=l[0]*t+l[3]*i+l[6]*a,this.g=l[1]*t+l[4]*i+l[7]*a,this.b=l[2]*t+l[5]*i+l[8]*a,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const zn=new ht;ht.NAMES=J_;class $f{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new ht(e),this.density=t}clone(){return new $f(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class kM extends Kt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ur,this.environmentIntensity=1,this.environmentRotation=new Ur,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Bi=new X,Er=new X,_h=new X,wr=new X,Aa=new X,Ca=new X,hg=new X,xh=new X,vh=new X,yh=new X,Sh=new sn,Mh=new sn,Eh=new sn;class Wi{constructor(e=new X,t=new X,i=new X){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,a){a.subVectors(i,t),Bi.subVectors(e,t),a.cross(Bi);const l=a.lengthSq();return l>0?a.multiplyScalar(1/Math.sqrt(l)):a.set(0,0,0)}static getBarycoord(e,t,i,a,l){Bi.subVectors(a,t),Er.subVectors(i,t),_h.subVectors(e,t);const c=Bi.dot(Bi),d=Bi.dot(Er),h=Bi.dot(_h),f=Er.dot(Er),_=Er.dot(_h),m=c*f-d*d;if(m===0)return l.set(0,0,0),null;const g=1/m,y=(f*h-d*_)*g,M=(c*_-d*h)*g;return l.set(1-y-M,M,y)}static containsPoint(e,t,i,a){return this.getBarycoord(e,t,i,a,wr)===null?!1:wr.x>=0&&wr.y>=0&&wr.x+wr.y<=1}static getInterpolation(e,t,i,a,l,c,d,h){return this.getBarycoord(e,t,i,a,wr)===null?(h.x=0,h.y=0,"z"in h&&(h.z=0),"w"in h&&(h.w=0),null):(h.setScalar(0),h.addScaledVector(l,wr.x),h.addScaledVector(c,wr.y),h.addScaledVector(d,wr.z),h)}static getInterpolatedAttribute(e,t,i,a,l,c){return Sh.setScalar(0),Mh.setScalar(0),Eh.setScalar(0),Sh.fromBufferAttribute(e,t),Mh.fromBufferAttribute(e,i),Eh.fromBufferAttribute(e,a),c.setScalar(0),c.addScaledVector(Sh,l.x),c.addScaledVector(Mh,l.y),c.addScaledVector(Eh,l.z),c}static isFrontFacing(e,t,i,a){return Bi.subVectors(i,t),Er.subVectors(e,t),Bi.cross(Er).dot(a)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,a){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[a]),this}setFromAttributeAndIndices(e,t,i,a){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,a),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Bi.subVectors(this.c,this.b),Er.subVectors(this.a,this.b),Bi.cross(Er).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Wi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Wi.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,a,l){return Wi.getInterpolation(e,this.a,this.b,this.c,t,i,a,l)}containsPoint(e){return Wi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Wi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,a=this.b,l=this.c;let c,d;Aa.subVectors(a,i),Ca.subVectors(l,i),xh.subVectors(e,i);const h=Aa.dot(xh),f=Ca.dot(xh);if(h<=0&&f<=0)return t.copy(i);vh.subVectors(e,a);const _=Aa.dot(vh),m=Ca.dot(vh);if(_>=0&&m<=_)return t.copy(a);const g=h*m-_*f;if(g<=0&&h>=0&&_<=0)return c=h/(h-_),t.copy(i).addScaledVector(Aa,c);yh.subVectors(e,l);const y=Aa.dot(yh),M=Ca.dot(yh);if(M>=0&&y<=M)return t.copy(l);const T=y*f-h*M;if(T<=0&&f>=0&&M<=0)return d=f/(f-M),t.copy(i).addScaledVector(Ca,d);const S=_*M-y*m;if(S<=0&&m-_>=0&&y-M>=0)return hg.subVectors(l,a),d=(m-_)/(m-_+(y-M)),t.copy(a).addScaledVector(hg,d);const x=1/(S+T+g);return c=T*x,d=g*x,t.copy(i).addScaledVector(Aa,c).addScaledVector(Ca,d)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Ks{constructor(e=new X(1/0,1/0,1/0),t=new X(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(zi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(zi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=zi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const l=i.getAttribute("position");if(t===!0&&l!==void 0&&e.isInstancedMesh!==!0)for(let c=0,d=l.count;c<d;c++)e.isMesh===!0?e.getVertexPosition(c,zi):zi.fromBufferAttribute(l,c),zi.applyMatrix4(e.matrixWorld),this.expandByPoint(zi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),wc.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),wc.copy(i.boundingBox)),wc.applyMatrix4(e.matrixWorld),this.union(wc)}const a=e.children;for(let l=0,c=a.length;l<c;l++)this.expandByObject(a[l],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,zi),zi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Go),bc.subVectors(this.max,Go),Ra.subVectors(e.a,Go),Pa.subVectors(e.b,Go),Na.subVectors(e.c,Go),ns.subVectors(Pa,Ra),is.subVectors(Na,Pa),Ds.subVectors(Ra,Na);let t=[0,-ns.z,ns.y,0,-is.z,is.y,0,-Ds.z,Ds.y,ns.z,0,-ns.x,is.z,0,-is.x,Ds.z,0,-Ds.x,-ns.y,ns.x,0,-is.y,is.x,0,-Ds.y,Ds.x,0];return!wh(t,Ra,Pa,Na,bc)||(t=[1,0,0,0,1,0,0,0,1],!wh(t,Ra,Pa,Na,bc))?!1:(Tc.crossVectors(ns,is),t=[Tc.x,Tc.y,Tc.z],wh(t,Ra,Pa,Na,bc))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,zi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(zi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(br[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),br[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),br[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),br[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),br[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),br[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),br[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),br[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(br),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const br=[new X,new X,new X,new X,new X,new X,new X,new X],zi=new X,wc=new Ks,Ra=new X,Pa=new X,Na=new X,ns=new X,is=new X,Ds=new X,Go=new X,bc=new X,Tc=new X,Is=new X;function wh(s,e,t,i,a){for(let l=0,c=s.length-3;l<=c;l+=3){Is.fromArray(s,l);const d=a.x*Math.abs(Is.x)+a.y*Math.abs(Is.y)+a.z*Math.abs(Is.z),h=e.dot(Is),f=t.dot(Is),_=i.dot(Is);if(Math.max(-Math.max(h,f,_),Math.min(h,f,_))>d)return!1}return!0}const fn=new X,Ac=new lt;let BM=0;class lr extends ms{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:BM++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=xM,this.updateRanges=[],this.gpuType=Xi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let a=0,l=this.itemSize;a<l;a++)this.array[e+a]=t.array[i+a];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Ac.fromBufferAttribute(this,t),Ac.applyMatrix3(e),this.setXY(t,Ac.x,Ac.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)fn.fromBufferAttribute(this,t),fn.applyMatrix3(e),this.setXYZ(t,fn.x,fn.y,fn.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)fn.fromBufferAttribute(this,t),fn.applyMatrix4(e),this.setXYZ(t,fn.x,fn.y,fn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)fn.fromBufferAttribute(this,t),fn.applyNormalMatrix(e),this.setXYZ(t,fn.x,fn.y,fn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)fn.fromBufferAttribute(this,t),fn.transformDirection(e),this.setXYZ(t,fn.x,fn.y,fn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Ho(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=ii(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ho(t,this.array)),t}setX(e,t){return this.normalized&&(t=ii(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ho(t,this.array)),t}setY(e,t){return this.normalized&&(t=ii(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ho(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ii(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ho(t,this.array)),t}setW(e,t){return this.normalized&&(t=ii(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=ii(t,this.array),i=ii(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,a){return e*=this.itemSize,this.normalized&&(t=ii(t,this.array),i=ii(i,this.array),a=ii(a,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=a,this}setXYZW(e,t,i,a,l){return e*=this.itemSize,this.normalized&&(t=ii(t,this.array),i=ii(i,this.array),a=ii(a,this.array),l=ii(l,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=a,this.array[e+3]=l,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}}class ex extends lr{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class tx extends lr{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class kt extends lr{constructor(e,t,i){super(new Float32Array(e),t,i)}}const zM=new Ks,Wo=new X,bh=new X;class Zs{constructor(e=new X,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):zM.setFromPoints(e).getCenter(i);let a=0;for(let l=0,c=e.length;l<c;l++)a=Math.max(a,i.distanceToSquared(e[l]));return this.radius=Math.sqrt(a),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Wo.subVectors(e,this.center);const t=Wo.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),a=(i-this.radius)*.5;this.center.addScaledVector(Wo,a/i),this.radius+=a}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(bh.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Wo.copy(e.center).add(bh)),this.expandByPoint(Wo.copy(e.center).sub(bh))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let HM=0;const wi=new Vt,Th=new Kt,La=new X,hi=new Ks,jo=new Ks,An=new X;class Sn extends ms{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:HM++}),this.uuid=fl(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(vM(e)?tx:ex)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const l=new mt().getNormalMatrix(e);i.applyNormalMatrix(l),i.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(e),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return wi.makeRotationFromQuaternion(e),this.applyMatrix4(wi),this}rotateX(e){return wi.makeRotationX(e),this.applyMatrix4(wi),this}rotateY(e){return wi.makeRotationY(e),this.applyMatrix4(wi),this}rotateZ(e){return wi.makeRotationZ(e),this.applyMatrix4(wi),this}translate(e,t,i){return wi.makeTranslation(e,t,i),this.applyMatrix4(wi),this}scale(e,t,i){return wi.makeScale(e,t,i),this.applyMatrix4(wi),this}lookAt(e){return Th.lookAt(e),Th.updateMatrix(),this.applyMatrix4(Th.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(La).negate(),this.translate(La.x,La.y,La.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let a=0,l=e.length;a<l;a++){const c=e[a];i.push(c.x,c.y,c.z||0)}this.setAttribute("position",new kt(i,3))}else{const i=Math.min(e.length,t.count);for(let a=0;a<i;a++){const l=e[a];t.setXYZ(a,l.x,l.y,l.z||0)}e.length>t.count&&ot("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ks);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ut("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new X(-1/0,-1/0,-1/0),new X(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,a=t.length;i<a;i++){const l=t[i];hi.setFromBufferAttribute(l),this.morphTargetsRelative?(An.addVectors(this.boundingBox.min,hi.min),this.boundingBox.expandByPoint(An),An.addVectors(this.boundingBox.max,hi.max),this.boundingBox.expandByPoint(An)):(this.boundingBox.expandByPoint(hi.min),this.boundingBox.expandByPoint(hi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ut('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Zs);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ut("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new X,1/0);return}if(e){const i=this.boundingSphere.center;if(hi.setFromBufferAttribute(e),t)for(let l=0,c=t.length;l<c;l++){const d=t[l];jo.setFromBufferAttribute(d),this.morphTargetsRelative?(An.addVectors(hi.min,jo.min),hi.expandByPoint(An),An.addVectors(hi.max,jo.max),hi.expandByPoint(An)):(hi.expandByPoint(jo.min),hi.expandByPoint(jo.max))}hi.getCenter(i);let a=0;for(let l=0,c=e.count;l<c;l++)An.fromBufferAttribute(e,l),a=Math.max(a,i.distanceToSquared(An));if(t)for(let l=0,c=t.length;l<c;l++){const d=t[l],h=this.morphTargetsRelative;for(let f=0,_=d.count;f<_;f++)An.fromBufferAttribute(d,f),h&&(La.fromBufferAttribute(e,f),An.add(La)),a=Math.max(a,i.distanceToSquared(An))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&Ut('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ut("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,a=t.normal,l=t.uv;let c=this.getAttribute("tangent");(c===void 0||c.count!==i.count)&&(c=new lr(new Float32Array(4*i.count),4),this.setAttribute("tangent",c));const d=[],h=[];for(let A=0;A<i.count;A++)d[A]=new X,h[A]=new X;const f=new X,_=new X,m=new X,g=new lt,y=new lt,M=new lt,T=new X,S=new X;function x(A,D,k){f.fromBufferAttribute(i,A),_.fromBufferAttribute(i,D),m.fromBufferAttribute(i,k),g.fromBufferAttribute(l,A),y.fromBufferAttribute(l,D),M.fromBufferAttribute(l,k),_.sub(f),m.sub(f),y.sub(g),M.sub(g);const z=1/(y.x*M.y-M.x*y.y);isFinite(z)&&(T.copy(_).multiplyScalar(M.y).addScaledVector(m,-y.y).multiplyScalar(z),S.copy(m).multiplyScalar(y.x).addScaledVector(_,-M.x).multiplyScalar(z),d[A].add(T),d[D].add(T),d[k].add(T),h[A].add(S),h[D].add(S),h[k].add(S))}let C=this.groups;C.length===0&&(C=[{start:0,count:e.count}]);for(let A=0,D=C.length;A<D;++A){const k=C[A],z=k.start,G=k.count;for(let $=z,H=z+G;$<H;$+=3)x(e.getX($+0),e.getX($+1),e.getX($+2))}const I=new X,w=new X,R=new X,P=new X;function U(A){R.fromBufferAttribute(a,A),P.copy(R);const D=d[A];I.copy(D),I.sub(R.multiplyScalar(R.dot(D))).normalize(),w.crossVectors(P,D);const z=w.dot(h[A])<0?-1:1;c.setXYZW(A,I.x,I.y,I.z,z)}for(let A=0,D=C.length;A<D;++A){const k=C[A],z=k.start,G=k.count;for(let $=z,H=z+G;$<H;$+=3)U(e.getX($+0)),U(e.getX($+1)),U(e.getX($+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==t.count)i=new lr(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let g=0,y=i.count;g<y;g++)i.setXYZ(g,0,0,0);const a=new X,l=new X,c=new X,d=new X,h=new X,f=new X,_=new X,m=new X;if(e)for(let g=0,y=e.count;g<y;g+=3){const M=e.getX(g+0),T=e.getX(g+1),S=e.getX(g+2);a.fromBufferAttribute(t,M),l.fromBufferAttribute(t,T),c.fromBufferAttribute(t,S),_.subVectors(c,l),m.subVectors(a,l),_.cross(m),d.fromBufferAttribute(i,M),h.fromBufferAttribute(i,T),f.fromBufferAttribute(i,S),d.add(_),h.add(_),f.add(_),i.setXYZ(M,d.x,d.y,d.z),i.setXYZ(T,h.x,h.y,h.z),i.setXYZ(S,f.x,f.y,f.z)}else for(let g=0,y=t.count;g<y;g+=3)a.fromBufferAttribute(t,g+0),l.fromBufferAttribute(t,g+1),c.fromBufferAttribute(t,g+2),_.subVectors(c,l),m.subVectors(a,l),_.cross(m),i.setXYZ(g+0,_.x,_.y,_.z),i.setXYZ(g+1,_.x,_.y,_.z),i.setXYZ(g+2,_.x,_.y,_.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)An.fromBufferAttribute(e,t),An.normalize(),e.setXYZ(t,An.x,An.y,An.z)}toNonIndexed(){function e(d,h){const f=d.array,_=d.itemSize,m=d.normalized,g=new f.constructor(h.length*_);let y=0,M=0;for(let T=0,S=h.length;T<S;T++){d.isInterleavedBufferAttribute?y=h[T]*d.data.stride+d.offset:y=h[T]*_;for(let x=0;x<_;x++)g[M++]=f[y++]}return new lr(g,_,m)}if(this.index===null)return ot("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Sn,i=this.index.array,a=this.attributes;for(const d in a){const h=a[d],f=e(h,i);t.setAttribute(d,f)}const l=this.morphAttributes;for(const d in l){const h=[],f=l[d];for(let _=0,m=f.length;_<m;_++){const g=f[_],y=e(g,i);h.push(y)}t.morphAttributes[d]=h}t.morphTargetsRelative=this.morphTargetsRelative;const c=this.groups;for(let d=0,h=c.length;d<h;d++){const f=c[d];t.addGroup(f.start,f.count,f.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const h=this.parameters;for(const f in h)h[f]!==void 0&&(e[f]=h[f]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const h in i){const f=i[h];e.data.attributes[h]=f.toJSON(e.data)}const a={};let l=!1;for(const h in this.morphAttributes){const f=this.morphAttributes[h],_=[];for(let m=0,g=f.length;m<g;m++){const y=f[m];_.push(y.toJSON(e.data))}_.length>0&&(a[h]=_,l=!0)}l&&(e.data.morphAttributes=a,e.data.morphTargetsRelative=this.morphTargetsRelative);const c=this.groups;c.length>0&&(e.data.groups=JSON.parse(JSON.stringify(c)));const d=this.boundingSphere;return d!==null&&(e.data.boundingSphere=d.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const a=e.attributes;for(const f in a){const _=a[f];this.setAttribute(f,_.clone(t))}const l=e.morphAttributes;for(const f in l){const _=[],m=l[f];for(let g=0,y=m.length;g<y;g++)_.push(m[g].clone(t));this.morphAttributes[f]=_}this.morphTargetsRelative=e.morphTargetsRelative;const c=e.groups;for(let f=0,_=c.length;f<_;f++){const m=c[f];this.addGroup(m.start,m.count,m.materialIndex)}const d=e.boundingBox;d!==null&&(this.boundingBox=d.clone());const h=e.boundingSphere;return h!==null&&(this.boundingSphere=h.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ah=new X,VM=new X,GM=new mt;class Rr{constructor(e=new X(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,a){return this.normal.set(e,t,i),this.constant=a,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const a=Ah.subVectors(i,t).cross(VM.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(a,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const a=e.delta(Ah),l=this.normal.dot(a);if(l===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const c=-(e.start.dot(this.normal)+this.constant)/l;return i===!0&&(c<0||c>1)?null:t.copy(e.start).addScaledVector(a,c)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||GM.getNormalMatrix(e),a=this.coplanarPoint(Ah).applyMatrix4(e),l=this.normal.applyMatrix3(i).normalize();return this.constant=-a.dot(l),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let WM=0;class dr extends ms{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:WM++}),this.uuid=fl(),this.name="",this.type="Material",this.blending=nl,this.side=qs,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=I_,this.blendDst=U_,this.blendEquation=Fa,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ht(0,0,0),this.blendAlpha=0,this.depthFunc=rl,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=dM,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=lh,this.stencilZFail=lh,this.stencilZPass=lh,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){ot(`Material: parameter '${t}' has value of undefined.`);continue}const a=this[t];if(a===void 0){ot(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(i):a&&a.isVector2&&i&&i.isVector2||a&&a.isEuler&&i&&i.isEuler||a&&a.isVector3&&i&&i.isVector3?a.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(l=>l.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function a(l){const c=[];for(const d in l){const h=l[d];delete h.metadata,c.push(h)}return c}if(t){const l=a(e.textures),c=a(e.images);l.length>0&&(i.textures=l),c.length>0&&(i.images=c)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new ht().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new Rr().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new lt().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new lt().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const a=t.length;i=new Array(a);for(let l=0;l!==a;++l)i[l]=t[l].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Tr=new X,Ch=new X,Cc=new X,Rc=new X;class gu{constructor(e=new X,t=new X(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Tr)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Tr.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Tr.copy(this.origin).addScaledVector(this.direction,t),Tr.distanceToSquared(e))}distanceSqToSegment(e,t,i,a){Ch.copy(e).add(t).multiplyScalar(.5),Cc.copy(t).sub(e).normalize(),Rc.copy(this.origin).sub(Ch);const l=e.distanceTo(t)*.5,c=-this.direction.dot(Cc),d=Rc.dot(this.direction),h=-Rc.dot(Cc),f=Rc.lengthSq(),_=Math.abs(1-c*c);let m,g,y,M;if(_>0)if(m=c*h-d,g=c*d-h,M=l*_,m>=0)if(g>=-M)if(g<=M){const T=1/_;m*=T,g*=T,y=m*(m+c*g+2*d)+g*(c*m+g+2*h)+f}else g=l,m=Math.max(0,-(c*g+d)),y=-m*m+g*(g+2*h)+f;else g=-l,m=Math.max(0,-(c*g+d)),y=-m*m+g*(g+2*h)+f;else g<=-M?(m=Math.max(0,-(-c*l+d)),g=m>0?-l:Math.min(Math.max(-l,-h),l),y=-m*m+g*(g+2*h)+f):g<=M?(m=0,g=Math.min(Math.max(-l,-h),l),y=g*(g+2*h)+f):(m=Math.max(0,-(c*l+d)),g=m>0?l:Math.min(Math.max(-l,-h),l),y=-m*m+g*(g+2*h)+f);else g=c>0?-l:l,m=Math.max(0,-(c*g+d)),y=-m*m+g*(g+2*h)+f;return i&&i.copy(this.origin).addScaledVector(this.direction,m),a&&a.copy(Ch).addScaledVector(Cc,g),y}intersectSphere(e,t){if(e.radius<0)return null;Tr.subVectors(e.center,this.origin);const i=Tr.dot(this.direction),a=Tr.dot(Tr)-i*i,l=e.radius*e.radius;if(a>l)return null;const c=Math.sqrt(l-a),d=i-c,h=i+c;return h<0?null:d<0?this.at(h,t):this.at(d,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,a,l,c,d,h;const f=1/this.direction.x,_=1/this.direction.y,m=1/this.direction.z,g=this.origin;return f>=0?(i=(e.min.x-g.x)*f,a=(e.max.x-g.x)*f):(i=(e.max.x-g.x)*f,a=(e.min.x-g.x)*f),_>=0?(l=(e.min.y-g.y)*_,c=(e.max.y-g.y)*_):(l=(e.max.y-g.y)*_,c=(e.min.y-g.y)*_),i>c||l>a||((l>i||isNaN(i))&&(i=l),(c<a||isNaN(a))&&(a=c),m>=0?(d=(e.min.z-g.z)*m,h=(e.max.z-g.z)*m):(d=(e.max.z-g.z)*m,h=(e.min.z-g.z)*m),i>h||d>a)||((d>i||i!==i)&&(i=d),(h<a||a!==a)&&(a=h),a<0)?null:this.at(i>=0?i:a,t)}intersectsBox(e){return this.intersectBox(e,Tr)!==null}intersectTriangle(e,t,i,a,l){const c=this.origin,d=this.direction,h=d.x,f=d.y,_=d.z,m=e.x-c.x,g=e.y-c.y,y=e.z-c.z,M=t.x-c.x,T=t.y-c.y,S=t.z-c.z,x=i.x-c.x,C=i.y-c.y,I=i.z-c.z,w=Math.abs(h),R=Math.abs(f),P=Math.abs(_);let U,A,D,k,z,G,$,H,Q,he,ne,ee;if(w>=R&&w>=P?(D=h,G=m,Q=M,ee=x,h>=0?(U=f,A=_,k=g,z=y,$=T,H=S,he=C,ne=I):(U=_,A=f,k=y,z=g,$=S,H=T,he=I,ne=C)):R>=P?(D=f,G=g,Q=T,ee=C,f>=0?(U=_,A=h,k=y,z=m,$=S,H=M,he=I,ne=x):(U=h,A=_,k=m,z=y,$=M,H=S,he=x,ne=I)):(D=_,G=y,Q=S,ee=I,_>=0?(U=h,A=f,k=m,z=g,$=M,H=T,he=x,ne=C):(U=f,A=h,k=g,z=m,$=T,H=M,he=C,ne=x)),D===0)return null;const K=U/D,Z=A/D,O=1/D,se=k-K*G,Se=z-Z*G,Ge=$-K*Q,ze=H-Z*Q,Ve=he-K*ee,ae=ne-Z*ee,de=Ve*ze-ae*Ge,Ee=se*ae-Se*Ve,$e=Ge*Se-ze*se;if(a){if(de<0||Ee<0||$e<0)return null}else if((de<0||Ee<0||$e<0)&&(de>0||Ee>0||$e>0))return null;const Oe=de+Ee+$e;if(Oe===0)return null;const ft=O*(de*G+Ee*Q+$e*ee);return(Oe>0?ft<0:ft>0)?null:this.at(ft/Oe,l)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Nn extends dr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ht(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ur,this.combine=kf,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const fg=new Vt,Us=new gu,Pc=new Zs,pg=new X,Nc=new X,Lc=new X,Dc=new X,Rh=new X,Ic=new X,mg=new X,Uc=new X;class dt extends Kt{constructor(e=new Sn,t=new Nn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const a=t[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let l=0,c=a.length;l<c;l++){const d=a[l].name||String(l);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=l}}}}getVertexPosition(e,t){const i=this.geometry,a=i.attributes.position,l=i.morphAttributes.position,c=i.morphTargetsRelative;t.fromBufferAttribute(a,e);const d=this.morphTargetInfluences;if(l&&d){Ic.set(0,0,0);for(let h=0,f=l.length;h<f;h++){const _=d[h],m=l[h];_!==0&&(Rh.fromBufferAttribute(m,e),c?Ic.addScaledVector(Rh,_):Ic.addScaledVector(Rh.sub(t),_))}t.add(Ic)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,a=this.material,l=this.matrixWorld;a!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Pc.copy(i.boundingSphere),Pc.applyMatrix4(l),Us.copy(e.ray).recast(e.near),!(Pc.containsPoint(Us.origin)===!1&&(Us.intersectSphere(Pc,pg)===null||Us.origin.distanceToSquared(pg)>(e.far-e.near)**2))&&(fg.copy(l).invert(),Us.copy(e.ray).applyMatrix4(fg),!(i.boundingBox!==null&&Us.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Us)))}_computeIntersections(e,t,i){let a;const l=this.geometry,c=this.material,d=l.index,h=l.attributes.position,f=l.attributes.uv,_=l.attributes.uv1,m=l.attributes.normal,g=l.groups,y=l.drawRange;if(d!==null)if(Array.isArray(c))for(let M=0,T=g.length;M<T;M++){const S=g[M],x=c[S.materialIndex],C=Math.max(S.start,y.start),I=Math.min(d.count,Math.min(S.start+S.count,y.start+y.count));for(let w=C,R=I;w<R;w+=3){const P=d.getX(w),U=d.getX(w+1),A=d.getX(w+2);a=Oc(this,x,e,i,f,_,m,P,U,A),a&&(a.faceIndex=Math.floor(w/3),a.face.materialIndex=S.materialIndex,t.push(a))}}else{const M=Math.max(0,y.start),T=Math.min(d.count,y.start+y.count);for(let S=M,x=T;S<x;S+=3){const C=d.getX(S),I=d.getX(S+1),w=d.getX(S+2);a=Oc(this,c,e,i,f,_,m,C,I,w),a&&(a.faceIndex=Math.floor(S/3),t.push(a))}}else if(h!==void 0)if(Array.isArray(c))for(let M=0,T=g.length;M<T;M++){const S=g[M],x=c[S.materialIndex],C=Math.max(S.start,y.start),I=Math.min(h.count,Math.min(S.start+S.count,y.start+y.count));for(let w=C,R=I;w<R;w+=3){const P=w,U=w+1,A=w+2;a=Oc(this,x,e,i,f,_,m,P,U,A),a&&(a.faceIndex=Math.floor(w/3),a.face.materialIndex=S.materialIndex,t.push(a))}}else{const M=Math.max(0,y.start),T=Math.min(h.count,y.start+y.count);for(let S=M,x=T;S<x;S+=3){const C=S,I=S+1,w=S+2;a=Oc(this,c,e,i,f,_,m,C,I,w),a&&(a.faceIndex=Math.floor(S/3),t.push(a))}}}}function jM(s,e,t,i,a,l,c,d){let h;if(e.side===si?h=i.intersectTriangle(c,l,a,!0,d):h=i.intersectTriangle(a,l,c,e.side===qs,d),h===null)return null;Uc.copy(d),Uc.applyMatrix4(s.matrixWorld);const f=t.ray.origin.distanceTo(Uc);return f<t.near||f>t.far?null:{distance:f,point:Uc.clone(),object:s}}function Oc(s,e,t,i,a,l,c,d,h,f){s.getVertexPosition(d,Nc),s.getVertexPosition(h,Lc),s.getVertexPosition(f,Dc);const _=jM(s,e,t,i,Nc,Lc,Dc,mg);if(_){const m=new X;Wi.getBarycoord(mg,Nc,Lc,Dc,m),a&&(_.uv=Wi.getInterpolatedAttribute(a,d,h,f,m,new lt)),l&&(_.uv1=Wi.getInterpolatedAttribute(l,d,h,f,m,new lt)),c&&(_.normal=Wi.getInterpolatedAttribute(c,d,h,f,m,new X),_.normal.dot(i.direction)>0&&_.normal.multiplyScalar(-1));const g={a:d,b:h,c:f,normal:new X,materialIndex:0};Wi.getNormal(Nc,Lc,Dc,g.normal),_.face=g,_.barycoord=m}return _}class nx extends Kn{constructor(e=null,t=1,i=1,a,l,c,d,h,f=Ln,_=Ln,m,g){super(null,c,d,h,f,_,a,l,m,g),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class gg extends lr{constructor(e,t,i,a=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=a}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Da=new Vt,_g=new Vt,Fc=[],xg=new Ks,XM=new Vt,Xo=new dt,qo=new Zs;class Yo extends dt{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new gg(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let a=0;a<i;a++)this.setMatrixAt(a,XM)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Ks),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Da),xg.copy(e.boundingBox).applyMatrix4(Da),this.boundingBox.union(xg)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Zs),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Da),qo.copy(e.boundingSphere).applyMatrix4(Da),this.boundingSphere.union(qo)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,a=this.morphTexture.source.data.data,l=i.length+1,c=e*l+1;for(let d=0;d<i.length;d++)i[d]=a[c+d]}raycast(e,t){const i=this.matrixWorld,a=this.count;if(Xo.geometry=this.geometry,Xo.material=this.material,Xo.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),qo.copy(this.boundingSphere),qo.applyMatrix4(i),e.ray.intersectsSphere(qo)!==!1))for(let l=0;l<a;l++){this.getMatrixAt(l,Da),_g.multiplyMatrices(i,Da),Xo.matrixWorld=_g,Xo.raycast(e,Fc);for(let c=0,d=Fc.length;c<d;c++){const h=Fc[c];h.instanceId=l,h.object=this,t.push(h)}Fc.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new gg(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){const i=t.morphTargetInfluences,a=i.length+1;this.morphTexture===null&&(this.morphTexture=new nx(new Float32Array(a*this.count),a,this.count,Vf,Xi));const l=this.morphTexture.source.data.data;let c=0;for(let f=0;f<i.length;f++)c+=i[f];const d=this.geometry.morphTargetsRelative?1:1-c,h=a*e;return l[h]=d,l.set(i,h+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Os=new Zs,qM=new lt(.5,.5),kc=new X;class Kf{constructor(e=new Rr,t=new Rr,i=new Rr,a=new Rr,l=new Rr,c=new Rr){this.planes=[e,t,i,a,l,c]}set(e,t,i,a,l,c){const d=this.planes;return d[0].copy(e),d[1].copy(t),d[2].copy(i),d[3].copy(a),d[4].copy(l),d[5].copy(c),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=ar,i=!1){const a=this.planes,l=e.elements,c=l[0],d=l[1],h=l[2],f=l[3],_=l[4],m=l[5],g=l[6],y=l[7],M=l[8],T=l[9],S=l[10],x=l[11],C=l[12],I=l[13],w=l[14],R=l[15];if(a[0].setComponents(f-c,y-_,x-M,R-C).normalize(),a[1].setComponents(f+c,y+_,x+M,R+C).normalize(),a[2].setComponents(f+d,y+m,x+T,R+I).normalize(),a[3].setComponents(f-d,y-m,x-T,R-I).normalize(),i)a[4].setComponents(h,g,S,w).normalize(),a[5].setComponents(f-h,y-g,x-S,R-w).normalize();else if(a[4].setComponents(f-h,y-g,x-S,R-w).normalize(),t===ar)a[5].setComponents(f+h,y+g,x+S,R+w).normalize();else if(t===ol)a[5].setComponents(h,g,S,w).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Os.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Os.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Os)}intersectsSprite(e){Os.center.set(0,0,0);const t=qM.distanceTo(e.center);return Os.radius=.7071067811865476+t,Os.applyMatrix4(e.matrixWorld),this.intersectsSphere(Os)}intersectsSphere(e){const t=this.planes,i=e.center,a=-e.radius;for(let l=0;l<6;l++)if(t[l].distanceToPoint(i)<a)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const a=t[i];if(kc.x=a.normal.x>0?e.max.x:e.min.x,kc.y=a.normal.y>0?e.max.y:e.min.y,kc.z=a.normal.z>0?e.max.z:e.min.z,a.distanceToPoint(kc)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Xs extends dr{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ht(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const du=new X,hu=new X,vg=new Vt,$o=new gu,Bc=new Zs,Ph=new X,yg=new X;class YM extends Kt{constructor(e=new Sn,t=new Xs){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let a=1,l=t.count;a<l;a++)du.fromBufferAttribute(t,a-1),hu.fromBufferAttribute(t,a),i[a]=i[a-1],i[a]+=du.distanceTo(hu);e.setAttribute("lineDistance",new kt(i,1))}else ot("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,a=this.matrixWorld,l=e.params.Line.threshold,c=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Bc.copy(i.boundingSphere),Bc.applyMatrix4(a),Bc.radius+=l,e.ray.intersectsSphere(Bc)===!1)return;vg.copy(a).invert(),$o.copy(e.ray).applyMatrix4(vg);const d=l/((this.scale.x+this.scale.y+this.scale.z)/3),h=d*d,f=this.isLineSegments?2:1,_=i.index,g=i.attributes.position;if(_!==null){const y=Math.max(0,c.start),M=Math.min(_.count,c.start+c.count);for(let T=y,S=M-1;T<S;T+=f){const x=_.getX(T),C=_.getX(T+1),I=zc(this,e,$o,h,x,C,T);I&&t.push(I)}if(this.isLineLoop){const T=_.getX(M-1),S=_.getX(y),x=zc(this,e,$o,h,T,S,M-1);x&&t.push(x)}}else{const y=Math.max(0,c.start),M=Math.min(g.count,c.start+c.count);for(let T=y,S=M-1;T<S;T+=f){const x=zc(this,e,$o,h,T,T+1,T);x&&t.push(x)}if(this.isLineLoop){const T=zc(this,e,$o,h,M-1,y,M-1);T&&t.push(T)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const a=t[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let l=0,c=a.length;l<c;l++){const d=a[l].name||String(l);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=l}}}}}function zc(s,e,t,i,a,l,c){const d=s.geometry.attributes.position;if(du.fromBufferAttribute(d,a),hu.fromBufferAttribute(d,l),t.distanceSqToSegment(du,hu,Ph,yg)>i)return;Ph.applyMatrix4(s.matrixWorld);const f=e.ray.origin.distanceTo(Ph);if(!(f<e.near||f>e.far))return{distance:f,point:yg.clone().applyMatrix4(s.matrixWorld),index:c,face:null,faceIndex:null,barycoord:null,object:s}}const Sg=new X,Mg=new X;class ll extends YM{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let a=0,l=t.count;a<l;a+=2)Sg.fromBufferAttribute(t,a),Mg.fromBufferAttribute(t,a+1),i[a]=a===0?0:i[a-1],i[a+1]=i[a]+Sg.distanceTo(Mg);e.setAttribute("lineDistance",new kt(i,1))}else ot("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Jo extends dr{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ht(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Eg=new Vt,Pf=new gu,Hc=new Zs,Vc=new X;class Nh extends Kt{constructor(e=new Sn,t=new Jo){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,a=this.matrixWorld,l=e.params.Points.threshold,c=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Hc.copy(i.boundingSphere),Hc.applyMatrix4(a),Hc.radius+=l,e.ray.intersectsSphere(Hc)===!1)return;Eg.copy(a).invert(),Pf.copy(e.ray).applyMatrix4(Eg);const d=l/((this.scale.x+this.scale.y+this.scale.z)/3),h=d*d,f=i.index,m=i.attributes.position;if(f!==null){const g=Math.max(0,c.start),y=Math.min(f.count,c.start+c.count);for(let M=g,T=y;M<T;M++){const S=f.getX(M);Vc.fromBufferAttribute(m,S),wg(Vc,S,h,a,e,t,this)}}else{const g=Math.max(0,c.start),y=Math.min(m.count,c.start+c.count);for(let M=g,T=y;M<T;M++)Vc.fromBufferAttribute(m,M),wg(Vc,M,h,a,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const a=t[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let l=0,c=a.length;l<c;l++){const d=a[l].name||String(l);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=l}}}}}function wg(s,e,t,i,a,l,c){const d=Pf.distanceSqToPoint(s);if(d<t){const h=new X;Pf.closestPointToPoint(s,h),h.applyMatrix4(i);const f=a.ray.origin.distanceTo(h);if(f<a.near||f>a.far)return;l.push({distance:f,distanceToRay:Math.sqrt(d),point:h,index:e,face:null,faceIndex:null,barycoord:null,object:c})}}class ix extends Kn{constructor(e=[],t=Ys,i,a,l,c,d,h,f,_){super(e,t,i,a,l,c,d,h,f,_),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class cl extends Kn{constructor(e,t,i=cr,a,l,c,d=Ln,h=Ln,f,_=Ir,m=1){if(_!==Ir&&_!==Bs)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const g={width:e,height:t,depth:m};super(g,a,l,c,d,h,_,i,f),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Yf(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class $M extends cl{constructor(e,t=cr,i=Ys,a,l,c=Ln,d=Ln,h,f=Ir){const _={width:e,height:e,depth:1},m=[_,_,_,_,_,_];super(e,e,t,i,a,l,c,d,h,f),this.image=m,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class rx extends Kn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class dn extends Sn{constructor(e=1,t=1,i=1,a=1,l=1,c=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:a,heightSegments:l,depthSegments:c};const d=this;a=Math.floor(a),l=Math.floor(l),c=Math.floor(c);const h=[],f=[],_=[],m=[];let g=0,y=0;M("z","y","x",-1,-1,i,t,e,c,l,0),M("z","y","x",1,-1,i,t,-e,c,l,1),M("x","z","y",1,1,e,i,t,a,c,2),M("x","z","y",1,-1,e,i,-t,a,c,3),M("x","y","z",1,-1,e,t,i,a,l,4),M("x","y","z",-1,-1,e,t,-i,a,l,5),this.setIndex(h),this.setAttribute("position",new kt(f,3)),this.setAttribute("normal",new kt(_,3)),this.setAttribute("uv",new kt(m,2));function M(T,S,x,C,I,w,R,P,U,A,D){const k=w/U,z=R/A,G=w/2,$=R/2,H=P/2,Q=U+1,he=A+1;let ne=0,ee=0;const K=new X;for(let Z=0;Z<he;Z++){const O=Z*z-$;for(let se=0;se<Q;se++){const Se=se*k-G;K[T]=Se*C,K[S]=O*I,K[x]=H,f.push(K.x,K.y,K.z),K[T]=0,K[S]=0,K[x]=P>0?1:-1,_.push(K.x,K.y,K.z),m.push(se/U),m.push(1-Z/A),ne+=1}}for(let Z=0;Z<A;Z++)for(let O=0;O<U;O++){const se=g+O+Q*Z,Se=g+O+Q*(Z+1),Ge=g+(O+1)+Q*(Z+1),ze=g+(O+1)+Q*Z;h.push(se,Se,ze),h.push(Se,Ge,ze),ee+=6}d.addGroup(y,ee,D),y+=ee,g+=ne}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new dn(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Zf extends Sn{constructor(e=1,t=1,i=4,a=8,l=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:i,radialSegments:a,heightSegments:l},t=Math.max(0,t),i=Math.max(1,Math.floor(i)),a=Math.max(3,Math.floor(a)),l=Math.max(1,Math.floor(l));const c=[],d=[],h=[],f=[],_=t/2,m=Math.PI/2*e,g=t,y=2*m+g,M=i*2+l,T=a+1,S=new X,x=new X;for(let C=0;C<=M;C++){let I=0,w=0,R=0,P=0;if(C<=i){const D=C/i,k=D*Math.PI/2;w=-_-e*Math.cos(k),R=e*Math.sin(k),P=-e*Math.cos(k),I=D*m}else if(C<=i+l){const D=(C-i)/l;w=-_+D*t,R=e,P=0,I=m+D*g}else{const D=(C-i-l)/i,k=D*Math.PI/2;w=_+e*Math.sin(k),R=e*Math.cos(k),P=e*Math.sin(k),I=m+g+D*m}const U=Math.max(0,Math.min(1,I/y));let A=0;C===0?A=.5/a:C===M&&(A=-.5/a);for(let D=0;D<=a;D++){const k=D/a,z=k*Math.PI*2,G=Math.sin(z),$=Math.cos(z);x.x=-R*$,x.y=w,x.z=R*G,d.push(x.x,x.y,x.z),S.set(-R*$,P,R*G),S.normalize(),h.push(S.x,S.y,S.z),f.push(k+A,U)}if(C>0){const D=(C-1)*T;for(let k=0;k<a;k++){const z=D+k,G=D+k+1,$=C*T+k,H=C*T+k+1;c.push(z,G,$),c.push(G,H,$)}}}this.setIndex(c),this.setAttribute("position",new kt(d,3)),this.setAttribute("normal",new kt(h,3)),this.setAttribute("uv",new kt(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Zf(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}}class ji extends Sn{constructor(e=1,t=1,i=1,a=32,l=1,c=!1,d=0,h=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:a,heightSegments:l,openEnded:c,thetaStart:d,thetaLength:h};const f=this;a=Math.floor(a),l=Math.floor(l);const _=[],m=[],g=[],y=[];let M=0;const T=[],S=i/2;let x=0;C(),c===!1&&(e>0&&I(!0),t>0&&I(!1)),this.setIndex(_),this.setAttribute("position",new kt(m,3)),this.setAttribute("normal",new kt(g,3)),this.setAttribute("uv",new kt(y,2));function C(){const w=new X,R=new X;let P=0;const U=(t-e)/i;for(let A=0;A<=l;A++){const D=[],k=A/l,z=k*(t-e)+e;for(let G=0;G<=a;G++){const $=G/a,H=$*h+d,Q=Math.sin(H),he=Math.cos(H);R.x=z*Q,R.y=-k*i+S,R.z=z*he,m.push(R.x,R.y,R.z),w.set(Q,U,he).normalize(),g.push(w.x,w.y,w.z),y.push($,1-k),D.push(M++)}T.push(D)}for(let A=0;A<a;A++)for(let D=0;D<l;D++){const k=T[D][A],z=T[D+1][A],G=T[D+1][A+1],$=T[D][A+1];(e>0||D!==0)&&(_.push(k,z,$),P+=3),(t>0||D!==l-1)&&(_.push(z,G,$),P+=3)}f.addGroup(x,P,0),x+=P}function I(w){const R=M,P=new lt,U=new X;let A=0;const D=w===!0?e:t,k=w===!0?1:-1;for(let G=1;G<=a;G++)m.push(0,S*k,0),g.push(0,k,0),y.push(.5,.5),M++;const z=M;for(let G=0;G<=a;G++){const H=G/a*h+d,Q=Math.cos(H),he=Math.sin(H);U.x=D*he,U.y=S*k,U.z=D*Q,m.push(U.x,U.y,U.z),g.push(0,k,0),P.x=Q*.5+.5,P.y=he*.5*k+.5,y.push(P.x,P.y),M++}for(let G=0;G<a;G++){const $=R+G,H=z+G;w===!0?_.push(H,H+1,$):_.push(H+1,H,$),A+=3}f.addGroup(x,A,w===!0?1:2),x+=A}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ji(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Qf extends ji{constructor(e=1,t=1,i=32,a=1,l=!1,c=0,d=Math.PI*2){super(0,e,t,i,a,l,c,d),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:a,openEnded:l,thetaStart:c,thetaLength:d}}static fromJSON(e){return new Qf(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Yi extends Sn{constructor(e=1,t=1,i=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:a};const l=e/2,c=t/2,d=Math.floor(i),h=Math.floor(a),f=d+1,_=h+1,m=e/d,g=t/h,y=[],M=[],T=[],S=[];for(let x=0;x<_;x++){const C=x*g-c;for(let I=0;I<f;I++){const w=I*m-l;M.push(w,-C,0),T.push(0,0,1),S.push(I/d),S.push(1-x/h)}}for(let x=0;x<h;x++)for(let C=0;C<d;C++){const I=C+f*x,w=C+f*(x+1),R=C+1+f*(x+1),P=C+1+f*x;y.push(I,w,P),y.push(w,R,P)}this.setIndex(y),this.setAttribute("position",new kt(M,3)),this.setAttribute("normal",new kt(T,3)),this.setAttribute("uv",new kt(S,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Yi(e.width,e.height,e.widthSegments,e.heightSegments)}}class Jf extends Sn{constructor(e=.5,t=1,i=32,a=1,l=0,c=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:a,thetaStart:l,thetaLength:c},i=Math.max(3,i),a=Math.max(1,a);const d=[],h=[],f=[],_=[];let m=e;const g=(t-e)/a,y=new X,M=new lt;for(let T=0;T<=a;T++){for(let S=0;S<=i;S++){const x=l+S/i*c;y.x=m*Math.cos(x),y.y=m*Math.sin(x),h.push(y.x,y.y,y.z),f.push(0,0,1),M.x=(y.x/t+1)/2,M.y=(y.y/t+1)/2,_.push(M.x,M.y)}m+=g}for(let T=0;T<a;T++){const S=T*(i+1);for(let x=0;x<i;x++){const C=x+S,I=C,w=C+i+1,R=C+i+2,P=C+1;d.push(I,w,P),d.push(w,R,P)}}this.setIndex(d),this.setAttribute("position",new kt(h,3)),this.setAttribute("normal",new kt(f,3)),this.setAttribute("uv",new kt(_,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Jf(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class ep extends Sn{constructor(e=1,t=32,i=16,a=0,l=Math.PI*2,c=0,d=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:a,phiLength:l,thetaStart:c,thetaLength:d},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const h=Math.min(c+d,Math.PI);let f=0;const _=[],m=new X,g=new X,y=[],M=[],T=[],S=[];for(let x=0;x<=i;x++){const C=[],I=x/i,w=c+I*d,R=e*Math.cos(w),P=Math.sqrt(e*e-R*R);let U=0;x===0&&c===0?U=.5/t:x===i&&h===Math.PI&&(U=-.5/t);for(let A=0;A<=t;A++){const D=A/t,k=a+D*l;m.x=-P*Math.cos(k),m.y=R,m.z=P*Math.sin(k),M.push(m.x,m.y,m.z),g.copy(m).normalize(),T.push(g.x,g.y,g.z),S.push(D+U,1-I),C.push(f++)}_.push(C)}for(let x=0;x<i;x++)for(let C=0;C<t;C++){const I=_[x][C+1],w=_[x][C],R=_[x+1][C],P=_[x+1][C+1];(x!==0||c>0)&&y.push(I,w,P),(x!==i-1||h<Math.PI)&&y.push(w,R,P)}this.setIndex(y),this.setAttribute("position",new kt(M,3)),this.setAttribute("normal",new kt(T,3)),this.setAttribute("uv",new kt(S,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ep(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class bg extends Sn{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){const t=[],i=new Set,a=new X,l=new X;if(e.index!==null){const c=e.attributes.position,d=e.index;let h=e.groups;h.length===0&&(h=[{start:0,count:d.count,materialIndex:0}]);for(let f=0,_=h.length;f<_;++f){const m=h[f],g=m.start,y=m.count;for(let M=g,T=g+y;M<T;M+=3)for(let S=0;S<3;S++){const x=d.getX(M+S),C=d.getX(M+(S+1)%3);a.fromBufferAttribute(c,x),l.fromBufferAttribute(c,C),Tg(a,l,i)===!0&&(t.push(a.x,a.y,a.z),t.push(l.x,l.y,l.z))}}}else{const c=e.attributes.position;for(let d=0,h=c.count/3;d<h;d++)for(let f=0;f<3;f++){const _=3*d+f,m=3*d+(f+1)%3;a.fromBufferAttribute(c,_),l.fromBufferAttribute(c,m),Tg(a,l,i)===!0&&(t.push(a.x,a.y,a.z),t.push(l.x,l.y,l.z))}}this.setAttribute("position",new kt(t,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}function Tg(s,e,t){const i=`${s.x},${s.y},${s.z}-${e.x},${e.y},${e.z}`,a=`${e.x},${e.y},${e.z}-${s.x},${s.y},${s.z}`;return t.has(i)===!0||t.has(a)===!0?!1:(t.add(i),t.add(a),!0)}function eo(s){const e={};for(const t in s){e[t]={};for(const i in s[t]){const a=s[t][i];if(Ag(a))a.isRenderTargetTexture?(ot("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=a.clone();else if(Array.isArray(a))if(Ag(a[0])){const l=[];for(let c=0,d=a.length;c<d;c++)l[c]=a[c].clone();e[t][i]=l}else e[t][i]=a.slice();else e[t][i]=a}}return e}function Xn(s){const e={};for(let t=0;t<s.length;t++){const i=eo(s[t]);for(const a in i)e[a]=i[a]}return e}function Ag(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function KM(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function sx(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:At.workingColorSpace}const ZM={clone:eo,merge:Xn};var QM=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,JM=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class hr extends dr{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=QM,this.fragmentShader=JM,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=eo(e.uniforms),this.uniformsGroups=KM(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const a in this.uniforms){const c=this.uniforms[a].value;c&&c.isTexture?t.uniforms[a]={type:"t",value:c.toJSON(e).uuid}:c&&c.isColor?t.uniforms[a]={type:"c",value:c.getHex()}:c&&c.isVector2?t.uniforms[a]={type:"v2",value:c.toArray()}:c&&c.isVector3?t.uniforms[a]={type:"v3",value:c.toArray()}:c&&c.isVector4?t.uniforms[a]={type:"v4",value:c.toArray()}:c&&c.isMatrix3?t.uniforms[a]={type:"m3",value:c.toArray()}:c&&c.isMatrix4?t.uniforms[a]={type:"m4",value:c.toArray()}:t.uniforms[a]={value:c}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const a in this.extensions)this.extensions[a]===!0&&(i[a]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const i in e.uniforms){const a=e.uniforms[i];switch(this.uniforms[i]={},a.type){case"t":this.uniforms[i].value=t[a.value]||null;break;case"c":this.uniforms[i].value=new ht().setHex(a.value);break;case"v2":this.uniforms[i].value=new lt().fromArray(a.value);break;case"v3":this.uniforms[i].value=new X().fromArray(a.value);break;case"v4":this.uniforms[i].value=new sn().fromArray(a.value);break;case"m3":this.uniforms[i].value=new mt().fromArray(a.value);break;case"m4":this.uniforms[i].value=new Vt().fromArray(a.value);break;default:this.uniforms[i].value=a.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class e1 extends hr{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class qn extends dr{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ht(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ht(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=au,this.normalScale=new lt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ur,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class t1 extends qn{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new lt(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Et(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new ht(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new ht(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new ht(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class n1 extends dr{constructor(e){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new ht(16777215),this.specular=new ht(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ht(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=au,this.normalScale=new lt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ur,this.combine=kf,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class i1 extends dr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=cM,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class r1 extends dr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Cg={enabled:!1,files:{},add:function(s,e){this.enabled!==!1&&(Rg(s)||(this.files[s]=e))},get:function(s){if(this.enabled!==!1&&!Rg(s))return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};function Rg(s){try{const e=s.slice(s.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class s1{constructor(e,t,i){const a=this;let l=!1,c=0,d=0,h;const f=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this._abortController=null,this.itemStart=function(_){d++,l===!1&&a.onStart!==void 0&&a.onStart(_,c,d),l=!0},this.itemEnd=function(_){c++,a.onProgress!==void 0&&a.onProgress(_,c,d),c===d&&(l=!1,a.onLoad!==void 0&&a.onLoad())},this.itemError=function(_){a.onError!==void 0&&a.onError(_)},this.resolveURL=function(_){return _=_.normalize("NFC"),h?h(_):_},this.setURLModifier=function(_){return h=_,this},this.addHandler=function(_,m){return f.push(_,m),this},this.removeHandler=function(_){const m=f.indexOf(_);return m!==-1&&f.splice(m,2),this},this.getHandler=function(_){for(let m=0,g=f.length;m<g;m+=2){const y=f[m],M=f[m+1];if(y.global&&(y.lastIndex=0),y.test(_))return M}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const a1=new s1;class tp{constructor(e){this.manager=e!==void 0?e:a1,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){const i=this;return new Promise(function(a,l){i.load(e,a,t,l)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}tp.DEFAULT_MATERIAL_NAME="__DEFAULT";const Ar={};class o1 extends Error{constructor(e,t){super(e),this.response=t}}class l1 extends tp{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,i,a){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const l=Cg.get(`file:${e}`);if(l!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(l),this.manager.itemEnd(e)},0);return}if(Ar[e]!==void 0){Ar[e].push({onLoad:t,onProgress:i,onError:a});return}Ar[e]=[],Ar[e].push({onLoad:t,onProgress:i,onError:a});const c=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),d=this.mimeType,h=this.responseType;fetch(c).then(f=>{if(f.status===200||f.status===0){if(f.status===0&&ot("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||f.body===void 0||f.body.getReader===void 0)return f;const _=Ar[e],m=f.body.getReader(),g=f.headers.get("X-File-Size")||f.headers.get("Content-Length"),y=g?parseInt(g):0,M=y!==0;let T=0;const S=new ReadableStream({start(x){C();function C(){m.read().then(({done:I,value:w})=>{if(I)x.close();else{T+=w.byteLength;const R=new ProgressEvent("progress",{lengthComputable:M,loaded:T,total:y});for(let P=0,U=_.length;P<U;P++){const A=_[P];A.onProgress&&A.onProgress(R)}x.enqueue(w),C()}},I=>{x.error(I)})}}});return new Response(S)}else throw new o1(`fetch for "${f.url}" responded with ${f.status}: ${f.statusText}`,f)}).then(f=>{switch(h){case"arraybuffer":return f.arrayBuffer();case"blob":return f.blob();case"document":return f.text().then(_=>new DOMParser().parseFromString(_,d));case"json":return f.json();default:if(d==="")return f.text();{const m=/charset="?([^;"\s]*)"?/i.exec(d),g=m&&m[1]?m[1].toLowerCase():void 0,y=new TextDecoder(g);return f.arrayBuffer().then(M=>y.decode(M))}}}).then(f=>{Cg.add(`file:${e}`,f);const _=Ar[e];delete Ar[e];for(let m=0,g=_.length;m<g;m++){const y=_[m];y.onLoad&&y.onLoad(f)}}).catch(f=>{const _=Ar[e];if(_===void 0)throw this.manager.itemError(e),f;delete Ar[e];for(let m=0,g=_.length;m<g;m++){const y=_[m];y.onError&&y.onError(f)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}class _u extends Kt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ht(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class c1 extends _u{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Kt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ht(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const Lh=new Vt,Pg=new X,Ng=new X;class ax{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new lt(512,512),this.mapType=mi,this.map=null,this.mapPass=null,this.matrix=new Vt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Kf,this._frameExtents=new lt(1,1),this._viewportCount=1,this._viewports=[new sn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera;Pg.setFromMatrixPosition(e.matrixWorld),t.position.copy(Pg),Ng.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Ng),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,i,a){Lh.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),i.setFromProjectionMatrix(Lh,e.coordinateSystem,e.reversedDepth);const l=this._frameExtents,c=a?a.z/l.x:1,d=a?a.w/l.y:1,h=a?a.x/l.x:0,f=a?a.y/l.y:0;e.coordinateSystem===ol||e.reversedDepth?t.set(.5*c,0,0,.5*c+h,0,.5*d,0,.5*d+f,0,0,1,0,0,0,0,1):t.set(.5*c,0,0,.5*c+h,0,.5*d,0,.5*d+f,0,0,.5,.5,0,0,0,1),t.multiply(Lh)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Gc=new X,Wc=new ps,er=new X;class ox extends Kt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Vt,this.projectionMatrix=new Vt,this.projectionMatrixInverse=new Vt,this.coordinateSystem=ar,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Gc,Wc,er),er.x===1&&er.y===1&&er.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Gc,Wc,er.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(Gc,Wc,er),er.x===1&&er.y===1&&er.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Gc,Wc,er.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const rs=new X,Lg=new lt,Dg=new lt;class pi extends ox{constructor(e=50,t=1,i=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=a,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=uu*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(eu*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return uu*2*Math.atan(Math.tan(eu*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){rs.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(rs.x,rs.y).multiplyScalar(-e/rs.z),rs.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(rs.x,rs.y).multiplyScalar(-e/rs.z)}getViewSize(e,t){return this.getViewBounds(e,Lg,Dg),t.subVectors(Dg,Lg)}setViewOffset(e,t,i,a,l,c){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=a,this.view.width=l,this.view.height=c,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(eu*.5*this.fov)/this.zoom,i=2*t,a=this.aspect*i,l=-.5*a;const c=this.view;if(this.view!==null&&this.view.enabled){const h=c.fullWidth,f=c.fullHeight;l+=c.offsetX*a/h,t-=c.offsetY*i/f,a*=c.width/h,i*=c.height/f}const d=this.filmOffset;d!==0&&(l+=e*d/this.getFilmWidth()),this.projectionMatrix.makePerspective(l,l+a,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class u1 extends ax{constructor(){super(new pi(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,i=uu*2*e.angle*this.focus,a=this.mapSize.width/this.mapSize.height*this.aspect,l=e.distance||t.far;(i!==t.fov||a!==t.aspect||l!==t.far)&&(t.fov=i,t.aspect=a,t.far=l,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){const e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}}class d1 extends _u{constructor(e,t,i=0,a=Math.PI/3,l=0,c=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Kt.DEFAULT_UP),this.updateMatrix(),this.target=new Kt,this.distance=i,this.angle=a,this.penumbra=l,this.decay=c,this.map=null,this.shadow=new u1}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}}class np extends ox{constructor(e=-1,t=1,i=1,a=-1,l=.1,c=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=a,this.near=l,this.far=c,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,a,l,c){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=a,this.view.width=l,this.view.height=c,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let l=i-e,c=i+e,d=a+t,h=a-t;if(this.view!==null&&this.view.enabled){const f=(this.right-this.left)/this.view.fullWidth/this.zoom,_=(this.top-this.bottom)/this.view.fullHeight/this.zoom;l+=f*this.view.offsetX,c=l+f*this.view.width,d-=_*this.view.offsetY,h=d-_*this.view.height}this.projectionMatrix.makeOrthographic(l,c,d,h,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class h1 extends ax{constructor(){super(new np(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Ig extends _u{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Kt.DEFAULT_UP),this.updateMatrix(),this.target=new Kt,this.shadow=new h1}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class f1 extends _u{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}const Ia=-90,Ua=1;class p1 extends Kt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new pi(Ia,Ua,e,t);a.layers=this.layers,this.add(a);const l=new pi(Ia,Ua,e,t);l.layers=this.layers,this.add(l);const c=new pi(Ia,Ua,e,t);c.layers=this.layers,this.add(c);const d=new pi(Ia,Ua,e,t);d.layers=this.layers,this.add(d);const h=new pi(Ia,Ua,e,t);h.layers=this.layers,this.add(h);const f=new pi(Ia,Ua,e,t);f.layers=this.layers,this.add(f)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,a,l,c,d,h]=t;for(const f of t)this.remove(f);if(e===ar)i.up.set(0,1,0),i.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),l.up.set(0,0,-1),l.lookAt(0,1,0),c.up.set(0,0,1),c.lookAt(0,-1,0),d.up.set(0,1,0),d.lookAt(0,0,1),h.up.set(0,1,0),h.lookAt(0,0,-1);else if(e===ol)i.up.set(0,-1,0),i.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),l.up.set(0,0,1),l.lookAt(0,1,0),c.up.set(0,0,-1),c.lookAt(0,-1,0),d.up.set(0,-1,0),d.lookAt(0,0,1),h.up.set(0,-1,0),h.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const f of t)this.add(f),f.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:a}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[l,c,d,h,f,_]=this.children,m=e.getRenderTarget(),g=e.getActiveCubeFace(),y=e.getActiveMipmapLevel(),M=e.xr.enabled;e.xr.enabled=!1;const T=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let S=!1;e.isWebGLRenderer===!0?S=e.state.buffers.depth.getReversed():S=e.reversedDepthBuffer,e.setRenderTarget(i,0,a),S&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(i,1,a),S&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(i,2,a),S&&e.autoClear===!1&&e.clearDepth(),e.render(t,d),e.setRenderTarget(i,3,a),S&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(i,4,a),S&&e.autoClear===!1&&e.clearDepth(),e.render(t,f),i.texture.generateMipmaps=T,e.setRenderTarget(i,5,a),S&&e.autoClear===!1&&e.clearDepth(),e.render(t,_),e.setRenderTarget(m,g,y),e.xr.enabled=M,i.texture.needsPMREMUpdate=!0}}class m1 extends pi{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class Ug{constructor(e=1,t=0,i=0){this.radius=e,this.phi=t,this.theta=i}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Et(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(Et(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const lp=class lp{constructor(e,t,i,a){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,a)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,a){const l=this.elements;return l[0]=e,l[2]=t,l[1]=i,l[3]=a,this}};lp.prototype.isMatrix2=!0;let Og=lp;class g1 extends ms{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function Fg(s,e,t,i){const a=_1(i);switch(t){case Y_:return s*e;case Vf:return s*e/a.components*a.byteLength;case Gf:return s*e/a.components*a.byteLength;case $s:return s*e*2/a.components*a.byteLength;case Wf:return s*e*2/a.components*a.byteLength;case $_:return s*e*3/a.components*a.byteLength;case qi:return s*e*4/a.components*a.byteLength;case jf:return s*e*4/a.components*a.byteLength;case Kc:case Zc:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Qc:case Jc:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case ef:case nf:return Math.max(s,16)*Math.max(e,8)/4;case Jh:case tf:return Math.max(s,8)*Math.max(e,8)/2;case rf:case sf:case of:case lf:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case af:case ru:case cf:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case uf:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case df:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case hf:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case ff:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case pf:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case mf:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case gf:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case _f:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case xf:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case vf:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case yf:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case Sf:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case Mf:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case Ef:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case wf:case bf:case Tf:return Math.ceil(s/4)*Math.ceil(e/4)*16;case Af:case Cf:return Math.ceil(s/4)*Math.ceil(e/4)*8;case su:case Rf:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function _1(s){switch(s){case mi:case W_:return{byteLength:1,components:1};case sl:case j_:case ur:return{byteLength:2,components:1};case zf:case Hf:return{byteLength:2,components:4};case cr:case Bf:case Xi:return{byteLength:4,components:1};case X_:case q_:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ff}}));typeof window<"u"&&(window.__THREE__?ot("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ff);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function lx(){let s=null,e=!1,t=null,i=null;function a(l,c){i=s.requestAnimationFrame(a),t(l,c)}return{start:function(){e!==!0&&t!==null&&s!==null&&(i=s.requestAnimationFrame(a),e=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(l){t=l},setContext:function(l){s=l}}}function x1(s){const e=new WeakMap;function t(d,h){const f=d.array,_=d.usage,m=f.byteLength,g=s.createBuffer();s.bindBuffer(h,g),s.bufferData(h,f,_),d.onUploadCallback();let y;if(f instanceof Float32Array)y=s.FLOAT;else if(typeof Float16Array<"u"&&f instanceof Float16Array)y=s.HALF_FLOAT;else if(f instanceof Uint16Array)d.isFloat16BufferAttribute?y=s.HALF_FLOAT:y=s.UNSIGNED_SHORT;else if(f instanceof Int16Array)y=s.SHORT;else if(f instanceof Uint32Array)y=s.UNSIGNED_INT;else if(f instanceof Int32Array)y=s.INT;else if(f instanceof Int8Array)y=s.BYTE;else if(f instanceof Uint8Array)y=s.UNSIGNED_BYTE;else if(f instanceof Uint8ClampedArray)y=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+f);return{buffer:g,type:y,bytesPerElement:f.BYTES_PER_ELEMENT,version:d.version,size:m}}function i(d,h,f){const _=h.array,m=h.updateRanges;if(s.bindBuffer(f,d),m.length===0)s.bufferSubData(f,0,_);else{m.sort((y,M)=>y.start-M.start);let g=0;for(let y=1;y<m.length;y++){const M=m[g],T=m[y];T.start<=M.start+M.count+1?M.count=Math.max(M.count,T.start+T.count-M.start):(++g,m[g]=T)}m.length=g+1;for(let y=0,M=m.length;y<M;y++){const T=m[y];s.bufferSubData(f,T.start*_.BYTES_PER_ELEMENT,_,T.start,T.count)}h.clearUpdateRanges()}h.onUploadCallback()}function a(d){return d.isInterleavedBufferAttribute&&(d=d.data),e.get(d)}function l(d){d.isInterleavedBufferAttribute&&(d=d.data);const h=e.get(d);h&&(s.deleteBuffer(h.buffer),e.delete(d))}function c(d,h){if(d.isInterleavedBufferAttribute&&(d=d.data),d.isGLBufferAttribute){const _=e.get(d);(!_||_.version<d.version)&&e.set(d,{buffer:d.buffer,type:d.type,bytesPerElement:d.elementSize,version:d.version});return}const f=e.get(d);if(f===void 0)e.set(d,t(d,h));else if(f.version<d.version){if(f.size!==d.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(f.buffer,d,h),f.version=d.version}}return{get:a,remove:l,update:c}}var v1=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,y1=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,S1=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,M1=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,E1=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,w1=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,b1=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,T1=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,A1=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,C1=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,R1=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,P1=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,N1=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,L1=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,D1=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,I1=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,U1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,O1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,F1=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,k1=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,B1=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,z1=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,H1=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,V1=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,G1=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,W1=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,j1=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,X1=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,q1=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Y1=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,$1="gl_FragColor = linearToOutputTexel( gl_FragColor );",K1=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Z1=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Q1=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,J1=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,eE=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,tE=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,nE=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,iE=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,rE=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,sE=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,aE=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,oE=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lE=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,cE=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,uE=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,dE=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,hE=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,fE=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,pE=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,mE=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,gE=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,_E=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,xE=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,vE=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,yE=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,SE=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,ME=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,EE=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,wE=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,bE=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,TE=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,AE=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,CE=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,RE=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,PE=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,NE=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,LE=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,DE=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,IE=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,UE=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,OE=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,FE=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,kE=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,BE=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,zE=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,HE=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,VE=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,GE=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,WE=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,jE=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,XE=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,qE=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,YE=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,$E=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,KE=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,ZE=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,QE=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,JE=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ew=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,tw=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,nw=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,iw=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,rw=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,sw=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,aw=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,ow=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,lw=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,cw=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,uw=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,dw=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,hw=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,fw=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,pw=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,mw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,gw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,_w=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,xw=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const vw=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,yw=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Sw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Mw=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ew=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ww=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bw=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Tw=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Aw=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Cw=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Rw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Pw=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Nw=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Lw=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Dw=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Iw=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Uw=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ow=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Fw=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,kw=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Bw=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,zw=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Hw=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Vw=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Gw=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Ww=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,jw=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Xw=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,qw=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Yw=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,$w=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Kw=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Zw=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Qw=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,yt={alphahash_fragment:v1,alphahash_pars_fragment:y1,alphamap_fragment:S1,alphamap_pars_fragment:M1,alphatest_fragment:E1,alphatest_pars_fragment:w1,aomap_fragment:b1,aomap_pars_fragment:T1,batching_pars_vertex:A1,batching_vertex:C1,begin_vertex:R1,beginnormal_vertex:P1,bsdfs:N1,iridescence_fragment:L1,bumpmap_pars_fragment:D1,clipping_planes_fragment:I1,clipping_planes_pars_fragment:U1,clipping_planes_pars_vertex:O1,clipping_planes_vertex:F1,color_fragment:k1,color_pars_fragment:B1,color_pars_vertex:z1,color_vertex:H1,common:V1,cube_uv_reflection_fragment:G1,defaultnormal_vertex:W1,displacementmap_pars_vertex:j1,displacementmap_vertex:X1,emissivemap_fragment:q1,emissivemap_pars_fragment:Y1,colorspace_fragment:$1,colorspace_pars_fragment:K1,envmap_fragment:Z1,envmap_common_pars_fragment:Q1,envmap_pars_fragment:J1,envmap_pars_vertex:eE,envmap_physical_pars_fragment:dE,envmap_vertex:tE,fog_vertex:nE,fog_pars_vertex:iE,fog_fragment:rE,fog_pars_fragment:sE,gradientmap_pars_fragment:aE,lightmap_pars_fragment:oE,lights_lambert_fragment:lE,lights_lambert_pars_fragment:cE,lights_pars_begin:uE,lights_toon_fragment:hE,lights_toon_pars_fragment:fE,lights_phong_fragment:pE,lights_phong_pars_fragment:mE,lights_physical_fragment:gE,lights_physical_pars_fragment:_E,lights_fragment_begin:xE,lights_fragment_maps:vE,lights_fragment_end:yE,lightprobes_pars_fragment:SE,logdepthbuf_fragment:ME,logdepthbuf_pars_fragment:EE,logdepthbuf_pars_vertex:wE,logdepthbuf_vertex:bE,map_fragment:TE,map_pars_fragment:AE,map_particle_fragment:CE,map_particle_pars_fragment:RE,metalnessmap_fragment:PE,metalnessmap_pars_fragment:NE,morphinstance_vertex:LE,morphcolor_vertex:DE,morphnormal_vertex:IE,morphtarget_pars_vertex:UE,morphtarget_vertex:OE,normal_fragment_begin:FE,normal_fragment_maps:kE,normal_pars_fragment:BE,normal_pars_vertex:zE,normal_vertex:HE,normalmap_pars_fragment:VE,clearcoat_normal_fragment_begin:GE,clearcoat_normal_fragment_maps:WE,clearcoat_pars_fragment:jE,iridescence_pars_fragment:XE,opaque_fragment:qE,packing:YE,premultiplied_alpha_fragment:$E,project_vertex:KE,dithering_fragment:ZE,dithering_pars_fragment:QE,roughnessmap_fragment:JE,roughnessmap_pars_fragment:ew,shadowmap_pars_fragment:tw,shadowmap_pars_vertex:nw,shadowmap_vertex:iw,shadowmask_pars_fragment:rw,skinbase_vertex:sw,skinning_pars_vertex:aw,skinning_vertex:ow,skinnormal_vertex:lw,specularmap_fragment:cw,specularmap_pars_fragment:uw,tonemapping_fragment:dw,tonemapping_pars_fragment:hw,transmission_fragment:fw,transmission_pars_fragment:pw,uv_pars_fragment:mw,uv_pars_vertex:gw,uv_vertex:_w,worldpos_vertex:xw,background_vert:vw,background_frag:yw,backgroundCube_vert:Sw,backgroundCube_frag:Mw,cube_vert:Ew,cube_frag:ww,depth_vert:bw,depth_frag:Tw,distance_vert:Aw,distance_frag:Cw,equirect_vert:Rw,equirect_frag:Pw,linedashed_vert:Nw,linedashed_frag:Lw,meshbasic_vert:Dw,meshbasic_frag:Iw,meshlambert_vert:Uw,meshlambert_frag:Ow,meshmatcap_vert:Fw,meshmatcap_frag:kw,meshnormal_vert:Bw,meshnormal_frag:zw,meshphong_vert:Hw,meshphong_frag:Vw,meshphysical_vert:Gw,meshphysical_frag:Ww,meshtoon_vert:jw,meshtoon_frag:Xw,points_vert:qw,points_frag:Yw,shadow_vert:$w,shadow_frag:Kw,sprite_vert:Zw,sprite_frag:Qw},Ue={common:{diffuse:{value:new ht(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new mt},alphaMap:{value:null},alphaMapTransform:{value:new mt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new mt}},envmap:{envMap:{value:null},envMapRotation:{value:new mt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new mt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new mt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new mt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new mt},normalScale:{value:new lt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new mt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new mt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new mt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new mt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ht(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new X},probesMax:{value:new X},probesResolution:{value:new X}},points:{diffuse:{value:new ht(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new mt},alphaTest:{value:0},uvTransform:{value:new mt}},sprite:{diffuse:{value:new ht(16777215)},opacity:{value:1},center:{value:new lt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new mt},alphaMap:{value:null},alphaMapTransform:{value:new mt},alphaTest:{value:0}}},sr={basic:{uniforms:Xn([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.fog]),vertexShader:yt.meshbasic_vert,fragmentShader:yt.meshbasic_frag},lambert:{uniforms:Xn([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,Ue.lights,{emissive:{value:new ht(0)},envMapIntensity:{value:1}}]),vertexShader:yt.meshlambert_vert,fragmentShader:yt.meshlambert_frag},phong:{uniforms:Xn([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,Ue.lights,{emissive:{value:new ht(0)},specular:{value:new ht(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:yt.meshphong_vert,fragmentShader:yt.meshphong_frag},standard:{uniforms:Xn([Ue.common,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.roughnessmap,Ue.metalnessmap,Ue.fog,Ue.lights,{emissive:{value:new ht(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:yt.meshphysical_vert,fragmentShader:yt.meshphysical_frag},toon:{uniforms:Xn([Ue.common,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.gradientmap,Ue.fog,Ue.lights,{emissive:{value:new ht(0)}}]),vertexShader:yt.meshtoon_vert,fragmentShader:yt.meshtoon_frag},matcap:{uniforms:Xn([Ue.common,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,{matcap:{value:null}}]),vertexShader:yt.meshmatcap_vert,fragmentShader:yt.meshmatcap_frag},points:{uniforms:Xn([Ue.points,Ue.fog]),vertexShader:yt.points_vert,fragmentShader:yt.points_frag},dashed:{uniforms:Xn([Ue.common,Ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:yt.linedashed_vert,fragmentShader:yt.linedashed_frag},depth:{uniforms:Xn([Ue.common,Ue.displacementmap]),vertexShader:yt.depth_vert,fragmentShader:yt.depth_frag},normal:{uniforms:Xn([Ue.common,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,{opacity:{value:1}}]),vertexShader:yt.meshnormal_vert,fragmentShader:yt.meshnormal_frag},sprite:{uniforms:Xn([Ue.sprite,Ue.fog]),vertexShader:yt.sprite_vert,fragmentShader:yt.sprite_frag},background:{uniforms:{uvTransform:{value:new mt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:yt.background_vert,fragmentShader:yt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new mt}},vertexShader:yt.backgroundCube_vert,fragmentShader:yt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:yt.cube_vert,fragmentShader:yt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:yt.equirect_vert,fragmentShader:yt.equirect_frag},distance:{uniforms:Xn([Ue.common,Ue.displacementmap,{referencePosition:{value:new X},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:yt.distance_vert,fragmentShader:yt.distance_frag},shadow:{uniforms:Xn([Ue.lights,Ue.fog,{color:{value:new ht(0)},opacity:{value:1}}]),vertexShader:yt.shadow_vert,fragmentShader:yt.shadow_frag}};sr.physical={uniforms:Xn([sr.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new mt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new mt},clearcoatNormalScale:{value:new lt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new mt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new mt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new mt},sheen:{value:0},sheenColor:{value:new ht(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new mt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new mt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new mt},transmissionSamplerSize:{value:new lt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new mt},attenuationDistance:{value:0},attenuationColor:{value:new ht(0)},specularColor:{value:new ht(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new mt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new mt},anisotropyVector:{value:new lt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new mt}}]),vertexShader:yt.meshphysical_vert,fragmentShader:yt.meshphysical_frag};const jc={r:0,b:0,g:0},Jw=new Vt,cx=new mt;cx.set(-1,0,0,0,1,0,0,0,1);function eb(s,e,t,i,a,l){const c=new ht(0);let d=a===!0?0:1,h,f,_=null,m=0,g=null;function y(C){let I=C.isScene===!0?C.background:null;if(I&&I.isTexture){const w=C.backgroundBlurriness>0;I=e.get(I,w)}return I}function M(C){let I=!1;const w=y(C);w===null?S(c,d):w&&w.isColor&&(S(w,1),I=!0);const R=s.xr.getEnvironmentBlendMode();R==="additive"?t.buffers.color.setClear(0,0,0,1,l):R==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,l),(s.autoClear||I)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function T(C,I){const w=y(I);w&&(w.isCubeTexture||w.mapping===mu)?(f===void 0&&(f=new dt(new dn(1,1,1),new hr({name:"BackgroundCubeMaterial",uniforms:eo(sr.backgroundCube.uniforms),vertexShader:sr.backgroundCube.vertexShader,fragmentShader:sr.backgroundCube.fragmentShader,side:si,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),f.geometry.deleteAttribute("normal"),f.geometry.deleteAttribute("uv"),f.onBeforeRender=function(R,P,U){this.matrixWorld.copyPosition(U.matrixWorld)},Object.defineProperty(f.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(f)),f.material.uniforms.envMap.value=w,f.material.uniforms.backgroundBlurriness.value=I.backgroundBlurriness,f.material.uniforms.backgroundIntensity.value=I.backgroundIntensity,f.material.uniforms.backgroundRotation.value.setFromMatrix4(Jw.makeRotationFromEuler(I.backgroundRotation)).transpose(),w.isCubeTexture&&w.isRenderTargetTexture===!1&&f.material.uniforms.backgroundRotation.value.premultiply(cx),f.material.toneMapped=At.getTransfer(w.colorSpace)!==zt,(_!==w||m!==w.version||g!==s.toneMapping)&&(f.material.needsUpdate=!0,_=w,m=w.version,g=s.toneMapping),f.layers.enableAll(),C.unshift(f,f.geometry,f.material,0,0,null)):w&&w.isTexture&&(h===void 0&&(h=new dt(new Yi(2,2),new hr({name:"BackgroundMaterial",uniforms:eo(sr.background.uniforms),vertexShader:sr.background.vertexShader,fragmentShader:sr.background.fragmentShader,side:qs,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(h)),h.material.uniforms.t2D.value=w,h.material.uniforms.backgroundIntensity.value=I.backgroundIntensity,h.material.toneMapped=At.getTransfer(w.colorSpace)!==zt,w.matrixAutoUpdate===!0&&w.updateMatrix(),h.material.uniforms.uvTransform.value.copy(w.matrix),(_!==w||m!==w.version||g!==s.toneMapping)&&(h.material.needsUpdate=!0,_=w,m=w.version,g=s.toneMapping),h.layers.enableAll(),C.unshift(h,h.geometry,h.material,0,0,null))}function S(C,I){C.getRGB(jc,sx(s)),t.buffers.color.setClear(jc.r,jc.g,jc.b,I,l)}function x(){f!==void 0&&(f.geometry.dispose(),f.material.dispose(),f=void 0),h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0)}return{getClearColor:function(){return c},setClearColor:function(C,I=1){c.set(C),d=I,S(c,d)},getClearAlpha:function(){return d},setClearAlpha:function(C){d=C,S(c,d)},render:M,addToRenderList:T,dispose:x}}function tb(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),i={},a=g(null);let l=a,c=!1;function d(z,G,$,H,Q){let he=!1;const ne=m(z,H,$,G);l!==ne&&(l=ne,f(l.object)),he=y(z,H,$,Q),he&&M(z,H,$,Q),Q!==null&&e.update(Q,s.ELEMENT_ARRAY_BUFFER),(he||c)&&(c=!1,w(z,G,$,H),Q!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(Q).buffer))}function h(){return s.createVertexArray()}function f(z){return s.bindVertexArray(z)}function _(z){return s.deleteVertexArray(z)}function m(z,G,$,H){const Q=H.wireframe===!0;let he=i[G.id];he===void 0&&(he={},i[G.id]=he);const ne=z.isInstancedMesh===!0?z.id:0;let ee=he[ne];ee===void 0&&(ee={},he[ne]=ee);let K=ee[$.id];K===void 0&&(K={},ee[$.id]=K);let Z=K[Q];return Z===void 0&&(Z=g(h()),K[Q]=Z),Z}function g(z){const G=[],$=[],H=[];for(let Q=0;Q<t;Q++)G[Q]=0,$[Q]=0,H[Q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:G,enabledAttributes:$,attributeDivisors:H,object:z,attributes:{},index:null}}function y(z,G,$,H){const Q=l.attributes,he=G.attributes;let ne=0;const ee=$.getAttributes();for(const K in ee)if(ee[K].location>=0){const O=Q[K];let se=he[K];if(se===void 0&&(K==="instanceMatrix"&&z.instanceMatrix&&(se=z.instanceMatrix),K==="instanceColor"&&z.instanceColor&&(se=z.instanceColor)),O===void 0||O.attribute!==se||se&&O.data!==se.data)return!0;ne++}return l.attributesNum!==ne||l.index!==H}function M(z,G,$,H){const Q={},he=G.attributes;let ne=0;const ee=$.getAttributes();for(const K in ee)if(ee[K].location>=0){let O=he[K];O===void 0&&(K==="instanceMatrix"&&z.instanceMatrix&&(O=z.instanceMatrix),K==="instanceColor"&&z.instanceColor&&(O=z.instanceColor));const se={};se.attribute=O,O&&O.data&&(se.data=O.data),Q[K]=se,ne++}l.attributes=Q,l.attributesNum=ne,l.index=H}function T(){const z=l.newAttributes;for(let G=0,$=z.length;G<$;G++)z[G]=0}function S(z){x(z,0)}function x(z,G){const $=l.newAttributes,H=l.enabledAttributes,Q=l.attributeDivisors;$[z]=1,H[z]===0&&(s.enableVertexAttribArray(z),H[z]=1),Q[z]!==G&&(s.vertexAttribDivisor(z,G),Q[z]=G)}function C(){const z=l.newAttributes,G=l.enabledAttributes;for(let $=0,H=G.length;$<H;$++)G[$]!==z[$]&&(s.disableVertexAttribArray($),G[$]=0)}function I(z,G,$,H,Q,he,ne){ne===!0?s.vertexAttribIPointer(z,G,$,Q,he):s.vertexAttribPointer(z,G,$,H,Q,he)}function w(z,G,$,H){T();const Q=H.attributes,he=$.getAttributes(),ne=G.defaultAttributeValues;for(const ee in he){const K=he[ee];if(K.location>=0){let Z=Q[ee];if(Z===void 0&&(ee==="instanceMatrix"&&z.instanceMatrix&&(Z=z.instanceMatrix),ee==="instanceColor"&&z.instanceColor&&(Z=z.instanceColor)),Z!==void 0){const O=Z.normalized,se=Z.itemSize,Se=e.get(Z);if(Se===void 0)continue;const Ge=Se.buffer,ze=Se.type,Ve=Se.bytesPerElement,ae=ze===s.INT||ze===s.UNSIGNED_INT||Z.gpuType===Bf;if(Z.isInterleavedBufferAttribute){const de=Z.data,Ee=de.stride,$e=Z.offset;if(de.isInstancedInterleavedBuffer){for(let Oe=0;Oe<K.locationSize;Oe++)x(K.location+Oe,de.meshPerAttribute);z.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=de.meshPerAttribute*de.count)}else for(let Oe=0;Oe<K.locationSize;Oe++)S(K.location+Oe);s.bindBuffer(s.ARRAY_BUFFER,Ge);for(let Oe=0;Oe<K.locationSize;Oe++)I(K.location+Oe,se/K.locationSize,ze,O,Ee*Ve,($e+se/K.locationSize*Oe)*Ve,ae)}else{if(Z.isInstancedBufferAttribute){for(let de=0;de<K.locationSize;de++)x(K.location+de,Z.meshPerAttribute);z.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let de=0;de<K.locationSize;de++)S(K.location+de);s.bindBuffer(s.ARRAY_BUFFER,Ge);for(let de=0;de<K.locationSize;de++)I(K.location+de,se/K.locationSize,ze,O,se*Ve,se/K.locationSize*de*Ve,ae)}}else if(ne!==void 0){const O=ne[ee];if(O!==void 0)switch(O.length){case 2:s.vertexAttrib2fv(K.location,O);break;case 3:s.vertexAttrib3fv(K.location,O);break;case 4:s.vertexAttrib4fv(K.location,O);break;default:s.vertexAttrib1fv(K.location,O)}}}}C()}function R(){D();for(const z in i){const G=i[z];for(const $ in G){const H=G[$];for(const Q in H){const he=H[Q];for(const ne in he)_(he[ne].object),delete he[ne];delete H[Q]}}delete i[z]}}function P(z){if(i[z.id]===void 0)return;const G=i[z.id];for(const $ in G){const H=G[$];for(const Q in H){const he=H[Q];for(const ne in he)_(he[ne].object),delete he[ne];delete H[Q]}}delete i[z.id]}function U(z){for(const G in i){const $=i[G];for(const H in $){const Q=$[H];if(Q[z.id]===void 0)continue;const he=Q[z.id];for(const ne in he)_(he[ne].object),delete he[ne];delete Q[z.id]}}}function A(z){for(const G in i){const $=i[G],H=z.isInstancedMesh===!0?z.id:0,Q=$[H];if(Q!==void 0){for(const he in Q){const ne=Q[he];for(const ee in ne)_(ne[ee].object),delete ne[ee];delete Q[he]}delete $[H],Object.keys($).length===0&&delete i[G]}}}function D(){k(),c=!0,l!==a&&(l=a,f(l.object))}function k(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:d,reset:D,resetDefaultState:k,dispose:R,releaseStatesOfGeometry:P,releaseStatesOfObject:A,releaseStatesOfProgram:U,initAttributes:T,enableAttribute:S,disableUnusedAttributes:C}}function nb(s,e,t){let i;function a(h){i=h}function l(h,f){s.drawArrays(i,h,f),t.update(f,i,1)}function c(h,f,_){_!==0&&(s.drawArraysInstanced(i,h,f,_),t.update(f,i,_))}function d(h,f,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,h,0,f,0,_);let g=0;for(let y=0;y<_;y++)g+=f[y];t.update(g,i,1)}this.setMode=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=d}function ib(s,e,t,i){let a;function l(){if(a!==void 0)return a;if(e.has("EXT_texture_filter_anisotropic")===!0){const U=e.get("EXT_texture_filter_anisotropic");a=s.getParameter(U.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function c(U){return!(U!==qi&&i.convert(U)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function d(U){const A=U===ur&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(U!==mi&&U!==Xi&&!A&&i.convert(U)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE))}function h(U){if(U==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";U="mediump"}return U==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let f=t.precision!==void 0?t.precision:"highp";const _=h(f);_!==f&&(ot("WebGLRenderer:",f,"not supported, using",_,"instead."),f=_);const m=t.logarithmicDepthBuffer===!0,g=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&g===!1&&ot("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const y=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),M=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),T=s.getParameter(s.MAX_TEXTURE_SIZE),S=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),x=s.getParameter(s.MAX_VERTEX_ATTRIBS),C=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),I=s.getParameter(s.MAX_VARYING_VECTORS),w=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),R=s.getParameter(s.MAX_SAMPLES),P=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:l,getMaxPrecision:h,textureFormatReadable:c,textureTypeReadable:d,precision:f,logarithmicDepthBuffer:m,reversedDepthBuffer:g,maxTextures:y,maxVertexTextures:M,maxTextureSize:T,maxCubemapSize:S,maxAttributes:x,maxVertexUniforms:C,maxVaryings:I,maxFragmentUniforms:w,maxSamples:R,samples:P}}function rb(s){const e=this;let t=null,i=0,a=!1,l=!1;const c=new Rr,d=new mt,h={value:null,needsUpdate:!1};this.uniform=h,this.numPlanes=0,this.numIntersection=0,this.init=function(m,g){const y=m.length!==0||g||i!==0||a;return a=g,i=m.length,y},this.beginShadows=function(){l=!0,_(null)},this.endShadows=function(){l=!1},this.setGlobalState=function(m,g){t=_(m,g,0)},this.setState=function(m,g,y){const M=m.clippingPlanes,T=m.clipIntersection,S=m.clipShadows,x=s.get(m);if(!a||M===null||M.length===0||l&&!S)l?_(null):f();else{const C=l?0:i,I=C*4;let w=x.clippingState||null;h.value=w,w=_(M,g,I,y);for(let R=0;R!==I;++R)w[R]=t[R];x.clippingState=w,this.numIntersection=T?this.numPlanes:0,this.numPlanes+=C}};function f(){h.value!==t&&(h.value=t,h.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function _(m,g,y,M){const T=m!==null?m.length:0;let S=null;if(T!==0){if(S=h.value,M!==!0||S===null){const x=y+T*4,C=g.matrixWorldInverse;d.getNormalMatrix(C),(S===null||S.length<x)&&(S=new Float32Array(x));for(let I=0,w=y;I!==T;++I,w+=4)c.copy(m[I]).applyMatrix4(C,d),c.normal.toArray(S,w),S[w+3]=c.constant}h.value=S,h.needsUpdate=!0}return e.numPlanes=T,e.numIntersection=0,S}}const Ba=4,sb=6,ab=20,ob=256,Ko=new np,kg=new ht;let Dh=null,Ih=0,Uh=0,Oh=!1;const lb=new X,Fs=new X;class Bg{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,a=100,l={}){const{size:c=256,position:d=lb}=l;Dh=this._renderer.getRenderTarget(),Ih=this._renderer.getActiveCubeFace(),Uh=this._renderer.getActiveMipmapLevel(),Oh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(c);const h=this._allocateTargets();return h.depthBuffer=!0,this._sceneToCubeUV(e,i,a,h,d),t>0&&this._blur(h,0,0,t),this._applyPMREM(h),this._cleanup(h),h}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Vg(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Hg(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Dh,Ih,Uh),this._renderer.xr.enabled=Oh,e.scissorTest=!1,Oa(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ys||e.mapping===Ja?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Dh=this._renderer.getRenderTarget(),Ih=this._renderer.getActiveCubeFace(),Uh=this._renderer.getActiveMipmapLevel(),Oh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Vn,minFilter:Vn,generateMipmaps:!1,type:ur,format:qi,colorSpace:ou,depthBuffer:!1},a=zg(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=zg(e,t,i);const{_lodMax:l}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=cb(l)),this._blurMaterial=db(l,e,t),this._ggxMaterial=ub(l,e,t)}return a}_compileMaterial(e){const t=new dt(new Sn,e);this._renderer.compile(t,Ko)}_sceneToCubeUV(e,t,i,a,l){const h=new pi(90,1,t,i),f=[1,-1,1,1,1,1],_=[1,1,1,-1,-1,-1],m=this._renderer,g=m.autoClear,y=m.toneMapping;m.getClearColor(kg),m.toneMapping=or,m.autoClear=!1,m.state.buffers.depth.getReversed()&&(m.setRenderTarget(a),m.clearDepth(),m.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new dt(new dn,new Nn({name:"PMREM.Background",side:si,depthWrite:!1,depthTest:!1})));const T=this._backgroundBox,S=T.material;let x=!1;const C=e.background;C?C.isColor&&(S.color.copy(C),e.background=null,x=!0):(S.color.copy(kg),x=!0);for(let I=0;I<6;I++){const w=I%3;w===0?(h.up.set(0,f[I],0),h.position.set(l.x,l.y,l.z),h.lookAt(l.x+_[I],l.y,l.z)):w===1?(h.up.set(0,0,f[I]),h.position.set(l.x,l.y,l.z),h.lookAt(l.x,l.y+_[I],l.z)):(h.up.set(0,f[I],0),h.position.set(l.x,l.y,l.z),h.lookAt(l.x,l.y,l.z+_[I]));const R=this._cubeSize;Oa(a,w*R,I>2?R:0,R,R),m.setRenderTarget(a),x&&m.render(T,h),m.render(e,h)}m.toneMapping=y,m.autoClear=g,e.background=C}_textureToCubeUV(e,t){const i=this._renderer,a=e.mapping===Ys||e.mapping===Ja;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=Vg()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Hg());const l=a?this._cubemapMaterial:this._equirectMaterial,c=this._lodMeshes[0];c.material=l;const d=l.uniforms;d.envMap.value=e;const h=this._cubeSize;Oa(t,0,0,3*h,2*h),i.setRenderTarget(t),i.render(c,Ko)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const a=this._lodMeshes.length;for(let l=1;l<a;l++)this._applyGGXFilter(e,l-1,l);t.autoClear=i}_applyGGXFilter(e,t,i){const a=this._renderer,l=this._pingPongRenderTarget,c=this._ggxMaterial,d=this._lodMeshes[i];d.material=c;const h=c.uniforms,f=i/(this._lodMeshes.length-1),_=t/(this._lodMeshes.length-1),m=Math.sqrt(f*f-_*_),g=f*1.25,y=m*g,{_lodMax:M}=this,T=this._sizeLods[i],S=3*T*(i>M-Ba?i-M+Ba:0),x=4*(this._cubeSize-T);h.envMap.value=e.texture,h.roughness.value=y,h.mipInt.value=M-t,Oa(l,S,x,3*T,2*T),a.setRenderTarget(l),a.render(d,Ko),h.envMap.value=l.texture,h.roughness.value=0,h.mipInt.value=M-i,Oa(e,S,x,3*T,2*T),a.setRenderTarget(e),a.render(d,Ko)}_blur(e,t,i,a){const l=this._pingPongRenderTarget,c=Math.min(a,Math.PI)/Math.SQRT2;this._blurPass(e,l,t,i,c),this._blurPass(l,e,i,i,c)}_blurPass(e,t,i,a,l){const c=this._renderer,d=this._blurMaterial,h=this._lodMeshes[a];h.material=d;const f=d.uniforms;f.envMap.value=e.texture,f.sigma.value=l,f.mipInt.value=this._lodMax-i;const _=this._sizeLods[a],m=3*_*(a>this._lodMax-Ba?a-this._lodMax+Ba:0),g=4*(this._cubeSize-_);Oa(t,m,g,3*_,2*_),c.setRenderTarget(t),c.render(h,Ko)}}function cb(s){const e=[],t=[];let i=s;const a=s-Ba+1+sb;for(let l=0;l<a;l++){const c=Math.pow(2,i);e.push(c);const d=1/(c-2),h=-d,f=1+d,_=[h,h,f,h,f,f,h,h,f,f,h,f],m=6,g=6,y=3,M=new Float32Array(y*g*m),T=new Float32Array(y*g*m);for(let x=0;x<m;x++){const C=x%3*2/3-1,I=x>2?0:-1,w=[C,I,0,C+2/3,I,0,C+2/3,I+1,0,C,I,0,C+2/3,I+1,0,C,I+1,0];M.set(w,y*g*x);for(let R=0;R<g;R++){const P=_[R*2]*2-1,U=_[R*2+1]*2-1;x===0?Fs.set(1,U,P):x===1?Fs.set(-P,1,-U):x===2?Fs.set(-P,U,1):x===3?Fs.set(-1,U,-P):x===4?Fs.set(-P,-1,U):Fs.set(P,U,-1),Fs.toArray(T,(x*g+R)*y)}}const S=new Sn;S.setAttribute("position",new lr(M,y)),S.setAttribute("outputDirection",new lr(T,y)),t.push(new dt(S,null)),i>Ba&&i--}return{lodMeshes:t,sizeLods:e}}function zg(s,e,t){const i=new $i(s,e,t);return i.texture.mapping=mu,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Oa(s,e,t,i,a){s.viewport.set(e,t,i,a),s.scissor.set(e,t,i,a)}function ub(s,e,t){return new hr({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:ob,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:xu(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Lr,depthTest:!1,depthWrite:!1})}function db(s,e,t){return new hr({name:"SphericalGaussianBlur",defines:{SAMPLES:ab,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:xu(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:Lr,depthTest:!1,depthWrite:!1})}function Hg(){return new hr({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:xu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Lr,depthTest:!1,depthWrite:!1})}function Vg(){return new hr({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:xu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Lr,depthTest:!1,depthWrite:!1})}function xu(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}class ux extends $i{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},a=[i,i,i,i,i,i];this.texture=new ix(a),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},a=new dn(5,5,5),l=new hr({name:"CubemapFromEquirect",uniforms:eo(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:si,blending:Lr});l.uniforms.tEquirect.value=t;const c=new dt(a,l),d=t.minFilter;return t.minFilter===ks&&(t.minFilter=Vn),new p1(1,10,this).update(e,c),t.minFilter=d,c.geometry.dispose(),c.material.dispose(),this}clear(e,t=!0,i=!0,a=!0){const l=e.getRenderTarget();for(let c=0;c<6;c++)e.setRenderTarget(this,c),e.clear(t,i,a);e.setRenderTarget(l)}}function hb(s){let e=new WeakMap,t=new WeakMap,i=null;function a(g,y=!1){return g==null?null:y?c(g):l(g)}function l(g){if(g&&g.isTexture){const y=g.mapping;if(y===sh||y===ah)if(e.has(g)){const M=e.get(g).texture;return d(M,g.mapping)}else{const M=g.image;if(M&&M.height>0){const T=new ux(M.height);return T.fromEquirectangularTexture(s,g),e.set(g,T),g.addEventListener("dispose",f),d(T.texture,g.mapping)}else return null}}return g}function c(g){if(g&&g.isTexture){const y=g.mapping,M=y===sh||y===ah,T=y===Ys||y===Ja;if(M||T){let S=t.get(g);const x=S!==void 0?S.texture.pmremVersion:0;if(g.isRenderTargetTexture&&g.pmremVersion!==x)return i===null&&(i=new Bg(s)),S=M?i.fromEquirectangular(g,S):i.fromCubemap(g,S),S.texture.pmremVersion=g.pmremVersion,t.set(g,S),S.texture;if(S!==void 0)return S.texture;{const C=g.image;return M&&C&&C.height>0||T&&C&&h(C)?(i===null&&(i=new Bg(s)),S=M?i.fromEquirectangular(g):i.fromCubemap(g),S.texture.pmremVersion=g.pmremVersion,t.set(g,S),g.addEventListener("dispose",_),S.texture):null}}}return g}function d(g,y){return y===sh?g.mapping=Ys:y===ah&&(g.mapping=Ja),g}function h(g){let y=0;const M=6;for(let T=0;T<M;T++)g[T]!==void 0&&y++;return y===M}function f(g){const y=g.target;y.removeEventListener("dispose",f);const M=e.get(y);M!==void 0&&(e.delete(y),M.dispose())}function _(g){const y=g.target;y.removeEventListener("dispose",_);const M=t.get(y);M!==void 0&&(t.delete(y),M.dispose())}function m(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:a,dispose:m}}function fb(s){const e={};function t(i){if(e[i]!==void 0)return e[i];const a=s.getExtension(i);return e[i]=a,a}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const a=t(i);return a===null&&Ha("WebGLRenderer: "+i+" extension not supported."),a}}}function pb(s,e,t,i){const a={},l=new WeakMap;function c(m){const g=m.target;g.index!==null&&e.remove(g.index);for(const M in g.attributes)e.remove(g.attributes[M]);g.removeEventListener("dispose",c),delete a[g.id];const y=l.get(g);y&&(e.remove(y),l.delete(g)),i.releaseStatesOfGeometry(g),g.isInstancedBufferGeometry===!0&&delete g._maxInstanceCount,t.memory.geometries--}function d(m,g){return a[g.id]===!0||(g.addEventListener("dispose",c),a[g.id]=!0,t.memory.geometries++),g}function h(m){const g=m.attributes;for(const y in g)e.update(g[y],s.ARRAY_BUFFER)}function f(m){const g=[],y=m.index,M=m.attributes.position;let T=0;if(M===void 0)return;if(y!==null){const C=y.array;T=y.version;for(let I=0,w=C.length;I<w;I+=3){const R=C[I+0],P=C[I+1],U=C[I+2];g.push(R,P,P,U,U,R)}}else{const C=M.array;T=M.version;for(let I=0,w=C.length/3-1;I<w;I+=3){const R=I+0,P=I+1,U=I+2;g.push(R,P,P,U,U,R)}}const S=new(M.count>=65535?tx:ex)(g,1);S.version=T;const x=l.get(m);x&&e.remove(x),l.set(m,S)}function _(m){const g=l.get(m);if(g){const y=m.index;y!==null&&g.version<y.version&&f(m)}else f(m);return l.get(m)}return{get:d,update:h,getWireframeAttribute:_}}function mb(s,e,t){let i;function a(m){i=m}let l,c;function d(m){l=m.type,c=m.bytesPerElement}function h(m,g){s.drawElements(i,g,l,m*c),t.update(g,i,1)}function f(m,g,y){y!==0&&(s.drawElementsInstanced(i,g,l,m*c,y),t.update(g,i,y))}function _(m,g,y){if(y===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,g,0,l,m,0,y);let T=0;for(let S=0;S<y;S++)T+=g[S];t.update(T,i,1)}this.setMode=a,this.setIndex=d,this.render=h,this.renderInstances=f,this.renderMultiDraw=_}function gb(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(l,c,d){switch(t.calls++,c){case s.TRIANGLES:t.triangles+=d*(l/3);break;case s.LINES:t.lines+=d*(l/2);break;case s.LINE_STRIP:t.lines+=d*(l-1);break;case s.LINE_LOOP:t.lines+=d*l;break;case s.POINTS:t.points+=d*l;break;default:Ut("WebGLInfo: Unknown draw mode:",c);break}}function a(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:a,update:i}}function _b(s,e,t){const i=new WeakMap,a=new sn;function l(c,d,h){const f=c.morphTargetInfluences,_=d.morphAttributes.position||d.morphAttributes.normal||d.morphAttributes.color,m=_!==void 0?_.length:0;let g=i.get(d);if(g===void 0||g.count!==m){let k=function(){A.dispose(),i.delete(d),d.removeEventListener("dispose",k)};var y=k;g!==void 0&&g.texture.dispose();const M=d.morphAttributes.position!==void 0,T=d.morphAttributes.normal!==void 0,S=d.morphAttributes.color!==void 0,x=d.morphAttributes.position||[],C=d.morphAttributes.normal||[],I=d.morphAttributes.color||[];let w=0;M===!0&&(w=1),T===!0&&(w=2),S===!0&&(w=3);let R=d.attributes.position.count*w,P=1;R>e.maxTextureSize&&(P=Math.ceil(R/e.maxTextureSize),R=e.maxTextureSize);const U=new Float32Array(R*P*4*m),A=new Z_(U,R,P,m);A.type=Xi,A.needsUpdate=!0;const D=w*4;for(let z=0;z<m;z++){const G=x[z],$=C[z],H=I[z],Q=R*P*4*z;for(let he=0;he<G.count;he++){const ne=he*D;M===!0&&(a.fromBufferAttribute(G,he),U[Q+ne+0]=a.x,U[Q+ne+1]=a.y,U[Q+ne+2]=a.z,U[Q+ne+3]=0),T===!0&&(a.fromBufferAttribute($,he),U[Q+ne+4]=a.x,U[Q+ne+5]=a.y,U[Q+ne+6]=a.z,U[Q+ne+7]=0),S===!0&&(a.fromBufferAttribute(H,he),U[Q+ne+8]=a.x,U[Q+ne+9]=a.y,U[Q+ne+10]=a.z,U[Q+ne+11]=H.itemSize===4?a.w:1)}}g={count:m,texture:A,size:new lt(R,P)},i.set(d,g),d.addEventListener("dispose",k)}if(c.isInstancedMesh===!0&&c.morphTexture!==null)h.getUniforms().setValue(s,"morphTexture",c.morphTexture,t);else{let M=0;for(let S=0;S<f.length;S++)M+=f[S];const T=d.morphTargetsRelative?1:1-M;h.getUniforms().setValue(s,"morphTargetBaseInfluence",T),h.getUniforms().setValue(s,"morphTargetInfluences",f)}h.getUniforms().setValue(s,"morphTargetsTexture",g.texture,t),h.getUniforms().setValue(s,"morphTargetsTextureSize",g.size)}return{update:l}}function xb(s,e,t,i,a){let l=new WeakMap;function c(f){const _=a.render.frame,m=f.geometry,g=e.get(f,m);if(l.get(g)!==_&&(e.update(g),l.set(g,_)),f.isInstancedMesh&&(f.hasEventListener("dispose",h)===!1&&f.addEventListener("dispose",h),l.get(f)!==_&&(t.update(f.instanceMatrix,s.ARRAY_BUFFER),f.instanceColor!==null&&t.update(f.instanceColor,s.ARRAY_BUFFER),l.set(f,_))),f.isSkinnedMesh){const y=f.skeleton;l.get(y)!==_&&(y.update(),l.set(y,_))}return g}function d(){l=new WeakMap}function h(f){const _=f.target;_.removeEventListener("dispose",h),i.releaseStatesOfObject(_),t.remove(_.instanceMatrix),_.instanceColor!==null&&t.remove(_.instanceColor)}return{update:c,dispose:d}}const vb={[O_]:"LINEAR_TONE_MAPPING",[F_]:"REINHARD_TONE_MAPPING",[k_]:"CINEON_TONE_MAPPING",[B_]:"ACES_FILMIC_TONE_MAPPING",[H_]:"AGX_TONE_MAPPING",[V_]:"NEUTRAL_TONE_MAPPING",[z_]:"CUSTOM_TONE_MAPPING"};function yb(s,e,t,i,a,l){const c=new $i(e,t,{type:s,depthBuffer:a,stencilBuffer:l,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let d=null,h=null;const f=new Sn;f.setAttribute("position",new kt([-1,3,0,-1,-1,0,3,-1,0],3)),f.setAttribute("uv",new kt([0,2,0,0,2,0],2));const _=new e1({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),m=new dt(f,_),g=new np(-1,1,1,-1,0,1);let y=null,M=null,T=!1,S,x=null,C=[],I=!1;this.setSize=function(w,R){c.setSize(w,R),d!==null&&d.setSize(w,R),h!==null&&h.setSize(w,R);for(let P=0;P<C.length;P++){const U=C[P];U.setSize&&U.setSize(w,R)}},this.setEffects=function(w){C=w,I=C.length>0&&C[0].isRenderPass===!0;const R=c.width,P=c.height;C.length>0&&d===null&&(d=new $i(R,P,{type:ur,depthBuffer:!1,stencilBuffer:!1}),h=new $i(R,P,{type:ur,depthBuffer:!1,stencilBuffer:!1}));for(let U=0;U<C.length;U++){const A=C[U];A.setSize&&A.setSize(R,P)}},this.begin=function(w,R){if(T||w.toneMapping===or&&C.length===0)return!1;if(x=R,R!==null){const P=R.width,U=R.height;(c.width!==P||c.height!==U)&&this.setSize(P,U)}return I===!1&&w.setRenderTarget(c),S=w.toneMapping,w.toneMapping=or,!0},this.hasRenderPass=function(){return I},this.end=function(w,R){w.toneMapping=S,T=!0;let P=c,U=d;for(let A=0;A<C.length;A++){const D=C[A];D.enabled!==!1&&(D.render(w,U,P,R),D.needsSwap!==!1&&(P=U,U=U===d?h:d))}if(y!==w.outputColorSpace||M!==w.toneMapping){y=w.outputColorSpace,M=w.toneMapping,_.defines={},At.getTransfer(y)===zt&&(_.defines.SRGB_TRANSFER="");const A=vb[M];A&&(_.defines[A]=""),_.needsUpdate=!0}_.uniforms.tDiffuse.value=P.texture,w.setRenderTarget(x),w.render(m,g),x=null,T=!1},this.isCompositing=function(){return T},this.dispose=function(){c.dispose(),d!==null&&d.dispose(),h!==null&&h.dispose(),f.dispose(),_.dispose()}}const dx=new Kn,Nf=new cl(1,1),hx=new Z_,fx=new PM,px=new ix,Gg=[],Wg=[],jg=new Float32Array(16),Xg=new Float32Array(9),qg=new Float32Array(4);function to(s,e,t){const i=s[0];if(i<=0||i>0)return s;const a=e*t;let l=Gg[a];if(l===void 0&&(l=new Float32Array(a),Gg[a]=l),e!==0){i.toArray(l,0);for(let c=1,d=0;c!==e;++c)d+=t,s[c].toArray(l,d)}return l}function Mn(s,e){if(s.length!==e.length)return!1;for(let t=0,i=s.length;t<i;t++)if(s[t]!==e[t])return!1;return!0}function En(s,e){for(let t=0,i=e.length;t<i;t++)s[t]=e[t]}function vu(s,e){let t=Wg[e];t===void 0&&(t=new Int32Array(e),Wg[e]=t);for(let i=0;i!==e;++i)t[i]=s.allocateTextureUnit();return t}function Sb(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function Mb(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Mn(t,e))return;s.uniform2fv(this.addr,e),En(t,e)}}function Eb(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Mn(t,e))return;s.uniform3fv(this.addr,e),En(t,e)}}function wb(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Mn(t,e))return;s.uniform4fv(this.addr,e),En(t,e)}}function bb(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(Mn(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),En(t,e)}else{if(Mn(t,i))return;qg.set(i),s.uniformMatrix2fv(this.addr,!1,qg),En(t,i)}}function Tb(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(Mn(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),En(t,e)}else{if(Mn(t,i))return;Xg.set(i),s.uniformMatrix3fv(this.addr,!1,Xg),En(t,i)}}function Ab(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(Mn(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),En(t,e)}else{if(Mn(t,i))return;jg.set(i),s.uniformMatrix4fv(this.addr,!1,jg),En(t,i)}}function Cb(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function Rb(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Mn(t,e))return;s.uniform2iv(this.addr,e),En(t,e)}}function Pb(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Mn(t,e))return;s.uniform3iv(this.addr,e),En(t,e)}}function Nb(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Mn(t,e))return;s.uniform4iv(this.addr,e),En(t,e)}}function Lb(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function Db(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Mn(t,e))return;s.uniform2uiv(this.addr,e),En(t,e)}}function Ib(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Mn(t,e))return;s.uniform3uiv(this.addr,e),En(t,e)}}function Ub(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Mn(t,e))return;s.uniform4uiv(this.addr,e),En(t,e)}}function Ob(s,e,t){const i=this.cache,a=t.allocateTextureUnit();i[0]!==a&&(s.uniform1i(this.addr,a),i[0]=a);let l;this.type===s.SAMPLER_2D_SHADOW?(Nf.compareFunction=t.isReversedDepthBuffer()?qf:Xf,l=Nf):l=dx,t.setTexture2D(e||l,a)}function Fb(s,e,t){const i=this.cache,a=t.allocateTextureUnit();i[0]!==a&&(s.uniform1i(this.addr,a),i[0]=a),t.setTexture3D(e||fx,a)}function kb(s,e,t){const i=this.cache,a=t.allocateTextureUnit();i[0]!==a&&(s.uniform1i(this.addr,a),i[0]=a),t.setTextureCube(e||px,a)}function Bb(s,e,t){const i=this.cache,a=t.allocateTextureUnit();i[0]!==a&&(s.uniform1i(this.addr,a),i[0]=a),t.setTexture2DArray(e||hx,a)}function zb(s){switch(s){case 5126:return Sb;case 35664:return Mb;case 35665:return Eb;case 35666:return wb;case 35674:return bb;case 35675:return Tb;case 35676:return Ab;case 5124:case 35670:return Cb;case 35667:case 35671:return Rb;case 35668:case 35672:return Pb;case 35669:case 35673:return Nb;case 5125:return Lb;case 36294:return Db;case 36295:return Ib;case 36296:return Ub;case 35678:case 36198:case 36298:case 36306:case 35682:return Ob;case 35679:case 36299:case 36307:return Fb;case 35680:case 36300:case 36308:case 36293:return kb;case 36289:case 36303:case 36311:case 36292:return Bb}}function Hb(s,e){s.uniform1fv(this.addr,e)}function Vb(s,e){const t=to(e,this.size,2);s.uniform2fv(this.addr,t)}function Gb(s,e){const t=to(e,this.size,3);s.uniform3fv(this.addr,t)}function Wb(s,e){const t=to(e,this.size,4);s.uniform4fv(this.addr,t)}function jb(s,e){const t=to(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function Xb(s,e){const t=to(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function qb(s,e){const t=to(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function Yb(s,e){s.uniform1iv(this.addr,e)}function $b(s,e){s.uniform2iv(this.addr,e)}function Kb(s,e){s.uniform3iv(this.addr,e)}function Zb(s,e){s.uniform4iv(this.addr,e)}function Qb(s,e){s.uniform1uiv(this.addr,e)}function Jb(s,e){s.uniform2uiv(this.addr,e)}function eT(s,e){s.uniform3uiv(this.addr,e)}function tT(s,e){s.uniform4uiv(this.addr,e)}function nT(s,e,t){const i=this.cache,a=e.length,l=vu(t,a);Mn(i,l)||(s.uniform1iv(this.addr,l),En(i,l));let c;this.type===s.SAMPLER_2D_SHADOW?c=Nf:c=dx;for(let d=0;d!==a;++d)t.setTexture2D(e[d]||c,l[d])}function iT(s,e,t){const i=this.cache,a=e.length,l=vu(t,a);Mn(i,l)||(s.uniform1iv(this.addr,l),En(i,l));for(let c=0;c!==a;++c)t.setTexture3D(e[c]||fx,l[c])}function rT(s,e,t){const i=this.cache,a=e.length,l=vu(t,a);Mn(i,l)||(s.uniform1iv(this.addr,l),En(i,l));for(let c=0;c!==a;++c)t.setTextureCube(e[c]||px,l[c])}function sT(s,e,t){const i=this.cache,a=e.length,l=vu(t,a);Mn(i,l)||(s.uniform1iv(this.addr,l),En(i,l));for(let c=0;c!==a;++c)t.setTexture2DArray(e[c]||hx,l[c])}function aT(s){switch(s){case 5126:return Hb;case 35664:return Vb;case 35665:return Gb;case 35666:return Wb;case 35674:return jb;case 35675:return Xb;case 35676:return qb;case 5124:case 35670:return Yb;case 35667:case 35671:return $b;case 35668:case 35672:return Kb;case 35669:case 35673:return Zb;case 5125:return Qb;case 36294:return Jb;case 36295:return eT;case 36296:return tT;case 35678:case 36198:case 36298:case 36306:case 35682:return nT;case 35679:case 36299:case 36307:return iT;case 35680:case 36300:case 36308:case 36293:return rT;case 36289:case 36303:case 36311:case 36292:return sT}}class oT{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=zb(t.type)}}class lT{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=aT(t.type)}}class cT{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const a=this.seq;for(let l=0,c=a.length;l!==c;++l){const d=a[l];d.setValue(e,t[d.id],i)}}}const Fh=/(\w+)(\])?(\[|\.)?/g;function Yg(s,e){s.seq.push(e),s.map[e.id]=e}function uT(s,e,t){const i=s.name,a=i.length;for(Fh.lastIndex=0;;){const l=Fh.exec(i),c=Fh.lastIndex;let d=l[1];const h=l[2]==="]",f=l[3];if(h&&(d=d|0),f===void 0||f==="["&&c+2===a){Yg(t,f===void 0?new oT(d,s,e):new lT(d,s,e));break}else{let m=t.map[d];m===void 0&&(m=new cT(d),Yg(t,m)),t=m}}}class tu{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let c=0;c<i;++c){const d=e.getActiveUniform(t,c),h=e.getUniformLocation(t,d.name);uT(d,h,this)}const a=[],l=[];for(const c of this.seq)c.type===e.SAMPLER_2D_SHADOW||c.type===e.SAMPLER_CUBE_SHADOW||c.type===e.SAMPLER_2D_ARRAY_SHADOW?a.push(c):l.push(c);a.length>0&&(this.seq=a.concat(l))}setValue(e,t,i,a){const l=this.map[t];l!==void 0&&l.setValue(e,i,a)}setOptional(e,t,i){const a=t[i];a!==void 0&&this.setValue(e,i,a)}static upload(e,t,i,a){for(let l=0,c=t.length;l!==c;++l){const d=t[l],h=i[d.id];h.needsUpdate!==!1&&d.setValue(e,h.value,a)}}static seqWithValue(e,t){const i=[];for(let a=0,l=e.length;a!==l;++a){const c=e[a];c.id in t&&i.push(c)}return i}}function $g(s,e,t){const i=s.createShader(e);return s.shaderSource(i,t),s.compileShader(i),i}const dT=37297;let hT=0;function fT(s,e){const t=s.split(`
`),i=[],a=Math.max(e-6,0),l=Math.min(e+6,t.length);for(let c=a;c<l;c++){const d=c+1;i.push(`${d===e?">":" "} ${d}: ${t[c]}`)}return i.join(`
`)}const Kg=new mt;function pT(s){At._getMatrix(Kg,At.workingColorSpace,s);const e=`mat3( ${Kg.elements.map(t=>t.toFixed(4))} )`;switch(At.getTransfer(s)){case lu:return[e,"LinearTransferOETF"];case zt:return[e,"sRGBTransferOETF"];default:return ot("WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function Zg(s,e,t){const i=s.getShaderParameter(e,s.COMPILE_STATUS),l=(s.getShaderInfoLog(e)||"").trim();if(i&&l==="")return"";const c=/ERROR: 0:(\d+)/.exec(l);if(c){const d=parseInt(c[1]);return t.toUpperCase()+`

`+l+`

`+fT(s.getShaderSource(e),d)}else return l}function mT(s,e){const t=pT(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const gT={[O_]:"Linear",[F_]:"Reinhard",[k_]:"Cineon",[B_]:"ACESFilmic",[H_]:"AgX",[V_]:"Neutral",[z_]:"Custom"};function _T(s,e){const t=gT[e];return t===void 0?(ot("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Xc=new X;function xT(){At.getLuminanceCoefficients(Xc);const s=Xc.x.toFixed(4),e=Xc.y.toFixed(4),t=Xc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function vT(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(el).join(`
`)}function yT(s){const e=[];for(const t in s){const i=s[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function ST(s,e){const t={},i=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let a=0;a<i;a++){const l=s.getActiveAttrib(e,a),c=l.name;let d=1;l.type===s.FLOAT_MAT2&&(d=2),l.type===s.FLOAT_MAT3&&(d=3),l.type===s.FLOAT_MAT4&&(d=4),t[c]={type:l.type,location:s.getAttribLocation(e,c),locationSize:d}}return t}function el(s){return s!==""}function Qg(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Jg(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const MT=/^[ \t]*#include +<([\w\d./]+)>/gm;function Lf(s){return s.replace(MT,wT)}const ET=new Map;function wT(s,e){let t=yt[e];if(t===void 0){const i=ET.get(e);if(i!==void 0)t=yt[i],ot('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Lf(t)}const bT=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function e_(s){return s.replace(bT,TT)}function TT(s,e,t,i){let a="";for(let l=parseInt(e);l<parseInt(t);l++)a+=i.replace(/\[\s*i\s*\]/g,"[ "+l+" ]").replace(/UNROLLED_LOOP_INDEX/g,l);return a}function t_(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const AT={[$c]:"SHADOWMAP_TYPE_PCF",[Qo]:"SHADOWMAP_TYPE_VSM"};function CT(s){return AT[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const RT={[Ys]:"ENVMAP_TYPE_CUBE",[Ja]:"ENVMAP_TYPE_CUBE",[mu]:"ENVMAP_TYPE_CUBE_UV"};function PT(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":RT[s.envMapMode]||"ENVMAP_TYPE_CUBE"}const NT={[Ja]:"ENVMAP_MODE_REFRACTION"};function LT(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":NT[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}const DT={[kf]:"ENVMAP_BLENDING_MULTIPLY",[aM]:"ENVMAP_BLENDING_MIX",[oM]:"ENVMAP_BLENDING_ADD"};function IT(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":DT[s.combine]||"ENVMAP_BLENDING_NONE"}function UT(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function OT(s,e,t,i){const a=s.getContext(),l=t.defines;let c=t.vertexShader,d=t.fragmentShader;const h=CT(t),f=PT(t),_=LT(t),m=IT(t),g=UT(t),y=vT(t),M=yT(l),T=a.createProgram();let S,x,C=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(S=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M].filter(el).join(`
`),S.length>0&&(S+=`
`),x=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M].filter(el).join(`
`),x.length>0&&(x+=`
`)):(S=[t_(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+_:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+h:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(el).join(`
`),x=[t_(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+f:"",t.envMap?"#define "+_:"",t.envMap?"#define "+m:"",g?"#define CUBEUV_TEXEL_WIDTH "+g.texelWidth:"",g?"#define CUBEUV_TEXEL_HEIGHT "+g.texelHeight:"",g?"#define CUBEUV_MAX_MIP "+g.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+h:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==or?"#define TONE_MAPPING":"",t.toneMapping!==or?yt.tonemapping_pars_fragment:"",t.toneMapping!==or?_T("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",yt.colorspace_pars_fragment,mT("linearToOutputTexel",t.outputColorSpace),xT(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(el).join(`
`)),c=Lf(c),c=Qg(c,t),c=Jg(c,t),d=Lf(d),d=Qg(d,t),d=Jg(d,t),c=e_(c),d=e_(d),t.isRawShaderMaterial!==!0&&(C=`#version 300 es
`,S=[y,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+S,x=["#define varying in",t.glslVersion===J0?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===J0?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+x);const I=C+S+c,w=C+x+d,R=$g(a,a.VERTEX_SHADER,I),P=$g(a,a.FRAGMENT_SHADER,w);a.attachShader(T,R),a.attachShader(T,P),t.index0AttributeName!==void 0?a.bindAttribLocation(T,0,t.index0AttributeName):t.hasPositionAttribute===!0&&a.bindAttribLocation(T,0,"position"),a.linkProgram(T);function U(z){if(s.debug.checkShaderErrors){const G=a.getProgramInfoLog(T)||"",$=a.getShaderInfoLog(R)||"",H=a.getShaderInfoLog(P)||"",Q=G.trim(),he=$.trim(),ne=H.trim();let ee=!0,K=!0;if(a.getProgramParameter(T,a.LINK_STATUS)===!1)if(ee=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(a,T,R,P);else{const Z=Zg(a,R,"vertex"),O=Zg(a,P,"fragment");Ut("WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(T,a.VALIDATE_STATUS)+`

Material Name: `+z.name+`
Material Type: `+z.type+`

Program Info Log: `+Q+`
`+Z+`
`+O)}else Q!==""?ot("WebGLProgram: Program Info Log:",Q):(he===""||ne==="")&&(K=!1);K&&(z.diagnostics={runnable:ee,programLog:Q,vertexShader:{log:he,prefix:S},fragmentShader:{log:ne,prefix:x}})}a.deleteShader(R),a.deleteShader(P),A=new tu(a,T),D=ST(a,T)}let A;this.getUniforms=function(){return A===void 0&&U(this),A};let D;this.getAttributes=function(){return D===void 0&&U(this),D};let k=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return k===!1&&(k=a.getProgramParameter(T,dT)),k},this.destroy=function(){i.releaseStatesOfProgram(this),a.deleteProgram(T),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=hT++,this.cacheKey=e,this.usedTimes=1,this.program=T,this.vertexShader=R,this.fragmentShader=P,this}let FT=0;class kT{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){const a=this._getShaderCacheForMaterial(e);return a.has(t)===!1&&(a.add(t),t.usedTimes++),a.has(i)===!1&&(a.add(i),i.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new BT(e),t.set(e,i)),i}}class BT{constructor(e){this.id=FT++,this.code=e,this.usedTimes=0}}function zT(s){return s===$s||s===ru||s===su}function HT(s,e,t,i,a,l){const c=new Q_,d=new kT,h=new Set,f=[],_=new Map,m=i.logarithmicDepthBuffer;let g=i.precision;const y={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function M(A){return h.add(A),A===0?"uv":`uv${A}`}function T(A,D,k,z,G,$){const H=z.fog,Q=G.geometry,he=A.isMeshStandardMaterial||A.isMeshLambertMaterial||A.isMeshPhongMaterial?z.environment:null,ne=A.isMeshStandardMaterial||A.isMeshLambertMaterial&&!A.envMap||A.isMeshPhongMaterial&&!A.envMap,ee=e.get(A.envMap||he,ne),K=ee&&ee.mapping===mu?ee.image.height:null,Z=y[A.type];A.precision!==null&&(g=i.getMaxPrecision(A.precision),g!==A.precision&&ot("WebGLProgram.getParameters:",A.precision,"not supported, using",g,"instead."));const O=Q.morphAttributes.position||Q.morphAttributes.normal||Q.morphAttributes.color,se=O!==void 0?O.length:0;let Se=0;Q.morphAttributes.position!==void 0&&(Se=1),Q.morphAttributes.normal!==void 0&&(Se=2),Q.morphAttributes.color!==void 0&&(Se=3);let Ge,ze,Ve,ae;if(Z){const Lt=sr[Z];Ge=Lt.vertexShader,ze=Lt.fragmentShader}else{Ge=A.vertexShader,ze=A.fragmentShader;const Lt=d.getVertexShaderStage(A),Ct=d.getFragmentShaderStage(A);d.update(A,Lt,Ct),Ve=Lt.id,ae=Ct.id}const de=s.getRenderTarget(),Ee=s.state.buffers.depth.getReversed(),$e=G.isInstancedMesh===!0,Oe=G.isBatchedMesh===!0,ft=!!A.map,Gt=!!A.matcap,pt=!!ee,St=!!A.aoMap,Pt=!!A.lightMap,gt=!!A.bumpMap&&A.wireframe===!1,Ft=!!A.normalMap,qt=!!A.displacementMap,Jt=!!A.emissiveMap,xt=!!A.metalnessMap,jt=!!A.roughnessMap,q=A.anisotropy>0,pn=A.clearcoat>0,Nt=A.dispersion>0,F=A.retroreflectivity>0,b=A.iridescence>0,J=A.sheen>0,le=A.transmission>0,fe=q&&!!A.anisotropyMap,we=pn&&!!A.clearcoatMap,Ae=pn&&!!A.clearcoatNormalMap,pe=pn&&!!A.clearcoatRoughnessMap,_e=b&&!!A.iridescenceMap,Pe=b&&!!A.iridescenceThicknessMap,Ke=J&&!!A.sheenColorMap,Ne=J&&!!A.sheenRoughnessMap,Te=!!A.specularMap,Ze=!!A.specularColorMap,tt=!!A.specularIntensityMap,st=le&&!!A.transmissionMap,W=le&&!!A.thicknessMap,Ce=!!A.gradientMap,ge=!!A.alphaMap,Re=A.alphaTest>0,Fe=!!A.alphaHash,xe=!!A.extensions;let Je=or;A.toneMapped&&(de===null||de.isXRRenderTarget===!0)&&(Je=s.toneMapping);const qe={shaderID:Z,shaderType:A.type,shaderName:A.name,vertexShader:Ge,fragmentShader:ze,defines:A.defines,customVertexShaderID:Ve,customFragmentShaderID:ae,isRawShaderMaterial:A.isRawShaderMaterial===!0,glslVersion:A.glslVersion,precision:g,batching:Oe,batchingColor:Oe&&G._colorsTexture!==null,instancing:$e,instancingColor:$e&&G.instanceColor!==null,instancingMorph:$e&&G.morphTexture!==null,outputColorSpace:de===null?s.outputColorSpace:de.isXRRenderTarget===!0?de.texture.colorSpace:At.workingColorSpace,alphaToCoverage:!!A.alphaToCoverage,map:ft,matcap:Gt,envMap:pt,envMapMode:pt&&ee.mapping,envMapCubeUVHeight:K,aoMap:St,lightMap:Pt,bumpMap:gt,normalMap:Ft,displacementMap:qt,emissiveMap:Jt,normalMapObjectSpace:Ft&&A.normalMapType===uM,normalMapTangentSpace:Ft&&A.normalMapType===au,packedNormalMap:Ft&&A.normalMapType===au&&zT(A.normalMap.format),metalnessMap:xt,roughnessMap:jt,anisotropy:q,anisotropyMap:fe,clearcoat:pn,clearcoatMap:we,clearcoatNormalMap:Ae,clearcoatRoughnessMap:pe,dispersion:Nt,retroreflection:F,iridescence:b,iridescenceMap:_e,iridescenceThicknessMap:Pe,sheen:J,sheenColorMap:Ke,sheenRoughnessMap:Ne,specularMap:Te,specularColorMap:Ze,specularIntensityMap:tt,transmission:le,transmissionMap:st,thicknessMap:W,gradientMap:Ce,opaque:A.transparent===!1&&A.blending===nl&&A.alphaToCoverage===!1,alphaMap:ge,alphaTest:Re,alphaHash:Fe,combine:A.combine,mapUv:ft&&M(A.map.channel),aoMapUv:St&&M(A.aoMap.channel),lightMapUv:Pt&&M(A.lightMap.channel),bumpMapUv:gt&&M(A.bumpMap.channel),normalMapUv:Ft&&M(A.normalMap.channel),displacementMapUv:qt&&M(A.displacementMap.channel),emissiveMapUv:Jt&&M(A.emissiveMap.channel),metalnessMapUv:xt&&M(A.metalnessMap.channel),roughnessMapUv:jt&&M(A.roughnessMap.channel),anisotropyMapUv:fe&&M(A.anisotropyMap.channel),clearcoatMapUv:we&&M(A.clearcoatMap.channel),clearcoatNormalMapUv:Ae&&M(A.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:pe&&M(A.clearcoatRoughnessMap.channel),iridescenceMapUv:_e&&M(A.iridescenceMap.channel),iridescenceThicknessMapUv:Pe&&M(A.iridescenceThicknessMap.channel),sheenColorMapUv:Ke&&M(A.sheenColorMap.channel),sheenRoughnessMapUv:Ne&&M(A.sheenRoughnessMap.channel),specularMapUv:Te&&M(A.specularMap.channel),specularColorMapUv:Ze&&M(A.specularColorMap.channel),specularIntensityMapUv:tt&&M(A.specularIntensityMap.channel),transmissionMapUv:st&&M(A.transmissionMap.channel),thicknessMapUv:W&&M(A.thicknessMap.channel),alphaMapUv:ge&&M(A.alphaMap.channel),vertexTangents:!!Q.attributes.tangent&&(Ft||q),vertexNormals:!!Q.attributes.normal,vertexColors:A.vertexColors,vertexAlphas:A.vertexColors===!0&&!!Q.attributes.color&&Q.attributes.color.itemSize===4,pointsUvs:G.isPoints===!0&&!!Q.attributes.uv&&(ft||ge),fog:!!H,useFog:A.fog===!0,fogExp2:!!H&&H.isFogExp2,flatShading:A.wireframe===!1&&(A.flatShading===!0||Q.attributes.normal===void 0&&Ft===!1&&(A.isMeshLambertMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isMeshPhysicalMaterial)),sizeAttenuation:A.sizeAttenuation===!0,logarithmicDepthBuffer:m,reversedDepthBuffer:Ee,skinning:G.isSkinnedMesh===!0,hasPositionAttribute:Q.attributes.position!==void 0,morphTargets:Q.morphAttributes.position!==void 0,morphNormals:Q.morphAttributes.normal!==void 0,morphColors:Q.morphAttributes.color!==void 0,morphTargetsCount:se,morphTextureStride:Se,numSunLights:D.sun.length,numDirLights:D.directional.length,numPointLights:D.point.length,numSpotLights:D.spot.length,numSpotLightMaps:D.spotLightMap.length,numRectAreaLights:D.rectArea.length,numHemiLights:D.hemi.length,numSunLightShadows:D.sunShadowMap.length,numDirLightShadows:D.directionalShadowMap.length,numPointLightShadows:D.pointShadowMap.length,numSpotLightShadows:D.spotShadowMap.length,numSpotLightShadowsWithMaps:D.numSpotLightShadowsWithMaps,numLightProbes:D.numLightProbes,numLightProbeGrids:$.length,numClippingPlanes:l.numPlanes,numClipIntersection:l.numIntersection,dithering:A.dithering,shadowMapEnabled:s.shadowMap.enabled&&k.length>0,shadowMapType:s.shadowMap.type,toneMapping:Je,decodeVideoTexture:ft&&A.map.isVideoTexture===!0&&At.getTransfer(A.map.colorSpace)===zt,decodeVideoTextureEmissive:Jt&&A.emissiveMap.isVideoTexture===!0&&At.getTransfer(A.emissiveMap.colorSpace)===zt,premultipliedAlpha:A.premultipliedAlpha,doubleSided:A.side===Gi,flipSided:A.side===si,useDepthPacking:A.depthPacking>=0,depthPacking:A.depthPacking||0,index0AttributeName:A.index0AttributeName,extensionClipCullDistance:xe&&A.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(xe&&A.extensions.multiDraw===!0||Oe)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:A.customProgramCacheKey()};return qe.vertexUv1s=h.has(1),qe.vertexUv2s=h.has(2),qe.vertexUv3s=h.has(3),h.clear(),qe}function S(A){const D=[];if(A.shaderID?D.push(A.shaderID):(D.push(A.customVertexShaderID),D.push(A.customFragmentShaderID)),A.defines!==void 0)for(const k in A.defines)D.push(k),D.push(A.defines[k]);return A.isRawShaderMaterial===!1&&(x(D,A),C(D,A),D.push(s.outputColorSpace)),D.push(A.customProgramCacheKey),D.join()}function x(A,D){A.push(D.precision),A.push(D.outputColorSpace),A.push(D.envMapMode),A.push(D.envMapCubeUVHeight),A.push(D.mapUv),A.push(D.alphaMapUv),A.push(D.lightMapUv),A.push(D.aoMapUv),A.push(D.bumpMapUv),A.push(D.normalMapUv),A.push(D.displacementMapUv),A.push(D.emissiveMapUv),A.push(D.metalnessMapUv),A.push(D.roughnessMapUv),A.push(D.anisotropyMapUv),A.push(D.clearcoatMapUv),A.push(D.clearcoatNormalMapUv),A.push(D.clearcoatRoughnessMapUv),A.push(D.iridescenceMapUv),A.push(D.iridescenceThicknessMapUv),A.push(D.sheenColorMapUv),A.push(D.sheenRoughnessMapUv),A.push(D.specularMapUv),A.push(D.specularColorMapUv),A.push(D.specularIntensityMapUv),A.push(D.transmissionMapUv),A.push(D.thicknessMapUv),A.push(D.combine),A.push(D.fogExp2),A.push(D.sizeAttenuation),A.push(D.morphTargetsCount),A.push(D.morphAttributeCount),A.push(D.numSunLights),A.push(D.numDirLights),A.push(D.numPointLights),A.push(D.numSpotLights),A.push(D.numSpotLightMaps),A.push(D.numHemiLights),A.push(D.numRectAreaLights),A.push(D.numSunLightShadows),A.push(D.numDirLightShadows),A.push(D.numPointLightShadows),A.push(D.numSpotLightShadows),A.push(D.numSpotLightShadowsWithMaps),A.push(D.numLightProbes),A.push(D.shadowMapType),A.push(D.toneMapping),A.push(D.numClippingPlanes),A.push(D.numClipIntersection),A.push(D.depthPacking)}function C(A,D){c.disableAll(),D.instancing&&c.enable(0),D.instancingColor&&c.enable(1),D.instancingMorph&&c.enable(2),D.matcap&&c.enable(3),D.envMap&&c.enable(4),D.normalMapObjectSpace&&c.enable(5),D.normalMapTangentSpace&&c.enable(6),D.clearcoat&&c.enable(7),D.iridescence&&c.enable(8),D.alphaTest&&c.enable(9),D.vertexColors&&c.enable(10),D.vertexAlphas&&c.enable(11),D.vertexUv1s&&c.enable(12),D.vertexUv2s&&c.enable(13),D.vertexUv3s&&c.enable(14),D.vertexTangents&&c.enable(15),D.anisotropy&&c.enable(16),D.alphaHash&&c.enable(17),D.batching&&c.enable(18),D.dispersion&&c.enable(19),D.retroreflection&&c.enable(24),D.batchingColor&&c.enable(20),D.gradientMap&&c.enable(21),D.packedNormalMap&&c.enable(22),D.vertexNormals&&c.enable(23),A.push(c.mask),c.disableAll(),D.fog&&c.enable(0),D.useFog&&c.enable(1),D.flatShading&&c.enable(2),D.logarithmicDepthBuffer&&c.enable(3),D.reversedDepthBuffer&&c.enable(4),D.skinning&&c.enable(5),D.morphTargets&&c.enable(6),D.morphNormals&&c.enable(7),D.morphColors&&c.enable(8),D.premultipliedAlpha&&c.enable(9),D.shadowMapEnabled&&c.enable(10),D.doubleSided&&c.enable(11),D.flipSided&&c.enable(12),D.useDepthPacking&&c.enable(13),D.dithering&&c.enable(14),D.transmission&&c.enable(15),D.sheen&&c.enable(16),D.opaque&&c.enable(17),D.pointsUvs&&c.enable(18),D.decodeVideoTexture&&c.enable(19),D.decodeVideoTextureEmissive&&c.enable(20),D.alphaToCoverage&&c.enable(21),D.numLightProbeGrids>0&&c.enable(22),D.hasPositionAttribute&&c.enable(23),A.push(c.mask)}function I(A){const D=y[A.type];let k;if(D){const z=sr[D];k=ZM.clone(z.uniforms)}else k=A.uniforms;return k}function w(A,D){let k=_.get(D);return k!==void 0?++k.usedTimes:(k=new OT(s,D,A,a),f.push(k),_.set(D,k)),k}function R(A){if(--A.usedTimes===0){const D=f.indexOf(A);f[D]=f[f.length-1],f.pop(),_.delete(A.cacheKey),A.destroy()}}function P(A){d.remove(A)}function U(){d.dispose()}return{getParameters:T,getProgramCacheKey:S,getUniforms:I,acquireProgram:w,releaseProgram:R,releaseShaderCache:P,programs:f,dispose:U}}function VT(){let s=new WeakMap;function e(c){return s.has(c)}function t(c){let d=s.get(c);return d===void 0&&(d={},s.set(c,d)),d}function i(c){s.delete(c)}function a(c,d,h){s.get(c)[d]=h}function l(){s=new WeakMap}return{has:e,get:t,remove:i,update:a,dispose:l}}function GT(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.materialVariant!==e.materialVariant?s.materialVariant-e.materialVariant:s.z!==e.z?s.z-e.z:s.id-e.id}function n_(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function i_(){const s=[];let e=0;const t=[],i=[],a=[];function l(){e=0,t.length=0,i.length=0,a.length=0}function c(g){let y=0;return g.isInstancedMesh&&(y+=2),g.isSkinnedMesh&&(y+=1),y}function d(g,y,M,T,S,x){let C=s[e];return C===void 0?(C={id:g.id,object:g,geometry:y,material:M,materialVariant:c(g),groupOrder:T,renderOrder:g.renderOrder,z:S,group:x},s[e]=C):(C.id=g.id,C.object=g,C.geometry=y,C.material=M,C.materialVariant=c(g),C.groupOrder=T,C.renderOrder=g.renderOrder,C.z=S,C.group=x),e++,C}function h(g,y,M,T,S,x,C){C.reversedDepth===!0&&(S=-S);const I=d(g,y,M,T,S,x);M.transmission>0?i.push(I):M.transparent===!0?a.push(I):t.push(I)}function f(g,y,M,T,S,x){const C=d(g,y,M,T,S,x);M.transmission>0?i.unshift(C):M.transparent===!0?a.unshift(C):t.unshift(C)}function _(g,y){t.length>1&&t.sort(g||GT),i.length>1&&i.sort(y||n_),a.length>1&&a.sort(y||n_)}function m(){for(let g=e,y=s.length;g<y;g++){const M=s[g];if(M.id===null)break;M.id=null,M.object=null,M.geometry=null,M.material=null,M.group=null}}return{opaque:t,transmissive:i,transparent:a,init:l,push:h,unshift:f,finish:m,sort:_}}function WT(){let s=new WeakMap;function e(i,a){const l=s.get(i);let c;return l===void 0?(c=new i_,s.set(i,[c])):a>=l.length?(c=new i_,l.push(c)):c=l[a],c}function t(){s=new WeakMap}return{get:e,dispose:t}}function jT(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new X,color:new ht};break;case"SpotLight":t={position:new X,direction:new X,color:new ht,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new X,color:new ht,distance:0,decay:0};break;case"HemisphereLight":t={direction:new X,skyColor:new ht,groundColor:new ht};break;case"RectAreaLight":t={color:new ht,position:new X,halfWidth:new X,halfHeight:new X};break}return s[e.id]=t,t}}}function XT(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new lt};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new lt};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new lt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let qT=0;function YT(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function $T(s){const e=new jT,t=XT(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let f=0;f<9;f++)i.probe.push(new X);const a=new X,l=new Vt,c=new Vt;function d(f){let _=0,m=0,g=0;for(let G=0;G<9;G++)i.probe[G].set(0,0,0);let y=0,M=0,T=0,S=0,x=0,C=0,I=0,w=0,R=0,P=0,U=0,A=0,D=0,k=0;f.sort(YT);for(let G=0,$=f.length;G<$;G++){const H=f[G],Q=H.color,he=H.intensity,ne=H.distance;let ee=null;if(H.shadow&&H.shadow.map&&(H.shadow.map.texture.format===$s?ee=H.shadow.map.texture:ee=H.shadow.map.depthTexture||H.shadow.map.texture),H.isAmbientLight)_+=Q.r*he,m+=Q.g*he,g+=Q.b*he;else if(H.isLightProbe){for(let K=0;K<9;K++)i.probe[K].addScaledVector(H.sh.coefficients[K],he);k++}else if(H.isSunLight){const K=e.get(H);if(K.color.copy(H.color).multiplyScalar(H.intensity),H.castShadow){const Z=H.shadow,O=t.get(H);O.shadowIntensity=Z.intensity,O.shadowBias=Z.bias,O.shadowNormalBias=Z.normalBias,O.shadowRadius=Z.radius,O.shadowMapSize.copy(Z.mapSize).multiply(Z.getFrameExtents()),i.sunShadow[M]=O,i.sunShadowMap[M]=ee;const se=Z.getViewportCount();for(let Se=0;Se<se;Se++)i.sunShadowMatrix[T+Se]=Z.getMatrix(Se),i.sunShadowCascade[T+Se]=Z._cascadeData[Se];T+=se,M++}i.sun[y]=K,y++}else if(H.isDirectionalLight){const K=e.get(H);if(K.color.copy(H.color).multiplyScalar(H.intensity),H.castShadow){const Z=H.shadow,O=t.get(H);O.shadowIntensity=Z.intensity,O.shadowBias=Z.bias,O.shadowNormalBias=Z.normalBias,O.shadowRadius=Z.radius,O.shadowMapSize=Z.mapSize,i.directionalShadow[S]=O,i.directionalShadowMap[S]=ee,i.directionalShadowMatrix[S]=H.shadow.matrix,R++}i.directional[S]=K,S++}else if(H.isSpotLight){const K=e.get(H);K.position.setFromMatrixPosition(H.matrixWorld),K.color.copy(Q).multiplyScalar(he),K.distance=ne,K.coneCos=Math.cos(H.angle),K.penumbraCos=Math.cos(H.angle*(1-H.penumbra)),K.decay=H.decay,i.spot[C]=K;const Z=H.shadow;if(H.map&&(i.spotLightMap[A]=H.map,A++,Z.updateMatrices(H),H.castShadow&&D++),i.spotLightMatrix[C]=Z.matrix,H.castShadow){const O=t.get(H);O.shadowIntensity=Z.intensity,O.shadowBias=Z.bias,O.shadowNormalBias=Z.normalBias,O.shadowRadius=Z.radius,O.shadowMapSize=Z.mapSize,i.spotShadow[C]=O,i.spotShadowMap[C]=ee,U++}C++}else if(H.isRectAreaLight){const K=e.get(H);K.color.copy(Q).multiplyScalar(he),K.halfWidth.set(H.width*.5,0,0),K.halfHeight.set(0,H.height*.5,0),i.rectArea[I]=K,I++}else if(H.isPointLight){const K=e.get(H);if(K.color.copy(H.color).multiplyScalar(H.intensity),K.distance=H.distance,K.decay=H.decay,H.castShadow){const Z=H.shadow,O=t.get(H);O.shadowIntensity=Z.intensity,O.shadowBias=Z.bias,O.shadowNormalBias=Z.normalBias,O.shadowRadius=Z.radius,O.shadowMapSize=Z.mapSize,O.shadowCameraNear=Z.camera.near,O.shadowCameraFar=Z.camera.far,i.pointShadow[x]=O,i.pointShadowMap[x]=ee,i.pointShadowMatrix[x]=H.shadow.matrix,P++}i.point[x]=K,x++}else if(H.isHemisphereLight){const K=e.get(H);K.skyColor.copy(H.color).multiplyScalar(he),K.groundColor.copy(H.groundColor).multiplyScalar(he),i.hemi[w]=K,w++}}I>0&&(s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Ue.LTC_FLOAT_1,i.rectAreaLTC2=Ue.LTC_FLOAT_2):(i.rectAreaLTC1=Ue.LTC_HALF_1,i.rectAreaLTC2=Ue.LTC_HALF_2)),i.ambient[0]=_,i.ambient[1]=m,i.ambient[2]=g;const z=i.hash;(z.sunLength!==y||z.directionalLength!==S||z.pointLength!==x||z.spotLength!==C||z.rectAreaLength!==I||z.hemiLength!==w||z.numSunShadows!==M||z.numDirectionalShadows!==R||z.numPointShadows!==P||z.numSpotShadows!==U||z.numSpotMaps!==A||z.numLightProbes!==k)&&(i.sun.length=y,i.directional.length=S,i.spot.length=C,i.rectArea.length=I,i.point.length=x,i.hemi.length=w,i.sunShadow.length=M,i.sunShadowMap.length=M,i.sunShadowMatrix.length=T,i.sunShadowCascade.length=T,i.directionalShadow.length=R,i.directionalShadowMap.length=R,i.directionalShadowMatrix.length=R,i.pointShadow.length=P,i.pointShadowMap.length=P,i.pointShadowMatrix.length=P,i.spotShadow.length=U,i.spotShadowMap.length=U,i.spotLightMatrix.length=U+A-D,i.spotLightMap.length=A,i.numSpotLightShadowsWithMaps=D,i.numLightProbes=k,z.sunLength=y,z.directionalLength=S,z.pointLength=x,z.spotLength=C,z.rectAreaLength=I,z.hemiLength=w,z.numSunShadows=M,z.numDirectionalShadows=R,z.numPointShadows=P,z.numSpotShadows=U,z.numSpotMaps=A,z.numLightProbes=k,i.version=qT++)}function h(f,_){let m=0,g=0,y=0,M=0,T=0,S=0;const x=_.matrixWorldInverse;for(let C=0,I=f.length;C<I;C++){const w=f[C];if(w.isSunLight){const R=i.sun[m];R.direction.setFromMatrixPosition(w.matrixWorld),R.direction.transformDirection(x),m++}else if(w.isDirectionalLight){const R=i.directional[g];R.direction.setFromMatrixPosition(w.matrixWorld),a.setFromMatrixPosition(w.target.matrixWorld),R.direction.sub(a),R.direction.transformDirection(x),g++}else if(w.isSpotLight){const R=i.spot[M];R.position.setFromMatrixPosition(w.matrixWorld),R.position.applyMatrix4(x),R.direction.setFromMatrixPosition(w.matrixWorld),a.setFromMatrixPosition(w.target.matrixWorld),R.direction.sub(a),R.direction.transformDirection(x),M++}else if(w.isRectAreaLight){const R=i.rectArea[T];R.position.setFromMatrixPosition(w.matrixWorld),R.position.applyMatrix4(x),c.identity(),l.copy(w.matrixWorld),l.premultiply(x),c.extractRotation(l),R.halfWidth.set(w.width*.5,0,0),R.halfHeight.set(0,w.height*.5,0),R.halfWidth.applyMatrix4(c),R.halfHeight.applyMatrix4(c),T++}else if(w.isPointLight){const R=i.point[y];R.position.setFromMatrixPosition(w.matrixWorld),R.position.applyMatrix4(x),y++}else if(w.isHemisphereLight){const R=i.hemi[S];R.direction.setFromMatrixPosition(w.matrixWorld),R.direction.transformDirection(x),S++}}}return{setup:d,setupView:h,state:i}}function r_(s){const e=new $T(s),t=[],i=[],a=[];function l(g){m.camera=g,t.length=0,i.length=0,a.length=0}function c(g){t.push(g)}function d(g){i.push(g)}function h(g){a.push(g)}function f(){e.setup(t)}function _(g){e.setupView(t,g)}const m={lightsArray:t,shadowsArray:i,lightProbeGridArray:a,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:l,state:m,setupLights:f,setupLightsView:_,pushLight:c,pushShadow:d,pushLightProbeGrid:h}}function KT(s){let e=new WeakMap;function t(a,l=0){const c=e.get(a);let d;return c===void 0?(d=new r_(s),e.set(a,[d])):l>=c.length?(d=new r_(s),c.push(d)):d=c[l],d}function i(){e=new WeakMap}return{get:t,dispose:i}}const ZT=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,QT=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,JT=[new X(1,0,0),new X(-1,0,0),new X(0,1,0),new X(0,-1,0),new X(0,0,1),new X(0,0,-1)],eA=[new X(0,-1,0),new X(0,-1,0),new X(0,0,1),new X(0,0,-1),new X(0,-1,0),new X(0,-1,0)],s_=new Vt,Zo=new X,kh=new X;function tA(s,e,t){let i=new Kf;const a=new lt,l=new lt,c=new sn,d=new i1,h=new r1,f={},_=t.maxTextureSize,m={[qs]:si,[si]:qs,[Gi]:Gi},g=new hr({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new lt},radius:{value:4}},vertexShader:ZT,fragmentShader:QT}),y=g.clone();y.defines.HORIZONTAL_PASS=1;const M=new Sn;M.setAttribute("position",new lr(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const T=new dt(M,g),S=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=$c;let x=this.type;this.render=function(P,U,A){if(S.enabled===!1||S.autoUpdate===!1&&S.needsUpdate===!1||P.length===0)return;this.type===HS&&(ot("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=$c);const D=s.getRenderTarget(),k=s.getActiveCubeFace(),z=s.getActiveMipmapLevel(),G=s.state;G.setBlending(Lr),G.buffers.depth.getReversed()===!0?G.buffers.color.setClear(0,0,0,0):G.buffers.color.setClear(1,1,1,1),G.buffers.depth.setTest(!0),G.setScissorTest(!1);const $=x!==this.type;$&&U.traverse(function(H){H.material&&(Array.isArray(H.material)?H.material.forEach(Q=>Q.needsUpdate=!0):H.material.needsUpdate=!0)});for(let H=0,Q=P.length;H<Q;H++){const he=P[H],ne=he.shadow;if(ne===void 0){ot("WebGLShadowMap:",he,"has no shadow.");continue}if(ne.autoUpdate===!1&&ne.needsUpdate===!1)continue;a.copy(ne.mapSize);const ee=ne.getFrameExtents();a.multiply(ee),l.copy(ne.mapSize),(a.x>_||a.y>_)&&(a.x>_&&(l.x=Math.floor(_/ee.x),a.x=l.x*ee.x,ne.mapSize.x=l.x),a.y>_&&(l.y=Math.floor(_/ee.y),a.y=l.y*ee.y,ne.mapSize.y=l.y));const K=s.state.buffers.depth.getReversed();if(ne.camera._reversedDepth=K,ne.map===null||$===!0){if(ne.map!==null&&(ne.map.depthTexture!==null&&(ne.map.depthTexture.dispose(),ne.map.depthTexture=null),ne.map.dispose()),this.type===Qo){if(he.isPointLight){ot("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}ne.map=new $i(a.x,a.y,{format:$s,type:ur,minFilter:Vn,magFilter:Vn,generateMipmaps:!1}),ne.map.texture.name=he.name+".shadowMap",ne.map.depthTexture=new cl(a.x,a.y,Xi),ne.map.depthTexture.name=he.name+".shadowMapDepth",ne.map.depthTexture.format=Ir,ne.map.depthTexture.compareFunction=null,ne.map.depthTexture.minFilter=Ln,ne.map.depthTexture.magFilter=Ln}else he.isPointLight?(ne.map=new ux(a.x),ne.map.depthTexture=new $M(a.x,cr)):(ne.map=new $i(a.x,a.y),ne.map.depthTexture=new cl(a.x,a.y,cr)),ne.map.depthTexture.name=he.name+".shadowMap",ne.map.depthTexture.format=Ir,this.type===$c?(ne.map.depthTexture.compareFunction=K?qf:Xf,ne.map.depthTexture.minFilter=Vn,ne.map.depthTexture.magFilter=Vn):(ne.map.depthTexture.compareFunction=null,ne.map.depthTexture.minFilter=Ln,ne.map.depthTexture.magFilter=Ln);ne.camera.updateProjectionMatrix()}ne.map.isWebGLCubeRenderTarget!==!0&&(ne.map.width!==a.x||ne.map.height!==a.y)&&ne.map.setSize(a.x,a.y);const Z=ne.map.isWebGLCubeRenderTarget?6:ne.getViewportCount();he.isPointLight!==!0&&ne.updateMatrices(he,A);for(let O=0;O<Z;O++){const se=ne.getCamera(O);if(he.isPointLight){const Se=ne.camera,Ge=ne.matrix,ze=he.distance||Se.far;ze!==Se.far&&(Se.far=ze,Se.updateProjectionMatrix()),Zo.setFromMatrixPosition(he.matrixWorld),Se.position.copy(Zo),kh.copy(Se.position),kh.add(JT[O]),Se.up.copy(eA[O]),Se.lookAt(kh),Se.updateMatrixWorld(),Ge.makeTranslation(-Zo.x,-Zo.y,-Zo.z),s_.multiplyMatrices(Se.projectionMatrix,Se.matrixWorldInverse),ne._frustum.setFromProjectionMatrix(s_,Se.coordinateSystem,Se.reversedDepth)}if(ne.map.isWebGLCubeRenderTarget)s.setRenderTarget(ne.map,O),s.clear();else{O===0&&(s.setRenderTarget(ne.map),s.clear());const Se=ne.getViewport(O);c.set(l.x*Se.x,l.y*Se.y,l.x*Se.z,l.y*Se.w),G.viewport(c)}i=ne.getFrustum(O),w(U,A,se,he,this.type)}ne.isPointLightShadow!==!0&&this.type===Qo&&C(ne,A),ne.needsUpdate=!1}x=this.type,S.needsUpdate=!1,s.setRenderTarget(D,k,z)};function C(P,U){const A=e.update(T);g.defines.VSM_SAMPLES!==P.blurSamples&&(g.defines.VSM_SAMPLES=P.blurSamples,y.defines.VSM_SAMPLES=P.blurSamples,g.needsUpdate=!0,y.needsUpdate=!0),P.mapPass===null?P.mapPass=new $i(a.x,a.y,{format:$s,type:ur}):(P.mapPass.width!==P.map.width||P.mapPass.height!==P.map.height)&&P.mapPass.setSize(P.map.width,P.map.height),g.uniforms.shadow_pass.value=P.map.depthTexture,g.uniforms.resolution.value.set(P.map.width,P.map.height),g.uniforms.radius.value=P.radius,s.setRenderTarget(P.mapPass),s.clear(),s.renderBufferDirect(U,null,A,g,T,null),y.uniforms.shadow_pass.value=P.mapPass.texture,y.uniforms.resolution.value.set(P.map.width,P.map.height),y.uniforms.radius.value=P.radius,s.setRenderTarget(P.map),s.clear(),s.renderBufferDirect(U,null,A,y,T,null)}function I(P,U,A,D){let k=null;const z=A.isPointLight===!0?P.customDistanceMaterial:P.customDepthMaterial;if(z!==void 0)k=z;else if(k=A.isPointLight===!0?h:d,s.localClippingEnabled&&U.clipShadows===!0&&Array.isArray(U.clippingPlanes)&&U.clippingPlanes.length!==0||U.displacementMap&&U.displacementScale!==0||U.alphaMap&&U.alphaTest>0||U.map&&U.alphaTest>0||U.alphaToCoverage===!0){const G=k.uuid,$=U.uuid;let H=f[G];H===void 0&&(H={},f[G]=H);let Q=H[$];Q===void 0&&(Q=k.clone(),H[$]=Q,U.addEventListener("dispose",R)),k=Q}if(k.visible=U.visible,k.wireframe=U.wireframe,D===Qo?k.side=U.shadowSide!==null?U.shadowSide:U.side:k.side=U.shadowSide!==null?U.shadowSide:m[U.side],k.alphaMap=U.alphaMap,k.alphaTest=U.alphaToCoverage===!0?.5:U.alphaTest,k.map=U.map,k.clipShadows=U.clipShadows,k.clippingPlanes=U.clippingPlanes,k.clipIntersection=U.clipIntersection,k.displacementMap=U.displacementMap,k.displacementScale=U.displacementScale,k.displacementBias=U.displacementBias,k.wireframeLinewidth=U.wireframeLinewidth,k.linewidth=U.linewidth,A.isPointLight===!0&&k.isMeshDistanceMaterial===!0){const G=s.properties.get(k);G.light=A}return k}function w(P,U,A,D,k){if(P.visible===!1)return;if(P.layers.test(U.layers)&&(P.isMesh||P.isLine||P.isPoints)&&(P.castShadow||P.receiveShadow&&k===Qo)&&(!P.frustumCulled||P.intersectsFrustum(i))){P.modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,P.matrixWorld);const $=e.update(P),H=P.material;if(Array.isArray(H)){const Q=$.groups;for(let he=0,ne=Q.length;he<ne;he++){const ee=Q[he],K=H[ee.materialIndex];if(K&&K.visible){const Z=I(P,K,D,k);P.onBeforeShadow(s,P,U,A,$,Z,ee),s.renderBufferDirect(A,null,$,Z,P,ee),P.onAfterShadow(s,P,U,A,$,Z,ee)}}}else if(H.visible){const Q=I(P,H,D,k);P.onBeforeShadow(s,P,U,A,$,Q,null),s.renderBufferDirect(A,null,$,Q,P,null),P.onAfterShadow(s,P,U,A,$,Q,null)}}const G=P.children;for(let $=0,H=G.length;$<H;$++)w(G[$],U,A,D,k)}function R(P){P.target.removeEventListener("dispose",R);for(const A in f){const D=f[A],k=P.target.uuid;k in D&&(D[k].dispose(),delete D[k])}}}function nA(s,e){function t(){let W=!1;const Ce=new sn;let ge=null;const Re=new sn(0,0,0,0);return{setMask:function(Fe){ge!==Fe&&!W&&(s.colorMask(Fe,Fe,Fe,Fe),ge=Fe)},setLocked:function(Fe){W=Fe},setClear:function(Fe,xe,Je,qe,Lt){Lt===!0&&(Fe*=qe,xe*=qe,Je*=qe),Ce.set(Fe,xe,Je,qe),Re.equals(Ce)===!1&&(s.clearColor(Fe,xe,Je,qe),Re.copy(Ce))},reset:function(){W=!1,ge=null,Re.set(-1,0,0,0)}}}function i(){let W=!1,Ce=!1,ge=null,Re=null,Fe=null;return{setReversed:function(xe){if(Ce!==xe){const Je=e.get("EXT_clip_control");xe?Je.clipControlEXT(Je.LOWER_LEFT_EXT,Je.ZERO_TO_ONE_EXT):Je.clipControlEXT(Je.LOWER_LEFT_EXT,Je.NEGATIVE_ONE_TO_ONE_EXT),Ce=xe;const qe=Fe;Fe=null,this.setClear(qe)}},getReversed:function(){return Ce},setTest:function(xe){xe?de(s.DEPTH_TEST):Ee(s.DEPTH_TEST)},setMask:function(xe){ge!==xe&&!W&&(s.depthMask(xe),ge=xe)},setFunc:function(xe){if(Ce&&(xe=MM[xe]),Re!==xe){switch(xe){case Wh:s.depthFunc(s.NEVER);break;case jh:s.depthFunc(s.ALWAYS);break;case Xh:s.depthFunc(s.LESS);break;case rl:s.depthFunc(s.LEQUAL);break;case qh:s.depthFunc(s.EQUAL);break;case Yh:s.depthFunc(s.GEQUAL);break;case $h:s.depthFunc(s.GREATER);break;case Kh:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}Re=xe}},setLocked:function(xe){W=xe},setClear:function(xe){Fe!==xe&&(Fe=xe,Ce&&(xe=1-xe),s.clearDepth(xe))},reset:function(){W=!1,ge=null,Re=null,Fe=null,Ce=!1}}}function a(){let W=!1,Ce=null,ge=null,Re=null,Fe=null,xe=null,Je=null,qe=null,Lt=null;return{setTest:function(Ct){W||(Ct?de(s.STENCIL_TEST):Ee(s.STENCIL_TEST))},setMask:function(Ct){Ce!==Ct&&!W&&(s.stencilMask(Ct),Ce=Ct)},setFunc:function(Ct,Cn,gi){(ge!==Ct||Re!==Cn||Fe!==gi)&&(s.stencilFunc(Ct,Cn,gi),ge=Ct,Re=Cn,Fe=gi)},setOp:function(Ct,Cn,gi){(xe!==Ct||Je!==Cn||qe!==gi)&&(s.stencilOp(Ct,Cn,gi),xe=Ct,Je=Cn,qe=gi)},setLocked:function(Ct){W=Ct},setClear:function(Ct){Lt!==Ct&&(s.clearStencil(Ct),Lt=Ct)},reset:function(){W=!1,Ce=null,ge=null,Re=null,Fe=null,xe=null,Je=null,qe=null,Lt=null}}}const l=new t,c=new i,d=new a,h=new WeakMap,f=new WeakMap;let _={},m={},g={},y=new WeakMap,M=[],T=null,S=!1,x=null,C=null,I=null,w=null,R=null,P=null,U=null,A=new ht(0,0,0),D=0,k=!1,z=null,G=null,$=null,H=null,Q=null;const he=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let ne=!1,ee=0;const K=s.getParameter(s.VERSION);K.indexOf("WebGL")!==-1?(ee=parseFloat(/^WebGL (\d)/.exec(K)[1]),ne=ee>=1):K.indexOf("OpenGL ES")!==-1&&(ee=parseFloat(/^OpenGL ES (\d)/.exec(K)[1]),ne=ee>=2);let Z=null,O={};const se=s.getParameter(s.SCISSOR_BOX),Se=s.getParameter(s.VIEWPORT),Ge=new sn().fromArray(se),ze=new sn().fromArray(Se);function Ve(W,Ce,ge,Re){const Fe=new Uint8Array(4),xe=s.createTexture();s.bindTexture(W,xe),s.texParameteri(W,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(W,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Je=0;Je<ge;Je++)W===s.TEXTURE_3D||W===s.TEXTURE_2D_ARRAY?s.texImage3D(Ce,0,s.RGBA,1,1,Re,0,s.RGBA,s.UNSIGNED_BYTE,Fe):s.texImage2D(Ce+Je,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Fe);return xe}const ae={};ae[s.TEXTURE_2D]=Ve(s.TEXTURE_2D,s.TEXTURE_2D,1),ae[s.TEXTURE_CUBE_MAP]=Ve(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),ae[s.TEXTURE_2D_ARRAY]=Ve(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),ae[s.TEXTURE_3D]=Ve(s.TEXTURE_3D,s.TEXTURE_3D,1,1),l.setClear(0,0,0,1),c.setClear(1),d.setClear(0),de(s.DEPTH_TEST),c.setFunc(rl),gt(!1),Ft($0),de(s.CULL_FACE),St(Lr);function de(W){_[W]!==!0&&(s.enable(W),_[W]=!0)}function Ee(W){_[W]!==!1&&(s.disable(W),_[W]=!1)}function $e(W,Ce){return g[W]!==Ce?(s.bindFramebuffer(W,Ce),g[W]=Ce,W===s.DRAW_FRAMEBUFFER&&(g[s.FRAMEBUFFER]=Ce),W===s.FRAMEBUFFER&&(g[s.DRAW_FRAMEBUFFER]=Ce),!0):!1}function Oe(W,Ce){let ge=M,Re=!1;if(W){ge=y.get(Ce),ge===void 0&&(ge=[],y.set(Ce,ge));const Fe=W.textures;if(ge.length!==Fe.length||ge[0]!==s.COLOR_ATTACHMENT0){for(let xe=0,Je=Fe.length;xe<Je;xe++)ge[xe]=s.COLOR_ATTACHMENT0+xe;ge.length=Fe.length,Re=!0}}else ge[0]!==s.BACK&&(ge[0]=s.BACK,Re=!0);Re&&s.drawBuffers(ge)}function ft(W){return T!==W?(s.useProgram(W),T=W,!0):!1}const Gt={[Fa]:s.FUNC_ADD,[GS]:s.FUNC_SUBTRACT,[WS]:s.FUNC_REVERSE_SUBTRACT};Gt[jS]=s.MIN,Gt[XS]=s.MAX;const pt={[qS]:s.ZERO,[YS]:s.ONE,[$S]:s.SRC_COLOR,[I_]:s.SRC_ALPHA,[tM]:s.SRC_ALPHA_SATURATE,[JS]:s.DST_COLOR,[ZS]:s.DST_ALPHA,[KS]:s.ONE_MINUS_SRC_COLOR,[U_]:s.ONE_MINUS_SRC_ALPHA,[eM]:s.ONE_MINUS_DST_COLOR,[QS]:s.ONE_MINUS_DST_ALPHA,[nM]:s.CONSTANT_COLOR,[iM]:s.ONE_MINUS_CONSTANT_COLOR,[rM]:s.CONSTANT_ALPHA,[sM]:s.ONE_MINUS_CONSTANT_ALPHA};function St(W,Ce,ge,Re,Fe,xe,Je,qe,Lt,Ct){if(W===Lr){S===!0&&(Ee(s.BLEND),S=!1);return}if(S===!1&&(de(s.BLEND),S=!0),W!==VS){if(W!==x||Ct!==k){if((C!==Fa||R!==Fa)&&(s.blendEquation(s.FUNC_ADD),C=Fa,R=Fa),Ct)switch(W){case nl:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case K0:s.blendFunc(s.ONE,s.ONE);break;case Z0:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Q0:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:Ut("WebGLState: Invalid blending: ",W);break}else switch(W){case nl:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case K0:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case Z0:Ut("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Q0:Ut("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ut("WebGLState: Invalid blending: ",W);break}I=null,w=null,P=null,U=null,A.set(0,0,0),D=0,x=W,k=Ct}return}Fe=Fe||Ce,xe=xe||ge,Je=Je||Re,(Ce!==C||Fe!==R)&&(s.blendEquationSeparate(Gt[Ce],Gt[Fe]),C=Ce,R=Fe),(ge!==I||Re!==w||xe!==P||Je!==U)&&(s.blendFuncSeparate(pt[ge],pt[Re],pt[xe],pt[Je]),I=ge,w=Re,P=xe,U=Je),(qe.equals(A)===!1||Lt!==D)&&(s.blendColor(qe.r,qe.g,qe.b,Lt),A.copy(qe),D=Lt),x=W,k=!1}function Pt(W,Ce){W.side===Gi?Ee(s.CULL_FACE):de(s.CULL_FACE);let ge=W.side===si;Ce&&(ge=!ge),gt(ge),W.blending===nl&&W.transparent===!1?St(Lr):St(W.blending,W.blendEquation,W.blendSrc,W.blendDst,W.blendEquationAlpha,W.blendSrcAlpha,W.blendDstAlpha,W.blendColor,W.blendAlpha,W.premultipliedAlpha),c.setFunc(W.depthFunc),c.setTest(W.depthTest),c.setMask(W.depthWrite),l.setMask(W.colorWrite);const Re=W.stencilWrite;d.setTest(Re),Re&&(d.setMask(W.stencilWriteMask),d.setFunc(W.stencilFunc,W.stencilRef,W.stencilFuncMask),d.setOp(W.stencilFail,W.stencilZFail,W.stencilZPass)),Jt(W.polygonOffset,W.polygonOffsetFactor,W.polygonOffsetUnits),W.alphaToCoverage===!0?de(s.SAMPLE_ALPHA_TO_COVERAGE):Ee(s.SAMPLE_ALPHA_TO_COVERAGE)}function gt(W){z!==W&&(W?s.frontFace(s.CW):s.frontFace(s.CCW),z=W)}function Ft(W){W!==BS?(de(s.CULL_FACE),W!==G&&(W===$0?s.cullFace(s.BACK):W===zS?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Ee(s.CULL_FACE),G=W}function qt(W){W!==$&&(ne&&s.lineWidth(W),$=W)}function Jt(W,Ce,ge){W?(de(s.POLYGON_OFFSET_FILL),(H!==Ce||Q!==ge)&&(H=Ce,Q=ge,c.getReversed()&&(Ce=-Ce),s.polygonOffset(Ce,ge))):Ee(s.POLYGON_OFFSET_FILL)}function xt(W){W?de(s.SCISSOR_TEST):Ee(s.SCISSOR_TEST)}function jt(W){W===void 0&&(W=s.TEXTURE0+he-1),Z!==W&&(s.activeTexture(W),Z=W)}function q(W,Ce,ge){ge===void 0&&(Z===null?ge=s.TEXTURE0+he-1:ge=Z);let Re=O[ge];Re===void 0&&(Re={type:void 0,texture:void 0},O[ge]=Re),(Re.type!==W||Re.texture!==Ce)&&(Z!==ge&&(s.activeTexture(ge),Z=ge),s.bindTexture(W,Ce||ae[W]),Re.type=W,Re.texture=Ce)}function pn(){const W=O[Z];W!==void 0&&W.type!==void 0&&(s.bindTexture(W.type,null),W.type=void 0,W.texture=void 0)}function Nt(){try{s.compressedTexImage2D(...arguments)}catch(W){Ut("WebGLState:",W)}}function F(){try{s.compressedTexImage3D(...arguments)}catch(W){Ut("WebGLState:",W)}}function b(){try{s.texSubImage2D(...arguments)}catch(W){Ut("WebGLState:",W)}}function J(){try{s.texSubImage3D(...arguments)}catch(W){Ut("WebGLState:",W)}}function le(){try{s.compressedTexSubImage2D(...arguments)}catch(W){Ut("WebGLState:",W)}}function fe(){try{s.compressedTexSubImage3D(...arguments)}catch(W){Ut("WebGLState:",W)}}function we(){try{s.texStorage2D(...arguments)}catch(W){Ut("WebGLState:",W)}}function Ae(){try{s.texStorage3D(...arguments)}catch(W){Ut("WebGLState:",W)}}function pe(){try{s.texImage2D(...arguments)}catch(W){Ut("WebGLState:",W)}}function _e(){try{s.texImage3D(...arguments)}catch(W){Ut("WebGLState:",W)}}function Pe(W){return m[W]!==void 0?m[W]:s.getParameter(W)}function Ke(W,Ce){m[W]!==Ce&&(s.pixelStorei(W,Ce),m[W]=Ce)}function Ne(W){Ge.equals(W)===!1&&(s.scissor(W.x,W.y,W.z,W.w),Ge.copy(W))}function Te(W){ze.equals(W)===!1&&(s.viewport(W.x,W.y,W.z,W.w),ze.copy(W))}function Ze(W,Ce){let ge=f.get(Ce);ge===void 0&&(ge=new WeakMap,f.set(Ce,ge));let Re=ge.get(W);Re===void 0&&(Re=s.getUniformBlockIndex(Ce,W.name),ge.set(W,Re))}function tt(W,Ce){const Re=f.get(Ce).get(W);h.get(Ce)!==Re&&(s.uniformBlockBinding(Ce,Re,W.__bindingPointIndex),h.set(Ce,Re))}function st(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),c.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),_={},m={},Z=null,O={},g={},y=new WeakMap,M=[],T=null,S=!1,x=null,C=null,I=null,w=null,R=null,P=null,U=null,A=new ht(0,0,0),D=0,k=!1,z=null,G=null,$=null,H=null,Q=null,Ge.set(0,0,s.canvas.width,s.canvas.height),ze.set(0,0,s.canvas.width,s.canvas.height),l.reset(),c.reset(),d.reset()}return{buffers:{color:l,depth:c,stencil:d},enable:de,disable:Ee,bindFramebuffer:$e,drawBuffers:Oe,useProgram:ft,setBlending:St,setMaterial:Pt,setFlipSided:gt,setCullFace:Ft,setLineWidth:qt,setPolygonOffset:Jt,setScissorTest:xt,activeTexture:jt,bindTexture:q,unbindTexture:pn,compressedTexImage2D:Nt,compressedTexImage3D:F,texImage2D:pe,texImage3D:_e,pixelStorei:Ke,getParameter:Pe,updateUBOMapping:Ze,uniformBlockBinding:tt,texStorage2D:we,texStorage3D:Ae,texSubImage2D:b,texSubImage3D:J,compressedTexSubImage2D:le,compressedTexSubImage3D:fe,scissor:Ne,viewport:Te,reset:st}}function iA(s,e,t,i,a,l,c){const d=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,h=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),f=new lt,_=new WeakMap,m=new Set;let g;const y=new WeakMap;let M=!1;try{M=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function T(F,b){return M?new OffscreenCanvas(F,b):cu("canvas")}function S(F,b,J){let le=1;const fe=Nt(F);if((fe.width>J||fe.height>J)&&(le=J/Math.max(fe.width,fe.height)),le<1)if(typeof HTMLImageElement<"u"&&F instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&F instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&F instanceof ImageBitmap||typeof VideoFrame<"u"&&F instanceof VideoFrame){const we=Math.floor(le*fe.width),Ae=Math.floor(le*fe.height);g===void 0&&(g=T(we,Ae));const pe=b?T(we,Ae):g;return pe.width=we,pe.height=Ae,pe.getContext("2d").drawImage(F,0,0,we,Ae),ot("WebGLRenderer: Texture has been resized from ("+fe.width+"x"+fe.height+") to ("+we+"x"+Ae+")."),pe}else return"data"in F&&ot("WebGLRenderer: Image in DataTexture is too big ("+fe.width+"x"+fe.height+")."),F;return F}function x(F){return F.generateMipmaps}function C(F){s.generateMipmap(F)}function I(F){return F.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:F.isWebGL3DRenderTarget?s.TEXTURE_3D:F.isWebGLArrayRenderTarget||F.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function w(F,b,J,le,fe,we=!1){if(F!==null){if(s[F]!==void 0)return s[F];ot("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+F+"'")}let Ae;le&&(Ae=e.get("EXT_texture_norm16"),Ae||ot("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let pe=b;if(b===s.RED&&(J===s.FLOAT&&(pe=s.R32F),J===s.HALF_FLOAT&&(pe=s.R16F),J===s.UNSIGNED_BYTE&&(pe=s.R8),J===s.UNSIGNED_SHORT&&Ae&&(pe=Ae.R16_EXT),J===s.SHORT&&Ae&&(pe=Ae.R16_SNORM_EXT)),b===s.RED_INTEGER&&(J===s.UNSIGNED_BYTE&&(pe=s.R8UI),J===s.UNSIGNED_SHORT&&(pe=s.R16UI),J===s.UNSIGNED_INT&&(pe=s.R32UI),J===s.BYTE&&(pe=s.R8I),J===s.SHORT&&(pe=s.R16I),J===s.INT&&(pe=s.R32I)),b===s.RG&&(J===s.FLOAT&&(pe=s.RG32F),J===s.HALF_FLOAT&&(pe=s.RG16F),J===s.UNSIGNED_BYTE&&(pe=s.RG8),J===s.UNSIGNED_SHORT&&Ae&&(pe=Ae.RG16_EXT),J===s.SHORT&&Ae&&(pe=Ae.RG16_SNORM_EXT)),b===s.RG_INTEGER&&(J===s.UNSIGNED_BYTE&&(pe=s.RG8UI),J===s.UNSIGNED_SHORT&&(pe=s.RG16UI),J===s.UNSIGNED_INT&&(pe=s.RG32UI),J===s.BYTE&&(pe=s.RG8I),J===s.SHORT&&(pe=s.RG16I),J===s.INT&&(pe=s.RG32I)),b===s.RGB_INTEGER&&(J===s.UNSIGNED_BYTE&&(pe=s.RGB8UI),J===s.UNSIGNED_SHORT&&(pe=s.RGB16UI),J===s.UNSIGNED_INT&&(pe=s.RGB32UI),J===s.BYTE&&(pe=s.RGB8I),J===s.SHORT&&(pe=s.RGB16I),J===s.INT&&(pe=s.RGB32I)),b===s.RGBA_INTEGER&&(J===s.UNSIGNED_BYTE&&(pe=s.RGBA8UI),J===s.UNSIGNED_SHORT&&(pe=s.RGBA16UI),J===s.UNSIGNED_INT&&(pe=s.RGBA32UI),J===s.BYTE&&(pe=s.RGBA8I),J===s.SHORT&&(pe=s.RGBA16I),J===s.INT&&(pe=s.RGBA32I)),b===s.RGB&&(J===s.UNSIGNED_SHORT&&Ae&&(pe=Ae.RGB16_EXT),J===s.SHORT&&Ae&&(pe=Ae.RGB16_SNORM_EXT),J===s.UNSIGNED_INT_5_9_9_9_REV&&(pe=s.RGB9_E5),J===s.UNSIGNED_INT_10F_11F_11F_REV&&(pe=s.R11F_G11F_B10F)),b===s.RGBA){const _e=we?lu:At.getTransfer(fe);J===s.FLOAT&&(pe=s.RGBA32F),J===s.HALF_FLOAT&&(pe=s.RGBA16F),J===s.UNSIGNED_BYTE&&(pe=_e===zt?s.SRGB8_ALPHA8:s.RGBA8),J===s.UNSIGNED_SHORT&&Ae&&(pe=Ae.RGBA16_EXT),J===s.SHORT&&Ae&&(pe=Ae.RGBA16_SNORM_EXT),J===s.UNSIGNED_SHORT_4_4_4_4&&(pe=s.RGBA4),J===s.UNSIGNED_SHORT_5_5_5_1&&(pe=s.RGB5_A1)}return(pe===s.R16F||pe===s.R32F||pe===s.RG16F||pe===s.RG32F||pe===s.RGBA16F||pe===s.RGBA32F)&&e.get("EXT_color_buffer_float"),pe}function R(F,b){let J;return F?b===null||b===cr||b===al?J=s.DEPTH24_STENCIL8:b===Xi?J=s.DEPTH32F_STENCIL8:b===sl&&(J=s.DEPTH24_STENCIL8,ot("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===cr||b===al?J=s.DEPTH_COMPONENT24:b===Xi?J=s.DEPTH_COMPONENT32F:b===sl&&(J=s.DEPTH_COMPONENT16),J}function P(F,b){return x(F)===!0||F.isFramebufferTexture&&F.minFilter!==Ln&&F.minFilter!==Vn?Math.log2(Math.max(b.width,b.height))+1:F.mipmaps!==void 0&&F.mipmaps.length>0?F.mipmaps.length:F.isCompressedTexture&&Array.isArray(F.image)?b.mipmaps.length:1}function U(F){const b=F.target;b.removeEventListener("dispose",U),D(b),b.isVideoTexture&&_.delete(b),b.isHTMLTexture&&m.delete(b)}function A(F){const b=F.target;b.removeEventListener("dispose",A),z(b)}function D(F){const b=i.get(F);if(b.__webglInit===void 0)return;const J=F.source,le=y.get(J);if(le){const fe=le[b.__cacheKey];fe.usedTimes--,fe.usedTimes===0&&k(F),Object.keys(le).length===0&&y.delete(J)}i.remove(F)}function k(F){const b=i.get(F);s.deleteTexture(b.__webglTexture);const J=F.source,le=y.get(J);delete le[b.__cacheKey],c.memory.textures--}function z(F){const b=i.get(F);if(F.depthTexture&&(F.depthTexture.dispose(),i.remove(F.depthTexture)),F.isWebGLCubeRenderTarget)for(let le=0;le<6;le++){if(Array.isArray(b.__webglFramebuffer[le]))for(let fe=0;fe<b.__webglFramebuffer[le].length;fe++)s.deleteFramebuffer(b.__webglFramebuffer[le][fe]);else s.deleteFramebuffer(b.__webglFramebuffer[le]);b.__webglDepthbuffer&&s.deleteRenderbuffer(b.__webglDepthbuffer[le])}else{if(Array.isArray(b.__webglFramebuffer))for(let le=0;le<b.__webglFramebuffer.length;le++)s.deleteFramebuffer(b.__webglFramebuffer[le]);else s.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&s.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&s.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let le=0;le<b.__webglColorRenderbuffer.length;le++)b.__webglColorRenderbuffer[le]&&s.deleteRenderbuffer(b.__webglColorRenderbuffer[le]);b.__webglDepthRenderbuffer&&s.deleteRenderbuffer(b.__webglDepthRenderbuffer)}const J=F.textures;for(let le=0,fe=J.length;le<fe;le++){const we=i.get(J[le]);we.__webglTexture&&(s.deleteTexture(we.__webglTexture),c.memory.textures--),i.remove(J[le])}i.remove(F)}let G=0;function $(){G=0}function H(){return G}function Q(F){G=F}function he(){const F=G;return F>=a.maxTextures&&ot("WebGLTextures: Trying to use "+(F+1)+" texture units while this GPU supports only "+a.maxTextures),G+=1,F}function ne(F){const b=[];return b.push(F.wrapS),b.push(F.wrapT),b.push(F.wrapR||0),b.push(F.magFilter),b.push(F.minFilter),b.push(F.anisotropy),b.push(F.internalFormat),b.push(F.format),b.push(F.type),b.push(F.generateMipmaps),b.push(F.premultiplyAlpha),b.push(F.flipY),b.push(F.unpackAlignment),b.push(F.colorSpace),b.join()}function ee(F,b){const J=i.get(F);if(F.isVideoTexture&&q(F),F.isRenderTargetTexture===!1&&F.isExternalTexture!==!0&&F.version>0&&J.__version!==F.version){const le=F.image;if(le===null)ot("WebGLRenderer: Texture marked for update but no image data found.");else if(le.complete===!1)ot("WebGLRenderer: Texture marked for update but image is incomplete");else{Ee(J,F,b);return}}else F.isExternalTexture&&(J.__webglTexture=F.sourceTexture?F.sourceTexture:null);t.bindTexture(s.TEXTURE_2D,J.__webglTexture,s.TEXTURE0+b)}function K(F,b){const J=i.get(F);if(F.isRenderTargetTexture===!1&&F.version>0&&J.__version!==F.version){Ee(J,F,b);return}else F.isExternalTexture&&(J.__webglTexture=F.sourceTexture?F.sourceTexture:null);t.bindTexture(s.TEXTURE_2D_ARRAY,J.__webglTexture,s.TEXTURE0+b)}function Z(F,b){const J=i.get(F);if(F.isRenderTargetTexture===!1&&F.version>0&&J.__version!==F.version){Ee(J,F,b);return}t.bindTexture(s.TEXTURE_3D,J.__webglTexture,s.TEXTURE0+b)}function O(F,b){const J=i.get(F);if(F.isCubeDepthTexture!==!0&&F.version>0&&J.__version!==F.version){$e(J,F,b);return}t.bindTexture(s.TEXTURE_CUBE_MAP,J.__webglTexture,s.TEXTURE0+b)}const se={[Zh]:s.REPEAT,[Nr]:s.CLAMP_TO_EDGE,[Qh]:s.MIRRORED_REPEAT},Se={[Ln]:s.NEAREST,[lM]:s.NEAREST_MIPMAP_NEAREST,[yc]:s.NEAREST_MIPMAP_LINEAR,[Vn]:s.LINEAR,[oh]:s.LINEAR_MIPMAP_NEAREST,[ks]:s.LINEAR_MIPMAP_LINEAR},Ge={[hM]:s.NEVER,[_M]:s.ALWAYS,[fM]:s.LESS,[Xf]:s.LEQUAL,[pM]:s.EQUAL,[qf]:s.GEQUAL,[mM]:s.GREATER,[gM]:s.NOTEQUAL};function ze(F,b){if(b.type===Xi&&e.has("OES_texture_float_linear")===!1&&(b.magFilter===Vn||b.magFilter===oh||b.magFilter===yc||b.magFilter===ks||b.minFilter===Vn||b.minFilter===oh||b.minFilter===yc||b.minFilter===ks)&&ot("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(F,s.TEXTURE_WRAP_S,se[b.wrapS]),s.texParameteri(F,s.TEXTURE_WRAP_T,se[b.wrapT]),(F===s.TEXTURE_3D||F===s.TEXTURE_2D_ARRAY)&&s.texParameteri(F,s.TEXTURE_WRAP_R,se[b.wrapR]),s.texParameteri(F,s.TEXTURE_MAG_FILTER,Se[b.magFilter]),s.texParameteri(F,s.TEXTURE_MIN_FILTER,Se[b.minFilter]),b.compareFunction&&(s.texParameteri(F,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(F,s.TEXTURE_COMPARE_FUNC,Ge[b.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===Ln||b.minFilter!==yc&&b.minFilter!==ks||b.type===Xi&&e.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||i.get(b).__currentAnisotropy){const J=e.get("EXT_texture_filter_anisotropic");s.texParameterf(F,J.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,a.getMaxAnisotropy())),i.get(b).__currentAnisotropy=b.anisotropy}}}function Ve(F,b){let J=!1;F.__webglInit===void 0&&(F.__webglInit=!0,b.addEventListener("dispose",U));const le=b.source;let fe=y.get(le);fe===void 0&&(fe={},y.set(le,fe));const we=ne(b);if(we!==F.__cacheKey){fe[we]===void 0&&(fe[we]={texture:s.createTexture(),usedTimes:0},c.memory.textures++,J=!0),fe[we].usedTimes++;const Ae=fe[F.__cacheKey];Ae!==void 0&&(fe[F.__cacheKey].usedTimes--,Ae.usedTimes===0&&k(b)),F.__cacheKey=we,F.__webglTexture=fe[we].texture}return J}function ae(F,b,J){return Math.floor(Math.floor(F/J)/b)}function de(F,b,J,le){const we=F.updateRanges;if(we.length===0)t.texSubImage2D(s.TEXTURE_2D,0,0,0,b.width,b.height,J,le,b.data);else{we.sort((Ke,Ne)=>Ke.start-Ne.start);let Ae=0;for(let Ke=1;Ke<we.length;Ke++){const Ne=we[Ae],Te=we[Ke],Ze=Ne.start+Ne.count,tt=ae(Te.start,b.width,4),st=ae(Ne.start,b.width,4);Te.start<=Ze+1&&tt===st&&ae(Te.start+Te.count-1,b.width,4)===tt?Ne.count=Math.max(Ne.count,Te.start+Te.count-Ne.start):(++Ae,we[Ae]=Te)}we.length=Ae+1;const pe=t.getParameter(s.UNPACK_ROW_LENGTH),_e=t.getParameter(s.UNPACK_SKIP_PIXELS),Pe=t.getParameter(s.UNPACK_SKIP_ROWS);t.pixelStorei(s.UNPACK_ROW_LENGTH,b.width);for(let Ke=0,Ne=we.length;Ke<Ne;Ke++){const Te=we[Ke],Ze=Math.floor(Te.start/4),tt=Math.ceil(Te.count/4),st=Ze%b.width,W=Math.floor(Ze/b.width),Ce=tt,ge=1;t.pixelStorei(s.UNPACK_SKIP_PIXELS,st),t.pixelStorei(s.UNPACK_SKIP_ROWS,W),t.texSubImage2D(s.TEXTURE_2D,0,st,W,Ce,ge,J,le,b.data)}F.clearUpdateRanges(),t.pixelStorei(s.UNPACK_ROW_LENGTH,pe),t.pixelStorei(s.UNPACK_SKIP_PIXELS,_e),t.pixelStorei(s.UNPACK_SKIP_ROWS,Pe)}}function Ee(F,b,J){let le=s.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(le=s.TEXTURE_2D_ARRAY),b.isData3DTexture&&(le=s.TEXTURE_3D);const fe=Ve(F,b),we=b.source;t.bindTexture(le,F.__webglTexture,s.TEXTURE0+J);const Ae=i.get(we);if(we.version!==Ae.__version||fe===!0){if(t.activeTexture(s.TEXTURE0+J),(typeof ImageBitmap<"u"&&b.image instanceof ImageBitmap)===!1){const ge=At.getPrimaries(At.workingColorSpace),Re=b.colorSpace===as?null:At.getPrimaries(b.colorSpace),Fe=b.colorSpace===as||ge===Re?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,b.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Fe)}t.pixelStorei(s.UNPACK_ALIGNMENT,b.unpackAlignment);let _e=S(b.image,!1,a.maxTextureSize);_e=pn(b,_e);const Pe=l.convert(b.format,b.colorSpace),Ke=l.convert(b.type);let Ne=w(b.internalFormat,Pe,Ke,b.normalized,b.colorSpace,b.isVideoTexture);ze(le,b);let Te;const Ze=b.mipmaps,tt=b.isVideoTexture!==!0,st=Ae.__version===void 0||fe===!0,W=we.dataReady,Ce=P(b,_e);if(b.isDepthTexture)Ne=R(b.format===Bs,b.type),st&&(tt?t.texStorage2D(s.TEXTURE_2D,1,Ne,_e.width,_e.height):t.texImage2D(s.TEXTURE_2D,0,Ne,_e.width,_e.height,0,Pe,Ke,null));else if(b.isDataTexture)if(Ze.length>0){tt&&st&&t.texStorage2D(s.TEXTURE_2D,Ce,Ne,Ze[0].width,Ze[0].height);for(let ge=0,Re=Ze.length;ge<Re;ge++)Te=Ze[ge],tt?W&&t.texSubImage2D(s.TEXTURE_2D,ge,0,0,Te.width,Te.height,Pe,Ke,Te.data):t.texImage2D(s.TEXTURE_2D,ge,Ne,Te.width,Te.height,0,Pe,Ke,Te.data);b.generateMipmaps=!1}else tt?(st&&t.texStorage2D(s.TEXTURE_2D,Ce,Ne,_e.width,_e.height),W&&de(b,_e,Pe,Ke)):t.texImage2D(s.TEXTURE_2D,0,Ne,_e.width,_e.height,0,Pe,Ke,_e.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){tt&&st&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Ce,Ne,Ze[0].width,Ze[0].height,_e.depth);for(let ge=0,Re=Ze.length;ge<Re;ge++)if(Te=Ze[ge],b.format!==qi)if(Pe!==null)if(tt){if(W)if(b.layerUpdates.size>0){const Fe=Fg(Te.width,Te.height,b.format,b.type);for(const xe of b.layerUpdates){const Je=Te.data.subarray(xe*Fe/Te.data.BYTES_PER_ELEMENT,(xe+1)*Fe/Te.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,ge,0,0,xe,Te.width,Te.height,1,Pe,Je)}}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,ge,0,0,0,Te.width,Te.height,_e.depth,Pe,Te.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,ge,Ne,Te.width,Te.height,_e.depth,0,Te.data,0,0);else ot("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else tt?W&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,ge,0,0,0,Te.width,Te.height,_e.depth,Pe,Ke,Te.data):t.texImage3D(s.TEXTURE_2D_ARRAY,ge,Ne,Te.width,Te.height,_e.depth,0,Pe,Ke,Te.data);b.layerUpdates.size>0&&b.clearLayerUpdates()}else{tt&&st&&t.texStorage2D(s.TEXTURE_2D,Ce,Ne,Ze[0].width,Ze[0].height);for(let ge=0,Re=Ze.length;ge<Re;ge++)Te=Ze[ge],b.format!==qi?Pe!==null?tt?W&&t.compressedTexSubImage2D(s.TEXTURE_2D,ge,0,0,Te.width,Te.height,Pe,Te.data):t.compressedTexImage2D(s.TEXTURE_2D,ge,Ne,Te.width,Te.height,0,Te.data):ot("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):tt?W&&t.texSubImage2D(s.TEXTURE_2D,ge,0,0,Te.width,Te.height,Pe,Ke,Te.data):t.texImage2D(s.TEXTURE_2D,ge,Ne,Te.width,Te.height,0,Pe,Ke,Te.data)}else if(b.isDataArrayTexture)if(tt){if(st&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Ce,Ne,_e.width,_e.height,_e.depth),W)if(b.layerUpdates.size>0){const ge=Fg(_e.width,_e.height,b.format,b.type);for(const Re of b.layerUpdates){const Fe=_e.data.subarray(Re*ge/_e.data.BYTES_PER_ELEMENT,(Re+1)*ge/_e.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,Re,_e.width,_e.height,1,Pe,Ke,Fe)}b.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,_e.width,_e.height,_e.depth,Pe,Ke,_e.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,Ne,_e.width,_e.height,_e.depth,0,Pe,Ke,_e.data);else if(b.isData3DTexture)tt?(st&&t.texStorage3D(s.TEXTURE_3D,Ce,Ne,_e.width,_e.height,_e.depth),W&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,_e.width,_e.height,_e.depth,Pe,Ke,_e.data)):t.texImage3D(s.TEXTURE_3D,0,Ne,_e.width,_e.height,_e.depth,0,Pe,Ke,_e.data);else if(b.isFramebufferTexture){if(st)if(tt)t.texStorage2D(s.TEXTURE_2D,Ce,Ne,_e.width,_e.height);else{let ge=_e.width,Re=_e.height;for(let Fe=0;Fe<Ce;Fe++)t.texImage2D(s.TEXTURE_2D,Fe,Ne,ge,Re,0,Pe,Ke,null),ge>>=1,Re>>=1}}else if(b.isHTMLTexture){if("texElementImage2D"in s){const ge=s.canvas;if(ge.hasAttribute("layoutsubtree")||ge.setAttribute("layoutsubtree","true"),_e.parentNode!==ge){ge.appendChild(_e),m.add(b),ge.onpaint=Re=>{const Fe=Re.changedElements;for(const xe of m)Fe.includes(xe.image)&&(xe.needsUpdate=!0)},ge.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,_e);else{const Fe=s.RGBA,xe=s.RGBA,Je=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,Fe,xe,Je,_e)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(Ze.length>0){if(tt&&st){const ge=Nt(Ze[0]);t.texStorage2D(s.TEXTURE_2D,Ce,Ne,ge.width,ge.height)}for(let ge=0,Re=Ze.length;ge<Re;ge++)Te=Ze[ge],tt?W&&t.texSubImage2D(s.TEXTURE_2D,ge,0,0,Pe,Ke,Te):t.texImage2D(s.TEXTURE_2D,ge,Ne,Pe,Ke,Te);b.generateMipmaps=!1}else if(tt){if(st){const ge=Nt(_e);t.texStorage2D(s.TEXTURE_2D,Ce,Ne,ge.width,ge.height)}W&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,Pe,Ke,_e)}else t.texImage2D(s.TEXTURE_2D,0,Ne,Pe,Ke,_e);x(b)&&C(le),Ae.__version=we.version,b.onUpdate&&b.onUpdate(b)}F.__version=b.version}function $e(F,b,J){if(b.image.length!==6)return;const le=Ve(F,b),fe=b.source;t.bindTexture(s.TEXTURE_CUBE_MAP,F.__webglTexture,s.TEXTURE0+J);const we=i.get(fe);if(fe.version!==we.__version||le===!0){t.activeTexture(s.TEXTURE0+J);const Ae=At.getPrimaries(At.workingColorSpace),pe=b.colorSpace===as?null:At.getPrimaries(b.colorSpace),_e=b.colorSpace===as||Ae===pe?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,b.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),t.pixelStorei(s.UNPACK_ALIGNMENT,b.unpackAlignment),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,_e);const Pe=b.isCompressedTexture||b.image[0].isCompressedTexture,Ke=b.image[0]&&b.image[0].isDataTexture,Ne=[];for(let xe=0;xe<6;xe++)!Pe&&!Ke?Ne[xe]=S(b.image[xe],!0,a.maxCubemapSize):Ne[xe]=Ke?b.image[xe].image:b.image[xe],Ne[xe]=pn(b,Ne[xe]);const Te=Ne[0],Ze=l.convert(b.format,b.colorSpace),tt=l.convert(b.type),st=w(b.internalFormat,Ze,tt,b.normalized,b.colorSpace),W=b.isVideoTexture!==!0,Ce=we.__version===void 0||le===!0,ge=fe.dataReady;let Re=P(b,Te);ze(s.TEXTURE_CUBE_MAP,b);let Fe;if(Pe){W&&Ce&&t.texStorage2D(s.TEXTURE_CUBE_MAP,Re,st,Te.width,Te.height);for(let xe=0;xe<6;xe++){Fe=Ne[xe].mipmaps;for(let Je=0;Je<Fe.length;Je++){const qe=Fe[Je];b.format!==qi?Ze!==null?W?ge&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xe,Je,0,0,qe.width,qe.height,Ze,qe.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xe,Je,st,qe.width,qe.height,0,qe.data):ot("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):W?ge&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xe,Je,0,0,qe.width,qe.height,Ze,tt,qe.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xe,Je,st,qe.width,qe.height,0,Ze,tt,qe.data)}}}else{if(Fe=b.mipmaps,W&&Ce){Fe.length>0&&Re++;const xe=Nt(Ne[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,Re,st,xe.width,xe.height)}for(let xe=0;xe<6;xe++)if(Ke){W?ge&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xe,0,0,0,Ne[xe].width,Ne[xe].height,Ze,tt,Ne[xe].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xe,0,st,Ne[xe].width,Ne[xe].height,0,Ze,tt,Ne[xe].data);for(let Je=0;Je<Fe.length;Je++){const Lt=Fe[Je].image[xe].image;W?ge&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xe,Je+1,0,0,Lt.width,Lt.height,Ze,tt,Lt.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xe,Je+1,st,Lt.width,Lt.height,0,Ze,tt,Lt.data)}}else{W?ge&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xe,0,0,0,Ze,tt,Ne[xe]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xe,0,st,Ze,tt,Ne[xe]);for(let Je=0;Je<Fe.length;Je++){const qe=Fe[Je];W?ge&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xe,Je+1,0,0,Ze,tt,qe.image[xe]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xe,Je+1,st,Ze,tt,qe.image[xe])}}}x(b)&&C(s.TEXTURE_CUBE_MAP),we.__version=fe.version,b.onUpdate&&b.onUpdate(b)}F.__version=b.version}function Oe(F,b,J,le,fe,we){const Ae=l.convert(J.format,J.colorSpace),pe=l.convert(J.type),_e=w(J.internalFormat,Ae,pe,J.normalized,J.colorSpace),Pe=i.get(b),Ke=i.get(J);if(Ke.__renderTarget=b,!Pe.__hasExternalTextures){const Ne=Math.max(1,b.width>>we),Te=Math.max(1,b.height>>we);fe===s.TEXTURE_3D||fe===s.TEXTURE_2D_ARRAY?t.texImage3D(fe,we,_e,Ne,Te,b.depth,0,Ae,pe,null):t.texImage2D(fe,we,_e,Ne,Te,0,Ae,pe,null)}t.bindFramebuffer(s.FRAMEBUFFER,F),jt(b)?d.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,le,fe,Ke.__webglTexture,0,xt(b)):(fe===s.TEXTURE_2D||fe>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&fe<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,le,fe,Ke.__webglTexture,we),t.bindFramebuffer(s.FRAMEBUFFER,null)}function ft(F,b,J){if(s.bindRenderbuffer(s.RENDERBUFFER,F),b.depthBuffer){const le=b.depthTexture,fe=le&&le.isDepthTexture?le.type:null,we=R(b.stencilBuffer,fe),Ae=b.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;jt(b)?d.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,xt(b),we,b.width,b.height):J?s.renderbufferStorageMultisample(s.RENDERBUFFER,xt(b),we,b.width,b.height):s.renderbufferStorage(s.RENDERBUFFER,we,b.width,b.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,Ae,s.RENDERBUFFER,F)}else{const le=b.textures;for(let fe=0;fe<le.length;fe++){const we=le[fe],Ae=l.convert(we.format,we.colorSpace),pe=l.convert(we.type),_e=w(we.internalFormat,Ae,pe,we.normalized,we.colorSpace);jt(b)?d.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,xt(b),_e,b.width,b.height):J?s.renderbufferStorageMultisample(s.RENDERBUFFER,xt(b),_e,b.width,b.height):s.renderbufferStorage(s.RENDERBUFFER,_e,b.width,b.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Gt(F,b,J){const le=b.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(s.FRAMEBUFFER,F),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const fe=i.get(b.depthTexture);if(fe.__renderTarget=b,(!fe.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),le){if(fe.__webglInit===void 0&&(fe.__webglInit=!0,b.depthTexture.addEventListener("dispose",U)),fe.__webglTexture===void 0){fe.__webglTexture=s.createTexture(),t.bindTexture(s.TEXTURE_CUBE_MAP,fe.__webglTexture),ze(s.TEXTURE_CUBE_MAP,b.depthTexture);const Pe=l.convert(b.depthTexture.format),Ke=l.convert(b.depthTexture.type);let Ne;b.depthTexture.format===Ir?Ne=s.DEPTH_COMPONENT24:b.depthTexture.format===Bs&&(Ne=s.DEPTH24_STENCIL8);for(let Te=0;Te<6;Te++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Te,0,Ne,b.width,b.height,0,Pe,Ke,null)}}else ee(b.depthTexture,0);const we=fe.__webglTexture,Ae=xt(b),pe=le?s.TEXTURE_CUBE_MAP_POSITIVE_X+J:s.TEXTURE_2D,_e=b.depthTexture.format===Bs?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(b.depthTexture.format===Ir)jt(b)?d.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,_e,pe,we,0,Ae):s.framebufferTexture2D(s.FRAMEBUFFER,_e,pe,we,0);else if(b.depthTexture.format===Bs)jt(b)?d.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,_e,pe,we,0,Ae):s.framebufferTexture2D(s.FRAMEBUFFER,_e,pe,we,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function pt(F){const b=i.get(F),J=F.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==F.depthTexture){const le=F.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),le){const fe=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,le.removeEventListener("dispose",fe)};le.addEventListener("dispose",fe),b.__depthDisposeCallback=fe}b.__boundDepthTexture=le}if(F.depthTexture&&!b.__autoAllocateDepthBuffer)if(J)for(let le=0;le<6;le++)Gt(b.__webglFramebuffer[le],F,le);else{const le=F.texture.mipmaps;le&&le.length>0?Gt(b.__webglFramebuffer[0],F,0):Gt(b.__webglFramebuffer,F,0)}else if(J){b.__webglDepthbuffer=[];for(let le=0;le<6;le++)if(t.bindFramebuffer(s.FRAMEBUFFER,b.__webglFramebuffer[le]),b.__webglDepthbuffer[le]===void 0)b.__webglDepthbuffer[le]=s.createRenderbuffer(),ft(b.__webglDepthbuffer[le],F,!1);else{const fe=F.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,we=b.__webglDepthbuffer[le];s.bindRenderbuffer(s.RENDERBUFFER,we),s.framebufferRenderbuffer(s.FRAMEBUFFER,fe,s.RENDERBUFFER,we)}}else{const le=F.texture.mipmaps;if(le&&le.length>0?t.bindFramebuffer(s.FRAMEBUFFER,b.__webglFramebuffer[0]):t.bindFramebuffer(s.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=s.createRenderbuffer(),ft(b.__webglDepthbuffer,F,!1);else{const fe=F.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,we=b.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,we),s.framebufferRenderbuffer(s.FRAMEBUFFER,fe,s.RENDERBUFFER,we)}}t.bindFramebuffer(s.FRAMEBUFFER,null)}function St(F,b,J){const le=i.get(F);b!==void 0&&Oe(le.__webglFramebuffer,F,F.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),J!==void 0&&pt(F)}function Pt(F){const b=F.texture,J=i.get(F),le=i.get(b);F.addEventListener("dispose",A);const fe=F.textures,we=F.isWebGLCubeRenderTarget===!0,Ae=fe.length>1;if(Ae||(le.__webglTexture===void 0&&(le.__webglTexture=s.createTexture()),le.__version=b.version,c.memory.textures++),we){J.__webglFramebuffer=[];for(let pe=0;pe<6;pe++)if(b.mipmaps&&b.mipmaps.length>0){J.__webglFramebuffer[pe]=[];for(let _e=0;_e<b.mipmaps.length;_e++)J.__webglFramebuffer[pe][_e]=s.createFramebuffer()}else J.__webglFramebuffer[pe]=s.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){J.__webglFramebuffer=[];for(let pe=0;pe<b.mipmaps.length;pe++)J.__webglFramebuffer[pe]=s.createFramebuffer()}else J.__webglFramebuffer=s.createFramebuffer();if(Ae)for(let pe=0,_e=fe.length;pe<_e;pe++){const Pe=i.get(fe[pe]);Pe.__webglTexture===void 0&&(Pe.__webglTexture=s.createTexture(),c.memory.textures++)}if(F.samples>0&&jt(F)===!1){J.__webglMultisampledFramebuffer=s.createFramebuffer(),J.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,J.__webglMultisampledFramebuffer);for(let pe=0;pe<fe.length;pe++){const _e=fe[pe];J.__webglColorRenderbuffer[pe]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,J.__webglColorRenderbuffer[pe]);const Pe=l.convert(_e.format,_e.colorSpace),Ke=l.convert(_e.type),Ne=w(_e.internalFormat,Pe,Ke,_e.normalized,_e.colorSpace,F.isXRRenderTarget===!0),Te=xt(F);s.renderbufferStorageMultisample(s.RENDERBUFFER,Te,Ne,F.width,F.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+pe,s.RENDERBUFFER,J.__webglColorRenderbuffer[pe])}s.bindRenderbuffer(s.RENDERBUFFER,null),F.depthBuffer&&(J.__webglDepthRenderbuffer=s.createRenderbuffer(),ft(J.__webglDepthRenderbuffer,F,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(we){t.bindTexture(s.TEXTURE_CUBE_MAP,le.__webglTexture),ze(s.TEXTURE_CUBE_MAP,b);for(let pe=0;pe<6;pe++)if(b.mipmaps&&b.mipmaps.length>0)for(let _e=0;_e<b.mipmaps.length;_e++)Oe(J.__webglFramebuffer[pe][_e],F,b,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,_e);else Oe(J.__webglFramebuffer[pe],F,b,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0);x(b)&&C(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ae){for(let pe=0,_e=fe.length;pe<_e;pe++){const Pe=fe[pe],Ke=i.get(Pe);let Ne=s.TEXTURE_2D;(F.isWebGL3DRenderTarget||F.isWebGLArrayRenderTarget)&&(Ne=F.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(Ne,Ke.__webglTexture),ze(Ne,Pe),Oe(J.__webglFramebuffer,F,Pe,s.COLOR_ATTACHMENT0+pe,Ne,0),x(Pe)&&C(Ne)}t.unbindTexture()}else{let pe=s.TEXTURE_2D;if((F.isWebGL3DRenderTarget||F.isWebGLArrayRenderTarget)&&(pe=F.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(pe,le.__webglTexture),ze(pe,b),b.mipmaps&&b.mipmaps.length>0)for(let _e=0;_e<b.mipmaps.length;_e++)Oe(J.__webglFramebuffer[_e],F,b,s.COLOR_ATTACHMENT0,pe,_e);else Oe(J.__webglFramebuffer,F,b,s.COLOR_ATTACHMENT0,pe,0);x(b)&&C(pe),t.unbindTexture()}F.depthBuffer&&pt(F)}function gt(F){const b=F.textures;for(let J=0,le=b.length;J<le;J++){const fe=b[J];if(x(fe)){const we=I(F),Ae=i.get(fe).__webglTexture;t.bindTexture(we,Ae),C(we),t.unbindTexture()}}}const Ft=[],qt=[];function Jt(F){if(F.samples>0){if(jt(F)===!1){const b=F.textures,J=F.width,le=F.height;let fe=s.COLOR_BUFFER_BIT;const we=F.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Ae=i.get(F),pe=b.length>1;if(pe)for(let Pe=0;Pe<b.length;Pe++)t.bindFramebuffer(s.FRAMEBUFFER,Ae.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Pe,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,Ae.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Pe,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,Ae.__webglMultisampledFramebuffer);const _e=F.texture.mipmaps;_e&&_e.length>0?t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ae.__webglFramebuffer[0]):t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ae.__webglFramebuffer);for(let Pe=0;Pe<b.length;Pe++){if(F.resolveDepthBuffer&&(F.depthBuffer&&(fe|=s.DEPTH_BUFFER_BIT),F.stencilBuffer&&F.resolveStencilBuffer&&(fe|=s.STENCIL_BUFFER_BIT)),pe){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,Ae.__webglColorRenderbuffer[Pe]);const Ke=i.get(b[Pe]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Ke,0)}s.blitFramebuffer(0,0,J,le,0,0,J,le,fe,s.NEAREST),h===!0&&(Ft.length=0,qt.length=0,Ft.push(s.COLOR_ATTACHMENT0+Pe),F.depthBuffer&&F.storeMultisampledDepthBuffer===!1&&(Ft.push(we),qt.push(we),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,qt)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,Ft))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),pe)for(let Pe=0;Pe<b.length;Pe++){t.bindFramebuffer(s.FRAMEBUFFER,Ae.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Pe,s.RENDERBUFFER,Ae.__webglColorRenderbuffer[Pe]);const Ke=i.get(b[Pe]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,Ae.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Pe,s.TEXTURE_2D,Ke,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ae.__webglMultisampledFramebuffer)}else if(F.depthBuffer&&F.storeMultisampledDepthBuffer===!1&&h){const b=F.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[b])}}}function xt(F){return Math.min(a.maxSamples,F.samples)}function jt(F){const b=i.get(F);return F.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function q(F){const b=c.render.frame;_.get(F)!==b&&(_.set(F,b),F.update())}function pn(F,b){const J=F.colorSpace,le=F.format,fe=F.type;return F.isCompressedTexture===!0||F.isVideoTexture===!0||J!==ou&&J!==as&&(At.getTransfer(J)===zt?(le!==qi||fe!==mi)&&ot("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ut("WebGLTextures: Unsupported texture color space:",J)),b}function Nt(F){return typeof HTMLImageElement<"u"&&F instanceof HTMLImageElement?(f.width=F.naturalWidth||F.width,f.height=F.naturalHeight||F.height):typeof VideoFrame<"u"&&F instanceof VideoFrame?(f.width=F.displayWidth,f.height=F.displayHeight):(f.width=F.width,f.height=F.height),f}this.allocateTextureUnit=he,this.resetTextureUnits=$,this.getTextureUnits=H,this.setTextureUnits=Q,this.setTexture2D=ee,this.setTexture2DArray=K,this.setTexture3D=Z,this.setTextureCube=O,this.rebindTextures=St,this.setupRenderTarget=Pt,this.updateRenderTargetMipmap=gt,this.updateMultisampleRenderTarget=Jt,this.setupDepthRenderbuffer=pt,this.setupFrameBufferTexture=Oe,this.useMultisampledRTT=jt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function rA(s,e){function t(i,a=as){let l;const c=At.getTransfer(a);if(i===mi)return s.UNSIGNED_BYTE;if(i===zf)return s.UNSIGNED_SHORT_4_4_4_4;if(i===Hf)return s.UNSIGNED_SHORT_5_5_5_1;if(i===X_)return s.UNSIGNED_INT_5_9_9_9_REV;if(i===q_)return s.UNSIGNED_INT_10F_11F_11F_REV;if(i===W_)return s.BYTE;if(i===j_)return s.SHORT;if(i===sl)return s.UNSIGNED_SHORT;if(i===Bf)return s.INT;if(i===cr)return s.UNSIGNED_INT;if(i===Xi)return s.FLOAT;if(i===ur)return s.HALF_FLOAT;if(i===Y_)return s.ALPHA;if(i===$_)return s.RGB;if(i===qi)return s.RGBA;if(i===Ir)return s.DEPTH_COMPONENT;if(i===Bs)return s.DEPTH_STENCIL;if(i===Vf)return s.RED;if(i===Gf)return s.RED_INTEGER;if(i===$s)return s.RG;if(i===Wf)return s.RG_INTEGER;if(i===jf)return s.RGBA_INTEGER;if(i===Kc||i===Zc||i===Qc||i===Jc)if(c===zt)if(l=e.get("WEBGL_compressed_texture_s3tc_srgb"),l!==null){if(i===Kc)return l.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Zc)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Qc)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Jc)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(l=e.get("WEBGL_compressed_texture_s3tc"),l!==null){if(i===Kc)return l.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Zc)return l.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Qc)return l.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Jc)return l.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Jh||i===ef||i===tf||i===nf)if(l=e.get("WEBGL_compressed_texture_pvrtc"),l!==null){if(i===Jh)return l.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===ef)return l.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===tf)return l.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===nf)return l.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===rf||i===sf||i===af||i===of||i===lf||i===ru||i===cf)if(l=e.get("WEBGL_compressed_texture_etc"),l!==null){if(i===rf||i===sf)return c===zt?l.COMPRESSED_SRGB8_ETC2:l.COMPRESSED_RGB8_ETC2;if(i===af)return c===zt?l.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:l.COMPRESSED_RGBA8_ETC2_EAC;if(i===of)return l.COMPRESSED_R11_EAC;if(i===lf)return l.COMPRESSED_SIGNED_R11_EAC;if(i===ru)return l.COMPRESSED_RG11_EAC;if(i===cf)return l.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===uf||i===df||i===hf||i===ff||i===pf||i===mf||i===gf||i===_f||i===xf||i===vf||i===yf||i===Sf||i===Mf||i===Ef)if(l=e.get("WEBGL_compressed_texture_astc"),l!==null){if(i===uf)return c===zt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:l.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===df)return c===zt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:l.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===hf)return c===zt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:l.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===ff)return c===zt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:l.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===pf)return c===zt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:l.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===mf)return c===zt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:l.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===gf)return c===zt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:l.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===_f)return c===zt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:l.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===xf)return c===zt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:l.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===vf)return c===zt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:l.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===yf)return c===zt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:l.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Sf)return c===zt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:l.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Mf)return c===zt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:l.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Ef)return c===zt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:l.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===wf||i===bf||i===Tf)if(l=e.get("EXT_texture_compression_bptc"),l!==null){if(i===wf)return c===zt?l.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:l.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===bf)return l.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Tf)return l.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Af||i===Cf||i===su||i===Rf)if(l=e.get("EXT_texture_compression_rgtc"),l!==null){if(i===Af)return l.COMPRESSED_RED_RGTC1_EXT;if(i===Cf)return l.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===su)return l.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Rf)return l.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===al?s.UNSIGNED_INT_24_8:s[i]!==void 0?s[i]:null}return{convert:t}}const sA=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,aA=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class oA{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new rx(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new hr({vertexShader:sA,fragmentShader:aA,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new dt(new Yi(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class lA extends ms{constructor(e,t){super();const i=this;let a=null,l=1,c=null,d="local-floor",h=1,f=null,_=null,m=null,g=null,y=null,M=null;const T=typeof XRWebGLBinding<"u",S=new oA,x={},C=t.getContextAttributes();let I=null,w=null;const R=[],P=[],U=new lt;let A=null,D=null;const k=new pi;k.viewport=new sn;const z=new pi;z.viewport=new sn;const G=[k,z],$=new m1;let H=null,Q=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ae){let de=R[ae];return de===void 0&&(de=new mh,R[ae]=de),de.getTargetRaySpace()},this.getControllerGrip=function(ae){let de=R[ae];return de===void 0&&(de=new mh,R[ae]=de),de.getGripSpace()},this.getHand=function(ae){let de=R[ae];return de===void 0&&(de=new mh,R[ae]=de),de.getHandSpace()};function he(ae){const de=P.indexOf(ae.inputSource);if(de===-1)return;const Ee=R[de];Ee!==void 0&&(Ee.update(ae.inputSource,ae.frame,f||c),Ee.dispatchEvent({type:ae.type,data:ae.inputSource}))}function ne(){a.removeEventListener("select",he),a.removeEventListener("selectstart",he),a.removeEventListener("selectend",he),a.removeEventListener("squeeze",he),a.removeEventListener("squeezestart",he),a.removeEventListener("squeezeend",he),a.removeEventListener("end",ne),a.removeEventListener("inputsourceschange",ee);for(let ae=0;ae<R.length;ae++){const de=P[ae];de!==null&&(P[ae]=null,R[ae].disconnect(de))}H=null,Q=null,S.reset();for(const ae in x)delete x[ae];if(e.setRenderTarget(I),y=null,g=null,m=null,a=null,w=null,Ve.stop(),i.isPresenting=!1,e.setPixelRatio(A),e.setSize(U.width,U.height,!1),D!==null){const ae=D.camera;ae.fov=D.fov,ae.zoom=D.zoom,ae.updateProjectionMatrix(),D=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(ae){l=ae,i.isPresenting===!0&&ot("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ae){d=ae,i.isPresenting===!0&&ot("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return f||c},this.setReferenceSpace=function(ae){f=ae},this.getBaseLayer=function(){return g!==null?g:y},this.getBinding=function(){return m===null&&T&&(m=new XRWebGLBinding(a,t)),m},this.getFrame=function(){return M},this.getSession=function(){return a},this.setSession=async function(ae){if(a=ae,a!==null){if(I=e.getRenderTarget(),a.addEventListener("select",he),a.addEventListener("selectstart",he),a.addEventListener("selectend",he),a.addEventListener("squeeze",he),a.addEventListener("squeezestart",he),a.addEventListener("squeezeend",he),a.addEventListener("end",ne),a.addEventListener("inputsourceschange",ee),C.xrCompatible!==!0&&await t.makeXRCompatible(),A=e.getPixelRatio(),e.getSize(U),T&&"createProjectionLayer"in XRWebGLBinding.prototype){let Ee=null,$e=null,Oe=null;C.depth&&(Oe=C.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Ee=C.stencil?Bs:Ir,$e=C.stencil?al:cr);const ft={colorFormat:t.RGBA8,depthFormat:Oe,scaleFactor:l};m=this.getBinding(),g=m.createProjectionLayer(ft),a.updateRenderState({layers:[g]}),e.setPixelRatio(1),e.setSize(g.textureWidth,g.textureHeight,!1),w=new $i(g.textureWidth,g.textureHeight,{format:qi,type:mi,depthTexture:new cl(g.textureWidth,g.textureHeight,$e,void 0,void 0,void 0,void 0,void 0,void 0,Ee),stencilBuffer:C.stencil,colorSpace:e.outputColorSpace,samples:C.antialias?4:0,resolveDepthBuffer:g.ignoreDepthValues===!1,resolveStencilBuffer:g.ignoreDepthValues===!1,storeMultisampledDepthBuffer:g.ignoreDepthValues===!1,storeMultisampledStencilBuffer:g.ignoreDepthValues===!1})}else{const Ee={antialias:C.antialias,alpha:!0,depth:C.depth,stencil:C.stencil,framebufferScaleFactor:l};y=new XRWebGLLayer(a,t,Ee),a.updateRenderState({baseLayer:y}),e.setPixelRatio(1),e.setSize(y.framebufferWidth,y.framebufferHeight,!1),w=new $i(y.framebufferWidth,y.framebufferHeight,{format:qi,type:mi,colorSpace:e.outputColorSpace,stencilBuffer:C.stencil,resolveDepthBuffer:y.ignoreDepthValues===!1,resolveStencilBuffer:y.ignoreDepthValues===!1,storeMultisampledDepthBuffer:y.ignoreDepthValues===!1,storeMultisampledStencilBuffer:y.ignoreDepthValues===!1})}w.isXRRenderTarget=!0,this.setFoveation(h),f=null,c=await a.requestReferenceSpace(d),Ve.setContext(a),Ve.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return S.getDepthTexture()};function ee(ae){for(let de=0;de<ae.removed.length;de++){const Ee=ae.removed[de],$e=P.indexOf(Ee);$e>=0&&(P[$e]=null,R[$e].disconnect(Ee))}for(let de=0;de<ae.added.length;de++){const Ee=ae.added[de];let $e=P.indexOf(Ee);if($e===-1){for(let ft=0;ft<R.length;ft++)if(ft>=P.length){P.push(Ee),$e=ft;break}else if(P[ft]===null){P[ft]=Ee,$e=ft;break}if($e===-1)break}const Oe=R[$e];Oe&&Oe.connect(Ee)}}const K=new X,Z=new X;function O(ae,de,Ee){K.setFromMatrixPosition(de.matrixWorld),Z.setFromMatrixPosition(Ee.matrixWorld);const $e=K.distanceTo(Z),Oe=de.projectionMatrix.elements,ft=Ee.projectionMatrix.elements,Gt=Oe[14]/(Oe[10]-1),pt=Oe[14]/(Oe[10]+1),St=(Oe[9]+1)/Oe[5],Pt=(Oe[9]-1)/Oe[5],gt=(Oe[8]-1)/Oe[0],Ft=(ft[8]+1)/ft[0],qt=Gt*gt,Jt=Gt*Ft,xt=$e/(-gt+Ft),jt=xt*-gt;if(de.matrixWorld.decompose(ae.position,ae.quaternion,ae.scale),ae.translateX(jt),ae.translateZ(xt),ae.matrixWorld.compose(ae.position,ae.quaternion,ae.scale),ae.matrixWorldInverse.copy(ae.matrixWorld).invert(),Oe[10]===-1)ae.projectionMatrix.copy(de.projectionMatrix),ae.projectionMatrixInverse.copy(de.projectionMatrixInverse);else{const q=Gt+xt,pn=pt+xt,Nt=qt-jt,F=Jt+($e-jt),b=St*pt/pn*q,J=Pt*pt/pn*q;ae.projectionMatrix.makePerspective(Nt,F,b,J,q,pn),ae.projectionMatrixInverse.copy(ae.projectionMatrix).invert()}}function se(ae,de){de===null?ae.matrixWorld.copy(ae.matrix):ae.matrixWorld.multiplyMatrices(de.matrixWorld,ae.matrix),ae.matrixWorldInverse.copy(ae.matrixWorld).invert()}this.updateCamera=function(ae){if(a===null)return;let de=ae.near,Ee=ae.far;S.texture!==null&&(S.depthNear>0&&(de=S.depthNear),S.depthFar>0&&(Ee=S.depthFar)),$.near=z.near=k.near=de,$.far=z.far=k.far=Ee,(H!==$.near||Q!==$.far)&&(a.updateRenderState({depthNear:$.near,depthFar:$.far}),H=$.near,Q=$.far),$.layers.mask=ae.layers.mask|6,k.layers.mask=$.layers.mask&-5,z.layers.mask=$.layers.mask&-3;const $e=ae.parent,Oe=$.cameras;se($,$e);for(let ft=0;ft<Oe.length;ft++)se(Oe[ft],$e);Oe.length===2?O($,k,z):$.projectionMatrix.copy(k.projectionMatrix),D===null&&ae.isPerspectiveCamera&&(D={camera:ae,fov:ae.fov,zoom:ae.zoom}),Se(ae,$,$e)};function Se(ae,de,Ee){Ee===null?ae.matrix.copy(de.matrixWorld):(ae.matrix.copy(Ee.matrixWorld),ae.matrix.invert(),ae.matrix.multiply(de.matrixWorld)),ae.matrix.decompose(ae.position,ae.quaternion,ae.scale),ae.updateMatrixWorld(!0),ae.projectionMatrix.copy(de.projectionMatrix),ae.projectionMatrixInverse.copy(de.projectionMatrixInverse),ae.isPerspectiveCamera&&(ae.fov=uu*2*Math.atan(1/ae.projectionMatrix.elements[5]),ae.zoom=1)}this.getCamera=function(){return $},this.getFoveation=function(){if(!(g===null&&y===null))return h},this.setFoveation=function(ae){h=ae,g!==null&&(g.fixedFoveation=ae),y!==null&&y.fixedFoveation!==void 0&&(y.fixedFoveation=ae)},this.hasDepthSensing=function(){return S.texture!==null},this.getDepthSensingMesh=function(){return S.getMesh($)},this.getCameraTexture=function(ae){return x[ae]};let Ge=null;function ze(ae,de){if(_=de.getViewerPose(f||c),M=de,_!==null){const Ee=_.views;y!==null&&(e.setRenderTargetFramebuffer(w,y.framebuffer),e.setRenderTarget(w));let $e=!1;Ee.length!==$.cameras.length&&($.cameras.length=0,$e=!0);for(let pt=0;pt<Ee.length;pt++){const St=Ee[pt];let Pt=null;if(y!==null)Pt=y.getViewport(St);else{const Ft=m.getViewSubImage(g,St);Pt=Ft.viewport,pt===0&&(e.setRenderTargetTextures(w,Ft.colorTexture,Ft.depthStencilTexture),e.setRenderTarget(w))}let gt=G[pt];gt===void 0&&(gt=new pi,gt.layers.enable(pt),gt.viewport=new sn,G[pt]=gt),gt.matrix.fromArray(St.transform.matrix),gt.matrix.decompose(gt.position,gt.quaternion,gt.scale),gt.projectionMatrix.fromArray(St.projectionMatrix),gt.projectionMatrixInverse.copy(gt.projectionMatrix).invert(),gt.viewport.set(Pt.x,Pt.y,Pt.width,Pt.height),pt===0&&($.matrix.copy(gt.matrix),$.matrix.decompose($.position,$.quaternion,$.scale)),$e===!0&&$.cameras.push(gt)}const Oe=a.enabledFeatures;if(Oe&&Oe.includes("depth-sensing")&&a.depthUsage=="gpu-optimized"&&T){m=i.getBinding();const pt=m.getDepthInformation(Ee[0]);pt&&pt.isValid&&pt.texture&&S.init(pt,a.renderState)}if(Oe&&Oe.includes("camera-access")&&T){e.state.unbindTexture(),m=i.getBinding();for(let pt=0;pt<Ee.length;pt++){const St=Ee[pt].camera;if(St){let Pt=x[St];Pt||(Pt=new rx,x[St]=Pt);const gt=m.getCameraImage(St);Pt.sourceTexture=gt}}}}for(let Ee=0;Ee<R.length;Ee++){const $e=P[Ee],Oe=R[Ee];$e!==null&&Oe!==void 0&&Oe.update($e,de,f||c)}Ge&&Ge(ae,de),de.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:de}),M=null}const Ve=new lx;Ve.setAnimationLoop(ze),this.setAnimationLoop=function(ae){Ge=ae},this.dispose=function(){}}}const cA=new Vt,mx=new mt;mx.set(-1,0,0,0,1,0,0,0,1);function uA(s,e){function t(S,x){S.matrixAutoUpdate===!0&&S.updateMatrix(),x.value.copy(S.matrix)}function i(S,x){x.color.getRGB(S.fogColor.value,sx(s)),x.isFog?(S.fogNear.value=x.near,S.fogFar.value=x.far):x.isFogExp2&&(S.fogDensity.value=x.density)}function a(S,x,C,I,w){x.isNodeMaterial?x.uniformsNeedUpdate=!1:x.isMeshBasicMaterial?l(S,x):x.isMeshLambertMaterial?(l(S,x),x.envMap&&(S.envMapIntensity.value=x.envMapIntensity)):x.isMeshToonMaterial?(l(S,x),m(S,x)):x.isMeshPhongMaterial?(l(S,x),_(S,x),x.envMap&&(S.envMapIntensity.value=x.envMapIntensity)):x.isMeshStandardMaterial?(l(S,x),g(S,x),x.isMeshPhysicalMaterial&&y(S,x,w)):x.isMeshMatcapMaterial?(l(S,x),M(S,x)):x.isMeshDepthMaterial?l(S,x):x.isMeshDistanceMaterial?(l(S,x),T(S,x)):x.isMeshNormalMaterial?l(S,x):x.isLineBasicMaterial?(c(S,x),x.isLineDashedMaterial&&d(S,x)):x.isPointsMaterial?h(S,x,C,I):x.isSpriteMaterial?f(S,x):x.isShadowMaterial?(S.color.value.copy(x.color),S.opacity.value=x.opacity):x.isShaderMaterial&&(x.uniformsNeedUpdate=!1)}function l(S,x){S.opacity.value=x.opacity,x.color&&S.diffuse.value.copy(x.color),x.emissive&&S.emissive.value.copy(x.emissive).multiplyScalar(x.emissiveIntensity),x.map&&(S.map.value=x.map,t(x.map,S.mapTransform)),x.alphaMap&&(S.alphaMap.value=x.alphaMap,t(x.alphaMap,S.alphaMapTransform)),x.bumpMap&&(S.bumpMap.value=x.bumpMap,t(x.bumpMap,S.bumpMapTransform),S.bumpScale.value=x.bumpScale,x.side===si&&(S.bumpScale.value*=-1)),x.normalMap&&(S.normalMap.value=x.normalMap,t(x.normalMap,S.normalMapTransform),S.normalScale.value.copy(x.normalScale),x.side===si&&S.normalScale.value.negate()),x.displacementMap&&(S.displacementMap.value=x.displacementMap,t(x.displacementMap,S.displacementMapTransform),S.displacementScale.value=x.displacementScale,S.displacementBias.value=x.displacementBias),x.emissiveMap&&(S.emissiveMap.value=x.emissiveMap,t(x.emissiveMap,S.emissiveMapTransform)),x.specularMap&&(S.specularMap.value=x.specularMap,t(x.specularMap,S.specularMapTransform)),x.alphaTest>0&&(S.alphaTest.value=x.alphaTest);const C=e.get(x),I=C.envMap,w=C.envMapRotation;I&&(S.envMap.value=I,S.envMapRotation.value.setFromMatrix4(cA.makeRotationFromEuler(w)).transpose(),I.isCubeTexture&&I.isRenderTargetTexture===!1&&S.envMapRotation.value.premultiply(mx),S.reflectivity.value=x.reflectivity,S.ior.value=x.ior,S.refractionRatio.value=x.refractionRatio),x.lightMap&&(S.lightMap.value=x.lightMap,S.lightMapIntensity.value=x.lightMapIntensity,t(x.lightMap,S.lightMapTransform)),x.aoMap&&(S.aoMap.value=x.aoMap,S.aoMapIntensity.value=x.aoMapIntensity,t(x.aoMap,S.aoMapTransform))}function c(S,x){S.diffuse.value.copy(x.color),S.opacity.value=x.opacity,x.map&&(S.map.value=x.map,t(x.map,S.mapTransform))}function d(S,x){S.dashSize.value=x.dashSize,S.totalSize.value=x.dashSize+x.gapSize,S.scale.value=x.scale}function h(S,x,C,I){S.diffuse.value.copy(x.color),S.opacity.value=x.opacity,S.size.value=x.size*C,S.scale.value=I*.5,x.map&&(S.map.value=x.map,t(x.map,S.uvTransform)),x.alphaMap&&(S.alphaMap.value=x.alphaMap,t(x.alphaMap,S.alphaMapTransform)),x.alphaTest>0&&(S.alphaTest.value=x.alphaTest)}function f(S,x){S.diffuse.value.copy(x.color),S.opacity.value=x.opacity,S.rotation.value=x.rotation,x.map&&(S.map.value=x.map,t(x.map,S.mapTransform)),x.alphaMap&&(S.alphaMap.value=x.alphaMap,t(x.alphaMap,S.alphaMapTransform)),x.alphaTest>0&&(S.alphaTest.value=x.alphaTest)}function _(S,x){S.specular.value.copy(x.specular),S.shininess.value=Math.max(x.shininess,1e-4)}function m(S,x){x.gradientMap&&(S.gradientMap.value=x.gradientMap)}function g(S,x){S.metalness.value=x.metalness,x.metalnessMap&&(S.metalnessMap.value=x.metalnessMap,t(x.metalnessMap,S.metalnessMapTransform)),S.roughness.value=x.roughness,x.roughnessMap&&(S.roughnessMap.value=x.roughnessMap,t(x.roughnessMap,S.roughnessMapTransform)),x.envMap&&(S.envMapIntensity.value=x.envMapIntensity)}function y(S,x,C){S.ior.value=x.ior,x.sheen>0&&(S.sheenColor.value.copy(x.sheenColor).multiplyScalar(x.sheen),S.sheenRoughness.value=x.sheenRoughness,x.sheenColorMap&&(S.sheenColorMap.value=x.sheenColorMap,t(x.sheenColorMap,S.sheenColorMapTransform)),x.sheenRoughnessMap&&(S.sheenRoughnessMap.value=x.sheenRoughnessMap,t(x.sheenRoughnessMap,S.sheenRoughnessMapTransform))),x.clearcoat>0&&(S.clearcoat.value=x.clearcoat,S.clearcoatRoughness.value=x.clearcoatRoughness,x.clearcoatMap&&(S.clearcoatMap.value=x.clearcoatMap,t(x.clearcoatMap,S.clearcoatMapTransform)),x.clearcoatRoughnessMap&&(S.clearcoatRoughnessMap.value=x.clearcoatRoughnessMap,t(x.clearcoatRoughnessMap,S.clearcoatRoughnessMapTransform)),x.clearcoatNormalMap&&(S.clearcoatNormalMap.value=x.clearcoatNormalMap,t(x.clearcoatNormalMap,S.clearcoatNormalMapTransform),S.clearcoatNormalScale.value.copy(x.clearcoatNormalScale),x.side===si&&S.clearcoatNormalScale.value.negate())),x.dispersion>0&&(S.dispersion.value=x.dispersion),x.retroreflectivity>0&&(S.retroreflectivity.value=x.retroreflectivity),x.iridescence>0&&(S.iridescence.value=x.iridescence,S.iridescenceIOR.value=x.iridescenceIOR,S.iridescenceThicknessMinimum.value=x.iridescenceThicknessRange[0],S.iridescenceThicknessMaximum.value=x.iridescenceThicknessRange[1],x.iridescenceMap&&(S.iridescenceMap.value=x.iridescenceMap,t(x.iridescenceMap,S.iridescenceMapTransform)),x.iridescenceThicknessMap&&(S.iridescenceThicknessMap.value=x.iridescenceThicknessMap,t(x.iridescenceThicknessMap,S.iridescenceThicknessMapTransform))),x.transmission>0&&(S.transmission.value=x.transmission,S.transmissionSamplerMap.value=C.texture,S.transmissionSamplerSize.value.set(C.width,C.height),x.transmissionMap&&(S.transmissionMap.value=x.transmissionMap,t(x.transmissionMap,S.transmissionMapTransform)),S.thickness.value=x.thickness,x.thicknessMap&&(S.thicknessMap.value=x.thicknessMap,t(x.thicknessMap,S.thicknessMapTransform)),S.attenuationDistance.value=x.attenuationDistance,S.attenuationColor.value.copy(x.attenuationColor)),x.anisotropy>0&&(S.anisotropyVector.value.set(x.anisotropy*Math.cos(x.anisotropyRotation),x.anisotropy*Math.sin(x.anisotropyRotation)),x.anisotropyMap&&(S.anisotropyMap.value=x.anisotropyMap,t(x.anisotropyMap,S.anisotropyMapTransform))),S.specularIntensity.value=x.specularIntensity,S.specularColor.value.copy(x.specularColor),x.specularColorMap&&(S.specularColorMap.value=x.specularColorMap,t(x.specularColorMap,S.specularColorMapTransform)),x.specularIntensityMap&&(S.specularIntensityMap.value=x.specularIntensityMap,t(x.specularIntensityMap,S.specularIntensityMapTransform))}function M(S,x){x.matcap&&(S.matcap.value=x.matcap)}function T(S,x){const C=e.get(x).light;S.referencePosition.value.setFromMatrixPosition(C.matrixWorld),S.nearDistance.value=C.shadow.camera.near,S.farDistance.value=C.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:a}}function dA(s,e,t,i){let a={},l={},c=[];const d=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function h(w,R){const P=R.program;i.uniformBlockBinding(w,P)}function f(w,R){let P=a[w.id];P===void 0&&(S(w),P=_(w),a[w.id]=P,w.addEventListener("dispose",C));const U=R.program;i.updateUBOMapping(w,U);const A=e.render.frame;l[w.id]!==A&&(g(w),l[w.id]=A)}function _(w){const R=m();w.__bindingPointIndex=R;const P=s.createBuffer(),U=w.__size,A=w.usage;return s.bindBuffer(s.UNIFORM_BUFFER,P),s.bufferData(s.UNIFORM_BUFFER,U,A),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,R,P),P}function m(){for(let w=0;w<d;w++)if(c.indexOf(w)===-1)return c.push(w),w;return Ut("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function g(w){const R=a[w.id],P=w.uniforms,U=w.__cache;s.bindBuffer(s.UNIFORM_BUFFER,R);for(let A=0,D=P.length;A<D;A++){const k=P[A];if(Array.isArray(k))for(let z=0,G=k.length;z<G;z++)y(k[z],A,z,U);else y(k,A,0,U)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function y(w,R,P,U){if(T(w,R,P,U)===!0){const A=w.__offset,D=w.value;if(Array.isArray(D)){let k=0;for(let z=0;z<D.length;z++){const G=D[z],$=x(G);M(G,w.__data,k),typeof G!="number"&&typeof G!="boolean"&&!G.isMatrix3&&!ArrayBuffer.isView(G)&&(k+=$.storage/Float32Array.BYTES_PER_ELEMENT)}}else M(D,w.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,A,w.__data)}}function M(w,R,P){typeof w=="number"||typeof w=="boolean"?R[0]=w:w.isMatrix3?(R[0]=w.elements[0],R[1]=w.elements[1],R[2]=w.elements[2],R[3]=0,R[4]=w.elements[3],R[5]=w.elements[4],R[6]=w.elements[5],R[7]=0,R[8]=w.elements[6],R[9]=w.elements[7],R[10]=w.elements[8],R[11]=0):ArrayBuffer.isView(w)?R.set(new w.constructor(w.buffer,w.byteOffset,R.length)):w.toArray(R,P)}function T(w,R,P,U){const A=w.value,D=R+"_"+P;if(U[D]===void 0)return typeof A=="number"||typeof A=="boolean"?U[D]=A:ArrayBuffer.isView(A)?U[D]=A.slice():U[D]=A.clone(),!0;{const k=U[D];if(typeof A=="number"||typeof A=="boolean"){if(k!==A)return U[D]=A,!0}else{if(ArrayBuffer.isView(A))return!0;if(k.equals(A)===!1)return k.copy(A),!0}}return!1}function S(w){const R=w.uniforms;let P=0;const U=16;for(let D=0,k=R.length;D<k;D++){const z=Array.isArray(R[D])?R[D]:[R[D]];for(let G=0,$=z.length;G<$;G++){const H=z[G],Q=Array.isArray(H.value)?H.value:[H.value];for(let he=0,ne=Q.length;he<ne;he++){const ee=Q[he],K=x(ee),Z=P%U,O=Z%K.boundary,se=Z+O;P+=O,se!==0&&U-se<K.storage&&(P+=U-se),H.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),H.__offset=P,P+=K.storage}}}const A=P%U;return A>0&&(P+=U-A),w.__size=P,w.__cache={},this}function x(w){const R={boundary:0,storage:0};return typeof w=="number"||typeof w=="boolean"?(R.boundary=4,R.storage=4):w.isVector2?(R.boundary=8,R.storage=8):w.isVector3||w.isColor?(R.boundary=16,R.storage=12):w.isVector4?(R.boundary=16,R.storage=16):w.isMatrix3?(R.boundary=48,R.storage=48):w.isMatrix4?(R.boundary=64,R.storage=64):w.isTexture?ot("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(w)?(R.boundary=16,R.storage=w.byteLength):ot("WebGLRenderer: Unsupported uniform value type.",w),R}function C(w){const R=w.target;R.removeEventListener("dispose",C);const P=c.indexOf(R.__bindingPointIndex);c.splice(P,1),s.deleteBuffer(a[R.id]),delete a[R.id],delete l[R.id]}function I(){for(const w in a)s.deleteBuffer(a[w]);c=[],a={},l={}}return{bind:h,update:f,dispose:I}}const hA=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let tr=null;function fA(){return tr===null&&(tr=new nx(hA,16,16,$s,ur),tr.name="DFG_LUT",tr.minFilter=Vn,tr.magFilter=Vn,tr.wrapS=Nr,tr.wrapT=Nr,tr.generateMipmaps=!1,tr.needsUpdate=!0),tr}class pA{constructor(e={}){const{canvas:t=yM(),context:i=null,depth:a=!0,stencil:l=!1,alpha:c=!1,antialias:d=!1,premultipliedAlpha:h=!0,preserveDrawingBuffer:f=!1,powerPreference:_="default",failIfMajorPerformanceCaveat:m=!1,reversedDepthBuffer:g=!1,outputBufferType:y=mi}=e;this.isWebGLRenderer=!0;let M;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");M=i.getContextAttributes().alpha}else M=c;const T=y,S=new Set([jf,Wf,Gf]),x=new Set([mi,cr,sl,al,zf,Hf]),C=new Uint32Array(4),I=new Int32Array(4),w=new X;let R=null,P=null;const U=[],A=[];let D=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=or,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const k=this;let z=!1,G=null,$=null,H=null,Q=null;this._outputColorSpace=fi;let he=0,ne=0,ee=null,K=-1,Z=null;const O=new sn,se=new sn;let Se=null;const Ge=new ht(0);let ze=0,Ve=t.width,ae=t.height,de=1,Ee=null,$e=null;const Oe=new sn(0,0,Ve,ae),ft=new sn(0,0,Ve,ae);let Gt=!1;const pt=new Kf;let St=!1,Pt=!1;const gt=new Vt,Ft=new X,qt=new sn,Jt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let xt=!1;function jt(){return ee===null?de:1}let q=i;function pn(L,j){return t.getContext(L,j)}let Nt,F,b,J,le,fe,we,Ae,pe,_e,Pe,Ke,Ne,Te,Ze,tt,st,W,Ce,ge,Re,Fe,xe;try{const L={alpha:!0,depth:a,stencil:l,antialias:d,premultipliedAlpha:h,preserveDrawingBuffer:f,powerPreference:_,failIfMajorPerformanceCaveat:m};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ff}`),t.addEventListener("webglcontextlost",Lt,!1),t.addEventListener("webglcontextrestored",Ct,!1),t.addEventListener("webglcontextcreationerror",Cn,!1),q===null){const j="webgl2";if(q=pn(j,L),q===null)throw pn(j)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Je()}catch(L){throw t.removeEventListener("webglcontextlost",Lt,!1),t.removeEventListener("webglcontextrestored",Ct,!1),t.removeEventListener("webglcontextcreationerror",Cn,!1),Ut("WebGLRenderer: "+L.message),L}function Je(){Nt=new fb(q),Nt.init(),Re=new rA(q,Nt),F=new ib(q,Nt,e,Re),b=new nA(q,Nt),F.reversedDepthBuffer&&g&&b.buffers.depth.setReversed(!0),$=q.createFramebuffer(),H=q.createFramebuffer(),Q=q.createFramebuffer(),J=new gb(q),le=new VT,fe=new iA(q,Nt,b,le,F,Re,J),we=new hb(k),Ae=new x1(q),Fe=new tb(q,Ae),pe=new pb(q,Ae,J,Fe),_e=new xb(q,pe,Ae,Fe,J),W=new _b(q,F,fe),Ze=new rb(le),Pe=new HT(k,we,Nt,F,Fe,Ze),Ke=new uA(k,le),Ne=new WT,Te=new KT(Nt),st=new eb(k,we,b,_e,M,h),tt=new tA(k,_e,F),xe=new dA(q,J,F,b),Ce=new nb(q,Nt,J),ge=new mb(q,Nt,J),J.programs=Pe.programs,k.capabilities=F,k.extensions=Nt,k.properties=le,k.renderLists=Ne,k.shadowMap=tt,k.state=b,k.info=J}T!==mi&&(D=new yb(T,t.width,t.height,d,a,l));const qe=new lA(k,q);this.xr=qe,this.getContext=function(){return q},this.getContextAttributes=function(){return q.getContextAttributes()},this.forceContextLoss=function(){const L=Nt.get("WEBGL_lose_context");L&&L.loseContext()},this.forceContextRestore=function(){const L=Nt.get("WEBGL_lose_context");L&&L.restoreContext()},this.getPixelRatio=function(){return de},this.setPixelRatio=function(L){L!==void 0&&(de=L,this.setSize(Ve,ae,!1))},this.getSize=function(L){return L.set(Ve,ae)},this.setSize=function(L,j,ce=!0){if(qe.isPresenting){ot("WebGLRenderer: Can't change size while VR device is presenting.");return}Ve=L,ae=j,t.width=Math.floor(L*de),t.height=Math.floor(j*de),ce===!0&&(t.style.width=L+"px",t.style.height=j+"px"),D!==null&&D.setSize(t.width,t.height),this.setViewport(0,0,L,j)},this.getDrawingBufferSize=function(L){return L.set(Ve*de,ae*de).floor()},this.setDrawingBufferSize=function(L,j,ce){Ve=L,ae=j,de=ce,t.width=Math.floor(L*ce),t.height=Math.floor(j*ce),this.setViewport(0,0,L,j)},this.setEffects=function(L){if(T===mi){Ut("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(L){for(let j=0;j<L.length;j++)if(L[j].isOutputPass===!0){ot("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}D.setEffects(L||[])},this.getCurrentViewport=function(L){return L.copy(O)},this.getViewport=function(L){return L.copy(Oe)},this.setViewport=function(L,j,ce,ie){L.isVector4?Oe.set(L.x,L.y,L.z,L.w):Oe.set(L,j,ce,ie),b.viewport(O.copy(Oe).multiplyScalar(de).round())},this.getScissor=function(L){return L.copy(ft)},this.setScissor=function(L,j,ce,ie){L.isVector4?ft.set(L.x,L.y,L.z,L.w):ft.set(L,j,ce,ie),b.scissor(se.copy(ft).multiplyScalar(de).round())},this.getScissorTest=function(){return Gt},this.setScissorTest=function(L){b.setScissorTest(Gt=L)},this.setOpaqueSort=function(L){Ee=L},this.setTransparentSort=function(L){$e=L},this.getClearColor=function(L){return L.copy(st.getClearColor())},this.setClearColor=function(){st.setClearColor(...arguments)},this.getClearAlpha=function(){return st.getClearAlpha()},this.setClearAlpha=function(){st.setClearAlpha(...arguments)},this.clear=function(L=!0,j=!0,ce=!0){let ie=0;if(L){let te=!1;if(ee!==null){const Ie=ee.texture.format;te=S.has(Ie)}if(te){const Ie=ee.texture.type,Le=x.has(Ie),De=st.getClearColor(),je=st.getClearAlpha(),Qe=De.r,ut=De.g,_t=De.b;Le?(C[0]=Qe,C[1]=ut,C[2]=_t,C[3]=je,q.clearBufferuiv(q.COLOR,0,C)):(I[0]=Qe,I[1]=ut,I[2]=_t,I[3]=je,q.clearBufferiv(q.COLOR,0,I))}else ie|=q.COLOR_BUFFER_BIT}j&&(ie|=q.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),ce&&(ie|=q.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),ie!==0&&q.clear(ie)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(L){L.setRenderer(this),G=L},this.dispose=function(){t.removeEventListener("webglcontextlost",Lt,!1),t.removeEventListener("webglcontextrestored",Ct,!1),t.removeEventListener("webglcontextcreationerror",Cn,!1),st.dispose(),Ne.dispose(),Te.dispose(),le.dispose(),we.dispose(),_e.dispose(),Fe.dispose(),xe.dispose(),Pe.dispose(),qe.dispose(),qe.removeEventListener("sessionstart",pl),qe.removeEventListener("sessionend",ml),Gn.stop()};function Lt(L){L.preventDefault(),tg("WebGLRenderer: Context Lost."),z=!0}function Ct(){tg("WebGLRenderer: Context Restored."),z=!1;const L=J.autoReset,j=tt.enabled,ce=tt.autoUpdate,ie=tt.needsUpdate,te=tt.type;Je(),J.autoReset=L,tt.enabled=j,tt.autoUpdate=ce,tt.needsUpdate=ie,tt.type=te}function Cn(L){Ut("WebGLRenderer: A WebGL context could not be created. Reason: ",L.statusMessage)}function gi(L){const j=L.target;j.removeEventListener("dispose",gi),gs(j)}function gs(L){Qs(L),le.remove(L)}function Qs(L){const j=le.get(L).programs;j!==void 0&&(j.forEach(function(ce){Pe.releaseProgram(ce)}),L.isShaderMaterial&&Pe.releaseShaderCache(L))}this.renderBufferDirect=function(L,j,ce,ie,te,Ie){j===null&&(j=Jt);const Le=te.isMesh&&te.matrixWorld.determinantAffine()<0,De=en(L,j,ce,ie,te);b.setMaterial(ie,Le);let je=ce.index,Qe=1;if(ie.wireframe===!0){if(je=pe.getWireframeAttribute(ce),je===void 0)return;Qe=2}const ut=ce.drawRange,_t=ce.attributes.position;let He=ut.start*Qe,bt=(ut.start+ut.count)*Qe;Ie!==null&&(He=Math.max(He,Ie.start*Qe),bt=Math.min(bt,(Ie.start+Ie.count)*Qe)),je!==null?(He=Math.max(He,0),bt=Math.min(bt,je.count)):_t!=null&&(He=Math.max(He,0),bt=Math.min(bt,_t.count));const an=bt-He;if(an<0||an===1/0)return;Fe.setup(te,ie,De,ce,je);let Wt,Ot=Ce;if(je!==null&&(Wt=Ae.get(je),Ot=ge,Ot.setIndex(Wt)),te.isMesh)ie.wireframe===!0?(b.setLineWidth(ie.wireframeLinewidth*jt()),Ot.setMode(q.LINES)):Ot.setMode(q.TRIANGLES);else if(te.isLine){let mn=ie.linewidth;mn===void 0&&(mn=1),b.setLineWidth(mn*jt()),te.isLineSegments?Ot.setMode(q.LINES):te.isLineLoop?Ot.setMode(q.LINE_LOOP):Ot.setMode(q.LINE_STRIP)}else te.isPoints?Ot.setMode(q.POINTS):te.isSprite&&Ot.setMode(q.TRIANGLES);if(te.isBatchedMesh)if(Nt.get("WEBGL_multi_draw"))Ot.renderMultiDraw(te._multiDrawStarts,te._multiDrawCounts,te._multiDrawCount);else{const mn=te._multiDrawStarts,ke=te._multiDrawCounts,cn=te._multiDrawCount,Tt=je?Ae.get(je).bytesPerElement:1,Dn=le.get(ie).currentProgram.getUniforms();for(let vt=0;vt<cn;vt++)Dn.setValue(q,"_gl_DrawID",vt),Ot.render(mn[vt]/Tt,ke[vt])}else if(te.isInstancedMesh)Ot.renderInstances(He,an,te.count);else if(ce.isInstancedBufferGeometry){const mn=ce._maxInstanceCount!==void 0?ce._maxInstanceCount:1/0,ke=Math.min(ce.instanceCount,mn);Ot.renderInstances(He,an,ke)}else Ot.render(He,an)};function _s(L,j,ce,ie){G!==null&&L.isNodeMaterial&&G.setObject(ie,L),St===!0&&Ze.setState(L,ce,!1),L.transparent===!0&&L.side===Gi&&L.forceSinglePass===!1?(L.side=si,L.needsUpdate=!0,ys(L,j,ie),L.side=qs,L.needsUpdate=!0,ys(L,j,ie),L.side=Gi):ys(L,j,ie)}this.compile=function(L,j,ce=null){ce===null&&(ce=L),G!==null&&G.renderStart(L,j,ce),P=Te.get(ce),P.init(j),A.push(P),ce.traverseVisible(function(te){te.isLight&&te.layers.test(j.layers)&&(P.pushLight(te),te.castShadow&&P.pushShadow(te))}),L!==ce&&L.traverseVisible(function(te){te.isLight&&te.layers.test(j.layers)&&(P.pushLight(te),te.castShadow&&P.pushShadow(te))}),P.setupLights(),G!==null&&G.updateLights(P.state.lightsArray),Pt=this.localClippingEnabled,St=Ze.init(this.clippingPlanes,Pt),St===!0&&Ze.setGlobalState(this.clippingPlanes,j),G!==null&&tt.render(P.state.shadowsArray,ce,j);const ie=new Set;return L.traverse(function(te){if(!(te.isMesh||te.isPoints||te.isLine||te.isSprite))return;const Ie=te.material;if(Ie)if(Array.isArray(Ie))for(let Le=0;Le<Ie.length;Le++){const De=Ie[Le];_s(De,ce,j,te),ie.add(De)}else _s(Ie,ce,j,te),ie.add(Ie)}),P=A.pop(),G!==null&&G.renderEnd(),ie},this.compileAsync=function(L,j,ce=null){const ie=this.compile(L,j,ce);return new Promise(te=>{function Ie(){if(ie.forEach(function(Le){const je=le.get(Le).currentProgram;(je===void 0||je.isReady())&&ie.delete(Le)}),ie.size===0){te(L);return}setTimeout(Ie,10)}Nt.get("KHR_parallel_shader_compile")!==null?Ie():setTimeout(Ie,10)})};let xs=null;function yu(L){xs&&xs(L)}function pl(){Gn.stop()}function ml(){Gn.start()}const Gn=new lx;Gn.setAnimationLoop(yu),typeof self<"u"&&Gn.setContext(self),this.setAnimationLoop=function(L){xs=L,qe.setAnimationLoop(L),L===null?Gn.stop():Gn.start()},qe.addEventListener("sessionstart",pl),qe.addEventListener("sessionend",ml),this.render=function(L,j){if(j!==void 0&&j.isCamera!==!0){Ut("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(z===!0)return;G!==null&&G.renderStart(L,j);const ce=qe.enabled===!0&&qe.isPresenting===!0,ie=D!==null&&(ee===null||ce)&&D.begin(k,ee);if(L.matrixWorldAutoUpdate===!0&&L.updateMatrixWorld(),j.parent===null&&j.matrixWorldAutoUpdate===!0&&j.updateMatrixWorld(),qe.enabled===!0&&qe.isPresenting===!0&&(D===null||D.isCompositing()===!1)&&(qe.cameraAutoUpdate===!0&&qe.updateCamera(j),j=qe.getCamera()),L.isScene===!0&&L.onBeforeRender(k,L,j,ee),P=Te.get(L,A.length),P.init(j),P.state.textureUnits=fe.getTextureUnits(),A.push(P),gt.multiplyMatrices(j.projectionMatrix,j.matrixWorldInverse),pt.setFromProjectionMatrix(gt,ar,j.reversedDepth),Pt=this.localClippingEnabled,St=Ze.init(this.clippingPlanes,Pt),R=Ne.get(L,U.length),R.init(),U.push(R),qe.enabled===!0&&qe.isPresenting===!0){const Le=k.xr.getDepthSensingMesh();Le!==null&&Js(Le,j,-1/0,k.sortObjects)}Js(L,j,0,k.sortObjects),R.finish(),G!==null&&G.updateLights(P.state.lightsArray),k.sortObjects===!0&&R.sort(Ee,$e),xt=qe.enabled===!1||qe.isPresenting===!1||qe.hasDepthSensing()===!1,xt&&st.addToRenderList(R,L),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),St===!0&&Ze.beginShadows();const te=P.state.shadowsArray;if(tt.render(te,L,j),St===!0&&Ze.endShadows(),(ie&&D.hasRenderPass())===!1){const Le=R.opaque,De=R.transmissive;if(P.setupLights(),j.isArrayCamera){const je=j.cameras;if(De.length>0)for(let Qe=0,ut=je.length;Qe<ut;Qe++){const _t=je[Qe];gl(Le,De,L,_t)}xt&&st.render(L);for(let Qe=0,ut=je.length;Qe<ut;Qe++){const _t=je[Qe];no(R,L,_t,_t.viewport)}}else De.length>0&&gl(Le,De,L,j),xt&&st.render(L),no(R,L,j)}ee!==null&&ne===0&&(fe.updateMultisampleRenderTarget(ee),fe.updateRenderTargetMipmap(ee)),ie&&D.end(k),L.isScene===!0&&L.onAfterRender(k,L,j),Fe.resetDefaultState(),K=-1,Z=null,A.pop(),A.length>0?(P=A[A.length-1],fe.setTextureUnits(P.state.textureUnits),St===!0&&Ze.setGlobalState(k.clippingPlanes,P.state.camera)):P=null,U.pop(),U.length>0?R=U[U.length-1]:R=null,G!==null&&G.renderEnd()};function Js(L,j,ce,ie){if(L.visible===!1)return;if(L.layers.test(j.layers)){if(L.isGroup)ce=L.renderOrder;else if(L.isLOD)L.autoUpdate===!0&&L.update(j);else if(L.isLightProbeGrid)P.pushLightProbeGrid(L);else if(L.isLight)P.pushLight(L),L.castShadow&&P.pushShadow(L);else if(L.isSprite){if(!L.frustumCulled||L.intersectsFrustum(pt)){ie&&qt.setFromMatrixPosition(L.matrixWorld).applyMatrix4(gt);const Le=_e.update(L),De=L.material;De.visible&&R.push(L,Le,De,ce,qt.z,null,j)}}else if((L.isMesh||L.isLine||L.isPoints)&&(!L.frustumCulled||L.intersectsFrustum(pt))){const Le=_e.update(L),De=L.material;if(ie&&(L.boundingSphere!==void 0?(L.boundingSphere===null&&L.computeBoundingSphere(),qt.copy(L.boundingSphere.center)):(Le.boundingSphere===null&&Le.computeBoundingSphere(),qt.copy(Le.boundingSphere.center)),qt.applyMatrix4(L.matrixWorld).applyMatrix4(gt)),Array.isArray(De)){const je=Le.groups;for(let Qe=0,ut=je.length;Qe<ut;Qe++){const _t=je[Qe],He=De[_t.materialIndex];He&&He.visible&&R.push(L,Le,He,ce,qt.z,_t,j)}}else De.visible&&R.push(L,Le,De,ce,qt.z,null,j)}}const Ie=L.children;for(let Le=0,De=Ie.length;Le<De;Le++)Js(Ie[Le],j,ce,ie)}function no(L,j,ce,ie){const{opaque:te,transmissive:Ie,transparent:Le}=L;P.setupLightsView(ce),St===!0&&Ze.setGlobalState(k.clippingPlanes,ce),ie&&b.viewport(O.copy(ie)),te.length>0&&vs(te,j,ce),Ie.length>0&&vs(Ie,j,ce),Le.length>0&&vs(Le,j,ce),b.buffers.depth.setTest(!0),b.buffers.depth.setMask(!0),b.buffers.color.setMask(!0),b.setPolygonOffset(!1)}function gl(L,j,ce,ie){if((ce.isScene===!0?ce.overrideMaterial:null)!==null)return;if(P.state.transmissionRenderTarget[ie.id]===void 0){const He=Nt.has("EXT_color_buffer_half_float")||Nt.has("EXT_color_buffer_float");P.state.transmissionRenderTarget[ie.id]=new $i(1,1,{generateMipmaps:!0,type:He?ur:mi,minFilter:ks,samples:Math.max(4,F.samples),stencilBuffer:l,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:At.workingColorSpace})}const Ie=P.state.transmissionRenderTarget[ie.id],Le=ie.viewport||O;Ie.setSize(Le.z*k.transmissionResolutionScale,Le.w*k.transmissionResolutionScale);const De=k.getRenderTarget(),je=k.getActiveCubeFace(),Qe=k.getActiveMipmapLevel();k.setRenderTarget(Ie),k.getClearColor(Ge),ze=k.getClearAlpha(),ze<1&&k.setClearColor(16777215,.5),k.clear(),xt&&st.render(ce);const ut=k.toneMapping;k.toneMapping=or;const _t=ie.viewport;if(ie.viewport!==void 0&&(ie.viewport=void 0),P.setupLightsView(ie),St===!0&&Ze.setGlobalState(k.clippingPlanes,ie),vs(L,ce,ie),fe.updateMultisampleRenderTarget(Ie),fe.updateRenderTargetMipmap(Ie),Nt.has("WEBGL_multisampled_render_to_texture")===!1){let He=!1;for(let bt=0,an=j.length;bt<an;bt++){const Wt=j[bt],{object:Ot,geometry:mn,material:ke,group:cn}=Wt;if(ke.side===Gi&&Ot.layers.test(ie.layers)){const Tt=ke.side;ke.side=si,ke.needsUpdate=!0,io(Ot,ce,ie,mn,ke,cn),ke.side=Tt,ke.needsUpdate=!0,He=!0}}He===!0&&(fe.updateMultisampleRenderTarget(Ie),fe.updateRenderTargetMipmap(Ie))}k.setRenderTarget(De,je,Qe),k.setClearColor(Ge,ze),_t!==void 0&&(ie.viewport=_t),k.toneMapping=ut}function vs(L,j,ce){const ie=j.isScene===!0?j.overrideMaterial:null;for(let te=0,Ie=L.length;te<Ie;te++){const Le=L[te],{object:De,geometry:je,group:Qe}=Le;let ut=Le.material;ut.allowOverride===!0&&ie!==null&&(ut=ie),De.layers.test(ce.layers)&&io(De,j,ce,je,ut,Qe)}}function io(L,j,ce,ie,te,Ie){G!==null&&te.isNodeMaterial&&G.setObject(L,te),L.onBeforeRender(k,j,ce,ie,te,Ie),L.modelViewMatrix.multiplyMatrices(ce.matrixWorldInverse,L.matrixWorld),L.normalMatrix.getNormalMatrix(L.modelViewMatrix),te.onBeforeRender(k,j,ce,ie,L,Ie),te.transparent===!0&&te.side===Gi&&te.forceSinglePass===!1?(te.side=si,te.needsUpdate=!0,k.renderBufferDirect(ce,j,ie,te,L,Ie),te.side=qs,te.needsUpdate=!0,k.renderBufferDirect(ce,j,ie,te,L,Ie),te.side=Gi):k.renderBufferDirect(ce,j,ie,te,L,Ie),L.onAfterRender(k,j,ce,ie,te,Ie)}function ys(L,j,ce){j.isScene!==!0&&(j=Jt);const ie=le.get(L),te=P.state.lights,Ie=P.state.shadowsArray,Le=te.state.version,De=Pe.getParameters(L,te.state,Ie,j,ce,P.state.lightProbeGridArray),je=Pe.getProgramCacheKey(De);let Qe=ie.programs;ie.environment=L.isMeshStandardMaterial||L.isMeshLambertMaterial||L.isMeshPhongMaterial?j.environment:null,ie.fog=j.fog;const ut=L.isMeshStandardMaterial||L.isMeshLambertMaterial&&!L.envMap||L.isMeshPhongMaterial&&!L.envMap;ie.envMap=we.get(L.envMap||ie.environment,ut),ie.envMapRotation=ie.environment!==null&&L.envMap===null?j.environmentRotation:L.envMapRotation,Qe===void 0&&(L.addEventListener("dispose",gi),Qe=new Map,ie.programs=Qe);let _t=Qe.get(je);if(_t!==void 0){if(ie.currentProgram===_t&&ie.lightsStateVersion===Le)return _l(L,De),_t}else De.uniforms=Pe.getUniforms(L),G!==null&&L.isNodeMaterial&&G.build(L,ce,De),L.onBeforeCompile(De,k),_t=Pe.acquireProgram(De,je),Qe.set(je,_t),ie.uniforms=De.uniforms;const He=ie.uniforms;return(!L.isShaderMaterial&&!L.isRawShaderMaterial||L.clipping===!0)&&(He.clippingPlanes=Ze.uniform),_l(L,De),ie.needsLights=so(L),ie.lightsStateVersion=Le,ie.needsLights&&(He.ambientLightColor.value=te.state.ambient,He.lightProbe.value=te.state.probe,He.sunLights.value=te.state.sun,He.sunLightShadows.value=te.state.sunShadow,He.directionalLights.value=te.state.directional,He.directionalLightShadows.value=te.state.directionalShadow,He.spotLights.value=te.state.spot,He.spotLightShadows.value=te.state.spotShadow,He.rectAreaLights.value=te.state.rectArea,He.ltc_1.value=te.state.rectAreaLTC1,He.ltc_2.value=te.state.rectAreaLTC2,He.pointLights.value=te.state.point,He.pointLightShadows.value=te.state.pointShadow,He.hemisphereLights.value=te.state.hemi,He.sunShadowMatrix.value=te.state.sunShadowMatrix,He.sunShadowCascade.value=te.state.sunShadowCascade,He.directionalShadowMatrix.value=te.state.directionalShadowMatrix,He.spotLightMatrix.value=te.state.spotLightMatrix,He.spotLightMap.value=te.state.spotLightMap,He.pointShadowMatrix.value=te.state.pointShadowMatrix),ie.lightProbeGrid=P.state.lightProbeGridArray.length>0,ie.currentProgram=_t,ie.uniformsList=null,_t}function ro(L){if(L.uniformsList===null){const j=L.currentProgram.getUniforms();L.uniformsList=tu.seqWithValue(j.seq,L.uniforms)}return L.uniformsList}function _l(L,j){const ce=le.get(L);ce.outputColorSpace=j.outputColorSpace,ce.batching=j.batching,ce.batchingColor=j.batchingColor,ce.instancing=j.instancing,ce.instancingColor=j.instancingColor,ce.instancingMorph=j.instancingMorph,ce.skinning=j.skinning,ce.morphTargets=j.morphTargets,ce.morphNormals=j.morphNormals,ce.morphColors=j.morphColors,ce.morphTargetsCount=j.morphTargetsCount,ce.numClippingPlanes=j.numClippingPlanes,ce.numIntersection=j.numClipIntersection,ce.vertexAlphas=j.vertexAlphas,ce.vertexTangents=j.vertexTangents,ce.toneMapping=j.toneMapping}function Su(L,j){if(L.length===0)return null;if(L.length===1)return L[0].texture!==null?L[0]:null;w.setFromMatrixPosition(j.matrixWorld);for(let ce=0,ie=L.length;ce<ie;ce++){const te=L[ce];if(te.texture!==null&&te.boundingBox.containsPoint(w))return te}return null}function en(L,j,ce,ie,te){j.isScene!==!0&&(j=Jt),fe.resetTextureUnits();const Ie=j.fog,Le=ie.isMeshStandardMaterial||ie.isMeshLambertMaterial||ie.isMeshPhongMaterial?j.environment:null,De=ee===null?k.outputColorSpace:ee.isXRRenderTarget===!0?ee.texture.colorSpace:At.workingColorSpace,je=ie.isMeshStandardMaterial||ie.isMeshLambertMaterial&&!ie.envMap||ie.isMeshPhongMaterial&&!ie.envMap,Qe=we.get(ie.envMap||Le,je),ut=ie.vertexColors===!0&&!!ce.attributes.color&&ce.attributes.color.itemSize===4,_t=!!ce.attributes.tangent&&(!!ie.normalMap||ie.anisotropy>0),He=!!ce.morphAttributes.position,bt=!!ce.morphAttributes.normal,an=!!ce.morphAttributes.color;let Wt=or;ie.toneMapped&&(ee===null||ee.isXRRenderTarget===!0)&&(Wt=k.toneMapping);const Ot=ce.morphAttributes.position||ce.morphAttributes.normal||ce.morphAttributes.color,mn=Ot!==void 0?Ot.length:0,ke=le.get(ie),cn=P.state.lights;if(St===!0&&(Pt===!0||L!==Z)){const Bt=L===Z&&ie.id===K;Ze.setState(ie,L,Bt)}let Tt=!1;ie.version===ke.__version?(ke.needsLights&&ke.lightsStateVersion!==cn.state.version||ke.outputColorSpace!==De||te.isBatchedMesh&&ke.batching===!1||!te.isBatchedMesh&&ke.batching===!0||te.isBatchedMesh&&ke.batchingColor===!0&&te._colorsTexture===null||te.isBatchedMesh&&ke.batchingColor===!1&&te._colorsTexture!==null||te.isInstancedMesh&&ke.instancing===!1||!te.isInstancedMesh&&ke.instancing===!0||te.isSkinnedMesh&&ke.skinning===!1||!te.isSkinnedMesh&&ke.skinning===!0||te.isInstancedMesh&&ke.instancingColor===!0&&te.instanceColor===null||te.isInstancedMesh&&ke.instancingColor===!1&&te.instanceColor!==null||te.isInstancedMesh&&ke.instancingMorph===!0&&te.morphTexture===null||te.isInstancedMesh&&ke.instancingMorph===!1&&te.morphTexture!==null||ke.envMap!==Qe||ie.fog===!0&&ke.fog!==Ie||ke.numClippingPlanes!==void 0&&(ke.numClippingPlanes!==Ze.numPlanes||ke.numIntersection!==Ze.numIntersection)||ke.vertexAlphas!==ut||ke.vertexTangents!==_t||ke.morphTargets!==He||ke.morphNormals!==bt||ke.morphColors!==an||ke.toneMapping!==Wt||ke.morphTargetsCount!==mn||!!ke.lightProbeGrid!=P.state.lightProbeGridArray.length>0)&&(Tt=!0):(Tt=!0,ke.__version=ie.version);let Dn=ke.currentProgram;Tt===!0&&(Dn=ys(ie,j,te),G&&ie.isNodeMaterial&&G.onUpdateProgram(ie,Dn,ke));let vt=!1,Ci=!1,fr=!1;const Dt=Dn.getUniforms(),Zt=ke.uniforms;if(b.useProgram(Dn.program)&&(vt=!0,Ci=!0,fr=!0),ie.id!==K&&(K=ie.id,Ci=!0),ke.needsLights){const Bt=Su(P.state.lightProbeGridArray,te);ke.lightProbeGrid!==Bt&&(ke.lightProbeGrid=Bt,Ci=!0)}if(vt||Z!==L){b.buffers.depth.getReversed()&&L.reversedDepth!==!0&&(L._reversedDepth=!0,L.updateProjectionMatrix()),Dt.setValue(q,"projectionMatrix",L.projectionMatrix),Dt.setValue(q,"viewMatrix",L.matrixWorldInverse);const _i=Dt.map.cameraPosition;_i!==void 0&&_i.setValue(q,Ft.setFromMatrixPosition(L.matrixWorld)),F.logarithmicDepthBuffer&&Dt.setValue(q,"logDepthBufFC",2/(Math.log(L.far+1)/Math.LN2)),(ie.isMeshPhongMaterial||ie.isMeshToonMaterial||ie.isMeshLambertMaterial||ie.isMeshBasicMaterial||ie.isMeshStandardMaterial||ie.isShaderMaterial)&&Dt.setValue(q,"isOrthographic",L.isOrthographicCamera===!0),Z!==L&&(Z=L,Ci=!0,fr=!0)}if(ke.needsLights&&(cn.state.sunShadowMap.length>0&&Dt.setValue(q,"sunShadowMap",cn.state.sunShadowMap,fe),cn.state.directionalShadowMap.length>0&&Dt.setValue(q,"directionalShadowMap",cn.state.directionalShadowMap,fe),cn.state.spotShadowMap.length>0&&Dt.setValue(q,"spotShadowMap",cn.state.spotShadowMap,fe),cn.state.pointShadowMap.length>0&&Dt.setValue(q,"pointShadowMap",cn.state.pointShadowMap,fe)),te.isSkinnedMesh){Dt.setOptional(q,te,"bindMatrix"),Dt.setOptional(q,te,"bindMatrixInverse");const Bt=te.skeleton;Bt&&(Bt.boneTexture===null&&Bt.computeBoneTexture(),Dt.setValue(q,"boneTexture",Bt.boneTexture,fe))}te.isBatchedMesh&&(Dt.setOptional(q,te,"batchingTexture"),Dt.setValue(q,"batchingTexture",te._matricesTexture,fe),Dt.setOptional(q,te,"batchingIdTexture"),Dt.setValue(q,"batchingIdTexture",te._indirectTexture,fe),Dt.setOptional(q,te,"batchingColorTexture"),te._colorsTexture!==null&&Dt.setValue(q,"batchingColorTexture",te._colorsTexture,fe));const Ri=ce.morphAttributes;if((Ri.position!==void 0||Ri.normal!==void 0||Ri.color!==void 0)&&W.update(te,ce,Dn),(Ci||ke.receiveShadow!==te.receiveShadow)&&(ke.receiveShadow=te.receiveShadow,Dt.setValue(q,"receiveShadow",te.receiveShadow)),(ie.isMeshStandardMaterial||ie.isMeshLambertMaterial||ie.isMeshPhongMaterial)&&ie.envMap===null&&j.environment!==null&&(Zt.envMapIntensity.value=j.environmentIntensity),Zt.dfgLUT!==void 0&&(Zt.dfgLUT.value=fA()),Ci){if(Dt.setValue(q,"toneMappingExposure",k.toneMappingExposure),ke.needsLights&&Mu(Zt,fr),Ie&&ie.fog===!0&&Ke.refreshFogUniforms(Zt,Ie),Ke.refreshMaterialUniforms(Zt,ie,de,ae,P.state.transmissionRenderTarget[L.id]),ke.needsLights&&ke.lightProbeGrid){const Bt=ke.lightProbeGrid;Zt.probesSH.value=Bt.texture,Zt.probesMin.value.copy(Bt.boundingBox.min),Zt.probesMax.value.copy(Bt.boundingBox.max),Zt.probesResolution.value.copy(Bt.resolution)}tu.upload(q,ro(ke),Zt,fe)}if(ie.isShaderMaterial&&ie.uniformsNeedUpdate===!0&&(tu.upload(q,ro(ke),Zt,fe),ie.uniformsNeedUpdate=!1),ie.isSpriteMaterial&&Dt.setValue(q,"center",te.center),Dt.setValue(q,"modelViewMatrix",te.modelViewMatrix),Dt.setValue(q,"normalMatrix",te.normalMatrix),Dt.setValue(q,"modelMatrix",te.matrixWorld),ie.uniformsGroups!==void 0){const Bt=ie.uniformsGroups;for(let _i=0,Pi=Bt.length;_i<Pi;_i++){const Ni=Bt[_i];xe.update(Ni,Dn),xe.bind(Ni,Dn)}}return Dn}function Mu(L,j){L.ambientLightColor.needsUpdate=j,L.lightProbe.needsUpdate=j,L.sunLights.needsUpdate=j,L.sunLightShadows.needsUpdate=j,L.directionalLights.needsUpdate=j,L.directionalLightShadows.needsUpdate=j,L.pointLights.needsUpdate=j,L.pointLightShadows.needsUpdate=j,L.spotLights.needsUpdate=j,L.spotLightShadows.needsUpdate=j,L.rectAreaLights.needsUpdate=j,L.hemisphereLights.needsUpdate=j}function so(L){return L.isMeshLambertMaterial||L.isMeshToonMaterial||L.isMeshPhongMaterial||L.isMeshStandardMaterial||L.isShadowMaterial||L.isShaderMaterial&&L.lights===!0}this.getActiveCubeFace=function(){return he},this.getActiveMipmapLevel=function(){return ne},this.getRenderTarget=function(){return ee},this.setRenderTargetTextures=function(L,j,ce){const ie=le.get(L);ie.__autoAllocateDepthBuffer=L.resolveDepthBuffer===!1,ie.__autoAllocateDepthBuffer===!1&&(ie.__useRenderToTexture=!1),le.get(L.texture).__webglTexture=j,le.get(L.depthTexture).__webglTexture=ie.__autoAllocateDepthBuffer?void 0:ce,ie.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(L,j){const ce=le.get(L);ce.__webglFramebuffer=j,ce.__useDefaultFramebuffer=j===void 0},this.setRenderTarget=function(L,j=0,ce=0){ee=L,he=j,ne=ce;let ie=null,te=!1,Ie=!1;if(L){const De=le.get(L);if(De.__useDefaultFramebuffer!==void 0){b.bindFramebuffer(q.FRAMEBUFFER,De.__webglFramebuffer),O.copy(L.viewport),se.copy(L.scissor),Se=L.scissorTest,b.viewport(O),b.scissor(se),b.setScissorTest(Se),K=-1;return}else if(De.__webglFramebuffer===void 0)fe.setupRenderTarget(L);else if(De.__hasExternalTextures)fe.rebindTextures(L,le.get(L.texture).__webglTexture,le.get(L.depthTexture).__webglTexture);else if(L.depthBuffer){const ut=L.depthTexture;if(De.__boundDepthTexture!==ut){if(ut!==null&&le.has(ut)&&(L.width!==ut.image.width||L.height!==ut.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");fe.setupDepthRenderbuffer(L)}}const je=L.texture;(je.isData3DTexture||je.isDataArrayTexture||je.isCompressedArrayTexture)&&(Ie=!0);const Qe=le.get(L).__webglFramebuffer;L.isWebGLCubeRenderTarget?(Array.isArray(Qe[j])?ie=Qe[j][ce]:ie=Qe[j],te=!0):L.samples>0&&fe.useMultisampledRTT(L)===!1?ie=le.get(L).__webglMultisampledFramebuffer:Array.isArray(Qe)?ie=Qe[ce]:ie=Qe,O.copy(L.viewport),se.copy(L.scissor),Se=L.scissorTest}else O.copy(Oe).multiplyScalar(de).floor(),se.copy(ft).multiplyScalar(de).floor(),Se=Gt;if(ce!==0&&(ie=$),b.bindFramebuffer(q.FRAMEBUFFER,ie)&&b.drawBuffers(L,ie),b.viewport(O),b.scissor(se),b.setScissorTest(Se),te){const De=le.get(L.texture);q.framebufferTexture2D(q.FRAMEBUFFER,q.COLOR_ATTACHMENT0,q.TEXTURE_CUBE_MAP_POSITIVE_X+j,De.__webglTexture,ce)}else if(Ie){const De=j;for(let je=0;je<L.textures.length;je++){const Qe=le.get(L.textures[je]);q.framebufferTextureLayer(q.FRAMEBUFFER,q.COLOR_ATTACHMENT0+je,Qe.__webglTexture,ce,De)}}else if(L!==null&&ce!==0){const De=le.get(L.texture);q.framebufferTexture2D(q.FRAMEBUFFER,q.COLOR_ATTACHMENT0,q.TEXTURE_2D,De.__webglTexture,ce)}K=-1};function ao(L){const j=le.get(L);return(j.__readFormat!==L.format||j.__readType!==L.type)&&(j.__readFormat=L.format,j.__readType=L.type,j.__formatReadable=F.textureFormatReadable(L.format),j.__typeReadable=F.textureTypeReadable(L.type)),j}this.readRenderTargetPixels=function(L,j,ce,ie,te,Ie,Le,De=0){if(!(L&&L.isWebGLRenderTarget)){Ut("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let je=le.get(L).__webglFramebuffer;if(L.isWebGLCubeRenderTarget&&Le!==void 0&&(je=je[Le]),je){b.bindFramebuffer(q.FRAMEBUFFER,je);try{const Qe=L.textures[De],ut=Qe.format,_t=Qe.type;L.textures.length>1&&q.readBuffer(q.COLOR_ATTACHMENT0+De);const He=ao(Qe);if(He.__formatReadable===!1){Ut("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(He.__typeReadable===!1){Ut("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}j>=0&&j<=L.width-ie&&ce>=0&&ce<=L.height-te&&q.readPixels(j,ce,ie,te,Re.convert(ut),Re.convert(_t),Ie)}finally{const Qe=ee!==null?le.get(ee).__webglFramebuffer:null;b.bindFramebuffer(q.FRAMEBUFFER,Qe)}}},this.readRenderTargetPixelsAsync=async function(L,j,ce,ie,te,Ie,Le,De=0){if(!(L&&L.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let je=le.get(L).__webglFramebuffer;if(L.isWebGLCubeRenderTarget&&Le!==void 0&&(je=je[Le]),je)if(j>=0&&j<=L.width-ie&&ce>=0&&ce<=L.height-te){b.bindFramebuffer(q.FRAMEBUFFER,je);const Qe=L.textures[De],ut=Qe.format,_t=Qe.type;L.textures.length>1&&q.readBuffer(q.COLOR_ATTACHMENT0+De);const He=ao(Qe);if(He.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(He.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const bt=q.createBuffer();q.bindBuffer(q.PIXEL_PACK_BUFFER,bt),q.bufferData(q.PIXEL_PACK_BUFFER,Ie.byteLength,q.STREAM_READ),q.readPixels(j,ce,ie,te,Re.convert(ut),Re.convert(_t),0),q.bindBuffer(q.PIXEL_PACK_BUFFER,null);const an=ee!==null?le.get(ee).__webglFramebuffer:null;b.bindFramebuffer(q.FRAMEBUFFER,an);const Wt=q.fenceSync(q.SYNC_GPU_COMMANDS_COMPLETE,0);return q.flush(),await SM(q,Wt,4),q.bindBuffer(q.PIXEL_PACK_BUFFER,bt),q.getBufferSubData(q.PIXEL_PACK_BUFFER,0,Ie),q.bindBuffer(q.PIXEL_PACK_BUFFER,null),q.deleteBuffer(bt),q.deleteSync(Wt),Ie}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(L,j=null,ce=0){const ie=Math.pow(2,-ce),te=Math.floor(L.image.width*ie),Ie=Math.floor(L.image.height*ie),Le=j!==null?j.x:0,De=j!==null?j.y:0;fe.setTexture2D(L,0),q.copyTexSubImage2D(q.TEXTURE_2D,ce,0,0,Le,De,te,Ie),b.unbindTexture()},this.copyTextureToTexture=function(L,j,ce=null,ie=null,te=0,Ie=0){let Le,De,je,Qe,ut,_t,He,bt,an;const Wt=L.isCompressedTexture?L.mipmaps[Ie]:L.image;if(ce!==null)Le=ce.max.x-ce.min.x,De=ce.max.y-ce.min.y,je=ce.isBox3?ce.max.z-ce.min.z:1,Qe=ce.min.x,ut=ce.min.y,_t=ce.isBox3?ce.min.z:0;else{const Zt=Math.pow(2,-te);Le=Math.floor(Wt.width*Zt),De=Math.floor(Wt.height*Zt),L.isDataArrayTexture?je=Wt.depth:L.isData3DTexture?je=Math.floor(Wt.depth*Zt):je=1,Qe=0,ut=0,_t=0}ie!==null?(He=ie.x,bt=ie.y,an=ie.z):(He=0,bt=0,an=0);const Ot=Re.convert(j.format),mn=Re.convert(j.type);let ke;j.isData3DTexture?(fe.setTexture3D(j,0),ke=q.TEXTURE_3D):j.isDataArrayTexture||j.isCompressedArrayTexture?(fe.setTexture2DArray(j,0),ke=q.TEXTURE_2D_ARRAY):(fe.setTexture2D(j,0),ke=q.TEXTURE_2D),b.activeTexture(q.TEXTURE0),b.pixelStorei(q.UNPACK_FLIP_Y_WEBGL,j.flipY),b.pixelStorei(q.UNPACK_PREMULTIPLY_ALPHA_WEBGL,j.premultiplyAlpha),b.pixelStorei(q.UNPACK_ALIGNMENT,j.unpackAlignment);const cn=b.getParameter(q.UNPACK_ROW_LENGTH),Tt=b.getParameter(q.UNPACK_IMAGE_HEIGHT),Dn=b.getParameter(q.UNPACK_SKIP_PIXELS),vt=b.getParameter(q.UNPACK_SKIP_ROWS),Ci=b.getParameter(q.UNPACK_SKIP_IMAGES);b.pixelStorei(q.UNPACK_ROW_LENGTH,Wt.width),b.pixelStorei(q.UNPACK_IMAGE_HEIGHT,Wt.height),b.pixelStorei(q.UNPACK_SKIP_PIXELS,Qe),b.pixelStorei(q.UNPACK_SKIP_ROWS,ut),b.pixelStorei(q.UNPACK_SKIP_IMAGES,_t);const fr=L.isDataArrayTexture||L.isData3DTexture,Dt=j.isDataArrayTexture||j.isData3DTexture;if(L.isDepthTexture){const Zt=le.get(L),Ri=le.get(j),Bt=le.get(Zt.__renderTarget),_i=le.get(Ri.__renderTarget);b.bindFramebuffer(q.READ_FRAMEBUFFER,Bt.__webglFramebuffer),b.bindFramebuffer(q.DRAW_FRAMEBUFFER,_i.__webglFramebuffer);for(let Pi=0;Pi<je;Pi++)fr&&(q.framebufferTextureLayer(q.READ_FRAMEBUFFER,q.COLOR_ATTACHMENT0,le.get(L).__webglTexture,te,_t+Pi),q.framebufferTextureLayer(q.DRAW_FRAMEBUFFER,q.COLOR_ATTACHMENT0,le.get(j).__webglTexture,Ie,an+Pi)),q.blitFramebuffer(Qe,ut,Le,De,He,bt,Le,De,q.DEPTH_BUFFER_BIT,q.NEAREST);b.bindFramebuffer(q.READ_FRAMEBUFFER,null),b.bindFramebuffer(q.DRAW_FRAMEBUFFER,null)}else if(te!==0||L.isRenderTargetTexture||le.has(L)){const Zt=le.get(L),Ri=le.get(j);b.bindFramebuffer(q.READ_FRAMEBUFFER,H),b.bindFramebuffer(q.DRAW_FRAMEBUFFER,Q);for(let Bt=0;Bt<je;Bt++)fr?q.framebufferTextureLayer(q.READ_FRAMEBUFFER,q.COLOR_ATTACHMENT0,Zt.__webglTexture,te,_t+Bt):q.framebufferTexture2D(q.READ_FRAMEBUFFER,q.COLOR_ATTACHMENT0,q.TEXTURE_2D,Zt.__webglTexture,te),Dt?q.framebufferTextureLayer(q.DRAW_FRAMEBUFFER,q.COLOR_ATTACHMENT0,Ri.__webglTexture,Ie,an+Bt):q.framebufferTexture2D(q.DRAW_FRAMEBUFFER,q.COLOR_ATTACHMENT0,q.TEXTURE_2D,Ri.__webglTexture,Ie),te!==0?q.blitFramebuffer(Qe,ut,Le,De,He,bt,Le,De,q.COLOR_BUFFER_BIT,q.NEAREST):Dt?q.copyTexSubImage3D(ke,Ie,He,bt,an+Bt,Qe,ut,Le,De):q.copyTexSubImage2D(ke,Ie,He,bt,Qe,ut,Le,De);b.bindFramebuffer(q.READ_FRAMEBUFFER,null),b.bindFramebuffer(q.DRAW_FRAMEBUFFER,null)}else Dt?L.isDataTexture||L.isData3DTexture?q.texSubImage3D(ke,Ie,He,bt,an,Le,De,je,Ot,mn,Wt.data):j.isCompressedArrayTexture?q.compressedTexSubImage3D(ke,Ie,He,bt,an,Le,De,je,Ot,Wt.data):q.texSubImage3D(ke,Ie,He,bt,an,Le,De,je,Ot,mn,Wt):L.isDataTexture?q.texSubImage2D(q.TEXTURE_2D,Ie,He,bt,Le,De,Ot,mn,Wt.data):L.isCompressedTexture?q.compressedTexSubImage2D(q.TEXTURE_2D,Ie,He,bt,Wt.width,Wt.height,Ot,Wt.data):q.texSubImage2D(q.TEXTURE_2D,Ie,He,bt,Le,De,Ot,mn,Wt);b.pixelStorei(q.UNPACK_ROW_LENGTH,cn),b.pixelStorei(q.UNPACK_IMAGE_HEIGHT,Tt),b.pixelStorei(q.UNPACK_SKIP_PIXELS,Dn),b.pixelStorei(q.UNPACK_SKIP_ROWS,vt),b.pixelStorei(q.UNPACK_SKIP_IMAGES,Ci),Ie===0&&j.generateMipmaps&&q.generateMipmap(ke),b.unbindTexture()},this.initRenderTarget=function(L){le.get(L).__webglFramebuffer===void 0&&fe.setupRenderTarget(L)},this.initTexture=function(L){L.isCubeTexture?fe.setTextureCube(L,0):L.isData3DTexture?fe.setTexture3D(L,0):L.isDataArrayTexture||L.isCompressedArrayTexture?fe.setTexture2DArray(L,0):fe.setTexture2D(L,0),b.unbindTexture()},this.resetState=function(){he=0,ne=0,ee=null,b.reset(),Fe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ar}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=At._getDrawingBufferColorSpace(e),t.unpackColorSpace=At._getUnpackColorSpace()}}const a_={type:"change"},ip={type:"start"},gx={type:"end"},qc=new gu,o_=new Rr,mA=Math.cos(70*wM.DEG2RAD),xn=new X,ri=2*Math.PI,Ht={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Bh=1e-6;class gA extends g1{constructor(e,t=null){super(e,t),this.state=Ht.NONE,this.target=new X,this.cursor=new X,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:za.ROTATE,MIDDLE:za.DOLLY,RIGHT:za.PAN},this.touches={ONE:ka.ROTATE,TWO:ka.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new X,this._lastQuaternion=new ps,this._lastTargetPosition=new X,this._quat=new ps().setFromUnitVectors(e.up,new X(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Ug,this._sphericalDelta=new Ug,this._scale=1,this._panOffset=new X,this._rotateStart=new lt,this._rotateEnd=new lt,this._rotateDelta=new lt,this._panStart=new lt,this._panEnd=new lt,this._panDelta=new lt,this._dollyStart=new lt,this._dollyEnd=new lt,this._dollyDelta=new lt,this._dollyDirection=new X,this._mouse=new lt,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=xA.bind(this),this._onPointerDown=_A.bind(this),this._onPointerUp=vA.bind(this),this._onContextMenu=TA.bind(this),this._onMouseWheel=MA.bind(this),this._onKeyDown=EA.bind(this),this._onTouchStart=wA.bind(this),this._onTouchMove=bA.bind(this),this._onMouseDown=yA.bind(this),this._onMouseMove=SA.bind(this),this._interceptControlDown=AA.bind(this),this._interceptControlUp=CA.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.state=Ht.NONE,this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents();const e=this.domElement.getRootNode();e.removeEventListener("keydown",this._interceptControlDown,{capture:!0}),e.removeEventListener("keyup",this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction="",this.domElement.style.cursor="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(a_),this.update(),this.state=Ht.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){const t=this.object.position;xn.copy(t).sub(this.target),xn.applyQuaternion(this._quat),this._spherical.setFromVector3(xn),this.autoRotate&&this.state===Ht.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,a=this.maxAzimuthAngle;isFinite(i)&&isFinite(a)&&(i<-Math.PI?i+=ri:i>Math.PI&&(i-=ri),a<-Math.PI?a+=ri:a>Math.PI&&(a-=ri),i<=a?this._spherical.theta=Math.max(i,Math.min(a,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+a)/2?Math.max(i,this._spherical.theta):Math.min(a,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let l=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const c=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),l=c!=this._spherical.radius}if(xn.setFromSpherical(this._spherical),xn.applyQuaternion(this._quatInverse),t.copy(this.target).add(xn),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let c=null;if(this.object.isPerspectiveCamera){const d=xn.length();c=this._clampDistance(d*this._scale);const h=d-c;this.object.position.addScaledVector(this._dollyDirection,h),this.object.updateMatrixWorld(),l=!!h}else if(this.object.isOrthographicCamera){const d=new X(this._mouse.x,this._mouse.y,0);d.unproject(this.object);const h=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),l=h!==this.object.zoom;const f=new X(this._mouse.x,this._mouse.y,0);f.unproject(this.object),this.object.position.sub(f).add(d),this.object.updateMatrixWorld(),c=xn.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;c!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(c).add(this.object.position):(qc.origin.copy(this.object.position),qc.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(qc.direction))<mA?this.object.lookAt(this.target):(o_.setFromNormalAndCoplanarPoint(this.object.up,this.target),qc.intersectPlane(o_,this.target))))}else if(this.object.isOrthographicCamera){const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),c!==this.object.zoom&&(this.object.updateProjectionMatrix(),l=!0)}return this._scale=1,this._performCursorZoom=!1,l||this._lastPosition.distanceToSquared(this.object.position)>Bh||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Bh||this._lastTargetPosition.distanceToSquared(this.target)>Bh?(this.dispatchEvent(a_),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?ri/60*this.autoRotateSpeed*e:ri/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){xn.setFromMatrixColumn(t,0),xn.multiplyScalar(-e),this._panOffset.add(xn)}_panUp(e,t){this.screenSpacePanning===!0?xn.setFromMatrixColumn(t,1):(xn.setFromMatrixColumn(t,0),xn.crossVectors(this.object.up,xn)),xn.multiplyScalar(e),this._panOffset.add(xn)}_pan(e,t){const i=this.domElement;if(this.object.isPerspectiveCamera){const a=this.object.position;xn.copy(a).sub(this.target);let l=xn.length();l*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*l/i.clientHeight,this.object.matrix),this._panUp(2*t*l/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),a=e-i.left,l=t-i.top,c=i.width,d=i.height;this._mouse.x=a/c*2-1,this._mouse.y=-(l/d)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(ri*this._rotateDelta.x/t.clientHeight),this._rotateUp(ri*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(ri*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-ri*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(ri*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-ri*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),a=.5*(e.pageY+t.y);this._rotateStart.set(i,a)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),a=.5*(e.pageY+t.y);this._panStart.set(i,a)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,a=e.pageY-t.y,l=Math.sqrt(i*i+a*a);this._dollyStart.set(0,l)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),a=.5*(e.pageX+i.x),l=.5*(e.pageY+i.y);this._rotateEnd.set(a,l)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(ri*this._rotateDelta.x/t.clientHeight),this._rotateUp(ri*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),a=.5*(e.pageY+t.y);this._panEnd.set(i,a)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,a=e.pageY-t.y,l=Math.sqrt(i*i+a*a);this._dollyEnd.set(0,l),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const c=(e.pageX+t.x)*.5,d=(e.pageY+t.y)*.5;this._updateZoomParameters(c,d)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new lt,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function _A(s){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(s.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(s)&&(this._addPointer(s),s.pointerType==="touch"?this._onTouchStart(s):this._onMouseDown(s),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function xA(s){this.enabled!==!1&&(s.pointerType==="touch"?this._onTouchMove(s):this._onMouseMove(s))}function vA(s){switch(this._removePointer(s),this._pointers.length){case 0:this.domElement.releasePointerCapture(s.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(gx),this.state=Ht.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function yA(s){let e;switch(s.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case za.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(s),this.state=Ht.DOLLY;break;case za.ROTATE:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=Ht.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=Ht.ROTATE}break;case za.PAN:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=Ht.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=Ht.PAN}break;default:this.state=Ht.NONE}this.state!==Ht.NONE&&this.dispatchEvent(ip)}function SA(s){switch(this.state){case Ht.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(s);break;case Ht.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(s);break;case Ht.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(s);break}}function MA(s){this.enabled===!1||this.enableZoom===!1||this.state!==Ht.NONE||(s.preventDefault(),this.dispatchEvent(ip),this._handleMouseWheel(this._customWheelEvent(s)),this.dispatchEvent(gx))}function EA(s){this.enabled!==!1&&this._handleKeyDown(s)}function wA(s){switch(this._trackPointer(s),this._pointers.length){case 1:switch(this.touches.ONE){case ka.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(s),this.state=Ht.TOUCH_ROTATE;break;case ka.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(s),this.state=Ht.TOUCH_PAN;break;default:this.state=Ht.NONE}break;case 2:switch(this.touches.TWO){case ka.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(s),this.state=Ht.TOUCH_DOLLY_PAN;break;case ka.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(s),this.state=Ht.TOUCH_DOLLY_ROTATE;break;default:this.state=Ht.NONE}break;default:this.state=Ht.NONE}this.state!==Ht.NONE&&this.dispatchEvent(ip)}function bA(s){switch(this._trackPointer(s),this.state){case Ht.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(s),this.update();break;case Ht.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(s),this.update();break;case Ht.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(s),this.update();break;case Ht.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(s),this.update();break;default:this.state=Ht.NONE}}function TA(s){this.enabled!==!1&&s.preventDefault()}function AA(s){s.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function CA(s){s.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const RA=/^[og]\s*(.+)?/,PA=/^mtllib /,NA=/^usemtl /,LA=/^usemap /,l_=/\s+/,c_=new X,zh=new X,u_=new X,d_=new X,bi=new X,Yc=new ht;function DA(){const s={objects:[],object:{},vertices:[],normals:[],colors:[],uvs:[],materials:{},materialLibraries:[],startObject:function(e,t){if(this.object&&this.object.fromDeclaration===!1){this.object.name=e,this.object.fromDeclaration=t!==!1;return}const i=this.object&&typeof this.object.currentMaterial=="function"?this.object.currentMaterial():void 0;if(this.object&&typeof this.object._finalize=="function"&&this.object._finalize(!0),this.object={name:e||"",fromDeclaration:t!==!1,geometry:{vertices:[],normals:[],colors:[],uvs:[],hasUVIndices:!1},materials:[],smooth:!0,startMaterial:function(a,l){const c=this._finalize(!1);c&&(c.inherited||c.groupCount<=0)&&this.materials.splice(c.index,1);const d={index:this.materials.length,name:a||"",mtllib:Array.isArray(l)&&l.length>0?l[l.length-1]:"",smooth:c!==void 0?c.smooth:this.smooth,groupStart:c!==void 0?c.groupEnd:0,groupEnd:-1,groupCount:-1,inherited:!1,clone:function(h){const f={index:typeof h=="number"?h:this.index,name:this.name,mtllib:this.mtllib,smooth:this.smooth,groupStart:0,groupEnd:-1,groupCount:-1,inherited:!1};return f.clone=this.clone.bind(f),f}};return this.materials.push(d),d},currentMaterial:function(){if(this.materials.length>0)return this.materials[this.materials.length-1]},_finalize:function(a){const l=this.currentMaterial();if(l&&l.groupEnd===-1&&(l.groupEnd=this.geometry.vertices.length/3,l.groupCount=l.groupEnd-l.groupStart,l.inherited=!1),a&&this.materials.length>1)for(let c=this.materials.length-1;c>=0;c--)this.materials[c].groupCount<=0&&this.materials.splice(c,1);return a&&this.materials.length===0&&this.materials.push({name:"",smooth:this.smooth}),l}},i&&i.name&&typeof i.clone=="function"){const a=i.clone(0);a.inherited=!0,this.object.materials.push(a)}this.objects.push(this.object)},finalize:function(){this.object&&typeof this.object._finalize=="function"&&this.object._finalize(!0)},parseVertexIndex:function(e,t){const i=parseInt(e,10);return(i>=0?i-1:i+t/3)*3},parseNormalIndex:function(e,t){const i=parseInt(e,10);return(i>=0?i-1:i+t/3)*3},parseUVIndex:function(e,t){const i=parseInt(e,10);return(i>=0?i-1:i+t/2)*2},addVertex:function(e,t,i){const a=this.vertices,l=this.object.geometry.vertices;l.push(a[e+0],a[e+1],a[e+2]),l.push(a[t+0],a[t+1],a[t+2]),l.push(a[i+0],a[i+1],a[i+2])},addVertexPoint:function(e){const t=this.vertices;this.object.geometry.vertices.push(t[e+0],t[e+1],t[e+2])},addVertexLine:function(e){const t=this.vertices;this.object.geometry.vertices.push(t[e+0],t[e+1],t[e+2])},addNormal:function(e,t,i){const a=this.normals,l=this.object.geometry.normals;l.push(a[e+0],a[e+1],a[e+2]),l.push(a[t+0],a[t+1],a[t+2]),l.push(a[i+0],a[i+1],a[i+2])},addFaceNormal:function(e,t,i){const a=this.vertices,l=this.object.geometry.normals;c_.fromArray(a,e),zh.fromArray(a,t),u_.fromArray(a,i),bi.subVectors(u_,zh),d_.subVectors(c_,zh),bi.cross(d_),bi.normalize(),l.push(bi.x,bi.y,bi.z),l.push(bi.x,bi.y,bi.z),l.push(bi.x,bi.y,bi.z)},addColor:function(e,t,i){const a=this.colors,l=this.object.geometry.colors;a[e]!==void 0&&l.push(a[e+0],a[e+1],a[e+2]),a[t]!==void 0&&l.push(a[t+0],a[t+1],a[t+2]),a[i]!==void 0&&l.push(a[i+0],a[i+1],a[i+2])},addUV:function(e,t,i){const a=this.uvs,l=this.object.geometry.uvs;l.push(a[e+0],a[e+1]),l.push(a[t+0],a[t+1]),l.push(a[i+0],a[i+1])},addDefaultUV:function(){const e=this.object.geometry.uvs;e.push(0,0),e.push(0,0),e.push(0,0)},addUVLine:function(e){const t=this.uvs;this.object.geometry.uvs.push(t[e+0],t[e+1])},addFace:function(e,t,i,a,l,c,d,h,f){const _=this.vertices.length;let m=this.parseVertexIndex(e,_),g=this.parseVertexIndex(t,_),y=this.parseVertexIndex(i,_);if(this.addVertex(m,g,y),this.addColor(m,g,y),d!==void 0&&d!==""){const M=this.normals.length;m=this.parseNormalIndex(d,M),g=this.parseNormalIndex(h,M),y=this.parseNormalIndex(f,M),this.addNormal(m,g,y)}else this.addFaceNormal(m,g,y);if(a!==void 0&&a!==""){const M=this.uvs.length;m=this.parseUVIndex(a,M),g=this.parseUVIndex(l,M),y=this.parseUVIndex(c,M),this.addUV(m,g,y),this.object.geometry.hasUVIndices=!0}else this.addDefaultUV()},addPointGeometry:function(e){this.object.geometry.type="Points";const t=this.vertices.length;for(let i=0,a=e.length;i<a;i++){const l=this.parseVertexIndex(e[i],t);this.addVertexPoint(l),this.addColor(l)}},addLineGeometry:function(e,t){this.object.geometry.type="Line";const i=this.vertices.length,a=this.uvs.length;for(let l=0,c=e.length;l<c;l++)this.addVertexLine(this.parseVertexIndex(e[l],i));for(let l=0,c=t.length;l<c;l++)this.addUVLine(this.parseUVIndex(t[l],a))}};return s.startObject("",!1),s}class IA extends tp{constructor(e){super(e),this.materials=null}load(e,t,i,a){const l=this,c=new l1(this.manager);c.setPath(this.path),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(e,function(d){try{t(l.parse(d))}catch(h){a?a(h):console.error(h),l.manager.itemError(e)}},i,a)}setMaterials(e){return this.materials=e,this}parse(e){const t=new DA;e.indexOf(`\r
`)!==-1&&(e=e.replace(/\r\n/g,`
`)),e.indexOf(`\\
`)!==-1&&(e=e.replace(/\\\n/g,""));const i=e.split(`
`);let a=[];for(let d=0,h=i.length;d<h;d++){const f=i[d].trimStart();if(f.length===0)continue;const _=f.charAt(0);if(_!=="#")if(_==="v"){const m=f.split(l_);switch(m[0]){case"v":t.vertices.push(parseFloat(m[1]),parseFloat(m[2]),parseFloat(m[3])),m.length>=7?(Yc.setRGB(parseFloat(m[4]),parseFloat(m[5]),parseFloat(m[6]),fi),t.colors.push(Yc.r,Yc.g,Yc.b)):t.colors.push(void 0,void 0,void 0);break;case"vn":t.normals.push(parseFloat(m[1]),parseFloat(m[2]),parseFloat(m[3]));break;case"vt":t.uvs.push(parseFloat(m[1]),parseFloat(m[2]));break}}else if(_==="f"){const g=f.slice(1).trim().split(l_),y=[];for(let T=0,S=g.length;T<S;T++){const x=g[T];if(x.length>0){const C=x.split("/");y.push(C)}}const M=y[0];for(let T=1,S=y.length-1;T<S;T++){const x=y[T],C=y[T+1];t.addFace(M[0],x[0],C[0],M[1],x[1],C[1],M[2],x[2],C[2])}}else if(_==="l"){const m=f.substring(1).trim().split(" ");let g=[];const y=[];if(f.indexOf("/")===-1)g=m;else for(let M=0,T=m.length;M<T;M++){const S=m[M].split("/");S[0]!==""&&g.push(S[0]),S[1]!==""&&y.push(S[1])}t.addLineGeometry(g,y)}else if(_==="p"){const g=f.slice(1).trim().split(" ");t.addPointGeometry(g)}else if((a=RA.exec(f))!==null){const m=(" "+a[0].slice(1).trim()).slice(1);t.startObject(m)}else if(NA.test(f))t.object.startMaterial(f.substring(7).trim(),t.materialLibraries);else if(PA.test(f))t.materialLibraries.push(f.substring(7).trim());else if(LA.test(f))console.warn('THREE.OBJLoader: Rendering identifier "usemap" not supported. Textures must be defined in MTL files.');else if(_==="s"){if(a=f.split(" "),a.length>1){const g=a[1].trim().toLowerCase();t.object.smooth=g!=="0"&&g!=="off"}else t.object.smooth=!0;const m=t.object.currentMaterial();m&&(m.smooth=t.object.smooth)}else{if(f==="\0")continue;console.warn('THREE.OBJLoader: Unexpected line: "'+f+'"')}}t.finalize();const l=new $n;if(l.materialLibraries=[].concat(t.materialLibraries),!(t.objects.length===1&&t.objects[0].geometry.vertices.length===0)===!0)for(let d=0,h=t.objects.length;d<h;d++){const f=t.objects[d],_=f.geometry,m=f.materials,g=_.type==="Line",y=_.type==="Points";let M=!1;if(_.vertices.length===0)continue;const T=new Sn;T.setAttribute("position",new kt(_.vertices,3)),_.normals.length>0&&T.setAttribute("normal",new kt(_.normals,3)),_.colors.length>0&&(M=!0,T.setAttribute("color",new kt(_.colors,3))),_.hasUVIndices===!0&&T.setAttribute("uv",new kt(_.uvs,2));const S=[];for(let C=0,I=m.length;C<I;C++){const w=m[C],R=w.name+"_"+w.smooth+"_"+M;let P=t.materials[R];if(this.materials!==null){if(P=this.materials.create(w.name),g&&P&&!(P instanceof Xs)){const U=new Xs;dr.prototype.copy.call(U,P),U.color.copy(P.color),P=U}else if(y&&P&&!(P instanceof Jo)){const U=new Jo({size:10,sizeAttenuation:!1});dr.prototype.copy.call(U,P),U.color.copy(P.color),U.map=P.map,P=U}}P===void 0&&(g?P=new Xs:y?P=new Jo({size:1,sizeAttenuation:!1}):P=new n1,P.name=w.name,P.flatShading=!w.smooth,P.vertexColors=M,t.materials[R]=P),S.push(P)}let x;if(S.length>1){for(let C=0,I=m.length;C<I;C++){const w=m[C];T.addGroup(w.groupStart,w.groupCount,C)}g?x=new ll(T,S):y?x=new Nh(T,S):x=new dt(T,S)}else g?x=new ll(T,S[0]):y?x=new Nh(T,S[0]):x=new dt(T,S[0]);x.name=f.name,l.add(x)}else if(t.vertices.length>0){const d=new Jo({size:1,sizeAttenuation:!1}),h=new Sn;h.setAttribute("position",new kt(t.vertices,3)),t.colors.length>0&&t.colors[0]!==void 0&&(h.setAttribute("color",new kt(t.colors,3)),d.vertexColors=!0);const f=new Nh(h,d);l.add(f)}return l}}class UA{constructor(){nt(this,"group");nt(this,"chassisGroup");nt(this,"frontWheelPivot");nt(this,"frontWheelMesh");nt(this,"rearLeftWheelMesh");nt(this,"rearRightWheelMesh");nt(this,"leftHeadlight");nt(this,"rightHeadlight");nt(this,"brakeLightsMaterial");nt(this,"wheelRadius",.203);nt(this,"wheelWidth",.102);nt(this,"wheelRotation",0);nt(this,"currentSteerAngle",0);nt(this,"currentRoll",0);nt(this,"currentPitch",0);this.group=new $n,this.chassisGroup=new $n,this.group.add(this.chassisGroup);const e=new qn({color:1841431,roughness:.85,metalness:.1}),t=new qn({color:13948120,roughness:.25,metalness:.85}),i=new qn({color:440020,roughness:.3,metalness:.7}),a=()=>{const w=new $n,R=new ji(this.wheelRadius,this.wheelRadius,this.wheelWidth,28);R.rotateZ(Math.PI/2);const P=new dt(R,e);P.castShadow=!0,P.receiveShadow=!0;const U=new ji(this.wheelRadius*.62,this.wheelRadius*.62,this.wheelWidth*1.04,20);U.rotateZ(Math.PI/2);const A=new dt(U,t),D=new ji(this.wheelRadius*.22,this.wheelRadius*.22,this.wheelWidth*1.08,16);D.rotateZ(Math.PI/2);const k=new dt(D,i);return w.add(P),w.add(A),w.add(k),w};this.frontWheelPivot=new $n,this.frontWheelPivot.position.set(0,this.wheelRadius,-1),this.frontWheelMesh=a(),this.frontWheelPivot.add(this.frontWheelMesh),this.group.add(this.frontWheelPivot),this.rearLeftWheelMesh=a(),this.rearLeftWheelMesh.position.set(-.575,this.wheelRadius,1),this.group.add(this.rearLeftWheelMesh),this.rearRightWheelMesh=a(),this.rearRightWheelMesh.position.set(.575,this.wheelRadius,1),this.group.add(this.rearRightWheelMesh);const l=new qn({color:2565930,metalness:.6,roughness:.4}),c=new ji(.03,.03,1.15,12);c.rotateZ(Math.PI/2);const d=new dt(c,l);d.position.set(0,this.wheelRadius,1),this.group.add(d);const h=new Yi(1.45,2.6);h.rotateX(-Math.PI/2);const f=new Nn({color:0,transparent:!0,opacity:.55,depthWrite:!1}),_=new dt(h,f);_.position.set(0,.005,.45),this.group.add(_);const m=w=>{const R=new d1(16317180,5,50,Math.PI/5.5,.35,1.2);R.position.set(w,.65,-.79),R.target.position.set(w,.1,-25),this.chassisGroup.add(R),this.chassisGroup.add(R.target);const P=new ji(.07,.07,.03,16);P.rotateX(Math.PI/2);const U=new Nn({color:14742270}),A=new dt(P,U);return A.position.set(w,.65,-.8),this.chassisGroup.add(A),R};this.leftHeadlight=m(-.28),this.rightHeadlight=m(.28),this.brakeLightsMaterial=new Nn({color:8330525});const g=new dn(.16,.07,.04),y=new dt(g,this.brakeLightsMaterial);y.position.set(-.48,.74,1.44),this.chassisGroup.add(y);const M=new dt(g,this.brakeLightsMaterial);M.position.set(.48,.74,1.44),this.chassisGroup.add(M);const T=new Yi(.72,.32),S=new Nn({color:593174}),x=new dt(T,S);x.position.set(0,1.25,1.436),this.chassisGroup.add(x);const C=new qn({color:2565930,roughness:.6}),I=new dt(new dn(.85,.08,.04),C);I.position.set(0,.38,1.44),this.chassisGroup.add(I),this.buildProceduralBody(),this.loadAutowareObj()}buildProceduralBody(){const e=new qn({color:1981066,roughness:.25,metalness:.65}),t=new qn({color:1579035,roughness:.4,metalness:.3}),i=new t1({color:988970,roughness:.1,metalness:.2,transmission:.75,transparent:!0,opacity:.8}),a=new dn(1.15,.55,1.832),l=new dt(a,e);l.position.set(0,.55,.516),l.name="procedural_chassis",this.chassisGroup.add(l);const c=new dn(.7,.45,.42),d=new dt(c,e);d.position.set(0,.52,-.6),d.name="procedural_nose",this.chassisGroup.add(d);const h=new dn(.24,.18,.22),f=new dt(h,t);f.position.set(0,.38,-.8),f.name="procedural_mud",this.chassisGroup.add(f);const _=new dn(1.1,.08,1.75),m=new dt(_,t);m.position.set(0,1.65,.52),m.name="procedural_roof",this.chassisGroup.add(m);const g=new Yi(.85,.85),y=new dt(g,i);y.position.set(0,1.25,-.52),y.rotation.x=.32,y.name="procedural_windshield",this.chassisGroup.add(y)}loadAutowareObj(){new IA().load("/models/etrike_body.obj",t=>{this.chassisGroup.children.filter(c=>c.name.startsWith("procedural_")).forEach(c=>this.chassisGroup.remove(c));const a=new qn({color:1920728,roughness:.25,metalness:.7});t.traverse(c=>{if(c.isMesh){const d=c;d.material=a,d.castShadow=!0,d.receiveShadow=!0}});const l=new Vt().set(0,-1,0,0,0,0,1,0,-1,0,0,1,0,0,0,1);t.applyMatrix4(l),this.chassisGroup.add(t)},void 0,t=>{console.warn("[TuktukVehicle] Using procedural geometry. OBJ load notice:",t)})}update(e,t,i,a,l){const c=e*1e3/3600,d=c*l/this.wheelRadius;this.wheelRotation-=d,this.frontWheelMesh.rotation.x=this.wheelRotation,this.rearLeftWheelMesh.rotation.x=this.wheelRotation,this.rearRightWheelMesh.rotation.x=this.wheelRotation;const h=-(t*Math.PI)/180;this.currentSteerAngle+=(h-this.currentSteerAngle)*Math.min(l*15,1),this.frontWheelPivot.rotation.y=this.currentSteerAngle;const f=c*(i/1e3),_=Math.max(Math.min(-f*.04,.08),-.08);this.currentRoll+=(_-this.currentRoll)*Math.min(l*10,1),this.chassisGroup.rotation.z=this.currentRoll;const m=a>20,g=m?Math.min(a/1500*.04,.05):0;this.currentPitch+=(g-this.currentPitch)*Math.min(l*12,1),this.chassisGroup.rotation.x=this.currentPitch,m?this.brakeLightsMaterial.color.setHex(16007006):this.brakeLightsMaterial.color.setHex(5244708)}}class OA{constructor(){nt(this,"group");nt(this,"roadMesh");nt(this,"groundPlaneMesh");nt(this,"laneDashes");nt(this,"boundaryLines");nt(this,"pathRibbonMesh");nt(this,"pathGeometry");nt(this,"treeTrunkMesh");nt(this,"treeFoliageMesh");nt(this,"treeCount",40);nt(this,"treeData",[]);nt(this,"lampPostMesh");nt(this,"lampHeadMesh");nt(this,"lampCount",16);nt(this,"dashCount",30);nt(this,"dashSpacing",6);nt(this,"roadLength",180);nt(this,"roadWidth",14);nt(this,"roadOffset",0);nt(this,"pathPulseOffset",0);this.group=new $n;const e=new Yi(160,this.roadLength,1,1);e.rotateX(-Math.PI/2);const t=new Nn({color:197379});this.groundPlaneMesh=new dt(e,t),this.groundPlaneMesh.position.set(0,-.02,-40),this.group.add(this.groundPlaneMesh);const i=new Yi(this.roadWidth,this.roadLength,1,1);i.rotateX(-Math.PI/2);const a=new Nn({color:789516});this.roadMesh=new dt(i,a),this.roadMesh.position.set(0,-.01,-40),this.group.add(this.roadMesh);const l=[],c=this.roadWidth/2;l.push(new X(-c,.01,20)),l.push(new X(-c,.01,-140)),l.push(new X(c,.01,20)),l.push(new X(c,.01,-140)),l.push(new X(-c/2,.01,20)),l.push(new X(-c/2,.01,-140)),l.push(new X(c/2,.01,20)),l.push(new X(c/2,.01,-140)),l.push(new X(-c-3.5,.01,20)),l.push(new X(-c-3.5,.01,-140)),l.push(new X(c+3.5,.01,20)),l.push(new X(c+3.5,.01,-140));const d=new Sn().setFromPoints(l),h=new Xs({color:2565930,transparent:!0,opacity:.85});this.boundaryLines=new ll(d,h),this.group.add(this.boundaryLines);const f=new Yi(.2,2.5);f.rotateX(-Math.PI/2);const _=new Nn({color:15000807,transparent:!0,opacity:.9});this.laneDashes=new Yo(f,_,this.dashCount*2);const m=new Kt;for(let P=0;P<this.dashCount;P++){const U=20-P*this.dashSpacing;m.position.set(-c/4,.015,U),m.updateMatrix(),this.laneDashes.setMatrixAt(P,m.matrix),m.position.set(c/4,.015,U),m.updateMatrix(),this.laneDashes.setMatrixAt(this.dashCount+P,m.matrix)}this.laneDashes.instanceMatrix.needsUpdate=!0,this.group.add(this.laneDashes);const g=new ji(.2,.32,2.4,6);g.translate(0,1.2,0);const y=new qn({color:2696484,roughness:.9});this.treeTrunkMesh=new Yo(g,y,this.treeCount);const M=new Qf(1.8,3.6,7);M.translate(0,3.8,0);const T=new qn({color:1332013,roughness:.7,flatShading:!0});this.treeFoliageMesh=new Yo(M,T,this.treeCount);for(let P=0;P<this.treeCount;P++){const U=P<this.treeCount/2,A=U?P:P-this.treeCount/2,D=160/(this.treeCount/2),k=20-A*D,z=Math.sin(P*9.7)*2.5,G=U?-13.5-Math.abs(z):13.5+Math.abs(z),$=.85+P%5*.12,H=P*1.3%(Math.PI*2);this.treeData.push({x:G,baseZ:k,scale:$,rotY:H})}this.group.add(this.treeTrunkMesh),this.group.add(this.treeFoliageMesh);const S=new ji(.06,.08,5.2,6);S.translate(0,2.6,0);const x=new qn({color:4144966,roughness:.4,metalness:.8});this.lampPostMesh=new Yo(S,x,this.lampCount);const C=new dn(.35,.12,.6);C.translate(0,5.15,0);const I=new Nn({color:14742270});this.lampHeadMesh=new Yo(C,I,this.lampCount),this.group.add(this.lampPostMesh),this.group.add(this.lampHeadMesh);const w=32;this.pathGeometry=new Yi(1.4,32,1,w),this.pathGeometry.rotateX(-Math.PI/2);const R=new Nn({color:440020,transparent:!0,opacity:.55,side:Gi,depthWrite:!1});this.pathRibbonMesh=new dt(this.pathGeometry,R),this.pathRibbonMesh.position.set(0,.02,0),this.group.add(this.pathRibbonMesh)}update(e,t,i,a,l){const c=e*1e3/3600;this.roadOffset+=c*l;const d=this.roadOffset%this.dashSpacing,h=new Kt,f=this.roadWidth/2;for(let I=0;I<this.dashCount;I++){const w=20-I*this.dashSpacing+d;h.position.set(-f/4,.015,w),h.updateMatrix(),this.laneDashes.setMatrixAt(I,h.matrix),h.position.set(f/4,.015,w),h.updateMatrix(),this.laneDashes.setMatrixAt(this.dashCount+I,h.matrix)}this.laneDashes.instanceMatrix.needsUpdate=!0;const _=160,m=new Kt;for(let I=0;I<this.treeCount;I++){const w=this.treeData[I];let R=(w.baseZ+this.roadOffset)%_;R>20&&(R-=_),m.position.set(w.x,0,R),m.rotation.y=w.rotY,m.scale.set(w.scale,w.scale,w.scale),m.updateMatrix(),this.treeTrunkMesh.setMatrixAt(I,m.matrix),this.treeFoliageMesh.setMatrixAt(I,m.matrix)}this.treeTrunkMesh.instanceMatrix.needsUpdate=!0,this.treeFoliageMesh.instanceMatrix.needsUpdate=!0;const g=20,y=this.lampCount*.5*g,M=new Kt;for(let I=0;I<this.lampCount;I++){const w=I<this.lampCount/2;let P=(20-(w?I:I-this.lampCount/2)*g+this.roadOffset)%y;P>20&&(P-=y);const U=w?-f-.4:f+.4;M.position.set(U,0,P),M.rotation.y=w?Math.PI/2:-Math.PI/2,M.scale.set(1,1,1),M.updateMatrix(),this.lampPostMesh.setMatrixAt(I,M.matrix),this.lampHeadMesh.setMatrixAt(I,M.matrix)}this.lampPostMesh.instanceMatrix.needsUpdate=!0,this.lampHeadMesh.instanceMatrix.needsUpdate=!0;const T=this.pathGeometry.attributes.position,S=.7,x=32;if(this.pathPulseOffset+=l*2.5,a&&a.length>=3)for(let I=0;I<=x;I++){const w=I/x,R=Math.min(Math.floor(w*(a.length-1)),a.length-1),P=a[R],U=I*2;T.setXYZ(U,P.x-S,.02,P.z),T.setXYZ(U+1,P.x+S,.02,P.z)}else{const w=t*Math.PI/180,R=Math.tan(w)/2,P=32;for(let U=0;U<=x;U++){const D=-(U/x)*P,k=-.45*R*D*D,z=U*2;T.setXYZ(z,k-S,.02,D),T.setXYZ(z+1,k+S,.02,D)}}T.needsUpdate=!0;const C=this.pathRibbonMesh.material;i?(C.color.setHex(440020),C.opacity=.45+Math.sin(this.pathPulseOffset)*.15):(C.color.setHex(4144966),C.opacity=.25)}}class FA{constructor(){nt(this,"group");nt(this,"actors",[]);nt(this,"liveObjectPool",[]);nt(this,"activeLiveCount",0);nt(this,"carBodyGeo");nt(this,"carCabinGeo");nt(this,"wheelGeo");nt(this,"pedBodyGeo");nt(this,"pedHeadGeo");nt(this,"boxGeo");nt(this,"carPaintMat");nt(this,"cabinGlassMat");nt(this,"headlightMat");nt(this,"taillightMat");nt(this,"wheelMat");nt(this,"pedTorsoMat");nt(this,"pedSkinMat");nt(this,"pedHaloMat");nt(this,"boxMat");this.group=new $n,this.carBodyGeo=new dn(1.8,.6,4),this.carCabinGeo=new dn(1.5,.55,2.2),this.wheelGeo=new ji(.32,.32,.22,12),this.wheelGeo.rotateZ(Math.PI/2),this.pedBodyGeo=new Zf(.24,.8,4,8),this.pedHeadGeo=new ep(.18,8,8),this.boxGeo=new dn(.9,.8,.9),this.carPaintMat=new qn({color:3718648,roughness:.35,metalness:.65}),this.cabinGlassMat=new Nn({color:988970,transparent:!0,opacity:.85}),this.headlightMat=new Nn({color:16777215}),this.taillightMat=new Nn({color:15680580}),this.wheelMat=new Nn({color:1579035}),this.pedTorsoMat=new qn({color:16096779,roughness:.6}),this.pedSkinMat=new Nn({color:16569165}),this.pedHaloMat=new Nn({color:16096779,transparent:!0,opacity:.45,side:Gi}),this.boxMat=new qn({color:14251782,roughness:.8}),this.initSimulatedActors()}createCarMesh(e=3718648){const t=new $n,i=this.carPaintMat.clone();i.color.setHex(e);const a=new dt(this.carBodyGeo,i);a.position.y=.55,t.add(a);const l=new dt(this.carCabinGeo,this.cabinGlassMat);l.position.set(0,1.05,-.2),t.add(l);const c=new dt(this.wheelGeo,this.wheelMat);c.position.set(.92,.32,-1.2),t.add(c);const d=new dt(this.wheelGeo,this.wheelMat);d.position.set(-.92,.32,-1.2),t.add(d);const h=new dt(this.wheelGeo,this.wheelMat);h.position.set(.92,.32,1.2),t.add(h);const f=new dt(this.wheelGeo,this.wheelMat);f.position.set(-.92,.32,1.2),t.add(f);const _=new dt(new dn(.35,.12,.05),this.headlightMat);_.position.set(.65,.6,-2.01),t.add(_);const m=new dt(new dn(.35,.12,.05),this.headlightMat);m.position.set(-.65,.6,-2.01),t.add(m);const g=new dt(new dn(.35,.12,.05),this.taillightMat);g.position.set(.65,.65,2.01),t.add(g);const y=new dt(new dn(.35,.12,.05),this.taillightMat);y.position.set(-.65,.65,2.01),t.add(y);const M=new dn(2,1.45,4.2),T=new bg(M),S=new Xs({color:440020,transparent:!0,opacity:.45}),x=new ll(T,S);return x.position.y=.8,t.add(x),t}createPedestrianMesh(){const e=new $n,t=new dt(this.pedBodyGeo,this.pedTorsoMat);t.position.y=.85,e.add(t);const i=new dt(this.pedHeadGeo,this.pedSkinMat);i.position.y=1.55,e.add(i);const a=new Jf(.4,.65,16);a.rotateX(-Math.PI/2);const l=new dt(a,this.pedHaloMat);return l.position.y=.03,e.add(l),e}createBoxMesh(){const e=new $n,t=new dt(this.boxGeo,this.boxMat);t.position.y=.4,e.add(t);const i=new bg(new dn(1,.9,1)),a=new Xs({color:16096779,transparent:!0,opacity:.6}),l=new ll(i,a);return l.position.y=.45,e.add(l),e}initSimulatedActors(){const e=this.createCarMesh(165063);this.group.add(e),this.actors.push({id:"sim_car_1",type:"CAR",x:-3.5,z:-35,speedMs:7.2,targetX:-3.5,heading:0,color:165063,mesh:e});const t=this.createCarMesh(1096065);this.group.add(t),this.actors.push({id:"sim_car_2",type:"CAR",x:3.5,z:-18,speedMs:5,targetX:3.5,heading:0,color:1096065,mesh:t});const i=this.createPedestrianMesh();this.group.add(i),this.actors.push({id:"sim_ped_1",type:"PEDESTRIAN",x:7.8,z:-15,speedMs:1.3,targetX:7.8,heading:0,color:16096779,mesh:i,bobPhase:0});const a=this.createPedestrianMesh();this.group.add(a),this.actors.push({id:"sim_ped_2",type:"PEDESTRIAN",x:-7.6,z:-48,speedMs:-.9,targetX:-7.6,heading:Math.PI,color:16096779,mesh:a,bobPhase:1.5});const l=this.createBoxMesh();this.group.add(l),this.actors.push({id:"sim_box_1",type:"BOX",x:5.8,z:-65,speedMs:0,targetX:5.8,heading:.2,color:14251782,mesh:l})}update(e,t,i,a){const l=e*1e3/3600;if(i){for(const c of this.actors)c.mesh.visible=!1;if(t&&t.length>0)this.renderLivePerceptionObjects(t);else for(let c=0;c<this.liveObjectPool.length;c++)this.liveObjectPool[c].visible=!1;return}for(const c of this.actors){c.mesh.visible=!0;const d=c.speedMs-l;c.z+=d*a,c.z<-135?c.z=25:c.z>28&&(c.z=-130),c.x+=(c.targetX-c.x)*(a*2),c.mesh.position.set(c.x,0,c.z),c.mesh.rotation.y=c.heading,c.type==="PEDESTRIAN"&&c.bobPhase!==void 0&&(c.bobPhase+=a*8,c.mesh.position.y=Math.abs(Math.sin(c.bobPhase))*.08)}for(let c=0;c<this.liveObjectPool.length;c++)this.liveObjectPool[c].visible=!1}renderLivePerceptionObjects(e){for(;this.liveObjectPool.length<e.length;){const t=new $n,i=this.createCarMesh(3718648),a=this.createPedestrianMesh(),l=this.createBoxMesh();i.name="CAR",a.name="PEDESTRIAN",l.name="BOX",t.add(i),t.add(a),t.add(l),this.group.add(t),this.liveObjectPool.push(t)}for(let t=0;t<this.liveObjectPool.length;t++){const i=this.liveObjectPool[t];if(t<e.length){const a=e[t];i.visible=!0,i.position.set(a.x,a.y||0,a.z),i.rotation.y=a.yaw||0;const l=i.getObjectByName("CAR"),c=i.getObjectByName("PEDESTRIAN"),d=i.getObjectByName("BOX");a.label==="PEDESTRIAN"?(l&&(l.visible=!1),c&&(c.visible=!0),d&&(d.visible=!1)):a.label==="BOX"?(l&&(l.visible=!1),c&&(c.visible=!1),d&&(d.visible=!0)):(l&&(l.visible=!0),c&&(c.visible=!1),d&&(d.visible=!1),a.dx&&a.dz&&(l==null||l.scale.set(a.dz/1.8,1,a.dx/4)))}else i.visible=!1}}}const kA=({active:s,title:e="Parking Brake Active"})=>E.jsx("div",{className:`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 border ${s?"bg-rose-950/80 border-rose-500 text-rose-500 shadow-[0_0_14px_rgba(244,63,94,0.8)]":"bg-neutral-950/50 border-neutral-900 text-neutral-800"}`,title:e,children:E.jsxs("svg",{viewBox:"0 0 32 32",className:"w-6 h-6 fill-current",children:[E.jsx("path",{d:"M 6.5 10.5 A 11 11 0 0 0 6.5 21.5",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round"}),E.jsx("path",{d:"M 25.5 10.5 A 11 11 0 0 1 25.5 21.5",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round"}),E.jsx("circle",{cx:"16",cy:"16",r:"7.5",fill:"none",stroke:"currentColor",strokeWidth:"2.0"}),E.jsx("path",{d:"M 14 11.5 L 17 11.5 C 18.5 11.5 19.5 12.3 19.5 13.8 C 19.5 15.3 18.5 16.1 17 16.1 L 15.6 16.1 L 15.6 20.5 L 14 20.5 Z M 15.6 14.7 L 16.8 14.7 C 17.5 14.7 18 14.4 18 13.8 C 18 13.2 17.5 12.9 16.8 12.9 L 15.6 12.9 Z"})]})}),BA=({active:s,title:e="Brake System Active"})=>E.jsx("div",{className:`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 border ${s?"bg-rose-950/80 border-rose-500 text-rose-500 shadow-[0_0_14px_rgba(244,63,94,0.8)]":"bg-neutral-950/50 border-neutral-900 text-neutral-800"}`,title:e,children:E.jsxs("svg",{viewBox:"0 0 32 32",className:"w-6 h-6 fill-current",children:[E.jsx("path",{d:"M 6.5 10.5 A 11 11 0 0 0 6.5 21.5",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round"}),E.jsx("path",{d:"M 25.5 10.5 A 11 11 0 0 1 25.5 21.5",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round"}),E.jsx("circle",{cx:"16",cy:"16",r:"7.5",fill:"none",stroke:"currentColor",strokeWidth:"2.0"}),E.jsx("rect",{x:"15",y:"11.5",width:"2",height:"5",rx:"0.5"}),E.jsx("circle",{cx:"16",cy:"19",r:"1.1"})]})}),zA=({active:s,title:e="Brake Hold Active"})=>E.jsx("div",{className:`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 border ${s?"bg-emerald-950/80 border-emerald-500 text-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.8)]":"bg-neutral-950/50 border-neutral-900 text-neutral-800"}`,title:e,children:E.jsx("div",{className:"flex flex-col items-center",children:E.jsx("span",{className:"text-[10px] font-black tracking-tight leading-none",children:"HOLD"})})}),HA=({active:s,title:e="Electric Propulsion Ready"})=>E.jsxs("div",{className:`px-2.5 h-9 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 border ${s?"bg-emerald-950/80 border-emerald-500 text-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.8)]":"bg-neutral-950/50 border-neutral-900 text-neutral-800"}`,title:e,children:[E.jsx("div",{className:`w-2 h-2 rounded-full ${s?"bg-emerald-400 animate-pulse":"bg-neutral-700"}`}),E.jsx("span",{className:"text-[11px] font-black tracking-wider leading-none",children:"READY"})]}),VA=({active:s,fault:e=!1,title:t="Electric Power Steering System"})=>{const i=s||e;return E.jsx("div",{className:`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 border ${i?"bg-amber-950/80 border-amber-500 text-amber-400 shadow-[0_0_14px_rgba(245,158,11,0.8)] animate-pulse":"bg-neutral-950/50 border-neutral-900 text-neutral-800"}`,title:t,children:E.jsxs("svg",{viewBox:"0 0 32 32",className:"w-6 h-6",fill:"none",stroke:"currentColor",strokeWidth:"2.0",children:[E.jsx("circle",{cx:"16",cy:"16",r:"10"}),E.jsx("circle",{cx:"16",cy:"16",r:"2.5",fill:"currentColor"}),E.jsx("line",{x1:"6",y1:"16",x2:"13.5",y2:"16",strokeWidth:"2.2"}),E.jsx("line",{x1:"26",y1:"16",x2:"18.5",y2:"16",strokeWidth:"2.2"}),E.jsx("line",{x1:"16",y1:"18.5",x2:"16",y2:"26",strokeWidth:"2.2"}),i&&E.jsx("path",{d:"M 23 8 L 23 11 M 23 13 L 23 13.5",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round"})]})})},GA=({active:s,title:e="Emergency Stop Active"})=>E.jsx("div",{className:`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 border ${s?"bg-rose-950/90 border-rose-500 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.9)] animate-pulse":"bg-neutral-950/50 border-neutral-900 text-neutral-800"}`,title:e,children:E.jsxs("svg",{viewBox:"0 0 32 32",className:"w-6 h-6 fill-current",children:[E.jsx("polygon",{points:"10,4 22,4 28,10 28,22 22,28 10,28 4,22 4,10",fill:"none",stroke:"currentColor",strokeWidth:"2.2"}),E.jsx("rect",{x:"15",y:"9",width:"2",height:"8",rx:"0.5"}),E.jsx("circle",{cx:"16",cy:"20.5",r:"1.3"})]})}),WA=({active:s,temp:e,title:t="ECU / Actuator Temperature"})=>{const i=e>75,a=e>60||s;return E.jsx("div",{className:`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 border ${i?"bg-rose-950/80 border-rose-500 text-rose-500 shadow-[0_0_14px_rgba(244,63,94,0.8)] animate-pulse":a?"bg-amber-950/80 border-amber-500 text-amber-400 shadow-[0_0_14px_rgba(245,158,11,0.8)]":"bg-neutral-950/50 border-neutral-900 text-neutral-800"}`,title:`${t}: ${e}°C`,children:E.jsxs("svg",{viewBox:"0 0 32 32",className:"w-6 h-6",fill:"currentColor",children:[E.jsx("path",{d:"M 13 8 C 13 6.9 13.9 6 15 6 C 16.1 6 17 6.9 17 8 L 17 18.2 C 18.2 19 19 20.4 19 22 C 19 24.2 17.2 26 15 26 C 12.8 26 11 24.2 11 22 C 11 20.4 11.8 19 13 18.2 Z",fill:"none",stroke:"currentColor",strokeWidth:"1.8"}),E.jsx("circle",{cx:"15",cy:"22",r:"2.8"}),E.jsx("rect",{x:"14",y:"12",width:"2",height:"7",rx:"0.5"}),E.jsx("line",{x1:"19",y1:"9",x2:"22",y2:"9",stroke:"currentColor",strokeWidth:"1.8"}),E.jsx("line",{x1:"19",y1:"13",x2:"22",y2:"13",stroke:"currentColor",strokeWidth:"1.8"})]})})},jA=({active:s,busOff:e=!1,errorCount:t=0,title:i="CAN Controller Health"})=>{const a=e||t>96;return E.jsx("div",{className:`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 border ${e?"bg-rose-950/80 border-rose-500 text-rose-500 shadow-[0_0_14px_rgba(244,63,94,0.8)] animate-pulse":a?"bg-amber-950/80 border-amber-500 text-amber-400 shadow-[0_0_14px_rgba(245,158,11,0.8)]":s?"bg-emerald-950/80 border-emerald-500 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.6)]":"bg-neutral-950/50 border-neutral-900 text-neutral-800"}`,title:`${i}: ${e?"BUS OFF":a?`Errors: ${t}`:"OK"}`,children:E.jsxs("div",{className:"flex flex-col items-center",children:[E.jsx("span",{className:"text-[10px] font-black tracking-tighter leading-none",children:"CAN"}),E.jsx("span",{className:"text-[7px] font-mono leading-none mt-0.5 font-bold",children:e?"OFF":"BUS"})]})})},XA=({active:s,title:e="High Beam Headlights"})=>E.jsx("div",{className:`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 border ${s?"bg-blue-950/80 border-blue-500 text-blue-400 shadow-[0_0_16px_rgba(59,130,246,0.9)]":"bg-neutral-950/50 border-neutral-900 text-neutral-800"}`,title:e,children:E.jsxs("svg",{viewBox:"0 0 32 32",className:"w-6 h-6",fill:"currentColor",children:[E.jsx("path",{d:"M 18 8 A 8 8 0 0 1 18 24 L 14 24 C 11.8 24 10 22.2 10 20 L 10 12 C 10 9.8 11.8 8 14 8 Z"}),E.jsx("line",{x1:"21",y1:"10",x2:"28",y2:"10",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round"}),E.jsx("line",{x1:"21",y1:"14",x2:"28",y2:"14",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round"}),E.jsx("line",{x1:"21",y1:"18",x2:"28",y2:"18",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round"}),E.jsx("line",{x1:"21",y1:"22",x2:"28",y2:"22",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round"})]})}),qA=({active:s,title:e="Hazard Warning Flashers"})=>E.jsx("div",{className:`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 border ${s?"bg-rose-950/90 border-rose-500 text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.9)] animate-pulse":"bg-neutral-950/50 border-neutral-900 text-neutral-800"}`,title:e,children:E.jsxs("svg",{viewBox:"0 0 32 32",className:"w-6 h-6 fill-none",stroke:"currentColor",children:[E.jsx("polygon",{points:"16,5 29,27 3,27",strokeWidth:"2.2",strokeLinejoin:"round"}),E.jsx("polygon",{points:"16,11 24,24 8,24",strokeWidth:"1.8",strokeLinejoin:"round"})]})}),YA=()=>{var ae,de,Ee,$e,Oe,ft,Gt,pt,St,Pt,gt,Ft,qt,Jt;const{telemetry:s,totalFrames:e,cameraMode:t,setCameraMode:i,speedUnit:a,setSpeedUnit:l,toggleActiveView:c,framesById:d,isConnected:h,rosStatus:f}=yn(),_=a==="mph"?s.speed_act_kmh*.621371:s.speed_act_kmh;a==="mph"?s.speed_cmd_kmh*.621371:s.speed_cmd_kmh;const m=s.mode==="AUTONOMOUS"||s.mode==="AUTO",g=s.estop||s.mode==="ESTOP",y=s.lights_act.left,M=s.lights_act.right,T=s.lights_act.headlight,S=s.lights_act.hazard,x=s.lights_act.brake,C=s.steer_act_deg,I=s.steer_cmd_deg,w=s.brake_act_kpa,R=Math.min(w/1500*100,100),P=(ae=d[784])==null?void 0:ae.signals,U=!!((de=P==null?void 0:P.fault)!=null&&de.value),A=typeof((Ee=P==null?void 0:P.motor_current)==null?void 0:Ee.value)=="number"?P.motor_current.value:Math.round(Math.abs(C)*.25*10)/10,D=typeof(($e=P==null?void 0:P.ecu_temp)==null?void 0:$e.value)=="number"?P.ecu_temp.value:38,k=(Oe=d[785])==null?void 0:Oe.signals,z=!!((ft=k==null?void 0:k.fault)!=null&&ft.value),G=typeof((Gt=k==null?void 0:k.ecu_temp)==null?void 0:Gt.value)=="number"?k.ecu_temp.value:42,$=(pt=d[529])==null?void 0:pt.signals,H=!!((St=$==null?void 0:$.mcp_bus_off)!=null&&St.value),Q=typeof((Pt=$==null?void 0:$.mcp_tec)==null?void 0:Pt.value)=="number"?$.mcp_tec.value:0,he=typeof((gt=$==null?void 0:$.mcp_rec)==null?void 0:gt.value)=="number"?$.mcp_rec.value:0,ne=s.gear==="P",ee=w>100||x,K=s.speed_act_kmh<.5&&w>250,Z=h&&!g,O=U||Math.abs(I-C)>5,se=Math.max(D,G),Se=(Jt=(qt=(Ft=d[289])==null?void 0:Ft.signals)==null?void 0:qt.yaw_rate_mrad_s)==null?void 0:Jt.value,Ge=typeof Se=="number"?Se:Math.round(-C*s.speed_act_kmh*.28),ze=Math.round(s.speed_act_kmh*110),Ve=Math.min(Math.round(s.speed_act_kmh/45*100),100);return E.jsxs(E.Fragment,{children:[E.jsx("div",{className:"fixed inset-x-0 bottom-0 pointer-events-none transition-all duration-100 ease-out z-10",style:{height:`${Math.min(16+R*.4,55)}%`,background:"linear-gradient(to top, rgba(225, 29, 72, 0.45) 0%, rgba(136, 19, 55, 0.18) 55%, rgba(0, 0, 0, 0) 100%)",opacity:ee?Math.min(.25+R/100*.75,1):0}}),g&&E.jsx("div",{className:"fixed inset-0 pointer-events-none z-20 animate-[pulse_1.2s_ease-in-out_infinite] bg-rose-950/25 border-8 border-rose-600/80 shadow-[inset_0_0_100px_rgba(225,29,72,0.65)]"}),E.jsxs("div",{className:"absolute inset-0 pointer-events-none flex flex-col justify-between p-6 select-none font-mono z-30",children:[E.jsxs("div",{className:"flex items-start justify-between relative",children:[E.jsxs("div",{className:"flex items-center gap-3",children:[E.jsx("div",{className:`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-150 ${y||S?"bg-emerald-500 text-black border-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.95)] animate-pulse":"bg-[#080808]/85 text-neutral-700 border-neutral-800"}`,title:"Left Turn Indicator (Peripheral Field)",children:E.jsx(qy,{className:"w-8 h-8 stroke-[3]"})}),E.jsxs("div",{className:"flex items-center gap-1.5 bg-[#080808]/90 backdrop-blur-xl border border-neutral-800/90 p-1 rounded-xl shadow-xl",children:[E.jsx(kA,{active:ne}),E.jsx(BA,{active:ee||z}),E.jsx(zA,{active:K}),E.jsx(HA,{active:Z})]})]}),E.jsxs("div",{className:"absolute left-1/2 -translate-x-1/2 top-0 flex flex-col items-center",children:[E.jsx("div",{className:"flex items-center gap-2 bg-[#080808]/90 backdrop-blur-xl border border-neutral-800/90 px-3 py-1 rounded-xl shadow-xl mb-1 pointer-events-auto",children:["P","R","N","D","S"].map(xt=>{const jt=s.gear===xt;return E.jsx("div",{className:`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-black transition-all ${jt?"bg-cyan-500 text-black shadow-[0_0_14px_rgba(6,182,212,0.9)] scale-110 border border-cyan-300":"text-neutral-500 hover:text-neutral-400 bg-neutral-900/50"}`,children:xt},xt)})}),E.jsxs("div",{className:"flex items-baseline gap-2 drop-shadow-[0_6px_20px_rgba(0,0,0,0.95)]",children:[E.jsx("span",{className:"text-7xl lg:text-8xl font-black text-white tracking-tight tabular-nums font-mono leading-none",children:_.toFixed(0)}),E.jsx("span",{className:"text-base lg:text-lg font-black text-neutral-400 uppercase tracking-widest",children:a})]})]}),E.jsxs("div",{className:"flex items-center gap-3",children:[E.jsxs("div",{className:"flex items-center gap-1.5 bg-[#080808]/90 backdrop-blur-xl border border-neutral-800/90 p-1 rounded-xl shadow-xl",children:[E.jsx(VA,{active:O,fault:U}),E.jsx(GA,{active:g}),E.jsx(WA,{active:se>60,temp:se}),E.jsx(jA,{active:h&&!H,busOff:H,errorCount:Q+he}),E.jsx(XA,{active:T}),E.jsx(qA,{active:S})]}),E.jsx("div",{className:`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-150 ${M||S?"bg-emerald-500 text-black border-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.95)] animate-pulse":"bg-[#080808]/85 text-neutral-700 border-neutral-800"}`,title:"Right Turn Indicator (Peripheral Field)",children:E.jsx($y,{className:"w-8 h-8 stroke-[3]"})})]})]}),E.jsxs("div",{className:"flex justify-between items-center px-4",children:[E.jsxs("div",{className:"w-72 lg:w-80 space-y-3 pointer-events-auto drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]",children:[E.jsxs("div",{className:"flex items-center justify-between border-b border-neutral-800/60 pb-1.5",children:[E.jsx("span",{className:"text-xs uppercase font-black text-neutral-400 tracking-wider",children:"CHASSIS DYNAMICS"}),E.jsx("span",{className:"text-[10px] text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/60 font-bold",children:"3-WHEELER"})]}),E.jsxs("div",{children:[E.jsxs("div",{className:"flex justify-between items-baseline mb-1",children:[E.jsx("span",{className:"text-sm font-semibold text-neutral-300",children:"Steering"}),E.jsx("span",{className:"text-2xl font-black tabular-nums text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]",children:C>0?`+${C.toFixed(1)}°`:`${C.toFixed(1)}°`})]}),E.jsxs("div",{className:"h-3.5 bg-neutral-900/90 rounded-full relative overflow-hidden border border-neutral-700/60 shadow-inner",children:[E.jsx("div",{className:"absolute left-1/2 top-0 bottom-0 w-1 bg-neutral-300 -translate-x-1/2 z-10"}),E.jsx("div",{className:"absolute top-0 bottom-0 w-1.5 bg-cyan-300 -translate-x-1/2 z-20 shadow-[0_0_8px_rgba(6,182,212,1)]",style:{left:`${50+I/45*50}%`},title:`Commanded Steer: ${I.toFixed(1)}°`}),E.jsx("div",{className:"h-full bg-emerald-400 transition-all duration-75 absolute top-0 shadow-[0_0_10px_rgba(52,211,153,0.8)]",style:{left:C<0?`${50+C/45*50}%`:"50%",width:`${Math.abs(C)/45*50}%`}})]}),E.jsxs("div",{className:"flex justify-between text-xs text-neutral-400 mt-1 font-mono",children:[E.jsx("span",{children:"-45°"}),E.jsxs("span",{className:"text-cyan-400 font-bold",children:["CMD: ",I.toFixed(1),"°"]}),E.jsx("span",{children:"+45°"})]})]}),E.jsxs("div",{className:"flex justify-between items-center text-xs py-1 border-b border-neutral-900/80 font-mono",children:[E.jsxs("span",{className:"text-neutral-400",children:["EPS Current: ",E.jsxs("span",{className:"text-cyan-300 font-bold",children:[A,"A"]})]}),E.jsxs("span",{className:"text-neutral-400",children:["ECU: ",E.jsxs("span",{className:"text-amber-300 font-bold",children:[D,"°C"]})]})]}),E.jsxs("div",{className:"flex justify-between items-baseline pt-0.5",children:[E.jsx("span",{className:"text-sm font-semibold text-neutral-300",children:"Yaw Rate"}),E.jsxs("div",{children:[E.jsx("span",{className:"text-2xl font-black text-white tabular-nums",children:Ge}),E.jsx("span",{className:"text-xs text-neutral-400 ml-1.5 font-bold",children:"mrad/s"})]})]}),E.jsxs("div",{className:"pt-0.5 border-t border-neutral-900/80",children:[E.jsxs("div",{className:"flex justify-between items-baseline mb-1",children:[E.jsx("span",{className:"text-sm font-semibold text-neutral-300",children:"Hydraulic Brake"}),E.jsxs("span",{className:`text-2xl font-black tabular-nums ${w>50?"text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.6)]":"text-neutral-200"}`,children:[w," ",E.jsx("span",{className:"text-xs font-normal text-neutral-400",children:"kPa"})]})]}),E.jsx("div",{className:"h-3 bg-neutral-900/90 rounded-full overflow-hidden border border-neutral-700/60 shadow-inner",children:E.jsx("div",{className:`h-full transition-all duration-75 ${w>100?"bg-gradient-to-r from-amber-500 to-rose-500 shadow-[0_0_14px_rgba(244,63,94,0.9)]":"bg-neutral-600"}`,style:{width:`${R}%`}})}),E.jsxs("div",{className:"flex justify-between text-xs text-neutral-400 mt-1 font-mono",children:[E.jsxs("span",{children:["Brake ECU: ",E.jsxs("span",{className:"text-neutral-300",children:[G,"°C"]})]}),E.jsx("span",{className:z?"text-rose-400 font-bold":"text-emerald-400 font-semibold",children:z?"BRAKE FAULT":"NORMAL"})]})]})]}),E.jsxs("div",{className:"w-72 lg:w-80 space-y-3 pointer-events-auto drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]",children:[E.jsxs("div",{className:"flex items-center justify-between border-b border-neutral-800/60 pb-1.5",children:[E.jsx("span",{className:"text-xs uppercase font-black text-neutral-400 tracking-wider",children:"POWERTRAIN & BUS"}),E.jsx("span",{className:"text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/60 font-bold",children:"ACTIVE"})]}),E.jsxs("div",{children:[E.jsxs("div",{className:"flex justify-between items-baseline mb-1",children:[E.jsx("span",{className:"text-sm font-semibold text-neutral-300",children:"Electric Motor"}),E.jsxs("span",{className:"text-2xl font-black tabular-nums text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]",children:[ze.toLocaleString()," ",E.jsx("span",{className:"text-xs font-normal text-neutral-400",children:"RPM"})]})]}),E.jsx("div",{className:"h-3.5 bg-neutral-900/90 rounded-full overflow-hidden border border-neutral-700/60 shadow-inner",children:E.jsx("div",{className:"h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-75 shadow-[0_0_12px_rgba(6,182,212,0.8)]",style:{width:`${Ve}%`}})}),E.jsxs("div",{className:"flex justify-between text-xs text-neutral-400 mt-1 font-mono",children:[E.jsx("span",{children:"IDLE"}),E.jsxs("span",{className:"text-neutral-300 font-bold",children:[Ve,"% DEMAND"]}),E.jsx("span",{children:"PEAK"})]})]}),E.jsxs("div",{className:"flex justify-between items-baseline pt-0.5 border-t border-neutral-900/80",children:[E.jsx("span",{className:"text-sm font-semibold text-neutral-300",children:"Bus Rate"}),E.jsxs("div",{className:"flex items-center gap-2",children:[E.jsx(N_,{className:"w-4 h-4 text-cyan-400 animate-pulse"}),E.jsx("span",{className:"text-2xl font-black text-emerald-400 tabular-nums drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]",children:"28.0 Hz"})]})]}),E.jsxs("div",{className:"flex justify-between items-center text-xs py-1 border-b border-neutral-900/80 font-mono",children:[E.jsxs("span",{className:"text-neutral-400",children:["TEC: ",E.jsx("span",{className:"text-emerald-400 font-bold",children:Q})]}),E.jsxs("span",{className:"text-neutral-400",children:["REC: ",E.jsx("span",{className:"text-emerald-400 font-bold",children:he})]}),E.jsx("span",{className:H?"text-rose-400 font-bold":"text-emerald-400 font-bold",children:H?"BUS OFF":"HEALTHY"})]}),E.jsxs("div",{className:"flex justify-between items-baseline pt-0.5",children:[E.jsx("span",{className:"text-sm font-semibold text-neutral-300",children:"CAN Telemetry Frames"}),E.jsx("span",{className:"text-base font-bold text-neutral-200 tabular-nums",children:e.toLocaleString()})]})]})]}),E.jsxs("div",{className:"flex items-end justify-between relative px-2",children:[E.jsxs("div",{className:"flex items-center gap-2 bg-[#080808]/90 backdrop-blur-xl border border-neutral-800/90 p-1.5 rounded-xl pointer-events-auto shadow-xl",children:[E.jsx(jy,{className:"w-4 h-4 text-neutral-400 ml-1.5 mr-0.5"}),["chase","cabin","orbit"].map(xt=>E.jsx("button",{onClick:()=>i(xt),className:`h-10 px-3.5 rounded-lg text-xs font-black uppercase transition-all ${t===xt?"bg-neutral-800 text-cyan-300 shadow-md border border-neutral-700":"text-neutral-400 hover:text-white"}`,children:xt==="orbit"?"360°":xt},xt))]}),E.jsxs("div",{className:"absolute left-1/2 -translate-x-1/2 bottom-1 flex flex-col items-center pointer-events-none gap-0.5",children:[E.jsx("span",{className:"text-[11px] text-neutral-300 uppercase tracking-widest font-black drop-shadow-md",children:m?"AUTONOMOUS DRIVING SYSTEM • DRIVE-BY-WIRE ACTIVE":"MANUAL DRIVE OVERRIDE"}),E.jsxs("div",{className:"flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider",children:[E.jsx("div",{className:`w-2 h-2 rounded-full ${f.active?"bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,1)]":"bg-neutral-600"}`}),E.jsx("span",{className:f.active?"text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]":"text-neutral-500",children:f.active?`AUTOWARE UNIVERSE LIVE • ${f.tracked_count} OBJECTS (${f.hz} Hz)`:"AUTOWARE UNIVERSE OFFLINE • SIMULATED PREVIEW"})]})]}),E.jsxs("div",{className:"flex items-center gap-3 pointer-events-auto",children:[E.jsxs("div",{className:"flex bg-[#080808]/90 backdrop-blur-xl border border-neutral-800/90 p-1 rounded-xl text-xs",children:[E.jsx("button",{onClick:()=>l("km/h"),className:`h-9 px-3 rounded-lg transition-all font-black ${a==="km/h"?"bg-neutral-800 text-white shadow":"text-neutral-500 hover:text-neutral-300"}`,children:"KM/H"}),E.jsx("button",{onClick:()=>l("mph"),className:`h-9 px-3 rounded-lg transition-all font-black ${a==="mph"?"bg-neutral-800 text-white shadow":"text-neutral-500 hover:text-neutral-300"}`,children:"MPH"})]}),E.jsxs("button",{onClick:c,className:"flex items-center gap-2 bg-[#080808]/95 hover:bg-neutral-900 text-neutral-200 border border-neutral-700/80 px-4 h-11 rounded-xl text-xs font-black transition-all shadow-xl",title:"Switch back to CAN Bus Engineering Monitor (Tab)",children:[E.jsx(L_,{className:"w-4 h-4 text-cyan-400"}),E.jsx("span",{children:"CAN MONITOR"}),E.jsx("span",{className:"text-[10px] text-neutral-400 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-700 font-bold",children:"Tab"})]})]})]})]})]})},$A=()=>{const s=ln.useRef(null);return yn(e=>e.cameraMode),ln.useEffect(()=>{const e=s.current;if(!e)return;const t=new kM;t.background=new ht(0),t.fog=new $f(0,.015);const i=e.clientWidth||window.innerWidth,a=e.clientHeight||window.innerHeight,l=new pi(50,i/a,.1,300);l.position.set(0,2.8,6.2);let c;try{c=new pA({antialias:!1,powerPreference:"high-performance",precision:"mediump",stencil:!1,depth:!0}),c.setSize(i,a),c.setPixelRatio(1),c.shadowMap.enabled=!1,e.appendChild(c.domElement)}catch(w){console.error("[DriveCockpit3D] WebGL context initialization failed:",w);return}const d=new gA(l,c.domElement);d.enableDamping=!0,d.dampingFactor=.05,d.maxPolarAngle=Math.PI/2-.05,d.minDistance=2,d.maxDistance=25,d.target.set(0,.8,0),d.enabled=!1;const h=new f1(16777215,.75);t.add(h);const f=new Ig(16777215,1.4);f.position.set(-12,18,-15),t.add(f);const _=new Ig(9684477,.9);_.position.set(12,12,15),t.add(_);const m=new c1(440020,1579035,.6);t.add(m);const g=new OA;t.add(g.group);const y=new UA;t.add(y.group);const M=new FA;t.add(M.group);let T,S=performance.now();const x=w=>{var G,$,H;T=requestAnimationFrame(x);const R=Math.min((w-S)/1e3,.1);S=w;const P=yn.getState(),U=P.telemetry,A=U.mode==="AUTONOMOUS"||U.mode==="AUTO",D=(H=($=(G=P.framesById[289])==null?void 0:G.signals)==null?void 0:$.yaw_rate_mrad_s)==null?void 0:H.value,k=typeof D=="number"?D:Math.round(-U.steer_act_deg*U.speed_act_kmh*.28);y.update(U.speed_act_kmh,U.steer_act_deg,k,U.brake_act_kpa,R),g.update(U.speed_act_kmh,U.steer_act_deg,A,P.plannedTrajectory,R),M.update(U.speed_act_kmh,P.perceptionObjects,P.rosStatus.active,R);const z=P.cameraMode;z==="orbit"?(d.enabled=!0,d.target.set(0,.75,.2),d.update()):(d.enabled=!1,z==="cabin"?(l.position.set(0,1.25,0),l.lookAt(0,1,-25)):(l.position.x+=(0-l.position.x)*(R*6),l.position.y+=(2.5-l.position.y)*(R*6),l.position.z+=(5.2-l.position.z)*(R*6),l.lookAt(0,.75,-8))),c.render(t,l)};T=requestAnimationFrame(x);const C=()=>{if(!e)return;const w=e.clientWidth,R=e.clientHeight;l.aspect=w/R,l.updateProjectionMatrix(),c.setSize(w,R)};window.addEventListener("resize",C);const I=new ResizeObserver(C);return I.observe(e),()=>{cancelAnimationFrame(T),window.removeEventListener("resize",C),I.disconnect(),d.dispose(),c.dispose(),c.domElement&&e.contains(c.domElement)&&e.removeChild(c.domElement)}},[]),E.jsxs("div",{className:"relative w-full h-full bg-black overflow-hidden select-none",children:[E.jsx("div",{ref:s,className:"absolute inset-0 w-full h-full"}),E.jsx(YA,{})]})},KA=()=>{const{initWebSocket:s,setCatalog:e,togglePause:t}=yn();ln.useEffect(()=>{const h=window.location.port==="5173"?"http://127.0.0.1:8000":"";fetch(`${h}/api/v1/catalog`).then(m=>{if(!m.ok)throw new Error(`HTTP ${m.status}`);return m.json()}).then(m=>{m.messages&&e(m.messages,m.source||"YAML Contracts")}).catch(m=>{console.error("Failed to fetch CAN catalog:",m)}),s();const f=m=>{if(m.code==="Space"&&m.target.tagName!=="INPUT"){m.preventDefault(),t();return}if(m.key==="Tab"&&m.target.tagName!=="INPUT"){m.preventDefault(),yn.getState().toggleActiveView();return}yn.getState().activeView==="cockpit"&&m.target.tagName!=="INPUT"&&(m.key==="1"?yn.getState().setCameraMode("chase"):m.key==="2"?yn.getState().setCameraMode("cabin"):m.key==="3"&&yn.getState().setCameraMode("orbit")),(m.ctrlKey||m.metaKey)&&(m.key==="="||m.key==="+"||m.code==="Equal"||m.code==="NumpadAdd"?(m.preventDefault(),yn.getState().setZoomLevel(g=>g+.1)):m.key==="-"||m.key==="_"||m.code==="Minus"||m.code==="NumpadSubtract"?(m.preventDefault(),yn.getState().setZoomLevel(g=>g-.1)):(m.key==="0"||m.code==="Digit0"||m.code==="Numpad0")&&(m.preventDefault(),yn.getState().setZoomLevel(1)))},_=m=>{if(m.ctrlKey||m.metaKey){m.preventDefault();const g=m.deltaY<0?.05:-.05;yn.getState().setZoomLevel(y=>y+g)}};return window.addEventListener("keydown",f),window.addEventListener("wheel",_,{passive:!1}),()=>{window.removeEventListener("keydown",f),window.removeEventListener("wheel",_)}},[s,e,t]);const{zoomLevel:i,zoomToast:a,setZoomToast:l,activeView:c}=yn();return ln.useEffect(()=>{if(a){const d=setTimeout(()=>l(null),1500);return()=>clearTimeout(d)}},[a,l]),ln.useEffect(()=>{document.documentElement.style.zoom=String(i)},[i]),E.jsxs("div",{className:"flex flex-col h-full w-full bg-black text-neutral-100 overflow-hidden font-sans select-none antialiased relative",children:[E.jsx(pS,{}),c==="cockpit"?E.jsx("div",{className:"flex-1 flex min-h-0 overflow-hidden relative",children:E.jsx($A,{})}):E.jsxs("div",{className:"flex-1 flex min-h-0 overflow-hidden",children:[E.jsx(mS,{}),E.jsx(US,{}),E.jsxs("div",{className:"w-[520px] flex flex-col min-h-0 border-l border-neutral-800 shrink-0 bg-black",children:[E.jsx(OS,{}),E.jsx(kS,{})]})]}),a&&E.jsxs("div",{className:"fixed bottom-5 right-5 z-50 bg-[#0d0d0d] text-cyan-300 font-mono text-xs px-3 py-1.5 rounded-lg border border-neutral-700 shadow-2xl flex items-center gap-2 pointer-events-none backdrop-blur animate-fade-in",children:[E.jsxs("span",{className:"font-bold",children:["Scale: ",a]}),E.jsx("span",{className:"text-[10px] text-neutral-400 font-sans",children:"(Ctrl+0 resets)"})]})]})},ZA=new Uy({defaultOptions:{queries:{refetchOnWindowFocus:!1,staleTime:5e3}}});sy.createRoot(document.getElementById("root")).render(E.jsx(fs.StrictMode,{children:E.jsx(oy,{client:ZA,children:E.jsx(KA,{})})}));
