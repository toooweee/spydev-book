interface CRSProperties {
    name: string;
}

interface CRS {
    type: string;
    properties: CRSProperties;
}

export interface Geometry {
    type: string;
    coordinates: [number, number][][][] | [number, number]
}

interface FeatureProperties {
    fid_1: number | null;
    num: number;
    n_raion: string;
    fio: string;
    years: string;
    info: string;
    kontrakt: string | null;
    nagrads: string | null;
}

export interface Feature {
    type: "Feature";
    id: number;
    properties: FeatureProperties;
    geometry: Geometry | null;
}

export interface FeatureCollection {
    type: "FeatureCollection";
    name: string;
    crs: CRS;
    features: Feature[];
}
