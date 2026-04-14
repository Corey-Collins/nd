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
  const res = await fetch("./images/gallery/manifest.json");
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
    const target = e.target as Node;
    if (!menu?.contains(target) && !toggleBtn?.contains(target) && menuOpen) {
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

/** Form validation */
const contactForm = document.querySelector('form[action="https://api.web3forms.com/submit"]') as HTMLFormElement;
const nameInput = contactForm?.querySelector('input[name="name"]') as HTMLInputElement;
const emailInput = contactForm?.querySelector('input[name="email"]') as HTMLInputElement;
const messageInput = contactForm?.querySelector('textarea[name="message"]') as HTMLTextAreaElement;
const submitBtn = contactForm?.querySelector('button[type="submit"]') as HTMLButtonElement;

// Set default message value
if (messageInput && !messageInput.value) {
    messageInput.value = 'I\'d like to book a detailing service. Please let me know availability and pricing for my vehicle.';
}

const nameError = contactForm?.querySelector('[data-error="name"]') as HTMLParagraphElement;
const emailError = contactForm?.querySelector('[data-error="email"]') as HTMLParagraphElement;
const messageError = contactForm?.querySelector('[data-error="message"]') as HTMLParagraphElement;

if (contactForm && nameInput && emailInput && messageInput && submitBtn) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let nameHasFocus = false;
    let emailHasFocus = false;
    let messageHasFocus = false;
    let emailHasBlurred = false;

    const validateForm = () => {
        const isNameValid = nameInput.value.trim().length > 0;
        const isEmailValid = emailRegex.test(emailInput.value.trim());
        const isMessageValid = messageInput.value.trim().length > 0;

        // Update error messages
        if (nameError) {
            if (nameHasFocus && !isNameValid) {
                nameError.textContent = 'Please enter your name';
                nameError.classList.remove('hidden');
            } else {
                nameError.classList.add('hidden');
            }
        }

        if (emailError) {
            if (emailHasFocus && !isEmailValid) {
                if (emailInput.value.length === 0) {
                    emailError.textContent = 'Please enter your email';
                    emailError.classList.remove('hidden');
                } else if (emailHasBlurred) {
                    emailError.textContent = 'Please enter a valid email address';
                    emailError.classList.remove('hidden');
                } else {
                    emailError.classList.add('hidden');
                }
            } else {
                emailError.classList.add('hidden');
            }
        }

        if (messageError) {
            if (messageHasFocus && !isMessageValid) {
                messageError.textContent = 'Please enter a message';
                messageError.classList.remove('hidden');
            } else {
                messageError.classList.add('hidden');
            }
        }

        submitBtn.disabled = !(isNameValid && isEmailValid && isMessageValid);
    };

    nameInput.addEventListener('focus', () => {
        nameHasFocus = true;
    });
    nameInput.addEventListener('input', validateForm);
    nameInput.addEventListener('blur', validateForm);

    emailInput.addEventListener('focus', () => {
        emailHasFocus = true;
        emailHasBlurred = false;
    });
    emailInput.addEventListener('input', () => {
        emailInput.value = emailInput.value.trim();
        validateForm();
    });
    emailInput.addEventListener('blur', () => {
        emailHasBlurred = true;
        emailInput.value = emailInput.value.trim();
        validateForm();
    });

    messageInput.addEventListener('focus', () => {
        messageHasFocus = true;
    });
    messageInput.addEventListener('input', validateForm);
    messageInput.addEventListener('blur', validateForm);

    // Handle form submission with custom subject
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(contactForm);

        // Get the name input value
        const name = formData.get('name');

        // Create custom subject with the name
        const subject = `Booking request for: ${name}`;

        // Append the custom subject to the form data
        formData.append('subject', subject);

        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let json = await response.json();
            if (response.status == 200) {
                // Success - show modal
                const successModal = document.getElementById('successModal');
                const closeModalBtn = document.getElementById('closeModal');

                contactForm.reset();
                validateForm();

                // Show modal
                successModal?.classList.remove('hidden');

                // Close modal on button click
                closeModalBtn?.addEventListener('click', () => {
                    successModal?.classList.add('hidden');
                });

                // Also close modal if user clicks outside of it
                successModal?.addEventListener('click', (e) => {
                    if (e.target === successModal) {
                        successModal.classList.add('hidden');
                    }
                });
            } else {
                // Error
                alert(json.message || 'Something went wrong!');
                submitBtn.textContent = 'Send Message';
                submitBtn.disabled = false;
            }
        })
        .catch(error => {
            console.log(error);
            alert('Something went wrong!');
            submitBtn.textContent = 'Send Message';
            submitBtn.disabled = false;
        });
    });

    // Initial validation
    validateForm();
}
