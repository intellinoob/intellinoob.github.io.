const modal = document.querySelector("[data-modal]");
const openLetterButton = document.querySelector("[data-open-letter]");
const closeButton = document.querySelector("[data-close]");
const confettiButtons = document.querySelectorAll("[data-confetti]");
const letter = document.querySelector("[data-letter]");

const noButton = document.querySelector("[data-no]");

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

const renderContent = (data) => {
  document.querySelector("[data-hero-eyebrow]").textContent = data.hero.eyebrow;
  document.querySelector("[data-hero-title]").textContent = data.hero.title;
  document.querySelector("[data-hero-subtitle]").textContent = data.hero.subtitle;

  document.querySelector("[data-letter-title]").textContent = data.letter.title;
  document.querySelector("[data-letter-subtitle]").textContent = data.letter.subtitle;

  const letterBody = document.querySelector("[data-letter-body]");
  letterBody.innerHTML = "";
  data.letter.paragraphs.forEach((text, index) => {
    const paragraph = document.createElement("p");
    if (index === data.letter.paragraphs.length - 1 && text.includes("\n")) {
      const [signOff, name] = text.split("\n");
      const sign = document.createElement("p");
      sign.className = "letter__sign";
      sign.textContent = signOff;
      const nameLine = document.createElement("p");
      nameLine.className = "letter__sign";
      nameLine.textContent = name;
      letterBody.append(sign, nameLine);
    } else {
      paragraph.textContent = text;
      letterBody.appendChild(paragraph);
    }
  });

  document.querySelector("[data-reasons-title]").textContent = data.reasons.title;
  document.querySelector("[data-reasons-subtitle]").textContent = data.reasons.subtitle;
  const reasonsGrid = document.querySelector("[data-reasons-grid]");
  reasonsGrid.innerHTML = "";
  data.reasons.items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "reason";
    card.innerHTML = `<h3>${item.title}</h3><p>${item.text}</p>`;
    reasonsGrid.appendChild(card);
  });

  document.querySelector("[data-timeline-title]").textContent = data.timeline.title;
  document.querySelector("[data-timeline-subtitle]").textContent = data.timeline.subtitle;
  const timeline = document.querySelector("[data-timeline]");
  timeline.innerHTML = "";
  data.timeline.items.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "moment";
    row.innerHTML = `<span>${index + 1}</span><div><h3>${item.title}</h3><p>${item.text}</p></div>`;
    timeline.appendChild(row);
  });

  document.querySelector("[data-final-title]").textContent = data.final.title;
  document.querySelector("[data-final-subtitle]").textContent = data.final.subtitle;
  document.querySelector("[data-yes]").textContent = data.final.yesText;
  noButton.textContent = data.final.noText;

  document.querySelector("[data-modal-title]").textContent = data.modal.title;
  document.querySelector("[data-modal-body]").textContent = data.modal.body;
};

const setupNoButton = () => {
  const dodge = () => {
    const container = noButton.parentElement;
    const bounds = container.getBoundingClientRect();
    const buttonBounds = noButton.getBoundingClientRect();

    const maxLeft = bounds.width - buttonBounds.width;
    const maxTop = bounds.height - buttonBounds.height;

    const left = Math.random() * maxLeft;
    const top = Math.random() * maxTop;

    noButton.style.position = "absolute";
    noButton.style.left = `${left}px`;
    noButton.style.top = `${top}px`;
  };

  noButton.addEventListener("mouseenter", dodge);
  noButton.addEventListener("click", dodge);
  noButton.addEventListener("touchstart", dodge);
};

const init = () => {
  if (window.CONTENT) {
    renderContent(window.CONTENT);
  } else {
    console.error("Missing content.js. Make sure content.js is loaded.");
  }

  setupNoButton();
};

init();
