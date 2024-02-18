import { IpTvType } from "./Product";

export interface CostumersAttrebues {
    id: Number;
    Email: string;
    referenceSite: string;
    language: string;
    type: IpTvType;
    StripPaymentId: string;
    bought: boolean;
    bought_at: Date;
    pendding: boolean;
    pendding_at: Date;
    created_at: Date;
    updated_at: Date;
}