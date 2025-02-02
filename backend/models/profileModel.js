const db = require('../config/db');
const queries = require('./queries/profileQueries');


const Profile = {

    // COUNT(DISTINCT a.account_id) AS total_accounts,
    // COUNT(DISTINCT ppm.record_id) AS total_dependents,
    // COUNT(DISTINCT i.invoice_id) AS total_invoices

  allProfiles: async () => {
      try {
        const [results] = await db.query(queries.allProfiles);
        return results;
      } catch (err) {
        throw err;
      }
    },

  // Refactor `oneProfile` to use promises and async/await
  oneProfile: async (profileId) => {
    try {
      const [dependentsResults] = await db.query(queries.dependentsQuery, [profileId]);
      const [accountsResults] = await db.query(queries.accQuery, [profileId]);
      const [invoicesResults] = await db.query(queries.invQuery, [profileId]);
      const [profileResults] = await db.query(queries.profQuery, [profileId]);

      return {
        dependents: dependentsResults.length > 0 ? dependentsResults : [],
        accounts: accountsResults,
        invoices: invoicesResults,
        profileData: profileResults[0],
      };
    } catch (err) {
      throw err;
    }
  },

};


module.exports = Profile;
