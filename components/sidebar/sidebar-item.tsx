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
            ? "bg-white/10 [&_svg_path]:fill-white [&_svg]:text-white"
            : "hover:bg-white/5 [&_svg_path]:fill-gray-400 [&_svg]:text-gray-400",
          "flex gap-3 w-full min-h-[36px] h-full items-center px-3 rounded-lg cursor-pointer transition-all duration-200 active:scale-[0.98] group"
        )}
        onClick={handleClick}
      >
        <div className="w-4 h-4 flex items-center justify-center">
          {icon}
        </div>
        <span className={clsx(
          "text-sm font-medium transition-colors duration-200",
          isActive ? "text-white" : "text-gray-300 group-hover:text-white"
        )}>{title}</span>
      </div>
    </NextLink>
  );
};
