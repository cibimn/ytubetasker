import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  // useParams hook to get the token from the URL
  const { token } = useParams();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.post('http://localhost:8000/api/users/verify_email/', {
          token: token
        });
        console.log("Email verified:", res.data);
        // You can update the UI here to show a successful verification message
      } catch (err) {
        console.log("Email verification failed:", err.response ? err.response.data : err);
        // You can update the UI here to show a failed verification message
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div>
      {/* Your UI for verification status will go here */}
    </div>
  );
};

export default VerifyEmail;
