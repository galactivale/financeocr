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
            ? "bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg shadow-white/5 [&_svg_path]:fill-white [&_svg]:text-white"
            : "hover:bg-white/5 hover:backdrop-blur-sm hover:border hover:border-white/10 [&_svg_path]:fill-gray-400 [&_svg]:text-gray-400 hover:[&_svg_path]:fill-white hover:[&_svg]:text-white",
          "flex gap-3 w-full min-h-[36px] h-full items-center px-3 rounded-lg cursor-pointer transition-all duration-300 ease-out active:scale-[0.98] group border border-transparent hover:shadow-md hover:shadow-white/5"
        )}
        onClick={handleClick}
      >
        <div className="w-5 h-5 flex items-center justify-center">
          {icon}
        </div>
        <span className={clsx(
          "text-sm font-medium transition-all duration-300 ease-out",
          isActive ? "text-white" : "text-gray-300 group-hover:text-white"
        )}>{title}</span>
      </div>
    </NextLink>
  );
};
