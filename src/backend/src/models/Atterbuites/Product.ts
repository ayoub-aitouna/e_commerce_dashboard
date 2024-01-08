export enum IpTvType {
    Basic = "basic",
    Premium = "premium",
}

export interface ProductAttributes {
    id?: number;
    iptv_url: string;
    type: IpTvType;
    created_at?: Date;
    updated_at?: Date;
}