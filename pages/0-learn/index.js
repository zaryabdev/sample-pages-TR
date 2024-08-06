import { CheckIcon } from "@heroicons/react/solid";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { createContext, useContext, useState } from "react";
import useMeasure from "react-use-measure";

let transition = { type: "ease", ease: "easeInOut", duration: 0.4 };

const REGISTARTION_STAGES = {
  SIGN_IN_EMAIL: "SIGN_IN_EMAIL",
  SIGN_IN_PASSWORD: "SIGN_IN_PASSWORD",
  SIGN_IN_SUCCESS: "SIGN_IN_SUCCESS",
  RECOVERY_PASSWORD: "SIGN_IN_PASSWORD",
  RECOVERY_MESSAGE: "RECOVERY_MESSAGE",
  SIGN_UP_NAME: "SIGN_UP_NAME",
  SIGN_UP_BASIC_INFO: "SIGN_UP_BASIC_INFO",
  SIGN_UP_EMAIL: "SIGN_UP_EMAIL",
  SIGN_UP_PASSWORD: "SIGN_UP_PASSWORD",
  SIGN_UP_SUCCESS: "SIGN_UP_SUCCESS",
};

export default function Registration() {
  const [registrationStage, setRegistrationStage] = useState(
    REGISTARTION_STAGES.SIGN_IN_EMAIL
  );

  return (
    <MotionConfig transition={transition}>
      <div className="flex min-h-full flex-1 flex-col justify-center bg-zinc-900 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto my-12 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="rounded-none border border-zinc-700 bg-zinc-800 sm:rounded-xl">
            <div className="px-8 pt-8">
              <p className="text-lg text-white">Sign in</p>
            </div>

            <ResizablePanel>
              <AnimatePresence mode="popLayout">
                {registrationStage == REGISTARTION_STAGES.SIGN_IN_EMAIL && (
                  <motion.div
                    exit={{ opacity: 0 }}
                    transition={{
                      ...transition,
                      duration: transition.duration / 2,
                    }}
                    key={registrationStage}
                  >
                    <Form
                      onSubmit={async () => await delay(500)}
                      afterSave={() => {
                        setRegistrationStage(
                          REGISTARTION_STAGES.SIGN_IN_PASSWORD
                        );
                      }}
                      className="p-8"
                    >
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium leading-6 text-zinc-400"
                        >
                          Email address
                        </label>
                        <div className="mt-2">
                          <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            defaultValue="admin@gmail.com"
                            className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                          />
                        </div>
                        <a
                          className="mt-2 text-sm text-gray-500"
                          id="email-description"
                        >
                          Forget Email?
                        </a>
                      </div>
                      <div className="mt-8 flex justify-end">
                        <button
                          className="mx-2 text-sm text-gray-500"
                          id="email-description"
                          type="button"
                        >
                          Create Account
                        </button>
                        <Form.LoadingButton className="rounded bg-indigo-500 px-5 py-2 text-sm font-medium text-white ">
                          Next
                        </Form.LoadingButton>
                      </div>
                    </Form>
                  </motion.div>
                )}

                {registrationStage == REGISTARTION_STAGES.SIGN_IN_PASSWORD && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      ...transition,
                      duration: transition.duration / 2,
                      delay: transition.duration / 2,
                    }}
                    key="form"
                  >
                    <Form
                      onSubmit={async () => await delay(500)}
                      afterSave={() => {
                        setRegistrationStage(
                          REGISTARTION_STAGES.SIGN_IN_SUCCESS
                        );
                      }}
                      className="p-8"
                    >
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium leading-6 text-zinc-400"
                        >
                          Password
                        </label>
                        <div className="mt-2">
                          <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      <div className="mt-8 flex justify-end">
                        <button
                          className="mx-2 text-sm text-gray-500"
                          id="email-description"
                          type="button"
                        >
                          Create Account
                        </button>
                        <Form.LoadingButton className="rounded bg-indigo-500 px-5 py-2 text-sm font-medium text-white ">
                          Next
                        </Form.LoadingButton>
                      </div>
                    </Form>
                  </motion.div>
                )}

                {registrationStage == REGISTARTION_STAGES.SIGN_IN_SUCCESS && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      ...transition,
                      duration: transition.duration / 2,
                      delay: transition.duration / 2,
                    }}
                  >
                    <p className="p-8 text-sm text-zinc-400">
                      Email sent! Check your inbox to continue.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </ResizablePanel>
          </div>
          <p className="mt-8 text-sm text-zinc-500">
            <span className="underline">Reach out</span> to us if you need more
            help.
          </p>
        </div>
      </div>
    </MotionConfig>
  );
}

let formContext = createContext();

function Form({ onSubmit, afterSave, children, ...props }) {
  let [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("saving");
    await onSubmit();
    setStatus("success");
    await delay(1250);
    afterSave();
  }

  return (
    <formContext.Provider value={{ status }}>
      <form onSubmit={handleSubmit} {...props}>
        <fieldset disabled={status !== "idle"}>{children}</fieldset>
      </form>
    </formContext.Provider>
  );
}

Form.LoadingButton = function FormButton({ children, className, ...rest }) {
  let { status } = useContext(formContext);

  let disabled = status !== "idle";

  return (
    <MotionConfig transition={{ ...transition, duration: 0.15 }}>
      <button
        type="submit"
        disabled={disabled}
        className={`${className} relative transition duration-200 ${
          disabled ? "bg-opacity-80" : "hover:bg-opacity-80"
        }`}
        {...rest}
      >
        <AnimatePresence mode="wait">
          {status === "saving" && (
            <motion.div
              key="a"
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex justify-center py-2"
            >
              <Spinner />
            </motion.div>
          )}

          {status === "success" && (
            <motion.div
              key="b"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex justify-center py-2"
            >
              <CheckIcon className="h-full" />
            </motion.div>
          )}
        </AnimatePresence>
        <span className={status === "idle" ? "" : "invisible"}>{children}</span>
      </button>
    </MotionConfig>
  );
};

function Spinner({ className, ...rest }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} h-full w-auto animate-spin`}
      style={{
        animationTimingFunction: "steps(8, end)",
        animationDuration: ".75s",
      }}
      {...rest}
    >
      <rect
        style={{ opacity: 0.4 }}
        x={11}
        y={2}
        width={2}
        height={6}
        rx={1}
        fill="currentColor"
      />
      <rect
        style={{ opacity: 0.4 }}
        x={18.364}
        y={4.22183}
        width={2}
        height={6}
        rx={1}
        transform="rotate(45 18.364 4.222)"
        fill="currentColor"
      />
      <rect
        x={22}
        y={11}
        width={2}
        style={{ opacity: 0.4 }}
        height={6}
        rx={1}
        transform="rotate(90 22 11)"
        fill="currentColor"
      />
      <rect
        x={19.7782}
        y={18.364}
        width={2}
        style={{ opacity: 0.4 }}
        height={6}
        rx={1}
        transform="rotate(135 19.778 18.364)"
        fill="currentColor"
      />
      <rect
        x={13}
        y={22}
        width={2}
        style={{ opacity: 0.4 }}
        height={6}
        rx={1}
        transform="rotate(-180 13 22)"
        fill="currentColor"
      />
      <rect
        x={5.63603}
        y={19.7782}
        width={2}
        style={{ opacity: 0.6 }}
        height={6}
        rx={1}
        transform="rotate(-135 5.636 19.778)"
        fill="currentColor"
      />
      <rect
        x={2}
        y={13}
        width={2}
        style={{ opacity: 0.8 }}
        height={6}
        rx={1}
        transform="rotate(-90 2 13)"
        fill="currentColor"
      />
      <rect
        x={4.22183}
        y={5.63603}
        width={2}
        height={6}
        rx={1}
        transform="rotate(-45 4.222 5.636)"
        fill="currentColor"
      />
    </svg>
  );
}

function ResizablePanel({ children }) {
  let [ref, bounds] = useMeasure();

  return (
    <motion.div animate={{ height: bounds.height > 0 ? bounds.height : null }}>
      <div ref={ref}>{children}</div>
    </motion.div>
  );
}

async function delay(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
