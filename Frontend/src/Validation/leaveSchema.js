import * as Yup from "yup";

export const leaveSchema = Yup.object().shape({
  leave_type: Yup.string().required("Leave type is required"),
  start_date: Yup.date()
    .required("Start date is required")
    .min(new Date(new Date().setHours(0, 0, 0, 0)), "Start date cannot be in the past"),
  end_date: Yup.date()
    .required("End date is required")
    .test(
      'is-after-start',
      'End date cannot be before start date',
      function(value) {
        const { start_date } = this.parent;
        if (!start_date || !value) return true;
        
        const start = new Date(start_date);
        start.setHours(0, 0, 0, 0);
        
        const end = new Date(value);
        end.setHours(0, 0, 0, 0);
        
        return end >= start;
      }
    ),
  reason: Yup.string()
    .required("Reason is required")
    .min(4, "Reason is too short")
});
