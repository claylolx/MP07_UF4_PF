<template>
  <v-container>
    <!-- Botón solo visible para admin -->
    <v-btn 
      v-if="user.role === 'admin'"
      @click="showDialog = true"
      color="primary"
      class="mb-4"
    >
      Añadir Producto
    </v-btn>

    <!-- Diálogo para crear producto -->
    <v-dialog v-model="showDialog" max-width="600">
      <v-card>
        <v-card-title>Añadir Nuevo Producto</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveProduct">
            <v-text-field v-model="newProduct.name" label="Nombre" required></v-text-field>
            <v-text-field v-model="newProduct.description" label="Descripción"></v-text-field>
            <v-text-field v-model="newProduct.price" label="Precio" type="number"></v-text-field>
            <v-btn type="submit" color="primary">Guardar</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Tabla de productos -->
    <v-table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Precio</th>
          <th v-if="user.role === 'admin'">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.name }}</td>
          <td>{{ product.description }}</td>
          <td>{{ product.price }} €</td>
          <td v-if="user.role === 'admin'">
            <v-btn icon @click="editProduct(product)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="deleteProduct(product.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      products: [],
      showDialog: false,
      newProduct: {
        name: '',
        description: '',
        price: 0
      },
      editingId: null,
      user: JSON.parse(localStorage.getItem('user')) || {}
    }
  },
  async mounted() {
    await this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await this.$axios.get('/api/products');
        this.products = response.data;
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    async saveProduct() {
      try {
        if (this.editingId) {
          await this.$axios.put(`/api/products/${this.editingId}`, this.newProduct);
        } else {
          await this.$axios.post('/api/products', this.newProduct);
        }
        this.showDialog = false;
        this.resetForm();
        await this.fetchProducts();
      } catch (error) {
        console.error('Error saving product:', error);
      }
    },
    editProduct(product) {
      this.newProduct = { ...product };
      this.editingId = product.id;
      this.showDialog = true;
    },
    async deleteProduct(id) {
      if (confirm('¿Estás seguro de eliminar este producto?')) {
        try {
          await this.$axios.delete(`/api/products/${id}`);
          await this.fetchProducts();
        } catch (error) {
          console.error('Error deleting product:', error);
        }
      }
    },
    resetForm() {
      this.newProduct = {
        name: '',
        description: '',
        price: 0
      };
      this.editingId = null;
    }
  }
}
</script>