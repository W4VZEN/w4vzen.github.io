// Función que carga el iframe de YouTube al hacer clic
function loadVideo(element) {
  // Evita recargar si ya fue cargado
  if (element.classList.contains('loaded')) return;
  element.classList.add('loaded');

  const videoId = element.dataset.video;

  // Reemplaza el contenido por un iframe
  element.innerHTML = `
    <iframe
      src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1&mute=0"
      frameborder="0"
      allow="autoplay; encrypted-media"
      allowfullscreen
      loading="lazy">
    </iframe>
  `;
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".video-container").forEach(video => {
    video.setAttribute("role", "button");
    video.setAttribute("tabindex", "0");

    // Click del mouse
    video.addEventListener("click", () => loadVideo(video));

    // Enter desde teclado
    video.addEventListener("keydown", e => {
      if (e.key === "Enter") loadVideo(video);
    });
  });
});


