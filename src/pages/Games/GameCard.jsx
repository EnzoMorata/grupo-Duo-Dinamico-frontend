import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";

export default function GameCard({gameResume, getGameCardsData}) {
    const [playerName, setPlayerName] = useState("");
    const navigate = useNavigate();
    const userId = parseInt(localStorage.getItem("id"));
    const { token } = useContext(AuthContext);

    const enterPlayerInGame = async () => {
        try {
            const playerNumber = gameResume.players.length + 1;
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/players/game/${gameResume.id}`, {
                name: playerName,
                userId: userId,
                number: playerNumber
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            await getGameCardsData();
        } catch(error) {
            console.log(error);
        }
        
    }

    const enterInGameBoard = () => {
        navigate(`${gameResume.id}`);
    }

    const startGame = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/celds`, {
                gameId: gameResume.id
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/units`, {
                gameId: gameResume.id
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate(`${gameResume.id}`);
        } catch(error) {
            console.log(error);
        }
    }

    return (
        <div className="gameCard">
            <h2>{`Juego N°${gameResume.id}`}</h2>
            <div className="gameDetailsFlexColumn">
                <p>Estado de partida: {gameResume.state}</p>
                <p>{`Cantidad de turnos jugados: ${gameResume.turnCount}`}</p>
                <div className="gameDetailsFlexRow">
                    <p>Lista de Jugadores:</p>
                    <ul>
                        {gameResume.players.map((player) => (
                            <li key={player.id}>{player.name}</li>
                        ))}
                        {gameResume.state == "Partida aún no iniciada" && gameResume.players.length < 4 && gameResume.players.filter(player => player.userId == userId).length == 0 &&
                            <>
                                <input onChange={event => setPlayerName(event.target.value)} />
                                <button onClick={enterPlayerInGame} id={`button_playerName${gameResume.id}`}>Ingresar como Jugador</button>
                            </>
                        }
                        {gameResume.state == "Partida aún no iniciada" && gameResume.players.length >= 2 && gameResume.players.filter(player => player.userId == userId && player.number == 1).length == 1 &&
                            <button onClick={startGame}>Comenzar Partida</button>
                        }
                        {gameResume.state == "Partida en curso" && gameResume.players.filter(player => player.userId == userId).length == 1 &&
                            <button onClick={enterInGameBoard}>Entrar en partida</button>                            
                        }
                    </ul>
                </div>
                {gameResume.state == "Partida aún no iniciada" && gameResume.players.length >= 2 && gameResume.players.filter(player => player.userId == userId && player.number != 1).length >= 1 &&
                    <p>Esperando a que el Jugador N°1 comience la partida</p>
                }
                {gameResume.state == "Partida aún no iniciada" && gameResume.players.length < 2 && gameResume.players.filter(player => player.userId == userId).length == 1 &&
                    <p>Esperando a que se unan más jugadores</p>
                }
            </div>
        </div>
    )
}