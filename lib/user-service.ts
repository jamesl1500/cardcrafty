/**
 * User Service
 * 
 * This service provides functions to interact with user data in the database.
 * It includes methods to fetch user details by their unique identifier.
 * 
 * Functions:
 * - getUserById: Fetches a user by their ID.
 * 
 * @module lib/user-service
 */
import { supabaseAdmin } from '@/lib/supabase';

/**
 * getUserById
 * 
 * Fetch a user by their unique identifier.
 * 
 * @param id - The unique identifier of the user
 * @returns The user object if found, otherwise throws an error
 */
export async function getUserById(id: string) {
    const { data: user, error } = await supabaseAdmin.auth.admin.getUserById(id);

    if (error) {
        throw new Error(`Failed to fetch user: ${error.message}`);
    }

    return user.user;
}