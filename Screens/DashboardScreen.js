import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DashboardScreen = ({navigation}) => {

  const [InfoEmpresasa, setEmpresas] = useState({});
  const [userId, setUserId] = useState('');
  const [userType, setuserType] = useState('');

  const screenWidth = Dimensions.get("window").width;
  //const cardWidth = (screenWidth - 60) / 4; // Divide el ancho en 4 columnas

  useEffect(() => {
    const loadUserId = async () => {
        try {
            const storedUserId = await AsyncStorage.getItem("userId");
            const storedUserType = await AsyncStorage.getItem("userType");//Esto es necesario?
            //const storedUserType = "admin"
            if (storedUserId) {
              setUserId(storedUserId);
              //console.log("userid:",storedUserId)
            }
            if (storedUserType == "admin") {
              setuserType(storedUserType);
              //console.log("usertype: ",storedUserType)
          }
        } catch (error) {
            console.error("Error obteniendo userId", error);
        }
    };

    loadUserId();
    const intervalo = setInterval(loadUserId, 30000);

    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {

    if (userId && userType == "admin" ) {
      const fetchInfoEmpresasa = async () => {
        try {
          const response = await fetch(`http://bc0c84cskocsss44w8ggwgog.31.170.165.191.sslip.io/empresasactivadas`);
          const data = await response.json();
          //console.log("D Empresas activas", data);
          //console.log("D ",data[0])
          
          if (data && data[0] && data[0][0]) {
            setEmpresas(data[0]);
          } else {
            console.error("La estructura de la respuesta no es la esperada.");
          }
        } catch (error) {
          console.error("Error al obtener la información ", error);
        }
      };
      fetchInfoEmpresasa();
      const intervalo = setInterval(fetchInfoEmpresasa, 5000);
      return () => clearInterval(intervalo);
    }
  }, [userId]);

  const cardWidth = Dimensions.get("window").width / 5 - 14;

  const handleDashboard = () => {
    navigation.navigate("Dashboard")
  };

  const handleEmpresas = () => {
  navigation.navigate("Empresas")
  };

  const handleSuscripciones = () => {
    navigation.navigate("Suscripciones")
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userId");
      navigation.navigate("Login"); 
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <TouchableOpacity onPress={handleDashboard} style={styles.menuItem1}>
          <Text style={styles.Opciones}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleEmpresas} style={styles.menuItem}>
          <Text style={styles.Opciones}>Admisión</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSuscripciones} style={styles.menuItem}>
          <Text style={styles.Opciones}>Suscripciones</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={styles.menuItemcerrarsesion}>
          <Text style={styles.Opciones}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.mainContainer}>
        <View style={styles.header}>
          <Text style={styles.title2}>StyleDate</Text>
        </View>
        <ScrollView style={styles.mainContent}>
        <Text style={styles.title1}>Dashboard</Text>

        <FlatList
        data={InfoEmpresasa}
        keyExtractor={(item) => item.id.toString()}
        numColumns={4}
        contentContainerStyle={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          paddingLeft: 40
        }}
        renderItem={({ item }) => (
          <View style={[styles.cartas, { width: cardWidth }]}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{item.nombre}</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.text}>Correo: <Text style={styles.text1}>{item.correo}</Text></Text>
              <Text style={styles.text}>Dirección: <Text style={styles.text1}>{item.direccion}</Text></Text>
              <Text style={styles.text}>Teléfono: <Text style={styles.text1}>{item.telefono}</Text></Text>
            </View>
          </View>
        )}
      />



        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({

  sidebar: {
    width: "12%",
    backgroundColor: "#1d5141",
    padding: 20,
    alignItems: "flex-start",
    height: "100%",
  },

  
  cartas: {
    backgroundColor: "#f1f1ec",
    margin: 5,
    borderRadius: 15,
    overflow: "hidden",
    flex: 1,
  },
  
  titleContainer: {
    backgroundColor: "#266150",
    padding: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  
  cardContent: {
    flex: 1,
    padding: 10,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#b5b5b5",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  

  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fffdf9",
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuItemcerrarsesion: {
    paddingVertical: "360%",
  },
  menuItem1: {
    paddingVertical: 10,
    marginTop: "9%",
  },
  Opciones: {
    color: "white",
    fontSize: 16,
  },
  mainContainer: {
    justifyContent: "center",
    textAlign: "center",
    flex: 1,
  },
  header: {
    height: 50,
    backgroundColor: "#266150",
    justifyContent: "center",
    paddingLeft: 20,
  },
  title1: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    padding: 5,
    paddingLeft: 16,
  },
  title2: {
    color: "#4a8070",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  containercartas: {
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    paddingLeft: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    marginVertical: 5,
    paddingLeft: 10,
  },
  text1: {
    fontSize: 18,
    textAlign: "left",
    marginVertical: 5,
    fontWeight: "normal",
  },
});


export default DashboardScreen;