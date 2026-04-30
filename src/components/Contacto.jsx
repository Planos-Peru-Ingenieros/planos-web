import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";
import { MdDirections } from "react-icons/md";
import "../styles/Contacto.scss";

const Contacto = () => {
  const sedes = [
    {
      nombre: "Oficina Principal",
      direccion: "Lima",
      telefono: "+51 962 303 092",
      email: "gesstion@hotmail.com",
      horario: "Lunes a Viernes: 9:00 am - 6:00 pm",
      mapaUrl:
        "https://www.google.com/maps/place/PLANOS+PERU+-+SUNARP+Declaratoria+De+Fabrica,+Independizaci%C3%B3n,+EMISION+PARTIDAS+,+CRI+,+COMAS/@-11.949587,-77.056137,14z/data=!4m6!3m5!1s0x9105d02ad3739cf9:0xb02a92128b80333c!8m2!3d-11.9495868!4d-77.0561366!16s%2Fg%2F11bw3bbq7p?hl=en&entry=ttu&g_ep=EgoyMDI1MDUxNS4xIKXMDSoASAFQAw%3D%3D",
    },
    {
      nombre: "Oficina Lima Centro",
      direccion: "José del Carmen Verástegui 273, San Juan de Miraflores",
      telefono: "+51 962 303 092",
      email: "gesstion@hotmail.com",
      horario: "Lunes a Viernes: 9:00 am - 6:00 pm",
      mapaUrl: "https://maps.app.goo.gl/V9K5S6ModLu7SUHN6",
    },
    {
      nombre: "Oficina Lima Sur",
      direccion: "Av. Alameda Central, Pista Este Manzana 2d Lotes 3 - 4, Cañete",
      telefono: "+51 962 303 092",
      email: "gesstion@hotmail.com",
      horario: "Lunes a Viernes: 9:00 am - 6:00 pm",
      mapaUrl: "https://maps.app.goo.gl/5jXwLNWRKNL1grqA8",
    },
  ];

  return (
    <section className="contacto-page">
      <div className="container">
        <div className="contacto-header">
          <h1>Contáctanos</h1>
          <p>Estamos aquí para ayudarte en todo lo que necesites</p>
        </div>

        <div className="sedes-container">
          {sedes.map((sede, index) => (
            <div key={index} className="sede-card">
              <div className="sede-header">
                <FaMapMarkerAlt className="icon" />
                <h2>{sede.nombre}</h2>
              </div>

              <div className="sede-info">
                <div className="info-item">
                  <FaMapMarkerAlt className="icon" />
                  <p>{sede.direccion}</p>
                </div>

                <div className="info-item">
                  <FaPhone className="icon" />
                  <p>{sede.telefono}</p>
                </div>

                <div className="info-item">
                  <FaEnvelope className="icon" />
                  <p>{sede.email}</p>
                </div>

                <div className="info-item">
                  <FaClock className="icon" />
                  <p>{sede.horario}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contacto;
