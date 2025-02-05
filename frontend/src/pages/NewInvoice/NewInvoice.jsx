import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ENDPOINTS from '../../config/apiEndpoints';
import axios from 'axios';
import { BackButton, InputField } from '../../components/index';

export default function NewInvoice() {
  const { accountId } = useParams();

  const [account, setAccount] = useState({});
  const [patient, setPatient] = useState({});
  const [member, setMember] = useState({});
  const [client, setClient] = useState([]);
  const [refClient, setRefClient] = useState([]);
  const [medical, setMedical] = useState([]);
  // const [account, setAccount] = useState([]);
  // const [account, setAccount] = useState([]);

  useEffect(() => {
    const getAccountDetails = async () => {
      try {
        const response = await axios.get(ENDPOINTS.fullAcc(accountId), {
          withCredentials: true,
        });
        console.log('response',response)
        const { member, patient, client, refClient, medical, account } = response.data.account;
        
        setClient(client || []);
        setRefClient(refClient || []);
        setMember(member || {});
        setPatient(patient || {});
        setMedical(medical || []);
        setAccount(account || {});
      } catch (error) {
        console.error('Error fetching record details:', error);
      }
    };

    if (accountId) {
      getAccountDetails();
    }
  }, [accountId]);

  
  const renderPersonDetails = (title, person) => (
    <div className='flex-1'>
      <table className="table-auto w-full border-collapse border-gray-blue-100 text-gray-dark">
        <thead>
          <tr>
            <th colSpan="2" className="border border-gray-blue-100 p-2 ">{title}</th>
          </tr>
        </thead>
        <tbody> 
          <tr><td className="border border-gray-blue-100 p-2">Name</td><td className="border border-gray-blue-100 p-2">{person[0]?.name}</td></tr>
          <tr><td className="border border-gray-blue-100 p-2">Gender</td><td className="border border-gray-blue-100 p-2">{person[0]?.gender === 'M' ? 'Male' : 'Female'}</td></tr>
          <tr><td className="border border-gray-blue-100 p-2">ID</td><td className="border border-gray-blue-100 p-2">{person[0]?.id_nr}</td></tr>
          <tr><td className="border border-gray-blue-100 p-2">Date of Birth</td><td className="border border-gray-blue-100 p-2">{person[0]?.date_of_birth}</td></tr>
          <tr><td className="border border-gray-blue-100 p-2">Addresses</td><td className="border border-gray-blue-100 p-2">{person.addresses?.map((address, index) => (<div key={index}>{address.address}</div>))}</td></tr>
          <tr><td className="border border-gray-blue-100 p-2">Contact</td><td className="border border-gray-blue-100 p-2">{person.contactNumbers?.map((contact, index) => (<div key={index}>{contact.num_type}: {contact.num}</div>))}</td></tr>
          <tr><td className="border border-gray-blue-100 p-2">Email</td><td className="border border-gray-blue-100 p-2">{person.emails?.map((email, index) => (<div key={index}>{email.email}</div>))}</td></tr>
          <tr><td className="border border-gray-blue-100 p-2">Dependent Nr</td><td className="border border-gray-blue-100 p-2">{person[0]?.dependent_nr}</td></tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      {accountId ? (
        <>
          <div className="container-col gap-4">
            <h2 className='font-bold'>*New Invoice</h2>
            <div className='flex flex-row gap-4'>
              <div className='flex-1 flex flex-col gap-4'>
                <table className="table-auto w-full border-collapse border-gray-blue-100 text-gray-dark">
                  <thead>
                    <tr><th colSpan="2" className="border border-gray-blue-100 p-2">Client</th></tr>
                  </thead>
                  <tbody>
                    <tr><td className="border border-gray-blue-100 p-2">Name</td><td className="border border-gray-blue-100 p-2">{client.client_name}</td></tr>
                    <tr><td className="border border-gray-blue-100 p-2">Type</td><td className="border border-gray-blue-100 p-2">{client.client_type}</td></tr>
                    <tr><td className="border border-gray-blue-100 p-2">Email</td><td className="border border-gray-blue-100 p-2">{client.email}</td></tr>
                    <tr><td className="border border-gray-blue-100 p-2">Tell</td><td className="border border-gray-blue-100 p-2">{client.tell_nr}</td></tr>
                    <tr><td className="border border-gray-blue-100 p-2">Registration Nr</td><td className="border border-gray-blue-100 p-2">{client.registration_nr}</td></tr>
                    <tr><td className="border border-gray-blue-100 p-2">Practice Nr</td><td className="border border-gray-blue-100 p-2">{client.practice_nr}</td></tr>
                  </tbody>
                </table>
                <table className="table-auto w-full border-collapse border-gray-blue-100 text-gray-dark">
                  <thead>
                    <tr><th colSpan="2" className="border border-gray-blue-100 p-2 ">Medical Aid</th></tr>
                  </thead>
                  <tbody>
                    <tr><td className="border border-gray-blue-100 p-2">Medical Aid</td><td className="border border-gray-blue-100 p-2">{medical.medical_aid_name}</td></tr>
                    <tr><td className="border border-gray-blue-100 p-2">Plan</td><td className="border border-gray-blue-100 p-2">{medical.plan_name}</td></tr>
                    <tr><td className="border border-gray-blue-100 p-2">Medical Aid Nr</td><td className="border border-gray-blue-100 p-2">{medical.medical_aid_nr}</td></tr>
                    <tr><td className="border border-gray-blue-100 p-2">Plan Code</td><td className="border border-gray-blue-100 p-2">{medical.plan_code}</td></tr>
                  </tbody>
                </table>
              </div>
              {renderPersonDetails('Guarantor', member)}
              {renderPersonDetails('Patient', patient)}
            </div>
          </div>
          <div className="container-row justify-between items-center">
            <div className='flex flex-row gap-4'>
              <InputField label="Procedure Date" value={account.date_of_service} id="procedure_date" type='date' />
              <p >Invoice Balance: {account.invoice_balance}</p>
            </div>
            <div className='flex flex-row gap-4'>
              <select className="border rounded border-gray-blue-100 px-2 hover:border-ebmaa-purple transition duration-300 cursor-pointer"
                >
                <option value="" disabled>Select Ref Doctor</option>
                {refClient?.map((client, index) => (
                  <option value={client.ref_client_id} key={index}>Dr {client.first} {client.last}</option>
                ))}
              </select>
              <label className='flex items-center'>Status:</label>
              <select className="border rounded border-gray-blue-100 px-2 hover:border-ebmaa-purple transition duration-300 cursor-pointer"
                value={account.status || ""}>
                <option value="" disabled>Select Status</option>
                <option value="Processing">Processing</option>
                <option value="Billed">Billed</option>
                <option value="Archived">Archived</option>
              </select>
              <BackButton />
              <button type="button" className="btn-class w-[100px]">Save</button>
            </div>
          </div>
        </>
      ) : (
        <div className='container-col items-center'>
          <p>Loading invoice details...</p>
        </div>
      )}
    </>
  );
}
