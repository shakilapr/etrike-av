var Gv=Object.defineProperty;var S0=s=>{throw TypeError(s)};var Wv=(s,e,t)=>e in s?Gv(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var Ht=(s,e,t)=>Wv(s,typeof e!="symbol"?e+"":e,t),$d=(s,e,t)=>e.has(s)||S0("Cannot "+t);var me=(s,e,t)=>($d(s,e,"read from private field"),t?t.call(s):e.get(s)),St=(s,e,t)=>e.has(s)?S0("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(s):e.set(s,t),st=(s,e,t,i)=>($d(s,e,"write to private field"),i?i.call(s,t):e.set(s,t),t),Un=(s,e,t)=>($d(s,e,"access private method"),t);var mc=(s,e,t,i)=>({set _(a){st(s,e,a,t)},get _(){return me(s,e,i)}});(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const l of a)if(l.type==="childList")for(const c of l.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function t(a){const l={};return a.integrity&&(l.integrity=a.integrity),a.referrerPolicy&&(l.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?l.credentials="include":a.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function i(a){if(a.ep)return;a.ep=!0;const l=t(a);fetch(a.href,l)}})();function p_(s){return s&&s.__esModule&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s}var Kd={exports:{}},ko={},Zd={exports:{}},vt={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var M0;function jv(){if(M0)return vt;M0=1;var s=Symbol.for("react.element"),e=Symbol.for("react.portal"),t=Symbol.for("react.fragment"),i=Symbol.for("react.strict_mode"),a=Symbol.for("react.profiler"),l=Symbol.for("react.provider"),c=Symbol.for("react.context"),d=Symbol.for("react.forward_ref"),h=Symbol.for("react.suspense"),f=Symbol.for("react.memo"),_=Symbol.for("react.lazy"),m=Symbol.iterator;function g(F){return F===null||typeof F!="object"?null:(F=m&&F[m]||F["@@iterator"],typeof F=="function"?F:null)}var y={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},M=Object.assign,T={};function S(F,se,Se){this.props=F,this.context=se,this.refs=T,this.updater=Se||y}S.prototype.isReactComponent={},S.prototype.setState=function(F,se){if(typeof F!="object"&&typeof F!="function"&&F!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,F,se,"setState")},S.prototype.forceUpdate=function(F){this.updater.enqueueForceUpdate(this,F,"forceUpdate")};function x(){}x.prototype=S.prototype;function R(F,se,Se){this.props=F,this.context=se,this.refs=T,this.updater=Se||y}var I=R.prototype=new x;I.constructor=R,M(I,S.prototype),I.isPureReactComponent=!0;var A=Array.isArray,P=Object.prototype.hasOwnProperty,L={current:null},U={key:!0,ref:!0,__self:!0,__source:!0};function b(F,se,Se){var Ge,Be={},Ve=null,ae=null;if(se!=null)for(Ge in se.ref!==void 0&&(ae=se.ref),se.key!==void 0&&(Ve=""+se.key),se)P.call(se,Ge)&&!U.hasOwnProperty(Ge)&&(Be[Ge]=se[Ge]);var de=arguments.length-2;if(de===1)Be.children=Se;else if(1<de){for(var Ee=Array(de),$e=0;$e<de;$e++)Ee[$e]=arguments[$e+2];Be.children=Ee}if(F&&F.defaultProps)for(Ge in de=F.defaultProps,de)Be[Ge]===void 0&&(Be[Ge]=de[Ge]);return{$$typeof:s,type:F,key:Ve,ref:ae,props:Be,_owner:L.current}}function D(F,se){return{$$typeof:s,type:F.type,key:se,ref:F.ref,props:F.props,_owner:F._owner}}function B(F){return typeof F=="object"&&F!==null&&F.$$typeof===s}function V(F){var se={"=":"=0",":":"=2"};return"$"+F.replace(/[=:]/g,function(Se){return se[Se]})}var G=/\/+/g;function J(F,se){return typeof F=="object"&&F!==null&&F.key!=null?V(""+F.key):se.toString(36)}function H(F,se,Se,Ge,Be){var Ve=typeof F;(Ve==="undefined"||Ve==="boolean")&&(F=null);var ae=!1;if(F===null)ae=!0;else switch(Ve){case"string":case"number":ae=!0;break;case"object":switch(F.$$typeof){case s:case e:ae=!0}}if(ae)return ae=F,Be=Be(ae),F=Ge===""?"."+J(ae,0):Ge,A(Be)?(Se="",F!=null&&(Se=F.replace(G,"$&/")+"/"),H(Be,se,Se,"",function($e){return $e})):Be!=null&&(B(Be)&&(Be=D(Be,Se+(!Be.key||ae&&ae.key===Be.key?"":(""+Be.key).replace(G,"$&/")+"/")+F)),se.push(Be)),1;if(ae=0,Ge=Ge===""?".":Ge+":",A(F))for(var de=0;de<F.length;de++){Ve=F[de];var Ee=Ge+J(Ve,de);ae+=H(Ve,se,Se,Ee,Be)}else if(Ee=g(F),typeof Ee=="function")for(F=Ee.call(F),de=0;!(Ve=F.next()).done;)Ve=Ve.value,Ee=Ge+J(Ve,de++),ae+=H(Ve,se,Se,Ee,Be);else if(Ve==="object")throw se=String(F),Error("Objects are not valid as a React child (found: "+(se==="[object Object]"?"object with keys {"+Object.keys(F).join(", ")+"}":se)+"). If you meant to render a collection of children, use an array instead.");return ae}function Z(F,se,Se){if(F==null)return F;var Ge=[],Be=0;return H(F,Ge,"","",function(Ve){return se.call(Se,Ve,Be++)}),Ge}function he(F){if(F._status===-1){var se=F._result;se=se(),se.then(function(Se){(F._status===0||F._status===-1)&&(F._status=1,F._result=Se)},function(Se){(F._status===0||F._status===-1)&&(F._status=2,F._result=Se)}),F._status===-1&&(F._status=0,F._result=se)}if(F._status===1)return F._result.default;throw F._result}var ne={current:null},ee={transition:null},$={ReactCurrentDispatcher:ne,ReactCurrentBatchConfig:ee,ReactCurrentOwner:L};function K(){throw Error("act(...) is not supported in production builds of React.")}return vt.Children={map:Z,forEach:function(F,se,Se){Z(F,function(){se.apply(this,arguments)},Se)},count:function(F){var se=0;return Z(F,function(){se++}),se},toArray:function(F){return Z(F,function(se){return se})||[]},only:function(F){if(!B(F))throw Error("React.Children.only expected to receive a single React element child.");return F}},vt.Component=S,vt.Fragment=t,vt.Profiler=a,vt.PureComponent=R,vt.StrictMode=i,vt.Suspense=h,vt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=$,vt.act=K,vt.cloneElement=function(F,se,Se){if(F==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+F+".");var Ge=M({},F.props),Be=F.key,Ve=F.ref,ae=F._owner;if(se!=null){if(se.ref!==void 0&&(Ve=se.ref,ae=L.current),se.key!==void 0&&(Be=""+se.key),F.type&&F.type.defaultProps)var de=F.type.defaultProps;for(Ee in se)P.call(se,Ee)&&!U.hasOwnProperty(Ee)&&(Ge[Ee]=se[Ee]===void 0&&de!==void 0?de[Ee]:se[Ee])}var Ee=arguments.length-2;if(Ee===1)Ge.children=Se;else if(1<Ee){de=Array(Ee);for(var $e=0;$e<Ee;$e++)de[$e]=arguments[$e+2];Ge.children=de}return{$$typeof:s,type:F.type,key:Be,ref:Ve,props:Ge,_owner:ae}},vt.createContext=function(F){return F={$$typeof:c,_currentValue:F,_currentValue2:F,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},F.Provider={$$typeof:l,_context:F},F.Consumer=F},vt.createElement=b,vt.createFactory=function(F){var se=b.bind(null,F);return se.type=F,se},vt.createRef=function(){return{current:null}},vt.forwardRef=function(F){return{$$typeof:d,render:F}},vt.isValidElement=B,vt.lazy=function(F){return{$$typeof:_,_payload:{_status:-1,_result:F},_init:he}},vt.memo=function(F,se){return{$$typeof:f,type:F,compare:se===void 0?null:se}},vt.startTransition=function(F){var se=ee.transition;ee.transition={};try{F()}finally{ee.transition=se}},vt.unstable_act=K,vt.useCallback=function(F,se){return ne.current.useCallback(F,se)},vt.useContext=function(F){return ne.current.useContext(F)},vt.useDebugValue=function(){},vt.useDeferredValue=function(F){return ne.current.useDeferredValue(F)},vt.useEffect=function(F,se){return ne.current.useEffect(F,se)},vt.useId=function(){return ne.current.useId()},vt.useImperativeHandle=function(F,se,Se){return ne.current.useImperativeHandle(F,se,Se)},vt.useInsertionEffect=function(F,se){return ne.current.useInsertionEffect(F,se)},vt.useLayoutEffect=function(F,se){return ne.current.useLayoutEffect(F,se)},vt.useMemo=function(F,se){return ne.current.useMemo(F,se)},vt.useReducer=function(F,se,Se){return ne.current.useReducer(F,se,Se)},vt.useRef=function(F){return ne.current.useRef(F)},vt.useState=function(F){return ne.current.useState(F)},vt.useSyncExternalStore=function(F,se,Se){return ne.current.useSyncExternalStore(F,se,Se)},vt.useTransition=function(){return ne.current.useTransition()},vt.version="18.3.1",vt}var E0;function Df(){return E0||(E0=1,Zd.exports=jv()),Zd.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var w0;function Xv(){if(w0)return ko;w0=1;var s=Df(),e=Symbol.for("react.element"),t=Symbol.for("react.fragment"),i=Object.prototype.hasOwnProperty,a=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l={key:!0,ref:!0,__self:!0,__source:!0};function c(d,h,f){var _,m={},g=null,y=null;f!==void 0&&(g=""+f),h.key!==void 0&&(g=""+h.key),h.ref!==void 0&&(y=h.ref);for(_ in h)i.call(h,_)&&!l.hasOwnProperty(_)&&(m[_]=h[_]);if(d&&d.defaultProps)for(_ in h=d.defaultProps,h)m[_]===void 0&&(m[_]=h[_]);return{$$typeof:e,type:d,key:g,ref:y,props:m,_owner:a.current}}return ko.Fragment=t,ko.jsx=c,ko.jsxs=c,ko}var b0;function qv(){return b0||(b0=1,Kd.exports=Xv()),Kd.exports}var E=qv(),on=Df();const ds=p_(on);var gc={},Qd={exports:{}},Qn={},Jd={exports:{}},eh={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var T0;function Yv(){return T0||(T0=1,(function(s){function e(ee,$){var K=ee.length;ee.push($);e:for(;0<K;){var F=K-1>>>1,se=ee[F];if(0<a(se,$))ee[F]=$,ee[K]=se,K=F;else break e}}function t(ee){return ee.length===0?null:ee[0]}function i(ee){if(ee.length===0)return null;var $=ee[0],K=ee.pop();if(K!==$){ee[0]=K;e:for(var F=0,se=ee.length,Se=se>>>1;F<Se;){var Ge=2*(F+1)-1,Be=ee[Ge],Ve=Ge+1,ae=ee[Ve];if(0>a(Be,K))Ve<se&&0>a(ae,Be)?(ee[F]=ae,ee[Ve]=K,F=Ve):(ee[F]=Be,ee[Ge]=K,F=Ge);else if(Ve<se&&0>a(ae,K))ee[F]=ae,ee[Ve]=K,F=Ve;else break e}}return $}function a(ee,$){var K=ee.sortIndex-$.sortIndex;return K!==0?K:ee.id-$.id}if(typeof performance=="object"&&typeof performance.now=="function"){var l=performance;s.unstable_now=function(){return l.now()}}else{var c=Date,d=c.now();s.unstable_now=function(){return c.now()-d}}var h=[],f=[],_=1,m=null,g=3,y=!1,M=!1,T=!1,S=typeof setTimeout=="function"?setTimeout:null,x=typeof clearTimeout=="function"?clearTimeout:null,R=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function I(ee){for(var $=t(f);$!==null;){if($.callback===null)i(f);else if($.startTime<=ee)i(f),$.sortIndex=$.expirationTime,e(h,$);else break;$=t(f)}}function A(ee){if(T=!1,I(ee),!M)if(t(h)!==null)M=!0,he(P);else{var $=t(f);$!==null&&ne(A,$.startTime-ee)}}function P(ee,$){M=!1,T&&(T=!1,x(b),b=-1),y=!0;var K=g;try{for(I($),m=t(h);m!==null&&(!(m.expirationTime>$)||ee&&!V());){var F=m.callback;if(typeof F=="function"){m.callback=null,g=m.priorityLevel;var se=F(m.expirationTime<=$);$=s.unstable_now(),typeof se=="function"?m.callback=se:m===t(h)&&i(h),I($)}else i(h);m=t(h)}if(m!==null)var Se=!0;else{var Ge=t(f);Ge!==null&&ne(A,Ge.startTime-$),Se=!1}return Se}finally{m=null,g=K,y=!1}}var L=!1,U=null,b=-1,D=5,B=-1;function V(){return!(s.unstable_now()-B<D)}function G(){if(U!==null){var ee=s.unstable_now();B=ee;var $=!0;try{$=U(!0,ee)}finally{$?J():(L=!1,U=null)}}else L=!1}var J;if(typeof R=="function")J=function(){R(G)};else if(typeof MessageChannel<"u"){var H=new MessageChannel,Z=H.port2;H.port1.onmessage=G,J=function(){Z.postMessage(null)}}else J=function(){S(G,0)};function he(ee){U=ee,L||(L=!0,J())}function ne(ee,$){b=S(function(){ee(s.unstable_now())},$)}s.unstable_IdlePriority=5,s.unstable_ImmediatePriority=1,s.unstable_LowPriority=4,s.unstable_NormalPriority=3,s.unstable_Profiling=null,s.unstable_UserBlockingPriority=2,s.unstable_cancelCallback=function(ee){ee.callback=null},s.unstable_continueExecution=function(){M||y||(M=!0,he(P))},s.unstable_forceFrameRate=function(ee){0>ee||125<ee?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):D=0<ee?Math.floor(1e3/ee):5},s.unstable_getCurrentPriorityLevel=function(){return g},s.unstable_getFirstCallbackNode=function(){return t(h)},s.unstable_next=function(ee){switch(g){case 1:case 2:case 3:var $=3;break;default:$=g}var K=g;g=$;try{return ee()}finally{g=K}},s.unstable_pauseExecution=function(){},s.unstable_requestPaint=function(){},s.unstable_runWithPriority=function(ee,$){switch(ee){case 1:case 2:case 3:case 4:case 5:break;default:ee=3}var K=g;g=ee;try{return $()}finally{g=K}},s.unstable_scheduleCallback=function(ee,$,K){var F=s.unstable_now();switch(typeof K=="object"&&K!==null?(K=K.delay,K=typeof K=="number"&&0<K?F+K:F):K=F,ee){case 1:var se=-1;break;case 2:se=250;break;case 5:se=1073741823;break;case 4:se=1e4;break;default:se=5e3}return se=K+se,ee={id:_++,callback:$,priorityLevel:ee,startTime:K,expirationTime:se,sortIndex:-1},K>F?(ee.sortIndex=K,e(f,ee),t(h)===null&&ee===t(f)&&(T?(x(b),b=-1):T=!0,ne(A,K-F))):(ee.sortIndex=se,e(h,ee),M||y||(M=!0,he(P))),ee},s.unstable_shouldYield=V,s.unstable_wrapCallback=function(ee){var $=g;return function(){var K=g;g=$;try{return ee.apply(this,arguments)}finally{g=K}}}})(eh)),eh}var A0;function $v(){return A0||(A0=1,Jd.exports=Yv()),Jd.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var C0;function Kv(){if(C0)return Qn;C0=1;var s=Df(),e=$v();function t(n){for(var r="https://reactjs.org/docs/error-decoder.html?invariant="+n,o=1;o<arguments.length;o++)r+="&args[]="+encodeURIComponent(arguments[o]);return"Minified React error #"+n+"; visit "+r+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var i=new Set,a={};function l(n,r){c(n,r),c(n+"Capture",r)}function c(n,r){for(a[n]=r,n=0;n<r.length;n++)i.add(r[n])}var d=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),h=Object.prototype.hasOwnProperty,f=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,_={},m={};function g(n){return h.call(m,n)?!0:h.call(_,n)?!1:f.test(n)?m[n]=!0:(_[n]=!0,!1)}function y(n,r,o,u){if(o!==null&&o.type===0)return!1;switch(typeof r){case"function":case"symbol":return!0;case"boolean":return u?!1:o!==null?!o.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function M(n,r,o,u){if(r===null||typeof r>"u"||y(n,r,o,u))return!0;if(u)return!1;if(o!==null)switch(o.type){case 3:return!r;case 4:return r===!1;case 5:return isNaN(r);case 6:return isNaN(r)||1>r}return!1}function T(n,r,o,u,p,v,C){this.acceptsBooleans=r===2||r===3||r===4,this.attributeName=u,this.attributeNamespace=p,this.mustUseProperty=o,this.propertyName=n,this.type=r,this.sanitizeURL=v,this.removeEmptyString=C}var S={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){S[n]=new T(n,0,!1,n,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var r=n[0];S[r]=new T(r,1,!1,n[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(n){S[n]=new T(n,2,!1,n.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){S[n]=new T(n,2,!1,n,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){S[n]=new T(n,3,!1,n.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(n){S[n]=new T(n,3,!0,n,null,!1,!1)}),["capture","download"].forEach(function(n){S[n]=new T(n,4,!1,n,null,!1,!1)}),["cols","rows","size","span"].forEach(function(n){S[n]=new T(n,6,!1,n,null,!1,!1)}),["rowSpan","start"].forEach(function(n){S[n]=new T(n,5,!1,n.toLowerCase(),null,!1,!1)});var x=/[\-:]([a-z])/g;function R(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var r=n.replace(x,R);S[r]=new T(r,1,!1,n,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var r=n.replace(x,R);S[r]=new T(r,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(n){var r=n.replace(x,R);S[r]=new T(r,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(n){S[n]=new T(n,1,!1,n.toLowerCase(),null,!1,!1)}),S.xlinkHref=new T("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(n){S[n]=new T(n,1,!1,n.toLowerCase(),null,!0,!0)});function I(n,r,o,u){var p=S.hasOwnProperty(r)?S[r]:null;(p!==null?p.type!==0:u||!(2<r.length)||r[0]!=="o"&&r[0]!=="O"||r[1]!=="n"&&r[1]!=="N")&&(M(r,o,p,u)&&(o=null),u||p===null?g(r)&&(o===null?n.removeAttribute(r):n.setAttribute(r,""+o)):p.mustUseProperty?n[p.propertyName]=o===null?p.type===3?!1:"":o:(r=p.attributeName,u=p.attributeNamespace,o===null?n.removeAttribute(r):(p=p.type,o=p===3||p===4&&o===!0?"":""+o,u?n.setAttributeNS(u,r,o):n.setAttribute(r,o))))}var A=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,P=Symbol.for("react.element"),L=Symbol.for("react.portal"),U=Symbol.for("react.fragment"),b=Symbol.for("react.strict_mode"),D=Symbol.for("react.profiler"),B=Symbol.for("react.provider"),V=Symbol.for("react.context"),G=Symbol.for("react.forward_ref"),J=Symbol.for("react.suspense"),H=Symbol.for("react.suspense_list"),Z=Symbol.for("react.memo"),he=Symbol.for("react.lazy"),ne=Symbol.for("react.offscreen"),ee=Symbol.iterator;function $(n){return n===null||typeof n!="object"?null:(n=ee&&n[ee]||n["@@iterator"],typeof n=="function"?n:null)}var K=Object.assign,F;function se(n){if(F===void 0)try{throw Error()}catch(o){var r=o.stack.trim().match(/\n( *(at )?)/);F=r&&r[1]||""}return`
`+F+n}var Se=!1;function Ge(n,r){if(!n||Se)return"";Se=!0;var o=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(r)if(r=function(){throw Error()},Object.defineProperty(r.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(r,[])}catch(ue){var u=ue}Reflect.construct(n,[],r)}else{try{r.call()}catch(ue){u=ue}n.call(r.prototype)}else{try{throw Error()}catch(ue){u=ue}n()}}catch(ue){if(ue&&u&&typeof ue.stack=="string"){for(var p=ue.stack.split(`
`),v=u.stack.split(`
`),C=p.length-1,k=v.length-1;1<=C&&0<=k&&p[C]!==v[k];)k--;for(;1<=C&&0<=k;C--,k--)if(p[C]!==v[k]){if(C!==1||k!==1)do if(C--,k--,0>k||p[C]!==v[k]){var z=`
`+p[C].replace(" at new "," at ");return n.displayName&&z.includes("<anonymous>")&&(z=z.replace("<anonymous>",n.displayName)),z}while(1<=C&&0<=k);break}}}finally{Se=!1,Error.prepareStackTrace=o}return(n=n?n.displayName||n.name:"")?se(n):""}function Be(n){switch(n.tag){case 5:return se(n.type);case 16:return se("Lazy");case 13:return se("Suspense");case 19:return se("SuspenseList");case 0:case 2:case 15:return n=Ge(n.type,!1),n;case 11:return n=Ge(n.type.render,!1),n;case 1:return n=Ge(n.type,!0),n;default:return""}}function Ve(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case U:return"Fragment";case L:return"Portal";case D:return"Profiler";case b:return"StrictMode";case J:return"Suspense";case H:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case V:return(n.displayName||"Context")+".Consumer";case B:return(n._context.displayName||"Context")+".Provider";case G:var r=n.render;return n=n.displayName,n||(n=r.displayName||r.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case Z:return r=n.displayName||null,r!==null?r:Ve(n.type)||"Memo";case he:r=n._payload,n=n._init;try{return Ve(n(r))}catch{}}return null}function ae(n){var r=n.type;switch(n.tag){case 24:return"Cache";case 9:return(r.displayName||"Context")+".Consumer";case 10:return(r._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=r.render,n=n.displayName||n.name||"",r.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return r;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Ve(r);case 8:return r===b?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof r=="function")return r.displayName||r.name||null;if(typeof r=="string")return r}return null}function de(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function Ee(n){var r=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(r==="checkbox"||r==="radio")}function $e(n){var r=Ee(n)?"checked":"value",o=Object.getOwnPropertyDescriptor(n.constructor.prototype,r),u=""+n[r];if(!n.hasOwnProperty(r)&&typeof o<"u"&&typeof o.get=="function"&&typeof o.set=="function"){var p=o.get,v=o.set;return Object.defineProperty(n,r,{configurable:!0,get:function(){return p.call(this)},set:function(C){u=""+C,v.call(this,C)}}),Object.defineProperty(n,r,{enumerable:o.enumerable}),{getValue:function(){return u},setValue:function(C){u=""+C},stopTracking:function(){n._valueTracker=null,delete n[r]}}}}function Fe(n){n._valueTracker||(n._valueTracker=$e(n))}function dt(n){if(!n)return!1;var r=n._valueTracker;if(!r)return!0;var o=r.getValue(),u="";return n&&(u=Ee(n)?n.checked?"true":"false":n.value),n=u,n!==o?(r.setValue(n),!0):!1}function Gt(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function ht(n,r){var o=r.checked;return K({},r,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:o??n._wrapperState.initialChecked})}function xt(n,r){var o=r.defaultValue==null?"":r.defaultValue,u=r.checked!=null?r.checked:r.defaultChecked;o=de(r.value!=null?r.value:o),n._wrapperState={initialChecked:u,initialValue:o,controlled:r.type==="checkbox"||r.type==="radio"?r.checked!=null:r.value!=null}}function At(n,r){r=r.checked,r!=null&&I(n,"checked",r,!1)}function pt(n,r){At(n,r);var o=de(r.value),u=r.type;if(o!=null)u==="number"?(o===0&&n.value===""||n.value!=o)&&(n.value=""+o):n.value!==""+o&&(n.value=""+o);else if(u==="submit"||u==="reset"){n.removeAttribute("value");return}r.hasOwnProperty("value")?Xt(n,r.type,o):r.hasOwnProperty("defaultValue")&&Xt(n,r.type,de(r.defaultValue)),r.checked==null&&r.defaultChecked!=null&&(n.defaultChecked=!!r.defaultChecked)}function Ut(n,r,o){if(r.hasOwnProperty("value")||r.hasOwnProperty("defaultValue")){var u=r.type;if(!(u!=="submit"&&u!=="reset"||r.value!==void 0&&r.value!==null))return;r=""+n._wrapperState.initialValue,o||r===n.value||(n.value=r),n.defaultValue=r}o=n.name,o!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,o!==""&&(n.name=o)}function Xt(n,r,o){(r!=="number"||Gt(n.ownerDocument)!==n)&&(o==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+o&&(n.defaultValue=""+o))}var Ft=Array.isArray;function Ct(n,r,o,u){if(n=n.options,r){r={};for(var p=0;p<o.length;p++)r["$"+o[p]]=!0;for(o=0;o<n.length;o++)p=r.hasOwnProperty("$"+n[o].value),n[o].selected!==p&&(n[o].selected=p),p&&u&&(n[o].defaultSelected=!0)}else{for(o=""+de(o),r=null,p=0;p<n.length;p++){if(n[p].value===o){n[p].selected=!0,u&&(n[p].defaultSelected=!0);return}r!==null||n[p].disabled||(r=n[p])}r!==null&&(r.selected=!0)}}function $t(n,r){if(r.dangerouslySetInnerHTML!=null)throw Error(t(91));return K({},r,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function X(n,r){var o=r.value;if(o==null){if(o=r.children,r=r.defaultValue,o!=null){if(r!=null)throw Error(t(92));if(Ft(o)){if(1<o.length)throw Error(t(93));o=o[0]}r=o}r==null&&(r=""),o=r}n._wrapperState={initialValue:de(o)}}function fn(n,r){var o=de(r.value),u=de(r.defaultValue);o!=null&&(o=""+o,o!==n.value&&(n.value=o),r.defaultValue==null&&n.defaultValue!==o&&(n.defaultValue=o)),u!=null&&(n.defaultValue=""+u)}function Rt(n){var r=n.textContent;r===n._wrapperState.initialValue&&r!==""&&r!==null&&(n.value=r)}function O(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function w(n,r){return n==null||n==="http://www.w3.org/1999/xhtml"?O(r):n==="http://www.w3.org/2000/svg"&&r==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var Q,le=(function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(r,o,u,p){MSApp.execUnsafeLocalFunction(function(){return n(r,o,u,p)})}:n})(function(n,r){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=r;else{for(Q=Q||document.createElement("div"),Q.innerHTML="<svg>"+r.valueOf().toString()+"</svg>",r=Q.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;r.firstChild;)n.appendChild(r.firstChild)}});function fe(n,r){if(r){var o=n.firstChild;if(o&&o===n.lastChild&&o.nodeType===3){o.nodeValue=r;return}}n.textContent=r}var we={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Ae=["Webkit","ms","Moz","O"];Object.keys(we).forEach(function(n){Ae.forEach(function(r){r=r+n.charAt(0).toUpperCase()+n.substring(1),we[r]=we[n]})});function pe(n,r,o){return r==null||typeof r=="boolean"||r===""?"":o||typeof r!="number"||r===0||we.hasOwnProperty(n)&&we[n]?(""+r).trim():r+"px"}function _e(n,r){n=n.style;for(var o in r)if(r.hasOwnProperty(o)){var u=o.indexOf("--")===0,p=pe(o,r[o],u);o==="float"&&(o="cssFloat"),u?n.setProperty(o,p):n[o]=p}}var Pe=K({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Ke(n,r){if(r){if(Pe[n]&&(r.children!=null||r.dangerouslySetInnerHTML!=null))throw Error(t(137,n));if(r.dangerouslySetInnerHTML!=null){if(r.children!=null)throw Error(t(60));if(typeof r.dangerouslySetInnerHTML!="object"||!("__html"in r.dangerouslySetInnerHTML))throw Error(t(61))}if(r.style!=null&&typeof r.style!="object")throw Error(t(62))}}function Ne(n,r){if(n.indexOf("-")===-1)return typeof r.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Te=null;function Ze(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var tt=null,rt=null,W=null;function Ce(n){if(n=Eo(n)){if(typeof tt!="function")throw Error(t(280));var r=n.stateNode;r&&(r=Pl(r),tt(n.stateNode,n.type,r))}}function ge(n){rt?W?W.push(n):W=[n]:rt=n}function Re(){if(rt){var n=rt,r=W;if(W=rt=null,Ce(n),r)for(n=0;n<r.length;n++)Ce(r[n])}}function Oe(n,r){return n(r)}function xe(){}var Je=!1;function qe(n,r,o){if(Je)return n(r,o);Je=!0;try{return Oe(n,r,o)}finally{Je=!1,(rt!==null||W!==null)&&(xe(),Re())}}function Pt(n,r){var o=n.stateNode;if(o===null)return null;var u=Pl(o);if(u===null)return null;o=u[r];e:switch(r){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(u=!u.disabled)||(n=n.type,u=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!u;break e;default:n=!1}if(n)return null;if(o&&typeof o!="function")throw Error(t(231,r,typeof o));return o}var bt=!1;if(d)try{var Tn={};Object.defineProperty(Tn,"passive",{get:function(){bt=!0}}),window.addEventListener("test",Tn,Tn),window.removeEventListener("test",Tn,Tn)}catch{bt=!1}function hi(n,r,o,u,p,v,C,k,z){var ue=Array.prototype.slice.call(arguments,3);try{r.apply(o,ue)}catch(ye){this.onError(ye)}}var ps=!1,Zs=null,ms=!1,gs=null,xu={onError:function(n){ps=!0,Zs=n}};function hl(n,r,o,u,p,v,C,k,z){ps=!1,Zs=null,hi.apply(xu,arguments)}function fl(n,r,o,u,p,v,C,k,z){if(hl.apply(this,arguments),ps){if(ps){var ue=Zs;ps=!1,Zs=null}else throw Error(t(198));ms||(ms=!0,gs=ue)}}function zn(n){var r=n,o=n;if(n.alternate)for(;r.return;)r=r.return;else{n=r;do r=n,(r.flags&4098)!==0&&(o=r.return),n=r.return;while(n)}return r.tag===3?o:null}function Qs(n){if(n.tag===13){var r=n.memoizedState;if(r===null&&(n=n.alternate,n!==null&&(r=n.memoizedState)),r!==null)return r.dehydrated}return null}function to(n){if(zn(n)!==n)throw Error(t(188))}function pl(n){var r=n.alternate;if(!r){if(r=zn(n),r===null)throw Error(t(188));return r!==n?null:n}for(var o=n,u=r;;){var p=o.return;if(p===null)break;var v=p.alternate;if(v===null){if(u=p.return,u!==null){o=u;continue}break}if(p.child===v.child){for(v=p.child;v;){if(v===o)return to(p),n;if(v===u)return to(p),r;v=v.sibling}throw Error(t(188))}if(o.return!==u.return)o=p,u=v;else{for(var C=!1,k=p.child;k;){if(k===o){C=!0,o=p,u=v;break}if(k===u){C=!0,u=p,o=v;break}k=k.sibling}if(!C){for(k=v.child;k;){if(k===o){C=!0,o=v,u=p;break}if(k===u){C=!0,u=v,o=p;break}k=k.sibling}if(!C)throw Error(t(189))}}if(o.alternate!==u)throw Error(t(190))}if(o.tag!==3)throw Error(t(188));return o.stateNode.current===o?n:r}function _s(n){return n=pl(n),n!==null?no(n):null}function no(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var r=no(n);if(r!==null)return r;n=n.sibling}return null}var xs=e.unstable_scheduleCallback,io=e.unstable_cancelCallback,ml=e.unstable_shouldYield,vu=e.unstable_requestPaint,Qt=e.unstable_now,yu=e.unstable_getCurrentPriorityLevel,ro=e.unstable_ImmediatePriority,so=e.unstable_UserBlockingPriority,N=e.unstable_NormalPriority,j=e.unstable_LowPriority,ce=e.unstable_IdlePriority,ie=null,te=null;function Ie(n){if(te&&typeof te.onCommitFiberRoot=="function")try{te.onCommitFiberRoot(ie,n,void 0,(n.current.flags&128)===128)}catch{}}var Le=Math.clz32?Math.clz32:Qe,De=Math.log,je=Math.LN2;function Qe(n){return n>>>=0,n===0?32:31-(De(n)/je|0)|0}var ct=64,mt=4194304;function He(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function Mt(n,r){var o=n.pendingLanes;if(o===0)return 0;var u=0,p=n.suspendedLanes,v=n.pingedLanes,C=o&268435455;if(C!==0){var k=C&~p;k!==0?u=He(k):(v&=C,v!==0&&(u=He(v)))}else C=o&~p,C!==0?u=He(C):v!==0&&(u=He(v));if(u===0)return 0;if(r!==0&&r!==u&&(r&p)===0&&(p=u&-u,v=r&-r,p>=v||p===16&&(v&4194240)!==0))return r;if((u&4)!==0&&(u|=o&16),r=n.entangledLanes,r!==0)for(n=n.entanglements,r&=u;0<r;)o=31-Le(r),p=1<<o,u|=n[o],r&=~p;return u}function sn(n,r){switch(n){case 1:case 2:case 4:return r+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return r+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Wt(n,r){for(var o=n.suspendedLanes,u=n.pingedLanes,p=n.expirationTimes,v=n.pendingLanes;0<v;){var C=31-Le(v),k=1<<C,z=p[C];z===-1?((k&o)===0||(k&u)!==0)&&(p[C]=sn(k,r)):z<=r&&(n.expiredLanes|=k),v&=~k}}function It(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function pn(){var n=ct;return ct<<=1,(ct&4194240)===0&&(ct=64),n}function ke(n){for(var r=[],o=0;31>o;o++)r.push(n);return r}function ln(n,r,o){n.pendingLanes|=r,r!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,r=31-Le(r),n[r]=o}function Et(n,r){var o=n.pendingLanes&~r;n.pendingLanes=r,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=r,n.mutableReadLanes&=r,n.entangledLanes&=r,r=n.entanglements;var u=n.eventTimes;for(n=n.expirationTimes;0<o;){var p=31-Le(o),v=1<<p;r[p]=0,u[p]=-1,n[p]=-1,o&=~v}}function Pn(n,r){var o=n.entangledLanes|=r;for(n=n.entanglements;o;){var u=31-Le(o),p=1<<u;p&r|n[u]&r&&(n[u]|=r),o&=~p}}var gt=0;function wi(n){return n&=-n,1<n?4<n?(n&268435455)!==0?16:536870912:4:1}var ur,Nt,Kt,bi,Ot,fi=!1,Ti=[],Ai=null,Ir=null,Ur=null,ao=new Map,oo=new Map,Fr=[],dx="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function rp(n,r){switch(n){case"focusin":case"focusout":Ai=null;break;case"dragenter":case"dragleave":Ir=null;break;case"mouseover":case"mouseout":Ur=null;break;case"pointerover":case"pointerout":ao.delete(r.pointerId);break;case"gotpointercapture":case"lostpointercapture":oo.delete(r.pointerId)}}function lo(n,r,o,u,p,v){return n===null||n.nativeEvent!==v?(n={blockedOn:r,domEventName:o,eventSystemFlags:u,nativeEvent:v,targetContainers:[p]},r!==null&&(r=Eo(r),r!==null&&Nt(r)),n):(n.eventSystemFlags|=u,r=n.targetContainers,p!==null&&r.indexOf(p)===-1&&r.push(p),n)}function hx(n,r,o,u,p){switch(r){case"focusin":return Ai=lo(Ai,n,r,o,u,p),!0;case"dragenter":return Ir=lo(Ir,n,r,o,u,p),!0;case"mouseover":return Ur=lo(Ur,n,r,o,u,p),!0;case"pointerover":var v=p.pointerId;return ao.set(v,lo(ao.get(v)||null,n,r,o,u,p)),!0;case"gotpointercapture":return v=p.pointerId,oo.set(v,lo(oo.get(v)||null,n,r,o,u,p)),!0}return!1}function sp(n){var r=vs(n.target);if(r!==null){var o=zn(r);if(o!==null){if(r=o.tag,r===13){if(r=Qs(o),r!==null){n.blockedOn=r,Ot(n.priority,function(){Kt(o)});return}}else if(r===3&&o.stateNode.current.memoizedState.isDehydrated){n.blockedOn=o.tag===3?o.stateNode.containerInfo:null;return}}}n.blockedOn=null}function gl(n){if(n.blockedOn!==null)return!1;for(var r=n.targetContainers;0<r.length;){var o=Mu(n.domEventName,n.eventSystemFlags,r[0],n.nativeEvent);if(o===null){o=n.nativeEvent;var u=new o.constructor(o.type,o);Te=u,o.target.dispatchEvent(u),Te=null}else return r=Eo(o),r!==null&&Nt(r),n.blockedOn=o,!1;r.shift()}return!0}function ap(n,r,o){gl(n)&&o.delete(r)}function fx(){fi=!1,Ai!==null&&gl(Ai)&&(Ai=null),Ir!==null&&gl(Ir)&&(Ir=null),Ur!==null&&gl(Ur)&&(Ur=null),ao.forEach(ap),oo.forEach(ap)}function co(n,r){n.blockedOn===r&&(n.blockedOn=null,fi||(fi=!0,e.unstable_scheduleCallback(e.unstable_NormalPriority,fx)))}function uo(n){function r(p){return co(p,n)}if(0<Ti.length){co(Ti[0],n);for(var o=1;o<Ti.length;o++){var u=Ti[o];u.blockedOn===n&&(u.blockedOn=null)}}for(Ai!==null&&co(Ai,n),Ir!==null&&co(Ir,n),Ur!==null&&co(Ur,n),ao.forEach(r),oo.forEach(r),o=0;o<Fr.length;o++)u=Fr[o],u.blockedOn===n&&(u.blockedOn=null);for(;0<Fr.length&&(o=Fr[0],o.blockedOn===null);)sp(o),o.blockedOn===null&&Fr.shift()}var Js=A.ReactCurrentBatchConfig,_l=!0;function px(n,r,o,u){var p=gt,v=Js.transition;Js.transition=null;try{gt=1,Su(n,r,o,u)}finally{gt=p,Js.transition=v}}function mx(n,r,o,u){var p=gt,v=Js.transition;Js.transition=null;try{gt=4,Su(n,r,o,u)}finally{gt=p,Js.transition=v}}function Su(n,r,o,u){if(_l){var p=Mu(n,r,o,u);if(p===null)Bu(n,r,u,xl,o),rp(n,u);else if(hx(p,n,r,o,u))u.stopPropagation();else if(rp(n,u),r&4&&-1<dx.indexOf(n)){for(;p!==null;){var v=Eo(p);if(v!==null&&ur(v),v=Mu(n,r,o,u),v===null&&Bu(n,r,u,xl,o),v===p)break;p=v}p!==null&&u.stopPropagation()}else Bu(n,r,u,null,o)}}var xl=null;function Mu(n,r,o,u){if(xl=null,n=Ze(u),n=vs(n),n!==null)if(r=zn(n),r===null)n=null;else if(o=r.tag,o===13){if(n=Qs(r),n!==null)return n;n=null}else if(o===3){if(r.stateNode.current.memoizedState.isDehydrated)return r.tag===3?r.stateNode.containerInfo:null;n=null}else r!==n&&(n=null);return xl=n,null}function op(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(yu()){case ro:return 1;case so:return 4;case N:case j:return 16;case ce:return 536870912;default:return 16}default:return 16}}var Or=null,Eu=null,vl=null;function lp(){if(vl)return vl;var n,r=Eu,o=r.length,u,p="value"in Or?Or.value:Or.textContent,v=p.length;for(n=0;n<o&&r[n]===p[n];n++);var C=o-n;for(u=1;u<=C&&r[o-u]===p[v-u];u++);return vl=p.slice(n,1<u?1-u:void 0)}function yl(n){var r=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&r===13&&(n=13)):n=r,n===10&&(n=13),32<=n||n===13?n:0}function Sl(){return!0}function cp(){return!1}function ii(n){function r(o,u,p,v,C){this._reactName=o,this._targetInst=p,this.type=u,this.nativeEvent=v,this.target=C,this.currentTarget=null;for(var k in n)n.hasOwnProperty(k)&&(o=n[k],this[k]=o?o(v):v[k]);return this.isDefaultPrevented=(v.defaultPrevented!=null?v.defaultPrevented:v.returnValue===!1)?Sl:cp,this.isPropagationStopped=cp,this}return K(r.prototype,{preventDefault:function(){this.defaultPrevented=!0;var o=this.nativeEvent;o&&(o.preventDefault?o.preventDefault():typeof o.returnValue!="unknown"&&(o.returnValue=!1),this.isDefaultPrevented=Sl)},stopPropagation:function(){var o=this.nativeEvent;o&&(o.stopPropagation?o.stopPropagation():typeof o.cancelBubble!="unknown"&&(o.cancelBubble=!0),this.isPropagationStopped=Sl)},persist:function(){},isPersistent:Sl}),r}var ea={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},wu=ii(ea),ho=K({},ea,{view:0,detail:0}),gx=ii(ho),bu,Tu,fo,Ml=K({},ho,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Cu,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==fo&&(fo&&n.type==="mousemove"?(bu=n.screenX-fo.screenX,Tu=n.screenY-fo.screenY):Tu=bu=0,fo=n),bu)},movementY:function(n){return"movementY"in n?n.movementY:Tu}}),up=ii(Ml),_x=K({},Ml,{dataTransfer:0}),xx=ii(_x),vx=K({},ho,{relatedTarget:0}),Au=ii(vx),yx=K({},ea,{animationName:0,elapsedTime:0,pseudoElement:0}),Sx=ii(yx),Mx=K({},ea,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),Ex=ii(Mx),wx=K({},ea,{data:0}),dp=ii(wx),bx={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Tx={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Ax={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Cx(n){var r=this.nativeEvent;return r.getModifierState?r.getModifierState(n):(n=Ax[n])?!!r[n]:!1}function Cu(){return Cx}var Rx=K({},ho,{key:function(n){if(n.key){var r=bx[n.key]||n.key;if(r!=="Unidentified")return r}return n.type==="keypress"?(n=yl(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?Tx[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Cu,charCode:function(n){return n.type==="keypress"?yl(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?yl(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),Px=ii(Rx),Nx=K({},Ml,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),hp=ii(Nx),Lx=K({},ho,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Cu}),Dx=ii(Lx),Ix=K({},ea,{propertyName:0,elapsedTime:0,pseudoElement:0}),Ux=ii(Ix),Fx=K({},Ml,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),Ox=ii(Fx),kx=[9,13,27,32],Ru=d&&"CompositionEvent"in window,po=null;d&&"documentMode"in document&&(po=document.documentMode);var Bx=d&&"TextEvent"in window&&!po,fp=d&&(!Ru||po&&8<po&&11>=po),pp=" ",mp=!1;function gp(n,r){switch(n){case"keyup":return kx.indexOf(r.keyCode)!==-1;case"keydown":return r.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function _p(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var ta=!1;function zx(n,r){switch(n){case"compositionend":return _p(r);case"keypress":return r.which!==32?null:(mp=!0,pp);case"textInput":return n=r.data,n===pp&&mp?null:n;default:return null}}function Hx(n,r){if(ta)return n==="compositionend"||!Ru&&gp(n,r)?(n=lp(),vl=Eu=Or=null,ta=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(r.ctrlKey||r.altKey||r.metaKey)||r.ctrlKey&&r.altKey){if(r.char&&1<r.char.length)return r.char;if(r.which)return String.fromCharCode(r.which)}return null;case"compositionend":return fp&&r.locale!=="ko"?null:r.data;default:return null}}var Vx={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function xp(n){var r=n&&n.nodeName&&n.nodeName.toLowerCase();return r==="input"?!!Vx[n.type]:r==="textarea"}function vp(n,r,o,u){ge(u),r=Al(r,"onChange"),0<r.length&&(o=new wu("onChange","change",null,o,u),n.push({event:o,listeners:r}))}var mo=null,go=null;function Gx(n){Op(n,0)}function El(n){var r=aa(n);if(dt(r))return n}function Wx(n,r){if(n==="change")return r}var yp=!1;if(d){var Pu;if(d){var Nu="oninput"in document;if(!Nu){var Sp=document.createElement("div");Sp.setAttribute("oninput","return;"),Nu=typeof Sp.oninput=="function"}Pu=Nu}else Pu=!1;yp=Pu&&(!document.documentMode||9<document.documentMode)}function Mp(){mo&&(mo.detachEvent("onpropertychange",Ep),go=mo=null)}function Ep(n){if(n.propertyName==="value"&&El(go)){var r=[];vp(r,go,n,Ze(n)),qe(Gx,r)}}function jx(n,r,o){n==="focusin"?(Mp(),mo=r,go=o,mo.attachEvent("onpropertychange",Ep)):n==="focusout"&&Mp()}function Xx(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return El(go)}function qx(n,r){if(n==="click")return El(r)}function Yx(n,r){if(n==="input"||n==="change")return El(r)}function $x(n,r){return n===r&&(n!==0||1/n===1/r)||n!==n&&r!==r}var Ci=typeof Object.is=="function"?Object.is:$x;function _o(n,r){if(Ci(n,r))return!0;if(typeof n!="object"||n===null||typeof r!="object"||r===null)return!1;var o=Object.keys(n),u=Object.keys(r);if(o.length!==u.length)return!1;for(u=0;u<o.length;u++){var p=o[u];if(!h.call(r,p)||!Ci(n[p],r[p]))return!1}return!0}function wp(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function bp(n,r){var o=wp(n);n=0;for(var u;o;){if(o.nodeType===3){if(u=n+o.textContent.length,n<=r&&u>=r)return{node:o,offset:r-n};n=u}e:{for(;o;){if(o.nextSibling){o=o.nextSibling;break e}o=o.parentNode}o=void 0}o=wp(o)}}function Tp(n,r){return n&&r?n===r?!0:n&&n.nodeType===3?!1:r&&r.nodeType===3?Tp(n,r.parentNode):"contains"in n?n.contains(r):n.compareDocumentPosition?!!(n.compareDocumentPosition(r)&16):!1:!1}function Ap(){for(var n=window,r=Gt();r instanceof n.HTMLIFrameElement;){try{var o=typeof r.contentWindow.location.href=="string"}catch{o=!1}if(o)n=r.contentWindow;else break;r=Gt(n.document)}return r}function Lu(n){var r=n&&n.nodeName&&n.nodeName.toLowerCase();return r&&(r==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||r==="textarea"||n.contentEditable==="true")}function Kx(n){var r=Ap(),o=n.focusedElem,u=n.selectionRange;if(r!==o&&o&&o.ownerDocument&&Tp(o.ownerDocument.documentElement,o)){if(u!==null&&Lu(o)){if(r=u.start,n=u.end,n===void 0&&(n=r),"selectionStart"in o)o.selectionStart=r,o.selectionEnd=Math.min(n,o.value.length);else if(n=(r=o.ownerDocument||document)&&r.defaultView||window,n.getSelection){n=n.getSelection();var p=o.textContent.length,v=Math.min(u.start,p);u=u.end===void 0?v:Math.min(u.end,p),!n.extend&&v>u&&(p=u,u=v,v=p),p=bp(o,v);var C=bp(o,u);p&&C&&(n.rangeCount!==1||n.anchorNode!==p.node||n.anchorOffset!==p.offset||n.focusNode!==C.node||n.focusOffset!==C.offset)&&(r=r.createRange(),r.setStart(p.node,p.offset),n.removeAllRanges(),v>u?(n.addRange(r),n.extend(C.node,C.offset)):(r.setEnd(C.node,C.offset),n.addRange(r)))}}for(r=[],n=o;n=n.parentNode;)n.nodeType===1&&r.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof o.focus=="function"&&o.focus(),o=0;o<r.length;o++)n=r[o],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var Zx=d&&"documentMode"in document&&11>=document.documentMode,na=null,Du=null,xo=null,Iu=!1;function Cp(n,r,o){var u=o.window===o?o.document:o.nodeType===9?o:o.ownerDocument;Iu||na==null||na!==Gt(u)||(u=na,"selectionStart"in u&&Lu(u)?u={start:u.selectionStart,end:u.selectionEnd}:(u=(u.ownerDocument&&u.ownerDocument.defaultView||window).getSelection(),u={anchorNode:u.anchorNode,anchorOffset:u.anchorOffset,focusNode:u.focusNode,focusOffset:u.focusOffset}),xo&&_o(xo,u)||(xo=u,u=Al(Du,"onSelect"),0<u.length&&(r=new wu("onSelect","select",null,r,o),n.push({event:r,listeners:u}),r.target=na)))}function wl(n,r){var o={};return o[n.toLowerCase()]=r.toLowerCase(),o["Webkit"+n]="webkit"+r,o["Moz"+n]="moz"+r,o}var ia={animationend:wl("Animation","AnimationEnd"),animationiteration:wl("Animation","AnimationIteration"),animationstart:wl("Animation","AnimationStart"),transitionend:wl("Transition","TransitionEnd")},Uu={},Rp={};d&&(Rp=document.createElement("div").style,"AnimationEvent"in window||(delete ia.animationend.animation,delete ia.animationiteration.animation,delete ia.animationstart.animation),"TransitionEvent"in window||delete ia.transitionend.transition);function bl(n){if(Uu[n])return Uu[n];if(!ia[n])return n;var r=ia[n],o;for(o in r)if(r.hasOwnProperty(o)&&o in Rp)return Uu[n]=r[o];return n}var Pp=bl("animationend"),Np=bl("animationiteration"),Lp=bl("animationstart"),Dp=bl("transitionend"),Ip=new Map,Up="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function kr(n,r){Ip.set(n,r),l(r,[n])}for(var Fu=0;Fu<Up.length;Fu++){var Ou=Up[Fu],Qx=Ou.toLowerCase(),Jx=Ou[0].toUpperCase()+Ou.slice(1);kr(Qx,"on"+Jx)}kr(Pp,"onAnimationEnd"),kr(Np,"onAnimationIteration"),kr(Lp,"onAnimationStart"),kr("dblclick","onDoubleClick"),kr("focusin","onFocus"),kr("focusout","onBlur"),kr(Dp,"onTransitionEnd"),c("onMouseEnter",["mouseout","mouseover"]),c("onMouseLeave",["mouseout","mouseover"]),c("onPointerEnter",["pointerout","pointerover"]),c("onPointerLeave",["pointerout","pointerover"]),l("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),l("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),l("onBeforeInput",["compositionend","keypress","textInput","paste"]),l("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var vo="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),ev=new Set("cancel close invalid load scroll toggle".split(" ").concat(vo));function Fp(n,r,o){var u=n.type||"unknown-event";n.currentTarget=o,fl(u,r,void 0,n),n.currentTarget=null}function Op(n,r){r=(r&4)!==0;for(var o=0;o<n.length;o++){var u=n[o],p=u.event;u=u.listeners;e:{var v=void 0;if(r)for(var C=u.length-1;0<=C;C--){var k=u[C],z=k.instance,ue=k.currentTarget;if(k=k.listener,z!==v&&p.isPropagationStopped())break e;Fp(p,k,ue),v=z}else for(C=0;C<u.length;C++){if(k=u[C],z=k.instance,ue=k.currentTarget,k=k.listener,z!==v&&p.isPropagationStopped())break e;Fp(p,k,ue),v=z}}}if(ms)throw n=gs,ms=!1,gs=null,n}function qt(n,r){var o=r[ju];o===void 0&&(o=r[ju]=new Set);var u=n+"__bubble";o.has(u)||(kp(r,n,2,!1),o.add(u))}function ku(n,r,o){var u=0;r&&(u|=4),kp(o,n,u,r)}var Tl="_reactListening"+Math.random().toString(36).slice(2);function yo(n){if(!n[Tl]){n[Tl]=!0,i.forEach(function(o){o!=="selectionchange"&&(ev.has(o)||ku(o,!1,n),ku(o,!0,n))});var r=n.nodeType===9?n:n.ownerDocument;r===null||r[Tl]||(r[Tl]=!0,ku("selectionchange",!1,r))}}function kp(n,r,o,u){switch(op(r)){case 1:var p=px;break;case 4:p=mx;break;default:p=Su}o=p.bind(null,r,o,n),p=void 0,!bt||r!=="touchstart"&&r!=="touchmove"&&r!=="wheel"||(p=!0),u?p!==void 0?n.addEventListener(r,o,{capture:!0,passive:p}):n.addEventListener(r,o,!0):p!==void 0?n.addEventListener(r,o,{passive:p}):n.addEventListener(r,o,!1)}function Bu(n,r,o,u,p){var v=u;if((r&1)===0&&(r&2)===0&&u!==null)e:for(;;){if(u===null)return;var C=u.tag;if(C===3||C===4){var k=u.stateNode.containerInfo;if(k===p||k.nodeType===8&&k.parentNode===p)break;if(C===4)for(C=u.return;C!==null;){var z=C.tag;if((z===3||z===4)&&(z=C.stateNode.containerInfo,z===p||z.nodeType===8&&z.parentNode===p))return;C=C.return}for(;k!==null;){if(C=vs(k),C===null)return;if(z=C.tag,z===5||z===6){u=v=C;continue e}k=k.parentNode}}u=u.return}qe(function(){var ue=v,ye=Ze(o),Me=[];e:{var ve=Ip.get(n);if(ve!==void 0){var ze=wu,Xe=n;switch(n){case"keypress":if(yl(o)===0)break e;case"keydown":case"keyup":ze=Px;break;case"focusin":Xe="focus",ze=Au;break;case"focusout":Xe="blur",ze=Au;break;case"beforeblur":case"afterblur":ze=Au;break;case"click":if(o.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":ze=up;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":ze=xx;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":ze=Dx;break;case Pp:case Np:case Lp:ze=Sx;break;case Dp:ze=Ux;break;case"scroll":ze=gx;break;case"wheel":ze=Ox;break;case"copy":case"cut":case"paste":ze=Ex;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":ze=hp}var Ye=(r&4)!==0,cn=!Ye&&n==="scroll",re=Ye?ve!==null?ve+"Capture":null:ve;Ye=[];for(var q=ue,oe;q!==null;){oe=q;var be=oe.stateNode;if(oe.tag===5&&be!==null&&(oe=be,re!==null&&(be=Pt(q,re),be!=null&&Ye.push(So(q,be,oe)))),cn)break;q=q.return}0<Ye.length&&(ve=new ze(ve,Xe,null,o,ye),Me.push({event:ve,listeners:Ye}))}}if((r&7)===0){e:{if(ve=n==="mouseover"||n==="pointerover",ze=n==="mouseout"||n==="pointerout",ve&&o!==Te&&(Xe=o.relatedTarget||o.fromElement)&&(vs(Xe)||Xe[dr]))break e;if((ze||ve)&&(ve=ye.window===ye?ye:(ve=ye.ownerDocument)?ve.defaultView||ve.parentWindow:window,ze?(Xe=o.relatedTarget||o.toElement,ze=ue,Xe=Xe?vs(Xe):null,Xe!==null&&(cn=zn(Xe),Xe!==cn||Xe.tag!==5&&Xe.tag!==6)&&(Xe=null)):(ze=null,Xe=ue),ze!==Xe)){if(Ye=up,be="onMouseLeave",re="onMouseEnter",q="mouse",(n==="pointerout"||n==="pointerover")&&(Ye=hp,be="onPointerLeave",re="onPointerEnter",q="pointer"),cn=ze==null?ve:aa(ze),oe=Xe==null?ve:aa(Xe),ve=new Ye(be,q+"leave",ze,o,ye),ve.target=cn,ve.relatedTarget=oe,be=null,vs(ye)===ue&&(Ye=new Ye(re,q+"enter",Xe,o,ye),Ye.target=oe,Ye.relatedTarget=cn,be=Ye),cn=be,ze&&Xe)t:{for(Ye=ze,re=Xe,q=0,oe=Ye;oe;oe=ra(oe))q++;for(oe=0,be=re;be;be=ra(be))oe++;for(;0<q-oe;)Ye=ra(Ye),q--;for(;0<oe-q;)re=ra(re),oe--;for(;q--;){if(Ye===re||re!==null&&Ye===re.alternate)break t;Ye=ra(Ye),re=ra(re)}Ye=null}else Ye=null;ze!==null&&Bp(Me,ve,ze,Ye,!1),Xe!==null&&cn!==null&&Bp(Me,cn,Xe,Ye,!0)}}e:{if(ve=ue?aa(ue):window,ze=ve.nodeName&&ve.nodeName.toLowerCase(),ze==="select"||ze==="input"&&ve.type==="file")var et=Wx;else if(xp(ve))if(yp)et=Yx;else{et=Xx;var nt=jx}else(ze=ve.nodeName)&&ze.toLowerCase()==="input"&&(ve.type==="checkbox"||ve.type==="radio")&&(et=qx);if(et&&(et=et(n,ue))){vp(Me,et,o,ye);break e}nt&&nt(n,ve,ue),n==="focusout"&&(nt=ve._wrapperState)&&nt.controlled&&ve.type==="number"&&Xt(ve,"number",ve.value)}switch(nt=ue?aa(ue):window,n){case"focusin":(xp(nt)||nt.contentEditable==="true")&&(na=nt,Du=ue,xo=null);break;case"focusout":xo=Du=na=null;break;case"mousedown":Iu=!0;break;case"contextmenu":case"mouseup":case"dragend":Iu=!1,Cp(Me,o,ye);break;case"selectionchange":if(Zx)break;case"keydown":case"keyup":Cp(Me,o,ye)}var it;if(Ru)e:{switch(n){case"compositionstart":var lt="onCompositionStart";break e;case"compositionend":lt="onCompositionEnd";break e;case"compositionupdate":lt="onCompositionUpdate";break e}lt=void 0}else ta?gp(n,o)&&(lt="onCompositionEnd"):n==="keydown"&&o.keyCode===229&&(lt="onCompositionStart");lt&&(fp&&o.locale!=="ko"&&(ta||lt!=="onCompositionStart"?lt==="onCompositionEnd"&&ta&&(it=lp()):(Or=ye,Eu="value"in Or?Or.value:Or.textContent,ta=!0)),nt=Al(ue,lt),0<nt.length&&(lt=new dp(lt,n,null,o,ye),Me.push({event:lt,listeners:nt}),it?lt.data=it:(it=_p(o),it!==null&&(lt.data=it)))),(it=Bx?zx(n,o):Hx(n,o))&&(ue=Al(ue,"onBeforeInput"),0<ue.length&&(ye=new dp("onBeforeInput","beforeinput",null,o,ye),Me.push({event:ye,listeners:ue}),ye.data=it))}Op(Me,r)})}function So(n,r,o){return{instance:n,listener:r,currentTarget:o}}function Al(n,r){for(var o=r+"Capture",u=[];n!==null;){var p=n,v=p.stateNode;p.tag===5&&v!==null&&(p=v,v=Pt(n,o),v!=null&&u.unshift(So(n,v,p)),v=Pt(n,r),v!=null&&u.push(So(n,v,p))),n=n.return}return u}function ra(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function Bp(n,r,o,u,p){for(var v=r._reactName,C=[];o!==null&&o!==u;){var k=o,z=k.alternate,ue=k.stateNode;if(z!==null&&z===u)break;k.tag===5&&ue!==null&&(k=ue,p?(z=Pt(o,v),z!=null&&C.unshift(So(o,z,k))):p||(z=Pt(o,v),z!=null&&C.push(So(o,z,k)))),o=o.return}C.length!==0&&n.push({event:r,listeners:C})}var tv=/\r\n?/g,nv=/\u0000|\uFFFD/g;function zp(n){return(typeof n=="string"?n:""+n).replace(tv,`
`).replace(nv,"")}function Cl(n,r,o){if(r=zp(r),zp(n)!==r&&o)throw Error(t(425))}function Rl(){}var zu=null,Hu=null;function Vu(n,r){return n==="textarea"||n==="noscript"||typeof r.children=="string"||typeof r.children=="number"||typeof r.dangerouslySetInnerHTML=="object"&&r.dangerouslySetInnerHTML!==null&&r.dangerouslySetInnerHTML.__html!=null}var Gu=typeof setTimeout=="function"?setTimeout:void 0,iv=typeof clearTimeout=="function"?clearTimeout:void 0,Hp=typeof Promise=="function"?Promise:void 0,rv=typeof queueMicrotask=="function"?queueMicrotask:typeof Hp<"u"?function(n){return Hp.resolve(null).then(n).catch(sv)}:Gu;function sv(n){setTimeout(function(){throw n})}function Wu(n,r){var o=r,u=0;do{var p=o.nextSibling;if(n.removeChild(o),p&&p.nodeType===8)if(o=p.data,o==="/$"){if(u===0){n.removeChild(p),uo(r);return}u--}else o!=="$"&&o!=="$?"&&o!=="$!"||u++;o=p}while(o);uo(r)}function Br(n){for(;n!=null;n=n.nextSibling){var r=n.nodeType;if(r===1||r===3)break;if(r===8){if(r=n.data,r==="$"||r==="$!"||r==="$?")break;if(r==="/$")return null}}return n}function Vp(n){n=n.previousSibling;for(var r=0;n;){if(n.nodeType===8){var o=n.data;if(o==="$"||o==="$!"||o==="$?"){if(r===0)return n;r--}else o==="/$"&&r++}n=n.previousSibling}return null}var sa=Math.random().toString(36).slice(2),Wi="__reactFiber$"+sa,Mo="__reactProps$"+sa,dr="__reactContainer$"+sa,ju="__reactEvents$"+sa,av="__reactListeners$"+sa,ov="__reactHandles$"+sa;function vs(n){var r=n[Wi];if(r)return r;for(var o=n.parentNode;o;){if(r=o[dr]||o[Wi]){if(o=r.alternate,r.child!==null||o!==null&&o.child!==null)for(n=Vp(n);n!==null;){if(o=n[Wi])return o;n=Vp(n)}return r}n=o,o=n.parentNode}return null}function Eo(n){return n=n[Wi]||n[dr],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function aa(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(t(33))}function Pl(n){return n[Mo]||null}var Xu=[],oa=-1;function zr(n){return{current:n}}function Yt(n){0>oa||(n.current=Xu[oa],Xu[oa]=null,oa--)}function jt(n,r){oa++,Xu[oa]=n.current,n.current=r}var Hr={},Nn=zr(Hr),qn=zr(!1),ys=Hr;function la(n,r){var o=n.type.contextTypes;if(!o)return Hr;var u=n.stateNode;if(u&&u.__reactInternalMemoizedUnmaskedChildContext===r)return u.__reactInternalMemoizedMaskedChildContext;var p={},v;for(v in o)p[v]=r[v];return u&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=r,n.__reactInternalMemoizedMaskedChildContext=p),p}function Yn(n){return n=n.childContextTypes,n!=null}function Nl(){Yt(qn),Yt(Nn)}function Gp(n,r,o){if(Nn.current!==Hr)throw Error(t(168));jt(Nn,r),jt(qn,o)}function Wp(n,r,o){var u=n.stateNode;if(r=r.childContextTypes,typeof u.getChildContext!="function")return o;u=u.getChildContext();for(var p in u)if(!(p in r))throw Error(t(108,ae(n)||"Unknown",p));return K({},o,u)}function Ll(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||Hr,ys=Nn.current,jt(Nn,n),jt(qn,qn.current),!0}function jp(n,r,o){var u=n.stateNode;if(!u)throw Error(t(169));o?(n=Wp(n,r,ys),u.__reactInternalMemoizedMergedChildContext=n,Yt(qn),Yt(Nn),jt(Nn,n)):Yt(qn),jt(qn,o)}var hr=null,Dl=!1,qu=!1;function Xp(n){hr===null?hr=[n]:hr.push(n)}function lv(n){Dl=!0,Xp(n)}function Vr(){if(!qu&&hr!==null){qu=!0;var n=0,r=gt;try{var o=hr;for(gt=1;n<o.length;n++){var u=o[n];do u=u(!0);while(u!==null)}hr=null,Dl=!1}catch(p){throw hr!==null&&(hr=hr.slice(n+1)),xs(ro,Vr),p}finally{gt=r,qu=!1}}return null}var ca=[],ua=0,Il=null,Ul=0,pi=[],mi=0,Ss=null,fr=1,pr="";function Ms(n,r){ca[ua++]=Ul,ca[ua++]=Il,Il=n,Ul=r}function qp(n,r,o){pi[mi++]=fr,pi[mi++]=pr,pi[mi++]=Ss,Ss=n;var u=fr;n=pr;var p=32-Le(u)-1;u&=~(1<<p),o+=1;var v=32-Le(r)+p;if(30<v){var C=p-p%5;v=(u&(1<<C)-1).toString(32),u>>=C,p-=C,fr=1<<32-Le(r)+p|o<<p|u,pr=v+n}else fr=1<<v|o<<p|u,pr=n}function Yu(n){n.return!==null&&(Ms(n,1),qp(n,1,0))}function $u(n){for(;n===Il;)Il=ca[--ua],ca[ua]=null,Ul=ca[--ua],ca[ua]=null;for(;n===Ss;)Ss=pi[--mi],pi[mi]=null,pr=pi[--mi],pi[mi]=null,fr=pi[--mi],pi[mi]=null}var ri=null,si=null,Zt=!1,Ri=null;function Yp(n,r){var o=vi(5,null,null,0);o.elementType="DELETED",o.stateNode=r,o.return=n,r=n.deletions,r===null?(n.deletions=[o],n.flags|=16):r.push(o)}function $p(n,r){switch(n.tag){case 5:var o=n.type;return r=r.nodeType!==1||o.toLowerCase()!==r.nodeName.toLowerCase()?null:r,r!==null?(n.stateNode=r,ri=n,si=Br(r.firstChild),!0):!1;case 6:return r=n.pendingProps===""||r.nodeType!==3?null:r,r!==null?(n.stateNode=r,ri=n,si=null,!0):!1;case 13:return r=r.nodeType!==8?null:r,r!==null?(o=Ss!==null?{id:fr,overflow:pr}:null,n.memoizedState={dehydrated:r,treeContext:o,retryLane:1073741824},o=vi(18,null,null,0),o.stateNode=r,o.return=n,n.child=o,ri=n,si=null,!0):!1;default:return!1}}function Ku(n){return(n.mode&1)!==0&&(n.flags&128)===0}function Zu(n){if(Zt){var r=si;if(r){var o=r;if(!$p(n,r)){if(Ku(n))throw Error(t(418));r=Br(o.nextSibling);var u=ri;r&&$p(n,r)?Yp(u,o):(n.flags=n.flags&-4097|2,Zt=!1,ri=n)}}else{if(Ku(n))throw Error(t(418));n.flags=n.flags&-4097|2,Zt=!1,ri=n}}}function Kp(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;ri=n}function Fl(n){if(n!==ri)return!1;if(!Zt)return Kp(n),Zt=!0,!1;var r;if((r=n.tag!==3)&&!(r=n.tag!==5)&&(r=n.type,r=r!=="head"&&r!=="body"&&!Vu(n.type,n.memoizedProps)),r&&(r=si)){if(Ku(n))throw Zp(),Error(t(418));for(;r;)Yp(n,r),r=Br(r.nextSibling)}if(Kp(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(t(317));e:{for(n=n.nextSibling,r=0;n;){if(n.nodeType===8){var o=n.data;if(o==="/$"){if(r===0){si=Br(n.nextSibling);break e}r--}else o!=="$"&&o!=="$!"&&o!=="$?"||r++}n=n.nextSibling}si=null}}else si=ri?Br(n.stateNode.nextSibling):null;return!0}function Zp(){for(var n=si;n;)n=Br(n.nextSibling)}function da(){si=ri=null,Zt=!1}function Qu(n){Ri===null?Ri=[n]:Ri.push(n)}var cv=A.ReactCurrentBatchConfig;function wo(n,r,o){if(n=o.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(o._owner){if(o=o._owner,o){if(o.tag!==1)throw Error(t(309));var u=o.stateNode}if(!u)throw Error(t(147,n));var p=u,v=""+n;return r!==null&&r.ref!==null&&typeof r.ref=="function"&&r.ref._stringRef===v?r.ref:(r=function(C){var k=p.refs;C===null?delete k[v]:k[v]=C},r._stringRef=v,r)}if(typeof n!="string")throw Error(t(284));if(!o._owner)throw Error(t(290,n))}return n}function Ol(n,r){throw n=Object.prototype.toString.call(r),Error(t(31,n==="[object Object]"?"object with keys {"+Object.keys(r).join(", ")+"}":n))}function Qp(n){var r=n._init;return r(n._payload)}function Jp(n){function r(re,q){if(n){var oe=re.deletions;oe===null?(re.deletions=[q],re.flags|=16):oe.push(q)}}function o(re,q){if(!n)return null;for(;q!==null;)r(re,q),q=q.sibling;return null}function u(re,q){for(re=new Map;q!==null;)q.key!==null?re.set(q.key,q):re.set(q.index,q),q=q.sibling;return re}function p(re,q){return re=Kr(re,q),re.index=0,re.sibling=null,re}function v(re,q,oe){return re.index=oe,n?(oe=re.alternate,oe!==null?(oe=oe.index,oe<q?(re.flags|=2,q):oe):(re.flags|=2,q)):(re.flags|=1048576,q)}function C(re){return n&&re.alternate===null&&(re.flags|=2),re}function k(re,q,oe,be){return q===null||q.tag!==6?(q=Gd(oe,re.mode,be),q.return=re,q):(q=p(q,oe),q.return=re,q)}function z(re,q,oe,be){var et=oe.type;return et===U?ye(re,q,oe.props.children,be,oe.key):q!==null&&(q.elementType===et||typeof et=="object"&&et!==null&&et.$$typeof===he&&Qp(et)===q.type)?(be=p(q,oe.props),be.ref=wo(re,q,oe),be.return=re,be):(be=oc(oe.type,oe.key,oe.props,null,re.mode,be),be.ref=wo(re,q,oe),be.return=re,be)}function ue(re,q,oe,be){return q===null||q.tag!==4||q.stateNode.containerInfo!==oe.containerInfo||q.stateNode.implementation!==oe.implementation?(q=Wd(oe,re.mode,be),q.return=re,q):(q=p(q,oe.children||[]),q.return=re,q)}function ye(re,q,oe,be,et){return q===null||q.tag!==7?(q=Ps(oe,re.mode,be,et),q.return=re,q):(q=p(q,oe),q.return=re,q)}function Me(re,q,oe){if(typeof q=="string"&&q!==""||typeof q=="number")return q=Gd(""+q,re.mode,oe),q.return=re,q;if(typeof q=="object"&&q!==null){switch(q.$$typeof){case P:return oe=oc(q.type,q.key,q.props,null,re.mode,oe),oe.ref=wo(re,null,q),oe.return=re,oe;case L:return q=Wd(q,re.mode,oe),q.return=re,q;case he:var be=q._init;return Me(re,be(q._payload),oe)}if(Ft(q)||$(q))return q=Ps(q,re.mode,oe,null),q.return=re,q;Ol(re,q)}return null}function ve(re,q,oe,be){var et=q!==null?q.key:null;if(typeof oe=="string"&&oe!==""||typeof oe=="number")return et!==null?null:k(re,q,""+oe,be);if(typeof oe=="object"&&oe!==null){switch(oe.$$typeof){case P:return oe.key===et?z(re,q,oe,be):null;case L:return oe.key===et?ue(re,q,oe,be):null;case he:return et=oe._init,ve(re,q,et(oe._payload),be)}if(Ft(oe)||$(oe))return et!==null?null:ye(re,q,oe,be,null);Ol(re,oe)}return null}function ze(re,q,oe,be,et){if(typeof be=="string"&&be!==""||typeof be=="number")return re=re.get(oe)||null,k(q,re,""+be,et);if(typeof be=="object"&&be!==null){switch(be.$$typeof){case P:return re=re.get(be.key===null?oe:be.key)||null,z(q,re,be,et);case L:return re=re.get(be.key===null?oe:be.key)||null,ue(q,re,be,et);case he:var nt=be._init;return ze(re,q,oe,nt(be._payload),et)}if(Ft(be)||$(be))return re=re.get(oe)||null,ye(q,re,be,et,null);Ol(q,be)}return null}function Xe(re,q,oe,be){for(var et=null,nt=null,it=q,lt=q=0,wn=null;it!==null&&lt<oe.length;lt++){it.index>lt?(wn=it,it=null):wn=it.sibling;var Lt=ve(re,it,oe[lt],be);if(Lt===null){it===null&&(it=wn);break}n&&it&&Lt.alternate===null&&r(re,it),q=v(Lt,q,lt),nt===null?et=Lt:nt.sibling=Lt,nt=Lt,it=wn}if(lt===oe.length)return o(re,it),Zt&&Ms(re,lt),et;if(it===null){for(;lt<oe.length;lt++)it=Me(re,oe[lt],be),it!==null&&(q=v(it,q,lt),nt===null?et=it:nt.sibling=it,nt=it);return Zt&&Ms(re,lt),et}for(it=u(re,it);lt<oe.length;lt++)wn=ze(it,re,lt,oe[lt],be),wn!==null&&(n&&wn.alternate!==null&&it.delete(wn.key===null?lt:wn.key),q=v(wn,q,lt),nt===null?et=wn:nt.sibling=wn,nt=wn);return n&&it.forEach(function(Zr){return r(re,Zr)}),Zt&&Ms(re,lt),et}function Ye(re,q,oe,be){var et=$(oe);if(typeof et!="function")throw Error(t(150));if(oe=et.call(oe),oe==null)throw Error(t(151));for(var nt=et=null,it=q,lt=q=0,wn=null,Lt=oe.next();it!==null&&!Lt.done;lt++,Lt=oe.next()){it.index>lt?(wn=it,it=null):wn=it.sibling;var Zr=ve(re,it,Lt.value,be);if(Zr===null){it===null&&(it=wn);break}n&&it&&Zr.alternate===null&&r(re,it),q=v(Zr,q,lt),nt===null?et=Zr:nt.sibling=Zr,nt=Zr,it=wn}if(Lt.done)return o(re,it),Zt&&Ms(re,lt),et;if(it===null){for(;!Lt.done;lt++,Lt=oe.next())Lt=Me(re,Lt.value,be),Lt!==null&&(q=v(Lt,q,lt),nt===null?et=Lt:nt.sibling=Lt,nt=Lt);return Zt&&Ms(re,lt),et}for(it=u(re,it);!Lt.done;lt++,Lt=oe.next())Lt=ze(it,re,lt,Lt.value,be),Lt!==null&&(n&&Lt.alternate!==null&&it.delete(Lt.key===null?lt:Lt.key),q=v(Lt,q,lt),nt===null?et=Lt:nt.sibling=Lt,nt=Lt);return n&&it.forEach(function(Vv){return r(re,Vv)}),Zt&&Ms(re,lt),et}function cn(re,q,oe,be){if(typeof oe=="object"&&oe!==null&&oe.type===U&&oe.key===null&&(oe=oe.props.children),typeof oe=="object"&&oe!==null){switch(oe.$$typeof){case P:e:{for(var et=oe.key,nt=q;nt!==null;){if(nt.key===et){if(et=oe.type,et===U){if(nt.tag===7){o(re,nt.sibling),q=p(nt,oe.props.children),q.return=re,re=q;break e}}else if(nt.elementType===et||typeof et=="object"&&et!==null&&et.$$typeof===he&&Qp(et)===nt.type){o(re,nt.sibling),q=p(nt,oe.props),q.ref=wo(re,nt,oe),q.return=re,re=q;break e}o(re,nt);break}else r(re,nt);nt=nt.sibling}oe.type===U?(q=Ps(oe.props.children,re.mode,be,oe.key),q.return=re,re=q):(be=oc(oe.type,oe.key,oe.props,null,re.mode,be),be.ref=wo(re,q,oe),be.return=re,re=be)}return C(re);case L:e:{for(nt=oe.key;q!==null;){if(q.key===nt)if(q.tag===4&&q.stateNode.containerInfo===oe.containerInfo&&q.stateNode.implementation===oe.implementation){o(re,q.sibling),q=p(q,oe.children||[]),q.return=re,re=q;break e}else{o(re,q);break}else r(re,q);q=q.sibling}q=Wd(oe,re.mode,be),q.return=re,re=q}return C(re);case he:return nt=oe._init,cn(re,q,nt(oe._payload),be)}if(Ft(oe))return Xe(re,q,oe,be);if($(oe))return Ye(re,q,oe,be);Ol(re,oe)}return typeof oe=="string"&&oe!==""||typeof oe=="number"?(oe=""+oe,q!==null&&q.tag===6?(o(re,q.sibling),q=p(q,oe),q.return=re,re=q):(o(re,q),q=Gd(oe,re.mode,be),q.return=re,re=q),C(re)):o(re,q)}return cn}var ha=Jp(!0),em=Jp(!1),kl=zr(null),Bl=null,fa=null,Ju=null;function ed(){Ju=fa=Bl=null}function td(n){var r=kl.current;Yt(kl),n._currentValue=r}function nd(n,r,o){for(;n!==null;){var u=n.alternate;if((n.childLanes&r)!==r?(n.childLanes|=r,u!==null&&(u.childLanes|=r)):u!==null&&(u.childLanes&r)!==r&&(u.childLanes|=r),n===o)break;n=n.return}}function pa(n,r){Bl=n,Ju=fa=null,n=n.dependencies,n!==null&&n.firstContext!==null&&((n.lanes&r)!==0&&($n=!0),n.firstContext=null)}function gi(n){var r=n._currentValue;if(Ju!==n)if(n={context:n,memoizedValue:r,next:null},fa===null){if(Bl===null)throw Error(t(308));fa=n,Bl.dependencies={lanes:0,firstContext:n}}else fa=fa.next=n;return r}var Es=null;function id(n){Es===null?Es=[n]:Es.push(n)}function tm(n,r,o,u){var p=r.interleaved;return p===null?(o.next=o,id(r)):(o.next=p.next,p.next=o),r.interleaved=o,mr(n,u)}function mr(n,r){n.lanes|=r;var o=n.alternate;for(o!==null&&(o.lanes|=r),o=n,n=n.return;n!==null;)n.childLanes|=r,o=n.alternate,o!==null&&(o.childLanes|=r),o=n,n=n.return;return o.tag===3?o.stateNode:null}var Gr=!1;function rd(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function nm(n,r){n=n.updateQueue,r.updateQueue===n&&(r.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function gr(n,r){return{eventTime:n,lane:r,tag:0,payload:null,callback:null,next:null}}function Wr(n,r,o){var u=n.updateQueue;if(u===null)return null;if(u=u.shared,(Tt&2)!==0){var p=u.pending;return p===null?r.next=r:(r.next=p.next,p.next=r),u.pending=r,mr(n,o)}return p=u.interleaved,p===null?(r.next=r,id(u)):(r.next=p.next,p.next=r),u.interleaved=r,mr(n,o)}function zl(n,r,o){if(r=r.updateQueue,r!==null&&(r=r.shared,(o&4194240)!==0)){var u=r.lanes;u&=n.pendingLanes,o|=u,r.lanes=o,Pn(n,o)}}function im(n,r){var o=n.updateQueue,u=n.alternate;if(u!==null&&(u=u.updateQueue,o===u)){var p=null,v=null;if(o=o.firstBaseUpdate,o!==null){do{var C={eventTime:o.eventTime,lane:o.lane,tag:o.tag,payload:o.payload,callback:o.callback,next:null};v===null?p=v=C:v=v.next=C,o=o.next}while(o!==null);v===null?p=v=r:v=v.next=r}else p=v=r;o={baseState:u.baseState,firstBaseUpdate:p,lastBaseUpdate:v,shared:u.shared,effects:u.effects},n.updateQueue=o;return}n=o.lastBaseUpdate,n===null?o.firstBaseUpdate=r:n.next=r,o.lastBaseUpdate=r}function Hl(n,r,o,u){var p=n.updateQueue;Gr=!1;var v=p.firstBaseUpdate,C=p.lastBaseUpdate,k=p.shared.pending;if(k!==null){p.shared.pending=null;var z=k,ue=z.next;z.next=null,C===null?v=ue:C.next=ue,C=z;var ye=n.alternate;ye!==null&&(ye=ye.updateQueue,k=ye.lastBaseUpdate,k!==C&&(k===null?ye.firstBaseUpdate=ue:k.next=ue,ye.lastBaseUpdate=z))}if(v!==null){var Me=p.baseState;C=0,ye=ue=z=null,k=v;do{var ve=k.lane,ze=k.eventTime;if((u&ve)===ve){ye!==null&&(ye=ye.next={eventTime:ze,lane:0,tag:k.tag,payload:k.payload,callback:k.callback,next:null});e:{var Xe=n,Ye=k;switch(ve=r,ze=o,Ye.tag){case 1:if(Xe=Ye.payload,typeof Xe=="function"){Me=Xe.call(ze,Me,ve);break e}Me=Xe;break e;case 3:Xe.flags=Xe.flags&-65537|128;case 0:if(Xe=Ye.payload,ve=typeof Xe=="function"?Xe.call(ze,Me,ve):Xe,ve==null)break e;Me=K({},Me,ve);break e;case 2:Gr=!0}}k.callback!==null&&k.lane!==0&&(n.flags|=64,ve=p.effects,ve===null?p.effects=[k]:ve.push(k))}else ze={eventTime:ze,lane:ve,tag:k.tag,payload:k.payload,callback:k.callback,next:null},ye===null?(ue=ye=ze,z=Me):ye=ye.next=ze,C|=ve;if(k=k.next,k===null){if(k=p.shared.pending,k===null)break;ve=k,k=ve.next,ve.next=null,p.lastBaseUpdate=ve,p.shared.pending=null}}while(!0);if(ye===null&&(z=Me),p.baseState=z,p.firstBaseUpdate=ue,p.lastBaseUpdate=ye,r=p.shared.interleaved,r!==null){p=r;do C|=p.lane,p=p.next;while(p!==r)}else v===null&&(p.shared.lanes=0);Ts|=C,n.lanes=C,n.memoizedState=Me}}function rm(n,r,o){if(n=r.effects,r.effects=null,n!==null)for(r=0;r<n.length;r++){var u=n[r],p=u.callback;if(p!==null){if(u.callback=null,u=o,typeof p!="function")throw Error(t(191,p));p.call(u)}}}var bo={},ji=zr(bo),To=zr(bo),Ao=zr(bo);function ws(n){if(n===bo)throw Error(t(174));return n}function sd(n,r){switch(jt(Ao,r),jt(To,n),jt(ji,bo),n=r.nodeType,n){case 9:case 11:r=(r=r.documentElement)?r.namespaceURI:w(null,"");break;default:n=n===8?r.parentNode:r,r=n.namespaceURI||null,n=n.tagName,r=w(r,n)}Yt(ji),jt(ji,r)}function ma(){Yt(ji),Yt(To),Yt(Ao)}function sm(n){ws(Ao.current);var r=ws(ji.current),o=w(r,n.type);r!==o&&(jt(To,n),jt(ji,o))}function ad(n){To.current===n&&(Yt(ji),Yt(To))}var Jt=zr(0);function Vl(n){for(var r=n;r!==null;){if(r.tag===13){var o=r.memoizedState;if(o!==null&&(o=o.dehydrated,o===null||o.data==="$?"||o.data==="$!"))return r}else if(r.tag===19&&r.memoizedProps.revealOrder!==void 0){if((r.flags&128)!==0)return r}else if(r.child!==null){r.child.return=r,r=r.child;continue}if(r===n)break;for(;r.sibling===null;){if(r.return===null||r.return===n)return null;r=r.return}r.sibling.return=r.return,r=r.sibling}return null}var od=[];function ld(){for(var n=0;n<od.length;n++)od[n]._workInProgressVersionPrimary=null;od.length=0}var Gl=A.ReactCurrentDispatcher,cd=A.ReactCurrentBatchConfig,bs=0,en=null,mn=null,Mn=null,Wl=!1,Co=!1,Ro=0,uv=0;function Ln(){throw Error(t(321))}function ud(n,r){if(r===null)return!1;for(var o=0;o<r.length&&o<n.length;o++)if(!Ci(n[o],r[o]))return!1;return!0}function dd(n,r,o,u,p,v){if(bs=v,en=r,r.memoizedState=null,r.updateQueue=null,r.lanes=0,Gl.current=n===null||n.memoizedState===null?pv:mv,n=o(u,p),Co){v=0;do{if(Co=!1,Ro=0,25<=v)throw Error(t(301));v+=1,Mn=mn=null,r.updateQueue=null,Gl.current=gv,n=o(u,p)}while(Co)}if(Gl.current=ql,r=mn!==null&&mn.next!==null,bs=0,Mn=mn=en=null,Wl=!1,r)throw Error(t(300));return n}function hd(){var n=Ro!==0;return Ro=0,n}function Xi(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Mn===null?en.memoizedState=Mn=n:Mn=Mn.next=n,Mn}function _i(){if(mn===null){var n=en.alternate;n=n!==null?n.memoizedState:null}else n=mn.next;var r=Mn===null?en.memoizedState:Mn.next;if(r!==null)Mn=r,mn=n;else{if(n===null)throw Error(t(310));mn=n,n={memoizedState:mn.memoizedState,baseState:mn.baseState,baseQueue:mn.baseQueue,queue:mn.queue,next:null},Mn===null?en.memoizedState=Mn=n:Mn=Mn.next=n}return Mn}function Po(n,r){return typeof r=="function"?r(n):r}function fd(n){var r=_i(),o=r.queue;if(o===null)throw Error(t(311));o.lastRenderedReducer=n;var u=mn,p=u.baseQueue,v=o.pending;if(v!==null){if(p!==null){var C=p.next;p.next=v.next,v.next=C}u.baseQueue=p=v,o.pending=null}if(p!==null){v=p.next,u=u.baseState;var k=C=null,z=null,ue=v;do{var ye=ue.lane;if((bs&ye)===ye)z!==null&&(z=z.next={lane:0,action:ue.action,hasEagerState:ue.hasEagerState,eagerState:ue.eagerState,next:null}),u=ue.hasEagerState?ue.eagerState:n(u,ue.action);else{var Me={lane:ye,action:ue.action,hasEagerState:ue.hasEagerState,eagerState:ue.eagerState,next:null};z===null?(k=z=Me,C=u):z=z.next=Me,en.lanes|=ye,Ts|=ye}ue=ue.next}while(ue!==null&&ue!==v);z===null?C=u:z.next=k,Ci(u,r.memoizedState)||($n=!0),r.memoizedState=u,r.baseState=C,r.baseQueue=z,o.lastRenderedState=u}if(n=o.interleaved,n!==null){p=n;do v=p.lane,en.lanes|=v,Ts|=v,p=p.next;while(p!==n)}else p===null&&(o.lanes=0);return[r.memoizedState,o.dispatch]}function pd(n){var r=_i(),o=r.queue;if(o===null)throw Error(t(311));o.lastRenderedReducer=n;var u=o.dispatch,p=o.pending,v=r.memoizedState;if(p!==null){o.pending=null;var C=p=p.next;do v=n(v,C.action),C=C.next;while(C!==p);Ci(v,r.memoizedState)||($n=!0),r.memoizedState=v,r.baseQueue===null&&(r.baseState=v),o.lastRenderedState=v}return[v,u]}function am(){}function om(n,r){var o=en,u=_i(),p=r(),v=!Ci(u.memoizedState,p);if(v&&(u.memoizedState=p,$n=!0),u=u.queue,md(um.bind(null,o,u,n),[n]),u.getSnapshot!==r||v||Mn!==null&&Mn.memoizedState.tag&1){if(o.flags|=2048,No(9,cm.bind(null,o,u,p,r),void 0,null),En===null)throw Error(t(349));(bs&30)!==0||lm(o,r,p)}return p}function lm(n,r,o){n.flags|=16384,n={getSnapshot:r,value:o},r=en.updateQueue,r===null?(r={lastEffect:null,stores:null},en.updateQueue=r,r.stores=[n]):(o=r.stores,o===null?r.stores=[n]:o.push(n))}function cm(n,r,o,u){r.value=o,r.getSnapshot=u,dm(r)&&hm(n)}function um(n,r,o){return o(function(){dm(r)&&hm(n)})}function dm(n){var r=n.getSnapshot;n=n.value;try{var o=r();return!Ci(n,o)}catch{return!0}}function hm(n){var r=mr(n,1);r!==null&&Di(r,n,1,-1)}function fm(n){var r=Xi();return typeof n=="function"&&(n=n()),r.memoizedState=r.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Po,lastRenderedState:n},r.queue=n,n=n.dispatch=fv.bind(null,en,n),[r.memoizedState,n]}function No(n,r,o,u){return n={tag:n,create:r,destroy:o,deps:u,next:null},r=en.updateQueue,r===null?(r={lastEffect:null,stores:null},en.updateQueue=r,r.lastEffect=n.next=n):(o=r.lastEffect,o===null?r.lastEffect=n.next=n:(u=o.next,o.next=n,n.next=u,r.lastEffect=n)),n}function pm(){return _i().memoizedState}function jl(n,r,o,u){var p=Xi();en.flags|=n,p.memoizedState=No(1|r,o,void 0,u===void 0?null:u)}function Xl(n,r,o,u){var p=_i();u=u===void 0?null:u;var v=void 0;if(mn!==null){var C=mn.memoizedState;if(v=C.destroy,u!==null&&ud(u,C.deps)){p.memoizedState=No(r,o,v,u);return}}en.flags|=n,p.memoizedState=No(1|r,o,v,u)}function mm(n,r){return jl(8390656,8,n,r)}function md(n,r){return Xl(2048,8,n,r)}function gm(n,r){return Xl(4,2,n,r)}function _m(n,r){return Xl(4,4,n,r)}function xm(n,r){if(typeof r=="function")return n=n(),r(n),function(){r(null)};if(r!=null)return n=n(),r.current=n,function(){r.current=null}}function vm(n,r,o){return o=o!=null?o.concat([n]):null,Xl(4,4,xm.bind(null,r,n),o)}function gd(){}function ym(n,r){var o=_i();r=r===void 0?null:r;var u=o.memoizedState;return u!==null&&r!==null&&ud(r,u[1])?u[0]:(o.memoizedState=[n,r],n)}function Sm(n,r){var o=_i();r=r===void 0?null:r;var u=o.memoizedState;return u!==null&&r!==null&&ud(r,u[1])?u[0]:(n=n(),o.memoizedState=[n,r],n)}function Mm(n,r,o){return(bs&21)===0?(n.baseState&&(n.baseState=!1,$n=!0),n.memoizedState=o):(Ci(o,r)||(o=pn(),en.lanes|=o,Ts|=o,n.baseState=!0),r)}function dv(n,r){var o=gt;gt=o!==0&&4>o?o:4,n(!0);var u=cd.transition;cd.transition={};try{n(!1),r()}finally{gt=o,cd.transition=u}}function Em(){return _i().memoizedState}function hv(n,r,o){var u=Yr(n);if(o={lane:u,action:o,hasEagerState:!1,eagerState:null,next:null},wm(n))bm(r,o);else if(o=tm(n,r,o,u),o!==null){var p=Vn();Di(o,n,u,p),Tm(o,r,u)}}function fv(n,r,o){var u=Yr(n),p={lane:u,action:o,hasEagerState:!1,eagerState:null,next:null};if(wm(n))bm(r,p);else{var v=n.alternate;if(n.lanes===0&&(v===null||v.lanes===0)&&(v=r.lastRenderedReducer,v!==null))try{var C=r.lastRenderedState,k=v(C,o);if(p.hasEagerState=!0,p.eagerState=k,Ci(k,C)){var z=r.interleaved;z===null?(p.next=p,id(r)):(p.next=z.next,z.next=p),r.interleaved=p;return}}catch{}finally{}o=tm(n,r,p,u),o!==null&&(p=Vn(),Di(o,n,u,p),Tm(o,r,u))}}function wm(n){var r=n.alternate;return n===en||r!==null&&r===en}function bm(n,r){Co=Wl=!0;var o=n.pending;o===null?r.next=r:(r.next=o.next,o.next=r),n.pending=r}function Tm(n,r,o){if((o&4194240)!==0){var u=r.lanes;u&=n.pendingLanes,o|=u,r.lanes=o,Pn(n,o)}}var ql={readContext:gi,useCallback:Ln,useContext:Ln,useEffect:Ln,useImperativeHandle:Ln,useInsertionEffect:Ln,useLayoutEffect:Ln,useMemo:Ln,useReducer:Ln,useRef:Ln,useState:Ln,useDebugValue:Ln,useDeferredValue:Ln,useTransition:Ln,useMutableSource:Ln,useSyncExternalStore:Ln,useId:Ln,unstable_isNewReconciler:!1},pv={readContext:gi,useCallback:function(n,r){return Xi().memoizedState=[n,r===void 0?null:r],n},useContext:gi,useEffect:mm,useImperativeHandle:function(n,r,o){return o=o!=null?o.concat([n]):null,jl(4194308,4,xm.bind(null,r,n),o)},useLayoutEffect:function(n,r){return jl(4194308,4,n,r)},useInsertionEffect:function(n,r){return jl(4,2,n,r)},useMemo:function(n,r){var o=Xi();return r=r===void 0?null:r,n=n(),o.memoizedState=[n,r],n},useReducer:function(n,r,o){var u=Xi();return r=o!==void 0?o(r):r,u.memoizedState=u.baseState=r,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:r},u.queue=n,n=n.dispatch=hv.bind(null,en,n),[u.memoizedState,n]},useRef:function(n){var r=Xi();return n={current:n},r.memoizedState=n},useState:fm,useDebugValue:gd,useDeferredValue:function(n){return Xi().memoizedState=n},useTransition:function(){var n=fm(!1),r=n[0];return n=dv.bind(null,n[1]),Xi().memoizedState=n,[r,n]},useMutableSource:function(){},useSyncExternalStore:function(n,r,o){var u=en,p=Xi();if(Zt){if(o===void 0)throw Error(t(407));o=o()}else{if(o=r(),En===null)throw Error(t(349));(bs&30)!==0||lm(u,r,o)}p.memoizedState=o;var v={value:o,getSnapshot:r};return p.queue=v,mm(um.bind(null,u,v,n),[n]),u.flags|=2048,No(9,cm.bind(null,u,v,o,r),void 0,null),o},useId:function(){var n=Xi(),r=En.identifierPrefix;if(Zt){var o=pr,u=fr;o=(u&~(1<<32-Le(u)-1)).toString(32)+o,r=":"+r+"R"+o,o=Ro++,0<o&&(r+="H"+o.toString(32)),r+=":"}else o=uv++,r=":"+r+"r"+o.toString(32)+":";return n.memoizedState=r},unstable_isNewReconciler:!1},mv={readContext:gi,useCallback:ym,useContext:gi,useEffect:md,useImperativeHandle:vm,useInsertionEffect:gm,useLayoutEffect:_m,useMemo:Sm,useReducer:fd,useRef:pm,useState:function(){return fd(Po)},useDebugValue:gd,useDeferredValue:function(n){var r=_i();return Mm(r,mn.memoizedState,n)},useTransition:function(){var n=fd(Po)[0],r=_i().memoizedState;return[n,r]},useMutableSource:am,useSyncExternalStore:om,useId:Em,unstable_isNewReconciler:!1},gv={readContext:gi,useCallback:ym,useContext:gi,useEffect:md,useImperativeHandle:vm,useInsertionEffect:gm,useLayoutEffect:_m,useMemo:Sm,useReducer:pd,useRef:pm,useState:function(){return pd(Po)},useDebugValue:gd,useDeferredValue:function(n){var r=_i();return mn===null?r.memoizedState=n:Mm(r,mn.memoizedState,n)},useTransition:function(){var n=pd(Po)[0],r=_i().memoizedState;return[n,r]},useMutableSource:am,useSyncExternalStore:om,useId:Em,unstable_isNewReconciler:!1};function Pi(n,r){if(n&&n.defaultProps){r=K({},r),n=n.defaultProps;for(var o in n)r[o]===void 0&&(r[o]=n[o]);return r}return r}function _d(n,r,o,u){r=n.memoizedState,o=o(u,r),o=o==null?r:K({},r,o),n.memoizedState=o,n.lanes===0&&(n.updateQueue.baseState=o)}var Yl={isMounted:function(n){return(n=n._reactInternals)?zn(n)===n:!1},enqueueSetState:function(n,r,o){n=n._reactInternals;var u=Vn(),p=Yr(n),v=gr(u,p);v.payload=r,o!=null&&(v.callback=o),r=Wr(n,v,p),r!==null&&(Di(r,n,p,u),zl(r,n,p))},enqueueReplaceState:function(n,r,o){n=n._reactInternals;var u=Vn(),p=Yr(n),v=gr(u,p);v.tag=1,v.payload=r,o!=null&&(v.callback=o),r=Wr(n,v,p),r!==null&&(Di(r,n,p,u),zl(r,n,p))},enqueueForceUpdate:function(n,r){n=n._reactInternals;var o=Vn(),u=Yr(n),p=gr(o,u);p.tag=2,r!=null&&(p.callback=r),r=Wr(n,p,u),r!==null&&(Di(r,n,u,o),zl(r,n,u))}};function Am(n,r,o,u,p,v,C){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(u,v,C):r.prototype&&r.prototype.isPureReactComponent?!_o(o,u)||!_o(p,v):!0}function Cm(n,r,o){var u=!1,p=Hr,v=r.contextType;return typeof v=="object"&&v!==null?v=gi(v):(p=Yn(r)?ys:Nn.current,u=r.contextTypes,v=(u=u!=null)?la(n,p):Hr),r=new r(o,v),n.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,r.updater=Yl,n.stateNode=r,r._reactInternals=n,u&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=p,n.__reactInternalMemoizedMaskedChildContext=v),r}function Rm(n,r,o,u){n=r.state,typeof r.componentWillReceiveProps=="function"&&r.componentWillReceiveProps(o,u),typeof r.UNSAFE_componentWillReceiveProps=="function"&&r.UNSAFE_componentWillReceiveProps(o,u),r.state!==n&&Yl.enqueueReplaceState(r,r.state,null)}function xd(n,r,o,u){var p=n.stateNode;p.props=o,p.state=n.memoizedState,p.refs={},rd(n);var v=r.contextType;typeof v=="object"&&v!==null?p.context=gi(v):(v=Yn(r)?ys:Nn.current,p.context=la(n,v)),p.state=n.memoizedState,v=r.getDerivedStateFromProps,typeof v=="function"&&(_d(n,r,v,o),p.state=n.memoizedState),typeof r.getDerivedStateFromProps=="function"||typeof p.getSnapshotBeforeUpdate=="function"||typeof p.UNSAFE_componentWillMount!="function"&&typeof p.componentWillMount!="function"||(r=p.state,typeof p.componentWillMount=="function"&&p.componentWillMount(),typeof p.UNSAFE_componentWillMount=="function"&&p.UNSAFE_componentWillMount(),r!==p.state&&Yl.enqueueReplaceState(p,p.state,null),Hl(n,o,p,u),p.state=n.memoizedState),typeof p.componentDidMount=="function"&&(n.flags|=4194308)}function ga(n,r){try{var o="",u=r;do o+=Be(u),u=u.return;while(u);var p=o}catch(v){p=`
Error generating stack: `+v.message+`
`+v.stack}return{value:n,source:r,stack:p,digest:null}}function vd(n,r,o){return{value:n,source:null,stack:o??null,digest:r??null}}function yd(n,r){try{console.error(r.value)}catch(o){setTimeout(function(){throw o})}}var _v=typeof WeakMap=="function"?WeakMap:Map;function Pm(n,r,o){o=gr(-1,o),o.tag=3,o.payload={element:null};var u=r.value;return o.callback=function(){tc||(tc=!0,Ud=u),yd(n,r)},o}function Nm(n,r,o){o=gr(-1,o),o.tag=3;var u=n.type.getDerivedStateFromError;if(typeof u=="function"){var p=r.value;o.payload=function(){return u(p)},o.callback=function(){yd(n,r)}}var v=n.stateNode;return v!==null&&typeof v.componentDidCatch=="function"&&(o.callback=function(){yd(n,r),typeof u!="function"&&(Xr===null?Xr=new Set([this]):Xr.add(this));var C=r.stack;this.componentDidCatch(r.value,{componentStack:C!==null?C:""})}),o}function Lm(n,r,o){var u=n.pingCache;if(u===null){u=n.pingCache=new _v;var p=new Set;u.set(r,p)}else p=u.get(r),p===void 0&&(p=new Set,u.set(r,p));p.has(o)||(p.add(o),n=Nv.bind(null,n,r,o),r.then(n,n))}function Dm(n){do{var r;if((r=n.tag===13)&&(r=n.memoizedState,r=r!==null?r.dehydrated!==null:!0),r)return n;n=n.return}while(n!==null);return null}function Im(n,r,o,u,p){return(n.mode&1)===0?(n===r?n.flags|=65536:(n.flags|=128,o.flags|=131072,o.flags&=-52805,o.tag===1&&(o.alternate===null?o.tag=17:(r=gr(-1,1),r.tag=2,Wr(o,r,1))),o.lanes|=1),n):(n.flags|=65536,n.lanes=p,n)}var xv=A.ReactCurrentOwner,$n=!1;function Hn(n,r,o,u){r.child=n===null?em(r,null,o,u):ha(r,n.child,o,u)}function Um(n,r,o,u,p){o=o.render;var v=r.ref;return pa(r,p),u=dd(n,r,o,u,v,p),o=hd(),n!==null&&!$n?(r.updateQueue=n.updateQueue,r.flags&=-2053,n.lanes&=~p,_r(n,r,p)):(Zt&&o&&Yu(r),r.flags|=1,Hn(n,r,u,p),r.child)}function Fm(n,r,o,u,p){if(n===null){var v=o.type;return typeof v=="function"&&!Vd(v)&&v.defaultProps===void 0&&o.compare===null&&o.defaultProps===void 0?(r.tag=15,r.type=v,Om(n,r,v,u,p)):(n=oc(o.type,null,u,r,r.mode,p),n.ref=r.ref,n.return=r,r.child=n)}if(v=n.child,(n.lanes&p)===0){var C=v.memoizedProps;if(o=o.compare,o=o!==null?o:_o,o(C,u)&&n.ref===r.ref)return _r(n,r,p)}return r.flags|=1,n=Kr(v,u),n.ref=r.ref,n.return=r,r.child=n}function Om(n,r,o,u,p){if(n!==null){var v=n.memoizedProps;if(_o(v,u)&&n.ref===r.ref)if($n=!1,r.pendingProps=u=v,(n.lanes&p)!==0)(n.flags&131072)!==0&&($n=!0);else return r.lanes=n.lanes,_r(n,r,p)}return Sd(n,r,o,u,p)}function km(n,r,o){var u=r.pendingProps,p=u.children,v=n!==null?n.memoizedState:null;if(u.mode==="hidden")if((r.mode&1)===0)r.memoizedState={baseLanes:0,cachePool:null,transitions:null},jt(xa,ai),ai|=o;else{if((o&1073741824)===0)return n=v!==null?v.baseLanes|o:o,r.lanes=r.childLanes=1073741824,r.memoizedState={baseLanes:n,cachePool:null,transitions:null},r.updateQueue=null,jt(xa,ai),ai|=n,null;r.memoizedState={baseLanes:0,cachePool:null,transitions:null},u=v!==null?v.baseLanes:o,jt(xa,ai),ai|=u}else v!==null?(u=v.baseLanes|o,r.memoizedState=null):u=o,jt(xa,ai),ai|=u;return Hn(n,r,p,o),r.child}function Bm(n,r){var o=r.ref;(n===null&&o!==null||n!==null&&n.ref!==o)&&(r.flags|=512,r.flags|=2097152)}function Sd(n,r,o,u,p){var v=Yn(o)?ys:Nn.current;return v=la(r,v),pa(r,p),o=dd(n,r,o,u,v,p),u=hd(),n!==null&&!$n?(r.updateQueue=n.updateQueue,r.flags&=-2053,n.lanes&=~p,_r(n,r,p)):(Zt&&u&&Yu(r),r.flags|=1,Hn(n,r,o,p),r.child)}function zm(n,r,o,u,p){if(Yn(o)){var v=!0;Ll(r)}else v=!1;if(pa(r,p),r.stateNode===null)Kl(n,r),Cm(r,o,u),xd(r,o,u,p),u=!0;else if(n===null){var C=r.stateNode,k=r.memoizedProps;C.props=k;var z=C.context,ue=o.contextType;typeof ue=="object"&&ue!==null?ue=gi(ue):(ue=Yn(o)?ys:Nn.current,ue=la(r,ue));var ye=o.getDerivedStateFromProps,Me=typeof ye=="function"||typeof C.getSnapshotBeforeUpdate=="function";Me||typeof C.UNSAFE_componentWillReceiveProps!="function"&&typeof C.componentWillReceiveProps!="function"||(k!==u||z!==ue)&&Rm(r,C,u,ue),Gr=!1;var ve=r.memoizedState;C.state=ve,Hl(r,u,C,p),z=r.memoizedState,k!==u||ve!==z||qn.current||Gr?(typeof ye=="function"&&(_d(r,o,ye,u),z=r.memoizedState),(k=Gr||Am(r,o,k,u,ve,z,ue))?(Me||typeof C.UNSAFE_componentWillMount!="function"&&typeof C.componentWillMount!="function"||(typeof C.componentWillMount=="function"&&C.componentWillMount(),typeof C.UNSAFE_componentWillMount=="function"&&C.UNSAFE_componentWillMount()),typeof C.componentDidMount=="function"&&(r.flags|=4194308)):(typeof C.componentDidMount=="function"&&(r.flags|=4194308),r.memoizedProps=u,r.memoizedState=z),C.props=u,C.state=z,C.context=ue,u=k):(typeof C.componentDidMount=="function"&&(r.flags|=4194308),u=!1)}else{C=r.stateNode,nm(n,r),k=r.memoizedProps,ue=r.type===r.elementType?k:Pi(r.type,k),C.props=ue,Me=r.pendingProps,ve=C.context,z=o.contextType,typeof z=="object"&&z!==null?z=gi(z):(z=Yn(o)?ys:Nn.current,z=la(r,z));var ze=o.getDerivedStateFromProps;(ye=typeof ze=="function"||typeof C.getSnapshotBeforeUpdate=="function")||typeof C.UNSAFE_componentWillReceiveProps!="function"&&typeof C.componentWillReceiveProps!="function"||(k!==Me||ve!==z)&&Rm(r,C,u,z),Gr=!1,ve=r.memoizedState,C.state=ve,Hl(r,u,C,p);var Xe=r.memoizedState;k!==Me||ve!==Xe||qn.current||Gr?(typeof ze=="function"&&(_d(r,o,ze,u),Xe=r.memoizedState),(ue=Gr||Am(r,o,ue,u,ve,Xe,z)||!1)?(ye||typeof C.UNSAFE_componentWillUpdate!="function"&&typeof C.componentWillUpdate!="function"||(typeof C.componentWillUpdate=="function"&&C.componentWillUpdate(u,Xe,z),typeof C.UNSAFE_componentWillUpdate=="function"&&C.UNSAFE_componentWillUpdate(u,Xe,z)),typeof C.componentDidUpdate=="function"&&(r.flags|=4),typeof C.getSnapshotBeforeUpdate=="function"&&(r.flags|=1024)):(typeof C.componentDidUpdate!="function"||k===n.memoizedProps&&ve===n.memoizedState||(r.flags|=4),typeof C.getSnapshotBeforeUpdate!="function"||k===n.memoizedProps&&ve===n.memoizedState||(r.flags|=1024),r.memoizedProps=u,r.memoizedState=Xe),C.props=u,C.state=Xe,C.context=z,u=ue):(typeof C.componentDidUpdate!="function"||k===n.memoizedProps&&ve===n.memoizedState||(r.flags|=4),typeof C.getSnapshotBeforeUpdate!="function"||k===n.memoizedProps&&ve===n.memoizedState||(r.flags|=1024),u=!1)}return Md(n,r,o,u,v,p)}function Md(n,r,o,u,p,v){Bm(n,r);var C=(r.flags&128)!==0;if(!u&&!C)return p&&jp(r,o,!1),_r(n,r,v);u=r.stateNode,xv.current=r;var k=C&&typeof o.getDerivedStateFromError!="function"?null:u.render();return r.flags|=1,n!==null&&C?(r.child=ha(r,n.child,null,v),r.child=ha(r,null,k,v)):Hn(n,r,k,v),r.memoizedState=u.state,p&&jp(r,o,!0),r.child}function Hm(n){var r=n.stateNode;r.pendingContext?Gp(n,r.pendingContext,r.pendingContext!==r.context):r.context&&Gp(n,r.context,!1),sd(n,r.containerInfo)}function Vm(n,r,o,u,p){return da(),Qu(p),r.flags|=256,Hn(n,r,o,u),r.child}var Ed={dehydrated:null,treeContext:null,retryLane:0};function wd(n){return{baseLanes:n,cachePool:null,transitions:null}}function Gm(n,r,o){var u=r.pendingProps,p=Jt.current,v=!1,C=(r.flags&128)!==0,k;if((k=C)||(k=n!==null&&n.memoizedState===null?!1:(p&2)!==0),k?(v=!0,r.flags&=-129):(n===null||n.memoizedState!==null)&&(p|=1),jt(Jt,p&1),n===null)return Zu(r),n=r.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?((r.mode&1)===0?r.lanes=1:n.data==="$!"?r.lanes=8:r.lanes=1073741824,null):(C=u.children,n=u.fallback,v?(u=r.mode,v=r.child,C={mode:"hidden",children:C},(u&1)===0&&v!==null?(v.childLanes=0,v.pendingProps=C):v=lc(C,u,0,null),n=Ps(n,u,o,null),v.return=r,n.return=r,v.sibling=n,r.child=v,r.child.memoizedState=wd(o),r.memoizedState=Ed,n):bd(r,C));if(p=n.memoizedState,p!==null&&(k=p.dehydrated,k!==null))return vv(n,r,C,u,k,p,o);if(v){v=u.fallback,C=r.mode,p=n.child,k=p.sibling;var z={mode:"hidden",children:u.children};return(C&1)===0&&r.child!==p?(u=r.child,u.childLanes=0,u.pendingProps=z,r.deletions=null):(u=Kr(p,z),u.subtreeFlags=p.subtreeFlags&14680064),k!==null?v=Kr(k,v):(v=Ps(v,C,o,null),v.flags|=2),v.return=r,u.return=r,u.sibling=v,r.child=u,u=v,v=r.child,C=n.child.memoizedState,C=C===null?wd(o):{baseLanes:C.baseLanes|o,cachePool:null,transitions:C.transitions},v.memoizedState=C,v.childLanes=n.childLanes&~o,r.memoizedState=Ed,u}return v=n.child,n=v.sibling,u=Kr(v,{mode:"visible",children:u.children}),(r.mode&1)===0&&(u.lanes=o),u.return=r,u.sibling=null,n!==null&&(o=r.deletions,o===null?(r.deletions=[n],r.flags|=16):o.push(n)),r.child=u,r.memoizedState=null,u}function bd(n,r){return r=lc({mode:"visible",children:r},n.mode,0,null),r.return=n,n.child=r}function $l(n,r,o,u){return u!==null&&Qu(u),ha(r,n.child,null,o),n=bd(r,r.pendingProps.children),n.flags|=2,r.memoizedState=null,n}function vv(n,r,o,u,p,v,C){if(o)return r.flags&256?(r.flags&=-257,u=vd(Error(t(422))),$l(n,r,C,u)):r.memoizedState!==null?(r.child=n.child,r.flags|=128,null):(v=u.fallback,p=r.mode,u=lc({mode:"visible",children:u.children},p,0,null),v=Ps(v,p,C,null),v.flags|=2,u.return=r,v.return=r,u.sibling=v,r.child=u,(r.mode&1)!==0&&ha(r,n.child,null,C),r.child.memoizedState=wd(C),r.memoizedState=Ed,v);if((r.mode&1)===0)return $l(n,r,C,null);if(p.data==="$!"){if(u=p.nextSibling&&p.nextSibling.dataset,u)var k=u.dgst;return u=k,v=Error(t(419)),u=vd(v,u,void 0),$l(n,r,C,u)}if(k=(C&n.childLanes)!==0,$n||k){if(u=En,u!==null){switch(C&-C){case 4:p=2;break;case 16:p=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:p=32;break;case 536870912:p=268435456;break;default:p=0}p=(p&(u.suspendedLanes|C))!==0?0:p,p!==0&&p!==v.retryLane&&(v.retryLane=p,mr(n,p),Di(u,n,p,-1))}return Hd(),u=vd(Error(t(421))),$l(n,r,C,u)}return p.data==="$?"?(r.flags|=128,r.child=n.child,r=Lv.bind(null,n),p._reactRetry=r,null):(n=v.treeContext,si=Br(p.nextSibling),ri=r,Zt=!0,Ri=null,n!==null&&(pi[mi++]=fr,pi[mi++]=pr,pi[mi++]=Ss,fr=n.id,pr=n.overflow,Ss=r),r=bd(r,u.children),r.flags|=4096,r)}function Wm(n,r,o){n.lanes|=r;var u=n.alternate;u!==null&&(u.lanes|=r),nd(n.return,r,o)}function Td(n,r,o,u,p){var v=n.memoizedState;v===null?n.memoizedState={isBackwards:r,rendering:null,renderingStartTime:0,last:u,tail:o,tailMode:p}:(v.isBackwards=r,v.rendering=null,v.renderingStartTime=0,v.last=u,v.tail=o,v.tailMode=p)}function jm(n,r,o){var u=r.pendingProps,p=u.revealOrder,v=u.tail;if(Hn(n,r,u.children,o),u=Jt.current,(u&2)!==0)u=u&1|2,r.flags|=128;else{if(n!==null&&(n.flags&128)!==0)e:for(n=r.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&Wm(n,o,r);else if(n.tag===19)Wm(n,o,r);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===r)break e;for(;n.sibling===null;){if(n.return===null||n.return===r)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}u&=1}if(jt(Jt,u),(r.mode&1)===0)r.memoizedState=null;else switch(p){case"forwards":for(o=r.child,p=null;o!==null;)n=o.alternate,n!==null&&Vl(n)===null&&(p=o),o=o.sibling;o=p,o===null?(p=r.child,r.child=null):(p=o.sibling,o.sibling=null),Td(r,!1,p,o,v);break;case"backwards":for(o=null,p=r.child,r.child=null;p!==null;){if(n=p.alternate,n!==null&&Vl(n)===null){r.child=p;break}n=p.sibling,p.sibling=o,o=p,p=n}Td(r,!0,o,null,v);break;case"together":Td(r,!1,null,null,void 0);break;default:r.memoizedState=null}return r.child}function Kl(n,r){(r.mode&1)===0&&n!==null&&(n.alternate=null,r.alternate=null,r.flags|=2)}function _r(n,r,o){if(n!==null&&(r.dependencies=n.dependencies),Ts|=r.lanes,(o&r.childLanes)===0)return null;if(n!==null&&r.child!==n.child)throw Error(t(153));if(r.child!==null){for(n=r.child,o=Kr(n,n.pendingProps),r.child=o,o.return=r;n.sibling!==null;)n=n.sibling,o=o.sibling=Kr(n,n.pendingProps),o.return=r;o.sibling=null}return r.child}function yv(n,r,o){switch(r.tag){case 3:Hm(r),da();break;case 5:sm(r);break;case 1:Yn(r.type)&&Ll(r);break;case 4:sd(r,r.stateNode.containerInfo);break;case 10:var u=r.type._context,p=r.memoizedProps.value;jt(kl,u._currentValue),u._currentValue=p;break;case 13:if(u=r.memoizedState,u!==null)return u.dehydrated!==null?(jt(Jt,Jt.current&1),r.flags|=128,null):(o&r.child.childLanes)!==0?Gm(n,r,o):(jt(Jt,Jt.current&1),n=_r(n,r,o),n!==null?n.sibling:null);jt(Jt,Jt.current&1);break;case 19:if(u=(o&r.childLanes)!==0,(n.flags&128)!==0){if(u)return jm(n,r,o);r.flags|=128}if(p=r.memoizedState,p!==null&&(p.rendering=null,p.tail=null,p.lastEffect=null),jt(Jt,Jt.current),u)break;return null;case 22:case 23:return r.lanes=0,km(n,r,o)}return _r(n,r,o)}var Xm,Ad,qm,Ym;Xm=function(n,r){for(var o=r.child;o!==null;){if(o.tag===5||o.tag===6)n.appendChild(o.stateNode);else if(o.tag!==4&&o.child!==null){o.child.return=o,o=o.child;continue}if(o===r)break;for(;o.sibling===null;){if(o.return===null||o.return===r)return;o=o.return}o.sibling.return=o.return,o=o.sibling}},Ad=function(){},qm=function(n,r,o,u){var p=n.memoizedProps;if(p!==u){n=r.stateNode,ws(ji.current);var v=null;switch(o){case"input":p=ht(n,p),u=ht(n,u),v=[];break;case"select":p=K({},p,{value:void 0}),u=K({},u,{value:void 0}),v=[];break;case"textarea":p=$t(n,p),u=$t(n,u),v=[];break;default:typeof p.onClick!="function"&&typeof u.onClick=="function"&&(n.onclick=Rl)}Ke(o,u);var C;o=null;for(ue in p)if(!u.hasOwnProperty(ue)&&p.hasOwnProperty(ue)&&p[ue]!=null)if(ue==="style"){var k=p[ue];for(C in k)k.hasOwnProperty(C)&&(o||(o={}),o[C]="")}else ue!=="dangerouslySetInnerHTML"&&ue!=="children"&&ue!=="suppressContentEditableWarning"&&ue!=="suppressHydrationWarning"&&ue!=="autoFocus"&&(a.hasOwnProperty(ue)?v||(v=[]):(v=v||[]).push(ue,null));for(ue in u){var z=u[ue];if(k=p!=null?p[ue]:void 0,u.hasOwnProperty(ue)&&z!==k&&(z!=null||k!=null))if(ue==="style")if(k){for(C in k)!k.hasOwnProperty(C)||z&&z.hasOwnProperty(C)||(o||(o={}),o[C]="");for(C in z)z.hasOwnProperty(C)&&k[C]!==z[C]&&(o||(o={}),o[C]=z[C])}else o||(v||(v=[]),v.push(ue,o)),o=z;else ue==="dangerouslySetInnerHTML"?(z=z?z.__html:void 0,k=k?k.__html:void 0,z!=null&&k!==z&&(v=v||[]).push(ue,z)):ue==="children"?typeof z!="string"&&typeof z!="number"||(v=v||[]).push(ue,""+z):ue!=="suppressContentEditableWarning"&&ue!=="suppressHydrationWarning"&&(a.hasOwnProperty(ue)?(z!=null&&ue==="onScroll"&&qt("scroll",n),v||k===z||(v=[])):(v=v||[]).push(ue,z))}o&&(v=v||[]).push("style",o);var ue=v;(r.updateQueue=ue)&&(r.flags|=4)}},Ym=function(n,r,o,u){o!==u&&(r.flags|=4)};function Lo(n,r){if(!Zt)switch(n.tailMode){case"hidden":r=n.tail;for(var o=null;r!==null;)r.alternate!==null&&(o=r),r=r.sibling;o===null?n.tail=null:o.sibling=null;break;case"collapsed":o=n.tail;for(var u=null;o!==null;)o.alternate!==null&&(u=o),o=o.sibling;u===null?r||n.tail===null?n.tail=null:n.tail.sibling=null:u.sibling=null}}function Dn(n){var r=n.alternate!==null&&n.alternate.child===n.child,o=0,u=0;if(r)for(var p=n.child;p!==null;)o|=p.lanes|p.childLanes,u|=p.subtreeFlags&14680064,u|=p.flags&14680064,p.return=n,p=p.sibling;else for(p=n.child;p!==null;)o|=p.lanes|p.childLanes,u|=p.subtreeFlags,u|=p.flags,p.return=n,p=p.sibling;return n.subtreeFlags|=u,n.childLanes=o,r}function Sv(n,r,o){var u=r.pendingProps;switch($u(r),r.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Dn(r),null;case 1:return Yn(r.type)&&Nl(),Dn(r),null;case 3:return u=r.stateNode,ma(),Yt(qn),Yt(Nn),ld(),u.pendingContext&&(u.context=u.pendingContext,u.pendingContext=null),(n===null||n.child===null)&&(Fl(r)?r.flags|=4:n===null||n.memoizedState.isDehydrated&&(r.flags&256)===0||(r.flags|=1024,Ri!==null&&(kd(Ri),Ri=null))),Ad(n,r),Dn(r),null;case 5:ad(r);var p=ws(Ao.current);if(o=r.type,n!==null&&r.stateNode!=null)qm(n,r,o,u,p),n.ref!==r.ref&&(r.flags|=512,r.flags|=2097152);else{if(!u){if(r.stateNode===null)throw Error(t(166));return Dn(r),null}if(n=ws(ji.current),Fl(r)){u=r.stateNode,o=r.type;var v=r.memoizedProps;switch(u[Wi]=r,u[Mo]=v,n=(r.mode&1)!==0,o){case"dialog":qt("cancel",u),qt("close",u);break;case"iframe":case"object":case"embed":qt("load",u);break;case"video":case"audio":for(p=0;p<vo.length;p++)qt(vo[p],u);break;case"source":qt("error",u);break;case"img":case"image":case"link":qt("error",u),qt("load",u);break;case"details":qt("toggle",u);break;case"input":xt(u,v),qt("invalid",u);break;case"select":u._wrapperState={wasMultiple:!!v.multiple},qt("invalid",u);break;case"textarea":X(u,v),qt("invalid",u)}Ke(o,v),p=null;for(var C in v)if(v.hasOwnProperty(C)){var k=v[C];C==="children"?typeof k=="string"?u.textContent!==k&&(v.suppressHydrationWarning!==!0&&Cl(u.textContent,k,n),p=["children",k]):typeof k=="number"&&u.textContent!==""+k&&(v.suppressHydrationWarning!==!0&&Cl(u.textContent,k,n),p=["children",""+k]):a.hasOwnProperty(C)&&k!=null&&C==="onScroll"&&qt("scroll",u)}switch(o){case"input":Fe(u),Ut(u,v,!0);break;case"textarea":Fe(u),Rt(u);break;case"select":case"option":break;default:typeof v.onClick=="function"&&(u.onclick=Rl)}u=p,r.updateQueue=u,u!==null&&(r.flags|=4)}else{C=p.nodeType===9?p:p.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=O(o)),n==="http://www.w3.org/1999/xhtml"?o==="script"?(n=C.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof u.is=="string"?n=C.createElement(o,{is:u.is}):(n=C.createElement(o),o==="select"&&(C=n,u.multiple?C.multiple=!0:u.size&&(C.size=u.size))):n=C.createElementNS(n,o),n[Wi]=r,n[Mo]=u,Xm(n,r,!1,!1),r.stateNode=n;e:{switch(C=Ne(o,u),o){case"dialog":qt("cancel",n),qt("close",n),p=u;break;case"iframe":case"object":case"embed":qt("load",n),p=u;break;case"video":case"audio":for(p=0;p<vo.length;p++)qt(vo[p],n);p=u;break;case"source":qt("error",n),p=u;break;case"img":case"image":case"link":qt("error",n),qt("load",n),p=u;break;case"details":qt("toggle",n),p=u;break;case"input":xt(n,u),p=ht(n,u),qt("invalid",n);break;case"option":p=u;break;case"select":n._wrapperState={wasMultiple:!!u.multiple},p=K({},u,{value:void 0}),qt("invalid",n);break;case"textarea":X(n,u),p=$t(n,u),qt("invalid",n);break;default:p=u}Ke(o,p),k=p;for(v in k)if(k.hasOwnProperty(v)){var z=k[v];v==="style"?_e(n,z):v==="dangerouslySetInnerHTML"?(z=z?z.__html:void 0,z!=null&&le(n,z)):v==="children"?typeof z=="string"?(o!=="textarea"||z!=="")&&fe(n,z):typeof z=="number"&&fe(n,""+z):v!=="suppressContentEditableWarning"&&v!=="suppressHydrationWarning"&&v!=="autoFocus"&&(a.hasOwnProperty(v)?z!=null&&v==="onScroll"&&qt("scroll",n):z!=null&&I(n,v,z,C))}switch(o){case"input":Fe(n),Ut(n,u,!1);break;case"textarea":Fe(n),Rt(n);break;case"option":u.value!=null&&n.setAttribute("value",""+de(u.value));break;case"select":n.multiple=!!u.multiple,v=u.value,v!=null?Ct(n,!!u.multiple,v,!1):u.defaultValue!=null&&Ct(n,!!u.multiple,u.defaultValue,!0);break;default:typeof p.onClick=="function"&&(n.onclick=Rl)}switch(o){case"button":case"input":case"select":case"textarea":u=!!u.autoFocus;break e;case"img":u=!0;break e;default:u=!1}}u&&(r.flags|=4)}r.ref!==null&&(r.flags|=512,r.flags|=2097152)}return Dn(r),null;case 6:if(n&&r.stateNode!=null)Ym(n,r,n.memoizedProps,u);else{if(typeof u!="string"&&r.stateNode===null)throw Error(t(166));if(o=ws(Ao.current),ws(ji.current),Fl(r)){if(u=r.stateNode,o=r.memoizedProps,u[Wi]=r,(v=u.nodeValue!==o)&&(n=ri,n!==null))switch(n.tag){case 3:Cl(u.nodeValue,o,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&Cl(u.nodeValue,o,(n.mode&1)!==0)}v&&(r.flags|=4)}else u=(o.nodeType===9?o:o.ownerDocument).createTextNode(u),u[Wi]=r,r.stateNode=u}return Dn(r),null;case 13:if(Yt(Jt),u=r.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(Zt&&si!==null&&(r.mode&1)!==0&&(r.flags&128)===0)Zp(),da(),r.flags|=98560,v=!1;else if(v=Fl(r),u!==null&&u.dehydrated!==null){if(n===null){if(!v)throw Error(t(318));if(v=r.memoizedState,v=v!==null?v.dehydrated:null,!v)throw Error(t(317));v[Wi]=r}else da(),(r.flags&128)===0&&(r.memoizedState=null),r.flags|=4;Dn(r),v=!1}else Ri!==null&&(kd(Ri),Ri=null),v=!0;if(!v)return r.flags&65536?r:null}return(r.flags&128)!==0?(r.lanes=o,r):(u=u!==null,u!==(n!==null&&n.memoizedState!==null)&&u&&(r.child.flags|=8192,(r.mode&1)!==0&&(n===null||(Jt.current&1)!==0?gn===0&&(gn=3):Hd())),r.updateQueue!==null&&(r.flags|=4),Dn(r),null);case 4:return ma(),Ad(n,r),n===null&&yo(r.stateNode.containerInfo),Dn(r),null;case 10:return td(r.type._context),Dn(r),null;case 17:return Yn(r.type)&&Nl(),Dn(r),null;case 19:if(Yt(Jt),v=r.memoizedState,v===null)return Dn(r),null;if(u=(r.flags&128)!==0,C=v.rendering,C===null)if(u)Lo(v,!1);else{if(gn!==0||n!==null&&(n.flags&128)!==0)for(n=r.child;n!==null;){if(C=Vl(n),C!==null){for(r.flags|=128,Lo(v,!1),u=C.updateQueue,u!==null&&(r.updateQueue=u,r.flags|=4),r.subtreeFlags=0,u=o,o=r.child;o!==null;)v=o,n=u,v.flags&=14680066,C=v.alternate,C===null?(v.childLanes=0,v.lanes=n,v.child=null,v.subtreeFlags=0,v.memoizedProps=null,v.memoizedState=null,v.updateQueue=null,v.dependencies=null,v.stateNode=null):(v.childLanes=C.childLanes,v.lanes=C.lanes,v.child=C.child,v.subtreeFlags=0,v.deletions=null,v.memoizedProps=C.memoizedProps,v.memoizedState=C.memoizedState,v.updateQueue=C.updateQueue,v.type=C.type,n=C.dependencies,v.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),o=o.sibling;return jt(Jt,Jt.current&1|2),r.child}n=n.sibling}v.tail!==null&&Qt()>va&&(r.flags|=128,u=!0,Lo(v,!1),r.lanes=4194304)}else{if(!u)if(n=Vl(C),n!==null){if(r.flags|=128,u=!0,o=n.updateQueue,o!==null&&(r.updateQueue=o,r.flags|=4),Lo(v,!0),v.tail===null&&v.tailMode==="hidden"&&!C.alternate&&!Zt)return Dn(r),null}else 2*Qt()-v.renderingStartTime>va&&o!==1073741824&&(r.flags|=128,u=!0,Lo(v,!1),r.lanes=4194304);v.isBackwards?(C.sibling=r.child,r.child=C):(o=v.last,o!==null?o.sibling=C:r.child=C,v.last=C)}return v.tail!==null?(r=v.tail,v.rendering=r,v.tail=r.sibling,v.renderingStartTime=Qt(),r.sibling=null,o=Jt.current,jt(Jt,u?o&1|2:o&1),r):(Dn(r),null);case 22:case 23:return zd(),u=r.memoizedState!==null,n!==null&&n.memoizedState!==null!==u&&(r.flags|=8192),u&&(r.mode&1)!==0?(ai&1073741824)!==0&&(Dn(r),r.subtreeFlags&6&&(r.flags|=8192)):Dn(r),null;case 24:return null;case 25:return null}throw Error(t(156,r.tag))}function Mv(n,r){switch($u(r),r.tag){case 1:return Yn(r.type)&&Nl(),n=r.flags,n&65536?(r.flags=n&-65537|128,r):null;case 3:return ma(),Yt(qn),Yt(Nn),ld(),n=r.flags,(n&65536)!==0&&(n&128)===0?(r.flags=n&-65537|128,r):null;case 5:return ad(r),null;case 13:if(Yt(Jt),n=r.memoizedState,n!==null&&n.dehydrated!==null){if(r.alternate===null)throw Error(t(340));da()}return n=r.flags,n&65536?(r.flags=n&-65537|128,r):null;case 19:return Yt(Jt),null;case 4:return ma(),null;case 10:return td(r.type._context),null;case 22:case 23:return zd(),null;case 24:return null;default:return null}}var Zl=!1,In=!1,Ev=typeof WeakSet=="function"?WeakSet:Set,We=null;function _a(n,r){var o=n.ref;if(o!==null)if(typeof o=="function")try{o(null)}catch(u){an(n,r,u)}else o.current=null}function Cd(n,r,o){try{o()}catch(u){an(n,r,u)}}var $m=!1;function wv(n,r){if(zu=_l,n=Ap(),Lu(n)){if("selectionStart"in n)var o={start:n.selectionStart,end:n.selectionEnd};else e:{o=(o=n.ownerDocument)&&o.defaultView||window;var u=o.getSelection&&o.getSelection();if(u&&u.rangeCount!==0){o=u.anchorNode;var p=u.anchorOffset,v=u.focusNode;u=u.focusOffset;try{o.nodeType,v.nodeType}catch{o=null;break e}var C=0,k=-1,z=-1,ue=0,ye=0,Me=n,ve=null;t:for(;;){for(var ze;Me!==o||p!==0&&Me.nodeType!==3||(k=C+p),Me!==v||u!==0&&Me.nodeType!==3||(z=C+u),Me.nodeType===3&&(C+=Me.nodeValue.length),(ze=Me.firstChild)!==null;)ve=Me,Me=ze;for(;;){if(Me===n)break t;if(ve===o&&++ue===p&&(k=C),ve===v&&++ye===u&&(z=C),(ze=Me.nextSibling)!==null)break;Me=ve,ve=Me.parentNode}Me=ze}o=k===-1||z===-1?null:{start:k,end:z}}else o=null}o=o||{start:0,end:0}}else o=null;for(Hu={focusedElem:n,selectionRange:o},_l=!1,We=r;We!==null;)if(r=We,n=r.child,(r.subtreeFlags&1028)!==0&&n!==null)n.return=r,We=n;else for(;We!==null;){r=We;try{var Xe=r.alternate;if((r.flags&1024)!==0)switch(r.tag){case 0:case 11:case 15:break;case 1:if(Xe!==null){var Ye=Xe.memoizedProps,cn=Xe.memoizedState,re=r.stateNode,q=re.getSnapshotBeforeUpdate(r.elementType===r.type?Ye:Pi(r.type,Ye),cn);re.__reactInternalSnapshotBeforeUpdate=q}break;case 3:var oe=r.stateNode.containerInfo;oe.nodeType===1?oe.textContent="":oe.nodeType===9&&oe.documentElement&&oe.removeChild(oe.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(t(163))}}catch(be){an(r,r.return,be)}if(n=r.sibling,n!==null){n.return=r.return,We=n;break}We=r.return}return Xe=$m,$m=!1,Xe}function Do(n,r,o){var u=r.updateQueue;if(u=u!==null?u.lastEffect:null,u!==null){var p=u=u.next;do{if((p.tag&n)===n){var v=p.destroy;p.destroy=void 0,v!==void 0&&Cd(r,o,v)}p=p.next}while(p!==u)}}function Ql(n,r){if(r=r.updateQueue,r=r!==null?r.lastEffect:null,r!==null){var o=r=r.next;do{if((o.tag&n)===n){var u=o.create;o.destroy=u()}o=o.next}while(o!==r)}}function Rd(n){var r=n.ref;if(r!==null){var o=n.stateNode;switch(n.tag){case 5:n=o;break;default:n=o}typeof r=="function"?r(n):r.current=n}}function Km(n){var r=n.alternate;r!==null&&(n.alternate=null,Km(r)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(r=n.stateNode,r!==null&&(delete r[Wi],delete r[Mo],delete r[ju],delete r[av],delete r[ov])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function Zm(n){return n.tag===5||n.tag===3||n.tag===4}function Qm(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||Zm(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function Pd(n,r,o){var u=n.tag;if(u===5||u===6)n=n.stateNode,r?o.nodeType===8?o.parentNode.insertBefore(n,r):o.insertBefore(n,r):(o.nodeType===8?(r=o.parentNode,r.insertBefore(n,o)):(r=o,r.appendChild(n)),o=o._reactRootContainer,o!=null||r.onclick!==null||(r.onclick=Rl));else if(u!==4&&(n=n.child,n!==null))for(Pd(n,r,o),n=n.sibling;n!==null;)Pd(n,r,o),n=n.sibling}function Nd(n,r,o){var u=n.tag;if(u===5||u===6)n=n.stateNode,r?o.insertBefore(n,r):o.appendChild(n);else if(u!==4&&(n=n.child,n!==null))for(Nd(n,r,o),n=n.sibling;n!==null;)Nd(n,r,o),n=n.sibling}var An=null,Ni=!1;function jr(n,r,o){for(o=o.child;o!==null;)Jm(n,r,o),o=o.sibling}function Jm(n,r,o){if(te&&typeof te.onCommitFiberUnmount=="function")try{te.onCommitFiberUnmount(ie,o)}catch{}switch(o.tag){case 5:In||_a(o,r);case 6:var u=An,p=Ni;An=null,jr(n,r,o),An=u,Ni=p,An!==null&&(Ni?(n=An,o=o.stateNode,n.nodeType===8?n.parentNode.removeChild(o):n.removeChild(o)):An.removeChild(o.stateNode));break;case 18:An!==null&&(Ni?(n=An,o=o.stateNode,n.nodeType===8?Wu(n.parentNode,o):n.nodeType===1&&Wu(n,o),uo(n)):Wu(An,o.stateNode));break;case 4:u=An,p=Ni,An=o.stateNode.containerInfo,Ni=!0,jr(n,r,o),An=u,Ni=p;break;case 0:case 11:case 14:case 15:if(!In&&(u=o.updateQueue,u!==null&&(u=u.lastEffect,u!==null))){p=u=u.next;do{var v=p,C=v.destroy;v=v.tag,C!==void 0&&((v&2)!==0||(v&4)!==0)&&Cd(o,r,C),p=p.next}while(p!==u)}jr(n,r,o);break;case 1:if(!In&&(_a(o,r),u=o.stateNode,typeof u.componentWillUnmount=="function"))try{u.props=o.memoizedProps,u.state=o.memoizedState,u.componentWillUnmount()}catch(k){an(o,r,k)}jr(n,r,o);break;case 21:jr(n,r,o);break;case 22:o.mode&1?(In=(u=In)||o.memoizedState!==null,jr(n,r,o),In=u):jr(n,r,o);break;default:jr(n,r,o)}}function e0(n){var r=n.updateQueue;if(r!==null){n.updateQueue=null;var o=n.stateNode;o===null&&(o=n.stateNode=new Ev),r.forEach(function(u){var p=Dv.bind(null,n,u);o.has(u)||(o.add(u),u.then(p,p))})}}function Li(n,r){var o=r.deletions;if(o!==null)for(var u=0;u<o.length;u++){var p=o[u];try{var v=n,C=r,k=C;e:for(;k!==null;){switch(k.tag){case 5:An=k.stateNode,Ni=!1;break e;case 3:An=k.stateNode.containerInfo,Ni=!0;break e;case 4:An=k.stateNode.containerInfo,Ni=!0;break e}k=k.return}if(An===null)throw Error(t(160));Jm(v,C,p),An=null,Ni=!1;var z=p.alternate;z!==null&&(z.return=null),p.return=null}catch(ue){an(p,r,ue)}}if(r.subtreeFlags&12854)for(r=r.child;r!==null;)t0(r,n),r=r.sibling}function t0(n,r){var o=n.alternate,u=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(Li(r,n),qi(n),u&4){try{Do(3,n,n.return),Ql(3,n)}catch(Ye){an(n,n.return,Ye)}try{Do(5,n,n.return)}catch(Ye){an(n,n.return,Ye)}}break;case 1:Li(r,n),qi(n),u&512&&o!==null&&_a(o,o.return);break;case 5:if(Li(r,n),qi(n),u&512&&o!==null&&_a(o,o.return),n.flags&32){var p=n.stateNode;try{fe(p,"")}catch(Ye){an(n,n.return,Ye)}}if(u&4&&(p=n.stateNode,p!=null)){var v=n.memoizedProps,C=o!==null?o.memoizedProps:v,k=n.type,z=n.updateQueue;if(n.updateQueue=null,z!==null)try{k==="input"&&v.type==="radio"&&v.name!=null&&At(p,v),Ne(k,C);var ue=Ne(k,v);for(C=0;C<z.length;C+=2){var ye=z[C],Me=z[C+1];ye==="style"?_e(p,Me):ye==="dangerouslySetInnerHTML"?le(p,Me):ye==="children"?fe(p,Me):I(p,ye,Me,ue)}switch(k){case"input":pt(p,v);break;case"textarea":fn(p,v);break;case"select":var ve=p._wrapperState.wasMultiple;p._wrapperState.wasMultiple=!!v.multiple;var ze=v.value;ze!=null?Ct(p,!!v.multiple,ze,!1):ve!==!!v.multiple&&(v.defaultValue!=null?Ct(p,!!v.multiple,v.defaultValue,!0):Ct(p,!!v.multiple,v.multiple?[]:"",!1))}p[Mo]=v}catch(Ye){an(n,n.return,Ye)}}break;case 6:if(Li(r,n),qi(n),u&4){if(n.stateNode===null)throw Error(t(162));p=n.stateNode,v=n.memoizedProps;try{p.nodeValue=v}catch(Ye){an(n,n.return,Ye)}}break;case 3:if(Li(r,n),qi(n),u&4&&o!==null&&o.memoizedState.isDehydrated)try{uo(r.containerInfo)}catch(Ye){an(n,n.return,Ye)}break;case 4:Li(r,n),qi(n);break;case 13:Li(r,n),qi(n),p=n.child,p.flags&8192&&(v=p.memoizedState!==null,p.stateNode.isHidden=v,!v||p.alternate!==null&&p.alternate.memoizedState!==null||(Id=Qt())),u&4&&e0(n);break;case 22:if(ye=o!==null&&o.memoizedState!==null,n.mode&1?(In=(ue=In)||ye,Li(r,n),In=ue):Li(r,n),qi(n),u&8192){if(ue=n.memoizedState!==null,(n.stateNode.isHidden=ue)&&!ye&&(n.mode&1)!==0)for(We=n,ye=n.child;ye!==null;){for(Me=We=ye;We!==null;){switch(ve=We,ze=ve.child,ve.tag){case 0:case 11:case 14:case 15:Do(4,ve,ve.return);break;case 1:_a(ve,ve.return);var Xe=ve.stateNode;if(typeof Xe.componentWillUnmount=="function"){u=ve,o=ve.return;try{r=u,Xe.props=r.memoizedProps,Xe.state=r.memoizedState,Xe.componentWillUnmount()}catch(Ye){an(u,o,Ye)}}break;case 5:_a(ve,ve.return);break;case 22:if(ve.memoizedState!==null){r0(Me);continue}}ze!==null?(ze.return=ve,We=ze):r0(Me)}ye=ye.sibling}e:for(ye=null,Me=n;;){if(Me.tag===5){if(ye===null){ye=Me;try{p=Me.stateNode,ue?(v=p.style,typeof v.setProperty=="function"?v.setProperty("display","none","important"):v.display="none"):(k=Me.stateNode,z=Me.memoizedProps.style,C=z!=null&&z.hasOwnProperty("display")?z.display:null,k.style.display=pe("display",C))}catch(Ye){an(n,n.return,Ye)}}}else if(Me.tag===6){if(ye===null)try{Me.stateNode.nodeValue=ue?"":Me.memoizedProps}catch(Ye){an(n,n.return,Ye)}}else if((Me.tag!==22&&Me.tag!==23||Me.memoizedState===null||Me===n)&&Me.child!==null){Me.child.return=Me,Me=Me.child;continue}if(Me===n)break e;for(;Me.sibling===null;){if(Me.return===null||Me.return===n)break e;ye===Me&&(ye=null),Me=Me.return}ye===Me&&(ye=null),Me.sibling.return=Me.return,Me=Me.sibling}}break;case 19:Li(r,n),qi(n),u&4&&e0(n);break;case 21:break;default:Li(r,n),qi(n)}}function qi(n){var r=n.flags;if(r&2){try{e:{for(var o=n.return;o!==null;){if(Zm(o)){var u=o;break e}o=o.return}throw Error(t(160))}switch(u.tag){case 5:var p=u.stateNode;u.flags&32&&(fe(p,""),u.flags&=-33);var v=Qm(n);Nd(n,v,p);break;case 3:case 4:var C=u.stateNode.containerInfo,k=Qm(n);Pd(n,k,C);break;default:throw Error(t(161))}}catch(z){an(n,n.return,z)}n.flags&=-3}r&4096&&(n.flags&=-4097)}function bv(n,r,o){We=n,n0(n)}function n0(n,r,o){for(var u=(n.mode&1)!==0;We!==null;){var p=We,v=p.child;if(p.tag===22&&u){var C=p.memoizedState!==null||Zl;if(!C){var k=p.alternate,z=k!==null&&k.memoizedState!==null||In;k=Zl;var ue=In;if(Zl=C,(In=z)&&!ue)for(We=p;We!==null;)C=We,z=C.child,C.tag===22&&C.memoizedState!==null?s0(p):z!==null?(z.return=C,We=z):s0(p);for(;v!==null;)We=v,n0(v),v=v.sibling;We=p,Zl=k,In=ue}i0(n)}else(p.subtreeFlags&8772)!==0&&v!==null?(v.return=p,We=v):i0(n)}}function i0(n){for(;We!==null;){var r=We;if((r.flags&8772)!==0){var o=r.alternate;try{if((r.flags&8772)!==0)switch(r.tag){case 0:case 11:case 15:In||Ql(5,r);break;case 1:var u=r.stateNode;if(r.flags&4&&!In)if(o===null)u.componentDidMount();else{var p=r.elementType===r.type?o.memoizedProps:Pi(r.type,o.memoizedProps);u.componentDidUpdate(p,o.memoizedState,u.__reactInternalSnapshotBeforeUpdate)}var v=r.updateQueue;v!==null&&rm(r,v,u);break;case 3:var C=r.updateQueue;if(C!==null){if(o=null,r.child!==null)switch(r.child.tag){case 5:o=r.child.stateNode;break;case 1:o=r.child.stateNode}rm(r,C,o)}break;case 5:var k=r.stateNode;if(o===null&&r.flags&4){o=k;var z=r.memoizedProps;switch(r.type){case"button":case"input":case"select":case"textarea":z.autoFocus&&o.focus();break;case"img":z.src&&(o.src=z.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(r.memoizedState===null){var ue=r.alternate;if(ue!==null){var ye=ue.memoizedState;if(ye!==null){var Me=ye.dehydrated;Me!==null&&uo(Me)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(t(163))}In||r.flags&512&&Rd(r)}catch(ve){an(r,r.return,ve)}}if(r===n){We=null;break}if(o=r.sibling,o!==null){o.return=r.return,We=o;break}We=r.return}}function r0(n){for(;We!==null;){var r=We;if(r===n){We=null;break}var o=r.sibling;if(o!==null){o.return=r.return,We=o;break}We=r.return}}function s0(n){for(;We!==null;){var r=We;try{switch(r.tag){case 0:case 11:case 15:var o=r.return;try{Ql(4,r)}catch(z){an(r,o,z)}break;case 1:var u=r.stateNode;if(typeof u.componentDidMount=="function"){var p=r.return;try{u.componentDidMount()}catch(z){an(r,p,z)}}var v=r.return;try{Rd(r)}catch(z){an(r,v,z)}break;case 5:var C=r.return;try{Rd(r)}catch(z){an(r,C,z)}}}catch(z){an(r,r.return,z)}if(r===n){We=null;break}var k=r.sibling;if(k!==null){k.return=r.return,We=k;break}We=r.return}}var Tv=Math.ceil,Jl=A.ReactCurrentDispatcher,Ld=A.ReactCurrentOwner,xi=A.ReactCurrentBatchConfig,Tt=0,En=null,un=null,Cn=0,ai=0,xa=zr(0),gn=0,Io=null,Ts=0,ec=0,Dd=0,Uo=null,Kn=null,Id=0,va=1/0,xr=null,tc=!1,Ud=null,Xr=null,nc=!1,qr=null,ic=0,Fo=0,Fd=null,rc=-1,sc=0;function Vn(){return(Tt&6)!==0?Qt():rc!==-1?rc:rc=Qt()}function Yr(n){return(n.mode&1)===0?1:(Tt&2)!==0&&Cn!==0?Cn&-Cn:cv.transition!==null?(sc===0&&(sc=pn()),sc):(n=gt,n!==0||(n=window.event,n=n===void 0?16:op(n.type)),n)}function Di(n,r,o,u){if(50<Fo)throw Fo=0,Fd=null,Error(t(185));ln(n,o,u),((Tt&2)===0||n!==En)&&(n===En&&((Tt&2)===0&&(ec|=o),gn===4&&$r(n,Cn)),Zn(n,u),o===1&&Tt===0&&(r.mode&1)===0&&(va=Qt()+500,Dl&&Vr()))}function Zn(n,r){var o=n.callbackNode;Wt(n,r);var u=Mt(n,n===En?Cn:0);if(u===0)o!==null&&io(o),n.callbackNode=null,n.callbackPriority=0;else if(r=u&-u,n.callbackPriority!==r){if(o!=null&&io(o),r===1)n.tag===0?lv(o0.bind(null,n)):Xp(o0.bind(null,n)),rv(function(){(Tt&6)===0&&Vr()}),o=null;else{switch(wi(u)){case 1:o=ro;break;case 4:o=so;break;case 16:o=N;break;case 536870912:o=ce;break;default:o=N}o=m0(o,a0.bind(null,n))}n.callbackPriority=r,n.callbackNode=o}}function a0(n,r){if(rc=-1,sc=0,(Tt&6)!==0)throw Error(t(327));var o=n.callbackNode;if(ya()&&n.callbackNode!==o)return null;var u=Mt(n,n===En?Cn:0);if(u===0)return null;if((u&30)!==0||(u&n.expiredLanes)!==0||r)r=ac(n,u);else{r=u;var p=Tt;Tt|=2;var v=c0();(En!==n||Cn!==r)&&(xr=null,va=Qt()+500,Cs(n,r));do try{Rv();break}catch(k){l0(n,k)}while(!0);ed(),Jl.current=v,Tt=p,un!==null?r=0:(En=null,Cn=0,r=gn)}if(r!==0){if(r===2&&(p=It(n),p!==0&&(u=p,r=Od(n,p))),r===1)throw o=Io,Cs(n,0),$r(n,u),Zn(n,Qt()),o;if(r===6)$r(n,u);else{if(p=n.current.alternate,(u&30)===0&&!Av(p)&&(r=ac(n,u),r===2&&(v=It(n),v!==0&&(u=v,r=Od(n,v))),r===1))throw o=Io,Cs(n,0),$r(n,u),Zn(n,Qt()),o;switch(n.finishedWork=p,n.finishedLanes=u,r){case 0:case 1:throw Error(t(345));case 2:Rs(n,Kn,xr);break;case 3:if($r(n,u),(u&130023424)===u&&(r=Id+500-Qt(),10<r)){if(Mt(n,0)!==0)break;if(p=n.suspendedLanes,(p&u)!==u){Vn(),n.pingedLanes|=n.suspendedLanes&p;break}n.timeoutHandle=Gu(Rs.bind(null,n,Kn,xr),r);break}Rs(n,Kn,xr);break;case 4:if($r(n,u),(u&4194240)===u)break;for(r=n.eventTimes,p=-1;0<u;){var C=31-Le(u);v=1<<C,C=r[C],C>p&&(p=C),u&=~v}if(u=p,u=Qt()-u,u=(120>u?120:480>u?480:1080>u?1080:1920>u?1920:3e3>u?3e3:4320>u?4320:1960*Tv(u/1960))-u,10<u){n.timeoutHandle=Gu(Rs.bind(null,n,Kn,xr),u);break}Rs(n,Kn,xr);break;case 5:Rs(n,Kn,xr);break;default:throw Error(t(329))}}}return Zn(n,Qt()),n.callbackNode===o?a0.bind(null,n):null}function Od(n,r){var o=Uo;return n.current.memoizedState.isDehydrated&&(Cs(n,r).flags|=256),n=ac(n,r),n!==2&&(r=Kn,Kn=o,r!==null&&kd(r)),n}function kd(n){Kn===null?Kn=n:Kn.push.apply(Kn,n)}function Av(n){for(var r=n;;){if(r.flags&16384){var o=r.updateQueue;if(o!==null&&(o=o.stores,o!==null))for(var u=0;u<o.length;u++){var p=o[u],v=p.getSnapshot;p=p.value;try{if(!Ci(v(),p))return!1}catch{return!1}}}if(o=r.child,r.subtreeFlags&16384&&o!==null)o.return=r,r=o;else{if(r===n)break;for(;r.sibling===null;){if(r.return===null||r.return===n)return!0;r=r.return}r.sibling.return=r.return,r=r.sibling}}return!0}function $r(n,r){for(r&=~Dd,r&=~ec,n.suspendedLanes|=r,n.pingedLanes&=~r,n=n.expirationTimes;0<r;){var o=31-Le(r),u=1<<o;n[o]=-1,r&=~u}}function o0(n){if((Tt&6)!==0)throw Error(t(327));ya();var r=Mt(n,0);if((r&1)===0)return Zn(n,Qt()),null;var o=ac(n,r);if(n.tag!==0&&o===2){var u=It(n);u!==0&&(r=u,o=Od(n,u))}if(o===1)throw o=Io,Cs(n,0),$r(n,r),Zn(n,Qt()),o;if(o===6)throw Error(t(345));return n.finishedWork=n.current.alternate,n.finishedLanes=r,Rs(n,Kn,xr),Zn(n,Qt()),null}function Bd(n,r){var o=Tt;Tt|=1;try{return n(r)}finally{Tt=o,Tt===0&&(va=Qt()+500,Dl&&Vr())}}function As(n){qr!==null&&qr.tag===0&&(Tt&6)===0&&ya();var r=Tt;Tt|=1;var o=xi.transition,u=gt;try{if(xi.transition=null,gt=1,n)return n()}finally{gt=u,xi.transition=o,Tt=r,(Tt&6)===0&&Vr()}}function zd(){ai=xa.current,Yt(xa)}function Cs(n,r){n.finishedWork=null,n.finishedLanes=0;var o=n.timeoutHandle;if(o!==-1&&(n.timeoutHandle=-1,iv(o)),un!==null)for(o=un.return;o!==null;){var u=o;switch($u(u),u.tag){case 1:u=u.type.childContextTypes,u!=null&&Nl();break;case 3:ma(),Yt(qn),Yt(Nn),ld();break;case 5:ad(u);break;case 4:ma();break;case 13:Yt(Jt);break;case 19:Yt(Jt);break;case 10:td(u.type._context);break;case 22:case 23:zd()}o=o.return}if(En=n,un=n=Kr(n.current,null),Cn=ai=r,gn=0,Io=null,Dd=ec=Ts=0,Kn=Uo=null,Es!==null){for(r=0;r<Es.length;r++)if(o=Es[r],u=o.interleaved,u!==null){o.interleaved=null;var p=u.next,v=o.pending;if(v!==null){var C=v.next;v.next=p,u.next=C}o.pending=u}Es=null}return n}function l0(n,r){do{var o=un;try{if(ed(),Gl.current=ql,Wl){for(var u=en.memoizedState;u!==null;){var p=u.queue;p!==null&&(p.pending=null),u=u.next}Wl=!1}if(bs=0,Mn=mn=en=null,Co=!1,Ro=0,Ld.current=null,o===null||o.return===null){gn=1,Io=r,un=null;break}e:{var v=n,C=o.return,k=o,z=r;if(r=Cn,k.flags|=32768,z!==null&&typeof z=="object"&&typeof z.then=="function"){var ue=z,ye=k,Me=ye.tag;if((ye.mode&1)===0&&(Me===0||Me===11||Me===15)){var ve=ye.alternate;ve?(ye.updateQueue=ve.updateQueue,ye.memoizedState=ve.memoizedState,ye.lanes=ve.lanes):(ye.updateQueue=null,ye.memoizedState=null)}var ze=Dm(C);if(ze!==null){ze.flags&=-257,Im(ze,C,k,v,r),ze.mode&1&&Lm(v,ue,r),r=ze,z=ue;var Xe=r.updateQueue;if(Xe===null){var Ye=new Set;Ye.add(z),r.updateQueue=Ye}else Xe.add(z);break e}else{if((r&1)===0){Lm(v,ue,r),Hd();break e}z=Error(t(426))}}else if(Zt&&k.mode&1){var cn=Dm(C);if(cn!==null){(cn.flags&65536)===0&&(cn.flags|=256),Im(cn,C,k,v,r),Qu(ga(z,k));break e}}v=z=ga(z,k),gn!==4&&(gn=2),Uo===null?Uo=[v]:Uo.push(v),v=C;do{switch(v.tag){case 3:v.flags|=65536,r&=-r,v.lanes|=r;var re=Pm(v,z,r);im(v,re);break e;case 1:k=z;var q=v.type,oe=v.stateNode;if((v.flags&128)===0&&(typeof q.getDerivedStateFromError=="function"||oe!==null&&typeof oe.componentDidCatch=="function"&&(Xr===null||!Xr.has(oe)))){v.flags|=65536,r&=-r,v.lanes|=r;var be=Nm(v,k,r);im(v,be);break e}}v=v.return}while(v!==null)}d0(o)}catch(et){r=et,un===o&&o!==null&&(un=o=o.return);continue}break}while(!0)}function c0(){var n=Jl.current;return Jl.current=ql,n===null?ql:n}function Hd(){(gn===0||gn===3||gn===2)&&(gn=4),En===null||(Ts&268435455)===0&&(ec&268435455)===0||$r(En,Cn)}function ac(n,r){var o=Tt;Tt|=2;var u=c0();(En!==n||Cn!==r)&&(xr=null,Cs(n,r));do try{Cv();break}catch(p){l0(n,p)}while(!0);if(ed(),Tt=o,Jl.current=u,un!==null)throw Error(t(261));return En=null,Cn=0,gn}function Cv(){for(;un!==null;)u0(un)}function Rv(){for(;un!==null&&!ml();)u0(un)}function u0(n){var r=p0(n.alternate,n,ai);n.memoizedProps=n.pendingProps,r===null?d0(n):un=r,Ld.current=null}function d0(n){var r=n;do{var o=r.alternate;if(n=r.return,(r.flags&32768)===0){if(o=Sv(o,r,ai),o!==null){un=o;return}}else{if(o=Mv(o,r),o!==null){o.flags&=32767,un=o;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{gn=6,un=null;return}}if(r=r.sibling,r!==null){un=r;return}un=r=n}while(r!==null);gn===0&&(gn=5)}function Rs(n,r,o){var u=gt,p=xi.transition;try{xi.transition=null,gt=1,Pv(n,r,o,u)}finally{xi.transition=p,gt=u}return null}function Pv(n,r,o,u){do ya();while(qr!==null);if((Tt&6)!==0)throw Error(t(327));o=n.finishedWork;var p=n.finishedLanes;if(o===null)return null;if(n.finishedWork=null,n.finishedLanes=0,o===n.current)throw Error(t(177));n.callbackNode=null,n.callbackPriority=0;var v=o.lanes|o.childLanes;if(Et(n,v),n===En&&(un=En=null,Cn=0),(o.subtreeFlags&2064)===0&&(o.flags&2064)===0||nc||(nc=!0,m0(N,function(){return ya(),null})),v=(o.flags&15990)!==0,(o.subtreeFlags&15990)!==0||v){v=xi.transition,xi.transition=null;var C=gt;gt=1;var k=Tt;Tt|=4,Ld.current=null,wv(n,o),t0(o,n),Kx(Hu),_l=!!zu,Hu=zu=null,n.current=o,bv(o),vu(),Tt=k,gt=C,xi.transition=v}else n.current=o;if(nc&&(nc=!1,qr=n,ic=p),v=n.pendingLanes,v===0&&(Xr=null),Ie(o.stateNode),Zn(n,Qt()),r!==null)for(u=n.onRecoverableError,o=0;o<r.length;o++)p=r[o],u(p.value,{componentStack:p.stack,digest:p.digest});if(tc)throw tc=!1,n=Ud,Ud=null,n;return(ic&1)!==0&&n.tag!==0&&ya(),v=n.pendingLanes,(v&1)!==0?n===Fd?Fo++:(Fo=0,Fd=n):Fo=0,Vr(),null}function ya(){if(qr!==null){var n=wi(ic),r=xi.transition,o=gt;try{if(xi.transition=null,gt=16>n?16:n,qr===null)var u=!1;else{if(n=qr,qr=null,ic=0,(Tt&6)!==0)throw Error(t(331));var p=Tt;for(Tt|=4,We=n.current;We!==null;){var v=We,C=v.child;if((We.flags&16)!==0){var k=v.deletions;if(k!==null){for(var z=0;z<k.length;z++){var ue=k[z];for(We=ue;We!==null;){var ye=We;switch(ye.tag){case 0:case 11:case 15:Do(8,ye,v)}var Me=ye.child;if(Me!==null)Me.return=ye,We=Me;else for(;We!==null;){ye=We;var ve=ye.sibling,ze=ye.return;if(Km(ye),ye===ue){We=null;break}if(ve!==null){ve.return=ze,We=ve;break}We=ze}}}var Xe=v.alternate;if(Xe!==null){var Ye=Xe.child;if(Ye!==null){Xe.child=null;do{var cn=Ye.sibling;Ye.sibling=null,Ye=cn}while(Ye!==null)}}We=v}}if((v.subtreeFlags&2064)!==0&&C!==null)C.return=v,We=C;else e:for(;We!==null;){if(v=We,(v.flags&2048)!==0)switch(v.tag){case 0:case 11:case 15:Do(9,v,v.return)}var re=v.sibling;if(re!==null){re.return=v.return,We=re;break e}We=v.return}}var q=n.current;for(We=q;We!==null;){C=We;var oe=C.child;if((C.subtreeFlags&2064)!==0&&oe!==null)oe.return=C,We=oe;else e:for(C=q;We!==null;){if(k=We,(k.flags&2048)!==0)try{switch(k.tag){case 0:case 11:case 15:Ql(9,k)}}catch(et){an(k,k.return,et)}if(k===C){We=null;break e}var be=k.sibling;if(be!==null){be.return=k.return,We=be;break e}We=k.return}}if(Tt=p,Vr(),te&&typeof te.onPostCommitFiberRoot=="function")try{te.onPostCommitFiberRoot(ie,n)}catch{}u=!0}return u}finally{gt=o,xi.transition=r}}return!1}function h0(n,r,o){r=ga(o,r),r=Pm(n,r,1),n=Wr(n,r,1),r=Vn(),n!==null&&(ln(n,1,r),Zn(n,r))}function an(n,r,o){if(n.tag===3)h0(n,n,o);else for(;r!==null;){if(r.tag===3){h0(r,n,o);break}else if(r.tag===1){var u=r.stateNode;if(typeof r.type.getDerivedStateFromError=="function"||typeof u.componentDidCatch=="function"&&(Xr===null||!Xr.has(u))){n=ga(o,n),n=Nm(r,n,1),r=Wr(r,n,1),n=Vn(),r!==null&&(ln(r,1,n),Zn(r,n));break}}r=r.return}}function Nv(n,r,o){var u=n.pingCache;u!==null&&u.delete(r),r=Vn(),n.pingedLanes|=n.suspendedLanes&o,En===n&&(Cn&o)===o&&(gn===4||gn===3&&(Cn&130023424)===Cn&&500>Qt()-Id?Cs(n,0):Dd|=o),Zn(n,r)}function f0(n,r){r===0&&((n.mode&1)===0?r=1:(r=mt,mt<<=1,(mt&130023424)===0&&(mt=4194304)));var o=Vn();n=mr(n,r),n!==null&&(ln(n,r,o),Zn(n,o))}function Lv(n){var r=n.memoizedState,o=0;r!==null&&(o=r.retryLane),f0(n,o)}function Dv(n,r){var o=0;switch(n.tag){case 13:var u=n.stateNode,p=n.memoizedState;p!==null&&(o=p.retryLane);break;case 19:u=n.stateNode;break;default:throw Error(t(314))}u!==null&&u.delete(r),f0(n,o)}var p0;p0=function(n,r,o){if(n!==null)if(n.memoizedProps!==r.pendingProps||qn.current)$n=!0;else{if((n.lanes&o)===0&&(r.flags&128)===0)return $n=!1,yv(n,r,o);$n=(n.flags&131072)!==0}else $n=!1,Zt&&(r.flags&1048576)!==0&&qp(r,Ul,r.index);switch(r.lanes=0,r.tag){case 2:var u=r.type;Kl(n,r),n=r.pendingProps;var p=la(r,Nn.current);pa(r,o),p=dd(null,r,u,n,p,o);var v=hd();return r.flags|=1,typeof p=="object"&&p!==null&&typeof p.render=="function"&&p.$$typeof===void 0?(r.tag=1,r.memoizedState=null,r.updateQueue=null,Yn(u)?(v=!0,Ll(r)):v=!1,r.memoizedState=p.state!==null&&p.state!==void 0?p.state:null,rd(r),p.updater=Yl,r.stateNode=p,p._reactInternals=r,xd(r,u,n,o),r=Md(null,r,u,!0,v,o)):(r.tag=0,Zt&&v&&Yu(r),Hn(null,r,p,o),r=r.child),r;case 16:u=r.elementType;e:{switch(Kl(n,r),n=r.pendingProps,p=u._init,u=p(u._payload),r.type=u,p=r.tag=Uv(u),n=Pi(u,n),p){case 0:r=Sd(null,r,u,n,o);break e;case 1:r=zm(null,r,u,n,o);break e;case 11:r=Um(null,r,u,n,o);break e;case 14:r=Fm(null,r,u,Pi(u.type,n),o);break e}throw Error(t(306,u,""))}return r;case 0:return u=r.type,p=r.pendingProps,p=r.elementType===u?p:Pi(u,p),Sd(n,r,u,p,o);case 1:return u=r.type,p=r.pendingProps,p=r.elementType===u?p:Pi(u,p),zm(n,r,u,p,o);case 3:e:{if(Hm(r),n===null)throw Error(t(387));u=r.pendingProps,v=r.memoizedState,p=v.element,nm(n,r),Hl(r,u,null,o);var C=r.memoizedState;if(u=C.element,v.isDehydrated)if(v={element:u,isDehydrated:!1,cache:C.cache,pendingSuspenseBoundaries:C.pendingSuspenseBoundaries,transitions:C.transitions},r.updateQueue.baseState=v,r.memoizedState=v,r.flags&256){p=ga(Error(t(423)),r),r=Vm(n,r,u,o,p);break e}else if(u!==p){p=ga(Error(t(424)),r),r=Vm(n,r,u,o,p);break e}else for(si=Br(r.stateNode.containerInfo.firstChild),ri=r,Zt=!0,Ri=null,o=em(r,null,u,o),r.child=o;o;)o.flags=o.flags&-3|4096,o=o.sibling;else{if(da(),u===p){r=_r(n,r,o);break e}Hn(n,r,u,o)}r=r.child}return r;case 5:return sm(r),n===null&&Zu(r),u=r.type,p=r.pendingProps,v=n!==null?n.memoizedProps:null,C=p.children,Vu(u,p)?C=null:v!==null&&Vu(u,v)&&(r.flags|=32),Bm(n,r),Hn(n,r,C,o),r.child;case 6:return n===null&&Zu(r),null;case 13:return Gm(n,r,o);case 4:return sd(r,r.stateNode.containerInfo),u=r.pendingProps,n===null?r.child=ha(r,null,u,o):Hn(n,r,u,o),r.child;case 11:return u=r.type,p=r.pendingProps,p=r.elementType===u?p:Pi(u,p),Um(n,r,u,p,o);case 7:return Hn(n,r,r.pendingProps,o),r.child;case 8:return Hn(n,r,r.pendingProps.children,o),r.child;case 12:return Hn(n,r,r.pendingProps.children,o),r.child;case 10:e:{if(u=r.type._context,p=r.pendingProps,v=r.memoizedProps,C=p.value,jt(kl,u._currentValue),u._currentValue=C,v!==null)if(Ci(v.value,C)){if(v.children===p.children&&!qn.current){r=_r(n,r,o);break e}}else for(v=r.child,v!==null&&(v.return=r);v!==null;){var k=v.dependencies;if(k!==null){C=v.child;for(var z=k.firstContext;z!==null;){if(z.context===u){if(v.tag===1){z=gr(-1,o&-o),z.tag=2;var ue=v.updateQueue;if(ue!==null){ue=ue.shared;var ye=ue.pending;ye===null?z.next=z:(z.next=ye.next,ye.next=z),ue.pending=z}}v.lanes|=o,z=v.alternate,z!==null&&(z.lanes|=o),nd(v.return,o,r),k.lanes|=o;break}z=z.next}}else if(v.tag===10)C=v.type===r.type?null:v.child;else if(v.tag===18){if(C=v.return,C===null)throw Error(t(341));C.lanes|=o,k=C.alternate,k!==null&&(k.lanes|=o),nd(C,o,r),C=v.sibling}else C=v.child;if(C!==null)C.return=v;else for(C=v;C!==null;){if(C===r){C=null;break}if(v=C.sibling,v!==null){v.return=C.return,C=v;break}C=C.return}v=C}Hn(n,r,p.children,o),r=r.child}return r;case 9:return p=r.type,u=r.pendingProps.children,pa(r,o),p=gi(p),u=u(p),r.flags|=1,Hn(n,r,u,o),r.child;case 14:return u=r.type,p=Pi(u,r.pendingProps),p=Pi(u.type,p),Fm(n,r,u,p,o);case 15:return Om(n,r,r.type,r.pendingProps,o);case 17:return u=r.type,p=r.pendingProps,p=r.elementType===u?p:Pi(u,p),Kl(n,r),r.tag=1,Yn(u)?(n=!0,Ll(r)):n=!1,pa(r,o),Cm(r,u,p),xd(r,u,p,o),Md(null,r,u,!0,n,o);case 19:return jm(n,r,o);case 22:return km(n,r,o)}throw Error(t(156,r.tag))};function m0(n,r){return xs(n,r)}function Iv(n,r,o,u){this.tag=n,this.key=o,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=r,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=u,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function vi(n,r,o,u){return new Iv(n,r,o,u)}function Vd(n){return n=n.prototype,!(!n||!n.isReactComponent)}function Uv(n){if(typeof n=="function")return Vd(n)?1:0;if(n!=null){if(n=n.$$typeof,n===G)return 11;if(n===Z)return 14}return 2}function Kr(n,r){var o=n.alternate;return o===null?(o=vi(n.tag,r,n.key,n.mode),o.elementType=n.elementType,o.type=n.type,o.stateNode=n.stateNode,o.alternate=n,n.alternate=o):(o.pendingProps=r,o.type=n.type,o.flags=0,o.subtreeFlags=0,o.deletions=null),o.flags=n.flags&14680064,o.childLanes=n.childLanes,o.lanes=n.lanes,o.child=n.child,o.memoizedProps=n.memoizedProps,o.memoizedState=n.memoizedState,o.updateQueue=n.updateQueue,r=n.dependencies,o.dependencies=r===null?null:{lanes:r.lanes,firstContext:r.firstContext},o.sibling=n.sibling,o.index=n.index,o.ref=n.ref,o}function oc(n,r,o,u,p,v){var C=2;if(u=n,typeof n=="function")Vd(n)&&(C=1);else if(typeof n=="string")C=5;else e:switch(n){case U:return Ps(o.children,p,v,r);case b:C=8,p|=8;break;case D:return n=vi(12,o,r,p|2),n.elementType=D,n.lanes=v,n;case J:return n=vi(13,o,r,p),n.elementType=J,n.lanes=v,n;case H:return n=vi(19,o,r,p),n.elementType=H,n.lanes=v,n;case ne:return lc(o,p,v,r);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case B:C=10;break e;case V:C=9;break e;case G:C=11;break e;case Z:C=14;break e;case he:C=16,u=null;break e}throw Error(t(130,n==null?n:typeof n,""))}return r=vi(C,o,r,p),r.elementType=n,r.type=u,r.lanes=v,r}function Ps(n,r,o,u){return n=vi(7,n,u,r),n.lanes=o,n}function lc(n,r,o,u){return n=vi(22,n,u,r),n.elementType=ne,n.lanes=o,n.stateNode={isHidden:!1},n}function Gd(n,r,o){return n=vi(6,n,null,r),n.lanes=o,n}function Wd(n,r,o){return r=vi(4,n.children!==null?n.children:[],n.key,r),r.lanes=o,r.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},r}function Fv(n,r,o,u,p){this.tag=r,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=ke(0),this.expirationTimes=ke(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=ke(0),this.identifierPrefix=u,this.onRecoverableError=p,this.mutableSourceEagerHydrationData=null}function jd(n,r,o,u,p,v,C,k,z){return n=new Fv(n,r,o,k,z),r===1?(r=1,v===!0&&(r|=8)):r=0,v=vi(3,null,null,r),n.current=v,v.stateNode=n,v.memoizedState={element:u,isDehydrated:o,cache:null,transitions:null,pendingSuspenseBoundaries:null},rd(v),n}function Ov(n,r,o){var u=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:L,key:u==null?null:""+u,children:n,containerInfo:r,implementation:o}}function g0(n){if(!n)return Hr;n=n._reactInternals;e:{if(zn(n)!==n||n.tag!==1)throw Error(t(170));var r=n;do{switch(r.tag){case 3:r=r.stateNode.context;break e;case 1:if(Yn(r.type)){r=r.stateNode.__reactInternalMemoizedMergedChildContext;break e}}r=r.return}while(r!==null);throw Error(t(171))}if(n.tag===1){var o=n.type;if(Yn(o))return Wp(n,o,r)}return r}function _0(n,r,o,u,p,v,C,k,z){return n=jd(o,u,!0,n,p,v,C,k,z),n.context=g0(null),o=n.current,u=Vn(),p=Yr(o),v=gr(u,p),v.callback=r??null,Wr(o,v,p),n.current.lanes=p,ln(n,p,u),Zn(n,u),n}function cc(n,r,o,u){var p=r.current,v=Vn(),C=Yr(p);return o=g0(o),r.context===null?r.context=o:r.pendingContext=o,r=gr(v,C),r.payload={element:n},u=u===void 0?null:u,u!==null&&(r.callback=u),n=Wr(p,r,C),n!==null&&(Di(n,p,C,v),zl(n,p,C)),C}function uc(n){if(n=n.current,!n.child)return null;switch(n.child.tag){case 5:return n.child.stateNode;default:return n.child.stateNode}}function x0(n,r){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var o=n.retryLane;n.retryLane=o!==0&&o<r?o:r}}function Xd(n,r){x0(n,r),(n=n.alternate)&&x0(n,r)}function kv(){return null}var v0=typeof reportError=="function"?reportError:function(n){console.error(n)};function qd(n){this._internalRoot=n}dc.prototype.render=qd.prototype.render=function(n){var r=this._internalRoot;if(r===null)throw Error(t(409));cc(n,r,null,null)},dc.prototype.unmount=qd.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var r=n.containerInfo;As(function(){cc(null,n,null,null)}),r[dr]=null}};function dc(n){this._internalRoot=n}dc.prototype.unstable_scheduleHydration=function(n){if(n){var r=bi();n={blockedOn:null,target:n,priority:r};for(var o=0;o<Fr.length&&r!==0&&r<Fr[o].priority;o++);Fr.splice(o,0,n),o===0&&sp(n)}};function Yd(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function hc(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function y0(){}function Bv(n,r,o,u,p){if(p){if(typeof u=="function"){var v=u;u=function(){var ue=uc(C);v.call(ue)}}var C=_0(r,u,n,0,null,!1,!1,"",y0);return n._reactRootContainer=C,n[dr]=C.current,yo(n.nodeType===8?n.parentNode:n),As(),C}for(;p=n.lastChild;)n.removeChild(p);if(typeof u=="function"){var k=u;u=function(){var ue=uc(z);k.call(ue)}}var z=jd(n,0,!1,null,null,!1,!1,"",y0);return n._reactRootContainer=z,n[dr]=z.current,yo(n.nodeType===8?n.parentNode:n),As(function(){cc(r,z,o,u)}),z}function fc(n,r,o,u,p){var v=o._reactRootContainer;if(v){var C=v;if(typeof p=="function"){var k=p;p=function(){var z=uc(C);k.call(z)}}cc(r,C,n,p)}else C=Bv(o,r,n,p,u);return uc(C)}ur=function(n){switch(n.tag){case 3:var r=n.stateNode;if(r.current.memoizedState.isDehydrated){var o=He(r.pendingLanes);o!==0&&(Pn(r,o|1),Zn(r,Qt()),(Tt&6)===0&&(va=Qt()+500,Vr()))}break;case 13:As(function(){var u=mr(n,1);if(u!==null){var p=Vn();Di(u,n,1,p)}}),Xd(n,1)}},Nt=function(n){if(n.tag===13){var r=mr(n,134217728);if(r!==null){var o=Vn();Di(r,n,134217728,o)}Xd(n,134217728)}},Kt=function(n){if(n.tag===13){var r=Yr(n),o=mr(n,r);if(o!==null){var u=Vn();Di(o,n,r,u)}Xd(n,r)}},bi=function(){return gt},Ot=function(n,r){var o=gt;try{return gt=n,r()}finally{gt=o}},tt=function(n,r,o){switch(r){case"input":if(pt(n,o),r=o.name,o.type==="radio"&&r!=null){for(o=n;o.parentNode;)o=o.parentNode;for(o=o.querySelectorAll("input[name="+JSON.stringify(""+r)+'][type="radio"]'),r=0;r<o.length;r++){var u=o[r];if(u!==n&&u.form===n.form){var p=Pl(u);if(!p)throw Error(t(90));dt(u),pt(u,p)}}}break;case"textarea":fn(n,o);break;case"select":r=o.value,r!=null&&Ct(n,!!o.multiple,r,!1)}},Oe=Bd,xe=As;var zv={usingClientEntryPoint:!1,Events:[Eo,aa,Pl,ge,Re,Bd]},Oo={findFiberByHostInstance:vs,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Hv={bundleType:Oo.bundleType,version:Oo.version,rendererPackageName:Oo.rendererPackageName,rendererConfig:Oo.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:A.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=_s(n),n===null?null:n.stateNode},findFiberByHostInstance:Oo.findFiberByHostInstance||kv,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var pc=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!pc.isDisabled&&pc.supportsFiber)try{ie=pc.inject(Hv),te=pc}catch{}}return Qn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=zv,Qn.createPortal=function(n,r){var o=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Yd(r))throw Error(t(200));return Ov(n,r,null,o)},Qn.createRoot=function(n,r){if(!Yd(n))throw Error(t(299));var o=!1,u="",p=v0;return r!=null&&(r.unstable_strictMode===!0&&(o=!0),r.identifierPrefix!==void 0&&(u=r.identifierPrefix),r.onRecoverableError!==void 0&&(p=r.onRecoverableError)),r=jd(n,1,!1,null,null,o,!1,u,p),n[dr]=r.current,yo(n.nodeType===8?n.parentNode:n),new qd(r)},Qn.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var r=n._reactInternals;if(r===void 0)throw typeof n.render=="function"?Error(t(188)):(n=Object.keys(n).join(","),Error(t(268,n)));return n=_s(r),n=n===null?null:n.stateNode,n},Qn.flushSync=function(n){return As(n)},Qn.hydrate=function(n,r,o){if(!hc(r))throw Error(t(200));return fc(null,n,r,!0,o)},Qn.hydrateRoot=function(n,r,o){if(!Yd(n))throw Error(t(405));var u=o!=null&&o.hydratedSources||null,p=!1,v="",C=v0;if(o!=null&&(o.unstable_strictMode===!0&&(p=!0),o.identifierPrefix!==void 0&&(v=o.identifierPrefix),o.onRecoverableError!==void 0&&(C=o.onRecoverableError)),r=_0(r,null,n,1,o??null,p,!1,v,C),n[dr]=r.current,yo(n),u)for(n=0;n<u.length;n++)o=u[n],p=o._getVersion,p=p(o._source),r.mutableSourceEagerHydrationData==null?r.mutableSourceEagerHydrationData=[o,p]:r.mutableSourceEagerHydrationData.push(o,p);return new dc(r)},Qn.render=function(n,r,o){if(!hc(r))throw Error(t(200));return fc(null,n,r,!1,o)},Qn.unmountComponentAtNode=function(n){if(!hc(n))throw Error(t(40));return n._reactRootContainer?(As(function(){fc(null,null,n,!1,function(){n._reactRootContainer=null,n[dr]=null})}),!0):!1},Qn.unstable_batchedUpdates=Bd,Qn.unstable_renderSubtreeIntoContainer=function(n,r,o,u){if(!hc(o))throw Error(t(200));if(n==null||n._reactInternals===void 0)throw Error(t(38));return fc(n,r,o,!1,u)},Qn.version="18.3.1-next-f1338f8080-20240426",Qn}var R0;function m_(){if(R0)return Qd.exports;R0=1;function s(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s)}catch(e){console.error(e)}}return s(),Qd.exports=Kv(),Qd.exports}var P0;function Zv(){if(P0)return gc;P0=1;var s=m_();return gc.createRoot=s.createRoot,gc.hydrateRoot=s.hydrateRoot,gc}var Qv=Zv();const Jv=p_(Qv),ey=on.createContext(void 0),ty=({client:s,children:e})=>(on.useEffect(()=>(s.mount(),()=>{s.unmount()}),[s]),E.jsx(ey.Provider,{value:s,children:e})),ny={setTimeout:(s,e)=>setTimeout(s,e),clearTimeout:s=>clearTimeout(s),setInterval:(s,e)=>setInterval(s,e),clearInterval:s=>clearInterval(s)};var ss,Lf,s_,iy=(s_=class{constructor(){St(this,ss,ny);St(this,Lf,!1)}setTimeoutProvider(s){st(this,ss,s)}setTimeout(s,e){return me(this,ss).setTimeout(s,e)}clearTimeout(s){me(this,ss).clearTimeout(s)}setInterval(s,e){return me(this,ss).setInterval(s,e)}clearInterval(s){me(this,ss).clearInterval(s)}},ss=new WeakMap,Lf=new WeakMap,s_);const Bh=new iy;function ry(s){setTimeout(s,0)}const sy=typeof window>"u"||"Deno"in globalThis;function Ei(){}function ay(s,e){return typeof s=="function"?s(e):s}function oy(s){return typeof s=="number"&&s>=0&&s!==1/0}function ly(s,e){return Math.max(s+(e||0)-Date.now(),0)}function Jo(s,e){return typeof s=="function"?s(e):s}function N0(s,e){const{type:t="all",exact:i,fetchStatus:a,predicate:l,queryKey:c,stale:d}=s;if(c){if(i){if(e.queryHash!==If(c,e.options))return!1}else if(!Za(e.queryKey,c))return!1}if(t!=="all"){const h=e.isActive();if(t==="active"&&!h||t==="inactive"&&h)return!1}return!(typeof d=="boolean"&&e.isStale()!==d||a&&a!==e.state.fetchStatus||l&&!l(e))}function L0(s,e){const{exact:t,status:i,predicate:a,mutationKey:l}=s;if(l){if(!e.options.mutationKey)return!1;if(t){if(nl(e.options.mutationKey)!==nl(l))return!1}else if(!Za(e.options.mutationKey,l))return!1}return!(i&&e.state.status!==i||a&&!a(e))}function If(s,e){return((e==null?void 0:e.queryKeyHashFn)||nl)(s)}function nl(s){return JSON.stringify(s,(e,t)=>zh(t)?Object.keys(t).sort().reduce((i,a)=>(i[a]=t[a],i),{}):t)}function Za(s,e){if(s===e)return!0;if(typeof s!=typeof e)return!1;if(s&&e&&typeof s=="object"&&typeof e=="object"){if(Array.isArray(s)&&Array.isArray(e)){if(e.length>s.length)return!1;for(let i=0;i<e.length;i++)if(!Za(s[i],e[i]))return!1;return!0}const t=Object.keys(e);for(const i of t)if(!Za(s[i],e[i]))return!1;return!0}return!1}const cy=Object.prototype.hasOwnProperty;function g_(s,e,t=0){if(s===e)return s;if(t>500)return e;const i=D0(s)&&D0(e);if(!i&&!(zh(s)&&zh(e)))return e;const a=(i?s:Object.keys(s)).length,l=i?e:Object.keys(e),c=l.length,d=i?new Array(c):{};let h=0;for(let f=0;f<c;f++){const _=i?f:l[f],m=s[_],g=e[_];if(m===g){d[_]=m,(i?f<a:cy.call(s,_))&&h++;continue}if(m===null||g===null||typeof m!="object"||typeof g!="object"){d[_]=g;continue}const y=g_(m,g,t+1);d[_]=y,y===m&&h++}return a===c&&h===a?s:d}function D0(s){return Array.isArray(s)&&s.length===Object.keys(s).length}function zh(s){if(!I0(s))return!1;const e=Object.getPrototypeOf(s),t=e==null?void 0:e.constructor;if(t===void 0)return!0;if(typeof t!="function")return!1;const i=t.prototype;return!(!I0(i)||!i.hasOwnProperty("isPrototypeOf")||e!==Object.prototype)}function I0(s){return Object.prototype.toString.call(s)==="[object Object]"}function uy(s){return new Promise(e=>{Bh.setTimeout(e,s)})}function dy(s,e,t){return typeof t.structuralSharing=="function"?t.structuralSharing(s,e):t.structuralSharing!==!1?g_(s,e):e}function hy(s,e,t=0){const i=[...s,e];return t&&i.length>t?i.slice(1):i}function fy(s,e,t=0){const i=[e,...s];return t&&i.length>t?i.slice(0,-1):i}const Uf=Symbol();function __(s,e){return!s.queryFn&&(e!=null&&e.initialPromise)?()=>e.initialPromise:!s.queryFn||s.queryFn===Uf?()=>Promise.reject(new Error(`Missing queryFn: '${s.queryHash}'`)):s.queryFn}function py(s,e,t){let i=!1,a;return Object.defineProperty(s,"signal",{enumerable:!0,get:()=>(a??(a=e()),i||(i=!0,a.aborted?t():a.addEventListener("abort",t,{once:!0})),a)}),s}let my=()=>sy;const x_=()=>my();var hu=class{constructor(){this.listeners=new Set,this.subscribe=this.subscribe.bind(this)}subscribe(s){return this.listeners.add(s),this.onSubscribe(),()=>{this.listeners.delete(s),this.onUnsubscribe()}}hasListeners(){return this.listeners.size>0}onSubscribe(){}onUnsubscribe(){}},Bs,as,Va,a_,gy=(a_=class extends hu{constructor(){super();St(this,Bs);St(this,as);St(this,Va);st(this,Va,e=>{if(typeof window<"u"&&window.addEventListener){const t=()=>e();return window.addEventListener("visibilitychange",t,!1),()=>{window.removeEventListener("visibilitychange",t)}}})}onSubscribe(){me(this,as)||this.setEventListener(me(this,Va))}onUnsubscribe(){var e;this.hasListeners()||((e=me(this,as))==null||e.call(this),st(this,as,void 0))}setEventListener(e){var t;st(this,Va,e),(t=me(this,as))==null||t.call(this),st(this,as,e(i=>{typeof i=="boolean"?this.setFocused(i):this.onFocus()}))}setFocused(e){me(this,Bs)!==e&&(st(this,Bs,e),this.onFocus())}onFocus(){const e=this.isFocused();this.listeners.forEach(t=>{t(e)})}isFocused(){var e;return typeof me(this,Bs)=="boolean"?me(this,Bs):((e=globalThis.document)==null?void 0:e.visibilityState)!=="hidden"}},Bs=new WeakMap,as=new WeakMap,Va=new WeakMap,a_);const v_=new gy,_y=ry;function xy(){let s=[],e=0,t=d=>{d()},i=d=>{d()},a=_y;const l=d=>{e?s.push(d):a(()=>{t(d)})},c=()=>{const d=s;s=[],d.length&&a(()=>{i(()=>{d.forEach(h=>{t(h)})})})};return{batch:d=>{let h;e++;try{h=d()}finally{e--,e||c()}return h},batchCalls:d=>(...h)=>{l(()=>{d(...h)})},schedule:l,setNotifyFunction:d=>{t=d},setBatchNotifyFunction:d=>{i=d},setScheduler:d=>{a=d}}}const Wn=xy();var Ga,os,Wa,o_,vy=(o_=class extends hu{constructor(){super();St(this,Ga,!0);St(this,os);St(this,Wa);st(this,Wa,e=>{if(typeof window<"u"&&window.addEventListener){const t=()=>e(!0),i=()=>e(!1);return window.addEventListener("online",t,!1),window.addEventListener("offline",i,!1),()=>{window.removeEventListener("online",t),window.removeEventListener("offline",i)}}})}onSubscribe(){me(this,os)||this.setEventListener(me(this,Wa))}onUnsubscribe(){var e;this.hasListeners()||((e=me(this,os))==null||e.call(this),st(this,os,void 0))}setEventListener(e){var t;st(this,Wa,e),(t=me(this,os))==null||t.call(this),st(this,os,e(this.setOnline.bind(this)))}setOnline(e){me(this,Ga)!==e&&(st(this,Ga,e),this.listeners.forEach(t=>{t(e)}))}isOnline(){return me(this,Ga)}},Ga=new WeakMap,os=new WeakMap,Wa=new WeakMap,o_);const eu=new vy;function yy(s){return Math.min(1e3*2**s,3e4)}function y_(s){return(s??"online")==="online"?eu.isOnline():!0}var Hh=class extends Error{constructor(s){super("CancelledError"),this.revert=s==null?void 0:s.revert,this.silent=s==null?void 0:s.silent}};function S_(s){let e=!1,t=0,i,a="pending",l,c;const d=new Promise((R,I)=>{l=R,c=I});d.catch(Ei);const h=()=>a!=="pending",f=R=>{var I;if(!h()){const A=new Hh(R);T(A),(I=s.onCancel)==null||I.call(s,A)}},_=()=>{e=!0},m=()=>{e=!1},g=()=>v_.isFocused()&&(s.networkMode==="always"||eu.isOnline())&&s.canRun(),y=()=>y_(s.networkMode)&&s.canRun(),M=R=>{h()||(i==null||i(),a="resolved",l(R))},T=R=>{h()||(i==null||i(),a="rejected",c(R))},S=()=>new Promise(R=>{var I;i=A=>{(h()||g())&&R(A)},(I=s.onPause)==null||I.call(s)}).then(()=>{var R;i=void 0,h()||(R=s.onContinue)==null||R.call(s)}),x=()=>{if(h())return;let R;const I=t===0?s.initialPromise:void 0;try{R=I??s.fn()}catch(A){R=Promise.reject(A)}Promise.resolve(R).then(M).catch(A=>{var D;if(h())return;const P=s.retry??(x_()?0:3),L=s.retryDelay??yy,U=typeof L=="function"?L(t,A):L,b=P===!0||typeof P=="number"&&t<P||typeof P=="function"&&P(t,A);if(e||!b){T(A);return}t++,(D=s.onFail)==null||D.call(s,t,A),uy(U).then(()=>g()?void 0:S()).then(()=>{e?T(A):x()})})};return{promise:d,status:()=>a,cancel:f,continue:()=>(i==null||i(),d),cancelRetry:_,continueRetry:m,canStart:y,start:()=>(y()?x():S().then(x),d)}}var zs,l_,M_=(l_=class{constructor(){St(this,zs)}destroy(){this.clearGcTimeout()}scheduleGc(){this.clearGcTimeout(),oy(this.gcTime)&&st(this,zs,Bh.setTimeout(()=>{this.optionalRemove()},this.gcTime))}updateGcTime(s){this.gcTime=Math.max(this.gcTime||0,s??(x_()?1/0:3e5))}clearGcTimeout(){me(this,zs)!==void 0&&(Bh.clearTimeout(me(this,zs)),st(this,zs,void 0))}},zs=new WeakMap,l_);function Sy(s){return{onFetch:(e,t)=>{var _,m,g,y,M;const i=e.options,a=(g=(m=(_=e.fetchOptions)==null?void 0:_.meta)==null?void 0:m.fetchMore)==null?void 0:g.direction,l=((y=e.state.data)==null?void 0:y.pages)||[],c=((M=e.state.data)==null?void 0:M.pageParams)||[];let d={pages:[],pageParams:[]},h=0;const f=async()=>{let T=!1;const S=I=>{py(I,()=>e.signal,()=>T=!0)},x=__(e.options,e.fetchOptions),R=async(I,A,P)=>{if(T)return Promise.reject(e.signal.reason);if(A==null&&I.pages.length)return Promise.resolve(I);const U=(()=>{const V={client:e.client,queryKey:e.queryKey,pageParam:A,direction:P?"backward":"forward",meta:e.options.meta};return S(V),V})(),b=await x(U),{maxPages:D}=e.options,B=P?fy:hy;return{pages:B(I.pages,b,D),pageParams:B(I.pageParams,A,D)}};if(a&&l.length){const I=a==="backward",A=I?My:U0,P={pages:l,pageParams:c};d=await R(P,A(i,P),I)}else{const I=s??l.length;do{const A=h===0?c[0]??i.initialPageParam:U0(i,d);if(h>0&&A==null)break;d=await R(d,A),h++}while(h<I)}return d};e.options.persister?e.fetchFn=()=>{var T,S;return(S=(T=e.options).persister)==null?void 0:S.call(T,f,{client:e.client,queryKey:e.queryKey,meta:e.options.meta,signal:e.signal},t)}:e.fetchFn=f}}}function U0(s,{pages:e,pageParams:t}){const i=e.length-1;return e.length>0?s.getNextPageParam(e[i],e,t[i],t):void 0}function My(s,{pages:e,pageParams:t}){var i;return e.length>0?(i=s.getPreviousPageParam)==null?void 0:i.call(s,e[0],e,t[0],t):void 0}var ja,Hs,Xa,Mi,Vs,xn,ll,Gs,Oi,br,c_,Ey=(c_=class extends M_{constructor(e){super();St(this,Oi);St(this,ja);St(this,Hs);St(this,Xa);St(this,Mi);St(this,Vs);St(this,xn);St(this,ll);St(this,Gs);st(this,Gs,!1),st(this,ll,e.defaultOptions),this.setOptions(e.options),this.observers=[],st(this,Vs,e.client),st(this,Mi,me(this,Vs).getQueryCache()),this.queryKey=e.queryKey,this.queryHash=e.queryHash,st(this,Hs,O0(this.options)),this.state=e.state??me(this,Hs),this.scheduleGc()}get meta(){return this.options.meta}get queryType(){return me(this,ja)}get promise(){var e;return(e=me(this,xn))==null?void 0:e.promise}setOptions(e){if(this.options={...me(this,ll),...e},e!=null&&e._type&&st(this,ja,e._type),this.updateGcTime(this.options.gcTime),this.state&&this.state.data===void 0){const t=O0(this.options);t.data!==void 0&&(this.setState(F0(t.data,t.dataUpdatedAt)),st(this,Hs,t))}}optionalRemove(){!this.observers.length&&this.state.fetchStatus==="idle"&&me(this,Mi).remove(this)}setData(e,t){const i=dy(this.state.data,e,this.options);return Un(this,Oi,br).call(this,{data:i,type:"success",dataUpdatedAt:t==null?void 0:t.updatedAt,manual:t==null?void 0:t.manual}),i}setState(e){Un(this,Oi,br).call(this,{type:"setState",state:e})}cancel(e){var i,a;const t=(i=me(this,xn))==null?void 0:i.promise;return(a=me(this,xn))==null||a.cancel(e),t?t.then(Ei).catch(Ei):Promise.resolve()}destroy(){super.destroy(),this.cancel({silent:!0})}get resetState(){return me(this,Hs)}reset(){this.destroy(),this.setState(this.resetState)}isActive(){return this.observers.some(e=>Jo(e.options.enabled,this)!==!1)}isDisabled(){return this.getObserversCount()>0?!this.isActive():this.options.queryFn===Uf||!this.isFetched()}isFetched(){return this.state.dataUpdateCount+this.state.errorUpdateCount>0}isStatic(){return this.getObserversCount()>0?this.observers.some(e=>Jo(e.options.staleTime,this)==="static"):!1}isStale(){return this.getObserversCount()>0?this.observers.some(e=>e.getCurrentResult().isStale):this.state.data===void 0||this.state.isInvalidated}isStaleByTime(e=0){return this.state.data===void 0?!0:e==="static"?!1:this.state.isInvalidated?!0:!ly(this.state.dataUpdatedAt,e)}onFocus(){var e,t;(e=this.observers.find(i=>i.shouldFetchOnWindowFocus()))==null||e.refetch({cancelRefetch:!1}),(t=me(this,xn))==null||t.continue()}onOnline(){var e,t;(e=this.observers.find(i=>i.shouldFetchOnReconnect()))==null||e.refetch({cancelRefetch:!1}),(t=me(this,xn))==null||t.continue()}addObserver(e){this.observers.includes(e)||(this.observers.push(e),this.clearGcTimeout(),me(this,Mi).notify({type:"observerAdded",query:this,observer:e}))}removeObserver(e){const t=this.observers.indexOf(e);t!==-1&&(this.observers.splice(t,1),this.observers.length||(me(this,xn)&&(me(this,Gs)||this.state.fetchStatus==="paused"&&this.state.status==="pending"?me(this,xn).cancel({revert:!0}):me(this,xn).cancelRetry()),this.scheduleGc()),me(this,Mi).notify({type:"observerRemoved",query:this,observer:e}))}getObserversCount(){return this.observers.length}invalidate(){this.state.isInvalidated||Un(this,Oi,br).call(this,{type:"invalidate"})}async fetch(e,t){var f,_,m,g,y,M,T,S,x,R,I,A;if(this.state.fetchStatus!=="idle"&&((f=me(this,xn))==null?void 0:f.status())!=="rejected"){if(this.state.data!==void 0&&(t!=null&&t.cancelRefetch))this.cancel({silent:!0});else if(me(this,xn))return me(this,xn).continueRetry(),me(this,xn).promise}if(e&&this.setOptions(e),!this.options.queryFn){const P=this.observers.find(L=>L.options.queryFn);P&&this.setOptions(P.options)}const i=new AbortController,a=P=>{Object.defineProperty(P,"signal",{enumerable:!0,get:()=>(st(this,Gs,!0),i.signal)})},l=()=>{const P=__(this.options,t),U=(()=>{const b={client:me(this,Vs),queryKey:this.queryKey,meta:this.meta};return a(b),b})();return st(this,Gs,!1),this.options.persister?this.options.persister(P,U,this):P(U)},d=(()=>{const P={fetchOptions:t,options:this.options,queryKey:this.queryKey,client:me(this,Vs),state:this.state,fetchFn:l};return a(P),P})();(_=me(this,ja)==="infinite"?Sy(this.options.pages):this.options.behavior)==null||_.onFetch(d,this),st(this,Xa,this.state),(this.state.fetchStatus==="idle"||this.state.fetchMeta!==((m=d.fetchOptions)==null?void 0:m.meta))&&Un(this,Oi,br).call(this,{type:"fetch",meta:(g=d.fetchOptions)==null?void 0:g.meta});const h=st(this,xn,S_({initialPromise:t==null?void 0:t.initialPromise,fn:d.fetchFn,onCancel:P=>{P instanceof Hh&&P.revert&&this.setState({...me(this,Xa),fetchStatus:"idle"}),i.abort()},onFail:(P,L)=>{Un(this,Oi,br).call(this,{type:"failed",failureCount:P,error:L})},onPause:()=>{Un(this,Oi,br).call(this,{type:"pause"})},onContinue:()=>{Un(this,Oi,br).call(this,{type:"continue"})},retry:d.options.retry,retryDelay:d.options.retryDelay,networkMode:d.options.networkMode,canRun:()=>!0}));try{const P=await h.start();if(P===void 0)throw new Error(`${this.queryHash} data is undefined`);return this.setData(P),(M=(y=me(this,Mi).config).onSuccess)==null||M.call(y,P,this),(S=(T=me(this,Mi).config).onSettled)==null||S.call(T,P,this.state.error,this),P}catch(P){if(P instanceof Hh){if(P.silent)return me(this,xn).promise;if(P.revert){if(this.state.data===void 0)throw P;return this.state.data}}throw Un(this,Oi,br).call(this,{type:"error",error:P}),(R=(x=me(this,Mi).config).onError)==null||R.call(x,P,this),(A=(I=me(this,Mi).config).onSettled)==null||A.call(I,this.state.data,P,this),P}finally{me(this,xn)===h&&st(this,xn,void 0),this.scheduleGc()}}},ja=new WeakMap,Hs=new WeakMap,Xa=new WeakMap,Mi=new WeakMap,Vs=new WeakMap,xn=new WeakMap,ll=new WeakMap,Gs=new WeakMap,Oi=new WeakSet,br=function(e){const t=i=>{switch(e.type){case"failed":return{...i,fetchFailureCount:e.failureCount,fetchFailureReason:e.error};case"pause":return{...i,fetchStatus:"paused"};case"continue":return{...i,fetchStatus:"fetching"};case"fetch":return{...i,...wy(i.data,this.options),fetchMeta:e.meta??null};case"success":const a={...i,...F0(e.data,e.dataUpdatedAt),dataUpdateCount:i.dataUpdateCount+1,...!e.manual&&{fetchStatus:"idle",fetchFailureCount:0,fetchFailureReason:null}};return st(this,Xa,e.manual?a:void 0),a;case"error":const l=e.error;return{...i,error:l,errorUpdateCount:i.errorUpdateCount+1,errorUpdatedAt:Date.now(),fetchFailureCount:i.fetchFailureCount+1,fetchFailureReason:l,fetchStatus:"idle",status:"error",isInvalidated:!0};case"invalidate":return{...i,isInvalidated:!0};case"setState":return{...i,...e.state}}};this.state=t(this.state),Wn.batch(()=>{this.observers.slice().forEach(i=>{i.onQueryUpdate()}),me(this,Mi).notify({query:this,type:"updated",action:e})})},c_);function wy(s,e){return{fetchFailureCount:0,fetchFailureReason:null,fetchStatus:y_(e.networkMode)?"fetching":"paused",...s===void 0&&{error:null,status:"pending"}}}function F0(s,e){return{data:s,dataUpdatedAt:e??Date.now(),error:null,isInvalidated:!1,status:"success"}}function O0(s){const e=typeof s.initialData=="function"?s.initialData():s.initialData,t=e!==void 0,i=t?typeof s.initialDataUpdatedAt=="function"?s.initialDataUpdatedAt():s.initialDataUpdatedAt:0;return{data:e,dataUpdateCount:0,dataUpdatedAt:t?i??Date.now():0,error:null,errorUpdateCount:0,errorUpdatedAt:0,fetchFailureCount:0,fetchFailureReason:null,fetchMeta:null,isInvalidated:!1,status:t?"success":"pending",fetchStatus:"idle"}}var cl,Zi,kn,Ws,Qi,is,u_,by=(u_=class extends M_{constructor(e){super();St(this,Qi);St(this,cl);St(this,Zi);St(this,kn);St(this,Ws);st(this,cl,e.client),this.mutationId=e.mutationId,st(this,kn,e.mutationCache),st(this,Zi,[]),this.state=e.state||Ty(),this.setOptions(e.options),this.scheduleGc()}setOptions(e){this.options=e,this.updateGcTime(this.options.gcTime)}get meta(){return this.options.meta}addObserver(e){me(this,Zi).includes(e)||(me(this,Zi).push(e),this.clearGcTimeout(),me(this,kn).notify({type:"observerAdded",mutation:this,observer:e}))}removeObserver(e){st(this,Zi,me(this,Zi).filter(t=>t!==e)),this.scheduleGc(),me(this,kn).notify({type:"observerRemoved",mutation:this,observer:e})}optionalRemove(){me(this,Zi).length||(this.state.status==="pending"?this.scheduleGc():me(this,kn).remove(this))}continue(){var e;return((e=me(this,Ws))==null?void 0:e.continue())??(this.state.status==="pending"?this.execute(this.state.variables):Promise.resolve())}async execute(e){var d,h,f,_,m,g,y,M,T,S,x,R,I,A,P,L,U,b;const t=()=>{Un(this,Qi,is).call(this,{type:"continue"})},i={client:me(this,cl),meta:this.options.meta,mutationKey:this.options.mutationKey},a=st(this,Ws,S_({fn:()=>this.options.mutationFn?this.options.mutationFn(e,i):Promise.reject(new Error("No mutationFn found")),onFail:(D,B)=>{Un(this,Qi,is).call(this,{type:"failed",failureCount:D,error:B})},onPause:()=>{Un(this,Qi,is).call(this,{type:"pause"})},onContinue:t,retry:this.options.retry??0,retryDelay:this.options.retryDelay,networkMode:this.options.networkMode,canRun:()=>me(this,kn).canRun(this)})),l=this.state.status==="pending",c=!a.canStart();try{if(l)t();else{Un(this,Qi,is).call(this,{type:"pending",variables:e,isPaused:c}),me(this,kn).config.onMutate&&await me(this,kn).config.onMutate(e,this,i);const B=await((h=(d=this.options).onMutate)==null?void 0:h.call(d,e,i));B!==this.state.context&&Un(this,Qi,is).call(this,{type:"pending",context:B,variables:e,isPaused:c})}const D=await a.start();return await((_=(f=me(this,kn).config).onSuccess)==null?void 0:_.call(f,D,e,this.state.context,this,i)),await((g=(m=this.options).onSuccess)==null?void 0:g.call(m,D,e,this.state.context,i)),await((M=(y=me(this,kn).config).onSettled)==null?void 0:M.call(y,D,null,this.state.variables,this.state.context,this,i)),await((S=(T=this.options).onSettled)==null?void 0:S.call(T,D,null,e,this.state.context,i)),Un(this,Qi,is).call(this,{type:"success",data:D}),D}catch(D){try{await((R=(x=me(this,kn).config).onError)==null?void 0:R.call(x,D,e,this.state.context,this,i))}catch(B){Promise.reject(B)}try{await((A=(I=this.options).onError)==null?void 0:A.call(I,D,e,this.state.context,i))}catch(B){Promise.reject(B)}try{await((L=(P=me(this,kn).config).onSettled)==null?void 0:L.call(P,void 0,D,this.state.variables,this.state.context,this,i))}catch(B){Promise.reject(B)}try{await((b=(U=this.options).onSettled)==null?void 0:b.call(U,void 0,D,e,this.state.context,i))}catch(B){Promise.reject(B)}throw Un(this,Qi,is).call(this,{type:"error",error:D}),D}finally{me(this,Ws)===a&&st(this,Ws,void 0),me(this,kn).runNext(this)}}},cl=new WeakMap,Zi=new WeakMap,kn=new WeakMap,Ws=new WeakMap,Qi=new WeakSet,is=function(e){const t=i=>{switch(e.type){case"failed":return{...i,failureCount:e.failureCount,failureReason:e.error};case"pause":return{...i,isPaused:!0};case"continue":return{...i,isPaused:!1};case"pending":return{...i,context:e.context,data:void 0,failureCount:0,failureReason:null,error:null,isPaused:e.isPaused,status:"pending",variables:e.variables,submittedAt:Date.now()};case"success":return{...i,data:e.data,failureCount:0,failureReason:null,error:null,status:"success",isPaused:!1};case"error":return{...i,data:void 0,error:e.error,failureCount:i.failureCount+1,failureReason:e.error,isPaused:!1,status:"error"}}};this.state=t(this.state),Wn.batch(()=>{me(this,Zi).forEach(i=>{i.onMutationUpdate(e)}),me(this,kn).notify({mutation:this,type:"updated",action:e})})},u_);function Ty(){return{context:void 0,data:void 0,error:null,failureCount:0,failureReason:null,isPaused:!1,status:"idle",variables:void 0,submittedAt:0}}var Ar,ki,ul,d_,Ay=(d_=class extends hu{constructor(e={}){super();St(this,Ar);St(this,ki);St(this,ul);this.config=e,st(this,Ar,new Set),st(this,ki,new Map),st(this,ul,0)}build(e,t,i){const a=new by({client:e,mutationCache:this,mutationId:++mc(this,ul)._,options:e.defaultMutationOptions(t),state:i});return this.add(a),a}add(e){me(this,Ar).add(e);const t=_c(e);if(typeof t=="string"){const i=me(this,ki).get(t);i?i.push(e):me(this,ki).set(t,[e])}this.notify({type:"added",mutation:e})}remove(e){if(me(this,Ar).delete(e)){const t=_c(e);if(typeof t=="string"){const i=me(this,ki).get(t);if(i)if(i.length>1){const a=i.indexOf(e);a!==-1&&i.splice(a,1)}else i[0]===e&&me(this,ki).delete(t)}}this.notify({type:"removed",mutation:e})}canRun(e){var i;const t=_c(e);if(typeof t=="string"){const a=(i=me(this,ki).get(t))==null?void 0:i.find(l=>l.state.status==="pending");return!a||a===e}else return!0}runNext(e){var i,a;const t=_c(e);return typeof t=="string"?((a=(i=me(this,ki).get(t))==null?void 0:i.find(l=>l!==e&&l.state.isPaused))==null?void 0:a.continue())??Promise.resolve():Promise.resolve()}clear(){Wn.batch(()=>{me(this,Ar).forEach(e=>{this.notify({type:"removed",mutation:e})}),me(this,Ar).clear(),me(this,ki).clear()})}getAll(){return Array.from(me(this,Ar))}find(e){const t={exact:!0,...e};return this.getAll().find(i=>L0(t,i))}findAll(e={}){return this.getAll().filter(t=>L0(e,t))}notify(e){Wn.batch(()=>{this.listeners.forEach(t=>{t(e)})})}resumePausedMutations(){const e=this.getAll().filter(t=>t.state.isPaused);return Wn.batch(()=>Promise.all(e.map(t=>t.continue().catch(Ei))))}},Ar=new WeakMap,ki=new WeakMap,ul=new WeakMap,d_);function _c(s){var e;return(e=s.options.scope)==null?void 0:e.id}var Ji,h_,Cy=(h_=class extends hu{constructor(e={}){super();St(this,Ji);this.config=e,st(this,Ji,new Map)}build(e,t,i){const a=t.queryKey,l=t.queryHash??If(a,t);let c=this.get(l);return c||(c=new Ey({client:e,queryKey:a,queryHash:l,options:e.defaultQueryOptions(t),state:i,defaultOptions:e.getQueryDefaults(a)}),this.add(c)),c}add(e){me(this,Ji).has(e.queryHash)||(me(this,Ji).set(e.queryHash,e),this.notify({type:"added",query:e}))}remove(e){me(this,Ji).get(e.queryHash)===e&&(e.destroy(),me(this,Ji).delete(e.queryHash),this.notify({type:"removed",query:e}))}clear(){Wn.batch(()=>{this.getAll().forEach(e=>{this.remove(e)})})}get(e){return me(this,Ji).get(e)}getAll(){return[...me(this,Ji).values()]}find(e){const t={exact:!0,...e};return this.getAll().find(i=>N0(t,i))}findAll(e={}){const t=this.getAll();return Object.keys(e).length>0?t.filter(i=>N0(e,i)):t}notify(e){Wn.batch(()=>{this.listeners.forEach(t=>{t(e)})})}onFocus(){Wn.batch(()=>{this.getAll().forEach(e=>{e.onFocus()})})}onOnline(){Wn.batch(()=>{this.getAll().forEach(e=>{e.onOnline()})})}},Ji=new WeakMap,h_),tn,ls,cs,qa,Ya,us,$a,Ka,f_,Ry=(f_=class{constructor(s={}){St(this,tn);St(this,ls);St(this,cs);St(this,qa);St(this,Ya);St(this,us);St(this,$a);St(this,Ka);st(this,tn,s.queryCache||new Cy),st(this,ls,s.mutationCache||new Ay),st(this,cs,s.defaultOptions||{}),st(this,qa,new Map),st(this,Ya,new Map),st(this,us,0)}mount(){mc(this,us)._++,me(this,us)===1&&(st(this,$a,v_.subscribe(async s=>{s&&(await this.resumePausedMutations(),me(this,tn).onFocus())})),st(this,Ka,eu.subscribe(async s=>{s&&(await this.resumePausedMutations(),me(this,tn).onOnline())})))}unmount(){var s,e;mc(this,us)._--,me(this,us)===0&&((s=me(this,$a))==null||s.call(this),st(this,$a,void 0),(e=me(this,Ka))==null||e.call(this),st(this,Ka,void 0))}isFetching(s){return me(this,tn).findAll({...s,fetchStatus:"fetching"}).length}isMutating(s){return me(this,ls).findAll({...s,status:"pending"}).length}getQueryData(s){var t;const e=this.defaultQueryOptions({queryKey:s});return(t=me(this,tn).get(e.queryHash))==null?void 0:t.state.data}ensureQueryData(s){const e=this.defaultQueryOptions(s),t=me(this,tn).build(this,e),i=t.state.data;return i===void 0?this.fetchQuery(s):(s.revalidateIfStale&&t.isStaleByTime(Jo(e.staleTime,t))&&this.prefetchQuery(e),Promise.resolve(i))}getQueriesData(s){return me(this,tn).findAll(s).map(({queryKey:e,state:t})=>[e,t.data])}setQueryData(s,e,t){var c;const i=this.defaultQueryOptions({queryKey:s}),a=(c=me(this,tn).get(i.queryHash))==null?void 0:c.state.data,l=ay(e,a);if(l!==void 0)return me(this,tn).build(this,i).setData(l,{...t,manual:!0})}setQueriesData(s,e,t){return Wn.batch(()=>me(this,tn).findAll(s).map(({queryKey:i})=>[i,this.setQueryData(i,e,t)]))}getQueryState(s){var t;const e=this.defaultQueryOptions({queryKey:s});return(t=me(this,tn).get(e.queryHash))==null?void 0:t.state}removeQueries(s){const e=me(this,tn);Wn.batch(()=>{e.findAll(s).forEach(t=>{e.remove(t)})})}resetQueries(s,e){const t=me(this,tn);return Wn.batch(()=>{const i=t.findAll(s),a=new Set(i);return i.forEach(l=>{l.reset()}),this.refetchQueries({type:"active",predicate:l=>a.has(l)},e)})}cancelQueries(s,e={}){const t={revert:!0,...e},i=Wn.batch(()=>me(this,tn).findAll(s).map(a=>a.cancel(t)));return Promise.all(i).then(Ei).catch(Ei)}invalidateQueries(s,e={}){return Wn.batch(()=>(me(this,tn).findAll(s).forEach(t=>{t.invalidate()}),(s==null?void 0:s.refetchType)==="none"?Promise.resolve():this.refetchQueries({...s,type:(s==null?void 0:s.refetchType)??(s==null?void 0:s.type)??"active"},e)))}refetchQueries(s,e={}){const t={...e,cancelRefetch:e.cancelRefetch??!0},i=Wn.batch(()=>me(this,tn).findAll(s).filter(a=>!a.isDisabled()&&!a.isStatic()).map(a=>{let l=a.fetch(void 0,t);return t.throwOnError||(l=l.catch(Ei)),a.state.fetchStatus==="paused"?Promise.resolve():l}));return Promise.all(i).then(Ei)}async query(s){const e=this.defaultQueryOptions(s);e.retry===void 0&&(e.retry=!1);const t=me(this,tn).build(this,e),i=t.isStaleByTime(Jo(e.staleTime,t))?await t.fetch(e):t.state.data,a=e.select;return a?a(i):i}fetchQuery(s){const e=this.defaultQueryOptions(s);e.retry===void 0&&(e.retry=!1);const t=me(this,tn).build(this,e);return t.isStaleByTime(Jo(e.staleTime,t))?t.fetch(e):Promise.resolve(t.state.data)}prefetchQuery(s){return this.fetchQuery(s).then(Ei).catch(Ei)}infiniteQuery(s){return s._type="infinite",this.query(s)}fetchInfiniteQuery(s){return s._type="infinite",this.fetchQuery(s)}prefetchInfiniteQuery(s){return this.fetchInfiniteQuery(s).then(Ei).catch(Ei)}ensureInfiniteQueryData(s){return s._type="infinite",this.ensureQueryData(s)}resumePausedMutations(){return eu.isOnline()?me(this,ls).resumePausedMutations():Promise.resolve()}getQueryCache(){return me(this,tn)}getMutationCache(){return me(this,ls)}getDefaultOptions(){return me(this,cs)}setDefaultOptions(s){st(this,cs,s)}setQueryDefaults(s,e){me(this,qa).set(nl(s),{queryKey:s,defaultOptions:e})}getQueryDefaults(s){const e=[...me(this,qa).values()],t={};return e.forEach(i=>{Za(s,i.queryKey)&&Object.assign(t,i.defaultOptions)}),t}setMutationDefaults(s,e){me(this,Ya).set(nl(s),{mutationKey:s,defaultOptions:e})}getMutationDefaults(s){const e=[...me(this,Ya).values()],t={};return e.forEach(i=>{Za(s,i.mutationKey)&&Object.assign(t,i.defaultOptions)}),t}defaultQueryOptions(s){if(s._defaulted)return s;const e={...me(this,cs).queries,...this.getQueryDefaults(s.queryKey),...s,_defaulted:!0};return e.queryHash||(e.queryHash=If(e.queryKey,e)),e.refetchOnReconnect===void 0&&(e.refetchOnReconnect=e.networkMode!=="always"),e.throwOnError===void 0&&(e.throwOnError=!!e.suspense),!e.networkMode&&e.persister&&(e.networkMode="offlineFirst"),e.queryFn===Uf&&(e.enabled=!1),e}defaultMutationOptions(s){return s!=null&&s._defaulted?s:{...me(this,cs).mutations,...(s==null?void 0:s.mutationKey)&&this.getMutationDefaults(s.mutationKey),...s,_defaulted:!0}}clear(){me(this,tn).clear(),me(this,ls).clear()}},tn=new WeakMap,ls=new WeakMap,cs=new WeakMap,qa=new WeakMap,Ya=new WeakMap,us=new WeakMap,$a=new WeakMap,Ka=new WeakMap,f_);const k0=s=>{let e;const t=new Set,i=(f,_)=>{const m=typeof f=="function"?f(e):f;if(!Object.is(m,e)){const g=e;e=_??(typeof m!="object"||m===null)?m:Object.assign({},e,m),t.forEach(y=>y(e,g))}},a=()=>e,d={setState:i,getState:a,getInitialState:()=>h,subscribe:f=>(t.add(f),()=>t.delete(f))},h=e=s(i,a,d);return d},Py=(s=>s?k0(s):k0),Ny=s=>s;function Ly(s,e=Ny){const t=ds.useSyncExternalStore(s.subscribe,ds.useCallback(()=>e(s.getState()),[s,e]),ds.useCallback(()=>e(s.getInitialState()),[s,e]));return ds.useDebugValue(t),t}const B0=s=>{const e=Py(s),t=i=>Ly(e,i);return Object.assign(t,e),t},Dy=(s=>s?B0(s):B0),vn=Dy((s,e)=>({catalog:[],contractsSource:"Loading...",framesById:{},selectedCanId:289,hoveredSignal:null,telemetry:{mode:"MANUAL",estop:!1,estop_reason:0,gear:"N",speed_cmd_kmh:0,speed_act_kmh:0,steer_cmd_deg:0,steer_act_deg:0,brake_cmd_kpa:0,brake_act_kpa:0,lights_cmd:{left:!1,right:!1,hazard:!1,headlight:!1,brake:!1},lights_act:{left:!1,right:!1,hazard:!1,headlight:!1,brake:!1}},totalFrames:0,uptimeSec:0,isConnected:!1,isPaused:!1,filterAccess:"all",filterBus:"all",searchQuery:"",zoomLevel:(()=>{try{const t=localStorage.getItem("can_watcher_zoom");return t?Math.min(Math.max(parseFloat(t),.6),1.8):1}catch{return 1}})(),zoomToast:null,activeView:(()=>{try{return localStorage.getItem("seer_active_view")==="cockpit"?"cockpit":"monitor"}catch{return"monitor"}})(),cameraMode:"chase",speedUnit:"km/h",setActiveView:t=>{try{localStorage.setItem("seer_active_view",t)}catch{}s({activeView:t})},toggleActiveView:()=>{const t=e().activeView==="monitor"?"cockpit":"monitor";try{localStorage.setItem("seer_active_view",t)}catch{}s({activeView:t})},setCameraMode:t=>s({cameraMode:t}),setSpeedUnit:t=>s({speedUnit:t}),setCatalog:(t,i)=>{s({catalog:t,contractsSource:i,selectedCanId:t.length>0&&!t.some(a=>a.id===e().selectedCanId)?t[0].id:e().selectedCanId})},selectMessage:t=>s({selectedCanId:t}),setHoveredSignal:t=>s({hoveredSignal:t}),togglePause:()=>s(t=>({isPaused:!t.isPaused})),setFilterAccess:t=>s({filterAccess:t}),setFilterBus:t=>s({filterBus:t}),setSearchQuery:t=>s({searchQuery:t}),setZoomLevel:t=>{s(i=>{const a=i.zoomLevel,l=typeof t=="function"?t(a):t,c=Math.round(Math.min(Math.max(l,.6),1.8)*100)/100;try{localStorage.setItem("can_watcher_zoom",String(c))}catch{}return{zoomLevel:c,zoomToast:`${Math.round(c*100)}%`}})},setZoomToast:t=>s({zoomToast:t}),initWebSocket:()=>{const i=window.location.port==="5173"?"127.0.0.1:8000":window.location.host,l=`${window.location.protocol==="https:"?"wss:":"ws:"}//${i}/ws/v1/stream`;let c=null,d=null;const h=()=>{try{c=new WebSocket(l),c.onopen=()=>{s({isConnected:!0})},c.onmessage=f=>{if(!e().isPaused)try{const _=JSON.parse(f.data),m={};if(_.total_frames!==void 0&&(m.totalFrames=_.total_frames),_.uptime_sec!==void 0&&(m.uptimeSec=_.uptime_sec),_.telemetry&&(m.telemetry=_.telemetry),_.frames&&Array.isArray(_.frames)){const g={...e().framesById};for(const y of _.frames)g[y.id]=y;m.framesById=g}s(m)}catch(_){console.error("[WS] Parse error:",_)}},c.onclose=()=>{s({isConnected:!1}),clearTimeout(d),d=setTimeout(h,1500)},c.onerror=()=>{c==null||c.close()}}catch{clearTimeout(d),d=setTimeout(h,1500)}};h()}}));/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Iy=s=>s.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),E_=(...s)=>s.filter((e,t,i)=>!!e&&e.trim()!==""&&i.indexOf(e)===t).join(" ").trim();/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var Uy={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fy=on.forwardRef(({color:s="currentColor",size:e=24,strokeWidth:t=2,absoluteStrokeWidth:i,className:a="",children:l,iconNode:c,...d},h)=>on.createElement("svg",{ref:h,...Uy,width:e,height:e,stroke:s,strokeWidth:i?Number(t)*24/Number(e):t,className:E_("lucide",a),...d},[...c.map(([f,_])=>on.createElement(f,_)),...Array.isArray(l)?l:[l]]));/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ni=(s,e)=>{const t=on.forwardRef(({className:i,...a},l)=>on.createElement(Fy,{ref:l,iconNode:e,className:E_(`lucide-${Iy(s)}`,i),...a}));return t.displayName=`${s}`,t};/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Oy=[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]],w_=ni("Activity",Oy);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ky=[["path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",key:"1tc9qg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]],By=ni("Camera",ky);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zy=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],Hy=ni("ChevronLeft",zy);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vy=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],Gy=ni("ChevronRight",Vy);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wy=[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]],z0=ni("Database",Wy);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jy=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],b_=ni("Eye",jy);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xy=[["path",{d:"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",key:"1gvzjb"}],["path",{d:"M9 18h6",key:"x1upvd"}],["path",{d:"M10 22h4",key:"ceow96"}]],qy=ni("Lightbulb",Xy);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yy=[["rect",{x:"14",y:"4",width:"4",height:"16",rx:"1",key:"zuxfzm"}],["rect",{x:"6",y:"4",width:"4",height:"16",rx:"1",key:"1okwgv"}]],$y=ni("Pause",Yy);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ky=[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]],Zy=ni("Play",Ky);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qy=[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]],Jy=ni("Search",Qy);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const eS=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M12 16h.01",key:"1drbdi"}]],tS=ni("ShieldAlert",eS);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nS=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]],iS=ni("TriangleAlert",nS);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rS=[["path",{d:"M12 20h.01",key:"zekei9"}],["path",{d:"M8.5 16.429a5 5 0 0 1 7 0",key:"1bycff"}],["path",{d:"M5 12.859a10 10 0 0 1 5.17-2.69",key:"1dl1wf"}],["path",{d:"M19 12.859a10 10 0 0 0-2.007-1.523",key:"4k23kn"}],["path",{d:"M2 8.82a15 15 0 0 1 4.177-2.643",key:"1grhjp"}],["path",{d:"M22 8.82a15 15 0 0 0-11.288-3.764",key:"z3jwby"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]],sS=ni("WifiOff",rS);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const aS=[["path",{d:"M12 20h.01",key:"zekei9"}],["path",{d:"M2 8.82a15 15 0 0 1 20 0",key:"dnpr2z"}],["path",{d:"M5 12.859a10 10 0 0 1 14 0",key:"1x1e6c"}],["path",{d:"M8.5 16.429a5 5 0 0 1 7 0",key:"1bycff"}]],oS=ni("Wifi",aS),lS=()=>{const{totalFrames:s,isConnected:e,isPaused:t,contractsSource:i,filterAccess:a,filterBus:l,searchQuery:c,togglePause:d,setFilterAccess:h,setFilterBus:f,setSearchQuery:_,catalog:m,zoomLevel:g,setZoomLevel:y,activeView:M,setActiveView:T}=vn(),S=i.includes("contracts")?"contracts/*.yaml":i;return E.jsxs("header",{className:"h-12 bg-black border-b border-neutral-800 px-4 flex items-center justify-between select-none shrink-0 z-20",children:[E.jsxs("div",{className:"flex items-center gap-3 shrink-0",children:[E.jsxs("div",{className:"flex items-baseline gap-2 shrink-0 whitespace-nowrap",children:[E.jsx("span",{className:"text-base font-black tracking-tight text-white font-mono lowercase",children:"seer"}),E.jsx("span",{className:"text-[11px] text-neutral-400 font-mono font-medium lowercase whitespace-nowrap",children:"e-trike av"})]}),E.jsx("div",{className:"h-4 w-px bg-neutral-800 mx-1"}),E.jsxs("div",{className:"flex bg-[#0a0a0a] border border-neutral-800 rounded p-0.5 text-[10px] font-mono shrink-0",children:[E.jsxs("button",{onClick:()=>T("monitor"),className:`px-2.5 py-1 rounded transition-all font-bold uppercase flex items-center gap-1.5 ${M==="monitor"?"bg-neutral-800 text-cyan-300 shadow-sm":"text-neutral-400 hover:text-neutral-200"}`,title:"CAN Bus Engineering Directory & Bit Matrix (Tab)",children:[E.jsx(z0,{className:"w-3 h-3"}),E.jsx("span",{children:"CAN MONITOR"})]}),E.jsxs("button",{onClick:()=>T("cockpit"),className:`px-2.5 py-1 rounded transition-all font-bold uppercase flex items-center gap-1.5 ${M==="cockpit"?"bg-cyan-950 text-cyan-300 border border-cyan-700/60 shadow-sm":"text-neutral-400 hover:text-neutral-200"}`,title:"3D Autonomous Driving Cockpit (Tab)",children:[E.jsx(b_,{className:"w-3 h-3 text-cyan-400"}),E.jsx("span",{children:"3D COCKPIT"})]})]}),E.jsx("div",{className:"h-4 w-px bg-neutral-800 mx-1"}),E.jsxs("div",{className:"hidden lg:flex items-center gap-2 text-[11px] font-mono bg-[#0a0a0a] px-2.5 py-1 rounded border border-neutral-800",title:`Full Contracts Source: ${i}`,children:[E.jsx(z0,{className:"w-3 h-3 text-cyan-400"}),E.jsx("span",{className:"text-neutral-400",children:"source:"}),E.jsx("span",{className:"text-neutral-200 font-medium",children:S}),E.jsx("span",{className:"text-neutral-600",children:"|"}),E.jsx("span",{className:"text-emerald-400 font-bold",children:m.length}),E.jsx("span",{className:"text-neutral-400",children:"ids"})]})]}),M==="monitor"?E.jsxs("div",{className:"flex items-center gap-3",children:[E.jsxs("div",{className:"relative w-52 xl:w-72",children:[E.jsx(Jy,{className:"w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400"}),E.jsx("input",{type:"text",value:c,onChange:x=>_(x.target.value),placeholder:"Search ID (0x121) or Name...",className:"w-full h-7 pl-8 pr-3 text-xs bg-[#0a0a0a] text-neutral-100 placeholder-neutral-500 border border-neutral-800 rounded focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"}),c&&E.jsx("button",{onClick:()=>_(""),className:"absolute right-2 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white",children:"×"})]}),E.jsx("div",{className:"flex rounded bg-[#0a0a0a] p-0.5 border border-neutral-800 text-[10px] font-mono",children:["all","rx","tx"].map(x=>E.jsx("button",{onClick:()=>h(x),className:`px-2 py-0.5 rounded transition-all font-semibold uppercase ${a===x?"bg-neutral-800 text-white shadow-sm":"text-neutral-400 hover:text-neutral-200"}`,children:x},x))}),E.jsx("div",{className:"flex rounded bg-[#0a0a0a] p-0.5 border border-neutral-800 text-[10px] font-mono",children:["all","high","low"].map(x=>E.jsx("button",{onClick:()=>f(x),className:`px-2 py-0.5 rounded transition-all font-semibold uppercase ${l===x?"bg-neutral-800 text-white shadow-sm":"text-neutral-400 hover:text-neutral-200"}`,children:x},x))})]}):E.jsx("div",{className:"flex items-center gap-2",children:E.jsxs("span",{className:"text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-800/40 font-bold uppercase tracking-wider flex items-center gap-2",children:[E.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"}),"AUTOWARE 3D DIGITAL TWIN"]})}),E.jsxs("div",{className:"flex items-center gap-2.5 shrink-0",children:[E.jsxs("button",{onClick:d,className:`h-7 px-2.5 rounded flex items-center gap-1.5 text-[11px] font-mono font-semibold transition-all ${t?"bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30":"bg-[#0a0a0a] hover:bg-neutral-900 text-neutral-300 border border-neutral-800"}`,title:"Pause or resume live UI updates (Spacebar)",children:[t?E.jsx(Zy,{className:"w-3 h-3 fill-current"}):E.jsx($y,{className:"w-3 h-3"}),E.jsx("span",{children:t?"RESUME":"FREEZE"})]}),E.jsxs("div",{className:"flex items-center rounded bg-[#0a0a0a] border border-neutral-800 text-[10px] font-mono p-0.5",title:"UI Scale Zoom (Ctrl+ / Ctrl- / Ctrl+0)",children:[E.jsx("button",{onClick:()=>y(x=>x-.1),className:"w-5 h-5 flex items-center justify-center rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors font-bold",title:"Zoom Out (Ctrl -)",children:"–"}),E.jsxs("button",{onClick:()=>y(1),className:"px-1.5 h-5 flex items-center justify-center rounded text-neutral-300 hover:text-cyan-300 text-[10px] font-bold transition-colors",title:"Reset Zoom to 100% (Ctrl 0)",children:[Math.round(g*100),"%"]}),E.jsx("button",{onClick:()=>y(x=>x+.1),className:"w-5 h-5 flex items-center justify-center rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors font-bold",title:"Zoom In (Ctrl +)",children:"+"})]}),E.jsxs("div",{className:"flex items-center gap-1.5 text-[11px] font-mono bg-[#0a0a0a] px-2.5 py-1 rounded border border-neutral-800",children:[E.jsx(w_,{className:"w-3 h-3 text-cyan-400 animate-pulse"}),E.jsx("span",{className:"text-neutral-400",children:"frames:"}),E.jsx("span",{className:"text-neutral-100 font-bold tabular-nums",children:s.toLocaleString()})]}),E.jsx("div",{className:`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-mono font-bold border ${e?"bg-[#0a0a0a] text-emerald-400 border-neutral-800":"bg-rose-950/40 text-rose-400 border-rose-800/60"}`,children:e?E.jsxs(E.Fragment,{children:[E.jsx(oS,{className:"w-3 h-3 text-emerald-400"}),E.jsxs("span",{className:"relative flex h-1.5 w-1.5",children:[E.jsx("span",{className:"animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"}),E.jsx("span",{className:"relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"})]}),E.jsx("span",{children:"LIVE"})]}):E.jsxs(E.Fragment,{children:[E.jsx(sS,{className:"w-3 h-3 text-rose-400"}),E.jsx("span",{children:"DISCONNECTED"})]})})]})]})},cS=()=>{const s=vn(T=>T.telemetry),e=50,t=Math.min(Math.max(s.speed_act_kmh,0),e),i=Math.min(Math.max(s.speed_cmd_kmh,0),e),a=-135+t/e*180,l=-135+i/e*180,c=45,d=Math.min(Math.max(s.steer_act_deg,-c),c),h=Math.min(Math.max(s.steer_cmd_deg,-c),c),f=-90+d/c*45,_=-90+h/c*45,m=1500,g=Math.min(Math.max(s.brake_act_kpa/m*100,0),100),y=Math.min(Math.max(s.brake_cmd_kpa/m*100,0),100),M=["P","R","N","D","S"];return E.jsxs("aside",{className:"w-72 bg-black border-r border-neutral-800 flex flex-col justify-between p-3 select-none overflow-y-auto shrink-0",children:[E.jsxs("div",{className:"space-y-2.5",children:[E.jsxs("div",{className:"flex items-center justify-between pb-2 border-b border-neutral-800",children:[E.jsx("span",{className:"text-[11px] font-mono uppercase text-neutral-300 font-bold tracking-wider",children:"Cockpit State"}),s.estop?E.jsxs("span",{className:"flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/60 shadow-[0_0_8px_rgba(244,63,94,0.4)] animate-pulse",children:[E.jsx(tS,{className:"w-3.5 h-3.5"})," ESTOP ACTIVE"]}):E.jsx("span",{className:"text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40",children:"SAFETY OK"})]}),E.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[E.jsxs("div",{className:"bg-[#0a0a0a] p-2 rounded-lg border border-neutral-800",children:[E.jsx("span",{className:"block text-[10px] uppercase font-mono text-neutral-400 font-medium",children:"Mode"}),E.jsx("span",{className:`text-xs font-mono font-black tracking-wide ${s.mode==="AUTONOMOUS"||s.mode==="AUTO"?"text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.4)]":s.mode==="EMERGENCY"||s.mode==="ESTOP"?"text-rose-400 drop-shadow-[0_0_6px_rgba(244,63,94,0.4)]":"text-amber-300"}`,children:s.mode})]}),E.jsxs("div",{className:"bg-[#0a0a0a] p-2 rounded-lg border border-neutral-800",children:[E.jsx("span",{className:"block text-[10px] uppercase font-mono text-neutral-400 font-medium",children:"Gear"}),E.jsx("div",{className:"flex items-center justify-between mt-1",children:M.map(T=>{const S=s.gear===T;return E.jsx("span",{className:`text-[11px] font-mono font-black px-1.5 py-0.5 rounded transition-all ${S?"bg-cyan-400 text-black shadow-md shadow-cyan-500/40":"text-neutral-400 bg-neutral-900 border border-neutral-800"}`,children:T},T)})})]})]}),E.jsxs("div",{className:"bg-[#0a0a0a] p-2.5 rounded-lg border border-neutral-800",children:[E.jsxs("div",{className:"flex items-center justify-between mb-2",children:[E.jsx("span",{className:"text-[10px] uppercase font-mono text-neutral-300 font-semibold tracking-wide",children:"ISO 2575 Telltales"}),E.jsxs("div",{className:"flex items-center gap-2 text-[9px] font-mono",children:[E.jsx("span",{className:"text-cyan-400 font-bold",children:"■ CMD"}),E.jsx("span",{className:"text-emerald-400 font-bold",children:"■ ACT"})]})]}),E.jsxs("div",{className:"grid grid-cols-5 gap-1.5 text-center",children:[E.jsxs("div",{className:`p-1.5 rounded-md border flex flex-col items-center justify-center transition-all ${s.lights_act.left?"bg-emerald-500/25 text-emerald-300 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]":s.lights_cmd.left?"bg-cyan-500/15 text-cyan-300 border-cyan-400/60 ring-1 ring-cyan-400/40":"bg-[#121212] text-neutral-400 border-neutral-800"}`,title:"Left Turn Indicator",children:[E.jsx("span",{className:"text-base font-black leading-none",children:"⮜"}),E.jsx("span",{className:"text-[9px] font-mono font-semibold mt-1",children:"LEFT"})]}),E.jsxs("div",{className:`p-1.5 rounded-md border flex flex-col items-center justify-center transition-all ${s.lights_act.right?"bg-emerald-500/25 text-emerald-300 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]":s.lights_cmd.right?"bg-cyan-500/15 text-cyan-300 border-cyan-400/60 ring-1 ring-cyan-400/40":"bg-[#121212] text-neutral-400 border-neutral-800"}`,title:"Right Turn Indicator",children:[E.jsx("span",{className:"text-base font-black leading-none",children:"⮞"}),E.jsx("span",{className:"text-[9px] font-mono font-semibold mt-1",children:"RGHT"})]}),E.jsxs("div",{className:`p-1.5 rounded-md border flex flex-col items-center justify-center transition-all ${s.lights_act.hazard?"bg-amber-500/25 text-amber-300 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse":s.lights_cmd.hazard?"bg-cyan-500/15 text-cyan-300 border-cyan-400/60 ring-1 ring-cyan-400/40":"bg-[#121212] text-neutral-400 border-neutral-800"}`,title:"Hazard Warning Lights",children:[E.jsx(iS,{className:"w-3.5 h-3.5"}),E.jsx("span",{className:"text-[9px] font-mono font-semibold mt-1",children:"HAZD"})]}),E.jsxs("div",{className:`p-1.5 rounded-md border flex flex-col items-center justify-center transition-all ${s.lights_act.headlight?"bg-sky-500/25 text-sky-300 border-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.4)]":s.lights_cmd.headlight?"bg-cyan-500/15 text-cyan-300 border-cyan-400/60 ring-1 ring-cyan-400/40":"bg-[#121212] text-neutral-400 border-neutral-800"}`,title:"Headlights / Dipped Beam",children:[E.jsx(qy,{className:"w-3.5 h-3.5"}),E.jsx("span",{className:"text-[9px] font-mono font-semibold mt-1",children:"BEAM"})]}),E.jsxs("div",{className:`p-1.5 rounded-md border flex flex-col items-center justify-center transition-all ${s.lights_act.brake?"bg-rose-500/25 text-rose-300 border-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.5)]":s.lights_cmd.brake?"bg-cyan-500/15 text-cyan-300 border-cyan-400/60 ring-1 ring-cyan-400/40":"bg-[#121212] text-neutral-400 border-neutral-800"}`,title:"Brake Stop Lamp",children:[E.jsx("span",{className:"text-[10px] font-black leading-none px-1 py-0.5 rounded bg-rose-950/60 border border-rose-800/80",children:"STOP"}),E.jsx("span",{className:"text-[9px] font-mono font-semibold mt-0.5",children:"BRK"})]})]})]}),E.jsxs("div",{className:"bg-[#0a0a0a] p-3 rounded-lg border border-neutral-800",children:[E.jsxs("div",{className:"flex items-center justify-between text-[10px] font-mono text-neutral-300 font-semibold mb-1",children:[E.jsx("span",{children:"SPEEDOMETER"}),E.jsx("span",{className:"text-neutral-400",children:"0 - 50 km/h"})]}),E.jsxs("div",{className:"relative flex flex-col items-center justify-center py-1",children:[E.jsxs("svg",{viewBox:"0 0 160 92",className:"w-44 overflow-visible",children:[E.jsx("path",{d:"M 20 85 A 60 60 0 0 1 140 85",fill:"none",stroke:"#262626",strokeWidth:"10",strokeLinecap:"round"}),[0,10,20,30,40,50].map(T=>{const x=(-135+T/50*180)*Math.PI/180,R=80+53*Math.cos(x),I=85+53*Math.sin(x),A=80+60*Math.cos(x),P=85+60*Math.sin(x);return E.jsx("line",{x1:R,y1:I,x2:A,y2:P,stroke:"#525252",strokeWidth:"1.5"},T)}),E.jsx("line",{x1:"80",y1:"85",x2:80+58*Math.cos(l*Math.PI/180),y2:85+58*Math.sin(l*Math.PI/180),stroke:"#06b6d4",strokeWidth:"2.5",strokeDasharray:"4 2"}),E.jsx("line",{x1:"80",y1:"85",x2:80+54*Math.cos(a*Math.PI/180),y2:85+54*Math.sin(a*Math.PI/180),stroke:"#10b981",strokeWidth:"3.5",strokeLinecap:"round"}),E.jsx("circle",{cx:"80",cy:"85",r:"5",fill:"#10b981"}),E.jsx("circle",{cx:"80",cy:"85",r:"2.5",fill:"#000000"})]}),E.jsxs("div",{className:"text-center mt-[-6px]",children:[E.jsx("div",{className:"text-3xl font-mono font-black text-emerald-400 tracking-tight tabular-nums drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]",children:s.speed_act_kmh.toFixed(1)}),E.jsxs("div",{className:"text-[11px] font-mono text-neutral-400 flex items-center justify-center gap-2 mt-0.5",children:[E.jsx("span",{className:"font-semibold text-neutral-300",children:"km/h"}),E.jsx("span",{className:"text-neutral-600",children:"|"}),E.jsxs("span",{className:"text-cyan-300 font-bold bg-[#141414] px-1.5 py-0.5 rounded border border-neutral-700",children:["CMD: ",s.speed_cmd_kmh.toFixed(1)]})]})]})]})]}),E.jsxs("div",{className:"bg-[#0a0a0a] p-3 rounded-lg border border-neutral-800",children:[E.jsxs("div",{className:"flex items-center justify-between text-[10px] font-mono text-neutral-300 font-semibold mb-1",children:[E.jsx("span",{children:"STEERING ANGLE"}),E.jsx("span",{className:"text-neutral-400",children:"±45.0°"})]}),E.jsxs("div",{className:"relative flex flex-col items-center justify-center py-1",children:[E.jsxs("svg",{viewBox:"0 0 160 70",className:"w-44 overflow-visible",children:[E.jsx("line",{x1:"80",y1:"16",x2:"80",y2:"60",stroke:"#525252",strokeWidth:"1",strokeDasharray:"2 2"}),E.jsx("path",{d:"M 38 60 A 60 60 0 0 1 122 60",fill:"none",stroke:"#262626",strokeWidth:"8",strokeLinecap:"round"}),E.jsx("line",{x1:"80",y1:"60",x2:80+52*Math.cos(_*Math.PI/180),y2:60+52*Math.sin(_*Math.PI/180),stroke:"#06b6d4",strokeWidth:"2.5",strokeDasharray:"3 2"}),E.jsx("line",{x1:"80",y1:"60",x2:80+50*Math.cos(f*Math.PI/180),y2:60+50*Math.sin(f*Math.PI/180),stroke:"#10b981",strokeWidth:"3.5",strokeLinecap:"round"}),E.jsx("circle",{cx:"80",cy:"60",r:"4",fill:"#10b981"})]}),E.jsxs("div",{className:"text-center mt-[-4px]",children:[E.jsxs("div",{className:"text-2xl font-mono font-black text-emerald-400 tabular-nums drop-shadow-[0_0_6px_rgba(16,185,129,0.3)]",children:[s.steer_act_deg>0?`+${s.steer_act_deg.toFixed(1)}`:s.steer_act_deg.toFixed(1),"°"]}),E.jsxs("div",{className:"text-[11px] font-mono text-neutral-400 mt-0.5",children:["CMD:"," ",E.jsxs("span",{className:"text-cyan-300 font-bold bg-[#141414] px-1.5 py-0.5 rounded border border-neutral-700",children:[s.steer_cmd_deg.toFixed(1),"°"]})]})]})]})]}),E.jsxs("div",{className:"bg-[#0a0a0a] p-3 rounded-lg border border-neutral-800",children:[E.jsxs("div",{className:"flex items-center justify-between text-[10px] font-mono text-neutral-300 font-semibold mb-2",children:[E.jsx("span",{children:"HYDRAULIC BRAKE"}),E.jsx("span",{className:"text-neutral-400",children:"0 - 1500 kPa"})]}),E.jsxs("div",{className:"space-y-2",children:[E.jsxs("div",{children:[E.jsxs("div",{className:"flex justify-between text-[10px] font-mono mb-1 text-neutral-300",children:[E.jsx("span",{className:"text-emerald-400 font-bold",children:"FEEDBACK"}),E.jsxs("span",{className:"text-neutral-100 tabular-nums font-bold",children:[s.brake_act_kpa.toFixed(0)," kPa"]})]}),E.jsx("div",{className:"w-full h-2.5 bg-[#141414] rounded-full overflow-hidden border border-neutral-800",children:E.jsx("div",{className:"h-full bg-emerald-500 rounded-full transition-all duration-100 shadow-[0_0_8px_rgba(16,185,129,0.5)]",style:{width:`${g}%`}})})]}),E.jsxs("div",{children:[E.jsxs("div",{className:"flex justify-between text-[10px] font-mono mb-1 text-neutral-300",children:[E.jsx("span",{className:"text-cyan-400 font-bold",children:"COMMAND"}),E.jsxs("span",{className:"text-neutral-200 tabular-nums font-bold",children:[s.brake_cmd_kpa.toFixed(0)," kPa"]})]}),E.jsx("div",{className:"w-full h-2 bg-[#141414] rounded-full overflow-hidden border border-neutral-800",children:E.jsx("div",{className:"h-full bg-cyan-400 rounded-full transition-all duration-100 shadow-[0_0_6px_rgba(6,182,212,0.4)]",style:{width:`${y}%`}})})]})]})]})]}),E.jsxs("div",{className:"pt-2 border-t border-neutral-800 text-[10px] font-mono text-neutral-400 text-center space-y-0.5",children:[E.jsx("div",{className:"font-semibold text-neutral-300",children:"e-trike av • telemetry"}),E.jsx("div",{className:"text-neutral-500",children:"seer engineering monitor"})]})]})};var uS=m_();function dS(s){return typeof s=="object"?s.key:s}function hS(s,e){const t=s.length;return new Proxy(s,{get(i,a,l){if(typeof a=="string"){const c=a.charCodeAt(0);if(c>=48&&c<=57){const d=+a;if(Number.isInteger(d)&&d>=0&&d<t){let h=i[d];if(typeof h!="object"){const f=e[d*2];h=i[d]={index:d,key:h,start:f,size:e[d*2+1],end:f+e[d*2+1],lane:0}}return h}}if(a==="length")return t}return Reflect.get(i,a,l)}})}function Sa(s,e,t){let i=t.initialDeps??[],a,l=!0;function c(){const d=s();return(d.length!==i.length||d.some((f,_)=>i[_]!==f))&&(i=d,a=e(...d),t!=null&&t.onChange&&!(l&&t.skipInitialOnChange)&&t.onChange(a),l=!1),a}return c.updateDeps=d=>{i=d},c}function H0(s,e){if(s===void 0)throw new Error("Unexpected undefined");return s}const V0=(s,e)=>Math.abs(s-e)<1.01,fS=(s,e,t)=>{let i;return Object.assign(function(...a){s.clearTimeout(i),i=s.setTimeout(()=>e.apply(this,a),t)},{cancel:()=>{s.clearTimeout(i)}})};let Bo;const th=()=>{if(Bo!==void 0)return Bo;if(typeof navigator>"u")return Bo=!1;if(/iP(hone|od|ad)/.test(navigator.userAgent))return Bo=!0;const s=navigator.maxTouchPoints;return Bo=navigator.platform==="MacIntel"&&s!==void 0&&s>0},G0=s=>{const{offsetWidth:e,offsetHeight:t}=s;return{width:e,height:t}},pS=s=>s,mS=s=>{const e=Math.max(s.startIndex-s.overscan,0),i=Math.min(s.endIndex+s.overscan,s.count-1)-e+1,a=new Array(i);for(let l=0;l<i;l++)a[l]=e+l;return a},gS=(s,e)=>{const t=s.scrollElement;if(!t)return;const i=s.targetWindow;if(!i)return;const a=c=>{const{width:d,height:h}=c;e({width:Math.round(d),height:Math.round(h)})};if(a(G0(t)),!i.ResizeObserver)return()=>{};const l=new i.ResizeObserver(c=>{const d=()=>{const h=c[0];if(h!=null&&h.borderBoxSize){const f=h.borderBoxSize[0];if(f){a({width:f.inlineSize,height:f.blockSize});return}}a(G0(t))};s.options.useAnimationFrameWithResizeObserver?requestAnimationFrame(d):d()});return l.observe(t,{box:"border-box"}),()=>{l.unobserve(t)}},tu={passive:!0},_S=typeof window>"u"?!0:"onscrollend"in window,xS=(s,e,t)=>{const i=s.scrollElement;if(!i)return;const a=s.targetWindow;if(!a)return;const l=s.options.useScrollendEvent&&_S;let c=0;const d=l?null:fS(a,()=>e(t(i),!1),s.options.isScrollingResetDelay),h=m=>()=>{c=t(i),d==null||d(),e(c,m)},f=h(!0),_=h(!1);return i.addEventListener("scroll",f,tu),l&&i.addEventListener("scrollend",_,tu),()=>{i.removeEventListener("scroll",f),l&&i.removeEventListener("scrollend",_),d==null||d.cancel()}},vS=(s,e)=>xS(s,e,t=>{const{horizontal:i,isRtl:a}=s.options;return i?t.scrollLeft*(a&&-1||1):t.scrollTop}),yS=(s,e,t)=>{if(t.options.useCachedMeasurements){const i=t.indexFromElement(s),a=t.options.getItemKey(i);return t.itemSizeCache.get(a)??t.options.estimateSize(i)}if(e!=null&&e.borderBoxSize){const i=e.borderBoxSize[0];if(i)return Math.round(i[t.options.horizontal?"inlineSize":"blockSize"])}if(!e){const i=t.indexFromElement(s),a=t.options.getItemKey(i),l=t.itemSizeCache.get(a);if(l!==void 0)return l}return s[t.options.horizontal?"offsetWidth":"offsetHeight"]},SS=(s,{adjustments:e=0,behavior:t},i)=>{var a,l;(l=(a=i.scrollElement)==null?void 0:a.scrollTo)==null||l.call(a,{[i.options.horizontal?"left":"top"]:s+e,behavior:t})},MS=SS;function ES(s,e,t,i){if(e===0)return!1;const a=i(0),l=new Set;let c=0;for(;c<s;){const h=t(c);if(h===a)break;l.add(h),c++}const d=s-c;if(d===0||d>=e)return!1;for(let h=0;h<d;h++)if(i(h)!==t(c+h))return!1;for(let h=d;h<e;h++)if(l.has(i(h)))return!1;return!0}class wS{constructor(e){this.unsubs=[],this.scrollElement=null,this.targetWindow=null,this.isScrolling=!1,this.scrollState=null,this.measurementsCache=[],this._singleLaneMeasurements=null,this.itemSizeCache=new Map,this.itemSizeCacheVersion=0,this.laneAssignments=new Map,this.pendingMin=null,this.prevLanes=void 0,this.lanesChangedFlag=!1,this.lanesSettling=!1,this.pendingScrollAnchor=null,this.scrollRect=null,this.scrollOffset=null,this.scrollDirection=null,this.scrollAdjustments=0,this._iosDeferredAdjustment=0,this._iosTouching=!1,this._iosJustTouchEnded=!1,this._iosTouchEndTimerId=null,this._intendedScrollOffset=null,this._clampedAdjustment=null,this.elementsCache=new Map,this.now=()=>{var t,i,a;return((a=(i=(t=this.targetWindow)==null?void 0:t.performance)==null?void 0:i.now)==null?void 0:a.call(i))??Date.now()},this.observer=(()=>{let t=null;const i=()=>t||(!this.targetWindow||!this.targetWindow.ResizeObserver?null:t=new this.targetWindow.ResizeObserver(a=>{a.forEach(l=>{const c=()=>{const d=l.target,h=this.indexFromElement(d);if(!d.isConnected){this.observer.unobserve(d);for(const[f,_]of this.elementsCache)if(_===d){this.elementsCache.delete(f);break}return}this.isIndexInRange(h)&&this.shouldMeasureDuringScroll(h)&&this.resizeItem(h,this.options.measureElement(d,l,this))};this.options.useAnimationFrameWithResizeObserver?requestAnimationFrame(c):c()})}));return{disconnect:()=>{var a;(a=i())==null||a.disconnect(),t=null},observe:a=>{var l;return(l=i())==null?void 0:l.observe(a,{box:"border-box"})},unobserve:a=>{var l;return(l=i())==null?void 0:l.unobserve(a)}}})(),this.range=null,this.setOptions=t=>{var i;const a={debug:!1,initialOffset:0,overscan:1,paddingStart:0,paddingEnd:0,scrollPaddingStart:0,scrollPaddingEnd:0,horizontal:!1,getItemKey:pS,rangeExtractor:mS,onChange:()=>{},measureElement:yS,initialRect:{width:0,height:0},scrollMargin:0,gap:0,indexAttribute:"data-index",initialMeasurementsCache:[],lanes:1,anchorTo:"start",followOnAppend:!1,scrollEndThreshold:1,isScrollingResetDelay:150,enabled:!0,isRtl:!1,useScrollendEvent:!1,useAnimationFrameWithResizeObserver:!1,laneAssignmentMode:"estimate",useCachedMeasurements:!1};for(const m in t){const g=t[m];g!==void 0&&(a[m]=g)}const l=this.options;let c=null,d=null,h=!1;if(l!==void 0&&l.enabled&&a.enabled&&a.anchorTo==="end"&&this.scrollElement!==null){const m=l.count,g=a.count,y=this.getMeasurements(),M=((i=this._singleLaneMeasurements)==null?void 0:i.items)??y,T=A=>dS(M[A]),S=m>0?T(0):null,x=m>0?T(m-1):null;if(g!==m||m>0&&g>0&&(a.getItemKey(0)!==S||a.getItemKey(g-1)!==x)){h=!0;const A=m>0?this.getVirtualItemForOffset(this.getScrollOffset())??y[0]:null;A&&(c=[A.key,this.getScrollOffset()-A.start]);const P=a.followOnAppend===!0?"auto":a.followOnAppend||null;P&&g>0&&this.isAtEnd(l.scrollEndThreshold)&&(m===0||a.getItemKey(g-1)!==x)&&(g>m||ES(m,g,T,a.getItemKey))&&(d=P)}}this.options=a,h&&(this.pendingMin=0,this.itemSizeCacheVersion++);let f=!1,_=0;if(c&&this.scrollOffset!==null){const[m,g]=c,y=this.getMeasurements(),{count:M,getItemKey:T}=this.options;let S=0;for(;S<M&&T(S)!==m;)S++;if(S<M){const x=y[S];if(x){const R=Math.max(0,x.start+g);!d&&R!==this.scrollOffset&&(_=R-this.scrollOffset,this.scrollOffset=R,f=!0)}}}(f||d)&&(this.pendingScrollAnchor=[f?c[0]:null,f?c[1]:0,d,_])},this.notify=t=>{var i,a;(a=(i=this.options).onChange)==null||a.call(i,this,t)},this.maybeNotify=Sa(()=>(this.calculateRange(),[this.isScrolling,this.range?this.range.startIndex:null,this.range?this.range.endIndex:null]),t=>{this.notify(t)},{key:!1,debug:()=>this.options.debug,initialDeps:[this.isScrolling,this.range?this.range.startIndex:null,this.range?this.range.endIndex:null]}),this.cleanup=()=>{this.unsubs.filter(Boolean).forEach(t=>t()),this.unsubs=[],this.observer.disconnect(),this.rafId!=null&&this.targetWindow&&(this.targetWindow.cancelAnimationFrame(this.rafId),this.rafId=null),this.scrollState=null,this.isScrolling=!1,this.scrollDirection=null,this._iosDeferredAdjustment=0,this._iosTouching=!1,this._iosJustTouchEnded=!1,this._clampedAdjustment=null,this.scrollElement=null,this.targetWindow=null},this._didMount=()=>()=>{this.cleanup()},this._willUpdate=()=>{var t,i;const a=this.options.enabled?this.options.getScrollElement():null;if(this.scrollElement!==a){if(this.cleanup(),!a){this.maybeNotify();return}if(this.scrollElement=a,this.scrollElement&&"ownerDocument"in this.scrollElement?this.targetWindow=this.scrollElement.ownerDocument.defaultView:this.targetWindow=((t=this.scrollElement)==null?void 0:t.window)??null,this.elementsCache.forEach(c=>{this.observer.observe(c)}),this.unsubs.push(this.options.observeElementRect(this,c=>{this.scrollRect=c,this.maybeNotify()})),this.unsubs.push(this.options.observeElementOffset(this,(c,d)=>{if(d&&this._intendedScrollOffset===null&&c===this.scrollOffset)return;this._intendedScrollOffset!==null&&Math.abs(c-this._intendedScrollOffset)<1.5&&(c=this._intendedScrollOffset),this._intendedScrollOffset=null,this._clampedAdjustment!==null&&Math.abs(c-this._clampedAdjustment.maxAtWrite)>=1.5&&(this._clampedAdjustment=null),this.scrollAdjustments=0;const h=this.getScrollOffset();this.scrollDirection=d?h===c?this.scrollDirection:h<c?"forward":"backward":null,this.scrollOffset=c,this.isScrolling=d,this._flushIosDeferredIfReady(),this.scrollState&&this.scheduleScrollReconcile(),this.maybeNotify()})),"addEventListener"in this.scrollElement){const c=this.scrollElement,d=()=>{this._iosTouching=!0,this._iosJustTouchEnded=!1,this._iosTouchEndTimerId!==null&&this.targetWindow!=null&&(this.targetWindow.clearTimeout(this._iosTouchEndTimerId),this._iosTouchEndTimerId=null)},h=()=>{this._iosTouching=!1,!(!th()||this.targetWindow==null)&&(this._iosJustTouchEnded=!0,this._iosTouchEndTimerId=this.targetWindow.setTimeout(()=>{this._iosJustTouchEnded=!1,this._iosTouchEndTimerId=null,this._flushIosDeferredIfReady()},150))};c.addEventListener("touchstart",d,tu),c.addEventListener("touchend",h,tu),this.unsubs.push(()=>{c.removeEventListener("touchstart",d),c.removeEventListener("touchend",h),this._iosTouchEndTimerId!==null&&this.targetWindow!=null&&(this.targetWindow.clearTimeout(this._iosTouchEndTimerId),this._iosTouchEndTimerId=null)})}this._scrollToOffset(this.getScrollOffset(),{adjustments:void 0,behavior:void 0})}const l=this.pendingScrollAnchor;if(this.pendingScrollAnchor=null,l&&this.scrollElement&&this.options.enabled){const[c,d,h,f]=l;c!==null&&!h&&(th()&&(this.isScrolling||this._iosTouching||this._iosJustTouchEnded)?f!==0&&(this._iosDeferredAdjustment+=f):((i=this.scrollState)==null?void 0:i.behavior)==="smooth"&&!V0(this.getScrollOffset()-f,this.scrollState.lastTargetOffset)||this._scrollToOffset(this.getScrollOffset(),{adjustments:void 0,behavior:void 0})),h&&this.scrollToEnd({behavior:h})}this._retryClampedAdjustment()},this._retryClampedAdjustment=()=>{if(this._clampedAdjustment===null||!this.scrollElement||!this.options.enabled)return;const{target:t,maxAtWrite:i}=this._clampedAdjustment,a=this.getMaxScrollOffset();a>i+.5&&(this._clampedAdjustment=t>a+.5?{target:t,maxAtWrite:a}:null,this._scrollToOffset(t,{adjustments:void 0,behavior:void 0}))},this._flushIosDeferredIfReady=()=>{if(this._iosDeferredAdjustment===0||this.isScrolling||this._iosTouching||this._iosJustTouchEnded)return;const t=this.getScrollOffset(),i=this.getMaxScrollOffset();if(t<0||t>i)return;if(this._iosDeferredAdjustment<0&&t>=i-1){this._iosDeferredAdjustment=0;return}const a=this._iosDeferredAdjustment;this._iosDeferredAdjustment=0,this._scrollToOffset(t,{adjustments:this.scrollAdjustments+=a,behavior:void 0})},this.rafId=null,this.getSize=()=>this.options.enabled?(this.scrollRect=this.scrollRect??this.options.initialRect,this.scrollRect[this.options.horizontal?"width":"height"]):(this.scrollRect=null,0),this.getScrollOffset=()=>this.options.enabled?(this.scrollOffset=this.scrollOffset??(typeof this.options.initialOffset=="function"?this.options.initialOffset():this.options.initialOffset),this.scrollOffset):(this.scrollOffset=null,0),this.getMeasurementOptions=Sa(()=>[this.options.count,this.options.paddingStart,this.options.scrollMargin,this.options.getItemKey,this.options.enabled,this.options.lanes,this.options.laneAssignmentMode,this.options.gap],(t,i,a,l,c,d,h,f)=>(this.prevLanes!==void 0&&this.prevLanes!==d&&(this.lanesChangedFlag=!0),this.prevLanes=d,this.pendingMin=null,{count:t,paddingStart:i,scrollMargin:a,getItemKey:l,enabled:c,lanes:d,laneAssignmentMode:h,gap:f}),{key:!1}),this.isIndexInRange=t=>t>=0&&t<this.options.count,this.getMeasurements=Sa(()=>[this.getMeasurementOptions(),this.itemSizeCacheVersion],({count:t,paddingStart:i,scrollMargin:a,getItemKey:l,enabled:c,lanes:d,laneAssignmentMode:h,gap:f},_)=>{var m;const g=this.itemSizeCache;if(!c)return this.measurementsCache=[],this._singleLaneMeasurements=null,this.itemSizeCache.clear(),this.laneAssignments.clear(),[];if(this.laneAssignments.size>t)for(const R of this.laneAssignments.keys())R>=t&&this.laneAssignments.delete(R);this.lanesChangedFlag&&(this.lanesChangedFlag=!1,this.lanesSettling=!0,this.measurementsCache=[],this._singleLaneMeasurements=null,this.itemSizeCache.clear(),this.laneAssignments.clear(),this.pendingMin=null),this.measurementsCache.length===0&&!this.lanesSettling&&(this.measurementsCache=this.options.initialMeasurementsCache,this.measurementsCache.forEach(R=>{this.itemSizeCache.set(R.key,R.size)}));const y=this.lanesSettling?0:this.pendingMin??0;if(this.pendingMin=null,this.lanesSettling&&this.measurementsCache.length===t&&(this.lanesSettling=!1),d===1){const R=t*2;let I=(m=this._singleLaneMeasurements)==null?void 0:m.flat;if(!I||I.length<R){const U=new Float64Array(R);I&&y>0&&U.set(I.subarray(0,y*2)),I=U}const A=y===0?new Array(t):this._singleLaneMeasurements.items.slice();let P;if(y===0)P=i+a;else{const U=y-1;P=I[U*2]+I[U*2+1]+f}for(let U=y;U<t;U++){const b=l(U);A[U]=b;const D=g.get(b),B=typeof D=="number"?D:this.options.estimateSize(U);I[U*2]=P,I[U*2+1]=B,P+=B+f}this._singleLaneMeasurements={flat:I,items:A};const L=hS(A,I);return this.measurementsCache=L,L}const M=this.measurementsCache.slice(0,y),T=new Array(d).fill(void 0),S=new Float64Array(d);let x=0;for(let R=0;R<y;R++){const I=M[R];I&&(T[I.lane]===void 0&&x++,T[I.lane]=R,S[I.lane]=I.end)}for(let R=y;R<t;R++){const I=l(R),A=this.laneAssignments.get(R);let P,L;const U=h==="estimate"||g.has(I);if(A!==void 0&&this.options.lanes>1){P=A;const V=T[P],G=V!==void 0?M[V]:void 0;L=G?G.end+f:i+a}else if(x===d){let V=0,G=S[0],J=T[0];for(let H=1;H<d;H++){const Z=S[H];(Z<G||Z===G&&T[H]<J)&&(V=H,G=Z,J=T[H])}P=V,L=G+f,U&&this.laneAssignments.set(R,P)}else P=R%this.options.lanes,L=i+a,U&&this.laneAssignments.set(R,P);const b=g.get(I),D=typeof b=="number"?b:this.options.estimateSize(R),B=L+D;M[R]={index:R,start:L,size:D,end:B,key:I,lane:P},T[P]===void 0&&x++,T[P]=R,S[P]=B}return this.measurementsCache=M,M},{key:!1,debug:()=>this.options.debug}),this.calculateRange=Sa(()=>[this.getMeasurements(),this.getSize(),this.getScrollOffset(),this.options.lanes],(t,i,a,l)=>t.length===0||i===0?(this.range=null,null):(this.range=TS(t,i,a,l,l===1&&this._singleLaneMeasurements!==null?this._singleLaneMeasurements.flat:null),this.range),{key:!1,debug:()=>this.options.debug}),this.getVirtualIndexes=Sa(()=>{let t=null,i=null;const a=this.calculateRange();return a&&(t=a.startIndex,i=a.endIndex),this.maybeNotify.updateDeps([this.isScrolling,t,i]),[this.options.rangeExtractor,this.options.overscan,this.options.count,t,i]},(t,i,a,l,c)=>l===null||c===null?[]:t({startIndex:l,endIndex:c,overscan:i,count:a}),{key:!1,debug:()=>this.options.debug}),this.indexFromElement=t=>{const i=this.options.indexAttribute,a=t.getAttribute(i);return a?parseInt(a,10):(console.warn(`Missing attribute name '${i}={index}' on measured element.`),-1)},this.shouldMeasureDuringScroll=t=>{var i;if(!this.scrollState||this.scrollState.behavior!=="smooth")return!0;const a=this.scrollState.index??((i=this.getVirtualItemForOffset(this.scrollState.lastTargetOffset))==null?void 0:i.index);if(a!==void 0&&this.range){const l=Math.max(this.options.overscan,Math.ceil((this.range.endIndex-this.range.startIndex)/2)),c=Math.max(0,a-l),d=Math.min(this.options.count-1,a+l);return t>=c&&t<=d}return!0},this.measureElement=t=>{if(!t){this.elementsCache.forEach((c,d)=>{c.isConnected||(this.observer.unobserve(c),this.elementsCache.delete(d))});return}const i=this.indexFromElement(t);if(!this.isIndexInRange(i))return;const a=this.options.getItemKey(i),l=this.elementsCache.get(a);l!==t&&(l&&this.observer.unobserve(l),this.observer.observe(t),this.elementsCache.set(a,t)),(!this.isScrolling||this.scrollState)&&this.shouldMeasureDuringScroll(i)&&this.resizeItem(i,this.options.measureElement(t,void 0,this))},this.resizeItem=(t,i)=>{var a,l,c;if(!this.isIndexInRange(t))return;let d,h,f;const _=(a=this._singleLaneMeasurements)==null?void 0:a.flat;if(this.options.lanes===1&&_!=null)f=this.options.getItemKey(t),h=_[t*2],d=_[t*2+1];else{const y=this.measurementsCache[t];if(!y)return;f=y.key,h=y.start,d=y.size}const m=this.itemSizeCache.get(f)??d,g=i-m;if(g!==0){const y=this.options.anchorTo==="end"&&((l=this.scrollState)==null?void 0:l.behavior)!=="smooth"&&this.getVirtualDistanceFromEnd()<=this.options.scrollEndThreshold,M=y?this.getTotalSize():0,T=this.getScrollOffset()+this.scrollAdjustments,x=!this.itemSizeCache.has(f)?h<T:h+m<=T&&this.scrollDirection!=="backward",R=((c=this.scrollState)==null?void 0:c.behavior)!=="smooth"&&(this.shouldAdjustScrollPositionOnItemSizeChange!==void 0?this.shouldAdjustScrollPositionOnItemSizeChange(this.measurementsCache[t]??{index:t,key:f,start:h,size:d,end:h+d,lane:0},g,this):x);(this.pendingMin===null||t<this.pendingMin)&&(this.pendingMin=t),this.itemSizeCache.set(f,i),this.itemSizeCacheVersion++;let I=!1;y?I=this.applyScrollAdjustment(this.getTotalSize()-M):R&&(I=this.applyScrollAdjustment(g)),this.notify(I),this._retryClampedAdjustment()}},this.getVirtualItems=Sa(()=>[this.getVirtualIndexes(),this.getMeasurements()],(t,i)=>{const a=[];for(let l=0,c=t.length;l<c;l++){const d=t[l],h=i[d];a.push(h)}return a},{key:!1,debug:()=>this.options.debug}),this.getVirtualItemForOffset=t=>{var i;const a=this.getMeasurements();if(a.length===0)return;const l=(i=this._singleLaneMeasurements)==null?void 0:i.flat,c=this.options.lanes===1&&l!=null,d=T_(0,a.length-1,c?h=>l[h*2]:h=>H0(a[h]).start,t);return H0(a[d])},this.getMaxScrollOffset=()=>{if(!this.scrollElement)return 0;if("scrollHeight"in this.scrollElement)return this.options.horizontal?this.scrollElement.scrollWidth-this.scrollElement.clientWidth:this.scrollElement.scrollHeight-this.scrollElement.clientHeight;{const t=this.scrollElement.document.documentElement;return this.options.horizontal?t.scrollWidth-this.scrollElement.innerWidth:t.scrollHeight-this.scrollElement.innerHeight}},this.getVirtualDistanceFromEnd=()=>Math.max(this.getTotalSize()-this.getSize()-this.getScrollOffset(),0),this.getDistanceFromEnd=()=>Math.max(this.getMaxScrollOffset()-this.getScrollOffset(),0),this.isAtEnd=(t=this.options.scrollEndThreshold)=>this.getDistanceFromEnd()<=t,this.getOffsetForAlignment=(t,i,a=0)=>{if(!this.scrollElement)return 0;const l=this.getSize(),c=this.getScrollOffset();i==="auto"&&(i=t>=c+l?"end":"start"),i==="center"?t+=(a-l)/2:i==="end"&&(t-=l);const d=this.getMaxScrollOffset();return Math.max(Math.min(d,t),0)},this.getOffsetForIndex=(t,i="auto")=>{t=Math.max(0,Math.min(t,this.options.count-1));const a=this.getSize(),l=this.getScrollOffset(),c=this.measurementsCache[t];if(!c)return;if(i==="auto")if(c.end>=l+a-this.options.scrollPaddingEnd)i="end";else if(c.start<=l+this.options.scrollPaddingStart)i="start";else return[l,i];if(i==="end"&&t===this.options.count-1)return[this.getMaxScrollOffset(),i];const d=i==="end"?c.end+this.options.scrollPaddingEnd:c.start-this.options.scrollPaddingStart;return[this.getOffsetForAlignment(d,i,c.size),i]},this.scrollToOffset=(t,{align:i="start",behavior:a="auto"}={})=>{this._iosDeferredAdjustment=0;const l=this.getOffsetForAlignment(t,i),c=this.now();this.scrollState={index:null,align:i,behavior:a,startedAt:c,lastTargetOffset:l,stableFrames:0},this._scrollToOffset(l,{adjustments:void 0,behavior:a}),this.scheduleScrollReconcile()},this.scrollToIndex=(t,{align:i="auto",behavior:a="auto"}={})=>{this._iosDeferredAdjustment=0,t=Math.max(0,Math.min(t,this.options.count-1));const l=this.getOffsetForIndex(t,i);if(!l)return;const[c,d]=l,h=this.now();this.scrollState={index:t,align:d,behavior:a,startedAt:h,lastTargetOffset:c,stableFrames:0},this._scrollToOffset(c,{adjustments:void 0,behavior:a}),this.scheduleScrollReconcile()},this.scrollBy=(t,{behavior:i="auto"}={})=>{const a=this.getScrollOffset()+t,l=this.now();this.scrollState={index:null,align:"start",behavior:i,startedAt:l,lastTargetOffset:a,stableFrames:0},this._scrollToOffset(a,{adjustments:void 0,behavior:i}),this.scheduleScrollReconcile()},this.scrollToEnd=({behavior:t="auto"}={})=>{if(this.options.count>0){this.scrollToIndex(this.options.count-1,{align:"end",behavior:t});return}this.scrollToOffset(Math.max(this.getTotalSize()-this.getSize(),0),{behavior:t})},this.getTotalSize=()=>{var t,i;const a=this.getMeasurements();let l;if(a.length===0)l=this.options.paddingStart;else if(this.options.lanes===1){const c=a.length-1,d=(t=this._singleLaneMeasurements)==null?void 0:t.flat;d!=null?l=d[c*2]+d[c*2+1]:l=((i=a[c])==null?void 0:i.end)??0}else{const c=Array(this.options.lanes).fill(null);let d=a.length-1;for(;d>=0&&c.some(h=>h===null);){const h=a[d];c[h.lane]===null&&(c[h.lane]=h.end),d--}l=Math.max(...c.filter(h=>h!==null))}return Math.max(l-this.options.scrollMargin+this.options.paddingEnd,0)},this.takeSnapshot=()=>{const t=[];if(this.itemSizeCache.size===0)return t;const i=this.getMeasurements();for(const a of i)a&&this.itemSizeCache.has(a.key)&&t.push({index:a.index,key:a.key,start:a.start,size:a.size,end:a.end,lane:a.lane});return t},this._scrollToOffset=(t,{adjustments:i,behavior:a})=>{this._intendedScrollOffset=t+(i??0),this.options.scrollToFn(t,{behavior:a,adjustments:i},this)},this.measure=()=>{this.pendingMin=null,this.itemSizeCache.clear(),this.laneAssignments.clear(),this.itemSizeCacheVersion++,this.notify(!1)},this.setOptions(e)}applyScrollAdjustment(e,t){if(e===0)return!1;if(th()&&(this.isScrolling||this._iosTouching||this._iosJustTouchEnded))return this._iosDeferredAdjustment+=e,!1;{const i=this.getScrollOffset()+this.scrollAdjustments+e,a=this.scrollElement,l=a!==null&&("scrollHeight"in a||"document"in a)?this.getMaxScrollOffset():null;return this._clampedAdjustment=l!==null&&i>l+.5?{target:i,maxAtWrite:l}:null,this._scrollToOffset(this.getScrollOffset(),{adjustments:this.scrollAdjustments+=e,behavior:t}),this.scrollOffset!==null&&(this.scrollOffset+=this.scrollAdjustments,this.scrollOffset<0&&(this.scrollOffset=0),this.scrollAdjustments=0),!0}}scheduleScrollReconcile(){if(!this.targetWindow){this.scrollState=null;return}this.rafId==null&&(this.rafId=this.targetWindow.requestAnimationFrame(()=>{this.rafId=null,this.reconcileScroll()}))}reconcileScroll(){if(!this.scrollState||!this.scrollElement)return;if(this.now()-this.scrollState.startedAt>5e3){this.scrollState=null;return}const i=this.scrollState.index!=null?this.getOffsetForIndex(this.scrollState.index,this.scrollState.align):void 0,a=i?i[0]:this.scrollState.lastTargetOffset,l=1,c=a!==this.scrollState.lastTargetOffset;if(!c&&V0(a,this.getScrollOffset())){if(this.scrollState.stableFrames++,this.scrollState.stableFrames>=l){this.getScrollOffset()!==a&&this._scrollToOffset(a,{adjustments:void 0,behavior:"auto"}),this.scrollState=null;return}}else if(this.scrollState.stableFrames=0,c){const d=this.getSize()||600,h=Math.abs(a-this.getScrollOffset()),f=this.scrollState.behavior==="smooth"&&h>d;this.scrollState.lastTargetOffset=a,f||(this.scrollState.behavior="auto"),this._scrollToOffset(a,{adjustments:void 0,behavior:f?"smooth":"auto"})}this.scheduleScrollReconcile()}}const T_=(s,e,t,i)=>{for(;s<=e;){const a=(s+e)/2|0,l=t(a);if(l<i)s=a+1;else if(l>i)e=a-1;else return a}return s>0?s-1:0};function bS(s,e,t){let i=0;for(;i<=e;){const a=(i+e)/2|0,l=s[a*2];if(l<t)i=a+1;else if(l>t)e=a-1;else return a}return i>0?i-1:0}function TS(s,e,t,i,a){const l=s.length-1;if(s.length<=i)return{startIndex:0,endIndex:l};if(i===1&&a!==null){const f=bS(a,l,t);let _=f;const m=t+e;for(;_<l&&a[_*2]+a[_*2+1]<m;)_++;return{startIndex:f,endIndex:_}}let d=T_(0,l,f=>s[f].start,t),h=d;if(i===1)for(;h<l&&s[h].end<t+e;)h++;else if(i>1){const f=Array(i).fill(0);for(;h<l&&f.some(m=>m<t+e);){const m=s[h];f[m.lane]=m.end,h++}const _=Array(i).fill(t+e);for(;d>=0&&_.some(m=>m>=t);){const m=s[d];_[m.lane]=m.start,d--}d=Math.max(0,d-d%i),h=Math.min(l,h+(i-1-h%i))}return{startIndex:d,endIndex:h}}const nh=typeof document<"u"?on.useLayoutEffect:on.useEffect;function AS({useFlushSync:s=!0,directDomUpdates:e=!1,directDomUpdatesMode:t="transform",...i}){const a=on.useReducer(m=>m+1,0)[1],l=on.useRef({enabled:e,mode:t,container:null,lastSize:null,lastPositions:new WeakMap,prevRange:null});l.current.enabled=e,l.current.mode=t;const c=on.useRef(!1),d=m=>{const g=l.current;if(!g.enabled||!g.container)return;const y=m.getTotalSize();if(y!==g.lastSize){g.lastSize=y;const M=m.options.horizontal?"width":"height";g.container.style[M]=`${y}px`}},h=m=>{const g=l.current;if(!g.enabled||!g.container)return;d(m);const y=!!m.options.horizontal,M=g.mode==="transform",T=y?"left":"top",S=m.options.scrollMargin,x=m.getVirtualItems();for(const R of x){const I=R.start-S,A=m.elementsCache.get(R.key);A&&g.lastPositions.get(A)!==I&&(g.lastPositions.set(A,I),M?A.style.transform=y?`translate3d(${I}px, 0, 0)`:`translate3d(0, ${I}px, 0)`:A.style[T]=`${I}px`)}},f={...i,onChange:(m,g)=>{var y;const M=l.current;let T=!0;if(M.enabled){h(m);const S=m.range,x=M.prevRange;T=!x||x.isScrolling!==m.isScrolling||x.startIndex!==(S==null?void 0:S.startIndex)||x.endIndex!==(S==null?void 0:S.endIndex),T&&(M.prevRange=S?{startIndex:S.startIndex,endIndex:S.endIndex,isScrolling:m.isScrolling}:null)}T&&(s&&g&&!c.current?uS.flushSync(a):a()),(y=i.onChange)==null||y.call(i,m,g)}},[_]=on.useState(()=>{const m=new wS(f),g=m.measureElement;return m.measureElement=y=>{c.current=!0;try{g(y)}finally{c.current=!1}},Object.assign(m,{containerRef:y=>{const M=l.current;if(M.container=y,M.lastSize=null,y&&M.enabled){const T=m.getTotalSize();M.lastSize=T;const S=m.options.horizontal?"width":"height";y.style[S]=`${T}px`}}})});return _.setOptions(f),nh(()=>_._didMount(),[]),nh(()=>(d(_),_._willUpdate())),nh(()=>{h(_)}),_}function CS(s){return AS({observeElementRect:gS,observeElementOffset:vS,scrollToFn:MS,...s})}const RS=()=>{const{catalog:s,framesById:e,selectedCanId:t,selectMessage:i,filterAccess:a,filterBus:l,searchQuery:c}=vn(),d=on.useRef(null),[h,f]=ds.useState("id"),[_,m]=ds.useState("asc"),g=x=>{h===x?m(R=>R==="asc"?"desc":"asc"):(f(x),m(x==="rate"||x==="count"?"desc":"asc"))},y=on.useMemo(()=>{const x=c.trim().toLowerCase();return s.filter(R=>{if(a!=="all"&&R.access.toLowerCase()!==a||l!=="all"&&R.bus.toLowerCase()!==l)return!1;if(x){const I=R.id_hex.toLowerCase(),A=R.id.toString(),P=R.key.toLowerCase(),L=R.name.toLowerCase();if(!I.includes(x)&&!A.includes(x)&&!P.includes(x)&&!L.includes(x))return!1}return!0})},[s,a,l,c]),M=on.useMemo(()=>{const x=[...y],R=_==="asc"?1:-1;return x.sort((I,A)=>{var P,L,U,b;switch(h){case"id":return(I.id-A.id)*R;case"name":return(I.name||I.key).localeCompare(A.name||A.key)*R;case"access":return I.access.localeCompare(A.access)*R;case"bus":return I.bus.localeCompare(A.bus)*R;case"cycle_ms":return(I.cycle_ms-A.cycle_ms)*R;case"rate":{const D=((P=e[I.id])==null?void 0:P.rate_hz)||0,B=((L=e[A.id])==null?void 0:L.rate_hz)||0;return(D-B)*R}case"count":{const D=((U=e[I.id])==null?void 0:U.count)||0,B=((b=e[A.id])==null?void 0:b.count)||0;return(D-B)*R}default:return 0}}),x},[y,h,_,e]),T=CS({count:M.length,getScrollElement:()=>d.current,estimateSize:()=>40,overscan:10}),S=x=>h!==x?E.jsx("span",{className:"text-[8px] text-neutral-600 ml-1",children:"⇅"}):E.jsx("span",{className:"text-[9px] text-cyan-400 font-bold ml-1",children:_==="asc"?"▲":"▼"});return E.jsxs("div",{className:"flex-1 flex flex-col min-w-0 bg-black border-r border-neutral-800 h-full overflow-hidden",children:[E.jsxs("div",{className:"h-8 bg-[#0a0a0a] border-b border-neutral-800 px-3 flex items-center text-[10px] font-mono font-bold uppercase text-neutral-400 select-none shrink-0 tracking-wider",children:[E.jsxs("div",{onClick:()=>g("access"),className:"w-12 shrink-0 text-center cursor-pointer hover:text-cyan-300 flex items-center justify-center transition-colors",title:"Sort by Access (TX/RX)",children:[E.jsx("span",{children:"ACC"}),S("access")]}),E.jsxs("div",{onClick:()=>g("id"),className:"w-20 shrink-0 cursor-pointer hover:text-cyan-300 flex items-center transition-colors",title:"Sort by CAN Identifier",children:[E.jsx("span",{children:"CAN ID"}),S("id")]}),E.jsxs("div",{onClick:()=>g("name"),className:"flex-1 min-w-[140px] cursor-pointer hover:text-cyan-300 flex items-center transition-colors",title:"Sort by Message Name",children:[E.jsx("span",{children:"MESSAGE NAME"}),S("name")]}),E.jsxs("div",{onClick:()=>g("bus"),className:"w-14 shrink-0 text-center cursor-pointer hover:text-cyan-300 flex items-center justify-center transition-colors",title:"Sort by CAN Bus",children:[E.jsx("span",{children:"BUS"}),S("bus")]}),E.jsxs("div",{onClick:()=>g("cycle_ms"),className:"w-14 shrink-0 text-right cursor-pointer hover:text-cyan-300 flex items-center justify-end transition-colors",title:"Sort by Cycle Time (ms)",children:[E.jsx("span",{children:"CYC"}),S("cycle_ms")]}),E.jsxs("div",{onClick:()=>g("rate"),className:"w-14 shrink-0 text-right cursor-pointer hover:text-cyan-300 flex items-center justify-end transition-colors",title:"Sort by Live Frequency (Hz)",children:[E.jsx("span",{children:"RATE"}),S("rate")]}),E.jsxs("div",{onClick:()=>g("count"),className:"w-16 shrink-0 text-right cursor-pointer hover:text-cyan-300 flex items-center justify-end transition-colors",title:"Sort by Total Frame Count",children:[E.jsx("span",{children:"COUNT"}),S("count")]}),E.jsx("div",{className:"w-52 shrink-0 pl-3",children:"DATA PAYLOAD (HEX)"})]}),E.jsx("div",{ref:d,className:"flex-1 overflow-y-auto min-h-0 divide-y divide-neutral-900",children:M.length===0?E.jsx("div",{className:"h-48 flex items-center justify-center text-xs font-mono text-neutral-500",children:"No CAN messages match the current filter"}):E.jsx("div",{style:{height:`${T.getTotalSize()}px`,width:"100%",position:"relative"},children:T.getVirtualItems().map(x=>{var U;const R=M[x.index],I=e[R.id],A=R.id===t;let P=[];I&&I.data_hex&&(I.data_hex.includes(" ")?P=I.data_hex.trim().split(/\s+/):P=I.data_hex.match(/.{1,2}/g)||[]);const L=Array.from({length:8},(b,D)=>D<P.length?P[D].padStart(2,"0").toUpperCase():"--");return E.jsxs("div",{onClick:()=>i(R.id),style:{position:"absolute",top:0,left:0,width:"100%",height:`${x.size}px`,transform:`translateY(${x.start}px)`},className:`flex items-center px-3 text-xs font-mono cursor-pointer transition-colors border-l-4 ${A?"bg-[#141414] text-white border-l-cyan-400 font-medium":"hover:bg-[#0f0f0f] text-neutral-300 border-l-transparent"}`,children:[E.jsx("div",{className:"w-12 shrink-0 text-center",children:E.jsx("span",{className:`text-[9px] font-bold px-1.5 py-0.5 rounded ${R.access==="RX"?"bg-emerald-500/15 text-emerald-300 border border-emerald-500/30":"bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"}`,children:R.access})}),E.jsxs("div",{className:"w-20 shrink-0 flex flex-col justify-center",children:[E.jsx("span",{className:"font-bold text-neutral-100 tracking-wide",children:R.id_hex}),E.jsxs("span",{className:"text-[10px] text-neutral-500",children:["#",R.id]})]}),E.jsxs("div",{className:"flex-1 min-w-[140px] truncate pr-2",children:[E.jsx("div",{className:"truncate font-bold text-neutral-100",title:R.name,children:R.key}),E.jsxs("div",{className:"text-[10px] text-neutral-500 truncate",children:[R.sender," → ",((U=R.receivers)==null?void 0:U.join(", "))||"ALL"]})]}),E.jsx("div",{className:"w-14 shrink-0 text-center",children:E.jsx("span",{className:`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${R.bus.toLowerCase()==="high"?"bg-purple-950/60 text-purple-300 border border-purple-800/60":"bg-neutral-900 text-neutral-300 border border-neutral-800"}`,children:R.bus.toUpperCase()})}),E.jsx("div",{className:"w-14 shrink-0 text-right text-neutral-300 text-[11px] tabular-nums font-semibold",children:R.cycle_ms?`${R.cycle_ms}ms`:"—"}),E.jsx("div",{className:"w-14 shrink-0 text-right tabular-nums text-[11px]",children:I&&I.rate_hz>0?E.jsxs("span",{className:"text-emerald-400 font-bold",children:[I.rate_hz.toFixed(1)," ",E.jsx("span",{className:"text-[9px] text-neutral-500 font-normal",children:"Hz"})]}):E.jsx("span",{className:"text-neutral-600",children:"0.0"})}),E.jsx("div",{className:"w-16 shrink-0 text-right tabular-nums text-neutral-400 text-[11px] font-medium",children:I?I.count.toLocaleString():"0"}),E.jsx("div",{className:"w-52 shrink-0 pl-3 flex items-center gap-1 font-mono text-[11px]",children:L.map((b,D)=>E.jsx("span",{className:`px-1 py-0.5 rounded text-center min-w-[20px] ${b==="--"?"text-neutral-700 bg-neutral-950":A?"text-cyan-200 font-bold bg-cyan-950 border border-cyan-800":"text-neutral-200 bg-[#121212] font-semibold border border-neutral-800"}`,children:b},D))})]},R.id)})})}),E.jsxs("div",{className:"h-6 bg-[#0a0a0a] border-t border-neutral-800 px-3 flex items-center justify-between text-[10px] font-mono text-neutral-400 select-none shrink-0",children:[E.jsxs("span",{children:["Showing ",E.jsx("strong",{className:"text-neutral-200",children:y.length})," of"," ",E.jsx("strong",{className:"text-neutral-200",children:s.length})," messages"]}),E.jsx("span",{className:"text-neutral-500",children:"Click a message row to inspect payload matrix"})]})]})},PS=()=>{const{catalog:s,selectedCanId:e,framesById:t,hoveredSignal:i,setHoveredSignal:a}=vn(),l=s.find(_=>_.id===e),c=t[e],d=(l==null?void 0:l.dlc)??8,h=Array.from({length:8},()=>[]);if(c&&c.bit_cells&&c.bit_cells.length===64)for(const _ of c.bit_cells)h[_.byte].push(_);else{const _=(l==null?void 0:l.signals)||[];for(let m=0;m<8;m++)for(let g=0;g<8;g++){let y=null,M=null;for(const T of _){const S=m*8+g,x=T.byte*8+T.bit,R=x+T.bits;if(S>=x&&S<R){y=T.name,M=T.color;break}}h[m].push({index:m*8+g,byte:m,bit:g,val:0,owner:y,color:M})}}for(let _=0;_<8;_++)h[_].sort((m,g)=>g.bit-m.bit);let f=[];return c&&c.data_hex&&(c.data_hex.includes(" ")?f=c.data_hex.trim().split(/\s+/):f=c.data_hex.match(/.{1,2}/g)||[]),E.jsxs("div",{className:"bg-black border-b border-neutral-800 p-3 select-none shrink-0",children:[E.jsxs("div",{className:"flex items-center justify-between pb-2 border-b border-neutral-800",children:[E.jsxs("div",{className:"flex items-center gap-2",children:[E.jsx("span",{className:"text-sm font-black text-cyan-400 font-mono tracking-wide",children:(l==null?void 0:l.id_hex)||"0x000"}),E.jsx("span",{className:"text-sm font-bold text-neutral-100 font-mono",children:(l==null?void 0:l.key)||"SELECT A MESSAGE"}),l&&E.jsx("span",{className:`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${l.access==="RX"?"bg-emerald-500/15 text-emerald-300 border border-emerald-500/30":"bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"}`,children:l.access})]}),E.jsxs("div",{className:"flex items-center gap-3 text-[11px] font-mono text-neutral-300",children:[E.jsxs("div",{children:["Rate:"," ",E.jsx("span",{className:"text-emerald-400 font-bold tabular-nums",children:c!=null&&c.rate_hz?`${c.rate_hz.toFixed(1)} Hz`:"0.0 Hz"})]}),E.jsx("div",{className:"text-neutral-700",children:"|"}),E.jsxs("div",{children:["DLC: ",E.jsx("span",{className:"text-neutral-100 font-bold",children:d})]}),E.jsx("div",{className:"text-neutral-700",children:"|"}),E.jsxs("div",{children:["Count:"," ",E.jsx("span",{className:"text-neutral-100 font-bold tabular-nums",children:(c==null?void 0:c.count.toLocaleString())||"0"})]})]})]}),E.jsxs("div",{className:"flex items-center justify-between mt-2.5 mb-1.5 text-[10px] font-mono",children:[E.jsx("div",{className:"font-bold text-neutral-300 tracking-wider",children:"64-BIT PAYLOAD MATRIX (8 BYTES × 8 BITS)"}),E.jsxs("div",{className:"flex items-center gap-1.5 text-neutral-500 font-semibold",children:[E.jsx("span",{children:"← MSB (Bit 7)"}),E.jsx("span",{children:"•"}),E.jsx("span",{children:"LSB (Bit 0) →"})]})]}),E.jsxs("div",{className:"bg-[#080808] p-2.5 rounded-lg border border-neutral-800",children:[E.jsxs("div",{className:"grid grid-cols-[68px_repeat(8,1fr)] gap-1 mb-1 text-center font-mono text-[10px] text-neutral-500 font-bold",children:[E.jsx("div",{className:"text-left text-neutral-500 pl-1",children:"BYTE"}),E.jsx("div",{children:"b7"}),E.jsx("div",{children:"b6"}),E.jsx("div",{children:"b5"}),E.jsx("div",{children:"b4"}),E.jsx("div",{children:"b3"}),E.jsx("div",{children:"b2"}),E.jsx("div",{children:"b1"}),E.jsx("div",{children:"b0"})]}),E.jsx("div",{className:"space-y-1",children:h.map((_,m)=>{const g=(f[m]||"00").padStart(2,"0").toUpperCase(),y=m>=d;return E.jsxs("div",{className:`grid grid-cols-[68px_repeat(8,1fr)] gap-1 items-center font-mono transition-opacity ${y?"opacity-35":"opacity-100"}`,children:[E.jsxs("div",{className:`flex items-center justify-between text-[10px] px-1.5 py-1 rounded border font-semibold ${y?"bg-neutral-950 text-neutral-600 border-neutral-900":"bg-[#0f0f0f] text-neutral-300 border-neutral-800"}`,title:y?`Byte ${m} is beyond DLC ${d} (Padding)`:`Byte ${m}: 0x${g}`,children:[E.jsxs("span",{className:"text-neutral-500 text-[9px] font-mono",children:["B",m]}),E.jsx("span",{className:"text-cyan-300 font-bold text-[11px] font-mono",children:g})]}),_.map(M=>{const T=!y&&!!i&&M.owner===i,S=!!M.owner&&!y,x=M.color||"#262626";return E.jsx("div",{onMouseEnter:()=>!y&&M.owner&&a(M.owner),onMouseLeave:()=>a(null),style:{backgroundColor:T?`${x}ee`:S?`${x}40`:"#0c0c0c",borderColor:T?"#ffffff":S?`${x}cc`:"#1c1c1c"},className:`h-7 rounded flex items-center justify-center text-xs font-mono transition-all border cursor-pointer select-none tabular-nums ${M.val===1?"text-white font-black drop-shadow-[0_0_4px_rgba(255,255,255,0.7)]":"text-neutral-400 font-bold"} ${T?"scale-110 shadow-lg shadow-cyan-500/30 z-10 ring-2 ring-white":""}`,title:y?`Byte ${M.byte}, Bit ${M.bit} [Beyond DLC ${d}]`:M.owner?`Byte ${M.byte}, Bit ${M.bit} | Signal: ${M.owner} | Val: ${M.val}`:`Byte ${M.byte}, Bit ${M.bit} | Unmapped | Val: ${M.val}`,children:M.val},M.bit)})]},m)})})]}),E.jsx("div",{className:"mt-2 h-6 flex items-center justify-between text-[11px] font-mono px-1",children:i?E.jsxs("div",{className:"flex items-center gap-2",children:[E.jsx("span",{className:"text-neutral-400 font-medium",children:"Highlighted Signal:"}),E.jsx("span",{className:"font-bold text-cyan-300 bg-[#141414] px-2 py-0.5 rounded border border-cyan-800",children:i})]}):E.jsx("span",{className:"text-neutral-500",children:"Hover any bit or signal below to inspect bit-field mapping"})})]})};function NS(s,e){if(e&&e.trim().length>0)return e;const t=s.toLowerCase();return t.endsWith("_mmps")?"mm/s":t.endsWith("_mrad_s")?"mrad/s":t.endsWith("_kpa")?"kPa":t.endsWith("_deg")?"deg":t.endsWith("_kmh")?"km/h":t.endsWith("_mv")?"mV":t.endsWith("_ma")?"mA":t.endsWith("_c")?"°C":t.endsWith("_pct")||t.endsWith("_percent")?"%":t.endsWith("_count")||t.endsWith("_counter")?"cnt":t.startsWith("light_")||t.endsWith("_ok")||t.endsWith("_valid")||t.endsWith("_active")?"flag":""}const LS=()=>{const{catalog:s,selectedCanId:e,framesById:t,hoveredSignal:i,setHoveredSignal:a}=vn(),l=s.find(h=>h.id===e),c=t[e],d=(l==null?void 0:l.signals)||[];return ds.useEffect(()=>{const h=f=>{var m;const _=(m=f.target)==null?void 0:m.tagName;if(!(_==="INPUT"||_==="TEXTAREA")&&d.length!==0)if(f.key==="ArrowDown"||f.key==="ArrowUp"){f.preventDefault();const g=d.findIndex(T=>T.name===i);let y=0;f.key==="ArrowDown"?y=g===-1?0:(g+1)%d.length:f.key==="ArrowUp"&&(y=g<=0?d.length-1:g-1);const M=d[y];if(M){a(M.name);const T=document.getElementById(`signal-row-${M.name}`);T&&T.scrollIntoView({block:"nearest",behavior:"smooth"})}}else f.key==="Escape"&&a(null)};return window.addEventListener("keydown",h),()=>window.removeEventListener("keydown",h)},[d,i,a]),E.jsxs("div",{className:"flex-1 flex flex-col min-h-0 bg-black overflow-hidden",children:[E.jsxs("div",{className:"h-8 bg-[#0a0a0a] border-b border-neutral-800 px-3 flex items-center justify-between select-none shrink-0",children:[E.jsxs("div",{className:"flex items-center gap-2",children:[E.jsxs("span",{className:"text-[10px] font-mono font-bold uppercase text-neutral-300 tracking-wider",children:["DECODED SIGNALS (",d.length,")"]}),E.jsx("span",{className:"text-[9px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/60 font-medium",children:"[↑/↓] Select • [Esc] Clear"})]}),E.jsx("span",{className:"text-[10px] font-mono text-neutral-500 font-medium",children:"Bi-Directional Bit Matrix Mapping"})]}),E.jsxs("div",{className:"h-7 bg-[#0a0a0a]/90 border-b border-neutral-800 px-3 flex items-center text-[10px] font-mono font-bold uppercase text-neutral-400 select-none shrink-0",children:[E.jsx("div",{className:"w-5"}),E.jsx("div",{className:"w-40",children:"SIGNAL NAME"}),E.jsx("div",{className:"w-28 text-right pr-2",children:"PHYS VALUE"}),E.jsx("div",{className:"w-16 text-right pr-2",children:"RAW"}),E.jsx("div",{className:"w-24",children:"BIT RANGE"}),E.jsx("div",{className:"w-14",children:"ENDIAN"}),E.jsx("div",{className:"flex-1 pl-1 whitespace-nowrap",children:"SCALE / RANGE"})]}),E.jsx("div",{className:"flex-1 overflow-y-auto divide-y divide-neutral-900 bg-black",children:d.length===0?E.jsx("div",{className:"h-32 flex items-center justify-center text-xs font-mono text-neutral-500",children:"No signals mapped for this message key"}):d.map(h=>{const f=i===h.name,_=c!=null&&c.signals?c.signals[h.name]:null;let m="—";_&&_.value!==void 0&&(typeof _.value=="number"?m=Number.isInteger(_.value)?_.value.toString():_.value.toFixed(2):m=String(_.value));let g="—";if(_&&_.raw!==void 0){const M=Number(_.raw);if(h.signed&&M<0){const T=(1<<h.bits)-1;g=`0x${((M&T)>>>0).toString(16).toUpperCase()}`}else g=`0x${M.toString(16).toUpperCase()}`}const y=NS(h.name,h.unit);return E.jsxs("div",{id:`signal-row-${h.name}`,onClick:()=>a(f?null:h.name),onMouseEnter:()=>a(h.name),onMouseLeave:()=>a(null),className:`flex items-center px-3 py-1.5 text-xs font-mono transition-all cursor-pointer ${f?"bg-[#141414] text-white ring-1 ring-cyan-500/50 border-l-4 border-cyan-400":"hover:bg-[#0d0d0d] text-neutral-300 border-l-4 border-transparent"}`,children:[E.jsx("div",{className:"w-5 flex items-center",children:E.jsx("span",{className:`w-3 h-3 rounded-full inline-block shrink-0 shadow-sm transition-transform ${f?"scale-125 ring-2 ring-white":""}`,style:{backgroundColor:h.color}})}),E.jsxs("div",{className:"w-40 truncate pr-2 font-medium",title:h.name,children:[E.jsx("span",{className:f?"text-cyan-300 font-bold":"text-neutral-200 font-semibold",children:h.name}),h.comment&&E.jsx("span",{className:"block text-[9px] text-neutral-500 truncate font-normal",children:h.comment})]}),E.jsxs("div",{className:"w-28 text-right pr-2",children:[E.jsx("span",{className:"text-emerald-400 font-black tabular-nums text-[13px]",children:m}),y&&E.jsx("span",{className:"ml-1 text-[10px] text-neutral-500 font-medium",children:y})]}),E.jsx("div",{className:"w-16 text-right pr-2 text-neutral-300 text-[11px] tabular-nums font-semibold",children:g}),E.jsxs("div",{className:"w-24 text-[10px] text-neutral-300",children:[E.jsxs("span",{className:"font-bold",children:["B",h.byte,":b",h.bit]}),E.jsxs("span",{className:"text-neutral-500 text-[9px] ml-1",children:["(",h.bits,"b)"]})]}),E.jsxs("div",{className:"w-14 text-[10px] text-neutral-400 uppercase font-semibold",children:[E.jsx("span",{className:h.endian==="big"?"text-purple-300":"text-blue-300",children:h.endian==="big"?"BE":"LE"})," ",E.jsx("span",{className:h.signed?"text-amber-300":"text-emerald-300",children:h.signed?"S":"U"})]}),E.jsxs("div",{className:"flex-1 text-[10px] text-neutral-300 truncate pl-1",children:[h.scale===1&&h.offset===0?E.jsx("span",{className:"text-neutral-500",children:"1:1"}):E.jsxs("span",{className:"text-neutral-300",children:["×",h.scale," + ",h.offset]}),h.min_val!==null&&h.max_val!==null&&E.jsxs("span",{className:"ml-2 text-neutral-500 text-[9px]",children:["[",h.min_val,", ",h.max_val,"]"]})]})]},h.name)})})]})};/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ff="186",Ba={ROTATE:0,DOLLY:1,PAN:2},Oa={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},DS=0,W0=1,IS=2,qc=1,A_=2,Ko=3,Xs=0,ti=1,tr=2,Rr=0,el=1,j0=2,X0=3,q0=4,US=5,Fa=100,FS=101,OS=102,kS=103,BS=104,zS=200,HS=201,VS=202,GS=203,C_=204,R_=205,WS=206,jS=207,XS=208,qS=209,YS=210,$S=211,KS=212,ZS=213,QS=214,Vh=0,Gh=1,Wh=2,il=3,jh=4,Xh=5,qh=6,Yh=7,Of=0,JS=1,eM=2,rr=0,P_=1,N_=2,L_=3,D_=4,I_=5,U_=6,F_=7,O_=300,qs=301,Qa=302,ih=303,rh=304,fu=306,$h=1e3,Cr=1001,Kh=1002,Rn=1003,tM=1004,xc=1005,Bn=1006,sh=1007,Os=1008,di=1009,k_=1010,B_=1011,rl=1012,kf=1013,ar=1014,Hi=1015,or=1016,Bf=1017,zf=1018,sl=1020,z_=35902,H_=35899,V_=1021,G_=1022,Vi=1023,Lr=1026,ks=1027,Hf=1028,Vf=1029,Ys=1030,Gf=1031,Wf=1033,Yc=33776,$c=33777,Kc=33778,Zc=33779,Zh=35840,Qh=35841,Jh=35842,ef=35843,tf=36196,nf=37492,rf=37496,sf=37488,af=37489,nu=37490,of=37491,lf=37808,cf=37809,uf=37810,df=37811,hf=37812,ff=37813,pf=37814,mf=37815,gf=37816,_f=37817,xf=37818,vf=37819,yf=37820,Sf=37821,Mf=36492,Ef=36494,wf=36495,bf=36283,Tf=36284,iu=36285,Af=36286,nM=3200,ru=0,iM=1,rs="",ci="srgb",su="srgb-linear",au="linear",kt="srgb",ah=7680,rM=519,sM=512,aM=513,oM=514,jf=515,lM=516,cM=517,Xf=518,uM=519,dM=35044,Y0="300 es",nr=2e3,al=2001;function hM(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function ou(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function fM(){const s=ou("canvas");return s.style.display="block",s}const $0={};function K0(...s){const e="THREE."+s.shift();console.log(e,...s)}function W_(s){const e=s[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=s[1];t&&t.isStackTrace?s[0]+=" "+t.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function at(...s){s=W_(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...s)}}function Dt(...s){s=W_(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...s)}}function za(...s){const e=s.join(" ");e in $0||($0[e]=!0,at(...s))}function pM(s,e,t){return new Promise(function(i,a){function l(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:a();break;case s.TIMEOUT_EXPIRED:setTimeout(l,t);break;default:i()}}setTimeout(l,t)})}const mM={[Vh]:Gh,[Wh]:qh,[jh]:Yh,[il]:Xh,[Gh]:Vh,[qh]:Wh,[Yh]:jh,[Xh]:il};class fs{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const a=i[e];if(a!==void 0){const l=a.indexOf(t);l!==-1&&a.splice(l,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const a=i.slice(0);for(let l=0,c=a.length;l<c;l++)a[l].call(this,e);e.target=null}}}const Fn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Qc=Math.PI/180,lu=180/Math.PI;function dl(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Fn[s&255]+Fn[s>>8&255]+Fn[s>>16&255]+Fn[s>>24&255]+"-"+Fn[e&255]+Fn[e>>8&255]+"-"+Fn[e>>16&15|64]+Fn[e>>24&255]+"-"+Fn[t&63|128]+Fn[t>>8&255]+"-"+Fn[t>>16&255]+Fn[t>>24&255]+Fn[i&255]+Fn[i>>8&255]+Fn[i>>16&255]+Fn[i>>24&255]).toLowerCase()}function yt(s,e,t){return Math.max(e,Math.min(t,s))}function gM(s,e){return(s%e+e)%e}function oh(s,e,t){return(1-t)*s+t*e}function zo(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:case Uint8ClampedArray:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Jn(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const _M={DEG2RAD:Qc},Jf=class Jf{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,a=e.elements;return this.x=a[0]*t+a[3]*i+a[6],this.y=a[1]*t+a[4]*i+a[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=yt(this.x,e.x,t.x),this.y=yt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=yt(this.x,e,t),this.y=yt(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(yt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(yt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),a=Math.sin(t),l=this.x-e.x,c=this.y-e.y;return this.x=l*i-c*a+e.x,this.y=l*a+c*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Jf.prototype.isVector2=!0;let ot=Jf;class hs{constructor(e=0,t=0,i=0,a=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=a}static slerpFlat(e,t,i,a,l,c,d){let h=i[a+0],f=i[a+1],_=i[a+2],m=i[a+3],g=l[c+0],y=l[c+1],M=l[c+2],T=l[c+3];if(m!==T||h!==g||f!==y||_!==M){let S=h*g+f*y+_*M+m*T;S<0&&(g=-g,y=-y,M=-M,T=-T,S=-S);let x=1-d;if(S<.9995){const R=Math.acos(S),I=Math.sin(R);x=Math.sin(x*R)/I,d=Math.sin(d*R)/I,h=h*x+g*d,f=f*x+y*d,_=_*x+M*d,m=m*x+T*d}else{h=h*x+g*d,f=f*x+y*d,_=_*x+M*d,m=m*x+T*d;const R=1/Math.sqrt(h*h+f*f+_*_+m*m);h*=R,f*=R,_*=R,m*=R}}e[t]=h,e[t+1]=f,e[t+2]=_,e[t+3]=m}static multiplyQuaternionsFlat(e,t,i,a,l,c){const d=i[a],h=i[a+1],f=i[a+2],_=i[a+3],m=l[c],g=l[c+1],y=l[c+2],M=l[c+3];return e[t]=d*M+_*m+h*y-f*g,e[t+1]=h*M+_*g+f*m-d*y,e[t+2]=f*M+_*y+d*g-h*m,e[t+3]=_*M-d*m-h*g-f*y,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,a){return this._x=e,this._y=t,this._z=i,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,a=e._y,l=e._z,c=e._order,d=Math.cos,h=Math.sin,f=d(i/2),_=d(a/2),m=d(l/2),g=h(i/2),y=h(a/2),M=h(l/2);switch(c){case"XYZ":this._x=g*_*m+f*y*M,this._y=f*y*m-g*_*M,this._z=f*_*M+g*y*m,this._w=f*_*m-g*y*M;break;case"YXZ":this._x=g*_*m+f*y*M,this._y=f*y*m-g*_*M,this._z=f*_*M-g*y*m,this._w=f*_*m+g*y*M;break;case"ZXY":this._x=g*_*m-f*y*M,this._y=f*y*m+g*_*M,this._z=f*_*M+g*y*m,this._w=f*_*m-g*y*M;break;case"ZYX":this._x=g*_*m-f*y*M,this._y=f*y*m+g*_*M,this._z=f*_*M-g*y*m,this._w=f*_*m+g*y*M;break;case"YZX":this._x=g*_*m+f*y*M,this._y=f*y*m+g*_*M,this._z=f*_*M-g*y*m,this._w=f*_*m-g*y*M;break;case"XZY":this._x=g*_*m-f*y*M,this._y=f*y*m-g*_*M,this._z=f*_*M+g*y*m,this._w=f*_*m+g*y*M;break;default:at("Quaternion: .setFromEuler() encountered an unknown order: "+c)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,a=Math.sin(i);return this._x=e.x*a,this._y=e.y*a,this._z=e.z*a,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],a=t[4],l=t[8],c=t[1],d=t[5],h=t[9],f=t[2],_=t[6],m=t[10],g=i+d+m;if(g>0){const y=.5/Math.sqrt(g+1);this._w=.25/y,this._x=(_-h)*y,this._y=(l-f)*y,this._z=(c-a)*y}else if(i>d&&i>m){const y=2*Math.sqrt(1+i-d-m);this._w=(_-h)/y,this._x=.25*y,this._y=(a+c)/y,this._z=(l+f)/y}else if(d>m){const y=2*Math.sqrt(1+d-i-m);this._w=(l-f)/y,this._x=(a+c)/y,this._y=.25*y,this._z=(h+_)/y}else{const y=2*Math.sqrt(1+m-i-d);this._w=(c-a)/y,this._x=(l+f)/y,this._y=(h+_)/y,this._z=.25*y}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(yt(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const a=Math.min(1,t/i);return this.slerp(e,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,a=e._y,l=e._z,c=e._w,d=t._x,h=t._y,f=t._z,_=t._w;return this._x=i*_+c*d+a*f-l*h,this._y=a*_+c*h+l*d-i*f,this._z=l*_+c*f+i*h-a*d,this._w=c*_-i*d-a*h-l*f,this._onChangeCallback(),this}slerp(e,t){let i=e._x,a=e._y,l=e._z,c=e._w,d=this.dot(e);d<0&&(i=-i,a=-a,l=-l,c=-c,d=-d);let h=1-t;if(d<.9995){const f=Math.acos(d),_=Math.sin(f);h=Math.sin(h*f)/_,t=Math.sin(t*f)/_,this._x=this._x*h+i*t,this._y=this._y*h+a*t,this._z=this._z*h+l*t,this._w=this._w*h+c*t,this._onChangeCallback()}else this._x=this._x*h+i*t,this._y=this._y*h+a*t,this._z=this._z*h+l*t,this._w=this._w*h+c*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),a=Math.sqrt(1-i),l=Math.sqrt(i);return this.set(a*Math.sin(e),a*Math.cos(e),l*Math.sin(t),l*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const ep=class ep{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Z0.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Z0.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,a=this.z,l=e.elements;return this.x=l[0]*t+l[3]*i+l[6]*a,this.y=l[1]*t+l[4]*i+l[7]*a,this.z=l[2]*t+l[5]*i+l[8]*a,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,a=this.z,l=e.elements,c=1/(l[3]*t+l[7]*i+l[11]*a+l[15]);return this.x=(l[0]*t+l[4]*i+l[8]*a+l[12])*c,this.y=(l[1]*t+l[5]*i+l[9]*a+l[13])*c,this.z=(l[2]*t+l[6]*i+l[10]*a+l[14])*c,this}applyQuaternion(e){const t=this.x,i=this.y,a=this.z,l=e.x,c=e.y,d=e.z,h=e.w,f=2*(c*a-d*i),_=2*(d*t-l*a),m=2*(l*i-c*t);return this.x=t+h*f+c*m-d*_,this.y=i+h*_+d*f-l*m,this.z=a+h*m+l*_-c*f,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,a=this.z,l=e.elements;return this.x=l[0]*t+l[4]*i+l[8]*a,this.y=l[1]*t+l[5]*i+l[9]*a,this.z=l[2]*t+l[6]*i+l[10]*a,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=yt(this.x,e.x,t.x),this.y=yt(this.y,e.y,t.y),this.z=yt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=yt(this.x,e,t),this.y=yt(this.y,e,t),this.z=yt(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(yt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,a=e.y,l=e.z,c=t.x,d=t.y,h=t.z;return this.x=a*h-l*d,this.y=l*c-i*h,this.z=i*d-a*c,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return lh.copy(this).projectOnVector(e),this.sub(lh)}reflect(e){return this.sub(lh.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(yt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,a=this.z-e.z;return t*t+i*i+a*a}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const a=Math.sin(t)*e;return this.x=a*Math.sin(i),this.y=Math.cos(t)*e,this.z=a*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),a=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=a,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};ep.prototype.isVector3=!0;let Y=ep;const lh=new Y,Z0=new hs,tp=class tp{constructor(e,t,i,a,l,c,d,h,f){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,a,l,c,d,h,f)}set(e,t,i,a,l,c,d,h,f){const _=this.elements;return _[0]=e,_[1]=a,_[2]=d,_[3]=t,_[4]=l,_[5]=h,_[6]=i,_[7]=c,_[8]=f,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,a=t.elements,l=this.elements,c=i[0],d=i[3],h=i[6],f=i[1],_=i[4],m=i[7],g=i[2],y=i[5],M=i[8],T=a[0],S=a[3],x=a[6],R=a[1],I=a[4],A=a[7],P=a[2],L=a[5],U=a[8];return l[0]=c*T+d*R+h*P,l[3]=c*S+d*I+h*L,l[6]=c*x+d*A+h*U,l[1]=f*T+_*R+m*P,l[4]=f*S+_*I+m*L,l[7]=f*x+_*A+m*U,l[2]=g*T+y*R+M*P,l[5]=g*S+y*I+M*L,l[8]=g*x+y*A+M*U,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],a=e[2],l=e[3],c=e[4],d=e[5],h=e[6],f=e[7],_=e[8];return t*c*_-t*d*f-i*l*_+i*d*h+a*l*f-a*c*h}invert(){const e=this.elements,t=e[0],i=e[1],a=e[2],l=e[3],c=e[4],d=e[5],h=e[6],f=e[7],_=e[8],m=_*c-d*f,g=d*h-_*l,y=f*l-c*h,M=t*m+i*g+a*y;if(M===0)return this.set(0,0,0,0,0,0,0,0,0);const T=1/M;return e[0]=m*T,e[1]=(a*f-_*i)*T,e[2]=(d*i-a*c)*T,e[3]=g*T,e[4]=(_*t-a*h)*T,e[5]=(a*l-d*t)*T,e[6]=y*T,e[7]=(i*h-f*t)*T,e[8]=(c*t-i*l)*T,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,a,l,c,d){const h=Math.cos(l),f=Math.sin(l);return this.set(i*h,i*f,-i*(h*c+f*d)+c+e,-a*f,a*h,-a*(-f*c+h*d)+d+t,0,0,1),this}scale(e,t){return za("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(ch.makeScale(e,t)),this}rotate(e){return za("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(ch.makeRotation(-e)),this}translate(e,t){return za("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(ch.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let a=0;a<9;a++)if(t[a]!==i[a])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};tp.prototype.isMatrix3=!0;let ft=tp;const ch=new ft,Q0=new ft().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),J0=new ft().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function xM(){const s={enabled:!0,workingColorSpace:su,spaces:{},convert:function(a,l,c){return this.enabled===!1||l===c||!l||!c||(this.spaces[l].transfer===kt&&(a.r=Pr(a.r),a.g=Pr(a.g),a.b=Pr(a.b)),this.spaces[l].primaries!==this.spaces[c].primaries&&(a.applyMatrix3(this.spaces[l].toXYZ),a.applyMatrix3(this.spaces[c].fromXYZ)),this.spaces[c].transfer===kt&&(a.r=Ha(a.r),a.g=Ha(a.g),a.b=Ha(a.b))),a},workingToColorSpace:function(a,l){return this.convert(a,this.workingColorSpace,l)},colorSpaceToWorking:function(a,l){return this.convert(a,l,this.workingColorSpace)},getPrimaries:function(a){return this.spaces[a].primaries},getTransfer:function(a){return a===rs?au:this.spaces[a].transfer},getToneMappingMode:function(a){return this.spaces[a].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(a,l=this.workingColorSpace){return a.fromArray(this.spaces[l].luminanceCoefficients)},define:function(a){Object.assign(this.spaces,a)},_getMatrix:function(a,l,c){return a.copy(this.spaces[l].toXYZ).multiply(this.spaces[c].fromXYZ)},_getDrawingBufferColorSpace:function(a){return this.spaces[a].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(a=this.workingColorSpace){return this.spaces[a].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(a,l){return za("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(a,l)},toWorkingColorSpace:function(a,l){return za("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(a,l)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return s.define({[su]:{primaries:e,whitePoint:i,transfer:au,toXYZ:Q0,fromXYZ:J0,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:ci},outputColorSpaceConfig:{drawingBufferColorSpace:ci}},[ci]:{primaries:e,whitePoint:i,transfer:kt,toXYZ:Q0,fromXYZ:J0,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:ci}}}),s}const wt=xM();function Pr(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Ha(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let Ma;class vM{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Ma===void 0&&(Ma=ou("canvas")),Ma.width=e.width,Ma.height=e.height;const a=Ma.getContext("2d");e instanceof ImageData?a.putImageData(e,0,0):a.drawImage(e,0,0,e.width,e.height),i=Ma}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=ou("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const a=i.getImageData(0,0,e.width,e.height),l=a.data;for(let c=0;c<l.length;c++)l[c]=Pr(l[c]/255)*255;return i.putImageData(a,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Pr(t[i]/255)*255):t[i]=Pr(t[i]);return{data:t,width:e.width,height:e.height}}else return at("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let yM=0;class qf{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:yM++}),this.uuid=dl(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},a=this.data;if(a!==null){let l;if(Array.isArray(a)){l=[];for(let c=0,d=a.length;c<d;c++)a[c].isDataTexture?l.push(uh(a[c].image)):l.push(uh(a[c]))}else l=uh(a);i.url=l}return t||(e.images[this.uuid]=i),i}}function uh(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?vM.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(at("Texture: Unable to serialize Texture."),{})}let SM=0;const dh=new Y;class jn extends fs{constructor(e=jn.DEFAULT_IMAGE,t=jn.DEFAULT_MAPPING,i=Cr,a=Cr,l=Bn,c=Os,d=Vi,h=di,f=jn.DEFAULT_ANISOTROPY,_=rs){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:SM++}),this.uuid=dl(),this.name="",this.source=new qf(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=l,this.minFilter=c,this.anisotropy=f,this.format=d,this.internalFormat=null,this.type=h,this.offset=new ot(0,0),this.repeat=new ot(1,1),this.center=new ot(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ft,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=_,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(dh).x}get height(){return this.source.getSize(dh).y}get depth(){return this.source.getSize(dh).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){at(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const a=this[t];if(a===void 0){at(`Texture.setValues(): property '${t}' does not exist.`);continue}a&&i&&a.isVector2&&i.isVector2||a&&i&&a.isVector3&&i.isVector3||a&&i&&a.isMatrix3&&i.isMatrix3?a.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==O_)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case $h:e.x=e.x-Math.floor(e.x);break;case Cr:e.x=e.x<0?0:1;break;case Kh:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case $h:e.y=e.y-Math.floor(e.y);break;case Cr:e.y=e.y<0?0:1;break;case Kh:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}jn.DEFAULT_IMAGE=null;jn.DEFAULT_MAPPING=O_;jn.DEFAULT_ANISOTROPY=1;const np=class np{constructor(e=0,t=0,i=0,a=1){this.x=e,this.y=t,this.z=i,this.w=a}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,a){return this.x=e,this.y=t,this.z=i,this.w=a,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,a=this.z,l=this.w,c=e.elements;return this.x=c[0]*t+c[4]*i+c[8]*a+c[12]*l,this.y=c[1]*t+c[5]*i+c[9]*a+c[13]*l,this.z=c[2]*t+c[6]*i+c[10]*a+c[14]*l,this.w=c[3]*t+c[7]*i+c[11]*a+c[15]*l,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,a,l;const h=e.elements,f=h[0],_=h[4],m=h[8],g=h[1],y=h[5],M=h[9],T=h[2],S=h[6],x=h[10];if(Math.abs(_-g)<.01&&Math.abs(m-T)<.01&&Math.abs(M-S)<.01){if(Math.abs(_+g)<.1&&Math.abs(m+T)<.1&&Math.abs(M+S)<.1&&Math.abs(f+y+x-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const I=(f+1)/2,A=(y+1)/2,P=(x+1)/2,L=(_+g)/4,U=(m+T)/4,b=(M+S)/4;return I>A&&I>P?I<.01?(i=0,a=.707106781,l=.707106781):(i=Math.sqrt(I),a=L/i,l=U/i):A>P?A<.01?(i=.707106781,a=0,l=.707106781):(a=Math.sqrt(A),i=L/a,l=b/a):P<.01?(i=.707106781,a=.707106781,l=0):(l=Math.sqrt(P),i=U/l,a=b/l),this.set(i,a,l,t),this}let R=Math.sqrt((S-M)*(S-M)+(m-T)*(m-T)+(g-_)*(g-_));return Math.abs(R)<.001&&(R=1),this.x=(S-M)/R,this.y=(m-T)/R,this.z=(g-_)/R,this.w=Math.acos((f+y+x-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=yt(this.x,e.x,t.x),this.y=yt(this.y,e.y,t.y),this.z=yt(this.z,e.z,t.z),this.w=yt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=yt(this.x,e,t),this.y=yt(this.y,e,t),this.z=yt(this.z,e,t),this.w=yt(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(yt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};np.prototype.isVector4=!0;let nn=np;class MM extends fs{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Bn,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new nn(0,0,e,t),this.scissorTest=!1,this.viewport=new nn(0,0,e,t),this.textures=[];const a={width:e,height:t,depth:i.depth},l=new jn(a),c=i.count;for(let d=0;d<c;d++)this.textures[d]=l.clone(),this.textures[d].isRenderTargetTexture=!0,this.textures[d].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:Bn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let a=0,l=this.textures.length;a<l;a++)this.textures[a].image.width=e,this.textures[a].image.height=t,this.textures[a].image.depth=i,this.textures[a].isData3DTexture!==!0&&(this.textures[a].isArrayTexture=this.textures[a].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const a=Object.assign({},e.textures[t].image);this.textures[t].source=new qf(a)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Gi extends MM{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class j_ extends jn{constructor(e=null,t=1,i=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:a},this.magFilter=Rn,this.minFilter=Rn,this.wrapR=Cr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class EM extends jn{constructor(e=null,t=1,i=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:a},this.magFilter=Rn,this.minFilter=Rn,this.wrapR=Cr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}const du=class du{constructor(e,t,i,a,l,c,d,h,f,_,m,g,y,M,T,S){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,a,l,c,d,h,f,_,m,g,y,M,T,S)}set(e,t,i,a,l,c,d,h,f,_,m,g,y,M,T,S){const x=this.elements;return x[0]=e,x[4]=t,x[8]=i,x[12]=a,x[1]=l,x[5]=c,x[9]=d,x[13]=h,x[2]=f,x[6]=_,x[10]=m,x[14]=g,x[3]=y,x[7]=M,x[11]=T,x[15]=S,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new du().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,i=e.elements,a=1/Ea.setFromMatrixColumn(e,0).length(),l=1/Ea.setFromMatrixColumn(e,1).length(),c=1/Ea.setFromMatrixColumn(e,2).length();return t[0]=i[0]*a,t[1]=i[1]*a,t[2]=i[2]*a,t[3]=0,t[4]=i[4]*l,t[5]=i[5]*l,t[6]=i[6]*l,t[7]=0,t[8]=i[8]*c,t[9]=i[9]*c,t[10]=i[10]*c,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,a=e.y,l=e.z,c=Math.cos(i),d=Math.sin(i),h=Math.cos(a),f=Math.sin(a),_=Math.cos(l),m=Math.sin(l);if(e.order==="XYZ"){const g=c*_,y=c*m,M=d*_,T=d*m;t[0]=h*_,t[4]=-h*m,t[8]=f,t[1]=y+M*f,t[5]=g-T*f,t[9]=-d*h,t[2]=T-g*f,t[6]=M+y*f,t[10]=c*h}else if(e.order==="YXZ"){const g=h*_,y=h*m,M=f*_,T=f*m;t[0]=g+T*d,t[4]=M*d-y,t[8]=c*f,t[1]=c*m,t[5]=c*_,t[9]=-d,t[2]=y*d-M,t[6]=T+g*d,t[10]=c*h}else if(e.order==="ZXY"){const g=h*_,y=h*m,M=f*_,T=f*m;t[0]=g-T*d,t[4]=-c*m,t[8]=M+y*d,t[1]=y+M*d,t[5]=c*_,t[9]=T-g*d,t[2]=-c*f,t[6]=d,t[10]=c*h}else if(e.order==="ZYX"){const g=c*_,y=c*m,M=d*_,T=d*m;t[0]=h*_,t[4]=M*f-y,t[8]=g*f+T,t[1]=h*m,t[5]=T*f+g,t[9]=y*f-M,t[2]=-f,t[6]=d*h,t[10]=c*h}else if(e.order==="YZX"){const g=c*h,y=c*f,M=d*h,T=d*f;t[0]=h*_,t[4]=T-g*m,t[8]=M*m+y,t[1]=m,t[5]=c*_,t[9]=-d*_,t[2]=-f*_,t[6]=y*m+M,t[10]=g-T*m}else if(e.order==="XZY"){const g=c*h,y=c*f,M=d*h,T=d*f;t[0]=h*_,t[4]=-m,t[8]=f*_,t[1]=g*m+T,t[5]=c*_,t[9]=y*m-M,t[2]=M*m-y,t[6]=d*_,t[10]=T*m+g}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(wM,e,bM)}lookAt(e,t,i){const a=this.elements;return oi.subVectors(e,t),oi.lengthSq()===0&&(oi.z=1),oi.normalize(),Qr.crossVectors(i,oi),Qr.lengthSq()===0&&(Math.abs(i.z)===1?oi.x+=1e-4:oi.z+=1e-4,oi.normalize(),Qr.crossVectors(i,oi)),Qr.normalize(),vc.crossVectors(oi,Qr),a[0]=Qr.x,a[4]=vc.x,a[8]=oi.x,a[1]=Qr.y,a[5]=vc.y,a[9]=oi.y,a[2]=Qr.z,a[6]=vc.z,a[10]=oi.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,a=t.elements,l=this.elements,c=i[0],d=i[4],h=i[8],f=i[12],_=i[1],m=i[5],g=i[9],y=i[13],M=i[2],T=i[6],S=i[10],x=i[14],R=i[3],I=i[7],A=i[11],P=i[15],L=a[0],U=a[4],b=a[8],D=a[12],B=a[1],V=a[5],G=a[9],J=a[13],H=a[2],Z=a[6],he=a[10],ne=a[14],ee=a[3],$=a[7],K=a[11],F=a[15];return l[0]=c*L+d*B+h*H+f*ee,l[4]=c*U+d*V+h*Z+f*$,l[8]=c*b+d*G+h*he+f*K,l[12]=c*D+d*J+h*ne+f*F,l[1]=_*L+m*B+g*H+y*ee,l[5]=_*U+m*V+g*Z+y*$,l[9]=_*b+m*G+g*he+y*K,l[13]=_*D+m*J+g*ne+y*F,l[2]=M*L+T*B+S*H+x*ee,l[6]=M*U+T*V+S*Z+x*$,l[10]=M*b+T*G+S*he+x*K,l[14]=M*D+T*J+S*ne+x*F,l[3]=R*L+I*B+A*H+P*ee,l[7]=R*U+I*V+A*Z+P*$,l[11]=R*b+I*G+A*he+P*K,l[15]=R*D+I*J+A*ne+P*F,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],a=e[8],l=e[12],c=e[1],d=e[5],h=e[9],f=e[13],_=e[2],m=e[6],g=e[10],y=e[14],M=e[3],T=e[7],S=e[11],x=e[15],R=h*y-f*g,I=d*y-f*m,A=d*g-h*m,P=c*y-f*_,L=c*g-h*_,U=c*m-d*_;return t*(T*R-S*I+x*A)-i*(M*R-S*P+x*L)+a*(M*I-T*P+x*U)-l*(M*A-T*L+S*U)}determinantAffine(){const e=this.elements,t=e[0],i=e[4],a=e[8],l=e[1],c=e[5],d=e[9],h=e[2],f=e[6],_=e[10];return t*(c*_-d*f)-i*(l*_-d*h)+a*(l*f-c*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const a=this.elements;return e.isVector3?(a[12]=e.x,a[13]=e.y,a[14]=e.z):(a[12]=e,a[13]=t,a[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],a=e[2],l=e[3],c=e[4],d=e[5],h=e[6],f=e[7],_=e[8],m=e[9],g=e[10],y=e[11],M=e[12],T=e[13],S=e[14],x=e[15],R=t*d-i*c,I=t*h-a*c,A=t*f-l*c,P=i*h-a*d,L=i*f-l*d,U=a*f-l*h,b=_*T-m*M,D=_*S-g*M,B=_*x-y*M,V=m*S-g*T,G=m*x-y*T,J=g*x-y*S,H=R*J-I*G+A*V+P*B-L*D+U*b;if(H===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const Z=1/H;return e[0]=(d*J-h*G+f*V)*Z,e[1]=(a*G-i*J-l*V)*Z,e[2]=(T*U-S*L+x*P)*Z,e[3]=(g*L-m*U-y*P)*Z,e[4]=(h*B-c*J-f*D)*Z,e[5]=(t*J-a*B+l*D)*Z,e[6]=(S*A-M*U-x*I)*Z,e[7]=(_*U-g*A+y*I)*Z,e[8]=(c*G-d*B+f*b)*Z,e[9]=(i*B-t*G-l*b)*Z,e[10]=(M*L-T*A+x*R)*Z,e[11]=(m*A-_*L-y*R)*Z,e[12]=(d*D-c*V-h*b)*Z,e[13]=(t*V-i*D+a*b)*Z,e[14]=(T*I-M*P-S*R)*Z,e[15]=(_*P-m*I+g*R)*Z,this}scale(e){const t=this.elements,i=e.x,a=e.y,l=e.z;return t[0]*=i,t[4]*=a,t[8]*=l,t[1]*=i,t[5]*=a,t[9]*=l,t[2]*=i,t[6]*=a,t[10]*=l,t[3]*=i,t[7]*=a,t[11]*=l,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],a=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,a))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),a=Math.sin(t),l=1-i,c=e.x,d=e.y,h=e.z,f=l*c,_=l*d;return this.set(f*c+i,f*d-a*h,f*h+a*d,0,f*d+a*h,_*d+i,_*h-a*c,0,f*h-a*d,_*h+a*c,l*h*h+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,a,l,c){return this.set(1,i,l,0,e,1,c,0,t,a,1,0,0,0,0,1),this}compose(e,t,i){const a=this.elements,l=t._x,c=t._y,d=t._z,h=t._w,f=l+l,_=c+c,m=d+d,g=l*f,y=l*_,M=l*m,T=c*_,S=c*m,x=d*m,R=h*f,I=h*_,A=h*m,P=i.x,L=i.y,U=i.z;return a[0]=(1-(T+x))*P,a[1]=(y+A)*P,a[2]=(M-I)*P,a[3]=0,a[4]=(y-A)*L,a[5]=(1-(g+x))*L,a[6]=(S+R)*L,a[7]=0,a[8]=(M+I)*U,a[9]=(S-R)*U,a[10]=(1-(g+T))*U,a[11]=0,a[12]=e.x,a[13]=e.y,a[14]=e.z,a[15]=1,this}decompose(e,t,i){const a=this.elements;e.x=a[12],e.y=a[13],e.z=a[14];const l=this.determinantAffine();if(l===0)return i.set(1,1,1),t.identity(),this;let c=Ea.set(a[0],a[1],a[2]).length();const d=Ea.set(a[4],a[5],a[6]).length(),h=Ea.set(a[8],a[9],a[10]).length();l<0&&(c=-c),Ii.copy(this);const f=1/c,_=1/d,m=1/h;return Ii.elements[0]*=f,Ii.elements[1]*=f,Ii.elements[2]*=f,Ii.elements[4]*=_,Ii.elements[5]*=_,Ii.elements[6]*=_,Ii.elements[8]*=m,Ii.elements[9]*=m,Ii.elements[10]*=m,t.setFromRotationMatrix(Ii),i.x=c,i.y=d,i.z=h,this}makePerspective(e,t,i,a,l,c,d=nr,h=!1){const f=this.elements,_=2*l/(t-e),m=2*l/(i-a),g=(t+e)/(t-e),y=(i+a)/(i-a);let M,T;if(h)M=l/(c-l),T=c*l/(c-l);else if(d===nr)M=-(c+l)/(c-l),T=-2*c*l/(c-l);else if(d===al)M=-c/(c-l),T=-c*l/(c-l);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+d);return f[0]=_,f[4]=0,f[8]=g,f[12]=0,f[1]=0,f[5]=m,f[9]=y,f[13]=0,f[2]=0,f[6]=0,f[10]=M,f[14]=T,f[3]=0,f[7]=0,f[11]=-1,f[15]=0,this}makeOrthographic(e,t,i,a,l,c,d=nr,h=!1){const f=this.elements,_=2/(t-e),m=2/(i-a),g=-(t+e)/(t-e),y=-(i+a)/(i-a);let M,T;if(h)M=1/(c-l),T=c/(c-l);else if(d===nr)M=-2/(c-l),T=-(c+l)/(c-l);else if(d===al)M=-1/(c-l),T=-l/(c-l);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+d);return f[0]=_,f[4]=0,f[8]=0,f[12]=g,f[1]=0,f[5]=m,f[9]=0,f[13]=y,f[2]=0,f[6]=0,f[10]=M,f[14]=T,f[3]=0,f[7]=0,f[11]=0,f[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let a=0;a<16;a++)if(t[a]!==i[a])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};du.prototype.isMatrix4=!0;let Vt=du;const Ea=new Y,Ii=new Vt,wM=new Y(0,0,0),bM=new Y(1,1,1),Qr=new Y,vc=new Y,oi=new Y,eg=new Vt,tg=new hs;class Dr{constructor(e=0,t=0,i=0,a=Dr.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=a}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,a=this._order){return this._x=e,this._y=t,this._z=i,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const a=e.elements,l=a[0],c=a[4],d=a[8],h=a[1],f=a[5],_=a[9],m=a[2],g=a[6],y=a[10];switch(t){case"XYZ":this._y=Math.asin(yt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(-_,y),this._z=Math.atan2(-c,l)):(this._x=Math.atan2(g,f),this._z=0);break;case"YXZ":this._x=Math.asin(-yt(_,-1,1)),Math.abs(_)<.9999999?(this._y=Math.atan2(d,y),this._z=Math.atan2(h,f)):(this._y=Math.atan2(-m,l),this._z=0);break;case"ZXY":this._x=Math.asin(yt(g,-1,1)),Math.abs(g)<.9999999?(this._y=Math.atan2(-m,y),this._z=Math.atan2(-c,f)):(this._y=0,this._z=Math.atan2(h,l));break;case"ZYX":this._y=Math.asin(-yt(m,-1,1)),Math.abs(m)<.9999999?(this._x=Math.atan2(g,y),this._z=Math.atan2(h,l)):(this._x=0,this._z=Math.atan2(-c,f));break;case"YZX":this._z=Math.asin(yt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(-_,f),this._y=Math.atan2(-m,l)):(this._x=0,this._y=Math.atan2(d,y));break;case"XZY":this._z=Math.asin(-yt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(g,f),this._y=Math.atan2(d,l)):(this._x=Math.atan2(-_,y),this._y=0);break;default:at("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return eg.makeRotationFromQuaternion(e),this.setFromRotationMatrix(eg,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return tg.setFromEuler(this),this.setFromQuaternion(tg,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Dr.DEFAULT_ORDER="XYZ";class X_{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let TM=0;const ng=new Y,wa=new hs,vr=new Vt,yc=new Y,Ho=new Y,AM=new Y,CM=new hs,ig=new Y(1,0,0),rg=new Y(0,1,0),sg=new Y(0,0,1),ag={type:"added"},RM={type:"removed"},ba={type:"childadded",child:null},hh={type:"childremoved",child:null};class rn extends fs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:TM++}),this.uuid=dl(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=rn.DEFAULT_UP.clone();const e=new Y,t=new Dr,i=new hs,a=new Y(1,1,1);function l(){i.setFromEuler(t,!1)}function c(){t.setFromQuaternion(i,void 0,!1)}t._onChange(l),i._onChange(c),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new Vt},normalMatrix:{value:new ft}}),this.matrix=new Vt,this.matrixWorld=new Vt,this.matrixAutoUpdate=rn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=rn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new X_,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return wa.setFromAxisAngle(e,t),this.quaternion.multiply(wa),this}rotateOnWorldAxis(e,t){return wa.setFromAxisAngle(e,t),this.quaternion.premultiply(wa),this}rotateX(e){return this.rotateOnAxis(ig,e)}rotateY(e){return this.rotateOnAxis(rg,e)}rotateZ(e){return this.rotateOnAxis(sg,e)}translateOnAxis(e,t){return ng.copy(e).applyQuaternion(this.quaternion),this.position.add(ng.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(ig,e)}translateY(e){return this.translateOnAxis(rg,e)}translateZ(e){return this.translateOnAxis(sg,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(vr.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?yc.copy(e):yc.set(e,t,i);const a=this.parent;this.updateWorldMatrix(!0,!1),Ho.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?vr.lookAt(Ho,yc,this.up):vr.lookAt(yc,Ho,this.up),this.quaternion.setFromRotationMatrix(vr),a&&(vr.extractRotation(a.matrixWorld),wa.setFromRotationMatrix(vr),this.quaternion.premultiply(wa.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Dt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(ag),ba.child=e,this.dispatchEvent(ba),ba.child=null):Dt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(RM),hh.child=e,this.dispatchEvent(hh),hh.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),vr.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),vr.multiply(e.parent.matrixWorld)),e.applyMatrix4(vr),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(ag),ba.child=e,this.dispatchEvent(ba),ba.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,a=this.children.length;i<a;i++){const c=this.children[i].getObjectByProperty(e,t);if(c!==void 0)return c}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const a=this.children;for(let l=0,c=a.length;l<c;l++)a[l].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ho,e,AM),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ho,CM,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);const t=this.children;for(let i=0,a=t.length;i<a;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,a=t.length;i<a;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,a=e.z,l=this.matrix.elements;l[12]+=t-l[0]*t-l[4]*i-l[8]*a,l[13]+=i-l[1]*t-l[5]*i-l[9]*a,l[14]+=a-l[2]*t-l[6]*i-l[10]*a}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,a=t.length;i<a;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t,i=!1){const a=this.parent;if(e===!0&&a!==null&&a.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),t===!0){const l=this.children;for(let c=0,d=l.length;c<d;c++)l[c].updateWorldMatrix(!1,!0,i)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,a.name=this.name,a.castShadow=this.castShadow,a.receiveShadow=this.receiveShadow,a.visible=this.visible,a.frustumCulled=this.frustumCulled,a.renderOrder=this.renderOrder,a.static=this.static,a.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.pivot!==null&&(a.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(a.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(a.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.geometryInfo=this._geometryInfo.map(d=>({...d,boundingBox:d.boundingBox?d.boundingBox.toJSON():void 0,boundingSphere:d.boundingSphere?d.boundingSphere.toJSON():void 0})),a.instanceInfo=this._instanceInfo.map(d=>({...d})),a.availableInstanceIds=this._availableInstanceIds.slice(),a.availableGeometryIds=this._availableGeometryIds.slice(),a.nextIndexStart=this._nextIndexStart,a.nextVertexStart=this._nextVertexStart,a.geometryCount=this._geometryCount,a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.matricesTexture=this._matricesTexture.toJSON(e),a.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(a.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(a.boundingBox=this.boundingBox.toJSON()));function l(d,h){return d[h.uuid]===void 0&&(d[h.uuid]=h.toJSON(e)),h.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=l(e.geometries,this.geometry);const d=this.geometry.parameters;if(d!==void 0&&d.shapes!==void 0){const h=d.shapes;if(Array.isArray(h))for(let f=0,_=h.length;f<_;f++){const m=h[f];l(e.shapes,m)}else l(e.shapes,h)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(l(e.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const d=[];for(let h=0,f=this.material.length;h<f;h++)d.push(l(e.materials,this.material[h]));a.material=d}else a.material=l(e.materials,this.material);if(this.children.length>0){a.children=[];for(let d=0;d<this.children.length;d++)a.children.push(this.children[d].toJSON(e).object)}if(this.animations.length>0){a.animations=[];for(let d=0;d<this.animations.length;d++){const h=this.animations[d];a.animations.push(l(e.animations,h))}}if(t){const d=c(e.geometries),h=c(e.materials),f=c(e.textures),_=c(e.images),m=c(e.shapes),g=c(e.skeletons),y=c(e.animations),M=c(e.nodes);d.length>0&&(i.geometries=d),h.length>0&&(i.materials=h),f.length>0&&(i.textures=f),_.length>0&&(i.images=_),m.length>0&&(i.shapes=m),g.length>0&&(i.skeletons=g),y.length>0&&(i.animations=y),M.length>0&&(i.nodes=M)}return i.object=a,i;function c(d){const h=[];for(const f in d){const _=d[f];delete _.metadata,h.push(_)}return h}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const a=e.children[i];this.add(a.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}rn.DEFAULT_UP=new Y(0,1,0);rn.DEFAULT_MATRIX_AUTO_UPDATE=!0;rn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class ir extends rn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const PM={type:"move"};class fh{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ir,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ir,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new Y,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new Y),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ir,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new Y,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new Y,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let a=null,l=null,c=null;const d=this._targetRay,h=this._grip,f=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(f&&e.hand){c=!0;for(const T of e.hand.values()){const S=t.getJointPose(T,i),x=this._getHandJoint(f,T);S!==null&&(x.matrix.fromArray(S.transform.matrix),x.matrix.decompose(x.position,x.rotation,x.scale),x.matrixWorldNeedsUpdate=!0,x.jointRadius=S.radius),x.visible=S!==null}const _=f.joints["index-finger-tip"],m=f.joints["thumb-tip"],g=_.position.distanceTo(m.position),y=.02,M=.005;f.inputState.pinching&&g>y+M?(f.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!f.inputState.pinching&&g<=y-M&&(f.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else h!==null&&e.gripSpace&&(l=t.getPose(e.gripSpace,i),l!==null&&(h.matrix.fromArray(l.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,l.linearVelocity?(h.hasLinearVelocity=!0,h.linearVelocity.copy(l.linearVelocity)):h.hasLinearVelocity=!1,l.angularVelocity?(h.hasAngularVelocity=!0,h.angularVelocity.copy(l.angularVelocity)):h.hasAngularVelocity=!1,h.eventsEnabled&&h.dispatchEvent({type:"gripUpdated",data:e,target:this})));d!==null&&(a=t.getPose(e.targetRaySpace,i),a===null&&l!==null&&(a=l),a!==null&&(d.matrix.fromArray(a.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,a.linearVelocity?(d.hasLinearVelocity=!0,d.linearVelocity.copy(a.linearVelocity)):d.hasLinearVelocity=!1,a.angularVelocity?(d.hasAngularVelocity=!0,d.angularVelocity.copy(a.angularVelocity)):d.hasAngularVelocity=!1,this.dispatchEvent(PM)))}return d!==null&&(d.visible=a!==null),h!==null&&(h.visible=l!==null),f!==null&&(f.visible=c!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new ir;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const q_={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Jr={h:0,s:0,l:0},Sc={h:0,s:0,l:0};function ph(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class ut{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const a=e;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ci){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,wt.colorSpaceToWorking(this,t),this}setRGB(e,t,i,a=wt.workingColorSpace){return this.r=e,this.g=t,this.b=i,wt.colorSpaceToWorking(this,a),this}setHSL(e,t,i,a=wt.workingColorSpace){if(e=gM(e,1),t=yt(t,0,1),i=yt(i,0,1),t===0)this.r=this.g=this.b=i;else{const l=i<=.5?i*(1+t):i+t-i*t,c=2*i-l;this.r=ph(c,l,e+1/3),this.g=ph(c,l,e),this.b=ph(c,l,e-1/3)}return wt.colorSpaceToWorking(this,a),this}setStyle(e,t=ci){function i(l){l!==void 0&&parseFloat(l)<1&&at("Color: Alpha component of "+e+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(e)){let l;const c=a[1],d=a[2];switch(c){case"rgb":case"rgba":if(l=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return i(l[4]),this.setRGB(Math.min(255,parseInt(l[1],10))/255,Math.min(255,parseInt(l[2],10))/255,Math.min(255,parseInt(l[3],10))/255,t);if(l=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return i(l[4]),this.setRGB(Math.min(100,parseInt(l[1],10))/100,Math.min(100,parseInt(l[2],10))/100,Math.min(100,parseInt(l[3],10))/100,t);break;case"hsl":case"hsla":if(l=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return i(l[4]),this.setHSL(parseFloat(l[1])/360,parseFloat(l[2])/100,parseFloat(l[3])/100,t);break;default:at("Color: Unknown color model "+e)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(e)){const l=a[1],c=l.length;if(c===3)return this.setRGB(parseInt(l.charAt(0),16)/15,parseInt(l.charAt(1),16)/15,parseInt(l.charAt(2),16)/15,t);if(c===6)return this.setHex(parseInt(l,16),t);at("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ci){const i=q_[e.toLowerCase()];return i!==void 0?this.setHex(i,t):at("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Pr(e.r),this.g=Pr(e.g),this.b=Pr(e.b),this}copyLinearToSRGB(e){return this.r=Ha(e.r),this.g=Ha(e.g),this.b=Ha(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ci){return wt.workingToColorSpace(On.copy(this),e),Math.round(yt(On.r*255,0,255))*65536+Math.round(yt(On.g*255,0,255))*256+Math.round(yt(On.b*255,0,255))}getHexString(e=ci){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=wt.workingColorSpace){wt.workingToColorSpace(On.copy(this),t);const i=On.r,a=On.g,l=On.b,c=Math.max(i,a,l),d=Math.min(i,a,l);let h,f;const _=(d+c)/2;if(d===c)h=0,f=0;else{const m=c-d;switch(f=_<=.5?m/(c+d):m/(2-c-d),c){case i:h=(a-l)/m+(a<l?6:0);break;case a:h=(l-i)/m+2;break;case l:h=(i-a)/m+4;break}h/=6}return e.h=h,e.s=f,e.l=_,e}getRGB(e,t=wt.workingColorSpace){return wt.workingToColorSpace(On.copy(this),t),e.r=On.r,e.g=On.g,e.b=On.b,e}getStyle(e=ci){wt.workingToColorSpace(On.copy(this),e);const t=On.r,i=On.g,a=On.b;return e!==ci?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(a*255)})`}offsetHSL(e,t,i){return this.getHSL(Jr),this.setHSL(Jr.h+e,Jr.s+t,Jr.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Jr),e.getHSL(Sc);const i=oh(Jr.h,Sc.h,t),a=oh(Jr.s,Sc.s,t),l=oh(Jr.l,Sc.l,t);return this.setHSL(i,a,l),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,a=this.b,l=e.elements;return this.r=l[0]*t+l[3]*i+l[6]*a,this.g=l[1]*t+l[4]*i+l[7]*a,this.b=l[2]*t+l[5]*i+l[8]*a,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const On=new ut;ut.NAMES=q_;class Yf{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new ut(e),this.density=t}clone(){return new Yf(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class NM extends rn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Dr,this.environmentIntensity=1,this.environmentRotation=new Dr,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Ui=new Y,yr=new Y,mh=new Y,Sr=new Y,Ta=new Y,Aa=new Y,og=new Y,gh=new Y,_h=new Y,xh=new Y,vh=new nn,yh=new nn,Sh=new nn;class zi{constructor(e=new Y,t=new Y,i=new Y){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,a){a.subVectors(i,t),Ui.subVectors(e,t),a.cross(Ui);const l=a.lengthSq();return l>0?a.multiplyScalar(1/Math.sqrt(l)):a.set(0,0,0)}static getBarycoord(e,t,i,a,l){Ui.subVectors(a,t),yr.subVectors(i,t),mh.subVectors(e,t);const c=Ui.dot(Ui),d=Ui.dot(yr),h=Ui.dot(mh),f=yr.dot(yr),_=yr.dot(mh),m=c*f-d*d;if(m===0)return l.set(0,0,0),null;const g=1/m,y=(f*h-d*_)*g,M=(c*_-d*h)*g;return l.set(1-y-M,M,y)}static containsPoint(e,t,i,a){return this.getBarycoord(e,t,i,a,Sr)===null?!1:Sr.x>=0&&Sr.y>=0&&Sr.x+Sr.y<=1}static getInterpolation(e,t,i,a,l,c,d,h){return this.getBarycoord(e,t,i,a,Sr)===null?(h.x=0,h.y=0,"z"in h&&(h.z=0),"w"in h&&(h.w=0),null):(h.setScalar(0),h.addScaledVector(l,Sr.x),h.addScaledVector(c,Sr.y),h.addScaledVector(d,Sr.z),h)}static getInterpolatedAttribute(e,t,i,a,l,c){return vh.setScalar(0),yh.setScalar(0),Sh.setScalar(0),vh.fromBufferAttribute(e,t),yh.fromBufferAttribute(e,i),Sh.fromBufferAttribute(e,a),c.setScalar(0),c.addScaledVector(vh,l.x),c.addScaledVector(yh,l.y),c.addScaledVector(Sh,l.z),c}static isFrontFacing(e,t,i,a){return Ui.subVectors(i,t),yr.subVectors(e,t),Ui.cross(yr).dot(a)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,a){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[a]),this}setFromAttributeAndIndices(e,t,i,a){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,a),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Ui.subVectors(this.c,this.b),yr.subVectors(this.a,this.b),Ui.cross(yr).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return zi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return zi.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,a,l){return zi.getInterpolation(e,this.a,this.b,this.c,t,i,a,l)}containsPoint(e){return zi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return zi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,a=this.b,l=this.c;let c,d;Ta.subVectors(a,i),Aa.subVectors(l,i),gh.subVectors(e,i);const h=Ta.dot(gh),f=Aa.dot(gh);if(h<=0&&f<=0)return t.copy(i);_h.subVectors(e,a);const _=Ta.dot(_h),m=Aa.dot(_h);if(_>=0&&m<=_)return t.copy(a);const g=h*m-_*f;if(g<=0&&h>=0&&_<=0)return c=h/(h-_),t.copy(i).addScaledVector(Ta,c);xh.subVectors(e,l);const y=Ta.dot(xh),M=Aa.dot(xh);if(M>=0&&y<=M)return t.copy(l);const T=y*f-h*M;if(T<=0&&f>=0&&M<=0)return d=f/(f-M),t.copy(i).addScaledVector(Aa,d);const S=_*M-y*m;if(S<=0&&m-_>=0&&y-M>=0)return og.subVectors(l,a),d=(m-_)/(m-_+(y-M)),t.copy(a).addScaledVector(og,d);const x=1/(S+T+g);return c=T*x,d=g*x,t.copy(i).addScaledVector(Ta,c).addScaledVector(Aa,d)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class $s{constructor(e=new Y(1/0,1/0,1/0),t=new Y(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Fi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Fi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Fi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const l=i.getAttribute("position");if(t===!0&&l!==void 0&&e.isInstancedMesh!==!0)for(let c=0,d=l.count;c<d;c++)e.isMesh===!0?e.getVertexPosition(c,Fi):Fi.fromBufferAttribute(l,c),Fi.applyMatrix4(e.matrixWorld),this.expandByPoint(Fi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Mc.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Mc.copy(i.boundingBox)),Mc.applyMatrix4(e.matrixWorld),this.union(Mc)}const a=e.children;for(let l=0,c=a.length;l<c;l++)this.expandByObject(a[l],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Fi),Fi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Vo),Ec.subVectors(this.max,Vo),Ca.subVectors(e.a,Vo),Ra.subVectors(e.b,Vo),Pa.subVectors(e.c,Vo),es.subVectors(Ra,Ca),ts.subVectors(Pa,Ra),Ns.subVectors(Ca,Pa);let t=[0,-es.z,es.y,0,-ts.z,ts.y,0,-Ns.z,Ns.y,es.z,0,-es.x,ts.z,0,-ts.x,Ns.z,0,-Ns.x,-es.y,es.x,0,-ts.y,ts.x,0,-Ns.y,Ns.x,0];return!Mh(t,Ca,Ra,Pa,Ec)||(t=[1,0,0,0,1,0,0,0,1],!Mh(t,Ca,Ra,Pa,Ec))?!1:(wc.crossVectors(es,ts),t=[wc.x,wc.y,wc.z],Mh(t,Ca,Ra,Pa,Ec))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Fi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Fi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Mr[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Mr[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Mr[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Mr[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Mr[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Mr[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Mr[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Mr[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Mr),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Mr=[new Y,new Y,new Y,new Y,new Y,new Y,new Y,new Y],Fi=new Y,Mc=new $s,Ca=new Y,Ra=new Y,Pa=new Y,es=new Y,ts=new Y,Ns=new Y,Vo=new Y,Ec=new Y,wc=new Y,Ls=new Y;function Mh(s,e,t,i,a){for(let l=0,c=s.length-3;l<=c;l+=3){Ls.fromArray(s,l);const d=a.x*Math.abs(Ls.x)+a.y*Math.abs(Ls.y)+a.z*Math.abs(Ls.z),h=e.dot(Ls),f=t.dot(Ls),_=i.dot(Ls);if(Math.max(-Math.max(h,f,_),Math.min(h,f,_))>d)return!1}return!0}const dn=new Y,bc=new ot;let LM=0;class sr extends fs{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:LM++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=dM,this.updateRanges=[],this.gpuType=Hi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let a=0,l=this.itemSize;a<l;a++)this.array[e+a]=t.array[i+a];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)bc.fromBufferAttribute(this,t),bc.applyMatrix3(e),this.setXY(t,bc.x,bc.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)dn.fromBufferAttribute(this,t),dn.applyMatrix3(e),this.setXYZ(t,dn.x,dn.y,dn.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)dn.fromBufferAttribute(this,t),dn.applyMatrix4(e),this.setXYZ(t,dn.x,dn.y,dn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)dn.fromBufferAttribute(this,t),dn.applyNormalMatrix(e),this.setXYZ(t,dn.x,dn.y,dn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)dn.fromBufferAttribute(this,t),dn.transformDirection(e),this.setXYZ(t,dn.x,dn.y,dn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=zo(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Jn(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=zo(t,this.array)),t}setX(e,t){return this.normalized&&(t=Jn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=zo(t,this.array)),t}setY(e,t){return this.normalized&&(t=Jn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=zo(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Jn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=zo(t,this.array)),t}setW(e,t){return this.normalized&&(t=Jn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Jn(t,this.array),i=Jn(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,a){return e*=this.itemSize,this.normalized&&(t=Jn(t,this.array),i=Jn(i,this.array),a=Jn(a,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=a,this}setXYZW(e,t,i,a,l){return e*=this.itemSize,this.normalized&&(t=Jn(t,this.array),i=Jn(i,this.array),a=Jn(a,this.array),l=Jn(l,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=a,this.array[e+3]=l,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}}class Y_ extends sr{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class $_ extends sr{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class hn extends sr{constructor(e,t,i){super(new Float32Array(e),t,i)}}const DM=new $s,Go=new Y,Eh=new Y;class Ks{constructor(e=new Y,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):DM.setFromPoints(e).getCenter(i);let a=0;for(let l=0,c=e.length;l<c;l++)a=Math.max(a,i.distanceToSquared(e[l]));return this.radius=Math.sqrt(a),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Go.subVectors(e,this.center);const t=Go.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),a=(i-this.radius)*.5;this.center.addScaledVector(Go,a/i),this.radius+=a}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Eh.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Go.copy(e.center).add(Eh)),this.expandByPoint(Go.copy(e.center).sub(Eh))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let IM=0;const yi=new Vt,wh=new rn,Na=new Y,li=new $s,Wo=new $s,bn=new Y;class Xn extends fs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:IM++}),this.uuid=dl(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(hM(e)?$_:Y_)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const l=new ft().getNormalMatrix(e);i.applyNormalMatrix(l),i.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(e),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return yi.makeRotationFromQuaternion(e),this.applyMatrix4(yi),this}rotateX(e){return yi.makeRotationX(e),this.applyMatrix4(yi),this}rotateY(e){return yi.makeRotationY(e),this.applyMatrix4(yi),this}rotateZ(e){return yi.makeRotationZ(e),this.applyMatrix4(yi),this}translate(e,t,i){return yi.makeTranslation(e,t,i),this.applyMatrix4(yi),this}scale(e,t,i){return yi.makeScale(e,t,i),this.applyMatrix4(yi),this}lookAt(e){return wh.lookAt(e),wh.updateMatrix(),this.applyMatrix4(wh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Na).negate(),this.translate(Na.x,Na.y,Na.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let a=0,l=e.length;a<l;a++){const c=e[a];i.push(c.x,c.y,c.z||0)}this.setAttribute("position",new hn(i,3))}else{const i=Math.min(e.length,t.count);for(let a=0;a<i;a++){const l=e[a];t.setXYZ(a,l.x,l.y,l.z||0)}e.length>t.count&&at("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new $s);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Dt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new Y(-1/0,-1/0,-1/0),new Y(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,a=t.length;i<a;i++){const l=t[i];li.setFromBufferAttribute(l),this.morphTargetsRelative?(bn.addVectors(this.boundingBox.min,li.min),this.boundingBox.expandByPoint(bn),bn.addVectors(this.boundingBox.max,li.max),this.boundingBox.expandByPoint(bn)):(this.boundingBox.expandByPoint(li.min),this.boundingBox.expandByPoint(li.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Dt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ks);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Dt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new Y,1/0);return}if(e){const i=this.boundingSphere.center;if(li.setFromBufferAttribute(e),t)for(let l=0,c=t.length;l<c;l++){const d=t[l];Wo.setFromBufferAttribute(d),this.morphTargetsRelative?(bn.addVectors(li.min,Wo.min),li.expandByPoint(bn),bn.addVectors(li.max,Wo.max),li.expandByPoint(bn)):(li.expandByPoint(Wo.min),li.expandByPoint(Wo.max))}li.getCenter(i);let a=0;for(let l=0,c=e.count;l<c;l++)bn.fromBufferAttribute(e,l),a=Math.max(a,i.distanceToSquared(bn));if(t)for(let l=0,c=t.length;l<c;l++){const d=t[l],h=this.morphTargetsRelative;for(let f=0,_=d.count;f<_;f++)bn.fromBufferAttribute(d,f),h&&(Na.fromBufferAttribute(e,f),bn.add(Na)),a=Math.max(a,i.distanceToSquared(bn))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&Dt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Dt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,a=t.normal,l=t.uv;let c=this.getAttribute("tangent");(c===void 0||c.count!==i.count)&&(c=new sr(new Float32Array(4*i.count),4),this.setAttribute("tangent",c));const d=[],h=[];for(let b=0;b<i.count;b++)d[b]=new Y,h[b]=new Y;const f=new Y,_=new Y,m=new Y,g=new ot,y=new ot,M=new ot,T=new Y,S=new Y;function x(b,D,B){f.fromBufferAttribute(i,b),_.fromBufferAttribute(i,D),m.fromBufferAttribute(i,B),g.fromBufferAttribute(l,b),y.fromBufferAttribute(l,D),M.fromBufferAttribute(l,B),_.sub(f),m.sub(f),y.sub(g),M.sub(g);const V=1/(y.x*M.y-M.x*y.y);isFinite(V)&&(T.copy(_).multiplyScalar(M.y).addScaledVector(m,-y.y).multiplyScalar(V),S.copy(m).multiplyScalar(y.x).addScaledVector(_,-M.x).multiplyScalar(V),d[b].add(T),d[D].add(T),d[B].add(T),h[b].add(S),h[D].add(S),h[B].add(S))}let R=this.groups;R.length===0&&(R=[{start:0,count:e.count}]);for(let b=0,D=R.length;b<D;++b){const B=R[b],V=B.start,G=B.count;for(let J=V,H=V+G;J<H;J+=3)x(e.getX(J+0),e.getX(J+1),e.getX(J+2))}const I=new Y,A=new Y,P=new Y,L=new Y;function U(b){P.fromBufferAttribute(a,b),L.copy(P);const D=d[b];I.copy(D),I.sub(P.multiplyScalar(P.dot(D))).normalize(),A.crossVectors(L,D);const V=A.dot(h[b])<0?-1:1;c.setXYZW(b,I.x,I.y,I.z,V)}for(let b=0,D=R.length;b<D;++b){const B=R[b],V=B.start,G=B.count;for(let J=V,H=V+G;J<H;J+=3)U(e.getX(J+0)),U(e.getX(J+1)),U(e.getX(J+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==t.count)i=new sr(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let g=0,y=i.count;g<y;g++)i.setXYZ(g,0,0,0);const a=new Y,l=new Y,c=new Y,d=new Y,h=new Y,f=new Y,_=new Y,m=new Y;if(e)for(let g=0,y=e.count;g<y;g+=3){const M=e.getX(g+0),T=e.getX(g+1),S=e.getX(g+2);a.fromBufferAttribute(t,M),l.fromBufferAttribute(t,T),c.fromBufferAttribute(t,S),_.subVectors(c,l),m.subVectors(a,l),_.cross(m),d.fromBufferAttribute(i,M),h.fromBufferAttribute(i,T),f.fromBufferAttribute(i,S),d.add(_),h.add(_),f.add(_),i.setXYZ(M,d.x,d.y,d.z),i.setXYZ(T,h.x,h.y,h.z),i.setXYZ(S,f.x,f.y,f.z)}else for(let g=0,y=t.count;g<y;g+=3)a.fromBufferAttribute(t,g+0),l.fromBufferAttribute(t,g+1),c.fromBufferAttribute(t,g+2),_.subVectors(c,l),m.subVectors(a,l),_.cross(m),i.setXYZ(g+0,_.x,_.y,_.z),i.setXYZ(g+1,_.x,_.y,_.z),i.setXYZ(g+2,_.x,_.y,_.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)bn.fromBufferAttribute(e,t),bn.normalize(),e.setXYZ(t,bn.x,bn.y,bn.z)}toNonIndexed(){function e(d,h){const f=d.array,_=d.itemSize,m=d.normalized,g=new f.constructor(h.length*_);let y=0,M=0;for(let T=0,S=h.length;T<S;T++){d.isInterleavedBufferAttribute?y=h[T]*d.data.stride+d.offset:y=h[T]*_;for(let x=0;x<_;x++)g[M++]=f[y++]}return new sr(g,_,m)}if(this.index===null)return at("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Xn,i=this.index.array,a=this.attributes;for(const d in a){const h=a[d],f=e(h,i);t.setAttribute(d,f)}const l=this.morphAttributes;for(const d in l){const h=[],f=l[d];for(let _=0,m=f.length;_<m;_++){const g=f[_],y=e(g,i);h.push(y)}t.morphAttributes[d]=h}t.morphTargetsRelative=this.morphTargetsRelative;const c=this.groups;for(let d=0,h=c.length;d<h;d++){const f=c[d];t.addGroup(f.start,f.count,f.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const h=this.parameters;for(const f in h)h[f]!==void 0&&(e[f]=h[f]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const h in i){const f=i[h];e.data.attributes[h]=f.toJSON(e.data)}const a={};let l=!1;for(const h in this.morphAttributes){const f=this.morphAttributes[h],_=[];for(let m=0,g=f.length;m<g;m++){const y=f[m];_.push(y.toJSON(e.data))}_.length>0&&(a[h]=_,l=!0)}l&&(e.data.morphAttributes=a,e.data.morphTargetsRelative=this.morphTargetsRelative);const c=this.groups;c.length>0&&(e.data.groups=JSON.parse(JSON.stringify(c)));const d=this.boundingSphere;return d!==null&&(e.data.boundingSphere=d.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const a=e.attributes;for(const f in a){const _=a[f];this.setAttribute(f,_.clone(t))}const l=e.morphAttributes;for(const f in l){const _=[],m=l[f];for(let g=0,y=m.length;g<y;g++)_.push(m[g].clone(t));this.morphAttributes[f]=_}this.morphTargetsRelative=e.morphTargetsRelative;const c=e.groups;for(let f=0,_=c.length;f<_;f++){const m=c[f];this.addGroup(m.start,m.count,m.materialIndex)}const d=e.boundingBox;d!==null&&(this.boundingBox=d.clone());const h=e.boundingSphere;return h!==null&&(this.boundingSphere=h.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}const bh=new Y,UM=new Y,FM=new ft;class Tr{constructor(e=new Y(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,a){return this.normal.set(e,t,i),this.constant=a,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const a=bh.subVectors(i,t).cross(UM.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(a,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const a=e.delta(bh),l=this.normal.dot(a);if(l===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const c=-(e.start.dot(this.normal)+this.constant)/l;return i===!0&&(c<0||c>1)?null:t.copy(e.start).addScaledVector(a,c)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||FM.getNormalMatrix(e),a=this.coplanarPoint(bh).applyMatrix4(e),l=this.normal.applyMatrix3(i).normalize();return this.constant=-a.dot(l),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let OM=0;class lr extends fs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:OM++}),this.uuid=dl(),this.name="",this.type="Material",this.blending=el,this.side=Xs,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=C_,this.blendDst=R_,this.blendEquation=Fa,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ut(0,0,0),this.blendAlpha=0,this.depthFunc=il,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=rM,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ah,this.stencilZFail=ah,this.stencilZPass=ah,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){at(`Material: parameter '${t}' has value of undefined.`);continue}const a=this[t];if(a===void 0){at(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(i):a&&a.isVector2&&i&&i.isVector2||a&&a.isEuler&&i&&i.isEuler||a&&a.isVector3&&i&&i.isVector3?a.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(l=>l.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function a(l){const c=[];for(const d in l){const h=l[d];delete h.metadata,c.push(h)}return c}if(t){const l=a(e.textures),c=a(e.images);l.length>0&&(i.textures=l),c.length>0&&(i.images=c)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new ut().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new Tr().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new ot().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ot().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const a=t.length;i=new Array(a);for(let l=0;l!==a;++l)i[l]=t[l].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Er=new Y,Th=new Y,Tc=new Y,Ac=new Y;class pu{constructor(e=new Y,t=new Y(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Er)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Er.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Er.copy(this.origin).addScaledVector(this.direction,t),Er.distanceToSquared(e))}distanceSqToSegment(e,t,i,a){Th.copy(e).add(t).multiplyScalar(.5),Tc.copy(t).sub(e).normalize(),Ac.copy(this.origin).sub(Th);const l=e.distanceTo(t)*.5,c=-this.direction.dot(Tc),d=Ac.dot(this.direction),h=-Ac.dot(Tc),f=Ac.lengthSq(),_=Math.abs(1-c*c);let m,g,y,M;if(_>0)if(m=c*h-d,g=c*d-h,M=l*_,m>=0)if(g>=-M)if(g<=M){const T=1/_;m*=T,g*=T,y=m*(m+c*g+2*d)+g*(c*m+g+2*h)+f}else g=l,m=Math.max(0,-(c*g+d)),y=-m*m+g*(g+2*h)+f;else g=-l,m=Math.max(0,-(c*g+d)),y=-m*m+g*(g+2*h)+f;else g<=-M?(m=Math.max(0,-(-c*l+d)),g=m>0?-l:Math.min(Math.max(-l,-h),l),y=-m*m+g*(g+2*h)+f):g<=M?(m=0,g=Math.min(Math.max(-l,-h),l),y=g*(g+2*h)+f):(m=Math.max(0,-(c*l+d)),g=m>0?l:Math.min(Math.max(-l,-h),l),y=-m*m+g*(g+2*h)+f);else g=c>0?-l:l,m=Math.max(0,-(c*g+d)),y=-m*m+g*(g+2*h)+f;return i&&i.copy(this.origin).addScaledVector(this.direction,m),a&&a.copy(Th).addScaledVector(Tc,g),y}intersectSphere(e,t){if(e.radius<0)return null;Er.subVectors(e.center,this.origin);const i=Er.dot(this.direction),a=Er.dot(Er)-i*i,l=e.radius*e.radius;if(a>l)return null;const c=Math.sqrt(l-a),d=i-c,h=i+c;return h<0?null:d<0?this.at(h,t):this.at(d,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,a,l,c,d,h;const f=1/this.direction.x,_=1/this.direction.y,m=1/this.direction.z,g=this.origin;return f>=0?(i=(e.min.x-g.x)*f,a=(e.max.x-g.x)*f):(i=(e.max.x-g.x)*f,a=(e.min.x-g.x)*f),_>=0?(l=(e.min.y-g.y)*_,c=(e.max.y-g.y)*_):(l=(e.max.y-g.y)*_,c=(e.min.y-g.y)*_),i>c||l>a||((l>i||isNaN(i))&&(i=l),(c<a||isNaN(a))&&(a=c),m>=0?(d=(e.min.z-g.z)*m,h=(e.max.z-g.z)*m):(d=(e.max.z-g.z)*m,h=(e.min.z-g.z)*m),i>h||d>a)||((d>i||i!==i)&&(i=d),(h<a||a!==a)&&(a=h),a<0)?null:this.at(i>=0?i:a,t)}intersectsBox(e){return this.intersectBox(e,Er)!==null}intersectTriangle(e,t,i,a,l){const c=this.origin,d=this.direction,h=d.x,f=d.y,_=d.z,m=e.x-c.x,g=e.y-c.y,y=e.z-c.z,M=t.x-c.x,T=t.y-c.y,S=t.z-c.z,x=i.x-c.x,R=i.y-c.y,I=i.z-c.z,A=Math.abs(h),P=Math.abs(f),L=Math.abs(_);let U,b,D,B,V,G,J,H,Z,he,ne,ee;if(A>=P&&A>=L?(D=h,G=m,Z=M,ee=x,h>=0?(U=f,b=_,B=g,V=y,J=T,H=S,he=R,ne=I):(U=_,b=f,B=y,V=g,J=S,H=T,he=I,ne=R)):P>=L?(D=f,G=g,Z=T,ee=R,f>=0?(U=_,b=h,B=y,V=m,J=S,H=M,he=I,ne=x):(U=h,b=_,B=m,V=y,J=M,H=S,he=x,ne=I)):(D=_,G=y,Z=S,ee=I,_>=0?(U=h,b=f,B=m,V=g,J=M,H=T,he=x,ne=R):(U=f,b=h,B=g,V=m,J=T,H=M,he=R,ne=x)),D===0)return null;const $=U/D,K=b/D,F=1/D,se=B-$*G,Se=V-K*G,Ge=J-$*Z,Be=H-K*Z,Ve=he-$*ee,ae=ne-K*ee,de=Ve*Be-ae*Ge,Ee=se*ae-Se*Ve,$e=Ge*Se-Be*se;if(a){if(de<0||Ee<0||$e<0)return null}else if((de<0||Ee<0||$e<0)&&(de>0||Ee>0||$e>0))return null;const Fe=de+Ee+$e;if(Fe===0)return null;const dt=F*(de*G+Ee*Z+$e*ee);return(Fe>0?dt<0:dt>0)?null:this.at(dt/Fe,l)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class js extends lr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ut(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Dr,this.combine=Of,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const lg=new Vt,Ds=new pu,Cc=new Ks,cg=new Y,Rc=new Y,Pc=new Y,Nc=new Y,Ah=new Y,Lc=new Y,ug=new Y,Dc=new Y;class Bt extends rn{constructor(e=new Xn,t=new js){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const a=t[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let l=0,c=a.length;l<c;l++){const d=a[l].name||String(l);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=l}}}}getVertexPosition(e,t){const i=this.geometry,a=i.attributes.position,l=i.morphAttributes.position,c=i.morphTargetsRelative;t.fromBufferAttribute(a,e);const d=this.morphTargetInfluences;if(l&&d){Lc.set(0,0,0);for(let h=0,f=l.length;h<f;h++){const _=d[h],m=l[h];_!==0&&(Ah.fromBufferAttribute(m,e),c?Lc.addScaledVector(Ah,_):Lc.addScaledVector(Ah.sub(t),_))}t.add(Lc)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,a=this.material,l=this.matrixWorld;a!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Cc.copy(i.boundingSphere),Cc.applyMatrix4(l),Ds.copy(e.ray).recast(e.near),!(Cc.containsPoint(Ds.origin)===!1&&(Ds.intersectSphere(Cc,cg)===null||Ds.origin.distanceToSquared(cg)>(e.far-e.near)**2))&&(lg.copy(l).invert(),Ds.copy(e.ray).applyMatrix4(lg),!(i.boundingBox!==null&&Ds.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Ds)))}_computeIntersections(e,t,i){let a;const l=this.geometry,c=this.material,d=l.index,h=l.attributes.position,f=l.attributes.uv,_=l.attributes.uv1,m=l.attributes.normal,g=l.groups,y=l.drawRange;if(d!==null)if(Array.isArray(c))for(let M=0,T=g.length;M<T;M++){const S=g[M],x=c[S.materialIndex],R=Math.max(S.start,y.start),I=Math.min(d.count,Math.min(S.start+S.count,y.start+y.count));for(let A=R,P=I;A<P;A+=3){const L=d.getX(A),U=d.getX(A+1),b=d.getX(A+2);a=Ic(this,x,e,i,f,_,m,L,U,b),a&&(a.faceIndex=Math.floor(A/3),a.face.materialIndex=S.materialIndex,t.push(a))}}else{const M=Math.max(0,y.start),T=Math.min(d.count,y.start+y.count);for(let S=M,x=T;S<x;S+=3){const R=d.getX(S),I=d.getX(S+1),A=d.getX(S+2);a=Ic(this,c,e,i,f,_,m,R,I,A),a&&(a.faceIndex=Math.floor(S/3),t.push(a))}}else if(h!==void 0)if(Array.isArray(c))for(let M=0,T=g.length;M<T;M++){const S=g[M],x=c[S.materialIndex],R=Math.max(S.start,y.start),I=Math.min(h.count,Math.min(S.start+S.count,y.start+y.count));for(let A=R,P=I;A<P;A+=3){const L=A,U=A+1,b=A+2;a=Ic(this,x,e,i,f,_,m,L,U,b),a&&(a.faceIndex=Math.floor(A/3),a.face.materialIndex=S.materialIndex,t.push(a))}}else{const M=Math.max(0,y.start),T=Math.min(h.count,y.start+y.count);for(let S=M,x=T;S<x;S+=3){const R=S,I=S+1,A=S+2;a=Ic(this,c,e,i,f,_,m,R,I,A),a&&(a.faceIndex=Math.floor(S/3),t.push(a))}}}}function kM(s,e,t,i,a,l,c,d){let h;if(e.side===ti?h=i.intersectTriangle(c,l,a,!0,d):h=i.intersectTriangle(a,l,c,e.side===Xs,d),h===null)return null;Dc.copy(d),Dc.applyMatrix4(s.matrixWorld);const f=t.ray.origin.distanceTo(Dc);return f<t.near||f>t.far?null:{distance:f,point:Dc.clone(),object:s}}function Ic(s,e,t,i,a,l,c,d,h,f){s.getVertexPosition(d,Rc),s.getVertexPosition(h,Pc),s.getVertexPosition(f,Nc);const _=kM(s,e,t,i,Rc,Pc,Nc,ug);if(_){const m=new Y;zi.getBarycoord(ug,Rc,Pc,Nc,m),a&&(_.uv=zi.getInterpolatedAttribute(a,d,h,f,m,new ot)),l&&(_.uv1=zi.getInterpolatedAttribute(l,d,h,f,m,new ot)),c&&(_.normal=zi.getInterpolatedAttribute(c,d,h,f,m,new Y),_.normal.dot(i.direction)>0&&_.normal.multiplyScalar(-1));const g={a:d,b:h,c:f,normal:new Y,materialIndex:0};zi.getNormal(Rc,Pc,Nc,g.normal),_.face=g,_.barycoord=m}return _}class K_ extends jn{constructor(e=null,t=1,i=1,a,l,c,d,h,f=Rn,_=Rn,m,g){super(null,c,d,h,f,_,a,l,m,g),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class dg extends sr{constructor(e,t,i,a=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=a}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const La=new Vt,hg=new Vt,Uc=[],fg=new $s,BM=new Vt,jo=new Bt,Xo=new Ks;class zM extends Bt{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new dg(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let a=0;a<i;a++)this.setMatrixAt(a,BM)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new $s),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,La),fg.copy(e.boundingBox).applyMatrix4(La),this.boundingBox.union(fg)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ks),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,La),Xo.copy(e.boundingSphere).applyMatrix4(La),this.boundingSphere.union(Xo)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,a=this.morphTexture.source.data.data,l=i.length+1,c=e*l+1;for(let d=0;d<i.length;d++)i[d]=a[c+d]}raycast(e,t){const i=this.matrixWorld,a=this.count;if(jo.geometry=this.geometry,jo.material=this.material,jo.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Xo.copy(this.boundingSphere),Xo.applyMatrix4(i),e.ray.intersectsSphere(Xo)!==!1))for(let l=0;l<a;l++){this.getMatrixAt(l,La),hg.multiplyMatrices(i,La),jo.matrixWorld=hg,jo.raycast(e,Uc);for(let c=0,d=Uc.length;c<d;c++){const h=Uc[c];h.instanceId=l,h.object=this,t.push(h)}Uc.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new dg(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){const i=t.morphTargetInfluences,a=i.length+1;this.morphTexture===null&&(this.morphTexture=new K_(new Float32Array(a*this.count),a,this.count,Hf,Hi));const l=this.morphTexture.source.data.data;let c=0;for(let f=0;f<i.length;f++)c+=i[f];const d=this.geometry.morphTargetsRelative?1:1-c,h=a*e;return l[h]=d,l.set(i,h+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Is=new Ks,HM=new ot(.5,.5),Fc=new Y;class $f{constructor(e=new Tr,t=new Tr,i=new Tr,a=new Tr,l=new Tr,c=new Tr){this.planes=[e,t,i,a,l,c]}set(e,t,i,a,l,c){const d=this.planes;return d[0].copy(e),d[1].copy(t),d[2].copy(i),d[3].copy(a),d[4].copy(l),d[5].copy(c),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=nr,i=!1){const a=this.planes,l=e.elements,c=l[0],d=l[1],h=l[2],f=l[3],_=l[4],m=l[5],g=l[6],y=l[7],M=l[8],T=l[9],S=l[10],x=l[11],R=l[12],I=l[13],A=l[14],P=l[15];if(a[0].setComponents(f-c,y-_,x-M,P-R).normalize(),a[1].setComponents(f+c,y+_,x+M,P+R).normalize(),a[2].setComponents(f+d,y+m,x+T,P+I).normalize(),a[3].setComponents(f-d,y-m,x-T,P-I).normalize(),i)a[4].setComponents(h,g,S,A).normalize(),a[5].setComponents(f-h,y-g,x-S,P-A).normalize();else if(a[4].setComponents(f-h,y-g,x-S,P-A).normalize(),t===nr)a[5].setComponents(f+h,y+g,x+S,P+A).normalize();else if(t===al)a[5].setComponents(h,g,S,A).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Is.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Is.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Is)}intersectsSprite(e){Is.center.set(0,0,0);const t=HM.distanceTo(e.center);return Is.radius=.7071067811865476+t,Is.applyMatrix4(e.matrixWorld),this.intersectsSphere(Is)}intersectsSphere(e){const t=this.planes,i=e.center,a=-e.radius;for(let l=0;l<6;l++)if(t[l].distanceToPoint(i)<a)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const a=t[i];if(Fc.x=a.normal.x>0?e.max.x:e.min.x,Fc.y=a.normal.y>0?e.max.y:e.min.y,Fc.z=a.normal.z>0?e.max.z:e.min.z,a.distanceToPoint(Fc)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class tl extends lr{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ut(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const cu=new Y,uu=new Y,pg=new Vt,qo=new pu,Oc=new Ks,Ch=new Y,mg=new Y;class VM extends rn{constructor(e=new Xn,t=new tl){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let a=1,l=t.count;a<l;a++)cu.fromBufferAttribute(t,a-1),uu.fromBufferAttribute(t,a),i[a]=i[a-1],i[a]+=cu.distanceTo(uu);e.setAttribute("lineDistance",new hn(i,1))}else at("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,a=this.matrixWorld,l=e.params.Line.threshold,c=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Oc.copy(i.boundingSphere),Oc.applyMatrix4(a),Oc.radius+=l,e.ray.intersectsSphere(Oc)===!1)return;pg.copy(a).invert(),qo.copy(e.ray).applyMatrix4(pg);const d=l/((this.scale.x+this.scale.y+this.scale.z)/3),h=d*d,f=this.isLineSegments?2:1,_=i.index,g=i.attributes.position;if(_!==null){const y=Math.max(0,c.start),M=Math.min(_.count,c.start+c.count);for(let T=y,S=M-1;T<S;T+=f){const x=_.getX(T),R=_.getX(T+1),I=kc(this,e,qo,h,x,R,T);I&&t.push(I)}if(this.isLineLoop){const T=_.getX(M-1),S=_.getX(y),x=kc(this,e,qo,h,T,S,M-1);x&&t.push(x)}}else{const y=Math.max(0,c.start),M=Math.min(g.count,c.start+c.count);for(let T=y,S=M-1;T<S;T+=f){const x=kc(this,e,qo,h,T,T+1,T);x&&t.push(x)}if(this.isLineLoop){const T=kc(this,e,qo,h,M-1,y,M-1);T&&t.push(T)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const a=t[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let l=0,c=a.length;l<c;l++){const d=a[l].name||String(l);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=l}}}}}function kc(s,e,t,i,a,l,c){const d=s.geometry.attributes.position;if(cu.fromBufferAttribute(d,a),uu.fromBufferAttribute(d,l),t.distanceSqToSegment(cu,uu,Ch,mg)>i)return;Ch.applyMatrix4(s.matrixWorld);const f=e.ray.origin.distanceTo(Ch);if(!(f<e.near||f>e.far))return{distance:f,point:mg.clone().applyMatrix4(s.matrixWorld),index:c,face:null,faceIndex:null,barycoord:null,object:s}}const gg=new Y,_g=new Y;class Cf extends VM{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let a=0,l=t.count;a<l;a+=2)gg.fromBufferAttribute(t,a),_g.fromBufferAttribute(t,a+1),i[a]=a===0?0:i[a-1],i[a+1]=i[a]+gg.distanceTo(_g);e.setAttribute("lineDistance",new hn(i,1))}else at("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Zo extends lr{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ut(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const xg=new Vt,Rf=new pu,Bc=new Ks,zc=new Y;class Rh extends rn{constructor(e=new Xn,t=new Zo){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,a=this.matrixWorld,l=e.params.Points.threshold,c=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Bc.copy(i.boundingSphere),Bc.applyMatrix4(a),Bc.radius+=l,e.ray.intersectsSphere(Bc)===!1)return;xg.copy(a).invert(),Rf.copy(e.ray).applyMatrix4(xg);const d=l/((this.scale.x+this.scale.y+this.scale.z)/3),h=d*d,f=i.index,m=i.attributes.position;if(f!==null){const g=Math.max(0,c.start),y=Math.min(f.count,c.start+c.count);for(let M=g,T=y;M<T;M++){const S=f.getX(M);zc.fromBufferAttribute(m,S),vg(zc,S,h,a,e,t,this)}}else{const g=Math.max(0,c.start),y=Math.min(m.count,c.start+c.count);for(let M=g,T=y;M<T;M++)zc.fromBufferAttribute(m,M),vg(zc,M,h,a,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const a=t[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let l=0,c=a.length;l<c;l++){const d=a[l].name||String(l);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=l}}}}}function vg(s,e,t,i,a,l,c){const d=Rf.distanceSqToPoint(s);if(d<t){const h=new Y;Rf.closestPointToPoint(s,h),h.applyMatrix4(i);const f=a.ray.origin.distanceTo(h);if(f<a.near||f>a.far)return;l.push({distance:f,distanceToRay:Math.sqrt(d),point:h,index:e,face:null,faceIndex:null,barycoord:null,object:c})}}class Z_ extends jn{constructor(e=[],t=qs,i,a,l,c,d,h,f,_){super(e,t,i,a,l,c,d,h,f,_),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class ol extends jn{constructor(e,t,i=ar,a,l,c,d=Rn,h=Rn,f,_=Lr,m=1){if(_!==Lr&&_!==ks)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const g={width:e,height:t,depth:m};super(g,a,l,c,d,h,_,i,f),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new qf(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class GM extends ol{constructor(e,t=ar,i=qs,a,l,c=Rn,d=Rn,h,f=Lr){const _={width:e,height:e,depth:1},m=[_,_,_,_,_,_];super(e,e,t,i,a,l,c,d,h,f),this.image=m,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Q_ extends jn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Bi extends Xn{constructor(e=1,t=1,i=1,a=1,l=1,c=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:a,heightSegments:l,depthSegments:c};const d=this;a=Math.floor(a),l=Math.floor(l),c=Math.floor(c);const h=[],f=[],_=[],m=[];let g=0,y=0;M("z","y","x",-1,-1,i,t,e,c,l,0),M("z","y","x",1,-1,i,t,-e,c,l,1),M("x","z","y",1,1,e,i,t,a,c,2),M("x","z","y",1,-1,e,i,-t,a,c,3),M("x","y","z",1,-1,e,t,i,a,l,4),M("x","y","z",-1,-1,e,t,-i,a,l,5),this.setIndex(h),this.setAttribute("position",new hn(f,3)),this.setAttribute("normal",new hn(_,3)),this.setAttribute("uv",new hn(m,2));function M(T,S,x,R,I,A,P,L,U,b,D){const B=A/U,V=P/b,G=A/2,J=P/2,H=L/2,Z=U+1,he=b+1;let ne=0,ee=0;const $=new Y;for(let K=0;K<he;K++){const F=K*V-J;for(let se=0;se<Z;se++){const Se=se*B-G;$[T]=Se*R,$[S]=F*I,$[x]=H,f.push($.x,$.y,$.z),$[T]=0,$[S]=0,$[x]=L>0?1:-1,_.push($.x,$.y,$.z),m.push(se/U),m.push(1-K/b),ne+=1}}for(let K=0;K<b;K++)for(let F=0;F<U;F++){const se=g+F+Z*K,Se=g+F+Z*(K+1),Ge=g+(F+1)+Z*(K+1),Be=g+(F+1)+Z*K;h.push(se,Se,Be),h.push(Se,Ge,Be),ee+=6}d.addGroup(y,ee,D),y+=ee,g+=ne}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Bi(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Fs extends Xn{constructor(e=1,t=1,i=1,a=32,l=1,c=!1,d=0,h=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:a,heightSegments:l,openEnded:c,thetaStart:d,thetaLength:h};const f=this;a=Math.floor(a),l=Math.floor(l);const _=[],m=[],g=[],y=[];let M=0;const T=[],S=i/2;let x=0;R(),c===!1&&(e>0&&I(!0),t>0&&I(!1)),this.setIndex(_),this.setAttribute("position",new hn(m,3)),this.setAttribute("normal",new hn(g,3)),this.setAttribute("uv",new hn(y,2));function R(){const A=new Y,P=new Y;let L=0;const U=(t-e)/i;for(let b=0;b<=l;b++){const D=[],B=b/l,V=B*(t-e)+e;for(let G=0;G<=a;G++){const J=G/a,H=J*h+d,Z=Math.sin(H),he=Math.cos(H);P.x=V*Z,P.y=-B*i+S,P.z=V*he,m.push(P.x,P.y,P.z),A.set(Z,U,he).normalize(),g.push(A.x,A.y,A.z),y.push(J,1-B),D.push(M++)}T.push(D)}for(let b=0;b<a;b++)for(let D=0;D<l;D++){const B=T[D][b],V=T[D+1][b],G=T[D+1][b+1],J=T[D][b+1];(e>0||D!==0)&&(_.push(B,V,J),L+=3),(t>0||D!==l-1)&&(_.push(V,G,J),L+=3)}f.addGroup(x,L,0),x+=L}function I(A){const P=M,L=new ot,U=new Y;let b=0;const D=A===!0?e:t,B=A===!0?1:-1;for(let G=1;G<=a;G++)m.push(0,S*B,0),g.push(0,B,0),y.push(.5,.5),M++;const V=M;for(let G=0;G<=a;G++){const H=G/a*h+d,Z=Math.cos(H),he=Math.sin(H);U.x=D*he,U.y=S*B,U.z=D*Z,m.push(U.x,U.y,U.z),g.push(0,B,0),L.x=Z*.5+.5,L.y=he*.5*B+.5,y.push(L.x,L.y),M++}for(let G=0;G<a;G++){const J=P+G,H=V+G;A===!0?_.push(H,H+1,J):_.push(H+1,H,J),b+=3}f.addGroup(x,b,A===!0?1:2),x+=b}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Fs(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Nr extends Xn{constructor(e=1,t=1,i=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:a};const l=e/2,c=t/2,d=Math.floor(i),h=Math.floor(a),f=d+1,_=h+1,m=e/d,g=t/h,y=[],M=[],T=[],S=[];for(let x=0;x<_;x++){const R=x*g-c;for(let I=0;I<f;I++){const A=I*m-l;M.push(A,-R,0),T.push(0,0,1),S.push(I/d),S.push(1-x/h)}}for(let x=0;x<h;x++)for(let R=0;R<d;R++){const I=R+f*x,A=R+f*(x+1),P=R+1+f*(x+1),L=R+1+f*x;y.push(I,A,L),y.push(A,P,L)}this.setIndex(y),this.setAttribute("position",new hn(M,3)),this.setAttribute("normal",new hn(T,3)),this.setAttribute("uv",new hn(S,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Nr(e.width,e.height,e.widthSegments,e.heightSegments)}}function Ja(s){const e={};for(const t in s){e[t]={};for(const i in s[t]){const a=s[t][i];if(yg(a))a.isRenderTargetTexture?(at("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=a.clone();else if(Array.isArray(a))if(yg(a[0])){const l=[];for(let c=0,d=a.length;c<d;c++)l[c]=a[c].clone();e[t][i]=l}else e[t][i]=a.slice();else e[t][i]=a}}return e}function Gn(s){const e={};for(let t=0;t<s.length;t++){const i=Ja(s[t]);for(const a in i)e[a]=i[a]}return e}function yg(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function WM(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function J_(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:wt.workingColorSpace}const jM={clone:Ja,merge:Gn};var XM=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,qM=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class cr extends lr{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=XM,this.fragmentShader=qM,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ja(e.uniforms),this.uniformsGroups=WM(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const a in this.uniforms){const c=this.uniforms[a].value;c&&c.isTexture?t.uniforms[a]={type:"t",value:c.toJSON(e).uuid}:c&&c.isColor?t.uniforms[a]={type:"c",value:c.getHex()}:c&&c.isVector2?t.uniforms[a]={type:"v2",value:c.toArray()}:c&&c.isVector3?t.uniforms[a]={type:"v3",value:c.toArray()}:c&&c.isVector4?t.uniforms[a]={type:"v4",value:c.toArray()}:c&&c.isMatrix3?t.uniforms[a]={type:"m3",value:c.toArray()}:c&&c.isMatrix4?t.uniforms[a]={type:"m4",value:c.toArray()}:t.uniforms[a]={value:c}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const a in this.extensions)this.extensions[a]===!0&&(i[a]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const i in e.uniforms){const a=e.uniforms[i];switch(this.uniforms[i]={},a.type){case"t":this.uniforms[i].value=t[a.value]||null;break;case"c":this.uniforms[i].value=new ut().setHex(a.value);break;case"v2":this.uniforms[i].value=new ot().fromArray(a.value);break;case"v3":this.uniforms[i].value=new Y().fromArray(a.value);break;case"v4":this.uniforms[i].value=new nn().fromArray(a.value);break;case"m3":this.uniforms[i].value=new ft().fromArray(a.value);break;case"m4":this.uniforms[i].value=new Vt().fromArray(a.value);break;default:this.uniforms[i].value=a.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class YM extends cr{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Ki extends lr{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ut(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ut(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ru,this.normalScale=new ot(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Dr,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class $M extends Ki{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ot(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return yt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new ut(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new ut(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new ut(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class KM extends lr{constructor(e){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new ut(16777215),this.specular=new ut(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ut(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ru,this.normalScale=new ot(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Dr,this.combine=Of,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class ZM extends lr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=nM,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class QM extends lr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Sg={enabled:!1,files:{},add:function(s,e){this.enabled!==!1&&(Mg(s)||(this.files[s]=e))},get:function(s){if(this.enabled!==!1&&!Mg(s))return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};function Mg(s){try{const e=s.slice(s.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class JM{constructor(e,t,i){const a=this;let l=!1,c=0,d=0,h;const f=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this._abortController=null,this.itemStart=function(_){d++,l===!1&&a.onStart!==void 0&&a.onStart(_,c,d),l=!0},this.itemEnd=function(_){c++,a.onProgress!==void 0&&a.onProgress(_,c,d),c===d&&(l=!1,a.onLoad!==void 0&&a.onLoad())},this.itemError=function(_){a.onError!==void 0&&a.onError(_)},this.resolveURL=function(_){return _=_.normalize("NFC"),h?h(_):_},this.setURLModifier=function(_){return h=_,this},this.addHandler=function(_,m){return f.push(_,m),this},this.removeHandler=function(_){const m=f.indexOf(_);return m!==-1&&f.splice(m,2),this},this.getHandler=function(_){for(let m=0,g=f.length;m<g;m+=2){const y=f[m],M=f[m+1];if(y.global&&(y.lastIndex=0),y.test(_))return M}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const e1=new JM;class Kf{constructor(e){this.manager=e!==void 0?e:e1,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){const i=this;return new Promise(function(a,l){i.load(e,a,t,l)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}Kf.DEFAULT_MATERIAL_NAME="__DEFAULT";const wr={};class t1 extends Error{constructor(e,t){super(e),this.response=t}}class n1 extends Kf{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,i,a){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const l=Sg.get(`file:${e}`);if(l!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(l),this.manager.itemEnd(e)},0);return}if(wr[e]!==void 0){wr[e].push({onLoad:t,onProgress:i,onError:a});return}wr[e]=[],wr[e].push({onLoad:t,onProgress:i,onError:a});const c=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),d=this.mimeType,h=this.responseType;fetch(c).then(f=>{if(f.status===200||f.status===0){if(f.status===0&&at("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||f.body===void 0||f.body.getReader===void 0)return f;const _=wr[e],m=f.body.getReader(),g=f.headers.get("X-File-Size")||f.headers.get("Content-Length"),y=g?parseInt(g):0,M=y!==0;let T=0;const S=new ReadableStream({start(x){R();function R(){m.read().then(({done:I,value:A})=>{if(I)x.close();else{T+=A.byteLength;const P=new ProgressEvent("progress",{lengthComputable:M,loaded:T,total:y});for(let L=0,U=_.length;L<U;L++){const b=_[L];b.onProgress&&b.onProgress(P)}x.enqueue(A),R()}},I=>{x.error(I)})}}});return new Response(S)}else throw new t1(`fetch for "${f.url}" responded with ${f.status}: ${f.statusText}`,f)}).then(f=>{switch(h){case"arraybuffer":return f.arrayBuffer();case"blob":return f.blob();case"document":return f.text().then(_=>new DOMParser().parseFromString(_,d));case"json":return f.json();default:if(d==="")return f.text();{const m=/charset="?([^;"\s]*)"?/i.exec(d),g=m&&m[1]?m[1].toLowerCase():void 0,y=new TextDecoder(g);return f.arrayBuffer().then(M=>y.decode(M))}}}).then(f=>{Sg.add(`file:${e}`,f);const _=wr[e];delete wr[e];for(let m=0,g=_.length;m<g;m++){const y=_[m];y.onLoad&&y.onLoad(f)}}).catch(f=>{const _=wr[e];if(_===void 0)throw this.manager.itemError(e),f;delete wr[e];for(let m=0,g=_.length;m<g;m++){const y=_[m];y.onError&&y.onError(f)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}class mu extends rn{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ut(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class i1 extends mu{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(rn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ut(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const Ph=new Vt,Eg=new Y,wg=new Y;class ex{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ot(512,512),this.mapType=di,this.map=null,this.mapPass=null,this.matrix=new Vt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new $f,this._frameExtents=new ot(1,1),this._viewportCount=1,this._viewports=[new nn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera;Eg.setFromMatrixPosition(e.matrixWorld),t.position.copy(Eg),wg.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(wg),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,i,a){Ph.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),i.setFromProjectionMatrix(Ph,e.coordinateSystem,e.reversedDepth);const l=this._frameExtents,c=a?a.z/l.x:1,d=a?a.w/l.y:1,h=a?a.x/l.x:0,f=a?a.y/l.y:0;e.coordinateSystem===al||e.reversedDepth?t.set(.5*c,0,0,.5*c+h,0,.5*d,0,.5*d+f,0,0,1,0,0,0,0,1):t.set(.5*c,0,0,.5*c+h,0,.5*d,0,.5*d+f,0,0,.5,.5,0,0,0,1),t.multiply(Ph)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Hc=new Y,Vc=new hs,Yi=new Y;class tx extends rn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Vt,this.projectionMatrix=new Vt,this.projectionMatrixInverse=new Vt,this.coordinateSystem=nr,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Hc,Vc,Yi),Yi.x===1&&Yi.y===1&&Yi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Hc,Vc,Yi.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(Hc,Vc,Yi),Yi.x===1&&Yi.y===1&&Yi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Hc,Vc,Yi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const ns=new Y,bg=new ot,Tg=new ot;class ui extends tx{constructor(e=50,t=1,i=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=a,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=lu*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Qc*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return lu*2*Math.atan(Math.tan(Qc*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){ns.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ns.x,ns.y).multiplyScalar(-e/ns.z),ns.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ns.x,ns.y).multiplyScalar(-e/ns.z)}getViewSize(e,t){return this.getViewBounds(e,bg,Tg),t.subVectors(Tg,bg)}setViewOffset(e,t,i,a,l,c){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=a,this.view.width=l,this.view.height=c,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Qc*.5*this.fov)/this.zoom,i=2*t,a=this.aspect*i,l=-.5*a;const c=this.view;if(this.view!==null&&this.view.enabled){const h=c.fullWidth,f=c.fullHeight;l+=c.offsetX*a/h,t-=c.offsetY*i/f,a*=c.width/h,i*=c.height/f}const d=this.filmOffset;d!==0&&(l+=e*d/this.getFilmWidth()),this.projectionMatrix.makePerspective(l,l+a,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class r1 extends ex{constructor(){super(new ui(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,i=lu*2*e.angle*this.focus,a=this.mapSize.width/this.mapSize.height*this.aspect,l=e.distance||t.far;(i!==t.fov||a!==t.aspect||l!==t.far)&&(t.fov=i,t.aspect=a,t.far=l,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){const e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}}class s1 extends mu{constructor(e,t,i=0,a=Math.PI/3,l=0,c=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(rn.DEFAULT_UP),this.updateMatrix(),this.target=new rn,this.distance=i,this.angle=a,this.penumbra=l,this.decay=c,this.map=null,this.shadow=new r1}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}}class Zf extends tx{constructor(e=-1,t=1,i=1,a=-1,l=.1,c=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=a,this.near=l,this.far=c,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,a,l,c){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=a,this.view.width=l,this.view.height=c,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let l=i-e,c=i+e,d=a+t,h=a-t;if(this.view!==null&&this.view.enabled){const f=(this.right-this.left)/this.view.fullWidth/this.zoom,_=(this.top-this.bottom)/this.view.fullHeight/this.zoom;l+=f*this.view.offsetX,c=l+f*this.view.width,d-=_*this.view.offsetY,h=d-_*this.view.height}this.projectionMatrix.makeOrthographic(l,c,d,h,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class a1 extends ex{constructor(){super(new Zf(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Ag extends mu{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(rn.DEFAULT_UP),this.updateMatrix(),this.target=new rn,this.shadow=new a1}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class o1 extends mu{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}const Da=-90,Ia=1;class l1 extends rn{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new ui(Da,Ia,e,t);a.layers=this.layers,this.add(a);const l=new ui(Da,Ia,e,t);l.layers=this.layers,this.add(l);const c=new ui(Da,Ia,e,t);c.layers=this.layers,this.add(c);const d=new ui(Da,Ia,e,t);d.layers=this.layers,this.add(d);const h=new ui(Da,Ia,e,t);h.layers=this.layers,this.add(h);const f=new ui(Da,Ia,e,t);f.layers=this.layers,this.add(f)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,a,l,c,d,h]=t;for(const f of t)this.remove(f);if(e===nr)i.up.set(0,1,0),i.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),l.up.set(0,0,-1),l.lookAt(0,1,0),c.up.set(0,0,1),c.lookAt(0,-1,0),d.up.set(0,1,0),d.lookAt(0,0,1),h.up.set(0,1,0),h.lookAt(0,0,-1);else if(e===al)i.up.set(0,-1,0),i.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),l.up.set(0,0,1),l.lookAt(0,1,0),c.up.set(0,0,-1),c.lookAt(0,-1,0),d.up.set(0,-1,0),d.lookAt(0,0,1),h.up.set(0,-1,0),h.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const f of t)this.add(f),f.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:a}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[l,c,d,h,f,_]=this.children,m=e.getRenderTarget(),g=e.getActiveCubeFace(),y=e.getActiveMipmapLevel(),M=e.xr.enabled;e.xr.enabled=!1;const T=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let S=!1;e.isWebGLRenderer===!0?S=e.state.buffers.depth.getReversed():S=e.reversedDepthBuffer,e.setRenderTarget(i,0,a),S&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(i,1,a),S&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(i,2,a),S&&e.autoClear===!1&&e.clearDepth(),e.render(t,d),e.setRenderTarget(i,3,a),S&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(i,4,a),S&&e.autoClear===!1&&e.clearDepth(),e.render(t,f),i.texture.generateMipmaps=T,e.setRenderTarget(i,5,a),S&&e.autoClear===!1&&e.clearDepth(),e.render(t,_),e.setRenderTarget(m,g,y),e.xr.enabled=M,i.texture.needsPMREMUpdate=!0}}class c1 extends ui{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class Cg{constructor(e=1,t=0,i=0){this.radius=e,this.phi=t,this.theta=i}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=yt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(yt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const ip=class ip{constructor(e,t,i,a){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,a)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,a){const l=this.elements;return l[0]=e,l[2]=t,l[1]=i,l[3]=a,this}};ip.prototype.isMatrix2=!0;let Rg=ip;class u1 extends fs{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function Pg(s,e,t,i){const a=d1(i);switch(t){case V_:return s*e;case Hf:return s*e/a.components*a.byteLength;case Vf:return s*e/a.components*a.byteLength;case Ys:return s*e*2/a.components*a.byteLength;case Gf:return s*e*2/a.components*a.byteLength;case G_:return s*e*3/a.components*a.byteLength;case Vi:return s*e*4/a.components*a.byteLength;case Wf:return s*e*4/a.components*a.byteLength;case Yc:case $c:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Kc:case Zc:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Qh:case ef:return Math.max(s,16)*Math.max(e,8)/4;case Zh:case Jh:return Math.max(s,8)*Math.max(e,8)/2;case tf:case nf:case sf:case af:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case rf:case nu:case of:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case lf:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case cf:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case uf:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case df:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case hf:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case ff:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case pf:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case mf:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case gf:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case _f:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case xf:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case vf:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case yf:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case Sf:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case Mf:case Ef:case wf:return Math.ceil(s/4)*Math.ceil(e/4)*16;case bf:case Tf:return Math.ceil(s/4)*Math.ceil(e/4)*8;case iu:case Af:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function d1(s){switch(s){case di:case k_:return{byteLength:1,components:1};case rl:case B_:case or:return{byteLength:2,components:1};case Bf:case zf:return{byteLength:2,components:4};case ar:case kf:case Hi:return{byteLength:4,components:1};case z_:case H_:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ff}}));typeof window<"u"&&(window.__THREE__?at("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ff);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function nx(){let s=null,e=!1,t=null,i=null;function a(l,c){i=s.requestAnimationFrame(a),t(l,c)}return{start:function(){e!==!0&&t!==null&&s!==null&&(i=s.requestAnimationFrame(a),e=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(l){t=l},setContext:function(l){s=l}}}function h1(s){const e=new WeakMap;function t(d,h){const f=d.array,_=d.usage,m=f.byteLength,g=s.createBuffer();s.bindBuffer(h,g),s.bufferData(h,f,_),d.onUploadCallback();let y;if(f instanceof Float32Array)y=s.FLOAT;else if(typeof Float16Array<"u"&&f instanceof Float16Array)y=s.HALF_FLOAT;else if(f instanceof Uint16Array)d.isFloat16BufferAttribute?y=s.HALF_FLOAT:y=s.UNSIGNED_SHORT;else if(f instanceof Int16Array)y=s.SHORT;else if(f instanceof Uint32Array)y=s.UNSIGNED_INT;else if(f instanceof Int32Array)y=s.INT;else if(f instanceof Int8Array)y=s.BYTE;else if(f instanceof Uint8Array)y=s.UNSIGNED_BYTE;else if(f instanceof Uint8ClampedArray)y=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+f);return{buffer:g,type:y,bytesPerElement:f.BYTES_PER_ELEMENT,version:d.version,size:m}}function i(d,h,f){const _=h.array,m=h.updateRanges;if(s.bindBuffer(f,d),m.length===0)s.bufferSubData(f,0,_);else{m.sort((y,M)=>y.start-M.start);let g=0;for(let y=1;y<m.length;y++){const M=m[g],T=m[y];T.start<=M.start+M.count+1?M.count=Math.max(M.count,T.start+T.count-M.start):(++g,m[g]=T)}m.length=g+1;for(let y=0,M=m.length;y<M;y++){const T=m[y];s.bufferSubData(f,T.start*_.BYTES_PER_ELEMENT,_,T.start,T.count)}h.clearUpdateRanges()}h.onUploadCallback()}function a(d){return d.isInterleavedBufferAttribute&&(d=d.data),e.get(d)}function l(d){d.isInterleavedBufferAttribute&&(d=d.data);const h=e.get(d);h&&(s.deleteBuffer(h.buffer),e.delete(d))}function c(d,h){if(d.isInterleavedBufferAttribute&&(d=d.data),d.isGLBufferAttribute){const _=e.get(d);(!_||_.version<d.version)&&e.set(d,{buffer:d.buffer,type:d.type,bytesPerElement:d.elementSize,version:d.version});return}const f=e.get(d);if(f===void 0)e.set(d,t(d,h));else if(f.version<d.version){if(f.size!==d.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(f.buffer,d,h),f.version=d.version}}return{get:a,remove:l,update:c}}var f1=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,p1=`#ifdef USE_ALPHAHASH
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
#endif`,m1=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,g1=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,_1=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,x1=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,v1=`#ifdef USE_AOMAP
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
#endif`,y1=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,S1=`#ifdef USE_BATCHING
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
#endif`,M1=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,E1=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,w1=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,b1=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,T1=`#ifdef USE_IRIDESCENCE
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
#endif`,A1=`#ifdef USE_BUMPMAP
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
#endif`,C1=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,R1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,P1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,N1=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,L1=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,D1=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,I1=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,U1=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,F1=`#define PI 3.141592653589793
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
} // validated`,O1=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,k1=`vec3 transformedNormal = objectNormal;
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
#endif`,B1=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,z1=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,H1=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,V1=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,G1="gl_FragColor = linearToOutputTexel( gl_FragColor );",W1=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,j1=`#ifdef USE_ENVMAP
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
#endif`,X1=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,q1=`#ifdef USE_ENVMAP
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
#endif`,Y1=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,$1=`#ifdef USE_ENVMAP
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
#endif`,K1=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Z1=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Q1=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,J1=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,eE=`#ifdef USE_GRADIENTMAP
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
}`,tE=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,nE=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,iE=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,rE=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,sE=`#ifdef USE_ENVMAP
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
#endif`,aE=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,oE=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lE=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,cE=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,uE=`PhysicalMaterial material;
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
#endif`,dE=`uniform sampler2D dfgLUT;
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
}`,hE=`
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
#endif`,fE=`#if defined( RE_IndirectDiffuse )
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
#endif`,pE=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,mE=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,gE=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,_E=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,xE=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,vE=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,yE=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,SE=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ME=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,EE=`#if defined( USE_POINTS_UV )
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
#endif`,wE=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,bE=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,TE=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,AE=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,CE=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,RE=`#ifdef USE_MORPHTARGETS
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
#endif`,PE=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,NE=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,LE=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,DE=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,IE=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,UE=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,FE=`#ifdef USE_NORMALMAP
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
#endif`,OE=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,kE=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,BE=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,zE=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,HE=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,VE=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,GE=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,WE=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,jE=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,XE=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,qE=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,YE=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,$E=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,KE=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,ZE=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,QE=`float getShadowMask() {
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
}`,JE=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ew=`#ifdef USE_SKINNING
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
#endif`,tw=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,nw=`#ifdef USE_SKINNING
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
#endif`,iw=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,rw=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,sw=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,aw=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,ow=`#ifdef USE_TRANSMISSION
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
#endif`,lw=`#ifdef USE_TRANSMISSION
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
#endif`,cw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,uw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,dw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,hw=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const fw=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,pw=`uniform sampler2D t2D;
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
}`,mw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,gw=`#ifdef ENVMAP_TYPE_CUBE
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
}`,_w=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,xw=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vw=`#include <common>
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
}`,yw=`#if DEPTH_PACKING == 3200
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
}`,Sw=`#define DISTANCE
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
}`,Mw=`#define DISTANCE
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
}`,Ew=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ww=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bw=`uniform float scale;
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
}`,Tw=`uniform vec3 diffuse;
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
}`,Aw=`#include <common>
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
}`,Cw=`uniform vec3 diffuse;
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
}`,Rw=`#define LAMBERT
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
}`,Pw=`#define LAMBERT
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
}`,Nw=`#define MATCAP
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
}`,Lw=`#define MATCAP
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
}`,Dw=`#define NORMAL
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
}`,Iw=`#define NORMAL
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
}`,Uw=`#define PHONG
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
}`,Fw=`#define PHONG
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
}`,Ow=`#define STANDARD
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
}`,kw=`#define STANDARD
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
}`,Bw=`#define TOON
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
}`,zw=`#define TOON
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
}`,Hw=`uniform float size;
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
}`,Vw=`uniform vec3 diffuse;
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
}`,Gw=`#include <common>
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
}`,Ww=`uniform vec3 color;
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
}`,jw=`uniform float rotation;
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
}`,Xw=`uniform vec3 diffuse;
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
}`,_t={alphahash_fragment:f1,alphahash_pars_fragment:p1,alphamap_fragment:m1,alphamap_pars_fragment:g1,alphatest_fragment:_1,alphatest_pars_fragment:x1,aomap_fragment:v1,aomap_pars_fragment:y1,batching_pars_vertex:S1,batching_vertex:M1,begin_vertex:E1,beginnormal_vertex:w1,bsdfs:b1,iridescence_fragment:T1,bumpmap_pars_fragment:A1,clipping_planes_fragment:C1,clipping_planes_pars_fragment:R1,clipping_planes_pars_vertex:P1,clipping_planes_vertex:N1,color_fragment:L1,color_pars_fragment:D1,color_pars_vertex:I1,color_vertex:U1,common:F1,cube_uv_reflection_fragment:O1,defaultnormal_vertex:k1,displacementmap_pars_vertex:B1,displacementmap_vertex:z1,emissivemap_fragment:H1,emissivemap_pars_fragment:V1,colorspace_fragment:G1,colorspace_pars_fragment:W1,envmap_fragment:j1,envmap_common_pars_fragment:X1,envmap_pars_fragment:q1,envmap_pars_vertex:Y1,envmap_physical_pars_fragment:sE,envmap_vertex:$1,fog_vertex:K1,fog_pars_vertex:Z1,fog_fragment:Q1,fog_pars_fragment:J1,gradientmap_pars_fragment:eE,lightmap_pars_fragment:tE,lights_lambert_fragment:nE,lights_lambert_pars_fragment:iE,lights_pars_begin:rE,lights_toon_fragment:aE,lights_toon_pars_fragment:oE,lights_phong_fragment:lE,lights_phong_pars_fragment:cE,lights_physical_fragment:uE,lights_physical_pars_fragment:dE,lights_fragment_begin:hE,lights_fragment_maps:fE,lights_fragment_end:pE,lightprobes_pars_fragment:mE,logdepthbuf_fragment:gE,logdepthbuf_pars_fragment:_E,logdepthbuf_pars_vertex:xE,logdepthbuf_vertex:vE,map_fragment:yE,map_pars_fragment:SE,map_particle_fragment:ME,map_particle_pars_fragment:EE,metalnessmap_fragment:wE,metalnessmap_pars_fragment:bE,morphinstance_vertex:TE,morphcolor_vertex:AE,morphnormal_vertex:CE,morphtarget_pars_vertex:RE,morphtarget_vertex:PE,normal_fragment_begin:NE,normal_fragment_maps:LE,normal_pars_fragment:DE,normal_pars_vertex:IE,normal_vertex:UE,normalmap_pars_fragment:FE,clearcoat_normal_fragment_begin:OE,clearcoat_normal_fragment_maps:kE,clearcoat_pars_fragment:BE,iridescence_pars_fragment:zE,opaque_fragment:HE,packing:VE,premultiplied_alpha_fragment:GE,project_vertex:WE,dithering_fragment:jE,dithering_pars_fragment:XE,roughnessmap_fragment:qE,roughnessmap_pars_fragment:YE,shadowmap_pars_fragment:$E,shadowmap_pars_vertex:KE,shadowmap_vertex:ZE,shadowmask_pars_fragment:QE,skinbase_vertex:JE,skinning_pars_vertex:ew,skinning_vertex:tw,skinnormal_vertex:nw,specularmap_fragment:iw,specularmap_pars_fragment:rw,tonemapping_fragment:sw,tonemapping_pars_fragment:aw,transmission_fragment:ow,transmission_pars_fragment:lw,uv_pars_fragment:cw,uv_pars_vertex:uw,uv_vertex:dw,worldpos_vertex:hw,background_vert:fw,background_frag:pw,backgroundCube_vert:mw,backgroundCube_frag:gw,cube_vert:_w,cube_frag:xw,depth_vert:vw,depth_frag:yw,distance_vert:Sw,distance_frag:Mw,equirect_vert:Ew,equirect_frag:ww,linedashed_vert:bw,linedashed_frag:Tw,meshbasic_vert:Aw,meshbasic_frag:Cw,meshlambert_vert:Rw,meshlambert_frag:Pw,meshmatcap_vert:Nw,meshmatcap_frag:Lw,meshnormal_vert:Dw,meshnormal_frag:Iw,meshphong_vert:Uw,meshphong_frag:Fw,meshphysical_vert:Ow,meshphysical_frag:kw,meshtoon_vert:Bw,meshtoon_frag:zw,points_vert:Hw,points_frag:Vw,shadow_vert:Gw,shadow_frag:Ww,sprite_vert:jw,sprite_frag:Xw},Ue={common:{diffuse:{value:new ut(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ft},alphaMap:{value:null},alphaMapTransform:{value:new ft},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ft}},envmap:{envMap:{value:null},envMapRotation:{value:new ft},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ft}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ft}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ft},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ft},normalScale:{value:new ot(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ft},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ft}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ft}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ft}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ut(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new Y},probesMax:{value:new Y},probesResolution:{value:new Y}},points:{diffuse:{value:new ut(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ft},alphaTest:{value:0},uvTransform:{value:new ft}},sprite:{diffuse:{value:new ut(16777215)},opacity:{value:1},center:{value:new ot(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ft},alphaMap:{value:null},alphaMapTransform:{value:new ft},alphaTest:{value:0}}},er={basic:{uniforms:Gn([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.fog]),vertexShader:_t.meshbasic_vert,fragmentShader:_t.meshbasic_frag},lambert:{uniforms:Gn([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,Ue.lights,{emissive:{value:new ut(0)},envMapIntensity:{value:1}}]),vertexShader:_t.meshlambert_vert,fragmentShader:_t.meshlambert_frag},phong:{uniforms:Gn([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,Ue.lights,{emissive:{value:new ut(0)},specular:{value:new ut(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:_t.meshphong_vert,fragmentShader:_t.meshphong_frag},standard:{uniforms:Gn([Ue.common,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.roughnessmap,Ue.metalnessmap,Ue.fog,Ue.lights,{emissive:{value:new ut(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:_t.meshphysical_vert,fragmentShader:_t.meshphysical_frag},toon:{uniforms:Gn([Ue.common,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.gradientmap,Ue.fog,Ue.lights,{emissive:{value:new ut(0)}}]),vertexShader:_t.meshtoon_vert,fragmentShader:_t.meshtoon_frag},matcap:{uniforms:Gn([Ue.common,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,{matcap:{value:null}}]),vertexShader:_t.meshmatcap_vert,fragmentShader:_t.meshmatcap_frag},points:{uniforms:Gn([Ue.points,Ue.fog]),vertexShader:_t.points_vert,fragmentShader:_t.points_frag},dashed:{uniforms:Gn([Ue.common,Ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:_t.linedashed_vert,fragmentShader:_t.linedashed_frag},depth:{uniforms:Gn([Ue.common,Ue.displacementmap]),vertexShader:_t.depth_vert,fragmentShader:_t.depth_frag},normal:{uniforms:Gn([Ue.common,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,{opacity:{value:1}}]),vertexShader:_t.meshnormal_vert,fragmentShader:_t.meshnormal_frag},sprite:{uniforms:Gn([Ue.sprite,Ue.fog]),vertexShader:_t.sprite_vert,fragmentShader:_t.sprite_frag},background:{uniforms:{uvTransform:{value:new ft},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:_t.background_vert,fragmentShader:_t.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ft}},vertexShader:_t.backgroundCube_vert,fragmentShader:_t.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:_t.cube_vert,fragmentShader:_t.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:_t.equirect_vert,fragmentShader:_t.equirect_frag},distance:{uniforms:Gn([Ue.common,Ue.displacementmap,{referencePosition:{value:new Y},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:_t.distance_vert,fragmentShader:_t.distance_frag},shadow:{uniforms:Gn([Ue.lights,Ue.fog,{color:{value:new ut(0)},opacity:{value:1}}]),vertexShader:_t.shadow_vert,fragmentShader:_t.shadow_frag}};er.physical={uniforms:Gn([er.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ft},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ft},clearcoatNormalScale:{value:new ot(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ft},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ft},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ft},sheen:{value:0},sheenColor:{value:new ut(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ft},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ft},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ft},transmissionSamplerSize:{value:new ot},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ft},attenuationDistance:{value:0},attenuationColor:{value:new ut(0)},specularColor:{value:new ut(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ft},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ft},anisotropyVector:{value:new ot},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ft}}]),vertexShader:_t.meshphysical_vert,fragmentShader:_t.meshphysical_frag};const Gc={r:0,b:0,g:0},qw=new Vt,ix=new ft;ix.set(-1,0,0,0,1,0,0,0,1);function Yw(s,e,t,i,a,l){const c=new ut(0);let d=a===!0?0:1,h,f,_=null,m=0,g=null;function y(R){let I=R.isScene===!0?R.background:null;if(I&&I.isTexture){const A=R.backgroundBlurriness>0;I=e.get(I,A)}return I}function M(R){let I=!1;const A=y(R);A===null?S(c,d):A&&A.isColor&&(S(A,1),I=!0);const P=s.xr.getEnvironmentBlendMode();P==="additive"?t.buffers.color.setClear(0,0,0,1,l):P==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,l),(s.autoClear||I)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function T(R,I){const A=y(I);A&&(A.isCubeTexture||A.mapping===fu)?(f===void 0&&(f=new Bt(new Bi(1,1,1),new cr({name:"BackgroundCubeMaterial",uniforms:Ja(er.backgroundCube.uniforms),vertexShader:er.backgroundCube.vertexShader,fragmentShader:er.backgroundCube.fragmentShader,side:ti,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),f.geometry.deleteAttribute("normal"),f.geometry.deleteAttribute("uv"),f.onBeforeRender=function(P,L,U){this.matrixWorld.copyPosition(U.matrixWorld)},Object.defineProperty(f.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(f)),f.material.uniforms.envMap.value=A,f.material.uniforms.backgroundBlurriness.value=I.backgroundBlurriness,f.material.uniforms.backgroundIntensity.value=I.backgroundIntensity,f.material.uniforms.backgroundRotation.value.setFromMatrix4(qw.makeRotationFromEuler(I.backgroundRotation)).transpose(),A.isCubeTexture&&A.isRenderTargetTexture===!1&&f.material.uniforms.backgroundRotation.value.premultiply(ix),f.material.toneMapped=wt.getTransfer(A.colorSpace)!==kt,(_!==A||m!==A.version||g!==s.toneMapping)&&(f.material.needsUpdate=!0,_=A,m=A.version,g=s.toneMapping),f.layers.enableAll(),R.unshift(f,f.geometry,f.material,0,0,null)):A&&A.isTexture&&(h===void 0&&(h=new Bt(new Nr(2,2),new cr({name:"BackgroundMaterial",uniforms:Ja(er.background.uniforms),vertexShader:er.background.vertexShader,fragmentShader:er.background.fragmentShader,side:Xs,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(h)),h.material.uniforms.t2D.value=A,h.material.uniforms.backgroundIntensity.value=I.backgroundIntensity,h.material.toneMapped=wt.getTransfer(A.colorSpace)!==kt,A.matrixAutoUpdate===!0&&A.updateMatrix(),h.material.uniforms.uvTransform.value.copy(A.matrix),(_!==A||m!==A.version||g!==s.toneMapping)&&(h.material.needsUpdate=!0,_=A,m=A.version,g=s.toneMapping),h.layers.enableAll(),R.unshift(h,h.geometry,h.material,0,0,null))}function S(R,I){R.getRGB(Gc,J_(s)),t.buffers.color.setClear(Gc.r,Gc.g,Gc.b,I,l)}function x(){f!==void 0&&(f.geometry.dispose(),f.material.dispose(),f=void 0),h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0)}return{getClearColor:function(){return c},setClearColor:function(R,I=1){c.set(R),d=I,S(c,d)},getClearAlpha:function(){return d},setClearAlpha:function(R){d=R,S(c,d)},render:M,addToRenderList:T,dispose:x}}function $w(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),i={},a=g(null);let l=a,c=!1;function d(V,G,J,H,Z){let he=!1;const ne=m(V,H,J,G);l!==ne&&(l=ne,f(l.object)),he=y(V,H,J,Z),he&&M(V,H,J,Z),Z!==null&&e.update(Z,s.ELEMENT_ARRAY_BUFFER),(he||c)&&(c=!1,A(V,G,J,H),Z!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(Z).buffer))}function h(){return s.createVertexArray()}function f(V){return s.bindVertexArray(V)}function _(V){return s.deleteVertexArray(V)}function m(V,G,J,H){const Z=H.wireframe===!0;let he=i[G.id];he===void 0&&(he={},i[G.id]=he);const ne=V.isInstancedMesh===!0?V.id:0;let ee=he[ne];ee===void 0&&(ee={},he[ne]=ee);let $=ee[J.id];$===void 0&&($={},ee[J.id]=$);let K=$[Z];return K===void 0&&(K=g(h()),$[Z]=K),K}function g(V){const G=[],J=[],H=[];for(let Z=0;Z<t;Z++)G[Z]=0,J[Z]=0,H[Z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:G,enabledAttributes:J,attributeDivisors:H,object:V,attributes:{},index:null}}function y(V,G,J,H){const Z=l.attributes,he=G.attributes;let ne=0;const ee=J.getAttributes();for(const $ in ee)if(ee[$].location>=0){const F=Z[$];let se=he[$];if(se===void 0&&($==="instanceMatrix"&&V.instanceMatrix&&(se=V.instanceMatrix),$==="instanceColor"&&V.instanceColor&&(se=V.instanceColor)),F===void 0||F.attribute!==se||se&&F.data!==se.data)return!0;ne++}return l.attributesNum!==ne||l.index!==H}function M(V,G,J,H){const Z={},he=G.attributes;let ne=0;const ee=J.getAttributes();for(const $ in ee)if(ee[$].location>=0){let F=he[$];F===void 0&&($==="instanceMatrix"&&V.instanceMatrix&&(F=V.instanceMatrix),$==="instanceColor"&&V.instanceColor&&(F=V.instanceColor));const se={};se.attribute=F,F&&F.data&&(se.data=F.data),Z[$]=se,ne++}l.attributes=Z,l.attributesNum=ne,l.index=H}function T(){const V=l.newAttributes;for(let G=0,J=V.length;G<J;G++)V[G]=0}function S(V){x(V,0)}function x(V,G){const J=l.newAttributes,H=l.enabledAttributes,Z=l.attributeDivisors;J[V]=1,H[V]===0&&(s.enableVertexAttribArray(V),H[V]=1),Z[V]!==G&&(s.vertexAttribDivisor(V,G),Z[V]=G)}function R(){const V=l.newAttributes,G=l.enabledAttributes;for(let J=0,H=G.length;J<H;J++)G[J]!==V[J]&&(s.disableVertexAttribArray(J),G[J]=0)}function I(V,G,J,H,Z,he,ne){ne===!0?s.vertexAttribIPointer(V,G,J,Z,he):s.vertexAttribPointer(V,G,J,H,Z,he)}function A(V,G,J,H){T();const Z=H.attributes,he=J.getAttributes(),ne=G.defaultAttributeValues;for(const ee in he){const $=he[ee];if($.location>=0){let K=Z[ee];if(K===void 0&&(ee==="instanceMatrix"&&V.instanceMatrix&&(K=V.instanceMatrix),ee==="instanceColor"&&V.instanceColor&&(K=V.instanceColor)),K!==void 0){const F=K.normalized,se=K.itemSize,Se=e.get(K);if(Se===void 0)continue;const Ge=Se.buffer,Be=Se.type,Ve=Se.bytesPerElement,ae=Be===s.INT||Be===s.UNSIGNED_INT||K.gpuType===kf;if(K.isInterleavedBufferAttribute){const de=K.data,Ee=de.stride,$e=K.offset;if(de.isInstancedInterleavedBuffer){for(let Fe=0;Fe<$.locationSize;Fe++)x($.location+Fe,de.meshPerAttribute);V.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=de.meshPerAttribute*de.count)}else for(let Fe=0;Fe<$.locationSize;Fe++)S($.location+Fe);s.bindBuffer(s.ARRAY_BUFFER,Ge);for(let Fe=0;Fe<$.locationSize;Fe++)I($.location+Fe,se/$.locationSize,Be,F,Ee*Ve,($e+se/$.locationSize*Fe)*Ve,ae)}else{if(K.isInstancedBufferAttribute){for(let de=0;de<$.locationSize;de++)x($.location+de,K.meshPerAttribute);V.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let de=0;de<$.locationSize;de++)S($.location+de);s.bindBuffer(s.ARRAY_BUFFER,Ge);for(let de=0;de<$.locationSize;de++)I($.location+de,se/$.locationSize,Be,F,se*Ve,se/$.locationSize*de*Ve,ae)}}else if(ne!==void 0){const F=ne[ee];if(F!==void 0)switch(F.length){case 2:s.vertexAttrib2fv($.location,F);break;case 3:s.vertexAttrib3fv($.location,F);break;case 4:s.vertexAttrib4fv($.location,F);break;default:s.vertexAttrib1fv($.location,F)}}}}R()}function P(){D();for(const V in i){const G=i[V];for(const J in G){const H=G[J];for(const Z in H){const he=H[Z];for(const ne in he)_(he[ne].object),delete he[ne];delete H[Z]}}delete i[V]}}function L(V){if(i[V.id]===void 0)return;const G=i[V.id];for(const J in G){const H=G[J];for(const Z in H){const he=H[Z];for(const ne in he)_(he[ne].object),delete he[ne];delete H[Z]}}delete i[V.id]}function U(V){for(const G in i){const J=i[G];for(const H in J){const Z=J[H];if(Z[V.id]===void 0)continue;const he=Z[V.id];for(const ne in he)_(he[ne].object),delete he[ne];delete Z[V.id]}}}function b(V){for(const G in i){const J=i[G],H=V.isInstancedMesh===!0?V.id:0,Z=J[H];if(Z!==void 0){for(const he in Z){const ne=Z[he];for(const ee in ne)_(ne[ee].object),delete ne[ee];delete Z[he]}delete J[H],Object.keys(J).length===0&&delete i[G]}}}function D(){B(),c=!0,l!==a&&(l=a,f(l.object))}function B(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:d,reset:D,resetDefaultState:B,dispose:P,releaseStatesOfGeometry:L,releaseStatesOfObject:b,releaseStatesOfProgram:U,initAttributes:T,enableAttribute:S,disableUnusedAttributes:R}}function Kw(s,e,t){let i;function a(h){i=h}function l(h,f){s.drawArrays(i,h,f),t.update(f,i,1)}function c(h,f,_){_!==0&&(s.drawArraysInstanced(i,h,f,_),t.update(f,i,_))}function d(h,f,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,h,0,f,0,_);let g=0;for(let y=0;y<_;y++)g+=f[y];t.update(g,i,1)}this.setMode=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=d}function Zw(s,e,t,i){let a;function l(){if(a!==void 0)return a;if(e.has("EXT_texture_filter_anisotropic")===!0){const U=e.get("EXT_texture_filter_anisotropic");a=s.getParameter(U.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function c(U){return!(U!==Vi&&i.convert(U)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function d(U){const b=U===or&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(U!==di&&U!==Hi&&!b&&i.convert(U)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE))}function h(U){if(U==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";U="mediump"}return U==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let f=t.precision!==void 0?t.precision:"highp";const _=h(f);_!==f&&(at("WebGLRenderer:",f,"not supported, using",_,"instead."),f=_);const m=t.logarithmicDepthBuffer===!0,g=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&g===!1&&at("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const y=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),M=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),T=s.getParameter(s.MAX_TEXTURE_SIZE),S=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),x=s.getParameter(s.MAX_VERTEX_ATTRIBS),R=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),I=s.getParameter(s.MAX_VARYING_VECTORS),A=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),P=s.getParameter(s.MAX_SAMPLES),L=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:l,getMaxPrecision:h,textureFormatReadable:c,textureTypeReadable:d,precision:f,logarithmicDepthBuffer:m,reversedDepthBuffer:g,maxTextures:y,maxVertexTextures:M,maxTextureSize:T,maxCubemapSize:S,maxAttributes:x,maxVertexUniforms:R,maxVaryings:I,maxFragmentUniforms:A,maxSamples:P,samples:L}}function Qw(s){const e=this;let t=null,i=0,a=!1,l=!1;const c=new Tr,d=new ft,h={value:null,needsUpdate:!1};this.uniform=h,this.numPlanes=0,this.numIntersection=0,this.init=function(m,g){const y=m.length!==0||g||i!==0||a;return a=g,i=m.length,y},this.beginShadows=function(){l=!0,_(null)},this.endShadows=function(){l=!1},this.setGlobalState=function(m,g){t=_(m,g,0)},this.setState=function(m,g,y){const M=m.clippingPlanes,T=m.clipIntersection,S=m.clipShadows,x=s.get(m);if(!a||M===null||M.length===0||l&&!S)l?_(null):f();else{const R=l?0:i,I=R*4;let A=x.clippingState||null;h.value=A,A=_(M,g,I,y);for(let P=0;P!==I;++P)A[P]=t[P];x.clippingState=A,this.numIntersection=T?this.numPlanes:0,this.numPlanes+=R}};function f(){h.value!==t&&(h.value=t,h.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function _(m,g,y,M){const T=m!==null?m.length:0;let S=null;if(T!==0){if(S=h.value,M!==!0||S===null){const x=y+T*4,R=g.matrixWorldInverse;d.getNormalMatrix(R),(S===null||S.length<x)&&(S=new Float32Array(x));for(let I=0,A=y;I!==T;++I,A+=4)c.copy(m[I]).applyMatrix4(R,d),c.normal.toArray(S,A),S[A+3]=c.constant}h.value=S,h.needsUpdate=!0}return e.numPlanes=T,e.numIntersection=0,S}}const ka=4,Jw=6,eb=20,tb=256,Yo=new Zf,Ng=new ut;let Nh=null,Lh=0,Dh=0,Ih=!1;const nb=new Y,Us=new Y;class Lg{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,a=100,l={}){const{size:c=256,position:d=nb}=l;Nh=this._renderer.getRenderTarget(),Lh=this._renderer.getActiveCubeFace(),Dh=this._renderer.getActiveMipmapLevel(),Ih=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(c);const h=this._allocateTargets();return h.depthBuffer=!0,this._sceneToCubeUV(e,i,a,h,d),t>0&&this._blur(h,0,0,t),this._applyPMREM(h),this._cleanup(h),h}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ug(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ig(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Nh,Lh,Dh),this._renderer.xr.enabled=Ih,e.scissorTest=!1,Ua(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===qs||e.mapping===Qa?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Nh=this._renderer.getRenderTarget(),Lh=this._renderer.getActiveCubeFace(),Dh=this._renderer.getActiveMipmapLevel(),Ih=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Bn,minFilter:Bn,generateMipmaps:!1,type:or,format:Vi,colorSpace:su,depthBuffer:!1},a=Dg(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Dg(e,t,i);const{_lodMax:l}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=ib(l)),this._blurMaterial=sb(l,e,t),this._ggxMaterial=rb(l,e,t)}return a}_compileMaterial(e){const t=new Bt(new Xn,e);this._renderer.compile(t,Yo)}_sceneToCubeUV(e,t,i,a,l){const h=new ui(90,1,t,i),f=[1,-1,1,1,1,1],_=[1,1,1,-1,-1,-1],m=this._renderer,g=m.autoClear,y=m.toneMapping;m.getClearColor(Ng),m.toneMapping=rr,m.autoClear=!1,m.state.buffers.depth.getReversed()&&(m.setRenderTarget(a),m.clearDepth(),m.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Bt(new Bi,new js({name:"PMREM.Background",side:ti,depthWrite:!1,depthTest:!1})));const T=this._backgroundBox,S=T.material;let x=!1;const R=e.background;R?R.isColor&&(S.color.copy(R),e.background=null,x=!0):(S.color.copy(Ng),x=!0);for(let I=0;I<6;I++){const A=I%3;A===0?(h.up.set(0,f[I],0),h.position.set(l.x,l.y,l.z),h.lookAt(l.x+_[I],l.y,l.z)):A===1?(h.up.set(0,0,f[I]),h.position.set(l.x,l.y,l.z),h.lookAt(l.x,l.y+_[I],l.z)):(h.up.set(0,f[I],0),h.position.set(l.x,l.y,l.z),h.lookAt(l.x,l.y,l.z+_[I]));const P=this._cubeSize;Ua(a,A*P,I>2?P:0,P,P),m.setRenderTarget(a),x&&m.render(T,h),m.render(e,h)}m.toneMapping=y,m.autoClear=g,e.background=R}_textureToCubeUV(e,t){const i=this._renderer,a=e.mapping===qs||e.mapping===Qa;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ug()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ig());const l=a?this._cubemapMaterial:this._equirectMaterial,c=this._lodMeshes[0];c.material=l;const d=l.uniforms;d.envMap.value=e;const h=this._cubeSize;Ua(t,0,0,3*h,2*h),i.setRenderTarget(t),i.render(c,Yo)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const a=this._lodMeshes.length;for(let l=1;l<a;l++)this._applyGGXFilter(e,l-1,l);t.autoClear=i}_applyGGXFilter(e,t,i){const a=this._renderer,l=this._pingPongRenderTarget,c=this._ggxMaterial,d=this._lodMeshes[i];d.material=c;const h=c.uniforms,f=i/(this._lodMeshes.length-1),_=t/(this._lodMeshes.length-1),m=Math.sqrt(f*f-_*_),g=f*1.25,y=m*g,{_lodMax:M}=this,T=this._sizeLods[i],S=3*T*(i>M-ka?i-M+ka:0),x=4*(this._cubeSize-T);h.envMap.value=e.texture,h.roughness.value=y,h.mipInt.value=M-t,Ua(l,S,x,3*T,2*T),a.setRenderTarget(l),a.render(d,Yo),h.envMap.value=l.texture,h.roughness.value=0,h.mipInt.value=M-i,Ua(e,S,x,3*T,2*T),a.setRenderTarget(e),a.render(d,Yo)}_blur(e,t,i,a){const l=this._pingPongRenderTarget,c=Math.min(a,Math.PI)/Math.SQRT2;this._blurPass(e,l,t,i,c),this._blurPass(l,e,i,i,c)}_blurPass(e,t,i,a,l){const c=this._renderer,d=this._blurMaterial,h=this._lodMeshes[a];h.material=d;const f=d.uniforms;f.envMap.value=e.texture,f.sigma.value=l,f.mipInt.value=this._lodMax-i;const _=this._sizeLods[a],m=3*_*(a>this._lodMax-ka?a-this._lodMax+ka:0),g=4*(this._cubeSize-_);Ua(t,m,g,3*_,2*_),c.setRenderTarget(t),c.render(h,Yo)}}function ib(s){const e=[],t=[];let i=s;const a=s-ka+1+Jw;for(let l=0;l<a;l++){const c=Math.pow(2,i);e.push(c);const d=1/(c-2),h=-d,f=1+d,_=[h,h,f,h,f,f,h,h,f,f,h,f],m=6,g=6,y=3,M=new Float32Array(y*g*m),T=new Float32Array(y*g*m);for(let x=0;x<m;x++){const R=x%3*2/3-1,I=x>2?0:-1,A=[R,I,0,R+2/3,I,0,R+2/3,I+1,0,R,I,0,R+2/3,I+1,0,R,I+1,0];M.set(A,y*g*x);for(let P=0;P<g;P++){const L=_[P*2]*2-1,U=_[P*2+1]*2-1;x===0?Us.set(1,U,L):x===1?Us.set(-L,1,-U):x===2?Us.set(-L,U,1):x===3?Us.set(-1,U,-L):x===4?Us.set(-L,-1,U):Us.set(L,U,-1),Us.toArray(T,(x*g+P)*y)}}const S=new Xn;S.setAttribute("position",new sr(M,y)),S.setAttribute("outputDirection",new sr(T,y)),t.push(new Bt(S,null)),i>ka&&i--}return{lodMeshes:t,sizeLods:e}}function Dg(s,e,t){const i=new Gi(s,e,t);return i.texture.mapping=fu,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Ua(s,e,t,i,a){s.viewport.set(e,t,i,a),s.scissor.set(e,t,i,a)}function rb(s,e,t){return new cr({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:tb,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:gu(),fragmentShader:`

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
		`,blending:Rr,depthTest:!1,depthWrite:!1})}function sb(s,e,t){return new cr({name:"SphericalGaussianBlur",defines:{SAMPLES:eb,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:gu(),fragmentShader:`

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
		`,blending:Rr,depthTest:!1,depthWrite:!1})}function Ig(){return new cr({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:gu(),fragmentShader:`

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
		`,blending:Rr,depthTest:!1,depthWrite:!1})}function Ug(){return new cr({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:gu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Rr,depthTest:!1,depthWrite:!1})}function gu(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}class rx extends Gi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},a=[i,i,i,i,i,i];this.texture=new Z_(a),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},a=new Bi(5,5,5),l=new cr({name:"CubemapFromEquirect",uniforms:Ja(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:ti,blending:Rr});l.uniforms.tEquirect.value=t;const c=new Bt(a,l),d=t.minFilter;return t.minFilter===Os&&(t.minFilter=Bn),new l1(1,10,this).update(e,c),t.minFilter=d,c.geometry.dispose(),c.material.dispose(),this}clear(e,t=!0,i=!0,a=!0){const l=e.getRenderTarget();for(let c=0;c<6;c++)e.setRenderTarget(this,c),e.clear(t,i,a);e.setRenderTarget(l)}}function ab(s){let e=new WeakMap,t=new WeakMap,i=null;function a(g,y=!1){return g==null?null:y?c(g):l(g)}function l(g){if(g&&g.isTexture){const y=g.mapping;if(y===ih||y===rh)if(e.has(g)){const M=e.get(g).texture;return d(M,g.mapping)}else{const M=g.image;if(M&&M.height>0){const T=new rx(M.height);return T.fromEquirectangularTexture(s,g),e.set(g,T),g.addEventListener("dispose",f),d(T.texture,g.mapping)}else return null}}return g}function c(g){if(g&&g.isTexture){const y=g.mapping,M=y===ih||y===rh,T=y===qs||y===Qa;if(M||T){let S=t.get(g);const x=S!==void 0?S.texture.pmremVersion:0;if(g.isRenderTargetTexture&&g.pmremVersion!==x)return i===null&&(i=new Lg(s)),S=M?i.fromEquirectangular(g,S):i.fromCubemap(g,S),S.texture.pmremVersion=g.pmremVersion,t.set(g,S),S.texture;if(S!==void 0)return S.texture;{const R=g.image;return M&&R&&R.height>0||T&&R&&h(R)?(i===null&&(i=new Lg(s)),S=M?i.fromEquirectangular(g):i.fromCubemap(g),S.texture.pmremVersion=g.pmremVersion,t.set(g,S),g.addEventListener("dispose",_),S.texture):null}}}return g}function d(g,y){return y===ih?g.mapping=qs:y===rh&&(g.mapping=Qa),g}function h(g){let y=0;const M=6;for(let T=0;T<M;T++)g[T]!==void 0&&y++;return y===M}function f(g){const y=g.target;y.removeEventListener("dispose",f);const M=e.get(y);M!==void 0&&(e.delete(y),M.dispose())}function _(g){const y=g.target;y.removeEventListener("dispose",_);const M=t.get(y);M!==void 0&&(t.delete(y),M.dispose())}function m(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:a,dispose:m}}function ob(s){const e={};function t(i){if(e[i]!==void 0)return e[i];const a=s.getExtension(i);return e[i]=a,a}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const a=t(i);return a===null&&za("WebGLRenderer: "+i+" extension not supported."),a}}}function lb(s,e,t,i){const a={},l=new WeakMap;function c(m){const g=m.target;g.index!==null&&e.remove(g.index);for(const M in g.attributes)e.remove(g.attributes[M]);g.removeEventListener("dispose",c),delete a[g.id];const y=l.get(g);y&&(e.remove(y),l.delete(g)),i.releaseStatesOfGeometry(g),g.isInstancedBufferGeometry===!0&&delete g._maxInstanceCount,t.memory.geometries--}function d(m,g){return a[g.id]===!0||(g.addEventListener("dispose",c),a[g.id]=!0,t.memory.geometries++),g}function h(m){const g=m.attributes;for(const y in g)e.update(g[y],s.ARRAY_BUFFER)}function f(m){const g=[],y=m.index,M=m.attributes.position;let T=0;if(M===void 0)return;if(y!==null){const R=y.array;T=y.version;for(let I=0,A=R.length;I<A;I+=3){const P=R[I+0],L=R[I+1],U=R[I+2];g.push(P,L,L,U,U,P)}}else{const R=M.array;T=M.version;for(let I=0,A=R.length/3-1;I<A;I+=3){const P=I+0,L=I+1,U=I+2;g.push(P,L,L,U,U,P)}}const S=new(M.count>=65535?$_:Y_)(g,1);S.version=T;const x=l.get(m);x&&e.remove(x),l.set(m,S)}function _(m){const g=l.get(m);if(g){const y=m.index;y!==null&&g.version<y.version&&f(m)}else f(m);return l.get(m)}return{get:d,update:h,getWireframeAttribute:_}}function cb(s,e,t){let i;function a(m){i=m}let l,c;function d(m){l=m.type,c=m.bytesPerElement}function h(m,g){s.drawElements(i,g,l,m*c),t.update(g,i,1)}function f(m,g,y){y!==0&&(s.drawElementsInstanced(i,g,l,m*c,y),t.update(g,i,y))}function _(m,g,y){if(y===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,g,0,l,m,0,y);let T=0;for(let S=0;S<y;S++)T+=g[S];t.update(T,i,1)}this.setMode=a,this.setIndex=d,this.render=h,this.renderInstances=f,this.renderMultiDraw=_}function ub(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(l,c,d){switch(t.calls++,c){case s.TRIANGLES:t.triangles+=d*(l/3);break;case s.LINES:t.lines+=d*(l/2);break;case s.LINE_STRIP:t.lines+=d*(l-1);break;case s.LINE_LOOP:t.lines+=d*l;break;case s.POINTS:t.points+=d*l;break;default:Dt("WebGLInfo: Unknown draw mode:",c);break}}function a(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:a,update:i}}function db(s,e,t){const i=new WeakMap,a=new nn;function l(c,d,h){const f=c.morphTargetInfluences,_=d.morphAttributes.position||d.morphAttributes.normal||d.morphAttributes.color,m=_!==void 0?_.length:0;let g=i.get(d);if(g===void 0||g.count!==m){let B=function(){b.dispose(),i.delete(d),d.removeEventListener("dispose",B)};var y=B;g!==void 0&&g.texture.dispose();const M=d.morphAttributes.position!==void 0,T=d.morphAttributes.normal!==void 0,S=d.morphAttributes.color!==void 0,x=d.morphAttributes.position||[],R=d.morphAttributes.normal||[],I=d.morphAttributes.color||[];let A=0;M===!0&&(A=1),T===!0&&(A=2),S===!0&&(A=3);let P=d.attributes.position.count*A,L=1;P>e.maxTextureSize&&(L=Math.ceil(P/e.maxTextureSize),P=e.maxTextureSize);const U=new Float32Array(P*L*4*m),b=new j_(U,P,L,m);b.type=Hi,b.needsUpdate=!0;const D=A*4;for(let V=0;V<m;V++){const G=x[V],J=R[V],H=I[V],Z=P*L*4*V;for(let he=0;he<G.count;he++){const ne=he*D;M===!0&&(a.fromBufferAttribute(G,he),U[Z+ne+0]=a.x,U[Z+ne+1]=a.y,U[Z+ne+2]=a.z,U[Z+ne+3]=0),T===!0&&(a.fromBufferAttribute(J,he),U[Z+ne+4]=a.x,U[Z+ne+5]=a.y,U[Z+ne+6]=a.z,U[Z+ne+7]=0),S===!0&&(a.fromBufferAttribute(H,he),U[Z+ne+8]=a.x,U[Z+ne+9]=a.y,U[Z+ne+10]=a.z,U[Z+ne+11]=H.itemSize===4?a.w:1)}}g={count:m,texture:b,size:new ot(P,L)},i.set(d,g),d.addEventListener("dispose",B)}if(c.isInstancedMesh===!0&&c.morphTexture!==null)h.getUniforms().setValue(s,"morphTexture",c.morphTexture,t);else{let M=0;for(let S=0;S<f.length;S++)M+=f[S];const T=d.morphTargetsRelative?1:1-M;h.getUniforms().setValue(s,"morphTargetBaseInfluence",T),h.getUniforms().setValue(s,"morphTargetInfluences",f)}h.getUniforms().setValue(s,"morphTargetsTexture",g.texture,t),h.getUniforms().setValue(s,"morphTargetsTextureSize",g.size)}return{update:l}}function hb(s,e,t,i,a){let l=new WeakMap;function c(f){const _=a.render.frame,m=f.geometry,g=e.get(f,m);if(l.get(g)!==_&&(e.update(g),l.set(g,_)),f.isInstancedMesh&&(f.hasEventListener("dispose",h)===!1&&f.addEventListener("dispose",h),l.get(f)!==_&&(t.update(f.instanceMatrix,s.ARRAY_BUFFER),f.instanceColor!==null&&t.update(f.instanceColor,s.ARRAY_BUFFER),l.set(f,_))),f.isSkinnedMesh){const y=f.skeleton;l.get(y)!==_&&(y.update(),l.set(y,_))}return g}function d(){l=new WeakMap}function h(f){const _=f.target;_.removeEventListener("dispose",h),i.releaseStatesOfObject(_),t.remove(_.instanceMatrix),_.instanceColor!==null&&t.remove(_.instanceColor)}return{update:c,dispose:d}}const fb={[P_]:"LINEAR_TONE_MAPPING",[N_]:"REINHARD_TONE_MAPPING",[L_]:"CINEON_TONE_MAPPING",[D_]:"ACES_FILMIC_TONE_MAPPING",[U_]:"AGX_TONE_MAPPING",[F_]:"NEUTRAL_TONE_MAPPING",[I_]:"CUSTOM_TONE_MAPPING"};function pb(s,e,t,i,a,l){const c=new Gi(e,t,{type:s,depthBuffer:a,stencilBuffer:l,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let d=null,h=null;const f=new Xn;f.setAttribute("position",new hn([-1,3,0,-1,-1,0,3,-1,0],3)),f.setAttribute("uv",new hn([0,2,0,0,2,0],2));const _=new YM({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),m=new Bt(f,_),g=new Zf(-1,1,1,-1,0,1);let y=null,M=null,T=!1,S,x=null,R=[],I=!1;this.setSize=function(A,P){c.setSize(A,P),d!==null&&d.setSize(A,P),h!==null&&h.setSize(A,P);for(let L=0;L<R.length;L++){const U=R[L];U.setSize&&U.setSize(A,P)}},this.setEffects=function(A){R=A,I=R.length>0&&R[0].isRenderPass===!0;const P=c.width,L=c.height;R.length>0&&d===null&&(d=new Gi(P,L,{type:or,depthBuffer:!1,stencilBuffer:!1}),h=new Gi(P,L,{type:or,depthBuffer:!1,stencilBuffer:!1}));for(let U=0;U<R.length;U++){const b=R[U];b.setSize&&b.setSize(P,L)}},this.begin=function(A,P){if(T||A.toneMapping===rr&&R.length===0)return!1;if(x=P,P!==null){const L=P.width,U=P.height;(c.width!==L||c.height!==U)&&this.setSize(L,U)}return I===!1&&A.setRenderTarget(c),S=A.toneMapping,A.toneMapping=rr,!0},this.hasRenderPass=function(){return I},this.end=function(A,P){A.toneMapping=S,T=!0;let L=c,U=d;for(let b=0;b<R.length;b++){const D=R[b];D.enabled!==!1&&(D.render(A,U,L,P),D.needsSwap!==!1&&(L=U,U=U===d?h:d))}if(y!==A.outputColorSpace||M!==A.toneMapping){y=A.outputColorSpace,M=A.toneMapping,_.defines={},wt.getTransfer(y)===kt&&(_.defines.SRGB_TRANSFER="");const b=fb[M];b&&(_.defines[b]=""),_.needsUpdate=!0}_.uniforms.tDiffuse.value=L.texture,A.setRenderTarget(x),A.render(m,g),x=null,T=!1},this.isCompositing=function(){return T},this.dispose=function(){c.dispose(),d!==null&&d.dispose(),h!==null&&h.dispose(),f.dispose(),_.dispose()}}const sx=new jn,Pf=new ol(1,1),ax=new j_,ox=new EM,lx=new Z_,Fg=[],Og=[],kg=new Float32Array(16),Bg=new Float32Array(9),zg=new Float32Array(4);function eo(s,e,t){const i=s[0];if(i<=0||i>0)return s;const a=e*t;let l=Fg[a];if(l===void 0&&(l=new Float32Array(a),Fg[a]=l),e!==0){i.toArray(l,0);for(let c=1,d=0;c!==e;++c)d+=t,s[c].toArray(l,d)}return l}function yn(s,e){if(s.length!==e.length)return!1;for(let t=0,i=s.length;t<i;t++)if(s[t]!==e[t])return!1;return!0}function Sn(s,e){for(let t=0,i=e.length;t<i;t++)s[t]=e[t]}function _u(s,e){let t=Og[e];t===void 0&&(t=new Int32Array(e),Og[e]=t);for(let i=0;i!==e;++i)t[i]=s.allocateTextureUnit();return t}function mb(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function gb(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(yn(t,e))return;s.uniform2fv(this.addr,e),Sn(t,e)}}function _b(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(yn(t,e))return;s.uniform3fv(this.addr,e),Sn(t,e)}}function xb(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(yn(t,e))return;s.uniform4fv(this.addr,e),Sn(t,e)}}function vb(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(yn(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),Sn(t,e)}else{if(yn(t,i))return;zg.set(i),s.uniformMatrix2fv(this.addr,!1,zg),Sn(t,i)}}function yb(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(yn(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),Sn(t,e)}else{if(yn(t,i))return;Bg.set(i),s.uniformMatrix3fv(this.addr,!1,Bg),Sn(t,i)}}function Sb(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(yn(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),Sn(t,e)}else{if(yn(t,i))return;kg.set(i),s.uniformMatrix4fv(this.addr,!1,kg),Sn(t,i)}}function Mb(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function Eb(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(yn(t,e))return;s.uniform2iv(this.addr,e),Sn(t,e)}}function wb(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(yn(t,e))return;s.uniform3iv(this.addr,e),Sn(t,e)}}function bb(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(yn(t,e))return;s.uniform4iv(this.addr,e),Sn(t,e)}}function Tb(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function Ab(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(yn(t,e))return;s.uniform2uiv(this.addr,e),Sn(t,e)}}function Cb(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(yn(t,e))return;s.uniform3uiv(this.addr,e),Sn(t,e)}}function Rb(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(yn(t,e))return;s.uniform4uiv(this.addr,e),Sn(t,e)}}function Pb(s,e,t){const i=this.cache,a=t.allocateTextureUnit();i[0]!==a&&(s.uniform1i(this.addr,a),i[0]=a);let l;this.type===s.SAMPLER_2D_SHADOW?(Pf.compareFunction=t.isReversedDepthBuffer()?Xf:jf,l=Pf):l=sx,t.setTexture2D(e||l,a)}function Nb(s,e,t){const i=this.cache,a=t.allocateTextureUnit();i[0]!==a&&(s.uniform1i(this.addr,a),i[0]=a),t.setTexture3D(e||ox,a)}function Lb(s,e,t){const i=this.cache,a=t.allocateTextureUnit();i[0]!==a&&(s.uniform1i(this.addr,a),i[0]=a),t.setTextureCube(e||lx,a)}function Db(s,e,t){const i=this.cache,a=t.allocateTextureUnit();i[0]!==a&&(s.uniform1i(this.addr,a),i[0]=a),t.setTexture2DArray(e||ax,a)}function Ib(s){switch(s){case 5126:return mb;case 35664:return gb;case 35665:return _b;case 35666:return xb;case 35674:return vb;case 35675:return yb;case 35676:return Sb;case 5124:case 35670:return Mb;case 35667:case 35671:return Eb;case 35668:case 35672:return wb;case 35669:case 35673:return bb;case 5125:return Tb;case 36294:return Ab;case 36295:return Cb;case 36296:return Rb;case 35678:case 36198:case 36298:case 36306:case 35682:return Pb;case 35679:case 36299:case 36307:return Nb;case 35680:case 36300:case 36308:case 36293:return Lb;case 36289:case 36303:case 36311:case 36292:return Db}}function Ub(s,e){s.uniform1fv(this.addr,e)}function Fb(s,e){const t=eo(e,this.size,2);s.uniform2fv(this.addr,t)}function Ob(s,e){const t=eo(e,this.size,3);s.uniform3fv(this.addr,t)}function kb(s,e){const t=eo(e,this.size,4);s.uniform4fv(this.addr,t)}function Bb(s,e){const t=eo(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function zb(s,e){const t=eo(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function Hb(s,e){const t=eo(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function Vb(s,e){s.uniform1iv(this.addr,e)}function Gb(s,e){s.uniform2iv(this.addr,e)}function Wb(s,e){s.uniform3iv(this.addr,e)}function jb(s,e){s.uniform4iv(this.addr,e)}function Xb(s,e){s.uniform1uiv(this.addr,e)}function qb(s,e){s.uniform2uiv(this.addr,e)}function Yb(s,e){s.uniform3uiv(this.addr,e)}function $b(s,e){s.uniform4uiv(this.addr,e)}function Kb(s,e,t){const i=this.cache,a=e.length,l=_u(t,a);yn(i,l)||(s.uniform1iv(this.addr,l),Sn(i,l));let c;this.type===s.SAMPLER_2D_SHADOW?c=Pf:c=sx;for(let d=0;d!==a;++d)t.setTexture2D(e[d]||c,l[d])}function Zb(s,e,t){const i=this.cache,a=e.length,l=_u(t,a);yn(i,l)||(s.uniform1iv(this.addr,l),Sn(i,l));for(let c=0;c!==a;++c)t.setTexture3D(e[c]||ox,l[c])}function Qb(s,e,t){const i=this.cache,a=e.length,l=_u(t,a);yn(i,l)||(s.uniform1iv(this.addr,l),Sn(i,l));for(let c=0;c!==a;++c)t.setTextureCube(e[c]||lx,l[c])}function Jb(s,e,t){const i=this.cache,a=e.length,l=_u(t,a);yn(i,l)||(s.uniform1iv(this.addr,l),Sn(i,l));for(let c=0;c!==a;++c)t.setTexture2DArray(e[c]||ax,l[c])}function eT(s){switch(s){case 5126:return Ub;case 35664:return Fb;case 35665:return Ob;case 35666:return kb;case 35674:return Bb;case 35675:return zb;case 35676:return Hb;case 5124:case 35670:return Vb;case 35667:case 35671:return Gb;case 35668:case 35672:return Wb;case 35669:case 35673:return jb;case 5125:return Xb;case 36294:return qb;case 36295:return Yb;case 36296:return $b;case 35678:case 36198:case 36298:case 36306:case 35682:return Kb;case 35679:case 36299:case 36307:return Zb;case 35680:case 36300:case 36308:case 36293:return Qb;case 36289:case 36303:case 36311:case 36292:return Jb}}class tT{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Ib(t.type)}}class nT{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=eT(t.type)}}class iT{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const a=this.seq;for(let l=0,c=a.length;l!==c;++l){const d=a[l];d.setValue(e,t[d.id],i)}}}const Uh=/(\w+)(\])?(\[|\.)?/g;function Hg(s,e){s.seq.push(e),s.map[e.id]=e}function rT(s,e,t){const i=s.name,a=i.length;for(Uh.lastIndex=0;;){const l=Uh.exec(i),c=Uh.lastIndex;let d=l[1];const h=l[2]==="]",f=l[3];if(h&&(d=d|0),f===void 0||f==="["&&c+2===a){Hg(t,f===void 0?new tT(d,s,e):new nT(d,s,e));break}else{let m=t.map[d];m===void 0&&(m=new iT(d),Hg(t,m)),t=m}}}class Jc{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let c=0;c<i;++c){const d=e.getActiveUniform(t,c),h=e.getUniformLocation(t,d.name);rT(d,h,this)}const a=[],l=[];for(const c of this.seq)c.type===e.SAMPLER_2D_SHADOW||c.type===e.SAMPLER_CUBE_SHADOW||c.type===e.SAMPLER_2D_ARRAY_SHADOW?a.push(c):l.push(c);a.length>0&&(this.seq=a.concat(l))}setValue(e,t,i,a){const l=this.map[t];l!==void 0&&l.setValue(e,i,a)}setOptional(e,t,i){const a=t[i];a!==void 0&&this.setValue(e,i,a)}static upload(e,t,i,a){for(let l=0,c=t.length;l!==c;++l){const d=t[l],h=i[d.id];h.needsUpdate!==!1&&d.setValue(e,h.value,a)}}static seqWithValue(e,t){const i=[];for(let a=0,l=e.length;a!==l;++a){const c=e[a];c.id in t&&i.push(c)}return i}}function Vg(s,e,t){const i=s.createShader(e);return s.shaderSource(i,t),s.compileShader(i),i}const sT=37297;let aT=0;function oT(s,e){const t=s.split(`
`),i=[],a=Math.max(e-6,0),l=Math.min(e+6,t.length);for(let c=a;c<l;c++){const d=c+1;i.push(`${d===e?">":" "} ${d}: ${t[c]}`)}return i.join(`
`)}const Gg=new ft;function lT(s){wt._getMatrix(Gg,wt.workingColorSpace,s);const e=`mat3( ${Gg.elements.map(t=>t.toFixed(4))} )`;switch(wt.getTransfer(s)){case au:return[e,"LinearTransferOETF"];case kt:return[e,"sRGBTransferOETF"];default:return at("WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function Wg(s,e,t){const i=s.getShaderParameter(e,s.COMPILE_STATUS),l=(s.getShaderInfoLog(e)||"").trim();if(i&&l==="")return"";const c=/ERROR: 0:(\d+)/.exec(l);if(c){const d=parseInt(c[1]);return t.toUpperCase()+`

`+l+`

`+oT(s.getShaderSource(e),d)}else return l}function cT(s,e){const t=lT(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const uT={[P_]:"Linear",[N_]:"Reinhard",[L_]:"Cineon",[D_]:"ACESFilmic",[U_]:"AgX",[F_]:"Neutral",[I_]:"Custom"};function dT(s,e){const t=uT[e];return t===void 0?(at("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Wc=new Y;function hT(){wt.getLuminanceCoefficients(Wc);const s=Wc.x.toFixed(4),e=Wc.y.toFixed(4),t=Wc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function fT(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Qo).join(`
`)}function pT(s){const e=[];for(const t in s){const i=s[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function mT(s,e){const t={},i=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let a=0;a<i;a++){const l=s.getActiveAttrib(e,a),c=l.name;let d=1;l.type===s.FLOAT_MAT2&&(d=2),l.type===s.FLOAT_MAT3&&(d=3),l.type===s.FLOAT_MAT4&&(d=4),t[c]={type:l.type,location:s.getAttribLocation(e,c),locationSize:d}}return t}function Qo(s){return s!==""}function jg(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Xg(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const gT=/^[ \t]*#include +<([\w\d./]+)>/gm;function Nf(s){return s.replace(gT,xT)}const _T=new Map;function xT(s,e){let t=_t[e];if(t===void 0){const i=_T.get(e);if(i!==void 0)t=_t[i],at('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Nf(t)}const vT=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function qg(s){return s.replace(vT,yT)}function yT(s,e,t,i){let a="";for(let l=parseInt(e);l<parseInt(t);l++)a+=i.replace(/\[\s*i\s*\]/g,"[ "+l+" ]").replace(/UNROLLED_LOOP_INDEX/g,l);return a}function Yg(s){let e=`precision ${s.precision} float;
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
#define LOW_PRECISION`),e}const ST={[qc]:"SHADOWMAP_TYPE_PCF",[Ko]:"SHADOWMAP_TYPE_VSM"};function MT(s){return ST[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const ET={[qs]:"ENVMAP_TYPE_CUBE",[Qa]:"ENVMAP_TYPE_CUBE",[fu]:"ENVMAP_TYPE_CUBE_UV"};function wT(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":ET[s.envMapMode]||"ENVMAP_TYPE_CUBE"}const bT={[Qa]:"ENVMAP_MODE_REFRACTION"};function TT(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":bT[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}const AT={[Of]:"ENVMAP_BLENDING_MULTIPLY",[JS]:"ENVMAP_BLENDING_MIX",[eM]:"ENVMAP_BLENDING_ADD"};function CT(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":AT[s.combine]||"ENVMAP_BLENDING_NONE"}function RT(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function PT(s,e,t,i){const a=s.getContext(),l=t.defines;let c=t.vertexShader,d=t.fragmentShader;const h=MT(t),f=wT(t),_=TT(t),m=CT(t),g=RT(t),y=fT(t),M=pT(l),T=a.createProgram();let S,x,R=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(S=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M].filter(Qo).join(`
`),S.length>0&&(S+=`
`),x=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M].filter(Qo).join(`
`),x.length>0&&(x+=`
`)):(S=[Yg(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+_:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+h:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Qo).join(`
`),x=[Yg(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+f:"",t.envMap?"#define "+_:"",t.envMap?"#define "+m:"",g?"#define CUBEUV_TEXEL_WIDTH "+g.texelWidth:"",g?"#define CUBEUV_TEXEL_HEIGHT "+g.texelHeight:"",g?"#define CUBEUV_MAX_MIP "+g.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+h:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==rr?"#define TONE_MAPPING":"",t.toneMapping!==rr?_t.tonemapping_pars_fragment:"",t.toneMapping!==rr?dT("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",_t.colorspace_pars_fragment,cT("linearToOutputTexel",t.outputColorSpace),hT(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Qo).join(`
`)),c=Nf(c),c=jg(c,t),c=Xg(c,t),d=Nf(d),d=jg(d,t),d=Xg(d,t),c=qg(c),d=qg(d),t.isRawShaderMaterial!==!0&&(R=`#version 300 es
`,S=[y,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+S,x=["#define varying in",t.glslVersion===Y0?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Y0?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+x);const I=R+S+c,A=R+x+d,P=Vg(a,a.VERTEX_SHADER,I),L=Vg(a,a.FRAGMENT_SHADER,A);a.attachShader(T,P),a.attachShader(T,L),t.index0AttributeName!==void 0?a.bindAttribLocation(T,0,t.index0AttributeName):t.hasPositionAttribute===!0&&a.bindAttribLocation(T,0,"position"),a.linkProgram(T);function U(V){if(s.debug.checkShaderErrors){const G=a.getProgramInfoLog(T)||"",J=a.getShaderInfoLog(P)||"",H=a.getShaderInfoLog(L)||"",Z=G.trim(),he=J.trim(),ne=H.trim();let ee=!0,$=!0;if(a.getProgramParameter(T,a.LINK_STATUS)===!1)if(ee=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(a,T,P,L);else{const K=Wg(a,P,"vertex"),F=Wg(a,L,"fragment");Dt("WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(T,a.VALIDATE_STATUS)+`

Material Name: `+V.name+`
Material Type: `+V.type+`

Program Info Log: `+Z+`
`+K+`
`+F)}else Z!==""?at("WebGLProgram: Program Info Log:",Z):(he===""||ne==="")&&($=!1);$&&(V.diagnostics={runnable:ee,programLog:Z,vertexShader:{log:he,prefix:S},fragmentShader:{log:ne,prefix:x}})}a.deleteShader(P),a.deleteShader(L),b=new Jc(a,T),D=mT(a,T)}let b;this.getUniforms=function(){return b===void 0&&U(this),b};let D;this.getAttributes=function(){return D===void 0&&U(this),D};let B=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return B===!1&&(B=a.getProgramParameter(T,sT)),B},this.destroy=function(){i.releaseStatesOfProgram(this),a.deleteProgram(T),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=aT++,this.cacheKey=e,this.usedTimes=1,this.program=T,this.vertexShader=P,this.fragmentShader=L,this}let NT=0;class LT{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){const a=this._getShaderCacheForMaterial(e);return a.has(t)===!1&&(a.add(t),t.usedTimes++),a.has(i)===!1&&(a.add(i),i.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new DT(e),t.set(e,i)),i}}class DT{constructor(e){this.id=NT++,this.code=e,this.usedTimes=0}}function IT(s){return s===Ys||s===nu||s===iu}function UT(s,e,t,i,a,l){const c=new X_,d=new LT,h=new Set,f=[],_=new Map,m=i.logarithmicDepthBuffer;let g=i.precision;const y={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function M(b){return h.add(b),b===0?"uv":`uv${b}`}function T(b,D,B,V,G,J){const H=V.fog,Z=G.geometry,he=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?V.environment:null,ne=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap,ee=e.get(b.envMap||he,ne),$=ee&&ee.mapping===fu?ee.image.height:null,K=y[b.type];b.precision!==null&&(g=i.getMaxPrecision(b.precision),g!==b.precision&&at("WebGLProgram.getParameters:",b.precision,"not supported, using",g,"instead."));const F=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,se=F!==void 0?F.length:0;let Se=0;Z.morphAttributes.position!==void 0&&(Se=1),Z.morphAttributes.normal!==void 0&&(Se=2),Z.morphAttributes.color!==void 0&&(Se=3);let Ge,Be,Ve,ae;if(K){const Pt=er[K];Ge=Pt.vertexShader,Be=Pt.fragmentShader}else{Ge=b.vertexShader,Be=b.fragmentShader;const Pt=d.getVertexShaderStage(b),bt=d.getFragmentShaderStage(b);d.update(b,Pt,bt),Ve=Pt.id,ae=bt.id}const de=s.getRenderTarget(),Ee=s.state.buffers.depth.getReversed(),$e=G.isInstancedMesh===!0,Fe=G.isBatchedMesh===!0,dt=!!b.map,Gt=!!b.matcap,ht=!!ee,xt=!!b.aoMap,At=!!b.lightMap,pt=!!b.bumpMap&&b.wireframe===!1,Ut=!!b.normalMap,Xt=!!b.displacementMap,Ft=!!b.emissiveMap,Ct=!!b.metalnessMap,$t=!!b.roughnessMap,X=b.anisotropy>0,fn=b.clearcoat>0,Rt=b.dispersion>0,O=b.retroreflectivity>0,w=b.iridescence>0,Q=b.sheen>0,le=b.transmission>0,fe=X&&!!b.anisotropyMap,we=fn&&!!b.clearcoatMap,Ae=fn&&!!b.clearcoatNormalMap,pe=fn&&!!b.clearcoatRoughnessMap,_e=w&&!!b.iridescenceMap,Pe=w&&!!b.iridescenceThicknessMap,Ke=Q&&!!b.sheenColorMap,Ne=Q&&!!b.sheenRoughnessMap,Te=!!b.specularMap,Ze=!!b.specularColorMap,tt=!!b.specularIntensityMap,rt=le&&!!b.transmissionMap,W=le&&!!b.thicknessMap,Ce=!!b.gradientMap,ge=!!b.alphaMap,Re=b.alphaTest>0,Oe=!!b.alphaHash,xe=!!b.extensions;let Je=rr;b.toneMapped&&(de===null||de.isXRRenderTarget===!0)&&(Je=s.toneMapping);const qe={shaderID:K,shaderType:b.type,shaderName:b.name,vertexShader:Ge,fragmentShader:Be,defines:b.defines,customVertexShaderID:Ve,customFragmentShaderID:ae,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:g,batching:Fe,batchingColor:Fe&&G._colorsTexture!==null,instancing:$e,instancingColor:$e&&G.instanceColor!==null,instancingMorph:$e&&G.morphTexture!==null,outputColorSpace:de===null?s.outputColorSpace:de.isXRRenderTarget===!0?de.texture.colorSpace:wt.workingColorSpace,alphaToCoverage:!!b.alphaToCoverage,map:dt,matcap:Gt,envMap:ht,envMapMode:ht&&ee.mapping,envMapCubeUVHeight:$,aoMap:xt,lightMap:At,bumpMap:pt,normalMap:Ut,displacementMap:Xt,emissiveMap:Ft,normalMapObjectSpace:Ut&&b.normalMapType===iM,normalMapTangentSpace:Ut&&b.normalMapType===ru,packedNormalMap:Ut&&b.normalMapType===ru&&IT(b.normalMap.format),metalnessMap:Ct,roughnessMap:$t,anisotropy:X,anisotropyMap:fe,clearcoat:fn,clearcoatMap:we,clearcoatNormalMap:Ae,clearcoatRoughnessMap:pe,dispersion:Rt,retroreflection:O,iridescence:w,iridescenceMap:_e,iridescenceThicknessMap:Pe,sheen:Q,sheenColorMap:Ke,sheenRoughnessMap:Ne,specularMap:Te,specularColorMap:Ze,specularIntensityMap:tt,transmission:le,transmissionMap:rt,thicknessMap:W,gradientMap:Ce,opaque:b.transparent===!1&&b.blending===el&&b.alphaToCoverage===!1,alphaMap:ge,alphaTest:Re,alphaHash:Oe,combine:b.combine,mapUv:dt&&M(b.map.channel),aoMapUv:xt&&M(b.aoMap.channel),lightMapUv:At&&M(b.lightMap.channel),bumpMapUv:pt&&M(b.bumpMap.channel),normalMapUv:Ut&&M(b.normalMap.channel),displacementMapUv:Xt&&M(b.displacementMap.channel),emissiveMapUv:Ft&&M(b.emissiveMap.channel),metalnessMapUv:Ct&&M(b.metalnessMap.channel),roughnessMapUv:$t&&M(b.roughnessMap.channel),anisotropyMapUv:fe&&M(b.anisotropyMap.channel),clearcoatMapUv:we&&M(b.clearcoatMap.channel),clearcoatNormalMapUv:Ae&&M(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:pe&&M(b.clearcoatRoughnessMap.channel),iridescenceMapUv:_e&&M(b.iridescenceMap.channel),iridescenceThicknessMapUv:Pe&&M(b.iridescenceThicknessMap.channel),sheenColorMapUv:Ke&&M(b.sheenColorMap.channel),sheenRoughnessMapUv:Ne&&M(b.sheenRoughnessMap.channel),specularMapUv:Te&&M(b.specularMap.channel),specularColorMapUv:Ze&&M(b.specularColorMap.channel),specularIntensityMapUv:tt&&M(b.specularIntensityMap.channel),transmissionMapUv:rt&&M(b.transmissionMap.channel),thicknessMapUv:W&&M(b.thicknessMap.channel),alphaMapUv:ge&&M(b.alphaMap.channel),vertexTangents:!!Z.attributes.tangent&&(Ut||X),vertexNormals:!!Z.attributes.normal,vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,pointsUvs:G.isPoints===!0&&!!Z.attributes.uv&&(dt||ge),fog:!!H,useFog:b.fog===!0,fogExp2:!!H&&H.isFogExp2,flatShading:b.wireframe===!1&&(b.flatShading===!0||Z.attributes.normal===void 0&&Ut===!1&&(b.isMeshLambertMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isMeshPhysicalMaterial)),sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:m,reversedDepthBuffer:Ee,skinning:G.isSkinnedMesh===!0,hasPositionAttribute:Z.attributes.position!==void 0,morphTargets:Z.morphAttributes.position!==void 0,morphNormals:Z.morphAttributes.normal!==void 0,morphColors:Z.morphAttributes.color!==void 0,morphTargetsCount:se,morphTextureStride:Se,numSunLights:D.sun.length,numDirLights:D.directional.length,numPointLights:D.point.length,numSpotLights:D.spot.length,numSpotLightMaps:D.spotLightMap.length,numRectAreaLights:D.rectArea.length,numHemiLights:D.hemi.length,numSunLightShadows:D.sunShadowMap.length,numDirLightShadows:D.directionalShadowMap.length,numPointLightShadows:D.pointShadowMap.length,numSpotLightShadows:D.spotShadowMap.length,numSpotLightShadowsWithMaps:D.numSpotLightShadowsWithMaps,numLightProbes:D.numLightProbes,numLightProbeGrids:J.length,numClippingPlanes:l.numPlanes,numClipIntersection:l.numIntersection,dithering:b.dithering,shadowMapEnabled:s.shadowMap.enabled&&B.length>0,shadowMapType:s.shadowMap.type,toneMapping:Je,decodeVideoTexture:dt&&b.map.isVideoTexture===!0&&wt.getTransfer(b.map.colorSpace)===kt,decodeVideoTextureEmissive:Ft&&b.emissiveMap.isVideoTexture===!0&&wt.getTransfer(b.emissiveMap.colorSpace)===kt,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===tr,flipSided:b.side===ti,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:xe&&b.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(xe&&b.extensions.multiDraw===!0||Fe)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return qe.vertexUv1s=h.has(1),qe.vertexUv2s=h.has(2),qe.vertexUv3s=h.has(3),h.clear(),qe}function S(b){const D=[];if(b.shaderID?D.push(b.shaderID):(D.push(b.customVertexShaderID),D.push(b.customFragmentShaderID)),b.defines!==void 0)for(const B in b.defines)D.push(B),D.push(b.defines[B]);return b.isRawShaderMaterial===!1&&(x(D,b),R(D,b),D.push(s.outputColorSpace)),D.push(b.customProgramCacheKey),D.join()}function x(b,D){b.push(D.precision),b.push(D.outputColorSpace),b.push(D.envMapMode),b.push(D.envMapCubeUVHeight),b.push(D.mapUv),b.push(D.alphaMapUv),b.push(D.lightMapUv),b.push(D.aoMapUv),b.push(D.bumpMapUv),b.push(D.normalMapUv),b.push(D.displacementMapUv),b.push(D.emissiveMapUv),b.push(D.metalnessMapUv),b.push(D.roughnessMapUv),b.push(D.anisotropyMapUv),b.push(D.clearcoatMapUv),b.push(D.clearcoatNormalMapUv),b.push(D.clearcoatRoughnessMapUv),b.push(D.iridescenceMapUv),b.push(D.iridescenceThicknessMapUv),b.push(D.sheenColorMapUv),b.push(D.sheenRoughnessMapUv),b.push(D.specularMapUv),b.push(D.specularColorMapUv),b.push(D.specularIntensityMapUv),b.push(D.transmissionMapUv),b.push(D.thicknessMapUv),b.push(D.combine),b.push(D.fogExp2),b.push(D.sizeAttenuation),b.push(D.morphTargetsCount),b.push(D.morphAttributeCount),b.push(D.numSunLights),b.push(D.numDirLights),b.push(D.numPointLights),b.push(D.numSpotLights),b.push(D.numSpotLightMaps),b.push(D.numHemiLights),b.push(D.numRectAreaLights),b.push(D.numSunLightShadows),b.push(D.numDirLightShadows),b.push(D.numPointLightShadows),b.push(D.numSpotLightShadows),b.push(D.numSpotLightShadowsWithMaps),b.push(D.numLightProbes),b.push(D.shadowMapType),b.push(D.toneMapping),b.push(D.numClippingPlanes),b.push(D.numClipIntersection),b.push(D.depthPacking)}function R(b,D){c.disableAll(),D.instancing&&c.enable(0),D.instancingColor&&c.enable(1),D.instancingMorph&&c.enable(2),D.matcap&&c.enable(3),D.envMap&&c.enable(4),D.normalMapObjectSpace&&c.enable(5),D.normalMapTangentSpace&&c.enable(6),D.clearcoat&&c.enable(7),D.iridescence&&c.enable(8),D.alphaTest&&c.enable(9),D.vertexColors&&c.enable(10),D.vertexAlphas&&c.enable(11),D.vertexUv1s&&c.enable(12),D.vertexUv2s&&c.enable(13),D.vertexUv3s&&c.enable(14),D.vertexTangents&&c.enable(15),D.anisotropy&&c.enable(16),D.alphaHash&&c.enable(17),D.batching&&c.enable(18),D.dispersion&&c.enable(19),D.retroreflection&&c.enable(24),D.batchingColor&&c.enable(20),D.gradientMap&&c.enable(21),D.packedNormalMap&&c.enable(22),D.vertexNormals&&c.enable(23),b.push(c.mask),c.disableAll(),D.fog&&c.enable(0),D.useFog&&c.enable(1),D.flatShading&&c.enable(2),D.logarithmicDepthBuffer&&c.enable(3),D.reversedDepthBuffer&&c.enable(4),D.skinning&&c.enable(5),D.morphTargets&&c.enable(6),D.morphNormals&&c.enable(7),D.morphColors&&c.enable(8),D.premultipliedAlpha&&c.enable(9),D.shadowMapEnabled&&c.enable(10),D.doubleSided&&c.enable(11),D.flipSided&&c.enable(12),D.useDepthPacking&&c.enable(13),D.dithering&&c.enable(14),D.transmission&&c.enable(15),D.sheen&&c.enable(16),D.opaque&&c.enable(17),D.pointsUvs&&c.enable(18),D.decodeVideoTexture&&c.enable(19),D.decodeVideoTextureEmissive&&c.enable(20),D.alphaToCoverage&&c.enable(21),D.numLightProbeGrids>0&&c.enable(22),D.hasPositionAttribute&&c.enable(23),b.push(c.mask)}function I(b){const D=y[b.type];let B;if(D){const V=er[D];B=jM.clone(V.uniforms)}else B=b.uniforms;return B}function A(b,D){let B=_.get(D);return B!==void 0?++B.usedTimes:(B=new PT(s,D,b,a),f.push(B),_.set(D,B)),B}function P(b){if(--b.usedTimes===0){const D=f.indexOf(b);f[D]=f[f.length-1],f.pop(),_.delete(b.cacheKey),b.destroy()}}function L(b){d.remove(b)}function U(){d.dispose()}return{getParameters:T,getProgramCacheKey:S,getUniforms:I,acquireProgram:A,releaseProgram:P,releaseShaderCache:L,programs:f,dispose:U}}function FT(){let s=new WeakMap;function e(c){return s.has(c)}function t(c){let d=s.get(c);return d===void 0&&(d={},s.set(c,d)),d}function i(c){s.delete(c)}function a(c,d,h){s.get(c)[d]=h}function l(){s=new WeakMap}return{has:e,get:t,remove:i,update:a,dispose:l}}function OT(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.materialVariant!==e.materialVariant?s.materialVariant-e.materialVariant:s.z!==e.z?s.z-e.z:s.id-e.id}function $g(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function Kg(){const s=[];let e=0;const t=[],i=[],a=[];function l(){e=0,t.length=0,i.length=0,a.length=0}function c(g){let y=0;return g.isInstancedMesh&&(y+=2),g.isSkinnedMesh&&(y+=1),y}function d(g,y,M,T,S,x){let R=s[e];return R===void 0?(R={id:g.id,object:g,geometry:y,material:M,materialVariant:c(g),groupOrder:T,renderOrder:g.renderOrder,z:S,group:x},s[e]=R):(R.id=g.id,R.object=g,R.geometry=y,R.material=M,R.materialVariant=c(g),R.groupOrder=T,R.renderOrder=g.renderOrder,R.z=S,R.group=x),e++,R}function h(g,y,M,T,S,x,R){R.reversedDepth===!0&&(S=-S);const I=d(g,y,M,T,S,x);M.transmission>0?i.push(I):M.transparent===!0?a.push(I):t.push(I)}function f(g,y,M,T,S,x){const R=d(g,y,M,T,S,x);M.transmission>0?i.unshift(R):M.transparent===!0?a.unshift(R):t.unshift(R)}function _(g,y){t.length>1&&t.sort(g||OT),i.length>1&&i.sort(y||$g),a.length>1&&a.sort(y||$g)}function m(){for(let g=e,y=s.length;g<y;g++){const M=s[g];if(M.id===null)break;M.id=null,M.object=null,M.geometry=null,M.material=null,M.group=null}}return{opaque:t,transmissive:i,transparent:a,init:l,push:h,unshift:f,finish:m,sort:_}}function kT(){let s=new WeakMap;function e(i,a){const l=s.get(i);let c;return l===void 0?(c=new Kg,s.set(i,[c])):a>=l.length?(c=new Kg,l.push(c)):c=l[a],c}function t(){s=new WeakMap}return{get:e,dispose:t}}function BT(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new Y,color:new ut};break;case"SpotLight":t={position:new Y,direction:new Y,color:new ut,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new Y,color:new ut,distance:0,decay:0};break;case"HemisphereLight":t={direction:new Y,skyColor:new ut,groundColor:new ut};break;case"RectAreaLight":t={color:new ut,position:new Y,halfWidth:new Y,halfHeight:new Y};break}return s[e.id]=t,t}}}function zT(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let HT=0;function VT(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function GT(s){const e=new BT,t=zT(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let f=0;f<9;f++)i.probe.push(new Y);const a=new Y,l=new Vt,c=new Vt;function d(f){let _=0,m=0,g=0;for(let G=0;G<9;G++)i.probe[G].set(0,0,0);let y=0,M=0,T=0,S=0,x=0,R=0,I=0,A=0,P=0,L=0,U=0,b=0,D=0,B=0;f.sort(VT);for(let G=0,J=f.length;G<J;G++){const H=f[G],Z=H.color,he=H.intensity,ne=H.distance;let ee=null;if(H.shadow&&H.shadow.map&&(H.shadow.map.texture.format===Ys?ee=H.shadow.map.texture:ee=H.shadow.map.depthTexture||H.shadow.map.texture),H.isAmbientLight)_+=Z.r*he,m+=Z.g*he,g+=Z.b*he;else if(H.isLightProbe){for(let $=0;$<9;$++)i.probe[$].addScaledVector(H.sh.coefficients[$],he);B++}else if(H.isSunLight){const $=e.get(H);if($.color.copy(H.color).multiplyScalar(H.intensity),H.castShadow){const K=H.shadow,F=t.get(H);F.shadowIntensity=K.intensity,F.shadowBias=K.bias,F.shadowNormalBias=K.normalBias,F.shadowRadius=K.radius,F.shadowMapSize.copy(K.mapSize).multiply(K.getFrameExtents()),i.sunShadow[M]=F,i.sunShadowMap[M]=ee;const se=K.getViewportCount();for(let Se=0;Se<se;Se++)i.sunShadowMatrix[T+Se]=K.getMatrix(Se),i.sunShadowCascade[T+Se]=K._cascadeData[Se];T+=se,M++}i.sun[y]=$,y++}else if(H.isDirectionalLight){const $=e.get(H);if($.color.copy(H.color).multiplyScalar(H.intensity),H.castShadow){const K=H.shadow,F=t.get(H);F.shadowIntensity=K.intensity,F.shadowBias=K.bias,F.shadowNormalBias=K.normalBias,F.shadowRadius=K.radius,F.shadowMapSize=K.mapSize,i.directionalShadow[S]=F,i.directionalShadowMap[S]=ee,i.directionalShadowMatrix[S]=H.shadow.matrix,P++}i.directional[S]=$,S++}else if(H.isSpotLight){const $=e.get(H);$.position.setFromMatrixPosition(H.matrixWorld),$.color.copy(Z).multiplyScalar(he),$.distance=ne,$.coneCos=Math.cos(H.angle),$.penumbraCos=Math.cos(H.angle*(1-H.penumbra)),$.decay=H.decay,i.spot[R]=$;const K=H.shadow;if(H.map&&(i.spotLightMap[b]=H.map,b++,K.updateMatrices(H),H.castShadow&&D++),i.spotLightMatrix[R]=K.matrix,H.castShadow){const F=t.get(H);F.shadowIntensity=K.intensity,F.shadowBias=K.bias,F.shadowNormalBias=K.normalBias,F.shadowRadius=K.radius,F.shadowMapSize=K.mapSize,i.spotShadow[R]=F,i.spotShadowMap[R]=ee,U++}R++}else if(H.isRectAreaLight){const $=e.get(H);$.color.copy(Z).multiplyScalar(he),$.halfWidth.set(H.width*.5,0,0),$.halfHeight.set(0,H.height*.5,0),i.rectArea[I]=$,I++}else if(H.isPointLight){const $=e.get(H);if($.color.copy(H.color).multiplyScalar(H.intensity),$.distance=H.distance,$.decay=H.decay,H.castShadow){const K=H.shadow,F=t.get(H);F.shadowIntensity=K.intensity,F.shadowBias=K.bias,F.shadowNormalBias=K.normalBias,F.shadowRadius=K.radius,F.shadowMapSize=K.mapSize,F.shadowCameraNear=K.camera.near,F.shadowCameraFar=K.camera.far,i.pointShadow[x]=F,i.pointShadowMap[x]=ee,i.pointShadowMatrix[x]=H.shadow.matrix,L++}i.point[x]=$,x++}else if(H.isHemisphereLight){const $=e.get(H);$.skyColor.copy(H.color).multiplyScalar(he),$.groundColor.copy(H.groundColor).multiplyScalar(he),i.hemi[A]=$,A++}}I>0&&(s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Ue.LTC_FLOAT_1,i.rectAreaLTC2=Ue.LTC_FLOAT_2):(i.rectAreaLTC1=Ue.LTC_HALF_1,i.rectAreaLTC2=Ue.LTC_HALF_2)),i.ambient[0]=_,i.ambient[1]=m,i.ambient[2]=g;const V=i.hash;(V.sunLength!==y||V.directionalLength!==S||V.pointLength!==x||V.spotLength!==R||V.rectAreaLength!==I||V.hemiLength!==A||V.numSunShadows!==M||V.numDirectionalShadows!==P||V.numPointShadows!==L||V.numSpotShadows!==U||V.numSpotMaps!==b||V.numLightProbes!==B)&&(i.sun.length=y,i.directional.length=S,i.spot.length=R,i.rectArea.length=I,i.point.length=x,i.hemi.length=A,i.sunShadow.length=M,i.sunShadowMap.length=M,i.sunShadowMatrix.length=T,i.sunShadowCascade.length=T,i.directionalShadow.length=P,i.directionalShadowMap.length=P,i.directionalShadowMatrix.length=P,i.pointShadow.length=L,i.pointShadowMap.length=L,i.pointShadowMatrix.length=L,i.spotShadow.length=U,i.spotShadowMap.length=U,i.spotLightMatrix.length=U+b-D,i.spotLightMap.length=b,i.numSpotLightShadowsWithMaps=D,i.numLightProbes=B,V.sunLength=y,V.directionalLength=S,V.pointLength=x,V.spotLength=R,V.rectAreaLength=I,V.hemiLength=A,V.numSunShadows=M,V.numDirectionalShadows=P,V.numPointShadows=L,V.numSpotShadows=U,V.numSpotMaps=b,V.numLightProbes=B,i.version=HT++)}function h(f,_){let m=0,g=0,y=0,M=0,T=0,S=0;const x=_.matrixWorldInverse;for(let R=0,I=f.length;R<I;R++){const A=f[R];if(A.isSunLight){const P=i.sun[m];P.direction.setFromMatrixPosition(A.matrixWorld),P.direction.transformDirection(x),m++}else if(A.isDirectionalLight){const P=i.directional[g];P.direction.setFromMatrixPosition(A.matrixWorld),a.setFromMatrixPosition(A.target.matrixWorld),P.direction.sub(a),P.direction.transformDirection(x),g++}else if(A.isSpotLight){const P=i.spot[M];P.position.setFromMatrixPosition(A.matrixWorld),P.position.applyMatrix4(x),P.direction.setFromMatrixPosition(A.matrixWorld),a.setFromMatrixPosition(A.target.matrixWorld),P.direction.sub(a),P.direction.transformDirection(x),M++}else if(A.isRectAreaLight){const P=i.rectArea[T];P.position.setFromMatrixPosition(A.matrixWorld),P.position.applyMatrix4(x),c.identity(),l.copy(A.matrixWorld),l.premultiply(x),c.extractRotation(l),P.halfWidth.set(A.width*.5,0,0),P.halfHeight.set(0,A.height*.5,0),P.halfWidth.applyMatrix4(c),P.halfHeight.applyMatrix4(c),T++}else if(A.isPointLight){const P=i.point[y];P.position.setFromMatrixPosition(A.matrixWorld),P.position.applyMatrix4(x),y++}else if(A.isHemisphereLight){const P=i.hemi[S];P.direction.setFromMatrixPosition(A.matrixWorld),P.direction.transformDirection(x),S++}}}return{setup:d,setupView:h,state:i}}function Zg(s){const e=new GT(s),t=[],i=[],a=[];function l(g){m.camera=g,t.length=0,i.length=0,a.length=0}function c(g){t.push(g)}function d(g){i.push(g)}function h(g){a.push(g)}function f(){e.setup(t)}function _(g){e.setupView(t,g)}const m={lightsArray:t,shadowsArray:i,lightProbeGridArray:a,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:l,state:m,setupLights:f,setupLightsView:_,pushLight:c,pushShadow:d,pushLightProbeGrid:h}}function WT(s){let e=new WeakMap;function t(a,l=0){const c=e.get(a);let d;return c===void 0?(d=new Zg(s),e.set(a,[d])):l>=c.length?(d=new Zg(s),c.push(d)):d=c[l],d}function i(){e=new WeakMap}return{get:t,dispose:i}}const jT=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,XT=`uniform sampler2D shadow_pass;
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
}`,qT=[new Y(1,0,0),new Y(-1,0,0),new Y(0,1,0),new Y(0,-1,0),new Y(0,0,1),new Y(0,0,-1)],YT=[new Y(0,-1,0),new Y(0,-1,0),new Y(0,0,1),new Y(0,0,-1),new Y(0,-1,0),new Y(0,-1,0)],Qg=new Vt,$o=new Y,Fh=new Y;function $T(s,e,t){let i=new $f;const a=new ot,l=new ot,c=new nn,d=new ZM,h=new QM,f={},_=t.maxTextureSize,m={[Xs]:ti,[ti]:Xs,[tr]:tr},g=new cr({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ot},radius:{value:4}},vertexShader:jT,fragmentShader:XT}),y=g.clone();y.defines.HORIZONTAL_PASS=1;const M=new Xn;M.setAttribute("position",new sr(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const T=new Bt(M,g),S=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=qc;let x=this.type;this.render=function(L,U,b){if(S.enabled===!1||S.autoUpdate===!1&&S.needsUpdate===!1||L.length===0)return;this.type===A_&&(at("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=qc);const D=s.getRenderTarget(),B=s.getActiveCubeFace(),V=s.getActiveMipmapLevel(),G=s.state;G.setBlending(Rr),G.buffers.depth.getReversed()===!0?G.buffers.color.setClear(0,0,0,0):G.buffers.color.setClear(1,1,1,1),G.buffers.depth.setTest(!0),G.setScissorTest(!1);const J=x!==this.type;J&&U.traverse(function(H){H.material&&(Array.isArray(H.material)?H.material.forEach(Z=>Z.needsUpdate=!0):H.material.needsUpdate=!0)});for(let H=0,Z=L.length;H<Z;H++){const he=L[H],ne=he.shadow;if(ne===void 0){at("WebGLShadowMap:",he,"has no shadow.");continue}if(ne.autoUpdate===!1&&ne.needsUpdate===!1)continue;a.copy(ne.mapSize);const ee=ne.getFrameExtents();a.multiply(ee),l.copy(ne.mapSize),(a.x>_||a.y>_)&&(a.x>_&&(l.x=Math.floor(_/ee.x),a.x=l.x*ee.x,ne.mapSize.x=l.x),a.y>_&&(l.y=Math.floor(_/ee.y),a.y=l.y*ee.y,ne.mapSize.y=l.y));const $=s.state.buffers.depth.getReversed();if(ne.camera._reversedDepth=$,ne.map===null||J===!0){if(ne.map!==null&&(ne.map.depthTexture!==null&&(ne.map.depthTexture.dispose(),ne.map.depthTexture=null),ne.map.dispose()),this.type===Ko){if(he.isPointLight){at("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}ne.map=new Gi(a.x,a.y,{format:Ys,type:or,minFilter:Bn,magFilter:Bn,generateMipmaps:!1}),ne.map.texture.name=he.name+".shadowMap",ne.map.depthTexture=new ol(a.x,a.y,Hi),ne.map.depthTexture.name=he.name+".shadowMapDepth",ne.map.depthTexture.format=Lr,ne.map.depthTexture.compareFunction=null,ne.map.depthTexture.minFilter=Rn,ne.map.depthTexture.magFilter=Rn}else he.isPointLight?(ne.map=new rx(a.x),ne.map.depthTexture=new GM(a.x,ar)):(ne.map=new Gi(a.x,a.y),ne.map.depthTexture=new ol(a.x,a.y,ar)),ne.map.depthTexture.name=he.name+".shadowMap",ne.map.depthTexture.format=Lr,this.type===qc?(ne.map.depthTexture.compareFunction=$?Xf:jf,ne.map.depthTexture.minFilter=Bn,ne.map.depthTexture.magFilter=Bn):(ne.map.depthTexture.compareFunction=null,ne.map.depthTexture.minFilter=Rn,ne.map.depthTexture.magFilter=Rn);ne.camera.updateProjectionMatrix()}ne.map.isWebGLCubeRenderTarget!==!0&&(ne.map.width!==a.x||ne.map.height!==a.y)&&ne.map.setSize(a.x,a.y);const K=ne.map.isWebGLCubeRenderTarget?6:ne.getViewportCount();he.isPointLight!==!0&&ne.updateMatrices(he,b);for(let F=0;F<K;F++){const se=ne.getCamera(F);if(he.isPointLight){const Se=ne.camera,Ge=ne.matrix,Be=he.distance||Se.far;Be!==Se.far&&(Se.far=Be,Se.updateProjectionMatrix()),$o.setFromMatrixPosition(he.matrixWorld),Se.position.copy($o),Fh.copy(Se.position),Fh.add(qT[F]),Se.up.copy(YT[F]),Se.lookAt(Fh),Se.updateMatrixWorld(),Ge.makeTranslation(-$o.x,-$o.y,-$o.z),Qg.multiplyMatrices(Se.projectionMatrix,Se.matrixWorldInverse),ne._frustum.setFromProjectionMatrix(Qg,Se.coordinateSystem,Se.reversedDepth)}if(ne.map.isWebGLCubeRenderTarget)s.setRenderTarget(ne.map,F),s.clear();else{F===0&&(s.setRenderTarget(ne.map),s.clear());const Se=ne.getViewport(F);c.set(l.x*Se.x,l.y*Se.y,l.x*Se.z,l.y*Se.w),G.viewport(c)}i=ne.getFrustum(F),A(U,b,se,he,this.type)}ne.isPointLightShadow!==!0&&this.type===Ko&&R(ne,b),ne.needsUpdate=!1}x=this.type,S.needsUpdate=!1,s.setRenderTarget(D,B,V)};function R(L,U){const b=e.update(T);g.defines.VSM_SAMPLES!==L.blurSamples&&(g.defines.VSM_SAMPLES=L.blurSamples,y.defines.VSM_SAMPLES=L.blurSamples,g.needsUpdate=!0,y.needsUpdate=!0),L.mapPass===null?L.mapPass=new Gi(a.x,a.y,{format:Ys,type:or}):(L.mapPass.width!==L.map.width||L.mapPass.height!==L.map.height)&&L.mapPass.setSize(L.map.width,L.map.height),g.uniforms.shadow_pass.value=L.map.depthTexture,g.uniforms.resolution.value.set(L.map.width,L.map.height),g.uniforms.radius.value=L.radius,s.setRenderTarget(L.mapPass),s.clear(),s.renderBufferDirect(U,null,b,g,T,null),y.uniforms.shadow_pass.value=L.mapPass.texture,y.uniforms.resolution.value.set(L.map.width,L.map.height),y.uniforms.radius.value=L.radius,s.setRenderTarget(L.map),s.clear(),s.renderBufferDirect(U,null,b,y,T,null)}function I(L,U,b,D){let B=null;const V=b.isPointLight===!0?L.customDistanceMaterial:L.customDepthMaterial;if(V!==void 0)B=V;else if(B=b.isPointLight===!0?h:d,s.localClippingEnabled&&U.clipShadows===!0&&Array.isArray(U.clippingPlanes)&&U.clippingPlanes.length!==0||U.displacementMap&&U.displacementScale!==0||U.alphaMap&&U.alphaTest>0||U.map&&U.alphaTest>0||U.alphaToCoverage===!0){const G=B.uuid,J=U.uuid;let H=f[G];H===void 0&&(H={},f[G]=H);let Z=H[J];Z===void 0&&(Z=B.clone(),H[J]=Z,U.addEventListener("dispose",P)),B=Z}if(B.visible=U.visible,B.wireframe=U.wireframe,D===Ko?B.side=U.shadowSide!==null?U.shadowSide:U.side:B.side=U.shadowSide!==null?U.shadowSide:m[U.side],B.alphaMap=U.alphaMap,B.alphaTest=U.alphaToCoverage===!0?.5:U.alphaTest,B.map=U.map,B.clipShadows=U.clipShadows,B.clippingPlanes=U.clippingPlanes,B.clipIntersection=U.clipIntersection,B.displacementMap=U.displacementMap,B.displacementScale=U.displacementScale,B.displacementBias=U.displacementBias,B.wireframeLinewidth=U.wireframeLinewidth,B.linewidth=U.linewidth,b.isPointLight===!0&&B.isMeshDistanceMaterial===!0){const G=s.properties.get(B);G.light=b}return B}function A(L,U,b,D,B){if(L.visible===!1)return;if(L.layers.test(U.layers)&&(L.isMesh||L.isLine||L.isPoints)&&(L.castShadow||L.receiveShadow&&B===Ko)&&(!L.frustumCulled||L.intersectsFrustum(i))){L.modelViewMatrix.multiplyMatrices(b.matrixWorldInverse,L.matrixWorld);const J=e.update(L),H=L.material;if(Array.isArray(H)){const Z=J.groups;for(let he=0,ne=Z.length;he<ne;he++){const ee=Z[he],$=H[ee.materialIndex];if($&&$.visible){const K=I(L,$,D,B);L.onBeforeShadow(s,L,U,b,J,K,ee),s.renderBufferDirect(b,null,J,K,L,ee),L.onAfterShadow(s,L,U,b,J,K,ee)}}}else if(H.visible){const Z=I(L,H,D,B);L.onBeforeShadow(s,L,U,b,J,Z,null),s.renderBufferDirect(b,null,J,Z,L,null),L.onAfterShadow(s,L,U,b,J,Z,null)}}const G=L.children;for(let J=0,H=G.length;J<H;J++)A(G[J],U,b,D,B)}function P(L){L.target.removeEventListener("dispose",P);for(const b in f){const D=f[b],B=L.target.uuid;B in D&&(D[B].dispose(),delete D[B])}}}function KT(s,e){function t(){let W=!1;const Ce=new nn;let ge=null;const Re=new nn(0,0,0,0);return{setMask:function(Oe){ge!==Oe&&!W&&(s.colorMask(Oe,Oe,Oe,Oe),ge=Oe)},setLocked:function(Oe){W=Oe},setClear:function(Oe,xe,Je,qe,Pt){Pt===!0&&(Oe*=qe,xe*=qe,Je*=qe),Ce.set(Oe,xe,Je,qe),Re.equals(Ce)===!1&&(s.clearColor(Oe,xe,Je,qe),Re.copy(Ce))},reset:function(){W=!1,ge=null,Re.set(-1,0,0,0)}}}function i(){let W=!1,Ce=!1,ge=null,Re=null,Oe=null;return{setReversed:function(xe){if(Ce!==xe){const Je=e.get("EXT_clip_control");xe?Je.clipControlEXT(Je.LOWER_LEFT_EXT,Je.ZERO_TO_ONE_EXT):Je.clipControlEXT(Je.LOWER_LEFT_EXT,Je.NEGATIVE_ONE_TO_ONE_EXT),Ce=xe;const qe=Oe;Oe=null,this.setClear(qe)}},getReversed:function(){return Ce},setTest:function(xe){xe?de(s.DEPTH_TEST):Ee(s.DEPTH_TEST)},setMask:function(xe){ge!==xe&&!W&&(s.depthMask(xe),ge=xe)},setFunc:function(xe){if(Ce&&(xe=mM[xe]),Re!==xe){switch(xe){case Vh:s.depthFunc(s.NEVER);break;case Gh:s.depthFunc(s.ALWAYS);break;case Wh:s.depthFunc(s.LESS);break;case il:s.depthFunc(s.LEQUAL);break;case jh:s.depthFunc(s.EQUAL);break;case Xh:s.depthFunc(s.GEQUAL);break;case qh:s.depthFunc(s.GREATER);break;case Yh:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}Re=xe}},setLocked:function(xe){W=xe},setClear:function(xe){Oe!==xe&&(Oe=xe,Ce&&(xe=1-xe),s.clearDepth(xe))},reset:function(){W=!1,ge=null,Re=null,Oe=null,Ce=!1}}}function a(){let W=!1,Ce=null,ge=null,Re=null,Oe=null,xe=null,Je=null,qe=null,Pt=null;return{setTest:function(bt){W||(bt?de(s.STENCIL_TEST):Ee(s.STENCIL_TEST))},setMask:function(bt){Ce!==bt&&!W&&(s.stencilMask(bt),Ce=bt)},setFunc:function(bt,Tn,hi){(ge!==bt||Re!==Tn||Oe!==hi)&&(s.stencilFunc(bt,Tn,hi),ge=bt,Re=Tn,Oe=hi)},setOp:function(bt,Tn,hi){(xe!==bt||Je!==Tn||qe!==hi)&&(s.stencilOp(bt,Tn,hi),xe=bt,Je=Tn,qe=hi)},setLocked:function(bt){W=bt},setClear:function(bt){Pt!==bt&&(s.clearStencil(bt),Pt=bt)},reset:function(){W=!1,Ce=null,ge=null,Re=null,Oe=null,xe=null,Je=null,qe=null,Pt=null}}}const l=new t,c=new i,d=new a,h=new WeakMap,f=new WeakMap;let _={},m={},g={},y=new WeakMap,M=[],T=null,S=!1,x=null,R=null,I=null,A=null,P=null,L=null,U=null,b=new ut(0,0,0),D=0,B=!1,V=null,G=null,J=null,H=null,Z=null;const he=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let ne=!1,ee=0;const $=s.getParameter(s.VERSION);$.indexOf("WebGL")!==-1?(ee=parseFloat(/^WebGL (\d)/.exec($)[1]),ne=ee>=1):$.indexOf("OpenGL ES")!==-1&&(ee=parseFloat(/^OpenGL ES (\d)/.exec($)[1]),ne=ee>=2);let K=null,F={};const se=s.getParameter(s.SCISSOR_BOX),Se=s.getParameter(s.VIEWPORT),Ge=new nn().fromArray(se),Be=new nn().fromArray(Se);function Ve(W,Ce,ge,Re){const Oe=new Uint8Array(4),xe=s.createTexture();s.bindTexture(W,xe),s.texParameteri(W,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(W,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Je=0;Je<ge;Je++)W===s.TEXTURE_3D||W===s.TEXTURE_2D_ARRAY?s.texImage3D(Ce,0,s.RGBA,1,1,Re,0,s.RGBA,s.UNSIGNED_BYTE,Oe):s.texImage2D(Ce+Je,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Oe);return xe}const ae={};ae[s.TEXTURE_2D]=Ve(s.TEXTURE_2D,s.TEXTURE_2D,1),ae[s.TEXTURE_CUBE_MAP]=Ve(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),ae[s.TEXTURE_2D_ARRAY]=Ve(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),ae[s.TEXTURE_3D]=Ve(s.TEXTURE_3D,s.TEXTURE_3D,1,1),l.setClear(0,0,0,1),c.setClear(1),d.setClear(0),de(s.DEPTH_TEST),c.setFunc(il),pt(!1),Ut(W0),de(s.CULL_FACE),xt(Rr);function de(W){_[W]!==!0&&(s.enable(W),_[W]=!0)}function Ee(W){_[W]!==!1&&(s.disable(W),_[W]=!1)}function $e(W,Ce){return g[W]!==Ce?(s.bindFramebuffer(W,Ce),g[W]=Ce,W===s.DRAW_FRAMEBUFFER&&(g[s.FRAMEBUFFER]=Ce),W===s.FRAMEBUFFER&&(g[s.DRAW_FRAMEBUFFER]=Ce),!0):!1}function Fe(W,Ce){let ge=M,Re=!1;if(W){ge=y.get(Ce),ge===void 0&&(ge=[],y.set(Ce,ge));const Oe=W.textures;if(ge.length!==Oe.length||ge[0]!==s.COLOR_ATTACHMENT0){for(let xe=0,Je=Oe.length;xe<Je;xe++)ge[xe]=s.COLOR_ATTACHMENT0+xe;ge.length=Oe.length,Re=!0}}else ge[0]!==s.BACK&&(ge[0]=s.BACK,Re=!0);Re&&s.drawBuffers(ge)}function dt(W){return T!==W?(s.useProgram(W),T=W,!0):!1}const Gt={[Fa]:s.FUNC_ADD,[FS]:s.FUNC_SUBTRACT,[OS]:s.FUNC_REVERSE_SUBTRACT};Gt[kS]=s.MIN,Gt[BS]=s.MAX;const ht={[zS]:s.ZERO,[HS]:s.ONE,[VS]:s.SRC_COLOR,[C_]:s.SRC_ALPHA,[YS]:s.SRC_ALPHA_SATURATE,[XS]:s.DST_COLOR,[WS]:s.DST_ALPHA,[GS]:s.ONE_MINUS_SRC_COLOR,[R_]:s.ONE_MINUS_SRC_ALPHA,[qS]:s.ONE_MINUS_DST_COLOR,[jS]:s.ONE_MINUS_DST_ALPHA,[$S]:s.CONSTANT_COLOR,[KS]:s.ONE_MINUS_CONSTANT_COLOR,[ZS]:s.CONSTANT_ALPHA,[QS]:s.ONE_MINUS_CONSTANT_ALPHA};function xt(W,Ce,ge,Re,Oe,xe,Je,qe,Pt,bt){if(W===Rr){S===!0&&(Ee(s.BLEND),S=!1);return}if(S===!1&&(de(s.BLEND),S=!0),W!==US){if(W!==x||bt!==B){if((R!==Fa||P!==Fa)&&(s.blendEquation(s.FUNC_ADD),R=Fa,P=Fa),bt)switch(W){case el:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case j0:s.blendFunc(s.ONE,s.ONE);break;case X0:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case q0:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:Dt("WebGLState: Invalid blending: ",W);break}else switch(W){case el:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case j0:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case X0:Dt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case q0:Dt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Dt("WebGLState: Invalid blending: ",W);break}I=null,A=null,L=null,U=null,b.set(0,0,0),D=0,x=W,B=bt}return}Oe=Oe||Ce,xe=xe||ge,Je=Je||Re,(Ce!==R||Oe!==P)&&(s.blendEquationSeparate(Gt[Ce],Gt[Oe]),R=Ce,P=Oe),(ge!==I||Re!==A||xe!==L||Je!==U)&&(s.blendFuncSeparate(ht[ge],ht[Re],ht[xe],ht[Je]),I=ge,A=Re,L=xe,U=Je),(qe.equals(b)===!1||Pt!==D)&&(s.blendColor(qe.r,qe.g,qe.b,Pt),b.copy(qe),D=Pt),x=W,B=!1}function At(W,Ce){W.side===tr?Ee(s.CULL_FACE):de(s.CULL_FACE);let ge=W.side===ti;Ce&&(ge=!ge),pt(ge),W.blending===el&&W.transparent===!1?xt(Rr):xt(W.blending,W.blendEquation,W.blendSrc,W.blendDst,W.blendEquationAlpha,W.blendSrcAlpha,W.blendDstAlpha,W.blendColor,W.blendAlpha,W.premultipliedAlpha),c.setFunc(W.depthFunc),c.setTest(W.depthTest),c.setMask(W.depthWrite),l.setMask(W.colorWrite);const Re=W.stencilWrite;d.setTest(Re),Re&&(d.setMask(W.stencilWriteMask),d.setFunc(W.stencilFunc,W.stencilRef,W.stencilFuncMask),d.setOp(W.stencilFail,W.stencilZFail,W.stencilZPass)),Ft(W.polygonOffset,W.polygonOffsetFactor,W.polygonOffsetUnits),W.alphaToCoverage===!0?de(s.SAMPLE_ALPHA_TO_COVERAGE):Ee(s.SAMPLE_ALPHA_TO_COVERAGE)}function pt(W){V!==W&&(W?s.frontFace(s.CW):s.frontFace(s.CCW),V=W)}function Ut(W){W!==DS?(de(s.CULL_FACE),W!==G&&(W===W0?s.cullFace(s.BACK):W===IS?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Ee(s.CULL_FACE),G=W}function Xt(W){W!==J&&(ne&&s.lineWidth(W),J=W)}function Ft(W,Ce,ge){W?(de(s.POLYGON_OFFSET_FILL),(H!==Ce||Z!==ge)&&(H=Ce,Z=ge,c.getReversed()&&(Ce=-Ce),s.polygonOffset(Ce,ge))):Ee(s.POLYGON_OFFSET_FILL)}function Ct(W){W?de(s.SCISSOR_TEST):Ee(s.SCISSOR_TEST)}function $t(W){W===void 0&&(W=s.TEXTURE0+he-1),K!==W&&(s.activeTexture(W),K=W)}function X(W,Ce,ge){ge===void 0&&(K===null?ge=s.TEXTURE0+he-1:ge=K);let Re=F[ge];Re===void 0&&(Re={type:void 0,texture:void 0},F[ge]=Re),(Re.type!==W||Re.texture!==Ce)&&(K!==ge&&(s.activeTexture(ge),K=ge),s.bindTexture(W,Ce||ae[W]),Re.type=W,Re.texture=Ce)}function fn(){const W=F[K];W!==void 0&&W.type!==void 0&&(s.bindTexture(W.type,null),W.type=void 0,W.texture=void 0)}function Rt(){try{s.compressedTexImage2D(...arguments)}catch(W){Dt("WebGLState:",W)}}function O(){try{s.compressedTexImage3D(...arguments)}catch(W){Dt("WebGLState:",W)}}function w(){try{s.texSubImage2D(...arguments)}catch(W){Dt("WebGLState:",W)}}function Q(){try{s.texSubImage3D(...arguments)}catch(W){Dt("WebGLState:",W)}}function le(){try{s.compressedTexSubImage2D(...arguments)}catch(W){Dt("WebGLState:",W)}}function fe(){try{s.compressedTexSubImage3D(...arguments)}catch(W){Dt("WebGLState:",W)}}function we(){try{s.texStorage2D(...arguments)}catch(W){Dt("WebGLState:",W)}}function Ae(){try{s.texStorage3D(...arguments)}catch(W){Dt("WebGLState:",W)}}function pe(){try{s.texImage2D(...arguments)}catch(W){Dt("WebGLState:",W)}}function _e(){try{s.texImage3D(...arguments)}catch(W){Dt("WebGLState:",W)}}function Pe(W){return m[W]!==void 0?m[W]:s.getParameter(W)}function Ke(W,Ce){m[W]!==Ce&&(s.pixelStorei(W,Ce),m[W]=Ce)}function Ne(W){Ge.equals(W)===!1&&(s.scissor(W.x,W.y,W.z,W.w),Ge.copy(W))}function Te(W){Be.equals(W)===!1&&(s.viewport(W.x,W.y,W.z,W.w),Be.copy(W))}function Ze(W,Ce){let ge=f.get(Ce);ge===void 0&&(ge=new WeakMap,f.set(Ce,ge));let Re=ge.get(W);Re===void 0&&(Re=s.getUniformBlockIndex(Ce,W.name),ge.set(W,Re))}function tt(W,Ce){const Re=f.get(Ce).get(W);h.get(Ce)!==Re&&(s.uniformBlockBinding(Ce,Re,W.__bindingPointIndex),h.set(Ce,Re))}function rt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),c.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),_={},m={},K=null,F={},g={},y=new WeakMap,M=[],T=null,S=!1,x=null,R=null,I=null,A=null,P=null,L=null,U=null,b=new ut(0,0,0),D=0,B=!1,V=null,G=null,J=null,H=null,Z=null,Ge.set(0,0,s.canvas.width,s.canvas.height),Be.set(0,0,s.canvas.width,s.canvas.height),l.reset(),c.reset(),d.reset()}return{buffers:{color:l,depth:c,stencil:d},enable:de,disable:Ee,bindFramebuffer:$e,drawBuffers:Fe,useProgram:dt,setBlending:xt,setMaterial:At,setFlipSided:pt,setCullFace:Ut,setLineWidth:Xt,setPolygonOffset:Ft,setScissorTest:Ct,activeTexture:$t,bindTexture:X,unbindTexture:fn,compressedTexImage2D:Rt,compressedTexImage3D:O,texImage2D:pe,texImage3D:_e,pixelStorei:Ke,getParameter:Pe,updateUBOMapping:Ze,uniformBlockBinding:tt,texStorage2D:we,texStorage3D:Ae,texSubImage2D:w,texSubImage3D:Q,compressedTexSubImage2D:le,compressedTexSubImage3D:fe,scissor:Ne,viewport:Te,reset:rt}}function ZT(s,e,t,i,a,l,c){const d=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,h=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),f=new ot,_=new WeakMap,m=new Set;let g;const y=new WeakMap;let M=!1;try{M=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function T(O,w){return M?new OffscreenCanvas(O,w):ou("canvas")}function S(O,w,Q){let le=1;const fe=Rt(O);if((fe.width>Q||fe.height>Q)&&(le=Q/Math.max(fe.width,fe.height)),le<1)if(typeof HTMLImageElement<"u"&&O instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&O instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&O instanceof ImageBitmap||typeof VideoFrame<"u"&&O instanceof VideoFrame){const we=Math.floor(le*fe.width),Ae=Math.floor(le*fe.height);g===void 0&&(g=T(we,Ae));const pe=w?T(we,Ae):g;return pe.width=we,pe.height=Ae,pe.getContext("2d").drawImage(O,0,0,we,Ae),at("WebGLRenderer: Texture has been resized from ("+fe.width+"x"+fe.height+") to ("+we+"x"+Ae+")."),pe}else return"data"in O&&at("WebGLRenderer: Image in DataTexture is too big ("+fe.width+"x"+fe.height+")."),O;return O}function x(O){return O.generateMipmaps}function R(O){s.generateMipmap(O)}function I(O){return O.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:O.isWebGL3DRenderTarget?s.TEXTURE_3D:O.isWebGLArrayRenderTarget||O.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function A(O,w,Q,le,fe,we=!1){if(O!==null){if(s[O]!==void 0)return s[O];at("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+O+"'")}let Ae;le&&(Ae=e.get("EXT_texture_norm16"),Ae||at("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let pe=w;if(w===s.RED&&(Q===s.FLOAT&&(pe=s.R32F),Q===s.HALF_FLOAT&&(pe=s.R16F),Q===s.UNSIGNED_BYTE&&(pe=s.R8),Q===s.UNSIGNED_SHORT&&Ae&&(pe=Ae.R16_EXT),Q===s.SHORT&&Ae&&(pe=Ae.R16_SNORM_EXT)),w===s.RED_INTEGER&&(Q===s.UNSIGNED_BYTE&&(pe=s.R8UI),Q===s.UNSIGNED_SHORT&&(pe=s.R16UI),Q===s.UNSIGNED_INT&&(pe=s.R32UI),Q===s.BYTE&&(pe=s.R8I),Q===s.SHORT&&(pe=s.R16I),Q===s.INT&&(pe=s.R32I)),w===s.RG&&(Q===s.FLOAT&&(pe=s.RG32F),Q===s.HALF_FLOAT&&(pe=s.RG16F),Q===s.UNSIGNED_BYTE&&(pe=s.RG8),Q===s.UNSIGNED_SHORT&&Ae&&(pe=Ae.RG16_EXT),Q===s.SHORT&&Ae&&(pe=Ae.RG16_SNORM_EXT)),w===s.RG_INTEGER&&(Q===s.UNSIGNED_BYTE&&(pe=s.RG8UI),Q===s.UNSIGNED_SHORT&&(pe=s.RG16UI),Q===s.UNSIGNED_INT&&(pe=s.RG32UI),Q===s.BYTE&&(pe=s.RG8I),Q===s.SHORT&&(pe=s.RG16I),Q===s.INT&&(pe=s.RG32I)),w===s.RGB_INTEGER&&(Q===s.UNSIGNED_BYTE&&(pe=s.RGB8UI),Q===s.UNSIGNED_SHORT&&(pe=s.RGB16UI),Q===s.UNSIGNED_INT&&(pe=s.RGB32UI),Q===s.BYTE&&(pe=s.RGB8I),Q===s.SHORT&&(pe=s.RGB16I),Q===s.INT&&(pe=s.RGB32I)),w===s.RGBA_INTEGER&&(Q===s.UNSIGNED_BYTE&&(pe=s.RGBA8UI),Q===s.UNSIGNED_SHORT&&(pe=s.RGBA16UI),Q===s.UNSIGNED_INT&&(pe=s.RGBA32UI),Q===s.BYTE&&(pe=s.RGBA8I),Q===s.SHORT&&(pe=s.RGBA16I),Q===s.INT&&(pe=s.RGBA32I)),w===s.RGB&&(Q===s.UNSIGNED_SHORT&&Ae&&(pe=Ae.RGB16_EXT),Q===s.SHORT&&Ae&&(pe=Ae.RGB16_SNORM_EXT),Q===s.UNSIGNED_INT_5_9_9_9_REV&&(pe=s.RGB9_E5),Q===s.UNSIGNED_INT_10F_11F_11F_REV&&(pe=s.R11F_G11F_B10F)),w===s.RGBA){const _e=we?au:wt.getTransfer(fe);Q===s.FLOAT&&(pe=s.RGBA32F),Q===s.HALF_FLOAT&&(pe=s.RGBA16F),Q===s.UNSIGNED_BYTE&&(pe=_e===kt?s.SRGB8_ALPHA8:s.RGBA8),Q===s.UNSIGNED_SHORT&&Ae&&(pe=Ae.RGBA16_EXT),Q===s.SHORT&&Ae&&(pe=Ae.RGBA16_SNORM_EXT),Q===s.UNSIGNED_SHORT_4_4_4_4&&(pe=s.RGBA4),Q===s.UNSIGNED_SHORT_5_5_5_1&&(pe=s.RGB5_A1)}return(pe===s.R16F||pe===s.R32F||pe===s.RG16F||pe===s.RG32F||pe===s.RGBA16F||pe===s.RGBA32F)&&e.get("EXT_color_buffer_float"),pe}function P(O,w){let Q;return O?w===null||w===ar||w===sl?Q=s.DEPTH24_STENCIL8:w===Hi?Q=s.DEPTH32F_STENCIL8:w===rl&&(Q=s.DEPTH24_STENCIL8,at("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===ar||w===sl?Q=s.DEPTH_COMPONENT24:w===Hi?Q=s.DEPTH_COMPONENT32F:w===rl&&(Q=s.DEPTH_COMPONENT16),Q}function L(O,w){return x(O)===!0||O.isFramebufferTexture&&O.minFilter!==Rn&&O.minFilter!==Bn?Math.log2(Math.max(w.width,w.height))+1:O.mipmaps!==void 0&&O.mipmaps.length>0?O.mipmaps.length:O.isCompressedTexture&&Array.isArray(O.image)?w.mipmaps.length:1}function U(O){const w=O.target;w.removeEventListener("dispose",U),D(w),w.isVideoTexture&&_.delete(w),w.isHTMLTexture&&m.delete(w)}function b(O){const w=O.target;w.removeEventListener("dispose",b),V(w)}function D(O){const w=i.get(O);if(w.__webglInit===void 0)return;const Q=O.source,le=y.get(Q);if(le){const fe=le[w.__cacheKey];fe.usedTimes--,fe.usedTimes===0&&B(O),Object.keys(le).length===0&&y.delete(Q)}i.remove(O)}function B(O){const w=i.get(O);s.deleteTexture(w.__webglTexture);const Q=O.source,le=y.get(Q);delete le[w.__cacheKey],c.memory.textures--}function V(O){const w=i.get(O);if(O.depthTexture&&(O.depthTexture.dispose(),i.remove(O.depthTexture)),O.isWebGLCubeRenderTarget)for(let le=0;le<6;le++){if(Array.isArray(w.__webglFramebuffer[le]))for(let fe=0;fe<w.__webglFramebuffer[le].length;fe++)s.deleteFramebuffer(w.__webglFramebuffer[le][fe]);else s.deleteFramebuffer(w.__webglFramebuffer[le]);w.__webglDepthbuffer&&s.deleteRenderbuffer(w.__webglDepthbuffer[le])}else{if(Array.isArray(w.__webglFramebuffer))for(let le=0;le<w.__webglFramebuffer.length;le++)s.deleteFramebuffer(w.__webglFramebuffer[le]);else s.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&s.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&s.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let le=0;le<w.__webglColorRenderbuffer.length;le++)w.__webglColorRenderbuffer[le]&&s.deleteRenderbuffer(w.__webglColorRenderbuffer[le]);w.__webglDepthRenderbuffer&&s.deleteRenderbuffer(w.__webglDepthRenderbuffer)}const Q=O.textures;for(let le=0,fe=Q.length;le<fe;le++){const we=i.get(Q[le]);we.__webglTexture&&(s.deleteTexture(we.__webglTexture),c.memory.textures--),i.remove(Q[le])}i.remove(O)}let G=0;function J(){G=0}function H(){return G}function Z(O){G=O}function he(){const O=G;return O>=a.maxTextures&&at("WebGLTextures: Trying to use "+(O+1)+" texture units while this GPU supports only "+a.maxTextures),G+=1,O}function ne(O){const w=[];return w.push(O.wrapS),w.push(O.wrapT),w.push(O.wrapR||0),w.push(O.magFilter),w.push(O.minFilter),w.push(O.anisotropy),w.push(O.internalFormat),w.push(O.format),w.push(O.type),w.push(O.generateMipmaps),w.push(O.premultiplyAlpha),w.push(O.flipY),w.push(O.unpackAlignment),w.push(O.colorSpace),w.join()}function ee(O,w){const Q=i.get(O);if(O.isVideoTexture&&X(O),O.isRenderTargetTexture===!1&&O.isExternalTexture!==!0&&O.version>0&&Q.__version!==O.version){const le=O.image;if(le===null)at("WebGLRenderer: Texture marked for update but no image data found.");else if(le.complete===!1)at("WebGLRenderer: Texture marked for update but image is incomplete");else{Ee(Q,O,w);return}}else O.isExternalTexture&&(Q.__webglTexture=O.sourceTexture?O.sourceTexture:null);t.bindTexture(s.TEXTURE_2D,Q.__webglTexture,s.TEXTURE0+w)}function $(O,w){const Q=i.get(O);if(O.isRenderTargetTexture===!1&&O.version>0&&Q.__version!==O.version){Ee(Q,O,w);return}else O.isExternalTexture&&(Q.__webglTexture=O.sourceTexture?O.sourceTexture:null);t.bindTexture(s.TEXTURE_2D_ARRAY,Q.__webglTexture,s.TEXTURE0+w)}function K(O,w){const Q=i.get(O);if(O.isRenderTargetTexture===!1&&O.version>0&&Q.__version!==O.version){Ee(Q,O,w);return}t.bindTexture(s.TEXTURE_3D,Q.__webglTexture,s.TEXTURE0+w)}function F(O,w){const Q=i.get(O);if(O.isCubeDepthTexture!==!0&&O.version>0&&Q.__version!==O.version){$e(Q,O,w);return}t.bindTexture(s.TEXTURE_CUBE_MAP,Q.__webglTexture,s.TEXTURE0+w)}const se={[$h]:s.REPEAT,[Cr]:s.CLAMP_TO_EDGE,[Kh]:s.MIRRORED_REPEAT},Se={[Rn]:s.NEAREST,[tM]:s.NEAREST_MIPMAP_NEAREST,[xc]:s.NEAREST_MIPMAP_LINEAR,[Bn]:s.LINEAR,[sh]:s.LINEAR_MIPMAP_NEAREST,[Os]:s.LINEAR_MIPMAP_LINEAR},Ge={[sM]:s.NEVER,[uM]:s.ALWAYS,[aM]:s.LESS,[jf]:s.LEQUAL,[oM]:s.EQUAL,[Xf]:s.GEQUAL,[lM]:s.GREATER,[cM]:s.NOTEQUAL};function Be(O,w){if(w.type===Hi&&e.has("OES_texture_float_linear")===!1&&(w.magFilter===Bn||w.magFilter===sh||w.magFilter===xc||w.magFilter===Os||w.minFilter===Bn||w.minFilter===sh||w.minFilter===xc||w.minFilter===Os)&&at("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(O,s.TEXTURE_WRAP_S,se[w.wrapS]),s.texParameteri(O,s.TEXTURE_WRAP_T,se[w.wrapT]),(O===s.TEXTURE_3D||O===s.TEXTURE_2D_ARRAY)&&s.texParameteri(O,s.TEXTURE_WRAP_R,se[w.wrapR]),s.texParameteri(O,s.TEXTURE_MAG_FILTER,Se[w.magFilter]),s.texParameteri(O,s.TEXTURE_MIN_FILTER,Se[w.minFilter]),w.compareFunction&&(s.texParameteri(O,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(O,s.TEXTURE_COMPARE_FUNC,Ge[w.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===Rn||w.minFilter!==xc&&w.minFilter!==Os||w.type===Hi&&e.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||i.get(w).__currentAnisotropy){const Q=e.get("EXT_texture_filter_anisotropic");s.texParameterf(O,Q.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,a.getMaxAnisotropy())),i.get(w).__currentAnisotropy=w.anisotropy}}}function Ve(O,w){let Q=!1;O.__webglInit===void 0&&(O.__webglInit=!0,w.addEventListener("dispose",U));const le=w.source;let fe=y.get(le);fe===void 0&&(fe={},y.set(le,fe));const we=ne(w);if(we!==O.__cacheKey){fe[we]===void 0&&(fe[we]={texture:s.createTexture(),usedTimes:0},c.memory.textures++,Q=!0),fe[we].usedTimes++;const Ae=fe[O.__cacheKey];Ae!==void 0&&(fe[O.__cacheKey].usedTimes--,Ae.usedTimes===0&&B(w)),O.__cacheKey=we,O.__webglTexture=fe[we].texture}return Q}function ae(O,w,Q){return Math.floor(Math.floor(O/Q)/w)}function de(O,w,Q,le){const we=O.updateRanges;if(we.length===0)t.texSubImage2D(s.TEXTURE_2D,0,0,0,w.width,w.height,Q,le,w.data);else{we.sort((Ke,Ne)=>Ke.start-Ne.start);let Ae=0;for(let Ke=1;Ke<we.length;Ke++){const Ne=we[Ae],Te=we[Ke],Ze=Ne.start+Ne.count,tt=ae(Te.start,w.width,4),rt=ae(Ne.start,w.width,4);Te.start<=Ze+1&&tt===rt&&ae(Te.start+Te.count-1,w.width,4)===tt?Ne.count=Math.max(Ne.count,Te.start+Te.count-Ne.start):(++Ae,we[Ae]=Te)}we.length=Ae+1;const pe=t.getParameter(s.UNPACK_ROW_LENGTH),_e=t.getParameter(s.UNPACK_SKIP_PIXELS),Pe=t.getParameter(s.UNPACK_SKIP_ROWS);t.pixelStorei(s.UNPACK_ROW_LENGTH,w.width);for(let Ke=0,Ne=we.length;Ke<Ne;Ke++){const Te=we[Ke],Ze=Math.floor(Te.start/4),tt=Math.ceil(Te.count/4),rt=Ze%w.width,W=Math.floor(Ze/w.width),Ce=tt,ge=1;t.pixelStorei(s.UNPACK_SKIP_PIXELS,rt),t.pixelStorei(s.UNPACK_SKIP_ROWS,W),t.texSubImage2D(s.TEXTURE_2D,0,rt,W,Ce,ge,Q,le,w.data)}O.clearUpdateRanges(),t.pixelStorei(s.UNPACK_ROW_LENGTH,pe),t.pixelStorei(s.UNPACK_SKIP_PIXELS,_e),t.pixelStorei(s.UNPACK_SKIP_ROWS,Pe)}}function Ee(O,w,Q){let le=s.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(le=s.TEXTURE_2D_ARRAY),w.isData3DTexture&&(le=s.TEXTURE_3D);const fe=Ve(O,w),we=w.source;t.bindTexture(le,O.__webglTexture,s.TEXTURE0+Q);const Ae=i.get(we);if(we.version!==Ae.__version||fe===!0){if(t.activeTexture(s.TEXTURE0+Q),(typeof ImageBitmap<"u"&&w.image instanceof ImageBitmap)===!1){const ge=wt.getPrimaries(wt.workingColorSpace),Re=w.colorSpace===rs?null:wt.getPrimaries(w.colorSpace),Oe=w.colorSpace===rs||ge===Re?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,w.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Oe)}t.pixelStorei(s.UNPACK_ALIGNMENT,w.unpackAlignment);let _e=S(w.image,!1,a.maxTextureSize);_e=fn(w,_e);const Pe=l.convert(w.format,w.colorSpace),Ke=l.convert(w.type);let Ne=A(w.internalFormat,Pe,Ke,w.normalized,w.colorSpace,w.isVideoTexture);Be(le,w);let Te;const Ze=w.mipmaps,tt=w.isVideoTexture!==!0,rt=Ae.__version===void 0||fe===!0,W=we.dataReady,Ce=L(w,_e);if(w.isDepthTexture)Ne=P(w.format===ks,w.type),rt&&(tt?t.texStorage2D(s.TEXTURE_2D,1,Ne,_e.width,_e.height):t.texImage2D(s.TEXTURE_2D,0,Ne,_e.width,_e.height,0,Pe,Ke,null));else if(w.isDataTexture)if(Ze.length>0){tt&&rt&&t.texStorage2D(s.TEXTURE_2D,Ce,Ne,Ze[0].width,Ze[0].height);for(let ge=0,Re=Ze.length;ge<Re;ge++)Te=Ze[ge],tt?W&&t.texSubImage2D(s.TEXTURE_2D,ge,0,0,Te.width,Te.height,Pe,Ke,Te.data):t.texImage2D(s.TEXTURE_2D,ge,Ne,Te.width,Te.height,0,Pe,Ke,Te.data);w.generateMipmaps=!1}else tt?(rt&&t.texStorage2D(s.TEXTURE_2D,Ce,Ne,_e.width,_e.height),W&&de(w,_e,Pe,Ke)):t.texImage2D(s.TEXTURE_2D,0,Ne,_e.width,_e.height,0,Pe,Ke,_e.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){tt&&rt&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Ce,Ne,Ze[0].width,Ze[0].height,_e.depth);for(let ge=0,Re=Ze.length;ge<Re;ge++)if(Te=Ze[ge],w.format!==Vi)if(Pe!==null)if(tt){if(W)if(w.layerUpdates.size>0){const Oe=Pg(Te.width,Te.height,w.format,w.type);for(const xe of w.layerUpdates){const Je=Te.data.subarray(xe*Oe/Te.data.BYTES_PER_ELEMENT,(xe+1)*Oe/Te.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,ge,0,0,xe,Te.width,Te.height,1,Pe,Je)}}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,ge,0,0,0,Te.width,Te.height,_e.depth,Pe,Te.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,ge,Ne,Te.width,Te.height,_e.depth,0,Te.data,0,0);else at("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else tt?W&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,ge,0,0,0,Te.width,Te.height,_e.depth,Pe,Ke,Te.data):t.texImage3D(s.TEXTURE_2D_ARRAY,ge,Ne,Te.width,Te.height,_e.depth,0,Pe,Ke,Te.data);w.layerUpdates.size>0&&w.clearLayerUpdates()}else{tt&&rt&&t.texStorage2D(s.TEXTURE_2D,Ce,Ne,Ze[0].width,Ze[0].height);for(let ge=0,Re=Ze.length;ge<Re;ge++)Te=Ze[ge],w.format!==Vi?Pe!==null?tt?W&&t.compressedTexSubImage2D(s.TEXTURE_2D,ge,0,0,Te.width,Te.height,Pe,Te.data):t.compressedTexImage2D(s.TEXTURE_2D,ge,Ne,Te.width,Te.height,0,Te.data):at("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):tt?W&&t.texSubImage2D(s.TEXTURE_2D,ge,0,0,Te.width,Te.height,Pe,Ke,Te.data):t.texImage2D(s.TEXTURE_2D,ge,Ne,Te.width,Te.height,0,Pe,Ke,Te.data)}else if(w.isDataArrayTexture)if(tt){if(rt&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Ce,Ne,_e.width,_e.height,_e.depth),W)if(w.layerUpdates.size>0){const ge=Pg(_e.width,_e.height,w.format,w.type);for(const Re of w.layerUpdates){const Oe=_e.data.subarray(Re*ge/_e.data.BYTES_PER_ELEMENT,(Re+1)*ge/_e.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,Re,_e.width,_e.height,1,Pe,Ke,Oe)}w.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,_e.width,_e.height,_e.depth,Pe,Ke,_e.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,Ne,_e.width,_e.height,_e.depth,0,Pe,Ke,_e.data);else if(w.isData3DTexture)tt?(rt&&t.texStorage3D(s.TEXTURE_3D,Ce,Ne,_e.width,_e.height,_e.depth),W&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,_e.width,_e.height,_e.depth,Pe,Ke,_e.data)):t.texImage3D(s.TEXTURE_3D,0,Ne,_e.width,_e.height,_e.depth,0,Pe,Ke,_e.data);else if(w.isFramebufferTexture){if(rt)if(tt)t.texStorage2D(s.TEXTURE_2D,Ce,Ne,_e.width,_e.height);else{let ge=_e.width,Re=_e.height;for(let Oe=0;Oe<Ce;Oe++)t.texImage2D(s.TEXTURE_2D,Oe,Ne,ge,Re,0,Pe,Ke,null),ge>>=1,Re>>=1}}else if(w.isHTMLTexture){if("texElementImage2D"in s){const ge=s.canvas;if(ge.hasAttribute("layoutsubtree")||ge.setAttribute("layoutsubtree","true"),_e.parentNode!==ge){ge.appendChild(_e),m.add(w),ge.onpaint=Re=>{const Oe=Re.changedElements;for(const xe of m)Oe.includes(xe.image)&&(xe.needsUpdate=!0)},ge.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,_e);else{const Oe=s.RGBA,xe=s.RGBA,Je=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,Oe,xe,Je,_e)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(Ze.length>0){if(tt&&rt){const ge=Rt(Ze[0]);t.texStorage2D(s.TEXTURE_2D,Ce,Ne,ge.width,ge.height)}for(let ge=0,Re=Ze.length;ge<Re;ge++)Te=Ze[ge],tt?W&&t.texSubImage2D(s.TEXTURE_2D,ge,0,0,Pe,Ke,Te):t.texImage2D(s.TEXTURE_2D,ge,Ne,Pe,Ke,Te);w.generateMipmaps=!1}else if(tt){if(rt){const ge=Rt(_e);t.texStorage2D(s.TEXTURE_2D,Ce,Ne,ge.width,ge.height)}W&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,Pe,Ke,_e)}else t.texImage2D(s.TEXTURE_2D,0,Ne,Pe,Ke,_e);x(w)&&R(le),Ae.__version=we.version,w.onUpdate&&w.onUpdate(w)}O.__version=w.version}function $e(O,w,Q){if(w.image.length!==6)return;const le=Ve(O,w),fe=w.source;t.bindTexture(s.TEXTURE_CUBE_MAP,O.__webglTexture,s.TEXTURE0+Q);const we=i.get(fe);if(fe.version!==we.__version||le===!0){t.activeTexture(s.TEXTURE0+Q);const Ae=wt.getPrimaries(wt.workingColorSpace),pe=w.colorSpace===rs?null:wt.getPrimaries(w.colorSpace),_e=w.colorSpace===rs||Ae===pe?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,w.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),t.pixelStorei(s.UNPACK_ALIGNMENT,w.unpackAlignment),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,_e);const Pe=w.isCompressedTexture||w.image[0].isCompressedTexture,Ke=w.image[0]&&w.image[0].isDataTexture,Ne=[];for(let xe=0;xe<6;xe++)!Pe&&!Ke?Ne[xe]=S(w.image[xe],!0,a.maxCubemapSize):Ne[xe]=Ke?w.image[xe].image:w.image[xe],Ne[xe]=fn(w,Ne[xe]);const Te=Ne[0],Ze=l.convert(w.format,w.colorSpace),tt=l.convert(w.type),rt=A(w.internalFormat,Ze,tt,w.normalized,w.colorSpace),W=w.isVideoTexture!==!0,Ce=we.__version===void 0||le===!0,ge=fe.dataReady;let Re=L(w,Te);Be(s.TEXTURE_CUBE_MAP,w);let Oe;if(Pe){W&&Ce&&t.texStorage2D(s.TEXTURE_CUBE_MAP,Re,rt,Te.width,Te.height);for(let xe=0;xe<6;xe++){Oe=Ne[xe].mipmaps;for(let Je=0;Je<Oe.length;Je++){const qe=Oe[Je];w.format!==Vi?Ze!==null?W?ge&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xe,Je,0,0,qe.width,qe.height,Ze,qe.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xe,Je,rt,qe.width,qe.height,0,qe.data):at("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):W?ge&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xe,Je,0,0,qe.width,qe.height,Ze,tt,qe.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xe,Je,rt,qe.width,qe.height,0,Ze,tt,qe.data)}}}else{if(Oe=w.mipmaps,W&&Ce){Oe.length>0&&Re++;const xe=Rt(Ne[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,Re,rt,xe.width,xe.height)}for(let xe=0;xe<6;xe++)if(Ke){W?ge&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xe,0,0,0,Ne[xe].width,Ne[xe].height,Ze,tt,Ne[xe].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xe,0,rt,Ne[xe].width,Ne[xe].height,0,Ze,tt,Ne[xe].data);for(let Je=0;Je<Oe.length;Je++){const Pt=Oe[Je].image[xe].image;W?ge&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xe,Je+1,0,0,Pt.width,Pt.height,Ze,tt,Pt.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xe,Je+1,rt,Pt.width,Pt.height,0,Ze,tt,Pt.data)}}else{W?ge&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xe,0,0,0,Ze,tt,Ne[xe]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xe,0,rt,Ze,tt,Ne[xe]);for(let Je=0;Je<Oe.length;Je++){const qe=Oe[Je];W?ge&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xe,Je+1,0,0,Ze,tt,qe.image[xe]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xe,Je+1,rt,Ze,tt,qe.image[xe])}}}x(w)&&R(s.TEXTURE_CUBE_MAP),we.__version=fe.version,w.onUpdate&&w.onUpdate(w)}O.__version=w.version}function Fe(O,w,Q,le,fe,we){const Ae=l.convert(Q.format,Q.colorSpace),pe=l.convert(Q.type),_e=A(Q.internalFormat,Ae,pe,Q.normalized,Q.colorSpace),Pe=i.get(w),Ke=i.get(Q);if(Ke.__renderTarget=w,!Pe.__hasExternalTextures){const Ne=Math.max(1,w.width>>we),Te=Math.max(1,w.height>>we);fe===s.TEXTURE_3D||fe===s.TEXTURE_2D_ARRAY?t.texImage3D(fe,we,_e,Ne,Te,w.depth,0,Ae,pe,null):t.texImage2D(fe,we,_e,Ne,Te,0,Ae,pe,null)}t.bindFramebuffer(s.FRAMEBUFFER,O),$t(w)?d.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,le,fe,Ke.__webglTexture,0,Ct(w)):(fe===s.TEXTURE_2D||fe>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&fe<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,le,fe,Ke.__webglTexture,we),t.bindFramebuffer(s.FRAMEBUFFER,null)}function dt(O,w,Q){if(s.bindRenderbuffer(s.RENDERBUFFER,O),w.depthBuffer){const le=w.depthTexture,fe=le&&le.isDepthTexture?le.type:null,we=P(w.stencilBuffer,fe),Ae=w.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;$t(w)?d.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Ct(w),we,w.width,w.height):Q?s.renderbufferStorageMultisample(s.RENDERBUFFER,Ct(w),we,w.width,w.height):s.renderbufferStorage(s.RENDERBUFFER,we,w.width,w.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,Ae,s.RENDERBUFFER,O)}else{const le=w.textures;for(let fe=0;fe<le.length;fe++){const we=le[fe],Ae=l.convert(we.format,we.colorSpace),pe=l.convert(we.type),_e=A(we.internalFormat,Ae,pe,we.normalized,we.colorSpace);$t(w)?d.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Ct(w),_e,w.width,w.height):Q?s.renderbufferStorageMultisample(s.RENDERBUFFER,Ct(w),_e,w.width,w.height):s.renderbufferStorage(s.RENDERBUFFER,_e,w.width,w.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Gt(O,w,Q){const le=w.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(s.FRAMEBUFFER,O),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const fe=i.get(w.depthTexture);if(fe.__renderTarget=w,(!fe.__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),le){if(fe.__webglInit===void 0&&(fe.__webglInit=!0,w.depthTexture.addEventListener("dispose",U)),fe.__webglTexture===void 0){fe.__webglTexture=s.createTexture(),t.bindTexture(s.TEXTURE_CUBE_MAP,fe.__webglTexture),Be(s.TEXTURE_CUBE_MAP,w.depthTexture);const Pe=l.convert(w.depthTexture.format),Ke=l.convert(w.depthTexture.type);let Ne;w.depthTexture.format===Lr?Ne=s.DEPTH_COMPONENT24:w.depthTexture.format===ks&&(Ne=s.DEPTH24_STENCIL8);for(let Te=0;Te<6;Te++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Te,0,Ne,w.width,w.height,0,Pe,Ke,null)}}else ee(w.depthTexture,0);const we=fe.__webglTexture,Ae=Ct(w),pe=le?s.TEXTURE_CUBE_MAP_POSITIVE_X+Q:s.TEXTURE_2D,_e=w.depthTexture.format===ks?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(w.depthTexture.format===Lr)$t(w)?d.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,_e,pe,we,0,Ae):s.framebufferTexture2D(s.FRAMEBUFFER,_e,pe,we,0);else if(w.depthTexture.format===ks)$t(w)?d.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,_e,pe,we,0,Ae):s.framebufferTexture2D(s.FRAMEBUFFER,_e,pe,we,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ht(O){const w=i.get(O),Q=O.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==O.depthTexture){const le=O.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),le){const fe=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,le.removeEventListener("dispose",fe)};le.addEventListener("dispose",fe),w.__depthDisposeCallback=fe}w.__boundDepthTexture=le}if(O.depthTexture&&!w.__autoAllocateDepthBuffer)if(Q)for(let le=0;le<6;le++)Gt(w.__webglFramebuffer[le],O,le);else{const le=O.texture.mipmaps;le&&le.length>0?Gt(w.__webglFramebuffer[0],O,0):Gt(w.__webglFramebuffer,O,0)}else if(Q){w.__webglDepthbuffer=[];for(let le=0;le<6;le++)if(t.bindFramebuffer(s.FRAMEBUFFER,w.__webglFramebuffer[le]),w.__webglDepthbuffer[le]===void 0)w.__webglDepthbuffer[le]=s.createRenderbuffer(),dt(w.__webglDepthbuffer[le],O,!1);else{const fe=O.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,we=w.__webglDepthbuffer[le];s.bindRenderbuffer(s.RENDERBUFFER,we),s.framebufferRenderbuffer(s.FRAMEBUFFER,fe,s.RENDERBUFFER,we)}}else{const le=O.texture.mipmaps;if(le&&le.length>0?t.bindFramebuffer(s.FRAMEBUFFER,w.__webglFramebuffer[0]):t.bindFramebuffer(s.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=s.createRenderbuffer(),dt(w.__webglDepthbuffer,O,!1);else{const fe=O.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,we=w.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,we),s.framebufferRenderbuffer(s.FRAMEBUFFER,fe,s.RENDERBUFFER,we)}}t.bindFramebuffer(s.FRAMEBUFFER,null)}function xt(O,w,Q){const le=i.get(O);w!==void 0&&Fe(le.__webglFramebuffer,O,O.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),Q!==void 0&&ht(O)}function At(O){const w=O.texture,Q=i.get(O),le=i.get(w);O.addEventListener("dispose",b);const fe=O.textures,we=O.isWebGLCubeRenderTarget===!0,Ae=fe.length>1;if(Ae||(le.__webglTexture===void 0&&(le.__webglTexture=s.createTexture()),le.__version=w.version,c.memory.textures++),we){Q.__webglFramebuffer=[];for(let pe=0;pe<6;pe++)if(w.mipmaps&&w.mipmaps.length>0){Q.__webglFramebuffer[pe]=[];for(let _e=0;_e<w.mipmaps.length;_e++)Q.__webglFramebuffer[pe][_e]=s.createFramebuffer()}else Q.__webglFramebuffer[pe]=s.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){Q.__webglFramebuffer=[];for(let pe=0;pe<w.mipmaps.length;pe++)Q.__webglFramebuffer[pe]=s.createFramebuffer()}else Q.__webglFramebuffer=s.createFramebuffer();if(Ae)for(let pe=0,_e=fe.length;pe<_e;pe++){const Pe=i.get(fe[pe]);Pe.__webglTexture===void 0&&(Pe.__webglTexture=s.createTexture(),c.memory.textures++)}if(O.samples>0&&$t(O)===!1){Q.__webglMultisampledFramebuffer=s.createFramebuffer(),Q.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,Q.__webglMultisampledFramebuffer);for(let pe=0;pe<fe.length;pe++){const _e=fe[pe];Q.__webglColorRenderbuffer[pe]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,Q.__webglColorRenderbuffer[pe]);const Pe=l.convert(_e.format,_e.colorSpace),Ke=l.convert(_e.type),Ne=A(_e.internalFormat,Pe,Ke,_e.normalized,_e.colorSpace,O.isXRRenderTarget===!0),Te=Ct(O);s.renderbufferStorageMultisample(s.RENDERBUFFER,Te,Ne,O.width,O.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+pe,s.RENDERBUFFER,Q.__webglColorRenderbuffer[pe])}s.bindRenderbuffer(s.RENDERBUFFER,null),O.depthBuffer&&(Q.__webglDepthRenderbuffer=s.createRenderbuffer(),dt(Q.__webglDepthRenderbuffer,O,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(we){t.bindTexture(s.TEXTURE_CUBE_MAP,le.__webglTexture),Be(s.TEXTURE_CUBE_MAP,w);for(let pe=0;pe<6;pe++)if(w.mipmaps&&w.mipmaps.length>0)for(let _e=0;_e<w.mipmaps.length;_e++)Fe(Q.__webglFramebuffer[pe][_e],O,w,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,_e);else Fe(Q.__webglFramebuffer[pe],O,w,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0);x(w)&&R(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ae){for(let pe=0,_e=fe.length;pe<_e;pe++){const Pe=fe[pe],Ke=i.get(Pe);let Ne=s.TEXTURE_2D;(O.isWebGL3DRenderTarget||O.isWebGLArrayRenderTarget)&&(Ne=O.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(Ne,Ke.__webglTexture),Be(Ne,Pe),Fe(Q.__webglFramebuffer,O,Pe,s.COLOR_ATTACHMENT0+pe,Ne,0),x(Pe)&&R(Ne)}t.unbindTexture()}else{let pe=s.TEXTURE_2D;if((O.isWebGL3DRenderTarget||O.isWebGLArrayRenderTarget)&&(pe=O.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(pe,le.__webglTexture),Be(pe,w),w.mipmaps&&w.mipmaps.length>0)for(let _e=0;_e<w.mipmaps.length;_e++)Fe(Q.__webglFramebuffer[_e],O,w,s.COLOR_ATTACHMENT0,pe,_e);else Fe(Q.__webglFramebuffer,O,w,s.COLOR_ATTACHMENT0,pe,0);x(w)&&R(pe),t.unbindTexture()}O.depthBuffer&&ht(O)}function pt(O){const w=O.textures;for(let Q=0,le=w.length;Q<le;Q++){const fe=w[Q];if(x(fe)){const we=I(O),Ae=i.get(fe).__webglTexture;t.bindTexture(we,Ae),R(we),t.unbindTexture()}}}const Ut=[],Xt=[];function Ft(O){if(O.samples>0){if($t(O)===!1){const w=O.textures,Q=O.width,le=O.height;let fe=s.COLOR_BUFFER_BIT;const we=O.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Ae=i.get(O),pe=w.length>1;if(pe)for(let Pe=0;Pe<w.length;Pe++)t.bindFramebuffer(s.FRAMEBUFFER,Ae.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Pe,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,Ae.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Pe,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,Ae.__webglMultisampledFramebuffer);const _e=O.texture.mipmaps;_e&&_e.length>0?t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ae.__webglFramebuffer[0]):t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ae.__webglFramebuffer);for(let Pe=0;Pe<w.length;Pe++){if(O.resolveDepthBuffer&&(O.depthBuffer&&(fe|=s.DEPTH_BUFFER_BIT),O.stencilBuffer&&O.resolveStencilBuffer&&(fe|=s.STENCIL_BUFFER_BIT)),pe){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,Ae.__webglColorRenderbuffer[Pe]);const Ke=i.get(w[Pe]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Ke,0)}s.blitFramebuffer(0,0,Q,le,0,0,Q,le,fe,s.NEAREST),h===!0&&(Ut.length=0,Xt.length=0,Ut.push(s.COLOR_ATTACHMENT0+Pe),O.depthBuffer&&O.storeMultisampledDepthBuffer===!1&&(Ut.push(we),Xt.push(we),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,Xt)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,Ut))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),pe)for(let Pe=0;Pe<w.length;Pe++){t.bindFramebuffer(s.FRAMEBUFFER,Ae.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Pe,s.RENDERBUFFER,Ae.__webglColorRenderbuffer[Pe]);const Ke=i.get(w[Pe]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,Ae.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Pe,s.TEXTURE_2D,Ke,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ae.__webglMultisampledFramebuffer)}else if(O.depthBuffer&&O.storeMultisampledDepthBuffer===!1&&h){const w=O.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[w])}}}function Ct(O){return Math.min(a.maxSamples,O.samples)}function $t(O){const w=i.get(O);return O.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function X(O){const w=c.render.frame;_.get(O)!==w&&(_.set(O,w),O.update())}function fn(O,w){const Q=O.colorSpace,le=O.format,fe=O.type;return O.isCompressedTexture===!0||O.isVideoTexture===!0||Q!==su&&Q!==rs&&(wt.getTransfer(Q)===kt?(le!==Vi||fe!==di)&&at("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Dt("WebGLTextures: Unsupported texture color space:",Q)),w}function Rt(O){return typeof HTMLImageElement<"u"&&O instanceof HTMLImageElement?(f.width=O.naturalWidth||O.width,f.height=O.naturalHeight||O.height):typeof VideoFrame<"u"&&O instanceof VideoFrame?(f.width=O.displayWidth,f.height=O.displayHeight):(f.width=O.width,f.height=O.height),f}this.allocateTextureUnit=he,this.resetTextureUnits=J,this.getTextureUnits=H,this.setTextureUnits=Z,this.setTexture2D=ee,this.setTexture2DArray=$,this.setTexture3D=K,this.setTextureCube=F,this.rebindTextures=xt,this.setupRenderTarget=At,this.updateRenderTargetMipmap=pt,this.updateMultisampleRenderTarget=Ft,this.setupDepthRenderbuffer=ht,this.setupFrameBufferTexture=Fe,this.useMultisampledRTT=$t,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function QT(s,e){function t(i,a=rs){let l;const c=wt.getTransfer(a);if(i===di)return s.UNSIGNED_BYTE;if(i===Bf)return s.UNSIGNED_SHORT_4_4_4_4;if(i===zf)return s.UNSIGNED_SHORT_5_5_5_1;if(i===z_)return s.UNSIGNED_INT_5_9_9_9_REV;if(i===H_)return s.UNSIGNED_INT_10F_11F_11F_REV;if(i===k_)return s.BYTE;if(i===B_)return s.SHORT;if(i===rl)return s.UNSIGNED_SHORT;if(i===kf)return s.INT;if(i===ar)return s.UNSIGNED_INT;if(i===Hi)return s.FLOAT;if(i===or)return s.HALF_FLOAT;if(i===V_)return s.ALPHA;if(i===G_)return s.RGB;if(i===Vi)return s.RGBA;if(i===Lr)return s.DEPTH_COMPONENT;if(i===ks)return s.DEPTH_STENCIL;if(i===Hf)return s.RED;if(i===Vf)return s.RED_INTEGER;if(i===Ys)return s.RG;if(i===Gf)return s.RG_INTEGER;if(i===Wf)return s.RGBA_INTEGER;if(i===Yc||i===$c||i===Kc||i===Zc)if(c===kt)if(l=e.get("WEBGL_compressed_texture_s3tc_srgb"),l!==null){if(i===Yc)return l.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===$c)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Kc)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Zc)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(l=e.get("WEBGL_compressed_texture_s3tc"),l!==null){if(i===Yc)return l.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===$c)return l.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Kc)return l.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Zc)return l.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Zh||i===Qh||i===Jh||i===ef)if(l=e.get("WEBGL_compressed_texture_pvrtc"),l!==null){if(i===Zh)return l.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Qh)return l.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Jh)return l.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===ef)return l.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===tf||i===nf||i===rf||i===sf||i===af||i===nu||i===of)if(l=e.get("WEBGL_compressed_texture_etc"),l!==null){if(i===tf||i===nf)return c===kt?l.COMPRESSED_SRGB8_ETC2:l.COMPRESSED_RGB8_ETC2;if(i===rf)return c===kt?l.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:l.COMPRESSED_RGBA8_ETC2_EAC;if(i===sf)return l.COMPRESSED_R11_EAC;if(i===af)return l.COMPRESSED_SIGNED_R11_EAC;if(i===nu)return l.COMPRESSED_RG11_EAC;if(i===of)return l.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===lf||i===cf||i===uf||i===df||i===hf||i===ff||i===pf||i===mf||i===gf||i===_f||i===xf||i===vf||i===yf||i===Sf)if(l=e.get("WEBGL_compressed_texture_astc"),l!==null){if(i===lf)return c===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:l.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===cf)return c===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:l.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===uf)return c===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:l.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===df)return c===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:l.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===hf)return c===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:l.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===ff)return c===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:l.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===pf)return c===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:l.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===mf)return c===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:l.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===gf)return c===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:l.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===_f)return c===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:l.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===xf)return c===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:l.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===vf)return c===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:l.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===yf)return c===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:l.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Sf)return c===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:l.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Mf||i===Ef||i===wf)if(l=e.get("EXT_texture_compression_bptc"),l!==null){if(i===Mf)return c===kt?l.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:l.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Ef)return l.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===wf)return l.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===bf||i===Tf||i===iu||i===Af)if(l=e.get("EXT_texture_compression_rgtc"),l!==null){if(i===bf)return l.COMPRESSED_RED_RGTC1_EXT;if(i===Tf)return l.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===iu)return l.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Af)return l.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===sl?s.UNSIGNED_INT_24_8:s[i]!==void 0?s[i]:null}return{convert:t}}const JT=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,eA=`
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

}`;class tA{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new Q_(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new cr({vertexShader:JT,fragmentShader:eA,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Bt(new Nr(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class nA extends fs{constructor(e,t){super();const i=this;let a=null,l=1,c=null,d="local-floor",h=1,f=null,_=null,m=null,g=null,y=null,M=null;const T=typeof XRWebGLBinding<"u",S=new tA,x={},R=t.getContextAttributes();let I=null,A=null;const P=[],L=[],U=new ot;let b=null,D=null;const B=new ui;B.viewport=new nn;const V=new ui;V.viewport=new nn;const G=[B,V],J=new c1;let H=null,Z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ae){let de=P[ae];return de===void 0&&(de=new fh,P[ae]=de),de.getTargetRaySpace()},this.getControllerGrip=function(ae){let de=P[ae];return de===void 0&&(de=new fh,P[ae]=de),de.getGripSpace()},this.getHand=function(ae){let de=P[ae];return de===void 0&&(de=new fh,P[ae]=de),de.getHandSpace()};function he(ae){const de=L.indexOf(ae.inputSource);if(de===-1)return;const Ee=P[de];Ee!==void 0&&(Ee.update(ae.inputSource,ae.frame,f||c),Ee.dispatchEvent({type:ae.type,data:ae.inputSource}))}function ne(){a.removeEventListener("select",he),a.removeEventListener("selectstart",he),a.removeEventListener("selectend",he),a.removeEventListener("squeeze",he),a.removeEventListener("squeezestart",he),a.removeEventListener("squeezeend",he),a.removeEventListener("end",ne),a.removeEventListener("inputsourceschange",ee);for(let ae=0;ae<P.length;ae++){const de=L[ae];de!==null&&(L[ae]=null,P[ae].disconnect(de))}H=null,Z=null,S.reset();for(const ae in x)delete x[ae];if(e.setRenderTarget(I),y=null,g=null,m=null,a=null,A=null,Ve.stop(),i.isPresenting=!1,e.setPixelRatio(b),e.setSize(U.width,U.height,!1),D!==null){const ae=D.camera;ae.fov=D.fov,ae.zoom=D.zoom,ae.updateProjectionMatrix(),D=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(ae){l=ae,i.isPresenting===!0&&at("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ae){d=ae,i.isPresenting===!0&&at("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return f||c},this.setReferenceSpace=function(ae){f=ae},this.getBaseLayer=function(){return g!==null?g:y},this.getBinding=function(){return m===null&&T&&(m=new XRWebGLBinding(a,t)),m},this.getFrame=function(){return M},this.getSession=function(){return a},this.setSession=async function(ae){if(a=ae,a!==null){if(I=e.getRenderTarget(),a.addEventListener("select",he),a.addEventListener("selectstart",he),a.addEventListener("selectend",he),a.addEventListener("squeeze",he),a.addEventListener("squeezestart",he),a.addEventListener("squeezeend",he),a.addEventListener("end",ne),a.addEventListener("inputsourceschange",ee),R.xrCompatible!==!0&&await t.makeXRCompatible(),b=e.getPixelRatio(),e.getSize(U),T&&"createProjectionLayer"in XRWebGLBinding.prototype){let Ee=null,$e=null,Fe=null;R.depth&&(Fe=R.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Ee=R.stencil?ks:Lr,$e=R.stencil?sl:ar);const dt={colorFormat:t.RGBA8,depthFormat:Fe,scaleFactor:l};m=this.getBinding(),g=m.createProjectionLayer(dt),a.updateRenderState({layers:[g]}),e.setPixelRatio(1),e.setSize(g.textureWidth,g.textureHeight,!1),A=new Gi(g.textureWidth,g.textureHeight,{format:Vi,type:di,depthTexture:new ol(g.textureWidth,g.textureHeight,$e,void 0,void 0,void 0,void 0,void 0,void 0,Ee),stencilBuffer:R.stencil,colorSpace:e.outputColorSpace,samples:R.antialias?4:0,resolveDepthBuffer:g.ignoreDepthValues===!1,resolveStencilBuffer:g.ignoreDepthValues===!1,storeMultisampledDepthBuffer:g.ignoreDepthValues===!1,storeMultisampledStencilBuffer:g.ignoreDepthValues===!1})}else{const Ee={antialias:R.antialias,alpha:!0,depth:R.depth,stencil:R.stencil,framebufferScaleFactor:l};y=new XRWebGLLayer(a,t,Ee),a.updateRenderState({baseLayer:y}),e.setPixelRatio(1),e.setSize(y.framebufferWidth,y.framebufferHeight,!1),A=new Gi(y.framebufferWidth,y.framebufferHeight,{format:Vi,type:di,colorSpace:e.outputColorSpace,stencilBuffer:R.stencil,resolveDepthBuffer:y.ignoreDepthValues===!1,resolveStencilBuffer:y.ignoreDepthValues===!1,storeMultisampledDepthBuffer:y.ignoreDepthValues===!1,storeMultisampledStencilBuffer:y.ignoreDepthValues===!1})}A.isXRRenderTarget=!0,this.setFoveation(h),f=null,c=await a.requestReferenceSpace(d),Ve.setContext(a),Ve.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return S.getDepthTexture()};function ee(ae){for(let de=0;de<ae.removed.length;de++){const Ee=ae.removed[de],$e=L.indexOf(Ee);$e>=0&&(L[$e]=null,P[$e].disconnect(Ee))}for(let de=0;de<ae.added.length;de++){const Ee=ae.added[de];let $e=L.indexOf(Ee);if($e===-1){for(let dt=0;dt<P.length;dt++)if(dt>=L.length){L.push(Ee),$e=dt;break}else if(L[dt]===null){L[dt]=Ee,$e=dt;break}if($e===-1)break}const Fe=P[$e];Fe&&Fe.connect(Ee)}}const $=new Y,K=new Y;function F(ae,de,Ee){$.setFromMatrixPosition(de.matrixWorld),K.setFromMatrixPosition(Ee.matrixWorld);const $e=$.distanceTo(K),Fe=de.projectionMatrix.elements,dt=Ee.projectionMatrix.elements,Gt=Fe[14]/(Fe[10]-1),ht=Fe[14]/(Fe[10]+1),xt=(Fe[9]+1)/Fe[5],At=(Fe[9]-1)/Fe[5],pt=(Fe[8]-1)/Fe[0],Ut=(dt[8]+1)/dt[0],Xt=Gt*pt,Ft=Gt*Ut,Ct=$e/(-pt+Ut),$t=Ct*-pt;if(de.matrixWorld.decompose(ae.position,ae.quaternion,ae.scale),ae.translateX($t),ae.translateZ(Ct),ae.matrixWorld.compose(ae.position,ae.quaternion,ae.scale),ae.matrixWorldInverse.copy(ae.matrixWorld).invert(),Fe[10]===-1)ae.projectionMatrix.copy(de.projectionMatrix),ae.projectionMatrixInverse.copy(de.projectionMatrixInverse);else{const X=Gt+Ct,fn=ht+Ct,Rt=Xt-$t,O=Ft+($e-$t),w=xt*ht/fn*X,Q=At*ht/fn*X;ae.projectionMatrix.makePerspective(Rt,O,w,Q,X,fn),ae.projectionMatrixInverse.copy(ae.projectionMatrix).invert()}}function se(ae,de){de===null?ae.matrixWorld.copy(ae.matrix):ae.matrixWorld.multiplyMatrices(de.matrixWorld,ae.matrix),ae.matrixWorldInverse.copy(ae.matrixWorld).invert()}this.updateCamera=function(ae){if(a===null)return;let de=ae.near,Ee=ae.far;S.texture!==null&&(S.depthNear>0&&(de=S.depthNear),S.depthFar>0&&(Ee=S.depthFar)),J.near=V.near=B.near=de,J.far=V.far=B.far=Ee,(H!==J.near||Z!==J.far)&&(a.updateRenderState({depthNear:J.near,depthFar:J.far}),H=J.near,Z=J.far),J.layers.mask=ae.layers.mask|6,B.layers.mask=J.layers.mask&-5,V.layers.mask=J.layers.mask&-3;const $e=ae.parent,Fe=J.cameras;se(J,$e);for(let dt=0;dt<Fe.length;dt++)se(Fe[dt],$e);Fe.length===2?F(J,B,V):J.projectionMatrix.copy(B.projectionMatrix),D===null&&ae.isPerspectiveCamera&&(D={camera:ae,fov:ae.fov,zoom:ae.zoom}),Se(ae,J,$e)};function Se(ae,de,Ee){Ee===null?ae.matrix.copy(de.matrixWorld):(ae.matrix.copy(Ee.matrixWorld),ae.matrix.invert(),ae.matrix.multiply(de.matrixWorld)),ae.matrix.decompose(ae.position,ae.quaternion,ae.scale),ae.updateMatrixWorld(!0),ae.projectionMatrix.copy(de.projectionMatrix),ae.projectionMatrixInverse.copy(de.projectionMatrixInverse),ae.isPerspectiveCamera&&(ae.fov=lu*2*Math.atan(1/ae.projectionMatrix.elements[5]),ae.zoom=1)}this.getCamera=function(){return J},this.getFoveation=function(){if(!(g===null&&y===null))return h},this.setFoveation=function(ae){h=ae,g!==null&&(g.fixedFoveation=ae),y!==null&&y.fixedFoveation!==void 0&&(y.fixedFoveation=ae)},this.hasDepthSensing=function(){return S.texture!==null},this.getDepthSensingMesh=function(){return S.getMesh(J)},this.getCameraTexture=function(ae){return x[ae]};let Ge=null;function Be(ae,de){if(_=de.getViewerPose(f||c),M=de,_!==null){const Ee=_.views;y!==null&&(e.setRenderTargetFramebuffer(A,y.framebuffer),e.setRenderTarget(A));let $e=!1;Ee.length!==J.cameras.length&&(J.cameras.length=0,$e=!0);for(let ht=0;ht<Ee.length;ht++){const xt=Ee[ht];let At=null;if(y!==null)At=y.getViewport(xt);else{const Ut=m.getViewSubImage(g,xt);At=Ut.viewport,ht===0&&(e.setRenderTargetTextures(A,Ut.colorTexture,Ut.depthStencilTexture),e.setRenderTarget(A))}let pt=G[ht];pt===void 0&&(pt=new ui,pt.layers.enable(ht),pt.viewport=new nn,G[ht]=pt),pt.matrix.fromArray(xt.transform.matrix),pt.matrix.decompose(pt.position,pt.quaternion,pt.scale),pt.projectionMatrix.fromArray(xt.projectionMatrix),pt.projectionMatrixInverse.copy(pt.projectionMatrix).invert(),pt.viewport.set(At.x,At.y,At.width,At.height),ht===0&&(J.matrix.copy(pt.matrix),J.matrix.decompose(J.position,J.quaternion,J.scale)),$e===!0&&J.cameras.push(pt)}const Fe=a.enabledFeatures;if(Fe&&Fe.includes("depth-sensing")&&a.depthUsage=="gpu-optimized"&&T){m=i.getBinding();const ht=m.getDepthInformation(Ee[0]);ht&&ht.isValid&&ht.texture&&S.init(ht,a.renderState)}if(Fe&&Fe.includes("camera-access")&&T){e.state.unbindTexture(),m=i.getBinding();for(let ht=0;ht<Ee.length;ht++){const xt=Ee[ht].camera;if(xt){let At=x[xt];At||(At=new Q_,x[xt]=At);const pt=m.getCameraImage(xt);At.sourceTexture=pt}}}}for(let Ee=0;Ee<P.length;Ee++){const $e=L[Ee],Fe=P[Ee];$e!==null&&Fe!==void 0&&Fe.update($e,de,f||c)}Ge&&Ge(ae,de),de.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:de}),M=null}const Ve=new nx;Ve.setAnimationLoop(Be),this.setAnimationLoop=function(ae){Ge=ae},this.dispose=function(){}}}const iA=new Vt,cx=new ft;cx.set(-1,0,0,0,1,0,0,0,1);function rA(s,e){function t(S,x){S.matrixAutoUpdate===!0&&S.updateMatrix(),x.value.copy(S.matrix)}function i(S,x){x.color.getRGB(S.fogColor.value,J_(s)),x.isFog?(S.fogNear.value=x.near,S.fogFar.value=x.far):x.isFogExp2&&(S.fogDensity.value=x.density)}function a(S,x,R,I,A){x.isNodeMaterial?x.uniformsNeedUpdate=!1:x.isMeshBasicMaterial?l(S,x):x.isMeshLambertMaterial?(l(S,x),x.envMap&&(S.envMapIntensity.value=x.envMapIntensity)):x.isMeshToonMaterial?(l(S,x),m(S,x)):x.isMeshPhongMaterial?(l(S,x),_(S,x),x.envMap&&(S.envMapIntensity.value=x.envMapIntensity)):x.isMeshStandardMaterial?(l(S,x),g(S,x),x.isMeshPhysicalMaterial&&y(S,x,A)):x.isMeshMatcapMaterial?(l(S,x),M(S,x)):x.isMeshDepthMaterial?l(S,x):x.isMeshDistanceMaterial?(l(S,x),T(S,x)):x.isMeshNormalMaterial?l(S,x):x.isLineBasicMaterial?(c(S,x),x.isLineDashedMaterial&&d(S,x)):x.isPointsMaterial?h(S,x,R,I):x.isSpriteMaterial?f(S,x):x.isShadowMaterial?(S.color.value.copy(x.color),S.opacity.value=x.opacity):x.isShaderMaterial&&(x.uniformsNeedUpdate=!1)}function l(S,x){S.opacity.value=x.opacity,x.color&&S.diffuse.value.copy(x.color),x.emissive&&S.emissive.value.copy(x.emissive).multiplyScalar(x.emissiveIntensity),x.map&&(S.map.value=x.map,t(x.map,S.mapTransform)),x.alphaMap&&(S.alphaMap.value=x.alphaMap,t(x.alphaMap,S.alphaMapTransform)),x.bumpMap&&(S.bumpMap.value=x.bumpMap,t(x.bumpMap,S.bumpMapTransform),S.bumpScale.value=x.bumpScale,x.side===ti&&(S.bumpScale.value*=-1)),x.normalMap&&(S.normalMap.value=x.normalMap,t(x.normalMap,S.normalMapTransform),S.normalScale.value.copy(x.normalScale),x.side===ti&&S.normalScale.value.negate()),x.displacementMap&&(S.displacementMap.value=x.displacementMap,t(x.displacementMap,S.displacementMapTransform),S.displacementScale.value=x.displacementScale,S.displacementBias.value=x.displacementBias),x.emissiveMap&&(S.emissiveMap.value=x.emissiveMap,t(x.emissiveMap,S.emissiveMapTransform)),x.specularMap&&(S.specularMap.value=x.specularMap,t(x.specularMap,S.specularMapTransform)),x.alphaTest>0&&(S.alphaTest.value=x.alphaTest);const R=e.get(x),I=R.envMap,A=R.envMapRotation;I&&(S.envMap.value=I,S.envMapRotation.value.setFromMatrix4(iA.makeRotationFromEuler(A)).transpose(),I.isCubeTexture&&I.isRenderTargetTexture===!1&&S.envMapRotation.value.premultiply(cx),S.reflectivity.value=x.reflectivity,S.ior.value=x.ior,S.refractionRatio.value=x.refractionRatio),x.lightMap&&(S.lightMap.value=x.lightMap,S.lightMapIntensity.value=x.lightMapIntensity,t(x.lightMap,S.lightMapTransform)),x.aoMap&&(S.aoMap.value=x.aoMap,S.aoMapIntensity.value=x.aoMapIntensity,t(x.aoMap,S.aoMapTransform))}function c(S,x){S.diffuse.value.copy(x.color),S.opacity.value=x.opacity,x.map&&(S.map.value=x.map,t(x.map,S.mapTransform))}function d(S,x){S.dashSize.value=x.dashSize,S.totalSize.value=x.dashSize+x.gapSize,S.scale.value=x.scale}function h(S,x,R,I){S.diffuse.value.copy(x.color),S.opacity.value=x.opacity,S.size.value=x.size*R,S.scale.value=I*.5,x.map&&(S.map.value=x.map,t(x.map,S.uvTransform)),x.alphaMap&&(S.alphaMap.value=x.alphaMap,t(x.alphaMap,S.alphaMapTransform)),x.alphaTest>0&&(S.alphaTest.value=x.alphaTest)}function f(S,x){S.diffuse.value.copy(x.color),S.opacity.value=x.opacity,S.rotation.value=x.rotation,x.map&&(S.map.value=x.map,t(x.map,S.mapTransform)),x.alphaMap&&(S.alphaMap.value=x.alphaMap,t(x.alphaMap,S.alphaMapTransform)),x.alphaTest>0&&(S.alphaTest.value=x.alphaTest)}function _(S,x){S.specular.value.copy(x.specular),S.shininess.value=Math.max(x.shininess,1e-4)}function m(S,x){x.gradientMap&&(S.gradientMap.value=x.gradientMap)}function g(S,x){S.metalness.value=x.metalness,x.metalnessMap&&(S.metalnessMap.value=x.metalnessMap,t(x.metalnessMap,S.metalnessMapTransform)),S.roughness.value=x.roughness,x.roughnessMap&&(S.roughnessMap.value=x.roughnessMap,t(x.roughnessMap,S.roughnessMapTransform)),x.envMap&&(S.envMapIntensity.value=x.envMapIntensity)}function y(S,x,R){S.ior.value=x.ior,x.sheen>0&&(S.sheenColor.value.copy(x.sheenColor).multiplyScalar(x.sheen),S.sheenRoughness.value=x.sheenRoughness,x.sheenColorMap&&(S.sheenColorMap.value=x.sheenColorMap,t(x.sheenColorMap,S.sheenColorMapTransform)),x.sheenRoughnessMap&&(S.sheenRoughnessMap.value=x.sheenRoughnessMap,t(x.sheenRoughnessMap,S.sheenRoughnessMapTransform))),x.clearcoat>0&&(S.clearcoat.value=x.clearcoat,S.clearcoatRoughness.value=x.clearcoatRoughness,x.clearcoatMap&&(S.clearcoatMap.value=x.clearcoatMap,t(x.clearcoatMap,S.clearcoatMapTransform)),x.clearcoatRoughnessMap&&(S.clearcoatRoughnessMap.value=x.clearcoatRoughnessMap,t(x.clearcoatRoughnessMap,S.clearcoatRoughnessMapTransform)),x.clearcoatNormalMap&&(S.clearcoatNormalMap.value=x.clearcoatNormalMap,t(x.clearcoatNormalMap,S.clearcoatNormalMapTransform),S.clearcoatNormalScale.value.copy(x.clearcoatNormalScale),x.side===ti&&S.clearcoatNormalScale.value.negate())),x.dispersion>0&&(S.dispersion.value=x.dispersion),x.retroreflectivity>0&&(S.retroreflectivity.value=x.retroreflectivity),x.iridescence>0&&(S.iridescence.value=x.iridescence,S.iridescenceIOR.value=x.iridescenceIOR,S.iridescenceThicknessMinimum.value=x.iridescenceThicknessRange[0],S.iridescenceThicknessMaximum.value=x.iridescenceThicknessRange[1],x.iridescenceMap&&(S.iridescenceMap.value=x.iridescenceMap,t(x.iridescenceMap,S.iridescenceMapTransform)),x.iridescenceThicknessMap&&(S.iridescenceThicknessMap.value=x.iridescenceThicknessMap,t(x.iridescenceThicknessMap,S.iridescenceThicknessMapTransform))),x.transmission>0&&(S.transmission.value=x.transmission,S.transmissionSamplerMap.value=R.texture,S.transmissionSamplerSize.value.set(R.width,R.height),x.transmissionMap&&(S.transmissionMap.value=x.transmissionMap,t(x.transmissionMap,S.transmissionMapTransform)),S.thickness.value=x.thickness,x.thicknessMap&&(S.thicknessMap.value=x.thicknessMap,t(x.thicknessMap,S.thicknessMapTransform)),S.attenuationDistance.value=x.attenuationDistance,S.attenuationColor.value.copy(x.attenuationColor)),x.anisotropy>0&&(S.anisotropyVector.value.set(x.anisotropy*Math.cos(x.anisotropyRotation),x.anisotropy*Math.sin(x.anisotropyRotation)),x.anisotropyMap&&(S.anisotropyMap.value=x.anisotropyMap,t(x.anisotropyMap,S.anisotropyMapTransform))),S.specularIntensity.value=x.specularIntensity,S.specularColor.value.copy(x.specularColor),x.specularColorMap&&(S.specularColorMap.value=x.specularColorMap,t(x.specularColorMap,S.specularColorMapTransform)),x.specularIntensityMap&&(S.specularIntensityMap.value=x.specularIntensityMap,t(x.specularIntensityMap,S.specularIntensityMapTransform))}function M(S,x){x.matcap&&(S.matcap.value=x.matcap)}function T(S,x){const R=e.get(x).light;S.referencePosition.value.setFromMatrixPosition(R.matrixWorld),S.nearDistance.value=R.shadow.camera.near,S.farDistance.value=R.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:a}}function sA(s,e,t,i){let a={},l={},c=[];const d=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function h(A,P){const L=P.program;i.uniformBlockBinding(A,L)}function f(A,P){let L=a[A.id];L===void 0&&(S(A),L=_(A),a[A.id]=L,A.addEventListener("dispose",R));const U=P.program;i.updateUBOMapping(A,U);const b=e.render.frame;l[A.id]!==b&&(g(A),l[A.id]=b)}function _(A){const P=m();A.__bindingPointIndex=P;const L=s.createBuffer(),U=A.__size,b=A.usage;return s.bindBuffer(s.UNIFORM_BUFFER,L),s.bufferData(s.UNIFORM_BUFFER,U,b),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,P,L),L}function m(){for(let A=0;A<d;A++)if(c.indexOf(A)===-1)return c.push(A),A;return Dt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function g(A){const P=a[A.id],L=A.uniforms,U=A.__cache;s.bindBuffer(s.UNIFORM_BUFFER,P);for(let b=0,D=L.length;b<D;b++){const B=L[b];if(Array.isArray(B))for(let V=0,G=B.length;V<G;V++)y(B[V],b,V,U);else y(B,b,0,U)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function y(A,P,L,U){if(T(A,P,L,U)===!0){const b=A.__offset,D=A.value;if(Array.isArray(D)){let B=0;for(let V=0;V<D.length;V++){const G=D[V],J=x(G);M(G,A.__data,B),typeof G!="number"&&typeof G!="boolean"&&!G.isMatrix3&&!ArrayBuffer.isView(G)&&(B+=J.storage/Float32Array.BYTES_PER_ELEMENT)}}else M(D,A.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,b,A.__data)}}function M(A,P,L){typeof A=="number"||typeof A=="boolean"?P[0]=A:A.isMatrix3?(P[0]=A.elements[0],P[1]=A.elements[1],P[2]=A.elements[2],P[3]=0,P[4]=A.elements[3],P[5]=A.elements[4],P[6]=A.elements[5],P[7]=0,P[8]=A.elements[6],P[9]=A.elements[7],P[10]=A.elements[8],P[11]=0):ArrayBuffer.isView(A)?P.set(new A.constructor(A.buffer,A.byteOffset,P.length)):A.toArray(P,L)}function T(A,P,L,U){const b=A.value,D=P+"_"+L;if(U[D]===void 0)return typeof b=="number"||typeof b=="boolean"?U[D]=b:ArrayBuffer.isView(b)?U[D]=b.slice():U[D]=b.clone(),!0;{const B=U[D];if(typeof b=="number"||typeof b=="boolean"){if(B!==b)return U[D]=b,!0}else{if(ArrayBuffer.isView(b))return!0;if(B.equals(b)===!1)return B.copy(b),!0}}return!1}function S(A){const P=A.uniforms;let L=0;const U=16;for(let D=0,B=P.length;D<B;D++){const V=Array.isArray(P[D])?P[D]:[P[D]];for(let G=0,J=V.length;G<J;G++){const H=V[G],Z=Array.isArray(H.value)?H.value:[H.value];for(let he=0,ne=Z.length;he<ne;he++){const ee=Z[he],$=x(ee),K=L%U,F=K%$.boundary,se=K+F;L+=F,se!==0&&U-se<$.storage&&(L+=U-se),H.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),H.__offset=L,L+=$.storage}}}const b=L%U;return b>0&&(L+=U-b),A.__size=L,A.__cache={},this}function x(A){const P={boundary:0,storage:0};return typeof A=="number"||typeof A=="boolean"?(P.boundary=4,P.storage=4):A.isVector2?(P.boundary=8,P.storage=8):A.isVector3||A.isColor?(P.boundary=16,P.storage=12):A.isVector4?(P.boundary=16,P.storage=16):A.isMatrix3?(P.boundary=48,P.storage=48):A.isMatrix4?(P.boundary=64,P.storage=64):A.isTexture?at("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(A)?(P.boundary=16,P.storage=A.byteLength):at("WebGLRenderer: Unsupported uniform value type.",A),P}function R(A){const P=A.target;P.removeEventListener("dispose",R);const L=c.indexOf(P.__bindingPointIndex);c.splice(L,1),s.deleteBuffer(a[P.id]),delete a[P.id],delete l[P.id]}function I(){for(const A in a)s.deleteBuffer(a[A]);c=[],a={},l={}}return{bind:h,update:f,dispose:I}}const aA=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let $i=null;function oA(){return $i===null&&($i=new K_(aA,16,16,Ys,or),$i.name="DFG_LUT",$i.minFilter=Bn,$i.magFilter=Bn,$i.wrapS=Cr,$i.wrapT=Cr,$i.generateMipmaps=!1,$i.needsUpdate=!0),$i}class lA{constructor(e={}){const{canvas:t=fM(),context:i=null,depth:a=!0,stencil:l=!1,alpha:c=!1,antialias:d=!1,premultipliedAlpha:h=!0,preserveDrawingBuffer:f=!1,powerPreference:_="default",failIfMajorPerformanceCaveat:m=!1,reversedDepthBuffer:g=!1,outputBufferType:y=di}=e;this.isWebGLRenderer=!0;let M;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");M=i.getContextAttributes().alpha}else M=c;const T=y,S=new Set([Wf,Gf,Vf]),x=new Set([di,ar,rl,sl,Bf,zf]),R=new Uint32Array(4),I=new Int32Array(4),A=new Y;let P=null,L=null;const U=[],b=[];let D=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=rr,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const B=this;let V=!1,G=null,J=null,H=null,Z=null;this._outputColorSpace=ci;let he=0,ne=0,ee=null,$=-1,K=null;const F=new nn,se=new nn;let Se=null;const Ge=new ut(0);let Be=0,Ve=t.width,ae=t.height,de=1,Ee=null,$e=null;const Fe=new nn(0,0,Ve,ae),dt=new nn(0,0,Ve,ae);let Gt=!1;const ht=new $f;let xt=!1,At=!1;const pt=new Vt,Ut=new Y,Xt=new nn,Ft={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ct=!1;function $t(){return ee===null?de:1}let X=i;function fn(N,j){return t.getContext(N,j)}let Rt,O,w,Q,le,fe,we,Ae,pe,_e,Pe,Ke,Ne,Te,Ze,tt,rt,W,Ce,ge,Re,Oe,xe;try{const N={alpha:!0,depth:a,stencil:l,antialias:d,premultipliedAlpha:h,preserveDrawingBuffer:f,powerPreference:_,failIfMajorPerformanceCaveat:m};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ff}`),t.addEventListener("webglcontextlost",Pt,!1),t.addEventListener("webglcontextrestored",bt,!1),t.addEventListener("webglcontextcreationerror",Tn,!1),X===null){const j="webgl2";if(X=fn(j,N),X===null)throw fn(j)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Je()}catch(N){throw t.removeEventListener("webglcontextlost",Pt,!1),t.removeEventListener("webglcontextrestored",bt,!1),t.removeEventListener("webglcontextcreationerror",Tn,!1),Dt("WebGLRenderer: "+N.message),N}function Je(){Rt=new ob(X),Rt.init(),Re=new QT(X,Rt),O=new Zw(X,Rt,e,Re),w=new KT(X,Rt),O.reversedDepthBuffer&&g&&w.buffers.depth.setReversed(!0),J=X.createFramebuffer(),H=X.createFramebuffer(),Z=X.createFramebuffer(),Q=new ub(X),le=new FT,fe=new ZT(X,Rt,w,le,O,Re,Q),we=new ab(B),Ae=new h1(X),Oe=new $w(X,Ae),pe=new lb(X,Ae,Q,Oe),_e=new hb(X,pe,Ae,Oe,Q),W=new db(X,O,fe),Ze=new Qw(le),Pe=new UT(B,we,Rt,O,Oe,Ze),Ke=new rA(B,le),Ne=new kT,Te=new WT(Rt),rt=new Yw(B,we,w,_e,M,h),tt=new $T(B,_e,O),xe=new sA(X,Q,O,w),Ce=new Kw(X,Rt,Q),ge=new cb(X,Rt,Q),Q.programs=Pe.programs,B.capabilities=O,B.extensions=Rt,B.properties=le,B.renderLists=Ne,B.shadowMap=tt,B.state=w,B.info=Q}T!==di&&(D=new pb(T,t.width,t.height,d,a,l));const qe=new nA(B,X);this.xr=qe,this.getContext=function(){return X},this.getContextAttributes=function(){return X.getContextAttributes()},this.forceContextLoss=function(){const N=Rt.get("WEBGL_lose_context");N&&N.loseContext()},this.forceContextRestore=function(){const N=Rt.get("WEBGL_lose_context");N&&N.restoreContext()},this.getPixelRatio=function(){return de},this.setPixelRatio=function(N){N!==void 0&&(de=N,this.setSize(Ve,ae,!1))},this.getSize=function(N){return N.set(Ve,ae)},this.setSize=function(N,j,ce=!0){if(qe.isPresenting){at("WebGLRenderer: Can't change size while VR device is presenting.");return}Ve=N,ae=j,t.width=Math.floor(N*de),t.height=Math.floor(j*de),ce===!0&&(t.style.width=N+"px",t.style.height=j+"px"),D!==null&&D.setSize(t.width,t.height),this.setViewport(0,0,N,j)},this.getDrawingBufferSize=function(N){return N.set(Ve*de,ae*de).floor()},this.setDrawingBufferSize=function(N,j,ce){Ve=N,ae=j,de=ce,t.width=Math.floor(N*ce),t.height=Math.floor(j*ce),this.setViewport(0,0,N,j)},this.setEffects=function(N){if(T===di){Dt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(N){for(let j=0;j<N.length;j++)if(N[j].isOutputPass===!0){at("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}D.setEffects(N||[])},this.getCurrentViewport=function(N){return N.copy(F)},this.getViewport=function(N){return N.copy(Fe)},this.setViewport=function(N,j,ce,ie){N.isVector4?Fe.set(N.x,N.y,N.z,N.w):Fe.set(N,j,ce,ie),w.viewport(F.copy(Fe).multiplyScalar(de).round())},this.getScissor=function(N){return N.copy(dt)},this.setScissor=function(N,j,ce,ie){N.isVector4?dt.set(N.x,N.y,N.z,N.w):dt.set(N,j,ce,ie),w.scissor(se.copy(dt).multiplyScalar(de).round())},this.getScissorTest=function(){return Gt},this.setScissorTest=function(N){w.setScissorTest(Gt=N)},this.setOpaqueSort=function(N){Ee=N},this.setTransparentSort=function(N){$e=N},this.getClearColor=function(N){return N.copy(rt.getClearColor())},this.setClearColor=function(){rt.setClearColor(...arguments)},this.getClearAlpha=function(){return rt.getClearAlpha()},this.setClearAlpha=function(){rt.setClearAlpha(...arguments)},this.clear=function(N=!0,j=!0,ce=!0){let ie=0;if(N){let te=!1;if(ee!==null){const Ie=ee.texture.format;te=S.has(Ie)}if(te){const Ie=ee.texture.type,Le=x.has(Ie),De=rt.getClearColor(),je=rt.getClearAlpha(),Qe=De.r,ct=De.g,mt=De.b;Le?(R[0]=Qe,R[1]=ct,R[2]=mt,R[3]=je,X.clearBufferuiv(X.COLOR,0,R)):(I[0]=Qe,I[1]=ct,I[2]=mt,I[3]=je,X.clearBufferiv(X.COLOR,0,I))}else ie|=X.COLOR_BUFFER_BIT}j&&(ie|=X.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),ce&&(ie|=X.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),ie!==0&&X.clear(ie)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(N){N.setRenderer(this),G=N},this.dispose=function(){t.removeEventListener("webglcontextlost",Pt,!1),t.removeEventListener("webglcontextrestored",bt,!1),t.removeEventListener("webglcontextcreationerror",Tn,!1),rt.dispose(),Ne.dispose(),Te.dispose(),le.dispose(),we.dispose(),_e.dispose(),Oe.dispose(),xe.dispose(),Pe.dispose(),qe.dispose(),qe.removeEventListener("sessionstart",hl),qe.removeEventListener("sessionend",fl),zn.stop()};function Pt(N){N.preventDefault(),K0("WebGLRenderer: Context Lost."),V=!0}function bt(){K0("WebGLRenderer: Context Restored."),V=!1;const N=Q.autoReset,j=tt.enabled,ce=tt.autoUpdate,ie=tt.needsUpdate,te=tt.type;Je(),Q.autoReset=N,tt.enabled=j,tt.autoUpdate=ce,tt.needsUpdate=ie,tt.type=te}function Tn(N){Dt("WebGLRenderer: A WebGL context could not be created. Reason: ",N.statusMessage)}function hi(N){const j=N.target;j.removeEventListener("dispose",hi),ps(j)}function ps(N){Zs(N),le.remove(N)}function Zs(N){const j=le.get(N).programs;j!==void 0&&(j.forEach(function(ce){Pe.releaseProgram(ce)}),N.isShaderMaterial&&Pe.releaseShaderCache(N))}this.renderBufferDirect=function(N,j,ce,ie,te,Ie){j===null&&(j=Ft);const Le=te.isMesh&&te.matrixWorld.determinantAffine()<0,De=Qt(N,j,ce,ie,te);w.setMaterial(ie,Le);let je=ce.index,Qe=1;if(ie.wireframe===!0){if(je=pe.getWireframeAttribute(ce),je===void 0)return;Qe=2}const ct=ce.drawRange,mt=ce.attributes.position;let He=ct.start*Qe,Mt=(ct.start+ct.count)*Qe;Ie!==null&&(He=Math.max(He,Ie.start*Qe),Mt=Math.min(Mt,(Ie.start+Ie.count)*Qe)),je!==null?(He=Math.max(He,0),Mt=Math.min(Mt,je.count)):mt!=null&&(He=Math.max(He,0),Mt=Math.min(Mt,mt.count));const sn=Mt-He;if(sn<0||sn===1/0)return;Oe.setup(te,ie,De,ce,je);let Wt,It=Ce;if(je!==null&&(Wt=Ae.get(je),It=ge,It.setIndex(Wt)),te.isMesh)ie.wireframe===!0?(w.setLineWidth(ie.wireframeLinewidth*$t()),It.setMode(X.LINES)):It.setMode(X.TRIANGLES);else if(te.isLine){let pn=ie.linewidth;pn===void 0&&(pn=1),w.setLineWidth(pn*$t()),te.isLineSegments?It.setMode(X.LINES):te.isLineLoop?It.setMode(X.LINE_LOOP):It.setMode(X.LINE_STRIP)}else te.isPoints?It.setMode(X.POINTS):te.isSprite&&It.setMode(X.TRIANGLES);if(te.isBatchedMesh)if(Rt.get("WEBGL_multi_draw"))It.renderMultiDraw(te._multiDrawStarts,te._multiDrawCounts,te._multiDrawCount);else{const pn=te._multiDrawStarts,ke=te._multiDrawCounts,ln=te._multiDrawCount,Et=je?Ae.get(je).bytesPerElement:1,Pn=le.get(ie).currentProgram.getUniforms();for(let gt=0;gt<ln;gt++)Pn.setValue(X,"_gl_DrawID",gt),It.render(pn[gt]/Et,ke[gt])}else if(te.isInstancedMesh)It.renderInstances(He,sn,te.count);else if(ce.isInstancedBufferGeometry){const pn=ce._maxInstanceCount!==void 0?ce._maxInstanceCount:1/0,ke=Math.min(ce.instanceCount,pn);It.renderInstances(He,sn,ke)}else It.render(He,sn)};function ms(N,j,ce,ie){G!==null&&N.isNodeMaterial&&G.setObject(ie,N),xt===!0&&Ze.setState(N,ce,!1),N.transparent===!0&&N.side===tr&&N.forceSinglePass===!1?(N.side=ti,N.needsUpdate=!0,xs(N,j,ie),N.side=Xs,N.needsUpdate=!0,xs(N,j,ie),N.side=tr):xs(N,j,ie)}this.compile=function(N,j,ce=null){ce===null&&(ce=N),G!==null&&G.renderStart(N,j,ce),L=Te.get(ce),L.init(j),b.push(L),ce.traverseVisible(function(te){te.isLight&&te.layers.test(j.layers)&&(L.pushLight(te),te.castShadow&&L.pushShadow(te))}),N!==ce&&N.traverseVisible(function(te){te.isLight&&te.layers.test(j.layers)&&(L.pushLight(te),te.castShadow&&L.pushShadow(te))}),L.setupLights(),G!==null&&G.updateLights(L.state.lightsArray),At=this.localClippingEnabled,xt=Ze.init(this.clippingPlanes,At),xt===!0&&Ze.setGlobalState(this.clippingPlanes,j),G!==null&&tt.render(L.state.shadowsArray,ce,j);const ie=new Set;return N.traverse(function(te){if(!(te.isMesh||te.isPoints||te.isLine||te.isSprite))return;const Ie=te.material;if(Ie)if(Array.isArray(Ie))for(let Le=0;Le<Ie.length;Le++){const De=Ie[Le];ms(De,ce,j,te),ie.add(De)}else ms(Ie,ce,j,te),ie.add(Ie)}),L=b.pop(),G!==null&&G.renderEnd(),ie},this.compileAsync=function(N,j,ce=null){const ie=this.compile(N,j,ce);return new Promise(te=>{function Ie(){if(ie.forEach(function(Le){const je=le.get(Le).currentProgram;(je===void 0||je.isReady())&&ie.delete(Le)}),ie.size===0){te(N);return}setTimeout(Ie,10)}Rt.get("KHR_parallel_shader_compile")!==null?Ie():setTimeout(Ie,10)})};let gs=null;function xu(N){gs&&gs(N)}function hl(){zn.stop()}function fl(){zn.start()}const zn=new nx;zn.setAnimationLoop(xu),typeof self<"u"&&zn.setContext(self),this.setAnimationLoop=function(N){gs=N,qe.setAnimationLoop(N),N===null?zn.stop():zn.start()},qe.addEventListener("sessionstart",hl),qe.addEventListener("sessionend",fl),this.render=function(N,j){if(j!==void 0&&j.isCamera!==!0){Dt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(V===!0)return;G!==null&&G.renderStart(N,j);const ce=qe.enabled===!0&&qe.isPresenting===!0,ie=D!==null&&(ee===null||ce)&&D.begin(B,ee);if(N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),j.parent===null&&j.matrixWorldAutoUpdate===!0&&j.updateMatrixWorld(),qe.enabled===!0&&qe.isPresenting===!0&&(D===null||D.isCompositing()===!1)&&(qe.cameraAutoUpdate===!0&&qe.updateCamera(j),j=qe.getCamera()),N.isScene===!0&&N.onBeforeRender(B,N,j,ee),L=Te.get(N,b.length),L.init(j),L.state.textureUnits=fe.getTextureUnits(),b.push(L),pt.multiplyMatrices(j.projectionMatrix,j.matrixWorldInverse),ht.setFromProjectionMatrix(pt,nr,j.reversedDepth),At=this.localClippingEnabled,xt=Ze.init(this.clippingPlanes,At),P=Ne.get(N,U.length),P.init(),U.push(P),qe.enabled===!0&&qe.isPresenting===!0){const Le=B.xr.getDepthSensingMesh();Le!==null&&Qs(Le,j,-1/0,B.sortObjects)}Qs(N,j,0,B.sortObjects),P.finish(),G!==null&&G.updateLights(L.state.lightsArray),B.sortObjects===!0&&P.sort(Ee,$e),Ct=qe.enabled===!1||qe.isPresenting===!1||qe.hasDepthSensing()===!1,Ct&&rt.addToRenderList(P,N),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),xt===!0&&Ze.beginShadows();const te=L.state.shadowsArray;if(tt.render(te,N,j),xt===!0&&Ze.endShadows(),(ie&&D.hasRenderPass())===!1){const Le=P.opaque,De=P.transmissive;if(L.setupLights(),j.isArrayCamera){const je=j.cameras;if(De.length>0)for(let Qe=0,ct=je.length;Qe<ct;Qe++){const mt=je[Qe];pl(Le,De,N,mt)}Ct&&rt.render(N);for(let Qe=0,ct=je.length;Qe<ct;Qe++){const mt=je[Qe];to(P,N,mt,mt.viewport)}}else De.length>0&&pl(Le,De,N,j),Ct&&rt.render(N),to(P,N,j)}ee!==null&&ne===0&&(fe.updateMultisampleRenderTarget(ee),fe.updateRenderTargetMipmap(ee)),ie&&D.end(B),N.isScene===!0&&N.onAfterRender(B,N,j),Oe.resetDefaultState(),$=-1,K=null,b.pop(),b.length>0?(L=b[b.length-1],fe.setTextureUnits(L.state.textureUnits),xt===!0&&Ze.setGlobalState(B.clippingPlanes,L.state.camera)):L=null,U.pop(),U.length>0?P=U[U.length-1]:P=null,G!==null&&G.renderEnd()};function Qs(N,j,ce,ie){if(N.visible===!1)return;if(N.layers.test(j.layers)){if(N.isGroup)ce=N.renderOrder;else if(N.isLOD)N.autoUpdate===!0&&N.update(j);else if(N.isLightProbeGrid)L.pushLightProbeGrid(N);else if(N.isLight)L.pushLight(N),N.castShadow&&L.pushShadow(N);else if(N.isSprite){if(!N.frustumCulled||N.intersectsFrustum(ht)){ie&&Xt.setFromMatrixPosition(N.matrixWorld).applyMatrix4(pt);const Le=_e.update(N),De=N.material;De.visible&&P.push(N,Le,De,ce,Xt.z,null,j)}}else if((N.isMesh||N.isLine||N.isPoints)&&(!N.frustumCulled||N.intersectsFrustum(ht))){const Le=_e.update(N),De=N.material;if(ie&&(N.boundingSphere!==void 0?(N.boundingSphere===null&&N.computeBoundingSphere(),Xt.copy(N.boundingSphere.center)):(Le.boundingSphere===null&&Le.computeBoundingSphere(),Xt.copy(Le.boundingSphere.center)),Xt.applyMatrix4(N.matrixWorld).applyMatrix4(pt)),Array.isArray(De)){const je=Le.groups;for(let Qe=0,ct=je.length;Qe<ct;Qe++){const mt=je[Qe],He=De[mt.materialIndex];He&&He.visible&&P.push(N,Le,He,ce,Xt.z,mt,j)}}else De.visible&&P.push(N,Le,De,ce,Xt.z,null,j)}}const Ie=N.children;for(let Le=0,De=Ie.length;Le<De;Le++)Qs(Ie[Le],j,ce,ie)}function to(N,j,ce,ie){const{opaque:te,transmissive:Ie,transparent:Le}=N;L.setupLightsView(ce),xt===!0&&Ze.setGlobalState(B.clippingPlanes,ce),ie&&w.viewport(F.copy(ie)),te.length>0&&_s(te,j,ce),Ie.length>0&&_s(Ie,j,ce),Le.length>0&&_s(Le,j,ce),w.buffers.depth.setTest(!0),w.buffers.depth.setMask(!0),w.buffers.color.setMask(!0),w.setPolygonOffset(!1)}function pl(N,j,ce,ie){if((ce.isScene===!0?ce.overrideMaterial:null)!==null)return;if(L.state.transmissionRenderTarget[ie.id]===void 0){const He=Rt.has("EXT_color_buffer_half_float")||Rt.has("EXT_color_buffer_float");L.state.transmissionRenderTarget[ie.id]=new Gi(1,1,{generateMipmaps:!0,type:He?or:di,minFilter:Os,samples:Math.max(4,O.samples),stencilBuffer:l,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:wt.workingColorSpace})}const Ie=L.state.transmissionRenderTarget[ie.id],Le=ie.viewport||F;Ie.setSize(Le.z*B.transmissionResolutionScale,Le.w*B.transmissionResolutionScale);const De=B.getRenderTarget(),je=B.getActiveCubeFace(),Qe=B.getActiveMipmapLevel();B.setRenderTarget(Ie),B.getClearColor(Ge),Be=B.getClearAlpha(),Be<1&&B.setClearColor(16777215,.5),B.clear(),Ct&&rt.render(ce);const ct=B.toneMapping;B.toneMapping=rr;const mt=ie.viewport;if(ie.viewport!==void 0&&(ie.viewport=void 0),L.setupLightsView(ie),xt===!0&&Ze.setGlobalState(B.clippingPlanes,ie),_s(N,ce,ie),fe.updateMultisampleRenderTarget(Ie),fe.updateRenderTargetMipmap(Ie),Rt.has("WEBGL_multisampled_render_to_texture")===!1){let He=!1;for(let Mt=0,sn=j.length;Mt<sn;Mt++){const Wt=j[Mt],{object:It,geometry:pn,material:ke,group:ln}=Wt;if(ke.side===tr&&It.layers.test(ie.layers)){const Et=ke.side;ke.side=ti,ke.needsUpdate=!0,no(It,ce,ie,pn,ke,ln),ke.side=Et,ke.needsUpdate=!0,He=!0}}He===!0&&(fe.updateMultisampleRenderTarget(Ie),fe.updateRenderTargetMipmap(Ie))}B.setRenderTarget(De,je,Qe),B.setClearColor(Ge,Be),mt!==void 0&&(ie.viewport=mt),B.toneMapping=ct}function _s(N,j,ce){const ie=j.isScene===!0?j.overrideMaterial:null;for(let te=0,Ie=N.length;te<Ie;te++){const Le=N[te],{object:De,geometry:je,group:Qe}=Le;let ct=Le.material;ct.allowOverride===!0&&ie!==null&&(ct=ie),De.layers.test(ce.layers)&&no(De,j,ce,je,ct,Qe)}}function no(N,j,ce,ie,te,Ie){G!==null&&te.isNodeMaterial&&G.setObject(N,te),N.onBeforeRender(B,j,ce,ie,te,Ie),N.modelViewMatrix.multiplyMatrices(ce.matrixWorldInverse,N.matrixWorld),N.normalMatrix.getNormalMatrix(N.modelViewMatrix),te.onBeforeRender(B,j,ce,ie,N,Ie),te.transparent===!0&&te.side===tr&&te.forceSinglePass===!1?(te.side=ti,te.needsUpdate=!0,B.renderBufferDirect(ce,j,ie,te,N,Ie),te.side=Xs,te.needsUpdate=!0,B.renderBufferDirect(ce,j,ie,te,N,Ie),te.side=tr):B.renderBufferDirect(ce,j,ie,te,N,Ie),N.onAfterRender(B,j,ce,ie,te,Ie)}function xs(N,j,ce){j.isScene!==!0&&(j=Ft);const ie=le.get(N),te=L.state.lights,Ie=L.state.shadowsArray,Le=te.state.version,De=Pe.getParameters(N,te.state,Ie,j,ce,L.state.lightProbeGridArray),je=Pe.getProgramCacheKey(De);let Qe=ie.programs;ie.environment=N.isMeshStandardMaterial||N.isMeshLambertMaterial||N.isMeshPhongMaterial?j.environment:null,ie.fog=j.fog;const ct=N.isMeshStandardMaterial||N.isMeshLambertMaterial&&!N.envMap||N.isMeshPhongMaterial&&!N.envMap;ie.envMap=we.get(N.envMap||ie.environment,ct),ie.envMapRotation=ie.environment!==null&&N.envMap===null?j.environmentRotation:N.envMapRotation,Qe===void 0&&(N.addEventListener("dispose",hi),Qe=new Map,ie.programs=Qe);let mt=Qe.get(je);if(mt!==void 0){if(ie.currentProgram===mt&&ie.lightsStateVersion===Le)return ml(N,De),mt}else De.uniforms=Pe.getUniforms(N),G!==null&&N.isNodeMaterial&&G.build(N,ce,De),N.onBeforeCompile(De,B),mt=Pe.acquireProgram(De,je),Qe.set(je,mt),ie.uniforms=De.uniforms;const He=ie.uniforms;return(!N.isShaderMaterial&&!N.isRawShaderMaterial||N.clipping===!0)&&(He.clippingPlanes=Ze.uniform),ml(N,De),ie.needsLights=ro(N),ie.lightsStateVersion=Le,ie.needsLights&&(He.ambientLightColor.value=te.state.ambient,He.lightProbe.value=te.state.probe,He.sunLights.value=te.state.sun,He.sunLightShadows.value=te.state.sunShadow,He.directionalLights.value=te.state.directional,He.directionalLightShadows.value=te.state.directionalShadow,He.spotLights.value=te.state.spot,He.spotLightShadows.value=te.state.spotShadow,He.rectAreaLights.value=te.state.rectArea,He.ltc_1.value=te.state.rectAreaLTC1,He.ltc_2.value=te.state.rectAreaLTC2,He.pointLights.value=te.state.point,He.pointLightShadows.value=te.state.pointShadow,He.hemisphereLights.value=te.state.hemi,He.sunShadowMatrix.value=te.state.sunShadowMatrix,He.sunShadowCascade.value=te.state.sunShadowCascade,He.directionalShadowMatrix.value=te.state.directionalShadowMatrix,He.spotLightMatrix.value=te.state.spotLightMatrix,He.spotLightMap.value=te.state.spotLightMap,He.pointShadowMatrix.value=te.state.pointShadowMatrix),ie.lightProbeGrid=L.state.lightProbeGridArray.length>0,ie.currentProgram=mt,ie.uniformsList=null,mt}function io(N){if(N.uniformsList===null){const j=N.currentProgram.getUniforms();N.uniformsList=Jc.seqWithValue(j.seq,N.uniforms)}return N.uniformsList}function ml(N,j){const ce=le.get(N);ce.outputColorSpace=j.outputColorSpace,ce.batching=j.batching,ce.batchingColor=j.batchingColor,ce.instancing=j.instancing,ce.instancingColor=j.instancingColor,ce.instancingMorph=j.instancingMorph,ce.skinning=j.skinning,ce.morphTargets=j.morphTargets,ce.morphNormals=j.morphNormals,ce.morphColors=j.morphColors,ce.morphTargetsCount=j.morphTargetsCount,ce.numClippingPlanes=j.numClippingPlanes,ce.numIntersection=j.numClipIntersection,ce.vertexAlphas=j.vertexAlphas,ce.vertexTangents=j.vertexTangents,ce.toneMapping=j.toneMapping}function vu(N,j){if(N.length===0)return null;if(N.length===1)return N[0].texture!==null?N[0]:null;A.setFromMatrixPosition(j.matrixWorld);for(let ce=0,ie=N.length;ce<ie;ce++){const te=N[ce];if(te.texture!==null&&te.boundingBox.containsPoint(A))return te}return null}function Qt(N,j,ce,ie,te){j.isScene!==!0&&(j=Ft),fe.resetTextureUnits();const Ie=j.fog,Le=ie.isMeshStandardMaterial||ie.isMeshLambertMaterial||ie.isMeshPhongMaterial?j.environment:null,De=ee===null?B.outputColorSpace:ee.isXRRenderTarget===!0?ee.texture.colorSpace:wt.workingColorSpace,je=ie.isMeshStandardMaterial||ie.isMeshLambertMaterial&&!ie.envMap||ie.isMeshPhongMaterial&&!ie.envMap,Qe=we.get(ie.envMap||Le,je),ct=ie.vertexColors===!0&&!!ce.attributes.color&&ce.attributes.color.itemSize===4,mt=!!ce.attributes.tangent&&(!!ie.normalMap||ie.anisotropy>0),He=!!ce.morphAttributes.position,Mt=!!ce.morphAttributes.normal,sn=!!ce.morphAttributes.color;let Wt=rr;ie.toneMapped&&(ee===null||ee.isXRRenderTarget===!0)&&(Wt=B.toneMapping);const It=ce.morphAttributes.position||ce.morphAttributes.normal||ce.morphAttributes.color,pn=It!==void 0?It.length:0,ke=le.get(ie),ln=L.state.lights;if(xt===!0&&(At===!0||N!==K)){const Ot=N===K&&ie.id===$;Ze.setState(ie,N,Ot)}let Et=!1;ie.version===ke.__version?(ke.needsLights&&ke.lightsStateVersion!==ln.state.version||ke.outputColorSpace!==De||te.isBatchedMesh&&ke.batching===!1||!te.isBatchedMesh&&ke.batching===!0||te.isBatchedMesh&&ke.batchingColor===!0&&te._colorsTexture===null||te.isBatchedMesh&&ke.batchingColor===!1&&te._colorsTexture!==null||te.isInstancedMesh&&ke.instancing===!1||!te.isInstancedMesh&&ke.instancing===!0||te.isSkinnedMesh&&ke.skinning===!1||!te.isSkinnedMesh&&ke.skinning===!0||te.isInstancedMesh&&ke.instancingColor===!0&&te.instanceColor===null||te.isInstancedMesh&&ke.instancingColor===!1&&te.instanceColor!==null||te.isInstancedMesh&&ke.instancingMorph===!0&&te.morphTexture===null||te.isInstancedMesh&&ke.instancingMorph===!1&&te.morphTexture!==null||ke.envMap!==Qe||ie.fog===!0&&ke.fog!==Ie||ke.numClippingPlanes!==void 0&&(ke.numClippingPlanes!==Ze.numPlanes||ke.numIntersection!==Ze.numIntersection)||ke.vertexAlphas!==ct||ke.vertexTangents!==mt||ke.morphTargets!==He||ke.morphNormals!==Mt||ke.morphColors!==sn||ke.toneMapping!==Wt||ke.morphTargetsCount!==pn||!!ke.lightProbeGrid!=L.state.lightProbeGridArray.length>0)&&(Et=!0):(Et=!0,ke.__version=ie.version);let Pn=ke.currentProgram;Et===!0&&(Pn=xs(ie,j,te),G&&ie.isNodeMaterial&&G.onUpdateProgram(ie,Pn,ke));let gt=!1,wi=!1,ur=!1;const Nt=Pn.getUniforms(),Kt=ke.uniforms;if(w.useProgram(Pn.program)&&(gt=!0,wi=!0,ur=!0),ie.id!==$&&($=ie.id,wi=!0),ke.needsLights){const Ot=vu(L.state.lightProbeGridArray,te);ke.lightProbeGrid!==Ot&&(ke.lightProbeGrid=Ot,wi=!0)}if(gt||K!==N){w.buffers.depth.getReversed()&&N.reversedDepth!==!0&&(N._reversedDepth=!0,N.updateProjectionMatrix()),Nt.setValue(X,"projectionMatrix",N.projectionMatrix),Nt.setValue(X,"viewMatrix",N.matrixWorldInverse);const fi=Nt.map.cameraPosition;fi!==void 0&&fi.setValue(X,Ut.setFromMatrixPosition(N.matrixWorld)),O.logarithmicDepthBuffer&&Nt.setValue(X,"logDepthBufFC",2/(Math.log(N.far+1)/Math.LN2)),(ie.isMeshPhongMaterial||ie.isMeshToonMaterial||ie.isMeshLambertMaterial||ie.isMeshBasicMaterial||ie.isMeshStandardMaterial||ie.isShaderMaterial)&&Nt.setValue(X,"isOrthographic",N.isOrthographicCamera===!0),K!==N&&(K=N,wi=!0,ur=!0)}if(ke.needsLights&&(ln.state.sunShadowMap.length>0&&Nt.setValue(X,"sunShadowMap",ln.state.sunShadowMap,fe),ln.state.directionalShadowMap.length>0&&Nt.setValue(X,"directionalShadowMap",ln.state.directionalShadowMap,fe),ln.state.spotShadowMap.length>0&&Nt.setValue(X,"spotShadowMap",ln.state.spotShadowMap,fe),ln.state.pointShadowMap.length>0&&Nt.setValue(X,"pointShadowMap",ln.state.pointShadowMap,fe)),te.isSkinnedMesh){Nt.setOptional(X,te,"bindMatrix"),Nt.setOptional(X,te,"bindMatrixInverse");const Ot=te.skeleton;Ot&&(Ot.boneTexture===null&&Ot.computeBoneTexture(),Nt.setValue(X,"boneTexture",Ot.boneTexture,fe))}te.isBatchedMesh&&(Nt.setOptional(X,te,"batchingTexture"),Nt.setValue(X,"batchingTexture",te._matricesTexture,fe),Nt.setOptional(X,te,"batchingIdTexture"),Nt.setValue(X,"batchingIdTexture",te._indirectTexture,fe),Nt.setOptional(X,te,"batchingColorTexture"),te._colorsTexture!==null&&Nt.setValue(X,"batchingColorTexture",te._colorsTexture,fe));const bi=ce.morphAttributes;if((bi.position!==void 0||bi.normal!==void 0||bi.color!==void 0)&&W.update(te,ce,Pn),(wi||ke.receiveShadow!==te.receiveShadow)&&(ke.receiveShadow=te.receiveShadow,Nt.setValue(X,"receiveShadow",te.receiveShadow)),(ie.isMeshStandardMaterial||ie.isMeshLambertMaterial||ie.isMeshPhongMaterial)&&ie.envMap===null&&j.environment!==null&&(Kt.envMapIntensity.value=j.environmentIntensity),Kt.dfgLUT!==void 0&&(Kt.dfgLUT.value=oA()),wi){if(Nt.setValue(X,"toneMappingExposure",B.toneMappingExposure),ke.needsLights&&yu(Kt,ur),Ie&&ie.fog===!0&&Ke.refreshFogUniforms(Kt,Ie),Ke.refreshMaterialUniforms(Kt,ie,de,ae,L.state.transmissionRenderTarget[N.id]),ke.needsLights&&ke.lightProbeGrid){const Ot=ke.lightProbeGrid;Kt.probesSH.value=Ot.texture,Kt.probesMin.value.copy(Ot.boundingBox.min),Kt.probesMax.value.copy(Ot.boundingBox.max),Kt.probesResolution.value.copy(Ot.resolution)}Jc.upload(X,io(ke),Kt,fe)}if(ie.isShaderMaterial&&ie.uniformsNeedUpdate===!0&&(Jc.upload(X,io(ke),Kt,fe),ie.uniformsNeedUpdate=!1),ie.isSpriteMaterial&&Nt.setValue(X,"center",te.center),Nt.setValue(X,"modelViewMatrix",te.modelViewMatrix),Nt.setValue(X,"normalMatrix",te.normalMatrix),Nt.setValue(X,"modelMatrix",te.matrixWorld),ie.uniformsGroups!==void 0){const Ot=ie.uniformsGroups;for(let fi=0,Ti=Ot.length;fi<Ti;fi++){const Ai=Ot[fi];xe.update(Ai,Pn),xe.bind(Ai,Pn)}}return Pn}function yu(N,j){N.ambientLightColor.needsUpdate=j,N.lightProbe.needsUpdate=j,N.sunLights.needsUpdate=j,N.sunLightShadows.needsUpdate=j,N.directionalLights.needsUpdate=j,N.directionalLightShadows.needsUpdate=j,N.pointLights.needsUpdate=j,N.pointLightShadows.needsUpdate=j,N.spotLights.needsUpdate=j,N.spotLightShadows.needsUpdate=j,N.rectAreaLights.needsUpdate=j,N.hemisphereLights.needsUpdate=j}function ro(N){return N.isMeshLambertMaterial||N.isMeshToonMaterial||N.isMeshPhongMaterial||N.isMeshStandardMaterial||N.isShadowMaterial||N.isShaderMaterial&&N.lights===!0}this.getActiveCubeFace=function(){return he},this.getActiveMipmapLevel=function(){return ne},this.getRenderTarget=function(){return ee},this.setRenderTargetTextures=function(N,j,ce){const ie=le.get(N);ie.__autoAllocateDepthBuffer=N.resolveDepthBuffer===!1,ie.__autoAllocateDepthBuffer===!1&&(ie.__useRenderToTexture=!1),le.get(N.texture).__webglTexture=j,le.get(N.depthTexture).__webglTexture=ie.__autoAllocateDepthBuffer?void 0:ce,ie.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(N,j){const ce=le.get(N);ce.__webglFramebuffer=j,ce.__useDefaultFramebuffer=j===void 0},this.setRenderTarget=function(N,j=0,ce=0){ee=N,he=j,ne=ce;let ie=null,te=!1,Ie=!1;if(N){const De=le.get(N);if(De.__useDefaultFramebuffer!==void 0){w.bindFramebuffer(X.FRAMEBUFFER,De.__webglFramebuffer),F.copy(N.viewport),se.copy(N.scissor),Se=N.scissorTest,w.viewport(F),w.scissor(se),w.setScissorTest(Se),$=-1;return}else if(De.__webglFramebuffer===void 0)fe.setupRenderTarget(N);else if(De.__hasExternalTextures)fe.rebindTextures(N,le.get(N.texture).__webglTexture,le.get(N.depthTexture).__webglTexture);else if(N.depthBuffer){const ct=N.depthTexture;if(De.__boundDepthTexture!==ct){if(ct!==null&&le.has(ct)&&(N.width!==ct.image.width||N.height!==ct.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");fe.setupDepthRenderbuffer(N)}}const je=N.texture;(je.isData3DTexture||je.isDataArrayTexture||je.isCompressedArrayTexture)&&(Ie=!0);const Qe=le.get(N).__webglFramebuffer;N.isWebGLCubeRenderTarget?(Array.isArray(Qe[j])?ie=Qe[j][ce]:ie=Qe[j],te=!0):N.samples>0&&fe.useMultisampledRTT(N)===!1?ie=le.get(N).__webglMultisampledFramebuffer:Array.isArray(Qe)?ie=Qe[ce]:ie=Qe,F.copy(N.viewport),se.copy(N.scissor),Se=N.scissorTest}else F.copy(Fe).multiplyScalar(de).floor(),se.copy(dt).multiplyScalar(de).floor(),Se=Gt;if(ce!==0&&(ie=J),w.bindFramebuffer(X.FRAMEBUFFER,ie)&&w.drawBuffers(N,ie),w.viewport(F),w.scissor(se),w.setScissorTest(Se),te){const De=le.get(N.texture);X.framebufferTexture2D(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0,X.TEXTURE_CUBE_MAP_POSITIVE_X+j,De.__webglTexture,ce)}else if(Ie){const De=j;for(let je=0;je<N.textures.length;je++){const Qe=le.get(N.textures[je]);X.framebufferTextureLayer(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0+je,Qe.__webglTexture,ce,De)}}else if(N!==null&&ce!==0){const De=le.get(N.texture);X.framebufferTexture2D(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0,X.TEXTURE_2D,De.__webglTexture,ce)}$=-1};function so(N){const j=le.get(N);return(j.__readFormat!==N.format||j.__readType!==N.type)&&(j.__readFormat=N.format,j.__readType=N.type,j.__formatReadable=O.textureFormatReadable(N.format),j.__typeReadable=O.textureTypeReadable(N.type)),j}this.readRenderTargetPixels=function(N,j,ce,ie,te,Ie,Le,De=0){if(!(N&&N.isWebGLRenderTarget)){Dt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let je=le.get(N).__webglFramebuffer;if(N.isWebGLCubeRenderTarget&&Le!==void 0&&(je=je[Le]),je){w.bindFramebuffer(X.FRAMEBUFFER,je);try{const Qe=N.textures[De],ct=Qe.format,mt=Qe.type;N.textures.length>1&&X.readBuffer(X.COLOR_ATTACHMENT0+De);const He=so(Qe);if(He.__formatReadable===!1){Dt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(He.__typeReadable===!1){Dt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}j>=0&&j<=N.width-ie&&ce>=0&&ce<=N.height-te&&X.readPixels(j,ce,ie,te,Re.convert(ct),Re.convert(mt),Ie)}finally{const Qe=ee!==null?le.get(ee).__webglFramebuffer:null;w.bindFramebuffer(X.FRAMEBUFFER,Qe)}}},this.readRenderTargetPixelsAsync=async function(N,j,ce,ie,te,Ie,Le,De=0){if(!(N&&N.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let je=le.get(N).__webglFramebuffer;if(N.isWebGLCubeRenderTarget&&Le!==void 0&&(je=je[Le]),je)if(j>=0&&j<=N.width-ie&&ce>=0&&ce<=N.height-te){w.bindFramebuffer(X.FRAMEBUFFER,je);const Qe=N.textures[De],ct=Qe.format,mt=Qe.type;N.textures.length>1&&X.readBuffer(X.COLOR_ATTACHMENT0+De);const He=so(Qe);if(He.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(He.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Mt=X.createBuffer();X.bindBuffer(X.PIXEL_PACK_BUFFER,Mt),X.bufferData(X.PIXEL_PACK_BUFFER,Ie.byteLength,X.STREAM_READ),X.readPixels(j,ce,ie,te,Re.convert(ct),Re.convert(mt),0),X.bindBuffer(X.PIXEL_PACK_BUFFER,null);const sn=ee!==null?le.get(ee).__webglFramebuffer:null;w.bindFramebuffer(X.FRAMEBUFFER,sn);const Wt=X.fenceSync(X.SYNC_GPU_COMMANDS_COMPLETE,0);return X.flush(),await pM(X,Wt,4),X.bindBuffer(X.PIXEL_PACK_BUFFER,Mt),X.getBufferSubData(X.PIXEL_PACK_BUFFER,0,Ie),X.bindBuffer(X.PIXEL_PACK_BUFFER,null),X.deleteBuffer(Mt),X.deleteSync(Wt),Ie}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(N,j=null,ce=0){const ie=Math.pow(2,-ce),te=Math.floor(N.image.width*ie),Ie=Math.floor(N.image.height*ie),Le=j!==null?j.x:0,De=j!==null?j.y:0;fe.setTexture2D(N,0),X.copyTexSubImage2D(X.TEXTURE_2D,ce,0,0,Le,De,te,Ie),w.unbindTexture()},this.copyTextureToTexture=function(N,j,ce=null,ie=null,te=0,Ie=0){let Le,De,je,Qe,ct,mt,He,Mt,sn;const Wt=N.isCompressedTexture?N.mipmaps[Ie]:N.image;if(ce!==null)Le=ce.max.x-ce.min.x,De=ce.max.y-ce.min.y,je=ce.isBox3?ce.max.z-ce.min.z:1,Qe=ce.min.x,ct=ce.min.y,mt=ce.isBox3?ce.min.z:0;else{const Kt=Math.pow(2,-te);Le=Math.floor(Wt.width*Kt),De=Math.floor(Wt.height*Kt),N.isDataArrayTexture?je=Wt.depth:N.isData3DTexture?je=Math.floor(Wt.depth*Kt):je=1,Qe=0,ct=0,mt=0}ie!==null?(He=ie.x,Mt=ie.y,sn=ie.z):(He=0,Mt=0,sn=0);const It=Re.convert(j.format),pn=Re.convert(j.type);let ke;j.isData3DTexture?(fe.setTexture3D(j,0),ke=X.TEXTURE_3D):j.isDataArrayTexture||j.isCompressedArrayTexture?(fe.setTexture2DArray(j,0),ke=X.TEXTURE_2D_ARRAY):(fe.setTexture2D(j,0),ke=X.TEXTURE_2D),w.activeTexture(X.TEXTURE0),w.pixelStorei(X.UNPACK_FLIP_Y_WEBGL,j.flipY),w.pixelStorei(X.UNPACK_PREMULTIPLY_ALPHA_WEBGL,j.premultiplyAlpha),w.pixelStorei(X.UNPACK_ALIGNMENT,j.unpackAlignment);const ln=w.getParameter(X.UNPACK_ROW_LENGTH),Et=w.getParameter(X.UNPACK_IMAGE_HEIGHT),Pn=w.getParameter(X.UNPACK_SKIP_PIXELS),gt=w.getParameter(X.UNPACK_SKIP_ROWS),wi=w.getParameter(X.UNPACK_SKIP_IMAGES);w.pixelStorei(X.UNPACK_ROW_LENGTH,Wt.width),w.pixelStorei(X.UNPACK_IMAGE_HEIGHT,Wt.height),w.pixelStorei(X.UNPACK_SKIP_PIXELS,Qe),w.pixelStorei(X.UNPACK_SKIP_ROWS,ct),w.pixelStorei(X.UNPACK_SKIP_IMAGES,mt);const ur=N.isDataArrayTexture||N.isData3DTexture,Nt=j.isDataArrayTexture||j.isData3DTexture;if(N.isDepthTexture){const Kt=le.get(N),bi=le.get(j),Ot=le.get(Kt.__renderTarget),fi=le.get(bi.__renderTarget);w.bindFramebuffer(X.READ_FRAMEBUFFER,Ot.__webglFramebuffer),w.bindFramebuffer(X.DRAW_FRAMEBUFFER,fi.__webglFramebuffer);for(let Ti=0;Ti<je;Ti++)ur&&(X.framebufferTextureLayer(X.READ_FRAMEBUFFER,X.COLOR_ATTACHMENT0,le.get(N).__webglTexture,te,mt+Ti),X.framebufferTextureLayer(X.DRAW_FRAMEBUFFER,X.COLOR_ATTACHMENT0,le.get(j).__webglTexture,Ie,sn+Ti)),X.blitFramebuffer(Qe,ct,Le,De,He,Mt,Le,De,X.DEPTH_BUFFER_BIT,X.NEAREST);w.bindFramebuffer(X.READ_FRAMEBUFFER,null),w.bindFramebuffer(X.DRAW_FRAMEBUFFER,null)}else if(te!==0||N.isRenderTargetTexture||le.has(N)){const Kt=le.get(N),bi=le.get(j);w.bindFramebuffer(X.READ_FRAMEBUFFER,H),w.bindFramebuffer(X.DRAW_FRAMEBUFFER,Z);for(let Ot=0;Ot<je;Ot++)ur?X.framebufferTextureLayer(X.READ_FRAMEBUFFER,X.COLOR_ATTACHMENT0,Kt.__webglTexture,te,mt+Ot):X.framebufferTexture2D(X.READ_FRAMEBUFFER,X.COLOR_ATTACHMENT0,X.TEXTURE_2D,Kt.__webglTexture,te),Nt?X.framebufferTextureLayer(X.DRAW_FRAMEBUFFER,X.COLOR_ATTACHMENT0,bi.__webglTexture,Ie,sn+Ot):X.framebufferTexture2D(X.DRAW_FRAMEBUFFER,X.COLOR_ATTACHMENT0,X.TEXTURE_2D,bi.__webglTexture,Ie),te!==0?X.blitFramebuffer(Qe,ct,Le,De,He,Mt,Le,De,X.COLOR_BUFFER_BIT,X.NEAREST):Nt?X.copyTexSubImage3D(ke,Ie,He,Mt,sn+Ot,Qe,ct,Le,De):X.copyTexSubImage2D(ke,Ie,He,Mt,Qe,ct,Le,De);w.bindFramebuffer(X.READ_FRAMEBUFFER,null),w.bindFramebuffer(X.DRAW_FRAMEBUFFER,null)}else Nt?N.isDataTexture||N.isData3DTexture?X.texSubImage3D(ke,Ie,He,Mt,sn,Le,De,je,It,pn,Wt.data):j.isCompressedArrayTexture?X.compressedTexSubImage3D(ke,Ie,He,Mt,sn,Le,De,je,It,Wt.data):X.texSubImage3D(ke,Ie,He,Mt,sn,Le,De,je,It,pn,Wt):N.isDataTexture?X.texSubImage2D(X.TEXTURE_2D,Ie,He,Mt,Le,De,It,pn,Wt.data):N.isCompressedTexture?X.compressedTexSubImage2D(X.TEXTURE_2D,Ie,He,Mt,Wt.width,Wt.height,It,Wt.data):X.texSubImage2D(X.TEXTURE_2D,Ie,He,Mt,Le,De,It,pn,Wt);w.pixelStorei(X.UNPACK_ROW_LENGTH,ln),w.pixelStorei(X.UNPACK_IMAGE_HEIGHT,Et),w.pixelStorei(X.UNPACK_SKIP_PIXELS,Pn),w.pixelStorei(X.UNPACK_SKIP_ROWS,gt),w.pixelStorei(X.UNPACK_SKIP_IMAGES,wi),Ie===0&&j.generateMipmaps&&X.generateMipmap(ke),w.unbindTexture()},this.initRenderTarget=function(N){le.get(N).__webglFramebuffer===void 0&&fe.setupRenderTarget(N)},this.initTexture=function(N){N.isCubeTexture?fe.setTextureCube(N,0):N.isData3DTexture?fe.setTexture3D(N,0):N.isDataArrayTexture||N.isCompressedArrayTexture?fe.setTexture2DArray(N,0):fe.setTexture2D(N,0),w.unbindTexture()},this.resetState=function(){he=0,ne=0,ee=null,w.reset(),Oe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return nr}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=wt._getDrawingBufferColorSpace(e),t.unpackColorSpace=wt._getUnpackColorSpace()}}const Jg={type:"change"},Qf={type:"start"},ux={type:"end"},jc=new pu,e_=new Tr,cA=Math.cos(70*_M.DEG2RAD),_n=new Y,ei=2*Math.PI,zt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Oh=1e-6;class uA extends u1{constructor(e,t=null){super(e,t),this.state=zt.NONE,this.target=new Y,this.cursor=new Y,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Ba.ROTATE,MIDDLE:Ba.DOLLY,RIGHT:Ba.PAN},this.touches={ONE:Oa.ROTATE,TWO:Oa.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new Y,this._lastQuaternion=new hs,this._lastTargetPosition=new Y,this._quat=new hs().setFromUnitVectors(e.up,new Y(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Cg,this._sphericalDelta=new Cg,this._scale=1,this._panOffset=new Y,this._rotateStart=new ot,this._rotateEnd=new ot,this._rotateDelta=new ot,this._panStart=new ot,this._panEnd=new ot,this._panDelta=new ot,this._dollyStart=new ot,this._dollyEnd=new ot,this._dollyDelta=new ot,this._dollyDirection=new Y,this._mouse=new ot,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=hA.bind(this),this._onPointerDown=dA.bind(this),this._onPointerUp=fA.bind(this),this._onContextMenu=yA.bind(this),this._onMouseWheel=gA.bind(this),this._onKeyDown=_A.bind(this),this._onTouchStart=xA.bind(this),this._onTouchMove=vA.bind(this),this._onMouseDown=pA.bind(this),this._onMouseMove=mA.bind(this),this._interceptControlDown=SA.bind(this),this._interceptControlUp=MA.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.state=zt.NONE,this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents();const e=this.domElement.getRootNode();e.removeEventListener("keydown",this._interceptControlDown,{capture:!0}),e.removeEventListener("keyup",this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction="",this.domElement.style.cursor="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Jg),this.update(),this.state=zt.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){const t=this.object.position;_n.copy(t).sub(this.target),_n.applyQuaternion(this._quat),this._spherical.setFromVector3(_n),this.autoRotate&&this.state===zt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,a=this.maxAzimuthAngle;isFinite(i)&&isFinite(a)&&(i<-Math.PI?i+=ei:i>Math.PI&&(i-=ei),a<-Math.PI?a+=ei:a>Math.PI&&(a-=ei),i<=a?this._spherical.theta=Math.max(i,Math.min(a,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+a)/2?Math.max(i,this._spherical.theta):Math.min(a,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let l=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const c=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),l=c!=this._spherical.radius}if(_n.setFromSpherical(this._spherical),_n.applyQuaternion(this._quatInverse),t.copy(this.target).add(_n),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let c=null;if(this.object.isPerspectiveCamera){const d=_n.length();c=this._clampDistance(d*this._scale);const h=d-c;this.object.position.addScaledVector(this._dollyDirection,h),this.object.updateMatrixWorld(),l=!!h}else if(this.object.isOrthographicCamera){const d=new Y(this._mouse.x,this._mouse.y,0);d.unproject(this.object);const h=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),l=h!==this.object.zoom;const f=new Y(this._mouse.x,this._mouse.y,0);f.unproject(this.object),this.object.position.sub(f).add(d),this.object.updateMatrixWorld(),c=_n.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;c!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(c).add(this.object.position):(jc.origin.copy(this.object.position),jc.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(jc.direction))<cA?this.object.lookAt(this.target):(e_.setFromNormalAndCoplanarPoint(this.object.up,this.target),jc.intersectPlane(e_,this.target))))}else if(this.object.isOrthographicCamera){const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),c!==this.object.zoom&&(this.object.updateProjectionMatrix(),l=!0)}return this._scale=1,this._performCursorZoom=!1,l||this._lastPosition.distanceToSquared(this.object.position)>Oh||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Oh||this._lastTargetPosition.distanceToSquared(this.target)>Oh?(this.dispatchEvent(Jg),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?ei/60*this.autoRotateSpeed*e:ei/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){_n.setFromMatrixColumn(t,0),_n.multiplyScalar(-e),this._panOffset.add(_n)}_panUp(e,t){this.screenSpacePanning===!0?_n.setFromMatrixColumn(t,1):(_n.setFromMatrixColumn(t,0),_n.crossVectors(this.object.up,_n)),_n.multiplyScalar(e),this._panOffset.add(_n)}_pan(e,t){const i=this.domElement;if(this.object.isPerspectiveCamera){const a=this.object.position;_n.copy(a).sub(this.target);let l=_n.length();l*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*l/i.clientHeight,this.object.matrix),this._panUp(2*t*l/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),a=e-i.left,l=t-i.top,c=i.width,d=i.height;this._mouse.x=a/c*2-1,this._mouse.y=-(l/d)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(ei*this._rotateDelta.x/t.clientHeight),this._rotateUp(ei*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(ei*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-ei*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(ei*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-ei*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),a=.5*(e.pageY+t.y);this._rotateStart.set(i,a)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),a=.5*(e.pageY+t.y);this._panStart.set(i,a)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,a=e.pageY-t.y,l=Math.sqrt(i*i+a*a);this._dollyStart.set(0,l)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),a=.5*(e.pageX+i.x),l=.5*(e.pageY+i.y);this._rotateEnd.set(a,l)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(ei*this._rotateDelta.x/t.clientHeight),this._rotateUp(ei*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),a=.5*(e.pageY+t.y);this._panEnd.set(i,a)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,a=e.pageY-t.y,l=Math.sqrt(i*i+a*a);this._dollyEnd.set(0,l),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const c=(e.pageX+t.x)*.5,d=(e.pageY+t.y)*.5;this._updateZoomParameters(c,d)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new ot,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function dA(s){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(s.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(s)&&(this._addPointer(s),s.pointerType==="touch"?this._onTouchStart(s):this._onMouseDown(s),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function hA(s){this.enabled!==!1&&(s.pointerType==="touch"?this._onTouchMove(s):this._onMouseMove(s))}function fA(s){switch(this._removePointer(s),this._pointers.length){case 0:this.domElement.releasePointerCapture(s.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(ux),this.state=zt.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function pA(s){let e;switch(s.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Ba.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(s),this.state=zt.DOLLY;break;case Ba.ROTATE:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=zt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=zt.ROTATE}break;case Ba.PAN:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=zt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=zt.PAN}break;default:this.state=zt.NONE}this.state!==zt.NONE&&this.dispatchEvent(Qf)}function mA(s){switch(this.state){case zt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(s);break;case zt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(s);break;case zt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(s);break}}function gA(s){this.enabled===!1||this.enableZoom===!1||this.state!==zt.NONE||(s.preventDefault(),this.dispatchEvent(Qf),this._handleMouseWheel(this._customWheelEvent(s)),this.dispatchEvent(ux))}function _A(s){this.enabled!==!1&&this._handleKeyDown(s)}function xA(s){switch(this._trackPointer(s),this._pointers.length){case 1:switch(this.touches.ONE){case Oa.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(s),this.state=zt.TOUCH_ROTATE;break;case Oa.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(s),this.state=zt.TOUCH_PAN;break;default:this.state=zt.NONE}break;case 2:switch(this.touches.TWO){case Oa.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(s),this.state=zt.TOUCH_DOLLY_PAN;break;case Oa.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(s),this.state=zt.TOUCH_DOLLY_ROTATE;break;default:this.state=zt.NONE}break;default:this.state=zt.NONE}this.state!==zt.NONE&&this.dispatchEvent(Qf)}function vA(s){switch(this._trackPointer(s),this.state){case zt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(s),this.update();break;case zt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(s),this.update();break;case zt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(s),this.update();break;case zt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(s),this.update();break;default:this.state=zt.NONE}}function yA(s){this.enabled!==!1&&s.preventDefault()}function SA(s){s.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function MA(s){s.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const EA=/^[og]\s*(.+)?/,wA=/^mtllib /,bA=/^usemtl /,TA=/^usemap /,t_=/\s+/,n_=new Y,kh=new Y,i_=new Y,r_=new Y,Si=new Y,Xc=new ut;function AA(){const s={objects:[],object:{},vertices:[],normals:[],colors:[],uvs:[],materials:{},materialLibraries:[],startObject:function(e,t){if(this.object&&this.object.fromDeclaration===!1){this.object.name=e,this.object.fromDeclaration=t!==!1;return}const i=this.object&&typeof this.object.currentMaterial=="function"?this.object.currentMaterial():void 0;if(this.object&&typeof this.object._finalize=="function"&&this.object._finalize(!0),this.object={name:e||"",fromDeclaration:t!==!1,geometry:{vertices:[],normals:[],colors:[],uvs:[],hasUVIndices:!1},materials:[],smooth:!0,startMaterial:function(a,l){const c=this._finalize(!1);c&&(c.inherited||c.groupCount<=0)&&this.materials.splice(c.index,1);const d={index:this.materials.length,name:a||"",mtllib:Array.isArray(l)&&l.length>0?l[l.length-1]:"",smooth:c!==void 0?c.smooth:this.smooth,groupStart:c!==void 0?c.groupEnd:0,groupEnd:-1,groupCount:-1,inherited:!1,clone:function(h){const f={index:typeof h=="number"?h:this.index,name:this.name,mtllib:this.mtllib,smooth:this.smooth,groupStart:0,groupEnd:-1,groupCount:-1,inherited:!1};return f.clone=this.clone.bind(f),f}};return this.materials.push(d),d},currentMaterial:function(){if(this.materials.length>0)return this.materials[this.materials.length-1]},_finalize:function(a){const l=this.currentMaterial();if(l&&l.groupEnd===-1&&(l.groupEnd=this.geometry.vertices.length/3,l.groupCount=l.groupEnd-l.groupStart,l.inherited=!1),a&&this.materials.length>1)for(let c=this.materials.length-1;c>=0;c--)this.materials[c].groupCount<=0&&this.materials.splice(c,1);return a&&this.materials.length===0&&this.materials.push({name:"",smooth:this.smooth}),l}},i&&i.name&&typeof i.clone=="function"){const a=i.clone(0);a.inherited=!0,this.object.materials.push(a)}this.objects.push(this.object)},finalize:function(){this.object&&typeof this.object._finalize=="function"&&this.object._finalize(!0)},parseVertexIndex:function(e,t){const i=parseInt(e,10);return(i>=0?i-1:i+t/3)*3},parseNormalIndex:function(e,t){const i=parseInt(e,10);return(i>=0?i-1:i+t/3)*3},parseUVIndex:function(e,t){const i=parseInt(e,10);return(i>=0?i-1:i+t/2)*2},addVertex:function(e,t,i){const a=this.vertices,l=this.object.geometry.vertices;l.push(a[e+0],a[e+1],a[e+2]),l.push(a[t+0],a[t+1],a[t+2]),l.push(a[i+0],a[i+1],a[i+2])},addVertexPoint:function(e){const t=this.vertices;this.object.geometry.vertices.push(t[e+0],t[e+1],t[e+2])},addVertexLine:function(e){const t=this.vertices;this.object.geometry.vertices.push(t[e+0],t[e+1],t[e+2])},addNormal:function(e,t,i){const a=this.normals,l=this.object.geometry.normals;l.push(a[e+0],a[e+1],a[e+2]),l.push(a[t+0],a[t+1],a[t+2]),l.push(a[i+0],a[i+1],a[i+2])},addFaceNormal:function(e,t,i){const a=this.vertices,l=this.object.geometry.normals;n_.fromArray(a,e),kh.fromArray(a,t),i_.fromArray(a,i),Si.subVectors(i_,kh),r_.subVectors(n_,kh),Si.cross(r_),Si.normalize(),l.push(Si.x,Si.y,Si.z),l.push(Si.x,Si.y,Si.z),l.push(Si.x,Si.y,Si.z)},addColor:function(e,t,i){const a=this.colors,l=this.object.geometry.colors;a[e]!==void 0&&l.push(a[e+0],a[e+1],a[e+2]),a[t]!==void 0&&l.push(a[t+0],a[t+1],a[t+2]),a[i]!==void 0&&l.push(a[i+0],a[i+1],a[i+2])},addUV:function(e,t,i){const a=this.uvs,l=this.object.geometry.uvs;l.push(a[e+0],a[e+1]),l.push(a[t+0],a[t+1]),l.push(a[i+0],a[i+1])},addDefaultUV:function(){const e=this.object.geometry.uvs;e.push(0,0),e.push(0,0),e.push(0,0)},addUVLine:function(e){const t=this.uvs;this.object.geometry.uvs.push(t[e+0],t[e+1])},addFace:function(e,t,i,a,l,c,d,h,f){const _=this.vertices.length;let m=this.parseVertexIndex(e,_),g=this.parseVertexIndex(t,_),y=this.parseVertexIndex(i,_);if(this.addVertex(m,g,y),this.addColor(m,g,y),d!==void 0&&d!==""){const M=this.normals.length;m=this.parseNormalIndex(d,M),g=this.parseNormalIndex(h,M),y=this.parseNormalIndex(f,M),this.addNormal(m,g,y)}else this.addFaceNormal(m,g,y);if(a!==void 0&&a!==""){const M=this.uvs.length;m=this.parseUVIndex(a,M),g=this.parseUVIndex(l,M),y=this.parseUVIndex(c,M),this.addUV(m,g,y),this.object.geometry.hasUVIndices=!0}else this.addDefaultUV()},addPointGeometry:function(e){this.object.geometry.type="Points";const t=this.vertices.length;for(let i=0,a=e.length;i<a;i++){const l=this.parseVertexIndex(e[i],t);this.addVertexPoint(l),this.addColor(l)}},addLineGeometry:function(e,t){this.object.geometry.type="Line";const i=this.vertices.length,a=this.uvs.length;for(let l=0,c=e.length;l<c;l++)this.addVertexLine(this.parseVertexIndex(e[l],i));for(let l=0,c=t.length;l<c;l++)this.addUVLine(this.parseUVIndex(t[l],a))}};return s.startObject("",!1),s}class CA extends Kf{constructor(e){super(e),this.materials=null}load(e,t,i,a){const l=this,c=new n1(this.manager);c.setPath(this.path),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(e,function(d){try{t(l.parse(d))}catch(h){a?a(h):console.error(h),l.manager.itemError(e)}},i,a)}setMaterials(e){return this.materials=e,this}parse(e){const t=new AA;e.indexOf(`\r
`)!==-1&&(e=e.replace(/\r\n/g,`
`)),e.indexOf(`\\
`)!==-1&&(e=e.replace(/\\\n/g,""));const i=e.split(`
`);let a=[];for(let d=0,h=i.length;d<h;d++){const f=i[d].trimStart();if(f.length===0)continue;const _=f.charAt(0);if(_!=="#")if(_==="v"){const m=f.split(t_);switch(m[0]){case"v":t.vertices.push(parseFloat(m[1]),parseFloat(m[2]),parseFloat(m[3])),m.length>=7?(Xc.setRGB(parseFloat(m[4]),parseFloat(m[5]),parseFloat(m[6]),ci),t.colors.push(Xc.r,Xc.g,Xc.b)):t.colors.push(void 0,void 0,void 0);break;case"vn":t.normals.push(parseFloat(m[1]),parseFloat(m[2]),parseFloat(m[3]));break;case"vt":t.uvs.push(parseFloat(m[1]),parseFloat(m[2]));break}}else if(_==="f"){const g=f.slice(1).trim().split(t_),y=[];for(let T=0,S=g.length;T<S;T++){const x=g[T];if(x.length>0){const R=x.split("/");y.push(R)}}const M=y[0];for(let T=1,S=y.length-1;T<S;T++){const x=y[T],R=y[T+1];t.addFace(M[0],x[0],R[0],M[1],x[1],R[1],M[2],x[2],R[2])}}else if(_==="l"){const m=f.substring(1).trim().split(" ");let g=[];const y=[];if(f.indexOf("/")===-1)g=m;else for(let M=0,T=m.length;M<T;M++){const S=m[M].split("/");S[0]!==""&&g.push(S[0]),S[1]!==""&&y.push(S[1])}t.addLineGeometry(g,y)}else if(_==="p"){const g=f.slice(1).trim().split(" ");t.addPointGeometry(g)}else if((a=EA.exec(f))!==null){const m=(" "+a[0].slice(1).trim()).slice(1);t.startObject(m)}else if(bA.test(f))t.object.startMaterial(f.substring(7).trim(),t.materialLibraries);else if(wA.test(f))t.materialLibraries.push(f.substring(7).trim());else if(TA.test(f))console.warn('THREE.OBJLoader: Rendering identifier "usemap" not supported. Textures must be defined in MTL files.');else if(_==="s"){if(a=f.split(" "),a.length>1){const g=a[1].trim().toLowerCase();t.object.smooth=g!=="0"&&g!=="off"}else t.object.smooth=!0;const m=t.object.currentMaterial();m&&(m.smooth=t.object.smooth)}else{if(f==="\0")continue;console.warn('THREE.OBJLoader: Unexpected line: "'+f+'"')}}t.finalize();const l=new ir;if(l.materialLibraries=[].concat(t.materialLibraries),!(t.objects.length===1&&t.objects[0].geometry.vertices.length===0)===!0)for(let d=0,h=t.objects.length;d<h;d++){const f=t.objects[d],_=f.geometry,m=f.materials,g=_.type==="Line",y=_.type==="Points";let M=!1;if(_.vertices.length===0)continue;const T=new Xn;T.setAttribute("position",new hn(_.vertices,3)),_.normals.length>0&&T.setAttribute("normal",new hn(_.normals,3)),_.colors.length>0&&(M=!0,T.setAttribute("color",new hn(_.colors,3))),_.hasUVIndices===!0&&T.setAttribute("uv",new hn(_.uvs,2));const S=[];for(let R=0,I=m.length;R<I;R++){const A=m[R],P=A.name+"_"+A.smooth+"_"+M;let L=t.materials[P];if(this.materials!==null){if(L=this.materials.create(A.name),g&&L&&!(L instanceof tl)){const U=new tl;lr.prototype.copy.call(U,L),U.color.copy(L.color),L=U}else if(y&&L&&!(L instanceof Zo)){const U=new Zo({size:10,sizeAttenuation:!1});lr.prototype.copy.call(U,L),U.color.copy(L.color),U.map=L.map,L=U}}L===void 0&&(g?L=new tl:y?L=new Zo({size:1,sizeAttenuation:!1}):L=new KM,L.name=A.name,L.flatShading=!A.smooth,L.vertexColors=M,t.materials[P]=L),S.push(L)}let x;if(S.length>1){for(let R=0,I=m.length;R<I;R++){const A=m[R];T.addGroup(A.groupStart,A.groupCount,R)}g?x=new Cf(T,S):y?x=new Rh(T,S):x=new Bt(T,S)}else g?x=new Cf(T,S[0]):y?x=new Rh(T,S[0]):x=new Bt(T,S[0]);x.name=f.name,l.add(x)}else if(t.vertices.length>0){const d=new Zo({size:1,sizeAttenuation:!1}),h=new Xn;h.setAttribute("position",new hn(t.vertices,3)),t.colors.length>0&&t.colors[0]!==void 0&&(h.setAttribute("color",new hn(t.colors,3)),d.vertexColors=!0);const f=new Rh(h,d);l.add(f)}return l}}class RA{constructor(){Ht(this,"group");Ht(this,"chassisGroup");Ht(this,"frontWheelPivot");Ht(this,"frontWheelMesh");Ht(this,"rearLeftWheelMesh");Ht(this,"rearRightWheelMesh");Ht(this,"leftHeadlight");Ht(this,"rightHeadlight");Ht(this,"brakeLightsMaterial");Ht(this,"wheelRadius",.203);Ht(this,"wheelWidth",.102);Ht(this,"wheelRotation",0);Ht(this,"currentSteerAngle",0);Ht(this,"currentRoll",0);Ht(this,"currentPitch",0);this.group=new ir,this.chassisGroup=new ir,this.group.add(this.chassisGroup);const e=new Ki({color:1841431,roughness:.85,metalness:.1}),t=new Ki({color:13948120,roughness:.25,metalness:.85}),i=new Ki({color:440020,roughness:.3,metalness:.7}),a=()=>{const x=new ir,R=new Fs(this.wheelRadius,this.wheelRadius,this.wheelWidth,28);R.rotateZ(Math.PI/2);const I=new Bt(R,e);I.castShadow=!0,I.receiveShadow=!0;const A=new Fs(this.wheelRadius*.62,this.wheelRadius*.62,this.wheelWidth*1.04,20);A.rotateZ(Math.PI/2);const P=new Bt(A,t),L=new Fs(this.wheelRadius*.22,this.wheelRadius*.22,this.wheelWidth*1.08,16);L.rotateZ(Math.PI/2);const U=new Bt(L,i);return x.add(I),x.add(P),x.add(U),x};this.frontWheelPivot=new ir,this.frontWheelPivot.position.set(0,this.wheelRadius,-1),this.frontWheelMesh=a(),this.frontWheelPivot.add(this.frontWheelMesh),this.group.add(this.frontWheelPivot),this.rearLeftWheelMesh=a(),this.rearLeftWheelMesh.position.set(-.575,this.wheelRadius,1),this.group.add(this.rearLeftWheelMesh),this.rearRightWheelMesh=a(),this.rearRightWheelMesh.position.set(.575,this.wheelRadius,1),this.group.add(this.rearRightWheelMesh);const l=new Ki({color:2565930,metalness:.6,roughness:.4}),c=new Fs(.03,.03,1.15,12);c.rotateZ(Math.PI/2);const d=new Bt(c,l);d.position.set(0,this.wheelRadius,1),this.group.add(d);const h=x=>{const R=new s1(16317180,5,50,Math.PI/5.5,.35,1.2);R.position.set(x,.65,-.79),R.target.position.set(x,.1,-25),this.chassisGroup.add(R),this.chassisGroup.add(R.target);const I=new Fs(.07,.07,.03,16);I.rotateX(Math.PI/2);const A=new js({color:14742270}),P=new Bt(I,A);return P.position.set(x,.65,-.8),this.chassisGroup.add(P),R};this.leftHeadlight=h(-.28),this.rightHeadlight=h(.28),this.brakeLightsMaterial=new js({color:8330525});const f=new Bi(.16,.07,.04),_=new Bt(f,this.brakeLightsMaterial);_.position.set(-.48,.74,1.44),this.chassisGroup.add(_);const m=new Bt(f,this.brakeLightsMaterial);m.position.set(.48,.74,1.44),this.chassisGroup.add(m);const g=new Nr(.72,.32),y=new js({color:593174}),M=new Bt(g,y);M.position.set(0,1.25,1.436),this.chassisGroup.add(M);const T=new Ki({color:2565930,roughness:.6}),S=new Bt(new Bi(.85,.08,.04),T);S.position.set(0,.38,1.44),this.chassisGroup.add(S),this.buildProceduralBody(),this.loadAutowareObj()}buildProceduralBody(){const e=new Ki({color:1981066,roughness:.25,metalness:.65}),t=new Ki({color:1579035,roughness:.4,metalness:.3}),i=new $M({color:988970,roughness:.1,metalness:.2,transmission:.75,transparent:!0,opacity:.8}),a=new Bi(1.15,.55,1.832),l=new Bt(a,e);l.position.set(0,.55,.516),l.name="procedural_chassis",this.chassisGroup.add(l);const c=new Bi(.7,.45,.42),d=new Bt(c,e);d.position.set(0,.52,-.6),d.name="procedural_nose",this.chassisGroup.add(d);const h=new Bi(.24,.18,.22),f=new Bt(h,t);f.position.set(0,.38,-.8),f.name="procedural_mud",this.chassisGroup.add(f);const _=new Bi(1.1,.08,1.75),m=new Bt(_,t);m.position.set(0,1.65,.52),m.name="procedural_roof",this.chassisGroup.add(m);const g=new Nr(.85,.85),y=new Bt(g,i);y.position.set(0,1.25,-.52),y.rotation.x=.32,y.name="procedural_windshield",this.chassisGroup.add(y)}loadAutowareObj(){new CA().load("/models/etrike_body.obj",t=>{this.chassisGroup.children.filter(c=>c.name.startsWith("procedural_")).forEach(c=>this.chassisGroup.remove(c));const a=new Ki({color:1920728,roughness:.25,metalness:.7});t.traverse(c=>{if(c.isMesh){const d=c;d.material=a,d.castShadow=!0,d.receiveShadow=!0}});const l=new Vt().set(0,-1,0,0,0,0,1,0,-1,0,0,1,0,0,0,1);t.applyMatrix4(l),this.chassisGroup.add(t)},void 0,t=>{console.warn("[TuktukVehicle] Using procedural geometry. OBJ load notice:",t)})}update(e,t,i,a,l){const c=e*1e3/3600,d=c*l/this.wheelRadius;this.wheelRotation-=d,this.frontWheelMesh.rotation.x=this.wheelRotation,this.rearLeftWheelMesh.rotation.x=this.wheelRotation,this.rearRightWheelMesh.rotation.x=this.wheelRotation;const h=-(t*Math.PI)/180;this.currentSteerAngle+=(h-this.currentSteerAngle)*Math.min(l*15,1),this.frontWheelPivot.rotation.y=this.currentSteerAngle;const f=c*(i/1e3),_=Math.max(Math.min(-f*.04,.08),-.08);this.currentRoll+=(_-this.currentRoll)*Math.min(l*10,1),this.chassisGroup.rotation.z=this.currentRoll;const m=a>20,g=m?Math.min(a/1500*.04,.05):0;this.currentPitch+=(g-this.currentPitch)*Math.min(l*12,1),this.chassisGroup.rotation.x=this.currentPitch,m?this.brakeLightsMaterial.color.setHex(16007006):this.brakeLightsMaterial.color.setHex(5244708)}}class PA{constructor(){Ht(this,"group");Ht(this,"roadMesh");Ht(this,"laneDashes");Ht(this,"boundaryLines");Ht(this,"pathRibbonMesh");Ht(this,"pathGeometry");Ht(this,"dashCount",30);Ht(this,"dashSpacing",6);Ht(this,"roadLength",180);Ht(this,"roadWidth",14);Ht(this,"roadOffset",0);Ht(this,"pathPulseOffset",0);this.group=new ir;const e=new Nr(this.roadWidth,this.roadLength,1,1);e.rotateX(-Math.PI/2);const t=new Ki({color:657930,roughness:.95,metalness:.05});this.roadMesh=new Bt(e,t),this.roadMesh.position.set(0,-.01,-40),this.roadMesh.receiveShadow=!0,this.group.add(this.roadMesh);const i=[],a=this.roadWidth/2;i.push(new Y(-a,.01,20)),i.push(new Y(-a,.01,-120)),i.push(new Y(a,.01,20)),i.push(new Y(a,.01,-120)),i.push(new Y(-a/2,.01,20)),i.push(new Y(-a/2,.01,-120)),i.push(new Y(a/2,.01,20)),i.push(new Y(a/2,.01,-120));const l=new Xn().setFromPoints(i),c=new tl({color:2565930,transparent:!0,opacity:.8});this.boundaryLines=new Cf(l,c),this.group.add(this.boundaryLines);const d=new Nr(.2,2.5);d.rotateX(-Math.PI/2);const h=new js({color:15000807,transparent:!0,opacity:.85});this.laneDashes=new zM(d,h,this.dashCount*2);const f=new rn;for(let g=0;g<this.dashCount;g++){const y=20-g*this.dashSpacing;f.position.set(-a/4,.015,y),f.updateMatrix(),this.laneDashes.setMatrixAt(g,f.matrix),f.position.set(a/4,.015,y),f.updateMatrix(),this.laneDashes.setMatrixAt(this.dashCount+g,f.matrix)}this.laneDashes.instanceMatrix.needsUpdate=!0,this.group.add(this.laneDashes);const _=32;this.pathGeometry=new Nr(1.4,32,1,_),this.pathGeometry.rotateX(-Math.PI/2);const m=new js({color:440020,transparent:!0,opacity:.55,side:tr,depthWrite:!1});this.pathRibbonMesh=new Bt(this.pathGeometry,m),this.pathRibbonMesh.position.set(0,.02,0),this.group.add(this.pathRibbonMesh)}update(e,t,i,a){const l=e*1e3/3600;this.roadOffset+=l*a;const c=this.roadOffset%this.dashSpacing,d=new rn,h=this.roadWidth/2;for(let x=0;x<this.dashCount;x++){const R=20-x*this.dashSpacing+c;d.position.set(-h/4,.015,R),d.updateMatrix(),this.laneDashes.setMatrixAt(x,d.matrix),d.position.set(h/4,.015,R),d.updateMatrix(),this.laneDashes.setMatrixAt(this.dashCount+x,d.matrix)}this.laneDashes.instanceMatrix.needsUpdate=!0;const f=2,_=t*Math.PI/180,m=Math.tan(_)/f,g=this.pathGeometry.attributes.position,y=.7,M=32,T=32;this.pathPulseOffset+=a*2.5;for(let x=0;x<=T;x++){const I=-(x/T)*M,A=-.45*m*I*I,P=x*2;g.setXYZ(P,A-y,.02,I),g.setXYZ(P+1,A+y,.02,I)}g.needsUpdate=!0;const S=this.pathRibbonMesh.material;i?(S.color.setHex(440020),S.opacity=.45+Math.sin(this.pathPulseOffset)*.15):(S.color.setHex(4144966),S.opacity=.25)}}const NA=({active:s,title:e="Parking Brake Active"})=>E.jsx("div",{className:`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 border ${s?"bg-rose-950/80 border-rose-500 text-rose-500 shadow-[0_0_14px_rgba(244,63,94,0.8)]":"bg-neutral-950/50 border-neutral-900 text-neutral-800"}`,title:e,children:E.jsxs("svg",{viewBox:"0 0 32 32",className:"w-6 h-6 fill-current",children:[E.jsx("path",{d:"M 6.5 10.5 A 11 11 0 0 0 6.5 21.5",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round"}),E.jsx("path",{d:"M 25.5 10.5 A 11 11 0 0 1 25.5 21.5",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round"}),E.jsx("circle",{cx:"16",cy:"16",r:"7.5",fill:"none",stroke:"currentColor",strokeWidth:"2.0"}),E.jsx("path",{d:"M 14 11.5 L 17 11.5 C 18.5 11.5 19.5 12.3 19.5 13.8 C 19.5 15.3 18.5 16.1 17 16.1 L 15.6 16.1 L 15.6 20.5 L 14 20.5 Z M 15.6 14.7 L 16.8 14.7 C 17.5 14.7 18 14.4 18 13.8 C 18 13.2 17.5 12.9 16.8 12.9 L 15.6 12.9 Z"})]})}),LA=({active:s,title:e="Brake System Active"})=>E.jsx("div",{className:`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 border ${s?"bg-rose-950/80 border-rose-500 text-rose-500 shadow-[0_0_14px_rgba(244,63,94,0.8)]":"bg-neutral-950/50 border-neutral-900 text-neutral-800"}`,title:e,children:E.jsxs("svg",{viewBox:"0 0 32 32",className:"w-6 h-6 fill-current",children:[E.jsx("path",{d:"M 6.5 10.5 A 11 11 0 0 0 6.5 21.5",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round"}),E.jsx("path",{d:"M 25.5 10.5 A 11 11 0 0 1 25.5 21.5",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round"}),E.jsx("circle",{cx:"16",cy:"16",r:"7.5",fill:"none",stroke:"currentColor",strokeWidth:"2.0"}),E.jsx("rect",{x:"15",y:"11.5",width:"2",height:"5",rx:"0.5"}),E.jsx("circle",{cx:"16",cy:"19",r:"1.1"})]})}),DA=({active:s,title:e="Brake Hold Active"})=>E.jsx("div",{className:`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 border ${s?"bg-emerald-950/80 border-emerald-500 text-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.8)]":"bg-neutral-950/50 border-neutral-900 text-neutral-800"}`,title:e,children:E.jsx("div",{className:"flex flex-col items-center",children:E.jsx("span",{className:"text-[10px] font-black tracking-tight leading-none",children:"HOLD"})})}),IA=({active:s,title:e="Electric Propulsion Ready"})=>E.jsxs("div",{className:`px-2.5 h-9 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 border ${s?"bg-emerald-950/80 border-emerald-500 text-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.8)]":"bg-neutral-950/50 border-neutral-900 text-neutral-800"}`,title:e,children:[E.jsx("div",{className:`w-2 h-2 rounded-full ${s?"bg-emerald-400 animate-pulse":"bg-neutral-700"}`}),E.jsx("span",{className:"text-[11px] font-black tracking-wider leading-none",children:"READY"})]}),UA=({active:s,fault:e=!1,title:t="Electric Power Steering System"})=>{const i=s||e;return E.jsx("div",{className:`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 border ${i?"bg-amber-950/80 border-amber-500 text-amber-400 shadow-[0_0_14px_rgba(245,158,11,0.8)] animate-pulse":"bg-neutral-950/50 border-neutral-900 text-neutral-800"}`,title:t,children:E.jsxs("svg",{viewBox:"0 0 32 32",className:"w-6 h-6",fill:"none",stroke:"currentColor",strokeWidth:"2.0",children:[E.jsx("circle",{cx:"16",cy:"16",r:"10"}),E.jsx("circle",{cx:"16",cy:"16",r:"2.5",fill:"currentColor"}),E.jsx("line",{x1:"6",y1:"16",x2:"13.5",y2:"16",strokeWidth:"2.2"}),E.jsx("line",{x1:"26",y1:"16",x2:"18.5",y2:"16",strokeWidth:"2.2"}),E.jsx("line",{x1:"16",y1:"18.5",x2:"16",y2:"26",strokeWidth:"2.2"}),i&&E.jsx("path",{d:"M 23 8 L 23 11 M 23 13 L 23 13.5",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round"})]})})},FA=({active:s,title:e="Emergency Stop Active"})=>E.jsx("div",{className:`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 border ${s?"bg-rose-950/90 border-rose-500 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.9)] animate-pulse":"bg-neutral-950/50 border-neutral-900 text-neutral-800"}`,title:e,children:E.jsxs("svg",{viewBox:"0 0 32 32",className:"w-6 h-6 fill-current",children:[E.jsx("polygon",{points:"10,4 22,4 28,10 28,22 22,28 10,28 4,22 4,10",fill:"none",stroke:"currentColor",strokeWidth:"2.2"}),E.jsx("rect",{x:"15",y:"9",width:"2",height:"8",rx:"0.5"}),E.jsx("circle",{cx:"16",cy:"20.5",r:"1.3"})]})}),OA=({active:s,temp:e,title:t="ECU / Actuator Temperature"})=>{const i=e>75,a=e>60||s;return E.jsx("div",{className:`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 border ${i?"bg-rose-950/80 border-rose-500 text-rose-500 shadow-[0_0_14px_rgba(244,63,94,0.8)] animate-pulse":a?"bg-amber-950/80 border-amber-500 text-amber-400 shadow-[0_0_14px_rgba(245,158,11,0.8)]":"bg-neutral-950/50 border-neutral-900 text-neutral-800"}`,title:`${t}: ${e}°C`,children:E.jsxs("svg",{viewBox:"0 0 32 32",className:"w-6 h-6",fill:"currentColor",children:[E.jsx("path",{d:"M 13 8 C 13 6.9 13.9 6 15 6 C 16.1 6 17 6.9 17 8 L 17 18.2 C 18.2 19 19 20.4 19 22 C 19 24.2 17.2 26 15 26 C 12.8 26 11 24.2 11 22 C 11 20.4 11.8 19 13 18.2 Z",fill:"none",stroke:"currentColor",strokeWidth:"1.8"}),E.jsx("circle",{cx:"15",cy:"22",r:"2.8"}),E.jsx("rect",{x:"14",y:"12",width:"2",height:"7",rx:"0.5"}),E.jsx("line",{x1:"19",y1:"9",x2:"22",y2:"9",stroke:"currentColor",strokeWidth:"1.8"}),E.jsx("line",{x1:"19",y1:"13",x2:"22",y2:"13",stroke:"currentColor",strokeWidth:"1.8"})]})})},kA=({active:s,busOff:e=!1,errorCount:t=0,title:i="CAN Controller Health"})=>{const a=e||t>96;return E.jsx("div",{className:`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 border ${e?"bg-rose-950/80 border-rose-500 text-rose-500 shadow-[0_0_14px_rgba(244,63,94,0.8)] animate-pulse":a?"bg-amber-950/80 border-amber-500 text-amber-400 shadow-[0_0_14px_rgba(245,158,11,0.8)]":s?"bg-emerald-950/80 border-emerald-500 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.6)]":"bg-neutral-950/50 border-neutral-900 text-neutral-800"}`,title:`${i}: ${e?"BUS OFF":a?`Errors: ${t}`:"OK"}`,children:E.jsxs("div",{className:"flex flex-col items-center",children:[E.jsx("span",{className:"text-[10px] font-black tracking-tighter leading-none",children:"CAN"}),E.jsx("span",{className:"text-[7px] font-mono leading-none mt-0.5 font-bold",children:e?"OFF":"BUS"})]})})},BA=({active:s,title:e="High Beam Headlights"})=>E.jsx("div",{className:`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 border ${s?"bg-blue-950/80 border-blue-500 text-blue-400 shadow-[0_0_16px_rgba(59,130,246,0.9)]":"bg-neutral-950/50 border-neutral-900 text-neutral-800"}`,title:e,children:E.jsxs("svg",{viewBox:"0 0 32 32",className:"w-6 h-6",fill:"currentColor",children:[E.jsx("path",{d:"M 18 8 A 8 8 0 0 1 18 24 L 14 24 C 11.8 24 10 22.2 10 20 L 10 12 C 10 9.8 11.8 8 14 8 Z"}),E.jsx("line",{x1:"21",y1:"10",x2:"28",y2:"10",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round"}),E.jsx("line",{x1:"21",y1:"14",x2:"28",y2:"14",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round"}),E.jsx("line",{x1:"21",y1:"18",x2:"28",y2:"18",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round"}),E.jsx("line",{x1:"21",y1:"22",x2:"28",y2:"22",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round"})]})}),zA=({active:s,title:e="Hazard Warning Flashers"})=>E.jsx("div",{className:`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 border ${s?"bg-rose-950/90 border-rose-500 text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.9)] animate-pulse":"bg-neutral-950/50 border-neutral-900 text-neutral-800"}`,title:e,children:E.jsxs("svg",{viewBox:"0 0 32 32",className:"w-6 h-6 fill-none",stroke:"currentColor",children:[E.jsx("polygon",{points:"16,5 29,27 3,27",strokeWidth:"2.2",strokeLinejoin:"round"}),E.jsx("polygon",{points:"16,11 24,24 8,24",strokeWidth:"1.8",strokeLinejoin:"round"})]})}),HA=()=>{var Ve,ae,de,Ee,$e,Fe,dt,Gt,ht,xt,At,pt,Ut,Xt;const{telemetry:s,totalFrames:e,cameraMode:t,setCameraMode:i,speedUnit:a,setSpeedUnit:l,toggleActiveView:c,framesById:d,isConnected:h}=vn(),f=a==="mph"?s.speed_act_kmh*.621371:s.speed_act_kmh;a==="mph"?s.speed_cmd_kmh*.621371:s.speed_cmd_kmh;const _=s.mode==="AUTONOMOUS"||s.mode==="AUTO",m=s.estop||s.mode==="ESTOP",g=s.lights_act.left,y=s.lights_act.right,M=s.lights_act.headlight,T=s.lights_act.hazard,S=s.lights_act.brake,x=s.steer_act_deg,R=s.steer_cmd_deg,I=s.brake_act_kpa,A=Math.min(I/1500*100,100),P=(Ve=d[784])==null?void 0:Ve.signals,L=!!((ae=P==null?void 0:P.fault)!=null&&ae.value),U=typeof((de=P==null?void 0:P.motor_current)==null?void 0:de.value)=="number"?P.motor_current.value:Math.round(Math.abs(x)*.25*10)/10,b=typeof((Ee=P==null?void 0:P.ecu_temp)==null?void 0:Ee.value)=="number"?P.ecu_temp.value:38,D=($e=d[785])==null?void 0:$e.signals,B=!!((Fe=D==null?void 0:D.fault)!=null&&Fe.value),V=typeof((dt=D==null?void 0:D.ecu_temp)==null?void 0:dt.value)=="number"?D.ecu_temp.value:42,G=(Gt=d[529])==null?void 0:Gt.signals,J=!!((ht=G==null?void 0:G.mcp_bus_off)!=null&&ht.value),H=typeof((xt=G==null?void 0:G.mcp_tec)==null?void 0:xt.value)=="number"?G.mcp_tec.value:0,Z=typeof((At=G==null?void 0:G.mcp_rec)==null?void 0:At.value)=="number"?G.mcp_rec.value:0,he=s.gear==="P",ne=I>100||S,ee=s.speed_act_kmh<.5&&I>250,$=h&&!m,K=L||Math.abs(R-x)>5,F=Math.max(b,V),se=(Xt=(Ut=(pt=d[289])==null?void 0:pt.signals)==null?void 0:Ut.yaw_rate_mrad_s)==null?void 0:Xt.value,Se=typeof se=="number"?se:Math.round(-x*s.speed_act_kmh*.28),Ge=Math.round(s.speed_act_kmh*110),Be=Math.min(Math.round(s.speed_act_kmh/45*100),100);return E.jsxs(E.Fragment,{children:[E.jsx("div",{className:"fixed inset-x-0 bottom-0 pointer-events-none transition-all duration-100 ease-out z-10",style:{height:`${Math.min(16+A*.4,55)}%`,background:"linear-gradient(to top, rgba(225, 29, 72, 0.45) 0%, rgba(136, 19, 55, 0.18) 55%, rgba(0, 0, 0, 0) 100%)",opacity:ne?Math.min(.25+A/100*.75,1):0}}),m&&E.jsx("div",{className:"fixed inset-0 pointer-events-none z-20 animate-[pulse_1.2s_ease-in-out_infinite] bg-rose-950/25 border-8 border-rose-600/80 shadow-[inset_0_0_100px_rgba(225,29,72,0.65)]"}),E.jsxs("div",{className:"absolute inset-0 pointer-events-none flex flex-col justify-between p-6 select-none font-mono z-30",children:[E.jsxs("div",{className:"flex items-start justify-between relative",children:[E.jsxs("div",{className:"flex items-center gap-3",children:[E.jsx("div",{className:`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-150 ${g||T?"bg-emerald-500 text-black border-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.95)] animate-pulse":"bg-[#080808]/85 text-neutral-700 border-neutral-800"}`,title:"Left Turn Indicator (Peripheral Field)",children:E.jsx(Hy,{className:"w-8 h-8 stroke-[3]"})}),E.jsxs("div",{className:"flex items-center gap-1.5 bg-[#080808]/90 backdrop-blur-xl border border-neutral-800/90 p-1 rounded-xl shadow-xl",children:[E.jsx(NA,{active:he}),E.jsx(LA,{active:ne||B}),E.jsx(DA,{active:ee}),E.jsx(IA,{active:$})]})]}),E.jsxs("div",{className:"absolute left-1/2 -translate-x-1/2 top-0 flex flex-col items-center",children:[E.jsx("div",{className:"flex items-center gap-2 bg-[#080808]/90 backdrop-blur-xl border border-neutral-800/90 px-3 py-1 rounded-xl shadow-xl mb-1 pointer-events-auto",children:["P","R","N","D","S"].map(Ft=>{const Ct=s.gear===Ft;return E.jsx("div",{className:`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-black transition-all ${Ct?"bg-cyan-500 text-black shadow-[0_0_14px_rgba(6,182,212,0.9)] scale-110 border border-cyan-300":"text-neutral-500 hover:text-neutral-400 bg-neutral-900/50"}`,children:Ft},Ft)})}),E.jsxs("div",{className:"flex items-baseline gap-2 drop-shadow-[0_6px_20px_rgba(0,0,0,0.95)]",children:[E.jsx("span",{className:"text-7xl lg:text-8xl font-black text-white tracking-tight tabular-nums font-mono leading-none",children:f.toFixed(0)}),E.jsx("span",{className:"text-base lg:text-lg font-black text-neutral-400 uppercase tracking-widest",children:a})]})]}),E.jsxs("div",{className:"flex items-center gap-3",children:[E.jsxs("div",{className:"flex items-center gap-1.5 bg-[#080808]/90 backdrop-blur-xl border border-neutral-800/90 p-1 rounded-xl shadow-xl",children:[E.jsx(UA,{active:K,fault:L}),E.jsx(FA,{active:m}),E.jsx(OA,{active:F>60,temp:F}),E.jsx(kA,{active:h&&!J,busOff:J,errorCount:H+Z}),E.jsx(BA,{active:M}),E.jsx(zA,{active:T})]}),E.jsx("div",{className:`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-150 ${y||T?"bg-emerald-500 text-black border-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.95)] animate-pulse":"bg-[#080808]/85 text-neutral-700 border-neutral-800"}`,title:"Right Turn Indicator (Peripheral Field)",children:E.jsx(Gy,{className:"w-8 h-8 stroke-[3]"})})]})]}),E.jsxs("div",{className:"flex justify-between items-center px-2",children:[E.jsxs("div",{className:"w-80 lg:w-84 bg-[#080808]/85 backdrop-blur-xl border border-neutral-800/90 rounded-2xl p-5 space-y-3.5 pointer-events-auto shadow-2xl",children:[E.jsxs("div",{className:"flex items-center justify-between border-b border-neutral-800 pb-2",children:[E.jsx("span",{className:"text-xs uppercase font-black text-neutral-400 tracking-wider",children:"CHASSIS DYNAMICS"}),E.jsx("span",{className:"text-[10px] text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800 font-bold",children:"3-WHEELER"})]}),E.jsxs("div",{children:[E.jsxs("div",{className:"flex justify-between items-baseline mb-1",children:[E.jsx("span",{className:"text-sm font-semibold text-neutral-300",children:"Steering"}),E.jsx("span",{className:"text-2xl font-black tabular-nums text-emerald-400",children:x>0?`+${x.toFixed(1)}°`:`${x.toFixed(1)}°`})]}),E.jsxs("div",{className:"h-4 bg-neutral-950 rounded-full relative overflow-hidden border border-neutral-700/80 shadow-inner",children:[E.jsx("div",{className:"absolute left-1/2 top-0 bottom-0 w-1 bg-neutral-400 -translate-x-1/2 z-10"}),E.jsx("div",{className:"absolute top-0 bottom-0 w-1.5 bg-cyan-300 -translate-x-1/2 z-20 shadow-[0_0_8px_rgba(6,182,212,1)]",style:{left:`${50+R/45*50}%`},title:`Commanded Steer: ${R.toFixed(1)}°`}),E.jsx("div",{className:"h-full bg-emerald-400 transition-all duration-75 absolute top-0",style:{left:x<0?`${50+x/45*50}%`:"50%",width:`${Math.abs(x)/45*50}%`}})]}),E.jsxs("div",{className:"flex justify-between text-xs text-neutral-400 mt-1 font-mono",children:[E.jsx("span",{children:"-45°"}),E.jsxs("span",{className:"text-cyan-400 font-bold",children:["CMD: ",R.toFixed(1),"°"]}),E.jsx("span",{children:"+45°"})]})]}),E.jsxs("div",{className:"flex justify-between items-center text-xs py-1 px-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800 font-mono",children:[E.jsxs("span",{className:"text-neutral-400",children:["EPS Current: ",E.jsxs("span",{className:"text-cyan-300 font-bold",children:[U,"A"]})]}),E.jsxs("span",{className:"text-neutral-400",children:["ECU: ",E.jsxs("span",{className:"text-amber-300 font-bold",children:[b,"°C"]})]})]}),E.jsxs("div",{className:"flex justify-between items-baseline pt-1 border-t border-neutral-900",children:[E.jsx("span",{className:"text-sm font-semibold text-neutral-300",children:"Yaw Rate"}),E.jsxs("div",{children:[E.jsx("span",{className:"text-2xl font-black text-white tabular-nums",children:Se}),E.jsx("span",{className:"text-xs text-neutral-400 ml-1.5 font-bold",children:"mrad/s"})]})]}),E.jsxs("div",{className:"pt-1 border-t border-neutral-900",children:[E.jsxs("div",{className:"flex justify-between items-baseline mb-1",children:[E.jsx("span",{className:"text-sm font-semibold text-neutral-300",children:"Hydraulic Brake"}),E.jsxs("span",{className:`text-2xl font-black tabular-nums ${I>50?"text-rose-400":"text-neutral-200"}`,children:[I," ",E.jsx("span",{className:"text-xs font-normal text-neutral-400",children:"kPa"})]})]}),E.jsx("div",{className:"h-3.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-700/80 shadow-inner",children:E.jsx("div",{className:`h-full transition-all duration-75 ${I>100?"bg-gradient-to-r from-amber-500 to-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)]":"bg-neutral-600"}`,style:{width:`${A}%`}})}),E.jsxs("div",{className:"flex justify-between text-xs text-neutral-400 mt-1 font-mono",children:[E.jsxs("span",{children:["Brake ECU: ",E.jsxs("span",{className:"text-neutral-300",children:[V,"°C"]})]}),E.jsx("span",{className:B?"text-rose-400 font-bold":"text-emerald-400",children:B?"BRAKE FAULT":"NORMAL"})]})]})]}),E.jsxs("div",{className:"w-80 lg:w-84 bg-[#080808]/85 backdrop-blur-xl border border-neutral-800/90 rounded-2xl p-5 space-y-3.5 pointer-events-auto shadow-2xl",children:[E.jsxs("div",{className:"flex items-center justify-between border-b border-neutral-800 pb-2",children:[E.jsx("span",{className:"text-xs uppercase font-black text-neutral-400 tracking-wider",children:"POWERTRAIN & BUS"}),E.jsx("span",{className:"text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 font-bold",children:"ACTIVE"})]}),E.jsxs("div",{children:[E.jsxs("div",{className:"flex justify-between items-baseline mb-1",children:[E.jsx("span",{className:"text-sm font-semibold text-neutral-300",children:"Electric Motor"}),E.jsxs("span",{className:"text-2xl font-black tabular-nums text-cyan-300",children:[Ge.toLocaleString()," ",E.jsx("span",{className:"text-xs font-normal text-neutral-400",children:"RPM"})]})]}),E.jsx("div",{className:"h-4 bg-neutral-950 rounded-full overflow-hidden border border-neutral-700/80 shadow-inner",children:E.jsx("div",{className:"h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-75 shadow-[0_0_10px_rgba(6,182,212,0.6)]",style:{width:`${Be}%`}})}),E.jsxs("div",{className:"flex justify-between text-xs text-neutral-400 mt-1 font-mono",children:[E.jsx("span",{children:"IDLE"}),E.jsxs("span",{className:"text-neutral-300",children:[Be,"% DEMAND"]}),E.jsx("span",{children:"PEAK"})]})]}),E.jsxs("div",{className:"flex justify-between items-baseline pt-1 border-t border-neutral-900",children:[E.jsx("span",{className:"text-sm font-semibold text-neutral-300",children:"Bus Rate"}),E.jsxs("div",{className:"flex items-center gap-2",children:[E.jsx(w_,{className:"w-4 h-4 text-cyan-400 animate-pulse"}),E.jsx("span",{className:"text-2xl font-black text-emerald-400 tabular-nums",children:"28.0 Hz"})]})]}),E.jsxs("div",{className:"flex justify-between items-center text-xs py-1 px-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800 font-mono",children:[E.jsxs("span",{className:"text-neutral-400",children:["TEC: ",E.jsx("span",{className:"text-emerald-400 font-bold",children:H})]}),E.jsxs("span",{className:"text-neutral-400",children:["REC: ",E.jsx("span",{className:"text-emerald-400 font-bold",children:Z})]}),E.jsx("span",{className:J?"text-rose-400 font-bold":"text-emerald-400 font-bold",children:J?"BUS OFF":"HEALTHY"})]}),E.jsxs("div",{className:"flex justify-between items-baseline pt-1 border-t border-neutral-900",children:[E.jsx("span",{className:"text-sm font-semibold text-neutral-300",children:"CAN Telemetry Frames"}),E.jsx("span",{className:"text-base font-bold text-neutral-200 tabular-nums",children:e.toLocaleString()})]})]})]}),E.jsxs("div",{className:"flex items-end justify-between relative px-2",children:[E.jsxs("div",{className:"flex items-center gap-2 bg-[#080808]/90 backdrop-blur-xl border border-neutral-800/90 p-1.5 rounded-xl pointer-events-auto shadow-xl",children:[E.jsx(By,{className:"w-4 h-4 text-neutral-400 ml-1.5 mr-0.5"}),["chase","cabin","orbit"].map(Ft=>E.jsx("button",{onClick:()=>i(Ft),className:`h-10 px-3.5 rounded-lg text-xs font-black uppercase transition-all ${t===Ft?"bg-neutral-800 text-cyan-300 shadow-md border border-neutral-700":"text-neutral-400 hover:text-white"}`,children:Ft==="orbit"?"360°":Ft},Ft))]}),E.jsx("div",{className:"absolute left-1/2 -translate-x-1/2 bottom-1 flex flex-col items-center pointer-events-none",children:E.jsx("span",{className:"text-[11px] text-neutral-400 uppercase tracking-widest font-bold drop-shadow-md",children:_?"AUTONOMOUS DRIVING SYSTEM • DRIVE-BY-WIRE ACTIVE":"MANUAL DRIVE OVERRIDE"})}),E.jsxs("div",{className:"flex items-center gap-3 pointer-events-auto",children:[E.jsxs("div",{className:"flex bg-[#080808]/90 backdrop-blur-xl border border-neutral-800/90 p-1 rounded-xl text-xs",children:[E.jsx("button",{onClick:()=>l("km/h"),className:`h-9 px-3 rounded-lg transition-all font-black ${a==="km/h"?"bg-neutral-800 text-white shadow":"text-neutral-500 hover:text-neutral-300"}`,children:"KM/H"}),E.jsx("button",{onClick:()=>l("mph"),className:`h-9 px-3 rounded-lg transition-all font-black ${a==="mph"?"bg-neutral-800 text-white shadow":"text-neutral-500 hover:text-neutral-300"}`,children:"MPH"})]}),E.jsxs("button",{onClick:c,className:"flex items-center gap-2 bg-[#080808]/95 hover:bg-neutral-900 text-neutral-200 border border-neutral-700/80 px-4 h-11 rounded-xl text-xs font-black transition-all shadow-xl",title:"Switch back to CAN Bus Engineering Monitor (Tab)",children:[E.jsx(b_,{className:"w-4 h-4 text-cyan-400"}),E.jsx("span",{children:"CAN MONITOR"}),E.jsx("span",{className:"text-[10px] text-neutral-400 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-700 font-bold",children:"Tab"})]})]})]})]})]})},VA=()=>{const s=on.useRef(null);return vn(e=>e.cameraMode),on.useEffect(()=>{const e=s.current;if(!e)return;const t=new NM;t.background=new ut(0),t.fog=new Yf(0,.015);const i=e.clientWidth||window.innerWidth,a=e.clientHeight||window.innerHeight,l=new ui(50,i/a,.1,300);l.position.set(0,2.8,6.2);const c=new lA({antialias:!0,powerPreference:"high-performance"});c.setSize(i,a),c.setPixelRatio(Math.min(window.devicePixelRatio,2)),c.shadowMap.enabled=!0,c.shadowMap.type=A_,e.appendChild(c.domElement);const d=new uA(l,c.domElement);d.enableDamping=!0,d.dampingFactor=.05,d.maxPolarAngle=Math.PI/2-.05,d.minDistance=2,d.maxDistance=25,d.target.set(0,.8,0),d.enabled=!1;const h=new o1(16777215,.7);t.add(h);const f=new Ag(16777215,1.4);f.position.set(-12,18,-15),f.castShadow=!0,t.add(f);const _=new Ag(9684477,.9);_.position.set(12,12,15),t.add(_);const m=new i1(440020,1579035,.6);t.add(m);const g=new PA;t.add(g.group);const y=new RA;t.add(y.group);let M,T=performance.now();const S=I=>{var V,G,J;M=requestAnimationFrame(S);const A=Math.min((I-T)/1e3,.1);T=I;const P=vn.getState(),L=P.telemetry,U=L.mode==="AUTONOMOUS"||L.mode==="AUTO",b=(J=(G=(V=P.framesById[289])==null?void 0:V.signals)==null?void 0:G.yaw_rate_mrad_s)==null?void 0:J.value,D=typeof b=="number"?b:Math.round(-L.steer_act_deg*L.speed_act_kmh*.28);y.update(L.speed_act_kmh,L.steer_act_deg,D,L.brake_act_kpa,A),g.update(L.speed_act_kmh,L.steer_act_deg,U,A);const B=P.cameraMode;B==="orbit"?(d.enabled=!0,d.target.set(0,.75,.2),d.update()):(d.enabled=!1,B==="cabin"?(l.position.set(0,1.25,0),l.lookAt(0,1,-25)):(l.position.x+=(0-l.position.x)*(A*6),l.position.y+=(2.5-l.position.y)*(A*6),l.position.z+=(5.2-l.position.z)*(A*6),l.lookAt(0,.75,-8))),c.render(t,l)};M=requestAnimationFrame(S);const x=()=>{if(!e)return;const I=e.clientWidth,A=e.clientHeight;l.aspect=I/A,l.updateProjectionMatrix(),c.setSize(I,A)};window.addEventListener("resize",x);const R=new ResizeObserver(x);return R.observe(e),()=>{cancelAnimationFrame(M),window.removeEventListener("resize",x),R.disconnect(),d.dispose(),c.dispose(),c.domElement&&e.contains(c.domElement)&&e.removeChild(c.domElement)}},[]),E.jsxs("div",{className:"relative w-full h-full bg-black overflow-hidden select-none",children:[E.jsx("div",{ref:s,className:"absolute inset-0 w-full h-full"}),E.jsx(HA,{})]})},GA=()=>{const{initWebSocket:s,setCatalog:e,togglePause:t}=vn();on.useEffect(()=>{const h=window.location.port==="5173"?"http://127.0.0.1:8000":"";fetch(`${h}/api/v1/catalog`).then(m=>{if(!m.ok)throw new Error(`HTTP ${m.status}`);return m.json()}).then(m=>{m.messages&&e(m.messages,m.source||"YAML Contracts")}).catch(m=>{console.error("Failed to fetch CAN catalog:",m)}),s();const f=m=>{if(m.code==="Space"&&m.target.tagName!=="INPUT"){m.preventDefault(),t();return}if(m.key==="Tab"&&m.target.tagName!=="INPUT"){m.preventDefault(),vn.getState().toggleActiveView();return}vn.getState().activeView==="cockpit"&&m.target.tagName!=="INPUT"&&(m.key==="1"?vn.getState().setCameraMode("chase"):m.key==="2"?vn.getState().setCameraMode("cabin"):m.key==="3"&&vn.getState().setCameraMode("orbit")),(m.ctrlKey||m.metaKey)&&(m.key==="="||m.key==="+"||m.code==="Equal"||m.code==="NumpadAdd"?(m.preventDefault(),vn.getState().setZoomLevel(g=>g+.1)):m.key==="-"||m.key==="_"||m.code==="Minus"||m.code==="NumpadSubtract"?(m.preventDefault(),vn.getState().setZoomLevel(g=>g-.1)):(m.key==="0"||m.code==="Digit0"||m.code==="Numpad0")&&(m.preventDefault(),vn.getState().setZoomLevel(1)))},_=m=>{if(m.ctrlKey||m.metaKey){m.preventDefault();const g=m.deltaY<0?.05:-.05;vn.getState().setZoomLevel(y=>y+g)}};return window.addEventListener("keydown",f),window.addEventListener("wheel",_,{passive:!1}),()=>{window.removeEventListener("keydown",f),window.removeEventListener("wheel",_)}},[s,e,t]);const{zoomLevel:i,zoomToast:a,setZoomToast:l,activeView:c}=vn();return on.useEffect(()=>{if(a){const d=setTimeout(()=>l(null),1500);return()=>clearTimeout(d)}},[a,l]),on.useEffect(()=>{document.documentElement.style.zoom=String(i)},[i]),E.jsxs("div",{className:"flex flex-col h-full w-full bg-black text-neutral-100 overflow-hidden font-sans select-none antialiased relative",children:[E.jsx(lS,{}),c==="cockpit"?E.jsx("div",{className:"flex-1 flex min-h-0 overflow-hidden relative",children:E.jsx(VA,{})}):E.jsxs("div",{className:"flex-1 flex min-h-0 overflow-hidden",children:[E.jsx(cS,{}),E.jsx(RS,{}),E.jsxs("div",{className:"w-[520px] flex flex-col min-h-0 border-l border-neutral-800 shrink-0 bg-black",children:[E.jsx(PS,{}),E.jsx(LS,{})]})]}),a&&E.jsxs("div",{className:"fixed bottom-5 right-5 z-50 bg-[#0d0d0d] text-cyan-300 font-mono text-xs px-3 py-1.5 rounded-lg border border-neutral-700 shadow-2xl flex items-center gap-2 pointer-events-none backdrop-blur animate-fade-in",children:[E.jsxs("span",{className:"font-bold",children:["Scale: ",a]}),E.jsx("span",{className:"text-[10px] text-neutral-400 font-sans",children:"(Ctrl+0 resets)"})]})]})},WA=new Ry({defaultOptions:{queries:{refetchOnWindowFocus:!1,staleTime:5e3}}});Jv.createRoot(document.getElementById("root")).render(E.jsx(ds.StrictMode,{children:E.jsx(ty,{client:WA,children:E.jsx(GA,{})})}));
