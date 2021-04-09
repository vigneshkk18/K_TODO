import React, { useState, useEffect, useRef } from 'react';
import styled, { ThemeProvider } from 'styled-components/native';
import { useSelector, useDispatch } from 'react-redux';
import { switchTheme } from '../redux/themeAction';
import { lightTheme, darkTheme } from '../themes/themes';
import { Dimensions, StatusBar, Switch, StyleSheet, Keyboard, KeyboardAvoidingView, ScrollView, SafeAreaView, Animated, FlatList } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

function HomeScreen(){
	const [ themeState, setthemeState ] = useState(false);
	const theme = useSelector((state)=>state.themeReducer.theme);
	const dispatch = useDispatch();
	const appTheme = themeState ? darkTheme : lightTheme;
	const toggleSwitch = () => setthemeState(themeState => !themeState);
	const [ title, settitle ] = useState("");
	const [ data, setcreatedata ] = useState([]);
	const [ pressed, setpressed ] = useState(true);
	const [ Animation, setAnimation ] = useState(new Animated.Value(0));
	const [ error, seterror ] = useState("");
	
		
	const readdatafromstorage = async() => {
		const list = [];
		const NumNote = await AsyncStorage.getItem('NumNote');
		for (var i=parseInt(NumNote)-1;i>=0;i--){
			const res = await AsyncStorage.getItem(String(i));
			if(res!==null){	
				list.push(JSON.parse(res));
			}
		}
		setcreatedata(list);
	}
	
	const dovalidation = () => {
		if(title.trim()!==''){
			return true;
		}else{
			return false;
		}
	}
	
	const handleAdd = async() => {

		var validate_result = dovalidation(); 
		if(validate_result){
			const date = new Date();
			const date_num = date.toLocaleDateString();
			const time_string = date.toLocaleTimeString();
			const NumNote = await AsyncStorage.getItem('NumNote');
			const list = {
				id: NumNote,
				note: title,
				createdAt: String(date_num)+' '+String(time_string),
			};
			let count = parseInt(NumNote)+1;
			await AsyncStorage.setItem(NumNote,JSON.stringify(list));
			await AsyncStorage.setItem('NumNote',String(count));
			readdatafromstorage();
			settitle("");
			setAnimation(new Animated.Value(0));
		}else{
			console.log('notvalid');
		}
	}
	
	const handleDelete = async(id) => {
		try{
			await AsyncStorage.removeItem(id);
			readdatafromstorage();
		}catch(error){
			console.log(error);
		}
	}
	
	const initsyncstorage = async() => {
		const NumNote = await AsyncStorage.getItem('NumNote');
		if(NumNote==null){
			await AsyncStorage.setItem('NumNote','0');
		}
	}
	
	const startAnimation = () => {
		Animated.timing(Animation,{
			toValue: 720,
			duration: 1000,
			useNativeDriver: true,
		}).start(()=>handleAdd());
	};
	
	const rotateInterPolate = Animation.interpolate({
		inputRange: [0,360],
		outputRange: ["0deg","360deg"]
	})
	
	const animatedStyles = {
		transform: [{rotate: rotateInterPolate}]
	}
	
	const clearData = async() => {
		await AsyncStorage.clear();
		readdatafromstorage();
		initsyncstorage();
	}
	
	const ItemSeparator = () => {
		return (<Separator />)
	}
	
	useEffect(()=>{
		if(pressed==true){
			initsyncstorage();
			readdatafromstorage();
			setpressed(false);
		}
	},[pressed])
	
	
	return (
		<ThemeProvider theme={appTheme}>
			<TotalWrapper>
			<StatusBar 
				backgroundColor = {appTheme.background}
				barStyle={appTheme.STATUS_BAR_STYLE}
			/>
			<Wrapper>
				<TitleText>TODO</TitleText>
				<AllDeleteIcon  onPress={()=>clearData()}>	
					<MaterialIcons name="delete-outline" size={24} color={appTheme.text_color} />
				</AllDeleteIcon>
				<Switch style= {styles.toggle}
					trackColor={{true: '#fc827e', false: '#7db6f2'}}
					thumbColor={appTheme.component_color}
					value = {themeState}
					onValueChange = {toggleSwitch}
				/>
			</Wrapper>
			<ContentHolder>
				<FlatList 
					data={data}
					showsVerticalScrollIndicator={false}
					keyExtractor={(item)=>item.id}
					ItemSeparatorComponent={ItemSeparator}
					renderItem={({item})=> {
						return(
							<ViewButton 
								onPress={()=>handleDelete( item.id )}
							>
								<ViewHolder key={item.id}>
									<TextHolder>
										<TimeStampText>TimeStamp: {item.createdAt}</TimeStampText>
										<ListText>{item.note}</ListText>
									</TextHolder>
								</ViewHolder>	
							</ViewButton>
						)
					}}
				/>
			</ContentHolder>
			<BottomWrapper style={{justifyContent:'space-around'}}>
				<AddNote selectionColor={appTheme.component_color} value= {title} onChangeText={title=>settitle(title)}/>
					<SendButton onPress={()=>startAnimation()}>
						<Animated.View style={animatedStyles}>
							<Ionicons name="ios-send" size={20} color="white" />
						</Animated.View>
					</SendButton>
			</BottomWrapper>
			</TotalWrapper>
		</ThemeProvider>
	);
}

const styles = StyleSheet.create({
	toggle: {
		position: "absolute",
		right: '2%',
		top: '25%',
	},
})

const AllDeleteIcon = styled.TouchableOpacity`
	width: 10%;
	height: 70%;
	background-color: ${(props)=>props.theme.component_color};
	align-items: center;
	justify-content: center;
	position: absolute;
	right: 20%;
	top: 15%;
	border-radius: 10px;
	
`;

const Separator = styled.View`
	width: 89%;
	height: 2px;
	marginLeft: 5.5%;
	background-color: ${(props)=>props.theme.text_color};
`;

const ViewButton = styled.TouchableOpacity`
	width: 89%;
	marginLeft: 20px;
`;

const SendButton = styled.TouchableOpacity`
	border-radius: 50px;
	width: 40px;
	height: 50%;
	justify-content: center;
	align-items: center;
	background-color: ${(props)=>props.theme.component_color};
`;

const TimeStampText = styled.Text`
	font-size: 10px;
	marginTop: 5px;
	marginLeft: 5px;
	color: ${(props) => props.theme.text_color};
`;

const AddNote = styled.TextInput`
	border-color: ${(props)=>props.theme.component_color};
	border-bottom-width: 2px;
	color: ${(props)=>props.theme.component_color};
	paddingLeft: 3%;
	width: 72%;
	height: 70%;
`;

const TotalWrapper = styled.View`
	flex: 1;
	background-color: ${(props)=> props.theme.background};
`;

const BottomWrapper = styled.View`
	height: 12%;
	flexDirection: row;
	align-items: center;
	background-color: transparent;
`;

const ContentHolder = styled.View`
	height: 80%;
	paddingTop: 3%;
	background-color: transparent;
`;

const Wrapper = styled.View`
	background-color: transparent;
	flexDirection: row;
	height: 8%;
`;

const TextHolder = styled.View`
	background-color: ${(props)=> props.theme.component_color};
	width: 100%;
`;

const ViewHolder = styled.View`
	flexDirection: row;
`;

const ListText = styled.Text`
	font-size: 16px;
	fontWeight: bold;
	marginTop: 5px;
	marginLeft: 5px;
	marginBottom: 5px;
	color: ${(props) => props.theme.text_color}; 
`;

const TitleText = styled.Text`
	font-size: 40px;
	fontWeight: bold;
	marginHorizontal: 5%;
	color: ${(props) => props.theme.component_color}; 
`;

export default HomeScreen;

{/*



	showMessage({
  message: "My message title",
  description: "My message description",
  type: "default",
  backgroundColor: "purple", // background color
  color: "#606060", // text color
});

*/}