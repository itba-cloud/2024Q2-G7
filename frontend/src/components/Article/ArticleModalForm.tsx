import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ArticleModel } from '../../types';

export type FormDataArticle = {
    title: string,
    description: string,
};

interface ArticleFormProps {
    article: ArticleModel | undefined
    onSave: (article: FormDataArticle) => void;
    onCancel: () => void;
}

const ArticleModalForm: React.FC<ArticleFormProps> = ({ article, onSave, onCancel }) => {
    const { t } = useTranslation();
    
    const onEdit = article ? true : false;

    const [title, setTitle] = useState(article?.title || '');
    const [description, setDescription] = useState(article?.description || '');


    const { register, handleSubmit, setValue, formState: { errors } } 
        = useForm<FormDataArticle>({ criteriaMode: "all" })

    useEffect(() => {
        if (article) {
            setTitle(article.title || '');
            setDescription(article.description || '');
        }
    }, [article]);

    const onSubmit = handleSubmit((data: FormDataArticle) => {
        onSave(data);
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
                                {onEdit ? t('Article.edit') : t('Article.create')
                                }
                            </h5>
                            <button type="button" className="btn-close"
                                    aria-label={t("AriaLabel.cancel")} title={t("AriaLabel.cancel")}
                                    onClick={onCancel}/>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={onSubmit} id="createArticleForm" acceptCharset="utf-8"  method="post">
                                <div className="mb-3">
                                    <label htmlFor="articleTitle" className="form-label d-flex justify-content-between">
                                        <div>
                                            {t('Article.form.title')}
                                            <span className="required-field">*</span>
                                        </div>
                                        <div className="align-self-center">
                                            <h6 className="max-input-text">
                                                {t('Input.maxValue', { value: 100 })}
                                            </h6>
                                        </div>
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.title ? 'is-invalid' : ''}`} 
                                        id="articleTitle"
                                        defaultValue={article ? title : ""}
                                        {...register("title", {
                                            required: true,
                                            validate: {
                                                length: (title) =>
                                                    title.length >= 3 && title.length <= 100,
                                            },
                                            pattern: {
                                                value: /^[A-Za-z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆŠŽ∂ð ()<>_,'°"·#$%&=:¿?!¡/.-]*$/,
                                                message: t("Article.form.error.title.pattern"),
                                            },
                                        })}
                                    />
                                    {errors.title?.type === "required" && (
                                        <p className="invalid-feedback">
                                            {t("Article.form.error.title.isRequired")}
                                        </p>
                                    )}
                                    {errors.title?.type === "length" && (
                                        <p className="invalid-feedback">
                                            {t("Article.form.error.title.length")}
                                        </p>
                                    )}
                                    {errors.title?.type === "pattern" && (
                                        <p className="invalid-feedback">
                                            {t("Article.form.error.title.pattern")}
                                        </p>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="articleDescription" className="form-label d-flex justify-content-between">
                                        <div>
                                            {t('Article.form.description')}
                                            <span className="required-field">*</span>
                                        </div>
                                        <div className="align-self-center">
                                            <h6 className="max-input-text">
                                                {t('Input.maxValue', { value: 1000 })}
                                            </h6>
                                        </div>
                                    </label>
                                    <textarea
                                        minLength={3} maxLength={1000}
                                        className={`form-control ${errors.description ? 'is-invalid' : ''}`} 
                                        id="articleDescription"
                                        defaultValue={article ? description : ""}
                                        style={{ maxHeight: "400px", minHeight: "100px" }}
                                        {...register("description", {
                                            required: true,
                                            validate: {
                                                length: (description) =>
                                                    description.length >= 3 && description.length <= 1000,
                                            },
                                            pattern: {
                                                value: /^([A-Za-z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆŠŽ∂ð ()<>_,'°";$%#&=:¿?!¡\n\s\t/.-])*$/,
                                                message: t("Article.form.error.description.pattern"),
                                            },
                                        })}
                                    />
                                    {errors.description?.type === "required" && (
                                        <p className="invalid-feedback">
                                            {t("Article.form.error.description.isRequired")}
                                        </p>
                                    )}
                                    {errors.description?.type === "length" && (
                                        <p className="invalid-feedback">
                                            {t("Article.form.error.description.length")}
                                        </p>
                                    )}
                                    {errors.description?.type === "pattern" && (
                                        <p className="form-control is-invalid form-error-label">
                                            {t("Article.form.error.description.pattern")}
                                        </p>
                                    )}
                                </div>
                                <div className="modal-footer d-flex align-items-center justify-content-around">
                                    <button className="btn btn-cancel-form px-3 py-2"
                                        aria-label={t("AriaLabel.cancel")} title={t("AriaLabel.cancel")}
                                        onClick={onCancel}>
                                        {t('Button.cancel')}
                                    </button>
                                    <button type="submit" className='btn button-primary'
                                        form="createArticleForm"
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

export default ArticleModalForm;
