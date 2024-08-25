document.addEventListener('DOMContentLoaded', () => {
    const music = document.getElementById('background-music');
    const clickerImage = document.getElementById('clicker-image');
    const clickCountDisplay = document.getElementById('click-count');
    const backgroundSelect = document.getElementById('background-select');
    const buyBoosterButton = document.getElementById('buy-booster');
    const buySkinButtons = document.querySelectorAll('.buy-skin');
    const buyWallpaperButtons = document.querySelectorAll('.buy-wallpapers');
    const ownedSkinsSelect = document.getElementById('owned-skins-select');
    const energyBar = document.getElementById('energy-bar');
    const energyText = document.getElementById('energy-text');
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.getElementById('progress-bar');
    const gameContainer = document.getElementById('game-container');
    const quoteElement = document.getElementById('quote-text');
    const quoteAuthorPhotoElement = document.getElementById('quote-author-photo');
    const themeSelector = document.getElementById('theme-selector');

    const backgroundImageElement = document.createElement('div');
    backgroundImageElement.classList.add('background-image');
    document.body.appendChild(backgroundImageElement);

    const quotes = [
        { text: "\"Life is what happens while you are busy making other plans\" — John Lennon", photo: "authors/john_lennon.jpg" },
        { text: "\"I don't believe in killing whatever the reason!\" — John Lennon", photo: "authors/john_lennon.jpg" },
        { text: "\"First they ignore you, then they laugh at you, then they fight you, then you win.\" — Mahatma Gandhi", photo: "authors/Gandhi.jpg" },
        { text: "\"Character alone will have real effect on the masses.\" — Mahatma Gandhi", photo: "authors/Gandhi.jpg" },
    ];

    const getRandomQuote = () => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
    };

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.toggle('night-mode', savedTheme === 'night');
        themeSelector.value = savedTheme;
    }

    themeSelector.addEventListener('change', (event) => {
        const theme = event.target.value;
        document.body.classList.toggle('night-mode', theme === 'night');
        localStorage.setItem('theme', theme);
    });

    const tryPlayMusic = () => {
        music.volume = 0.1;
        music.play().catch(() => {
            document.addEventListener('click', tryPlayMusic, { once: true });
            document.addEventListener('keydown', tryPlayMusic, { once: true });
        });
    };

    const musicToggleButton = document.getElementById('music-toggle-button');

    let isMusicPlaying = true;

    musicToggleButton.addEventListener('click', () => {
        if (isMusicPlaying) {
            music.pause();
            musicToggleButton.textContent = '🔇';
        } else {
            music.play();
            musicToggleButton.textContent = '🔈';
        }
        isMusicPlaying = !isMusicPlaying;
    });

    loadingScreen.classList.remove('hidden');
    gameContainer.classList.add('hidden');

    const { text, photo } = getRandomQuote();
    quoteElement.textContent = text;
    quoteAuthorPhotoElement.src = photo;

    progressBar.addEventListener('animationend', () => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            gameContainer.classList.remove('hidden');
        }, 900);
    });

    let clickCount = +localStorage.getItem('clickCount') || 0;
    let clickIncrement = +localStorage.getItem('clickIncrement') || 1;
    let clickerSkin = localStorage.getItem('clickerSkin') || 'images/Ethereum.png';
    let ownedSkins = JSON.parse(localStorage.getItem('ownedSkins')) || ['images/Ethereum.png'];
    let ownedWallpapers = JSON.parse(localStorage.getItem('ownedWallpapers')) || ['wallpapers/default.jpg'];
    let boosterCost = +localStorage.getItem('boosterCost') || 200;
    let currentWallpaper = localStorage.getItem('currentWallpaper') || 'wallpapers/default.jpg';
    let energy = +localStorage.getItem('energy') || 100;

    const updateClickCountDisplay = () => {
        clickCountDisplay.textContent = `Clicks: ${clickCount}`;
        localStorage.setItem('clickCount', clickCount);
    };

    const updateEnergyDisplay = () => {
        energyBar.style.width = `${energy}%`;
        energyText.textContent = `${energy}%`;
        localStorage.setItem('energy', energy);
    };

    const updateOwnedSkinsSelect = () => {
        ownedSkinsSelect.innerHTML = ownedSkins.map(skin => 
            `<option value="${skin}">${skin.split('/').pop().split('.')[0]}</option>`
        ).join('');
        ownedSkinsSelect.value = clickerSkin;
    };

    const updateBackgroundSelect = () => {
        backgroundSelect.innerHTML = ownedWallpapers.map(wallpaper => 
            `<option value="${wallpaper}">${wallpaper.split('/').pop().split('.')[0]}</option>`
        ).join('');
        backgroundSelect.value = currentWallpaper;
    };

    const setBackground = (imageUrl) => {
        backgroundImageElement.style.backgroundImage = `url('${imageUrl}')`;
        localStorage.setItem('currentWallpaper', imageUrl);
    };

    const savedBackground = localStorage.getItem('currentWallpaper') || 'wallpapers/default.jpg';
    if (savedBackground) setBackground(savedBackground);

    backgroundSelect.addEventListener('change', () => setBackground(backgroundSelect.value));

    clickerImage.src = clickerSkin;
    updateClickCountDisplay();
    updateEnergyDisplay();
    updateOwnedSkinsSelect();
    updateBackgroundSelect();
    tryPlayMusic();

    const handleEnergyRegen = () => {
        if (energy < 100) {
            energy = Math.min(energy + 10, 100);
            updateEnergyDisplay();
        }
    };

    clickerImage.addEventListener('click', () => {
        if (energy > 0) {
            clickCount += clickIncrement;
            energy -= 1;
            updateClickCountDisplay();
            updateEnergyDisplay();
            clickerImage.classList.add('clicked');
            setTimeout(() => clickerImage.classList.remove('clicked'), 100);
        } else {
            alert('Not enough energy to click!');
        }
    });

    ownedSkinsSelect.addEventListener('change', () => {
        clickerSkin = ownedSkinsSelect.value;
        clickerImage.src = clickerSkin;
        localStorage.setItem('clickerSkin', clickerSkin);
    });

    buyBoosterButton.textContent = `Buy Booster (+1 per click) - ${boosterCost} clicks`;
    buyBoosterButton.addEventListener('click', () => {
        if (clickCount >= boosterCost) {
            clickCount -= boosterCost;
            clickIncrement += 1;
            boosterCost = Math.ceil(boosterCost * 1.8);
            updateClickCountDisplay();
            localStorage.setItem('clickIncrement', clickIncrement);
            localStorage.setItem('boosterCost', boosterCost);
            buyBoosterButton.textContent = `Buy Booster (+1 per click) - ${boosterCost} clicks`;
        } else {
            alert('Not enough clicks!');
        }
    });

    buySkinButtons.forEach(button => {
        if (ownedSkins.includes(button.dataset.skin)) {
            button.classList.add('bought');
        }

        button.addEventListener('click', () => {
            const cost = +button.dataset.cost;
            const skin = button.dataset.skin;
            if (clickCount >= cost && !ownedSkins.includes(skin)) {
                clickCount -= cost;
                ownedSkins.push(skin);
                updateOwnedSkinsSelect();
                clickerSkin = skin;
                clickerImage.src = clickerSkin;
                updateClickCountDisplay();
                localStorage.setItem('ownedSkins', JSON.stringify(ownedSkins));
                localStorage.setItem('clickerSkin', clickerSkin);
                button.classList.add('bought');
            } else if (ownedSkins.includes(skin)) {
                clickerSkin = skin;
                clickerImage.src = clickerSkin;
                localStorage.setItem('clickerSkin', clickerSkin);
            } else {
                alert('Not enough clicks!');
            }
        });
    });

    buyWallpaperButtons.forEach(button => {
        if (ownedWallpapers.includes(button.dataset.wallpaper)) {
            button.classList.add('bought');
        }

        button.addEventListener('click', () => {
            const cost = +button.dataset.cost;
            const wallpaper = button.dataset.wallpaper;
            if (clickCount >= cost && !ownedWallpapers.includes(wallpaper)) {
                clickCount -= cost;
                ownedWallpapers.push(wallpaper);
                updateBackgroundSelect();
                setBackground(wallpaper);
                updateClickCountDisplay();
                localStorage.setItem('ownedWallpapers', JSON.stringify(ownedWallpapers));
                localStorage.setItem('currentWallpaper', wallpaper);
                button.classList.add('bought');
            } else if (ownedWallpapers.includes(wallpaper)) {
                setBackground(wallpaper);
                localStorage.setItem('currentWallpaper', wallpaper);
            } else {
                alert('Not enough clicks!');
            }
        });
    });

    setInterval(handleEnergyRegen, 4000);
});
