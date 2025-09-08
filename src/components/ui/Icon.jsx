import React from 'react';
import { 
  Home, 
  Package, 
  Users, 
  BarChart3, 
  FileText, 
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle,
  Info,
  X,
  Plus,
  Minus,
  Search,
  Filter,
  Settings,
  User,
  Calendar,
  Clock,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Menu,
  Bell,
  Star,
  Heart,
  Bookmark,
  Share2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Lock,
  Unlock,
  Shield,
  Zap
} from 'lucide-react';

// Icon mapping object for dynamic icon loading
const iconMap = {
  // Navigation
  home: Home,
  package: Package,
  users: Users,
  'bar-chart-3': BarChart3,
  'file-text': FileText,
  'shopping-cart': ShoppingCart,
  
  // Trends and Stats
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  'dollar-sign': DollarSign,
  activity: Activity,
  
  // Status
  'alert-circle': AlertCircle,
  'check-circle': CheckCircle,
  info: Info,
  
  // Actions
  x: X,
  plus: Plus,
  minus: Minus,
  search: Search,
  filter: Filter,
  settings: Settings,
  user: User,
  
  // Time
  calendar: Calendar,
  clock: Clock,
  
  // Content Actions
  eye: Eye,
  edit: Edit,
  'trash-2': Trash2,
  download: Download,
  upload: Upload,
  'refresh-cw': RefreshCw,
  
  // Navigation Arrows
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  'chevron-down': ChevronDown,
  
  // Interface
  menu: Menu,
  bell: Bell,
  star: Star,
  heart: Heart,
  bookmark: Bookmark,
  'share-2': Share2,
  
  // Communication
  mail: Mail,
  phone: Phone,
  'map-pin': MapPin,
  globe: Globe,
  
  // Security
  lock: Lock,
  unlock: Unlock,
  shield: Shield,
  zap: Zap
};

/**
 * Icon Component
 * 
 * A flexible icon component that dynamically renders Lucide React icons
 * 
 * @param {string} name - The name of the icon to render
 * @param {string} className - Additional CSS classes to apply
 * @param {number} size - Size of the icon (default: 24)
 * @param {string} color - Color of the icon (default: 'currentColor')
 * @param {object} ...props - Additional props to pass to the icon
 */
const Icon = ({ 
  name, 
  className = '', 
  size = 24, 
  color = 'currentColor',
  ...props 
}) => {
  // Get the icon component from the map
  const IconComponent = iconMap[name];
  
  // If icon doesn't exist, render a fallback
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found. Available icons:`, Object.keys(iconMap));
    return (
      <AlertCircle 
        size={size} 
        color={color} 
        className={`${className} text-gray-400`}
        title={`Unknown icon: ${name}`}
        {...props}
      />
    );
  }
  
  return (
    <IconComponent 
      size={size} 
      color={color} 
      className={className}
      {...props}
    />
  );
};

// Export both the component and the icon map for reference
export default Icon;
export { iconMap };