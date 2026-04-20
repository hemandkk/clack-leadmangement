import { LoginForm } from "@/components/auth/LoginForm";
import Image from "next/image";
export default function LoginPage() {
  return (
    <>
      {/* LEFT SIDE */}
      <div className="md:w-1/2 w-full bg-orange-500 text-white flex flex-col justify-between p-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">Try Clack CRM!</h1>
          <p className="text-sm opacity-90">
            The Official Sales-Force CRM for Unleashed
          </p>

          <div className="mt-8 bg-white rounded-lg p-4">
            {/* Replace with your image */}
            <Image
              src={"/dashboard.svg"}
              alt="Dashboard"
              className="rounded w-full h-auto"
              width={712}
              height={450}
              /* sizes="(max-width: 768px) 100vw, 712px" */
            />
          </div>
        </div>
        <div className="text-center mt-10">
          <p className="text-sm text-gray-200">
            Unleashed is excited to bring you Clack CRM.
          </p>

          <button className="mt-4 bg-white text-orange-500 px-4 py-2 rounded-md text-sm font-medium">
            Learn More
          </button>

          <p className="mt-6 text-xs text-gray-200">
            Clack CRM <br />
            <span className="opacity-70">
              A sales force CRM software company
            </span>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}

      <div className="md:w-1/2 w-full flex items-center justify-center">
        <div className="w-87.5">
          <h2 className="text-xl font-semibold text-orange-500 mb-6">
            Login to your account!
          </h2>
          <LoginForm />
        </div>
      </div>
    </>
  );
}
