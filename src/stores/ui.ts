import { create } from 'zustand';
type Theme='light'|'dark'|'system';
type UIState={sidebarOpen:boolean;compact:boolean;theme:Theme;toggleSidebar:()=>void;closeSidebar:()=>void;setCompact:(v:boolean)=>void;setTheme:(v:Theme)=>void};
export const useUIStore=create<UIState>((set)=>({sidebarOpen:false,compact:false,theme:'light',toggleSidebar:()=>set(s=>({sidebarOpen:!s.sidebarOpen})),closeSidebar:()=>set({sidebarOpen:false}),setCompact:(compact)=>set({compact}),setTheme:(theme)=>set({theme})}));
