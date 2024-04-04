import { Input } from "@/components/input";
import { Alert, Image, StatusBar, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { Button } from "@/components/button";
import { Link, Redirect } from "expo-router";
import { useState } from "react";
import { api } from "@/server/api";
import { BadgeStore, useBadgeStore } from "@/store/badge-store";

export default function Home() {
  const [code, setCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const badgeStore = useBadgeStore();
  console.log(badgeStore.data);

  async function handleAccessCredential() {
    try {
      if (code.trim() == "")
        return Alert.alert("Ingresso", "Informe o código do ingresso 🎫");

      setIsLoading(true);
      const { data } = await api.get(`/attendees/${code}/badge`);
      badgeStore.save(data.badge);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Ingresso", "Ingresso não encontrado 😅");
    }
  }

  if (badgeStore.data?.checkInURL) return <Redirect href="/ticket" />;

  return (
    <View className="flex-1 align-middle items-center justify-center bg-green-500 p-8">
      <StatusBar barStyle="light-content" />

      <Image
        source={require("@/assets/logo.png")}
        className="h-16"
        resizeMode="contain"
      />

      <View className="w-full mt-12 gap-3">
        <Input>
          <MaterialCommunityIcons
            size={20}
            name="ticket-confirmation-outline"
            color={colors.green[200]}
          />
          <Input.Field
            placeholder="Código do ingresso"
            onChangeText={setCode}
          />
        </Input>

        <Button
          title="Acessar credencial"
          onPress={handleAccessCredential}
          isLoading={isLoading}
        />
      </View>

      <Link href="/register" className="text-gray-100 text-base font-bold mt-8">
        Ainda não possui ingresso?
      </Link>
    </View>
  );
}
