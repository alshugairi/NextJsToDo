"use client";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RequestLogin } from "@/app/services/Authentication/LoginRequest";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/app/components/layout/authLayout/AuthLayout";
import CustomInput from "@/app/components/inputs/CustomInput";

const SignInSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    password: Yup.string().required("Password is required"),
});

export default function SignIn() {
    const router = useRouter();
    const dispatch = useDispatch();
    const initialValues = { email: "", password: "" };
    const { token, login } = useSelector((state: any) => state.auth);
    const { loading, error } = useSelector((state: any) => state.auth.login);
    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik({
        initialValues,
        validationSchema: SignInSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                await dispatch(RequestLogin(values) as any);
            } catch (error) {
                console.error("Login failed:", error);
            } finally {
                setIsLoading(false);
            }
        },
    });

    useEffect(() => {
        if (token) {
            router.push("/");
        }
    }, [token, router]);

    return (
        <AuthLayout>
            <div className="text-center mb-4">
                <h3>Sign In</h3>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <form
                onSubmit={formik.handleSubmit}
                style={{ minWidth: "400px", width: "100%" }}
            >
                <CustomInput
                    formik={formik}
                    icon={"fas fa-envelope"}
                    placeholder={"Email"}
                    type={"email"}
                    name={"email"}
                />
                <CustomInput
                    formik={formik}
                    icon={"fas fa-lock"}
                    placeholder={"Password"}
                    type={"password"}
                    name={"password"}
                />

                <button
                    type="submit"
                    className="btn btn-md btn-primary w-100 my-4"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
              <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
              ></span>
                            <span className="ms-2">Signing in...</span>
                        </>
                    ) : (
                        "Sign in Now"
                    )}
                </button>
            </form>

            <div className="text-center mt-4">
                <p>
                    Don’t have an account?
                    <Link href="/signup" className="text-blue text-decoration-underline fw-bold">
                        {" "}
                        Sign Up
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}