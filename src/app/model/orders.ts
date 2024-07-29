import { Address } from "./address"

export type ORDERS = {
        address: Address;
        order_id: string;
        date: Date;
        noOfItems: number;
        total_amount?: number;
        paymentId: string;
        total_mrp?: number;
        shipmentProvider?: string;
        shipmentId?: string;
        statusTime?: statusTimes
        user_id: string;
        user_name?: string;
        productList?: [FinalProduct]
        view?: string;
        status?: string;
}

export type FinalProduct = {
        product_id?: string,
        name?: string,
        hsn?: number,
        mrp?: number,
        quantity?: number,
        total_mrp?: number,
        dis_percent?: number,
        gst?: number,
        dic_value?: number,
        gross_value?: number,
        tax_value?: number,
        disc_price?: number,
        stock_qty?: number
}
export type Shipment = {
        shipmentProvider?: string;
        shipmentId?: string;
}

export type statusTimes = {
        Progressing: Date;
        Placed: Date;
        Shipped: Date
        Delivered: Date;
}

export type TransactionDTO = {
        email: string;
        username: string;
        contact: string;
        amount: number;
        orderId: string;
        paymentId: string;
        status: string;
        createDate: Date;
}