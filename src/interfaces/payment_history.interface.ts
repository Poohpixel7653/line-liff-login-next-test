export interface IPaymentHistory {
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
    bill: IBill;
    method: IMethod;
    transaction: any;
    meter: IMeter;
    usage: IUsage;
}

export interface IBill {
    id: number;
    uuid: string;
    bill_number: string;
    datetime: string;
    meter_id: number;
    usage_cost_id: number;
    result_object: IResultObject;
}

export interface IMeter {
    id: number;
    uuid: string;
    consumer_id: number;
    meter_code: string;
    meter_type: string | null;
    meter_zone_id: number;
}

export interface IUsage {
    id: number;
    cur_consumption_id: number;
    last_consumption_id: number | null;
    usage_unit: number;
    usage_cost: number;
    original_cost: number;
    privilege_factor: number;
}

export interface IOfficer {
    officer_name: string;
    officer_email: string;
    officer_phone: string | null;
}

export interface IConsumer {
    consumer_name: string;
    consumer_address: string;
    consumer_privilege: string;
}

export interface ICurrentUsage {
    period: string;
    datetime: string;
    usage_number: number;
}

export interface IPreviousUsage {
    period: string;
    datetime: string;
    usage_number: number;
}

export interface IConsumption {
    current: ICurrentUsage;
    previous: IPreviousUsage;
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

export interface IResultObject {
    officer: IOfficer;
    consumer: IConsumer;
    meter_code: string;
    officer_id: number;
    bill_number: string;
    consumer_id: number;
    consumption: IConsumption;
    water_usage: IWaterUsage;
    due_datetime: string | null;
    bill_datetime: string;
}


export interface IMethod {
    id: number;
    name: string;
    description: string;
    config: object;
}

