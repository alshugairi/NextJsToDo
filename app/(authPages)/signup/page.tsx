"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RegisterRequest } from "@/app/services/Authentication/RegisterRequest";
import { useRouter } from 'next/navigation';
import CustomInput from "@/app/components/inputs/CustomInput";
import Link from "next/link";
import AuthLayout from "@/app/components/layout/authLayout/AuthLayout";

const SignupSchema = Yup.object().shape({
    name: Yup.string().required("First name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
    password_confirmation: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm Password is required"),
});

export default function SignUp() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { token, register } = useSelector((state: any) => state.auth);
    const { loading, error } = useSelector((state: any) => state.auth.register || {});
    const [isLoading, setIsLoading] = useState(false);
    const [countryCode, setCountryCode] = useState('+964');

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
        },
        validationSchema: SignupSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                await dispatch(RegisterRequest(values) as any);
            } catch (error) {
                console.error("Registration failed:", error);
            } finally {
                setIsLoading(false);
            }
        },
    });

    useEffect(() => {
        if (token) {
            router.push('/');
        }
    }, [token, router]);

    return (
        <AuthLayout>
            <div className="text-center mb-4">
                <h3>Register new account</h3>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={formik.handleSubmit} style={{minWidth: '400px', width: '100%'}}>
                <div className="row">
                    <CustomInput
                        className={"col-12"}
                        formik={formik}
                        name="name"
                        placeholder="Name"
                        icon="fas fa-user"
                    />
                    <CustomInput
                        className={"col-12"}
                        formik={formik}
                        name="email"
                        placeholder="Email address"
                        icon="fas fa-envelope"
                    />
                    <CustomInput
                        className={"col-12"}
                        formik={formik}
                        name="password"
                        type="password"
                        placeholder="Password"
                        icon="fas fa-lock"
                    />
                    <CustomInput
                        className={"col-12"}
                        formik={formik}
                        name="password_confirmation"
                        type="password"
                        placeholder="Confirm Password"
                        icon="fas fa-lock"
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-md btn-primary w-100 my-4"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            <span className="ms-2">Creating account...</span>
                        </>
                    ) : (
                        "Create account"
                    )}
                </button>
            </form>

            <div className="text-center mt-4">
                <p>
                    Already have an account?
                    <Link href="/signin" className="text-blue text-decoration-underline fw-bold"> SignIn</Link>
                </p>
            </div>
        </AuthLayout>
    );
}