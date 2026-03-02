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
              <v-text-field
                label="E-mail"
                type="email"
                v-model="form.email"
                append-inner-icon="mdi-email"
                :rules="emailRules"
                required
              />
              <v-text-field
                label="Senha"
                :type="show ? 'text' : 'password'"
                :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                v-model="form.password"
                :rules="passwordRules"
                @click:append-inner="show=!show"
                required
              />
               <v-btn variant="text" size="small" class="text-none " color="error" to="/forgot-password">
                Esqueci minha senha
              </v-btn>
            </v-form>
          </v-card-text>

          <v-card-actions class="d-flex flex-column gap-4 "> 
            <v-spacer />
            <v-btn  class="text-primary"  @click="login">
              Entrar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" lg="7" md="7" sm="7" class="d-none d-flex bg-grey-lighten-3 bg-black ma-0 pa-0">
      </v-col>

    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'


const show = ref(false)

const form = ref({
  email: '',
  password: ''
})

const emailRules = [
  (v)  => !!v || 'Email é obrigatório',
  (v)  => /.+@.+\..+/.test(v) || 'Email deve ser válido'
]

const passwordRules = [
  (v)  => !!v || 'Senha é obrigatória',
  (v)  => v.length >= 6 || 'Senha deve conter no mínimo 6 caracteres'
]
</script>
