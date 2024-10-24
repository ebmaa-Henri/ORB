import './loginbox.css';
import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

export default function LoginBox() {
  const { setUser } = useContext(UserContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      const response = await axios.post('http://localhost:4000/login', {
        email: email,
        password: password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
    });

      console.log(response.data.user);
      setUser(response.data.user); 

      // Navigate to the dashboard
      navigate('/dashboard');
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen text-sm">
      <div className="min-w-[300px] min-h-[425px] bg-white flex flex-col justify-between items-center rounded-lg py-8">
        <img className='max-w-[190px] h-auto translate-x-[-15px]' src="/ebmaa-orb-logo.svg" alt="" />
        <form className="flex flex-col justify-center items-center gap-6" onSubmit={handleLogin}>
          <input 
            className='border-b pb-1 border-gray-light focus:outline-none text-center' 
            type="text" 
            name="email" 
            id="email" 
            placeholder='Email' 
            required 
          />
          <input 
            className='border-b pb-1 border-gray-light focus:outline-none text-center' 
            type="password" 
            name="password" 
            id="password" 
            placeholder='Password' 
            required 
          />
          <input 
            className='border py-1 px-1 border-gray-light min-w-[100px] rounded-sm' 
            type="submit" 
            value="Log In" 
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </div>
    </div>  
  );
}
