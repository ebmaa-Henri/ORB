import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext'; 
import axios from 'axios';
import { Nav, SearchBar, Table } from '../../components';
import { Link } from "react-router-dom";

export default function Profiles() {
  const { user } = useContext(UserContext);
  const [profiles, setProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch Profiles on component mount
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get('http://167.99.196.172/profiles');
        setProfiles(response.data.profiles);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };
    fetchProfiles();
  }, []);

  const columns = ['Profile ID', 'Member', 'M/A', 'Plan', 'M/A Number', 'Auth', 'Balance', 'Accounts', 'Dependents', 'Invoices'];
  const filteredProfiles = profiles.filter((profile) =>
    Object.values(profile).join(' ').toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log (filteredProfiles);
  return (
    <>
      <Nav />
      <div className='flex flex-col gap-4 m-4 p-4 bg-white rounded'>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Table data={filteredProfiles} columns={columns} linkPrefix="profiles" idField="profile_id"/>
      </div>
    </>
  );
}
