import React, {useContext, useState} from 'react';
import './login.css';
import { AuthContext } from '../../auth/AuthContext';
import { toast } from 'react-toastify';

const LogoutButton = () => {
  const {logout} = useContext(AuthContext);
  const [msg, setMsg] = useState("");

  const handleLogout = () => {
    logout();
    setMsg("Has cerrado sesión con éxito!")
    toast.success("Has cerrado sesión con éxito!")
  }

  return (
    <>
        <button onClick={handleLogout}>
        Cerrar sesión
        </button>
    </>
  );
}

export default LogoutButton;