const pool = require('./pool');
const bcrypt = require('bcryptjs');

module.exports.getAllUsers = async function getAllUsers() {
    try {
        const { rows } = await pool.query("SELECT * FROM users;");
        return rows;
    } catch (error) {
        console.error('Error getting users: ', error);
        throw error;
    }
};

module.exports.insertUser = async function insertUser(username, password) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *;',
            [username, hashedPassword]
        );
    } catch (error) {
        console.error('Error inserting user: ', error);
        throw error;
    }
}

module.exports.deleteUsers = async function deleteUsers() {
    await pool.query("DELETE FROM users;");
}