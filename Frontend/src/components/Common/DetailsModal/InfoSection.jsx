import React from "react";
import InfoCard from "./InfoCard";

const InfoSection = ({ title, fields = [] }) => {
  if (fields.length === 0) return null;

  return (
    <div className="mt-10">
      <h3 className="text-lg font-bold text-slate-900 mb-5">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {fields.map((field, index) => (
          <InfoCard
            key={index}
            label={field.label}
            value={field.value}
            icon={field.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default InfoSection;
