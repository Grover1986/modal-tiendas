import React from "react";

import TiendaInfo from "./TiendaInfo";

interface StoreInfo {
    friendlyName: string;
    address: {
        street: string;
        neighborhood: string;
    };
}

interface DeliveryWindow { }

interface Store {
    id: string;
    pickupStoreInfo: StoreInfo;
    availableDeliveryWindows: DeliveryWindow[];
}

interface TiendasLimaProps {
    tiendas: Store[];
    handles: Record<string, string | undefined>;
}

const msg = {
    lima: `Al parecer el producto no cuenta con recojo en <strong>tiendas de Lima</strong>. Lo sentimos.`,
    province: `Al parecer el producto no cuenta con recojo en <strong>tiendas de provincia</strong>. Lo sentimos.`
};

const TiendasLima = ({ tiendas, handles }: TiendasLimaProps) => {
    if (tiendas.length === 0) {
        return <TiendaInfo errorMessage={msg.lima} handles={handles} />
        (
            <tr className={handles.table__row}>
                {/* <td className={handles.table__column}></td> */}
                {/* <td className={handles.table__column}> */}
                    
                {/* </td> */}
            </tr>
        );
    }

    return (
        <>
            {tiendas.map((tienda) => (
                <tr className={handles.table__row} key={tienda.id}>
                    <td className={handles.table__column}>
                        <TiendaInfo tienda={tienda} handles={handles} />
                    </td>
                    {/* <td className={handles.table__column}></td> */}
                </tr>
            ))}
        </>
    );
};

export default TiendasLima;
