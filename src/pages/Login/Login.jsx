import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import axios from 'axios';
import { AuthContext } from '../../auth/AuthContext';
import { toast } from 'react-toastify';

export default function Login() {
    const { token, setToken } = useContext(AuthContext);
    const { user, setUsername } = useContext(AuthContext);
    const { userId, setUserId } = useContext(AuthContext);
    const [regUsername, setRegUsername] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState(false);
    const [msg, setMsg] = useState("");
    const [logged, setLogged] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (event) => {
        console.log(event);
        event.preventDefault();
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, {
            email,
            password
        }).then((response) => {
            console.log('Login successful');
            setError(false);
            setMsg("Login exitoso!");
            // Recibimos el token y lo procesamos
            const access_token = response.data.access_token;
            localStorage.setItem('token', access_token);
            setToken(access_token);
            localStorage.setItem('username', response.data.username);
            setUsername(response.data.username);
            localStorage.setItem('id', response.data.id);
            setUserId(response.data.id);
            //console.log("Se seteo el token: ", access_token);

            setLogged(true);
        }).catch((error) => {
            console.error('An error occurred while trying to login:', error);
            setError(true);// aquí puede haber más lógica para tratar los errores
            toast.error(error.response.data);
        })
    };

    useEffect(() => {
        if (logged) {
            toast.success("Inicio de sesión exitoso!");
            navigate('/principal');
        }
    }, [logged]);

    const handleSignup = async (event) => {
        console.log(event);
        event.preventDefault();
        console.log("form apretado");
        if (regPassword == confirm) {
            axios.post(`${import.meta.env.VITE_BACKEND_URL}/signup`, {
                username: regUsername,
                email: regEmail,
                password: regPassword
            }).then((response) => {
                console.log('Registro exitoso! Ahora puedes volver y loguearte');
                setError(false);
                setMsg('Registro exitoso! Ahora puedes volver y loguearte');
                toast.success("Te has registrado exitosamente!")
                setEmail(regEmail);
                setPassword(regPassword);
                setRegEmail("");
                setRegUsername("");
                setRegPassword("");
                setConfirm("");
            }).catch((error) => {
                if (error.response.data.name) {
                    error.response.data.errors.forEach((err) => {
                        toast.error(err.message);
                        setError(true);
                    })
                } else {
                    console.error('Ocurrió un error:', error);
                    toast.error(error.response.data);
                    setError(true);
                }
                
            });
        } else {
            console.error("Las contraseñas no son iguales.");
            toast.error("Las contraseñas no son iguales.");
            setError(true);
        }
        
    };
    
    return (
        <div className='principal-div'>
            <h1>¡Registra o Ingresa tu usuario!</h1>
            <div className='horizontal-div'>
                <div className='form-div'>
                    <h3>Registrar nuevo usuario</h3>
                    <form onSubmit={handleSignup} id='register-form'>
                        <div>
                            <label htmlFor="register-email">Correo:</label>
                            <input 
                                type="text" 
                                name="register-email"
                                id="register-email"
                                value={regEmail}
                                onChange={e => setRegEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="register-username">Nombre de Usuario:</label>
                            <input 
                                type="text" 
                                name="register-username"
                                id="register-username"
                                value={regUsername}
                                onChange={e => setRegUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="register-password">Contraseña:</label>
                            <input 
                                type="password" 
                                name="register-password"
                                id="register-password"
                                value={regPassword}
                                onChange={e => setRegPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm-password">Confirmar contraseña:</label>
                            <input 
                                type="password" 
                                name="confirm-password"
                                id="confirm-password"
                                value={confirm}
                                onChange={e => setConfirm(e.target.value)}
                                required
                            />
                        </div>
                        <input className='button' type="submit" value="Registrarse"/>
                    </form>
                </div>

                <div id="line"></div>
                
                <div className='form-div'>
                    <h3>Ingresar usuario</h3>
                    <form onSubmit={handleLogin} id='login-form'>
                        <div>
                            <label htmlFor="login-email">Correo:</label>
                            <input 
                                type="text" 
                                name='login-email' 
                                id='login-email' 
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="login-password">Contraseña:</label>
                            <input 
                                type="password" 
                                name='login-password' 
                                id='login-password' 
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <input className='button' type="submit" value="Ingresar"/>
                    </form>
                </div>
                
            </div>
        </div>
    )
}