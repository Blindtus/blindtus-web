'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import Loader from '@/components/Loader/Loader';
import { PasswordInput } from '@/components/ui-custom/InputPassword';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useUserContext } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useLoginAccount } from '@/lib/react-query/AuthQueries';
import { SigninValidation } from '@/lib/validations/auth';

const SignIn = () => {
  const __ = useTranslations('');
  const router = useRouter();
  const [redirect] = useQueryState('redirect');
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const { mutateAsync: signInAccount, isPending: isSigningInAccount } = useLoginAccount();

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const isLoading = useMemo(
    () => isUserLoading || isSigningInAccount,
    [isUserLoading, isSigningInAccount],
  );

  const onSubmit = async (user: z.infer<typeof SigninValidation>) => {
    try {
      const session = await signInAccount({
        email: user.email,
        password: user.password,
      });

      if (!session) {
        toast({
          title: __('!text:failed-signin'), // Failed to sign in
          variant: 'destructive',
        });

        return;
      }

      const isLoggedIn = await checkAuthUser();

      if (!isLoggedIn) {
        toast({
          title: __('!text:failed-authenticate'), // Failed to authenticate the user
          variant: 'destructive',
        });

        return;
      }

      form.reset();

      router.push(redirect || '/');
    } catch (error) {
      toast({
        title: (error as Error).message as string,
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <div className="page-title">{__('!text:signin-title')}</div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{__('!noun:email')}</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>{__('!noun:password')}</FormLabel>
                  <Link href="/forgot-password" className="text-sm text-purple-300">
                    {__('!text:forgot-password')}
                  </Link>
                </div>
                <FormControl>
                  <PasswordInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader /> : __('!noun:signin')}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SignIn;
