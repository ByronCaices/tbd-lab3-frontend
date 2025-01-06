import { useNuxtApp } from "#app";
import type { Location } from "@/models/location";
import type { Wirehouses } from "~/models/warehouses";

export const useLocationService = () => {

    const { $axiosService } = useNuxtApp();

    const saveLocation = async (location: Location): Promise<Location> => {
        const { data } = await $axiosService.post<Location>("/api/locations/", location);
        return data;
    };

    const getLocationById = async (id: number): Promise<Wirehouses> => {
        try {
            const { data } = await $axiosService.get<Wirehouses>(`/api/locations/${id}`);
            console.log(data);
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    return {
        saveLocation,
        getLocationById
    };
};
