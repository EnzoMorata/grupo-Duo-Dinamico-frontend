import { useState } from "react";
import './ex-board.css'
import grass from '../../../public/assets/board tiles/Tiling-Grass-Texture-Main.jpg';
import rock from '../../../public/assets/board tiles/Tiling-Grass-Texture-Rock.jpg';
import tree from '../../../public/assets/board tiles/Tiling-Grass-Texture-Tree.jpg';
import castle from '../../../public/assets/board tiles/Tiling-Grass-Texture-Castle.jpg';

export default function Tablero() {
    const N = 10
    const tiles = [grass, rock, tree];
    const [tablero, setTablero] = useState(Array.from({ length: N }, () => Array.from({ length: N }, () => grass)));
    const probabilidades = [0.85, 0.075, 0.075];
  
    const generarValor = () => {
        const rand = Math.random();
        let acumulador = 0;
        for (let i = 0; i < probabilidades.length; i++) {
            acumulador += probabilidades[i];
            if (rand <= acumulador) {
                return tiles[i];
            }
        }
    };

    const setBases = (tablero) => {
        tablero[N-2][1] = castle;
        tablero[1][N-2] = castle;
    }
  
    const generarTablero = () => {
        const nuevoTablero = tablero.map((fila) =>
            fila.map(() => generarValor())
        );
        setBases(nuevoTablero);
        setTablero(nuevoTablero);
    };
  
    return (
        <div>
            <div className="tablero">
            {tablero.map((fila, indiceFila) =>
                fila.map((valor, indiceColumna) => (
                <div key={`${indiceFila}-${indiceColumna}`}>
                    <img
                    className="casilla" src={valor}></img>
                </div>
                ))
            )}
            </div>
            <button onClick={generarTablero}>Generar tablero</button>
        </div>
    );
}
  
