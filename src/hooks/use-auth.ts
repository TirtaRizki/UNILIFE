
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { User } from '@/lib/types';

// Define the type for the user object stored in session, which excludes the password.
type AuthUser = Omit<User, 'password'>;

export function useAuth() {
    const [user, setUserState] = useState<AuthUser | null>(null);
    const [isClient, setIsClient] = useState(false);

    // This function will be passed to consumers to allow them to update the auth state
    const setUser = (newUser: AuthUser | null) => {
        setUserState(newUser);
    };

    const updateUserFromStorage = useCallback(() => {
        if (typeof window !== 'undefined') {
            const userJson = sessionStorage.getItem('loggedInUser');
            if (userJson) {
                try {
                    const parsedUser: AuthUser = JSON.parse(userJson);
                     if (['Admin', 'Panitia'].includes(parsedUser.role)) {
                         setUserState(parsedUser);
                    } else {
                         setUserState(null);
                    }
                } catch (e) {
                    console.error("Failed to parse user from sessionStorage", e);
                    setUserState(null);
                    sessionStorage.removeItem('loggedInUser');
                }
            } else {
                setUserState(null);
            }
        }
    }, []);

    useEffect(() => {
        setIsClient(true);
        updateUserFromStorage();

        // This listener ensures that if login/logout happens in another tab,
        // this tab will update its auth state.
        const handleStorageChange = (event: StorageEvent) => {
            // We listen for both 'loggedInUser' and 'users' in case of profile updates
            if (event.key === 'loggedInUser' || event.key === 'users') {
                updateUserFromStorage();
            }
        };

        // This custom event listener can be triggered manually after login/logout
        // to ensure immediate UI updates.
        const handleSessionChange = () => {
            updateUserFromStorage();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('session', handleSessionChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('session', handleSessionChange);
        };
    }, [updateUserFromStorage]);

    const hasRole = useCallback((roles: Array<User['role']>) => {
        if (!isClient || !user) return false;
        return roles.includes(user.role);
    }, [user, isClient]);
    
    // Return the state and the setter function
    return { user, setUser, hasRole, isClient };
}
