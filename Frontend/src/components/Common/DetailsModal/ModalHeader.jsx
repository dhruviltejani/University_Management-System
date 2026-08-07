import Avatar from "./Avatar";
import StatusBadge from "./StatusBadge";

const ModalHeader = ({
  title,
  subtitle,
  badge,
  status,
  avatarText,
}) => {
  return (
    <div className="flex flex-col items-center text-center">

      <Avatar text={avatarText} />

      <h2 className="mt-5 text-2xl font-bold text-slate-900">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-1 text-slate-500">
          {subtitle}
        </p>
      )}

      <div className="flex items-center gap-3 mt-5">

        {badge && (
          <span className="px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold">
            {badge}
          </span>
        )}

        {status && (
          <StatusBadge status={status} />
        )}

      </div>

    </div>
  );
};

export default ModalHeader;