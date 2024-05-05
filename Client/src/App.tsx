import React, { useState, ChangeEvent, FormEvent } from 'react';

function App() {

  const [formData, setFormData] = useState({
    fullName: "",
    ID: "",
    correo: "",
    celular: "",
    startdate: "",
    enddate: "",
    ninos: 0,
    adultos: 0
  });
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newValue: string | number = value; // Por defecto, el valor es una cadena

    // Verifica si el campo es uno de los que se deben convertir a entero
    if (["Cantidad", "ninos", "adultos"].includes(name)) {
      const intValue = parseInt(value);
      newValue = isNaN(intValue) ? 0 : intValue; 
    }
    setFormData(prevState => ({
      ...prevState,
      [name]: newValue,
    }))
    
  };
  
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const { startdate, enddate } = formData; 
    const habilitar = await fetch('http://localhost:8080/reservacionHabilitada?startdate=' + startdate + '&enddate=' + enddate);
    const data = await habilitar.json();
    console.log('startdate:', startdate);
    console.log('enddate:', enddate);
    console.log('fechas de habilitar:', habilitar);

    if (habilitar.ok) {
        console.log('Data:', data);
        if (!data.disponible) { // Corrección en la condición de disponibilidad
            alert("Las fechas seleccionadas ya están ocupadas. Por favor, elija otras fechas.");
            return;
        } else {
            // Si las fechas están disponibles, guardar la reserva
            const response = await fetch('http://localhost:8080/reservacion', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const newData = await response.json();
            console.log('reservacion creada:', newData);
        }
    } else {
        alert("Error al verificar disponibilidad de fechas. Por favor, inténtelo de nuevo más tarde.");
    }
};

  return (
    <div>
        <nav className="col-12 col-m-12 col-g-12 menun">
          <div className="imagen col-12 col-lg-2">
              <img src="img/RapidInn-logo.png" className="imagen1" alt="Logo" />
          </div>    
          <div className="opciones col-12 col-lg-10">
              <a className="espacio col-12 col-lg-12"></a>
              <a href="https://david10dx.github.io/FCB_news/" className="opcion l-12 col-lg-3">SERVICIOS</a>
              <a href="https://david10dx.github.io/FCB_calendario/" className="opcion l-12 col-lg-3">OFERTAS</a>
              <div className="imagen2 col-12 col-lg-6">
                  <img src="img/RapidInn-letras.png" alt="RapidInn" />
              </div>
          </div>
        </nav>
        <div className="presentacion col-12 col-lg-12">
          <div className="presentacion2 col-12 col-lg-12">
              <h2>¡Bienvenido a Localidad Rapid-INN!</h2>
          </div>
        </div>
        
        <div className="separador col-12 col-lg-12"></div>
        <div className="separadorl col-12 col-lg-1"></div>
        <div className="formulario col-12 col-lg-10">
          <form onSubmit={handleSubmit}>
            <div className="col-lg-12 uno">
              <h1>Reservación</h1>
            </div>
            <div className="col-lg-12 uno">
              <p>Especifique todos los detalles posibles para realizar su reservación correctamente.</p>
            </div>
            <div className="col-12 col-lg-6 uno">
              <label> Nombre Completo:</label><br/>
              <input type="text" id="name" name="fullName" value={formData.fullName} onChange={handleChange} />
            </div>
            <div className="col-12 col-lg-6 uno">
              <label> Num. Identidad:</label><br/>
              <input type="text" id="id" name="ID" value={formData.ID} onChange={handleChange} />
            </div>
            <div className="separadorf col-12 col-lg-12"></div>
            <div className="col-12 col-lg-6 uno">
              <label> E-mail:</label><br/>
              <input type="email" id="correo" name="correo" value={formData.correo} onChange={handleChange} />
            </div>
            <div className="col-12 col-lg-6 uno">
              <label> Telefono:</label><br/>
              <input type="text" id="numero" name="celular" value={formData.celular} onChange={handleChange} />
            </div>
            <div className="separadorf col-12 col-lg-12"></div>
            <div className="col-12 col-lg-6 uno">
              <label> Fecha de Entrada:</label><br/>
              <input type="date" id="fechae" name="startdate" value={formData.startdate} onChange={handleChange} />
            </div>
            <div className="col-12 col-lg-6 uno">
              <label> Fecha de Salida:</label><br/>
              <input type="date" id="fechas" name="enddate" value={formData.enddate} onChange={handleChange} />
            </div>
            <div className="separadorf col-12 col-lg-12"></div>
            <div className="col-12 col-lg-6 uno">
              <label>Cant. Adultos:</label><br/>
              <input type="number" id="adultos" name="adultos" value={formData.adultos} onChange={handleChange} />
            </div>
            <div className="col-12 col-lg-6 uno">
              <label>Cant. Niños:</label><br/>
              <input type="number" id="ninos" name="ninos" value={formData.ninos} onChange={handleChange} />
            </div>
            <div className="separadorf col-12 col-lg-12"></div>
            <div className="col-lg-12 uno">
              <div className="col-lg-4 separadorb"></div>
              <div className="col-lg-4 boton">
               <button type="submit">Reservar</button> 
              </div>
              <div className="col-lg-4 separadorb"></div>
            </div>
          </form>
        </div>
        <div className="separadorl col-12 col-lg-1"></div>
        <div className="separador col-12 col-lg-12"></div>

    </div>
  );
}

export default App;
