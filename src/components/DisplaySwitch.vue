<template>
    <v-sheet color="transparent">
        <div class="d-flex flex-row justify-center">
            <template  v-for="display of displayList"
                       :key="`display-mini-${display.id}`">
                <v-hover v-slot="{ isHovering, props }">
                    <v-card
                            color="transparent"
                            class="mx-2"
                            v-on:click="$router.push(display.component)"
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
            switchDisplay: Function
        },
        data: () => {
            return {
                displayList
            }
        }
    }
</script>

<style>
    .v-responsive {.v-img__img { transition: all 0.2s; } &.zoom { .v-img__img { transform: scale(1.2); } } }
    .v-responsive {.v-img__img { transition: all 0.2s; } &.no-zoom { .v-img__img { transform: scale(1); } } }
</style>
