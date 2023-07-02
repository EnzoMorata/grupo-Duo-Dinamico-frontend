import gameLogo from './../../../public/assets/logo.png'
import landingImage from './../../../public/assets/landing-image.png'
import './landing.css'

export default function Landing() {
    const userId = parseInt(localStorage.getItem("id"));
    return (
        <>  
            <div className='landing-div'>
                <div className='landing-title'>
                    <img src={gameLogo} className='logo' alt="logo de Batalla por Udrogoth" />
                    <h1>Bienvenid@ a Batalla por Udrogoth</h1>
                    <img src={gameLogo} className='logo' alt="logo de Batalla por Udrogoth" />
                </div>
                
                
                <p>Estas por comenzar una nueva aventura de dominio de territorios, en donde la estrategia y, gestión de recursos y unidades serán esenciales para determinar quién se hará con la victoria. Defiende tu base lo mejor que puedas y extrae los recursos necesarios para poder emprender un ataque a tus enemigos</p>
                
                <div id='login-link'>
                    {isNaN(userId) && 
                        <a href="./login">Ir a ingresar o registrar un nuevo usuario!</a>
                    }
                    {!isNaN(userId) && 
                        <a href="./games">Buscar Partida!</a>
                    }
                </div>
                
                

                <img src={landingImage} className='image' alt="imagen del juego que tiene relación con la frase" />

            </div>            
        </>
    )
}