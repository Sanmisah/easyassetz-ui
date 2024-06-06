import React, { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";

import { Button } from "@com/ui/button";
import { Input } from "@com/ui/input";
import { Label } from "@com/ui/label";
import Background from "../image/7.png";
import Logo from "@/components/image/Logo.png";
import Confirmagedialog from "./Confirmagedialog";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const phoneRegex = new RegExp(
  /^\+?(\d{1,3})?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/
);

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z
  .object({
    name: z.string().min(1, "Full Legal name is required"),
    mobile: z
      .string()
      .min(10, "Invalid mobile number")
      .max(10, "Invalid mobile number"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    password_confirmation: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [alertDialog, setAlertDialog] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});

  const queryClient = useQueryClient();

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const validateLogin = () => {
    const result = loginSchema.safeParse({
      email: formData.email,
      password: formData.password,
    });
    if (!result.success) {
      const fieldErrors = result.error.format();
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const validateRegister = () => {
    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.format();
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const Loginmutation = useMutation({
    mutationFn: async ({ email, password }) => {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Logging in user:", data);
      navigate("/personal");
    },
    onError: (error) => {
      alert("Login failed: " + error.message);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      if (validateLogin()) {
        Loginmutation.mutate({
          email: formData.email,
          password: formData.password,
        });

        // const query = useQuery({ queryKey: ['user'], queryFn: Loginfun });

        // Call login API
        // const response = await axios.post("http://127.0.0.1:8000/api/login", {
        //   email: formData.email,
        //   password: formData.password,
        // });
        // console.log("Logging in user:", response.data);
        // if (response.status === 200) {
        //   navigate("/personal");
        // } else {
        //   alert("Login failed: " + response.data.message);
        // }
      }
    } else {
      if (validateRegister()) {
        setAlertDialog(true);
      }
    }
  };
  const Registermutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post("http://127.0.0.1:8000/api/register", {
        ...data,
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Registering user:", data);
      navigate("/personal");
    },
    onError: (error) => {
      console.error("Error registering user:", error);
      alert("Failed to register user.");
    },
  });

  const handleRegisterConfirm = async () => {
    setAlertDialog(false);
    try {
      Registermutation.mutate(...formData);
      //   const response = await axios.post("http://127.0.0.1:8000/api/register", {
      //     ...formData,
      //   });
      //   console.log("Registering user:", response.data);
      //   if (response.status === 201) {
      //     navigate("/personal");
      //   } else {
      //     alert("Registration failed: " + response.data.message);
      //   }
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Failed to register user.");
    }
  };

  const getFieldError = (field) => errors?.[field]?._errors?.[0];

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="hidden bg-muted lg:block max-h-[930px] item-center object-contain">
        <img
          src={Background}
          alt="Image"
          className=" h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          {isLogin ? (
            <>
              <img className="w-[300px]" src={Logo} alt="" />
              <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Login</h1>
                <p className="text-balance text-muted-foreground">
                  Enter your email below to login to your account
                </p>
              </div>
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={getFieldError("email") ? "border-red-500" : ""}
                  />
                  {getFieldError("email") && (
                    <p className="text-red-500">{getFieldError("email")}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="ml-auto inline-block text-sm underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={
                      getFieldError("password") ? "border-red-500" : ""
                    }
                  />
                  {getFieldError("password") && (
                    <p className="text-red-500">{getFieldError("password")}</p>
                  )}
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <button onClick={toggleAuthMode} className="underline">
                  Sign up
                </button>
              </div>
              <div className="mt-4 text-center text-sm">
                <p className="text-sm text-gray-500">
                  By signing in, you agree to our{" "}
                  <a className="underline text-blue-500" href="#">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a className="underline text-blue-500" href="#">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </>
          ) : (
            <>
              <img className="w-[300px]" src={Logo} alt="" />

              {alertDialog && (
                <Confirmagedialog
                  alertDialog={alertDialog}
                  setAlertDialog={setAlertDialog}
                  onConfirm={handleRegisterConfirm}
                  onCancel={() => setAlertDialog(false)}
                />
              )}
              <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Register</h1>
                <p className="text-balance text-muted-foreground">
                  Fill in the details below to create a new account
                </p>
              </div>
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Legal Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="First Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={getFieldError("name") ? "border-red-500" : ""}
                  />
                  {getFieldError("name") && (
                    <p className="text-red-500">{getFieldError("name")}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    type="text"
                    placeholder="Mobile Number"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className={getFieldError("mobile") ? "border-red-500" : ""}
                  />
                  {getFieldError("mobile") && (
                    <p className="text-red-500">{getFieldError("mobile")}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={getFieldError("email") ? "border-red-500" : ""}
                  />
                  {getFieldError("email") && (
                    <p className="text-red-500">{getFieldError("email")}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={
                      getFieldError("password") ? "border-red-500" : ""
                    }
                  />
                  {getFieldError("password") && (
                    <p className="text-red-500">{getFieldError("password")}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password_confirmation">
                    Confirm Password
                  </Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    value={formData.password_confirmation}
                    onChange={handleInputChange}
                    className={
                      getFieldError("password_confirmation")
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {getFieldError("password_confirmation") && (
                    <p className="text-red-500">
                      {getFieldError("password_confirmation")}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full">
                  Register
                </Button>
              </form>

              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <button onClick={toggleAuthMode} className="underline">
                  Login
                </button>
              </div>
              <div className="mt-4 text-center text-sm">
                <p className="text-sm text-gray-500">
                  By signing in, you agree to our{" "}
                  <a className="underline text-blue-500" href="#">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a className="underline text-blue-500" href="#">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
