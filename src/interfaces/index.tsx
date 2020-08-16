export interface IBlockPage {
    blockId: string;
    blockchain: string;
}

export interface IHomePage {
    blockchain: string;
}

export interface IBlockchainOption {
    name: string;
    id: string;
    symbol: string;
    image: string;
}

export interface IBlockchainSelection {
    heading?: string;
    selectedBlockchain?: IBlockchainOption;
}

export interface IBlockchainLatestBlocks {
    heading?: string;
    useMarginTop?: boolean;
}

export interface ICryptoTicker {
    [key: string]: number;
}

export interface IBlockchainSelectionReduxProps {
    setSelectBlockchain: (arg0: string) => void;
    selectedBlockchain: IBlockchainOption;
}

export interface ITableCellMetaProps {
    label: string;
    easyCopy?: boolean;
    format?: (arg0: string | number) => string | number
}

export interface ITableRecordProp {
    [key: string]: ITableCellMetaProps
}

export interface IBlockMetaData extends ITableCellMetaProps {
    key: string;
    value: string | number;
    formattedValue?: string | number;
}