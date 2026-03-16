(async function () {
  const FALLBACK_QUOTE = {
    quote: "Great systems are built through iteration.",
    author: "Unknown",
  };

  // ─── DOM refs ───
  const quoteEl = document.getElementById("quote");
  const authorEl = document.getElementById("author");
  const tipEl = document.getElementById("tip");
  const copyBtn = document.getElementById("copyBtn");
  const newBtn = document.getElementById("newBtn");
  const searchInput = document.getElementById("searchInput");
  const greetingEl = document.getElementById("greeting");
  const clockEl = document.getElementById("clock");
  const quoteSection = document.querySelector(".quote-section");
  const streakCountEl = document.getElementById("streakCount");
  const streakBadge = document.getElementById("streakBadge");
  const streakLabel = document.querySelector(".streak-label");
  const challengeTitle = document.getElementById("challengeTitle");
  const challengeHint = document.getElementById("challengeHint");
  const challengeAnswer = document.getElementById("challengeAnswer");
  const revealBtn = document.getElementById("revealBtn");

  let quotes = [];
  let tips = [];
  let challenges = [];

  // ─── Helpers ───

  function getDayOfYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    return Math.floor((now - start) / (1000 * 60 * 60 * 24));
  }

  function getTodayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  }

  function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return "Good morning \u2600\uFE0F";
    if (h < 18) return "Good afternoon \uD83C\uDF24\uFE0F";
    return "Good evening \uD83C\uDF19";
  }

  function updateClock() {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function renderQuote(q) {
    quoteEl.textContent = `\u201C${q.quote}\u201D`;
    authorEl.textContent = `\u2014 ${q.author}`;
  }

  function renderTip(t) {
    tipEl.textContent = t;
  }

  // ─── Streak logic ───

  function updateStreak() {
    const todayKey = getTodayKey();
    const stored = JSON.parse(localStorage.getItem("designmind_streak") || "null");

    if (!stored) {
      const data = { lastDay: todayKey, count: 1 };
      localStorage.setItem("designmind_streak", JSON.stringify(data));
      return data.count;
    }

    if (stored.lastDay === todayKey) {
      return stored.count;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`;

    let newCount;
    if (stored.lastDay === yesterdayKey) {
      newCount = stored.count + 1;
    } else {
      newCount = 1;
    }

    const data = { lastDay: todayKey, count: newCount };
    localStorage.setItem("designmind_streak", JSON.stringify(data));
    return newCount;
  }

  function renderStreak(count) {
    streakCountEl.textContent = count;
    streakLabel.textContent = count === 1 ? "day streak" : "day streak";
    // Milestone glow at 7+
    if (count >= 7) {
      streakBadge.classList.add("milestone");
    }
    // Tooltip with streak info
    streakBadge.title = count === 1
      ? "You started your streak today!"
      : `You\u2019ve been on a ${count}-day streak. Keep it going!`;
  }

  // ─── Challenge logic ───

  function renderChallenge(challenge) {
    challengeTitle.textContent = challenge.title;
    challengeHint.textContent = challenge.hint;
    challengeAnswer.textContent = challenge.answer;
    challengeAnswer.classList.add("hidden");
    revealBtn.textContent = "Show Answer";
    revealBtn.classList.remove("revealed");
  }

  // ─── Data loading ───

  try {
    const [quotesRes, tipsRes, challengesRes] = await Promise.all([
      fetch("quotes.json"),
      fetch("tips.json"),
      fetch("challenges.json"),
    ]);
    quotes = await quotesRes.json();
    tips = await tipsRes.json();
    challenges = await challengesRes.json();
  } catch {
    quotes = [FALLBACK_QUOTE];
    tips = ["Keep learning system design every day."];
    challenges = [{ title: "Design a URL Shortener", hint: "Think about hashing and read-heavy patterns.", answer: "Use hash/counter for short codes, store in KV store, cache hot URLs." }];
  }

  // ─── Initial render ───

  greetingEl.textContent = getGreeting();
  updateClock();
  setInterval(updateClock, 1000);

  const day = getDayOfYear();
  renderQuote(quotes[day % quotes.length]);
  renderTip(tips[day % tips.length]);
  renderChallenge(challenges[day % challenges.length]);

  const streakCount = updateStreak();
  renderStreak(streakCount);

  // ─── Keyboard shortcut: "/" to focus search ───

  document.addEventListener("keydown", (e) => {
    // Press "/" anywhere to focus search
    if (e.key === "/" && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
    // Press Escape to blur search
    if (e.key === "Escape" && document.activeElement === searchInput) {
      searchInput.blur();
    }
  });

  // ─── Search ───

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const q = searchInput.value.trim();
      if (!q) return;
      const isUrl = /^(https?:\/\/|[\w-]+\.\w{2,})/.test(q);
      if (isUrl) {
        window.location.href = q.startsWith("http") ? q : "https://" + q;
      } else {
        window.location.href = "https://www.google.com/search?q=" + encodeURIComponent(q);
      }
    }
  });

  // ─── Quote buttons ───

  copyBtn.addEventListener("click", () => {
    const text = `${quoteEl.textContent} ${authorEl.textContent}`;
    navigator.clipboard.writeText(text).then(() => {
      const label = copyBtn.querySelector("span");
      label.textContent = "Copied!";
      setTimeout(() => { label.textContent = "Copy"; }, 1500);
    });
  });

  newBtn.addEventListener("click", () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    renderQuote(quotes[randomIndex]);
    quoteSection.classList.remove("fade");
    void quoteSection.offsetWidth;
    quoteSection.classList.add("fade");
  });

  // ─── Challenge reveal ───

  revealBtn.addEventListener("click", () => {
    const isHidden = challengeAnswer.classList.contains("hidden");
    if (isHidden) {
      challengeAnswer.classList.remove("hidden");
      revealBtn.textContent = "Hide Answer";
      revealBtn.classList.add("revealed");
    } else {
      challengeAnswer.classList.add("hidden");
      revealBtn.textContent = "Show Answer";
      revealBtn.classList.remove("revealed");
    }
  });
})();

