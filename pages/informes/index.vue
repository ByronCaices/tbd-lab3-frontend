<template>
    <!-- Encabezado con botones de notificaciones y cerrar sesión -->
    <Header />
  
    <div class="background">
      <h1 class="lexend-deca-title">Reportes</h1>
  
   <!-- Espacio -->
      <br><br><br><br><br><br><br><br>
  
      <!-- Lista de clientes -->
      <v-container>
        <v-row>
          <!--Contenedor con enlace a reporte queris-->
          <v-card class="mx-auto" max-width="400" link color="var(--primary-a20)">
            <v-img
              class="align-end text-white"
              height="200"
              src="/assets/logoreporte1.png"
              cover
            >
              <v-card-title class="bg-primary-a40 title-background">
                <v-icon class="me-4" icon="mdi-email-outline" size="large"></v-icon>
                Reporte Querys</v-card-title>
            </v-img>

            <v-card-text>
              <div>Usuarios que más queris (INSERT, DELETE, UPDATE) realizaron</div>
            </v-card-text>

            <v-card-actions>
              <v-btn color="purple" text href="/informes/cantidad-querys">Generar</v-btn>
            </v-card-actions>
          </v-card>
          <!--Contenedor con reporte clientes con más de una compra en un dia-->
          <v-card class="mx-auto" max-width="400" color="var(--primary-a20)">
            <v-img
              class="align-end text-white"
              height="200"
              src="/assets/logoreporte2.png"
              cover
            >
              <v-card-title  class="bg-primary-a40 title-background">
                <v-icon icon="mdi-account-multiple-outline" size="large"></v-icon>
                Reporte Clientes Compras

              </v-card-title>
            </v-img>

            <v-card-text>
              <div>Reporte de los clientes que relizaron más de una compra en un mismo dia durante un periodo de fechas</div>
            </v-card-text>

            <v-card-actions>
              <v-btn color="purple" href="/informes/compra-en-un-dia" text>Generar</v-btn>
            </v-card-actions>
          </v-card>

        </v-row>
  
       
  
      </v-container>
  
    </div>
  
  </template>
  
  <script>
  import { useRouter } from "vue-router";
  import { useClienteService } from "~/services/clienteService";
  import Header from "@/components/Header.vue"; // Ajusta la ruta según tu estructura de archivos
  
  export default {
    name: "Clientes",
    components: {
      Header,
    },
    data() {
      return {
  
        notas: [],
        clientes: [],
        token: "your-token-here", // Puedes obtenerlo de localStorage si es necesario
        searchParams: {
          id_cliente: null,
          nombre: "",
          direccion: "",
          email: "",
          telefono: "",
        },
        refreshToken: null,
        id_usuario: null,
        dialogEditar: false,
        clienteAEditar: null,
        menuFecha: false, // Para el date picker
  
      };
    },
    computed: {
    },
    mounted() {
      // Obtener valores del localStorage al montar el componente
      this.refreshToken = localStorage.getItem('refresh_token');
      this.userId = parseInt(localStorage.getItem('id_usuario'), 10);
  
      if (!this.refreshToken || !this.userId) {
        console.error("Token de refresco o ID de usuario no disponibles");
        // Maneja el error, por ejemplo, redirigiendo al login
        return;
      }
      this.fetchClientes(); // Cargar clientes
    },
    methods: {
      async fetchClientes(){
        try {
          const { getAllClientes } = useClienteService();
          const response = await getAllClientes(this.refreshToken);
          this.clientes = response;
        } catch (error) {
          console.error('Error al obtener los clientes:', error);
        }
      },
      async deleteCliente(id_cliente) {
        // Pregunta mediante notificacion de navegador, está seguro de eliminar la tarea
        const isConfirmed = window.confirm("¿Estás seguro de eliminar el cliente?\nConsidere que eliminar un cliente con alguna orden activa no se concretará.");
        if (!isConfirmed) {
          return;
        }
  
        try {
          const clienteService = useClienteService();
          //console.log('Eliminando cliente con ID:', cliente);
          await clienteService.deleteCliente(id_cliente, this.refreshToken);
          console.log('Cliente eliminado en el backend.');
  
          // Elimina cliente de la lista
          const index = this.clientes.findIndex(t => t.id_cliente === id_cliente);
          if (index !== -1) {
            console.log('Eliminando cliente del frontend en el índice:', index);
            this.clientes.splice(index, 1);
            console.log('Clientes actuales:', this.clientes);
          }
        } catch (error) {
          console.error('Error al eliminar el cliente:', error);
        }
        //window.location.reload();
      },
  
      editarCliente(cliente) {
        // Crear una copia de la tarea para evitar modificarla directamente
        this.clienteAEditar = { ...cliente };
        this.dialogEditar = true;
      },
      async guardarEdicion(){
        try {
          const clienteService = useClienteService();
          // Actualizar el cliente en el backend
          await clienteService.updateCliente(this.clienteAEditar, this.refreshToken);
          // Actualizar el cliente en la lista local
          const index = this.clientes.findIndex(t => t.id_cliente === this.clienteAEditar.id_cliente);
          if (index !== -1) {
            this.clientes.splice(index, 1, this.clienteAEditar);
          }
          this.dialogEditar = false;
        } catch (error) {
          console.error('Error al guardar la edición:', error);
        }
  
      },
      irAAñadir() {
        this.$router.push("/clientes/nuevo");
      },
    },
  };
  </script>
  
  
  
  <style scoped>
  .background {
    background-color: #282828;
    min-height: 100vh;
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* Centra horizontalmente */
    justify-content: flex-start;
    /* No centra verticalmente, coloca los elementos al inicio */
  }
  
  
  header h1 {
    margin-left: 20px;
    margin-top: 20px;
    font-size: 2.25rem;
    font-weight: bold;
    text-transform: uppercase;
  }
  
  nav {
    display: flex;
    height: 50px;
    gap: 10px;
    margin-top: 15px;
    margin-right: 20px;
  }
  
  .img-notif {
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }
  
  .boton-clientes {
    display: flex;
    justify-content: center;
    margin-right: 20px;
    margin-top: 20px;
  }
  
  .boton-chico {
    font-size: 14px;
    padding: 6px 12px;
    min-width: 100px;
    text-transform: uppercase;
  }
  
  .clientes {
    padding: 20px;
  }
  
  .clientes h1 {
    font-size: 24px;
    margin-bottom: 10px;
  }
  
  .COMPLETADO {
    background-color: #e8f5e9;
    border-left: 4px solid #4caf50;
  }
  
  .PENDIENTE {
    background-color: #ffebee;
    border-left: 4px solid #f44336;
  }
  
  .boton-editar-eliminar {
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }
  
  .search-section {
    width: 100%;
    max-width: 1200px;
    margin: 20px auto;
  }
  
  .lexend-deca-title {
    font-family: "Lexend Deca", sans-serif;
    font-optical-sizing: auto;
    color: var(--primary-a0);
    font-weight: 700;
    font-size: 4.25rem;
    font-style: normal;
  }

  .title-background {
    background-color: rgba(0, 0, 0, 0.5); /* Adjust the color and opacity as needed */
  }
  </style>
