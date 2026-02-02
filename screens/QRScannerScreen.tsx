import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert, Dimensions } from 'react-native';
import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const qrCodeAreaSize = width * 0.7; // 70% of screen width

const QRScannerScreen = () => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(true); // Start with scanned=true to disable scanning initially
  const navigation = useNavigation();

  useEffect(() => {
    if (permission === null) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = (scanningResult: BarcodeScanningResult) => {
    setScanned(true); // Disable further scanning
    Alert.alert(
      "QR Code Scanned!",
      `Type: ${scanningResult.type}\nData: ${scanningResult.data}`,
      [
        { text: "OK", onPress: () => {
          navigation.goBack();
        }}
      ]
    );
    console.log(`Bar code with type ${scanningResult.type} and data ${scanningResult.data} has been scanned!`);
  };

  const startScan = () => {
    setScanned(false); // Enable scanning
  };

  if (!permission) {
    return <Text className="flex-1 items-center justify-center text-xl">Requesting for camera permission</Text>;
  }
  if (!permission.granted) {
    return <Text className="flex-1 items-center justify-center text-xl text-red-500">No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Full-screen camera view - always active */}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned} // Only scan when 'scanned' is false
      />

      {/* Semi-transparent overlay with a transparent hole for the scanner */}
      <View style={styles.overlay}>
        <View style={styles.unfocusedContainer} />
        <View style={styles.middleContainer}>
          <View style={styles.unfocusedContainer} />
          <View style={styles.focusedContainer} />
          <View style={styles.unfocusedContainer} />
        </View>
        <View style={styles.unfocusedContainer} />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.description}>Scan QR Code</Text>
        <Text style={styles.instructions}>Align QR code within the frame</Text>
      </View>

      <View style={styles.scanButtonContainer}>
        <Button
          title={scanned ? 'Tap to Scan' : 'Scanning...'}
          onPress={startScan}
          disabled={!scanned} // Disable button while scanning is active
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'column',
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  middleContainer: {
    flexDirection: 'row',
  },
  focusedContainer: {
    width: qrCodeAreaSize,
    height: qrCodeAreaSize,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFD700',
    borderRadius: 10,
  },
  textContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  instructions: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  scanButtonContainer: { // Renamed from scanAgainButtonContainer
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
  },
});

export default QRScannerScreen;
