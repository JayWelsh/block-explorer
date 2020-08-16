import React, {FunctionComponent, useEffect, useState} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CopyIcon from '@material-ui/icons/FileCopy';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {  } from '../utils';
import { IBlockMetaData } from '../interfaces';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
        table: {
            width: '100%',
            whiteSpace: 'pre'
        }
	}),
);

interface IBlockInfoTable {
    blockMetaData: IBlockMetaData[];
}

const BlockInfoTable: FunctionComponent<IBlockInfoTable> = ({blockMetaData}) => {
    const classes = useStyles();
    const [useBlockMetaData, setBlockMetaData] = useState<IBlockMetaData[]>([]);
    useEffect(() => {
        setBlockMetaData(blockMetaData);
    }, [blockMetaData])
    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableBody>
                {useBlockMetaData.map((row) => {
                    let useValue = (row.value || row.value === 0) ? row.value : <i>Pending</i>;
                    if(row.formattedValue) {
                        useValue = row.formattedValue;
                    }
                    let easyCopy;
                    if(row.easyCopy) {
                        easyCopy = <div className="clipboard-copy link-text-subtle" onClick={() => navigator.clipboard.writeText(row.value.toString())}><CopyIcon fontSize="small"></CopyIcon></div>;
                    }
                    return (
                        <TableRow key={row.key}>
                            <TableCell>{row.label}</TableCell>
                            <TableCell>{useValue}{easyCopy}</TableCell>
                        </TableRow>
                    )
                })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default BlockInfoTable;