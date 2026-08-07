const STATUS_COLORS = {
  Active: "bg-green-100 text-green-700",

  Inactive: "bg-slate-100 text-slate-600",

  "On Leave": "bg-orange-100 text-orange-700",

  Pending: "bg-yellow-100 text-yellow-700",

  Completed: "bg-blue-100 text-blue-700",

  Draft: "bg-slate-100 text-slate-600",
};

const StatusBadge = ({ status }) => {
  return (
    <span
      className={`
        px-4
        py-1.5
        rounded-full
        text-sm
        font-semibold
        ${STATUS_COLORS[status] ||
        "bg-slate-100 text-slate-600"}
      `}
    >
      ● {status}
    </span>
  );
};

export default StatusBadge;