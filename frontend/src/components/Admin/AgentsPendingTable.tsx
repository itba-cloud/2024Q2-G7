import { Button, Table } from 'react-bootstrap';
import { AgentModel } from '../../types';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { approveAgent } from '../../scripts/adminOperations';
import { confirmDialogModal } from '../ConfirmDialogModal';

export default function AgentsPendingTable(props: {agents: AgentModel[]}) {

    const { t } = useTranslation()
    const { agents } = props

    return (
        <Table striped bordered hover responsive className="mt-4 custom-table">
            <thead className="table-header">
                <tr>
                    <th className="text-center"><h4 className="table-title">{t('Agents.form.name')}</h4></th>
                    <th className="text-center"><h4 className="table-title">{t('Agents.form.email')}</h4></th>
                    <th className="text-center"><h4 className="table-title">{t('Agents.form.phone')}</h4></th>
                    <th className="text-center"><h4 className="table-title">{t('Agents.form.languages')}</h4></th>
                    <th className="text-center"><h4 className="table-title">{t('Agents.table.experience')}</h4></th>
                    <th className="text-center"><h4 className="table-title">{t('User.experiences.actions')}</h4></th>
                </tr>
            </thead>
            <tbody>
                {agents.map((agent: AgentModel) => (
                    <tr key={agent.id}>
                        <td className="title-link">
                            <Link to={"/admin/agents/" + agent.id} 
                                className="experience card-title container-fluid p-0"
                                state={{ agent }}>
                                {agent.name}
                            </Link>
                        </td>
                        <td>{agent.email}</td>
                        <td>{agent.phone}</td>
                        <td>{agent.languages}</td>
                        <td>{agent.experience}  {t('Agents.table.years')}</td>
                        <td className="actions-column">
                            <Button 
                                variant="success" 
                                className="action-button" 
                                aria-label={t("Admin.modal.approveAgentTitle")}
                                title={t("Admin.modal.approveAgentTitle")}
                                onClick={() =>
                                    confirmDialogModal(
                                        t('Admin.modal.approveAgentTitle'),
                                        t('Admin.modal.approveAgentessage', { name: agent.name }),
                                        () => approveAgent(agent, true, t))
                                }
                            >
                                <CheckIcon className="m-0" /> 
                            </Button>
                            <Button 
                                variant="danger" 
                                className="action-button" 
                                aria-label={t("Admin.modal.denyAgentTitle")}
                                title={t("Admin.modal.denyAgentTitle")}
                                onClick={() =>
                                    confirmDialogModal(
                                        t('Admin.modal.denyAgentTitle'),
                                        t('Admin.modal.denyAgentMessage', { name: agent.name }),
                                        () => approveAgent(agent, false, t))
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
