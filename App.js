import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Platform, Alert, ToastAndroid } from 'react-native';
import { RadioButton } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { encode } from 'base-64';
import ShowLoader from './components/loader';
import { COLORS } from './utils/theme';
import { getData, setData } from './utils/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ZipCodeElement from './components/zip-element';

const { width, height } = Dimensions.get("window")
const App = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState('');
  const [zip, setZip] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [message, setMessage] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showData, setShowData] = useState(false);
  const [gender, setChecked] = React.useState('');
  const [open, setOpen] = useState(false);
  const [colorValue, setColorValue] = useState(null);
  const [suggestedZIPs, setSuggestedZIPs] = useState([]);
  const [count, setCount] = useState(0);
  const [formData, setFormData] = useState("")

  const [colorItems, setColorItems] = useState([
    { label: "aliceblue", value: COLORS.aliceblue },
    { label: 'aquamarine', value: COLORS.aquamarine },
    { label: 'beige', value: COLORS.beige },

    { label: 'brown', value: COLORS.brown },
    { label: 'blanchedalmond', value: COLORS.blanchedalmond },
  ]);
  const [submitEnabled, setSubmitEnabled] = useState(false);

  const handleNameChange = (text) => {
    // Only allow alphabet caps, space, and apostrophe
    const regex = /^[A-Z' ]*$/;
    if (regex.test(text)) {
      setName(text);
    }
  };

  const handleEmailChange = (text) => {
    // Email validation
    setEmail(text);

  };
  const handleMobileChange = (text) => {
    // Remove any non-digit characters except backspace
    const cleanedText = text.replace(/[^0-9]/g, '');

    // Truncate the text to a maximum of 10 digits
    const truncatedText = cleanedText.slice(0, 10);

    // Mobile validation and auto-formatting
    const regex = /^(\d{0,4})(\d{0,6})$/;
    if (regex.test(truncatedText)) {
      const formattedMobile = truncatedText.replace(/(\d{4})(\d{0,6})/, '$1-$2');
      setMobile(formattedMobile);
    } else {
      setMobile(truncatedText);
    }
  };

  const handleDOBChange = (text) => {
    // Remove any non-digit characters
    const cleanedText = text.replace(/\D/g, '');

    // Format the cleaned text as DD-MM-YYYY
    let formattedText = '';
    if (cleanedText.length <= 2) {
      formattedText = cleanedText;
    } else if (cleanedText.length <= 4) {
      formattedText = cleanedText.slice(0, 2) + '-' + cleanedText.slice(2);
    } else if (cleanedText.length <= 6) {
      formattedText = cleanedText.slice(0, 2) + '-' + cleanedText.slice(2, 4) + '-' + cleanedText.slice(4);
    } else {
      formattedText = cleanedText.slice(0, 2) + '-' + cleanedText.slice(2, 4) + '-' + cleanedText.slice(4, 8);
    }

    setDob(formattedText);
  };



  const handleZIPChange = (text) => {
    setZip(text);
    const zipData = {
      "zipcode_data": [
        {
          "zipcode": "110011",
          "city": "Central Delhi",
          "state": "ND"
        },
        {
          "zipcode": "400011",
          "city": "Mumbai",
          "state": "MH"
        },
        {
          "zipcode": "600001",
          "city": "Chennai",
          "state": "TN"
        },
        {
          "zipcode": "700001",
          "city": "Kolkata",
          "state": "WB"
        }
      ]
    };
    if (text.length >= 3) {
      // Filter suggested ZIP codes based on user input
      const filteredZIPs = zipData?.zipcode_data.filter(
        (item) => item?.zipcode.indexOf(text) === 0
      );
      setSuggestedZIPs(filteredZIPs);
    } else {
      setSuggestedZIPs([]);
    }
    // Fetch city and state based on ZIP code
    const selectedZIP = zipData.zipcode_data.find((item) => item.zipcode === text);
    if (selectedZIP) {
      setCity(selectedZIP.city);
      setState(selectedZIP.state);
    } else {
      setCity('');
      setState('');
    }
  };


  const handleSubmit = async () => {
    // Perform form validation
    if (name && email && mobile && dob && gender && zip && city && state && colorValue) {
      const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!regex.test(email)) {
        if (Platform.OS === "android") {
          ToastAndroid.showWithGravity("Invalid Email", ToastAndroid.SHORT, ToastAndroid.BOTTOM)
        } else {
          Alert.alert("Invalid Email")
        }
      } else {
        setSubmitted(true);
        setMessage(true);
        // Simulating submission and storing form data
        setTimeout(async () => {
          const formData = {
            name,
            email,
            mobile,
            dob,
            gender,
            zip,
            city,
            state,
            colorValue
          };
          await AsyncStorage.setItem('data', JSON.stringify(formData))
          const encodedData = encode(JSON.stringify(formData));
          alert(`Form data: ${encodedData}`);
          setShowData(true)
          setMessage(false);
        }, 2000);
        setShowData(true)
      }
    }
  };

  const handleShowData = async () => {
    const data = await AsyncStorage.getItem('data')
    console.log(data.toString(),"====")
    setFormData(data.toString())
    setCount(count + 1)
  };

  console.log(formData, "====")

  const handleReset = () => {
    setName('');
    setEmail('');
    setMobile('');
    setDob('');
    setChecked('');
    setZip('');
    setChecked('')
    setCity('');
    setState('');
    setMessage('');
    setColorValue('')
    setSubmitted(false);
    setFormData('')
    setSubmitEnabled(false);
    setShowData(false);
  };


  useEffect(() => {
    // Check if all form fields are filled
    if (name && email && mobile && dob && gender && zip && city && state && colorValue) {
      const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!regex.test(email)) {
        setSubmitEnabled(false);
      } else {
        setSubmitEnabled(true)
      }
    }

  }, [name, email, mobile, dob, gender, zip, city, state, colorValue]);


  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>

      {message && <ShowLoader />}

      <Text style={[styles.textStyle, { color: colorValue }]}>Name:</Text>
      <TextInput
        style={styles.textInputField}
        value={name}
        disabled={submitted}
        onChangeText={handleNameChange}
        placeholder="Enter your name"
        autoCapitalize="characters"
      />

      <Text style={{ color: colorValue }}>Email:</Text>
      <TextInput
        style={styles.textInputField}
        value={email}
        autoCapitalize='none'
        onChangeText={handleEmailChange}
        placeholder="Enter your email"
        keyboardType="email-address"
      />

      <Text style={{ color: colorValue }} >Mobile:</Text>
      <TextInput
        value={mobile}
        style={styles.textInputField}
        onChangeText={handleMobileChange}
        placeholder="Enter your mobile"
        keyboardType="numeric"
      />

      <Text style={{ color: colorValue }}>DOB:</Text>
      <TextInput
        style={styles.textInputField}
        value={dob}
        onChangeText={handleDOBChange}
        placeholder="Enter your DOB (DD-MM-YYYY)"
      />

      <Text style={{ color: colorValue }}>Gender:</Text>
      <View style={styles.radioButtonsContainer}>
        <View style={styles.radioButtonWrapper}>
          <Text style={{ color: colorValue }}>
            Male:
          </Text>
          <RadioButton
            value="first"
            status={gender === 'male' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('male')}
          />
        </View>
        <View style={styles.radioButtonWrapper}>
          <Text style={{ color: colorValue }}>
            Female:
          </Text>
          <RadioButton
            value="second"
            status={gender === 'female' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('female')}
          />
        </View>
      </View>

      <Text style={{ color: colorValue }}>ZIP:</Text>
      <TextInput
        value={zip}
        style={styles.textInputField}
        onChangeText={handleZIPChange}
        placeholder="Enter ZIP code"
        keyboardType="numeric"
      />
      {suggestedZIPs?.length > 0 && (
        <View>
          {suggestedZIPs?.map((item, index) => (
            <ZipCodeElement index={index} item={item} setCity={setCity} setSuggestedZIPs={setSuggestedZIPs} setState={setState} setZip={setZip} />
          ))}
        </View>
      )}

      <Text style={{ color: colorValue }}>City:</Text>
      <TextInput placeholder="City" style={styles.textInputField} value={city} editable={false} />

      <Text style={{ color: colorValue }}>State:</Text>
      <TextInput placeholder="State" style={styles.textInputField} value={state} editable={false} />

      <Text style={{ color: colorValue }}>Color:</Text>
      <DropDownPicker
        open={open}
        value={colorValue}
        items={colorItems}
        setOpen={setOpen}
        setValue={setColorValue}
        setItems={setColorItems}
      />

      <Text style={{ color: colorValue }}>Multiline Text:</Text>
      <TextInput
        style={styles.textInputField}
        multiline
        value={formData+count}
        editable={false}
      />

      <Button
        style={styles.buttonStyle}
        title="Submit"
        onPress={handleSubmit}
        disabled={!submitEnabled || submitted}
      />
      <Button title="Show Data" onPress={handleShowData} disabled={!showData} />
      <Button title="Reset" onPress={handleReset} disabled={!submitted} />
    </ScrollView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    width: width - 20,
    height: height,
    marginStart: 10, marginEnd: 10
  },
  textStyle: {
    marginTop: 10
  },
  textInputField: {
    borderRadius: 10,
    marginTop: 10, marginBottom: 10,
    borderWidth: 0.9,
    borderColor: 'grey'
  },
  buttonStyle: {
    marginBottom: 10,
    borderRadius: 10, backgroundColor: 'red',

  },
  radioButtonWrapper: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center'
  }
})