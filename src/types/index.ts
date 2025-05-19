import { Request } from 'express';
import { FileArray } from 'express-fileupload';

export interface Client {
    id?: number;
    login: string;
    password: string;
    token?: string;
}

export interface AuthHeaders {
    login?: string;
    password?: string;
    auth?: string;
}

export interface CustomRequest extends Request {
    files?: FileArray;
}

export interface CommonResponse {
    status: number;
    message: string;
    data?: any;
}

export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    image?: string;
}

export interface SearchParams {
    searchText: string;
} 