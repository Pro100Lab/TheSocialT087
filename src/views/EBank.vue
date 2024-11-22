<template>
    <v-card color="#eff3f3" class="pa-4 overflow-y-auto">

        <template v-if="clientId">
        <v-card-title>
            Е-банк | Выгодее с нами, чем без нас
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
                <v-row v-for="account of accounts" :key="`bank-account-${account.id}`">
                    <v-col xl="6" sm="12">
                        <v-card variant="flat" rounded="xl">
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
                <v-card variant="flat" rounded="xl">
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
                        <v-card variant="flat" rounded="xl">
                            <v-card-subtitle class="pt-4">{{loan.name}}</v-card-subtitle>
                            <v-card-title class="py-0">{{loan.pay_rest}} ₽</v-card-title>
                            <v-card-subtitle>Следующий платёж <b>{{loan.monthly_pay}} ₽</b> <br/>{{loan.get_date}} </v-card-subtitle>
                            <v-card-actions>
                                <v-btn
                                        v-for="action of loan.actions"
                                        :key="`bank-loan-action-${loan.id}-${action.id}`"
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
                <v-card variant="flat" rounded="xl">
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
                <v-row class="overflow-x-auto">
                    <v-col v-for="service of services" :key="`service-${service.id}`" xl="2" sm="12">
                        <v-card rounded="xl">
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
                <v-card variant="flat" rounded="xl">
                    <v-card-subtitle class="py-3">Нет доступных предложений</v-card-subtitle>
                </v-card>
            </template>
        </div>
        </template>
        <template v-else>
            <bank-auth style="height: 100%" :auth-callback="auth" :bank-id="'e_bank'" :bank-name="'Е-Банк'" :is-mobile="isMobile"></bank-auth>
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
    import {getURL} from "@/utils/settings";
    import axios from 'axios';
    import BankAuth from "@/components/BankAuth";
    import GetCreditModal from "@/components/GetCreditModal";

    export default {
        name: "EBank",
        components: {GetCreditModal, BankAuth},
        props: {
            isMobile: Boolean
        },
        data: () => {
            return {
                inIncorrectLinkProcess: false,
                inGetCreditProcess: false,
                clientId: null,
                openedProducts: ['Счета', 'Услуги'],
                loans: [],
                accounts: [
                    {
                        id: 0,
                        name: 'Денежки',
                        balance: 24035632,
                        valute: 'rub',
                        cards: [{
                            id: 0,
                            number: '1111 1111 1111 1111'
                        }],
                        actions: [{
                            id: 0,
                            name: 'Перевести',
                            link: 'transfer'
                        }, {
                            id: 1,
                            name: 'Пополнить телефон',
                            link: 'payphone'
                        }, {
                            id: 1,
                            name: 'История операций',
                            link: 'payment-history'
                        }]
                    }
                ],
                services: [{
                    id: 0,
                    title: 'Взять кредит',
                    subtitle: 'Под выгодные 200% годовых',
                    actions: [{
                        id: 0,
                        name: 'Оформить',
                        link: 'loan'
                    }]
                }, {
                    id: 1,
                    title: 'Открыть вклад',
                    subtitle: 'Под выгодные 2% годовых',
                    actions: [{
                        id: 0,
                        name: 'Оформить',
                        link: 'deposit'
                    }]
                }, {
                    id: 1,
                    title: 'Оформить страхование',
                    subtitle: 'Если решили прыгнуть с парашютом',
                    actions: [{
                        id: 0,
                        name: 'Оформить',
                        link: 'insurance'
                    }]
                }]
            }
        },
        mounted() {
        },
        watch: {
            clientId(newValue, oldValue) {
                if( newValue && newValue !== oldValue ) {
                    this.updateAccounts();
                    this.updateLoans();
                }
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
                      credit_summ: credit_sum,
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
              this.clientId = clientId
            },
            processLink(link) {
                if( link === 'loan' ) {
                    this.inGetCreditProcess = true;
                } else {
                    this.inIncorrectLinkProcess = true;
                }
            },
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

</style>
