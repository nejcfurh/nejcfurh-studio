'use client';

import Button from '@/app/components/Button';
import Input from '@/app/components/inputs/Input';
import LoadingModal from '@/app/components/LoadingModal';
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { BsFacebook, BsGithub, BsGoogle } from 'react-icons/bs';

import AuthSocialButton from './AuthSocialButton';

type Variant = 'LOGIN' | 'REGISTER';

interface AuthFormProps {
  setRegister: Dispatch<SetStateAction<boolean>>;
}

const AuthForm: React.FC<AuthFormProps> = ({ setRegister }) => {
  const session = useSession();
  const router = useRouter();
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = session?.status === 'authenticated';

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/conversations');
    }
  }, [isAuthenticated, router]);

  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') {
      setVariant('REGISTER');
      setRegister(true);
    } else {
      setVariant('LOGIN');
      setRegister(false);
    }
  }, [variant, setRegister]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if (variant === 'REGISTER') {
      axios
        .post('/api/register', data)
        .then(() => signIn('credentials', data))
        .catch(() => toast.error('Something went wrong!'))
        .finally(() => setIsLoading(false));
    }

    if (variant === 'LOGIN') {
      signIn('credentials', {
        ...data,
        redirect: false
      })
        .then(() => {
          toast.success('Logged in!');
          router.push('/conversations');
        })
        .catch(() => {
          toast.error('Invalid credentials!');
        })
        .finally(() => setIsLoading(false));
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);
    // NEXT AUTH SocialSignIn
    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error('Invalid credentials!');
        }

        if (callback?.ok && !callback.error) {
          toast.success('Logged in!');
          router.push('/users');
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      {isLoading ? <LoadingModal /> : null}
      <div className="mx-auto mt-6 sm:mt-8 sm:w-full sm:max-w-md">
        <div className="rounded-lg bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          {/* To get data from react-hook-form we need to wrap our onSubmit into handleSubmit from react-hook-form */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {variant === 'REGISTER' && (
              <Input
                label="Name"
                register={register}
                id="name"
                errors={errors}
                disabled={isLoading}
              />
            )}
            <Input
              label="Email"
              register={register}
              id="email"
              errors={errors}
              type="email"
              disabled={isLoading}
            />
            <Input
              label="Password"
              register={register}
              id="password"
              errors={errors}
              type="password"
              disabled={isLoading}
            />
            <div>
              <Button disabled={isLoading} fullWidth type="submit">
                {variant === 'LOGIN' ? 'Sign in' : 'Register'}
              </Button>
            </div>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <AuthSocialButton
                icon={BsGithub}
                onClick={() => socialAction('github')}
              />
              <AuthSocialButton
                icon={BsGoogle}
                onClick={() => socialAction('google')}
              />
              <AuthSocialButton
                icon={BsFacebook}
                onClick={() => socialAction('facebook')}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-center gap-2 px-2 text-sm text-gray-500">
            <div>
              {variant === 'LOGIN'
                ? 'No twabblr account?'
                : 'Already have an account?'}
            </div>
            <div
              onClick={toggleVariant}
              className="cursor-pointer font-medium text-gray-600 underline"
            >
              {variant === 'LOGIN' ? 'Create it!' : 'Sign in!'}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthForm;
