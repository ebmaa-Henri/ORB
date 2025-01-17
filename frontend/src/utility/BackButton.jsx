import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { NavigationContext } from '../context/NavigationContext';

export default function BackButton() {
  const { previousPath } = useContext(NavigationContext);
  const navigate = useNavigate();


  return (
      <button
      onClick={() => previousPath ? navigate(previousPath) : navigate(-1)}
      type='submit'
      className='btn-class max-w-[100px]'
    >
      Back
    </button>
  );
}
