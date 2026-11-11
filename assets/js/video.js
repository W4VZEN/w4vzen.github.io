
document.addEventListener("DOMContentLoaded", () => {

  /* =====================================
     MENÚ HAMBURGUESA
  ===================================== */

  const hamburger = document.getElementById("hamburger");
  const navWrapper = document.getElementById("navWrapper");

  if (hamburger && navWrapper) {

    const openMenu = () => {
      navWrapper.classList.add("active");
      hamburger.setAttribute("aria-expanded", "true");
      hamburger.setAttribute("aria-label", "Cerrar menú");
      hamburger.innerHTML = '<i class="fas fa-times"></i>';
    };

    const closeMenu = () => {
      navWrapper.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.setAttribute("aria-label", "Abrir menú");
      hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    };

    hamburger.addEventListener("click", (event) => {

      event.stopPropagation();

      if (navWrapper.classList.contains("active")) {
        closeMenu();
      } else {
        openMenu();
      }

    });

    // Cerrar al hacer clic fuera del menú
    document.addEventListener("click", (event) => {

      if (
        navWrapper.classList.contains("active") &&
        !navWrapper.contains(event.target) &&
        !hamburger.contains(event.target)
      ) {
        closeMenu();
      }

    });

    // Cerrar al seleccionar una sección
    navWrapper.querySelectorAll(".menu a").forEach(link => {

      link.addEventListener("click", closeMenu);

    });

    // Cerrar con Escape
    document.addEventListener("keydown", (event) => {

      if (event.key === "Escape") {
        closeMenu();
      }

    });

    // Restablecer al pasar a escritorio
    window.addEventListener("resize", () => {

      if (window.innerWidth > 1100) {
        closeMenu();
      }

    });

  }


  /* =====================================
     PARALLAX BACKGROUND
  ===================================== */

  const background = document.querySelector(".parallax-background");

  if (background) {

    const image = new Image();

    image.decoding = "async";
    image.fetchPriority = "high";

    const backgroundImage = getComputedStyle(background).backgroundImage;

    const imageMatch = backgroundImage.match(
      /^url\(["']?(.*?)["']?\)$/
    );

    const imageURL = imageMatch
      ? imageMatch[1]
      : "/assets/img/fondo-escritorio.webp";

    let ticking = false;
    let maxTravel = 0;
    let imageReady = false;


    /* =====================================
       CALCULAR PARALLAX
    ===================================== */

    function calculateParallax() {

      if (!imageReady) return;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const extraTravel = viewportHeight * 0.35;

      const scale = Math.max(
        viewportWidth / image.naturalWidth,
        (viewportHeight + extraTravel) / image.naturalHeight
      );

      const renderedWidth = image.naturalWidth * scale;
      const renderedHeight = image.naturalHeight * scale;

      maxTravel = Math.max(
        0,
        renderedHeight - viewportHeight
      );

      background.style.backgroundSize =
        `${renderedWidth}px ${renderedHeight}px`;

      updateParallax();

    }


    /* =====================================
       ACTUALIZAR POSICIÓN
    ===================================== */

    function updateParallax() {

      if (!imageReady) {
        ticking = false;
        return;
      }

      const scrollPosition = window.scrollY;

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress = maxScroll > 0
        ? Math.min(
            Math.max(scrollPosition / maxScroll, 0),
            1
          )
        : 0;

      const position = progress * maxTravel;

      background.style.backgroundPosition =
        `center -${position}px`;

      ticking = false;

    }


    /* =====================================
       OPTIMIZAR SCROLL
    ===================================== */

    function requestParallaxUpdate() {

      if (!ticking) {

        ticking = true;

        window.requestAnimationFrame(updateParallax);

      }

    }


    /* =====================================
       CARGA DE IMAGEN
    ===================================== */

    // Primero registramos los eventos.
    // Después iniciamos la descarga.

    image.onload = () => {

      imageReady = true;

      calculateParallax();

    };

    image.onerror = () => {

      console.warn(
        "No se pudo cargar la imagen de fondo Parallax."
      );

    };

    // Iniciar carga después de registrar onload y onerror.
    image.src = imageURL;


    /* =====================================
       EVENTOS
    ===================================== */

    window.addEventListener(
      "scroll",
      requestParallaxUpdate,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      calculateParallax
    );

  }

});
