import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { StyleSheet, Text, View, Image, Pressable, FlatList, requireNativeComponent } from "react-native";
//가로 비율과 세로 비율이 맞게 
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Foundation } from "@expo/vector-icons";
import PagerView from "react-native-pager-view";

const data2 = [
  {
    timestamp: 1625945400000,
    value: 33575.25,
  },
  {
    timestamp: 1625946300000,
    value: 33545.25,
  },
  {
    timestamp: 1625947200000,
    value: 33510.25,
  },
  {
    timestamp: 1625948100000,
    value: 33215.25,
  },
];

export default function App() {
  //클릭을 했을 때 해당화면으로 넘어감
  const [isReady,setReady]= React.useState(false);
  //데이터 저장 
  const [data,SetData] = React.useState([]);
  const [market,setMarket]= React.useState([]);
  const [charts,setCharts]= React.useState([]);

  React.useEffect(() => {

    const timer =setTimeout( async()=> {
      try{
        const market = await fetch("https://api.upbit.com/v1/market/all?isDetails=false");
        const json_market= await market.json();
        setMarket(json_market);

        const res = await fetch("https://api.upbit.com/v1/ticker?markets=KRW-BTC,KRW-ETH,KRW-DOGE",{
        method:"GET", headers:{accept:"application/json"} });
        const json =await res.json();
        console.log(json);
        SetData(json);

        const btc = await fetch("https://api.upbit.com/v1/candles/days?market=KRW-BTC&count=200");
        const btc_json= await btc.json();
        const eth = await fetch("https://api.upbit.com/v1/candles/days?market=KRW-ETH&count=200");
        const eth_json= await eth.json();
        const doge = await fetch("https://api.upbit.com/v1/candles/days?market=KRW-DOGE&count=200");
        const doge_json= await doge.json();
        const json_filter = [...btc_json, ...eth_json, ...doge_json].map((item) => {
          return {
            timestamp: new Date(item.candle_date_time_utc).getTime(),
            value: item.trade_price,
            open: item.opening_price,
            close: item.trade_price,
            high: item.high_price,
            low: item.low_price,
          };
        });
        setCharts(json_filter);
      }catch (err) {
        console.errror(err);
      }
    },0);
    return ()=> {
      clearTimeout(timer);
  };
  },[]);
  
  const renderItem=({item,index}) => {
    //name이 array 변수로 나옴.
    const name = market.filter(items2=>items2.market === item.market)[0];
    return(
      <View style={{flexDirection: "row", width:300,marginHorizontal:wp(14),height:hp(10), borderBottomWidth:1, 
      borderColor:"white", justifyContent:"center"}}>

        <View style={{width:100,justifyContent:"center", alignItems:"center"}}>
          {
            item.market.split("-")[1] === "BTC" ? (
            <Image source = {require("./assets/btc.png")} style={{width:60, height:60}}/>
             ): item.market.split("-")[1] === "ETH" ? (
            <Image source = {require("./assets/eth.png")} style={{width:45, height:45}}/>
             ) : item.market.split("-")[1] === "DOGE" ? (
            <Image source = {require("./assets/doge.png")} style={{width:45, height:45}}/>
             ) : null 
          }
        </View>

        <View style={{width: 80, justifyContent:"center"}}>
          <Text style={{fontSize: 12, fontWeight:"bold",color: "white"}}>{name.english_name}</Text>
          <Text style={{fontSize: 20, fontWeight:"bold",color: "white"}}>{item.market.split("-")[1]}</Text>
        </View>

        <View style={{width: 120, justifyContent:"center", alignItems:"flex-end"}}>
          <Text style={{ fontSize: 18, color: "white" }}>₩ {item.trade_price}</Text>
          {
            item.signed_change_rate >0 ? (
            <Text style={{fontSize: 16, color:  "red"}}>+{(item.signed_change_rate * 
              100).toPrecision(2)} %</Text>) :( 
              <Text style={{fontSize: 16, color:  "blue"}}>{(item.signed_change_rate * 
                100).toPrecision(2)} %</Text>
                
              )
          }
          
          </View>
      </View>
    )
  }
  
  

  if(isReady){
    return(
      <View style ={styles.container2}>
        <View style ={{flexDirection:"row", paddingHorizontal:wp(5)}}>
        <Foundation style={{marginRight:wp(73)}} name="list" size={50} color="white" />
        <Image style={{width:50, height:50, borderRadius:30}}source ={require("./assets/profile.jpg")}/>
        </View>
        <Text style ={{marginTop:50,textAlign:"center",fontSize:50,fontWeight:"bold", color:"white"}}>$12,345</Text>
        <Text style ={{marginTop:15,textAlign:"center",fontSize:29, color:"white"}}>total balance</Text>
        <PagerView style={{marginTop:20, width:500, height:300 } } initialPage={0}>
          <View 
          style={{backgroundColor:"white",
          justifyContent:"center",
          alignItems:"center",
          borderRadius:10,
          width:300,
          height:200,
          marginHorizontal: wp(14),
          }} key="1">
         
         
           
          </View>
          
          <View 
          style={{backgroundColor:"white",
          justifyContent:"center",
          alignItems:"center",
          borderRadius:10,
          width:300,
          height:200,
          marginHorizontal: wp(14),
          }} key="2">
          
          </View>

          <View 
          style={{backgroundColor:"white",
          justifyContent:"center",
          alignItems:"center",
          borderRadius:10,
          width:300,
          height:200,
          marginHorizontal: wp(14),
          }} key="3">
           
          </View>
        </PagerView>

        <View style={{marginTop:-60}}>
          <Text style={{marginHorizontal: wp(14),color:"white",fontSize:20,marginBottom:3}}>current price</Text>
          <FlatList
          data={data}
          keyExtractor={(item,index) => index.toString()} renderItem={renderItem}/>
        </View>
      </View>
      );
  }

  return(
    <View style ={styles.container}>
      <Image style={styles.titleImg}source ={require("./assets/crypto.png")}/>
      <Text style={styles.title}>Brand new way to invest</Text>
      <StatusBar style="auto"/>
      <Pressable style={styles.startbutton}
        onPress={()=>setReady(true)}>
        <Text style={{fontSize:25,fontWeight:"bold"}}>시작하기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create ({
  container : {
    flex:1,
    backgroundColor : "#000033",
    paddingTop:hp(23),
  },
  title : {
   color: "white",
   fontSize : hp(5),
   fontWeight: "bold",
   textAlign: "center",
   width:wp(70),
   alignSelf:"center",
  },
  titleImg : {
    width:250,
    height:250, 
    alignSelf:"center",
  },
  startbutton : {
    backgroundColor : "white",
    color: "black",
    width: 200,
    height:50,
    marginTop: 100,
    alignSelf:"center",
    alignItems:"center",
    justifyContent: "center",
    borderRadius: 15,
  },


  container2 : {
    flex:1,
    backgroundColor : "#000033",
    paddingTop:hp(8),
  },
});