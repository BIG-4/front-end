window.app = window.app || {}

function Login() {
  return `
    <main class="vertical-center">
        <div class="border-radius shadow w-50 auto-margin">
        <div class="container" id="container">
            <div class="form-container sign-up-container">
                <div id="signUpForm">
                    <h1>Create Account</h1>
                    <input id="signUpUsername" type="text" name="username" placeholder="Username" required />
                    <input id="signUpPw" type="password" name="password" placeholder="Password" required />
                    <input id="signUpRetypePw" type="password" name="retype-password" placeholder="Retype Password" required />
                    <button id="signUp">Sign Up</button>
                </div>
            </div>
            <div class="form-container sign-in-container">
                <div id="signInForm">
                    <h1>Sign in</h1>
                    <input id="signInUsername" type="text" name="username" placeholder="Username" />
                    <input id="signInPassword" type="password" name="password" placeholder="Password" />
                    <button id="signIn">Sign In</button>
                </div>
            </div>
            <div class="overlay-container">
                <div class="overlay">
                    <div class="overlay-panel overlay-left">
                        <h1>Welcome Back!</h1>
                        <p>To keep connected with us please login with your personal info</p>
                        <button class="ghost" id="signInBtn">Sign In</button>
                    </div>
                    <div class="overlay-panel overlay-right">
                        <h1>Hello, Friend!</h1>
                        <p>Enter your personal details and start journey with us</p>
                        <button class="ghost" id="signUpBtn">Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
        </div>
    </main>
    `
}

window.app.LoginTemplate = { Login }
