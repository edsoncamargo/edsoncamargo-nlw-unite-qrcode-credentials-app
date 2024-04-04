import { Button } from "@/components/button";
import { Credential } from "@/components/credential";
import { Header } from "@/components/header";
import { colors } from "@/styles/colors";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Share,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { QRCode } from "@/components/qrcode";
import { useBadgeStore } from "@/store/badge-store";
import { Redirect } from "expo-router";
import { MotiView } from "moti";

export default function Ticket() {
  const [expandQRCode, setExpandQRCode] = useState(false);

  const badgeStore = useBadgeStore();

  async function handleSelectImage() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
      });

      const assets = result.assets ? result.assets[0] : null;

      if (assets) {
        badgeStore.updateAvatar(assets.uri);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Perfil", "Não foi possível selecionar a imagem.");
    }
  }

  function handleExpandQRCode() {
    setExpandQRCode(!expandQRCode);
  }

  function handleRemoveBadge() {
    badgeStore.remove();
  }

  async function handleShare() {
    try {
      if (badgeStore.data?.checkInURL) {
        await Share.share({
          message: badgeStore.data.checkInURL,
        });
      }
    } catch (error) {
      Alert.alert("Compartilhar", "Não foi possível compartilhar ⚠️");
    }
  }

  if (
    badgeStore.data?.checkInURL == undefined ||
    badgeStore.data?.checkInURL == null ||
    badgeStore.data?.checkInURL == ""
  )
    return <Redirect href="/" />;

  return (
    <View className="flex-1 bg-green-500">
      <StatusBar barStyle="light-content" />

      <Header title="Minha Credencial" />

      <ScrollView
        className="-mt-28"
        contentContainerClassName="px-8 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Credential
            data={badgeStore.data}
            onChangeAvatar={handleSelectImage}
            onExpandQRCode={handleExpandQRCode}
          />
          <MotiView
            from={{ translateY: -5 }}
            animate={{ translateY: 10 }}
            transition={{
              loop: true,
              type: "timing",
              duration: 700,
            }}
          >
            <FontAwesome
              name="angle-double-down"
              size={24}
              color={colors.gray[300]}
              className="self-center my-6"
            />
          </MotiView>
        </View>

        <View>
          <Text
            className="text-white font-bold text-2xl mt-4"
            onPress={handleShare}
          >
            Compartilhar credencial 🎫
          </Text>

          <Text className="text-white font-regular text-base mt-1 mb-6">
            Mostre ao mundo que você vai participar do{" "}
            {badgeStore.data.eventTitle}.
          </Text>
        </View>

        <Button title="Compartilhar"></Button>

        <TouchableOpacity
          activeOpacity={0.7}
          className="mt-10"
          onPress={() => handleRemoveBadge()}
        >
          <Text className="text-base text-white font-bold text-center">
            Remover Ingresso
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={expandQRCode} statusBarTranslucent animationType="fade">
        <View className="flex-1 bg-green-500 items-center justify-center">
          <QRCode value="Teste" size={300} />

          <TouchableOpacity activeOpacity={0.7} onPress={handleExpandQRCode}>
            <Text className="font-body text-orange-500 text-sm mt-10">
              Fechar QRCode
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
