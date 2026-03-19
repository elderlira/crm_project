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
          <v-dialog v-model="newModal" max-width="1200" persistent=true>
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn class="text-none font-weight-regular" prepend-icon="mdi-plus" text="Novo" color="primary"
                v-bind="activatorProps"></v-btn>
            </template>

            <v-card prepend-icon="mdi-filter-outline" title="Cadastrando Funil" class="">
              <v-form>
              <v-card-text>
                <v-row density="comfortable">

                  <v-col cols="12" md="3" sm="6">
                    <v-text-field label="Nome" v-model="name" :rules="[rules.required]"></v-text-field>

                    <v-btn class="text-none font-weight-regular" prepend-icon="mdi-plus" text="Criar mensagem"
                      color="primary" @click="dialogMessage = true"></v-btn>
                  </v-col>
                  <v-dialog v-model="dialogMessage" width="500" persistent=true>

                    <v-card>

                      <v-card-title>
                        Nova mensagem
                      </v-card-title>

                      <v-card-text>

                        <v-textarea v-model="newMessage" label="Digite a mensagem" rows="4"
                          variant="outlined"></v-textarea>

                      </v-card-text>

                      <v-card-actions class="justify-end">

                        <v-btn variant="text" @click="dialogMessage = false">
                          Cancelar
                        </v-btn>

                        <v-btn color="primary" @click="saveMessage">
                          Salvar
                        </v-btn>

                      </v-card-actions>

                    </v-card>

                  </v-dialog>

                  <v-col cols="12" md="3" sm="6">
                    <v-select :items="['ABORDAGEM', 'CALL', 'FECHAMENTO', 'FINANCEIRO', 'ONBOARDING', 'SUPORTE']"
                      label="Departamento" v-model="departament" :rules="[rules.required]"></v-select>
                  </v-col>

                  <v-col cols="12" md="3" sm="6">
                    <v-select :items="['Faculdade Chat', 'Advocacia  Chat']" label="Canal" :rules="[rules.required]" v-model="channel "
                      required></v-select>
                  </v-col>

                  <v-col cols="12" md="3" sm="6">
                    <v-autocomplete :items="['Enviar para departamento', 'Fechar atendimento']" label="Ação"
                      v-model="action" :rules="[rules.required]"></v-autocomplete>

                  </v-col>
                </v-row>



                <small class="text-body-small text-medium-emphasis">* Caso adicione mídias na mensagem, considere salvar
                  sempre que
                  finalizar a configuração desta etapa, minimizando problemas com o tamanho das mídias. </small>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn text="Sair" variant="plain" @click="newModal = false"></v-btn>

                <v-btn color="primary" text="Salvar" variant="tonal"
                  @click="newModal = false; adicionarFunil()"></v-btn>
              </v-card-actions>
            </v-form>

            </v-card>
          </v-dialog>

        </div>

      </div>
    </v-card>

  </v-sheet>

<v-card v-for="item in table" :key="item.id" class="ml-8 mr-8 mt-10 mb-5 pb-16">
    <v-card-actions class="d-flex mt-4 justify-md-end">

  
      <v-btn class="mdi mdi-delete-outline" color="#d10d0d" variant="tonal" text="Deletar" @click="confirmDelete(item)">

      </v-btn>

     <v-dialog v-model="deleteDialog" max-width="400" >

        <v-card title="Confirmar Exclusão">

          <v-card-text>
            <p>
              Você tem certeza que deseja deletar o funil
              <strong>{{ itemToDelete?.name }}</strong>?
            </p>

            <p class="text-caption text-error">
              Esta ação não pode ser desfeita.
            </p>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions >

            <v-spacer></v-spacer>

            <v-btn color="primary" variant="text" @click="deleteDialog = false" class="mr-47">
              Cancelar
            </v-btn>

            <v-btn color="error" @click="deletarFunnel" variant="tonal">
              Deletar
            </v-btn>

          </v-card-actions>

        </v-card>

    </v-dialog>
      <v-btn class="mdi mdi-pencil-outline" color="#c25b0c" variant="outlined" text="Editar" @click="edit(index)"></v-btn>

      <v-dialog
      v-model="funnilLeads"
      max-width="600"
      persistent=true
    >
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn class="mdi mdi-account-group" color="#121111" variant="outlined" text="Leads no funil" @click="openFunnilLead(item.id)"></v-btn>
              </template>
              <template v-slot:default="{ isActive }">
                <div v-if="formLeadsSave">
                  
                  <v-data-table :headers="headers"  :items="leadsTabela" hide-default-footer class="pa-8" > </v-data-table>
                  <v-btn class="d-flex ml-68 mt-5" text="ok" @click="funnilLeads = !funnilLeads">

          </v-btn>
        </div>
        <div v-else>
          {{ "Sem dados" }}
        </div>
      </template>
      </v-dialog>

      <v-btn class="mdi mdi-account-multiple-plus" color="primary" variant="outlined" text="Adicionar Leed" @click="openAddLead(item)" ></v-btn>
        <template>
  <div class="pa-4 text-center">
    <v-dialog
      v-model="addlead"
      max-width="600"
      persistent=true

    >
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn
          class="text-none font-weight-regular"
          prepend-icon="mdi-account"
          text="Edit Profile"
          variant="tonal"
          v-bind="activatorProps"
        ></v-btn>
      </template>

      <v-card
        prepend-icon="mdi-account"
        title="Informações do Lead"
      >
        <v-card-text>
          <v-row density="comfortable">
            <v-col
              cols="12"
              md="6"
              sm="6"
            >
              <v-text-field
                label="Nome"
                :rules="[(v) => !!v || 'Nome é obrigatório']"
                v-model="formLead.nome"

              ></v-text-field>
            </v-col>

            <v-col
              cols="12"
              md="6"
              sm="6"
            >
              <v-text-field
                hint="o formato DDD + número . "
                type="text"
                label="Telefone"
                form="form.telefone"
                v-model="formLead.telephone"
                :rules="telephoneRules"
                maxlength="11"

                
              ></v-text-field>
            </v-col>

            <v-col
              cols="12"
              md="6"
              sm="6"
            >
              <v-text-field
                label="Etiqueta"
                persistent-hint=true
                :rules="[(v) => !!v || 'Etiqueta é obrigatório']"
                v-model="formLead.etiqueta"
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              md="6"
              sm="6"
            >
              <v-select
                label="Estado"
                :items=estados
                :rules="[(v) => !!v || 'Estado é obrigatório']"
                v-model="formLead.estado"
              ></v-select>
            </v-col>
          </v-row>

          <small class="text-body-small text-medium-emphasis">*Preencha as colunas</small>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            text="Cancelar"
            variant="plain"
            @click="addlead = false"
          ></v-btn>

          <v-btn
            color="primary"
            text="Salvar"
            variant="tonal"
            @click=addNewLead 
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

    </v-card-actions>

    <v-card-title>
      {{ item.name }}
    </v-card-title>

    <v-card-subtitle>
      Departamento: {{ item.departament }} |
      Canal: {{ item.channel }} |
      Ação: {{ item.action }} |
    </v-card-subtitle>
    <v-row class="mt-6" >

      <v-col v-for="(msg, index) in menssage.filter((m) => m.funilId === item.id)" :key="index" cols="12" md="4">

        <v-card class="ml-4  pa-3">

  <div class="d-flex justify-space-between align-center">

    <div>

      <v-avatar color="primary" class="mb-2">
        {{ index + 1 }}
      </v-avatar>

      <div class="mt-2">
        {{ msg.text }}
      </div>

    </div>

    <v-btn
      icon="mdi-pencil"
      size="small"
      @click="openEditMensage(msg)"
      variant="tonal"
    ></v-btn>

  </div>

  <v-dialog v-model="dialogEditMessage" max-width="500">

  <v-card>

    <v-card-title>
      Editar mensagem
    </v-card-title>

    <v-card-text>

      <v-textarea
        v-model="textEdit"
        label="Editar mensagem"
        rows="4"
        variant="outlined"
      ></v-textarea>

    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>

      <v-spacer></v-spacer>

      <v-btn variant="text" @click="dialogEditMessage = false">
        Cancelar
      </v-btn>

      <v-btn color="primary" @click="saveEditMensage">
        Salvar
      </v-btn>

    </v-card-actions>

  </v-card>

</v-dialog>

</v-card>
</v-col>
</v-row>
</v-card>
</template>

<script setup>
import { ref, shallowRef, computed } from 'vue'

const dialog = ref(false)
const addlead = ref(false)
const newModal = shallowRef(false)

const name = ref('')
const departament = ref('')
const channel = ref('')
const action = ref('')
const dialogMessage = ref(false)

const menssage = ref([])
const newMessage= ref('')

const table = ref([])
const id_table = ref(0)

const deleteDialog = ref(false)
const itemToDelete = ref(null)

const dialogEditMessage = ref(false)
const messageEdit = ref(null)
const textEdit = ref('')

const funilAtual = ref(null)
const leadId = ref(0)

const formLead = ref({
  nome:'',
  etiqueta:'',
  telefone:'',
  estado:''
})

const estados=['Acre','Alagoas','Amapá','Amazonas','Bahia','Ceará','Distrito Federal','Espírito Santo','Goiás','Maranhão','Mato Grosso','Mato Grosso do Sul','Minas Gerais','Pará','Paraíba','Paraná','Pernanmbuco','Piauí','Rio de Janeiro','Rio Grande do Norte','Rio grande do Sul','Rondônia','Roraima','Santa Catarina','São Paulo','Sergipe','Tocantins']

const formLeadsSave=ref([])

const funnilLeads=ref(false)

const headers = [
  { title: 'Nome', key: 'name' },
  { title: 'Etiqueta', key: 'etiqueta' },
  { title: 'Telefone', key: 'telefone' },
  { title: 'Estado', key: 'estado' }
]

const leadsTabela = computed(() => {
  return formLeadsSave.value
    .filter(l => l.funilId === funilAtual.value)
    .map(l => ({
      name: l.name,
      etiqueta: l.etiqueta,
      telefone: l.telefone,
      estado: l.estado
    }))
})

const openFunnilLead = (id)=>{
  funilAtual.value = id
  funnilLeads.value = true
}

const addNewLead = () => {

  formLeadsSave.value.push({
    id: leadId.value++,
    funilId: funilAtual.value,
    name: formLead.value.nome,
    etiqueta: formLead.value.etiqueta,
    telefone: formLead.value.telefone,
    estado: formLead.value.estado
  })

  addlead.value = false
}

const adicionarFunil = () => {
  table.value.push({
    id: id_table.value++,
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
const saveMessage = () => {

  menssage.value.push({
    funilId: id_table.value,
    text: newMessage.value,
    leads: 0,
    sends: 1,
    time: 60
  })
  newMessage.value = ''
  dialogMessage.value = false
}

const edit = (index) => {
  console.log('index de edicao', index)
}

const deletarFunnel = () => {

  table.value = table.value.filter(
    funil => funil.id !== itemToDelete.value.id
  )

  deleteDialog.value = false
  itemToDelete.value = null
}

const confirmDelete = (item) => {
  itemToDelete.value = item
  deleteDialog.value = true
}

const openEditMensage = (msg) => {
  messageEdit.value = msg
  textEdit.value = msg.text
  dialogEditMessage.value = true
}

const saveEditMensage = () => {

  if (messageEdit.value) {
    messageEdit.value.text = textEdit.value
  }

  dialogEditMessage.value = false
  messageEdit.value = null
  textEdit.value = ''
}
const clear = () =>{
  formLead.value={
    nome:'',
    etiqueta:'',
    telefone:'',
    estado:''
  }
}

const openAddLead = (item) => {
  funilAtual.value = item.id
  addlead.value = true
  clear()
}
const rules = ref({
  required: (value) => !!value || 'Campo obrigatório'
});

const telephoneRules = [
  v => !!v || 'Telefone é obrigatório',
  v => /^[0-9]{10,11}$/.test(v) || 'Telefone inválido (DDD + número)'
]
</script>