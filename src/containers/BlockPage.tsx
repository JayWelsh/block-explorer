import React, {FunctionComponent, useEffect, useState} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
    IBlockPage,
    IBlockchainOption,
    IBlockchainSelectionReduxProps,
    IBlockMetaData,
} from '../interfaces';
import { selectBlockchain } from '../state/actions';
import {
    bitcoinBlockInfoProps,
    ethereumBlockInfoProps,
    bitcoinCashBlockInfoProps,
} from '../constants';
import { isNumeric } from '../utils';
import BlockInfoTable from '../components/BlockInfoTable';
import BlockTransactionsTable from '../components/BlockTransactionsTable';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
        headerContainer: {
            display: 'flex',
            marginBottom: theme.spacing(1),
        },
        headerLogo: {
            height: '35px',
            marginRight: theme.spacing(2)
        },
        subheading: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(4)
        },
        transactionsHeading: {
            marginTop: theme.spacing(4),
            marginBottom: theme.spacing(1)
        },
        table: {
            width: '100%',
            whiteSpace: 'pre'
        }
	}),
);

const BlockPage: FunctionComponent<IBlockPage & IBlockchainSelectionReduxProps> = ({blockId, blockchain, selectedBlockchain, setSelectBlockchain}) => {
    const classes = useStyles();
    const [blockHeight, setBlockHeight] = useState(isNumeric(blockId.toString()) ? blockId : null); // Casts blockId to string to prevent Ethereum hex codes from being read as numbers
    const [blockMetaData, setBlockMetaData] = useState<IBlockMetaData[]>([]);
    const [blockTransactionCount, setBlockTransactionCount] = useState(0);
    useEffect(() => {
        // Compare `blockchain` passed from React Router to `selectedBlockchain` from Redux
        if(blockchain && blockchain !== selectedBlockchain.id) {
            // Router parameter takes preference
            setSelectBlockchain(blockchain);
        }
    }, [blockchain, selectedBlockchain, setSelectBlockchain])
    useEffect(() => {
        let isMounted = true;

        const fetchBlockData = async () => {
            if(selectedBlockchain?.id){
                const requestUrl = `https://api.blockchair.com/${selectedBlockchain.id}/dashboards/block/${blockId}`;
                fetch(requestUrl)
                    .then(response => response.json())
                    .then(responseData => {
                        let useBlockInfoProps = bitcoinBlockInfoProps;
                        if(selectedBlockchain.id === 'ethereum') {
                            useBlockInfoProps = ethereumBlockInfoProps;
                        } else if(selectedBlockchain.id === 'bitcoin-cash') {
                            useBlockInfoProps = bitcoinCashBlockInfoProps;
                        }
                        let blockMetaData = [];
                        for (let [key, item] of Object.entries(useBlockInfoProps)) {
                            if(responseData.data[blockId]){
                                if(blockMetaData.length === 1) {
                                    // Add confirmation record as second record
                                    // Confirmation formula according to https://blockchair.com/api/docs#link_100
                                    blockMetaData.push({
                                        key: 'confirmations',
                                        label: 'Confirmations',
                                        value: responseData.context.state - responseData.data[blockId].block.id + 1
                                    })
                                }
                                if(responseData.data[blockId].block[key] === 0 || responseData.data[blockId].block[key]){
                                    if(key === 'id') {
                                        setBlockHeight(responseData.data[blockId].block[key]);
                                    }
                                    if(key === 'transaction_count') {
                                        setBlockTransactionCount(responseData.data[blockId].block[key]);
                                    }
                                    blockMetaData.push({
                                        key,
                                        label: item.label,
                                        value: responseData.data[blockId].block[key],
                                        ...(item.easyCopy ? { easyCopy: true } : {}),
                                        ...(item.format ? {formattedValue: item.format(responseData.data[blockId].block[key])} : {})
                                    })
                                }else if(key !== 'confirmations'){
                                    blockMetaData.push({
                                        key,
                                        label: item.label,
                                        value: null,
                                    })
                                }
                            }
                        }
                        if(isMounted) {
                            setBlockMetaData(blockMetaData);
                        }
                    })
                    .catch((error) => {
                        console.error(`Fetch ${selectedBlockchain.name} Block (blockId: ${blockId}) Data Error:`, error);
                    });
            }
        }
        fetchBlockData()

        // prevent memory leaks
        return () =>  { isMounted = false }
    }, [blockId, selectedBlockchain])
    return (
        <>
            <div className={classes.headerContainer}>
                <RouterLink to={`/${selectedBlockchain.id}`}>
                    <img className={classes.headerLogo} src={selectedBlockchain.image} alt={`${selectedBlockchain.name} Logo`} />
                </RouterLink>
                <RouterLink to="/" className="no-decorate link-text-subtle">
                    <Typography variant="h5">
                        <b>{selectedBlockchain.name}</b>
                    </Typography>
                </RouterLink>
                <ChevronRightIcon fontSize="inherit" style={{fontSize: 32}} />
                <RouterLink to={`./${blockId}`} className="no-decorate link-text-subtle">
                    <Typography variant="h5">
                        <b>Block</b>
                    </Typography>
                </RouterLink>
            </div>
            <Divider />
            <Typography className={classes.subheading}>
                Block at depth {blockHeight ? blockHeight : <i>Loading</i>} in the {selectedBlockchain.name} Blockchain
            </Typography>
            {blockMetaData && (blockMetaData.length > 0) &&
                <>
                    <BlockInfoTable blockMetaData={blockMetaData} />
                    <Typography className={classes.transactionsHeading}>
                        Transactions:
                    </Typography>
                    <BlockTransactionsTable selectedBlockchainId={selectedBlockchain?.id} blockHeight={blockHeight} blockTransactionCount={blockTransactionCount} />
                </>
            }
        </>
    );
}

interface ReduxStateProps {
    selectedBlockchain: IBlockchainOption
}

const mapStateToProps = (state: ReduxStateProps) => {
    return { selectedBlockchain: state.selectedBlockchain }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        setSelectBlockchain: (blockchain: string) => dispatch(selectBlockchain(blockchain))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BlockPage);