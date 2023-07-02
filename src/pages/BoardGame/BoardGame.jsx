import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import Celd from "./Celd";
import "./boardGame.css"
import Dice from "../../common/Dice/Dice";
import Building from "./Building";
import Unit from "./Unit";
import Action from "./Action";
import TriggerCelds from "./TriggerCelds";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from "../../auth/AuthContext";

export default function BoardGame() {
    const { gameId } = useParams();
    const [boardState, setBoardState] = useState([]);
    const [diceRoll, setDiceRoll] = useState(0);
    const [coins, setCoins] = useState(0);
    const navigate = useNavigate();
    const userId = parseInt(localStorage.getItem("id"));
    const [gameState, setGameState] = useState({});
    const [selectedObjects, setSelectedObjects] = useState([]);
    const [selectedActions, setSelectedActions] = useState([]);
    const [celdsDict, setCeldsDict] = useState({});
    const [triggerState, setTriggerState] = useState(Array(10).fill([]));
    const [attackAction, setAttackAction] = useState(false);
    const [attackDamage, setAttackDamage] = useState(0);
    const [winner, setWinner] = useState();
    const [diceRollBlock, setDiceRollBlock] = useState(true);
    const [lastGameState, setLastGameState] = useState();
    const { token } = useContext(AuthContext);
    const [notPlayer, setNotPlayer] = useState(false);
    const [notLogin, setNotLogin] = useState(false);
    const [notStarted, setNotStarted] = useState(false);

    const setBoardGame = async () => {
        try {
            if (isNaN(userId)) {
                setNotLogin(true);
                return;
            }
            const [gameQuery, celdsQuery, playersQuery, buildingsQuery, unitsQuery] = await Promise.all([
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/games/id/${gameId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }),
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/celds/game/${gameId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }),
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/players/game/${gameId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }),
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/buildings/game/${gameId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }),
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/units/game/${gameId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
            ])
            
            const gameData = gameQuery.data;
            const celdsData = celdsQuery.data;
            const playersData = playersQuery.data;
            const buildingsData = buildingsQuery.data;
            const unitsData = unitsQuery.data;

            const player = playersData.filter(player => player.userId == userId)[0];
            if (player == undefined) {
                setNotPlayer(true);
                return;
            }
            if (buildingsData.filter(building => building.type == "base").length == 0) {
                setNotStarted(true);
                return;
            }

            const allCelds = {};
            const board = [];
            for (let i = 0; i < 10; i++) {
                board.push([]);
                const row = celdsData.filter(celd => celd.posX == i);
                for (let j = 0; j < 10; j++) {
                    const celd = row[j]; 
                    board[i][j] = {
                        celd: celd,
                        units: [],
                        buildings: []
                    }
                    allCelds[celd.id] = celd;
                }
            }
            setCeldsDict(allCelds);
            
            setGameState({
                gameId: gameId,
                turnCount: gameData.turnCount,
                turnPlayer: (gameData.turnCount % playersData.length) + 1,
                numberOfPlayers: playersData.length,
                playerNumber: player.number,
                playerId: player.id,
                players: playersData,
                buildings: buildingsData,
                diceRollState: gameData.diceRollState
            });
            setDiceRollBlock(!gameData.diceRollState);
            setCoins(player.coins);
            setDiceRoll(player.diceRoll);

            const baseBuildings = [];
            buildingsData.map(building => {
                const player = playersData.find(player => player.id == building.playerId);
                building.player = player;
                if (building.type == "base") {
                    baseBuildings.push(building);
                }
                const celd = allCelds[building.celdId];
                board[celd.posX][celd.posY].buildings.push(building);
            });

            unitsData.map(unit => {
                const celd = allCelds[unit.celdId];
                const player = playersData.find(player => player.id == unit.playerId);
                unit.player = player;
                if (unit.type == "ficha") {
                    const base = baseBuildings.find(building => building.playerId == unit.playerId);
                    unit.baseCeldId = base.celdId; 
                }
                board[celd.posX][celd.posY].units.push(unit);
            });
            setBoardState(board);
        } catch(error) {
            console.log(error); 
        }
    }

    useEffect(() => {
        if (notStarted == true) {
            toast.warning("La partida no ha sido iniciada");
            navigate("/games");
        }
    }, [notStarted]);

    useEffect(() => {
        if (notLogin == true) {
            toast.error("Debes haber iniciado sesión para poder entrar a una partida");
            navigate("/login");
        }
    }, [notLogin])

    useEffect(() => {
        if (notPlayer == true) {
            toast.warning("No eres un jugador en la partida, volviendo a la lista de partidas...");
            goBack();
        }
    }, [notPlayer])

    useEffect(() => {
        const idInterval = setInterval(setBoardGame, 10 * 1000); //Actualizar tablero cada 10 segundos
        if (window.intervalList) {
            for (let id of window.intervalList) {
                clearInterval(id);
            }
        }
        window.intervalList = [];
        window.intervalList.push(idInterval);
        setBoardGame();
    }, []);

    const goBack = () => {
        navigate("/games");
    }

    const clickHandle = (event) => {
        if (JSON.stringify(triggerState) != JSON.stringify(Array(10).fill([]))) {
            executeTrigger(event);
        } else {
            selectObjects(event);
        }
    } 

    const selectObjects = (event) => {
        const celd = celdsDict[event.target.dataset.celdId];
        const objects = boardState[celd.posX][celd.posY];
        const labeledObjects = objects.units.concat(objects.buildings);
        setSelectedObjects(labeledObjects);
        setSelectedActions([]);
        setAttackAction(false);
        setAttackDamage(0);
    }

    const displayActions = (event) => {
        setTriggerState(Array(10).fill([]));
        setSelectedActions([]);
        if (gameState.turnPlayer != gameState.playerNumber) {
            toast.warning("No es tu turno para realizar acciones");
            return;
        }
        const celd = celdsDict[event.target.dataset.celdId];
        if (attackAction) {
            if (attackDamage == 0) {
                toast.warning("Debes lanzar nuevamente los dados para aplicar el daño")
                return;
            }
            let action;
            if (event.target.dataset.buildingId) {
                const index = boardState[celd.posX][celd.posY].buildings.findIndex(building => building.id == event.target.dataset.buildingId);
                const entity = boardState[celd.posX][celd.posY].buildings[index];
                action = [{
                    type: "objective",
                    data: entity,
                    entity: "building",
                }];
            } else if (event.target.dataset.unitId) {
                const index = boardState[celd.posX][celd.posY].units.findIndex(unit => unit.id == event.target.dataset.unitId);
                const entity = boardState[celd.posX][celd.posY].units[index];
                action = [{
                    type: "objective",
                    data: entity,
                    entity: "unit",
                }];
            }
            setSelectedActions(action);
            return;
        }
        if (event.target.dataset.buildingId) {
            const index = boardState[celd.posX][celd.posY].buildings.findIndex(building => building.id == event.target.dataset.buildingId);
            const building = boardState[celd.posX][celd.posY].buildings[index];
            if (building.playerId == gameState.playerId && building.type == "base") {
                const action = [{
                    type: "createUnit",
                    data: building
                }]
                setSelectedActions(action);
            } else {
                toast.info("No hay acciones disponibles");
            }
        } else if (event.target.dataset.unitId) {
            const index = boardState[celd.posX][celd.posY].units.findIndex(unit => unit.id == event.target.dataset.unitId);
            const unit = boardState[celd.posX][celd.posY].units[index];
            if (unit.playerId == gameState.playerId && unit.type == "ficha") {
                const action = [{
                    type: "move",
                    data: unit
                },{
                    type: "createBuilding",
                    data: unit
                },{
                    type: "obtainCoins",
                    data: unit
                }];
                setSelectedActions(action);
            } else if (unit.playerId == gameState.playerId && unit.type == "barbaro") {
                const action = [{
                    type: "move",
                    data: unit
                },{
                    type: "attack",
                    data: unit
                }];
                setSelectedActions(action);
            } else {
                toast.info("No hay acciones disponibles");
            }
        } 
    }

    const executeAction = async (event) => {
        const action = selectedActions.find(action => action.type == event.target.dataset.type);
        if (action.type == "createUnit") {
            if (coins >= import.meta.env.VITE_CREATE_UNIT_COST) {
                try {
                    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/units/game/${gameId}`, {
                        "playerId": action.data.playerId,
                        "life": 10
                    }, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    await axios.put(`${import.meta.env.VITE_BACKEND_URL}/players/game/${gameId}/number/${gameState.playerNumber}`, {
                        coins: coins - import.meta.env.VITE_CREATE_UNIT_COST
                    }, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    await setBoardGame(); 
                    setSelectedObjects([]);
                    setSelectedActions([]);
                    toast.success("Bárbaro creado");
                } catch(error) {
                    console.log(error);
                }
            } else {
                toast.warning("No tienes las monedas suficientes");
            }
            
        } else if (action.type == "createBuilding") {
            const celd = celdsDict[action.data.celdId];
            if (["rock", "tree"].includes(celd.resource)) {
                if (coins >= import.meta.env.VITE_CREATE_BUILDING_COST) {
                    const playerBuildingsInCeld = boardState[celd.posX][celd.posY].buildings;
                    if (playerBuildingsInCeld.filter(building => building.playerId == gameState.playerId && building.type == "extractor").length == 0) {
                        try {
                            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/buildings/game/${gameId}`, {
                                celdId: celd.id,
                                playerId: action.data.playerId,
                                life: 20,
                                type: "extractor"
                            }, {
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            });
                            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/players/game/${gameId}/number/${gameState.playerNumber}`, {
                                coins: coins - import.meta.env.VITE_CREATE_BUILDING_COST
                            }, {
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            });
                            await setBoardGame();
                            setSelectedObjects([]);
                            setSelectedActions([]);
                            toast.success("Extractor creado");
                        } catch(error) {
                            console.log(error);
                        }
                    } else {
                        toast.warning("Ya hay un extractor construido en esa celda");
                    }
                } else {
                    toast.warning("No tienes las monedas suficientes");
                }  
            } else {
                toast.warning("No estas sobre una celda de recursos (árbol o roca)");
            }
        } else if (action.type == "move") {
            const celd = celdsDict[action.data.celdId];
            const triggerCelds = [];
            for (let x = 0; x < 10; x++) {
                triggerCelds.push([]);
                for (let y = 0; y < 10; y++) {
                    if (Math.abs(celd.posX - x) + Math.abs(celd.posY - y) <= diceRoll) {
                        triggerCelds[x].push({
                            posX: x,
                            posY: y,
                            status: "reachable",
                            celdId: boardState[x][y].celd.id,
                            action: action
                        })
                    } else {
                        triggerCelds[x].push({
                            posX: x,
                            posY: y,
                            status: "unreachable",
                            celdId: boardState[x][y].celd.id,
                            action: action
                        })
                    }
                }
            }
            setTriggerState(triggerCelds);
        } else if (action.type == "attack") {
            if (diceRoll < import.meta.env.VITE_ATTACK_COST) {
                toast.warning("No tienes los dados suficientes para atacar");
                return;
            }
            const celd = celdsDict[action.data.celdId];
            const celdState = boardState[celd.posX][celd.posY];
            const enemyEntitites = celdState.units.concat(celdState.buildings).filter(entity => entity.playerId != action.data.playerId);
            setSelectedObjects(enemyEntitites);
            setSelectedActions([]);
            if (enemyEntitites.length == 0) {
                setAttackAction(false);
                toast.warning("No hay enemigos para atacar")
            } else {
                setAttackAction(true);
                toast.info("Lanza nuevamente los dados para multiplicar tu daño")
            }
        } else if (action.type == "objective") {
            try {
                if (diceRoll < import.meta.env.VITE_ATTACK_COST) {
                    toast.warning("No tienes los dados suficientes para atacar");
                    return;
                }
                if (action.entity == "unit") {
                    const damage = import.meta.env.VITE_BARBARIAN_DMG_BASE * attackDamage; 
                    if ((action.data.life - damage) > 0) {
                        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/units/game/${gameId}/id/${action.data.id}`, {
                            life: action.data.life - damage 
                        }, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                    } else {
                        if (action.data.type == "ficha") {
                            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/units/game/${gameId}/id/${action.data.id}`, {
                                life: 10,
                                celdId: action.data.baseCeldId
                            }, {
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            });
                            toast.success("La ficha enemiga ha vuelto a su base");
                        } else {
                            toast.success("Has derrotado a un bárbaro");
                            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/units/game/${gameId}/id/${action.data.id}`, {
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            });
                        }
                    }
                } else if (action.entity == "building") {
                    const damage = import.meta.env.VITE_BARBARIAN_DMG_BASE * attackDamage;  
                    if ((action.data.life - damage) > 0) {
                        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/buildings/game/${gameId}/id/${action.data.id}`, {
                            life: action.data.life - damage // - el multiplicador del barbaro por el lanzamiento de dado 
                        }, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                    } else {
                        if (action.data.type == "base") {
                            const unitsQuery = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/units/game/${gameId}/player/${action.data.playerId}`, {
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            });
                            const unitsData = unitsQuery.data;
                            await Promise.all(unitsData.map(unit => {
                                axios.delete(`${import.meta.env.VITE_BACKEND_URL}/units/game/${gameId}/id/${unit.id}`, {
                                    headers: {
                                        'Authorization': `Bearer ${token}`
                                    }
                                });
                            }));
                            const buildingsQuery = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/buildings/game/${gameId}/player/${action.data.playerId}`, {
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            });
                            const buildingsData = buildingsQuery.data;
                            await Promise.all(buildingsData.map(building => {
                                axios.delete(`${import.meta.env.VITE_BACKEND_URL}/buildings/game/${gameId}/id/${building.id}`, {
                                    headers: {
                                        'Authorization': `Bearer ${token}`
                                    }
                                });
                            }));
                            toast.success("Has derrotado a un enemigo");
                        }
                        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/buildings/game/${gameId}/id/${action.data.id}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        toast.success("Has destruido un extractor");
                    }
                }
                await axios.put(`${import.meta.env.VITE_BACKEND_URL}/players/game/${gameId}/number/${gameState.playerNumber}`, {
                    diceRoll: diceRoll - import.meta.env.VITE_ATTACK_COST
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setAttackAction(false);
                setAttackDamage(0);
                await setBoardGame();
                toast.success("Daño aplicado correctamente")
                setSelectedObjects([]);
                setSelectedActions([]);
            } catch(error) {
                console.log(error);
            }
        } else if (action.type == "obtainCoins") {
            const celd = celdsDict[action.data.celdId];
            if (diceRoll >= import.meta.env.VITE_COINS_DICE_CONVERSION) {
                if (["rock", "tree"].includes(celd.resource)) {
                    try {
                        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/players/game/${gameId}/number/${gameState.playerNumber}`, {
                            coins: coins + 1,
                            diceRoll: diceRoll - import.meta.env.VITE_COINS_DICE_CONVERSION
                        }, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        await setBoardGame();
                        setSelectedObjects([]);
                        setSelectedActions([]);
                        toast.success("Se obtuvieron monedas");
                    } catch(error) {
                        console.log(error);
                    }
                } else {
                    toast.warning("No estas sobre una celda de recursos (árbol o roca)");
                }
            } else {
                toast.warning("No tienes los dados suficientes para obtener monedas");
            }
        }
    }

    const executeTrigger = async (event) => {
        const celd = celdsDict[event.target.dataset.celdId];
        const triggerCeld = triggerState[celd.posX][celd.posY];
        if (triggerCeld.status == "reachable") {
            if (triggerCeld.action.type == "move") {
                try {
                    const originCeld = celdsDict[triggerCeld.action.data.celdId];
                    const destinyCeld = celdsDict[triggerCeld.celdId];
                    const distance = Math.abs(originCeld.posX - destinyCeld.posX) + Math.abs(originCeld.posY - destinyCeld.posY);
                    if (distance != 0) {
                        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/units/game/${gameId}/id/${triggerCeld.action.data.id}`, {
                            celdId: triggerCeld.celdId
                        }, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/players/game/${gameId}/number/${gameState.playerNumber}`, {
                            diceRoll: diceRoll - distance
                        }, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        await setBoardGame();
                        toast.success("La unidad se ha desplazado correctamente");
                    } else {
                        toast.success("Te has mantenido en la misma posición");
                    }                    
                    setSelectedObjects([]);
                    setSelectedActions([]);
                } catch(error) {
                    console.log(error)
                }
            }
        } else {
            toast.warning("No tienes los dados suficientes para moverte a esta celda");
        } 
        setTriggerState(Array(10).fill([]));
    }

    const nextTurn = async () => {
        try {
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/games/id/${gameId}`, {
                turnCount: gameState.turnCount + 1,
                diceRollState: true
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }); 
            const numberNextPlayer = ((gameState.turnCount + 1) % gameState.numberOfPlayers) + 1;
            const nextPlayer = gameState.players.find(player => player.number == numberNextPlayer);
            const buildingsNextPlayerQuery = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/buildings/game/${gameId}/player/${nextPlayer.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }); 
            const buildingsNextPlayerData = buildingsNextPlayerQuery.data;
            const numberOfExtractors = buildingsNextPlayerData.filter(building => building.type == "extractor").length;
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/players/game/${gameId}/number/${numberNextPlayer}`, {
                diceRoll: 0,
                coins: nextPlayer.coins + numberOfExtractors * import.meta.env.VITE_COINS_RATE
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }); 
            await setBoardGame();
            toast.success("Pasando al siguiente turno");
        } catch(error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (JSON.stringify(gameState) != "{}") {
            const baseBuildingActualPlayer = gameState.buildings.find(building => building.type == "base" && building.player.number == gameState.turnPlayer); 
            const allBasesAlive = gameState.buildings.filter(building => building.type == "base");
            if (allBasesAlive.length == 1 && winner == undefined) {
                const winnerPlayer = allBasesAlive[0].player;
                setWinner(winnerPlayer);
                toast.success(`El ganador es ${winnerPlayer.name}`, {
                    position: "top-center"
                })
                toast.info("Cerrando la partida en 5 segundos", {
                    position: "top-center"
                })
                setTimeout(async () => {
                    goBack();
                    await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/games/id/${gameId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                }, 6 * 1000);
                return;
            }
            if (baseBuildingActualPlayer == undefined) {
                nextTurn();
                toast.info("Saltando turno de jugador derrotado");
            }
            if (gameState.turnPlayer == gameState.playerNumber && lastGameState == undefined) {
                toast.success("Es tu turno");
                setLastGameState(gameState);
            } else if (gameState.turnPlayer == gameState.playerNumber && gameState.turnCount != lastGameState.turnCount) { //JSON.stringify(gameState) != JSON.stringify(lastGameState)
                toast.success("Es tu turno");
                setLastGameState(gameState);
            }
        }
    }, [gameState]);

    return (
        <div className="game">
            <div className="menu">
                <div className="goBack">
                    <button onClick={goBack}>Volver</button>
                    {gameState.turnPlayer == gameState.playerNumber && 
                        <button onClick={nextTurn} id="nextTurn">Siguiente Turno</button>
                    }
                    {!(gameState.turnPlayer == gameState.playerNumber) && 
                        <button id="placeholder">Siguiente Turno</button>
                    }
                </div>
                <div className="textUnion">
                    <p>Turno N°{gameState.turnCount + 1}, turno de jugador N°{gameState.turnPlayer}:</p>
                    {gameState.players && 
                        <p>{gameState.players.find(player => player.number == gameState.turnPlayer).name}</p>
                    }
                </div>
                <div className="menuPlayerResume">
                    {gameState.players && 
                        <p className="nameActualPlayer">{gameState.players.find(player => player.number == gameState.playerNumber).name}</p> 
                    }
                    <p>Dados disponibles: {diceRoll}</p>
                    <p>Monedas acumuladas: {coins}</p>
                </div>
                <Dice setDiceRoll={setDiceRoll} gameData={gameState} setBoardGame={setBoardGame} attackAction={attackAction} attackDamage={attackDamage} setAttackDamage={setAttackDamage} toast={toast} diceRollBlock={diceRollBlock} setDiceRollBlock={setDiceRollBlock}/>
                <div>
                    <h3>Seleccionado:</h3>
                    <div className="selectedObjects">
                        {selectedObjects.map(object => ["ficha", "barbaro"].includes(object.type) ? (
                            <div key={object.id + object.type + "separator"}>
                                <div key={object.id + object.type} className="container" onClick={displayActions}>
                                    <Unit key={object.id + object.type} data={object} gameState={gameState} selected={"selected"}/>
                                </div>
                                <p key={object.id + object.type + "p"}>Vida: {object.life}</p>
                            </div>
                            
                        ) : (
                            <div  key={object.id + object.type + "separator"}>
                                <div key={object.id + object.type} className="container" onClick={displayActions}>
                                    <Building key={object.id + object.type} data={object} gameState={gameState} selected={"selected"}/>
                                </div>
                                <p>Vida: {object.life}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h3>Acciones:</h3>
                    <div className="actionsList">
                        {selectedActions.map(action => (
                            <Action key={action.type} data={action} onClick={executeAction}/>
                        ))}
                    </div>
                </div>
            </div>
            <div>
                <div className="board">
                    {boardState.map(column => (
                        <div key={column[0].celd.posX} className="boardColumn">
                            {column.map(objects => (
                                <div key={objects.celd.posY} className="container" onClick={clickHandle}>
                                    <Celd className="celd" key={objects.celd.id} data={objects.celd}/>
                                    {objects.buildings.map(building => (
                                        <Building key={building.id} data={building} gameState={gameState}/>
                                    ))}
                                    {objects.units.map(unit => (
                                        <Unit key={unit.id} data={unit} gameState={gameState}/>
                                    ))}
                                    {triggerState[objects.celd.posX][objects.celd.posY] &&
                                        <TriggerCelds data={triggerState[objects.celd.posX][objects.celd.posY]}/>
                                    }
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}