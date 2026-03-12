<template>
    <div class="mb-6">
        <v-row>
            <v-col cols="6">
                <h1 class="text-h4 mb-8 mt-7 ml-5">Funil</h1>
            </v-col>
        </v-row>
    </div>
<v-sheet height="70" color="#f5f5f5" class="d-flex justify-center align-center ">

<v-card class="mb-20 pa-6" elevation="4">
  <v-card-title>
    Listagem dos Funis de mensagem
  </v-card-title>

  <div class="d-flex align-center ga-3 mb-5">

    <v-text-field label="Nome do funil" append-inner-icon="mdi-magnify" density="compact" variant="outlined" style="width: 260px" hide-details/>

    <v-btn color="primary" prepend-icon="mdi-refresh">
      ATUALIZAR
    </v-btn>

    <v-btn @click="dialog = true" color="#080808"  prepend-icon="mdi-history"  >
      HISTÓRICO DE ENVIOS
    </v-btn>


<v-dialog v-model="dialog" max-width="1500" class="ga-2" >
  <v-card  prepend-icon="mdi-history" title="Histórico de envios">
    <v-card-subtitle class="ml-9">Filtros (Data de envio)</v-card-subtitle>

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

    <v-card-actions class="justify-center " >
      <v-btn color="primary" @click="dialog = false" >
        OK
      </v-btn>
    </v-card-actions>

  </v-card>
</v-dialog >

<div class="text-center">
    <v-dialog
      v-model="novoModal"
      max-width="1200"
    >
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn
          class="text-none font-weight-regular"
          prepend-icon="mdi-plus"
          text="Novo"
          color="primary"
          v-bind="activatorProps"
        ></v-btn>
      </template>

      <v-card
        prepend-icon="mdi-filter-outline"
        title="Cadastrando Funil"
        class=""
      >
        <v-card-text>
          <v-row density="comfortable">
          
            <v-col
              cols="12"
              md="3"
              sm="6"
            >
              <v-text-field
                label="Nome"
                v-model="nome"
                required
              ></v-text-field>
            </v-col>

             <v-col
              cols="12"
              md="3"
              sm="6"
            >
              <v-select
                :items="['ABORDAGEM','CALL','FECHAMENTO','FINANCEIRO','ONBOARDING','SUPORTE']"
                label="Departamento"
                v-model="departamento"
                required
              ></v-select>
            </v-col>

            <v-col
              cols="12"
              md="3"
              sm="6"
            >
              <v-select
                :items="['Faculdade Chat', 'Advocacia  Chat']"
                label="Canal"
                v-model="canal"
                required
              ></v-select>
            </v-col>

            <v-col
              cols="12"
              md="3"
              sm="6"
            >
              <v-autocomplete
                :items="['Enviar para departamento','Fechar atendimento']"
                label="Ação"
                v-model="acao"
                required
              ></v-autocomplete>
            </v-col>
          </v-row>

          <small class="text-body-small text-medium-emphasis">* Caso adicione mídias na etapa, considere salvar sempre que finalizar a configuração desta etapa, minimizando problemas com o tamanho das mídias. </small>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            text="Sair"
            variant="plain"
            @click="novoModal = false"
          ></v-btn>

          <v-btn
            color="primary"
            text="Salvar"
            variant="tonal"
            @click="novoModal = false ; adicionarFunil()"
           
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
  </div>
  
  </div>
</v-card>

</v-sheet>

<v-card 
  v-for="(item,index) in tabela"
  :key="index"
  class="mt-5 me-n10 pa-10 pb-16"

  >
<v-card-actions class="d-flex justify-md-end" >

    <v-btn class="mdi mdi-delete-outline" color="#d10d0d" text="Deletar" ></v-btn>

    <v-btn class="mdi mdi-pencil-outline" color="#c25b0c" text="Editar"></v-btn>

    <v-btn class="mdi mdi-account-multiple" color="primary" text="Adicionar Leed"></v-btn>

</v-card-actions>

  <v-card-title>
    {{ item.nome }}
  </v-card-title>

  <v-card-subtitle>
    Departamento: {{ item.departamento}} |
    Canal: {{ item.canal }} |
    Ação: {{ item.acao }} |
  </v-card-subtitle>
  
</v-card>

  </template>
  
<script setup>
  import {ref, shallowRef} from 'vue'

  const dialog = ref(false)
  const novoModal = shallowRef(false)

  const nome = ref('')
  const departamento = ref('')
  const canal = ref('')
  const acao = ref('')
  
  const tabela=ref([])

  function adicionarFunil(){
  tabela.value.push({
    nome:nome.value,
    departamento:departamento.value,
    canal:canal.value,
    acao:acao.value
  })

  nome.value=''
  departamento.value=''
  canal.value=''
  acao.value=''
}
</script>