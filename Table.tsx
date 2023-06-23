import React from "react";

import TableContent from "./TableContent";

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
    filteredTiendasLima: Store[] | null;
    filteredTiendasProvincias: Store[] | null;
    tiendasLima: Store[];
    tiendasProvincias: Store[];
    handles: Record<string, string | undefined>;
}

const Table = ({ filteredTiendasLima, filteredTiendasProvincias, tiendasLima, tiendasProvincias, handles }: TableProps) => {
    return (
        <table className={handles.table__content}>
            <thead>
                <tr>
                    <th className={handles.table__head}>
                        Tiendas Lima ({filteredTiendasLima ? filteredTiendasLima.length : tiendasLima.length})
                    </th>
                    <th className={handles.table__head}>
                        Tiendas provincia ({filteredTiendasProvincias ? filteredTiendasProvincias.length : tiendasProvincias.length})
                    </th>
                </tr>
            </thead>
            <tbody>
                <TableContent
                    filteredTiendasLima={filteredTiendasLima}
                    filteredTiendasProvincias={filteredTiendasProvincias}
                    tiendasLima={tiendasLima}
                    tiendasProvincias={tiendasProvincias}
                    handles={handles}
                />
            </tbody>
        </table>
    );
};

export default Table;
