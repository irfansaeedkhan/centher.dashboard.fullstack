import bigDecimal from "js-big-decimal";

export function normalizeValue(x: any): string {
  if (Math.abs(x) < 1.0) {
    let e = parseInt(x.toString().split("e-")[1]);
    if (e) {
      x = new bigDecimal(x);
      const multiplier = new bigDecimal(Math.pow(10, e - 1));
      x = x.multiply(multiplier);
      x = x.getValue();
      x = "0." + new Array(e).join("0") + x.toString().substring(2);
    }
  } else {
    let e = parseInt(x.toString().split("+")[1]);
    if (e > 20) {
      e -= 20;
      x = new bigDecimal(x);
      const multiplier = new bigDecimal(Math.pow(10, e - 1));
      x = x.divide(multiplier);
      x = x.getValue();
      x += new Array(e + 1).join("0");
    }
  }
  return x;
}
