"use client";
import { useEffect, useState } from "react";
import { registerOTPSchema, type RegisterOTPInput } from "@leadpro/validators";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterStore } from "@/store/registerStore";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
export function OTPFormStep({
  onSubmit,
  onBack,
  reSendOTP,
}: {
  onSubmit: (data: RegisterOTPInput) => void | Promise<void>;
  onBack: () => void;
  reSendOTP: (data: RegisterOTPInput) => void | Promise<void>;
}) {
  const { registerData } = useRegisterStore();

  const {
    register,
    handleSubmit,
    //watch,//It lets you read form values in real-time
    formState: { errors, isSubmitting },
  } = useForm<RegisterOTPInput>({
    defaultValues: {
      name: registerData?.name ?? "",
      mobile_prefix: registerData?.mobile_prefix ?? "",
      mobile: registerData?.mobile ?? "",
      email: registerData?.email ?? "",
      otp: "",
    },
    resolver: zodResolver(registerOTPSchema),
  });
  const [timer, setTimer] = useState(30);
  const [isResending, setIsResending] = useState(false);
  // countdown
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async () => {
    try {
      setIsResending(true);

      await handleSubmit(reSendOTP)();
      setTimer(60);
    } finally {
      setIsResending(false);
    }
  };
  return (
    <>
      <h3 className="text-xl font-semibold text-orange-500 mb-6">
        Please enter the OTP sent to the email.
      </h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="text-sm text-gray-600">OTP</label>
          <Input {...register("otp")} placeholder="Enter OTP" />
          {errors.otp && (
            <p className="text-xs text-red-500">{errors.otp.message}</p>
          )}
        </div>

        <button
          className="w-full bg-orange-500 text-white py-2 rounded-md font-medium cursor-pointer"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Verifying OTP..." : "Verify OTP"}
        </button>
        {/* Timer / Resend */}
        {timer > 0 ? (
          <p className="text-center text-xs mt-4 text-gray-500">
            Resend in {timer}s
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="mt-4 text-sm text-blue-600 hover:underline disabled:text-gray-400 cursor-pointer"
            disabled={isResending}
          >
            {isResending ? "Resending..." : "Resend OTP"}
          </button>
        )}

        {/* Back */}

        <button
          type="button"
          onClick={onBack}
          className="mt-4 flex items-center gap-1 text-sm text-gray-600 hover:text-black cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </form>
    </>
  );
}
