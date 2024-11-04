import { Button, Table } from 'react-bootstrap';
import { ExperienceModel } from '../../types';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Price from '../Experience/Price';
import { approveExperience } from '../../scripts/adminOperations';
import { confirmDialogModal } from '../ConfirmDialogModal';

export default function ExperiencesPendingTable(props: {experiences: ExperienceModel[]}) {

    const { t } = useTranslation()
    const { experiences } = props

    return (
        <Table striped bordered hover responsive className="mt-4 custom-table">
            <thead className="table-header">
                <tr>
                    <th className="text-center"><h4 className="table-title">{t('Experience.name')}</h4></th>
                    <th className="text-center"><h4 className="table-title">{t('Experience.category')}</h4></th>
                    <th className="text-center"><h4 className="table-title">{t('Experience.address')}</h4></th>
                    <th className="text-center"><h4 className="table-title">{t('Experience.price.name')}</h4></th>
                    <th className="text-center"><h4 className="table-title">{t('User.experiences.actions')}</h4></th>
                </tr>
            </thead>
            <tbody>
                {experiences.map((experience: ExperienceModel) => (
                    <tr key={experience.id}>
                        <td className="title-link">
                            <Link to={"/admin/experiences/" + experience.id} 
                                className="experience card-title container-fluid p-0"
                                state={{ experience }}>
                                {experience.name}
                            </Link>
                        </td>
                        <td>
                            {t('Categories.' + experience.category)}
                        </td>
                        <td>
                            {experience.address}, {experience.city}, {experience.province}
                        </td>
                        <td>
                            <Price price={experience.price} />
                        </td>
                        <td className="actions-column">
                            <Button 
                                variant="success" 
                                className="action-button" 
                                aria-label={t("Admin.modal.approveExperienceTitle")}
                                title={t("Admin.modal.approveExperienceTitle")}
                                onClick={() =>
                                    confirmDialogModal(
                                        t('Admin.modal.approveExperienceTitle'),
                                        t('Admin.modal.approveExperienceMessage', { experienceName: experience.name }),
                                        () => approveExperience(experience, true, t))
                                }
                            >
                                <CheckIcon className="m-0" /> 
                            </Button>
                            <Button 
                                variant="danger" 
                                className="action-button" 
                                aria-label={t("Admin.modal.denyExperienceTitle")}
                                title={t("Admin.modal.denyExperienceTitle")}
                                onClick={() =>
                                    confirmDialogModal(
                                        t('Admin.modal.denyExperienceTitle'),
                                        t('Admin.modal.denyExperienceMessage', { experienceName: experience.name }),
                                        () => approveExperience(experience, false, t))
                                }
                            >
                                <CloseIcon className="m-0" />
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};
