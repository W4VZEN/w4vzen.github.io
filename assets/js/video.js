function loadVideo(element) {
  if (element.classList.contains('loaded')) return;
  element.classList.add('loaded');

  const videoId = element.dataset.video;

  // Ahora agregamos autoplay=1 y mute=1 para asegurar que el clic reproduzca
  element.innerHTML = `
    <iframe
      src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding=1"
      frameborder="0"
      allow="autoplay; encrypted-media"
      allowfullscreen
      loading="lazy">
    </iframe>
  `;
}

// ================================================
// Inicialización: agrega eventos de clic y teclado
// a todos los contenedores de video
// ================================================
document.addEventListener("DOMContentLoaded", () => {

  // Selecciona todos los contenedores de video
  document.querySelectorAll(".video-container").forEach(video => {

    // Accesibilidad: permite que el div se comporte como botón
    video.setAttribute("role", "button");    // Indica que es un botón
    video.setAttribute("tabindex", "0");     // Permite enfoque con Tab

    // Evento click: carga el video al hacer clic
    video.addEventListener("click", () => loadVideo(video));

    // Evento teclado: si se presiona Enter mientras el contenedor está enfocado, carga el video
    video.addEventListener("keydown", e => {
      if (e.key === "Enter") loadVideo(video);
    });

  });

});


