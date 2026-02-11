import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";


const API_KEY = "AIzaSyC0Fe6NI5HcsCsywAUtIxjVGzTtUgiaep0";
const PIPEDREAM_URL = "https://eowhrm8s1imb66l.m.pipedream.net"; 


const genAI = new GoogleGenerativeAI(API_KEY);



function App() {
  const [respuesta, setRespuesta] = useState("");
  const [escuchando, setEscuchando] = useState(false);
  const [inputManual, setInputManual] = useState("");

  const herramientas = {
    consultarHistoria: async () => {
      const res = await fetch("https://history.muffinlabs.com/date"); 
      const data = await res.json();
      return JSON.stringify(data.data.Events.slice(0, 3)); 
    },
    registrarFavorito: async ({ evento }) => {
      await fetch(PIPEDREAM_URL, {
        
        method: "POST",
        body: JSON.stringify({
          evento,
          fecha: new Date().toLocaleDateString(),
        }),
      });
      return "Evento guardado en Pipedream con éxito.";
    },
  };


  const iniciarVoz = () => {
    const recognition = new (
      window.SpeechRecognition || window.webkitSpeechRecognition
    )();
    recognition.lang = "es-MX";

    recognition.onstart = () => setEscuchando(true);
    recognition.onresult = async (event) => {
      const textoVoz = event.results[0][0].transcript;
      await procesarConIA(textoVoz);
    };
    recognition.onend = () => setEscuchando(false);
    recognition.start();
  };
  const hablar = (texto) => {
    
    window.speechSynthesis.cancel();

    const lectura = new SpeechSynthesisUtterance(texto);
  const voces = window.speechSynthesis.getVoices();
  const vozISAC = voces.find(v => v.name.includes('Microsoft Raul') || v.name.includes('Google español'));
  if (vozISAC) lectura.voice = vozISAC;

    lectura.lang = "es-MX";
  lectura.rate = 0.85; 
  lectura.pitch = 0.8;

    window.speechSynthesis.speak(lectura);
  };

const procesarConIA = async (mensajeUsuario) => {
  try {
    
    const model = genAI.getGenerativeModel({
     model: "gemini-3-flash-preview", 
      tools: [
        {
          functionDeclarations: [
            {
              name: "consultarHistoria",
              description: "Busca qué pasó un día como hoy.",
            },
            {
              name: "registrarFavorito",
              description: "Guarda un evento histórico.",
              parameters: {
                type: "object",
                properties: { evento: { type: "string" } },
              },
            },
          ],
        },
      ],
    });

    const chat = model.startChat();
    let result = await chat.sendMessage(mensajeUsuario);

    const call = result.response.functionCalls()?.[0];
    if (call) {
      const apiResponse = await herramientas[call.name](call.args);
      result = await chat.sendMessage([
        {
          functionResponse: {
            name: call.name,
            response: { content: apiResponse },
          },
        },
      ]);
    }

    const respuestaFinal = result.response.text();
    setRespuesta(respuestaFinal);
    hablar(respuestaFinal);

  } catch (error) {
    console.error("Error detallado:", error);
    setRespuesta("Hubo un problema de conexión con el cerebro de IA.");
  }
};

    const pausarAudio = () => {
  window.speechSynthesis.pause();
};

const reanudarAudio = () => {
  window.speechSynthesis.resume();
};

const detenerAudio = () => {
  window.speechSynthesis.cancel();
};
const manejarEnvioManual = (e) => {
    if (e.key === 'Enter' && inputManual.trim() !== "") {
      procesarConIA(inputManual); 
      setInputManual("");
    }
  };
 return (
    <div className="container">
      <h1> Asistente Histórico</h1>
      <p className="subtitle">"Cronista del tiempo impulsado por IA"</p>

      <button 
        onClick={iniciarVoz} 
        className={`mic-button ${escuchando ? 'mic-active' : 'mic-idle'}`}
      >
        {escuchando ? '🛑' : '🎤'}
      </button>


      <div className="response-box">
        <strong>Registro Histórico:</strong>
        <p className="response-text">
          {respuesta || "Presiona el micro y pregunta algo como: '¿Qué ocurrió un día como hoy?'"}
        </p>
        <div className="audio-controls">
          <button className="btn-control" onClick={pausarAudio}>⏸️ Pausar</button>
          <button className="btn-control" onClick={reanudarAudio}>▶️ Reanudar</button>
          <button className="btn-control" onClick={detenerAudio}>⏹️ Detener</button>
        </div>
      </div>
    </div>
  );
}

export default App;
