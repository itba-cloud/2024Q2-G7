import React from "react";
import styled from "styled-components";

interface LoadableDataProps {
  spinnerMultiplier?: number;
  isLoading: boolean;
  children: React.ReactNode;
}

const SpinnerRing = styled.div<{ sizeMultiplier: number }>`
  display: flex;
  justify-self: center;
  align-self: center;
  align-content: center;
  justify-content: center;
  width: ${({ sizeMultiplier }) => `${80 * sizeMultiplier}px`};
  height: ${({ sizeMultiplier }) => `${80 * sizeMultiplier}px`};

  div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: ${({ sizeMultiplier }) => `${64 * sizeMultiplier}px`};
    height: ${({ sizeMultiplier }) => `${64 * sizeMultiplier}px`};
    margin: ${({ sizeMultiplier }) => `${8 * sizeMultiplier}px`};
    border: ${({ sizeMultiplier }) => `${8 * sizeMultiplier}px`} solid;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #3498db transparent transparent transparent; /* Cambia a un degradado */
  }

  div:nth-child(1) {
    animation-delay: -0.45s;
    border-color: #e74c3c transparent transparent transparent; /* Rojo */
  }
  div:nth-child(2) {
    animation-delay: -0.3s;
    border-color: #f1c40f transparent transparent transparent; /* Amarillo */
  }
  div:nth-child(3) {
    animation-delay: -0.15s;
    border-color: #2ecc71 transparent transparent transparent; /* Verde */
  }

  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Contenedor centrado
const CenteredContainer = styled.div`
  display: flex;
  justify-content: center; /* Centrado horizontal */
  align-items: center; /* Centrado vertical */
  height: 100%; /* Asegúrate de que el contenedor tenga altura */
`;

export default function DataLoader({ spinnerMultiplier = 1, isLoading, children }: LoadableDataProps) {
  return (
    <>
      {isLoading ? (
        <CenteredContainer>
          <SpinnerRing sizeMultiplier={spinnerMultiplier} data-testid="spinner">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </SpinnerRing>
        </CenteredContainer>
      ) : (
        <>{children}</>
      )}
    </>
  );
}
