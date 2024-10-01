"use client"

import * as React from "react"
import Link from "next/link"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import Timer from "./timer"

export function NavigationMenuDemo() {
  return (
    <NavigationMenu className='min-w-full flex justify-between p-5 items-center'>
      <NavigationMenuList className='min-w-full'>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className='text-xl'>
              Massachusetts CSL Practice
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
      <Timer />
    </NavigationMenu>
  )
}
