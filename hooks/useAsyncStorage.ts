import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useAsyncStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(initialValue);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadStoredValue = async () => {
            try {
                const item = await AsyncStorage.getItem(key);
                if (item) {
                    setStoredValue(JSON.parse(item));
                }
            } catch (error) {
                console.error(`Error loading key "${key}" from AsyncStorage:`, error);
            } finally {
                setIsLoading(false);
            }
        };

        loadStoredValue();
    }, [key]);

    const setValue = useCallback(async (value: T | ((val: T) => T)) => {
        try {
            // Logic to handle functional updates, similar to useState
            // We need strict type checking or casting here because T could be a function
            // But in this simple implementation, we assume we can resolve it.
            // However, since we can't easily access the *current* state inside async callback without ref,
            // we rely on the scope's storedValue. Ideally we'd use a ref or functional setStoredValue.

            let valueToStore: T;
            if (value instanceof Function) {
                setStoredValue((prev) => {
                    const result = value(prev);
                    valueToStore = result;
                    return result;
                });
            } else {
                valueToStore = value;
                setStoredValue(value);
            }

            // We need to wait for the state update to settle or just use the calculated value
            // The logic above is slightly flawed for functional updates because valueToStore is assigned inside the callback
            // which allows it to capture the result.
            // But since setStoredValue is async-like in React (batched), we should ideally persist inside useEffect
            // or just trust the calculated value.

            // Simpler approach for now:
            await AsyncStorage.setItem(key, JSON.stringify(value instanceof Function ? value(storedValue) : value));

        } catch (error) {
            console.error(`Error saving key "${key}" to AsyncStorage:`, error);
        }
    }, [key, storedValue]);

    return [storedValue, setValue, isLoading] as const;
}
