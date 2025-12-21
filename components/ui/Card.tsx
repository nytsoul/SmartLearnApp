import { View, Text, ViewProps } from 'react-native';
import { cn } from '@/lib/utils';

interface CardProps extends ViewProps {
    variant?: 'default' | 'glass' | 'outline';
}

export function Card({ className, variant = 'default', children, ...props }: CardProps) {
    return (
        <View
            className={cn(
                'rounded-xl p-6',
                {
                    'bg-card shadow-sm': variant === 'default',
                    'glass-card': variant === 'glass',
                    'border border-border bg-transparent': variant === 'outline',
                },
                className
            )}
            {...props}
        >
            {children}
        </View>
    );
}

export function CardHeader({ className, children, ...props }: ViewProps) {
    return (
        <View className={cn('flex flex-col space-y-1.5 pb-4', className)} {...props}>
            {children}
        </View>
    );
}

export function CardTitle({ className, children, ...props }: ViewProps) { // Using ViewProps for text container or TextProps if direct text
    // Assuming children is text mostly, but View for structure
    return (
        <Text className={cn('text-2xl font-semibold leading-none tracking-tight text-card-foreground', className)} {...props}>
            {children}
        </Text>
    );
}

export function CardContent({ className, children, ...props }: ViewProps) {
    return (
        <View className={cn('p-0', className)} {...props}>
            {children}
        </View>
    );
}

export function CardFooter({ className, children, ...props }: ViewProps) {
    return (
        <View className={cn('flex flex-row items-center pt-4', className)} {...props}>
            {children}
        </View>
    );
}
