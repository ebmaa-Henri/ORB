import { useEffect, useState } from 'react';
import axios from 'axios';
import ENDPOINTS from '../../config/apiEndpoints';
import { useContext } from 'react';
import { DoctorContext } from '../../context/DoctorContext'; 
import { SearchBar, Table } from '../../components';

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { doctorId } = useContext(DoctorContext); 

  // Fetch Accounts on component mount
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get(ENDPOINTS.doctorAccounts(doctorId));
        setAccounts(response.data.accounts);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };
    fetchAccounts();
  }, [doctorId]);

  const columns = ['Account ID', 'Patient', 'Dependent Nr', 'Guarantor', 'Guarantor ID', 'Balance'];
  const filteredAccounts = accounts.filter((account) =>
    Object.values(account).join(' ').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {doctorId ? 
        <div className='flex flex-col gap-4 m-4 p-4 bg-white shadow rounded'>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <Table data={filteredAccounts} columns={columns} linkPrefix="accounts" idField="account_id"/>
        </div>
      : 
        <div> 
          Accounts Info Here
        </div> 
      }
    </>
  );
}
