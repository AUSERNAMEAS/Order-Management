// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // <-- importa tu componente
// here we import the app that we created
//and render it into the div we have in the HTML
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App /> {/* <-- renderiza tu página aquí */}
  </React.StrictMode>
);