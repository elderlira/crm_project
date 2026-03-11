<template>
    <div class="mb-6">
        <v-row>
            <v-col cols="6">
                <h1 class="text-h4 mb-6 mt-3 ml-4">Leads </h1>
            </v-col>
        </v-row>
    </div>
<v-sheet height="70" color="#f5f5f5" class="d-flex justify-center align-center">

<v-card class="pa-8" elevation="4">
  <v-card-title>
    Listagem dos Funis de mensagem
  </v-card-title>

  <div class="d-flex align-center ga-3">

    <v-text-field label="Nome do funil" append-inner-icon="mdi-magnify" density="compact" variant="outlined" style="width: 260px" hide-details/>

    <v-btn color="primary" prepend-icon="mdi-refresh">
      ATUALIZAR
    </v-btn>

    <v-btn @click="dialog = true" color="#080808" prepend-icon="mdi-history" >
      HISTÓRICO DE ENVIOS
    </v-btn>


<v-dialog v-model="dialog" max-width="1500" class="ga-2" >
  <v-card title="Histórico de envios">
    <v-card-subtitle class="ml-2">Filtros (Data de envio)</v-card-subtitle>

    <v-card-text>
      
      <v-row align="center">

        <v-col cols="3" class="mt-6">
          <v-text-field v-model="startDate" label="Data Início" type="datetime-local" variant="outlined" density="compact"/>
        </v-col>

        <v-col cols="3" class="mt-6">
          <v-text-field v-model="endDate" label="Data Final" type="datetime-local" variant="outlined" density="compact"/>
        </v-col>

        <v-col cols="2">
          <v-text-field label="Nome do Funil" variant="outlined" density="compact" hide-details/>
        </v-col>

        <v-col cols="2">
          <v-text-field label="Nome do Lead" variant="outlined" density="compact" hide-details/>
        </v-col>

        <v-col cols="2" class="d-flex align-center">
          <v-btn rounded="10" icon="mdi-magnify" color="primary"></v-btn>
        </v-col>

      </v-row>
    </v-card-text>

    <v-table theme="white">
   <thead>
    <tr>
      <th class="text-left">Funil</th>
      <th class="text-left">Data</th>
      <th class="text-left">Canal</th>
      <th class="text-left">Nome</th>
      <th class="text-left">Mensagens</th>
    </tr>
  </thead>
    </v-table>

    <v-card-actions class="justify-center" >
      <v-btn color="primary" @click="dialog = false">
        OK
      </v-btn>
    </v-card-actions>

  </v-card>
</v-dialog>

    <v-btn color="primary" prepend-icon="mdi-plus" >
      NOVO
    </v-btn>

  </div>
</v-card>
</v-sheet>
    

  </template>
  
<script setup>
  import {ref} from 'vue'
  const dialog = ref(false)
</script>