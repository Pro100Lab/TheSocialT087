<template>
    <v-card variant="flat" rounded="lg">
        <v-toolbar >
            <v-app-bar-nav-icon v-on:click="showProducts = !showProducts" :icon="showProducts ? 'mdi-close': 'mdi-menu'"></v-app-bar-nav-icon>
            <v-toolbar-title>
                Сервис согласий
            </v-toolbar-title>
        </v-toolbar>

        <template v-if="clientId">
            <v-navigation-drawer style="position: absolute;" v-if="showProducts">
                <v-list>
                    <v-list-item prepend-icon="mdi-close" v-on:click="showProducts=false">
                    </v-list-item>
                    <v-list-item v-for="item of consentServices" :key="`service-${item.id}`"
                                 :title="item.name"
                                 v-on:click="changeAgree(item.value)"
                    >

                    </v-list-item>
                </v-list>
            </v-navigation-drawer>

            <v-card-title class="text-center">{{consentServices.filter(o => o.value === state)[0].name}}</v-card-title>
            <template v-if="state==='agreements'">
                <v-row>
                    <v-col cols="5">
                        <v-card-subtitle>
                            Сфера
                        </v-card-subtitle>
                    </v-col>
                    <v-col cols="2" >
                        <v-card-subtitle class="text-center text-truncate">
                            {{isMobile ? 'С':  'Согласие' }}
                        </v-card-subtitle>
                    </v-col>
                    <v-col cols="5">
                        <v-card-subtitle>
                            {{isMobile ? 'СП':  'Поставщик услуг' }}
                        </v-card-subtitle>
                    </v-col>
                </v-row>

                <v-list class="px-4">
                    <v-list-group
                            v-for="agree of agreements" :key="agree.id"
                    >

                        <template v-slot:activator="{props}">
                            <v-list-item
                                    v-bind="props"
                                    :title="agree.name"
                            ></v-list-item>
                        </template>

                        <v-list-item density="compact" v-for="subagree of agree.items" :key="`subagr-${subagree.id}`"
                                     prepend-icon=""
                        >
                            <v-row align="center">
                                <v-col cols="5">
                                    <b>{{subagree.name}}</b>
                                </v-col>
                                <v-col cols="2" class="d-flex flex-row justify-center">
                                    <v-checkbox
                                            density="compact"
                                            v-model="subagree.agree"
                                    ></v-checkbox>
                                </v-col>
                                <v-col cols="3">
                                    <v-select density="compact" v-model="subagree.orgs" :items="financialOrgs" multiple></v-select>
                                </v-col>
                                <v-col cols="2">
                                    <v-date-input></v-date-input>
                                </v-col>
                            </v-row>
                        </v-list-item>
                        <v-divider/>

                    </v-list-group>

                </v-list>
            </template>
            <template v-else-if="state==='give-agree'">
                <v-sheet style="width: 70%" class="mx-auto my-10">
                    <v-select label="Организация" :items="financialOrgs" ></v-select>
                    <v-textarea label="Токен согласия">

                    </v-textarea>
                </v-sheet>

                <v-row style="width: 70%" class="mx-auto">
                    <v-col cols="1"></v-col>
                    <v-col cols="8">
                        <v-checkbox label="Я подтверждаю, что нахожусь в здравом уме, и лично принимаю решение выдать согласие для организации"></v-checkbox>
                    </v-col>
                    <v-col cols="12">
                        <v-btn block>Выдать согласие</v-btn>
                    </v-col>
                </v-row>
            </template>
        </template>
        <template v-else>
            <bank-auth bank-name="Согласия" bank-id="e_bank" :auth-callback="auth" :is-mobile="isMobile" ></bank-auth>
        </template>
    </v-card>
</template>

<script>
    import BankAuth from "@/components/BankAuth";
    export default {
        name: "ConsentService",
        components: {BankAuth},
        props: {
            isMobile: Boolean,
        },
        data: () => {
            return {
                clientId: null,
                state: 'agreements',
                consentServices: [
                    {id: 1, name: 'Управление согласиями', value: 'agreements'},
                    {id: 2, name: 'Выдать согласие', value: 'give-agree'}
                ],

                showProducts: false,
                financialOrgs: [
                    'Монополия',
                    'Финансовые услуги',
                    'ООО "Банкротство"'
                ],
                agreements: [{
                    id: 0,
                    name: 'Управление счетами',
                    agree: false,
                    items: [{
                        id: 5,
                        name: 'Получение сведений'
                    }, {
                        id: 6,
                        name: 'Переводы'
                    }],
                    orgs: [],
                }, {
                    id: 1,
                    name: 'Финансовые услуги',
                    agree: false,
                    items: [{
                        id: 7,
                        name: 'Кредитная истории'
                    }, {
                        id: 8,
                        name: 'Получение заёмов'
                    }],
                    orgs: []
                }, {
                    id: 2,
                    name: 'Данные о доходах',
                    agree: false,
                    items: [{
                        id: 9,
                        name: 'Сведения о полученных доходах',
                        agree: false,
                    }],
                    orgs: []
                }, {
                    id: 3,
                    name: 'Управление согласиями',
                    agree: false,
                    items: [],
                    orgs: ['Монополия']
                }]
            }
        },
        methods: {
            auth(clientId) {
              this.clientId = clientId;
            },
            changeAgree(state) {
                this.state = state;
                this.showProducts = false;
            }
        }
    }
</script>

<style scoped>

</style>
