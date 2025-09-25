import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import loginIllustration from "@/assets/login-illustration.png";
const serverUrl = "https://careerboost-ai-al0j.onrender.com";

import axios from "axios";
const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errMsg = params.get("error");
    if (errMsg) setError(decodeURIComponent(errMsg));
  }, []);

  const handleInputChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = e => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handlelogin = async (flow) => {
    try {
      if (flow === "Sing in") {
        const response = await axios.post(`${serverUrl}/users/login`, {
          email: formData.email,
          password: formData.password
        }, { withCredentials: true });
        console.log(response.data);
        navigate("/dashboard");
      } else {
        const response = await axios.post(`${serverUrl}/users/register`, {
          full_name: formData.firstName + " " + formData.lastName,
          email: formData.email,
          password: formData.password
        }, { withCredentials: true });
        console.log(response.data);
        navigate("/dashboard");
      }

    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          alert(error.response.data.errors[0].msg);
        } else if (error.response.data.error) {
          alert(error.response.data.error);
        }
      } else {
        alert("Network error");
      }
    }
  }
  const handleLinkedIn = async (flow) => {
    try {
      console.log(flow);
      const { data } = await axios.get(`${serverUrl}/auth/linkedin`, {
        withCredentials: true,
        params: { flow },
      });

      console.log("LinkedIn response:", data);

      if (data) {
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error); // מציג את השגיאה
      } else {
        alert("Unknown error occurred.");
      }
    }
  };

  return <div className="min-h-screen bg-background flex px-0 mx-0">
    {/* Left Panel - Login Form */}
    <div className="w-1/2 flex flex-col justify-center px-8 py-0 lg:px-[30px]">
      {/* Header */}
      <div className="mb-8">
        <Link to="/" className="flex items-center space-x-3 text-foreground hover:opacity-80 transition-opacity my-[15px]">


        </Link>
      </div>

      {/* Toggle Button */}
      <div className="mb-8">
        <Button variant="ghost" onClick={() => setIsLogin(!isLogin)} className="text-muted-foreground hover:text-foreground p-0 h-auto font-normal">
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </Button>
      </div>

      {/* Main Content */}
      <div className="max-w-md space-y-8">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-foreground">
            {isLogin ? "Welcome back" : "Get started"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {isLogin ? "Sign in to your account" : "Create your account to continue"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">First name</label>
              <Input name="firstName" placeholder="Enter your first name" value={formData.firstName} onChange={handleInputChange} className="h-12 border-2 focus:border-primary" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Last name</label>
              <Input name="lastName" placeholder="Enter your last name" value={formData.lastName} onChange={handleInputChange} className="h-12 border-2 focus:border-primary" required />
            </div>
          </div>}

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input name="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleInputChange} className="h-12 border-2 focus:border-primary" required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Password</label>
            <Input name="password" type="password" placeholder="Enter your password" value={formData.password} onChange={handleInputChange} className="h-12 border-2 focus:border-primary" required />
          </div>

          {isLogin && <div className="flex justify-end">
            <button type="button" className="text-sm text-primary hover:underline">
              Forgot password?
            </button>
          </div>}

          <Button onClick={() => handlelogin(isLogin ? "Sing in" : "Create")} type="submit" className="w-full h-12 bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 text-primary-foreground font-semibold mx-0 py-[21px] my-[29px]">
            {isLogin ? "Sign in" : "Create account"}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-3 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        {/* LinkedIn Button */}
        <Button
          variant="outline"
          onClick={() => handleLinkedIn(isLogin ? "login" : "register")}
          className="w-full h-12 flex items-center justify-center gap-3 border-2 hover:border-[#0077B5] hover:bg-[#0077B5]/5 transition-all"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path
              fill="#0077B5"
              d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
            />
          </svg>
          <span className="font-medium">
            {isLogin ? "Continue with LinkedIn" : "Register with LinkedIn"}
          </span>
        </Button>
        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

        {!isLogin && (
          <p className="text-sm text-muted-foreground text-center mt-2">
            By creating an account, you agree to our{" "}
            <button className="text-primary hover:underline">Terms</button> and{" "}
            <button className="text-primary hover:underline">Privacy Policy</button>
          </p>
        )}
      </div>
    </div>

    {/* Right Panel - Illustration */}
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-muted/20 to-background items-center justify-center p-8">
      <img src={loginIllustration} alt="Person working on laptop" className="max-w-md w-full h-auto opacity-80" />
    </div>
  </div>;
};
export default LoginPage;