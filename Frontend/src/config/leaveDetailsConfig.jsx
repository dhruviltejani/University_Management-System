import React from 'react';
import {
  Calendar,
  Clock,
  User,
  Mail,
  MessageSquare,
  FileText,
  CalendarCheck2,
  Phone,
  BookOpen,
  Building2,
  GraduationCap
} from "lucide-react";

export const leaveDetailsConfig = {
  header: {
    title: (data) => data.full_name,
    subtitle: (data) => data.subjects || data.role,
    badge: (data) => data.leave_type,
    status: (data) => data.status || "Pending",
    avatarText: (data) => data.full_name,
  },
  sections: [
    {
      title: "Leave Information",
      fields: (data) => {
        const start = new Date(data.start_date);
        const end = new Date(data.end_date);
        const days = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;
        
        return [
          { label: "Leave Type", value: data.leave_type, icon: <FileText size={18} /> },
          { label: "Date Range", value: `${start.toLocaleDateString()} to ${end.toLocaleDateString()}`, icon: <Calendar size={18} /> },
          { label: "Duration", value: `${days} day(s)`, icon: <Clock size={18} /> },
          { label: "Applied On", value: new Date(data.applied_at).toLocaleDateString(), icon: <CalendarCheck2 size={18} /> },
        ];
      },
    },
    {
      title: "Applicant Information",
      fields: (data) => [
        { label: "Full Name", value: data.full_name, icon: <User size={18} /> },
        { label: "Email", value: data.email, icon: <Mail size={18} /> },
        { label: "Phone", value: data.contact_no || "N/A", icon: <Phone size={18} /> },
        { label: "Department", value: data.department_name || "N/A", icon: <Building2 size={18} /> },
        { label: "Course", value: data.courses || "N/A", icon: <GraduationCap size={18} /> },
        { label: "Subject(s)", value: data.subjects || "N/A", icon: <BookOpen size={18} /> },
      ],
    },
    {
      title: "Reason for Leave",
      fields: (data) => [
        { label: "Reason", value: data.reason, icon: <MessageSquare size={18} /> },
      ],
    },
  ],
};
