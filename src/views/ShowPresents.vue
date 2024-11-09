<template>
    <v-sheet class="d-flex flex-column justify-center align-center">
        <div>
            The
            <strong>0x001s</strong>
            command
            presents:
        </div>

        <div class="show_presents__logo-font">
            The Social
        </div>

        <v-img :src="logo" alt="" width="200" max-height="200"></v-img>
    </v-sheet>
</template>

<script>
    const logo = require('@/assets/lotus.png');

    export default {
        name: "ShowPresents",
        props: {
            onClose: Function
        },
        mounted() {
            setTimeout(() => {
                this.onClose();
            }, 2000)
        },
        data: () => {
            return {
                logo
            }
        }
    }
</script>

<style scoped>
.show_presents__logo-font {
    font-size: 5rem;
    font-weight: 300;
}
</style>
