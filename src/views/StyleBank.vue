<template>
    <v-card color="indigo-darken-3" class="pa-4 overflow-y-auto">

        <template v-if="clientId">
            <v-card-title>
                Стиль-банк | Раздаём стиль и кредиты
            </v-card-title>

            <v-divider></v-divider>
            <div class="main-display__product-wrap">
                <v-card-subtitle class="my-4">Счета
                    <v-icon
                            v-on:click="openCloseProduct('Счета')"
                            :icon="isCashOpened ? 'mdi-chevron-down' : 'mdi-chevron-right'"
                    >
                    </v-icon>
                </v-card-subtitle>
                <template v-if="accounts.length > 0 && isCashOpened">
                    <v-row v-for="account of accounts" :key="`bank-account-${account.id || account.id}`">
                        <v-col xl="6" sm="12">
                            <v-card color="indigo" variant="flat" rounded="xl">
                                <v-card-subtitle class="pt-4">{{account.name}}</v-card-subtitle>
                                <v-card-title class="py-0">{{Math.floor(account.balance / 100).toString().match(/\d{1,3}/g).join(' ')}},{{account.balance % 100}} {{account.valute}}</v-card-title>
                                <v-card-actions>
                                    <v-btn
                                            v-for="action of account.actions"
                                            :key="`bank-account-action-${account.id}-${action.id}`"
                                            v-on:click="processLink(action.link)"
                                            rounded="xl"
                                    >
                                        {{action.name}}
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-col>
                    </v-row>
                </template>
                <template v-else-if="isCashOpened">
                    <v-card color="indigo" variant="flat" rounded="xl">
                        <v-card-subtitle class="py-3">Нет счетов</v-card-subtitle>
                    </v-card>
                </template>
            </div>

            <div class="main-display__product-wrap">
                <v-card-subtitle class="my-4">Кредиты
                    <v-icon
                            :icon="isLoansOpened ? 'mdi-chevron-down' : 'mdi-chevron-right'"
                            v-on:click="openCloseProduct('Кредиты')"
                    >
                    </v-icon>
                </v-card-subtitle>

                <template v-if="loans.length > 0 && isLoansOpened">
                    <v-row v-for="loan of loans" :key="`bank-loan-${loan.id}`">
                        <v-col xl="6" sm="12">
                            <v-card color="indigo" variant="flat" rounded="xl">
                                <v-card-subtitle class="pt-4">{{loan.name}}</v-card-subtitle>
                                <v-card-title class="py-0">{{Math.floor(loan.credit_sum / 100).toString().match(/\d{1,3}/g).join(' ')}},{{loan.credit_sum % 100}} ₽</v-card-title>
                                <v-card-subtitle>Следующий платёж <b>{{loan.monthly_pay}} ₽</b> <br/>{{loan.get_date}} </v-card-subtitle>
                                <v-card-actions>
                                    <v-btn
                                            v-for="action of loan.actions"
                                            :key="`bank-loan-action-${loan ? (loan.id) : 0}-${action.id}`"
                                            v-on:click="processLink(action.link)"
                                            rounded="xl"
                                    >
                                        {{action.name}}
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-col>
                    </v-row>
                </template>
                <template v-else-if="isLoansOpened">
                    <v-card color="indigo" variant="flat" rounded="xl">
                        <v-card-subtitle class="py-3">Нет кредитных продуктов</v-card-subtitle>
                    </v-card>
                </template>
            </div>
            <div class="main-display__services-wrap">
                <v-card-subtitle class="my-4">Услуги
                    <v-icon
                            :icon="isServicesOpened ? 'mdi-chevron-down' : 'mdi-chevron-right'"
                            v-on:click="openCloseProduct('Услуги')"
                    >

                    </v-icon>
                </v-card-subtitle>
                <template v-if="services.length > 0 && isServicesOpened">
                    <v-row class="overflow-x-auto flex-nowrap">
                        <v-col v-for="service of services" :key="`service-${service.id}`" xl="4" sm="12">
                            <v-card color="indigo" rounded="xl">
                                <v-card-title>
                                    {{service.title}}
                                </v-card-title>
                                <v-card-subtitle>
                                    {{service.subtitle}}
                                </v-card-subtitle>
                                <v-card-actions v-if="service.actions.length && service.actions.length > 0">
                                    <v-btn
                                            v-for="action of service.actions"
                                            :key="`service-action-${service.id}-${action.id}`"
                                            :block="service.actions.length === 1"
                                            v-on:click="processLink(action.link)"
                                            rounded="xl"
                                    >
                                        {{action.name}}
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-col>
                    </v-row>
                </template>
                <template v-else-if="isServicesOpened">
                    <v-card color="indigo" variant="flat" rounded="xl">
                        <v-card-subtitle class="py-3">Нет доступных предложений</v-card-subtitle>
                    </v-card>
                </template>
            </div>
        </template>
        <template v-else>
            <bank-auth style="height: 100%"
                       :auth-callback="auth"
                       :bank-id="'style_bank'"
                       :bank-name="'Стиль-банк'"
                       :is-mobile="isMobile"></bank-auth>
        </template>


        <v-overlay v-model="inGetCreditProcess" scroll-strategy="block" class="align-center justify-center">
            <get-credit-modal style="max-height: 80vh; overflow-y: auto" :is-mobile="isMobile" :take-loan="takeLoan"></get-credit-modal>
        </v-overlay>

        <v-overlay v-model="inIncorrectLinkProcess" scroll-strategy="block" class="align-center justify-center">
            <v-card rounded="xl">
                <v-card-title>К сожалению, в данный момент услуга недоступна</v-card-title>
                <v-card-actions><v-btn rounded="xl" v-on:click="inIncorrectLinkProcess = false">Грустно :(</v-btn></v-card-actions>
            </v-card>
        </v-overlay>
    </v-card>
</template>

<script>
    import axios from "axios";
    import {getURL} from "@/utils/settings";
    import BankAuth from "@/components/BankAuth";
    import GetCreditModal from "@/components/GetCreditModal";

    export default {
        name: "StyleBank",
        components: {GetCreditModal, BankAuth},
        props: {
          isMobile: Boolean
        },
        data: () => {
            return {
                inIncorrectLinkProcess: false,
                inGetCreditProcess: false,
                clientId: null,
                openedProducts: ['Счета', 'Кредиты', 'Услуги'],
                loans: [{
                    id: 0,
                    name: 'Автокредит',
                    get_date: (new Date(new Date().setDate(25))).toLocaleDateString(),
                    monthly_pay: 25000,
                    valute: 'rub',
                    credit_sum: 88005553535,
                    actions: [{
                        id: 0,
                        name: 'Внести платёж',
                        link: 'make-pay'
                    }, {
                        id: 1,
                        name: 'Погасить досрочно',
                        link: 'repay-early'
                    }]
                }],
                accounts: [
                    {
                        id: 0,
                        name: 'Счет для погашения кредита',
                        balance: 10,
                        valute: 'rub',
                        cards: [{
                            id: 0,
                            number: '1111 1111 1111 1111'
                        }],
                        actions: [{
                            id: 0,
                            name: 'Оплатить',
                            link: 'pay'
                        }, {
                            id: 1,
                            name: 'Перевести',
                            link: 'transfer'
                        }]
                    }
                ],
                services: [{
                    id: 0,
                    title: 'Взять кредит',
                    subtitle: 'Под выгодные 64% годовых',
                    actions: [{
                        id: 0,
                        name: 'Оформить',
                        link: 'loan'
                    }]
                }, {
                    id: 1,
                    title: 'Открыть вклад',
                    subtitle: 'Под выгодные 0.5% годовых',
                    actions: [{
                        id: 0,
                        name: 'Оформить',
                        link: 'deposit'
                    }]
                }, {
                    id: 2,
                    title: 'The S T Y L E',
                    subtitle: 'Бонусная программа. Бесплатно, если вы тратите больше 10 тысяч в месяц',
                    actions: [{
                        id: 0,
                        name: 'Подключить',
                        link: 'stilsibo'
                    }]
                }, {
                    id: 3,
                    title: 'Оформить ипотеку',
                    subtitle: 'Оформите ипотеку бесплатно, без регистрации и смс',
                    actions: [{
                        id: 0,
                        name: 'Оформить',
                        link: 'insurance'
                    }]
                }]
            }
        },
        methods: {
            updateAccounts() {
                axios.get(getURL(`e_bank/accounts`)).then(res => {
                    this.accounts = res.data.filter(o => {return o.holder === this.clientId});
                    this.accounts.forEach(account => {
                        let offset = 0;
                        account['name'] = `Счет ${account.valute} ${offset++}`
                        account['actions'] = [{
                            id: 0,
                            name: 'Оплатить',
                            link: 'pay'
                        }, {
                            id: 1,
                            name: 'Перевести',
                            link: 'transfer'
                        }]
                    })
                }).catch(err => {
                    console.log(err)
                });
            },
            updateLoans() {
                axios.get(getURL('e_bank/loans')).then(res => {
                    this.loans = res.data.filter(o => {return o.borrower === this.clientId});
                    this.loans.forEach(loan => {
                        let offset = 0;
                        loan['name'] = `Кредит-${offset++}`
                        loan['actions'] = [{
                            id: 0,
                            name: 'Внести платёж',
                            link: 'make-pay'
                        }, {
                            id: 1,
                            name: 'Погасить досрочно',
                            link: 'repay-early'
                        }]
                    })
                }).catch(err => {
                    console.log(err)
                });
            },
            takeLoan(credit_sum, monthly_pay, date, repayment_date, documents) {
                this.inGetCreditProcess = false;
                axios.post(getURL('e_bank/loans'), {
                    borrower: this.clientId,
                    credit_credit_sum: credit_sum,
                    monthly_pay: monthly_pay,
                    pay_rest: credit_sum,
                    get_date: date,
                    repayment_date: repayment_date,
                    documents: documents
                }).then(() => {
                    this.updateLoans();
                }).catch(err => {console.log(err)})
            },
            auth(clientId) {
               this.clientId = clientId;
            },
            processLink(link) {
                if( link === 'loan' ) {
                    this.inGetCreditProcess = true;
                } else {
                    this.inIncorrectLinkProcess = true;
                }            },
            isOpened (product) {
                return this.openedProducts.indexOf(product) !== -1;
            },
            openCloseProduct(product) {
                if( this.isOpened(product) )
                    this.openedProducts.splice(this.openedProducts.indexOf(product), 1)
                else
                    this.openedProducts.push(product)
            }
        },
        mounted() {

        },
        watch: {
          clientId(newValue, oldValue) {
              if( newValue && newValue !== oldValue ) {
                  axios.get(getURL(`style_bank/accounts`)).then(res => {

                      this.accounts = res.data.filter(o => {return o.holder === this.clientId});
                      this.accounts.forEach(account => {
                          let offset = 0;
                          account['name'] = `Счет ${account.valute} ${offset++}`
                          account['actions'] = [{
                              id: 0,
                              name: 'Оплатить',
                              link: 'pay'
                          }, {
                              id: 1,
                              name: 'Перевести',
                              link: 'transfer'
                          }]
                      })
                  }).catch(err => {
                      console.log(err)
                  });
                  axios.get(getURL('style_bank/loans')).then(res => {
                      this.loans = res.data.filter(o => {return o.borrower === this.clientId});

                      this.loans.forEach(loan => {
                          let offset = 0;
                          loan['name'] = `Кредит-${offset++}`
                          loan['actions'] = {
                              id: 0,
                              name: 'Внести платёж',
                              link: 'make-pay'
                          }, {
                              id: 1,
                              name: 'Погасить досрочно',
                              link: 'repay-early'
                          }
                      })
                  }).catch(err => {
                      console.log(err)
                  });
              }
          }
        },
        computed: {
            isCashOpened: function() {
                return this.isOpened('Счета');
            },
            isLoansOpened: function() {
                return this.isOpened('Кредиты');
            },
            isServicesOpened: function() {
                return this.isOpened('Услуги');
            }
        }
    }
</script>

<style scoped>
    /* width */
    ::-webkit-scrollbar {
        width: 5px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background: #ffffff;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background:  #033353;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #033353;
    }
</style>
