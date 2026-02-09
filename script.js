const modal = document.querySelector("[data-modal]");
const openLetterButton = document.querySelector("[data-open-letter]");
const closeButton = document.querySelector("[data-close]");
const confettiButtons = document.querySelectorAll("[data-confetti]");
const letter = document.querySelector("[data-letter]");

const openModal = () => {
  modal.classList.add("is-visible");
};

const closeModal = () => {
  modal.classList.remove("is-visible");
};

openLetterButton.addEventListener("click", openModal);
closeButton.addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.querySelectorAll("[data-scroll-to]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.querySelector(button.dataset.scrollTo);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

const spawnHeart = () => {
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.style.left = `${Math.random() * 100}vw`;
  heart.style.bottom = "-30px";
  heart.style.animationDuration = `${4 + Math.random() * 2}s`;
  heart.style.opacity = `${0.6 + Math.random() * 0.4}`;
  document.body.appendChild(heart);
  heart.addEventListener("animationend", () => {
    heart.remove();
  });
};

confettiButtons.forEach((button) => {
  button.addEventListener("click", () => {
    for (let i = 0; i < 24; i += 1) {
      setTimeout(spawnHeart, i * 60);
    }
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        letter.classList.add("is-open");
      }
    });
  },
  { threshold: 0.4 }
);

observer.observe(letter);

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-visible")) {
    closeModal();
  }
});
