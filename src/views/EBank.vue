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
                <v-row v-for="account of accounts" :key="`bank-account-${account.idx}`">
                    <v-col xl="6" sm="12">
                        <v-card variant="flat" rounded="xl">
                            <v-card-subtitle class="pt-4">{{account.name}}</v-card-subtitle>
                            <v-card-title class="py-0">{{Math.floor(account.balance / 100).toString().match(/\d{1,3}/g).join(' ')}},{{account.balance % 100}} ₽</v-card-title>
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
                <v-row v-for="loan of loans" :key="`bank-loan-${loan.idx}`">
                    <v-col xl="6" sm="12">
                        <v-card variant="flat" rounded="xl">
                            <v-card-subtitle class="pt-4">{{loan.name}}</v-card-subtitle>
                            <v-card-title class="py-0">{{loan.amount}} ₽</v-card-title>
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
                    <v-col v-for="service of services" :key="`service-${service.idx}`" xl="2" sm="12">
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
                <v-card variant="flat" rounded="xl">
                    <v-card-subtitle class="py-3">Нет доступных предложений</v-card-subtitle>
                </v-card>
            </template>
        </div>
        </template>
        <template v-else>
            <bank-auth style="height: 100%" :auth-callback="auth" :bank-id="'e_bank'" :bank-name="'Е-Банк'" :is-mobile="isMobile"></bank-auth>
        </template>
    </v-card>
</template>

<script>
    import {getURL} from "@/utils/settings";
    import axios from 'axios';
    import BankAuth from "@/components/BankAuth";

    export default {
        name: "EBank",
        components: {BankAuth},
        props: {
            isMobile: Boolean
        },
        data: () => {
            return {
                clientId: null,
                openedProducts: ['Счета', 'Услуги'],
                loans: [],
                accounts: [
                    {
                        idx: 0,
                        name: 'Денежки',
                        amount: 24035632,
                        currency: 'rub',
                        cards: [{
                            idx: 0,
                            number: '1111 1111 1111 1111'
                        }],
                        actions: [{
                            idx: 0,
                            name: 'Перевести',
                            link: 'transfer'
                        }, {
                            idx: 1,
                            name: 'Пополнить телефон',
                            link: 'payphone'
                        }, {
                            idx: 1,
                            name: 'История операций',
                            link: 'payment-history'
                        }]
                    }
                ],
                services: [{
                    idx: 0,
                    title: 'Взять кредит',
                    subtitle: 'Под выгодные 200% годовых',
                    actions: [{
                        idx: 0,
                        name: 'Оформить',
                        link: 'loan'
                    }]
                }, {
                    idx: 1,
                    title: 'Открыть вклад',
                    subtitle: 'Под выгодные 2% годовых',
                    actions: [{
                        idx: 0,
                        name: 'Оформить',
                        link: 'deposit'
                    }]
                }, {
                    idx: 1,
                    title: 'Оформить страхование',
                    subtitle: 'Если решили прыгнуть с парашютом',
                    actions: [{
                        idx: 0,
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
                    axios.get(getURL(`e_bank/accounts`)).then(res => {
                        this.accounts = res.data.filter(o => {return o.holder === this.clientId});
                        this.accounts.forEach(account => {
                            let offset = 0;
                            account['name'] = `Счет-${offset++}`
                            account['actions'] = [{
                                idx: 0,
                                name: 'Оплатить',
                                link: 'pay'
                            }, {
                                idx: 1,
                                name: 'Перевести',
                                link: 'transfer'
                            }]
                        })
                    }).catch(err => {
                        console.log(err)
                    });
                    axios.get(getURL('e_bank/loans')).then(res => {
                        this.loans = res.data.filter(o => {return o.borrower === this.clientId});
                        this.loans.forEach(loan => {
                            let offset = 0;
                            loan['name'] = `Кредит-${offset++}`
                            loan['actions'] = {
                                idx: 0,
                                name: 'Внести платёж',
                                link: 'make-pay'
                            }, {
                                idx: 1,
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
        methods: {
            auth(clientId) {
              this.clientId = clientId
            },
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
