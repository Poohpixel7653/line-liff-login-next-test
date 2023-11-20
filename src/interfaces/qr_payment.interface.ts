export interface QrApiResponse {
    type: string;
    status: number;
    message: string;
    is_new_charge: boolean;
    data: IData;
}

export interface IData {
    status: string;
    transaction_detail: ITransactionDetail;
    payment_detail: IPaymentDetail;
    bill: IBill;
}

export interface IBill {
    officer: IOfficer;
    consumer: IConsumer;
    meter_code: string;
    officer_id: number;
    bill_number: string;
    consumer_id: number;
    consumption: {
        current: IConsumption;
        previous: IConsumption;
    };
    water_usage: IWaterUsage;
    due_datetime: string | null;
    bill_datetime: string;
}

interface ITransactionFees {
    fee_flat: string;
    fee_rate: string;
    vat_rate: string;
}

interface ITransactionDetail {
    total_amount: number;
    net_amount: number;
    net_fee: number;
    net_fee_vat: number;
    transaction_fees: ITransactionFees;
}

interface IPaymentDetail {
    qr_image: string;
    created_at: string;
    expires_at: string;
    metadata: Record<string, any>;
}

interface IOfficer {
    officer_name: string;
    officer_email: string;
    officer_phone: string | null;
}

interface IConsumer {
    consumer_name: string;
    consumer_address: string;
    consumer_privilege: string;
}

interface IConsumption {
    period: string;
    datetime: string;
    usage_number: number;
}

interface IWaterUsage {
    total_cost: number;
    usage_cost: number;
    usage_unit: number;
    payment_fee: number;
    service_cost: number;
    original_cost: number;
    privilege_factor: string;
    usage_total_cost: number;
}
