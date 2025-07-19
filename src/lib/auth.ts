
import type { User } from './types';

// In a real-world scenario with a proper auth system (like JWT or Next-Auth),
// you would get a session token from the request headers, verify it against a secret key,
// and then fetch the user's data from the database based on the token's payload (e.g., user ID).

// This function simulates that process in a simplified way for this project.
// It checks a custom header 'x-user-id' which we will assume is securely set
// by a trusted client (the CMS) after a successful login.

// This is a placeholder for real database interaction.
const HARDCODED_USERS: User[] = [
    { id: 'default-admin', email: 'admin@unilifefest.com', password: 'unilifejaya123', role: 'Admin', name: 'Super Admin', phoneNumber: '08001234567' },
    { id: 'default-panitia', email: 'panitia2025@unilife.com', password: 'lampungfest123', role: 'Panitia', name: 'Panitia 2025', phoneNumber: '08119876543' }
];

const findUserById = (userId: string): User | undefined => {
    // In a real app, this would be: await db.collection('users').doc(userId).get();
    return HARDCODED_USERS.find(u => u.id === userId);
};


export async function getAuthenticatedUser(request: Request): Promise<Omit<User, 'password'> | null> {
    try {
        const userId = request.headers.get('x-user-id');

        if (!userId) {
            // No user ID in header, so they are not authenticated.
            return null;
        }

        // Simulate fetching the user from a database using the ID.
        const user = findUserById(userId);

        if (!user) {
            // User ID was provided, but no such user exists.
            return null;
        }
        
        // Return the user object without the password hash.
        const { password, ...userToReturn } = user;
        return userToReturn;

    } catch (error) {
        console.error("Authentication error:", error);
        return null;
    }
}
