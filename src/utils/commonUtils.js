import { commonDto } from '../DTO/common.js';
import { STATUS } from '../constants.js';
import { AUTH } from '../index.js';

export const checkAuth = (req, res) => {
    if (req?.headers?.authorization?.split(' ')[1] !== AUTH) {
        res.status(401).json(commonDto(STATUS.ERROR, 'error auth'));
        return false;
    }
    return true;
};

export const getCurrentDate = () => {
    const date = new Date();
    return (
        date.getFullYear() +
        '-' +
        (date.getMonth() + 1) +
        '-' +
        date.getDate() +
        ' ' +
        date.getHours() +
        ':' +
        date.getMinutes() +
        ':' +
        date.getSeconds()
    );
};

export const getAndSqlReq = (searchText) => {
    const searchMass = searchText.toLowerCase().split(' ');
    const initialValue = '';
    return searchMass.reduce(
        (accumulator, item, index) => accumulator + `${index === 0 ? '' : ' AND '}tags like '%${item}%'`,
        initialValue,
    );
};
