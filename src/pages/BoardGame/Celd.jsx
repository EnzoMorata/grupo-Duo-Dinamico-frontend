import rockImage from './../../../public/assets/board tiles/Tiling-Grass-Texture-Rock.jpg'
import grassImage from './../../../public/assets/board tiles/Tiling-Grass-Texture-Main.jpg'
import treeImage from './../../../public/assets/board tiles/Tiling-Grass-Texture-Tree.jpg'
import { useState } from 'react'

export default function Celd({data}) {
    const [celdState, setCeldState] = useState(data);
    const imageDict = {
        grass: grassImage,
        rock: rockImage,
        tree: treeImage,
        castle: grassImage
    }

    return (
        <img className='celd' src={imageDict[celdState.resource]} data-celd-id={celdState.id}></img>
    )
}