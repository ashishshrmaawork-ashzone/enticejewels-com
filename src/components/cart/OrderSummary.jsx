export function formatPrice(value) {
  return `₹${value.toLocaleString("en-IN")}.00`;
}

export default function OrderSummary({ onCallingRequest }) {
  return (
    <aside className="bg-cream rounded-2xl p-5 sm:p-6 md:p-8 h-fit lg:sticky lg:top-32">
      <h2 className="font-heading text-maroon text-xl sm:text-2xl lg:text-xl mb-6">Order Summary</h2>
      <p className="text-ink-soft text-xs leading-relaxed mb-6">
        Online purchase isn&rsquo;t available yet — submit a Calling Request and our
        team will help you complete your order.
      </p>
      <button
        type="button"
        onClick={onCallingRequest}
        className="w-full py-3 rounded text-xs uppercase tracking-[2px] font-semibold transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#553632", color: "#FFF1C1" }}
      >
        Calling Request
      </button>
    </aside>
  );
}
