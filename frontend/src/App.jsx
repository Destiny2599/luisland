import { useEffect, useState } from 'react';

function App() {
  const [mensaje, setMensaje] = useState('Cargando...');

  useEffect(() => {
    fetch('http://localhost:8080/api/bienvenido')
      .then((res) => res.text())
      .then((data) => setMensaje(data))
      .catch(() => setMensaje('Error al conectar con el backend'));
  }, []);

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <h1 className="display-1 fw-bold text-primary">
        {mensaje}
      </h1>
    </div>
  );
}

export default App;