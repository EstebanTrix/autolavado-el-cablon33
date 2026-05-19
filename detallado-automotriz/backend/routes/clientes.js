const API_URL = 'http://localhost:3000/api';
 
const serviciosCatalogo = [
  { id:1, nombre:'Lavado Express', tipo:'lavado', desc:'Aspirado interior, limpieza de tablero, marcos y puertas, lavado exterior.', precio_auto:100, precio_camioneta:150, icono:'💧', iconoBg:'#3b82f6', bullets:['Aspirado Interior','Limpieza de tablero','Limpieza de marcos y puertas','Lavado exterior'] },
  { id:2, nombre:'Abrillantador para Llantas', tipo:'lavado', desc:'Brillo profesional para tus llantas.', precio_auto:50, precio_camioneta:80, icono:'✨', iconoBg:'#f59e0b', bullets:['Aplicación de abrillantador','Acabado brillante'] },
  { id:3, nombre:'Cera Exterior', tipo:'lavado', desc:'Protección y brillo profundo para la pintura.', precio_auto:50, precio_camioneta:80, icono:'💎', iconoBg:'#06b6d4', bullets:['Cera de alta duración','Brillo espejo'] },
  { id:4, nombre:'Lavado de Vestiduras', tipo:'detallado', desc:'Limpieza profunda de asientos, tapetes y techo interior.', precio_auto:1500, precio_camioneta:1900, icono:'🪑', iconoBg:'#3b82f6', bullets:['Extracción de polvo','Limpieza con vapor','Acondicionador','Secado profesional'] },
  { id:5, nombre:'Lavado de Motor', tipo:'detallado', desc:'Desengrasado y limpieza del compartimiento del motor.', precio_auto:800, precio_camioneta:1100, icono:'⚙️', iconoBg:'#f97316', bullets:['Desengrasante profesional','Lavado a presión','Protección de cables','Brillantador'] },
  { id:6, nombre:'Limpieza Interior', tipo:'detallado', desc:'Interior impecable: tablero, vidrios, plásticos.', precio_auto:1000, precio_camioneta:1400, icono:'✨', iconoBg:'#eab308', bullets:['Aspirado completo','Tablero y consola','Vidrios interiores','Aromatizante'] },
  { id:7, nombre:'Chasis y Rines', tipo:'detallado', desc:'Limpieza profunda de chasis y rines.', precio_auto:1000, precio_camioneta:1400, icono:'🔧', iconoBg:'#22c55e', bullets:['Desengrasado','Limpieza de rines','Brillantador','Protección anticorrosión'] },
  { id:8, nombre:'Pulido de Pintura', tipo:'detallado', desc:'Restauración y brillo profesional.', precio_auto:1200, precio_camioneta:1700, icono:'💎', iconoBg:'#a855f7', bullets:['Corrección de pintura','Pulido 3 pasos','Sellador','Cera premium'] }
];
 
let isCamioneta = false;
let currentTab = 'lavado';
let serviciosSeleccionados = [];
let totalCalculado = 0;
let datosUltimaOrden = null;
 
// ──────────────────────────────────────────
//  UTIL
// ──────────────────────────────────────────
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function formatearFecha(fechaStr) {
  if (!fechaStr) return '—';
  try { return new Date(fechaStr).toLocaleString('es-MX', { dateStyle:'medium', timeStyle:'short' }); }
  catch { return fechaStr; }
}
 
// ──────────────────────────────────────────
//  NAVEGACIÓN
// ──────────────────────────────────────────
function goTo(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const t = document.getElementById('page-' + pageId);
  if (t) t.classList.add('active');
  window.scrollTo({ top:0, behavior:'smooth' });
}
function scrollToSection(id) {
  goTo('home');
  setTimeout(() => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior:'smooth' }); }, 50);
}
function scrollToSeccionOpiniones() {
  goTo('home');
  setTimeout(() => { const el = document.getElementById('opiniones'); if (el) el.scrollIntoView({ behavior:'smooth' }); }, 50);
}
function toggleTheme() { document.body.classList.toggle('light-theme'); }
 
// ──────────────────────────────────────────
//  CATÁLOGO
// ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderCards();
  actualizarBarraFlotante();
  cargarResenasPublicas();
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
    const bullets = s.bullets.map(b => `<li><div class="card-bullet-dot" style="background:${s.iconoBg}22;"><span style="color:${s.iconoBg};font-size:.7rem;">✓</span></div>${b}</li>`).join('');
    const card = document.createElement('div');
    card.className = 'card' + (sel ? ' selected' : '');
    card.onclick = () => toggleServicio(s.id);
    card.innerHTML = `
      <div class="card-header">
        <div class="card-icon-box" style="background:${s.iconoBg}22;">${s.icono}</div>
        <div><div class="card-title">${s.nombre}</div><div class="card-desc">${s.desc}</div></div>
      </div>
      <div class="card-price-row"><div class="card-price">$${precio.toLocaleString('es-MX')}<span>MXN</span></div></div>
      <ul class="card-bullets">${bullets}</ul>
      <button class="card-btn">${sel ? '✓ Seleccionado' : 'Seleccionar servicio'}</button>`;
    container.appendChild(card);
  });
}
function toggleServicio(id) {
  const i = serviciosSeleccionados.indexOf(id);
  if (i > -1) serviciosSeleccionados.splice(i, 1); else serviciosSeleccionados.push(id);
  renderCards(); actualizarBarraFlotante();
}
function actualizarBarraFlotante() {
  const bar = document.getElementById('cta-bar');
  if (!bar) return;
  if (!serviciosSeleccionados.length) { bar.style.display = 'none'; return; }
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
 
// ──────────────────────────────────────────
//  SUBMIT FORMULARIO
// ──────────────────────────────────────────
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
  if (!nombre)               { document.getElementById('err-nombre').classList.remove('hidden');   valid = false; }
  if (telefono.length !== 10){ document.getElementById('err-telefono').classList.remove('hidden'); valid = false; }
  if (!correo.includes('@')) { document.getElementById('err-email').classList.remove('hidden');    valid = false; }
  if (!marca)                { document.getElementById('err-marca').classList.remove('hidden');    valid = false; }
  if (!modelo)               { document.getElementById('err-modelo').classList.remove('hidden');   valid = false; }
  if (!valid) return;
 
  const itemsContratados = serviciosCatalogo.filter(s => serviciosSeleccionados.includes(s.id));
  datosUltimaOrden = {
    nombre, telefono, correo, marca, modelo, placa, fecha,
    tipoVehiculo: isCamioneta ? 'Camioneta Grande' : 'Auto / SUV',
    servicios: itemsContratados.map(s => ({ nombre: s.nombre, precio: isCamioneta ? s.precio_camioneta : s.precio_auto })),
    total: totalCalculado
  };
 
  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
 
  fetch(`${API_URL}/ordenes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, telefono, correo, marca, modelo, placa, fecha, vehiculo: isCamioneta ? 'Camioneta Grande' : 'Auto / SUV', total: totalCalculado, servicios: serviciosSeleccionados })
  })
  .then(async res => { const data = await res.json(); if (!res.ok) return Promise.reject(data); return data; })
  .then(data => { document.getElementById('hdnIdOrden').value = data.id_orden || ''; mostrarPaginaExito(nombre, data.id_orden || generarIdLocal(), itemsContratados); })
  .catch(() => { const idLocal = generarIdLocal(); document.getElementById('hdnIdOrden').value = idLocal; mostrarPaginaExito(nombre, idLocal, itemsContratados); })
  .finally(() => { btn.disabled = false; });
}
 
function generarIdLocal() { return 'L-' + Date.now().toString().slice(-6); }
 
function mostrarPaginaExito(nombre, idOrden, itemsContratados) {
  document.getElementById('success-nombre').innerText = nombre;
  document.getElementById('ticket-id-orden').innerText = idOrden;
 
  document.getElementById('ticket-meta').innerHTML = `
    <div class="ticket-meta-item"><label>Cliente</label><span>${escapeHtml(nombre)}</span></div>
    <div class="ticket-meta-item"><label>Teléfono</label><span>${datosUltimaOrden.telefono}</span></div>
    <div class="ticket-meta-item"><label>Vehículo</label><span>${escapeHtml(datosUltimaOrden.marca)} ${escapeHtml(datosUltimaOrden.modelo)}</span></div>
    <div class="ticket-meta-item"><label>Categoría</label><span>${datosUltimaOrden.tipoVehiculo}</span></div>
    ${datosUltimaOrden.fecha ? `<div class="ticket-meta-item"><label>Fecha preferida</label><span>${formatearFecha(datosUltimaOrden.fecha)}</span></div>` : ''}
    ${datosUltimaOrden.placa ? `<div class="ticket-meta-item"><label>Placa</label><span>${escapeHtml(datosUltimaOrden.placa)}</span></div>` : ''}
  `;
 
  const servsEl = document.getElementById('ticket-servicios');
  servsEl.innerHTML = '';
  datosUltimaOrden.servicios.forEach(s => {
    const row = document.createElement('div');
    row.className = 'ticket-row';
    row.innerHTML = `<span>${escapeHtml(s.nombre)}</span><strong>$${s.precio.toFixed(2)} MXN</strong>`;
    servsEl.appendChild(row);
  });
 
  document.getElementById('ticket-total').innerText = `$${totalCalculado.toFixed(2)} MXN`;
  goTo('success');
}
 
// ──────────────────────────────────────────
//  PDF CORREGIDO
//  • Fondo blanco (sin fondo oscuro que html2canvas no imprime bien)
//  • Tablas en lugar de flexbox (más compatibles con pdf)
//  • page-break-inside: avoid en cada bloque
//  • Elemento fuera de pantalla → se adjunta al body → se elimina tras guardar
// ──────────────────────────────────────────
function descargarTicketPDF() {
  if (!datosUltimaOrden) return;
  const numOrden     = document.getElementById('hdnIdOrden').value || '—';
  const fechaEmision = new Date().toLocaleString('es-MX', { dateStyle:'medium', timeStyle:'short' });
  const fechaCita    = datosUltimaOrden.fecha ? formatearFecha(datosUltimaOrden.fecha) : 'Por confirmar';
 
  let filasServicios = '';
  datosUltimaOrden.servicios.forEach((s, i) => {
    const bg = i % 2 === 0 ? '#f9f9f9' : '#ffffff';
    filasServicios += `
      <tr style="background:${bg};">
        <td style="padding:10px 14px;border-bottom:1px solid #e5e5e5;font-size:13px;color:#333;">${escapeHtml(s.nombre)}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #e5e5e5;font-size:13px;color:#333;text-align:right;font-weight:700;">$${s.precio.toFixed(2)} MXN</td>
      </tr>`;
  });
 
  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'position:fixed;left:-9999px;top:0;width:750px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#333;background:#ffffff;';
 
  wrapper.innerHTML = `
    <!-- HEADER -->
    <div style="background:#1a1a1e;padding:28px 36px;page-break-inside:avoid;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td valign="top">
            <div style="font-size:26px;font-weight:900;letter-spacing:3px;color:#fff;text-transform:uppercase;">EL CABLON 33</div>
            <div style="font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#fb923c;margin-top:5px;">Autolavado &amp; Detallado Automotriz</div>
            <div style="font-size:11px;color:#aaa;margin-top:10px;">Av. Patria 1234, Col. Providencia, Guadalajara, Jal.</div>
            <div style="font-size:11px;color:#aaa;">Tel. 33 1234 5678 &nbsp;·&nbsp; detallado33@mail.com</div>
          </td>
          <td valign="top" align="right">
            <div style="font-size:10px;color:#aaa;text-transform:uppercase;letter-spacing:1px;">Comprobante de Orden</div>
            <div style="font-size:30px;font-weight:900;color:#fb923c;">#${escapeHtml(numOrden)}</div>
            <div style="font-size:10px;color:#aaa;margin-top:4px;">Emitido: ${fechaEmision}</div>
          </td>
        </tr>
      </table>
      <div style="border-top:2px solid #fb923c;margin-top:18px;"></div>
    </div>
 
    <!-- DATOS CLIENTE + VEHÍCULO -->
    <div style="padding:24px 36px 0;page-break-inside:avoid;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="50%" valign="top" style="padding-right:10px;">
            <div style="background:#f5f5f5;border-left:4px solid #fb923c;padding:16px;border-radius:4px;">
              <div style="font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#fb923c;font-weight:700;margin-bottom:10px;">Datos del Cliente</div>
              <div style="margin-bottom:5px;"><b>Nombre:</b> ${escapeHtml(datosUltimaOrden.nombre)}</div>
              <div style="margin-bottom:5px;"><b>Teléfono:</b> ${escapeHtml(datosUltimaOrden.telefono)}</div>
              <div><b>Correo:</b> ${escapeHtml(datosUltimaOrden.correo)}</div>
            </div>
          </td>
          <td width="50%" valign="top" style="padding-left:10px;">
            <div style="background:#f5f5f5;border-left:4px solid #fb923c;padding:16px;border-radius:4px;">
              <div style="font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#fb923c;font-weight:700;margin-bottom:10px;">Vehículo</div>
              <div style="margin-bottom:5px;"><b>Unidad:</b> ${escapeHtml(datosUltimaOrden.marca)} ${escapeHtml(datosUltimaOrden.modelo)}</div>
              <div style="margin-bottom:5px;"><b>Categoría:</b> ${escapeHtml(datosUltimaOrden.tipoVehiculo)}</div>
              ${datosUltimaOrden.placa ? `<div style="margin-bottom:5px;"><b>Placa:</b> ${escapeHtml(datosUltimaOrden.placa)}</div>` : ''}
              <div><b>Cita:</b> ${fechaCita}</div>
            </div>
          </td>
        </tr>
      </table>
    </div>
 
    <!-- TABLA SERVICIOS -->
    <div style="padding:24px 36px 0;page-break-inside:avoid;">
      <div style="font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#fb923c;font-weight:700;margin-bottom:10px;">Servicios Contratados</div>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border:1px solid #e5e5e5;">
        <thead>
          <tr style="background:#fb923c;">
            <th style="padding:10px 14px;text-align:left;color:#fff;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Servicio</th>
            <th style="padding:10px 14px;text-align:right;color:#fff;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Precio</th>
          </tr>
        </thead>
        <tbody>${filasServicios}</tbody>
      </table>
    </div>
 
    <!-- TOTAL -->
    <div style="padding:20px 36px;page-break-inside:avoid;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1a1a1e;border-radius:6px;">
        <tr>
          <td valign="middle" style="padding:16px 20px;">
            <div style="font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#aaa;font-weight:700;">Total Estimado de la Orden</div>
            <div style="font-size:10px;color:#666;margin-top:3px;">Precios sujetos a revisión en sucursal</div>
          </td>
          <td valign="middle" align="right" style="padding:16px 20px;">
            <div style="font-size:28px;font-weight:900;color:#fb923c;">$${datosUltimaOrden.total.toFixed(2)} MXN</div>
          </td>
        </tr>
      </table>
    </div>
 
    <!-- PIE -->
    <div style="margin:0 36px;padding:16px 0 28px;border-top:1px solid #e5e5e5;text-align:center;page-break-inside:avoid;">
      <div style="font-size:11px;color:#999;line-height:1.7;">
        Este comprobante no es una factura fiscal. Los precios son estimados y pueden variar según las condiciones del vehículo.<br>
        Lunes a Viernes 9:00–19:00 &nbsp;·&nbsp; Sábado 9:00–15:00
      </div>
      <div style="font-size:13px;font-weight:700;color:#fb923c;margin-top:12px;">¡Gracias por confiar en El Cablon 33!</div>
    </div>
  `;
 
  document.body.appendChild(wrapper);
 
  html2pdf()
    .set({
      margin:      [8, 8, 8, 8],
      filename:    `Ticket_ElCablon33_Orden_${numOrden}.pdf`,
      image:       { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false },
      jsPDF:       { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak:   { mode: ['avoid-all', 'css'] }
    })
    .from(wrapper)
    .save()
    .then(()  => document.body.removeChild(wrapper))
    .catch(() => document.body.removeChild(wrapper));
}
 
// ──────────────────────────────────────────
//  RESEÑAS PÚBLICAS — carga desde backend
// ──────────────────────────────────────────
function cargarResenasPublicas() {
  const lista = document.getElementById('opiniones-lista');
  if (!lista) return;
  fetch(`${API_URL}/resenas/publicas`)
    .then(r => r.json())
    .then(data => {
      if (!data || !data.length) return;
      lista.innerHTML = '';
      data.forEach(r => {
        const stars = '★'.repeat(r.calificacion) + '☆'.repeat(5 - r.calificacion);
        const item  = document.createElement('div');
        item.className = 'opinion-item';
        item.innerHTML = `
          <div class="opinion-top">
            <span class="opinion-autor">${escapeHtml(r.cliente || 'Cliente')}</span>
            <span class="opinion-estrellas">${stars}</span>
          </div>
          <p class="opinion-texto">"${escapeHtml(r.comentario)}"</p>`;
        lista.appendChild(item);
      });
    })
    .catch(() => { /* sin backend: se muestran las pre-cargadas en el HTML */ });
}
 