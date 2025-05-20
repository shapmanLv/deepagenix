import { HTMLAttributes } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useLogin } from '@/services/login'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

type UserAuthFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z.object({
  username: z.string().min(1, { message: '请输入您的账号名称' }),
  password: z
    .string()
    .min(1, {
      message: '请输入您的密码',
    })
    .min(7, {
      message: '密码长度必须至少为 7 个字符',
    }),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const { setTokens } = useAuthStore()
  const navigate = useNavigate()

  const { mutateAsync: login, isPending } = useLogin()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const res = await login(data)
      if (!res.code) {
        setTokens({
          accessToken: res?.data.accessToken,
          refreshToken: res?.data.refreshToken,
        })
        toast.success('login success', {
          position: 'top-right',
          duration: 5000,
        })
        navigate({
          to: '/',
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>账户</FormLabel>
              <FormControl>
                <Input placeholder='请输入您的账号名称' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>密码</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              {/* <Link
                to='/forgot-password'
                className='text-muted-foreground absolute -top-0.5 right-0 text-sm font-medium hover:opacity-75'
              >
                忘记密码?
              </Link> */}
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isPending}>
          登录
        </Button>
      </form>
    </Form>
  )
}
