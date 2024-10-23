import "../common/i18n/index";
import React, { useEffect, useState } from "react";
import CardExperience from "./Experience/CardExperience";
import { ExperienceModel } from "../types";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTranslation } from "react-i18next";

export default function Carousel(props: { title: any, experiences: ExperienceModel[] | undefined; show: any; }) {

    const { t } = useTranslation()
    const { title, experiences, show } = props
    const [currentIndex, setCurrentIndex] = useState(0)
    const [length, setLength] = useState(0)

    //const dummyCategoryProp = useState<string | undefined>(undefined)
    //const dummyNameProp = useState<string | undefined>(undefined)

    // Set the length to match current children from props
    useEffect(() => {
        setLength(experiences === undefined ? 0 : experiences.length)
    }, [experiences])

    const next = () => {
        if (currentIndex < (length - show)) {
            setCurrentIndex(prevState => prevState + 1)
        }
    }

    const prev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prevState => prevState - 1)
        }
    }

    return (
        <>
            {experiences !== undefined && experiences.length > 0 &&
                <>
                    <div className="d-flex justify-content-center align-content-center">
                        <h2 style={{ fontWeight: "600", textDecoration: "underline" }}>
                            {title}
                        </h2>
                    </div>

                    <div className="carousel-container">
                        <div className="carousel-wrapper">
                            {currentIndex > 0 &&
                                <button onClick={prev} className="left-arrow" aria-label={t("AriaLabel.leftArrow")} title={t("AriaLabel.leftArrow")}>
                                    <ArrowBackIcon />
                                </button>
                            }

                            <div className="carousel-content-wrapper">
                                <div className={`carousel-content show-${show}`}
                                    style={{ transform: `translateX(-${currentIndex * (100 / show)}%)` }}>
                                    {experiences.map((exp) => (
                                        <div className="d-flex justify-content-center align-content-center" key={exp.id}>
                                            <CardExperience experience={exp} /* categoryProp={dummyCategoryProp} */ /* nameProp={dummyNameProp} */ fav={false} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {currentIndex < (length - show) &&
                                <button onClick={next} className="right-arrow" aria-label={t("AriaLabel.rightArrow")} title={t("AriaLabel.rightArrow")}>
                                    <ArrowForwardIcon />
                                </button>
                            }
                        </div>
                    </div>
                </>
            }
        </>
    );

}