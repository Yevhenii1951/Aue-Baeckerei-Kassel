import { AdminOrder } from "./demoDashboard";
import { OrderCard } from "./OrderCard";

export function OrderList({
  orders,
}: {
  orders: AdminOrder[];
}): React.ReactElement {
  return (
    <section id="bestellungen" className="rounded-lg border border-brand-deep/10 bg-paper p-5 shadow-card">
      <h2 className="text-lg font-semibold text-brand-deep">
        Bestellungen
      </h2>
      <p className="text-sm text-ink/60 mb-4">
        {orders.length} {orders.length === 1 ? "Bestellung" : "Bestellungen"}
      </p>
      <ul className="mt-4 grid gap-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </ul>
    </section>
  );
}
