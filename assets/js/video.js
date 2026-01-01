
// Función que carga el reproductor de YouTube
// Recibe como parámetro el contenedor del video clickeado
function loadVideo(element) {
 if (element.classList.contains('loaded')) return;
  element.classList.add('loaded');
  
  // Obtiene el valor del atributo data-video del HTML
  // Ej: data-video="tR6D_-9w538"
  const videoId = element.dataset.video;

  // Reemplaza todo el contenido del contenedor
  // (imagen + botón play) por un iframe de YouTube
  element.innerHTML = `
    <iframe
      src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" 
      /* URL del video:
         - ${videoId}: ID dinámico del video
         - autoplay=1: inicia automáticamente
         - rel=0: evita mostrar videos relacionados
         - modestbranding=1: reduce el branding de YouTube */
      
      frameborder="0" 
      /* Elimina el borde del iframe */

      allow="autoplay; encrypted-media" 
      /* Permite reproducción automática y contenido cifrado */

      allowfullscreen>
      <!-- Permite activar pantalla completa -->

         loading="lazy">
         
    </iframe>
  `;
}
document.querySelectorAll(".video-container").forEach(video => {
  video.setAttribute("role", "button");
  video.setAttribute("tabindex", "0");

  video.addEventListener("click", () => loadVideo(video));
  video.addEventListener("keydown", e => {
    if (e.key === "Enter") loadVideo(video);
  });
});

