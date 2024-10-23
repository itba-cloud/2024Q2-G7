import {useTranslation} from "react-i18next";
import "../common/i18n/index"
import React, {Dispatch, SetStateAction} from "react";
import styled from "styled-components";
import page_arrow from "../images/page_arrow.png";

export default function Pagination(props: { maxPage: number, currentPage: [number, Dispatch<SetStateAction<number>>], pageToShow: [number, Dispatch<SetStateAction<number>>]}) {

    const {t} = useTranslation()

    const {maxPage, currentPage, pageToShow} = props

    const componentCurrentPage = currentPage[0]

    const PageArrow = styled.img<{ xRotated?: boolean }>`
          transform: ${(props) => (props.xRotated ? "rotate(180deg);" : "")};
          cursor: pointer;
          margin: 0 8px;
          height: 36px;
    `;

    function changePage(page: number) {
        currentPage[1](page)
        pageToShow[1](page)
    }

    return (
        <>
            {componentCurrentPage > 1 && (
                <div style={{alignItems: "center", display: "flex"}}>
                    <PageArrow xRotated={true}
                               src={page_arrow}
                               alt={`${t("Pagination.alt.beforePage")}`}
                               onClick={() => changePage(componentCurrentPage - 1)}
                    />
                </div>
            )}

            {t("Pagination.message", {
                currentPage: currentPage[0],
                maxPage: maxPage,
            })}

            {componentCurrentPage < maxPage && (
                <div style={{alignItems: "center", display: "flex"}}>
                    <PageArrow src={page_arrow}
                               alt={`${t("Pagination.alt.nextPage")}`}
                               onClick={() => changePage(componentCurrentPage + 1)}
                    />
                </div>
            )}
        </>
    );
}
