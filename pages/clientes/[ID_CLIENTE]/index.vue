<template>
  <!-- Encabezado con botones de notificaciones y cerrar sesión -->
  <Header />

  <div class="background">
    <h1 class="lexend-deca-title">DETALLE DEL CLIENTE</h1>

    <!-- Sección con información del cliente -->
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-card variant="tonal" color="var(--primary-a0)">
            <v-card-title>
              Información del Cliente
            </v-card-title>
            <v-card-subtitle>
              {{ clienteData?.nombre }}
            </v-card-subtitle>
            <v-card-text>
              <div><strong>Email:</strong> {{ clienteData?.email }}</div>
              <div><strong>Teléfono:</strong> {{ clienteData?.telefono }}</div>
              <div>
                <strong>Dirección principal:</strong> {{ clienteData?.direccion }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <br />

    <!-- Sección con histórico de órdenes -->
    <h2 class="lexend-deca-title" style="font-size: 2rem;">Órdenes del Cliente</h2>
    <v-container fluid>
      <v-row>
        <!-- Mostrar skeleton loader mientras se cargan las órdenes -->
        <v-col cols="12" sm="6" md="4" v-if="loadingOrders" v-for="n in 6" :key="n">
          <v-skeleton-loader type="card" color="var(--mixed-a20)"></v-skeleton-loader>
        </v-col>

        <!-- Listado de órdenes -->
        <v-col v-for="(orden, index) in ordenesFiltradas" :key="index" cols="12" sm="6" md="4" v-else>
          <v-card variant="tonal" color="var(--primary-a0)">
            <v-card-title>
              Orden #{{ orden.idOrder }}
            </v-card-title>
            <v-card-subtitle>
              Estado: <strong>{{ orden.status }}</strong>
            </v-card-subtitle>
            <v-card-text>
              <div><strong>Fecha:</strong> {{ orden.date }}</div>
              <div><strong>Producto:</strong> {{ orden.product.name }}</div>
              <div><strong>Cantidad:</strong> {{ orden.product.quantity }}</div>
              <div><strong>Precio Unitario:</strong> {{ orden.product.price }}</div>
              <div><strong>Total:</strong> {{ orden.total }}</div>
            </v-card-text>
            <v-card-actions>
              <v-btn icon @click="goToOrden(orden.idOrder)">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <br />

    <!-- Botón para abrir diálogo de Direcciones -->
    <v-btn color="#e29818ff" size="small" variant="tonal" class="boton-chico" @click="dialogDirecciones = true">
      Ver Direcciones
    </v-btn>

    <!-- Diálogo de Direcciones -->
    <v-dialog v-model="dialogDirecciones" max-width="700px">
      <v-card variant="elevated" color="var(--surface-a40)">
        <v-card-title>
          <span class="headline">Direcciones del Cliente</span>
        </v-card-title>
        <v-card-text>
          <!-- Listado de direcciones -->
          <v-row v-if="direcciones && direcciones.length">
            <v-col v-for="(dir, idx) in direcciones" :key="dir.id" cols="12" md="6">
              <v-card color="var(--primary-a0)" class="ma-2">
                <v-card-text>
                  <div><strong>Calle:</strong> {{ dir.street }}</div>
                  <div><strong>Número:</strong> {{ dir.number }}</div>
                  <div><strong>Comuna:</strong> {{ dir.commune }}</div>
                  <div><strong>Ciudad:</strong> {{ dir.city }}</div>
                  <div><strong>País:</strong> {{ dir.country }}</div>
                  <div><strong>Postal:</strong> {{ dir.postalCode }}</div>
                </v-card-text>
                <v-card-actions>
                  <v-btn icon color="primary" @click="abrirEditarDireccion(dir)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon color="error" @click="borrarDireccion(dir.id)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
          <div v-else>
            <p>No hay direcciones cargadas</p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialogNuevaDir = true">Añadir Dirección</v-btn>
          <v-btn color="red darken-1" text @click="dialogDirecciones = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo para Editar Dirección -->
    <v-dialog v-model="dialogEditarDir" max-width="500px">
      <v-card variant="elevated" color="var(--surface-a40)">
        <v-card-title>
          <span class="headline">Editar Dirección</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="formEditDir">
            <v-text-field label="Calle" color="var(--primary-a0)" v-model="direccionAEditar.street"></v-text-field>
            <v-text-field label="Número" color="var(--primary-a0)" v-model="direccionAEditar.number"></v-text-field>
            <v-text-field label="Comuna" color="var(--primary-a0)" v-model="direccionAEditar.commune"></v-text-field>
            <v-text-field label="Ciudad" color="var(--primary-a0)" v-model="direccionAEditar.city"></v-text-field>
            <v-text-field label="País" color="var(--primary-a0)" v-model="direccionAEditar.country"></v-text-field>
            <v-text-field label="Código Postal" color="var(--primary-a0)"
              v-model="direccionAEditar.postalCode"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="red darken-1" text @click="dialogEditarDir = false">Cancelar</v-btn>
          <v-btn color="green darken-1" text @click="guardarEdicionDireccion">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo para Crear Nueva Dirección -->
    <v-dialog v-model="dialogNuevaDir" max-width="500px">
      <v-card variant="elevated" color="var(--surface-a40)">
        <v-card-title>
          <span class="headline">Crear Dirección</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="formNewDir">
            <v-text-field label="Calle" color="var(--primary-a0)" v-model="nuevaDireccion.street"></v-text-field>
            <v-text-field label="Número" color="var(--primary-a0)" v-model="nuevaDireccion.number"></v-text-field>
            <v-text-field label="Comuna" color="var(--primary-a0)" v-model="nuevaDireccion.commune"></v-text-field>
            <v-text-field label="Ciudad" color="var(--primary-a0)" v-model="nuevaDireccion.city"></v-text-field>
            <v-text-field label="País" color="var(--primary-a0)" v-model="nuevaDireccion.country"></v-text-field>
            <v-text-field label="Código Postal" color="var(--primary-a0)"
              v-model="nuevaDireccion.postalCode"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="red darken-1" text @click="dialogNuevaDir = false">Cancelar</v-btn>
          <v-btn color="green darken-1" text @click="crearDireccion">Crear</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";

// Importa tus servicios (ajusta las rutas y nombres según tu proyecto real)
import { useOrdenService } from "~/services/ordenesService";
import { useDireccionesService } from "~/services/direccionesService"; // Importa el servicio completo
import { useClienteService } from "~/services/clienteService";

export default {
  name: "DetalleCliente",
  components: {
    Header,
  },
  data() {
    return {
      // Parametro de ruta
      idCliente: null,

      // Datos del cliente
      clienteData: null,

      // Órdenes del cliente
      ordenesFiltradas: [],
      loadingOrders: false,

      // Direcciones
      direcciones: [],

      // Diálogos
      dialogDirecciones: false,
      dialogEditarDir: false,
      dialogNuevaDir: false,

      // Dirección en edición
      direccionAEditar: {
        street: "",
        number: "",
        commune: "",
        city: "",
        country: "Chile",
        postalCode: "",
        idUser: null,
      },

      // Nueva dirección
      nuevaDireccion: {
        street: "",
        number: "",
        commune: "",
        city: "",
        country: "Chile",
        postalCode: "",
        idUser: null,
      },
    };
  },
  mounted() {
    // En Nuxt 2, params se puede acceder con this.$route.params. 
    // En Nuxt 3, la lógica cambia un poco, pero aquí te muestro estilo Options API.
    this.idCliente = this.$route.params.ID_CLIENTE;
    this.cargarDatos();
    this.cargarDirecciones();
  },
  methods: {
    async cargarDatos() {
      try {
        // Obtener info del cliente
        const { getClienteById } = useClienteService();
        this.clienteData = await getClienteById(this.idCliente);

        // Obtener historial completo de órdenes
        this.loadingOrders = true;
        const { getOrderHistory } = useOrdenService();
        const allOrders = await getOrderHistory();
        this.loadingOrders = false;

        // Filtrar solo las órdenes del cliente
        const clienteOrden = allOrders.find(
          (item) => item.idUser == this.idCliente
        );
        this.ordenesFiltradas = clienteOrden ? clienteOrden.orders : [];
      } catch (error) {
        console.error("Error al cargar datos:", error);
        this.loadingOrders = false;
      }
    },
    async cargarDirecciones() {
      try {
        const { getDireccionesByClienteId } = useDireccionesService();
        this.direcciones = await getDireccionesByClienteId(this.idCliente);
      } catch (error) {
        console.error("Error al cargar direcciones:", error);
      }
    },
    abrirEditarDireccion(dir) {
      // Hacemos una copia para no mutar directamente
      this.direccionAEditar = { ...dir };
      this.dialogEditarDir = true;
    },
    async guardarEdicionDireccion() {
      try {
        const { updateDireccion } = useDireccionesService();
        // Actualizar dirección en el backend
        await updateDireccion(this.direccionAEditar);

        // Actualizar el arreglo local
        const idx = this.direcciones.findIndex(
          (d) => d.id === this.direccionAEditar.id
        );
        if (idx !== -1) {
          this.direcciones.splice(idx, 1, { ...this.direccionAEditar });
        }

        this.dialogEditarDir = false;
      } catch (error) {
        console.error("Error al editar dirección:", error);
      }
    },
    async borrarDireccion(idDir) {
      const isConfirmed = window.confirm("¿Estás seguro de eliminar la dirección?");
      if (!isConfirmed) return;

      try {
        const { deleteDireccion } = useDireccionesService();
        await deleteDireccion(idDir);
        this.direcciones = this.direcciones.filter((d) => d.id !== idDir);
      } catch (error) {
        console.error("Error al borrar dirección:", error);
      }
    },
    async crearDireccion() {
      try {
        const { createDireccion } = useDireccionesService();
        // Asignamos idUser antes de crear
        this.nuevaDireccion.idUser = this.idCliente;
        const nueva = await createDireccion(this.nuevaDireccion, this.idCliente);
        // Agregar al arreglo local
        this.direcciones.push(nueva);

        // Limpiar el formulario
        this.nuevaDireccion = {
          street: "",
          number: "",
          commune: "",
          city: "",
          country: "Chile",
          postalCode: "",
          idUser: this.idCliente,
        };
        this.dialogNuevaDir = false;
      } catch (error) {
        console.error("Error al crear dirección:", error);
      }
    },
    goToOrden(id_orden) {
      this.$router.push(`/clientes/ordenes/${id_orden}`);
    },
  },
};
</script>


<style scoped>
.v-btn {
  border-radius: 4px;
}

#btnToWatch {
  padding: 5px 10px;
  margin-left: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 15px;
  font-size: 18px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
}

/* Contenedor de botones */
.buttons-container {
  margin-bottom: 20px;
  padding-left: 15px;
}

/* Estilos base para los botones */
.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  font-size: 14px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
  /* Transiciones suaves */
}

/* Botón "Nuevo" */
.new-btn {
  margin-top: 1rem;
  background-color: var(--primary-a0);
  color: white;
}

.new-btn:hover {
  background-color: var(--primary-a0);
  /* Color más oscuro al hacer hover */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  /* Sombra para efecto de elevación */
  transform: translateY(-2px);
  /* Efecto de elevación */
}

.new-btn:active {
  transform: translateY(1px);
  /* Efecto de presión al hacer clic */
}

.background {
  background-color: #282828;
  min-height: 100vh;
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.lexend-deca-title {
  font-family: "Lexend Deca", sans-serif;
  font-optical-sizing: auto;
  color: var(--primary-a0);
  font-weight: 700;
  font-size: 4.25rem;
  font-style: normal;
}

.v-card {
  color: white;
  /* Ajusta si quieres otro color de texto */
}

.boton-chico {
  font-size: 14px;
  padding: 6px 12px;
  min-width: 100px;
  text-transform: uppercase;
}
</style>