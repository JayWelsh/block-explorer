import React, { FunctionComponent, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from "react-router-dom";
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
	IBlockchainOption
} from '../interfaces';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		searchBar: {
			width: 'calc(100% - 110px)',
		},
		searchButton: {
			width: '100px',
			height: '56px',
			marginLeft: '10px'
		}
	}),
);

interface ReduxStateProps {
	selectedBlockchain: IBlockchainOption
}

const BlockchainSearchField: FunctionComponent<ReduxStateProps & RouteComponentProps> = (props) => {
	const classes = useStyles();
	const [isError, setIsError] = useState(false);
	const [currentValue, setCurrentValue] = useState("");
	const handleUpdateValue = (event: any) => {
		setCurrentValue(event.target.value);
		setIsError(false);
	}
	const detectEnterPress = (event: React.KeyboardEvent) => {
		if(event.keyCode === 13){
			handleValidateAndRedirect();
		}
	 }
	const handleValidateAndRedirect = () => {
		if(props.selectedBlockchain?.id){
			const requestUrl = `https://api.blockchair.com/${props.selectedBlockchain.id}/dashboards/block/${currentValue}`;
			fetch(requestUrl)
				.then(response => response.json())
				.then(responseData => {
					if(responseData.data[currentValue].block) {
						setIsError(false);
						props.history.push(`/${props.selectedBlockchain.id}/block/${responseData.data[currentValue].block.id}`)
					}else{
						setIsError(true);
					}
				})
				.catch((error) => {
					setIsError(true);
					console.error(`Fetch ${props.selectedBlockchain.name} Block (blockId: ${currentValue}) Data Error:`, error);
				})
		}
	}
	return (
		<>
			<TextField
				className={classes.searchBar}
				id="outlined-basic" 
				label={`Search ${props.selectedBlockchain.name} Blockchain`}
				variant="outlined"
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<SearchIcon />
						</InputAdornment>
					),
				}}
				error={isError}
				onChange={handleUpdateValue}
				onKeyDown={detectEnterPress}
				value={currentValue}
				helperText={isError ? `Please enter a valid ${props.selectedBlockchain.name} Block Hash or ID` : ""}
			/>
			<Button onClick={() => handleValidateAndRedirect()} variant="contained" color="primary" className={classes.searchButton}>Search</Button>
		</>
	);
}

const mapStateToProps = (state: ReduxStateProps) => {
	return { selectedBlockchain: state.selectedBlockchain }
}

export default withRouter(connect(mapStateToProps)(BlockchainSearchField));