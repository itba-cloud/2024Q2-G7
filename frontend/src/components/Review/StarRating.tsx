import React from "react";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

export default function StarRating(props: { score: number }) {

    const { score } = props

    return (
        <div className="star-rating">
            {[...Array(5)].map((star, index) => {
                index -= 5;
                return (
                    <div key={index} className={`d-flex align-self-center ${index >= -score ? "on" : "off"} `}>
                        <StarRoundedIcon className="star" />
                    </div>
                );
            })}
        </div>
    );

}