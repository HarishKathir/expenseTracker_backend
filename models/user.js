// User model
const pool = require('../config/dbConfig');

const User = {
    create: (userData, callback) => {
        const sql = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id`;
        pool.query(sql, [userData.username, userData.email, userData.password], (err, result) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, result.rows[0].id);
            }
        });
    },
    findByEmail: (email, callback) => {
        const sql = `SELECT * FROM users WHERE email = $1`;
        pool.query(sql, [email], (err, result) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, result.rows[0]);
            }
        });
    },
    findById: (id, callback) => {
        const sql = `SELECT * FROM users WHERE id = $1`;
        pool.query(sql, [id], (err, result) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, result.rows[0]);
            }
        });
    }
};

module.exports = User;
