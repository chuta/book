import type { ComponentType, SVGProps } from "react";
import {
  ArrowTopRightOnSquareIcon,
  ArrowsRightLeftIcon,
  Bars3Icon,
  BoltIcon,
  BriefcaseIcon,
  BuildingLibraryIcon,
  BuildingOffice2Icon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ChatBubbleBottomCenterTextIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  CheckIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  EyeSlashIcon,
  GlobeAltIcon,
  LightBulbIcon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  MapIcon,
  MapPinIcon,
  RocketLaunchIcon,
  ScaleIcon,
  ShieldCheckIcon,
  SignalIcon,
  TagIcon,
  UserGroupIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type { LandingIconName } from "@/lib/icon-names";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export const LANDING_ICONS: Record<LandingIconName, IconComponent> = {
  envelope: EnvelopeIcon,
  "building-library": BuildingLibraryIcon,
  "clipboard-document": ClipboardDocumentListIcon,
  "arrows-right-left": ArrowsRightLeftIcon,
  "eye-slash": EyeSlashIcon,
  "globe-alt": GlobeAltIcon,
  "magnifying-glass": MagnifyingGlassIcon,
  "user-group": UserGroupIcon,
  "rocket-launch": RocketLaunchIcon,
  scale: ScaleIcon,
  briefcase: BriefcaseIcon,
  "building-office": BuildingOfficeIcon,
  "building-office-2": BuildingOffice2Icon,
  "document-text": DocumentTextIcon,
  "light-bulb": LightBulbIcon,
  "chart-bar": ChartBarIcon,
  signal: SignalIcon,
  tag: TagIcon,
  map: MapIcon,
  "list-bullet": ListBulletIcon,
  bolt: BoltIcon,
  "shield-check": ShieldCheckIcon,
  "chat-bubble-left-right": ChatBubbleLeftRightIcon,
  users: UsersIcon,
  check: CheckIcon,
  "arrow-top-right-on-square": ArrowTopRightOnSquareIcon,
  "bars-3": Bars3Icon,
  "x-mark": XMarkIcon,
  "calendar-days": CalendarDaysIcon,
  clock: ClockIcon,
  "map-pin": MapPinIcon,
  "check-circle": CheckCircleIcon,
  "chat-bubble-bottom-center-text": ChatBubbleBottomCenterTextIcon,
};

interface LandingIconProps {
  name: LandingIconName;
  className?: string;
}

export function LandingIcon({ name, className = "h-6 w-6" }: LandingIconProps) {
  const Icon = LANDING_ICONS[name];
  return <Icon className={className} aria-hidden />;
}
