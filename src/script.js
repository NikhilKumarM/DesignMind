(async function () {
  const FALLBACK_QUOTE = {
    quote: "Great systems are built through iteration.",
    author: "Unknown",
  };

  const quoteEl = document.getElementById("quote");
  const authorEl = document.getElementById("author");
  const tipEl = document.getElementById("tip");
  const copyBtn = document.getElementById("copyBtn");
  const newBtn = document.getElementById("newBtn");
  const searchInput = document.getElementById("searchInput");
  const greetingEl = document.getElementById("greeting");
  const clockEl = document.getElementById("clock");
  const quoteSection = document.querySelector(".quote-section");

  let quotes = [];
  let tips = [];

  // ─── Helpers ───

  function getDayOfYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    return Math.floor((now - start) / (1000 * 60 * 60 * 24));
  }

  function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
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

  // ─── Data loading ───

  try {
    const [quotesRes, tipsRes] = await Promise.all([
      fetch("quotes.json"),
      fetch("tips.json"),
    ]);
    quotes = await quotesRes.json();
    tips = await tipsRes.json();
  } catch {
    quotes = [FALLBACK_QUOTE];
    tips = ["Keep learning system design every day."];
  }

  // ─── Initial render ───

  greetingEl.textContent = getGreeting();
  updateClock();
  setInterval(updateClock, 1000);

  const day = getDayOfYear();
  renderQuote(quotes[day % quotes.length]);
  renderTip(tips[day % tips.length]);

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

  // ─── Buttons ───

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
    // Replay fade animation
    quoteSection.classList.remove("fade");
    void quoteSection.offsetWidth;
    quoteSection.classList.add("fade");
  });
})();
