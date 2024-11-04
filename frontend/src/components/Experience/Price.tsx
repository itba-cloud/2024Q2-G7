import { useTranslation } from "react-i18next";
import "../../common/i18n/index";

export default function Price({ price }: { price: number | undefined }) {
    const { t } = useTranslation();

    let displayText;
    if (price === undefined || price === null) {
        displayText = t('Experience.price.null');
    } else if (price === 0) {
        displayText = t('Experience.price.free');
    } else {
        displayText = t('Experience.price.exist', { price });
    }

    return (
        <p className="my-auto p-0">
            {displayText}
        </p>
    );
}
