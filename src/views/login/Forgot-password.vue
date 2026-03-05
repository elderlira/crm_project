<template>
  <v-container fluid class="fill-height">
    <v-row class="d-flex align-center justify-center">
      <v-col lg="5" md="5" sm="5" class="d-flex flex-column gap-4 ">
        <v-card class="pa-14" elevation="2" rounded="lg">
          <v-card-title class="text-h5 text-center">
            Esqueci minha senha
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
                </v-form>
            </v-card-text>
            <v-card-actions class="d-flex flex-column gap-4 ">
                <v-btn  class="text-primary"  @click="sendResetLink">
                    Enviar link de recuperação
                </v-btn>   
                    <v-btn variant="text" size="small" class="text-none " color="error" to="/login">
                        Voltar para login   
                    </v-btn>
            </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      form: {
        email: ''
      },
      emailRules: [
        v => !!v || 'E-mail é obrigatório',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail inválido'
      ]
    }
  },
  methods: {
    sendResetLink() {
      if (this.$refs.form.validate()) {
        this.$toast.success('Link de recuperação enviado com sucesso!')
      }
    }
  }
}
</script>