import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { enrollmentsAPI } from "../../services/api";

interface PaymentIntentResponse {
  clientSecret: string;
  course: {
    _id: string;
    title: string;
    price: number;
  };
}

// Initialize Stripe with error handling
const stripePromise = (() => {
  const publicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  if (!publicKey) {
    console.error(
      "Stripe public key is missing. Please check your environment variables."
    );
    return null;
  }
  return loadStripe(publicKey);
})();

interface EnrollButtonProps {
  courseId: string;
  price: number;
  onEnrollmentComplete?: () => void;
}

const CheckoutForm: React.FC<{
  courseId: string;
  onEnrollmentComplete?: () => void;
}> = ({ courseId, onEnrollmentComplete }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string>("");
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);

    try {
      // Confirm the payment
      const result = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (result.error) {
        setError(result.error.message || "Payment failed");
        setProcessing(false);
        return;
      }

      // If payment is successful, create enrollment
      await enrollmentsAPI.completeEnrollment(
        courseId,
        result.paymentIntent.id
      );

      // Call the onEnrollmentComplete callback if provided
      onEnrollmentComplete?.();

      // Redirect to course page
      window.location.href = `/courses/${courseId}`;
    } catch (err) {
      setError("Failed to complete enrollment. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        <PaymentElement />
        {error && <div className="text-red-500 mt-2">{error}</div>}
        <button
          type="submit"
          disabled={!stripe || processing}
          className="w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {processing ? "Processing..." : "Pay and Enroll"}
        </button>
      </form>
    </div>
  );
};

const EnrollButton: React.FC<EnrollButtonProps> = ({
  courseId,
  price,
  onEnrollmentComplete,
}) => {
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [isEnrolled, setIsEnrolled] = useState(false);

  const handleEnrollClick = async () => {
    try {
      const response = (await enrollmentsAPI.createPaymentIntent(
        courseId
      )) as PaymentIntentResponse;
      setClientSecret(response.clientSecret);
      setShowPayment(true);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to initiate enrollment. Please try again.");
    }
  };

  if (isEnrolled) {
    return (
      <button
        disabled
        className="w-full bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        Enrolled
      </button>
    );
  }

  return (
    <div>
      {!showPayment ? (
        <button
          onClick={handleEnrollClick}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Enroll Now - ${price}
        </button>
      ) : (
        <div className="mt-4">
          {stripePromise && clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm
                courseId={courseId}
                onEnrollmentComplete={() => {
                  setIsEnrolled(true);
                  onEnrollmentComplete?.();
                }}
              />
            </Elements>
          )}
        </div>
      )}
    </div>
  );
};

export default EnrollButton;
