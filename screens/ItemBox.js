import Swipeable from 'react-native-gesture-handler/Swipeable';
import React from 'react';
import styled from 'styled-components/native';

const ItemBox = (props) => {
	return(	
		<ViewHolder key={props.id}>
			<TextHolder>
				<TimeStampText>TimeStamp: {props.createdAt}</TimeStampText>
				<ListText>{props.note}</ListText>
			</TextHolder>	
		</ViewHolder>
	);					
};

export default ItemBox;

const TimeStampText = styled.Text`
	font-size: 10px;
	marginTop: 5px;
	marginLeft: 5px;
	color: ${(props) => props.theme.background};
`;

const TextHolder = styled.View`
	background-color: ${(props)=> props.theme.text_color};
	width: 93.5%;
`;

const ViewHolder = styled.View`
	flexDirection: row;
	marginTop: 5px;
	marginLeft: 20px;
	marginRight: 20px;
`;

const ListText = styled.Text`
	font-size: 16px;
	fontWeight: bold;
	marginTop: 5px;
	marginLeft: 5px;
	marginBottom: 5px;
	color: ${(props) => props.theme.background}; 
`;