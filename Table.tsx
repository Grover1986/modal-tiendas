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

interface TableProps {
    tiendas: Store[];
    handles: Record<string, string | undefined>;
}

const msg = {
    lima: `Al parecer el producto no cuenta con recojo en <strong>tiendas de Lima</strong>. Lo sentimos.`,
    province: `Al parecer el producto no cuenta con recojo en <strong>tiendas de provincia</strong>. Lo sentimos.`
};

const Table = ({ tiendas, handles }: TableProps) => {

    const tiendasLima = tiendas.filter((sla: any) => sla.deliveryChannel == "pickup-in-point" && sla.pickupStoreInfo.address.city === 'Lima');
    const tiendasProvincias = tiendas.filter((sla: any) => sla.deliveryChannel == "pickup-in-point" && sla.pickupStoreInfo.address.city !== 'Lima');

    return (
        <table className={handles.table__content}>
            <thead>
                <tr>
                    <th className={handles.table__head}>
                        Tiendas Lima ({tiendasLima.length})
                    </th>
                    <th className={handles.table__head}>
                        Tiendas provincia ({tiendasProvincias.length})
                    </th>
                </tr>
            </thead>
            <tbody>
                {tiendasLima.length > 0 && tiendasProvincias.length > 0 ? (
                    <>
                        {tiendasLima.map((tienda, index) => (
                            <tr className={handles.table__row} key={index}>
                                <td className={handles.table__column}>
                                    <TiendaInfo tienda={tienda} handles={handles} />
                                </td>
                                <td className={handles.table__column}>
                                    <TiendaInfo tienda={tiendasProvincias[index]} handles={handles} />
                                </td>
                            </tr>
                        ))}
                    </>
                ) : tiendasLima.length > 0 ? (
                    <>
                        {tiendasLima.map((tienda, index) => (
                            <tr className={`${handles.table__row} ${tiendasLima.length > 1 ? handles.none : handles.table__row}` } key={index}>
                                <td className={handles.table__column}>
                                    <TiendaInfo tienda={tienda} handles={handles} />
                                </td>
                                <td className={handles.table__column}>
                                    <TiendaInfo errorMessage={msg.province} handles={handles} />
                                </td>
                            </tr>
                        ))}
                    </>
                ) : tiendasProvincias.length > 0 ? (
                    <>
                        {tiendasProvincias.map((tienda, index) => (
                            <tr className={`${handles.table__row} ${tiendasProvincias.length > 1 ? handles.none : handles.table__row}` } key={index}>
                                <td className={handles.table__column}>
                                    <TiendaInfo errorMessage={msg.lima} handles={handles}  />
                                </td>
                                <td className={handles.table__column}>
                                    <TiendaInfo tienda={tienda} handles={handles} />
                                </td>
                            </tr>
                        ))}
                    </>
                ) : (
                    <tr className={handles.table__row}>
                        <td className={handles.table__column}>
                            <TiendaInfo errorMessage={msg.lima} handles={handles} />
                        </td>
                        <td className={handles.table__column}>
                            {tiendasProvincias.length > 0 ? (
                                <TiendaInfo tienda={tiendasProvincias[0]} handles={handles} />
                            ) : (
                                <TiendaInfo errorMessage={msg.province} handles={handles} />
                            )}
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default Table;
