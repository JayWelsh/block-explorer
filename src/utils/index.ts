import { createBrowserHistory, createHashHistory } from 'history';
import numeral from 'numeral';
import BigNumber from 'bignumber.js';

BigNumber.config({ EXPONENTIAL_AT: 100 });

export function configureHistory() {
	return window.matchMedia('(display-mode: standalone)').matches
		? createHashHistory()
		: createBrowserHistory()
}

interface INumberFormatParams {
    value: number | string,
    decimals?: number,
    label?: string | boolean,
    prefix?: boolean
}

export const numberFormat = (params: INumberFormatParams) => {
    const { value, decimals = 0, label = false, prefix = true } = params;
    let decimalString = '';
    for(let i = 0; i < decimals; i++){
        decimalString += '0';
    }
    const format = '0,0.' + decimalString;
    if (prefix && label) {
        return label + numeral(value).format(format);
    } else if(label) {
        return numeral(value).format(format) + ' ' + label;
    } else {
        return numeral(value).format(format)
    }
}

export const priceFormat = (params: INumberFormatParams) => {
    const { value, decimals = 2, label = false, prefix = true } = params;
    return numberFormat({ value, decimals, label, prefix });
}

export const centerShortenLongString = (string: string, maxLength: number) => {
	if(typeof string === 'string') {
		if(string.length > maxLength) {
			const charCountForRemoval = string.length - maxLength;
			const stringHalfwayPoint = Math.floor(maxLength/2);
			string = string.slice(0, stringHalfwayPoint) + "..." + string.slice(stringHalfwayPoint + charCountForRemoval, string.length);
			return string;
		}else{
			return string;
		}
	}else{
		return '';
	}
}

export const weiToEther = (wei : number | string) => {
	if(typeof wei === "string"){
		return new BigNumber(wei).dividedBy('1e18').toString();
	}else{
		return new BigNumber(wei.toString()).dividedBy('1e18').toString();
	}
}

export const etherToWei = (ether : number | string) => {
	if(typeof ether === "string"){
		return new BigNumber(ether).multipliedBy('1e18').toString();
	}else{
		return new BigNumber(ether.toString()).multipliedBy('1e18').toString();
	}
}

export const satoshiToBitcoin = (satoshi : number | string) => {
	if(typeof satoshi === "string"){
		return new BigNumber(satoshi).dividedBy('1e8').toString();
	}else{
		return new BigNumber(satoshi.toString()).dividedBy('1e8').toString();
	}
}

export const bitcoinToSatoshi = (bitcoin : number | string) => {
	if(typeof bitcoin === "string"){
		return new BigNumber(bitcoin).multipliedBy('1e8').toString();
	}else{
		return new BigNumber(bitcoin.toString()).multipliedBy('1e8').toString();
	}
}

export const isNumeric = (num: any) => (typeof(num) === 'number' || (typeof(num) === "string" && num.trim() !== '' && num.indexOf("0x") === -1)) && !isNaN(num as number);