<template>
  <v-app>

    <v-main class="main-display main-display__bg" :class="isMobile ? 'pa-2' : 'pa-4'" v-if="!showPresentation">
      <v-row dense :class="isMobile ? '' : ''" >

        <v-col cols="12">
          <router-view :send-sms="showSMS" :is-mobile="isMobile" class="main-display__main-view"/>
        </v-col>

        <v-col v-if="!isMobile" cols="12">
          <display-switch :is-mobile="isMobile" :switch-display="onDisplaySwitch" class="main-display__secondary-view"></display-switch>
        </v-col>
        <v-col v-else>
          <v-btn color="grey-darken-4" block append-icon="mdi-chevron-down" text="Экраны" v-on:click="showDisplays = true"></v-btn>
        </v-col>
      </v-row>
    </v-main>

    <v-card v-if="isMobile && showDisplays" style="position: fixed; bottom: 0; max-height: 60%; overflow-y: auto; width: 100%;" color="grey-darken-4">
      <v-card-actions>
        <v-card-title>Экраны</v-card-title>
        <v-spacer/>
        <v-btn variant="icon"
               icon="mdi-close"
               v-on:click="showDisplays = false"></v-btn>
      </v-card-actions>
      <display-switch
              :is-mobile="isMobile"
              :switch-display="onDisplaySwitch"
      ></display-switch>
    </v-card>

    <transition name="fade" mode="in-out">
      <show-presents v-if="showPresentation" class="main-display presents-sticky" :on-close="presentationsShowed"></show-presents>
    </transition>

    <v-card rounded="xl"
            v-if="smsShow"
            color="grey-darken-4"
            style="position: absolute"
            :style="{width: `${isMobile ? 90 : 50}%`, left: `${isMobile ? 5 : 25}%`}"
            :class="smsAnimation">
      <v-card-title>{{sms.number}}</v-card-title>
      <v-card-text>{{sms.text}}</v-card-text>
      <v-card-actions>
        <v-btn>Ответить</v-btn>
        <v-btn>Прочитано</v-btn>
      </v-card-actions>
    </v-card>
  </v-app>

</template>

<script>

  import DisplaySwitch from "@/components/DisplaySwitch";
  // import LogDisplay from "@/components/LogDisplay";
  import ShowPresents from "@/views/ShowPresents";

  export default {
    name: 'App',
    components: {
      ShowPresents,
      DisplaySwitch,
      // LogDisplay
    },
    data: () => ({
      showPresentation: true,
      smsShow: false,
      smsAnimation: '',
      sms: {
        number: null,
        text: null,
        date: null,
      },
      smsList: [],
      showDisplays: false,
    }),
    mounted() {
      setInterval(() => {this.showRandomSMS()}, 30000)
    },
    methods: {
      onDisplaySwitch() {
          this.showDisplays = false;
      },
      showRandomSMS() {
        const randList = ['e-bank', 'style-bank', 'b-bank', 'c-bank', 'k-bank', 'pop-socket-bank', 'tururu',
          'financial-pyramides', 'SPORT LOTO', 'vacation-bank', 'finchill', 'domdon-bank'];
        const shouldUseRandList = Math.random() * 100 > 50;
        let number = null;
        if( shouldUseRandList )
          number = this.getRandText(randList);
        else {
          number = `8${Math.ceil(Math.random()*(10**10))}`;
        }

        const texts = ['Объединяйтесь с близкими и получайте кешбэк 5% рублями на супермаркеты',
          'Кешбек 100% на доставку продуктов в Е-пятницу! Крутите барабан до 22 декабря и испытайтся свою удачу',
          'Разбираемся, как компании меняют число акций и как это влияет...',
          'Дарим кешбэк за покупку в супермаркете, кафе, в магазине одежды и обуви',
          'Платите за коммунальные услуги онлайн через наш банк с 23.11 по 10.12 и получите шанс выиграть...'
        ];

        const shouldUseRandText = Math.random() * 100 > 70;
        let text = null;
        if( shouldUseRandText )
          text = this.getRandText(texts);
        else {
          const services = ['кэшбэк', 'кредит', 'заём', 'инвестиции'];
          let is = ['отличное предложение', 'полный улёт', 'только у нас']
          for( let i = 0; i <  100; i+=10 )
            is.push(`${i}%`)

          let very = ['очень', 'супер', 'супер-пупер', 'мега', 'ультра', 'невиданно'];
          let deal = ['выгодное', 'красивое', ' только у нас', 'потрясающее'];

          text = `${this.getRandText(is)}: ${this.getRandText(services)} - ${this.getRandText(very)} ${this.getRandText(deal)}. Приходите к нам скорей!`
        }
        this.showSMS(number, text);
      },
      getRandText(container) {
        return container[Math.ceil(Math.random() * container.length)] || container[0];
      },
      showSMS(number, text) {
        this.smsShow = true;
        this.sms = {number, text, date: new Date()}
        console.log('show sms: ', this.sms);

        this.smsList.push(this.sms);
        this.smsAnimation = 'scrollable'
        setTimeout(() => {
          this.smsAnimation = 'scrollable-reverse'
          setTimeout(() => {
            this.sms = {number: null, text: null}
            this.smsShow = false;
          }, 1500)
        }, 5000)
      },

      presentationsShowed: function () {
        this.showPresentation = false;
      }
    },
    computed: {
      isMobile() {
        return window.innerWidth < 980;
      }
    }
  }
</script>

<style scoped>
  .main-display__secondary-view {
    height: 15vh;
  }

  .main-display__main-view {
    min-height: 80vh;
    max-height: 80vh;
  }

  @media screen and (max-width: 960px) {
    .main-display__main-view {
      min-height: 90vh;
      max-height: 90vh;
    }

  }
  .main-display {
    width: 100vw;
    height: 100vh;
  }

  .presents-sticky {
    position: sticky;
  }

  .main-display__bg {
    background-color: #212121;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 1.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  .scrollable {
    position: absolute;
    animation-name: scrolling-bottom;
    animation-duration: 2s;
    animation-fill-mode: forwards;
  }

  @keyframes scrolling-bottom {
    from {top: -40%}
    to {top: 2%;}
  }

  .scrollable-reverse {
    position: absolute;
    animation-name: scrolling-top;
    animation-duration: 2s;
    animation-fill-mode: forwards;
  }

  @keyframes scrolling-top {
    to {top: -40%}
    from {top: 2%;}
  }

</style>
