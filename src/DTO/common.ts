export interface CommonDto<T = any> {
    status: number | string;
    message: string;
    data: T | null;
}

export const commonDto = <T = any>(status: number | string = 200, message: string = '', data: T | null = null): CommonDto<T> => ({
    status,
    message,
    data,
});
