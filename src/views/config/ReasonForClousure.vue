<template>
    <h1>Motivo do fechamento</h1>
    <v-data-table :items="items"></v-data-table>
</template>

<script setup lang="ts">
const items = [
{
      name: 'African Elephant',
      species: 'Loxodonta africana',
      diet: 'Herbivore',
      habitat: 'Savanna, Forests',
    },
]

</script>