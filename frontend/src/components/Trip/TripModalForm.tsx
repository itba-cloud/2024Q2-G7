import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export type FormDataTrip = {
    name: string,
    start_date: string,
    end_date: string,
    description: string
};

interface TripFormProps {
    trip: FormDataTrip | undefined;
    onSave: (trip: FormDataTrip) => void;
    onCancel: () => void;
    onEdit: boolean;
}

const TripForm: React.FC<TripFormProps> = ({ trip, onSave, onCancel, onEdit }) => {
    const { t } = useTranslation();
    
    const [name, setName] = useState(trip?.name || '');
    const [description, setDescription] = useState(trip?.description || '');
    const [startDate, setStartDate] = useState(trip?.start_date || '');
    const [endDate, setEndDate] = useState(trip?.end_date || '');

    const { register, handleSubmit, reset, setValue, formState: { errors }, }
        = useForm<FormDataTrip>({ criteriaMode: "all" })

    useEffect(() => {
        if (trip) {
            setName(trip.name || '');
            setDescription(trip.description || '');
            setStartDate(trip.start_date || '');
            setEndDate(trip.end_date || '');
        }
    }, [trip]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trip: FormDataTrip = { 
            name: name, 
            description: description,
            start_date: startDate, 
            end_date: endDate
        }
        onSave(trip);
        //TODO
    };

    //TODO chequear las validaciones

    return (
        <>
            { /* Overlay que oscurece el fondo */ }
            <div 
                className="modal-backdrop show" 
                style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.75)", zIndex: 1040 }}
            />

            { /* Modal principal */ }
            <div className="modal fade show mt-5 pt-3" tabIndex={-1} style={{ display: 'block' }} 
                aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title fw-bold fs-4" id="exampleModalLabel">
                                {onEdit ? t('Trips.editTrip') : t('Trips.createTrip')}
                            </h5>
                            <button type="button" className="btn-close"
                                    aria-label={t("AriaLabel.cancel")} title={t("AriaLabel.cancel")}
                                    onClick={onCancel}/>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={onSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="tripName" className="form-label">
                                        {t('Trips.name')}
                                        <span className="required-field">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        min="3" max="50"
                                        id="tripName"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="startDate" className="form-label">
                                        {t('Trips.startDate')}
                                        <span className="required-field">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="startDate"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="endDate" className="form-label">
                                        {t('Trips.endDate')}
                                        <span className="required-field">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="endDate"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">
                                        {t('Trips.description')}
                                        <span className="required-field">*</span>
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        rows={3}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                                <div className="modal-footer d-flex align-items-center justify-content-around">
                                    <button className="btn btn-cancel-form px-3 py-2"
                                        aria-label={t("AriaLabel.cancel")} title={t("AriaLabel.cancel")}
                                        onClick={onCancel}>
                                        {t('Button.cancel')}
                                    </button>
                                    <button type="submit" className='btn button-primary'
                                        aria-label={t("AriaLabel.confirm")} title={t("AriaLabel.confirm")}>
                                        {t('Button.confirm')}
                                    </button>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TripForm;
