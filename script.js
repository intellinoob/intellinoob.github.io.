let stage = "start";
// start | dialogue | journey | quiz | blackout | video | terminal | decision | final

let questionIndex = 0;
let score = 0;
let finalTimer = null;
let letterTimer = null;
let postQuizTimer = null;
let typewriterTimer = null;
let dialogueStep = 0;
let journeyIndex = 0;
let journeyLocked = false;
let bgmStarted = false;
let bgm2Started = false;
let postQuizStage = "idle";

const dialogueFlow = [
  {
    choices: [
      "Hi, are you okay? You look nervous.",
      "Hey, what is making your heart race tonight?",
      "You can tell me anything. What's wrong?",
    ],
    foxReply: "I have been wandering for hours... I need to reach the castle before midnight.",
  },
  {
    choices: [
      "Why the castle, Steve?",
      "Who are you trying so hard to find?",
      "Tell me who is waiting for you there.",
    ],
    foxReply: "Esther is there... my wify fox. It's Valentine's Day, and I promised her this letter.",
  },
];

const journeySlides = [
  "assets/journey1.png",
  "assets/journey2.png",
  "assets/journey3.png",
  "assets/journey4.png",
  "assets/journey5.png",
];
const journeyCaptions = [
  "Steve leaves the quiet hill, holding Esther's letter close to his heart.",
  "Cold wind brushes his fur, but Steve keeps walking toward her light.",
  "Under moonlit clouds, he whispers, 'Esther, I'm coming.'",
  "The castle appears in the distance, and Steve's heartbeat grows louder.",
  "At the final steps, Steve smiles softly, knowing Esther is near.",
];

const questions = [
  {
    type: "mcq",
    q: "In the ancient history of Fox Steve and Fox Esther, what legendary midnight feast was consumed during their first convenience store date?",
    options: ["A single scavenged berry", "A premium bowl of Indomie", "A stolen bag of chips", "Nothing—he was too nervous"],
    answer: 1,
  },
  {
    type: "mcq",
    q: "Fox Steve has calculated his 'Total Area of Devotion.' Evaluate the result: ∫_{-∞}^{∞} e^{-x²} dx + lim_{x→∞} (141.22 + 1/x)",
    options: ["0 (The void)", "≈ 143 (I Love You)", "∞ (Divergent)", "1 (Standard Fox-friend)"],
    answer: 1,
  },
  {
    type: "mcq",
    q: "When Fox Steve is asked to identify the specific part of Fox Esther that he likes the most, what is his official scientific conclusion?",
    options: ["Her brilliant fox-brain", "Her elegant supreme hoodie", "Her elite nocturnal predator status (staying up all night)", "All of the above"],
    answer: 3,
  },
  {
    type: "mcq",
    q: "According to the Fox-Steve Nutrition Guide, what is the absolute #1 most delicious 'food' in the entire forest?",
    options: ["Grade-A Wagyu Rabbit", "Midnight Indomie leftovers", "Fox Esther", "A very large watermelon"],
    answer: 2,
  },
  {
    type: "text",
    q: "Leave Fox Steve one loving quote for courage as he navigates the forest to find fox Esther.",
  },
];

const finalSlides = ["assets/us.png"];
const terminalLine = "Now, it's your turn.";
const postQuizTransitions = {
  blackout: "video",
  video: "terminal",
  terminal: "decision",
};

const letterLines = [
  "My dearest Fox Esther,",
  "",
  "The Michigan night is freezing, but every step I took through the snow was for you.",
  "I love how sweet you are when you're dreaming up our future together.",
  "But I also want you to know that I'm here for all of you.",
  "I see the concerns, the highs, the lows, and the days when the forest feels a bit too quiet.",
  "I appreciate the strength it takes to get through those long, sleepless nights,",
  "And even when things feel a little 'psychotic' or overwhelming,",
  "I am right here in our den, holding your paw.",
  "I don't just love the easy days; I love the girl who fights through the hard ones, too.",
  "I hope these LEGO flowers remind you that some things like us never fade.",
  "I'll keep choosing you every single day. ",
  "Ily",
  "",
  "Forever yours, Fox Steve ❤️",
  "February 14, 2026",
  "Ann Arbor, Michigan"
];

const scenes = document.querySelectorAll(".scene");
const startFox = document.getElementById("start-fox");
const dialogueBox = document.getElementById("dialogue-box");
const dialogueOptions = document.getElementById("dialogue-options");
const helpBtn = document.getElementById("help-btn");
const slideFrame = document.getElementById("slide-frame");
const journeyImage = document.getElementById("journey-image");
const journeyCaption = document.getElementById("journey-caption");
const questionText = document.getElementById("question-text");
const optionsWrap = document.getElementById("options-wrap");
const textWrap = document.getElementById("text-wrap");
const textAnswer = document.getElementById("text-answer");
const submitText = document.getElementById("submit-text");
const qIndex = document.getElementById("q-index");
const qTotal = document.getElementById("q-total");
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");
const finalImage = document.getElementById("final-image");
const letterLinesWrap = document.getElementById("letter-lines");
const bgm = document.getElementById("bgm");
const bgm2 = document.getElementById("bgm2");
const arriveVideo = document.getElementById("arrive-video");
const terminalText = document.getElementById("terminal-text");
const proceedBtn = document.getElementById("proceed-btn");

function clearTimers() {
  if (finalTimer) clearInterval(finalTimer);
  if (letterTimer) {
    clearTimeout(letterTimer);
    clearInterval(letterTimer);
  }
  if (postQuizTimer) clearTimeout(postQuizTimer);
  if (typewriterTimer) clearInterval(typewriterTimer);
  finalTimer = null;
  letterTimer = null;
  postQuizTimer = null;
  typewriterTimer = null;
}

function goTo(nextStage) {
  clearTimers();
  stage = nextStage;
  if (nextStage !== "journey") {
    slideFrame.style.cursor = "default";
    slideFrame.removeEventListener("click", onJourneyClick);
  }
  if (nextStage !== "video") {
    arriveVideo.pause();
    arriveVideo.removeEventListener("ended", onArrivalVideoEnded);
  }
  scenes.forEach((scene) => {
    scene.classList.toggle("active", scene.id === nextStage);
  });
}

function startBgmOnce() {
  if (stage === "blackout" || stage === "video" || stage === "terminal") return;
  if (!bgm || bgmStarted) return;
  bgmStarted = true;
  bgm.volume = 0.35;
  bgm.play().catch(() => {});
}

function stopBgm() {
  if (!bgm) return;
  bgm.pause();
  bgm.currentTime = 0;
}

function startBgm2() {
  if (!bgm2 || bgm2Started) return;
  bgm2Started = true;
  bgm2.volume = 0.4;
  bgm2.play().catch(() => {});
}

function appendChatLine(entry) {
  const line = document.createElement("p");
  line.className = `chat-line ${entry.speaker}`;
  const speakerLabel = entry.speaker === "fox" ? "Steve" : "You";
  line.textContent = entry.speaker === "system" ? entry.text : `${speakerLabel}: ${entry.text}`;
  dialogueBox.appendChild(line);
  dialogueBox.scrollTop = dialogueBox.scrollHeight;
}

function renderDialogueChoices() {
  dialogueOptions.innerHTML = "";

  if (dialogueStep >= dialogueFlow.length) {
    appendChatLine({ speaker: "system", text: "Will you help Steve find Esther tonight?" });
    helpBtn.classList.remove("hidden");
    return;
  }

  const step = dialogueFlow[dialogueStep];
  step.choices.forEach((choiceText) => {
    const button = document.createElement("button");
    button.className = "choice-btn";
    button.type = "button";
    button.textContent = choiceText;
    button.addEventListener("click", () => {
      appendChatLine({ speaker: "player", text: choiceText });
      dialogueOptions.innerHTML = "";
      letterTimer = setTimeout(() => {
        appendChatLine({ speaker: "fox", text: step.foxReply });
        dialogueStep += 1;
        renderDialogueChoices();
      }, 550);
    });
    dialogueOptions.appendChild(button);
  });
}

function startDialogue() {
  dialogueBox.innerHTML = "";
  dialogueStep = 0;
  helpBtn.classList.add("hidden");
  appendChatLine({ speaker: "fox", text: "......" });
  renderDialogueChoices();
}

function renderJourneySlide(index) {
  journeyImage.classList.remove("fade-slide");
  journeyImage.src = journeySlides[index];
  journeyCaption.textContent = journeyCaptions[index];
  void journeyImage.offsetWidth;
  journeyImage.classList.add("fade-slide");
}

function onJourneyClick() {
  if (journeyLocked) return;
  journeyLocked = true;
  journeyIndex += 1;

  if (journeyIndex >= journeySlides.length) {
    goTo("quiz");
    startQuiz();
    return;
  }

  renderJourneySlide(journeyIndex);
  setTimeout(() => {
    journeyLocked = false;
  }, 650);
}

function playJourneySlides() {
  journeyIndex = 0;
  journeyLocked = false;
  slideFrame.style.cursor = "pointer";
  renderJourneySlide(journeyIndex);
  slideFrame.addEventListener("click", onJourneyClick);
}

function advancePostQuizState() {
  const next = postQuizTransitions[postQuizStage];
  if (!next) return;
  postQuizStage = next;
  runPostQuizState(next);
}

function onArrivalVideoEnded() {
  advancePostQuizState();
}

function startTerminalStage() {
  terminalText.textContent = "";
  proceedBtn.classList.add("hidden");
  proceedBtn.onclick = null;

  let index = 0;
  typewriterTimer = setInterval(() => {
    index += 1;
    terminalText.textContent = terminalLine.slice(0, index);
    if (index >= terminalLine.length) {
      clearInterval(typewriterTimer);
      typewriterTimer = null;
      proceedBtn.classList.remove("hidden");
      proceedBtn.onclick = () => {
        startBgm2();
        goTo("decision");
      };
    }
  }, 85);
}

function runPostQuizState(nextState) {
  if (nextState === "blackout") {
    stopBgm();
    goTo("blackout");
    postQuizTimer = setTimeout(() => {
      advancePostQuizState();
    }, 2000);
    return;
  }

  if (nextState === "video") {
    stopBgm();
    goTo("video");
    arriveVideo.currentTime = 0;
    arriveVideo.addEventListener("ended", onArrivalVideoEnded, { once: true });
    arriveVideo.play().catch(() => {
      // Fallback in case autoplay is blocked.
    });
    return;
  }

  if (nextState === "terminal") {
    stopBgm();
    goTo("terminal");
    startTerminalStage();
    return;
  }

  if (nextState === "decision") {
    goTo("decision");
  }
}

function startPostQuizSequence() {
  postQuizStage = "blackout";
  runPostQuizState("blackout");
}

function renderQuestion() {
  const current = questions[questionIndex];
  if (!current) {
    startPostQuizSequence();
    return;
  }

  qIndex.textContent = String(questionIndex + 1);
  qTotal.textContent = String(questions.length);
  questionText.textContent = current.q;
  optionsWrap.innerHTML = "";
  textWrap.classList.add("hidden");

  if (current.type === "mcq") {
    current.options.forEach((option, optionIndex) => {
      const button = document.createElement("button");
      button.className = "option";
      button.type = "button";
      button.textContent = option;
      button.addEventListener("click", () => {
        if (optionIndex === current.answer) {
          score += 1;
          questionIndex += 1;
          renderQuestion();
        } else {
          alert("Steve takes a breath and tries again.");
        }
      });
      optionsWrap.appendChild(button);
    });
  } else {
    textAnswer.value = "";
    textWrap.classList.remove("hidden");
    textAnswer.focus();
  }
}

function submitTextAnswer() {
  if (textAnswer.value.trim().length === 0) {
    alert("Give Steve one loving word before he goes on.");
    return;
  }

  score += 1;
  questionIndex += 1;
  renderQuestion();
}

function startQuiz() {
  questionIndex = 0;
  score = 0;
  renderQuestion();
}

function moveNoButton() {
  const area = document.querySelector(".decision-actions");
  const maxX = Math.max(0, area.clientWidth - noBtn.offsetWidth - 10);
  const maxY = Math.max(0, area.clientHeight - noBtn.offsetHeight - 10);
  const x = Math.floor(Math.random() * (maxX + 1));
  const y = Math.floor(Math.random() * (maxY + 1));
  noBtn.style.position = "absolute";
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
}

function startFinalSequence() {
  letterLinesWrap.innerHTML = "";

  let slideIndex = 0;
  finalImage.src = finalSlides[slideIndex];

  finalTimer = setInterval(() => {
    slideIndex = (slideIndex + 1) % finalSlides.length;
    finalImage.classList.remove("fade-slide");
    finalImage.src = finalSlides[slideIndex];
    void finalImage.offsetWidth;
    finalImage.classList.add("fade-slide");
  }, 2800);

  let lineIndex = 0;
  letterTimer = setInterval(() => {
    if (lineIndex >= letterLines.length) {
      clearInterval(letterTimer);
      letterTimer = null;
      return;
    }

    const line = document.createElement("p");
    line.className = "letter-line";
    line.textContent = letterLines[lineIndex];
    letterLinesWrap.appendChild(line);
    lineIndex += 1;
  }, 1800);
}

startFox.addEventListener("click", () => {
  startBgmOnce();
  goTo("dialogue");
  startDialogue();
});

helpBtn.addEventListener("click", () => {
  startBgmOnce();
  goTo("journey");
  playJourneySlides();
});

submitText.addEventListener("click", submitTextAnswer);
textAnswer.addEventListener("keydown", (event) => {
  startBgmOnce();
  if (event.key === "Enter") {
    submitTextAnswer();
  }
});

yesBtn.addEventListener("click", () => {
  startBgmOnce();
  goTo("final");
  startFinalSequence();
});

noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("click", () => {
  noBtn.classList.add("hidden");
});

document.addEventListener(
  "pointerdown",
  () => {
    startBgmOnce();
  },
  { once: true }
);

goTo("start");
