import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import ModalHeader from "./ModalHeader";
import InfoSection from "./InfoSection";
import SectionTable from "./SectionTable";

const DetailsModal = ({ isOpen, onClose, config, data }) => {
  if (!isOpen || !config || !data) return null;

  const { header, sections } = config;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col" 
          initial={{ opacity: 0, scale: 0.95, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 25 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-10 w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center"
          >
            <X size={18} className="text-slate-600" />
          </button>

          <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-b from-indigo-50 to-white">
            {/* Profile Header */}
            {header && (
              <ModalHeader
                title={header?.title ? header.title(data) : "Details"}
                subtitle={header?.subtitle ? header.subtitle(data) : undefined}
                badge={header?.badge ? header.badge(data) : undefined}
                status={header?.status ? header.status(data) : undefined}
                avatarText={header?.avatarText ? header.avatarText(data) : undefined}
              />
            )}

            {/* Body Sections */}
            {(sections || []).map((section, idx) => {
              if (section.type === "table") {
                return (
                  <SectionTable
                    key={idx}
                    title={section.title}
                    columns={section.columns}
                    data={section.data ? section.data(data) : []}
                  />
                );
              }
              return (
                <InfoSection
                  key={idx}
                  title={section.title}
                  fields={section.fields ? section.fields(data) : []}
                />
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DetailsModal;
