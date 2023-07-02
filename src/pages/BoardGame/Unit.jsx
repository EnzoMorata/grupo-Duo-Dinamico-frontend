import { useState } from 'react'
import principalImage from './../../../public/assets/units/Principal.png'
import barbarianImage from './../../../public/assets/units/Barbarian.png'

export default function Unit({data, gameState, selected}) {
    const [unitState, setUnitState] = useState(data);
    const imageDict = {
        ficha: principalImage,
        barbaro: barbarianImage
    }
    return ( 
        <img src={imageDict[unitState.type]} className={"unit " + `${data.playerId == gameState.playerId ? "player" : ""}` + ` player_number${data.player.number} ` + ` ${selected}`} data-celd-id={unitState.celdId} data-unit-id={unitState.id}/>
    )
}