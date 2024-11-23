<template>
    <v-card variant="flat">
        <v-card-title class="text-center">{{bankName}} | Авторизация</v-card-title>
        <div class="mx-auto" :style="{width: isMobile ? '90%' : '50%', 'max-height': '50vh', 'overflow-y': 'auto'}">
        <v-radio-group v-model="checkedClient">
        <v-radio v-for="client of clients" :key="`client-${client.id}`" :value="client.id"
                 :label="`${client.last_name} ${client.first_name} [id=${client.id}]`">
        </v-radio>
        </v-radio-group>
        </div>
        <v-card-actions><v-btn :readonly="!checkedClient" block v-on:click="authCallback(checkedClient)">{{ checkedClient ? 'Войти' : 'Выберите клиента' }}</v-btn></v-card-actions>

    </v-card>
</template>

<script>
    import axios from 'axios';
    import {getURL} from "@/utils/settings";

    export default {
        name: "BankAuth",
        props: {
            bankName: String,
            bankId: String,
            authCallback: Function,
            isMobile: Boolean
        },
        data: () => {
            return {
                checkedClient: null,
                clients: [
                    {
                        "id": "75f392fb-3e83-47c1-a0c6-6a65f2d67102",
                        "first_name": "Александр",
                        "last_name": "Грибоедов",
                        "family_name": "Сергеевич"
                    },{
                        "id": "75f392fb-3e83-47c1-a0c6-6a65f2d67102",
                        "first_name": "Александр",
                        "last_name": "Грибоедов",
                        "family_name": "Сергеевич"
                    },{
                        "id": "75f392fb-3e83-47c1-a0c6-6a65f2d67102",
                        "first_name": "Александр",
                        "last_name": "Грибоедов",
                        "family_name": "Сергеевич"
                    },{
                        "id": "75f392fb-3e83-47c1-a0c6-6a65f2d67102",
                        "first_name": "Александр",
                        "last_name": "Грибоедов",
                        "family_name": "Сергеевич"
                    },{
                        "id": "75f392fb-3e83-47c1-a0c6-6a65f2d67102",
                        "first_name": "Александр",
                        "last_name": "Грибоедов",
                        "family_name": "Сергеевич"
                    },{
                        "id": "75f392fb-3e83-47c1-a0c6-6a65f2d67102",
                        "first_name": "Александр",
                        "last_name": "Грибоедов",
                        "family_name": "Сергеевич"
                    },{
                        "id": "75f392fb-3e83-47c1-a0c6-6a65f2d67102",
                        "first_name": "Александр",
                        "last_name": "Грибоедов",
                        "family_name": "Сергеевич"
                    },{
                        "id": "75f392fb-3e83-47c1-a0c6-6a65f2d67102",
                        "first_name": "Александр",
                        "last_name": "Грибоедов",
                        "family_name": "Сергеевич"
                    },{
                        "id": "75f392fb-3e83-47c1-a0c6-6a65f2d67102",
                        "first_name": "Александр",
                        "last_name": "Грибоедов",
                        "family_name": "Сергеевич"
                    },
                    {
                        "id": "75f392fb-3e83-47c1-a0c6-6a65f2d67102",
                        "first_name": "Александр",
                        "last_name": "Грибоедов",
                        "family_name": "Сергеевич"
                    },{
                        "id": "75f392fb-3e83-47c1-a0c6-6a65f2d67102",
                        "first_name": "Александр",
                        "last_name": "Грибоедов",
                        "family_name": "Сергеевич"
                    },{
                        "id": "75f392fb-3e83-47c1-a0c6-6a65f2d67102",
                        "first_name": "Александр",
                        "last_name": "Грибоедов",
                        "family_name": "Сергеевич"
                    },{
                        "id": "75f392fb-3e83-47c1-a0c6-6a65f2d67102",
                        "first_name": "Александр",
                        "last_name": "Грибоедов",
                        "family_name": "Сергеевич"
                    },{
                        "id": "75f392fb-3e83-47c1-a0c6-6a65f2d67102",
                        "first_name": "Александр",
                        "last_name": "Грибоедов",
                        "family_name": "Сергеевич"
                    },{
                        "id": "75f392fb-3e83-47c1-a0c6-6a65f2d67102",
                        "first_name": "Александр",
                        "last_name": "Грибоедов",
                        "family_name": "Сергеевич"
                    },{
                        "id": "75f392fb-3e83-47c1-a0c6-6a65f2d67102",
                        "first_name": "Александр",
                        "last_name": "Грибоедов",
                        "family_name": "Сергеевич"
                    },{
                        "id": "75f392fb-3e83-47c1-a0c6-6a65f2d67102",
                        "first_name": "Александр",
                        "last_name": "Грибоедов",
                        "family_name": "Сергеевич"
                    },{
                        "id": "75f392fb-3e83-47c1-a0c6-6a65f2d67102",
                        "first_name": "Александр",
                        "last_name": "Грибоедов",
                        "family_name": "Сергеевич"
                    }
                ]
            }
        },
        mounted() {
            axios.get(getURL(`${this.bankId}/clients`)).then(res => {
                this.clients = res.data;
            }).catch(err => {console.log(err)})
        }
    }
</script>

<style scoped>

</style>
