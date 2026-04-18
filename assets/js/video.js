
document.addEventListener("DOMContentLoaded", () => {

  /* ===========================
     MENU HAMBURGUESA
  =========================== */

  const hamburger = document.getElementById("hamburger");
  const navWrapper = document.getElementById("navWrapper");

  if (hamburger && navWrapper) {

    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();

      navWrapper.classList.toggle("active");

      document.body.style.overflow =
        navWrapper.classList.contains("active") ? "hidden" : "";
    });

    // cerrar al hacer click fuera
    document.addEventListener("click", (e) => {
      if (!navWrapper.contains(e.target) && !hamburger.contains(e.target)) {
        navWrapper.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }



/* ===========================
     VIDEOS YOUTUBE
  =========================== */
  
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
      // 🔥 opcional: cerrar menú si estaba abierto (mejor UX mobile)
    if (navWrapper && navWrapper.classList.contains("active")) {
      navWrapper.classList.remove("active");
      document.body.style.overflow = "";
    }
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".video-container").forEach(video => {
    video.setAttribute("role", "button");
    video.setAttribute("tabindex", "0");

    // Click del mouse
    video.addEventListener("click", () => loadVideo(video));

    // teclado (Enter + Space)
    video.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        loadVideo(video);
      }
    });
  });
});
