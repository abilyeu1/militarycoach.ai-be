declare class featuresDTO {
    name: string;
}
export declare class addProductDTO {
    name: string;
    features: featuresDTO[];
    unit_amount: number;
    description: string;
    interval_count: number;
}
export {};
