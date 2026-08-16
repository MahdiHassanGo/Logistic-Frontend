import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Circle, Clock, Truck, MapPin, User, Package } from "lucide-react";
import { useAppData } from "../../../context/AppDataContext";

const STATUS_ORDER = ["PENDING", "ASSIGNED", "IN_TRANSIT", "DELIVERED"];

const statusLabels = {
  PENDING: "অপেক্ষমাণ",
  ASSIGNED: "ড্রাইভার নিযুক্ত",
  IN_TRANSIT: "পথে আছে",
  DELIVERED: "ডেলিভারি সম্পন্ন",
};

const statusIcons = {
  PENDING: Clock,
  ASSIGNED: User,
  IN_TRANSIT: Truck,
  DELIVERED: CheckCircle2,
};

export default function DeliveryDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deliveries, setDeliveries } = useAppData();

  const delivery = deliveries.find(d => d.id === id);
  if (!delivery) {
    return (
      <div className="erp-card" style={{ maxWidth: 480, margin: "4rem auto", textAlign: "center" }}>
        <p style={{ color: "var(--text-muted)" }}>ডেলিভারি পাওয়া যায়নি।</p>
      </div>
    );
  }

  const updateStatus = (newStatus) => {
    setDeliveries(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
  };

  const currentStatusIdx = STATUS_ORDER.indexOf(delivery.status);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__info">
          <h2>ডেলিভারি বিস্তারিত</h2>
          <p style={{ fontFamily: "monospace", fontSize: "0.9375rem", color: "var(--primary)" }}>{delivery.id}</p>
        </div>
        <div className="page-header__actions">
          <button className="btn btn-outline" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> ফিরে যান
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
        {/* Delivery Info */}
        <div className="section-card">
          <div className="section-card__header">
            <h3 className="section-card__title">ডেলিভারির তথ্য</h3>
          </div>
          <div className="section-card__body">
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <div style={{ width: 36, height: 36, background: "var(--primary-light)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <MapPin size={18} color="var(--primary)" />
                </div>
                <div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "2px" }}>গন্তব্য</div>
                  <div style={{ fontWeight: 600 }}>{delivery.destination}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <div style={{ width: 36, height: 36, background: "#f0f9ff", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <User size={18} color="var(--info)" />
                </div>
                <div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "2px" }}>ড্রাইভার</div>
                  <div style={{ fontWeight: 600 }}>{delivery.driverName || "নিযুক্ত হয়নি"}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <div style={{ width: 36, height: 36, background: "#fff7ed", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Truck size={18} color="#ea580c" />
                </div>
                <div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "2px" }}>গাড়ি</div>
                  <div style={{ fontWeight: 600 }}>{delivery.vehicleReg || "নিযুক্ত হয়নি"}</div>
                </div>
              </div>
              {delivery.notes && (
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <div style={{ width: 36, height: 36, background: "var(--surface-soft)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Package size={18} color="var(--text-muted)" />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "2px" }}>নোট</div>
                    <div>{delivery.notes}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="section-card">
          <div className="section-card__header">
            <h3 className="section-card__title">ডেলিভারি স্ট্যাটাস</h3>
          </div>
          <div className="delivery-timeline">
            {STATUS_ORDER.map((status, idx) => {
              const isDone = idx < currentStatusIdx;
              const isActive = idx === currentStatusIdx;
              const IconComp = statusIcons[status];
              return (
                <div key={status} className={`timeline-step${isDone ? " timeline-step--done" : ""}${isActive ? " timeline-step--active" : ""}`}>
                  <div className="timeline-step__dot">
                    {isDone ? <CheckCircle2 size={16} /> : <IconComp size={14} />}
                  </div>
                  <div className="timeline-step__body">
                    <div className="timeline-step__label">{statusLabels[status]}</div>
                    {isActive && (
                      <div className="timeline-step__sub">বর্তমান অবস্থান</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Status Update Actions */}
      <div className="section-card">
        <div className="section-card__header">
          <h3 className="section-card__title">স্ট্যাটাস আপডেট করুন</h3>
        </div>
        <div className="section-card__body" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            className="btn btn-outline"
            disabled={delivery.status === "ASSIGNED"}
            onClick={() => updateStatus("ASSIGNED")}
          >
            <User size={16} /> নিযুক্ত করুন
          </button>
          <button
            className="btn btn-outline"
            style={{ color: "var(--info)", borderColor: "var(--info)" }}
            disabled={delivery.status === "IN_TRANSIT"}
            onClick={() => updateStatus("IN_TRANSIT")}
          >
            <Truck size={16} /> যাত্রা শুরু
          </button>
          <button
            className="btn btn-success"
            disabled={delivery.status === "DELIVERED"}
            onClick={() => updateStatus("DELIVERED")}
          >
            <CheckCircle2 size={16} /> ডেলিভারি নিশ্চিত করুন
          </button>
        </div>
      </div>
    </div>
  );
}
