<template>
     <div class="mb-6">
    <v-row>
      <v-col cols="6">
        <h1 class="text-h4 mb-3 mt-7 ml-5">Avaliação</h1>
      </v-col>
    </v-row>
    </div>

    <v-container>
        <v-card class=" pa 6">
            <v-row class="align-center mb-6" >
                <v-col class="mt-6 ml-4" cols="6">
                    <h1>Pesquisa de satisfação</h1>
                </v-col>

              

            </v-row>

            <v-checkbox v-model="FormAvaliation.enable" label="Habilitar Pesquisa de Satisfação" class="ml-2"></v-checkbox>


            <div class="text-caption ml-5 mb-6 fixed-textarea" no-resize>
                Tempo limite de avaliação em minutos
            <v-text-field v-model="FormAvaliation.time" label="Tempo limite" variant="solo-filled" type="number" suffix="minutos" class="mr-200 mt-4 fixed-textarea" no-resize/>

            </div>

            <v-textarea v-model='FormAvaliation.request' label="Solicitar avaliação" variant="solo-filled"  rows="4" class="ml-4 mr-4 fixed-textarea" auto-grow="false" no-risize></v-textarea>

            <div class="text-captain mb-6 ml-4 " auto-grow="false" no-risize >
                Esta mensagem será enviada após o atendimento
            </div>

            <v-textarea v-model="FormAvaliation.thanks" label="Agradecemos pela avaliação" variant="solo-filled" rows="4" class="ml-4 mr-4"  auto-grow="false" no-risize></v-textarea>

            <v-textarea v-model="FormAvaliation.error" label="Erro na escolha das opções" variant="solo-filled" rows="4" class="ml-4 mr-4" auto-grow="false" no-risize></v-textarea>
            
            <v-dialog max-width="500">
                <template v-slot:activator="{ props: activatorProps }">
                    <div class="d-flex justify-sm-center mb-7 mt-2">
                        <v-btn
                            v-bind="activatorProps"
                            color="primary"
                            text="Salvar"
                            variant="flat"
                            @click="save"
                        ></v-btn>
                    </div>
                 
                </template>

                <template v-slot:default="{ isActive }">
                            <v-card color="#4aa832">
                            
                            <v-card-text class="mt-15 ml-30" >
                            <h1>
                                <v-icon class="mr-2  " icon="mdi-check-bold"></v-icon>
                                Alterações salvas !
                                </h1>

                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>

                                <v-btn
                                text="Fechar"
                                @click="isActive.value = false"
                                class="mr-50"
                                ></v-btn>
                            </v-card-actions>
                            </v-card>
                </template>
</v-dialog>

        </v-card>
    </v-container>
  
</template>

<script setup>
import { ref, onMounted } from 'vue'

const FormAvaliation = ref({
  enable: false,
  time: '',
  request: '',
  thanks: '',
  error: ''
})

const save = () => {
  localStorage.setItem(
    "avaliacaoConfig",
    JSON.stringify(FormAvaliation.value)
  )

  console.log("Dados salvos:", FormAvaliation.value)
}

onMounted(() => {

  const saved = localStorage.getItem("avaliacaoConfig")

  if (saved) {
    FormAvaliation.value = JSON.parse(saved)
  }

})
</script>