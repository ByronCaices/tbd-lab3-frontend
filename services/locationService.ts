import { useNuxtApp } from "#app";
import type { Location } from "@/models/location";

export const useLocationService = () => {

    const { $axiosService } = useNuxtApp();

    const saveLocation = async (location: Location): Promise<Location> => {
        const { data } = await $axiosService.post<Location>("/api/locations/", location);
        return data;
    };

    const getLocationById = async (id: number): Promise<Location> => {
        try {
            const { data } = await $axiosService.get<Location>(`/api/locations/${id}`);
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
