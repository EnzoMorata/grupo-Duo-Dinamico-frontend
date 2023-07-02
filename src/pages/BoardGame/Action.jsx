export default function Action({data, onClick}) {
    const actionDict = {
        createUnit: {
            costValue: import.meta.env.VITE_CREATE_UNIT_COST,
            costType: "monedas",
            message: "Crear Bárbaro"
        },
        createBuilding: {
            costValue: import.meta.env.VITE_CREATE_BUILDING_COST,
            costType: "monedas",
            message: "Crear Edificio"
        },
        move: {
            costValue: import.meta.env.VITE_MOVE_COST,
            costType: "dado x casilla",
            message: "Mover Unidad"
        },
        attack: {
            costValue: import.meta.env.VITE_ATTACK_COST,
            costType: "dado",
            message: "Atacar"
        },
        objective: {
            costValue: "",
            costType: "",
            message: "Objetivo"
        },
        obtainCoins: {
            costValue: import.meta.env.VITE_COINS_DICE_CONVERSION,
            costType: "dados",
            message: "Obtener monedas"
        }
    };

    return (
        <div className="actionContainer" onClick={onClick} data-type={data.type}>
            <h4 className="actionName" data-type={data.type}>{actionDict[data.type].message}</h4>
            {actionDict[data.type].costValue != "" &&
                <p className="actionCost">{"Costo:"} {actionDict[data.type].costValue} {actionDict[data.type].costType}</p>
            }
        </div>
    )
}