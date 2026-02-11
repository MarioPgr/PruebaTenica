#  Asistente Histórico - Protocolo ISAC

Este proyecto es un Voicebot interactivo desarrollado en **React** para la prueba técnica JS 2026. Utiliza inteligencia artificial avanzada para narrar y registrar eventos históricos.

##  Características Principales
- Sistema de síntesis de voz (Web Speech API) personalizado con un tono analítico y grave.
- **IA de Vanguardia:** Implementación de **Gemini 3 Flash Preview** (Modelo 2026) con capacidades de *Function Calling*.
- **Controles de Audio:** Funciones para pausar, reanudar y detener la locución de la IA.

##  Tecnologías Usadas
- **Frontend:** React + Vite.
- **IA:** @google/generative-ai (Gemini API).
- **APIs Externas:** Muffinlabs (Eventos Históricos) y Pipedream (Registro de Favoritos).

##  Instrucciones de Instalación
1. Clonar el repositorio.
2. Ejecutar `npm install`.
3. Crear un archivo `.env` o colocar tu `API_KEY` en `App.jsx`.
4. Ejecutar `npm run dev`.

---
"Nota: El proyecto utiliza el Tier Gratuito de la API de Gemini 3. En caso de recibir un error 429 (Rate Limit), por favor esperar 60 segundos antes de realizar una nueva consulta."
*Proyecto desarrollado por Mario - Estudiante de Programación 2026.*
