<template>
    <div class="mb-6">
    <v-row>
      <v-col cols="6">
        <h1 class="text-h4 mb-8 mt-7 ml-5">Auditoria</h1>
      </v-col>
    </v-row>
  </div>


    <v-card class="mb-10 pa-4 ml-4 mr-4" elevation="4">
      <v-card-title >
        Pesquisa por atividade
      </v-card-title>

      <v-card-text>
         <v-row align="center">

              <v-col cols="3" class="mt-6">
               <v-select
                    label="Pessoa"
                    :items="['User', 'Elder', 'Admin', 'Bruno']"
                    variant="outlined"
                 ></v-select>
        
        </v-col>
            <v-col cols="3" class="mt-6">
                <v-select
                        label="Departamento"
                        :items="['ABORDAGEM','CALL','FECHAMENTO','FINANCIERO','ONBOARDING','SUPORTE']"
                        variant="outlined"
                    ></v-select>
            </v-col>
          <v-col cols="2" class="mt-6">
               <v-select
                    label="Tipo"
                    :items="['Criação de Usuário', 'Exclusão de Usuário', 'Alteração de Permissão', 'Login de Usuário','Redefinição de Senha','Exclusão de Contato ']"
                    variant="outlined"
                 ></v-select>
        </v-col>
        <v-col cols="2" class="mt-6">
                  <v-text-field label="Data Início" type="datetime-local" variant="outlined"
                    density="compact" />
                </v-col>

                <v-col cols="2" class="mt-6">
                  <v-text-field label="Data Final" type="datetime-local" variant="outlined"
                    density="compact" />
                </v-col>

                <v-btn color="primary" class="ml-6">
                    Pesquisar
                </v-btn>


         </v-row>
      


      
      </v-card-text>

   
    </v-card>

    <div class="ml-5 mr-5 elevation-4 rounded-lg" >
    <v-data-table-virtual
        :headers="headers"
        :items="boats"
        height="520"
        item-value="name"
        fixed-header
    ></v-data-table-virtual>
    </div>

 

</template>

<script setup>
  import { computed } from 'vue'

  const headers = [
    { title: 'Nome', align: 'start', key: 'name' },
    { title: 'Operação', align: 'end', key: 'type' },
    { title: 'Data e Hora', align: 'end', key: 'time' },
  ]

  const boats = [
    {
      name: 'Bruno',
      type: 'Login de Usuário',
      time: '24/01/2026 às 10:00:00',
    },
    {
      name: 'Admin',
      type: 'Alteração de Permissão',
      time: '01/02/2026 às 14:00:00',
    },
    {
      name: 'Elder',
      type: 'Login de Usuário',
      time: '04/01/2026 às 18:00:00',
    },
    {
      name: 'Admin',
      type: 'Redefinição de Senha',
      time: '20/01/2026 às 12:00:00',
    },
    
  ]

  const virtualBoats = computed(() => {
    return [...Array(10000).keys()].map(i => {
      const boat = { ...boats[i % 10] }
      boat.name = `${boat.name} #${i}`
      return boat
    })
  })

  function formatPrice (value) {
    return `$${value.toFixed(0).replace(/\d(?=(\d{3})+$)/g, '$&,')}`
  }
</script>