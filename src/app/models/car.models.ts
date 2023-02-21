export interface CarModelDTO {
    Name: string; // id
    Miles_per_Gallon: number;
    Cylinders: number;
    Displacement: number;
    Horsepower: number;
    Weight_in_lbs: number;
    Acceleration: number;
    Year: string; // "1970-01-01",
    Origin: string;
}

export interface CarDTO {
    id: string;
    createdAt: number;
    updatedAt: number;
    version: number;

    modelName: string; // CarModelDTO id
    description: string;

    // TODO photo

    // TODO custom params
}

export interface CarBrandLogoDTO {
    name: string;
    slug: string;
    image: {
        source: string;
        thumb: string;
        optimized: string;
        original: string;
        localThumb: string;
        localOptimized: string;
        localOriginal: string;
    };
}

export interface CarVO extends CarDTO {
    logoData: CarBrandLogoDTO;
    modelData: CarModelDTO;
}
