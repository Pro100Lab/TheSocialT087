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

        <div class="monopoly__main-container pa-3">
            <v-row>
                <v-col cols="6">
                    <v-card variant="flat" rounded="lg">
                        <v-card-title>
                            Счета
                        </v-card-title>
                        <template v-if="true">
                        <v-row v-for="account of accounts" :key="`bank-account-${account.idx}`" class="px-2">
                            <v-col cols="12" class="py-0">
                                <v-card rounded="lg" elevation="0" style="background-color: rgba(255,255,255,0.5)">
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
                        <template v-else>
                            <v-card-title>Отсутсвует согласие на управление счетами</v-card-title>
                            <v-skeleton-loader type="card">

                            </v-skeleton-loader>
                            <v-btn block v-on:click="makeAgreement('Управление счетами')">Получить</v-btn>

                        </template>
                    </v-card>
                </v-col>
                <v-col cols="6">
                    <v-card variant="flat" rounded="lg">
                        <v-card-title>
                            Доходы/Расходы
                        </v-card-title>

                        <template v-if="true">
                        <v-progress-linear height="40" :model-value="stat.loanRate" :color="pickHex()">

                        </v-progress-linear>

                        <v-card>
                            <v-card-title class="pb-0" style="font-weight: 300">Ежемесячный доход: {{Math.floor(stat.income / 100).toString().match(/\d{1,3}/g).join(' ')}},{{stat.income % 100}} ₽</v-card-title>
                            <v-card-title class="py-0" style="font-weight: 300">Расходы по обязательства: {{Math.floor(stat.payments / 100).toString().match(/\d{1,3}/g).join(' ')}},{{stat.payments % 100}} ₽</v-card-title>
                            <v-card-title class="py-0" style="font-weight: 300">Обязательств: {{stat.loansCount}}</v-card-title>
                        </v-card>

                        <v-card-actions>
                            <v-btn block>
                                Советы и рекомендации <v-icon icon="mdi-chevron-right"></v-icon>
                            </v-btn>
                        </v-card-actions>
                        </template>
                        <template v-else>
                            <v-card-title>Отсутсвует согласие на управление счетами</v-card-title>
                            <v-skeleton-loader type="card">

                            </v-skeleton-loader>
                            <v-btn block v-on:click="makeAgreements(['Финансовые услуги','Данные о доходах'])">Получить</v-btn>

                        </template>
                    </v-card>
                </v-col>
                <v-col cols="12">
                    <v-card variant="flat" rounded="lg">

                        <template v-if="true">
                        <v-row>
                            <v-col cols="5">
                                <v-card-title>
                                    управление согласиями
                                </v-card-title>
                            </v-col>
                            <v-col cols="2" >
                                <v-card-title class="text-center">
                                    Согласие
                                </v-card-title>
                            </v-col>
                            <v-col cols="5">
                                <v-card-title>
                                    Потребитель услуг
                                </v-card-title>
                            </v-col>
                        </v-row>

                        <v-list>
                            <v-list-item
                                    density="compact"
                                    v-for="agree of agreements" :key="agree.id"
                            >
                                <v-row>
                                    <v-col cols="5">
                                        {{agree.name}}
                                    </v-col>
                                    <v-col cols="2" class="d-flex flex-row justify-center">
                                        <v-checkbox density="compact" v-model="agree.agree"></v-checkbox>
                                    </v-col>
                                    <v-col cols="5">
                                        <v-select density="compact" v-model="agree.orgs" :items="financialOrgs" multiple></v-select>
                                    </v-col>
                                </v-row>

                            </v-list-item>
                        </v-list>
                        </template>
                        <template v-else>
                            <v-card-title>
                                Теперь нельзя управлять согласиями, доигрался!?
                            </v-card-title>
                            <v-skeleton-loader type="card"></v-skeleton-loader>
                        </template>
                    </v-card>
                </v-col>
            </v-row>
        </div>
    </v-card>
</template>

<script>
    export default {
        name: "TheMonopoly",
        data: () => {
            return {
                financialOrgs: [
                    'Монополия'
                ],
                stat: {
                    income: 36571644,
                    payments: 24310000,
                    loansCount: 10,
                    loanRate: 70,
                },
                agreements: [{
                    id: 0,
                    name: 'Управление счетами',
                    agree: false,
                    items: [],
                    orgs: []
                }, {
                    id: 1,
                    name: 'Финансовые услуги',
                    agree: false,
                    items: [],
                    orgs: []
                }, {
                    id: 2,
                    name: 'Данные о доходах',
                    agree: false,
                    items: [],
                    orgs: []
                }, {
                    id: 3,
                    name: 'Управление согласиями',
                    agree: true,
                    items: [],
                    orgs: ['Монополия']
                }],
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
                        }]
                    },
                    {
                        idx: 3,
                        name: 'Счет для погашения кредита',
                        amount: 10,
                        currency: 'rub',
                        cards: [{
                            idx: 0,
                            number: '1111 1111 1111 1111'
                        }],
                        actions: [{
                            idx: 1,
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
        methods: {
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
            makeAgreement(zone) {
                this.agreements.forEach(agreement => {
                    if(agreement.name === zone) {
                        agreement.orgs.push('Монополия')
                        agreement.agree = true;
                    }

                    agreement.items.forEach(sub => {
                        if(sub.name === zone) {
                            agreement.orgs.push('Монополия')
                            agreement.agree = true;
                        }

                    })
                })
            },
            makeAgreements(zones) {
                zones.forEach(zone => {
                    this.makeAgreement(zone);
                })
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
