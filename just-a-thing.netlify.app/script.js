const checkbox = document.getElementById('checkbox-btn');
const captchaBox = document.getElementById('step-checkbox');
const captchaModal = document.getElementById('captcha-modal');
const grid = document.getElementById('grid');
const verifyBtn = document.getElementById('verify-btn');
const headerTitle = document.getElementById('instruction-text');
const modalHeader = document.getElementById('modal-header');
const choiceScreen = document.getElementById('choice-screen');
const choiceCards = document.querySelectorAll('.choice-card');
const datePlanText = document.getElementById('date-plan-text');

// State
let currentRound = 0; // 0 = idle, 2 = valentine
let selectedTiles = new Set();
const VALENTINE_IMAGES = [
    'assets/valentine-1.png', 'assets/valentine-2.png', 'assets/valentine-3.png',
    'assets/valentine-4.png', 'assets/valentine-5.png', 'assets/valentine-6.png',
    'assets/valentine-7.png', 'assets/valentine-8.png', 'assets/valentine-9.png'
];

// 1. Click Checkbox
checkbox.addEventListener('click', () => {
    if (currentRound !== 0) return;

    // Fake loading
    checkbox.classList.add('loading');
    setTimeout(() => {
        captchaBox.classList.add('hidden');
        captchaModal.classList.remove('hidden');
        startRound2();
    }, 1000); // 1.5s fake load
});

// 2. Valentine round (The Reveal)
function startRound2() {
    currentRound = 2;
    captchaModal.classList.add('valentine-mode');

    headerTitle.innerText = "your valentine";
    setupGrid(VALENTINE_IMAGES, false); // false = use array
}

function setupGrid(source, isSliced) {
    grid.innerHTML = '';
    selectedTiles.clear();
    verifyBtn.disabled = true;

    for (let i = 0; i < 9; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');

        if (isSliced && typeof source === 'string') {
            // SINGLE IMAGE SLICED (Traffic Lights)
            tile.style.backgroundImage = `url('${source}')`;

            // Calculate offsets for 3x3 grid
            const col = i % 3;
            const row = Math.floor(i / 3);
            tile.style.backgroundPosition = `${col * 50}% ${row * 50}%`;
            tile.style.backgroundSize = '300% 300%';
        } else if (!isSliced && Array.isArray(source)) {
            // NINE SEPARATE IMAGES (Valentine)
            tile.style.backgroundImage = `url('${source[i]}')`;
            tile.style.backgroundSize = 'cover';
            tile.style.backgroundPosition = 'center';
        }

        tile.dataset.index = i;
        tile.addEventListener('click', () => toggleTile(tile));
        grid.appendChild(tile);
    }
}

function toggleTile(tile) {
    const index = tile.dataset.index;
    if (selectedTiles.has(index)) {
        selectedTiles.delete(index);
        tile.classList.remove('selected');
    } else {
        selectedTiles.add(index);
        tile.classList.add('selected');
    }

    // Enable verify if at least 1 is selected
    verifyBtn.disabled = selectedTiles.size === 0;

}

verifyBtn.addEventListener('click', () => {
    if (currentRound === 2) {
        captchaModal.classList.add('hidden');
        document.body.classList.add('choice-mode');
        choiceScreen.classList.remove('hidden');
    }
});

// Simple Confetti effect
function launchConfetti() {
    const colors = ['#ff6b81', '#ff4757', '#ffffff'];
    for (let i = 0; i < 100; i++) {
        const conf = document.createElement('div');
        conf.style.position = 'fixed';
        conf.style.left = Math.random() * 100 + 'vw';
        conf.style.top = '-10vh';
        conf.style.width = '10px';
        conf.style.height = '10px';
        conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        conf.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
        document.body.appendChild(conf);
    }

    // Add dynamic style for animation
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes fall {
            to { transform: translateY(110vh) rotate(720deg); }
        }
    `;
    document.head.appendChild(style);
}


choiceCards.forEach((card) => {
    card.addEventListener('click', () => {
        const pickedChoice = card.querySelector('h2')?.innerText || 'our date';
        datePlanText.innerText = `It's a date! See you for ${pickedChoice} at 8:00 PM.`;

        choiceScreen.classList.add('hidden');
        document.body.classList.remove('choice-mode');
        document.getElementById('success-screen').classList.remove('hidden');
        launchConfetti();
    });
});
