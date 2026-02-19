import React, { useState, useMemo, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axios from "axios";
import "../App.css";
import logo from '../assets/logo.png'

export default function App() {
  const [form, setForm] = useState({
    nombre: "",
    usuario: "",
    redes: "",
    detalle: "",
    total: "",
    anticipo: "",
    estado: "pendiente",
    tipoEntrega: "personal",
  });

  const [pedidos, setPedidos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [campoBusqueda, setCampoBusqueda] = useState("usuario");
  const [editandoId, setEditandoId] = useState(null);

  const descargarExcel = () => {
  const datos = pedidos.map((p) => ({
    Pedido: p.pedido,
    Nombre: p.nombre,
    Usuario: p.usuario,
    Redes: p.redes,
    Detalle: p.detalle,
    Total: p.total,
    Anticipo: p.anticipo,
    Estado: p.estado,
    Entrega: p.tipoEntrega,
  }));

  const worksheet = XLSX.utils.json_to_sheet(datos);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Pedidos");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const data = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  saveAs(data, "Pedidos.xlsx");
};


  useEffect(() => {
    obtenerPedidos();
  }, []);

  const obtenerPedidos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/pedidos");
      console.log(res.data);
      //setPedidos(res.data);
      if (Array.isArray(res.data)) 
      {
      setPedidos(res.data);
      } 
      else if (Array.isArray(res.data.pedidos)) 
        {
      setPedidos(res.data.pedidos);
     } 
    else 
      {
      setPedidos([]);
    }
    } catch (error) {
      console.error("Error obteniendo pedidos:", error);
    }
  };

  const eliminarPedido = async (id) => {
  const confirmar = window.confirm("¿Eliminar este pedido?");
  if (!confirmar) return;

  try {
    await axios.delete(`http://localhost:5000/api/pedidos/${id}`);
    obtenerPedidos(); // refresca la tabla
  } catch (error) {
    console.error("Error eliminando pedido:", error);
  }
};

  const agregarOEditarPedido = async () => {
    if (!form.usuario || !form.detalle) return;

    try {
      if (editandoId) {
        await axios.put(`http://localhost:5000/api/pedidos/${editandoId}`, form);
        setEditandoId(null);
      } else {
        await axios.post("http://localhost:5000/api/pedidos", {
          ...form,
          pedido: pedidos.length + 1,
        });
      }

      obtenerPedidos();

      setForm({
        nombre: "",
        usuario: "",
        redes: "",
        detalle: "",
        total: "",
        anticipo: "",
        estado: "pendiente",
        tipoEntrega: "personal",
      });
    } catch (error) {
      console.error("Error guardando pedido:", error);
    }
  };

  const editarPedido = (pedido) => {
    setForm({ ...pedido });
    setEditandoId(pedido._id);
  };

  const pedidosFiltrados = useMemo(() => {
    return pedidos.filter((p) =>
      p[campoBusqueda]
        ?.toString()
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    );
  }, [busqueda, campoBusqueda, pedidos]);

  const obtenerColorEstado = (estado) => {
    if (estado === "pagado") return "estado-verde";
    if (estado === "enviado") return "estado-morado";
    return "estado-amarillo";
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const pedidosOrdenados = [...pedidosFiltrados].sort(
  (a, b) => Number(a.pedido) - Number(b.pedido)
);

  return (
    <div className="contenedor">
      <div className="card">
          <img src={logo} alt="logo fakeshop" className="Logo"/>

        <h1 className="titulo">Gestión de Pedidos</h1>
        <div className="form-grid">
          <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
          <input name="usuario" placeholder="Usuario" value={form.usuario} onChange={handleChange} />
         <select
          name="redes"
          value={form.redes}
          onChange={handleChange}
        >
          <option value="">Seleccionar red</option>
          <option value="Instagram">Instagram</option>
          <option value="Facebook">Facebook</option>
          <option value="TikTok">TikTok</option>
          <option value="WB">WB</option>
          <option value="Whatsapp">Whatsapp</option>
        </select>

          <textarea
            name="detalle"
            placeholder="Detalle del pedido"
            value={form.detalle}
            onChange={handleChange}
          />

          <input type="number" name="total" placeholder="Total" value={form.total} onChange={handleChange} />
          <input type="number" name="anticipo" placeholder="Anticipo" value={form.anticipo} onChange={handleChange} />

          <select name="estado" value={form.estado} onChange={handleChange}>
            <option value="pendiente">Pendiente</option>
            <option value="pagado">Pagado</option>
            <option value="enviado">Enviado</option>
          </select>

          <select name="tipoEntrega" value={form.tipoEntrega} onChange={handleChange}>
            <option value="personal">Personal</option>
            <option value="evento">Evento</option>
            <option value="local">Local</option>
            <option value="nacional">Nacional</option>
          </select>

          <button className="boton-principal" onClick={agregarOEditarPedido}>
            {editandoId ? "Guardar Cambios" : "Agregar Pedido"}
          </button>
         
        </div>

        <div className="buscador">
  <select
    value={campoBusqueda}
    onChange={(e) => setCampoBusqueda(e.target.value)}
  >
    <option value="nombre">Nombre</option>
    <option value="usuario">Usuario</option>
    <option value="pedido">Número Pedido</option>
    <option value="anticipo">Anticipo</option>
    <option value="tipoEntrega">Tipo de Entrega</option>
  </select>

  <input
    type="text"
    placeholder="Buscar..."
    value={busqueda}
    onChange={(e) => setBusqueda(e.target.value)}
  />

</div>

        <table>
          <thead>
            <tr>
              <th>Pedido</th>
    <th>Nombre</th>
    <th>Usuario</th>
    <th>Redes</th>
    <th>Detalle</th>
    <th>Total</th>
    <th>Anticipo</th>
    <th>Estado</th>
    <th>Entrega</th>
    <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {pedidosOrdenados.map((p) => (
              <tr key={p._id}>
               <td>#{p.pedido || "-"}</td>
      <td>{p.nombre || "-"}</td>
      <td>{p.usuario || "-"}</td>
      <td>{p.redes || "-"}</td>
      <td>{p.detalle || "-"}</td>
      <td>${p.total ?? 0}</td>
      <td>${p.anticipo ?? 0}</td>
      <td>
        <span className={`estado ${obtenerColorEstado(p.estado)}`}>
          {p.estado || "pendiente"}
        </span>
      </td>
      <td>{p.tipoEntrega || "-"}</td>
      <td>
                  <button className="boton-editar" onClick={() => editarPedido(p)}>Editar</button>
                </td>

                <td>
  <button
    className="boton-eliminar"
    onClick={() => eliminarPedido(p._id)}
  >
    🗑
  </button>
</td>
              </tr>
            ))}
          </tbody>
        </table>

    <div className="contenedor-excel">
  <button className="boton-excel" onClick={descargarExcel}>
    Descargar Excel
  </button>
</div>

      </div>
    </div>
  );
}
