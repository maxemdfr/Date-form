emailjs.init("mmtNAYpKq6X_SgbWI");
const EMAILJS_SERVICE_ID = "service_11iezrq";
const EMAILJS_TEMPLATE_ID = "template_qj86rfj";

const floatingBg = document.getElementById("floatingBg");
spawnFloatingBackground(floatingBg);

let buttonScale = 1;
let noMessageIndex = 0;

const answers = {
    dateIdea: null,
    dateIdeaIcon: null,
    location: null,
    locationIcon: null,
    contact: null
};

function spawnFloatingBackground(container, count = 20) {

    const floatingIcons = ["✨", "💖", "⭐", "💫", "🩷"];

    for (let i = 0; i < count; i++) {

        const item = document.createElement("span");
        item.className = "floating-item";
        item.textContent = floatingIcons[Math.floor(Math.random() * floatingIcons.length)];

        const isRising = Math.random() > .5;
        item.classList.add(isRising ? "rising" : "twinkling");

        const left = Math.random() * 100;
        const size = 14 + Math.random() * 18;
        const delay = Math.random() * 10;

        item.style.left = `${left}%`;
        item.style.fontSize = `${size}px`;
        item.style.animationDelay = `${delay}s`;

        if (isRising) {

            item.style.bottom = "-40px";
            item.style.animationDuration = `${8 + Math.random() * 20}s`;
        } else {

            item.style.top = `${Math.random() * 100}%`;
            item.style.animationDuration = `${3 + Math.random() * 4}s`;
        };

        container.appendChild(item);
    };
};

function showNotification(type) {
    
    const notification = document.querySelector(".notification");

    if (type === "success") {
        
        notification.innerText = "C'est tout bon ;)";
        notification.style.backgroundColor = "#36b836";
        notification.style.border = "2px solid #44b144";
        notification.style.boxShadow = "0 3px 5px #344d265f";
    } else {

        notification.innerText = "T'as oublié ton numéro :(";
        notification.style.backgroundColor = "#c55555";
        notification.style.border = "2px solid #9c3a3a";
        notification.style.boxShadow = "0 3px 5px #4d27265f";
    };

    notification.style.top = "30px";

    setTimeout(() => {

        notification.style.top = "-80px";
    }, 3000);
};

function playClickAnimation(btn) {

    btn.classList.add("clicked");

    btn.addEventListener("animationend", function onClickEnd() {

        btn.removeEventListener("animationend", onClickEnd);
        btn.classList.remove("clicked");
    }, { once: true });
};

function goToSlide(currentSlide, nextSlide, { outAnimation = "slide-out", inAnimation = "slide-in" } = {}) {

    currentSlide.classList.add(outAnimation);

    currentSlide.addEventListener("animationend", function onSlideOut() {

        currentSlide.removeEventListener("animationend", onSlideOut);
        currentSlide.classList.remove("visible", outAnimation);

        nextSlide.classList.add("visible", inAnimation);

        nextSlide.addEventListener("animationend", function onSlideIn() {

            nextSlide.removeEventListener("animationend", onSlideIn);
            nextSlide.classList.remove(inAnimation);
        }, { once: true });
    }, { once: true });
};

function moveButton(btn, container) {

    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    const maxX = containerRect.width - btnRect.width;
    const maxY = containerRect.height - btnRect.height;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    btn.style.right = `${randomX}px`;
    btn.style.bottom = `${randomY}px`;
};

function enlargeButton(btn) {

    buttonScale += 0.3;

    btn.style.setProperty("--scale", buttonScale);
};

function changeButtonText(btn) {

    const noMessages = [
        "Tu pourrais le regretter !",
        "T'es sure ?",
        "Vraiment sure ?",
        "Réfléchis bien !",
        "Aller stp...",
        "Dernière chance !",
        "Sure et certaine ?",
        "Pourquoi... ?"
    ];

    noMessageIndex = (noMessageIndex + 1) % noMessages.length;
    btn.innerText = noMessages[noMessageIndex];
};

function showMessage(message) {

    message.style.visibility = "visible";
    message.style.opacity = "1";
};

function spawnConfetti(container, piecesPerBurst = 16) {

    const burstOrigins = [
        { top: "-15%", left: "-15%" },
        { top: "30%", left: "120%" },
        { top: "130%", left: "25%" }
    ];

    container.innerHTML = "";

    burstOrigins.forEach((origin) => {

        for (let i = 0; i < piecesPerBurst; i++) {

            const confettiShapes = ["shape-line", "shape-square", "shape-circle"];
            const confettiColors = ["#e02b58", "#e3218f", "#8b0098", "#f6c343", "#46cf46"];

            const trait = document.createElement("span");

            const shape = confettiShapes[Math.floor(Math.random() * confettiShapes.length)];
            trait.className = `trait ${shape}`;

            const angle = (360 / piecesPerBurst) * i + (Math.random() * 12 - 6);
            const delay = Math.random() * 0.15;
            const distance = 80 + Math.random() * 50;
            const size = 0.7 + Math.random() * 0.7;
            const color = confettiColors[i % confettiColors.length];

            trait.style.top = origin.top;
            trait.style.left = origin.left;
            trait.style.setProperty("--angle", `${angle}deg`);
            trait.style.setProperty("--delay", `${delay}s`);
            trait.style.setProperty("--distance", `${distance}px`);
            trait.style.setProperty("--size", size.toFixed(2));
            trait.style.setProperty("--trait-color", color);

            container.appendChild(trait);
        };
    });
};

function renderRecap() {

    document.getElementById("recapDateIdeaIcon").textContent = answers.dateIdeaIcon;
    document.getElementById("recapDateIdea").textContent = answers.dateIdea;

    document.getElementById("recapLocationIcon").textContent = answers.locationIcon;
    document.getElementById("recapLocation").textContent = answers.location;

    document.getElementById("recapContact").textContent = answers.contact;
};

function sendAnswers(data) {

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        
        date_idea: data.dateIdea,
        location: data.location,
        contact: data.contact,
    }).then(() => {

        showNotification("success");

        setTimeout(() => {

            window.close();
        }, 1800);
    }).catch((error) => {

        console.error("Erreur d'envoi EmailJS :", error);
        showNotification("error", "Oups, l'envoi a échoué. Réessaie !");
    });
};



// SLIDES

const helloSlide = document.getElementById("helloSlide");
const questionSlide = document.getElementById("questionSlide");
const happySlide = document.getElementById("happySlide");
const organisationSlide = document.getElementById("organisationSlide");
const locationSlide = document.getElementById("locationSlide");
const communicationSlide = document.getElementById("communicationSlide");
const recapSlide = document.getElementById("recapSlide");

// BUTTONS

const startBtn = document.getElementById("startBtn");
const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const showRecapBtn = document.getElementById("showRecapBtn");
const submitBtn = document.getElementById("submitBtn");
const restartBtn = document.getElementById("restartBtn");

// CONTAINERS

const questionContainer = document.getElementById("questionSlide");
const confettiBurst = document.getElementById("confettiBurst");

// MESSAGES

const stopPlayingMessage = document.querySelector(".stop-playing-hard-message");

// DATE INFOS

const dateIdea = document.querySelectorAll(".date-idea");
const locationIdea = document.querySelectorAll(".date-location");
const communicationInput = document.getElementById("communicationInput");



// BUTTONS ANIMATION

document.querySelectorAll(".button").forEach((btn) => {

    btn.addEventListener("click", () => playClickAnimation(btn));
});

// AVOID "NO" BUTTON

noBtn.addEventListener("mouseover", () => {

    moveButton(noBtn, questionContainer);
    enlargeButton(yesBtn);
    showMessage(stopPlayingMessage);
    changeButtonText(noBtn);
});

noBtn.addEventListener("touchstart", () => {

    moveButton(noBtn, questionContainer);
    enlargeButton(yesBtn);
    showMessage(stopPlayingMessage);
    changeButtonText(noBtn);
});

// CHANGE SLIDE

startBtn.addEventListener("click", () => {

    goToSlide(helloSlide, questionSlide, { outAnimation: "fade-out", inAnimation: "fade-in" });
});

yesBtn.addEventListener("click", () => {

    goToSlide(questionSlide, happySlide, { inAnimation: "pop-in-happy" });
    spawnConfetti(confettiBurst);

    setTimeout(() => {

        goToSlide(happySlide, organisationSlide);
    }, 3000);
});

dateIdea.forEach((idea) => {

    idea.addEventListener("click", () => {

        answers.dateIdea = idea.dataset.choice;
        answers.dateIdeaIcon = idea.querySelector("span").textContent;

        goToSlide(organisationSlide, locationSlide);
    });
});

locationIdea.forEach((location) => {

    location.addEventListener("click", () => {

        answers.location = location.dataset.choice;
        answers.locationIcon = location.querySelector("span").textContent;

        goToSlide(locationSlide, communicationSlide);
    });
});

restartBtn.addEventListener("click", () => {

    goToSlide(recapSlide, organisationSlide, { outAnimation: "fade-out", inAnimation: "fade-in" });
});

// SUBMIT FORM

communicationInput.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {

        if (!communicationInput.value.trim()) {

            communicationInput.style.border = "1px solid red";
            showNotification();
        } else {

            communicationInput.style.border = "1px solid #0000004f";

            answers.contact = communicationInput.value.trim();
            renderRecap();

            goToSlide(communicationSlide, recapSlide);
        };
    };
});

showRecapBtn.addEventListener("click", () => {

    if (!communicationInput.value.trim()) {

        communicationInput.style.border = "1px solid red";
        showNotification();
    } else {

        communicationInput.style.border = "1px solid #0000004f";

        answers.contact = communicationInput.value.trim();
        renderRecap();

        goToSlide(communicationSlide, recapSlide);
    };
});

submitBtn.addEventListener("click", () => {

    sendAnswers(answers);
});