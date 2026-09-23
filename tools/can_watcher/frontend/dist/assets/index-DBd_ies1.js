var Gv=Object.defineProperty;var S0=s=>{throw TypeError(s)};var Wv=(s,e,t)=>e in s?Gv(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var Bt=(s,e,t)=>Wv(s,typeof e!="symbol"?e+"":e,t),$d=(s,e,t)=>e.has(s)||S0("Cannot "+t);var me=(s,e,t)=>($d(s,e,"read from private field"),t?t.call(s):e.get(s)),yt=(s,e,t)=>e.has(s)?S0("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(s):e.set(s,t),st=(s,e,t,i)=>($d(s,e,"write to private field"),i?i.call(s,t):e.set(s,t),t),Fn=(s,e,t)=>($d(s,e,"access private method"),t);var mc=(s,e,t,i)=>({set _(a){st(s,e,a,t)},get _(){return me(s,e,i)}});(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const l of a)if(l.type==="childList")for(const c of l.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function t(a){const l={};return a.integrity&&(l.integrity=a.integrity),a.referrerPolicy&&(l.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?l.credentials="include":a.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function i(a){if(a.ep)return;a.ep=!0;const l=t(a);fetch(a.href,l)}})();function p_(s){return s&&s.__esModule&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s}var Kd={exports:{}},ko={},Zd={exports:{}},xt={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var M0;function jv(){if(M0)return xt;M0=1;var s=Symbol.for("react.element"),e=Symbol.for("react.portal"),t=Symbol.for("react.fragment"),i=Symbol.for("react.strict_mode"),a=Symbol.for("react.profiler"),l=Symbol.for("react.provider"),c=Symbol.for("react.context"),d=Symbol.for("react.forward_ref"),h=Symbol.for("react.suspense"),f=Symbol.for("react.memo"),_=Symbol.for("react.lazy"),m=Symbol.iterator;function g(F){return F===null||typeof F!="object"?null:(F=m&&F[m]||F["@@iterator"],typeof F=="function"?F:null)}var y={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},M=Object.assign,b={};function S(F,ae,Se){this.props=F,this.context=ae,this.refs=b,this.updater=Se||y}S.prototype.isReactComponent={},S.prototype.setState=function(F,ae){if(typeof F!="object"&&typeof F!="function"&&F!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,F,ae,"setState")},S.prototype.forceUpdate=function(F){this.updater.enqueueForceUpdate(this,F,"forceUpdate")};function v(){}v.prototype=S.prototype;function R(F,ae,Se){this.props=F,this.context=ae,this.refs=b,this.updater=Se||y}var I=R.prototype=new v;I.constructor=R,M(I,S.prototype),I.isPureReactComponent=!0;var T=Array.isArray,N=Object.prototype.hasOwnProperty,L={current:null},U={key:!0,ref:!0,__self:!0,__source:!0};function w(F,ae,Se){var Ge,He={},We=null,le=null;if(ae!=null)for(Ge in ae.ref!==void 0&&(le=ae.ref),ae.key!==void 0&&(We=""+ae.key),ae)N.call(ae,Ge)&&!U.hasOwnProperty(Ge)&&(He[Ge]=ae[Ge]);var de=arguments.length-2;if(de===1)He.children=Se;else if(1<de){for(var we=Array(de),et=0;et<de;et++)we[et]=arguments[et+2];He.children=we}if(F&&F.defaultProps)for(Ge in de=F.defaultProps,de)He[Ge]===void 0&&(He[Ge]=de[Ge]);return{$$typeof:s,type:F,key:We,ref:le,props:He,_owner:L.current}}function D(F,ae){return{$$typeof:s,type:F.type,key:ae,ref:F.ref,props:F.props,_owner:F._owner}}function B(F){return typeof F=="object"&&F!==null&&F.$$typeof===s}function z(F){var ae={"=":"=0",":":"=2"};return"$"+F.replace(/[=:]/g,function(Se){return ae[Se]})}var j=/\/+/g;function te(F,ae){return typeof F=="object"&&F!==null&&F.key!=null?z(""+F.key):ae.toString(36)}function V(F,ae,Se,Ge,He){var We=typeof F;(We==="undefined"||We==="boolean")&&(F=null);var le=!1;if(F===null)le=!0;else switch(We){case"string":case"number":le=!0;break;case"object":switch(F.$$typeof){case s:case e:le=!0}}if(le)return le=F,He=He(le),F=Ge===""?"."+te(le,0):Ge,T(He)?(Se="",F!=null&&(Se=F.replace(j,"$&/")+"/"),V(He,ae,Se,"",function(et){return et})):He!=null&&(B(He)&&(He=D(He,Se+(!He.key||le&&le.key===He.key?"":(""+He.key).replace(j,"$&/")+"/")+F)),ae.push(He)),1;if(le=0,Ge=Ge===""?".":Ge+":",T(F))for(var de=0;de<F.length;de++){We=F[de];var we=Ge+te(We,de);le+=V(We,ae,Se,we,He)}else if(we=g(F),typeof we=="function")for(F=we.call(F),de=0;!(We=F.next()).done;)We=We.value,we=Ge+te(We,de++),le+=V(We,ae,Se,we,He);else if(We==="object")throw ae=String(F),Error("Objects are not valid as a React child (found: "+(ae==="[object Object]"?"object with keys {"+Object.keys(F).join(", ")+"}":ae)+"). If you meant to render a collection of children, use an array instead.");return le}function Q(F,ae,Se){if(F==null)return F;var Ge=[],He=0;return V(F,Ge,"","",function(We){return ae.call(Se,We,He++)}),Ge}function he(F){if(F._status===-1){var ae=F._result;ae=ae(),ae.then(function(Se){(F._status===0||F._status===-1)&&(F._status=1,F._result=Se)},function(Se){(F._status===0||F._status===-1)&&(F._status=2,F._result=Se)}),F._status===-1&&(F._status=0,F._result=ae)}if(F._status===1)return F._result.default;throw F._result}var re={current:null},J={transition:null},$={ReactCurrentDispatcher:re,ReactCurrentBatchConfig:J,ReactCurrentOwner:L};function K(){throw Error("act(...) is not supported in production builds of React.")}return xt.Children={map:Q,forEach:function(F,ae,Se){Q(F,function(){ae.apply(this,arguments)},Se)},count:function(F){var ae=0;return Q(F,function(){ae++}),ae},toArray:function(F){return Q(F,function(ae){return ae})||[]},only:function(F){if(!B(F))throw Error("React.Children.only expected to receive a single React element child.");return F}},xt.Component=S,xt.Fragment=t,xt.Profiler=a,xt.PureComponent=R,xt.StrictMode=i,xt.Suspense=h,xt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=$,xt.act=K,xt.cloneElement=function(F,ae,Se){if(F==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+F+".");var Ge=M({},F.props),He=F.key,We=F.ref,le=F._owner;if(ae!=null){if(ae.ref!==void 0&&(We=ae.ref,le=L.current),ae.key!==void 0&&(He=""+ae.key),F.type&&F.type.defaultProps)var de=F.type.defaultProps;for(we in ae)N.call(ae,we)&&!U.hasOwnProperty(we)&&(Ge[we]=ae[we]===void 0&&de!==void 0?de[we]:ae[we])}var we=arguments.length-2;if(we===1)Ge.children=Se;else if(1<we){de=Array(we);for(var et=0;et<we;et++)de[et]=arguments[et+2];Ge.children=de}return{$$typeof:s,type:F.type,key:He,ref:We,props:Ge,_owner:le}},xt.createContext=function(F){return F={$$typeof:c,_currentValue:F,_currentValue2:F,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},F.Provider={$$typeof:l,_context:F},F.Consumer=F},xt.createElement=w,xt.createFactory=function(F){var ae=w.bind(null,F);return ae.type=F,ae},xt.createRef=function(){return{current:null}},xt.forwardRef=function(F){return{$$typeof:d,render:F}},xt.isValidElement=B,xt.lazy=function(F){return{$$typeof:_,_payload:{_status:-1,_result:F},_init:he}},xt.memo=function(F,ae){return{$$typeof:f,type:F,compare:ae===void 0?null:ae}},xt.startTransition=function(F){var ae=J.transition;J.transition={};try{F()}finally{J.transition=ae}},xt.unstable_act=K,xt.useCallback=function(F,ae){return re.current.useCallback(F,ae)},xt.useContext=function(F){return re.current.useContext(F)},xt.useDebugValue=function(){},xt.useDeferredValue=function(F){return re.current.useDeferredValue(F)},xt.useEffect=function(F,ae){return re.current.useEffect(F,ae)},xt.useId=function(){return re.current.useId()},xt.useImperativeHandle=function(F,ae,Se){return re.current.useImperativeHandle(F,ae,Se)},xt.useInsertionEffect=function(F,ae){return re.current.useInsertionEffect(F,ae)},xt.useLayoutEffect=function(F,ae){return re.current.useLayoutEffect(F,ae)},xt.useMemo=function(F,ae){return re.current.useMemo(F,ae)},xt.useReducer=function(F,ae,Se){return re.current.useReducer(F,ae,Se)},xt.useRef=function(F){return re.current.useRef(F)},xt.useState=function(F){return re.current.useState(F)},xt.useSyncExternalStore=function(F,ae,Se){return re.current.useSyncExternalStore(F,ae,Se)},xt.useTransition=function(){return re.current.useTransition()},xt.version="18.3.1",xt}var E0;function Df(){return E0||(E0=1,Zd.exports=jv()),Zd.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var w0;function Xv(){if(w0)return ko;w0=1;var s=Df(),e=Symbol.for("react.element"),t=Symbol.for("react.fragment"),i=Object.prototype.hasOwnProperty,a=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l={key:!0,ref:!0,__self:!0,__source:!0};function c(d,h,f){var _,m={},g=null,y=null;f!==void 0&&(g=""+f),h.key!==void 0&&(g=""+h.key),h.ref!==void 0&&(y=h.ref);for(_ in h)i.call(h,_)&&!l.hasOwnProperty(_)&&(m[_]=h[_]);if(d&&d.defaultProps)for(_ in h=d.defaultProps,h)m[_]===void 0&&(m[_]=h[_]);return{$$typeof:e,type:d,key:g,ref:y,props:m,_owner:a.current}}return ko.Fragment=t,ko.jsx=c,ko.jsxs=c,ko}var b0;function qv(){return b0||(b0=1,Kd.exports=Xv()),Kd.exports}var A=qv(),an=Df();const ds=p_(an);var gc={},Qd={exports:{}},Jn={},Jd={exports:{}},eh={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var T0;function Yv(){return T0||(T0=1,(function(s){function e(J,$){var K=J.length;J.push($);e:for(;0<K;){var F=K-1>>>1,ae=J[F];if(0<a(ae,$))J[F]=$,J[K]=ae,K=F;else break e}}function t(J){return J.length===0?null:J[0]}function i(J){if(J.length===0)return null;var $=J[0],K=J.pop();if(K!==$){J[0]=K;e:for(var F=0,ae=J.length,Se=ae>>>1;F<Se;){var Ge=2*(F+1)-1,He=J[Ge],We=Ge+1,le=J[We];if(0>a(He,K))We<ae&&0>a(le,He)?(J[F]=le,J[We]=K,F=We):(J[F]=He,J[Ge]=K,F=Ge);else if(We<ae&&0>a(le,K))J[F]=le,J[We]=K,F=We;else break e}}return $}function a(J,$){var K=J.sortIndex-$.sortIndex;return K!==0?K:J.id-$.id}if(typeof performance=="object"&&typeof performance.now=="function"){var l=performance;s.unstable_now=function(){return l.now()}}else{var c=Date,d=c.now();s.unstable_now=function(){return c.now()-d}}var h=[],f=[],_=1,m=null,g=3,y=!1,M=!1,b=!1,S=typeof setTimeout=="function"?setTimeout:null,v=typeof clearTimeout=="function"?clearTimeout:null,R=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function I(J){for(var $=t(f);$!==null;){if($.callback===null)i(f);else if($.startTime<=J)i(f),$.sortIndex=$.expirationTime,e(h,$);else break;$=t(f)}}function T(J){if(b=!1,I(J),!M)if(t(h)!==null)M=!0,he(N);else{var $=t(f);$!==null&&re(T,$.startTime-J)}}function N(J,$){M=!1,b&&(b=!1,v(w),w=-1),y=!0;var K=g;try{for(I($),m=t(h);m!==null&&(!(m.expirationTime>$)||J&&!z());){var F=m.callback;if(typeof F=="function"){m.callback=null,g=m.priorityLevel;var ae=F(m.expirationTime<=$);$=s.unstable_now(),typeof ae=="function"?m.callback=ae:m===t(h)&&i(h),I($)}else i(h);m=t(h)}if(m!==null)var Se=!0;else{var Ge=t(f);Ge!==null&&re(T,Ge.startTime-$),Se=!1}return Se}finally{m=null,g=K,y=!1}}var L=!1,U=null,w=-1,D=5,B=-1;function z(){return!(s.unstable_now()-B<D)}function j(){if(U!==null){var J=s.unstable_now();B=J;var $=!0;try{$=U(!0,J)}finally{$?te():(L=!1,U=null)}}else L=!1}var te;if(typeof R=="function")te=function(){R(j)};else if(typeof MessageChannel<"u"){var V=new MessageChannel,Q=V.port2;V.port1.onmessage=j,te=function(){Q.postMessage(null)}}else te=function(){S(j,0)};function he(J){U=J,L||(L=!0,te())}function re(J,$){w=S(function(){J(s.unstable_now())},$)}s.unstable_IdlePriority=5,s.unstable_ImmediatePriority=1,s.unstable_LowPriority=4,s.unstable_NormalPriority=3,s.unstable_Profiling=null,s.unstable_UserBlockingPriority=2,s.unstable_cancelCallback=function(J){J.callback=null},s.unstable_continueExecution=function(){M||y||(M=!0,he(N))},s.unstable_forceFrameRate=function(J){0>J||125<J?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):D=0<J?Math.floor(1e3/J):5},s.unstable_getCurrentPriorityLevel=function(){return g},s.unstable_getFirstCallbackNode=function(){return t(h)},s.unstable_next=function(J){switch(g){case 1:case 2:case 3:var $=3;break;default:$=g}var K=g;g=$;try{return J()}finally{g=K}},s.unstable_pauseExecution=function(){},s.unstable_requestPaint=function(){},s.unstable_runWithPriority=function(J,$){switch(J){case 1:case 2:case 3:case 4:case 5:break;default:J=3}var K=g;g=J;try{return $()}finally{g=K}},s.unstable_scheduleCallback=function(J,$,K){var F=s.unstable_now();switch(typeof K=="object"&&K!==null?(K=K.delay,K=typeof K=="number"&&0<K?F+K:F):K=F,J){case 1:var ae=-1;break;case 2:ae=250;break;case 5:ae=1073741823;break;case 4:ae=1e4;break;default:ae=5e3}return ae=K+ae,J={id:_++,callback:$,priorityLevel:J,startTime:K,expirationTime:ae,sortIndex:-1},K>F?(J.sortIndex=K,e(f,J),t(h)===null&&J===t(f)&&(b?(v(w),w=-1):b=!0,re(T,K-F))):(J.sortIndex=ae,e(h,J),M||y||(M=!0,he(N))),J},s.unstable_shouldYield=z,s.unstable_wrapCallback=function(J){var $=g;return function(){var K=g;g=$;try{return J.apply(this,arguments)}finally{g=K}}}})(eh)),eh}var A0;function $v(){return A0||(A0=1,Jd.exports=Yv()),Jd.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var C0;function Kv(){if(C0)return Jn;C0=1;var s=Df(),e=$v();function t(n){for(var r="https://reactjs.org/docs/error-decoder.html?invariant="+n,o=1;o<arguments.length;o++)r+="&args[]="+encodeURIComponent(arguments[o]);return"Minified React error #"+n+"; visit "+r+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var i=new Set,a={};function l(n,r){c(n,r),c(n+"Capture",r)}function c(n,r){for(a[n]=r,n=0;n<r.length;n++)i.add(r[n])}var d=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),h=Object.prototype.hasOwnProperty,f=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,_={},m={};function g(n){return h.call(m,n)?!0:h.call(_,n)?!1:f.test(n)?m[n]=!0:(_[n]=!0,!1)}function y(n,r,o,u){if(o!==null&&o.type===0)return!1;switch(typeof r){case"function":case"symbol":return!0;case"boolean":return u?!1:o!==null?!o.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function M(n,r,o,u){if(r===null||typeof r>"u"||y(n,r,o,u))return!0;if(u)return!1;if(o!==null)switch(o.type){case 3:return!r;case 4:return r===!1;case 5:return isNaN(r);case 6:return isNaN(r)||1>r}return!1}function b(n,r,o,u,p,x,C){this.acceptsBooleans=r===2||r===3||r===4,this.attributeName=u,this.attributeNamespace=p,this.mustUseProperty=o,this.propertyName=n,this.type=r,this.sanitizeURL=x,this.removeEmptyString=C}var S={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){S[n]=new b(n,0,!1,n,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var r=n[0];S[r]=new b(r,1,!1,n[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(n){S[n]=new b(n,2,!1,n.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){S[n]=new b(n,2,!1,n,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){S[n]=new b(n,3,!1,n.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(n){S[n]=new b(n,3,!0,n,null,!1,!1)}),["capture","download"].forEach(function(n){S[n]=new b(n,4,!1,n,null,!1,!1)}),["cols","rows","size","span"].forEach(function(n){S[n]=new b(n,6,!1,n,null,!1,!1)}),["rowSpan","start"].forEach(function(n){S[n]=new b(n,5,!1,n.toLowerCase(),null,!1,!1)});var v=/[\-:]([a-z])/g;function R(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var r=n.replace(v,R);S[r]=new b(r,1,!1,n,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var r=n.replace(v,R);S[r]=new b(r,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(n){var r=n.replace(v,R);S[r]=new b(r,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(n){S[n]=new b(n,1,!1,n.toLowerCase(),null,!1,!1)}),S.xlinkHref=new b("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(n){S[n]=new b(n,1,!1,n.toLowerCase(),null,!0,!0)});function I(n,r,o,u){var p=S.hasOwnProperty(r)?S[r]:null;(p!==null?p.type!==0:u||!(2<r.length)||r[0]!=="o"&&r[0]!=="O"||r[1]!=="n"&&r[1]!=="N")&&(M(r,o,p,u)&&(o=null),u||p===null?g(r)&&(o===null?n.removeAttribute(r):n.setAttribute(r,""+o)):p.mustUseProperty?n[p.propertyName]=o===null?p.type===3?!1:"":o:(r=p.attributeName,u=p.attributeNamespace,o===null?n.removeAttribute(r):(p=p.type,o=p===3||p===4&&o===!0?"":""+o,u?n.setAttributeNS(u,r,o):n.setAttribute(r,o))))}var T=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,N=Symbol.for("react.element"),L=Symbol.for("react.portal"),U=Symbol.for("react.fragment"),w=Symbol.for("react.strict_mode"),D=Symbol.for("react.profiler"),B=Symbol.for("react.provider"),z=Symbol.for("react.context"),j=Symbol.for("react.forward_ref"),te=Symbol.for("react.suspense"),V=Symbol.for("react.suspense_list"),Q=Symbol.for("react.memo"),he=Symbol.for("react.lazy"),re=Symbol.for("react.offscreen"),J=Symbol.iterator;function $(n){return n===null||typeof n!="object"?null:(n=J&&n[J]||n["@@iterator"],typeof n=="function"?n:null)}var K=Object.assign,F;function ae(n){if(F===void 0)try{throw Error()}catch(o){var r=o.stack.trim().match(/\n( *(at )?)/);F=r&&r[1]||""}return`
`+F+n}var Se=!1;function Ge(n,r){if(!n||Se)return"";Se=!0;var o=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(r)if(r=function(){throw Error()},Object.defineProperty(r.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(r,[])}catch(ue){var u=ue}Reflect.construct(n,[],r)}else{try{r.call()}catch(ue){u=ue}n.call(r.prototype)}else{try{throw Error()}catch(ue){u=ue}n()}}catch(ue){if(ue&&u&&typeof ue.stack=="string"){for(var p=ue.stack.split(`
`),x=u.stack.split(`
`),C=p.length-1,k=x.length-1;1<=C&&0<=k&&p[C]!==x[k];)k--;for(;1<=C&&0<=k;C--,k--)if(p[C]!==x[k]){if(C!==1||k!==1)do if(C--,k--,0>k||p[C]!==x[k]){var H=`
`+p[C].replace(" at new "," at ");return n.displayName&&H.includes("<anonymous>")&&(H=H.replace("<anonymous>",n.displayName)),H}while(1<=C&&0<=k);break}}}finally{Se=!1,Error.prepareStackTrace=o}return(n=n?n.displayName||n.name:"")?ae(n):""}function He(n){switch(n.tag){case 5:return ae(n.type);case 16:return ae("Lazy");case 13:return ae("Suspense");case 19:return ae("SuspenseList");case 0:case 2:case 15:return n=Ge(n.type,!1),n;case 11:return n=Ge(n.type.render,!1),n;case 1:return n=Ge(n.type,!0),n;default:return""}}function We(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case U:return"Fragment";case L:return"Portal";case D:return"Profiler";case w:return"StrictMode";case te:return"Suspense";case V:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case z:return(n.displayName||"Context")+".Consumer";case B:return(n._context.displayName||"Context")+".Provider";case j:var r=n.render;return n=n.displayName,n||(n=r.displayName||r.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case Q:return r=n.displayName||null,r!==null?r:We(n.type)||"Memo";case he:r=n._payload,n=n._init;try{return We(n(r))}catch{}}return null}function le(n){var r=n.type;switch(n.tag){case 24:return"Cache";case 9:return(r.displayName||"Context")+".Consumer";case 10:return(r._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=r.render,n=n.displayName||n.name||"",r.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return r;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return We(r);case 8:return r===w?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof r=="function")return r.displayName||r.name||null;if(typeof r=="string")return r}return null}function de(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function we(n){var r=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(r==="checkbox"||r==="radio")}function et(n){var r=we(n)?"checked":"value",o=Object.getOwnPropertyDescriptor(n.constructor.prototype,r),u=""+n[r];if(!n.hasOwnProperty(r)&&typeof o<"u"&&typeof o.get=="function"&&typeof o.set=="function"){var p=o.get,x=o.set;return Object.defineProperty(n,r,{configurable:!0,get:function(){return p.call(this)},set:function(C){u=""+C,x.call(this,C)}}),Object.defineProperty(n,r,{enumerable:o.enumerable}),{getValue:function(){return u},setValue:function(C){u=""+C},stopTracking:function(){n._valueTracker=null,delete n[r]}}}}function Oe(n){n._valueTracker||(n._valueTracker=et(n))}function ft(n){if(!n)return!1;var r=n._valueTracker;if(!r)return!0;var o=r.getValue(),u="";return n&&(u=we(n)?n.checked?"true":"false":n.value),n=u,n!==o?(r.setValue(n),!0):!1}function Xt(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function pt(n,r){var o=r.checked;return K({},r,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:o??n._wrapperState.initialChecked})}function St(n,r){var o=r.defaultValue==null?"":r.defaultValue,u=r.checked!=null?r.checked:r.defaultChecked;o=de(r.value!=null?r.value:o),n._wrapperState={initialChecked:u,initialValue:o,controlled:r.type==="checkbox"||r.type==="radio"?r.checked!=null:r.value!=null}}function It(n,r){r=r.checked,r!=null&&I(n,"checked",r,!1)}function mt(n,r){It(n,r);var o=de(r.value),u=r.type;if(o!=null)u==="number"?(o===0&&n.value===""||n.value!=o)&&(n.value=""+o):n.value!==""+o&&(n.value=""+o);else if(u==="submit"||u==="reset"){n.removeAttribute("value");return}r.hasOwnProperty("value")?nn(n,r.type,o):r.hasOwnProperty("defaultValue")&&nn(n,r.type,de(r.defaultValue)),r.checked==null&&r.defaultChecked!=null&&(n.defaultChecked=!!r.defaultChecked)}function Ht(n,r,o){if(r.hasOwnProperty("value")||r.hasOwnProperty("defaultValue")){var u=r.type;if(!(u!=="submit"&&u!=="reset"||r.value!==void 0&&r.value!==null))return;r=""+n._wrapperState.initialValue,o||r===n.value||(n.value=r),n.defaultValue=r}o=n.name,o!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,o!==""&&(n.name=o)}function nn(n,r,o){(r!=="number"||Xt(n.ownerDocument)!==n)&&(o==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+o&&(n.defaultValue=""+o))}var cn=Array.isArray;function Dt(n,r,o,u){if(n=n.options,r){r={};for(var p=0;p<o.length;p++)r["$"+o[p]]=!0;for(o=0;o<n.length;o++)p=r.hasOwnProperty("$"+n[o].value),n[o].selected!==p&&(n[o].selected=p),p&&u&&(n[o].defaultSelected=!0)}else{for(o=""+de(o),r=null,p=0;p<n.length;p++){if(n[p].value===o){n[p].selected=!0,u&&(n[p].defaultSelected=!0);return}r!==null||n[p].disabled||(r=n[p])}r!==null&&(r.selected=!0)}}function qt(n,r){if(r.dangerouslySetInnerHTML!=null)throw Error(t(91));return K({},r,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function X(n,r){var o=r.value;if(o==null){if(o=r.children,r=r.defaultValue,o!=null){if(r!=null)throw Error(t(92));if(cn(o)){if(1<o.length)throw Error(t(93));o=o[0]}r=o}r==null&&(r=""),o=r}n._wrapperState={initialValue:de(o)}}function fn(n,r){var o=de(r.value),u=de(r.defaultValue);o!=null&&(o=""+o,o!==n.value&&(n.value=o),r.defaultValue==null&&n.defaultValue!==o&&(n.defaultValue=o)),u!=null&&(n.defaultValue=""+u)}function At(n){var r=n.textContent;r===n._wrapperState.initialValue&&r!==""&&r!==null&&(n.value=r)}function O(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function E(n,r){return n==null||n==="http://www.w3.org/1999/xhtml"?O(r):n==="http://www.w3.org/2000/svg"&&r==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var Z,oe=(function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(r,o,u,p){MSApp.execUnsafeLocalFunction(function(){return n(r,o,u,p)})}:n})(function(n,r){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=r;else{for(Z=Z||document.createElement("div"),Z.innerHTML="<svg>"+r.valueOf().toString()+"</svg>",r=Z.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;r.firstChild;)n.appendChild(r.firstChild)}});function fe(n,r){if(r){var o=n.firstChild;if(o&&o===n.lastChild&&o.nodeType===3){o.nodeValue=r;return}}n.textContent=r}var Ee={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Ae=["Webkit","ms","Moz","O"];Object.keys(Ee).forEach(function(n){Ae.forEach(function(r){r=r+n.charAt(0).toUpperCase()+n.substring(1),Ee[r]=Ee[n]})});function pe(n,r,o){return r==null||typeof r=="boolean"||r===""?"":o||typeof r!="number"||r===0||Ee.hasOwnProperty(n)&&Ee[n]?(""+r).trim():r+"px"}function _e(n,r){n=n.style;for(var o in r)if(r.hasOwnProperty(o)){var u=o.indexOf("--")===0,p=pe(o,r[o],u);o==="float"&&(o="cssFloat"),u?n.setProperty(o,p):n[o]=p}}var Pe=K({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function $e(n,r){if(r){if(Pe[n]&&(r.children!=null||r.dangerouslySetInnerHTML!=null))throw Error(t(137,n));if(r.dangerouslySetInnerHTML!=null){if(r.children!=null)throw Error(t(60));if(typeof r.dangerouslySetInnerHTML!="object"||!("__html"in r.dangerouslySetInnerHTML))throw Error(t(61))}if(r.style!=null&&typeof r.style!="object")throw Error(t(62))}}function Ne(n,r){if(n.indexOf("-")===-1)return typeof r.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Te=null;function Ke(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var tt=null,rt=null,G=null;function Ce(n){if(n=Eo(n)){if(typeof tt!="function")throw Error(t(280));var r=n.stateNode;r&&(r=Pl(r),tt(n.stateNode,n.type,r))}}function ge(n){rt?G?G.push(n):G=[n]:rt=n}function Re(){if(rt){var n=rt,r=G;if(G=rt=null,Ce(n),r)for(n=0;n<r.length;n++)Ce(r[n])}}function Fe(n,r){return n(r)}function xe(){}var Qe=!1;function qe(n,r,o){if(Qe)return n(r,o);Qe=!0;try{return Fe(n,r,o)}finally{Qe=!1,(rt!==null||G!==null)&&(xe(),Re())}}function Ct(n,r){var o=n.stateNode;if(o===null)return null;var u=Pl(o);if(u===null)return null;o=u[r];e:switch(r){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(u=!u.disabled)||(n=n.type,u=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!u;break e;default:n=!1}if(n)return null;if(o&&typeof o!="function")throw Error(t(231,r,typeof o));return o}var bt=!1;if(d)try{var An={};Object.defineProperty(An,"passive",{get:function(){bt=!0}}),window.addEventListener("test",An,An),window.removeEventListener("test",An,An)}catch{bt=!1}function hi(n,r,o,u,p,x,C,k,H){var ue=Array.prototype.slice.call(arguments,3);try{r.apply(o,ue)}catch(ye){this.onError(ye)}}var ps=!1,Zs=null,ms=!1,gs=null,xu={onError:function(n){ps=!0,Zs=n}};function hl(n,r,o,u,p,x,C,k,H){ps=!1,Zs=null,hi.apply(xu,arguments)}function fl(n,r,o,u,p,x,C,k,H){if(hl.apply(this,arguments),ps){if(ps){var ue=Zs;ps=!1,Zs=null}else throw Error(t(198));ms||(ms=!0,gs=ue)}}function Hn(n){var r=n,o=n;if(n.alternate)for(;r.return;)r=r.return;else{n=r;do r=n,(r.flags&4098)!==0&&(o=r.return),n=r.return;while(n)}return r.tag===3?o:null}function Qs(n){if(n.tag===13){var r=n.memoizedState;if(r===null&&(n=n.alternate,n!==null&&(r=n.memoizedState)),r!==null)return r.dehydrated}return null}function to(n){if(Hn(n)!==n)throw Error(t(188))}function pl(n){var r=n.alternate;if(!r){if(r=Hn(n),r===null)throw Error(t(188));return r!==n?null:n}for(var o=n,u=r;;){var p=o.return;if(p===null)break;var x=p.alternate;if(x===null){if(u=p.return,u!==null){o=u;continue}break}if(p.child===x.child){for(x=p.child;x;){if(x===o)return to(p),n;if(x===u)return to(p),r;x=x.sibling}throw Error(t(188))}if(o.return!==u.return)o=p,u=x;else{for(var C=!1,k=p.child;k;){if(k===o){C=!0,o=p,u=x;break}if(k===u){C=!0,u=p,o=x;break}k=k.sibling}if(!C){for(k=x.child;k;){if(k===o){C=!0,o=x,u=p;break}if(k===u){C=!0,u=x,o=p;break}k=k.sibling}if(!C)throw Error(t(189))}}if(o.alternate!==u)throw Error(t(190))}if(o.tag!==3)throw Error(t(188));return o.stateNode.current===o?n:r}function _s(n){return n=pl(n),n!==null?no(n):null}function no(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var r=no(n);if(r!==null)return r;n=n.sibling}return null}var xs=e.unstable_scheduleCallback,io=e.unstable_cancelCallback,ml=e.unstable_shouldYield,vu=e.unstable_requestPaint,Kt=e.unstable_now,yu=e.unstable_getCurrentPriorityLevel,ro=e.unstable_ImmediatePriority,so=e.unstable_UserBlockingPriority,P=e.unstable_NormalPriority,W=e.unstable_LowPriority,ce=e.unstable_IdlePriority,ne=null,ee=null;function Ie(n){if(ee&&typeof ee.onCommitFiberRoot=="function")try{ee.onCommitFiberRoot(ne,n,void 0,(n.current.flags&128)===128)}catch{}}var Le=Math.clz32?Math.clz32:Ze,De=Math.log,je=Math.LN2;function Ze(n){return n>>>=0,n===0?32:31-(De(n)/je|0)|0}var ct=64,ht=4194304;function ze(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function Mt(n,r){var o=n.pendingLanes;if(o===0)return 0;var u=0,p=n.suspendedLanes,x=n.pingedLanes,C=o&268435455;if(C!==0){var k=C&~p;k!==0?u=ze(k):(x&=C,x!==0&&(u=ze(x)))}else C=o&~p,C!==0?u=ze(C):x!==0&&(u=ze(x));if(u===0)return 0;if(r!==0&&r!==u&&(r&p)===0&&(p=u&-u,x=r&-r,p>=x||p===16&&(x&4194240)!==0))return r;if((u&4)!==0&&(u|=o&16),r=n.entangledLanes,r!==0)for(n=n.entanglements,r&=u;0<r;)o=31-Le(r),p=1<<o,u|=n[o],r&=~p;return u}function rn(n,r){switch(n){case 1:case 2:case 4:return r+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return r+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Vt(n,r){for(var o=n.suspendedLanes,u=n.pingedLanes,p=n.expirationTimes,x=n.pendingLanes;0<x;){var C=31-Le(x),k=1<<C,H=p[C];H===-1?((k&o)===0||(k&u)!==0)&&(p[C]=rn(k,r)):H<=r&&(n.expiredLanes|=k),x&=~k}}function Lt(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function pn(){var n=ct;return ct<<=1,(ct&4194240)===0&&(ct=64),n}function ke(n){for(var r=[],o=0;31>o;o++)r.push(n);return r}function on(n,r,o){n.pendingLanes|=r,r!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,r=31-Le(r),n[r]=o}function Et(n,r){var o=n.pendingLanes&~r;n.pendingLanes=r,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=r,n.mutableReadLanes&=r,n.entangledLanes&=r,r=n.entanglements;var u=n.eventTimes;for(n=n.expirationTimes;0<o;){var p=31-Le(o),x=1<<p;r[p]=0,u[p]=-1,n[p]=-1,o&=~x}}function Nn(n,r){var o=n.entangledLanes|=r;for(n=n.entanglements;o;){var u=31-Le(o),p=1<<u;p&r|n[u]&r&&(n[u]|=r),o&=~p}}var gt=0;function wi(n){return n&=-n,1<n?4<n?(n&268435455)!==0?16:536870912:4:1}var ur,Rt,Yt,bi,Ut,fi=!1,Ti=[],Ai=null,Ir=null,Ur=null,ao=new Map,oo=new Map,Fr=[],dx="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function rp(n,r){switch(n){case"focusin":case"focusout":Ai=null;break;case"dragenter":case"dragleave":Ir=null;break;case"mouseover":case"mouseout":Ur=null;break;case"pointerover":case"pointerout":ao.delete(r.pointerId);break;case"gotpointercapture":case"lostpointercapture":oo.delete(r.pointerId)}}function lo(n,r,o,u,p,x){return n===null||n.nativeEvent!==x?(n={blockedOn:r,domEventName:o,eventSystemFlags:u,nativeEvent:x,targetContainers:[p]},r!==null&&(r=Eo(r),r!==null&&Rt(r)),n):(n.eventSystemFlags|=u,r=n.targetContainers,p!==null&&r.indexOf(p)===-1&&r.push(p),n)}function hx(n,r,o,u,p){switch(r){case"focusin":return Ai=lo(Ai,n,r,o,u,p),!0;case"dragenter":return Ir=lo(Ir,n,r,o,u,p),!0;case"mouseover":return Ur=lo(Ur,n,r,o,u,p),!0;case"pointerover":var x=p.pointerId;return ao.set(x,lo(ao.get(x)||null,n,r,o,u,p)),!0;case"gotpointercapture":return x=p.pointerId,oo.set(x,lo(oo.get(x)||null,n,r,o,u,p)),!0}return!1}function sp(n){var r=vs(n.target);if(r!==null){var o=Hn(r);if(o!==null){if(r=o.tag,r===13){if(r=Qs(o),r!==null){n.blockedOn=r,Ut(n.priority,function(){Yt(o)});return}}else if(r===3&&o.stateNode.current.memoizedState.isDehydrated){n.blockedOn=o.tag===3?o.stateNode.containerInfo:null;return}}}n.blockedOn=null}function gl(n){if(n.blockedOn!==null)return!1;for(var r=n.targetContainers;0<r.length;){var o=Mu(n.domEventName,n.eventSystemFlags,r[0],n.nativeEvent);if(o===null){o=n.nativeEvent;var u=new o.constructor(o.type,o);Te=u,o.target.dispatchEvent(u),Te=null}else return r=Eo(o),r!==null&&Rt(r),n.blockedOn=o,!1;r.shift()}return!0}function ap(n,r,o){gl(n)&&o.delete(r)}function fx(){fi=!1,Ai!==null&&gl(Ai)&&(Ai=null),Ir!==null&&gl(Ir)&&(Ir=null),Ur!==null&&gl(Ur)&&(Ur=null),ao.forEach(ap),oo.forEach(ap)}function co(n,r){n.blockedOn===r&&(n.blockedOn=null,fi||(fi=!0,e.unstable_scheduleCallback(e.unstable_NormalPriority,fx)))}function uo(n){function r(p){return co(p,n)}if(0<Ti.length){co(Ti[0],n);for(var o=1;o<Ti.length;o++){var u=Ti[o];u.blockedOn===n&&(u.blockedOn=null)}}for(Ai!==null&&co(Ai,n),Ir!==null&&co(Ir,n),Ur!==null&&co(Ur,n),ao.forEach(r),oo.forEach(r),o=0;o<Fr.length;o++)u=Fr[o],u.blockedOn===n&&(u.blockedOn=null);for(;0<Fr.length&&(o=Fr[0],o.blockedOn===null);)sp(o),o.blockedOn===null&&Fr.shift()}var Js=T.ReactCurrentBatchConfig,_l=!0;function px(n,r,o,u){var p=gt,x=Js.transition;Js.transition=null;try{gt=1,Su(n,r,o,u)}finally{gt=p,Js.transition=x}}function mx(n,r,o,u){var p=gt,x=Js.transition;Js.transition=null;try{gt=4,Su(n,r,o,u)}finally{gt=p,Js.transition=x}}function Su(n,r,o,u){if(_l){var p=Mu(n,r,o,u);if(p===null)Bu(n,r,u,xl,o),rp(n,u);else if(hx(p,n,r,o,u))u.stopPropagation();else if(rp(n,u),r&4&&-1<dx.indexOf(n)){for(;p!==null;){var x=Eo(p);if(x!==null&&ur(x),x=Mu(n,r,o,u),x===null&&Bu(n,r,u,xl,o),x===p)break;p=x}p!==null&&u.stopPropagation()}else Bu(n,r,u,null,o)}}var xl=null;function Mu(n,r,o,u){if(xl=null,n=Ke(u),n=vs(n),n!==null)if(r=Hn(n),r===null)n=null;else if(o=r.tag,o===13){if(n=Qs(r),n!==null)return n;n=null}else if(o===3){if(r.stateNode.current.memoizedState.isDehydrated)return r.tag===3?r.stateNode.containerInfo:null;n=null}else r!==n&&(n=null);return xl=n,null}function op(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(yu()){case ro:return 1;case so:return 4;case P:case W:return 16;case ce:return 536870912;default:return 16}default:return 16}}var Or=null,Eu=null,vl=null;function lp(){if(vl)return vl;var n,r=Eu,o=r.length,u,p="value"in Or?Or.value:Or.textContent,x=p.length;for(n=0;n<o&&r[n]===p[n];n++);var C=o-n;for(u=1;u<=C&&r[o-u]===p[x-u];u++);return vl=p.slice(n,1<u?1-u:void 0)}function yl(n){var r=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&r===13&&(n=13)):n=r,n===10&&(n=13),32<=n||n===13?n:0}function Sl(){return!0}function cp(){return!1}function ii(n){function r(o,u,p,x,C){this._reactName=o,this._targetInst=p,this.type=u,this.nativeEvent=x,this.target=C,this.currentTarget=null;for(var k in n)n.hasOwnProperty(k)&&(o=n[k],this[k]=o?o(x):x[k]);return this.isDefaultPrevented=(x.defaultPrevented!=null?x.defaultPrevented:x.returnValue===!1)?Sl:cp,this.isPropagationStopped=cp,this}return K(r.prototype,{preventDefault:function(){this.defaultPrevented=!0;var o=this.nativeEvent;o&&(o.preventDefault?o.preventDefault():typeof o.returnValue!="unknown"&&(o.returnValue=!1),this.isDefaultPrevented=Sl)},stopPropagation:function(){var o=this.nativeEvent;o&&(o.stopPropagation?o.stopPropagation():typeof o.cancelBubble!="unknown"&&(o.cancelBubble=!0),this.isPropagationStopped=Sl)},persist:function(){},isPersistent:Sl}),r}var ea={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},wu=ii(ea),ho=K({},ea,{view:0,detail:0}),gx=ii(ho),bu,Tu,fo,Ml=K({},ho,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Cu,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==fo&&(fo&&n.type==="mousemove"?(bu=n.screenX-fo.screenX,Tu=n.screenY-fo.screenY):Tu=bu=0,fo=n),bu)},movementY:function(n){return"movementY"in n?n.movementY:Tu}}),up=ii(Ml),_x=K({},Ml,{dataTransfer:0}),xx=ii(_x),vx=K({},ho,{relatedTarget:0}),Au=ii(vx),yx=K({},ea,{animationName:0,elapsedTime:0,pseudoElement:0}),Sx=ii(yx),Mx=K({},ea,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),Ex=ii(Mx),wx=K({},ea,{data:0}),dp=ii(wx),bx={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Tx={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Ax={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Cx(n){var r=this.nativeEvent;return r.getModifierState?r.getModifierState(n):(n=Ax[n])?!!r[n]:!1}function Cu(){return Cx}var Rx=K({},ho,{key:function(n){if(n.key){var r=bx[n.key]||n.key;if(r!=="Unidentified")return r}return n.type==="keypress"?(n=yl(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?Tx[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Cu,charCode:function(n){return n.type==="keypress"?yl(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?yl(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),Px=ii(Rx),Nx=K({},Ml,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),hp=ii(Nx),Lx=K({},ho,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Cu}),Dx=ii(Lx),Ix=K({},ea,{propertyName:0,elapsedTime:0,pseudoElement:0}),Ux=ii(Ix),Fx=K({},Ml,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),Ox=ii(Fx),kx=[9,13,27,32],Ru=d&&"CompositionEvent"in window,po=null;d&&"documentMode"in document&&(po=document.documentMode);var Bx=d&&"TextEvent"in window&&!po,fp=d&&(!Ru||po&&8<po&&11>=po),pp=" ",mp=!1;function gp(n,r){switch(n){case"keyup":return kx.indexOf(r.keyCode)!==-1;case"keydown":return r.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function _p(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var ta=!1;function zx(n,r){switch(n){case"compositionend":return _p(r);case"keypress":return r.which!==32?null:(mp=!0,pp);case"textInput":return n=r.data,n===pp&&mp?null:n;default:return null}}function Hx(n,r){if(ta)return n==="compositionend"||!Ru&&gp(n,r)?(n=lp(),vl=Eu=Or=null,ta=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(r.ctrlKey||r.altKey||r.metaKey)||r.ctrlKey&&r.altKey){if(r.char&&1<r.char.length)return r.char;if(r.which)return String.fromCharCode(r.which)}return null;case"compositionend":return fp&&r.locale!=="ko"?null:r.data;default:return null}}var Vx={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function xp(n){var r=n&&n.nodeName&&n.nodeName.toLowerCase();return r==="input"?!!Vx[n.type]:r==="textarea"}function vp(n,r,o,u){ge(u),r=Al(r,"onChange"),0<r.length&&(o=new wu("onChange","change",null,o,u),n.push({event:o,listeners:r}))}var mo=null,go=null;function Gx(n){Op(n,0)}function El(n){var r=aa(n);if(ft(r))return n}function Wx(n,r){if(n==="change")return r}var yp=!1;if(d){var Pu;if(d){var Nu="oninput"in document;if(!Nu){var Sp=document.createElement("div");Sp.setAttribute("oninput","return;"),Nu=typeof Sp.oninput=="function"}Pu=Nu}else Pu=!1;yp=Pu&&(!document.documentMode||9<document.documentMode)}function Mp(){mo&&(mo.detachEvent("onpropertychange",Ep),go=mo=null)}function Ep(n){if(n.propertyName==="value"&&El(go)){var r=[];vp(r,go,n,Ke(n)),qe(Gx,r)}}function jx(n,r,o){n==="focusin"?(Mp(),mo=r,go=o,mo.attachEvent("onpropertychange",Ep)):n==="focusout"&&Mp()}function Xx(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return El(go)}function qx(n,r){if(n==="click")return El(r)}function Yx(n,r){if(n==="input"||n==="change")return El(r)}function $x(n,r){return n===r&&(n!==0||1/n===1/r)||n!==n&&r!==r}var Ci=typeof Object.is=="function"?Object.is:$x;function _o(n,r){if(Ci(n,r))return!0;if(typeof n!="object"||n===null||typeof r!="object"||r===null)return!1;var o=Object.keys(n),u=Object.keys(r);if(o.length!==u.length)return!1;for(u=0;u<o.length;u++){var p=o[u];if(!h.call(r,p)||!Ci(n[p],r[p]))return!1}return!0}function wp(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function bp(n,r){var o=wp(n);n=0;for(var u;o;){if(o.nodeType===3){if(u=n+o.textContent.length,n<=r&&u>=r)return{node:o,offset:r-n};n=u}e:{for(;o;){if(o.nextSibling){o=o.nextSibling;break e}o=o.parentNode}o=void 0}o=wp(o)}}function Tp(n,r){return n&&r?n===r?!0:n&&n.nodeType===3?!1:r&&r.nodeType===3?Tp(n,r.parentNode):"contains"in n?n.contains(r):n.compareDocumentPosition?!!(n.compareDocumentPosition(r)&16):!1:!1}function Ap(){for(var n=window,r=Xt();r instanceof n.HTMLIFrameElement;){try{var o=typeof r.contentWindow.location.href=="string"}catch{o=!1}if(o)n=r.contentWindow;else break;r=Xt(n.document)}return r}function Lu(n){var r=n&&n.nodeName&&n.nodeName.toLowerCase();return r&&(r==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||r==="textarea"||n.contentEditable==="true")}function Kx(n){var r=Ap(),o=n.focusedElem,u=n.selectionRange;if(r!==o&&o&&o.ownerDocument&&Tp(o.ownerDocument.documentElement,o)){if(u!==null&&Lu(o)){if(r=u.start,n=u.end,n===void 0&&(n=r),"selectionStart"in o)o.selectionStart=r,o.selectionEnd=Math.min(n,o.value.length);else if(n=(r=o.ownerDocument||document)&&r.defaultView||window,n.getSelection){n=n.getSelection();var p=o.textContent.length,x=Math.min(u.start,p);u=u.end===void 0?x:Math.min(u.end,p),!n.extend&&x>u&&(p=u,u=x,x=p),p=bp(o,x);var C=bp(o,u);p&&C&&(n.rangeCount!==1||n.anchorNode!==p.node||n.anchorOffset!==p.offset||n.focusNode!==C.node||n.focusOffset!==C.offset)&&(r=r.createRange(),r.setStart(p.node,p.offset),n.removeAllRanges(),x>u?(n.addRange(r),n.extend(C.node,C.offset)):(r.setEnd(C.node,C.offset),n.addRange(r)))}}for(r=[],n=o;n=n.parentNode;)n.nodeType===1&&r.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof o.focus=="function"&&o.focus(),o=0;o<r.length;o++)n=r[o],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var Zx=d&&"documentMode"in document&&11>=document.documentMode,na=null,Du=null,xo=null,Iu=!1;function Cp(n,r,o){var u=o.window===o?o.document:o.nodeType===9?o:o.ownerDocument;Iu||na==null||na!==Xt(u)||(u=na,"selectionStart"in u&&Lu(u)?u={start:u.selectionStart,end:u.selectionEnd}:(u=(u.ownerDocument&&u.ownerDocument.defaultView||window).getSelection(),u={anchorNode:u.anchorNode,anchorOffset:u.anchorOffset,focusNode:u.focusNode,focusOffset:u.focusOffset}),xo&&_o(xo,u)||(xo=u,u=Al(Du,"onSelect"),0<u.length&&(r=new wu("onSelect","select",null,r,o),n.push({event:r,listeners:u}),r.target=na)))}function wl(n,r){var o={};return o[n.toLowerCase()]=r.toLowerCase(),o["Webkit"+n]="webkit"+r,o["Moz"+n]="moz"+r,o}var ia={animationend:wl("Animation","AnimationEnd"),animationiteration:wl("Animation","AnimationIteration"),animationstart:wl("Animation","AnimationStart"),transitionend:wl("Transition","TransitionEnd")},Uu={},Rp={};d&&(Rp=document.createElement("div").style,"AnimationEvent"in window||(delete ia.animationend.animation,delete ia.animationiteration.animation,delete ia.animationstart.animation),"TransitionEvent"in window||delete ia.transitionend.transition);function bl(n){if(Uu[n])return Uu[n];if(!ia[n])return n;var r=ia[n],o;for(o in r)if(r.hasOwnProperty(o)&&o in Rp)return Uu[n]=r[o];return n}var Pp=bl("animationend"),Np=bl("animationiteration"),Lp=bl("animationstart"),Dp=bl("transitionend"),Ip=new Map,Up="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function kr(n,r){Ip.set(n,r),l(r,[n])}for(var Fu=0;Fu<Up.length;Fu++){var Ou=Up[Fu],Qx=Ou.toLowerCase(),Jx=Ou[0].toUpperCase()+Ou.slice(1);kr(Qx,"on"+Jx)}kr(Pp,"onAnimationEnd"),kr(Np,"onAnimationIteration"),kr(Lp,"onAnimationStart"),kr("dblclick","onDoubleClick"),kr("focusin","onFocus"),kr("focusout","onBlur"),kr(Dp,"onTransitionEnd"),c("onMouseEnter",["mouseout","mouseover"]),c("onMouseLeave",["mouseout","mouseover"]),c("onPointerEnter",["pointerout","pointerover"]),c("onPointerLeave",["pointerout","pointerover"]),l("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),l("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),l("onBeforeInput",["compositionend","keypress","textInput","paste"]),l("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var vo="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),ev=new Set("cancel close invalid load scroll toggle".split(" ").concat(vo));function Fp(n,r,o){var u=n.type||"unknown-event";n.currentTarget=o,fl(u,r,void 0,n),n.currentTarget=null}function Op(n,r){r=(r&4)!==0;for(var o=0;o<n.length;o++){var u=n[o],p=u.event;u=u.listeners;e:{var x=void 0;if(r)for(var C=u.length-1;0<=C;C--){var k=u[C],H=k.instance,ue=k.currentTarget;if(k=k.listener,H!==x&&p.isPropagationStopped())break e;Fp(p,k,ue),x=H}else for(C=0;C<u.length;C++){if(k=u[C],H=k.instance,ue=k.currentTarget,k=k.listener,H!==x&&p.isPropagationStopped())break e;Fp(p,k,ue),x=H}}}if(ms)throw n=gs,ms=!1,gs=null,n}function Wt(n,r){var o=r[ju];o===void 0&&(o=r[ju]=new Set);var u=n+"__bubble";o.has(u)||(kp(r,n,2,!1),o.add(u))}function ku(n,r,o){var u=0;r&&(u|=4),kp(o,n,u,r)}var Tl="_reactListening"+Math.random().toString(36).slice(2);function yo(n){if(!n[Tl]){n[Tl]=!0,i.forEach(function(o){o!=="selectionchange"&&(ev.has(o)||ku(o,!1,n),ku(o,!0,n))});var r=n.nodeType===9?n:n.ownerDocument;r===null||r[Tl]||(r[Tl]=!0,ku("selectionchange",!1,r))}}function kp(n,r,o,u){switch(op(r)){case 1:var p=px;break;case 4:p=mx;break;default:p=Su}o=p.bind(null,r,o,n),p=void 0,!bt||r!=="touchstart"&&r!=="touchmove"&&r!=="wheel"||(p=!0),u?p!==void 0?n.addEventListener(r,o,{capture:!0,passive:p}):n.addEventListener(r,o,!0):p!==void 0?n.addEventListener(r,o,{passive:p}):n.addEventListener(r,o,!1)}function Bu(n,r,o,u,p){var x=u;if((r&1)===0&&(r&2)===0&&u!==null)e:for(;;){if(u===null)return;var C=u.tag;if(C===3||C===4){var k=u.stateNode.containerInfo;if(k===p||k.nodeType===8&&k.parentNode===p)break;if(C===4)for(C=u.return;C!==null;){var H=C.tag;if((H===3||H===4)&&(H=C.stateNode.containerInfo,H===p||H.nodeType===8&&H.parentNode===p))return;C=C.return}for(;k!==null;){if(C=vs(k),C===null)return;if(H=C.tag,H===5||H===6){u=x=C;continue e}k=k.parentNode}}u=u.return}qe(function(){var ue=x,ye=Ke(o),Me=[];e:{var ve=Ip.get(n);if(ve!==void 0){var Be=wu,Xe=n;switch(n){case"keypress":if(yl(o)===0)break e;case"keydown":case"keyup":Be=Px;break;case"focusin":Xe="focus",Be=Au;break;case"focusout":Xe="blur",Be=Au;break;case"beforeblur":case"afterblur":Be=Au;break;case"click":if(o.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":Be=up;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":Be=xx;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":Be=Dx;break;case Pp:case Np:case Lp:Be=Sx;break;case Dp:Be=Ux;break;case"scroll":Be=gx;break;case"wheel":Be=Ox;break;case"copy":case"cut":case"paste":Be=Ex;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":Be=hp}var Ye=(r&4)!==0,ln=!Ye&&n==="scroll",ie=Ye?ve!==null?ve+"Capture":null:ve;Ye=[];for(var q=ue,se;q!==null;){se=q;var be=se.stateNode;if(se.tag===5&&be!==null&&(se=be,ie!==null&&(be=Ct(q,ie),be!=null&&Ye.push(So(q,be,se)))),ln)break;q=q.return}0<Ye.length&&(ve=new Be(ve,Xe,null,o,ye),Me.push({event:ve,listeners:Ye}))}}if((r&7)===0){e:{if(ve=n==="mouseover"||n==="pointerover",Be=n==="mouseout"||n==="pointerout",ve&&o!==Te&&(Xe=o.relatedTarget||o.fromElement)&&(vs(Xe)||Xe[dr]))break e;if((Be||ve)&&(ve=ye.window===ye?ye:(ve=ye.ownerDocument)?ve.defaultView||ve.parentWindow:window,Be?(Xe=o.relatedTarget||o.toElement,Be=ue,Xe=Xe?vs(Xe):null,Xe!==null&&(ln=Hn(Xe),Xe!==ln||Xe.tag!==5&&Xe.tag!==6)&&(Xe=null)):(Be=null,Xe=ue),Be!==Xe)){if(Ye=up,be="onMouseLeave",ie="onMouseEnter",q="mouse",(n==="pointerout"||n==="pointerover")&&(Ye=hp,be="onPointerLeave",ie="onPointerEnter",q="pointer"),ln=Be==null?ve:aa(Be),se=Xe==null?ve:aa(Xe),ve=new Ye(be,q+"leave",Be,o,ye),ve.target=ln,ve.relatedTarget=se,be=null,vs(ye)===ue&&(Ye=new Ye(ie,q+"enter",Xe,o,ye),Ye.target=se,Ye.relatedTarget=ln,be=Ye),ln=be,Be&&Xe)t:{for(Ye=Be,ie=Xe,q=0,se=Ye;se;se=ra(se))q++;for(se=0,be=ie;be;be=ra(be))se++;for(;0<q-se;)Ye=ra(Ye),q--;for(;0<se-q;)ie=ra(ie),se--;for(;q--;){if(Ye===ie||ie!==null&&Ye===ie.alternate)break t;Ye=ra(Ye),ie=ra(ie)}Ye=null}else Ye=null;Be!==null&&Bp(Me,ve,Be,Ye,!1),Xe!==null&&ln!==null&&Bp(Me,ln,Xe,Ye,!0)}}e:{if(ve=ue?aa(ue):window,Be=ve.nodeName&&ve.nodeName.toLowerCase(),Be==="select"||Be==="input"&&ve.type==="file")var Je=Wx;else if(xp(ve))if(yp)Je=Yx;else{Je=Xx;var nt=jx}else(Be=ve.nodeName)&&Be.toLowerCase()==="input"&&(ve.type==="checkbox"||ve.type==="radio")&&(Je=qx);if(Je&&(Je=Je(n,ue))){vp(Me,Je,o,ye);break e}nt&&nt(n,ve,ue),n==="focusout"&&(nt=ve._wrapperState)&&nt.controlled&&ve.type==="number"&&nn(ve,"number",ve.value)}switch(nt=ue?aa(ue):window,n){case"focusin":(xp(nt)||nt.contentEditable==="true")&&(na=nt,Du=ue,xo=null);break;case"focusout":xo=Du=na=null;break;case"mousedown":Iu=!0;break;case"contextmenu":case"mouseup":case"dragend":Iu=!1,Cp(Me,o,ye);break;case"selectionchange":if(Zx)break;case"keydown":case"keyup":Cp(Me,o,ye)}var it;if(Ru)e:{switch(n){case"compositionstart":var lt="onCompositionStart";break e;case"compositionend":lt="onCompositionEnd";break e;case"compositionupdate":lt="onCompositionUpdate";break e}lt=void 0}else ta?gp(n,o)&&(lt="onCompositionEnd"):n==="keydown"&&o.keyCode===229&&(lt="onCompositionStart");lt&&(fp&&o.locale!=="ko"&&(ta||lt!=="onCompositionStart"?lt==="onCompositionEnd"&&ta&&(it=lp()):(Or=ye,Eu="value"in Or?Or.value:Or.textContent,ta=!0)),nt=Al(ue,lt),0<nt.length&&(lt=new dp(lt,n,null,o,ye),Me.push({event:lt,listeners:nt}),it?lt.data=it:(it=_p(o),it!==null&&(lt.data=it)))),(it=Bx?zx(n,o):Hx(n,o))&&(ue=Al(ue,"onBeforeInput"),0<ue.length&&(ye=new dp("onBeforeInput","beforeinput",null,o,ye),Me.push({event:ye,listeners:ue}),ye.data=it))}Op(Me,r)})}function So(n,r,o){return{instance:n,listener:r,currentTarget:o}}function Al(n,r){for(var o=r+"Capture",u=[];n!==null;){var p=n,x=p.stateNode;p.tag===5&&x!==null&&(p=x,x=Ct(n,o),x!=null&&u.unshift(So(n,x,p)),x=Ct(n,r),x!=null&&u.push(So(n,x,p))),n=n.return}return u}function ra(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function Bp(n,r,o,u,p){for(var x=r._reactName,C=[];o!==null&&o!==u;){var k=o,H=k.alternate,ue=k.stateNode;if(H!==null&&H===u)break;k.tag===5&&ue!==null&&(k=ue,p?(H=Ct(o,x),H!=null&&C.unshift(So(o,H,k))):p||(H=Ct(o,x),H!=null&&C.push(So(o,H,k)))),o=o.return}C.length!==0&&n.push({event:r,listeners:C})}var tv=/\r\n?/g,nv=/\u0000|\uFFFD/g;function zp(n){return(typeof n=="string"?n:""+n).replace(tv,`
`).replace(nv,"")}function Cl(n,r,o){if(r=zp(r),zp(n)!==r&&o)throw Error(t(425))}function Rl(){}var zu=null,Hu=null;function Vu(n,r){return n==="textarea"||n==="noscript"||typeof r.children=="string"||typeof r.children=="number"||typeof r.dangerouslySetInnerHTML=="object"&&r.dangerouslySetInnerHTML!==null&&r.dangerouslySetInnerHTML.__html!=null}var Gu=typeof setTimeout=="function"?setTimeout:void 0,iv=typeof clearTimeout=="function"?clearTimeout:void 0,Hp=typeof Promise=="function"?Promise:void 0,rv=typeof queueMicrotask=="function"?queueMicrotask:typeof Hp<"u"?function(n){return Hp.resolve(null).then(n).catch(sv)}:Gu;function sv(n){setTimeout(function(){throw n})}function Wu(n,r){var o=r,u=0;do{var p=o.nextSibling;if(n.removeChild(o),p&&p.nodeType===8)if(o=p.data,o==="/$"){if(u===0){n.removeChild(p),uo(r);return}u--}else o!=="$"&&o!=="$?"&&o!=="$!"||u++;o=p}while(o);uo(r)}function Br(n){for(;n!=null;n=n.nextSibling){var r=n.nodeType;if(r===1||r===3)break;if(r===8){if(r=n.data,r==="$"||r==="$!"||r==="$?")break;if(r==="/$")return null}}return n}function Vp(n){n=n.previousSibling;for(var r=0;n;){if(n.nodeType===8){var o=n.data;if(o==="$"||o==="$!"||o==="$?"){if(r===0)return n;r--}else o==="/$"&&r++}n=n.previousSibling}return null}var sa=Math.random().toString(36).slice(2),Wi="__reactFiber$"+sa,Mo="__reactProps$"+sa,dr="__reactContainer$"+sa,ju="__reactEvents$"+sa,av="__reactListeners$"+sa,ov="__reactHandles$"+sa;function vs(n){var r=n[Wi];if(r)return r;for(var o=n.parentNode;o;){if(r=o[dr]||o[Wi]){if(o=r.alternate,r.child!==null||o!==null&&o.child!==null)for(n=Vp(n);n!==null;){if(o=n[Wi])return o;n=Vp(n)}return r}n=o,o=n.parentNode}return null}function Eo(n){return n=n[Wi]||n[dr],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function aa(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(t(33))}function Pl(n){return n[Mo]||null}var Xu=[],oa=-1;function zr(n){return{current:n}}function jt(n){0>oa||(n.current=Xu[oa],Xu[oa]=null,oa--)}function Gt(n,r){oa++,Xu[oa]=n.current,n.current=r}var Hr={},Ln=zr(Hr),Yn=zr(!1),ys=Hr;function la(n,r){var o=n.type.contextTypes;if(!o)return Hr;var u=n.stateNode;if(u&&u.__reactInternalMemoizedUnmaskedChildContext===r)return u.__reactInternalMemoizedMaskedChildContext;var p={},x;for(x in o)p[x]=r[x];return u&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=r,n.__reactInternalMemoizedMaskedChildContext=p),p}function $n(n){return n=n.childContextTypes,n!=null}function Nl(){jt(Yn),jt(Ln)}function Gp(n,r,o){if(Ln.current!==Hr)throw Error(t(168));Gt(Ln,r),Gt(Yn,o)}function Wp(n,r,o){var u=n.stateNode;if(r=r.childContextTypes,typeof u.getChildContext!="function")return o;u=u.getChildContext();for(var p in u)if(!(p in r))throw Error(t(108,le(n)||"Unknown",p));return K({},o,u)}function Ll(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||Hr,ys=Ln.current,Gt(Ln,n),Gt(Yn,Yn.current),!0}function jp(n,r,o){var u=n.stateNode;if(!u)throw Error(t(169));o?(n=Wp(n,r,ys),u.__reactInternalMemoizedMergedChildContext=n,jt(Yn),jt(Ln),Gt(Ln,n)):jt(Yn),Gt(Yn,o)}var hr=null,Dl=!1,qu=!1;function Xp(n){hr===null?hr=[n]:hr.push(n)}function lv(n){Dl=!0,Xp(n)}function Vr(){if(!qu&&hr!==null){qu=!0;var n=0,r=gt;try{var o=hr;for(gt=1;n<o.length;n++){var u=o[n];do u=u(!0);while(u!==null)}hr=null,Dl=!1}catch(p){throw hr!==null&&(hr=hr.slice(n+1)),xs(ro,Vr),p}finally{gt=r,qu=!1}}return null}var ca=[],ua=0,Il=null,Ul=0,pi=[],mi=0,Ss=null,fr=1,pr="";function Ms(n,r){ca[ua++]=Ul,ca[ua++]=Il,Il=n,Ul=r}function qp(n,r,o){pi[mi++]=fr,pi[mi++]=pr,pi[mi++]=Ss,Ss=n;var u=fr;n=pr;var p=32-Le(u)-1;u&=~(1<<p),o+=1;var x=32-Le(r)+p;if(30<x){var C=p-p%5;x=(u&(1<<C)-1).toString(32),u>>=C,p-=C,fr=1<<32-Le(r)+p|o<<p|u,pr=x+n}else fr=1<<x|o<<p|u,pr=n}function Yu(n){n.return!==null&&(Ms(n,1),qp(n,1,0))}function $u(n){for(;n===Il;)Il=ca[--ua],ca[ua]=null,Ul=ca[--ua],ca[ua]=null;for(;n===Ss;)Ss=pi[--mi],pi[mi]=null,pr=pi[--mi],pi[mi]=null,fr=pi[--mi],pi[mi]=null}var ri=null,si=null,$t=!1,Ri=null;function Yp(n,r){var o=vi(5,null,null,0);o.elementType="DELETED",o.stateNode=r,o.return=n,r=n.deletions,r===null?(n.deletions=[o],n.flags|=16):r.push(o)}function $p(n,r){switch(n.tag){case 5:var o=n.type;return r=r.nodeType!==1||o.toLowerCase()!==r.nodeName.toLowerCase()?null:r,r!==null?(n.stateNode=r,ri=n,si=Br(r.firstChild),!0):!1;case 6:return r=n.pendingProps===""||r.nodeType!==3?null:r,r!==null?(n.stateNode=r,ri=n,si=null,!0):!1;case 13:return r=r.nodeType!==8?null:r,r!==null?(o=Ss!==null?{id:fr,overflow:pr}:null,n.memoizedState={dehydrated:r,treeContext:o,retryLane:1073741824},o=vi(18,null,null,0),o.stateNode=r,o.return=n,n.child=o,ri=n,si=null,!0):!1;default:return!1}}function Ku(n){return(n.mode&1)!==0&&(n.flags&128)===0}function Zu(n){if($t){var r=si;if(r){var o=r;if(!$p(n,r)){if(Ku(n))throw Error(t(418));r=Br(o.nextSibling);var u=ri;r&&$p(n,r)?Yp(u,o):(n.flags=n.flags&-4097|2,$t=!1,ri=n)}}else{if(Ku(n))throw Error(t(418));n.flags=n.flags&-4097|2,$t=!1,ri=n}}}function Kp(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;ri=n}function Fl(n){if(n!==ri)return!1;if(!$t)return Kp(n),$t=!0,!1;var r;if((r=n.tag!==3)&&!(r=n.tag!==5)&&(r=n.type,r=r!=="head"&&r!=="body"&&!Vu(n.type,n.memoizedProps)),r&&(r=si)){if(Ku(n))throw Zp(),Error(t(418));for(;r;)Yp(n,r),r=Br(r.nextSibling)}if(Kp(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(t(317));e:{for(n=n.nextSibling,r=0;n;){if(n.nodeType===8){var o=n.data;if(o==="/$"){if(r===0){si=Br(n.nextSibling);break e}r--}else o!=="$"&&o!=="$!"&&o!=="$?"||r++}n=n.nextSibling}si=null}}else si=ri?Br(n.stateNode.nextSibling):null;return!0}function Zp(){for(var n=si;n;)n=Br(n.nextSibling)}function da(){si=ri=null,$t=!1}function Qu(n){Ri===null?Ri=[n]:Ri.push(n)}var cv=T.ReactCurrentBatchConfig;function wo(n,r,o){if(n=o.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(o._owner){if(o=o._owner,o){if(o.tag!==1)throw Error(t(309));var u=o.stateNode}if(!u)throw Error(t(147,n));var p=u,x=""+n;return r!==null&&r.ref!==null&&typeof r.ref=="function"&&r.ref._stringRef===x?r.ref:(r=function(C){var k=p.refs;C===null?delete k[x]:k[x]=C},r._stringRef=x,r)}if(typeof n!="string")throw Error(t(284));if(!o._owner)throw Error(t(290,n))}return n}function Ol(n,r){throw n=Object.prototype.toString.call(r),Error(t(31,n==="[object Object]"?"object with keys {"+Object.keys(r).join(", ")+"}":n))}function Qp(n){var r=n._init;return r(n._payload)}function Jp(n){function r(ie,q){if(n){var se=ie.deletions;se===null?(ie.deletions=[q],ie.flags|=16):se.push(q)}}function o(ie,q){if(!n)return null;for(;q!==null;)r(ie,q),q=q.sibling;return null}function u(ie,q){for(ie=new Map;q!==null;)q.key!==null?ie.set(q.key,q):ie.set(q.index,q),q=q.sibling;return ie}function p(ie,q){return ie=Kr(ie,q),ie.index=0,ie.sibling=null,ie}function x(ie,q,se){return ie.index=se,n?(se=ie.alternate,se!==null?(se=se.index,se<q?(ie.flags|=2,q):se):(ie.flags|=2,q)):(ie.flags|=1048576,q)}function C(ie){return n&&ie.alternate===null&&(ie.flags|=2),ie}function k(ie,q,se,be){return q===null||q.tag!==6?(q=Gd(se,ie.mode,be),q.return=ie,q):(q=p(q,se),q.return=ie,q)}function H(ie,q,se,be){var Je=se.type;return Je===U?ye(ie,q,se.props.children,be,se.key):q!==null&&(q.elementType===Je||typeof Je=="object"&&Je!==null&&Je.$$typeof===he&&Qp(Je)===q.type)?(be=p(q,se.props),be.ref=wo(ie,q,se),be.return=ie,be):(be=oc(se.type,se.key,se.props,null,ie.mode,be),be.ref=wo(ie,q,se),be.return=ie,be)}function ue(ie,q,se,be){return q===null||q.tag!==4||q.stateNode.containerInfo!==se.containerInfo||q.stateNode.implementation!==se.implementation?(q=Wd(se,ie.mode,be),q.return=ie,q):(q=p(q,se.children||[]),q.return=ie,q)}function ye(ie,q,se,be,Je){return q===null||q.tag!==7?(q=Ps(se,ie.mode,be,Je),q.return=ie,q):(q=p(q,se),q.return=ie,q)}function Me(ie,q,se){if(typeof q=="string"&&q!==""||typeof q=="number")return q=Gd(""+q,ie.mode,se),q.return=ie,q;if(typeof q=="object"&&q!==null){switch(q.$$typeof){case N:return se=oc(q.type,q.key,q.props,null,ie.mode,se),se.ref=wo(ie,null,q),se.return=ie,se;case L:return q=Wd(q,ie.mode,se),q.return=ie,q;case he:var be=q._init;return Me(ie,be(q._payload),se)}if(cn(q)||$(q))return q=Ps(q,ie.mode,se,null),q.return=ie,q;Ol(ie,q)}return null}function ve(ie,q,se,be){var Je=q!==null?q.key:null;if(typeof se=="string"&&se!==""||typeof se=="number")return Je!==null?null:k(ie,q,""+se,be);if(typeof se=="object"&&se!==null){switch(se.$$typeof){case N:return se.key===Je?H(ie,q,se,be):null;case L:return se.key===Je?ue(ie,q,se,be):null;case he:return Je=se._init,ve(ie,q,Je(se._payload),be)}if(cn(se)||$(se))return Je!==null?null:ye(ie,q,se,be,null);Ol(ie,se)}return null}function Be(ie,q,se,be,Je){if(typeof be=="string"&&be!==""||typeof be=="number")return ie=ie.get(se)||null,k(q,ie,""+be,Je);if(typeof be=="object"&&be!==null){switch(be.$$typeof){case N:return ie=ie.get(be.key===null?se:be.key)||null,H(q,ie,be,Je);case L:return ie=ie.get(be.key===null?se:be.key)||null,ue(q,ie,be,Je);case he:var nt=be._init;return Be(ie,q,se,nt(be._payload),Je)}if(cn(be)||$(be))return ie=ie.get(se)||null,ye(q,ie,be,Je,null);Ol(q,be)}return null}function Xe(ie,q,se,be){for(var Je=null,nt=null,it=q,lt=q=0,wn=null;it!==null&&lt<se.length;lt++){it.index>lt?(wn=it,it=null):wn=it.sibling;var Pt=ve(ie,it,se[lt],be);if(Pt===null){it===null&&(it=wn);break}n&&it&&Pt.alternate===null&&r(ie,it),q=x(Pt,q,lt),nt===null?Je=Pt:nt.sibling=Pt,nt=Pt,it=wn}if(lt===se.length)return o(ie,it),$t&&Ms(ie,lt),Je;if(it===null){for(;lt<se.length;lt++)it=Me(ie,se[lt],be),it!==null&&(q=x(it,q,lt),nt===null?Je=it:nt.sibling=it,nt=it);return $t&&Ms(ie,lt),Je}for(it=u(ie,it);lt<se.length;lt++)wn=Be(it,ie,lt,se[lt],be),wn!==null&&(n&&wn.alternate!==null&&it.delete(wn.key===null?lt:wn.key),q=x(wn,q,lt),nt===null?Je=wn:nt.sibling=wn,nt=wn);return n&&it.forEach(function(Zr){return r(ie,Zr)}),$t&&Ms(ie,lt),Je}function Ye(ie,q,se,be){var Je=$(se);if(typeof Je!="function")throw Error(t(150));if(se=Je.call(se),se==null)throw Error(t(151));for(var nt=Je=null,it=q,lt=q=0,wn=null,Pt=se.next();it!==null&&!Pt.done;lt++,Pt=se.next()){it.index>lt?(wn=it,it=null):wn=it.sibling;var Zr=ve(ie,it,Pt.value,be);if(Zr===null){it===null&&(it=wn);break}n&&it&&Zr.alternate===null&&r(ie,it),q=x(Zr,q,lt),nt===null?Je=Zr:nt.sibling=Zr,nt=Zr,it=wn}if(Pt.done)return o(ie,it),$t&&Ms(ie,lt),Je;if(it===null){for(;!Pt.done;lt++,Pt=se.next())Pt=Me(ie,Pt.value,be),Pt!==null&&(q=x(Pt,q,lt),nt===null?Je=Pt:nt.sibling=Pt,nt=Pt);return $t&&Ms(ie,lt),Je}for(it=u(ie,it);!Pt.done;lt++,Pt=se.next())Pt=Be(it,ie,lt,Pt.value,be),Pt!==null&&(n&&Pt.alternate!==null&&it.delete(Pt.key===null?lt:Pt.key),q=x(Pt,q,lt),nt===null?Je=Pt:nt.sibling=Pt,nt=Pt);return n&&it.forEach(function(Vv){return r(ie,Vv)}),$t&&Ms(ie,lt),Je}function ln(ie,q,se,be){if(typeof se=="object"&&se!==null&&se.type===U&&se.key===null&&(se=se.props.children),typeof se=="object"&&se!==null){switch(se.$$typeof){case N:e:{for(var Je=se.key,nt=q;nt!==null;){if(nt.key===Je){if(Je=se.type,Je===U){if(nt.tag===7){o(ie,nt.sibling),q=p(nt,se.props.children),q.return=ie,ie=q;break e}}else if(nt.elementType===Je||typeof Je=="object"&&Je!==null&&Je.$$typeof===he&&Qp(Je)===nt.type){o(ie,nt.sibling),q=p(nt,se.props),q.ref=wo(ie,nt,se),q.return=ie,ie=q;break e}o(ie,nt);break}else r(ie,nt);nt=nt.sibling}se.type===U?(q=Ps(se.props.children,ie.mode,be,se.key),q.return=ie,ie=q):(be=oc(se.type,se.key,se.props,null,ie.mode,be),be.ref=wo(ie,q,se),be.return=ie,ie=be)}return C(ie);case L:e:{for(nt=se.key;q!==null;){if(q.key===nt)if(q.tag===4&&q.stateNode.containerInfo===se.containerInfo&&q.stateNode.implementation===se.implementation){o(ie,q.sibling),q=p(q,se.children||[]),q.return=ie,ie=q;break e}else{o(ie,q);break}else r(ie,q);q=q.sibling}q=Wd(se,ie.mode,be),q.return=ie,ie=q}return C(ie);case he:return nt=se._init,ln(ie,q,nt(se._payload),be)}if(cn(se))return Xe(ie,q,se,be);if($(se))return Ye(ie,q,se,be);Ol(ie,se)}return typeof se=="string"&&se!==""||typeof se=="number"?(se=""+se,q!==null&&q.tag===6?(o(ie,q.sibling),q=p(q,se),q.return=ie,ie=q):(o(ie,q),q=Gd(se,ie.mode,be),q.return=ie,ie=q),C(ie)):o(ie,q)}return ln}var ha=Jp(!0),em=Jp(!1),kl=zr(null),Bl=null,fa=null,Ju=null;function ed(){Ju=fa=Bl=null}function td(n){var r=kl.current;jt(kl),n._currentValue=r}function nd(n,r,o){for(;n!==null;){var u=n.alternate;if((n.childLanes&r)!==r?(n.childLanes|=r,u!==null&&(u.childLanes|=r)):u!==null&&(u.childLanes&r)!==r&&(u.childLanes|=r),n===o)break;n=n.return}}function pa(n,r){Bl=n,Ju=fa=null,n=n.dependencies,n!==null&&n.firstContext!==null&&((n.lanes&r)!==0&&(Kn=!0),n.firstContext=null)}function gi(n){var r=n._currentValue;if(Ju!==n)if(n={context:n,memoizedValue:r,next:null},fa===null){if(Bl===null)throw Error(t(308));fa=n,Bl.dependencies={lanes:0,firstContext:n}}else fa=fa.next=n;return r}var Es=null;function id(n){Es===null?Es=[n]:Es.push(n)}function tm(n,r,o,u){var p=r.interleaved;return p===null?(o.next=o,id(r)):(o.next=p.next,p.next=o),r.interleaved=o,mr(n,u)}function mr(n,r){n.lanes|=r;var o=n.alternate;for(o!==null&&(o.lanes|=r),o=n,n=n.return;n!==null;)n.childLanes|=r,o=n.alternate,o!==null&&(o.childLanes|=r),o=n,n=n.return;return o.tag===3?o.stateNode:null}var Gr=!1;function rd(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function nm(n,r){n=n.updateQueue,r.updateQueue===n&&(r.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function gr(n,r){return{eventTime:n,lane:r,tag:0,payload:null,callback:null,next:null}}function Wr(n,r,o){var u=n.updateQueue;if(u===null)return null;if(u=u.shared,(Tt&2)!==0){var p=u.pending;return p===null?r.next=r:(r.next=p.next,p.next=r),u.pending=r,mr(n,o)}return p=u.interleaved,p===null?(r.next=r,id(u)):(r.next=p.next,p.next=r),u.interleaved=r,mr(n,o)}function zl(n,r,o){if(r=r.updateQueue,r!==null&&(r=r.shared,(o&4194240)!==0)){var u=r.lanes;u&=n.pendingLanes,o|=u,r.lanes=o,Nn(n,o)}}function im(n,r){var o=n.updateQueue,u=n.alternate;if(u!==null&&(u=u.updateQueue,o===u)){var p=null,x=null;if(o=o.firstBaseUpdate,o!==null){do{var C={eventTime:o.eventTime,lane:o.lane,tag:o.tag,payload:o.payload,callback:o.callback,next:null};x===null?p=x=C:x=x.next=C,o=o.next}while(o!==null);x===null?p=x=r:x=x.next=r}else p=x=r;o={baseState:u.baseState,firstBaseUpdate:p,lastBaseUpdate:x,shared:u.shared,effects:u.effects},n.updateQueue=o;return}n=o.lastBaseUpdate,n===null?o.firstBaseUpdate=r:n.next=r,o.lastBaseUpdate=r}function Hl(n,r,o,u){var p=n.updateQueue;Gr=!1;var x=p.firstBaseUpdate,C=p.lastBaseUpdate,k=p.shared.pending;if(k!==null){p.shared.pending=null;var H=k,ue=H.next;H.next=null,C===null?x=ue:C.next=ue,C=H;var ye=n.alternate;ye!==null&&(ye=ye.updateQueue,k=ye.lastBaseUpdate,k!==C&&(k===null?ye.firstBaseUpdate=ue:k.next=ue,ye.lastBaseUpdate=H))}if(x!==null){var Me=p.baseState;C=0,ye=ue=H=null,k=x;do{var ve=k.lane,Be=k.eventTime;if((u&ve)===ve){ye!==null&&(ye=ye.next={eventTime:Be,lane:0,tag:k.tag,payload:k.payload,callback:k.callback,next:null});e:{var Xe=n,Ye=k;switch(ve=r,Be=o,Ye.tag){case 1:if(Xe=Ye.payload,typeof Xe=="function"){Me=Xe.call(Be,Me,ve);break e}Me=Xe;break e;case 3:Xe.flags=Xe.flags&-65537|128;case 0:if(Xe=Ye.payload,ve=typeof Xe=="function"?Xe.call(Be,Me,ve):Xe,ve==null)break e;Me=K({},Me,ve);break e;case 2:Gr=!0}}k.callback!==null&&k.lane!==0&&(n.flags|=64,ve=p.effects,ve===null?p.effects=[k]:ve.push(k))}else Be={eventTime:Be,lane:ve,tag:k.tag,payload:k.payload,callback:k.callback,next:null},ye===null?(ue=ye=Be,H=Me):ye=ye.next=Be,C|=ve;if(k=k.next,k===null){if(k=p.shared.pending,k===null)break;ve=k,k=ve.next,ve.next=null,p.lastBaseUpdate=ve,p.shared.pending=null}}while(!0);if(ye===null&&(H=Me),p.baseState=H,p.firstBaseUpdate=ue,p.lastBaseUpdate=ye,r=p.shared.interleaved,r!==null){p=r;do C|=p.lane,p=p.next;while(p!==r)}else x===null&&(p.shared.lanes=0);Ts|=C,n.lanes=C,n.memoizedState=Me}}function rm(n,r,o){if(n=r.effects,r.effects=null,n!==null)for(r=0;r<n.length;r++){var u=n[r],p=u.callback;if(p!==null){if(u.callback=null,u=o,typeof p!="function")throw Error(t(191,p));p.call(u)}}}var bo={},ji=zr(bo),To=zr(bo),Ao=zr(bo);function ws(n){if(n===bo)throw Error(t(174));return n}function sd(n,r){switch(Gt(Ao,r),Gt(To,n),Gt(ji,bo),n=r.nodeType,n){case 9:case 11:r=(r=r.documentElement)?r.namespaceURI:E(null,"");break;default:n=n===8?r.parentNode:r,r=n.namespaceURI||null,n=n.tagName,r=E(r,n)}jt(ji),Gt(ji,r)}function ma(){jt(ji),jt(To),jt(Ao)}function sm(n){ws(Ao.current);var r=ws(ji.current),o=E(r,n.type);r!==o&&(Gt(To,n),Gt(ji,o))}function ad(n){To.current===n&&(jt(ji),jt(To))}var Zt=zr(0);function Vl(n){for(var r=n;r!==null;){if(r.tag===13){var o=r.memoizedState;if(o!==null&&(o=o.dehydrated,o===null||o.data==="$?"||o.data==="$!"))return r}else if(r.tag===19&&r.memoizedProps.revealOrder!==void 0){if((r.flags&128)!==0)return r}else if(r.child!==null){r.child.return=r,r=r.child;continue}if(r===n)break;for(;r.sibling===null;){if(r.return===null||r.return===n)return null;r=r.return}r.sibling.return=r.return,r=r.sibling}return null}var od=[];function ld(){for(var n=0;n<od.length;n++)od[n]._workInProgressVersionPrimary=null;od.length=0}var Gl=T.ReactCurrentDispatcher,cd=T.ReactCurrentBatchConfig,bs=0,Qt=null,mn=null,Mn=null,Wl=!1,Co=!1,Ro=0,uv=0;function Dn(){throw Error(t(321))}function ud(n,r){if(r===null)return!1;for(var o=0;o<r.length&&o<n.length;o++)if(!Ci(n[o],r[o]))return!1;return!0}function dd(n,r,o,u,p,x){if(bs=x,Qt=r,r.memoizedState=null,r.updateQueue=null,r.lanes=0,Gl.current=n===null||n.memoizedState===null?pv:mv,n=o(u,p),Co){x=0;do{if(Co=!1,Ro=0,25<=x)throw Error(t(301));x+=1,Mn=mn=null,r.updateQueue=null,Gl.current=gv,n=o(u,p)}while(Co)}if(Gl.current=ql,r=mn!==null&&mn.next!==null,bs=0,Mn=mn=Qt=null,Wl=!1,r)throw Error(t(300));return n}function hd(){var n=Ro!==0;return Ro=0,n}function Xi(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Mn===null?Qt.memoizedState=Mn=n:Mn=Mn.next=n,Mn}function _i(){if(mn===null){var n=Qt.alternate;n=n!==null?n.memoizedState:null}else n=mn.next;var r=Mn===null?Qt.memoizedState:Mn.next;if(r!==null)Mn=r,mn=n;else{if(n===null)throw Error(t(310));mn=n,n={memoizedState:mn.memoizedState,baseState:mn.baseState,baseQueue:mn.baseQueue,queue:mn.queue,next:null},Mn===null?Qt.memoizedState=Mn=n:Mn=Mn.next=n}return Mn}function Po(n,r){return typeof r=="function"?r(n):r}function fd(n){var r=_i(),o=r.queue;if(o===null)throw Error(t(311));o.lastRenderedReducer=n;var u=mn,p=u.baseQueue,x=o.pending;if(x!==null){if(p!==null){var C=p.next;p.next=x.next,x.next=C}u.baseQueue=p=x,o.pending=null}if(p!==null){x=p.next,u=u.baseState;var k=C=null,H=null,ue=x;do{var ye=ue.lane;if((bs&ye)===ye)H!==null&&(H=H.next={lane:0,action:ue.action,hasEagerState:ue.hasEagerState,eagerState:ue.eagerState,next:null}),u=ue.hasEagerState?ue.eagerState:n(u,ue.action);else{var Me={lane:ye,action:ue.action,hasEagerState:ue.hasEagerState,eagerState:ue.eagerState,next:null};H===null?(k=H=Me,C=u):H=H.next=Me,Qt.lanes|=ye,Ts|=ye}ue=ue.next}while(ue!==null&&ue!==x);H===null?C=u:H.next=k,Ci(u,r.memoizedState)||(Kn=!0),r.memoizedState=u,r.baseState=C,r.baseQueue=H,o.lastRenderedState=u}if(n=o.interleaved,n!==null){p=n;do x=p.lane,Qt.lanes|=x,Ts|=x,p=p.next;while(p!==n)}else p===null&&(o.lanes=0);return[r.memoizedState,o.dispatch]}function pd(n){var r=_i(),o=r.queue;if(o===null)throw Error(t(311));o.lastRenderedReducer=n;var u=o.dispatch,p=o.pending,x=r.memoizedState;if(p!==null){o.pending=null;var C=p=p.next;do x=n(x,C.action),C=C.next;while(C!==p);Ci(x,r.memoizedState)||(Kn=!0),r.memoizedState=x,r.baseQueue===null&&(r.baseState=x),o.lastRenderedState=x}return[x,u]}function am(){}function om(n,r){var o=Qt,u=_i(),p=r(),x=!Ci(u.memoizedState,p);if(x&&(u.memoizedState=p,Kn=!0),u=u.queue,md(um.bind(null,o,u,n),[n]),u.getSnapshot!==r||x||Mn!==null&&Mn.memoizedState.tag&1){if(o.flags|=2048,No(9,cm.bind(null,o,u,p,r),void 0,null),En===null)throw Error(t(349));(bs&30)!==0||lm(o,r,p)}return p}function lm(n,r,o){n.flags|=16384,n={getSnapshot:r,value:o},r=Qt.updateQueue,r===null?(r={lastEffect:null,stores:null},Qt.updateQueue=r,r.stores=[n]):(o=r.stores,o===null?r.stores=[n]:o.push(n))}function cm(n,r,o,u){r.value=o,r.getSnapshot=u,dm(r)&&hm(n)}function um(n,r,o){return o(function(){dm(r)&&hm(n)})}function dm(n){var r=n.getSnapshot;n=n.value;try{var o=r();return!Ci(n,o)}catch{return!0}}function hm(n){var r=mr(n,1);r!==null&&Di(r,n,1,-1)}function fm(n){var r=Xi();return typeof n=="function"&&(n=n()),r.memoizedState=r.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Po,lastRenderedState:n},r.queue=n,n=n.dispatch=fv.bind(null,Qt,n),[r.memoizedState,n]}function No(n,r,o,u){return n={tag:n,create:r,destroy:o,deps:u,next:null},r=Qt.updateQueue,r===null?(r={lastEffect:null,stores:null},Qt.updateQueue=r,r.lastEffect=n.next=n):(o=r.lastEffect,o===null?r.lastEffect=n.next=n:(u=o.next,o.next=n,n.next=u,r.lastEffect=n)),n}function pm(){return _i().memoizedState}function jl(n,r,o,u){var p=Xi();Qt.flags|=n,p.memoizedState=No(1|r,o,void 0,u===void 0?null:u)}function Xl(n,r,o,u){var p=_i();u=u===void 0?null:u;var x=void 0;if(mn!==null){var C=mn.memoizedState;if(x=C.destroy,u!==null&&ud(u,C.deps)){p.memoizedState=No(r,o,x,u);return}}Qt.flags|=n,p.memoizedState=No(1|r,o,x,u)}function mm(n,r){return jl(8390656,8,n,r)}function md(n,r){return Xl(2048,8,n,r)}function gm(n,r){return Xl(4,2,n,r)}function _m(n,r){return Xl(4,4,n,r)}function xm(n,r){if(typeof r=="function")return n=n(),r(n),function(){r(null)};if(r!=null)return n=n(),r.current=n,function(){r.current=null}}function vm(n,r,o){return o=o!=null?o.concat([n]):null,Xl(4,4,xm.bind(null,r,n),o)}function gd(){}function ym(n,r){var o=_i();r=r===void 0?null:r;var u=o.memoizedState;return u!==null&&r!==null&&ud(r,u[1])?u[0]:(o.memoizedState=[n,r],n)}function Sm(n,r){var o=_i();r=r===void 0?null:r;var u=o.memoizedState;return u!==null&&r!==null&&ud(r,u[1])?u[0]:(n=n(),o.memoizedState=[n,r],n)}function Mm(n,r,o){return(bs&21)===0?(n.baseState&&(n.baseState=!1,Kn=!0),n.memoizedState=o):(Ci(o,r)||(o=pn(),Qt.lanes|=o,Ts|=o,n.baseState=!0),r)}function dv(n,r){var o=gt;gt=o!==0&&4>o?o:4,n(!0);var u=cd.transition;cd.transition={};try{n(!1),r()}finally{gt=o,cd.transition=u}}function Em(){return _i().memoizedState}function hv(n,r,o){var u=Yr(n);if(o={lane:u,action:o,hasEagerState:!1,eagerState:null,next:null},wm(n))bm(r,o);else if(o=tm(n,r,o,u),o!==null){var p=Gn();Di(o,n,u,p),Tm(o,r,u)}}function fv(n,r,o){var u=Yr(n),p={lane:u,action:o,hasEagerState:!1,eagerState:null,next:null};if(wm(n))bm(r,p);else{var x=n.alternate;if(n.lanes===0&&(x===null||x.lanes===0)&&(x=r.lastRenderedReducer,x!==null))try{var C=r.lastRenderedState,k=x(C,o);if(p.hasEagerState=!0,p.eagerState=k,Ci(k,C)){var H=r.interleaved;H===null?(p.next=p,id(r)):(p.next=H.next,H.next=p),r.interleaved=p;return}}catch{}finally{}o=tm(n,r,p,u),o!==null&&(p=Gn(),Di(o,n,u,p),Tm(o,r,u))}}function wm(n){var r=n.alternate;return n===Qt||r!==null&&r===Qt}function bm(n,r){Co=Wl=!0;var o=n.pending;o===null?r.next=r:(r.next=o.next,o.next=r),n.pending=r}function Tm(n,r,o){if((o&4194240)!==0){var u=r.lanes;u&=n.pendingLanes,o|=u,r.lanes=o,Nn(n,o)}}var ql={readContext:gi,useCallback:Dn,useContext:Dn,useEffect:Dn,useImperativeHandle:Dn,useInsertionEffect:Dn,useLayoutEffect:Dn,useMemo:Dn,useReducer:Dn,useRef:Dn,useState:Dn,useDebugValue:Dn,useDeferredValue:Dn,useTransition:Dn,useMutableSource:Dn,useSyncExternalStore:Dn,useId:Dn,unstable_isNewReconciler:!1},pv={readContext:gi,useCallback:function(n,r){return Xi().memoizedState=[n,r===void 0?null:r],n},useContext:gi,useEffect:mm,useImperativeHandle:function(n,r,o){return o=o!=null?o.concat([n]):null,jl(4194308,4,xm.bind(null,r,n),o)},useLayoutEffect:function(n,r){return jl(4194308,4,n,r)},useInsertionEffect:function(n,r){return jl(4,2,n,r)},useMemo:function(n,r){var o=Xi();return r=r===void 0?null:r,n=n(),o.memoizedState=[n,r],n},useReducer:function(n,r,o){var u=Xi();return r=o!==void 0?o(r):r,u.memoizedState=u.baseState=r,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:r},u.queue=n,n=n.dispatch=hv.bind(null,Qt,n),[u.memoizedState,n]},useRef:function(n){var r=Xi();return n={current:n},r.memoizedState=n},useState:fm,useDebugValue:gd,useDeferredValue:function(n){return Xi().memoizedState=n},useTransition:function(){var n=fm(!1),r=n[0];return n=dv.bind(null,n[1]),Xi().memoizedState=n,[r,n]},useMutableSource:function(){},useSyncExternalStore:function(n,r,o){var u=Qt,p=Xi();if($t){if(o===void 0)throw Error(t(407));o=o()}else{if(o=r(),En===null)throw Error(t(349));(bs&30)!==0||lm(u,r,o)}p.memoizedState=o;var x={value:o,getSnapshot:r};return p.queue=x,mm(um.bind(null,u,x,n),[n]),u.flags|=2048,No(9,cm.bind(null,u,x,o,r),void 0,null),o},useId:function(){var n=Xi(),r=En.identifierPrefix;if($t){var o=pr,u=fr;o=(u&~(1<<32-Le(u)-1)).toString(32)+o,r=":"+r+"R"+o,o=Ro++,0<o&&(r+="H"+o.toString(32)),r+=":"}else o=uv++,r=":"+r+"r"+o.toString(32)+":";return n.memoizedState=r},unstable_isNewReconciler:!1},mv={readContext:gi,useCallback:ym,useContext:gi,useEffect:md,useImperativeHandle:vm,useInsertionEffect:gm,useLayoutEffect:_m,useMemo:Sm,useReducer:fd,useRef:pm,useState:function(){return fd(Po)},useDebugValue:gd,useDeferredValue:function(n){var r=_i();return Mm(r,mn.memoizedState,n)},useTransition:function(){var n=fd(Po)[0],r=_i().memoizedState;return[n,r]},useMutableSource:am,useSyncExternalStore:om,useId:Em,unstable_isNewReconciler:!1},gv={readContext:gi,useCallback:ym,useContext:gi,useEffect:md,useImperativeHandle:vm,useInsertionEffect:gm,useLayoutEffect:_m,useMemo:Sm,useReducer:pd,useRef:pm,useState:function(){return pd(Po)},useDebugValue:gd,useDeferredValue:function(n){var r=_i();return mn===null?r.memoizedState=n:Mm(r,mn.memoizedState,n)},useTransition:function(){var n=pd(Po)[0],r=_i().memoizedState;return[n,r]},useMutableSource:am,useSyncExternalStore:om,useId:Em,unstable_isNewReconciler:!1};function Pi(n,r){if(n&&n.defaultProps){r=K({},r),n=n.defaultProps;for(var o in n)r[o]===void 0&&(r[o]=n[o]);return r}return r}function _d(n,r,o,u){r=n.memoizedState,o=o(u,r),o=o==null?r:K({},r,o),n.memoizedState=o,n.lanes===0&&(n.updateQueue.baseState=o)}var Yl={isMounted:function(n){return(n=n._reactInternals)?Hn(n)===n:!1},enqueueSetState:function(n,r,o){n=n._reactInternals;var u=Gn(),p=Yr(n),x=gr(u,p);x.payload=r,o!=null&&(x.callback=o),r=Wr(n,x,p),r!==null&&(Di(r,n,p,u),zl(r,n,p))},enqueueReplaceState:function(n,r,o){n=n._reactInternals;var u=Gn(),p=Yr(n),x=gr(u,p);x.tag=1,x.payload=r,o!=null&&(x.callback=o),r=Wr(n,x,p),r!==null&&(Di(r,n,p,u),zl(r,n,p))},enqueueForceUpdate:function(n,r){n=n._reactInternals;var o=Gn(),u=Yr(n),p=gr(o,u);p.tag=2,r!=null&&(p.callback=r),r=Wr(n,p,u),r!==null&&(Di(r,n,u,o),zl(r,n,u))}};function Am(n,r,o,u,p,x,C){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(u,x,C):r.prototype&&r.prototype.isPureReactComponent?!_o(o,u)||!_o(p,x):!0}function Cm(n,r,o){var u=!1,p=Hr,x=r.contextType;return typeof x=="object"&&x!==null?x=gi(x):(p=$n(r)?ys:Ln.current,u=r.contextTypes,x=(u=u!=null)?la(n,p):Hr),r=new r(o,x),n.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,r.updater=Yl,n.stateNode=r,r._reactInternals=n,u&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=p,n.__reactInternalMemoizedMaskedChildContext=x),r}function Rm(n,r,o,u){n=r.state,typeof r.componentWillReceiveProps=="function"&&r.componentWillReceiveProps(o,u),typeof r.UNSAFE_componentWillReceiveProps=="function"&&r.UNSAFE_componentWillReceiveProps(o,u),r.state!==n&&Yl.enqueueReplaceState(r,r.state,null)}function xd(n,r,o,u){var p=n.stateNode;p.props=o,p.state=n.memoizedState,p.refs={},rd(n);var x=r.contextType;typeof x=="object"&&x!==null?p.context=gi(x):(x=$n(r)?ys:Ln.current,p.context=la(n,x)),p.state=n.memoizedState,x=r.getDerivedStateFromProps,typeof x=="function"&&(_d(n,r,x,o),p.state=n.memoizedState),typeof r.getDerivedStateFromProps=="function"||typeof p.getSnapshotBeforeUpdate=="function"||typeof p.UNSAFE_componentWillMount!="function"&&typeof p.componentWillMount!="function"||(r=p.state,typeof p.componentWillMount=="function"&&p.componentWillMount(),typeof p.UNSAFE_componentWillMount=="function"&&p.UNSAFE_componentWillMount(),r!==p.state&&Yl.enqueueReplaceState(p,p.state,null),Hl(n,o,p,u),p.state=n.memoizedState),typeof p.componentDidMount=="function"&&(n.flags|=4194308)}function ga(n,r){try{var o="",u=r;do o+=He(u),u=u.return;while(u);var p=o}catch(x){p=`
Error generating stack: `+x.message+`
`+x.stack}return{value:n,source:r,stack:p,digest:null}}function vd(n,r,o){return{value:n,source:null,stack:o??null,digest:r??null}}function yd(n,r){try{console.error(r.value)}catch(o){setTimeout(function(){throw o})}}var _v=typeof WeakMap=="function"?WeakMap:Map;function Pm(n,r,o){o=gr(-1,o),o.tag=3,o.payload={element:null};var u=r.value;return o.callback=function(){tc||(tc=!0,Ud=u),yd(n,r)},o}function Nm(n,r,o){o=gr(-1,o),o.tag=3;var u=n.type.getDerivedStateFromError;if(typeof u=="function"){var p=r.value;o.payload=function(){return u(p)},o.callback=function(){yd(n,r)}}var x=n.stateNode;return x!==null&&typeof x.componentDidCatch=="function"&&(o.callback=function(){yd(n,r),typeof u!="function"&&(Xr===null?Xr=new Set([this]):Xr.add(this));var C=r.stack;this.componentDidCatch(r.value,{componentStack:C!==null?C:""})}),o}function Lm(n,r,o){var u=n.pingCache;if(u===null){u=n.pingCache=new _v;var p=new Set;u.set(r,p)}else p=u.get(r),p===void 0&&(p=new Set,u.set(r,p));p.has(o)||(p.add(o),n=Nv.bind(null,n,r,o),r.then(n,n))}function Dm(n){do{var r;if((r=n.tag===13)&&(r=n.memoizedState,r=r!==null?r.dehydrated!==null:!0),r)return n;n=n.return}while(n!==null);return null}function Im(n,r,o,u,p){return(n.mode&1)===0?(n===r?n.flags|=65536:(n.flags|=128,o.flags|=131072,o.flags&=-52805,o.tag===1&&(o.alternate===null?o.tag=17:(r=gr(-1,1),r.tag=2,Wr(o,r,1))),o.lanes|=1),n):(n.flags|=65536,n.lanes=p,n)}var xv=T.ReactCurrentOwner,Kn=!1;function Vn(n,r,o,u){r.child=n===null?em(r,null,o,u):ha(r,n.child,o,u)}function Um(n,r,o,u,p){o=o.render;var x=r.ref;return pa(r,p),u=dd(n,r,o,u,x,p),o=hd(),n!==null&&!Kn?(r.updateQueue=n.updateQueue,r.flags&=-2053,n.lanes&=~p,_r(n,r,p)):($t&&o&&Yu(r),r.flags|=1,Vn(n,r,u,p),r.child)}function Fm(n,r,o,u,p){if(n===null){var x=o.type;return typeof x=="function"&&!Vd(x)&&x.defaultProps===void 0&&o.compare===null&&o.defaultProps===void 0?(r.tag=15,r.type=x,Om(n,r,x,u,p)):(n=oc(o.type,null,u,r,r.mode,p),n.ref=r.ref,n.return=r,r.child=n)}if(x=n.child,(n.lanes&p)===0){var C=x.memoizedProps;if(o=o.compare,o=o!==null?o:_o,o(C,u)&&n.ref===r.ref)return _r(n,r,p)}return r.flags|=1,n=Kr(x,u),n.ref=r.ref,n.return=r,r.child=n}function Om(n,r,o,u,p){if(n!==null){var x=n.memoizedProps;if(_o(x,u)&&n.ref===r.ref)if(Kn=!1,r.pendingProps=u=x,(n.lanes&p)!==0)(n.flags&131072)!==0&&(Kn=!0);else return r.lanes=n.lanes,_r(n,r,p)}return Sd(n,r,o,u,p)}function km(n,r,o){var u=r.pendingProps,p=u.children,x=n!==null?n.memoizedState:null;if(u.mode==="hidden")if((r.mode&1)===0)r.memoizedState={baseLanes:0,cachePool:null,transitions:null},Gt(xa,ai),ai|=o;else{if((o&1073741824)===0)return n=x!==null?x.baseLanes|o:o,r.lanes=r.childLanes=1073741824,r.memoizedState={baseLanes:n,cachePool:null,transitions:null},r.updateQueue=null,Gt(xa,ai),ai|=n,null;r.memoizedState={baseLanes:0,cachePool:null,transitions:null},u=x!==null?x.baseLanes:o,Gt(xa,ai),ai|=u}else x!==null?(u=x.baseLanes|o,r.memoizedState=null):u=o,Gt(xa,ai),ai|=u;return Vn(n,r,p,o),r.child}function Bm(n,r){var o=r.ref;(n===null&&o!==null||n!==null&&n.ref!==o)&&(r.flags|=512,r.flags|=2097152)}function Sd(n,r,o,u,p){var x=$n(o)?ys:Ln.current;return x=la(r,x),pa(r,p),o=dd(n,r,o,u,x,p),u=hd(),n!==null&&!Kn?(r.updateQueue=n.updateQueue,r.flags&=-2053,n.lanes&=~p,_r(n,r,p)):($t&&u&&Yu(r),r.flags|=1,Vn(n,r,o,p),r.child)}function zm(n,r,o,u,p){if($n(o)){var x=!0;Ll(r)}else x=!1;if(pa(r,p),r.stateNode===null)Kl(n,r),Cm(r,o,u),xd(r,o,u,p),u=!0;else if(n===null){var C=r.stateNode,k=r.memoizedProps;C.props=k;var H=C.context,ue=o.contextType;typeof ue=="object"&&ue!==null?ue=gi(ue):(ue=$n(o)?ys:Ln.current,ue=la(r,ue));var ye=o.getDerivedStateFromProps,Me=typeof ye=="function"||typeof C.getSnapshotBeforeUpdate=="function";Me||typeof C.UNSAFE_componentWillReceiveProps!="function"&&typeof C.componentWillReceiveProps!="function"||(k!==u||H!==ue)&&Rm(r,C,u,ue),Gr=!1;var ve=r.memoizedState;C.state=ve,Hl(r,u,C,p),H=r.memoizedState,k!==u||ve!==H||Yn.current||Gr?(typeof ye=="function"&&(_d(r,o,ye,u),H=r.memoizedState),(k=Gr||Am(r,o,k,u,ve,H,ue))?(Me||typeof C.UNSAFE_componentWillMount!="function"&&typeof C.componentWillMount!="function"||(typeof C.componentWillMount=="function"&&C.componentWillMount(),typeof C.UNSAFE_componentWillMount=="function"&&C.UNSAFE_componentWillMount()),typeof C.componentDidMount=="function"&&(r.flags|=4194308)):(typeof C.componentDidMount=="function"&&(r.flags|=4194308),r.memoizedProps=u,r.memoizedState=H),C.props=u,C.state=H,C.context=ue,u=k):(typeof C.componentDidMount=="function"&&(r.flags|=4194308),u=!1)}else{C=r.stateNode,nm(n,r),k=r.memoizedProps,ue=r.type===r.elementType?k:Pi(r.type,k),C.props=ue,Me=r.pendingProps,ve=C.context,H=o.contextType,typeof H=="object"&&H!==null?H=gi(H):(H=$n(o)?ys:Ln.current,H=la(r,H));var Be=o.getDerivedStateFromProps;(ye=typeof Be=="function"||typeof C.getSnapshotBeforeUpdate=="function")||typeof C.UNSAFE_componentWillReceiveProps!="function"&&typeof C.componentWillReceiveProps!="function"||(k!==Me||ve!==H)&&Rm(r,C,u,H),Gr=!1,ve=r.memoizedState,C.state=ve,Hl(r,u,C,p);var Xe=r.memoizedState;k!==Me||ve!==Xe||Yn.current||Gr?(typeof Be=="function"&&(_d(r,o,Be,u),Xe=r.memoizedState),(ue=Gr||Am(r,o,ue,u,ve,Xe,H)||!1)?(ye||typeof C.UNSAFE_componentWillUpdate!="function"&&typeof C.componentWillUpdate!="function"||(typeof C.componentWillUpdate=="function"&&C.componentWillUpdate(u,Xe,H),typeof C.UNSAFE_componentWillUpdate=="function"&&C.UNSAFE_componentWillUpdate(u,Xe,H)),typeof C.componentDidUpdate=="function"&&(r.flags|=4),typeof C.getSnapshotBeforeUpdate=="function"&&(r.flags|=1024)):(typeof C.componentDidUpdate!="function"||k===n.memoizedProps&&ve===n.memoizedState||(r.flags|=4),typeof C.getSnapshotBeforeUpdate!="function"||k===n.memoizedProps&&ve===n.memoizedState||(r.flags|=1024),r.memoizedProps=u,r.memoizedState=Xe),C.props=u,C.state=Xe,C.context=H,u=ue):(typeof C.componentDidUpdate!="function"||k===n.memoizedProps&&ve===n.memoizedState||(r.flags|=4),typeof C.getSnapshotBeforeUpdate!="function"||k===n.memoizedProps&&ve===n.memoizedState||(r.flags|=1024),u=!1)}return Md(n,r,o,u,x,p)}function Md(n,r,o,u,p,x){Bm(n,r);var C=(r.flags&128)!==0;if(!u&&!C)return p&&jp(r,o,!1),_r(n,r,x);u=r.stateNode,xv.current=r;var k=C&&typeof o.getDerivedStateFromError!="function"?null:u.render();return r.flags|=1,n!==null&&C?(r.child=ha(r,n.child,null,x),r.child=ha(r,null,k,x)):Vn(n,r,k,x),r.memoizedState=u.state,p&&jp(r,o,!0),r.child}function Hm(n){var r=n.stateNode;r.pendingContext?Gp(n,r.pendingContext,r.pendingContext!==r.context):r.context&&Gp(n,r.context,!1),sd(n,r.containerInfo)}function Vm(n,r,o,u,p){return da(),Qu(p),r.flags|=256,Vn(n,r,o,u),r.child}var Ed={dehydrated:null,treeContext:null,retryLane:0};function wd(n){return{baseLanes:n,cachePool:null,transitions:null}}function Gm(n,r,o){var u=r.pendingProps,p=Zt.current,x=!1,C=(r.flags&128)!==0,k;if((k=C)||(k=n!==null&&n.memoizedState===null?!1:(p&2)!==0),k?(x=!0,r.flags&=-129):(n===null||n.memoizedState!==null)&&(p|=1),Gt(Zt,p&1),n===null)return Zu(r),n=r.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?((r.mode&1)===0?r.lanes=1:n.data==="$!"?r.lanes=8:r.lanes=1073741824,null):(C=u.children,n=u.fallback,x?(u=r.mode,x=r.child,C={mode:"hidden",children:C},(u&1)===0&&x!==null?(x.childLanes=0,x.pendingProps=C):x=lc(C,u,0,null),n=Ps(n,u,o,null),x.return=r,n.return=r,x.sibling=n,r.child=x,r.child.memoizedState=wd(o),r.memoizedState=Ed,n):bd(r,C));if(p=n.memoizedState,p!==null&&(k=p.dehydrated,k!==null))return vv(n,r,C,u,k,p,o);if(x){x=u.fallback,C=r.mode,p=n.child,k=p.sibling;var H={mode:"hidden",children:u.children};return(C&1)===0&&r.child!==p?(u=r.child,u.childLanes=0,u.pendingProps=H,r.deletions=null):(u=Kr(p,H),u.subtreeFlags=p.subtreeFlags&14680064),k!==null?x=Kr(k,x):(x=Ps(x,C,o,null),x.flags|=2),x.return=r,u.return=r,u.sibling=x,r.child=u,u=x,x=r.child,C=n.child.memoizedState,C=C===null?wd(o):{baseLanes:C.baseLanes|o,cachePool:null,transitions:C.transitions},x.memoizedState=C,x.childLanes=n.childLanes&~o,r.memoizedState=Ed,u}return x=n.child,n=x.sibling,u=Kr(x,{mode:"visible",children:u.children}),(r.mode&1)===0&&(u.lanes=o),u.return=r,u.sibling=null,n!==null&&(o=r.deletions,o===null?(r.deletions=[n],r.flags|=16):o.push(n)),r.child=u,r.memoizedState=null,u}function bd(n,r){return r=lc({mode:"visible",children:r},n.mode,0,null),r.return=n,n.child=r}function $l(n,r,o,u){return u!==null&&Qu(u),ha(r,n.child,null,o),n=bd(r,r.pendingProps.children),n.flags|=2,r.memoizedState=null,n}function vv(n,r,o,u,p,x,C){if(o)return r.flags&256?(r.flags&=-257,u=vd(Error(t(422))),$l(n,r,C,u)):r.memoizedState!==null?(r.child=n.child,r.flags|=128,null):(x=u.fallback,p=r.mode,u=lc({mode:"visible",children:u.children},p,0,null),x=Ps(x,p,C,null),x.flags|=2,u.return=r,x.return=r,u.sibling=x,r.child=u,(r.mode&1)!==0&&ha(r,n.child,null,C),r.child.memoizedState=wd(C),r.memoizedState=Ed,x);if((r.mode&1)===0)return $l(n,r,C,null);if(p.data==="$!"){if(u=p.nextSibling&&p.nextSibling.dataset,u)var k=u.dgst;return u=k,x=Error(t(419)),u=vd(x,u,void 0),$l(n,r,C,u)}if(k=(C&n.childLanes)!==0,Kn||k){if(u=En,u!==null){switch(C&-C){case 4:p=2;break;case 16:p=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:p=32;break;case 536870912:p=268435456;break;default:p=0}p=(p&(u.suspendedLanes|C))!==0?0:p,p!==0&&p!==x.retryLane&&(x.retryLane=p,mr(n,p),Di(u,n,p,-1))}return Hd(),u=vd(Error(t(421))),$l(n,r,C,u)}return p.data==="$?"?(r.flags|=128,r.child=n.child,r=Lv.bind(null,n),p._reactRetry=r,null):(n=x.treeContext,si=Br(p.nextSibling),ri=r,$t=!0,Ri=null,n!==null&&(pi[mi++]=fr,pi[mi++]=pr,pi[mi++]=Ss,fr=n.id,pr=n.overflow,Ss=r),r=bd(r,u.children),r.flags|=4096,r)}function Wm(n,r,o){n.lanes|=r;var u=n.alternate;u!==null&&(u.lanes|=r),nd(n.return,r,o)}function Td(n,r,o,u,p){var x=n.memoizedState;x===null?n.memoizedState={isBackwards:r,rendering:null,renderingStartTime:0,last:u,tail:o,tailMode:p}:(x.isBackwards=r,x.rendering=null,x.renderingStartTime=0,x.last=u,x.tail=o,x.tailMode=p)}function jm(n,r,o){var u=r.pendingProps,p=u.revealOrder,x=u.tail;if(Vn(n,r,u.children,o),u=Zt.current,(u&2)!==0)u=u&1|2,r.flags|=128;else{if(n!==null&&(n.flags&128)!==0)e:for(n=r.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&Wm(n,o,r);else if(n.tag===19)Wm(n,o,r);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===r)break e;for(;n.sibling===null;){if(n.return===null||n.return===r)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}u&=1}if(Gt(Zt,u),(r.mode&1)===0)r.memoizedState=null;else switch(p){case"forwards":for(o=r.child,p=null;o!==null;)n=o.alternate,n!==null&&Vl(n)===null&&(p=o),o=o.sibling;o=p,o===null?(p=r.child,r.child=null):(p=o.sibling,o.sibling=null),Td(r,!1,p,o,x);break;case"backwards":for(o=null,p=r.child,r.child=null;p!==null;){if(n=p.alternate,n!==null&&Vl(n)===null){r.child=p;break}n=p.sibling,p.sibling=o,o=p,p=n}Td(r,!0,o,null,x);break;case"together":Td(r,!1,null,null,void 0);break;default:r.memoizedState=null}return r.child}function Kl(n,r){(r.mode&1)===0&&n!==null&&(n.alternate=null,r.alternate=null,r.flags|=2)}function _r(n,r,o){if(n!==null&&(r.dependencies=n.dependencies),Ts|=r.lanes,(o&r.childLanes)===0)return null;if(n!==null&&r.child!==n.child)throw Error(t(153));if(r.child!==null){for(n=r.child,o=Kr(n,n.pendingProps),r.child=o,o.return=r;n.sibling!==null;)n=n.sibling,o=o.sibling=Kr(n,n.pendingProps),o.return=r;o.sibling=null}return r.child}function yv(n,r,o){switch(r.tag){case 3:Hm(r),da();break;case 5:sm(r);break;case 1:$n(r.type)&&Ll(r);break;case 4:sd(r,r.stateNode.containerInfo);break;case 10:var u=r.type._context,p=r.memoizedProps.value;Gt(kl,u._currentValue),u._currentValue=p;break;case 13:if(u=r.memoizedState,u!==null)return u.dehydrated!==null?(Gt(Zt,Zt.current&1),r.flags|=128,null):(o&r.child.childLanes)!==0?Gm(n,r,o):(Gt(Zt,Zt.current&1),n=_r(n,r,o),n!==null?n.sibling:null);Gt(Zt,Zt.current&1);break;case 19:if(u=(o&r.childLanes)!==0,(n.flags&128)!==0){if(u)return jm(n,r,o);r.flags|=128}if(p=r.memoizedState,p!==null&&(p.rendering=null,p.tail=null,p.lastEffect=null),Gt(Zt,Zt.current),u)break;return null;case 22:case 23:return r.lanes=0,km(n,r,o)}return _r(n,r,o)}var Xm,Ad,qm,Ym;Xm=function(n,r){for(var o=r.child;o!==null;){if(o.tag===5||o.tag===6)n.appendChild(o.stateNode);else if(o.tag!==4&&o.child!==null){o.child.return=o,o=o.child;continue}if(o===r)break;for(;o.sibling===null;){if(o.return===null||o.return===r)return;o=o.return}o.sibling.return=o.return,o=o.sibling}},Ad=function(){},qm=function(n,r,o,u){var p=n.memoizedProps;if(p!==u){n=r.stateNode,ws(ji.current);var x=null;switch(o){case"input":p=pt(n,p),u=pt(n,u),x=[];break;case"select":p=K({},p,{value:void 0}),u=K({},u,{value:void 0}),x=[];break;case"textarea":p=qt(n,p),u=qt(n,u),x=[];break;default:typeof p.onClick!="function"&&typeof u.onClick=="function"&&(n.onclick=Rl)}$e(o,u);var C;o=null;for(ue in p)if(!u.hasOwnProperty(ue)&&p.hasOwnProperty(ue)&&p[ue]!=null)if(ue==="style"){var k=p[ue];for(C in k)k.hasOwnProperty(C)&&(o||(o={}),o[C]="")}else ue!=="dangerouslySetInnerHTML"&&ue!=="children"&&ue!=="suppressContentEditableWarning"&&ue!=="suppressHydrationWarning"&&ue!=="autoFocus"&&(a.hasOwnProperty(ue)?x||(x=[]):(x=x||[]).push(ue,null));for(ue in u){var H=u[ue];if(k=p!=null?p[ue]:void 0,u.hasOwnProperty(ue)&&H!==k&&(H!=null||k!=null))if(ue==="style")if(k){for(C in k)!k.hasOwnProperty(C)||H&&H.hasOwnProperty(C)||(o||(o={}),o[C]="");for(C in H)H.hasOwnProperty(C)&&k[C]!==H[C]&&(o||(o={}),o[C]=H[C])}else o||(x||(x=[]),x.push(ue,o)),o=H;else ue==="dangerouslySetInnerHTML"?(H=H?H.__html:void 0,k=k?k.__html:void 0,H!=null&&k!==H&&(x=x||[]).push(ue,H)):ue==="children"?typeof H!="string"&&typeof H!="number"||(x=x||[]).push(ue,""+H):ue!=="suppressContentEditableWarning"&&ue!=="suppressHydrationWarning"&&(a.hasOwnProperty(ue)?(H!=null&&ue==="onScroll"&&Wt("scroll",n),x||k===H||(x=[])):(x=x||[]).push(ue,H))}o&&(x=x||[]).push("style",o);var ue=x;(r.updateQueue=ue)&&(r.flags|=4)}},Ym=function(n,r,o,u){o!==u&&(r.flags|=4)};function Lo(n,r){if(!$t)switch(n.tailMode){case"hidden":r=n.tail;for(var o=null;r!==null;)r.alternate!==null&&(o=r),r=r.sibling;o===null?n.tail=null:o.sibling=null;break;case"collapsed":o=n.tail;for(var u=null;o!==null;)o.alternate!==null&&(u=o),o=o.sibling;u===null?r||n.tail===null?n.tail=null:n.tail.sibling=null:u.sibling=null}}function In(n){var r=n.alternate!==null&&n.alternate.child===n.child,o=0,u=0;if(r)for(var p=n.child;p!==null;)o|=p.lanes|p.childLanes,u|=p.subtreeFlags&14680064,u|=p.flags&14680064,p.return=n,p=p.sibling;else for(p=n.child;p!==null;)o|=p.lanes|p.childLanes,u|=p.subtreeFlags,u|=p.flags,p.return=n,p=p.sibling;return n.subtreeFlags|=u,n.childLanes=o,r}function Sv(n,r,o){var u=r.pendingProps;switch($u(r),r.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return In(r),null;case 1:return $n(r.type)&&Nl(),In(r),null;case 3:return u=r.stateNode,ma(),jt(Yn),jt(Ln),ld(),u.pendingContext&&(u.context=u.pendingContext,u.pendingContext=null),(n===null||n.child===null)&&(Fl(r)?r.flags|=4:n===null||n.memoizedState.isDehydrated&&(r.flags&256)===0||(r.flags|=1024,Ri!==null&&(kd(Ri),Ri=null))),Ad(n,r),In(r),null;case 5:ad(r);var p=ws(Ao.current);if(o=r.type,n!==null&&r.stateNode!=null)qm(n,r,o,u,p),n.ref!==r.ref&&(r.flags|=512,r.flags|=2097152);else{if(!u){if(r.stateNode===null)throw Error(t(166));return In(r),null}if(n=ws(ji.current),Fl(r)){u=r.stateNode,o=r.type;var x=r.memoizedProps;switch(u[Wi]=r,u[Mo]=x,n=(r.mode&1)!==0,o){case"dialog":Wt("cancel",u),Wt("close",u);break;case"iframe":case"object":case"embed":Wt("load",u);break;case"video":case"audio":for(p=0;p<vo.length;p++)Wt(vo[p],u);break;case"source":Wt("error",u);break;case"img":case"image":case"link":Wt("error",u),Wt("load",u);break;case"details":Wt("toggle",u);break;case"input":St(u,x),Wt("invalid",u);break;case"select":u._wrapperState={wasMultiple:!!x.multiple},Wt("invalid",u);break;case"textarea":X(u,x),Wt("invalid",u)}$e(o,x),p=null;for(var C in x)if(x.hasOwnProperty(C)){var k=x[C];C==="children"?typeof k=="string"?u.textContent!==k&&(x.suppressHydrationWarning!==!0&&Cl(u.textContent,k,n),p=["children",k]):typeof k=="number"&&u.textContent!==""+k&&(x.suppressHydrationWarning!==!0&&Cl(u.textContent,k,n),p=["children",""+k]):a.hasOwnProperty(C)&&k!=null&&C==="onScroll"&&Wt("scroll",u)}switch(o){case"input":Oe(u),Ht(u,x,!0);break;case"textarea":Oe(u),At(u);break;case"select":case"option":break;default:typeof x.onClick=="function"&&(u.onclick=Rl)}u=p,r.updateQueue=u,u!==null&&(r.flags|=4)}else{C=p.nodeType===9?p:p.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=O(o)),n==="http://www.w3.org/1999/xhtml"?o==="script"?(n=C.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof u.is=="string"?n=C.createElement(o,{is:u.is}):(n=C.createElement(o),o==="select"&&(C=n,u.multiple?C.multiple=!0:u.size&&(C.size=u.size))):n=C.createElementNS(n,o),n[Wi]=r,n[Mo]=u,Xm(n,r,!1,!1),r.stateNode=n;e:{switch(C=Ne(o,u),o){case"dialog":Wt("cancel",n),Wt("close",n),p=u;break;case"iframe":case"object":case"embed":Wt("load",n),p=u;break;case"video":case"audio":for(p=0;p<vo.length;p++)Wt(vo[p],n);p=u;break;case"source":Wt("error",n),p=u;break;case"img":case"image":case"link":Wt("error",n),Wt("load",n),p=u;break;case"details":Wt("toggle",n),p=u;break;case"input":St(n,u),p=pt(n,u),Wt("invalid",n);break;case"option":p=u;break;case"select":n._wrapperState={wasMultiple:!!u.multiple},p=K({},u,{value:void 0}),Wt("invalid",n);break;case"textarea":X(n,u),p=qt(n,u),Wt("invalid",n);break;default:p=u}$e(o,p),k=p;for(x in k)if(k.hasOwnProperty(x)){var H=k[x];x==="style"?_e(n,H):x==="dangerouslySetInnerHTML"?(H=H?H.__html:void 0,H!=null&&oe(n,H)):x==="children"?typeof H=="string"?(o!=="textarea"||H!=="")&&fe(n,H):typeof H=="number"&&fe(n,""+H):x!=="suppressContentEditableWarning"&&x!=="suppressHydrationWarning"&&x!=="autoFocus"&&(a.hasOwnProperty(x)?H!=null&&x==="onScroll"&&Wt("scroll",n):H!=null&&I(n,x,H,C))}switch(o){case"input":Oe(n),Ht(n,u,!1);break;case"textarea":Oe(n),At(n);break;case"option":u.value!=null&&n.setAttribute("value",""+de(u.value));break;case"select":n.multiple=!!u.multiple,x=u.value,x!=null?Dt(n,!!u.multiple,x,!1):u.defaultValue!=null&&Dt(n,!!u.multiple,u.defaultValue,!0);break;default:typeof p.onClick=="function"&&(n.onclick=Rl)}switch(o){case"button":case"input":case"select":case"textarea":u=!!u.autoFocus;break e;case"img":u=!0;break e;default:u=!1}}u&&(r.flags|=4)}r.ref!==null&&(r.flags|=512,r.flags|=2097152)}return In(r),null;case 6:if(n&&r.stateNode!=null)Ym(n,r,n.memoizedProps,u);else{if(typeof u!="string"&&r.stateNode===null)throw Error(t(166));if(o=ws(Ao.current),ws(ji.current),Fl(r)){if(u=r.stateNode,o=r.memoizedProps,u[Wi]=r,(x=u.nodeValue!==o)&&(n=ri,n!==null))switch(n.tag){case 3:Cl(u.nodeValue,o,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&Cl(u.nodeValue,o,(n.mode&1)!==0)}x&&(r.flags|=4)}else u=(o.nodeType===9?o:o.ownerDocument).createTextNode(u),u[Wi]=r,r.stateNode=u}return In(r),null;case 13:if(jt(Zt),u=r.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if($t&&si!==null&&(r.mode&1)!==0&&(r.flags&128)===0)Zp(),da(),r.flags|=98560,x=!1;else if(x=Fl(r),u!==null&&u.dehydrated!==null){if(n===null){if(!x)throw Error(t(318));if(x=r.memoizedState,x=x!==null?x.dehydrated:null,!x)throw Error(t(317));x[Wi]=r}else da(),(r.flags&128)===0&&(r.memoizedState=null),r.flags|=4;In(r),x=!1}else Ri!==null&&(kd(Ri),Ri=null),x=!0;if(!x)return r.flags&65536?r:null}return(r.flags&128)!==0?(r.lanes=o,r):(u=u!==null,u!==(n!==null&&n.memoizedState!==null)&&u&&(r.child.flags|=8192,(r.mode&1)!==0&&(n===null||(Zt.current&1)!==0?gn===0&&(gn=3):Hd())),r.updateQueue!==null&&(r.flags|=4),In(r),null);case 4:return ma(),Ad(n,r),n===null&&yo(r.stateNode.containerInfo),In(r),null;case 10:return td(r.type._context),In(r),null;case 17:return $n(r.type)&&Nl(),In(r),null;case 19:if(jt(Zt),x=r.memoizedState,x===null)return In(r),null;if(u=(r.flags&128)!==0,C=x.rendering,C===null)if(u)Lo(x,!1);else{if(gn!==0||n!==null&&(n.flags&128)!==0)for(n=r.child;n!==null;){if(C=Vl(n),C!==null){for(r.flags|=128,Lo(x,!1),u=C.updateQueue,u!==null&&(r.updateQueue=u,r.flags|=4),r.subtreeFlags=0,u=o,o=r.child;o!==null;)x=o,n=u,x.flags&=14680066,C=x.alternate,C===null?(x.childLanes=0,x.lanes=n,x.child=null,x.subtreeFlags=0,x.memoizedProps=null,x.memoizedState=null,x.updateQueue=null,x.dependencies=null,x.stateNode=null):(x.childLanes=C.childLanes,x.lanes=C.lanes,x.child=C.child,x.subtreeFlags=0,x.deletions=null,x.memoizedProps=C.memoizedProps,x.memoizedState=C.memoizedState,x.updateQueue=C.updateQueue,x.type=C.type,n=C.dependencies,x.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),o=o.sibling;return Gt(Zt,Zt.current&1|2),r.child}n=n.sibling}x.tail!==null&&Kt()>va&&(r.flags|=128,u=!0,Lo(x,!1),r.lanes=4194304)}else{if(!u)if(n=Vl(C),n!==null){if(r.flags|=128,u=!0,o=n.updateQueue,o!==null&&(r.updateQueue=o,r.flags|=4),Lo(x,!0),x.tail===null&&x.tailMode==="hidden"&&!C.alternate&&!$t)return In(r),null}else 2*Kt()-x.renderingStartTime>va&&o!==1073741824&&(r.flags|=128,u=!0,Lo(x,!1),r.lanes=4194304);x.isBackwards?(C.sibling=r.child,r.child=C):(o=x.last,o!==null?o.sibling=C:r.child=C,x.last=C)}return x.tail!==null?(r=x.tail,x.rendering=r,x.tail=r.sibling,x.renderingStartTime=Kt(),r.sibling=null,o=Zt.current,Gt(Zt,u?o&1|2:o&1),r):(In(r),null);case 22:case 23:return zd(),u=r.memoizedState!==null,n!==null&&n.memoizedState!==null!==u&&(r.flags|=8192),u&&(r.mode&1)!==0?(ai&1073741824)!==0&&(In(r),r.subtreeFlags&6&&(r.flags|=8192)):In(r),null;case 24:return null;case 25:return null}throw Error(t(156,r.tag))}function Mv(n,r){switch($u(r),r.tag){case 1:return $n(r.type)&&Nl(),n=r.flags,n&65536?(r.flags=n&-65537|128,r):null;case 3:return ma(),jt(Yn),jt(Ln),ld(),n=r.flags,(n&65536)!==0&&(n&128)===0?(r.flags=n&-65537|128,r):null;case 5:return ad(r),null;case 13:if(jt(Zt),n=r.memoizedState,n!==null&&n.dehydrated!==null){if(r.alternate===null)throw Error(t(340));da()}return n=r.flags,n&65536?(r.flags=n&-65537|128,r):null;case 19:return jt(Zt),null;case 4:return ma(),null;case 10:return td(r.type._context),null;case 22:case 23:return zd(),null;case 24:return null;default:return null}}var Zl=!1,Un=!1,Ev=typeof WeakSet=="function"?WeakSet:Set,Ve=null;function _a(n,r){var o=n.ref;if(o!==null)if(typeof o=="function")try{o(null)}catch(u){sn(n,r,u)}else o.current=null}function Cd(n,r,o){try{o()}catch(u){sn(n,r,u)}}var $m=!1;function wv(n,r){if(zu=_l,n=Ap(),Lu(n)){if("selectionStart"in n)var o={start:n.selectionStart,end:n.selectionEnd};else e:{o=(o=n.ownerDocument)&&o.defaultView||window;var u=o.getSelection&&o.getSelection();if(u&&u.rangeCount!==0){o=u.anchorNode;var p=u.anchorOffset,x=u.focusNode;u=u.focusOffset;try{o.nodeType,x.nodeType}catch{o=null;break e}var C=0,k=-1,H=-1,ue=0,ye=0,Me=n,ve=null;t:for(;;){for(var Be;Me!==o||p!==0&&Me.nodeType!==3||(k=C+p),Me!==x||u!==0&&Me.nodeType!==3||(H=C+u),Me.nodeType===3&&(C+=Me.nodeValue.length),(Be=Me.firstChild)!==null;)ve=Me,Me=Be;for(;;){if(Me===n)break t;if(ve===o&&++ue===p&&(k=C),ve===x&&++ye===u&&(H=C),(Be=Me.nextSibling)!==null)break;Me=ve,ve=Me.parentNode}Me=Be}o=k===-1||H===-1?null:{start:k,end:H}}else o=null}o=o||{start:0,end:0}}else o=null;for(Hu={focusedElem:n,selectionRange:o},_l=!1,Ve=r;Ve!==null;)if(r=Ve,n=r.child,(r.subtreeFlags&1028)!==0&&n!==null)n.return=r,Ve=n;else for(;Ve!==null;){r=Ve;try{var Xe=r.alternate;if((r.flags&1024)!==0)switch(r.tag){case 0:case 11:case 15:break;case 1:if(Xe!==null){var Ye=Xe.memoizedProps,ln=Xe.memoizedState,ie=r.stateNode,q=ie.getSnapshotBeforeUpdate(r.elementType===r.type?Ye:Pi(r.type,Ye),ln);ie.__reactInternalSnapshotBeforeUpdate=q}break;case 3:var se=r.stateNode.containerInfo;se.nodeType===1?se.textContent="":se.nodeType===9&&se.documentElement&&se.removeChild(se.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(t(163))}}catch(be){sn(r,r.return,be)}if(n=r.sibling,n!==null){n.return=r.return,Ve=n;break}Ve=r.return}return Xe=$m,$m=!1,Xe}function Do(n,r,o){var u=r.updateQueue;if(u=u!==null?u.lastEffect:null,u!==null){var p=u=u.next;do{if((p.tag&n)===n){var x=p.destroy;p.destroy=void 0,x!==void 0&&Cd(r,o,x)}p=p.next}while(p!==u)}}function Ql(n,r){if(r=r.updateQueue,r=r!==null?r.lastEffect:null,r!==null){var o=r=r.next;do{if((o.tag&n)===n){var u=o.create;o.destroy=u()}o=o.next}while(o!==r)}}function Rd(n){var r=n.ref;if(r!==null){var o=n.stateNode;switch(n.tag){case 5:n=o;break;default:n=o}typeof r=="function"?r(n):r.current=n}}function Km(n){var r=n.alternate;r!==null&&(n.alternate=null,Km(r)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(r=n.stateNode,r!==null&&(delete r[Wi],delete r[Mo],delete r[ju],delete r[av],delete r[ov])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function Zm(n){return n.tag===5||n.tag===3||n.tag===4}function Qm(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||Zm(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function Pd(n,r,o){var u=n.tag;if(u===5||u===6)n=n.stateNode,r?o.nodeType===8?o.parentNode.insertBefore(n,r):o.insertBefore(n,r):(o.nodeType===8?(r=o.parentNode,r.insertBefore(n,o)):(r=o,r.appendChild(n)),o=o._reactRootContainer,o!=null||r.onclick!==null||(r.onclick=Rl));else if(u!==4&&(n=n.child,n!==null))for(Pd(n,r,o),n=n.sibling;n!==null;)Pd(n,r,o),n=n.sibling}function Nd(n,r,o){var u=n.tag;if(u===5||u===6)n=n.stateNode,r?o.insertBefore(n,r):o.appendChild(n);else if(u!==4&&(n=n.child,n!==null))for(Nd(n,r,o),n=n.sibling;n!==null;)Nd(n,r,o),n=n.sibling}var Cn=null,Ni=!1;function jr(n,r,o){for(o=o.child;o!==null;)Jm(n,r,o),o=o.sibling}function Jm(n,r,o){if(ee&&typeof ee.onCommitFiberUnmount=="function")try{ee.onCommitFiberUnmount(ne,o)}catch{}switch(o.tag){case 5:Un||_a(o,r);case 6:var u=Cn,p=Ni;Cn=null,jr(n,r,o),Cn=u,Ni=p,Cn!==null&&(Ni?(n=Cn,o=o.stateNode,n.nodeType===8?n.parentNode.removeChild(o):n.removeChild(o)):Cn.removeChild(o.stateNode));break;case 18:Cn!==null&&(Ni?(n=Cn,o=o.stateNode,n.nodeType===8?Wu(n.parentNode,o):n.nodeType===1&&Wu(n,o),uo(n)):Wu(Cn,o.stateNode));break;case 4:u=Cn,p=Ni,Cn=o.stateNode.containerInfo,Ni=!0,jr(n,r,o),Cn=u,Ni=p;break;case 0:case 11:case 14:case 15:if(!Un&&(u=o.updateQueue,u!==null&&(u=u.lastEffect,u!==null))){p=u=u.next;do{var x=p,C=x.destroy;x=x.tag,C!==void 0&&((x&2)!==0||(x&4)!==0)&&Cd(o,r,C),p=p.next}while(p!==u)}jr(n,r,o);break;case 1:if(!Un&&(_a(o,r),u=o.stateNode,typeof u.componentWillUnmount=="function"))try{u.props=o.memoizedProps,u.state=o.memoizedState,u.componentWillUnmount()}catch(k){sn(o,r,k)}jr(n,r,o);break;case 21:jr(n,r,o);break;case 22:o.mode&1?(Un=(u=Un)||o.memoizedState!==null,jr(n,r,o),Un=u):jr(n,r,o);break;default:jr(n,r,o)}}function e0(n){var r=n.updateQueue;if(r!==null){n.updateQueue=null;var o=n.stateNode;o===null&&(o=n.stateNode=new Ev),r.forEach(function(u){var p=Dv.bind(null,n,u);o.has(u)||(o.add(u),u.then(p,p))})}}function Li(n,r){var o=r.deletions;if(o!==null)for(var u=0;u<o.length;u++){var p=o[u];try{var x=n,C=r,k=C;e:for(;k!==null;){switch(k.tag){case 5:Cn=k.stateNode,Ni=!1;break e;case 3:Cn=k.stateNode.containerInfo,Ni=!0;break e;case 4:Cn=k.stateNode.containerInfo,Ni=!0;break e}k=k.return}if(Cn===null)throw Error(t(160));Jm(x,C,p),Cn=null,Ni=!1;var H=p.alternate;H!==null&&(H.return=null),p.return=null}catch(ue){sn(p,r,ue)}}if(r.subtreeFlags&12854)for(r=r.child;r!==null;)t0(r,n),r=r.sibling}function t0(n,r){var o=n.alternate,u=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(Li(r,n),qi(n),u&4){try{Do(3,n,n.return),Ql(3,n)}catch(Ye){sn(n,n.return,Ye)}try{Do(5,n,n.return)}catch(Ye){sn(n,n.return,Ye)}}break;case 1:Li(r,n),qi(n),u&512&&o!==null&&_a(o,o.return);break;case 5:if(Li(r,n),qi(n),u&512&&o!==null&&_a(o,o.return),n.flags&32){var p=n.stateNode;try{fe(p,"")}catch(Ye){sn(n,n.return,Ye)}}if(u&4&&(p=n.stateNode,p!=null)){var x=n.memoizedProps,C=o!==null?o.memoizedProps:x,k=n.type,H=n.updateQueue;if(n.updateQueue=null,H!==null)try{k==="input"&&x.type==="radio"&&x.name!=null&&It(p,x),Ne(k,C);var ue=Ne(k,x);for(C=0;C<H.length;C+=2){var ye=H[C],Me=H[C+1];ye==="style"?_e(p,Me):ye==="dangerouslySetInnerHTML"?oe(p,Me):ye==="children"?fe(p,Me):I(p,ye,Me,ue)}switch(k){case"input":mt(p,x);break;case"textarea":fn(p,x);break;case"select":var ve=p._wrapperState.wasMultiple;p._wrapperState.wasMultiple=!!x.multiple;var Be=x.value;Be!=null?Dt(p,!!x.multiple,Be,!1):ve!==!!x.multiple&&(x.defaultValue!=null?Dt(p,!!x.multiple,x.defaultValue,!0):Dt(p,!!x.multiple,x.multiple?[]:"",!1))}p[Mo]=x}catch(Ye){sn(n,n.return,Ye)}}break;case 6:if(Li(r,n),qi(n),u&4){if(n.stateNode===null)throw Error(t(162));p=n.stateNode,x=n.memoizedProps;try{p.nodeValue=x}catch(Ye){sn(n,n.return,Ye)}}break;case 3:if(Li(r,n),qi(n),u&4&&o!==null&&o.memoizedState.isDehydrated)try{uo(r.containerInfo)}catch(Ye){sn(n,n.return,Ye)}break;case 4:Li(r,n),qi(n);break;case 13:Li(r,n),qi(n),p=n.child,p.flags&8192&&(x=p.memoizedState!==null,p.stateNode.isHidden=x,!x||p.alternate!==null&&p.alternate.memoizedState!==null||(Id=Kt())),u&4&&e0(n);break;case 22:if(ye=o!==null&&o.memoizedState!==null,n.mode&1?(Un=(ue=Un)||ye,Li(r,n),Un=ue):Li(r,n),qi(n),u&8192){if(ue=n.memoizedState!==null,(n.stateNode.isHidden=ue)&&!ye&&(n.mode&1)!==0)for(Ve=n,ye=n.child;ye!==null;){for(Me=Ve=ye;Ve!==null;){switch(ve=Ve,Be=ve.child,ve.tag){case 0:case 11:case 14:case 15:Do(4,ve,ve.return);break;case 1:_a(ve,ve.return);var Xe=ve.stateNode;if(typeof Xe.componentWillUnmount=="function"){u=ve,o=ve.return;try{r=u,Xe.props=r.memoizedProps,Xe.state=r.memoizedState,Xe.componentWillUnmount()}catch(Ye){sn(u,o,Ye)}}break;case 5:_a(ve,ve.return);break;case 22:if(ve.memoizedState!==null){r0(Me);continue}}Be!==null?(Be.return=ve,Ve=Be):r0(Me)}ye=ye.sibling}e:for(ye=null,Me=n;;){if(Me.tag===5){if(ye===null){ye=Me;try{p=Me.stateNode,ue?(x=p.style,typeof x.setProperty=="function"?x.setProperty("display","none","important"):x.display="none"):(k=Me.stateNode,H=Me.memoizedProps.style,C=H!=null&&H.hasOwnProperty("display")?H.display:null,k.style.display=pe("display",C))}catch(Ye){sn(n,n.return,Ye)}}}else if(Me.tag===6){if(ye===null)try{Me.stateNode.nodeValue=ue?"":Me.memoizedProps}catch(Ye){sn(n,n.return,Ye)}}else if((Me.tag!==22&&Me.tag!==23||Me.memoizedState===null||Me===n)&&Me.child!==null){Me.child.return=Me,Me=Me.child;continue}if(Me===n)break e;for(;Me.sibling===null;){if(Me.return===null||Me.return===n)break e;ye===Me&&(ye=null),Me=Me.return}ye===Me&&(ye=null),Me.sibling.return=Me.return,Me=Me.sibling}}break;case 19:Li(r,n),qi(n),u&4&&e0(n);break;case 21:break;default:Li(r,n),qi(n)}}function qi(n){var r=n.flags;if(r&2){try{e:{for(var o=n.return;o!==null;){if(Zm(o)){var u=o;break e}o=o.return}throw Error(t(160))}switch(u.tag){case 5:var p=u.stateNode;u.flags&32&&(fe(p,""),u.flags&=-33);var x=Qm(n);Nd(n,x,p);break;case 3:case 4:var C=u.stateNode.containerInfo,k=Qm(n);Pd(n,k,C);break;default:throw Error(t(161))}}catch(H){sn(n,n.return,H)}n.flags&=-3}r&4096&&(n.flags&=-4097)}function bv(n,r,o){Ve=n,n0(n)}function n0(n,r,o){for(var u=(n.mode&1)!==0;Ve!==null;){var p=Ve,x=p.child;if(p.tag===22&&u){var C=p.memoizedState!==null||Zl;if(!C){var k=p.alternate,H=k!==null&&k.memoizedState!==null||Un;k=Zl;var ue=Un;if(Zl=C,(Un=H)&&!ue)for(Ve=p;Ve!==null;)C=Ve,H=C.child,C.tag===22&&C.memoizedState!==null?s0(p):H!==null?(H.return=C,Ve=H):s0(p);for(;x!==null;)Ve=x,n0(x),x=x.sibling;Ve=p,Zl=k,Un=ue}i0(n)}else(p.subtreeFlags&8772)!==0&&x!==null?(x.return=p,Ve=x):i0(n)}}function i0(n){for(;Ve!==null;){var r=Ve;if((r.flags&8772)!==0){var o=r.alternate;try{if((r.flags&8772)!==0)switch(r.tag){case 0:case 11:case 15:Un||Ql(5,r);break;case 1:var u=r.stateNode;if(r.flags&4&&!Un)if(o===null)u.componentDidMount();else{var p=r.elementType===r.type?o.memoizedProps:Pi(r.type,o.memoizedProps);u.componentDidUpdate(p,o.memoizedState,u.__reactInternalSnapshotBeforeUpdate)}var x=r.updateQueue;x!==null&&rm(r,x,u);break;case 3:var C=r.updateQueue;if(C!==null){if(o=null,r.child!==null)switch(r.child.tag){case 5:o=r.child.stateNode;break;case 1:o=r.child.stateNode}rm(r,C,o)}break;case 5:var k=r.stateNode;if(o===null&&r.flags&4){o=k;var H=r.memoizedProps;switch(r.type){case"button":case"input":case"select":case"textarea":H.autoFocus&&o.focus();break;case"img":H.src&&(o.src=H.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(r.memoizedState===null){var ue=r.alternate;if(ue!==null){var ye=ue.memoizedState;if(ye!==null){var Me=ye.dehydrated;Me!==null&&uo(Me)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(t(163))}Un||r.flags&512&&Rd(r)}catch(ve){sn(r,r.return,ve)}}if(r===n){Ve=null;break}if(o=r.sibling,o!==null){o.return=r.return,Ve=o;break}Ve=r.return}}function r0(n){for(;Ve!==null;){var r=Ve;if(r===n){Ve=null;break}var o=r.sibling;if(o!==null){o.return=r.return,Ve=o;break}Ve=r.return}}function s0(n){for(;Ve!==null;){var r=Ve;try{switch(r.tag){case 0:case 11:case 15:var o=r.return;try{Ql(4,r)}catch(H){sn(r,o,H)}break;case 1:var u=r.stateNode;if(typeof u.componentDidMount=="function"){var p=r.return;try{u.componentDidMount()}catch(H){sn(r,p,H)}}var x=r.return;try{Rd(r)}catch(H){sn(r,x,H)}break;case 5:var C=r.return;try{Rd(r)}catch(H){sn(r,C,H)}}}catch(H){sn(r,r.return,H)}if(r===n){Ve=null;break}var k=r.sibling;if(k!==null){k.return=r.return,Ve=k;break}Ve=r.return}}var Tv=Math.ceil,Jl=T.ReactCurrentDispatcher,Ld=T.ReactCurrentOwner,xi=T.ReactCurrentBatchConfig,Tt=0,En=null,un=null,Rn=0,ai=0,xa=zr(0),gn=0,Io=null,Ts=0,ec=0,Dd=0,Uo=null,Zn=null,Id=0,va=1/0,xr=null,tc=!1,Ud=null,Xr=null,nc=!1,qr=null,ic=0,Fo=0,Fd=null,rc=-1,sc=0;function Gn(){return(Tt&6)!==0?Kt():rc!==-1?rc:rc=Kt()}function Yr(n){return(n.mode&1)===0?1:(Tt&2)!==0&&Rn!==0?Rn&-Rn:cv.transition!==null?(sc===0&&(sc=pn()),sc):(n=gt,n!==0||(n=window.event,n=n===void 0?16:op(n.type)),n)}function Di(n,r,o,u){if(50<Fo)throw Fo=0,Fd=null,Error(t(185));on(n,o,u),((Tt&2)===0||n!==En)&&(n===En&&((Tt&2)===0&&(ec|=o),gn===4&&$r(n,Rn)),Qn(n,u),o===1&&Tt===0&&(r.mode&1)===0&&(va=Kt()+500,Dl&&Vr()))}function Qn(n,r){var o=n.callbackNode;Vt(n,r);var u=Mt(n,n===En?Rn:0);if(u===0)o!==null&&io(o),n.callbackNode=null,n.callbackPriority=0;else if(r=u&-u,n.callbackPriority!==r){if(o!=null&&io(o),r===1)n.tag===0?lv(o0.bind(null,n)):Xp(o0.bind(null,n)),rv(function(){(Tt&6)===0&&Vr()}),o=null;else{switch(wi(u)){case 1:o=ro;break;case 4:o=so;break;case 16:o=P;break;case 536870912:o=ce;break;default:o=P}o=m0(o,a0.bind(null,n))}n.callbackPriority=r,n.callbackNode=o}}function a0(n,r){if(rc=-1,sc=0,(Tt&6)!==0)throw Error(t(327));var o=n.callbackNode;if(ya()&&n.callbackNode!==o)return null;var u=Mt(n,n===En?Rn:0);if(u===0)return null;if((u&30)!==0||(u&n.expiredLanes)!==0||r)r=ac(n,u);else{r=u;var p=Tt;Tt|=2;var x=c0();(En!==n||Rn!==r)&&(xr=null,va=Kt()+500,Cs(n,r));do try{Rv();break}catch(k){l0(n,k)}while(!0);ed(),Jl.current=x,Tt=p,un!==null?r=0:(En=null,Rn=0,r=gn)}if(r!==0){if(r===2&&(p=Lt(n),p!==0&&(u=p,r=Od(n,p))),r===1)throw o=Io,Cs(n,0),$r(n,u),Qn(n,Kt()),o;if(r===6)$r(n,u);else{if(p=n.current.alternate,(u&30)===0&&!Av(p)&&(r=ac(n,u),r===2&&(x=Lt(n),x!==0&&(u=x,r=Od(n,x))),r===1))throw o=Io,Cs(n,0),$r(n,u),Qn(n,Kt()),o;switch(n.finishedWork=p,n.finishedLanes=u,r){case 0:case 1:throw Error(t(345));case 2:Rs(n,Zn,xr);break;case 3:if($r(n,u),(u&130023424)===u&&(r=Id+500-Kt(),10<r)){if(Mt(n,0)!==0)break;if(p=n.suspendedLanes,(p&u)!==u){Gn(),n.pingedLanes|=n.suspendedLanes&p;break}n.timeoutHandle=Gu(Rs.bind(null,n,Zn,xr),r);break}Rs(n,Zn,xr);break;case 4:if($r(n,u),(u&4194240)===u)break;for(r=n.eventTimes,p=-1;0<u;){var C=31-Le(u);x=1<<C,C=r[C],C>p&&(p=C),u&=~x}if(u=p,u=Kt()-u,u=(120>u?120:480>u?480:1080>u?1080:1920>u?1920:3e3>u?3e3:4320>u?4320:1960*Tv(u/1960))-u,10<u){n.timeoutHandle=Gu(Rs.bind(null,n,Zn,xr),u);break}Rs(n,Zn,xr);break;case 5:Rs(n,Zn,xr);break;default:throw Error(t(329))}}}return Qn(n,Kt()),n.callbackNode===o?a0.bind(null,n):null}function Od(n,r){var o=Uo;return n.current.memoizedState.isDehydrated&&(Cs(n,r).flags|=256),n=ac(n,r),n!==2&&(r=Zn,Zn=o,r!==null&&kd(r)),n}function kd(n){Zn===null?Zn=n:Zn.push.apply(Zn,n)}function Av(n){for(var r=n;;){if(r.flags&16384){var o=r.updateQueue;if(o!==null&&(o=o.stores,o!==null))for(var u=0;u<o.length;u++){var p=o[u],x=p.getSnapshot;p=p.value;try{if(!Ci(x(),p))return!1}catch{return!1}}}if(o=r.child,r.subtreeFlags&16384&&o!==null)o.return=r,r=o;else{if(r===n)break;for(;r.sibling===null;){if(r.return===null||r.return===n)return!0;r=r.return}r.sibling.return=r.return,r=r.sibling}}return!0}function $r(n,r){for(r&=~Dd,r&=~ec,n.suspendedLanes|=r,n.pingedLanes&=~r,n=n.expirationTimes;0<r;){var o=31-Le(r),u=1<<o;n[o]=-1,r&=~u}}function o0(n){if((Tt&6)!==0)throw Error(t(327));ya();var r=Mt(n,0);if((r&1)===0)return Qn(n,Kt()),null;var o=ac(n,r);if(n.tag!==0&&o===2){var u=Lt(n);u!==0&&(r=u,o=Od(n,u))}if(o===1)throw o=Io,Cs(n,0),$r(n,r),Qn(n,Kt()),o;if(o===6)throw Error(t(345));return n.finishedWork=n.current.alternate,n.finishedLanes=r,Rs(n,Zn,xr),Qn(n,Kt()),null}function Bd(n,r){var o=Tt;Tt|=1;try{return n(r)}finally{Tt=o,Tt===0&&(va=Kt()+500,Dl&&Vr())}}function As(n){qr!==null&&qr.tag===0&&(Tt&6)===0&&ya();var r=Tt;Tt|=1;var o=xi.transition,u=gt;try{if(xi.transition=null,gt=1,n)return n()}finally{gt=u,xi.transition=o,Tt=r,(Tt&6)===0&&Vr()}}function zd(){ai=xa.current,jt(xa)}function Cs(n,r){n.finishedWork=null,n.finishedLanes=0;var o=n.timeoutHandle;if(o!==-1&&(n.timeoutHandle=-1,iv(o)),un!==null)for(o=un.return;o!==null;){var u=o;switch($u(u),u.tag){case 1:u=u.type.childContextTypes,u!=null&&Nl();break;case 3:ma(),jt(Yn),jt(Ln),ld();break;case 5:ad(u);break;case 4:ma();break;case 13:jt(Zt);break;case 19:jt(Zt);break;case 10:td(u.type._context);break;case 22:case 23:zd()}o=o.return}if(En=n,un=n=Kr(n.current,null),Rn=ai=r,gn=0,Io=null,Dd=ec=Ts=0,Zn=Uo=null,Es!==null){for(r=0;r<Es.length;r++)if(o=Es[r],u=o.interleaved,u!==null){o.interleaved=null;var p=u.next,x=o.pending;if(x!==null){var C=x.next;x.next=p,u.next=C}o.pending=u}Es=null}return n}function l0(n,r){do{var o=un;try{if(ed(),Gl.current=ql,Wl){for(var u=Qt.memoizedState;u!==null;){var p=u.queue;p!==null&&(p.pending=null),u=u.next}Wl=!1}if(bs=0,Mn=mn=Qt=null,Co=!1,Ro=0,Ld.current=null,o===null||o.return===null){gn=1,Io=r,un=null;break}e:{var x=n,C=o.return,k=o,H=r;if(r=Rn,k.flags|=32768,H!==null&&typeof H=="object"&&typeof H.then=="function"){var ue=H,ye=k,Me=ye.tag;if((ye.mode&1)===0&&(Me===0||Me===11||Me===15)){var ve=ye.alternate;ve?(ye.updateQueue=ve.updateQueue,ye.memoizedState=ve.memoizedState,ye.lanes=ve.lanes):(ye.updateQueue=null,ye.memoizedState=null)}var Be=Dm(C);if(Be!==null){Be.flags&=-257,Im(Be,C,k,x,r),Be.mode&1&&Lm(x,ue,r),r=Be,H=ue;var Xe=r.updateQueue;if(Xe===null){var Ye=new Set;Ye.add(H),r.updateQueue=Ye}else Xe.add(H);break e}else{if((r&1)===0){Lm(x,ue,r),Hd();break e}H=Error(t(426))}}else if($t&&k.mode&1){var ln=Dm(C);if(ln!==null){(ln.flags&65536)===0&&(ln.flags|=256),Im(ln,C,k,x,r),Qu(ga(H,k));break e}}x=H=ga(H,k),gn!==4&&(gn=2),Uo===null?Uo=[x]:Uo.push(x),x=C;do{switch(x.tag){case 3:x.flags|=65536,r&=-r,x.lanes|=r;var ie=Pm(x,H,r);im(x,ie);break e;case 1:k=H;var q=x.type,se=x.stateNode;if((x.flags&128)===0&&(typeof q.getDerivedStateFromError=="function"||se!==null&&typeof se.componentDidCatch=="function"&&(Xr===null||!Xr.has(se)))){x.flags|=65536,r&=-r,x.lanes|=r;var be=Nm(x,k,r);im(x,be);break e}}x=x.return}while(x!==null)}d0(o)}catch(Je){r=Je,un===o&&o!==null&&(un=o=o.return);continue}break}while(!0)}function c0(){var n=Jl.current;return Jl.current=ql,n===null?ql:n}function Hd(){(gn===0||gn===3||gn===2)&&(gn=4),En===null||(Ts&268435455)===0&&(ec&268435455)===0||$r(En,Rn)}function ac(n,r){var o=Tt;Tt|=2;var u=c0();(En!==n||Rn!==r)&&(xr=null,Cs(n,r));do try{Cv();break}catch(p){l0(n,p)}while(!0);if(ed(),Tt=o,Jl.current=u,un!==null)throw Error(t(261));return En=null,Rn=0,gn}function Cv(){for(;un!==null;)u0(un)}function Rv(){for(;un!==null&&!ml();)u0(un)}function u0(n){var r=p0(n.alternate,n,ai);n.memoizedProps=n.pendingProps,r===null?d0(n):un=r,Ld.current=null}function d0(n){var r=n;do{var o=r.alternate;if(n=r.return,(r.flags&32768)===0){if(o=Sv(o,r,ai),o!==null){un=o;return}}else{if(o=Mv(o,r),o!==null){o.flags&=32767,un=o;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{gn=6,un=null;return}}if(r=r.sibling,r!==null){un=r;return}un=r=n}while(r!==null);gn===0&&(gn=5)}function Rs(n,r,o){var u=gt,p=xi.transition;try{xi.transition=null,gt=1,Pv(n,r,o,u)}finally{xi.transition=p,gt=u}return null}function Pv(n,r,o,u){do ya();while(qr!==null);if((Tt&6)!==0)throw Error(t(327));o=n.finishedWork;var p=n.finishedLanes;if(o===null)return null;if(n.finishedWork=null,n.finishedLanes=0,o===n.current)throw Error(t(177));n.callbackNode=null,n.callbackPriority=0;var x=o.lanes|o.childLanes;if(Et(n,x),n===En&&(un=En=null,Rn=0),(o.subtreeFlags&2064)===0&&(o.flags&2064)===0||nc||(nc=!0,m0(P,function(){return ya(),null})),x=(o.flags&15990)!==0,(o.subtreeFlags&15990)!==0||x){x=xi.transition,xi.transition=null;var C=gt;gt=1;var k=Tt;Tt|=4,Ld.current=null,wv(n,o),t0(o,n),Kx(Hu),_l=!!zu,Hu=zu=null,n.current=o,bv(o),vu(),Tt=k,gt=C,xi.transition=x}else n.current=o;if(nc&&(nc=!1,qr=n,ic=p),x=n.pendingLanes,x===0&&(Xr=null),Ie(o.stateNode),Qn(n,Kt()),r!==null)for(u=n.onRecoverableError,o=0;o<r.length;o++)p=r[o],u(p.value,{componentStack:p.stack,digest:p.digest});if(tc)throw tc=!1,n=Ud,Ud=null,n;return(ic&1)!==0&&n.tag!==0&&ya(),x=n.pendingLanes,(x&1)!==0?n===Fd?Fo++:(Fo=0,Fd=n):Fo=0,Vr(),null}function ya(){if(qr!==null){var n=wi(ic),r=xi.transition,o=gt;try{if(xi.transition=null,gt=16>n?16:n,qr===null)var u=!1;else{if(n=qr,qr=null,ic=0,(Tt&6)!==0)throw Error(t(331));var p=Tt;for(Tt|=4,Ve=n.current;Ve!==null;){var x=Ve,C=x.child;if((Ve.flags&16)!==0){var k=x.deletions;if(k!==null){for(var H=0;H<k.length;H++){var ue=k[H];for(Ve=ue;Ve!==null;){var ye=Ve;switch(ye.tag){case 0:case 11:case 15:Do(8,ye,x)}var Me=ye.child;if(Me!==null)Me.return=ye,Ve=Me;else for(;Ve!==null;){ye=Ve;var ve=ye.sibling,Be=ye.return;if(Km(ye),ye===ue){Ve=null;break}if(ve!==null){ve.return=Be,Ve=ve;break}Ve=Be}}}var Xe=x.alternate;if(Xe!==null){var Ye=Xe.child;if(Ye!==null){Xe.child=null;do{var ln=Ye.sibling;Ye.sibling=null,Ye=ln}while(Ye!==null)}}Ve=x}}if((x.subtreeFlags&2064)!==0&&C!==null)C.return=x,Ve=C;else e:for(;Ve!==null;){if(x=Ve,(x.flags&2048)!==0)switch(x.tag){case 0:case 11:case 15:Do(9,x,x.return)}var ie=x.sibling;if(ie!==null){ie.return=x.return,Ve=ie;break e}Ve=x.return}}var q=n.current;for(Ve=q;Ve!==null;){C=Ve;var se=C.child;if((C.subtreeFlags&2064)!==0&&se!==null)se.return=C,Ve=se;else e:for(C=q;Ve!==null;){if(k=Ve,(k.flags&2048)!==0)try{switch(k.tag){case 0:case 11:case 15:Ql(9,k)}}catch(Je){sn(k,k.return,Je)}if(k===C){Ve=null;break e}var be=k.sibling;if(be!==null){be.return=k.return,Ve=be;break e}Ve=k.return}}if(Tt=p,Vr(),ee&&typeof ee.onPostCommitFiberRoot=="function")try{ee.onPostCommitFiberRoot(ne,n)}catch{}u=!0}return u}finally{gt=o,xi.transition=r}}return!1}function h0(n,r,o){r=ga(o,r),r=Pm(n,r,1),n=Wr(n,r,1),r=Gn(),n!==null&&(on(n,1,r),Qn(n,r))}function sn(n,r,o){if(n.tag===3)h0(n,n,o);else for(;r!==null;){if(r.tag===3){h0(r,n,o);break}else if(r.tag===1){var u=r.stateNode;if(typeof r.type.getDerivedStateFromError=="function"||typeof u.componentDidCatch=="function"&&(Xr===null||!Xr.has(u))){n=ga(o,n),n=Nm(r,n,1),r=Wr(r,n,1),n=Gn(),r!==null&&(on(r,1,n),Qn(r,n));break}}r=r.return}}function Nv(n,r,o){var u=n.pingCache;u!==null&&u.delete(r),r=Gn(),n.pingedLanes|=n.suspendedLanes&o,En===n&&(Rn&o)===o&&(gn===4||gn===3&&(Rn&130023424)===Rn&&500>Kt()-Id?Cs(n,0):Dd|=o),Qn(n,r)}function f0(n,r){r===0&&((n.mode&1)===0?r=1:(r=ht,ht<<=1,(ht&130023424)===0&&(ht=4194304)));var o=Gn();n=mr(n,r),n!==null&&(on(n,r,o),Qn(n,o))}function Lv(n){var r=n.memoizedState,o=0;r!==null&&(o=r.retryLane),f0(n,o)}function Dv(n,r){var o=0;switch(n.tag){case 13:var u=n.stateNode,p=n.memoizedState;p!==null&&(o=p.retryLane);break;case 19:u=n.stateNode;break;default:throw Error(t(314))}u!==null&&u.delete(r),f0(n,o)}var p0;p0=function(n,r,o){if(n!==null)if(n.memoizedProps!==r.pendingProps||Yn.current)Kn=!0;else{if((n.lanes&o)===0&&(r.flags&128)===0)return Kn=!1,yv(n,r,o);Kn=(n.flags&131072)!==0}else Kn=!1,$t&&(r.flags&1048576)!==0&&qp(r,Ul,r.index);switch(r.lanes=0,r.tag){case 2:var u=r.type;Kl(n,r),n=r.pendingProps;var p=la(r,Ln.current);pa(r,o),p=dd(null,r,u,n,p,o);var x=hd();return r.flags|=1,typeof p=="object"&&p!==null&&typeof p.render=="function"&&p.$$typeof===void 0?(r.tag=1,r.memoizedState=null,r.updateQueue=null,$n(u)?(x=!0,Ll(r)):x=!1,r.memoizedState=p.state!==null&&p.state!==void 0?p.state:null,rd(r),p.updater=Yl,r.stateNode=p,p._reactInternals=r,xd(r,u,n,o),r=Md(null,r,u,!0,x,o)):(r.tag=0,$t&&x&&Yu(r),Vn(null,r,p,o),r=r.child),r;case 16:u=r.elementType;e:{switch(Kl(n,r),n=r.pendingProps,p=u._init,u=p(u._payload),r.type=u,p=r.tag=Uv(u),n=Pi(u,n),p){case 0:r=Sd(null,r,u,n,o);break e;case 1:r=zm(null,r,u,n,o);break e;case 11:r=Um(null,r,u,n,o);break e;case 14:r=Fm(null,r,u,Pi(u.type,n),o);break e}throw Error(t(306,u,""))}return r;case 0:return u=r.type,p=r.pendingProps,p=r.elementType===u?p:Pi(u,p),Sd(n,r,u,p,o);case 1:return u=r.type,p=r.pendingProps,p=r.elementType===u?p:Pi(u,p),zm(n,r,u,p,o);case 3:e:{if(Hm(r),n===null)throw Error(t(387));u=r.pendingProps,x=r.memoizedState,p=x.element,nm(n,r),Hl(r,u,null,o);var C=r.memoizedState;if(u=C.element,x.isDehydrated)if(x={element:u,isDehydrated:!1,cache:C.cache,pendingSuspenseBoundaries:C.pendingSuspenseBoundaries,transitions:C.transitions},r.updateQueue.baseState=x,r.memoizedState=x,r.flags&256){p=ga(Error(t(423)),r),r=Vm(n,r,u,o,p);break e}else if(u!==p){p=ga(Error(t(424)),r),r=Vm(n,r,u,o,p);break e}else for(si=Br(r.stateNode.containerInfo.firstChild),ri=r,$t=!0,Ri=null,o=em(r,null,u,o),r.child=o;o;)o.flags=o.flags&-3|4096,o=o.sibling;else{if(da(),u===p){r=_r(n,r,o);break e}Vn(n,r,u,o)}r=r.child}return r;case 5:return sm(r),n===null&&Zu(r),u=r.type,p=r.pendingProps,x=n!==null?n.memoizedProps:null,C=p.children,Vu(u,p)?C=null:x!==null&&Vu(u,x)&&(r.flags|=32),Bm(n,r),Vn(n,r,C,o),r.child;case 6:return n===null&&Zu(r),null;case 13:return Gm(n,r,o);case 4:return sd(r,r.stateNode.containerInfo),u=r.pendingProps,n===null?r.child=ha(r,null,u,o):Vn(n,r,u,o),r.child;case 11:return u=r.type,p=r.pendingProps,p=r.elementType===u?p:Pi(u,p),Um(n,r,u,p,o);case 7:return Vn(n,r,r.pendingProps,o),r.child;case 8:return Vn(n,r,r.pendingProps.children,o),r.child;case 12:return Vn(n,r,r.pendingProps.children,o),r.child;case 10:e:{if(u=r.type._context,p=r.pendingProps,x=r.memoizedProps,C=p.value,Gt(kl,u._currentValue),u._currentValue=C,x!==null)if(Ci(x.value,C)){if(x.children===p.children&&!Yn.current){r=_r(n,r,o);break e}}else for(x=r.child,x!==null&&(x.return=r);x!==null;){var k=x.dependencies;if(k!==null){C=x.child;for(var H=k.firstContext;H!==null;){if(H.context===u){if(x.tag===1){H=gr(-1,o&-o),H.tag=2;var ue=x.updateQueue;if(ue!==null){ue=ue.shared;var ye=ue.pending;ye===null?H.next=H:(H.next=ye.next,ye.next=H),ue.pending=H}}x.lanes|=o,H=x.alternate,H!==null&&(H.lanes|=o),nd(x.return,o,r),k.lanes|=o;break}H=H.next}}else if(x.tag===10)C=x.type===r.type?null:x.child;else if(x.tag===18){if(C=x.return,C===null)throw Error(t(341));C.lanes|=o,k=C.alternate,k!==null&&(k.lanes|=o),nd(C,o,r),C=x.sibling}else C=x.child;if(C!==null)C.return=x;else for(C=x;C!==null;){if(C===r){C=null;break}if(x=C.sibling,x!==null){x.return=C.return,C=x;break}C=C.return}x=C}Vn(n,r,p.children,o),r=r.child}return r;case 9:return p=r.type,u=r.pendingProps.children,pa(r,o),p=gi(p),u=u(p),r.flags|=1,Vn(n,r,u,o),r.child;case 14:return u=r.type,p=Pi(u,r.pendingProps),p=Pi(u.type,p),Fm(n,r,u,p,o);case 15:return Om(n,r,r.type,r.pendingProps,o);case 17:return u=r.type,p=r.pendingProps,p=r.elementType===u?p:Pi(u,p),Kl(n,r),r.tag=1,$n(u)?(n=!0,Ll(r)):n=!1,pa(r,o),Cm(r,u,p),xd(r,u,p,o),Md(null,r,u,!0,n,o);case 19:return jm(n,r,o);case 22:return km(n,r,o)}throw Error(t(156,r.tag))};function m0(n,r){return xs(n,r)}function Iv(n,r,o,u){this.tag=n,this.key=o,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=r,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=u,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function vi(n,r,o,u){return new Iv(n,r,o,u)}function Vd(n){return n=n.prototype,!(!n||!n.isReactComponent)}function Uv(n){if(typeof n=="function")return Vd(n)?1:0;if(n!=null){if(n=n.$$typeof,n===j)return 11;if(n===Q)return 14}return 2}function Kr(n,r){var o=n.alternate;return o===null?(o=vi(n.tag,r,n.key,n.mode),o.elementType=n.elementType,o.type=n.type,o.stateNode=n.stateNode,o.alternate=n,n.alternate=o):(o.pendingProps=r,o.type=n.type,o.flags=0,o.subtreeFlags=0,o.deletions=null),o.flags=n.flags&14680064,o.childLanes=n.childLanes,o.lanes=n.lanes,o.child=n.child,o.memoizedProps=n.memoizedProps,o.memoizedState=n.memoizedState,o.updateQueue=n.updateQueue,r=n.dependencies,o.dependencies=r===null?null:{lanes:r.lanes,firstContext:r.firstContext},o.sibling=n.sibling,o.index=n.index,o.ref=n.ref,o}function oc(n,r,o,u,p,x){var C=2;if(u=n,typeof n=="function")Vd(n)&&(C=1);else if(typeof n=="string")C=5;else e:switch(n){case U:return Ps(o.children,p,x,r);case w:C=8,p|=8;break;case D:return n=vi(12,o,r,p|2),n.elementType=D,n.lanes=x,n;case te:return n=vi(13,o,r,p),n.elementType=te,n.lanes=x,n;case V:return n=vi(19,o,r,p),n.elementType=V,n.lanes=x,n;case re:return lc(o,p,x,r);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case B:C=10;break e;case z:C=9;break e;case j:C=11;break e;case Q:C=14;break e;case he:C=16,u=null;break e}throw Error(t(130,n==null?n:typeof n,""))}return r=vi(C,o,r,p),r.elementType=n,r.type=u,r.lanes=x,r}function Ps(n,r,o,u){return n=vi(7,n,u,r),n.lanes=o,n}function lc(n,r,o,u){return n=vi(22,n,u,r),n.elementType=re,n.lanes=o,n.stateNode={isHidden:!1},n}function Gd(n,r,o){return n=vi(6,n,null,r),n.lanes=o,n}function Wd(n,r,o){return r=vi(4,n.children!==null?n.children:[],n.key,r),r.lanes=o,r.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},r}function Fv(n,r,o,u,p){this.tag=r,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=ke(0),this.expirationTimes=ke(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=ke(0),this.identifierPrefix=u,this.onRecoverableError=p,this.mutableSourceEagerHydrationData=null}function jd(n,r,o,u,p,x,C,k,H){return n=new Fv(n,r,o,k,H),r===1?(r=1,x===!0&&(r|=8)):r=0,x=vi(3,null,null,r),n.current=x,x.stateNode=n,x.memoizedState={element:u,isDehydrated:o,cache:null,transitions:null,pendingSuspenseBoundaries:null},rd(x),n}function Ov(n,r,o){var u=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:L,key:u==null?null:""+u,children:n,containerInfo:r,implementation:o}}function g0(n){if(!n)return Hr;n=n._reactInternals;e:{if(Hn(n)!==n||n.tag!==1)throw Error(t(170));var r=n;do{switch(r.tag){case 3:r=r.stateNode.context;break e;case 1:if($n(r.type)){r=r.stateNode.__reactInternalMemoizedMergedChildContext;break e}}r=r.return}while(r!==null);throw Error(t(171))}if(n.tag===1){var o=n.type;if($n(o))return Wp(n,o,r)}return r}function _0(n,r,o,u,p,x,C,k,H){return n=jd(o,u,!0,n,p,x,C,k,H),n.context=g0(null),o=n.current,u=Gn(),p=Yr(o),x=gr(u,p),x.callback=r??null,Wr(o,x,p),n.current.lanes=p,on(n,p,u),Qn(n,u),n}function cc(n,r,o,u){var p=r.current,x=Gn(),C=Yr(p);return o=g0(o),r.context===null?r.context=o:r.pendingContext=o,r=gr(x,C),r.payload={element:n},u=u===void 0?null:u,u!==null&&(r.callback=u),n=Wr(p,r,C),n!==null&&(Di(n,p,C,x),zl(n,p,C)),C}function uc(n){if(n=n.current,!n.child)return null;switch(n.child.tag){case 5:return n.child.stateNode;default:return n.child.stateNode}}function x0(n,r){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var o=n.retryLane;n.retryLane=o!==0&&o<r?o:r}}function Xd(n,r){x0(n,r),(n=n.alternate)&&x0(n,r)}function kv(){return null}var v0=typeof reportError=="function"?reportError:function(n){console.error(n)};function qd(n){this._internalRoot=n}dc.prototype.render=qd.prototype.render=function(n){var r=this._internalRoot;if(r===null)throw Error(t(409));cc(n,r,null,null)},dc.prototype.unmount=qd.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var r=n.containerInfo;As(function(){cc(null,n,null,null)}),r[dr]=null}};function dc(n){this._internalRoot=n}dc.prototype.unstable_scheduleHydration=function(n){if(n){var r=bi();n={blockedOn:null,target:n,priority:r};for(var o=0;o<Fr.length&&r!==0&&r<Fr[o].priority;o++);Fr.splice(o,0,n),o===0&&sp(n)}};function Yd(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function hc(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function y0(){}function Bv(n,r,o,u,p){if(p){if(typeof u=="function"){var x=u;u=function(){var ue=uc(C);x.call(ue)}}var C=_0(r,u,n,0,null,!1,!1,"",y0);return n._reactRootContainer=C,n[dr]=C.current,yo(n.nodeType===8?n.parentNode:n),As(),C}for(;p=n.lastChild;)n.removeChild(p);if(typeof u=="function"){var k=u;u=function(){var ue=uc(H);k.call(ue)}}var H=jd(n,0,!1,null,null,!1,!1,"",y0);return n._reactRootContainer=H,n[dr]=H.current,yo(n.nodeType===8?n.parentNode:n),As(function(){cc(r,H,o,u)}),H}function fc(n,r,o,u,p){var x=o._reactRootContainer;if(x){var C=x;if(typeof p=="function"){var k=p;p=function(){var H=uc(C);k.call(H)}}cc(r,C,n,p)}else C=Bv(o,r,n,p,u);return uc(C)}ur=function(n){switch(n.tag){case 3:var r=n.stateNode;if(r.current.memoizedState.isDehydrated){var o=ze(r.pendingLanes);o!==0&&(Nn(r,o|1),Qn(r,Kt()),(Tt&6)===0&&(va=Kt()+500,Vr()))}break;case 13:As(function(){var u=mr(n,1);if(u!==null){var p=Gn();Di(u,n,1,p)}}),Xd(n,1)}},Rt=function(n){if(n.tag===13){var r=mr(n,134217728);if(r!==null){var o=Gn();Di(r,n,134217728,o)}Xd(n,134217728)}},Yt=function(n){if(n.tag===13){var r=Yr(n),o=mr(n,r);if(o!==null){var u=Gn();Di(o,n,r,u)}Xd(n,r)}},bi=function(){return gt},Ut=function(n,r){var o=gt;try{return gt=n,r()}finally{gt=o}},tt=function(n,r,o){switch(r){case"input":if(mt(n,o),r=o.name,o.type==="radio"&&r!=null){for(o=n;o.parentNode;)o=o.parentNode;for(o=o.querySelectorAll("input[name="+JSON.stringify(""+r)+'][type="radio"]'),r=0;r<o.length;r++){var u=o[r];if(u!==n&&u.form===n.form){var p=Pl(u);if(!p)throw Error(t(90));ft(u),mt(u,p)}}}break;case"textarea":fn(n,o);break;case"select":r=o.value,r!=null&&Dt(n,!!o.multiple,r,!1)}},Fe=Bd,xe=As;var zv={usingClientEntryPoint:!1,Events:[Eo,aa,Pl,ge,Re,Bd]},Oo={findFiberByHostInstance:vs,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Hv={bundleType:Oo.bundleType,version:Oo.version,rendererPackageName:Oo.rendererPackageName,rendererConfig:Oo.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:T.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=_s(n),n===null?null:n.stateNode},findFiberByHostInstance:Oo.findFiberByHostInstance||kv,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var pc=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!pc.isDisabled&&pc.supportsFiber)try{ne=pc.inject(Hv),ee=pc}catch{}}return Jn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=zv,Jn.createPortal=function(n,r){var o=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Yd(r))throw Error(t(200));return Ov(n,r,null,o)},Jn.createRoot=function(n,r){if(!Yd(n))throw Error(t(299));var o=!1,u="",p=v0;return r!=null&&(r.unstable_strictMode===!0&&(o=!0),r.identifierPrefix!==void 0&&(u=r.identifierPrefix),r.onRecoverableError!==void 0&&(p=r.onRecoverableError)),r=jd(n,1,!1,null,null,o,!1,u,p),n[dr]=r.current,yo(n.nodeType===8?n.parentNode:n),new qd(r)},Jn.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var r=n._reactInternals;if(r===void 0)throw typeof n.render=="function"?Error(t(188)):(n=Object.keys(n).join(","),Error(t(268,n)));return n=_s(r),n=n===null?null:n.stateNode,n},Jn.flushSync=function(n){return As(n)},Jn.hydrate=function(n,r,o){if(!hc(r))throw Error(t(200));return fc(null,n,r,!0,o)},Jn.hydrateRoot=function(n,r,o){if(!Yd(n))throw Error(t(405));var u=o!=null&&o.hydratedSources||null,p=!1,x="",C=v0;if(o!=null&&(o.unstable_strictMode===!0&&(p=!0),o.identifierPrefix!==void 0&&(x=o.identifierPrefix),o.onRecoverableError!==void 0&&(C=o.onRecoverableError)),r=_0(r,null,n,1,o??null,p,!1,x,C),n[dr]=r.current,yo(n),u)for(n=0;n<u.length;n++)o=u[n],p=o._getVersion,p=p(o._source),r.mutableSourceEagerHydrationData==null?r.mutableSourceEagerHydrationData=[o,p]:r.mutableSourceEagerHydrationData.push(o,p);return new dc(r)},Jn.render=function(n,r,o){if(!hc(r))throw Error(t(200));return fc(null,n,r,!1,o)},Jn.unmountComponentAtNode=function(n){if(!hc(n))throw Error(t(40));return n._reactRootContainer?(As(function(){fc(null,null,n,!1,function(){n._reactRootContainer=null,n[dr]=null})}),!0):!1},Jn.unstable_batchedUpdates=Bd,Jn.unstable_renderSubtreeIntoContainer=function(n,r,o,u){if(!hc(o))throw Error(t(200));if(n==null||n._reactInternals===void 0)throw Error(t(38));return fc(n,r,o,!1,u)},Jn.version="18.3.1-next-f1338f8080-20240426",Jn}var R0;function m_(){if(R0)return Qd.exports;R0=1;function s(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s)}catch(e){console.error(e)}}return s(),Qd.exports=Kv(),Qd.exports}var P0;function Zv(){if(P0)return gc;P0=1;var s=m_();return gc.createRoot=s.createRoot,gc.hydrateRoot=s.hydrateRoot,gc}var Qv=Zv();const Jv=p_(Qv),ey=an.createContext(void 0),ty=({client:s,children:e})=>(an.useEffect(()=>(s.mount(),()=>{s.unmount()}),[s]),A.jsx(ey.Provider,{value:s,children:e})),ny={setTimeout:(s,e)=>setTimeout(s,e),clearTimeout:s=>clearTimeout(s),setInterval:(s,e)=>setInterval(s,e),clearInterval:s=>clearInterval(s)};var ss,Lf,s_,iy=(s_=class{constructor(){yt(this,ss,ny);yt(this,Lf,!1)}setTimeoutProvider(s){st(this,ss,s)}setTimeout(s,e){return me(this,ss).setTimeout(s,e)}clearTimeout(s){me(this,ss).clearTimeout(s)}setInterval(s,e){return me(this,ss).setInterval(s,e)}clearInterval(s){me(this,ss).clearInterval(s)}},ss=new WeakMap,Lf=new WeakMap,s_);const Bh=new iy;function ry(s){setTimeout(s,0)}const sy=typeof window>"u"||"Deno"in globalThis;function Ei(){}function ay(s,e){return typeof s=="function"?s(e):s}function oy(s){return typeof s=="number"&&s>=0&&s!==1/0}function ly(s,e){return Math.max(s+(e||0)-Date.now(),0)}function Jo(s,e){return typeof s=="function"?s(e):s}function N0(s,e){const{type:t="all",exact:i,fetchStatus:a,predicate:l,queryKey:c,stale:d}=s;if(c){if(i){if(e.queryHash!==If(c,e.options))return!1}else if(!Za(e.queryKey,c))return!1}if(t!=="all"){const h=e.isActive();if(t==="active"&&!h||t==="inactive"&&h)return!1}return!(typeof d=="boolean"&&e.isStale()!==d||a&&a!==e.state.fetchStatus||l&&!l(e))}function L0(s,e){const{exact:t,status:i,predicate:a,mutationKey:l}=s;if(l){if(!e.options.mutationKey)return!1;if(t){if(nl(e.options.mutationKey)!==nl(l))return!1}else if(!Za(e.options.mutationKey,l))return!1}return!(i&&e.state.status!==i||a&&!a(e))}function If(s,e){return((e==null?void 0:e.queryKeyHashFn)||nl)(s)}function nl(s){return JSON.stringify(s,(e,t)=>zh(t)?Object.keys(t).sort().reduce((i,a)=>(i[a]=t[a],i),{}):t)}function Za(s,e){if(s===e)return!0;if(typeof s!=typeof e)return!1;if(s&&e&&typeof s=="object"&&typeof e=="object"){if(Array.isArray(s)&&Array.isArray(e)){if(e.length>s.length)return!1;for(let i=0;i<e.length;i++)if(!Za(s[i],e[i]))return!1;return!0}const t=Object.keys(e);for(const i of t)if(!Za(s[i],e[i]))return!1;return!0}return!1}const cy=Object.prototype.hasOwnProperty;function g_(s,e,t=0){if(s===e)return s;if(t>500)return e;const i=D0(s)&&D0(e);if(!i&&!(zh(s)&&zh(e)))return e;const a=(i?s:Object.keys(s)).length,l=i?e:Object.keys(e),c=l.length,d=i?new Array(c):{};let h=0;for(let f=0;f<c;f++){const _=i?f:l[f],m=s[_],g=e[_];if(m===g){d[_]=m,(i?f<a:cy.call(s,_))&&h++;continue}if(m===null||g===null||typeof m!="object"||typeof g!="object"){d[_]=g;continue}const y=g_(m,g,t+1);d[_]=y,y===m&&h++}return a===c&&h===a?s:d}function D0(s){return Array.isArray(s)&&s.length===Object.keys(s).length}function zh(s){if(!I0(s))return!1;const e=Object.getPrototypeOf(s),t=e==null?void 0:e.constructor;if(t===void 0)return!0;if(typeof t!="function")return!1;const i=t.prototype;return!(!I0(i)||!i.hasOwnProperty("isPrototypeOf")||e!==Object.prototype)}function I0(s){return Object.prototype.toString.call(s)==="[object Object]"}function uy(s){return new Promise(e=>{Bh.setTimeout(e,s)})}function dy(s,e,t){return typeof t.structuralSharing=="function"?t.structuralSharing(s,e):t.structuralSharing!==!1?g_(s,e):e}function hy(s,e,t=0){const i=[...s,e];return t&&i.length>t?i.slice(1):i}function fy(s,e,t=0){const i=[e,...s];return t&&i.length>t?i.slice(0,-1):i}const Uf=Symbol();function __(s,e){return!s.queryFn&&(e!=null&&e.initialPromise)?()=>e.initialPromise:!s.queryFn||s.queryFn===Uf?()=>Promise.reject(new Error(`Missing queryFn: '${s.queryHash}'`)):s.queryFn}function py(s,e,t){let i=!1,a;return Object.defineProperty(s,"signal",{enumerable:!0,get:()=>(a??(a=e()),i||(i=!0,a.aborted?t():a.addEventListener("abort",t,{once:!0})),a)}),s}let my=()=>sy;const x_=()=>my();var hu=class{constructor(){this.listeners=new Set,this.subscribe=this.subscribe.bind(this)}subscribe(s){return this.listeners.add(s),this.onSubscribe(),()=>{this.listeners.delete(s),this.onUnsubscribe()}}hasListeners(){return this.listeners.size>0}onSubscribe(){}onUnsubscribe(){}},Bs,as,Va,a_,gy=(a_=class extends hu{constructor(){super();yt(this,Bs);yt(this,as);yt(this,Va);st(this,Va,e=>{if(typeof window<"u"&&window.addEventListener){const t=()=>e();return window.addEventListener("visibilitychange",t,!1),()=>{window.removeEventListener("visibilitychange",t)}}})}onSubscribe(){me(this,as)||this.setEventListener(me(this,Va))}onUnsubscribe(){var e;this.hasListeners()||((e=me(this,as))==null||e.call(this),st(this,as,void 0))}setEventListener(e){var t;st(this,Va,e),(t=me(this,as))==null||t.call(this),st(this,as,e(i=>{typeof i=="boolean"?this.setFocused(i):this.onFocus()}))}setFocused(e){me(this,Bs)!==e&&(st(this,Bs,e),this.onFocus())}onFocus(){const e=this.isFocused();this.listeners.forEach(t=>{t(e)})}isFocused(){var e;return typeof me(this,Bs)=="boolean"?me(this,Bs):((e=globalThis.document)==null?void 0:e.visibilityState)!=="hidden"}},Bs=new WeakMap,as=new WeakMap,Va=new WeakMap,a_);const v_=new gy,_y=ry;function xy(){let s=[],e=0,t=d=>{d()},i=d=>{d()},a=_y;const l=d=>{e?s.push(d):a(()=>{t(d)})},c=()=>{const d=s;s=[],d.length&&a(()=>{i(()=>{d.forEach(h=>{t(h)})})})};return{batch:d=>{let h;e++;try{h=d()}finally{e--,e||c()}return h},batchCalls:d=>(...h)=>{l(()=>{d(...h)})},schedule:l,setNotifyFunction:d=>{t=d},setBatchNotifyFunction:d=>{i=d},setScheduler:d=>{a=d}}}const jn=xy();var Ga,os,Wa,o_,vy=(o_=class extends hu{constructor(){super();yt(this,Ga,!0);yt(this,os);yt(this,Wa);st(this,Wa,e=>{if(typeof window<"u"&&window.addEventListener){const t=()=>e(!0),i=()=>e(!1);return window.addEventListener("online",t,!1),window.addEventListener("offline",i,!1),()=>{window.removeEventListener("online",t),window.removeEventListener("offline",i)}}})}onSubscribe(){me(this,os)||this.setEventListener(me(this,Wa))}onUnsubscribe(){var e;this.hasListeners()||((e=me(this,os))==null||e.call(this),st(this,os,void 0))}setEventListener(e){var t;st(this,Wa,e),(t=me(this,os))==null||t.call(this),st(this,os,e(this.setOnline.bind(this)))}setOnline(e){me(this,Ga)!==e&&(st(this,Ga,e),this.listeners.forEach(t=>{t(e)}))}isOnline(){return me(this,Ga)}},Ga=new WeakMap,os=new WeakMap,Wa=new WeakMap,o_);const eu=new vy;function yy(s){return Math.min(1e3*2**s,3e4)}function y_(s){return(s??"online")==="online"?eu.isOnline():!0}var Hh=class extends Error{constructor(s){super("CancelledError"),this.revert=s==null?void 0:s.revert,this.silent=s==null?void 0:s.silent}};function S_(s){let e=!1,t=0,i,a="pending",l,c;const d=new Promise((R,I)=>{l=R,c=I});d.catch(Ei);const h=()=>a!=="pending",f=R=>{var I;if(!h()){const T=new Hh(R);b(T),(I=s.onCancel)==null||I.call(s,T)}},_=()=>{e=!0},m=()=>{e=!1},g=()=>v_.isFocused()&&(s.networkMode==="always"||eu.isOnline())&&s.canRun(),y=()=>y_(s.networkMode)&&s.canRun(),M=R=>{h()||(i==null||i(),a="resolved",l(R))},b=R=>{h()||(i==null||i(),a="rejected",c(R))},S=()=>new Promise(R=>{var I;i=T=>{(h()||g())&&R(T)},(I=s.onPause)==null||I.call(s)}).then(()=>{var R;i=void 0,h()||(R=s.onContinue)==null||R.call(s)}),v=()=>{if(h())return;let R;const I=t===0?s.initialPromise:void 0;try{R=I??s.fn()}catch(T){R=Promise.reject(T)}Promise.resolve(R).then(M).catch(T=>{var D;if(h())return;const N=s.retry??(x_()?0:3),L=s.retryDelay??yy,U=typeof L=="function"?L(t,T):L,w=N===!0||typeof N=="number"&&t<N||typeof N=="function"&&N(t,T);if(e||!w){b(T);return}t++,(D=s.onFail)==null||D.call(s,t,T),uy(U).then(()=>g()?void 0:S()).then(()=>{e?b(T):v()})})};return{promise:d,status:()=>a,cancel:f,continue:()=>(i==null||i(),d),cancelRetry:_,continueRetry:m,canStart:y,start:()=>(y()?v():S().then(v),d)}}var zs,l_,M_=(l_=class{constructor(){yt(this,zs)}destroy(){this.clearGcTimeout()}scheduleGc(){this.clearGcTimeout(),oy(this.gcTime)&&st(this,zs,Bh.setTimeout(()=>{this.optionalRemove()},this.gcTime))}updateGcTime(s){this.gcTime=Math.max(this.gcTime||0,s??(x_()?1/0:3e5))}clearGcTimeout(){me(this,zs)!==void 0&&(Bh.clearTimeout(me(this,zs)),st(this,zs,void 0))}},zs=new WeakMap,l_);function Sy(s){return{onFetch:(e,t)=>{var _,m,g,y,M;const i=e.options,a=(g=(m=(_=e.fetchOptions)==null?void 0:_.meta)==null?void 0:m.fetchMore)==null?void 0:g.direction,l=((y=e.state.data)==null?void 0:y.pages)||[],c=((M=e.state.data)==null?void 0:M.pageParams)||[];let d={pages:[],pageParams:[]},h=0;const f=async()=>{let b=!1;const S=I=>{py(I,()=>e.signal,()=>b=!0)},v=__(e.options,e.fetchOptions),R=async(I,T,N)=>{if(b)return Promise.reject(e.signal.reason);if(T==null&&I.pages.length)return Promise.resolve(I);const U=(()=>{const z={client:e.client,queryKey:e.queryKey,pageParam:T,direction:N?"backward":"forward",meta:e.options.meta};return S(z),z})(),w=await v(U),{maxPages:D}=e.options,B=N?fy:hy;return{pages:B(I.pages,w,D),pageParams:B(I.pageParams,T,D)}};if(a&&l.length){const I=a==="backward",T=I?My:U0,N={pages:l,pageParams:c};d=await R(N,T(i,N),I)}else{const I=s??l.length;do{const T=h===0?c[0]??i.initialPageParam:U0(i,d);if(h>0&&T==null)break;d=await R(d,T),h++}while(h<I)}return d};e.options.persister?e.fetchFn=()=>{var b,S;return(S=(b=e.options).persister)==null?void 0:S.call(b,f,{client:e.client,queryKey:e.queryKey,meta:e.options.meta,signal:e.signal},t)}:e.fetchFn=f}}}function U0(s,{pages:e,pageParams:t}){const i=e.length-1;return e.length>0?s.getNextPageParam(e[i],e,t[i],t):void 0}function My(s,{pages:e,pageParams:t}){var i;return e.length>0?(i=s.getPreviousPageParam)==null?void 0:i.call(s,e[0],e,t[0],t):void 0}var ja,Hs,Xa,Mi,Vs,xn,ll,Gs,Oi,br,c_,Ey=(c_=class extends M_{constructor(e){super();yt(this,Oi);yt(this,ja);yt(this,Hs);yt(this,Xa);yt(this,Mi);yt(this,Vs);yt(this,xn);yt(this,ll);yt(this,Gs);st(this,Gs,!1),st(this,ll,e.defaultOptions),this.setOptions(e.options),this.observers=[],st(this,Vs,e.client),st(this,Mi,me(this,Vs).getQueryCache()),this.queryKey=e.queryKey,this.queryHash=e.queryHash,st(this,Hs,O0(this.options)),this.state=e.state??me(this,Hs),this.scheduleGc()}get meta(){return this.options.meta}get queryType(){return me(this,ja)}get promise(){var e;return(e=me(this,xn))==null?void 0:e.promise}setOptions(e){if(this.options={...me(this,ll),...e},e!=null&&e._type&&st(this,ja,e._type),this.updateGcTime(this.options.gcTime),this.state&&this.state.data===void 0){const t=O0(this.options);t.data!==void 0&&(this.setState(F0(t.data,t.dataUpdatedAt)),st(this,Hs,t))}}optionalRemove(){!this.observers.length&&this.state.fetchStatus==="idle"&&me(this,Mi).remove(this)}setData(e,t){const i=dy(this.state.data,e,this.options);return Fn(this,Oi,br).call(this,{data:i,type:"success",dataUpdatedAt:t==null?void 0:t.updatedAt,manual:t==null?void 0:t.manual}),i}setState(e){Fn(this,Oi,br).call(this,{type:"setState",state:e})}cancel(e){var i,a;const t=(i=me(this,xn))==null?void 0:i.promise;return(a=me(this,xn))==null||a.cancel(e),t?t.then(Ei).catch(Ei):Promise.resolve()}destroy(){super.destroy(),this.cancel({silent:!0})}get resetState(){return me(this,Hs)}reset(){this.destroy(),this.setState(this.resetState)}isActive(){return this.observers.some(e=>Jo(e.options.enabled,this)!==!1)}isDisabled(){return this.getObserversCount()>0?!this.isActive():this.options.queryFn===Uf||!this.isFetched()}isFetched(){return this.state.dataUpdateCount+this.state.errorUpdateCount>0}isStatic(){return this.getObserversCount()>0?this.observers.some(e=>Jo(e.options.staleTime,this)==="static"):!1}isStale(){return this.getObserversCount()>0?this.observers.some(e=>e.getCurrentResult().isStale):this.state.data===void 0||this.state.isInvalidated}isStaleByTime(e=0){return this.state.data===void 0?!0:e==="static"?!1:this.state.isInvalidated?!0:!ly(this.state.dataUpdatedAt,e)}onFocus(){var e,t;(e=this.observers.find(i=>i.shouldFetchOnWindowFocus()))==null||e.refetch({cancelRefetch:!1}),(t=me(this,xn))==null||t.continue()}onOnline(){var e,t;(e=this.observers.find(i=>i.shouldFetchOnReconnect()))==null||e.refetch({cancelRefetch:!1}),(t=me(this,xn))==null||t.continue()}addObserver(e){this.observers.includes(e)||(this.observers.push(e),this.clearGcTimeout(),me(this,Mi).notify({type:"observerAdded",query:this,observer:e}))}removeObserver(e){const t=this.observers.indexOf(e);t!==-1&&(this.observers.splice(t,1),this.observers.length||(me(this,xn)&&(me(this,Gs)||this.state.fetchStatus==="paused"&&this.state.status==="pending"?me(this,xn).cancel({revert:!0}):me(this,xn).cancelRetry()),this.scheduleGc()),me(this,Mi).notify({type:"observerRemoved",query:this,observer:e}))}getObserversCount(){return this.observers.length}invalidate(){this.state.isInvalidated||Fn(this,Oi,br).call(this,{type:"invalidate"})}async fetch(e,t){var f,_,m,g,y,M,b,S,v,R,I,T;if(this.state.fetchStatus!=="idle"&&((f=me(this,xn))==null?void 0:f.status())!=="rejected"){if(this.state.data!==void 0&&(t!=null&&t.cancelRefetch))this.cancel({silent:!0});else if(me(this,xn))return me(this,xn).continueRetry(),me(this,xn).promise}if(e&&this.setOptions(e),!this.options.queryFn){const N=this.observers.find(L=>L.options.queryFn);N&&this.setOptions(N.options)}const i=new AbortController,a=N=>{Object.defineProperty(N,"signal",{enumerable:!0,get:()=>(st(this,Gs,!0),i.signal)})},l=()=>{const N=__(this.options,t),U=(()=>{const w={client:me(this,Vs),queryKey:this.queryKey,meta:this.meta};return a(w),w})();return st(this,Gs,!1),this.options.persister?this.options.persister(N,U,this):N(U)},d=(()=>{const N={fetchOptions:t,options:this.options,queryKey:this.queryKey,client:me(this,Vs),state:this.state,fetchFn:l};return a(N),N})();(_=me(this,ja)==="infinite"?Sy(this.options.pages):this.options.behavior)==null||_.onFetch(d,this),st(this,Xa,this.state),(this.state.fetchStatus==="idle"||this.state.fetchMeta!==((m=d.fetchOptions)==null?void 0:m.meta))&&Fn(this,Oi,br).call(this,{type:"fetch",meta:(g=d.fetchOptions)==null?void 0:g.meta});const h=st(this,xn,S_({initialPromise:t==null?void 0:t.initialPromise,fn:d.fetchFn,onCancel:N=>{N instanceof Hh&&N.revert&&this.setState({...me(this,Xa),fetchStatus:"idle"}),i.abort()},onFail:(N,L)=>{Fn(this,Oi,br).call(this,{type:"failed",failureCount:N,error:L})},onPause:()=>{Fn(this,Oi,br).call(this,{type:"pause"})},onContinue:()=>{Fn(this,Oi,br).call(this,{type:"continue"})},retry:d.options.retry,retryDelay:d.options.retryDelay,networkMode:d.options.networkMode,canRun:()=>!0}));try{const N=await h.start();if(N===void 0)throw new Error(`${this.queryHash} data is undefined`);return this.setData(N),(M=(y=me(this,Mi).config).onSuccess)==null||M.call(y,N,this),(S=(b=me(this,Mi).config).onSettled)==null||S.call(b,N,this.state.error,this),N}catch(N){if(N instanceof Hh){if(N.silent)return me(this,xn).promise;if(N.revert){if(this.state.data===void 0)throw N;return this.state.data}}throw Fn(this,Oi,br).call(this,{type:"error",error:N}),(R=(v=me(this,Mi).config).onError)==null||R.call(v,N,this),(T=(I=me(this,Mi).config).onSettled)==null||T.call(I,this.state.data,N,this),N}finally{me(this,xn)===h&&st(this,xn,void 0),this.scheduleGc()}}},ja=new WeakMap,Hs=new WeakMap,Xa=new WeakMap,Mi=new WeakMap,Vs=new WeakMap,xn=new WeakMap,ll=new WeakMap,Gs=new WeakMap,Oi=new WeakSet,br=function(e){const t=i=>{switch(e.type){case"failed":return{...i,fetchFailureCount:e.failureCount,fetchFailureReason:e.error};case"pause":return{...i,fetchStatus:"paused"};case"continue":return{...i,fetchStatus:"fetching"};case"fetch":return{...i,...wy(i.data,this.options),fetchMeta:e.meta??null};case"success":const a={...i,...F0(e.data,e.dataUpdatedAt),dataUpdateCount:i.dataUpdateCount+1,...!e.manual&&{fetchStatus:"idle",fetchFailureCount:0,fetchFailureReason:null}};return st(this,Xa,e.manual?a:void 0),a;case"error":const l=e.error;return{...i,error:l,errorUpdateCount:i.errorUpdateCount+1,errorUpdatedAt:Date.now(),fetchFailureCount:i.fetchFailureCount+1,fetchFailureReason:l,fetchStatus:"idle",status:"error",isInvalidated:!0};case"invalidate":return{...i,isInvalidated:!0};case"setState":return{...i,...e.state}}};this.state=t(this.state),jn.batch(()=>{this.observers.slice().forEach(i=>{i.onQueryUpdate()}),me(this,Mi).notify({query:this,type:"updated",action:e})})},c_);function wy(s,e){return{fetchFailureCount:0,fetchFailureReason:null,fetchStatus:y_(e.networkMode)?"fetching":"paused",...s===void 0&&{error:null,status:"pending"}}}function F0(s,e){return{data:s,dataUpdatedAt:e??Date.now(),error:null,isInvalidated:!1,status:"success"}}function O0(s){const e=typeof s.initialData=="function"?s.initialData():s.initialData,t=e!==void 0,i=t?typeof s.initialDataUpdatedAt=="function"?s.initialDataUpdatedAt():s.initialDataUpdatedAt:0;return{data:e,dataUpdateCount:0,dataUpdatedAt:t?i??Date.now():0,error:null,errorUpdateCount:0,errorUpdatedAt:0,fetchFailureCount:0,fetchFailureReason:null,fetchMeta:null,isInvalidated:!1,status:t?"success":"pending",fetchStatus:"idle"}}var cl,Zi,Bn,Ws,Qi,is,u_,by=(u_=class extends M_{constructor(e){super();yt(this,Qi);yt(this,cl);yt(this,Zi);yt(this,Bn);yt(this,Ws);st(this,cl,e.client),this.mutationId=e.mutationId,st(this,Bn,e.mutationCache),st(this,Zi,[]),this.state=e.state||Ty(),this.setOptions(e.options),this.scheduleGc()}setOptions(e){this.options=e,this.updateGcTime(this.options.gcTime)}get meta(){return this.options.meta}addObserver(e){me(this,Zi).includes(e)||(me(this,Zi).push(e),this.clearGcTimeout(),me(this,Bn).notify({type:"observerAdded",mutation:this,observer:e}))}removeObserver(e){st(this,Zi,me(this,Zi).filter(t=>t!==e)),this.scheduleGc(),me(this,Bn).notify({type:"observerRemoved",mutation:this,observer:e})}optionalRemove(){me(this,Zi).length||(this.state.status==="pending"?this.scheduleGc():me(this,Bn).remove(this))}continue(){var e;return((e=me(this,Ws))==null?void 0:e.continue())??(this.state.status==="pending"?this.execute(this.state.variables):Promise.resolve())}async execute(e){var d,h,f,_,m,g,y,M,b,S,v,R,I,T,N,L,U,w;const t=()=>{Fn(this,Qi,is).call(this,{type:"continue"})},i={client:me(this,cl),meta:this.options.meta,mutationKey:this.options.mutationKey},a=st(this,Ws,S_({fn:()=>this.options.mutationFn?this.options.mutationFn(e,i):Promise.reject(new Error("No mutationFn found")),onFail:(D,B)=>{Fn(this,Qi,is).call(this,{type:"failed",failureCount:D,error:B})},onPause:()=>{Fn(this,Qi,is).call(this,{type:"pause"})},onContinue:t,retry:this.options.retry??0,retryDelay:this.options.retryDelay,networkMode:this.options.networkMode,canRun:()=>me(this,Bn).canRun(this)})),l=this.state.status==="pending",c=!a.canStart();try{if(l)t();else{Fn(this,Qi,is).call(this,{type:"pending",variables:e,isPaused:c}),me(this,Bn).config.onMutate&&await me(this,Bn).config.onMutate(e,this,i);const B=await((h=(d=this.options).onMutate)==null?void 0:h.call(d,e,i));B!==this.state.context&&Fn(this,Qi,is).call(this,{type:"pending",context:B,variables:e,isPaused:c})}const D=await a.start();return await((_=(f=me(this,Bn).config).onSuccess)==null?void 0:_.call(f,D,e,this.state.context,this,i)),await((g=(m=this.options).onSuccess)==null?void 0:g.call(m,D,e,this.state.context,i)),await((M=(y=me(this,Bn).config).onSettled)==null?void 0:M.call(y,D,null,this.state.variables,this.state.context,this,i)),await((S=(b=this.options).onSettled)==null?void 0:S.call(b,D,null,e,this.state.context,i)),Fn(this,Qi,is).call(this,{type:"success",data:D}),D}catch(D){try{await((R=(v=me(this,Bn).config).onError)==null?void 0:R.call(v,D,e,this.state.context,this,i))}catch(B){Promise.reject(B)}try{await((T=(I=this.options).onError)==null?void 0:T.call(I,D,e,this.state.context,i))}catch(B){Promise.reject(B)}try{await((L=(N=me(this,Bn).config).onSettled)==null?void 0:L.call(N,void 0,D,this.state.variables,this.state.context,this,i))}catch(B){Promise.reject(B)}try{await((w=(U=this.options).onSettled)==null?void 0:w.call(U,void 0,D,e,this.state.context,i))}catch(B){Promise.reject(B)}throw Fn(this,Qi,is).call(this,{type:"error",error:D}),D}finally{me(this,Ws)===a&&st(this,Ws,void 0),me(this,Bn).runNext(this)}}},cl=new WeakMap,Zi=new WeakMap,Bn=new WeakMap,Ws=new WeakMap,Qi=new WeakSet,is=function(e){const t=i=>{switch(e.type){case"failed":return{...i,failureCount:e.failureCount,failureReason:e.error};case"pause":return{...i,isPaused:!0};case"continue":return{...i,isPaused:!1};case"pending":return{...i,context:e.context,data:void 0,failureCount:0,failureReason:null,error:null,isPaused:e.isPaused,status:"pending",variables:e.variables,submittedAt:Date.now()};case"success":return{...i,data:e.data,failureCount:0,failureReason:null,error:null,status:"success",isPaused:!1};case"error":return{...i,data:void 0,error:e.error,failureCount:i.failureCount+1,failureReason:e.error,isPaused:!1,status:"error"}}};this.state=t(this.state),jn.batch(()=>{me(this,Zi).forEach(i=>{i.onMutationUpdate(e)}),me(this,Bn).notify({mutation:this,type:"updated",action:e})})},u_);function Ty(){return{context:void 0,data:void 0,error:null,failureCount:0,failureReason:null,isPaused:!1,status:"idle",variables:void 0,submittedAt:0}}var Ar,ki,ul,d_,Ay=(d_=class extends hu{constructor(e={}){super();yt(this,Ar);yt(this,ki);yt(this,ul);this.config=e,st(this,Ar,new Set),st(this,ki,new Map),st(this,ul,0)}build(e,t,i){const a=new by({client:e,mutationCache:this,mutationId:++mc(this,ul)._,options:e.defaultMutationOptions(t),state:i});return this.add(a),a}add(e){me(this,Ar).add(e);const t=_c(e);if(typeof t=="string"){const i=me(this,ki).get(t);i?i.push(e):me(this,ki).set(t,[e])}this.notify({type:"added",mutation:e})}remove(e){if(me(this,Ar).delete(e)){const t=_c(e);if(typeof t=="string"){const i=me(this,ki).get(t);if(i)if(i.length>1){const a=i.indexOf(e);a!==-1&&i.splice(a,1)}else i[0]===e&&me(this,ki).delete(t)}}this.notify({type:"removed",mutation:e})}canRun(e){var i;const t=_c(e);if(typeof t=="string"){const a=(i=me(this,ki).get(t))==null?void 0:i.find(l=>l.state.status==="pending");return!a||a===e}else return!0}runNext(e){var i,a;const t=_c(e);return typeof t=="string"?((a=(i=me(this,ki).get(t))==null?void 0:i.find(l=>l!==e&&l.state.isPaused))==null?void 0:a.continue())??Promise.resolve():Promise.resolve()}clear(){jn.batch(()=>{me(this,Ar).forEach(e=>{this.notify({type:"removed",mutation:e})}),me(this,Ar).clear(),me(this,ki).clear()})}getAll(){return Array.from(me(this,Ar))}find(e){const t={exact:!0,...e};return this.getAll().find(i=>L0(t,i))}findAll(e={}){return this.getAll().filter(t=>L0(e,t))}notify(e){jn.batch(()=>{this.listeners.forEach(t=>{t(e)})})}resumePausedMutations(){const e=this.getAll().filter(t=>t.state.isPaused);return jn.batch(()=>Promise.all(e.map(t=>t.continue().catch(Ei))))}},Ar=new WeakMap,ki=new WeakMap,ul=new WeakMap,d_);function _c(s){var e;return(e=s.options.scope)==null?void 0:e.id}var Ji,h_,Cy=(h_=class extends hu{constructor(e={}){super();yt(this,Ji);this.config=e,st(this,Ji,new Map)}build(e,t,i){const a=t.queryKey,l=t.queryHash??If(a,t);let c=this.get(l);return c||(c=new Ey({client:e,queryKey:a,queryHash:l,options:e.defaultQueryOptions(t),state:i,defaultOptions:e.getQueryDefaults(a)}),this.add(c)),c}add(e){me(this,Ji).has(e.queryHash)||(me(this,Ji).set(e.queryHash,e),this.notify({type:"added",query:e}))}remove(e){me(this,Ji).get(e.queryHash)===e&&(e.destroy(),me(this,Ji).delete(e.queryHash),this.notify({type:"removed",query:e}))}clear(){jn.batch(()=>{this.getAll().forEach(e=>{this.remove(e)})})}get(e){return me(this,Ji).get(e)}getAll(){return[...me(this,Ji).values()]}find(e){const t={exact:!0,...e};return this.getAll().find(i=>N0(t,i))}findAll(e={}){const t=this.getAll();return Object.keys(e).length>0?t.filter(i=>N0(e,i)):t}notify(e){jn.batch(()=>{this.listeners.forEach(t=>{t(e)})})}onFocus(){jn.batch(()=>{this.getAll().forEach(e=>{e.onFocus()})})}onOnline(){jn.batch(()=>{this.getAll().forEach(e=>{e.onOnline()})})}},Ji=new WeakMap,h_),Jt,ls,cs,qa,Ya,us,$a,Ka,f_,Ry=(f_=class{constructor(s={}){yt(this,Jt);yt(this,ls);yt(this,cs);yt(this,qa);yt(this,Ya);yt(this,us);yt(this,$a);yt(this,Ka);st(this,Jt,s.queryCache||new Cy),st(this,ls,s.mutationCache||new Ay),st(this,cs,s.defaultOptions||{}),st(this,qa,new Map),st(this,Ya,new Map),st(this,us,0)}mount(){mc(this,us)._++,me(this,us)===1&&(st(this,$a,v_.subscribe(async s=>{s&&(await this.resumePausedMutations(),me(this,Jt).onFocus())})),st(this,Ka,eu.subscribe(async s=>{s&&(await this.resumePausedMutations(),me(this,Jt).onOnline())})))}unmount(){var s,e;mc(this,us)._--,me(this,us)===0&&((s=me(this,$a))==null||s.call(this),st(this,$a,void 0),(e=me(this,Ka))==null||e.call(this),st(this,Ka,void 0))}isFetching(s){return me(this,Jt).findAll({...s,fetchStatus:"fetching"}).length}isMutating(s){return me(this,ls).findAll({...s,status:"pending"}).length}getQueryData(s){var t;const e=this.defaultQueryOptions({queryKey:s});return(t=me(this,Jt).get(e.queryHash))==null?void 0:t.state.data}ensureQueryData(s){const e=this.defaultQueryOptions(s),t=me(this,Jt).build(this,e),i=t.state.data;return i===void 0?this.fetchQuery(s):(s.revalidateIfStale&&t.isStaleByTime(Jo(e.staleTime,t))&&this.prefetchQuery(e),Promise.resolve(i))}getQueriesData(s){return me(this,Jt).findAll(s).map(({queryKey:e,state:t})=>[e,t.data])}setQueryData(s,e,t){var c;const i=this.defaultQueryOptions({queryKey:s}),a=(c=me(this,Jt).get(i.queryHash))==null?void 0:c.state.data,l=ay(e,a);if(l!==void 0)return me(this,Jt).build(this,i).setData(l,{...t,manual:!0})}setQueriesData(s,e,t){return jn.batch(()=>me(this,Jt).findAll(s).map(({queryKey:i})=>[i,this.setQueryData(i,e,t)]))}getQueryState(s){var t;const e=this.defaultQueryOptions({queryKey:s});return(t=me(this,Jt).get(e.queryHash))==null?void 0:t.state}removeQueries(s){const e=me(this,Jt);jn.batch(()=>{e.findAll(s).forEach(t=>{e.remove(t)})})}resetQueries(s,e){const t=me(this,Jt);return jn.batch(()=>{const i=t.findAll(s),a=new Set(i);return i.forEach(l=>{l.reset()}),this.refetchQueries({type:"active",predicate:l=>a.has(l)},e)})}cancelQueries(s,e={}){const t={revert:!0,...e},i=jn.batch(()=>me(this,Jt).findAll(s).map(a=>a.cancel(t)));return Promise.all(i).then(Ei).catch(Ei)}invalidateQueries(s,e={}){return jn.batch(()=>(me(this,Jt).findAll(s).forEach(t=>{t.invalidate()}),(s==null?void 0:s.refetchType)==="none"?Promise.resolve():this.refetchQueries({...s,type:(s==null?void 0:s.refetchType)??(s==null?void 0:s.type)??"active"},e)))}refetchQueries(s,e={}){const t={...e,cancelRefetch:e.cancelRefetch??!0},i=jn.batch(()=>me(this,Jt).findAll(s).filter(a=>!a.isDisabled()&&!a.isStatic()).map(a=>{let l=a.fetch(void 0,t);return t.throwOnError||(l=l.catch(Ei)),a.state.fetchStatus==="paused"?Promise.resolve():l}));return Promise.all(i).then(Ei)}async query(s){const e=this.defaultQueryOptions(s);e.retry===void 0&&(e.retry=!1);const t=me(this,Jt).build(this,e),i=t.isStaleByTime(Jo(e.staleTime,t))?await t.fetch(e):t.state.data,a=e.select;return a?a(i):i}fetchQuery(s){const e=this.defaultQueryOptions(s);e.retry===void 0&&(e.retry=!1);const t=me(this,Jt).build(this,e);return t.isStaleByTime(Jo(e.staleTime,t))?t.fetch(e):Promise.resolve(t.state.data)}prefetchQuery(s){return this.fetchQuery(s).then(Ei).catch(Ei)}infiniteQuery(s){return s._type="infinite",this.query(s)}fetchInfiniteQuery(s){return s._type="infinite",this.fetchQuery(s)}prefetchInfiniteQuery(s){return this.fetchInfiniteQuery(s).then(Ei).catch(Ei)}ensureInfiniteQueryData(s){return s._type="infinite",this.ensureQueryData(s)}resumePausedMutations(){return eu.isOnline()?me(this,ls).resumePausedMutations():Promise.resolve()}getQueryCache(){return me(this,Jt)}getMutationCache(){return me(this,ls)}getDefaultOptions(){return me(this,cs)}setDefaultOptions(s){st(this,cs,s)}setQueryDefaults(s,e){me(this,qa).set(nl(s),{queryKey:s,defaultOptions:e})}getQueryDefaults(s){const e=[...me(this,qa).values()],t={};return e.forEach(i=>{Za(s,i.queryKey)&&Object.assign(t,i.defaultOptions)}),t}setMutationDefaults(s,e){me(this,Ya).set(nl(s),{mutationKey:s,defaultOptions:e})}getMutationDefaults(s){const e=[...me(this,Ya).values()],t={};return e.forEach(i=>{Za(s,i.mutationKey)&&Object.assign(t,i.defaultOptions)}),t}defaultQueryOptions(s){if(s._defaulted)return s;const e={...me(this,cs).queries,...this.getQueryDefaults(s.queryKey),...s,_defaulted:!0};return e.queryHash||(e.queryHash=If(e.queryKey,e)),e.refetchOnReconnect===void 0&&(e.refetchOnReconnect=e.networkMode!=="always"),e.throwOnError===void 0&&(e.throwOnError=!!e.suspense),!e.networkMode&&e.persister&&(e.networkMode="offlineFirst"),e.queryFn===Uf&&(e.enabled=!1),e}defaultMutationOptions(s){return s!=null&&s._defaulted?s:{...me(this,cs).mutations,...(s==null?void 0:s.mutationKey)&&this.getMutationDefaults(s.mutationKey),...s,_defaulted:!0}}clear(){me(this,Jt).clear(),me(this,ls).clear()}},Jt=new WeakMap,ls=new WeakMap,cs=new WeakMap,qa=new WeakMap,Ya=new WeakMap,us=new WeakMap,$a=new WeakMap,Ka=new WeakMap,f_);const k0=s=>{let e;const t=new Set,i=(f,_)=>{const m=typeof f=="function"?f(e):f;if(!Object.is(m,e)){const g=e;e=_??(typeof m!="object"||m===null)?m:Object.assign({},e,m),t.forEach(y=>y(e,g))}},a=()=>e,d={setState:i,getState:a,getInitialState:()=>h,subscribe:f=>(t.add(f),()=>t.delete(f))},h=e=s(i,a,d);return d},Py=(s=>s?k0(s):k0),Ny=s=>s;function Ly(s,e=Ny){const t=ds.useSyncExternalStore(s.subscribe,ds.useCallback(()=>e(s.getState()),[s,e]),ds.useCallback(()=>e(s.getInitialState()),[s,e]));return ds.useDebugValue(t),t}const B0=s=>{const e=Py(s),t=i=>Ly(e,i);return Object.assign(t,e),t},Dy=(s=>s?B0(s):B0),vn=Dy((s,e)=>({catalog:[],contractsSource:"Loading...",framesById:{},selectedCanId:289,hoveredSignal:null,telemetry:{mode:"MANUAL",estop:!1,estop_reason:0,gear:"N",speed_cmd_kmh:0,speed_act_kmh:0,steer_cmd_deg:0,steer_act_deg:0,brake_cmd_kpa:0,brake_act_kpa:0,lights_cmd:{left:!1,right:!1,hazard:!1,headlight:!1,brake:!1},lights_act:{left:!1,right:!1,hazard:!1,headlight:!1,brake:!1}},totalFrames:0,uptimeSec:0,isConnected:!1,isPaused:!1,filterAccess:"all",filterBus:"all",searchQuery:"",zoomLevel:(()=>{try{const t=localStorage.getItem("can_watcher_zoom");return t?Math.min(Math.max(parseFloat(t),.6),1.8):1}catch{return 1}})(),zoomToast:null,activeView:(()=>{try{return localStorage.getItem("seer_active_view")==="cockpit"?"cockpit":"monitor"}catch{return"monitor"}})(),cameraMode:"chase",speedUnit:"km/h",setActiveView:t=>{try{localStorage.setItem("seer_active_view",t)}catch{}s({activeView:t})},toggleActiveView:()=>{const t=e().activeView==="monitor"?"cockpit":"monitor";try{localStorage.setItem("seer_active_view",t)}catch{}s({activeView:t})},setCameraMode:t=>s({cameraMode:t}),setSpeedUnit:t=>s({speedUnit:t}),setCatalog:(t,i)=>{s({catalog:t,contractsSource:i,selectedCanId:t.length>0&&!t.some(a=>a.id===e().selectedCanId)?t[0].id:e().selectedCanId})},selectMessage:t=>s({selectedCanId:t}),setHoveredSignal:t=>s({hoveredSignal:t}),togglePause:()=>s(t=>({isPaused:!t.isPaused})),setFilterAccess:t=>s({filterAccess:t}),setFilterBus:t=>s({filterBus:t}),setSearchQuery:t=>s({searchQuery:t}),setZoomLevel:t=>{s(i=>{const a=i.zoomLevel,l=typeof t=="function"?t(a):t,c=Math.round(Math.min(Math.max(l,.6),1.8)*100)/100;try{localStorage.setItem("can_watcher_zoom",String(c))}catch{}return{zoomLevel:c,zoomToast:`${Math.round(c*100)}%`}})},setZoomToast:t=>s({zoomToast:t}),initWebSocket:()=>{const i=window.location.port==="5173"?"127.0.0.1:8000":window.location.host,l=`${window.location.protocol==="https:"?"wss:":"ws:"}//${i}/ws/v1/stream`;let c=null,d=null;const h=()=>{try{c=new WebSocket(l),c.onopen=()=>{s({isConnected:!0})},c.onmessage=f=>{if(!e().isPaused)try{const _=JSON.parse(f.data),m={};if(_.total_frames!==void 0&&(m.totalFrames=_.total_frames),_.uptime_sec!==void 0&&(m.uptimeSec=_.uptime_sec),_.telemetry&&(m.telemetry=_.telemetry),_.frames&&Array.isArray(_.frames)){const g={...e().framesById};for(const y of _.frames)g[y.id]=y;m.framesById=g}s(m)}catch(_){console.error("[WS] Parse error:",_)}},c.onclose=()=>{s({isConnected:!1}),clearTimeout(d),d=setTimeout(h,1500)},c.onerror=()=>{c==null||c.close()}}catch{clearTimeout(d),d=setTimeout(h,1500)}};h()}}));/**
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
 */const Fy=an.forwardRef(({color:s="currentColor",size:e=24,strokeWidth:t=2,absoluteStrokeWidth:i,className:a="",children:l,iconNode:c,...d},h)=>an.createElement("svg",{ref:h,...Uy,width:e,height:e,stroke:s,strokeWidth:i?Number(t)*24/Number(e):t,className:E_("lucide",a),...d},[...c.map(([f,_])=>an.createElement(f,_)),...Array.isArray(l)?l:[l]]));/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tn=(s,e)=>{const t=an.forwardRef(({className:i,...a},l)=>an.createElement(Fy,{ref:l,iconNode:e,className:E_(`lucide-${Iy(s)}`,i),...a}));return t.displayName=`${s}`,t};/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Oy=[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]],w_=Tn("Activity",Oy);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ky=[["path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",key:"1tc9qg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]],By=Tn("Camera",ky);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zy=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],Hy=Tn("ChevronLeft",zy);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vy=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],Gy=Tn("ChevronRight",Vy);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wy=[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]],z0=Tn("Database",Wy);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jy=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],b_=Tn("Eye",jy);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xy=[["path",{d:"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",key:"zw3jo"}],["path",{d:"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",key:"1wduqc"}],["path",{d:"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",key:"kqbvx6"}]],qy=Tn("Layers",Xy);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yy=[["path",{d:"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",key:"1gvzjb"}],["path",{d:"M9 18h6",key:"x1upvd"}],["path",{d:"M10 22h4",key:"ceow96"}]],$y=Tn("Lightbulb",Yy);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ky=[["path",{d:"M12 16h.01",key:"1drbdi"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z",key:"1fd625"}]],Zy=Tn("OctagonAlert",Ky);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qy=[["rect",{x:"14",y:"4",width:"4",height:"16",rx:"1",key:"zuxfzm"}],["rect",{x:"6",y:"4",width:"4",height:"16",rx:"1",key:"1okwgv"}]],Jy=Tn("Pause",Qy);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const eS=[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]],tS=Tn("Play",eS);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nS=[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]],iS=Tn("Search",nS);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rS=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M12 16h.01",key:"1drbdi"}]],sS=Tn("ShieldAlert",rS);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const aS=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],oS=Tn("ShieldCheck",aS);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lS=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]],cS=Tn("TriangleAlert",lS);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uS=[["path",{d:"M12 20h.01",key:"zekei9"}],["path",{d:"M8.5 16.429a5 5 0 0 1 7 0",key:"1bycff"}],["path",{d:"M5 12.859a10 10 0 0 1 5.17-2.69",key:"1dl1wf"}],["path",{d:"M19 12.859a10 10 0 0 0-2.007-1.523",key:"4k23kn"}],["path",{d:"M2 8.82a15 15 0 0 1 4.177-2.643",key:"1grhjp"}],["path",{d:"M22 8.82a15 15 0 0 0-11.288-3.764",key:"z3jwby"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]],dS=Tn("WifiOff",uS);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hS=[["path",{d:"M12 20h.01",key:"zekei9"}],["path",{d:"M2 8.82a15 15 0 0 1 20 0",key:"dnpr2z"}],["path",{d:"M5 12.859a10 10 0 0 1 14 0",key:"1x1e6c"}],["path",{d:"M8.5 16.429a5 5 0 0 1 7 0",key:"1bycff"}]],fS=Tn("Wifi",hS);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pS=[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]],mS=Tn("Zap",pS),gS=()=>{const{totalFrames:s,isConnected:e,isPaused:t,contractsSource:i,filterAccess:a,filterBus:l,searchQuery:c,togglePause:d,setFilterAccess:h,setFilterBus:f,setSearchQuery:_,catalog:m,zoomLevel:g,setZoomLevel:y,activeView:M,setActiveView:b}=vn(),S=i.includes("contracts")?"contracts/*.yaml":i;return A.jsxs("header",{className:"h-12 bg-black border-b border-neutral-800 px-4 flex items-center justify-between select-none shrink-0 z-20",children:[A.jsxs("div",{className:"flex items-center gap-3 shrink-0",children:[A.jsxs("div",{className:"flex items-baseline gap-2 shrink-0 whitespace-nowrap",children:[A.jsx("span",{className:"text-base font-black tracking-tight text-white font-mono lowercase",children:"seer"}),A.jsx("span",{className:"text-[11px] text-neutral-400 font-mono font-medium lowercase whitespace-nowrap",children:"e-trike av"})]}),A.jsx("div",{className:"h-4 w-px bg-neutral-800 mx-1"}),A.jsxs("div",{className:"flex bg-[#0a0a0a] border border-neutral-800 rounded p-0.5 text-[10px] font-mono shrink-0",children:[A.jsxs("button",{onClick:()=>b("monitor"),className:`px-2.5 py-1 rounded transition-all font-bold uppercase flex items-center gap-1.5 ${M==="monitor"?"bg-neutral-800 text-cyan-300 shadow-sm":"text-neutral-400 hover:text-neutral-200"}`,title:"CAN Bus Engineering Directory & Bit Matrix (Tab)",children:[A.jsx(z0,{className:"w-3 h-3"}),A.jsx("span",{children:"CAN MONITOR"})]}),A.jsxs("button",{onClick:()=>b("cockpit"),className:`px-2.5 py-1 rounded transition-all font-bold uppercase flex items-center gap-1.5 ${M==="cockpit"?"bg-cyan-950 text-cyan-300 border border-cyan-700/60 shadow-sm":"text-neutral-400 hover:text-neutral-200"}`,title:"3D Autonomous Driving Cockpit (Tab)",children:[A.jsx(b_,{className:"w-3 h-3 text-cyan-400"}),A.jsx("span",{children:"3D COCKPIT"})]})]}),A.jsx("div",{className:"h-4 w-px bg-neutral-800 mx-1"}),A.jsxs("div",{className:"hidden lg:flex items-center gap-2 text-[11px] font-mono bg-[#0a0a0a] px-2.5 py-1 rounded border border-neutral-800",title:`Full Contracts Source: ${i}`,children:[A.jsx(z0,{className:"w-3 h-3 text-cyan-400"}),A.jsx("span",{className:"text-neutral-400",children:"source:"}),A.jsx("span",{className:"text-neutral-200 font-medium",children:S}),A.jsx("span",{className:"text-neutral-600",children:"|"}),A.jsx("span",{className:"text-emerald-400 font-bold",children:m.length}),A.jsx("span",{className:"text-neutral-400",children:"ids"})]})]}),M==="monitor"?A.jsxs("div",{className:"flex items-center gap-3",children:[A.jsxs("div",{className:"relative w-52 xl:w-72",children:[A.jsx(iS,{className:"w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400"}),A.jsx("input",{type:"text",value:c,onChange:v=>_(v.target.value),placeholder:"Search ID (0x121) or Name...",className:"w-full h-7 pl-8 pr-3 text-xs bg-[#0a0a0a] text-neutral-100 placeholder-neutral-500 border border-neutral-800 rounded focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"}),c&&A.jsx("button",{onClick:()=>_(""),className:"absolute right-2 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white",children:"×"})]}),A.jsx("div",{className:"flex rounded bg-[#0a0a0a] p-0.5 border border-neutral-800 text-[10px] font-mono",children:["all","rx","tx"].map(v=>A.jsx("button",{onClick:()=>h(v),className:`px-2 py-0.5 rounded transition-all font-semibold uppercase ${a===v?"bg-neutral-800 text-white shadow-sm":"text-neutral-400 hover:text-neutral-200"}`,children:v},v))}),A.jsx("div",{className:"flex rounded bg-[#0a0a0a] p-0.5 border border-neutral-800 text-[10px] font-mono",children:["all","high","low"].map(v=>A.jsx("button",{onClick:()=>f(v),className:`px-2 py-0.5 rounded transition-all font-semibold uppercase ${l===v?"bg-neutral-800 text-white shadow-sm":"text-neutral-400 hover:text-neutral-200"}`,children:v},v))})]}):A.jsx("div",{className:"flex items-center gap-2",children:A.jsxs("span",{className:"text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-800/40 font-bold uppercase tracking-wider flex items-center gap-2",children:[A.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"}),"AUTOWARE 3D DIGITAL TWIN"]})}),A.jsxs("div",{className:"flex items-center gap-2.5 shrink-0",children:[A.jsxs("button",{onClick:d,className:`h-7 px-2.5 rounded flex items-center gap-1.5 text-[11px] font-mono font-semibold transition-all ${t?"bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30":"bg-[#0a0a0a] hover:bg-neutral-900 text-neutral-300 border border-neutral-800"}`,title:"Pause or resume live UI updates (Spacebar)",children:[t?A.jsx(tS,{className:"w-3 h-3 fill-current"}):A.jsx(Jy,{className:"w-3 h-3"}),A.jsx("span",{children:t?"RESUME":"FREEZE"})]}),A.jsxs("div",{className:"flex items-center rounded bg-[#0a0a0a] border border-neutral-800 text-[10px] font-mono p-0.5",title:"UI Scale Zoom (Ctrl+ / Ctrl- / Ctrl+0)",children:[A.jsx("button",{onClick:()=>y(v=>v-.1),className:"w-5 h-5 flex items-center justify-center rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors font-bold",title:"Zoom Out (Ctrl -)",children:"–"}),A.jsxs("button",{onClick:()=>y(1),className:"px-1.5 h-5 flex items-center justify-center rounded text-neutral-300 hover:text-cyan-300 text-[10px] font-bold transition-colors",title:"Reset Zoom to 100% (Ctrl 0)",children:[Math.round(g*100),"%"]}),A.jsx("button",{onClick:()=>y(v=>v+.1),className:"w-5 h-5 flex items-center justify-center rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors font-bold",title:"Zoom In (Ctrl +)",children:"+"})]}),A.jsxs("div",{className:"flex items-center gap-1.5 text-[11px] font-mono bg-[#0a0a0a] px-2.5 py-1 rounded border border-neutral-800",children:[A.jsx(w_,{className:"w-3 h-3 text-cyan-400 animate-pulse"}),A.jsx("span",{className:"text-neutral-400",children:"frames:"}),A.jsx("span",{className:"text-neutral-100 font-bold tabular-nums",children:s.toLocaleString()})]}),A.jsx("div",{className:`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-mono font-bold border ${e?"bg-[#0a0a0a] text-emerald-400 border-neutral-800":"bg-rose-950/40 text-rose-400 border-rose-800/60"}`,children:e?A.jsxs(A.Fragment,{children:[A.jsx(fS,{className:"w-3 h-3 text-emerald-400"}),A.jsxs("span",{className:"relative flex h-1.5 w-1.5",children:[A.jsx("span",{className:"animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"}),A.jsx("span",{className:"relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"})]}),A.jsx("span",{children:"LIVE"})]}):A.jsxs(A.Fragment,{children:[A.jsx(dS,{className:"w-3 h-3 text-rose-400"}),A.jsx("span",{children:"DISCONNECTED"})]})})]})]})},_S=()=>{const s=vn(b=>b.telemetry),e=50,t=Math.min(Math.max(s.speed_act_kmh,0),e),i=Math.min(Math.max(s.speed_cmd_kmh,0),e),a=-135+t/e*180,l=-135+i/e*180,c=45,d=Math.min(Math.max(s.steer_act_deg,-c),c),h=Math.min(Math.max(s.steer_cmd_deg,-c),c),f=-90+d/c*45,_=-90+h/c*45,m=1500,g=Math.min(Math.max(s.brake_act_kpa/m*100,0),100),y=Math.min(Math.max(s.brake_cmd_kpa/m*100,0),100),M=["P","R","N","D","S"];return A.jsxs("aside",{className:"w-72 bg-black border-r border-neutral-800 flex flex-col justify-between p-3 select-none overflow-y-auto shrink-0",children:[A.jsxs("div",{className:"space-y-2.5",children:[A.jsxs("div",{className:"flex items-center justify-between pb-2 border-b border-neutral-800",children:[A.jsx("span",{className:"text-[11px] font-mono uppercase text-neutral-300 font-bold tracking-wider",children:"Cockpit State"}),s.estop?A.jsxs("span",{className:"flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/60 shadow-[0_0_8px_rgba(244,63,94,0.4)] animate-pulse",children:[A.jsx(sS,{className:"w-3.5 h-3.5"})," ESTOP ACTIVE"]}):A.jsx("span",{className:"text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40",children:"SAFETY OK"})]}),A.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[A.jsxs("div",{className:"bg-[#0a0a0a] p-2 rounded-lg border border-neutral-800",children:[A.jsx("span",{className:"block text-[10px] uppercase font-mono text-neutral-400 font-medium",children:"Mode"}),A.jsx("span",{className:`text-xs font-mono font-black tracking-wide ${s.mode==="AUTONOMOUS"||s.mode==="AUTO"?"text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.4)]":s.mode==="EMERGENCY"||s.mode==="ESTOP"?"text-rose-400 drop-shadow-[0_0_6px_rgba(244,63,94,0.4)]":"text-amber-300"}`,children:s.mode})]}),A.jsxs("div",{className:"bg-[#0a0a0a] p-2 rounded-lg border border-neutral-800",children:[A.jsx("span",{className:"block text-[10px] uppercase font-mono text-neutral-400 font-medium",children:"Gear"}),A.jsx("div",{className:"flex items-center justify-between mt-1",children:M.map(b=>{const S=s.gear===b;return A.jsx("span",{className:`text-[11px] font-mono font-black px-1.5 py-0.5 rounded transition-all ${S?"bg-cyan-400 text-black shadow-md shadow-cyan-500/40":"text-neutral-400 bg-neutral-900 border border-neutral-800"}`,children:b},b)})})]})]}),A.jsxs("div",{className:"bg-[#0a0a0a] p-2.5 rounded-lg border border-neutral-800",children:[A.jsxs("div",{className:"flex items-center justify-between mb-2",children:[A.jsx("span",{className:"text-[10px] uppercase font-mono text-neutral-300 font-semibold tracking-wide",children:"ISO 2575 Telltales"}),A.jsxs("div",{className:"flex items-center gap-2 text-[9px] font-mono",children:[A.jsx("span",{className:"text-cyan-400 font-bold",children:"■ CMD"}),A.jsx("span",{className:"text-emerald-400 font-bold",children:"■ ACT"})]})]}),A.jsxs("div",{className:"grid grid-cols-5 gap-1.5 text-center",children:[A.jsxs("div",{className:`p-1.5 rounded-md border flex flex-col items-center justify-center transition-all ${s.lights_act.left?"bg-emerald-500/25 text-emerald-300 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]":s.lights_cmd.left?"bg-cyan-500/15 text-cyan-300 border-cyan-400/60 ring-1 ring-cyan-400/40":"bg-[#121212] text-neutral-400 border-neutral-800"}`,title:"Left Turn Indicator",children:[A.jsx("span",{className:"text-base font-black leading-none",children:"⮜"}),A.jsx("span",{className:"text-[9px] font-mono font-semibold mt-1",children:"LEFT"})]}),A.jsxs("div",{className:`p-1.5 rounded-md border flex flex-col items-center justify-center transition-all ${s.lights_act.right?"bg-emerald-500/25 text-emerald-300 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]":s.lights_cmd.right?"bg-cyan-500/15 text-cyan-300 border-cyan-400/60 ring-1 ring-cyan-400/40":"bg-[#121212] text-neutral-400 border-neutral-800"}`,title:"Right Turn Indicator",children:[A.jsx("span",{className:"text-base font-black leading-none",children:"⮞"}),A.jsx("span",{className:"text-[9px] font-mono font-semibold mt-1",children:"RGHT"})]}),A.jsxs("div",{className:`p-1.5 rounded-md border flex flex-col items-center justify-center transition-all ${s.lights_act.hazard?"bg-amber-500/25 text-amber-300 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse":s.lights_cmd.hazard?"bg-cyan-500/15 text-cyan-300 border-cyan-400/60 ring-1 ring-cyan-400/40":"bg-[#121212] text-neutral-400 border-neutral-800"}`,title:"Hazard Warning Lights",children:[A.jsx(cS,{className:"w-3.5 h-3.5"}),A.jsx("span",{className:"text-[9px] font-mono font-semibold mt-1",children:"HAZD"})]}),A.jsxs("div",{className:`p-1.5 rounded-md border flex flex-col items-center justify-center transition-all ${s.lights_act.headlight?"bg-sky-500/25 text-sky-300 border-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.4)]":s.lights_cmd.headlight?"bg-cyan-500/15 text-cyan-300 border-cyan-400/60 ring-1 ring-cyan-400/40":"bg-[#121212] text-neutral-400 border-neutral-800"}`,title:"Headlights / Dipped Beam",children:[A.jsx($y,{className:"w-3.5 h-3.5"}),A.jsx("span",{className:"text-[9px] font-mono font-semibold mt-1",children:"BEAM"})]}),A.jsxs("div",{className:`p-1.5 rounded-md border flex flex-col items-center justify-center transition-all ${s.lights_act.brake?"bg-rose-500/25 text-rose-300 border-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.5)]":s.lights_cmd.brake?"bg-cyan-500/15 text-cyan-300 border-cyan-400/60 ring-1 ring-cyan-400/40":"bg-[#121212] text-neutral-400 border-neutral-800"}`,title:"Brake Stop Lamp",children:[A.jsx("span",{className:"text-[10px] font-black leading-none px-1 py-0.5 rounded bg-rose-950/60 border border-rose-800/80",children:"STOP"}),A.jsx("span",{className:"text-[9px] font-mono font-semibold mt-0.5",children:"BRK"})]})]})]}),A.jsxs("div",{className:"bg-[#0a0a0a] p-3 rounded-lg border border-neutral-800",children:[A.jsxs("div",{className:"flex items-center justify-between text-[10px] font-mono text-neutral-300 font-semibold mb-1",children:[A.jsx("span",{children:"SPEEDOMETER"}),A.jsx("span",{className:"text-neutral-400",children:"0 - 50 km/h"})]}),A.jsxs("div",{className:"relative flex flex-col items-center justify-center py-1",children:[A.jsxs("svg",{viewBox:"0 0 160 92",className:"w-44 overflow-visible",children:[A.jsx("path",{d:"M 20 85 A 60 60 0 0 1 140 85",fill:"none",stroke:"#262626",strokeWidth:"10",strokeLinecap:"round"}),[0,10,20,30,40,50].map(b=>{const v=(-135+b/50*180)*Math.PI/180,R=80+53*Math.cos(v),I=85+53*Math.sin(v),T=80+60*Math.cos(v),N=85+60*Math.sin(v);return A.jsx("line",{x1:R,y1:I,x2:T,y2:N,stroke:"#525252",strokeWidth:"1.5"},b)}),A.jsx("line",{x1:"80",y1:"85",x2:80+58*Math.cos(l*Math.PI/180),y2:85+58*Math.sin(l*Math.PI/180),stroke:"#06b6d4",strokeWidth:"2.5",strokeDasharray:"4 2"}),A.jsx("line",{x1:"80",y1:"85",x2:80+54*Math.cos(a*Math.PI/180),y2:85+54*Math.sin(a*Math.PI/180),stroke:"#10b981",strokeWidth:"3.5",strokeLinecap:"round"}),A.jsx("circle",{cx:"80",cy:"85",r:"5",fill:"#10b981"}),A.jsx("circle",{cx:"80",cy:"85",r:"2.5",fill:"#000000"})]}),A.jsxs("div",{className:"text-center mt-[-6px]",children:[A.jsx("div",{className:"text-3xl font-mono font-black text-emerald-400 tracking-tight tabular-nums drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]",children:s.speed_act_kmh.toFixed(1)}),A.jsxs("div",{className:"text-[11px] font-mono text-neutral-400 flex items-center justify-center gap-2 mt-0.5",children:[A.jsx("span",{className:"font-semibold text-neutral-300",children:"km/h"}),A.jsx("span",{className:"text-neutral-600",children:"|"}),A.jsxs("span",{className:"text-cyan-300 font-bold bg-[#141414] px-1.5 py-0.5 rounded border border-neutral-700",children:["CMD: ",s.speed_cmd_kmh.toFixed(1)]})]})]})]})]}),A.jsxs("div",{className:"bg-[#0a0a0a] p-3 rounded-lg border border-neutral-800",children:[A.jsxs("div",{className:"flex items-center justify-between text-[10px] font-mono text-neutral-300 font-semibold mb-1",children:[A.jsx("span",{children:"STEERING ANGLE"}),A.jsx("span",{className:"text-neutral-400",children:"±45.0°"})]}),A.jsxs("div",{className:"relative flex flex-col items-center justify-center py-1",children:[A.jsxs("svg",{viewBox:"0 0 160 70",className:"w-44 overflow-visible",children:[A.jsx("line",{x1:"80",y1:"16",x2:"80",y2:"60",stroke:"#525252",strokeWidth:"1",strokeDasharray:"2 2"}),A.jsx("path",{d:"M 38 60 A 60 60 0 0 1 122 60",fill:"none",stroke:"#262626",strokeWidth:"8",strokeLinecap:"round"}),A.jsx("line",{x1:"80",y1:"60",x2:80+52*Math.cos(_*Math.PI/180),y2:60+52*Math.sin(_*Math.PI/180),stroke:"#06b6d4",strokeWidth:"2.5",strokeDasharray:"3 2"}),A.jsx("line",{x1:"80",y1:"60",x2:80+50*Math.cos(f*Math.PI/180),y2:60+50*Math.sin(f*Math.PI/180),stroke:"#10b981",strokeWidth:"3.5",strokeLinecap:"round"}),A.jsx("circle",{cx:"80",cy:"60",r:"4",fill:"#10b981"})]}),A.jsxs("div",{className:"text-center mt-[-4px]",children:[A.jsxs("div",{className:"text-2xl font-mono font-black text-emerald-400 tabular-nums drop-shadow-[0_0_6px_rgba(16,185,129,0.3)]",children:[s.steer_act_deg>0?`+${s.steer_act_deg.toFixed(1)}`:s.steer_act_deg.toFixed(1),"°"]}),A.jsxs("div",{className:"text-[11px] font-mono text-neutral-400 mt-0.5",children:["CMD:"," ",A.jsxs("span",{className:"text-cyan-300 font-bold bg-[#141414] px-1.5 py-0.5 rounded border border-neutral-700",children:[s.steer_cmd_deg.toFixed(1),"°"]})]})]})]})]}),A.jsxs("div",{className:"bg-[#0a0a0a] p-3 rounded-lg border border-neutral-800",children:[A.jsxs("div",{className:"flex items-center justify-between text-[10px] font-mono text-neutral-300 font-semibold mb-2",children:[A.jsx("span",{children:"HYDRAULIC BRAKE"}),A.jsx("span",{className:"text-neutral-400",children:"0 - 1500 kPa"})]}),A.jsxs("div",{className:"space-y-2",children:[A.jsxs("div",{children:[A.jsxs("div",{className:"flex justify-between text-[10px] font-mono mb-1 text-neutral-300",children:[A.jsx("span",{className:"text-emerald-400 font-bold",children:"FEEDBACK"}),A.jsxs("span",{className:"text-neutral-100 tabular-nums font-bold",children:[s.brake_act_kpa.toFixed(0)," kPa"]})]}),A.jsx("div",{className:"w-full h-2.5 bg-[#141414] rounded-full overflow-hidden border border-neutral-800",children:A.jsx("div",{className:"h-full bg-emerald-500 rounded-full transition-all duration-100 shadow-[0_0_8px_rgba(16,185,129,0.5)]",style:{width:`${g}%`}})})]}),A.jsxs("div",{children:[A.jsxs("div",{className:"flex justify-between text-[10px] font-mono mb-1 text-neutral-300",children:[A.jsx("span",{className:"text-cyan-400 font-bold",children:"COMMAND"}),A.jsxs("span",{className:"text-neutral-200 tabular-nums font-bold",children:[s.brake_cmd_kpa.toFixed(0)," kPa"]})]}),A.jsx("div",{className:"w-full h-2 bg-[#141414] rounded-full overflow-hidden border border-neutral-800",children:A.jsx("div",{className:"h-full bg-cyan-400 rounded-full transition-all duration-100 shadow-[0_0_6px_rgba(6,182,212,0.4)]",style:{width:`${y}%`}})})]})]})]})]}),A.jsxs("div",{className:"pt-2 border-t border-neutral-800 text-[10px] font-mono text-neutral-400 text-center space-y-0.5",children:[A.jsx("div",{className:"font-semibold text-neutral-300",children:"e-trike av • telemetry"}),A.jsx("div",{className:"text-neutral-500",children:"seer engineering monitor"})]})]})};var xS=m_();function vS(s){return typeof s=="object"?s.key:s}function yS(s,e){const t=s.length;return new Proxy(s,{get(i,a,l){if(typeof a=="string"){const c=a.charCodeAt(0);if(c>=48&&c<=57){const d=+a;if(Number.isInteger(d)&&d>=0&&d<t){let h=i[d];if(typeof h!="object"){const f=e[d*2];h=i[d]={index:d,key:h,start:f,size:e[d*2+1],end:f+e[d*2+1],lane:0}}return h}}if(a==="length")return t}return Reflect.get(i,a,l)}})}function Sa(s,e,t){let i=t.initialDeps??[],a,l=!0;function c(){const d=s();return(d.length!==i.length||d.some((f,_)=>i[_]!==f))&&(i=d,a=e(...d),t!=null&&t.onChange&&!(l&&t.skipInitialOnChange)&&t.onChange(a),l=!1),a}return c.updateDeps=d=>{i=d},c}function H0(s,e){if(s===void 0)throw new Error("Unexpected undefined");return s}const V0=(s,e)=>Math.abs(s-e)<1.01,SS=(s,e,t)=>{let i;return Object.assign(function(...a){s.clearTimeout(i),i=s.setTimeout(()=>e.apply(this,a),t)},{cancel:()=>{s.clearTimeout(i)}})};let Bo;const th=()=>{if(Bo!==void 0)return Bo;if(typeof navigator>"u")return Bo=!1;if(/iP(hone|od|ad)/.test(navigator.userAgent))return Bo=!0;const s=navigator.maxTouchPoints;return Bo=navigator.platform==="MacIntel"&&s!==void 0&&s>0},G0=s=>{const{offsetWidth:e,offsetHeight:t}=s;return{width:e,height:t}},MS=s=>s,ES=s=>{const e=Math.max(s.startIndex-s.overscan,0),i=Math.min(s.endIndex+s.overscan,s.count-1)-e+1,a=new Array(i);for(let l=0;l<i;l++)a[l]=e+l;return a},wS=(s,e)=>{const t=s.scrollElement;if(!t)return;const i=s.targetWindow;if(!i)return;const a=c=>{const{width:d,height:h}=c;e({width:Math.round(d),height:Math.round(h)})};if(a(G0(t)),!i.ResizeObserver)return()=>{};const l=new i.ResizeObserver(c=>{const d=()=>{const h=c[0];if(h!=null&&h.borderBoxSize){const f=h.borderBoxSize[0];if(f){a({width:f.inlineSize,height:f.blockSize});return}}a(G0(t))};s.options.useAnimationFrameWithResizeObserver?requestAnimationFrame(d):d()});return l.observe(t,{box:"border-box"}),()=>{l.unobserve(t)}},tu={passive:!0},bS=typeof window>"u"?!0:"onscrollend"in window,TS=(s,e,t)=>{const i=s.scrollElement;if(!i)return;const a=s.targetWindow;if(!a)return;const l=s.options.useScrollendEvent&&bS;let c=0;const d=l?null:SS(a,()=>e(t(i),!1),s.options.isScrollingResetDelay),h=m=>()=>{c=t(i),d==null||d(),e(c,m)},f=h(!0),_=h(!1);return i.addEventListener("scroll",f,tu),l&&i.addEventListener("scrollend",_,tu),()=>{i.removeEventListener("scroll",f),l&&i.removeEventListener("scrollend",_),d==null||d.cancel()}},AS=(s,e)=>TS(s,e,t=>{const{horizontal:i,isRtl:a}=s.options;return i?t.scrollLeft*(a&&-1||1):t.scrollTop}),CS=(s,e,t)=>{if(t.options.useCachedMeasurements){const i=t.indexFromElement(s),a=t.options.getItemKey(i);return t.itemSizeCache.get(a)??t.options.estimateSize(i)}if(e!=null&&e.borderBoxSize){const i=e.borderBoxSize[0];if(i)return Math.round(i[t.options.horizontal?"inlineSize":"blockSize"])}if(!e){const i=t.indexFromElement(s),a=t.options.getItemKey(i),l=t.itemSizeCache.get(a);if(l!==void 0)return l}return s[t.options.horizontal?"offsetWidth":"offsetHeight"]},RS=(s,{adjustments:e=0,behavior:t},i)=>{var a,l;(l=(a=i.scrollElement)==null?void 0:a.scrollTo)==null||l.call(a,{[i.options.horizontal?"left":"top"]:s+e,behavior:t})},PS=RS;function NS(s,e,t,i){if(e===0)return!1;const a=i(0),l=new Set;let c=0;for(;c<s;){const h=t(c);if(h===a)break;l.add(h),c++}const d=s-c;if(d===0||d>=e)return!1;for(let h=0;h<d;h++)if(i(h)!==t(c+h))return!1;for(let h=d;h<e;h++)if(l.has(i(h)))return!1;return!0}class LS{constructor(e){this.unsubs=[],this.scrollElement=null,this.targetWindow=null,this.isScrolling=!1,this.scrollState=null,this.measurementsCache=[],this._singleLaneMeasurements=null,this.itemSizeCache=new Map,this.itemSizeCacheVersion=0,this.laneAssignments=new Map,this.pendingMin=null,this.prevLanes=void 0,this.lanesChangedFlag=!1,this.lanesSettling=!1,this.pendingScrollAnchor=null,this.scrollRect=null,this.scrollOffset=null,this.scrollDirection=null,this.scrollAdjustments=0,this._iosDeferredAdjustment=0,this._iosTouching=!1,this._iosJustTouchEnded=!1,this._iosTouchEndTimerId=null,this._intendedScrollOffset=null,this._clampedAdjustment=null,this.elementsCache=new Map,this.now=()=>{var t,i,a;return((a=(i=(t=this.targetWindow)==null?void 0:t.performance)==null?void 0:i.now)==null?void 0:a.call(i))??Date.now()},this.observer=(()=>{let t=null;const i=()=>t||(!this.targetWindow||!this.targetWindow.ResizeObserver?null:t=new this.targetWindow.ResizeObserver(a=>{a.forEach(l=>{const c=()=>{const d=l.target,h=this.indexFromElement(d);if(!d.isConnected){this.observer.unobserve(d);for(const[f,_]of this.elementsCache)if(_===d){this.elementsCache.delete(f);break}return}this.isIndexInRange(h)&&this.shouldMeasureDuringScroll(h)&&this.resizeItem(h,this.options.measureElement(d,l,this))};this.options.useAnimationFrameWithResizeObserver?requestAnimationFrame(c):c()})}));return{disconnect:()=>{var a;(a=i())==null||a.disconnect(),t=null},observe:a=>{var l;return(l=i())==null?void 0:l.observe(a,{box:"border-box"})},unobserve:a=>{var l;return(l=i())==null?void 0:l.unobserve(a)}}})(),this.range=null,this.setOptions=t=>{var i;const a={debug:!1,initialOffset:0,overscan:1,paddingStart:0,paddingEnd:0,scrollPaddingStart:0,scrollPaddingEnd:0,horizontal:!1,getItemKey:MS,rangeExtractor:ES,onChange:()=>{},measureElement:CS,initialRect:{width:0,height:0},scrollMargin:0,gap:0,indexAttribute:"data-index",initialMeasurementsCache:[],lanes:1,anchorTo:"start",followOnAppend:!1,scrollEndThreshold:1,isScrollingResetDelay:150,enabled:!0,isRtl:!1,useScrollendEvent:!1,useAnimationFrameWithResizeObserver:!1,laneAssignmentMode:"estimate",useCachedMeasurements:!1};for(const m in t){const g=t[m];g!==void 0&&(a[m]=g)}const l=this.options;let c=null,d=null,h=!1;if(l!==void 0&&l.enabled&&a.enabled&&a.anchorTo==="end"&&this.scrollElement!==null){const m=l.count,g=a.count,y=this.getMeasurements(),M=((i=this._singleLaneMeasurements)==null?void 0:i.items)??y,b=T=>vS(M[T]),S=m>0?b(0):null,v=m>0?b(m-1):null;if(g!==m||m>0&&g>0&&(a.getItemKey(0)!==S||a.getItemKey(g-1)!==v)){h=!0;const T=m>0?this.getVirtualItemForOffset(this.getScrollOffset())??y[0]:null;T&&(c=[T.key,this.getScrollOffset()-T.start]);const N=a.followOnAppend===!0?"auto":a.followOnAppend||null;N&&g>0&&this.isAtEnd(l.scrollEndThreshold)&&(m===0||a.getItemKey(g-1)!==v)&&(g>m||NS(m,g,b,a.getItemKey))&&(d=N)}}this.options=a,h&&(this.pendingMin=0,this.itemSizeCacheVersion++);let f=!1,_=0;if(c&&this.scrollOffset!==null){const[m,g]=c,y=this.getMeasurements(),{count:M,getItemKey:b}=this.options;let S=0;for(;S<M&&b(S)!==m;)S++;if(S<M){const v=y[S];if(v){const R=Math.max(0,v.start+g);!d&&R!==this.scrollOffset&&(_=R-this.scrollOffset,this.scrollOffset=R,f=!0)}}}(f||d)&&(this.pendingScrollAnchor=[f?c[0]:null,f?c[1]:0,d,_])},this.notify=t=>{var i,a;(a=(i=this.options).onChange)==null||a.call(i,this,t)},this.maybeNotify=Sa(()=>(this.calculateRange(),[this.isScrolling,this.range?this.range.startIndex:null,this.range?this.range.endIndex:null]),t=>{this.notify(t)},{key:!1,debug:()=>this.options.debug,initialDeps:[this.isScrolling,this.range?this.range.startIndex:null,this.range?this.range.endIndex:null]}),this.cleanup=()=>{this.unsubs.filter(Boolean).forEach(t=>t()),this.unsubs=[],this.observer.disconnect(),this.rafId!=null&&this.targetWindow&&(this.targetWindow.cancelAnimationFrame(this.rafId),this.rafId=null),this.scrollState=null,this.isScrolling=!1,this.scrollDirection=null,this._iosDeferredAdjustment=0,this._iosTouching=!1,this._iosJustTouchEnded=!1,this._clampedAdjustment=null,this.scrollElement=null,this.targetWindow=null},this._didMount=()=>()=>{this.cleanup()},this._willUpdate=()=>{var t,i;const a=this.options.enabled?this.options.getScrollElement():null;if(this.scrollElement!==a){if(this.cleanup(),!a){this.maybeNotify();return}if(this.scrollElement=a,this.scrollElement&&"ownerDocument"in this.scrollElement?this.targetWindow=this.scrollElement.ownerDocument.defaultView:this.targetWindow=((t=this.scrollElement)==null?void 0:t.window)??null,this.elementsCache.forEach(c=>{this.observer.observe(c)}),this.unsubs.push(this.options.observeElementRect(this,c=>{this.scrollRect=c,this.maybeNotify()})),this.unsubs.push(this.options.observeElementOffset(this,(c,d)=>{if(d&&this._intendedScrollOffset===null&&c===this.scrollOffset)return;this._intendedScrollOffset!==null&&Math.abs(c-this._intendedScrollOffset)<1.5&&(c=this._intendedScrollOffset),this._intendedScrollOffset=null,this._clampedAdjustment!==null&&Math.abs(c-this._clampedAdjustment.maxAtWrite)>=1.5&&(this._clampedAdjustment=null),this.scrollAdjustments=0;const h=this.getScrollOffset();this.scrollDirection=d?h===c?this.scrollDirection:h<c?"forward":"backward":null,this.scrollOffset=c,this.isScrolling=d,this._flushIosDeferredIfReady(),this.scrollState&&this.scheduleScrollReconcile(),this.maybeNotify()})),"addEventListener"in this.scrollElement){const c=this.scrollElement,d=()=>{this._iosTouching=!0,this._iosJustTouchEnded=!1,this._iosTouchEndTimerId!==null&&this.targetWindow!=null&&(this.targetWindow.clearTimeout(this._iosTouchEndTimerId),this._iosTouchEndTimerId=null)},h=()=>{this._iosTouching=!1,!(!th()||this.targetWindow==null)&&(this._iosJustTouchEnded=!0,this._iosTouchEndTimerId=this.targetWindow.setTimeout(()=>{this._iosJustTouchEnded=!1,this._iosTouchEndTimerId=null,this._flushIosDeferredIfReady()},150))};c.addEventListener("touchstart",d,tu),c.addEventListener("touchend",h,tu),this.unsubs.push(()=>{c.removeEventListener("touchstart",d),c.removeEventListener("touchend",h),this._iosTouchEndTimerId!==null&&this.targetWindow!=null&&(this.targetWindow.clearTimeout(this._iosTouchEndTimerId),this._iosTouchEndTimerId=null)})}this._scrollToOffset(this.getScrollOffset(),{adjustments:void 0,behavior:void 0})}const l=this.pendingScrollAnchor;if(this.pendingScrollAnchor=null,l&&this.scrollElement&&this.options.enabled){const[c,d,h,f]=l;c!==null&&!h&&(th()&&(this.isScrolling||this._iosTouching||this._iosJustTouchEnded)?f!==0&&(this._iosDeferredAdjustment+=f):((i=this.scrollState)==null?void 0:i.behavior)==="smooth"&&!V0(this.getScrollOffset()-f,this.scrollState.lastTargetOffset)||this._scrollToOffset(this.getScrollOffset(),{adjustments:void 0,behavior:void 0})),h&&this.scrollToEnd({behavior:h})}this._retryClampedAdjustment()},this._retryClampedAdjustment=()=>{if(this._clampedAdjustment===null||!this.scrollElement||!this.options.enabled)return;const{target:t,maxAtWrite:i}=this._clampedAdjustment,a=this.getMaxScrollOffset();a>i+.5&&(this._clampedAdjustment=t>a+.5?{target:t,maxAtWrite:a}:null,this._scrollToOffset(t,{adjustments:void 0,behavior:void 0}))},this._flushIosDeferredIfReady=()=>{if(this._iosDeferredAdjustment===0||this.isScrolling||this._iosTouching||this._iosJustTouchEnded)return;const t=this.getScrollOffset(),i=this.getMaxScrollOffset();if(t<0||t>i)return;if(this._iosDeferredAdjustment<0&&t>=i-1){this._iosDeferredAdjustment=0;return}const a=this._iosDeferredAdjustment;this._iosDeferredAdjustment=0,this._scrollToOffset(t,{adjustments:this.scrollAdjustments+=a,behavior:void 0})},this.rafId=null,this.getSize=()=>this.options.enabled?(this.scrollRect=this.scrollRect??this.options.initialRect,this.scrollRect[this.options.horizontal?"width":"height"]):(this.scrollRect=null,0),this.getScrollOffset=()=>this.options.enabled?(this.scrollOffset=this.scrollOffset??(typeof this.options.initialOffset=="function"?this.options.initialOffset():this.options.initialOffset),this.scrollOffset):(this.scrollOffset=null,0),this.getMeasurementOptions=Sa(()=>[this.options.count,this.options.paddingStart,this.options.scrollMargin,this.options.getItemKey,this.options.enabled,this.options.lanes,this.options.laneAssignmentMode,this.options.gap],(t,i,a,l,c,d,h,f)=>(this.prevLanes!==void 0&&this.prevLanes!==d&&(this.lanesChangedFlag=!0),this.prevLanes=d,this.pendingMin=null,{count:t,paddingStart:i,scrollMargin:a,getItemKey:l,enabled:c,lanes:d,laneAssignmentMode:h,gap:f}),{key:!1}),this.isIndexInRange=t=>t>=0&&t<this.options.count,this.getMeasurements=Sa(()=>[this.getMeasurementOptions(),this.itemSizeCacheVersion],({count:t,paddingStart:i,scrollMargin:a,getItemKey:l,enabled:c,lanes:d,laneAssignmentMode:h,gap:f},_)=>{var m;const g=this.itemSizeCache;if(!c)return this.measurementsCache=[],this._singleLaneMeasurements=null,this.itemSizeCache.clear(),this.laneAssignments.clear(),[];if(this.laneAssignments.size>t)for(const R of this.laneAssignments.keys())R>=t&&this.laneAssignments.delete(R);this.lanesChangedFlag&&(this.lanesChangedFlag=!1,this.lanesSettling=!0,this.measurementsCache=[],this._singleLaneMeasurements=null,this.itemSizeCache.clear(),this.laneAssignments.clear(),this.pendingMin=null),this.measurementsCache.length===0&&!this.lanesSettling&&(this.measurementsCache=this.options.initialMeasurementsCache,this.measurementsCache.forEach(R=>{this.itemSizeCache.set(R.key,R.size)}));const y=this.lanesSettling?0:this.pendingMin??0;if(this.pendingMin=null,this.lanesSettling&&this.measurementsCache.length===t&&(this.lanesSettling=!1),d===1){const R=t*2;let I=(m=this._singleLaneMeasurements)==null?void 0:m.flat;if(!I||I.length<R){const U=new Float64Array(R);I&&y>0&&U.set(I.subarray(0,y*2)),I=U}const T=y===0?new Array(t):this._singleLaneMeasurements.items.slice();let N;if(y===0)N=i+a;else{const U=y-1;N=I[U*2]+I[U*2+1]+f}for(let U=y;U<t;U++){const w=l(U);T[U]=w;const D=g.get(w),B=typeof D=="number"?D:this.options.estimateSize(U);I[U*2]=N,I[U*2+1]=B,N+=B+f}this._singleLaneMeasurements={flat:I,items:T};const L=yS(T,I);return this.measurementsCache=L,L}const M=this.measurementsCache.slice(0,y),b=new Array(d).fill(void 0),S=new Float64Array(d);let v=0;for(let R=0;R<y;R++){const I=M[R];I&&(b[I.lane]===void 0&&v++,b[I.lane]=R,S[I.lane]=I.end)}for(let R=y;R<t;R++){const I=l(R),T=this.laneAssignments.get(R);let N,L;const U=h==="estimate"||g.has(I);if(T!==void 0&&this.options.lanes>1){N=T;const z=b[N],j=z!==void 0?M[z]:void 0;L=j?j.end+f:i+a}else if(v===d){let z=0,j=S[0],te=b[0];for(let V=1;V<d;V++){const Q=S[V];(Q<j||Q===j&&b[V]<te)&&(z=V,j=Q,te=b[V])}N=z,L=j+f,U&&this.laneAssignments.set(R,N)}else N=R%this.options.lanes,L=i+a,U&&this.laneAssignments.set(R,N);const w=g.get(I),D=typeof w=="number"?w:this.options.estimateSize(R),B=L+D;M[R]={index:R,start:L,size:D,end:B,key:I,lane:N},b[N]===void 0&&v++,b[N]=R,S[N]=B}return this.measurementsCache=M,M},{key:!1,debug:()=>this.options.debug}),this.calculateRange=Sa(()=>[this.getMeasurements(),this.getSize(),this.getScrollOffset(),this.options.lanes],(t,i,a,l)=>t.length===0||i===0?(this.range=null,null):(this.range=IS(t,i,a,l,l===1&&this._singleLaneMeasurements!==null?this._singleLaneMeasurements.flat:null),this.range),{key:!1,debug:()=>this.options.debug}),this.getVirtualIndexes=Sa(()=>{let t=null,i=null;const a=this.calculateRange();return a&&(t=a.startIndex,i=a.endIndex),this.maybeNotify.updateDeps([this.isScrolling,t,i]),[this.options.rangeExtractor,this.options.overscan,this.options.count,t,i]},(t,i,a,l,c)=>l===null||c===null?[]:t({startIndex:l,endIndex:c,overscan:i,count:a}),{key:!1,debug:()=>this.options.debug}),this.indexFromElement=t=>{const i=this.options.indexAttribute,a=t.getAttribute(i);return a?parseInt(a,10):(console.warn(`Missing attribute name '${i}={index}' on measured element.`),-1)},this.shouldMeasureDuringScroll=t=>{var i;if(!this.scrollState||this.scrollState.behavior!=="smooth")return!0;const a=this.scrollState.index??((i=this.getVirtualItemForOffset(this.scrollState.lastTargetOffset))==null?void 0:i.index);if(a!==void 0&&this.range){const l=Math.max(this.options.overscan,Math.ceil((this.range.endIndex-this.range.startIndex)/2)),c=Math.max(0,a-l),d=Math.min(this.options.count-1,a+l);return t>=c&&t<=d}return!0},this.measureElement=t=>{if(!t){this.elementsCache.forEach((c,d)=>{c.isConnected||(this.observer.unobserve(c),this.elementsCache.delete(d))});return}const i=this.indexFromElement(t);if(!this.isIndexInRange(i))return;const a=this.options.getItemKey(i),l=this.elementsCache.get(a);l!==t&&(l&&this.observer.unobserve(l),this.observer.observe(t),this.elementsCache.set(a,t)),(!this.isScrolling||this.scrollState)&&this.shouldMeasureDuringScroll(i)&&this.resizeItem(i,this.options.measureElement(t,void 0,this))},this.resizeItem=(t,i)=>{var a,l,c;if(!this.isIndexInRange(t))return;let d,h,f;const _=(a=this._singleLaneMeasurements)==null?void 0:a.flat;if(this.options.lanes===1&&_!=null)f=this.options.getItemKey(t),h=_[t*2],d=_[t*2+1];else{const y=this.measurementsCache[t];if(!y)return;f=y.key,h=y.start,d=y.size}const m=this.itemSizeCache.get(f)??d,g=i-m;if(g!==0){const y=this.options.anchorTo==="end"&&((l=this.scrollState)==null?void 0:l.behavior)!=="smooth"&&this.getVirtualDistanceFromEnd()<=this.options.scrollEndThreshold,M=y?this.getTotalSize():0,b=this.getScrollOffset()+this.scrollAdjustments,v=!this.itemSizeCache.has(f)?h<b:h+m<=b&&this.scrollDirection!=="backward",R=((c=this.scrollState)==null?void 0:c.behavior)!=="smooth"&&(this.shouldAdjustScrollPositionOnItemSizeChange!==void 0?this.shouldAdjustScrollPositionOnItemSizeChange(this.measurementsCache[t]??{index:t,key:f,start:h,size:d,end:h+d,lane:0},g,this):v);(this.pendingMin===null||t<this.pendingMin)&&(this.pendingMin=t),this.itemSizeCache.set(f,i),this.itemSizeCacheVersion++;let I=!1;y?I=this.applyScrollAdjustment(this.getTotalSize()-M):R&&(I=this.applyScrollAdjustment(g)),this.notify(I),this._retryClampedAdjustment()}},this.getVirtualItems=Sa(()=>[this.getVirtualIndexes(),this.getMeasurements()],(t,i)=>{const a=[];for(let l=0,c=t.length;l<c;l++){const d=t[l],h=i[d];a.push(h)}return a},{key:!1,debug:()=>this.options.debug}),this.getVirtualItemForOffset=t=>{var i;const a=this.getMeasurements();if(a.length===0)return;const l=(i=this._singleLaneMeasurements)==null?void 0:i.flat,c=this.options.lanes===1&&l!=null,d=T_(0,a.length-1,c?h=>l[h*2]:h=>H0(a[h]).start,t);return H0(a[d])},this.getMaxScrollOffset=()=>{if(!this.scrollElement)return 0;if("scrollHeight"in this.scrollElement)return this.options.horizontal?this.scrollElement.scrollWidth-this.scrollElement.clientWidth:this.scrollElement.scrollHeight-this.scrollElement.clientHeight;{const t=this.scrollElement.document.documentElement;return this.options.horizontal?t.scrollWidth-this.scrollElement.innerWidth:t.scrollHeight-this.scrollElement.innerHeight}},this.getVirtualDistanceFromEnd=()=>Math.max(this.getTotalSize()-this.getSize()-this.getScrollOffset(),0),this.getDistanceFromEnd=()=>Math.max(this.getMaxScrollOffset()-this.getScrollOffset(),0),this.isAtEnd=(t=this.options.scrollEndThreshold)=>this.getDistanceFromEnd()<=t,this.getOffsetForAlignment=(t,i,a=0)=>{if(!this.scrollElement)return 0;const l=this.getSize(),c=this.getScrollOffset();i==="auto"&&(i=t>=c+l?"end":"start"),i==="center"?t+=(a-l)/2:i==="end"&&(t-=l);const d=this.getMaxScrollOffset();return Math.max(Math.min(d,t),0)},this.getOffsetForIndex=(t,i="auto")=>{t=Math.max(0,Math.min(t,this.options.count-1));const a=this.getSize(),l=this.getScrollOffset(),c=this.measurementsCache[t];if(!c)return;if(i==="auto")if(c.end>=l+a-this.options.scrollPaddingEnd)i="end";else if(c.start<=l+this.options.scrollPaddingStart)i="start";else return[l,i];if(i==="end"&&t===this.options.count-1)return[this.getMaxScrollOffset(),i];const d=i==="end"?c.end+this.options.scrollPaddingEnd:c.start-this.options.scrollPaddingStart;return[this.getOffsetForAlignment(d,i,c.size),i]},this.scrollToOffset=(t,{align:i="start",behavior:a="auto"}={})=>{this._iosDeferredAdjustment=0;const l=this.getOffsetForAlignment(t,i),c=this.now();this.scrollState={index:null,align:i,behavior:a,startedAt:c,lastTargetOffset:l,stableFrames:0},this._scrollToOffset(l,{adjustments:void 0,behavior:a}),this.scheduleScrollReconcile()},this.scrollToIndex=(t,{align:i="auto",behavior:a="auto"}={})=>{this._iosDeferredAdjustment=0,t=Math.max(0,Math.min(t,this.options.count-1));const l=this.getOffsetForIndex(t,i);if(!l)return;const[c,d]=l,h=this.now();this.scrollState={index:t,align:d,behavior:a,startedAt:h,lastTargetOffset:c,stableFrames:0},this._scrollToOffset(c,{adjustments:void 0,behavior:a}),this.scheduleScrollReconcile()},this.scrollBy=(t,{behavior:i="auto"}={})=>{const a=this.getScrollOffset()+t,l=this.now();this.scrollState={index:null,align:"start",behavior:i,startedAt:l,lastTargetOffset:a,stableFrames:0},this._scrollToOffset(a,{adjustments:void 0,behavior:i}),this.scheduleScrollReconcile()},this.scrollToEnd=({behavior:t="auto"}={})=>{if(this.options.count>0){this.scrollToIndex(this.options.count-1,{align:"end",behavior:t});return}this.scrollToOffset(Math.max(this.getTotalSize()-this.getSize(),0),{behavior:t})},this.getTotalSize=()=>{var t,i;const a=this.getMeasurements();let l;if(a.length===0)l=this.options.paddingStart;else if(this.options.lanes===1){const c=a.length-1,d=(t=this._singleLaneMeasurements)==null?void 0:t.flat;d!=null?l=d[c*2]+d[c*2+1]:l=((i=a[c])==null?void 0:i.end)??0}else{const c=Array(this.options.lanes).fill(null);let d=a.length-1;for(;d>=0&&c.some(h=>h===null);){const h=a[d];c[h.lane]===null&&(c[h.lane]=h.end),d--}l=Math.max(...c.filter(h=>h!==null))}return Math.max(l-this.options.scrollMargin+this.options.paddingEnd,0)},this.takeSnapshot=()=>{const t=[];if(this.itemSizeCache.size===0)return t;const i=this.getMeasurements();for(const a of i)a&&this.itemSizeCache.has(a.key)&&t.push({index:a.index,key:a.key,start:a.start,size:a.size,end:a.end,lane:a.lane});return t},this._scrollToOffset=(t,{adjustments:i,behavior:a})=>{this._intendedScrollOffset=t+(i??0),this.options.scrollToFn(t,{behavior:a,adjustments:i},this)},this.measure=()=>{this.pendingMin=null,this.itemSizeCache.clear(),this.laneAssignments.clear(),this.itemSizeCacheVersion++,this.notify(!1)},this.setOptions(e)}applyScrollAdjustment(e,t){if(e===0)return!1;if(th()&&(this.isScrolling||this._iosTouching||this._iosJustTouchEnded))return this._iosDeferredAdjustment+=e,!1;{const i=this.getScrollOffset()+this.scrollAdjustments+e,a=this.scrollElement,l=a!==null&&("scrollHeight"in a||"document"in a)?this.getMaxScrollOffset():null;return this._clampedAdjustment=l!==null&&i>l+.5?{target:i,maxAtWrite:l}:null,this._scrollToOffset(this.getScrollOffset(),{adjustments:this.scrollAdjustments+=e,behavior:t}),this.scrollOffset!==null&&(this.scrollOffset+=this.scrollAdjustments,this.scrollOffset<0&&(this.scrollOffset=0),this.scrollAdjustments=0),!0}}scheduleScrollReconcile(){if(!this.targetWindow){this.scrollState=null;return}this.rafId==null&&(this.rafId=this.targetWindow.requestAnimationFrame(()=>{this.rafId=null,this.reconcileScroll()}))}reconcileScroll(){if(!this.scrollState||!this.scrollElement)return;if(this.now()-this.scrollState.startedAt>5e3){this.scrollState=null;return}const i=this.scrollState.index!=null?this.getOffsetForIndex(this.scrollState.index,this.scrollState.align):void 0,a=i?i[0]:this.scrollState.lastTargetOffset,l=1,c=a!==this.scrollState.lastTargetOffset;if(!c&&V0(a,this.getScrollOffset())){if(this.scrollState.stableFrames++,this.scrollState.stableFrames>=l){this.getScrollOffset()!==a&&this._scrollToOffset(a,{adjustments:void 0,behavior:"auto"}),this.scrollState=null;return}}else if(this.scrollState.stableFrames=0,c){const d=this.getSize()||600,h=Math.abs(a-this.getScrollOffset()),f=this.scrollState.behavior==="smooth"&&h>d;this.scrollState.lastTargetOffset=a,f||(this.scrollState.behavior="auto"),this._scrollToOffset(a,{adjustments:void 0,behavior:f?"smooth":"auto"})}this.scheduleScrollReconcile()}}const T_=(s,e,t,i)=>{for(;s<=e;){const a=(s+e)/2|0,l=t(a);if(l<i)s=a+1;else if(l>i)e=a-1;else return a}return s>0?s-1:0};function DS(s,e,t){let i=0;for(;i<=e;){const a=(i+e)/2|0,l=s[a*2];if(l<t)i=a+1;else if(l>t)e=a-1;else return a}return i>0?i-1:0}function IS(s,e,t,i,a){const l=s.length-1;if(s.length<=i)return{startIndex:0,endIndex:l};if(i===1&&a!==null){const f=DS(a,l,t);let _=f;const m=t+e;for(;_<l&&a[_*2]+a[_*2+1]<m;)_++;return{startIndex:f,endIndex:_}}let d=T_(0,l,f=>s[f].start,t),h=d;if(i===1)for(;h<l&&s[h].end<t+e;)h++;else if(i>1){const f=Array(i).fill(0);for(;h<l&&f.some(m=>m<t+e);){const m=s[h];f[m.lane]=m.end,h++}const _=Array(i).fill(t+e);for(;d>=0&&_.some(m=>m>=t);){const m=s[d];_[m.lane]=m.start,d--}d=Math.max(0,d-d%i),h=Math.min(l,h+(i-1-h%i))}return{startIndex:d,endIndex:h}}const nh=typeof document<"u"?an.useLayoutEffect:an.useEffect;function US({useFlushSync:s=!0,directDomUpdates:e=!1,directDomUpdatesMode:t="transform",...i}){const a=an.useReducer(m=>m+1,0)[1],l=an.useRef({enabled:e,mode:t,container:null,lastSize:null,lastPositions:new WeakMap,prevRange:null});l.current.enabled=e,l.current.mode=t;const c=an.useRef(!1),d=m=>{const g=l.current;if(!g.enabled||!g.container)return;const y=m.getTotalSize();if(y!==g.lastSize){g.lastSize=y;const M=m.options.horizontal?"width":"height";g.container.style[M]=`${y}px`}},h=m=>{const g=l.current;if(!g.enabled||!g.container)return;d(m);const y=!!m.options.horizontal,M=g.mode==="transform",b=y?"left":"top",S=m.options.scrollMargin,v=m.getVirtualItems();for(const R of v){const I=R.start-S,T=m.elementsCache.get(R.key);T&&g.lastPositions.get(T)!==I&&(g.lastPositions.set(T,I),M?T.style.transform=y?`translate3d(${I}px, 0, 0)`:`translate3d(0, ${I}px, 0)`:T.style[b]=`${I}px`)}},f={...i,onChange:(m,g)=>{var y;const M=l.current;let b=!0;if(M.enabled){h(m);const S=m.range,v=M.prevRange;b=!v||v.isScrolling!==m.isScrolling||v.startIndex!==(S==null?void 0:S.startIndex)||v.endIndex!==(S==null?void 0:S.endIndex),b&&(M.prevRange=S?{startIndex:S.startIndex,endIndex:S.endIndex,isScrolling:m.isScrolling}:null)}b&&(s&&g&&!c.current?xS.flushSync(a):a()),(y=i.onChange)==null||y.call(i,m,g)}},[_]=an.useState(()=>{const m=new LS(f),g=m.measureElement;return m.measureElement=y=>{c.current=!0;try{g(y)}finally{c.current=!1}},Object.assign(m,{containerRef:y=>{const M=l.current;if(M.container=y,M.lastSize=null,y&&M.enabled){const b=m.getTotalSize();M.lastSize=b;const S=m.options.horizontal?"width":"height";y.style[S]=`${b}px`}}})});return _.setOptions(f),nh(()=>_._didMount(),[]),nh(()=>(d(_),_._willUpdate())),nh(()=>{h(_)}),_}function FS(s){return US({observeElementRect:wS,observeElementOffset:AS,scrollToFn:PS,...s})}const OS=()=>{const{catalog:s,framesById:e,selectedCanId:t,selectMessage:i,filterAccess:a,filterBus:l,searchQuery:c}=vn(),d=an.useRef(null),[h,f]=ds.useState("id"),[_,m]=ds.useState("asc"),g=v=>{h===v?m(R=>R==="asc"?"desc":"asc"):(f(v),m(v==="rate"||v==="count"?"desc":"asc"))},y=an.useMemo(()=>{const v=c.trim().toLowerCase();return s.filter(R=>{if(a!=="all"&&R.access.toLowerCase()!==a||l!=="all"&&R.bus.toLowerCase()!==l)return!1;if(v){const I=R.id_hex.toLowerCase(),T=R.id.toString(),N=R.key.toLowerCase(),L=R.name.toLowerCase();if(!I.includes(v)&&!T.includes(v)&&!N.includes(v)&&!L.includes(v))return!1}return!0})},[s,a,l,c]),M=an.useMemo(()=>{const v=[...y],R=_==="asc"?1:-1;return v.sort((I,T)=>{var N,L,U,w;switch(h){case"id":return(I.id-T.id)*R;case"name":return(I.name||I.key).localeCompare(T.name||T.key)*R;case"access":return I.access.localeCompare(T.access)*R;case"bus":return I.bus.localeCompare(T.bus)*R;case"cycle_ms":return(I.cycle_ms-T.cycle_ms)*R;case"rate":{const D=((N=e[I.id])==null?void 0:N.rate_hz)||0,B=((L=e[T.id])==null?void 0:L.rate_hz)||0;return(D-B)*R}case"count":{const D=((U=e[I.id])==null?void 0:U.count)||0,B=((w=e[T.id])==null?void 0:w.count)||0;return(D-B)*R}default:return 0}}),v},[y,h,_,e]),b=FS({count:M.length,getScrollElement:()=>d.current,estimateSize:()=>40,overscan:10}),S=v=>h!==v?A.jsx("span",{className:"text-[8px] text-neutral-600 ml-1",children:"⇅"}):A.jsx("span",{className:"text-[9px] text-cyan-400 font-bold ml-1",children:_==="asc"?"▲":"▼"});return A.jsxs("div",{className:"flex-1 flex flex-col min-w-0 bg-black border-r border-neutral-800 h-full overflow-hidden",children:[A.jsxs("div",{className:"h-8 bg-[#0a0a0a] border-b border-neutral-800 px-3 flex items-center text-[10px] font-mono font-bold uppercase text-neutral-400 select-none shrink-0 tracking-wider",children:[A.jsxs("div",{onClick:()=>g("access"),className:"w-12 shrink-0 text-center cursor-pointer hover:text-cyan-300 flex items-center justify-center transition-colors",title:"Sort by Access (TX/RX)",children:[A.jsx("span",{children:"ACC"}),S("access")]}),A.jsxs("div",{onClick:()=>g("id"),className:"w-20 shrink-0 cursor-pointer hover:text-cyan-300 flex items-center transition-colors",title:"Sort by CAN Identifier",children:[A.jsx("span",{children:"CAN ID"}),S("id")]}),A.jsxs("div",{onClick:()=>g("name"),className:"flex-1 min-w-[140px] cursor-pointer hover:text-cyan-300 flex items-center transition-colors",title:"Sort by Message Name",children:[A.jsx("span",{children:"MESSAGE NAME"}),S("name")]}),A.jsxs("div",{onClick:()=>g("bus"),className:"w-14 shrink-0 text-center cursor-pointer hover:text-cyan-300 flex items-center justify-center transition-colors",title:"Sort by CAN Bus",children:[A.jsx("span",{children:"BUS"}),S("bus")]}),A.jsxs("div",{onClick:()=>g("cycle_ms"),className:"w-14 shrink-0 text-right cursor-pointer hover:text-cyan-300 flex items-center justify-end transition-colors",title:"Sort by Cycle Time (ms)",children:[A.jsx("span",{children:"CYC"}),S("cycle_ms")]}),A.jsxs("div",{onClick:()=>g("rate"),className:"w-14 shrink-0 text-right cursor-pointer hover:text-cyan-300 flex items-center justify-end transition-colors",title:"Sort by Live Frequency (Hz)",children:[A.jsx("span",{children:"RATE"}),S("rate")]}),A.jsxs("div",{onClick:()=>g("count"),className:"w-16 shrink-0 text-right cursor-pointer hover:text-cyan-300 flex items-center justify-end transition-colors",title:"Sort by Total Frame Count",children:[A.jsx("span",{children:"COUNT"}),S("count")]}),A.jsx("div",{className:"w-52 shrink-0 pl-3",children:"DATA PAYLOAD (HEX)"})]}),A.jsx("div",{ref:d,className:"flex-1 overflow-y-auto min-h-0 divide-y divide-neutral-900",children:M.length===0?A.jsx("div",{className:"h-48 flex items-center justify-center text-xs font-mono text-neutral-500",children:"No CAN messages match the current filter"}):A.jsx("div",{style:{height:`${b.getTotalSize()}px`,width:"100%",position:"relative"},children:b.getVirtualItems().map(v=>{var U;const R=M[v.index],I=e[R.id],T=R.id===t;let N=[];I&&I.data_hex&&(I.data_hex.includes(" ")?N=I.data_hex.trim().split(/\s+/):N=I.data_hex.match(/.{1,2}/g)||[]);const L=Array.from({length:8},(w,D)=>D<N.length?N[D].padStart(2,"0").toUpperCase():"--");return A.jsxs("div",{onClick:()=>i(R.id),style:{position:"absolute",top:0,left:0,width:"100%",height:`${v.size}px`,transform:`translateY(${v.start}px)`},className:`flex items-center px-3 text-xs font-mono cursor-pointer transition-colors border-l-4 ${T?"bg-[#141414] text-white border-l-cyan-400 font-medium":"hover:bg-[#0f0f0f] text-neutral-300 border-l-transparent"}`,children:[A.jsx("div",{className:"w-12 shrink-0 text-center",children:A.jsx("span",{className:`text-[9px] font-bold px-1.5 py-0.5 rounded ${R.access==="RX"?"bg-emerald-500/15 text-emerald-300 border border-emerald-500/30":"bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"}`,children:R.access})}),A.jsxs("div",{className:"w-20 shrink-0 flex flex-col justify-center",children:[A.jsx("span",{className:"font-bold text-neutral-100 tracking-wide",children:R.id_hex}),A.jsxs("span",{className:"text-[10px] text-neutral-500",children:["#",R.id]})]}),A.jsxs("div",{className:"flex-1 min-w-[140px] truncate pr-2",children:[A.jsx("div",{className:"truncate font-bold text-neutral-100",title:R.name,children:R.key}),A.jsxs("div",{className:"text-[10px] text-neutral-500 truncate",children:[R.sender," → ",((U=R.receivers)==null?void 0:U.join(", "))||"ALL"]})]}),A.jsx("div",{className:"w-14 shrink-0 text-center",children:A.jsx("span",{className:`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${R.bus.toLowerCase()==="high"?"bg-purple-950/60 text-purple-300 border border-purple-800/60":"bg-neutral-900 text-neutral-300 border border-neutral-800"}`,children:R.bus.toUpperCase()})}),A.jsx("div",{className:"w-14 shrink-0 text-right text-neutral-300 text-[11px] tabular-nums font-semibold",children:R.cycle_ms?`${R.cycle_ms}ms`:"—"}),A.jsx("div",{className:"w-14 shrink-0 text-right tabular-nums text-[11px]",children:I&&I.rate_hz>0?A.jsxs("span",{className:"text-emerald-400 font-bold",children:[I.rate_hz.toFixed(1)," ",A.jsx("span",{className:"text-[9px] text-neutral-500 font-normal",children:"Hz"})]}):A.jsx("span",{className:"text-neutral-600",children:"0.0"})}),A.jsx("div",{className:"w-16 shrink-0 text-right tabular-nums text-neutral-400 text-[11px] font-medium",children:I?I.count.toLocaleString():"0"}),A.jsx("div",{className:"w-52 shrink-0 pl-3 flex items-center gap-1 font-mono text-[11px]",children:L.map((w,D)=>A.jsx("span",{className:`px-1 py-0.5 rounded text-center min-w-[20px] ${w==="--"?"text-neutral-700 bg-neutral-950":T?"text-cyan-200 font-bold bg-cyan-950 border border-cyan-800":"text-neutral-200 bg-[#121212] font-semibold border border-neutral-800"}`,children:w},D))})]},R.id)})})}),A.jsxs("div",{className:"h-6 bg-[#0a0a0a] border-t border-neutral-800 px-3 flex items-center justify-between text-[10px] font-mono text-neutral-400 select-none shrink-0",children:[A.jsxs("span",{children:["Showing ",A.jsx("strong",{className:"text-neutral-200",children:y.length})," of"," ",A.jsx("strong",{className:"text-neutral-200",children:s.length})," messages"]}),A.jsx("span",{className:"text-neutral-500",children:"Click a message row to inspect payload matrix"})]})]})},kS=()=>{const{catalog:s,selectedCanId:e,framesById:t,hoveredSignal:i,setHoveredSignal:a}=vn(),l=s.find(_=>_.id===e),c=t[e],d=(l==null?void 0:l.dlc)??8,h=Array.from({length:8},()=>[]);if(c&&c.bit_cells&&c.bit_cells.length===64)for(const _ of c.bit_cells)h[_.byte].push(_);else{const _=(l==null?void 0:l.signals)||[];for(let m=0;m<8;m++)for(let g=0;g<8;g++){let y=null,M=null;for(const b of _){const S=m*8+g,v=b.byte*8+b.bit,R=v+b.bits;if(S>=v&&S<R){y=b.name,M=b.color;break}}h[m].push({index:m*8+g,byte:m,bit:g,val:0,owner:y,color:M})}}for(let _=0;_<8;_++)h[_].sort((m,g)=>g.bit-m.bit);let f=[];return c&&c.data_hex&&(c.data_hex.includes(" ")?f=c.data_hex.trim().split(/\s+/):f=c.data_hex.match(/.{1,2}/g)||[]),A.jsxs("div",{className:"bg-black border-b border-neutral-800 p-3 select-none shrink-0",children:[A.jsxs("div",{className:"flex items-center justify-between pb-2 border-b border-neutral-800",children:[A.jsxs("div",{className:"flex items-center gap-2",children:[A.jsx("span",{className:"text-sm font-black text-cyan-400 font-mono tracking-wide",children:(l==null?void 0:l.id_hex)||"0x000"}),A.jsx("span",{className:"text-sm font-bold text-neutral-100 font-mono",children:(l==null?void 0:l.key)||"SELECT A MESSAGE"}),l&&A.jsx("span",{className:`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${l.access==="RX"?"bg-emerald-500/15 text-emerald-300 border border-emerald-500/30":"bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"}`,children:l.access})]}),A.jsxs("div",{className:"flex items-center gap-3 text-[11px] font-mono text-neutral-300",children:[A.jsxs("div",{children:["Rate:"," ",A.jsx("span",{className:"text-emerald-400 font-bold tabular-nums",children:c!=null&&c.rate_hz?`${c.rate_hz.toFixed(1)} Hz`:"0.0 Hz"})]}),A.jsx("div",{className:"text-neutral-700",children:"|"}),A.jsxs("div",{children:["DLC: ",A.jsx("span",{className:"text-neutral-100 font-bold",children:d})]}),A.jsx("div",{className:"text-neutral-700",children:"|"}),A.jsxs("div",{children:["Count:"," ",A.jsx("span",{className:"text-neutral-100 font-bold tabular-nums",children:(c==null?void 0:c.count.toLocaleString())||"0"})]})]})]}),A.jsxs("div",{className:"flex items-center justify-between mt-2.5 mb-1.5 text-[10px] font-mono",children:[A.jsx("div",{className:"font-bold text-neutral-300 tracking-wider",children:"64-BIT PAYLOAD MATRIX (8 BYTES × 8 BITS)"}),A.jsxs("div",{className:"flex items-center gap-1.5 text-neutral-500 font-semibold",children:[A.jsx("span",{children:"← MSB (Bit 7)"}),A.jsx("span",{children:"•"}),A.jsx("span",{children:"LSB (Bit 0) →"})]})]}),A.jsxs("div",{className:"bg-[#080808] p-2.5 rounded-lg border border-neutral-800",children:[A.jsxs("div",{className:"grid grid-cols-[68px_repeat(8,1fr)] gap-1 mb-1 text-center font-mono text-[10px] text-neutral-500 font-bold",children:[A.jsx("div",{className:"text-left text-neutral-500 pl-1",children:"BYTE"}),A.jsx("div",{children:"b7"}),A.jsx("div",{children:"b6"}),A.jsx("div",{children:"b5"}),A.jsx("div",{children:"b4"}),A.jsx("div",{children:"b3"}),A.jsx("div",{children:"b2"}),A.jsx("div",{children:"b1"}),A.jsx("div",{children:"b0"})]}),A.jsx("div",{className:"space-y-1",children:h.map((_,m)=>{const g=(f[m]||"00").padStart(2,"0").toUpperCase(),y=m>=d;return A.jsxs("div",{className:`grid grid-cols-[68px_repeat(8,1fr)] gap-1 items-center font-mono transition-opacity ${y?"opacity-35":"opacity-100"}`,children:[A.jsxs("div",{className:`flex items-center justify-between text-[10px] px-1.5 py-1 rounded border font-semibold ${y?"bg-neutral-950 text-neutral-600 border-neutral-900":"bg-[#0f0f0f] text-neutral-300 border-neutral-800"}`,title:y?`Byte ${m} is beyond DLC ${d} (Padding)`:`Byte ${m}: 0x${g}`,children:[A.jsxs("span",{className:"text-neutral-500 text-[9px] font-mono",children:["B",m]}),A.jsx("span",{className:"text-cyan-300 font-bold text-[11px] font-mono",children:g})]}),_.map(M=>{const b=!y&&!!i&&M.owner===i,S=!!M.owner&&!y,v=M.color||"#262626";return A.jsx("div",{onMouseEnter:()=>!y&&M.owner&&a(M.owner),onMouseLeave:()=>a(null),style:{backgroundColor:b?`${v}ee`:S?`${v}40`:"#0c0c0c",borderColor:b?"#ffffff":S?`${v}cc`:"#1c1c1c"},className:`h-7 rounded flex items-center justify-center text-xs font-mono transition-all border cursor-pointer select-none tabular-nums ${M.val===1?"text-white font-black drop-shadow-[0_0_4px_rgba(255,255,255,0.7)]":"text-neutral-400 font-bold"} ${b?"scale-110 shadow-lg shadow-cyan-500/30 z-10 ring-2 ring-white":""}`,title:y?`Byte ${M.byte}, Bit ${M.bit} [Beyond DLC ${d}]`:M.owner?`Byte ${M.byte}, Bit ${M.bit} | Signal: ${M.owner} | Val: ${M.val}`:`Byte ${M.byte}, Bit ${M.bit} | Unmapped | Val: ${M.val}`,children:M.val},M.bit)})]},m)})})]}),A.jsx("div",{className:"mt-2 h-6 flex items-center justify-between text-[11px] font-mono px-1",children:i?A.jsxs("div",{className:"flex items-center gap-2",children:[A.jsx("span",{className:"text-neutral-400 font-medium",children:"Highlighted Signal:"}),A.jsx("span",{className:"font-bold text-cyan-300 bg-[#141414] px-2 py-0.5 rounded border border-cyan-800",children:i})]}):A.jsx("span",{className:"text-neutral-500",children:"Hover any bit or signal below to inspect bit-field mapping"})})]})};function BS(s,e){if(e&&e.trim().length>0)return e;const t=s.toLowerCase();return t.endsWith("_mmps")?"mm/s":t.endsWith("_mrad_s")?"mrad/s":t.endsWith("_kpa")?"kPa":t.endsWith("_deg")?"deg":t.endsWith("_kmh")?"km/h":t.endsWith("_mv")?"mV":t.endsWith("_ma")?"mA":t.endsWith("_c")?"°C":t.endsWith("_pct")||t.endsWith("_percent")?"%":t.endsWith("_count")||t.endsWith("_counter")?"cnt":t.startsWith("light_")||t.endsWith("_ok")||t.endsWith("_valid")||t.endsWith("_active")?"flag":""}const zS=()=>{const{catalog:s,selectedCanId:e,framesById:t,hoveredSignal:i,setHoveredSignal:a}=vn(),l=s.find(h=>h.id===e),c=t[e],d=(l==null?void 0:l.signals)||[];return ds.useEffect(()=>{const h=f=>{var m;const _=(m=f.target)==null?void 0:m.tagName;if(!(_==="INPUT"||_==="TEXTAREA")&&d.length!==0)if(f.key==="ArrowDown"||f.key==="ArrowUp"){f.preventDefault();const g=d.findIndex(b=>b.name===i);let y=0;f.key==="ArrowDown"?y=g===-1?0:(g+1)%d.length:f.key==="ArrowUp"&&(y=g<=0?d.length-1:g-1);const M=d[y];if(M){a(M.name);const b=document.getElementById(`signal-row-${M.name}`);b&&b.scrollIntoView({block:"nearest",behavior:"smooth"})}}else f.key==="Escape"&&a(null)};return window.addEventListener("keydown",h),()=>window.removeEventListener("keydown",h)},[d,i,a]),A.jsxs("div",{className:"flex-1 flex flex-col min-h-0 bg-black overflow-hidden",children:[A.jsxs("div",{className:"h-8 bg-[#0a0a0a] border-b border-neutral-800 px-3 flex items-center justify-between select-none shrink-0",children:[A.jsxs("div",{className:"flex items-center gap-2",children:[A.jsxs("span",{className:"text-[10px] font-mono font-bold uppercase text-neutral-300 tracking-wider",children:["DECODED SIGNALS (",d.length,")"]}),A.jsx("span",{className:"text-[9px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/60 font-medium",children:"[↑/↓] Select • [Esc] Clear"})]}),A.jsx("span",{className:"text-[10px] font-mono text-neutral-500 font-medium",children:"Bi-Directional Bit Matrix Mapping"})]}),A.jsxs("div",{className:"h-7 bg-[#0a0a0a]/90 border-b border-neutral-800 px-3 flex items-center text-[10px] font-mono font-bold uppercase text-neutral-400 select-none shrink-0",children:[A.jsx("div",{className:"w-5"}),A.jsx("div",{className:"w-40",children:"SIGNAL NAME"}),A.jsx("div",{className:"w-28 text-right pr-2",children:"PHYS VALUE"}),A.jsx("div",{className:"w-16 text-right pr-2",children:"RAW"}),A.jsx("div",{className:"w-24",children:"BIT RANGE"}),A.jsx("div",{className:"w-14",children:"ENDIAN"}),A.jsx("div",{className:"flex-1 pl-1 whitespace-nowrap",children:"SCALE / RANGE"})]}),A.jsx("div",{className:"flex-1 overflow-y-auto divide-y divide-neutral-900 bg-black",children:d.length===0?A.jsx("div",{className:"h-32 flex items-center justify-center text-xs font-mono text-neutral-500",children:"No signals mapped for this message key"}):d.map(h=>{const f=i===h.name,_=c!=null&&c.signals?c.signals[h.name]:null;let m="—";_&&_.value!==void 0&&(typeof _.value=="number"?m=Number.isInteger(_.value)?_.value.toString():_.value.toFixed(2):m=String(_.value));let g="—";if(_&&_.raw!==void 0){const M=Number(_.raw);if(h.signed&&M<0){const b=(1<<h.bits)-1;g=`0x${((M&b)>>>0).toString(16).toUpperCase()}`}else g=`0x${M.toString(16).toUpperCase()}`}const y=BS(h.name,h.unit);return A.jsxs("div",{id:`signal-row-${h.name}`,onClick:()=>a(f?null:h.name),onMouseEnter:()=>a(h.name),onMouseLeave:()=>a(null),className:`flex items-center px-3 py-1.5 text-xs font-mono transition-all cursor-pointer ${f?"bg-[#141414] text-white ring-1 ring-cyan-500/50 border-l-4 border-cyan-400":"hover:bg-[#0d0d0d] text-neutral-300 border-l-4 border-transparent"}`,children:[A.jsx("div",{className:"w-5 flex items-center",children:A.jsx("span",{className:`w-3 h-3 rounded-full inline-block shrink-0 shadow-sm transition-transform ${f?"scale-125 ring-2 ring-white":""}`,style:{backgroundColor:h.color}})}),A.jsxs("div",{className:"w-40 truncate pr-2 font-medium",title:h.name,children:[A.jsx("span",{className:f?"text-cyan-300 font-bold":"text-neutral-200 font-semibold",children:h.name}),h.comment&&A.jsx("span",{className:"block text-[9px] text-neutral-500 truncate font-normal",children:h.comment})]}),A.jsxs("div",{className:"w-28 text-right pr-2",children:[A.jsx("span",{className:"text-emerald-400 font-black tabular-nums text-[13px]",children:m}),y&&A.jsx("span",{className:"ml-1 text-[10px] text-neutral-500 font-medium",children:y})]}),A.jsx("div",{className:"w-16 text-right pr-2 text-neutral-300 text-[11px] tabular-nums font-semibold",children:g}),A.jsxs("div",{className:"w-24 text-[10px] text-neutral-300",children:[A.jsxs("span",{className:"font-bold",children:["B",h.byte,":b",h.bit]}),A.jsxs("span",{className:"text-neutral-500 text-[9px] ml-1",children:["(",h.bits,"b)"]})]}),A.jsxs("div",{className:"w-14 text-[10px] text-neutral-400 uppercase font-semibold",children:[A.jsx("span",{className:h.endian==="big"?"text-purple-300":"text-blue-300",children:h.endian==="big"?"BE":"LE"})," ",A.jsx("span",{className:h.signed?"text-amber-300":"text-emerald-300",children:h.signed?"S":"U"})]}),A.jsxs("div",{className:"flex-1 text-[10px] text-neutral-300 truncate pl-1",children:[h.scale===1&&h.offset===0?A.jsx("span",{className:"text-neutral-500",children:"1:1"}):A.jsxs("span",{className:"text-neutral-300",children:["×",h.scale," + ",h.offset]}),h.min_val!==null&&h.max_val!==null&&A.jsxs("span",{className:"ml-2 text-neutral-500 text-[9px]",children:["[",h.min_val,", ",h.max_val,"]"]})]})]},h.name)})})]})};/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ff="186",Ba={ROTATE:0,DOLLY:1,PAN:2},Oa={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},HS=0,W0=1,VS=2,qc=1,A_=2,Ko=3,Xs=0,ni=1,tr=2,Rr=0,el=1,j0=2,X0=3,q0=4,GS=5,Fa=100,WS=101,jS=102,XS=103,qS=104,YS=200,$S=201,KS=202,ZS=203,C_=204,R_=205,QS=206,JS=207,eM=208,tM=209,nM=210,iM=211,rM=212,sM=213,aM=214,Vh=0,Gh=1,Wh=2,il=3,jh=4,Xh=5,qh=6,Yh=7,Of=0,oM=1,lM=2,rr=0,P_=1,N_=2,L_=3,D_=4,I_=5,U_=6,F_=7,O_=300,qs=301,Qa=302,ih=303,rh=304,fu=306,$h=1e3,Cr=1001,Kh=1002,Pn=1003,cM=1004,xc=1005,zn=1006,sh=1007,Os=1008,di=1009,k_=1010,B_=1011,rl=1012,kf=1013,ar=1014,Hi=1015,or=1016,Bf=1017,zf=1018,sl=1020,z_=35902,H_=35899,V_=1021,G_=1022,Vi=1023,Lr=1026,ks=1027,Hf=1028,Vf=1029,Ys=1030,Gf=1031,Wf=1033,Yc=33776,$c=33777,Kc=33778,Zc=33779,Zh=35840,Qh=35841,Jh=35842,ef=35843,tf=36196,nf=37492,rf=37496,sf=37488,af=37489,nu=37490,of=37491,lf=37808,cf=37809,uf=37810,df=37811,hf=37812,ff=37813,pf=37814,mf=37815,gf=37816,_f=37817,xf=37818,vf=37819,yf=37820,Sf=37821,Mf=36492,Ef=36494,wf=36495,bf=36283,Tf=36284,iu=36285,Af=36286,uM=3200,ru=0,dM=1,rs="",ci="srgb",su="srgb-linear",au="linear",Ft="srgb",ah=7680,hM=519,fM=512,pM=513,mM=514,jf=515,gM=516,_M=517,Xf=518,xM=519,vM=35044,Y0="300 es",nr=2e3,al=2001;function yM(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function ou(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function SM(){const s=ou("canvas");return s.style.display="block",s}const $0={};function K0(...s){const e="THREE."+s.shift();console.log(e,...s)}function W_(s){const e=s[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=s[1];t&&t.isStackTrace?s[0]+=" "+t.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function at(...s){s=W_(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...s)}}function Nt(...s){s=W_(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...s)}}function za(...s){const e=s.join(" ");e in $0||($0[e]=!0,at(...s))}function MM(s,e,t){return new Promise(function(i,a){function l(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:a();break;case s.TIMEOUT_EXPIRED:setTimeout(l,t);break;default:i()}}setTimeout(l,t)})}const EM={[Vh]:Gh,[Wh]:qh,[jh]:Yh,[il]:Xh,[Gh]:Vh,[qh]:Wh,[Yh]:jh,[Xh]:il};class fs{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const a=i[e];if(a!==void 0){const l=a.indexOf(t);l!==-1&&a.splice(l,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const a=i.slice(0);for(let l=0,c=a.length;l<c;l++)a[l].call(this,e);e.target=null}}}const On=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Qc=Math.PI/180,lu=180/Math.PI;function dl(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(On[s&255]+On[s>>8&255]+On[s>>16&255]+On[s>>24&255]+"-"+On[e&255]+On[e>>8&255]+"-"+On[e>>16&15|64]+On[e>>24&255]+"-"+On[t&63|128]+On[t>>8&255]+"-"+On[t>>16&255]+On[t>>24&255]+On[i&255]+On[i>>8&255]+On[i>>16&255]+On[i>>24&255]).toLowerCase()}function vt(s,e,t){return Math.max(e,Math.min(t,s))}function wM(s,e){return(s%e+e)%e}function oh(s,e,t){return(1-t)*s+t*e}function zo(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:case Uint8ClampedArray:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function ei(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const bM={DEG2RAD:Qc},Jf=class Jf{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,a=e.elements;return this.x=a[0]*t+a[3]*i+a[6],this.y=a[1]*t+a[4]*i+a[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=vt(this.x,e.x,t.x),this.y=vt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=vt(this.x,e,t),this.y=vt(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(vt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(vt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),a=Math.sin(t),l=this.x-e.x,c=this.y-e.y;return this.x=l*i-c*a+e.x,this.y=l*a+c*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Jf.prototype.isVector2=!0;let ot=Jf;class hs{constructor(e=0,t=0,i=0,a=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=a}static slerpFlat(e,t,i,a,l,c,d){let h=i[a+0],f=i[a+1],_=i[a+2],m=i[a+3],g=l[c+0],y=l[c+1],M=l[c+2],b=l[c+3];if(m!==b||h!==g||f!==y||_!==M){let S=h*g+f*y+_*M+m*b;S<0&&(g=-g,y=-y,M=-M,b=-b,S=-S);let v=1-d;if(S<.9995){const R=Math.acos(S),I=Math.sin(R);v=Math.sin(v*R)/I,d=Math.sin(d*R)/I,h=h*v+g*d,f=f*v+y*d,_=_*v+M*d,m=m*v+b*d}else{h=h*v+g*d,f=f*v+y*d,_=_*v+M*d,m=m*v+b*d;const R=1/Math.sqrt(h*h+f*f+_*_+m*m);h*=R,f*=R,_*=R,m*=R}}e[t]=h,e[t+1]=f,e[t+2]=_,e[t+3]=m}static multiplyQuaternionsFlat(e,t,i,a,l,c){const d=i[a],h=i[a+1],f=i[a+2],_=i[a+3],m=l[c],g=l[c+1],y=l[c+2],M=l[c+3];return e[t]=d*M+_*m+h*y-f*g,e[t+1]=h*M+_*g+f*m-d*y,e[t+2]=f*M+_*y+d*g-h*m,e[t+3]=_*M-d*m-h*g-f*y,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,a){return this._x=e,this._y=t,this._z=i,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,a=e._y,l=e._z,c=e._order,d=Math.cos,h=Math.sin,f=d(i/2),_=d(a/2),m=d(l/2),g=h(i/2),y=h(a/2),M=h(l/2);switch(c){case"XYZ":this._x=g*_*m+f*y*M,this._y=f*y*m-g*_*M,this._z=f*_*M+g*y*m,this._w=f*_*m-g*y*M;break;case"YXZ":this._x=g*_*m+f*y*M,this._y=f*y*m-g*_*M,this._z=f*_*M-g*y*m,this._w=f*_*m+g*y*M;break;case"ZXY":this._x=g*_*m-f*y*M,this._y=f*y*m+g*_*M,this._z=f*_*M+g*y*m,this._w=f*_*m-g*y*M;break;case"ZYX":this._x=g*_*m-f*y*M,this._y=f*y*m+g*_*M,this._z=f*_*M-g*y*m,this._w=f*_*m+g*y*M;break;case"YZX":this._x=g*_*m+f*y*M,this._y=f*y*m+g*_*M,this._z=f*_*M-g*y*m,this._w=f*_*m-g*y*M;break;case"XZY":this._x=g*_*m-f*y*M,this._y=f*y*m-g*_*M,this._z=f*_*M+g*y*m,this._w=f*_*m+g*y*M;break;default:at("Quaternion: .setFromEuler() encountered an unknown order: "+c)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,a=Math.sin(i);return this._x=e.x*a,this._y=e.y*a,this._z=e.z*a,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],a=t[4],l=t[8],c=t[1],d=t[5],h=t[9],f=t[2],_=t[6],m=t[10],g=i+d+m;if(g>0){const y=.5/Math.sqrt(g+1);this._w=.25/y,this._x=(_-h)*y,this._y=(l-f)*y,this._z=(c-a)*y}else if(i>d&&i>m){const y=2*Math.sqrt(1+i-d-m);this._w=(_-h)/y,this._x=.25*y,this._y=(a+c)/y,this._z=(l+f)/y}else if(d>m){const y=2*Math.sqrt(1+d-i-m);this._w=(l-f)/y,this._x=(a+c)/y,this._y=.25*y,this._z=(h+_)/y}else{const y=2*Math.sqrt(1+m-i-d);this._w=(c-a)/y,this._x=(l+f)/y,this._y=(h+_)/y,this._z=.25*y}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(vt(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const a=Math.min(1,t/i);return this.slerp(e,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,a=e._y,l=e._z,c=e._w,d=t._x,h=t._y,f=t._z,_=t._w;return this._x=i*_+c*d+a*f-l*h,this._y=a*_+c*h+l*d-i*f,this._z=l*_+c*f+i*h-a*d,this._w=c*_-i*d-a*h-l*f,this._onChangeCallback(),this}slerp(e,t){let i=e._x,a=e._y,l=e._z,c=e._w,d=this.dot(e);d<0&&(i=-i,a=-a,l=-l,c=-c,d=-d);let h=1-t;if(d<.9995){const f=Math.acos(d),_=Math.sin(f);h=Math.sin(h*f)/_,t=Math.sin(t*f)/_,this._x=this._x*h+i*t,this._y=this._y*h+a*t,this._z=this._z*h+l*t,this._w=this._w*h+c*t,this._onChangeCallback()}else this._x=this._x*h+i*t,this._y=this._y*h+a*t,this._z=this._z*h+l*t,this._w=this._w*h+c*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),a=Math.sqrt(1-i),l=Math.sqrt(i);return this.set(a*Math.sin(e),a*Math.cos(e),l*Math.sin(t),l*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const ep=class ep{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Z0.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Z0.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,a=this.z,l=e.elements;return this.x=l[0]*t+l[3]*i+l[6]*a,this.y=l[1]*t+l[4]*i+l[7]*a,this.z=l[2]*t+l[5]*i+l[8]*a,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,a=this.z,l=e.elements,c=1/(l[3]*t+l[7]*i+l[11]*a+l[15]);return this.x=(l[0]*t+l[4]*i+l[8]*a+l[12])*c,this.y=(l[1]*t+l[5]*i+l[9]*a+l[13])*c,this.z=(l[2]*t+l[6]*i+l[10]*a+l[14])*c,this}applyQuaternion(e){const t=this.x,i=this.y,a=this.z,l=e.x,c=e.y,d=e.z,h=e.w,f=2*(c*a-d*i),_=2*(d*t-l*a),m=2*(l*i-c*t);return this.x=t+h*f+c*m-d*_,this.y=i+h*_+d*f-l*m,this.z=a+h*m+l*_-c*f,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,a=this.z,l=e.elements;return this.x=l[0]*t+l[4]*i+l[8]*a,this.y=l[1]*t+l[5]*i+l[9]*a,this.z=l[2]*t+l[6]*i+l[10]*a,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=vt(this.x,e.x,t.x),this.y=vt(this.y,e.y,t.y),this.z=vt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=vt(this.x,e,t),this.y=vt(this.y,e,t),this.z=vt(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(vt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,a=e.y,l=e.z,c=t.x,d=t.y,h=t.z;return this.x=a*h-l*d,this.y=l*c-i*h,this.z=i*d-a*c,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return lh.copy(this).projectOnVector(e),this.sub(lh)}reflect(e){return this.sub(lh.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(vt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,a=this.z-e.z;return t*t+i*i+a*a}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const a=Math.sin(t)*e;return this.x=a*Math.sin(i),this.y=Math.cos(t)*e,this.z=a*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),a=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=a,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};ep.prototype.isVector3=!0;let Y=ep;const lh=new Y,Z0=new hs,tp=class tp{constructor(e,t,i,a,l,c,d,h,f){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,a,l,c,d,h,f)}set(e,t,i,a,l,c,d,h,f){const _=this.elements;return _[0]=e,_[1]=a,_[2]=d,_[3]=t,_[4]=l,_[5]=h,_[6]=i,_[7]=c,_[8]=f,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,a=t.elements,l=this.elements,c=i[0],d=i[3],h=i[6],f=i[1],_=i[4],m=i[7],g=i[2],y=i[5],M=i[8],b=a[0],S=a[3],v=a[6],R=a[1],I=a[4],T=a[7],N=a[2],L=a[5],U=a[8];return l[0]=c*b+d*R+h*N,l[3]=c*S+d*I+h*L,l[6]=c*v+d*T+h*U,l[1]=f*b+_*R+m*N,l[4]=f*S+_*I+m*L,l[7]=f*v+_*T+m*U,l[2]=g*b+y*R+M*N,l[5]=g*S+y*I+M*L,l[8]=g*v+y*T+M*U,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],a=e[2],l=e[3],c=e[4],d=e[5],h=e[6],f=e[7],_=e[8];return t*c*_-t*d*f-i*l*_+i*d*h+a*l*f-a*c*h}invert(){const e=this.elements,t=e[0],i=e[1],a=e[2],l=e[3],c=e[4],d=e[5],h=e[6],f=e[7],_=e[8],m=_*c-d*f,g=d*h-_*l,y=f*l-c*h,M=t*m+i*g+a*y;if(M===0)return this.set(0,0,0,0,0,0,0,0,0);const b=1/M;return e[0]=m*b,e[1]=(a*f-_*i)*b,e[2]=(d*i-a*c)*b,e[3]=g*b,e[4]=(_*t-a*h)*b,e[5]=(a*l-d*t)*b,e[6]=y*b,e[7]=(i*h-f*t)*b,e[8]=(c*t-i*l)*b,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,a,l,c,d){const h=Math.cos(l),f=Math.sin(l);return this.set(i*h,i*f,-i*(h*c+f*d)+c+e,-a*f,a*h,-a*(-f*c+h*d)+d+t,0,0,1),this}scale(e,t){return za("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(ch.makeScale(e,t)),this}rotate(e){return za("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(ch.makeRotation(-e)),this}translate(e,t){return za("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(ch.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let a=0;a<9;a++)if(t[a]!==i[a])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};tp.prototype.isMatrix3=!0;let dt=tp;const ch=new dt,Q0=new dt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),J0=new dt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function TM(){const s={enabled:!0,workingColorSpace:su,spaces:{},convert:function(a,l,c){return this.enabled===!1||l===c||!l||!c||(this.spaces[l].transfer===Ft&&(a.r=Pr(a.r),a.g=Pr(a.g),a.b=Pr(a.b)),this.spaces[l].primaries!==this.spaces[c].primaries&&(a.applyMatrix3(this.spaces[l].toXYZ),a.applyMatrix3(this.spaces[c].fromXYZ)),this.spaces[c].transfer===Ft&&(a.r=Ha(a.r),a.g=Ha(a.g),a.b=Ha(a.b))),a},workingToColorSpace:function(a,l){return this.convert(a,this.workingColorSpace,l)},colorSpaceToWorking:function(a,l){return this.convert(a,l,this.workingColorSpace)},getPrimaries:function(a){return this.spaces[a].primaries},getTransfer:function(a){return a===rs?au:this.spaces[a].transfer},getToneMappingMode:function(a){return this.spaces[a].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(a,l=this.workingColorSpace){return a.fromArray(this.spaces[l].luminanceCoefficients)},define:function(a){Object.assign(this.spaces,a)},_getMatrix:function(a,l,c){return a.copy(this.spaces[l].toXYZ).multiply(this.spaces[c].fromXYZ)},_getDrawingBufferColorSpace:function(a){return this.spaces[a].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(a=this.workingColorSpace){return this.spaces[a].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(a,l){return za("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(a,l)},toWorkingColorSpace:function(a,l){return za("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(a,l)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return s.define({[su]:{primaries:e,whitePoint:i,transfer:au,toXYZ:Q0,fromXYZ:J0,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:ci},outputColorSpaceConfig:{drawingBufferColorSpace:ci}},[ci]:{primaries:e,whitePoint:i,transfer:Ft,toXYZ:Q0,fromXYZ:J0,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:ci}}}),s}const wt=TM();function Pr(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Ha(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let Ma;class AM{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Ma===void 0&&(Ma=ou("canvas")),Ma.width=e.width,Ma.height=e.height;const a=Ma.getContext("2d");e instanceof ImageData?a.putImageData(e,0,0):a.drawImage(e,0,0,e.width,e.height),i=Ma}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=ou("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const a=i.getImageData(0,0,e.width,e.height),l=a.data;for(let c=0;c<l.length;c++)l[c]=Pr(l[c]/255)*255;return i.putImageData(a,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Pr(t[i]/255)*255):t[i]=Pr(t[i]);return{data:t,width:e.width,height:e.height}}else return at("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let CM=0;class qf{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:CM++}),this.uuid=dl(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},a=this.data;if(a!==null){let l;if(Array.isArray(a)){l=[];for(let c=0,d=a.length;c<d;c++)a[c].isDataTexture?l.push(uh(a[c].image)):l.push(uh(a[c]))}else l=uh(a);i.url=l}return t||(e.images[this.uuid]=i),i}}function uh(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?AM.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(at("Texture: Unable to serialize Texture."),{})}let RM=0;const dh=new Y;class Xn extends fs{constructor(e=Xn.DEFAULT_IMAGE,t=Xn.DEFAULT_MAPPING,i=Cr,a=Cr,l=zn,c=Os,d=Vi,h=di,f=Xn.DEFAULT_ANISOTROPY,_=rs){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:RM++}),this.uuid=dl(),this.name="",this.source=new qf(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=l,this.minFilter=c,this.anisotropy=f,this.format=d,this.internalFormat=null,this.type=h,this.offset=new ot(0,0),this.repeat=new ot(1,1),this.center=new ot(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new dt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=_,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(dh).x}get height(){return this.source.getSize(dh).y}get depth(){return this.source.getSize(dh).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){at(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const a=this[t];if(a===void 0){at(`Texture.setValues(): property '${t}' does not exist.`);continue}a&&i&&a.isVector2&&i.isVector2||a&&i&&a.isVector3&&i.isVector3||a&&i&&a.isMatrix3&&i.isMatrix3?a.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==O_)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case $h:e.x=e.x-Math.floor(e.x);break;case Cr:e.x=e.x<0?0:1;break;case Kh:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case $h:e.y=e.y-Math.floor(e.y);break;case Cr:e.y=e.y<0?0:1;break;case Kh:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Xn.DEFAULT_IMAGE=null;Xn.DEFAULT_MAPPING=O_;Xn.DEFAULT_ANISOTROPY=1;const np=class np{constructor(e=0,t=0,i=0,a=1){this.x=e,this.y=t,this.z=i,this.w=a}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,a){return this.x=e,this.y=t,this.z=i,this.w=a,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,a=this.z,l=this.w,c=e.elements;return this.x=c[0]*t+c[4]*i+c[8]*a+c[12]*l,this.y=c[1]*t+c[5]*i+c[9]*a+c[13]*l,this.z=c[2]*t+c[6]*i+c[10]*a+c[14]*l,this.w=c[3]*t+c[7]*i+c[11]*a+c[15]*l,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,a,l;const h=e.elements,f=h[0],_=h[4],m=h[8],g=h[1],y=h[5],M=h[9],b=h[2],S=h[6],v=h[10];if(Math.abs(_-g)<.01&&Math.abs(m-b)<.01&&Math.abs(M-S)<.01){if(Math.abs(_+g)<.1&&Math.abs(m+b)<.1&&Math.abs(M+S)<.1&&Math.abs(f+y+v-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const I=(f+1)/2,T=(y+1)/2,N=(v+1)/2,L=(_+g)/4,U=(m+b)/4,w=(M+S)/4;return I>T&&I>N?I<.01?(i=0,a=.707106781,l=.707106781):(i=Math.sqrt(I),a=L/i,l=U/i):T>N?T<.01?(i=.707106781,a=0,l=.707106781):(a=Math.sqrt(T),i=L/a,l=w/a):N<.01?(i=.707106781,a=.707106781,l=0):(l=Math.sqrt(N),i=U/l,a=w/l),this.set(i,a,l,t),this}let R=Math.sqrt((S-M)*(S-M)+(m-b)*(m-b)+(g-_)*(g-_));return Math.abs(R)<.001&&(R=1),this.x=(S-M)/R,this.y=(m-b)/R,this.z=(g-_)/R,this.w=Math.acos((f+y+v-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=vt(this.x,e.x,t.x),this.y=vt(this.y,e.y,t.y),this.z=vt(this.z,e.z,t.z),this.w=vt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=vt(this.x,e,t),this.y=vt(this.y,e,t),this.z=vt(this.z,e,t),this.w=vt(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(vt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};np.prototype.isVector4=!0;let en=np;class PM extends fs{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:zn,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new en(0,0,e,t),this.scissorTest=!1,this.viewport=new en(0,0,e,t),this.textures=[];const a={width:e,height:t,depth:i.depth},l=new Xn(a),c=i.count;for(let d=0;d<c;d++)this.textures[d]=l.clone(),this.textures[d].isRenderTargetTexture=!0,this.textures[d].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:zn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let a=0,l=this.textures.length;a<l;a++)this.textures[a].image.width=e,this.textures[a].image.height=t,this.textures[a].image.depth=i,this.textures[a].isData3DTexture!==!0&&(this.textures[a].isArrayTexture=this.textures[a].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const a=Object.assign({},e.textures[t].image);this.textures[t].source=new qf(a)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Gi extends PM{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class j_ extends Xn{constructor(e=null,t=1,i=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:a},this.magFilter=Pn,this.minFilter=Pn,this.wrapR=Cr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class NM extends Xn{constructor(e=null,t=1,i=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:a},this.magFilter=Pn,this.minFilter=Pn,this.wrapR=Cr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}const du=class du{constructor(e,t,i,a,l,c,d,h,f,_,m,g,y,M,b,S){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,a,l,c,d,h,f,_,m,g,y,M,b,S)}set(e,t,i,a,l,c,d,h,f,_,m,g,y,M,b,S){const v=this.elements;return v[0]=e,v[4]=t,v[8]=i,v[12]=a,v[1]=l,v[5]=c,v[9]=d,v[13]=h,v[2]=f,v[6]=_,v[10]=m,v[14]=g,v[3]=y,v[7]=M,v[11]=b,v[15]=S,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new du().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,i=e.elements,a=1/Ea.setFromMatrixColumn(e,0).length(),l=1/Ea.setFromMatrixColumn(e,1).length(),c=1/Ea.setFromMatrixColumn(e,2).length();return t[0]=i[0]*a,t[1]=i[1]*a,t[2]=i[2]*a,t[3]=0,t[4]=i[4]*l,t[5]=i[5]*l,t[6]=i[6]*l,t[7]=0,t[8]=i[8]*c,t[9]=i[9]*c,t[10]=i[10]*c,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,a=e.y,l=e.z,c=Math.cos(i),d=Math.sin(i),h=Math.cos(a),f=Math.sin(a),_=Math.cos(l),m=Math.sin(l);if(e.order==="XYZ"){const g=c*_,y=c*m,M=d*_,b=d*m;t[0]=h*_,t[4]=-h*m,t[8]=f,t[1]=y+M*f,t[5]=g-b*f,t[9]=-d*h,t[2]=b-g*f,t[6]=M+y*f,t[10]=c*h}else if(e.order==="YXZ"){const g=h*_,y=h*m,M=f*_,b=f*m;t[0]=g+b*d,t[4]=M*d-y,t[8]=c*f,t[1]=c*m,t[5]=c*_,t[9]=-d,t[2]=y*d-M,t[6]=b+g*d,t[10]=c*h}else if(e.order==="ZXY"){const g=h*_,y=h*m,M=f*_,b=f*m;t[0]=g-b*d,t[4]=-c*m,t[8]=M+y*d,t[1]=y+M*d,t[5]=c*_,t[9]=b-g*d,t[2]=-c*f,t[6]=d,t[10]=c*h}else if(e.order==="ZYX"){const g=c*_,y=c*m,M=d*_,b=d*m;t[0]=h*_,t[4]=M*f-y,t[8]=g*f+b,t[1]=h*m,t[5]=b*f+g,t[9]=y*f-M,t[2]=-f,t[6]=d*h,t[10]=c*h}else if(e.order==="YZX"){const g=c*h,y=c*f,M=d*h,b=d*f;t[0]=h*_,t[4]=b-g*m,t[8]=M*m+y,t[1]=m,t[5]=c*_,t[9]=-d*_,t[2]=-f*_,t[6]=y*m+M,t[10]=g-b*m}else if(e.order==="XZY"){const g=c*h,y=c*f,M=d*h,b=d*f;t[0]=h*_,t[4]=-m,t[8]=f*_,t[1]=g*m+b,t[5]=c*_,t[9]=y*m-M,t[2]=M*m-y,t[6]=d*_,t[10]=b*m+g}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(LM,e,DM)}lookAt(e,t,i){const a=this.elements;return oi.subVectors(e,t),oi.lengthSq()===0&&(oi.z=1),oi.normalize(),Qr.crossVectors(i,oi),Qr.lengthSq()===0&&(Math.abs(i.z)===1?oi.x+=1e-4:oi.z+=1e-4,oi.normalize(),Qr.crossVectors(i,oi)),Qr.normalize(),vc.crossVectors(oi,Qr),a[0]=Qr.x,a[4]=vc.x,a[8]=oi.x,a[1]=Qr.y,a[5]=vc.y,a[9]=oi.y,a[2]=Qr.z,a[6]=vc.z,a[10]=oi.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,a=t.elements,l=this.elements,c=i[0],d=i[4],h=i[8],f=i[12],_=i[1],m=i[5],g=i[9],y=i[13],M=i[2],b=i[6],S=i[10],v=i[14],R=i[3],I=i[7],T=i[11],N=i[15],L=a[0],U=a[4],w=a[8],D=a[12],B=a[1],z=a[5],j=a[9],te=a[13],V=a[2],Q=a[6],he=a[10],re=a[14],J=a[3],$=a[7],K=a[11],F=a[15];return l[0]=c*L+d*B+h*V+f*J,l[4]=c*U+d*z+h*Q+f*$,l[8]=c*w+d*j+h*he+f*K,l[12]=c*D+d*te+h*re+f*F,l[1]=_*L+m*B+g*V+y*J,l[5]=_*U+m*z+g*Q+y*$,l[9]=_*w+m*j+g*he+y*K,l[13]=_*D+m*te+g*re+y*F,l[2]=M*L+b*B+S*V+v*J,l[6]=M*U+b*z+S*Q+v*$,l[10]=M*w+b*j+S*he+v*K,l[14]=M*D+b*te+S*re+v*F,l[3]=R*L+I*B+T*V+N*J,l[7]=R*U+I*z+T*Q+N*$,l[11]=R*w+I*j+T*he+N*K,l[15]=R*D+I*te+T*re+N*F,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],a=e[8],l=e[12],c=e[1],d=e[5],h=e[9],f=e[13],_=e[2],m=e[6],g=e[10],y=e[14],M=e[3],b=e[7],S=e[11],v=e[15],R=h*y-f*g,I=d*y-f*m,T=d*g-h*m,N=c*y-f*_,L=c*g-h*_,U=c*m-d*_;return t*(b*R-S*I+v*T)-i*(M*R-S*N+v*L)+a*(M*I-b*N+v*U)-l*(M*T-b*L+S*U)}determinantAffine(){const e=this.elements,t=e[0],i=e[4],a=e[8],l=e[1],c=e[5],d=e[9],h=e[2],f=e[6],_=e[10];return t*(c*_-d*f)-i*(l*_-d*h)+a*(l*f-c*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const a=this.elements;return e.isVector3?(a[12]=e.x,a[13]=e.y,a[14]=e.z):(a[12]=e,a[13]=t,a[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],a=e[2],l=e[3],c=e[4],d=e[5],h=e[6],f=e[7],_=e[8],m=e[9],g=e[10],y=e[11],M=e[12],b=e[13],S=e[14],v=e[15],R=t*d-i*c,I=t*h-a*c,T=t*f-l*c,N=i*h-a*d,L=i*f-l*d,U=a*f-l*h,w=_*b-m*M,D=_*S-g*M,B=_*v-y*M,z=m*S-g*b,j=m*v-y*b,te=g*v-y*S,V=R*te-I*j+T*z+N*B-L*D+U*w;if(V===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const Q=1/V;return e[0]=(d*te-h*j+f*z)*Q,e[1]=(a*j-i*te-l*z)*Q,e[2]=(b*U-S*L+v*N)*Q,e[3]=(g*L-m*U-y*N)*Q,e[4]=(h*B-c*te-f*D)*Q,e[5]=(t*te-a*B+l*D)*Q,e[6]=(S*T-M*U-v*I)*Q,e[7]=(_*U-g*T+y*I)*Q,e[8]=(c*j-d*B+f*w)*Q,e[9]=(i*B-t*j-l*w)*Q,e[10]=(M*L-b*T+v*R)*Q,e[11]=(m*T-_*L-y*R)*Q,e[12]=(d*D-c*z-h*w)*Q,e[13]=(t*z-i*D+a*w)*Q,e[14]=(b*I-M*N-S*R)*Q,e[15]=(_*N-m*I+g*R)*Q,this}scale(e){const t=this.elements,i=e.x,a=e.y,l=e.z;return t[0]*=i,t[4]*=a,t[8]*=l,t[1]*=i,t[5]*=a,t[9]*=l,t[2]*=i,t[6]*=a,t[10]*=l,t[3]*=i,t[7]*=a,t[11]*=l,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],a=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,a))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),a=Math.sin(t),l=1-i,c=e.x,d=e.y,h=e.z,f=l*c,_=l*d;return this.set(f*c+i,f*d-a*h,f*h+a*d,0,f*d+a*h,_*d+i,_*h-a*c,0,f*h-a*d,_*h+a*c,l*h*h+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,a,l,c){return this.set(1,i,l,0,e,1,c,0,t,a,1,0,0,0,0,1),this}compose(e,t,i){const a=this.elements,l=t._x,c=t._y,d=t._z,h=t._w,f=l+l,_=c+c,m=d+d,g=l*f,y=l*_,M=l*m,b=c*_,S=c*m,v=d*m,R=h*f,I=h*_,T=h*m,N=i.x,L=i.y,U=i.z;return a[0]=(1-(b+v))*N,a[1]=(y+T)*N,a[2]=(M-I)*N,a[3]=0,a[4]=(y-T)*L,a[5]=(1-(g+v))*L,a[6]=(S+R)*L,a[7]=0,a[8]=(M+I)*U,a[9]=(S-R)*U,a[10]=(1-(g+b))*U,a[11]=0,a[12]=e.x,a[13]=e.y,a[14]=e.z,a[15]=1,this}decompose(e,t,i){const a=this.elements;e.x=a[12],e.y=a[13],e.z=a[14];const l=this.determinantAffine();if(l===0)return i.set(1,1,1),t.identity(),this;let c=Ea.set(a[0],a[1],a[2]).length();const d=Ea.set(a[4],a[5],a[6]).length(),h=Ea.set(a[8],a[9],a[10]).length();l<0&&(c=-c),Ii.copy(this);const f=1/c,_=1/d,m=1/h;return Ii.elements[0]*=f,Ii.elements[1]*=f,Ii.elements[2]*=f,Ii.elements[4]*=_,Ii.elements[5]*=_,Ii.elements[6]*=_,Ii.elements[8]*=m,Ii.elements[9]*=m,Ii.elements[10]*=m,t.setFromRotationMatrix(Ii),i.x=c,i.y=d,i.z=h,this}makePerspective(e,t,i,a,l,c,d=nr,h=!1){const f=this.elements,_=2*l/(t-e),m=2*l/(i-a),g=(t+e)/(t-e),y=(i+a)/(i-a);let M,b;if(h)M=l/(c-l),b=c*l/(c-l);else if(d===nr)M=-(c+l)/(c-l),b=-2*c*l/(c-l);else if(d===al)M=-c/(c-l),b=-c*l/(c-l);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+d);return f[0]=_,f[4]=0,f[8]=g,f[12]=0,f[1]=0,f[5]=m,f[9]=y,f[13]=0,f[2]=0,f[6]=0,f[10]=M,f[14]=b,f[3]=0,f[7]=0,f[11]=-1,f[15]=0,this}makeOrthographic(e,t,i,a,l,c,d=nr,h=!1){const f=this.elements,_=2/(t-e),m=2/(i-a),g=-(t+e)/(t-e),y=-(i+a)/(i-a);let M,b;if(h)M=1/(c-l),b=c/(c-l);else if(d===nr)M=-2/(c-l),b=-(c+l)/(c-l);else if(d===al)M=-1/(c-l),b=-l/(c-l);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+d);return f[0]=_,f[4]=0,f[8]=0,f[12]=g,f[1]=0,f[5]=m,f[9]=0,f[13]=y,f[2]=0,f[6]=0,f[10]=M,f[14]=b,f[3]=0,f[7]=0,f[11]=0,f[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let a=0;a<16;a++)if(t[a]!==i[a])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};du.prototype.isMatrix4=!0;let zt=du;const Ea=new Y,Ii=new zt,LM=new Y(0,0,0),DM=new Y(1,1,1),Qr=new Y,vc=new Y,oi=new Y,eg=new zt,tg=new hs;class Dr{constructor(e=0,t=0,i=0,a=Dr.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=a}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,a=this._order){return this._x=e,this._y=t,this._z=i,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const a=e.elements,l=a[0],c=a[4],d=a[8],h=a[1],f=a[5],_=a[9],m=a[2],g=a[6],y=a[10];switch(t){case"XYZ":this._y=Math.asin(vt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(-_,y),this._z=Math.atan2(-c,l)):(this._x=Math.atan2(g,f),this._z=0);break;case"YXZ":this._x=Math.asin(-vt(_,-1,1)),Math.abs(_)<.9999999?(this._y=Math.atan2(d,y),this._z=Math.atan2(h,f)):(this._y=Math.atan2(-m,l),this._z=0);break;case"ZXY":this._x=Math.asin(vt(g,-1,1)),Math.abs(g)<.9999999?(this._y=Math.atan2(-m,y),this._z=Math.atan2(-c,f)):(this._y=0,this._z=Math.atan2(h,l));break;case"ZYX":this._y=Math.asin(-vt(m,-1,1)),Math.abs(m)<.9999999?(this._x=Math.atan2(g,y),this._z=Math.atan2(h,l)):(this._x=0,this._z=Math.atan2(-c,f));break;case"YZX":this._z=Math.asin(vt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(-_,f),this._y=Math.atan2(-m,l)):(this._x=0,this._y=Math.atan2(d,y));break;case"XZY":this._z=Math.asin(-vt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(g,f),this._y=Math.atan2(d,l)):(this._x=Math.atan2(-_,y),this._y=0);break;default:at("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return eg.makeRotationFromQuaternion(e),this.setFromRotationMatrix(eg,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return tg.setFromEuler(this),this.setFromQuaternion(tg,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Dr.DEFAULT_ORDER="XYZ";class X_{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let IM=0;const ng=new Y,wa=new hs,vr=new zt,yc=new Y,Ho=new Y,UM=new Y,FM=new hs,ig=new Y(1,0,0),rg=new Y(0,1,0),sg=new Y(0,0,1),ag={type:"added"},OM={type:"removed"},ba={type:"childadded",child:null},hh={type:"childremoved",child:null};class tn extends fs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:IM++}),this.uuid=dl(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=tn.DEFAULT_UP.clone();const e=new Y,t=new Dr,i=new hs,a=new Y(1,1,1);function l(){i.setFromEuler(t,!1)}function c(){t.setFromQuaternion(i,void 0,!1)}t._onChange(l),i._onChange(c),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new zt},normalMatrix:{value:new dt}}),this.matrix=new zt,this.matrixWorld=new zt,this.matrixAutoUpdate=tn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=tn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new X_,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return wa.setFromAxisAngle(e,t),this.quaternion.multiply(wa),this}rotateOnWorldAxis(e,t){return wa.setFromAxisAngle(e,t),this.quaternion.premultiply(wa),this}rotateX(e){return this.rotateOnAxis(ig,e)}rotateY(e){return this.rotateOnAxis(rg,e)}rotateZ(e){return this.rotateOnAxis(sg,e)}translateOnAxis(e,t){return ng.copy(e).applyQuaternion(this.quaternion),this.position.add(ng.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(ig,e)}translateY(e){return this.translateOnAxis(rg,e)}translateZ(e){return this.translateOnAxis(sg,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(vr.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?yc.copy(e):yc.set(e,t,i);const a=this.parent;this.updateWorldMatrix(!0,!1),Ho.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?vr.lookAt(Ho,yc,this.up):vr.lookAt(yc,Ho,this.up),this.quaternion.setFromRotationMatrix(vr),a&&(vr.extractRotation(a.matrixWorld),wa.setFromRotationMatrix(vr),this.quaternion.premultiply(wa.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Nt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(ag),ba.child=e,this.dispatchEvent(ba),ba.child=null):Nt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(OM),hh.child=e,this.dispatchEvent(hh),hh.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),vr.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),vr.multiply(e.parent.matrixWorld)),e.applyMatrix4(vr),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(ag),ba.child=e,this.dispatchEvent(ba),ba.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,a=this.children.length;i<a;i++){const c=this.children[i].getObjectByProperty(e,t);if(c!==void 0)return c}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const a=this.children;for(let l=0,c=a.length;l<c;l++)a[l].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ho,e,UM),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ho,FM,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);const t=this.children;for(let i=0,a=t.length;i<a;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,a=t.length;i<a;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,a=e.z,l=this.matrix.elements;l[12]+=t-l[0]*t-l[4]*i-l[8]*a,l[13]+=i-l[1]*t-l[5]*i-l[9]*a,l[14]+=a-l[2]*t-l[6]*i-l[10]*a}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,a=t.length;i<a;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t,i=!1){const a=this.parent;if(e===!0&&a!==null&&a.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),t===!0){const l=this.children;for(let c=0,d=l.length;c<d;c++)l[c].updateWorldMatrix(!1,!0,i)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,a.name=this.name,a.castShadow=this.castShadow,a.receiveShadow=this.receiveShadow,a.visible=this.visible,a.frustumCulled=this.frustumCulled,a.renderOrder=this.renderOrder,a.static=this.static,a.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.pivot!==null&&(a.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(a.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(a.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.geometryInfo=this._geometryInfo.map(d=>({...d,boundingBox:d.boundingBox?d.boundingBox.toJSON():void 0,boundingSphere:d.boundingSphere?d.boundingSphere.toJSON():void 0})),a.instanceInfo=this._instanceInfo.map(d=>({...d})),a.availableInstanceIds=this._availableInstanceIds.slice(),a.availableGeometryIds=this._availableGeometryIds.slice(),a.nextIndexStart=this._nextIndexStart,a.nextVertexStart=this._nextVertexStart,a.geometryCount=this._geometryCount,a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.matricesTexture=this._matricesTexture.toJSON(e),a.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(a.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(a.boundingBox=this.boundingBox.toJSON()));function l(d,h){return d[h.uuid]===void 0&&(d[h.uuid]=h.toJSON(e)),h.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=l(e.geometries,this.geometry);const d=this.geometry.parameters;if(d!==void 0&&d.shapes!==void 0){const h=d.shapes;if(Array.isArray(h))for(let f=0,_=h.length;f<_;f++){const m=h[f];l(e.shapes,m)}else l(e.shapes,h)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(l(e.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const d=[];for(let h=0,f=this.material.length;h<f;h++)d.push(l(e.materials,this.material[h]));a.material=d}else a.material=l(e.materials,this.material);if(this.children.length>0){a.children=[];for(let d=0;d<this.children.length;d++)a.children.push(this.children[d].toJSON(e).object)}if(this.animations.length>0){a.animations=[];for(let d=0;d<this.animations.length;d++){const h=this.animations[d];a.animations.push(l(e.animations,h))}}if(t){const d=c(e.geometries),h=c(e.materials),f=c(e.textures),_=c(e.images),m=c(e.shapes),g=c(e.skeletons),y=c(e.animations),M=c(e.nodes);d.length>0&&(i.geometries=d),h.length>0&&(i.materials=h),f.length>0&&(i.textures=f),_.length>0&&(i.images=_),m.length>0&&(i.shapes=m),g.length>0&&(i.skeletons=g),y.length>0&&(i.animations=y),M.length>0&&(i.nodes=M)}return i.object=a,i;function c(d){const h=[];for(const f in d){const _=d[f];delete _.metadata,h.push(_)}return h}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const a=e.children[i];this.add(a.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}tn.DEFAULT_UP=new Y(0,1,0);tn.DEFAULT_MATRIX_AUTO_UPDATE=!0;tn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class ir extends tn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const kM={type:"move"};class fh{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ir,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ir,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new Y,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new Y),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ir,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new Y,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new Y,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let a=null,l=null,c=null;const d=this._targetRay,h=this._grip,f=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(f&&e.hand){c=!0;for(const b of e.hand.values()){const S=t.getJointPose(b,i),v=this._getHandJoint(f,b);S!==null&&(v.matrix.fromArray(S.transform.matrix),v.matrix.decompose(v.position,v.rotation,v.scale),v.matrixWorldNeedsUpdate=!0,v.jointRadius=S.radius),v.visible=S!==null}const _=f.joints["index-finger-tip"],m=f.joints["thumb-tip"],g=_.position.distanceTo(m.position),y=.02,M=.005;f.inputState.pinching&&g>y+M?(f.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!f.inputState.pinching&&g<=y-M&&(f.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else h!==null&&e.gripSpace&&(l=t.getPose(e.gripSpace,i),l!==null&&(h.matrix.fromArray(l.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,l.linearVelocity?(h.hasLinearVelocity=!0,h.linearVelocity.copy(l.linearVelocity)):h.hasLinearVelocity=!1,l.angularVelocity?(h.hasAngularVelocity=!0,h.angularVelocity.copy(l.angularVelocity)):h.hasAngularVelocity=!1,h.eventsEnabled&&h.dispatchEvent({type:"gripUpdated",data:e,target:this})));d!==null&&(a=t.getPose(e.targetRaySpace,i),a===null&&l!==null&&(a=l),a!==null&&(d.matrix.fromArray(a.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,a.linearVelocity?(d.hasLinearVelocity=!0,d.linearVelocity.copy(a.linearVelocity)):d.hasLinearVelocity=!1,a.angularVelocity?(d.hasAngularVelocity=!0,d.angularVelocity.copy(a.angularVelocity)):d.hasAngularVelocity=!1,this.dispatchEvent(kM)))}return d!==null&&(d.visible=a!==null),h!==null&&(h.visible=l!==null),f!==null&&(f.visible=c!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new ir;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const q_={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Jr={h:0,s:0,l:0},Sc={h:0,s:0,l:0};function ph(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class ut{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const a=e;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ci){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,wt.colorSpaceToWorking(this,t),this}setRGB(e,t,i,a=wt.workingColorSpace){return this.r=e,this.g=t,this.b=i,wt.colorSpaceToWorking(this,a),this}setHSL(e,t,i,a=wt.workingColorSpace){if(e=wM(e,1),t=vt(t,0,1),i=vt(i,0,1),t===0)this.r=this.g=this.b=i;else{const l=i<=.5?i*(1+t):i+t-i*t,c=2*i-l;this.r=ph(c,l,e+1/3),this.g=ph(c,l,e),this.b=ph(c,l,e-1/3)}return wt.colorSpaceToWorking(this,a),this}setStyle(e,t=ci){function i(l){l!==void 0&&parseFloat(l)<1&&at("Color: Alpha component of "+e+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(e)){let l;const c=a[1],d=a[2];switch(c){case"rgb":case"rgba":if(l=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return i(l[4]),this.setRGB(Math.min(255,parseInt(l[1],10))/255,Math.min(255,parseInt(l[2],10))/255,Math.min(255,parseInt(l[3],10))/255,t);if(l=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return i(l[4]),this.setRGB(Math.min(100,parseInt(l[1],10))/100,Math.min(100,parseInt(l[2],10))/100,Math.min(100,parseInt(l[3],10))/100,t);break;case"hsl":case"hsla":if(l=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return i(l[4]),this.setHSL(parseFloat(l[1])/360,parseFloat(l[2])/100,parseFloat(l[3])/100,t);break;default:at("Color: Unknown color model "+e)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(e)){const l=a[1],c=l.length;if(c===3)return this.setRGB(parseInt(l.charAt(0),16)/15,parseInt(l.charAt(1),16)/15,parseInt(l.charAt(2),16)/15,t);if(c===6)return this.setHex(parseInt(l,16),t);at("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ci){const i=q_[e.toLowerCase()];return i!==void 0?this.setHex(i,t):at("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Pr(e.r),this.g=Pr(e.g),this.b=Pr(e.b),this}copyLinearToSRGB(e){return this.r=Ha(e.r),this.g=Ha(e.g),this.b=Ha(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ci){return wt.workingToColorSpace(kn.copy(this),e),Math.round(vt(kn.r*255,0,255))*65536+Math.round(vt(kn.g*255,0,255))*256+Math.round(vt(kn.b*255,0,255))}getHexString(e=ci){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=wt.workingColorSpace){wt.workingToColorSpace(kn.copy(this),t);const i=kn.r,a=kn.g,l=kn.b,c=Math.max(i,a,l),d=Math.min(i,a,l);let h,f;const _=(d+c)/2;if(d===c)h=0,f=0;else{const m=c-d;switch(f=_<=.5?m/(c+d):m/(2-c-d),c){case i:h=(a-l)/m+(a<l?6:0);break;case a:h=(l-i)/m+2;break;case l:h=(i-a)/m+4;break}h/=6}return e.h=h,e.s=f,e.l=_,e}getRGB(e,t=wt.workingColorSpace){return wt.workingToColorSpace(kn.copy(this),t),e.r=kn.r,e.g=kn.g,e.b=kn.b,e}getStyle(e=ci){wt.workingToColorSpace(kn.copy(this),e);const t=kn.r,i=kn.g,a=kn.b;return e!==ci?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(a*255)})`}offsetHSL(e,t,i){return this.getHSL(Jr),this.setHSL(Jr.h+e,Jr.s+t,Jr.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Jr),e.getHSL(Sc);const i=oh(Jr.h,Sc.h,t),a=oh(Jr.s,Sc.s,t),l=oh(Jr.l,Sc.l,t);return this.setHSL(i,a,l),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,a=this.b,l=e.elements;return this.r=l[0]*t+l[3]*i+l[6]*a,this.g=l[1]*t+l[4]*i+l[7]*a,this.b=l[2]*t+l[5]*i+l[8]*a,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const kn=new ut;ut.NAMES=q_;class Yf{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new ut(e),this.density=t}clone(){return new Yf(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class BM extends tn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Dr,this.environmentIntensity=1,this.environmentRotation=new Dr,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Ui=new Y,yr=new Y,mh=new Y,Sr=new Y,Ta=new Y,Aa=new Y,og=new Y,gh=new Y,_h=new Y,xh=new Y,vh=new en,yh=new en,Sh=new en;class zi{constructor(e=new Y,t=new Y,i=new Y){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,a){a.subVectors(i,t),Ui.subVectors(e,t),a.cross(Ui);const l=a.lengthSq();return l>0?a.multiplyScalar(1/Math.sqrt(l)):a.set(0,0,0)}static getBarycoord(e,t,i,a,l){Ui.subVectors(a,t),yr.subVectors(i,t),mh.subVectors(e,t);const c=Ui.dot(Ui),d=Ui.dot(yr),h=Ui.dot(mh),f=yr.dot(yr),_=yr.dot(mh),m=c*f-d*d;if(m===0)return l.set(0,0,0),null;const g=1/m,y=(f*h-d*_)*g,M=(c*_-d*h)*g;return l.set(1-y-M,M,y)}static containsPoint(e,t,i,a){return this.getBarycoord(e,t,i,a,Sr)===null?!1:Sr.x>=0&&Sr.y>=0&&Sr.x+Sr.y<=1}static getInterpolation(e,t,i,a,l,c,d,h){return this.getBarycoord(e,t,i,a,Sr)===null?(h.x=0,h.y=0,"z"in h&&(h.z=0),"w"in h&&(h.w=0),null):(h.setScalar(0),h.addScaledVector(l,Sr.x),h.addScaledVector(c,Sr.y),h.addScaledVector(d,Sr.z),h)}static getInterpolatedAttribute(e,t,i,a,l,c){return vh.setScalar(0),yh.setScalar(0),Sh.setScalar(0),vh.fromBufferAttribute(e,t),yh.fromBufferAttribute(e,i),Sh.fromBufferAttribute(e,a),c.setScalar(0),c.addScaledVector(vh,l.x),c.addScaledVector(yh,l.y),c.addScaledVector(Sh,l.z),c}static isFrontFacing(e,t,i,a){return Ui.subVectors(i,t),yr.subVectors(e,t),Ui.cross(yr).dot(a)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,a){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[a]),this}setFromAttributeAndIndices(e,t,i,a){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,a),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Ui.subVectors(this.c,this.b),yr.subVectors(this.a,this.b),Ui.cross(yr).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return zi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return zi.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,a,l){return zi.getInterpolation(e,this.a,this.b,this.c,t,i,a,l)}containsPoint(e){return zi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return zi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,a=this.b,l=this.c;let c,d;Ta.subVectors(a,i),Aa.subVectors(l,i),gh.subVectors(e,i);const h=Ta.dot(gh),f=Aa.dot(gh);if(h<=0&&f<=0)return t.copy(i);_h.subVectors(e,a);const _=Ta.dot(_h),m=Aa.dot(_h);if(_>=0&&m<=_)return t.copy(a);const g=h*m-_*f;if(g<=0&&h>=0&&_<=0)return c=h/(h-_),t.copy(i).addScaledVector(Ta,c);xh.subVectors(e,l);const y=Ta.dot(xh),M=Aa.dot(xh);if(M>=0&&y<=M)return t.copy(l);const b=y*f-h*M;if(b<=0&&f>=0&&M<=0)return d=f/(f-M),t.copy(i).addScaledVector(Aa,d);const S=_*M-y*m;if(S<=0&&m-_>=0&&y-M>=0)return og.subVectors(l,a),d=(m-_)/(m-_+(y-M)),t.copy(a).addScaledVector(og,d);const v=1/(S+b+g);return c=b*v,d=g*v,t.copy(i).addScaledVector(Ta,c).addScaledVector(Aa,d)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class $s{constructor(e=new Y(1/0,1/0,1/0),t=new Y(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Fi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Fi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Fi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const l=i.getAttribute("position");if(t===!0&&l!==void 0&&e.isInstancedMesh!==!0)for(let c=0,d=l.count;c<d;c++)e.isMesh===!0?e.getVertexPosition(c,Fi):Fi.fromBufferAttribute(l,c),Fi.applyMatrix4(e.matrixWorld),this.expandByPoint(Fi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Mc.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Mc.copy(i.boundingBox)),Mc.applyMatrix4(e.matrixWorld),this.union(Mc)}const a=e.children;for(let l=0,c=a.length;l<c;l++)this.expandByObject(a[l],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Fi),Fi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Vo),Ec.subVectors(this.max,Vo),Ca.subVectors(e.a,Vo),Ra.subVectors(e.b,Vo),Pa.subVectors(e.c,Vo),es.subVectors(Ra,Ca),ts.subVectors(Pa,Ra),Ns.subVectors(Ca,Pa);let t=[0,-es.z,es.y,0,-ts.z,ts.y,0,-Ns.z,Ns.y,es.z,0,-es.x,ts.z,0,-ts.x,Ns.z,0,-Ns.x,-es.y,es.x,0,-ts.y,ts.x,0,-Ns.y,Ns.x,0];return!Mh(t,Ca,Ra,Pa,Ec)||(t=[1,0,0,0,1,0,0,0,1],!Mh(t,Ca,Ra,Pa,Ec))?!1:(wc.crossVectors(es,ts),t=[wc.x,wc.y,wc.z],Mh(t,Ca,Ra,Pa,Ec))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Fi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Fi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Mr[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Mr[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Mr[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Mr[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Mr[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Mr[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Mr[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Mr[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Mr),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Mr=[new Y,new Y,new Y,new Y,new Y,new Y,new Y,new Y],Fi=new Y,Mc=new $s,Ca=new Y,Ra=new Y,Pa=new Y,es=new Y,ts=new Y,Ns=new Y,Vo=new Y,Ec=new Y,wc=new Y,Ls=new Y;function Mh(s,e,t,i,a){for(let l=0,c=s.length-3;l<=c;l+=3){Ls.fromArray(s,l);const d=a.x*Math.abs(Ls.x)+a.y*Math.abs(Ls.y)+a.z*Math.abs(Ls.z),h=e.dot(Ls),f=t.dot(Ls),_=i.dot(Ls);if(Math.max(-Math.max(h,f,_),Math.min(h,f,_))>d)return!1}return!0}const dn=new Y,bc=new ot;let zM=0;class sr extends fs{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:zM++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=vM,this.updateRanges=[],this.gpuType=Hi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let a=0,l=this.itemSize;a<l;a++)this.array[e+a]=t.array[i+a];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)bc.fromBufferAttribute(this,t),bc.applyMatrix3(e),this.setXY(t,bc.x,bc.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)dn.fromBufferAttribute(this,t),dn.applyMatrix3(e),this.setXYZ(t,dn.x,dn.y,dn.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)dn.fromBufferAttribute(this,t),dn.applyMatrix4(e),this.setXYZ(t,dn.x,dn.y,dn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)dn.fromBufferAttribute(this,t),dn.applyNormalMatrix(e),this.setXYZ(t,dn.x,dn.y,dn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)dn.fromBufferAttribute(this,t),dn.transformDirection(e),this.setXYZ(t,dn.x,dn.y,dn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=zo(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=ei(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=zo(t,this.array)),t}setX(e,t){return this.normalized&&(t=ei(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=zo(t,this.array)),t}setY(e,t){return this.normalized&&(t=ei(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=zo(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ei(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=zo(t,this.array)),t}setW(e,t){return this.normalized&&(t=ei(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=ei(t,this.array),i=ei(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,a){return e*=this.itemSize,this.normalized&&(t=ei(t,this.array),i=ei(i,this.array),a=ei(a,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=a,this}setXYZW(e,t,i,a,l){return e*=this.itemSize,this.normalized&&(t=ei(t,this.array),i=ei(i,this.array),a=ei(a,this.array),l=ei(l,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=a,this.array[e+3]=l,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}}class Y_ extends sr{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class $_ extends sr{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class hn extends sr{constructor(e,t,i){super(new Float32Array(e),t,i)}}const HM=new $s,Go=new Y,Eh=new Y;class Ks{constructor(e=new Y,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):HM.setFromPoints(e).getCenter(i);let a=0;for(let l=0,c=e.length;l<c;l++)a=Math.max(a,i.distanceToSquared(e[l]));return this.radius=Math.sqrt(a),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Go.subVectors(e,this.center);const t=Go.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),a=(i-this.radius)*.5;this.center.addScaledVector(Go,a/i),this.radius+=a}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Eh.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Go.copy(e.center).add(Eh)),this.expandByPoint(Go.copy(e.center).sub(Eh))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let VM=0;const yi=new zt,wh=new tn,Na=new Y,li=new $s,Wo=new $s,bn=new Y;class qn extends fs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:VM++}),this.uuid=dl(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(yM(e)?$_:Y_)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const l=new dt().getNormalMatrix(e);i.applyNormalMatrix(l),i.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(e),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return yi.makeRotationFromQuaternion(e),this.applyMatrix4(yi),this}rotateX(e){return yi.makeRotationX(e),this.applyMatrix4(yi),this}rotateY(e){return yi.makeRotationY(e),this.applyMatrix4(yi),this}rotateZ(e){return yi.makeRotationZ(e),this.applyMatrix4(yi),this}translate(e,t,i){return yi.makeTranslation(e,t,i),this.applyMatrix4(yi),this}scale(e,t,i){return yi.makeScale(e,t,i),this.applyMatrix4(yi),this}lookAt(e){return wh.lookAt(e),wh.updateMatrix(),this.applyMatrix4(wh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Na).negate(),this.translate(Na.x,Na.y,Na.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let a=0,l=e.length;a<l;a++){const c=e[a];i.push(c.x,c.y,c.z||0)}this.setAttribute("position",new hn(i,3))}else{const i=Math.min(e.length,t.count);for(let a=0;a<i;a++){const l=e[a];t.setXYZ(a,l.x,l.y,l.z||0)}e.length>t.count&&at("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new $s);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Nt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new Y(-1/0,-1/0,-1/0),new Y(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,a=t.length;i<a;i++){const l=t[i];li.setFromBufferAttribute(l),this.morphTargetsRelative?(bn.addVectors(this.boundingBox.min,li.min),this.boundingBox.expandByPoint(bn),bn.addVectors(this.boundingBox.max,li.max),this.boundingBox.expandByPoint(bn)):(this.boundingBox.expandByPoint(li.min),this.boundingBox.expandByPoint(li.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Nt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ks);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Nt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new Y,1/0);return}if(e){const i=this.boundingSphere.center;if(li.setFromBufferAttribute(e),t)for(let l=0,c=t.length;l<c;l++){const d=t[l];Wo.setFromBufferAttribute(d),this.morphTargetsRelative?(bn.addVectors(li.min,Wo.min),li.expandByPoint(bn),bn.addVectors(li.max,Wo.max),li.expandByPoint(bn)):(li.expandByPoint(Wo.min),li.expandByPoint(Wo.max))}li.getCenter(i);let a=0;for(let l=0,c=e.count;l<c;l++)bn.fromBufferAttribute(e,l),a=Math.max(a,i.distanceToSquared(bn));if(t)for(let l=0,c=t.length;l<c;l++){const d=t[l],h=this.morphTargetsRelative;for(let f=0,_=d.count;f<_;f++)bn.fromBufferAttribute(d,f),h&&(Na.fromBufferAttribute(e,f),bn.add(Na)),a=Math.max(a,i.distanceToSquared(bn))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&Nt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Nt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,a=t.normal,l=t.uv;let c=this.getAttribute("tangent");(c===void 0||c.count!==i.count)&&(c=new sr(new Float32Array(4*i.count),4),this.setAttribute("tangent",c));const d=[],h=[];for(let w=0;w<i.count;w++)d[w]=new Y,h[w]=new Y;const f=new Y,_=new Y,m=new Y,g=new ot,y=new ot,M=new ot,b=new Y,S=new Y;function v(w,D,B){f.fromBufferAttribute(i,w),_.fromBufferAttribute(i,D),m.fromBufferAttribute(i,B),g.fromBufferAttribute(l,w),y.fromBufferAttribute(l,D),M.fromBufferAttribute(l,B),_.sub(f),m.sub(f),y.sub(g),M.sub(g);const z=1/(y.x*M.y-M.x*y.y);isFinite(z)&&(b.copy(_).multiplyScalar(M.y).addScaledVector(m,-y.y).multiplyScalar(z),S.copy(m).multiplyScalar(y.x).addScaledVector(_,-M.x).multiplyScalar(z),d[w].add(b),d[D].add(b),d[B].add(b),h[w].add(S),h[D].add(S),h[B].add(S))}let R=this.groups;R.length===0&&(R=[{start:0,count:e.count}]);for(let w=0,D=R.length;w<D;++w){const B=R[w],z=B.start,j=B.count;for(let te=z,V=z+j;te<V;te+=3)v(e.getX(te+0),e.getX(te+1),e.getX(te+2))}const I=new Y,T=new Y,N=new Y,L=new Y;function U(w){N.fromBufferAttribute(a,w),L.copy(N);const D=d[w];I.copy(D),I.sub(N.multiplyScalar(N.dot(D))).normalize(),T.crossVectors(L,D);const z=T.dot(h[w])<0?-1:1;c.setXYZW(w,I.x,I.y,I.z,z)}for(let w=0,D=R.length;w<D;++w){const B=R[w],z=B.start,j=B.count;for(let te=z,V=z+j;te<V;te+=3)U(e.getX(te+0)),U(e.getX(te+1)),U(e.getX(te+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==t.count)i=new sr(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let g=0,y=i.count;g<y;g++)i.setXYZ(g,0,0,0);const a=new Y,l=new Y,c=new Y,d=new Y,h=new Y,f=new Y,_=new Y,m=new Y;if(e)for(let g=0,y=e.count;g<y;g+=3){const M=e.getX(g+0),b=e.getX(g+1),S=e.getX(g+2);a.fromBufferAttribute(t,M),l.fromBufferAttribute(t,b),c.fromBufferAttribute(t,S),_.subVectors(c,l),m.subVectors(a,l),_.cross(m),d.fromBufferAttribute(i,M),h.fromBufferAttribute(i,b),f.fromBufferAttribute(i,S),d.add(_),h.add(_),f.add(_),i.setXYZ(M,d.x,d.y,d.z),i.setXYZ(b,h.x,h.y,h.z),i.setXYZ(S,f.x,f.y,f.z)}else for(let g=0,y=t.count;g<y;g+=3)a.fromBufferAttribute(t,g+0),l.fromBufferAttribute(t,g+1),c.fromBufferAttribute(t,g+2),_.subVectors(c,l),m.subVectors(a,l),_.cross(m),i.setXYZ(g+0,_.x,_.y,_.z),i.setXYZ(g+1,_.x,_.y,_.z),i.setXYZ(g+2,_.x,_.y,_.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)bn.fromBufferAttribute(e,t),bn.normalize(),e.setXYZ(t,bn.x,bn.y,bn.z)}toNonIndexed(){function e(d,h){const f=d.array,_=d.itemSize,m=d.normalized,g=new f.constructor(h.length*_);let y=0,M=0;for(let b=0,S=h.length;b<S;b++){d.isInterleavedBufferAttribute?y=h[b]*d.data.stride+d.offset:y=h[b]*_;for(let v=0;v<_;v++)g[M++]=f[y++]}return new sr(g,_,m)}if(this.index===null)return at("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new qn,i=this.index.array,a=this.attributes;for(const d in a){const h=a[d],f=e(h,i);t.setAttribute(d,f)}const l=this.morphAttributes;for(const d in l){const h=[],f=l[d];for(let _=0,m=f.length;_<m;_++){const g=f[_],y=e(g,i);h.push(y)}t.morphAttributes[d]=h}t.morphTargetsRelative=this.morphTargetsRelative;const c=this.groups;for(let d=0,h=c.length;d<h;d++){const f=c[d];t.addGroup(f.start,f.count,f.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const h=this.parameters;for(const f in h)h[f]!==void 0&&(e[f]=h[f]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const h in i){const f=i[h];e.data.attributes[h]=f.toJSON(e.data)}const a={};let l=!1;for(const h in this.morphAttributes){const f=this.morphAttributes[h],_=[];for(let m=0,g=f.length;m<g;m++){const y=f[m];_.push(y.toJSON(e.data))}_.length>0&&(a[h]=_,l=!0)}l&&(e.data.morphAttributes=a,e.data.morphTargetsRelative=this.morphTargetsRelative);const c=this.groups;c.length>0&&(e.data.groups=JSON.parse(JSON.stringify(c)));const d=this.boundingSphere;return d!==null&&(e.data.boundingSphere=d.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const a=e.attributes;for(const f in a){const _=a[f];this.setAttribute(f,_.clone(t))}const l=e.morphAttributes;for(const f in l){const _=[],m=l[f];for(let g=0,y=m.length;g<y;g++)_.push(m[g].clone(t));this.morphAttributes[f]=_}this.morphTargetsRelative=e.morphTargetsRelative;const c=e.groups;for(let f=0,_=c.length;f<_;f++){const m=c[f];this.addGroup(m.start,m.count,m.materialIndex)}const d=e.boundingBox;d!==null&&(this.boundingBox=d.clone());const h=e.boundingSphere;return h!==null&&(this.boundingSphere=h.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}const bh=new Y,GM=new Y,WM=new dt;class Tr{constructor(e=new Y(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,a){return this.normal.set(e,t,i),this.constant=a,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const a=bh.subVectors(i,t).cross(GM.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(a,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const a=e.delta(bh),l=this.normal.dot(a);if(l===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const c=-(e.start.dot(this.normal)+this.constant)/l;return i===!0&&(c<0||c>1)?null:t.copy(e.start).addScaledVector(a,c)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||WM.getNormalMatrix(e),a=this.coplanarPoint(bh).applyMatrix4(e),l=this.normal.applyMatrix3(i).normalize();return this.constant=-a.dot(l),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let jM=0;class lr extends fs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:jM++}),this.uuid=dl(),this.name="",this.type="Material",this.blending=el,this.side=Xs,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=C_,this.blendDst=R_,this.blendEquation=Fa,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ut(0,0,0),this.blendAlpha=0,this.depthFunc=il,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=hM,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ah,this.stencilZFail=ah,this.stencilZPass=ah,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){at(`Material: parameter '${t}' has value of undefined.`);continue}const a=this[t];if(a===void 0){at(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(i):a&&a.isVector2&&i&&i.isVector2||a&&a.isEuler&&i&&i.isEuler||a&&a.isVector3&&i&&i.isVector3?a.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(l=>l.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function a(l){const c=[];for(const d in l){const h=l[d];delete h.metadata,c.push(h)}return c}if(t){const l=a(e.textures),c=a(e.images);l.length>0&&(i.textures=l),c.length>0&&(i.images=c)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new ut().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new Tr().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new ot().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ot().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const a=t.length;i=new Array(a);for(let l=0;l!==a;++l)i[l]=t[l].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Er=new Y,Th=new Y,Tc=new Y,Ac=new Y;class pu{constructor(e=new Y,t=new Y(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Er)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Er.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Er.copy(this.origin).addScaledVector(this.direction,t),Er.distanceToSquared(e))}distanceSqToSegment(e,t,i,a){Th.copy(e).add(t).multiplyScalar(.5),Tc.copy(t).sub(e).normalize(),Ac.copy(this.origin).sub(Th);const l=e.distanceTo(t)*.5,c=-this.direction.dot(Tc),d=Ac.dot(this.direction),h=-Ac.dot(Tc),f=Ac.lengthSq(),_=Math.abs(1-c*c);let m,g,y,M;if(_>0)if(m=c*h-d,g=c*d-h,M=l*_,m>=0)if(g>=-M)if(g<=M){const b=1/_;m*=b,g*=b,y=m*(m+c*g+2*d)+g*(c*m+g+2*h)+f}else g=l,m=Math.max(0,-(c*g+d)),y=-m*m+g*(g+2*h)+f;else g=-l,m=Math.max(0,-(c*g+d)),y=-m*m+g*(g+2*h)+f;else g<=-M?(m=Math.max(0,-(-c*l+d)),g=m>0?-l:Math.min(Math.max(-l,-h),l),y=-m*m+g*(g+2*h)+f):g<=M?(m=0,g=Math.min(Math.max(-l,-h),l),y=g*(g+2*h)+f):(m=Math.max(0,-(c*l+d)),g=m>0?l:Math.min(Math.max(-l,-h),l),y=-m*m+g*(g+2*h)+f);else g=c>0?-l:l,m=Math.max(0,-(c*g+d)),y=-m*m+g*(g+2*h)+f;return i&&i.copy(this.origin).addScaledVector(this.direction,m),a&&a.copy(Th).addScaledVector(Tc,g),y}intersectSphere(e,t){if(e.radius<0)return null;Er.subVectors(e.center,this.origin);const i=Er.dot(this.direction),a=Er.dot(Er)-i*i,l=e.radius*e.radius;if(a>l)return null;const c=Math.sqrt(l-a),d=i-c,h=i+c;return h<0?null:d<0?this.at(h,t):this.at(d,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,a,l,c,d,h;const f=1/this.direction.x,_=1/this.direction.y,m=1/this.direction.z,g=this.origin;return f>=0?(i=(e.min.x-g.x)*f,a=(e.max.x-g.x)*f):(i=(e.max.x-g.x)*f,a=(e.min.x-g.x)*f),_>=0?(l=(e.min.y-g.y)*_,c=(e.max.y-g.y)*_):(l=(e.max.y-g.y)*_,c=(e.min.y-g.y)*_),i>c||l>a||((l>i||isNaN(i))&&(i=l),(c<a||isNaN(a))&&(a=c),m>=0?(d=(e.min.z-g.z)*m,h=(e.max.z-g.z)*m):(d=(e.max.z-g.z)*m,h=(e.min.z-g.z)*m),i>h||d>a)||((d>i||i!==i)&&(i=d),(h<a||a!==a)&&(a=h),a<0)?null:this.at(i>=0?i:a,t)}intersectsBox(e){return this.intersectBox(e,Er)!==null}intersectTriangle(e,t,i,a,l){const c=this.origin,d=this.direction,h=d.x,f=d.y,_=d.z,m=e.x-c.x,g=e.y-c.y,y=e.z-c.z,M=t.x-c.x,b=t.y-c.y,S=t.z-c.z,v=i.x-c.x,R=i.y-c.y,I=i.z-c.z,T=Math.abs(h),N=Math.abs(f),L=Math.abs(_);let U,w,D,B,z,j,te,V,Q,he,re,J;if(T>=N&&T>=L?(D=h,j=m,Q=M,J=v,h>=0?(U=f,w=_,B=g,z=y,te=b,V=S,he=R,re=I):(U=_,w=f,B=y,z=g,te=S,V=b,he=I,re=R)):N>=L?(D=f,j=g,Q=b,J=R,f>=0?(U=_,w=h,B=y,z=m,te=S,V=M,he=I,re=v):(U=h,w=_,B=m,z=y,te=M,V=S,he=v,re=I)):(D=_,j=y,Q=S,J=I,_>=0?(U=h,w=f,B=m,z=g,te=M,V=b,he=v,re=R):(U=f,w=h,B=g,z=m,te=b,V=M,he=R,re=v)),D===0)return null;const $=U/D,K=w/D,F=1/D,ae=B-$*j,Se=z-K*j,Ge=te-$*Q,He=V-K*Q,We=he-$*J,le=re-K*J,de=We*He-le*Ge,we=ae*le-Se*We,et=Ge*Se-He*ae;if(a){if(de<0||we<0||et<0)return null}else if((de<0||we<0||et<0)&&(de>0||we>0||et>0))return null;const Oe=de+we+et;if(Oe===0)return null;const ft=F*(de*j+we*Q+et*J);return(Oe>0?ft<0:ft>0)?null:this.at(ft/Oe,l)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class js extends lr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ut(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Dr,this.combine=Of,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const lg=new zt,Ds=new pu,Cc=new Ks,cg=new Y,Rc=new Y,Pc=new Y,Nc=new Y,Ah=new Y,Lc=new Y,ug=new Y,Dc=new Y;class Ot extends tn{constructor(e=new qn,t=new js){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const a=t[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let l=0,c=a.length;l<c;l++){const d=a[l].name||String(l);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=l}}}}getVertexPosition(e,t){const i=this.geometry,a=i.attributes.position,l=i.morphAttributes.position,c=i.morphTargetsRelative;t.fromBufferAttribute(a,e);const d=this.morphTargetInfluences;if(l&&d){Lc.set(0,0,0);for(let h=0,f=l.length;h<f;h++){const _=d[h],m=l[h];_!==0&&(Ah.fromBufferAttribute(m,e),c?Lc.addScaledVector(Ah,_):Lc.addScaledVector(Ah.sub(t),_))}t.add(Lc)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,a=this.material,l=this.matrixWorld;a!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Cc.copy(i.boundingSphere),Cc.applyMatrix4(l),Ds.copy(e.ray).recast(e.near),!(Cc.containsPoint(Ds.origin)===!1&&(Ds.intersectSphere(Cc,cg)===null||Ds.origin.distanceToSquared(cg)>(e.far-e.near)**2))&&(lg.copy(l).invert(),Ds.copy(e.ray).applyMatrix4(lg),!(i.boundingBox!==null&&Ds.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Ds)))}_computeIntersections(e,t,i){let a;const l=this.geometry,c=this.material,d=l.index,h=l.attributes.position,f=l.attributes.uv,_=l.attributes.uv1,m=l.attributes.normal,g=l.groups,y=l.drawRange;if(d!==null)if(Array.isArray(c))for(let M=0,b=g.length;M<b;M++){const S=g[M],v=c[S.materialIndex],R=Math.max(S.start,y.start),I=Math.min(d.count,Math.min(S.start+S.count,y.start+y.count));for(let T=R,N=I;T<N;T+=3){const L=d.getX(T),U=d.getX(T+1),w=d.getX(T+2);a=Ic(this,v,e,i,f,_,m,L,U,w),a&&(a.faceIndex=Math.floor(T/3),a.face.materialIndex=S.materialIndex,t.push(a))}}else{const M=Math.max(0,y.start),b=Math.min(d.count,y.start+y.count);for(let S=M,v=b;S<v;S+=3){const R=d.getX(S),I=d.getX(S+1),T=d.getX(S+2);a=Ic(this,c,e,i,f,_,m,R,I,T),a&&(a.faceIndex=Math.floor(S/3),t.push(a))}}else if(h!==void 0)if(Array.isArray(c))for(let M=0,b=g.length;M<b;M++){const S=g[M],v=c[S.materialIndex],R=Math.max(S.start,y.start),I=Math.min(h.count,Math.min(S.start+S.count,y.start+y.count));for(let T=R,N=I;T<N;T+=3){const L=T,U=T+1,w=T+2;a=Ic(this,v,e,i,f,_,m,L,U,w),a&&(a.faceIndex=Math.floor(T/3),a.face.materialIndex=S.materialIndex,t.push(a))}}else{const M=Math.max(0,y.start),b=Math.min(h.count,y.start+y.count);for(let S=M,v=b;S<v;S+=3){const R=S,I=S+1,T=S+2;a=Ic(this,c,e,i,f,_,m,R,I,T),a&&(a.faceIndex=Math.floor(S/3),t.push(a))}}}}function XM(s,e,t,i,a,l,c,d){let h;if(e.side===ni?h=i.intersectTriangle(c,l,a,!0,d):h=i.intersectTriangle(a,l,c,e.side===Xs,d),h===null)return null;Dc.copy(d),Dc.applyMatrix4(s.matrixWorld);const f=t.ray.origin.distanceTo(Dc);return f<t.near||f>t.far?null:{distance:f,point:Dc.clone(),object:s}}function Ic(s,e,t,i,a,l,c,d,h,f){s.getVertexPosition(d,Rc),s.getVertexPosition(h,Pc),s.getVertexPosition(f,Nc);const _=XM(s,e,t,i,Rc,Pc,Nc,ug);if(_){const m=new Y;zi.getBarycoord(ug,Rc,Pc,Nc,m),a&&(_.uv=zi.getInterpolatedAttribute(a,d,h,f,m,new ot)),l&&(_.uv1=zi.getInterpolatedAttribute(l,d,h,f,m,new ot)),c&&(_.normal=zi.getInterpolatedAttribute(c,d,h,f,m,new Y),_.normal.dot(i.direction)>0&&_.normal.multiplyScalar(-1));const g={a:d,b:h,c:f,normal:new Y,materialIndex:0};zi.getNormal(Rc,Pc,Nc,g.normal),_.face=g,_.barycoord=m}return _}class K_ extends Xn{constructor(e=null,t=1,i=1,a,l,c,d,h,f=Pn,_=Pn,m,g){super(null,c,d,h,f,_,a,l,m,g),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class dg extends sr{constructor(e,t,i,a=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=a}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const La=new zt,hg=new zt,Uc=[],fg=new $s,qM=new zt,jo=new Ot,Xo=new Ks;class YM extends Ot{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new dg(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let a=0;a<i;a++)this.setMatrixAt(a,qM)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new $s),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,La),fg.copy(e.boundingBox).applyMatrix4(La),this.boundingBox.union(fg)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ks),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,La),Xo.copy(e.boundingSphere).applyMatrix4(La),this.boundingSphere.union(Xo)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,a=this.morphTexture.source.data.data,l=i.length+1,c=e*l+1;for(let d=0;d<i.length;d++)i[d]=a[c+d]}raycast(e,t){const i=this.matrixWorld,a=this.count;if(jo.geometry=this.geometry,jo.material=this.material,jo.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Xo.copy(this.boundingSphere),Xo.applyMatrix4(i),e.ray.intersectsSphere(Xo)!==!1))for(let l=0;l<a;l++){this.getMatrixAt(l,La),hg.multiplyMatrices(i,La),jo.matrixWorld=hg,jo.raycast(e,Uc);for(let c=0,d=Uc.length;c<d;c++){const h=Uc[c];h.instanceId=l,h.object=this,t.push(h)}Uc.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new dg(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){const i=t.morphTargetInfluences,a=i.length+1;this.morphTexture===null&&(this.morphTexture=new K_(new Float32Array(a*this.count),a,this.count,Hf,Hi));const l=this.morphTexture.source.data.data;let c=0;for(let f=0;f<i.length;f++)c+=i[f];const d=this.geometry.morphTargetsRelative?1:1-c,h=a*e;return l[h]=d,l.set(i,h+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Is=new Ks,$M=new ot(.5,.5),Fc=new Y;class $f{constructor(e=new Tr,t=new Tr,i=new Tr,a=new Tr,l=new Tr,c=new Tr){this.planes=[e,t,i,a,l,c]}set(e,t,i,a,l,c){const d=this.planes;return d[0].copy(e),d[1].copy(t),d[2].copy(i),d[3].copy(a),d[4].copy(l),d[5].copy(c),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=nr,i=!1){const a=this.planes,l=e.elements,c=l[0],d=l[1],h=l[2],f=l[3],_=l[4],m=l[5],g=l[6],y=l[7],M=l[8],b=l[9],S=l[10],v=l[11],R=l[12],I=l[13],T=l[14],N=l[15];if(a[0].setComponents(f-c,y-_,v-M,N-R).normalize(),a[1].setComponents(f+c,y+_,v+M,N+R).normalize(),a[2].setComponents(f+d,y+m,v+b,N+I).normalize(),a[3].setComponents(f-d,y-m,v-b,N-I).normalize(),i)a[4].setComponents(h,g,S,T).normalize(),a[5].setComponents(f-h,y-g,v-S,N-T).normalize();else if(a[4].setComponents(f-h,y-g,v-S,N-T).normalize(),t===nr)a[5].setComponents(f+h,y+g,v+S,N+T).normalize();else if(t===al)a[5].setComponents(h,g,S,T).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Is.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Is.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Is)}intersectsSprite(e){Is.center.set(0,0,0);const t=$M.distanceTo(e.center);return Is.radius=.7071067811865476+t,Is.applyMatrix4(e.matrixWorld),this.intersectsSphere(Is)}intersectsSphere(e){const t=this.planes,i=e.center,a=-e.radius;for(let l=0;l<6;l++)if(t[l].distanceToPoint(i)<a)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const a=t[i];if(Fc.x=a.normal.x>0?e.max.x:e.min.x,Fc.y=a.normal.y>0?e.max.y:e.min.y,Fc.z=a.normal.z>0?e.max.z:e.min.z,a.distanceToPoint(Fc)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class tl extends lr{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ut(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const cu=new Y,uu=new Y,pg=new zt,qo=new pu,Oc=new Ks,Ch=new Y,mg=new Y;class KM extends tn{constructor(e=new qn,t=new tl){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let a=1,l=t.count;a<l;a++)cu.fromBufferAttribute(t,a-1),uu.fromBufferAttribute(t,a),i[a]=i[a-1],i[a]+=cu.distanceTo(uu);e.setAttribute("lineDistance",new hn(i,1))}else at("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,a=this.matrixWorld,l=e.params.Line.threshold,c=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Oc.copy(i.boundingSphere),Oc.applyMatrix4(a),Oc.radius+=l,e.ray.intersectsSphere(Oc)===!1)return;pg.copy(a).invert(),qo.copy(e.ray).applyMatrix4(pg);const d=l/((this.scale.x+this.scale.y+this.scale.z)/3),h=d*d,f=this.isLineSegments?2:1,_=i.index,g=i.attributes.position;if(_!==null){const y=Math.max(0,c.start),M=Math.min(_.count,c.start+c.count);for(let b=y,S=M-1;b<S;b+=f){const v=_.getX(b),R=_.getX(b+1),I=kc(this,e,qo,h,v,R,b);I&&t.push(I)}if(this.isLineLoop){const b=_.getX(M-1),S=_.getX(y),v=kc(this,e,qo,h,b,S,M-1);v&&t.push(v)}}else{const y=Math.max(0,c.start),M=Math.min(g.count,c.start+c.count);for(let b=y,S=M-1;b<S;b+=f){const v=kc(this,e,qo,h,b,b+1,b);v&&t.push(v)}if(this.isLineLoop){const b=kc(this,e,qo,h,M-1,y,M-1);b&&t.push(b)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const a=t[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let l=0,c=a.length;l<c;l++){const d=a[l].name||String(l);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=l}}}}}function kc(s,e,t,i,a,l,c){const d=s.geometry.attributes.position;if(cu.fromBufferAttribute(d,a),uu.fromBufferAttribute(d,l),t.distanceSqToSegment(cu,uu,Ch,mg)>i)return;Ch.applyMatrix4(s.matrixWorld);const f=e.ray.origin.distanceTo(Ch);if(!(f<e.near||f>e.far))return{distance:f,point:mg.clone().applyMatrix4(s.matrixWorld),index:c,face:null,faceIndex:null,barycoord:null,object:s}}const gg=new Y,_g=new Y;class Cf extends KM{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let a=0,l=t.count;a<l;a+=2)gg.fromBufferAttribute(t,a),_g.fromBufferAttribute(t,a+1),i[a]=a===0?0:i[a-1],i[a+1]=i[a]+gg.distanceTo(_g);e.setAttribute("lineDistance",new hn(i,1))}else at("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Zo extends lr{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ut(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const xg=new zt,Rf=new pu,Bc=new Ks,zc=new Y;class Rh extends tn{constructor(e=new qn,t=new Zo){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,a=this.matrixWorld,l=e.params.Points.threshold,c=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Bc.copy(i.boundingSphere),Bc.applyMatrix4(a),Bc.radius+=l,e.ray.intersectsSphere(Bc)===!1)return;xg.copy(a).invert(),Rf.copy(e.ray).applyMatrix4(xg);const d=l/((this.scale.x+this.scale.y+this.scale.z)/3),h=d*d,f=i.index,m=i.attributes.position;if(f!==null){const g=Math.max(0,c.start),y=Math.min(f.count,c.start+c.count);for(let M=g,b=y;M<b;M++){const S=f.getX(M);zc.fromBufferAttribute(m,S),vg(zc,S,h,a,e,t,this)}}else{const g=Math.max(0,c.start),y=Math.min(m.count,c.start+c.count);for(let M=g,b=y;M<b;M++)zc.fromBufferAttribute(m,M),vg(zc,M,h,a,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const a=t[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let l=0,c=a.length;l<c;l++){const d=a[l].name||String(l);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=l}}}}}function vg(s,e,t,i,a,l,c){const d=Rf.distanceSqToPoint(s);if(d<t){const h=new Y;Rf.closestPointToPoint(s,h),h.applyMatrix4(i);const f=a.ray.origin.distanceTo(h);if(f<a.near||f>a.far)return;l.push({distance:f,distanceToRay:Math.sqrt(d),point:h,index:e,face:null,faceIndex:null,barycoord:null,object:c})}}class Z_ extends Xn{constructor(e=[],t=qs,i,a,l,c,d,h,f,_){super(e,t,i,a,l,c,d,h,f,_),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class ol extends Xn{constructor(e,t,i=ar,a,l,c,d=Pn,h=Pn,f,_=Lr,m=1){if(_!==Lr&&_!==ks)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const g={width:e,height:t,depth:m};super(g,a,l,c,d,h,_,i,f),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new qf(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class ZM extends ol{constructor(e,t=ar,i=qs,a,l,c=Pn,d=Pn,h,f=Lr){const _={width:e,height:e,depth:1},m=[_,_,_,_,_,_];super(e,e,t,i,a,l,c,d,h,f),this.image=m,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Q_ extends Xn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Bi extends qn{constructor(e=1,t=1,i=1,a=1,l=1,c=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:a,heightSegments:l,depthSegments:c};const d=this;a=Math.floor(a),l=Math.floor(l),c=Math.floor(c);const h=[],f=[],_=[],m=[];let g=0,y=0;M("z","y","x",-1,-1,i,t,e,c,l,0),M("z","y","x",1,-1,i,t,-e,c,l,1),M("x","z","y",1,1,e,i,t,a,c,2),M("x","z","y",1,-1,e,i,-t,a,c,3),M("x","y","z",1,-1,e,t,i,a,l,4),M("x","y","z",-1,-1,e,t,-i,a,l,5),this.setIndex(h),this.setAttribute("position",new hn(f,3)),this.setAttribute("normal",new hn(_,3)),this.setAttribute("uv",new hn(m,2));function M(b,S,v,R,I,T,N,L,U,w,D){const B=T/U,z=N/w,j=T/2,te=N/2,V=L/2,Q=U+1,he=w+1;let re=0,J=0;const $=new Y;for(let K=0;K<he;K++){const F=K*z-te;for(let ae=0;ae<Q;ae++){const Se=ae*B-j;$[b]=Se*R,$[S]=F*I,$[v]=V,f.push($.x,$.y,$.z),$[b]=0,$[S]=0,$[v]=L>0?1:-1,_.push($.x,$.y,$.z),m.push(ae/U),m.push(1-K/w),re+=1}}for(let K=0;K<w;K++)for(let F=0;F<U;F++){const ae=g+F+Q*K,Se=g+F+Q*(K+1),Ge=g+(F+1)+Q*(K+1),He=g+(F+1)+Q*K;h.push(ae,Se,He),h.push(Se,Ge,He),J+=6}d.addGroup(y,J,D),y+=J,g+=re}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Bi(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Fs extends qn{constructor(e=1,t=1,i=1,a=32,l=1,c=!1,d=0,h=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:a,heightSegments:l,openEnded:c,thetaStart:d,thetaLength:h};const f=this;a=Math.floor(a),l=Math.floor(l);const _=[],m=[],g=[],y=[];let M=0;const b=[],S=i/2;let v=0;R(),c===!1&&(e>0&&I(!0),t>0&&I(!1)),this.setIndex(_),this.setAttribute("position",new hn(m,3)),this.setAttribute("normal",new hn(g,3)),this.setAttribute("uv",new hn(y,2));function R(){const T=new Y,N=new Y;let L=0;const U=(t-e)/i;for(let w=0;w<=l;w++){const D=[],B=w/l,z=B*(t-e)+e;for(let j=0;j<=a;j++){const te=j/a,V=te*h+d,Q=Math.sin(V),he=Math.cos(V);N.x=z*Q,N.y=-B*i+S,N.z=z*he,m.push(N.x,N.y,N.z),T.set(Q,U,he).normalize(),g.push(T.x,T.y,T.z),y.push(te,1-B),D.push(M++)}b.push(D)}for(let w=0;w<a;w++)for(let D=0;D<l;D++){const B=b[D][w],z=b[D+1][w],j=b[D+1][w+1],te=b[D][w+1];(e>0||D!==0)&&(_.push(B,z,te),L+=3),(t>0||D!==l-1)&&(_.push(z,j,te),L+=3)}f.addGroup(v,L,0),v+=L}function I(T){const N=M,L=new ot,U=new Y;let w=0;const D=T===!0?e:t,B=T===!0?1:-1;for(let j=1;j<=a;j++)m.push(0,S*B,0),g.push(0,B,0),y.push(.5,.5),M++;const z=M;for(let j=0;j<=a;j++){const V=j/a*h+d,Q=Math.cos(V),he=Math.sin(V);U.x=D*he,U.y=S*B,U.z=D*Q,m.push(U.x,U.y,U.z),g.push(0,B,0),L.x=Q*.5+.5,L.y=he*.5*B+.5,y.push(L.x,L.y),M++}for(let j=0;j<a;j++){const te=N+j,V=z+j;T===!0?_.push(V,V+1,te):_.push(V+1,V,te),w+=3}f.addGroup(v,w,T===!0?1:2),v+=w}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Fs(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Nr extends qn{constructor(e=1,t=1,i=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:a};const l=e/2,c=t/2,d=Math.floor(i),h=Math.floor(a),f=d+1,_=h+1,m=e/d,g=t/h,y=[],M=[],b=[],S=[];for(let v=0;v<_;v++){const R=v*g-c;for(let I=0;I<f;I++){const T=I*m-l;M.push(T,-R,0),b.push(0,0,1),S.push(I/d),S.push(1-v/h)}}for(let v=0;v<h;v++)for(let R=0;R<d;R++){const I=R+f*v,T=R+f*(v+1),N=R+1+f*(v+1),L=R+1+f*v;y.push(I,T,L),y.push(T,N,L)}this.setIndex(y),this.setAttribute("position",new hn(M,3)),this.setAttribute("normal",new hn(b,3)),this.setAttribute("uv",new hn(S,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Nr(e.width,e.height,e.widthSegments,e.heightSegments)}}function Ja(s){const e={};for(const t in s){e[t]={};for(const i in s[t]){const a=s[t][i];if(yg(a))a.isRenderTargetTexture?(at("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=a.clone();else if(Array.isArray(a))if(yg(a[0])){const l=[];for(let c=0,d=a.length;c<d;c++)l[c]=a[c].clone();e[t][i]=l}else e[t][i]=a.slice();else e[t][i]=a}}return e}function Wn(s){const e={};for(let t=0;t<s.length;t++){const i=Ja(s[t]);for(const a in i)e[a]=i[a]}return e}function yg(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function QM(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function J_(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:wt.workingColorSpace}const JM={clone:Ja,merge:Wn};var eE=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,tE=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class cr extends lr{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=eE,this.fragmentShader=tE,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ja(e.uniforms),this.uniformsGroups=QM(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const a in this.uniforms){const c=this.uniforms[a].value;c&&c.isTexture?t.uniforms[a]={type:"t",value:c.toJSON(e).uuid}:c&&c.isColor?t.uniforms[a]={type:"c",value:c.getHex()}:c&&c.isVector2?t.uniforms[a]={type:"v2",value:c.toArray()}:c&&c.isVector3?t.uniforms[a]={type:"v3",value:c.toArray()}:c&&c.isVector4?t.uniforms[a]={type:"v4",value:c.toArray()}:c&&c.isMatrix3?t.uniforms[a]={type:"m3",value:c.toArray()}:c&&c.isMatrix4?t.uniforms[a]={type:"m4",value:c.toArray()}:t.uniforms[a]={value:c}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const a in this.extensions)this.extensions[a]===!0&&(i[a]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const i in e.uniforms){const a=e.uniforms[i];switch(this.uniforms[i]={},a.type){case"t":this.uniforms[i].value=t[a.value]||null;break;case"c":this.uniforms[i].value=new ut().setHex(a.value);break;case"v2":this.uniforms[i].value=new ot().fromArray(a.value);break;case"v3":this.uniforms[i].value=new Y().fromArray(a.value);break;case"v4":this.uniforms[i].value=new en().fromArray(a.value);break;case"m3":this.uniforms[i].value=new dt().fromArray(a.value);break;case"m4":this.uniforms[i].value=new zt().fromArray(a.value);break;default:this.uniforms[i].value=a.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class nE extends cr{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Ki extends lr{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ut(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ut(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ru,this.normalScale=new ot(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Dr,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class iE extends Ki{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ot(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return vt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new ut(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new ut(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new ut(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class rE extends lr{constructor(e){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new ut(16777215),this.specular=new ut(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ut(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ru,this.normalScale=new ot(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Dr,this.combine=Of,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class sE extends lr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=uM,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class aE extends lr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Sg={enabled:!1,files:{},add:function(s,e){this.enabled!==!1&&(Mg(s)||(this.files[s]=e))},get:function(s){if(this.enabled!==!1&&!Mg(s))return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};function Mg(s){try{const e=s.slice(s.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class oE{constructor(e,t,i){const a=this;let l=!1,c=0,d=0,h;const f=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this._abortController=null,this.itemStart=function(_){d++,l===!1&&a.onStart!==void 0&&a.onStart(_,c,d),l=!0},this.itemEnd=function(_){c++,a.onProgress!==void 0&&a.onProgress(_,c,d),c===d&&(l=!1,a.onLoad!==void 0&&a.onLoad())},this.itemError=function(_){a.onError!==void 0&&a.onError(_)},this.resolveURL=function(_){return _=_.normalize("NFC"),h?h(_):_},this.setURLModifier=function(_){return h=_,this},this.addHandler=function(_,m){return f.push(_,m),this},this.removeHandler=function(_){const m=f.indexOf(_);return m!==-1&&f.splice(m,2),this},this.getHandler=function(_){for(let m=0,g=f.length;m<g;m+=2){const y=f[m],M=f[m+1];if(y.global&&(y.lastIndex=0),y.test(_))return M}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const lE=new oE;class Kf{constructor(e){this.manager=e!==void 0?e:lE,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){const i=this;return new Promise(function(a,l){i.load(e,a,t,l)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}Kf.DEFAULT_MATERIAL_NAME="__DEFAULT";const wr={};class cE extends Error{constructor(e,t){super(e),this.response=t}}class uE extends Kf{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,i,a){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const l=Sg.get(`file:${e}`);if(l!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(l),this.manager.itemEnd(e)},0);return}if(wr[e]!==void 0){wr[e].push({onLoad:t,onProgress:i,onError:a});return}wr[e]=[],wr[e].push({onLoad:t,onProgress:i,onError:a});const c=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),d=this.mimeType,h=this.responseType;fetch(c).then(f=>{if(f.status===200||f.status===0){if(f.status===0&&at("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||f.body===void 0||f.body.getReader===void 0)return f;const _=wr[e],m=f.body.getReader(),g=f.headers.get("X-File-Size")||f.headers.get("Content-Length"),y=g?parseInt(g):0,M=y!==0;let b=0;const S=new ReadableStream({start(v){R();function R(){m.read().then(({done:I,value:T})=>{if(I)v.close();else{b+=T.byteLength;const N=new ProgressEvent("progress",{lengthComputable:M,loaded:b,total:y});for(let L=0,U=_.length;L<U;L++){const w=_[L];w.onProgress&&w.onProgress(N)}v.enqueue(T),R()}},I=>{v.error(I)})}}});return new Response(S)}else throw new cE(`fetch for "${f.url}" responded with ${f.status}: ${f.statusText}`,f)}).then(f=>{switch(h){case"arraybuffer":return f.arrayBuffer();case"blob":return f.blob();case"document":return f.text().then(_=>new DOMParser().parseFromString(_,d));case"json":return f.json();default:if(d==="")return f.text();{const m=/charset="?([^;"\s]*)"?/i.exec(d),g=m&&m[1]?m[1].toLowerCase():void 0,y=new TextDecoder(g);return f.arrayBuffer().then(M=>y.decode(M))}}}).then(f=>{Sg.add(`file:${e}`,f);const _=wr[e];delete wr[e];for(let m=0,g=_.length;m<g;m++){const y=_[m];y.onLoad&&y.onLoad(f)}}).catch(f=>{const _=wr[e];if(_===void 0)throw this.manager.itemError(e),f;delete wr[e];for(let m=0,g=_.length;m<g;m++){const y=_[m];y.onError&&y.onError(f)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}class mu extends tn{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ut(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class dE extends mu{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(tn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ut(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const Ph=new zt,Eg=new Y,wg=new Y;class ex{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ot(512,512),this.mapType=di,this.map=null,this.mapPass=null,this.matrix=new zt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new $f,this._frameExtents=new ot(1,1),this._viewportCount=1,this._viewports=[new en(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera;Eg.setFromMatrixPosition(e.matrixWorld),t.position.copy(Eg),wg.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(wg),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,i,a){Ph.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),i.setFromProjectionMatrix(Ph,e.coordinateSystem,e.reversedDepth);const l=this._frameExtents,c=a?a.z/l.x:1,d=a?a.w/l.y:1,h=a?a.x/l.x:0,f=a?a.y/l.y:0;e.coordinateSystem===al||e.reversedDepth?t.set(.5*c,0,0,.5*c+h,0,.5*d,0,.5*d+f,0,0,1,0,0,0,0,1):t.set(.5*c,0,0,.5*c+h,0,.5*d,0,.5*d+f,0,0,.5,.5,0,0,0,1),t.multiply(Ph)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Hc=new Y,Vc=new hs,Yi=new Y;class tx extends tn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new zt,this.projectionMatrix=new zt,this.projectionMatrixInverse=new zt,this.coordinateSystem=nr,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Hc,Vc,Yi),Yi.x===1&&Yi.y===1&&Yi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Hc,Vc,Yi.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(Hc,Vc,Yi),Yi.x===1&&Yi.y===1&&Yi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Hc,Vc,Yi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const ns=new Y,bg=new ot,Tg=new ot;class ui extends tx{constructor(e=50,t=1,i=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=a,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=lu*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Qc*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return lu*2*Math.atan(Math.tan(Qc*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){ns.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ns.x,ns.y).multiplyScalar(-e/ns.z),ns.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ns.x,ns.y).multiplyScalar(-e/ns.z)}getViewSize(e,t){return this.getViewBounds(e,bg,Tg),t.subVectors(Tg,bg)}setViewOffset(e,t,i,a,l,c){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=a,this.view.width=l,this.view.height=c,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Qc*.5*this.fov)/this.zoom,i=2*t,a=this.aspect*i,l=-.5*a;const c=this.view;if(this.view!==null&&this.view.enabled){const h=c.fullWidth,f=c.fullHeight;l+=c.offsetX*a/h,t-=c.offsetY*i/f,a*=c.width/h,i*=c.height/f}const d=this.filmOffset;d!==0&&(l+=e*d/this.getFilmWidth()),this.projectionMatrix.makePerspective(l,l+a,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class hE extends ex{constructor(){super(new ui(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,i=lu*2*e.angle*this.focus,a=this.mapSize.width/this.mapSize.height*this.aspect,l=e.distance||t.far;(i!==t.fov||a!==t.aspect||l!==t.far)&&(t.fov=i,t.aspect=a,t.far=l,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){const e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}}class fE extends mu{constructor(e,t,i=0,a=Math.PI/3,l=0,c=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(tn.DEFAULT_UP),this.updateMatrix(),this.target=new tn,this.distance=i,this.angle=a,this.penumbra=l,this.decay=c,this.map=null,this.shadow=new hE}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}}class Zf extends tx{constructor(e=-1,t=1,i=1,a=-1,l=.1,c=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=a,this.near=l,this.far=c,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,a,l,c){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=a,this.view.width=l,this.view.height=c,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let l=i-e,c=i+e,d=a+t,h=a-t;if(this.view!==null&&this.view.enabled){const f=(this.right-this.left)/this.view.fullWidth/this.zoom,_=(this.top-this.bottom)/this.view.fullHeight/this.zoom;l+=f*this.view.offsetX,c=l+f*this.view.width,d-=_*this.view.offsetY,h=d-_*this.view.height}this.projectionMatrix.makeOrthographic(l,c,d,h,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class pE extends ex{constructor(){super(new Zf(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Ag extends mu{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(tn.DEFAULT_UP),this.updateMatrix(),this.target=new tn,this.shadow=new pE}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class mE extends mu{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}const Da=-90,Ia=1;class gE extends tn{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new ui(Da,Ia,e,t);a.layers=this.layers,this.add(a);const l=new ui(Da,Ia,e,t);l.layers=this.layers,this.add(l);const c=new ui(Da,Ia,e,t);c.layers=this.layers,this.add(c);const d=new ui(Da,Ia,e,t);d.layers=this.layers,this.add(d);const h=new ui(Da,Ia,e,t);h.layers=this.layers,this.add(h);const f=new ui(Da,Ia,e,t);f.layers=this.layers,this.add(f)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,a,l,c,d,h]=t;for(const f of t)this.remove(f);if(e===nr)i.up.set(0,1,0),i.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),l.up.set(0,0,-1),l.lookAt(0,1,0),c.up.set(0,0,1),c.lookAt(0,-1,0),d.up.set(0,1,0),d.lookAt(0,0,1),h.up.set(0,1,0),h.lookAt(0,0,-1);else if(e===al)i.up.set(0,-1,0),i.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),l.up.set(0,0,1),l.lookAt(0,1,0),c.up.set(0,0,-1),c.lookAt(0,-1,0),d.up.set(0,-1,0),d.lookAt(0,0,1),h.up.set(0,-1,0),h.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const f of t)this.add(f),f.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:a}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[l,c,d,h,f,_]=this.children,m=e.getRenderTarget(),g=e.getActiveCubeFace(),y=e.getActiveMipmapLevel(),M=e.xr.enabled;e.xr.enabled=!1;const b=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let S=!1;e.isWebGLRenderer===!0?S=e.state.buffers.depth.getReversed():S=e.reversedDepthBuffer,e.setRenderTarget(i,0,a),S&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(i,1,a),S&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(i,2,a),S&&e.autoClear===!1&&e.clearDepth(),e.render(t,d),e.setRenderTarget(i,3,a),S&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(i,4,a),S&&e.autoClear===!1&&e.clearDepth(),e.render(t,f),i.texture.generateMipmaps=b,e.setRenderTarget(i,5,a),S&&e.autoClear===!1&&e.clearDepth(),e.render(t,_),e.setRenderTarget(m,g,y),e.xr.enabled=M,i.texture.needsPMREMUpdate=!0}}class _E extends ui{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class Cg{constructor(e=1,t=0,i=0){this.radius=e,this.phi=t,this.theta=i}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=vt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(vt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const ip=class ip{constructor(e,t,i,a){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,a)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,a){const l=this.elements;return l[0]=e,l[2]=t,l[1]=i,l[3]=a,this}};ip.prototype.isMatrix2=!0;let Rg=ip;class xE extends fs{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function Pg(s,e,t,i){const a=vE(i);switch(t){case V_:return s*e;case Hf:return s*e/a.components*a.byteLength;case Vf:return s*e/a.components*a.byteLength;case Ys:return s*e*2/a.components*a.byteLength;case Gf:return s*e*2/a.components*a.byteLength;case G_:return s*e*3/a.components*a.byteLength;case Vi:return s*e*4/a.components*a.byteLength;case Wf:return s*e*4/a.components*a.byteLength;case Yc:case $c:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Kc:case Zc:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Qh:case ef:return Math.max(s,16)*Math.max(e,8)/4;case Zh:case Jh:return Math.max(s,8)*Math.max(e,8)/2;case tf:case nf:case sf:case af:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case rf:case nu:case of:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case lf:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case cf:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case uf:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case df:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case hf:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case ff:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case pf:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case mf:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case gf:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case _f:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case xf:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case vf:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case yf:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case Sf:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case Mf:case Ef:case wf:return Math.ceil(s/4)*Math.ceil(e/4)*16;case bf:case Tf:return Math.ceil(s/4)*Math.ceil(e/4)*8;case iu:case Af:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function vE(s){switch(s){case di:case k_:return{byteLength:1,components:1};case rl:case B_:case or:return{byteLength:2,components:1};case Bf:case zf:return{byteLength:2,components:4};case ar:case kf:case Hi:return{byteLength:4,components:1};case z_:case H_:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ff}}));typeof window<"u"&&(window.__THREE__?at("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ff);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function nx(){let s=null,e=!1,t=null,i=null;function a(l,c){i=s.requestAnimationFrame(a),t(l,c)}return{start:function(){e!==!0&&t!==null&&s!==null&&(i=s.requestAnimationFrame(a),e=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(l){t=l},setContext:function(l){s=l}}}function yE(s){const e=new WeakMap;function t(d,h){const f=d.array,_=d.usage,m=f.byteLength,g=s.createBuffer();s.bindBuffer(h,g),s.bufferData(h,f,_),d.onUploadCallback();let y;if(f instanceof Float32Array)y=s.FLOAT;else if(typeof Float16Array<"u"&&f instanceof Float16Array)y=s.HALF_FLOAT;else if(f instanceof Uint16Array)d.isFloat16BufferAttribute?y=s.HALF_FLOAT:y=s.UNSIGNED_SHORT;else if(f instanceof Int16Array)y=s.SHORT;else if(f instanceof Uint32Array)y=s.UNSIGNED_INT;else if(f instanceof Int32Array)y=s.INT;else if(f instanceof Int8Array)y=s.BYTE;else if(f instanceof Uint8Array)y=s.UNSIGNED_BYTE;else if(f instanceof Uint8ClampedArray)y=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+f);return{buffer:g,type:y,bytesPerElement:f.BYTES_PER_ELEMENT,version:d.version,size:m}}function i(d,h,f){const _=h.array,m=h.updateRanges;if(s.bindBuffer(f,d),m.length===0)s.bufferSubData(f,0,_);else{m.sort((y,M)=>y.start-M.start);let g=0;for(let y=1;y<m.length;y++){const M=m[g],b=m[y];b.start<=M.start+M.count+1?M.count=Math.max(M.count,b.start+b.count-M.start):(++g,m[g]=b)}m.length=g+1;for(let y=0,M=m.length;y<M;y++){const b=m[y];s.bufferSubData(f,b.start*_.BYTES_PER_ELEMENT,_,b.start,b.count)}h.clearUpdateRanges()}h.onUploadCallback()}function a(d){return d.isInterleavedBufferAttribute&&(d=d.data),e.get(d)}function l(d){d.isInterleavedBufferAttribute&&(d=d.data);const h=e.get(d);h&&(s.deleteBuffer(h.buffer),e.delete(d))}function c(d,h){if(d.isInterleavedBufferAttribute&&(d=d.data),d.isGLBufferAttribute){const _=e.get(d);(!_||_.version<d.version)&&e.set(d,{buffer:d.buffer,type:d.type,bytesPerElement:d.elementSize,version:d.version});return}const f=e.get(d);if(f===void 0)e.set(d,t(d,h));else if(f.version<d.version){if(f.size!==d.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(f.buffer,d,h),f.version=d.version}}return{get:a,remove:l,update:c}}var SE=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ME=`#ifdef USE_ALPHAHASH
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
#endif`,EE=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,wE=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,bE=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,TE=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,AE=`#ifdef USE_AOMAP
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
#endif`,CE=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,RE=`#ifdef USE_BATCHING
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
#endif`,PE=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,NE=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,LE=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,DE=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,IE=`#ifdef USE_IRIDESCENCE
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
#endif`,UE=`#ifdef USE_BUMPMAP
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
#endif`,FE=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,OE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,kE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,BE=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,zE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,HE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,VE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,GE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,WE=`#define PI 3.141592653589793
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
} // validated`,jE=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,XE=`vec3 transformedNormal = objectNormal;
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
#endif`,qE=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,YE=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,$E=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,KE=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,ZE="gl_FragColor = linearToOutputTexel( gl_FragColor );",QE=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,JE=`#ifdef USE_ENVMAP
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
#endif`,e1=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,t1=`#ifdef USE_ENVMAP
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
#endif`,n1=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,i1=`#ifdef USE_ENVMAP
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
#endif`,r1=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,s1=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,a1=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,o1=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,l1=`#ifdef USE_GRADIENTMAP
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
}`,c1=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,u1=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,d1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,h1=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,f1=`#ifdef USE_ENVMAP
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
#endif`,p1=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,m1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,g1=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,_1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,x1=`PhysicalMaterial material;
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
#endif`,v1=`uniform sampler2D dfgLUT;
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
}`,y1=`
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
#endif`,S1=`#if defined( RE_IndirectDiffuse )
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
#endif`,M1=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,E1=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,w1=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,b1=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,T1=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,A1=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,C1=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,R1=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,P1=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,N1=`#if defined( USE_POINTS_UV )
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
#endif`,L1=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,D1=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,I1=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,U1=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,F1=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,O1=`#ifdef USE_MORPHTARGETS
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
#endif`,k1=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,B1=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,z1=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,H1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,V1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,G1=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,W1=`#ifdef USE_NORMALMAP
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
#endif`,j1=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,X1=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,q1=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Y1=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,$1=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,K1=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Z1=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Q1=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,J1=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,ew=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,tw=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,nw=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,iw=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,rw=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,sw=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,aw=`float getShadowMask() {
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
}`,ow=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,lw=`#ifdef USE_SKINNING
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
#endif`,cw=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,uw=`#ifdef USE_SKINNING
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
#endif`,dw=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,hw=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,fw=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,pw=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,mw=`#ifdef USE_TRANSMISSION
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
#endif`,gw=`#ifdef USE_TRANSMISSION
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
#endif`,_w=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,xw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,vw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,yw=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Sw=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Mw=`uniform sampler2D t2D;
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
}`,Ew=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ww=`#ifdef ENVMAP_TYPE_CUBE
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
}`,bw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Tw=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Aw=`#include <common>
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
}`,Cw=`#if DEPTH_PACKING == 3200
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
}`,Rw=`#define DISTANCE
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
}`,Pw=`#define DISTANCE
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
}`,Nw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Lw=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Dw=`uniform float scale;
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
}`,Iw=`uniform vec3 diffuse;
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
}`,Uw=`#include <common>
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
}`,Fw=`uniform vec3 diffuse;
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
}`,Ow=`#define LAMBERT
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
}`,kw=`#define LAMBERT
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
}`,Bw=`#define MATCAP
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
}`,zw=`#define MATCAP
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
}`,Hw=`#define NORMAL
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
}`,Vw=`#define NORMAL
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
}`,Gw=`#define PHONG
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
}`,Ww=`#define PHONG
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
}`,jw=`#define STANDARD
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
}`,Xw=`#define STANDARD
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
}`,qw=`#define TOON
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
}`,Yw=`#define TOON
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
}`,$w=`uniform float size;
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
}`,Kw=`uniform vec3 diffuse;
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
}`,Zw=`#include <common>
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
}`,Qw=`uniform vec3 color;
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
}`,Jw=`uniform float rotation;
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
}`,eb=`uniform vec3 diffuse;
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
}`,_t={alphahash_fragment:SE,alphahash_pars_fragment:ME,alphamap_fragment:EE,alphamap_pars_fragment:wE,alphatest_fragment:bE,alphatest_pars_fragment:TE,aomap_fragment:AE,aomap_pars_fragment:CE,batching_pars_vertex:RE,batching_vertex:PE,begin_vertex:NE,beginnormal_vertex:LE,bsdfs:DE,iridescence_fragment:IE,bumpmap_pars_fragment:UE,clipping_planes_fragment:FE,clipping_planes_pars_fragment:OE,clipping_planes_pars_vertex:kE,clipping_planes_vertex:BE,color_fragment:zE,color_pars_fragment:HE,color_pars_vertex:VE,color_vertex:GE,common:WE,cube_uv_reflection_fragment:jE,defaultnormal_vertex:XE,displacementmap_pars_vertex:qE,displacementmap_vertex:YE,emissivemap_fragment:$E,emissivemap_pars_fragment:KE,colorspace_fragment:ZE,colorspace_pars_fragment:QE,envmap_fragment:JE,envmap_common_pars_fragment:e1,envmap_pars_fragment:t1,envmap_pars_vertex:n1,envmap_physical_pars_fragment:f1,envmap_vertex:i1,fog_vertex:r1,fog_pars_vertex:s1,fog_fragment:a1,fog_pars_fragment:o1,gradientmap_pars_fragment:l1,lightmap_pars_fragment:c1,lights_lambert_fragment:u1,lights_lambert_pars_fragment:d1,lights_pars_begin:h1,lights_toon_fragment:p1,lights_toon_pars_fragment:m1,lights_phong_fragment:g1,lights_phong_pars_fragment:_1,lights_physical_fragment:x1,lights_physical_pars_fragment:v1,lights_fragment_begin:y1,lights_fragment_maps:S1,lights_fragment_end:M1,lightprobes_pars_fragment:E1,logdepthbuf_fragment:w1,logdepthbuf_pars_fragment:b1,logdepthbuf_pars_vertex:T1,logdepthbuf_vertex:A1,map_fragment:C1,map_pars_fragment:R1,map_particle_fragment:P1,map_particle_pars_fragment:N1,metalnessmap_fragment:L1,metalnessmap_pars_fragment:D1,morphinstance_vertex:I1,morphcolor_vertex:U1,morphnormal_vertex:F1,morphtarget_pars_vertex:O1,morphtarget_vertex:k1,normal_fragment_begin:B1,normal_fragment_maps:z1,normal_pars_fragment:H1,normal_pars_vertex:V1,normal_vertex:G1,normalmap_pars_fragment:W1,clearcoat_normal_fragment_begin:j1,clearcoat_normal_fragment_maps:X1,clearcoat_pars_fragment:q1,iridescence_pars_fragment:Y1,opaque_fragment:$1,packing:K1,premultiplied_alpha_fragment:Z1,project_vertex:Q1,dithering_fragment:J1,dithering_pars_fragment:ew,roughnessmap_fragment:tw,roughnessmap_pars_fragment:nw,shadowmap_pars_fragment:iw,shadowmap_pars_vertex:rw,shadowmap_vertex:sw,shadowmask_pars_fragment:aw,skinbase_vertex:ow,skinning_pars_vertex:lw,skinning_vertex:cw,skinnormal_vertex:uw,specularmap_fragment:dw,specularmap_pars_fragment:hw,tonemapping_fragment:fw,tonemapping_pars_fragment:pw,transmission_fragment:mw,transmission_pars_fragment:gw,uv_pars_fragment:_w,uv_pars_vertex:xw,uv_vertex:vw,worldpos_vertex:yw,background_vert:Sw,background_frag:Mw,backgroundCube_vert:Ew,backgroundCube_frag:ww,cube_vert:bw,cube_frag:Tw,depth_vert:Aw,depth_frag:Cw,distance_vert:Rw,distance_frag:Pw,equirect_vert:Nw,equirect_frag:Lw,linedashed_vert:Dw,linedashed_frag:Iw,meshbasic_vert:Uw,meshbasic_frag:Fw,meshlambert_vert:Ow,meshlambert_frag:kw,meshmatcap_vert:Bw,meshmatcap_frag:zw,meshnormal_vert:Hw,meshnormal_frag:Vw,meshphong_vert:Gw,meshphong_frag:Ww,meshphysical_vert:jw,meshphysical_frag:Xw,meshtoon_vert:qw,meshtoon_frag:Yw,points_vert:$w,points_frag:Kw,shadow_vert:Zw,shadow_frag:Qw,sprite_vert:Jw,sprite_frag:eb},Ue={common:{diffuse:{value:new ut(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new dt},alphaMap:{value:null},alphaMapTransform:{value:new dt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new dt}},envmap:{envMap:{value:null},envMapRotation:{value:new dt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new dt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new dt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new dt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new dt},normalScale:{value:new ot(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new dt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new dt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new dt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new dt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ut(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new Y},probesMax:{value:new Y},probesResolution:{value:new Y}},points:{diffuse:{value:new ut(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new dt},alphaTest:{value:0},uvTransform:{value:new dt}},sprite:{diffuse:{value:new ut(16777215)},opacity:{value:1},center:{value:new ot(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new dt},alphaMap:{value:null},alphaMapTransform:{value:new dt},alphaTest:{value:0}}},er={basic:{uniforms:Wn([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.fog]),vertexShader:_t.meshbasic_vert,fragmentShader:_t.meshbasic_frag},lambert:{uniforms:Wn([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,Ue.lights,{emissive:{value:new ut(0)},envMapIntensity:{value:1}}]),vertexShader:_t.meshlambert_vert,fragmentShader:_t.meshlambert_frag},phong:{uniforms:Wn([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,Ue.lights,{emissive:{value:new ut(0)},specular:{value:new ut(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:_t.meshphong_vert,fragmentShader:_t.meshphong_frag},standard:{uniforms:Wn([Ue.common,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.roughnessmap,Ue.metalnessmap,Ue.fog,Ue.lights,{emissive:{value:new ut(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:_t.meshphysical_vert,fragmentShader:_t.meshphysical_frag},toon:{uniforms:Wn([Ue.common,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.gradientmap,Ue.fog,Ue.lights,{emissive:{value:new ut(0)}}]),vertexShader:_t.meshtoon_vert,fragmentShader:_t.meshtoon_frag},matcap:{uniforms:Wn([Ue.common,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,{matcap:{value:null}}]),vertexShader:_t.meshmatcap_vert,fragmentShader:_t.meshmatcap_frag},points:{uniforms:Wn([Ue.points,Ue.fog]),vertexShader:_t.points_vert,fragmentShader:_t.points_frag},dashed:{uniforms:Wn([Ue.common,Ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:_t.linedashed_vert,fragmentShader:_t.linedashed_frag},depth:{uniforms:Wn([Ue.common,Ue.displacementmap]),vertexShader:_t.depth_vert,fragmentShader:_t.depth_frag},normal:{uniforms:Wn([Ue.common,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,{opacity:{value:1}}]),vertexShader:_t.meshnormal_vert,fragmentShader:_t.meshnormal_frag},sprite:{uniforms:Wn([Ue.sprite,Ue.fog]),vertexShader:_t.sprite_vert,fragmentShader:_t.sprite_frag},background:{uniforms:{uvTransform:{value:new dt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:_t.background_vert,fragmentShader:_t.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new dt}},vertexShader:_t.backgroundCube_vert,fragmentShader:_t.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:_t.cube_vert,fragmentShader:_t.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:_t.equirect_vert,fragmentShader:_t.equirect_frag},distance:{uniforms:Wn([Ue.common,Ue.displacementmap,{referencePosition:{value:new Y},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:_t.distance_vert,fragmentShader:_t.distance_frag},shadow:{uniforms:Wn([Ue.lights,Ue.fog,{color:{value:new ut(0)},opacity:{value:1}}]),vertexShader:_t.shadow_vert,fragmentShader:_t.shadow_frag}};er.physical={uniforms:Wn([er.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new dt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new dt},clearcoatNormalScale:{value:new ot(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new dt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new dt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new dt},sheen:{value:0},sheenColor:{value:new ut(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new dt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new dt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new dt},transmissionSamplerSize:{value:new ot},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new dt},attenuationDistance:{value:0},attenuationColor:{value:new ut(0)},specularColor:{value:new ut(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new dt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new dt},anisotropyVector:{value:new ot},anisotropyMap:{value:null},anisotropyMapTransform:{value:new dt}}]),vertexShader:_t.meshphysical_vert,fragmentShader:_t.meshphysical_frag};const Gc={r:0,b:0,g:0},tb=new zt,ix=new dt;ix.set(-1,0,0,0,1,0,0,0,1);function nb(s,e,t,i,a,l){const c=new ut(0);let d=a===!0?0:1,h,f,_=null,m=0,g=null;function y(R){let I=R.isScene===!0?R.background:null;if(I&&I.isTexture){const T=R.backgroundBlurriness>0;I=e.get(I,T)}return I}function M(R){let I=!1;const T=y(R);T===null?S(c,d):T&&T.isColor&&(S(T,1),I=!0);const N=s.xr.getEnvironmentBlendMode();N==="additive"?t.buffers.color.setClear(0,0,0,1,l):N==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,l),(s.autoClear||I)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function b(R,I){const T=y(I);T&&(T.isCubeTexture||T.mapping===fu)?(f===void 0&&(f=new Ot(new Bi(1,1,1),new cr({name:"BackgroundCubeMaterial",uniforms:Ja(er.backgroundCube.uniforms),vertexShader:er.backgroundCube.vertexShader,fragmentShader:er.backgroundCube.fragmentShader,side:ni,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),f.geometry.deleteAttribute("normal"),f.geometry.deleteAttribute("uv"),f.onBeforeRender=function(N,L,U){this.matrixWorld.copyPosition(U.matrixWorld)},Object.defineProperty(f.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(f)),f.material.uniforms.envMap.value=T,f.material.uniforms.backgroundBlurriness.value=I.backgroundBlurriness,f.material.uniforms.backgroundIntensity.value=I.backgroundIntensity,f.material.uniforms.backgroundRotation.value.setFromMatrix4(tb.makeRotationFromEuler(I.backgroundRotation)).transpose(),T.isCubeTexture&&T.isRenderTargetTexture===!1&&f.material.uniforms.backgroundRotation.value.premultiply(ix),f.material.toneMapped=wt.getTransfer(T.colorSpace)!==Ft,(_!==T||m!==T.version||g!==s.toneMapping)&&(f.material.needsUpdate=!0,_=T,m=T.version,g=s.toneMapping),f.layers.enableAll(),R.unshift(f,f.geometry,f.material,0,0,null)):T&&T.isTexture&&(h===void 0&&(h=new Ot(new Nr(2,2),new cr({name:"BackgroundMaterial",uniforms:Ja(er.background.uniforms),vertexShader:er.background.vertexShader,fragmentShader:er.background.fragmentShader,side:Xs,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(h)),h.material.uniforms.t2D.value=T,h.material.uniforms.backgroundIntensity.value=I.backgroundIntensity,h.material.toneMapped=wt.getTransfer(T.colorSpace)!==Ft,T.matrixAutoUpdate===!0&&T.updateMatrix(),h.material.uniforms.uvTransform.value.copy(T.matrix),(_!==T||m!==T.version||g!==s.toneMapping)&&(h.material.needsUpdate=!0,_=T,m=T.version,g=s.toneMapping),h.layers.enableAll(),R.unshift(h,h.geometry,h.material,0,0,null))}function S(R,I){R.getRGB(Gc,J_(s)),t.buffers.color.setClear(Gc.r,Gc.g,Gc.b,I,l)}function v(){f!==void 0&&(f.geometry.dispose(),f.material.dispose(),f=void 0),h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0)}return{getClearColor:function(){return c},setClearColor:function(R,I=1){c.set(R),d=I,S(c,d)},getClearAlpha:function(){return d},setClearAlpha:function(R){d=R,S(c,d)},render:M,addToRenderList:b,dispose:v}}function ib(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),i={},a=g(null);let l=a,c=!1;function d(z,j,te,V,Q){let he=!1;const re=m(z,V,te,j);l!==re&&(l=re,f(l.object)),he=y(z,V,te,Q),he&&M(z,V,te,Q),Q!==null&&e.update(Q,s.ELEMENT_ARRAY_BUFFER),(he||c)&&(c=!1,T(z,j,te,V),Q!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(Q).buffer))}function h(){return s.createVertexArray()}function f(z){return s.bindVertexArray(z)}function _(z){return s.deleteVertexArray(z)}function m(z,j,te,V){const Q=V.wireframe===!0;let he=i[j.id];he===void 0&&(he={},i[j.id]=he);const re=z.isInstancedMesh===!0?z.id:0;let J=he[re];J===void 0&&(J={},he[re]=J);let $=J[te.id];$===void 0&&($={},J[te.id]=$);let K=$[Q];return K===void 0&&(K=g(h()),$[Q]=K),K}function g(z){const j=[],te=[],V=[];for(let Q=0;Q<t;Q++)j[Q]=0,te[Q]=0,V[Q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:j,enabledAttributes:te,attributeDivisors:V,object:z,attributes:{},index:null}}function y(z,j,te,V){const Q=l.attributes,he=j.attributes;let re=0;const J=te.getAttributes();for(const $ in J)if(J[$].location>=0){const F=Q[$];let ae=he[$];if(ae===void 0&&($==="instanceMatrix"&&z.instanceMatrix&&(ae=z.instanceMatrix),$==="instanceColor"&&z.instanceColor&&(ae=z.instanceColor)),F===void 0||F.attribute!==ae||ae&&F.data!==ae.data)return!0;re++}return l.attributesNum!==re||l.index!==V}function M(z,j,te,V){const Q={},he=j.attributes;let re=0;const J=te.getAttributes();for(const $ in J)if(J[$].location>=0){let F=he[$];F===void 0&&($==="instanceMatrix"&&z.instanceMatrix&&(F=z.instanceMatrix),$==="instanceColor"&&z.instanceColor&&(F=z.instanceColor));const ae={};ae.attribute=F,F&&F.data&&(ae.data=F.data),Q[$]=ae,re++}l.attributes=Q,l.attributesNum=re,l.index=V}function b(){const z=l.newAttributes;for(let j=0,te=z.length;j<te;j++)z[j]=0}function S(z){v(z,0)}function v(z,j){const te=l.newAttributes,V=l.enabledAttributes,Q=l.attributeDivisors;te[z]=1,V[z]===0&&(s.enableVertexAttribArray(z),V[z]=1),Q[z]!==j&&(s.vertexAttribDivisor(z,j),Q[z]=j)}function R(){const z=l.newAttributes,j=l.enabledAttributes;for(let te=0,V=j.length;te<V;te++)j[te]!==z[te]&&(s.disableVertexAttribArray(te),j[te]=0)}function I(z,j,te,V,Q,he,re){re===!0?s.vertexAttribIPointer(z,j,te,Q,he):s.vertexAttribPointer(z,j,te,V,Q,he)}function T(z,j,te,V){b();const Q=V.attributes,he=te.getAttributes(),re=j.defaultAttributeValues;for(const J in he){const $=he[J];if($.location>=0){let K=Q[J];if(K===void 0&&(J==="instanceMatrix"&&z.instanceMatrix&&(K=z.instanceMatrix),J==="instanceColor"&&z.instanceColor&&(K=z.instanceColor)),K!==void 0){const F=K.normalized,ae=K.itemSize,Se=e.get(K);if(Se===void 0)continue;const Ge=Se.buffer,He=Se.type,We=Se.bytesPerElement,le=He===s.INT||He===s.UNSIGNED_INT||K.gpuType===kf;if(K.isInterleavedBufferAttribute){const de=K.data,we=de.stride,et=K.offset;if(de.isInstancedInterleavedBuffer){for(let Oe=0;Oe<$.locationSize;Oe++)v($.location+Oe,de.meshPerAttribute);z.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=de.meshPerAttribute*de.count)}else for(let Oe=0;Oe<$.locationSize;Oe++)S($.location+Oe);s.bindBuffer(s.ARRAY_BUFFER,Ge);for(let Oe=0;Oe<$.locationSize;Oe++)I($.location+Oe,ae/$.locationSize,He,F,we*We,(et+ae/$.locationSize*Oe)*We,le)}else{if(K.isInstancedBufferAttribute){for(let de=0;de<$.locationSize;de++)v($.location+de,K.meshPerAttribute);z.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let de=0;de<$.locationSize;de++)S($.location+de);s.bindBuffer(s.ARRAY_BUFFER,Ge);for(let de=0;de<$.locationSize;de++)I($.location+de,ae/$.locationSize,He,F,ae*We,ae/$.locationSize*de*We,le)}}else if(re!==void 0){const F=re[J];if(F!==void 0)switch(F.length){case 2:s.vertexAttrib2fv($.location,F);break;case 3:s.vertexAttrib3fv($.location,F);break;case 4:s.vertexAttrib4fv($.location,F);break;default:s.vertexAttrib1fv($.location,F)}}}}R()}function N(){D();for(const z in i){const j=i[z];for(const te in j){const V=j[te];for(const Q in V){const he=V[Q];for(const re in he)_(he[re].object),delete he[re];delete V[Q]}}delete i[z]}}function L(z){if(i[z.id]===void 0)return;const j=i[z.id];for(const te in j){const V=j[te];for(const Q in V){const he=V[Q];for(const re in he)_(he[re].object),delete he[re];delete V[Q]}}delete i[z.id]}function U(z){for(const j in i){const te=i[j];for(const V in te){const Q=te[V];if(Q[z.id]===void 0)continue;const he=Q[z.id];for(const re in he)_(he[re].object),delete he[re];delete Q[z.id]}}}function w(z){for(const j in i){const te=i[j],V=z.isInstancedMesh===!0?z.id:0,Q=te[V];if(Q!==void 0){for(const he in Q){const re=Q[he];for(const J in re)_(re[J].object),delete re[J];delete Q[he]}delete te[V],Object.keys(te).length===0&&delete i[j]}}}function D(){B(),c=!0,l!==a&&(l=a,f(l.object))}function B(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:d,reset:D,resetDefaultState:B,dispose:N,releaseStatesOfGeometry:L,releaseStatesOfObject:w,releaseStatesOfProgram:U,initAttributes:b,enableAttribute:S,disableUnusedAttributes:R}}function rb(s,e,t){let i;function a(h){i=h}function l(h,f){s.drawArrays(i,h,f),t.update(f,i,1)}function c(h,f,_){_!==0&&(s.drawArraysInstanced(i,h,f,_),t.update(f,i,_))}function d(h,f,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,h,0,f,0,_);let g=0;for(let y=0;y<_;y++)g+=f[y];t.update(g,i,1)}this.setMode=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=d}function sb(s,e,t,i){let a;function l(){if(a!==void 0)return a;if(e.has("EXT_texture_filter_anisotropic")===!0){const U=e.get("EXT_texture_filter_anisotropic");a=s.getParameter(U.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function c(U){return!(U!==Vi&&i.convert(U)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function d(U){const w=U===or&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(U!==di&&U!==Hi&&!w&&i.convert(U)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE))}function h(U){if(U==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";U="mediump"}return U==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let f=t.precision!==void 0?t.precision:"highp";const _=h(f);_!==f&&(at("WebGLRenderer:",f,"not supported, using",_,"instead."),f=_);const m=t.logarithmicDepthBuffer===!0,g=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&g===!1&&at("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const y=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),M=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),b=s.getParameter(s.MAX_TEXTURE_SIZE),S=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),v=s.getParameter(s.MAX_VERTEX_ATTRIBS),R=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),I=s.getParameter(s.MAX_VARYING_VECTORS),T=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),N=s.getParameter(s.MAX_SAMPLES),L=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:l,getMaxPrecision:h,textureFormatReadable:c,textureTypeReadable:d,precision:f,logarithmicDepthBuffer:m,reversedDepthBuffer:g,maxTextures:y,maxVertexTextures:M,maxTextureSize:b,maxCubemapSize:S,maxAttributes:v,maxVertexUniforms:R,maxVaryings:I,maxFragmentUniforms:T,maxSamples:N,samples:L}}function ab(s){const e=this;let t=null,i=0,a=!1,l=!1;const c=new Tr,d=new dt,h={value:null,needsUpdate:!1};this.uniform=h,this.numPlanes=0,this.numIntersection=0,this.init=function(m,g){const y=m.length!==0||g||i!==0||a;return a=g,i=m.length,y},this.beginShadows=function(){l=!0,_(null)},this.endShadows=function(){l=!1},this.setGlobalState=function(m,g){t=_(m,g,0)},this.setState=function(m,g,y){const M=m.clippingPlanes,b=m.clipIntersection,S=m.clipShadows,v=s.get(m);if(!a||M===null||M.length===0||l&&!S)l?_(null):f();else{const R=l?0:i,I=R*4;let T=v.clippingState||null;h.value=T,T=_(M,g,I,y);for(let N=0;N!==I;++N)T[N]=t[N];v.clippingState=T,this.numIntersection=b?this.numPlanes:0,this.numPlanes+=R}};function f(){h.value!==t&&(h.value=t,h.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function _(m,g,y,M){const b=m!==null?m.length:0;let S=null;if(b!==0){if(S=h.value,M!==!0||S===null){const v=y+b*4,R=g.matrixWorldInverse;d.getNormalMatrix(R),(S===null||S.length<v)&&(S=new Float32Array(v));for(let I=0,T=y;I!==b;++I,T+=4)c.copy(m[I]).applyMatrix4(R,d),c.normal.toArray(S,T),S[T+3]=c.constant}h.value=S,h.needsUpdate=!0}return e.numPlanes=b,e.numIntersection=0,S}}const ka=4,ob=6,lb=20,cb=256,Yo=new Zf,Ng=new ut;let Nh=null,Lh=0,Dh=0,Ih=!1;const ub=new Y,Us=new Y;class Lg{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,a=100,l={}){const{size:c=256,position:d=ub}=l;Nh=this._renderer.getRenderTarget(),Lh=this._renderer.getActiveCubeFace(),Dh=this._renderer.getActiveMipmapLevel(),Ih=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(c);const h=this._allocateTargets();return h.depthBuffer=!0,this._sceneToCubeUV(e,i,a,h,d),t>0&&this._blur(h,0,0,t),this._applyPMREM(h),this._cleanup(h),h}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ug(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ig(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Nh,Lh,Dh),this._renderer.xr.enabled=Ih,e.scissorTest=!1,Ua(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===qs||e.mapping===Qa?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Nh=this._renderer.getRenderTarget(),Lh=this._renderer.getActiveCubeFace(),Dh=this._renderer.getActiveMipmapLevel(),Ih=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:zn,minFilter:zn,generateMipmaps:!1,type:or,format:Vi,colorSpace:su,depthBuffer:!1},a=Dg(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Dg(e,t,i);const{_lodMax:l}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=db(l)),this._blurMaterial=fb(l,e,t),this._ggxMaterial=hb(l,e,t)}return a}_compileMaterial(e){const t=new Ot(new qn,e);this._renderer.compile(t,Yo)}_sceneToCubeUV(e,t,i,a,l){const h=new ui(90,1,t,i),f=[1,-1,1,1,1,1],_=[1,1,1,-1,-1,-1],m=this._renderer,g=m.autoClear,y=m.toneMapping;m.getClearColor(Ng),m.toneMapping=rr,m.autoClear=!1,m.state.buffers.depth.getReversed()&&(m.setRenderTarget(a),m.clearDepth(),m.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Ot(new Bi,new js({name:"PMREM.Background",side:ni,depthWrite:!1,depthTest:!1})));const b=this._backgroundBox,S=b.material;let v=!1;const R=e.background;R?R.isColor&&(S.color.copy(R),e.background=null,v=!0):(S.color.copy(Ng),v=!0);for(let I=0;I<6;I++){const T=I%3;T===0?(h.up.set(0,f[I],0),h.position.set(l.x,l.y,l.z),h.lookAt(l.x+_[I],l.y,l.z)):T===1?(h.up.set(0,0,f[I]),h.position.set(l.x,l.y,l.z),h.lookAt(l.x,l.y+_[I],l.z)):(h.up.set(0,f[I],0),h.position.set(l.x,l.y,l.z),h.lookAt(l.x,l.y,l.z+_[I]));const N=this._cubeSize;Ua(a,T*N,I>2?N:0,N,N),m.setRenderTarget(a),v&&m.render(b,h),m.render(e,h)}m.toneMapping=y,m.autoClear=g,e.background=R}_textureToCubeUV(e,t){const i=this._renderer,a=e.mapping===qs||e.mapping===Qa;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ug()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ig());const l=a?this._cubemapMaterial:this._equirectMaterial,c=this._lodMeshes[0];c.material=l;const d=l.uniforms;d.envMap.value=e;const h=this._cubeSize;Ua(t,0,0,3*h,2*h),i.setRenderTarget(t),i.render(c,Yo)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const a=this._lodMeshes.length;for(let l=1;l<a;l++)this._applyGGXFilter(e,l-1,l);t.autoClear=i}_applyGGXFilter(e,t,i){const a=this._renderer,l=this._pingPongRenderTarget,c=this._ggxMaterial,d=this._lodMeshes[i];d.material=c;const h=c.uniforms,f=i/(this._lodMeshes.length-1),_=t/(this._lodMeshes.length-1),m=Math.sqrt(f*f-_*_),g=f*1.25,y=m*g,{_lodMax:M}=this,b=this._sizeLods[i],S=3*b*(i>M-ka?i-M+ka:0),v=4*(this._cubeSize-b);h.envMap.value=e.texture,h.roughness.value=y,h.mipInt.value=M-t,Ua(l,S,v,3*b,2*b),a.setRenderTarget(l),a.render(d,Yo),h.envMap.value=l.texture,h.roughness.value=0,h.mipInt.value=M-i,Ua(e,S,v,3*b,2*b),a.setRenderTarget(e),a.render(d,Yo)}_blur(e,t,i,a){const l=this._pingPongRenderTarget,c=Math.min(a,Math.PI)/Math.SQRT2;this._blurPass(e,l,t,i,c),this._blurPass(l,e,i,i,c)}_blurPass(e,t,i,a,l){const c=this._renderer,d=this._blurMaterial,h=this._lodMeshes[a];h.material=d;const f=d.uniforms;f.envMap.value=e.texture,f.sigma.value=l,f.mipInt.value=this._lodMax-i;const _=this._sizeLods[a],m=3*_*(a>this._lodMax-ka?a-this._lodMax+ka:0),g=4*(this._cubeSize-_);Ua(t,m,g,3*_,2*_),c.setRenderTarget(t),c.render(h,Yo)}}function db(s){const e=[],t=[];let i=s;const a=s-ka+1+ob;for(let l=0;l<a;l++){const c=Math.pow(2,i);e.push(c);const d=1/(c-2),h=-d,f=1+d,_=[h,h,f,h,f,f,h,h,f,f,h,f],m=6,g=6,y=3,M=new Float32Array(y*g*m),b=new Float32Array(y*g*m);for(let v=0;v<m;v++){const R=v%3*2/3-1,I=v>2?0:-1,T=[R,I,0,R+2/3,I,0,R+2/3,I+1,0,R,I,0,R+2/3,I+1,0,R,I+1,0];M.set(T,y*g*v);for(let N=0;N<g;N++){const L=_[N*2]*2-1,U=_[N*2+1]*2-1;v===0?Us.set(1,U,L):v===1?Us.set(-L,1,-U):v===2?Us.set(-L,U,1):v===3?Us.set(-1,U,-L):v===4?Us.set(-L,-1,U):Us.set(L,U,-1),Us.toArray(b,(v*g+N)*y)}}const S=new qn;S.setAttribute("position",new sr(M,y)),S.setAttribute("outputDirection",new sr(b,y)),t.push(new Ot(S,null)),i>ka&&i--}return{lodMeshes:t,sizeLods:e}}function Dg(s,e,t){const i=new Gi(s,e,t);return i.texture.mapping=fu,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Ua(s,e,t,i,a){s.viewport.set(e,t,i,a),s.scissor.set(e,t,i,a)}function hb(s,e,t){return new cr({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:cb,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:gu(),fragmentShader:`

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
		`,blending:Rr,depthTest:!1,depthWrite:!1})}function fb(s,e,t){return new cr({name:"SphericalGaussianBlur",defines:{SAMPLES:lb,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:gu(),fragmentShader:`

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
			`},a=new Bi(5,5,5),l=new cr({name:"CubemapFromEquirect",uniforms:Ja(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:ni,blending:Rr});l.uniforms.tEquirect.value=t;const c=new Ot(a,l),d=t.minFilter;return t.minFilter===Os&&(t.minFilter=zn),new gE(1,10,this).update(e,c),t.minFilter=d,c.geometry.dispose(),c.material.dispose(),this}clear(e,t=!0,i=!0,a=!0){const l=e.getRenderTarget();for(let c=0;c<6;c++)e.setRenderTarget(this,c),e.clear(t,i,a);e.setRenderTarget(l)}}function pb(s){let e=new WeakMap,t=new WeakMap,i=null;function a(g,y=!1){return g==null?null:y?c(g):l(g)}function l(g){if(g&&g.isTexture){const y=g.mapping;if(y===ih||y===rh)if(e.has(g)){const M=e.get(g).texture;return d(M,g.mapping)}else{const M=g.image;if(M&&M.height>0){const b=new rx(M.height);return b.fromEquirectangularTexture(s,g),e.set(g,b),g.addEventListener("dispose",f),d(b.texture,g.mapping)}else return null}}return g}function c(g){if(g&&g.isTexture){const y=g.mapping,M=y===ih||y===rh,b=y===qs||y===Qa;if(M||b){let S=t.get(g);const v=S!==void 0?S.texture.pmremVersion:0;if(g.isRenderTargetTexture&&g.pmremVersion!==v)return i===null&&(i=new Lg(s)),S=M?i.fromEquirectangular(g,S):i.fromCubemap(g,S),S.texture.pmremVersion=g.pmremVersion,t.set(g,S),S.texture;if(S!==void 0)return S.texture;{const R=g.image;return M&&R&&R.height>0||b&&R&&h(R)?(i===null&&(i=new Lg(s)),S=M?i.fromEquirectangular(g):i.fromCubemap(g),S.texture.pmremVersion=g.pmremVersion,t.set(g,S),g.addEventListener("dispose",_),S.texture):null}}}return g}function d(g,y){return y===ih?g.mapping=qs:y===rh&&(g.mapping=Qa),g}function h(g){let y=0;const M=6;for(let b=0;b<M;b++)g[b]!==void 0&&y++;return y===M}function f(g){const y=g.target;y.removeEventListener("dispose",f);const M=e.get(y);M!==void 0&&(e.delete(y),M.dispose())}function _(g){const y=g.target;y.removeEventListener("dispose",_);const M=t.get(y);M!==void 0&&(t.delete(y),M.dispose())}function m(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:a,dispose:m}}function mb(s){const e={};function t(i){if(e[i]!==void 0)return e[i];const a=s.getExtension(i);return e[i]=a,a}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const a=t(i);return a===null&&za("WebGLRenderer: "+i+" extension not supported."),a}}}function gb(s,e,t,i){const a={},l=new WeakMap;function c(m){const g=m.target;g.index!==null&&e.remove(g.index);for(const M in g.attributes)e.remove(g.attributes[M]);g.removeEventListener("dispose",c),delete a[g.id];const y=l.get(g);y&&(e.remove(y),l.delete(g)),i.releaseStatesOfGeometry(g),g.isInstancedBufferGeometry===!0&&delete g._maxInstanceCount,t.memory.geometries--}function d(m,g){return a[g.id]===!0||(g.addEventListener("dispose",c),a[g.id]=!0,t.memory.geometries++),g}function h(m){const g=m.attributes;for(const y in g)e.update(g[y],s.ARRAY_BUFFER)}function f(m){const g=[],y=m.index,M=m.attributes.position;let b=0;if(M===void 0)return;if(y!==null){const R=y.array;b=y.version;for(let I=0,T=R.length;I<T;I+=3){const N=R[I+0],L=R[I+1],U=R[I+2];g.push(N,L,L,U,U,N)}}else{const R=M.array;b=M.version;for(let I=0,T=R.length/3-1;I<T;I+=3){const N=I+0,L=I+1,U=I+2;g.push(N,L,L,U,U,N)}}const S=new(M.count>=65535?$_:Y_)(g,1);S.version=b;const v=l.get(m);v&&e.remove(v),l.set(m,S)}function _(m){const g=l.get(m);if(g){const y=m.index;y!==null&&g.version<y.version&&f(m)}else f(m);return l.get(m)}return{get:d,update:h,getWireframeAttribute:_}}function _b(s,e,t){let i;function a(m){i=m}let l,c;function d(m){l=m.type,c=m.bytesPerElement}function h(m,g){s.drawElements(i,g,l,m*c),t.update(g,i,1)}function f(m,g,y){y!==0&&(s.drawElementsInstanced(i,g,l,m*c,y),t.update(g,i,y))}function _(m,g,y){if(y===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,g,0,l,m,0,y);let b=0;for(let S=0;S<y;S++)b+=g[S];t.update(b,i,1)}this.setMode=a,this.setIndex=d,this.render=h,this.renderInstances=f,this.renderMultiDraw=_}function xb(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(l,c,d){switch(t.calls++,c){case s.TRIANGLES:t.triangles+=d*(l/3);break;case s.LINES:t.lines+=d*(l/2);break;case s.LINE_STRIP:t.lines+=d*(l-1);break;case s.LINE_LOOP:t.lines+=d*l;break;case s.POINTS:t.points+=d*l;break;default:Nt("WebGLInfo: Unknown draw mode:",c);break}}function a(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:a,update:i}}function vb(s,e,t){const i=new WeakMap,a=new en;function l(c,d,h){const f=c.morphTargetInfluences,_=d.morphAttributes.position||d.morphAttributes.normal||d.morphAttributes.color,m=_!==void 0?_.length:0;let g=i.get(d);if(g===void 0||g.count!==m){let B=function(){w.dispose(),i.delete(d),d.removeEventListener("dispose",B)};var y=B;g!==void 0&&g.texture.dispose();const M=d.morphAttributes.position!==void 0,b=d.morphAttributes.normal!==void 0,S=d.morphAttributes.color!==void 0,v=d.morphAttributes.position||[],R=d.morphAttributes.normal||[],I=d.morphAttributes.color||[];let T=0;M===!0&&(T=1),b===!0&&(T=2),S===!0&&(T=3);let N=d.attributes.position.count*T,L=1;N>e.maxTextureSize&&(L=Math.ceil(N/e.maxTextureSize),N=e.maxTextureSize);const U=new Float32Array(N*L*4*m),w=new j_(U,N,L,m);w.type=Hi,w.needsUpdate=!0;const D=T*4;for(let z=0;z<m;z++){const j=v[z],te=R[z],V=I[z],Q=N*L*4*z;for(let he=0;he<j.count;he++){const re=he*D;M===!0&&(a.fromBufferAttribute(j,he),U[Q+re+0]=a.x,U[Q+re+1]=a.y,U[Q+re+2]=a.z,U[Q+re+3]=0),b===!0&&(a.fromBufferAttribute(te,he),U[Q+re+4]=a.x,U[Q+re+5]=a.y,U[Q+re+6]=a.z,U[Q+re+7]=0),S===!0&&(a.fromBufferAttribute(V,he),U[Q+re+8]=a.x,U[Q+re+9]=a.y,U[Q+re+10]=a.z,U[Q+re+11]=V.itemSize===4?a.w:1)}}g={count:m,texture:w,size:new ot(N,L)},i.set(d,g),d.addEventListener("dispose",B)}if(c.isInstancedMesh===!0&&c.morphTexture!==null)h.getUniforms().setValue(s,"morphTexture",c.morphTexture,t);else{let M=0;for(let S=0;S<f.length;S++)M+=f[S];const b=d.morphTargetsRelative?1:1-M;h.getUniforms().setValue(s,"morphTargetBaseInfluence",b),h.getUniforms().setValue(s,"morphTargetInfluences",f)}h.getUniforms().setValue(s,"morphTargetsTexture",g.texture,t),h.getUniforms().setValue(s,"morphTargetsTextureSize",g.size)}return{update:l}}function yb(s,e,t,i,a){let l=new WeakMap;function c(f){const _=a.render.frame,m=f.geometry,g=e.get(f,m);if(l.get(g)!==_&&(e.update(g),l.set(g,_)),f.isInstancedMesh&&(f.hasEventListener("dispose",h)===!1&&f.addEventListener("dispose",h),l.get(f)!==_&&(t.update(f.instanceMatrix,s.ARRAY_BUFFER),f.instanceColor!==null&&t.update(f.instanceColor,s.ARRAY_BUFFER),l.set(f,_))),f.isSkinnedMesh){const y=f.skeleton;l.get(y)!==_&&(y.update(),l.set(y,_))}return g}function d(){l=new WeakMap}function h(f){const _=f.target;_.removeEventListener("dispose",h),i.releaseStatesOfObject(_),t.remove(_.instanceMatrix),_.instanceColor!==null&&t.remove(_.instanceColor)}return{update:c,dispose:d}}const Sb={[P_]:"LINEAR_TONE_MAPPING",[N_]:"REINHARD_TONE_MAPPING",[L_]:"CINEON_TONE_MAPPING",[D_]:"ACES_FILMIC_TONE_MAPPING",[U_]:"AGX_TONE_MAPPING",[F_]:"NEUTRAL_TONE_MAPPING",[I_]:"CUSTOM_TONE_MAPPING"};function Mb(s,e,t,i,a,l){const c=new Gi(e,t,{type:s,depthBuffer:a,stencilBuffer:l,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let d=null,h=null;const f=new qn;f.setAttribute("position",new hn([-1,3,0,-1,-1,0,3,-1,0],3)),f.setAttribute("uv",new hn([0,2,0,0,2,0],2));const _=new nE({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),m=new Ot(f,_),g=new Zf(-1,1,1,-1,0,1);let y=null,M=null,b=!1,S,v=null,R=[],I=!1;this.setSize=function(T,N){c.setSize(T,N),d!==null&&d.setSize(T,N),h!==null&&h.setSize(T,N);for(let L=0;L<R.length;L++){const U=R[L];U.setSize&&U.setSize(T,N)}},this.setEffects=function(T){R=T,I=R.length>0&&R[0].isRenderPass===!0;const N=c.width,L=c.height;R.length>0&&d===null&&(d=new Gi(N,L,{type:or,depthBuffer:!1,stencilBuffer:!1}),h=new Gi(N,L,{type:or,depthBuffer:!1,stencilBuffer:!1}));for(let U=0;U<R.length;U++){const w=R[U];w.setSize&&w.setSize(N,L)}},this.begin=function(T,N){if(b||T.toneMapping===rr&&R.length===0)return!1;if(v=N,N!==null){const L=N.width,U=N.height;(c.width!==L||c.height!==U)&&this.setSize(L,U)}return I===!1&&T.setRenderTarget(c),S=T.toneMapping,T.toneMapping=rr,!0},this.hasRenderPass=function(){return I},this.end=function(T,N){T.toneMapping=S,b=!0;let L=c,U=d;for(let w=0;w<R.length;w++){const D=R[w];D.enabled!==!1&&(D.render(T,U,L,N),D.needsSwap!==!1&&(L=U,U=U===d?h:d))}if(y!==T.outputColorSpace||M!==T.toneMapping){y=T.outputColorSpace,M=T.toneMapping,_.defines={},wt.getTransfer(y)===Ft&&(_.defines.SRGB_TRANSFER="");const w=Sb[M];w&&(_.defines[w]=""),_.needsUpdate=!0}_.uniforms.tDiffuse.value=L.texture,T.setRenderTarget(v),T.render(m,g),v=null,b=!1},this.isCompositing=function(){return b},this.dispose=function(){c.dispose(),d!==null&&d.dispose(),h!==null&&h.dispose(),f.dispose(),_.dispose()}}const sx=new Xn,Pf=new ol(1,1),ax=new j_,ox=new NM,lx=new Z_,Fg=[],Og=[],kg=new Float32Array(16),Bg=new Float32Array(9),zg=new Float32Array(4);function eo(s,e,t){const i=s[0];if(i<=0||i>0)return s;const a=e*t;let l=Fg[a];if(l===void 0&&(l=new Float32Array(a),Fg[a]=l),e!==0){i.toArray(l,0);for(let c=1,d=0;c!==e;++c)d+=t,s[c].toArray(l,d)}return l}function yn(s,e){if(s.length!==e.length)return!1;for(let t=0,i=s.length;t<i;t++)if(s[t]!==e[t])return!1;return!0}function Sn(s,e){for(let t=0,i=e.length;t<i;t++)s[t]=e[t]}function _u(s,e){let t=Og[e];t===void 0&&(t=new Int32Array(e),Og[e]=t);for(let i=0;i!==e;++i)t[i]=s.allocateTextureUnit();return t}function Eb(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function wb(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(yn(t,e))return;s.uniform2fv(this.addr,e),Sn(t,e)}}function bb(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(yn(t,e))return;s.uniform3fv(this.addr,e),Sn(t,e)}}function Tb(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(yn(t,e))return;s.uniform4fv(this.addr,e),Sn(t,e)}}function Ab(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(yn(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),Sn(t,e)}else{if(yn(t,i))return;zg.set(i),s.uniformMatrix2fv(this.addr,!1,zg),Sn(t,i)}}function Cb(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(yn(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),Sn(t,e)}else{if(yn(t,i))return;Bg.set(i),s.uniformMatrix3fv(this.addr,!1,Bg),Sn(t,i)}}function Rb(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(yn(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),Sn(t,e)}else{if(yn(t,i))return;kg.set(i),s.uniformMatrix4fv(this.addr,!1,kg),Sn(t,i)}}function Pb(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function Nb(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(yn(t,e))return;s.uniform2iv(this.addr,e),Sn(t,e)}}function Lb(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(yn(t,e))return;s.uniform3iv(this.addr,e),Sn(t,e)}}function Db(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(yn(t,e))return;s.uniform4iv(this.addr,e),Sn(t,e)}}function Ib(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function Ub(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(yn(t,e))return;s.uniform2uiv(this.addr,e),Sn(t,e)}}function Fb(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(yn(t,e))return;s.uniform3uiv(this.addr,e),Sn(t,e)}}function Ob(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(yn(t,e))return;s.uniform4uiv(this.addr,e),Sn(t,e)}}function kb(s,e,t){const i=this.cache,a=t.allocateTextureUnit();i[0]!==a&&(s.uniform1i(this.addr,a),i[0]=a);let l;this.type===s.SAMPLER_2D_SHADOW?(Pf.compareFunction=t.isReversedDepthBuffer()?Xf:jf,l=Pf):l=sx,t.setTexture2D(e||l,a)}function Bb(s,e,t){const i=this.cache,a=t.allocateTextureUnit();i[0]!==a&&(s.uniform1i(this.addr,a),i[0]=a),t.setTexture3D(e||ox,a)}function zb(s,e,t){const i=this.cache,a=t.allocateTextureUnit();i[0]!==a&&(s.uniform1i(this.addr,a),i[0]=a),t.setTextureCube(e||lx,a)}function Hb(s,e,t){const i=this.cache,a=t.allocateTextureUnit();i[0]!==a&&(s.uniform1i(this.addr,a),i[0]=a),t.setTexture2DArray(e||ax,a)}function Vb(s){switch(s){case 5126:return Eb;case 35664:return wb;case 35665:return bb;case 35666:return Tb;case 35674:return Ab;case 35675:return Cb;case 35676:return Rb;case 5124:case 35670:return Pb;case 35667:case 35671:return Nb;case 35668:case 35672:return Lb;case 35669:case 35673:return Db;case 5125:return Ib;case 36294:return Ub;case 36295:return Fb;case 36296:return Ob;case 35678:case 36198:case 36298:case 36306:case 35682:return kb;case 35679:case 36299:case 36307:return Bb;case 35680:case 36300:case 36308:case 36293:return zb;case 36289:case 36303:case 36311:case 36292:return Hb}}function Gb(s,e){s.uniform1fv(this.addr,e)}function Wb(s,e){const t=eo(e,this.size,2);s.uniform2fv(this.addr,t)}function jb(s,e){const t=eo(e,this.size,3);s.uniform3fv(this.addr,t)}function Xb(s,e){const t=eo(e,this.size,4);s.uniform4fv(this.addr,t)}function qb(s,e){const t=eo(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function Yb(s,e){const t=eo(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function $b(s,e){const t=eo(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function Kb(s,e){s.uniform1iv(this.addr,e)}function Zb(s,e){s.uniform2iv(this.addr,e)}function Qb(s,e){s.uniform3iv(this.addr,e)}function Jb(s,e){s.uniform4iv(this.addr,e)}function eT(s,e){s.uniform1uiv(this.addr,e)}function tT(s,e){s.uniform2uiv(this.addr,e)}function nT(s,e){s.uniform3uiv(this.addr,e)}function iT(s,e){s.uniform4uiv(this.addr,e)}function rT(s,e,t){const i=this.cache,a=e.length,l=_u(t,a);yn(i,l)||(s.uniform1iv(this.addr,l),Sn(i,l));let c;this.type===s.SAMPLER_2D_SHADOW?c=Pf:c=sx;for(let d=0;d!==a;++d)t.setTexture2D(e[d]||c,l[d])}function sT(s,e,t){const i=this.cache,a=e.length,l=_u(t,a);yn(i,l)||(s.uniform1iv(this.addr,l),Sn(i,l));for(let c=0;c!==a;++c)t.setTexture3D(e[c]||ox,l[c])}function aT(s,e,t){const i=this.cache,a=e.length,l=_u(t,a);yn(i,l)||(s.uniform1iv(this.addr,l),Sn(i,l));for(let c=0;c!==a;++c)t.setTextureCube(e[c]||lx,l[c])}function oT(s,e,t){const i=this.cache,a=e.length,l=_u(t,a);yn(i,l)||(s.uniform1iv(this.addr,l),Sn(i,l));for(let c=0;c!==a;++c)t.setTexture2DArray(e[c]||ax,l[c])}function lT(s){switch(s){case 5126:return Gb;case 35664:return Wb;case 35665:return jb;case 35666:return Xb;case 35674:return qb;case 35675:return Yb;case 35676:return $b;case 5124:case 35670:return Kb;case 35667:case 35671:return Zb;case 35668:case 35672:return Qb;case 35669:case 35673:return Jb;case 5125:return eT;case 36294:return tT;case 36295:return nT;case 36296:return iT;case 35678:case 36198:case 36298:case 36306:case 35682:return rT;case 35679:case 36299:case 36307:return sT;case 35680:case 36300:case 36308:case 36293:return aT;case 36289:case 36303:case 36311:case 36292:return oT}}class cT{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Vb(t.type)}}class uT{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=lT(t.type)}}class dT{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const a=this.seq;for(let l=0,c=a.length;l!==c;++l){const d=a[l];d.setValue(e,t[d.id],i)}}}const Uh=/(\w+)(\])?(\[|\.)?/g;function Hg(s,e){s.seq.push(e),s.map[e.id]=e}function hT(s,e,t){const i=s.name,a=i.length;for(Uh.lastIndex=0;;){const l=Uh.exec(i),c=Uh.lastIndex;let d=l[1];const h=l[2]==="]",f=l[3];if(h&&(d=d|0),f===void 0||f==="["&&c+2===a){Hg(t,f===void 0?new cT(d,s,e):new uT(d,s,e));break}else{let m=t.map[d];m===void 0&&(m=new dT(d),Hg(t,m)),t=m}}}class Jc{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let c=0;c<i;++c){const d=e.getActiveUniform(t,c),h=e.getUniformLocation(t,d.name);hT(d,h,this)}const a=[],l=[];for(const c of this.seq)c.type===e.SAMPLER_2D_SHADOW||c.type===e.SAMPLER_CUBE_SHADOW||c.type===e.SAMPLER_2D_ARRAY_SHADOW?a.push(c):l.push(c);a.length>0&&(this.seq=a.concat(l))}setValue(e,t,i,a){const l=this.map[t];l!==void 0&&l.setValue(e,i,a)}setOptional(e,t,i){const a=t[i];a!==void 0&&this.setValue(e,i,a)}static upload(e,t,i,a){for(let l=0,c=t.length;l!==c;++l){const d=t[l],h=i[d.id];h.needsUpdate!==!1&&d.setValue(e,h.value,a)}}static seqWithValue(e,t){const i=[];for(let a=0,l=e.length;a!==l;++a){const c=e[a];c.id in t&&i.push(c)}return i}}function Vg(s,e,t){const i=s.createShader(e);return s.shaderSource(i,t),s.compileShader(i),i}const fT=37297;let pT=0;function mT(s,e){const t=s.split(`
`),i=[],a=Math.max(e-6,0),l=Math.min(e+6,t.length);for(let c=a;c<l;c++){const d=c+1;i.push(`${d===e?">":" "} ${d}: ${t[c]}`)}return i.join(`
`)}const Gg=new dt;function gT(s){wt._getMatrix(Gg,wt.workingColorSpace,s);const e=`mat3( ${Gg.elements.map(t=>t.toFixed(4))} )`;switch(wt.getTransfer(s)){case au:return[e,"LinearTransferOETF"];case Ft:return[e,"sRGBTransferOETF"];default:return at("WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function Wg(s,e,t){const i=s.getShaderParameter(e,s.COMPILE_STATUS),l=(s.getShaderInfoLog(e)||"").trim();if(i&&l==="")return"";const c=/ERROR: 0:(\d+)/.exec(l);if(c){const d=parseInt(c[1]);return t.toUpperCase()+`

`+l+`

`+mT(s.getShaderSource(e),d)}else return l}function _T(s,e){const t=gT(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const xT={[P_]:"Linear",[N_]:"Reinhard",[L_]:"Cineon",[D_]:"ACESFilmic",[U_]:"AgX",[F_]:"Neutral",[I_]:"Custom"};function vT(s,e){const t=xT[e];return t===void 0?(at("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Wc=new Y;function yT(){wt.getLuminanceCoefficients(Wc);const s=Wc.x.toFixed(4),e=Wc.y.toFixed(4),t=Wc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function ST(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Qo).join(`
`)}function MT(s){const e=[];for(const t in s){const i=s[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function ET(s,e){const t={},i=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let a=0;a<i;a++){const l=s.getActiveAttrib(e,a),c=l.name;let d=1;l.type===s.FLOAT_MAT2&&(d=2),l.type===s.FLOAT_MAT3&&(d=3),l.type===s.FLOAT_MAT4&&(d=4),t[c]={type:l.type,location:s.getAttribLocation(e,c),locationSize:d}}return t}function Qo(s){return s!==""}function jg(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Xg(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const wT=/^[ \t]*#include +<([\w\d./]+)>/gm;function Nf(s){return s.replace(wT,TT)}const bT=new Map;function TT(s,e){let t=_t[e];if(t===void 0){const i=bT.get(e);if(i!==void 0)t=_t[i],at('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Nf(t)}const AT=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function qg(s){return s.replace(AT,CT)}function CT(s,e,t,i){let a="";for(let l=parseInt(e);l<parseInt(t);l++)a+=i.replace(/\[\s*i\s*\]/g,"[ "+l+" ]").replace(/UNROLLED_LOOP_INDEX/g,l);return a}function Yg(s){let e=`precision ${s.precision} float;
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
#define LOW_PRECISION`),e}const RT={[qc]:"SHADOWMAP_TYPE_PCF",[Ko]:"SHADOWMAP_TYPE_VSM"};function PT(s){return RT[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const NT={[qs]:"ENVMAP_TYPE_CUBE",[Qa]:"ENVMAP_TYPE_CUBE",[fu]:"ENVMAP_TYPE_CUBE_UV"};function LT(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":NT[s.envMapMode]||"ENVMAP_TYPE_CUBE"}const DT={[Qa]:"ENVMAP_MODE_REFRACTION"};function IT(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":DT[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}const UT={[Of]:"ENVMAP_BLENDING_MULTIPLY",[oM]:"ENVMAP_BLENDING_MIX",[lM]:"ENVMAP_BLENDING_ADD"};function FT(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":UT[s.combine]||"ENVMAP_BLENDING_NONE"}function OT(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function kT(s,e,t,i){const a=s.getContext(),l=t.defines;let c=t.vertexShader,d=t.fragmentShader;const h=PT(t),f=LT(t),_=IT(t),m=FT(t),g=OT(t),y=ST(t),M=MT(l),b=a.createProgram();let S,v,R=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(S=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M].filter(Qo).join(`
`),S.length>0&&(S+=`
`),v=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M].filter(Qo).join(`
`),v.length>0&&(v+=`
`)):(S=[Yg(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+_:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+h:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Qo).join(`
`),v=[Yg(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+f:"",t.envMap?"#define "+_:"",t.envMap?"#define "+m:"",g?"#define CUBEUV_TEXEL_WIDTH "+g.texelWidth:"",g?"#define CUBEUV_TEXEL_HEIGHT "+g.texelHeight:"",g?"#define CUBEUV_MAX_MIP "+g.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+h:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==rr?"#define TONE_MAPPING":"",t.toneMapping!==rr?_t.tonemapping_pars_fragment:"",t.toneMapping!==rr?vT("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",_t.colorspace_pars_fragment,_T("linearToOutputTexel",t.outputColorSpace),yT(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Qo).join(`
`)),c=Nf(c),c=jg(c,t),c=Xg(c,t),d=Nf(d),d=jg(d,t),d=Xg(d,t),c=qg(c),d=qg(d),t.isRawShaderMaterial!==!0&&(R=`#version 300 es
`,S=[y,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+S,v=["#define varying in",t.glslVersion===Y0?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Y0?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+v);const I=R+S+c,T=R+v+d,N=Vg(a,a.VERTEX_SHADER,I),L=Vg(a,a.FRAGMENT_SHADER,T);a.attachShader(b,N),a.attachShader(b,L),t.index0AttributeName!==void 0?a.bindAttribLocation(b,0,t.index0AttributeName):t.hasPositionAttribute===!0&&a.bindAttribLocation(b,0,"position"),a.linkProgram(b);function U(z){if(s.debug.checkShaderErrors){const j=a.getProgramInfoLog(b)||"",te=a.getShaderInfoLog(N)||"",V=a.getShaderInfoLog(L)||"",Q=j.trim(),he=te.trim(),re=V.trim();let J=!0,$=!0;if(a.getProgramParameter(b,a.LINK_STATUS)===!1)if(J=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(a,b,N,L);else{const K=Wg(a,N,"vertex"),F=Wg(a,L,"fragment");Nt("WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(b,a.VALIDATE_STATUS)+`

Material Name: `+z.name+`
Material Type: `+z.type+`

Program Info Log: `+Q+`
`+K+`
`+F)}else Q!==""?at("WebGLProgram: Program Info Log:",Q):(he===""||re==="")&&($=!1);$&&(z.diagnostics={runnable:J,programLog:Q,vertexShader:{log:he,prefix:S},fragmentShader:{log:re,prefix:v}})}a.deleteShader(N),a.deleteShader(L),w=new Jc(a,b),D=ET(a,b)}let w;this.getUniforms=function(){return w===void 0&&U(this),w};let D;this.getAttributes=function(){return D===void 0&&U(this),D};let B=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return B===!1&&(B=a.getProgramParameter(b,fT)),B},this.destroy=function(){i.releaseStatesOfProgram(this),a.deleteProgram(b),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=pT++,this.cacheKey=e,this.usedTimes=1,this.program=b,this.vertexShader=N,this.fragmentShader=L,this}let BT=0;class zT{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){const a=this._getShaderCacheForMaterial(e);return a.has(t)===!1&&(a.add(t),t.usedTimes++),a.has(i)===!1&&(a.add(i),i.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new HT(e),t.set(e,i)),i}}class HT{constructor(e){this.id=BT++,this.code=e,this.usedTimes=0}}function VT(s){return s===Ys||s===nu||s===iu}function GT(s,e,t,i,a,l){const c=new X_,d=new zT,h=new Set,f=[],_=new Map,m=i.logarithmicDepthBuffer;let g=i.precision;const y={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function M(w){return h.add(w),w===0?"uv":`uv${w}`}function b(w,D,B,z,j,te){const V=z.fog,Q=j.geometry,he=w.isMeshStandardMaterial||w.isMeshLambertMaterial||w.isMeshPhongMaterial?z.environment:null,re=w.isMeshStandardMaterial||w.isMeshLambertMaterial&&!w.envMap||w.isMeshPhongMaterial&&!w.envMap,J=e.get(w.envMap||he,re),$=J&&J.mapping===fu?J.image.height:null,K=y[w.type];w.precision!==null&&(g=i.getMaxPrecision(w.precision),g!==w.precision&&at("WebGLProgram.getParameters:",w.precision,"not supported, using",g,"instead."));const F=Q.morphAttributes.position||Q.morphAttributes.normal||Q.morphAttributes.color,ae=F!==void 0?F.length:0;let Se=0;Q.morphAttributes.position!==void 0&&(Se=1),Q.morphAttributes.normal!==void 0&&(Se=2),Q.morphAttributes.color!==void 0&&(Se=3);let Ge,He,We,le;if(K){const Ct=er[K];Ge=Ct.vertexShader,He=Ct.fragmentShader}else{Ge=w.vertexShader,He=w.fragmentShader;const Ct=d.getVertexShaderStage(w),bt=d.getFragmentShaderStage(w);d.update(w,Ct,bt),We=Ct.id,le=bt.id}const de=s.getRenderTarget(),we=s.state.buffers.depth.getReversed(),et=j.isInstancedMesh===!0,Oe=j.isBatchedMesh===!0,ft=!!w.map,Xt=!!w.matcap,pt=!!J,St=!!w.aoMap,It=!!w.lightMap,mt=!!w.bumpMap&&w.wireframe===!1,Ht=!!w.normalMap,nn=!!w.displacementMap,cn=!!w.emissiveMap,Dt=!!w.metalnessMap,qt=!!w.roughnessMap,X=w.anisotropy>0,fn=w.clearcoat>0,At=w.dispersion>0,O=w.retroreflectivity>0,E=w.iridescence>0,Z=w.sheen>0,oe=w.transmission>0,fe=X&&!!w.anisotropyMap,Ee=fn&&!!w.clearcoatMap,Ae=fn&&!!w.clearcoatNormalMap,pe=fn&&!!w.clearcoatRoughnessMap,_e=E&&!!w.iridescenceMap,Pe=E&&!!w.iridescenceThicknessMap,$e=Z&&!!w.sheenColorMap,Ne=Z&&!!w.sheenRoughnessMap,Te=!!w.specularMap,Ke=!!w.specularColorMap,tt=!!w.specularIntensityMap,rt=oe&&!!w.transmissionMap,G=oe&&!!w.thicknessMap,Ce=!!w.gradientMap,ge=!!w.alphaMap,Re=w.alphaTest>0,Fe=!!w.alphaHash,xe=!!w.extensions;let Qe=rr;w.toneMapped&&(de===null||de.isXRRenderTarget===!0)&&(Qe=s.toneMapping);const qe={shaderID:K,shaderType:w.type,shaderName:w.name,vertexShader:Ge,fragmentShader:He,defines:w.defines,customVertexShaderID:We,customFragmentShaderID:le,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:g,batching:Oe,batchingColor:Oe&&j._colorsTexture!==null,instancing:et,instancingColor:et&&j.instanceColor!==null,instancingMorph:et&&j.morphTexture!==null,outputColorSpace:de===null?s.outputColorSpace:de.isXRRenderTarget===!0?de.texture.colorSpace:wt.workingColorSpace,alphaToCoverage:!!w.alphaToCoverage,map:ft,matcap:Xt,envMap:pt,envMapMode:pt&&J.mapping,envMapCubeUVHeight:$,aoMap:St,lightMap:It,bumpMap:mt,normalMap:Ht,displacementMap:nn,emissiveMap:cn,normalMapObjectSpace:Ht&&w.normalMapType===dM,normalMapTangentSpace:Ht&&w.normalMapType===ru,packedNormalMap:Ht&&w.normalMapType===ru&&VT(w.normalMap.format),metalnessMap:Dt,roughnessMap:qt,anisotropy:X,anisotropyMap:fe,clearcoat:fn,clearcoatMap:Ee,clearcoatNormalMap:Ae,clearcoatRoughnessMap:pe,dispersion:At,retroreflection:O,iridescence:E,iridescenceMap:_e,iridescenceThicknessMap:Pe,sheen:Z,sheenColorMap:$e,sheenRoughnessMap:Ne,specularMap:Te,specularColorMap:Ke,specularIntensityMap:tt,transmission:oe,transmissionMap:rt,thicknessMap:G,gradientMap:Ce,opaque:w.transparent===!1&&w.blending===el&&w.alphaToCoverage===!1,alphaMap:ge,alphaTest:Re,alphaHash:Fe,combine:w.combine,mapUv:ft&&M(w.map.channel),aoMapUv:St&&M(w.aoMap.channel),lightMapUv:It&&M(w.lightMap.channel),bumpMapUv:mt&&M(w.bumpMap.channel),normalMapUv:Ht&&M(w.normalMap.channel),displacementMapUv:nn&&M(w.displacementMap.channel),emissiveMapUv:cn&&M(w.emissiveMap.channel),metalnessMapUv:Dt&&M(w.metalnessMap.channel),roughnessMapUv:qt&&M(w.roughnessMap.channel),anisotropyMapUv:fe&&M(w.anisotropyMap.channel),clearcoatMapUv:Ee&&M(w.clearcoatMap.channel),clearcoatNormalMapUv:Ae&&M(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:pe&&M(w.clearcoatRoughnessMap.channel),iridescenceMapUv:_e&&M(w.iridescenceMap.channel),iridescenceThicknessMapUv:Pe&&M(w.iridescenceThicknessMap.channel),sheenColorMapUv:$e&&M(w.sheenColorMap.channel),sheenRoughnessMapUv:Ne&&M(w.sheenRoughnessMap.channel),specularMapUv:Te&&M(w.specularMap.channel),specularColorMapUv:Ke&&M(w.specularColorMap.channel),specularIntensityMapUv:tt&&M(w.specularIntensityMap.channel),transmissionMapUv:rt&&M(w.transmissionMap.channel),thicknessMapUv:G&&M(w.thicknessMap.channel),alphaMapUv:ge&&M(w.alphaMap.channel),vertexTangents:!!Q.attributes.tangent&&(Ht||X),vertexNormals:!!Q.attributes.normal,vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!Q.attributes.color&&Q.attributes.color.itemSize===4,pointsUvs:j.isPoints===!0&&!!Q.attributes.uv&&(ft||ge),fog:!!V,useFog:w.fog===!0,fogExp2:!!V&&V.isFogExp2,flatShading:w.wireframe===!1&&(w.flatShading===!0||Q.attributes.normal===void 0&&Ht===!1&&(w.isMeshLambertMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isMeshPhysicalMaterial)),sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:m,reversedDepthBuffer:we,skinning:j.isSkinnedMesh===!0,hasPositionAttribute:Q.attributes.position!==void 0,morphTargets:Q.morphAttributes.position!==void 0,morphNormals:Q.morphAttributes.normal!==void 0,morphColors:Q.morphAttributes.color!==void 0,morphTargetsCount:ae,morphTextureStride:Se,numSunLights:D.sun.length,numDirLights:D.directional.length,numPointLights:D.point.length,numSpotLights:D.spot.length,numSpotLightMaps:D.spotLightMap.length,numRectAreaLights:D.rectArea.length,numHemiLights:D.hemi.length,numSunLightShadows:D.sunShadowMap.length,numDirLightShadows:D.directionalShadowMap.length,numPointLightShadows:D.pointShadowMap.length,numSpotLightShadows:D.spotShadowMap.length,numSpotLightShadowsWithMaps:D.numSpotLightShadowsWithMaps,numLightProbes:D.numLightProbes,numLightProbeGrids:te.length,numClippingPlanes:l.numPlanes,numClipIntersection:l.numIntersection,dithering:w.dithering,shadowMapEnabled:s.shadowMap.enabled&&B.length>0,shadowMapType:s.shadowMap.type,toneMapping:Qe,decodeVideoTexture:ft&&w.map.isVideoTexture===!0&&wt.getTransfer(w.map.colorSpace)===Ft,decodeVideoTextureEmissive:cn&&w.emissiveMap.isVideoTexture===!0&&wt.getTransfer(w.emissiveMap.colorSpace)===Ft,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===tr,flipSided:w.side===ni,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:xe&&w.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(xe&&w.extensions.multiDraw===!0||Oe)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return qe.vertexUv1s=h.has(1),qe.vertexUv2s=h.has(2),qe.vertexUv3s=h.has(3),h.clear(),qe}function S(w){const D=[];if(w.shaderID?D.push(w.shaderID):(D.push(w.customVertexShaderID),D.push(w.customFragmentShaderID)),w.defines!==void 0)for(const B in w.defines)D.push(B),D.push(w.defines[B]);return w.isRawShaderMaterial===!1&&(v(D,w),R(D,w),D.push(s.outputColorSpace)),D.push(w.customProgramCacheKey),D.join()}function v(w,D){w.push(D.precision),w.push(D.outputColorSpace),w.push(D.envMapMode),w.push(D.envMapCubeUVHeight),w.push(D.mapUv),w.push(D.alphaMapUv),w.push(D.lightMapUv),w.push(D.aoMapUv),w.push(D.bumpMapUv),w.push(D.normalMapUv),w.push(D.displacementMapUv),w.push(D.emissiveMapUv),w.push(D.metalnessMapUv),w.push(D.roughnessMapUv),w.push(D.anisotropyMapUv),w.push(D.clearcoatMapUv),w.push(D.clearcoatNormalMapUv),w.push(D.clearcoatRoughnessMapUv),w.push(D.iridescenceMapUv),w.push(D.iridescenceThicknessMapUv),w.push(D.sheenColorMapUv),w.push(D.sheenRoughnessMapUv),w.push(D.specularMapUv),w.push(D.specularColorMapUv),w.push(D.specularIntensityMapUv),w.push(D.transmissionMapUv),w.push(D.thicknessMapUv),w.push(D.combine),w.push(D.fogExp2),w.push(D.sizeAttenuation),w.push(D.morphTargetsCount),w.push(D.morphAttributeCount),w.push(D.numSunLights),w.push(D.numDirLights),w.push(D.numPointLights),w.push(D.numSpotLights),w.push(D.numSpotLightMaps),w.push(D.numHemiLights),w.push(D.numRectAreaLights),w.push(D.numSunLightShadows),w.push(D.numDirLightShadows),w.push(D.numPointLightShadows),w.push(D.numSpotLightShadows),w.push(D.numSpotLightShadowsWithMaps),w.push(D.numLightProbes),w.push(D.shadowMapType),w.push(D.toneMapping),w.push(D.numClippingPlanes),w.push(D.numClipIntersection),w.push(D.depthPacking)}function R(w,D){c.disableAll(),D.instancing&&c.enable(0),D.instancingColor&&c.enable(1),D.instancingMorph&&c.enable(2),D.matcap&&c.enable(3),D.envMap&&c.enable(4),D.normalMapObjectSpace&&c.enable(5),D.normalMapTangentSpace&&c.enable(6),D.clearcoat&&c.enable(7),D.iridescence&&c.enable(8),D.alphaTest&&c.enable(9),D.vertexColors&&c.enable(10),D.vertexAlphas&&c.enable(11),D.vertexUv1s&&c.enable(12),D.vertexUv2s&&c.enable(13),D.vertexUv3s&&c.enable(14),D.vertexTangents&&c.enable(15),D.anisotropy&&c.enable(16),D.alphaHash&&c.enable(17),D.batching&&c.enable(18),D.dispersion&&c.enable(19),D.retroreflection&&c.enable(24),D.batchingColor&&c.enable(20),D.gradientMap&&c.enable(21),D.packedNormalMap&&c.enable(22),D.vertexNormals&&c.enable(23),w.push(c.mask),c.disableAll(),D.fog&&c.enable(0),D.useFog&&c.enable(1),D.flatShading&&c.enable(2),D.logarithmicDepthBuffer&&c.enable(3),D.reversedDepthBuffer&&c.enable(4),D.skinning&&c.enable(5),D.morphTargets&&c.enable(6),D.morphNormals&&c.enable(7),D.morphColors&&c.enable(8),D.premultipliedAlpha&&c.enable(9),D.shadowMapEnabled&&c.enable(10),D.doubleSided&&c.enable(11),D.flipSided&&c.enable(12),D.useDepthPacking&&c.enable(13),D.dithering&&c.enable(14),D.transmission&&c.enable(15),D.sheen&&c.enable(16),D.opaque&&c.enable(17),D.pointsUvs&&c.enable(18),D.decodeVideoTexture&&c.enable(19),D.decodeVideoTextureEmissive&&c.enable(20),D.alphaToCoverage&&c.enable(21),D.numLightProbeGrids>0&&c.enable(22),D.hasPositionAttribute&&c.enable(23),w.push(c.mask)}function I(w){const D=y[w.type];let B;if(D){const z=er[D];B=JM.clone(z.uniforms)}else B=w.uniforms;return B}function T(w,D){let B=_.get(D);return B!==void 0?++B.usedTimes:(B=new kT(s,D,w,a),f.push(B),_.set(D,B)),B}function N(w){if(--w.usedTimes===0){const D=f.indexOf(w);f[D]=f[f.length-1],f.pop(),_.delete(w.cacheKey),w.destroy()}}function L(w){d.remove(w)}function U(){d.dispose()}return{getParameters:b,getProgramCacheKey:S,getUniforms:I,acquireProgram:T,releaseProgram:N,releaseShaderCache:L,programs:f,dispose:U}}function WT(){let s=new WeakMap;function e(c){return s.has(c)}function t(c){let d=s.get(c);return d===void 0&&(d={},s.set(c,d)),d}function i(c){s.delete(c)}function a(c,d,h){s.get(c)[d]=h}function l(){s=new WeakMap}return{has:e,get:t,remove:i,update:a,dispose:l}}function jT(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.materialVariant!==e.materialVariant?s.materialVariant-e.materialVariant:s.z!==e.z?s.z-e.z:s.id-e.id}function $g(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function Kg(){const s=[];let e=0;const t=[],i=[],a=[];function l(){e=0,t.length=0,i.length=0,a.length=0}function c(g){let y=0;return g.isInstancedMesh&&(y+=2),g.isSkinnedMesh&&(y+=1),y}function d(g,y,M,b,S,v){let R=s[e];return R===void 0?(R={id:g.id,object:g,geometry:y,material:M,materialVariant:c(g),groupOrder:b,renderOrder:g.renderOrder,z:S,group:v},s[e]=R):(R.id=g.id,R.object=g,R.geometry=y,R.material=M,R.materialVariant=c(g),R.groupOrder=b,R.renderOrder=g.renderOrder,R.z=S,R.group=v),e++,R}function h(g,y,M,b,S,v,R){R.reversedDepth===!0&&(S=-S);const I=d(g,y,M,b,S,v);M.transmission>0?i.push(I):M.transparent===!0?a.push(I):t.push(I)}function f(g,y,M,b,S,v){const R=d(g,y,M,b,S,v);M.transmission>0?i.unshift(R):M.transparent===!0?a.unshift(R):t.unshift(R)}function _(g,y){t.length>1&&t.sort(g||jT),i.length>1&&i.sort(y||$g),a.length>1&&a.sort(y||$g)}function m(){for(let g=e,y=s.length;g<y;g++){const M=s[g];if(M.id===null)break;M.id=null,M.object=null,M.geometry=null,M.material=null,M.group=null}}return{opaque:t,transmissive:i,transparent:a,init:l,push:h,unshift:f,finish:m,sort:_}}function XT(){let s=new WeakMap;function e(i,a){const l=s.get(i);let c;return l===void 0?(c=new Kg,s.set(i,[c])):a>=l.length?(c=new Kg,l.push(c)):c=l[a],c}function t(){s=new WeakMap}return{get:e,dispose:t}}function qT(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new Y,color:new ut};break;case"SpotLight":t={position:new Y,direction:new Y,color:new ut,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new Y,color:new ut,distance:0,decay:0};break;case"HemisphereLight":t={direction:new Y,skyColor:new ut,groundColor:new ut};break;case"RectAreaLight":t={color:new ut,position:new Y,halfWidth:new Y,halfHeight:new Y};break}return s[e.id]=t,t}}}function YT(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let $T=0;function KT(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function ZT(s){const e=new qT,t=YT(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let f=0;f<9;f++)i.probe.push(new Y);const a=new Y,l=new zt,c=new zt;function d(f){let _=0,m=0,g=0;for(let j=0;j<9;j++)i.probe[j].set(0,0,0);let y=0,M=0,b=0,S=0,v=0,R=0,I=0,T=0,N=0,L=0,U=0,w=0,D=0,B=0;f.sort(KT);for(let j=0,te=f.length;j<te;j++){const V=f[j],Q=V.color,he=V.intensity,re=V.distance;let J=null;if(V.shadow&&V.shadow.map&&(V.shadow.map.texture.format===Ys?J=V.shadow.map.texture:J=V.shadow.map.depthTexture||V.shadow.map.texture),V.isAmbientLight)_+=Q.r*he,m+=Q.g*he,g+=Q.b*he;else if(V.isLightProbe){for(let $=0;$<9;$++)i.probe[$].addScaledVector(V.sh.coefficients[$],he);B++}else if(V.isSunLight){const $=e.get(V);if($.color.copy(V.color).multiplyScalar(V.intensity),V.castShadow){const K=V.shadow,F=t.get(V);F.shadowIntensity=K.intensity,F.shadowBias=K.bias,F.shadowNormalBias=K.normalBias,F.shadowRadius=K.radius,F.shadowMapSize.copy(K.mapSize).multiply(K.getFrameExtents()),i.sunShadow[M]=F,i.sunShadowMap[M]=J;const ae=K.getViewportCount();for(let Se=0;Se<ae;Se++)i.sunShadowMatrix[b+Se]=K.getMatrix(Se),i.sunShadowCascade[b+Se]=K._cascadeData[Se];b+=ae,M++}i.sun[y]=$,y++}else if(V.isDirectionalLight){const $=e.get(V);if($.color.copy(V.color).multiplyScalar(V.intensity),V.castShadow){const K=V.shadow,F=t.get(V);F.shadowIntensity=K.intensity,F.shadowBias=K.bias,F.shadowNormalBias=K.normalBias,F.shadowRadius=K.radius,F.shadowMapSize=K.mapSize,i.directionalShadow[S]=F,i.directionalShadowMap[S]=J,i.directionalShadowMatrix[S]=V.shadow.matrix,N++}i.directional[S]=$,S++}else if(V.isSpotLight){const $=e.get(V);$.position.setFromMatrixPosition(V.matrixWorld),$.color.copy(Q).multiplyScalar(he),$.distance=re,$.coneCos=Math.cos(V.angle),$.penumbraCos=Math.cos(V.angle*(1-V.penumbra)),$.decay=V.decay,i.spot[R]=$;const K=V.shadow;if(V.map&&(i.spotLightMap[w]=V.map,w++,K.updateMatrices(V),V.castShadow&&D++),i.spotLightMatrix[R]=K.matrix,V.castShadow){const F=t.get(V);F.shadowIntensity=K.intensity,F.shadowBias=K.bias,F.shadowNormalBias=K.normalBias,F.shadowRadius=K.radius,F.shadowMapSize=K.mapSize,i.spotShadow[R]=F,i.spotShadowMap[R]=J,U++}R++}else if(V.isRectAreaLight){const $=e.get(V);$.color.copy(Q).multiplyScalar(he),$.halfWidth.set(V.width*.5,0,0),$.halfHeight.set(0,V.height*.5,0),i.rectArea[I]=$,I++}else if(V.isPointLight){const $=e.get(V);if($.color.copy(V.color).multiplyScalar(V.intensity),$.distance=V.distance,$.decay=V.decay,V.castShadow){const K=V.shadow,F=t.get(V);F.shadowIntensity=K.intensity,F.shadowBias=K.bias,F.shadowNormalBias=K.normalBias,F.shadowRadius=K.radius,F.shadowMapSize=K.mapSize,F.shadowCameraNear=K.camera.near,F.shadowCameraFar=K.camera.far,i.pointShadow[v]=F,i.pointShadowMap[v]=J,i.pointShadowMatrix[v]=V.shadow.matrix,L++}i.point[v]=$,v++}else if(V.isHemisphereLight){const $=e.get(V);$.skyColor.copy(V.color).multiplyScalar(he),$.groundColor.copy(V.groundColor).multiplyScalar(he),i.hemi[T]=$,T++}}I>0&&(s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Ue.LTC_FLOAT_1,i.rectAreaLTC2=Ue.LTC_FLOAT_2):(i.rectAreaLTC1=Ue.LTC_HALF_1,i.rectAreaLTC2=Ue.LTC_HALF_2)),i.ambient[0]=_,i.ambient[1]=m,i.ambient[2]=g;const z=i.hash;(z.sunLength!==y||z.directionalLength!==S||z.pointLength!==v||z.spotLength!==R||z.rectAreaLength!==I||z.hemiLength!==T||z.numSunShadows!==M||z.numDirectionalShadows!==N||z.numPointShadows!==L||z.numSpotShadows!==U||z.numSpotMaps!==w||z.numLightProbes!==B)&&(i.sun.length=y,i.directional.length=S,i.spot.length=R,i.rectArea.length=I,i.point.length=v,i.hemi.length=T,i.sunShadow.length=M,i.sunShadowMap.length=M,i.sunShadowMatrix.length=b,i.sunShadowCascade.length=b,i.directionalShadow.length=N,i.directionalShadowMap.length=N,i.directionalShadowMatrix.length=N,i.pointShadow.length=L,i.pointShadowMap.length=L,i.pointShadowMatrix.length=L,i.spotShadow.length=U,i.spotShadowMap.length=U,i.spotLightMatrix.length=U+w-D,i.spotLightMap.length=w,i.numSpotLightShadowsWithMaps=D,i.numLightProbes=B,z.sunLength=y,z.directionalLength=S,z.pointLength=v,z.spotLength=R,z.rectAreaLength=I,z.hemiLength=T,z.numSunShadows=M,z.numDirectionalShadows=N,z.numPointShadows=L,z.numSpotShadows=U,z.numSpotMaps=w,z.numLightProbes=B,i.version=$T++)}function h(f,_){let m=0,g=0,y=0,M=0,b=0,S=0;const v=_.matrixWorldInverse;for(let R=0,I=f.length;R<I;R++){const T=f[R];if(T.isSunLight){const N=i.sun[m];N.direction.setFromMatrixPosition(T.matrixWorld),N.direction.transformDirection(v),m++}else if(T.isDirectionalLight){const N=i.directional[g];N.direction.setFromMatrixPosition(T.matrixWorld),a.setFromMatrixPosition(T.target.matrixWorld),N.direction.sub(a),N.direction.transformDirection(v),g++}else if(T.isSpotLight){const N=i.spot[M];N.position.setFromMatrixPosition(T.matrixWorld),N.position.applyMatrix4(v),N.direction.setFromMatrixPosition(T.matrixWorld),a.setFromMatrixPosition(T.target.matrixWorld),N.direction.sub(a),N.direction.transformDirection(v),M++}else if(T.isRectAreaLight){const N=i.rectArea[b];N.position.setFromMatrixPosition(T.matrixWorld),N.position.applyMatrix4(v),c.identity(),l.copy(T.matrixWorld),l.premultiply(v),c.extractRotation(l),N.halfWidth.set(T.width*.5,0,0),N.halfHeight.set(0,T.height*.5,0),N.halfWidth.applyMatrix4(c),N.halfHeight.applyMatrix4(c),b++}else if(T.isPointLight){const N=i.point[y];N.position.setFromMatrixPosition(T.matrixWorld),N.position.applyMatrix4(v),y++}else if(T.isHemisphereLight){const N=i.hemi[S];N.direction.setFromMatrixPosition(T.matrixWorld),N.direction.transformDirection(v),S++}}}return{setup:d,setupView:h,state:i}}function Zg(s){const e=new ZT(s),t=[],i=[],a=[];function l(g){m.camera=g,t.length=0,i.length=0,a.length=0}function c(g){t.push(g)}function d(g){i.push(g)}function h(g){a.push(g)}function f(){e.setup(t)}function _(g){e.setupView(t,g)}const m={lightsArray:t,shadowsArray:i,lightProbeGridArray:a,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:l,state:m,setupLights:f,setupLightsView:_,pushLight:c,pushShadow:d,pushLightProbeGrid:h}}function QT(s){let e=new WeakMap;function t(a,l=0){const c=e.get(a);let d;return c===void 0?(d=new Zg(s),e.set(a,[d])):l>=c.length?(d=new Zg(s),c.push(d)):d=c[l],d}function i(){e=new WeakMap}return{get:t,dispose:i}}const JT=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,eA=`uniform sampler2D shadow_pass;
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
}`,tA=[new Y(1,0,0),new Y(-1,0,0),new Y(0,1,0),new Y(0,-1,0),new Y(0,0,1),new Y(0,0,-1)],nA=[new Y(0,-1,0),new Y(0,-1,0),new Y(0,0,1),new Y(0,0,-1),new Y(0,-1,0),new Y(0,-1,0)],Qg=new zt,$o=new Y,Fh=new Y;function iA(s,e,t){let i=new $f;const a=new ot,l=new ot,c=new en,d=new sE,h=new aE,f={},_=t.maxTextureSize,m={[Xs]:ni,[ni]:Xs,[tr]:tr},g=new cr({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ot},radius:{value:4}},vertexShader:JT,fragmentShader:eA}),y=g.clone();y.defines.HORIZONTAL_PASS=1;const M=new qn;M.setAttribute("position",new sr(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const b=new Ot(M,g),S=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=qc;let v=this.type;this.render=function(L,U,w){if(S.enabled===!1||S.autoUpdate===!1&&S.needsUpdate===!1||L.length===0)return;this.type===A_&&(at("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=qc);const D=s.getRenderTarget(),B=s.getActiveCubeFace(),z=s.getActiveMipmapLevel(),j=s.state;j.setBlending(Rr),j.buffers.depth.getReversed()===!0?j.buffers.color.setClear(0,0,0,0):j.buffers.color.setClear(1,1,1,1),j.buffers.depth.setTest(!0),j.setScissorTest(!1);const te=v!==this.type;te&&U.traverse(function(V){V.material&&(Array.isArray(V.material)?V.material.forEach(Q=>Q.needsUpdate=!0):V.material.needsUpdate=!0)});for(let V=0,Q=L.length;V<Q;V++){const he=L[V],re=he.shadow;if(re===void 0){at("WebGLShadowMap:",he,"has no shadow.");continue}if(re.autoUpdate===!1&&re.needsUpdate===!1)continue;a.copy(re.mapSize);const J=re.getFrameExtents();a.multiply(J),l.copy(re.mapSize),(a.x>_||a.y>_)&&(a.x>_&&(l.x=Math.floor(_/J.x),a.x=l.x*J.x,re.mapSize.x=l.x),a.y>_&&(l.y=Math.floor(_/J.y),a.y=l.y*J.y,re.mapSize.y=l.y));const $=s.state.buffers.depth.getReversed();if(re.camera._reversedDepth=$,re.map===null||te===!0){if(re.map!==null&&(re.map.depthTexture!==null&&(re.map.depthTexture.dispose(),re.map.depthTexture=null),re.map.dispose()),this.type===Ko){if(he.isPointLight){at("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}re.map=new Gi(a.x,a.y,{format:Ys,type:or,minFilter:zn,magFilter:zn,generateMipmaps:!1}),re.map.texture.name=he.name+".shadowMap",re.map.depthTexture=new ol(a.x,a.y,Hi),re.map.depthTexture.name=he.name+".shadowMapDepth",re.map.depthTexture.format=Lr,re.map.depthTexture.compareFunction=null,re.map.depthTexture.minFilter=Pn,re.map.depthTexture.magFilter=Pn}else he.isPointLight?(re.map=new rx(a.x),re.map.depthTexture=new ZM(a.x,ar)):(re.map=new Gi(a.x,a.y),re.map.depthTexture=new ol(a.x,a.y,ar)),re.map.depthTexture.name=he.name+".shadowMap",re.map.depthTexture.format=Lr,this.type===qc?(re.map.depthTexture.compareFunction=$?Xf:jf,re.map.depthTexture.minFilter=zn,re.map.depthTexture.magFilter=zn):(re.map.depthTexture.compareFunction=null,re.map.depthTexture.minFilter=Pn,re.map.depthTexture.magFilter=Pn);re.camera.updateProjectionMatrix()}re.map.isWebGLCubeRenderTarget!==!0&&(re.map.width!==a.x||re.map.height!==a.y)&&re.map.setSize(a.x,a.y);const K=re.map.isWebGLCubeRenderTarget?6:re.getViewportCount();he.isPointLight!==!0&&re.updateMatrices(he,w);for(let F=0;F<K;F++){const ae=re.getCamera(F);if(he.isPointLight){const Se=re.camera,Ge=re.matrix,He=he.distance||Se.far;He!==Se.far&&(Se.far=He,Se.updateProjectionMatrix()),$o.setFromMatrixPosition(he.matrixWorld),Se.position.copy($o),Fh.copy(Se.position),Fh.add(tA[F]),Se.up.copy(nA[F]),Se.lookAt(Fh),Se.updateMatrixWorld(),Ge.makeTranslation(-$o.x,-$o.y,-$o.z),Qg.multiplyMatrices(Se.projectionMatrix,Se.matrixWorldInverse),re._frustum.setFromProjectionMatrix(Qg,Se.coordinateSystem,Se.reversedDepth)}if(re.map.isWebGLCubeRenderTarget)s.setRenderTarget(re.map,F),s.clear();else{F===0&&(s.setRenderTarget(re.map),s.clear());const Se=re.getViewport(F);c.set(l.x*Se.x,l.y*Se.y,l.x*Se.z,l.y*Se.w),j.viewport(c)}i=re.getFrustum(F),T(U,w,ae,he,this.type)}re.isPointLightShadow!==!0&&this.type===Ko&&R(re,w),re.needsUpdate=!1}v=this.type,S.needsUpdate=!1,s.setRenderTarget(D,B,z)};function R(L,U){const w=e.update(b);g.defines.VSM_SAMPLES!==L.blurSamples&&(g.defines.VSM_SAMPLES=L.blurSamples,y.defines.VSM_SAMPLES=L.blurSamples,g.needsUpdate=!0,y.needsUpdate=!0),L.mapPass===null?L.mapPass=new Gi(a.x,a.y,{format:Ys,type:or}):(L.mapPass.width!==L.map.width||L.mapPass.height!==L.map.height)&&L.mapPass.setSize(L.map.width,L.map.height),g.uniforms.shadow_pass.value=L.map.depthTexture,g.uniforms.resolution.value.set(L.map.width,L.map.height),g.uniforms.radius.value=L.radius,s.setRenderTarget(L.mapPass),s.clear(),s.renderBufferDirect(U,null,w,g,b,null),y.uniforms.shadow_pass.value=L.mapPass.texture,y.uniforms.resolution.value.set(L.map.width,L.map.height),y.uniforms.radius.value=L.radius,s.setRenderTarget(L.map),s.clear(),s.renderBufferDirect(U,null,w,y,b,null)}function I(L,U,w,D){let B=null;const z=w.isPointLight===!0?L.customDistanceMaterial:L.customDepthMaterial;if(z!==void 0)B=z;else if(B=w.isPointLight===!0?h:d,s.localClippingEnabled&&U.clipShadows===!0&&Array.isArray(U.clippingPlanes)&&U.clippingPlanes.length!==0||U.displacementMap&&U.displacementScale!==0||U.alphaMap&&U.alphaTest>0||U.map&&U.alphaTest>0||U.alphaToCoverage===!0){const j=B.uuid,te=U.uuid;let V=f[j];V===void 0&&(V={},f[j]=V);let Q=V[te];Q===void 0&&(Q=B.clone(),V[te]=Q,U.addEventListener("dispose",N)),B=Q}if(B.visible=U.visible,B.wireframe=U.wireframe,D===Ko?B.side=U.shadowSide!==null?U.shadowSide:U.side:B.side=U.shadowSide!==null?U.shadowSide:m[U.side],B.alphaMap=U.alphaMap,B.alphaTest=U.alphaToCoverage===!0?.5:U.alphaTest,B.map=U.map,B.clipShadows=U.clipShadows,B.clippingPlanes=U.clippingPlanes,B.clipIntersection=U.clipIntersection,B.displacementMap=U.displacementMap,B.displacementScale=U.displacementScale,B.displacementBias=U.displacementBias,B.wireframeLinewidth=U.wireframeLinewidth,B.linewidth=U.linewidth,w.isPointLight===!0&&B.isMeshDistanceMaterial===!0){const j=s.properties.get(B);j.light=w}return B}function T(L,U,w,D,B){if(L.visible===!1)return;if(L.layers.test(U.layers)&&(L.isMesh||L.isLine||L.isPoints)&&(L.castShadow||L.receiveShadow&&B===Ko)&&(!L.frustumCulled||L.intersectsFrustum(i))){L.modelViewMatrix.multiplyMatrices(w.matrixWorldInverse,L.matrixWorld);const te=e.update(L),V=L.material;if(Array.isArray(V)){const Q=te.groups;for(let he=0,re=Q.length;he<re;he++){const J=Q[he],$=V[J.materialIndex];if($&&$.visible){const K=I(L,$,D,B);L.onBeforeShadow(s,L,U,w,te,K,J),s.renderBufferDirect(w,null,te,K,L,J),L.onAfterShadow(s,L,U,w,te,K,J)}}}else if(V.visible){const Q=I(L,V,D,B);L.onBeforeShadow(s,L,U,w,te,Q,null),s.renderBufferDirect(w,null,te,Q,L,null),L.onAfterShadow(s,L,U,w,te,Q,null)}}const j=L.children;for(let te=0,V=j.length;te<V;te++)T(j[te],U,w,D,B)}function N(L){L.target.removeEventListener("dispose",N);for(const w in f){const D=f[w],B=L.target.uuid;B in D&&(D[B].dispose(),delete D[B])}}}function rA(s,e){function t(){let G=!1;const Ce=new en;let ge=null;const Re=new en(0,0,0,0);return{setMask:function(Fe){ge!==Fe&&!G&&(s.colorMask(Fe,Fe,Fe,Fe),ge=Fe)},setLocked:function(Fe){G=Fe},setClear:function(Fe,xe,Qe,qe,Ct){Ct===!0&&(Fe*=qe,xe*=qe,Qe*=qe),Ce.set(Fe,xe,Qe,qe),Re.equals(Ce)===!1&&(s.clearColor(Fe,xe,Qe,qe),Re.copy(Ce))},reset:function(){G=!1,ge=null,Re.set(-1,0,0,0)}}}function i(){let G=!1,Ce=!1,ge=null,Re=null,Fe=null;return{setReversed:function(xe){if(Ce!==xe){const Qe=e.get("EXT_clip_control");xe?Qe.clipControlEXT(Qe.LOWER_LEFT_EXT,Qe.ZERO_TO_ONE_EXT):Qe.clipControlEXT(Qe.LOWER_LEFT_EXT,Qe.NEGATIVE_ONE_TO_ONE_EXT),Ce=xe;const qe=Fe;Fe=null,this.setClear(qe)}},getReversed:function(){return Ce},setTest:function(xe){xe?de(s.DEPTH_TEST):we(s.DEPTH_TEST)},setMask:function(xe){ge!==xe&&!G&&(s.depthMask(xe),ge=xe)},setFunc:function(xe){if(Ce&&(xe=EM[xe]),Re!==xe){switch(xe){case Vh:s.depthFunc(s.NEVER);break;case Gh:s.depthFunc(s.ALWAYS);break;case Wh:s.depthFunc(s.LESS);break;case il:s.depthFunc(s.LEQUAL);break;case jh:s.depthFunc(s.EQUAL);break;case Xh:s.depthFunc(s.GEQUAL);break;case qh:s.depthFunc(s.GREATER);break;case Yh:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}Re=xe}},setLocked:function(xe){G=xe},setClear:function(xe){Fe!==xe&&(Fe=xe,Ce&&(xe=1-xe),s.clearDepth(xe))},reset:function(){G=!1,ge=null,Re=null,Fe=null,Ce=!1}}}function a(){let G=!1,Ce=null,ge=null,Re=null,Fe=null,xe=null,Qe=null,qe=null,Ct=null;return{setTest:function(bt){G||(bt?de(s.STENCIL_TEST):we(s.STENCIL_TEST))},setMask:function(bt){Ce!==bt&&!G&&(s.stencilMask(bt),Ce=bt)},setFunc:function(bt,An,hi){(ge!==bt||Re!==An||Fe!==hi)&&(s.stencilFunc(bt,An,hi),ge=bt,Re=An,Fe=hi)},setOp:function(bt,An,hi){(xe!==bt||Qe!==An||qe!==hi)&&(s.stencilOp(bt,An,hi),xe=bt,Qe=An,qe=hi)},setLocked:function(bt){G=bt},setClear:function(bt){Ct!==bt&&(s.clearStencil(bt),Ct=bt)},reset:function(){G=!1,Ce=null,ge=null,Re=null,Fe=null,xe=null,Qe=null,qe=null,Ct=null}}}const l=new t,c=new i,d=new a,h=new WeakMap,f=new WeakMap;let _={},m={},g={},y=new WeakMap,M=[],b=null,S=!1,v=null,R=null,I=null,T=null,N=null,L=null,U=null,w=new ut(0,0,0),D=0,B=!1,z=null,j=null,te=null,V=null,Q=null;const he=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let re=!1,J=0;const $=s.getParameter(s.VERSION);$.indexOf("WebGL")!==-1?(J=parseFloat(/^WebGL (\d)/.exec($)[1]),re=J>=1):$.indexOf("OpenGL ES")!==-1&&(J=parseFloat(/^OpenGL ES (\d)/.exec($)[1]),re=J>=2);let K=null,F={};const ae=s.getParameter(s.SCISSOR_BOX),Se=s.getParameter(s.VIEWPORT),Ge=new en().fromArray(ae),He=new en().fromArray(Se);function We(G,Ce,ge,Re){const Fe=new Uint8Array(4),xe=s.createTexture();s.bindTexture(G,xe),s.texParameteri(G,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(G,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Qe=0;Qe<ge;Qe++)G===s.TEXTURE_3D||G===s.TEXTURE_2D_ARRAY?s.texImage3D(Ce,0,s.RGBA,1,1,Re,0,s.RGBA,s.UNSIGNED_BYTE,Fe):s.texImage2D(Ce+Qe,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Fe);return xe}const le={};le[s.TEXTURE_2D]=We(s.TEXTURE_2D,s.TEXTURE_2D,1),le[s.TEXTURE_CUBE_MAP]=We(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),le[s.TEXTURE_2D_ARRAY]=We(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),le[s.TEXTURE_3D]=We(s.TEXTURE_3D,s.TEXTURE_3D,1,1),l.setClear(0,0,0,1),c.setClear(1),d.setClear(0),de(s.DEPTH_TEST),c.setFunc(il),mt(!1),Ht(W0),de(s.CULL_FACE),St(Rr);function de(G){_[G]!==!0&&(s.enable(G),_[G]=!0)}function we(G){_[G]!==!1&&(s.disable(G),_[G]=!1)}function et(G,Ce){return g[G]!==Ce?(s.bindFramebuffer(G,Ce),g[G]=Ce,G===s.DRAW_FRAMEBUFFER&&(g[s.FRAMEBUFFER]=Ce),G===s.FRAMEBUFFER&&(g[s.DRAW_FRAMEBUFFER]=Ce),!0):!1}function Oe(G,Ce){let ge=M,Re=!1;if(G){ge=y.get(Ce),ge===void 0&&(ge=[],y.set(Ce,ge));const Fe=G.textures;if(ge.length!==Fe.length||ge[0]!==s.COLOR_ATTACHMENT0){for(let xe=0,Qe=Fe.length;xe<Qe;xe++)ge[xe]=s.COLOR_ATTACHMENT0+xe;ge.length=Fe.length,Re=!0}}else ge[0]!==s.BACK&&(ge[0]=s.BACK,Re=!0);Re&&s.drawBuffers(ge)}function ft(G){return b!==G?(s.useProgram(G),b=G,!0):!1}const Xt={[Fa]:s.FUNC_ADD,[WS]:s.FUNC_SUBTRACT,[jS]:s.FUNC_REVERSE_SUBTRACT};Xt[XS]=s.MIN,Xt[qS]=s.MAX;const pt={[YS]:s.ZERO,[$S]:s.ONE,[KS]:s.SRC_COLOR,[C_]:s.SRC_ALPHA,[nM]:s.SRC_ALPHA_SATURATE,[eM]:s.DST_COLOR,[QS]:s.DST_ALPHA,[ZS]:s.ONE_MINUS_SRC_COLOR,[R_]:s.ONE_MINUS_SRC_ALPHA,[tM]:s.ONE_MINUS_DST_COLOR,[JS]:s.ONE_MINUS_DST_ALPHA,[iM]:s.CONSTANT_COLOR,[rM]:s.ONE_MINUS_CONSTANT_COLOR,[sM]:s.CONSTANT_ALPHA,[aM]:s.ONE_MINUS_CONSTANT_ALPHA};function St(G,Ce,ge,Re,Fe,xe,Qe,qe,Ct,bt){if(G===Rr){S===!0&&(we(s.BLEND),S=!1);return}if(S===!1&&(de(s.BLEND),S=!0),G!==GS){if(G!==v||bt!==B){if((R!==Fa||N!==Fa)&&(s.blendEquation(s.FUNC_ADD),R=Fa,N=Fa),bt)switch(G){case el:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case j0:s.blendFunc(s.ONE,s.ONE);break;case X0:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case q0:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:Nt("WebGLState: Invalid blending: ",G);break}else switch(G){case el:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case j0:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case X0:Nt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case q0:Nt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Nt("WebGLState: Invalid blending: ",G);break}I=null,T=null,L=null,U=null,w.set(0,0,0),D=0,v=G,B=bt}return}Fe=Fe||Ce,xe=xe||ge,Qe=Qe||Re,(Ce!==R||Fe!==N)&&(s.blendEquationSeparate(Xt[Ce],Xt[Fe]),R=Ce,N=Fe),(ge!==I||Re!==T||xe!==L||Qe!==U)&&(s.blendFuncSeparate(pt[ge],pt[Re],pt[xe],pt[Qe]),I=ge,T=Re,L=xe,U=Qe),(qe.equals(w)===!1||Ct!==D)&&(s.blendColor(qe.r,qe.g,qe.b,Ct),w.copy(qe),D=Ct),v=G,B=!1}function It(G,Ce){G.side===tr?we(s.CULL_FACE):de(s.CULL_FACE);let ge=G.side===ni;Ce&&(ge=!ge),mt(ge),G.blending===el&&G.transparent===!1?St(Rr):St(G.blending,G.blendEquation,G.blendSrc,G.blendDst,G.blendEquationAlpha,G.blendSrcAlpha,G.blendDstAlpha,G.blendColor,G.blendAlpha,G.premultipliedAlpha),c.setFunc(G.depthFunc),c.setTest(G.depthTest),c.setMask(G.depthWrite),l.setMask(G.colorWrite);const Re=G.stencilWrite;d.setTest(Re),Re&&(d.setMask(G.stencilWriteMask),d.setFunc(G.stencilFunc,G.stencilRef,G.stencilFuncMask),d.setOp(G.stencilFail,G.stencilZFail,G.stencilZPass)),cn(G.polygonOffset,G.polygonOffsetFactor,G.polygonOffsetUnits),G.alphaToCoverage===!0?de(s.SAMPLE_ALPHA_TO_COVERAGE):we(s.SAMPLE_ALPHA_TO_COVERAGE)}function mt(G){z!==G&&(G?s.frontFace(s.CW):s.frontFace(s.CCW),z=G)}function Ht(G){G!==HS?(de(s.CULL_FACE),G!==j&&(G===W0?s.cullFace(s.BACK):G===VS?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):we(s.CULL_FACE),j=G}function nn(G){G!==te&&(re&&s.lineWidth(G),te=G)}function cn(G,Ce,ge){G?(de(s.POLYGON_OFFSET_FILL),(V!==Ce||Q!==ge)&&(V=Ce,Q=ge,c.getReversed()&&(Ce=-Ce),s.polygonOffset(Ce,ge))):we(s.POLYGON_OFFSET_FILL)}function Dt(G){G?de(s.SCISSOR_TEST):we(s.SCISSOR_TEST)}function qt(G){G===void 0&&(G=s.TEXTURE0+he-1),K!==G&&(s.activeTexture(G),K=G)}function X(G,Ce,ge){ge===void 0&&(K===null?ge=s.TEXTURE0+he-1:ge=K);let Re=F[ge];Re===void 0&&(Re={type:void 0,texture:void 0},F[ge]=Re),(Re.type!==G||Re.texture!==Ce)&&(K!==ge&&(s.activeTexture(ge),K=ge),s.bindTexture(G,Ce||le[G]),Re.type=G,Re.texture=Ce)}function fn(){const G=F[K];G!==void 0&&G.type!==void 0&&(s.bindTexture(G.type,null),G.type=void 0,G.texture=void 0)}function At(){try{s.compressedTexImage2D(...arguments)}catch(G){Nt("WebGLState:",G)}}function O(){try{s.compressedTexImage3D(...arguments)}catch(G){Nt("WebGLState:",G)}}function E(){try{s.texSubImage2D(...arguments)}catch(G){Nt("WebGLState:",G)}}function Z(){try{s.texSubImage3D(...arguments)}catch(G){Nt("WebGLState:",G)}}function oe(){try{s.compressedTexSubImage2D(...arguments)}catch(G){Nt("WebGLState:",G)}}function fe(){try{s.compressedTexSubImage3D(...arguments)}catch(G){Nt("WebGLState:",G)}}function Ee(){try{s.texStorage2D(...arguments)}catch(G){Nt("WebGLState:",G)}}function Ae(){try{s.texStorage3D(...arguments)}catch(G){Nt("WebGLState:",G)}}function pe(){try{s.texImage2D(...arguments)}catch(G){Nt("WebGLState:",G)}}function _e(){try{s.texImage3D(...arguments)}catch(G){Nt("WebGLState:",G)}}function Pe(G){return m[G]!==void 0?m[G]:s.getParameter(G)}function $e(G,Ce){m[G]!==Ce&&(s.pixelStorei(G,Ce),m[G]=Ce)}function Ne(G){Ge.equals(G)===!1&&(s.scissor(G.x,G.y,G.z,G.w),Ge.copy(G))}function Te(G){He.equals(G)===!1&&(s.viewport(G.x,G.y,G.z,G.w),He.copy(G))}function Ke(G,Ce){let ge=f.get(Ce);ge===void 0&&(ge=new WeakMap,f.set(Ce,ge));let Re=ge.get(G);Re===void 0&&(Re=s.getUniformBlockIndex(Ce,G.name),ge.set(G,Re))}function tt(G,Ce){const Re=f.get(Ce).get(G);h.get(Ce)!==Re&&(s.uniformBlockBinding(Ce,Re,G.__bindingPointIndex),h.set(Ce,Re))}function rt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),c.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),_={},m={},K=null,F={},g={},y=new WeakMap,M=[],b=null,S=!1,v=null,R=null,I=null,T=null,N=null,L=null,U=null,w=new ut(0,0,0),D=0,B=!1,z=null,j=null,te=null,V=null,Q=null,Ge.set(0,0,s.canvas.width,s.canvas.height),He.set(0,0,s.canvas.width,s.canvas.height),l.reset(),c.reset(),d.reset()}return{buffers:{color:l,depth:c,stencil:d},enable:de,disable:we,bindFramebuffer:et,drawBuffers:Oe,useProgram:ft,setBlending:St,setMaterial:It,setFlipSided:mt,setCullFace:Ht,setLineWidth:nn,setPolygonOffset:cn,setScissorTest:Dt,activeTexture:qt,bindTexture:X,unbindTexture:fn,compressedTexImage2D:At,compressedTexImage3D:O,texImage2D:pe,texImage3D:_e,pixelStorei:$e,getParameter:Pe,updateUBOMapping:Ke,uniformBlockBinding:tt,texStorage2D:Ee,texStorage3D:Ae,texSubImage2D:E,texSubImage3D:Z,compressedTexSubImage2D:oe,compressedTexSubImage3D:fe,scissor:Ne,viewport:Te,reset:rt}}function sA(s,e,t,i,a,l,c){const d=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,h=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),f=new ot,_=new WeakMap,m=new Set;let g;const y=new WeakMap;let M=!1;try{M=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function b(O,E){return M?new OffscreenCanvas(O,E):ou("canvas")}function S(O,E,Z){let oe=1;const fe=At(O);if((fe.width>Z||fe.height>Z)&&(oe=Z/Math.max(fe.width,fe.height)),oe<1)if(typeof HTMLImageElement<"u"&&O instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&O instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&O instanceof ImageBitmap||typeof VideoFrame<"u"&&O instanceof VideoFrame){const Ee=Math.floor(oe*fe.width),Ae=Math.floor(oe*fe.height);g===void 0&&(g=b(Ee,Ae));const pe=E?b(Ee,Ae):g;return pe.width=Ee,pe.height=Ae,pe.getContext("2d").drawImage(O,0,0,Ee,Ae),at("WebGLRenderer: Texture has been resized from ("+fe.width+"x"+fe.height+") to ("+Ee+"x"+Ae+")."),pe}else return"data"in O&&at("WebGLRenderer: Image in DataTexture is too big ("+fe.width+"x"+fe.height+")."),O;return O}function v(O){return O.generateMipmaps}function R(O){s.generateMipmap(O)}function I(O){return O.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:O.isWebGL3DRenderTarget?s.TEXTURE_3D:O.isWebGLArrayRenderTarget||O.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function T(O,E,Z,oe,fe,Ee=!1){if(O!==null){if(s[O]!==void 0)return s[O];at("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+O+"'")}let Ae;oe&&(Ae=e.get("EXT_texture_norm16"),Ae||at("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let pe=E;if(E===s.RED&&(Z===s.FLOAT&&(pe=s.R32F),Z===s.HALF_FLOAT&&(pe=s.R16F),Z===s.UNSIGNED_BYTE&&(pe=s.R8),Z===s.UNSIGNED_SHORT&&Ae&&(pe=Ae.R16_EXT),Z===s.SHORT&&Ae&&(pe=Ae.R16_SNORM_EXT)),E===s.RED_INTEGER&&(Z===s.UNSIGNED_BYTE&&(pe=s.R8UI),Z===s.UNSIGNED_SHORT&&(pe=s.R16UI),Z===s.UNSIGNED_INT&&(pe=s.R32UI),Z===s.BYTE&&(pe=s.R8I),Z===s.SHORT&&(pe=s.R16I),Z===s.INT&&(pe=s.R32I)),E===s.RG&&(Z===s.FLOAT&&(pe=s.RG32F),Z===s.HALF_FLOAT&&(pe=s.RG16F),Z===s.UNSIGNED_BYTE&&(pe=s.RG8),Z===s.UNSIGNED_SHORT&&Ae&&(pe=Ae.RG16_EXT),Z===s.SHORT&&Ae&&(pe=Ae.RG16_SNORM_EXT)),E===s.RG_INTEGER&&(Z===s.UNSIGNED_BYTE&&(pe=s.RG8UI),Z===s.UNSIGNED_SHORT&&(pe=s.RG16UI),Z===s.UNSIGNED_INT&&(pe=s.RG32UI),Z===s.BYTE&&(pe=s.RG8I),Z===s.SHORT&&(pe=s.RG16I),Z===s.INT&&(pe=s.RG32I)),E===s.RGB_INTEGER&&(Z===s.UNSIGNED_BYTE&&(pe=s.RGB8UI),Z===s.UNSIGNED_SHORT&&(pe=s.RGB16UI),Z===s.UNSIGNED_INT&&(pe=s.RGB32UI),Z===s.BYTE&&(pe=s.RGB8I),Z===s.SHORT&&(pe=s.RGB16I),Z===s.INT&&(pe=s.RGB32I)),E===s.RGBA_INTEGER&&(Z===s.UNSIGNED_BYTE&&(pe=s.RGBA8UI),Z===s.UNSIGNED_SHORT&&(pe=s.RGBA16UI),Z===s.UNSIGNED_INT&&(pe=s.RGBA32UI),Z===s.BYTE&&(pe=s.RGBA8I),Z===s.SHORT&&(pe=s.RGBA16I),Z===s.INT&&(pe=s.RGBA32I)),E===s.RGB&&(Z===s.UNSIGNED_SHORT&&Ae&&(pe=Ae.RGB16_EXT),Z===s.SHORT&&Ae&&(pe=Ae.RGB16_SNORM_EXT),Z===s.UNSIGNED_INT_5_9_9_9_REV&&(pe=s.RGB9_E5),Z===s.UNSIGNED_INT_10F_11F_11F_REV&&(pe=s.R11F_G11F_B10F)),E===s.RGBA){const _e=Ee?au:wt.getTransfer(fe);Z===s.FLOAT&&(pe=s.RGBA32F),Z===s.HALF_FLOAT&&(pe=s.RGBA16F),Z===s.UNSIGNED_BYTE&&(pe=_e===Ft?s.SRGB8_ALPHA8:s.RGBA8),Z===s.UNSIGNED_SHORT&&Ae&&(pe=Ae.RGBA16_EXT),Z===s.SHORT&&Ae&&(pe=Ae.RGBA16_SNORM_EXT),Z===s.UNSIGNED_SHORT_4_4_4_4&&(pe=s.RGBA4),Z===s.UNSIGNED_SHORT_5_5_5_1&&(pe=s.RGB5_A1)}return(pe===s.R16F||pe===s.R32F||pe===s.RG16F||pe===s.RG32F||pe===s.RGBA16F||pe===s.RGBA32F)&&e.get("EXT_color_buffer_float"),pe}function N(O,E){let Z;return O?E===null||E===ar||E===sl?Z=s.DEPTH24_STENCIL8:E===Hi?Z=s.DEPTH32F_STENCIL8:E===rl&&(Z=s.DEPTH24_STENCIL8,at("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===ar||E===sl?Z=s.DEPTH_COMPONENT24:E===Hi?Z=s.DEPTH_COMPONENT32F:E===rl&&(Z=s.DEPTH_COMPONENT16),Z}function L(O,E){return v(O)===!0||O.isFramebufferTexture&&O.minFilter!==Pn&&O.minFilter!==zn?Math.log2(Math.max(E.width,E.height))+1:O.mipmaps!==void 0&&O.mipmaps.length>0?O.mipmaps.length:O.isCompressedTexture&&Array.isArray(O.image)?E.mipmaps.length:1}function U(O){const E=O.target;E.removeEventListener("dispose",U),D(E),E.isVideoTexture&&_.delete(E),E.isHTMLTexture&&m.delete(E)}function w(O){const E=O.target;E.removeEventListener("dispose",w),z(E)}function D(O){const E=i.get(O);if(E.__webglInit===void 0)return;const Z=O.source,oe=y.get(Z);if(oe){const fe=oe[E.__cacheKey];fe.usedTimes--,fe.usedTimes===0&&B(O),Object.keys(oe).length===0&&y.delete(Z)}i.remove(O)}function B(O){const E=i.get(O);s.deleteTexture(E.__webglTexture);const Z=O.source,oe=y.get(Z);delete oe[E.__cacheKey],c.memory.textures--}function z(O){const E=i.get(O);if(O.depthTexture&&(O.depthTexture.dispose(),i.remove(O.depthTexture)),O.isWebGLCubeRenderTarget)for(let oe=0;oe<6;oe++){if(Array.isArray(E.__webglFramebuffer[oe]))for(let fe=0;fe<E.__webglFramebuffer[oe].length;fe++)s.deleteFramebuffer(E.__webglFramebuffer[oe][fe]);else s.deleteFramebuffer(E.__webglFramebuffer[oe]);E.__webglDepthbuffer&&s.deleteRenderbuffer(E.__webglDepthbuffer[oe])}else{if(Array.isArray(E.__webglFramebuffer))for(let oe=0;oe<E.__webglFramebuffer.length;oe++)s.deleteFramebuffer(E.__webglFramebuffer[oe]);else s.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&s.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&s.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let oe=0;oe<E.__webglColorRenderbuffer.length;oe++)E.__webglColorRenderbuffer[oe]&&s.deleteRenderbuffer(E.__webglColorRenderbuffer[oe]);E.__webglDepthRenderbuffer&&s.deleteRenderbuffer(E.__webglDepthRenderbuffer)}const Z=O.textures;for(let oe=0,fe=Z.length;oe<fe;oe++){const Ee=i.get(Z[oe]);Ee.__webglTexture&&(s.deleteTexture(Ee.__webglTexture),c.memory.textures--),i.remove(Z[oe])}i.remove(O)}let j=0;function te(){j=0}function V(){return j}function Q(O){j=O}function he(){const O=j;return O>=a.maxTextures&&at("WebGLTextures: Trying to use "+(O+1)+" texture units while this GPU supports only "+a.maxTextures),j+=1,O}function re(O){const E=[];return E.push(O.wrapS),E.push(O.wrapT),E.push(O.wrapR||0),E.push(O.magFilter),E.push(O.minFilter),E.push(O.anisotropy),E.push(O.internalFormat),E.push(O.format),E.push(O.type),E.push(O.generateMipmaps),E.push(O.premultiplyAlpha),E.push(O.flipY),E.push(O.unpackAlignment),E.push(O.colorSpace),E.join()}function J(O,E){const Z=i.get(O);if(O.isVideoTexture&&X(O),O.isRenderTargetTexture===!1&&O.isExternalTexture!==!0&&O.version>0&&Z.__version!==O.version){const oe=O.image;if(oe===null)at("WebGLRenderer: Texture marked for update but no image data found.");else if(oe.complete===!1)at("WebGLRenderer: Texture marked for update but image is incomplete");else{we(Z,O,E);return}}else O.isExternalTexture&&(Z.__webglTexture=O.sourceTexture?O.sourceTexture:null);t.bindTexture(s.TEXTURE_2D,Z.__webglTexture,s.TEXTURE0+E)}function $(O,E){const Z=i.get(O);if(O.isRenderTargetTexture===!1&&O.version>0&&Z.__version!==O.version){we(Z,O,E);return}else O.isExternalTexture&&(Z.__webglTexture=O.sourceTexture?O.sourceTexture:null);t.bindTexture(s.TEXTURE_2D_ARRAY,Z.__webglTexture,s.TEXTURE0+E)}function K(O,E){const Z=i.get(O);if(O.isRenderTargetTexture===!1&&O.version>0&&Z.__version!==O.version){we(Z,O,E);return}t.bindTexture(s.TEXTURE_3D,Z.__webglTexture,s.TEXTURE0+E)}function F(O,E){const Z=i.get(O);if(O.isCubeDepthTexture!==!0&&O.version>0&&Z.__version!==O.version){et(Z,O,E);return}t.bindTexture(s.TEXTURE_CUBE_MAP,Z.__webglTexture,s.TEXTURE0+E)}const ae={[$h]:s.REPEAT,[Cr]:s.CLAMP_TO_EDGE,[Kh]:s.MIRRORED_REPEAT},Se={[Pn]:s.NEAREST,[cM]:s.NEAREST_MIPMAP_NEAREST,[xc]:s.NEAREST_MIPMAP_LINEAR,[zn]:s.LINEAR,[sh]:s.LINEAR_MIPMAP_NEAREST,[Os]:s.LINEAR_MIPMAP_LINEAR},Ge={[fM]:s.NEVER,[xM]:s.ALWAYS,[pM]:s.LESS,[jf]:s.LEQUAL,[mM]:s.EQUAL,[Xf]:s.GEQUAL,[gM]:s.GREATER,[_M]:s.NOTEQUAL};function He(O,E){if(E.type===Hi&&e.has("OES_texture_float_linear")===!1&&(E.magFilter===zn||E.magFilter===sh||E.magFilter===xc||E.magFilter===Os||E.minFilter===zn||E.minFilter===sh||E.minFilter===xc||E.minFilter===Os)&&at("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(O,s.TEXTURE_WRAP_S,ae[E.wrapS]),s.texParameteri(O,s.TEXTURE_WRAP_T,ae[E.wrapT]),(O===s.TEXTURE_3D||O===s.TEXTURE_2D_ARRAY)&&s.texParameteri(O,s.TEXTURE_WRAP_R,ae[E.wrapR]),s.texParameteri(O,s.TEXTURE_MAG_FILTER,Se[E.magFilter]),s.texParameteri(O,s.TEXTURE_MIN_FILTER,Se[E.minFilter]),E.compareFunction&&(s.texParameteri(O,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(O,s.TEXTURE_COMPARE_FUNC,Ge[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===Pn||E.minFilter!==xc&&E.minFilter!==Os||E.type===Hi&&e.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||i.get(E).__currentAnisotropy){const Z=e.get("EXT_texture_filter_anisotropic");s.texParameterf(O,Z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,a.getMaxAnisotropy())),i.get(E).__currentAnisotropy=E.anisotropy}}}function We(O,E){let Z=!1;O.__webglInit===void 0&&(O.__webglInit=!0,E.addEventListener("dispose",U));const oe=E.source;let fe=y.get(oe);fe===void 0&&(fe={},y.set(oe,fe));const Ee=re(E);if(Ee!==O.__cacheKey){fe[Ee]===void 0&&(fe[Ee]={texture:s.createTexture(),usedTimes:0},c.memory.textures++,Z=!0),fe[Ee].usedTimes++;const Ae=fe[O.__cacheKey];Ae!==void 0&&(fe[O.__cacheKey].usedTimes--,Ae.usedTimes===0&&B(E)),O.__cacheKey=Ee,O.__webglTexture=fe[Ee].texture}return Z}function le(O,E,Z){return Math.floor(Math.floor(O/Z)/E)}function de(O,E,Z,oe){const Ee=O.updateRanges;if(Ee.length===0)t.texSubImage2D(s.TEXTURE_2D,0,0,0,E.width,E.height,Z,oe,E.data);else{Ee.sort(($e,Ne)=>$e.start-Ne.start);let Ae=0;for(let $e=1;$e<Ee.length;$e++){const Ne=Ee[Ae],Te=Ee[$e],Ke=Ne.start+Ne.count,tt=le(Te.start,E.width,4),rt=le(Ne.start,E.width,4);Te.start<=Ke+1&&tt===rt&&le(Te.start+Te.count-1,E.width,4)===tt?Ne.count=Math.max(Ne.count,Te.start+Te.count-Ne.start):(++Ae,Ee[Ae]=Te)}Ee.length=Ae+1;const pe=t.getParameter(s.UNPACK_ROW_LENGTH),_e=t.getParameter(s.UNPACK_SKIP_PIXELS),Pe=t.getParameter(s.UNPACK_SKIP_ROWS);t.pixelStorei(s.UNPACK_ROW_LENGTH,E.width);for(let $e=0,Ne=Ee.length;$e<Ne;$e++){const Te=Ee[$e],Ke=Math.floor(Te.start/4),tt=Math.ceil(Te.count/4),rt=Ke%E.width,G=Math.floor(Ke/E.width),Ce=tt,ge=1;t.pixelStorei(s.UNPACK_SKIP_PIXELS,rt),t.pixelStorei(s.UNPACK_SKIP_ROWS,G),t.texSubImage2D(s.TEXTURE_2D,0,rt,G,Ce,ge,Z,oe,E.data)}O.clearUpdateRanges(),t.pixelStorei(s.UNPACK_ROW_LENGTH,pe),t.pixelStorei(s.UNPACK_SKIP_PIXELS,_e),t.pixelStorei(s.UNPACK_SKIP_ROWS,Pe)}}function we(O,E,Z){let oe=s.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(oe=s.TEXTURE_2D_ARRAY),E.isData3DTexture&&(oe=s.TEXTURE_3D);const fe=We(O,E),Ee=E.source;t.bindTexture(oe,O.__webglTexture,s.TEXTURE0+Z);const Ae=i.get(Ee);if(Ee.version!==Ae.__version||fe===!0){if(t.activeTexture(s.TEXTURE0+Z),(typeof ImageBitmap<"u"&&E.image instanceof ImageBitmap)===!1){const ge=wt.getPrimaries(wt.workingColorSpace),Re=E.colorSpace===rs?null:wt.getPrimaries(E.colorSpace),Fe=E.colorSpace===rs||ge===Re?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,E.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Fe)}t.pixelStorei(s.UNPACK_ALIGNMENT,E.unpackAlignment);let _e=S(E.image,!1,a.maxTextureSize);_e=fn(E,_e);const Pe=l.convert(E.format,E.colorSpace),$e=l.convert(E.type);let Ne=T(E.internalFormat,Pe,$e,E.normalized,E.colorSpace,E.isVideoTexture);He(oe,E);let Te;const Ke=E.mipmaps,tt=E.isVideoTexture!==!0,rt=Ae.__version===void 0||fe===!0,G=Ee.dataReady,Ce=L(E,_e);if(E.isDepthTexture)Ne=N(E.format===ks,E.type),rt&&(tt?t.texStorage2D(s.TEXTURE_2D,1,Ne,_e.width,_e.height):t.texImage2D(s.TEXTURE_2D,0,Ne,_e.width,_e.height,0,Pe,$e,null));else if(E.isDataTexture)if(Ke.length>0){tt&&rt&&t.texStorage2D(s.TEXTURE_2D,Ce,Ne,Ke[0].width,Ke[0].height);for(let ge=0,Re=Ke.length;ge<Re;ge++)Te=Ke[ge],tt?G&&t.texSubImage2D(s.TEXTURE_2D,ge,0,0,Te.width,Te.height,Pe,$e,Te.data):t.texImage2D(s.TEXTURE_2D,ge,Ne,Te.width,Te.height,0,Pe,$e,Te.data);E.generateMipmaps=!1}else tt?(rt&&t.texStorage2D(s.TEXTURE_2D,Ce,Ne,_e.width,_e.height),G&&de(E,_e,Pe,$e)):t.texImage2D(s.TEXTURE_2D,0,Ne,_e.width,_e.height,0,Pe,$e,_e.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){tt&&rt&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Ce,Ne,Ke[0].width,Ke[0].height,_e.depth);for(let ge=0,Re=Ke.length;ge<Re;ge++)if(Te=Ke[ge],E.format!==Vi)if(Pe!==null)if(tt){if(G)if(E.layerUpdates.size>0){const Fe=Pg(Te.width,Te.height,E.format,E.type);for(const xe of E.layerUpdates){const Qe=Te.data.subarray(xe*Fe/Te.data.BYTES_PER_ELEMENT,(xe+1)*Fe/Te.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,ge,0,0,xe,Te.width,Te.height,1,Pe,Qe)}}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,ge,0,0,0,Te.width,Te.height,_e.depth,Pe,Te.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,ge,Ne,Te.width,Te.height,_e.depth,0,Te.data,0,0);else at("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else tt?G&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,ge,0,0,0,Te.width,Te.height,_e.depth,Pe,$e,Te.data):t.texImage3D(s.TEXTURE_2D_ARRAY,ge,Ne,Te.width,Te.height,_e.depth,0,Pe,$e,Te.data);E.layerUpdates.size>0&&E.clearLayerUpdates()}else{tt&&rt&&t.texStorage2D(s.TEXTURE_2D,Ce,Ne,Ke[0].width,Ke[0].height);for(let ge=0,Re=Ke.length;ge<Re;ge++)Te=Ke[ge],E.format!==Vi?Pe!==null?tt?G&&t.compressedTexSubImage2D(s.TEXTURE_2D,ge,0,0,Te.width,Te.height,Pe,Te.data):t.compressedTexImage2D(s.TEXTURE_2D,ge,Ne,Te.width,Te.height,0,Te.data):at("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):tt?G&&t.texSubImage2D(s.TEXTURE_2D,ge,0,0,Te.width,Te.height,Pe,$e,Te.data):t.texImage2D(s.TEXTURE_2D,ge,Ne,Te.width,Te.height,0,Pe,$e,Te.data)}else if(E.isDataArrayTexture)if(tt){if(rt&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Ce,Ne,_e.width,_e.height,_e.depth),G)if(E.layerUpdates.size>0){const ge=Pg(_e.width,_e.height,E.format,E.type);for(const Re of E.layerUpdates){const Fe=_e.data.subarray(Re*ge/_e.data.BYTES_PER_ELEMENT,(Re+1)*ge/_e.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,Re,_e.width,_e.height,1,Pe,$e,Fe)}E.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,_e.width,_e.height,_e.depth,Pe,$e,_e.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,Ne,_e.width,_e.height,_e.depth,0,Pe,$e,_e.data);else if(E.isData3DTexture)tt?(rt&&t.texStorage3D(s.TEXTURE_3D,Ce,Ne,_e.width,_e.height,_e.depth),G&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,_e.width,_e.height,_e.depth,Pe,$e,_e.data)):t.texImage3D(s.TEXTURE_3D,0,Ne,_e.width,_e.height,_e.depth,0,Pe,$e,_e.data);else if(E.isFramebufferTexture){if(rt)if(tt)t.texStorage2D(s.TEXTURE_2D,Ce,Ne,_e.width,_e.height);else{let ge=_e.width,Re=_e.height;for(let Fe=0;Fe<Ce;Fe++)t.texImage2D(s.TEXTURE_2D,Fe,Ne,ge,Re,0,Pe,$e,null),ge>>=1,Re>>=1}}else if(E.isHTMLTexture){if("texElementImage2D"in s){const ge=s.canvas;if(ge.hasAttribute("layoutsubtree")||ge.setAttribute("layoutsubtree","true"),_e.parentNode!==ge){ge.appendChild(_e),m.add(E),ge.onpaint=Re=>{const Fe=Re.changedElements;for(const xe of m)Fe.includes(xe.image)&&(xe.needsUpdate=!0)},ge.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,_e);else{const Fe=s.RGBA,xe=s.RGBA,Qe=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,Fe,xe,Qe,_e)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(Ke.length>0){if(tt&&rt){const ge=At(Ke[0]);t.texStorage2D(s.TEXTURE_2D,Ce,Ne,ge.width,ge.height)}for(let ge=0,Re=Ke.length;ge<Re;ge++)Te=Ke[ge],tt?G&&t.texSubImage2D(s.TEXTURE_2D,ge,0,0,Pe,$e,Te):t.texImage2D(s.TEXTURE_2D,ge,Ne,Pe,$e,Te);E.generateMipmaps=!1}else if(tt){if(rt){const ge=At(_e);t.texStorage2D(s.TEXTURE_2D,Ce,Ne,ge.width,ge.height)}G&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,Pe,$e,_e)}else t.texImage2D(s.TEXTURE_2D,0,Ne,Pe,$e,_e);v(E)&&R(oe),Ae.__version=Ee.version,E.onUpdate&&E.onUpdate(E)}O.__version=E.version}function et(O,E,Z){if(E.image.length!==6)return;const oe=We(O,E),fe=E.source;t.bindTexture(s.TEXTURE_CUBE_MAP,O.__webglTexture,s.TEXTURE0+Z);const Ee=i.get(fe);if(fe.version!==Ee.__version||oe===!0){t.activeTexture(s.TEXTURE0+Z);const Ae=wt.getPrimaries(wt.workingColorSpace),pe=E.colorSpace===rs?null:wt.getPrimaries(E.colorSpace),_e=E.colorSpace===rs||Ae===pe?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,E.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),t.pixelStorei(s.UNPACK_ALIGNMENT,E.unpackAlignment),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,_e);const Pe=E.isCompressedTexture||E.image[0].isCompressedTexture,$e=E.image[0]&&E.image[0].isDataTexture,Ne=[];for(let xe=0;xe<6;xe++)!Pe&&!$e?Ne[xe]=S(E.image[xe],!0,a.maxCubemapSize):Ne[xe]=$e?E.image[xe].image:E.image[xe],Ne[xe]=fn(E,Ne[xe]);const Te=Ne[0],Ke=l.convert(E.format,E.colorSpace),tt=l.convert(E.type),rt=T(E.internalFormat,Ke,tt,E.normalized,E.colorSpace),G=E.isVideoTexture!==!0,Ce=Ee.__version===void 0||oe===!0,ge=fe.dataReady;let Re=L(E,Te);He(s.TEXTURE_CUBE_MAP,E);let Fe;if(Pe){G&&Ce&&t.texStorage2D(s.TEXTURE_CUBE_MAP,Re,rt,Te.width,Te.height);for(let xe=0;xe<6;xe++){Fe=Ne[xe].mipmaps;for(let Qe=0;Qe<Fe.length;Qe++){const qe=Fe[Qe];E.format!==Vi?Ke!==null?G?ge&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xe,Qe,0,0,qe.width,qe.height,Ke,qe.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xe,Qe,rt,qe.width,qe.height,0,qe.data):at("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):G?ge&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xe,Qe,0,0,qe.width,qe.height,Ke,tt,qe.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xe,Qe,rt,qe.width,qe.height,0,Ke,tt,qe.data)}}}else{if(Fe=E.mipmaps,G&&Ce){Fe.length>0&&Re++;const xe=At(Ne[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,Re,rt,xe.width,xe.height)}for(let xe=0;xe<6;xe++)if($e){G?ge&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xe,0,0,0,Ne[xe].width,Ne[xe].height,Ke,tt,Ne[xe].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xe,0,rt,Ne[xe].width,Ne[xe].height,0,Ke,tt,Ne[xe].data);for(let Qe=0;Qe<Fe.length;Qe++){const Ct=Fe[Qe].image[xe].image;G?ge&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xe,Qe+1,0,0,Ct.width,Ct.height,Ke,tt,Ct.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xe,Qe+1,rt,Ct.width,Ct.height,0,Ke,tt,Ct.data)}}else{G?ge&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xe,0,0,0,Ke,tt,Ne[xe]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xe,0,rt,Ke,tt,Ne[xe]);for(let Qe=0;Qe<Fe.length;Qe++){const qe=Fe[Qe];G?ge&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xe,Qe+1,0,0,Ke,tt,qe.image[xe]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xe,Qe+1,rt,Ke,tt,qe.image[xe])}}}v(E)&&R(s.TEXTURE_CUBE_MAP),Ee.__version=fe.version,E.onUpdate&&E.onUpdate(E)}O.__version=E.version}function Oe(O,E,Z,oe,fe,Ee){const Ae=l.convert(Z.format,Z.colorSpace),pe=l.convert(Z.type),_e=T(Z.internalFormat,Ae,pe,Z.normalized,Z.colorSpace),Pe=i.get(E),$e=i.get(Z);if($e.__renderTarget=E,!Pe.__hasExternalTextures){const Ne=Math.max(1,E.width>>Ee),Te=Math.max(1,E.height>>Ee);fe===s.TEXTURE_3D||fe===s.TEXTURE_2D_ARRAY?t.texImage3D(fe,Ee,_e,Ne,Te,E.depth,0,Ae,pe,null):t.texImage2D(fe,Ee,_e,Ne,Te,0,Ae,pe,null)}t.bindFramebuffer(s.FRAMEBUFFER,O),qt(E)?d.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,oe,fe,$e.__webglTexture,0,Dt(E)):(fe===s.TEXTURE_2D||fe>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&fe<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,oe,fe,$e.__webglTexture,Ee),t.bindFramebuffer(s.FRAMEBUFFER,null)}function ft(O,E,Z){if(s.bindRenderbuffer(s.RENDERBUFFER,O),E.depthBuffer){const oe=E.depthTexture,fe=oe&&oe.isDepthTexture?oe.type:null,Ee=N(E.stencilBuffer,fe),Ae=E.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;qt(E)?d.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Dt(E),Ee,E.width,E.height):Z?s.renderbufferStorageMultisample(s.RENDERBUFFER,Dt(E),Ee,E.width,E.height):s.renderbufferStorage(s.RENDERBUFFER,Ee,E.width,E.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,Ae,s.RENDERBUFFER,O)}else{const oe=E.textures;for(let fe=0;fe<oe.length;fe++){const Ee=oe[fe],Ae=l.convert(Ee.format,Ee.colorSpace),pe=l.convert(Ee.type),_e=T(Ee.internalFormat,Ae,pe,Ee.normalized,Ee.colorSpace);qt(E)?d.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Dt(E),_e,E.width,E.height):Z?s.renderbufferStorageMultisample(s.RENDERBUFFER,Dt(E),_e,E.width,E.height):s.renderbufferStorage(s.RENDERBUFFER,_e,E.width,E.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Xt(O,E,Z){const oe=E.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(s.FRAMEBUFFER,O),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const fe=i.get(E.depthTexture);if(fe.__renderTarget=E,(!fe.__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),oe){if(fe.__webglInit===void 0&&(fe.__webglInit=!0,E.depthTexture.addEventListener("dispose",U)),fe.__webglTexture===void 0){fe.__webglTexture=s.createTexture(),t.bindTexture(s.TEXTURE_CUBE_MAP,fe.__webglTexture),He(s.TEXTURE_CUBE_MAP,E.depthTexture);const Pe=l.convert(E.depthTexture.format),$e=l.convert(E.depthTexture.type);let Ne;E.depthTexture.format===Lr?Ne=s.DEPTH_COMPONENT24:E.depthTexture.format===ks&&(Ne=s.DEPTH24_STENCIL8);for(let Te=0;Te<6;Te++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Te,0,Ne,E.width,E.height,0,Pe,$e,null)}}else J(E.depthTexture,0);const Ee=fe.__webglTexture,Ae=Dt(E),pe=oe?s.TEXTURE_CUBE_MAP_POSITIVE_X+Z:s.TEXTURE_2D,_e=E.depthTexture.format===ks?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(E.depthTexture.format===Lr)qt(E)?d.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,_e,pe,Ee,0,Ae):s.framebufferTexture2D(s.FRAMEBUFFER,_e,pe,Ee,0);else if(E.depthTexture.format===ks)qt(E)?d.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,_e,pe,Ee,0,Ae):s.framebufferTexture2D(s.FRAMEBUFFER,_e,pe,Ee,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function pt(O){const E=i.get(O),Z=O.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==O.depthTexture){const oe=O.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),oe){const fe=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,oe.removeEventListener("dispose",fe)};oe.addEventListener("dispose",fe),E.__depthDisposeCallback=fe}E.__boundDepthTexture=oe}if(O.depthTexture&&!E.__autoAllocateDepthBuffer)if(Z)for(let oe=0;oe<6;oe++)Xt(E.__webglFramebuffer[oe],O,oe);else{const oe=O.texture.mipmaps;oe&&oe.length>0?Xt(E.__webglFramebuffer[0],O,0):Xt(E.__webglFramebuffer,O,0)}else if(Z){E.__webglDepthbuffer=[];for(let oe=0;oe<6;oe++)if(t.bindFramebuffer(s.FRAMEBUFFER,E.__webglFramebuffer[oe]),E.__webglDepthbuffer[oe]===void 0)E.__webglDepthbuffer[oe]=s.createRenderbuffer(),ft(E.__webglDepthbuffer[oe],O,!1);else{const fe=O.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Ee=E.__webglDepthbuffer[oe];s.bindRenderbuffer(s.RENDERBUFFER,Ee),s.framebufferRenderbuffer(s.FRAMEBUFFER,fe,s.RENDERBUFFER,Ee)}}else{const oe=O.texture.mipmaps;if(oe&&oe.length>0?t.bindFramebuffer(s.FRAMEBUFFER,E.__webglFramebuffer[0]):t.bindFramebuffer(s.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=s.createRenderbuffer(),ft(E.__webglDepthbuffer,O,!1);else{const fe=O.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Ee=E.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,Ee),s.framebufferRenderbuffer(s.FRAMEBUFFER,fe,s.RENDERBUFFER,Ee)}}t.bindFramebuffer(s.FRAMEBUFFER,null)}function St(O,E,Z){const oe=i.get(O);E!==void 0&&Oe(oe.__webglFramebuffer,O,O.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),Z!==void 0&&pt(O)}function It(O){const E=O.texture,Z=i.get(O),oe=i.get(E);O.addEventListener("dispose",w);const fe=O.textures,Ee=O.isWebGLCubeRenderTarget===!0,Ae=fe.length>1;if(Ae||(oe.__webglTexture===void 0&&(oe.__webglTexture=s.createTexture()),oe.__version=E.version,c.memory.textures++),Ee){Z.__webglFramebuffer=[];for(let pe=0;pe<6;pe++)if(E.mipmaps&&E.mipmaps.length>0){Z.__webglFramebuffer[pe]=[];for(let _e=0;_e<E.mipmaps.length;_e++)Z.__webglFramebuffer[pe][_e]=s.createFramebuffer()}else Z.__webglFramebuffer[pe]=s.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){Z.__webglFramebuffer=[];for(let pe=0;pe<E.mipmaps.length;pe++)Z.__webglFramebuffer[pe]=s.createFramebuffer()}else Z.__webglFramebuffer=s.createFramebuffer();if(Ae)for(let pe=0,_e=fe.length;pe<_e;pe++){const Pe=i.get(fe[pe]);Pe.__webglTexture===void 0&&(Pe.__webglTexture=s.createTexture(),c.memory.textures++)}if(O.samples>0&&qt(O)===!1){Z.__webglMultisampledFramebuffer=s.createFramebuffer(),Z.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,Z.__webglMultisampledFramebuffer);for(let pe=0;pe<fe.length;pe++){const _e=fe[pe];Z.__webglColorRenderbuffer[pe]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,Z.__webglColorRenderbuffer[pe]);const Pe=l.convert(_e.format,_e.colorSpace),$e=l.convert(_e.type),Ne=T(_e.internalFormat,Pe,$e,_e.normalized,_e.colorSpace,O.isXRRenderTarget===!0),Te=Dt(O);s.renderbufferStorageMultisample(s.RENDERBUFFER,Te,Ne,O.width,O.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+pe,s.RENDERBUFFER,Z.__webglColorRenderbuffer[pe])}s.bindRenderbuffer(s.RENDERBUFFER,null),O.depthBuffer&&(Z.__webglDepthRenderbuffer=s.createRenderbuffer(),ft(Z.__webglDepthRenderbuffer,O,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(Ee){t.bindTexture(s.TEXTURE_CUBE_MAP,oe.__webglTexture),He(s.TEXTURE_CUBE_MAP,E);for(let pe=0;pe<6;pe++)if(E.mipmaps&&E.mipmaps.length>0)for(let _e=0;_e<E.mipmaps.length;_e++)Oe(Z.__webglFramebuffer[pe][_e],O,E,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,_e);else Oe(Z.__webglFramebuffer[pe],O,E,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0);v(E)&&R(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ae){for(let pe=0,_e=fe.length;pe<_e;pe++){const Pe=fe[pe],$e=i.get(Pe);let Ne=s.TEXTURE_2D;(O.isWebGL3DRenderTarget||O.isWebGLArrayRenderTarget)&&(Ne=O.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(Ne,$e.__webglTexture),He(Ne,Pe),Oe(Z.__webglFramebuffer,O,Pe,s.COLOR_ATTACHMENT0+pe,Ne,0),v(Pe)&&R(Ne)}t.unbindTexture()}else{let pe=s.TEXTURE_2D;if((O.isWebGL3DRenderTarget||O.isWebGLArrayRenderTarget)&&(pe=O.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(pe,oe.__webglTexture),He(pe,E),E.mipmaps&&E.mipmaps.length>0)for(let _e=0;_e<E.mipmaps.length;_e++)Oe(Z.__webglFramebuffer[_e],O,E,s.COLOR_ATTACHMENT0,pe,_e);else Oe(Z.__webglFramebuffer,O,E,s.COLOR_ATTACHMENT0,pe,0);v(E)&&R(pe),t.unbindTexture()}O.depthBuffer&&pt(O)}function mt(O){const E=O.textures;for(let Z=0,oe=E.length;Z<oe;Z++){const fe=E[Z];if(v(fe)){const Ee=I(O),Ae=i.get(fe).__webglTexture;t.bindTexture(Ee,Ae),R(Ee),t.unbindTexture()}}}const Ht=[],nn=[];function cn(O){if(O.samples>0){if(qt(O)===!1){const E=O.textures,Z=O.width,oe=O.height;let fe=s.COLOR_BUFFER_BIT;const Ee=O.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Ae=i.get(O),pe=E.length>1;if(pe)for(let Pe=0;Pe<E.length;Pe++)t.bindFramebuffer(s.FRAMEBUFFER,Ae.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Pe,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,Ae.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Pe,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,Ae.__webglMultisampledFramebuffer);const _e=O.texture.mipmaps;_e&&_e.length>0?t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ae.__webglFramebuffer[0]):t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ae.__webglFramebuffer);for(let Pe=0;Pe<E.length;Pe++){if(O.resolveDepthBuffer&&(O.depthBuffer&&(fe|=s.DEPTH_BUFFER_BIT),O.stencilBuffer&&O.resolveStencilBuffer&&(fe|=s.STENCIL_BUFFER_BIT)),pe){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,Ae.__webglColorRenderbuffer[Pe]);const $e=i.get(E[Pe]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,$e,0)}s.blitFramebuffer(0,0,Z,oe,0,0,Z,oe,fe,s.NEAREST),h===!0&&(Ht.length=0,nn.length=0,Ht.push(s.COLOR_ATTACHMENT0+Pe),O.depthBuffer&&O.storeMultisampledDepthBuffer===!1&&(Ht.push(Ee),nn.push(Ee),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,nn)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,Ht))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),pe)for(let Pe=0;Pe<E.length;Pe++){t.bindFramebuffer(s.FRAMEBUFFER,Ae.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Pe,s.RENDERBUFFER,Ae.__webglColorRenderbuffer[Pe]);const $e=i.get(E[Pe]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,Ae.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Pe,s.TEXTURE_2D,$e,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ae.__webglMultisampledFramebuffer)}else if(O.depthBuffer&&O.storeMultisampledDepthBuffer===!1&&h){const E=O.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[E])}}}function Dt(O){return Math.min(a.maxSamples,O.samples)}function qt(O){const E=i.get(O);return O.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function X(O){const E=c.render.frame;_.get(O)!==E&&(_.set(O,E),O.update())}function fn(O,E){const Z=O.colorSpace,oe=O.format,fe=O.type;return O.isCompressedTexture===!0||O.isVideoTexture===!0||Z!==su&&Z!==rs&&(wt.getTransfer(Z)===Ft?(oe!==Vi||fe!==di)&&at("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Nt("WebGLTextures: Unsupported texture color space:",Z)),E}function At(O){return typeof HTMLImageElement<"u"&&O instanceof HTMLImageElement?(f.width=O.naturalWidth||O.width,f.height=O.naturalHeight||O.height):typeof VideoFrame<"u"&&O instanceof VideoFrame?(f.width=O.displayWidth,f.height=O.displayHeight):(f.width=O.width,f.height=O.height),f}this.allocateTextureUnit=he,this.resetTextureUnits=te,this.getTextureUnits=V,this.setTextureUnits=Q,this.setTexture2D=J,this.setTexture2DArray=$,this.setTexture3D=K,this.setTextureCube=F,this.rebindTextures=St,this.setupRenderTarget=It,this.updateRenderTargetMipmap=mt,this.updateMultisampleRenderTarget=cn,this.setupDepthRenderbuffer=pt,this.setupFrameBufferTexture=Oe,this.useMultisampledRTT=qt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function aA(s,e){function t(i,a=rs){let l;const c=wt.getTransfer(a);if(i===di)return s.UNSIGNED_BYTE;if(i===Bf)return s.UNSIGNED_SHORT_4_4_4_4;if(i===zf)return s.UNSIGNED_SHORT_5_5_5_1;if(i===z_)return s.UNSIGNED_INT_5_9_9_9_REV;if(i===H_)return s.UNSIGNED_INT_10F_11F_11F_REV;if(i===k_)return s.BYTE;if(i===B_)return s.SHORT;if(i===rl)return s.UNSIGNED_SHORT;if(i===kf)return s.INT;if(i===ar)return s.UNSIGNED_INT;if(i===Hi)return s.FLOAT;if(i===or)return s.HALF_FLOAT;if(i===V_)return s.ALPHA;if(i===G_)return s.RGB;if(i===Vi)return s.RGBA;if(i===Lr)return s.DEPTH_COMPONENT;if(i===ks)return s.DEPTH_STENCIL;if(i===Hf)return s.RED;if(i===Vf)return s.RED_INTEGER;if(i===Ys)return s.RG;if(i===Gf)return s.RG_INTEGER;if(i===Wf)return s.RGBA_INTEGER;if(i===Yc||i===$c||i===Kc||i===Zc)if(c===Ft)if(l=e.get("WEBGL_compressed_texture_s3tc_srgb"),l!==null){if(i===Yc)return l.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===$c)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Kc)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Zc)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(l=e.get("WEBGL_compressed_texture_s3tc"),l!==null){if(i===Yc)return l.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===$c)return l.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Kc)return l.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Zc)return l.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Zh||i===Qh||i===Jh||i===ef)if(l=e.get("WEBGL_compressed_texture_pvrtc"),l!==null){if(i===Zh)return l.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Qh)return l.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Jh)return l.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===ef)return l.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===tf||i===nf||i===rf||i===sf||i===af||i===nu||i===of)if(l=e.get("WEBGL_compressed_texture_etc"),l!==null){if(i===tf||i===nf)return c===Ft?l.COMPRESSED_SRGB8_ETC2:l.COMPRESSED_RGB8_ETC2;if(i===rf)return c===Ft?l.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:l.COMPRESSED_RGBA8_ETC2_EAC;if(i===sf)return l.COMPRESSED_R11_EAC;if(i===af)return l.COMPRESSED_SIGNED_R11_EAC;if(i===nu)return l.COMPRESSED_RG11_EAC;if(i===of)return l.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===lf||i===cf||i===uf||i===df||i===hf||i===ff||i===pf||i===mf||i===gf||i===_f||i===xf||i===vf||i===yf||i===Sf)if(l=e.get("WEBGL_compressed_texture_astc"),l!==null){if(i===lf)return c===Ft?l.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:l.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===cf)return c===Ft?l.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:l.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===uf)return c===Ft?l.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:l.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===df)return c===Ft?l.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:l.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===hf)return c===Ft?l.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:l.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===ff)return c===Ft?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:l.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===pf)return c===Ft?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:l.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===mf)return c===Ft?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:l.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===gf)return c===Ft?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:l.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===_f)return c===Ft?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:l.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===xf)return c===Ft?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:l.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===vf)return c===Ft?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:l.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===yf)return c===Ft?l.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:l.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Sf)return c===Ft?l.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:l.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Mf||i===Ef||i===wf)if(l=e.get("EXT_texture_compression_bptc"),l!==null){if(i===Mf)return c===Ft?l.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:l.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Ef)return l.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===wf)return l.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===bf||i===Tf||i===iu||i===Af)if(l=e.get("EXT_texture_compression_rgtc"),l!==null){if(i===bf)return l.COMPRESSED_RED_RGTC1_EXT;if(i===Tf)return l.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===iu)return l.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Af)return l.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===sl?s.UNSIGNED_INT_24_8:s[i]!==void 0?s[i]:null}return{convert:t}}const oA=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,lA=`
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

}`;class cA{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new Q_(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new cr({vertexShader:oA,fragmentShader:lA,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ot(new Nr(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class uA extends fs{constructor(e,t){super();const i=this;let a=null,l=1,c=null,d="local-floor",h=1,f=null,_=null,m=null,g=null,y=null,M=null;const b=typeof XRWebGLBinding<"u",S=new cA,v={},R=t.getContextAttributes();let I=null,T=null;const N=[],L=[],U=new ot;let w=null,D=null;const B=new ui;B.viewport=new en;const z=new ui;z.viewport=new en;const j=[B,z],te=new _E;let V=null,Q=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(le){let de=N[le];return de===void 0&&(de=new fh,N[le]=de),de.getTargetRaySpace()},this.getControllerGrip=function(le){let de=N[le];return de===void 0&&(de=new fh,N[le]=de),de.getGripSpace()},this.getHand=function(le){let de=N[le];return de===void 0&&(de=new fh,N[le]=de),de.getHandSpace()};function he(le){const de=L.indexOf(le.inputSource);if(de===-1)return;const we=N[de];we!==void 0&&(we.update(le.inputSource,le.frame,f||c),we.dispatchEvent({type:le.type,data:le.inputSource}))}function re(){a.removeEventListener("select",he),a.removeEventListener("selectstart",he),a.removeEventListener("selectend",he),a.removeEventListener("squeeze",he),a.removeEventListener("squeezestart",he),a.removeEventListener("squeezeend",he),a.removeEventListener("end",re),a.removeEventListener("inputsourceschange",J);for(let le=0;le<N.length;le++){const de=L[le];de!==null&&(L[le]=null,N[le].disconnect(de))}V=null,Q=null,S.reset();for(const le in v)delete v[le];if(e.setRenderTarget(I),y=null,g=null,m=null,a=null,T=null,We.stop(),i.isPresenting=!1,e.setPixelRatio(w),e.setSize(U.width,U.height,!1),D!==null){const le=D.camera;le.fov=D.fov,le.zoom=D.zoom,le.updateProjectionMatrix(),D=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(le){l=le,i.isPresenting===!0&&at("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(le){d=le,i.isPresenting===!0&&at("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return f||c},this.setReferenceSpace=function(le){f=le},this.getBaseLayer=function(){return g!==null?g:y},this.getBinding=function(){return m===null&&b&&(m=new XRWebGLBinding(a,t)),m},this.getFrame=function(){return M},this.getSession=function(){return a},this.setSession=async function(le){if(a=le,a!==null){if(I=e.getRenderTarget(),a.addEventListener("select",he),a.addEventListener("selectstart",he),a.addEventListener("selectend",he),a.addEventListener("squeeze",he),a.addEventListener("squeezestart",he),a.addEventListener("squeezeend",he),a.addEventListener("end",re),a.addEventListener("inputsourceschange",J),R.xrCompatible!==!0&&await t.makeXRCompatible(),w=e.getPixelRatio(),e.getSize(U),b&&"createProjectionLayer"in XRWebGLBinding.prototype){let we=null,et=null,Oe=null;R.depth&&(Oe=R.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,we=R.stencil?ks:Lr,et=R.stencil?sl:ar);const ft={colorFormat:t.RGBA8,depthFormat:Oe,scaleFactor:l};m=this.getBinding(),g=m.createProjectionLayer(ft),a.updateRenderState({layers:[g]}),e.setPixelRatio(1),e.setSize(g.textureWidth,g.textureHeight,!1),T=new Gi(g.textureWidth,g.textureHeight,{format:Vi,type:di,depthTexture:new ol(g.textureWidth,g.textureHeight,et,void 0,void 0,void 0,void 0,void 0,void 0,we),stencilBuffer:R.stencil,colorSpace:e.outputColorSpace,samples:R.antialias?4:0,resolveDepthBuffer:g.ignoreDepthValues===!1,resolveStencilBuffer:g.ignoreDepthValues===!1,storeMultisampledDepthBuffer:g.ignoreDepthValues===!1,storeMultisampledStencilBuffer:g.ignoreDepthValues===!1})}else{const we={antialias:R.antialias,alpha:!0,depth:R.depth,stencil:R.stencil,framebufferScaleFactor:l};y=new XRWebGLLayer(a,t,we),a.updateRenderState({baseLayer:y}),e.setPixelRatio(1),e.setSize(y.framebufferWidth,y.framebufferHeight,!1),T=new Gi(y.framebufferWidth,y.framebufferHeight,{format:Vi,type:di,colorSpace:e.outputColorSpace,stencilBuffer:R.stencil,resolveDepthBuffer:y.ignoreDepthValues===!1,resolveStencilBuffer:y.ignoreDepthValues===!1,storeMultisampledDepthBuffer:y.ignoreDepthValues===!1,storeMultisampledStencilBuffer:y.ignoreDepthValues===!1})}T.isXRRenderTarget=!0,this.setFoveation(h),f=null,c=await a.requestReferenceSpace(d),We.setContext(a),We.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return S.getDepthTexture()};function J(le){for(let de=0;de<le.removed.length;de++){const we=le.removed[de],et=L.indexOf(we);et>=0&&(L[et]=null,N[et].disconnect(we))}for(let de=0;de<le.added.length;de++){const we=le.added[de];let et=L.indexOf(we);if(et===-1){for(let ft=0;ft<N.length;ft++)if(ft>=L.length){L.push(we),et=ft;break}else if(L[ft]===null){L[ft]=we,et=ft;break}if(et===-1)break}const Oe=N[et];Oe&&Oe.connect(we)}}const $=new Y,K=new Y;function F(le,de,we){$.setFromMatrixPosition(de.matrixWorld),K.setFromMatrixPosition(we.matrixWorld);const et=$.distanceTo(K),Oe=de.projectionMatrix.elements,ft=we.projectionMatrix.elements,Xt=Oe[14]/(Oe[10]-1),pt=Oe[14]/(Oe[10]+1),St=(Oe[9]+1)/Oe[5],It=(Oe[9]-1)/Oe[5],mt=(Oe[8]-1)/Oe[0],Ht=(ft[8]+1)/ft[0],nn=Xt*mt,cn=Xt*Ht,Dt=et/(-mt+Ht),qt=Dt*-mt;if(de.matrixWorld.decompose(le.position,le.quaternion,le.scale),le.translateX(qt),le.translateZ(Dt),le.matrixWorld.compose(le.position,le.quaternion,le.scale),le.matrixWorldInverse.copy(le.matrixWorld).invert(),Oe[10]===-1)le.projectionMatrix.copy(de.projectionMatrix),le.projectionMatrixInverse.copy(de.projectionMatrixInverse);else{const X=Xt+Dt,fn=pt+Dt,At=nn-qt,O=cn+(et-qt),E=St*pt/fn*X,Z=It*pt/fn*X;le.projectionMatrix.makePerspective(At,O,E,Z,X,fn),le.projectionMatrixInverse.copy(le.projectionMatrix).invert()}}function ae(le,de){de===null?le.matrixWorld.copy(le.matrix):le.matrixWorld.multiplyMatrices(de.matrixWorld,le.matrix),le.matrixWorldInverse.copy(le.matrixWorld).invert()}this.updateCamera=function(le){if(a===null)return;let de=le.near,we=le.far;S.texture!==null&&(S.depthNear>0&&(de=S.depthNear),S.depthFar>0&&(we=S.depthFar)),te.near=z.near=B.near=de,te.far=z.far=B.far=we,(V!==te.near||Q!==te.far)&&(a.updateRenderState({depthNear:te.near,depthFar:te.far}),V=te.near,Q=te.far),te.layers.mask=le.layers.mask|6,B.layers.mask=te.layers.mask&-5,z.layers.mask=te.layers.mask&-3;const et=le.parent,Oe=te.cameras;ae(te,et);for(let ft=0;ft<Oe.length;ft++)ae(Oe[ft],et);Oe.length===2?F(te,B,z):te.projectionMatrix.copy(B.projectionMatrix),D===null&&le.isPerspectiveCamera&&(D={camera:le,fov:le.fov,zoom:le.zoom}),Se(le,te,et)};function Se(le,de,we){we===null?le.matrix.copy(de.matrixWorld):(le.matrix.copy(we.matrixWorld),le.matrix.invert(),le.matrix.multiply(de.matrixWorld)),le.matrix.decompose(le.position,le.quaternion,le.scale),le.updateMatrixWorld(!0),le.projectionMatrix.copy(de.projectionMatrix),le.projectionMatrixInverse.copy(de.projectionMatrixInverse),le.isPerspectiveCamera&&(le.fov=lu*2*Math.atan(1/le.projectionMatrix.elements[5]),le.zoom=1)}this.getCamera=function(){return te},this.getFoveation=function(){if(!(g===null&&y===null))return h},this.setFoveation=function(le){h=le,g!==null&&(g.fixedFoveation=le),y!==null&&y.fixedFoveation!==void 0&&(y.fixedFoveation=le)},this.hasDepthSensing=function(){return S.texture!==null},this.getDepthSensingMesh=function(){return S.getMesh(te)},this.getCameraTexture=function(le){return v[le]};let Ge=null;function He(le,de){if(_=de.getViewerPose(f||c),M=de,_!==null){const we=_.views;y!==null&&(e.setRenderTargetFramebuffer(T,y.framebuffer),e.setRenderTarget(T));let et=!1;we.length!==te.cameras.length&&(te.cameras.length=0,et=!0);for(let pt=0;pt<we.length;pt++){const St=we[pt];let It=null;if(y!==null)It=y.getViewport(St);else{const Ht=m.getViewSubImage(g,St);It=Ht.viewport,pt===0&&(e.setRenderTargetTextures(T,Ht.colorTexture,Ht.depthStencilTexture),e.setRenderTarget(T))}let mt=j[pt];mt===void 0&&(mt=new ui,mt.layers.enable(pt),mt.viewport=new en,j[pt]=mt),mt.matrix.fromArray(St.transform.matrix),mt.matrix.decompose(mt.position,mt.quaternion,mt.scale),mt.projectionMatrix.fromArray(St.projectionMatrix),mt.projectionMatrixInverse.copy(mt.projectionMatrix).invert(),mt.viewport.set(It.x,It.y,It.width,It.height),pt===0&&(te.matrix.copy(mt.matrix),te.matrix.decompose(te.position,te.quaternion,te.scale)),et===!0&&te.cameras.push(mt)}const Oe=a.enabledFeatures;if(Oe&&Oe.includes("depth-sensing")&&a.depthUsage=="gpu-optimized"&&b){m=i.getBinding();const pt=m.getDepthInformation(we[0]);pt&&pt.isValid&&pt.texture&&S.init(pt,a.renderState)}if(Oe&&Oe.includes("camera-access")&&b){e.state.unbindTexture(),m=i.getBinding();for(let pt=0;pt<we.length;pt++){const St=we[pt].camera;if(St){let It=v[St];It||(It=new Q_,v[St]=It);const mt=m.getCameraImage(St);It.sourceTexture=mt}}}}for(let we=0;we<N.length;we++){const et=L[we],Oe=N[we];et!==null&&Oe!==void 0&&Oe.update(et,de,f||c)}Ge&&Ge(le,de),de.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:de}),M=null}const We=new nx;We.setAnimationLoop(He),this.setAnimationLoop=function(le){Ge=le},this.dispose=function(){}}}const dA=new zt,cx=new dt;cx.set(-1,0,0,0,1,0,0,0,1);function hA(s,e){function t(S,v){S.matrixAutoUpdate===!0&&S.updateMatrix(),v.value.copy(S.matrix)}function i(S,v){v.color.getRGB(S.fogColor.value,J_(s)),v.isFog?(S.fogNear.value=v.near,S.fogFar.value=v.far):v.isFogExp2&&(S.fogDensity.value=v.density)}function a(S,v,R,I,T){v.isNodeMaterial?v.uniformsNeedUpdate=!1:v.isMeshBasicMaterial?l(S,v):v.isMeshLambertMaterial?(l(S,v),v.envMap&&(S.envMapIntensity.value=v.envMapIntensity)):v.isMeshToonMaterial?(l(S,v),m(S,v)):v.isMeshPhongMaterial?(l(S,v),_(S,v),v.envMap&&(S.envMapIntensity.value=v.envMapIntensity)):v.isMeshStandardMaterial?(l(S,v),g(S,v),v.isMeshPhysicalMaterial&&y(S,v,T)):v.isMeshMatcapMaterial?(l(S,v),M(S,v)):v.isMeshDepthMaterial?l(S,v):v.isMeshDistanceMaterial?(l(S,v),b(S,v)):v.isMeshNormalMaterial?l(S,v):v.isLineBasicMaterial?(c(S,v),v.isLineDashedMaterial&&d(S,v)):v.isPointsMaterial?h(S,v,R,I):v.isSpriteMaterial?f(S,v):v.isShadowMaterial?(S.color.value.copy(v.color),S.opacity.value=v.opacity):v.isShaderMaterial&&(v.uniformsNeedUpdate=!1)}function l(S,v){S.opacity.value=v.opacity,v.color&&S.diffuse.value.copy(v.color),v.emissive&&S.emissive.value.copy(v.emissive).multiplyScalar(v.emissiveIntensity),v.map&&(S.map.value=v.map,t(v.map,S.mapTransform)),v.alphaMap&&(S.alphaMap.value=v.alphaMap,t(v.alphaMap,S.alphaMapTransform)),v.bumpMap&&(S.bumpMap.value=v.bumpMap,t(v.bumpMap,S.bumpMapTransform),S.bumpScale.value=v.bumpScale,v.side===ni&&(S.bumpScale.value*=-1)),v.normalMap&&(S.normalMap.value=v.normalMap,t(v.normalMap,S.normalMapTransform),S.normalScale.value.copy(v.normalScale),v.side===ni&&S.normalScale.value.negate()),v.displacementMap&&(S.displacementMap.value=v.displacementMap,t(v.displacementMap,S.displacementMapTransform),S.displacementScale.value=v.displacementScale,S.displacementBias.value=v.displacementBias),v.emissiveMap&&(S.emissiveMap.value=v.emissiveMap,t(v.emissiveMap,S.emissiveMapTransform)),v.specularMap&&(S.specularMap.value=v.specularMap,t(v.specularMap,S.specularMapTransform)),v.alphaTest>0&&(S.alphaTest.value=v.alphaTest);const R=e.get(v),I=R.envMap,T=R.envMapRotation;I&&(S.envMap.value=I,S.envMapRotation.value.setFromMatrix4(dA.makeRotationFromEuler(T)).transpose(),I.isCubeTexture&&I.isRenderTargetTexture===!1&&S.envMapRotation.value.premultiply(cx),S.reflectivity.value=v.reflectivity,S.ior.value=v.ior,S.refractionRatio.value=v.refractionRatio),v.lightMap&&(S.lightMap.value=v.lightMap,S.lightMapIntensity.value=v.lightMapIntensity,t(v.lightMap,S.lightMapTransform)),v.aoMap&&(S.aoMap.value=v.aoMap,S.aoMapIntensity.value=v.aoMapIntensity,t(v.aoMap,S.aoMapTransform))}function c(S,v){S.diffuse.value.copy(v.color),S.opacity.value=v.opacity,v.map&&(S.map.value=v.map,t(v.map,S.mapTransform))}function d(S,v){S.dashSize.value=v.dashSize,S.totalSize.value=v.dashSize+v.gapSize,S.scale.value=v.scale}function h(S,v,R,I){S.diffuse.value.copy(v.color),S.opacity.value=v.opacity,S.size.value=v.size*R,S.scale.value=I*.5,v.map&&(S.map.value=v.map,t(v.map,S.uvTransform)),v.alphaMap&&(S.alphaMap.value=v.alphaMap,t(v.alphaMap,S.alphaMapTransform)),v.alphaTest>0&&(S.alphaTest.value=v.alphaTest)}function f(S,v){S.diffuse.value.copy(v.color),S.opacity.value=v.opacity,S.rotation.value=v.rotation,v.map&&(S.map.value=v.map,t(v.map,S.mapTransform)),v.alphaMap&&(S.alphaMap.value=v.alphaMap,t(v.alphaMap,S.alphaMapTransform)),v.alphaTest>0&&(S.alphaTest.value=v.alphaTest)}function _(S,v){S.specular.value.copy(v.specular),S.shininess.value=Math.max(v.shininess,1e-4)}function m(S,v){v.gradientMap&&(S.gradientMap.value=v.gradientMap)}function g(S,v){S.metalness.value=v.metalness,v.metalnessMap&&(S.metalnessMap.value=v.metalnessMap,t(v.metalnessMap,S.metalnessMapTransform)),S.roughness.value=v.roughness,v.roughnessMap&&(S.roughnessMap.value=v.roughnessMap,t(v.roughnessMap,S.roughnessMapTransform)),v.envMap&&(S.envMapIntensity.value=v.envMapIntensity)}function y(S,v,R){S.ior.value=v.ior,v.sheen>0&&(S.sheenColor.value.copy(v.sheenColor).multiplyScalar(v.sheen),S.sheenRoughness.value=v.sheenRoughness,v.sheenColorMap&&(S.sheenColorMap.value=v.sheenColorMap,t(v.sheenColorMap,S.sheenColorMapTransform)),v.sheenRoughnessMap&&(S.sheenRoughnessMap.value=v.sheenRoughnessMap,t(v.sheenRoughnessMap,S.sheenRoughnessMapTransform))),v.clearcoat>0&&(S.clearcoat.value=v.clearcoat,S.clearcoatRoughness.value=v.clearcoatRoughness,v.clearcoatMap&&(S.clearcoatMap.value=v.clearcoatMap,t(v.clearcoatMap,S.clearcoatMapTransform)),v.clearcoatRoughnessMap&&(S.clearcoatRoughnessMap.value=v.clearcoatRoughnessMap,t(v.clearcoatRoughnessMap,S.clearcoatRoughnessMapTransform)),v.clearcoatNormalMap&&(S.clearcoatNormalMap.value=v.clearcoatNormalMap,t(v.clearcoatNormalMap,S.clearcoatNormalMapTransform),S.clearcoatNormalScale.value.copy(v.clearcoatNormalScale),v.side===ni&&S.clearcoatNormalScale.value.negate())),v.dispersion>0&&(S.dispersion.value=v.dispersion),v.retroreflectivity>0&&(S.retroreflectivity.value=v.retroreflectivity),v.iridescence>0&&(S.iridescence.value=v.iridescence,S.iridescenceIOR.value=v.iridescenceIOR,S.iridescenceThicknessMinimum.value=v.iridescenceThicknessRange[0],S.iridescenceThicknessMaximum.value=v.iridescenceThicknessRange[1],v.iridescenceMap&&(S.iridescenceMap.value=v.iridescenceMap,t(v.iridescenceMap,S.iridescenceMapTransform)),v.iridescenceThicknessMap&&(S.iridescenceThicknessMap.value=v.iridescenceThicknessMap,t(v.iridescenceThicknessMap,S.iridescenceThicknessMapTransform))),v.transmission>0&&(S.transmission.value=v.transmission,S.transmissionSamplerMap.value=R.texture,S.transmissionSamplerSize.value.set(R.width,R.height),v.transmissionMap&&(S.transmissionMap.value=v.transmissionMap,t(v.transmissionMap,S.transmissionMapTransform)),S.thickness.value=v.thickness,v.thicknessMap&&(S.thicknessMap.value=v.thicknessMap,t(v.thicknessMap,S.thicknessMapTransform)),S.attenuationDistance.value=v.attenuationDistance,S.attenuationColor.value.copy(v.attenuationColor)),v.anisotropy>0&&(S.anisotropyVector.value.set(v.anisotropy*Math.cos(v.anisotropyRotation),v.anisotropy*Math.sin(v.anisotropyRotation)),v.anisotropyMap&&(S.anisotropyMap.value=v.anisotropyMap,t(v.anisotropyMap,S.anisotropyMapTransform))),S.specularIntensity.value=v.specularIntensity,S.specularColor.value.copy(v.specularColor),v.specularColorMap&&(S.specularColorMap.value=v.specularColorMap,t(v.specularColorMap,S.specularColorMapTransform)),v.specularIntensityMap&&(S.specularIntensityMap.value=v.specularIntensityMap,t(v.specularIntensityMap,S.specularIntensityMapTransform))}function M(S,v){v.matcap&&(S.matcap.value=v.matcap)}function b(S,v){const R=e.get(v).light;S.referencePosition.value.setFromMatrixPosition(R.matrixWorld),S.nearDistance.value=R.shadow.camera.near,S.farDistance.value=R.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:a}}function fA(s,e,t,i){let a={},l={},c=[];const d=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function h(T,N){const L=N.program;i.uniformBlockBinding(T,L)}function f(T,N){let L=a[T.id];L===void 0&&(S(T),L=_(T),a[T.id]=L,T.addEventListener("dispose",R));const U=N.program;i.updateUBOMapping(T,U);const w=e.render.frame;l[T.id]!==w&&(g(T),l[T.id]=w)}function _(T){const N=m();T.__bindingPointIndex=N;const L=s.createBuffer(),U=T.__size,w=T.usage;return s.bindBuffer(s.UNIFORM_BUFFER,L),s.bufferData(s.UNIFORM_BUFFER,U,w),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,N,L),L}function m(){for(let T=0;T<d;T++)if(c.indexOf(T)===-1)return c.push(T),T;return Nt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function g(T){const N=a[T.id],L=T.uniforms,U=T.__cache;s.bindBuffer(s.UNIFORM_BUFFER,N);for(let w=0,D=L.length;w<D;w++){const B=L[w];if(Array.isArray(B))for(let z=0,j=B.length;z<j;z++)y(B[z],w,z,U);else y(B,w,0,U)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function y(T,N,L,U){if(b(T,N,L,U)===!0){const w=T.__offset,D=T.value;if(Array.isArray(D)){let B=0;for(let z=0;z<D.length;z++){const j=D[z],te=v(j);M(j,T.__data,B),typeof j!="number"&&typeof j!="boolean"&&!j.isMatrix3&&!ArrayBuffer.isView(j)&&(B+=te.storage/Float32Array.BYTES_PER_ELEMENT)}}else M(D,T.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,w,T.__data)}}function M(T,N,L){typeof T=="number"||typeof T=="boolean"?N[0]=T:T.isMatrix3?(N[0]=T.elements[0],N[1]=T.elements[1],N[2]=T.elements[2],N[3]=0,N[4]=T.elements[3],N[5]=T.elements[4],N[6]=T.elements[5],N[7]=0,N[8]=T.elements[6],N[9]=T.elements[7],N[10]=T.elements[8],N[11]=0):ArrayBuffer.isView(T)?N.set(new T.constructor(T.buffer,T.byteOffset,N.length)):T.toArray(N,L)}function b(T,N,L,U){const w=T.value,D=N+"_"+L;if(U[D]===void 0)return typeof w=="number"||typeof w=="boolean"?U[D]=w:ArrayBuffer.isView(w)?U[D]=w.slice():U[D]=w.clone(),!0;{const B=U[D];if(typeof w=="number"||typeof w=="boolean"){if(B!==w)return U[D]=w,!0}else{if(ArrayBuffer.isView(w))return!0;if(B.equals(w)===!1)return B.copy(w),!0}}return!1}function S(T){const N=T.uniforms;let L=0;const U=16;for(let D=0,B=N.length;D<B;D++){const z=Array.isArray(N[D])?N[D]:[N[D]];for(let j=0,te=z.length;j<te;j++){const V=z[j],Q=Array.isArray(V.value)?V.value:[V.value];for(let he=0,re=Q.length;he<re;he++){const J=Q[he],$=v(J),K=L%U,F=K%$.boundary,ae=K+F;L+=F,ae!==0&&U-ae<$.storage&&(L+=U-ae),V.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),V.__offset=L,L+=$.storage}}}const w=L%U;return w>0&&(L+=U-w),T.__size=L,T.__cache={},this}function v(T){const N={boundary:0,storage:0};return typeof T=="number"||typeof T=="boolean"?(N.boundary=4,N.storage=4):T.isVector2?(N.boundary=8,N.storage=8):T.isVector3||T.isColor?(N.boundary=16,N.storage=12):T.isVector4?(N.boundary=16,N.storage=16):T.isMatrix3?(N.boundary=48,N.storage=48):T.isMatrix4?(N.boundary=64,N.storage=64):T.isTexture?at("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(T)?(N.boundary=16,N.storage=T.byteLength):at("WebGLRenderer: Unsupported uniform value type.",T),N}function R(T){const N=T.target;N.removeEventListener("dispose",R);const L=c.indexOf(N.__bindingPointIndex);c.splice(L,1),s.deleteBuffer(a[N.id]),delete a[N.id],delete l[N.id]}function I(){for(const T in a)s.deleteBuffer(a[T]);c=[],a={},l={}}return{bind:h,update:f,dispose:I}}const pA=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let $i=null;function mA(){return $i===null&&($i=new K_(pA,16,16,Ys,or),$i.name="DFG_LUT",$i.minFilter=zn,$i.magFilter=zn,$i.wrapS=Cr,$i.wrapT=Cr,$i.generateMipmaps=!1,$i.needsUpdate=!0),$i}class gA{constructor(e={}){const{canvas:t=SM(),context:i=null,depth:a=!0,stencil:l=!1,alpha:c=!1,antialias:d=!1,premultipliedAlpha:h=!0,preserveDrawingBuffer:f=!1,powerPreference:_="default",failIfMajorPerformanceCaveat:m=!1,reversedDepthBuffer:g=!1,outputBufferType:y=di}=e;this.isWebGLRenderer=!0;let M;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");M=i.getContextAttributes().alpha}else M=c;const b=y,S=new Set([Wf,Gf,Vf]),v=new Set([di,ar,rl,sl,Bf,zf]),R=new Uint32Array(4),I=new Int32Array(4),T=new Y;let N=null,L=null;const U=[],w=[];let D=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=rr,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const B=this;let z=!1,j=null,te=null,V=null,Q=null;this._outputColorSpace=ci;let he=0,re=0,J=null,$=-1,K=null;const F=new en,ae=new en;let Se=null;const Ge=new ut(0);let He=0,We=t.width,le=t.height,de=1,we=null,et=null;const Oe=new en(0,0,We,le),ft=new en(0,0,We,le);let Xt=!1;const pt=new $f;let St=!1,It=!1;const mt=new zt,Ht=new Y,nn=new en,cn={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Dt=!1;function qt(){return J===null?de:1}let X=i;function fn(P,W){return t.getContext(P,W)}let At,O,E,Z,oe,fe,Ee,Ae,pe,_e,Pe,$e,Ne,Te,Ke,tt,rt,G,Ce,ge,Re,Fe,xe;try{const P={alpha:!0,depth:a,stencil:l,antialias:d,premultipliedAlpha:h,preserveDrawingBuffer:f,powerPreference:_,failIfMajorPerformanceCaveat:m};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ff}`),t.addEventListener("webglcontextlost",Ct,!1),t.addEventListener("webglcontextrestored",bt,!1),t.addEventListener("webglcontextcreationerror",An,!1),X===null){const W="webgl2";if(X=fn(W,P),X===null)throw fn(W)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Qe()}catch(P){throw t.removeEventListener("webglcontextlost",Ct,!1),t.removeEventListener("webglcontextrestored",bt,!1),t.removeEventListener("webglcontextcreationerror",An,!1),Nt("WebGLRenderer: "+P.message),P}function Qe(){At=new mb(X),At.init(),Re=new aA(X,At),O=new sb(X,At,e,Re),E=new rA(X,At),O.reversedDepthBuffer&&g&&E.buffers.depth.setReversed(!0),te=X.createFramebuffer(),V=X.createFramebuffer(),Q=X.createFramebuffer(),Z=new xb(X),oe=new WT,fe=new sA(X,At,E,oe,O,Re,Z),Ee=new pb(B),Ae=new yE(X),Fe=new ib(X,Ae),pe=new gb(X,Ae,Z,Fe),_e=new yb(X,pe,Ae,Fe,Z),G=new vb(X,O,fe),Ke=new ab(oe),Pe=new GT(B,Ee,At,O,Fe,Ke),$e=new hA(B,oe),Ne=new XT,Te=new QT(At),rt=new nb(B,Ee,E,_e,M,h),tt=new iA(B,_e,O),xe=new fA(X,Z,O,E),Ce=new rb(X,At,Z),ge=new _b(X,At,Z),Z.programs=Pe.programs,B.capabilities=O,B.extensions=At,B.properties=oe,B.renderLists=Ne,B.shadowMap=tt,B.state=E,B.info=Z}b!==di&&(D=new Mb(b,t.width,t.height,d,a,l));const qe=new uA(B,X);this.xr=qe,this.getContext=function(){return X},this.getContextAttributes=function(){return X.getContextAttributes()},this.forceContextLoss=function(){const P=At.get("WEBGL_lose_context");P&&P.loseContext()},this.forceContextRestore=function(){const P=At.get("WEBGL_lose_context");P&&P.restoreContext()},this.getPixelRatio=function(){return de},this.setPixelRatio=function(P){P!==void 0&&(de=P,this.setSize(We,le,!1))},this.getSize=function(P){return P.set(We,le)},this.setSize=function(P,W,ce=!0){if(qe.isPresenting){at("WebGLRenderer: Can't change size while VR device is presenting.");return}We=P,le=W,t.width=Math.floor(P*de),t.height=Math.floor(W*de),ce===!0&&(t.style.width=P+"px",t.style.height=W+"px"),D!==null&&D.setSize(t.width,t.height),this.setViewport(0,0,P,W)},this.getDrawingBufferSize=function(P){return P.set(We*de,le*de).floor()},this.setDrawingBufferSize=function(P,W,ce){We=P,le=W,de=ce,t.width=Math.floor(P*ce),t.height=Math.floor(W*ce),this.setViewport(0,0,P,W)},this.setEffects=function(P){if(b===di){Nt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(P){for(let W=0;W<P.length;W++)if(P[W].isOutputPass===!0){at("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}D.setEffects(P||[])},this.getCurrentViewport=function(P){return P.copy(F)},this.getViewport=function(P){return P.copy(Oe)},this.setViewport=function(P,W,ce,ne){P.isVector4?Oe.set(P.x,P.y,P.z,P.w):Oe.set(P,W,ce,ne),E.viewport(F.copy(Oe).multiplyScalar(de).round())},this.getScissor=function(P){return P.copy(ft)},this.setScissor=function(P,W,ce,ne){P.isVector4?ft.set(P.x,P.y,P.z,P.w):ft.set(P,W,ce,ne),E.scissor(ae.copy(ft).multiplyScalar(de).round())},this.getScissorTest=function(){return Xt},this.setScissorTest=function(P){E.setScissorTest(Xt=P)},this.setOpaqueSort=function(P){we=P},this.setTransparentSort=function(P){et=P},this.getClearColor=function(P){return P.copy(rt.getClearColor())},this.setClearColor=function(){rt.setClearColor(...arguments)},this.getClearAlpha=function(){return rt.getClearAlpha()},this.setClearAlpha=function(){rt.setClearAlpha(...arguments)},this.clear=function(P=!0,W=!0,ce=!0){let ne=0;if(P){let ee=!1;if(J!==null){const Ie=J.texture.format;ee=S.has(Ie)}if(ee){const Ie=J.texture.type,Le=v.has(Ie),De=rt.getClearColor(),je=rt.getClearAlpha(),Ze=De.r,ct=De.g,ht=De.b;Le?(R[0]=Ze,R[1]=ct,R[2]=ht,R[3]=je,X.clearBufferuiv(X.COLOR,0,R)):(I[0]=Ze,I[1]=ct,I[2]=ht,I[3]=je,X.clearBufferiv(X.COLOR,0,I))}else ne|=X.COLOR_BUFFER_BIT}W&&(ne|=X.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),ce&&(ne|=X.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),ne!==0&&X.clear(ne)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(P){P.setRenderer(this),j=P},this.dispose=function(){t.removeEventListener("webglcontextlost",Ct,!1),t.removeEventListener("webglcontextrestored",bt,!1),t.removeEventListener("webglcontextcreationerror",An,!1),rt.dispose(),Ne.dispose(),Te.dispose(),oe.dispose(),Ee.dispose(),_e.dispose(),Fe.dispose(),xe.dispose(),Pe.dispose(),qe.dispose(),qe.removeEventListener("sessionstart",hl),qe.removeEventListener("sessionend",fl),Hn.stop()};function Ct(P){P.preventDefault(),K0("WebGLRenderer: Context Lost."),z=!0}function bt(){K0("WebGLRenderer: Context Restored."),z=!1;const P=Z.autoReset,W=tt.enabled,ce=tt.autoUpdate,ne=tt.needsUpdate,ee=tt.type;Qe(),Z.autoReset=P,tt.enabled=W,tt.autoUpdate=ce,tt.needsUpdate=ne,tt.type=ee}function An(P){Nt("WebGLRenderer: A WebGL context could not be created. Reason: ",P.statusMessage)}function hi(P){const W=P.target;W.removeEventListener("dispose",hi),ps(W)}function ps(P){Zs(P),oe.remove(P)}function Zs(P){const W=oe.get(P).programs;W!==void 0&&(W.forEach(function(ce){Pe.releaseProgram(ce)}),P.isShaderMaterial&&Pe.releaseShaderCache(P))}this.renderBufferDirect=function(P,W,ce,ne,ee,Ie){W===null&&(W=cn);const Le=ee.isMesh&&ee.matrixWorld.determinantAffine()<0,De=Kt(P,W,ce,ne,ee);E.setMaterial(ne,Le);let je=ce.index,Ze=1;if(ne.wireframe===!0){if(je=pe.getWireframeAttribute(ce),je===void 0)return;Ze=2}const ct=ce.drawRange,ht=ce.attributes.position;let ze=ct.start*Ze,Mt=(ct.start+ct.count)*Ze;Ie!==null&&(ze=Math.max(ze,Ie.start*Ze),Mt=Math.min(Mt,(Ie.start+Ie.count)*Ze)),je!==null?(ze=Math.max(ze,0),Mt=Math.min(Mt,je.count)):ht!=null&&(ze=Math.max(ze,0),Mt=Math.min(Mt,ht.count));const rn=Mt-ze;if(rn<0||rn===1/0)return;Fe.setup(ee,ne,De,ce,je);let Vt,Lt=Ce;if(je!==null&&(Vt=Ae.get(je),Lt=ge,Lt.setIndex(Vt)),ee.isMesh)ne.wireframe===!0?(E.setLineWidth(ne.wireframeLinewidth*qt()),Lt.setMode(X.LINES)):Lt.setMode(X.TRIANGLES);else if(ee.isLine){let pn=ne.linewidth;pn===void 0&&(pn=1),E.setLineWidth(pn*qt()),ee.isLineSegments?Lt.setMode(X.LINES):ee.isLineLoop?Lt.setMode(X.LINE_LOOP):Lt.setMode(X.LINE_STRIP)}else ee.isPoints?Lt.setMode(X.POINTS):ee.isSprite&&Lt.setMode(X.TRIANGLES);if(ee.isBatchedMesh)if(At.get("WEBGL_multi_draw"))Lt.renderMultiDraw(ee._multiDrawStarts,ee._multiDrawCounts,ee._multiDrawCount);else{const pn=ee._multiDrawStarts,ke=ee._multiDrawCounts,on=ee._multiDrawCount,Et=je?Ae.get(je).bytesPerElement:1,Nn=oe.get(ne).currentProgram.getUniforms();for(let gt=0;gt<on;gt++)Nn.setValue(X,"_gl_DrawID",gt),Lt.render(pn[gt]/Et,ke[gt])}else if(ee.isInstancedMesh)Lt.renderInstances(ze,rn,ee.count);else if(ce.isInstancedBufferGeometry){const pn=ce._maxInstanceCount!==void 0?ce._maxInstanceCount:1/0,ke=Math.min(ce.instanceCount,pn);Lt.renderInstances(ze,rn,ke)}else Lt.render(ze,rn)};function ms(P,W,ce,ne){j!==null&&P.isNodeMaterial&&j.setObject(ne,P),St===!0&&Ke.setState(P,ce,!1),P.transparent===!0&&P.side===tr&&P.forceSinglePass===!1?(P.side=ni,P.needsUpdate=!0,xs(P,W,ne),P.side=Xs,P.needsUpdate=!0,xs(P,W,ne),P.side=tr):xs(P,W,ne)}this.compile=function(P,W,ce=null){ce===null&&(ce=P),j!==null&&j.renderStart(P,W,ce),L=Te.get(ce),L.init(W),w.push(L),ce.traverseVisible(function(ee){ee.isLight&&ee.layers.test(W.layers)&&(L.pushLight(ee),ee.castShadow&&L.pushShadow(ee))}),P!==ce&&P.traverseVisible(function(ee){ee.isLight&&ee.layers.test(W.layers)&&(L.pushLight(ee),ee.castShadow&&L.pushShadow(ee))}),L.setupLights(),j!==null&&j.updateLights(L.state.lightsArray),It=this.localClippingEnabled,St=Ke.init(this.clippingPlanes,It),St===!0&&Ke.setGlobalState(this.clippingPlanes,W),j!==null&&tt.render(L.state.shadowsArray,ce,W);const ne=new Set;return P.traverse(function(ee){if(!(ee.isMesh||ee.isPoints||ee.isLine||ee.isSprite))return;const Ie=ee.material;if(Ie)if(Array.isArray(Ie))for(let Le=0;Le<Ie.length;Le++){const De=Ie[Le];ms(De,ce,W,ee),ne.add(De)}else ms(Ie,ce,W,ee),ne.add(Ie)}),L=w.pop(),j!==null&&j.renderEnd(),ne},this.compileAsync=function(P,W,ce=null){const ne=this.compile(P,W,ce);return new Promise(ee=>{function Ie(){if(ne.forEach(function(Le){const je=oe.get(Le).currentProgram;(je===void 0||je.isReady())&&ne.delete(Le)}),ne.size===0){ee(P);return}setTimeout(Ie,10)}At.get("KHR_parallel_shader_compile")!==null?Ie():setTimeout(Ie,10)})};let gs=null;function xu(P){gs&&gs(P)}function hl(){Hn.stop()}function fl(){Hn.start()}const Hn=new nx;Hn.setAnimationLoop(xu),typeof self<"u"&&Hn.setContext(self),this.setAnimationLoop=function(P){gs=P,qe.setAnimationLoop(P),P===null?Hn.stop():Hn.start()},qe.addEventListener("sessionstart",hl),qe.addEventListener("sessionend",fl),this.render=function(P,W){if(W!==void 0&&W.isCamera!==!0){Nt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(z===!0)return;j!==null&&j.renderStart(P,W);const ce=qe.enabled===!0&&qe.isPresenting===!0,ne=D!==null&&(J===null||ce)&&D.begin(B,J);if(P.matrixWorldAutoUpdate===!0&&P.updateMatrixWorld(),W.parent===null&&W.matrixWorldAutoUpdate===!0&&W.updateMatrixWorld(),qe.enabled===!0&&qe.isPresenting===!0&&(D===null||D.isCompositing()===!1)&&(qe.cameraAutoUpdate===!0&&qe.updateCamera(W),W=qe.getCamera()),P.isScene===!0&&P.onBeforeRender(B,P,W,J),L=Te.get(P,w.length),L.init(W),L.state.textureUnits=fe.getTextureUnits(),w.push(L),mt.multiplyMatrices(W.projectionMatrix,W.matrixWorldInverse),pt.setFromProjectionMatrix(mt,nr,W.reversedDepth),It=this.localClippingEnabled,St=Ke.init(this.clippingPlanes,It),N=Ne.get(P,U.length),N.init(),U.push(N),qe.enabled===!0&&qe.isPresenting===!0){const Le=B.xr.getDepthSensingMesh();Le!==null&&Qs(Le,W,-1/0,B.sortObjects)}Qs(P,W,0,B.sortObjects),N.finish(),j!==null&&j.updateLights(L.state.lightsArray),B.sortObjects===!0&&N.sort(we,et),Dt=qe.enabled===!1||qe.isPresenting===!1||qe.hasDepthSensing()===!1,Dt&&rt.addToRenderList(N,P),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),St===!0&&Ke.beginShadows();const ee=L.state.shadowsArray;if(tt.render(ee,P,W),St===!0&&Ke.endShadows(),(ne&&D.hasRenderPass())===!1){const Le=N.opaque,De=N.transmissive;if(L.setupLights(),W.isArrayCamera){const je=W.cameras;if(De.length>0)for(let Ze=0,ct=je.length;Ze<ct;Ze++){const ht=je[Ze];pl(Le,De,P,ht)}Dt&&rt.render(P);for(let Ze=0,ct=je.length;Ze<ct;Ze++){const ht=je[Ze];to(N,P,ht,ht.viewport)}}else De.length>0&&pl(Le,De,P,W),Dt&&rt.render(P),to(N,P,W)}J!==null&&re===0&&(fe.updateMultisampleRenderTarget(J),fe.updateRenderTargetMipmap(J)),ne&&D.end(B),P.isScene===!0&&P.onAfterRender(B,P,W),Fe.resetDefaultState(),$=-1,K=null,w.pop(),w.length>0?(L=w[w.length-1],fe.setTextureUnits(L.state.textureUnits),St===!0&&Ke.setGlobalState(B.clippingPlanes,L.state.camera)):L=null,U.pop(),U.length>0?N=U[U.length-1]:N=null,j!==null&&j.renderEnd()};function Qs(P,W,ce,ne){if(P.visible===!1)return;if(P.layers.test(W.layers)){if(P.isGroup)ce=P.renderOrder;else if(P.isLOD)P.autoUpdate===!0&&P.update(W);else if(P.isLightProbeGrid)L.pushLightProbeGrid(P);else if(P.isLight)L.pushLight(P),P.castShadow&&L.pushShadow(P);else if(P.isSprite){if(!P.frustumCulled||P.intersectsFrustum(pt)){ne&&nn.setFromMatrixPosition(P.matrixWorld).applyMatrix4(mt);const Le=_e.update(P),De=P.material;De.visible&&N.push(P,Le,De,ce,nn.z,null,W)}}else if((P.isMesh||P.isLine||P.isPoints)&&(!P.frustumCulled||P.intersectsFrustum(pt))){const Le=_e.update(P),De=P.material;if(ne&&(P.boundingSphere!==void 0?(P.boundingSphere===null&&P.computeBoundingSphere(),nn.copy(P.boundingSphere.center)):(Le.boundingSphere===null&&Le.computeBoundingSphere(),nn.copy(Le.boundingSphere.center)),nn.applyMatrix4(P.matrixWorld).applyMatrix4(mt)),Array.isArray(De)){const je=Le.groups;for(let Ze=0,ct=je.length;Ze<ct;Ze++){const ht=je[Ze],ze=De[ht.materialIndex];ze&&ze.visible&&N.push(P,Le,ze,ce,nn.z,ht,W)}}else De.visible&&N.push(P,Le,De,ce,nn.z,null,W)}}const Ie=P.children;for(let Le=0,De=Ie.length;Le<De;Le++)Qs(Ie[Le],W,ce,ne)}function to(P,W,ce,ne){const{opaque:ee,transmissive:Ie,transparent:Le}=P;L.setupLightsView(ce),St===!0&&Ke.setGlobalState(B.clippingPlanes,ce),ne&&E.viewport(F.copy(ne)),ee.length>0&&_s(ee,W,ce),Ie.length>0&&_s(Ie,W,ce),Le.length>0&&_s(Le,W,ce),E.buffers.depth.setTest(!0),E.buffers.depth.setMask(!0),E.buffers.color.setMask(!0),E.setPolygonOffset(!1)}function pl(P,W,ce,ne){if((ce.isScene===!0?ce.overrideMaterial:null)!==null)return;if(L.state.transmissionRenderTarget[ne.id]===void 0){const ze=At.has("EXT_color_buffer_half_float")||At.has("EXT_color_buffer_float");L.state.transmissionRenderTarget[ne.id]=new Gi(1,1,{generateMipmaps:!0,type:ze?or:di,minFilter:Os,samples:Math.max(4,O.samples),stencilBuffer:l,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:wt.workingColorSpace})}const Ie=L.state.transmissionRenderTarget[ne.id],Le=ne.viewport||F;Ie.setSize(Le.z*B.transmissionResolutionScale,Le.w*B.transmissionResolutionScale);const De=B.getRenderTarget(),je=B.getActiveCubeFace(),Ze=B.getActiveMipmapLevel();B.setRenderTarget(Ie),B.getClearColor(Ge),He=B.getClearAlpha(),He<1&&B.setClearColor(16777215,.5),B.clear(),Dt&&rt.render(ce);const ct=B.toneMapping;B.toneMapping=rr;const ht=ne.viewport;if(ne.viewport!==void 0&&(ne.viewport=void 0),L.setupLightsView(ne),St===!0&&Ke.setGlobalState(B.clippingPlanes,ne),_s(P,ce,ne),fe.updateMultisampleRenderTarget(Ie),fe.updateRenderTargetMipmap(Ie),At.has("WEBGL_multisampled_render_to_texture")===!1){let ze=!1;for(let Mt=0,rn=W.length;Mt<rn;Mt++){const Vt=W[Mt],{object:Lt,geometry:pn,material:ke,group:on}=Vt;if(ke.side===tr&&Lt.layers.test(ne.layers)){const Et=ke.side;ke.side=ni,ke.needsUpdate=!0,no(Lt,ce,ne,pn,ke,on),ke.side=Et,ke.needsUpdate=!0,ze=!0}}ze===!0&&(fe.updateMultisampleRenderTarget(Ie),fe.updateRenderTargetMipmap(Ie))}B.setRenderTarget(De,je,Ze),B.setClearColor(Ge,He),ht!==void 0&&(ne.viewport=ht),B.toneMapping=ct}function _s(P,W,ce){const ne=W.isScene===!0?W.overrideMaterial:null;for(let ee=0,Ie=P.length;ee<Ie;ee++){const Le=P[ee],{object:De,geometry:je,group:Ze}=Le;let ct=Le.material;ct.allowOverride===!0&&ne!==null&&(ct=ne),De.layers.test(ce.layers)&&no(De,W,ce,je,ct,Ze)}}function no(P,W,ce,ne,ee,Ie){j!==null&&ee.isNodeMaterial&&j.setObject(P,ee),P.onBeforeRender(B,W,ce,ne,ee,Ie),P.modelViewMatrix.multiplyMatrices(ce.matrixWorldInverse,P.matrixWorld),P.normalMatrix.getNormalMatrix(P.modelViewMatrix),ee.onBeforeRender(B,W,ce,ne,P,Ie),ee.transparent===!0&&ee.side===tr&&ee.forceSinglePass===!1?(ee.side=ni,ee.needsUpdate=!0,B.renderBufferDirect(ce,W,ne,ee,P,Ie),ee.side=Xs,ee.needsUpdate=!0,B.renderBufferDirect(ce,W,ne,ee,P,Ie),ee.side=tr):B.renderBufferDirect(ce,W,ne,ee,P,Ie),P.onAfterRender(B,W,ce,ne,ee,Ie)}function xs(P,W,ce){W.isScene!==!0&&(W=cn);const ne=oe.get(P),ee=L.state.lights,Ie=L.state.shadowsArray,Le=ee.state.version,De=Pe.getParameters(P,ee.state,Ie,W,ce,L.state.lightProbeGridArray),je=Pe.getProgramCacheKey(De);let Ze=ne.programs;ne.environment=P.isMeshStandardMaterial||P.isMeshLambertMaterial||P.isMeshPhongMaterial?W.environment:null,ne.fog=W.fog;const ct=P.isMeshStandardMaterial||P.isMeshLambertMaterial&&!P.envMap||P.isMeshPhongMaterial&&!P.envMap;ne.envMap=Ee.get(P.envMap||ne.environment,ct),ne.envMapRotation=ne.environment!==null&&P.envMap===null?W.environmentRotation:P.envMapRotation,Ze===void 0&&(P.addEventListener("dispose",hi),Ze=new Map,ne.programs=Ze);let ht=Ze.get(je);if(ht!==void 0){if(ne.currentProgram===ht&&ne.lightsStateVersion===Le)return ml(P,De),ht}else De.uniforms=Pe.getUniforms(P),j!==null&&P.isNodeMaterial&&j.build(P,ce,De),P.onBeforeCompile(De,B),ht=Pe.acquireProgram(De,je),Ze.set(je,ht),ne.uniforms=De.uniforms;const ze=ne.uniforms;return(!P.isShaderMaterial&&!P.isRawShaderMaterial||P.clipping===!0)&&(ze.clippingPlanes=Ke.uniform),ml(P,De),ne.needsLights=ro(P),ne.lightsStateVersion=Le,ne.needsLights&&(ze.ambientLightColor.value=ee.state.ambient,ze.lightProbe.value=ee.state.probe,ze.sunLights.value=ee.state.sun,ze.sunLightShadows.value=ee.state.sunShadow,ze.directionalLights.value=ee.state.directional,ze.directionalLightShadows.value=ee.state.directionalShadow,ze.spotLights.value=ee.state.spot,ze.spotLightShadows.value=ee.state.spotShadow,ze.rectAreaLights.value=ee.state.rectArea,ze.ltc_1.value=ee.state.rectAreaLTC1,ze.ltc_2.value=ee.state.rectAreaLTC2,ze.pointLights.value=ee.state.point,ze.pointLightShadows.value=ee.state.pointShadow,ze.hemisphereLights.value=ee.state.hemi,ze.sunShadowMatrix.value=ee.state.sunShadowMatrix,ze.sunShadowCascade.value=ee.state.sunShadowCascade,ze.directionalShadowMatrix.value=ee.state.directionalShadowMatrix,ze.spotLightMatrix.value=ee.state.spotLightMatrix,ze.spotLightMap.value=ee.state.spotLightMap,ze.pointShadowMatrix.value=ee.state.pointShadowMatrix),ne.lightProbeGrid=L.state.lightProbeGridArray.length>0,ne.currentProgram=ht,ne.uniformsList=null,ht}function io(P){if(P.uniformsList===null){const W=P.currentProgram.getUniforms();P.uniformsList=Jc.seqWithValue(W.seq,P.uniforms)}return P.uniformsList}function ml(P,W){const ce=oe.get(P);ce.outputColorSpace=W.outputColorSpace,ce.batching=W.batching,ce.batchingColor=W.batchingColor,ce.instancing=W.instancing,ce.instancingColor=W.instancingColor,ce.instancingMorph=W.instancingMorph,ce.skinning=W.skinning,ce.morphTargets=W.morphTargets,ce.morphNormals=W.morphNormals,ce.morphColors=W.morphColors,ce.morphTargetsCount=W.morphTargetsCount,ce.numClippingPlanes=W.numClippingPlanes,ce.numIntersection=W.numClipIntersection,ce.vertexAlphas=W.vertexAlphas,ce.vertexTangents=W.vertexTangents,ce.toneMapping=W.toneMapping}function vu(P,W){if(P.length===0)return null;if(P.length===1)return P[0].texture!==null?P[0]:null;T.setFromMatrixPosition(W.matrixWorld);for(let ce=0,ne=P.length;ce<ne;ce++){const ee=P[ce];if(ee.texture!==null&&ee.boundingBox.containsPoint(T))return ee}return null}function Kt(P,W,ce,ne,ee){W.isScene!==!0&&(W=cn),fe.resetTextureUnits();const Ie=W.fog,Le=ne.isMeshStandardMaterial||ne.isMeshLambertMaterial||ne.isMeshPhongMaterial?W.environment:null,De=J===null?B.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:wt.workingColorSpace,je=ne.isMeshStandardMaterial||ne.isMeshLambertMaterial&&!ne.envMap||ne.isMeshPhongMaterial&&!ne.envMap,Ze=Ee.get(ne.envMap||Le,je),ct=ne.vertexColors===!0&&!!ce.attributes.color&&ce.attributes.color.itemSize===4,ht=!!ce.attributes.tangent&&(!!ne.normalMap||ne.anisotropy>0),ze=!!ce.morphAttributes.position,Mt=!!ce.morphAttributes.normal,rn=!!ce.morphAttributes.color;let Vt=rr;ne.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(Vt=B.toneMapping);const Lt=ce.morphAttributes.position||ce.morphAttributes.normal||ce.morphAttributes.color,pn=Lt!==void 0?Lt.length:0,ke=oe.get(ne),on=L.state.lights;if(St===!0&&(It===!0||P!==K)){const Ut=P===K&&ne.id===$;Ke.setState(ne,P,Ut)}let Et=!1;ne.version===ke.__version?(ke.needsLights&&ke.lightsStateVersion!==on.state.version||ke.outputColorSpace!==De||ee.isBatchedMesh&&ke.batching===!1||!ee.isBatchedMesh&&ke.batching===!0||ee.isBatchedMesh&&ke.batchingColor===!0&&ee._colorsTexture===null||ee.isBatchedMesh&&ke.batchingColor===!1&&ee._colorsTexture!==null||ee.isInstancedMesh&&ke.instancing===!1||!ee.isInstancedMesh&&ke.instancing===!0||ee.isSkinnedMesh&&ke.skinning===!1||!ee.isSkinnedMesh&&ke.skinning===!0||ee.isInstancedMesh&&ke.instancingColor===!0&&ee.instanceColor===null||ee.isInstancedMesh&&ke.instancingColor===!1&&ee.instanceColor!==null||ee.isInstancedMesh&&ke.instancingMorph===!0&&ee.morphTexture===null||ee.isInstancedMesh&&ke.instancingMorph===!1&&ee.morphTexture!==null||ke.envMap!==Ze||ne.fog===!0&&ke.fog!==Ie||ke.numClippingPlanes!==void 0&&(ke.numClippingPlanes!==Ke.numPlanes||ke.numIntersection!==Ke.numIntersection)||ke.vertexAlphas!==ct||ke.vertexTangents!==ht||ke.morphTargets!==ze||ke.morphNormals!==Mt||ke.morphColors!==rn||ke.toneMapping!==Vt||ke.morphTargetsCount!==pn||!!ke.lightProbeGrid!=L.state.lightProbeGridArray.length>0)&&(Et=!0):(Et=!0,ke.__version=ne.version);let Nn=ke.currentProgram;Et===!0&&(Nn=xs(ne,W,ee),j&&ne.isNodeMaterial&&j.onUpdateProgram(ne,Nn,ke));let gt=!1,wi=!1,ur=!1;const Rt=Nn.getUniforms(),Yt=ke.uniforms;if(E.useProgram(Nn.program)&&(gt=!0,wi=!0,ur=!0),ne.id!==$&&($=ne.id,wi=!0),ke.needsLights){const Ut=vu(L.state.lightProbeGridArray,ee);ke.lightProbeGrid!==Ut&&(ke.lightProbeGrid=Ut,wi=!0)}if(gt||K!==P){E.buffers.depth.getReversed()&&P.reversedDepth!==!0&&(P._reversedDepth=!0,P.updateProjectionMatrix()),Rt.setValue(X,"projectionMatrix",P.projectionMatrix),Rt.setValue(X,"viewMatrix",P.matrixWorldInverse);const fi=Rt.map.cameraPosition;fi!==void 0&&fi.setValue(X,Ht.setFromMatrixPosition(P.matrixWorld)),O.logarithmicDepthBuffer&&Rt.setValue(X,"logDepthBufFC",2/(Math.log(P.far+1)/Math.LN2)),(ne.isMeshPhongMaterial||ne.isMeshToonMaterial||ne.isMeshLambertMaterial||ne.isMeshBasicMaterial||ne.isMeshStandardMaterial||ne.isShaderMaterial)&&Rt.setValue(X,"isOrthographic",P.isOrthographicCamera===!0),K!==P&&(K=P,wi=!0,ur=!0)}if(ke.needsLights&&(on.state.sunShadowMap.length>0&&Rt.setValue(X,"sunShadowMap",on.state.sunShadowMap,fe),on.state.directionalShadowMap.length>0&&Rt.setValue(X,"directionalShadowMap",on.state.directionalShadowMap,fe),on.state.spotShadowMap.length>0&&Rt.setValue(X,"spotShadowMap",on.state.spotShadowMap,fe),on.state.pointShadowMap.length>0&&Rt.setValue(X,"pointShadowMap",on.state.pointShadowMap,fe)),ee.isSkinnedMesh){Rt.setOptional(X,ee,"bindMatrix"),Rt.setOptional(X,ee,"bindMatrixInverse");const Ut=ee.skeleton;Ut&&(Ut.boneTexture===null&&Ut.computeBoneTexture(),Rt.setValue(X,"boneTexture",Ut.boneTexture,fe))}ee.isBatchedMesh&&(Rt.setOptional(X,ee,"batchingTexture"),Rt.setValue(X,"batchingTexture",ee._matricesTexture,fe),Rt.setOptional(X,ee,"batchingIdTexture"),Rt.setValue(X,"batchingIdTexture",ee._indirectTexture,fe),Rt.setOptional(X,ee,"batchingColorTexture"),ee._colorsTexture!==null&&Rt.setValue(X,"batchingColorTexture",ee._colorsTexture,fe));const bi=ce.morphAttributes;if((bi.position!==void 0||bi.normal!==void 0||bi.color!==void 0)&&G.update(ee,ce,Nn),(wi||ke.receiveShadow!==ee.receiveShadow)&&(ke.receiveShadow=ee.receiveShadow,Rt.setValue(X,"receiveShadow",ee.receiveShadow)),(ne.isMeshStandardMaterial||ne.isMeshLambertMaterial||ne.isMeshPhongMaterial)&&ne.envMap===null&&W.environment!==null&&(Yt.envMapIntensity.value=W.environmentIntensity),Yt.dfgLUT!==void 0&&(Yt.dfgLUT.value=mA()),wi){if(Rt.setValue(X,"toneMappingExposure",B.toneMappingExposure),ke.needsLights&&yu(Yt,ur),Ie&&ne.fog===!0&&$e.refreshFogUniforms(Yt,Ie),$e.refreshMaterialUniforms(Yt,ne,de,le,L.state.transmissionRenderTarget[P.id]),ke.needsLights&&ke.lightProbeGrid){const Ut=ke.lightProbeGrid;Yt.probesSH.value=Ut.texture,Yt.probesMin.value.copy(Ut.boundingBox.min),Yt.probesMax.value.copy(Ut.boundingBox.max),Yt.probesResolution.value.copy(Ut.resolution)}Jc.upload(X,io(ke),Yt,fe)}if(ne.isShaderMaterial&&ne.uniformsNeedUpdate===!0&&(Jc.upload(X,io(ke),Yt,fe),ne.uniformsNeedUpdate=!1),ne.isSpriteMaterial&&Rt.setValue(X,"center",ee.center),Rt.setValue(X,"modelViewMatrix",ee.modelViewMatrix),Rt.setValue(X,"normalMatrix",ee.normalMatrix),Rt.setValue(X,"modelMatrix",ee.matrixWorld),ne.uniformsGroups!==void 0){const Ut=ne.uniformsGroups;for(let fi=0,Ti=Ut.length;fi<Ti;fi++){const Ai=Ut[fi];xe.update(Ai,Nn),xe.bind(Ai,Nn)}}return Nn}function yu(P,W){P.ambientLightColor.needsUpdate=W,P.lightProbe.needsUpdate=W,P.sunLights.needsUpdate=W,P.sunLightShadows.needsUpdate=W,P.directionalLights.needsUpdate=W,P.directionalLightShadows.needsUpdate=W,P.pointLights.needsUpdate=W,P.pointLightShadows.needsUpdate=W,P.spotLights.needsUpdate=W,P.spotLightShadows.needsUpdate=W,P.rectAreaLights.needsUpdate=W,P.hemisphereLights.needsUpdate=W}function ro(P){return P.isMeshLambertMaterial||P.isMeshToonMaterial||P.isMeshPhongMaterial||P.isMeshStandardMaterial||P.isShadowMaterial||P.isShaderMaterial&&P.lights===!0}this.getActiveCubeFace=function(){return he},this.getActiveMipmapLevel=function(){return re},this.getRenderTarget=function(){return J},this.setRenderTargetTextures=function(P,W,ce){const ne=oe.get(P);ne.__autoAllocateDepthBuffer=P.resolveDepthBuffer===!1,ne.__autoAllocateDepthBuffer===!1&&(ne.__useRenderToTexture=!1),oe.get(P.texture).__webglTexture=W,oe.get(P.depthTexture).__webglTexture=ne.__autoAllocateDepthBuffer?void 0:ce,ne.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(P,W){const ce=oe.get(P);ce.__webglFramebuffer=W,ce.__useDefaultFramebuffer=W===void 0},this.setRenderTarget=function(P,W=0,ce=0){J=P,he=W,re=ce;let ne=null,ee=!1,Ie=!1;if(P){const De=oe.get(P);if(De.__useDefaultFramebuffer!==void 0){E.bindFramebuffer(X.FRAMEBUFFER,De.__webglFramebuffer),F.copy(P.viewport),ae.copy(P.scissor),Se=P.scissorTest,E.viewport(F),E.scissor(ae),E.setScissorTest(Se),$=-1;return}else if(De.__webglFramebuffer===void 0)fe.setupRenderTarget(P);else if(De.__hasExternalTextures)fe.rebindTextures(P,oe.get(P.texture).__webglTexture,oe.get(P.depthTexture).__webglTexture);else if(P.depthBuffer){const ct=P.depthTexture;if(De.__boundDepthTexture!==ct){if(ct!==null&&oe.has(ct)&&(P.width!==ct.image.width||P.height!==ct.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");fe.setupDepthRenderbuffer(P)}}const je=P.texture;(je.isData3DTexture||je.isDataArrayTexture||je.isCompressedArrayTexture)&&(Ie=!0);const Ze=oe.get(P).__webglFramebuffer;P.isWebGLCubeRenderTarget?(Array.isArray(Ze[W])?ne=Ze[W][ce]:ne=Ze[W],ee=!0):P.samples>0&&fe.useMultisampledRTT(P)===!1?ne=oe.get(P).__webglMultisampledFramebuffer:Array.isArray(Ze)?ne=Ze[ce]:ne=Ze,F.copy(P.viewport),ae.copy(P.scissor),Se=P.scissorTest}else F.copy(Oe).multiplyScalar(de).floor(),ae.copy(ft).multiplyScalar(de).floor(),Se=Xt;if(ce!==0&&(ne=te),E.bindFramebuffer(X.FRAMEBUFFER,ne)&&E.drawBuffers(P,ne),E.viewport(F),E.scissor(ae),E.setScissorTest(Se),ee){const De=oe.get(P.texture);X.framebufferTexture2D(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0,X.TEXTURE_CUBE_MAP_POSITIVE_X+W,De.__webglTexture,ce)}else if(Ie){const De=W;for(let je=0;je<P.textures.length;je++){const Ze=oe.get(P.textures[je]);X.framebufferTextureLayer(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0+je,Ze.__webglTexture,ce,De)}}else if(P!==null&&ce!==0){const De=oe.get(P.texture);X.framebufferTexture2D(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0,X.TEXTURE_2D,De.__webglTexture,ce)}$=-1};function so(P){const W=oe.get(P);return(W.__readFormat!==P.format||W.__readType!==P.type)&&(W.__readFormat=P.format,W.__readType=P.type,W.__formatReadable=O.textureFormatReadable(P.format),W.__typeReadable=O.textureTypeReadable(P.type)),W}this.readRenderTargetPixels=function(P,W,ce,ne,ee,Ie,Le,De=0){if(!(P&&P.isWebGLRenderTarget)){Nt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let je=oe.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&Le!==void 0&&(je=je[Le]),je){E.bindFramebuffer(X.FRAMEBUFFER,je);try{const Ze=P.textures[De],ct=Ze.format,ht=Ze.type;P.textures.length>1&&X.readBuffer(X.COLOR_ATTACHMENT0+De);const ze=so(Ze);if(ze.__formatReadable===!1){Nt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(ze.__typeReadable===!1){Nt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}W>=0&&W<=P.width-ne&&ce>=0&&ce<=P.height-ee&&X.readPixels(W,ce,ne,ee,Re.convert(ct),Re.convert(ht),Ie)}finally{const Ze=J!==null?oe.get(J).__webglFramebuffer:null;E.bindFramebuffer(X.FRAMEBUFFER,Ze)}}},this.readRenderTargetPixelsAsync=async function(P,W,ce,ne,ee,Ie,Le,De=0){if(!(P&&P.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let je=oe.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&Le!==void 0&&(je=je[Le]),je)if(W>=0&&W<=P.width-ne&&ce>=0&&ce<=P.height-ee){E.bindFramebuffer(X.FRAMEBUFFER,je);const Ze=P.textures[De],ct=Ze.format,ht=Ze.type;P.textures.length>1&&X.readBuffer(X.COLOR_ATTACHMENT0+De);const ze=so(Ze);if(ze.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(ze.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Mt=X.createBuffer();X.bindBuffer(X.PIXEL_PACK_BUFFER,Mt),X.bufferData(X.PIXEL_PACK_BUFFER,Ie.byteLength,X.STREAM_READ),X.readPixels(W,ce,ne,ee,Re.convert(ct),Re.convert(ht),0),X.bindBuffer(X.PIXEL_PACK_BUFFER,null);const rn=J!==null?oe.get(J).__webglFramebuffer:null;E.bindFramebuffer(X.FRAMEBUFFER,rn);const Vt=X.fenceSync(X.SYNC_GPU_COMMANDS_COMPLETE,0);return X.flush(),await MM(X,Vt,4),X.bindBuffer(X.PIXEL_PACK_BUFFER,Mt),X.getBufferSubData(X.PIXEL_PACK_BUFFER,0,Ie),X.bindBuffer(X.PIXEL_PACK_BUFFER,null),X.deleteBuffer(Mt),X.deleteSync(Vt),Ie}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(P,W=null,ce=0){const ne=Math.pow(2,-ce),ee=Math.floor(P.image.width*ne),Ie=Math.floor(P.image.height*ne),Le=W!==null?W.x:0,De=W!==null?W.y:0;fe.setTexture2D(P,0),X.copyTexSubImage2D(X.TEXTURE_2D,ce,0,0,Le,De,ee,Ie),E.unbindTexture()},this.copyTextureToTexture=function(P,W,ce=null,ne=null,ee=0,Ie=0){let Le,De,je,Ze,ct,ht,ze,Mt,rn;const Vt=P.isCompressedTexture?P.mipmaps[Ie]:P.image;if(ce!==null)Le=ce.max.x-ce.min.x,De=ce.max.y-ce.min.y,je=ce.isBox3?ce.max.z-ce.min.z:1,Ze=ce.min.x,ct=ce.min.y,ht=ce.isBox3?ce.min.z:0;else{const Yt=Math.pow(2,-ee);Le=Math.floor(Vt.width*Yt),De=Math.floor(Vt.height*Yt),P.isDataArrayTexture?je=Vt.depth:P.isData3DTexture?je=Math.floor(Vt.depth*Yt):je=1,Ze=0,ct=0,ht=0}ne!==null?(ze=ne.x,Mt=ne.y,rn=ne.z):(ze=0,Mt=0,rn=0);const Lt=Re.convert(W.format),pn=Re.convert(W.type);let ke;W.isData3DTexture?(fe.setTexture3D(W,0),ke=X.TEXTURE_3D):W.isDataArrayTexture||W.isCompressedArrayTexture?(fe.setTexture2DArray(W,0),ke=X.TEXTURE_2D_ARRAY):(fe.setTexture2D(W,0),ke=X.TEXTURE_2D),E.activeTexture(X.TEXTURE0),E.pixelStorei(X.UNPACK_FLIP_Y_WEBGL,W.flipY),E.pixelStorei(X.UNPACK_PREMULTIPLY_ALPHA_WEBGL,W.premultiplyAlpha),E.pixelStorei(X.UNPACK_ALIGNMENT,W.unpackAlignment);const on=E.getParameter(X.UNPACK_ROW_LENGTH),Et=E.getParameter(X.UNPACK_IMAGE_HEIGHT),Nn=E.getParameter(X.UNPACK_SKIP_PIXELS),gt=E.getParameter(X.UNPACK_SKIP_ROWS),wi=E.getParameter(X.UNPACK_SKIP_IMAGES);E.pixelStorei(X.UNPACK_ROW_LENGTH,Vt.width),E.pixelStorei(X.UNPACK_IMAGE_HEIGHT,Vt.height),E.pixelStorei(X.UNPACK_SKIP_PIXELS,Ze),E.pixelStorei(X.UNPACK_SKIP_ROWS,ct),E.pixelStorei(X.UNPACK_SKIP_IMAGES,ht);const ur=P.isDataArrayTexture||P.isData3DTexture,Rt=W.isDataArrayTexture||W.isData3DTexture;if(P.isDepthTexture){const Yt=oe.get(P),bi=oe.get(W),Ut=oe.get(Yt.__renderTarget),fi=oe.get(bi.__renderTarget);E.bindFramebuffer(X.READ_FRAMEBUFFER,Ut.__webglFramebuffer),E.bindFramebuffer(X.DRAW_FRAMEBUFFER,fi.__webglFramebuffer);for(let Ti=0;Ti<je;Ti++)ur&&(X.framebufferTextureLayer(X.READ_FRAMEBUFFER,X.COLOR_ATTACHMENT0,oe.get(P).__webglTexture,ee,ht+Ti),X.framebufferTextureLayer(X.DRAW_FRAMEBUFFER,X.COLOR_ATTACHMENT0,oe.get(W).__webglTexture,Ie,rn+Ti)),X.blitFramebuffer(Ze,ct,Le,De,ze,Mt,Le,De,X.DEPTH_BUFFER_BIT,X.NEAREST);E.bindFramebuffer(X.READ_FRAMEBUFFER,null),E.bindFramebuffer(X.DRAW_FRAMEBUFFER,null)}else if(ee!==0||P.isRenderTargetTexture||oe.has(P)){const Yt=oe.get(P),bi=oe.get(W);E.bindFramebuffer(X.READ_FRAMEBUFFER,V),E.bindFramebuffer(X.DRAW_FRAMEBUFFER,Q);for(let Ut=0;Ut<je;Ut++)ur?X.framebufferTextureLayer(X.READ_FRAMEBUFFER,X.COLOR_ATTACHMENT0,Yt.__webglTexture,ee,ht+Ut):X.framebufferTexture2D(X.READ_FRAMEBUFFER,X.COLOR_ATTACHMENT0,X.TEXTURE_2D,Yt.__webglTexture,ee),Rt?X.framebufferTextureLayer(X.DRAW_FRAMEBUFFER,X.COLOR_ATTACHMENT0,bi.__webglTexture,Ie,rn+Ut):X.framebufferTexture2D(X.DRAW_FRAMEBUFFER,X.COLOR_ATTACHMENT0,X.TEXTURE_2D,bi.__webglTexture,Ie),ee!==0?X.blitFramebuffer(Ze,ct,Le,De,ze,Mt,Le,De,X.COLOR_BUFFER_BIT,X.NEAREST):Rt?X.copyTexSubImage3D(ke,Ie,ze,Mt,rn+Ut,Ze,ct,Le,De):X.copyTexSubImage2D(ke,Ie,ze,Mt,Ze,ct,Le,De);E.bindFramebuffer(X.READ_FRAMEBUFFER,null),E.bindFramebuffer(X.DRAW_FRAMEBUFFER,null)}else Rt?P.isDataTexture||P.isData3DTexture?X.texSubImage3D(ke,Ie,ze,Mt,rn,Le,De,je,Lt,pn,Vt.data):W.isCompressedArrayTexture?X.compressedTexSubImage3D(ke,Ie,ze,Mt,rn,Le,De,je,Lt,Vt.data):X.texSubImage3D(ke,Ie,ze,Mt,rn,Le,De,je,Lt,pn,Vt):P.isDataTexture?X.texSubImage2D(X.TEXTURE_2D,Ie,ze,Mt,Le,De,Lt,pn,Vt.data):P.isCompressedTexture?X.compressedTexSubImage2D(X.TEXTURE_2D,Ie,ze,Mt,Vt.width,Vt.height,Lt,Vt.data):X.texSubImage2D(X.TEXTURE_2D,Ie,ze,Mt,Le,De,Lt,pn,Vt);E.pixelStorei(X.UNPACK_ROW_LENGTH,on),E.pixelStorei(X.UNPACK_IMAGE_HEIGHT,Et),E.pixelStorei(X.UNPACK_SKIP_PIXELS,Nn),E.pixelStorei(X.UNPACK_SKIP_ROWS,gt),E.pixelStorei(X.UNPACK_SKIP_IMAGES,wi),Ie===0&&W.generateMipmaps&&X.generateMipmap(ke),E.unbindTexture()},this.initRenderTarget=function(P){oe.get(P).__webglFramebuffer===void 0&&fe.setupRenderTarget(P)},this.initTexture=function(P){P.isCubeTexture?fe.setTextureCube(P,0):P.isData3DTexture?fe.setTexture3D(P,0):P.isDataArrayTexture||P.isCompressedArrayTexture?fe.setTexture2DArray(P,0):fe.setTexture2D(P,0),E.unbindTexture()},this.resetState=function(){he=0,re=0,J=null,E.reset(),Fe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return nr}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=wt._getDrawingBufferColorSpace(e),t.unpackColorSpace=wt._getUnpackColorSpace()}}const Jg={type:"change"},Qf={type:"start"},ux={type:"end"},jc=new pu,e_=new Tr,_A=Math.cos(70*bM.DEG2RAD),_n=new Y,ti=2*Math.PI,kt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Oh=1e-6;class xA extends xE{constructor(e,t=null){super(e,t),this.state=kt.NONE,this.target=new Y,this.cursor=new Y,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Ba.ROTATE,MIDDLE:Ba.DOLLY,RIGHT:Ba.PAN},this.touches={ONE:Oa.ROTATE,TWO:Oa.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new Y,this._lastQuaternion=new hs,this._lastTargetPosition=new Y,this._quat=new hs().setFromUnitVectors(e.up,new Y(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Cg,this._sphericalDelta=new Cg,this._scale=1,this._panOffset=new Y,this._rotateStart=new ot,this._rotateEnd=new ot,this._rotateDelta=new ot,this._panStart=new ot,this._panEnd=new ot,this._panDelta=new ot,this._dollyStart=new ot,this._dollyEnd=new ot,this._dollyDelta=new ot,this._dollyDirection=new Y,this._mouse=new ot,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=yA.bind(this),this._onPointerDown=vA.bind(this),this._onPointerUp=SA.bind(this),this._onContextMenu=CA.bind(this),this._onMouseWheel=wA.bind(this),this._onKeyDown=bA.bind(this),this._onTouchStart=TA.bind(this),this._onTouchMove=AA.bind(this),this._onMouseDown=MA.bind(this),this._onMouseMove=EA.bind(this),this._interceptControlDown=RA.bind(this),this._interceptControlUp=PA.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.state=kt.NONE,this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents();const e=this.domElement.getRootNode();e.removeEventListener("keydown",this._interceptControlDown,{capture:!0}),e.removeEventListener("keyup",this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction="",this.domElement.style.cursor="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Jg),this.update(),this.state=kt.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){const t=this.object.position;_n.copy(t).sub(this.target),_n.applyQuaternion(this._quat),this._spherical.setFromVector3(_n),this.autoRotate&&this.state===kt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,a=this.maxAzimuthAngle;isFinite(i)&&isFinite(a)&&(i<-Math.PI?i+=ti:i>Math.PI&&(i-=ti),a<-Math.PI?a+=ti:a>Math.PI&&(a-=ti),i<=a?this._spherical.theta=Math.max(i,Math.min(a,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+a)/2?Math.max(i,this._spherical.theta):Math.min(a,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let l=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const c=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),l=c!=this._spherical.radius}if(_n.setFromSpherical(this._spherical),_n.applyQuaternion(this._quatInverse),t.copy(this.target).add(_n),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let c=null;if(this.object.isPerspectiveCamera){const d=_n.length();c=this._clampDistance(d*this._scale);const h=d-c;this.object.position.addScaledVector(this._dollyDirection,h),this.object.updateMatrixWorld(),l=!!h}else if(this.object.isOrthographicCamera){const d=new Y(this._mouse.x,this._mouse.y,0);d.unproject(this.object);const h=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),l=h!==this.object.zoom;const f=new Y(this._mouse.x,this._mouse.y,0);f.unproject(this.object),this.object.position.sub(f).add(d),this.object.updateMatrixWorld(),c=_n.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;c!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(c).add(this.object.position):(jc.origin.copy(this.object.position),jc.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(jc.direction))<_A?this.object.lookAt(this.target):(e_.setFromNormalAndCoplanarPoint(this.object.up,this.target),jc.intersectPlane(e_,this.target))))}else if(this.object.isOrthographicCamera){const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),c!==this.object.zoom&&(this.object.updateProjectionMatrix(),l=!0)}return this._scale=1,this._performCursorZoom=!1,l||this._lastPosition.distanceToSquared(this.object.position)>Oh||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Oh||this._lastTargetPosition.distanceToSquared(this.target)>Oh?(this.dispatchEvent(Jg),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?ti/60*this.autoRotateSpeed*e:ti/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){_n.setFromMatrixColumn(t,0),_n.multiplyScalar(-e),this._panOffset.add(_n)}_panUp(e,t){this.screenSpacePanning===!0?_n.setFromMatrixColumn(t,1):(_n.setFromMatrixColumn(t,0),_n.crossVectors(this.object.up,_n)),_n.multiplyScalar(e),this._panOffset.add(_n)}_pan(e,t){const i=this.domElement;if(this.object.isPerspectiveCamera){const a=this.object.position;_n.copy(a).sub(this.target);let l=_n.length();l*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*l/i.clientHeight,this.object.matrix),this._panUp(2*t*l/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),a=e-i.left,l=t-i.top,c=i.width,d=i.height;this._mouse.x=a/c*2-1,this._mouse.y=-(l/d)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(ti*this._rotateDelta.x/t.clientHeight),this._rotateUp(ti*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(ti*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-ti*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(ti*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-ti*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),a=.5*(e.pageY+t.y);this._rotateStart.set(i,a)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),a=.5*(e.pageY+t.y);this._panStart.set(i,a)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,a=e.pageY-t.y,l=Math.sqrt(i*i+a*a);this._dollyStart.set(0,l)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),a=.5*(e.pageX+i.x),l=.5*(e.pageY+i.y);this._rotateEnd.set(a,l)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(ti*this._rotateDelta.x/t.clientHeight),this._rotateUp(ti*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),a=.5*(e.pageY+t.y);this._panEnd.set(i,a)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,a=e.pageY-t.y,l=Math.sqrt(i*i+a*a);this._dollyEnd.set(0,l),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const c=(e.pageX+t.x)*.5,d=(e.pageY+t.y)*.5;this._updateZoomParameters(c,d)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new ot,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function vA(s){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(s.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(s)&&(this._addPointer(s),s.pointerType==="touch"?this._onTouchStart(s):this._onMouseDown(s),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function yA(s){this.enabled!==!1&&(s.pointerType==="touch"?this._onTouchMove(s):this._onMouseMove(s))}function SA(s){switch(this._removePointer(s),this._pointers.length){case 0:this.domElement.releasePointerCapture(s.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(ux),this.state=kt.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function MA(s){let e;switch(s.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Ba.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(s),this.state=kt.DOLLY;break;case Ba.ROTATE:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=kt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=kt.ROTATE}break;case Ba.PAN:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=kt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=kt.PAN}break;default:this.state=kt.NONE}this.state!==kt.NONE&&this.dispatchEvent(Qf)}function EA(s){switch(this.state){case kt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(s);break;case kt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(s);break;case kt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(s);break}}function wA(s){this.enabled===!1||this.enableZoom===!1||this.state!==kt.NONE||(s.preventDefault(),this.dispatchEvent(Qf),this._handleMouseWheel(this._customWheelEvent(s)),this.dispatchEvent(ux))}function bA(s){this.enabled!==!1&&this._handleKeyDown(s)}function TA(s){switch(this._trackPointer(s),this._pointers.length){case 1:switch(this.touches.ONE){case Oa.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(s),this.state=kt.TOUCH_ROTATE;break;case Oa.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(s),this.state=kt.TOUCH_PAN;break;default:this.state=kt.NONE}break;case 2:switch(this.touches.TWO){case Oa.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(s),this.state=kt.TOUCH_DOLLY_PAN;break;case Oa.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(s),this.state=kt.TOUCH_DOLLY_ROTATE;break;default:this.state=kt.NONE}break;default:this.state=kt.NONE}this.state!==kt.NONE&&this.dispatchEvent(Qf)}function AA(s){switch(this._trackPointer(s),this.state){case kt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(s),this.update();break;case kt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(s),this.update();break;case kt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(s),this.update();break;case kt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(s),this.update();break;default:this.state=kt.NONE}}function CA(s){this.enabled!==!1&&s.preventDefault()}function RA(s){s.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function PA(s){s.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const NA=/^[og]\s*(.+)?/,LA=/^mtllib /,DA=/^usemtl /,IA=/^usemap /,t_=/\s+/,n_=new Y,kh=new Y,i_=new Y,r_=new Y,Si=new Y,Xc=new ut;function UA(){const s={objects:[],object:{},vertices:[],normals:[],colors:[],uvs:[],materials:{},materialLibraries:[],startObject:function(e,t){if(this.object&&this.object.fromDeclaration===!1){this.object.name=e,this.object.fromDeclaration=t!==!1;return}const i=this.object&&typeof this.object.currentMaterial=="function"?this.object.currentMaterial():void 0;if(this.object&&typeof this.object._finalize=="function"&&this.object._finalize(!0),this.object={name:e||"",fromDeclaration:t!==!1,geometry:{vertices:[],normals:[],colors:[],uvs:[],hasUVIndices:!1},materials:[],smooth:!0,startMaterial:function(a,l){const c=this._finalize(!1);c&&(c.inherited||c.groupCount<=0)&&this.materials.splice(c.index,1);const d={index:this.materials.length,name:a||"",mtllib:Array.isArray(l)&&l.length>0?l[l.length-1]:"",smooth:c!==void 0?c.smooth:this.smooth,groupStart:c!==void 0?c.groupEnd:0,groupEnd:-1,groupCount:-1,inherited:!1,clone:function(h){const f={index:typeof h=="number"?h:this.index,name:this.name,mtllib:this.mtllib,smooth:this.smooth,groupStart:0,groupEnd:-1,groupCount:-1,inherited:!1};return f.clone=this.clone.bind(f),f}};return this.materials.push(d),d},currentMaterial:function(){if(this.materials.length>0)return this.materials[this.materials.length-1]},_finalize:function(a){const l=this.currentMaterial();if(l&&l.groupEnd===-1&&(l.groupEnd=this.geometry.vertices.length/3,l.groupCount=l.groupEnd-l.groupStart,l.inherited=!1),a&&this.materials.length>1)for(let c=this.materials.length-1;c>=0;c--)this.materials[c].groupCount<=0&&this.materials.splice(c,1);return a&&this.materials.length===0&&this.materials.push({name:"",smooth:this.smooth}),l}},i&&i.name&&typeof i.clone=="function"){const a=i.clone(0);a.inherited=!0,this.object.materials.push(a)}this.objects.push(this.object)},finalize:function(){this.object&&typeof this.object._finalize=="function"&&this.object._finalize(!0)},parseVertexIndex:function(e,t){const i=parseInt(e,10);return(i>=0?i-1:i+t/3)*3},parseNormalIndex:function(e,t){const i=parseInt(e,10);return(i>=0?i-1:i+t/3)*3},parseUVIndex:function(e,t){const i=parseInt(e,10);return(i>=0?i-1:i+t/2)*2},addVertex:function(e,t,i){const a=this.vertices,l=this.object.geometry.vertices;l.push(a[e+0],a[e+1],a[e+2]),l.push(a[t+0],a[t+1],a[t+2]),l.push(a[i+0],a[i+1],a[i+2])},addVertexPoint:function(e){const t=this.vertices;this.object.geometry.vertices.push(t[e+0],t[e+1],t[e+2])},addVertexLine:function(e){const t=this.vertices;this.object.geometry.vertices.push(t[e+0],t[e+1],t[e+2])},addNormal:function(e,t,i){const a=this.normals,l=this.object.geometry.normals;l.push(a[e+0],a[e+1],a[e+2]),l.push(a[t+0],a[t+1],a[t+2]),l.push(a[i+0],a[i+1],a[i+2])},addFaceNormal:function(e,t,i){const a=this.vertices,l=this.object.geometry.normals;n_.fromArray(a,e),kh.fromArray(a,t),i_.fromArray(a,i),Si.subVectors(i_,kh),r_.subVectors(n_,kh),Si.cross(r_),Si.normalize(),l.push(Si.x,Si.y,Si.z),l.push(Si.x,Si.y,Si.z),l.push(Si.x,Si.y,Si.z)},addColor:function(e,t,i){const a=this.colors,l=this.object.geometry.colors;a[e]!==void 0&&l.push(a[e+0],a[e+1],a[e+2]),a[t]!==void 0&&l.push(a[t+0],a[t+1],a[t+2]),a[i]!==void 0&&l.push(a[i+0],a[i+1],a[i+2])},addUV:function(e,t,i){const a=this.uvs,l=this.object.geometry.uvs;l.push(a[e+0],a[e+1]),l.push(a[t+0],a[t+1]),l.push(a[i+0],a[i+1])},addDefaultUV:function(){const e=this.object.geometry.uvs;e.push(0,0),e.push(0,0),e.push(0,0)},addUVLine:function(e){const t=this.uvs;this.object.geometry.uvs.push(t[e+0],t[e+1])},addFace:function(e,t,i,a,l,c,d,h,f){const _=this.vertices.length;let m=this.parseVertexIndex(e,_),g=this.parseVertexIndex(t,_),y=this.parseVertexIndex(i,_);if(this.addVertex(m,g,y),this.addColor(m,g,y),d!==void 0&&d!==""){const M=this.normals.length;m=this.parseNormalIndex(d,M),g=this.parseNormalIndex(h,M),y=this.parseNormalIndex(f,M),this.addNormal(m,g,y)}else this.addFaceNormal(m,g,y);if(a!==void 0&&a!==""){const M=this.uvs.length;m=this.parseUVIndex(a,M),g=this.parseUVIndex(l,M),y=this.parseUVIndex(c,M),this.addUV(m,g,y),this.object.geometry.hasUVIndices=!0}else this.addDefaultUV()},addPointGeometry:function(e){this.object.geometry.type="Points";const t=this.vertices.length;for(let i=0,a=e.length;i<a;i++){const l=this.parseVertexIndex(e[i],t);this.addVertexPoint(l),this.addColor(l)}},addLineGeometry:function(e,t){this.object.geometry.type="Line";const i=this.vertices.length,a=this.uvs.length;for(let l=0,c=e.length;l<c;l++)this.addVertexLine(this.parseVertexIndex(e[l],i));for(let l=0,c=t.length;l<c;l++)this.addUVLine(this.parseUVIndex(t[l],a))}};return s.startObject("",!1),s}class FA extends Kf{constructor(e){super(e),this.materials=null}load(e,t,i,a){const l=this,c=new uE(this.manager);c.setPath(this.path),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(e,function(d){try{t(l.parse(d))}catch(h){a?a(h):console.error(h),l.manager.itemError(e)}},i,a)}setMaterials(e){return this.materials=e,this}parse(e){const t=new UA;e.indexOf(`\r
`)!==-1&&(e=e.replace(/\r\n/g,`
`)),e.indexOf(`\\
`)!==-1&&(e=e.replace(/\\\n/g,""));const i=e.split(`
`);let a=[];for(let d=0,h=i.length;d<h;d++){const f=i[d].trimStart();if(f.length===0)continue;const _=f.charAt(0);if(_!=="#")if(_==="v"){const m=f.split(t_);switch(m[0]){case"v":t.vertices.push(parseFloat(m[1]),parseFloat(m[2]),parseFloat(m[3])),m.length>=7?(Xc.setRGB(parseFloat(m[4]),parseFloat(m[5]),parseFloat(m[6]),ci),t.colors.push(Xc.r,Xc.g,Xc.b)):t.colors.push(void 0,void 0,void 0);break;case"vn":t.normals.push(parseFloat(m[1]),parseFloat(m[2]),parseFloat(m[3]));break;case"vt":t.uvs.push(parseFloat(m[1]),parseFloat(m[2]));break}}else if(_==="f"){const g=f.slice(1).trim().split(t_),y=[];for(let b=0,S=g.length;b<S;b++){const v=g[b];if(v.length>0){const R=v.split("/");y.push(R)}}const M=y[0];for(let b=1,S=y.length-1;b<S;b++){const v=y[b],R=y[b+1];t.addFace(M[0],v[0],R[0],M[1],v[1],R[1],M[2],v[2],R[2])}}else if(_==="l"){const m=f.substring(1).trim().split(" ");let g=[];const y=[];if(f.indexOf("/")===-1)g=m;else for(let M=0,b=m.length;M<b;M++){const S=m[M].split("/");S[0]!==""&&g.push(S[0]),S[1]!==""&&y.push(S[1])}t.addLineGeometry(g,y)}else if(_==="p"){const g=f.slice(1).trim().split(" ");t.addPointGeometry(g)}else if((a=NA.exec(f))!==null){const m=(" "+a[0].slice(1).trim()).slice(1);t.startObject(m)}else if(DA.test(f))t.object.startMaterial(f.substring(7).trim(),t.materialLibraries);else if(LA.test(f))t.materialLibraries.push(f.substring(7).trim());else if(IA.test(f))console.warn('THREE.OBJLoader: Rendering identifier "usemap" not supported. Textures must be defined in MTL files.');else if(_==="s"){if(a=f.split(" "),a.length>1){const g=a[1].trim().toLowerCase();t.object.smooth=g!=="0"&&g!=="off"}else t.object.smooth=!0;const m=t.object.currentMaterial();m&&(m.smooth=t.object.smooth)}else{if(f==="\0")continue;console.warn('THREE.OBJLoader: Unexpected line: "'+f+'"')}}t.finalize();const l=new ir;if(l.materialLibraries=[].concat(t.materialLibraries),!(t.objects.length===1&&t.objects[0].geometry.vertices.length===0)===!0)for(let d=0,h=t.objects.length;d<h;d++){const f=t.objects[d],_=f.geometry,m=f.materials,g=_.type==="Line",y=_.type==="Points";let M=!1;if(_.vertices.length===0)continue;const b=new qn;b.setAttribute("position",new hn(_.vertices,3)),_.normals.length>0&&b.setAttribute("normal",new hn(_.normals,3)),_.colors.length>0&&(M=!0,b.setAttribute("color",new hn(_.colors,3))),_.hasUVIndices===!0&&b.setAttribute("uv",new hn(_.uvs,2));const S=[];for(let R=0,I=m.length;R<I;R++){const T=m[R],N=T.name+"_"+T.smooth+"_"+M;let L=t.materials[N];if(this.materials!==null){if(L=this.materials.create(T.name),g&&L&&!(L instanceof tl)){const U=new tl;lr.prototype.copy.call(U,L),U.color.copy(L.color),L=U}else if(y&&L&&!(L instanceof Zo)){const U=new Zo({size:10,sizeAttenuation:!1});lr.prototype.copy.call(U,L),U.color.copy(L.color),U.map=L.map,L=U}}L===void 0&&(g?L=new tl:y?L=new Zo({size:1,sizeAttenuation:!1}):L=new rE,L.name=T.name,L.flatShading=!T.smooth,L.vertexColors=M,t.materials[N]=L),S.push(L)}let v;if(S.length>1){for(let R=0,I=m.length;R<I;R++){const T=m[R];b.addGroup(T.groupStart,T.groupCount,R)}g?v=new Cf(b,S):y?v=new Rh(b,S):v=new Ot(b,S)}else g?v=new Cf(b,S[0]):y?v=new Rh(b,S[0]):v=new Ot(b,S[0]);v.name=f.name,l.add(v)}else if(t.vertices.length>0){const d=new Zo({size:1,sizeAttenuation:!1}),h=new qn;h.setAttribute("position",new hn(t.vertices,3)),t.colors.length>0&&t.colors[0]!==void 0&&(h.setAttribute("color",new hn(t.colors,3)),d.vertexColors=!0);const f=new Rh(h,d);l.add(f)}return l}}class OA{constructor(){Bt(this,"group");Bt(this,"chassisGroup");Bt(this,"frontWheelPivot");Bt(this,"frontWheelMesh");Bt(this,"rearLeftWheelMesh");Bt(this,"rearRightWheelMesh");Bt(this,"leftHeadlight");Bt(this,"rightHeadlight");Bt(this,"brakeLightsMaterial");Bt(this,"wheelRadius",.203);Bt(this,"wheelWidth",.102);Bt(this,"wheelRotation",0);Bt(this,"currentSteerAngle",0);Bt(this,"currentRoll",0);Bt(this,"currentPitch",0);this.group=new ir,this.chassisGroup=new ir,this.group.add(this.chassisGroup);const e=new Ki({color:1841431,roughness:.85,metalness:.1}),t=new Ki({color:13948120,roughness:.25,metalness:.85}),i=new Ki({color:440020,roughness:.3,metalness:.7}),a=()=>{const v=new ir,R=new Fs(this.wheelRadius,this.wheelRadius,this.wheelWidth,28);R.rotateZ(Math.PI/2);const I=new Ot(R,e);I.castShadow=!0,I.receiveShadow=!0;const T=new Fs(this.wheelRadius*.62,this.wheelRadius*.62,this.wheelWidth*1.04,20);T.rotateZ(Math.PI/2);const N=new Ot(T,t),L=new Fs(this.wheelRadius*.22,this.wheelRadius*.22,this.wheelWidth*1.08,16);L.rotateZ(Math.PI/2);const U=new Ot(L,i);return v.add(I),v.add(N),v.add(U),v};this.frontWheelPivot=new ir,this.frontWheelPivot.position.set(0,this.wheelRadius,-1),this.frontWheelMesh=a(),this.frontWheelPivot.add(this.frontWheelMesh),this.group.add(this.frontWheelPivot),this.rearLeftWheelMesh=a(),this.rearLeftWheelMesh.position.set(-.575,this.wheelRadius,1),this.group.add(this.rearLeftWheelMesh),this.rearRightWheelMesh=a(),this.rearRightWheelMesh.position.set(.575,this.wheelRadius,1),this.group.add(this.rearRightWheelMesh);const l=new Ki({color:2565930,metalness:.6,roughness:.4}),c=new Fs(.03,.03,1.15,12);c.rotateZ(Math.PI/2);const d=new Ot(c,l);d.position.set(0,this.wheelRadius,1),this.group.add(d);const h=v=>{const R=new fE(16317180,5,50,Math.PI/5.5,.35,1.2);R.position.set(v,.65,-.79),R.target.position.set(v,.1,-25),this.chassisGroup.add(R),this.chassisGroup.add(R.target);const I=new Fs(.07,.07,.03,16);I.rotateX(Math.PI/2);const T=new js({color:14742270}),N=new Ot(I,T);return N.position.set(v,.65,-.8),this.chassisGroup.add(N),R};this.leftHeadlight=h(-.28),this.rightHeadlight=h(.28),this.brakeLightsMaterial=new js({color:8330525});const f=new Bi(.16,.07,.04),_=new Ot(f,this.brakeLightsMaterial);_.position.set(-.48,.74,1.44),this.chassisGroup.add(_);const m=new Ot(f,this.brakeLightsMaterial);m.position.set(.48,.74,1.44),this.chassisGroup.add(m);const g=new Nr(.72,.32),y=new js({color:593174}),M=new Ot(g,y);M.position.set(0,1.25,1.436),this.chassisGroup.add(M);const b=new Ki({color:2565930,roughness:.6}),S=new Ot(new Bi(.85,.08,.04),b);S.position.set(0,.38,1.44),this.chassisGroup.add(S),this.buildProceduralBody(),this.loadAutowareObj()}buildProceduralBody(){const e=new Ki({color:1981066,roughness:.25,metalness:.65}),t=new Ki({color:1579035,roughness:.4,metalness:.3}),i=new iE({color:988970,roughness:.1,metalness:.2,transmission:.75,transparent:!0,opacity:.8}),a=new Bi(1.15,.55,1.832),l=new Ot(a,e);l.position.set(0,.55,.516),l.name="procedural_chassis",this.chassisGroup.add(l);const c=new Bi(.7,.45,.42),d=new Ot(c,e);d.position.set(0,.52,-.6),d.name="procedural_nose",this.chassisGroup.add(d);const h=new Bi(.24,.18,.22),f=new Ot(h,t);f.position.set(0,.38,-.8),f.name="procedural_mud",this.chassisGroup.add(f);const _=new Bi(1.1,.08,1.75),m=new Ot(_,t);m.position.set(0,1.65,.52),m.name="procedural_roof",this.chassisGroup.add(m);const g=new Nr(.85,.85),y=new Ot(g,i);y.position.set(0,1.25,-.52),y.rotation.x=.32,y.name="procedural_windshield",this.chassisGroup.add(y)}loadAutowareObj(){new FA().load("/models/etrike_body.obj",t=>{this.chassisGroup.children.filter(c=>c.name.startsWith("procedural_")).forEach(c=>this.chassisGroup.remove(c));const a=new Ki({color:1920728,roughness:.25,metalness:.7});t.traverse(c=>{if(c.isMesh){const d=c;d.material=a,d.castShadow=!0,d.receiveShadow=!0}});const l=new zt().set(0,-1,0,0,0,0,1,0,-1,0,0,1,0,0,0,1);t.applyMatrix4(l),this.chassisGroup.add(t)},void 0,t=>{console.warn("[TuktukVehicle] Using procedural geometry. OBJ load notice:",t)})}update(e,t,i,a,l){const c=e*1e3/3600,d=c*l/this.wheelRadius;this.wheelRotation-=d,this.frontWheelMesh.rotation.x=this.wheelRotation,this.rearLeftWheelMesh.rotation.x=this.wheelRotation,this.rearRightWheelMesh.rotation.x=this.wheelRotation;const h=-(t*Math.PI)/180;this.currentSteerAngle+=(h-this.currentSteerAngle)*Math.min(l*15,1),this.frontWheelPivot.rotation.y=this.currentSteerAngle;const f=c*(i/1e3),_=Math.max(Math.min(-f*.04,.08),-.08);this.currentRoll+=(_-this.currentRoll)*Math.min(l*10,1),this.chassisGroup.rotation.z=this.currentRoll;const m=a>20,g=m?Math.min(a/1500*.04,.05):0;this.currentPitch+=(g-this.currentPitch)*Math.min(l*12,1),this.chassisGroup.rotation.x=this.currentPitch,m?this.brakeLightsMaterial.color.setHex(16007006):this.brakeLightsMaterial.color.setHex(5244708)}}class kA{constructor(){Bt(this,"group");Bt(this,"roadMesh");Bt(this,"laneDashes");Bt(this,"boundaryLines");Bt(this,"pathRibbonMesh");Bt(this,"pathGeometry");Bt(this,"dashCount",30);Bt(this,"dashSpacing",6);Bt(this,"roadLength",180);Bt(this,"roadWidth",14);Bt(this,"roadOffset",0);Bt(this,"pathPulseOffset",0);this.group=new ir;const e=new Nr(this.roadWidth,this.roadLength,1,1);e.rotateX(-Math.PI/2);const t=new Ki({color:657930,roughness:.95,metalness:.05});this.roadMesh=new Ot(e,t),this.roadMesh.position.set(0,-.01,-40),this.roadMesh.receiveShadow=!0,this.group.add(this.roadMesh);const i=[],a=this.roadWidth/2;i.push(new Y(-a,.01,20)),i.push(new Y(-a,.01,-120)),i.push(new Y(a,.01,20)),i.push(new Y(a,.01,-120)),i.push(new Y(-a/2,.01,20)),i.push(new Y(-a/2,.01,-120)),i.push(new Y(a/2,.01,20)),i.push(new Y(a/2,.01,-120));const l=new qn().setFromPoints(i),c=new tl({color:2565930,transparent:!0,opacity:.8});this.boundaryLines=new Cf(l,c),this.group.add(this.boundaryLines);const d=new Nr(.2,2.5);d.rotateX(-Math.PI/2);const h=new js({color:15000807,transparent:!0,opacity:.85});this.laneDashes=new YM(d,h,this.dashCount*2);const f=new tn;for(let g=0;g<this.dashCount;g++){const y=20-g*this.dashSpacing;f.position.set(-a/4,.015,y),f.updateMatrix(),this.laneDashes.setMatrixAt(g,f.matrix),f.position.set(a/4,.015,y),f.updateMatrix(),this.laneDashes.setMatrixAt(this.dashCount+g,f.matrix)}this.laneDashes.instanceMatrix.needsUpdate=!0,this.group.add(this.laneDashes);const _=32;this.pathGeometry=new Nr(1.4,32,1,_),this.pathGeometry.rotateX(-Math.PI/2);const m=new js({color:440020,transparent:!0,opacity:.55,side:tr,depthWrite:!1});this.pathRibbonMesh=new Ot(this.pathGeometry,m),this.pathRibbonMesh.position.set(0,.02,0),this.group.add(this.pathRibbonMesh)}update(e,t,i,a){const l=e*1e3/3600;this.roadOffset+=l*a;const c=this.roadOffset%this.dashSpacing,d=new tn,h=this.roadWidth/2;for(let v=0;v<this.dashCount;v++){const R=20-v*this.dashSpacing+c;d.position.set(-h/4,.015,R),d.updateMatrix(),this.laneDashes.setMatrixAt(v,d.matrix),d.position.set(h/4,.015,R),d.updateMatrix(),this.laneDashes.setMatrixAt(this.dashCount+v,d.matrix)}this.laneDashes.instanceMatrix.needsUpdate=!0;const f=2,_=t*Math.PI/180,m=Math.tan(_)/f,g=this.pathGeometry.attributes.position,y=.7,M=32,b=32;this.pathPulseOffset+=a*2.5;for(let v=0;v<=b;v++){const I=-(v/b)*M,T=-.45*m*I*I,N=v*2;g.setXYZ(N,T-y,.02,I),g.setXYZ(N+1,T+y,.02,I)}g.needsUpdate=!0;const S=this.pathRibbonMesh.material;i?(S.color.setHex(440020),S.opacity=.45+Math.sin(this.pathPulseOffset)*.15):(S.color.setHex(4144966),S.opacity=.25)}}const BA=()=>{var w,D,B;const{telemetry:s,totalFrames:e,cameraMode:t,setCameraMode:i,speedUnit:a,setSpeedUnit:l,toggleActiveView:c,framesById:d}=vn(),h=a==="mph"?s.speed_act_kmh*.621371:s.speed_act_kmh,f=a==="mph"?s.speed_cmd_kmh*.621371:s.speed_cmd_kmh,_=s.mode==="AUTONOMOUS"||s.mode==="AUTO",m=s.estop,g=s.lights_act.left,y=s.lights_act.right,M=s.lights_act.headlight,b=s.lights_act.hazard,S=s.steer_act_deg,v=s.steer_cmd_deg,R=s.brake_act_kpa,I=Math.min(R/1500*100,100),T=(B=(D=(w=d[289])==null?void 0:w.signals)==null?void 0:D.yaw_rate_mrad_s)==null?void 0:B.value,N=typeof T=="number"?T:Math.round(-S*s.speed_act_kmh*.28),L=Math.round(s.speed_act_kmh*110),U=Math.min(Math.round(s.speed_act_kmh/45*100),100);return A.jsxs("div",{className:"absolute inset-0 pointer-events-none flex flex-col justify-between p-6 select-none font-mono",children:[A.jsxs("div",{className:"flex items-start justify-between relative",children:[A.jsxs("div",{className:"flex items-center gap-4",children:[A.jsx("div",{className:`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-150 ${g||b?"bg-emerald-500 text-black border-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.95)] animate-pulse":"bg-[#080808]/85 text-neutral-700 border-neutral-800"}`,title:"Left Turn Indicator (Peripheral Field)",children:A.jsx(Hy,{className:"w-8 h-8 stroke-[3]"})}),A.jsx("div",{className:`flex items-center gap-3 px-4 py-2.5 rounded-xl border backdrop-blur-xl transition-all ${m?"bg-rose-950/90 text-rose-200 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.7)] animate-pulse":"bg-[#080808]/85 text-emerald-400 border-emerald-500/50 shadow-lg"}`,children:m?A.jsxs(A.Fragment,{children:[A.jsx(Zy,{className:"w-5 h-5 text-rose-400 fill-current animate-bounce"}),A.jsx("span",{className:"text-sm font-black uppercase tracking-wider",children:"E-STOP ACTIVE"})]}):A.jsxs(A.Fragment,{children:[A.jsx(oS,{className:"w-5 h-5 text-emerald-400"}),A.jsx("span",{className:"text-sm font-bold uppercase tracking-wider",children:"SAFETY OK"})]})})]}),A.jsxs("div",{className:"absolute left-1/2 -translate-x-1/2 top-0 flex flex-col items-center",children:[A.jsxs("div",{className:"flex items-center gap-3 mb-1.5",children:[A.jsxs("div",{className:"flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#080808]/90 border border-neutral-700/80 text-sm shadow-md",title:"Target Commanded Cruise Speed",children:[A.jsx("span",{className:"text-xs uppercase text-neutral-400 font-bold tracking-wider",children:"CRUISE"}),A.jsx("span",{className:"font-black tabular-nums text-white text-base",children:f.toFixed(0)})]}),A.jsxs("div",{className:`flex items-center gap-2 px-3.5 py-1 rounded-full border transition-all ${_?"bg-cyan-950/90 text-cyan-300 border-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.6)]":"bg-[#080808]/90 text-neutral-400 border-neutral-800"}`,children:[A.jsx(qy,{className:`w-4 h-4 ${_?"animate-pulse text-cyan-300":"text-neutral-500"}`}),A.jsx("span",{className:"text-xs font-black uppercase tracking-wider",children:_?"AUTOWARE AUTO":"MANUAL"})]})]}),A.jsxs("div",{className:"flex items-baseline gap-2 drop-shadow-[0_6px_20px_rgba(0,0,0,0.95)]",children:[A.jsx("span",{className:"text-7xl lg:text-8xl font-black text-white tracking-tight tabular-nums font-mono leading-none",children:h.toFixed(0)}),A.jsx("span",{className:"text-base lg:text-lg font-black text-neutral-400 uppercase tracking-widest",children:a})]})]}),A.jsxs("div",{className:"flex items-center gap-4",children:[A.jsx("div",{className:`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${M?"bg-blue-600 text-white border-blue-400 shadow-[0_0_16px_rgba(59,130,246,0.9)]":"bg-[#080808]/85 text-neutral-700 border-neutral-800"}`,title:"High Beam Headlights",children:A.jsx(mS,{className:"w-6 h-6 fill-current"})}),A.jsx("div",{className:`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-150 ${y||b?"bg-emerald-500 text-black border-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.95)] animate-pulse":"bg-[#080808]/85 text-neutral-700 border-neutral-800"}`,title:"Right Turn Indicator (Peripheral Field)",children:A.jsx(Gy,{className:"w-8 h-8 stroke-[3]"})})]})]}),A.jsxs("div",{className:"flex justify-between items-center px-2",children:[A.jsxs("div",{className:"w-80 lg:w-84 bg-[#080808]/85 backdrop-blur-xl border border-neutral-800/90 rounded-2xl p-5 space-y-4 pointer-events-auto shadow-2xl",children:[A.jsxs("div",{className:"flex items-center justify-between border-b border-neutral-800 pb-2",children:[A.jsx("span",{className:"text-xs uppercase font-black text-neutral-400 tracking-wider",children:"CHASSIS DYNAMICS"}),A.jsx("span",{className:"text-[10px] text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800 font-bold",children:"3-WHEELER"})]}),A.jsxs("div",{children:[A.jsxs("div",{className:"flex justify-between items-baseline mb-1.5",children:[A.jsx("span",{className:"text-sm font-semibold text-neutral-300",children:"Steering"}),A.jsx("span",{className:"text-2xl font-black tabular-nums text-emerald-400",children:S>0?`+${S.toFixed(1)}°`:`${S.toFixed(1)}°`})]}),A.jsxs("div",{className:"h-4 bg-neutral-950 rounded-full relative overflow-hidden border border-neutral-700/80 shadow-inner",children:[A.jsx("div",{className:"absolute left-1/2 top-0 bottom-0 w-1 bg-neutral-400 -translate-x-1/2 z-10"}),A.jsx("div",{className:"absolute top-0 bottom-0 w-1.5 bg-cyan-300 -translate-x-1/2 z-20 shadow-[0_0_8px_rgba(6,182,212,1)]",style:{left:`${50+v/45*50}%`},title:`Commanded Steer: ${v.toFixed(1)}°`}),A.jsx("div",{className:"h-full bg-emerald-400 transition-all duration-75 absolute top-0",style:{left:S<0?`${50+S/45*50}%`:"50%",width:`${Math.abs(S)/45*50}%`}})]}),A.jsxs("div",{className:"flex justify-between text-xs text-neutral-400 mt-1 font-mono",children:[A.jsx("span",{children:"-45°"}),A.jsxs("span",{className:"text-cyan-400 font-bold",children:["CMD: ",v.toFixed(1),"°"]}),A.jsx("span",{children:"+45°"})]})]}),A.jsxs("div",{className:"flex justify-between items-baseline pt-1 border-t border-neutral-900",children:[A.jsx("span",{className:"text-sm font-semibold text-neutral-300",children:"Yaw Rate"}),A.jsxs("div",{children:[A.jsx("span",{className:"text-2xl font-black text-white tabular-nums",children:N}),A.jsx("span",{className:"text-xs text-neutral-400 ml-1.5 font-bold",children:"mrad/s"})]})]}),A.jsxs("div",{className:"pt-1 border-t border-neutral-900",children:[A.jsxs("div",{className:"flex justify-between items-baseline mb-1.5",children:[A.jsx("span",{className:"text-sm font-semibold text-neutral-300",children:"Hydraulic Brake"}),A.jsxs("span",{className:`text-2xl font-black tabular-nums ${R>50?"text-rose-400":"text-neutral-200"}`,children:[R," ",A.jsx("span",{className:"text-xs font-normal text-neutral-400",children:"kPa"})]})]}),A.jsx("div",{className:"h-3.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-700/80 shadow-inner",children:A.jsx("div",{className:`h-full transition-all duration-75 ${R>100?"bg-gradient-to-r from-amber-500 to-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)]":"bg-neutral-600"}`,style:{width:`${I}%`}})})]})]}),A.jsxs("div",{className:"w-80 lg:w-84 bg-[#080808]/85 backdrop-blur-xl border border-neutral-800/90 rounded-2xl p-5 space-y-4 pointer-events-auto shadow-2xl",children:[A.jsxs("div",{className:"flex items-center justify-between border-b border-neutral-800 pb-2",children:[A.jsx("span",{className:"text-xs uppercase font-black text-neutral-400 tracking-wider",children:"POWERTRAIN & BUS"}),A.jsx("span",{className:"text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 font-bold",children:"ACTIVE"})]}),A.jsxs("div",{children:[A.jsxs("div",{className:"flex justify-between items-baseline mb-1.5",children:[A.jsx("span",{className:"text-sm font-semibold text-neutral-300",children:"Electric Motor"}),A.jsxs("span",{className:"text-2xl font-black tabular-nums text-cyan-300",children:[L.toLocaleString()," ",A.jsx("span",{className:"text-xs font-normal text-neutral-400",children:"RPM"})]})]}),A.jsx("div",{className:"h-4 bg-neutral-950 rounded-full overflow-hidden border border-neutral-700/80 shadow-inner",children:A.jsx("div",{className:"h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-75 shadow-[0_0_10px_rgba(6,182,212,0.6)]",style:{width:`${U}%`}})}),A.jsxs("div",{className:"flex justify-between text-xs text-neutral-400 mt-1 font-mono",children:[A.jsx("span",{children:"IDLE"}),A.jsxs("span",{className:"text-neutral-300",children:[U,"% DEMAND"]}),A.jsx("span",{children:"PEAK"})]})]}),A.jsxs("div",{className:"flex justify-between items-baseline pt-1 border-t border-neutral-900",children:[A.jsx("span",{className:"text-sm font-semibold text-neutral-300",children:"Bus Rate"}),A.jsxs("div",{className:"flex items-center gap-2",children:[A.jsx(w_,{className:"w-4 h-4 text-cyan-400 animate-pulse"}),A.jsx("span",{className:"text-2xl font-black text-emerald-400 tabular-nums",children:"28.0 Hz"})]})]}),A.jsxs("div",{className:"flex justify-between items-baseline pt-1 border-t border-neutral-900",children:[A.jsx("span",{className:"text-sm font-semibold text-neutral-300",children:"CAN Telemetry Frames"}),A.jsx("span",{className:"text-base font-bold text-neutral-200 tabular-nums",children:e.toLocaleString()})]})]})]}),A.jsxs("div",{className:"flex items-end justify-between relative px-2",children:[A.jsxs("div",{className:"flex items-center gap-2 bg-[#080808]/90 backdrop-blur-xl border border-neutral-800/90 p-1.5 rounded-xl pointer-events-auto shadow-xl",children:[A.jsx(By,{className:"w-4 h-4 text-neutral-400 ml-1.5 mr-0.5"}),["chase","cabin","orbit"].map(z=>A.jsx("button",{onClick:()=>i(z),className:`h-10 px-3.5 rounded-lg text-xs font-black uppercase transition-all ${t===z?"bg-neutral-800 text-cyan-300 shadow-md border border-neutral-700":"text-neutral-400 hover:text-white"}`,children:z==="orbit"?"360°":z},z))]}),A.jsxs("div",{className:"absolute left-1/2 -translate-x-1/2 bottom-0 flex flex-col items-center",children:[A.jsx("div",{className:"flex items-center gap-3 bg-[#080808]/95 backdrop-blur-xl border border-neutral-800/95 px-4 py-2 rounded-2xl shadow-2xl mb-2 pointer-events-auto",children:["P","R","N","D","S"].map(z=>{const j=s.gear===z;return A.jsx("div",{className:`w-12 h-12 flex items-center justify-center rounded-xl text-xl font-black transition-all ${j?"bg-cyan-500 text-black shadow-[0_0_18px_rgba(6,182,212,0.9)] scale-110 border-2 border-cyan-300":"text-neutral-500 hover:text-neutral-300 bg-neutral-900/60"}`,children:z},z)})}),A.jsx("span",{className:"text-xs text-neutral-300 uppercase tracking-widest font-bold",children:_?"AUTOWARE UNIVERSE • AUTONOMOUS DRIVE":"MANUAL DRIVE OVERRIDE"})]}),A.jsxs("div",{className:"flex items-center gap-3 pointer-events-auto",children:[A.jsxs("div",{className:"flex bg-[#080808]/90 backdrop-blur-xl border border-neutral-800/90 p-1 rounded-xl text-xs",children:[A.jsx("button",{onClick:()=>l("km/h"),className:`h-9 px-3 rounded-lg transition-all font-black ${a==="km/h"?"bg-neutral-800 text-white shadow":"text-neutral-500 hover:text-neutral-300"}`,children:"KM/H"}),A.jsx("button",{onClick:()=>l("mph"),className:`h-9 px-3 rounded-lg transition-all font-black ${a==="mph"?"bg-neutral-800 text-white shadow":"text-neutral-500 hover:text-neutral-300"}`,children:"MPH"})]}),A.jsxs("button",{onClick:c,className:"flex items-center gap-2 bg-[#080808]/95 hover:bg-neutral-900 text-neutral-200 border border-neutral-700/80 px-4 h-11 rounded-xl text-xs font-black transition-all shadow-xl",title:"Switch back to CAN Bus Engineering Monitor (Tab)",children:[A.jsx(b_,{className:"w-4 h-4 text-cyan-400"}),A.jsx("span",{children:"CAN MONITOR"}),A.jsx("span",{className:"text-[10px] text-neutral-400 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-700 font-bold",children:"Tab"})]})]})]})]})},zA=()=>{const s=an.useRef(null);return vn(e=>e.cameraMode),an.useEffect(()=>{const e=s.current;if(!e)return;const t=new BM;t.background=new ut(0),t.fog=new Yf(0,.015);const i=e.clientWidth||window.innerWidth,a=e.clientHeight||window.innerHeight,l=new ui(50,i/a,.1,300);l.position.set(0,2.8,6.2);const c=new gA({antialias:!0,powerPreference:"high-performance"});c.setSize(i,a),c.setPixelRatio(Math.min(window.devicePixelRatio,2)),c.shadowMap.enabled=!0,c.shadowMap.type=A_,e.appendChild(c.domElement);const d=new xA(l,c.domElement);d.enableDamping=!0,d.dampingFactor=.05,d.maxPolarAngle=Math.PI/2-.05,d.minDistance=2,d.maxDistance=25,d.target.set(0,.8,0),d.enabled=!1;const h=new mE(16777215,.7);t.add(h);const f=new Ag(16777215,1.4);f.position.set(-12,18,-15),f.castShadow=!0,t.add(f);const _=new Ag(9684477,.9);_.position.set(12,12,15),t.add(_);const m=new dE(440020,1579035,.6);t.add(m);const g=new kA;t.add(g.group);const y=new OA;t.add(y.group);let M,b=performance.now();const S=I=>{var z,j,te;M=requestAnimationFrame(S);const T=Math.min((I-b)/1e3,.1);b=I;const N=vn.getState(),L=N.telemetry,U=L.mode==="AUTONOMOUS"||L.mode==="AUTO",w=(te=(j=(z=N.framesById[289])==null?void 0:z.signals)==null?void 0:j.yaw_rate_mrad_s)==null?void 0:te.value,D=typeof w=="number"?w:Math.round(-L.steer_act_deg*L.speed_act_kmh*.28);y.update(L.speed_act_kmh,L.steer_act_deg,D,L.brake_act_kpa,T),g.update(L.speed_act_kmh,L.steer_act_deg,U,T);const B=N.cameraMode;B==="orbit"?(d.enabled=!0,d.target.set(0,.75,.2),d.update()):(d.enabled=!1,B==="cabin"?(l.position.set(0,1.25,0),l.lookAt(0,1,-25)):(l.position.x+=(0-l.position.x)*(T*6),l.position.y+=(2.5-l.position.y)*(T*6),l.position.z+=(5.2-l.position.z)*(T*6),l.lookAt(0,.75,-8))),c.render(t,l)};M=requestAnimationFrame(S);const v=()=>{if(!e)return;const I=e.clientWidth,T=e.clientHeight;l.aspect=I/T,l.updateProjectionMatrix(),c.setSize(I,T)};window.addEventListener("resize",v);const R=new ResizeObserver(v);return R.observe(e),()=>{cancelAnimationFrame(M),window.removeEventListener("resize",v),R.disconnect(),d.dispose(),c.dispose(),c.domElement&&e.contains(c.domElement)&&e.removeChild(c.domElement)}},[]),A.jsxs("div",{className:"relative w-full h-full bg-black overflow-hidden select-none",children:[A.jsx("div",{ref:s,className:"absolute inset-0 w-full h-full"}),A.jsx(BA,{})]})},HA=()=>{const{initWebSocket:s,setCatalog:e,togglePause:t}=vn();an.useEffect(()=>{const h=window.location.port==="5173"?"http://127.0.0.1:8000":"";fetch(`${h}/api/v1/catalog`).then(m=>{if(!m.ok)throw new Error(`HTTP ${m.status}`);return m.json()}).then(m=>{m.messages&&e(m.messages,m.source||"YAML Contracts")}).catch(m=>{console.error("Failed to fetch CAN catalog:",m)}),s();const f=m=>{if(m.code==="Space"&&m.target.tagName!=="INPUT"){m.preventDefault(),t();return}if(m.key==="Tab"&&m.target.tagName!=="INPUT"){m.preventDefault(),vn.getState().toggleActiveView();return}vn.getState().activeView==="cockpit"&&m.target.tagName!=="INPUT"&&(m.key==="1"?vn.getState().setCameraMode("chase"):m.key==="2"?vn.getState().setCameraMode("cabin"):m.key==="3"&&vn.getState().setCameraMode("orbit")),(m.ctrlKey||m.metaKey)&&(m.key==="="||m.key==="+"||m.code==="Equal"||m.code==="NumpadAdd"?(m.preventDefault(),vn.getState().setZoomLevel(g=>g+.1)):m.key==="-"||m.key==="_"||m.code==="Minus"||m.code==="NumpadSubtract"?(m.preventDefault(),vn.getState().setZoomLevel(g=>g-.1)):(m.key==="0"||m.code==="Digit0"||m.code==="Numpad0")&&(m.preventDefault(),vn.getState().setZoomLevel(1)))},_=m=>{if(m.ctrlKey||m.metaKey){m.preventDefault();const g=m.deltaY<0?.05:-.05;vn.getState().setZoomLevel(y=>y+g)}};return window.addEventListener("keydown",f),window.addEventListener("wheel",_,{passive:!1}),()=>{window.removeEventListener("keydown",f),window.removeEventListener("wheel",_)}},[s,e,t]);const{zoomLevel:i,zoomToast:a,setZoomToast:l,activeView:c}=vn();return an.useEffect(()=>{if(a){const d=setTimeout(()=>l(null),1500);return()=>clearTimeout(d)}},[a,l]),an.useEffect(()=>{document.documentElement.style.zoom=String(i)},[i]),A.jsxs("div",{className:"flex flex-col h-full w-full bg-black text-neutral-100 overflow-hidden font-sans select-none antialiased relative",children:[A.jsx(gS,{}),c==="cockpit"?A.jsx("div",{className:"flex-1 flex min-h-0 overflow-hidden relative",children:A.jsx(zA,{})}):A.jsxs("div",{className:"flex-1 flex min-h-0 overflow-hidden",children:[A.jsx(_S,{}),A.jsx(OS,{}),A.jsxs("div",{className:"w-[520px] flex flex-col min-h-0 border-l border-neutral-800 shrink-0 bg-black",children:[A.jsx(kS,{}),A.jsx(zS,{})]})]}),a&&A.jsxs("div",{className:"fixed bottom-5 right-5 z-50 bg-[#0d0d0d] text-cyan-300 font-mono text-xs px-3 py-1.5 rounded-lg border border-neutral-700 shadow-2xl flex items-center gap-2 pointer-events-none backdrop-blur animate-fade-in",children:[A.jsxs("span",{className:"font-bold",children:["Scale: ",a]}),A.jsx("span",{className:"text-[10px] text-neutral-400 font-sans",children:"(Ctrl+0 resets)"})]})]})},VA=new Ry({defaultOptions:{queries:{refetchOnWindowFocus:!1,staleTime:5e3}}});Jv.createRoot(document.getElementById("root")).render(A.jsx(ds.StrictMode,{children:A.jsx(ty,{client:VA,children:A.jsx(HA,{})})}));
