<script setup lang="ts">
     import { Chart } from 'chart.js';
     import PortfolioChart from './PortfolioChart.vue';
     import { computed, ref } from 'vue';
     import { trunc } from '@/utils';

     const props = defineProps({
          portfolio: Object
     })

     const roi = computed(() => {
          let roi = props.portfolio?.ROI
          return roi ? trunc(roi) : 0
     })

     const total_sum = computed(() => {
          let total_now_sum = props.portfolio?.total_now_sum
          return total_now_sum ? trunc(total_now_sum) : 0
     })

     const chartVals = computed(() => {
          try {
               const vals = new Map()

               const crypts = props.portfolio?.cryptocurrencies.toSorted((a, b) => b.portfolio_share - a.portfolio_share)
               for (let crypt of crypts.slice(0, 4)) {
                    vals.set(crypt.cryptocurrency_symbol + ` (${trunc(crypt.portfolio_share * 100)}%)`, trunc(crypt.sum))
               }

               let other_share = 0
               let other_sum = 0
               for (let crypt of crypts.slice(4)) {
                    other_share += crypt.portfolio_share
                    other_sum += crypt.sum
               }

               if (crypts.length > 4) {
                    vals.set("Остальное" + ` (${(other_share * 100).toFixed(2)}%)`, trunc(other_sum))
               }

               return Object.fromEntries(vals)
          } catch (error) {
               console.log(error)
               return {}
          }
     })
</script>

<template>
     <div class="portfolio_cover__container overflow-x-auto shadow-md sm:rounded-lg">
          <div class="content">
               <div class="vals">
                    <div class="roi__value"
                         :class="{ 'text-green-500': props.portfolio?.ROI > 0, 'text-red-500': props.portfolio?.ROI < 0 }">
                         <span v-if="props.portfolio?.ROI > 0">+</span>
                         {{ roi }}%
                    </div>
                    <div class="total_now_sum">
                         {{ total_sum }}$
                    </div>

               </div>
               <div class="chart">
                    <portfolio-chart :chart-vals="chartVals"></portfolio-chart>
               </div>
          </div>
          <div class="header">портфель</div>
     </div>
</template>

<style scoped lang="scss">
     .portfolio_cover__container {
          display: flex;
          justify-content: space-between
     }

     .header {
          z-index: 20;
          text-align: center;
          background-color: #06044d;
          color: #fff;
          height: 100%;
          writing-mode: vertical-lr;
          text-orientation: upright;
          font-size: 22px;
          font-weight: 900;
          position: sticky;
          top: 0;
          max-width: 20%;
     }

     .content {
          text-align: center;
          width: 100%;
     }

     .vals {
          display: flex;
          align-items: center;
          justify-content: space-around;
          flex-direction: column;
          box-shadow: 0px 2px 15px 1px rgba(0, 0, 0, .5);
          padding: 3% 0;
          height: 40%;
          background-color: #fafafa;
          position: sticky;
          top: 0;
          z-index: 20;
     }

     .total_now_sum {
          font-size: 32px;
     }

     .chart {
          margin: 2%;
          height: 55%;
     }

     @media (max-width: 768px) {
          .header {
               font-size: 16px;
          }

          .vals {
               height: 30%;
          }

          .chart {
               height: 65%;
          }

          .roi__value {
               font-size: 14px;
          }

          .total_now_sum {
               font-size: 24px;
          }

          .few__crypts {
               font-size: 14px;
          }
     }
</style>