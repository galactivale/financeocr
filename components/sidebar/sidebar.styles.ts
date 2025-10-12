import { tv } from "@nextui-org/react";

export const SidebarWrapper = tv({
  base: "bg-white/5 backdrop-blur-2xl transition-all duration-300 ease-out h-full fixed -translate-x-full w-72 shrink-0 z-[202] overflow-y-auto border-r border-white/10 flex-col py-4 px-3 md:ml-0 md:flex md:static md:h-screen md:translate-x-0 shadow-2xl shadow-black/20",

  variants: {
    collapsed: {
      true: "translate-x-0 ml-0 pt-20 [display:inherit] w-16 px-2",
    },
  },
});
export const Overlay = tv({
  base: "bg-black/20 backdrop-blur-sm fixed inset-0 z-[201] opacity-80 transition-all duration-300 ease-out md:hidden md:z-auto md:opacity-100",
});

export const Header = tv({
  base: "flex gap-3 items-center px-3 py-3 border-b border-white/5",
});

export const Body = tv({
  base: "flex flex-col gap-1 mt-4 px-1",
});

export const Footer = tv({
  base: "flex items-center justify-center gap-4 pt-4 pb-3 px-3 md:pt-3 md:pb-0 border-t border-white/5 mt-auto",
});

export const Sidebar = Object.assign(SidebarWrapper, {
  Header,
  Body,
  Overlay,
  Footer,
});
