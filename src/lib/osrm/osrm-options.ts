import { HttpOptions } from "./osrm-http-options.interface";

export interface OSRMOptions {
    baseUrl: string;
    version: string;
    profile: string;
    allowHints: boolean;
    allowUTurns: boolean;
    _httpOptions: HttpOptions;
}