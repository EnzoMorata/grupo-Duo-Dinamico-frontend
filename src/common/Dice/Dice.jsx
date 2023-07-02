import './dice.css'
import { useContext, useState } from 'react'
import axios from 'axios'
import face1 from './../../../public/assets/dice faces/face 1.png'
import face2 from './../../../public/assets/dice faces/face 2.png'
import face3 from './../../../public/assets/dice faces/face 3.png'
import face4 from './../../../public/assets/dice faces/face 4.png'
import face5 from './../../../public/assets/dice faces/face 5.png'
import face6 from './../../../public/assets/dice faces/face 6.png'
import { AuthContext } from "../../auth/AuthContext";

export default function Dice({setDiceRoll, gameData, setBoardGame, attackAction, attackDamage, setAttackDamage, toast, diceRollBlock, setDiceRollBlock}) {
    const [dice1, setDice1] = useState(1);
    const [dice2, setDice2] = useState(1);
    const diceFaces = [face1, face2, face3, face4, face5, face6];
    let altText1 = `Imágen de la cara ${dice1} del dado`;
    let altText2 = `Imágen de la cara ${dice2} del dado`;
    const { token } = useContext(AuthContext);

    const randomizeDices = async () => {
        const diceValue1 = Math.floor(Math.random() * 6) + 1;
        const diceValue2 = Math.floor(Math.random() * 6) + 1;
        setDice1(diceValue1);
        setDice2(diceValue2);
        if (attackAction && gameData != undefined) {
            setAttackDamage(diceValue1 + diceValue2);
            toast.info("Selecciona a tu objetivo para aplicar el daño")
            return;
        }
        if (setDiceRoll && gameData != undefined && !diceRollBlock) {
            setDiceRollBlock(true);
            setDiceRoll(diceValue1 + diceValue2);
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/players/game/${gameData.gameId}/number/${gameData.playerNumber}`, {
                diceRoll: diceValue1 + diceValue2
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/games/id/${gameData.gameId}`, {
                diceRollState: false
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });         
            toast.success("Nueva cantidad de dados disponibles");
            setBoardGame();
        }
    }
    return (
        <>
            <div id='dice-roll'>
                {gameData == undefined && 
                    <button onClick={randomizeDices}>Lanzamiento de dados</button>
                }
                {gameData != undefined && (gameData.turnPlayer == gameData.playerNumber && ((gameData.diceRollState && !diceRollBlock) || (attackAction && !(attackDamage != 0)))) &&
                    <button onClick={randomizeDices}>Lanzamiento de dados</button>
                }
                {gameData != undefined && (gameData.turnPlayer != gameData.playerNumber || ((!gameData.diceRollState || diceRollBlock) && (!attackAction || (attackDamage != 0)))) &&
                    <p>No es tu turno de lanzar los dados</p>    
                }
                <img className='dice' src={diceFaces[dice1 - 1]} alt={altText1} />
                <img className='dice' src={diceFaces[dice2 - 1]} alt={altText2} />
            </div>
        </>
    )
}