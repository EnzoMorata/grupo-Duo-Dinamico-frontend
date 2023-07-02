import './main.css'
import image1 from './../../../public/assets/main-image1.png'
import image2 from './../../../public/assets/main-image2.png'

export default function Main() {
    const userId = parseInt(localStorage.getItem("id"));
    return (
        <div className='main-page-div'>
            <div className='main-page-title'>
                <h1>Batalla por Udrogoth</h1>
            </div>
            <div className='main-page-body'>
                <div className='card-container'>
                    <div className='card'>
                        <div className='card-body'>
                            <h2 className='card-title'>
                                ¿Qué es Batalla por Udrogoth?
                            </h2>
                            <p className='card-content'>
                                Batalla por Udrogoth es un juego de estrategia de dominio
                                de territorios y manejo de recursos donde tus habilidades
                                de gestión serán fundamentales para asegurar la vitoria. Crea
                                partidas privadas para jugar únicamente con tus amigos o 
                                públicas para enfrentarte a quien ose desafiarte.
                            </p>
                        </div>
                        <img className='card-image' src={image1}></img>
                    </div>

                    <div className='card'>
                        <img className='card-image' src={image2}></img>
                        <div className='card-body'>
                            <h2 className='card-title'>
                                ¡Juega gratis!
                            </h2>
                            <p className='card-content'>
                                Podrás jugar gratis a Batalla por Udrogoth y con ello emprender
                                en un sinfín de partidas para probar estrategias nuevas y afinar
                                tus habilidades como jugador sin gastar ni un solo peso.
                            </p>
                        </div>
                    </div>
                    <div className='card'>
                        <div className='card-body'>
                            <h2 className='card-title'>
                                ¿Qué estas esperando? ¡juega ya!
                            </h2>
                            <a href="./games" className="button-container">
                                <button className='quick-start'> Partida Rápida </button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}