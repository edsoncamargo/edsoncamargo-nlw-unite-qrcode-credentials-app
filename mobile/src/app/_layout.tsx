import "@/styles/global.css";

import { Slot } from "expo-router";

import { Loading } from "@/components/loading";

import {
  useFonts,
  RobotoMono_700Bold,
  RobotoMono_500Medium,
  RobotoMono_400Regular,
} from "@expo-google-fonts/roboto-mono";

export default function Layout() {
  const [fontsLoaded] = useFonts({
    RobotoMono_700Bold,
    RobotoMono_500Medium,
    RobotoMono_400Regular,
  });

  if (fontsLoaded == false) return <Loading />;

  return <Slot />;
}
