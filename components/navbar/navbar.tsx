import { Input, Navbar, NavbarContent } from "@nextui-org/react";
import React from "react";
import { SearchIcon } from "../icons/searchicon";
import { BurguerButton } from "./burguer-button";
import { UserDropdown } from "./user-dropdown";
import { usePathname } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export const NavbarWrapper = ({ children }: Props) => {
  const pathname = usePathname();
  
  // Hide navbar completely for the generate route
  const shouldShowNavbar = pathname !== "/generate";

  if (!shouldShowNavbar) {
    return <>{children}</>;
  }

  return (
    <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden navbar-wrapper">
      <Navbar
        isBordered
        className="w-full navbar"
        classNames={{
          wrapper: "w-full max-w-full",
        }}
      >
        <NavbarContent className="md:hidden">
          <BurguerButton />
        </NavbarContent>
        <NavbarContent className="w-full max-md:hidden">
          <Input
            startContent={<SearchIcon />}
            isClearable
            className="w-full"
            classNames={{
              input: "w-full",
              mainWrapper: "w-full",
            }}
            placeholder="Search..."
          />
        </NavbarContent>
        <NavbarContent
          justify="end"
          className="w-fit data-[justify=end]:flex-grow-0"
        >
          <NavbarContent>
            <UserDropdown />
          </NavbarContent>
        </NavbarContent>
      </Navbar>
      {children}
    </div>
  );
};
