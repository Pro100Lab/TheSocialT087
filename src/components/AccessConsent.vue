<template>
    <v-card variant="flat">
        <v-card-title class="text-center">Получение согласия</v-card-title>
        <v-card >
            <v-card-text>
                Для поставщика финансовых услуг {{sp}} требуются следующие согласия
            </v-card-text>
            <v-list color="deep-orange-lighten-3">
                <v-list-item
                        prepend-icon="mdi-circle"
                        v-for="agree of requiredAgreements"
                        :key="`required-agreement-${agree}`"
                        :title="agree"
                ></v-list-item>
            </v-list>
        </v-card>
        <v-card-text>
            Данное согласие будет выдано на срок до {{ttl ? ttl.toLocaleString() : ''}}
        </v-card-text>

        <v-card-actions class="d-flex flex-row align-center justify-center">

            <v-btn block
                   :readonly="authorized"
                   v-on:click="authGosus">
                Авторизоваться через гос.услуги
                <v-icon class="ml-2" size="32">
                    <v-img src="../assets/gosus.svg"></v-img>
                </v-icon>
            </v-btn>
        </v-card-actions>
        <v-text-field class="px-4" :readonly="code"  v-if="code" label="Введите код" v-model="code"></v-text-field>

        <v-card-actions>
            <v-btn block :readonly="!code" v-on:click="createConsents()" text="Даю согласие"> </v-btn>

        </v-card-actions>
    </v-card>
</template>

<script>
    import axios from 'axios';
    import {getURL} from "@/utils/settings";

    export default {
        name: "AccessConsent",
        props: {
            sp: String,
            sendSms: Function,
            requiredAgreements: Array,
            agent: String,
            contragent: String,
            agentClient: String,
            callback: Function,
            errback: Function,
            ttl: Date
        },
        data: () => {
            return {
                authorized: false,
                code: null,
                gosusLogo: require('@/assets/gosus.svg')
            }
        },
        methods: {
            async createConsents() {
                // eslint-disable-next-line no-unused-vars
                for (const agree of this.requiredAgreements) {
                    await axios.post(getURL('consents/consent', {
                        scope: agree,
                        expire_date_time: this.ttl,
                        agent: this.agent,
                        agent_client: this.agent_client,
                        contragent: this.contragent,
                        agreement: true,
                    }))
                }
                this.callback();
            },
            authGosus() {
                this.code = `${Math.round(Math.random()*999).toLocaleString('en-US', {minimumIntegerDigits: 3, useGrouping: false})}-${Math.round(Math.random()*999).toLocaleString('en-US', {minimumIntegerDigits: 3, useGrouping: false})}`
                this.sendSms('gosuslugi', `Код для авторизации: ${this.code}`);
                setTimeout(() => {
                    this.authorized = true;
                }, 2000)
            }
        }
    }
</script>

<style scoped>

</style>
