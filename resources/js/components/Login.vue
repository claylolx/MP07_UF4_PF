<template>
    <v-container>
        <v-card max-width="500" class="mx-auto mt-5">
            <v-card-title class="text-center">Login</v-card-title>
            <v-card-text>
                <v-form @submit.prevent="login">
                    <v-text-field
                        v-model="form.email"
                        label="Email"
                        type="email"
                        required
                    ></v-text-field>
                    <v-text-field
                        v-model="form.password"
                        label="Password"
                        type="password"
                        required
                    ></v-text-field>
                    <v-btn 
                        type="submit" 
                        color="primary" 
                        block
                        :loading="loading"
                    >
                        Login
                    </v-btn>
                </v-form>
                <v-alert
                    v-if="error"
                    type="error"
                    class="mt-3"
                >
                    {{ error }}
                </v-alert>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            form: {
                email: '',
                password: ''
            },
            loading: false,
            error: ''
        };
    },
    methods: {
        async login() {
  try {
    const response = await this.$axios.post('/api/login', this.form);
    
    localStorage.setItem('auth_token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user)); // Guarda el usuario completo
    
    this.$axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    
    // Redirige a la página de productos
    this.$router.push('/products');
  } catch (error) {
    console.error('Login error:', error.response);
  }
}
    }
};
</script>