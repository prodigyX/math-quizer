import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({ plugins: [react(), VitePWA({registerType:'prompt',includeAssets:['icon.svg','apple-touch-icon.png'],manifest:{name:'Little Maths — Flashcards & Quiz',short_name:'Little Maths',description:'Friendly maths practice for Year 3 and Year 4.',theme_color:'#f8f7f2',background_color:'#f8f7f2',display:'standalone',start_url:'/',icons:[{src:'/icon-192.png',sizes:'192x192',type:'image/png'},{src:'/icon-512.png',sizes:'512x512',type:'image/png',purpose:'any maskable'}]},workbox:{globPatterns:['**/*.{js,css,html,svg,png,woff2}']}})] });
