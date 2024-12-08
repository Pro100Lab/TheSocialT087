<template>
    <v-card color="teal-lighten-5" class="overflow-y-auto">
        <transition name="slide-fade">
            <v-list v-if="showProducts"
                    style="position: sticky; left: 0; top: 0; height: 100%"
                    class="overflow-y-auto"
            >
                <v-list-group
                        v-for="product of products"
                        :key="`nav-product-${product.id}`"
                        :value="product.name">
                    <template v-slot:activator="{props}">

                        <v-list-item
                                v-bind="props"
                                :title="product.name"
                        ></v-list-item>

                    </template>

                    <v-list-item
                            v-for="sub of product.items"
                            :key="`nav-subproduct-${sub.id}`"
                            :title="sub.name"
                            :link="sub.link"
                    >
                    </v-list-item>
                </v-list-group>
            </v-list>
        </transition>

        <v-toolbar dark>
            <v-app-bar-nav-icon v-on:click="showProducts = !showProducts" :icon="showProducts ? 'mdi-close': 'mdi-menu'"></v-app-bar-nav-icon>

            <v-toolbar-title>
                Монополия | Единое окно услуг
            </v-toolbar-title>

        </v-toolbar>

        <template v-if="clientId">
        <div class="monopoly__main-container pa-3">
            <v-row>
                <v-col xl="6" sm="12">
                    <v-card variant="flat" rounded="lg">
                        <v-card-title>
                            Счета
                        </v-card-title>
                        <template v-if="agreements.indexOf('Получение сведений') !== -1">
                        <v-row v-for="account of accounts" :key="`bank-account-${account.id}`" class="pa-2">
                            <v-col cols="12" class="py-0">
                                <v-card rounded="lg" elevation="0" style="background-color: rgba(255,255,255,0.5)">
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
                        <template v-else>
                            <v-card-title>Отсутсвует согласие на получение сведений</v-card-title>
                            <v-skeleton-loader type="card">

                            </v-skeleton-loader>
                            <v-btn block v-on:click="makeAgreement(['Получение сведений'])">Получить</v-btn>

                        </template>
                    </v-card>
                </v-col>
                <v-col xl="6" sm="12">
                    <v-card variant="flat" rounded="lg">
                        <v-card-title>
                            Доходы/Расходы
                        </v-card-title>

                        <template v-if="agreements.indexOf('Финансовые услуги') !== -1 && agreements.indexOf('Данные о доходах') !== -1">
                        <v-progress-linear height="40" :model-value="stat.loanRate" :color="pickHex()">

                        </v-progress-linear>

                        <v-card>
                            <v-card-title class="pb-0" style="font-weight: 300">Ежемесячный доход: {{Math.floor(stat.income / 100).toString().match(/\d{1,3}/g).join(' ')}},{{stat.income % 100}} ₽</v-card-title>
                            <v-card-title class="py-0" style="font-weight: 300">Расходы по обязательства: {{Math.floor(stat.payments / 100).toString().match(/\d{1,3}/g).join(' ')}},{{stat.payments % 100}} ₽</v-card-title>
                            <v-card-title class="py-0" style="font-weight: 300">Обязательств: {{stat.loansCount}}</v-card-title>
                        </v-card>

                        <v-card-actions>
                            <v-btn block v-on:click="showRecommends=true">
                                Советы и рекомендации <v-icon icon="mdi-chevron-right"></v-icon>
                            </v-btn>
                        </v-card-actions>
                        </template>
                        <template v-else>
                            <v-card-title>Отсутсвует согласие на управление счетами</v-card-title>
                            <v-skeleton-loader type="card">

                            </v-skeleton-loader>
                            <v-btn block v-on:click="makeAgreement(['Финансовые услуги','Данные о доходах'])">Получить</v-btn>

                        </template>
                    </v-card>
                </v-col>
                <v-col cols="12">
                    <v-card>
                        <v-card-title>Сделки</v-card-title>
                        <v-list>
                            <v-list-item v-for="deal of deals" :key="deal.id" :title="deal.name" append-icon="mdi-coin"></v-list-item>
                            <v-list-item-action><v-btn block>Продолжить</v-btn></v-list-item-action>
                        </v-list>
                    </v-card>
                </v-col>
                <v-col cols="12">
                    <v-card>
                        <v-card-title>Доска объявления</v-card-title>
                        <v-list>
                            <v-list-item v-for="deal of market" :key="deal.id" :title="deal.name" append-icon="mdi-coin"></v-list-item>
                        <v-list-item-action><v-btn block>Провести сделку</v-btn></v-list-item-action>
                        </v-list>
                    </v-card>
                </v-col>
            </v-row>
        </div>
        </template>
        <template v-else>
            <bank-auth bank-name="Монополия" bank-id="e_bank" :auth-callback="auth" :is-mobile="isMobile" ></bank-auth>

        </template>
        <v-overlay scroll-strategy="block" class="align-center justify-center" v-model="inAgreementProcess">
            <access-consent
                    :sp="'Монополия'"
                    :agent="myId"
                    :contragent="myId"
                    :agent-client="clientId"
                    :required-agreements="getAgreementProcess"
                    :callback="acceptAgreement"
                    :send-sms="sendSms"
            :ttl="ttl"
            >

            </access-consent>
        </v-overlay>

        <v-overlay scroll-strategy="block" class="align-center justify-center" v-model="showRecommends">
            <v-card>
                <v-card-title>
                    Рекомендации
                </v-card-title>
                <v-card-subtitle>
                    <v-icon icon="mdi-circle"></v-icon>Если ваш прогресс-бар больше красного цвета - вам необходимо снизить кредитную нагрузку: закрыть кредитные карты,
                    досрочно погасить кредиты
                </v-card-subtitle>
                <v-card-subtitle>
                    <v-icon icon="mdi-cricle"></v-icon>Если ваш прогресс-бар больше зелёного цвета - берите кредиты, сколько хотите!
                </v-card-subtitle>
            </v-card>
        </v-overlay>
    </v-card>
</template>

<script>
    import AccessConsent from "@/components/AccessConsent";
    import BankAuth from "@/components/BankAuth";
    import axios from "axios";
    import {getURL} from "@/utils/settings";
    export default {
        name: "TheMonopoly",
        props: {
            sendSms: Function,
            isMobile: Boolean
        },
        components: {BankAuth, AccessConsent},
        data: () => {
            return {
                deals: [
                    {id: 1,
                    name: 'Покупка квартиры'}
                ],
                market: [{
                    id: 0,
                    name: 'Куплю 1000$ за 150000 Р.',
                    who: 'Петров А.Н.',
                   actions: ['Обсудить', 'Купить']
                }],
                myId: '08d8f566-2be0-44df-8a21-ab3e14c28e1b',
                showRecommends: false,
                clientId: null,
                inAgreementProcess: false,
                getAgreementProcess: null,
                ttl: null,
                agreements: [],
                stat: {
                    income: 36571644,
                    payments: 24310000,
                    loansCount: 10,
                    loanRate: 70,
                },
                consents: [
                    {
                        "id": "5420f785-f6d0-4091-a96b-8da75d3ffab0",
                        "scope": "Кредитная история",
                        "expire_date_time": "2024-11-23T06:26:31.503000Z",
                        "expire_transaction": null,
                        "agent": "08d8f566-2be0-44df-8a21-ab3e14c28e1b",
                        "agent_client": "75f392fb-3e83-47c1-a0c6-6a65f2d67102",
                        "contragent": "91c51bb0-e860-42ae-92af-683a76f47611",
                        "agreement": true
                    }
                ],
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
                        }]
                    },
                    {
                        id: 3,
                        name: 'Счет для погашения кредита',
                        balance: 10,
                        valute: 'rub',
                        cards: [{
                            id: 0,
                            number: '1111 1111 1111 1111'
                        }],
                        actions: [{
                            id: 1,
                            name: 'Перевести',
                            link: 'transfer'
                        }]
                    }
                ],
                showProducts: false,
                openedProducts: [],
                products: [
                    {
                        id: 0,
                        name: 'Вклады',
                        link: 'invest-all',
                        rating: 80,
                        items: [{
                            id: 1,
                            name: 'Вклады',
                            link: 'invest',
                            rating: 100,
                        }, {
                            id: 2,
                            name: 'Накопительные счета',
                            link: 'saving-accounts',
                            rating: 50
                        }, {
                            id: 3,
                            name: 'Специальные предложения',
                            link: 'invest-special',
                            rating: 250
                        }]
                    },
                    {
                        id: 4,
                        name: 'Кредиты',
                        link: 'loans-all',
                        rating: 900,
                        items: [
                            {
                                id: 5,
                                name: 'Потребительские кредиты',
                                link: 'user-loans',
                                rating: 400
                            },
                            {
                                id: 6,
                                name: 'Рефинансирование',
                                link: 'refinancing-loans',
                                rating: 320,
                            },
                            {
                                id: 7,
                                name: 'Автокредиты',
                                link: 'car-loans',
                                rating: 600,
                            }, {
                                id: 8,
                                name: 'Микрозаймы',
                                link: 'micro-loans',
                                rating: 800,
                            }
                        ],
                    },
                    {
                        id: 9,
                        name: 'Карты',
                        link: 'cards-all',
                        rating: 220,
                        items: [
                            {
                                id: 10,
                                name: 'Кредитные карты',
                                link: 'credit-cards',
                                rating: 150,
                            },
                            {
                                id: 11,
                                name: 'Дебетовые карты',
                                link: 'debet-cards',
                                rating: 120,
                            },
                            {
                                id: 12,
                                name: 'Карты рассрочки',
                                link: 'delayed-cards',
                                rating: 300,
                            }
                        ]
                    },
                    {
                        id: 13,
                        name: 'Ипотека',
                        link: 'mortgage-all',
                        rating: 300,
                        items: [{
                            id: 14,
                            name: 'Ипотека',
                            link: 'mortgage',
                            rating: 450,
                        }, {
                            id: 15,
                            name: 'Рефинансирование',
                            link: 'mortgage-refinance',
                            rating: 150
                        }]
                    },
                    {
                        id: 16,
                        name: 'Решения для бизнеса',
                        link: 'b2b',
                        rating: 20,
                        items: [{
                            id: 17,
                            name: 'РКО',
                            link: 'rko',
                            rating: 80
                        }, {
                            id: 18,
                            name: 'Лизинг',
                            link: 'b2b-lease',
                            rating: 60
                        }]
                    },
                    {
                        id: 18,
                        name: 'Страхование',
                        link: 'insurance-all',
                        rating: 700,
                        items: [
                            {
                                id: 19,
                                name: 'ОСАГО',
                                link: 'insurance-osago',
                                rating: 850
                            }, {
                                id: 20,
                                name: 'КАСКО',
                                link: 'insurance-kasko',
                                rating: 300,
                            }, {
                                id: 21,
                                name: 'Жизни и здоровья',
                                link: 'insurance-life',
                                rating: 240,
                            }, {
                                id: 22,
                                name: 'Туристическая',
                                link: 'insurance-tourism',
                                rating: 20,
                            }, {
                                id: 23,
                                name: 'Для бизнеса',
                                link: 'insurance-business',
                                rating: 40
                            }, {
                                id: 24,
                                name: 'Недвижимости',
                                link: 'insurance-state',
                                rating: 350
                            }
                        ]
                    }, {
                        id: 25,
                        name: 'Инвестиции',
                        link: 'investments-all',
                        rating: 340,
                        items: [{
                            id: 26,
                            name: 'Облигации',
                            link: 'invest-bonds',
                            rating: 330,
                        }, {
                            id: 27,
                            name: 'Российские акции',
                            link: 'invest-rus',
                            rating: 90,
                        }, {
                            id: 28,
                            name: 'Иностранные акции',
                            link: 'invest-not-rus',
                            rating: 400
                        }, {
                            id: 29,
                            name: 'ИИС',
                            link: 'iis',
                            rating: 190
                        }, {
                            id: 30,
                            name: 'ПИФы',
                            link: 'pifs',
                            rating: 0
                        }]
                    }
                ]
            }
        },
        mounted() {
            this.calculateLoanRate();
        },
        watch: {
          clientId: function () {
              this.getAccounts();
              this.loadConsents();
          }
        },
        methods: {
            getAccounts() {
                axios.get(getURL(`e_bank/accounts`)).then(res => {
                    this.accounts = [];
                    const accounts = res.data.filter(o => {return o.holder === this.clientId});
                    accounts.forEach(account => {
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
                        }];

                        this.accounts.push(account);
                    })
                }).catch(err => {
                    console.log(err)
                });

                axios.get(getURL(`style_bank/accounts`)).then(res => {
                    const accounts = res.data.filter(o => {return o.holder === this.clientId});
                    accounts.forEach(account => {
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
                        }];

                        this.accounts.push(account);
                    })
                }).catch(err => {
                    console.log(err)
                });
            },
            getAgreements() {

            },
            auth(clientId) {
                this.clientId = clientId;
            },
            calculateLoanRate() {
                this.stat.loanRate = this.stat.payments / this.stat.income * 100
            },
            handleLink(link) {
                console.log(link);
            },
            closeOpenProduct(product) {
                const pos = this.openedProducts.indexOf(product);
                if( pos !== -1)
                    this.openedProducts.splice(pos, 1);
                else
                    this.openedProducts.push(product)
            },
            getNTop(n) {
                let allProducts = [];
                this.products.forEach(product => {
                    allProducts.push(product);
                    product.items.forEach(sub => {
                        allProducts.push(sub);
                    })
                })

                allProducts = allProducts.sort((a,b) => {return a.rating < b.rating ? 1 : -1});
                console.log('sorted: ', allProducts);
                return allProducts.slice(0, n);
            },
            processLink(link) {
                console.log(link);
            },
            pickHex() {
                const color2 = [28, 252, 3];
                const color1 = [252, 20, 3];
                const w1 = this.stat.loanRate / 100;
                const w2 = 1 - w1;
                return `rgb(${Math.round(color1[0] * w1 + color2[0] * w2)},${Math.round(color1[1] * w1 + color2[1] * w2)},${Math.round(color1[2] * w1 + color2[2] * w2)})`
            },
            hasAgreement(zone) {
                this.agreements.forEach(agreement => {
                    if(!agreement.agree && agreement.name === zone)
                        return false;

                    if(agreement.agree && agreement.name === zone && agreement.orgs.indexOf('Монополия') !== -1)
                        return true;

                    agreement.items.forEach(subagreement => {
                        if(!subagreement.agree && subagreement.name === zone)
                            return false;

                        if(subagreement.agree && subagreement.name === zone && subagreement.orgs.indexOf('Монополия') !== -1)
                            return true;
                    })
                })

                return false;
            },
            makeAgreement(zones) {
                this.getAgreementProcess = zones;
                this.ttl = new Date();
                this.ttl.setDate(this.ttl.getDate() + 30);
                this.inAgreementProcess = true;
            },
            acceptAgreement() {
                this.loadConsents();
                this.inAgreementProcess = false;
                this.getAgreementProcess = null;
                this.ttl = null;
            },
            loadConsents() {
                axios.get(getURL('consents/consent')).then(res => {
                    this.consents = res.data;
                    console.log('client: ', this.clientId)
                    this.consents.filter(o => {
                        return (o.agent_client === this.clientId && o.agent === this.myId)
                    });
                    console.log('filtered consents: ', this.consents)

                    this.consents.forEach(consent => {
                        this.agreements.push(consent.scope);
                    })

                    console.log('agreements: ', this.agreements)

                }).catch(err => {console.log(err)})
            }
        },
        computed: {
            hasAccountAgreement: function () {
                return this.hasAgreement('Управление счетами')
            },
            hasBudgetAgreement: function() {
                return this.hasAgreement('Финансовые услуги') && this.hasAgreement('Данные о доходах')
            },
            hasAgreementService: function() {
                return this.hasAgreement('Управление согласиями');
            }
        }
    }
</script>

<style scoped>
    .slide-fade-enter-active {
        transition: all .8s ease;
    }
    .slide-fade-leave-active {
        transition: all .4s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter {
        transform: translateY(200px);
        opacity: 1;
    }
    .slide-fade-leave-to
    {
        transform: translateY(-200px);
        opacity: 0;
    }
</style>
