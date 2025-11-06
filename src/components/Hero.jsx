// src/components/Hero.jsx
import React from "react";
import nature from "../assets/nature.jpg"
import { Link } from "react-router-dom";
import BackgroundShapes from "./BackgroundShapes"; // opcional

export default function Hero({
  title = "Fomentando el reciclaje y la conciencia ambiental en Río Gallegos",
  subtitle = "EcoRG es tu plataforma para encontrar puntos verdes, seguir el calendario de recolección, reportar problemas ambientales y ganar medallas por reciclar.",
  primaryCta = { text: "Únete Ahora", to: "/registro" },
  secondaryCta = { text: "Más Información", to: "/about" },
  showAnnouncement = false,
}) {
  return (
 
     <section className="relative bg-green-50 text-white">
      {/* Fondo con imagen */}
      <div className="absolute inset-0">
        <img
          src={nature} // cambia por tu imagen
          alt="Gardener"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-green-800/10" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20 md:py-28 lg:py-32 flex flex-col lg:flex-row items-center">
        {/* Texto */}
        <div className="lg:w-1/2 text-center lg:text-left">
   
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            Fomentando el reciclaje <br />  y la conciencia ambiental<br /> en Río Gallegos 
          </h1>
          <p className="mt-6 text-lg text-white max-w-lg">
            EcoRG es tu plataforma para encontrar puntos verdes, seguir el calendario de recolección y reportar problemas ambientales
          </p>
          <div className="mt-8">
            <a
              href="#services"
              className="inline-block buttonprimary  px-6 py-3 text-lg font-medium rounded-md shadow"
            >
              Más infromación
            </a>
          </div>
        </div>

        {/* Imagen a la derecha */}
        <div className="lg:w-1/2 mt-12 lg:mt-0 lg:pl-12 flex justify-center">
       
        </div>
      </div>
    </section>
  );
}
