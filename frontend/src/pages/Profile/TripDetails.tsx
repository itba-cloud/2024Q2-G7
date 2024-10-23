import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import TripForm from '../../components/Trip/TripModalForm';
import tripBackground from '../../images/tripBackground.jpg';
import { TripModel } from '../../types';
import { useAuthNew } from '../../context/AuthProvider';
import { AuthService } from '../../services/AuthService';

export default function TripDetails() {

    const { t } = useTranslation();
    const navigate = useNavigate();

    const AuthContext = useAuthNew();
    const session = AuthService.getSessionFromContext(AuthContext)
    const isLogged = AuthService.isLoggedIn(AuthContext)

    const [trip, setTrip] = useState<TripModel | undefined>(undefined)

    const { tripId } = useParams()
    let parsedTripId = "";
    if (typeof tripId === "string" ) {
        parsedTripId = tripId;
    }

    const [isLoading, setIsLoading] = useState(false)
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        document.title = `${t('PageName')} - ${t('PageTitles.tripDetails', { tripName: trip?.name })}`;
    }, [trip]);

    const handleEditTrip = (updatedTrip: { name: string; startDate: string; endDate: string; description: string }) => {
        // Aquí agregarías la lógica para actualizar el viaje
        // TODO
        //setTrip(prevTrip => ({ ...prevTrip, ...updatedTrip }));
        setShowModal(false);
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    return (
        <>
            <div className={`container mt-5 ${showModal ? 'modal-open' : ''}`}>
                <div className="content-blur">
                    <div className="card bg-dark text-white mb-4" style={{ overflow: "hidden" }}>
                        <img src={tripBackground} className="card-img" alt={trip?.name} style={{ opacity: 0.3, objectFit: "cover", width: "100%", height: "400px" }} />
                        <div className="card-img-overlay d-flex flex-column justify-content-center text-center">
                            <h1 className="card-title fw-bold display-4">{trip?.name}</h1>
                            <h3 className="mb-0">{trip?.description}</h3>
                            <div className="d-flex justify-content-center mt-4">
                                <div className="d-flex">
                                    <div className="me-4">
                                        <h5 className="fw-bold text-decoration-underline">{t('Trips.startDate')}</h5>
                                        <p className="fs-5 mb-0">{trip?.startDate}</p>
                                    </div>
                                    <div>
                                        <h5 className="fw-bold text-decoration-underline">{t('Trips.endDate')}</h5>
                                        <p className="fs-5 mb-0">{trip?.endDate}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
    
                    <div className="card mb-1 shadow-lg">
                        <div className="card-body">
                            TODO PONER LA EXPERIENCIAS DEL VIAJE
                        </div>
                    </div>
    
                    <div className="d-flex align-items-center justify-content-center mb-4">
                        <button type="button" className='btn button-primary mx-3'
                                aria-label={t("Trips.editTrip")} title={t("Trips.editTrip")}
                                 onClick={() => setShowModal(true)}>
                            {t('Trips.editTrip')}
                        </button>
                    </div>
                </div>
    
                {showModal && (
                    <TripForm
                        trip={trip}
                        onSave={handleEditTrip}
                        onCancel={handleCancel}
                        onEdit={true}
                    />
                )}
            </div>
        </>
    );    
}
