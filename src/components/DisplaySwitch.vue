<template>
    <v-sheet color="transparent" :class="isMobile? 'mobile-scroll' : ''">
        <div :class="isMobile ? 'd-flex flex-column align-center' : 'd-flex flex-row justify-center'">
            <template  v-for="display of displayList"
                       :key="`display-mini-${display.id}`">
                <v-hover v-slot="{ isHovering, props }">
                    <v-card
                            variant="flat"
                            color="transparent"
                            :class="isMobile? 'my-2' : 'mx-2'"
                            v-on:click="handleRoute(display.component)"
                    >
                        <v-img
                                :class="isHovering ? 'zoom' : 'no-zoom'"
                                v-bind="props"
                                :src="display.img"
                                aspect-ratio="16/9"
                                :height="135"
                                :width="240"
                                alt=""
                        >
                            <v-card-title class="text-center"
                                          style="position:relative; top: 70%"
                                          :style="{color: isHovering ? 'gray' : 'black'}"
                            >
                                {{display.name}}
                            </v-card-title>
                        </v-img>
                    </v-card>
                </v-hover>
            </template>
        </div>
    </v-sheet>
</template>

<script>
    import displayList from "@/router/displays";
    export default {
        name: "DisplaySwitch",
        props: {
            switchDisplay: Function,
            isMobile: Boolean
        },
        data: () => {
            return {
                displayList
            }
        },
        methods: {
            handleRoute(name) {
                this.switchDisplay(name);
                this.$router.push(name);
            }
        }
    }
</script>

<style>
    .mobile-scroll {
        max-height: 50%;
        overflow-y: auto
    }
    .v-responsive {.v-img__img { transition: all 0.2s; } &.zoom { .v-img__img { transform: scale(1.2); } } }
    .v-responsive {.v-img__img { transition: all 0.2s; } &.no-zoom { .v-img__img { transform: scale(1); } } }
</style>
