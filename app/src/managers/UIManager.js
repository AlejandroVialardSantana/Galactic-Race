// managers/UIManager.js
import { uiConfig } from "../config/uiConfig.js";

class UIManager {
  constructor() {
    this.loadingScreen = document.getElementById(uiConfig.loadingScreenId);
    this.countdownElement = document.getElementById(uiConfig.countdownElementId);
    this.countdownContainer = document.getElementById(uiConfig.countdownContainerId);
    this.messageElement = document.getElementById(uiConfig.messageElementId);
    this.messageContainer = document.getElementById(uiConfig.messageContainerId);
    this.scoreElement = document.getElementById(uiConfig.scoreElementId);
    this.startingGameScreen = document.getElementById(uiConfig.startingGameScreenId);
    this.startScreen = document.getElementById(uiConfig.startScreenId);
    this.gameContainer = document.getElementById(uiConfig.gameContainerId);

    this.startButton = document.getElementById(uiConfig.startButtonId);
    this.instructionsButton = document.getElementById(uiConfig.instructionsButtonId);

    this.initEventListeners();
  }

  initEventListeners() {
    const hoverSound = new Audio('../sounds/hover.mp3');
    const clickSound = new Audio('../sounds/click-button.mp3');

    this.startButton.addEventListener('mouseenter', () => hoverSound.play());
    this.instructionsButton.addEventListener('mouseenter', () => hoverSound.play());
    this.startButton.addEventListener('click', () => clickSound.play());
    this.instructionsButton.addEventListener('click', () => clickSound.play());
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
    const beepSound = new Audio('../sounds/beep.mp3');
    beepSound.play();
  }
}

export { UIManager };
