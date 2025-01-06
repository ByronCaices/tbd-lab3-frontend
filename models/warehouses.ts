export interface Wirehouses {
    id: string;
    userId: number;
    warehouses: [
        {
            warehouseId: string;
            warehouseName: string;
            distance: number;
        }
    ];
}