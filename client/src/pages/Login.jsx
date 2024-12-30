import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import jj from "../assets/jj.jpg";
import "/Users/yousraelmaghraby/frinds/client/src/style/Login.css";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [inputs, setInputs] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const { setAuthUser } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e) => {
    e.preventDefault();

    if (!isLogin && !validateSignupInputs(inputs)) return;
    if (isLogin && !validateLoginInputs(inputs)) return;

    setLoading(true);
    const url = isLogin
      ? '/api/auth/login'
      : '/api/auth/signup';

    const body = isLogin
      ? { name: inputs.name, password: inputs.password }
      : inputs;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      localStorage.setItem("chat-user", JSON.stringify(data));
    
      toast.success(`${isLogin ? "Login" : "Signup"} successful!`);

      // Redirect to the home page (where the sidebar will be)
      navigate("/home"); // Redirect to /home after successful login/signup
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const validateSignupInputs = ({
    email,
    name,
    password,
    confirmPassword,
    gender,
  }) => {
    if (!email || !name || !password || !confirmPassword || !gender) {
      toast.error("All fields are required");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const validateLoginInputs = ({ name, password }) => {
    if (!name || !password) {
      toast.error("Please fill in all fields");
      return false;
    }
    return true;
  };

  return (
    <div className="Home">
      <img src={jj} alt="Background" />
      <div className="form">
        <span className="logo"> ❤️ Friends ❤️</span>
        <h3>
          Chat with the people who matter most, anytime, anywhere. Stay
          connected and share the moments that bring you joy. Remember, everyone
          has their story—never forget the ones who bring you peace and
          happiness!
        </h3>
        <h1 className="login">{isLogin ? "Login" : "Sign Up"}</h1>

        <form onSubmit={handleAuth}>
          {!isLogin && (
            <div>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={inputs.email}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <div>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={inputs.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={inputs.password}
              onChange={handleInputChange}
              required
            />
          </div>

          {!isLogin && (
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={inputs.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          {!isLogin && (
            <div>
              <select
                name="gender"
                value={inputs.gender}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          )}

          <Link
            to={isLogin ? "/signup" : "/login"}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </Link>

          <div>
            <button disabled={loading}>
              {loading ? (
                <span>Loading...</span>
              ) : isLogin ? (
                "Login"
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
