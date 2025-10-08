import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarItem,
} from "@nextui-org/react";
import React, { useCallback } from "react";
import { DarkModeSwitch } from "./darkmodeswitch";
import { useRouter } from "next/navigation";
import { deleteAuthCookie } from "@/actions/auth.action";
import { User } from "lucide-react";

export const UserDropdown = () => {
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    await deleteAuthCookie();
    router.replace("/login");
  }, [router]);

  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <Avatar
            as='button'
            color='secondary'
            size='md'
            icon={<User className="w-5 h-5" />}
          />
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu
        aria-label='User menu actions'
        onAction={(actionKey) => {
          // Handle user menu actions
          if (actionKey === 'logout') {
            // Handle logout logic here
          }
        }}>
        <DropdownItem
          key='profile'
          className='flex flex-col justify-start w-full items-start'>
          <p>Signed in as</p>
          <p>zoey@example.com</p>
        </DropdownItem>
        <DropdownItem key='settings'>My Settings</DropdownItem>
        <DropdownItem key='team_settings'>Team Settings</DropdownItem>
        <DropdownItem key='analytics'>Analytics</DropdownItem>
        <DropdownItem key='system'>System</DropdownItem>
        <DropdownItem key='configurations'>Configurations</DropdownItem>
        <DropdownItem key='help_and_feedback'>Help & Feedback</DropdownItem>
        <DropdownItem
          key='logout'
          color='danger'
          className='text-danger'
          onPress={handleLogout}>
          Log Out
        </DropdownItem>
        <DropdownItem key='switch'>
          <DarkModeSwitch />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
