
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

    // Cerrar al hacer clic fuera del menú.
    document.addEventListener("click", (event) => {

      if (
        navWrapper.classList.contains("active") &&
        !navWrapper.contains(event.target) &&
        !hamburger.contains(event.target)
      ) {
        closeMenu();
      }

    });

    // Cerrar al seleccionar una sección.
    navWrapper.querySelectorAll(".menu a").forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    // Cerrar con Escape.
    document.addEventListener("keydown", (event) => {

      if (event.key === "Escape") {
        closeMenu();
      }

    });

    // Restablecer al pasar a escritorio.
    window.addEventListener("resize", () => {

      if (window.innerWidth > 1100) {
        closeMenu();
      }

    });

  }


 
/* =====================================
   PARALLAX BACKGROUND
   MOVIMIENTO SUAVE CON INERCIA
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

  let imageReady = false;

  let maxTravel = 0;

  let currentPosition = 0;
  let targetPosition = 0;

  let animationFrame = null;
  let lastFrameTime = 0;

  let baseWidth = window.innerWidth;
  let baseHeight = window.innerHeight;

  // Velocidad de interpolación.
  const smoothing = 0.045;


  /* =====================================
     CALCULAR TAMAÑO DEL FONDO
  ===================================== */

  function calculateParallax() {

    if (!imageReady) return;

    baseWidth = window.innerWidth;
    baseHeight = window.innerHeight;

    const extraTravel = baseHeight * 0.35;

    const scale = Math.max(
      baseWidth / image.naturalWidth,
      (baseHeight + extraTravel) / image.naturalHeight
    );

    const renderedWidth = image.naturalWidth * scale;
    const renderedHeight = image.naturalHeight * scale;

    maxTravel = Math.max(
      0,
      renderedHeight - baseHeight
    );

    background.style.backgroundSize =
      `${renderedWidth}px ${renderedHeight}px`;

    updateTargetPosition();

  }


  /* =====================================
     POSICIÓN OBJETIVO
  ===================================== */

  function updateTargetPosition() {

    if (!imageReady) return;

    const scrollPosition = window.scrollY;

    const maxScroll = Math.max(
      1,
      document.documentElement.scrollHeight - baseHeight
    );

    const progress = Math.min(
      Math.max(scrollPosition / maxScroll, 0),
      1
    );

    targetPosition = progress * maxTravel;

    if (animationFrame === null) {

      lastFrameTime = 0;

      animationFrame = requestAnimationFrame(animateParallax);

    }

  }


  /* =====================================
     MOVIMIENTO SUAVE
  ===================================== */

  function animateParallax(timestamp) {

    if (!lastFrameTime) {
      lastFrameTime = timestamp;
    }

    const deltaTime = Math.min(
      timestamp - lastFrameTime,
      32
    );

    lastFrameTime = timestamp;

    // Interpolación independiente de los FPS.
    const factor = 1 - Math.pow(
      1 - smoothing,
      deltaTime / 16.67
    );

    currentPosition +=
      (targetPosition - currentPosition) * factor;

    // Detención sin oscilaciones.
    if (Math.abs(targetPosition - currentPosition) < 0.15) {

      currentPosition = targetPosition;

      background.style.backgroundPosition =
        `center -${currentPosition.toFixed(2)}px`;

      animationFrame = null;

      return;
    }

    background.style.backgroundPosition =
      `center -${currentPosition.toFixed(2)}px`;

    animationFrame = requestAnimationFrame(animateParallax);

  }


  /* =====================================
     CARGA DE IMAGEN
  ===================================== */

  image.onload = () => {

    imageReady = true;

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

  window.addEventListener("resize", () => {

    if (window.innerWidth !== baseWidth) {
      calculateParallax();
    }

  });

}


});
