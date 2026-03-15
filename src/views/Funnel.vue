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

        <v-text-field label="Nome do funil" append-inner-icon="mdi-magnify" density="compact" variant="outlined"
          style="width: 260px" hide-details />

        <v-btn color="primary" prepend-icon="mdi-refresh">
          ATUALIZAR
        </v-btn>

        <v-btn @click="dialog = true" color="#080808" prepend-icon="mdi-history">
          HISTÓRICO DE ENVIOS
        </v-btn>


        <v-dialog v-model="dialog" max-width="1500" class="ga-2">
          <v-card prepend-icon="mdi-history" title="Histórico de envios">
            <v-card-subtitle class="ml-9">Filtros (Data de envio)</v-card-subtitle>

            <v-card-text>

              <v-row align="center">

                <v-col cols="3" class="mt-6">
                  <v-text-field v-model="startDate" label="Data Início" type="datetime-local" variant="outlined"
                    density="compact" />
                </v-col>

                <v-col cols="3" class="mt-6">
                  <v-text-field v-model="endDate" label="Data Final" type="datetime-local" variant="outlined"
                    density="compact" />
                </v-col>

                <v-col cols="2">
                  <v-text-field label="Nome do Funil" variant="outlined" density="compact" hide-details />
                </v-col>

                <v-col cols="2">
                  <v-text-field label="Nome do Lead" variant="outlined" density="compact" hide-details />
                </v-col>

                <v-col cols="2" class="d-flex align-center">
                  <v-btn rounded="10" icon="mdi-magnify" color="primary"></v-btn>
                </v-col>

              </v-row>
            </v-card-text>

            <v-card-actions class="justify-center ">
              <v-btn color="primary" @click="dialog = false">
                OK
              </v-btn>
            </v-card-actions>

          </v-card>
        </v-dialog>

        <div class="text-center">
          <v-dialog v-model="novoModal" max-width="1200" persistent="true">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn class="text-none font-weight-regular" prepend-icon="mdi-plus" text="Novo" color="primary"
                v-bind="activatorProps"></v-btn>
            </template>

            <v-card prepend-icon="mdi-filter-outline" title="Cadastrando Funil" class="">
              <v-card-text>
                <v-row density="comfortable">

                  <v-col cols="12" md="3" sm="6">
                    <v-text-field label="Nome" v-model="name" required></v-text-field>

                    <v-btn class="text-none font-weight-regular" prepend-icon="mdi-plus" text="Criar mensagens"
                      color="primary" @click="dialogMensagem = true"></v-btn>
                  </v-col>
                  <v-dialog v-model="dialogMensagem" width="500" persistent="true">

                    <v-card>

                      <v-card-title>
                        Nova mensagem
                      </v-card-title>

                      <v-card-text>

                        <v-textarea v-model="newMensagem" label="Digite a mensagem" rows="4"
                          variant="outlined"></v-textarea>

                      </v-card-text>

                      <v-card-actions class="justify-end">

                        <v-btn variant="text" @click="dialogMensagem = false">
                          Cancelar
                        </v-btn>

                        <v-btn color="primary" @click="salvarMensagem">
                          Salvar
                        </v-btn>

                      </v-card-actions>

                    </v-card>

                  </v-dialog>

                  <v-col cols="12" md="3" sm="6">
                    <v-select :items="['ABORDAGEM', 'CALL', 'FECHAMENTO', 'FINANCEIRO', 'ONBOARDING', 'SUPORTE']"
                      label="Departamento" v-model="departament" required></v-select>
                  </v-col>

                  <v-col cols="12" md="3" sm="6">
                    <v-select :items="['Faculdade Chat', 'Advocacia  Chat']" label="Canal" v-model="channel"
                      required></v-select>
                  </v-col>

                  <v-col cols="12" md="3" sm="6">
                    <v-autocomplete :items="['Enviar para departamento', 'Fechar atendimento']" label="Ação"
                      v-model="action" required></v-autocomplete>

                  </v-col>
                </v-row>



                <small class="text-body-small text-medium-emphasis">* Caso adicione mídias na mensagem, considere salvar
                  sempre que
                  finalizar a configuração desta etapa, minimizando problemas com o tamanho das mídias. </small>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn text="Sair" variant="plain" @click="novoModal = false"></v-btn>

                <v-btn color="primary" text="Salvar" variant="tonal"
                  @click="novoModal = false; adicionarFunil()"></v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

        </div>

      </div>
    </v-card>

  </v-sheet>

  <v-card v-for="(item, index) in tabela" :key="index" class="mt-5 me-n10 pa-10 pb-16">
    <v-card-actions class="d-flex justify-md-end">

      <v-btn class="mdi mdi-delete-outline" color="#d10d0d" text="Deletar"></v-btn>

      <v-btn class="mdi mdi-pencil-outline" color="#c25b0c" text="Editar" @click="edit(index)"></v-btn>

      <v-btn class="mdi mdi-account-group" color="#121111" text="Leeds no funil"></v-btn>

      <v-btn class="mdi mdi-account-multiple-plus" color="primary" text="Adicionar Leed"></v-btn>

    </v-card-actions>

    <v-card-title>
      {{ item.name }}
    </v-card-title>

    <v-card-subtitle>
      Departamento: {{ item.departament }} |
      Canal: {{ item.channel }} |
      Ação: {{ item.action }} |
    </v-card-subtitle>
    <v-row class="mt-6" v-for="(msg, index) in mensagens.filter((m) => m.funilId === item.id)" :key="index">

      <v-col cols="12" md="4">

        <v-card class="pa-3">

          <v-avatar color="primary">
            {{ index + 1 }}
          </v-avatar>

          <div class="mt-2">
            {{ msg.text }}
          </div>

        </v-card>

      </v-col>

    </v-row>


  </v-card>

</template>

<script setup>
import { ref, shallowRef } from 'vue'

const dialog = ref(false)
const novoModal = shallowRef(false)

const name = ref('')
const departament = ref('')
const channel = ref('')
const action = ref('')
const dialogMensagem = ref(false)

const mensagens = ref([])
const newMensagem = ref('')

const tabela = ref([])
const id_tabela = ref(0)

const adicionarFunil = () => {
  tabela.value.push({
    id: id_tabela.value++,
    name: name.value,
    departament: departament.value,
    channel: channel.value,
    action: action.value
  })

  name.value = ''
  departament.value = ''
  channel.value = ''
  action.value = ''
}
const salvarMensagem = () => {
  mensagens.value.push({
    funilId: id_tabela.value,
    text: newMensagem.value,
    leads: 0,
    sends: 1,
    time: 60
  })
  newMensagem.value = ''
  dialogMensagem.value = false
}

const edit = (index) => {
  console.log('index de edicao', index)
}
</script>