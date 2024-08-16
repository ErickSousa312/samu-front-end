import Routers from "./routes"
import { ToastProvider } from "./shared/context/ToastContext"

function App() {
  

  return (
    <div className="bg-[#161617]">
      <ToastProvider>
        <Routers />
      </ToastProvider>

    </div>
  )
}

export default App
