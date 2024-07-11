export interface CryptAll {
     status: {
          total_count: number
     }
     data: {
          id: number
          name: string
          symbol: string
          quote: {
               USD: {
                    price: number
                    percent_change_24h: number
                    percent_change_30d: number
                    percent_change_90d: number
               }
               BTC: {
                    price: number
                    percent_change_24h: number
                    percent_change_30d: number
                    percent_change_90d: number
               }
               RUB: {
                    price: number
                    percent_change_24h: number
                    percent_change_30d: number
                    percent_change_90d: number
               }
          }
     }
}