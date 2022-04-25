import {Invoice, Performance} from './invoices';
import {Play, Plays} from './plays';
import TragedyCalculator from './TragedyCalculator';
import ComedyCalculator from './ComedyCalculator';

type PerformancePlus = Performance & {
  play: Play,
  amount: number,
  volumeCredits: number,
}

export type TempData = {
  customer: string,
  performances: PerformancePlus[],
  totalAmount: number,
  totalVolumeCredits: number,
}

function createPerformanceCalculator(aPerformance: Performance, aPlay: Play) {
  switch (aPlay.type) {
    case 'tragedy':
      return new TragedyCalculator(aPerformance, aPlay);
    case 'comedy':
      return new ComedyCalculator(aPerformance, aPlay);
    default:
      throw new Error(`unknown type: ${aPlay.type}`)
  }
}

export default function createStatementData(invoice: Invoice, plays: Plays): TempData {
  function playFor(aPerformance: Performance): Play {
    return plays[aPerformance.playID]
  }

  function totalAmount(performances: PerformancePlus[]): number {
    let result = 0;
    performances.forEach(perf => {
      result += perf.amount;
    })
    return result
  }

  function totalVolumeCredits(performances: PerformancePlus[]): number {
    return performances.reduce((total, {volumeCredits}) => total + volumeCredits, 0)
  }

  function enrichPerformance(aPerformance: Performance): PerformancePlus {
    const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance));

    return {
      ...aPerformance,
      play: calculator.play,
      amount: calculator.amount,
      volumeCredits: calculator.volumeCredits,
    }
  }

  // A fucking hack...? or MF is a cunt!
  const performances = invoice.performances.map(enrichPerformance);
  return {
    performances,
    customer: invoice.customer,
    totalAmount: totalAmount(performances),
    totalVolumeCredits: totalVolumeCredits(performances),
  }
}
