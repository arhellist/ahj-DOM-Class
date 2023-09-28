const sell = document.querySelectorAll(".sell");
const hitValue = document.querySelector(".hit-value");
const missValue = document.querySelector(".miss-value");
const gamepad = document.querySelector(".gamepad");

class Rampage {
  constructor(
    sell,
    hitValue,
    missValue,
    gamepad,
    range,
    hit = 0,
    miss = 0,
    timeout = null
  ) {
    this.sell = sell;
    this.hitValue = hitValue;
    this.missValue = missValue;
    this.gamepad = gamepad;
    this.range = range;
    this.hit = hit;
    this.miss = miss;
    this.timeout = timeout;
  }
  setGamePad() {
    // установка игрового поля
    let quadro = this.range * this.range;
    for (let i = 0; i < quadro; i++) {
      this.gamepad.insertAdjacentHTML(
        "afterbegin",
        `<div class="sell number-${i}"></div>`
      );
    }
    this.gamepad.setAttribute(
      "style",
      `grid-template-columns: repeat(${this.range}, 100px)`
    );
    this.sell = document.querySelectorAll(".sell");
    console.log("Игровое полу установлено");
  }
  runGame() {
    // Запуск игры
    let getRandom = () => Math.floor(Math.random() * this.sell.length);
    let lastTarget = getRandom();
    const appendActiveByIndex = (index) =>
      this.sell[index].classList.add("activeSell");
    const removeActiveByIndex = (index) =>
      this.sell[index].classList.remove("activeSell");

    const intervalHandler = () => {
      removeActiveByIndex(lastTarget);
      lastTarget = getRandom();
      appendActiveByIndex(lastTarget);
      this.timeout = setTimeout(intervalHandler, 1000);
    };
    this.onEventListener(clickSell);
    this.timeout = setTimeout(intervalHandler, 1000);
    this.resetHit();
    this.resetMiss();
  }
  stopGame() {
    //остановка игры
    clearTimeout(this.timeout);
    this.offEventListener(clickSell);
  }
  addHit() {
    // условия попадвний
    this.hit += 1;
    this.hitValue.textContent = this.hit;
    if (this.hit >= 10) {
      this.stopGame();
      this.sell.forEach((item) => {
        item.classList.add("winSell");
      });
      setTimeout(() => {
        this.sell.forEach((item) => {
          item.classList.remove("winSell");
        });
        this.runGame();
      }, 3000);
    }
  }
  addMiss() {
    // условия промахов
    this.miss += 1;
    this.missValue.textContent = this.miss;
    if (this.miss >= 10) {
      this.stopGame();
      this.sell.forEach((item) => {
        item.classList.add("looseSell");
      });
      setTimeout(() => {
        this.sell.forEach((item) => {
          item.classList.remove("looseSell");
        });
        this.runGame();
      }, 3000);
    }
  }
  resetHit(hit) {
    // сброс попаданий
    this.hit = 0;
    this.hitValue.textContent = this.hit;
  }
  resetMiss(miss) {
    //сброс промахов
    this.miss = 0;
    this.missValue.textContent = this.miss;
  }
  onEventListener(func) {
    // установка обработчика
    this.gamepad.addEventListener("click", func);
  }
  offEventListener(func) {
    // снятие обработчика
    this.gamepad.removeEventListener("click", func);
  }
}

const rampage = new Rampage(sell, hitValue, missValue, gamepad, 4); // 4- размерность игрового поля
rampage.setGamePad(); // установка игрового поля

function clickSell(event) {
  let targetCell = event.target;
  if (targetCell.closest(".activeSell") !== null) {
    console.log("GOOD!");
    targetCell.classList.remove("activeSell");
    targetCell.classList.add("bloodSell");
    setTimeout(() => {
      targetCell.classList.remove("bloodSell");
    }, 150);
    rampage.addHit();
  } else {
    targetCell.classList.add("missSell");
    setTimeout(() => {
      targetCell.classList.remove("missSell");
    }, 150);
    console.log("BAD!");
    rampage.addMiss();
  }
}
rampage.runGame(); // Запуск игры - старт setInterval
