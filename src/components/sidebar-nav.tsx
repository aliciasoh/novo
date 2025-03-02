import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Link, LinkProps, useRouterState } from '@tanstack/react-router';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    to: LinkProps['to'];
    title: string;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const router = useRouterState();

  return (
    <nav
      className={cn('flex space-x-2 flex-col space-x-0 space-y-1', className)}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={cn(
            'w-[80%]',
            buttonVariants({ variant: 'ghost' }),
            router.location.pathname === item.to
              ? 'bg-muted hover:bg-muted'
              : 'hover:bg-transparent hover:underline',
            'justify-start'
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
