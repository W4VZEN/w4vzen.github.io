// ================================================
// Función que carga el reproductor de YouTube
// Recibe como parámetro el contenedor del video que se clickeó
// ================================================
function loadVideo(element) {

  // Evita recargar el video si ya fue cargado antes
  // Esto previene que al hacer clic varias veces el iframe se reemplace
  if (element.classList.contains('loaded')) return;
  element.classList.add('loaded'); // Marca el contenedor como “ya cargado”

  // Obtiene el ID del video desde el atributo data-video del contenedor
  // Ejemplo: data-video="tR6D_-9w538"
  const videoId = element.dataset.video;

  // Reemplaza el contenido del contenedor (miniatura + botón Play)
  // por un iframe de YouTube, que se ajusta al contenedor
  element.innerHTML = `
    <iframe
      src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1"
      /* URL del video:
         - ${videoId}: ID dinámico del video
         - rel=0: evita mostrar videos relacionados al final
         - modestbranding=1: reduce el branding de YouTube
         - NOTA: no usamos autoplay para que solo se reproduzca al clic */

      frameborder="0"
      /* Elimina el borde del iframe */

      allow="autoplay; encrypted-media"
      /* Permite reproducción automática si el usuario interactúa y contenido cifrado */

      allowfullscreen
      /* Permite activar pantalla completa */

      loading="lazy"
      /* Carga el iframe solo cuando es visible para mejorar rendimiento */
    >
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


