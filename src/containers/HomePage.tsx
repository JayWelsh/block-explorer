import React, { FunctionComponent, useEffect } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import {
    IHomePage,
    IBlockchainOption,
    IBlockchainSelectionReduxProps
} from '../interfaces';
import BlockchainSelection from '../components/BlockchainSelection';
import BlockchainSearchField from '../components/BlockchainSearchField';
import BlockchainLatestBlocks from '../components/BlockchainLatestBlocks';
import { selectBlockchain } from '../state/actions';

const HomePage: FunctionComponent<IHomePage & IBlockchainSelectionReduxProps> = ({blockchain, selectedBlockchain, setSelectBlockchain}) => {
    useEffect(() => {
        // Compare `blockchain` passed from React Router to `selectedBlockchain` from Redux
        if(blockchain && blockchain !== selectedBlockchain.id) {
            // Router parameter takes preference
            setSelectBlockchain(blockchain);
        }
    }, [blockchain, selectedBlockchain, setSelectBlockchain])
    return (
        <>
            <Grid container spacing={3}>
                <Grid item lg={2} md={3} sm={4} xs={12}>
                    <BlockchainSelection heading="Block Explorer"/>
                </Grid>
                <Grid item lg={10} md={9} sm={8} xs={12}>
                    <BlockchainSearchField/>
                    <BlockchainLatestBlocks useMarginTop={true}/>
                </Grid>
            </Grid>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);