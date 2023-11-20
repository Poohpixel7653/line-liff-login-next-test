export interface IConsumer {
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
    location: string | null;
    bill: IBill[];
    meters: IMeter;
    cost: number | null;
}

export interface IBill {
    id: number;
    uuid: string;
    bill_number: string;
    datetime: string;
    meter_id: number;
    usage_cost_id: number;
    result_object: IResultObject;
    payment: IPayment | null;
}

export interface IResultObject {
    officer: IOfficer;
    consumer: IConsumerInfo;
    meter_code: string;
    officer_id: number;
    bill_number: string;
    consumer_id: number;
    consumption: IConsumption;
    water_usage: IWaterUsage;
    due_datetime: string | null;
    bill_datetime: string;
}

export interface IOfficer {
    officer_name: string;
    officer_email: string;
    officer_phone: string | null;
}

export interface IConsumerInfo {
    consumer_name: string;
    consumer_address: string;
    consumer_privilege: string;
}

export interface IConsumption {
    current: IUsageData;
    previous: IUsageData | null;
}

export interface IUsageData {
    period: string;
    datetime: string;
    usage_number: number;
}

export interface IWaterUsage {
    total_cost: number;
    usage_cost: number;
    usage_unit: number;
    payment_fee: number;
    service_cost: number;
    original_cost: number;
    privilege_factor: string;
    usage_total_cost: number;
}

export interface IPayment {
    id: number;
    uuid: string;
    bill_id: number;
    method_id: number;
    transaction_id: number;
    meter_id: number;
    usage_cost_id: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface IMeter {
    id: number;
    uuid: string;
    consumer_id: number;
    meter_code: string;
    meter_type: string | null;
    meter_zone_id: number;
}