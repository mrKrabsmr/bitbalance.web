<script setup lang="ts">
     import { prefixAPI } from '@/services';
     import { trunc } from '@/utils';
     import { ref, toRef } from 'vue';

     const screenW = ref(window.innerWidth)

     const props = defineProps({
          onlyTop24h: Boolean,
          crypts: Array,
     })

     const sortState = ref({
          byName: 0,
          byPrice: 0,
          byPC24h: 0,
          byPC30d: 0,
          byPC90d: 0,
     })



     function tableSort(e: Event) {
          const sortBy = e.target.getAttribute("sortBy")

          if (!sortBy) return

          const _st = sortState.value

          if (sortBy == "name") {
               if ([0, 1].includes(_st.byName)) {
                    _st.byName++
                    props.crypts?.sort((a, b) => a.name.localeCompare(b.name))
               } else {
                    _st.byName--
                    props.crypts?.sort((a, b) => b.name.localeCompare(a.name))
               }
          } else if (sortBy === "price") {
               if ([0, 1].includes(_st.byPrice)) {
                    _st.byPrice++
                    props.crypts?.sort((a, b) => a.quote.USD.price - b.quote.USD.price)
               } else {
                    _st.byPrice--
                    props.crypts?.sort((a, b) => b.quote.USD.price - a.quote.USD.price)
               }
          } else if (sortBy === "pc24h") {
               if ([0, 1].includes(_st.byPC24h)) {
                    _st.byPC24h++
                    props.crypts?.sort((a, b) => a.quote.USD.percent_change_24h - b.quote.USD.percent_change_24h)
               } else {
                    _st.byPC24h--
                    props.crypts?.sort((a, b) => b.quote.USD.percent_change_24h - a.quote.USD.percent_change_24h)
               }
          } else if (sortBy === "pc30d") {
               if ([0, 1].includes(_st.byPC30d)) {
                    _st.byPC30d++
                    props.crypts?.sort((a, b) => a.quote.USD.percent_change_30d - b.quote.USD.percent_change_30d)
               } else {
                    _st.byPC30d--
                    props.crypts?.sort((a, b) => b.quote.USD.percent_change_30d - a.quote.USD.percent_change_30d)
               }
          } else if (sortBy === "pc90d") {
               if ([0, 1].includes(_st.byPC90d)) {
                    _st.byPC90d++
                    props.crypts?.sort((a, b) => a.quote.USD.percent_change_90d - b.quote.USD.percent_change_90d)
               } else {
                    _st.byPC90d--
                    props.crypts?.sort((a, b) => b.quote.USD.percent_change_90d - a.quote.USD.percent_change_90d)
               }
          }
     }
</script>

<template>
     <div class="crypts__container overflow-x-auto shadow-md sm:rounded-lg">
          <table class="crypts w-full text-sm text-left y-400">
               <thead class="crypts__thead text-xs text-gray-700 uppercase dark:text-gray-400">
                    <tr>
                         <th @click="tableSort($event)" sortBy="name" scope="col" class="px-6 py-3">Name</th>
                         <th @click="tableSort($event)" sortBy="price" scope="col" class="px-6 py-3">Price</th>
                         <th @click="tableSort($event)" sortBy="pc24h" scope="col" class="px-6 py-3">Change 24h</th>
                         <th @click="tableSort($event)" sortBy="pc30d" scope="col" class="px-6 py-3"
                              v-if="!props.onlyTop24h">Change 30d</th>
                         <th @click="tableSort($event)" sortBy="pc90d" scope="col" class="px-6 py-3"
                              v-if="!props.onlyTop24h">Change 90d</th>
                    </tr>
               </thead>
               <tbody>
                    <tr class="crypt odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                         v-for="crypt in props.crypts" :key="crypt.id">
                         <td scope="row" class="crypt-meta px-6 py-4 text-gray-900 dark:text-white">
                              <img class="crypt-icon"
                                   :src="prefixAPI + `static/logos/${crypt.symbol.toLowerCase()}.png`"
                                   :alt="crypt.symbol" :width="screenW > 768 ? '20px' : '15px'"
                                   :height="screenW > 768 ? '20px' : '15px'">
                              {{ crypt.name }} <span>({{
                                   crypt.symbol }})</span>
                         </td>
                         <td class="px-6 py-4">{{ trunc(crypt.quote.USD.price) }}$</td>
                         <td v-for="percent_change in !props.onlyTop24h ? [crypt.quote.USD.percent_change_24h, crypt.quote.USD.percent_change_30d, crypt.quote.USD.percent_change_90d] : [crypt.quote.USD.percent_change_24h]"
                              :key="percent_change" class="px-6 py-4"
                              :class="{ 'text-red-500': percent_change < 0, 'text-green-500': percent_change > 0 }">
                              {{ trunc(percent_change) }}%
                         </td>
                    </tr>
               </tbody>
          </table>
     </div>
</template>

<style scoped lang="scss">
     .crypt-meta {
          display: flex;
          align-items: center;
     }

     .crypt-icon {
          margin-right: 5px;
     }

     td {
          font-size: 16px;

          @media (max-width: 768px) {
               font-size: 12px;
               padding: 5px 3px;
          }
     }

     th {
          cursor: s-resize;

          @media (max-width: 768px) {
               font-size: 11px;
               padding: 4px 2px;
          }

     }
</style>