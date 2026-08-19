const Leave = require("../models/leaveModel");

const LEAVE_QUOTAS = {
  "Sick Leave": 1,
  "Casual Leave": 1
};

const getMyLeaves = async (req, res) => {
  try {
    const user_id = req.user.id;
    const leaves = await Leave.getLeavesByUser(user_id);
    
    // Calculate balances strictly for the current month
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    const leavesThisMonth = leaves.filter(l => 
        l.status !== 'Rejected' && 
        new Date(l.start_date).getMonth() + 1 === currentMonth &&
        new Date(l.start_date).getFullYear() === currentYear
    );
    
    const usedSickThisMonth = leavesThisMonth.filter(l => l.leave_type === "Sick Leave").length;
    const usedCasualThisMonth = leavesThisMonth.filter(l => l.leave_type === "Casual Leave").length;
    
    const sickBalance = LEAVE_QUOTAS["Sick Leave"] - usedSickThisMonth;
    const casualBalance = LEAVE_QUOTAS["Casual Leave"] - usedCasualThisMonth;

    res.status(200).json({
      leaves,
      balances: {
        "Sick Leave": sickBalance > 0 ? sickBalance : 0,
        "Casual Leave": casualBalance > 0 ? casualBalance : 0
      }
    });
  } catch (error) {
    console.error("Error fetching leaves:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const applyForLeave = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { leave_type, start_date, end_date, reason } = req.body;

    if (!leave_type || !start_date || !end_date || !reason) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Calculate monthly accrued leaves (strictly per month)
    if (LEAVE_QUOTAS[leave_type] !== undefined) {
      const monthlyQuota = LEAVE_QUOTAS[leave_type];
      
      const userLeaves = await Leave.getLeavesByUser(user_id);
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      
      const usedThisMonth = userLeaves.filter(l => 
          l.leave_type === leave_type &&
          l.status !== 'Rejected' && 
          new Date(l.start_date).getMonth() + 1 === currentMonth &&
          new Date(l.start_date).getFullYear() === currentYear
      ).length;

      var isOverQuota = false;
      if (usedThisMonth >= monthlyQuota) {
        if (leave_type === 'Casual Leave') {
          return res.status(400).json({ 
            message: `Monthly leave limit reached. You get ${monthlyQuota} ${leave_type} per month and already used ${usedThisMonth} this month.` 
          });
        }
        isOverQuota = true;
      }
    }

    // Auto-approve sick leave ONLY if it's for 1 day, else pending
    let initialStatus = 'Pending';
    if (leave_type === 'Sick Leave') {
      const start = new Date(start_date);
      const end = new Date(end_date);
      const durationDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;
      
      if (durationDays === 1 && !isOverQuota) {
        initialStatus = 'Approved';
        
        // Check if applying for the same day
        const now = new Date();
        const [year, month, day] = start_date.split('-');
        const isSameDay = now.getFullYear() === parseInt(year) && 
                          (now.getMonth() + 1) === parseInt(month) && 
                          now.getDate() === parseInt(day);
                          
        if (isSameDay) {
          const currentHour = now.getHours();
          const currentMinute = now.getMinutes();
          // Working hours: 9:30 AM to 4:20 PM (16:20)
          const isWorkingHours = (currentHour > 9 || (currentHour === 9 && currentMinute >= 30)) && 
                                 (currentHour < 16 || (currentHour === 16 && currentMinute <= 20));
          if (isWorkingHours) {
            initialStatus = 'Pending'; // Needs approval if sudden leave during working hours
          }
        }
      } else {
        initialStatus = 'Pending'; // > 1 day always needs approval
      }
    }

    const newLeave = await Leave.applyLeave(user_id, leave_type, start_date, end_date, reason, initialStatus);
    res.status(201).json({ message: "Leave applied successfully", leave: newLeave });
  } catch (error) {
    console.error("Error applying for leave:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteMyLeave = async (req, res) => {
  try {
    const user_id = req.user.id;
    const leave_id = req.params.id;
    
    const leaves = await Leave.getLeavesByUser(user_id);
    const targetLeave = leaves.find(l => l.leave_id === leave_id);
    
    if (!targetLeave) {
      return res.status(404).json({ message: "Leave not found or unauthorized to delete" });
    }
    
    if (targetLeave.status === 'Approved') {
      return res.status(403).json({ message: "Approved leaves cannot be deleted." });
    }
    
    const deletedLeave = await Leave.deleteLeave(leave_id, user_id);
    
    res.status(200).json({ message: "Leave deleted successfully", leave: deletedLeave });
  } catch (error) {
    console.error("Error deleting leave:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// --- ADMIN CONTROLLERS ---

const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.getAllLeaves();
    res.status(200).json(leaves);
  } catch (error) {
    console.error("Error fetching all leaves:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status provided" });
    }

    const updatedLeave = await Leave.updateLeaveStatus(id, status);
    
    if (!updatedLeave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    res.status(200).json({ message: "Leave status updated successfully", leave: updatedLeave });
  } catch (error) {
    console.error("Error updating leave status:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getMyLeaves,
  applyForLeave,
  deleteMyLeave,
  getAllLeaves,
  updateLeaveStatus
};
