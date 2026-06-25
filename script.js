// 单词数据：第一版先直接写在 JavaScript 里，不使用数据库。
const words = [
  { word: "apple", meaning: "苹果", example: "I eat an apple every morning.", exampleMeaning: "我每天早上吃一个苹果。" },
  { word: "book", meaning: "书", example: "This book is easy to read.", exampleMeaning: "这本书很容易读。" },
  { word: "water", meaning: "水", example: "Please drink more water.", exampleMeaning: "请多喝水。" },
  { word: "school", meaning: "学校", example: "My sister goes to school by bus.", exampleMeaning: "我妹妹坐公交车去学校。" },
  { word: "friend", meaning: "朋友", example: "Tom is my good friend.", exampleMeaning: "汤姆是我的好朋友。" },
  { word: "happy", meaning: "开心的", example: "She is happy today.", exampleMeaning: "她今天很开心。" },
  { word: "family", meaning: "家庭；家人", example: "I love my family.", exampleMeaning: "我爱我的家人。" },
  { word: "morning", meaning: "早晨", example: "I run in the morning.", exampleMeaning: "我在早晨跑步。" },
  { word: "learn", meaning: "学习", example: "We learn English together.", exampleMeaning: "我们一起学习英语。" },
  { word: "music", meaning: "音乐", example: "Music makes me relaxed.", exampleMeaning: "音乐让我放松。" },
  { word: "city", meaning: "城市", example: "Shanghai is a big city.", exampleMeaning: "上海是一座大城市。" },
  { word: "teacher", meaning: "老师", example: "Our teacher is very kind.", exampleMeaning: "我们的老师很友好。" },
  { word: "coffee", meaning: "咖啡", example: "My dad likes coffee.", exampleMeaning: "我爸爸喜欢咖啡。" },
  { word: "window", meaning: "窗户", example: "Open the window, please.", exampleMeaning: "请打开窗户。" },
  { word: "garden", meaning: "花园", example: "There are flowers in the garden.", exampleMeaning: "花园里有花。" },
  { word: "orange", meaning: "橙子；橙色的", example: "The orange is sweet.", exampleMeaning: "这个橙子很甜。" },
  { word: "winter", meaning: "冬天", example: "Winter is cold here.", exampleMeaning: "这里的冬天很冷。" },
  { word: "market", meaning: "市场", example: "We buy fruit at the market.", exampleMeaning: "我们在市场买水果。" },
  { word: "travel", meaning: "旅行", example: "They travel by train.", exampleMeaning: "他们坐火车旅行。" },
  { word: "dream", meaning: "梦想", example: "Everyone has a dream.", exampleMeaning: "每个人都有一个梦想。" }
];

// currentIndex 表示当前学习到第几个单词，从 0 开始计数。
let currentIndex = 0;

// reviewWords 用来保存用户点击“不认识”的单词。
let reviewWords = [];

// 下面这些变量用来找到页面上的元素，方便后面修改它们的内容。
const progressText = document.querySelector("#progress-text");
const reviewCount = document.querySelector("#review-count");
const cardNumber = document.querySelector("#card-number");
const wordText = document.querySelector("#word-text");
const meaningText = document.querySelector("#meaning-text");
const exampleText = document.querySelector("#example-text");
const exampleMeaningText = document.querySelector("#example-meaning-text");
const reviewList = document.querySelector("#review-list");

const studySection = document.querySelector("#study-section");
const testSection = document.querySelector("#test-section");
const studyModeButton = document.querySelector("#study-mode-button");
const testModeButton = document.querySelector("#test-mode-button");
const testMeaningText = document.querySelector("#test-meaning-text");
const answerInput = document.querySelector("#answer-input");
const answerFeedback = document.querySelector("#answer-feedback");

const knowButton = document.querySelector("#know-button");
const unknownButton = document.querySelector("#unknown-button");
const nextButton = document.querySelector("#next-button");
const checkAnswerButton = document.querySelector("#check-answer-button");
const testNextButton = document.querySelector("#test-next-button");

// 获取当前单词，使用取余可以让最后一个单词之后回到第一个单词。
function getCurrentWord() {
  return words[currentIndex % words.length];
}

// 更新页面上的学习进度。
function updateProgress() {
  progressText.textContent = `已学习 ${currentIndex + 1} / ${words.length}`;
  reviewCount.textContent = `${reviewWords.length} 个`;
}

// 显示当前单词卡片内容。
function showCurrentWord() {
  const currentWord = getCurrentWord();

  cardNumber.textContent = `第 ${currentIndex + 1} 个单词`;
  wordText.textContent = currentWord.word;
  meaningText.textContent = currentWord.meaning;
  exampleText.textContent = currentWord.example;
  exampleMeaningText.textContent = currentWord.exampleMeaning;
  testMeaningText.textContent = currentWord.meaning;
  answerInput.value = "";
  answerFeedback.textContent = "";
  answerFeedback.className = "feedback";

  updateProgress();
}

// 渲染复习列表，让用户知道哪些单词还不熟。
function renderReviewList() {
  reviewList.innerHTML = "";

  if (reviewWords.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "暂无需要复习的单词。";
    reviewList.append(emptyItem);
    return;
  }

  reviewWords.forEach(function (item) {
    const listItem = document.createElement("li");
    listItem.textContent = `${item.word}：${item.meaning}`;
    reviewList.append(listItem);
  });
}

// 切换到下一个单词。
function goToNextWord() {
  currentIndex = (currentIndex + 1) % words.length;
  showCurrentWord();
}

// 点击“不认识”时，把当前单词加入复习列表。
function addToReviewList() {
  const currentWord = getCurrentWord();
  const alreadyInReview = reviewWords.some(function (item) {
    return item.word === currentWord.word;
  });

  if (!alreadyInReview) {
    reviewWords.push(currentWord);
  }

  renderReviewList();
  updateProgress();
}

// 检查测试模式下输入的英文是否正确。
function checkAnswer() {
  const currentWord = getCurrentWord();
  const userAnswer = answerInput.value.trim().toLowerCase();

  if (userAnswer === "") {
    answerFeedback.textContent = "请先输入你的答案。";
    answerFeedback.className = "feedback wrong";
    return;
  }

  if (userAnswer === currentWord.word.toLowerCase()) {
    answerFeedback.textContent = "回答正确！";
    answerFeedback.className = "feedback correct";
  } else {
    answerFeedback.textContent = `还不对，正确答案是：${currentWord.word}`;
    answerFeedback.className = "feedback wrong";
    addToReviewList();
  }
}

// 切换学习模式和测试模式。
function switchMode(mode) {
  const isStudyMode = mode === "study";

  studySection.classList.toggle("hidden", !isStudyMode);
  testSection.classList.toggle("hidden", isStudyMode);
  studyModeButton.classList.toggle("active", isStudyMode);
  testModeButton.classList.toggle("active", !isStudyMode);

  showCurrentWord();

  if (!isStudyMode) {
    answerInput.focus();
  }
}

knowButton.addEventListener("click", goToNextWord);
unknownButton.addEventListener("click", function () {
  addToReviewList();
  goToNextWord();
});
nextButton.addEventListener("click", goToNextWord);
checkAnswerButton.addEventListener("click", checkAnswer);
testNextButton.addEventListener("click", goToNextWord);
studyModeButton.addEventListener("click", function () {
  switchMode("study");
});
testModeButton.addEventListener("click", function () {
  switchMode("test");
});
answerInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    checkAnswer();
  }
});

// 页面打开时先显示第一个单词和空的复习列表。
showCurrentWord();
renderReviewList();
