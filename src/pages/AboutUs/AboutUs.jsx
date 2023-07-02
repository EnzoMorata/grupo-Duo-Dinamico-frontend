import './about-us.css'
import enzoPhoto from './../../../public/assets/foto-enzo.jpeg'
import nicoPhoto from './../../../public/assets/foto-nico.jpeg'

export default function About() {
    return (
        <div className='about-us-div'>
            <h1 className='about-us-title'>Sobre nosotros...</h1>
            <p className='about-us-text'>
                Esta página web fue creada con mucho amor y esfuerzo por
                el grupo Dúo Dinámico, formado en el curso IIC2513-Tecnologías 
                y Aplicaciones Web de la Pontificia Universidad Católica de Chile.
            </p>
            <h2 className='about-us-title'>¿Quiénes conforman el Dúo Dinámico?</h2>
            <div className='about-us-body'>
                <div className='about-us-card'>
                    <img className='about-us-card-image' src={enzoPhoto}></img>
                    <h2 className='about-us-card-title'>
                        Enzo Fabián Morata Astudillo
                    </h2>
                    <p className='about-us-card-content'>
                        Hola me llamo Enzo, estoy actualmente 
                        en mi cuarto año en Ingeniería de Software. Me gusta compartir 
                        con mis amigos, ver series de anime y jugar a videojuegos. 
                        Una de mis series favoritas de la infancia es Inuyasha, y mi 
                        saga de juegos favorita es The Legend of Zelda.
                    </p>

                </div>
                <div className='about-us-card'>
                    <img className='about-us-card-image' src={nicoPhoto}></img>
                    <h2 className='about-us-card-title'>
                        Nicolás Ignacio Salazar Vargas
                    </h2>
                    <p className='about-us-card-content'>
                        Hola! soy Nicolás, estudiante de Ingeniería en Computación y
                        actualmente estoy cursando mi quinto año de universidad.
                        Me gustan los videojuegos en especial los de Pokémon y soy
                        fanático de la cocina. Mi comida favorita de toda la vida
                        son las papas fritas y mi serie favorita de toda la vida
                        es Naruto Shippuden.

                    </p>
                </div>
            </div>
        </div>
        
    )
}