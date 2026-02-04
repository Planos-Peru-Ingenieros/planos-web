import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js';
import ProgressBar from 'react-bootstrap/ProgressBar'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Consulta.scss';
import banner from '../assets/img/backgrounds/miraflores.jpg';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip
);

const estadosColores = {
  "Presentado": "#00a7a4",
  "Reingresado": "#1d58b4",
  "Apelado": "#ef8e00",
  "En proceso": "#b4b4b4",
  "En calificación": "#5a2071",
  "Inscrito": "#89be21",
  "Reservado": "#575756",
  "Distribuido": "#f31c53",
  "Liquidado": "#006633",
  "Prorrogado": "#80d0ff",
  "Suspendido": "#981622",
  "Tachado": "black",
  "Anotado": "#7eb3d5",
  "Res. Tribunal": "black",
  "Res. Procedente": "#006633",
  "Res. Improcedente": "black",
  "Finalizado": "#89be21",
  "Desactivado": "#eb3219"
};

function Consulta() {
  const [idOt, setIdOt] = useState('');
  const [anio, setAnio] = useState('2025');
  const [resultados, setResultados] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const buscarOT = async (e) => {
    e.preventDefault();
    try {
      const url = `https://intranet.planosperu.com.pe/api/consulta/?id_ot=${idOt}&nac_ot_year=${anio}`;
      const res = await axios.get(url);
      if (res.data && res.data.data && res.data.data.length > 0) {
        setResultados(res.data);
        setError(null);
        setCurrentPage(1);
      } else {
        setResultados(null);
        setError('No se encontró ningún resultado.');
      }
    } catch (err) {
      console.error(err);
      setError('Hubo un problema al consultar la API.');
      setResultados(null);
    }
  };
  
  const filteredActivities = resultados?.data?.[0]?.actividades?.filter(act =>
    (act.descripcion || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (act.nom_col || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (act.nom_are || '').toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  const activitiesByDay = {};
  filteredActivities.forEach(act => {
    const dateKey = new Date(act.fin).toLocaleDateString('es-PE');
    if (!activitiesByDay[dateKey] || new Date(act.fin) > new Date(activitiesByDay[dateKey].fin)) {
      activitiesByDay[dateKey] = act;
    }
  });
  const latestActivitiesPerDay = Object.values(activitiesByDay);
  latestActivitiesPerDay.sort((a, b) => new Date(b.fin) - new Date(a.fin));
  const totalPages = Math.ceil(latestActivitiesPerDay.length / rowsPerPage);
  const paginatedActivities = latestActivitiesPerDay.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [rowsPerPage, currentPage, totalPages]);

  const estadoProgreso = {
    "Presentado": 10,
    "Reingresado": 25,
    "En proceso": 50,
    "En calificación": 75,
    "Liquidado": 90,
    "Inscrito": 100,
    "Finalizado": 100,
  };
  
  const otData = resultados?.data?.[0];
  const progreso = otData ? estadoProgreso[otData.estado] || 0 : 0;

  const chartData = {
    labels: [],
    datasets: [{
      label: 'Actividades por Día',
      data: [],
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
    }]
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Actividades Recientes' },
    },
    scales: {
        y: { ticks: { stepSize: 1 } }
    }
  };

  if (otData) {
    const activityCountsByDate = {};
    filteredActivities.forEach(act => {
      const date = new Date(act.fin).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit' });
      activityCountsByDate[date] = (activityCountsByDate[date] || 0) + 1;
    });
    
    const labels = Object.keys(activityCountsByDate).reverse().slice(0, 7);
    const data = labels.map(label => activityCountsByDate[label]);

    chartData.labels = labels.reverse();
    chartData.datasets[0].data = data.reverse();
  }

  return (
    <div className="consulta-container">
      <div className="consulta-header">
        <div className="banner-container">
          <div className="banner-image-wrapper">
            <img src={banner} alt="Banner" className="banner-image" />
            <div className="banner-overlay"></div>
          </div>
          <div className="header-content">
            <h2>Sistema de Consulta de Trámites</h2>
            <p>Si ya eres cliente de nosotros, sigue tus trámites.</p>
          </div>
          <div className="wave-shape">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none"></svg>
          </div>
        </div>
      </div>

      <form onSubmit={buscarOT} className="consulta-form">
        <div className="form-group">
          <label htmlFor="idOt" style={{ width: '120px', fontWeight: 'bold' ,marginRight:'20px'}}>Número de OT:</label>
          <input
            type="text"
            placeholder="Número de OT"
            value={idOt}
            onChange={e => setIdOt(e.target.value)}
            required
            className="form-input"
            title="Coloque el número de OT" 
          />
        </div>
        <div className="form-group">
          <label htmlFor="anio" style={{ width: '120px', fontWeight: 'bold' ,marginRight:'20px'}}>Año:</label>
          <select 
            value={anio} 
            onChange={e => setAnio(e.target.value)}
            title="Coloque el año de la creación" 
            className="form-select"
          >
            {[2021, 2022, 2023, 2024, 2025].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="form-button">Buscar</button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {otData && (
        <div className="resultados-container">
          <div className="resultados-grid">
            <div>
              <div className="resultados-card">
                <div className="card-header">
                  <h3>Resultados de la busqueda</h3>
                </div>
                <div className="card-body">
                  <div className="info-item">
                    <span className="info-label">Fecha de Creación:</span>
                    <span className="info-value">
                      {new Date(otData.inicio).toLocaleDateString('es-PE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Orden de Trabajo:</span>
                    <span className="info-value highlight">
                      {otData.id_ot}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Estado:</span>
                    <span 
                      className="info-value" 
                      style={{ 
                        color: estadosColores[otData.estado] || 'black',
                        fontWeight: 'bold'
                      }}
                    >
                      {otData.estado}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Tipo de Expediente:</span>
                    <span className="info-value">
                      {otData.expedientes && otData.expedientes[0]?.org_exp}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Estado de Expediente:</span>
                    <span 
                      className="info-value" 
                      style={{ 
                        color: estadosColores[otData.expedientes && otData.expedientes[0]?.est_exp] || 'black',
                        fontWeight: 'bold'
                      }}
                    >
                      {otData.expedientes && otData.expedientes[0]?.est_exp}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Progreso General:</span>
                  </div>
                  <div className="progress" style={{height: '20px', fontSize: '0.9rem'}}>
                    <div 
                      className="progress-bar progress-bar-striped progress-bar-animated" 
                      role="progressbar" 
                      style={{ width: `${progreso}%` }} 
                      aria-valuenow={progreso} 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    >
                      {progreso}%
                    </div>
                  </div>
                </div>
              </div>
              
              {chartData.labels.length > 0 &&
                <div className="resultados-card" style={{marginTop: '20px'}}>
                  <div className="card-body">
                    <Bar options={chartOptions} data={chartData} />
                  </div>
                </div>
              }

              {otData && (
                <div className="resultados-card" style={{marginTop: '20px'}}>
                  <div className="card-header">
                    <h3>Progreso por Fases</h3>
                  </div>
                  <div className="card-body">
                    {/* Esta barra de progreso aparecerá visible cuando importes el CSS */}
                    <ProgressBar style={{height: '25px'}}>
                      <ProgressBar striped variant="success" now={35} key={1} />
                      <ProgressBar variant="warning" now={20} key={2} />
                      <ProgressBar striped variant="danger" now={10} key={3} />
                    </ProgressBar>

                    {/* Y esta es la leyenda que ya te aparece */}
                    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px', fontSize: '0.8rem' }}>
                      <span><span style={{color: '#198754'}}>■</span> Revisión (35%)</span>
                      <span><span style={{color: '#ffc107'}}>■</span> Proceso (20%)</span>
                      <span><span style={{color: '#d41f1fff'}}>■</span> Finalizado (25%)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="seguimiento-card">
              <div className="card-header">
                <h3>Detalle del Seguimiento</h3>
                <div className="table-controls">
                  <div className="search-box">
                    <input
                      type="text"
                      placeholder="Buscar..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="search-icon" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      width="20" 
                      height="20"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M11 4a7 7 0 105.292 12.292l4.207 4.207a1 1 0 001.414-1.414l-4.207-4.207A7 7 0 0011 4z" 
                      />
                    </svg>
                  </div>
                  <div className="rows-selector">
                    <label>Mostrar:</label>
                    <select
                      value={rowsPerPage}
                      onChange={e => setRowsPerPage(Number(e.target.value))}
                      className="rows-select"
                    >
                      {[10, 15, 20, 25, 50].map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="seguimiento-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Fecha</th>
                        <th>Actividad</th>
                        <th>Responsable</th>
                        <th>Área</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedActivities.length > 0 ? (
                        paginatedActivities.map((act, index) => (
                          <tr key={act.id}>
                            <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                            <td>
                              {new Date(act.fin).toLocaleDateString('es-PE', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              })}
                            </td>
                            <td>{act.descripcion}</td>
                            <td>{act.nom_col ? act.nom_col.split(' ')[0] : '-'}</td>
                            <td>{act.nom_are}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="no-results">
                            No se encontraron actividades para la búsqueda
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {latestActivitiesPerDay.length > rowsPerPage && (
                  <div className="pagination">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="pagination-button"
                    >
                      « Primero
                    </button>
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="pagination-button"
                    >
                      ‹ Anterior
                    </button>
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`pagination-button ${currentPage === pageNum ? 'active' : ''}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="pagination-button"
                    >
                      Siguiente ›
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="pagination-button"
                    >
                      Último »
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Consulta;