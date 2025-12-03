// script/notifications.js

// Check if notifications are supported
function isNotificationSupported() {
  return 'Notification' in window;
}

// Gentle toast message (instead of alert)
function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.background = '#e75480'; // brand accent pink
  toast.style.color = '#fff';
  toast.style.padding = '10px 16px';
  toast.style.borderRadius = '8px';
  toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
  toast.style.zIndex = '2000';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Request permission safely
export async function ensureNotificationPermission() {
  if (!isNotificationSupported()) {
    return { supported: false, permission: 'unsupported' };
  }

  if (Notification.permission === 'granted') {
    return { supported: true, permission: 'granted' };
  }

  if (Notification.permission === 'denied') {
    console.log('Notifications are blocked by the browser.');
    showToast('Notifications are blocked in your browser settings.');
    return { supported: true, permission: 'denied' };
  }

  // Ask only if permission is 'default'
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    showToast('Notifications enabled. Thank you!');
  } else if (permission === 'denied') {
    showToast('You can enable notifications later in settings.');
  }
  return { supported: true, permission };
}