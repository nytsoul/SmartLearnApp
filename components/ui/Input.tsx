import * as React from 'react';
import { TextInput, View, Text } from 'react-native';

import { cn } from '@/lib/utils';

export interface InputProps
    extends React.ComponentPropsWithoutRef<typeof TextInput> {
    label?: string;
    error?: string;
}

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <View className="mb-4 w-full">
                {label && <Text className="mb-1 text-sm font-medium text-foreground">{label}</Text>}
                <TextInput
                    className={cn(
                        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                        className
                    )}
                    ref={ref}
                    placeholderTextColor="#666"
                    {...props}
                />
                {error && <Text className="mt-1 text-xs text-red-500">{error}</Text>}
            </View>
        );
    }
);
Input.displayName = 'Input';

export { Input };
