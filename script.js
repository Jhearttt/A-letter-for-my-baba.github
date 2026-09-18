const coverPage = document.getElementById("cover-page");
const letterPage = document.getElementById("letter-page");
const supportPage = document.getElementById("support-page");

const openLetterButton = document.getElementById("open-letter-btn");
const doneButton = document.getElementById("done-btn");

const envelope = document.getElementById("envelope");
const letterSheet = document.getElementById("letter-sheet");
const letterContent = document.getElementById("letter-content");

const emergencyButton = document.getElementById("emergency-btn");
const emergencyModal = document.getElementById("emergency-modal");
const closeModalButton = document.getElementById("close-modal-btn");

const backToLetterButton = document.getElementById("back-to-letter-btn");
const backToCoverButton = document.getElementById("back-to-cover-btn");

const petalLayer = document.getElementById("petal-layer");

let busy = false;

const wait = milliseconds =>
  new Promise(resolve => setTimeout(resolve, milliseconds));


/* =========================
   PAGE SWITCHING
========================= */

function showPage(page) {

  [coverPage, letterPage, supportPage].forEach(section => {
    section.classList.remove("is-active");
    section.setAttribute("aria-hidden", "true");
  });

  page.classList.add("is-active");
  page.setAttribute("aria-hidden", "false");
}


/* =========================
   RESET LETTER
========================= */

function resetLetter() {

  envelope.classList.remove("is-open");

  letterSheet.classList.remove(
    "is-peeking",
    "is-lifted",
    "is-preparing",
    "is-unfolded",
    "is-folding",
    "is-compressing",
    "is-tucking",
    "is-inside"
  );

  letterContent.scrollTop = 0;
}


/* =========================
   OPENING ANIMATION
========================= */

async function playOpenAnimation() {

  resetLetter();

  /*
    Give the browser one frame to apply the hidden
    starting state before animation begins.
  */
  await wait(80);

  /*
    STEP 1
    Envelope flap opens.
  */
  envelope.classList.add("is-open");

  await wait(760);

  /*
    STEP 2
    Folded paper becomes visible inside the pocket.
  */
  letterSheet.classList.add("is-peeking");

  await wait(240);

  /*
    STEP 3
    Folded paper physically rises from envelope.
  */
  letterSheet.classList.add("is-lifted");

  await wait(720);

  /*
    STEP 4
    The folded sheet becomes closer to full size.
  */
  letterSheet.classList.add("is-preparing");

  await wait(620);

  /*
    STEP 5
    Literal unfolding:
    the top half rotates around the center crease.
  */
  letterSheet.classList.add("is-unfolded");

  letterContent.scrollTop = 0;

  await wait(950);
}


/* Open from cover */
openLetterButton.addEventListener("click", async () => {

  if (busy) return;

  busy = true;

  showPage(letterPage);

  await wait(420);

  await playOpenAnimation();

  busy = false;
});


/* =========================
   DONE READING / CLOSING
========================= */

doneButton.addEventListener("click", async () => {

  if (busy) return;

  busy = true;

  /*
    STEP 1
    The writing fades and the top half folds
    back over the bottom half.
  */
  letterSheet.classList.remove(
    "is-unfolded",
    "is-preparing",
    "is-lifted",
    "is-peeking"
  );

  letterSheet.classList.add("is-folding");

  await wait(900);

  /*
    STEP 2
    Keep it folded, then shrink it back down to
    a believable envelope-sized folded sheet.
  */
  letterSheet.classList.remove("is-folding");
  letterSheet.classList.add("is-compressing");

  await wait(680);

  /*
    STEP 3
    Slide it behind the front envelope pocket.

    CSS clip-path removes the visible paper as
    it enters, so you never see it coming out
    through the bottom of the envelope.
  */
  letterSheet.classList.remove("is-compressing");
  letterSheet.classList.add("is-tucking");

  await wait(900);

  /*
    The paper is now completely visually inside.
  */
  letterSheet.classList.remove("is-tucking");
  letterSheet.classList.add("is-inside");

  await wait(140);

  /*
    STEP 4
    ONLY NOW is the flap allowed to close.
  */
  envelope.classList.remove("is-open");

  await wait(820);

  /*
    STEP 5
    Go to the support page.
  */
  showPage(supportPage);

  resetLetter();

  busy = false;
});


/* =========================
   BACK TO LETTER
========================= */

backToLetterButton.addEventListener("click", async () => {

  if (busy) return;

  busy = true;

  showPage(letterPage);

  await wait(420);

  await playOpenAnimation();

  busy = false;
});


/* =========================
   BACK TO COVER
========================= */

backToCoverButton.addEventListener("click", () => {

  if (busy) return;

  resetLetter();

  showPage(coverPage);
});


/* =========================
   EMERGENCY BUTTON
========================= */

emergencyButton.addEventListener("click", () => {

  emergencyModal.classList.add("is-open");
  emergencyModal.setAttribute("aria-hidden", "false");

  createBurst();
});


closeModalButton.addEventListener("click", closeModal);


emergencyModal.addEventListener("click", event => {

  if (event.target === emergencyModal) {
    closeModal();
  }
});


function closeModal() {

  emergencyModal.classList.remove("is-open");
  emergencyModal.setAttribute("aria-hidden", "true");
}


/* =========================
   HEART / FLOWER BURST
========================= */

function createBurst() {

  const items = ["🩷", "🌸", "✨", "♡", "🌷"];

  for (let i = 0; i < 28; i++) {

    const item = document.createElement("span");

    item.textContent =
      items[Math.floor(Math.random() * items.length)];

    item.style.position = "fixed";
    item.style.left = "50%";
    item.style.top = "50%";
    item.style.zIndex = "200";
    item.style.pointerEvents = "none";
    item.style.fontSize =
      `${14 + Math.random() * 13}px`;

    const x =
      Math.random() * 650 - 325;

    const y =
      Math.random() * 650 - 325;

    item.animate(
      [
        {
          transform:
            "translate(-50%, -50%) scale(.5) rotate(0deg)",
          opacity: 1
        },
        {
          transform:
            `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1.35) rotate(280deg)`,
          opacity: 0
        }
      ],
      {
        duration: 1400,
        easing: "ease-out",
        fill: "forwards"
      }
    );

    document.body.appendChild(item);

    setTimeout(() => item.remove(), 1450);
  }
}


/* =========================
   DECORATIVE PETALS
========================= */

const petals = ["🌸", "♡", "✿"];

function createPetal() {

  const petal =
    document.createElement("span");

  petal.className = "petal";

  petal.textContent =
    petals[Math.floor(Math.random() * petals.length)];

  petal.style.left =
    `${Math.random() * 100}vw`;

  petal.style.fontSize =
    `${11 + Math.random() * 10}px`;

  petal.style.animationDuration =
    `${8 + Math.random() * 5}s`;

  petal.style.setProperty(
    "--drift",
    `${Math.random() * 120 - 60}px`
  );

  petalLayer.appendChild(petal);

  setTimeout(() => petal.remove(), 13500);
}

setInterval(createPetal, 1900);


/* Escape closes emergency message */
document.addEventListener("keydown", event => {

  if (event.key === "Escape") {
    closeModal();
  }
});
