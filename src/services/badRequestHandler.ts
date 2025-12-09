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
  try {
    // ✅ Get token from Redux first
    const reduxState = api.getState();
    const tokenFromRedux = reduxState?.auth?.token || null;
    
    // ✅ Fallback to AsyncStorage
    const token = tokenFromRedux || (await AsyncStorage.getItem("token"));
    
    const rawBaseQuery = fetchBaseQuery({
      baseUrl: 'https://fitmuscle.in/api',
      // baseUrl: "https://d4b5c33208f4.ngrok-free.app",
      prepareHeaders: (headers) => {
        if (token) headers.set("Authorization", `Bearer ${token}`);
        return headers;
      },
    });

    const result = await rawBaseQuery(args, api, extraOptions);

    // 🧩 Handle API errors
    if (result?.error) {
      const error = result.error as FetchBaseQueryError;
      const status = error.status;

      // ✅ Network error (no internet)
      if (status === "FETCH_ERROR") {
        Toast.show({
          type: "error",
          text1: "No Internet Connection",
          text2: "Please check your network and try again.",
        });
        return result;
      }

      // ✅ Unauthorized
      if (status === 401 || status === 403) {
        Toast.show({
          type: "error",
          text1: "Session expired",
          text2: "Please login again.",
        });
        navigate("AuthScreen");
      } else {
        const responseMessage = (error.data as any)?.message || "An error occurred";
        Toast.show({
          type: "error",
          text1: "Error",
          text2: responseMessage,
        });
      }
    }

    return result;
  } catch (err) {
    console.log("⚠️ dynamicBaseQuery unexpected error:", err);
    Toast.show({
      type: "error",
      text1: "Network Error",
      text2: "Unable to connect to the server.",
    });
    return { error: err };
  }
};
