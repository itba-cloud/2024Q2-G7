import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { ExperienceModel } from "../../types";
import { GOOGLE_MAPS_API_KEY } from "../../common";
import DataLoader from "../DataLoader";

// Estilo del contenedor del mapa
const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "15px", // Borde redondeado
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Sombra suave
};

// Función para obtener coordenadas a partir de la dirección
async function geocodeAddress(address: string) {
  const base_url = "https://maps.googleapis.com/maps/api/geocode/json";
  const url = `${base_url}?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.status === "OK") {
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lng };
    } else {
      throw new Error(data.error_message || "Failed to fetch coordinates");
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

function Map({ experience }: { experience: ExperienceModel }) {
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (experience.address && experience.city && experience.province) {
      geocodeAddress(`${experience.address}, ${experience.city}, ${experience.province}`)
      .then(coords => {
        if (coords) {
          setCenter(coords);
        }
      })
      .finally(() => setIsLoading(false));
    }
  }, []);

  return (
    <div>
      <DataLoader spinnerMultiplier={2} isLoading={isLoading}>
        {center && (
          <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={15}
              options={{
                disableDefaultUI: true, // Opcional: Oculta controles de UI predeterminados para un look más limpio
                zoomControl: true, // Mantener el control de zoom visible
                streetViewControl: true, // Habilitar la vista de calle
              }}
            >
              <Marker position={center} />
            </GoogleMap>
          </LoadScript>
        )}
      </DataLoader>
    </div>
  );
}

export default React.memo(Map);