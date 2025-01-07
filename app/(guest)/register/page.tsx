'use client';

import React, {Suspense, useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {toast} from "react-toastify";
import validated from "@/public/validated.svg"
import notValidated from "@/public/not-validated.svg"
import {SubmitHandler, useForm} from "react-hook-form";
import Image from "next/image";

function Register() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: {errors},
        trigger,
    } = useForm<{
        name: string;
        email: string;
        password: string;
        passwordConfirmation: string;
    }>();

    const name = watch("name", "");
    const email = watch("email", "");
    const password = watch("password", "");
    const passwordConfirmation = watch("passwordConfirmation", "");

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const hasValidLength = (password).length >= 6;

    const onSubmit: SubmitHandler<{
        name: string;
        email: string;
        password: string;
        passwordConfirmation: string;
    }> = async (data) => {
        setLoading(true);

        const {name, email, password} = data;

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
            })
        }).then(response => {
            if (response.ok) {
                return response.json();
            }

            return Promise.reject(response);
        }).then(() => {
            router.push('/login');
        }).catch(error => {
            if (error instanceof Response) {
                error.json().then((data) => {
                    toast.error(
                        <div className="text-black space-y-2 px-3">
                            <p>{data.message}</p>
                        </div>, {
                            position: "top-right",
                            autoClose: 5_000,
                            hideProgressBar: true,
                            className: "bg-red-100 border border-black rounded-xl w-full shadow-[0px_5px_0px_0px_#191A23]",
                            closeButton: false
                        });
                })
            } else {
                toast.error(
                    <div className="text-black space-y-2 px-3">
                        <p>Server Error</p>
                    </div>, {
                        position: "top-right",
                        autoClose: 5_000,
                        hideProgressBar: true,
                        className: "bg-red-100 border border-black rounded-xl w-full shadow-[0px_5px_0px_0px_#191A23]",
                        closeButton: false
                    });
            }
        }).finally(() => {
            setLoading(false);
        });
    }

    return (
        <>
            <title>Mysorf | Register</title>

            <div className="w-full md:min-w-96 p-5 space-y-6">
                <div className="w-fit md:text-5xl text-3xl font-semibold mb-20 bg-lime-100 p-2 rounded-xl">
                    Register
                </div>

                <div className="flex items-center">
                    <div className="font-semibold text-sm md:text-base">Already have an account?</div>

                    <div className="flex-grow"></div>

                    <Link href={"/login"}
                          className="bg-lime-300 font-semibold md:text-base text-sm underline px-3 py-1 rounded-lg">
                        Login
                    </Link>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col">
                        <div
                            className={`${errors.name ? "border border-red-700 bg-red-200" : "border border-black bg-stone-100"} flex items-center  rounded-xl overflow-hidden px-3`}>
                            <svg viewBox="0 0 24 25" fill="none" focusable="false" className="h-6 w-6">
                                <path
                                    d="M12 12.8a5 5 0 100-10 5 5 0 000 10zM20.59 22.8c0-3.87-3.85-7-8.59-7s-8.59 3.13-8.59 7"
                                    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
                                    strokeLinejoin="round"></path>
                            </svg>

                            <input type="text"
                                   className={`${errors.name ? "bg-red-200" : "bg-stone-100"} w-full p-3 focus:outline-none`}
                                   placeholder="Full Name"
                                   value={name || ""}
                                   {...register("name", {
                                       required: 'name is required',
                                       minLength: {
                                           value: 5,
                                           message: ''
                                       },
                                   })}
                                   onBlur={() => trigger("name")}
                            />
                        </div>
                        <p className="text-red-500 text-sm">{errors.name && "Your name should at lease be 5 characters"}</p>
                    </div>

                    <div className="flex flex-col">
                        <div
                            className={`${errors.email ? "border border-red-700 bg-red-200" : "border border-black bg-stone-100"} flex items-center  rounded-xl overflow-hidden px-3`}>
                            <svg viewBox="0 0 24 25" fill="none" focusable="false" className="h-6 w-6">
                                <path d="M17 21.3H7c-3 0-5-1.5-5-5v-7c0-3.5 2-5 5-5h10c3 0 5 1.5 5 5v7c0 3.5-2 5-5 5z"
                                      stroke="currentColor"
                                      strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"
                                      strokeLinejoin="round"></path>
                                <path d="M17 9.8l-3.13 2.5c-1.03.82-2.72.82-3.75 0L7 9.8" stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>

                            <input type="email"
                                   className={`${errors.email ? "bg-red-200" : "bg-stone-100"} w-full p-3 focus:outline-none`}
                                   placeholder="Email"
                                   value={email || ""}
                                   {...register("email", {
                                       required: 'email is required',
                                       pattern: {
                                           value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                           message: ''
                                       },
                                   })}
                                   onBlur={() => trigger("email")}
                            />
                        </div>
                        <p className="text-red-500 text-sm">{errors.email && "Please enter a valid email address"}</p>
                    </div>

                    <div className="flex flex-col text-sm space-y-1">
                        <div
                            className={`${errors.password ? "border border-red-700 bg-red-200" : "border border-black bg-stone-100"} flex items-center  rounded-xl overflow-hidden px-3`}>
                            <svg viewBox="0 0 24 25" fill="none" focusable="false" className="h-6 w-6">
                                <path
                                    d="M16.423 10.249V8.102a4.552 4.552 0 00-4.55-4.551 4.55 4.55 0 00-4.57 4.53v2.168"
                                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                    strokeLinejoin="round"></path>
                                <path clipRule="evenodd"
                                      d="M15.683 22.05h-7.64a3.792 3.792 0 01-3.793-3.792V13.97a3.792 3.792 0 013.792-3.792h7.641a3.792 3.792 0 013.792 3.792v4.29a3.792 3.792 0 01-3.792 3.791z"
                                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                      strokeLinejoin="round"></path>
                                <path d="M11.863 15.004v2.22" stroke="currentColor" strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"></path>
                            </svg>

                            <input type="password"
                                   className={`${errors.password ? "bg-red-200" : "bg-stone-100"} w-full p-3 focus:outline-none text-base`}
                                   placeholder="Password"
                                   value={password || ""}
                                   {...register("password", {
                                       required: 'Password is required',
                                       minLength: {
                                           value: 6,
                                           message: 'Password must be at least 6 characters'
                                       },
                                       pattern: {
                                           value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
                                           message: 'Password must contain at least one special character'
                                       },

                                   })}
                                   onBlur={() => trigger("password")}
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Image
                                src={(hasUppercase && hasLowercase) ? validated : notValidated}
                                alt="Uppercase and Lowercase"
                                width={20}
                                height={20}
                            />
                            <p>
                                {(hasUppercase && hasLowercase)
                                    ? "Used both uppercase and lowercase letters"
                                    : "Please include both uppercase and lowercase letters"}
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Image
                                src={hasSpecialChar ? validated : notValidated}
                                alt="Special Char"
                                width={20}
                                height={20}
                            />
                            <p>
                                {hasSpecialChar
                                    ? "Used at least 1 symbol"
                                    : "Please include symbols like @, $, or %"}
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Image
                                src={hasNumber ? validated : notValidated}
                                alt="Number"
                                width={20}
                                height={20}
                            />
                            <p>
                                {hasNumber
                                    ? "Used at least 1 number"
                                    : "Please include numbers in your password"}
                            </p>
                        </div>

                        {(!password || !hasValidLength) && (
                            <div className="flex items-center space-x-2">
                                <Image
                                    src={notValidated}
                                    alt="Not validated"
                                    width={20}
                                    height={20}
                                />
                                <p>
                                    {!hasValidLength ? "Password requires at least 6 characters." : "This is required."}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <div
                            className={`${errors.password ? "border border-red-700 bg-red-200" : "border border-black bg-stone-100"} flex items-center  rounded-xl overflow-hidden px-3`}>
                            <svg viewBox="0 0 24 25" fill="none" focusable="false" className="h-6 w-6">
                                <path
                                    d="M16.423 10.249V8.102a4.552 4.552 0 00-4.55-4.551 4.55 4.55 0 00-4.57 4.53v2.168"
                                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                    strokeLinejoin="round"></path>
                                <path clipRule="evenodd"
                                      d="M15.683 22.05h-7.64a3.792 3.792 0 01-3.793-3.792V13.97a3.792 3.792 0 013.792-3.792h7.641a3.792 3.792 0 013.792 3.792v4.29a3.792 3.792 0 01-3.792 3.791z"
                                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                      strokeLinejoin="round"></path>
                                <path d="M11.863 15.004v2.22" stroke="currentColor" strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"></path>
                            </svg>

                            <input type="password"
                                   className={`${errors.passwordConfirmation ? " bg-red-200" : " bg-stone-100"} w-full p-3 focus:outline-none`}
                                   placeholder="Confirm Password"
                                   value={passwordConfirmation}
                                   {...register("passwordConfirmation", {
                                       required: 'Confirm Password is required',
                                       validate: value => value === password || 'Passwords do not match'
                                   })}
                                   onBlur={() => trigger("passwordConfirmation")}
                            />
                        </div>
                        <p className="text-red-500 text-sm">{errors.passwordConfirmation && "Passwords do not match"}</p>
                    </div>

                    <button
                        type="submit"
                        disabled={!email || !password || (password !== passwordConfirmation) || loading}
                        className={`w-full mt-14 bg-black border border-black text-white py-3 rounded-full transition-all duration-300 disabled:bg-stone-400 disabled:text-black disabled:font-semibold disabled:cursor-not-allowed cursor-pointer flex justify-center items-center ${
                            !loading && "bg-black hover:bg-gray-800"
                        }`}
                    >
                        {loading ? (
                            <span
                                className="h-4 w-4 animate-spin rounded-full border border-white border-t-black"></span>
                        ) : (
                            "Register"
                        )}
                    </button>
                </form>
            </div>
        </>
    )
}

export default function Page() {
    return (
        <Suspense>
            <Register/>
        </Suspense>
    )
}