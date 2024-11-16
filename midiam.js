let paragraphs = [
   "Gratitude and patience—two pillars of a believer's life—are essential for finding peace and purpose. The Quran reminds us, 'If you are grateful, I will surely increase you in favor.' Gratitude fosters contentment, while patience builds resilience. Together, they help us navigate life's challenges, remain steadfast, and seek Allah's eternal blessings.",
    "Motivation in Islam revolves around sincere intentions and meaningful actions—both of which bring us closer to Allah. The Prophet Muhammad, peace be upon him, said: 'The best of deeds are those done consistently, even if they are small.' This highlights the importance of regular effort, balanced living, and reliance on Allah's mercy. Each step forward, no matter how small, counts.",
    "Traveling offers unique opportunities, exploring new cultures, tasting diverse cuisines, and learning from different perspectives. It broadens horizons and fosters understanding, breaking down barriers between people and nations. However, responsible tourism, considering environmental impact and respecting local traditions, is vital for sustainable exploration",
    "Technology has transformed our daily lives, changing how we work, communicate, and connect with others. From smartphones to artificial intelligence, advancements have opened new possibilities, yet challenges persist, such as privacy concerns, ethical dilemmas, and social inequalities. Balancing innovation with responsibility is essential for a better future",
    
    "Success in life comes from hard work, patience, and trust in Allah. Every challenge we face is a test, and with perseverance and faith, we can overcome any obstacle. As Allah says in the Quran, 'Indeed, with hardship comes ease' (94:6). So, never lose hope, for Allah's mercy and guidance are always near."
    
];

let previousParagraphIndex = -1;
let textToType = '';
let startTime, interval;
let correctChars = 0;
let errors = 0;
let lastScrolledLine = 0;

const textContainer = document.getElementById('textContainer');
const inputArea = document.getElementById('inputArea');
const textToTypeElement = document.getElementById('textToType');
const startButton = document.getElementById('startButton');

// Event listeners
startButton.addEventListener('click', startTest);
document.getElementById('closePopupButton').addEventListener('click', closePopup);
document.getElementById('modeToggle').addEventListener('click', toggleDarkMode);
document.getElementById('soundToggle').addEventListener('click', toggleSound);
document.getElementById('newPage').addEventListener('click', navigateToNewPage);

function startTest() {
    resetTest();

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * paragraphs.length);
    } while (randomIndex === previousParagraphIndex);
    previousParagraphIndex = randomIndex;
    textToType = paragraphs[randomIndex];

    textToTypeElement.innerHTML = '';
    for (let i = 0; i < textToType.length; i++) {
        const span = document.createElement('span');
        span.innerText = textToType[i];
        textToTypeElement.appendChild(span);
    }

    inputArea.disabled = false;
    inputArea.focus();
    inputArea.value = '';
    textContainer.classList.remove('hidden');
    document.querySelector('.stats').classList.remove('hidden');
    startButton.classList.add('hidden');
    document.getElementById('scorePopup').classList.add('hidden');

    startTime = new Date().getTime();
    correctChars = 0;
    errors = 0;

    interval = setInterval(updateTimer, 1000); // update every second
    inputArea.addEventListener('input', checkInput);
}

function resetTest() {
    clearInterval(interval); // clear any existing interval
    document.getElementById('timer').textContent = 'Time: 60s';
    document.getElementById('wpm').textContent = '';
    document.getElementById('errors').textContent = 'Errors: 0';
    document.getElementById('accuracy').textContent = 'Accuracy: 100%';
    lastScrolledLine = 0; // Reset scroll tracking
}

function updateTimer() {
    const timeElapsed = Math.floor((new Date().getTime() - startTime) / 1000);
    const remainingTime = 60 - timeElapsed;

    document.getElementById('timer').textContent = `Time: ${remainingTime}s`;

    if (remainingTime <= 0) {
        endTest(); // time is up, end the test
    }
}

function checkInput() {
    const inputText = inputArea.value;
    const characters = document.querySelectorAll('#textToType span');
    let currentErrors = 0;
    correctChars = 0;

    for (let i = 0; i < characters.length; i++) {
        const charElement = characters[i];
        const typedChar = inputText[i];

        if (typedChar == null) {
            charElement.classList.remove('correct-char', 'incorrect-char');
        } else if (typedChar === charElement.innerText) {
            charElement.classList.add('correct-char');
            charElement.classList.remove('incorrect-char');
            correctChars++;
        } else {
            charElement.classList.add('incorrect-char');
            charElement.classList.remove('correct-char');
            currentErrors++;
        }
    }

    errors = currentErrors;

    const accuracy = ((correctChars / inputText.length) * 100).toFixed(1) || 100;
    const wordsPerMinute = Math.round((correctChars / 5) / ((new Date().getTime() - startTime) / 60000)) || 0;

    document.getElementById('wpm').textContent = `WPM: ${wordsPerMinute}`;
    document.getElementById('errors').textContent = `Errors: ${errors}`;
    document.getElementById('accuracy').textContent = `Accuracy: ${accuracy}%`;

    // Smooth scrolling
    const charsPerLine = 25; // Approximate characters per line
    const linesToShow = 2;
    const currentLine = Math.floor(inputText.length / charsPerLine);

    if (currentLine > lastScrolledLine) {
        const scrollPosition = currentLine * (textContainer.clientHeight / linesToShow);
        textContainer.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
        });
        lastScrolledLine = currentLine;
    }
}

function endTest() {
    clearInterval(interval); // stop the timer
    inputArea.disabled = true;

    const timeTaken = (new Date().getTime() - startTime) / 60000;
    const finalWpm = Math.round((correctChars / 5) / timeTaken) || 0;
    const finalCharsTyped = correctChars + errors;
    const finalAccuracy = ((correctChars / finalCharsTyped) * 100).toFixed(1) || 100;

    const mark = calculateMark(finalWpm, finalCharsTyped, correctChars);
    const resultMessage = mark >= 50 ? 'Result: Pass' : 'Result: Fail';
    const suggestionMessage = mark >= 50 ? 'Good job! Keep practicing to improve your speed.' : 'You need to work on your accuracy and speed. Try again!';

    document.getElementById('finalWpm').textContent = `WPM: ${finalWpm} (Words)`;
    document.getElementById('finalCharsTyped').textContent = `Characters Typed: ${finalCharsTyped}`;
    document.getElementById('finalCorrect').textContent = `Correct Characters: ${correctChars}`;
    document.getElementById('finalErrors').textContent = `Incorrect Characters: ${errors}`;
    document.getElementById('finalAccuracy').textContent = `Accuracy: ${finalAccuracy}%`;
    document.getElementById('finalMark').textContent = `Mark: ${mark}`;
    document.getElementById('resultMessage').textContent = resultMessage;
    document.getElementById('suggestionMessage').textContent = suggestionMessage;

    const scorePopup = document.getElementById('scorePopup');
    scorePopup.classList.remove('pass', 'fail');
    scorePopup.classList.add(mark >= 50 ? 'pass' : 'fail');

    scorePopup.classList.remove('hidden');
    startButton.classList.remove('hidden');
}

function calculateMark(finalWpm, totalCharacters, correctCharacters) {
    const penalty = ((totalCharacters - correctCharacters) / 5) * 2.5;
    const score = (2.5 * finalWpm) - penalty;

    // Ensure the score is between 0 and 100
    return Math.max(0, Math.min(100, Math.round(score)));
}

function closePopup() {
    document.getElementById('scorePopup').classList.add('hidden');
    startButton.classList.remove('hidden');
    inputArea.disabled = true;
    inputArea.value = '';
    textToTypeElement.innerHTML = '';
    resetTest();
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

function toggleSound() {
    alert('Sound toggled');
}

function navigateToNewPage() {
    window.location.href = 'newpage.html';
}