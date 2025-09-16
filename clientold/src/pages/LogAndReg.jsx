import React from "react";
import './LogAndReg.css'
import { useState } from "react";
function LogAndReg() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <>
            <div className="welcome-login">
                <div className="toggle-container">
                    <span className={!isLogin ? "inactive" : "active"}>Login</span>
                    <div
                        className={`toggle-switch ${isLogin ? "login" : "register"}`}
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        <div className="toggle-circle"></div>
                    </div>
                    <span className={isLogin ? "inactive" : "active"}>Register</span>
                </div>

                {

                    isLogin ? <div className="input-container">
                        <input className="input-login" type="text" placeholder="gmail" />
                        <input className="input-pass" type="password" placeholder="password" />
                        <button className="btn-login">Login</button>

                        <a className="btn-linkedin">
                            <i className="fab fa-linkedin"></i> Login with LinkedIn
                        </a>
                    </div>

                        :

                        <div className="input-container">
                            
                            <input className="input-login" type="text" placeholder="Full name" />
                            <input className="input-login" type="text" placeholder="Email" />
                            <input className="input-pass" type="password" placeholder="Password" />
                            <input className="input-pass" type="password" placeholder="Confirm password" />

                            <button className="btn-login">Register</button>

                            <a className="btn-linkedin-reg">
                                <i className="fab fa-linkedin"></i> Register with LinkedIn
                            </a>
                        </div>

                }

            </div>


        </>

    )
}

export default LogAndReg;