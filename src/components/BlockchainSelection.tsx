import React, { FunctionComponent, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Link as RouterLink } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { priceFormat } from '../utils';
import { blockChainOptions } from '../constants';
import { 
    IBlockchainSelection,
    ICryptoTicker,
    IBlockchainOption
} from '../interfaces';
import { selectBlockchain } from '../state/actions';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
        cryptoList: {
            paddingTop: 0,
            paddingBottom: 0
        },
        cryptoListLogo: {
            height: '35px',
            left: '50%',
            position: 'relative',
            transform: 'translateX(-50%)'
        }
	}),
);

interface IBlockchainSelectionReduxProps {
    setSelectBlockchain: (arg0: string) => void;
    selectedBlockchain: IBlockchainOption;
}

const BlockchainSelection: FunctionComponent<IBlockchainSelection & IBlockchainSelectionReduxProps> = (props) => {
    const classes = useStyles();
    const [priceData, setPriceData] = useState<ICryptoTicker>({});
    const {heading, selectedBlockchain, setSelectBlockchain } = props;
    useEffect(() => {
        let isMounted = true;
        async function getPriceData() {
            // Join a list of cryptocurrency ids by URL encoded commas
            const coingeckoIds = blockChainOptions.map(item => item.id).join('%2C');
            const requestUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coingeckoIds}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;
            const usePriceData: ICryptoTicker  = {};
            fetch(requestUrl)
                .then(response => response.json())
                .then(data => {
                    for (let cryptoStats of data) {
                        usePriceData[cryptoStats.id] = cryptoStats.current_price;
                    }
                    if(isMounted){
                        setPriceData(usePriceData);
                    }
                })
                .catch((error) => {
                    console.error('Fetch Cryptocurreny Price Data Error:', error);
                });
        }
        getPriceData();
        // prevent memory leaks
        return () =>  { isMounted = false }
    }, []);
    return (
        <>
            {heading && 
                <Typography variant="h6" gutterBottom>
                    {heading}
                </Typography>
            }
            <Paper>
                <List className={classes.cryptoList}>
                    {blockChainOptions.map(item => 
                        <RouterLink onClick={() => setSelectBlockchain(item.id)} className="no-decorate link-text-subtle" to={item.id} key={item.id}>
                            <ListItem button selected={selectedBlockchain.id === item.id ? true : false}>
                                <ListItemIcon>
                                    <img className={classes.cryptoListLogo} src={item.image} alt={`${item.name} Logo`} />
                                </ListItemIcon>
                                <ListItemText primary={item.name} secondary={priceData[item.id] ? priceFormat({ value: priceData[item.id], label: '$' }) : "Loading..."} />
                            </ListItem>
                        </RouterLink>
                    )}
                </List>
            </Paper>
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

export default connect(mapStateToProps, mapDispatchToProps)(BlockchainSelection);