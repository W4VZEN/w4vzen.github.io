
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

    // Cerrar con la tecla Escape
    document.addEventListener("keydown", (event) => {

      if (event.key === "Escape") {
        closeMenu();
      }

    });

    // Restablecer el menú al pasar a escritorio
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

    const backgroundImage = getComputedStyle(background).backgroundImage;
    const imageMatch = backgroundImage.match(/^url\(["']?(.*?)["']?\)$/);

    image.src = imageMatch
      ? imageMatch[1]
      : "/assets/img/fondo-escritorio.webp";

    let ticking = false;
    let maxTravel = 0;
    let imageReady = false;

    // Calcula el tamaño necesario para permitir
    // que la imagen se desplace verticalmente.

    function calculateParallax() {

      if (!imageReady) return;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Espacio adicional para el desplazamiento
      const extraTravel = viewportHeight * 0.35;

      // Escala que garantiza cubrir la pantalla
      // y disponer de recorrido vertical.
      const scale = Math.max(
        viewportWidth / image.naturalWidth,
        (viewportHeight + extraTravel) / image.naturalHeight
      );

      const renderedWidth = image.naturalWidth * scale;
      const renderedHeight = image.naturalHeight * scale;

      maxTravel = Math.max(0, renderedHeight - viewportHeight);

      background.style.backgroundSize =
        `${renderedWidth}px ${renderedHeight}px`;

      updateParallax();

    }


    // Actualiza la posición según el scroll

    function updateParallax() {

      if (!imageReady) return;

      const scrollPosition = window.scrollY;

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress = maxScroll > 0
        ? Math.min(Math.max(scrollPosition / maxScroll, 0), 1)
        : 0;

      const position = progress * maxTravel;

      background.style.backgroundPosition =
        `center -${position}px`;

      ticking = false;

    }


    // Optimiza las actualizaciones durante el scroll

    function requestParallaxUpdate() {

      if (!ticking) {

        window.requestAnimationFrame(updateParallax);

        ticking = true;

      }

    }


    // Esperar a que cargue la imagen

    image.onload = () => {

      imageReady = true;

      calculateParallax();

    };


    image.onerror = () => {

      console.warn("No se pudo cargar la imagen de fondo Parallax.");

    };


    // Eventos

    window.addEventListener(
      "scroll",
      requestParallaxUpdate,
      { passive: true }
    );

    window.addEventListener("resize", calculateParallax);

    window.addEventListener("load", calculateParallax);

  }

});
