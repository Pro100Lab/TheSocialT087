<template>
    <v-card color="black" class="sms__main-container sms__main-container-adaptive">
        <v-card-title class="px-4" style="font-weight: 200; font-size: 3rem">
            Сообщения
        </v-card-title>
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

        <v-row v-for="sms of smsList"  :key="`sms-${sms.id}`">
            <v-col cols="1" align-self="center">
                <v-icon v-if="!sms.read" icon="mdi-circle-medium" color="orange"></v-icon>
            </v-col>

            <v-col cols="1" align-self="center">
                <v-icon icon="mdi-account-circle"
                        size="x-large"
                        color="grey"
                ></v-icon>
            </v-col>

            <v-col cols="8">
                <v-list-item>
                    <v-list-item-title>{{sms.number}}</v-list-item-title>
                    <v-list-item-subtitle>{{sms.text}}</v-list-item-subtitle>
                </v-list-item>
            </v-col>
            <v-col cols="2" align-self="start">
                <v-card-subtitle class="text-no-wrap">{{sms.time}}</v-card-subtitle>
            </v-col>
        </v-row>

        <v-icon icon="mdi-plus-circle" color="orange" size="60" style="position: absolute; bottom: 5%; right: 5%;"></v-icon>
    </v-card>
</template>

<script>
    export default {
        name: "SMS",
        data: () => {
            return {
                smsList: [
                    {
                        id: 0,
                        number: 'e-bank',
                        text: 'Заявление №111000 Подтверждено, ожидайте решения',
                        read: false,
                        time: '2:08'
                    },
                    {
                        id: 1,
                        number: 'style-bank',
                        text: 'Платёж будет списан 25 числа, не забудьте внести платёж',
                        read: true,
                        time: '2:07'
                    }
                ]
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
