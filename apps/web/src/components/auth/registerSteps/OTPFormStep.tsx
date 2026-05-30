"use client";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { registerOTPSchema, type RegisterOTPInput } from "@leadpro/validators";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterStore } from "@/store/registerStore";
export function OTPFormStep({
  onSubmit,
  onBack,
  reSendOTP,
}: {
  onSubmit: (data: RegisterOTPInput) => void;
  onBack: () => void;
  reSendOTP: () => void;
}) {
  const { registerData, setRegisterData } = useRegisterStore();

  const {
    register,
    handleSubmit,
    //watch,//It lets you read form values in real-time
    formState: { errors, isSubmitting },
  } = useForm<RegisterOTPInput>({
    defaultValues: {
      name: registerData.name,
      mobile_prefix: registerData.mobile_prefix,
      mobile: registerData.mobile,
      email: registerData.email,
      otp: "",
    },
    resolver: zodResolver(registerOTPSchema),
  });
  const [otp, setOtp] = useState("");
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

      await authApi.resendOTP(); // adjust payload if needed

      setTimer(30);
      toast.success("OTP resent");
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
    } finally {
      setIsResending(false);
    }
  };
  return (
    <>
      <h2 className="text-xl font-semibold text-orange-500 mb-6">
        Enter OTP !
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="text-sm text-gray-600">OTP</label>
          <Input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
        </div>

        <button type="submit">Verify OTP</button>

        {/* Timer / Resend */}
        {timer > 0 ? (
          <p>Resend in {timer}s</p>
        ) : (
          <button type="button" onClick={handleResend} disabled={isResending}>
            {isResending ? "Resending..." : "Resend OTP"}
          </button>
        )}

        {/* Back */}
        <button type="button" onClick={onBack}>
          Back
        </button>
      </form>
    </>
  );
}
