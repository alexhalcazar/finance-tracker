import db from '../db.js';

// passed in user object is inserted into the "users" table
export const insertUser = async (userObj) => {
    try {
        // returns a list, therefore grab the only user
        const [newUser] = await db('users').insert(userObj, [
            'user_id',
            'username',
            'email',
            'password_hash',
            'created_at',
            'updated_at'
        ]);
        return newUser;
    } catch (error) {
        console.error('error inserting new user into users table');
        throw error;
    }
};

// passed in updates object will update "users" table fields
export const updateUserById = async (updates) => {
    const { id, ...changes } = updates;
    // returning expects an array of strings
    const returnFields = Object.keys(changes);
    try {
        const [updatedUser] = await db('users')
            .where({ id })
            .update(updates)
            .returning(['id', ...returnFields]);
        return updatedUser;
    } catch (error) {
        console.error(`error updating user id:${id} in users table`);
    }
};

// passed in user id will be deleted from "users" table
export const deleteUserById = async (id) => {
    try {
        const [deletedUser] = await db('users')
            .where({ id })
            .del()
            .returning('*');
        return deletedUser;
    } catch (error) {
        console.error(`user id:${id}`);
    }
};

// selects user id from "users" table
export const selectUserById = async (id) => {
    try {
        const user = await db
            .select()
            .table('users')
            .where({ id })
            .returning('*');
        return user;
    } catch (error) {
        console.error(`error while trying to select user id:${id}`);
    }
};
