import React, {FunctionComponent, useEffect, useState} from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { 
    bitcoinTransactionTopLevel,
    ethereumTransactionTopLevel,
    bitcoinCashTransactionTopLevel,
} from '../constants';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
        table: {
            width: '100%',
            whiteSpace: 'pre'
        }
	}),
);

interface IBlockInfoTable {
    blockHeight: number | string | null;
    blockTransactionCount: number;
    selectedBlockchainId: string;
}

interface ITableData {
    id?: number;
    hash?: string;
    amount?: string | number;
    fee?: string | number;
    timestamp?: string | number;
    type?: string;
}

const BlockTransactionsTable: FunctionComponent<IBlockInfoTable> = ({blockTransactionCount, blockHeight, selectedBlockchainId}) => {
    const classes = useStyles();
    const [useBlockTransactionCount, setBlockTransactionCount] = useState(0);
    const [useBlockTransactionData, setBlockTransactionData] = useState<ITableData[]>([]);
    const [page, setPage] = useState(0);
    const rowsPerPage = 10;
    useEffect(() => {
        let isMounted = true;
        const fetchBlockTransactionData = async () => {
            if(typeof blockHeight === 'number') {
                let blockTransactionData: ITableData[] = [];
                const requestUrl = `https://api.blockchair.com/${selectedBlockchainId}/transactions?q=block_id(${blockHeight})&limit=${rowsPerPage}&offset=${rowsPerPage * page}`;
                fetch(requestUrl)
                    .then(response => response.json())
                    .then(responseData => {
                        for(let transaction of responseData.data) {
                            let parsedTransactionData: ITableData = {};
                            let useBlockInfoProps = bitcoinTransactionTopLevel;
                            if(selectedBlockchainId === 'ethereum') {
                                useBlockInfoProps = ethereumTransactionTopLevel;
                            } else if(selectedBlockchainId === 'bitcoin-cash') {
                                useBlockInfoProps = bitcoinCashTransactionTopLevel;
                            }
                            parsedTransactionData["id"] = transaction["id"] ? transaction["id"] : "N/A";
                            parsedTransactionData["hash"] = transaction["hash"] ? transaction["hash"] : transaction["hash"];
                            parsedTransactionData["amount"] = transaction["input_total"] && useBlockInfoProps["input_total"].format ? useBlockInfoProps["input_total"].format(transaction["input_total"]) : "N/A";
                            if(!transaction["input_total"]) {
                                parsedTransactionData["amount"] = transaction["internal_value"] && useBlockInfoProps["internal_value"].format ? useBlockInfoProps["internal_value"].format(transaction["internal_value"]) : "N/A";
                            }
                            parsedTransactionData["fee"] = transaction["fee"] && useBlockInfoProps["fee"].format ? useBlockInfoProps["fee"].format(transaction["fee"]) : "N/A";
                            parsedTransactionData["timestamp"] = transaction["time"] && useBlockInfoProps["time"].format ? useBlockInfoProps["time"].format(transaction["time"]) : "N/A";
                            parsedTransactionData["type"] = transaction["type"] ? transaction["type"] : "N/A";
                            blockTransactionData.push(parsedTransactionData);
                        }
                        if(isMounted) {
                            setBlockTransactionData(blockTransactionData);
                        }
                    })
                    .catch((error) => {
                        console.error(`Fetch ${selectedBlockchainId} Block Transactions (blockHeight: ${blockHeight}) Data Error:`, error);
                    });
            }
        }
        fetchBlockTransactionData();

        // prevent memory leaks
        return () =>  { isMounted = false }
    }, [blockHeight, selectedBlockchainId, page])
    useEffect(() => {
        setBlockTransactionCount(blockTransactionCount)
    }, [blockTransactionCount])
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    }
    return (
        <Paper>
            <TableContainer>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align={'left'}>
                                Hash
                            </TableCell>
                            <TableCell align={'left'}>
                                Amount
                            </TableCell>
                            <TableCell align={'left'}>
                                Fee
                            </TableCell>
                            <TableCell align={'left'}>
                                Timestamp
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {
                        useBlockTransactionData.map((row, index) => {
                            const labelId = `blockchain-transaction-table-row-${index}`;
                            return (
                                <TableRow
                                    hover
                                    tabIndex={-1}
                                    key={row.id}
                                >
                                    <TableCell component="th" id={labelId} scope="row">
                                        {row.hash ? <a target='_blank' rel='noopener noreferrer' href={`https://blockchair.com/${selectedBlockchainId}/transaction/${row.hash}`}>{row.hash}</a> : <i>Block Reward</i>}
                                    </TableCell>
                                    <TableCell>
                                        {row.amount}
                                    </TableCell>
                                    <TableCell>
                                        {row.fee}
                                    </TableCell>
                                    <TableCell>
                                        {row.timestamp}
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    }
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10]}
                component="div"
                count={useBlockTransactionCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
            />
        </Paper>
    );
}

export default BlockTransactionsTable;