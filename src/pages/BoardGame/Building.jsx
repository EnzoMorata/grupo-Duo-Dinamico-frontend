import { useState } from 'react'
import baseImage from './../../../public/assets/buildings/Base.png'
import extractorImage from './../../../public/assets/buildings/Extractor.png'

export default function Building({data, gameState, selected}) {
    const [buildingState, setBuildingState] = useState(data);
    const imageDict = {
        base: baseImage,
        extractor: extractorImage
    }
    return (
        <img src={imageDict[buildingState.type]} className={"building " + `${data.playerId == gameState.playerId ? "player" : ""}` + ` player_number${data.player.number} ` + ` ${selected}`} data-celd-id={buildingState.celdId} data-building-id={buildingState.id}/>
    )
}