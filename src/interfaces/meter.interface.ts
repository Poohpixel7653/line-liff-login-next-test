interface Location {
    latitude: number;
    longitude: number;
}

interface Consumer {
    id: number;
    uuid: string;
    firstname: string;
    lastname: string;
    address: string;
    moo: string;
    subdistrict: string;
    district: string;
    province: string;
    phone: string | null;
    picture: string | null;
    privilege_id: number;
    location: Location;
}

export interface IMeter {
    id: number;
    uuid: string;
    consumer_id: number;
    meter_code: string;
    meter_type: string | null;
    meter_zone_id: number;
    consumer: Consumer;
}