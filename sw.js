if(!self.define){let e,s={};const n=(n,i)=>(n=new URL(n+".js",i).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(i,t)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(s[r])return;let o={};const c=e=>n(e,r),a={module:{uri:r},exports:o,require:c};s[r]=Promise.all(i.map((e=>a[e]||c(e)))).then((e=>(t(...e),o)))}}define(["./workbox-74f2ef77"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-CXpfFGbl.js",revision:null},{url:"assets/index-D1gPgZMS.css",revision:null},{url:"index.html",revision:"2413eabe7a98b95323e58a2ff973f1d0"},{url:"registerSW.js",revision:"77a753d94959c4de416a85b6f1e60a88"},{url:"manifest.webmanifest",revision:"c83203a97b640c7d7f98c4caa11a609a"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))),e.registerRoute(/\/otazkyPng\/.*\.(?:png|jpg|jpeg|svg|gif)$/i,new e.CacheFirst({cacheName:"images-cache",plugins:[new e.ExpirationPlugin({maxEntries:200,maxAgeSeconds:2592e3})]}),"GET"),e.registerRoute(/\/assets\/.*\.txt$/,new e.CacheFirst({cacheName:"txt-files-cache",plugins:[new e.ExpirationPlugin({maxEntries:50,maxAgeSeconds:604800})]}),"GET")}));
