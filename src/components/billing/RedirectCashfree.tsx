import { load } from "@cashfreepayments/cashfree-js";
import type { Cashfree } from "@cashfreepayments/cashfree-js";

function Checkout() {
  let cashfree: Cashfree | null = null;
  const initializeSDK = async () => {
    cashfree = await load({
      mode: "production",
    });
  };
  void initializeSDK();

  const doPayment = async () => {
    const checkoutOptions: Parameters<Cashfree["checkout"]>[0] = {
      paymentSessionId: "your-payment-session-id",
      redirectTarget: "_self",
    };
    if (cashfree) {
      await cashfree.checkout(checkoutOptions);
    }
  };

  return (
    <div className="row">
      <p>Click below to open the checkout page in current tab</p>
      <button type="submit" className="btn btn-primary" id="renderBtn" onClick={doPayment}>
        Pay Now
      </button>
    </div>
  );
}
export default Checkout;