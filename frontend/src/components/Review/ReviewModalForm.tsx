import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import StarRoundedIcon from "@mui/icons-material/StarRounded"
import { ReviewModel } from '../../types';

export type FormDataReview = {
    title: string,
    description: string,
    score: number,
};

interface ReviewFormProps {
    review: ReviewModel | undefined
    onSave: (review: FormDataReview) => void;
    onCancel: () => void;
}

const ReviewModalForm: React.FC<ReviewFormProps> = ({ review, onSave, onCancel }) => {
    const { t } = useTranslation();
    
    const onEdit = review ? true : false;
    const isExperienceReview = review?.experience_id ? true : false;

    const [title, setTitle] = useState(review?.title || '');
    const [description, setDescription] = useState(review?.description || '');
    const [score, setScore] = useState(review?.score || 1);

    const [hover, setHover] = useState(0)
    const [invalidScore, setInvalidScore] = useState(false);

    const { register, handleSubmit, setValue, formState: { errors } } 
        = useForm<FormDataReview>({ criteriaMode: "all" })

    useEffect(() => {
        if (review) {
            setTitle(review.title || '');
            setDescription(review.description || '');
            setScore(review.score || 1);
            setHover(-review.score)
        }
    }, [review]);

    const onSubmit = handleSubmit((data: FormDataReview) => {
        data.score = -score
        if (data.score === -1) {
            setInvalidScore(true)
        } else {
            setInvalidScore(false)
            onSave(data);
        }
    });

    return (
        <>
            { /* Overlay que oscurece el fondo */ }
            <div 
                className="modal-backdrop show" 
                style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.75)", zIndex: 1040 }}
            />
    
            { /* Modal principal */ }
            <div className="modal fade show mt-5 pt-3" tabIndex={-1} 
                 style={{ display: 'block', zIndex: 1050 }} 
                 aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title fw-bold fs-4" id="exampleModalLabel">
                                {isExperienceReview 
                                    ? (onEdit ? t('Review.edit') : t('Review.create')) 
                                    : (onEdit ? t('Testimonial.edit') : t('Testimonial.create'))
                                }
                            </h5>
                            <button type="button" className="btn-close"
                                    aria-label={t("AriaLabel.cancel")} title={t("AriaLabel.cancel")}
                                    onClick={onCancel}/>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={onSubmit} id="createReviewForm" acceptCharset="utf-8"  method="post">
                                <div className="mb-3">
                                    <label htmlFor="reviewTitle" className="form-label d-flex justify-content-between">
                                        <div>
                                            {t('Review.form.title')}
                                            <span className="required-field">*</span>
                                        </div>
                                        <div className="align-self-center">
                                            <h6 className="max-input-text">
                                                {t('Input.maxValue', { value: 50 })}
                                            </h6>
                                        </div>
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.title ? 'is-invalid' : ''}`} 
                                        id="reviewTitle"
                                        defaultValue={review ? title : ""}
                                        {...register("title", {
                                            required: true,
                                            validate: {
                                                length: (title) =>
                                                    title.length >= 3 && title.length <= 50,
                                            },
                                            pattern: {
                                                value: /^[A-Za-z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆŠŽ∂ð ()<>_,'°"·#$%&=:¿?!¡/.-]*$/,
                                                message: t("Review.form.error.title.pattern"),
                                            },
                                        })}
                                    />
                                    {errors.title?.type === "required" && (
                                        <p className="invalid-feedback">
                                            {t("Review.form.error.title.isRequired")}
                                        </p>
                                    )}
                                    {errors.title?.type === "length" && (
                                        <p className="invalid-feedback">
                                            {t("Review.form.error.title.length")}
                                        </p>
                                    )}
                                    {errors.title?.type === "pattern" && (
                                        <p className="invalid-feedback">
                                            {t("Review.form.error.title.pattern")}
                                        </p>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="reviewDescription" className="form-label d-flex justify-content-between">
                                        <div>
                                            {t('Review.form.description')}
                                            <span className="required-field">*</span>
                                        </div>
                                        <div className="align-self-center">
                                            <h6 className="max-input-text">
                                                {t('Input.maxValue', { value: 255 })}
                                            </h6>
                                        </div>
                                    </label>
                                    <textarea
                                        minLength={3} maxLength={255}
                                        className={`form-control ${errors.description ? 'is-invalid' : ''}`} 
                                        id="reviewDescription"
                                        defaultValue={review ? description : ""}
                                        style={{ maxHeight: "200px", minHeight: "100px" }}
                                        {...register("description", {
                                            required: true,
                                            validate: {
                                                length: (description) =>
                                                    description.length >= 3 && description.length <= 255,
                                            },
                                            pattern: {
                                                value: /^([A-Za-z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆŠŽ∂ð ()<>_,'°";$%#&=:¿?!¡\n\s\t/.-])*$/,
                                                message: t("Review.form.error.description.pattern"),
                                            },
                                        })}
                                    />
                                    {errors.description?.type === "required" && (
                                        <p className="invalid-feedback">
                                            {t("Review.form.error.description.isRequired")}
                                        </p>
                                    )}
                                    {errors.description?.type === "length" && (
                                        <p className="invalid-feedback">
                                            {t("Review.form.error.description.length")}
                                        </p>
                                    )}
                                    {errors.description?.type === "pattern" && (
                                        <p className="form-control is-invalid form-error-label">
                                            {t("Review.form.error.description.pattern")}
                                        </p>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="score" className="form-label mb-0">
                                        {t('Review.form.score')}
                                        <span className="required-field">*</span>
                                    </label>
                                
                                    <div className="w-100 d-flex justify-content-center">
                                        <div className="w-50">
                                            <div className="star-rating">
                                                {[...Array(5)].map((star, index) => {
                                                    index -= 5
                                                    return (
                                                        <button
                                                            type="button"
                                                            title="starButton"
                                                            key={index}
                                                            className={index >= ((score && hover) || hover) ? "on" : "off"}
                                                            onClick={() => setScore(index)}
                                                            onMouseEnter={() => setHover(index)}
                                                            onMouseLeave={() => setHover(score)}
                                                        >
                                                            <StarRoundedIcon className="star" />
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <input 
                                        name="score"
                                        type="hidden" 
                                        className="form-control" 
                                        id="score" 
                                    />
                                    {invalidScore &&
                                        <p className="form-control is-invalid form-error-label">
                                            {t("Review.form.error.score.isRequired")}
                                        </p>
                                    }
                                
                                </div>
                                <div className="modal-footer d-flex align-items-center justify-content-around">
                                    <button className="btn btn-cancel-form px-3 py-2"
                                        aria-label={t("AriaLabel.cancel")} title={t("AriaLabel.cancel")}
                                        onClick={onCancel}>
                                        {t('Button.cancel')}
                                    </button>
                                    <button type="submit" className='btn button-primary'
                                        form="createReviewForm"
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

export default ReviewModalForm;
