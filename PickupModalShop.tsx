import './PickupModalShop.css'
import Table from "./Table";
import TabsHeader from './TabsHeader';
import TabContent from './TabContent';
import React, { useState, useEffect, useMemo } from "react";
import { TranslateEstimate } from 'vtex.shipping-estimate-translator'
import { useProduct } from 'vtex.product-context'
import { ModalTrigger, Modal, ModalHeader, CloseButton } from "vtex.modal-layout";
import { Wrapper } from "vtex.add-to-cart-button";
import { isThereOnlyPickupPoint, getDefaultSeller, getDirection, getSimulation, setItem } from "./utils";
import { useCssHandles } from 'vtex.css-handles'
import { useDevice } from 'vtex.device-detector'

type Props = {};

const CSS_HANDLES = [
    'recojoTienda_container',
    'recojoTienda_close',
    'recojoTienda_text',
    'recojoTienda_title',
    'recojoTienda_subTitle',
    'recojoTienda_search',
    'recojoTienda_text_mob',
    'recojoTienda_title_mob',
    'recojoTienda_subTitle_mob',
    'recojoTienda_tienda',
    'recojoTienda_btn_search',
    'recojoTienda_direccion',
    'recojoTienda_horario',
    'recojoTienda_msg',
    'tabs__header',
    'tabs__item',
    'tabs__container',
    'tabs__content',
    'tabs__contentTiendas',
    'tabs__contentProvincias',
    'tabs__rowTienda',
    'tabs__rowProvincia',
    'none',
    'active',
    'table',
    'table__content',
    'table__head',
    'table__row',
    'table__column',
    'input_search',
    'btn_add',
    'openModal_btn',
    'btn_close',
    'btn_add_vtex'
]

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

const PickupModalShop = (props: Props) => {
    const { handles } = useCssHandles(CSS_HANDLES);
    const selectedItem = useProduct()?.selectedItem;
    const skuId = selectedItem?.itemId;
    const seller = getDefaultSeller(selectedItem?.sellers);
    const sellerId = seller?.sellerId;

    // States
    const [tiendas, setTiendas] = useState<Store[]>([])
    const { isMobile } = useDevice()
    const [activeTab, setActiveTab] = useState(0);
    const [searchInput, setSearchInput] = useState("");
    const [isTherePickupPoint, setIsTherePickupPoint] = useState<boolean>(false);

    const handleTabClick = (index: number) => {
        setActiveTab(index);
    };

    const openMiniCart = () => {
       const element = document?.querySelector('.vtex-minicart-2-x-openIconContainer--minicart-v2 > button');

        if (element instanceof HTMLElement) {
            element.click();
          }
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const district = e.target.value;
        setSearchInput(district)
    };

    const tiendasFiltradas = useMemo(() => {
        if(!searchInput){
           return tiendas 
        }
        return tiendas.filter((tienda: any)=>{
            return tienda?.pickupStoreInfo?.address?.neighborhood?.toLowerCase()?.includes(searchInput.toLowerCase()) || tienda?.pickupStoreInfo?.address?.street?.toLowerCase().includes(searchInput.toLowerCase())
        })
        
    }, [tiendas, searchInput])


    useEffect(() => {
        load();

        async function load() {
            console.log('Mi SKU:', skuId);
            console.log('Mi SellerID:', sellerId);
            console.log('SELECTED ITEM ', selectedItem);

            const defaultDirection = {
                country: 'PER',
                postalCode: "150101",
                geoCoordinates: ["-76.9713889", "-12.1025"]
            };

            if (skuId && sellerId) {
                let response: any;
                response = await getSimulation(skuId, sellerId, undefined, defaultDirection.postalCode, defaultDirection.geoCoordinates);

                if (isThereOnlyPickupPoint(response)) {
                    setIsTherePickupPoint(true)
                    setTiendas(response.logisticsInfo[0].slas)
                    console.log('SÓLO TIENE RECOJO EN TIENDA');
                } else {
                    setIsTherePickupPoint(false)
                    setTiendas([])
                    console.log('NO SÓLO TIENE RECOJO EN TIENDA');
                }
            }
        }
    }, [skuId, sellerId]);

    if (!isTherePickupPoint) {
        return <div className={handles.btn_add_vtex}><Wrapper text="Agregar al carrito" /></div>
    }

    return (
        <div>

            <ModalTrigger>
                <button className={handles.openModal_btn}>Agregar al carrito</button>

                <Modal customPixelEventId="addToCartModalTiendas" customPixelEventName="addToCart">
                    <div className={handles.recojoTienda_container}>
                        <div className={handles.recojoTienda_close}>
                            <CloseButton label="X" />
                        </div>
                        <div className={handles.recojoTienda_text}>
                            <h2 className={handles.recojoTienda_title}>Este producto solo cuenta con retiro en tienda, revisa las tiendas disponibles:</h2>
                            <p className={handles.recojoTienda_subTitle}>Busca cerca a tu zona para ver la disponibilidad de tiendas</p>
                        </div>
                        <div className={handles.recojoTienda_text_mob}>
                            <h2 className={handles.recojoTienda_title_mob}>Antes de agregar tu producto al carrito revisa las tiendas disponibles</h2>
                            <p className={handles.recojoTienda_subTitle_mob}> Recuerda que tendrás 72 horas a partir de la fecha seleccionada para recoger tu pedido; luego de este plazo, el pedido se anulará.</p>
                        </div>
                        <div className={handles.recojoTienda_search}>
                            <button className={handles.recojoTienda_btn_search}>
                                <svg width="22" height="45" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M21.2827 20.2174L16.3552 15.2899C19.5154 11.607 19.2092 6.08714 15.6609 2.77634C12.1127 -0.534458 6.58493 -0.458282 3.12929 2.94903C-0.326356 6.35635 -0.480377 11.8825 2.78012 15.477C6.04062 19.0715 11.5556 19.4555 15.2827 16.3474L20.2177 21.2824C20.3585 21.4244 20.5502 21.5043 20.7502 21.5043C20.9502 21.5043 21.1419 21.4244 21.2827 21.2824C21.4247 21.1416 21.5046 20.9499 21.5046 20.7499C21.5046 20.55 21.4247 20.3583 21.2827 20.2174ZM9.50021 16.9474C6.46198 16.9474 3.72394 15.1143 2.56623 12.3053C1.40851 9.4963 2.05986 6.26634 4.21575 4.12555C6.37163 1.98475 9.60609 1.35611 12.4069 2.53353C15.2077 3.71094 17.0215 6.46179 17.0002 9.49994C16.9714 13.6216 13.6219 16.9474 9.50021 16.9474Z" fill="#878C8F" />
                                </svg>
                            </button>
                            <input className={handles.input_search} value={searchInput} type="text" onChange={handleSearchChange} placeholder="Encuentra tu tienda por Distrito" />
                        </div>
                        {!isMobile ? (
                            <div className={handles.table}>
                                <Table
                                    tiendas={tiendasFiltradas}
                                    handles={handles}
                                />
                            </div>
                        ) : (
                            <div className={handles.tabs__container}>
                                <TabsHeader 
                                    activeTab={activeTab}
                                    handles={handles}
                                    tienda={tiendasFiltradas}
                                    handleTabClick={handleTabClick}
                                />
                                <TabContent 
                                    activeTab={activeTab}
                                    handles={handles}
                                    tienda={tiendasFiltradas}
                                />
                            </div>
                        )}
                        <div onClick={openMiniCart} className={handles.btn_add}>
                            <Wrapper customPixelEventId="addToCartModalTiendas" addToCartFeedback="customEvent" text="Agregar al carrito" />
                        </div>
                    </div>
                </Modal>
            </ModalTrigger>
        </div>
    );
};

export default PickupModalShop;
