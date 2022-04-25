import {Performance} from './invoices';
import {Play} from './plays';

export default class PerformanceCalculator {
  public performance: Performance;

  public play: Play;

  constructor(aPerformance, aPlay) {
    this.performance = aPerformance
    this.play = aPlay;
  }

  get amount(): number {
    throw new Error('subclass responsibility');
  }

  get volumeCredits() {
    return Math.max(this.performance.audience - 30, 0);
  }
}
