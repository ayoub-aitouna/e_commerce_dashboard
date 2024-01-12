export enum IpTvType {
    Basic = "basic",
    Premium = "premium",
}

export interface ProductAttributes {
    id?: number;
    iptv_url: string;
    type: IpTvType;
    sold: boolean;
    pendding: boolean;
    pendding_at?: Date;
    solded_at?: Date;
    created_at?: Date;
    updated_at?: Date;
}