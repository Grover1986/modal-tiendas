import React from 'react'
import TiendaInfo from './TiendaInfo';

const msg = {
    lima: `Al parecer el producto no cuenta con recojo en <strong>tiendas de Lima</strong>. Lo sentimos.`,
    province: `Al parecer el producto no cuenta con recojo en <strong>tiendas de provincia</strong>. Lo sentimos.`
};

function TabContent ({activeTab, handles, tienda}) {

    const tiendasLima = tienda.filter((sla: any) => sla.deliveryChannel == "pickup-in-point" && sla.pickupStoreInfo.address.city === 'Lima')
    const tiendasProvincias = tienda.filter((sla: any) => sla.deliveryChannel == "pickup-in-point" && sla.pickupStoreInfo.address.city !== 'Lima')

    return (
        <div className={handles.tabs__content}>
            {
                activeTab === 0 && (
                    <div className={handles.tabs__contentTiendas}>
                        {
                            tiendasLima.length > 0 ? (
                                tiendasLima.map((tienda) => (
                                    <div key={tienda.id} className={handles.tabs__rowTienda}>
                                        <TiendaInfo tienda={tienda} handles={handles} />
                                    </div>
                                ))
                            ) : (
                                <TiendaInfo errorMessage={msg.lima} handles={handles} />
                            )
                        }
                    </div>
                )
            }
            {
                activeTab === 1 && (
                    <div className={handles.tabs__contentProvincias}>
                        {
                            tiendasProvincias.length > 0 ? (
                                tiendasProvincias.map((tienda) => (
                                    <div key={tienda.id} className={handles.tabs__rowTienda}>
                                        <TiendaInfo tienda={tienda} handles={handles} />
                                    </div>
                                ))
                            ) : (
                                <TiendaInfo errorMessage={msg.province} handles={handles} />
                            )
                        }
                    </div>
                )
            }
        </div>
    )
}

export default TabContent;