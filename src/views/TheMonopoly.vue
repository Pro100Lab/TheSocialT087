<template>
    <v-card>
        <transition name="slide-fade">
            <v-list v-if="showProducts"
                    style="position: sticky; left: 0; top: 0; height: 100%"
            >
                <v-list-item>
                    <v-list-item-action>
                        <v-icon icon="mdi-close" v-on:click="showProducts = false"></v-icon>
                    </v-list-item-action>
                </v-list-item>

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
            <v-app-bar-nav-icon v-on:click="showProducts = !showProducts"></v-app-bar-nav-icon>

            <v-toolbar-title>
                Монополия
            </v-toolbar-title>

        </v-toolbar>

        <div class="monopoly__main-container pa-3">
            <v-card-title>
                Помогаем выгодно вложиться
            </v-card-title>
            <v-row>
                <v-col
                        v-for="product of getNTop(4)"
                        :key="`service-${product.id}`"
                >
                    <v-card variant="flat" color="teal-lighten-5" rounded="lg" height="200">
                        <v-card-title>
                            {{product.name}}
                        </v-card-title>
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
        methods: {
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
