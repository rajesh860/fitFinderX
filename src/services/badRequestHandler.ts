import { fetchBaseQuery, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { navigate } from "../component/RootNavigation/RootNavigation";

interface WebApi {
  getState: () => any;
  dispatch: (action: any) => void;
}

export const dynamicBaseQuery = async (
  args: string | FetchArgs,
  api: WebApi,
  extraOptions: any
) => {
  const token = await AsyncStorage.getItem("token");
  const rawBaseQuery = fetchBaseQuery({
    // baseUrl: 'http://10.252.84.250:3001',
    baseUrl: 'http://13.60.166.240/api',
    // baseUrl: 'https://464901a93f7a.ngrok-free.app',
    prepareHeaders: (headers) => {
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  const result = await rawBaseQuery(args, api, extraOptions);

  if (result?.error) {
    const error = result.error as FetchBaseQueryError;
    const responseMessage = (error.data as any)?.message || "An error occurred";
    const status = error.status;

    if (status === 401 || status === 403) {
      // await AsyncStorage.clear();
      // In React Native, use navigation or other method instead of window.location
      // Example: Navigate to login screen
      Toast.show({
        type: 'error',
        text1: 'Unauthorized',
        text2: 'Please login again.',
      });

      // ✅ Navigate to AuthScreen
      navigate('AuthScreen');
      // You can dispatch navigation action here if needed
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: responseMessage,
      });
    }
  }

  return result;
};
