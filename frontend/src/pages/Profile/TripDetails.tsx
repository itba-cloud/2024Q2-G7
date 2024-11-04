import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import TripForm, { FormDataTrip } from '../../components/Trip/TripModalForm';
import tripBackground from '../../images/tripBackground.jpg';
import { ExperienceModel, TripModel } from '../../types';
import { useAuthNew } from '../../context/AuthProvider';
import { AuthService } from '../../services/AuthService';
import DataLoader from '../../components/DataLoader';
import { tripModel } from '../../common/mocks';
import ic_no_search from "../../images/ic_no_search.jpeg";
import { serviceHandler } from '../../scripts/serviceHandler';
import { userService } from '../../services';
import { IconButton } from "@mui/material"
import EditIcon from "@mui/icons-material/Edit";
import CardExperience from '../../components/Experience/CardExperience';

export default function TripDetails() {

    const { t } = useTranslation();
    const navigate = useNavigate();

    const AuthContext = useAuthNew();
    const session = AuthService.getSessionFromContext(AuthContext)

    const location = useLocation();
    const tripFromState = location.state?.trip; 

    const [trip, setTrip] = useState<TripModel | undefined>(undefined)
    const { tripId } = useParams<{tripId: string}>()
    let parsedTripId = "";
    if (typeof tripId === "string" ) {
        parsedTripId = tripId;
    }

    const [experiences, setExperiences] = useState<ExperienceModel[]>(new Array(0))

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingExperiences, setIsLoadingExperiences] = useState(false)
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        if (tripFromState) {
            setTrip(tripFromState);
            document.title = `${t('PageName')} - ${t('PageTitles.tripDetails', { tripName: tripFromState.name })}`;
            setIsLoading(false); 
        } else {
            serviceHandler(
                userService.getUserTripById(session.id, parsedTripId),
                navigate, (trip) => {
                    setTrip(trip);
                    document.title = `${t('PageName')} - ${t('PageTitles.tripDetails', { tripName: trip.name })}`;
                },
                () => { setIsLoading(false); },
                () => { setTrip(undefined); }
            );
        }
        setIsLoadingExperiences(true);
        serviceHandler(
            userService.getTripExperiences(session.id, parsedTripId),
            navigate, (experiences) => {
                setExperiences(experiences);
            },
            () => { setIsLoadingExperiences(false); },
            () => { setExperiences(new Array(0)); }
        );
    }, []);

    const handleEditTrip = (updatedTrip: FormDataTrip) => {
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
            {isLoading && isLoadingExperiences ? 
                <DataLoader spinnerMultiplier={2} isLoading={isLoading && isLoadingExperiences}>
                    <div/>
                </DataLoader>
            : 
                <div className={`container mt-5 ${showModal ? 'modal-open' : ''}`}>
                    <div className="content-blur">
                        <div className="card bg-dark text-white mb-4" style={{ overflow: "hidden" }}>
                            <img src={tripBackground} className="card-img" alt={trip?.name} style={{ opacity: 0.3, objectFit: "cover", width: "100%", height: "400px" }} />
                            <div className="card-img-overlay d-flex flex-column justify-content-center text-center">
                                {/* Icono de editar en la esquina superior derecha */}
                                <div className="position-absolute top-0 end-0 p-2">
                                    <IconButton 
                                        style={{ color: '#fff' }}
                                        onClick={() => { setShowModal(true) }}
                                        aria-label={t("Trips.editTrip")} title={t("Trips.editTrip")}
                                    >
                                        <EditIcon style={{ fontSize: "xx-large" }} />
                                    </IconButton>
                                </div>
                                
                                <h1 className="card-title fw-bold display-4">{trip?.name}</h1>
                                <h3 className="mb-0">{trip?.description}</h3>
                                <div className="d-flex justify-content-center mt-4">
                                    <div className="d-flex">
                                        <div className="me-4">
                                            <h5 className="fw-bold text-decoration-underline">{t('Trips.startDate')}</h5>
                                            <p className="fs-5 mb-0">{trip?.start_date}</p>
                                        </div>
                                        <div>
                                            <h5 className="fw-bold text-decoration-underline">{t('Trips.endDate')}</h5>
                                            <p className="fs-5 mb-0">{trip?.end_date}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card mb-1 shadow-lg">
                            {experiences.length === 0 ?
                                <div className="d-flex justify-content-center align-content-center">
                                    <img src={ic_no_search} className="ic_no_search" alt="Imagen lupa" style={{maxHeight: "300px"}} />
                                    <h3 className="d-flex align-self-center">
                                        {t('Trips.noExperiences')}
                                    </h3>
                                </div>
                                :
                                <div className="d-flex flex-wrap justify-content-center">
                                    {experiences.map((experience) => (
                                        <CardExperience experience={experience} key={experience.id} fav={false} />
                                    ))}
                                </div>
                            }
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
            }
        </>
    );
}
