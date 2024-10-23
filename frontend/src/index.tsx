import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";

import "./styles/agents.css";
import "./styles/cardExperience.css";
import "./styles/carousel.css";
import "./styles/delete.css";
import "./styles/error.css";
import "./styles/experienceDetail.css";
import "./styles/filtersSection.css";
import "./styles/form.css";
import "./styles/global.css";
import "./styles/icons.css";
import "./styles/loginRegister.css";
import "./styles/navbar.css";
import "./styles/resetRequest.css";
import "./styles/snackbar.css";
import "./styles/table.css";
import "./styles/star_rating.css";
import "./styles/trips.css";

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);