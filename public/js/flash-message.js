setTimeout(() => {
  const flashMessage = document.getElementById('flash-message');
  if (flashMessage) {
    flashMessage.style.transition = 'opacity 0.5s ease';
    flashMessage.style.opacity = '0';
    setTimeout(() => flashMessage.remove(), 500); // Remove o elemento após a transição
  }
}, 10000); // 10000 ms = 10 segundos