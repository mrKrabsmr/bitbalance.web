import { cryptocurrencies } from "@/services/crypts.service";
import { defineStore } from "pinia";

export const useCryptStore = defineStore("crypt", {
     state: () => {
          return {
               total: 0,
               crypts: []
          }
     },
     actions: {
          async fetchData(): Promise<boolean> {
               if (this.total != 0 && this.crypts.length != 0) {
                    return true
               }

               const response = await cryptocurrencies()

               if (response.error) {
                    return false
               }

               this.total = response.data.status.total_count 
               this.crypts = response.data.data
               return true
          }
     }
})