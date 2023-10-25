// assets
import { DashboardOutlined, UserOutlined, UnorderedListOutlined, MessageOutlined, WifiOutlined, InfoCircleOutlined,LogoutOutlined} from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  UserOutlined,
  UnorderedListOutlined,
  MessageOutlined,
  WifiOutlined,
  InfoCircleOutlined,
  LogoutOutlined
};
// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Menu Item',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'subscriber',
      title: 'Subscriber',
      type: 'item',
      url: '/subscriber',
      icon: icons.UserOutlined,
      breadcrumbs: false
    },
    {
      id: 'bill',
      title: 'Bill',
      type: 'item',
      url: '/bill',
      icon: icons.UnorderedListOutlined,
      breadcrumbs: false
    },
    {
      id: 'plan',
      title: 'Plan',
      type: 'item',
      url: '/plan',
      icon: icons.WifiOutlined, 
      breadcrumbs: false
    },
    {
      id: 'support',
      title: 'Customer Support',
      type: 'item',
      url: '/support',
      icon: icons.MessageOutlined,
      breadcrumbs: false
    },
    {
      id: 'information',
      title: 'Payment Information',
      type: 'item',
      url: '/information',
      icon: icons.InfoCircleOutlined, 
      breadcrumbs: false
    },
    {
      id: 'logout',
      title: 'Logout',
      type: 'item',
      url: '/logout',
      icon: icons.LogoutOutlined,
      breadcrumbs: false
    },
  ]
};

export default dashboard;
