export type Product={
    product_id?:string;
    hsn?:number;
    name?:string;
    description?:string;
    gst?:number;
    stock_qty?:number;
    unit?:string;
    category?:string;
    diseases?:string;
    mrp?:number;
    image_id?:string;
    // truncateDesc?: string;
}

export type ProductCT={
    product_id?:string;
    quantity?:number;
}

export type ProductCTV={
    product_id?:string;
    hsn?:number;
    name?:string;
    gst?:number;
    stock_qty?:number;
    stock?:string
    category?:string;
    mrp?:number;
    image_id?:string;
    quantity?:number;
    discount?:number;
    totalPrice?:number;
}