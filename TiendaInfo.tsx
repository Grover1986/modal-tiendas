import React from "react";
import { TranslateEstimate } from "vtex.shipping-estimate-translator";

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

interface TiendaInfoProps {
    tienda?: Store;
    handles: Record<string, string | undefined>;
    errorMessage?: string;
}

const TiendaInfo = ({ tienda, handles, errorMessage = ''}: TiendaInfoProps) => {

    if (!tienda) return <p className={handles.recojoTienda_msg} dangerouslySetInnerHTML={{__html:errorMessage}} />

    return (
        <>
            <p className={handles?.recojoTienda_tienda}>
                {tienda.pickupStoreInfo.friendlyName}
            </p>
            <span className={handles?.recojoTienda_direccion}>
                {`${tienda.pickupStoreInfo.address.street} ${tienda.pickupStoreInfo.address.neighborhood}`}
            </span>
            <span className={handles?.recojoTienda_horario}>
                <TranslateEstimate scheduled={tienda.availableDeliveryWindows[0]} />
            </span>
        </>
    );
};

export default TiendaInfo;
