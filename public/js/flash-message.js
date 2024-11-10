setTimeout(() => {
  const flashMessage = document.getElementById('flash-message');
  if (flashMessage) {
    flashMessage.style.transition = 'opacity 0.5s ease';
    flashMessage.style.opacity = '0';
    setTimeout(() => flashMessage.remove(), 500); // Remove o elemento após a transição
  }
}, 4000); // 4000 ms = 4 segundos