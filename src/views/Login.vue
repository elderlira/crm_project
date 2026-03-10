<template>
  <v-container fluid class="fill-height ma-0 pa-0">
    <v-row class="fill-height">

      <v-col cols="12" lg="5" md="5" sm="5" class="d-flex align-center justify-center">
        <v-card width="400" elevation="6" rounded="xl">
          <v-card-title class="text-h5 text-center">
            Login
          </v-card-title>

          <v-card-text>
            <v-form>
              <v-text-field label="E-mail" type="email" v-model="form.email" append-inner-icon="mdi-email"
                :rules="emailRules" required />
              <v-text-field label="Senha" :type="show ? 'text' : 'password'"
                :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'" v-model="form.password" :rules="passwordRules"
                @click:append-inner="show = !show" required />
              <v-btn variant="text" size="small" class="text-none " color="primary" to="/forgot-password">
                Esqueci minha senha
              </v-btn>
            </v-form>
          </v-card-text>

          <v-card-actions class="d-flex flex-column gap-4 ">
            <v-spacer />
            <v-btn class="text-primary" @click="handleLogin">
              Entrar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" lg="7" md="7" sm="7" class="d-none d-flex bg-grey-lighten-3 bg-black ma-0 pa-0">
        <v-img src="../assets/crm.png"></v-img>
      </v-col>


    </v-row>

    <v-dialog v-model="validation" max-width="400" persistent>
      <v-card class="justify-center align-center">
        <v-card-title class="text-h5 " style="color:red">
          Erro
        </v-card-title>
        <v-card-text>
          <v-row> Usuário ou senha inválidos. </v-row>
          <v-row> Por favor, tente novamente. </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="cleanFields">
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../services/authStore'
const router = useRouter()
const auth = useAuthStore()

const show = ref(false)

const form = ref({
  email: '',
  password: ''
})

const error = ref("")

const emailRules = [
  (v) => !!v || 'Email é obrigatório',
  (v) => /.+@.+\..+/.test(v) || 'Email deve ser válido'
]

const passwordRules = [
  (v) => !!v || 'Senha é obrigatória',
  (v) => v.length >= 6 || 'Senha deve conter no mínimo 6 caracteres'
]

const validation = ref(false)

const handleLogin = async () => {
  try {

    await auth.signIn(form.value.email, form.value.password)
    router.push("/")

  } catch (err) {

    validation.value = true;

  }
}

const cleanFields = () => {
  validation.value = false
  form.value.email = ''
  form.value.password = ''
}
</script>
