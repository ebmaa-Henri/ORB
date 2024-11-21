const db = require('../config/db');

const User = {

  // Find user by email
  findByEmail: (email, callback) => {
    let query = `SELECT * FROM users WHERE email = ?`;
    db.query(query, [email], (err, results) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, results[0]);
      }
    });
  },

  // Create new user
  createUser: (userData, callback) => {
    const { email, password, name, surname, role, address, tell_nr, doctorDetails } = userData;

    let query = `INSERT INTO users (email, password, name, surname, role) VALUES (?, ?, ?, ?, ?)`;
    db.query(query, [email, password, name, surname, role], (err, result) => {
      if (err) return callback(err, null);

      const userId = result.insertId;

      if (role === 'doctor' && doctorDetails) {
        // If the user is a doctor, insert only into doctor_details
        const { registration_nr, practice_nr, tell_nr, doctor_type } = doctorDetails;
        const doctorDetailsQuery = `INSERT INTO doctor_details (user_id, registration_nr, practice_nr, tell_nr, doctor_type) VALUES (?, ?, ?, ?, ?)`;

        db.query(doctorDetailsQuery, [userId, registration_nr, practice_nr, tell_nr, doctor_type], (err) => {
          if (err) return callback(err, null);
          callback(null, { userId });
        });
      } else {
        // For non-doctor roles, insert into user_details
        const userDetailsQuery = `INSERT INTO user_details (user_id, address, tell_nr) VALUES (?, ?, ?)`;

        db.query(userDetailsQuery, [userId, address, tell_nr], (err) => {
          if (err) return callback(err, null);
          callback(null, { userId });
        });
      }
    });
  },

}

module.exports = User;
