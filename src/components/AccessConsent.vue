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

            <v-btn block v-if="!authorized"
                   v-on:click="authGosus">
                Авторизоваться через гос.услуги
                <v-icon class="ml-2" size="32">
                    <v-img src="../assets/gosus.svg"></v-img>
                </v-icon>
            </v-btn>
            <v-btn block v-else v-on:click="callback(requiredAgreements)" text="Даю согласие"> </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    export default {
        name: "AccessConsent",
        props: {
            sp: String,
            sendSms: Function,
            requiredAgreements: Array,
            callback: Function,
            errback: Function,
            ttl: Date
        },
        data: () => {
            return {
                authorized: false,
                gosusLogo: require('@/assets/gosus.svg')
            }
        },
        methods: {
            authGosus() {
                this.sendSms('gosuslugi', `Код для авторизации: ${Math.round(Math.random()*999)}-${Math.round(Math.random()*999)}`);
                setTimeout(() => {
                    this.authorized = true;
                }, 2000)
            }
        }
    }
</script>

<style scoped>

</style>
