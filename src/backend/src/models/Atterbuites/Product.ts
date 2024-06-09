import { ReferenceAttributes } from "./Reference";
export enum IpTvType {
    Basic = "Basic",
    Gold = "Gold",
    Premium = "Premium",
    Elit = "Elit",

}

export interface ProductAttributes {
    id?: number;
    iptv_url: string;
    extra_iptv_url: string;
    type: IpTvType;
    sold: boolean;
    pendding: boolean;
    pendding_at?: Date;
    solded_at?: Date;
    created_at?: Date;
    updated_at?: Date;
    referenceId?: number;
    reference?: ReferenceAttributes;

}