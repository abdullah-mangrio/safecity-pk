export const CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Peshawar",
  "Quetta",
  "Multan",
  "Faisalabad",
]

export const CRIME_TYPES = [
  "Street Robbery",
  "Vehicle Theft",
  "Burglary",
  "Assault",
  "Suspicious Activity",
  "Cybercrime",
  "Drug Activity",
  "Security Threat",
]

export const mockHotspots = [
  { id: 1, area: "Saddar", city: "Karachi", riskLevel: "critical", incidents: 47, trend: "increasing", top: "28%", left: "32%" },
  { id: 2, area: "Hayatabad", city: "Peshawar", riskLevel: "critical", incidents: 41, trend: "increasing", top: "58%", left: "68%" },
  { id: 3, area: "Gulberg", city: "Lahore", riskLevel: "high", incidents: 32, trend: "stable", top: "42%", left: "52%" },
  { id: 4, area: "Satellite Town", city: "Rawalpindi", riskLevel: "high", incidents: 28, trend: "decreasing", top: "72%", left: "26%" },
  { id: 5, area: "F-7", city: "Islamabad", riskLevel: "medium", incidents: 15, trend: "stable", top: "35%", left: "78%" },
  { id: 6, area: "DHA", city: "Lahore", riskLevel: "low", incidents: 8, trend: "decreasing", top: "78%", left: "48%" },
]

export const mockCrimes = [
  { id: 1, type: "Street Robbery", city: "Karachi", area: "Saddar", severity: "high", status: "open", date: "2026-04-21" },
  { id: 2, type: "Vehicle Theft", city: "Lahore", area: "Gulberg", severity: "medium", status: "under_investigation", date: "2026-04-20" },
  { id: 3, type: "Burglary", city: "Islamabad", area: "F-7", severity: "high", status: "resolved", date: "2026-04-19" },
  { id: 4, type: "Assault", city: "Rawalpindi", area: "Satellite Town", severity: "critical", status: "open", date: "2026-04-18" },
  { id: 5, type: "Drug Activity", city: "Peshawar", area: "Hayatabad", severity: "critical", status: "under_investigation", date: "2026-04-17" },
  { id: 6, type: "Cybercrime", city: "Islamabad", area: "G-9", severity: "medium", status: "open", date: "2026-04-16" },
]

export const mockPublicReports = [
  { id: 1, title: "Suspicious activity near school", type: "Suspicious Activity", area: "Model Town", city: "Lahore", status: "pending", priority: "high", submittedAt: "2026-04-22 14:32" },
  { id: 2, title: "Phone snatching near market", type: "Street Robbery", area: "Saddar", city: "Karachi", status: "verified", priority: "medium", submittedAt: "2026-04-22 11:15" },
  { id: 3, title: "Abandoned bag near bus stop", type: "Security Threat", area: "G-9", city: "Islamabad", status: "pending", priority: "critical", submittedAt: "2026-04-21 16:00" },
]

export const mockAlerts = [
  {
    id: 1,
    title: "High Alert: Street Robbery Spike",
    message: "Citizens in Saddar Karachi are advised to avoid isolated streets after 9 PM.",
    severity: "critical",
    city: "Karachi",
    issuedBy: "Karachi Police",
    issuedAt: "2026-04-22 10:00",
  },
  {
    id: 2,
    title: "Traffic and Safety Advisory",
    message: "Extra security deployment around major commercial areas this week.",
    severity: "medium",
    city: "Lahore",
    issuedBy: "Punjab Police",
    issuedAt: "2026-04-21 09:30",
  },
]

export const mockNotices = [
  {
    id: 1,
    title: "Community Safety Meeting",
    content: "Residents are invited to attend a safety meeting with local police representatives.",
    category: "Event",
    city: "Islamabad",
    postedBy: "Islamabad Capital Police",
    postedAt: "2026-04-22",
  },
  {
    id: 2,
    title: "New Emergency Helpline Awareness",
    content: "Citizens are reminded to call Police 15 in case of emergency.",
    category: "Announcement",
    city: "All Cities",
    postedBy: "National Police Bureau",
    postedAt: "2026-04-20",
  },
]

export const mockMyReports = [
  { id: 1, trackingId: "SC-2026-10041", title: "Suspicious vehicle parked for days", type: "Suspicious Activity", area: "Near my home", status: "verified", submittedAt: "2026-04-18" },
  { id: 2, trackingId: "SC-2026-10042", title: "Phone snatching near bus stop", type: "Street Robbery", area: "Saddar", status: "under_investigation", submittedAt: "2026-04-16" },
]

export const mockPendingDepartments = [
  { id: 1, officerName: "DSP Farhan Siddiqui", department: "Karachi Central Police", badgeId: "KCP-0891", email: "farhan@kcp.gov.pk", city: "Karachi", status: "pending" },
  { id: 2, officerName: "Inspector Aisha Nawaz", department: "Punjab Police", badgeId: "PP-0342", email: "aisha@punjabpolice.gov.pk", city: "Lahore", status: "pending" },
]

export const mockUsers = [
  { id: 1, name: "Ali Hassan", email: "ali@example.com", role: "citizen", city: "Karachi", status: "active" },
  { id: 2, name: "DSP Farhan Siddiqui", email: "farhan@kcp.gov.pk", role: "security", city: "Karachi", status: "approved" },
  { id: 3, name: "System Admin", email: "admin@safecity.pk", role: "admin", city: "All", status: "active" },
]

export const mockPlatformStats = {
  totalUsers: 4827,
  activeCitizens: 4401,
  securityOfficers: 412,
  pendingApprovals: 14,
  totalReports: 3291,
  openCases: 872,
  alertsIssued: 311,
}

export const SAFETY_TIPS = [
  "Avoid isolated areas at night and stay in well-lit public places.",
  "Keep emergency numbers saved: Police 15 and Rescue 1122.",
  "Report suspicious activity immediately through SafeCity PK.",
  "Do not share personal information with unknown callers.",
  "Keep valuables hidden while travelling in public transport.",
]
