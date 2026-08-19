import * as Yup from "yup";

export const leaveSchema = Yup.object().shape({
  leave_type: Yup.string().required("Leave type is required"),
  start_date: Yup.date()
    .required("Start date is required")
    .min(new Date(new Date().setHours(0, 0, 0, 0)), "Start date cannot be in the past"),
  end_date: Yup.date()
    .required("End date is required")
    .min(Yup.ref('start_date'), "End date cannot be before start date"),
  reason: Yup.string()
    .required("Reason is required")
    .min(4, "Reason is too short")
});
