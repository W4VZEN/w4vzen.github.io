<script>
document.addEventListener("DOMContentLoaded", () => {

  /* ===========================
     MENÚ MOBILE
     =========================== */

  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu');
  const links = document.querySelectorAll('.menu a');

  if (toggle && menu) {

    // abrir / cerrar menú
    toggle.addEventListener('click', () => {
      menu.classList.toggle('active');

      // bloquear scroll del body
      document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });

    // cerrar al hacer click en un link
    links.forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // cerrar con tecla ESC
    document.addEventListener('keydown', e => {
      if (e.key === "Escape") {
        menu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

  }


  /* ===========================
     VIDEOS YOUTUBE
     =========================== */

  function stopAllVideos() {
    document.querySelectorAll(".video-container.loaded").forEach(el => {
      el.classList.remove("loaded");

      const videoId = el.dataset.video;

      el.innerHTML = `
        <img src="https://img.youtube.com/vi/${videoId}/maxresdefault.jpg" class="video-thumb">
        <div class="play-button"></div>
      `;
    });
  }

  function loadVideo(element) {
    if (element.classList.contains('loaded')) return;

    stopAllVideos();

    element.classList.add('loaded');
    const videoId = element.dataset.video;

    element.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1"
        frameborder="0"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowfullscreen>
      </iframe>
    `;
  }

  document.querySelectorAll(".video-container").forEach(video => {

    video.setAttribute("role", "button");
    video.setAttribute("tabindex", "0");

    // click
    video.addEventListener("click", () => loadVideo(video));

    // teclado (Enter + Space)
    video.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        loadVideo(video);
      }
    });

  });

});
</script>
