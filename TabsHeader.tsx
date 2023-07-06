import React from 'react'

function TabsHeader({handles, activeTab, tienda, handleTabClick}) {

    const tiendasLima = tienda.filter((sla: any) => sla.deliveryChannel == "pickup-in-point" && sla.pickupStoreInfo.address.city === 'Lima')
    const tiendasProvincias = tienda.filter((sla: any) => sla.deliveryChannel == "pickup-in-point" && sla.pickupStoreInfo.address.city !== 'Lima')

    return (
        <div className={handles.tabs__header}>
            <div className={`${handles.tabs__item} ${activeTab === 0 ? handles.active : ''}`} onClick={() => handleTabClick(0)}>
                Lima (<span>{tiendasLima.length}</span>)
            </div>
            <div className={`${handles.tabs__item} ${activeTab === 1 ? handles.active : ''}`} onClick={() => handleTabClick(1)}>
                Provincia (<span>{tiendasProvincias.length}</span>)
            </div>
        </div>
    )
}

export default TabsHeader;