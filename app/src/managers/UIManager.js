import { config } from "../config/config.js";

class UIManager {
  constructor() {
    this.loadingScreen = document.getElementById(config.ui.loadingScreenId);
    this.countdownElement = document.getElementById(config.ui.countdownElementId);
    this.countdownContainer = document.getElementById(config.ui.countdownContainerId);
    this.messageElement = document.getElementById(config.ui.messageElementId);
    this.messageContainer = document.getElementById(config.ui.messageContainerId);
    this.scoreElement = document.getElementById(config.ui.scoreElementId);
    this.startingGameScreen = document.getElementById(config.ui.startingGameScreenId);
    this.startScreen = document.getElementById(config.ui.startScreenId);
    this.instructionsScreen = document.getElementById(config.ui.instructionsScreenId);
    this.gameContainer = document.getElementById(config.ui.gameContainerId);

    this.startButton = document.getElementById(config.ui.startButtonId);
    this.instructionsButton = document.getElementById(config.ui.instructionsButtonId);
    this.backButton = document.getElementById(config.ui.backButtonId);

    this.initEventListeners();
  }

  initEventListeners() {
    const hoverSound = new Audio(config.sounds.hover);
    const clickSound = new Audio(config.sounds.clickButton);

    this.startButton.addEventListener('mouseenter', () => hoverSound.play());
    this.instructionsButton.addEventListener('mouseenter', () => hoverSound.play());
    this.startButton.addEventListener('click', () => clickSound.play());
    this.instructionsButton.addEventListener('click', () => hoverSound.play());
    this.backButton.addEventListener('mouseenter', () => hoverSound.play());
    this.backButton.addEventListener('click', () => hoverSound.play());

    this.instructionsButton.addEventListener('click', () => this.showInstructionsScreen());
    this.backButton.addEventListener('click', () => this.hideInstructionsScreen());
  }

  showLoadingScreen() {
    this.loadingScreen.style.display = "flex";
  }

  hideLoadingScreen() {
    this.loadingScreen.style.display = "none";
  }

  showStartingGameScreen() {
    this.startingGameScreen.style.display = "flex";
  }

  hideStartingGameScreen() {
    this.startingGameScreen.style.display = "none";
  }

  showInstructionsScreen() {
    this.startScreen.style.display = "none";
    this.instructionsScreen.style.display = "flex";
  }

  hideInstructionsScreen() {
    this.instructionsScreen.style.display = "none";
    this.startScreen.style.display = "flex";
  }

  showMessage(message, color = "#00FF00", duration = 2000) {
    clearTimeout(this.messageTimeout);

    this.messageElement.textContent = message;
    this.messageContainer.style.display = "block";
    this.messageContainer.style.color = color;
    this.messageContainer.classList.add("blink");

    this.messageTimeout = setTimeout(() => {
      this.messageContainer.style.display = "none";
      this.messageContainer.classList.remove("blink");
    }, duration);
  }

  updateScore(score) {
    this.scoreElement.textContent = score;
  }

  startCountdown(callback) {
    let countdown = 3;

    const countdownInterval = setInterval(() => {
      this.countdownContainer.style.display = "block";
      if (countdown > 0) {
        this.countdownElement.textContent = countdown;
        countdown--;
        this.playBeepSound();
      } else {
        this.countdownElement.textContent = "GO!";
        this.playBeepSound();
        clearInterval(countdownInterval);
        setTimeout(() => {
          this.countdownContainer.style.display = "none";
          callback();
        }, 1000);
      }
    }, 1000);
  }

  playBeepSound() {
    const beepSound = new Audio(config.sounds.beep);
    beepSound.play();
  }
}

export { UIManager };