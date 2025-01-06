<template>
  <header class="header">
    <div class="header-left">
      <!-- Logo -->
      <div class="logo">
        <img src="@/assets/logo.png" alt="Logo" />
      </div>

      <!-- Menú de navegación -->
      <nav class="menu">
        <ul>
          <li><a href="/productos">Productos</a></li>
          <li><a href="/clientes/ordenes">Ordenes</a></li>
          <li><a href="/clientes">Clientes</a></li>
          <li><a href="/direcciones">Direcciones</a></li>
          <li><a href="/informes">Informes</a></li>
          <li><a href="/almacenes">Almacenes</a></li>
        </ul>
      </nav>
    </div>

    <!-- Bloque de ubicación a la derecha -->
    <div class="header-right">
      <!-- Ícono con Vuetify (o usa el icono MDI que prefieras) -->
      <v-icon color="grey-lighten-3" class="location-icon">mdi-map-marker</v-icon>
      <span class="address-text">{{ currentAddress }}</span>
    </div>
  </header>
</template>

<script>

import { useLocationService } from "~/services/locationService";

export default {
  data() {
    return {
      currentLat: null,
      currentLng: null,
      currentAddress: localStorage.getItem("userAddress"),
      locationData: {},
    };
  },

  mounted() {
    // Al montar, verificamos si ya existe info en localStorage
    this.initLocation();
    //this.saveCurrentLocation();

  },

  methods: {
    // 1. Verificar en localStorage antes de geolocalizar/fetchear
    initLocation() {
      const storedLat = localStorage.getItem("userLat");
      const storedLng = localStorage.getItem("userLng");
      const storedAddress = localStorage.getItem("userAddress");

      if (storedLat && storedLng && storedAddress) {
        // Si ya tenemos datos guardados, los asignamos directamente
        this.currentLat = parseFloat(storedLat);
        this.currentLng = parseFloat(storedLng);
        this.currentAddress = storedAddress;
      } else {
        // Si no, los obtenemos desde el navegador
        this.getBrowserLocation();
      }
    },

    // 2. Obtener coordenadas del navegador
    getBrowserLocation() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.currentLat = position.coords.latitude;
            this.currentLng = position.coords.longitude;
            // Hacer el reverse geocoding en Mapbox
            this.fetchAddress();
          },
          (error) => {
            console.error("Error al obtener la ubicación:", error);
            this.currentAddress = "No se pudo obtener la ubicación";
          }
        );
      } else {
        this.currentAddress = "Geolocalización no soportada";
      }
    },

    // 3. Reverse Geocoding a la API de Mapbox
    async fetchAddress() {
      const token =
        "pk.eyJ1IjoiYmNhaWNlcyIsImEiOiJjbTVrZzY3ZnExZnU2MmlvbXpnYzI1ZDJxIn0.9y-y5WtWqSL-0j7STmXyKA";

      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.currentLng},${this.currentLat}.json?access_token=${token}`
        );
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          this.currentAddress = data.features[0].place_name;
        } else {
          this.currentAddress = "Dirección no encontrada";
        }

        // Guardamos en localStorage para no volver a fetchear
        localStorage.setItem("userLat", this.currentLat.toString());
        localStorage.setItem("userLng", this.currentLng.toString());
        localStorage.setItem("userAddress", this.currentAddress);
        this.saveCurrentLocation();
      } catch (error) {
        console.error("Error al obtener la dirección:", error);
        this.currentAddress = "Error al obtener dirección";
      }
    },
    async saveCurrentLocation() {
      // Enviar al backend
      const { saveLocation } = useLocationService();
      const locationData = {
        userId: 1,
        latitude: parseFloat(localStorage.getItem("userLat")),
        longitude: parseFloat(localStorage.getItem("userLng")),
      };
      // imprimi en formato json para ver si se guarda correctamente
      console.log(JSON.stringify(locationData));
      await saveLocation(locationData);

    },
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #282828;
  border-bottom: 1px solid #4d4b50;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo img {
  height: 40px;
}

.menu ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu ul li {
  margin: 0 15px;
}

.menu ul li a {
  text-decoration: none;
  color: #f0f0f0;
  font-weight: 600;
  transition: color 0.3s ease;
  font-family: "Roboto", sans-serif;
}

.menu ul li a:hover {
  color: var(--primary-a0);
}

.header-right {
  display: flex;
  align-items: center;
  /* Ajusta la separación y alineación según tu preferencia */
}

.location-icon {
  font-size: 20px;
  margin-right: 8px;
}

.address-text {
  color: #f0f0f0;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
}
</style>
