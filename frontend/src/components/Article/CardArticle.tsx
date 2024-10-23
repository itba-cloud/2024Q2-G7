import { useTranslation } from "react-i18next";
import "../../common/i18n/index";
import { ArticleModel } from "../../types";
import { useNavigate } from 'react-router-dom'

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";


export default function CardArticle(props: {
    article: ArticleModel,
    isEditing: boolean,
    onEdit?: [boolean, Dispatch<SetStateAction<boolean>>],
}) {

    const { t } = useTranslation()
    const navigate = useNavigate()
    const { article, isEditing, onEdit } = props

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
    }, [])

    function editArticle(articleId: string) {
        //TODO
    }

    function deleteArticle(articleId: string) {
        //TODO
    }

    return (
        <div>

        </div>
    );
}