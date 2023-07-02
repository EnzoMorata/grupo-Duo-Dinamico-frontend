import "./rules.css"
import Dice from "../../common/Dice/Dice"
import Tablero from "../../common/ExampleBoard/ExampleBoard"

export default function Rules() {
    return (
        <div className="rules-div">
            <div className="rules-body">
                <h1 className='rules-title'>¿Cómo jugar a Batalla por Udrogoth?</h1>
                <p>
                    Luego de haberte creado tu cuenta, ¿qué sigue? ¿como empiezo una partida? 
                    ¿cómo es el flujo del juego? La respuesta a estas preguntas las encontrarás
                    en esta página y además te explicaremos paso a paso cómo funciona el juego.
                </p>
                <h2 className='rules-title'>Contexto.</h2>
                <p>
                    El juego se desarrolla en la tierra de <p className='bold'>Udrogoth</p>, un país 
                    bastante dividido con distintas facciones que desean gobernar estas tierras. 
                    Luego de años de relaciones tensas entre las facciones, se desató finalmente
                    una inevitable guerra por el dominio total de Udrogoth. Cada jugador representará
                    a al líder de una facción, y quien sea vencedor ¡será el nuevo rey de Udrogoth!
                </p>
                <h2 className='rules-title'>Inicialización de una partida.</h2>
                <p>
                    Para empezar, puedes unirte a una partida pública o privada, o bien
                    puedes crear tu propia partida. Al momento de crearla puedes definir
                    la cantidad de jugadores con los que vas a enfrentarte y si deseas que
                    sea una partida pública (que cualquiera pueda unirse) o una privada. En
                    caso de crear una partida privada, se generará un código con el cual se 
                    le permitirá a otros jugadores unirse. Al ingresar todos los jugadores 
                    se le dará la opción al creador de la partida de iniciarla. Al momento
                    de iniciar la partida, cada jugador lanzará un dado con el que se determinará
                    el orden de turno de cada jugador. También se generará un tablero cuyas 
                    características veremos a continuación.
                </p>
                <h2 className='rules-title'>El tablero.</h2>
                <p>
                    Éste se encuentra formado por casillas cuadradas donde los jugadores y sus 
                    unidades podrán
                    moverse libremente. Las posiciones iniciales de cada jugador y su <p className='bold'>edificio base </p>
                    están previamente
                    definidas según la cantidad que hayan ingresado a la partida. Dentro del tablero
                    también se generarán al azar una cantidad de <p className='bold'>casillas de recursos</p>, los cuales veremos
                    más adelante.
                </p>
                <Tablero/>
                <h2 className='rules-title'>Las unidades.</h2>
                <p>
                    La interacción en el tablero se hará mediante unidades. Cada unidad posee estadísticas de <p className='bold'>vida </p>
                    y de <p className='bold'>multiplicador de daño</p>. Estas unidades serán las
                    encargadas de realizar las acciones disponibles para el jugador, y se clasifican
                    en dos tipos: <p className='bold'>unidades móviles</p> y <p className='bold'>construcciones estáticas</p>.
                </p>
                <h2 className='rules-title'>Unidades móviles.</h2>
                <p>
                    Estas se conforman por la <p className='bold'>ficha principal</p> y por los <p className='bold'>bárbaros</p>.
                    La <p className='bold'>ficha principal</p> es la unidad con la que inicias el juego, y es única para cada
                    jugador. Con ella te podrás mover por el tablero, interactuar con los recursos o incluso iniciar
                    un combate, y es además la única unidad que puede hacer <p className='bold'>construcciones</p>.
                    Los <p className='bold'>bárbaros</p> son unidades cuya única función es el <p className='bold'>combate</p>. La
                    fuerza de estas unidades estará determinada únicamente por la cantidad que hayas generado y por lo
                    tanto podrás unir varios bárbaros en una <p className='bold'>tropa</p>, que ocupará el mismo espacio que un 
                    único bárbaro y multiplica las estadísticas base según la cantidad de bárbaros que hayan.
                </p>
                <h2 className='rules-title'>Construcciones estáticas.</h2>
                <p>
                    Existen tres tipos: el <p className='bold'>edificio base</p>, los <p className='bold'>extractores de recursos</p> y las 
                    <p className='bold'> torres de defensa</p>. El <p className='bold'>edificio base</p> es la construcción que tendrás 
                    que defender. Esta tiene una enorme cantidad de vida y es el edificio encargado de la creación de tus
                    bárbaros. Las <p className='bold'>torres de defensa</p> son construcciones cuya función principal es atacar 
                    las unidades enemigas dentro de un radio. Finalmente tenemos los <p className='bold'>extractores de recursos </p> 
                    que deben ser construidos sobre casillas de <p className='bold'>recursos</p> para obtener una fuente contínua de estos 
                    al principio de cada turno.
                </p>
                <h2 className='rules-title'>Los recursos.</h2>
                <p>
                    A lo largo del tablero, nos encontraremos con <p className='bold'>casillas de recursos</p> que el jugador necesita
                    extraer para crear nuevas unidades. Únicamente la ficha principal es capaz de extraer recursos manualmente, y 
                    como ya vimos anteriormente, puede también construir un <p className='bold'>extractor de recursos</p> sobre ellas.
                </p>
                <h2 className='rules-title'>El turno del jugador.</h2>
                <p>
                    Una vez que ya comprendemos los elementos con los que podemos interactuar, ¡veamos cómo es el flujo!
                </p>
                <h2 className='rules-title'>Paso 1. Lanzamiento de dados.</h2>
                <p>
                    Al iniciar el turno, el jugador deberá lanzar 2 dados de 6 caras. Este número determinará
                    las acciones que el jugador podrá realizar.
                </p>

                <Dice/>

                <h2 className='rules-title'>Paso 2. Acciones a realizar</h2>
                <p>
                    Cada acción tendrá un costo ya sea del lanzamiento de dados o de los recursos que has extraido. 
                    Podrás realizar la cantidad de acciones válidas que desees en el orden que desees mientras te 
                    queden acciones válidas a realizar. Estas acciones son el <p className='bold'>movimiento</p> de unidades móviles, 
                    la <p className='bold'>extracción de recursos</p>, la <p className='bold'>construcción</p> de edificios, <p className='bold'>generar bárbaros </p> 
                    desde el edificio base,<p className='bold'> unir</p> bárbaros en tropas o entrar en <p className='bold'>combate</p>.
                </p>
                <h2 className='rules-title'>Movimiento.</h2>
                <p>
                    El jugador podrá mover una unidad móvil cualquiera con costo <p className='bold'>1</p> del lanzamiento de dados.
                </p>
                <h2 className='rules-title'>Extracción.</h2>
                <p>
                    Con un costo <p className='bold'>3</p> del lanzamiento del dado, la <p className='bold'>ficha principal</p> del jugador podrá
                    extraer recursos de una casilla de recursos. Cada una de estas casillas entrega <p className='bold'>monedas</p>, y 
                    dependiendo de qué recurso corresponda entregará una determinada cantidad de estas.
                </p>
                <h2 className='rules-title'>Construcción.</h2>
                <p>
                    Con un costo <p className='bold'>3</p> del lanzamiento del dado y un costo de <p className='bold'>monedas</p> según el tipo
                    de construcción, la <p className='bold'>ficha principal</p> del jugador podrá <p className='bold'>construir</p> un edificio
                    en la casilla que se encuentre.
                </p>
                <h2 className='rules-title'>Entrenar bárbaros.</h2>
                <p>
                    Con un costo <p className='bold'>3</p> del lanzamiento del dado y <p className='bold'>5</p> monedas, el jugador podrá generar
                    un bárbaro desde el edificio base.
                </p>
                <h2 className='rules-title'>Unir en tropas.</h2>
                <p>
                    Con un costo <p className='bold'>1</p> del lanzamiento del dado el jugador podrá unir tropas adyacentes en una misma casilla.
                </p>
                <h2 className='rules-title'>Combate.</h2>
                <p>
                    Todas las unidades móviles pueden iniciar un combate con otra unidad enemiga adyacente. En el combate cada jugador 
                    involucrado deberá lanzar un dado, y la diferencia entre ellos multiplicado por el 
                    <p className='bold'> multiplicador de daño</p> de la unidad se traducirá en el daño a la <p className='bold'>vida</p> de la 
                    unidad del jugador que lanzó el menor dado. Si la vida de una unidad llega a 0, esta pierde el combate
                    y desaparece del tablero. Si la vida de la ficha principal llega a 0, reaparecerá en su posición inicial del tablero.
                    Si la vida del edificio base llega a 0, el jugador pierde la partida.
                </p>
                <h2 className='rules-title'>Paso 3. Finalizar el turno.</h2>
                <p>
                    El jugador puede terminar el turno cuando desee, le queden lanzamientos de dado o no.
                </p>
                <h2 className='rules-title'>Paso 4. Término de la partida.</h2>
                <p>
                    El jugador cuyo edificio base sea el último en pie, <p className='bold'>¡es el nuevo rey de Udrogoth!</p>
                </p>
            </div>
            
        </div>
    )
}