<template>
    <v-card color="black" class="sms__main-container sms__main-container-adaptive">
        <v-card-title class="px-4" style="font-weight: 200; font-size: 3rem">
            Сообщения
        </v-card-title>

        <template v-if="!smsListShow">

            <v-text-field
                    prepend-inner-icon="mdi-magnify"
                    placeholder="Поиск сообщений"
                    rounded="xl"
                    density="compact"
                    hide-details
                    variant="outlined"
                    single-line
                    class="pb-4 px-4"
            ></v-text-field>

            <v-row v-for="[name, sms] of Object.entries(smsList)"
                   :key="`sms-${sms[0].id}`"
                   style="cursor:pointer;"
                   v-on:click="smsListShow=name">
                <v-col cols="1" align-self="center">
                    <v-icon v-if="!sms[0].read" icon="mdi-circle-medium" color="orange"></v-icon>
                </v-col>

                <v-col cols="1" align-self="center">
                    <v-icon icon="mdi-account-circle"
                            size="x-large"
                            color="grey"
                    ></v-icon>
                </v-col>

                <v-col cols="8">
                    <v-list-item>
                        <v-list-item-title>{{sms[0].number}}</v-list-item-title>
                        <v-list-item-subtitle>{{sms[0].text}}</v-list-item-subtitle>
                    </v-list-item>
                </v-col>
                <v-col cols="2" align-self="start">
                    <v-card-subtitle class="text-no-wrap">{{sms[0].time}}</v-card-subtitle>
                </v-col>
            </v-row>

            <v-icon icon="mdi-plus-circle"
                    color="orange"
                    size="60"
                    style="position: absolute; bottom: 5%; right: 5%;"
                    v-on:click="writeSms = true"
            ></v-icon>

            <v-card color="black" class="rounded-t-xl px-4" style="position: absolute; bottom: 0; width: 100%; height: 50%" v-if="writeSms">
                <v-card-actions>
                    <v-card-title>Написать</v-card-title>
                    <v-spacer/>
                    <v-icon icon="mdi-close" v-on:click="writeSms=false"></v-icon>
                </v-card-actions>
                <v-text-field label="Номер" v-model="sms.number"></v-text-field>
                <v-textarea label="Текст сообщения" v-model="sms.text"></v-textarea>
                <v-btn color="black" block text="Отправить" v-on:click="sendSMS"></v-btn>
            </v-card>
        </template>

        <template v-else>
            <v-card-title><v-btn variant="icon" icon="mdi-chevron-left" v-on:click="smsListShow = null"></v-btn>{{smsListShow}}</v-card-title>
            <div class="d-flex flex-column-reverse">
                <v-card variant="flat"
                        class="mx-4 rounded-xl mt-1"
                        color="grey-darken-4"
                        :class="sms.me ? 'rounded-be-0' : 'rounded-bs-0'"
                        v-for="sms of smsList[smsListShow]"
                        :key="`sms-${smsListShow}-${sms.text}`"
                >
                    <v-card-text class="text-break" :class="sms.me ? 'text-right' : 'text-left'">{{sms.text}}</v-card-text>
                    <v-card-subtitle :class="sms.me ? 'text-right' : 'text-left'">{{sms.time}}</v-card-subtitle>

                </v-card>
            </div>
            <v-card-actions class="position-absolute bottom-0 d-flex flex-row align-center" style="width: 100%">
                <v-text-field   density="compact" label="Введите текст.." v-model="sms.text"></v-text-field>
                <v-btn variant="icon" icon="mdi-send" v-on:click="sendNamedSMS"></v-btn>
            </v-card-actions>
        </template>
    </v-card>
</template>

<script>
    export default {
        name: "SMS",
        data: () => {
            return {
                offset: 100,
                smsListShow: null,
                writeSms: false,
                smsList: {
                    'e-bank': [{
                        id: 0,
                        number: 'e-bank',
                        text: 'Заявление №111000 Подтверждено, ожидайте решения',
                        read: false,
                        time: '2:08',
                        chain: [],
                        me: false,
                    }],
                    'style-bank': [{
                        id: 1,
                        number: 'style-bank',
                        text: 'Платёж будет списан 25 числа, не забудьте внести платёж',
                        read: true,
                        time: '2:07',
                        me: false
                    }]
                },
                sms: {
                    number: null,
                    text: null,
                }
            }
        },
        methods: {
            sendNamedSMS() {
                this.sms.number = this.smsListShow;
                this.sendSMS();
            },
            sendSMS() {
                if(!(this.sms.number in this.smsList))
                    this.smsList[this.sms.number] = [];

                const date = new Date();
                this.smsList[this.sms.number].unshift(
                    {number: this.sms.number,
                        text: this.sms.text,
                        read: true,
                        time: `${date.getHours()}:${date.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})}`,
                        id: this.offset++,
                        me: true
                    })
                this.sms = {number: null, text: null};
                this.writeSms = false;
            }
        }
    }
</script>

<style scoped>
    .sms__main-container {
        margin: 0 auto;
        height: 100%;
    }

    .sms__main-container-adaptive {
        width: 30%;
    }
    @media screen and (max-width: 960px){
        .sms__main-container-adaptive {
            width: 100%;
        }
    }
</style>
