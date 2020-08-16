import moment from 'moment';
import {
    numberFormat,
    priceFormat,
    satoshiToBitcoin,
    weiToEther,
    centerShortenLongString,
} from '../utils';
import {
    ITableRecordProp
} from '../interfaces';
import BitcoinLogo from '../assets/bitcoin.svg';
import EthereumLogo from '../assets/ethereum.svg';
import BitcoinCashLogo from '../assets/bitcoin-cash.svg';

export const blockChainOptions = [
	{
		name: 'Bitcoin',
        id: 'bitcoin',
        symbol: 'btc',
        image: BitcoinLogo
	},
	{
		name: 'Ethereum',
        id: 'ethereum',
        symbol: 'eth',
        image: EthereumLogo
	},
	{
		name: 'Bitcoin Cash',
        id: 'bitcoin-cash',
        symbol: 'bch',
        image: BitcoinCashLogo
	},
];

const sharedBitcoinBlockInfoProps: ITableRecordProp = {
    hash: {
        label: 'Hash',
        easyCopy: true,
    },
    confirmations: {
        label: 'Confirmations',
    },
    time: {
        label: 'Timestamp',
        format: (timestamp) => moment.utc(timestamp).local().format('YYYY-MM-DD HH:mm')
    },
    id: {
        label: 'Height',
    },
    guessed_miner: {
        label: 'Miner'
    },
    transaction_count: {
        label: 'Number of Transactions',
        format: (txCount) => numberFormat({ value: txCount })
    },
    difficulty: {
        label: 'Difficulty',
        format: (difficulty) => numberFormat({ value: difficulty })
    },
    merkle_root: {
        label: 'Merkle Root',
    },
    version_hex: {
        label: 'Version'
    },
    bits: {
        label: 'Bits',
        format: (bits) => numberFormat({ value: bits })
    },
    weight: {
        label: 'Weight',
        format: (weight) => numberFormat({ value: weight, label: 'WU', prefix: false })
    },
    size: {
        label: 'Size',
        format: (weight) => numberFormat({ value: weight, label: 'Bytes', prefix: false })
    },
    nonce: {
        label: 'Nonce',
        format: (nonce) => numberFormat({ value: nonce })
    },
}

export const bitcoinBlockInfoProps: ITableRecordProp = {
    ...sharedBitcoinBlockInfoProps,
    input_total: {
        label: 'Transaction Volume',
        format: (weight) => priceFormat({ value: satoshiToBitcoin(weight), label: 'BTC', prefix: false, decimals: 8 })
    },
    reward: {
        label: 'Block Reward',
        format: (reward) => priceFormat({ value: satoshiToBitcoin(reward), label: 'BTC', prefix: false, decimals: 8 })
    },
    fee_total: {
        label: 'Fee Reward',
        format: (reward) => priceFormat({ value: satoshiToBitcoin(reward), label: 'BTC', prefix: false, decimals: 8 })
    },
}

export const bitcoinCashBlockInfoProps: ITableRecordProp = {
    ...sharedBitcoinBlockInfoProps,
    input_total: {
        label: 'Transaction Volume',
        format: (weight) => priceFormat({ value: satoshiToBitcoin(weight), label: 'BCH', prefix: false, decimals: 8 })
    },
    reward: {
        label: 'Block Reward',
        format: (reward) => priceFormat({ value: satoshiToBitcoin(reward), label: 'BCH', prefix: false, decimals: 8 })
    },
    fee_total: {
        label: 'Fee Reward',
        format: (reward) => priceFormat({ value: satoshiToBitcoin(reward), label: 'BCH', prefix: false, decimals: 8 })
    },
}

export const ethereumBlockInfoProps: ITableRecordProp = {
    hash: {
        label: 'Hash',
        easyCopy: true,
    },
    confirmations: {
        label: 'Confirmations',
    },
    time: {
        label: 'Timestamp',
        format: (timestamp) => moment.utc(timestamp).local().format('YYYY-MM-DD HH:mm')
    },
    id: {
        label: 'Height',
    },
    miner: {
        label: 'Miner'
    },
    transaction_count: {
        label: 'Number of Transactions',
        format: (txCount) => numberFormat({ value: txCount })
    },
    gas_limit: {
        label: 'Gas Limit',
        format: (gasLimit) => numberFormat({ value: gasLimit, label: 'Gwei', prefix: false })
    },
    gas_used: {
        label: 'Gas Used',
        format: (gasUsed) => numberFormat({ value: gasUsed, label: 'Gwei', prefix: false })
    },
    uncle_count: {
        label: 'Uncle Count',
        format: (uncleCount) => numberFormat({ value: uncleCount })
    },
    difficulty: {
        label: 'Difficulty',
        format: (difficulty) => numberFormat({ value: difficulty })
    },
    state_root: {
        label: 'State Root',
    },
    transactions_root: {
        label: 'Transactions Root',
    },
    logs_bloom: {
        label: 'Logs Bloom',
        easyCopy: true,
        format: (log) => centerShortenLongString(log.toString(), 64),
    },
    size: {
        label: 'Size',
        format: (weight) => numberFormat({ value: weight, label: 'Bytes', prefix: false })
    },
    nonce: {
        label: 'Nonce',
        format: (nonce) => numberFormat({ value: nonce })
    },
    value_total: {
        label: 'Transaction Volume',
        format: (weight) => priceFormat({ value: weiToEther(weight), label: 'ETH', prefix: false, decimals: 8 })
    },
    reward: {
        label: 'Block Reward',
        format: (reward) => priceFormat({ value: weiToEther(reward), label: 'ETH', prefix: false, decimals: 8 })
    },
    fee_total: {
        label: 'Fee Reward',
        format: (reward) => priceFormat({ value: weiToEther(reward), label: 'ETH', prefix: false, decimals: 8 })
    },
}

export const bitcoinTransactionTopLevel: ITableRecordProp = {
    id: {
        label: "ID",
    },
    hash: {
        label: "Hash",
    },
    input_total: {
        label: "Amount",
        format: (amount) => priceFormat({ value: satoshiToBitcoin(amount), label: 'BTC', prefix: false, decimals: 8 })
    },
    fee: {
        label: "Fee",
        format: (fee) => priceFormat({ value: satoshiToBitcoin(fee), label: 'BTC', prefix: false, decimals: 8 })
    },
    time: {
        label: "Timestamp",
        format: (timestamp) => moment.utc(timestamp).local().format('YYYY-MM-DD HH:mm')
    },
    type: {
        label: "Type",
    }
}

export const bitcoinCashTransactionTopLevel: ITableRecordProp = {
    id: {
        label: "ID",
    },
    hash: {
        label: "Hash",
    },
    input_total: {
        label: "Amount",
        format: (amount) => priceFormat({ value: satoshiToBitcoin(amount), label: 'BCH', prefix: false, decimals: 8 })
    },
    fee: {
        label: "Fee",
        format: (fee) => priceFormat({ value: satoshiToBitcoin(fee), label: 'BCH', prefix: false, decimals: 8 })
    },
    time: {
        label: "Timestamp",
        format: (timestamp) => moment.utc(timestamp).local().format('YYYY-MM-DD HH:mm')
    },
    type: {
        label: "Type",
    }
}

export const ethereumTransactionTopLevel: ITableRecordProp = {
    id: {
        label: "ID",
    },
    hash: {
        label: "Hash",
    },
    internal_value: {
        label: "Amount",
        format: (amount) => priceFormat({ value: weiToEther(amount), label: 'ETH', prefix: false, decimals: 8 })
    },
    fee: {
        label: "Fee",
        format: (fee) => priceFormat({ value: weiToEther(fee), label: 'ETH', prefix: false, decimals: 8 })
    },
    time: {
        label: "Timestamp",
        format: (timestamp) => moment.utc(timestamp).local().format('YYYY-MM-DD HH:mm')
    },
    type: {
        label: "Type",
    }
}