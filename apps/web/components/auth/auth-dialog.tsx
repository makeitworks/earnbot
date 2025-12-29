'use client'

import React, { useState } from "react";

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
import { signInApi, signUpApi } from "@/lib/api/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StateKeys } from "@/lib/state-key";


export function AuthDialog() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(isOpen: boolean)=> setOpen(isOpen) } >
      <DialogTrigger asChild>
        <Button variant='ghost'>Sign In / Sign Up</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[420px]" >
        <DialogHeader>
          <DialogTitle>
            { mode === "signin" ? "Sign In" : "Sign Up" }
          </DialogTitle>
        </DialogHeader>

        { mode === "signin" ? <SignInForm  onSuccess={()=> setOpen(false)} /> : <SignUpForm onSuccess={ ()=> setOpen(false)} /> }

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

function SignInForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: signInApi,
    onSuccess: (res) => {
      localStorage.setItem("token", res.token);
      
      queryClient.invalidateQueries({ queryKey: [StateKeys.USER_DATA] });

      onSuccess();
    },
    onError: (error: any) => {
      console.log(error);
    }
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate({ email, password });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Email</Label>
        <Input type="email" value={email} onChange={(e)=> setEmail(e.target.value)} placeholder="your@email.com" />
      </div>
      <div>
        <Label>Password</Label>
        <Input type="password" value={password} onChange={(e)=> setPassword(e.target.value)} placeholder="password" />
      </div>

      { mutation.isError && <p className="text-sm text-red-500">{ (mutation.error as any)?.message || 'signin failed' }</p> }

      <Button className="w-full" disabled={mutation.isPending} >
        {mutation.isPending ? "Sigining...": "SignIn"}
      </Button>
    </form>
  )
}

function SignUpForm({ onSuccess}: { onSuccess: ()=> void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const mutation = useMutation({
    mutationFn: signUpApi,
    onSuccess: (res) => {
      console.log('signUp success: ', res);
      onSuccess();
    },
    onError: (error: any) => {
      console.log(error);
    },
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate({ name, email, password });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input type="text" value={name} onChange={ e => setName(e.target.value) } placeholder="your name" />
      </div>
      <div>
        <Label>Email</Label>
        <Input type="email" value={email} onChange={ e => setEmail(e.target.value)} placeholder="your@email.com" />
      </div>
      <div>
        <Label>Password</Label>
        <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="your password" />
      </div>
      { mutation.isError && <p className="text-sm text-red-500">{ (mutation.error as any)?.message || 'signup failed'}</p> }
      <Button className="w-full" disabled={mutation.isPending}>
        { mutation.isPending ? "Signing Up ....": "Sign Up"}
      </Button>
    </form>
  )
}