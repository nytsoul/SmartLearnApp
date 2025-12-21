import { type VariantProps, cva } from 'class-variance-authority';
import { Text, TouchableOpacity } from 'react-native';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'flex items-center justify-center rounded-md font-medium disabled:opacity-50 disabled:pointer-events-none',
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground',
                destructive: 'bg-destructive text-destructive-foreground',
                outline: 'border border-input bg-background',
                secondary: 'bg-secondary text-secondary-foreground',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                link: 'text-primary underline-offset-4',
                glass: 'glass text-foreground hover:bg-white/20',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 rounded-md px-3',
                lg: 'h-11 rounded-md px-8',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

interface ButtonProps
    extends React.ComponentPropsWithoutRef<typeof TouchableOpacity>,
    VariantProps<typeof buttonVariants> {
    label?: string; // Add label prop usage if needed, or just use children
    children?: React.ReactNode;
}

function Button({ className, variant, size, children, ...props }: ButtonProps) {
    return (
        <TouchableOpacity
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        >
            {typeof children === 'string' ? (
                <Text className={cn({
                    'text-primary-foreground': variant === 'default',
                    'text-destructive-foreground': variant === 'destructive',
                    'text-secondary-foreground': variant === 'secondary',
                    'text-primary': variant === 'link' || variant === 'outline' || variant === 'ghost',
                    'text-foreground': variant === 'glass'
                })}>
                    {children}
                </Text>
            ) : (
                children
            )}
        </TouchableOpacity>
    );
}

export { Button, buttonVariants };
