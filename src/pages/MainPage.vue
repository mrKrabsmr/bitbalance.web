<script setup lang="ts">
     import CryptList from "../components/CryptList.vue";
     import MainCover from "../components/MainCover.vue";
     import PortfolioCover from "../components/PortfolioCover.vue";
     import Common from "../components/Common.vue";
     import { useCryptStore } from "@/stores/crypts.store";
     import { onBeforeMount, ref } from "vue";
     import { usePortfolioStore } from "@/stores/portfolio.store";
     import { storeToRefs } from "pinia";

     const screenW = ref(window.innerWidth)

     const showUp = ref(true)

     const cryptStore = useCryptStore()
     const portfolioStore = usePortfolioStore()

     const crypts = ref([])
     const crypts24hUp = ref([])
     const crypts24hDown = ref([])

     const portfolio = ref({})

     async function loadData() {
          let ok = await cryptStore.fetchData()
          if (ok) {
               crypts.value = cryptStore.crypts
               crypts24hUp.value = cryptStore.crypts.toSorted((a, b) => b.quote.USD.percent_change_24h - a.quote.USD.percent_change_24h).slice(0, 10)
               crypts24hDown.value = cryptStore.crypts.toSorted((a, b) => a.quote.USD.percent_change_24h - b.quote.USD.percent_change_24h).slice(0, 10)
          }

          ok = await portfolioStore.fetchData(false)
          if (ok) {
               portfolio.value = storeToRefs(portfolioStore)
          }

     }

     onBeforeMount(() => {
          loadData()
     })

</script>

<template>
     <div class="main_page__container">
          <!-- <main-cover class="main__block"></main-cover> -->
          <div class="common__block">
               <div class="b one">
                    <div class="btn" v-if="screenW < 768">
                         <router-link to="/portfolio">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                                   stroke="currentColor" class="btn__icon size-6">
                                   <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                              </svg>
                         </router-link>
                    </div>
                    <router-link disabled :to="screenW > 768 ? '/portfolio' : ''"><portfolio-cover
                              class="portfolio__block b" :portfolio="portfolio"></portfolio-cover></router-link>
               </div>
               <div class="b two">
                    <button class="btn" :class="{ 'bg-red-600': !showUp, 'bg-green-600': showUp }"
                         @click="showUp = !showUp">
                         ТОП 24 часа
                    </button>
                    <crypt-list class="crypt__block" :onlyTop24h="true"
                         :crypts="showUp ? crypts24hUp : crypts24hDown"></crypt-list>
               </div>
          </div>
          <crypt-list class="crypt__block" :crypts="crypts"></crypt-list>
     </div>
</template>

<style scoped lang="scss">
     .main__block {
          height: 10.2vh;
     }

     .common__block {
          height: 43.8vh;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 2vh 0;

          .btn {
               width: 100%;
               font-size: 20px;
               border: 2px solid;
               padding: 3px;
               border-radius: 7px;
               color: #fff;

               &__icon {
                    margin: .2vh auto;
               }
          }

          .crypt__block {
               max-height: 38vh;
          }

     }

     .portfolio__block {
          height: 42vh;
     }

     .crypt__block {
          max-height: 29vh;
     }

     .b {
          width: 39vw;
     }

     @media (max-width: 768px) {
          .main__block {
               margin-top: 1.3vh;
               max-height: 8vh;
          }

          .common__block {
               height: 74vh;
               flex-direction: column;

               .crypt__block {
                    max-height: 20vh;
               }

               .btn {
                    font-size: 16px;
               }
          }

          .b {
               width: 100%;
               max-height: 60vh;
               margin-bottom: 1vh;
          }

          .one {
               .btn {
                    background-color: #06044d;
                    margin-bottom: 1.1vh;
               }
          }
     }

</style>