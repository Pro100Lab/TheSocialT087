<template>
    <v-card class="pa-4 overflow-y-auto" style="max-height: 80%" >
        <v-card-title >
            Получение кредита
        </v-card-title>
        <v-text-field label="сумма кредита" v-model="credit_sum"></v-text-field>
        <v-divider/>

        <v-card-text>
            Срок
        </v-card-text>
        <v-chip-group v-model="term">
            <v-chip v-for="termPeriod of [1,2,3,4,5]" :key="`term-period-${termPeriod}`" :value="termPeriod" >{{termPeriod}} лет</v-chip>
        </v-chip-group>
        <v-divider/>
        <v-card-text>Дата гашения</v-card-text>
        <v-date-picker  v-model="date"></v-date-picker>
        <v-text-field hide-spin-buttons hide-details="" v-model="monthly_pay" label="Ежемесячный платёж"></v-text-field>
        <v-divider/>

        <v-card-actions>
            <v-btn :readonly="!monthly_pay" block v-on:click="takeLoan(credit_sum, monthly_pay, get_date, repayment_date, documents)">Подтвердить заявку</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    export default {
        name: "GetCreditModal",
        props: {
            takeLoan: Function,
            isMobile: Boolean
        },
        data: () => {
            return {
                credit_sum: 0,
                monthly_pay: 0,
                term: 1,
                date: null,
                get_date: null,
                repayment_date: null,
                documents: 'Паспорт',
            }
        },
        methods: {
            calculateMonthlyPay() {
                console.log('month pay calc: ', this.credit_sum, this.term, this.date);
                if( !this.credit_sum || !this.term || !this.date)
                    return;

                try {
                    let rep_date = new Date();
                    rep_date.setFullYear((new Date().getFullYear()) + this.term);

                    let g_date = new Date();
                    g_date.setMonth((new Date().getMonth() + 1) );

                    this.monthly_pay = parseInt(this.credit_sum) / (this.term * 12 ) * 1.2
                    this.repayment_date = rep_date.toISOString().substr(0, 10);
                    this.get_date = g_date.toISOString().substr(0, 10);
                }
                catch (e) {
                    this.monthly_pay = null
                    console.error(e);
                }
            }
        },
        watch: {
            credit_sum: function () {
                this.calculateMonthlyPay();
            },
            term: function () {
                this.calculateMonthlyPay();
            },
            date: function () {
                this.calculateMonthlyPay();
            }
        }
    }
</script>

<style scoped>

</style>
