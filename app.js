/**
 * app.js — Live Urban Transport Dashboard
 * Author: Jalaj Gupta
 *
 * Simulates the full pipeline locally in the browser for GitHub Pages demo.
 * In production, replace generateTick() with a fetch() call to the Flask API:
 *
 *   fetch("http://localhost:5000/data")
 *     .then(r => r.json())
 *     .then(data => renderData(data));
 */

// ─── Config ──────────────────────────────────────────────────────────────────

const ROUTES = [
  { id: 'RT-101', name: 'North Corridor', color: '#00e5a0' },
  { id: 'RT-204', name: 'East Express',   color: '#4d9fff' },
  { id: 'RT-317', name: 'West Loop',      color: '#ff6b35' },
  { id: 'RT-422', name: 'South Link',     color: '#ffb830' },
  { id: 'RT-519', name: 'City Centre',    color: '#c084fc' },
  { id: 'RT-633', name: 'Ring Road',      color: '#f472b6' },
];

const VEHICLES = [
  'VH-001','VH-002','VH-003','VH-004',
  'VH-005','VH-006','VH-007','VH-008',
  'VH-009','VH-010','VH-011','VH-012',
];

// ─── State ───────────────────────────────────────────────────────────────────

let speedHistory     = Array(30).fill(42);
let recordsProcessed = 84320;
let eventsPerMin     = 220;
let eventTick        = 0;
let prevKPIs         = {};
const vehicleDots    = [];

let routeState = ROUTES.map((r, i) => ({
  ...r,
  vehicle:   VEHICLES[i * 2],
  speed:     30 + Math.random() * 40,
  passengers: Math.floor(20 + Math.random() * 80),
  status:    'active',
  pos:       { x: 10 + Math.random() * 80, y: 10 + Math.random() * 80 },
  targetPos: { x: 10 + Math.random() * 80, y: 10 + Math.random() * 80 },
}));

// ─── Map ─────────────────────────────────────────────────────────────────────

function initMap() {
  const map = document.getElementById('miniMap');
  routeState.forEach(r => {
    const dot = document.createElement('div');
    dot.className = 'vehicle-dot';
    dot.style.cssText = `background:${r.color}; color:${r.color}; left:${r.pos.x}%; top:${r.pos.y}%`;
    map.appendChild(dot);
    vehicleDots.push(dot);
  });
}

function moveVehicles() {
  routeState.forEach((r, i) => {
    r.pos.x += (r.targetPos.x - r.pos.x) * 0.15;
    r.pos.y += (r.targetPos.y - r.pos.y) * 0.15;
    if (Math.random() < 0.05) {
      r.targetPos = { x: 5 + Math.random() * 90, y: 5 + Math.random() * 90 };
    }
    vehicleDots[i].style.left = r.pos.x + '%';
    vehicleDots[i].style.top  = r.pos.y + '%';
  });
}

// ─── Data simulation ─────────────────────────────────────────────────────────

function generateTick() {
  recordsProcessed += Math.floor(80 + Math.random() * 60);
  eventTick++;
  if (eventTick % 5 === 0) eventsPerMin = Math.floor(180 + Math.random() * 80);

  routeState = routeState.map(r => {
    const newSpeed = Math.max(5, Math.min(90, r.speed + (Math.random() - 0.5) * 8));
    const newPass  = Math.max(0, Math.min(120, r.passengers + Math.floor((Math.random() - 0.5) * 10)));
    const rand     = Math.random();
    const newStatus = rand < 0.70 ? 'active' : rand < 0.88 ? 'delayed' : 'idle';
    return { ...r, speed: newSpeed, passengers: newPass, status: newStatus };
  });

  const avg = routeState.reduce((a, r) => a + r.speed, 0) / routeState.length;
  speedHistory = [...speedHistory.slice(1), avg];
}

// ─── KPIs ────────────────────────────────────────────────────────────────────

function updateKPIs() {
  const active  = routeState.filter(r => r.status === 'active').length;
  const avgSpd  = (routeState.reduce((a, r) => a + r.speed, 0) / routeState.length).toFixed(1);
  const delayed = routeState.filter(r => r.status === 'delayed').length;
  const epm     = eventsPerMin;

  const setKPI = (valId, deltaId, val, prev) => {
    document.getElementById(valId).textContent = val;
    if (prev !== undefined) {
      const diff = parseFloat(val) - parseFloat(prev);
      const dl = document.getElementById(deltaId);
      dl.textContent = (diff >= 0 ? '↑ ' : '↓ ') + Math.abs(diff).toFixed(
        valId === 'kv2' ? 1 : 0
      ) + ' vs prev';
      dl.className = 'kpi-delta ' + (diff >= 0 ? 'up' : 'down');
    }
  };

  setKPI('kv1', 'kd1', active,  prevKPIs.active);
  setKPI('kv2', 'kd2', avgSpd,  prevKPIs.avgSpd);
  setKPI('kv3', 'kd3', delayed, prevKPIs.delayed);
  setKPI('kv4', 'kd4', epm,     prevKPIs.epm);

  prevKPIs = { active, avgSpd, delayed, epm };

  ['kpi-vehicles','kpi-speed','kpi-delayed','kpi-events'].forEach((id, i) => {
    const el = document.getElementById(id);
    el.classList.remove('updated');
    setTimeout(() => el.classList.add('updated'), i * 60);
  });
}

// ─── Route table ─────────────────────────────────────────────────────────────

function updateTable() {
  document.getElementById('routeTableBody').innerHTML = routeState.map(r => {
    const pct = Math.round(r.speed / 90 * 100);
    const col = r.speed > 60 ? '#00e5a0' : r.speed > 30 ? '#ffb830' : '#ff4560';
    const badge = r.status === 'active'  ? 'status-active'  :
                  r.status === 'delayed' ? 'status-delayed' : 'status-idle';
    return `
      <tr>
        <td><span class="route-id">${r.id}</span></td>
        <td style="font-family:'Space Mono',monospace;font-size:11px;color:var(--muted)">${r.vehicle}</td>
        <td>
          <div class="speed-bar">
            <div class="speed-track">
              <div class="speed-fill" style="width:${pct}%;background:${col}"></div>
            </div>
            <span class="speed-num" style="color:${col}">${r.speed.toFixed(1)}</span>
          </div>
        </td>
        <td style="font-family:'Space Mono',monospace;font-size:11px">${r.passengers}</td>
        <td><span class="status-badge ${badge}">${r.status}</span></td>
      </tr>`;
  }).join('');
}

// ─── Sparkline ───────────────────────────────────────────────────────────────

function drawSpark() {
  const canvas = document.getElementById('sparkCanvas');
  const wrap   = canvas.parentElement;
  canvas.width  = wrap.clientWidth;
  canvas.height = wrap.clientHeight;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height, pad = 8;
  const minV = Math.min(...speedHistory) - 5;
  const maxV = Math.max(...speedHistory) + 5;

  const pts = speedHistory.map((v, i) => ({
    x: pad + (i / (speedHistory.length - 1)) * (W - pad * 2),
    y: H - pad - ((v - minV) / (maxV - minV)) * (H - pad * 2),
  }));

  ctx.clearRect(0, 0, W, H);

  // Gradient fill
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, 'rgba(0,229,160,0.18)');
  grad.addColorStop(1, 'rgba(0,229,160,0)');
  ctx.beginPath();
  ctx.moveTo(pts[0].x, H);
  pts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(pts[pts.length - 1].x, H);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = '#00e5a0';
  ctx.lineWidth   = 2;
  ctx.lineJoin    = 'round';
  ctx.stroke();

  // Live dot
  const last = pts[pts.length - 1];
  ctx.beginPath();
  ctx.arc(last.x, last.y, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#00e5a0';
  ctx.fill();

  // Axis labels
  ctx.font      = '9px Space Mono';
  ctx.fillStyle = 'rgba(90,97,120,0.8)';
  ctx.fillText(maxV.toFixed(0) + ' km/h', 4, pad + 10);
  ctx.fillText(minV.toFixed(0) + ' km/h', 4, H - pad - 2);
}

// ─── Pipeline stats ───────────────────────────────────────────────────────────

function updateStats() {
  document.getElementById('sRecords').textContent   = recordsProcessed.toLocaleString();
  document.getElementById('sThroughput').textContent = Math.floor(120 + Math.random() * 40) + ' rec/s';
  document.getElementById('sLatency').textContent   = (Math.random() * 40 + 20).toFixed(0) + ' ms';
  document.getElementById('sWorkers').textContent   = '4 / 4 active';
}

// ─── Event feed ──────────────────────────────────────────────────────────────

const EVENT_TEMPLATES = [
  r => `<span style="color:var(--accent3)">${r.vehicle}</span> on <span style="color:${r.color}">${r.id}</span> — speed updated to ${r.speed.toFixed(1)} km/h`,
  r => `Passenger count on <span style="color:${r.color}">${r.id}</span> changed to <span>${r.passengers}</span>`,
  r => `Route <span style="color:${r.color}">${r.id}</span> status → <span style="color:${r.status==='active'?'var(--accent)':r.status==='delayed'?'var(--accent2)':'var(--muted)'}">${r.status.toUpperCase()}</span>`,
  r => `Spark micro-batch processed <span>${Math.floor(20 + Math.random() * 60)}</span> records for ${r.id}`,
  r => `CSV metrics exported for <span style="color:${r.color}">${r.id}</span> → latest_metrics.csv`,
];

function pushEvent() {
  const r    = routeState[Math.floor(Math.random() * routeState.length)];
  const tpl  = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];
  const feed = document.getElementById('eventFeed');
  const time = new Date().toTimeString().slice(0, 8);

  const item = document.createElement('div');
  item.className = 'event-item';
  item.innerHTML = `
    <div class="event-time">${time}</div>
    <div class="event-dot" style="background:${r.color}"></div>
    <div class="event-text">${tpl(r)}</div>
  `;

  feed.prepend(item);
  while (feed.children.length > 30) feed.removeChild(feed.lastChild);
}

// ─── Timestamp ───────────────────────────────────────────────────────────────

function updateTimestamp() {
  document.getElementById('lastUpdated').textContent =
    'Updated ' + new Date().toTimeString().slice(0, 8);
}

// ─── Main loop ───────────────────────────────────────────────────────────────

function tick() {
  generateTick();
  updateKPIs();
  updateTable();
  drawSpark();
  updateStats();
  moveVehicles();
  updateTimestamp();
}

function eventLoop() {
  if (Math.random() < 0.7) pushEvent();
}

// Boot
initMap();
tick();

setInterval(tick,         2000);
setInterval(eventLoop,     800);
setInterval(moveVehicles,  300);

window.addEventListener('resize', drawSpark);
