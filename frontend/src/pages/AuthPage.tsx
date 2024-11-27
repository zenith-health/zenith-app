import { useState } from 'react';
import SignUpComponent from '../components/SignUpComponent';
import LoginComponent from '../components/LoginComponent';

function AuthPage() {
  const [showSignUp, setShowSignUp] = useState(true);

  return (
    <div>
      {showSignUp ? (
        <SignUpComponent setShowSignUp={setShowSignUp} />
      ) : (
        <LoginComponent setShowSignUp={setShowSignUp} />
      )}
    </div>
  );
}

export default AuthPage;
