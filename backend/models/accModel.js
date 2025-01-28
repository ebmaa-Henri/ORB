const db = require('../config/db');

const Account = {
  allAccounts: (callback) => {
    const query = `
      SELECT 
        a.account_id,
        CONCAT('Dr ', LEFT(d.first, 1), ' ', d.last) AS client_name,
        d.practice_nr,
        CONCAT(pr_dep.title, ' ', pr_dep.first, ' ', pr_dep.last) AS patient_name,
        ppm.dependent_nr AS patient_dependent_number, -- Add dependent number
        CONCAT(pr_main.title, ' ', pr_main.first, ' ', pr_main.last) AS member_name,
        pr_main.id_nr AS main_member_id,
        COUNT(i.invoice_id) AS total_invoices,
        CONCAT('R ', FORMAT(SUM(i.balance), 2)) AS total_invoice_balance
      FROM accounts a
      LEFT JOIN profiles p ON a.profile_id = p.profile_id
      LEFT JOIN clients d ON a.client_id = d.client_id
      LEFT JOIN person_records pr_main ON a.main_member_id = pr_main.person_id
      LEFT JOIN person_records pr_dep ON a.patient_id = pr_dep.person_id
      LEFT JOIN profile_person_map ppm 
        ON ppm.profile_id = p.profile_id AND ppm.person_id = a.patient_id
      LEFT JOIN invoices i ON a.account_id = i.account_id
      GROUP BY 
        a.account_id, 
        d.client_id, 
        d.practice_nr, 
        pr_main.person_id, 
        pr_dep.person_id,
        ppm.dependent_nr;
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  clientAccounts: (clientId, callback) => {
        //         COUNT(i.invoice_id) AS total_invoices,
    const query = `
      SELECT 
        a.account_id,
        CONCAT(pr_dep.title, ' ', pr_dep.first, ' ', pr_dep.last) AS patient_name,
        ppm.dependent_nr AS patient_dependent_number,
        CONCAT(pr_main.title, ' ', pr_main.first, ' ', pr_main.last) AS member_name,
        pr_main.id_nr AS main_member_id,
        CONCAT('R ', FORMAT(SUM(i.balance), 2)) AS total_invoice_balance
      FROM accounts a
      LEFT JOIN profiles p ON a.profile_id = p.profile_id
      LEFT JOIN clients d ON a.client_id = d.client_id
      LEFT JOIN person_records pr_main ON a.main_member_id = pr_main.person_id
      LEFT JOIN person_records pr_dep ON a.patient_id = pr_dep.person_id
      LEFT JOIN profile_person_map ppm 
        ON ppm.profile_id = p.profile_id AND ppm.person_id = a.patient_id
      LEFT JOIN invoices i ON a.account_id = i.account_id
      WHERE d.client_id = ?
      GROUP BY 
        a.account_id, 
        d.client_id, 
        d.practice_nr, 
        pr_main.person_id, 
        pr_dep.person_id,
        ppm.dependent_nr;

    `;
  

    db.query(query, [clientId], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  oneAccount: (accountId, callback) => {
    const accQuery = `
      SELECT
        a.account_id,
        a.profile_id,
        a.client_id,
        a.main_member_id,
        a.patient_id,
        CONCAT('Dr ', LEFT(d.first, 1), ' ', d.last) AS client_name,
        p.authorization_nr,
        p.medical_aid_nr, 
        mp.plan_name,
        mp.plan_code,
        ma.name AS medical_aid_name
      FROM accounts a
      LEFT JOIN clients d ON a.client_id = d.client_id
      LEFT JOIN profiles p ON a.profile_id = p.profile_id
      LEFT JOIN medical_aid_plans mp ON p.plan_id = mp.plan_id
      LEFT JOIN medical_aids ma ON p.medical_aid_id = ma.medical_aid_id
      WHERE a.account_id = ?;
    `;

    const memberQuery = `
      SELECT 
        pr.person_id,
        CONCAT(pr.title, ' ', pr.first, ' ', pr.last) AS member_name,
        pr.cell_nr AS member_cell, 
        pr.tell_nr AS member_tell, 
        pr.email AS member_email,
        DATE_FORMAT(pr.date_of_birth, '%Y-%m-%d') AS date_of_birth,
        pr.gender,
        ppm.dependent_nr
      FROM person_records pr
      LEFT JOIN profile_person_map ppm ON pr.person_id = ppm.person_id
      WHERE pr.person_id = ?;
    `;

    // Query for member addresses
    const memberAddresses = `
      SELECT 
        ad.address_id,
        ad.is_domicilium,
        ad.address
      FROM addresses ad
      WHERE ad.person_id = ?;
    `;

    const patientQuery = `
      SELECT 
        pr.person_id,
        CONCAT(pr.title, ' ', pr.first, ' ', pr.last) AS patient_name,
        pr.cell_nr AS patient_cell, 
        pr.tell_nr AS patient_tell, 
        pr.email AS patient_email,
        DATE_FORMAT(pr.date_of_birth, '%Y-%m-%d') AS date_of_birth,
        pr.gender,
        ppm.dependent_nr
      FROM person_records pr
      LEFT JOIN profile_person_map ppm ON pr.person_id = ppm.person_id
      WHERE pr.person_id = ?;
    `;

    // Query for patient addresses
    const patientAddresses = `
      SELECT 
        ad.address_id,
        ad.is_domicilium,
        ad.address
      FROM addresses ad
      WHERE ad.person_id = ?;
    `;

    const invQuery = `
      SELECT
        i.invoice_id,
        CONCAT(JSON_UNQUOTE(JSON_EXTRACT(i.patient_snapshot, '$.patient.first')), ' ', JSON_UNQUOTE(JSON_EXTRACT(i.patient_snapshot, '$.patient.last'))) AS 'Patient Name',
        JSON_UNQUOTE(JSON_EXTRACT(i.patient_snapshot, '$.patient.id_nr')) AS 'Patient ID',
        CONCAT(JSON_UNQUOTE(JSON_EXTRACT(i.member_snapshot, '$.member.first')), ' ', JSON_UNQUOTE(JSON_EXTRACT(i.member_snapshot, '$.member.last'))) AS 'Member Name',
        JSON_UNQUOTE(JSON_EXTRACT(i.member_snapshot, '$.member.id_nr')) AS 'Member ID',
        CONCAT('R ', FORMAT(i.balance, 2)) AS invoice_balance,
        DATE_FORMAT(i.date_of_service , '%Y-%m-%d') AS date_of_service,
        i.status AS 'Status'
      FROM invoices i
      JOIN accounts a ON i.account_id = a.account_id
      WHERE i.account_id = ?
    `;

    db.query(accQuery, [accountId], (err, accResults) => {
        if (err) return callback(err, null);
        const account = accResults[0];

        db.query(memberQuery, [account.main_member_id], (err, memberResults) => {
            if (err) return callback(err, null);

            db.query(memberAddresses, [account.main_member_id], (err, memberAddressesResults) => {
                if (err) return callback(err, null);

                db.query(patientQuery, [account.patient_id], (err, patientResults) => {
                    if (err) return callback(err, null);

                    db.query(patientAddresses, [account.patient_id], (err, patientAddressesResults) => {
                        if (err) return callback(err, null);

                        db.query(invQuery, [accountId], (err, invoiceResults) => {
                            if (err) return callback(err, null);

                            const result = {
                              account: account,
                              member: memberResults[0],
                              memberAddress: memberAddressesResults,
                              patient: patientResults[0],
                              patientAddress: patientAddressesResults,
                              invoices: invoiceResults,
                            };

                            callback(null, result);
                        });
                    });
                });
            });
        });
    });
  },

};

module.exports = Account;
