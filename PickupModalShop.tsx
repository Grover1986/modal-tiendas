import './PickupModalShop.css'
import React, { useState, useEffect } from "react";
import { TranslateEstimate } from 'vtex.shipping-estimate-translator'
import { useProduct } from 'vtex.product-context'
import { ModalTrigger, Modal, ModalHeader, CloseButton } from "vtex.modal-layout";
import { Wrapper } from "vtex.add-to-cart-button";
import { isThereOnlyPickupPoint, getDefaultSeller, getDirection, getSimulation, setItem } from "./utils";
import { useCssHandles } from 'vtex.css-handles'

import Table from "./Table";

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
    const [tiendasLima, setTiendasLima] = useState<Store[]>([]);
    const [tiendasProvincias, setTiendasProvincias] = useState<Store[]>([]);
    const [activeTab, setActiveTab] = useState(0);
    const [isWideScreen, setIsWideScreen] = useState(false);
    const [filteredTiendasLima, setFilteredTiendasLima] = useState<Store[] | null>(null);
    const [filteredTiendasProvincias, setFilteredTiendasProvincias] = useState<Store[] | null>(null);
    const [search, setSearch] = useState("");
    const [isTherePickupPoint, setIsTherePickupPoint] = useState<boolean>(false);

    const handleTabClick = (index: number) => {
        setActiveTab(index);
    };

    const filterTiendas = (district: string) => {
        const filteredLima = tiendasLima.filter((tienda) =>
            tienda.pickupStoreInfo?.address?.neighborhood?.toLowerCase().includes(district.toLowerCase()) || tienda.pickupStoreInfo?.address?.street?.toLowerCase().includes(district.toLowerCase())
        );
        const filteredProvincias = tiendasProvincias.filter((tienda) =>
            tienda.pickupStoreInfo?.address?.street?.toLowerCase().includes(district.toLowerCase()) || tienda.pickupStoreInfo?.address?.neighborhood?.toLowerCase().includes(district.toLowerCase())
        );
        setFilteredTiendasLima(filteredLima);
        setFilteredTiendasProvincias(filteredProvincias);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const district = e.target.value;
        setSearch(district);
        if (district.length !== 0) {
            filterTiendas(district);
        } else {
            setFilteredTiendasLima(null);
            setFilteredTiendasProvincias(null);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setIsWideScreen(window.innerWidth >= 768);
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        // limpiamos el listener al desmontar el componente
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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

                setIsTherePickupPoint(isThereOnlyPickupPoint(response));

                if (isThereOnlyPickupPoint(response)) {
                    const responsePickupPointLima = response.logisticsInfo[0].slas.filter((sla: any) => sla.deliveryChannel == "pickup-in-point" && sla.pickupStoreInfo.address.city === 'Lima');
                    const responsePickupPointProvincias = response.logisticsInfo[0].slas.filter((sla: any) => sla.deliveryChannel == "pickup-in-point" && sla.pickupStoreInfo.address.city !== 'Lima');
                    console.log('IS ONLY PICKUP POINT:', isThereOnlyPickupPoint(response));

                    setTiendasLima(responsePickupPointLima);
                    setTiendasProvincias(responsePickupPointProvincias);

                    console.log('TIENDAS EN LIMA Y PROVINCIAS:', response.logisticsInfo[0].slas);
                    console.log('TIENDAS EN LIMA: ', responsePickupPointLima);
                    console.log('TIENDAS EN PROVINCIAS: ', responsePickupPointProvincias);
                } else {
                    setTiendasLima([]);
                    setTiendasProvincias([]);
                    console.log('NOT IS ONLY PICKUP POINT:', isThereOnlyPickupPoint(response));
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
                            <input className={handles.input_search} value={search} type="text" onChange={handleSearchChange} placeholder="Encuentra tu tienda por Distrito" />
                        </div>
                        {isWideScreen ? (
                            <div className={handles.table}>
                                <Table
                                    filteredTiendasLima={filteredTiendasLima}
                                    filteredTiendasProvincias={filteredTiendasProvincias}
                                    tiendasLima={tiendasLima}
                                    tiendasProvincias={tiendasProvincias}
                                    handles={handles}
                                />
                            </div>
                        ) : (
                            <div className={handles.tabs__container}>
                                <div className={handles.tabs__header}>
                                    <div className={`${handles.tabs__item} ${activeTab === 0 ? handles.active : ""}`} onClick={() => handleTabClick(0)}>
                                        Lima (<span>{filteredTiendasLima ? filteredTiendasLima.length : tiendasLima.length}</span>)
                                    </div>
                                    <div className={`${handles.tabs__item} ${activeTab === 1 ? handles.active : ""}`} onClick={() => handleTabClick(1)}>
                                        Provincia (<span>{filteredTiendasProvincias ? filteredTiendasProvincias.length : tiendasProvincias.length}</span>)
                                    </div>
                                </div>
                                <div className={handles.tabs__content}>
                                    {activeTab === 0 && (
                                        <div className={handles.tabs__contentTiendas}>
                                            {filteredTiendasLima
                                                ? filteredTiendasLima.map((tienda) => (
                                                    <div key={tienda.id} className={handles.tabs__rowTienda}>
                                                        <p className={handles.recojoTienda_tienda}>{tienda.pickupStoreInfo.friendlyName}</p>
                                                        <span className={handles.recojoTienda_direccion}>{tienda.pickupStoreInfo.address.street}</span>
                                                        <span className={handles.recojoTienda_horario}>{<TranslateEstimate scheduled={tienda.availableDeliveryWindows[0]} />}</span>
                                                    </div>
                                                ))
                                                : tiendasLima.map((tienda) => (
                                                    <div key={tienda.id} className={handles.tabs__rowTienda}>
                                                        <p className={handles.recojoTienda_tienda}>{tienda.pickupStoreInfo.friendlyName}</p>
                                                        <span className={handles.recojoTienda_direccion}>{tienda.pickupStoreInfo.address.street}</span>
                                                        <span className={handles.recojoTienda_horario}>{<TranslateEstimate scheduled={tienda.availableDeliveryWindows[0]} />}</span>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                    {activeTab === 1 && (
                                        <div className={handles.tabs__contentProvincias}>
                                            {filteredTiendasProvincias
                                                ? filteredTiendasProvincias.map((tienda) => (
                                                    <div key={tienda.id} className={handles.tabs__rowTienda}>
                                                        <p className={handles.recojoTienda_tienda}>{tienda.pickupStoreInfo.friendlyName}</p>
                                                        <span className={handles.recojoTienda_direccion}>{tienda.pickupStoreInfo.address.street}</span>
                                                        <span className={handles.recojoTienda_horario}>{<TranslateEstimate scheduled={tienda.availableDeliveryWindows[0]} />}</span>
                                                    </div>
                                                ))
                                                : tiendasProvincias.map((tienda) => (
                                                    <div key={tienda.id} className={handles.tabs__rowProvincia}>
                                                        <p className={handles.recojoTienda_tienda}>{tienda.pickupStoreInfo.friendlyName}</p>
                                                        <span className={handles.recojoTienda_direccion}>{tienda.pickupStoreInfo.address.street}</span>
                                                        <span className={handles.recojoTienda_horario}>{<TranslateEstimate scheduled={tienda.availableDeliveryWindows[0]} />}</span>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        <div className={handles.btn_add}>
                            <Wrapper customPixelEventId="addToCartModalTiendas" addToCartFeedback="customEvent" text="Agregar al carrito" />
                        </div>
                    </div>
                </Modal>
            </ModalTrigger>
        </div>
    );
};

export default PickupModalShop;
