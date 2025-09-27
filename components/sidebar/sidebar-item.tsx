import NextLink from "next/link";
import React from "react";
import { useSidebarContext } from "../layout/layout-context";
import clsx from "clsx";

interface Props {
  title: string;
  icon: React.ReactNode;
  isActive?: boolean;
  href?: string;
}

export const SidebarItem = ({ icon, title, isActive, href = "" }: Props) => {
  const { collapsed, setCollapsed } = useSidebarContext();

  const handleClick = () => {
    if (window.innerWidth < 768) {
      setCollapsed();
    }
  };
  return (
    <NextLink
      href={href}
      className="text-white active:bg-none max-w-full"
    >
      <div
        className={clsx(
          isActive
            ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-l-2 border-blue-500 [&_svg_path]:fill-white [&_svg]:text-white shadow-lg"
            : "hover:bg-white/8 [&_svg_path]:fill-gray-400 [&_svg]:text-gray-400 hover:border-l-2 hover:border-white/20",
          "flex gap-3 w-full min-h-[40px] h-full items-center px-4 rounded-r-lg cursor-pointer transition-all duration-300 active:scale-[0.98] group border-l-2 border-transparent"
        )}
        onClick={handleClick}
      >
        <div className="w-5 h-5 flex items-center justify-center">
          {icon}
        </div>
        <span className={clsx(
          "text-sm font-medium transition-colors duration-300",
          isActive ? "text-white" : "text-gray-300 group-hover:text-white"
        )}>{title}</span>
      </div>
    </NextLink>
  );
};
