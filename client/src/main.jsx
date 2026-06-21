import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"
import App from "./App.jsx"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import "./css/general.css"
import "./css/header.css"
import "./css/resultCarousel.css"
import "./css/networkMap.css"
import "./css/customTable.css"

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <BrowserRouter>
          <App />
      </BrowserRouter>
  </StrictMode>,
)
