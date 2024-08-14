"use client";

import { Input } from "@material-tailwind/react";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { signIn } from "next-auth/react";

import { toast } from "sonner";

import { HiOutlineUpload } from "react-icons/hi";
import { AiOutlineLoading } from "react-icons/ai";
import { MdOutlineInstallMobile } from "react-icons/md";

import OnboardBtn from "@/components/ui/buttons/OnboardBtn";

const SignupForm = ({ isAnimated, setIsAnimated }) => {
  const router = useRouter();

  const [isOtpSent, setIsOtpSent] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [profileImage, setProfileImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [otpInput, setOtpInput] = useState("");
  const [user, setUser] = useState({});

  const [timer, setTimer] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let interval;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timer]);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const image = URL.createObjectURL(file);

      setProfileImage(file);
      setSelectedImage(image);
    }
  };

  const handleNumberChange = (e) => {
    let value = e.target.value.replace(/[^\d]/g, "");

    value = value.replace(/^0+/, "");

    if (value.length <= 10) {
      setPhoneNumber(value);
    }
  };

  const handleOtpChange = (e) => {
    let value = e.target.value.replace(/[^\d]/g, "");

    if (value.length <= 6) {
      setOtpInput(value);
    }
  };

  const getOtp = (e, id, phoneNumber) => {
    const otpPromise = new Promise(async (resolve, reject) => {
      try {
        const otpResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/generate-otp/${
            id?.toString() || user._id
          }`,
          {
            method: "GET",
          }
        );

        if (!otpResponse.ok) {
          reject(`Error generating OTP.`);
        }

        const otpData = await otpResponse.json();

        const sendOtpResponse = await fetch(
          `https://api.authkey.io/request?authkey=ea048f1e37474761&mobile=${
            phoneNumber || user.phoneNumber
          }&country_code=91&sid=8732&company=GhostingTech&otp=${otpData}`
        );

        if (!sendOtpResponse.ok) {
          reject(`Error sending OTP.`);
        } else {
          setIsOtpSent(true);
          setTimer(60);

          resolve(otpData);
        }
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(otpPromise, {
      loading: "Sending OTP...",
      success: "OTP sent successfully",
      error: "Error sending OTP",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/register`;

    if (!name) {
      toast.error("Please enter your name");
      return;
    }

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    if (!phoneNumber) {
      toast.error("Please enter your phone number");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    const formDataToSend = new FormData();

    formDataToSend.append("name", name);
    formDataToSend.append("email", email);
    formDataToSend.append("password", password);
    formDataToSend.append("phoneNumber", phoneNumber);

    if (profileImage) {
      formDataToSend.append("image", profileImage);
    }

    try {
      let data;

      const getUserPromise = new Promise(async (resolve, reject) => {
        const response = await fetch(url, {
          body: formDataToSend,
          method: "POST",
        });

        if (response.ok) {
          data = await response.json();
          setUser(data);
          resolve(data);
        } else {
          const errorText = await response.json();
          reject(errorText);
        }
      });

      toast.promise(getUserPromise, {
        loading: "Creating new user...",

        success: async (data) => {
          getOtp("_", data._id.toString(), data.phoneNumber);
          return "User created successfully";
        },

        error: (error) => `${error.error}`,
      });
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const verifyOtp = async () => {
    const url = `${
      process.env.NEXT_PUBLIC_BACKEND_URL
    }/generate-otp/${user._id.toString()}`;

    const promiseFunction = () =>
      new Promise(async (resolve, reject) => {
        try {
          const response = await fetch(url, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ otp: otpInput }),
          });

          const data = await response.json();

          if (!response.ok) {
            reject(`Error: ${data}`);
          } else {
            const isSignIn = await signIn("credentials", {
              redirect: false,
              phoneNumber,
              password,
            });

            if (!isSignIn.ok) {
              reject("Something went wrong: Cannot Sign In");

              return;
            }

            router.push("/");

            resolve(data);
            toast.info("Redirecting to home...");
          }
        } catch (error) {
          reject(error);
        }
      });

    toast.promise(promiseFunction(), {
      loading: "Verifying OTP...",

      success: () => {
        setEmail("");
        setName("");
        setPassword("");
        setPhoneNumber("");

        setProfileImage(null);
        setSelectedImage(null);

        setTimer(0);
        setUser({});

        setOtpInput("");
        setIsOtpSent(false);

        setIsLoading(false);

        return "OTP verified successfully";
      },

      error: (error) => {
        setIsLoading(false);

        return `${
          error.error || error.message || error || "Something went wrong"
        }`;
      },
    });
  };

  const handleSignup = async () => {
    if (!isOtpSent) {
      toast.error("Please Get OTP on your phone number");
      return;
    }

    if (!otpInput) {
      toast.error("Please enter the OTP sent to your phone number");
      return;
    }

    setIsLoading(true);

    await verifyOtp();
  };

  return (
    <div className="lg:w-10/12 w-11/12 max-w-md">
      <div className="flex flex-col justify-center items-center w-full">
        <h1 className="text-4xl font-bold text-pink-500">Create account</h1>

        <form className="mt-8 w-full" onSubmit={handleSubmit} method="POST">
          <div className="flex flex-col items-center mb-6">
            <label
              htmlFor="register-profile"
              className="cursor-pointer flex items-center space-x-4 border rounded-md p-4 w-full"
            >
              {profileImage ? (
                <div className="relative w-12 h-12">
                  <Image
                    src={selectedImage}
                    alt="avatar"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full">
                  <svg
                    className="w-6 h-6 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}

              <div className="flex-grow pl-2">
                <p className="text-gray-500">Add Profile Image</p>
                <p className="text-sm text-gray-400">PNG or JPG</p>
              </div>

              <HiOutlineUpload className="w-6 h-6 text-gray-500 ml-auto" />
            </label>

            <input
              type="file"
              id="register-profile"
              name="regiter-profile"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <div className="space-y-10">
            <Input
              type="text"
              size="regular"
              variant="standard"
              label="Full Name"
              placeholder="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              name="register-name"
              error={!isOtpSent && name && name.length < 3}
            />

            <Input
              type="email"
              size="regular"
              variant="standard"
              label="Email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="register-email"
              error={
                (!isOtpSent && email && !email.includes("@")) ||
                !email.includes(".")
              }
            />

            <Input
              type="password"
              size="regular"
              variant="standard"
              label="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="register-password"
              error={!isOtpSent && password && password.length < 8}
            />

            <div className="flex items-center gap-2">
              <Input
                type="tel"
                size="regular"
                variant="standard"
                label="Phone Number"
                required
                value={phoneNumber}
                onChange={handleNumberChange}
                name="register-phone"
                error={!isOtpSent && phoneNumber && phoneNumber.length < 10}
              />

              {isOtpSent ? (
                <Input
                  type="number"
                  size="regular"
                  variant="standard"
                  label="OTP"
                  placeholder="OTP"
                  required
                  name="register-otp"
                  value={otpInput}
                  onChange={handleOtpChange}
                  error={!isOtpSent && otpInput && otpInput.length < 6}
                />
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg whitespace-nowrap bg-gradient-to-r from-teal-500 to-green-500 hover:scale-105 transition-all text-white cursor-pointer active:scale-100 font-semibold flex items-center gap-1 min-w-28"
                >
                  {isOtpSent ? (
                    <AiOutlineLoading
                      className=" animate-spin mx-auto"
                      size={24}
                    />
                  ) : (
                    <>
                      Get OTP <MdOutlineInstallMobile />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {
            <div className="flex mt-2 justify-end text-sm gap-1">
              <p>Didn&apos;t received OTP?</p>
              {timer === 0 ? (
                <button
                  type="button"
                  className="cursor-pointer underline text-red-500 disabled:cursor-default disabled:opacity-50"
                  onClick={() => getOtp("_", user._id, user.phoneNumber)}
                  disabled={timer === 0 && !isOtpSent}
                >
                  Resend OTP
                </button>
              ) : (
                <p>
                  Resend in
                  <span className="text-red-500">
                    {" "}
                    {String(timer).padStart(2, "0")}s
                  </span>
                </p>
              )}
            </div>
          }

          <OnboardBtn
            type="button"
            label="Sign Up"
            isLoading={isLoading}
            onClick={handleSignup}
          />
        </form>
      </div>

      <div className="flex gap-1 items-center mt-4 text-sm justify-center">
        <div>Already have an Account?</div>

        <button
          className=" text-blue-600 hover:underline focus:outline-none font-medium underline hover:scale-105 transition-transform"
          onClick={(e) => {
            setIsAnimated(!isAnimated);
          }}
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default SignupForm;
