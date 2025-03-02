import { LoginForm } from '@/login/login-form';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/login')({
  component: LoginForm,
});
