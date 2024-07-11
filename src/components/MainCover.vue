<script setup lang="ts">
import { useRoute } from 'vue-router';


const route = useRoute()
</script>

<template>
     <div class="main_cover__container overflow-x-auto shadow-md sm:rounded-lg">
          <div class="items__line">
               <div class="meta">
                    <img class="meta__crown_icon" src="../assets/crown.svg" alt="" width="20px" height="20px">
                    <div class="meta__head"><span>pro</span> анализ инвестиций</div>
               </div>
          </div> 
     </div>
</template>

<style scoped lang="scss">
     .main_cover__container {
          background: repeating-linear-gradient(-45deg, transparent, transparent 20px, rgba(255, 2555, 255, .5) 29px, rgba(255, 255, 255, .5) 30px);
          background-size: contain;
          display: flex;
          align-items: center;
          border-radius: 50px;
          &:hover {
               box-shadow: 0px 0px 20px 5px #fff;
          }
     }

     .items__line {
          display: flex;
          align-items: center;
          justify-content: space-around;
          width: 100%;
     }
     
     .meta {
          font-size: 24px;
          font-weight: 900;
          color: #06044d;
          font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
          letter-spacing: 3px;
          text-transform: uppercase;
          
          &__crown_icon {
               margin: auto;
               filter: invert(0.4) sepia(2) saturate(4) hue-rotate(1deg);
          }

          &__head {
               font-size: 16px;
               font-weight: 1000;
               margin-bottom: 3vh;
               color: #b8860b;
               border-bottom: .3vh solid;

               span {
                    font-weight: 920;
                    font-size: 18px;
               }
          }

     }

     @media (max-width: 768px) {
          .meta {
               font-size: 16px;
               letter-spacing: 1.5px;

               &__head {
                    font-size: 12px;

                    span {
                         font-size: 14px;
                    }
               }
          }
     }
</style>
