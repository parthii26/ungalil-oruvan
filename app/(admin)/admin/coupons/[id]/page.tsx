import { notFound } from "next/navigation";
import { getCouponById } from "@/lib/repositories/coupons";
import { CouponForm } from "../coupon-form";
import { deleteCouponAction } from "@/lib/actions/admin";

export const metadata = { title: "Edit Coupon" };

export default async function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const coupon = getCouponById(id);
  if (!coupon) notFound();
  return (
    <div>
      <h1 className="font-serif text-3xl md:text-4xl">Edit Coupon</h1>
      <CouponForm coupon={coupon} />
      <form
        action={async () => {
          "use server";
          await deleteCouponAction(coupon.id);
        }}
        className="mt-8"
      >
        <button
          type="submit"
          className="btn btn-ghost text-sm"
        >
          Delete coupon
        </button>
      </form>
    </div>
  );
}
