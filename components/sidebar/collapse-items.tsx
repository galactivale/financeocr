"use client";
import React, { useState, useEffect } from "react";
import { ChevronDownIcon } from "../icons/sidebar/chevron-down-icon";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import clsx from "clsx";

interface CollapseItem {
  name: string;
  href: string;
}

interface Props {
  icon: React.ReactNode;
  title: string;
  items: CollapseItem[];
  isActive?: boolean;
}

export const CollapseItems = ({ icon, items, title, isActive = false }: Props) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Auto-expand if any item is active
  useEffect(() => {
    if (isActive) {
      setOpen(true);
    }
  }, [isActive]);

  return (
    <div className="flex gap-4 h-full items-center cursor-pointer">
      <Accordion className="px-0" defaultExpandedKeys={isActive ? ["1"] : []}>
        <AccordionItem
          key="1"
          indicator={<ChevronDownIcon />}
          classNames={{
            indicator: "data-[open=true]:-rotate-180 text-gray-400 transition-transform duration-300 ease-out",
            trigger:
              "py-0 min-h-[36px] hover:bg-white/5 hover:backdrop-blur-sm hover:border hover:border-white/10 rounded-lg active:scale-[0.98] transition-all duration-300 ease-out px-3 border border-transparent",

            title:
              "px-0 flex text-sm gap-3 h-full items-center cursor-pointer",
          }}
          aria-label="Accordion 1"
          title={
            <div className="flex flex-row gap-3 items-center">
              <div className="w-5 h-5 flex items-center justify-center [&_svg_path]:fill-gray-400 [&_svg]:text-gray-400">
                {icon}
              </div>
              <span className="text-gray-300 font-medium">{title}</span>
            </div>
          }
        >
          <div className="pl-6 mt-1 space-y-1">
            {items.map((item, index) => (
              <NextLink
                key={index}
                href={item.href}
                className={clsx(
                  "w-full flex text-sm transition-all duration-300 ease-out py-1.5 px-2.5 rounded-md cursor-pointer border border-transparent",
                  pathname === item.href 
                    ? "text-white bg-white/10 backdrop-blur-sm border-white/20 shadow-md shadow-white/5" 
                    : "text-gray-400 hover:text-white hover:bg-white/5 hover:backdrop-blur-sm hover:border-white/10"
                )}
              >
                {item.name}
              </NextLink>
            ))}
          </div>
        </AccordionItem>
      </Accordion>
      {/* <Accordion
        title={
          <div
            className="flex items-center justify-between w-full py-5 px-7 rounded-8 transition-all duration-150 ease-in-out cursor-pointer hover:bg-accents2 active:scale-98"
            // css={{
            //   gap: "$6",
            //   width: "100%",
            //   py: "$5",
            //   px: "$7",
            //   borderRadius: "8px",
            //   transition: "all 0.15s ease",
            //   "&:active": {
            //     transform: "scale(0.98)",
            //   },
            //   "&:hover": {
            //     bg: "$accents2",
            //   },
            // }}
            // justify={"between"}
            onClick={handleToggle}
          >
            <div className="flex gap-4">
              {icon}
              <span
                className="text-default-900 font-medium text-base"
                //  span
                //  weight={"normal"}
                //  size={"$base"}
                //  css={{
                //    color: "$accents9",
                //  }}
              >
                {title}
              </span>
            </div>

            <ChevronUpIcon
              className={clsx(
                open ? "rotate-180" : "rotate-0",
                "transition-all duration-300 ease-in-out transform"
              )}
              //   css={{
              //     transition: "transform 0.3s ease",
              //     transform: open ? "rotate(-180deg)" : "rotate(0deg)",
              //   }}
            />
          </div>
        }
        //   css={{
        //     width: "100%",
        //     "& .nextui-collapse-view": {
        //       p: "0",
        //     },
        //     "& .nextui-collapse-content": {
        //       marginTop: "$1",
        //       padding: "0px",
        //     },
        //   }}
        divider={false}
        showArrow={false}
      >
        {items.map((item, index) => (
          <div
            className="flex flex-col pl-8"
            key={index}
            // direction={"column"}
            // css={{
            //   paddingLeft: "$16",
            // }}
          >
            <span
              className="text-default-400 font-normal text-md"
              //   span
              //   weight={"normal"}
              //   size={"$md"}
              //   css={{
              //     color: "$accents8",
              //     cursor: "pointer",
              //     "&:hover": {
              //       color: "$accents9",
              //     },
              //   }}
            >
              {item}
            </span>
          </div>
        ))}
      </Accordion> */}
    </div>
  );
};
