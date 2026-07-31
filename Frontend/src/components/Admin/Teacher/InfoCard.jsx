const InfoCard = ({ label, value }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all duration-200 hover:bg-white hover:shadow-md">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-slate-800 break-words">
        {value || "-"}
      </p>
    </div>
  );
};

export default InfoCard;