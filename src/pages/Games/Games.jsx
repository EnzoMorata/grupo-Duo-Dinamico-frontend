import { useContext, useEffect, useState } from "react";
import GameCard from "./GameCard"
import axios from "axios"
import "./gameCard.css"
import { AuthContext } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Games() {
    const [gameCards, setGameCards] = useState([]);
    const [playerName, setPlayerName] = useState("");
    const userId = parseInt(localStorage.getItem("id"));
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [notLogin, setNotLogin] = useState(false);

    const createGame = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/games`, {
                name: playerName,
                userId: userId
            },{
                headers: {
                    'Authorization': `Bearer ${token}`
                  }
            });
            await getGameCardsData();
        } catch(error) {
            console.log(error)
        }
        
    }

    const getGameCardsData = async () => {
        try {
            const gamesQuery = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/games`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const gamesData = gamesQuery.data;
            const gamesResumeData = await Promise.all(gamesData.map(async (game) => {
                const query = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/games/id/${game.id}/resume`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const dataDict = query.data;
                dataDict["id"] = game.id;
                dataDict["turnCount"] = game.turnCount;

                const celdsQuery = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/celds/game/${game.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const celdsData = celdsQuery.data;
                if (celdsData.length == 0) {
                    dataDict["state"] = "Partida aún no iniciada";
                } else {
                    dataDict["state"] = "Partida en curso"; 
                }
                return dataDict;
            }));
            setGameCards(gamesResumeData);
        } catch(error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (notLogin) {
            toast.warning("Debes haber inciado sesión para poder jugar");
            navigate("/login")
        }
    }, [notLogin])

    useEffect(() => {
        if (isNaN(userId)) {
            setNotLogin(true);
        }
        const idInterval = setInterval(getGameCardsData, 10 * 1000); //Actualizar cada 10 segundos    
        if (window.intervalList) {
            for (let id of window.intervalList) {
                clearInterval(id);
            }
        }
        window.intervalList = [];
        window.intervalList.push(idInterval);
    }, []);
    

    return (
        <div className="gameCard-container">
            <div id="createGameRow">
                <div id="createGameColumn">
                    <p>Nombre de Jugador en Nueva Partida:</p>
                    <input onChange={event => setPlayerName(event.target.value)} />
                </div>
                <button onClick={createGame}>Crear Nueva Partida</button>
            </div>
            {gameCards.map(gameResume => (
                <GameCard key={gameResume.id} gameResume={gameResume} getGameCardsData={getGameCardsData} />
            ))}
        </div>
    )
}