"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function RegisterForm() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "patient", // Default to patient
    agreeToTerms: false,
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear errors when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeToTerms) {
      errors.agreeToTerms = "You must agree to the terms and conditions";
    }

    if (!/[a-z]/.test(formData.password)) {
      errors.lowerCase = "At least one lowercase letter required.";
    }
    if (!/[A-Z]/.test(formData.password)) {
      errors.upperCase = "At least one uppercase letter required.";
    }
    if (!/[0-9]/.test(formData.password)) {
      errors.number = "At least one number required.";
    }
    if (!/[\W_]/.test(formData.password)) {
      errors.specialCharacter = "At least one special character required.";
    }

    return errors;
  };

  const [os, setOS] = useState("");
  const [location, setLocation] = useState({});
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      setIsMetaMaskInstalled(true);
    }

    const userAgent = window.navigator.userAgent;
    if (userAgent.indexOf("Win") !== -1) setOS("Windows");
    else if (userAgent.indexOf("Mac") !== -1) setOS("macOS");
    else if (userAgent.indexOf("Linux") !== -1) setOS("Linux");
    else if (/Android/.test(userAgent)) setOS("Android");
    else if (/iPhone|iPad|iPod/.test(userAgent)) setOS("iOS");
    else setOS("Unknown");

    const getLocationInfo = async () => {
      await fetch("https://ipinfo.io/json")
        .then((response) => response.json())
        .then((data) => {
          setLocation({
            ip: data.ip,
            city: data.city,
            region: data.region,
            country: data.country,
          });
        })
        .catch((err) => { });
    };

    getLocationInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // setIsSubmitting(true);

    try {
      // Use the new API endpoint path
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          userType: formData.userType,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }
      // Login the user with the returned data
      login({
        id: data.data.id,
        email: data.data.email,
        name: data.data.name,
        type: data.data.type,
        token: data.data.token,
      });
    } catch (error) {
      setFormErrors({
        general: error.message || "Registration failed. Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {formErrors.general && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{formErrors.general}</div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            First name
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="firstName"
              id="firstName"
              autoComplete="given-name"
              className={`block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ${formErrors.firstName ? "ring-red-300" : "ring-gray-300"
                } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6`}
              value={formData.firstName}
              onChange={handleChange}
            />
            {formErrors.firstName && (
              <p className="mt-1 text-sm text-red-600">
                {formErrors.firstName}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Last name
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="lastName"
              id="lastName"
              autoComplete="family-name"
              className={`block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ${formErrors.lastName ? "ring-red-300" : "ring-gray-300"
                } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6`}
              value={formData.lastName}
              onChange={handleChange}
            />
            {formErrors.lastName && (
              <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={`block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ${formErrors.email ? "ring-red-300" : "ring-gray-300"
              } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6`}
            value={formData.email}
            onChange={handleChange}
          />
          {formErrors.email && (
            <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className={`block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ${formErrors.password ? "ring-red-300" : "ring-gray-300"
              } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6`}
            value={formData.password}
            onChange={handleChange}
          />
          {(formErrors.password ||
            formErrors.lowerCase ||
            formErrors.upperCase ||
            formErrors.number ||
            formErrors.specialCharacter) && (
              <p className="mt-1 text-sm text-red-600">
                {formErrors.password
                  ? formErrors.password
                  : formErrors.lowerCase
                    ? formErrors.lowerCase
                    : formErrors.upperCase
                      ? formErrors.upperCase
                      : formErrors.number
                        ? formErrors.number
                        : formErrors.specialCharacter}
              </p>
            )}
        </div>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm password
        </label>
        <div className="mt-1">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            className={`block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ${formErrors.confirmPassword ? "ring-red-300" : "ring-gray-300"
              } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6`}
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {formErrors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">
              {formErrors.confirmPassword}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="userType"
          className="block text-sm font-medium text-gray-700"
        >
          I am a
        </label>
        <div className="mt-1">
          <select
            id="userType"
            name="userType"
            className="block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            value={formData.userType}
            onChange={handleChange}
          >
            <option value="patient">User</option>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="agreeToTerms"
          name="agreeToTerms"
          type="checkbox"
          className={`h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600 ${formErrors.agreeToTerms ? "border-red-300" : "border-gray-300"
            }`}
          checked={formData.agreeToTerms}
          onChange={handleChange}
        />
        <label
          htmlFor="agreeToTerms"
          className="ml-2 block text-sm text-gray-900"
        >
          I agree to the{" "}
          <a
            href="#"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Terms
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Privacy Policy
          </a>
        </label>
      </div>
      {formErrors.agreeToTerms && (
        <p className="mt-1 text-sm text-red-600">{formErrors.agreeToTerms}</p>
      )}

      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </div>
    </form>
  );
}
