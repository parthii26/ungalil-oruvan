import { CouponForm } from "../coupon-form";

export const metadata = { title: "New Coupon" };

export default function NewCouponPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl md:text-4xl">New Coupon</h1>
      <CouponForm />
    </div>
  );
}
