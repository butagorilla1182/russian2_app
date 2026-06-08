let currentLevel = 1;
let currentCategory = "all";
let currentCards = [];
let currentIndex = 0;
let weakIds = JSON.parse(localStorage.getItem("weakIds") || "[]");
let weakMode = false;

function saveWeakIds() {
  localStorage.setItem("weakIds", JSON.stringify(weakIds));
  updateCounts();
}

function updateCounts() {
  const weakCount = document.getElementById("weakCount");
  const totalCount = document.getElementById("totalCount");

  if (weakCount) {
    weakCount.textContent = `現在の弱点カード：${weakIds.length}枚`;
  }

  if (totalCount && typeof cards !== "undefined") {
    const lv1 = cards.filter(card => card.level <= 1).length;
    const lv2 = cards.filter(card => card.level <= 2).length;
    const lv3 = cards.filter(card => card.level <= 3).length;
    totalCount.textContent = `カード数：第1形態 ${lv1}枚まで / 第2形態 ${lv2}枚まで / 第3形態 ${lv3}枚まで`;
  }
}

function resetWeakCards() {
  if (!confirm("弱点カードを全部リセットしますか？")) {
    return;
  }

  weakIds = [];
  saveWeakIds();
  alert("弱点カードをリセットしました。");
}

function shuffle(array) {
  const copied = [...array];
  for (let i = copied.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

function selectLevel(level) {
  currentLevel = level;
  weakMode = false;

  document.getElementById("levelScreen").classList.add("hidden");
  document.getElementById("categoryScreen").classList.remove("hidden");
  document.getElementById("selectedLevelLabel").textContent = `第${level}形態`;

  updateCategoryCount();
}

function updateCategoryCount() {
  const categoryCount = document.getElementById("categoryCount");
  if (!categoryCount) return;

  const base = cards.filter(card => card.level <= currentLevel);

  const counts = {
    all: base.length,
    vocab: base.filter(card => card.category === "vocab").length,
    verb: base.filter(card => card.category === "verb").length,
    case: base.filter(card => card.category === "case").length,
    number: base.filter(card => card.category === "number").length,
    participle: base.filter(card => card.category === "participle").length,
    composition: base.filter(card => card.category === "composition").length,
    theme: base.filter(card => card.category === "theme").length
  };

  categoryCount.textContent =
    `全部 ${counts.all} / 語彙 ${counts.vocab} / 動詞 ${counts.verb} / 格支配 ${counts.case} / 数詞 ${counts.number} / 形副 ${counts.participle} / 作文 ${counts.composition} / テーマ ${counts.theme}`;
}

function startCategory(category) {
  currentCategory = category;
  weakMode = false;

  let filtered = cards.filter(card => card.level <= currentLevel);

  if (category !== "all") {
    filtered = filtered.filter(card => card.category === category);
  }

  currentCards = shuffle(filtered);
  currentIndex = 0;

  if (currentCards.length === 0) {
    alert("この分野のカードはまだありません。");
    return;
  }

  document.getElementById("categoryScreen").classList.add("hidden");
  document.getElementById("studyScreen").classList.remove("hidden");
  document.getElementById("modeLabel").textContent = getModeLabel(category);

  showCard();
}

function getModeLabel(category) {
  const labels = {
    all: "全部ランダム",
    vocab: "頻出語彙",
    verb: "動詞の体",
    case: "格支配",
    number: "数詞",
    participle: "形動詞・副動詞",
    composition: "口頭作文",
    theme: "テーマ整理"
  };

  return labels[category] || "学習";
}

function startWeakMode() {
  weakMode = true;
  currentCards = shuffle(cards.filter(card => weakIds.includes(card.id)));
  currentIndex = 0;

  if (currentCards.length === 0) {
    alert("弱点カードはまだありません。間違いボタンを押すと追加されます。");
    return;
  }

  document.getElementById("levelScreen").classList.add("hidden");
  document.getElementById("categoryScreen").classList.add("hidden");
  document.getElementById("studyScreen").classList.remove("hidden");
  document.getElementById("modeLabel").textContent = "弱点復習";

  showCard();
}

function showCard() {
  if (currentCards.length === 0) return;

  const card = currentCards[currentIndex];

  document.getElementById("progress").textContent =
    `${currentIndex + 1} / ${currentCards.length}`;

  let tagText = "";

  if (card.tag) {
    tagText = card.tag;
  } else if (Array.isArray(card.tags)) {
    tagText = card.tags.join(" / ");
  }

  document.getElementById("tag").textContent = tagText;
  document.getElementById("front").textContent = card.front || "";
  document.getElementById("back").textContent = card.back || "";
  document.getElementById("back").classList.add("hidden");
}

function showAnswer() {
  document.getElementById("back").classList.remove("hidden");
}

function nextCard() {
  currentIndex++;

  if (currentIndex >= currentCards.length) {
    currentIndex = 0;
  }

  showCard();
}

function markWrong() {
  const card = currentCards[currentIndex];

  if (!weakIds.includes(card.id)) {
    weakIds.push(card.id);
    saveWeakIds();
  }

  nextCard();
}

function markCorrect() {
  const card = currentCards[currentIndex];

  if (weakIds.includes(card.id)) {
    weakIds = weakIds.filter(id => id !== card.id);
    saveWeakIds();
  }

  nextCard();
}

function backToLevel() {
  document.getElementById("categoryScreen").classList.add("hidden");
  document.getElementById("studyScreen").classList.add("hidden");
  document.getElementById("levelScreen").classList.remove("hidden");
  updateCounts();
}

function backToCategory() {
  document.getElementById("studyScreen").classList.add("hidden");

  if (weakMode) {
    document.getElementById("levelScreen").classList.remove("hidden");
  } else {
    document.getElementById("categoryScreen").classList.remove("hidden");
    updateCategoryCount();
  }

  updateCounts();
}

updateCounts();
