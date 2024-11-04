import { useTranslation } from "react-i18next";
import "../common/i18n/index";
import { OrderByModel } from "../types";
import { Dispatch, SetStateAction } from "react";

export default function OrderDropdown(props: { orders: OrderByModel | undefined, order: [string, Dispatch<SetStateAction<string>>], currentPage: [number, Dispatch<SetStateAction<number>>] }) {

    const { t } = useTranslation()
    const { orders, order, currentPage } = props

    function changeOrder(queryOrder: string) {
        currentPage[1](1)
        order[1](queryOrder)
    }

    return (
        <div className="d-flex justify-content-center align-content-center">
            <div>
                <button className="btn btn-search my-2 dropdown-toggle" type="button"
                    id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"
                    aria-label={t("AriaLabel.order")} title={t("AriaLabel.order")}>
                    {t('Order.title')}
                    <b>
                        {t(`Order.${order[0]}`)}
                    </b>
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    {orders?.orders.map((order) => (
                        <p className="dropdown-item" key={order}
                            onClick={() => changeOrder(order.toString())}>
                            {t(`Order.${order.toString()}`)}
                        </p>
                    ))}
                </ul>
            </div>
        </div>
    );

}