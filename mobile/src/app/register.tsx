import { useState } from "react";

import { Alert, Image, StatusBar, View } from "react-native";

import { Link, router } from "expo-router";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";

import { Input } from "@/components/input";
import { Button } from "@/components/button";

import { api } from "@/server/api";
import { colors } from "@/styles/colors";
import axios from "axios";
import { BadgeStore, useBadgeStore } from "@/store/badge-store";

const EVENT_ID = "9e9bd979-9d10-4915-b339-3786b1634f33";

export default function Register() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const badgeStore = useBadgeStore();

  async function handleRegister() {
    try {
      if (name.trim() == "") return Alert.alert("Nome", "Informe seu nome 🧔🏽‍♂️");
      if (email.trim() == "")
        return Alert.alert("E-mail", "Informe seu e-mail 📩");

      setIsLoading(true);
      const result = await api.post(`/events/${EVENT_ID}/attendees`, {
        name,
        email,
      });

      if (result.data.attendeeId) {
        const badgeResponse = await api.get(
          `/attendees/${result.data.attendeeId}/badge`
        );

        console.log(badgeResponse);

        badgeStore.save(badgeResponse.data.badge);

        Alert.alert("Inscrição", "Inscrição realizada com sucesso ✅", [
          { text: "Continuar", onPress: () => router.push("/ticket") },
        ]);
      }
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        setIsLoading(false);
        const errorMessage = String(error.response?.data.message);

        if (errorMessage.includes("already registered")) {
          return Alert.alert("Inscrição", "Este e-mail já está cadastrado ⚠️");
        } else if (errorMessage.includes("maximum number")) {
          return Alert.alert(
            "Inscrição",
            "O máximo de clientes já foi excedido para este evento ⚠️"
          );
        }
      }

      Alert.alert("Inscrição", "Não foi possível fazer a inscrição ⚠️");
    } finally {
    }
  }

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
          <FontAwesome6
            size={20}
            name="user-circle"
            color={colors.green[200]}
          />
          <Input.Field placeholder="Nome completo" onChangeText={setName} />
        </Input>

        <Input>
          <MaterialIcons
            size={20}
            name="alternate-email"
            color={colors.green[200]}
          />
          <Input.Field
            placeholder="E-mail"
            keyboardType="email-address"
            onChangeText={setEmail}
          />
        </Input>

        <Button
          title="Acessar credencial"
          onPress={handleRegister}
          isLoading={isLoading}
        />
      </View>

      <Link href="/" className="text-gray-100 text-base font-bold mt-8">
        Já possui ingresso?
      </Link>
    </View>
  );
}
