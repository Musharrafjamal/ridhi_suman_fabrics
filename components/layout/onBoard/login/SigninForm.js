"use client";

import { Input } from "@material-tailwind/react";

import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import OnboardBtn from "@/components/ui/buttons/OnboardBtn";

const SigninForm = ({ isAnimated, setIsAnimated }) => {
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!phoneNumber) {
      toast.error("Please enter your phone number");
      return;
    }

    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    setIsLoading(true);

    const promiseFunction = () =>
      new Promise(async (resolve, reject) => {
        try {
          const response = await signIn("credentials", {
            redirect: false,
            phoneNumber,
            password,
          });

          if (response.ok) {
            resolve(response);
          } else {
            reject(response);
          }
        } catch (error) {
          reject(error);
        }
      });

    toast.promise(promiseFunction(), {
      loading: "Logging in...",

      success: () => {
        router.push("/");
        setIsLoading(false);

        setPhoneNumber("");
        setPassword("");

        return "Logged in successfully";
      },

      error: (error) => {
        setIsLoading(false);

        return `${error.error || error || "Something went wrong"}`;
      },
    });
  };

  return (
    <div className="lg:w-3/4 w-11/12 max-w-md">
      <div className="flex flex-col justify-center items-center w-full space-y-10">
        <h1 className="text-4xl font-bold text-pink-500">Welcome back!</h1>

        <form className="mt-8 w-full" onSubmit={onSubmit} method="POST">
          <div className="space-y-8">
            <Input
              type="number"
              size="regular"
              variant="standard"
              label="Your Number"
              placeholder="Number"
              required
              name="login-number"
              value={phoneNumber}
              onChange={(e) => {
                if (e.target.value.length <= 10) setPhoneNumber(e.target.value);
              }}
              error={phoneNumber && phoneNumber.length < 10}
            />

            <Input
              type="password"
              size="regular"
              variant="standard"
              label="Your Password"
              placeholder="Password"
              required
              name="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={password && password.length < 8}
            />
          </div>

          <Link
            href={"/forgot-password"}
            className="mt-4 block text-sm text-right font-medium text-blue-600 hover:underline focus:outline-none"
          >
            Forgot your password?
          </Link>

          <OnboardBtn
            type="submit"
            label="Sign In"
            onClick={onSubmit}
            isLoading={isLoading}
          />
        </form>
      </div>

      <div className="flex gap-1 items-center mt-4 text-sm justify-center">
        <div>Don&apos;t have and account yet?</div>

        <button
          className=" text-blue-600 hover:underline focus:outline-none font-medium underline hover:scale-105 transition-transform"
          onClick={(e) => {
            setIsAnimated(!isAnimated);
          }}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default SigninForm;
