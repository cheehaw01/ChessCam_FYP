class CountDownTimer {
  #defaultMinute = "20";
  #defaultSecond = "00";
  #minute;
  #second;
  #start;
  #deadline;

  constructor(minute = this.#defaultMinute, second = this.#defaultSecond) {
    this.#minute = minute;
    this.#second = second;
    this.#start = false;
    this.#deadline = new Date();
  }

  getMinute() {
    return this.#minute;
  }

  getSecond() {
    return this.#second;
  }

  getStart() {
    return this.#start;
  }

  setMinute(newMinute) {
    this.#minute = newMinute;
  }

  setSecond(newSecond) {
    this.#second = newSecond;
  }

  // function - start the timer
  startTimer() {
    this.#deadline = new Date();
    this.#start = true;
  }

  // function - stop the timer
  stopTimer() {
    this.#start = false;
  }

  // function - reset the timer
  resetTimer(newMinute = this.#defaultMinute, newSecond = this.#defaultSecond) {
    this.stopTimer();
    this.setMinute(newMinute);
    this.setSecond(newSecond);
  }

  // function - to calculate the time passed
  getRemainingTime(deadline) {
    const totalMinus = Date.parse(deadline) - Date.parse(new Date());
    const total =
      (parseInt(this.#minute, 10) * 60 + parseInt(this.#second, 10)) * 1000 +
      totalMinus;
    const newMinute = Math.floor((total / 1000 / 60) % 60);
    const newSecond = Math.floor((total / 1000) % 60);
    return { newMinute, newSecond };
  }

  startInterval() {
    const interval = setInterval(() => {
      if (this.#start) {
        // find and set values for remaining time
        let { newMinute, newSecond } = this.getRemainingTime(this.#deadline);
        if (newMinute < 0 && newSecond < 0) {
          this.stopTimer();
          console.log("stop");
        } else {
          this.setMinute(newMinute > 9 ? "" + newMinute : "0" + newMinute);
          this.setSecond(newSecond > 9 ? "" + newSecond : "0" + newSecond);
        }
      }
    }, 1000);
  }
}

module.exports = CountDownTimer;
