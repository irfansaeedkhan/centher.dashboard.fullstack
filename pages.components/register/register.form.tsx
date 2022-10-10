// React, Next, NPM Packages
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ctl from "@netlify/classnames-template-literals";
import { useWeb3React } from "@web3-react/core";
import { Controller, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { toast } from "react-hot-toast";

// App imports
import { useConnectWallet } from "@/web3/hooks/use.connect.wallet";
import { ErrorMessage } from "@/components/error.message";
import { AppRoutes } from "@/constants/app.routes";
import { SpinIcon2, Successfully, WalletIconModal } from "@/assets/svgs";

// Current directory imports
import { InputField } from "./input.field";
import { formFields, SignupState, SignupStateSchema } from "./form.fields.data";
import { registerWithSmartContract } from "./register.with.smart.contract";
import { ModalWrapper } from "@/components/modal";

// Initial Signup State
const initialSignupState: SignupState = {
  account_address: "",
  referred_by: "",
};

export const RegisterForm: React.FC = () => {
  const [feeModal, setFeeModal] = useState(false);
  const [feeModalStatus, setFeeModalStatus] = useState("start");
  const router = useRouter();
  const { account, library } = useWeb3React();
  const { connectWallet } = useConnectWallet();

  const { handleSubmit, setValue, control } = useForm({
    defaultValues: initialSignupState,
    resolver: joiResolver(SignupStateSchema, {
      abortEarly: false,
      errors: {
        wrap: {
          label: "",
        },
      },
    }),
  });

  useEffect(() => {
    setValue("account_address", account ?? "", {
      shouldValidate: account != null,
    });
    if (typeof router.query.referred_by === "string") {
      setValue("referred_by", router.query.referred_by);
    }
  }, [account, setValue, router.query.referred_by]);

  const onSubmit = async (signupData: SignupState) => {
    setFeeModalStatus("progress");

    const res = await registerWithSmartContract(library, signupData);
    // TODO: Mubashir: Show fee in Modal
    if (res.status === "error") {
      setFeeModalStatus("start");
      toast.error(res.message_description || "Something went wrong");
      return;
    }

    toast.success(res.message_description);
    setFeeModalStatus("end");
    setFeeModal(false);
    // Redirect to login page
    router.push(AppRoutes.auth.login);
  };

  return (
    <>
      <form className={wrapper} onSubmit={handleSubmit(onSubmit)}>
        {formFields.map((formField) => {
          return (
            <Controller
              key={formField.id}
              name={formField.id}
              control={control}
              render={({ field, fieldState: { error } }) => {
                if (field.name === "account_address" && field.value === "") {
                  return (
                    <div>
                      <button
                        key={formField.id}
                        className={connectButton}
                        type="button"
                        onClick={connectWallet}
                      >
                        Connect
                      </button>
                      {error && (
                        <ErrorMessage
                          message={error.message}
                          className="mt-2"
                        />
                      )}
                    </div>
                  );
                }

                return <InputField {...formField} {...field} error={error} />;
              }}
            />
          );
        })}

        <button
          type="button"
          onClick={() => {
            if (!account) {
              toast.error("Please connect wallet first!");
              return;
            }
            setFeeModal(true);
          }}
          className={button}
        >
          Register
        </button>
        {feeModal && (
          <ModalWrapper
            title="Registeration Fee"
            onClose={() => {
              feeModalStatus !== "progress" && setFeeModal(false);
            }}
          >
            <div className="px-10 flex flex-col gap-6 pt-5 pb-8">
              <div className="flex justify-center">
                {feeModalStatus === "start" ? (
                  <WalletIconModal />
                ) : feeModalStatus === "progress" ? (
                  <SpinIcon2 />
                ) : (
                  feeModalStatus === "end" && <Successfully />
                )}
              </div>
              <div className="flex flex-col gap-2 items-center">
                <h2 className="font-semibold text-lg text-center text-white">
                  {feeModalStatus === "start"
                    ? "Pay Registeration Fee"
                    : feeModalStatus === "progress"
                    ? "Transaction in progress"
                    : feeModalStatus === "end" && "Successfully"}
                </h2>
                {feeModalStatus === "start" ? (
                  <p className="text-brand-primary text-center font-semibold tracking-wider text-base">
                    {`BNB`}
                  </p>
                ) : feeModalStatus === "progress" ? (
                  <p className="text-sm text-center text-gray-shade-2">
                    Please do not close or refresh page.
                  </p>
                ) : (
                  feeModalStatus === "end" && (
                    <p className="text-sm text-center text-gray-shade-2">
                      Transaction done successfully. Registering user on
                      platform
                    </p>
                  )
                )}
              </div>
              <div>
                {feeModalStatus === "start" ? (
                  <button className={button} type="submit">
                    Pay
                  </button>
                ) : (
                  (feeModalStatus === "progress" ||
                    feeModalStatus === "end") && (
                    <button className={button2} type="button" disabled>
                      Ok
                    </button>
                  )
                )}
              </div>
            </div>
          </ModalWrapper>
        )}
      </form>
    </>
  );
};

const wrapper = ctl(`
  flex 
  gap-6
  w-full 
  h-auto 
  flex-col 
`);

const button = ctl(`
  mt-2 
  py-3 
  flex 
  w-full 
  font-bold 
  rounded-lg
  items-center 
  text-gray-shade-5
  justify-center 
  !bg-brand-primary 
  hover:bg-brand-primary-dark
  transition-all 
`);

const connectButton = ctl(`
  mt-2 
  py-3 
  flex 
  w-full 
  font-bold 
  rounded-lg
  items-center 
  justify-center 
  text-brand-primary
  !bg-black-shade-7
  hover:!bg-black-shade-4
  transition-all 
`);

const button2 = ctl(`
  mt-2 
  py-3 
  flex 
  w-full 
  font-bold 
  rounded-lg
  items-center 
  text-[#7C81A2] 
  justify-center 
  bg-black-shade-7
  cursor-not-allowed
`);
