import React, { useState, useEffect } from 'react';
import '../styles/Cotizacion.scss'; // Archivo SCSS que crearemos
import Select from 'react-select';
import bannerImage from '../assets/img/backgrounds/miraflores.jpg';
import { motion } from 'framer-motion';

const FormularioProyecto = () => {
  const [formData, setFormData] = useState({
    tipoProyecto: '',
    dni: '',
    cliente: '',
    ubicacion: '', // Este campo ahora será un input de texto
    correo: '',
    telefono: '',
    area: '',
    pisos: '',
    descripcion: ''
  });

  // SE ELIMINÓ: El código que cargaba las ubicaciones desde la API ya no es necesario.

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChangeGeneric = (selectedOption, actionMeta) => {
    const { name } = actionMeta;
    setFormData(prev => ({ ...prev, [name]: selectedOption ? selectedOption.value : '' }));
  };

  const tipoProyectoOptions = [
    { value: 'Declaratoria de fábrica', label: 'Declaratoria de fábrica' },
    { value: 'Declaratoria de fábrica por subdivisión', label: 'Declaratoria de fábrica por subdivisión' },
    { value: 'Declaratoria de fábrica por independización', label: 'Declaratoria de fábrica por independización' },
    { value: 'Levantamiento de cargas técnicas(no legales)', label: 'Levantamiento de cargas técnicas(no legales)' },
    { value: 'Búsqueda catrastal', label: 'Búsqueda catrastal' },
    { value: 'Acumulación de lote urbano', label: 'Acumulación de lote urbano' },
    { value: 'Licencia de construcción', label: 'Licencia de construcción' },
    { value: 'Licencia de demolición', label: 'Licencia de demolición' },
    { value: 'Visación de planos', label: 'Visación de planos' },
    { value: 'Otros', label: 'Otros' },
  ];

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + "=")) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  useEffect(() => {
    const inputDni = document.querySelector('input[name="dni"]');
    const inputCliente = document.querySelector('input[name="cliente"]');

    if (!inputDni || !inputCliente) return;

    const capitalizarNombre = (texto) => {
      return texto
        .toLowerCase()
        .split(' ')
        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
        .join(' ');
    };

    const manejarCambio = async (e) => {
      const valor = e.target.value.trim();

      if (valor.length === 8) {
        try {
          const res = await fetch(`https://intranet.planosperu.com.pe/api/dni/${valor}`);
          const data = await res.json();
          if (data?.nombreCompleto) {
            setFormData(prev => ({ ...prev, cliente: capitalizarNombre(data.nombreCompleto) }));
          } else {
            setFormData(prev => ({ ...prev, cliente: '' }));
          }
        } catch (error) {
          console.error("Error al consultar DNI", error);
          setFormData(prev => ({ ...prev, cliente: '' }));
        }
      } else if (valor.length === 11) {
        try {
          const res = await fetch(`https://intranet.planosperu.com.pe/api/ruc/${valor}`);
          const data = await res.json();
          if (data?.razonSocial) {
            setFormData(prev => ({ ...prev, cliente: capitalizarNombre(data.razonSocial) }));
          } else {
            setFormData(prev => ({ ...prev, cliente: '' }));
          }
        } catch (error) {
          console.error("Error al consultar RUC", error);
          setFormData(prev => ({ ...prev, cliente: '' }));
        }
      } else {
        setFormData(prev => ({ ...prev, cliente: '' }));
      }
    };

    inputDni.addEventListener("input", manejarCambio);

    return () => {
      inputDni.removeEventListener("input", manejarCambio);
    };
  }, []);

  useEffect(() => {
    fetch('https://intranet.planosperu.com.pe/intranet/api/csrf/', {
      credentials: 'include',
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const csrftoken = getCookie('csrftoken');
    try {
      const response = await fetch('https://intranet.planosperu.com.pe/intranet/api/enviar/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      alert(data.mensaje);
    } catch (error) {
      alert('Error al enviar el formulario');
      console.error(error);
    }
  };

  return (
    <div className="form-page-container">
      <div className="hero-banner">
        <div className="hero-image">
          <img src={bannerImage} alt="Equipo de arquitectura" />
        </div>
        <div className="hero-overlay">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1>Solicitud de Cotización</h1>
            <p>¡Cotiza con nosotros!</p>
          </motion.div>
        </div>
      </div>

      <div className="form-container">
        <form className="project-form" onSubmit={handleSubmit}>
          <h2 className="form-title">Formulario de Proyecto</h2>
          <div className="form-section">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Tipo de proyecto *</label>
                <Select
                  name="tipoProyecto"
                  className="form-input"
                  options={tipoProyectoOptions}
                  onChange={handleSelectChangeGeneric}
                  value={tipoProyectoOptions.find(option => option.value === formData.tipoProyecto) || null}
                  placeholder="Seleccione Tipo de proyecto"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">DNI o RUC</label>
                <input
                  type="text"
                  name="dni"
                  className="form-input"
                  placeholder="Ingrese su DNI"
                  value={formData.dni}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Cliente / Empresa *</label>
                <input
                  type="text"
                  name="cliente"
                  className="form-input"
                  placeholder="Ingrese sus nombres y apellidos"
                  value={formData.cliente}
                  onChange={handleChange}
                  required
                />
              </div>
              
              {/* CAMBIO: El 'Select' fue reemplazado por un 'input' de texto */}
              <div className="form-group">
                <label className="form-label">Distrito o Provincia *</label>
                <input
                  type="text"
                  name="ubicacion"
                  className="form-input"
                  placeholder="Ej: Miraflores, Callao"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Correo *</label>
                <input
                  type="email"
                  name="correo"
                  className="form-input"
                  placeholder="Ingrese su correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Número de teléfono *</label>
                <input
                  type="tel"
                  name="telefono"
                  className="form-input"
                  placeholder="Ingrese su número"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Área (m2) aprox*</label>
                <input
                  type="number"
                  name="area"
                  className="form-input"
                  placeholder="Ingrese área"
                  value={formData.area}
                  onChange={handleChange}
                  min="1.00"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">N° de Pisos del Proyecto *</label>
                <input
                  type="number"
                  name="pisos"
                  className="form-input"
                  placeholder="Ingrese número de pisos"
                  value={formData.pisos}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Descripción</label>
                <textarea
                  name="descripcion"
                  className="form-input"
                  rows="4"
                  placeholder="Ingrese una descripción"
                  value={formData.descripcion}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-button">Enviar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioProyecto;