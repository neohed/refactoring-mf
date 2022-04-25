import {statement, htmlStatement} from './chapter-01/print-plays';
import invoice_data from './chapter-01/invoices';
import play_data from './chapter-01/plays';

invoice_data.forEach(
  invoice => {
    console.log(statement(invoice, play_data));
    console.log(htmlStatement(invoice, play_data));
  }
);
