class TokenScheduler {
  constructor({ baseDelay = 50, variance = 20, maxStep = 5 } = {}) {
    this.baseDelay = baseDelay;
    this.variance = variance;
    this.maxStep = maxStep;
    this.currentDelay = baseDelay;
    this.minDelay = Math.max(0, baseDelay - variance);
    this.maxDelay = baseDelay + variance;
  }

  nextDelay() {
    const step = (Math.random() * 2 - 1) * this.maxStep;
    this.currentDelay += step;
    if (this.currentDelay < this.minDelay) {
      this.currentDelay = this.minDelay;
    } else if (this.currentDelay > this.maxDelay) {
      this.currentDelay = this.maxDelay;
    }
    return this.currentDelay;
  }

  schedule(tokens, callback) {
    let index = 0;
    const send = () => {
      if (index >= tokens.length) {
        return;
      }
      callback(tokens[index], index);
      index += 1;
      setTimeout(send, this.nextDelay());
    };
    send();
  }
}

module.exports = { TokenScheduler };
