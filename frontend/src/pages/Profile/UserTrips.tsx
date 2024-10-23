import React, { useEffect, useState } from "react"
import { useTranslation } from 'react-i18next';
import CardTrip from '../../components/Trip/CardTrip';
import TripForm from '../../components/Trip/TripModalForm';
import { TripModel } from '../../types';
import { useAuthNew } from "../../context/AuthProvider";
import { AuthService } from "../../services/AuthService";
import { serviceHandler } from "../../scripts/serviceHandler";
import { userService } from "../../services";
import { useNavigate } from "react-router-dom";
import DataLoader from "../../components/DataLoader";
import ic_no_search from "../../images/ic_no_search.jpeg";

export default function UserTrips() {

    const { t } = useTranslation();
    const navigate = useNavigate()

    const AuthContext = useAuthNew();
    const session = AuthService.getSessionFromContext(AuthContext)

    const [trips, setTrips] = useState<TripModel[]>(new Array(0));
    const [showModal, setShowModal] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        document.title = `${t('PageName')} - ${t('PageTitles.userTrips')}`
        setIsLoading(true);
        serviceHandler(
            userService.getUserTrips(session.id),
            navigate, (trips) => { setTrips(trips)},
            () => { setIsLoading(false); },
            () => { setTrips(new Array(0)) }
        )
    }, [])

    const handleCreateTrip = (trip: { name: string; startDate: string; endDate: string; description: string }) => {
        // Aquí agregarías la lógica para guardar el nuevo viaje
        //TODO
        setShowModal(false);
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    return (
        <DataLoader spinnerMultiplier={2} isLoading={isLoading}>
            <div className={`container-fluid p-0 my-3 d-flex flex-column justify-content-center ${showModal ? 'modal-open' : ''}`}>
                <div className="content-blur">
                    <div className="d-flex justify-content-between align-items-center">
                        <button className="btn button-add-to-trips" type="button"
                            style={{ whiteSpace: "nowrap", marginLeft: "50px" }}
                            aria-label={t("Trips.createTrip")} title={t("Trips.createTrip")}
                            onClick={() => {
                                setShowModal(true);
                            }}>
                                {t('Trips.createTrip')}
                        </button>
    
                        <h3 className="title text-center m-0" style={{ flexGrow: 1 }}>
                            {t('User.tripsTitle')}
                        </h3>
    
                        <div style={{ width: '250px' }}></div>
                    </div>
    
                    <div className="row justify-content-center mx-5 mt-4">
                        {trips.length === 0 ? 
                            <div className="d-flex justify-content-center align-content-center">
                                <img src={ic_no_search} className="ic_no_search" alt="Imagen lupa" />
                                <h2 className="d-flex align-self-center">
                                    {t('User.noTrips')}
                                </h2>
                            </div>
                            :
                            <>
                                {trips.map(trip => (
                                    <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={trip.id}>
                                        <CardTrip trip={trip} />
                                    </div>
                                ))}
                            </>
                        }
                    </div>
                </div>
    
                {showModal && (
                    <TripForm
                        trip={undefined}
                        onSave={handleCreateTrip}
                        onCancel={handleCancel}
                        onEdit={false}
                    />
                )}
            </div>
        </DataLoader>
    );    
}
