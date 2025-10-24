document.addEventListener("DOMContentLoaded", function () {
  const startContentSectionId = "#start-content";

  function addActiveClass(target) {
    const targetEl = document.querySelector(target);
    if (!targetEl) return;

    targetEl.style.display = "block";
    gsap.fromTo(
      targetEl,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.5,
        onStart: () => targetEl.classList.add("active"),
      }
    );
  }

  function removeActiveClass(target) {
    const targetEl = document.querySelector(target);
    if (!targetEl) return;

    gsap.to(targetEl, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        targetEl.classList.remove("active");
        targetEl.style.display = "none";
      },
    });
  }

  // Показати модалку (при потребі)
  function openModal() {
    document.getElementById("modal-1").style.display = "flex";
  }

  // Закриття модалки та перехід до наступної секції
  document.getElementById("close-modal").addEventListener("click", function () {
    document.getElementById("modal-1").style.display = "none";

    removeActiveClass(startContentSectionId);

    const next = this.getAttribute("data-next");
    if (next) addActiveClass("#" + next);
  });

  const allQuestions = document.querySelectorAll(".question");
  const stepperSteps = document.querySelectorAll(".step");

  function showQuestion(id) {
    allQuestions.forEach((el) => el.classList.remove("visible"));
    const target = document.getElementById(id);
    if (target) {
      target.classList.add("visible");
      updateStepper(id);
    } else {
      console.warn("Елемент з ID не знайдено:", id);
    }
  }

  function updateStepper(id) {
    const match = id.match(/question-(\d)/);
    if (match) {
      const step = parseInt(match[1]);

      stepperSteps.forEach((el, index) => {
        el.classList.remove("active", "completed");
        if (index < step - 1) {
          el.classList.add("completed");
        } else if (index === step - 1) {
          el.classList.add("active");
        }
      });
    } else {
      // якщо перейшли на "boxes", всі completed
      stepperSteps.forEach((el) => {
        el.classList.remove("active");
        el.classList.add("completed");
      });
    }
  }

  function removeActiveClass(target) {
    const targetEl = document.querySelector(target);
    if (!targetEl) return;
    targetEl.classList.remove("active");
  }

  function addActiveClass(target) {
    const targetEl = document.querySelector(target);
    if (!targetEl) return;
    targetEl.classList.add("active");
  }

  function handleAnswerClick(btn) {
    btn.addEventListener("click", function () {
      const nextId = this.closest("[data-next]")?.getAttribute("data-next"); // дивимось батьківський wrapper
      if (!nextId) return;

      const currentVisible = document.querySelector(".question.visible");
      const currentId = currentVisible?.id;

      // Stepper логіка
      if (currentId?.includes("question-")) {
        const currentStepNum = parseInt(currentId.split("-")[1]);
        const nextStepNum = nextId.includes("question-")
          ? parseInt(nextId.split("-")[1])
          : null;

        const currentStep = document.getElementById(`step${currentStepNum}`);
        const nextStep = nextStepNum
          ? document.getElementById(`step${nextStepNum}`)
          : null;

        if (currentStep) {
          currentStep.classList.remove("active");
          currentStep.classList.add("completed");
        }
        if (nextStep) {
          nextStep.classList.add("active");
        }
      }

      // Анімація переходу між питаннями або до гри
      if (nextId === "boxes-game" || nextId === null) {
        gsap.to(currentVisible, {
          opacity: 0,
          duration: 0.4,
          onComplete: () => {
            currentVisible.classList.remove("visible");
            removeActiveClass("#sectionQuestions");
            addActiveClassWithGsap("#sectionAdditionalPrize");
          },
        });
      } else {
        const nextEl = document.getElementById(nextId);
        if (!nextEl) return;

        gsap.to(currentVisible, {
          opacity: 0,
          duration: 0.4,
          onComplete: () => {
            currentVisible.classList.remove("visible");
            nextEl.classList.add("visible");
            gsap.fromTo(nextEl, { opacity: 0 }, { opacity: 1, duration: 0.4 });
          },
        });
      }
    });
  }

  function addActiveClassWithGsap(selector) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.classList.add("active");
    gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.6 });
  }

  document.querySelectorAll(".answers-button, .age-wrapper").forEach((btn) => {
    handleAnswerClick(btn);
  });

  // Прив’язуємо обробники до всіх відповідей
  document.querySelectorAll(".age-wrapper").forEach(handleAnswerClick);
  document.querySelectorAll(".answers-button").forEach(handleAnswerClick);

  // boxes

  let attemptsLeft = 3;
  const boxes = document.querySelectorAll(".try.box");
  const modal = document.getElementById("modal-2");
  const closeModalBtn = document.getElementById("close-modal-2");
  const attemptsDisplay = document.getElementById("num_intentos");

  let isModalOpen = false;
  let isBoxProcessing = false;

  // Плавне відкриття модалки #modal-2
  function showModal() {
    const modal = document.getElementById("modal-2");
    const circleLoader = modal.querySelector(".circle-loader");
    const checkmark = modal.querySelector(".checkmark");

    circleLoader.classList.remove("load-complete");
    checkmark.classList.add("draw");
    checkmark.style.display = "none";

    modal.classList.add("active");
    modal.style.display = "flex";

    isModalOpen = true;

    gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.4 });

    setTimeout(() => {
      circleLoader.classList.add("load-complete");
      setTimeout(() => {
        checkmark.style.display = "block";
      }, 1000);
    }, 0);
  }

  // Плавне закриття модалки #modal-2
  function closeModal() {
    const modal = document.getElementById("modal-2");
    const checkmark = modal.querySelector(".checkmark");

    gsap.to(modal, {
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        modal.classList.remove("active");
        modal.style.display = "none";
        checkmark.style.display = "none";

        // 🔓 Дозволяємо наступний клік
        isModalOpen = false;
        isBoxProcessing = false;
      },
    });
  }

  function disableBox(box) {
    box.classList.add("disabled");
    box.style.pointerEvents = "none";
  }

  let u = new (class t {
      constructor(t) {
        (this.lang = { from: "de" }),
          (this.container = document.querySelector(t)),
          (this.items = document.createElement("ul")),
          this.items.classList.add("notifications__items"),
          this.container.appendChild(this.items);
      }
      create({ name: t, address: e, desc: n, img: i, time: o }) {
        let s = `<div class="notifications__item__img"><img src="${i}" alt="" sizes="" srcset=""></div><div class="notifications__item__content"><div class="notifications__item__content__header"><span class="notifications__item-name">${t}</span>${this.lang.from}<span class="notifications__item-address">${e}</span></div><div class="notifications__item__content__desc">${n}</div><div class="notifications__item__content__bottom"><div class="notifications__item__time">${o}</div><div class="notifications__item__icons"><img src="./assets/img/icons/notification-ok.svg" alt=""></div></div></div><div class="notifications__item__btn"><img class="notifications__item__btn-close" src="./assets/img/icons/notifications-close.svg" height="15px" width="15px" alt=""></div>`,
          r = document.createElement("li");
        return (
          r.classList.add("notifications__item", "showNoty"),
          (r.innerHTML = s),
          r.addEventListener("click", (t) => t.currentTarget.remove()),
          r
        );
      }
      send(t) {
        let e = this.create(t);
        return this.items.prepend(e), e;
      }
      hide(t) {
        setTimeout(() => {
          t.classList.remove("showNoty"),
            t.classList.add("hiddenNoty"),
            setTimeout(() => {
              t.remove();
            }, 1500);
        }, 7500);
      }
    })(".notifications"),
    p = (t) =>
      new Promise((e, n) => {
        setTimeout(() => e(), t);
      }),
    f = (t, e) => Math.round(t + Math.random() * (e - t));

    $('#toCart').click(function() {
      $('#QUIZ').fadeOut('slow', function(){
        $('#PAYMENT').fadeIn('slow')
      })
    })
});

