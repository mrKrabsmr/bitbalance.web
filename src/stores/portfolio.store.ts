import type { IPortfolio, PurchaseDTO } from "@/services/dto/portfolio.dto";
import { createPortfolio, deletePortfolio, getPortfolio, updatePortfolio } from "@/services/portfolio.service";
import { defineStore } from "pinia";

export const usePortfolioStore = defineStore("portfolio", {
     state: (): IPortfolio => {
          return {
               total_purchased_sum: -1,
               total_now_sum: -1,
               ROI: 0,
               cryptocurrencies: []
          }
     },
     actions: {
          async fetchData(must: boolean): Promise<boolean> {
               if (!must && this.total_now_sum != -1 && this.total_purchased_sum != -1) {
                    return true
               }

               const response = await getPortfolio()
               if (!response) {
                    this.total_purchased_sum = 0
                    this.total_now_sum = 0
                    return true
               }

               if (response.error) {
                    return false
               }
               
               
               const {total_purchased_sum, total_now_sum, ROI, cryptocurrencies} = response.data
               Object.assign(this, {total_purchased_sum, total_now_sum, ROI, cryptocurrencies})

               this.cryptocurrencies.sort((a, b) => b.portfolio_share - a.portfolio_share)
               return true
          },
          async createData(form: PurchaseDTO): Promise<boolean> {
               form.purchase_time = form.purchase_time.split("-").reverse().join(".")
               const response = await createPortfolio(form)
               if (response.error) {
                    return false
               }

               return true
          },
          async updateData(form: object, id: string): Promise<boolean> {
               form.purchase_time = form.purchase_time.split("-").reverse().join(".")
               const response = await updatePortfolio(form, id)
               if (response.error) {
                    return false
               }

               return true              
          },
          async deleteData(id: string): Promise<boolean> {
               const response = await deletePortfolio(id)
               if (response.error) {
                    return false
               }

               return true              
          }
     }
})