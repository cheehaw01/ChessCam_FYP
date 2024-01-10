const CountDownTimer = require("./CountDownTimer");
const fs = require("fs");
const jsonReader = require("../file-system/json_reader");
const filepath = "temp/live_timer.json";

class CountDownTimerPair {
  #timerWhite = new CountDownTimer("20", "00");
  #timerBlack = new CountDownTimer("20", "00");

  constructor() {}

  initiateTimer() {
    this.#timerWhite.startInterval();
    this.#timerBlack.startInterval();

    setInterval(() => {
      jsonReader(filepath, (err, data) => {
        if (err) {
          console.log(err);
        }
        // console.log(data);
        switch (data.turn) {
          case 4:
          case 0:
            // 0 or 4 - stop both white & black
            this.#timerWhite.stopTimer();
            this.#timerBlack.stopTimer();
            break;
          case 1:
            // 1 - stop white, start black
            this.#timerWhite.stopTimer();
            this.#timerBlack.startTimer();
            break;
          case 2:
            // 2 - start white, stop black
            this.#timerWhite.startTimer();
            this.#timerBlack.stopTimer();
            break;
          case 3:
            // 3 - reset timer with value
            this.#timerWhite.resetTimer(data.white[0], data.white[1]);
            this.#timerBlack.resetTimer(data.black[0], data.black[1]);
            break;
        }
      });

      if (this.#timerWhite.getStart()) {
        jsonReader(filepath, (err, data) => {
          data.white = [
            this.#timerWhite.getMinute(),
            this.#timerWhite.getSecond(),
          ];
          // Write the updated timer status data to the specified file
          fs.writeFile(filepath, JSON.stringify(data, null, 2), (err) => {
            // Handle write errors
            if (err) {
              console.log(err);
            }
          });
        });
      }

      if (this.#timerBlack.getStart()) {
        jsonReader(filepath, (err, data) => {
          data.black = [
            this.#timerBlack.getMinute(),
            this.#timerBlack.getSecond(),
          ];
          // Write the updated timer status data to the specified file
          fs.writeFile(filepath, JSON.stringify(data, null, 2), (err) => {
            // Handle write errors
            if (err) {
              console.log(err);
            }
          });
        });
      }
    }, 1000);
  }
}

module.exports = CountDownTimerPair;
