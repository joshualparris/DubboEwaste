import { canVisit, type ProgrammeContext } from "@/lib/programmes";

export type HelpLink = {
  href: string;
  label: string;
  description: string;
  keywords?: string;
  managerOnly?: boolean;
  globalAdminOnly?: boolean;
};
export type HelpSection = { title: string; description: string; links: HelpLink[] };

// Real routes used throughout AssetFlow. Keep this index in sync with the app when new sections are introduced.
export const HELP_SECTIONS: HelpSection[] = [
  { title: "Start here", description: "Find your bearings and switch between programmes.", links: [
    { href: "/dashboard", label: "Dashboard", description: "Overview of work, alerts and recent items", keywords: "home overview" },
    { href: "/search", label: "Search & barcode scan", description: "Look up assets, serials, jobs, lots and records", keywords: "find qr scanner" },
    { href: "/assets/new", label: "Receive an item", description: "Register a new asset or item", keywords: "intake new check in" },
    { href: "/programmes", label: "Switch programme", description: "Select the programme you are working in", keywords: "roles change" },
    { href: "/settings", label: "Settings", description: "Appearance and preferences", keywords: "dark mode light mode theme" },
    { href: "/help", label: "Help & keyboard shortcuts", description: "User guide, search tips and shortcuts", keywords: "support guide" },
  ] },
  { title: "IT asset operations", description: "Trace equipment from collection through processing.", links: [
    { href: "/jobs", label: "Jobs", description: "Inbound work and collections" },
    { href: "/lots", label: "Lots", description: "Group equipment and track batches" },
    { href: "/assets", label: "Assets", description: "View all registered devices", keywords: "inventory computers" },
    { href: "/triage", label: "Triage", description: "Inspect and classify devices", keywords: "testing condition" },
    { href: "/processing", label: "Processing", description: "Work through device processing", keywords: "workflow" },
    { href: "/media", label: "Sanitisation", description: "Manage storage media and data-clearing records", keywords: "wipe drive HDD SSD" },
    { href: "/repairs", label: "Repairs", description: "Track diagnostics, repair work and parts", keywords: "fix service" },
    { href: "/parts-workbench", label: "Parts workbench", description: "Reusable components and donor parts", keywords: "donors spare ram cpu psu" },
    { href: "/resale", label: "Resale", description: "Prepare eligible equipment for sale", keywords: "sales" },
    { href: "/recycling", label: "Recycling", description: "Track outbound recycling and disposal", keywords: "outbound waste" },
  ] },
  { title: "People & commercial", description: "Contacts, quotes and customer-related work.", links: [
    { href: "/customers", label: "Customers", description: "Customer profiles and contacts" },
    { href: "/crm", label: "CRM", description: "Leads and follow-up history", keywords: "sales" },
    { href: "/crm/opportunities", label: "Opportunities", description: "Sales and project pipeline", keywords: "deals" },
    { href: "/crm/quotes", label: "Quotes", description: "Create and manage quotes" },
    { href: "/settlements", label: "Settlements", description: "Financial reconciliation" },
  ] },
  { title: "Records & workshop", description: "Evidence, locations and physical inventory.", links: [
    { href: "/certificates", label: "Certificates", description: "Evidence and issued records" },
    { href: "/reports", label: "Reports", description: "Operations and outcome reporting" },
    { href: "/exceptions", label: "Exceptions", description: "Investigate blocked or unusual work", keywords: "risks issues" },
    { href: "/locations", label: "Locations", description: "Storage and site locations" },
    { href: "/workshop-inventory", label: "Workshop inventory", description: "Tools and workshop stock", keywords: "equipment" },
    { href: "/device-library", label: "Device library", description: "Known devices and model references" },
    { href: "/model-lookup", label: "Model lookup", description: "Look up device information", keywords: "autofill" },
    { href: "/documents", label: "Documents", description: "Reference and operational files" },
  ] },
  { title: "Repair Café", description: "Events, visitors and volunteer coordination.", links: [
    { href: "/repair-cafe-volunteers", label: "Volunteer hub", description: "Your Repair Café home", keywords: "repair cafe" },
    { href: "/repair-cafe-volunteers/sessions", label: "Sessions & rosters", description: "Upcoming sessions and volunteer shifts", keywords: "calendar events" },
    { href: "/repair-cafe-volunteers/event-desk", label: "Event Desk", description: "Check in visitors, manage the repair queue", keywords: "tickets registration" },
    { href: "/repair-cafe-volunteers/stations", label: "Stations", description: "Allocate repairers and capacity", managerOnly: true },
    { href: "/repair-cafe-volunteers/knowledge", label: "Repair knowledge", description: "Repair advice and lessons", keywords: "wiki" },
    { href: "/repair-cafe-volunteers/referrals", label: "Local repairer referrals", description: "Refer specialised repairs to local professionals" },
    { href: "/repair-cafe-volunteers/contacts", label: "Insurance correspondence CRM", description: "Australian Repair Café contacts and replies", managerOnly: true, keywords: "outreach insurance contacts" },
    { href: "/repair-cafe-volunteers/operations", label: "Operations & safety", description: "Venue notes, incidents and records", managerOnly: true },
    { href: "/repair-cafe-volunteers/compliance", label: "Compliance & risk", description: "Safety register and action tracking", managerOnly: true },
    { href: "/repair-cafe-volunteers/preflight", label: "Event safety preflight", description: "Check readiness before each event", managerOnly: true },
    { href: "/repair-cafe-volunteers/people", label: "Volunteer directory", description: "Manage volunteer records", managerOnly: true },
    { href: "/repair-cafe-volunteers/reports", label: "Repair Café reports", description: "Session outcomes and measures", managerOnly: true },
  ] },
  { title: "Learning, lending & research", description: "Training, borrowing and evidence.", links: [
    { href: "/learn", label: "Learning hub", description: "Courses and guided skills development" },
    { href: "/learn/manage", label: "Learning supervisor", description: "Manage learning and assessments", managerOnly: true },
    { href: "/lending", label: "Loans & returns", description: "Library of Things circulation", keywords: "borrow" },
    { href: "/projects", label: "Project network", description: "Connected community projects" },
    { href: "/validation", label: "Field validation", description: "Research evidence and outstanding questions" },
    { href: "/dubbo-repair-ewaste", label: "Dubbo repair guide", description: "Regional repair information" },
    { href: "/dubbo-circular-economy", label: "Circular economy", description: "Local resource recovery reference" },
    { href: "/regional-computer-experts", label: "Regional experts", description: "Repair and refurbishment contacts" },
  ] },
  { title: "Administration", description: "Only for authorised administrators.", links: [
    { href: "/admin/data", label: "Manage data", description: "Administrative data tools", globalAdminOnly: true },
    { href: "/admin/permissions", label: "Permissions", description: "Account access and controls", globalAdminOnly: true },
    { href: "/admin/analytics", label: "Site analytics", description: "Usage monitoring", globalAdminOnly: true },
    { href: "/admin/programmes", label: "Programme memberships", description: "Programme roles and assignments", managerOnly: true },
  ] },
];

export type HelpContext = Pick<ProgrammeContext, "selected" | "global_admin" | "role">;
export function visibleHelpSections(context: HelpContext): HelpSection[] {
  return HELP_SECTIONS.map(section => ({
    ...section,
    links: section.links.filter(link => {
      if (link.globalAdminOnly && !context.global_admin) return false;
      if (link.managerOnly && !context.global_admin && !["admin", "manager"].includes(context.role || "")) return false;
      return canVisit(link.href, context.selected, context.global_admin, context.role);
    }),
  })).filter(section => section.links.length > 0);
}

// G followed by a letter. Never activate these while a form control or editor has focus.
export const GO_SHORTCUTS = [
  { key: "d", href: "/dashboard", label: "Dashboard" },
  { key: "s", href: "/search", label: "Search / scan" },
  { key: "a", href: "/assets", label: "Assets" },
  { key: "n", href: "/assets/new", label: "Receive item" },
  { key: "j", href: "/jobs", label: "Jobs" },
  { key: "m", href: "/media", label: "Sanitisation" },
  { key: "c", href: "/crm", label: "CRM" },
  { key: "r", href: "/repairs", label: "Repairs" },
  { key: "v", href: "/repair-cafe-volunteers", label: "Repair Café hub" },
  { key: "e", href: "/repair-cafe-volunteers/event-desk", label: "Event Desk" },
  { key: "l", href: "/lending", label: "Loans & returns" },
  { key: "p", href: "/programmes", label: "Switch programme" },
  { key: "h", href: "/help", label: "Help" },
] as const;
