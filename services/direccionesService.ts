import { useNuxtApp } from "#app";
// Importa tu modelo o tipo de Addresses
import type { Addresses } from "@/models/addresses";

export const useDireccionesService = () => {
  const { $axiosService } = useNuxtApp();

  /**
   * Guarda una dirección para un usuario dado.
   * @param addresses - Objeto Addresses con la información de la dirección.
   * @param id_user - ID del usuario al que se asociará la dirección.
   * @returns La dirección guardada.
   */
  const createDireccion = async (
    addresses: Addresses,
    id_user: string
  ): Promise<Addresses> => {
    const { data } = await $axiosService.post<Addresses>(
      `/api/addresses/save-addresses/${id_user}`,
      addresses
    );
    return data;
  };

  /**
   * Obtiene todas las direcciones de un usuario.
   * @param id_user - ID del usuario cuyas direcciones se desean obtener.
   * @returns Lista de Addresses.
   */
  const getDireccionesByClienteId = async (
    id_user: string
  ): Promise<Addresses[]> => {
    const { data } = await $axiosService.get<Addresses[]>(
      `/api/addresses/get-addresses/${id_user}`
    );
    return data;
  };

  /**
   * Elimina una dirección específica por su ID.
   * @param id_address - ID de la dirección a eliminar.
   */
  const deleteDireccion = async (id_address: string): Promise<void> => {
    await $axiosService.delete(`/api/addresses/delete-addresses/${id_address}`);
  };

  /**
   * Actualiza una dirección existente.
   * @param addresses - Objeto Addresses con la información actualizada.
   * @returns La dirección actualizada.
   */
  const updateDireccion = async (
    addresses: Addresses
  ): Promise<Addresses> => {
    const { data } = await $axiosService.put<Addresses>(
      "/api/addresses/update-addresses",
      addresses
    );
    return data;
  };

  return {
    createDireccion,
    getDireccionesByClienteId,
    deleteDireccion,
    updateDireccion,
  };
};
