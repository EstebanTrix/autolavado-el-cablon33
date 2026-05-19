const serviciosCatalogo = [
  // ── LAVADO ──
  {
    id:1, nombre:'Lavado Express', tipo:'lavado',
    desc:'Aspirado interior, limpieza de tablero, marcos y puertas, lavado exterior.',
    precio_auto:100, precio_camioneta:150,
    icono:'💧', iconoBg:'#3b82f6',
    bullets:['Aspirado Interior','Limpieza de tablero','Limpieza de marcos y puertas','Lavado exterior']
  },
  {
    id:2, nombre:'Abrillantador para Llantas', tipo:'lavado',
    desc:'Brillo profesional para tus llantas.',
    precio_auto:50, precio_camioneta:80,
    icono:'✨', iconoBg:'#f59e0b',
    bullets:['Aplicación de abrillantador','Acabado brillante']
  },
  {
    id:3, nombre:'Cera Exterior', tipo:'lavado',
    desc:'Protección y brillo profundo para la pintura.',
    precio_auto:50, precio_camioneta:80,
    icono:'💎', iconoBg:'#06b6d4',
    bullets:['Cera de alta duración','Brillo espejo']
  },
  // ── DETALLADO ──
  {
    id:4, nombre:'Lavado de Vestiduras', tipo:'detallado',
    desc:'Limpieza profunda de asientos, tapetes y techo interior.',
    precio_auto:1500, precio_camioneta:1900,
    icono:'🪑', iconoBg:'#3b82f6',
    bullets:['Extracción de polvo','Limpieza con vapor','Acondicionador','Secado profesional']
  },
  {
    id:5, nombre:'Lavado de Motor', tipo:'detallado',
    desc:'Desengrasado y limpieza del compartimiento del motor.',
    precio_auto:800, precio_camioneta:1100,
    icono:'⚙️', iconoBg:'#f97316',
    bullets:['Desengrasante profesional','Lavado a presión','Protección de cables','Brillantador']
  },
  {
    id:6, nombre:'Limpieza Interior', tipo:'detallado',
    desc:'Interior impecable: tablero, vidrios, plásticos.',
    precio_auto:1000, precio_camioneta:1400,
    icono:'✨', iconoBg:'#eab308',
    bullets:['Aspirado completo','Tablero y consola','Vidrios interiores','Aromatizante']
  },
  {
    id:7, nombre:'Chasis y Rines', tipo:'detallado',
    desc:'Limpieza profunda de chasis y rines.',
    precio_auto:1000, precio_camioneta:1400,
    icono:'🔧', iconoBg:'#22c55e',
    bullets:['Desengrasado','Limpieza de rines','Brillantador','Protección anticorrosión']
  },
  {
    id:8, nombre:'Pulido de Pintura', tipo:'detallado',
    desc:'Restauración y brillo profesional.',
    precio_auto:1200, precio_camioneta:1700,
    icono:'💎', iconoBg:'#a855f7',
    bullets:['Corrección de pintura','Pulido 3 pasos','Sellador','Cera premium']
  }
];

let isCamioneta = false;
let currentTab = 'lavado';
let serviciosSeleccionados = [];
let totalCalculado = 0;
let datosUltimaOrden = null;

// ========== SISTEMA DE CALIFICACIÓN PARA CLIENTES ==========
let calificaciones = [];
let ordenVerificada = null;
let calificacionTemp = 0;

function cargarCalificaciones() {
  const guardadas = localStorage.getItem('calificaciones_cablon33');
  if (guardadas) {
    calificaciones = JSON.parse(guardadas);
  }
}

function guardarCalificaciones() {
  localStorage.setItem('calificaciones_cablon33', JSON.stringify(calificaciones));
}

function verificarOrden() {
  const ordenInput = document.getElementById('orden-verificar').value.trim();
  const errorDiv = document.getElementById('verificar-error');
  
  if (!ordenInput) {
    errorDiv.textContent = '⚠️ Ingresa un número de orden.';
    errorDiv.classList.remove('hidden');
    return;
  }

  const ordenesGuardadas = JSON.parse(localStorage.getItem('ordenes_cablon33') || '[]');
  const orden = ordenesGuardadas.find(o => o.id === ordenInput);
  
  if (!orden) {
    errorDiv.textContent = '⚠️ Número de orden no encontrado. Verifica tu código.';
    errorDiv.classList.remove('hidden');
    return;
  }
  
  if (orden.calificado) {
    errorDiv.textContent = '⚠️ Esta orden ya fue calificada anteriormente. ¡Gracias!';
    errorDiv.classList.remove('hidden');
    return;
  }

  errorDiv.classList.add('hidden');
  ordenVerificada = ordenInput;
  document.getElementById('verificar-orden').style.display = 'none';
  document.getElementById('form-calificar').classList.remove('hidden');
  document.getElementById('orden-verificada').innerHTML = `Calificando orden: <strong>${ordenInput}</strong>`;
}

function setCalificacion(valor) {
  calificacionTemp = valor;
  const stars = document.querySelectorAll('.star-calif');
  stars.forEach((star, index) => {
    if (index < valor) {
      star.innerHTML = '★';
      star.classList.add('active');
    } else {
      star.innerHTML = '☆';
      star.classList.remove('active');
    }
  });
}

function enviarCalificacion() {
  if (!ordenVerificada) {
    alert('Primero verifica tu orden.');
    return;
  }
  
  if (calificacionTemp === 0) {
    alert('Por favor selecciona una calificación de estrellas.');
    return;
  }
  
  const comentario = document.getElementById('comentario-calificacion').value.trim();
  
  const nuevaCalificacion = {
    id: Date.now(),
    ordenId: ordenVerificada,
    puntuacion: calificacionTemp,
    comentario: comentario,
    fecha: new Date().toLocaleDateString('es-MX')
  };
  
  calificaciones.push(nuevaCalificacion);
  guardarCalificaciones();
  
  const ordenesGuardadas = JSON.parse(localStorage.getItem('ordenes_cablon33') || '[]');
  const ordenIndex = ordenesGuardadas.findIndex(o => o.id === ordenVerificada);
  if (ordenIndex !== -1) {
    ordenesGuardadas[ordenIndex].calificado = true;
    localStorage.setItem('ordenes_cablon33', JSON.stringify(ordenesGuardadas));
  }
  
  document.getElementById('calif-exito').classList.remove('hidden');
  document.getElementById('calif-error').classList.add('hidden');
  
  setTimeout(() => {
    document.getElementById('verificar-orden').style.display = 'block';
    document.getElementById('form-calificar').classList.add('hidden');
    document.getElementById('orden-verificar').value = '';
    document.getElementById('comentario-calificacion').value = '';
    setCalificacion(0);
    ordenVerificada = null;
    calificacionTemp = 0;
    document.getElementById('calif-exito').classList.add('hidden');
  }, 3000);
}

// ---- Navegación ----
function goTo(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const t = document.getElementById('page-' + pageId);
  if (t) t.classList.add('active');
  window.scrollTo({ top:0, behavior:'smooth' });
}

function scrollToSection(id) {
  goTo('home');
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior:'smooth' });
  }, 50);
}

function toggleTheme() {
  document.body.classList.toggle('light-theme');
}

// ---- Catálogo ----
document.addEventListener('DOMContentLoaded', () => {
  cargarCalificaciones();
  renderCards();
  actualizarBarraFlotante();
});

function setVehicle(large) {
  isCamioneta = large;
  document.getElementById('btn-auto').classList.toggle('active', !large);
  document.getElementById('btn-camioneta').classList.toggle('active', large);
  serviciosSeleccionados = [];
  renderCards();
  actualizarBarraFlotante();
}

function setTab(t) {
  currentTab = t;
  document.getElementById('tab-lavado').classList.toggle('active', t === 'lavado');
  document.getElementById('tab-detallado').classList.toggle('active', t === 'detallado');
  renderCards();
}

function renderCards() {
  const container = document.getElementById('cards-grid');
  if (!container) return;
  container.innerHTML = '';
  serviciosCatalogo.filter(s => s.tipo === currentTab).forEach(s => {
    const precio = isCamioneta ? s.precio_camioneta : s.precio_auto;
    const sel = serviciosSeleccionados.includes(s.id);
    const bulletItems = s.bullets.map(b => `
      <li>
        <div class="card-bullet-dot" style="background:${s.iconoBg}22;">
          <span style="color:${s.iconoBg};font-size:.7rem;">✓</span>
        </div>
        ${b}
      </li>`).join('');
    const card = document.createElement('div');
    card.className = 'card' + (sel ? ' selected' : '');
    card.onclick = () => toggleServicio(s.id);
    card.innerHTML = `
      <div class="card-header">
        <div class="card-icon-box" style="background:${s.iconoBg}22;">${s.icono}</div>
        <div>
          <div class="card-title">${s.nombre}</div>
          <div class="card-desc">${s.desc}</div>
        </div>
      </div>
      <div class="card-price-row">
        <div class="card-price">$${precio.toLocaleString('es-MX')}<span>MXN</span></div>
      </div>
      <ul class="card-bullets">${bulletItems}</ul>
      <button class="card-btn">${sel ? '✓ Seleccionado' : 'Seleccionar servicio'}</button>`;
    container.appendChild(card);
  });
}

function toggleServicio(id) {
  const i = serviciosSeleccionados.indexOf(id);
  if (i > -1) serviciosSeleccionados.splice(i, 1);
  else serviciosSeleccionados.push(id);
  renderCards();
  actualizarBarraFlotante();
}

function actualizarBarraFlotante() {
  const bar = document.getElementById('cta-bar');
  if (!bar) return;
  if (serviciosSeleccionados.length === 0) { bar.style.display = 'none'; return; }
  bar.style.display = 'flex';
  const items = serviciosCatalogo.filter(s => serviciosSeleccionados.includes(s.id));
  totalCalculado = items.reduce((sum,s) => sum + (isCamioneta ? s.precio_camioneta : s.precio_auto), 0);
  document.getElementById('cta-name').innerText  = `${serviciosSeleccionados.length} servicio(s) seleccionado(s)`;
  document.getElementById('cta-price').innerText = `$${totalCalculado.toFixed(2)} MXN`;
}

function goToForm() {
  const si = document.getElementById('form-summary-inner');
  if (!si) return;
  si.innerHTML = '';
  serviciosCatalogo.filter(s => serviciosSeleccionados.includes(s.id)).forEach(s => {
    const p = isCamioneta ? s.precio_camioneta : s.precio_auto;
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;justify-content:space-between;margin-bottom:.5rem;';
    row.innerHTML = `<span>${s.icono} ${s.nombre}</span><strong>$${p.toFixed(2)}</strong>`;
    si.appendChild(row);
  });
  const tot = document.createElement('div');
  tot.style.cssText = 'margin-top:1rem;padding-top:1rem;border-top:2px dashed rgba(255,255,255,.1);display:flex;justify-content:space-between;color:#fb923c;font-weight:700;';
  tot.innerHTML = `<span>TOTAL ESTIMADO:</span><span>$${totalCalculado.toFixed(2)} MXN</span>`;
  si.appendChild(tot);
  goTo('form');
}

// ---- VALIDACIÓN DE FECHA Y HORA (CORREGIDA) ----
function validarFechaHora(fechaStr) {
  if (!fechaStr) {
    alert('❌ Por favor selecciona una fecha y hora para tu cita.');
    return false;
  }
  
  const fecha = new Date(fechaStr);
  const diaSemana = fecha.getDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado
  const hora = fecha.getHours();
  const minutos = fecha.getMinutes();
  
  // Verificar día: Domingo no está permitido
  if (diaSemana === 0) {
    alert('❌ Los domingos no atendemos. Horario disponible: Lunes a Sábado de 9:00 AM a 5:00 PM.');
    return false;
  }
  
  // Verificar hora: antes de las 9 AM
  if (hora < 9) {
    alert('❌ Nuestro horario de atención empieza a las 9:00 AM. Por favor selecciona una hora entre 9:00 AM y 5:00 PM.');
    return false;
  }
  
  // Verificar hora: después de las 5 PM (17:00)
  if (hora >= 17) {
    alert('❌ Nuestro horario de atención termina a las 5:00 PM. Por favor selecciona una hora entre 9:00 AM y 5:00 PM.');
    return false;
  }
  
  // Verificar hora exacta: si son las 5 PM exactas (17:00) no se permite
  if (hora === 17 && minutos > 0) {
    alert('❌ La última cita es a las 5:00 PM. Por favor selecciona una hora antes de las 5:00 PM.');
    return false;
  }
  
  return true;
}

// ---- GENERAR TICKET AUTOMÁTICAMENTE ----
function generarTicketPDF() {
  if (!datosUltimaOrden) return;
  
  const numOrden = document.getElementById('hdnIdOrden').value || generarIdLocal();
  
  let lineasServicios = '';
  datosUltimaOrden.servicios.forEach(s => {
    lineasServicios += `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #33333a;text-align:left;font-size:13px;">${s.nombre}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #33333a;text-align:right;font-weight:600;font-size:13px;">$${s.precio.toFixed(2)} MXN</td>
      </tr>`;
  });

  const fechaImpresion = new Date().toLocaleString('es-MX');
  const fechaCita = datosUltimaOrden.fecha ? formatearFecha(datosUltimaOrden.fecha) : 'Por confirmar';

  const el = document.createElement('div');
  el.style.cssText = 'width:210mm;min-height:297mm;padding:15mm;background:#121214;color:#e2e8f0;font-family:"Poppins",Arial,sans-serif;box-sizing:border-box;';
  
  el.innerHTML = `
    <div style="text-align:center;margin-bottom:20px;">
      <div style="font-size:32px;font-weight:900;color:#fb923c;">EL CABLON 33</div>
      <div style="font-size:12px;letter-spacing:2px;color:#fb923c;">AUTOLAVADO & DETALLADO AUTOMOTRIZ</div>
      <div style="font-size:10px;color:#888;margin-top:8px;">Av. Patria 1234, Col. Providencia, Guadalajara, Jal.</div>
      <div style="font-size:10px;color:#888;">Tel. 33 1234 5678 · detallado33@mail.com</div>
    </div>
    
    <div style="border-top:2px dashed #fb923c;margin:10px 0;"></div>
    
    <div style="display:flex;justify-content:space-between;margin:15px 0;">
      <div>
        <div style="font-size:11px;color:#888;">FOLIO DE ORDEN</div>
        <div style="font-size:24px;font-weight:900;color:#fb923c;">${numOrden}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:11px;color:#888;">FECHA DE EMISIÓN</div>
        <div style="font-size:14px;font-weight:600;">${fechaImpresion}</div>
      </div>
    </div>
    
    <div style="background:#1a1a1e;padding:15px;border-radius:12px;margin:15px 0;">
      <div style="font-size:12px;font-weight:700;color:#fb923c;margin-bottom:10px;">📋 DATOS DEL CLIENTE</div>
      <div><strong>Nombre:</strong> ${datosUltimaOrden.nombre}</div>
      <div><strong>Teléfono:</strong> ${datosUltimaOrden.telefono}</div>
      <div><strong>Correo:</strong> ${datosUltimaOrden.correo}</div>
    </div>
    
    <div style="background:#1a1a1e;padding:15px;border-radius:12px;margin:15px 0;">
      <div style="font-size:12px;font-weight:700;color:#fb923c;margin-bottom:10px;">🚗 DATOS DEL VEHÍCULO</div>
      <div><strong>Marca:</strong> ${datosUltimaOrden.marca}</div>
      <div><strong>Modelo/Año:</strong> ${datosUltimaOrden.modelo}</div>
      <div><strong>Categoría:</strong> ${datosUltimaOrden.tipoVehiculo}</div>
      ${datosUltimaOrden.placa ? `<div><strong>Placa:</strong> ${datosUltimaOrden.placa}</div>` : ''}
      <div><strong>Fecha de cita:</strong> ${fechaCita}</div>
    </div>
    
    <div style="background:#1a1a1e;padding:15px;border-radius:12px;margin:15px 0;">
      <div style="font-size:12px;font-weight:700;color:#fb923c;margin-bottom:10px;">🛠️ SERVICIOS CONTRATADOS</div>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#fb923c20;">
            <th style="padding:8px;text-align:left;color:#fb923c;">Servicio</th>
            <th style="padding:8px;text-align:right;color:#fb923c;">Precio</th>
           </tr>
        </thead>
        <tbody>${lineasServicios}</tbody>
       </table>
    </div>
    
    <div style="background:#fb923c20;padding:15px;border-radius:12px;margin:15px 0;text-align:right;">
      <div style="font-size:18px;font-weight:900;color:#fb923c;">TOTAL: $${datosUltimaOrden.total.toFixed(2)} MXN</div>
    </div>
    
    <div style="border-top:2px dashed #fb923c;margin:15px 0;"></div>
    
    <div style="text-align:center;margin-top:15px;">
      <div style="font-size:10px;color:#888;">Este comprobante no es una factura fiscal</div>
      <div style="font-size:10px;color:#888;">¡Gracias por confiar en El Cablon 33!</div>
    </div>
  `;

  const opt = {
    margin: [0.3, 0.3, 0.3, 0.3],
    filename: `Ticket_ElCablon33_${numOrden}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, backgroundColor: '#121214', useCORS: true, logging: false },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(el).save();
}

// ---- SUBMIT DEL FORMULARIO ----
function submitForm() {
  document.querySelectorAll('.form-error').forEach(e => e.classList.add('hidden'));
  const se = document.getElementById('server-error');
  if (se) se.classList.add('hidden');

  const nombre   = document.getElementById('f-nombre').value.trim();
  const telefono = document.getElementById('f-telefono').value.trim();
  const correo   = document.getElementById('f-email').value.trim();
  const marca    = document.getElementById('f-marca').value.trim();
  const modelo   = document.getElementById('f-modelo').value.trim();
  const placa    = document.getElementById('f-placa').value.trim();
  const fecha    = document.getElementById('f-fecha').value;

  let valid = true;
  if (!nombre)   { document.getElementById('err-nombre').classList.remove('hidden'); valid = false; }
  if (telefono.length !== 10) { document.getElementById('err-telefono').classList.remove('hidden'); valid = false; }
  if (!correo.includes('@')) { document.getElementById('err-email').classList.remove('hidden'); valid = false; }
  if (!marca)    { document.getElementById('err-marca').classList.remove('hidden'); valid = false; }
  if (!modelo)   { document.getElementById('err-modelo').classList.remove('hidden'); valid = false; }
  
  // VALIDACIÓN OBLIGATORIA DE FECHA Y HORA
  if (!validarFechaHora(fecha)) {
    valid = false;
  }
  
  if (!valid) return;

  const itemsContratados = serviciosCatalogo.filter(s => serviciosSeleccionados.includes(s.id));
  datosUltimaOrden = {
    nombre, telefono, correo, marca, modelo, placa, fecha,
    tipoVehiculo: isCamioneta ? 'Camioneta Grande' : 'Auto / SUV',
    servicios: itemsContratados.map(s => ({
      nombre: s.nombre,
      precio: isCamioneta ? s.precio_camioneta : s.precio_auto
    })),
    total: totalCalculado
  };

  const idLocal = generarIdLocal();
  document.getElementById('hdnIdOrden').value = idLocal;
  
  // Guardar orden
  const ordenesGuardadas = JSON.parse(localStorage.getItem('ordenes_cablon33') || '[]');
  ordenesGuardadas.push({
    id: idLocal,
    nombre: nombre,
    fecha: new Date().toISOString(),
    calificado: false
  });
  localStorage.setItem('ordenes_cablon33', JSON.stringify(ordenesGuardadas));

  // Mostrar éxito y luego generar ticket automático
  mostrarPaginaExito(nombre, idLocal, itemsContratados);
  
  // Generar ticket PDF automáticamente después de 1 segundo
  setTimeout(() => {
    generarTicketPDF();
  }, 1000);
}

function generarIdLocal() {
  return 'ORD-' + Date.now().toString().slice(-8);
}

function mostrarPaginaExito(nombre, idOrden, itemsContratados) {
  document.getElementById('success-nombre').innerText = nombre;
  document.getElementById('ticket-id-orden').innerText = idOrden;

  const meta = document.getElementById('ticket-meta');
  if (meta) {
    meta.innerHTML = `
      <div class="ticket-meta-item"><label>Cliente</label><span>${escapeHtml(nombre)}</span></div>
      <div class="ticket-meta-item"><label>Teléfono</label><span>${datosUltimaOrden.telefono}</span></div>
      <div class="ticket-meta-item"><label>Vehículo</label><span>${escapeHtml(datosUltimaOrden.marca)} ${escapeHtml(datosUltimaOrden.modelo)}</span></div>
      <div class="ticket-meta-item"><label>Categoría</label><span>${datosUltimaOrden.tipoVehiculo}</span></div>
      ${datosUltimaOrden.fecha ? `<div class="ticket-meta-item"><label>Fecha cita</label><span>${formatearFecha(datosUltimaOrden.fecha)}</span></div>` : ''}
      ${datosUltimaOrden.placa ? `<div class="ticket-meta-item"><label>Placa</label><span>${escapeHtml(datosUltimaOrden.placa)}</span></div>` : ''}
    `;
  }

  const servsEl = document.getElementById('ticket-servicios');
  if (servsEl) {
    servsEl.innerHTML = '';
    datosUltimaOrden.servicios.forEach(s => {
      const row = document.createElement('div');
      row.className = 'ticket-row';
      row.innerHTML = `<span>${escapeHtml(s.nombre)}</span><strong>$${s.precio.toFixed(2)} MXN</strong>`;
      servsEl.appendChild(row);
    });
  }

  const totalEl = document.getElementById('ticket-total');
  if (totalEl) totalEl.innerText = `$${totalCalculado.toFixed(2)} MXN`;
  
  goTo('success');
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function formatearFecha(fechaStr) {
  if (!fechaStr) return '—';
  try {
    const d = new Date(fechaStr);
    return d.toLocaleString('es-MX', { dateStyle:'medium', timeStyle:'short' });
  } catch { return fechaStr; }
}

// Función manual para descargar ticket (por si el cliente quiere otra copia)
function descargarTicketPDF() {
  generarTicketPDF();
}