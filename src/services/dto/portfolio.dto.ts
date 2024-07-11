
export interface IPurchase {
     id: string
     price: number
     count: number
     sum: number
     commentary: string
     created_at: string
     purchase_time: string
}

export interface IPortfolioDetail {
     cryptocurrency_id: number
     cryptocurrency: string
     cryptocurrency_symbol: string
     now_price: number
     count: number
     sum: number
     percent_change_24h: number
     percent_change_30d: number
     percent_change_90d: number
     portfolio_share: number
     ROI: number
     profit: number
     purchases: IPurchase[]
}

export interface IPortfolio {
     total_purchased_sum: number
     total_now_sum: number
     ROI: number
     cryptocurrencies: IPortfolioDetail[]
}

export interface PurchaseDTO {
     cmc_cryptocurrency_id: 0
     price: number
     count: number
     purchase_time: string
     commentary: string
}

