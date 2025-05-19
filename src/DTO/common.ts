import { STATUS } from '../constants.js';

export interface CommonResponse {
    status: STATUS;
    message: string;
    data: any;
}

export const commonDto = (status: STATUS, message: string = '', data: any = null): CommonResponse => ({
    status,
    message,
    data,
}); 