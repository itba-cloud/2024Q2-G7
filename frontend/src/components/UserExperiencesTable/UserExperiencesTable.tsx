import React, { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { ExperienceModel } from "../../types";
import UserExperiencesTableRow from "./UserExperiencesTableRow";
import { Table } from "react-bootstrap";

export default function UserExperiencesTable(props: {
    experiences: ExperienceModel[],
    onEdit: [boolean, Dispatch<SetStateAction<boolean>>],
    setExperienceId: React.Dispatch<React.SetStateAction<string>>,
    isOpenImage: [boolean, Dispatch<SetStateAction<boolean>>],
}) {

    const { t } = useTranslation()
    const { experiences, onEdit, setExperienceId, isOpenImage } = props

    return (
        <Table striped bordered hover responsive className="mt-4 custom-table">
            <thead className="table-header">
                <tr>
                    <th className="text-center"><h4 className="table-title">{t('User.experiences.status.title')}</h4></th>
                    <th className="text-center"><h4 className="table-title">{t('User.experiences.title')}</h4></th>
                    <th className="text-center"><h4 className="table-title">{t('User.experiences.category')}</h4></th>
                    <th className="text-center"><h4 className="table-title">{t('User.experiences.score')}</h4></th>
                    <th className="text-center"><h4 className="table-title">{t('User.experiences.price')}</h4></th>
                    <th className="text-center"><h4 className="table-title">{t('User.experiences.views')}</h4></th>
                    <th className="text-center"><h4 className="table-title">{t('User.experiences.actions')}</h4></th>
                </tr>
            </thead>
            <tbody>
                {experiences.map((experience) => (
                    <UserExperiencesTableRow experience={experience}
                        onEdit={onEdit}
                        setExperienceId={setExperienceId}
                        isOpenImage={isOpenImage}
                        key={experience.id} />
                ))}
            </tbody>
        </Table>
    )
}