import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface MedicineInfo {
    whenToTake: string;
    warnings: string;
    howToTake: string;
    genericName: string;
    brandName: string;
    similarMedicines: Array<string>;
    whoShouldTake: string;
    purpose: string;
    activeIngredients: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface backendInterface {
    searchByDrugName(drugName: string): Promise<MedicineInfo>;
    searchByNdcCode(ndcCode: string): Promise<MedicineInfo>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
