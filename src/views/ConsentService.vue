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
                                    <v-select density="compact" v-model="subagree.orgs" :items="financialOrgs" item-title="name" item-value="id" multiple></v-select>
                                </v-col>
                                <v-col cols="2">
                                    <v-date-input></v-date-input>
                                </v-col>
                            </v-row>
                        </v-list-item>
                        <v-divider/>

                    </v-list-group>

                </v-list>
                <v-btn v-on:click="recallAll" variant="flat" >Отозвать все согласия</v-btn>
            </template>
            <template v-else-if="state==='give-agree'">
                <v-sheet style="width: 70%" class="mx-auto my-10">
                    <v-select label="Организация" :items="financialOrgs" item-title="name" item-value="id"></v-select>
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
    import axios from 'axios';

    import BankAuth from "@/components/BankAuth";
    import {getURL} from "@/utils/settings";

    export default {
        name: "ConsentService",
        components: {BankAuth},
        props: {
            isMobile: Boolean,
        },
        watch: {
            clientId: function () {
               this.updateConsents();
            }
        },
        mounted() {
            axios.get(getURL('consents/agent')).then(res => {
                this.financialOrgs = res.data;
            }).catch(err=> {console.log(err)})
        },
        data: () => {
            return {
                consentKeys: {},
                myId: '08d8f566-2be0-44df-8a21-ab3e14c28e1b',
                allConsents: [
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
                consents: [{
                    "id": "5420f785-f6d0-4091-a96b-8da75d3ffab0",
                    "scope": "Кредитная история",
                    "expire_date_time": "2024-11-23T06:26:31.503000Z",
                    "expire_transaction": null,
                    "agent": "08d8f566-2be0-44df-8a21-ab3e14c28e1b",
                    "agent_client": "75f392fb-3e83-47c1-a0c6-6a65f2d67102",
                    "contragent": "91c51bb0-e860-42ae-92af-683a76f47611",
                    "agreement": true
                }],
                clientId: null,
                state: 'agreements',
                consentServices: [
                    {id: 1, name: 'Управление согласиями', value: 'agreements'},
                    {id: 2, name: 'Выдать согласие', value: 'give-agree'}
                ],

                showProducts: false,
                financialOrgs: [
                    {
                        "id": "91c51bb0-e860-42ae-92af-683a76f47611",
                        "name": "e_bank",
                        "api_address": "http://spacecraft-it.ru/api/e_bank/api"
                    },
                    {
                        "id": "941ba5f9-5f57-4e9e-9619-d078321d614e",
                        "name": "e_bank_loclahost",
                        "api_address": "http://localhost:8000/api/e_bank/api"
                    },
                    {
                        "id": "08d8f566-2be0-44df-8a21-ab3e14c28e1b",
                        "name": "Монополия",
                        "api_address": "https://127.0.0.1"
                    },
                    {
                        "id": "b598ad2a-1f09-4bd1-a92e-bc85a8deff11",
                        "name": "ООО Финансовые услуги",
                        "api_address": "https://127.0.0.1"
                    },
                    {
                        "id": "6e989065-5c91-4c7f-9a7c-515222a37b58",
                        "name": "ООО Банкротство",
                        "api_address": "https://127.0.0.1"
                    }
                ],
                agreements: [{
                    id: 0,
                    name: 'Управление счетами',
                    agree: false,
                    items: [{
                        id: 5,
                        name: 'Получение сведений',
                        orgs: []

                    }, {
                        id: 6,
                        name: 'Переводы',
                        orgs: []

                    }],
                    orgs: [],
                }, {
                    id: 1,
                    name: 'Финансовые услуги',
                    agree: false,
                    items: [{
                        id: 7,
                        name: 'Кредитная история',
                        orgs: []

                    }, {
                        id: 8,
                        name: 'Получение заёмов',
                        orgs: []

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
                        orgs: []
                    }],
                    orgs: []
                }, {
                    id: 3,
                    name: 'Управление согласиями',
                    agree: false,
                    items: [],
                    orgs: ['08d8f566-2be0-44df-8a21-ab3e14c28e1b']
                }]
            }
        },
        methods: {
            updateConsents() {
                axios.get(getURL('consents/consent')).then(res => {
                    console.log(res);
                    this.allConsents = res.data;
                    this.handleConsents();
                }).catch(err=> {console.log(err)})
            },
            handleConsents() {
                this.consents = this.allConsents;
                this.consents.filter(o => {
                    return (o.agent_client === this.clientId)
                })

                this.consents.forEach(o => {
                    this.consentKeys[o.scope] = o.agent;
                })

                console.log('consents keys: ', this.consentKeys)

                this.agreements.forEach(agree=> {
                    agree.items.forEach(consent => {
                        console.log('name: ', consent.name, ' consent: ', consent)
                        if(consent.name in this.consentKeys) {
                            consent.agree = true;
                            consent.orgs.push(this.consentKeys[consent.name])
                            console.log('consents keys: ', this.consentKeys)

                        } else {
                            consent.agree = false;
                            consent.orgs = [];
                        }
                    })
                })
            },
            getConsentKey(consent) {
                return `${consent.scope}/${consent.agent}/${consent.agent_client}`
            },
            async recallAll() {
                for (const consent of this.consents) {
                    await axios.delete(getURL(`consents/consent/${consent.id}`));
                }
                this.updateConsents();
            },
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
