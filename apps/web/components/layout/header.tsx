'use client';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';

import { AuthDialog } from '../auth/auth-dialog';
import { UserMenu } from '../user/user-menu';
import { useEffect, useState } from 'react';

export function Header() {

  const [isLogin, setIsLogin] = useState(false);
  useEffect(()=> {
    const token = typeof window !== "undefined" ? localStorage.getItem("token"): null;
    setIsLogin(!!token);
  },[])

  return (
    <header className='w-full border-b bg-background'>
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4'>
        {/* 左侧Logo */}
        <Link href='/' className='text-lg font-bold'>
          EarnBot
        </Link>

        {/* 中间导航菜单 */}
        <NavigationMenu>
          <NavigationMenuList>
            
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                  <Link href='/'>Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href='/market'>Market</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href='/robots'>Robots</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href='/about'>About Us</Link>
              </NavigationMenuLink>
            </NavigationMenuItem> */}

          </NavigationMenuList>
        </NavigationMenu>

        {/* 右侧 用户/登陆 */}
        <div className='flex items-center gap-2'>
          { isLogin ? (<UserMenu />) : (<AuthDialog />) }
        </div>
      </div>
    </header>
  )
}