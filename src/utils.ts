
export function trunc(n: number): number {
     if (Math.abs(n) >= 0.01) {
          return Math.floor(n * 100) / 100;
     }

     const afterDot = n.toString().split(".")[1]

     let count = 1
     for (let el of afterDot) {
          if (el != "0") {
               break
          }
          count++
     }

     let pow = Math.pow(10, count)
     return Math.floor(n * pow) / pow;
}