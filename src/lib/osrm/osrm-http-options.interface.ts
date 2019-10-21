import { OSRMParams } from "./osrm-params.interface";

export interface HttpOptions {
    qs?: OSRMParams,
    headers?: {
        [key: string]: string
    },
    json?: boolean
}
