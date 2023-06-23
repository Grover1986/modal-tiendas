import React from "react";

import TiendaInfo from "./TiendaInfo";
import TiendasProvincia from "./TiendasProvincia";
import TiendasLima from "./TiendasLima";

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

interface TableContentProps {
    filteredTiendasLima: Store[] | null;
    filteredTiendasProvincias: Store[] | null;
    tiendasLima: Store[];
    tiendasProvincias: Store[];
    handles: Record<string, string | undefined>;
}

const msg = {
    lima: `Al parecer el producto no cuenta con recojo en <strong>tiendas de Lima</strong>. Lo sentimos.`,
    province: `Al parecer el producto no cuenta con recojo en <strong>tiendas de provincia</strong>. Lo sentimos.`
};

const TableContent = ({ filteredTiendasLima, filteredTiendasProvincias, tiendasLima, tiendasProvincias, handles }: TableContentProps) => {

    if ((filteredTiendasLima && filteredTiendasLima.length > 0) || (filteredTiendasProvincias && filteredTiendasProvincias.length > 0)) {
        return (
            <tr className={handles.table__row}>
                {filteredTiendasLima && <TiendasLima tiendas={filteredTiendasLima} handles={handles} />}
                {filteredTiendasProvincias && <TiendasProvincia tiendas={filteredTiendasProvincias} handles={handles} />}
            </tr>
        );
    }
    if ((filteredTiendasLima && filteredTiendasLima.length === 0) && (filteredTiendasProvincias && filteredTiendasProvincias.length === 0)) {
        return (
            <tr className={handles.table__row}>
                {filteredTiendasLima && <TiendaInfo errorMessage={`${msg.lima} hhh`} handles={handles} />}
                {filteredTiendasProvincias && <TiendaInfo errorMessage={msg.province} handles={handles} />}
            </tr>
        );
    }

    // if ((filteredTiendasLima && filteredTiendasLima.length === 0) && (filteredTiendasProvincias && filteredTiendasProvincias.length > 0)) {
    //     return (
    //         <tr className={handles.table__row}>
    //             {filteredTiendasLima && <TiendaInfo errorMessage={`${msg.lima} ccc`} handles={handles} />}
    //             {filteredTiendasProvincias && <TiendasProvincia tiendas={filteredTiendasProvincias} handles={handles} />}
    //         </tr>
    //     );
    // }

    // if ((filteredTiendasLima && filteredTiendasLima.length > 0) && (filteredTiendasProvincias && filteredTiendasProvincias.length === 0)) {
    //     return (
    //         <tr className={handles.table__row}>
    //             {filteredTiendasLima && <TiendasLima tiendas={filteredTiendasLima} handles={handles} />}
    //             {filteredTiendasProvincias && <TiendaInfo errorMessage={`${msg.province} ttt` } handles={handles} />}
    //         </tr>
    //     );
    // }

    const maxLongitud = Math.max(tiendasLima.length, tiendasProvincias.length);

    return (
        <>
            {Array.from({ length: maxLongitud }, (_, index) => {
                const tiendaLima = tiendasLima[index];
                const tiendaProvincia = tiendasProvincias[index];

                return (
                    <tr className={handles.table__row} key={index}>
                        <td className={handles.table__column}>
                            {tiendaLima && (
                                <TiendaInfo
                                    tienda={tiendaLima}
                                    handles={handles}
                                />
                            )}
                        </td>
                        <td className={handles.table__column}>
                            {tiendaProvincia && (
                                <TiendaInfo
                                    tienda={tiendaProvincia}
                                    handles={handles}
                                />
                            )}
                        </td>
                    </tr>
                );
            })}
        </>
    );
};

export default TableContent;
