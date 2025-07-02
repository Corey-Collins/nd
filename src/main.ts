import './style.css'

import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

// gallery
// const lightbox = new PhotoSwipeLightbox({
//   gallery: '#gallery',
//   children: 'a',
//   pswpModule: () => import('photoswipe')
// });

async function loadGallery() {
  const res = await fetch("/images/gallery/manifest.json");
  const images = await res.json();

  const galleryDiv = document.getElementById("gallery");
  if (!galleryDiv) return;

  images.forEach((img: { name: string; full: string; thumb: string; width: number; height: number }) => {
    const link = document.createElement("a");
    link.href = img.full;
    link.target = "_blank";
    link.setAttribute("data-pswp-width", img.width.toString());
    link.setAttribute("data-pswp-height", img.height.toString());

    const image = document.createElement("img");
    image.src = img.thumb;
    image.alt = img.name;
    image.className =
      "w-full aspect-[4/3] object-cover rounded-2xl shadow hover:scale-105 transition duration-300 cursor-pointer";

    link.appendChild(image);
    galleryDiv.appendChild(link);
  });
}

loadGallery().then(() => {
  const lightbox = new PhotoSwipeLightbox({
    gallery: "#gallery",
    children: "a",
    pswpModule: () => import("photoswipe")
  });
  lightbox.init();
});


// GALLERY END

const year = `${new Date().getFullYear()}`
const copyrightArea = document.getElementById("year");
if (copyrightArea?.innerHTML) {
    copyrightArea.innerHTML = year;
}

let lastScrollY = window.scrollY;
const navbar = document.getElementById('navbar');

const toggleBtn = document.getElementById('menu-toggle');
const menu = document.getElementById('mobile-menu');

let menuOpen = false;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY) {
        // Scrolling down
        navbar?.classList.add('-translate-y-full');

        if (menuOpen) {
            menuOpen = false;
            menu?.classList.add('-translate-y-full', 'opacity-0', 'pointer-events-none');
            menu?.classList.remove('translate-y-0', 'opacity-100');
        }
    } else {
        // Scrolling up
        navbar?.classList.remove('-translate-y-full');
    }

    lastScrollY = currentScrollY;
});

/** Mobile nav bar toggle */

toggleBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    menuOpen = !menuOpen;

    if (menuOpen) {
        menu?.classList.remove('-translate-y-full', 'opacity-0', 'pointer-events-none');
        menu?.classList.add('translate-y-0', 'opacity-100');
    } else {
        menu?.classList.add('-translate-y-full', 'opacity-0', 'pointer-events-none');
        menu?.classList.remove('translate-y-0', 'opacity-100');
    }
});

document.addEventListener('click', (e) => {
    if (!menu?.contains(e.target) && !toggleBtn?.contains(e.target) && menuOpen) {
        menu?.classList.add('-translate-y-full', 'opacity-0', 'pointer-events-none');
        menu?.classList.remove('translate-y-0', 'opacity-100');
        menuOpen = false;
    }
});

// Optional: close when clicking a menu link
menu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        menu.classList.add('-translate-y-full', 'opacity-0', 'pointer-events-none');
        menu.classList.remove('translate-y-0', 'opacity-100');
        menuOpen = false;
    });
});
