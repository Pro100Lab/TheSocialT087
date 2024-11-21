<template>
    <v-card color="indigo-darken-3" class="pa-4 overflow-y-auto">

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
                <v-row v-for="account of accounts" :key="`bank-account-${account.idx}`">
                    <v-col xl="6" sm="12">
                        <v-card color="indigo" variant="flat" rounded="xl">
                            <v-card-subtitle class="pt-4">{{account.name}}</v-card-subtitle>
                            <v-card-title class="py-0">{{Math.floor(account.amount / 100).toString().match(/\d{1,3}/g).join(' ')}},{{account.amount % 100}} ₽</v-card-title>
                            <v-card-actions>
                                <v-btn
                                        v-for="action of account.actions"
                                        :key="`bank-account-action-${account.idx}-${action.idx}`"
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
                <v-row v-for="loan of loans" :key="`bank-loan-${loan.idx}`">
                    <v-col xl="6" sm="12">
                        <v-card color="indigo" variant="flat" rounded="xl">
                            <v-card-subtitle class="pt-4">{{loan.name}}</v-card-subtitle>
                            <v-card-title class="py-0">{{Math.floor(loan.amount / 100).toString().match(/\d{1,3}/g).join(' ')}},{{loan.amount % 100}} ₽</v-card-title>
                            <v-card-subtitle>Следующий платёж <b>{{loan.nextPay.amount}} ₽</b> <br/>{{loan.nextPay.date}} </v-card-subtitle>
                            <v-card-actions>
                                <v-btn
                                        v-for="action of loan.actions"
                                        :key="`bank-loan-action-${loan.idx}-${action.idx}`"
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
                    <v-col v-for="service of services" :key="`service-${service.idx}`" xl="4" sm="12">
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
                                        :key="`service-action-${service.idx}-${action.idx}`"
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

    </v-card>
</template>

<script>
    import axios from "axios";
    import {getURL} from "@/utils/settings";

    export default {
        name: "StyleBank",
        data: () => {
            return {
                openedProducts: ['Счета', 'Кредиты', 'Услуги'],
                loans: [{
                    idx: 0,
                    name: 'Автокредит',
                    nextPay: {
                        date: (new Date(new Date().setDate(25))).toLocaleDateString(),
                        amount: 25000
                    },
                    amount: 88005553535,
                    actions: [{
                        idx: 0,
                        name: 'Внести платёж',
                        link: 'make-pay'
                    }, {
                        idx: 1,
                        name: 'Погасить досрочно',
                        link: 'repay-early'
                    }]
                }],
                accounts: [
                    {
                        idx: 0,
                        name: 'Счет для погашения кредита',
                        amount: 10,
                        currency: 'rub',
                        cards: [{
                            idx: 0,
                            number: '1111 1111 1111 1111'
                        }],
                        actions: [{
                            idx: 0,
                            name: 'Оплатить',
                            link: 'pay'
                        }, {
                            idx: 1,
                            name: 'Перевести',
                            link: 'transfer'
                        }]
                    }
                ],
                services: [{
                    idx: 0,
                    title: 'Взять кредит',
                    subtitle: 'Под выгодные 64% годовых',
                    actions: [{
                        idx: 0,
                        name: 'Оформить',
                        link: 'loan'
                    }]
                }, {
                    idx: 1,
                    title: 'Открыть вклад',
                    subtitle: 'Под выгодные 0.5% годовых',
                    actions: [{
                        idx: 0,
                        name: 'Оформить',
                        link: 'deposit'
                    }]
                }, {
                    idx: 2,
                    title: 'The S T Y L E',
                    subtitle: 'Бонусная программа. Бесплатно, если вы тратите больше 10 тысяч в месяц',
                    actions: [{
                        idx: 0,
                        name: 'Подключить',
                        link: 'stilsibo'
                    }]
                }, {
                    idx: 3,
                    title: 'Оформить ипотеку',
                    subtitle: 'Оформите ипотеку бесплатно, без регистрации и смс',
                    actions: [{
                        idx: 0,
                        name: 'Оформить',
                        link: 'insurance'
                    }]
                }]
            }
        },
        methods: {
            processLink(link) {
                link;
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
        mounted() {
            axios.get(getURL('style_bank/accounts')).then(res => {
                this.accounts = res.data;
            }).catch(err => {
                console.log(err)
            });
            axios.get(getURL('style_bank/loans')).then(res => {
                this.loans = res.data;
            }).catch(err => {
                console.log(err)
            });
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
