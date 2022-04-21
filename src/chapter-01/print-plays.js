var plays = require('./plays.ts');
var invoices = require('./invoices.ts');
function statement(invoice, plays) {
    var totalAmount = 0;
    var volumeCredits = 0;
    var result = "Statement for ".concat(invoice.customer, "\n");
    var format = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD",
        minimumFractionDigits: 2 }).format;
    for (var _i = 0, _a = invoice.performances; _i < _a.length; _i++) {
        var perf = _a[_i];
        var play = plays[perf.playID];
        var thisAmount = 0;
        switch (play.type) {
            case "tragedy":
                thisAmount = 40000;
                if (perf.audience > 30) {
                    thisAmount += 1000 * (perf.audience - 30);
                }
                break;
            case "comedy":
                thisAmount = 30000;
                if (perf.audience > 20) {
                    thisAmount += 10000 + 500 * (perf.audience - 20);
                }
                thisAmount += 300 * perf.audience;
                break;
            default:
                throw new Error("unknown type: ".concat(play.type));
        }
        // add volume credits
        volumeCredits += Math.max(perf.audience - 30, 0);
        // add extra credit for every ten comedy attendees
        if ("comedy" === play.type)
            volumeCredits += Math.floor(perf.audience / 5);
        // print line for this order
        result += "  ".concat(play.name, ": ").concat(format(thisAmount / 100), " (").concat(perf.audience, " seats)\n");
        totalAmount += thisAmount;
    }
    result += "Amount owed is ".concat(format(totalAmount / 100), "\n");
    result += "You earned ".concat(volumeCredits, " credits\n");
    return result;
}
statement(invoices, plays);
