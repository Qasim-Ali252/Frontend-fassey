import { useMutation } from "@tanstack/react-query";
import { uploadImage } from "../api/adminApi";

export const useImageUpload = () => {
  return useMutation({
    mutationFn: uploadImage,
  });
};