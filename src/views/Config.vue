<template>
    <div class="all">
        <div class="flex w-full">
            <h1 class="w-full text-[30px] text-center text-white">
                Config
            </h1>
        </div>
        <div>
            <p>texto</p>
        </div>
    </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue';

const itemCard = ref([
    {
        title: 'Plaug-in',
        subtitle: 'Configurar os plug-in',
        icon: 'icon aqui'

    }
])

</script>


<style scoped>
    .all {
        background-color: rgb(7, 17, 47) ;
    }
</style>