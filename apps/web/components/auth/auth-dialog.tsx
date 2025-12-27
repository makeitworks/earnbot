'use client'

import { useState } from "react";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function AuthDialog() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='ghost'>Sign In / Sign Up</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[420px]" >
        <DialogHeader>
          <DialogTitle>
            { mode === "signin" ? "Sign In" : "Sign Up" }
          </DialogTitle>
        </DialogHeader>

        { mode === "signin" ? <SignInForm /> : <SignUpForm /> }

        <div className="text-center text-sm text-muted-foreground">
          { mode === "signin" ? (
            <>
              no account yet?{' '}
              <button className="text-blue-500 hover:underline" onClick={ ()=> setMode('signup')}>Sign Up</button>
            </>
          ) : (
            <>
              already have an account?{' '}
              <button className="text-blue-500 hover:underline" onClick={ ()=> setMode('signin')}>Sign In</button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function SignInForm() {
  return (
    <form className="space-y-4">
      <div>
        <Label>Email</Label>
        <Input type="email" placeholder="your@email.com" />
      </div>
      <div>
        <Label>Password</Label>
        <Input type="password" placeholder="your password" />
      </div>
      <Button className="w-full">Sign In</Button>
    </form>
  )
}

function SignUpForm() {
  return (
    <form className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input type="text" placeholder="your name" />
      </div>
      <div>
        <Label>Email</Label>
        <Input type="email" placeholder="your@email.com" />
      </div>
      <div>
        <Label>Password</Label>
        <Input type="password" placeholder="your password" />
      </div>
      <Button className="w-full">Sign Up</Button>
    </form>
  )
}