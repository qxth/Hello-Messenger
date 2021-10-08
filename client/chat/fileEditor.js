import React from 'react'
import { hot } from "react-hot-loader";
import { withStyles } from "@material-ui/core/styles";
import {Box, Button} from "@material-ui/core"


const styles = {
	mainBox: {
		width: 530,
		height: 258,
		borderRadius: "6px",
		backgroundColor: "#36393f",
	},
	boxFooter: {
		padding: 20,
		display: "flex",
		backgroundColor: "#2f3136",
		WebkitBoxPack: "justify",
		MsFlexPack: "justify",
		WebkitBoxAlign: "center",
		MsFlexAlign: "center",
		alignItems: "center",
		justifyContent: "flex-end"
	},
	boxContent: {
		padding: 20
	},
	contentButtons: {
		display: "flex"
	},
	buttonStyles: {
		textTransform: "none !important",
		color: "#fff !important"
	},
	infoImage: {
		fontSize: 20,
		fontWeight: "700",
		height: 22,
		color: "#fff",
		textOverflow: "ellipsis"
	},
	infoSend: {
		color: "#c1c3c5",
		marginTop: 4,
		fontSize: 14,
		marginBottom: 29,
		"&>strong":{
			color: "#fff"
		}
	},
}

class FileEditor extends React.Component{
	constructor(props){
		super(props)
	}
	render(){
		const {classes, fileEditorOptions, saveFile, cancelFile} = this.props
		return(
			<div className={classes.mainBox}>
			 <div className={classes.boxContent}>
			 	<div>
			 		<img 
			 		   alt={fileEditorOptions.name} 
			 		   src={fileEditorOptions.url}
			 		   id={"fileImage"}
			 		   style={{
			 		   	width: "initial",
			 		   	height: 104,
			 		   	marginTOp: "-33px"
			 		   }}
			 		 />
			 		<div className={classes.description}>
				 		<div className={classes.infoImage}>{fileEditorOptions.name}</div>
				 		<div className={classes.infoSend}>Enviar a <strong>{fileEditorOptions.friendName}</strong></div>
				 	</div>
			 	</div>
			 </div>
			 <div className={classes.boxFooter}>
			 	<div className={classes.contentButtons}>
			 	 <Button onClick={cancelFile} className={classes.buttonStyles}>Cancelar</Button>
			 	 <Button onClick={saveFile}style={{backgroundColor: "hsl(235,calc(var(--saturation-factor, 1)*85.6%),64.7%)"}}className={classes.buttonStyles}>Aceptar</Button>
			 	</div>
			 </div>
			</div>
		)
	}

}

export default hot(module)(withStyles(styles)(FileEditor));