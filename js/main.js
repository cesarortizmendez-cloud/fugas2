/* =========================================================
   DATOS DEL SITIO
   =========================================================
   Actualizamos las rutas de las imágenes para que coincidan
   con los archivos existentes en las carpetas.
*/
const businessLines = {
  deteccion: {
    title: "Detección de fugas",
    images: [
      "./images/deteccion/detec-a.jpeg",
      "./images/deteccion/detec-b.jpeg",
      "./images/deteccion/detec-c.jpeg",
    ],
  },

  arquitectura: {
    title: "Arquitectura",
    images: [
      "./images/arquitectura/arq-a.jpeg",
      "./images/arquitectura/arq-b.jpeg",
      "./images/arquitectura/arq-c.jpeg",
    ],
  },

  construccion: {
    title: "Construcción",
    images: [
      "./images/construccion/const-a.jpeg",
      "./images/construccion/const-b.jpeg",
      "./images/construccion/const-c.jpeg",
    ],
  },
};

/* =========================================================
   FUNCIÓN: crear tarjeta de imagen
   =========================================================
   Restauramos la función original.
*/
function createRailCard(imagePath, businessTitle, index) {
  const card = document.createElement("article");
  card.className = "rail-card";

  const imageWrap = document.createElement("div");
  imageWrap.className = "rail-card-image";

  const image = document.createElement("img");
  image.src = imagePath;
  image.alt = `${businessTitle} fotografía ${index + 1}`;
  imageWrap.appendChild(image);

  const footer = document.createElement("div");
  footer.className = "rail-card-footer";

  const footerText = document.createElement("p");
  footerText.textContent = `${businessTitle} · Imagen ${index + 1}`;
  footer.appendChild(footerText);

  card.appendChild(imageWrap);
  card.appendChild(footer);

  return card;
}

/* =========================================================
   FUNCIÓN: renderizar un tren de imágenes
   =========================================================
   Esta función:
   - busca un contenedor por su atributo data-rail
   - revisa si hay imágenes disponibles
   - inserta las tarjetas en pantalla
*/
function renderImageRail(railName) {
  /*
    Buscamos el contenedor HTML correspondiente.
    Ejemplo:
    <div class="image-rail" data-rail="deteccion"></div>
  */
  const railContainer = document.querySelector(`[data-rail="${railName}"]`);

  /*
    Si por alguna razón el contenedor no existe, salimos.
  */
  if (!railContainer) return;

  /*
    Buscamos la información de esa línea de negocio
    dentro del objeto businessLines.
  */
  const businessData = businessLines[railName];

  /*
    Si no encontramos datos, mostramos un mensaje simple.
  */
  if (!businessData) {
    railContainer.innerHTML = "<p>No hay imágenes disponibles.</p>";
    return;
  }

  /*
    Limpiamos el contenedor por seguridad.
    Esto evita duplicados si la función se ejecuta más de una vez.
  */
  railContainer.innerHTML = "";

  /*
    Recorremos todas las imágenes de esa línea de negocio
    y vamos creando una tarjeta por cada una.
  */
  businessData.images.forEach((imageData, index) => {
    const card = createRailCard(imageData, businessData.title, index);
    railContainer.appendChild(card);
  });
}

/* =========================================================
   FUNCIÓN: renderizar todos los trenes
   =========================================================
   Así no tenemos que llamar uno por uno manualmente.
*/
function renderAllRails() {
  renderImageRail("deteccion");
  renderImageRail("arquitectura");
  renderImageRail("construccion");
}

/* =========================================================
   MENÚ MÓVIL
   =========================================================
   Esta parte hace que el botón "Menú" abra y cierre
   la navegación en pantallas pequeñas.
*/
function setupMobileMenu() {
  /*
    Buscamos el botón del menú y el bloque de navegación.
  */
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");

  /*
    Si alguno no existe, salimos para evitar errores.
  */
  if (!menuButton || !nav) return;

  /*
    Al hacer clic en el botón:
    - alternamos la clase is-open
    - actualizamos aria-expanded para accesibilidad
  */
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  /*
    Además, si el usuario hace clic en un link del menú,
    cerramos el menú automáticamente.
    Esto mejora mucho la experiencia en celular.
  */
  const navLinks = nav.querySelectorAll("a");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

/* =========================================================
   SCROLL SUAVE REFORZADO
   =========================================================
   Aunque CSS ya tiene scroll-behavior: smooth,
   esta función nos permite controlar mejor la navegación
   interna y descontar el espacio del header fijo.
*/
function setupSmoothAnchorOffset() {
  /*
    Seleccionamos todos los links internos que apunten
    a una sección con "#algo".
  */
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      /*
        Extraemos el destino del link.
      */
      const targetId = link.getAttribute("href");

      /*
        Si el href es vacío o solo "#", no hacemos nada.
      */
      if (!targetId || targetId === "#") return;

      /*
        Buscamos el elemento de destino.
      */
      const targetElement = document.querySelector(targetId);

      /*
        Si no existe el destino, salimos.
      */
      if (!targetElement) return;

      /*
        Prevenimos el salto brusco por defecto del navegador.
      */
      event.preventDefault();

      /*
        Calculamos la posición final considerando
        la altura del header fijo.
      */
      const header = document.querySelector(".site-header");
      const headerHeight = header ? header.offsetHeight : 0;

      /*
        Distancia desde el top del documento
        hasta el elemento destino.
      */
      const targetPosition =
        targetElement.getBoundingClientRect().top + window.scrollY;

      /*
        Ajustamos la posición final para que la sección
        no quede escondida detrás del header.
      */
      const finalPosition = targetPosition - headerHeight - 12;

      /*
        Hacemos el scroll suave.
      */
      window.scrollTo({
        top: finalPosition,
        behavior: "smooth",
      });
    });
  });
}

/* =========================================================
   EFECTO OPCIONAL: destacar tarjeta al entrar en viewport
   =========================================================
   Esto hace que las tarjetas de las galerías se sientan
   más vivas al aparecer en pantalla.
*/
function setupRailRevealEffect() {
  /*
    Tomamos todas las tarjetas del tren.
    Ojo: esto debe ejecutarse después de renderizar los trenes.
  */
  const cards = document.querySelectorAll(".rail-card");

  /*
    Si el navegador no soporta IntersectionObserver,
    simplemente salimos y el sitio sigue funcionando.
  */
  if (!("IntersectionObserver" in window)) return;

  /*
    Creamos un observador para detectar cuándo una tarjeta
    entra en la pantalla.
  */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        /*
          Si la tarjeta entra al área visible,
          le agregamos estilos en línea simples.
        */
        if (entry.isIntersecting) {
          entry.target.style.transform = "translateY(0)";
          entry.target.style.opacity = "1";
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  /*
    Estado inicial de las tarjetas antes de aparecer.
  */
  cards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(16px)";
    card.style.transition = "opacity 0.45s ease, transform 0.45s ease";
    observer.observe(card);
  });
}

/* =========================================================
   INICIALIZACIÓN GENERAL DEL SITIO
   =========================================================
   Esta función arranca todo cuando el HTML ya terminó de cargar.
*/
function initSite() {
  /*
    1. Renderizamos todos los trenes de imágenes.
  */
  renderAllRails();

  /*
    2. Configuramos el menú móvil.
  */
  setupMobileMenu();

  /*
    3. Activamos el scroll suave con compensación del header.
  */
  setupSmoothAnchorOffset();

  /*
    4. Activamos el pequeño efecto de aparición en tarjetas.
  */
  setupRailRevealEffect();
}

/* =========================================================
   EVENTO DOMContentLoaded
   =========================================================
   Esperamos a que el documento HTML cargue completamente
   antes de ejecutar el JavaScript.
*/
document.addEventListener("DOMContentLoaded", initSite);