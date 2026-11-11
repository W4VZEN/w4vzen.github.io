
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
     PARALLAX BACKGROUND - SMOOTH VERSION
  ===================================== */

  const background = document.querySelector(".parallax-background");

  if (background) {

    const image = new Image();

    image.decoding = "async";
    image.fetchPriority = "high";

    const backgroundImage = getComputedStyle(background).backgroundImage;

    const imageMatch = backgroundImage.match(/^url\(["']?(.*?)["']?\)$/);

    const imageURL = imageMatch
      ? imageMatch[1]
      : "/assets/img/fondo-escritorio.webp";

    let maxTravel = 0;
    let imageReady = false;

    let targetPosition = 0;
    let currentPosition = 0;

    let animationFrame = null;

    // Intensidad del suavizado.
    // Menor valor = más inercia.
    // Mayor valor = respuesta más rápida.
    const smoothness = 0.075;


    /* =====================================
       CALCULAR DIMENSIONES
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

      updateTargetPosition();

    }


    /* =====================================
       CALCULAR POSICIÓN OBJETIVO
    ===================================== */

    function updateTargetPosition() {

      const scrollPosition = window.scrollY;

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress = maxScroll > 0
        ? Math.min(Math.max(scrollPosition / maxScroll, 0), 1)
        : 0;

      targetPosition = progress * maxTravel;

      if (animationFrame === null) {
        animationFrame = requestAnimationFrame(animateParallax);
      }

    }


    /* =====================================
       MOVIMIENTO SUAVE E INTERPOLADO
    ===================================== */

    function animateParallax() {

      const difference = targetPosition - currentPosition;

      currentPosition += difference * smoothness;

      // Evita oscilaciones infinitas por diferencias mínimas.
      if (Math.abs(difference) < 0.15) {
        currentPosition = targetPosition;
      }

      background.style.backgroundPosition =
        `center -${currentPosition.toFixed(2)}px`;

      if (currentPosition !== targetPosition) {

        animationFrame = requestAnimationFrame(animateParallax);

      } else {

        animationFrame = null;

      }

    }


    /* =====================================
       CARGA DE IMAGEN
    ===================================== */

    image.onload = () => {

      imageReady = true;

      currentPosition = 0;
      targetPosition = 0;

      calculateParallax();

    };

    image.onerror = () => {

      console.warn(
        "No se pudo cargar la imagen de fondo Parallax."
      );

    };

    image.src = imageURL;


    /* =====================================
       EVENTOS
    ===================================== */

    window.addEventListener(
      "scroll",
      updateTargetPosition,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      calculateParallax
    );

  }


});
