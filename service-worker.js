// ═══════════════════════════════════════════════
//  Service Worker — Recordatorios de hidratación
// ═══════════════════════════════════════════════
//
// LIMITACIÓN IMPORTANTE: sin servidor push (Firebase, etc.), un service
// worker no puede "despertar" al navegador de forma garantizada cada hora.
// Esto implementa las mejores estrategias disponibles sin backend:
//
// 1. Periodic Background Sync — Chrome/Android puede despertar este SW
//    periódicamente (Chrome decide el intervalo real según uso y batería,
//    normalmente cada varias horas, NO garantiza exactamente cada hora).
// 2. Notificación al reabrir — cada vez que abrís la app o Chrome la
//    refresca en background, se revisa si tocaba recordatorio y se dispara.
// 3. Mientras la pestaña/PWA está activa, index.html corre un setInterval
//    que es mucho más preciso (cada hora en punto) — esa es la vía más
//    confiable mientras tengas la app abierta o minimizada recientemente.

const CACHE_NAME = 'agua-v1';
const VENTANA_INICIO = 9;   // 9am
const VENTANA_FIN = 20;     // 8pm

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// ── Periodic Background Sync ──────────────────────────────
// Se registra desde index.html. Chrome decide cuándo dispararlo realmente;
// no hay garantía de "cada hora en punto".
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'water-reminder-check') {
    event.waitUntil(checkAndNotify());
  }
});

// ── Fallback: revisar también en eventos normales de sync ──
self.addEventListener('sync', (event) => {
  if (event.tag === 'water-reminder-check-once') {
    event.waitUntil(checkAndNotify());
  }
});

async function checkAndNotify() {
  const now = new Date();
  const hour = now.getHours();

  // Silencio fuera de la ventana horaria
  if (hour < VENTANA_INICIO || hour >= VENTANA_FIN) return;

  // Leer datos guardados — el SW no tiene acceso directo a localStorage
  // de la página, así que usamos IndexedDB-like via clients matchAll
  // para pedirle el estado a una pestaña abierta si existe, o caemos
  // a notificación genérica si no hay contexto disponible.
  const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });

  if (allClients.length > 0) {
    // Hay una pestaña/PWA con contexto — le pedimos que chequee y decida
    allClients[0].postMessage({ type: 'CHECK_REMINDER' });
  } else {
    // No hay contexto vivo — mostramos un recordatorio genérico igual,
    // mejor pecar de avisar de más que de no avisar.
    await self.registration.showNotification('💧 Hora de hidratarte', {
      body: 'No has registrado agua en un rato. ¡Tomate un momento!',
      icon: ICON_DATA_URI,
      badge: ICON_DATA_URI,
      tag: 'water-reminder',
      renotify: true,
      vibrate: [200, 100, 200],
    });
  }
}

// ── Mensaje desde la página con el resultado del chequeo ───
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_REMINDER') {
    const { title, body } = event.data;
    self.registration.showNotification(title, {
      body,
      icon: ICON_DATA_URI,
      badge: ICON_DATA_URI,
      tag: 'water-reminder',
      renotify: true,
      vibrate: [200, 100, 200],
    });
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('./');
    })
  );
});

const ICON_DATA_URI = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Crect width='512' height='512' rx='115' fill='%230a0f1e'/%3E%3Cg transform='translate(256,256)'%3E%3Cellipse cx='0' cy='60' rx='105' ry='80' fill='%233b9eff' opacity='.2'/%3E%3Cellipse cx='0' cy='60' rx='105' ry='80' fill='none' stroke='%233b9eff' stroke-width='18'/%3E%3Crect x='-38' y='-140' width='76' height='30' rx='8' fill='%233b9eff' opacity='.6'/%3E%3Crect x='-24' y='-170' width='48' height='36' rx='8' fill='%233b9eff' opacity='.4'/%3E%3Cpath d='M-105,60 Q-105,140 0,140 Q105,140 105,60' fill='%233b9eff' opacity='.45'/%3E%3Ccircle cx='-28' cy='40' r='10' fill='%23ffffff' opacity='.4'/%3E%3C/g%3E%3C/svg%3E";
