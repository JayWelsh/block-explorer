import React, { FunctionComponent, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import moment from 'moment';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { 
    IBlockchainLatestBlocks,
    IBlockchainOption,
} from '../interfaces';
import {
    centerShortenLongString,
    numberFormat
} from '../utils';

interface ReduxStateProps {
    selectedBlockchain: IBlockchainOption
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        marginTop: {
            marginTop: theme.spacing(1),
            width: '100%',
        },
        root: {
            width: '100%',
        },
        paper: {
            width: '100%',
            marginBottom: theme.spacing(2),
        },
        table: {
            whiteSpace: 'nowrap'
        },
        visuallyHidden: {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 1,
            margin: -1,
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            top: 20,
            width: 1,
        },
        tableHeadingRoot: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(1),
        },
        tableTitle: {
            flex: '1 1 100%',
        },
        tableWrapper: {
            overflowX: 'auto',
        },
    }),
);

interface Data {
    id: number;
    hash: string;
    time: string;
    miner: string;
    guessed_miner: string;
    size: number;
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
}

const headCells: HeadCell[] = [
    { id: 'id', disablePadding: false, label: 'Height' },
    { id: 'hash', disablePadding: false, label: 'Hash' },
    { id: 'time', disablePadding: false, label: 'Mined' },
    { id: 'miner', disablePadding: false, label: 'Miner' },
    { id: 'size', disablePadding: false, label: 'Size' },
];
  
function EnhancedTableHead(props: EnhancedTableProps) {
    const { classes, order, orderBy, onRequestSort } = props;
    const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };
  
    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={'left'}
              padding={headCell.disablePadding ? 'none' : 'default'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
}
  
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}
  
type Order = 'asc' | 'desc';
  
function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}
  
function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}
  
interface EnhancedTableProps {
    classes: ReturnType<typeof useStyles>;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    order: Order;
    orderBy: string;
}

const BlockchainLatestBlocks: FunctionComponent<IBlockchainLatestBlocks & ReduxStateProps> = ({heading, useMarginTop = false, selectedBlockchain}) => {
    const classes = useStyles();
    const [latestBlockData, setLatestBlockData] = useState<Data[]>([]);
    const [order, setOrder] = React.useState<Order>('desc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>('time');
    const rowsPerPage = 10;

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, latestBlockData ? latestBlockData.length : 0);

    useEffect(() => {
        let isMounted = true;
        setLatestBlockData([]);
        const fetchLatestBlocks = async () => {
            if(selectedBlockchain?.id){
                const requestUrl = `https://api.blockchair.com/${selectedBlockchain.id}/blocks`;
                fetch(requestUrl)
                    .then(response => response.json())
                    .then(responseData => {
                        if(isMounted){
                            setLatestBlockData(responseData?.data);
                        }
                    })
                    .catch((error) => {
                        console.error(`Fetch Latest ${selectedBlockchain.name} Blocks Data Error:`, error);
                    });
            }
        }
        fetchLatestBlocks();

        // prevent memory leaks
        return () =>  { isMounted = false }
    }, [selectedBlockchain])

    return (
        <div className={useMarginTop ? classes.marginTop : undefined}>
            <Typography variant="h6" gutterBottom>
                {heading ? heading : `Latest ${selectedBlockchain.name} Blocks`}
            </Typography>
                <Paper className={classes.paper}>
                    {heading &&
                        <Toolbar className={classes.tableHeadingRoot}>
                            <Typography className={classes.tableTitle} variant="h6" id="tableTitle" component="div">
                                {heading}
                            </Typography>
                        </Toolbar>
                    }
                    <TableContainer>
                    <div className={classes.tableWrapper}>
                        <Table
                            className={classes.table}
                            aria-labelledby="tableTitle"
                            size={'medium'}
                            aria-label="enhanced table"
                        >
                            {latestBlockData && latestBlockData.length > 0 &&
                                <EnhancedTableHead
                                    classes={classes}
                                    order={order}
                                    orderBy={orderBy}
                                    onRequestSort={handleRequestSort}
                                />
                            }
                            <TableBody>
                            {stableSort(latestBlockData, getComparator(order, orderBy))
                                .map((row, index) => {
                                    const labelId = `blockchain-latest-blocks-table-row-${index}`;
                                    const timeSinceMined = moment.utc(row.time).fromNow();
                                    return (
                                        <TableRow
                                            hover
                                            tabIndex={-1}
                                            key={row.id}
                                        >
                                            <TableCell component="th" id={labelId} scope="row">
                                                <Link component={RouterLink} to={`${selectedBlockchain.id}/block/${row.id}`}>
                                                    {row.id}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <Link component={RouterLink} to={`${selectedBlockchain.id}/block/${row.id}`}>
                                                    {centerShortenLongString(row.hash, 42)}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                {timeSinceMined}
                                            </TableCell>
                                            <TableCell>{row.miner ? row.miner : row.guessed_miner}</TableCell>
                                            <TableCell>{numberFormat({ value: row.size, label: 'Bytes', prefix: false })}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: (53 * emptyRows) + 57 }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                            </TableBody>
                        </Table>
                    </div>
                    </TableContainer>
                </Paper>
        </div>
    );
}

const mapStateToProps = (state: ReduxStateProps) => {
    return { selectedBlockchain: state.selectedBlockchain }
}

export default connect(mapStateToProps)(BlockchainLatestBlocks);