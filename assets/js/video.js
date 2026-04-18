document.addEventListener("DOMContentLoaded", () => {

  const hamburger = document.getElementById("hamburger");
  const navWrapper = document.getElementById("navWrapper");

  /* ===========================
     MENU HAMBURGUESA
  =========================== */

  if (hamburger && navWrapper) {

    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      navWrapper.classList.toggle("active");

      document.body.style.overflow =
        navWrapper.classList.contains("active") ? "hidden" : "";
    });

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
    if (element.classList.contains("loaded")) return;
    element.classList.add("loaded");

    const videoId = element.dataset.video;

    element.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1&mute=1"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen>
      </iframe>
    `;

    if (navWrapper && navWrapper.classList.contains("active")) {
      navWrapper.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  document.querySelectorAll(".video-container").forEach(video => {

    video.setAttribute("role", "button");
    video.setAttribute("tabindex", "0");

    video.addEventListener("click", () => loadVideo(video));

    video.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        loadVideo(video);
      }
    });
  });

});
