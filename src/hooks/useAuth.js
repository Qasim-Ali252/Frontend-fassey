import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { loginUser, signupUser } from "../api/auth";

export const useLogin = (setErrorMsg) => { 
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("access_token", JSON.stringify(data));
      navigate("/dashboard");
    },
    onError: (error) => {
      setErrorMsg(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Login failed"
      );
    },
  });
};

export const useSignup = (setErrorMsg, setSuccessMsg) => { 
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signupUser,
    onSuccess: () => {
      setSuccessMsg("Signup successful! Please login.");
      setErrorMsg("");
      navigate("/login");
    },
    onError: (error) => {
      setErrorMsg(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Signup failed"
      );
      setSuccessMsg(""); 
    },
  });
};
