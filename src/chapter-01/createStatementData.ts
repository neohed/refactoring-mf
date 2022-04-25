import {Invoice, Performance} from './invoices';
import {Play, Plays} from './plays';

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

export default function createStatementData(invoice: Invoice, plays: Plays): TempData {
  function playFor(aPerformance: Performance): Play {
    return plays[aPerformance.playID]
  }

  function amountFor(aPerformance: Performance, play: Play): number {
    let result = 0;

    switch (play.type) {
      case 'tragedy':
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case 'comedy':
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
      default:
        throw new Error(`unknown type: ${play.type}`);
    }

    return result
  }

  function volumeCreditsFor(aPerformance: Performance): number {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if (playFor(aPerformance).type === 'comedy') result += Math.floor(aPerformance.audience / 5);
    return result
  }

  function totalAmount(performances: PerformancePlus[]): number {
    let result = 0;
    performances.forEach(perf => {
      result += perf.amount;
    })
    return result
  }

  function totalVolumeCredits(performances: PerformancePlus[]): number {
    let result = 0;
    performances.forEach(perf => {
      // add volume credits
      result += perf.volumeCredits;
    })
    return result
  }

  function enrichPerformance(aPerformance: Performance): PerformancePlus {
    // A fucking hack...? or MF is a cunt!
    const play = playFor(aPerformance);
    return {
      ...aPerformance,
      play,
      amount: amountFor(aPerformance, play),
      volumeCredits: volumeCreditsFor(aPerformance),
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
