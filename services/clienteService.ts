// services/clienteService.ts
import { useNuxtApp } from "#app";
import type { Cliente } from "@/models/cliente";

export const useClienteService = () => {
    const { $axiosService } = useNuxtApp();

    /**
     * Crea un nuevo cliente.
     * @param cliente - Objeto Cliente a crear.
     * @returns El Cliente creado.
     */
    const createCliente = async (cliente: Cliente): Promise<Cliente> => {
        const { data } = await $axiosService.post<Cliente>("/api/clientes/", cliente);
        return data;
    };

    /**
     * Obtiene un cliente por su ID.
     * @param id - ID del cliente.
     * @returns El Cliente correspondiente.
     */
    const getClienteById = async (id: number): Promise<Cliente> => {
        try {
            const { data } = await $axiosService.get<Cliente>(`/api/clientes/${id}`);
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    /**
     * Obtiene todos los clientes.
     * @returns Una lista de Clientes.
     */
    const getAllClientes = async (): Promise<Cliente[]> => {
        try {
            const { data } = await $axiosService.get<Cliente[]>("/api/clientes/");
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    /**
     * Actualiza un cliente existente.
     * @param cliente - Objeto Cliente con datos actualizados.
     * @returns El Cliente actualizado.
     */
    const updateCliente = async (cliente: Cliente): Promise<Cliente> => {
        const { data } = await $axiosService.put<Cliente>("/api/clientes/", cliente);
        return data;
    };

    /**
     * Elimina un cliente por su ID.
     * @param id - ID del cliente a eliminar.
     */
    const deleteCliente = async (id: number): Promise<void> => {
        await $axiosService.delete(`/api/clientes/${id}`);
    };

    return {
        createCliente,
        getClienteById,
        getAllClientes,
        updateCliente,
        deleteCliente
    };
};
