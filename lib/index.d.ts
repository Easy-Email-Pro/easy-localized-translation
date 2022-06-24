export interface Config {
    path: string;
    keyword?: string;
}
export declare function extract(config: Config): string[];
