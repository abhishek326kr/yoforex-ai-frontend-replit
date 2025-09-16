import { load } from "@cashfreepayments/cashfree-js";
import type { Cashfree } from "@cashfreepayments/cashfree-js";
import { CASHFREE_MODE } from "@/config/payments";

function Checkout() {
  let cashfree: Cashfree | null = null;
  const initializeSDK = async () => {
    cashfree = await load({
      mode: CASHFREE_MODE,
    });
  };
  void initializeSDK();

  const doPayment = async () => {
    const checkoutOptions: Parameters<Cashfree["checkout"]>[0] = {
      paymentSessionId: "your-payment-session-id",
      redirectTarget: "_modal",
    };
    if (cashfree) {
      await cashfree.checkout(checkoutOptions);
    } else {
      console.warn("Cashfree SDK not initialized yet. Please try again in a moment.");
    }
  };

  return (
    <div className="row">
      <p>Click below to open the checkout page in popup</p>
      <button type="submit" className="btn btn-primary" id="renderBtn" onClick={doPayment}>
        Pay Now
      </button>
    </div>
  );
}
export default Checkout;