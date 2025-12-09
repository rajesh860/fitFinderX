import { useEffect } from "react";
import Toast from "react-native-toast-message";

export const useApiFeedback = (isLoading: boolean, data?: any, error?: any) => {
    useEffect(() => {
        if (data?.success) {
            Toast.show({
                type: "success",
                text1: data?.message || "Updated successfully!",
                position: "top",
            });
        } else if (data && !data?.success) {
            Toast.show({
                type: "error",
                text1: data?.message || "Failed to update",
                position: "top",
            });
        }
    }, [data]);

    useEffect(() => {
        if (error) {
            Toast.show({
                type: "error",
                text1: error?.data?.message || "Something went wrong",
                position: "top",
            });
        }
    }, [error]);

    return { isLoading };
};
