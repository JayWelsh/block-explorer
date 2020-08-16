import { blockChainOptions } from '../../constants';

const selectedBlockchain = (state = {
    name: null,
    id: null,
    symbol: null,
    image: null
}, action) => {
    switch (action.type) {
        case 'SELECT_BLOCKCHAIN':
            if(action.blockchain) {
                const selectedBlockchain = blockChainOptions.filter(item => item.id === action.blockchain);
                if(selectedBlockchain[0]){
                    return selectedBlockchain[0];
                }
            }
            return state;
        default:
            const selectedBlockchain = blockChainOptions.filter(item => item.id === 'bitcoin');
            if(selectedBlockchain[0]){
                return selectedBlockchain[0];
            }
            return state;
    }
}

export default selectedBlockchain;