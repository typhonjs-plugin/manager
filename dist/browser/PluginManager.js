const e=/\s+/;function t(s,i,o,r,a){let h,l=0;if(o&&"object"==typeof o){void 0!==r&&"context"in a&&void 0===a.context&&(a.context=r);for(h=n(o);l<h.length;l++)i=t(s,i,h[l],o[h[l]],a)}else if(o&&e.test(o))for(h=o.split(e);l<h.length;l++)i=s(i,h[l],r,a);else i=s(i,o,r,a);return i}const n=e=>null===e||"object"!=typeof e?[]:Object.keys(e);function s(e,t,n,s){const o=s.after,r=s.count+1;if(n){const s=e[t]=i(r,(function(){return n.apply(this,arguments)}),(()=>{o(t,s)}));s._callback=n}return e}const i=function(e,t,n){let s;return function(...i){return--e>0&&(s=t.apply(this,i)),e<=1&&(n&&n.apply(this,i),n=void 0,t=void 0),s}};class o{constructor(e){this._eventbus=e,this._events=void 0}before(e,n,i,o){if(null===this._eventbus)throw new ReferenceError("This EventbusProxy instance has been destroyed.");if(!Number.isInteger(e))throw new TypeError("'count' is not an integer");const r=t(s,{},n,i,{count:e,after:this.off.bind(this)});return"string"==typeof n&&null==o&&(i=void 0),this.on(r,i,o)}destroy(){null!==this._eventbus&&this.off(),this._events=void 0,this._eventbus=null}*entries(e){if(null===this._eventbus)throw new ReferenceError("This EventbusProxy instance has been destroyed.");for(const t of this._eventbus.entries(e))yield t}get eventCount(){if(null===this._eventbus)throw new ReferenceError("This EventbusProxy instance has been destroyed.");return this._eventbus.eventCount}*keys(e){if(null===this._eventbus)throw new ReferenceError("This EventbusProxy instance has been destroyed.");for(const t of this._eventbus.keys(e))yield t}get isDestroyed(){return null===this._eventbus}get name(){if(null===this._eventbus)throw new ReferenceError("This EventbusProxy instance has been destroyed.");return this._eventbus.name}off(e,n,s){if(null===this._eventbus)throw new ReferenceError("This EventbusProxy instance has been destroyed.");return this._events=t(r,this._events||{},e,n,{context:s,eventbus:this._eventbus}),this}on(e,n,s){if(null===this._eventbus)throw new ReferenceError("This EventbusProxy instance has been destroyed.");let i;return i=null!==e&&"object"==typeof e?void 0!==n?n:this:s||this,this._events=t(a,this._events||{},e,n,{context:i}),this._eventbus.on(e,n,i),this}once(e,n,i){if(null===this._eventbus)throw new ReferenceError("This EventbusProxy instance has been destroyed.");const o=t(s,{},e,n,{count:1,after:this.off.bind(this)});return"string"==typeof e&&null==i&&(n=void 0),this.on(o,n,i)}*proxyEntries(e){if(null===this._eventbus)throw new ReferenceError("This EventbusProxy instance has been destroyed.");if(void 0!==e&&!(e instanceof RegExp))throw new TypeError("'regex' is not a RegExp");if(this._events)if(e){for(const t in this._events)if(e.test(t))for(const e of this._events[t])yield[t,e.callback,e.context]}else for(const e in this._events)for(const t of this._events[e])yield[e,t.callback,t.context]}get proxyEventCount(){if(null===this._eventbus)throw new ReferenceError("This EventbusProxy instance has been destroyed.");if(!this._events)return 0;let e=0;for(const t in this._events)e+=this._events[t].length;return e}*proxyKeys(e){if(null===this._eventbus)throw new ReferenceError("This EventbusProxy instance has been destroyed.");if(void 0!==e&&!(e instanceof RegExp))throw new TypeError("'regex' is not a RegExp");if(this._events)if(e)for(const t in this._events)e.test(t)&&(yield t);else for(const e in this._events)yield e}trigger(){if(null===this._eventbus)throw new ReferenceError("This EventbusProxy instance has been destroyed.");return this._eventbus.trigger(...arguments),this}triggerAsync(){if(null===this._eventbus)throw new ReferenceError("This EventbusProxy instance has been destroyed.");return this._eventbus.triggerAsync(...arguments)}triggerDefer(){if(null===this._eventbus)throw new ReferenceError("This EventbusProxy instance has been destroyed.");return this._eventbus.triggerDefer(...arguments),this}triggerSync(){if(null===this._eventbus)throw new ReferenceError("This EventbusProxy instance has been destroyed.");return this._eventbus.triggerSync(...arguments)}}const r=(e,t,s,i)=>{if(!e)return;const o=i.context,r=i.eventbus,a=t?[t]:n(e);for(let n=0;n<a.length;n++){const i=e[t=a[n]];if(!i)break;const h=[];for(let e=0;e<i.length;e++){const t=i[e];(s&&s!==t.callback&&s!==t.callback._callback||o&&o!==t.context)&&h.push(t)}h.length?e[t]=h:(r.off(t,s,o),delete e[t])}return e},a=(e,t,n,s)=>{if(n){const i=e[t]||(e[t]=[]),o=s.context;i.push({callback:n,context:o})}return e};class h{constructor(e=""){if("string"!=typeof e)throw new TypeError("'eventbusName' is not a string");this._eventbusName=e,this._events=void 0,this._listeners=void 0,this._listeningTo=void 0}before(e,n,i,o){if(!Number.isInteger(e))throw new TypeError("'count' is not an integer");const r=t(s,{},n,i,{count:e,after:this.off.bind(this)});return"string"==typeof n&&null==o&&(i=void 0),this.on(r,i,o)}createProxy(){return new o(this)}*entries(e){if(void 0!==e&&!(e instanceof RegExp))throw new TypeError("'regex' is not a RegExp");if(this._events)if(e){for(const t in this._events)if(e.test(t))for(const e of this._events[t])yield[t,e.callback,e.ctx]}else for(const e in this._events)for(const t of this._events[e])yield[e,t.callback,t.ctx]}get eventCount(){if(!this._events)return 0;let e=0;for(const t in this._events)e+=this._events[t].length;return e}*keys(e){if(void 0!==e&&!(e instanceof RegExp))throw new TypeError("'regex' is not a RegExp");if(this._events)if(e)for(const t in this._events)e.test(t)&&(yield t);else for(const e in this._events)yield e}get name(){return this._eventbusName}listenTo(e,t,n){if(!e)return this;const s=e._listenId||(e._listenId=w("l")),i=this._listeningTo||(this._listeningTo={});let o=l=i[s];o||(this._listenId||(this._listenId=w("l")),o=l=i[s]=new u(this,e));const r=b(e,t,n,this);if(l=void 0,r)throw r;return o.interop&&o.on(t,n),this}listenToBefore(e,n,i,o){if(!Number.isInteger(e))throw new TypeError("'count' is not an integer");const r=t(s,{},i,o,{count:e,after:this.stopListening.bind(this,n)});return this.listenTo(n,r)}listenToOnce(e,n,i){const o=t(s,{},n,i,{count:1,after:this.stopListening.bind(this,e)});return this.listenTo(e,o)}off(e,n,s){return this._events?(this._events=t(c,this._events,e,n,{context:s,listeners:this._listeners}),this):this}on(e,n,s){return this._events=t(f,this._events||{},e,n,{context:s,ctx:this,listening:l}),l&&((this._listeners||(this._listeners={}))[l.id]=l,l.interop=!1),this}once(e,n,i){const o=t(s,{},e,n,{count:1,after:this.off.bind(this)});return"string"==typeof e&&null==i&&(n=void 0),this.on(o,n,i)}stopListening(e,t,s){const i=this._listeningTo;if(!i)return this;const o=e?[e._listenId]:n(i);for(let e=0;e<o.length;e++){const n=i[o[e]];if(!n)break;n.obj.off(t,s,this),n.interop&&n.off(t,s)}return this}trigger(e){if(!this._events)return this;const t=Math.max(0,arguments.length-1),n=new Array(t);for(let e=0;e<t;e++)n[e]=arguments[e+1];return p(g,d,this._events,e,void 0,n),this}async triggerAsync(e){if(!this._events)return;const t=Math.max(0,arguments.length-1),n=new Array(t);for(let e=0;e<t;e++)n[e]=arguments[e+1];const s=p(g,v,this._events,e,void 0,n);return void 0!==s?Array.isArray(s)?Promise.all(s).then((e=>{let t=[];for(const n of e)Array.isArray(n)?t=t.concat(n):void 0!==n&&t.push(n);return t.length>1?t:1===t.length?t[0]:void 0})):s:void 0}triggerDefer(e){return setTimeout((()=>{this.trigger(...arguments)}),0),this}triggerSync(e){if(!this._events)return;const t=Math.max(0,arguments.length-1),n=new Array(t);for(let e=0;e<t;e++)n[e]=arguments[e+1];return p(g,y,this._events,e,void 0,n)}}let l;class u{constructor(e,t){this.id=e._listenId,this.listener=e,this.obj=t,this.interop=!0,this.count=0,this._events=void 0}cleanup(){delete this.listener._listeningTo[this.obj._listenId],this.interop||delete this.obj._listeners[this.id]}on(e,n,s){return this._events=t(f,this._events||{},e,n,{context:s,ctx:this,listening:this}),this}off(e,n){let s;this.interop?(this._events=t(c,this._events,e,n,{context:void 0,listeners:void 0}),s=!this._events):(this.count--,s=0===this.count),s&&this.cleanup()}}const c=(e,t,s,i)=>{if(!e)return;const o=i.context,r=i.listeners;let a,h=0;if(t||o||s){for(a=t?[t]:n(e);h<a.length;h++){const n=e[t=a[h]];if(!n)break;const i=[];for(let e=0;e<n.length;e++){const r=n[e];if(s&&s!==r.callback&&s!==r.callback._callback||o&&o!==r.context)i.push(r);else{const e=r.listening;e&&e.off(t,s)}}i.length?e[t]=i:delete e[t]}return e}for(a=n(r);h<a.length;h++)r[a[h]].cleanup()},f=(e,t,n,s)=>{if(n){const i=e[t]||(e[t]=[]),o=s.context,r=s.ctx,a=s.listening;a&&a.count++,i.push({callback:n,context:o,ctx:o||r,listening:a})}return e},p=(t,n,s,i,o,r)=>{let a,h,l=0;if(i&&e.test(i))for(h=i.split(e);l<h.length;l++){const e=t(n,s,h[l],o,r),i=Array.isArray(a)?2:void 0!==a?1:0;if(Array.isArray(e))switch(i){case 0:a=e;break;case 1:a=[a].concat(e);break;case 2:a=a.concat(e)}else if(void 0!==e)switch(i){case 0:a=e;break;case 1:{const t=[a];t.push(e),a=t;break}case 2:a.push(e)}}else a=t(n,s,i,o,r);return a},g=(e,t,n,s,i)=>{let o;if(t){const s=t[n];let r=t.all;s&&r&&(r=r.slice()),s&&(o=e(s,i)),r&&(o=e(r,[n].concat(i)))}return o},d=(e,t)=>{let n,s=-1;const i=t[0],o=t[1],r=t[2],a=e.length;switch(t.length){case 0:for(;++s<a;)(n=e[s]).callback.call(n.ctx);return;case 1:for(;++s<a;)(n=e[s]).callback.call(n.ctx,i);return;case 2:for(;++s<a;)(n=e[s]).callback.call(n.ctx,i,o);return;case 3:for(;++s<a;)(n=e[s]).callback.call(n.ctx,i,o,r);return;default:for(;++s<a;)(n=e[s]).callback.apply(n.ctx,t);return}},v=async(e,t)=>{let n,s=-1;const i=t[0],o=t[1],r=t[2],a=e.length,h=[];try{switch(t.length){case 0:for(;++s<a;){const t=(n=e[s]).callback.call(n.ctx);void 0!==t&&h.push(t)}break;case 1:for(;++s<a;){const t=(n=e[s]).callback.call(n.ctx,i);void 0!==t&&h.push(t)}break;case 2:for(;++s<a;){const t=(n=e[s]).callback.call(n.ctx,i,o);void 0!==t&&h.push(t)}break;case 3:for(;++s<a;){const t=(n=e[s]).callback.call(n.ctx,i,o,r);void 0!==t&&h.push(t)}break;default:for(;++s<a;){const i=(n=e[s]).callback.apply(n.ctx,t);void 0!==i&&h.push(i)}}}catch(e){return Promise.reject(e)}return h.length>1?Promise.all(h).then((e=>{const t=e.filter((e=>void 0!==e));switch(t.length){case 0:return;case 1:return t[0];default:return t}})):1===h.length?Promise.resolve(h[0]):Promise.resolve()},y=(e,t)=>{let n,s=-1;const i=t[0],o=t[1],r=t[2],a=e.length,h=[];switch(t.length){case 0:for(;++s<a;){const t=(n=e[s]).callback.call(n.ctx);void 0!==t&&h.push(t)}break;case 1:for(;++s<a;){const t=(n=e[s]).callback.call(n.ctx,i);void 0!==t&&h.push(t)}break;case 2:for(;++s<a;){const t=(n=e[s]).callback.call(n.ctx,i,o);void 0!==t&&h.push(t)}break;case 3:for(;++s<a;){const t=(n=e[s]).callback.call(n.ctx,i,o,r);void 0!==t&&h.push(t)}break;default:for(;++s<a;){const i=(n=e[s]).callback.apply(n.ctx,t);void 0!==i&&h.push(i)}}return h.length>1?h:1===h.length?h[0]:void 0},b=(e,t,n,s)=>{try{e.on(t,n,s)}catch(e){return e}};let _=0;const w=(e="")=>{const t=""+ ++_;return e?`${e}${t}`:t};class E{constructor(e,t,n,s){this._data=t,this._enabled=!0,this._name=e,this._instance=n,this._eventbusProxy=s,this._events=void 0}get data(){return this._data}get enabled(){return this._enabled}set enabled(e){if(this._enabled=e,e){if(void 0!==this._eventbusProxy&&Array.isArray(this._events)){for(const e of this._events)this._eventbusProxy.on(...e);this._events=void 0}}else void 0!==this._eventbusProxy&&(this._events=Array.from(this._eventbusProxy.proxyEntries()),this._eventbusProxy.off())}get eventbusProxy(){return this._eventbusProxy}get instance(){return this._instance}get name(){return this._name}}function P(e,t=[]){if("object"!=typeof e)throw new TypeError("'data' is not an 'object'.");if(!Array.isArray(t))throw new TypeError("'skipFreezeKeys' is not an 'array'.");return x(e,t)}function m(e){return null!=e&&"object"==typeof e&&"function"==typeof e[Symbol.iterator]}function M(e){return null!==e&&"object"==typeof e}function x(e,t){if(Array.isArray(e))for(let n=0;n<e.length;n++)x(e[n],t);else if("object"==typeof e)for(const n in e)e.hasOwnProperty(n)&&-1===t.indexOf(n)&&x(e[n],t);return Object.freeze(e)}class T{constructor(e={},t={}){this.data=Object.assign(JSON.parse(JSON.stringify(e)),t),this.eventbus=void 0,this.pluginName=void 0,this.pluginOptions=void 0}}async function k(e,t={},n={},s,i,o,r=!0){if("string"!=typeof e)throw new TypeError("'method' is not a string.");if("object"!=typeof n)throw new TypeError("'passthruProps' is not an object.");if("object"!=typeof t)throw new TypeError("'copyProps' is not an object.");if("string"!=typeof s&&!m(s))throw new TypeError("'plugins' is not a string or iterable.");let a=0;const h=[];let l=!1,u=!1;const c=new T(t,n),f=[];if("string"==typeof s){const t=i.get(s);if(t.enabled&&t.instance&&(u=!0,"function"==typeof t.instance[e])){c.eventbus=t.eventbusProxy,c.pluginName=t.name,c.pluginOptions=t.data.plugin.options;const n=t.instance[e](c);null!=n&&f.push(n),l=!0,a++,h.push(t.name)}}else for(const t of s){const n=i.get(t);if(n.enabled&&n.instance&&(u=!0,"function"==typeof n.instance[e])){c.eventbus=n.eventbusProxy,c.pluginName=n.name,c.pluginOptions=n.data.plugin.options;const t=n.instance[e](c);null!=t&&f.push(t),l=!0,a++,h.push(n.name)}}if(r&&o.throwNoPlugin&&!u)throw new Error("PluginManager failed to find any target plugins.");if(r&&o.throwNoMethod&&!l)throw new Error(`PluginManager failed to invoke '${e}'.`);return c.data.$$plugin_invoke_count=a,c.data.$$plugin_invoke_names=h,await Promise.all(f),c.data}const $=/^([.]{1,2}[\\|/])+/g,R=/[\\]/g,A=/^(https?|file):/g;function N(e){let t=e;return e instanceof URL?t=e.pathname:e.match(A)&&(t=new URL(e).pathname),t=t.replace($,""),t=t.replace(R,"\\\\"),t}function O(e){return"object"==typeof e&&"string"==typeof e.name&&(void 0===e.target||"string"==typeof e.target||e.target instanceof URL)&&(void 0===e.options||"object"==typeof e.options)}class S{constructor(e){this._pluginManager=e}get isDestroyed(){return null===this._pluginManager||void 0===this._pluginManager||null===this._pluginManager._pluginMap||void 0===this._pluginManager._pluginMap}get options(){if(this.isDestroyed)throw new ReferenceError("This PluginManager instance has been destroyed.");return this._pluginManager._options}get pluginMap(){if(this.isDestroyed)throw new ReferenceError("This PluginManager instance has been destroyed.");return this._pluginManager._pluginMap}async destroy({eventbus:e,eventPrepend:t}={}){null!=e&&(e.off(`${t}:async:invoke`,this.invokeAsync,this),e.off(`${t}:async:invoke:event`,this.invokeAsyncEvent,this),e.off(`${t}:get:method:names`,this.getMethodNames,this),e.off(`${t}:has:method`,this.hasMethod,this),e.off(`${t}:invoke`,this.invoke,this),e.off(`${t}:sync:invoke`,this.invokeSync,this),e.off(`${t}:sync:invoke:event`,this.invokeSyncEvent,this)),this._pluginManager=null}getMethodNames({enabled:e,plugins:t=[]}={}){if(this.isDestroyed)throw new ReferenceError("This PluginManager instance has been destroyed.");if(void 0!==e&&"boolean"!=typeof e)throw new TypeError("'enabled' is not a boolean.");if("string"!=typeof t&&!m(t))throw new TypeError("'plugins' is not a string or iterable.");"string"==typeof t&&(t=[t]);const n=void 0===e,s={};let i=0;for(const o of t){const t=this.pluginMap.get(o);if(void 0!==t&&t.instance&&(n||t.enabled===e))for(const e of j(t.instance))t.instance[e]instanceof Function&&"constructor"!==e&&(s[e]=!0);i++}if(0===i)for(const t of this.pluginMap.values())if(t.instance&&(n||t.enabled===e))for(const e of j(t.instance))t.instance[e]instanceof Function&&"constructor"!==e&&(s[e]=!0);return Object.keys(s).sort()}hasMethod({method:e,plugins:t=[]}={}){if(this.isDestroyed)throw new ReferenceError("This PluginManager instance has been destroyed.");if("string"!=typeof e)throw new TypeError("'method' is not a string.");if("string"!=typeof t&&!m(t))throw new TypeError("'plugins' is not a string or iterable.");if("string"==typeof t){const n=this.pluginMap.get(t);return void 0!==n&&"function"==typeof n.instance[e]}let n=0;for(const s of t){const t=this.pluginMap.get(s);if(void 0!==t&&"function"==typeof t.instance[e])return!1;n++}if(0===n)for(const t of this.pluginMap.values())if("function"==typeof t.instance[e])return!1;return!0}invoke({method:e,args:t,plugins:n}={}){if(this.isDestroyed)throw new ReferenceError("This PluginManager instance has been destroyed.");if("string"!=typeof e)throw new TypeError("'method' is not a string.");if(void 0!==t&&!Array.isArray(t))throw new TypeError("'args' is not an array.");if(void 0===n&&(n=this.pluginMap.keys()),"string"!=typeof n&&!m(n))throw new TypeError("'plugins' is not a string or iterable.");let s=!1,i=!1;if(!this.options.pluginsEnabled)return;const o=Array.isArray(t);if("string"==typeof n){const r=this.pluginMap.get(n);void 0!==r&&r.enabled&&r.instance&&(i=!0,"function"==typeof r.instance[e]&&(o?r.instance[e](...t):r.instance[e](t),s=!0))}else for(const r of n){const n=this.pluginMap.get(r);void 0!==n&&n.enabled&&n.instance&&(i=!0,"function"==typeof n.instance[e]&&(o?n.instance[e](...t):n.instance[e](t),s=!0))}if(this.options.throwNoPlugin&&!i)throw new Error("PluginManager failed to find any target plugins.");if(this.options.throwNoMethod&&!s)throw new Error(`PluginManager failed to invoke '${e}'.`)}async invokeAsync({method:e,args:t,plugins:n}={}){if(this.isDestroyed)throw new ReferenceError("This PluginManager instance has been destroyed.");if("string"!=typeof e)throw new TypeError("'method' is not a string.");if(void 0!==t&&!Array.isArray(t))throw new TypeError("'args' is not an array.");if(void 0===n&&(n=this.pluginMap.keys()),"string"!=typeof n&&!m(n))throw new TypeError("'plugins' is not a string, array, or iterator.");let s,i=!1,o=!1;const r=[];if(!this.options.pluginsEnabled)return s;const a=Array.isArray(t);if("string"==typeof n){const h=this.pluginMap.get(n);void 0!==h&&h.enabled&&h.instance&&(o=!0,"function"==typeof h.instance[e]&&(s=a?h.instance[e](...t):h.instance[e](t),void 0!==s&&r.push(s),i=!0))}else for(const h of n){const n=this.pluginMap.get(h);void 0!==n&&n.enabled&&n.instance&&(o=!0,"function"==typeof n.instance[e]&&(s=a?n.instance[e](...t):n.instance[e](t),void 0!==s&&r.push(s),i=!0))}if(this.options.throwNoPlugin&&!o)throw new Error("PluginManager failed to find any target plugins.");if(this.options.throwNoMethod&&!i)throw new Error(`PluginManager failed to invoke '${e}'.`);return r.length>1?Promise.all(r).then((e=>{const t=e.filter((e=>void 0!==e));switch(t.length){case 0:return;case 1:return t[0];default:return t}})):s}async invokeAsyncEvent({method:e,copyProps:t={},passthruProps:n={},plugins:s}={}){if(this.isDestroyed)throw new ReferenceError("This PluginManager instance has been destroyed.");if(void 0===s&&(s=this.pluginMap.keys()),this.options.pluginsEnabled)return k(e,t,n,s,this.pluginMap,this.options)}invokeSync({method:e,args:t,plugins:n}={}){if(this.isDestroyed)throw new ReferenceError("This PluginManager instance has been destroyed.");if("string"!=typeof e)throw new TypeError("'method' is not a string.");if(void 0!==t&&!Array.isArray(t))throw new TypeError("'args' is not an array.");if(void 0===n&&(n=this.pluginMap.keys()),"string"!=typeof n&&!m(n))throw new TypeError("'plugins' is not a string or iterable.");let s,i=!1,o=!1;const r=[];if(!this.options.pluginsEnabled)return s;const a=Array.isArray(t);if("string"==typeof n){const h=this.pluginMap.get(n);void 0!==h&&h.enabled&&h.instance&&(o=!0,"function"==typeof h.instance[e]&&(s=a?h.instance[e](...t):h.instance[e](t),void 0!==s&&r.push(s),i=!0))}else for(const h of n){const n=this.pluginMap.get(h);void 0!==n&&n.enabled&&n.instance&&(o=!0,"function"==typeof n.instance[e]&&(s=a?n.instance[e](...t):n.instance[e](t),void 0!==s&&r.push(s),i=!0))}if(this.options.throwNoPlugin&&!o)throw new Error("PluginManager failed to find any target plugins.");if(this.options.throwNoMethod&&!i)throw new Error(`PluginManager failed to invoke '${e}'.`);return r.length>1?r:s}invokeSyncEvent({method:e,copyProps:t={},passthruProps:n={},plugins:s}={}){if(this.isDestroyed)throw new ReferenceError("This PluginManager instance has been destroyed.");if(void 0===s&&(s=this.pluginMap.keys()),this.options.pluginsEnabled)return function(e,t={},n={},s,i,o,r=!0){if("string"!=typeof e)throw new TypeError("'method' is not a string.");if("object"!=typeof n)throw new TypeError("'passthruProps' is not an object.");if("object"!=typeof t)throw new TypeError("'copyProps' is not an object.");if("string"!=typeof s&&!m(s))throw new TypeError("'plugins' is not a string or iterable.");let a=0;const h=[];let l=!1,u=!1;const c=new T(t,n);if("string"==typeof s){const t=i.get(s);t.enabled&&t.instance&&(u=!0,"function"==typeof t.instance[e]&&(c.eventbus=t.eventbusProxy,c.pluginName=t.name,c.pluginOptions=t.data.plugin.options,t.instance[e](c),l=!0,a++,h.push(t.name)))}else for(const t of s){const n=i.get(t);n.enabled&&n.instance&&(u=!0,"function"==typeof n.instance[e]&&(c.eventbus=n.eventbusProxy,c.pluginName=n.name,c.pluginOptions=n.data.plugin.options,n.instance[e](c),l=!0,a++,h.push(n.name)))}if(r&&o.throwNoPlugin&&!u)throw new Error("PluginManager failed to find any target plugins.");if(r&&o.throwNoMethod&&!l)throw new Error(`PluginManager failed to invoke '${e}'.`);return c.data.$$plugin_invoke_count=a,c.data.$$plugin_invoke_names=h,c.data}(e,t,n,s,this.pluginMap,this.options)}setEventbus({oldEventbus:e,newEventbus:t,oldPrepend:n,newPrepend:s}={}){null!=e&&(e.off(`${n}:async:invoke`,this.invokeAsync,this),e.off(`${n}:async:invoke:event`,this.invokeAsyncEvent,this),e.off(`${n}:get:method:names`,this.getMethodNames,this),e.off(`${n}:has:method`,this.hasMethod,this),e.off(`${n}:invoke`,this.invoke,this),e.off(`${n}:sync:invoke`,this.invokeSync,this),e.off(`${n}:sync:invoke:event`,this.invokeSyncEvent,this)),null!=t&&(t.on(`${s}:async:invoke`,this.invokeAsync,this),t.on(`${s}:async:invoke:event`,this.invokeAsyncEvent,this),t.on(`${s}:get:method:names`,this.getMethodNames,this),t.on(`${s}:has:method`,this.hasMethod,this),t.on(`${s}:invoke`,this.invoke,this),t.on(`${s}:sync:invoke`,this.invokeSync,this),t.on(`${s}:sync:invoke:event`,this.invokeSyncEvent,this))}}const j=e=>{const t=[];do{Object.getOwnPropertyNames(e).forEach((e=>{-1===t.indexOf(e)&&t.push(e)})),e=Object.getPrototypeOf(e)}while(null!=e&&e!==Object.prototype);return t};export default class extends class{#privateTest="CAN_SEE_TEST";get test(){return this.#privateTest}constructor(e={}){if(!M(e))throw new TypeError("'options' is not an object.");if(void 0!==e.eventbus&&!M(e.eventbus))throw new TypeError("'options.eventbus' is not an Eventbus.");if(void 0!==e.eventPrepend&&"string"!=typeof e.eventPrepend)throw new TypeError("'options.eventPrepend' is not a string.");if(void 0!==e.PluginSupport&&"function"!=typeof e.PluginSupport&&!m(e.PluginSupport))throw new TypeError("'options.PluginSupport' must be a constructor function or iterable of such matching PluginSupportImpl.");if(void 0!==e.manager&&!M(e.manager))throw new TypeError("'options.manager' is not an object.");if(this._pluginMap=new Map,this._eventbus=null,this._eventbusProxies=[],this._pluginSupport=[],m(e.PluginSupport))for(const t of e.PluginSupport)this._pluginSupport.push(new t(this));else void 0!==e.PluginSupport&&this._pluginSupport.push(new e.PluginSupport(this));this._options={pluginsEnabled:!0,noEventAdd:!1,noEventDestroy:!1,noEventInvoke:!0,noEventOptions:!0,noEventRemoval:!1,throwNoMethod:!1,throwNoPlugin:!1},this.setEventbus({eventbus:void 0!==e.eventbus?e.eventbus:new h,eventPrepend:e.eventPrepend}),this.setOptions(e.manager)}async add(e,t){if(this.isDestroyed)throw new ReferenceError("This PluginManager instance has been destroyed.");if("object"!=typeof e)throw new TypeError("'pluginConfig' is not an object.");if("string"!=typeof e.name)throw new TypeError(`'pluginConfig.name' is not a string for entry: ${JSON.stringify(e)}.`);if(void 0!==e.target&&"string"!=typeof e.target&&!(e.target instanceof URL))throw new TypeError(`'pluginConfig.target' is not a string or URL for entry: ${JSON.stringify(e)}.`);if(void 0!==e.options&&"object"!=typeof e.options)throw new TypeError(`'pluginConfig.options' is not an object for entry: ${JSON.stringify(e)}.`);if(void 0!==t&&"object"!=typeof t)throw new TypeError(`'moduleData' is not an object for entry: ${JSON.stringify(e)}.`);if(this._pluginMap.has(e.name))throw new Error(`A plugin already exists with name: ${e.name}.`);let n,s,i;if("object"==typeof e.instance||"function"==typeof e.instance)n=e.instance,s=e.name,i="instance";else{s=e.target||e.name;const t=await this._loadModule(s);n=t.instance,i=t.type}s instanceof URL&&(s=s.toString());const r=JSON.parse(JSON.stringify({manager:{eventPrepend:this._eventPrepend},module:t||{},plugin:{name:e.name,scopedName:`${this._eventPrepend}:${e.name}`,target:s,targetEscaped:N(s),type:i,options:e.options||{}}}));P(r,["eventPrepend","scopedName"]);const a=null!==this._eventbus&&void 0!==this._eventbus?new o(this._eventbus):void 0,h=new E(e.name,r,n,a);return this._pluginMap.set(e.name,h),await k("onPluginLoad",{},{},e.name,this._pluginMap,this._options,!1),this._eventbus&&await this._eventbus.triggerAsync("typhonjs:plugin:manager:plugin:added",r),r}async addAll(e=[],t){if(this.isDestroyed)throw new ReferenceError("This PluginManager instance has been destroyed.");if(!m(e))throw new TypeError("'pluginConfigs' is not iterable.");const n=[];for(const s of e){const e=await this.add(s,t);e&&n.push(e)}return n}async _addEventbus(e,t){if(this.isDestroyed)throw new ReferenceError("This PluginManager instance has been destroyed.");return this._options.noEventAdd?void 0:this.add(e,t)}async _addAllEventbus(e,t){if(this.isDestroyed)throw new ReferenceError("This PluginManager instance has been destroyed.");if(!this._options.noEventAdd)return this.addAll(e,t)}createEventbusProxy(){if(!(this._eventbus instanceof h))throw new ReferenceError("No eventbus assigned to plugin manager.");const e=new o(this._eventbus);return this._eventbusProxies.push(e),e}async destroy(){if(this.isDestroyed)throw new ReferenceError("This PluginManager instance has been destroyed.");const e=await this.removeAll();for(const e of this._eventbusProxies)e.destroy();this._eventbusProxies=[],null!==this._eventbus&&void 0!==this._eventbus&&(this._eventbus.off(`${this._eventPrepend}:async:add`,this._addEventbus,this),this._eventbus.off(`${this._eventPrepend}:async:add:all`,this._addAllEventbus,this),this._eventbus.off(`${this._eventPrepend}:async:destroy:manager`,this._destroyEventbus,this),this._eventbus.off(`${this._eventPrepend}:async:remove`,this._removeEventbus,this),this._eventbus.off(`${this._eventPrepend}:async:remove:all`,this._removeAllEventbus,this),this._eventbus.off(`${this._eventPrepend}:create:eventbus:proxy`,this.createEventbusProxy,this),this._eventbus.off(`${this._eventPrepend}:get:enabled`,this.getEnabled,this),this._eventbus.off(`${this._eventPrepend}:get:plugin:by:event`,this.getPluginByEvent,this),this._eventbus.off(`${this._eventPrepend}:get:plugin:data`,this.getPluginData,this),this._eventbus.off(`${this._eventPrepend}:get:plugin:events`,this.getPluginEvents,this),this._eventbus.off(`${this._eventPrepend}:get:plugin:names`,this.getPluginNames,this),this._eventbus.off(`${this._eventPrepend}:get:options`,this.getOptions,this),this._eventbus.off(`${this._eventPrepend}:has:plugin`,this.hasPlugin,this),this._eventbus.off(`${this._eventPrepend}:is:valid:config`,this.isValidConfig,this),this._eventbus.off(`${this._eventPrepend}:set:enabled`,this.setEnabled,this),this._eventbus.off(`${this._eventPrepend}:set:options`,this._setOptionsEventbus,this));for(const e of this._pluginSupport)await e.destroy({eventbus:this._eventbus,eventPrepend:this._eventPrepend});return this._pluginSupport=[],this._pluginMap=null,this._eventbus=null,e}async _destroyEventbus(){if(this.isDestroyed)throw new ReferenceError("This PluginManager instance has been destroyed.");if(!this._options.noEventDestroy)return this.destroy()}get isDestroyed(){return null===this._pluginMap||void 0===this._pluginMap}getEnabled({plugins:e=[]}={}){if(this.isDestroyed)throw new ReferenceError("This PluginManager instance has been destroyed.");if("string"!=typeof e&&!m(e))throw new TypeError("'plugins' is not a string or iterable.");if("string"==typeof e){const t=this._pluginMap.get(e);return void 0!==t&&t.enabled}const t=[];let n=0;for(const s of e){const e=this._pluginMap.get(s),i=void 0!==e;t.push({name:s,enabled:i&&e.enabled,loaded:i}),n++}if(0===n)for(const[e,n]of this._pluginMap.entries()){const s=void 0!==n;t.push({name:e,enabled:s&&n.enabled,loaded:s})}return t}getEventbus(){if(this.isDestroyed)throw new ReferenceError("This PluginManager instance has been destroyed.");return this._eventbus}getOptions(){if(this.isDestroyed)throw new ReferenceError("This PluginManager instance has been destroyed.");return JSON.parse(JSON.stringify(this._options))}getPluginByEvent({event:e}={}){if(this.isDestroyed)throw new ReferenceError("This PluginManager instance has been destroyed.");if("string"!=typeof e&&!(e instanceof RegExp))throw new TypeError("'event' is not a string or RegExp.");const t=this.getPluginEvents(),n=[];if("string"==typeof e)for(const s of t)s.events.includes(e)&&n.push(s.plugin);else for(const s of t)for(const t of s.events)if(e.test(t)){n.push(s.plugin);break}return n}getPluginData({plugins:e=[]}={}){if(this.isDestroyed)throw new ReferenceError("This PluginManager instance has been destroyed.");if("string"!=typeof e&&!m(e))throw new TypeError("'plugins' is not a string or iterable.");if("string"==typeof e){const t=this._pluginMap.get(e);return void 0!==t?JSON.parse(JSON.stringify(t.data)):void 0}const t=[];let n=0;for(const s of e){const e=this._pluginMap.get(s);void 0!==e&&t.push(JSON.parse(JSON.stringify(e.data))),n++}if(0===n)for(const e of this._pluginMap.values())void 0!==e&&t.push(JSON.parse(JSON.stringify(e.data)));return t}getPluginEvents({plugins:e=[]}={}){if(this.isDestroyed)throw new ReferenceError("This PluginManager instance has been destroyed.");if("string"!=typeof e&&!m(e))throw new TypeError("'plugins' is not a string or iterable.");if("string"==typeof e){const t=this._pluginMap.get(e);return void 0!==t&&t.eventbusProxy?Array.from(t.eventbusProxy.proxyKeys()):[]}const t=[];let n=0;for(const s of e){const e=this._pluginMap.get(s);void 0!==e&&t.push({plugin:s,events:e.eventbusProxy?Array.from(e.eventbusProxy.proxyKeys()).sort():[]}),n++}if(0===n)for(const e of this._pluginMap.values())void 0!==e&&t.push({plugin:e.name,events:e.eventbusProxy?Array.from(e.eventbusProxy.proxyKeys()).sort():[]});return t}getPluginNames({enabled:e}={}){if(this.isDestroyed)throw new ReferenceError("This PluginManager instance has been destroyed.");if(void 0!==e&&"boolean"!=typeof e)throw new TypeError("'enabled' is not a boolean.");const t=void 0===e,n=[];for(const s of this._pluginMap.values())(t||s.enabled===e)&&n.push(s.name);return n.sort()}hasPlugin({plugin:e}={}){if(this.isDestroyed)throw new ReferenceError("This PluginManager instance has been destroyed.");if("string"!=typeof e)throw new TypeError("'plugin' is not a string.");return this._pluginMap.has(e)}isValidConfig(e){return O(e)}async _loadModule(e){}async remove({plugins:e=[]}={}){if(this.isDestroyed)throw new ReferenceError("This PluginManager instance has been destroyed.");if("string"!=typeof e&&!m(e))throw new TypeError("'plugins' is not a string or iterable.");const t=async e=>{const t=[],n=e.name;try{await k("onPluginUnload",{},{},n,this._pluginMap,this._options,!1)}catch(e){t.push(e)}try{e.instance._eventbus=void 0}catch(e){}e.eventbusProxy instanceof o&&e.eventbusProxy.destroy(),this._pluginMap.delete(n);try{this._eventbus&&await this._eventbus.triggerAsync("typhonjs:plugin:manager:plugin:removed",JSON.parse(JSON.stringify(e.data)))}catch(e){t.push(e)}return{name:n,success:0===t.length,errors:t}},n=[];if("string"==typeof e){const s=this._pluginMap.get(e);void 0!==s&&n.push(await t(s))}else for(const s of e){const e=this._pluginMap.get(s);void 0!==e&&n.push(await t(e))}return n}async removeAll(){if(this.isDestroyed)throw new ReferenceError("This PluginManager instance has been destroyed.");return this.remove({plugins:Array.from(this._pluginMap.keys())})}async _removeEventbus(e){if(this.isDestroyed)throw new ReferenceError("This PluginManager instance has been destroyed.");return this._options.noEventRemoval?[]:this.remove(e)}async _removeAllEventbus(){if(this.isDestroyed)throw new ReferenceError("This PluginManager instance has been destroyed.");if(!this._options.noEventRemoval)return this.removeAll()}setEnabled({enabled:e,plugins:t=[]}={}){if(this.isDestroyed)throw new ReferenceError("This PluginManager instance has been destroyed.");if("string"!=typeof t&&!m(t))throw new TypeError("'plugins' is not a string or iterable.");if("boolean"!=typeof e)throw new TypeError("'enabled' is not a boolean.");const n=t=>{void 0!==t&&(t.enabled=e,this._eventbus&&this._eventbus.trigger("typhonjs:plugin:manager:plugin:enabled",Object.assign({enabled:e},JSON.parse(JSON.stringify(t.data)))))};"string"==typeof t&&n(this._pluginMap.get(t));let s=0;for(const e of t)n(this._pluginMap.get(e)),s++;if(0===s)for(const e of this._pluginMap.values())n(e)}async setEventbus({eventbus:e,eventPrepend:t="plugins"}={}){if(this.isDestroyed)throw new ReferenceError("This PluginManager instance has been destroyed.");if(!(e instanceof h))throw new TypeError("'eventbus' is not an Eventbus.");if("string"!=typeof t)throw new TypeError("'eventPrepend' is not a string.");if(e===this._eventbus)return this;const n=this._eventPrepend;if(this._eventPrepend=t,this._pluginMap.size>0){await k("onPluginUnload",{},{},this._pluginMap.keys(),this._pluginMap,this._options,!1);for(const n of this._pluginMap.values()){try{n.instance._eventbus=void 0}catch(e){}n.data.manager.eventPrepend=t,n.data.plugin.scopedName=`${t}:${n.name}`,n.eventbusProxy instanceof o&&n.eventbusProxy.destroy(),n.eventbusProxy=new o(e)}await k("onPluginLoad",{},{},this._pluginMap.keys(),this._pluginMap,this._options,!1);for(const s of this._pluginMap.values())this._eventbus&&this._eventbus.trigger("typhonjs:plugin:manager:eventbus:changed",Object.assign({oldEventbus:this._eventbus,oldManagerEventPrepend:n,oldScopedName:`${n}:${s.name}`,newEventbus:e,newManagerEventPrepend:t,newScopedName:`${t}:${s.name}`},JSON.parse(JSON.stringify(s.data))))}null!==this._eventbus&&(this._eventbus.off(`${n}:async:add`,this._addEventbus,this),this._eventbus.off(`${n}:async:add:all`,this._addAllEventbus,this),this._eventbus.off(`${n}:async:destroy:manager`,this._destroyEventbus,this),this._eventbus.off(`${n}:async:remove`,this._removeEventbus,this),this._eventbus.off(`${n}:async:remove:all`,this._removeAllEventbus,this),this._eventbus.off(`${n}:create:eventbus:proxy`,this.createEventbusProxy,this),this._eventbus.off(`${n}:get:enabled`,this.getEnabled,this),this._eventbus.off(`${n}:get:options`,this.getOptions,this),this._eventbus.off(`${n}:get:plugin:by:event`,this.getPluginByEvent,this),this._eventbus.off(`${n}:get:plugin:data`,this.getPluginData,this),this._eventbus.off(`${n}:get:plugin:events`,this.getPluginEvents,this),this._eventbus.off(`${n}:get:plugin:names`,this.getPluginNames,this),this._eventbus.off(`${n}:has:plugin`,this.hasPlugin,this),this._eventbus.off(`${n}:is:valid:config`,this.isValidConfig,this),this._eventbus.off(`${n}:set:enabled`,this.setEnabled,this),this._eventbus.off(`${n}:set:options`,this._setOptionsEventbus,this)),e.on(`${t}:async:add`,this._addEventbus,this),e.on(`${t}:async:add:all`,this._addAllEventbus,this),e.on(`${t}:async:destroy:manager`,this._destroyEventbus,this),e.on(`${t}:async:remove`,this._removeEventbus,this),e.on(`${t}:async:remove:all`,this._removeAllEventbus,this),e.on(`${t}:create:eventbus:proxy`,this.createEventbusProxy,this),e.on(`${t}:get:enabled`,this.getEnabled,this),e.on(`${t}:get:options`,this.getOptions,this),e.on(`${t}:get:plugin:by:event`,this.getPluginByEvent,this),e.on(`${t}:get:plugin:data`,this.getPluginData,this),e.on(`${t}:get:plugin:events`,this.getPluginEvents,this),e.on(`${t}:get:plugin:names`,this.getPluginNames,this),e.on(`${t}:has:plugin`,this.hasPlugin,this),e.on(`${t}:is:valid:config`,this.isValidConfig,this),e.on(`${t}:set:enabled`,this.setEnabled,this),e.on(`${t}:set:options`,this._setOptionsEventbus,this);for(const s of this._pluginSupport)s.setEventbus({oldEventbus:this._eventbus,newEventbus:e,oldPrepend:n,newPrepend:t});return this._eventbus=e,this}setOptions(e={}){if(this.isDestroyed)throw new ReferenceError("This PluginManager instance has been destroyed.");if(!M(e))throw new TypeError("'options' is not an object.");"boolean"==typeof e.pluginsEnabled&&(this._options.pluginsEnabled=e.pluginsEnabled),"boolean"==typeof e.noEventAdd&&(this._options.noEventAdd=e.noEventAdd),"boolean"==typeof e.noEventDestroy&&(this._options.noEventDestroy=e.noEventDestroy),"boolean"==typeof e.noEventInvoke&&(this._options.noEventInvoke=e.noEventInvoke),"boolean"==typeof e.noEventOptions&&(this._options.noEventOptions=e.noEventOptions),"boolean"==typeof e.noEventRemoval&&(this._options.noEventRemoval=e.noEventRemoval),"boolean"==typeof e.throwNoMethod&&(this._options.throwNoMethod=e.throwNoMethod),"boolean"==typeof e.throwNoPlugin&&(this._options.throwNoPlugin=e.throwNoPlugin)}_setOptionsEventbus(e={}){if(this.isDestroyed)throw new ReferenceError("This PluginManager instance has been destroyed.");this._options.noEventOptions||this.setOptions(e)}}{async _loadModule(e){const t=await import(e);null!==this._eventbus&&void 0!==this._eventbus&&this._eventbus.trigger("log:debug",`@typhonjs-plugin/manager - import: ${e}`);const n="import-"+(e instanceof URL||"string"==typeof e&&e.startsWith("http")?"url":"path");let s;return s="function"==typeof t.onPluginLoad?t:t.default?t.default:t,{instance:s,type:n}}}export{h as Eventbus,o as EventbusProxy,S as PluginInvokeSupport,N as escapeTarget,O as isValidConfig};
//# sourceMappingURL=PluginManager.js.map
