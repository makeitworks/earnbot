import Link from 'next/link';
import { Button} from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';

export function Header() {
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
                <Link href='/strategy'>Strategy</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href='/about'>About Us</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

          </NavigationMenuList>
        </NavigationMenu>

        {/* 右侧 用户/登陆 */}
        <div className='flex items-center gap-2'>
          <Button variant='ghost'>Login</Button>
          <Button>Register</Button>
        </div>
      </div>
    </header>
  )
}