import { useTranslation } from "react-i18next";
import "../../common/i18n/index";
import React from "react";
import { Link } from 'react-router-dom';
import { TripModel } from "../../types";

export default function CardTrip(props: { trip: TripModel }) {
    
    const { t } = useTranslation();
    const { trip } = props;

    return (
        <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column justify-content-between">
                <h3 className="card-title text-center text-decoration-underline fs-2">
                    {trip.name}
                </h3>
                <p className="card-text text-left px-2">
                    <strong>{t('Trips.startDate')}</strong> {trip.startDate}
                </p>
                <p className="card-text text-left px-2">
                    <strong>{t('Trips.endDate')}</strong> {trip.endDate}
                </p>
                <p className="card-text text-left px-2 fs-5">
                    {trip.description}
                </p>
                <div className="d-flex justify-content-center mt-0">
                    <Link to={`/user/trips/${trip.id}`} className="btn btn-trip-detail">
                        {t("Ver detalles")}
                    </Link>
                </div>
            </div>
        </div>
    );
}
