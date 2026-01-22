import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import '../styles/MapaProyectos.scss';
import { useMap } from 'react-leaflet';

const MapaProyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState('');

const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const response = await axios.get('https://intranet.planosperu.com.pe/api/ubicaciones/');
        setProyectos(response.data.features);
      } catch (err) {
        console.error('Error al obtener datos:', err);
      }
    };

    fetchProyectos();
  }, []);

  const resetMapa = () => setCiudadSeleccionada('');

  const puntoIcono = L.divIcon({
    className: '',
    html: '<div class="punto-marcador"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  const departamentosUnicos = [...new Set(proyectos.map(p => p.properties.departamento))];
const getCentroDepartamento = (departamento) => {
  const puntos = proyectos.filter(p => p.properties.departamento === departamento);
  if (puntos.length === 0) return [-9.19, -75.0152]; // centro de Perú

  // Promedio de coordenadas
  const latitudes = puntos.map(p => p.geometry.coordinates[1]);
  const longitudes = puntos.map(p => p.geometry.coordinates[0]);
  const lat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
  const lng = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;
  return [lat, lng];
};

  return (
    <section className="mapa-proyectos">
      <div className="container">
        {/* Header */}
        <div className="mapa-header text-center">
          <h2 className="mapa-titulo">NUESTROS PROYECTOS HABLAN POR SÍ MISMOS A NIVEL NACIONAL</h2>
          <div className="mapa-divider"></div>
          <p className="mapa-subtitulo">
            Cada punto en este mapa representa un proyecto exitoso que hemos entregado, y seguimos expandiendo nuestra huella
          </p>
        </div>

        {/* Controles */}
        <div className="mapa-controles">
          <button onClick={resetMapa} className="mapa-boton">
            Ver Todo Perú
          </button>
          <select
            value={ciudadSeleccionada}
            onChange={(e) => setCiudadSeleccionada(e.target.value)}
            className="mapa-select"
          >
            <option value="">Selecciona un departamento</option>
            {departamentosUnicos.map((dep, index) => (
              <option key={index} value={dep}>
                {dep}
              </option>
            ))}
          </select>
        </div>

        {/* Mapa */}
        <div className="mapa-container">
          <div className="mapa-imagen">
<MapContainer
  center={[-9.19, -75.0152]} 
  zoom={5} 
  className="mapa-img"
  scrollWheelZoom={false}
  doubleClickZoom={false}
  dragging={true}
  touchZoom={false}
  zoomControl={false}
>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution="© OpenStreetMap"
  />

  <ChangeView
    center={ciudadSeleccionada ? getCentroDepartamento(ciudadSeleccionada) : [-9.19, -75.0152]}
    zoom={ciudadSeleccionada ? 10: 5}
  />

  {proyectos
    .filter(p => !ciudadSeleccionada || p.properties.departamento === ciudadSeleccionada)
    .map((p, i) => (
      <Marker
        key={i}
        icon={puntoIcono}
        position={[p.geometry.coordinates[1], p.geometry.coordinates[0]]}
      />
    ))}
</MapContainer>


          </div>
        </div>

        {/* Estadísticas */}
        <div className="mapa-estadisticas">
          <div className="estadistica-item1">
            <span className="estadistica-numero">+10 000</span>
            <p className="estadistica-texto">Proyectos Completados</p>
          </div>
          <div className="estadistica-item1">
            <span className="estadistica-numero">+50</span>
            <p className="estadistica-texto">Ciudades</p>
          </div>
          <div className="estadistica-item1">
            <span className="estadistica-numero">95%</span>
            <p className="estadistica-texto">Satisfacción</p>
          </div>
        </div>

        {/* Descripción final */}
        <div className="mapa-descripcion text-center">
          <p>
            Nos enorgullece tener proyectos en todo el país, desde las grandes ciudades hasta las regiones más remotas.
            <br />
<a href="/projects">
  <button className="mapa-boton-cta">Ver todos nuestros proyectos</button>
</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default MapaProyectos;
