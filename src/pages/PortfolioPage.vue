<script setup lang="ts">
     import { prefixAPI } from '@/services';
     import type { IPortfolioDetail, PurchaseDTO } from '@/services/dto/portfolio.dto';
     import { useCryptStore } from '@/stores/crypts.store';
     import { usePortfolioStore } from '@/stores/portfolio.store';
     import { useUserStore } from '@/stores/user.store';
     import { trunc } from '@/utils';
     import { storeToRefs } from 'pinia';
     import { computed, onBeforeMount, ref } from 'vue';

     const screenW = ref(window.innerWidth)

     const userStore = useUserStore()
     const portfolioStore = usePortfolioStore()
     const portfolio = storeToRefs(portfolioStore)

     const cryptStore = useCryptStore()
     const crypts = ref([])

     const showAddingForm = ref(false)
     const showDeletingForm = ref(false)

     const addingForm = ref<PurchaseDTO>({
          cmc_cryptocurrency_id: 0,
          price: 0,
          count: 0,
          purchase_time: "",
          commentary: ""
     })
     const addingFormCMCName = ref("")

     const deletingID = ref("")

     const disableAddingButton = computed(() => {
          return addingForm.value.cmc_cryptocurrency_id === 0
               || addingForm.value.price <= 0 || addingForm.value.count <= 0
               || addingForm.value.purchase_time === ""
     })

     const cancelAdding = () => {
          showAddingForm.value = false
          addingFormCMCName.value = ""
          addingForm.value.cmc_cryptocurrency_id = 0
          addingForm.value.price = 0
          addingForm.value.count = 0
          addingForm.value.purchase_time = ""
          addingForm.value.commentary = ""
     }

     const inputCmcName = () => {
          let cmcID = 0
          let cryptPrice = 0

          const cmcSymbol = addingFormCMCName.value.split("(")[1].split(")")[0]

          for (let crypt of crypts.value) {
               if (crypt.symbol === cmcSymbol) {
                    cmcID = crypt.id
                    cryptPrice = trunc(crypt.quote.USD.price)
                    break
               }
          }

          if (cmcID === 0) {
               return
          }

          addingForm.value.cmc_cryptocurrency_id = cmcID
          addingForm.value.price = cryptPrice
          disableAddingButton.value = false
     }

     const addPurchase = async () => {
          await beforeDoPurchase()
          const ok = await portfolioStore.createData(addingForm.value)
          if (ok) {
               showAddingForm.value = false
               disableAddingButton.value = true
               cancelAdding()
               portfolioStore.fetchData(true)
          }
     }

     const updatePurchase = async (obj: object) => {
          try {
               await beforeDoPurchase()
               const ok = await portfolioStore.updateData(obj, obj.id)
               if (ok) {
                    portfolioStore.fetchData(true)
               }
               obj.error = ""
          } catch (error) {
               obj.error = "проверьте корректность заполненных данных"
          }
     }

     const deletePurchase = async () => {
          await beforeDoPurchase()
          const ok = await portfolioStore.deleteData(deletingID.value)
          if (ok) {
               showDeletingForm.value = false
               if (portfolio.cryptocurrencies.value.length === 1) {
                    window.location.reload()
                    return
               }
               portfolioStore.fetchData(true)
          }
     }

     const beforeDoPurchase = async () => {
          const authed = await userStore.fetchUser()
          if (!authed) {
               window.location.href = "/login"
          }
     }


     async function loadData() {
          await portfolioStore.fetchData(false)
          await cryptStore.fetchData()

          crypts.value = cryptStore.crypts.toSorted((a, b) => a.symbol.localeCompare(b.symbol))
     }

     onBeforeMount(() => {
          loadData()
     })

     const dragging = ref({
          draggedItem: {},

          dragStart(event: Event, item: IPortfolioDetail) {
               this.draggedItem = item
               event.dataTransfer.setData("el", item)
          },

          dragOver(event: Event) {
               event.preventDefault();
               event.dataTransfer.dropEffect = "move"
          },

          drop(event: Event, index: number) {
               event.preventDefault();

               const list = [...portfolio.cryptocurrencies.value]
               const draggedIndex = list.indexOf(this.draggedItem);
               list.splice(draggedIndex, 1);
               list.splice(index, 0, this.draggedItem);
               portfolio.cryptocurrencies.value = list;
               this.draggedItem = {};
          }
     })
</script>

<template>
     <div class="portfolio_page__container">
          <div class="empty_portfolio" v-if="portfolio.cryptocurrencies.value.length === 0">
               <div class="empty_portfolio__label">У вас в портфеле пусто, добавьте свою первую криптовалюту!</div>
               <div class="btn animate-pulse" v-if="!showAddingForm">
                    <button @click="showAddingForm = true">-->нажми<-- </button>
               </div>
          </div>
          <div class="portfolio" v-else>
               <div class="portfolio__header">
                    <div class="total_sum">
                         {{ trunc(portfolio.total_now_sum.value) }}$
                    </div>
                    <div class="header-line">
                         <div class="count_crypt">
                              <span class="header-line__label">Кол-во активов:</span> <br>
                              <span>{{ portfolio.cryptocurrencies.value.length }}</span>
                         </div>
                         <div class="total_profit">
                              <span class="header-line__label">Прибыль/Убыток:</span> <br>
                              <span
                                   :class="{ 'text-red-500': portfolio.total_now_sum.value - portfolio.total_purchased_sum.value < 0, 'text-green-500': portfolio.total_now_sum.value - portfolio.total_purchased_sum.value > 0 }">
                                   <span
                                        v-if="portfolio.total_now_sum.value - portfolio.total_purchased_sum.value > 0">+</span>{{
                                             trunc(portfolio.total_now_sum.value
                                                  - portfolio.total_purchased_sum.value) }}$
                              </span>
                         </div>
                         <div class="total_roi">
                              <span class="header-line__label">ROI:</span> <br>
                              <span
                                   :class="{ 'text-red-500': portfolio.ROI.value < 0, 'text-green-500': portfolio.ROI.value > 0 }">
                                   <span
                                        v-if="portfolio.total_now_sum.value - portfolio.total_purchased_sum.value > 0">+</span>{{
                                             trunc(portfolio.ROI.value)
                                        }}%
                              </span>
                         </div>
                    </div>
               </div>
               <div class="portfolio__content overflow-x-auto shadow-md sm:rounded-lg">
                    <div class="add_purchase" title="добавить покупку" @click="showAddingForm = true">
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                              :class="{ 'size-8': screenW > 768, 'size-6': screenW < 768 }">
                              <path fill-rule="evenodd"
                                   d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                                   clip-rule="evenodd" />
                         </svg>
                    </div>
                    <div class="w-full text-sm text-left y-400">
                         <div class="element" v-for="(element, index) in portfolio.cryptocurrencies.value"
                              :key="element.cryptocurrency_id" draggable="true"
                              @dragstart="dragging.dragStart($event, element)" @dragover="dragging.dragOver($event)"
                              @drop="dragging.drop($event, index)">
                              <div class="element__rowable" @click="element.show = !Boolean(element.show)">
                                   <div class="e px-6 py-4">
                                        <img class="crypt-icon"
                                             :src="prefixAPI + `static/logos/${element.cryptocurrency_symbol.toLowerCase()}.png`"
                                             :alt="element.cryptocurrency_symbol"
                                             :width="screenW > 768 ? '20px' : '15px'"
                                             :height="screenW > 768 ? '20px' : '15px'">
                                        {{ element.cryptocurrency }} <span class="label">{{
                                             element.cryptocurrency_symbol
                                        }}</span>
                                        <div class="label">цена: {{ trunc(element.now_price) }}$</div>
                                   </div>
                                   <div class="e px-6 py-4">
                                        {{ trunc(element.sum) }}$
                                        <div class="label">кол-во: {{ element.count }}</div>
                                   </div>
                                   <div class="e px-6 py-4">
                                        <div class="share">{{ trunc(element.portfolio_share * 100) }}%</div>
                                        <progress class="progr" max="100"
                                             :value="element.portfolio_share * 100"></progress>
                                   </div>
                                   <div class="e px-6 py-4 "
                                        :class="{ 'text-red-500': element.ROI < 0, 'text-green-500': element.ROI > 0 }">
                                        <span v-if="element.ROI > 0">+</span>{{ trunc(element.ROI) }}%
                                   </div>
                                   <div class="e px-6 py-4 "
                                        :class="{ 'text-red-500': element.profit < 0, 'text-green-500': element.profit > 0 }">
                                        <span v-if="element.ROI > 0">+</span>{{ trunc(element.profit) }}$
                                   </div>
                              </div>
                              <div class="element__additional" v-if="element.show">
                                   <div class="e" v-for="purchase in element.purchases" :key="purchase.id">
                                        <div class="e__content">
                                             Покупка: от
                                             <input class="input_update" type="string" v-model="purchase.purchase_time"
                                                  @input="purchase.changed = true">
                                             на сумму
                                             {{ trunc(purchase.count * purchase.price) }}$
                                             (<input class="input_update" type="number" v-model="purchase.count"
                                                  @input="purchase.changed = true">
                                             шт.
                                             по <input class="input_update" type="number" v-model="purchase.price"
                                                  @input="purchase.changed = true">$). <br>
                                             Комменатрий: <br>
                                             <textarea class="textarea_update" type="string"
                                                  v-model="purchase.commentary" @input="purchase.changed = true">
                                             </textarea>
                                             <div class="upd_error" v-if="purchase.error">{{ purchase.error }}</div>
                                        </div>
                                        <div class="e__delete" title="Удалить">
                                             <button @click="showDeletingForm = true; deletingID = purchase.id">
                                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                       viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                                       class="size-4">
                                                       <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M6 18 18 6M6 6l12 12" />
                                                  </svg>
                                             </button>
                                        </div>
                                        <div class="e__save" v-if="purchase.changed" title="Сохранить">
                                             <button @click="updatePurchase(purchase)">
                                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                       viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                                       class="size-6">
                                                       <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="m4.5 12.75 6 6 9-13.5" />
                                                  </svg>
                                             </button>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>

               </div>
          </div>
          <div class="modal-overlay" v-if="showAddingForm" @click="showAddingForm = false">
               <div class="formable adding_form" @click.stop>
                    <div class="formable__label">
                         Форма добавления покупки
                    </div>
                    <div class="inputs">
                         <div class="input">
                              <div class="input__label">
                                   Выберите криптовалюту
                              </div>
                              <input list="crypts" type="text" placeholder="поиск" v-model="addingFormCMCName"
                                   @input="inputCmcName">
                              <datalist id="crypts">
                                   <option :value="crypt.name + ` (${crypt.symbol})`" v-for="crypt in crypts"
                                        :key="crypt.id"></option>
                              </datalist>
                         </div>
                         <div class="input">
                              <div class="input__label">
                                   Цена покупки ($)
                              </div>
                              <input type="number" min="0" v-model="addingForm.price">
                         </div>
                         <div class="input">
                              <div class="input__label">
                                   Количество
                              </div>
                              <input type="number" min="0" v-model="addingForm.count">
                         </div>
                         <div class="input">
                              <div class="input__label">
                                   Дата покупки
                              </div>
                              <input type="date" v-model="addingForm.purchase_time">
                         </div>
                         <div class="input">
                              <div class="input__label">
                                   Комментарий
                              </div>
                              <textarea type="text" v-model="addingForm.commentary"></textarea>
                         </div>
                    </div>
                    <div class="buttons">
                         <button class="btn_close" @click="cancelAdding">Отменить</button>
                         <button class="btn_ok" @click="addPurchase" :disabled="disableAddingButton"
                              :class="{ 'cursor-not-allowed': disableAddingButton, 'bg-gray-400': disableAddingButton && screenW < 768, 'bg-[#06044d]': !disableAddingButton && screenW < 768 }">OK</button>
                    </div>
               </div>
          </div>

          <div class="modal-overlay" v-if="showDeletingForm" @click="showDeletingForm = false">
               <div class="formable deleting_form" @click.stop>
                    <div class="formable__label">Подтвердить удаление</div>
                    <div class="buttons">
                         <button class="btn_close" @click="showDeletingForm = false; deletingID = ''">Отменить</button>
                         <button class="btn_ok" @click="deletePurchase">OK</button>
                    </div>
               </div>
          </div>
     </div>
</template>

<style scoped lang="scss">
     .portfolio_page__container {
          height: 100%;
     }

     .empty_portfolio {
          position: absolute;
          top: 10%;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 20px;

          .btn {
               font-weight: 700;
          }
     }

     .portfolio__header {

          .total_sum {
               right: 0;
               left: 0;
               top: 3vh;
               position: absolute;
               text-align: center;
               font-size: 28px;
               text-shadow: 0px 1px 1px;
               font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
          }

          .header-line {
               position: absolute;
               top: 10vh;
               width: 80%;
               left: 10%;
               display: flex;
               justify-content: space-between;
               align-items: center;
               padding: 0 3vw;
               text-align: center;
               font-weight: 600;

               .total_profit {
                    position: absolute;
                    left: 50%;
                    transform: translate(-50%, 0);
               }
          }


     }

     .portfolio__content {
          position: absolute;
          top: 20%;
          left: 10%;
          width: 80%;

          .add_purchase {
               right: 0;
               text-align: center;
               font-size: 12px;
               position: absolute;
               margin: 3px;
               font-weight: 900;
               color: #06044d;
               opacity: .7;
               cursor: cell;

               svg {
                    text-shadow: 4px 3px 5px;
               }
          }
     }

     .element {
          background-color: #fff;
          font-size: 16px;

          &__rowable {
               cursor: pointer;
               margin-bottom: .5vh;
               box-shadow: 1px 1px 3px 0 rgba(0, 0, 0, .3);
               display: flex;
               justify-content: space-around;
               align-items: center;
               border-radius: 5px;
          }

          .e {
               flex: 1;
               text-align: center;

               &__content {
                    width: 90%;
                    margin: 0 auto;
               }
          }

          &__additional {
               padding: 1vh 0;

               .e {
                    position: relative;
                    width: 80%;

                    margin: 2vh auto;
                    padding-bottom: 1vh;
                    border-bottom: 1px dashed;
                    font-size: 14px;
                    opacity: .7;

                    &__save {
                         position: absolute;
                         bottom: 0;
                         right: 0;
                         font-size: 14px;
                         width: 20px;
                    }

                    &__delete {
                         position: absolute;
                         top: 0;
                         right: 0;
                    }

                    &__content {
                         width: 80%;
                    }
               }
          }
     }

     .crypt-icon {
          margin: 0 auto;
     }

     .label {
          font-size: 12px;
          opacity: .3;
     }

     .input_update {
          padding: 0 .3vw;
          outline: none;
          text-align: center;
          border-bottom: 1px solid;
          width: 130px;
     }

     .textarea_update {
          width: 40%;
          padding: 5px 15px;
          border-radius: 5px;
          opacity: .7;
          box-shadow: inset 1px 1px 4px rgba(0, 0, 0, .5);
     }

     progress {
          width: 90%;
          max-width: 10vw;
          box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, .5);
          margin-top: .4vh;
     }

     progress::-webkit-progress-bar {
          background-color: #fff;
     }

     progress::-webkit-progress-value {
          background-color: #06044d;
     }

     .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.4);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10;
     }

     .formable {
          background-color: #fff;
          border-radius: 15px;
          height: 500px;
          width: 550px;
          box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, .5);
          z-index: 20;

          &__label {
               font-weight: 900;
               font-size: 18px;
               text-align: center;
               margin: 20px 0;
          }

          .inputs {
               text-align: center;

               .input {
                    margin: 30px 10px 30px 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    input {
                         text-align: center;
                         opacity: .7;
                         box-shadow: inset 2px 1.5px 3px 2px rgba(0, 0, 0, .5);
                    }

                    .dollar {
                         position: relative;
                         left: 20%;
                         top: 0;
                         z-index: 20;
                         opacity: .5;
                    }

                    textarea {
                         resize: none;
                         width: 300px;
                         height: 110px;
                         padding: 7px;
                         box-shadow: inset 2px 1.5px 3px 2px rgba(0, 0, 0, .5);
                         opacity: .7;
                    }

                    datalist {
                         background-color: khaki;
                    }
               }
          }

          .buttons {
               text-align: center;
               display: flex;
               align-items: center;
               justify-content: space-around;

               button {
                    height: 45px;
                    margin-top: 10px;
                    border: none;
                    border-radius: 8px;
                    padding: 3px 20px;
                    transition: background-color .7s linear;

                    @media (min-width: 768px) {
                         &:hover {
                              color: #fff;
                         }
                    }
               }

               @media (min-width: 768px) {
                    .btn_close {
                         &:hover {
                              background-color: #d10404;
                         }
                    }

                    .btn_ok {
                         &:hover {
                              background-color: #06044d;
                         }
                    }
               }
          }
     }

     .upd_error {
          color: red;
          text-transform: lowercase;
          margin-top: 5px;
     }

     .deleting_form {
          height: 150px;
          width: 400px;
     }

     @media (max-width: 768px) {
          .portfolio__content {
               left: 5%;
               width: 90%;
          }

          .header-line {
               font-size: 14px;

               &__label {
                    font-size: 10px;
               }
          }

          .element {
               box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, .3);
               font-size: 11px;
               border-radius: 10px;

               &__rowable {
                    padding: 0 2px;
                    border-radius: 10px;

                    .e {
                         padding: 6px 2px;
                    }
               }

               &__additional {
                    .e {
                         font-size: 10px;
                         margin: 0 auto;
                    }
               }
          }

          .label {
               font-size: 8px;
          }

          .textarea_update {
               width: 70%;
               padding: 3px 10px;
          }

          .adding_form {
               height: 420px;
               width: 350px;
               font-size: 12px;

               .inputs {
                    .input {
                         margin: 20px 5px 15px 10px;

                         textarea {
                              width: 230px;
                         }
                    }
               }

               .buttons {
                    button {
                         color: #fff;
                    }

                    .btn_close {
                         background-color: #d10404;
                    }

                    // .btn_ok {
                    //      background-color: #06044d;
                    // }

               }
          }

          .deleting_form {
               height: 150px;
               width: 350px;
          }

          .upd_error {
               font-size: 9px;
          }
     }
</style>