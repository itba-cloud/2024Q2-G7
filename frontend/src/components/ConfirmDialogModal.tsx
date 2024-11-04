import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { create } from 'zustand';
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type ConfirmDialogStore = {
    title: string,
    message: string,
    onSubmit?: () => void,
    close: () => void,
}

const UseConfirmDialogStore = create<ConfirmDialogStore>((set) => ({
    title: "",
    message: "",
    onSubmit: undefined,
    close: () => set({ onSubmit: undefined })
}))

export const confirmDialogModal = (title: string, message: string, onSubmit: () => void) => {
    UseConfirmDialogStore.setState({
        title,
        message,
        onSubmit,
    })
}

const ConfirmDialogModal: React.FC = () => {
    const { title, message, onSubmit, close } = UseConfirmDialogStore();
    const { t } = useTranslation();

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (onSubmit) {
            try {
                setIsLoading(true); 
                await onSubmit();
            } catch (error) {
            } finally {
                setIsLoading(false); 
                close();        
            }
        }
    };

    return (
        <Dialog open={Boolean(onSubmit)} onClose={isLoading ? undefined : close} 
                maxWidth="sm" fullWidth className="shadow-lg rounded">
            <DialogTitle className="h4 fw-bold">{title}</DialogTitle>
            <DialogContent className="p-3">
                <DialogContentText className="text-muted">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions className="d-flex justify-content-between p-3">
                <button className="btn btn-cancel-form px-4 py-2" id="cancelFormButton"
                    aria-label={t("AriaLabel.cancel")} title={t("AriaLabel.cancel")}
                    onClick={close} disabled={isLoading}>
                    {t('Button.cancel')}
                </button>
                <button type="button" id="confirmDelete" className='btn button-primary px-4 py-2'
                    aria-label={t("AriaLabel.confirm")} title={t("AriaLabel.confirm")}
                    onClick={handleSubmit} disabled={isLoading}>
                        {t('Button.confirm')}
                </button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialogModal;
