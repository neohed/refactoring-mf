import type {Invoice} from './invoices';
import type {Plays} from './plays';
import type {TempData} from './createStatementData';
import createStatementData from './createStatementData';

function usd(aNumber: number): string {
  return new Intl.NumberFormat(
    'en-US',
    {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(aNumber)
}

function renderPlainText(data: TempData): string {
  let result = `Statement for ${data.customer}\n`;

  data.performances.forEach(perf => {
    result += `  ${perf.play.name}: ${usd(perf.amount / 100)} (${perf.audience} seats)\n`;
  })

  result += `Amount owed is ${usd(data.totalAmount / 100)}\n`;
  result += `You earned ${data.totalVolumeCredits} credits\n`;
  return result;
}

export function statement(invoice: Invoice, plays: Plays): string {
  return renderPlainText(createStatementData(invoice, plays))
}

function renderHtml(data: TempData): string {
  let result = `
<h1>Statement for ${data.customer}</h1>
<table>
<tr><th>play</th><th>seats</th><th>cost</th></tr>
`;

  data.performances.forEach(perf => {
    result += `<tr><td>${perf.play.name}</td><td>(${perf.audience} seats)</td><td>${usd(perf.amount / 100)}</td></tr>`;
  })

  result += '</table>';
  result += `<p>Amount owed is ${usd(data.totalAmount / 100)}</p>`;
  result += `<p>You earned ${data.totalVolumeCredits} credits</p>`;
  return result;
}

export function htmlStatement(invoice: Invoice, plays: Plays): string {
  return renderHtml(createStatementData(invoice, plays))
}
